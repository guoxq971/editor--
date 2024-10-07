// 解析模板详情
export function parseTemplateDetail(detail, utils) {
  const viewList = [];
  const sizeList = detail.sizes;
  const colorList = [];

  // 视图
  detail.views.forEach((item) => {
    const print = detail.printAreas.find((print) => print.defaultView.id === item.id);
    const printout = detail.pointoutPrintAreas.find((print) => print.defaultView.id === item.id);
    const width = print?.boundary.size.width;
    const height = print?.boundary.size.height;
    const print_d = print?.boundary.soft.content.svg.path.d;
    const offsetX = item.viewMaps[0].offset.x;
    const offsetY = item.viewMaps[0].offset.y;
    const printout_d = printout?.soft.d;
    const printout_v = printout?.soft.v;
    viewList.push({
      ...item,
      nodes: null,
      uuid: utils.uuid(),
      designList: [],
      print,
      printout,
      width,
      height,
      print_d,
      printout_d,
      printout_v,
      offsetX,
      offsetY,
    });
  });
  // 颜色
  detail.appearances.forEach((item) => {
    colorList.push({
      ...item,
      colorCodeList: item.colors[0].value.split(','),
    });
  });
  return {
    viewList,
    sizeList,
    colorList,
  };
}
