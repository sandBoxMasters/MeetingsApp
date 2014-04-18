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

  .controller('profileCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/user.json').success(function(data) {
      $scope.user = data;
    });
  }])

    .controller('eventsCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/usermeetings.json').success(function(data) {
      $scope.user = data;
    });
  }])

.controller('groupsCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $http.get('data/usergroup.json').success(function(data) {
      $scope.groups = data;
    });
  }])

.controller('groupDetailCtrl', ['$scope', '$routeParms', '$http',
  function ($scope, $routeParms, $http) {
    $http.get('data/'+$routeParms.GID+'.json').success(function(data) {
      $scope.groupDetail = data;
    });
  }])



;
