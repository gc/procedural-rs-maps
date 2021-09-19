import SimplexNoise from 'simplex-noise';
import { ColorFormats } from 'tinycolor2';

export const simplex = new SimplexNoise();

// eslint-disable-next-line func-names
ImageData.prototype.getPixel = function (x, y) {
  let i = (this.width * Math.round(y) + Math.round(x)) * 4;
  return [this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]];
};
/* eslint-disable prefer-destructuring */

// eslint-disable-next-line func-names
ImageData.prototype.setPixel = function (x, y, rgba) {
  if (rgba[3] === 0) return;
  let i = (this.width * Math.round(y) + Math.round(x)) * 4;
  this.data[i] = rgba[0];
  this.data[i + 1] = rgba[1];
  this.data[i + 2] = rgba[2];
  this.data[i + 3] = rgba[3];
};

export function assert(bool: boolean, str: string) {
  if (!bool) throw new Error(str);
}

export function mix(rgb1: ColorFormats.RGBA, rgb2: ColorFormats.RGBA, amount = 50) {
  let p = amount / 100;

  let r = (rgb2.r - rgb1.r) * p + rgb1.r;
  let g = (rgb2.g - rgb1.g) * p + rgb1.g;
  let b = (rgb2.b - rgb1.b) * p + rgb1.b;
  let a = (rgb2.a - rgb1.a) * p + rgb1.a;

  return { r, g, b, a };
}
