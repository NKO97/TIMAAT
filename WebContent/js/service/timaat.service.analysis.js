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

	async addAnalysisMethodToAnalysis(model) {
	  console.log("TCL: addAnalysisMethodToAnalysis -> model", model);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/"+model.annotation.id+"/"+model.analysisMethod.id,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: addAnalysisMethodToAnalysis -> data", data);
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	// removes analysis with link to reusable analysis method
	async deleteStaticAnalysis(analysisId) {
	  console.log("TCL: deleteStaticAnalysis -> analysisId", analysisId);
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

	async createAnalysisMethodVariant(model, variantType) {
  	console.log("TCL: createAnalysisMethodVariant -> model, variantType", model, variantType);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/"+variantType+"/"+model.analysisMethodId,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: createAnalysisMethodVariant -> data", data);
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	// removes analysis and corresponding analysis method and method variant data as it is unique to this analysis
	async deleteDynamicAnalysis(analysisMethodId) {
		console.log("TCL: deleteDynamicAnalysis -> analysisMethodId", analysisMethodId);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/analysisAndMethod/"+analysisMethodId,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: createAnalysisMethodVariant -> data", data);
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	async createAudioPostProduction() {
  	console.log("TCL: createAudioPostProduction");
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/audioPostProduction/0",
				type:"POST",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: createAudioPostProduction -> data", data);
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	async deleteAudioPostProduction(id) {
		console.log("TCL: deleteAudioPostProduction -> id", id);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/audioPostProduction/"+id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: deleteAudioPostProduction -> data", data);
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

	async createAudioPostProductionTranslation(model) {
  	console.log("TCL: createAudioPostProductionTranslation -> model", model);
		return new Promise(resolve => {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysis/audioPostProduction/"+model.audioPostProduction.id+"/translation",
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: createAudioPostProductionTranslation -> data", data);
				resolve(data);
			}).fail(function(e) {
				console.log( "error: ", e.responseText);
			});
		}).catch((error) => {
			console.log( "error: ", error );
		});
	},

  }
}, window));
