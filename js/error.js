'use strict';

(function () {
  var errorContainer = document.querySelector('main');
  var errorBlock = document.querySelector('#error').content.querySelector('.error');

  window.error = {
    render: function () {
      errorContainer.appendChild(errorBlock.cloneNode(true));
    }
  };
})();
