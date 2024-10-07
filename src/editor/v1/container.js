import { nextTick } from 'vue';

export function Container(editor) {
  const { config } = editor;

  const workspaceBbox = { left: 0, top: 0, width: 0, height: 0 };
  const templateBbox = { left: 0, top: 0, width: 0, height: 0 };

  nextTick(() => {
    initContainer();
  });

  function initContainer() {
    const el = document.getElementById(config.getKey('id/workspace'));
    const bbox = el ? el.getBoundingClientRect() : {};

    // 工作区域
    workspaceBbox.left = bbox.left;
    workspaceBbox.top = bbox.top;
    workspaceBbox.width = bbox.width;
    workspaceBbox.height = bbox.height;

    // 模板区域
    templateBbox.left = (workspaceBbox.width - config.getKey('canvas/width')) / 2;
    templateBbox.top = (workspaceBbox.height - config.getKey('canvas/height')) / 2;
    templateBbox.width = config.getKey('canvas/width');
    templateBbox.height = config.getKey('canvas/height');
  }

  return {
    workspaceBbox,
    templateBbox,
  };
}
