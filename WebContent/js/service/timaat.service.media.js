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

		// listMedia(callback) {
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/list",
		// 		type:"GET",
		// 		contentType:"application/json; charset=utf-8",
		// 		dataType:"json",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// console.log("TCL: listMedia -> data", data);
		// 		callback(data);
		// 	}).fail(function(e) {
		// 		console.log(e.responseText);
		// 		console.log( "error", e );
		// 	});			
		// },

		async getMediaDatasetsTotal() {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/total",
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getMediaDatasetsTotal -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
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
      	// console.log("TCL: listMediumSubtype -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		async getActorList(mediumId) {
      console.log("TCL: getActorHasRoleList -> mediumId", mediumId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/hasActorList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getActorRolesList -> data", data);
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

		async getActorHasRoleList(mediumId, actorId) {
      console.log("TCL: getActorHasRoleList -> mediumId, actorId", mediumId, actorId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/hasActor/"+actorId+"/withRoleList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getActorHasRoleList -> data", data);
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

		async getMedium(id) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getMedium -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async getViewToken(id) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+id+"/viewToken",
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"text",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getViewToken -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async getTagList(mediumId) {
      console.log("TCL: getTagList -> for mediumId", mediumId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/hasTagList/",
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

		async createMedium(mediumModel) {
			// console.log("TCL: async createMedium -> mediumModel", mediumModel);
			var newMediumModel = {
				id: 0,
				remark: mediumModel.remark,
				releaseDate: mediumModel.releaseDate,
				recordingStartDate: mediumModel.recordingStartDate,
				recordingEndDate: mediumModel.recordingEndDate,
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
      // console.log("TCL: createMedium -> newMediumModel", newMediumModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/0",
					type:"POST",
					data: JSON.stringify(newMediumModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(mediumData) {
					// console.log("TCL: createMedium -> returning mediumData", mediumData);
					resolve(mediumData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		// not yet needed (no translation data or translation table available at the moment)
		// async createMediumTranslation(model, modelTranslation) {
		// 	// console.log("TCL: createMediumTranslation -> model, modelTranslation", model, modelTranslation);			
		// 	return new Promise(resolve => {
		// 		$.ajax({
		// 			url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+model.id+"/translation/"+modelTranslation.id,
		// 			type:"POST",
		// 			data: JSON.stringify(modelTranslation),
		// 			contentType:"application/json; charset=utf-8",
		// 			dataType:"json",
		// 			beforeSend: function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		}).done(function(translationData) {
		// 			// console.log("TCL: createMediumTranslation -> translationData", translationData);
		// 			resolve(translationData);
		// 		}).fail(function(e) {
		// 			console.log( "error: ", e.responseText );
		// 		});
		// 	}).catch((error) => {
		// 		console.log( "error: ", error );
		// 	});
		// },

		async createMediumSubtype(mediumSubtype, mediumModel, subtypeModel) {
      // console.log("TCL: createMediumSubtype -> mediumSubtype, mediumModel, subtypeModel", mediumSubtype, mediumModel, subtypeModel);			
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
					// console.log("TCL: createMediumSubtype - returning subtypeData", subtypeData);
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
      // console.log("TCL: addTitle -> mediumId, title", mediumId, title);
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
					// console.log("TCL: addTitle -> titleData", titleData);
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
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+track.mediumId+"/languageTrack/"+track.mediumLanguageTypeId+"/"+track.languageId,
					type:"POST",
					// data: JSON.stringify(track),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: addTrack -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.log( "error: ", error );
					console.log( "ajax call fail - error: ", error.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addMediumHasActorWithRoles(mediumId, actorId, roleId) {
    	console.log("TCL: addActorToMediumHasActorWithRoles -> mediumId, actorId, roleIds", mediumId, actorId, roleId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/hasActor/"+actorId+"/withRole/"+roleId,
					type:"POST",
					// data: JSON.stringify(roleIds),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.log( "error: ", error );
					console.log( "ajax call fail - error: ", error.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addTag(mediumId, tagId) {
			// console.log("TCL: addTag -> mediumId, tagId", mediumId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/tag/"+tagId,
					type:"POST",
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
					// console.log("TCL: createSource -> sourceData", sourceData);
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
			tempMediumModel.recordingStartDate = mediumModel.recordingStartDate;
			tempMediumModel.recordingEndDate = mediumModel.recordingEndDate;
			tempMediumModel.remark = mediumModel.remark;
			tempMediumModel.copyright = mediumModel.copyright;
			tempMediumModel.displayTitle = mediumModel.displayTitle;
			tempMediumModel.originalTitle = mediumModel.originalTitle;
			tempMediumModel.titles = mediumModel.titles;
			tempMediumModel.tags = mediumModel.tags;
      // console.log("TCL: updateMedium -> tempMediumModel", tempMediumModel);
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
					// console.log("TCL: async updateMedium -> returning updateData", updateData);
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
		// async updateMediumTranslation(medium) {
		// 	// console.log("TCL: MediaService async updateMediumTranslation -> medium", medium);
		// 	var updatedMediumTranslation = {
		// 		id: medium.model.mediumTranslations[0].id, // TODO get the correct translation_id
		// 		name: medium.model.mediumTranslations[0].name,
		// 	};
		// 	return new Promise(resolve => {
		// 		$.ajax({
		// 			url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.model.id+"/translation/"+updatedMediumTranslation.id,
		// 			type:"PATCH",
		// 			data: JSON.stringify(updatedMediumTranslation),
		// 			contentType:"application/json; charset=utf-8",
		// 			dataType:"json",
		// 			beforeSend: function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		}).done(function(translationData) {
		// 		// console.log("TCL: updateMediumTranslation -> translationData", translationData);
		// 			resolve(translationData);
		// 		}).fail(function(e) {
		// 			console.log( "error", e );
		// 			console.log( e.responseText );
		// 		});
		// 	}).catch((error) => {
		// 		console.log( "error: ", error );
		// 	});
		// },

		async updateMediumSubtype(mediumSubtype, subtypeModel) {
			// console.log("TCL: updateMediumSubtype -> mediumSubtype, subtypeModel", mediumSubtype, subtypeModel);
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
					// console.log("TCL: async updateMediumSubtype -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateFileStatus(medium, type) {
			// console.log("TCL: updateFileStatus(medium, type)", type);
			// medium.poll = window.setInterval(function() {
				// if ( medium.ui && !medium.ui.is(':visible') ) return;
				return new Promise(resolve => {
					$.ajax({
						url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+type+"/"+medium.id+'/status',
						type:"GET",
						beforeSend: function (xhr) {
							xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
						},
					}).done(function(data) {
          	// console.log("TCL: updateFileStatus -> data: ", data);
						// if ( medium.fileStatus && medium.fileStatus == data ) return;
						// medium.fileStatus = data;
						
						// TIMAAT.VideoChooser.setVideoStatus(video);
						// TIMAAT.MediaDatasets.displayFileStatus(medium);
						
						// if (medium.fileStatus == 'unavailable' || medium.fileStatus == 'ready')
						// 	window.clearInterval(medium.poll);
						// return(data);
						resolve(data);					
					}).fail(function(e) {
						// TODO handle error
						// window.clearInterval(medium.poll);
						// medium.ui.find('.timaat-medium-status').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
						console.log( "error", e );
						console.log(e.responseText);
					});
				}).catch((error) => {
					console.log( "error: ", error);
					console.log(error.responseText);
				});
			// }, Math.round(30000+(Math.random()*15000)));
		},

		async updateViewToken(medium) {
			// console.log("TCL: updateViewToken(medium)", medium);
				return new Promise(resolve => {
					$.ajax({
						url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.id+'/viewToken',
						type:"GET",
						beforeSend: function (xhr) {
							xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
						},
					}).done(function(data) {
          	// console.log("TCL: updateViewToken -> data: ", data);
						resolve(data);					
					}).fail(function(e) {
						console.log( "error", e );
						console.log(e.responseText);
					});
				}).catch((error) => {
					console.log( "error: ", error);
					console.log(error.responseText);
				});
		},

		async updateTitle(title) {
			// console.log("TCL: MediaService: async updateTitle -> title", title);
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
					// console.log("TCL: async updateTitle -> updateData", updateData);
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

		async removeMedium(medium) {
			// console.log("TCL: removeMedium -> medium", medium);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.model.id,
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
				console.log( "error: ", error);
			});
		},

		removeTitle(title) {
			// console.log("TCL: removeTitle -> title ", title);
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
			// console.log("TCL: removeLanguageTrack -> track ", track);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+track.id.mediumId+"/languageTrack/"+track.id.mediumLanguageTypeId+"/"+track.id.languageId,
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

		async removeActorFromMediumHasActorWithRoles(mediumId, actorId) {
      console.log("TCL: removeActorFromMediumHasActorWithRoles -> mediumId, actorId", mediumId, actorId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/hasActor/"+actorId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
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
				console.log("error: ", error);
			});
		},

		async removeRoleFromMediumHasActorWithRoles(mediumId, actorId, roleId) {
      console.log("TCL: removeRoleFromMediumHasActorWithRoles -> mediumId, actorId, roleId", mediumId, actorId, roleId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/hasActor/"+actorId+"/withRole/"+roleId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
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
				console.log("error: ", error);
			});
		},

		async removeTag(mediumId, tagId) {
			// console.log("TCL: removeTag -> mediumId, tagName", mediumId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumId+"/tag/"+tagId,
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
