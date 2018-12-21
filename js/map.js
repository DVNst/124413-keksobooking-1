'use strict';
// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте;

(function () {
  var PIN_MAIN_ARROW_HEIGHT = 22; // высота хвостика главной метки
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;

  var pageActivated = false;
  window.adsUploaded = false;

  var map = document.querySelector('.map');
  window.mapPins = map.querySelector('.map__pins');
  var mapPinMain = window.mapPins.querySelector('.map__pin--main');

  window.mapPinMainCoordinates = {
    'x': mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2),
    'y': mapPinMain.offsetTop + mapPinMain.offsetHeight
  };
  var mapPinMainCoordinatesDefault = {
    'x': mapPinMain.style.left,
    'y': mapPinMain.style.top
  };

  var onLoad = function (data) {
    window.pin.render(data);
    window.card.render(data[0], true);
  };

  var onError = function (errorMessage) {
    window.error.render(errorMessage);
  };

  var togglePageState = function (activate) {
    map.classList.toggle('map--faded', !activate);
    window.form.toggleFilters(!activate);
    window.form.toggleFormState(!activate);
  };

  var onMapPinMainMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var pinMain = {
      xMin: -Math.round(mapPinMain.offsetWidth / 2),
      xMax: window.mapPins.offsetWidth - Math.round(mapPinMain.offsetWidth / 2),
      yMin: PIN_Y_MIN - mapPinMain.offsetHeight - PIN_MAIN_ARROW_HEIGHT,
      yMax: PIN_Y_MAX - mapPinMain.offsetHeight - PIN_MAIN_ARROW_HEIGHT
    };

    var onDocumentMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      if (!pageActivated) {
        togglePageState(!pageActivated);
        pageActivated = !pageActivated;
      }

      if (!window.adsUploaded) {
        window.adsUploaded = true;
        window.backend.load(onLoad, onError);
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

      window.mapPinMainCoordinates.x = mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2);
      window.mapPinMainCoordinates.y = mapPinMain.offsetTop + mapPinMain.offsetHeight + PIN_MAIN_ARROW_HEIGHT;

      window.form.addAddress(window.mapPinMainCoordinates);
    };

    var onDocumentMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
    };

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  };

  window.map = {
    deactivatePage: function () {
      mapPinMain.style.left = mapPinMainCoordinatesDefault.x;
      mapPinMain.style.top = mapPinMainCoordinatesDefault.y;
      window.form.addAddress(mapPinMain);

      window.pin.delete();
      window.card.delete();

      togglePageState(false);
      pageActivated = false;
      window.adsUploaded = false;
    }
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  window.form.toggleFilters(true);
  window.form.addAddress(window.mapPinMainCoordinates);
})();
