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
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/analysisLists",
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

		async getMediumAnalysisLists(mediumId) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/analysisLists",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getAnalysisLists -> data", data);
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

		async getAnalysisList(mediumAnalysisListId) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+mediumAnalysisListId,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getAnalysisList -> data", data);
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
				$.ajax({
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
			// console.log("TCL: getSelectedCategories -> typeId, type", typeId, type);
			return new Promise(resolve => {
				$.ajax({
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
				$.ajax({
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

		async createSegmentElement(type, model, parentElementId) {
			console.log("TCL: createSegmentElement -> type, model, parentElementId", type, model, parentElementId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+parentElementId+"/"+type,
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

		async updateSegmentElement(type, model) {
      console.log("TCL: updateSegmentElement ~ type, model", type, model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+type+"/"+model.id,
					type:"PATCH",
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

		async updateSegmentElementTranslation(type, model) {
			console.log("TCL: updateSegmentElementTranslation -> type, model", type, model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+type+"/translation/"+model.id,
					type:"PATCH",
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

		async removeSegmentElement(type, modelId) {
			console.log("TCL: removeSegment -> type, modelId", type, modelId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+type+"/"+modelId,
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
