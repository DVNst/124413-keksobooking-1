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
var TYPES_RUS = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];

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
var PIN_WIDTH = 50; // ширина метки
var PIN_HEIGHT = 70; // высота метки
var PIN_MAIN_WIDTH = 62; // ширина главной метки
var PIN_MAIN_HEIGHT = 62; // высота главной метки
var PIN_MAIN_ARROW_HEIGHT = 22; // высота хвостика главной метки

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPinMain = mapPins.querySelector('.map__pin--main');

var pinXMax = mapPins.offsetWidth; // max координата метки по X (Значение ограничено размерами блока, в котором перетаскивается метка.)

var ads = [];
var avatarIndices;

var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapFilter = mapFiltersContainer.querySelectorAll('.map__filter');
var mapFilterFieldset = mapFiltersContainer.querySelectorAll('fieldset');
var adForm = document.querySelector('.ad-form');
var adFormFieldset = adForm.querySelectorAll('fieldset');
var adFormAddress = adForm.querySelector('#address');

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

var getShuffledArray = function (arr, length) {
  var arrMix = [];

  if (!length) {
    length = arr.length;
  }

  for (var i = 0; i < length; i++) {
    var index = getRandomNumber(0, arr.length - 1);
    arrMix.push(arr[index]);
    arr.splice(index, 1);
  }

  return arrMix;
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
      'features': getShuffledArray(FEATURES.slice(), getRandomNumber(1, FEATURES.length)),
      'description': '',
      'photos': getShuffledArray(PHOTOS.slice())
    },
    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};

var createAdsList = function () {
  avatarIndices = getShuffledArray(generateArrayNumber(AVATAR_URL_MIN, AVATAR_URL_MAX));

  for (var i = 0; i < ADS_QUANTITY; i++) {
    ads.push(generateAds(i));
  }

  return ads;
};

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style = 'left: ' + (pin.location.x - Math.round(PIN_WIDTH / 2)) + 'px; top: ' + (pin.location.y - PIN_HEIGHT) + 'px;';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.description;

  return pinElement;
};

var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(renderPin(pins[i]));
  }

  return fragment;
};

var getMapCardFeatures = function (pin) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pin.offer.features.length; i++) {
    var feature = document.createElement('li');
    feature.className = 'popup__feature' + ' popup__feature--' + pin.offer.features[i];

    fragment.appendChild(feature);
  }

  return fragment;
};

var getMapCardPhotos = function (pin) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pin.offer.photos.length; i++) {
    var image = document.createElement('img');
    image.src = pin.offer.photos[i];
    image.className = 'popup__photo';
    image.width = '45';
    image.height = '40';
    image.alt = 'Фотография жилья';

    fragment.appendChild(image);
  }

  return fragment;
};

var renderMapCard = function (pin) {
  var fragment = document.createDocumentFragment();
  var mapCardElement = mapCardTemplate.cloneNode(true);

  mapCardElement.querySelector('.popup__avatar').src = pin.author.avatar;
  mapCardElement.querySelector('.popup__title').textContent = pin.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = pin.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = TYPES_RUS[TYPES.indexOf(pin.offer.type)];
  mapCardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;

  mapCardElement.querySelector('.popup__features').innerHTML = '';
  mapCardElement.querySelector('.popup__features').appendChild(getMapCardFeatures(pin));

  mapCardElement.querySelector('.popup__description').textContent = pin.offer.description;

  mapCardElement.querySelector('.popup__photos').innerHTML = '';
  mapCardElement.querySelector('.popup__photos').appendChild(getMapCardPhotos(pin));

  fragment.appendChild(mapCardElement);

  return fragment;
};

var addDisabled = function (filters, disabled) {
  for (var i = 0; i < filters.length; i++) {
    filters[i].disabled = disabled;
  }
};

var disabledFilters = function (disabled) {
  addDisabled(mapFilter, disabled);
  addDisabled(mapFilterFieldset, disabled);
  addDisabled(adFormFieldset, disabled);
};

var addAddress = function (extraHeight) {
  extraHeight = extraHeight || 0;
  adFormAddress.value = '' + (mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2)) + ', ' + (mapPinMain.offsetTop + mapPinMain.offsetHeight + extraHeight);
};

// var pins = createAdsList();
// mapPins.appendChild(renderPins(pins));
// mapFiltersContainer.before(renderMapCard(pins[0]));
// map.classList.remove('map--faded');

disabledFilters(true);
addAddress();

mapPinMain.addEventListener('mouseup', function () {
  disabledFilters(false);
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  addAddress(PIN_MAIN_ARROW_HEIGHT);
});
