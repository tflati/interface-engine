app.controller("elementController", function($scope, $http, dataService){
	
	$scope.subdata = [];
	$scope.sending = false;

	$scope.globaldata = dataService.global;
	$scope.$watch(function(){return dataService.global;}, function(newValue) {
	        $scope.globaldata = newValue;
	}, true);
	
	$scope.init = function(data){
		
		$scope.type = data.type;
		$scope.label = data.label;
		$scope.data_source = data.data;
		$scope.numbered = data.numbered;
		$scope.width = data.width;
		$scope.height = data.height;
		
		console.log("ELEMENT METADATA: ", data);
		
		if($scope.data_source.value && $scope.data_source.key)
			dataService.global[$scope.data_source.key] = $scope.data_source.value;
		
		$scope.update($scope.get_url());
		
		if($scope.data_source.key){
			$scope.$watch(function(){return dataService.global[$scope.data_source.key];}, function(newValue, oldValue) {
				
			    if (newValue != oldValue){
			        console.log("Variable " + $scope.data_source.key+ " changed from " + oldValue + " to " + newValue + " (effective value="+dataService.global[$scope.data_source.key]+")");
			        $scope.update($scope.get_url());
			    }
			});
		}
	};
	
	$scope.get_url = function(){
		var template = $scope.data_source.template;
		
		var value = dataService.global[$scope.data_source.key];		
		var url = $scope.data_source.url;
		if(!template) return url;
		else return url.replace(template, value);
	};
	
	$scope.update = function(url, fx){
		if(url == undefined) return;
		
		if(!url.endsWith("/")) url += "/";
		
		console.log("AJAX TO", url);
		$scope.sending = true;
		
		if(fx == undefined) fx = $scope.onDataReceived;
		
		$http.get(url).then(fx,
			function myError(response) {
				$scope.sending = false;
            	console.log("ERROR IN GETTING DATA FROM " + url, response);
			}
		);
	};
	
	$scope.onDataReceived = function(response)
	{
		$scope.sending = false;
		console.log("SUCCESS IN GETTING DATA FROM " + response.config.url, response.data);
		$scope.subdata = response.data.details;
		
		if($scope.type == "chart-bar"){
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
			
			$scope.subdata.series = $scope.subdata.header.slice(1, $scope.subdata.header.length);
			
			$scope.subdata.options = {legend: { display: $scope.subdata.series.length > 0}};
		}
		
		console.log("ELEMENT DATA: ", $scope.subdata);
		console.log("SCOPE ELEMENT DATA: ", $scope);
	};
	
	$scope.onClick = function(evt){
		
		var value = $scope.subdata.header[evt[0]._index];
		console.log("CLICK EVENT", evt, value);
//	    var chr_for_query = chr.replace("chr", "").trim();
//	    self.clicked_chromosome = chr_for_query;
//	    self.load_subdata(self.info.links.statistics_single_chromosome + chr_for_query + "/");
		
		var listener = $scope.data_source.onClick;
		if(listener.action == "write") {
			
		$scope.$apply(function() {
			console.log("GLOBAL:", dataService);
			dataService.global[listener.key] = value;
			console.log("CHANGING VALUE OF VARIABLE '" + listener.key + "' TO " + value + " (real value: "+dataService.global[listener.key]+")");
		    });
		}
	};
});