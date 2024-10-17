import { nextTick } from 'vue';

export class Template {
  constructor(editor, config) {
    this.editor = editor;
    this.uuid = editor.utils.uuid();
    this.config = config;
    this.viewList = [];
    this.sizeList = [];
    this.colorList = [];
    this.exportConfig = null;
    this.detail = null;
    this.config3d = null;
    this.three = {};
    this.multiList = [];
  }
  // 创建
  async create() {
    // 2d
    this.viewList.forEach((view) => view.create());
    await nextTick();
    // 3d
    this.three?.create();
    this.multiList.forEach((multi) => multi.three?.create());
  }
  // 销毁
  async destroy() {
    // 销毁2d
    this.viewList.forEach((view) => view.destroy());
    // 销毁3d
    this.three?.destroy();
    this.multiList.forEach((multi) => multi.three?.destroy());
  }
  // 使用前
  async beforeUse(){
    if (!this?.config) {
      this.editor.utils.toast('加载模板失败, 模板配置不存在');
      return;
    }
    const { templateNo, size } = this.config;
    // 详情
    if (!this.detail) {
      this.detail = await this.editor.apis.getTemplateDetail(templateNo, size);
    }
    // 3d配置
    if (!this.config3d) {
      this.config3d = await this.editor.apis.getTemplateConfig3d(templateNo, size);
    }
    // 导出配置
    if (!this.exportConfig) {
      this.exportConfig = await this.editor.apis.getTemplateExportConfig(templateNo, size);
    }
  }
  // 使用
  async use() {
    await this.beforeUse();
    // 销毁之前模板
    if (this.editor.actives.template) {
      await this.editor.actives.template.destroy();
    }
    // 切换
    this.editor.actives.setTemplate(this);
    // 等待视图元素渲染, 创建模板
    await nextTick();
    // 创建
    await this.create();
  }
}

