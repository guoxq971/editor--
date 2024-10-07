import { Utils } from './utils';
import { Config } from './config';
import { Container } from './container';
import { Templates } from './templates';
import { Apis } from './apis';
import { Modes } from './modes';
import { Selector } from './selector';
import { Designs } from './designs';
import { computed } from 'vue';
import { ContextMenu } from './ContextMenu';
import { DesignsOs } from './designs.os';
import { Draw } from './draw';

export function Editor() {
  this.templateList = [];
  this.templateInfo = {
    disabled: {
      common: true,
      refine: true,
    },
    price: {},
    craft: {},
    reset() {
      this.price = {};
      this.craft = {};
    },
  };
  this.mode = '';
  this.actives = {
    template: null,
    view: null,
    design: null,
    size: null,
    color: null,
    reset() {
      this.template = null;
      this.view = null;
      this.design = null;
      this.size = null;
      this.color = null;
    },
  };

  this.isShow2d = computed(() => this.mode === this.config.getKey('canvas/mode/preview'));

  // 接口
  this.apis = new Apis();
  // 工具
  this.utils = new Utils();
  // 配置
  this.config = new Config(this);
  // 容器
  this.container = new Container(this);
  // 模板
  this.templates = new Templates(this);
  // 模式
  this.modes = new Modes(this);
  // 选择器
  this.selector = new Selector(this);
  // 设计
  this.designs = new Designs(this);
  // 设计操作
  this.designsOs = new DesignsOs(this);
  // 右键菜单
  this.contextMenu = new ContextMenu(this);
  // 更新画布
  this.draw = new Draw(this);
}
