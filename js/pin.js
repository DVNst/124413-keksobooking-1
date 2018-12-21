'use strict';
// (map.js) модуль, который отвечает за создание пина — метки на карте;

(function () {
  var PIN_HEIGHT = 70; // высота метки
  var PIN_WIDTH = 50;
  var PIN_QUANTITY = 5;

  var priceMinToTypePrice = {
    'middle': 10000,
    'low': 0,
    'high': 50000
  };

  var priceMaxToTypePrice = {
    'middle': 50000,
    'low': 10000,
    'high': Infinity
  };

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

  var getDistance = function (pin) {
    return Math.sqrt(Math.pow(window.mapPinMainCoordinates.x - pin.location.x, 2) + Math.pow(window.mapPinMainCoordinates.y - pin.location.y, 2));
  };

  window.pin = {
    render: function (data) {
      var fragment = document.createDocumentFragment();
      var takeNumber = data.length > PIN_QUANTITY ? PIN_QUANTITY : data.length;
      if (!pins) {
        pins = data;
      }

      for (var i = 0; i < takeNumber; i++) {
        fragment.appendChild(renderItem(data[i]));
      }

      window.mapPins.appendChild(fragment);
    },
    update: function (type, price, rooms, guests, features) {
      var pinsNew = pins.slice();

      pinsNew = pinsNew.sort(function (a, b) {
        return getDistance(a) - getDistance(b);
      });

      pinsNew = pinsNew.filter(function (pin) {
        return (type === 'any') || (pin.offer.type === type);
      });

      pinsNew = pinsNew.filter(function (pin) {
        return (price === 'any') || (pin.offer.price >= priceMinToTypePrice[price] && pin.offer.price <= priceMaxToTypePrice[price]);
      });

      pinsNew = pinsNew.filter(function (pin) {
        return (rooms === 'any') || (pin.offer.rooms === Number(rooms));
      });

      pinsNew = pinsNew.filter(function (pin) {
        return (guests === 'any') || (pin.offer.guests === Number(guests));
      });

      if (features.length > 0) {
        features.forEach(function (featuresItem) {
          pinsNew = pinsNew.filter(function (pin) {
            return pin.offer.features.some(function (item) {
              return item === featuresItem;
            });
          });
        });
      }

      window.pin.render(pinsNew);
    },
    delete: function () {
      var pinList = window.mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      pinList.forEach(function (item) {
        item.remove();
      });
    },
    closePopup: function () {
      if (activeAdsItem) {
        activeAdsItem.classList.remove('map__pin--active');
        activeAdsItem = null;
      }
    }
  };
})();
