export function Config(editor) {
  const baseSize = 500;
  const targetSize = 650;

  const keys = {
    // container id
    'id/workspace': editor.utils.uuid(),

    // color
    'color/primary': '#ff0000',

    // canvas id
    'id/canvas/print_d': 'print_d',
    'id/canvas/printout_d': 'printout_d',
    'id/canvas/printout_v': 'printout_v',
    'id/canvas/transformer': 'transformer',
    'canvas/id/area': 'area',

    // design type
    'design/type/image': 'image',
    'design/type/bgImage': 'bgImage',
    'design/type/text': 'text',
    'design/type/bgColor': 'bgColor',

    // canvas size
    'canvas/width': targetSize,
    'canvas/height': targetSize,
    'canvas/scale': targetSize / baseSize,

    // canvas mode
    'canvas/mode/preview': 'preview',
    'canvas/mode/edit': 'edit',
  };

  return {
    getKey: (key) => keys[key],
  };
}
