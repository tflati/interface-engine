app.controller("cardController", function($scope, $window, $rootScope){
	
	var self = this;
	
	$scope.sending = false;
	
	$scope.init = function(data){
		
		console.log("CARD CONTROLLER", data.title, data);
		
//		console.log("CARD SCOPE", data, $scope);
//		console.log("CARD DATA", data);
		$scope.title = data.title;
		$scope.elements = data.elements;
		$scope.subtitle = data.subtitle;
		$scope.type = data.type;
		$scope.alignment = data.alignment;
		$scope.width = data.width;
		$scope.compact = data.compact,
		$scope.footer = data.footer;
		$scope.elements = data.elements;
		$scope.layout = data.layout;
		$scope.show = true;
		if (data.show == false) $scope.show = false;
		
		if (data.show == "after_send"){
			$scope.show = $rootScope.search_started;

			$scope.$watch(function(){return $rootScope.search_started;}, function(newValue, oldValue) {
				console.log("SEARCH STARTED WATCH", $rootScope.search_started);
				$scope.show = newValue;
			}, true);
		}
		
		if (data.show == "before_send"){
			$scope.show = !$rootScope.search_started;

			$scope.$watch(function(){return $rootScope.search_started;}, function(newValue, oldValue) {
				console.log("SEARCH STARTED WATCH", $rootScope.search_started);
				$scope.show = !newValue;
			}, true);
		}
		
		console.log("CARD DATA: ", data);
	};
	
	$scope.footerFunction = function(fx){
		if(fx == 'total') return ($scope.elements ? $scope.elements[0].data.length : 0);
		else return "UNKNOWN";
	};
	
	if($window.opener && $window.opener.parentScope.inputData) $scope.init($window.opener.parentScope.inputData);
});