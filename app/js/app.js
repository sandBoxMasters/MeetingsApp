'use strict';


// Declare app level module which depends on filters, and services
var user = "UserName"
var login = true;

var app = angular.module('meetingsApp', [
  'ngRoute',
  'meetingsApp.filters',
  'meetingsApp.services',
  'meetingsApp.directives',
  'meetingsApp.controllers'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {title: 'Easy way to setup meetings! ', templateUrl: 'other/home.html', controller: 'homeCtrl'});
  $routeProvider.when('/login', {title: 'Login page', templateUrl: 'other/login.html', controller: 'loginCtrl'});
  $routeProvider.when('/register', {title: 'Register to this App!', templateUrl: 'other/register.html', controller: 'registerCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.page = {
        setTitle: function(title) {
            this.title = 'Meetings App | '+ title;
        }
    }
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        $rootScope.page.setTitle(current.$$route.title || 'Easy way to setup meetings!');
    });
}]);
