'use strict';
// (map.js) модуль, который отвечает за создание пина — метки на карте;

(function () {
  var PIN_HEIGHT = 70; // высота метки

  window.currentAdsItem = null;
  window.mapFiltersContainer = document.querySelector('.map__filters-container');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var recoveryCurrentAdsItem = function () {
    currentAdsItem.classList.remove('map__pin--active');
  };

  window.pin = {
    renderPin : function (pin) {
      var pinElement = pinTemplate.cloneNode(true);

      pinElement.style = 'left: ' + (pin.location.x - Math.round(PIN_WIDTH / 2)) + 'px; top: ' + (pin.location.y - PIN_HEIGHT) + 'px;';
      pinElement.querySelector('img').src = pin.author.avatar;
      pinElement.querySelector('img').alt = pin.offer.description;

      pinElement.addEventListener('click', function () {
        if (pinElement === currentAdsItem) {
          return;
        }

        if (currentAdsItem) {
          recoveryCurrentAdsItem();
        }

        mapFiltersContainer.before(window.card.renderMapCard(pin));

        popup.classList.remove('hidden');
        document.addEventListener('keydown', onPopupEscPress);

        currentAdsItem = pinElement;
        currentAdsItem.classList.add('map__pin--active');
      });

      return pinElement;
    }
  };
})();
