'use strict';
// модуль, который управляет карточками объявлений и пинами: добавляет на страницу нужную карточку, отрисовывает пины и осуществляет взаимодействие карточки и метки на карте;

(function () {
  var PIN_MAIN_ARROW_HEIGHT = 22; // высота хвостика главной метки

  var firstPageActivated = true;

  var mapPinMain = window.mapPins.querySelector('.map__pin--main');

  var ads = [];

  var popupClose;

  var mapFilter = window.mapFiltersContainer.querySelectorAll('.map__filter');
  var mapFilterFieldset = window.mapFiltersContainer.querySelectorAll('fieldset');

  var renderPins = function (pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(window.pin.render(pins[i]));
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
    addDisabled(window.adFormFieldset, disabled);
  };

  var activatePage = function () {
    disabledFilters(false);
    window.map.classList.remove('map--faded');
    window.adForm.classList.remove('ad-form--disabled');

    window.form.addAddress(mapPinMain, PIN_MAIN_ARROW_HEIGHT);

    ads = window.data.createAdsList();
    window.mapPins.appendChild(renderPins(ads));

    window.popup = window.card.render(ads[0], true);
    window.popup.children[0].classList.add('hidden');
    window.mapFiltersContainer.before(window.popup);

    window.popup = document.querySelector('.map__card, .popup');
    popupClose = window.popup.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      window.card.closePopup();
    });

    popupClose.addEventListener('keydown', function () {
      window.card.closePopup();
    });
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
      yMin: 0,
      yMax: window.mapPins.offsetHeight - mapPinMain.offsetHeight - PIN_MAIN_ARROW_HEIGHT + 7
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

  disabledFilters(true);
  window.form.addAddress(mapPinMain);
})();
