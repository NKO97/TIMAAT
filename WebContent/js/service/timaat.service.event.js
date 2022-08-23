/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
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
				// console.log("TCL: listEvents -> data", data);
				callback(data);
			}).fail(function(error) {
				console.error("ERROR responseText: ", error.responseText);
				console.error("ERROR: ", error);
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
					// console.log("TCL: getEventDatasetsTotal -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
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
					// console.log("TCL: getEvent -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getTagList(eventId) {
      // console.log("TCL: getTagList -> for eventId", eventId);
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
					// console.log("TCL: getTagList -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createEvent(eventModel) {
			// console.log("TCL: async createEvent -> eventModel", eventModel);
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
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
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
				}).fail(function(error) {
					console.error( "error: ", error.responseText );
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
		});
		},

		async updateEvent(eventModel) {
			// console.log("TCL: EventService: async updateEvent -> eventModel", eventModel);
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
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateEventTranslation(eventModel) {
			// console.log("TCL: EventService async updateEventTranslation -> event", event);
			var updatedEventTranslation = {
				id: eventModel.eventTranslations[0].id, // TODO get the correct translation_id
				name: eventModel.eventTranslations[0].name,
				description: eventModel.eventTranslations[0].description
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+eventModel.id+"/translation/"+updatedEventTranslation.id,
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
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

	}

}, window));
