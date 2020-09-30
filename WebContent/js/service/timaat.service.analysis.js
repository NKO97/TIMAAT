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

	TIMAAT.AnalysisService = {

	async addStaticAnalysisMethodToAnalysis(analysisModel) {
	  console.log("TCL: addStaticAnalysisMethodToAnalysis -> analysisModel", analysisModel);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/"+analysisModel.annotationId+"/"+analysisModel.analysisMethodId,
				type:"POST",
				data: JSON.stringify(analysisModel),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	// removes analysis with link to reusable analysis method
	async removeStaticAnalysis(analysisId) {
	  console.log("TCL: removeStaticAnalysis -> analysisId", analysisId);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/"+analysisId,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	async createDynamicAnalysis(analysisModel) {
	  console.log("TCL: addStaticAnalysisMethodToAnalysis -> analysisModel", analysisModel);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/"+analysisModel.annotationId+"/0",
				type:"POST",
				data: JSON.stringify(analysisModel),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	// removes analysis and corresponding analysis method and method variant data as it is unique to this analysis
	async removeDynamicAnalysis(analysis) {

	},

  }
}, window));
