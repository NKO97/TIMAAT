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
	
	TIMAAT.MediaService = {

		listMediaTypes(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/mediatype/list",
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
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		listMedia(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				console.log("TCL: listMedia -> data", data);
				callback(data);
			}).fail(function(e) {
//				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		listMediumSubtype(mediumSubtype, callback) {
			// console.log("TCL: listMediumSubtype", mediumSubtype);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumSubtype+"/list",
				type:"GET",
				// data: JSON.stringify(mediaType),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	console.log("TCL: listMediumSubtype -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		async createMedium(mediumModel) {
			console.log("TCL: async createMedium -> mediumModel", mediumModel);
			var newMediumModel = {
				id: 0,
				remark: mediumModel.remark,
				releaseDate: mediumModel.releaseDate,
				copyright: mediumModel.copyright,
				mediaType: {
					id: mediumModel.mediaType.id,
				},
				// work: {
				// 	id: mediumModel.work.id,
				// },
				displayTitle: {
					id: mediumModel.displayTitle.id,
				},
			};
      console.log("TCL: createMedium -> newMediumModel", newMediumModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumModel.id,
					type:"POST",
					data: JSON.stringify(newMediumModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(mediumData) {
					console.log("TCL: createMedium -> returning mediumData", mediumData);
					resolve(mediumData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		// not yet needed (no translation data or translation table available at the moment)
		async createMediumTranslation(model, modelTranslation) {
			// console.log("TCL: createMediumTranslation -> model, modelTranslation", model, modelTranslation);			
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+model.id+"/translation/"+modelTranslation.id,
					type:"POST",
					data: JSON.stringify(modelTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					// console.log("TCL: createMediumTranslation -> translationData", translationData);
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createMediumSubtype(mediumSubtype, mediumModel, subtypeModel) {
      console.log("TCL: createMediumSubtype -> mediumSubtype, mediumModel, subtypeModel", mediumSubtype, mediumModel, subtypeModel);			
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumSubtype+"/"+mediumModel.id,
					type:"POST",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(subtypeData) {
					console.log("TCL: createMediumSubtype - returning subtypeData", subtypeData);
					resolve(subtypeData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createTitle(title) {
			// console.log("TCL: async createTitle -> title", title);
			// console.log("TCL: async createTitle -> JSON.stringify(title)", JSON.stringify(title));
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/title/"+title.id,
					type:"POST",
					data: JSON.stringify(title),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(titleData) {
					// console.log("TCL: createTitle -> titleData", titleData);
					resolve(titleData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addTitle(mediumId, title) {
      // console.log("TCL: addTitle -> mediumId", mediumId);
			// console.log("TCL: async addTitle -> title", title);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/title/"+title.id,
					type:"POST",
					data: JSON.stringify(title),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(titleData) {
					console.log("TCL: addTitle -> titleData", titleData);
					resolve(titleData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addLanguageTrack(track) {
      // console.log("TCL: async addLanguageTrack -> track", track);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+track.mediumId+"/languagetrack/"+track.mediumLanguageTypeId+"/"+track.languageId,
					type:"POST",
					// data: JSON.stringify(track),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(trackData) {
					// console.log("TCL: addTrack -> trackData", trackData);
					resolve(trackData);
				}).fail(function(error) {
					console.log( "error: ", error );
					console.log( "ajax call fail - error: ", error.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createSource(source) {
			// console.log("TCL: async createSource -> source", source);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/source/"+source.id,
					type:"POST",
					data: JSON.stringify(source),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(sourceData) {
					console.log("TCL: createSource -> sourceData", sourceData);
					resolve(sourceData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateMedium(mediumModel) {
			console.log("TCL: MediaService: async updateMedium -> mediumModel", mediumModel);
			var tempMediumModel = {};
			tempMediumModel.releaseDate = mediumModel.releaseDate;
			tempMediumModel.remark = mediumModel.remark;
			tempMediumModel.copyright = mediumModel.copyright;
			tempMediumModel.displayTitle = mediumModel.displayTitle;
			tempMediumModel.originalTitle = mediumModel.originalTitle;
			tempMediumModel.titles = mediumModel.titles;
      console.log("TCL: updateMedium -> tempMediumModel", tempMediumModel);
			// delete tempMediumModel.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumModel.id,
					type:"PATCH",
					data: JSON.stringify(tempMediumModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateMedium -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		// not yet needed (no translation data or translation table available at the moment)
		async updateMediumTranslation(medium) {
			// console.log("TCL: MediaService async updateMediumTranslation -> medium", medium);
			var updatedMediumTranslation = {
				id: medium.model.mediumTranslations[0].id, // TODO get the correct translation_id
				name: medium.model.mediumTranslations[0].name,
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.model.id+"/translation/"+updatedMediumTranslation.id,
					type:"PATCH",
					data: JSON.stringify(updatedMediumTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
				// console.log("TCL: updateMediumTranslation -> translationData", translationData);
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateMediumSubtype(mediumSubtype, subtypeModel) {
			console.log("TCL: updateMediumSubtype -> mediumSubtype, subtypeModel", mediumSubtype, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumSubtype+"/"+subtypeModel.mediumId,
					type:"PATCH",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateMediumSubtype -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateTitle(title) {
			console.log("TCL: async updateTitle -> title", title);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/title/"+title.id,
					type:"PATCH",
					data: JSON.stringify(title),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateTitle -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateSource(source) {
			// console.log("TCL: async updateSource -> source", source);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/source/"+source.id,
					type:"PATCH",
					data: JSON.stringify(source),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateSource -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		removeMedium(medium) {
			console.log("TCL: removeMedium -> medium", medium);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.model.id,
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

		removeMediumSubtype(subtype, subtypeData) {
      console.log("TCL: removesubtypeData -> subtype, subtypeData", subtype, subtypeData);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+subtype+"/"+subtypeData.model.mediumId,
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

		removeTitle(title) {
			console.log("TCL: removeTitle -> title", title);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/title/"+title.id,
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

		async removeLanguageTrack(track) {
			// console.log("TCL: removeLanguageTrack -> track", track);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+track.id.mediumId+"/languagetrack/"+track.id.mediumLanguageTypeId+"/"+track.id.languageId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: removed language track from medium_has_language.");
					resolve(data);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log("error: ", error);
			});
		},

	}	
}, window));
