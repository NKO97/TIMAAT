'use strict';
(function (factory, window) {
    /*globals define, module, require*/

    // define an AMD module that relies on 'TIMAAT'
    if (typeof define === 'function' && define.amd) {
        define(['TIMAAT'], factory);


    // define a Common JS module that relies on 'TIMAAT'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('TIMAAT'));
    }

    // attach your plugin to the global 'TIMAAT' variable
    if(typeof window !== 'undefined' && window.TIMAAT){
        factory(window.TIMAAT);
    }

}(function (TIMAAT) {

	TIMAAT.UserService = {

    async isPasswordValid(credentials) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/authenticate/isPasswordValid",
					type       : "POST",
					data       : JSON.stringify(credentials),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: isPasswordValid -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async changePassword(credentials) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/authenticate/changePassword"+'?authToken='+TIMAAT.Service.session.token,
					type       : "PATCH",
					data       : JSON.stringify(credentials),
					contentType: "application/json; charset=utf-8",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getActor -> data", data);
					resolve(data);
				}).fail(function(error) {
					if (error.status = "409") { // password change declined because it was already used in the past by this user
						$('#newPassword').after('<label id="newPasswordError" class="error" for="newPassword">You cannot use a password you have used in the past. Please chose a new one.</label>');
            return;
					} else {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
					}
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

  }

}, window));