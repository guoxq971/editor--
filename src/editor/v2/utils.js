import { Message } from 'element-ui';

export class Utils {
  constructor(editor) {
    this.editor = editor;
  }

  uuid() {
  }

  toast(message, type = 'warning') {
    let _config = {};
    if (typeof message === 'object') {
      _config = message;
    }
    const config = Object.assign({
      type,
      message,
    }, _config);

    Message[config.type](config);
  }
}

