<template>
  <div ref="containerRef">
    <slot></slot>
    <Teleport to="body">
      <Transition @beforeEnter="handleBeforeEnter" @enter="handleEnter" @afterEnter="handleAfterEnter">
        <div v-if="showMenu" class="context-menu" :style="{ left: x + 'px', top: y + 'px' }">
          <div class="menu-list">
            <!-- 添加菜单的点击事件 -->
            <div
              @mousedown.stop="handleClick(item)"
              @mouseenter="mouseenter(item)"
              @mouseleave="mouseleave(item)"
              class="menu-item"
              v-for="(item, i) in menu"
              :key="item.label"
              :style="item.style || {}"
            >
              <span :style="item.labelStyle || {}">{{ item.label }}</span>
              <span v-if="item.children" class="icon el-icon-arrow-right"></span>
              <!--子菜单-->
              <div class="menu-list child-menu-item" v-if="item === hoverItem && item.children">
                <div @mousedown="handleClick(child)" class="menu-item" v-for="(child, i) in item.children" :key="child.label" :style="child.style || {}">
                  <span>{{ child.label }}</span>
                  <span v-if="child.children" class="icon el-icon-arrow-right"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import Teleport from 'teleport-vue2';
import { ref } from 'vue';
import useContextMenu from './useContextMenu';
import { editor } from '../../index';
import { useVModels } from '@vueuse/core';

// console.log('contextMenu', editor);
// const props = defineProps({
//   menu: {
//     type: Array,
//     default: () => [],
//   },
// });
// const { menu } = useVModels(props);
const containerRef = ref(null);
const emit = defineEmits(['select']);
const { x, y, showMenu, menu } = editor.contextMenu.init(containerRef);
// const { x, y, showMenu } = useContextMenu(containerRef);
// 菜单的点击事件
function handleClick(item) {
  // 选中菜单后关闭菜单
  showMenu.value = false;
  // 并返回选中的菜单
  emit('select', item);
  item?.fn();
}

// 鼠标经过
const hoverItem = ref(null);
function mouseenter(item) {
  hoverItem.value = item;
}
function mouseleave(item) {
  hoverItem.value = null;
}

function handleBeforeEnter(el) {
  el.style.height = 0;
}

function handleEnter(el) {
  el.style.height = 'auto';
  const h = el.clientHeight;
  el.style.height = 0;
  requestAnimationFrame(() => {
    el.style.height = h + 'px';
    el.style.transition = '.1s';
  });
}

function handleAfterEnter(el) {
  el.style.transition = 'none';
}
</script>

<style lang="less" scoped>
.context-menu {
  position: fixed;
  background: #fff;
  box-shadow:
    0 9px 28px 8px rgba(0, 0, 0, 0.05),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 5px;
  min-width: 200px;
  padding: 10px 0;
  .menu-list {
    .menu-item {
      padding: 4px 8px;
      white-space: nowrap;
      cursor: pointer;
      position: relative;
      font-family: sans-serif;
      display: flex;
      justify-content: space-between;
      width: 100%;
      .icon {
        width: fit-content;
      }
      &:hover {
        background: #f0f5ff;
      }
      span {
        //padding: 0 15px;
        width: 100%;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
      }
    }

    .child-menu-item {
      background: #fff;
      box-shadow:
        0 9px 28px 8px rgba(0, 0, 0, 0.05),
        0 6px 16px 0 rgba(0, 0, 0, 0.08),
        0 3px 6px -4px rgba(0, 0, 0, 0.12);
      position: absolute;
      min-width: 200px;
      top: 0;
      right: -200px;
    }
  }
}
</style>
