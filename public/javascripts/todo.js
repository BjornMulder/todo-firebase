class Todo {
  constructor() {
    this.fetchTodoItems();
    this.watchFirebase();
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
    firebaseAPI.database.ref('/lists/' + userhandler.user.uid).on('child_added', (snapshot) => {
      todo.fetchTodoItems();
    })
    firebaseAPI.database.ref('/lists/' + userhandler.user.uid).on('child_changed', (snapshot) => {
      todo.fetchTodoItems();
    })
    firebaseAPI.database.ref('/lists/' + userhandler.user.uid).on('child_removed', (snapshot) => {
      todo.fetchTodoItems();
    })
  }
  saveTodo(header, body, todoID) {
    firebaseAPI.database.ref('lists/' + userhandler.user.uid + '/todo-items/' + todoID).set({
      todoItem: todoID,
      todoHeader: header,
      todoBody: body
    })
  }
  fetchTodoItems(){
    return firebaseAPI.database.ref('/lists/' + userhandler.user.uid).once('value').then(function(snapshot) {
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
          console.log(item)
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
    todo.saveTodo(header, body, todoID)
    todo.genItem(header, body, todoID)
    $('#createModal').modal('hide')
  }
  updateTodo(){
    let header  = $('#editHeader').val()
    let body    = $('#editContent').val()
    let todoID  = $('#hiddenField').val()

    firebaseAPI.database.ref('lists/' + userhandler.user.uid + '/' + todoID).set({
      todoItem: todoID,
      todoHeader: header,
      todoBody: body
    })
    $('#editModal').modal('hide')

    let el = $('#' + todoID).remove()


  }
  deleteTodo(el){
  let todoID = el.getAttribute('data-todo-id').replace('todoItem = ', '')
    firebaseAPI.database.ref('lists/' + userhandler.user.uid + '/' + todoID).set({}).then(() => {console.log("deleted")})
    el.parentNode.parentNode.parentElement.removeChild(el.parentNode.parentNode);
  }
  fillModal(el){
    let todoID = el.getAttribute('data-todo-id').replace('todoItem = ', '')
    return firebaseAPI.database.ref('/lists/' + userhandler.user.uid + '/' + todoID).once('value').then(function(snapshot) {
      let item = snapshot.val();
      $('#editHeader').val(item.todoHeader)
      $('#editContent').val(item.todoBody)
      $('#hiddenField').val(item.todoItem)
      $('#editModal').modal('show')
    })
  }
}
var todo = new Todo()
