'use strict';
// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте;

(function () {
  var PIN_MAIN_ARROW_HEIGHT = 22; // высота хвостика главной метки
  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;

  var pageActivated = false;
  window.adsUploaded = false;

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapPinMain = mapPins.querySelector('.map__pin--main');
  var mapPinMainCoordinatDefault = {
    'x': mapPinMain.style.left,
    'y': mapPinMain.style.top
  };

  var ads = [];

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(window.pin.render(pins[i]));
    }

    return fragment;
  };

  var deletePins = function () {
    window.pin.delete(mapPins);
  };

  var onLoad = function (data) {
    ads = data;
    mapPins.appendChild(renderPins(ads));
    window.card.render(ads[0], true);
  };

  var onError = function (errorMessage) {
    window.error.render(errorMessage);
  };

  var togglePageState = function (activate) {
    map.classList.toggle('map--faded', !activate);
    window.form.toggleFilters(!activate);
    window.form.toggleFormState(!activate);
    // ads = window.data.createAdsList();
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
      yMin: PIN_Y_MIN - mapPinMain.offsetHeight - PIN_MAIN_ARROW_HEIGHT,
      yMax: PIN_Y_MAX - mapPinMain.offsetHeight - PIN_MAIN_ARROW_HEIGHT
    };

    var onMouseMove = function (moveEvt) {
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

  window.map = {
    deactivatePage: function () {
      mapPinMain.style.left = mapPinMainCoordinatDefault.x;
      mapPinMain.style.top = mapPinMainCoordinatDefault.y;
      window.form.addAddress(mapPinMain);

      deletePins();

      togglePageState(false);
      pageActivated = false;
    }
  };

  mapPinMain.addEventListener('mousedown', onMapPinMainMouseDown);

  window.form.toggleFilters(true);
  window.form.addAddress(mapPinMain);
})();
