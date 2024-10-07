import { onMounted, onUnmounted, ref, nextTick } from 'vue';

export default function (containerRef) {
  const showMenu = ref(false);
  const x = ref(0);
  const y = ref(0);
  const menu = ref([]);
  const handleContextMenu = (e, _menu) => {
    menu.value = _menu || [];
    e.preventDefault();
    e.stopPropagation();
    showMenu.value = true;
    x.value = e.clientX;
    y.value = e.clientY;
  };
  function closeMenu() {
    showMenu.value = false;
  }
  onMounted(() => {
    const div = containerRef.value;
    div?.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('mousedown', closeMenu, false);
    window.addEventListener('contextmenu', closeMenu, false);
  });
  onUnmounted(() => {
    const div = containerRef.value;
    div?.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('mousedown', closeMenu, false);
    window.removeEventListener('contextmenu', closeMenu, false);
  });
  return {
    showMenu,
    x,
    y,
    handleContextMenu,
    menu,
  };
}
