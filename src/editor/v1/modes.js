import { setNodeClipFunc } from './utils.canvas.clip';

export function Modes(editor) {
  // 预览模式
  function setPreviewMode() {
    editor.mode = editor.config.getKey('canvas/mode/preview');
    const template = editor.actives.template;

    for (let view of template.viewList) {
      // 超出隐藏
      const print_d_node = view.nodes.staticLayer.findOne('#' + editor.config.getKey('id/canvas/print_d'))?.clone();
      const targetNodes = [view.nodes.designGroup, view.nodes.bgColorGroup];
      targetNodes.forEach((node) => {
        // 全幅产品
        if (!view.print_d) {
          setNodeClipFunc(node, null);
        } else {
          setNodeClipFunc(node, print_d_node);
        }
      });

      // 花边
      view.nodes.staticLayer.find('#' + editor.config.getKey('id/canvas/printout_d')).forEach((node) => node.visible(false));
      view.nodes.staticLayer.find('#' + editor.config.getKey('id/canvas/printout_v')).forEach((node) => node.visible(false));
      view.nodes.staticLayer.find('#' + editor.config.getKey('canvas/id/area')).forEach((node) => node.visible(false));
    }
  }

  // 编辑模式
  function setEditMode() {
    editor.mode = editor.config.getKey('canvas/mode/edit');
    const template = editor.actives.template;
    for (let view of template.viewList) {
      // 超出隐藏
      const printout_d_node = view.nodes.staticLayer.findOne('#' + editor.config.getKey('id/canvas/printout_d'))?.clone();
      const targetNodes = [view.nodes.designGroup, view.nodes.bgColorGroup];
      targetNodes.forEach((node) => {
        // 全幅产品
        if (!view.print_d) {
          setNodeClipFunc(node, null);
        } else {
          const path = printout_d_node ? printout_d_node : null;
          setNodeClipFunc(node, path);
        }
      });

      // 花边
      view.nodes.staticLayer.find('#' + editor.config.getKey('id/canvas/printout_d')).forEach((node) => node.visible(true));
      view.nodes.staticLayer.find('#' + editor.config.getKey('id/canvas/printout_v')).forEach((node) => node.visible(true));
      view.nodes.staticLayer.find('#' + editor.config.getKey('canvas/id/area')).forEach((node) => node.visible(true));
    }
  }
  function toggleMode() {
    if (editor.mode === editor.config.getKey('canvas/mode/preview')) {
      setEditMode();
    } else {
      setPreviewMode();
    }
  }

  return {
    setPreviewMode,
    setEditMode,
    toggleMode,
  };
}
