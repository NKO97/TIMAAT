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

  TIMAAT.RoleService = {

    listRoles(callback) {
      jQuery.ajax({
        url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/list",
        type:"GET",
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
        },
      }).done(function(data) {
        // console.log("TCL: listRoles -> data", data);
        callback(data);
      }).fail(function(e) {
        console.log(e.responseText);
        console.log( "error", e );
      });			
    },

    listRoleGroups(callback) {
      jQuery.ajax({
        url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/group/list",
        type:"GET",
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
        },
      }).done(function(data) {
        // console.log("TCL: listRoleGroups -> data", data);
        callback(data);
      }).fail(function(e) {
        console.log(e.responseText);
        console.log( "error", e );
      });			
    },

    async createRoleOrRoleGroup(type) {
			console.log("TCL: async createRoleOrRoleGroup -> type", type);
			var path = '';
			if (type == 'rolegroup') { 
				path = '/group';
			}
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role"+path+"/0",
					type:"POST",
					// data: JSON.stringify(model),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createRoleOrRoleGroup -> returning data", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
    },

    async addTranslation(type, model) {
      // console.log("TCL: async createTranslation -> type, model", type, model);
      var path = '';
      var translation = {};
			switch (type) {
				case 'role':
					translation = model.roleTranslations[0];
				break;
				case 'rolegroup':
					path = '/group';
					translation = model.roleGroupTranslations[0];
				break;
			}
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role"+path+"/"+model.id+"/translation/"+translation.id,
					type:"POST",
					data: JSON.stringify(translation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createTranslation -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
    },

    async updateTranslation(type, translation, roleOrRoleGroupId) {
      console.log("TCL: async updateTranslation -> type, translation, roleOrRoleGroupId", type, translation, roleOrRoleGroupId);
      var path = '';
			if ( type == 'rolegroup') path = '/group';
			var tempTranslation = {
				id: translation.id,
				name: translation.name,
				// role: {
				// 	id: roleOrRoleGroupId
				// },
				language: {
					id: translation.language.id
				}
			};

			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role"+path+"/translation/"+translation.id,
					type:"PATCH",
					data: JSON.stringify(tempTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: async updateTranslation -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
    },

    async deleteRoleOrRoleGroup(type, roleOrRoleGroup) {
			// console.log("TCL: deleteRoleOrRoleGroup -> type, roleOrRoleGroup", type, roleOrRoleGroup);
			var path = '';
			if (type == 'rolegroup') { 
				path = '/group';
			}
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role"+path+"/"+roleOrRoleGroup.model.id,
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

  }
}, window));