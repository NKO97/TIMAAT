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

	TIMAAT.CategoryService = {

		async createCategory(model) {
			console.log("TCL: async createCategory -> model", model);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/0",
					type       : "POST",
					data       : JSON.stringify(model),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createCategory -> returning data", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async getCategory(id) {
			console.log("TCL: getCategory -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/"+id,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getCategory -> data", data);
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
		
		async getCategoryHasCategorySetList(id) {
			console.log("TCL: getCategoryHasCategorySetList -> id: ", id);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/"+id+"/hasList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getCategoryHasCategorySetList -> data", data);
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

		async getCategoryHasCategorySet(categoryId, categorySetId) {
      console.log("TCL: getCategoryHasCategorySet -> categoryId, categorySetId", categoryId, categorySetId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/"+categoryId+"/set/"+categorySetId,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getCategorySet -> data", data);
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

		/** updates categories belonging to categorysets */
		async updateCategory(category) {
      console.log("TCL: updateCategory -> category data: ", category);
			var path = ( type == 'category') ? '' : '/set';
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/"+category.id,
					type       : "PATCH",
					data       : JSON.stringify(category),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
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

		async updateCategory(category) {
      console.log("TCL: updateCategory -> category", category);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/"+category.id,
					type       : "PATCH",
					data       : JSON.stringify(category),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
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

		async deleteCategory(id) {
			console.log("TCL: deleteCategory -> id", id);
			var path = ( type == 'category') ? '' : '/set';
				return new Promise(resolve => {
					$.ajax({
						url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/"+id,
						type       : "DELETE",
						contentType: "application/json; charset=utf-8",
						beforeSend : function (xhr) {
							xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
						},
					}).done(function(data) {
						resolve(data);
					}).fail(function(e) {
						console.log( "error", e.responseText );
					});
				}).catch((error) => {
					console.log( "error: ", error);
				});
			},
		
	}
	
}, window));
