// File Table dierctive
app.directive("myTable", function() {
	return { 
		templateUrl: "components/table/myTable.html",
		restrict: "E",
		scope: {
			formData: "="
		},
		controller: function MyDataTableController($scope, $attrs, $timeout, $http) {
			
			$scope.formData.results = {};
			$scope.during_call = false;
			
			$scope.tableUrl = $scope.formData.submit.url;
			if( ! $scope.tableUrl.endsWith("/") ) $scope.tableUrl = $scope.tableUrl  + "/";
			
			$scope.filter_visibility = false;
			
			$scope.showFilter = function (){
				if($scope.filter_visibility){
					$scope.filter_visibility = false;
				}
				else{
					$scope.filter_visibility = true;
				}
			}
			
			$scope.t_property = {
				//'table-row-id-key': '',
				'column-keys': []
			};
		
			$scope.t_id = {};
			$scope.pageSize = 20;
			$scope.filter_list = [];
			
			$scope.paginatorCallback = function (page, pageSize, options){
				
				$scope.formData.results.hits = [];
				
				var args = {};
				for(var i=0; i<$scope.formData.fields.length; i++)
				{
					var field = $scope.formData.fields[i];
					console.log("FIELD", field);
					
					if (angular.isArray(field.value)) {
						subargs = []
						for (var j=0; j<field.value.length; j++){
							var value = field.value[j].id;
							if (value == undefined) value = field.value[j];
							console.log("VALUE", value);
							
							if (value == undefined || value == "undefined" || value == "") value = "ALL";
							subargs.push(value);
						}
						
						args[field.key] = subargs;
					}
					else {
						var value = "ALL";
						if (field.value && field.value.id) value = field.value.id;
						else if (field.value) value = field.value;
						
						console.log("VALUE", value);
						
						// if (value == undefined || value == "undefined" || value == "") value = "ALL";
						args[field.key] = value;
					}
				}
				
				if(!page) page = 1;
				var offset = (page-1) * pageSize;
				
				var postArguments = {
						'offset': offset,
						'limit': pageSize,
						'sort':{
							'field':'id',
							'order':'ASC'
						},
						'filter':$scope.filter_list
					};
				
				for (var key in args) { postArguments[key] = args[key]; }
				console.log("ARGS SENT VIA POST", postArguments);
				
				$scope.during_call = true;
				return $http.post($scope.tableUrl, postArguments).then(function(result){
					
					$scope.during_call = false;
					
						//set row table property
						if($scope.t_property['column-keys'].length == 0){
							
							//$scope.t_property['table-row-id-key'] = result.data.structure.primary_key;
							
							for(var i = 0; i < result.data.structure.field_list.length; i++){
								//set column array
								$scope.t_property['column-keys'].push(result.data.structure.field_list[i].label);
								
								//set filter array
								if(result.data.structure.field_list[i].filters.list.length){
									$scope.filter_list.push(
										{
											"label":result.data.structure.field_list[i].label,
											"title":result.data.structure.field_list[i].filters.title,
											"filters":result.data.structure.field_list[i].filters.list
										}
									);
								}
							}
							
							$scope.t_column = result.data.structure.field_list;
							console.log("TABLE SCOPE", $scope);
						}
						
						/*
						//update id list
						var dim_hits = result.data.hits.length;
						var dim_list_id = Object.keys($scope.t_id).length;
						
						var count = 0;
						for (var property in $scope.t_id) {
							if(count >= dim_hits){
								//$scope.t_id[property] = "";
								delete $scope.t_id[property];
							}
							else{
								$scope.t_id[property] = result.data.hits[count][result.data.structure.primary_key];
							}
							count++;	
						}
							
						if(dim_list_id < dim_hits){
							var diff = dim_hits - dim_list_id;
							var start_index = dim_hits - diff;
							for(var i = start_index; i < result.data.hits.length; i++){
								$scope.t_id[result.data.hits[i][result.data.structure.primary_key]] = result.data.hits[i][result.data.structure.primary_key];
							}
						}*/
						
						//save the result of the call
						$scope.table_data = result.data;
						$scope.formData.results = result.data;
						
						return {
							results: result.data.hits,
							totalResultCount: result.data.total
						}
					});
			};
			
			$scope.getLoadResultsCallback =  function (loadPageCallback){
				$scope.requestAjax = loadPageCallback;
			};
		
			$scope.applyFilter = function () {	
				$scope.requestAjax();
			};
			
			$scope.resetFilter = function () {
				for(var i = 0; i < $scope.filter_list.length; i++){
					for(var j = 0; j < $scope.filter_list[i].filters.length; j++){
						$scope.filter_list[i].filters[j].chosen_value = "";
					}
				}
			};
			
			$scope.formatFilterLabel = function (label){
				return label.charAt(0).toUpperCase() + label.slice(1);
			}
			
			$scope.getElementById = function (e_id) {
				
				var true_id = $scope.t_id[e_id];
				
				//find the true id in the id list
				for(var i = 0; i < $scope.table_data.hits.length; i++){
					if($scope.table_data.hits[i].id == e_id){
						return $scope.table_data.hits[i];
					}
				}
			};

			//autocomplete function
			/*
			$scope.work =  loadWork();
			
			$scope.querySearch = function  (query) {
				var results = query ? $scope.work.filter( createFilterFor(query) ) : $scope.work, deferred;
				return results;
			}
			
			function loadWork() {
				var allWork = 'student, student, teacher';
				return allWork.split(/, +/g).map( function (work) {
					return {
						value: work,
						display: work
					};
				});
			}
			
			function createFilterFor(query) {
				var lowercaseQuery = angular.lowercase(query);
				return function filterFn(work) {
					return (work.value.indexOf(lowercaseQuery) === 0);
				};
			}*/
		}
	}; 
});

