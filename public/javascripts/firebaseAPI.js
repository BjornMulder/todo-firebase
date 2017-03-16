class FirebaseAPI {
  constructor(arg) {
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
}
var firebaseAPI = new FirebaseAPI();
