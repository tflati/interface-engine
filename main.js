app.controller("pageController", function($http, $window, $scope, $mdDialog, $timeout, $mdSidenav, $location, toaster, messageService, info, page){

	var self = this;
	
	console.log("PAGE CONTROLLER", info, page);
	
	$scope.page = 'templates/main.html';
	$scope.info = info;
	$scope.header = {show_logos: true};
	
	$scope.sending = false;
	
	$scope.form;
	$scope.form_results = [];

	$scope.get_current_page_data = function(){
		if($scope.info.pages)
			for(var i=0; i<$scope.info.pages.length; i++)
				if($scope.info.pages[i].title == $scope.page.replace(".html", "").replace("templates/", ""))
					return $scope.info.pages[i];
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
	
	$scope.goTo = function(item){
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
		
		if(isForm) {
			console.log("Going to render form");
			$scope.form_results = [];
			$scope.page = 'templates/form.html';
			$scope.info.image.percentage_width = $scope.info.image.percentage_width_original / 2;
			$scope.header.show_logos = false;
		}
		else {
			if(url == "home") url = "main";
			
			console.log("Going to render page");
			
			if(url.startsWith("http://")) {
				$window.location.href = url;
			}
			else {
				$scope.page = 'templates/'+url+'.html';
				$location.url(url);
				
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
	
	$scope.show_dialog = function(ev, card){
        
        console.log(ev, card);
    
        $mdDialog.show({
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

	self.exists = function(item, field){
	    if(field.value == undefined) return false;
	    return field.value.indexOf(item) > -1;
	};
	
	self.toggle = function (item, field) {
	    if(field.value == undefined) field.value = []                        
	    var idx = field.value.indexOf(item);
	    if (idx > -1) field.value.splice(idx, 1);
	    else field.value.push(item);
	};
	
	$scope.send_query = function(){
		var args = [];
		console.log($scope.form)
		for(var i=0; i<$scope.form.fields.length; i++)
		{
			var field = $scope.form.fields[i];
			var value = field.value;
			console.log("VALUE", value)
//			if (value == undefined || value == "") continue;
//			else args.push(value);
			
			if (value == undefined || value == "undefined" || value == "") value = "ALL";
			args.push(value);
		}
		
		console.log("ARGS", args);
		
		if( ! $scope.form.submit.url.endsWith("/") ) $scope.form.submit.url = $scope.form.submit.url  + "/";
		
		if($scope.form.submit.type == "POST")
		{
			$scope.sending = true;
			
			console.log("SENDING AJAX VIA POST", args);
			$http.post($scope.form.submit.url, args)
			.then(function(response) {
				$scope.sending = false;
				console.log("QUERY POST SUCCESS", response);
				$scope.form_results = response.data;
				
			}, function(response){
				$scope.sending = false;
				console.log("ERROR WHILE SENDING QUERY...", response);
			});
		}
		else
		{
			$scope.sending = true;
			
			$http.get($scope.form.submit.url + args.join("/") + "/")
			.then(function(response) {
				console.log("QUERY GET SUCCESS", response);
				$scope.form_results = response.data;
				
				$scope.sending = false;
				
			}, function(response){
				$scope.sending = false;
				console.log("ERROR WHILE SENDING QUERY...", response);
			});
		}
	};
	
//	self.ajax2forms = [];

	$scope.load_data = function(url){
		
		$scope.data = [];
		$http.get(url).then(function(response)
        		{
					console.log("SUCCESS IN GETTING DATA FROM " + url);
					console.log(response.data);
					$scope.data = response.data.details;
				},
				function myError(response) {
					console.log(response);
                	console.log("ERROR IN GETTING DATA FROM " + url);
				}
		);
	};
	
	$scope.load_subdata = function(url){
		
		$scope.subdata = [];
		$http.get(url).then(function(response)
        		{
					console.log("SUCCESS IN GETTING DATA FROM " + url);
					console.log(response.data);
					$scope.subdata = response.data.details;
				},
				function myError(response) {
					console.log(response);
                	console.log("ERROR IN GETTING DATA FROM " + url);
				}
		);
	};
	
	if(page != undefined) $scope.goTo({url: page});
	
//	$http.get('config.json').then(function(response) {
//		
//		messageService.showMessage('File di configurazione caricato correttamente.');
//		console.log("FILE CONFIG OK");
//		
//		$scope.sending = false;
//		
//        self.info = response.data;
//        self.info.image.percentage_width_original = self.info.image.percentage_width;
//        console.log(self.info);
//        
////                         self.load_data(self.info.links.statistics_all);
////                         self.clicked_chromosome = "1"
////                         self.load_subdata(self.info.links.statistics_single_chromosome + self.clicked_chromosome + "/");
//        
////                         $http.get(self.info.links.statistics_by_chromosome).then(function(response)
////                         		{
//// 									console.log("SUCCESS IN GETTING STATISTICS BY CHROMOSOME");
//// 									console.log(response.data);
//// 									$scope.pielabels = response.data.details.header; 
//// 									$scope.piedata = response.data.details.items;
//// 									$scope.pieheader = response.data.details.labels;
//// 								},
//// 								function myError(response) {
//// 									console.log(response);
//// 				                	console.log("ERROR IN GETTING STATISTICS CHROMOSOME");
//// 								}
//// 						);
//        
//        if(self.info.forms)
//	        for(var f=0; f<self.info.forms.length; f++)
//	        {
//	        	var form = self.info.forms[f];
//	        	
//	            for(var i=0; i<form.fields.length; i++)
//	            {
//	            	var field = form.fields[i];
//	            	
//	            	// Assign the chosen default value
//	            	if(field.default) field.value = field.default;
//	            	
//	            	// Check types
//	            	if(field.type == "number") field.value = parseInt(field.value);
//	            	
//	            	if(field.type === "checkbox" && field.value === "true")
//	            	{
//	            		field.checked = true;
//	            	}
//	            	else if(field.type === "select" || field.type === "autocomplete" || (field.type === "checkbox" && field.values != undefined && field.values.startsWith("http")))
//	            	{
//	            		var ajaxForms = self.ajax2forms[field.values];
//	            		if( !ajaxForms ) {ajaxForms = []; self.ajax2forms[field.values] = ajaxForms;}
//	            		ajaxForms.push(field);
//	            	}
//	            	
//	            	// Subform handling 
//	            	if(field.form) {
//	            		// console.log("Handling subforms");
//	            		for(var j=0; j < field.form.length; j++)
//	            		{	
//	            			var subform = field.form[j];
//	// 	                        			console.log("SUBFORM: ", subform);
//	            			
//	            			for(var s=0; s<subform.fields.length; s++)
//	            			{
//	            				var subfield = subform.fields[s];
//	// 	                        				console.log("\tSUBFORM FIELD", subfield);
//	            				if(subfield.type == "select") {
//	            					console.log("FOUND SUBSELECT", subfield);
//	                    			var ajaxForms = self.ajax2forms[subfield.values];
//	                        		if( !ajaxForms ) {ajaxForms = []; self.ajax2forms[subfield.values] = ajaxForms;}
//	                        		ajaxForms.push(subfield);
//	                			}
//	            			}
//	            			
//	            			// console.log("Handling subform = ", subform);
//	            			
//	                		if(!subform.value && !subform.index) continue;
//	                		
//	                		// console.log("\tsubform= ", subform.value, subform.index, field.values);
//	                		
//	            			for(var c=0; c < field.values.length; c++)
//							{
//								var value = field.values[c];
//								// console.log("\t\tvalue=", value);
//								
//								if(subform.value && value.label == subform.value)
//								{
//									// console.log("\tsubform's name="+subform.value+" equals name of option="+value);
//									value.url = subform.name;
//									value.form = subform;
//								}
//								else if(subform.index && c == subform.index)
//								{
//									value.url = subform.name;
//									value.form = subform;
//								}
//							}
//	            		}
//	            	}
//	            }
//	        }
//        
//        console.log("ajax2forms", self.ajax2forms);
//        
//        // Make all the ajax calls here
//        for(var key in self.ajax2forms)
//        {
//        	console.log("GETTING VALUES FOR SELECT: " + key);	                        		
//    		$http.get(key).then(
//    				function(response) {
//            			console.log("RESPONSE", response);
//            			console.log("FORMS AFFECTED", self.ajax2forms[response.config.url]);
////    	                        			console.log("ajax2forms", self.ajax2forms);
////    	                        			console.log("self", self);
////    	                        			console.log("url", response.config.url);
////    	                        			console.log("form chosen", self.ajax2forms[response.config.url]);
//
//						var affectedForms = self.ajax2forms[response.config.url]
//						for(var formId in affectedForms)
//							affectedForms[formId].values = response.data;
////    	                        			console.log("form chosen after", self.ajax2forms[response.config.url]);
//            			
//            			// var selectField = $scope.form.fields[$scope.formIndex];	                        			
//            			// selectField.values = response.data;
//            			// console.log("NEW VALUES A: ", selectField);
//            			// console.log("NEW VALUES B: ", self.info.forms.fields[selectIndex]);
//            		},
//            		function(response){
//            			console.log("COULD NOT GET VALUES FOR SELECT FIELD", response);
//            			var affectedForms = self.ajax2forms[response.config.url]
//						for(var formId in affectedForms)
//							affectedForms[formId].values = ["NOT AVAILABLE"];
//            		}
//            );
//        }
//        
//        // self.show_circos(self.info.links.circos_url + self.circos.value + "/");
//        
//	}, function(response){
//		console.log(response);
//		messageService.showMessage('Impossibile trovare il file di configurazione. (message: "' + response.statusText + '", code: '+response.status+')', "error", "Error");
//	});
}// End of controller
);