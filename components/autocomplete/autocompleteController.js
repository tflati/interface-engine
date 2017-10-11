app.controller("autocompleteController", function($scope, $http, $q, $filter, dataService){
    
	var self = this;
	
	self.querySearch = function(query){
		
		console.log("AUTOCOMPLETE", query, $scope, $scope.field);
		
		if ($scope.field.data && $scope.field.data.url){
			var deferred = $q.defer();
			
			console.log("AUTOCOMPLETE", $scope.field);
			$http.get($scope.field.data.url + query).then(
					function(response) {
	//					console.log("AUTOCOMPLETE SUCCESS", response);
						
						deferred.resolve(response.data);
					},
					function(response) {
	//					console.log("AUTOCOMPLETE FAILURE", response);
					});
			
			return deferred.promise;
		}
		else {
			var results = [];
			
			if(!query) results = $scope.field.values;
			else if($scope.field.sending) return $scope.field.values;
			else {
				results = $scope.field.values.filter(
						function(item)
						{
							return angular.lowercase(item.label).indexOf(angular.lowercase(query)) >= 0;
						});
			}
			
			return results;
		}
		
	};
	
	self.selectedItemChange = function (item) {
		console.log("AUTOCOMPLETE SELECTED", item);
		
		if( $scope.field.data && $scope.field.data.onChange && item)
	      dataService.global[$scope.field.data.onChange.key] = item.label;
    };
});