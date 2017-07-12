app.controller("autocompleteController", function($scope, $q, $filter){
	
	var self = this;
	
	console.log("Autocomplete field: ", $scope.field);
	
	self.querySearch = function(query){
		var results = [];
		
		console.log(query);
		
		if(!query) results = $scope.field.values;
		else if ($scope.field.sending) results = $scope.field.values;
		else {
			results = $scope.field.values.filter(
					function(item)
					{
						// console.log("FILTER item= vs query=", item, query);
						return angular.lowercase(item.label).indexOf(angular.lowercase(query)) >= 0;
					});
			results = $filter('orderBy')(results);
		}
		
		console.log("# RESULTS: ", results.length);
		if(results.length <= 30) console.log(results);
		
		return results;
	};
});