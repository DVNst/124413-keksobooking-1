'use strict';
// (map.js) модуль, который отвечает за создание карточки объявлений;

(function () {
  var TYPES_RUS = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];

  var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  window.popup = null;
  window.popupClose = null;

  var getMapCardFeatures = function (pin) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pin.offer.features.length; i++) {
      var feature = document.createElement('li');
      feature.className = 'popup__feature' + ' popup__feature--' + pin.offer.features[i];

      fragment.appendChild(feature);
    }

    return fragment;
  };

  var getMapCardPhotos = function (pin) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pin.offer.photos.length; i++) {
      var image = document.createElement('img');
      image.src = pin.offer.photos[i];
      image.className = 'popup__photo';
      image.width = '45';
      image.height = '40';
      image.alt = 'Фотография жилья';

      fragment.appendChild(image);
    }

    return fragment;
  };

  window.card = {
    close: function () {
      window.popup.classList.add('hidden');
      window.pin.closePopup();
      window.popupClose.removeEventListener('click', window.card.close);
      window.popupClose.removeEventListener('keydown', window.card.close);
      document.removeEventListener('keydown', window.card.onPopupEscPress);
    },
    onPopupEscPress: function (evt) {
      window.util.isEscEvent(evt, window.card.close);
    },
    render: function (pin, cloneNode) {
      var fragment = document.createDocumentFragment();

      if (cloneNode) {
        var mapCardElement = mapCardTemplate.cloneNode(true);
        mapCardElement.classList.add('hidden');
      } else {
        mapCardElement = window.popup;
        mapCardElement.classList.remove('hidden');
        window.popupClose = mapCardElement.querySelector('.popup__close');
        window.popupClose.addEventListener('click', window.card.close);
        window.popupClose.addEventListener('keydown', window.card.close);
        document.addEventListener('keydown', window.card.onPopupEscPress);
      }

      mapCardElement.querySelector('.popup__avatar').src = pin.author.avatar;
      mapCardElement.querySelector('.popup__title').textContent = pin.offer.title;
      mapCardElement.querySelector('.popup__text--address').textContent = pin.offer.address;
      mapCardElement.querySelector('.popup__text--price').textContent = pin.offer.price + '₽/ночь';
      mapCardElement.querySelector('.popup__type').textContent = TYPES_RUS[window.TYPES.indexOf(pin.offer.type)];
      mapCardElement.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
      mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;

      mapCardElement.querySelector('.popup__features').innerHTML = '';
      mapCardElement.querySelector('.popup__features').appendChild(getMapCardFeatures(pin));

      mapCardElement.querySelector('.popup__description').textContent = pin.offer.description;

      mapCardElement.querySelector('.popup__photos').innerHTML = '';
      mapCardElement.querySelector('.popup__photos').appendChild(getMapCardPhotos(pin));

      fragment.appendChild(mapCardElement);
      return fragment;
    }
  };
})();
