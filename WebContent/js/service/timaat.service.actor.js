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
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/actortype/list",
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

		listActors(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				console.log("TCL: listActors -> data", data);
				callback(data);
			}).fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		async getActorDatasetsTotal() {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/total",
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getActorDatasetsTotal -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async getActor(id) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+id,
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getActor -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		listActorSubtype(actorSubtype, callback) {
			// console.log("TCL: listActorSubtype", actorSubtype);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/list",
				type:"GET",
				// data: JSON.stringify(actorType),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: listActorSubtype -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		async getActorSubtypeDatasetsTotal(actorSubtype) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/total",
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: getMediaDatasetsTotal -> data", data);
					resolve(data);
				}).fail(function(e) {
					console.log(e.responseText);
					console.log( "error", e );
				});	
			}).catch((error) => {
				console.log( "error: ", error );
			});		
		},

		async getCollectiveSelectList() {
			return new Promise(resolve => {
				// console.log("TCL: getCollectiveSelectList", getCollectiveSelectList);
				jQuery.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/collective/selectlist",
					type:"GET",
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					// console.log("TCL: getCollectiveSelectList -> data", data);
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

		async getActorHasRoleList(id) {
			console.log("TCL: getActorRolesList -> id: ", id);
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
					console.log("TCL: getActorRolesList -> data", data);
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

		listAddressTypes(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/addresstype/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: listAddressTypes -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		listEmailAddressTypes(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailaddresstype/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: listEmailAddressTypes -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		listPhoneNumberTypes(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phonenumbertype/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: listPhoneNumberTypes -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log(e.responseText);
				console.log( "error", e );
			});			
		},

		async createActor(actorModel) {
			// console.log("TCL: async createActor -> actorModel", actorModel);
			var newActorModel = {
				id: 0,
				actorType: {
					id: actorModel.actorType.id,
				},
				isFictional: actorModel.isFictional,
			};
      console.log("TCL: createActor -> newActorModel", newActorModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/0",
					type:"POST",
					data: JSON.stringify(newActorModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(actorData) {
					// console.log("TCL: createActor -> returning actorData", actorData);
					resolve(actorData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createActorSubtype(actorSubtype, actorModel, subtypeModel) {
      // console.log("TCL: createActorSubtype -> actorSubtype, actorModel, subtypeModel", actorSubtype, actorModel, subtypeModel);			
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/"+actorModel.id,
					type:"POST",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(subtypeData) {
					// console.log("TCL: createActorSubtype - returning subtypeData", subtypeData);
					resolve(subtypeData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createActorPersonTranslation(model, modelTranslation) {
      // console.log("TCL: createActorPersonTranslation -> async createActorPersonTranslation(model, modelTranslation)",  model, modelTranslation);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+model.id+"/translation/"+modelTranslation.id,
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

		async createName(name) {
			// console.log("TCL: async createName -> name", name);
			// console.log("TCL: async createName -> JSON.stringify(name)", JSON.stringify(name));
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/name/"+name.id,
					type:"POST",
					data: JSON.stringify(name),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(nameData) {
					// console.log("TCL: createName -> nameData", nameData);
					resolve(nameData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addName(actorId, name) {
      console.log("TCL: addName -> name", name);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/name/"+name.id,
					type:"POST",
					data: JSON.stringify(name),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(nameData) {
					// console.log("TCL: addName -> nameData", nameData);
					resolve(nameData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createAddress(address) {
			// console.log("TCL: async createAddress -> address", address);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/address/"+address.id,
					type:"POST",
					data: JSON.stringify(address),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(addressData) {
					// console.log("TCL: createAddress -> addressData", addressData);
					resolve(addressData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addAddress(actorId, address) {
      // console.log("TCL: addAddress -> actorId, address", actorId, address);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/address/"+address.id,
					type:"POST",
					data: JSON.stringify(address),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(addressData) {
					// console.log("TCL: addAddress -> addressData", addressData);
					resolve(addressData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		// async addActorHasAddress(actorId, actorHasAddress) {
    //   // console.log("TCL: addActorHasAddress -> actorId, actorHasAddress", actorId, actorHasAddress);
		// 	return new Promise(resolve => {
		// 		$.ajax({
		// 			url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/actorhasaddress/"+actorHasAddress.address.id,
		// 			type:"POST",
		// 			data: JSON.stringify(actorHasAddress),
		// 			contentType:"application/json; charset=utf-8",
		// 			dataType:"json",
		// 			beforeSend: function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		}).done(function(actorHasAddressData) {
		// 			// console.log("TCL: addActorHasAddress -> actorHasAddressData", actorHasAddressData);
		// 			resolve(actorHasAddressData);
		// 		}).fail(function(e) {
		// 			console.log( "error: ", e.responseText );
		// 		});
		// 	}).catch((error) => {
		// 		console.log( "error: ", error );
		// 	});
		// },

		async createEmailAddress(emailAddress) {
			// console.log("TCL: async createEmailAddress -> emailAddress", emailAddress);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailaddress/"+emailAddress.id,
					type:"POST",
					data: JSON.stringify(emailAddress),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(emailAddressData) {
					// console.log("TCL: createEmailAddress -> emailAddressData", emailAddressData);
					resolve(emailAddressData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addEmailAddress(actorId, emailAddress) {
      // console.log("TCL: addEmailAddress -> actorId, emailAddress", actorId, emailAddress);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/emailaddress/"+emailAddress.id,
					type:"POST",
					data: JSON.stringify(emailAddress),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(emailAddressData) {
					// console.log("TCL: addEmailAddress -> emailAddressData", emailAddressData);
					resolve(emailAddressData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addActorHasEmailAddress(actorId, actorHasEmailAddress) {
      // console.log("TCL: addActorHasEmailAddress -> actorId, actorHasEmailAddress", actorId, actorHasEmailAddress);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/actorhasemailaddress/"+actorHasEmailAddress.emailAddress.id,
					type:"POST",
					data: JSON.stringify(actorHasEmailAddress),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(actorHasEmailAddressData) {
					// console.log("TCL: addActorHasEmailAddress -> actorHasEmailAddressData", actorHasEmailAddressData);
					resolve(actorHasEmailAddressData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createPhoneNumber(phoneNumber) {
			// console.log("TCL: async createPhoneNumber -> phoneNumber", phoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phonenumber/"+phoneNumber.id,
					type:"POST",
					data: JSON.stringify(phoneNumber),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(phoneNumberData) {
					// console.log("TCL: createPhoneNumber -> phoneNumberData", phoneNumberData);
					resolve(phoneNumberData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addPhoneNumber(actorId, phoneNumber) {
      // console.log("TCL: addPhoneNumber -> actorId, phoneNumber", actorId, phoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/phonenumber/"+phoneNumber.id,
					type:"POST",
					data: JSON.stringify(phoneNumber),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(phoneNumberData) {
					// console.log("TCL: addPhoneNumber -> phoneNumberData", phoneNumberData);
					resolve(phoneNumberData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addActorHasPhoneNumber(actorId, actorHasPhoneNumber) {
      // console.log("TCL: addActorHasPhoneNumber -> actorId, actorHasPhoneNumber", actorId, actorHasPhoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/actorhasphonenumber/"+actorHasPhoneNumber.phoneNumber.id,
					type:"POST",
					data: JSON.stringify(actorHasPhoneNumber),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(actorHasPhoneNumberData) {
					// console.log("TCL: addActorHasPhoneNumber -> actorHasPhoneNumberData", actorHasPhoneNumberData);
					resolve(actorHasPhoneNumberData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addPersonIsMemberOfCollective(actorId, collectiveId) {
      console.log("TCL: addpersonIsMemberOfCollective -> actorId, collectiveId", actorId, collectiveId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/personismemberofcollective/"+collectiveId,
					type:"POST",
					// data: JSON.stringify(tempPersonIsMemberOfCollectiveData),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(personIsMemberOfCollectiveData) {
					// console.log("TCL: addpersonIsMemberOfCollective -> personIsMemberOfCollectiveData", personIsMemberOfCollectiveData);
					resolve(personIsMemberOfCollectiveData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async addMembershipDetails(actorId, collectiveId, membershipDetails) {
      console.log("TCL: addMembershipDetails -> actorId, collectiveId, membershipDetails", actorId, collectiveId, membershipDetails);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/"+collectiveId+"/membershipdetails/"+membershipDetails.id,
					type:"POST",
					data: JSON.stringify(membershipDetails),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					console.log("TCL: addMembershipDetails -> membershipDetails", data);
					resolve(data);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createCitizenship(citizenship) {
      // console.log("TCL: createCitizenship -> citizenship", citizenship);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/citizenship/"+citizenship.id+"/"+citizenship.citizenshipTranslations[0].language.id,
					type:"POST",
					data: JSON.stringify(citizenship),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(citizenshipData) {
					// console.log("TCL: createCitizenship -> citizenshipData", citizenshipData);
					resolve(citizenshipData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},
		
		async addCitizenship(actorId, citizenship) {
      // console.log("TCL: addCitizenship -> actorId, citizenship", actorId, citizenship);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/citizenship/"+citizenship.id,
					type:"POST",
					data: JSON.stringify(citizenship),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(citizenshipData) {
					// console.log("TCL: addCitizenship -> citizenshipData", citizenshipData);
					resolve(citizenshipData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateActor(actorModel) {
			// console.log("TCL: ActorService: async updateActor -> actorModel", actorModel);
			var tempActorModel = {};
			tempActorModel.displayName = actorModel.displayName;
			tempActorModel.isFictional = actorModel.isFictional;
			tempActorModel.birthName = actorModel.birthName;
			tempActorModel.primaryAddress = actorModel.primaryAddress;
			tempActorModel.primaryEmailAddress = actorModel.primaryEmailAddress;
			tempActorModel.primaryPhoneNumber = actorModel.primaryPhoneNumber;
			tempActorModel.roles = actorModel.roles;
			// tempActorModel.actorNames = actorModel.actorNames;
      // console.log("TCL: updateActor -> tempActorModel", tempActorModel);
			// delete tempActorModel.ui;
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorModel.id,
					type:"PATCH",
					data: JSON.stringify(tempActorModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActor -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
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
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actor.model.id+"/translation/"+updatedActorTranslation.id,
					type:"PATCH",
					data: JSON.stringify(updatedActorTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
				// console.log("TCL: updateActorTranslation -> translationData", translationData);
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateActorSubtype(actorSubtype, subtypeModel) {
			// console.log("TCL: updateActorSubtype -> actorSubtype, subtypeModel", actorSubtype, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorSubtype+"/"+subtypeModel.actorId,
					type:"PATCH",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateActorSubtype -> returning updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateActorPersonTranslation(actorId, personTranslation) {
      // console.log("TCL: async updateActorLocationTranslation -> actorId, updatedActorLocationTranslation", actorId, personTranslation);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/translation/"+personTranslation.id,
					type:"PATCH",
					data: JSON.stringify(personTranslation),
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

		async updateName(name) {
			// console.log("TCL: async updateName -> name", name);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/name/"+name.id,
					type:"PATCH",
					data: JSON.stringify(name),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateName -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateAddress(address) {
			// console.log("TCL: async updateAddress -> address", address);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/address/"+address.id,
					type:"PATCH",
					data: JSON.stringify(address),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateActorHasAddress(actorId, addressId, actorHasAddress) {
			// console.log("TCL: async updateActorHasAddress -> actorHasAddress", actorHasAddress);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/address/"+addressId,
					type:"PATCH",
					data: JSON.stringify(actorHasAddress),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActorHasAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateEmailAddress(emailAddress) {
			// console.log("TCL: async updateEmailAddress -> emailAddress", emailAddress);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailaddress/"+emailAddress.id,
					type:"PATCH",
					data: JSON.stringify(emailAddress),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateEmailAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateActorHasEmailAddress(actorId, emailAddressId, actorHasEmailAddress) {
			// console.log("TCL: async updateActorHasEmailAddress -> actorHasEmailAddress", actorHasEmailAddress);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/emailaddress/"+emailAddressId,
					type:"PATCH",
					data: JSON.stringify(actorHasEmailAddress),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActorHasEmailAddress -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updatePhoneNumber(phoneNumber) {
			// console.log("TCL: async updatePhoneNumber -> phoneNumber", phoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phonenumber/"+phoneNumber.id,
					type:"PATCH",
					data: JSON.stringify(phoneNumber),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updatePhoneNumber -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateActorHasPhoneNumber(actorId, phoneNumberId, actorHasPhoneNumber) {
			// console.log("TCL: async updateActorHasPhoneNumber -> actorHasPhoneNumber", actorHasPhoneNumber);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actorId+"/phonenumber/"+phoneNumberId,
					type:"PATCH",
					data: JSON.stringify(actorHasPhoneNumber),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateActorHasPhoneNumber -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updatePersonIsMemberOfCollective(personIsMemberOfCollective) {
			// console.log("TCL: async updatepersonIsMemberOfCollective -> personIsMemberOfCollective", personIsMemberOfCollective);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+personIsMemberOfCollective.id.actorPersonActorId+"/personismemberofcollective/"+personIsMemberOfCollective.id.memberOfActorCollectiveActorId,
					type:"PATCH",
					data: JSON.stringify(personIsMemberOfCollective),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updatepersonIsMemberOfCollective -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateMembershipDetails(membershipDetailsData) {
			// console.log("TCL: async updateMembershipDetails -> actorId, collectiveId, membershipDetailsData", membershipDetailsData);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/membershipdetails/"+membershipDetailsData.id,
					type:"PATCH",
					data: JSON.stringify(membershipDetailsData),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateMembership -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateCitizenshipTranslation(citizenshipTranslation, languageId) {
			// console.log("TCL: async updateCitizenship -> citizenshipTranslation, languageId", citizenshipTranslation, languageId);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/citizenship/"+citizenshipTranslation.id+"/"+languageId,
					type:"PATCH",
					data: JSON.stringify(citizenshipTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					// console.log("TCL: async updateCitizenship -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async removeActor(actor) {
			// console.log("TCL: removeActor -> actor", actor);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actor.model.id,
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

		removeActorSubtype(subtype, subtypeData) {
      // console.log("TCL: removesubtypeData -> subtype, subtypeData", subtype, subtypeData);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+subtype+"/"+subtypeData.model.actorId,
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

		removeName(name) {
			// console.log("TCL: removeName -> name", name);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/name/"+name.id,
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

		removeAddress(address) {
			// console.log("TCL: removeAddress -> address", address);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/address/"+address.id,
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

		removeEmailAddress(emailAddress) {
			// console.log("TCL: removeEmailAddress -> emailAddress", emailAddress);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/emailaddress/"+emailAddress.id,
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

		removePhoneNumber(phoneNumber) {
			// console.log("TCL: removePhoneNumber -> phoneNumber", phoneNumber);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/phonenumber/"+phoneNumber.id,
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

		async removeMemberOfCollective(memberOfCollective) {
			console.log("TCL: removeMemberOfCollective -> memberOfCollective", memberOfCollective);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+memberOfCollective.id.actorPersonActorId+"/personismemberofcollective/"+memberOfCollective.id.memberOfActorCollectiveActorId,
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

		async removeMembershipDetails(membershipDetails) {
			console.log("TCL: removeMembershipDetails -> removeMembershipDetails", membershipDetails);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/membershipdetails/"+membershipDetails.id,
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

		removeCitizenship(citizenship) {
			// console.log("TCL: removeCitizenship -> citizenship", citizenship);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/citizenship/"+citizenship.id,
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
