<template>
  <div class="workspace-wrap">
    <!--预览图-->
    <workspacePreview v-if="editor.actives.template" />

    <!--工作台-->
    <div :id="editor.config.getKey('id/workspace')" class="workspace">
      <img
        v-show="editor.isShow2d"
        src=""
        :style="{
          position: 'absolute',
          'pointer-events': 'none',
          left: editor.container.templateBbox.left + 'px',
          top: editor.container.templateBbox.top + 'px',
          width: editor.container.templateBbox.width + 'px',
          height: editor.container.templateBbox.height + 'px',
        }"
      />
      <div v-for="view in editor.actives.template?.viewList" :key="`view_${view.uuid}`" :id="view.uuid"></div>
      <img
        v-show="editor.isShow2d"
        src=""
        :style="{
          position: 'absolute',
          'pointer-events': 'none',
          left: editor.container.templateBbox.left + 'px',
          top: editor.container.templateBbox.top + 'px',
          width: editor.container.templateBbox.width + 'px',
          height: editor.container.templateBbox.height + 'px',
        }"
      />
    </div>

    <!--右键菜单-->
    <ContextMenu />
  </div>
</template>

<script setup>
import { editor } from '../index.js';
import ContextMenu from '../lib/contextMenu/index.vue';
import workspacePreview from './workspace-preview.vue';
</script>

<style scoped lang="less">
.workspace-wrap {
  position: relative;
}
.workspace {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
}
.preview-wrap {
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid;
  .preview-item {
  }
}
</style>
