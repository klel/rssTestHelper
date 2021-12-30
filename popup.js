// popup.js
document.addEventListener('DOMContentLoaded', function() {
    var checkButton = document.getElementById('check');
    checkButton.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log(tabs);  
        chrome.tabs.sendMessage(tabs[0].id, {method: "changePage"}, function(response) {
            //if(response.method == "changePage"){
              alert("Succeeded with "+response.method);
            //}
          });
        });
    }, false);
  }, false);