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
        url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/list",
        type       : "GET",
        contentType: "application/json; charset=utf-8",
        dataType   : "json",
        beforeSend : function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
        },
      }).done(function(data) {
        // console.log("TCL: listRoles -> data", data);
        callback(data);
      }).fail(function(error) {
        console.error("ERROR responseText: ", error.responseText);
        console.error("ERROR: ", error);
      });			
    },

    listRoleGroups(callback) {
      jQuery.ajax({
        url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/list",
        type       : "GET",
        contentType: "application/json; charset=utf-8",
        dataType   : "json",
        beforeSend : function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
        },
      }).done(function(data) {
        // console.log("TCL: listRoleGroups -> data", data);
        callback(data);
      }).fail(function(error) {
        console.error("ERROR responseText: ", error.responseText);
        console.error("ERROR: ", error);
      });			
    },

    async createRole(model) {
			// console.log("TCL: async createRole(model)", model);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/0",
					type       : "POST",
					data       : JSON.stringify(model),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createRol -> returning data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createRoleGroup(model) {
			// console.log("TCL: async createRoleGroup(model)", model);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/0",
					type       : "POST",
					data       : JSON.stringify(model),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createRoleGroup -> returning data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},
		
		async getRoleHasRoleGroupList(id) {
			// console.log("TCL: getRoleHasRoleGroupList -> id: ", id);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/"+id+"/hasList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getRoleGroupHasRoleList -> data", data);
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

		async getRoleGroupHasRoleList(id) {
			// console.log("TCL: getRoleGroupHasRoleList -> id: ", id);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/"+id+"/hasList/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getRoleGroupHasRoleList -> data", data);
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

		async getRole(id) {
			// console.log("TCL: getRole -> id", id);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/"+id,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getRole -> data", data);
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

		async getRoleGroup(id) {
			// console.log("TCL: getRoleGroup -> id", id);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/"+id,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getRoleGroup -> data", data);
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

    async addRoleTranslation(model) {
      // console.log("TCL: async createTranslation -> model", model);
      var translation = model.roleTranslations[0];
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/"+model.id+"/translation/"+translation.id,
					type       : "POST",
					data       : JSON.stringify(translation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createTranslation -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addRoleGroupTranslation(model) {
      // console.log("TCL: async createTranslation -> model", model);
      var translation = model.roleGroupTranslations[0];
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/"+model.id+"/translation/"+translation.id,
					type       : "POST",
					data       : JSON.stringify(translation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: createTranslation -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		/** updates role groups belonging to role  */
		async updateRole(id) {
			// console.log("TCL: updateRole -> role id", id);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/"+id,
					type       : "PATCH",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		/** updates roles belonging to role groups*/
		async updateRoleGroup(model) {
			// console.log("TCL: updateRoleGroup -> model", model);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/"+model.id,
					type       : "PATCH",
					data       : JSON.stringify(model),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateRoleTranslation(translation) {
      // console.log("TCL: async updateRoleTranslation -> translation", translation);
			// TODO tempTranslation required?
			var tempTranslation = {
				id: translation.id,
				name: translation.name,
				language: {
					id: translation.language.id
				}
			};
      // console.log("TCL: updateRoleTranslation -> tempTranslation", tempTranslation);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/translation/"+translation.id,
					type       : "PATCH",
					data       : JSON.stringify(tempTranslation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: async updateRoleTranslation -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

    async updateRoleGroupTranslation(translation) {
      // console.log("TCL: async updateRoleGroupTranslation -> translation", translation);
			// TODO tempTranslation required?
			var tempTranslation = {
				id: translation.id,
				name: translation.name,
				language: {
					id: translation.language.id
				}
			};
      // console.log("TCL: updateRoleGroupTranslation -> tempTranslation", tempTranslation);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/translation/"+translation.id,
					type       : "PATCH",
					data       : JSON.stringify(tempTranslation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: async updateRoleGroupTranslation -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},
		
    async deleteRole(id) {
			// console.log("TCL: deleteRole -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/"+id,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
    },

		async deleteRoleGroup(id) {
			// console.log("TCL: deleteRoleGroup -> id", id);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/roleGroup/"+id,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
    },

  }
}, window));