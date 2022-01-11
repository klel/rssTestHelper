// popup.js
/* Зафиксирую пока этот код в гит. 
 * Проблема
 * Когда открываешь экстеншн фактически загружается страничка практически как открытая вкладка
 * Поэтому что бы хранить состояние пришлось выдумывать что-то
 * Зачем вообще понадобилось состояние
 * Идея была сделать кнопку Enable, хэдлер клика которой запустит обсервер
 * Запущенный обсервер вернет Ok 
 * Мы меняем текст кнопки на Disable
 * Но когда фокус уйдет с экстеншена это выгрузит его(вкладка как-бы закроется).
 * Соответственно при следующем открытии кнопка будет снова Enable, что
 * противоречит состояния обсервера.
 * 
 * Есть апи chrome.starage( в котором куча особенностей
 * - во первых  get/set асинхонные и нужно работать в колбеке после получения
 * - local версия почему-то не завелась
 * - победить колбеки промисами можно миграцией на манифест версии 3, но пока лень это делать)
 * 
 * Но это ладно... 
 * А как синхронить состояния? в экстеншне кнопка является триггером изменяющее состояние
 * класса в другом табе. Она не может знать что с ним там происходит. Приется выдумывать 
 * какие-то слушатели и уведомлять экстеншн, что что-то случилось с обсервером... 
 * 
 * Все это делать лень
 * 
*/

document.addEventListener('DOMContentLoaded', function () {
  var checkButton = document.getElementById('check');
  checkButton.addEventListener('click', function () {
    
  }, false);

});

function changeBtnText(btn, flag){
  
}


function start(){
  chrome.storage.sync.get(['needObserve'], (result) => {
   ask(true);
  });
}

function stop(){
  ask(false);
}

function ask(result){
  const needObserve = result.needObserve;
  if (!needObserve){
    query(true);
    return;
  }

  query(needObserve);
}

function query(needObserve) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // console.log(tabs);  
    chrome.tabs.sendMessage(tabs[0].id, { start: needObserve }, function (response) {
      saveState(response);
    });

  });
};


function saveState(value) {
  chrome.storage.sync.set({ needObserve: value }, function () {
    console.log('Value is set to ' + value);
  });
}
