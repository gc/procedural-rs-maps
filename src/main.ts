import { Canvas } from './Canvas';
import { Island } from './Island';

const canvas = new Canvas({ id: 'c' });

new Island({
  canvas,
  x: 0,
  y: 0,
  height: canvas.height,
  width: canvas.width
});
