class Todo {
  constructor() {
    this.user = JSON.parse(this.readCookie("user"))
    this.config = {
      apiKey: "AIzaSyDGKJw14c9jiBvkUhqM0mFxwPquyGzwLog",
      authDomain: "todo-ce199.firebaseapp.com",
      databaseURL: "https://todo-ce199.firebaseio.com",
      storageBucket: "todo-ce199.appspot.com",
      messagingSenderId: "1093069006026"
    }
    firebase.initializeApp(this.config)
    this.database = firebase.database()
  }
  readCookie(name) {
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length)
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
  }
  genItem(header, body, todoID){
    let item = ''
    item += '<div class=\'item\' id=\'item-'
    item += todo.itemCounter
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
    item += '<button class=\'btn btn-danger\' onclick=\'todo.deleteItem(this)\'>delete</button>'
    item += '<button  onclick=\'todo.getItemData(this)\' class=\'btn btn-primary\'>edit</button>'
    item += '<input type="hidden" name="todoID" id="todoID" value="'+ todoID + '">'
    item += '</div>'
    item += '</div>'
    todo.itemCounter ++
    // append item to list
    $('#list').append(item)
  }
  writeUserData(header, body, todoID) {
    firebase.database().ref('lists/' + todo.user.uid + '/' + todoID).set({
      username: todo.user.email,
      todoItem: todoID,
      todoHeader: header,
      todoBody: body
    })
  }
  getUserData(){
    var userId = firebase.auth().currentUser.uid
    return firebase.database().ref('/lists/' + todo.user.uid).once('value').then(function(snapshot) {
      var displayname = snapshot.val().username
    })
  }
  fetchTodoItems(){
    var userId = firebase.auth().currentUser.uid
    return firebase.database().ref('/lists/' + todo.user.uid).once('value').then(function(snapshot) {
      var items = snapshot.val()
      console.log(items);
      for (var i = 0, len = items.length; i < len; i++) {
        console.log(items[i])
      }
    })
  }
  // start of user actions
  newTodo(){
    let header  = $('#createHeader').val()
    let body    = $('#createContent').val()
    let todoID  = "todo-" + Math.random().toString(36).substr(2, 9)
    todo.writeUserData(header, body, todoID)
    todo.genItem(header, body, todoID)
    $('#createModal').modal('hide')
  }
}
var todo = new Todo()

