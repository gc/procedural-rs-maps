export class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor({ id }: { id: string | HTMLCanvasElement }) {
    if (typeof id === 'string') {
      this.canvas = document.getElementById(id) as HTMLCanvasElement;
    } else {
      this.canvas = id;
    }
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;

    window.addEventListener('resize', this.resize, false);
    this.resize();
  }

  get height() {
    return this.canvas.height;
  }

  get width() {
    return this.canvas.width;
  }

  resize = () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };
}
