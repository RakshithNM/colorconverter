var app = new Vue({
  el: '#app',
  data: {
    colorValue: '',
    convertedValue: '',
    convertRGB: true,
  },
  methods: {
    convert() {
      if(this.convertRGB) {
        this.convertRGBtoHEX();
      }
      else {
        this.convertHEXtoRGB();
      }
    },
    convertRGBtoHEX() {
      this.colorValue = this.colorValue.split(",");
      this.colorValue = this.colorValue.map((item) => Number(item));
      this.convertedValue = this.rgbToHex(this.colorValue[0], this.colorValue[1], this.colorValue[2]);
    },
    convertHEXtoRGB() {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.colorValue);
      this.convertedValue = result ? { 
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    componentToHex(c) {
      var hex = c.toString(16);
      console.log(hex);
      return hex.length == 1 ? "0" + hex : hex;
    }
  }
});
