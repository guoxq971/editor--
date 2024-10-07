export function DesignsOs(editor) {
  this.visible = (design, v) => visible(editor, design, v);
  this.remove = (design) => remove(editor, design);
  this.moveToTop = (design) => moveToTop(editor, design);
  this.moveToBottom = (design) => moveToBottom(editor, design);
  this.moveUp = (design) => moveUp(editor, design);
  this.moveDown = (design) => moveDown(editor, design);
  this.rotation = (design, deg) => rotation(editor, design, deg);
  this.flip = (design, type = 'x') => flip(editor, design, type);
  this.add = (design) => addDesign(editor, design);
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
