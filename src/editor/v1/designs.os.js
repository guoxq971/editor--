export function DesignsOs(editor) {
  this.visible = (design, v) => visible(editor, design, v);
  this.remove = (design) => remove(editor, design);
  this.add = (design) => addDesign(editor, design);
}

// 显示隐藏
function visible(editor, design, _v) {
  const v = typeof _v === 'boolean' ? _v : !design.group.attrs.visible;
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
