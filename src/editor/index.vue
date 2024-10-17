<template>
  <div>
    <el-carousel :interval="1500" type="card" height="200px" ref="carouselRef" :autoplay="autoplay">
      <el-carousel-item v-for="item in 6" :key="item">
        <div @mouseenter="enter" @mouseleave="leave" style="width: 100%; height: 100%" class="medium">{{ item }}</div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { editor } from './v2/index';
import { nextTick, onMounted, ref } from 'vue';

console.log('editor', editor);
const carouselRef = ref(null);
const autoplay = ref(false);
const enter = () => carouselRef.value.startTimer();
const leave = () => carouselRef.value.pauseTimer();
onMounted(() => {
  nextTick(() => {
    const that = carouselRef.value;
    carouselRef.value.handleMouseLeave = () => {};
    carouselRef.value.handleMouseEnter = () => {};
    let isStart = true;
    carouselRef.value.startTimer = () => {
      if (isStart) {
        isStart = false;
        return;
      }
      if (that.interval <= 0 || that.timer) return;
      that.timer = setInterval(that.playSlides, that.interval);
    };
    carouselRef.value.$children.forEach((item) => {
      const that = item;
      const CARD_SCALE = 0.1;
      item.translateItem = (index, activeIndex, oldIndex) => {
        const parentType = that.$parent.type;
        const parentDirection = that.parentDirection;
        const length = that.$parent.items.length;
        if (parentType !== 'card' && oldIndex !== undefined) {
          that.animating = index === activeIndex || index === oldIndex;
        }
        if (index !== activeIndex && length > 2 && that.$parent.loop) {
          index = that.processIndex(index, activeIndex, length);
        }
        if (parentType === 'card') {
          if (parentDirection === 'vertical') {
            console.warn('[Element Warn][Carousel]vertical direction is not supported in card mode');
          }
          that.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
          that.active = index === activeIndex;
          that.translate = that.calcCardTranslate(index, activeIndex);
          that.scale = that.active ? 1 : CARD_SCALE;
        } else {
          that.active = index === activeIndex;
          const isVertical = parentDirection === 'vertical';
          that.translate = that.calcTranslate(index, activeIndex, isVertical);
          that.scale = 1;
        }
        that.ready = true;
      };
    });
  });
});
</script>

<style scoped lang="less">
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.workspace {
  width: 800px;
  height: 800px;
  border: 1px solid;
  position: relative;
}

.box-wrap {
  display: flex;
  align-items: center;
}

.box {
  border: 1px solid #e1e1e1;
  padding: 4px 8px;

  &:hover {
    cursor: pointer;
    border-color: darkred;
    color: darkred;
  }
}

.active {
  border-color: darkred;
}
</style>
