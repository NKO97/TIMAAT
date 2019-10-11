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
	
	TIMAAT.EventService = {

		listEvents(callback) {
			// console.log("TCL: listEvents -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/list",
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

		createEvent(model, modelTranslation, callback) {
			console.log("TCL: [1] createEvent -> model", model);
			var event = model;
			console.log("TCL: [1a] createEvent -> event", event);			
			// create Event
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+model.id,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: [2] createEvent done -> data", data);
				event.id = data.id;
				// console.log("TCL: [2a] createEvent -> event", event);
				jQuery.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+data.id+"/translation/"+modelTranslation.id,
					type:"POST",
					data: JSON.stringify(modelTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
				// console.log("TCL: [3] createEventTranslation -> data", data);
				event.eventTranslations[0] = data;
				// console.log("TCL: [3a] createEvent -> event", event);
				callback(event);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				})
			}).done(function(data) {
				// console.log("TCL: [4] createEvent -> data", data);
				// console.log("TCL: [4a] createEvent -> event", event);
			}).fail(function(e) {
				console.log( "error: ", e.responseText );
			});
		},

		updateEvent(event) {
			console.log("TCL: updateEvent -> event", event);
			var updatedEvent = {
				id: event.model.id,
				// name: event.model.eventTranslations[0].name,
				// description: event.model.eventTranslations[0].description,
				beginsAtDate: event.model.beginsAtDate,
				endsAtDate: event.model.endsAtDate,
			};
			console.log("TCL: updateEvent -> updatedEvent:", updatedEvent);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+updatedEvent.id,
				type:"PATCH",
				data: JSON.stringify(updatedEvent),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			console.log("TCL: updateEvent -> data", data);
				event.model.id = data.id;
				event.model.beginsAtDate = data.beginsAtDate;
				event.model.endsAtDate = data.endsAtDate;
				event.model.eventTranslations[0].id = data.eventTranslations[0].id;
				event.model.eventTranslations[0].name = data.eventTranslations[0].name;
				event.model.eventTranslations[0].description = data.eventTranslations[0].description;				
				// console.log("TCL: update event translation", event);
				// TIMAAT.Service.updateEventTranslation(event);
				// console.log("TCL: updateEvent -> event.updateUI()");
				event.updateUI();
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		updateEventTranslation(event) {
			console.log("TCL: updateEventTranslation -> event", event);
			console.log("TCL: updateEventTranslation -> event.model.id", event.model.id);
			// update event translation
			var updatedEventTranslation = {
				id: event.model.eventTranslations[0].id, // TODO get the correct translation_id
				name: event.model.eventTranslations[0].name,
				description: event.model.eventTranslations[0].description,
			};
			console.log("TCL: updateEventTranslation -> updatedEventTranslation", updatedEventTranslation);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id+"/translation/"+updatedEventTranslation.id,
				type:"PATCH",
				data: JSON.stringify(updatedEventTranslation),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(translationData) {
			console.log("TCL: updateEventTranslation -> translationData", translationData);
				event.model.eventTranslations[0].id = translationData.id;
				event.model.eventTranslations[0].name = translationData.name;
				event.model.eventTranslations[0].description = translationData.description;
				console.log("TCL: updateEventTranslation -> event.updateUI()");
				event.updateUI();  // will be called by updateEvent(event)
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeEvent(event) {
			console.log("TCL: removeEvent -> event", event);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id,
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

		removeEventTranslation(event) {
			console.log("TCL: removeEventTranslation -> event", event);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id+"/translation/"+event.model.eventTranslations[0].id,
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

		addEventTag(event, tagname, callback) {
			console.log("TCL: addEventTag -> event.id", event.id);
			console.log("TCL: addEventTag -> event, tagname, callback", event, tagname, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.id+"/tag/"+tagname,
				type:"POST",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TIMAAT.Service.updateCategorySets(tagname);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

		removeEventTag(event, tagname, callback) {
			console.log("TCL: removeEventTag -> event.id", event.id);
			console.log("TCL: removeEventTag -> event, tagname, callback", event, tagname, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.id+"/tag/"+tagname,
				type:"DELETE",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TIMAAT.Service.updateCategorySets(tagname);
				callback(tagname);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},		

	}
	
}, window));
