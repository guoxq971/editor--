import Konva from 'konva';
import lodash from 'lodash';
import { nextTick } from 'vue';
import { getTileOptions } from './designs.tile';

export function Designs(editor) {
  // bgColor
  this.addBgColor = (template, attrs = {}) => addBgColor(editor, template, attrs);

  // text
  this.addText = (attrs = {}, options = {}) => addText(editor, attrs, options);
  this.editText = (design, attrs = {}, options = {}) => editText(editor, design, attrs, options);

  // image
  this.addImage = (detail = {}, attrs = {}) => addImage(editor, detail, attrs);

  // bgImage
  this.addBgImage = () => addBgImage(editor);
}

// 背景色
function addBgColor(editor, template, attrs = {}) {
  const { viewList } = template;

  for (let view of viewList) {
    const parent = view.nodes.bgColorGroup;
    const uuid = editor.utils.uuid();
    attrs = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      visible: true,
      fill: attrs.fill,
      type: editor.config.getKey('design/type/bgColor'),
      uuid,
    };
    let design = view.designList.find((d) => d.attrs.type === attrs.type);
    if (design) {
      design.node.fill(attrs.fill);
    } else {
      const group = new Konva.Group({
        type: attrs.type,
        uuid: attrs.uuid,
        x: 0,
        y: 0,
      });
      const node = new Konva.Rect({
        width: view.width,
        height: view.height,
        ...attrs,
        draggable: false,
      });
      group.add(node);
      parent.add(group);
      design = {
        isDesign: true,
        uuid,
        attrs,
        view,
        template,
        group,
        node,
      };
      // 选中
      editor.designsOs.add(design);
      // 监听
      listenDesign(editor, design);
    }
  }
}

// 修改文本
function editText(editor, design, attrs = {}, options = {}) {
  attrs = { ...attrs };
  attrs.fontStyle = [attrs.fontWeight, attrs.fontItalic].join(' ');
  design.node.setAttrs(lodash.omit(attrs, ['visible']));
  design.fix(attrs);
}

// 添加文本
async function addText(editor, attrs = {}, options = {}) {
  const view = editor.actives.view;
  const template = editor.actives.template;
  const parent = view.nodes.designGroup;
  const uuid = editor.utils.uuid();
  attrs = Object.assign(
    {
      x: view.width / 2,
      y: view.height / 2,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      visible: true,
      fill: '#000',
      type: editor.config.getKey('design/type/text'),
      uuid,
      text: '双击编辑',
      fontSize: 24,
      fontWeight: 'normal',
      fontItalic: 'normal',
      textDecoration: 'normal',
    },
    attrs,
  );
  attrs.fontStyle = [attrs.fontWeight, attrs.fontItalic].join(' ');
  const group = new Konva.Group({
    type: attrs.type,
    uuid: attrs.uuid,
    x: 0,
    y: 0,
  });
  const node = new Konva.Text({
    ...attrs,
    draggable: true,
  });
  group.add(node);
  parent.add(group);
  const design = {
    isDesign: true,
    uuid,
    attrs,
    view,
    template,
    group,
    node,
    fix(attrs = {}) {
      attrs = { ...design.attrs, ...attrs };
      // 创建一个临时的文字对象
      let tempText = new Konva.Text({ ...attrs });
      node.setAttrs({ width: tempText.width(), height: tempText.height() });
      // 释放
      tempText.destroy();
      tempText = null;
      // 设置偏移量
      nextTick(() => {
        node.setAttrs({ offsetX: node.width() / 2, offsetY: node.height() / 2 });
      });
    },
  };
  // 设置偏移量
  design.fix();
  // 添加
  editor.designsOs.add(design);
  // 选中
  editor.selector.select(design);
  // 监听
  listenDesign(editor, design);
}

// 背景图
async function addBgImage(editor, detail = {}, attrs = {}) {
  const activeView = editor.actives.view;
  const template = editor.actives.template;
  detail = {
    size: {
      width: 4000,
      height: 2000,
    },
  };
  for (const view of template.viewList) {
    const parent = view.nodes.bgImageGroup;
    const uuid = editor.utils.uuid();
    const attrs = {
      x: view.width / 2,
      y: view.height / 2,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      visible: true,
      fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
      type: editor.config.getKey('design/type/bgImage'),
      uuid,
      width: 100,
      height: 100,
      offsetX: 50,
      offsetY: 50,
      isTile: false,
      tileAttrs: getTileOptions(),
    };
    const group = new Konva.Group({
      type: attrs.type,
      uuid: attrs.uuid,
      x: 0,
      y: 0,
    });
    const node = new Konva.Rect({
      ...attrs,
      draggable: true,
    });
    group.add(node);
    parent.add(group);
    const design = {
      isDesign: true,
      uuid,
      attrs,
      view,
      template,
      group,
      node,
      detail,
    };
    editor.designsOs.add(design);

    // 选中
    editor.selector.select(design, activeView);
    // 监听
    listenDesign(editor, design);
  }
}

// 设计图
async function addImage(editor, detail = {}, attrs = {}) {
  const view = editor.actives.view;
  const template = editor.actives.template;
  const parent = view.nodes.designGroup;
  const uuid = editor.utils.uuid();
  detail = {
    id: '1',
    name: '测试1',
    size: {
      width: 4000,
      height: 2000,
    },
  };
  attrs = {
    x: view.width / 2,
    y: view.height / 2,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    visible: true,
    fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
    type: editor.config.getKey('design/type/image'),
    uuid,
    width: 200,
    height: 100,
    offsetX: 100,
    offsetY: 50,
    fixed: editor.config.getKey('design/fixed/empty'),
    isTile: false,
    tileAttrs: getTileOptions(),
    ...attrs,
  };
  const group = new Konva.Group({
    type: attrs.type,
    uuid: attrs.uuid,
    x: 0,
    y: 0,
  });
  const node = new Konva.Rect({
    draggable: attrs.fixed !== editor.config.getKey('design/fixed/fixed'),
    ...attrs,
  });
  group.add(node);
  parent.add(group);
  const design = {
    isDesign: true,
    uuid,
    attrs,
    view,
    template,
    group,
    node,
    detail,
  };
  editor.designsOs.add(design);

  // 选中
  editor.selector.select(design);
  // 监听
  listenDesign(editor, design);

  return design;
}

// 设计监听
function listenDesign(editor, design) {
  const node = design.node;
  const view = design.view;
  const group = design.group;

  // 右键
  // 图 | 文字 | 背景色 | 背景图
  if (
    [editor.config.getKey('design/type/image'), editor.config.getKey('design/type/text'), editor.config.getKey('design/type/bgColor'), editor.config.getKey('design/type/bgImage')].includes(
      design.attrs.type,
    )
  ) {
    // 右键
    const menu = [
      //
      { label: '复制', fn: () => editor.designsOs.copy(design) },
      { label: '隐藏', fn: () => editor.designsOs.visible(design) },
      { label: '固定', fn: () => editor.designsOs.fixed(design) },
      { label: '删除', fn: () => editor.designsOs.remove(design), labelStyle: { color: 'red' } },
      {
        label: '平铺',
        children: [
          { label: '不平铺', fn: () => editor.designsOs.tile(design, { noTile: true }) },
          { label: '基础平铺', fn: () => editor.designsOs.tile(design, { mirrorType: editor.config.getKey('design/tile/mirror/normal') }) },
          { label: '水平平铺', fn: () => editor.designsOs.tile(design, { mirrorType: editor.config.getKey('design/tile/mirror/x') }) },
          { label: '垂直平铺', fn: () => editor.designsOs.tile(design, { mirrorType: editor.config.getKey('design/tile/mirror/y') }) },
          { label: '旋转平铺', fn: () => editor.designsOs.tile(design, { mirrorType: editor.config.getKey('design/tile/mirror/xy') }) },
        ],
      },
      {
        label: '居中',
        children: [
          { label: '水平居中', fn: () => editor.designsOs.center(design, 'x') },
          { label: '垂直居中', fn: () => editor.designsOs.center(design, 'y') },
        ],
      },
      {
        label: '最大化',
        children: [
          { label: '宽度最大化', fn: () => editor.designsOs.max(design, 'width') },
          { label: '高度最大化', fn: () => editor.designsOs.max(design, 'height') },
        ],
      },
      {
        label: '翻转',
        children: [
          { label: '不翻转', fn: () => editor.designsOs.flip(design, '') },
          { label: '水平翻转', fn: () => editor.designsOs.flip(design, 'x') },
          { label: '垂直翻转', fn: () => editor.designsOs.flip(design, 'y') },
        ],
      },
      {
        label: '旋转',
        children: [
          { label: '旋转至0°', fn: () => editor.designsOs.rotation(design, 0) },
          { label: '旋转至45°', fn: () => editor.designsOs.rotation(design, 45) },
          { label: '旋转至90°', fn: () => editor.designsOs.rotation(design, 90) },
          { label: '旋转至180°', fn: () => editor.designsOs.rotation(design, 180) },
          { label: '旋转至270°', fn: () => editor.designsOs.rotation(design, 270) },
        ],
      },
      {
        label: '排序',
        children: [
          { label: '置顶', fn: () => editor.designsOs.moveToTop(design) },
          { label: '置底', fn: () => editor.designsOs.moveDown(design) },
          { label: '上移一层', fn: () => editor.designsOs.moveUp(design) },
          { label: '下移一层', fn: () => editor.designsOs.moveToBottom(design) },
        ],
      },
    ];
    node.on('contextmenu', (e) => {
      editor.contextMenu.open(e.evt, menu);
    });
  }

  // 按下
  // 图 | 文字 | 背景图
  if ([editor.config.getKey('design/type/image'), editor.config.getKey('design/type/text'), editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
    node.on('mousedown', () => {
      if (![editor.config.getKey('design/fixed/fixed')].includes(design.attrs.fixed)) {
        editor.selector.select(node, view);
        editor.modes.setEditMode();
      } else {
        editor.modes.toggleMode();
      }
    });
  }

  // 属性同步
  // 设计图 | 背景图
  if ([editor.config.getKey('design/type/image'), editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
    const fields = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'offsetX', 'offsetY'];
    fields.forEach((field) => {
      node.on(`${field}Change`, (e) => {
        design.attrs[field] = lodash.round(e.newVal, 2);
        editor.draw.draw(design);
      });
    });
    group.on('visibleChange', (e) => (design.attrs['visible'] = e.newVal));
  } else if ([editor.config.getKey('design/type/text')].includes(design.attrs.type)) {
    const fields = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'fontSize', 'offsetX', 'offsetY'];
    fields.forEach((field) => {
      node.on(`${field}Change`, (e) => {
        design.attrs[field] = lodash.round(e.newVal, 2);
        editor.draw.draw(design);
      });
    });
    const fields2 = ['textDecoration', 'fill'];
    fields2.forEach((field) => {
      node.on(`${field}Change`, (e) => {
        design.attrs[field] = e.newVal;
        editor.draw.draw(design);
      });
    });
    node.on(`fontStyleChange`, (e) => {
      design.attrs['fontStyle'] = e.newVal;
      const l = e.newVal.split(' ');
      design.attrs['fontWeight'] = l[0];
      design.attrs['fontItalic'] = l[1];
      editor.draw.draw(design);
    });
    group.on('visibleChange', (e) => {
      design.attrs['visible'] = e.newVal;
      editor.draw.draw(design);
    });
  } else if ([editor.config.getKey('design/type/bgColor')].includes(design.attrs.type)) {
    node.on(`fillChange`, (e) => (design.attrs['fill'] = e.newVal));
    group.on('visibleChange', (e) => (design.attrs['visible'] = e.newVal));
    editor.draw.draw(design);
  }

  // 平铺
  if ([editor.config.getKey('design/type/image'), editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
    design.node.on('updateTile', () => {
      if (design.attrs.isTile) {
        editor.designsOs.tile(design);
        editor.draw.draw(design);
      }
    });
  }
}
