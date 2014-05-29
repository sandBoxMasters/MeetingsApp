'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
/*angular.module('meetingsApp.services', []).
  value('version', '0.1');
*/

var meetingsAppServices = angular.module('meetingsApp.services', ['ngResource', 'firebase']);

meetingsAppServices
	.factory('Group', ['$resource',
		function($resource){
			return $resource('data/groupDetail/:GID.json', {}, {
			query: {method:'GET', params:{GID:'group'}, isArray:false}
		});
	}])
	.factory('Groups', ['$resource',
		function($resource){
			return $resource('data/usergroup.json', {}, {
			query: {method:'GET', params:{}, isArray:false}
		});
	}])
	.factory('UserEvents', ['$resource',
		function($resource){
			return $resource('data/usermeetings.json', {}, {
			query: {method:'GET', params:{}, isArray:false}
		});
	}])
	.factory('User', ['$resource',
		function($resource){
			return $resource('data/user.json', {}, {
			query: {method:'GET', params:{}, isArray:false}
		});
	}])
	.factory('UserSession', ['$firebase', 
		function($firebase) {
			var authenticated = false;
			var userLogin = {};
			var userB = {};
			var ref;
			return {  
				isAuthenticated: function () {
					return authenticated;
				},

				setAuthenticated: function(auth)
				{
					authenticated = auth;
				},

				getUserL: function() {
					return userLogin;
				},
				
				getUserInfo: function(){
					if(authenticated){
						var info = new Firebase('https://scorching-fire-5198.firebaseio.com/users/'+userLogin.uid);
						var data = new Array();
						info.on('value', function(inf){
							data = { name: inf.val().name, email :inf.val().email };
						})
						return data;
					}
				},
				
				createEvent: function(desc, timeStart, timeEnd, loca, allday1, usrList) {
					if(authenticated)
					{
						var db = new Firebase('https://scorching-fire-5198.firebaseio.com/meetings');
						var userRef = new Firebase('https://scorching-fire-5198.firebaseio.com/users/'+userLogin.uid+'/eventlist/');
						var barva = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
						var meetingData = {
							start: timeStart,
							end: timeEnd, 
							location: loca, 
							meetingDescription: desc,
							allDay: allday1,
							invitedUsers: usrList,
							color: barva,
						}
						
						var meetingLink = db.push(meetingData);
						var meetingID = meetingLink.path.m[1];
						userRef.push({title : meetingID});
						
						/*add to other users*/
						if(usrList != null)
						{
							usrList.forEach(function(tmpUID)
							{
								userRef = new Firebase('https://scorching-fire-5198.firebaseio.com/users/'+tmpUID+'/eventlist/');
								userRef.push({title : meetingID});
							});
						}
						
						return true;
					}
					return false;
				},
				
				changeName: function(newName)
				{
					if(authenticated)
					{
						console.log('as kle?');
						var db = new Firebase('https://scorching-fire-5198.firebaseio.com/users/'+userLogin.uid);
						db.update({name: newName});
						return true;
					}
					console.log('al te pa ni!');
					return false;
				},
				
				login: function(user) {
					userLogin = user;
					ref =  new Firebase('https://scorching-fire-5198.firebaseio.com');				
					userB = $firebase(ref);
					authenticated = true;
				}
			}
	}])

;
