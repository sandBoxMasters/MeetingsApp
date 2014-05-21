'use strict';

/* Controllers */
var user_id;

angular.module('meetingsApp.controllers', ['firebase', 'ngRoute'])
  .controller('homeCtrl', [function($scope) {

  }])

/* -------------------------------------------------- login controler ---------------------------------------------------------------------- */  

  .controller('loginCtrl', ['$scope', '$firebaseSimpleLogin', 'UserSession', '$location', function($scope, $firebaseSimpleLogin, UserSession, $location) {
    var ref = new Firebase('https://scorching-fire-5198.firebaseio.com');
    var auth = new FirebaseSimpleLogin(ref, function(error, user)
    {
      if(error)
      {
        console.log(error);
      }
      else if(user)
      {
        user_id = user.uid;
        UserSession.login(user);
        $location.path('/events');
        console.log('Logged in as: ', user.uid);
      }
      else { console.log('user is logged out'); }
    });
  
    $scope.LoginEP = function()
    {

      auth.login('password',
        {
          email: $scope.email,
          password: $scope.password
        });
    }
  }])


/* -------------------------------------------------- end of login controler ---------------------------------------------------------------------- */

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

/* -------------------------------------------------- calendar controler ---------------------------------------------------------------------- */

  .controller('eventsCtrl', ['$scope', 'UserEvents', 'UserSession',
    function($scope, UserEvents, UserSession) {
      var testObj = new Firebase('https://scorching-fire-5198.firebaseio.com/meetingTable');
      //console.log(testObj.toSource());
      //console.log(user_id);
      var dbase = new Firebase('https://scorching-fire-5198.firebaseio.com/meetingTable/Master Meeting');
      dbase.on('value', function(meeting){
        var meetingObj = {title: meeting.val()['meetingDescription'], start: meeting.val()['dateTimeStart'], end: meeting.val()['dateTimeEnd']};
        
       
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

                    
        $('#calendar').fullCalendar({
            header: {
              left: 'prev,next today',
              center: 'title',
              right: 'month,agendaWeek,agendaDay',
            },
            editable: true,
            disableDragging: true,

            eventSources: [{
                events: [{
                  title: meetingObj.title,
                  start: meetingObj.start,
                  end: meetingObj.end
                }],

                type: 'GET',
                color: 'yellow',     // an option!
                textColor: 'black' // an option!
            }]  
        });

      });
    }
  ])

/* -------------------------------------------------- end of calendar controler ------------------------------------------------------------- */

.controller('groupsCtrl', ['$scope', 'Groups',
  function ($scope, Groups) {
    $scope.groups = Groups.query();
  }])

.controller('groupDetailCtrl', ['$scope', '$routeParams', 'Group',
  function ($scope, $routeParams, Group) {
    $scope.group = Group.get({GID: $routeParams.GID});
  }])
/*----------------------------------------------------------------------------------------------------------------------------------*/

.controller('navCtrl', function($scope, UserSession, $firebase, $location){
    $scope.$watch(UserSession.isAuthenticated, function() {
      //$scope.auth = $cookieStore.get('loggedIn');
      $scope.userL = UserSession.getUserL();
      //$scope.userB = UserSession.getUserB();
    });
  
    var dataRef = new Firebase("https://scorching-fire-5198.firebaseio.com");
    var auth = new FirebaseSimpleLogin(dataRef, function(error, user){
      if (user){
        user_id = user.uid;
        $scope.isUserLoggedIn = true;
      } else {
        $scope.isUserLoggedIn = false;
      }
    });
    $scope.logout = function(){
      auth.logout();
      UserSession.setAuthenticated(false);
      $location.path('/home');
      $scope.isUserLoggedIn = false;

    }
  })

;



/**
  TODO:
  Pametno bi blo spremenit eventsCtrl, da bo mel scope userMeetings al neki in ne user, in potem ustrezno pohendlat po viewjih!

 **/