import { debounce } from 'e';
import tinycolor, { ColorFormats } from 'tinycolor2';
import { Pane } from 'tweakpane';

import { Canvas } from './Canvas';
import { CONSTANTS } from './constants';
import { simplex } from './util';

let octaves = [
  [1, 1],
  [0.5, 2],
  [0.25, 4],
  [0.05, 16],
  [0.01, 32],
  [0.005, 64],
  [0.005, 64],
  [1, 1],
  [0.5, 2],
  [0.25, 4],
  [0.05, 16],
  [0.01, 32],
  [0.005, 64],
  [0.005, 64]
];

interface IslandOptions {
  canvas: Canvas;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Island {
  parent: Canvas;
  x: number;
  y: number;
  w: number;
  h: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  debug = new Pane();

  constructor({ canvas, x, y, width, height }: IslandOptions) {
    this.parent = canvas;
    this.x = x;
    this.y = y;

    this.w = width;
    this.h = height;

    this.canvas = this.parent.canvas;
    this.canvas.style.backgroundColor = '#6277a6';
    this.ctx = this.canvas.getContext('2d')!;
    this.render();

    this.debug.on(
      'change',
      debounce(() => this.render(), 300)
    );

    const rawInputs: { key: keyof typeof CONSTANTS; data?: { min: number; max: number; step: number } }[] = [
      {
        key: 'CUTOFF_FACTOR',
        data: {
          min: 0,
          max: 1,
          step: 0.001
        }
      },
      {
        key: 'SCALE',
        data: { min: 0, max: 1000, step: 10 }
      },
      {
        key: 'WATER_DEPTH',
        data: { min: 0, max: 1, step: 0.001 }
      },
      {
        key: 'COLOR_BANDING',
        data: { min: 1, max: 1000, step: 1 }
      },
      {
        key: 'OCTAVES',
        data: { min: 1, max: octaves.length, step: 1 }
      },
      {
        key: 'BASE_COLOR'
      },
      {
        key: 'MAIN_COLOR'
      }
    ];
    rawInputs.map(i => this.debug.addInput(CONSTANTS, i.key, i.data));
  }

  getDistance(x: number, y: number) {
    const nx = x / this.canvas.width - 0.5;
    const ny = y / this.canvas.height - 0.5;
    const d = Math.sqrt(nx * nx + ny * ny) / Math.sqrt(CONSTANTS.CUTOFF_FACTOR);
    return d;
  }

  getPos(x: number, y: number) {
    const d = this.getDistance(x, y);
    let elevation = this.getNoise(x / CONSTANTS.SCALE, y / CONSTANTS.SCALE);
    elevation = (1 + elevation - d) / 2;
    return Math.max(0, Math.min(1, elevation));
  }

  getNoise(x: number, y: number) {
    let num = 0;
    for (const [octMultip, octScale] of octaves.slice(0, CONSTANTS.OCTAVES)) {
      num += octMultip * simplex.noise2D(x * octScale, y * octScale);
    }
    return num;
  }

  render() {
    console.log('Rendering');
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const paint = (x: number, y: number, { r, g, b, a }: ColorFormats.RGBA) => {
      a = Math.round(a * 255);
      // assert(a >= 0 && a <= 255 && Number.isInteger(a), 'paint alpha');
      image.setPixel(x, y, [r, g, b, a]);
    };

    for (let x = 0; x < this.w; x++) {
      for (let y = 0; y < this.h; y++) {
        const elevation = this.getPos(x, y);

        // assert(elevation >= 0, `elevation less than 0, ${elevation} at ${x},${y}`);
        // assert(elevation <= 1, `elevation greater than 1, ${elevation} at ${x},${y}`);

        if (elevation <= CONSTANTS.WATER_DEPTH) continue;
        paint(
          x,
          y,
          tinycolor
            .mix(
              CONSTANTS.BASE_COLOR,
              CONSTANTS.MAIN_COLOR,
              100 * (Math.trunc(elevation * CONSTANTS.COLOR_BANDING) / CONSTANTS.COLOR_BANDING)
            )
            .toRgb()
        );
      }
    }
    ctx.putImageData(image, 0, 0);
  }
}
