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

		getAnnotations(videoId, callback) {
			console.log("TCL: getAnnotations -> getAnnotations(videoId, callback) ");
			console.log("TCL: getAnnotations -> videoId", videoId);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+videoId+"/annotations",
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

		async getSelectedCategories(annotationId) {
      // console.log("TCL: getSelectedCategories -> annotationId", annotationId);
			return new Promise(resolve => {
				jQuery.ajax({
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
				.fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});	
		},

		async getTagList(annotationId) {
      // console.log("TCL: getTagList -> for annotationId", annotationId);
			return new Promise(resolve => {
				jQuery.ajax({
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
				.fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});	
		},

		createAnnotation(title, comment, startTime, endTime, color, strokeWidth, layerVisual, list, callback) {
			// console.log("TCL: createAnnotation -> title, comment, startTime, endTime, color, strokeWidth, layerVisual, list, callback", title, comment, startTime, endTime, color, strokeWidth, layerVisual, list, callback);
			var model = { 	
				id: 0, 
				analysisListID: list,
				startTime: startTime,
				endTime: endTime,
				layerVisual: layerVisual,
//				actors: [],
//				annotations1: [],
//				annotations2: [],
//				categories: [],
//				events: [],
//				locations: [],
//				mediums: [],
				annotationTranslations: [{
					id: 0,
					comment: comment,
					title: title,
				}],
				selectorSvgs: [{
					id: 0,
					colorRgba: color,
					svgData: "{\"keyframes\":[{\"time\":0,\"shapes\":[]}]}",
					strokeWidth: strokeWidth,
					svgShapeType: {
						id: 5
					}
				}]
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/medium/"+TIMAAT.VideoPlayer.model.video.id,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(new TIMAAT.Annotation(data));
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
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
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});
    // },
    
    async updateAnnotation(model) {
			console.log("TCL: updateAnnotation -> model", model);
			// var annotation = {
			// 		id: model.id,
			// 		annotationTranslations: model.annotationTranslations,
			// 		categories: model.categories,
			// 		comment: model.comment,
			// 		endTime: model.endTime,
			// 		startTime: model.startTime,
			// 		selectorSvgs: model.selectorSvgs,
			// 		layerVisual: model.layerVisual,
			// 		tags: model.tags,
			// 		title: model.title,
			// 		// mediumID: model.mediumID,
			// };
      // console.log("TCL: updateAnnotation -> annotation", annotation);
			// delete model.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+model.id,
					type:"PATCH",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: updateAnnotation -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
				}).catch((error) => {
					console.log( "error: ", error );
			});	
		},

		removeAnnotation(annotation) {
			// console.log("TCL: removeAnnotation -> annotation", annotation);
			var anno = annotation;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+anno.model.id,
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
		
		addAnnotationActor(annotationId, actorId) {
      // console.log("TCL: addAnnotationActor -> annotationId, actorId", annotationId, actorId);
			return jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/actors/"+actorId,
				type:"POST",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: addAnnotationActor -> data", data);
				return data;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
				return false;
			});
		},

		removeAnnotationActor(annotationId, actorId) {
      // console.log("TCL: removeAnnotationActor -> annotationId, actorId", annotationId, actorId);
			return jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/actors/"+actorId,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				return data;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
				return false;
			});
		},

		addAnnotationEvent(annotationId, eventId) {
      // console.log("TCL: addAnnotationEvent -> annotationId, eventId", annotationId, eventId);
			return jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/events/"+eventId,
				type:"POST",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: addAnnotationEvent -> data", data);
				return data;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
				return false;
			});
		},

		removeAnnotationEvent(annotationId, eventId) {
      // console.log("TCL: removeAnnotationEvent -> annotationId, eventId", annotationId, eventId);
			return jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/events/"+eventId,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				return data;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
				return false;
			});
		},

		async addCategory(annotationId, categoryId) {
			console.log("TCL: addCategory -> annotationId, categoryId", annotationId, categoryId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/category/"+categoryId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async removeCategory(annotationId, categoryId) {
			// console.log("TCL: removeCategory -> annotationId, categoryName", annotationId, categoryName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/category/"+categoryId,
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

		async addTag(annotationId, tagId) {
			console.log("TCL: addTag -> annotationId, tagId", annotationId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/tag/"+tagId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async removeTag(annotationId, tagId) {
			// console.log("TCL: removeTag -> annotationId, tagName", annotationId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotationId+"/tag/"+tagId,
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
