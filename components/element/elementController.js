app.controller("elementController", function($scope, $http, dataService, messageService){
	
	$scope.subdata = [];
	$scope.sending = false;

//	$scope.globaldata = dataService.global;
//	$scope.$watch(function(){return dataService.global;}, function(newValue) {
//	        $scope.globaldata = newValue;
//	}, true);
	
	$scope.init = function(data){
		
		$scope.type = data.type;
		$scope.stacked = data.stacked;
		$scope.label = data.label;
		$scope.data_source = data.data;
		$scope.numbered = data.numbered;
		$scope.width = data.width;
		$scope.height = data.height;
		$scope.inline = data.inline;
		
		console.log("ELEMENT METADATA: ", data);
		
		if($scope.data_source && $scope.data_source.value && $scope.data_source.key)
			dataService.global[$scope.data_source.key] = $scope.data_source.value;
		
		if($scope.type != "image")
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
		
		if($scope.data_source != undefined && $scope.data_source.onChange){
			var listener = $scope.data_source.onChange;
			if(listener.action == "write") {
				console.log("[1] GLOBAL:", dataService, $scope.data_source);
				dataService.global[listener.key] = $scope.data_source.value;
				console.log("[1] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", $scope.data_source.value, "real value: ", dataService.global[listener.key]);
			}
		}
		
		if($scope.data_source != undefined && $scope.data_source.checked == true){
			console.log("CHECKBOX", $scope.data_source.checked);
			for(var i=0; i<$scope.data_source.values.length; i++)
				$scope.toggle($scope.data_source.values[i], $scope.data_source.values);
			
		}
	};
	
	$scope.exists = function(item, field){
	    if(field.value == undefined) return false;
	    return field.value.indexOf(item) > -1;
	};
	
	$scope.toggle = function (item, field) {
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
			dataService.global[listener.key] = newValue.id;
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
				          return chartData.labels[tooltipItem[0].index].label + " (ID:"+chartData.labels[tooltipItem[0].index].id+")"
				        },
				        label: function(tooltipItem, chartData) {
					          console.log("LABEL", tooltipItem, chartData)
					          var key = chartData.datasets[0].label;
					          if (key == undefined) key = chartData.labels[tooltipItem.index].label;
					          return  key + ": " + chartData.datasets[0].data[tooltipItem.index];
					        }
				      }
			    }
			};
			
			if($scope.type != "chart-pie" && $scope.type != "chart-doughnut"){
				$scope.subdata.options.scales = {
			        xAxes: [{
			          stacked: $scope.stacked,
			          ticks: {
		                  callback: function (label) {
//							                  console.log("X AXIS", label);
		                      return label.id;
		                  }
			          }
			        }],
			        yAxes: [{
			          stacked: $scope.stacked,
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
				console.log("SIMPLIFYING DATA", response, $scope.subdata, $scope.subdata.points);				
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
				
	//			[
	//				{sets: ['Foo'], size: 12},
	//				{sets: ['Bar'], size: 12},
	//				{sets: ['Baz'], size: 12},
	//				{sets: ['Foo','Bar'], size: 2},
	//				{sets: ['Bar','Baz'], size: 2},
	//				{sets: ['Foo','Baz'], size: 2},
	//				{sets: ['Foo','Bar', 'Baz'], size: 1},
	//			];
			}
		}
		
//		console.log("SCOPE ELEMENT DATA: ", $scope);
	};
	
	$scope.onClick = function(evt){
		
		var value = $scope.subdata.items[evt[0]._index][0];
		console.log("CLICK EVENT", evt, value);
		
		var listener = $scope.data_source.onClick;
		if(listener.action == "write") {
			$scope.$apply(function() {
				console.log("[3] GLOBAL:", dataService);
				dataService.global[listener.key] = value.id;
				console.log("[3] CHANGING VALUE OF VARIABLE '" + listener.key + "' TO ", value, "real value: ",dataService.global[listener.key]);
			    });
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
});