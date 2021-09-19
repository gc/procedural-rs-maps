import SimplexNoise from 'simplex-noise';

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
