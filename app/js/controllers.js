'use strict';

/* Controllers */
var user_id;

angular.module('meetingsApp.controllers', ['firebase', 'ngRoute'])
  .controller('homeCtrl', ['$scope', 'UserSession', '$location', '$cookieStore',
	function($scope, UserSession, $location, $cookieStore) 
	{
		$scope.auth = $cookieStore.get('loggedIn');
		$scope.userLogin = UserSession.getUserL();
	}
  ])

/* -------------------------------------------------- login controler ---------------------------------------------------------------------- */

  .controller('loginCtrl', ['$scope', '$firebaseSimpleLogin', 'UserSession', '$location', '$cookieStore',
  function($scope, $firebaseSimpleLogin, UserSession, $location, $cookieStore) {
    var ref = new Firebase('https://scorching-fire-5198.firebaseio.com');
    var auth = new FirebaseSimpleLogin(ref, function(error, user)
    {
      if(error)
      {
        console.log(error);
		alert('Email or password incorrect.');
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
		$cookieStore.put('loggedIn', true);
    }
	
	$scope.LoginFB = function() {
		auth.login('facebook', {
			scope: 'email,user_likes'
		});
		$cookieStore.put('loggedIn', true);
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
				alert('Email is already in use :\'\(');
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
						id: user.uid,
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

  .controller('profileCtrl', ['$scope', 'UserSession', '$firebase', '$location', 
    function ($scope, UserSession, $fireabse, $location) 
	{
		$scope.auth = UserSession.isAuthenticated();
		$scope.userLogin = UserSession.getUserL();
		
		if(!UserSession.isAuthenticated())
		{
			$location.path('/home');
		}
		var redirect = false;
		var ref = new Firebase('https://scorching-fire-5198.firebaseio.com');
		var auth = new FirebaseSimpleLogin(ref, function(error, user)
			{
				if(error)
				{
					console.log('error:', error);
				}
				else if(user)
				{	}
				else
				{
					
				}
			}
		);
		
		$scope.userInfo = UserSession.getUserInfo();
		
		$scope.changeName = function()
		{
			console.log('changeName');
			if(!UserSession.changeName($scope.userInfo.name)) alert('Error changing name.');
			else alert('Name changed!');
		}
		
		$scope.changePassword = function()
		{
			console.log('changePassword');
			auth.changePassword($scope.userInfo.email, $scope.oldPW, $scope.newPW, 
				function(error, success)
				{
					if(!error)
						alert('Success: ', success);
					else
					{
						alert('Error changing passowrd.');
						console.log('Error: ', error);
					}
				}
			);
		}
	}
  ])

/* -------------------------------------------------- calendar controler ---------------------------------------------------------------------- */

  .controller('eventsCtrl', ['$scope', 'UserEvents', 'UserSession', '$location',
    function($scope, UserEvents, UserSession, $location)
	{
		if(UserSession.isAuthenticated())
		{
			var user = UserSession.getUserL().uid;
			var eventsData = new Array();
			var userEventRef = new Firebase('https://scorching-fire-5198.firebaseio.com/users/'+user+'/eventlist/');
			var userEventsRef = userEventRef.on('value', function(tmp)
			{
				tmp.forEach(function(arg)
				{
					var dogodek = arg.val().title;
					//console.log("DOGODEK:" ,dogodek);
					var nastavek = new Firebase('https://scorching-fire-5198.firebaseio.com/meetings/'+dogodek);
					nastavek.on('value', function(meeting1)
					{	
						var meetingObj1 = {title: meeting1.val().meetingDescription, start: meeting1.val().start, end: meeting1.val().end, allDay: meeting1.val().allDay,color: meeting1.val().color, durationEditable: false};
						eventsData.push(meetingObj1);
					})
				})
			});

			  
			//console.log(JSON.stringify(eventsData));        
			$('#calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay',
				},
				editable: true,
				disableDragging: true,

				eventSources: [{
					events: eventsData,

					type: 'GET',
					color: 'yellow',
					textColor: 'black'
				}]  
			  });
			
		}
		else
		{
			$location.path('/home');
		}
    }
  ])

/* -------------------------------------------------- end of calendar controler ------------------------------------------------------------- */

.controller('createEventCtrl', [ '$scope', '$firebase', '$location', 'UserSession',
	function($scope, $firebase, $location, UserSession)
	{
		if(!UserSession.isAuthenticated()) $location.path('/');
		
		var ref = new Firebase('https://scorching-fire-5198.firebaseio.com');
		var auth = new FirebaseSimpleLogin(ref, function(error, user)
		{
			if(error)
			{
				console.log('Error: ', error);
			}
			else if(user)
			{
				// TODO
			}
			else
			{
				$location.path('/');
			}
		});
		
		$scope.createEvent = function()
		{

			$scope.timeStart=$("#dtp1").find("input").val();
			$scope.timeEnd=$("#dtp2").find("input").val();
			if(angular.isUndefined($scope.allDayEvent) || $scope.allDayEvent === null) $scope.allDayEvent=false

			if(!UserSession.createEvent($scope.desc, $scope.timeStart, $scope.timeEnd, $scope.location,$scope.allDayEvent, $scope.tagsSelection))
			{
				alert('There was an error creating new event :\(');
			}else { $location.path('/events'); }
		};
		
		var userObj = new Firebase('https://scorching-fire-5198.firebaseio.com/users');
		var vsi = new Array();
		var userValue = userObj.on('value', function(tmp)
		{	//console.log(tmp.val());
				tmp.forEach(function(arg)
				{	
					vsi.push({id: arg.val().id, text: arg.val().email});
				});

		});
		
		$scope.tagsSelection=[];
		$scope.tagData = vsi;    

	}
])

/*--------------------------------end------------------------------------*/

.controller('groupsCtrl', ['$scope', 'Groups',
  function ($scope, Groups) {
    $scope.groups = Groups.query();
  }])

.controller('groupDetailCtrl', ['$scope', '$routeParams', 'Group',
  function ($scope, $routeParams, Group) {
    $scope.group = Group.get({GID: $routeParams.GID});
  }])
/*----------------------------------------------------------------------------------------------------------------------------------*/

.controller('navCtrl', function($scope, UserSession, $firebase, $location, $cookieStore){
    $scope.$watch(UserSession.isAuthenticated, function() {
      $scope.auth = $cookieStore.get('loggedIn');
      $scope.userLogin = UserSession.getUserL();
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
	  $scope.user = {};
	  $cookieStore.put('loggedIn', false);
    }
  })

;




/**
  TODO:
  Pametno bi blo spremenit eventsCtrl, da bo mel scope userMeetings al neki in ne user, in potem ustrezno pohendlat po viewjih!

 **/