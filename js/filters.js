'use strict';

(function () {
  var housingType = document.querySelector('#housing-type');
  var housingPrice = document.querySelector('#housing-price');
  var housingRooms = document.querySelector('#housing-rooms');
  var housingGuests = document.querySelector('#housing-guests');
  var housingFeatures = document.querySelector('#housing-features');

  var features = [];

  var pinsUpdate = function () {
    window.pin.delete();
    window.card.delete();
    window.pin.update(housingType.value, housingPrice.value, housingRooms.value, housingGuests.value, features);
  };

  housingType.addEventListener('input', function () {
    window.debounce(pinsUpdate);
  });

  housingPrice.addEventListener('input', function () {
    window.debounce(pinsUpdate);
  });

  housingRooms.addEventListener('input', function () {
    window.debounce(pinsUpdate);
  });

  housingGuests.addEventListener('input', function () {
    window.debounce(pinsUpdate);
  });

  housingFeatures.addEventListener('input', function () {
    var featuresList = housingFeatures.querySelectorAll('input:checked');
    features = [];
    featuresList.forEach(function (item) {
      features.push(item.value);
    });
    window.debounce(pinsUpdate);
  });

  window.filters = function () {
    window.debounce(pinsUpdate);
  };
})();
