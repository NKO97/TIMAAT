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

	TIMAAT.AnnotationService = {

		//* not in use anymore
		// getAnnotations(videoId, callback) {
		// 	// console.log("TCL: getAnnotations -> getAnnotations(videoId, callback) ");
		// 	// console.log("TCL: getAnnotations -> videoId", videoId);
		// 	jQuery.ajax({
		// 		url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+videoId+"/annotations",
		// 		type       : "GET",
		// 		contentType: "application/json; charset=utf-8",
		// 		dataType   : "json",
		// 		beforeSend : function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		callback(data);
		// 	})
		// 	.fail(function(error) {
		// 		console.error("ERROR: ", error);
		// 	});

		// },

		async getSelectedCategories(annotationId) {
      // console.log("TCL: getSelectedCategories -> annotationId", annotationId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/category/list/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getSelectedCategories -> data", data);
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

		async getTagList(annotationId) {
      // console.log("TCL: getTagList -> for annotationId", annotationId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/hasTagList/",
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

		createAnnotation(model, analysisListId, callback) {
      // console.log("TCL: createAnnotation -> model", model);
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/mediumAnalysisList/"+analysisListId+'/?authToken='+TIMAAT.Service.session.token,
				type       : "POST",
				data       : JSON.stringify(model),
				contentType: "application/json; charset=utf-8",
				dataType   : "json",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(new TIMAAT.Annotation(data));
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
			});
		},

		// updateAnnotation(annotation) {
		// 	console.log("TCL: updateAnnotation -> annotation", annotation);
		// 	var anno = annotation;
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+anno.model.id,
		// 		type:"PATCH",
		// 		data: JSON.stringify(annotation.getModel()),
		// 		contentType:"application/json; charset=utf-8",
		// 		dataType:"json",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		anno.model = data;
		// 	})
		// 	.fail(function(error) {
		// 		console.error("ERROR: ", error);
		// 		console.error("ERROR responseText:", error.responseText);
		// 	});
    // },

    async updateAnnotation(model) {
			// console.log("TCL: updateAnnotation -> model", model);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+model.id+'/?authToken='+TIMAAT.Service.session.token,
					type       : "PATCH",
					data       : JSON.stringify(model),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	// console.log("TCL: updateAnnotation -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
				}).catch((error) => {
					console.error("ERROR: ", error);
			});
		},

		removeAnnotation(annotation) {
			// console.log("TCL: removeAnnotation -> annotation", annotation);
			var anno = annotation;
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+anno.model.id,
				type       : "DELETE",
				contentType: "application/json; charset=utf-8",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
			});
		},

		addAnnotationActor(annotationId, actorId) {
      // console.log("TCL: addAnnotationActor -> annotationId, actorId", annotationId, actorId);
			return jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/actors/"+actorId+'/?authToken='+TIMAAT.Service.session.token,
				type       : "POST",
				contentType: "application/json; charset=utf-8",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: addAnnotationActor -> data", data);
				return data;
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
				return false;
			});
		},

		removeAnnotationActor(annotationId, actorId) {
      // console.log("TCL: removeAnnotationActor -> annotationId, actorId", annotationId, actorId);
			return jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/actors/"+actorId+'/?authToken='+TIMAAT.Service.session.token,
				type       : "DELETE",
				contentType: "application/json; charset=utf-8",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				return data;
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
				return false;
			});
		},

		addAnnotationEvent(annotationId, eventId) {
      // console.log("TCL: addAnnotationEvent -> annotationId, eventId", annotationId, eventId);
			return jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/events/"+eventId+'/?authToken='+TIMAAT.Service.session.token,
				type       : "POST",
				contentType: "application/json; charset=utf-8",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: addAnnotationEvent -> data", data);
				return data;
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
				return false;
			});
		},

		removeAnnotationEvent(annotationId, eventId) {
      // console.log("TCL: removeAnnotationEvent -> annotationId, eventId", annotationId, eventId);
			return jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/events/"+eventId+'/?authToken='+TIMAAT.Service.session.token,
				type       : "DELETE",
				contentType: "application/json; charset=utf-8",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				return data;
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
				return false;
			});
		},

		async addCategory(annotationId, categoryId) {
			// console.log("TCL: addCategory -> annotationId, categoryId", annotationId, categoryId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/category/"+categoryId+'/?authToken='+TIMAAT.Service.session.token,
					type       : "POST",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeCategory(annotationId, categoryId) {
			// console.log("TCL: removeCategory -> annotationId, categoryName", annotationId, categoryName);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/category/"+categoryId+'/?authToken='+TIMAAT.Service.session.token,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					beforeSend : function (xhr) {
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

		async addTag(annotationId, tagId) {
			// console.log("TCL: addTag -> annotationId, tagId", annotationId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/tag/"+tagId+'/?authToken='+TIMAAT.Service.session.token,
					type       : "POST",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeTag(annotationId, tagId) {
			// console.log("TCL: removeTag -> annotationId, tagName", annotationId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/tag/"+tagId+'/?authToken='+TIMAAT.Service.session.token,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					beforeSend : function (xhr) {
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
