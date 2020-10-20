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

	TIMAAT.MediaCollectionService = {

		getMediaCollections(callback) {
			// console.log("TCL: getMediaCollections -> getMediaCollections(callback) ");
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/listCard?nocontents=1",
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

		async getTagList(mediumCollectionId) {
      console.log("TCL: getTagList -> for mediumCollectionId", mediumCollectionId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+mediumCollectionId+"/hasTagList/",
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

		createMediaCollection(title, comment, callback) {
      console.log("TCL: createMediaCollection (old) -> title, comment, callback", title, comment);
			var model = {
					id: 0,
					isSystemic: 0,
					title: title,
					remark: comment,
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection",
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

		async createMediumCollection(mediumCollectionModel) {
      console.log("TCL: createMediumCollection -> mediumCollectionModel", mediumCollectionModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/0",
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
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createMediumCollectionSubtype(type, mediumCollectionModel, subTypeModel) {
      console.log("TCL: createMediumCollectionSubtype -> type, mediumCollectionModel, subTypeModel", type, mediumCollectionModel, subTypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+type+"/"+mediumCollectionModel.id,
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
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addCollectionItem(collectionId, mediumId) {
			console.log("TCL: addCollectionItem -> collectionId, mediumId", collectionId, mediumId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+collectionId+"/medium/"+mediumId,
					type:"POST",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: addCollectionItem -> data", data);
					resolve(data);
				})
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log("error: ", error);
			});
		},

		async addTag(mediumCollectionId, tagId) {
			// console.log("TCL: addTag -> mediumCollectionId, tagId", mediumCollectionId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+mediumCollectionId+"/tag/"+tagId,
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

		async updateMediaCollection(collectionModel) {
			console.log("TCL: updateMediaCollection -> collection", collectionModel);
			var tempCollection = {
					id: collectionModel.id,
					isSystemic: collectionModel.isSystemic,
					title: collectionModel.title,
					note: collectionModel.note,
					tags: collectionModel.tags
			};
			delete tempCollection.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+collectionModel.id,
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
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateMediumCollectionSubtype(type, collection) {
			console.log("TCL: updateMediaCollectionSubtype -> type, collection", type, collection);
			delete collection.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+type+"/"+collection.mediaCollectionId,
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
				.fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		removeMediaCollection(collection) {
			console.log("TCL: removeMediaCollection -> collection", collection);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+collection.id,
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

		async removeCollectionItem(collectionId, mediumId) {
      console.log("TCL: removeCollectionItem -> collectionId, mediumId", collectionId, mediumId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+collectionId+"/medium/"+mediumId,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
        	console.log("TCL: removeCollectionItem -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log("error: ", error);
			});
		},

		async removeTag(mediumCollectionId, tagId) {
			// console.log("TCL: removeTag -> mediumCollectionId, tagName", mediumCollectionId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+mediumCollectionId+"/tag/"+tagId,
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
