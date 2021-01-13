export const square = {
  width: 12,
  height: 12,
  data: new Uint8Array(12 * 12 * 4),
  render: function () {
    const bytesPerPixel = 4;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const offset = (y * this.width + x) * bytesPerPixel;
        this.data[offset + 0] = 0;
        this.data[offset + 1] = 128;
        this.data[offset + 2] = 128;
        this.data[offset + 3] = 255;
      }
    }

    // not sure why this needs an initial color, it is going to be repainted anyways
    return true;
  },
};
