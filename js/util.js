'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }
  };
})();
