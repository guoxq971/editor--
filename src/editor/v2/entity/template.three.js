import * as THREE from "three";
export class TemplateThree {
  constructor(editor, template) {
    this.editor = editor;
    this.template = template;
    this.meshList = [];
    this.three = null;
    this.size = this.editor.config.getKey('canvas/three/size');
  }
  // 创建
  async create() {
    const path = this.template.config3d?.glbPath;
    this.three = await loadThree(path);
    this.meshList = this.three.meshList.map((mesh) => {
      const meshItem = new MeshItem(this.editor, mesh);
      const view3d = this.template.config3d.viewList.find((v3d) => v3d.materialName === mesh.materialName);
      const view2d = this.template.viewList.find((v) => v.id == view3d?.viewId);
      meshItem.view3d = view3d;
      meshItem.view2d = view2d;
      return meshItem;
    });
    this.meshList.forEach((mesh) => mesh.update());
  }
  // 销毁
  async destroy() {
    this.meshList.forEach((mesh) => mesh.destroy());
    this.meshList = [];
    this.three?.destroy();
    this.three = null;
  }
}

class MeshItem {
  constructor(editor, mesh) {
    this.editor = editor;
    this.mesh = mesh;
    this.texture = null;
    this.canvas = null;
    this.materialName = null;
    this.view2d = null;
    this.view3d = null;
  }
  // 销毁
  destroy() {
    this.canvas.remove();
    this.canvas = null;
    this.mesh = null;
    this.texture = null;
    this.materialName = null;
    this.view2d = null;
    this.view3d = null;
  }
  // 更新材质
  update() {
    // 获取颜色
    const color = this.editor.actives.color || this.template.colorList[0];
    const color3d = this.template.config3d.colorList.find((c3d) => color.name === c3d.colorName)?.list.find((c) => c.materialName === this.materialName);
    const colorCode = color3d?.colorCode || '#ffffff';
    // 如果canvas不存在 创建离屏canvas
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.size;
      this.canvas.height = this.size;
    }
    // 渲染
    const ctx = this.canvas.getContext('2d');
    ctx.fillStyle = colorCode;
    ctx.fillRect(0, 0, this.size, this.size);
    if (this.view2d) {
      const _canvas = (({ x, y, width, height }, layer) => {
        return layer._toKonvaCanvas({ x, y, width, height, pixelRatio: this.size / width });
      })(this.editor.container.templateBbox, this.view2d.nodes.layer);
      ctx.drawImage(_canvas, 0, 0, this.size, this.size);
    }
    // 创建纹理
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.needsUpdate = true;
    // 绑定纹理
    this.mesh.material.map = this.texture;
    this.mesh.material.needsUpdate = true;
  }
}




