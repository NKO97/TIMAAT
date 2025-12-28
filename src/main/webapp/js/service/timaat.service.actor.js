/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
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

	TIMAAT.ActorService = {

		listActorTypes(callback) {
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/actorType/list",
				type       : "GET",
				contentType: "application/json; charset=utf-8",
				dataType   : "json",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(error) {
				console.error("ERROR responseText: ", error.responseText);
				console.error("ERROR: ", error);
			});
		},

		//* not used anymore
		listActors(callback) {
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/list",
				type       : "GET",
				contentType: "application/json; charset=utf-8",
				dataType   : "json",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: listActors -> data", data);
				callback(data);
			}).fail(function(error) {
				console.error("ERROR responseText: ", error.responseText);
				console.error("ERROR: ", error);
			});
		},

		async getActorDatasetsTotal() {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/total",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getActorDatasetsTotal -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getActor(id) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+id,
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getActor -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

        async getActorCategorySets(id) {
            return new Promise(resolve => {
                $.ajax({
                    url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/" +id + "/categorySets",
                    type       : "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType   : "json",
                    beforeSend : function (xhr) {
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

        async updateActorCategorySets(id, categorySetIds){
            const payload = {
                categorySetIds
            }
            return new Promise(resolve => {
                $.ajax({
                    url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/" +id + "/categorySets",
                    type       : "PUT",
                    contentType: "application/json; charset=utf-8",
                    data       : JSON.stringify(payload),
                    dataType   : "json",
                    beforeSend : function (xhr) {
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
        async getActorCategories(id) {
            return new Promise(resolve => {
                $.ajax({
                    url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/" +id + "/categories",
                    type       : "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType   : "json",
                    beforeSend : function (xhr) {
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

        async updateActorCategories(id, categoryIds){
            const payload = {
                categoryIds
            }
            return new Promise(resolve => {
                $.ajax({
                    url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/" +id + "/categories",
                    type       : "PUT",
                    contentType: "application/json; charset=utf-8",
                    data       : JSON.stringify(payload),
                    dataType   : "json",
                    beforeSend : function (xhr) {
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
		async getActorName(id) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+id+"/name",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getActorName -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getTagList(actorId) {
      // console.log("TCL: getTagList -> for actorId", actorId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/hasTagList/",
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

		listActorSubtype(actorSubtype, callback) {
			// console.log("TCL: listActorSubtype", actorSubtype);
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/list",
				type       : "GET",
				contentType: "application/json; charset=utf-8",
				dataType   : "json",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: listActorSubtype -> data", data);
				callback(data);
			})
			.fail(function(error) {
				console.error("ERROR responseText: ", error.responseText);
				console.error("ERROR: ", error);
			});
		},

		async getActorSubtypeDatasetsTotal(actorSubtype) {
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/total",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getMediaDatasetsTotal -> data", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText: ", error.responseText);
					console.error("ERROR: ", error);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async getCollectiveSelectList() {
			return new Promise(resolve => {
				// console.log("TCL: getCollectiveSelectList", getCollectiveSelectList);
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/collective/selectList",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getCollectiveSelectList -> data", data);
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

		async getActorHasRoleList(id) {
			// console.log("TCL: getActorRolesList -> id: ", id);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+id+"/role/list/",
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

		async getActorRoleInMediumList(actorId, roleId) {
			// console.log("TCL: getActorRoleInMediumList -> actorId, roleId: ", actorId, roleId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/role/"+roleId+"/list/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getActorRoleInMediumList -> data", data);
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

		async getActorsWithThisRoleList(roleId) {
			// console.log("TCL: getActorsWithThisRoleList -> roleId: ", roleId);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/withRole/"+roleId,
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

		async getActorHasImageList(id) {
			// console.log("TCL: getActorHasImageList -> id: ", id);
			return new Promise(resolve => {
				jQuery.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+id+"/image/list/",
					type       : "GET",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getActorHasImageList -> data", data);
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

		listAddressTypes(callback) {
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/addressType/list",
				type       : "GET",
				contentType: "application/json; charset=utf-8",
				dataType   : "json",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: listAddressTypes -> data", data);
				callback(data);
			})
			.fail(function(error) {
				console.error("ERROR responseText: ", error.responseText);
				console.error("ERROR: ", error);
			});
		},

		listEmailAddressTypes(callback) {
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailAddressType/list",
				type       : "GET",
				contentType: "application/json; charset=utf-8",
				dataType   : "json",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: listEmailAddressTypes -> data", data);
				callback(data);
			})
			.fail(function(error) {
				console.error("ERROR responseText: ", error.responseText);
				console.error("ERROR: ", error);
			});
		},

		listPhoneNumberTypes(callback) {
			jQuery.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phoneNumberType/list",
				type       : "GET",
				contentType: "application/json; charset=utf-8",
				dataType   : "json",
				beforeSend : function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: listPhoneNumberTypes -> data", data);
				callback(data);
			})
			.fail(function(error) {
				console.error("ERROR responseText: ", error.responseText);
				console.error("ERROR: ", error);
			});
		},

		async createActor(actorModel) {
			// console.log("TCL: async createActor -> actorModel", actorModel);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/0",
					type       : "POST",
					data       : JSON.stringify(actorModel),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(actorData) {
					// console.log("TCL: createActor -> returning actorData", actorData);
					resolve(actorData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createActorSubtype(actorSubtype, actorModel, subtypeModel) {
      // console.log("TCL: createActorSubtype -> actorSubtype, actorModel, subtypeModel", actorSubtype, actorModel, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/"+actorModel.id,
					type       : "POST",
					data       : JSON.stringify(subtypeModel),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(subtypeData) {
					// console.log("TCL: createActorSubtype - returning subtypeData", subtypeData);
					resolve(subtypeData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createActorPersonTranslation(model, modelTranslation) {
      // console.log("TCL: createActorPersonTranslation -> async createActorPersonTranslation(model, modelTranslation)",  model, modelTranslation);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+model.id+"/translation/"+modelTranslation.id,
					type       : "POST",
					data       : JSON.stringify(modelTranslation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					resolve(translationData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createName(name) {
			// console.log("TCL: async createName -> name", name);
			// console.log("TCL: async createName -> JSON.stringify(name)", JSON.stringify(name));
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/name/"+name.id,
					type       : "POST",
					data       : JSON.stringify(name),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(nameData) {
					// console.log("TCL: createName -> nameData", nameData);
					resolve(nameData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addName(actorId, name) {
      // console.log("TCL: addName -> name", name);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/name/"+name.id,
					type       : "POST",
					data       : JSON.stringify(name),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(nameData) {
					// console.log("TCL: addName -> nameData", nameData);
					resolve(nameData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createAddress(address) {
			// console.log("TCL: async createAddress -> address", address);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/address/"+address.id,
					type       : "POST",
					data       : JSON.stringify(address),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(addressData) {
					// console.log("TCL: createAddress -> addressData", addressData);
					resolve(addressData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addAddress(actorId, address) {
      // console.log("TCL: addAddress -> actorId, address", actorId, address);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/address/"+address.id,
					type       : "POST",
					data       : JSON.stringify(address),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(addressData) {
					// console.log("TCL: addAddress -> addressData", addressData);
					resolve(addressData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		// async addActorHasAddress(actorId, actorHasAddress) {
    //   // console.log("TCL: addActorHasAddress -> actorId, actorHasAddress", actorId, actorHasAddress);
		// 	return new Promise(resolve => {
		// 		$.ajax({
		// 			url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/actorHasAddress/"+actorHasAddress.address.id,
		// 			type       : "POST",
		// 			data       : JSON.stringify(actorHasAddress),
		// 			contentType: "application/json; charset=utf-8",
		// 			dataType   : "json",
		// 			beforeSend : function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		}).done(function(actorHasAddressData) {
		// 			// console.log("TCL: addActorHasAddress -> actorHasAddressData", actorHasAddressData);
		// 			resolve(actorHasAddressData);
		// 		}).fail(function(error) {
		// 			console.error("ERROR responseText:", error.responseText);
		// 		});
		// 	}).catch((error) => {
		// 		console.error("ERROR: ", error);
		// 	});
		// },

		async createEmailAddress(emailAddress) {
			// console.log("TCL: async createEmailAddress -> emailAddress", emailAddress);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailAddress/"+emailAddress.id,
					type       : "POST",
					data       : JSON.stringify(emailAddress),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(emailAddressData) {
					// console.log("TCL: createEmailAddress -> emailAddressData", emailAddressData);
					resolve(emailAddressData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addEmailAddress(actorId, emailAddress) {
      // console.log("TCL: addEmailAddress -> actorId, emailAddress", actorId, emailAddress);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/emailAddress/"+emailAddress.id,
					type       : "POST",
					data       : JSON.stringify(emailAddress),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(emailAddressData) {
					// console.log("TCL: addEmailAddress -> emailAddressData", emailAddressData);
					resolve(emailAddressData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addActorHasEmailAddress(actorId, actorHasEmailAddress) {
      // console.log("TCL: addActorHasEmailAddress -> actorId, actorHasEmailAddress", actorId, actorHasEmailAddress);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/actorHasEmailAddress/"+actorHasEmailAddress.emailAddress.id,
					type       : "POST",
					data       : JSON.stringify(actorHasEmailAddress),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(actorHasEmailAddressData) {
					// console.log("TCL: addActorHasEmailAddress -> actorHasEmailAddressData", actorHasEmailAddressData);
					resolve(actorHasEmailAddressData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createPhoneNumber(phoneNumber) {
			// console.log("TCL: async createPhoneNumber -> phoneNumber", phoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phoneNumber/"+phoneNumber.id,
					type       : "POST",
					data       : JSON.stringify(phoneNumber),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(phoneNumberData) {
					// console.log("TCL: createPhoneNumber -> phoneNumberData", phoneNumberData);
					resolve(phoneNumberData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addPhoneNumber(actorId, phoneNumber) {
      // console.log("TCL: addPhoneNumber -> actorId, phoneNumber", actorId, phoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/phoneNumber/"+phoneNumber.id,
					type       : "POST",
					data       : JSON.stringify(phoneNumber),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(phoneNumberData) {
					// console.log("TCL: addPhoneNumber -> phoneNumberData", phoneNumberData);
					resolve(phoneNumberData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addActorHasPhoneNumber(actorId, actorHasPhoneNumber) {
      // console.log("TCL: addActorHasPhoneNumber -> actorId, actorHasPhoneNumber", actorId, actorHasPhoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/actorHasPhoneNumber/"+actorHasPhoneNumber.phoneNumber.id,
					type       : "POST",
					data       : JSON.stringify(actorHasPhoneNumber),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(actorHasPhoneNumberData) {
					// console.log("TCL: addActorHasPhoneNumber -> actorHasPhoneNumberData", actorHasPhoneNumberData);
					resolve(actorHasPhoneNumberData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addPersonIsMemberOfCollective(actorId, collectiveId) {
      // console.log("TCL: addPersonIsMemberOfCollective -> actorId, collectiveId", actorId, collectiveId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/personIsMemberOfCollective/"+collectiveId,
					type       : "POST",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(personIsMemberOfCollectiveData) {
					// console.log("TCL: addPersonIsMemberOfCollective -> personIsMemberOfCollectiveData", personIsMemberOfCollectiveData);
					resolve(personIsMemberOfCollectiveData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addMembershipDetails(actorId, collectiveId, membershipDetails) {
      // console.log("TCL: addMembershipDetails -> actorId, collectiveId, membershipDetails", actorId, collectiveId, membershipDetails);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/"+collectiveId+"/membershipDetails/"+membershipDetails.id,
					type       : "POST",
					data       : JSON.stringify(membershipDetails),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: addMembershipDetails -> membershipDetails", data);
					resolve(data);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async createCitizenship(citizenship) {
      // console.log("TCL: createCitizenship -> citizenship", citizenship);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/citizenship/"+citizenship.id+"/"+citizenship.citizenshipTranslations[0].language.id,
					type       : "POST",
					data       : JSON.stringify(citizenship),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(citizenshipData) {
					// console.log("TCL: createCitizenship -> citizenshipData", citizenshipData);
					resolve(citizenshipData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addCitizenship(actorId, citizenship) {
      // console.log("TCL: addCitizenship -> actorId, citizenship", actorId, citizenship);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/citizenship/"+citizenship.id,
					type       : "POST",
					data       : JSON.stringify(citizenship),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(citizenshipData) {
					// console.log("TCL: addCitizenship -> citizenshipData", citizenshipData);
					resolve(citizenshipData);
				}).fail(function(error) {
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async addTag(actorId, tagId) {
			// console.log("TCL: addTag -> actorId, tagId", actorId, tagId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/tag/"+tagId,
					type       : "POST",
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
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

		async updateActor(actorModel) {
			// console.log("TCL: ActorService: async updateActor -> actorModel", actorModel);
			delete actorModel.ui;
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorModel.id,
					type       : "PATCH",
					data       : JSON.stringify(actorModel),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActor -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		// not yet needed (no translation data or translation table available at the moment)
		async updateActorTranslation(actor) {
			// console.log("TCL: ActorService async updateActorTranslation -> actor", actor);
			var updatedActorTranslation = {
				id: actor.model.actorTranslations[0].id, // TODO get the correct translation_id
				name: actor.model.actorTranslations[0].name,
			};
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actor.model.id+"/translation/"+updatedActorTranslation.id,
					type       : "PATCH",
					data       : JSON.stringify(updatedActorTranslation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
				// console.log("TCL: updateActorTranslation -> translationData", translationData);
					resolve(translationData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateActorSubtype(actorSubtype, subtypeModel) {
			// console.log("TCL: updateActorSubtype -> actorSubtype, subtypeModel", actorSubtype, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/"+subtypeModel.actorId,
					type       : "PATCH",
					data       : JSON.stringify(subtypeModel),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActorSubtype -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateActorPersonTranslation(actorId, personTranslation) {
      // console.log("TCL: async updateActorLocationTranslation -> actorId, updatedActorLocationTranslation", actorId, personTranslation);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/translation/"+personTranslation.id,
					type       : "PATCH",
					data       : JSON.stringify(personTranslation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					resolve(translationData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateName(name) {
			// console.log("TCL: async updateName -> name", name);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/name/"+name.id,
					type       : "PATCH",
					data       : JSON.stringify(name),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateName -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateAddress(address) {
			// console.log("TCL: async updateAddress -> address", address);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/address/"+address.id,
					type       : "PATCH",
					data       : JSON.stringify(address),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateActorHasAddress(actorId, addressId, actorHasAddress) {
			// console.log("TCL: async updateActorHasAddress -> actorHasAddress", actorHasAddress);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/address/"+addressId,
					type       : "PATCH",
					data       : JSON.stringify(actorHasAddress),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActorHasAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateEmailAddress(emailAddress) {
			// console.log("TCL: async updateEmailAddress -> emailAddress", emailAddress);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailAddress/"+emailAddress.id,
					type       : "PATCH",
					data       : JSON.stringify(emailAddress),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateEmailAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateActorHasEmailAddress(actorId, emailAddressId, actorHasEmailAddress) {
			// console.log("TCL: async updateActorHasEmailAddress -> actorHasEmailAddress", actorHasEmailAddress);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/emailAddress/"+emailAddressId,
					type       : "PATCH",
					data       : JSON.stringify(actorHasEmailAddress),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActorHasEmailAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updatePhoneNumber(phoneNumber) {
			// console.log("TCL: async updatePhoneNumber -> phoneNumber", phoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phoneNumber/"+phoneNumber.id,
					type       : "PATCH",
					data       : JSON.stringify(phoneNumber),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updatePhoneNumber -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateActorHasPhoneNumber(actorId, phoneNumberId, actorHasPhoneNumber) {
			// console.log("TCL: async updateActorHasPhoneNumber -> actorHasPhoneNumber", actorHasPhoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/phoneNumber/"+phoneNumberId,
					type       : "PATCH",
					data       : JSON.stringify(actorHasPhoneNumber),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActorHasPhoneNumber -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		//? not in use
		// async updatePersonIsMemberOfCollective(personIsMemberOfCollective) {
		// 	// console.log("TCL: async updatePersonIsMemberOfCollective -> personIsMemberOfCollective", personIsMemberOfCollective);
		// 	return new Promise(resolve => {
		// 		$.ajax({
		// 			url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+personIsMemberOfCollective.id.actorPersonActorId+"/personIsMemberOfCollective/"+personIsMemberOfCollective.id.memberOfActorCollectiveActorId,
		// 			type       : "PATCH",
		// 			data       : JSON.stringify(personIsMemberOfCollective),
		// 			contentType: "application/json; charset=utf-8",
		// 			dataType   : "json",
		// 			beforeSend : function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		}).done(function(updateData) {
		// 			// console.log("TCL: async updatePersonIsMemberOfCollective -> updateData", updateData);
		// 			resolve(updateData);
		// 		}).fail(function(error) {
		// 			console.error("ERROR: ", error);
		// 			console.error("ERROR responseText:", error.responseText);
		// 		});
		// 	}).catch((error) => {
		// 		console.error("ERROR: ", error);
		// 	});
		// },

		async updateMembershipDetails(membershipDetailsData) {
			// console.log("TCL: async updateMembershipDetails -> actorId, collectiveId, membershipDetailsData", membershipDetailsData);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/membershipDetails/"+membershipDetailsData.id,
					type       : "PATCH",
					data       : JSON.stringify(membershipDetailsData),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateMembership -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async updateCitizenshipTranslation(citizenshipTranslation, languageId) {
			// console.log("TCL: async updateCitizenship -> citizenshipTranslation, languageId", citizenshipTranslation, languageId);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/citizenship/"+citizenshipTranslation.id+"/"+languageId,
					type       : "PATCH",
					data       : JSON.stringify(citizenshipTranslation),
					contentType: "application/json; charset=utf-8",
					dataType   : "json",
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateCitizenship -> updateData", updateData);
					resolve(updateData);
				}).fail(function(error) {
					console.error("ERROR: ", error);
					console.error("ERROR responseText:", error.responseText);
				});
			}).catch((error) => {
				console.error("ERROR: ", error);
			});
		},

		async removeActor(actor) {
			// console.log("TCL: removeActor -> actor", actor);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actor.model.id,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					beforeSend : function (xhr) {
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

		removeActorSubtype(subtype, subtypeData) {
      // console.log("TCL: removeActorSubtype -> subtype, subtypeData", subtype, subtypeData);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+subtype+"/"+subtypeData.model.actorId,
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

		removeName(name) {
			// console.log("TCL: removeName -> name", name);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/name/"+name.id,
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

		removeAddress(address) {
			// console.log("TCL: removeAddress -> address", address);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/address/"+address.id,
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

		removeEmailAddress(emailAddress) {
			// console.log("TCL: removeEmailAddress -> emailAddress", emailAddress);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailAddress/"+emailAddress.id,
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

		removePhoneNumber(phoneNumber) {
			// console.log("TCL: removePhoneNumber -> phoneNumber", phoneNumber);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phoneNumber/"+phoneNumber.id,
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

		async removeMemberOfCollective(memberOfCollective) {
			// console.log("TCL: removeMemberOfCollective -> memberOfCollective", memberOfCollective);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+memberOfCollective.id.actorPersonActorId+"/personIsMemberOfCollective/"+memberOfCollective.id.memberOfActorCollectiveActorId,
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

		async removeMembershipDetails(membershipDetails) {
			// console.log("TCL: removeMembershipDetails -> removeMembershipDetails", membershipDetails);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/membershipDetails/"+membershipDetails.id,
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

		removeCitizenship(citizenship) {
			// console.log("TCL: removeCitizenship -> citizenship", citizenship);
			$.ajax({
				url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/citizenship/"+citizenship.id,
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

		async removeTag(actorId, tagId) {
			// console.log("TCL: removeTag -> actorId, tagName", actorId, tagName);
			return new Promise(resolve => {
				$.ajax({
					url        : window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/tag/"+tagId,
					type       : "DELETE",
					contentType: "application/json; charset=utf-8",
					beforeSend : function (xhr) {
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
