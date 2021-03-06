app.controller("elementController", function($scope, $timeout, $sce, $http, $window, $mdDialog, dataService, messageService, $routeParams, Upload){
	
//	$scope.subdata = [];
	$scope.sending = false;
	
	$scope.init = function(data){
		
//		console.log("INITIALIZING", data.type, data);
		
//		$scope.field = data;
		
		$scope.field = data;
		$scope.field.subdata = data.subdata || [];
		if($scope.field.limit) {
			$scope.field.number_limit = $scope.field.limit;
			$scope.field.filtered_items = $scope.field.items.slice(0, $scope.field.number_limit);
		}
		else {
			$scope.field.filtered_items = $scope.field.items;
		}
		
		if($scope.field.type == "autocomplete") $scope.field.data.chosenValue = $scope.field.data.value;
		
//		$scope.field.type = data.type;
//		$scope.variable_value = data.variable_value;
//		$scope.disabled = data.disabled;
//		$scope.action = data.action;
//		$scope.card = data.card;
//		$scope.alignment = data.alignment;
//		$scope.key = data.key;
//		$scope.stacked = data.stacked;
//		$scope.showLegend = data.showLegend;
//		$scope.title = data.title;
//		$scope.label = data.label;
//		$scope.color = data.color;
//		$scope.items = data.items;
//		$scope.numbered = data.numbered;
//		$scope.width = data.width;
//		$scope.height = data.height;
//		$scope.inline = data.inline;
//		$scope.field.subdata = data.subdata || [];
		
//		$scope.field.data = data.data;
		
//		console.log("INIT ELEMENT METADATA: ", data.label, data, $scope.field.data, $scope.subdata);
		
//		if($scope.field.data && $scope.field.data.value && $scope.field.data.key)
//			dataService.global[$scope.field.data.key] = $scope.field.data.value;
		
		if($scope.field.type != "iframe")
			$scope.update($scope.get_url());
		
		if($scope.field.value) $scope.field.data.value = $scope.field.value;
		
		if($scope.field.data != undefined){
			
			if($scope.field.type != "autocomplete"){
				
//				if($scope.field.data.value != undefined){
//					// Update selected value (it might be a simple value or an object)
//			    	if($scope.field.subdata && $scope.field.subdata.length > 0){
//			    		for(var i=0; i<$scope.field.subdata.length; i++) {
//			    			var obj = $scope.field.subdata[i];
//			    			if (obj == newValue || obj.id == newValue){
//			    				console.log("UPDATING VALUE 1", key, obj, $scope.field.type, $scope.field.subdata, newValue);
//			    				$scope.field.data.value = obj;
//			    			}
//			    		}
//			    	}
//				}
				
			
				// Keys will contain:
				// - field.data.key
				// - template.key, for each template in field.data.templates (different from field.key)
				var keys = [];
				if($scope.field.data.key) keys.push($scope.field.data.key);
				
				for(index in $scope.field.data.templates){
					
					var template = $scope.field.data.templates[index];
					console.log("TEMPLATE2", $scope.field.type, data, template);
					
					if(template.key && keys.indexOf(template.key) == -1){
						var key = template.key;
						if(key != $scope.field.key)
							keys.push(key);
					}
					
					// Tried to initialise the value of variable
					if(template.value){
						console.log("MODIFYING GLOBAL", template.key, template.value);
						dataService.global[template.key] = template.value;
					}
				}
				
				if($scope.field.data.onChange)
					for(var i=0; i<$scope.field.data.onChange.length; i++){
						var listener = $scope.field.data.onChange[i];
						var key = listener.key? listener.key : undefined;
						if(key != undefined && keys.indexOf(key) == -1)
//							if(key != $scope.field.key)
								keys.push(key);
					}
				
				console.log("KEYS", $scope.field.type, $scope.field.key, data, keys);
			
//			// MODIFIED 26/06/18
//			if($scope.field.data && $scope.field.data.variable_value){
//				console.log("REPLACE TEMPLATES INIT KEY", $scope.field.type, $scope.field.key, key);					
//				$scope.replaceTemplates();
//			}
			
//			for(index in keys)
//			{
//				if($scope.field.type == "autocomplete") continue;
//				var key = keys[index];
				
//				console.log("ADDING WATCH KEY", $scope.field.type, "FieldKey:", $scope.field.key, "FieldLabel:", $scope.field.label, "DataServiceKey:", key, "Field:", $scope.field, "DataService:", dataService, "DataServiceKeys:", Object.keys(dataService.global), "WatchedObject:", dataService.global[key], "Scope:", $scope);
//				var result = $scope.$watch(function(){return dataService.global[key];}, function(newValue, oldValue) {
//					console.log("INSIDE WATCH", key, $scope.field.type, $scope.field.key, newValue, oldValue, dataService.global, $scope);
//					
//				    if (newValue != oldValue){
//				    	
//				    	console.log($scope.field.type, "Change from " + oldValue + " to ", newValue, "effective value=", dataService.global[key], " field=", $scope.field);
//				    	
//				    	// Update value (it might be a simple value or an object)
//				    	if($scope.field.subdata && $scope.field.subdata.length > 0){
//				    		console.log("UPDATING VALUE 1", $scope.field.type, $scope.field.subdata, newValue);
//				    		for(var i=0; i<$scope.field.subdata.length; i++) {
//				    			var obj = $scope.field.subdata[i];
//				    			if (obj == newValue || obj.id == newValue)
//				    				$scope.field.data.value = obj;
//				    		}
//				    	}
//				    	else if(newValue.type != undefined){
//				    		console.log("UPDATING VALUE 3", $scope.field.type, newValue);
//				    		$scope.field = newValue;
//				    	}
//				    	else {
//				    		console.log("UPDATING VALUE 2", $scope.field.type, $scope.field.data, newValue, $scope.field);
//				    		$scope.field.data.value = newValue == undefined ? newValue : (newValue.label || newValue);
//				    	}
//				    	
//				    	if($scope.field.data && $scope.field.data.templates)
//				    	{
//				    		console.log("REPLACE TEMPLATES INSIDE WATCH", $scope.field.type, $scope.field.key, newValue, oldValue, $scope.field);
//				    		$scope.replaceTemplates();
//				    	}
//				    	
//				    	if($scope.field.data && $scope.field.data.onChange != "nothing")
//				    		$scope.update($scope.get_url());
//				    }
//				});
//				console.log("ADDED WATCH KEY", $scope.field.type, $scope.field.key, result);
//			}
			
				var watchGroup = [];
				for(var i=0; i < keys.length; i++)
				{
					var key = keys[i];
					watchGroup[i] = "dataService.global['"+key+"']";
				}
				
				if(watchGroup.length > 0)
					$scope.$watchGroup(watchGroup, function(newValues, oldValues) {
						for(var i=0; i<newValues.length; i+=1)
						{
							// Retrieve the key associated
							var key = keys[i];
							var newValue = newValues[i];
							var oldValue = oldValues[i];
							
							console.log("INSIDE WATCH", i, keys, watchGroup, key, $scope.field.type, $scope.field.key, "N", newValue, "O", oldValue, dataService.global, $scope);
							
							if(newValue != oldValue)
							{
								console.log("INSIDE WATCH (CHANGE)", i, keys, watchGroup, key, $scope.field.type, $scope.field.key, "N", newValue, "O", oldValue, dataService.global, $scope);
		//				    	console.log($scope.field.type, "Change from " + oldValue + " to ", newValue, "effective value=", dataService.global[key], " field=", $scope.field);
						    	
						    	// Update value (it might be a simple value or an object)
						    	if($scope.field.subdata && $scope.field.subdata.length > 0){
						    		
						    		if(newValue == undefined)
						    			$scope.field.data.value = newValue;
						    		else
							    		for(var i=0; i<$scope.field.subdata.length; i++) {
							    			var obj = $scope.field.subdata[i];
							    			if (obj == newValue || obj.id == newValue){
							    				console.log("UPDATING VALUE 1", key, obj, $scope.field.type, $scope.field.subdata, newValue);
							    				$scope.field.data.value = obj;
							    			}
							    		}
						    	}
						    	else if(newValue != undefined && newValue.type != undefined){
						    		console.log("UPDATING VALUE 3", $scope.field.type, newValue);
						    		$scope.field = newValue;
						    	}
//						    	// COMMENTED ON 10/10/18
//						    	else if (newValue != undefined){
//						    		$scope.field.elements = newValue;
//						    	}
						    	else {
						    		console.log("UPDATING VALUE 2", key, $scope.field.type, $scope.field.data, newValue, $scope.field);
						    		if (key == $scope.field.key)
						    			$scope.field.data.value = newValue == undefined ? newValue : (newValue.label || newValue);
						    	}
						    	
						    	if($scope.field.data && $scope.field.data.templates)
						    	{
						    		console.log("REPLACE TEMPLATES INSIDE WATCH", $scope.field.type, $scope.field.key, key, newValue, oldValue, $scope.field);
						    		$scope.replaceTemplates();
						    	}
						    	
		//						// THINK ABOUT THIS...
						    	if (key != $scope.field.key)
							    	if($scope.field.data) {// && $scope.field.data.onChange != "nothing"
							    		console.log("UPDATING", $scope.field.type, $scope.field.key, key, $scope.field);
							    		$scope.update($scope.get_url());
							    	}
							}
						}
					});
			}
			
			// ON CHANGE INIT (otherwise the value do not change)
			if($scope.field.data.onChange){
				console.log("ANALYZING ON CHANGE", $scope.field.data.onChange);
				
				var listener = $scope.field.data.onChange;
				if(listener.action == "write") {
					
					console.log("[1 WRITE] ONCHANGE GLOBAL:", dataService, $scope.field.data);
					
//					dataService.global[listener.key] = $scope.field.data.id || $scope.field.data.value;
					var value = $scope.field.data.id || $scope.field.data.value || $scope.field.data.id || listener.value;
					console.log("MODIFYING GLOBAL WRITE", listener.key, value);					
					if(listener.scope == "global") dataService.global[listener.target] = value;
					else if(listener.scope == "self") $scope.field[listener.target] = value;
					else if(listener.scope != undefined) $scope.field[listener.scope][listener.target] = value;
					else dataService.global[listener.key] = value;
					
					console.log("[1 WRITE] ONCHANGE GLOBAL CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.field.data.value, "real value: ", dataService.global[listener.key]);
				}
				else if(listener.action == "read") {
					console.log("[1 READ] ONCHANGE GLOBAL:", dataService, $scope.field.data);
					console.log("MODIFYING GLOBAL READ", listener.key, $scope.field.data.id || $scope.field.data.value);
					
//					if(listener.scope == "global") field = dataService.global[listener.key];
					
					console.log("[1 READ] ONCHANGE GLOBAL CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.field.data.value, "real value: ", dataService.global[listener.key]);
				}
			}
		}
		
		// Necessary for checkbox
		if($scope.field.data && (!$scope.field.data.url && $scope.field.data.values) )
			$scope.field.subdata = $scope.field.data.values;
		
		// Needed for checkbox initialization
		if($scope.field.type == "checkbox" || $scope.field.type == "radio"){
			if($scope.field.data.value == undefined){
				
				for(var i=0; i<$scope.field.subdata.length; i++)
					if($scope.field.subdata[i].checked == true)
						$scope.set($scope.field.subdata[i]);
			}
		}
		
		if($scope.field.subdata)
			$scope.convert();
		
		if($scope.field.data){
			console.log("REPLACE TEMPLATES INIT (END)", $scope.field.type, $scope.field.key);
			$scope.replaceTemplates();
		}
		
		console.log("INIT FINAL ELEMENT METADATA: ", data, $scope.field.data, $scope.field.subdata);
	};
	
	$scope.toggleLimit = function(){
		if($scope.field.number_limit == $scope.field.items.length) $scope.field.number_limit = $scope.field.limit; 
		else $scope.field.number_limit = $scope.field.items.length;
		
		$scope.field.filtered_items = $scope.field.items.slice(0, $scope.field.number_limit);
	};
	
	$scope.exists = function(item){
//		console.log("EXISTS", item, $scope.field.data.value, $scope.field.data.value == undefined ? false : $scope.field.data.value.indexOf(item) > -1);
	    if($scope.field.data.value == undefined) return false;
	    if($scope.field.exclusive || $scope.field.type == "radio") return $scope.field.data.value == item;
	    else return $scope.field.data.value.indexOf(item) > -1;
	};
	
	$scope.set = function (value) {
		console.log("SET", value, $scope.field);
		
		if($scope.field.exclusive || $scope.field.type == "radio")
			$scope.field.data.value = value;
		else {
			if ($scope.field.data.value == undefined) $scope.field.data.value = []
			
			if(value != undefined) $scope.field.data.value.push(value);
			else $scope.field.data.value.splice($scope.field.data.value.indexOf(value), 1);
		}
		
		var listener = $scope.field.data.onClick;
	    if(listener)
			for(var i=0; i<listener.length; i++)
			{
				var actionObject = listener[i];
				
				if(actionObject.action == "write") {
					console.log("[3bis] GLOBAL:", dataService);
					console.log("MODIFYING GLOBAL", actionObject.key, $scope.toString($scope.field.data.value));
					dataService.global[actionObject.key] = $scope.toString($scope.field.data.value);
					console.log("[3bis] CHANGING VALUE OF VARIABLE '" + actionObject.key + "' TO ", $scope.field.data.value, "real value: ",dataService.global[actionObject.key]);
				}
			}
	};
	
	$scope.toggle = function (item) {
		
		if($scope.field.exclusive || $scope.field.type == "radio") {
			console.log("TOGGLE", item, $scope.field);
			
			if($scope.field.data.value == item) $scope.field.data.value = undefined;
			else $scope.field.data.value = item;
		}
		else {
			if ($scope.field.data.value == undefined) $scope.field.data.value = []
			
			var idx = $scope.field.data.value.indexOf(item);
			console.log("TOGGLE", item, $scope.field.data.value, idx);
			if (idx >= 0) {
				console.log("TOGGLE BEFORE", $scope.field.data.value);
				$scope.field.data.value.splice(idx, 1);
				console.log("TOGGLE AFTER", $scope.field.data.value);
			}
			else {
				$scope.field.data.value.push(item);
			}
		}
		
//		console.log("TOGGLE", item, $scope.field.data.value, $scope.field.data.value == undefined ? $scope.field.data.value : $scope.field.data.value.indexOf(item));
//	    if($scope.field.data.value == undefined) $scope.field.data.value = [];
//	    var idx = $scope.field.data.value.indexOf(item);
//	    if (idx > -1) $scope.field.data.value.splice(idx, 1);
//	    else $scope.field.data.value.push(item);
	    
	    var listener = $scope.field.data.onClick;
	    if(listener)
			for(var i=0; i<listener.length; i++)
			{
				var actionObject = listener[i];
				
				if(actionObject.action == "write") {
					console.log("[3ter] GLOBAL:", dataService);
					console.log("MODIFYING GLOBAL", actionObject.key, $scope.toString($scope.field.data.value));
					dataService.global[actionObject.key] = $scope.toString($scope.field.data.value);
					console.log("[3ter] CHANGING VALUE OF VARIABLE '" + actionObject.key + "' TO ", $scope.field.data.value, "real value: ",dataService.global[actionObject.key]);
				}
			}
	};
	
//	$scope.getFormData = function(){
//		var source = $scope.field.data.source;
//		var dataForm = {
//				submit: {
//					url: $scope.field.data.url
//				},
//				fields: []
//		};
//		
//		var form = dataService.global[$scope.field.data.source];
//		
//		var fields = [];
//		for(var el=0; el<form.elements.length; el++){
//			var element = form.elements[el];
//			console.log("ELEMENT", element);
//			for(var i=0; i<element.length; i++){
//				var row = element[i];
//				console.log("ROW", row);
//				for(var j=0; j<row.elements.length; j++){
//					var field = row.elements[j];
//					console.log("FIELD", field);
//					fields.push(field);
//				}
//			}
//		}
//		
//		dataForm.fields = fields;
//		
//		console.log("GET FORM DATA", dataForm);
//		
//		return dataForm;
//	}
	
	$scope.toString = function(object){
		if(object == "undefined" || object == undefined) return undefined;
		if(!angular.isArray(object)) return object.value || object.id || object.label || object;
		
		var arrayString = []
		for (var i=0; i<object.length; i++)
			arrayString.push($scope.toString(object[i]));
		return arrayString.join("|");
	};
	
	$scope.onChange = function(newValue){
		console.log("["+$scope.field.type+"] ONCHANGE NEW VALUE: ", newValue, $scope.field);
		
		if($scope.field.data.onChange)
			for(var i=0; i<$scope.field.data.onChange.length; i++){
				var listener = $scope.field.data.onChange[i];

				if (listener.target != undefined){
					if(listener.scope == "global") {
						var o = dataService.global;
						var path = listener.target;
						var pieces = path.split(".")
						for(var j=0;j<pieces.length-1; j++)
						{
							var piece = pieces[j];
							console.log(piece, o);
							o = o[piece]
						}
						
						if(listener.action == "write")
							o[pieces[pieces.length-1]] = newValue;
						else(listener.action == "delete")
							delete o[pieces[pieces.length-1]];
						console.log("AFTER CHANGE", listener, o);
					}
				}
				else{
					if(listener.action == "write") {
						console.log("[2] ONCHANGE GLOBAL:", dataService);
						console.log("MODIFYING GLOBAL", listener.key, newValue == undefined ? newValue : (newValue.id || newValue.key || newValue));
						dataService.global[listener.key] = newValue == undefined ? newValue : (newValue.id || newValue.key || newValue);
		//				dataService.global[listener.key] = newValue.id;
						console.log("[2] ONCHANGE GLOBAL CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", newValue, " (real value: "+dataService.global[listener.key]+")");
					}
				}
			}
	};
	
	$scope.get_url = function(){
		
//		console.log("GET_URL", $scope);
		
		if ( $scope.field.data == undefined ) {
			console.log("[STRANGE]", $scope);
			return "";
		}
		var templates = $scope.field.data.templates;
//		console.log("GET_URL TEMPLATES", templates);
		
		var url = $scope.field.data.url;
		if (url == undefined) return "";
		
		if(!templates) return url;
		else if(url != undefined){
			
//			if($scope.field.data.key) value = dataService.global[$scope.field.data.key];
			
			var finalUrl = url;
			for (index in templates)
			{
				var template = templates[index];
				
				var value = undefined;
				if(template.key){
					if (template.key.indexOf("PARAM") == 0) {
						console.log("SPECIAL", $routeParams);
						var n = parseInt(template.key.split("/")[1]); 
						var params = $routeParams.parameters.split("/");
						value = params[n-1];
					}
					else {
						if(!(template.key in dataService.global)) return undefined;
						else value = dataService.global[template.key];
					}
				}
				// else if(template.value_of) value = dataService.global[dataService.global[template.value_of]];
				if(value == undefined) { // value == ""
//					console.log("GET_URL MID ERROR", $scope.field, dataService);
					$scope.field.subdata = [];
					return undefined;
				}
				
				console.log("GET URL MID", $scope.field.type, url, template, value, dataService.global);
				
				if(value.id) value = value.id; // MODIFIED
				//if(angular.isString(value)) value = value.replace("/", "");
				
				console.log("URL TEMPLATE REPLACEMENT BEFORE", finalUrl, template, value);
				finalUrl = finalUrl.replace(template.template, value);
				console.log("URL TEMPLATE REPLACEMENT AFTER", finalUrl, template, value);
			}
			
//			console.log("GET_URL FINAL", url, finalUrl);
			
			return finalUrl;
		}
	};
	
	$scope.replaceTemplates = function(){
		
//		if($scope.field.data.url) return;
		
		console.log($scope.field.type, $scope.field.data, "REPLACEMENT IN VALUE [0]", $scope);
		
		if($scope.field.data.variable_value)
			$scope.field.data.value = $scope.field.data.variable_value;
		
		var templates = $scope.field.data.templates;
		for (index in templates)
		{
			var template = templates[index];
			
			console.log($scope.field.type, $scope.field.data, "TEMPLATE REPLACEMENT IN VALUE [1]", $scope.field.data.value, template, template.key, $scope.field.data.value, dataService.global[template.key], dataService.global);
			
			var value = undefined;
			if(template.key) {
				if (template.key.indexOf("PARAM") == 0) {
					console.log("SPECIAL", $routeParams);
					var n = parseInt(template.key.split("/")[1]); 
					var params = $routeParams.parameters.split("/");
					value = params[n-1];
				}
				else {
					console.log($scope.field.type, $scope.field.data, "TRYING TO REPLACE TEMPLATE", template.key, dataService.global[template.key], dataService.global);
					value = dataService.global[template.key];
				}
			}
			if(value == undefined) {
				console.log("VALUE IS UNDEFINED", $scope.field.type, $scope.field.data, "TEMPLATE REPLACEMENT IN VALUE [1bis]", template, value, dataService.global[template.key], dataService.global);
				continue;
			}
			
			if(value.label) value = value.label;
			else if(value.id) value = value.id;
			//if(angular.isString(value)) value = value.replace("/", "");

			console.log($scope.field.type, $scope.field.data, "TEMPLATE REPLACEMENT IN VALUE [2]", $scope.field.data.value, template, value);
			
			if (template.target != undefined) {
				if(value == "") value = "empty";
				var source = template.source || template.target;
				$scope.field.data[template.target] = $scope.field.data[source].replace(template.template, value);
				
				console.log("REPLACING TARGET SPECIAL!", $scope.field.type, template.target, value, $scope.field);
			}
			else if($scope.field.data.value) {
				console.log("ASSIGNING VALUE!", $scope.field.type, $scope.field);
				if ($scope.field.data.value.label != undefined) $scope.field.data.value = ("" + $scope.field.data.value.label).replace(template.template, value);
				else $scope.field.data.value = ("" + $scope.field.data.value).replace(template.template, value);
			}
			
//			$scope.field.data.value = $scope.field.data.value.replace(template.template, value);
		}
		console.log($scope.field.type, $scope.field.data, "REPLACED", $scope.field.data.variable_value, $scope.field.data.value);
	};
	
	$scope.update = function(url, fx){
		
		if($scope.field.type == "autocomplete") return;
		if($scope.field.type == "paginated-table") return;
		if($scope.field.type == "submit") return;
		if($scope.field.type == "button" && $scope.field.action != "submit") return;
		
		if(url == undefined) return;
		if(url == "") return;
		
		console.log("PREAJAX TO", url, $scope.field.data);
		
		if(url.slice(-1) != "/") url += "/";
		url = url.replace(/#/g, "_SHARP_");
		
		if(fx == undefined) fx = $scope.onDataReceived;

		$scope.sending = true;

		console.log("AJAX [GET] TO", url, $scope.field);
		
		var method = $scope.field.method || "POST";
		if (method == "GET"){
			console.log("AJAX [GET]", url, $scope.field);
			$scope.promise = $http.get(url);
		}
		else if (method == "POST"){
			var args = dataService.getArgs($scope.field.data.source);
			console.log("AJAX [POST] BUTTON ARGS", args, $scope.field);
			$scope.promise = $http.post(url, args);
		}
		
		$scope.promise.then(fx,
			function myError(response) {
				$scope.sending = false;
            	console.log("ERROR IN GETTING DATA FROM " + url, response, $scope.field);
//            	messageService.showMessage('Errore durante il recupero dei dati da '+response.config.url+'. ' + 'Error code: ' + response.status, "error");
			}
		);
	};
	
	$scope.onDataReceived = function(response)
	{
		$scope.sending = false;
		console.log("SUCCESS IN GETTING DATA FROM " + response.config.url, response, $scope, $scope.field.data);
		
		if($scope.field.type == "dynamic"){
			$scope.field = response.data;
		}
		else{
			if(response.data.details) $scope.field.subdata = response.data.details;
			else $scope.field.subdata = response.data;
		}
//		if($scope.field.subdata.items && $scope.field.subdata.items.length == 0 && $scope.field.data.empty_message)
//			messageService.showMessage($scope.field.data.empty_message, "error");
		
		for(var k in $scope.field.subdata)
		{
			var item = $scope.field.subdata[k];
			if(item.id != undefined && item.id == $scope.field.data.value)
			{
				console.log("INIT FOUND", item, $scope.field);
				$scope.field.data.value = item;
				
				if($scope.field.data.onChange)
					for(var i=0; i<$scope.field.data.onChange.length; i++){
						var listener = $scope.field.data.onChange[i];
						if(listener.action == "write") {
							console.log("[3] GLOBAL:", dataService);
							console.log("MODIFYING GLOBAL", listener.key, $scope.field.data.value.id || $scope.field.data.value);
							dataService.global[listener.key] = $scope.field.data.value.id || $scope.field.data.value;
							console.log("[3] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.field.data.value, "real value: ",dataService.global[listener.key]);
						}
					}
				
				break;
			}
		}
		
		console.log("ON DATA RECEIVED", $scope.field);
		
//		$scope.field.values = $scope.subdata; // ADDED
		
		$scope.convert();
//		console.log("SCOPE ELEMENT DATA: ", $scope);
		
		if($scope.field.data && $scope.field.data.onFinish){
			
			console.log("ON FINISH [1]", $scope);
			
			for(var i in $scope.field.data.onFinish)
			{
				var condition = $scope.field.data.onFinish[i];
				
				console.log("ON FINISH [2]", $scope, condition, dataService.global[condition.key]);
				
				var value = "";
				if (condition.property == "length")
					value = $scope.field.subdata.items.length;
				
				console.log("MODIFYING GLOBAL", condition.key, value);
				dataService.global[condition.key] = value;
			}
			
			console.log("ON FINISH [3]", $scope, condition, dataService.global[condition.key]);
		}
		
		if($scope.field.data && $scope.field.data.onReceive){
			console.log("ON RECEIVE", $scope.field.data);
			
			for(var i=0; i<$scope.field.data.onReceive.length; i++){
				var instruction = $scope.field.data.onReceive[i];
				
				if (instruction.action == "write") {
					if(instruction.scope == "global") dataService.global[instruction.target] = response.data;
					else if(instruction.scope == "self") $scope.field[instruction.target] = response.data;
					else if(instruction.scope != undefined) $scope.field[instruction.scope][instruction.target] = response.data;
					else $scope.field.data[instruction.target] = response.data;
				}
			}
		}
	};
	
	$scope.convert = function(){
		
		console.log("CONVERTING ", $scope.field.type, $scope.field.key, $scope);
		
		// For the select component: modified 13/10/17
//		if($scope.field.subdata)
//			for(index in $scope.field.subdata){
//				d = $scope.field.subdata[index];
//				
//				if (d.id == $scope.field.data.value || d == $scope.field.data.value)
//				{
//					$scope.field.data.value = d;
//					break;
//				}
//			}
		
		if($scope.field.type == "chart-line" || $scope.field.type == "chart-bar" || ($scope.field.type == "chart-pie" || $scope.field.type == "chart-doughnut")){
			$scope.field.subdata.labels = []
			$scope.field.subdata.points = []
			
			if($scope.field.subdata.items)
			{
				for(var i=0; i<$scope.field.subdata.header.length-1; i++)
					$scope.field.subdata.points.push([]);
			
				for(var i=0; i<$scope.field.subdata.items.length; i++)
				{
					var item = $scope.field.subdata.items[i];
					
					$scope.field.subdata.labels.push(item[0]);
					
					for(var j=1; j<$scope.field.subdata.header.length; j++)
						$scope.field.subdata.points[j-1].push(item[j]);
				}
			
				$scope.field.subdata.options = {
					legend: {
						display: ($scope.field.data.options != undefined && $scope.field.data.options.legend.show) || ($scope.field.subdata.options != undefined && $scope.field.subdata.options.legend.show),
						position: ($scope.field.data.options != undefined && $scope.field.data.options.legend.position) || 'top',
						labels: {
							fontSize: ($scope.field.data.options != undefined && $scope.field.data.options.legend.fontSize) || 12,
			                generateLabels: function(chart){
			                	var data = chart.data;
			                	console.log("GENERATE LABELS", data);
			                    if (data.labels.length && data.datasets.length) {
			                        return data.labels.map(function(label, i) {
			                            var meta = chart.getDatasetMeta(0);
			                            var ds = data.datasets[0];
			                            var arc = meta.data[i];
			                            var custom = arc && arc.custom || {};
			                            var getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
			                            var arcOpts = chart.options.elements.arc;
			                            var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
			                            var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
			                            var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

										// We get the value of the current label
										var value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];

			                            return {
			                                // Instead of `text: label,`
			                                // We add the value to the string
			                                text: label.name || label.label || label.id || label,
			                                fillStyle: fill,
			                                strokeStyle: stroke,
			                                lineWidth: bw,
			                                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
			                                index: i
			                            };
			                        });
			                    } else {
			                        return [];
			                    }
			                }
			            }
					},
					tooltips: {
					    callbacks: {
					        title: function(tooltipItem, chartData) {
	//					          console.log("TITLE", tooltipItem, chartData)
						      var item = chartData.labels[tooltipItem[0].index];
						      
						      var s = undefined;
//						      if(item.label) s = item.label;
						      if(item.name) s = item.name;
						      if(item.title) s = item.title;
						      
//						      if(s == undefined) s = item;
						      
						      // if(item.id) s += " (ID:"+item.id+")";
						      
					          return s;
					        },
					        label: function(tooltipItem, chartData) {
						          console.log("LABEL", tooltipItem, chartData)
						          var datasetIndex = tooltipItem.datasetIndex;
						          
						          var key = chartData.datasets[datasetIndex].value;
						          if (key == undefined) key = chartData.labels[tooltipItem.index].value || chartData.labels[tooltipItem.index].label;
						          
						          var value = chartData.datasets[datasetIndex].data[tooltipItem.index];
						          
						          var finalString = key + ": " + value;
						          
						          if ($scope.field.type == "chart-pie" || $scope.field.type == "chart-doughnut"){
						        	  var allData = chartData.datasets[datasetIndex].data;
									  var total = 0;
									  for (var i in allData) {total += parseFloat(allData[i]);}
									  var fraction = (value / total) * 100;
									  
							          // var percentage = Math.round(fraction);
									  var percentage = fraction.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping:false})
							          
							          console.log(total, value, fraction, percentage);
							          
							          finalString += " ("+percentage+"% of the total)";
						          }
						          
						          return finalString;
						        }
					      }
				    }
				};
			
				if($scope.field.type != "chart-pie" && $scope.field.type != "chart-doughnut"){
					console.log("XLABELS", $scope.field.subdata);
					
					$scope.field.subdata.options.scales = {
				        xAxes: [{
				          stacked: $scope.field.type == "chart-bar" && $scope.field.stacked && $scope.field.stacked == true ? true : false,
		        		  scaleLabel: {
								display: true,
								labelString: $scope.field.subdata.descriptions && $scope.field.subdata.descriptions.length > 0 ? $scope.field.subdata.descriptions[0] : "",
							},
				          ticks: {
				        	  maxRotation: 90,
			                  callback: function (label) {
			                	  if ($scope.field.subdata.chart_options && $scope.field.subdata.chart_options.xlabels == false) return "";
//								                  console.log("X AXIS", label);
			                      return label.label || label.id || label;
			                  }
				          }
				        }],
				        yAxes: [{
				        	scaleLabel: {
								display: true,
								labelString: $scope.field.subdata.descriptions && $scope.field.subdata.descriptions.length > 0 ? $scope.field.subdata.descriptions[1] : "",
							},
							stacked: $scope.field.stacked && $scope.field.stacked == true ? true : false,
							ticks: {}
			        }]}
				};
				
				if($scope.field.type == "chart-bar" || $scope.field.type == "chart-line") {
					$scope.field.subdata.series = $scope.field.subdata.header.slice(1, $scope.field.subdata.header.length);
					// $scope.field.subdata.options.legend.display = $scope.field.subdata.series.length > 0;
					
					if($scope.field.data.max != undefined) {
						$scope.field.subdata.options.scales.yAxes[0].ticks.max = parseFloat($scope.field.data.max);
					}
					if($scope.field.data.min != undefined) {
						$scope.field.subdata.options.scales.yAxes[0].ticks.min = parseFloat($scope.field.data.min);
					}
					
//					if(!$scope.stacked) {
//						$scope.field.subdata.points = $scope.field.subdata.points[0];
//						console.log("SIMPLIFYING DATA", $scope.field.subdata, $scope.field.subdata.points);				
//					}
				}
				
				if($scope.field.subdata.points.length == 1 || !$scope.field.stacked)
				{
					$scope.field.subdata.points = $scope.field.subdata.points[0];
//					$scope.field.subdata.options.legend.display = false;
					$scope.field.subdata.series = [];
				}	
				
				console.log("CHART OPTIONS", $scope.field.subdata.options, $scope.field);
			}
		}
		else if($scope.field.type == 'venn')
		{
			if($scope.field.subdata.items)
			{
				console.log("VENN DATA", $scope.field.subdata);
				
				formatted_data = [];
				sizes = {};
				for(var i=0; i<$scope.field.subdata.header.length; i++)
				{
					var name = $scope.field.subdata.header[i];
					var size = $scope.field.subdata.items[0][i];
					console.log("VENN", name, size);
					if (name.indexOf("\u2229") !== -1) continue;
					
					sizes[name] = size;
				}
				
				console.log("VENN SIZES", sizes);
				
				for(var i=0; i<$scope.field.subdata.header.length; i++)
				{
					var pieces = $scope.field.subdata.header[i].split("\u2229");
					var final_pieces = []
					var size = $scope.field.subdata.items[0][i];
					
					for(var j=0; j<pieces.length; j++)
					{
						final_pieces.push(pieces[j]);
					}
//					if (pieces.length == 1) pieces += " ("+$scope.subdata.items[0][i]+")";
					var datum = {"sets": final_pieces, "size": size}
					if(final_pieces.length == 1)
						datum["label"] = final_pieces[0] + " ("+size+")";
					
					formatted_data.push(datum);
				}
				console.log("VENN", formatted_data);
				
				$scope.field.subdata = formatted_data;
			}
		}
		else if($scope.field.type == 'cloud')
		{
			if($scope.field.subdata.items)
			{
				formatted_data = [];
				
				for(var i=0; i<$scope.field.subdata.items.length; i++)
				{
					var item = $scope.field.subdata.items[i];
					formatted_data.push({"text": item[0], "weight": item[1]});
				}
				console.log("CLOUD", formatted_data);
				
				$scope.field.subdata = formatted_data;
			}
		}
		
//		console.log("FINAL ELEMENT METADATA: ", $scope.field.type, $scope.field.subdata, $scope);
	};
	
	$scope.get_options = function(){
		return $scope.promise;
	};
	
	$scope.onClick = function(evt){
		
		console.log("CLICKED!", evt, $scope, dataService.global);
		
		if($scope.field.data && $scope.field.data.url && $scope.get_url() == undefined)
			if($scope.field.data.error_message)
				messageService.showMessage($scope.field.data.error_message, "error");
		
		// SUBMIT
		if($scope.field && $scope.field.type == "submit" && $scope.field.action != "nothing")
		{
			console.log("[SUBMIT]", $scope);
			
			var args = dataService.getArgs($scope.field.data.source);
			
			$scope.doing_ajax = true;
			dataService.global["num_results"] = 0;
			dataService.global["success"] = undefined;
			console.log("AJAX [POST] BUTTON ARGS", args, $scope.field);
			$http.post($scope.field.data.url, args)
				 .then(
					function(result){
						$scope.doing_ajax = false;
						console.log("FORM RESULT", result);
						
						$scope.field.results = result.data;
						dataService.global["success"] = true;
						dataService.global["num_results"] = $scope.field.results.hits != undefined ? $scope.field.results.hits.length : $scope.field.results.total;
						
						console.log("MODIFYING GLOBAL", $scope.field.id, $scope.field.results);
						dataService.global[$scope.field.id] = $scope.field.results;
					},
					function(response){
						dataService.global["success"] = false;
						$scope.doing_ajax = false;
						console.log("FORM FAILED", response);
					}
				 );
		}
		
		// SEND
		if($scope.field.data && $scope.field.data.action == "send")
		{
			var form = dataService.global[$scope.field.data.source];
			console.log("[SEND] DATA SOURCE", $scope.field.data.source, dataService.global, form);
			
			var args = dataService.getArgs($scope.field.data.source);
			
			$scope.doing_ajax = true;
			console.log("AJAX [POST] BUTTON ARGS", $scope.field, args);
			$http.post($scope.field.data.onClick, args)
				 .then(
					function(result){
						
						$scope.doing_ajax = false;
						
						console.log("BUTTON CLICK OK", result);
						
						var a = document.createElement("a");
					    document.body.appendChild(a);
					    a.style = "display: none";
					    var data = result.data.content;
					    // data = data.replace(/\\n/g, "\n");
					    
				        var url = window.URL.createObjectURL(new Blob([data], {type: "octet/stream"}));
				        
				        a.href = url;
				        a.download = result.data.filename;
				        a.click();
				        window.URL.revokeObjectURL(url);
					},
					function(response){
						$scope.doing_ajax = false;
						console.log("BUTTON CLICK FAILED", response);
					}
				 );
		}
		else if($scope.field.action == "link") {
			
			var url = $scope.get_url();
			
			console.log("Opening a new window through link", $scope, url);
			
			if(url != undefined)
				// $window.open(url, "_blank", "width=800,height=600,left=50,top=50");
				$window.open(url);
		}
		else if($scope.field.action == "window") {
			console.log("Opening a new window with data", $scope);
			
			if($scope.get_url() != undefined){
				$scope.inputData = $scope.field.card;
				$window.parentScope = $scope;
				var popup = $window.open("/stress_mice/popup", "_blank", "width=800,height=600,left=50,top=50");
			}
		}
		else if($scope.field.action == "dialog") {
			
			var card = $scope.field.card;
	        
			console.log("I would like to open a dialog.", $scope);
			
	        $mdDialog.show({
	        	multiple: true,
	        	locals: {data: card},
	            controller: function DialogController($scope, $mdDialog, data) {
	                $scope.row = [data];
	                $scope.closeDialog = function() {
	                  $mdDialog.hide();
	                };
	                
	                $scope.show_dialog = function(evt, card){
	                    
	                    console.log("DIALOG", evt, card);
	                    
	                    $mdDialog.show({
	                    	multiple: true,
	                    	locals: {data: card},
	                        controller: function DialogController($scope, $mdDialog, data) {
	                            $scope.row = [data];
	                            $scope.closeDialog = function() {
	                              $mdDialog.hide();
	                            };
	                          },
	                        templateUrl: 'templates/dialog.html',
	                        parent: angular.element(document.body),
	                        targetEvent: evt,
	                        clickOutsideToClose:true
	                    });
	                };
	              },
	            templateUrl: 'templates/dialog.html',
	            parent: angular.element(document.body),
	            targetEvent: evt,
	            clickOutsideToClose:true
	        });
	        
	        console.log("Dialog opened.", $scope);
		}
		else
		{
			var value = undefined;
			
			if(evt){
				console.log("CLICK EVENT", evt);
				value = $scope.field.subdata.items[evt[0]._index][0];
				console.log("CLICK EVENT VALUE", evt, value);
			}
			else {
				console.log("CLICK", $scope);
				value = $scope.field.data.value;
			}
			
			var listener = $scope.field.data.onClick;
			if(listener) {
				for(var i=0; i<listener.length; i++)
				{
					var actionObject = listener[i];
					
					if(actionObject.action == "write" || actionObject.action == "delete")
					{
						if($scope.field.type == "chart-pie")
						{
							$scope.$apply(function() {
								console.log("[4] GLOBAL:", dataService, listener, value);
								dataService.global[actionObject.key] = actionObject.value || value.id || value;
								dataService.global[actionObject.key + "_value"] = value.id || value.label || value;
								console.log("[4] CHANGING VALUE OF VARIABLE '", actionObject, "' TO ", value, "real value: ", dataService.global[actionObject.key], dataService.global);
							});
						}
						else {
							
							var newValue = $scope.toString(actionObject.value);
							
							if(actionObject.scope == "global") {
								if (actionObject.target != undefined){
									var o = dataService.global;
									var path = actionObject.target;
									var pieces = path.split(".")
									for(var j=0;j<pieces.length-1; j++)
									{
										var piece = pieces[j];
										console.log(piece, o);
										o = o[piece]
									}
									
									if(actionObject.action == "write")
										o[pieces[pieces.length-1]] = newValue;
									else(actionObject.action == "delete")
										delete o[pieces[pieces.length-1]];
									console.log("AFTER CLICK", actionObject, o);
								}
							}
							else if(actionObject.scope == "self") $scope.field[actionObject.target] = newValue;
							else if(actionObject.scope != undefined) $scope.field[actionObject.scope][actionObject.target] = newValue;
							else {
								console.log("[5] GLOBAL:", dataService, listener, value, $scope.toString(actionObject.value));
								console.log("MODIFYING GLOBAL", actionObject.key, $scope.toString(actionObject.value));
								
								dataService.global[actionObject.key] = newValue;
								dataService.global[actionObject.key + "_value"] = $scope.toString(value); // value.id || value.label || value
								console.log("[5] CHANGING VALUE OF VARIABLE '", actionObject, "' TO ", newValue, "real value: ", dataService.global[actionObject.key], dataService.global);
							}
						}
					}
				}
			}
		}
	};
	
	$scope.getFields = function(){
		return dataService.getFields($scope.field.data.source);
	};
	
	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	  }
	
	$scope.upload = function(file){
		console.log("UPLOAD", file);
		
		Upload.upload({
            url: $scope.field.data.url,
            data: {file: file}
        }).then(function (resp) {
        	console.log('Success', resp);
        	var message = 'File ' + resp.config.data.file[0].name + ' uploaded.';
        	messageService.showMessage(message);
            $scope.field.message = message;
        }, function (resp) {
            console.log('Error status: ', resp);
            var message = resp.data + " (error code: " + resp.status +")";
            messageService.showMessage(message, "error");
            $scope.field.message = message;
            $scope.field.error = true;
        }, function (evt) {
//            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
//            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
//            messageService.showMessage('File caricato al ' + progressPercentage +'%');
        });
	};
});
