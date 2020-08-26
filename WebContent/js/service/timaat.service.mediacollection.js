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

		createMediaCollection(title, comment, callback) {
      console.log("TCL: createMediaCollection -> title, comment, callback", title, comment, callback);
			var model = {
					id: 0,
					isSystemic: 0,
					title: title,
					note: comment,
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

		updateMediaCollection(collection) {
			console.log("TCL: updatMediaCollection -> collection", collection);
			var col = {
					id: collection.id,
					isSystemic: 0,
					title: collection.title,
					note: collection.note,
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+col.id,
				type:"PATCH",
				data: JSON.stringify(col),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TODO refactor
				collection.id = data.id;
				collection.title = data.title;
				collection.note = data.note;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeMediaCollection(collection) {
			console.log("TCL: removeMediaCollection -> collection", collection);
			var col = collection;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+col.id,
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

		addCollectionItem(collection, medium) {
			console.log("TCL: addCollectionItem -> collection", collection);
			console.log("TCL: addCollectionItem -> medium", medium);
			var col = collection;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+col.id+"/medium/"+medium.id,
				type:"POST",
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

		async removeCollectionItem(collection, medium) {
			console.log("TCL: removeCollectionItem -> collection", collection);
			console.log("TCL: removeCollectionItem -> medium", medium);
			var col = collection;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/mediaCollection/"+col.id+"/medium/"+medium.id,
					type:"DELETE",
					contentType:"application/json; charset=utf-8",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: removed medium from collection");
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
