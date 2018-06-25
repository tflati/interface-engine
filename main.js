app.controller("pageController", function($routeParams, $http, $window, $rootScope, $scope, $mdDialog, $timeout, $mdSidenav, $location, toaster, messageService, info, pageTitle, dataService, ngMeta) {

	var self = this;
	
	dataService.global["search_started"] = undefined;

	console.log("PAGE CONTROLLER", info, pageTitle, $routeParams);

	$scope.isArray = angular.isArray;
	$scope.dataService = dataService;

	if (pageTitle == undefined) pageTitle = "main";
	
	$scope.pageTitle = pageTitle;
	$scope.page = 'templates/main.html';
	$scope.info = info;
	$scope.pageInfo = undefined;
	
	if ($scope.info.pages)
		for (var i = 0; i < $scope.info.pages.length; i++)
		{
			if ($scope.info.pages[i].pageID == $scope.pageTitle)
			{
				$scope.pageInfo = $scope.info.pages[i];
			}
		}
	if ($scope.info.forms)
		for (var i = 0; i < $scope.info.forms.length; i++)
		{
			if ($scope.info.forms[i].pageID == $scope.pageTitle)
			{
				$scope.pageInfo = $scope.info.forms[i];
			}
		}
	
	$scope.header = {
		show_logos : true
	};

	$scope.sending = false;

	$scope.showing = true;
	$scope.form;

	if(!$scope.pageInfo.width)
		$scope.pageInfo.width = "90%";
	
	$scope.get_current_page_data = function() {
		return $scope.pageInfo;
	};
	
	// Set meta tags
	ngMeta.setTitle($scope.get_current_page_data().title, " | " + info.title_short);
	for(var i=0; i<info.meta.length; i++){
		var singleMeta = info.meta[i];
		ngMeta.setTag(singleMeta["key"], singleMeta["value"]);
	}

	$scope.inForm = function() {
		return $scope.pageTitle == "form";
	};

	$scope.goTo = function(item) {

		$scope.showing = true;

		url = item.url
		console.log("Want to go to " + url);
		dataService.global["search_started"] = undefined;

		// Check if the url is a form name
		var isForm = false;
		if ($scope.info.forms)
			for (var f = 0; f < $scope.info.forms.length; f++) {
				var form = $scope.info.forms[f];
				if (form.pageID == url) {
					isForm = true;
					$scope.form = form;

					console.log("FORM", $scope.form);

					break;
				}
			}

		$scope.pageTitle = url;

		$location.url(url);

		if (isForm) {
			var canSee = $scope.form.visibility == "public"
					|| !$scope.form.visibility
					|| ($scope.form.visibility == "restricted" && dataService.loggedIn)

			// Check visibility permission
			if (canSee) {
				$scope.pageTitle = "form";
				console.log("Going to render form " + url);
//				$rootScope.search_started = false;
//				dataService.global["search_started"] = false;

				$scope.page = 'templates/form.html';
				$scope.info.image.percentage_width = $scope.info.image.percentage_width_original / 2;
				$scope.header.show_logos = true;
			} else {
				$scope.page = 'templates/restricted.html';
			}
//		} // MODIFIED 29/09
		} else {
			// if(url == "home") url = "main";

			console.log("Going to render page " + url);

			// ABSOLUTE URL
			if (url.indexOf("/") == 0) {
				$window.location.href = url;
			} else {
//				$scope.page = 'templates/main.html';

				$scope.showing = true;

				if (item.action) {
					$scope.info.image.percentage_width = $scope.info.image.percentage_width_original / 2;
					$scope.header.show_logos = false;
					$scope.load_data(item.action);

					console.log("CONTROLLER", $scope.info);
				}

				if (url == "main") {
//					$scope.page = 'templates/main.html'; // window.location
															// =
															// url;
					$scope.info.image.percentage_width = $scope.info.image.percentage_width_original;
					$scope.header.show_logos = true;
				}
			}
		}
	};

	$scope.doAction = function(actionType, data) {
		console.log("[DO_ATION] ACTION=" + actionType
				+ " WITH DATA", data);
		if (actionType == "download") {

		}
	};

	$scope.show_dialog = function(ev, card) {

		console.log(ev, card);

		$mdDialog
				.show({
					multiple : true,
					locals : {
						data : card
					},
					controller : function DialogController(
							$scope, $mdDialog, data) {
						$scope.row = [ data ];
						$scope.closeDialog = function() {
							$mdDialog.hide();
						};

						$scope.show_dialog = function(ev, card) {

							console.log(ev, card);

							$mdDialog
									.show({
										multiple : true,
										locals : {
											data : card
										},
										controller : function DialogController(
												$scope,
												$mdDialog, data) {
											$scope.row = [ data ];
											$scope.closeDialog = function() {
												$mdDialog
														.hide();
											};
										},
										templateUrl : 'templates/dialog.html',
										parent : angular
												.element(document.body),
										targetEvent : ev,
										clickOutsideToClose : true
									});
						};
					},
					templateUrl : 'templates/dialog.html',
					parent : angular.element(document.body),
					targetEvent : ev,
					clickOutsideToClose : true
				});
	};
});