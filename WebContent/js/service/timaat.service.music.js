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

	TIMAAT.MusicService = {

		async getActorList(musicId) {
      // console.log("TCL: getActorHasRoleList -> musicId", musicId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/hasActorList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getActorRolesList -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getActorHasRoleList(musicId, actorId) {
      // console.log("TCL: getActorHasRoleList -> musicId, actorId", musicId, actorId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/hasActor/"+actorId+"/withRoleList/",
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
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

    async getMusic(id) {
      return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
    },

		async getMediumByMusicId(id) {
      // console.log("TCL: getMediumByMusicId -> musicId", id);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/getMediumByMusicId/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					if (data == 0) data = null;
					// console.log("TCL: getMediumByMusicId -> data ", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getCategorySetList(musicId) {
      // console.log("TCL: getCategorySetList -> musicId", musicId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/categorySet/list/",
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
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getSelectedCategories(musicId) {
      // console.log("TCL: getSelectedCategories -> musicId", musicId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/category/list/",
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
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getTagList(musicId) {
      // console.log("TCL: getTagList -> for musicId", musicId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/hasTagList/",
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
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getMediumHasMusicList(musicId) {
      // console.log("TCL: getMediumHasMusicList -> musicId", musicId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+music+"/mediumHasMusicList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getMediumHasMusicList -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMusic(musicModel, mediumId) {
			console.log("TCL: async createMusic -> musicModel", musicModel);
			delete musicModel.titles; //* titles are added in a separate step
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+mediumId,
					type:"POST",
					data: JSON.stringify(musicModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(musicData) {
					// console.log("TCL: createMusic -> returning musicData", musicData);
					resolve(musicData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMusicSubtype(musicSubtype, musicModel, subtypeModel) {
      // console.log("TCL: createMusicSubtype -> musicSubtype, musicModel, subtypeModel", musicSubtype, musicModel, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicSubtype+"/"+musicModel.id,
					type:"POST",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(subtypeData) {
					// console.log("TCL: createMusicSubtype - returning subtypeData", subtypeData);
					resolve(subtypeData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createTitle(title) {
			// console.log("TCL: async createTitle -> title", title);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/title/"+title.id,
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
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addTitle(musicId, title) {
      // console.log("TCL: addTitle -> musicId, title", musicId, title);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/title/"+title.id,
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
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addLanguageTrack(track) {
      // console.log("TCL: async addLanguageTrack -> track", track);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+track.musicId+"/languageTrack/"+track.musicLanguageTypeId+"/"+track.languageId,
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
					console.error("ERROR: ", error);
					console.log( "ajax call fail - error: ", error.responseText );
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addMusicHasActorWithRoles(musicId, actorId, roleId) {
    	console.log("TCL: addMusicHasActorWithRoles -> musicId, actorId, roleIds", musicId, actorId, roleId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/hasActor/"+actorId+"/withRole/"+roleId,
					type:"POST",
					// data: JSON.stringify(roleIds),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
          // console.log("TCL: addMusicHasActorWithRoles - done -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.log( "ajax call fail - error: ", error.responseText );
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addTag(musicId, tagId) {
			// console.log("TCL: addTag -> musicId, tagId", musicId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/tag/"+tagId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
		});
		},

		async addCategorySet(musicId, categorySetId) {
			// console.log("TCL: addCategorySet -> musicId, categorySetId", musicId, categorySetId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/categorySet/"+categorySetId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeCategorySet(musicId, categorySetId) {
			// console.log("TCL: removeCategorySet -> musicId, categorySetName", musicId, categorySetName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/categorySet/"+categorySetId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: removeCategorySet -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addCategory(musicId, categoryId) {
			// console.log("TCL: addCategory -> musicId, categoryId", musicId, categoryId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/category/"+categoryId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeCategory(musicId, ) {
			// console.log("TCL: removeCategory -> musicId, categoryId", musicId, categoryId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/category/"+categoryId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addMediumHasMusic(musicId, mediumId) {
			// console.log("TCL: addMediumHasMusic -> mediumId, musicId", mediumId, musicId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/mediumHasMusic/"+mediumId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
          // console.log("TCL: addMediumHasMusic - done -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.log( "ajax call fail - error: ", error.responseText );
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addMediumHasMusicDetail(musicId, mediumId, mediumHasMusicDetail) {
      // console.log("TCL: addMediumHasMusicDetail -> musicId, mediumId, mediumHasMusicDetail", musicId, mediumId, mediumHasMusicDetail);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/"+mediumId+"/mediumHasMusicDetail/"+mediumHasMusicDetail.id,
					type       : "POST",
					data       : JSON.stringify(mediumHasMusicDetail),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: addMediumHasMusicDetail -> mediumHasMusicDetail", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateMediumHasMusicDetail(mediumHasMusicDetailData) {
      // console.log("TCL: updateMediumHasMusicDetail -> mediumHasMusicDetailData", mediumHasMusicDetailData);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/mediumHasMusicDetail/"+mediumHasMusicDetailData.id,
					type       : "PATCH",
					data       : JSON.stringify(mediumHasMusicDetailData),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateMediumHasMusicDetail -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMediumHasMusic(mediumHasMusic) {
      // console.log("TCL: removeMediumHasMusic -> mediumHaSMusic", mediumHasMusic);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+mediumHasMusic.id.musicId+"/mediumHasMusic/"+mediumHasMusic.id.mediumId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMediumHasMusicDetail(mediumHasMusicDetail) {
      // console.log("TCL: removeMediumHasMusicDetail -> mediumHasMusicDetail", mediumHasMusicDetail);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/mediumHasMusicDetail/"+mediumHasMusicDetail.id,
				type       : "DELETE",
				contentType: "application/json; charset=utf-8",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
			});
		},

		async updateMusic(musicModel) {
			console.log("TCL: MusicService: async updateMusic -> musicModel", musicModel);
			var model = musicModel;
			delete model.ui;
			delete model.mediumHasMusicList;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicModel.id,
					type:"PATCH",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateMusic -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateMusicSubtype(musicSubtype, subtypeModel) {
			// console.log("TCL: updateMusicSubtype -> musicSubtype, subtypeModel", musicSubtype, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicSubtype+"/"+subtypeModel.musicId,
					type:"PATCH",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateMusicSubtype -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateTitle(title) {
			// console.log("TCL: MusicService: async updateTitle -> title", title);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/title/"+title.id,
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
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMusic(music) {
			// console.log("TCL: removeMusic -> music", music);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+music.model.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		removeTitle(title) {
			// console.log("TCL: removeTitle -> title ", title);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/title/"+title.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
			});
		},

		async removeLanguageTrack(track) {
			// console.log("TCL: removeLanguageTrack -> track ", track);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+track.id.musicId+"/languageTrack/"+track.id.musicLanguageTypeId+"/"+track.id.languageId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: removed language track from music_has_language.");
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeActorFromMusicHasActorWithRoles(musicId, actorId) {
      // console.log("TCL: removeActorFromMusicHasActorWithRoles -> musicId, actorId", musicId, actorId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/hasActor/"+actorId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeRoleFromMusicHasActorWithRoles(musicId, actorId, roleId) {
      // console.log("TCL: removeRoleFromMusicHasActorWithRoles -> musicId, actorId, roleId", musicId, actorId, roleId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/hasActor/"+actorId+"/withRole/"+roleId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeTag(musicId, tagId) {
			// console.log("TCL: removeTag -> musicId, tagName", musicId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/tag/"+tagId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getMusicHasVoiceLeadingPatternList(id) {
			// console.log("TCL: getMusicHasVoiceLeadingPatternList -> id: ", id);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+id+"/hasVoiceLeadingPatternList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getCategoryHasCategorySetList -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMusicFormElement(model, musicId) {
			// console.log("TCL: createMusicFormElement -> model, musicId", model, musicId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/musicFormElement/",
					type:"POST",
					data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: }).done -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateMusicFormElement(model) {
      // console.log("TCL: updateMusicFormElement ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicFormElement/"+model.id,
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMusicFormElement(modelId) {
			// console.log("TCL: removeMusicFormElement -> modelId", modelId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicFormElement/"+modelId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getMusicFormElementType(id) {
      // console.log("TCL: getMusicFormElementType -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicFormElementType/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMusicChangeInTempoElement(model, musicId) {
			console.log("TCL: createMusicChangeInTempoElement -> model, musicId", model, musicId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/musicChangeInTempoElement/"+model.changeInTempo.id,
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
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateMusicChangeInTempoElement(model) {
      // console.log("TCL: updateMusicChangeInTempoElement ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicChangeInTempoElement/"+model.id,
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMusicChangeInTempoElement(modelId) {
			// console.log("TCL: removeMusicChangeInTempoElement -> modelId", modelId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicChangeInTempoElement/"+modelId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getChangeInTempo(id) {
      // console.log("TCL: getChangeInTempo -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/changeInTempo/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMusicArticulationElement(model, musicId) {
			console.log("TCL: createMusicArticulationElement -> model, musicId", model, musicId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/musicArticulationElement/"+model.articulation.id,
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
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateMusicArticulationElement(model) {
      // console.log("TCL: updateMusicArticulationElement ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicArticulationElement/"+model.id,
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMusicArticulationElement(modelId) {
			// console.log("TCL: removeMusicArticulationElement -> modelId", modelId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicArticulationElement/"+modelId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getArticulation(id) {
      // console.log("TCL: getArticulation -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/articulation/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMusicTextSettingElement(model, musicId) {
			console.log("TCL: createMusicTextSettingElement -> model, musicId", model, musicId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/musicTextSettingElement/",
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
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateMusicTextSettingElement(model) {
      // console.log("TCL: updateMusicTextSettingElement ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicTextSettingElement/"+model.id,
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMusicTextSettingElement(modelId) {
			// console.log("TCL: removeMusicTextSettingElement -> modelId", modelId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicTextSettingElement/"+modelId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getMusicTextSettingElementType(id) {
      // console.log("TCL: getMusicTextSettingElementType -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicTextSettingElementType/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMusicDynamicsElement(model, musicId) {
			console.log("TCL: createMusicDynamicsElement -> model, musicId", model, musicId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/"+musicId+"/musicDynamicsElement/",
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
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateMusicDynamicsElement(model) {
      // console.log("TCL: updateMusicDynamicsElement ~ model", model);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicDynamicsElement/"+model.id,
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
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeMusicDynamicsElement(modelId) {
			// console.log("TCL: removeMusicDynamicsElement -> modelId", modelId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicDynamicsElement/"+modelId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getMusicDynamicsElementType(id) {
      // console.log("TCL: getMusicDynamicsElementType -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/music/musicDynamicsElementType/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

  }

}, window));