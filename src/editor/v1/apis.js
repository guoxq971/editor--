import { templateListApi } from '@/editor/mock/templateList';
import { commonConfigApi as commonConfig } from '@/editor/mock/commonConfig';

export function Apis(editor) {
  // 模板通用配置
  this.getTemplateCommonConfig = async (templateNo) => {
    return { ...commonConfig.data, is2dFlag: true, isCommon: true };
  };

  // 模板精细配置
  this.getTemplateRefineConfigList = async (templateNo) => {
    return [];
  };

  // 模板价格
  this.getTemplatePrice = async (templateNo) => {
    return {};
  };

  // 模板工艺
  this.getTemplateCraft = async (templateNo) => {
    return {};
  };

  // 通用模板详情
  this.getCommonTemplateDetail = async (templateNo) => {
    return templateListApi.productTypes.find((item) => item.templateNo === templateNo) || {};
  };

  // 精细模板详情
  this.getRefineTemplateDetail = async (templateNo, size) => {
    return {};
  };

  // 精细模板3d配置
  this.getRefineTemplate3dConfig = async (templateNo, size) => {
    return {};
  };

  // 模板导出配置
  this.getTemplateExportConfig = async (templateId) => {
    return {};
  };
}
