app.controller("autocompleteController", function($scope, $q, $filter, dataService){
    
	var self = this;
	
	self.querySearch = function(query){
		console.log("AUTOCOMPLETE", query, $scope, $scope.field);
		
		var results = [];
		
//		if( $scope.field.sending ) {
//			return $scope.field.promise;
//		}
		
		if(!query) results = $scope.field.values;
		else if($scope.field.sending) return $scope.field.values;
		else {
			results = $scope.field.values.filter(
					function(item)
					{
						// console.log("FILTER item= vs query=", item, query);
						return angular.lowercase(item.label).indexOf(angular.lowercase(query)) >= 0;
					});
			// results = $filter('orderBy')(results, function(item){return item.label;});
		}
		
//		console.log("# RESULTS: ", results.length);
//		if(results.length <= 30) console.log(results);
		
		return results;
	};
	
	self.selectedItemChange = function (item) {
		
		console.log("AUTOCOMPLETE SELECTED", item);
		
		if( $scope.field.data && $scope.field.data.onChange )
	      dataService.global[$scope.field.data.onChange.key] = item.label;
    };
});