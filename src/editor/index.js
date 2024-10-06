import { createGlobalState } from '@vueuse/core';
import { Editor } from './v1/editor';
import { reactive } from 'vue';

export const editor = createGlobalState(() => {
  return reactive(new Editor());
})();
