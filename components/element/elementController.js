app.controller("elementController", function($scope, $sce, $http, $window, $mdDialog, dataService, messageService){
	
	$scope.subdata = [];
	$scope.sending = false;

//	$scope.globaldata = dataService.global;
//	$scope.$watch(function(){return dataService.global;}, function(newValue) {
//	        $scope.globaldata = newValue;
//	}, true);
	
	$scope.init = function(data){
		
		console.log("INITIALIZING", data.type, data);
		
		$scope.type = data.type;
		$scope.action = data.action;
		$scope.card = data.card;
		$scope.key = data.key;
		$scope.stacked = data.stacked;
		$scope.showLegend = data.showLegend;
		$scope.title = data.title;
		$scope.label = data.label;
		$scope.data_source = data.data;
		$scope.numbered = data.numbered;
		$scope.width = data.width;
		$scope.height = data.height;
		$scope.inline = data.inline;
		$scope.subdata = data.subdata || [];
		
		console.log("INIT ELEMENT METADATA: ", data, $scope.data_source);
		
		if($scope.data_source && $scope.data_source.value && $scope.data_source.key)
			dataService.global[$scope.data_source.key] = $scope.data_source.value;
		
		if($scope.type != "image" && $scope.type != "iframe")
			$scope.update($scope.get_url());
		
		if($scope.data_source != undefined){
			if($scope.data_source.key)
				$scope.$watch(function(){return dataService.global[$scope.data_source.key];}, function(newValue, oldValue) {
				    if (newValue != oldValue){
				    	
				    	console.log("Variable " + $scope.data_source.key+ " changed from " + oldValue + " to ", newValue, "effective value=", dataService.global[$scope.data_source.key]);
				    	
				    	if(! $scope.data_source.url) {
				    		$scope.data_source.value = newValue;
				    	}
				    	else {
				        	$scope.update($scope.get_url());
				    	}
				    }
				});
			
			if(! $scope.data_source.url && $scope.data_source.values ) {
				$scope.subdata = $scope.data_source.values;
			}
		}
		
		if($scope.data_source && $scope.data_source.onChange){
			var listener = $scope.data_source.onChange;
			if(listener.action == "write") {
				console.log("[1] GLOBAL:", dataService, $scope.data_source);
				dataService.global[listener.key] = $scope.data_source.value;
				console.log("[1] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.data_source.value, "real value: ", dataService.global[listener.key]);
			}
		}
		
		if($scope.data_source && $scope.data_source.checked == true){
			console.log("INIT CHECKBOX", $scope.data_source.checked, $scope.data_source);
			for(var i=0; i<$scope.data_source.values.length; i++)
				$scope.toggle($scope.data_source.values[i], $scope.data_source.values);
		}
		
		if(data.subdata)
			$scope.convert();
		
		console.log("INIT FINAL ELEMENT METADATA: ", data, $scope.subdata);
	};
	
	$scope.exists = function(item, field){
//		console.log("EXISTS", item, field);
	    if(field.value == undefined) return false;
	    return field.value.indexOf(item) > -1;
	};
	
	$scope.toggle = function (item, field) {
//		console.log("TOGGLE", item, field);
	    if(field.value == undefined) field.value = []                        
	    var idx = field.value.indexOf(item);
	    if (idx > -1) {
	    	field.value.splice(idx, 1);
	    	
//	    	evt = []
//		    evt[0]._index = idx;
//		    $scope.onClick(evt);
	    }
	    else {
	    	field.value.push(item);
	    }
	    
	    var listener = $scope.data_source.onClick;
		if(listener.action == "write") {
			console.log("[3] GLOBAL:", dataService);
			dataService.global[listener.key] = field.value.join("|");
			console.log("[3] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", field.value, "real value: ",dataService.global[listener.key]);
		}
	};
	
	$scope.onChange = function(newValue){
		console.log("["+$scope.type+"] NEW VALUE: ", newValue);
		
		var listener = $scope.data_source.onChange;
		if(listener.action == "write") {
			console.log("[2] GLOBAL:", dataService);
			dataService.global[listener.key] = newValue.id || newValue;
			console.log("[2] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", newValue, " (real value: "+dataService.global[listener.key]+")");
		}
	};
	
	$scope.get_url = function(){
		
		if ( $scope.data_source == undefined ) {
			console.log("[STRANGE]", $scope);
			return "";
		}
		var template = $scope.data_source.template;
		
		var url = $scope.data_source.url;
		if(!template) return url;
		else {
			var value = dataService.global[$scope.data_source.key];
			if(value == undefined) return "";
			
			return url.replace(template, value);
		}
	};
	
	$scope.update = function(url, fx){
		
		console.log("PREAJAX TO", url, $scope.data_source);
		
		if(url == undefined) return;
		if(url == "") return;
		
		if(!url.endsWith("/")) url += "/";
		
		console.log("AJAX TO", url, $scope.data_source);
		$scope.sending = true;
		
		if(fx == undefined) fx = $scope.onDataReceived;
		
		$http.get(url).then(fx,
			function myError(response) {
				$scope.sending = false;
            	console.log("ERROR IN GETTING DATA FROM " + url, response);
            	messageService.showMessage('Errore durante il recupero dei dati da '+response.config.url+'. ' + 'Error code: ' + response.status, "error");
			}
		);
	};
	
	$scope.onDataReceived = function(response)
	{
		$scope.sending = false;
		console.log("SUCCESS IN GETTING DATA FROM " + response.config.url, response, $scope.data_source);
		
		if(response.data.details) $scope.subdata = response.data.details;
		else $scope.subdata = response.data;
		
		$scope.convert();
//		console.log("SCOPE ELEMENT DATA: ", $scope);
	};
	
	$scope.convert = function(){
		
		console.log("CONVERTING ", $scope);
		
		if($scope.type == "chart-bar" || $scope.type == "chart-pie" || $scope.type == "chart-doughnut"){
			$scope.subdata.labels = []
			$scope.subdata.points = []
			
			for(var i=0; i<$scope.subdata.header.length-1; i++)
				$scope.subdata.points.push([]);
			
			for(var i=0; i<$scope.subdata.items.length; i++)
			{
				var item = $scope.subdata.items[i];
				
				$scope.subdata.labels.push(item[0]);
				
				for(var j=1; j<$scope.subdata.header.length; j++)
					$scope.subdata.points[j-1].push(item[j]);
			}
			
			$scope.subdata.options = {
				legend: { display: false },
				tooltips: {
				    callbacks: {
				        title: function(tooltipItem, chartData) {
					          console.log("TITLE", tooltipItem, chartData)
					      var item = chartData.labels[tooltipItem[0].index];
					          
					      if(item.label) s = item.label;
					      else s = item;
					      
					      if(item.id) s += " (ID:"+item.id+")";
					      
				          return s;
				        },
				        label: function(tooltipItem, chartData) {
					          console.log("LABEL", tooltipItem, chartData)
					          var datasetIndex = tooltipItem.datasetIndex;
					          
					          var key = chartData.datasets[datasetIndex].label;
					          if (key == undefined) key = chartData.labels[tooltipItem.index].label;
					          
					          var value = chartData.datasets[datasetIndex].data[tooltipItem.index];
					          
					          var finalString = key + ": " + value;
					          
					          if ($scope.type == "chart-pie" || $scope.type == "chart-doughnut"){
					        	  var allData = chartData.datasets[datasetIndex].data;
								  var total = 0;
								  for (var i in allData) {total += allData[i];}
						          var percentage = Math.round((value / total) * 100);
						          
						          finalString += " ("+percentage+"%)";
					          }
					          
					          return finalString;
					        }
				      }
			    }
			};
			
			if($scope.type != "chart-pie" && $scope.type != "chart-doughnut"){
				$scope.subdata.options.scales = {
			        xAxes: [{
			          stacked: $scope.stacked && $scope.stacked == true ? true : false,
			          ticks: {
		                  callback: function (label) {
//							                  console.log("X AXIS", label);
		                      return label.id;
		                  }
			          }
			        }],
			        yAxes: [{
			          stacked: $scope.stacked && $scope.stacked == true ? true : false,
			          ticks: {}
		        }]}
			};
			
			if($scope.type == "chart-bar") {
				$scope.subdata.series = $scope.subdata.header.slice(1, $scope.subdata.header.length);
				$scope.subdata.options.legend.display = $scope.subdata.series.length > 0;
				
				if($scope.stacked)
					if($scope.data_source.max) {
//						console.log("MAX VALUE", $scope.data_source.max);
						$scope.subdata.options.scales.yAxes[0].ticks.max = parseFloat($scope.data_source.max);
				}
			}
			else {
				$scope.subdata.points = $scope.subdata.points[0];
				console.log("SIMPLIFYING DATA", $scope.subdata, $scope.subdata.points);				
			}
		}
		else if($scope.type == 'venn')
		{
			if($scope.subdata.items)
			{
				console.log("VENN", $scope.subdata);
				
				formatted_data = [];
				sizes = {};
				for(var i=0; i<$scope.subdata.header.length; i++)
				{
					var name = $scope.subdata.header[i];
					var size = $scope.subdata.items[0][i];
					if (name.indexOf("\u2229") !== -1) continue;
					
					sizes[name] = size;
				}
				
				console.log("VENN", sizes);
				
				for(var i=0; i<$scope.subdata.header.length; i++)
				{
					var pieces = $scope.subdata.header[i].split("\u2229");
					var final_pieces = []
					for(var j=0; j<pieces.length; j++)
					{
						final_pieces.push(pieces[j] + " ("+sizes[pieces[j]]+")");
					}
//					if (pieces.length == 1) pieces += " ("+$scope.subdata.items[0][i]+")";
					
					formatted_data.push({"sets": final_pieces, "size": $scope.subdata.items[0][i]});
				}
				console.log("VENN", formatted_data);
				
				$scope.subdata = formatted_data;
			}
		}
		
		console.log("FINAL ELEMENT METADATA: ", $scope.type, $scope.subdata, $scope);
	};
	
	$scope.onClick = function(evt){
		
		console.log("CLICKED!", evt, $scope);
		
		if($scope.data_source && $scope.data_source.action == "send")
		{
			var form = dataService.global[$scope.data_source.source];
			console.log("DATA SOURCE", $scope.data_source.source, dataService.global, form);
			
			var args = {};
			for(var i=0; i<form.fields.length; i++)
			{
				var field = form.fields[i];
				console.log("FIELD", field);
				
				if (angular.isArray(field.value)) {
					subargs = []
					for (var j=0; j<field.value.length; j++){
						var value = field.value[j].id;
						if (value == undefined) value = field.value[j];
						console.log("VALUE", value);
						
						if (value == undefined || value == "undefined" || value == "") value = "ALL";
						subargs.push(value);
					}
					
					args[field.key] = subargs;
				}
				else {
					var value = "ALL";
					if (field.value && field.value.id) value = field.value.id;
					else if (field.value) value = field.value;
					
					if (field.type == "checkbox") value = field.value;
					
					console.log("VALUE", value);
					
					// if (value == undefined || value == "undefined" || value == "") value = "ALL";
					args[field.key] = value;
				}
			}
			
			console.log("BUTTON ARGS SENT VIA POST", args);
			
			$scope.doing_ajax = true; 
			$http.post($scope.data_source.onClick, args)
				 .then(
					function(result){
						
						$scope.doing_ajax = false;
						
						console.log("BUTTON CLICK OK", result);
						
						var a = document.createElement("a");
					    document.body.appendChild(a);
					    a.style = "display: none";
					    var data = result.data.content;
					    
				        var url = window.URL.createObjectURL(new Blob([JSON.stringify(data)], {type: "octet/stream"}));
				        
				        a.href = url;
				        a.download = result.data.filename;
				        a.click();
				        window.URL.revokeObjectURL(url);
					},
					function(response){
						$scope.doing_ajax = false;
						console.log("BUTTON CLICK FAILED", result);
					}
				 );
		}
		else if($scope.action == "window") {
			console.log("Opening a new window with data", $scope.card);
			
			$scope.inputData = $scope.card;
			$window.parentScope = $scope;
			var popup = $window.open("http://localhost/interface-engine/popup", "_blank", "width=800,height=600,left=50,top=50");
		}
		else if($scope.action == "dialog") {
			
			var card = $scope.card;
	        
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
	                    
	                    console.log(evt, card);
	                    
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
			console.log("CLICK", evt);
			var value = $scope.subdata.items[evt[0]._index][0];
			console.log("CLICK EVENT", evt, value);
			
			var listener = $scope.data_source.onClick;
			if(listener && listener.action == "write") {
				$scope.$apply(function() {
					console.log("[3] GLOBAL:", dataService);
					dataService.global[listener.key] = value.id || value;
					console.log("[3] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", value, "real value: ",dataService.global[listener.key]);
				    });
			}
		}
		
//		var changeListener = $scope.data_source.onClick;
//		if(changeListener.action == "write") {
//			$scope.$apply(function() {
//				console.log("GLOBAL:", dataService);
//				dataService.global[changeListener.key] = value;
//				console.log("CHANGING VALUE OF VARIABLE '" + changeListener.key + "' TO " + value + " (real value: "+dataService.global[changeListener.key]+")");
//			});
//		}
	};
	
	$scope.trustSrc = function(src) {
	    return $sce.trustAsResourceUrl(src);
	  }
});