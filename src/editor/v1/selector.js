export function Selector(editor) {
  // 选中
  this.select = (design, view) => {
    design = this.getDesign(design, view);
    if (design.attrs.type === editor.config.getKey('design/type/bgColor')) {
      console.error('背景色不能选中');
      return;
    }
    const node = design.node;
    view = design.view;
    const transformer = view.nodes.transformer;
    transformer.visible(true);
    transformer.nodes([node]);
    node.parent.visible(true);
    editor.actives.design = view.designList.find((d) => d.uuid === node.attrs.uuid);
    editor.modes.setEditMode();
  };

  // 取消选中
  this.deselect = (view) => {
    const transformer = view.nodes.transformer;
    transformer.nodes([]);
    transformer.visible(false);
    editor.actives.design = null;
  };

  // 是否选中
  this.hasSelected = (design) => {
    return editor.actives.design === design;
  };

  // 如果选中 则取消
  this.ifsoDeselect = (design) => {
    design = this.getDesign(design);
    this.hasSelected(design) && this.deselect(design.view);
  };

  // 获取设计
  this.getDesign = (design, view) => {
    if (typeof design === 'string' && view) {
      design = view.designList.find((d) => d.uuid === design);
    } else if (typeof design === 'object' && !design.isDesign && view) {
      design = view.designList.find((d) => d.uuid === design.attrs.uuid);
    }
    if (!design) return;

    return design;
  };
}
