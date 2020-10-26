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
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				console.log("TCL: listEvents -> data", data);
				callback(data);
			}).fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		async getEventDatasetsTotal() {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/total",
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getEventDatasetsTotal -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async getEvent(id) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getEvent -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async getTagList(eventId) {
      console.log("TCL: getTagList -> for eventId", eventId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+eventId+"/hasTagList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getTagList -> data", data);
					resolve(data);
				})
				.fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});	
		},

		async createEvent(eventModel) {
			console.log("TCL: async createEvent -> eventModel", eventModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/0",
					type:"POST",
					data: JSON.stringify(eventModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(eventData) {
					// console.log("TCL: createEvent -> returning eventData", eventData);
					resolve(eventData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createEventTranslation(model, modelTranslation) {
      // console.log("TCL: createEventPersonTranslation -> async createEventPersonTranslation(model, modelTranslation)",  model, modelTranslation);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+model.id+"/translation/"+modelTranslation.id,
					type:"POST",
					data: JSON.stringify(modelTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addTag(eventId, tagId) {
			// console.log("TCL: addTag -> eventId, tagId", eventId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+eventId+"/tag/"+tagId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
		});		
		},

		async updateEvent(eventModel) {
			console.log("TCL: EventService: async updateEvent -> eventModel", eventModel);
			delete eventModel.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+eventModel.id,
					type:"PATCH",
					data: JSON.stringify(eventModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateEvent -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateEventTranslation(event) {
			// console.log("TCL: EventService async updateEventTranslation -> event", event);
			var updatedEventTranslation = {
				id: event.model.eventTranslations[0].id, // TODO get the correct translation_id
				name: event.model.eventTranslations[0].name,
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id+"/translation/"+updatedEventTranslation.id,
					type:"PATCH",
					data: JSON.stringify(updatedEventTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
				// console.log("TCL: updateEventTranslation -> translationData", translationData);
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async removeEvent(event) {
			// console.log("TCL: removeEvent -> event", event);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async removeTag(eventId, tagId) {
			// console.log("TCL: removeTag -> eventId, tagName", eventId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+eventId+"/tag/"+tagId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});	
		},	

	}
	
}, window));
