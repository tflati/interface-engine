app.controller("cardController", function($scope, $window, $rootScope, dataService){
	
	var self = this;
	
	$scope.sending = false;
	
	$scope.init = function(data){
		
		console.log("CARD CONTROLLER", data.title, data);
		
//		console.log("CARD SCOPE", data, $scope);
//		console.log("CARD DATA", data);
		$scope.card = data;
		
//		$scope.title = data.title;
//		$scope.elements = data.elements;
//		$scope.subtitle = data.subtitle;
//		$scope.type = data.type;
//		$scope.alignment = data.alignment;
//		$scope.width = data.width;
//		$scope.compact = data.compact,
//		$scope.footer = data.footer;
//		$scope.elements = data.elements;
//		$scope.layout = data.layout;
		
		if(!$scope.card.show_conditions) {
            $scope.card.show_conditions = []
            $scope.card.show = true;
		}
		
		$scope.card.showVector = {}
		
//		$scope.show = true;
//		if (data.show == false) $scope.show = false;
		
//		if (data.show == "after_send"){
//			$scope.card.show = $rootScope.search_started;
//
//			$scope.$watch(function(){return $rootScope.search_started;}, function(newValue, oldValue) {
//				console.log("SEARCH STARTED WATCH", $rootScope.search_started);
//				$scope.card.show = newValue;
//			}, true);
//		}
//		
//		if (data.show == "before_send"){
//			$scope.card.show = !$rootScope.search_started;
//
//			$scope.$watch(function(){return $rootScope.search_started;}, function(newValue, oldValue) {
//				console.log("SEARCH STARTED WATCH", $rootScope.search_started);
//				$scope.card.show = !newValue;
//			}, true);
//		}
		
//		for(var i=0; i < $scope.card.show_conditions.length; i++)
//		{
//			var condition = $scope.card.show_conditions[i];
//			var arg1 = condition.arg1;
//			if(arg1.key){
//				console.log("CARD SHOW ADDING WATCH TO ", arg1);
//				$scope.$watch(function(){return dataService.global[arg1.key];}, function(newValue, oldValue) {
//					console.log("WATCH CARD SHOW ARG1", oldValue, newValue);
//					condition.arg1.value = newValue;
////					if(newValue != oldValue)
//						$scope.updateShow(condition);
//				});
//			}
//			
//			var op = condition.op;
//			var arg2 = condition.arg2;
//			if(arg2.key){
//				console.log("CARD SHOW ADDING WATCH TO ", arg2);
//				$scope.$watch(function(){return dataService.global[arg2.key];}, function(newValue, oldValue) {
//					console.log("WATCH CARD SHOW ARG2", oldValue, newValue);
//					condition.arg2.value = newValue;
////					if(newValue != oldValue)
//						$scope.updateShow(condition);
//				});
//			}
//			
//			$scope.updateShow(condition);
//		}
		
		if($scope.card.show_conditions){

			for(var i=0; i < $scope.card.show_conditions.length; i++)
			{
				var condition = $scope.card.show_conditions[i];
//				console.log("SHOW CONDITION", $scope.card.title, condition.arg1.value, condition.arg2, typeof(condition.arg1.value), typeof(condition.arg2));
				$scope.card.showVector[i] = $scope.updateShow(condition);
			}
			
			var show = true;
			for(var key in $scope.card.showVector)
				if(!$scope.card.showVector[key]) {show = false; break;}
			$scope.card.show = show;
			
			var watchGroup = [];
			for(var i=0; i < $scope.card.show_conditions.length; i++)
			{
				var condition = $scope.card.show_conditions[i];
//				console.log("WATCH GROUP CONDITION", $scope.card.title, condition);
				watchGroup[2*i] = "dataService.global['"+condition.arg1.key+"']";
				watchGroup[2*i+1] = "dataService.global['"+condition.arg2.key+"']";
			}
			
//			console.log("WATCH GROUP VECTOR", $scope.card.title, watchGroup);
			
			$scope.$watchGroup(watchGroup, function(newValues, oldValues){
				
				// console.log("WATCH GROUP", $scope.card.title, newValues, oldValues);
				
				for(var i=0; i<newValues.length; i+=2)
				{
					// Retrieve the condition associated
					var condition = $scope.card.show_conditions[i/2];
					
					if(newValues[i] != oldValues[i])
					{
//						console.log("WATCH GROUP CHANGED ARG1", i, $scope.card.title, oldValues[i], newValues[i], typeof(newValues[i]));
						condition.arg1.value = newValues[i];
					}
					
					if(newValues[i+1] != oldValues[i+1]){
//						console.log("WATCH GROUP CHANGED ARG2", i, $scope.card.title, oldValues[i+1], newValues[i+1]);
						condition.arg2.value = newValues[i+1];
					}
					
//					console.log("SHOW VECTOR UPDATE CONDITION", $scope.card.title, i, i/2, condition.arg1.value, condition.op, condition.arg2, typeof(condition.arg1.value), typeof(condition.arg2), $scope.updateShow(condition));
					
					$scope.card.showVector[i/2] = $scope.updateShow(condition);
				}
				
				var show = true;
				for(var key in $scope.card.showVector){
//					console.log("SHOW VECTOR", $scope.card.title, key, $scope.card.showVector[key]);
					if(!$scope.card.showVector[key]) {show = false; break;}
				}
				$scope.card.show = show;
			});
			
//			for(var i=0; i < $scope.card.show_conditions.length; i++)
//			{
//				var condition = $scope.card.show_conditions[i];
//				console.log("CARD SHOW CONDITION", condition, $scope.card.title, $scope.card);
//				
//				var arg1 = condition.arg1;
//				if(arg1.key){
//					console.log("CARD SHOW ADDING WATCH TO ", this, $scope.card.title, $scope.card, arg1);
//					$scope.$watch(function(){return dataService.global[arg1.key];}, function(newValue, oldValue) {
//						console.log("WATCH CARD SHOW ARG1", $scope.card.title, $scope.card, oldValue, newValue);
//						condition.arg1.value = newValue;
//						$scope.card.show = $scope.updateShow(condition);
//						
////						$scope.card.showVector[$scope.card.show_conditions.indexOf(condition)] = $scope.updateShow(condition);
////						var show = true;
////						for(var key in $scope.card.showVector)
////							if(!$scope.card.showVector[key]) {show = false; break;}
////						$scope.card.show = show;
//					});
//				}
//				
//				var op = condition.op;
//				var arg2 = condition.arg2;
//				if(arg2.key){
//					console.log("CARD SHOW ADDING WATCH TO ", $scope.card.title, $scope.card, arg2);
//					$scope.$watch(function(){return dataService.global[arg2.key];}, function(newValue, oldValue) {
//						console.log("WATCH CARD SHOW ARG2", $scope.card.title, $scope.card, oldValue, newValue);
//						condition.arg2.value = newValue;
//						$scope.card.show = $scope.updateShow(condition);
//					});
//				}
//				
//				var b = $scope.updateShow(condition);
//				if (!b) console.log("ASSIGNING FALSE 2", $scope.card.title, $scope.card, b);
//				else console.log("ASSIGNING TRUE 2", $scope.card.title, $scope.card, b);
//				$scope.card.showVector[i] = b;
//			}
		}
		
		console.log("CARD DATA: ", data);
	};
	
	$scope.updateShow = function(condition){
		
		var arg1 = condition.arg1;
		if(arg1 == "undefined") arg1 = undefined;
		if(condition.arg1.fx == "value") arg1 = arg1.value;
		else if(condition.arg1.fx == "length") arg1 = length(arg1.value);
		
		var arg2 = condition.arg2;
		if(arg2 == "undefined") arg2 = undefined;
		if(condition.arg2.fx == "value") arg2 = arg2.value;
		else if(condition.arg2.fx == "length") arg2 = length(arg2.value);
		
		var show = false;
		if(condition.op == ">=") show = arg1 >= arg2;
		else if(condition.op == ">") show = arg1 > arg2;
		else if(condition.op == "<") show = arg1 < arg2;
		else if(condition.op == "<=") show = arg1 <= arg2;
		else if(condition.op == "==") show = arg1 == arg2;
		else if(condition.op == "!=") show = arg1 != arg2;
		
		console.log("WATCH CARD SHOW UPDATE", $scope.card, show, condition, arg1, arg2, typeof(arg1), typeof(arg2), arg1 == arg2);
		
		return show;
	};
	
	$scope.footerFunction = function(fx){
		if(fx == 'total') return ($scope.elements ? $scope.elements[0].data.length : 0);
		else return "UNKNOWN";
	};
	
	if($window.opener && $window.opener.parentScope && $window.opener.parentScope.inputData)
		$scope.init($window.opener.parentScope.inputData);
});