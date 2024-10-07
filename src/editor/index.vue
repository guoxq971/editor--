<template>
  <div style="display: flex">
    <div>
      <!--模板列表-->
      <div v-for="item in templateListApi.productTypes" class="box">{{ item.templateName }}({{ item.id }})</div>
    </div>

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

    <!--操作-->
    <div>
      <div class="box-wrap">
        <span>mode:</span>
        <span>【{{ editor.mode }}】</span>
        <span>【{{ editor.isShow2d }}】</span>
      </div>
      <div class="box-wrap">
        <span>view:</span>
        <div class="box" v-for="view in editor.actives.template?.viewList">{{ view.name }}</div>
      </div>
      <div class="box-wrap">
        <span>size:</span>
        <div class="box" v-for="size in editor.actives.template?.sizeList">{{ size.name }}</div>
      </div>
      <div class="box-wrap">
        <span>color:</span>
        <div class="box" v-for="color in editor.actives.template?.colorList">{{ color.name }}</div>
      </div>
      <div class="box-wrap">
        <span>design:</span>
        <div class="box" v-for="design in editor.actives.view?.designList" :class="{ active: design === editor.actives.design }" @click.stop="editor.selector.select(design, design.view)">
          <div>type：{{ design.attrs.type }}</div>
          <!--文本-->
          <template v-if="design.attrs.type === editor.config.getKey('design/type/text')">
            <div>text:{{ design.attrs.text }}</div>
            <div>fontSize：{{ design.attrs.fontSize }}</div>
            <div>textDecoration：{{ design.attrs.textDecoration }}</div>
            <div>fontWeight：{{ design.attrs.fontWeight }}</div>
            <div>fontItalic：{{ design.attrs.fontItalic }}</div>
          </template>
          <!--颜色-->
          <template v-if="[editor.config.getKey('design/type/text'), editor.config.getKey('design/type/bgColor')].includes(design.attrs.type)">
            <div>fill：{{ design.attrs.fill }}</div>
          </template>
          <!--平铺-->
          <template v-if="[editor.config.getKey('design/type/bgImage'), editor.config.getKey('design/type/image')].includes(design.attrs.type)">
            <div>isTile：{{ design.attrs.isTile }}</div>
            <div>tileAttrs：{{ design.attrs.tileAttrs }}</div>
          </template>
          <!--常规属性-->
          <div>x：{{ design.attrs.x }}</div>
          <div>y：{{ design.attrs.y }}</div>
          <div>rotation：{{ design.attrs.rotation }}</div>
          <div>fixed：{{ design.attrs.fixed }}</div>
          <div>scale：{{ design.attrs.scaleX }}</div>
          <div>offsetX：{{ design.attrs.offsetX }}</div>
          <div>offsetY：{{ design.attrs.offsetY }}</div>
          <div @click.stop="onVisible(design)">visible：{{ design.attrs.visible }}</div>
        </div>
      </div>
      <div class="box-wrap">
        <el-tabs v-model="activeName">
          <el-tab-pane label="设计图" name="image">
            <el-button @click="() => editor.designs.addImage()">新增</el-button>
          </el-tab-pane>
          <!--文字-->
          <el-tab-pane label="文字" name="text">
            <el-form label-width="55px">
              <el-form-item label="类型">
                <div>{{ textTypeName }}</div>
              </el-form-item>
              <el-form-item label="文字">
                <el-input v-model="textAttrs.text" @input="editText" />
              </el-form-item>
              <el-form-item label="字号">
                <el-select v-model="textAttrs.fontSize" @change="editText">
                  <el-option v-for="item in 30" :label="item + 11" :value="item + 11" />
                </el-select>
              </el-form-item>
              <el-form-item label="加粗">
                <el-select v-model="textAttrs.fontWeight" @change="editText">
                  <el-option label="正常" value="normal" />
                  <el-option label="加粗" value="bold" />
                </el-select>
              </el-form-item>
              <el-form-item label="斜体">
                <el-select v-model="textAttrs.fontItalic" @change="editText">
                  <el-option label="正常" value="normal" />
                  <el-option label="斜体" value="italic" />
                </el-select>
              </el-form-item>
              <el-form-item label="下划线">
                <el-select v-model="textAttrs.textDecoration" @change="editText">
                  <el-option label="正常" value="normal" />
                  <el-option label="下划线" value="underline" />
                </el-select>
              </el-form-item>
              <el-form-item label="颜色">
                <el-color-picker v-model="textAttrs.fill" @change="editText" />
              </el-form-item>
            </el-form>
            <el-button @click="addText" type="primary" style="width: 100%">新增</el-button>
            <el-button @click="resetText" style="width: 100%">重置</el-button>
          </el-tab-pane>
          <!--背景色-->
          <el-tab-pane label="背景色" name="bgColor">
            <el-form label-width="55px">
              <el-form-item label="类型">
                <div>{{ bgColorTypeName }}</div>
              </el-form-item>
              <el-form-item label="颜色">
                <el-color-picker v-model="bgColorAttrs.fill" @change="editBgColor" />
              </el-form-item>
            </el-form>
            <el-button @click="addBgColor" type="primary" style="width: 100%">新增</el-button>
            <el-button @click="resetBgColor" style="width: 100%">重置</el-button>
          </el-tab-pane>
          <el-tab-pane label="背景图" name="bgImage">
            <el-button @click="() => editor.designs.addBgImage()">新增</el-button>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!--右键菜单-->
    <ContextMenu />
  </div>
</template>

<script setup>
import ContextMenu from './lib/contextMenu';
import { editor } from './index.js';
import { templateListApi } from './mock/templateList';
import { computed, nextTick, ref, watch } from 'vue';
import { Message } from 'element-ui';
import lodash from 'lodash';
// 设计器
console.log('editor', editor);
nextTick(() => editor.templates.setTemplate(templateListApi.productTypes[0]));

// tabs
const activeName = ref('image');
// text
const { textTypeName, textAttrs, resetText, addText, editText } = useText(editor);
// bgColor
const { bgColorTypeName, bgColorAttrs, resetBgColor, addBgColor, editBgColor } = useBgColor(editor);

function onVisible(design) {
  editor.designsOs.visible(design);
}

// text
function useText(editor) {
  watch(
    () => editor.actives.design,
    (design) => {
      if (design && design.attrs.type === editor.config.getKey('design/type/text')) {
        textType.value = 'edit';
        Object.keys(textAttrs.value).forEach((key) => {
          textAttrs.value[key] = design.attrs[key];
        });
      } else {
        textAttrs.value.uuid = '';
        textType.value = 'add';
      }
    },
  );
  const textType = ref('add');
  const textTypeName = computed(() => (textType.value === 'add' ? '新增' : '修改'));
  const textAttrs = ref({
    uuid: '',
    text: '1234',
    fill: '#000',
    fontSize: 24,
    fontWeight: 'normal', //normal bold
    fontItalic: 'normal', //normal italic
    textDecoration: 'normal', //none underline
  });
  function resetText() {
    textAttrs.value = {
      text: '文字',
      fill: '#000',
      fontSize: 24,
      fontWeight: 'normal', //normal bold
      fontItalic: 'normal', //normal italic
      textDecoration: 'normal', //none underline
    };
  }
  function editText(design) {
    if (!design || !(typeof design === 'object' && design.isDesign)) {
      design = editor.actives.design;
    }
    if (!design || design.attrs.type !== editor.config.getKey('design/type/text')) return;
    editor.designs.editText(design, lodash.omit(textAttrs.value));
  }
  function addText() {
    if (textAttrs.value.text === '') {
      Message.warning('文字不能为空');
      return;
    }
    editor.designs.addText(lodash.omit(textAttrs.value, ['uuid']));
  }

  return {
    textAttrs,
    textTypeName,
    resetText,
    addText,
    editText,
  };
}

// bgColor
function useBgColor(editor) {
  const bgColorType = ref('add');
  const bgColorTypeName = computed(() => (bgColorType.value === 'add' ? '新增' : '修改'));
  const bgColorAttrs = ref({
    uuid: '',
    fill: '#000',
  });
  function resetBgColor() {
    bgColorAttrs.value = {
      fill: '#000',
    };
  }
  function editBgColor(design) {
    if (!design || !(typeof design === 'object' && design.isDesign)) {
      design = editor.actives.design;
    }
    if (!design || design.attrs.type !== editor.config.getKey('design/type/bgColor')) return;
    editor.designs.editBgColor(design, lodash.omit(bgColorAttrs.value));
  }
  function addBgColor() {
    const template = editor.actives.template;
    editor.designs.addBgColor(template, lodash.omit(bgColorAttrs.value, ['uuid']));
  }

  return {
    bgColorAttrs,
    bgColorTypeName,
    resetBgColor,
    addBgColor,
    editBgColor,
  };
}
</script>

<style scoped lang="less">
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
  //max-width: 100px;
  //max-height: 50px;
  //overflow: hidden;
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
