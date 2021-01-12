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
				// console.log("TCL getAnalysisLists ~ data", data);
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
			// var list = {
			// 		id: analysisList.id,
			// 		mediumAnalysisListTranslations: analysisList.mediumAnalysisListTranslations,
			// 		mediumID: analysisList.mediumId,
			// 		tags: analysisList.tags
			// };
			delete analysisList.ui;
			// delete analysisList.analysisSegments;
			delete analysisList.analysisSegmentsUI;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+analysisList.id,
					type:"PATCH",
					data: JSON.stringify(analysisList),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: updateAnalysisList -> data", data);
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

		async createSegment(model, analysislistId) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 296 ~ createSegment ~ model, analysislistId", model, analysislistId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+analysislistId+"/segment",
					type:"POST",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// callback(new TIMAAT.AnalysisAnalysisList(data));
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});		
			}).catch((error) => {
				console.log( "error: ", error );
			});	
		},

		async updateSegment(segment) {
      console.log("TCL: updateSegment ~ segment", segment);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+segment.model.id,
					type:"PATCH",
					data: JSON.stringify(segment.model),
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

		async removeSegment(segment) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 346 ~ removeSegment ~ segment", segment);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+segment.model.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// TODO refactor
					
					// // remove analysislist
					// var index = TIMAAT.VideoPlayer.curAnalysisList.analysisAnalysisLists.indexOf(analysislist);
					// if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.analysisAnalysisLists.splice(index, 1);

					// // update UI
					// analysislist.removeUI();
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
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 296 ~ createSequence ~ model, segmentId", model, segmentId);
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

		async updateSequence(sequence) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 321 ~ updateSequence ~ sequence", sequence);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/sequence/"+sequence.model.id,
					type:"PATCH",
					data: JSON.stringify(sequence.model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// segment.model = data;
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async removeSequence(sequence) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 346 ~ removeSequence ~ sequence", sequence);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/sequence/"+sequence.model.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// TODO refactor
					
					// // remove segment
					// var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.indexOf(segment);
					// if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.splice(index, 1);

					// // update UI
					// segment.removeUI();
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
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 376 ~ createScene ~ model, segmentId", model, segmentId);
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

		async updateScene(scene) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 401 ~ updateScene ~ scene", scene);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/scene/"+scene.model.id,
					type:"PATCH",
					data: JSON.stringify(scene.model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// segment.model = data;
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async removeScene(scene) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 426 ~ removeScene ~ scene", scene);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/scene/"+scene.model.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// TODO refactor
					
					// // remove segment
					// var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.indexOf(segment);
					// if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.splice(index, 1);

					// // update UI
					// segment.removeUI();
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
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 296 ~ createTake ~ model, sequenceId", model, sequenceId);
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
					// callback(new TIMAAT.AnalysisSequence(data));
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});		
			}).catch((error) => {
				console.log( "error: ", error );
			});	
		},

		async updateTake(take) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 321 ~ updateTake ~ take", take);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/take/"+take.model.id,
					type:"PATCH",
					data: JSON.stringify(take.model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// sequence.model = data;
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async removeTake(take) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 346 ~ removeTake ~ take", take);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/take/"+take.model.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// TODO refactor
					
					// // remove sequence
					// var index = TIMAAT.VideoPlayer.curAnalysisList.sequences.indexOf(sequence);
					// if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.sequences.splice(index, 1);

					// // update UI
					// sequence.removeUI();
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
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 296 ~ createAction ~ model, sceneId", model, sceneId);
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
					// callback(new TIMAAT.AnalysisScene(data));
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});		
			}).catch((error) => {
				console.log( "error: ", error );
			});	
		},

		async updateAction(action) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 321 ~ updateAction ~ action", action);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/action/"+action.model.id,
					type:"PATCH",
					data: JSON.stringify(action.model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
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

		async removeAction(action) {
      console.log("TCL ~ file: timaat.service.analysislist.js ~ line 346 ~ removeAction ~ action", action);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/action/"+action.model.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
					// TODO refactor
					
					// // remove scene
					// var index = TIMAAT.VideoPlayer.curAnalysisList.scenes.indexOf(scene);
					// if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.scenes.splice(index, 1);

					// // update UI
					// scene.removeUI();
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
