'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // 0.5 секунд
  var lastTimeout;

  window.debounce = function (cb) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
  };
})();
