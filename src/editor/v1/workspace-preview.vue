<template>
  <div
    class="preview-container"
    style="width: fit-content; position: absolute"
    :style="{
      left: editor.container.templateBbox.left - editor.config.getKey('style/preview/size') - 16 + 'px',
      top: editor.container.templateBbox.top - 2 + 'px',
      '--size': editor.config.getKey('style/preview/size') + 'px',
      width: 'var(--size)',
    }"
  >
    <!--切换模板设计模式-->
    <el-dropdown placement="bottom">
      <!-- <conrner>-->
      <div class="btn-wrap">
        <span>{{ editor.actives.template.typeName }}</span>
      </div>
      <!--</conrner>-->
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="editor.templates.setTemplateType(editor.config.getKey('template/type/common'))" :disabled="editor.templateInfo.disabled.common">通用设计</el-dropdown-item>
        <el-dropdown-item @click.native="editor.templates.setTemplateType(editor.config.getKey('template/type/refine'))" :disabled="editor.templateInfo.disabled.refine">精细设计</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <div class="preview-box-group">
      <template v-for="view in editor.actives.template.viewList">
        <el-tooltip placement="right" :content="view.name" :key="'preview' + view.uuid">
          <div class="preview-box" :class="{ active: editor.actives.view === view }" @click="editor.templates.setView(view)">
            <!--产品图-->
            <img :src="view.prodImg?.image" alt="" style="position: absolute; width: 100%; height: 100%; user-select: none; pointer-events: none" />
            <!--容器id-->
            <canvas
              :id="editor.config.getKey('id/preview/canvas/fn')(view.uuid)"
              :width="editor.config.getKey('style/preview/size') + 'px'"
              :height="editor.config.getKey('style/preview/size') + 'px'"
              style="position: absolute"
              :style="{ 'clip-path': view.print_d ? `url(${`#eyePath_${view.id}`})` : '' }"
            />
            <!--背景图-->
            <img :src="view.prodImg?.texture" alt="" style="position: absolute; width: 100%; height: 100%; user-select: none; pointer-events: none" />
            <div class="preview-box-label">
              <div class="preview-box-label-mask"></div>
              <div class="preview-box-label-name">
                {{ view.name }}
              </div>
            </div>
            <!--裁剪路径-->
            <svg width="0" height="0">
              <defs>
                <clipPath :id="`eyePath_${view.id}`" clipPathUnits="userSpaceOnUse">
                  <path
                    :d="view.print_d"
                    :style="{
                      transform: `translate(${view.offsetX * editor.config.getKey('preview/scale')}px, ${
                        view.offsetY * editor.config.getKey('preview/scale')
                      }px) scale(${editor.config.getKey('preview/scale')})`,
                    }"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </el-tooltip>
      </template>
    </div>
  </div>
</template>

<script setup>
import { editor } from '../index.js';
// components
// import conrner from '@/views/designerApp/components/conrner.vue';
// utils
// import { useGlobalEditor } from '@/hooksFn/useEditor';
</script>

<style scoped lang="less">
//预览图列表
.preview-container {
  z-index: 1;
  pointer-events: all;
  @size: var(--size); //宽度
  @scrollGap: v-bind(scrollGap); //滚动条宽度
  @gap: v-bind(gap); //和canvas的间距
  @designBtnHeight: 34px; //通用/精细按钮的高度
  @designBtnGap: var(--fn-gap);
  position: absolute;
  //left: calc((@size + @gap) * -1);
  width: calc(@size + @scrollGap);

  // 精细/通用设计
  .btn-wrap {
    width: @size;
    height: @designBtnHeight;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 14px;
    color: #000c01;
    line-height: 19px;
    cursor: default;

    &:hover {
      color: var(--fn-primary-color);
      opacity: 0.9;
      background-color: #fff9f5;
    }
  }

  // 预览box
  .preview-box-group {
    margin-top: @designBtnGap;
    user-select: none;
    display: flex;
    flex-direction: column;

    .preview-box {
      width: @size;
      height: @size;
      margin-bottom: var(--fn-gap-min);
      border: 1px solid #e9e9e9;
      cursor: pointer;
      position: relative;
      box-sizing: content-box;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        border-color: var(--fn-primary-color);
      }

      .preview-box-label {
        position: absolute;
        z-index: 3;
        bottom: 0;
        width: 100%;
        height: 22px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        //background: #000000;
        //opacity: 0.2;
        font-size: 12px;
        line-height: 16px;
        .preview-box-label-mask {
          width: 100%;
          height: 100%;
          position: absolute;
          background: #000000;
          opacity: 0.3;
        }
        .preview-box-label-name {
          color: #fff;
          position: absolute;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
          padding: 0 3px;
        }
      }
    }

    .active {
      border-color: var(--fn-primary-color);
    }
  }
}
</style>
