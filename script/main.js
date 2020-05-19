/*------CONFIG DATA------------------------------------------------------------------------------*/
var siteApplicationName = "sitename_mainApp";
var ng = ["ngRoute", "ngAnimate"];
var siteMainDataFilePath = "/content/page/main_data.json";
/*------END CONFIG DATA--------------------------------------------------------------------------*/

var __mainPagesAbsolutePath;
var mainPages;
var navigationPath;

/*------Load site data---------------------------------------------------------------------------*/
var jsonhttp = new XMLHttpRequest();
var jsonurl = siteMainDataFilePath;

jsonhttp.onload = function (e) {
	if (jsonhttp.readyState == 4 && jsonhttp.status == 200){
		var siteMainDataJSON = JSON.parse(jsonhttp.responseText);
		if (siteMainDataJSON != null || siteMainDataJSON != 'undefined'){
			__mainPagesAbsolutePath = siteMainDataJSON.__pagesAbsolutePath;
			mainPages = siteMainDataJSON.mainPages;
			navigationPath = [siteMainDataJSON.mainPages[0]];
			preloadImages(siteMainDataJSON.preloadImages, true);
		} else {
			console.log("error : Site data not loaded!");
		}

	}
}
jsonhttp.open("GET", jsonurl, false);
jsonhttp.send();

/*------End load site data-----------------------------------------------------------------------*/

/*--------------Setup site application-----------------------------------------------------------*/                
var app = angular.module(siteApplicationName, ng);

try{
	if (app == null || app == 'undefined')
		throw new AngularMuduleError("\n\tUnable load data!");
}	catch(err)	{
	LogError(err);
}

app.config(function($routeProvider, $compileProvider){
	mainPages.forEach(function(page){
		$routeProvider.when(page.Path, {
			templateUrl : __mainPagesAbsolutePath + page.RelativeUrl,
			controller : page.Controller
		});
	});
	$routeProvider.otherwise({redirectTo: mainPages[0].Path});
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|skype|tel|ftp|mailto|chrome-extension):/);
});

/*Controllers--------------------------------------------------------------------------------*/
app.controller('navigationCtrl', function($scope) {
	
	$scope.mainPages = mainPages;
	$scope.navigationPath = navigationPath;
	$scope.trackbase = { imgUrl:"/content/image/icon/icon_row/", imgTitle:"Play" };
});

app.controller("aboutCtrl", function ($scope, $http) {
	ConstructPath("aboutCtrl");
	
	var jsonContentRelativePath = "/about/about.json";
	var jsonContentAbsolutePath = __mainPagesAbsolutePath + jsonContentRelativePath;
	
	function  onSuccess(response){
		var data = response.data;
		var imagesFolderAbsolutePath = "/content/image/technologies/";
		data.Technologies.forEach(function(element) {
			element.ImageRelativePath = imagesFolderAbsolutePath + element.ImageRelativePath;
		});
		$scope.images = data.Technologies;
		$scope.textContent =  data.TextContent;
		$scope.annotations =  data.Annotations;
	}
	
	function onError(response) {
		console.log(response);
	}
	
	$http.get(jsonContentAbsolutePath)
		.then(onSuccess)
		.catch(onError);
});

app.controller("homeCtrl", function ($scope, $http) {
	ConstructPath("homeCtrl");
	
	var jsonContentRelativePath = "/home/home.json";
	var jsonContentAbsolutePath = __mainPagesAbsolutePath + jsonContentRelativePath;
	
	function  onSuccess(response){
		var data = response.data;
		$scope.textContent =  data.TextContent;
		$scope.annotations =  data.Annotations;
	}
	
	function onError(response) {
		console.log(response);
	}
	
	$http.get(jsonContentAbsolutePath)
		.then(onSuccess)
		.catch(onError);
});

app.controller("servicesCtrl", function ($scope, $http) {
	ConstructPath("servicesCtrl")
	
	$http.get(__mainPagesAbsolutePath+"/services/services.json").then(
		function onSuccess(response){
			var data = response.data;
			$scope.services = data.Services;
			$scope.annotations =  data.Annotations;
		}
	).catch(function onError(response) {
		console.log(response);
	});
	
});

app.controller("contactCtrl", function ($scope, $http) {
	ConstructPath("contactCtrl");
	$http.get(__mainPagesAbsolutePath+"/contact/contact.json").then(
		function onSuccess(response){
			var data = response.data;
			$scope.contacts = data.Contacts;
			$scope.annotations =  data.Annotations;
		}
	).catch(function onError(response) {
		console.log(response);
	});
});
/*End Controllers----------------------------------------------------------------------------*/
/*Componets----------------------------------------------------------------------------------*/
app.component('annotation', {
	templateUrl: __mainPagesAbsolutePath + '/annotation/annotation.html',
	/*controller: AnnotationController,*/
	bindings: {
		source: '='
	}
});

app.component('player', {
	templateUrl: __mainPagesAbsolutePath + '/player/player.html',
	/*controller: AnnotationController,*/
	bindings: {
		source: '='
	}
});
/*End Componets------------------------------------------------------------------------------*/
/*--------------End Setup site application-------------------------------------------------------*/
function ConstructPath(controlerName){
	if(controlerName == 'homeCtrl'){
		navigationPath.splice(1, navigationPath.length - 1);
		return;
	}
	
	var page = (mainPages.filter(function(p){return p.Controller == controlerName;}))[0];
	if(navigationPath.indexOf(page) >= 0){
		var indexOfPage = navigationPath.indexOf(page);
		navigationPath.splice(indexOfPage + 1, navigationPath.length - indexOfPage - 1);
	}	else	{
		navigationPath.splice(1, navigationPath.length - 1);
		navigationPath.push(page);
	}
}





/*Application------------------------------------------------------------------------------------*/
	

	/*
	function AnnotationController($scope, $element, $attrs) {
	var ctrl = this;

	// This would be loaded by $http etc.
	ctrl.list = $scope.annotations;

	}*/

	/*EndComponents-----------------------------------------------------------------------------*/




	
