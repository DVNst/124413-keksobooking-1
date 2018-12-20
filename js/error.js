'use strict';

(function () {
  var errorContainer = document.querySelector('main');
  var errorBlock = document.querySelector('#error').content.querySelector('.error');
  var errorButton = null;

  var errorClose = function () {
    errorBlock.classList.add('hidden');

    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', errorClose);
    errorButton.removeEventListener('click', errorClose);
    window.adsUploaded = false;
  };

  var onErrorEscPress = function (evt) {
    window.util.isEscEvent(evt, errorClose);
  };

  var addErrorBlock = function () {
    var fragment = errorBlock.cloneNode(true);
    fragment.classList.add('hidden');
    errorContainer.appendChild(fragment);

    errorBlock = errorContainer.querySelector('.error');
    errorButton = errorBlock.querySelector('.error__button');
  };

  window.error = {
    render: function () {
      errorBlock.classList.remove('hidden');
      document.addEventListener('keydown', onErrorEscPress);
      document.addEventListener('click', errorClose);
      errorButton.addEventListener('click', errorClose);
    }
  };

  addErrorBlock();
})();
