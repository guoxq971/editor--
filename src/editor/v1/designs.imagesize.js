/**
 * 图片尺码换算
 * @param {{width,height}} imageSize 图片的宽高 {width,height}
 * @param {number} prodDpi dpi
 * @param {{width,height}} printSize 打印区域的宽高 {width,height}
 * @returns {{inch:{width:number,height:number},widthRatio:number,heightRatio:number,ratio:{value:number,width:number,height:number},size:{width:number,height:number}}} 宽高
 */
export function getImageSize(imageSize, prodDpi, printSize) {
  const inch = inchToPx(imageSize, prodDpi);
  return printAreaToImageRatio(inch, printSize);
}

/**
 * px转换为mm
 * @param {object} size 尺寸 {width,height}
 * @param {number} dpi dpi
 * @returns {width:number,height:number} 宽高
 * */
function inchToPx(size, dpi) {
  // const dpi = getters.activeProd.detail.dpi; // 当前产品的dpi
  //全局的
  // px -> mm
  let a = function (size, dpi) {
    return (25.4 * size) / dpi;
  };
  return {
    height: a(size.height, dpi),
    width: a(size.width, dpi),
  };
}

/**
 * 获取图片在打印区域的比例
 * @param {object} imageSize 图片的宽高
 * @param {object} printAreaSize 打印区域的宽高
 * */
function printAreaToImageRatio(imageSize, printAreaSize) {
  // 宽高的比例
  let widthRatio = '';
  let heightRatio = '';
  if (imageSize.width > printAreaSize.width) {
    widthRatio = printAreaSize.width / imageSize.width;
  } else {
    widthRatio = 1;
  }
  if (imageSize.height * widthRatio > printAreaSize.height) {
    heightRatio = printAreaSize.height / (imageSize.height * widthRatio);
  } else {
    heightRatio = 1;
  }
  return {
    inch: imageSize,
    widthRatio: widthRatio,
    heightRatio: heightRatio,
    ratio: {
      value: widthRatio * heightRatio,
      width: widthRatio,
      height: heightRatio,
    },
    size: {
      width: imageSize.width * widthRatio * heightRatio,
      height: imageSize.height * widthRatio * heightRatio,
    },
  };
}
