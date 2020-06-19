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
		
		getAllCategorySets: function(callback) {
    // console.log("TCL: getAllCategorySets: function(callback)");
    // console.log("TCL: callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/set/all",
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
    
    addCategory(set, catname, callback) {
			var serviceEndpoint = "category";

			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/"+serviceEndpoint+"/set/"+set.model.id+"/category/"+catname,
				type:"POST",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				TIMAAT.Service.updateCategorySets(catname);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

		removeCategory(set, catname, callback) {
			var serviceEndpoint = "category"; // set/{id}/category/{name}
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/"+serviceEndpoint+"/set/"+set.model.id+"/category/"+catname,
				type:"DELETE",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				TIMAAT.Service.updateCategorySets(catname);
				callback(catname);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		updateCategorySets(categoryname) {
			console.log("TCL: updateCategorySets -> categoryname", categoryname);
			// TODO implement for updating unassigned categories
		},
			
		createCategorySet(name, callback) {
			console.log("TCL: createCategorySet -> createCategorySet(name, callback)");
			console.log("TCL:   -> createCategorySet -> name", name);
			// console.log("TCL: createCategorySet -> callback", callback);
			// console.log("TCL: createCategorySet -> name, callback", name, callback);
			var model = {
					"id": 0,
					"name": name,
					"categorySetHasCategories": [],
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/set/",
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
		
		updateCategorySet(categoryset) {
			console.log("TCL: updateCategorySet -> categoryset", categoryset);
			var set = {
					id: categoryset.model.id,
					name: categoryset.model.name,
					categorySetHasCategories: []
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/set/"+set.id,
				type:"PATCH",
				data: JSON.stringify(set),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TODO refactor
				categoryset.model.id = data.id;
				categoryset.model.name = data.name;
				categoryset.model.categories = data.categories;
				console.log("TCL: updateCategorySet -> categoryset.updateUI()");
				categoryset.updateUI();        
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		deleteCategorySet(categoryset) {
			console.log("TCL: deleteCategorySet -> categoryset", categoryset);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/set/"+categoryset.model.id,
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

		deleteCategory(id) {
			console.log("TCL: removeCategory -> id", id);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/"+id,
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
