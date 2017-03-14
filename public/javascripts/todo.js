var config = {
  apiKey: "AIzaSyDGKJw14c9jiBvkUhqM0mFxwPquyGzwLog",
  authDomain: "todo-ce199.firebaseapp.com",
  databaseURL: "https://todo-ce199.firebaseio.com",
  storageBucket: "todo-ce199.appspot.com",
  messagingSenderId: "1093069006026"
};

firebase.initializeApp(config);

var database = firebase.database();
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
var user = JSON.parse(readCookie("user"))

console.log(user);

function writeUserData() {
  firebase.database().ref('lists/' + user.uid).set({
    username: user.email,
    todoItem: "test"
  });
}

'use strict'
const storage = require('electron-json-storage')

/* globals document*/
class App {
    constructor() {
        this.validKeys = []
        this.itemCounter = 1
        this.getStorage()
    }

    getStorage(){
        this.itemCounter = 1
        storage.keys(function(error, keys) {
            if (error) throw error
            for (var key of keys) {
                if(key.indexOf('item-') !== -1){
                    storage.get(key, function(error, data) {
                        if (error) throw error
                        app.genItem(data.header, data.content)
                        console.log(data)
                    })
               }
            }
        })
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

    createItem(){
        // catch values given by user
        let inputVal = {
            header: $('#createHeader').val(),
            content: $('#createContent').val()
        }
        //generate item
        this.genItem(inputVal.header, inputVal.content)

        this.saveItem(inputVal.header, inputVal)
        // hide the modal
        $('#createModal').modal('hide')
    }

    getItemData(item){
        let itemHeader = $('h3', item.parentElement.parentElement).html()

    let substring = "item-"
      if(itemHeader.indexOf(substring) === -1){
        var key = "item-" + itemHeader
      } else{
        var key = itemHeader
      }

        storage.get(key, function(error, data) {
              if (error) throw error

              console.log(data)

        $('#editHeader').val(data.header)
        $('#editContent').val(data.content)
        $('#hiddenField').val(key)
        $('#editModal').modal('show')
        })
    }
  /* 
   * takes item element as input 
   * saves input in inputVal
   *  
   * removes item from storage according to key
   *
   * generates new html item
   * hides modal
   * reload page to let changes come trough
   */
    editItem(item) {
        let inputVal = {
        header: $('#editHeader').val(),
        content: $('#editContent').val()
        }

        let key = $('#hiddenField').val()

        storage.remove(key, function(error) {
              if (error) throw error
        })
        
        key = 'item-' + inputVal.header

        this.saveItem(key , inputVal)
        this.genItem(inputVal.header, inputVal.content)

        $('#editModal').modal('hide')
        location.reload()
    }

  /*
   * takes item name as input and removes item from storage 
   */
    deleteItem(item){
        let key = 'item-' + $('h3', item.parentElement.parentElement).html()
        storage.remove(key, function(error) {
              if (error) throw error
        })
        location.reload()
    }

  /*
   * takes key and value as input and sets storage accordingly
   */
    saveItem(keyInput, value){

    let substring = "item-"
      if(keyInput.indexOf(substring) === -1){
        var key = "item-" + keyInput
      } else{
        var key = keyInput
      }

        storage.set(key, value, function(error) {
            if (error) throw error
        })
    }
}
var app = new App()

