app.controller("elementController", function($scope, $sce, $http, $window, $mdDialog, dataService, messageService){
	
//	$scope.subdata = [];
	$scope.sending = false;

	$scope.init = function(data){
		
//		console.log("INITIALIZING", data.type, data);
		
//		$scope.field = data;
		
		$scope.field = data;
		$scope.field.subdata = data.subdata || [];
		
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
		
		if($scope.field.type != "image" && $scope.field.type != "iframe")
			$scope.update($scope.get_url());
		
		if($scope.field.value) $scope.field.data.value = $scope.field.value;
		
		if($scope.field.data != undefined){
			
			var keys = [];
			if($scope.field.data.key) keys.push($scope.field.data.key);
			
			for(index in $scope.field.data.templates){
				
				var template = $scope.field.data.templates[index];
				console.log("TEMPLATE2", $scope.field.type, data, template);
				
				if(template.key && keys.indexOf(template.key) == -1) keys.push(template.key);
			}
			if($scope.field.data.onChange && $scope.field.data.onChange.key != undefined && keys.indexOf($scope.field.data.onChange.key) == -1) keys.push($scope.field.data.onChange.key);
			
			console.log("KEYS", $scope.field.type, data, keys);
			
			for(index in keys)
			{
				var key = keys[index];
				
				if($scope.field.data && $scope.field.data.variable_value)
					$scope.replaceTemplates();
				
				console.log("ADDING WATCH", $scope.field.type, key, $scope.field, dataService, dataService.global[key], $scope);
				
				$scope.$watch(function(){return dataService.global[key];}, function(newValue, oldValue) {
					console.log("INSIDE WATCH", $scope.field.type, key, newValue, oldValue, $scope);
					
				    if (newValue != oldValue){
				    	
				    	console.log($scope.field.type, "Variable " + key + " changed from " + oldValue + " to ", newValue, "effective value=", dataService.global[key], " field=", $scope.field);
				    	
				    	// Update of value (it might be a simple value or an object
				    	if($scope.field.subdata && $scope.field.subdata.length > 0){
				    		console.log("UPDATING VALUE 1", $scope.field.type, $scope.field.subdata, newValue);
				    		for(var i=0; i<$scope.field.subdata.length; i++) {
				    			var obj = $scope.field.subdata[i];
				    			if (obj == newValue || obj.id == newValue)
				    				$scope.field.data.value = obj;
				    		}
				    	}
				    	else {
				    		console.log("UPDATING VALUE 2", $scope.field.type, $scope.field.data, newValue);
				    		$scope.field.data.value = newValue == undefined ? newValue : (newValue.label || newValue);
				    	}
				    	
				    	if($scope.field.data && $scope.field.data.onChange != "nothing")
				    		$scope.update($scope.get_url());
				    	
				    	if($scope.field.data.templates)
				    		$scope.replaceTemplates();
				    }
				});
			}
			
			// Necessary for checkbox
			if(! $scope.field.data.url && $scope.field.data.values ) {
				$scope.field.subdata = $scope.field.data.values;
			}
		}
		
		if($scope.field.data && $scope.field.data.onChange){
			console.log("ANALYZING ON CHANGE", $scope.field.data.onChange);
			
			var listener = $scope.field.data.onChange;
			if(listener.action == "write") {
				console.log("[1] ONCHANGE GLOBAL:", dataService, $scope.field.data);
				dataService.global[listener.key] = $scope.field.data.value;
				console.log("[1] ONCHANGE CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.field.data.value, "real value: ", dataService.global[listener.key]);
			}
		}
		
		// Needed for checkbox initialization
		if($scope.field.data && $scope.field.data.checked == true) {
			console.log("INIT CHECKBOX", data.label, $scope.field.data.checked, $scope.field.data);
			for(var i=0; i<$scope.field.subdata.length; i++)
				$scope.toggle($scope.field.subdata[i]);
		}
		
		if($scope.field.subdata)
			$scope.convert();
		
		if($scope.field.data && $scope.field.data.variable_value)
			$scope.replaceTemplates();
		
		console.log("INIT FINAL ELEMENT METADATA: ", data, $scope.field.data, $scope.field.subdata);
	};
	
	$scope.exists = function(item){
//		console.log("EXISTS", item, $scope.field.data.value, $scope.field.data.value == undefined ? false : $scope.field.data.value.indexOf(item) > -1);
	    if($scope.field.data.value == undefined) return false;
	    return $scope.field.data.value.indexOf(item) > -1;
	};
	
	$scope.toggle = function (item) {
		
		if($scope.field.exclusive) {
			if ($scope.field.data.value == item) $scope.field.data.value = undefined;
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
		if(listener.action == "write") {
			console.log("[3bis] GLOBAL:", dataService);
			dataService.global[listener.key] = $scope.field.data.value.join("|");
			console.log("[3bis] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.field.data.value, "real value: ",dataService.global[listener.key]);
		}
	};
	
	$scope.onChange = function(newValue){
		console.log("["+$scope.field.type+"] NEW VALUE: ", newValue, $scope.field);
		
			var listener = $scope.field.data.onChange;
			if(listener && listener.action == "write") {
				console.log("[2] ONCHANGE GLOBAL:", dataService);
				dataService.global[listener.key] = newValue == undefined ? newValue : (newValue.id || newValue);
				console.log("[2] ONCHANGE CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", newValue, " (real value: "+dataService.global[listener.key]+")");
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
				if(template.key) value = dataService.global[template.key];
				// else if(template.value_of) value = dataService.global[dataService.global[template.value_of]];
				if(value == undefined) { // value == ""
//					console.log("GET_URL MID ERROR", $scope.field, dataService);
					$scope.field.subdata = [];
					return undefined;
				}
				
//				console.log("GET URL MID", $scope.field.type, value);
				
				if(value.label) value = value.id; // MODIFIED
				if(angular.isString(value)) value = value.replace("/", "");
				
//				console.log("TEMPLATE REPLACEMENT", template, value);
				
				finalUrl = finalUrl.replace(template.template, value);
			}
			
//			console.log("GET_URL FINAL", url, finalUrl);
			
			return finalUrl;
		}
	};
	
	$scope.replaceTemplates = function(){
		
		if($scope.field.data.url) return;
		
		console.log($scope.field.type, $scope.field.data, "REPLACEMENT IN VALUE [0]", $scope);
		
		if($scope.field.data.variable_value)
			$scope.field.data.value = $scope.field.data.variable_value;
		
		var templates = $scope.field.data.templates;
		for (index in templates)
		{
			var template = templates[index];
			
			console.log($scope.field.type, $scope.field.data, "TEMPLATE REPLACEMENT IN VALUE [1]", $scope.field.data.value, template, template.key, $scope.field.data.value, dataService.global[template.key], dataService.global);
			
			var value = undefined;
			if(template.key) value = dataService.global[template.key];
			if(value == undefined) {
				console.log($scope.field.type, $scope.field.data, "TEMPLATE REPLACEMENT IN VALUE [1bis]", template, value, dataService.global[template.key], dataService.global);
				continue;
			}
			
			if(value.label) value = value.label;
			else if(value.id) value = value.id;
			if(angular.isString(value)) value = value.replace("/", "");

			console.log($scope.field.type, $scope.field.data, "TEMPLATE REPLACEMENT IN VALUE [2]", $scope.field.data.value, template, value);
			
			$scope.field.data.value = $scope.field.data.value.replace(template.template, value);
		}
		console.log($scope.field.type, $scope.field.data, "REPLACED", $scope.field.data.variable_value, $scope.field.data.value);
	};
	
	$scope.update = function(url, fx){
		
		if($scope.field.type == "autocomplete") return;
		
		if(url == undefined) return;
		if(url == "") return;
		
		console.log("PREAJAX TO", url, $scope.field.data);
		
		if(url.slice(-1) != "/") url += "/";
		url = url.replace(/#/g, "_SHARP_");
		
		console.log("AJAX TO", url, $scope.field.data);
		if(fx == undefined) fx = $scope.onDataReceived;

		$scope.sending = true;
		
		var promise = $http.get(url);
		promise.then(fx,
			function myError(response) {
				$scope.sending = false;
            	console.log("ERROR IN GETTING DATA FROM " + url, response);
//            	messageService.showMessage('Errore durante il recupero dei dati da '+response.config.url+'. ' + 'Error code: ' + response.status, "error");
			}
		);
	};
	
	$scope.onDataReceived = function(response)
	{
		$scope.sending = false;
		console.log("SUCCESS IN GETTING DATA FROM " + response.config.url, response, $scope, $scope.field.data);
		
		if(response.data.details) $scope.field.subdata = response.data.details;
		else $scope.field.subdata = response.data;

		if($scope.field.subdata.items && $scope.field.subdata.items.length == 0 && $scope.field.data.empty_message){
			messageService.showMessage($scope.field.data.empty_message, "error");
		}
		
		for(var k in $scope.field.subdata)
		{
			var item = $scope.field.subdata[k];
			if(item.id == $scope.field.data.value)
			{
				console.log("INIT FOUND", item, $scope.field);
				$scope.field.data.value = item;
				
				var listener = $scope.field.data.onChange;
				if(listener && listener.action == "write") {
					console.log("[3] GLOBAL:", dataService);
					dataService.global[listener.key] = $scope.field.data.value.id || $scope.field.data.value;
					console.log("[3] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.field.data.value, "real value: ",dataService.global[listener.key]);
				}
				
				break;
			}
		}
		
//		$scope.field.values = $scope.subdata; // ADDED
		
		$scope.convert();
//		console.log("SCOPE ELEMENT DATA: ", $scope);
		
		if($scope.field.data.onFinish){
			
			console.log("ON FINISH [1]", $scope);
			
			for(var i in $scope.field.data.onFinish)
			{
				var condition = $scope.field.data.onFinish[i];
				
				console.log("ON FINISH [2]", $scope, condition);
				
				var value = "";
				if (condition.property == "length")
					value = $scope.field.subdata.items.length;
				
				console.log("WATCH", "CHANGING GLOBAL VALUE", condition.key, value);
				dataService.global[condition.key] = value;
			}
			
			console.log("ON FINISH [3]", $scope, condition, dataService.global);
		}
	};
	
	$scope.convert = function(){
		
		console.log("CONVERTING ", $scope);
		
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
		
		if($scope.field.type == "chart-line" || $scope.field.type == "chart-bar" || $scope.field.type == "chart-pie" || $scope.field.type == "chart-doughnut"){
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
					legend: { display: false },
					tooltips: {
					    callbacks: {
					        title: function(tooltipItem, chartData) {
	//					          console.log("TITLE", tooltipItem, chartData)
						      var item = chartData.labels[tooltipItem[0].index];
						      
						      if(item.label) s = item.label;
						      else s = item;
						      
						      // if(item.id) s += " (ID:"+item.id+")";
						      
					          return s;
					        },
					        label: function(tooltipItem, chartData) {
	//					          console.log("LABEL", tooltipItem, chartData)
						          var datasetIndex = tooltipItem.datasetIndex;
						          
						          var key = chartData.datasets[datasetIndex].label;
						          if (key == undefined) key = chartData.labels[tooltipItem.index].label;
						          
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
							          
							          finalString += " ("+percentage+"%)";
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
					$scope.field.subdata.options.legend.display = $scope.field.subdata.series.length > 0;
					
					if($scope.field.data.max) {
						$scope.field.subdata.options.scales.yAxes[0].ticks.max = parseFloat($scope.field.data.max);
					}
					if($scope.field.data.min) {
						$scope.field.subdata.options.scales.yAxes[0].ticks.min = parseFloat($scope.field.data.min);
					}
					
//					if($scope.field.subdata.points.length == 1)
//						$scope.field.subdata.points = $scope.field.subdata.points[0];
					
//					if(!$scope.stacked) {
//						$scope.field.subdata.points = $scope.field.subdata.points[0];
//						console.log("SIMPLIFYING DATA", $scope.field.subdata, $scope.field.subdata.points);				
//					}
				}
				
				console.log("CHART OPTIONS", $scope.field.subdata.options);
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
					for(var j=0; j<pieces.length; j++)
					{
						final_pieces.push(pieces[j] + " ("+sizes[pieces[j]]+")");
					}
//					if (pieces.length == 1) pieces += " ("+$scope.subdata.items[0][i]+")";
					
					formatted_data.push({"sets": final_pieces, "size": $scope.field.subdata.items[0][i]});
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
		
		console.log("FINAL ELEMENT METADATA: ", $scope.field.type, $scope.field.subdata, $scope);
	};
	
	$scope.onClick = function(evt){
		
		console.log("CLICKED!", evt, $scope, dataService.global);
		
		if($scope.field.data.url && $scope.get_url() == undefined)
			if($scope.field.data.error_message)
				messageService.showMessage($scope.field.data.error_message, "error");
		
		if($scope.field && $scope.field.data.action == "send")
		{
			var form = dataService.global[$scope.field.data.source];
			console.log("DATA SOURCE", $scope.field.data.source, dataService.global, form);
			
			var args = {};
			for(var i=0; i<form.fields.length; i++)
			{
				var field = form.fields[i];
				console.log("FIELD", field);
				
				if (angular.isArray(field.data.value)) {
					subargs = []
					for (var j=0; j<field.data.value.length; j++){
						var value = field.data.value[j].id;
						if (value == undefined) value = field.data.value[j];
						console.log("VALUE", value);
						
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
					
					console.log("VALUE", value);
					
					// if (value == undefined || value == "undefined" || value == "") value = "ALL";
					args[field.key] = value;
				}
			}
			
			console.log("BUTTON ARGS SENT VIA POST", args);
			
			$scope.doing_ajax = true; 
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
				$window.open(url, "_blank", "width=800,height=600,left=50,top=50");
		}
		else if($scope.field.action == "window") {
			console.log("Opening a new window with data", $scope);
			
			if($scope.get_url() != undefined){
				$scope.inputData = $scope.field.card;
				$window.parentScope = $scope;
				var popup = $window.open("/interface-engine/popup", "_blank", "width=800,height=600,left=50,top=50");
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
				console.log("CLICK", evt);
				value = $scope.field.subdata.items[evt[0]._index][0];
				console.log("CLICK EVENT", evt, value);
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
					
					if(actionObject.action == "write")
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
							console.log("[5] GLOBAL:", dataService, listener, value);
							dataService.global[actionObject.key] = actionObject.value || value.id || value;
							dataService.global[actionObject.key + "_value"] = value.id || value.label || value;
							console.log("[5] CHANGING VALUE OF VARIABLE '", actionObject, "' TO ", value, "real value: ", dataService.global[actionObject.key], dataService.global);
						}
					}
				}
			}
		}
	};
	
	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	  }
});