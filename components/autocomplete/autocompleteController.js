app.controller("autocompleteController", function($scope){
	var self = this;
	
	console.log("Autocomplete field: ", $scope.field);
	
	self.querySearch = function(query){
		if(!query) return $scope.field.values;
		
//		console.log("GENE NAME:", query);
		// console.log("VALUES: ", $scope.field.values);
//		console.log("GENE VALUES:", $scope.field.values.length);
//		console.log("QUERY LC: ", angular.lowercase(query));
		
		var results = $scope.field.values.filter(
				function(item)
				{
					// console.log("FILTER item= vs query=", item, query);
					return angular.lowercase(item).indexOf(angular.lowercase(query)) === 0;
				});
		
		console.log("# RESULTS: ", results.length);
		
		return results;
	};
});