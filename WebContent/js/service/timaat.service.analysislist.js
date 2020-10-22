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
		
		logout: function() {
			console.log("TCL: logout: function()");
			TIMAAT.Service.state = 2;
			TIMAAT.Service.token = null;
			TIMAAT.Service.session = null;
			location.reload(true);
			// TODO refactor
			if ( TIMAAT.UI.notificationSocket ) TIMAAT.UI.notificationSocket.close();
		},

		getAnalysisLists(videoId, callback) {
			console.log("TCL: getAnalysisLists -> getAnalysisLists(videoId, callback) ");
			console.log("TCL: getAnalysisLists -> videoId", videoId);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+videoId+"/analysislists",
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

		async getTagList(mediumAnalysisListId) {
      console.log("TCL: getTagList -> for mediumAnalysisListId", mediumAnalysisListId);
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

		createAnalysisList(title, comment, mediumId, callback) {
			// console.log("TCL: createAnalysislist -> createAnalysislist(title, comment, mediumID, callback)");
			// console.log("TCL: createAnalysislist -> title", title);
			// console.log("TCL: createAnalysislist -> comment", comment);
			// console.log("TCL: createAnalysislist -> mediumID", mediumID);
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
			console.log("TCL: updateAnalysislist -> analysisList", analysisList);
			var list = {
					id: analysisList.id,
					mediumAnalysisListTranslations: analysisList.mediumAnalysisListTranslations,
					mediumID: analysisList.mediumID
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
			console.log("TCL: updateAnalysislist -> analysisList", analysisList);
			var list = {
					id: analysisList.id,
					mediumAnalysisListTranslations: analysisList.mediumAnalysisListTranslations,
					mediumID: analysisList.mediumID
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+list.id,
					type:"PATCH",
					data: JSON.stringify(list),
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


	}

}, window));
