
//var myApp = {};
//var mainView = {};
var $$ = Dom7;

var app = angular.module('MobileAngular1', [
    'ngRoute',
    'LocalStorageModule',
    //'mobile-angular-ui',
    'MobileAngular1.controllers.Main',
    'MobileAngular1.controllers.Player',
    'MobileAngular1.controllers.Game',
    'MobileAngular1.controllers.Mode'
])

.factory('UserService', function() {
    return {
        'config': {
            appName: 'Mobile Angular 1',
            appVersion: 1.0,
            debug: true
        }
    };
})

.constant("debug", true)

.config(function(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('MobileAngular1');
    localStorageServiceProvider.setStorageType('localStorage'); //localStorage, sessionStorage
    localStorageServiceProvider.setDefaultToCookie(true);
    localStorageServiceProvider.setNotify(true, true);
})

/*
.config(function($routeProvider) {
    $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
    $routeProvider.when('/page2', {templateUrl:'page2.html',  reloadOnSearch: false});
    $routeProvider.when('/page3', {templateUrl:'page3.html',  reloadOnSearch: false});
    $routeProvider.when('/sidebar', {templateUrl:'sidebar.html',  reloadOnSearch: false});
    $routeProvider.when('/framework7', {templateUrl:'framework7.html',  reloadOnSearch: false});
    $routeProvider.when('/about', {templateUrl:'about.html',  reloadOnSearch: false});
})
*/

.filter('ucfirst', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

.filter('html', function($sce){
    return function(input){
        return $sce.trustAsHtml(input);
    }
})

.run(function() {
    myApp = new Framework7({
        modalTitle: 'Framework7',
        domCache: true,
        material: true,
        pushState: true, //set it true. It will enable the hash based navigation
        angular: true //set it to true to enable angular binding in Framework pages
    });
    mainView = myApp.addView('.view-main', {});
    // Load about page:
    mainView.router.load({pageName: '/#!/start1.html'});
});
