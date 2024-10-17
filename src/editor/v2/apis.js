export class Apis {
  constructor(editor) {
    this.editor = editor;
  }

  // 获取模板详情
  async getTemplateDetail(templateNo, size) {}

  // 获取模板3d配置
  async getTemplateConfig3d(templateNo, size) {}

  // 获取模板导出配置
  async getTemplateExportConfig(templateNo, size) {}

  // 获取通用配置
  async getCommonConfig(templateNo) {}
  // 获取精细配置列表
  async getRefineConfigList(templateNo) {}
}

