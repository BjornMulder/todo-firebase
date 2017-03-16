class userHandler {
  constructor() {
    this.user = JSON.parse(this.readCookie("user"))
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
  joinTeam(team){
    firebaseAPI.database.ref('lists/' + userhandler.user.uid + '/settings/').update({
      team: team
    }).then(() =>{
      console.log("team added succesfully")
    })

  }
}
var userhandler = new userHandler();
