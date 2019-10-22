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
	
	TIMAAT.ActorService = {

		listActors(callback) {
			// console.log("TCL: listActors -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
			
		},

		createActor(name, callback) {
		// createActor(name, callback) {
			// console.log("TCL: createActor -> name:", name);
			// console.log("TCL: createActor -> callback", callback);
			var model = {
				id: 0,
				name: name, // TODO change to actorTranslation
				// tags: []
				// actorTranslation: [{
				// 	id: 0,
				// 	languageId: list,
				// 	name: name,
				// 	description: description
				// }]
			};
			jQuery.ajax({
				// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+model.id,
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+model.id,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// callback(new TIMAAT.Actor(data));
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});		
		},

		updateActor(actor) {
			// console.log("TCL: updateActor -> actor", actor);
			var ac = {
				id: actor.model.id,
				name: actor.model.name,
			// 	// tags: []
			};
			console.log("TCL: updateActor -> ac", ac);
			// console.log("TCL: updateActor -> locationId", actor.model.locationId);
			// var thisActor = actor;
			jQuery.ajax({
				// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+thisActor.model.id,
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+ac.id,
				type:"PATCH",
				data: JSON.stringify(ac),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			console.log("TCL: updateActor -> data", data);
				// thisActor.model = data;
				// ac.model = data;
				actor.model.id = data.id;
				actor.model.title = data.title;
				console.log("TCL: updateActor -> actor.updateUI()");
				actor.updateUI(); 
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeActor(actor) {
			// console.log("TCL: removeActor -> actor", actor);
			var ac = actor;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+ac.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},	

	}
	
}, window));
