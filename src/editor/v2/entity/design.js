export class Design {
  constructor(editor) {
    this.editor = editor;
    this.uuid = editor.utils.uuid();
    this.node = null;
    this.group = null;
    this.attrs = {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      scaleX: 1,
      visible: 1,
    };
  }
  // 创建
  create() {}
  // 销毁
  destroy() {}
}

