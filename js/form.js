'use strict';
// модуль, который работает с формой объявления.

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

  var adForm = document.querySelector('.ad-form');
  var adFormFieldset = adForm.querySelectorAll('fieldset');
  var adFormAddress = adForm.querySelector('#address');
  var adFormRoomNumber = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormType = adForm.querySelector('#type');
  var adFormPrice = adForm.querySelector('#price');
  var adFormTimeIn = adForm.querySelector('#timein');
  var adFormTimeOut = adForm.querySelector('#timeout');

  var mapFilter = document.querySelectorAll('.map__filter');
  var mapFilterFieldset = document.querySelectorAll('fieldset');

  var validationAdFormCapacity = function () {
    adFormCapacity.setCustomValidity('Количество гостей не соответсвует количеству комнат');

    for (var i = 0; i < ROOM_NUMBER_CAPACITY[adFormRoomNumber.value].length; i++) {
      if (ROOM_NUMBER_CAPACITY[adFormRoomNumber.value][i] === adFormCapacity.value) {
        adFormCapacity.setCustomValidity('');
      }
    }
  };

  var validationAdFormPrice = function () {
    var min = (TYPES_PRICE_MIN[adFormType.value]) ? TYPES_PRICE_MIN[adFormType.value] : 0;

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

  var toggleDisabled = function (filters, disabled) {
    for (var i = 0; i < filters.length; i++) {
      filters[i].disabled = disabled;
    }
  };

  adFormRoomNumber.addEventListener('input', validationAdFormCapacity);
  adFormCapacity.addEventListener('input', validationAdFormCapacity);
  adFormType.addEventListener('input', validationAdFormPrice);
  adFormTimeIn.addEventListener('input', validationAdFormTimeIn);
  adFormTimeOut.addEventListener('input', validationAdFormTimeOut);

  var onSave = function () {
    adForm.reset();
  };

  var onError = function (errorMessage) {
    window.error.render(errorMessage);
  };

  adForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(adForm), onSave, onError);
    evt.preventDefault();
  });

  adForm.addEventListener('reset', function () {
    window.map.deactivatePage();
    adFormAddress.defaultValue = adFormAddress.value;
  });

  window.form = {
    addAddress: function (pinMain, extraHeight) {
      extraHeight = extraHeight || 0;
      adFormAddress.value = (pinMain.offsetLeft + Math.round(pinMain.offsetWidth / 2)) + ', ' + (pinMain.offsetTop + pinMain.offsetHeight + extraHeight);
    },
    toggleFilters: function (disabled) {
      toggleDisabled(mapFilter, disabled);
      toggleDisabled(mapFilterFieldset, disabled);
      toggleDisabled(adFormFieldset, disabled);
    },
    toggleFormState: function (disabled) {
      adForm.classList.toggle('ad-form--disabled', disabled);
    }
  };

  validationAdFormCapacity();
  validationAdFormPrice();
})();
