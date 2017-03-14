class App {
  constructor() {
    this.user = JSON.parse(this.readCookie("user"))
    this.config = {
      apiKey: "AIzaSyDGKJw14c9jiBvkUhqM0mFxwPquyGzwLog",
      authDomain: "todo-ce199.firebaseapp.com",
      databaseURL: "https://todo-ce199.firebaseio.com",
      storageBucket: "todo-ce199.appspot.com",
      messagingSenderId: "1093069006026"
    };
    firebase.initializeApp(this.config);
    this.database = firebase.database();
  }
  readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }
  genItem(header, body){
    let item = ''
    item += '<div class=\'item\' id=\'item-'
    item += app.itemCounter
    item += '\'>'
    item += '<div class=\'itemHeader\'>'
    item += '<h3>'
    item += header
    item += '</h3>'
    item += '</div>'
    item += '<div class=\'itemContent\'>'
    item += '<p>'
    item += body
    item += '</p>'
    item += '</div>'
    item += '<div class=\'itemActions text-center\'>'
    item += '<button class=\'btn btn-danger\' onclick=\'app.deleteItem(this)\'>delete</button>'
    item += '<button  onclick=\'app.getItemData(this);\' class=\'btn btn-primary\'>edit</button>'
    item += '</div>'
    item += '</div>'
    app.itemCounter ++
    // append item to list
    $('#list').append(item)
  }
  writeUserData() {
    firebase.database().ref('lists/' + app.user.uid).set({
      username: app.user.email,
      todoItem: "test"
    });
  }
    getUserData(){
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/lists/' + app.user.uid).once('value').then(function(snapshot) {
      var displayname = snapshot.val().username;
    });
    }
}
var app = new App()

