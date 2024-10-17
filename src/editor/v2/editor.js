import { Actives } from './actives.js';
import { Utils } from './utils.js';
import { Apis } from './apis.js';
import { Config } from './config';
import { Template } from './entity/template';

export class Editor {
  constructor() {
  }

  // 模板列表
  templateList = [];
  setTemplate = (detail)=>setTemplate(this, detail);

  // 配置
  config = new Config(this);
  // 接口
  apis = new Apis(this);
  // 工具
  utils = new Utils(this);
  // 激活
  actives = new Actives(this);
}

async function setTemplate(editor, detail) {
  const { templateNo } = detail;
  // 获取模板配置
  const templateList = [];
  const common = await editor.apis.getCommonConfig(templateNo);
  const refineList = await editor.apis.getRefineConfigList(templateNo);
  if (common.is2dFlag) {
    common.isCommon = true;
    common.is3dFlag = false;
    templateList.push(new Template(editor, common));
  }
  refineList.forEach(refine => {
    if (refine.is2dFlag) {
      refine.isRefine = true;
      refine.is3dFlag = false;
      templateList.push(new Template(editor, refine))
    };
  });
  if (!templateList.length) {
    editor.utils.toast(`模板${templateNo}已关闭`);
    console.error('模板配置为空');
    return;
  }
  if(!templateList[0].config.isCommon){
    editor.utils.toast(`当前是精细模板`);
    console.error('模板配置为空');
  }
  // 使用前校验属性
  await templateList[0].beforeUse();
  // 销毁之前模板
  editor.actives.reset();
  editor.templateList.forEach(t => t.destroy());
  editor.templateList = [];
  editor.templateList = templateList;
  // 使用模板
  await templateList[0].use()
}

