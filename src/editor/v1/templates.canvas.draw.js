import Konva from 'konva';

// 绘制视图
export function drawView(editor, view) {
  const el = document.getElementById(view.uuid);
  // 容器信息
  const workspace_width = editor.container.workspaceBbox.width;
  const workspace_height = editor.container.workspaceBbox.height;
  const canvas_width = editor.container.templateBbox.width;
  const canvas_height = editor.container.templateBbox.height;
  const canvas_offsetX = editor.container.templateBbox.left;
  const canvas_offsetY = editor.container.templateBbox.top;
  const canvas_scale = editor.config.getKey('canvas/scale');

  // 视图信息
  const print_d = view.print_d;
  const printout_d = view.printout_d;
  const printout_v = view.printout_v;
  const view_offsetX = view.offsetX * canvas_scale;
  const view_offsetY = view.offsetY * canvas_scale;
  const view_width = view.width;
  const view_height = view.height;

  // 舞台
  const stage = new Konva.Stage({
    container: el,
    width: workspace_width,
    height: workspace_height,
  });
  listenStage(view, stage, editor);

  // 层
  const layer = new Konva.Layer({
    x: canvas_offsetX,
    y: canvas_offsetY,
  });
  // 层(静态)
  const staticLayer = new Konva.Layer({
    x: canvas_offsetX,
    y: canvas_offsetY,
  });
  stage.add(layer);
  stage.add(staticLayer);

  // 变形器
  const transformer = createTransformer(editor);
  staticLayer.add(transformer);

  // 绘制区域
  const rect = new Konva.Rect({
    listening: false,
    x: 0,
    y: 0,
    width: canvas_width,
    height: canvas_height,
    fill: null,
    stroke: 'black',
    strokeWidth: 1,
    dash: [10, 5],
    draggable: false,
  });
  staticLayer.add(rect);

  // 设计图列表
  const designGroup = new Konva.Group({
    x: view_offsetX,
    y: view_offsetY,
    scale: { x: canvas_scale, y: canvas_scale },
  });
  // 背景色列表
  const bgColorGroup = new Konva.Group({
    x: view_offsetX,
    y: view_offsetY,
    scale: { x: canvas_scale, y: canvas_scale },
  });
  // 背景图列表
  const bgImageGroup = new Konva.Group({
    x: view_offsetX,
    y: view_offsetY,
    scale: { x: canvas_scale, y: canvas_scale },
  });
  layer.add(bgColorGroup);
  layer.add(bgImageGroup);
  layer.add(designGroup);

  // 打印区域(超出隐藏)
  if (print_d) {
    const printDPath = new Konva.Path({
      listening: false,
      id: editor.config.getKey('id/canvas/print_d'),
      x: view_offsetX,
      y: view_offsetY,
      scale: { x: canvas_scale, y: canvas_scale },
      data: print_d,
      fill: null,
      stroke: 'red',
      strokeWidth: 1,
      dash: [4],
      draggable: false,
      visible: false,
    });
    staticLayer.add(printDPath);
  }

  // 花边
  if (printout_d) {
    const printoutDPath = new Konva.Path({
      listening: false,
      id: editor.config.getKey('id/canvas/printout_d'),
      x: view_offsetX,
      y: view_offsetY,
      scale: { x: canvas_scale, y: canvas_scale },
      data: printout_d,
      fill: null,
      stroke: 'red',
      strokeWidth: 1.8,
      dash: [5],
      opacity: 0.7,
      draggable: false,
      visible: false,
    });
    staticLayer.add(printoutDPath);
  }
  if (printout_v) {
    const printoutVPath = new Konva.Path({
      listening: false,
      id: editor.config.getKey('id/canvas/printout_v'),
      x: view_offsetX,
      y: view_offsetY,
      scale: { x: canvas_scale, y: canvas_scale },
      data: printout_v,
      fill: null,
      stroke: 'red',
      strokeWidth: 2,
      dash: [5],
      opacity: 0.7,
      draggable: false,
      visible: false,
    });
    staticLayer.add(printoutVPath);
  }

  // 轮廓线 - (编辑模式, 黑色, 产品边框)
  if (view_width) {
    const step = 2;
    const step2 = step / 2;
    const w = view_width + step;
    const h = view_height + step;
    // data 的值为 this.print.width和this.print.height 组成的矩形加上step的值
    const data = `M${step2},${step2} L${w},${step2} L${w},${h} L${step2},${h} Z`;
    const path = new Konva.Path({
      listening: false,
      id: editor.config.getKey('canvas/id/area'),
      x: view_offsetX,
      y: view_offsetY,
      scale: { x: canvas_scale, y: canvas_scale },
      data: data,
      fill: null,
      stroke: 'black',
      strokeWidth: 1,
      opacity: 0.7,
      visible: false,
    });
    staticLayer.add(path);
  }

  return {
    stage,
    layer,
    staticLayer,
    transformer,
    designGroup,
    bgImageGroup,
    bgColorGroup,
  };
}

// 创建变形器
function createTransformer(editor) {
  const transformer = new Konva.Transformer({
    id: editor.config.getKey('id/canvas/transformer'),
    nodes: [],
    visible: false,
    draggable: false, // 是否可拖拽
    flipEnabled: false, // 允许翻转
    ignoreStroke: false, // 忽略边框 (锚点不会被边框遮挡)
    shouldOverdrawWholeArea: true, // 是否允许绘制超出图形边界的区域
    padding: 5,
    // 锚点
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    anchorFill: '#ffffff', // 锚点的填充色
    anchorStroke: editor.config.getKey('color/primary'), // 锚点的边框颜色
    anchorCornerRadius: 2, // 锚点的圆角
    anchorStrokeWidth: 1.5, // 锚点的边框宽度
    anchorSize: 15, // 锚点的大小
    // 旋转
    useSingleNodeRotation: true, // 是否使用单节点旋转
    rotateAnchorOffset: 50, // 旋转按钮的偏移量
    rotateAnchorCursor: 'pointer', // 旋转按钮的光标
    // 边框
    borderDash: [4], // 边框的虚线
    borderStrokeWidth: 2, // 边框的宽度
    borderStroke: editor.config.getKey('color/primary'), // 边框的颜色
    // 缩放
    keepRatio: true, // 保持比例 (缩放时保持比例)
    centeredScaling: true, // 是否启用中心缩放
    // 限制缩放的最大值 (缩放, 旋转时都会触发)
    // boundBoxFunc: (oldBox, newBox) => {
    //   // 是否放大
    //   const isUp = newBox.width > oldBox.width || newBox.height > oldBox.height;
    //   // 是否缩小
    //   const isDown = newBox.width < oldBox.width || newBox.height < oldBox.height;
    //
    //   const node = transformer.nodes()[0];
    //   if (!node) return oldBox;
    //   const design = editor.template.getDesign(node.attrs.uuid);
    //
    //   if (isUp || isDown) {
    //     // 最大检测
    //     if (isUp && node && design.isMax()) {
    //       return oldBox; // 返回旧的
    //     } else {
    //       return newBox; // 返回新的(成功放大)
    //     }
    //   } else {
    //     // 绘制旋转角度
    //     this.drawRotation(transformer, oldBox, newBox);
    //     return newBox; // 返回新的(旋转)
    //   }
    // },
  });

  transformer.on('dblclick', (e) => {
    //触发目标的双击事件
    const node = transformer.nodes()[0];
    if (node) node.fire('dblclick', e);
  });
  transformer.on('contextmenu', (e) => {
    //触发目标的双击事件
    const node = transformer.nodes()[0];
    if (node) node.fire('contextmenu', e);
  });

  return transformer;
}

// 舞台监听
export function listenStage(view, stage, editor) {
  stage.on('click', (e) => {
    // 获取舞台鼠标位置
    const { x, y } = stage.getPointerPosition();
    // 获取点击的节点
    const targetNode = e.target;
    const parentNode = targetNode.parent;
    // 父级是选中框
    if (parentNode?.getId() === editor.config.getKey('id/canvas/transformer')) return;
    // 当前是设计 && 非固定设计
    else if (isDesignNode(targetNode) && !isFixedDesignNode(targetNode)) return;
    // 判断是否点击了锚点
    else if (isMouseTransformerAnchor(x, y)) return;
    // 执行取消选中
    editor.selector.deselect(view);
    editor.modes.toggleMode();
  });

  // 舞台注册监听(mousedown, 坐标下选中最上面的设计)
  stage.on('mousedown', (e) => {
    // 获取舞台鼠标位置
    const { x, y } = stage.getPointerPosition();
    // 判断是否点击了锚点
    if (isMouseTransformerAnchor(x, y)) return;
    // 获取当前坐标下的所有节点(设计节点)
    const nodes = [...view.nodes.bgImageGroup.children, ...view.nodes.designGroup.children].filter((node) => {
      const design = view.designList.find((d) => d.uuid === node.attrs.uuid);
      return !isFixedDesignNode(design.node) && isDesignNode(design.node) && design.node?.intersects({ x, y });
    });
    if (nodes.length > 1) {
      const node = nodes.at(-1);
      const design = view.designList.find((d) => d.uuid === node.attrs.uuid);
      // 将node替换,transformer附加到节点
      view.nodes.transformer.attachTo(design.node);
      // 模拟点击
      design.node.fire('mousedown', e);
    }
  });

  // 是否是设计节点
  function isDesignNode(node) {
    const list = [
      //
      editor.config.getKey('design/type/image'),
      editor.config.getKey('design/type/bgImage'),
      editor.config.getKey('design/type/text'),
      // editor.config.getKey('design/type/bgColor'),
    ];
    return list.includes(node?.attrs.type);
  }

  // 是否非固定设计
  function isFixedDesignNode(node) {
    // const editor = this.editor;
    // const design = editor.template.getDesign(node?.attrs.uuid);
    // return design?.fixed === editor.types.getKey('design/fixed/fixed');
    return false;
  }

  // 是否点击了锚点
  function isMouseTransformerAnchor(x, y) {
    const transformer = view.nodes.transformer;
    return transformer
      .getChildren((node) => node.getName().indexOf('anchor') > -1)
      .some((node) =>
        node?.intersects({
          x,
          y,
        }),
      );
  }
}
