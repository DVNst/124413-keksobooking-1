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

  window.adForm = document.querySelector('.ad-form');
  window.adFormFieldset = window.adForm.querySelectorAll('fieldset');
  var adFormAddress = window.adForm.querySelector('#address');
  var adFormRoomNumber = window.adForm.querySelector('#room_number');
  var adFormCapacity = window.adForm.querySelector('#capacity');
  var adFormType = window.adForm.querySelector('#type');
  var adFormPrice = window.adForm.querySelector('#price');
  var adFormTimeIn = window.adForm.querySelector('#timein');
  var adFormTimeOut = window.adForm.querySelector('#timeout');

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

  window.form = {
    addAddress: function (pinMain, extraHeight) {
      extraHeight = extraHeight || 0;
      adFormAddress.value = (pinMain.offsetLeft + Math.round(pinMain.offsetWidth / 2)) + ', ' + (pinMain.offsetTop + pinMain.offsetHeight + extraHeight);
    }
  };

  validationAdFormCapacity();
  validationAdFormPrice();
})();
