// import html2canvas from 'html2canvas'

/**
 * 判断key是否存在于object
 * @param key
 * @param object
 * @returns boolean
 */
export function isValidKey(key, object) {
  return key in object;
}

export const toHex = (n) => `0${n.toString(16)}`.slice(-2);

/**
 * rgba转16进制
 * @param colorObj
 * @returns
 */
export const toHexString = (colorObj) => {
  // let { r, g, b } = colorObj;
  // const { a } = colorObj;
  // r = Math.floor(r * a);
  // g = Math.floor(g * a);
  // b = Math.floor(b * a);
  // return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  let { r, g, b } = colorObj;
  const { a } = colorObj;

  // 如果 alpha 透明度为 0，仍然显示为不透明颜色，或者你可以根据需求处理
  r = Math.floor(r * (a !== 0 ? a : 1));  // 保证颜色值不变，避免透明
  g = Math.floor(g * (a !== 0 ? a : 1));
  b = Math.floor(b * (a !== 0 ? a : 1));

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * 创建元素
 * @param elType 元素类型
 * @param styleObj 样式对象
 * @param parent 父级元素
 * @returns element
 */
export const createDocument = (elType, styleObj, parent) => {
  const el = document.createElement(elType);
  Object.keys(styleObj).forEach((key) => {
    if (isValidKey(key, styleObj)) {
      Reflect.set(el.style, key, styleObj[key]);
    }
  });
  parent.appendChild(el);
  return el;
};

/**
 * 获取随机id
 * @returns id
 */
export const getId = () => {
  const abc = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  ];
  const [max, min] = [
    Math.floor(Math.random() * (10 - 7 + 1) + 1),
    Math.floor(Math.random() * (17 - 10 + 1) + 17),
  ];
  return (
    new Date().getTime() +
    abc.sort(() => 0.4 - Math.random()).slice(max, min).slice(0, 8).join('')
  );
};

// 样式对象，用于创建元素使用
export const styleObj = {
  // canvas容器
  canvasContainer:{
    position:'fixed',
    top:'0px',
    left:'0px',
    width:'100vw',
    height:'100vh',
    zIndex:999,
    display:'none',
    cursor:'none',
  },
  // 浮动容器
  floatContainer:{
    position:'fixed',
    top:'0px',
    left:'0px',
    width:'165px',
    height:'195px',
    borderRadius:'5px',
    overflow:'hidden',
    display:'flex',
    visibility:'hidden',
    flexWrap:'wrap',
    zIndex:1000,
  },
  // 放大镜样式块
  colorItem:{
    width:'15px',
    height:'15px',
    border:'solid 1px rgba(0,0,0,0.2)',
    boxSizing:'border-box',
  },
  // 放大镜文本元素
  text:{
    width:'165px',
    height:'30px',
    color:'#000000',
    textAlign:'center',
    lineHeight:'30px',
    backgroundColor:'rgba(0,0,0,0.1)',
    fontWeight:'bold',
  },
};

const COLOR_ITEM_SIZE = 11;

export class ColorPicker {
  constructor(editor, onChange = () => {
  }) {
    this.html2canvas = async () => {
      let canvas = null;
      canvas = editor.actives.view?.nodes?.layer?.canvas._canvas;
      if (!canvas || !canvas.getContext) {
        console.error('无法获取正确的 canvas');
        return;
      }
      canvas.style.left = editor.container.workspaceBbox.left + 'px'
      canvas.style.top = editor.container.workspaceBbox.top + 'px'
      canvas.style.border = '1px solid'

      // // 确认 canvas 上是否有内容，例如通过绘制内容或获取图像数据
      // const ctx = canvas.getContext('2d');
      // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      //
      // // 检查是否所有像素都是透明的
      // let hasContent = false;
      // for (let i = 3; i < imageData.data.length; i += 4) {
      //   if (imageData.data[i] !== 0) {  // 检查 alpha 通道
      //     hasContent = true;
      //     break;
      //   }
      // }
      //
      // if (!hasContent) {
      //   console.warn('canvas 上没有有效的绘制内容');
      // }
      return canvas;
    };
    this.canvasContainer = null; // canvas容器元素
    this.canvas = null; // 截屏canvas
    this.context = null; // 截屏canvas context
    this.floatContainer = null; // 鼠标移动时的浮动容器元素
    this.onChange = onChange; // 点击鼠标后的回调
    this.color = ''; // 颜色值
    this.elementId = ''; // 元素唯一id
    this.colorArr = []; // 放大镜颜色数组
  }

  /**
   * 初始化canvas容器
   * @returns canvas容器
   */
  initContainer() {
    const canvasContainer = createDocument('div', styleObj.canvasContainer, document.body);
    this.canvasContainer = canvasContainer;
    return canvasContainer;
  }

  /**
   * 开启取色器
   */
  open() {
    this.elementId = getId();
    this.initContainer();
    this.html2canvas().then((canvas) => {
      if (canvas && this.canvasContainer) {
        this.initEvent(canvas);
        this.canvasContainer.style.display = 'block';
        this.canvasContainer.appendChild(canvas);
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.initFloatContainer();
      }
    });
  }

  /**
   * 初始化事件
   * @param canvas
   */
  initEvent(canvas) {
    canvas.addEventListener('mousemove', this.canvasMouseMove);
    canvas.addEventListener('mousedown', this.canvasMouseDown);
    window.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * canvas移动事件
   * @param e
   */
  canvasMouseMove = (e) => {
    if (this.context) {
      // 获取canvas相对于视口的偏移量
      const rect = this.canvas.getBoundingClientRect();
      // 计算取色时鼠标在canvas中的位置，修正x和y坐标
      const x = (e.clientX - rect.left) * window.devicePixelRatio;
      const y = (e.clientY - rect.top) * window.devicePixelRatio;
      // const x = e.pageX * window.devicePixelRatio;
      // const y = e.pageY * window.devicePixelRatio;
      const colors = this.getColors(x, y);
      if (this.floatContainer && colors) {
        this.floatContainer.style.transform = `translate(${e.pageX - 82.5}px, ${e.pageY - 82.5}px)`;
        if (this.floatContainer.style.visibility === 'hidden') {
          this.floatContainer.style.visibility = 'visible';
        }
        // 文本
        const textEl = document.getElementById(`${this.elementId}text`);
        for (let i = 0, size = COLOR_ITEM_SIZE * COLOR_ITEM_SIZE; i < size; i++) {
          const { el, row, col } = this.colorArr[i];
          const [r, g, b, a] = colors[i];
          const hexStr = toHexString({ r, g, b, a:a / 255 });
          if (row === 6 && col === 6 && textEl) {
            textEl.textContent = hexStr;
            textEl.style.color = hexStr;
            this.color = hexStr;
          }
          // 设置颜色
          el.style.backgroundColor = hexStr;
        }
      }
    }
  };

  /**
   * 监听鼠标按下
   */
  canvasMouseDown = () => {
    this.onChange?.(this.color);
    this.destroy();
  };

  /**
   * 获取放大镜所需区域颜色
   * @param x
   * @param y
   * @returns
   */
  getColors(x, y) {
    if (this.context) {
      const { data } = this.context.getImageData(x - 5, y - 5, COLOR_ITEM_SIZE, COLOR_ITEM_SIZE);
      const colors = [];
      for (let i = 0; i < data.length; i += 4) {
        colors.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
      }
      return colors;
    }
  }

  /**
   * esc按键监听
   * @param e
   */
  onKeyDown = (e) => {
    if (e.code === 'Escape') {
      this.destroy();
    }
  };

  /**
   * 初始化浮动元素容器
   */
  initFloatContainer() {
    if (this.canvasContainer) {
      const floatContainer = createDocument('div', styleObj.floatContainer, this.canvasContainer);
      const fragment = document.createDocumentFragment();
      for (let i = 1; i <= COLOR_ITEM_SIZE * COLOR_ITEM_SIZE; i++) {
        const row = Math.ceil(i / COLOR_ITEM_SIZE);
        const col = i - (row - 1) * COLOR_ITEM_SIZE;
        const style = { ...styleObj.colorItem };
        if (row === 6 && col === 6) {
          style.borderColor = '#000000';
        }
        const itemEl = createDocument('div', style, fragment);
        itemEl.setAttribute('id', `${this.elementId}${i}`);
        this.colorArr.push({ el:itemEl, row, col });
      }
      floatContainer.appendChild(fragment);
      const textEl = createDocument('div', styleObj.text, floatContainer);
      textEl.setAttribute('id', `${this.elementId}text`);
      floatContainer.addEventListener('mousemove', this.canvasMouseMove);
      floatContainer.addEventListener('mousedown', this.canvasMouseDown);
      this.floatContainer = floatContainer;
    }
  }

  /**
   * 结束销毁
   */
  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousemove', this.canvasMouseMove);
      this.canvas.removeEventListener('mousedown', this.canvasMouseDown);
    }
    if (this.floatContainer) {
      this.floatContainer.removeEventListener('mousemove', this.canvasMouseMove);
      this.floatContainer.removeEventListener('mousedown', this.canvasMouseDown);
    }
    if (this.canvasContainer) {
      document.body.removeChild(this.canvasContainer);
    }
    window.removeEventListener('keydown', this.onKeyDown);

    // 重置状态变量
    this.canvasContainer = null;
    this.canvas = null;
    this.context = null;
    this.floatContainer = null;
    this.colorArr = [];  // 重置颜色数组
  }
}
