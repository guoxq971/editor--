import { nextTick } from 'vue';
import { parseTemplateDetail } from './templates.parseTemplateDetail';
import { drawView } from './templates.canvas.draw';

export function Templates(editor) {
  // 设置模板
  this.setTemplate = (detail) => setTemplate(editor, detail);

  // 使用模板
  this.useTemplate = (template) => useTemplateList(editor, template);
}

// 设置模板
async function setTemplate(editor, detail) {
  const templateNo = detail.templateNo;

  // 获取通用配置
  const commonConfig = await editor.apis.getTemplateCommonConfig(templateNo);
  // 获取精细配置
  const refineConfigList = await editor.apis.getTemplateRefineConfigList(templateNo);

  // 模板配置列表
  const configList = [commonConfig, ...refineConfigList].filter((item) => item.is2dFlag);
  if (configList.length === 0) {
    console.error('模板配置为空');
    return;
  }

  // 重置
  editor.templateList = [];
  editor.actives.reset();
  editor.templateInfo.reset();

  // 添加到模板列表
  configList.forEach((templateConfig) => {
    const isCommon = templateConfig.isCommon;
    const isRefine = templateConfig.isRefine;
    const template = {
      uuid: editor.utils.uuid(),
      config: templateConfig,
      config3d: isCommon ? templateConfig : null,
      exportConfig: null,
      detail: null,
      viewList: [],
      sizeList: [],
      colorList: [],
    };
    editor.templateList.push(template);
  });

  // 使用模板
  if (!commonConfig.is2dFlag) {
    console.error('通用模板已禁用');
  }
  editor.templates.useTemplate(editor.templateList[0]);

  // 获取模板价格
  editor.apis.getTemplatePrice(templateNo).then((res) => {});
  // 获取模板工艺
  editor.apis.getTemplateCraft(templateNo).then((res) => {});
}

// 使用模板
async function useTemplateList(editor, template) {
  // 详情
  if (!template.detail) {
    if (template.config.isCommon) {
      template.detail = await editor.apis.getCommonTemplateDetail(template.config.templateNo);
    } else {
      template.detail = await editor.apis.getRefineTemplateDetail(template.config.templateNo, template.config.size);
    }
    const parseTemplate = parseTemplateDetail(template.detail, editor.utils);
    template.viewList = parseTemplate.viewList;
    template.sizeList = parseTemplate.sizeList;
    template.colorList = parseTemplate.colorList;
  }
  // 导出配置
  if (!template.exportConfig) {
    template.exportConfig = await editor.apis.getTemplateExportConfig(template.detail.seqId);
  }
  // 3d配置
  if (!template.config3d && !template.config.isRefine) {
    template.config3d = await editor.apis.getRefineTemplate3dConfig(template.config.templateNo, template.config.size);
  }

  // 激活
  editor.actives.reset();
  editor.actives.template = template;
  editor.actives.view = template.viewList[0];
  editor.actives.size = template.sizeList[0];
  editor.actives.color = template.colorList[0];

  // 等待渲染,生成视图
  nextTick(() => {
    for (let view of template.viewList) {
      view.nodes = drawView(editor, view);
    }
    editor.modes.setPreviewMode();
    editor.modes.setEditMode();
  });
}
