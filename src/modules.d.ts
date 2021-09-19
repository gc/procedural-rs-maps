interface ImageData {
  getPixel(x: number, y: number): [number, number, number, number];
  setPixel(x: number, y: number, rgba: [number, number, number, number]);
}
