var app = new Vue({
  el: '#app',
  data: {
    colorValue: '',
    convertedValue: '',
    convertRGB: true,
    conversionMessage: ''
  },
  methods: {
    convert() {
      this.conversionMessage = '';
      this.convertedValue = '';
      if(this.convertRGB) {
        this.convertRGBtoHEX();
      }
      else {
        this.convertHEXtoRGB();
      }
    },
    clamp(inNumber) {
      let number = inNumber;
      if(inNumber > 255) {
        number = 255;
      }
      else if(inNumber < 0) {
        number = 0;
      }
      return number;
    },
    convertRGBtoHEX() {
      if(this.colorValue.startsWith('#')) {
        this.conversionMessage = "Enter a rgb color value separated by commas";
        return;
      }
      if(!this.colorValue || this.colorValue === '') {
        this.conversionMessage = "Enter some value for conversion";
        return;
      }
      if(!(/\d{1,3},\d{1,3},\d{1,3}/.exec(this.colorValue))) {
        this.conversionMessage = "Enter a valid RGB string separated by commas";
        return;
      }
      this.colorValue = this.colorValue.split(",");
      this.colorValue = this.colorValue.map((item) => {
        return Number(item) > 255 || Number(item) < 0 ? this.clamp(Number(item)) : Number(item);
      });
      this.convertedValue = this.rgbToHex(this.colorValue[0], this.colorValue[1], this.colorValue[2]);
      const root = document.documentElement;
      root.style.setProperty('--maindiv-bgcolor', this.convertedValue);
      this.copyToClipboard();
    },
    convertHEXtoRGB() {
      if(!this.colorValue.startsWith('#')) {
        this.conversionMessage = "Enter a hex value starting with a #";
        return;
      }
      if(!this.colorValue || this.colorValue === '') {
        this.conversionMessage = "Enter some value for conversion";
        return;
      }
      if(!(/^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i.exec(this.colorValue))) {
        this.conversionMessage = "Enter a valid HEX string of length 3 or 6";
        return;
      }
      const resultSix = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.colorValue);
      const resultThree = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(this.colorValue);
      if(resultThree) {
        this.convertedValue = resultThree ? {
          r: parseInt(resultThree[1]+resultThree[1], 16),
          g: parseInt(resultThree[2]+resultThree[2], 16),
          b: parseInt(resultThree[3]+resultThree[3], 16)
        } : null;
      }
      else {
        this.convertedValue = resultSix ? {
          r: parseInt(resultSix[1], 16),
          g: parseInt(resultSix[2], 16),
          b: parseInt(resultSix[3], 16)
        } : null;
      }

      this.convertedValue = `rgb(${this.convertedValue.r},${this.convertedValue.g},${this.convertedValue.b})`;
      const root = document.documentElement;
      root.style.setProperty('--maindiv-bgcolor', this.convertedValue);
      this.copyToClipboard();
    },
    rgbToHex(r, g, b) {
      return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    },
    componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    },
    copyToClipboard() {
      const el = document.createElement('textarea');
      el.value = this.convertedValue;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  },
  watch: {
    convertRGB(val) {
      if(val) {
        this.colorValue = '';
      }
      else {
        this.colorValue = '#';
      }
    }
  }
});
