class Todo {
  constructor() {
    this.user = JSON.parse(this.readCookie("user"))
    //console.log(this.user)
    this.config = {
      apiKey: "AIzaSyDGKJw14c9jiBvkUhqM0mFxwPquyGzwLog",
      authDomain: "todo-ce199.firebaseapp.com",
      databaseURL: "https://todo-ce199.firebaseio.com",
      storageBucket: "todo-ce199.appspot.com",
      messagingSenderId: "1093069006026"
    }
    firebase.initializeApp(this.config)
    this.database = firebase.database()

    this.fetchTodoItems();
    this.watchFirebase();
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
    item += '<div class=\'item\' id=\''
    item += todoID.replace('todoItem = ', '')
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
    item += '<button class=\'btn btn-danger\' onclick=\'todo.deleteTodo(this)\' data-todo-id=\'' + todoID + '\'>delete</button>'
    item += '<button  onclick=\'todo.fillModal(this)\' class=\'btn btn-primary\' data-todo-id=\'' + todoID + '\'>edit</button>'
    item += '<input type="hidden" name="todoID" id="todoID" value="'+ todoID + '">'
    item += '</div>'
    item += '</div>'
    todo.itemCounter ++
    // append item to list
    $('#list').append(item)
  }
  watchFirebase(){
    firebase.database().ref('/lists/' + this.user.uid).on('child_added', (snapshot) => {
      todo.fetchTodoItems();
    })
    firebase.database().ref('/lists/' + this.user.uid).on('child_changed', (snapshot) => {
      todo.fetchTodoItems();
    })
    firebase.database().ref('/lists/' + this.user.uid).on('child_removed', (snapshot) => {
      todo.fetchTodoItems();
    })
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
    return firebase.database().ref('/lists/' + this.user.uid).once('value').then(function(snapshot) {
      var items = snapshot.val()
      let allItems = {};
      for (var key in items) {
        // skip loop if the property is from prototype
        if (!items.hasOwnProperty(key)) continue;

        var obj = items[key];
        let item = []
        for (var prop in obj) {
          // skip loop if the property is from prototype
          if(!obj.hasOwnProperty(prop)) continue;

          // your code
          // figure out how to do this cleanly
          item.push(prop + " = " + obj[prop])
        }
          allItems[item[2].replace('todoItem = ', '')] = item
      }
      $('#list').html('');
      for (var prop in allItems) {
        if (allItems.hasOwnProperty(prop)) {
          // do stuff
          let item = allItems[prop]
          let itemBody    = item[0].replace('todoBody = ', '')
          let itemHeader  = item[1].replace('todoHeader = ', '')
          let itemID      = item[2].replace('todoID = ', '')
          todo.genItem(itemHeader, itemBody, itemID) 
        }
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
  updateTodo(){
    let header  = $('#editHeader').val()
    let body    = $('#editContent').val()
    let todoID  = $('#hiddenField').val()
    console.log(todoID);

    firebase.database().ref('lists/' + todo.user.uid + '/' + todoID).set({
      username: todo.user.email,
      todoItem: todoID,
      todoHeader: header,
      todoBody: body
    })
    $('#editModal').modal('hide')

    let el = $('#' + todoID).remove()


  }
  deleteTodo(el){
  let todoID = el.getAttribute('data-todo-id').replace('todoItem = ', '')
    console.log(todoID)
    firebase.database().ref('lists/' + todo.user.uid + '/' + todoID).set({}).then(() => {console.log("deleted")})
    el.parentNode.parentNode.parentElement.removeChild(el.parentNode.parentNode);
  }
  fillModal(el){
    let todoID = el.getAttribute('data-todo-id').replace('todoItem = ', '')
    return firebase.database().ref('/lists/' + todo.user.uid + '/' + todoID).once('value').then(function(snapshot) {
      let item = snapshot.val();
      $('#editHeader').val(item.todoHeader)
      $('#editContent').val(item.todoBody)
      $('#hiddenField').val(item.todoItem)
      $('#editModal').modal('show')
    })
  }
}
var todo = new Todo()
