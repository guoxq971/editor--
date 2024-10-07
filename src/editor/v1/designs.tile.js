import Konva from 'konva';

/**
 * 平铺参数
 * @return {import('d').TileParam}
 */
export function getTileOptions() {
  return {
    gapX: 0,
    gapY: 0,
    offset: 0,
    offsetType: '0',
    mirrorType: '0',
  };
}

/**
 * 设计平铺
 * @param {import('d').design} design
 * @param {import('d').view} view
 */
export function designTile(editor, design, view) {
  // 数据json
  function toJson() {}

  // 获取design中的tileNode
  function getTileNode() {
    return design.group.children.find((node) => node.attrs.type === editor.config.getKey('id/canvas/tile'));
  }

  // 重置
  function reset() {
    design.attrs.isTile = false;
    design.attrs.tileAttrs = getTileOptions();
  }

  // 销毁
  function destroy() {
    const tileNode = getTileNode();
    if (tileNode) {
      tileNode?.destroy();
    }
  }

  // 创建
  function create() {
    design.attrs.isTile = true;
    // design.attrs.tileAttrs = getTileOptions();
    const tileNode = createTile(editor, view, design, design.attrs.tileAttrs, getTileNode());
    tileNode.setAttrs({
      id: editor.config.getKey('id/canvas/tile'),
      type: editor.config.getKey('id/canvas/tile'),
    });
    design.group.add(tileNode);
  }

  // 更新
  function update() {
    destroy();
    setTimeout(() => create(), 200);
  }

  // 不平铺
  function none() {
    design.attrs.isTile = false;
    reset();
    destroy();
  }

  return {
    toJson,
    none,
    reset,
    destroy,
    create,
    update,
  };
}

function createTile(editor, view, design, tileAttrs, tileNode) {
  return tile();

  // 平铺
  function tile() {
    // 销毁已有
    if (tileNode) {
      tileNode.destroy();
    }

    const node = design.node;
    const parent = design.node.parent;

    const outerGroup = new Konva.Group({
      listening: false,
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });

    // 坐标数组
    const posList = createPosList();

    // 创建平铺
    posList.forEach((pos) => {
      const x = pos.x;
      const y = pos.y;
      const group = createGroup(x, y);
      outerGroup.add(group);
    });

    parent.add(outerGroup);
    outerGroup.moveToBottom();

    return outerGroup;
  }

  // 创建坐标数组
  function createPosList() {
    const node = design.node;

    // 画布的宽高
    const canvasWidth = editor.config.getKey('canvas/width');
    const canvasHeight = editor.config.getKey('canvas/height');
    // 设计的属性(平铺属性参与计算后)
    const x = node.x();
    const y = node.y();
    const nodeWidth = node.width();
    const nodeHeight = node.height();
    const width = (nodeWidth + tileAttrs.gapX) * 2;
    const height = (nodeHeight + tileAttrs.gapY) * 2;

    // 缩放后的设计宽高
    const scaleWidth = nodeWidth * node.scaleX();
    const scaleHeight = nodeHeight * node.scaleY();

    // 计算平铺数量
    const computedNum = (distance, num) => Math.ceil(distance / num);

    // 计算平铺数量(左右上下)
    const rightCount = 1 + computedNum(canvasWidth - x, scaleWidth);
    const leftCount = 1 + computedNum(x, scaleWidth);
    const topCount = 1 + computedNum(y, scaleHeight);
    const bottomCount = 1 + computedNum(canvasHeight - y, scaleHeight);

    // 坐标数组
    const posXList = [];
    const posYList = [];
    for (let i = 0; i < rightCount; i++) {
      const newX = i * width;
      const newY = 0;
      posXList.push({ x: newX, y: newY });
    }
    for (let i = 0; i < leftCount; i++) {
      const newX = -(i + 1) * width;
      const newY = 0;
      posXList.push({ x: newX, y: newY });
    }
    for (let i = 0; i < topCount; i++) {
      const newX = 0;
      const newY = -(i + 1) * height;
      posYList.push({ x: newX, y: newY });
    }
    for (let i = 0; i < bottomCount; i++) {
      const newX = 0;
      const newY = i * height;
      posYList.push({ x: newX, y: newY });
    }

    // 最终坐标数组
    const posList = [];
    posXList.forEach((posX) => {
      posYList.forEach((posY) => {
        posList.push({ x: posX.x, y: posY.y });
      });
    });

    return posList;
  }

  // 创建一组平铺(4个)
  function createGroup(x = 0, y = 0) {
    const attrs = design.node.attrs;
    const node = design.node;

    const group = new Konva.Group({
      x: x,
      y: y,
    });
    /**
     0 1
     2 3
     */
    const COUNT = 4;
    const getX = (i) => {
      let offset = 0;
      if (tileAttrs.offsetType === 0 && [2, 3].includes(i)) {
        offset = tileAttrs.offset;
      }
      const n = i % 2;
      const x = tileAttrs.gapX + attrs.width;
      return n * x + offset;
    };
    const getY = (i) => {
      let offset = 0;
      if (tileAttrs.offsetType === 1 && [1, 3].includes(i)) {
        offset = tileAttrs.offset;
      }
      const n = Math.floor(i / 2);
      const y = tileAttrs.gapY + attrs.height;
      return n * y + offset;
    };
    for (let i = 0; i < COUNT; i++) {
      const cloneNode = node.clone();
      const x = getX(i);
      const y = getY(i);
      cloneNode.setAttrs({
        x: x,
        y: y,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      });
      group.add(cloneNode);
    }

    return group;
  }
}
