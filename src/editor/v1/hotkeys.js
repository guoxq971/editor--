import { onKeyStroke } from '@vueuse/core';
import { Message } from 'element-ui';
import hotkeys from 'hotkeys-js';

export function Hotkeys(editor) {
  this.list = [];
  const mapper = {
    '001':{
      fn:() => editor.designsOs.visible(editor.actives.design),
      debounce: true,
    },
  };
  // 获取
  this.getHotkeys = async () => {
    const list = [
      { label:'1234', value:'ctrl+b', key:'' },
    ];
    return list;
  };
  // 销毁
  this.destroyHotkeys = () => {
    hotkeys.unbind();
    this.list = [];
  };
  // 注册
  this.registerHotkeys = () => {
    this.destroyHotkeys();
    this.getHotkeys().then((list) => {
      if (list?.length) {
        Message.warning('注册快捷键');
      }
      hotkeys.unbind();
      for (let item of list) {
        hotkeys(item.value, function(event, handler) {
          if (!mapper[item.key]) {
            console.log('快捷键未注册', item.key);
            Message.warning(`快捷键未注册 ${item.label}`);
            return;
          }
          event.preventDefault();
          mapper[item.key].fn();
          Message.warning(item.label);
        });
      }
    });
  };
  // 初始化
  this.registerHotkeys();
}
