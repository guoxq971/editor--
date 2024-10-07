import Konva from 'konva';
import { isObject, isString } from 'lodash';

// 设置节点的裁剪函数
export function setNodeClipFunc(node, path = null) {
  if (path === null) {
    node.clipFunc(null);
    return;
  }
  let _tempPathNode = null;
  if (path instanceof Konva.Path) {
    _tempPathNode = path;
  } else if (isString(path)) {
    _tempPathNode = new Konva.Path({ data: path });
  } else if (isObject(path)) {
    path = getPathData(path.width, path.height, path.gap);
    _tempPathNode = new Konva.Path({ data: path });
  }

  node.clipFunc((ctx) => clipFunc(ctx, _tempPathNode));
  _tempPathNode?.destroy();
}

// 获取path
function getPathData(width, height, gap = 0) {
  const step = gap || 0;
  const step2 = gap === 0 ? 0 : step / gap;
  const w = width + step;
  const h = height + step;
  // data 的值为 this.print.width和this.print.height 组成的矩形加上step的值
  const data = `M${-step2},${-step2} L${w - step2},${-step2} L${w - step2},${h - step2} L${-step2},${h - step2} Z`;
  return data;
}

/**
 * 裁剪函数
 * @param {CanvasRenderingContext2D} ctx ctx
 * @param {Konva.Path} konvaPath konvaPath
 * */
function clipFunc(ctx, konvaPath) {
  // console.log('裁剪函数 konvaPath', konvaPath);
  if (!konvaPath && !konvaPath?.dataArray) {
    return;
  }
  if (konvaPath?.dataArray?.length === 0) {
    return;
  }
  const list = konvaPath.dataArray;
  _drawSvgPath(ctx, list);
}
function _drawSvgPath(ctx, pathData) {
  // ctx 颜色透明
  ctx.strokeStyle = 'rgba(0,0,0,0)';
  // ctx.strokeStyle = 'red';
  ctx.beginPath();

  for (const segment of pathData) {
    const command = segment.command;
    const points = segment.points;

    if (command === 'M') {
      ctx.moveTo(points[0], points[1]);
    } else if (command === 'L') {
      ctx.lineTo(points[0], points[1]);
    } else if (command === 'C') {
      ctx.bezierCurveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
    } else if (command === 'z') {
      ctx.closePath();
    }
  }

  ctx.stroke();
}
