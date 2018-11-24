'use strict';

var ADS_QUANTITY = 8; // кол-во объявлений

var AVATAR_URL = 'img/avatars/user0'; // аватарка от 01 до 08
var AVATAR_URL_MIN = 1;
var AVATAR_URL_MAX = 8; // аватарка от 01 до 08
var AVATAR_URL_EXTENSION = '.png'; // аватарка от 01 до 08

var OFFER_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var PRICE_MIN = 1000; // цена от 1000 до 1000000
var PRICE_MAX = 1000000;

var TYPES = ['palace', 'flat', 'house', 'bungalo'];

var ROOMS_MIN = 1; // комнаты от 1 до 5
var ROOMS_MAX = 5;

var GUESTS_MIN = 1; // случайное кол-во гостей
var GUESTS_MAX = 10;

var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var PIN_Y_MIN = 130; // координата метки по Y от 130 до 630
var PIN_Y_MAX = 630;
var PIN_X_MIN = 0; // min координата метки по X

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');

var pinXMax = mapPins.offsetWidth; // max координата метки по X (Значение ограничено размерами блока, в котором перетаскивается метка.)

var ads = [];
var avatarIndices;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomArrayElement = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

var generateArrayNumber = function (min, max) {
  if (min > max) {
    max = [min, min = max][0];
  }

  var arr = [];

  for (var i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
};

var getArrayMixPart = function (arr, length) {
  var arrMix = [];

  for (var i = 0; i < length; i++) {
    var index = getRandomNumber(0, arr.length - 1);
    arrMix.push(arr[index]);
    arr.splice(index, 1);
  }

  return arrMix;
};

var getArrayMix = function (arr) {
  return getArrayMixPart(arr, arr.length);
};

var generateAds = function (i) {
  var locationX = getRandomNumber(PIN_X_MIN, pinXMax);
  var locationY = getRandomNumber(PIN_Y_MIN, PIN_Y_MAX);

  return {
    'author': {
      'avatar': AVATAR_URL + avatarIndices[i] + AVATAR_URL_EXTENSION
    },
    'offer': {
      'title': getRandomArrayElement(OFFER_TITLES),
      'address': '' + locationX + ', ' + locationY,
      'price': getRandomNumber(PRICE_MIN, PRICE_MAX),
      'type': getRandomArrayElement(TYPES),
      'rooms': getRandomNumber(ROOMS_MIN, ROOMS_MAX),
      'guests': getRandomNumber(GUESTS_MIN, GUESTS_MAX),
      'checkin': getRandomArrayElement(CHECKINS),
      'checkout': getRandomArrayElement(CHECKOUTS),
      'features': getArrayMixPart(FEATURES.slice(), getRandomNumber(1, FEATURES.length)),
      'description': '',
      'photos': getArrayMix(PHOTOS.slice())
    },
    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};

var createAdsList = function () {
  avatarIndices = getArrayMix(generateArrayNumber(AVATAR_URL_MIN, AVATAR_URL_MAX));

  for (var i = 0; i < ADS_QUANTITY; i++) {
    ads.push(generateAds(i));
  }

  return ads;
};

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');

  pinElement.style = 'left: ' + (pin.location.x - Math.round(pinElementImg.width / 2)) + 'px; top: ' + (pin.location.y - pinElementImg.height) + 'px;';
  pinElementImg.src = pin.author.avatar;
  pinElementImg.alt = pin.offer.description;

  return pinElement;
};

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(renderPin(pins[i]));
  }

  return fragment;
};

var pins = createAdsList();
renderPins(pins);
map.classList.remove('map--faded');

// console.log(pins);
// console.log('author:');
// console.log(ads.map(function(a) {return a['author'];}));
// console.log('offer:');
// console.log(ads.map(function(a) {return a['offer'];}));
// console.log('location:');
// console.log(ads.map(function(a) {return a['location'];}));
// console.log('offer.features:');
// console.log(ads.map(function(a) {return a['offer'];}).map(function(a) {return a['features'];}));
// console.log('offer.photos:');
// console.log(ads.map(function(a) {return a['offer'];}).map(function(a) {return a['photos'];}));
