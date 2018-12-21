'use strict';

(function () {
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');

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
