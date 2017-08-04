app.filter('pretty', function() {

  return function(input) {
	  return input.replace(/\n/g, "<br/>");
  }
});

app.service("dataService", function() {

    this.global = {};
});