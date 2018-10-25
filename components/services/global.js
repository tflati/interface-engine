app.filter('pretty', function() {

  return function(input) {
	  return input.replace(/\n/g, "<br/>");
  }
});

app.service("dataService", function($cookies) {

	var myService = this;
	
	myService.global = {};
    
    myService.global["username"] = $cookies.get('username');
    myService.username = $cookies.get('username');
    myService.loggedIn = $cookies.get('logged_in');
    myService.loginToken = $cookies.get('login_token');
    
    myService.login = function(){
    	myService.global["username"] = $cookies.get('username');
    	myService.username = $cookies.get('username');
    	myService.loggedIn = $cookies.get('logged_in');
    	myService.loginToken = $cookies.get('login_token');
        
//    	dataService.username = $cookies.get('username');
//		dataService.global["username"] = $cookies.get('username');
//		dataService.loggedIn = $cookies.get('logged_in');
//		dataService.loggedToken = $cookies.get('login_token');
		console.log("COOKIE UPDATE", myService.loggedIn, myService.loggedToken);    	
    };
    
    myService.getArgs = function(x){
		var fields = myService.getFields(x);
		
		var args = {};
		for(var i=0; i<fields.length; i++)
		{
			var field = fields[i];
//			console.log("FIELD", field);
			if(!field.key || field.key == "submit") continue;
			
			if (angular.isArray(field.data.value)) {
				subargs = []
				for (var j=0; j<field.data.value.length; j++){
					var value = field.data.value[j].id;
					if (value == undefined) value = field.data.value[j];
//					console.log("VALUE", value);
					
					if (value == undefined || value == "undefined" || value == "") value = "ALL";
					subargs.push(value);
				}
				
				args[field.key] = subargs;
			}
			else {
				var value = "ALL";
				if (field.data.value && field.data.value.id) value = field.data.value.id;
				else if (field.data.value) value = field.data.value;
				
				if (field.type == "checkbox") value = field.data.value;
				if (value != undefined && value.value) value = value.value;
				
//				console.log("FORM VALUE", field.key, value);
				
				// if (value == undefined || value == "undefined" || value == "") value = "ALL";
				args[field.key] = value;
			}
		}
		
		return args;
	};
    
	myService.getFields = function(x){
		var form = myService.global[x];
//		console.log("[GET FIELDS] DATA SOURCE", x, form);
		var fields = [];
		
		if (form != undefined && form.elements != undefined)
			for(var el=0; el<form.elements.length; el++){
				var row = form.elements[el];
				
				if(angular.isArray(row))
					for(var i=0; i<row.length; i++){
						var element = row[i];
//						console.log("[GET FIELDS] MACRO ELEMENT", element);
						myService.getFieldsRecursive(element, fields);
					}
				else {
					myService.getFieldsRecursive(row, fields);
				}
			}

//		console.log("[GET FIELDS] FINAL", x, fields);
		return fields;
	};
	
	myService.getFieldsRecursive = function(form, fields){
		if(form.type == "submit") {
//			console.log("[GET FIELDS] SKIPPING", form);
			return;
		}
		
		if(form.elements)
			for(var j=0; j<form.elements.length; j++){
				var field = form.elements[j];
				
//				console.log("[GET FIELDS] ELEMENT", field);
				myService.getFieldsRecursive(field, fields);
			}
		else
			if(form.subtype == "form"){
//				console.log("[GET FIELDS] ADDING FIELD TO FIELDS", form);
				fields.push(form);
			}
	};
});