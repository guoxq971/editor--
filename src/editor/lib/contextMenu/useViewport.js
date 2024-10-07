import { ref } from 'vue';
const windowW = ref(document.documentElement.clientWidth);
const windowH = ref(document.documentElement.clientHeight);

window.addEventListener('resize', () => {
  windowW.value = document.documentElement.clientWidth;
  windowH.value = document.documentElement.clientHeight;
});

export default function () {
  return {
    windowW,
    windowH,
  };
}
