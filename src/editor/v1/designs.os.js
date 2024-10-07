import { getImageSize } from './designs.imagesize';
import { getScaleMax } from './designs.maxScale';
import lodash from 'lodash';
import { designTile } from '@/editor/v1/designs.tile';

export function DesignsOs(editor) {
  this.visible = (design, v) => visible(editor, design, v);
  this.remove = (design) => remove(editor, design);
  this.moveToTop = (design) => moveToTop(editor, design);
  this.moveToBottom = (design) => moveToBottom(editor, design);
  this.moveUp = (design) => moveUp(editor, design);
  this.moveDown = (design) => moveDown(editor, design);
  this.rotation = (design, deg) => rotation(editor, design, deg);
  this.flip = (design, type = 'x') => flip(editor, design, type);
  this.max = (design, type = '') => max(editor, design, type);
  this.center = (design, type = '') => center(editor, design, type);
  this.copy = (design) => copy(editor, design);
  this.fixed = (design) => fixed(editor, design);
  this.tile = (design, tileOptions = {}) => tile(editor, design, tileOptions);
  this.add = (design) => addDesign(editor, design);
}

// 最大化
function max(editor, design, type = '') {
  if (![editor.config.getKey('design/type/image'), editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
    console.error('只有图片才能最大化');
    return;
  }
  const node = design.node;
  const template = design.template;
  const view = design.view;
  const width = view.width;
  const height = view.height;
  // 获取图片基于模板的尺寸
  const inch = getImageSize(design.detail.size, template.detail.dpi, { width, height }).inch;
  // 获取最大缩放比例
  const nodeWidth = node.width();
  const nodeHeight = node.height();
  const maxScale = getScaleMax(type, inch, view, { width: nodeWidth, height: nodeHeight });
  // 获取图片翻转状态
  const flipX = node.scaleX() < 0 ? -1 : 1;
  const flipY = node.scaleY() < 0 ? -1 : 1;
  // 最大化
  node.setAttrs({ scaleX: maxScale.scaleX * flipX, scaleY: maxScale.scaleY * flipY });
  // 0度
  node.rotation(0);
  // 居中
  node.setAttrs({ x: width / 2, y: height / 2 });
}

// 居中
function center(editor, design, type = '') {
  if ([editor.config.getKey('design/type/bgColor')].includes(design.attrs.type)) {
    console.error('背景色不能居中');
    return;
  }
  let x = design.attrs.x;
  let y = design.attrs.y;
  if (type === 'x') x = design.view.width / 2;
  if (type === 'y') y = design.view.height / 2;
  const node = design.node;
  node.setAttrs({ x, y });
}

// 复制
async function copy(editor, design) {
  if ([editor.config.getKey('design/type/bgColor'), editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
    console.error('背景色,背景图不能复制');
    return;
  }
  const attrs = lodash.omit(design.attrs, ['uuid']);
  if (attrs.type === editor.config.getKey('design/type/image')) {
    attrs.x += 5;
    attrs.y += 5;
    await editor.designs.addImage(design.detail, attrs);
  } else if (attrs.type === editor.config.getKey('design/type/text')) {
    attrs.x += 5;
    attrs.y += 5;
    await editor.designs.addText(attrs);
  }
}

// 固定
function fixed(editor, design) {
  if (design.attrs.fixed === editor.config.getKey('design/fixed/fixed')) {
    design.attrs.fixed = editor.config.getKey('design/fixed/none');
    editor.selector.select(design);
    if (![editor.config.getKey('design/type/bgColor')].includes(design.attrs.type)) {
      design.node.setAttrs({ draggable: true });
    }
  } else {
    design.attrs.fixed = editor.config.getKey('design/fixed/fixed');
    design.node.setAttrs({ draggable: false });
    editor.selector.ifsoDeselect(design);
  }
}

// 平铺
function tile(editor, design, tileAttrs = {}) {
  if ([editor.config.getKey('design/type/bgColor'), editor.config.getKey('design/type/text')].includes(design.attrs.type)) {
    console.error('文字,背景色不能平铺');
    return;
  }
  tileAttrs = { ...design.attrs.tileAttrs, ...tileAttrs };
  const { create, update, none } = designTile(editor, design, design.view);
  if (tileAttrs.noTile) {
    none();
  } else if (design.attrs.isTile) {
    Object.keys(design.attrs.tileAttrs).forEach((key) => (design.attrs.tileAttrs[key] = tileAttrs[key]));
    update();
  } else {
    create();
  }
}

// 翻转
function flip(editor, design, type = 'x') {
  let x = design.attrs.scaleX > 0 ? 1 : -1;
  let y = design.attrs.scaleY > 0 ? 1 : -1;
  if (type === 'x') x *= -1;
  else if (type === 'y') y *= -1;
  else if (type === '') {
    x = 1;
    y = 1;
  }
  design.node.setAttrs({
    scaleX: Math.abs(design.attrs.scaleX) * x,
    scaleY: Math.abs(design.attrs.scaleY) * y,
  });
}

// 旋转
function rotation(editor, design, deg) {
  design.node.rotation(deg);
  sortDesign(editor, design.template);
}

// 置顶
function moveToTop(editor, design) {
  let designs = [design];
  designs.forEach((d) => d.group.moveToTop());
  sortDesign(editor, design.template);
}
// 置底
function moveToBottom(editor, design) {
  let designs = [design];
  designs.forEach((d) => d.group.moveToBottom());
  sortDesign(editor, design.template);
}
// 上移一层
function moveUp(editor, design) {
  let designs = [design];
  designs.forEach((d) => d.group.moveUp());
  sortDesign(editor, design.template);
}
// 下移一层
function moveDown(editor, design) {
  let designs = [design];
  designs.forEach((d) => d.group.moveDown());
  sortDesign(editor, design.template);
}

// 显示隐藏
function visible(editor, design, _v) {
  const v = typeof _v === 'boolean' ? _v : !design.attrs.visible;
  const l = [editor.config.getKey('design/type/bgColor'), editor.config.getKey('design/type/bgImage')];
  if (l.includes(design.attrs.type)) {
    for (const view of design.template.viewList) {
      const design = view.designList.find((d) => l.includes(d.attrs.type));
      execute(design, v);
    }
  } else {
    execute(design, v);
  }
  function execute(design, v) {
    design.group.visible(v);
    !v && editor.selector.ifsoDeselect(design);
    v && editor.selector.select(design);
  }
}

// 删除
function remove(editor, design) {
  const l = [editor.config.getKey('design/type/bgColor'), editor.config.getKey('design/type/bgImage')];
  if (l.includes(design.attrs.type)) {
    for (const view of design.template.viewList) {
      const design = view.designList.find((d) => l.includes(d.attrs.type));
      execute(design);
    }
  } else {
    execute(design);
  }
  function execute(design) {
    editor.selector.ifsoDeselect(design);
    design.group.destroy();
    design.view.designList = design.view.designList.filter((d) => d.uuid !== design.uuid);
  }
}

// 添加设计
function addDesign(editor, design) {
  const view = design.view;
  view.designList.push(design);
  sortDesign(editor, design.template);
}

// 设计排序
function sortDesign(editor, template) {
  for (const view of template.viewList) {
    const _list = [];
    let bgColor;
    let bgImage;
    for (const design of view.designList) {
      if ([editor.config.getKey('design/type/bgColor')].includes(design.attrs.type)) {
        bgColor = design;
      } else if ([editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
        bgImage = design;
      } else {
        _list.push(design);
      }
    }
    _list.sort((a, b) => b.group.zIndex() - a.group.zIndex());
    if (bgColor) _list.push(bgColor);
    if (bgImage) _list.push(bgImage);
    view.designList = _list;
  }
}
