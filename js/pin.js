'use strict';
// (map.js) модуль, который отвечает за создание пина — метки на карте;

(function () {
  var PIN_HEIGHT = 70; // высота метки
  var PIN_WIDTH = 50;

  var activeAdsItem = null;

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
    render: function (pin) {
      var pinElement = pinTemplate.cloneNode(true);

      pinElement.style = 'left: ' + (pin.location.x - Math.round(PIN_WIDTH / 2)) + 'px; top: ' + (pin.location.y - PIN_HEIGHT) + 'px;';
      pinElement.querySelector('img').src = pin.author.avatar;
      pinElement.querySelector('img').alt = pin.offer.description;

      pinElement.addEventListener('click', function () {
        if (pinElement === activeAdsItem) {
          return;
        }

        if (activeAdsItem) {
          activeAdsItem.classList.remove('map__pin--active');
        }

        window.card.render(pin);
        activeAdsItem = pinElement;
        activeAdsItem.classList.add('map__pin--active');
      });

      return pinElement;
    },
    delete: function (mapPins) {
      var pins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pins.length; i++) {
        pins[i].remove();
      }
    },
    closePopup: function () {
      activeAdsItem.classList.remove('map__pin--active');
      activeAdsItem = null;
    }
  };
})();
