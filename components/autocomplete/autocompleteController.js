app.controller("autocompleteController", function($scope, $http, $q, $filter, dataService, $timeout){
    
	var self = this;
	
	self.selectedItemChange = function (item) {
		console.log("AUTOCOMPLETE SELECTED", item);
		
		if( $scope.field.data && $scope.field.data.onChange) {
			
			if($scope.field.data.onChange.field){
				console.log("GLOBAL CHANGE 4a", item);
				dataService.global[$scope.field.data.onChange.key] = item == undefined ? item : item[$scope.field.data.onChange.field];
			}
			else {
				console.log("GLOBAL CHANGE 4b", item);
				if(item != undefined)
					dataService.global[$scope.field.data.onChange.key] = item == undefined ? item : item.label || item;
			}
		}
		
		if(item != undefined)
			$scope.field.data.value = item;
    };
	
	self.querySearch = function(query){
		
		console.log("AUTOCOMPLETE", "QUERY", query, $scope, $scope.field);
		
		if(query != "" && query != undefined)
			$scope.field.data.value = query;
		
		if ($scope.field.data && $scope.field.data.url){
			var deferred = $q.defer();
			
			console.log("AUTOCOMPLETE AJAX [GET]", $scope.field, "QUERY", query);
			
			$timeout.cancel(self.filterTextTimeout);

	        self.filterTextTimeout = $timeout(function() {
	        	
	        	$http.get($scope.field.data.url + query).then(
						function(response) {
							
							console.log("AUTOCOMPLETE AJAX [RESULT]", query, response);
							if (response.data.length == 1){
								console.log("AUTOCOMPLETE AJAX [RESULT] SINGLE RESULT ASSIGNMENT", query, response.data[0]);
								self.selectedItemChange(response.data[0]);
							}
							
							deferred.resolve(response.data);
						},
						function(response) {
						});
	        }, 1000);
			
			return deferred.promise;
		}
		else {
			console.log("AUTOCOMPLETE [CACHED]", query);
			var results = [];
			
			if(!query) results = $scope.field.data.subdata;
			else if($scope.field.sending) return $scope.field.data.subdata;
			else {
				results = $scope.field.data.subdata.filter(
						function(item)
						{
							return angular.lowercase(item.label).indexOf(angular.lowercase(query)) >= 0;
						});
			}
			
			return results;
		}
	};
	
	// INIT
	if($scope.field.data != undefined){
		
		var keys = [];
		if($scope.field.data.key) keys.push($scope.field.data.key);
		
		for(index in $scope.field.data.templates){
			
			var template = $scope.field.data.templates[index];
			console.log("TEMPLATE2", $scope.field.type, template);
			
			if(template.key && keys.indexOf(template.key) == -1) keys.push(template.key);
		}
		
		var key = $scope.field.data.onChange && $scope.field.data.onChange.key ? $scope.field.data.onChange.key : undefined;
		if(key != undefined && keys.indexOf(key) == -1)
			keys.push(key);
		console.log("KEYS (autocomplete)", $scope.field.type, $scope.field.key, keys);
		
//		for(index in keys)
//		{
//			var key = keys[index];
//			
//			console.log("AUTOCOMPLETE2 ADDING WATCH", $scope.field.type, $scope.field.key, "ON", key, $scope.field, dataService, dataService.global[key], $scope);
//			
//			$scope.$watch(function(){return dataService.global[key];}, function(newValue, oldValue) {
//				console.log("AUTOCOMPLETE2 INSIDE WATCH", $scope.field.type, $scope.field.key, "OF", key, newValue, oldValue, $scope);
//				
//			    if (newValue != oldValue){
//			    	
//			    	console.log($scope.field.type, "Variable " + key + " changed from " + oldValue + " to ", newValue, "effective value=", dataService.global[key], " field=", $scope.field);
//			    	
//			    	// $scope.field.data.value = newValue == undefined ? newValue : (newValue.label || newValue);
//			    	// $scope.field.data.value = newValue == undefined ? newValue : newValue[$scope.field.data.onChange.field];
//			    	
//			    	if($scope.field.data.templates){
//			    		console.log("Replacing autocomplete templates [PRE]", $scope.field.key, "OF", key, $scope.field.data.url);
//			    		$scope.replaceTemplates();
//			    		console.log("Replacing autocomplete templates [POST]", $scope.field.key, "OF", key, $scope.field.data.url);
//			    	}
//			    	
//			    	if(key != $scope.field.key && $scope.field.data && $scope.field.data.onChange != "nothing"){
//			    		$scope.update($scope.get_url());
//			    		console.log("AUTOCOMPLETE2", "Updated", $scope.field);
//			    	}
//			    	
//			    	if (newValue == undefined) newValue = "";
//			    	
//			    	if (key == $scope.field.key)
//			    		self.searchText = newValue;
//			    }
//			});
//		}
		
		var watchGroup = [];
		for(var i=0; i < keys.length; i++)
		{
			var key = keys[i];
			watchGroup[i] = "dataService.global['"+key+"']";
		}
		
		$scope.$watchGroup(watchGroup, function(newValues, oldValues) {
			for(var i=0; i<newValues.length; i+=1)
			{
				// Retrieve the key associated
				var key = keys[i];
				var newValue = newValues[i];
				var oldValue = oldValues[i];
				
//				console.log("INSIDE WATCH PRE", i, keys, watchGroup, key, $scope.field.type, "WHO", $scope.field.key, newValue, oldValue, dataService.global, $scope);
				
				if(newValue != oldValue)
				{
					// Useful to avoid cycles.
					// i)	An ajax call is made and returns the values
					// ii)	An autocomplete field is selected and the global variable written
					// iii) Since the autocomplete field is registered for changes made on the global variable,
					//		it is itself notified of the change
					//		(who made the change is the same who is notified about the event)
					// 
					var currentValue = $scope.field.data.value == undefined ? undefined : $scope.field.data.value.id || $scope.field.data.value;
					if(newValue != undefined && newValue == currentValue) continue;
					
					console.log("INSIDE WATCH (DIFF VALUES)", i, keys, watchGroup, key, $scope.field.type, "WHO", $scope.field.key, $scope.field.data.value, newValue, oldValue, $scope.field, dataService.global, $scope);
//				    	console.log($scope.field.type, "Change from " + oldValue + " to ", newValue, "effective value=", dataService.global[key], " field=", $scope.field);
					
			    	// Update value (it might be a simple value or an object)
			    	if($scope.field.subdata && $scope.field.subdata.length > 0) {
			    		console.log("AUTOCOMPLETE UPDATING VALUE 1", $scope.field.type, key, $scope.field.subdata, newValue);
			    		for(var i=0; i<$scope.field.subdata.length; i++) {
			    			var obj = $scope.field.subdata[i];
			    			if (obj == newValue || obj.id == newValue)
			    				$scope.field.data.value = obj;
			    		}
			    	}
			    	else {
			    		console.log("AUTOCOMPLETE UPDATING VALUE 2", $scope.field.type, key, $scope.field.data, newValue, $scope.field);
			    		if (key == $scope.field.key)
			    			$scope.field.data.value = newValue == undefined ? newValue : (newValue.label || newValue);
			    	}
			    	
			    	if($scope.field.data && $scope.field.data.templates)
			    	{
			    		console.log("AUTOCOMPLETE REPLACE TEMPLATES INSIDE WATCH", $scope.field.type, $scope.field.key, key, newValue, oldValue, $scope.field);
			    		$scope.replaceTemplates();
			    	}
			    	
//						// THINK ABOUT THIS...
//			    	if (key != $scope.field.key)
//				    	if($scope.field.data) {// && $scope.field.data.onChange != "nothing"
//				    		console.log("UPDATING", $scope.field.type, $scope.field.key, key, $scope.field);
//				    		
//				    		$scope.update($scope.get_url());
//				    	}
			    	
//			    	if(key != $scope.field.key && $scope.field.data && $scope.field.data.onChange != "nothing"){
//			    		$scope.update($scope.get_url());
//			    		console.log("AUTOCOMPLETE2", "Updated", $scope.field);
//			    	}
			    	
			    	if (newValue == undefined) newValue = "";
			    	
			    	if (key == $scope.field.key){
			    		console.log("INSIDE WATCH AUTOCOMPLETE SEARCH TEXT", newValue);
			    		self.searchText = newValue;
			    	}
			    	else {
			    		console.log("INSIDE WATCH AUTOCOMPLETE SEARCH TEXT EMPTY", $scope.field.data);
			    		self.searchText = $scope.field.data.value.id || $scope.field.data.value || "";
			    	}
			    	
			    	// DO THE QUERY
			    	self.querySearch(self.searchText);
				}
			}
		});
		
		// INIT DEL CAMPO
		if($scope.field.data.value) self.querySearch($scope.field.data.value.label || $scope.field.data.value);
	}
});