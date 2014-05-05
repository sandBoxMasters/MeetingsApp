'use strict';

/* Controllers */

angular.module('meetingsApp.controllers', [])
  .controller('homeCtrl', [function($scope) {

  }])
  .controller('loginCtrl', [function($scope) {

  }])
  .controller('registerCtrl', [function($scope) {

  }])

  .controller('newGroupCtrl', [function($scope) {

  }])

  .controller('newgroupSuccessCtrl', [function($scope) {

  }])

  .controller('profileCtrl', ['$scope', 'User',
  function ($scope, User) {
    $scope.user = User.query();
  }])

    .controller('eventsCtrl', ['$scope', 'UserEvents',
  function ($scope, UserEvents) {
    $scope.user = UserEvents.query();
  }])

.controller('groupsCtrl', ['$scope', 'Groups',
  function ($scope, Groups) {
    $scope.groups = Groups.query();
  }])

.controller('groupDetailCtrl', ['$scope', '$routeParams', 'Group',
  function ($scope, $routeParams, Group) {
    $scope.group = Group.get({GID: $routeParams.GID});
  }])

;

/**
  TODO:
  Pametno bi blo spremenit eventsCtrl, da bo mel scope userMeetings al neki in ne user, in potem ustrezno pohendlat po viewjih!

  STARI KONTROLERJI
  .controller('groupDetailCtrl', ['$scope', '$routeParams', '$http',
  function ($scope, $routeParams, $http) {
    $http.get('data/groupDetail/'+ $routeParams.GID +'.json').success(function(data) {
      $scope.group = data;
    });
  }])

  .controller('groupsCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/usergroup.json').success(function(data) {
      $scope.groups = data;
    });
  }])

  .controller('eventsCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/usermeetings.json').success(function(data) {
      $scope.user = data;
    });
  }])

  .controller('profileCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/user.json').success(function(data) {
      $scope.user = data;
    });
  }])
**/