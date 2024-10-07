import useContextMenu from '../lib/contextMenu/useContextMenu';

export function ContextMenu(editor) {
  let contextMenu;
  this.init = (containerRef) => {
    contextMenu = useContextMenu(containerRef);
    return contextMenu;
  };

  this.open = (e, menu = []) => {
    if (contextMenu) {
      contextMenu.handleContextMenu(e, menu);
    }
  };
}
