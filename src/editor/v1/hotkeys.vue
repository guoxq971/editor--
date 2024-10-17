<template>
  <div>
    <input ref="inputRef" readonly v-model="state.hotkey" @keydown="handleKeydown" @focus="start" @blur="stop"
           placeholder="请输入快捷键" />
    <button @click="start">Start</button>
    <button @click="stop">Stop</button>
    <p>Recording: {{ isRecording ? 'Yes' : 'No' }}</p>
    <p>Hotkey: {{ state.hotkey }}</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const mappedKeys = {
  esc:'escape',
  return:'enter',
  '.':'period',
  ',':'comma',
  '-':'slash',
  ' ':'space',
  '`':'backquote',
  '#':'backslash',
  '+':'bracketright',
  ShiftLeft:'shift',
  ShiftRight:'shift',
  AltLeft:'alt',
  AltRight:'alt',
  MetaLeft:'meta',
  MetaRight:'meta',
  OSLeft:'meta',
  OSRight:'meta',
  ControlLeft:'ctrl',
  ControlRight:'ctrl',
  Delete:'delete',
};

function mapKey(key) {
  return (mappedKeys[key] || key)
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, '');
}


const MODIFIERS = ['ctrl', 'meta', 'alt', 'shift'];
const allowedChars = [
  'backquote',
  'space',
  'enter',
  'minus',
  'plus',
  'equal',
  'backspace',
  'escape',
  'pageup',
  'pagedown',
  'home',
  'end',
  'delete',
  'tab',
  'bracketleft',
  'bracketright',
  'semicolon',
  'quote',
  'comma',
  'period',
  'slash',
  'backslash',
];

// 验证是否是有效的快捷键组合
const verify = (hotkey) => {
  const hasModifier = MODIFIERS.some((modifier) => hotkey.has(modifier));
  const hasNormalKey = Array.from(hotkey).some((key) => !MODIFIERS.includes(key));
  return hasModifier && hasNormalKey;
};

const inputRef = ref(null);
const blurRef = ref(null);
const keys = ref(new Set());
const isRecording = ref(false);

const state = reactive({
  hotkey:'',
});

// 重置记录
const reset = () => {
  keys.value = new Set();
  blurRef.value = null;
};

// 开始记录
const start = () => {
  reset();
  isRecording.value = true;
  inputRef.value.focus();
};

// 停止记录
const stop = () => {
  reset();
  isRecording.value = false;
  inputRef.value.blur();
};

// 键盘事件处理
const handleKeydown = (event) => {
  const key = mapKey(event.code); // 将 event.code 转换为我们需要的按键名

  const someModifierIsPressed = MODIFIERS.some((key) => event[`${key}Key`]);
  if (!isRecording.value) {
    if (key === 'enter') {
      start();
    }
    return;
  }

  event.stopPropagation();
  event.preventDefault();

  if (['escape', 'enter'].includes(key) && !someModifierIsPressed) {
    isRecording.value = false;
    blurRef.value = key;
    event.target.blur();
    return;
  }

  const keyIsAlphaNum = event.keyCode >= 48 && event.keyCode <= 90; // a-z, A-Z, 0-9
  const keyIsBetweenF1andF12 = event.keyCode >= 112 && event.keyCode <= 123; // F1-F12
  const keyIsAllowedChar = allowedChars.includes(key);

  const modifiers = event.key === 'Delete' ? new Set(['delete']) : new Set(MODIFIERS.filter((mod) => event[`${mod}Key`]));

  if (modifiers.size > 0) {
    const normalKey = (keyIsAlphaNum || keyIsBetweenF1andF12 || keyIsAllowedChar) && key;
    keys.value = new Set([...Array.from(modifiers), normalKey].filter(Boolean));
    state.hotkey = Array.from(keys.value).join('+');
  } else {
    reset();
  }
};

onMounted(() => {
  inputRef.value?.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  inputRef.value?.removeEventListener('keydown', handleKeydown);
});
</script>

<style>
/* 样式可根据需求自行调整 */
</style>
