app.controller("pageController", function($http, $window, $rootScope, $scope, $mdDialog, $timeout, $mdSidenav, $location, toaster, messageService, info, pageTitle){

	var self = this;
	
	console.log("PAGE CONTROLLER", info, pageTitle);
	
	$scope.pageTitle = pageTitle;
	$scope.page = 'templates/main.html';
	$scope.info = info;
	$scope.header = {show_logos: true};
	
	$scope.sending = false;

	$scope.showing = true;
	$scope.form;
	$scope.form_results = [];

	$scope.get_current_page_data = function(){
		if($scope.info.pages)
			for(var i=0; i<$scope.info.pages.length; i++)
				if($scope.info.pages[i].title == $scope.pageTitle)
				{
					// console.log("CURRENT PAGE:", $scope.info.pages[i]);
					return $scope.info.pages[i];
				}
		
		return undefined;
	};
	
	$scope.load_form = function(group, option){
		
		// Remove previous form inputs...
		for(var f=0; f<$scope.form.fields.length;)
		{
			//console.log("FORM FIELD: ", f, $scope.form.fields[f]);
			
			if($scope.form.fields[f].parent_group_id == group.group_id)
			{
				//console.log("Removing form field " + f, $scope.form.fields[f]);
				// toRemove.push(f);
				$scope.form.fields.splice(f, 1);
			}
			else f++;
		}
		
		// ... and add newly selected form inputs
		for(var f=0; f<option.form.fields.length; f++)
		{
			// console.log("Adding form field " + f, option.form.fields[f]);
			option.form.fields[f].parent_group_id = group.group_id;
			var newForm = option.form.fields[f];
			
			$scope.form.fields.push(newForm);
			
			/*
			if(newForm.type === "checkbox" && newForm.value === "true")
        	{
				newForm.checked = true;
        	}
        	else if(newForm.type === "select")
        	{
        		selectIndex = f;
        		
        		console.log("GETTING VALUES FOR SELECT: " + newForm.values);
        		
        		$http.get(newForm.values).then(function(response) {
        			console.log("SELECT VALUES:",response);
        			console.log("SELECT INDEX:", selectIndex);
        			
        			var selectField = option.form.fields[selectIndex];
        			selectField.values = response.data;
        			console.log("NEW VALUES A: ", selectField);
        			console.log("NEW VALUES B: ", option.form.fields[selectIndex]);
        		}, function(response){console.log("COULD NOT GET VALUES FOR SELECT FIELD", response);});
        	}
			*/
		}
	};
	
	$scope.inForm = function(){
		
//		var p = $scope.page.replace("templates/", "").replace(".html", "");
//		console.log("IN_FORM", "Asking if in form or not", $scope.page, p);
		return $scope.pageTitle == "form";
//		console.log("IN_FORM", $scope.get_current_page_data(), $scope.get_current_page_data() == 'form');
//		return $scope.get_current_page_data() == 'form';
		
//		var isForm = false;
//		if( $scope.info.forms )
//			for(var f=0; f<$scope.info.forms.length; f++)
//			{
//				var form = $scope.info.forms[f];
//				if(form.name == p)
//				{
//					return true;
//					break;
//				}
//			}
//		return false;		
	};
	
	$scope.goTo = function(item){
		
		$scope.showing = true;
		
		url = item.url
		console.log("Want to go to " + url);
		
		// Check if the url is a form name
		var isForm = false;
		if( $scope.info.forms )
			for(var f=0; f<$scope.info.forms.length; f++)
			{
				var form = $scope.info.forms[f];
				if(form.name == url)
				{
					isForm = true;
					$scope.form = form;
					
					console.log($scope.form);
					
					break;
				}
			}
		
		$scope.pageTitle = url;
		
		if(isForm) {
			$scope.pageTitle = "form";
			console.log("Going to render form");
			$scope.form_results = [];
			$rootScope.search_started = false;
			
			$scope.page = 'templates/form.html';
			$scope.info.image.percentage_width = $scope.info.image.percentage_width_original / 2;
			$scope.header.show_logos = true;
		}
		else {
			if(url == "home") url = "main";
			
			console.log("Going to render page");
			
			if(url.startsWith("http://")) {
				$window.location.href = url;
			}
			else {
//				 $scope.page = 'templates/'+url+'.html';
				$scope.page = 'templates/main.html';
				$location.url(url);
				
				$scope.showing = true;
				
				if(item.action) {
					$scope.info.image.percentage_width = $scope.info.image.percentage_width_original / 2;
					$scope.header.show_logos = false;
					$scope.load_data(item.action);
	
					console.log("CONTROLLER", $scope.info);
				}
				
				if(url == "main") {
					$scope.page = 'templates/main.html'; // window.location = url;
					$scope.info.image.percentage_width = $scope.info.image.percentage_width_original;
					$scope.header.show_logos = true;
				}
			}
		}
	};
	
	$scope.doAction = function(actionType, data){
		console.log("[DO_ATION] ACTION=" + actionType + " WITH DATA", data);
		if(actionType == "download"){
			
		}
	};
	
	$scope.show_dialog = function(ev, card){
        
        console.log(ev, card);
        
        $mdDialog.show({
        	multiple: true,        	
        	locals: {data: card},
            controller: function DialogController($scope, $mdDialog, data) {
                $scope.row = [data];
                $scope.closeDialog = function() {
                  $mdDialog.hide();
                };
                
                $scope.show_dialog = function(ev, card){
                    
                    console.log(ev, card);
                    
                    $mdDialog.show({
                    	multiple: true,
                    	locals: {data: card},
                        controller: function DialogController($scope, $mdDialog, data) {
                            $scope.row = [data];
                            $scope.closeDialog = function() {
                              $mdDialog.hide();
                            };
                          },
                        templateUrl: 'templates/dialog.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    });
                };
              },
            templateUrl: 'templates/dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
        });
    };

    /* MOVE TO FORM CONTROLLER */
    $scope.exists = function(item, field){
	    if(field.value == undefined) return false;
	    return field.value.indexOf(item) > -1;
	};
	
	/* MOVE TO FORM CONTROLLER */
	$scope.toggle = function (item, field) {
	    if(field.value == undefined) field.value = []                        
	    var idx = field.value.indexOf(item);
	    if (idx > -1) field.value.splice(idx, 1);
	    else field.value.push(item);
	};
	
	$rootScope.search_started = false;
	$scope.send_query = function(){
		
		$rootScope.search_started = true;
		console.log("Want to make a new search!");
		
//		if($scope.form.submit.type == "POST")
//		{
//			var args = {};
//			console.log($scope.form)
//			for(var i=0; i<$scope.form.fields.length; i++)
//			{
//				var field = $scope.form.fields[i];
//				console.log("FIELD", field);
//				
//				if (angular.isArray(field.value)) {
//					subargs = []
//					for (var j=0; j<field.value.length; j++){
//						var value = field.value[j].id;
//						if (value == undefined) value = field.value[j];
//						console.log("VALUE", value);
//						
//						if (value == undefined || value == "undefined" || value == "") value = "ALL";
//						subargs.push(value);
//					}
//					
//					args[field.key] = subargs;
//				}
//				else {
//					var value = "ALL";
//					if (field.value && field.value.id) value = field.value.id;
//					else if (field.value) value = field.value;
//					
//					console.log("VALUE", value);
//					
//					// if (value == undefined || value == "undefined" || value == "") value = "ALL";
//					args[field.key] = value;
//				}
//			}
//			
//			console.log("ARGS SENT VIA POST", args);
//			
//			$scope.sending = true;
//			
//			args["offset"] = 0;
//			args["limit"] = 10;
//			
//			console.log("SENDING AJAX VIA POST", args);
//			$http.post($scope.form.submit.url, args)
//			.then(function(response) {
//				$scope.sending = false;
//				console.log("QUERY POST SUCCESS", response);
//				$scope.form_results = response.data;
//				
//			}, function(response){
//				$scope.sending = false;
//				console.log("ERROR WHILE SENDING QUERY...", response);
//			});
//		}
//		else
//		{
//			var args = [];
//			console.log($scope.form)
//			for(var i=0; i<$scope.form.fields.length; i++)
//			{
//				var field = $scope.form.fields[i];
//				console.log("FIELD", field);
//				
//				if (angular.isArray(field.value)) {
//					subargs = []
//					for (var j=0; j<field.value.length; j++){
//						var value = field.value[j].id;
//						if (value == undefined) value = field.value[j];
//						console.log("VALUE", value);
//						
//						if (value == undefined || value == "undefined" || value == "") value = "ALL";
//						subargs.push(value);
//					}
//					
//					args.push(subargs.join("+"));
//				}
//				else {
//					var value = "ALL";
//					if (field.value && field.value.id) value = field.value.id;
//					else if (field.value) value = field.value;
//					
//					console.log("VALUE", value);
//					
//					// if (value == undefined || value == "undefined" || value == "") value = "ALL";
//					args.push(value);
//				}
//			}
//			
//			console.log("ARGS SENT VIA GET", args);
//			
//			$scope.sending = true;
//			
//			var url = $scope.form.submit.url + args.join("/") + "/";
//			
//			console.log("SENDING AJAX VIA GET", args, url);
//			$http.get(url)
//			.then(function(response) {
//				console.log("QUERY GET SUCCESS", response);
//				$scope.form_results = response.data;
//				
//				$scope.sending = false;
//				$scope.showing = false;
//				
//			}, function(response){
//				$scope.sending = false;
//				console.log("ERROR WHILE SENDING QUERY...", response);
//			});
//		}
	};
	
	$scope.show_form = function(){
		$rootScope.search_started = false;
	};
	
//	self.ajax2forms = [];

//	$scope.load_data = function(url){
//		
//		$scope.data = [];
//		$http.get(url).then(function(response)
//        		{
//					console.log("SUCCESS IN GETTING DATA FROM " + url);
//					console.log(response.data);
//					$scope.data = response.data.details;
//				},
//				function myError(response) {
//					console.log(response);
//                	console.log("ERROR IN GETTING DATA FROM " + url);
//				}
//		);
//	};
//	
//	$scope.load_subdata = function(url){
//		
//		$scope.subdata = [];
//		$http.get(url).then(function(response)
//        		{
//					console.log("SUCCESS IN GETTING DATA FROM " + url);
//					console.log(response.data);
//					$scope.subdata = response.data.details;
//				},
//				function myError(response) {
//					console.log(response);
//                	console.log("ERROR IN GETTING DATA FROM " + url);
//				}
//		);
//	};
	
	if(pageTitle != undefined) $scope.goTo({url: pageTitle});
}
);