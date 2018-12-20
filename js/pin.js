'use strict';
// (map.js) модуль, который отвечает за создание пина — метки на карте;

(function () {
  var PIN_HEIGHT = 70; // высота метки
  var PIN_WIDTH = 50;
  var pins = null;

  var activeAdsItem = null;

  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  var renderItem = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = pin.location.x - Math.round(PIN_WIDTH / 2) + 'px';
    pinElement.style.top = pin.location.y - PIN_HEIGHT + 'px';
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
  };

  window.pin = {
    render: function (data) {
      var fragment = document.createDocumentFragment();
      pins = data;

      for (var i = 0; i < pins.length; i++) {
        fragment.appendChild(renderItem(pins[i]));
      }

      return fragment;
    },
    delete: function () {
      var pinList = document.querySelector('.map__pins').querySelectorAll('.map__pin:not(.map__pin--main)');
      for (var i = 0; i < pinList.length; i++) {
        pinList[i].remove();
      }
    },
    closePopup: function () {
      activeAdsItem.classList.remove('map__pin--active');
      activeAdsItem = null;
    }
  };
})();
