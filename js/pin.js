'use strict';
// (map.js) модуль, который отвечает за создание пина — метки на карте;

(function () {
  var PIN_HEIGHT = 70; // высота метки

  window.mapFiltersContainer = document.querySelector('.map__filters-container');

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
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
          window.currentAdsItem.classList.remove('map__pin--active');
        }

        window.mapFiltersContainer.before(window.card.render(pin));

        window.popup.classList.remove('hidden');
        document.addEventListener('keydown', window.card.onPopupEscPress);

        window.currentAdsItem = pinElement;
        window.currentAdsItem.classList.add('map__pin--active');
      });

      return pinElement;
    }
  };
})();
