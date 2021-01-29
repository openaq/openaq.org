export const square = {
  width: 32,
  height: 32,
  data: new Uint8Array(32 * 32 * 4),
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
    return true;
  },
};

export const circle = {
  width: 32,
  height: 32,
  radius: 16,
  center: 16,
  data: new Uint8Array(32 * 32 * 4),
  render: function () {
    const bytesPerPixel = 4;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const offset = (y * this.width + x) * bytesPerPixel;
        this.data[offset + 0] = 0;
        this.data[offset + 1] = 128;
        this.data[offset + 2] = 128;

        let d = Math.sqrt(
          Math.pow(this.center - x, 2) + Math.pow(this.center - y, 2)
        );
        if (d <= this.radius) {
          this.data[offset + 3] = 255;
        } else {
          this.data[offset + 3] = 0;
        }
      }
    }
    return true;
  },
};
