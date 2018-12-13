'use strict';
// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте;

  (function () {

  var ROOM_NUMBER_CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var TIMEIN = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  var TIMEOUT = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  var TYPES_PRICE_MIN = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var PIN_MAIN_ARROW_HEIGHT = 22; // высота хвостика главной метки

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var firstPageActivated = true;

  var mapPinMain = mapPins.querySelector('.map__pin--main');

  var ads = [];


  var popupClose;

  var mapFilter = mapFiltersContainer.querySelectorAll('.map__filter');
  var mapFilterFieldset = mapFiltersContainer.querySelectorAll('fieldset');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldset = adForm.querySelectorAll('fieldset');
  var adFormAddress = adForm.querySelector('#address');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(window.pin.renderPin(pins[i]));
    }

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
    adFormAddress.value = (mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2)) + ', ' + (mapPinMain.offsetTop + mapPinMain.offsetHeight + extraHeight);
  };

  var closePopup = function () {
    popup.classList.add('hidden');
    recoveryCurrentAdsItem();
    currentAdsItem = null;
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };


  var activatePage = function () {
    disabledFilters(false);
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    addAddress(PIN_MAIN_ARROW_HEIGHT);

    ads = window.data.createAdsList();
    mapPins.appendChild(renderPins(ads));

    popup = window.card.renderMapCard(ads[0], true);
    popup.children[0].classList.add('hidden');
    mapFiltersContainer.before(popup);

    popup = document.querySelector('.map__card, .popup');
    popupClose = popup.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      closePopup();
    });

    popupClose.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        closePopup();
      }
    });

    // mapPinMain.removeEventListener('mouseup', onMapPinMainMouseUp);
  };

  var onMapPinMainMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinMain = {
      xMin: -Math.round(mapPinMain.offsetWidth / 2),
      xMax: mapPins.offsetWidth - Math.round(mapPinMain.offsetWidth / 2),
      yMin: 0,
      yMax: mapPins.offsetHeight - mapPinMain.offsetHeight - PIN_MAIN_ARROW_HEIGHT + 7
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      if (firstPageActivated) {
        activatePage();
        firstPageActivated = false;
      }

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var finishCoords = {
        x: mapPinMain.offsetLeft - shift.x,
        y: mapPinMain.offsetTop - shift.y
      };

      if (finishCoords.x < pinMain.xMin) {
        finishCoords.x = pinMain.xMin;
      } else if (finishCoords.x >= pinMain.xMax) {
        finishCoords.x = pinMain.xMax;
      }

      if (finishCoords.y < pinMain.yMin) {
        finishCoords.y = pinMain.yMin;
      } else if (finishCoords.y >= pinMain.yMax) {
        finishCoords.y = pinMain.yMax;
      }

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapPinMain.style.top = finishCoords.y + 'px';
      mapPinMain.style.left = finishCoords.x + 'px';

      addAddress(PIN_MAIN_ARROW_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var validationAdFormCapacity = function () {
    adFormCapacity.setCustomValidity('Количество гостей не соответсвует количеству комнат');

    for (var i = 0; i < ROOM_NUMBER_CAPACITY[adFormRoomNumber.value].length; i++) {
      if (ROOM_NUMBER_CAPACITY[adFormRoomNumber.value][i] === adFormCapacity.value) {
        adFormCapacity.setCustomValidity('');
      }
    }
  };

  var validationAdFormPrice = function () {
    var min = 0;
    min = TYPES_PRICE_MIN[adFormType.value];

    adFormPrice.placeholder = min;
    adFormPrice.min = min;
  };

  var validationAdFormTimeInOut = function (evt, adFormTimeInOut, timeInOut) {
    for (var i = 0; i < adFormTimeInOut.length; i++) {
      adFormTimeInOut[i].selected = (timeInOut[evt.target.value] === adFormTimeInOut[i].value);
    }
  };

  var validationAdFormTimeIn = function (evt) {
    validationAdFormTimeInOut(evt, adFormTimeOut, TIMEIN);
  };

  var validationAdFormTimeOut = function (evt) {
    validationAdFormTimeInOut(evt, adFormTimeIn, TIMEOUT);
  };

  adFormRoomNumber.addEventListener('input', validationAdFormCapacity);
  adFormCapacity.addEventListener('input', validationAdFormCapacity);
  adFormType.addEventListener('input', validationAdFormPrice);
  adFormTimeIn.addEventListener('input', validationAdFormTimeIn);
  adFormTimeOut.addEventListener('input', validationAdFormTimeOut);

  validationAdFormCapacity();
  validationAdFormPrice();

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  disabledFilters(true);
  addAddress();
})();
