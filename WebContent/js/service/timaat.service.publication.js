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

	TIMAAT.PublicationService = {

		async getSinglePublication(mediumAnalysisListId) {
      // console.log("TCL: getSinglePublication -> mediumAnalysisListId", mediumAnalysisListId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/publication/analysisList/"+mediumAnalysisListId,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getSinglePublication -> data", data);
					resolve(data);
				}).fail(function(error) {
					// resolve(null);
					console.error("ERROR: ", error);
					console.error("ERROR responseText: ", error.responseText);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},
		
		async createSinglePublication(publication) {
      // console.log("TCL: updateSinglePublication -> publication", publication);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/publication/analysisList/"+publication.mediumAnalysisListId,
					type       : "POST",
					data       : JSON.stringify(publication),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: updateSinglePublication -> data", data);
					resolve(data);
				}).fail(function(error) {
					resolve(null);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},

		async updateSinglePublication(publication) {
      // console.log("TCL: updateSinglePublication -> publication", publication);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/publication/analysisList/"+publication.mediumAnalysisListId,
					type       : "PATCH",
					data       : JSON.stringify(publication),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: updateSinglePublication -> data", data);
					resolve(data);
				}).fail(function(error) {
					resolve(null);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},

		async deleteSinglePublication(mediumAnalysisListId) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/publication/analysisList/"+mediumAnalysisListId,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getSinglePublication -> data", data);
					resolve(data);
				}).fail(function(error) {
					resolve(null);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},

		async getCollectionPublication(colID) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/publication/collection/"+colID,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getCollectionPublication -> data", data);
					resolve(data);
				}).fail(function(error) {
					// resolve(null);
					console.error("ERROR: ", error);
					console.error("ERROR responseText: ", error.responseText);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},
		
		async updateCollectionPublication(publication) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/publication/collection/"+publication.collectionId,
					type       : "POST",
					data       : JSON.stringify(publication),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: updateCollectionPublication -> data", data);
					resolve(data);
				}).fail(function(error) {
					resolve(null);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},

		async deleteCollectionPublication(colID) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/publication/collection/"+colID,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: deleteCollectionPublication -> data", data);
					resolve(data);
				}).fail(function(error) {
					resolve(null);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},

	}

}, window));
