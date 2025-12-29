var app = new Vue({
  el: '#app',
  data: {
    colorValue: '',
    convertedValue: '',
    convertRGB: true,
    conversionMessage: '',
    showToast: false,
    toastMessage: ''
  },
  methods: {
    convert() {
      this.conversionMessage = '';
      this.convertedValue = '';
      if (this.convertRGB) {
        this.convertRGBtoHEX();
      }
      else {
        this.convertHEXtoRGB();
      }
    },
    clamp(inNumber) {
      let number = Number(inNumber);
      if (Number.isNaN(number)) {
        return 0;
      }
      if (number > 255) {
        number = 255;
      }
      else if (number < 0) {
        number = 0;
      }
      return number;
    },
    convertRGBtoHEX() {
      const rawValue = this.colorValue;
      if (!rawValue || rawValue.trim() === '') {
        this.conversionMessage = "Enter some value for conversion";
        return;
      }
      if (rawValue.trim().startsWith('#')) {
        this.conversionMessage = "Enter a rgb color value separated by commas";
        return;
      }
      const match = /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/.exec(rawValue.trim());
      if (!match) {
        this.conversionMessage = "Enter a valid RGB string separated by commas";
        return;
      }
      const [, rStr, gStr, bStr] = match;
      const rgbValues = [rStr, gStr, bStr].map((item) => this.clamp(item));
      this.convertedValue = this.rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);
      const root = document.documentElement;
      root.style.setProperty('--maindiv-bgcolor', this.convertedValue);
      this.copyToClipboard();
    },
    convertHEXtoRGB() {
      const rawValue = this.colorValue;
      if (!rawValue || rawValue.trim() === '') {
        this.conversionMessage = "Enter some value for conversion";
        return;
      }
      const trimmedValue = rawValue.trim();
      if (!trimmedValue.startsWith('#')) {
        this.conversionMessage = "Enter a hex value starting with a #";
        return;
      }
      if (!/^#(?:[0-9A-F]{3}|[0-9A-F]{6})$/i.test(trimmedValue)) {
        this.conversionMessage = "Enter a valid HEX string of length 3 or 6";
        return;
      }
      const resultSix = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(trimmedValue);
      const resultThree = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(trimmedValue);
      if (resultThree) {
        this.convertedValue = {
          r: parseInt(resultThree[1] + resultThree[1], 16),
          g: parseInt(resultThree[2] + resultThree[2], 16),
          b: parseInt(resultThree[3] + resultThree[3], 16)
        };
      }
      else {
        this.convertedValue = resultSix ? {
          r: parseInt(resultSix[1], 16),
          g: parseInt(resultSix[2], 16),
          b: parseInt(resultSix[3], 16)
        } : null;
      }

      if (!this.convertedValue) {
        this.conversionMessage = "Unable to convert HEX to RGB";
        return;
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
      const valueToCopy = this.convertedValue;
      if (!valueToCopy) {
        return;
      }

      // Prefer modern async clipboard API when available
      const fallbackCopy = () => {
        const el = document.createElement('textarea');
        el.value = valueToCopy;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand('copy');
          this.toastMessage = 'Copied to clipboard';
          this.showToast = true;
        } catch (e) {
          this.toastMessage = 'Unable to copy to clipboard';
          this.showToast = true;
        } finally {
          document.body.removeChild(el);
          setTimeout(() => {
            this.showToast = false;
          }, 2000);
        }
      };

      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(valueToCopy)
          .then(() => {
            this.toastMessage = 'Copied to clipboard';
            this.showToast = true;
            setTimeout(() => {
              this.showToast = false;
            }, 2000);
          })
          .catch(() => {
            fallbackCopy();
          });
      } else {
        fallbackCopy();
      }
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
