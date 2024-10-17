import { useDebounceFn } from '@vueuse/core';

export function Draw(editor) {
  const fn = useDebounceFn((design) => draw(editor, design), 200);
  this.draw = (design) => fn(design);
}

function draw(editor, design) {
  const view = design.view;

  // 预览图
  const previewSize = editor.config.getKey('style/preview/size');
  const pixelRatio = previewSize / editor.config.getKey('canvas/width');
  const canvas = view.nodes.layer._toKonvaCanvas({
    width: editor.container.templateBbox.width,
    height: editor.container.templateBbox.height,
    x: editor.container.templateBbox.left,
    y: editor.container.templateBbox.top,
    pixelRatio: pixelRatio,
  });
  const previewCanvasDom = document.getElementById(editor.config.getKey('id/preview/canvas/fn')(view.uuid));
  const ctx = previewCanvasDom.getContext('2d');
  ctx.clearRect(0, 0, previewSize, previewSize);
  ctx.drawImage(canvas._canvas, 0, 0);
}
