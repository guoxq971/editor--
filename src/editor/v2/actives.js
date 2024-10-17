import { nextTick } from 'vue';

export class Actives {
  constructor(editor) {
    this.editor = editor;
    this.template = null;
    this.view = null;
    this.design = null;
    this.size = null;
    this.color = null;
  }

  reset() {
    this.template = null;
    this.view = null;
    this.design = null;
    this.size = null;
    this.color = null;
  }

  // 使用模板
  setTemplate(template) {
    this.template = template;
  }

  // 使用视图
  setView(view) {
    this.view = view;
  }

  // 使用设计
  setDesign(design) {
    this.design = design;
  }

  // 使用尺寸
  setSize(size) {
    this.size = size;
  }

  // 使用颜色
  setColor(color) {
    this.color = color;
  }
}

