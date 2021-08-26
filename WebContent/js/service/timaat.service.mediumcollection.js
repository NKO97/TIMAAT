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

	TIMAAT.MediumCollectionService = {

		getMediaCollections(callback) {
			// console.log("TCL: getMediaCollections -> getMediaCollections(callback) ");
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/listCard?noContents=1&authToken="+TIMAAT.Service.session.token,
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText: ", error.responseText);
			});
		},

		async getMediumCollection(id) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getMediumCollection -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});		
		},

		async getTagList(mediumCollectionId) {
      // console.log("TCL: getTagList -> for mediumCollectionId", mediumCollectionId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+mediumCollectionId+"/hasTagList/",
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

		createMediaCollection(title, comment, callback) {
      // console.log("TCL: createMediaCollection (old) -> title, comment, callback", title, comment);
			var model = {
					id: 0,
					isSystemic: 0,
					title: title,
					remark: comment,
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection",
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
			.fail(function(error) {
				console.error("ERROR: ", error);
				console.error("ERROR responseText:", error.responseText);
			});			
		},

		async createMediumCollection(mediumCollectionModel) {
      // console.log("TCL: createMediumCollection -> mediumCollectionModel", mediumCollectionModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/0",
					type:"POST",
					data: JSON.stringify(mediumCollectionModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createMediumCollection - returning data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createMediumCollectionSubtype(type, mediumCollectionModel, subTypeModel) {
      // console.log("TCL: createMediumCollectionSubtype -> type, mediumCollectionModel, subTypeModel", type, mediumCollectionModel, subTypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+type+"/"+mediumCollectionModel.id,
					type:"POST",
					data: JSON.stringify(subTypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createMediumCollectionSubtype - returning data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addCollectionItem(collectionId, mediumId) {
			// console.log("TCL: addCollectionItem -> collectionId, mediumId", collectionId, mediumId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+collectionId+"/medium/"+mediumId+'?authToken='+TIMAAT.Service.session.token,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: addCollectionItem -> data", data);
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

		async updateCollectionItem(collectionId, mediumId, sortOrder) {
			// console.log("TCL: updateCollectionItem -> collectionId, mediumId, sortOrder", collectionId, mediumId, sortOrder);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+collectionId+"/medium/"+mediumId+"/order/"+sortOrder+'?authToken='+TIMAAT.Service.session.token,
					type:"PATCH",
					// data: JSON.stringify(mediaCollectionHasMedium),
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: updateCollectionItem -> data", data);
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

		async addUserAccountHasMediumCollectionWithPermission(userAccountId, mediumCollectionId, permissionId) {
			console.log("TCL: addUserAccountHasMediumCollectionWithPermission -> userAccountId, mediumCollectionId, permission", userAccountId, mediumCollectionId, permissionId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+mediumCollectionId+"/userAccount/"+userAccountId+"/withPermission/"+permissionId+"/"+'?authToken='+TIMAAT.Service.session.token,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
          // console.log("TCL: addUserAccountHasMediumCollectionWithPermission - done -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText: ", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateUserAccountHasMediumCollectionWithPermission(userAccountId, mediumCollectionId, permissionId) {
			console.log("TCL: updateUserAccountHasMediumCollectionWithPermission -> userAccountId, mediumCollectionId, permission", userAccountId, mediumCollectionId, permissionId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+mediumCollectionId+"/userAccount/"+userAccountId+"/withPermission/"+permissionId+"/"+'?authToken='+TIMAAT.Service.session.token,
					type:"PATCH",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
          // console.log("TCL: updateUserAccountHasMediumCollectionWithPermission - done -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText: ", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeUserAccountHasMediumCollection(userAccountId, mediumCollectionId) {
      console.log("TCL: removeUserAccountHasMediumCollection -> userAccountId, mediumCollectionId", userAccountId, mediumCollectionId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+mediumCollectionId+"/userAccount/"+userAccountId+"/"+'?authToken='+TIMAAT.Service.session.token,
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

		async getMediumCollectionPermissionLevel(mediaCollectionId) {
			// console.log("TCL: getMediumCollectionPermissionLevel -> mediaCollectionId", mediaCollectionId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/authenticate/permissionLevelMediaCollection/"+mediaCollectionId+"/"+'?authToken='+TIMAAT.Service.session.token,
					type       : "POST",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getMediumCollectionPermissionLevel -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					if (error.status == 401) {
						$('#mediumCollectionNoPermissionModal').modal('show');
					} else {
						console.error("ERROR: ", error);
						console.error("ERROR responseText: ", error.responseText);
					}
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});	
		},

		async getDisplayNamesAndPermissions(mediaCollectionId) {
      console.log("TCL: getDisplayNamesAndPermissions -> mediaCollectionId", mediaCollectionId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+'/TIMAAT/api/mediumCollection/'+mediaCollectionId+'/displayNames/'+'?authToken='+TIMAAT.Service.session.token,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getDisplayNamesAndPermissions -> data", data);
					resolve(data);
				})
				.fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText: ", error.responseText);
				});	
			}).catch((error) => {
				console.error("ERROR: ", error);
			});	
		},

		async addTag(mediumCollectionId, tagId) {
			// console.log("TCL: addTag -> mediumCollectionId, tagId", mediumCollectionId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+mediumCollectionId+"/tag/"+tagId+'?authToken='+TIMAAT.Service.session.token,
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

		async updateMediaCollection(collectionModel) {
			// console.log("TCL: updateMediaCollection -> collection", collectionModel);
			var tempCollection = {
					id: collectionModel.id,
					isSystemic: collectionModel.isSystemic,
					title: collectionModel.title,
					note: collectionModel.note,
					tags: collectionModel.tags,
					globalPermission: collectionModel.globalPermission
			};
			delete tempCollection.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+collectionModel.id+'?authToken='+TIMAAT.Service.session.token,
					type:"PATCH",
					data: JSON.stringify(tempCollection),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// TODO refactor
					// collection.id = data.id;
					// collection.title = data.title;
					// collection.note = data.note;
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

		async updateMediumCollectionSubtype(type, collection) {
			// console.log("TCL: updateMediaCollectionSubtype -> type, collection", type, collection);
			delete collection.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+type+"/"+collection.mediaCollectionId+'?authToken='+TIMAAT.Service.session.token,
					type:"PATCH",
					data: JSON.stringify(collection),
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

		async removeMediaCollection(collection) {
			// console.log("TCL: removeMediaCollection -> collection", collection);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+collection.id+'?authToken='+TIMAAT.Service.session.token,
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

		async removeCollectionItem(collectionId, mediumId) {
      // console.log("TCL: removeCollectionItem -> collectionId, mediumId", collectionId, mediumId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+collectionId+"/medium/"+mediumId+'?authToken='+TIMAAT.Service.session.token,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: removeCollectionItem -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeTag(mediumCollectionId, tagId) {
			// console.log("TCL: removeTag -> mediumCollectionId, tagName", mediumCollectionId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediumCollection/"+mediumCollectionId+"/tag/"+tagId+'?authToken='+TIMAAT.Service.session.token,
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

	}

}, window));
