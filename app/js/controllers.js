'use strict';

/* Controllers */
var user_id;

angular.module('meetingsApp.controllers', ['firebase', 'ngRoute'])
  .controller('homeCtrl', ['$scope', 'UserSession', '$location', 
	function($scope, UserSession, $location) 
	{
		$scope.auth = UserSession.isAuthenticated();
		$scope.userL = UserSession.getUserL();
		
		var ref = new Firebase('https://scorching-fire-5198.firebaseio.com');
		var auth = new FirebaseSimpleLogin(ref, function(error, user)
			{
				if (user)
				{
					console.log('in home!');
					// redirect..
					$location.path('/events');
					console.log('in home?');
				}
				else
				{
					console.log('what?');
				}
			}
		);
	}
  ])

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
        console.log('User: ' + user.uid + ', Provider: ' + user.provider);
		
			if (user.provider === "facebook")
			{
				if (typeof $scope.users[user.uid] === "undefined" )
				{
					$scope.users[user.uid] = user;
					$scope.users.$save(user.uid);
				}else
				{
					$scope.users.$save(user.uid);
				}
			}
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
	
	$scope.LoginFB = function() {
		auth.login('facebook', {
			scope: 'email,user_likes'
		});
	}
  }])


/* -------------------------------------------------- end of login controler ---------------------------------------------------------------------- */

  .controller('registerCtrl', ['$scope', 'UserSession', '$firebase', '$location', 
	function($scope, UserSession, $firebase, $location)
	{
		var ref = new Firebase("https://scorching-fire-5198.firebaseio.com");
		var auth = new FirebaseSimpleLogin(ref, function(error, user) {
			if (error) 
			{
				console.log(error);
			} 
			else if (user) {
				$scope.user = user
				user_id = user.uid;
				UserSession.login(user);
				console.log('User: ' + user.uid + ', Provider: ' + user.provider);
			}
		});
		
		$scope.register = function()
		{
			auth.createUser($scope.regEmail, $scope.regPass, function(error, user) 
			{
				if (error) 
				{
					console.log('Error', error);
					alert("There was an error creating a user! The email is already in use!");
				}
				else
				{
					var users = new Firebase("https://scorching-fire-5198.firebaseio.com/users");
					$scope.users = $firebase(users);
					
					var otherData = {
						email: $scope.regEmail,
						name: $scope.regName,
					}
					
					$scope.users[user.uid] = otherData;
					$scope.users.$save(user.uid);
					
					auth.login('password', 
						{
						email: $scope.regEmail,
						password: $scope.regPass,
						rememberMe: true
						}
					);
				}
			});
		};
	}
  ])

  .controller('newGroupCtrl', [function($scope) {

  }])

  .controller('newgroupSuccessCtrl', [function($scope) {

  }])

  .controller('profileCtrl', ['$scope', 'User',
    function ($scope, User) {
      $scope.user = User.query();
  }])

/* -------------------------------------------------- calendar controler ---------------------------------------------------------------------- */

  .controller('eventsCtrl', ['$scope', 'UserEvents', 'UserSession', '$location',
    function($scope, UserEvents, UserSession, $location)
	{
		if(UserSession.isAuthenticated())
		{
			var kozouc = new Array();
			var userEventRef = new Firebase('https://scorching-fire-5198.firebaseio.com/users/simplelogin%3A2/eventlist/'); //USER NEEDED!!!
			var userEventsRef = userEventRef.on('value', function(tmp)
			{
				tmp.forEach(function(superdrek)
				{
				//console.log(superdrek.val().title); //eventi
					var kmet = superdrek.val().title;
					var banja = new Firebase('https://scorching-fire-5198.firebaseio.com/meetings/'+kmet);
					banja.on('value', function(meeting1)
					{
						var meetingObj1 = {title: meeting1.val().meetingDescription, start: meeting1.val().start, end: meeting1.val().end};
						kozouc.push(meetingObj1);
					})
				})
			});


			var dbase = new Firebase('https://scorching-fire-5198.firebaseio.com/meetings/Master Meeting');
			dbase.on('value', function(meeting){
			var meetingObj = {title: meeting.val().meetingDescription, start: meeting.val().start, end: meeting.val().end};
			  
			console.log(JSON.stringify(kozouc));        
			$('#calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay',
				},
				editable: true,
				disableDragging: true,

				eventSources: [{
					events: kozouc,

					type: 'GET',
					color: 'yellow',
					textColor: 'black'
				}]  
			  });
			});
		}
		else
		{
			$location.path('/home');
		}
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
	  console.log('i was called?');
      auth.logout();
      UserSession.setAuthenticated(false);
      $location.path('/home');
      $scope.isUserLoggedIn = false;
	  $scope.user = {};
    }
  })

;




/**
  TODO:
  Pametno bi blo spremenit eventsCtrl, da bo mel scope userMeetings al neki in ne user, in potem ustrezno pohendlat po viewjih!

 **/