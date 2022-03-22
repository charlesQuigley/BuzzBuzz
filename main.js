const displayTasks = document.querySelector("#showTask");

displayTasks.addEventListener('click', () =>
{

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else
    {
      
      //3 possible permisions: default, granted, denied. Default = user hasn't said yes or no.
      console.log(Notification.permission);

      if(Notification.permission === "granted")
      {
        showNotification()
      }
      else if(Notification.permission !== "granted")
      {
        Notification.requestPermission()
        .then(permission => 
          {
            if(permission === "granted")
            {
              showNotification();
            }
          });
      }
    }

});


function showNotification(){

  //Date and time that the Notification is created.
  var dts = Math.floor(Date.now());

  var notification = new Notification("New Message from Charles!",
  {
    body: "Hey mate, how are ya? Want to catch up soon?",
    icon: "placeholder_Icon.png",
    image: "placeholder_Icon.png",
    requireInteraction: true,
    timestamp: dts, //Doesn't actually show in the Notification. But, it's metadata I guess.
    vibrate: [200, 100, 200]

  });

  notification.onclick = function(event) {
    event.preventDefault(); // prevent the browser from focusing the Notification's tab
    window.open('http://127.0.0.1:5500/index.html', '_blank');
  }

  notification.onshow = function(){
    //Idk what you do with this. But, it fires off when the notification is displayed.
  }

}
