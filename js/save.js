'use strict';

(function () {
  var saveBlock = document.querySelector('#success').content.querySelector('.success');

  var saveClose = function () {
    saveBlock.classList.add('hidden');

    document.removeEventListener('keydown', onSaveEscPress);
    document.removeEventListener('click', saveClose);
  };

  var onSaveEscPress = function (evt) {
    window.util.isEscEvent(evt, saveClose);
  };

  var addSaveBlock = function () {
    var fragment = saveBlock.cloneNode(true);
    fragment.classList.add('hidden');
    document.querySelector('main').appendChild(fragment);

    saveBlock = document.querySelector('main').querySelector('.success');
  };

  window.save = {
    render: function () {
      saveBlock.classList.remove('hidden');
      document.addEventListener('keydown', onSaveEscPress);
      document.addEventListener('click', saveClose);
    }
  };

  addSaveBlock();
})();
