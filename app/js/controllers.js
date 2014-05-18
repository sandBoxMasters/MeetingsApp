'use strict';

/* Controllers */

angular.module('meetingsApp.controllers', ['firebase'])
  .controller('homeCtrl', [function($scope) {

  }])
  .controller('loginCtrl', ['$scope', '$rootScope', '$firebaseSimpleLogin', function($scope, $rootScope, $firebaseSimpleLogin) {
    var ref = new Firebase('https://scorching-fire-5198.firebaseio.com');
    $rootScope.auth = $firebaseSimpleLogin(ref);
    $scope.signIn = function () {
      $rootScope.auth.$login('password', {
        email: $scope.email,
        password: $scope.password
      }).then(function(user) {
        console.log('Logged in as: ', user.uid);
      }, function(error) {
        console.error('Login failed: ', error);
      });
    }
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

  /** ---------- calendar controler ---------- **/
    .controller('eventsCtrl', ['$scope', 'UserEvents',
  function ($scope, UserEvents) {
    $scope.user = UserEvents.query();

    $(document).ready(function() {
      
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        
        $('#calendar').fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
          },
          editable: true,
          
          
        });
        
      });

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