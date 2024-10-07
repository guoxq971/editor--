import { createGlobalState } from '@vueuse/core';
import { reactive } from 'vue';
import { Editor } from './v1/editor';

export const editor = createGlobalState(() => {
  return reactive(new Editor());
})();
