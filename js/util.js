'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    },
    getShuffledArray: function (arr, length) {
      var arrMix = [];

      if (!length) {
        length = arr.length;
      }

      for (var i = 0; i < length; i++) {
        var index = this.getRandomNumber(0, arr.length - 1);
        arrMix.push(arr[index]);
        arr.splice(index, 1);
      }

      return arrMix;
    },
    generateArrayNumber: function (min, max) {
      if (min > max) {
        max = [min, min = max][0];
      }

      var arr = [];

      for (var i = min; i <= max; i++) {
        arr.push(i);
      }
      return arr;
    },
    getRandomArrayElement: function (arr) {
      return arr[this.getRandomNumber(0, arr.length - 1)];
    }
  };
})();
