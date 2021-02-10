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

	TIMAAT.AnalysisListService = {
		
		getAnalysisLists(mediumId, callback) {
			// console.log("TCL: getAnalysisLists -> getAnalysisLists(mediumId, callback) ");
			// console.log("TCL: getAnalysisLists -> mediumId", mediumId);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/analysislists",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				console.log("TCL getAnalysisLists ~ data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
			
		},

		async getAnalysisList(mediumAnalysisListId) {
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getAnalysisList -> data", data);
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

		async getCategorySetList(mediumAnalysisListId) {
      // console.log("TCL: getCategorySetList -> mediumAnalysisListId", mediumAnalysisListId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId+"/categorySet/list/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getCategorySetList -> data", data);
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

		async getSelectedCategories(typeId, type) {
			console.log("TCL: getSelectedCategories -> typeId, type", typeId, type);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+type+"/"+typeId+"/category/list/",
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

		async getTagList(mediumAnalysisListId) {
      // console.log("TCL: getTagList -> for mediumAnalysisListId", mediumAnalysisListId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId+"/hasTagList/",
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

		createAnalysisList(title, comment, mediumId, callback) {
      // console.log("TCL: createAnalysisList ~ title, comment, mediumId, callback", title, comment, mediumId, callback);
			var model = {
					"id": 0,
					"analysisSegments": [],
					"annotations": [],
					"mediumAnalysisListTranslations": [{
						"id": 0,
						"text": comment,
						"title": title,						
					}],	
					"medium": {
						id: mediumId
					}
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/medium/"+mediumId,
				type:"POST",
				data: JSON.stringify(model),
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
				console.log( e.responseText );
			});			
		},

		updateAnalysisList(analysisList) {
			console.log("TCL: updateAnalysisList -> analysisList", analysisList);
			var list = {
					id: analysisList.id,
					mediumAnalysisListTranslations: analysisList.mediumAnalysisListTranslations,
					mediumID: analysisList.mediumID,
					categorySets: analysisList.categorySets
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+list.id,
				type:"PATCH",
				data: JSON.stringify(list),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TODO refactor
				analysisList.id = data.id;
				TIMAAT.Util.setDefTranslation(analysisList, 'mediumAnalysisListTranslations', 'title', data.title);
				TIMAAT.Util.setDefTranslation(analysisList, 'mediumAnalysisListTranslations', 'text', data.text);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		async updateMediumAnalysisList(analysisList) {
			console.log("TCL: updateAnalysisList -> analysisList", analysisList);
			var updateList = {
				// annotationa: analysisList.annotations,
				// analysisSegments: analysisList.analysisSegments,
				categorySets: analysisList.categorySets,
				id: analysisList.id,
				mediumAnalysisListTranslations: analysisList.mediumAnalysisListTranslations,
				mediumID: analysisList.mediumId,
				tags: analysisList.tags,
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+analysisList.id,
					type:"PATCH",
					data: JSON.stringify(updateList),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: updateAnalysisList -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
				}).catch((error) => {
					console.log( "error: ", error );
			});	
		},

		removeAnalysisList(analysisList) {
			// console.log("TCL: removeAnalysisList -> analysisList", analysisList);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+analysisList.id,
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

		async addCategorySet(mediumAnalysisListId, categorySetId) {
			console.log("TCL: addCategorySet -> mediumAnalysisListId, categorySetId", mediumAnalysisListId, categorySetId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId+"/categorySet/"+categorySetId,
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

		async removeCategorySet(mediumAnalysisListId, categorySetId) {
			// console.log("TCL: removeCategorySet -> mediumAnalysisListId, categorySetName", mediumAnalysisListId, categorySetName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId+"/categorySet/"+categorySetId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: removeCategorySet -> data", data);
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

		async addCategory(typeId, categoryId, type) {
			console.log("TCL: addCategory -> typeId, categoryId, type", typeId, categoryId, type);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+type+"/"+typeId+"/category/"+categoryId,
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

		async removeCategory(typeId, categoryId, type) {
			// console.log("TCL: removeCategory -> typeId, categoryId, type)", typeId, categoryId, type));
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+type+"/"+typeId+"/category/"+categoryId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: removeCategorySet -> data", data);
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

		async addTag(mediumAnalysisListId, tagId) {
			console.log("TCL: addTag -> mediumAnalysisListId, tagId", mediumAnalysisListId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId+"/tag/"+tagId,
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

		async removeTag(mediumAnalysisListId, tagId) {
			// console.log("TCL: removeTag -> mediumAnalysisListId, tagName", mediumAnalysisListId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId+"/tag/"+tagId,
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

		// createSegment(model, list, callback) {
		// 	console.log("TCL: createSegment -> model, list, callback", model, list, callback);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+list+"/segment",
		// 		type:"POST",
		// 		data: JSON.stringify(model),
		// 		contentType:"application/json; charset=utf-8",
		// 		dataType:"json",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
    //     console.log("TCL: }).done -> data", data);
		// 		callback(new TIMAAT.AnalysisSegment(data));
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});			
		// },

		async createSegment(model, analysisListId) {
			console.log("TCL: createSegment -> model, analysisListId", model, analysisListId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+analysisListId+"/segment",
					type:"POST",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: }).done -> data", data);
					resolve(data);
					// callback(new TIMAAT.AnalysisSegment(data));
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});		
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		// updateSegment(segment) {
		// 	console.log("TCL: updateSegment -> segment", segment);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+segment.model.id,
		// 		type:"PATCH",
		// 		data: JSON.stringify(segment.model),
		// 		contentType:"application/json; charset=utf-8",
		// 		dataType:"json",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		console.log("TCL: updateSegment -> done", data);
		// 		segment.model = data;
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});
		// },

		// removeSegment(segment) {
		// 	// console.log("TCL: removeSegment -> segment", segment);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+segment.model.id,
		// 		type:"DELETE",
		// 		contentType:"application/json; charset=utf-8",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TODO refactor
				
		// 		// remove segment
		// 		var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.indexOf(segment);
		// 		if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.splice(index, 1);

		// 		// update UI
		// 		segment.removeUI();
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});
			
		// },

		// removeTake(take) {
		// 	// console.log("TCL: removeTake -> take", take);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/take/"+take.model.id,
		// 		type:"DELETE",
		// 		contentType:"application/json; charset=utf-8",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TODO refactor
				
		// 		// remove take
		// 		var index = TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.indexOf(take);
		// 		if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.splice(index, 1);

		// 		// update UI
		// 		take.removeUI();
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});
			
		// },

		// removeScene(scene) {
		// 	// console.log("TCL: removeScene -> scene", scene);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/scene/"+scene.model.id,
		// 		type:"DELETE",
		// 		contentType:"application/json; charset=utf-8",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TODO refactor
				
		// 		// remove scene
		// 		var index = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.indexOf(scene);
		// 		if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.splice(index, 1);

		// 		// update UI
		// 		scene.removeUI();
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});
			
		// },

		// removeAction(action) {
		// 	// console.log("TCL: removeAction -> action", action);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/action/"+action.model.id,
		// 		type:"DELETE",
		// 		contentType:"application/json; charset=utf-8",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TODO refactor
				
		// 		// remove action
		// 		var index = TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.indexOf(action);
		// 		if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.splice(index, 1);

		// 		// update UI
		// 		action.removeUI();
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});
			
		// },

		// async createSegment(model, analysislistId) {
    //   console.log("TCL model, analysislistId", model, analysislistId);
		// 	return new Promise(resolve => {
		// 		$.ajax({
		// 			url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+analysislistId+"/segment",
		// 			type:"POST",
		// 			data: JSON.stringify(model),
		// 			contentType:"application/json; charset=utf-8",
		// 			dataType:"json",
		// 			beforeSend: function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		}).done(function(data) {
		// 			resolve(data);
		// 			// callback(new TIMAAT.AnalysisAnalysisList(data));
		// 		})
		// 		.fail(function(e) {
		// 			console.log( "error", e );
		// 			console.log( e.responseText );
		// 		});		
		// 	}).catch((error) => {
		// 		console.log( "error: ", error );
		// 	});	
		// },

		async updateSegment(model) {
      console.log("TCL: updateSegment ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+model.id,
					type:"PATCH",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// analysislist.model = data;
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async removeSegment(model) {
			// console.log("TCL: removeSegment -> model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+model.id,
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

		async createSequence(model, segmentId) {
      console.log("TCL createSequence ~ model, segmentId", model, segmentId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+segmentId+"/sequence",
					type:"POST",
					data: JSON.stringify(model),
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

		async updateSequence(model) {
      console.log("TCL updateSequence ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/sequence/"+model.id,
					type:"PATCH",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: updateSequence(sequence).done -> data", data);
					data.segmentId = model.segmentId; // transient data
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

		async updateSequenceTranslation(sequenceTranslation) {
      console.log("TCL: updateSequenceTranslation -> sequenceTranslation", sequenceTranslation);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/sequence/translation/"+sequenceTranslation.id,
					type:"PATCH",
					data: JSON.stringify(sequenceTranslation),
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

		async removeSequence(model) {
      console.log("TCL removeSequence ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/sequence/"+model.id,
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

		async createScene(model, segmentId) {
      console.log("TCL model, segmentId", model, segmentId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+segmentId+"/scene",
					type:"POST",
					data: JSON.stringify(model),
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

		async updateScene(model) {
      console.log("TCL updateScene ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/scene/"+model.id,
					type:"PATCH",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					data.segmentId = model.segmentId; // transient data
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

		async updateSceneTranslation(sceneTranslation) {
      console.log("TCL: updateSceneTranslation -> sceneTranslation", sceneTranslation);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/scene/translation/"+sceneTranslation.id,
					type:"PATCH",
					data: JSON.stringify(sceneTranslation),
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

		async removeScene(model) {
      console.log("TCL removeScene ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/scene/"+model.id,
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

		async createTake(model, sequenceId) {
      console.log("TCL createTake ~ model, sequenceId", model, sequenceId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+sequenceId+"/take",
					type:"POST",
					data: JSON.stringify(model),
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

		async updateTake(model) {
      console.log("TCL updateTake ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/take/"+model.id,
					type:"PATCH",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					data.sequenceId = model.sequenceId; // transient data
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

		async updateTakeTranslation(takeTranslation) {
      console.log("TCL: updateTakeTranslation -> takeTranslation", takeTranslation);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/take/translation/"+takeTranslation.id,
					type:"PATCH",
					data: JSON.stringify(takeTranslation),
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

		async removeTake(model) {
      console.log("TCL removeTake ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/take/"+model.id,
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

		async createAction(model, sceneId) {
      console.log("TCL createAction ~ model, sceneId", model, sceneId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+sceneId+"/action",
					type:"POST",
					data: JSON.stringify(model),
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

		async updateAction(model) {
      console.log("TCL updateAction ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/action/"+model.id,
					type:"PATCH",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					data.sceneId = model.sceneId; // transient data
					resolve(data);
					// scene.model = data;
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateActionTranslation(actionTranslation) {
      console.log("TCL: updateActionTranslation -> actionTranslation", actionTranslation);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/action/translation/"+actionTranslation.id,
					type:"PATCH",
					data: JSON.stringify(actionTranslation),
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

		async removeAction(model) {
      console.log("TCL removeAction ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/action/"+model.id,
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
