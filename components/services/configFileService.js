app.service("configFileService", function($http, $q, messageService, dataService){
	
	var self = this;
	
	self.info = undefined;
	self.ajax2forms = {};
	
	self.get_config_file = function(){
		
		if(self.info == undefined) {
			console.log("self.info is undefined. Loading...");
			return self.load_config_file();
		}
		
		console.log("The config file has already been downloaded.");
		
		var deferred = $q.defer();
		deferred.resolve(self.info);		
		return deferred.promise;
	};
	
	self.load_config_file = function(){
		
		console.log("MAKING AJAX FOR CONFIG FILE");
		
		return $http.get('config.json').then(function(response) {
			
			messageService.showMessage('File di configurazione caricato correttamente.');
			console.log("FILE CONFIG OK");
			
	        self.info = response.data;
	        self.info.image.percentage_width_original = self.info.image.percentage_width;
	        console.log(self.info);
	        
	//                         self.load_data(self.info.links.statistics_all);
	//                         self.clicked_chromosome = "1"
	//                         self.load_subdata(self.info.links.statistics_single_chromosome + self.clicked_chromosome + "/");
	        
	//                         $http.get(self.info.links.statistics_by_chromosome).then(function(response)
	//                         		{
	// 									console.log("SUCCESS IN GETTING STATISTICS BY CHROMOSOME");
	// 									console.log(response.data);
	// 									$scope.pielabels = response.data.details.header; 
	// 									$scope.piedata = response.data.details.items;
	// 									$scope.pieheader = response.data.details.labels;
	// 								},
	// 								function myError(response) {
	// 									console.log(response);
	// 				                	console.log("ERROR IN GETTING STATISTICS CHROMOSOME");
	// 								}
	// 						);
	        
	        if(self.info.forms)
		        for(var f=0; f<self.info.forms.length; f++)
		        {
		        	var form = self.info.forms[f];
		        	dataService.global[form.name] = form;
		        	
		            for(var i=0; i<form.fields.length; i++)
		            {
		            	var field = form.fields[i];
		            	
		            	// Assign the chosen default value
		            	if(field.default) field.value = field.default;
		            	
		            	// Check types
		            	if(field.type == "number") field.value = parseInt(field.value);
		            	
		            	if(field.type === "checkbox" && field.value === "true")
		            	{
		            		field.checked = true;
		            	}
		            	else if(field.type === "select" || field.type === "autocomplete" || (field.type === "checkbox" && field.values != undefined && field.values.startsWith("http")))
		            	{
		            		var ajaxForms = self.ajax2forms[field.values];
		            		if( !ajaxForms ) {ajaxForms = []; self.ajax2forms[field.values] = ajaxForms;}
		            		ajaxForms.push(field);
		            	}
		            	
		            	// Subform handling 
		            	if(field.form) {
		            		// console.log("Handling subforms");
		            		for(var j=0; j < field.form.length; j++)
		            		{	
		            			var subform = field.form[j];
		// 	                        			console.log("SUBFORM: ", subform);
		            			
		            			for(var s=0; s<subform.fields.length; s++)
		            			{
		            				var subfield = subform.fields[s];
		// 	                        				console.log("\tSUBFORM FIELD", subfield);
		            				if(subfield.type == "select") {
		            					console.log("FOUND SUBSELECT", subfield);
		                    			var ajaxForms = self.ajax2forms[subfield.values];
		                        		if( !ajaxForms ) {ajaxForms = []; self.ajax2forms[subfield.values] = ajaxForms;}
		                        		ajaxForms.push(subfield);
		                			}
		            			}
		            			
		            			// console.log("Handling subform = ", subform);
		            			
		                		if(!subform.value && !subform.index) continue;
		                		
		                		// console.log("\tsubform= ", subform.value, subform.index, field.values);
		                		
		            			for(var c=0; c < field.values.length; c++)
								{
									var value = field.values[c];
									// console.log("\t\tvalue=", value);
									
									if(subform.value && value.label == subform.value)
									{
										// console.log("\tsubform's name="+subform.value+" equals name of option="+value);
										value.url = subform.name;
										value.form = subform;
									}
									else if(subform.index && c == subform.index)
									{
										value.url = subform.name;
										value.form = subform;
									}
								}
		            		}
		            	}
		            }
		        }
	        
	        console.log("ajax2forms", self.ajax2forms);
	        
	        // Make all the ajax calls here
	        for(var key in self.ajax2forms)
	        {
	        	var affectedForms = self.ajax2forms[key]
	        	for(var formId in affectedForms)
	        		affectedForms[formId].sending = true;
	        	
	        	console.log("GETTING VALUES FOR SELECT: " + key);	                        		
	    		$http.get(key).then(
	    				function(response) {
	            			console.log("RESPONSE", response);
	            			console.log("FORMS AFFECTED", self.ajax2forms[response.config.url]);
	//    	                        			console.log("ajax2forms", self.ajax2forms);
	//    	                        			console.log("self", self);
	//    	                        			console.log("url", response.config.url);
	//    	                        			console.log("form chosen", self.ajax2forms[response.config.url]);
	
							var affectedForms = self.ajax2forms[response.config.url]
							for(var formId in affectedForms)
							{
								affectedForms[formId].values = response.data;
								affectedForms[formId].sending = false;
							}
	//    	                        			console.log("form chosen after", self.ajax2forms[response.config.url]);
	            			
	            			// var selectField = self.form.fields[self.formIndex];	                        			
	            			// selectField.values = response.data;
	            			// console.log("NEW VALUES A: ", selectField);
	            			// console.log("NEW VALUES B: ", self.info.forms.fields[selectIndex]);
	            		},
	            		function(response){
	            			console.log("COULD NOT GET VALUES FOR SELECT FIELD", response);
	            			var affectedForms = self.ajax2forms[response.config.url]
							for(var formId in affectedForms)
	            			{
								affectedForms[formId].values = ["NOT AVAILABLE"];
								affectedForms[formId].sending = false;
	            			}
	            		}
	            );
	        }
	        
	        // self.show_circos(self.info.links.circos_url + self.circos.value + "/");
	        
	        return self.info;
	        
		}, function(response){
			console.log(response);
			messageService.showMessage('Impossibile trovare il file di configurazione. (message: "' + response.statusText + '", code: '+response.status+')', "error", "Error");
			
			return undefined;
		});
	};
});