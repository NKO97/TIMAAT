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
	
	TIMAAT.LocationService = {

		listLocationTypes(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/locationtype/list",
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

		listLocations(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/list",
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

		listLocationSubtype(locationSubtype, callback) {
      // console.log("TCL: listLocationSubtype -> locationSubtype", locationSubtype);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      // console.log("TCL: listLocationSubtype -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
			
		},

		async createLocation(locationModel) {
			var newLocationModel = {
				id: 0,
				locationType: {
					id: locationModel.locationType.id,
				}
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationModel.id,
					type:"POST",
					data: JSON.stringify(newLocationModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(locationData) {
					resolve(locationData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createLocationTranslation(model, modelTranslation) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+model.id+"/translation/"+modelTranslation.id,
					type:"POST",
					data: JSON.stringify(modelTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createLocationSubtype(locationSubtype, locationModel, subtypeModel) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/"+locationModel.id,
					type:"POST",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(subtypeData) {
						resolve(subtypeData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateLocation(locationModel) {
      console.log("TCL: updateLocation -> locationModel", locationModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationModel.id,
					type:"PATCH",
					data: JSON.stringify(locationModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateLocationTranslation(locationId, locationTranslation) {
      console.log("TCL: async updateLocationTranslation -> locationId, updatedLocationTranslation", locationId, locationTranslation);
			// var updatedLocationTranslation = {
			// 	id: location.model.locationTranslations[0].id, // TODO get the correct translation_id
			// 	name: location.model.locationTranslations[0].name,
			// };
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationId+"/translation/"+locationTranslation.id,
					type:"PATCH",
					data: JSON.stringify(locationTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateLocationSubtype(locationSubtype, subtypeModel) {
			console.log("TCL: async updateLocationSubtype -> locationSubtype, subtypeModel", locationSubtype, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/"+subtypeModel.locationId,
					type:"PATCH",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
				console.log("TCL: async updateLocationSubtype -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		removeLocation(location) {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+location.model.id,
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

		removeSubtype(locationSubtype, subtype) {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/"+subtype.model.locationId,
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

	}
	
}, window));
