'use strict';
// модуль, который создаёт данные;

(function () {
  var ADS_QUANTITY = 8; // кол-во объявлений

  var AVATAR_URL = 'img/avatars/user0'; // аватарка от 01 до 08
  var AVATAR_URL_MIN = 1;
  var AVATAR_URL_MAX = 8; // аватарка от 01 до 08
  var AVATAR_URL_EXTENSION = '.png'; // аватарка от 01 до 08

  var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  var PRICE_MIN = 1000; // цена от 1000 до 1000000
  var PRICE_MAX = 1000000;

  window.TYPES = ['palace', 'flat', 'house', 'bungalo'];

  window.PIN_Y_MIN = 130; // координата метки по Y от 130 до 630
  window.PIN_Y_MAX = 630;
  window.PIN_WIDTH = 50; // ширина метки

  var ROOMS_MIN = 1; // комнаты от 1 до 5
  var ROOMS_MAX = 5;

  var GUESTS_MIN = 1; // случайное кол-во гостей
  var GUESTS_MAX = 10;

  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

  var pinXMin = Math.round(window.PIN_WIDTH / 2); // min координата метки по X
  var pinXMax = document.querySelector('.map__pins').offsetWidth - Math.round(window.PIN_WIDTH / 2); // max координата метки по X (Значение ограничено размерами блока, в котором перетаскивается метка.)

  var avatarIndices;

  var generateAds = function (i) {
    var locationX = window.util.getRandomNumber(pinXMin, pinXMax);
    var locationY = window.util.getRandomNumber(window.PIN_Y_MIN, window.PIN_Y_MAX);

    return {
      'author': {
        'avatar': AVATAR_URL + avatarIndices[i] + AVATAR_URL_EXTENSION
      },
      'offer': {
        'title': window.util.getRandomArrayElement(OFFER_TITLES),
        'address': '' + locationX + ', ' + locationY,
        'price': window.util.getRandomNumber(PRICE_MIN, PRICE_MAX),
        'type': window.util.getRandomArrayElement(window.TYPES),
        'rooms': window.util.getRandomNumber(ROOMS_MIN, ROOMS_MAX),
        'guests': window.util.getRandomNumber(GUESTS_MIN, GUESTS_MAX),
        'checkin': window.util.getRandomArrayElement(CHECKINS),
        'checkout': window.util.getRandomArrayElement(CHECKOUTS),
        'features': window.util.getShuffledArray(FEATURES.slice(), window.util.getRandomNumber(1, FEATURES.length)),
        'description': '',
        'photos': window.util.getShuffledArray(PHOTOS.slice())
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  };

  window.data = {
    createAdsList: function () {
      avatarIndices = window.util.getShuffledArray(window.util.generateArrayNumber(AVATAR_URL_MIN, AVATAR_URL_MAX));
      var adsArray = [];

      for (var i = 0; i < ADS_QUANTITY; i++) {
        adsArray.push(generateAds(i));
      }

      return adsArray;
    }
  };
})();
