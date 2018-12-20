'use strict';
// экспортирует в глобальную область видимости функции для взаимодействия с удаленным севером через XHR

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_DATA = 'https://js.dump.academy/keksobooking';

  var creatXHR = function (onLoad, onError) {
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

    return xhr;
  };

  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = creatXHR(onLoad, onError);
      xhr.open('POST', URL_DATA);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var xhr = creatXHR(onLoad, onError);
      xhr.open('GET', URL_LOAD);
      xhr.send();
    }
  };
})();
