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
			var userL = {};
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
					return userL;
				},

				login: function(user) {
					userL = user;
					ref =  new Firebase('https://scorching-fire-5198.firebaseio.com');				
					userB = $firebase(ref);
					authenticated = true;
				}
			}
	}])

;
