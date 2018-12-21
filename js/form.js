'use strict';
// модуль, который работает с формой объявления.

(function () {
  var CapacityToRoomNumber = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var TimeInToTimeOut = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  var TimeOutToTimeIn = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  var PriceMinToTypes = {
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

  var mapFilters = document.querySelector('.map__filters');
  var mapFilter = mapFilters.querySelectorAll('.map__filter');
  var mapFilterFieldset = mapFilters.querySelectorAll('fieldset');

  var validationAdFormCapacity = function () {
    adFormCapacity.setCustomValidity('Количество гостей не соответсвует количеству комнат');

    CapacityToRoomNumber[adFormRoomNumber.value].forEach(function (item) {
      if (item === adFormCapacity.value) {
        adFormCapacity.setCustomValidity('');
      }
    });
  };

  var validationAdFormPrice = function () {
    var min = (PriceMinToTypes[adFormType.value]) ? PriceMinToTypes[adFormType.value] : 0;

    adFormPrice.placeholder = min;
    adFormPrice.min = min;
  };

  var validationAdFormTimeInOut = function (evt, adFormTimeInOut, timeInOut) {
    for (var i = 0; i < adFormTimeInOut.length; i++) {
      adFormTimeInOut[i].selected = (timeInOut[evt.target.value] === adFormTimeInOut[i].value);
    }
  };

  var validationAdFormTimeIn = function (evt) {
    validationAdFormTimeInOut(evt, adFormTimeOut, TimeInToTimeOut);
  };

  var validationAdFormTimeOut = function (evt) {
    validationAdFormTimeInOut(evt, adFormTimeIn, TimeOutToTimeIn);
  };

  var toggleDisabled = function (filters, disabled) {
    filters.forEach(function (item) {
      item.disabled = !disabled;
    });
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
    mapFilters.reset();
    window.map.deactivatePage();
    adFormAddress.defaultValue = adFormAddress.value;
  });

  window.form = {
    addAddress: function (mapPinMain) {
      // extraHeight = extraHeight || 0;
      adFormAddress.value = mapPinMain.x + ', ' + mapPinMain.y;
    },
    toggleFilters: function (disabled) {
      toggleDisabled(mapFilter, disabled);
      toggleDisabled(mapFilterFieldset, disabled);
    },
    toggleFormState: function (disabled) {
      adForm.classList.toggle('ad-form--disabled', !disabled);
      toggleDisabled(adFormFieldset, disabled);
    }
  };

  validationAdFormCapacity();
  validationAdFormPrice();
})();
