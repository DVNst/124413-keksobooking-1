'use strict';
// (map.js) модуль, который отвечает за создание пина — метки на карте;

(function () {
  var PIN_HEIGHT = 70; // высота метки

  window.currentAdsItem = null;
  window.mapFiltersContainer = document.querySelector('.map__filters-container');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  window.popup = null;

  var recoveryCurrentAdsItem = function () {
    window.currentAdsItem.classList.remove('map__pin--active');
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, window.pin.closePopup);
  };

  window.pin = {
    closePopup: function () {
      window.popup.classList.add('hidden');
      recoveryCurrentAdsItem();
      window.currentAdsItem = null;
      document.removeEventListener('keydown', onPopupEscPress);
    },
    render: function (pin) {
      var pinElement = pinTemplate.cloneNode(true);

      pinElement.style = 'left: ' + (pin.location.x - Math.round(window.PIN_WIDTH / 2)) + 'px; top: ' + (pin.location.y - PIN_HEIGHT) + 'px;';
      pinElement.querySelector('img').src = pin.author.avatar;
      pinElement.querySelector('img').alt = pin.offer.description;

      pinElement.addEventListener('click', function () {
        if (pinElement === window.currentAdsItem) {
          return;
        }

        if (window.currentAdsItem) {
          recoveryCurrentAdsItem();
        }

        window.mapFiltersContainer.before(window.card.render(pin));

        window.popup.classList.remove('hidden');
        document.addEventListener('keydown', onPopupEscPress);

        window.currentAdsItem = pinElement;
        window.currentAdsItem.classList.add('map__pin--active');
      });

      return pinElement;
    }
  };
})();
