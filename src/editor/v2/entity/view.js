export class View {
  constructor(editor, template, detail) {
    this.editor = editor;
    this.uuid = editor.utils.uuid();
    this.template = template;
    this.nodes = null;
    this.detail = detail;
    this.width = null;
    this.height = null;
    this.offsetX = null;
    this.offsetY = null;
    this.uvD = null;
    this.uvV = null;
    this.print = null;
    this.print_d = null;
    this.printout = null;
    this.printout_d = null;
    this.printout_v = null;
  }
  // 创建
  async create() {
    this.nodes = {
      stage: null,
      staticLayer: null,
      layer: null,
      transform: null,
      designGroup: null,
      bgImageGroup: null,
      bgColorGroup: null,
    };
  }
  // 销毁
  async destroy() {
    if (this.nodes) {
      this.nodes.stage.destroy();
      this.nodes = null;
    }
  }
}

