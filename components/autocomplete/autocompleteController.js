app.controller("autocompleteController", function($scope, $q, $filter){
	
	var self = this;
	
	console.log("Autocomplete field: ", $scope.field);
	
	self.querySearch = function(query){
		var results = [];
		
		if(!query) results = $scope.field.values;
		else {
			//		console.log("GENE NAME:", query);
					// console.log("VALUES: ", $scope.field.values);
			//		console.log("GENE VALUES:", $scope.field.values.length);
			//		console.log("QUERY LC: ", angular.lowercase(query));
			
			results = $scope.field.values.filter(
					function(item)
					{
						// console.log("FILTER item= vs query=", item, query);
						return angular.lowercase(item.label).indexOf(angular.lowercase(query)) === 0;
					});
			results = $filter('orderBy')(results);
		}
		
		console.log("# RESULTS: ", results.length);
		if(results.length <= 30) console.log(results);
		
		return $q.resolve(results);
	};
	
	self.itemToLabel = function(item){
		console.log("ITEM TO LABEL", item);
		return "CIAO";
	};
});