'use strict';
// экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR

var URL_LOAD = 'https://js.dump.academy/keksobooking';
var URL_DATA = 'https://js.dump.academy/keksobooking/data';

var saveload = function (onLoad, onError, method, URL, data) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      onLoad(xhr.response);
    } else {
      onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    }
  });

  xhr.addEventListener('error', function () {
    onError('Произошла ошибка соединения');
  });
  xhr.addEventListener('timeout', function () {
    onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });
  xhr.timeout = 10000;

  xhr.open(method, URL);
  xhr.send(data);
};

(function () {
  window.backend = {
    save: function (data, onLoad, onError) {
      saveload(onLoad, onError, 'POST', URL_DATA, data);
    },
    load: function (onLoad, onError) {
      saveload(onLoad, onError, 'GET', URL_LOAD);
    }
  };
})();
