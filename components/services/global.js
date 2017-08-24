app.filter('pretty', function() {

  return function(input) {
	  return input.replace(/\n/g, "<br/>");
  }
});

app.service("dataService", function($cookies) {

    this.global = {};
    
    this.global["username"] = $cookies.get('username');
    this.username = $cookies.get('username');
    this.loggedIn = $cookies.get('logged_in');
    this.loginToken = $cookies.get('login_token');
});