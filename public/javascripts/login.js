function signIn(type){
  switch (type) {
    case 'google':
      var provider = new firebase.auth.GoogleAuthProvider();
      signIn()
      break;
    case 'github':
      var provider = new firebase.auth.GithubAuthProvider();
      signIn()
      break;
    default:
      return false;
  }
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    document.cookie = "user=" + JSON.stringify(user);
    window.location.replace("/lists");

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
}
