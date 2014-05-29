'use strict';


// Declare app level module which depends on filters, and services
//var user = "UserName"
//var login = true;

var app = angular.module('meetingsApp', [
  'ngRoute',
  'firebase',
  'meetingsApp.animation',
  'meetingsApp.filters',
  'meetingsApp.services',
  'meetingsApp.directives',
  'meetingsApp.controllers',
  'ngCookies',
  'ui.select2'
]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {title: 'Easy way to setup meetings! ', templateUrl: 'other/home.html', controller: 'homeCtrl'});
  $routeProvider.when('/login', {title: 'Login page', templateUrl: 'other/login.html', controller: 'loginCtrl'});
  $routeProvider.when('/register', {title: 'Register to this App!', templateUrl: 'other/register.html', controller: 'registerCtrl'});
  $routeProvider.when('/profile', {title: 'Profile', templateUrl: 'usr/profile.html', controller: 'profileCtrl'});
  $routeProvider.when('/events', {title: 'My Events', templateUrl: 'usr/events.html', controller: 'eventsCtrl'});
  $routeProvider.when('/createEvent', {title: 'Create new event', templateUrl: 'usr/createEvent.html', controller: 'createEventCtrl'});
  //$routeProvider.when('/groups', {title: 'My Groups', templateUrl: 'usr/groups.html', controller: 'groupsCtrl'});
  //$routeProvider.when('/data/:GID', {title: 'Group Detail', templateUrl: 'usr/groupDetails.html', controller: 'groupDetailCtrl'});
  //$routeProvider.when('/newGroup', {title: 'Create a new group!', templateUrl: 'other/newGroup.html', controller: 'newGroupCtrl'});
  //$routeProvider.when('/newGroupSuccess', {title: 'HOORAY!', templateUrl: 'other/newGroupSuccess.html', controller: 'newGroupSuccessCtrl'});
  $routeProvider.otherwise({redirectTo: '/home'});
}]);

app.run(['$rootScope', function($rootScope) {
    $rootScope.page = {
        setTitle: function(title) {
            this.title = 'Meetings App | '+ title;
        }
    }
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
        //$rootScope.page.setTitle(current.$$route.title || 'Easy way to setup meetings!');
    });
}]);