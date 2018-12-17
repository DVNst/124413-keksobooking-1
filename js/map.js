'use strict';
// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте;

(function () {
  var PIN_MAIN_ARROW_HEIGHT = 22; // высота хвостика главной метки

  var firstPageActivated = true;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = mapPins.querySelector('.map__pin--main');

  var ads = [];

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(window.pin.render(pins[i]));
    }

    return fragment;
  };

  var activatePage = function () {
    map.classList.remove('map--faded');
    window.form.toggleFilters(false);
    window.form.activate();
    window.form.addAddress(mapPinMain, PIN_MAIN_ARROW_HEIGHT);

    ads = window.data.createAdsList();
    mapPins.appendChild(renderPins(ads));

    window.card.render(ads[0], true);
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

      window.form.addAddress(mapPinMain, PIN_MAIN_ARROW_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  window.form.toggleFilters(true);
  window.form.addAddress(mapPinMain);
})();
