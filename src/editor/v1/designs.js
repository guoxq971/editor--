import Konva from 'konva';
import lodash from 'lodash';

export function Designs(editor) {
  // bgColor
  this.addBgColor = (template, attrs = {}) => addBgColor(editor, template, attrs);

  // text
  this.addText = (attrs = {}, options = {}) => addText(editor, attrs, options);
  this.editText = (design, attrs = {}, options = {}) => editText(editor, design, attrs, options);

  // image
  this.addImage = () => addImage(editor);

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
}

// 添加文本
async function addText(editor, attrs = {}, options = {}) {
  const view = editor.actives.view;
  const template = editor.actives.template;
  const parent = view.nodes.designGroup;
  const uuid = editor.utils.uuid();
  attrs = Object.assign(
    {
      x: 0,
      y: 0,
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
    fix() {
      node.setAttrs({
        ...design.attrs,
      });
    },
  };
  editor.designsOs.add(design);

  // 选中
  editor.selector.select(design);
  // 监听
  listenDesign(editor, design);
}

// 背景图
async function addBgImage(editor) {
  const activeView = editor.actives.view;
  const template = editor.actives.template;
  for (const view of template.viewList) {
    const parent = view.nodes.designGroup;
    const uuid = editor.utils.uuid();
    const attrs = {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      visible: true,
      fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
      type: editor.config.getKey('design/type/bgImage'),
      uuid,
    };
    const group = new Konva.Group({
      type: attrs.type,
      uuid: attrs.uuid,
      x: 0,
      y: 0,
    });
    const node = new Konva.Rect({
      width: 100,
      height: 100,
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
    };
    editor.designsOs.add(design);

    // 选中
    editor.selector.select(design, activeView);
    // 监听
    listenDesign(editor, design);
  }
}

// 设计图
async function addImage(editor) {
  const view = editor.actives.view;
  const template = editor.actives.template;
  const parent = view.nodes.designGroup;
  const uuid = editor.utils.uuid();
  const attrs = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    visible: true,
    fill: '#' + Math.floor(Math.random() * 16777215).toString(16),
    type: editor.config.getKey('design/type/image'),
    uuid,
  };
  const group = new Konva.Group({
    type: attrs.type,
    uuid: attrs.uuid,
    x: 0,
    y: 0,
  });
  const node = new Konva.Rect({
    width: 100,
    height: 100,
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
  };
  editor.designsOs.add(design);

  // 选中
  editor.selector.select(design);
  // 监听
  listenDesign(editor, design);
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
      { label: 'visible', fn: () => editor.designsOs.visible(design) },
      { label: 'remove', fn: () => editor.designsOs.remove(design) },
    ];
    node.on('contextmenu', (e) => {
      editor.contextMenu.open(e.evt, menu);
    });
  }

  // 按下
  // 图 | 文字 | 背景图
  if ([editor.config.getKey('design/type/image'), editor.config.getKey('design/type/text'), editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
    node.on('mousedown', () => {
      editor.modes.setEditMode();
      editor.selector.select(node, view);
    });
  }

  // 属性同步
  // 设计图 | 背景图
  if ([editor.config.getKey('design/type/image'), editor.config.getKey('design/type/bgImage')].includes(design.attrs.type)) {
    const fields = ['x', 'y', 'scaleX', 'scaleY', 'rotation'];
    fields.forEach((field) => {
      node.on(`${field}Change`, (e) => (design.attrs[field] = lodash.round(e.newVal, 2)));
    });
    group.on('visibleChange', (e) => (design.attrs['visible'] = e.newVal));
  }
  // 文本
  else if ([editor.config.getKey('design/type/text')].includes(design.attrs.type)) {
    const fields = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'fontSize'];
    const fields2 = ['textDecoration', 'fill'];
    fields.forEach((field) => {
      node.on(`${field}Change`, (e) => (design.attrs[field] = lodash.round(e.newVal, 2)));
    });
    fields2.forEach((field) => {
      node.on(`${field}Change`, (e) => (design.attrs['fill'] = e.newVal));
    });
    node.on(`fontStyleChange`, (e) => {
      design.attrs['fontStyle'] = e.newVal;
      const l = e.newVal.split(' ');
      design.attrs['fontWeight'] = l[0];
      design.attrs['fontItalic'] = l[1];
    });
    group.on('visibleChange', (e) => (design.attrs['visible'] = e.newVal));
  }
  // 背景色
  else if ([editor.config.getKey('design/type/bgColor')].includes(design.attrs.type)) {
    node.on(`fillChange`, (e) => (design.attrs['fill'] = e.newVal));
    group.on('visibleChange', (e) => (design.attrs['visible'] = e.newVal));
  }
}
