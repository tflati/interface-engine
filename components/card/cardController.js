app.controller("cardController", function($scope, dataService){
	
	$scope.sending = false;
	
	$scope.init = function(data){
		
		console.log("CARD DATA", data);
		$scope.title = data.title;
		$scope.subtitle = data.subtitle;
		$scope.type = data.type;
		$scope.alignment = data.alignment;
		$scope.width = data.width;
//		if($scope.width.endsWith("%")) $scope.width = $scope.width.substring(0, $scope.width.length - 1);
		$scope.compact = data.compact,
		$scope.footer = data.footer;
		$scope.elements = data.elements;		
		$scope.show = true;
		
		if (data.show == "after_send"){
			$scope.show = false;

			$scope.$watch(function(){return $scope.form_results;}, function(newValue, oldValue) {
	        	$scope.show = $scope.form_results && $scope.form_results.items && $scope.form_results.items.length > 0;
			}, true);
		}
		
		console.log("CARD DATA: ", data);
	};
	
	$scope.footerFunction = function(fx){
		if(fx == 'total') return ($scope.elements ? $scope.elements[0].data.length : 0);
		else return "UNKNOWN";
	};
});