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
	
	TIMAAT.ActorDatasets = {
		actors: null,
		actorTypes: null,
		persons: null,
		collectives: null,
		names: null,
		actorHasAddresses: null,
		addressTypes: null,
		emailAddresses: null,
		phoneNumbers: null,

		init: function() {   
			TIMAAT.ActorDatasets.initActors();
			TIMAAT.ActorDatasets.initPersons();
			TIMAAT.ActorDatasets.initCollectives();
			TIMAAT.ActorDatasets.initNames();
			TIMAAT.ActorDatasets.initAddresses();
			TIMAAT.ActorDatasets.initEmailAddresses();
			TIMAAT.ActorDatasets.initPhoneNumbers();
			$('.actors-data-tabs').hide();
			$('.actors-cards').hide();
			$('.actors-card').show();
			$('#timaat-actordatasets-actor-metadata-form').data('actorType', 'actor');
		},

		initActorTypes: function() {
			// console.log("TCL: ActorDatasets: initActorTypes: function()");		
			// delete actorType functionality
			$('#timaat-actortype-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-actortype-delete');
				var actorType = modal.data('actorType');
				if (actorType) TIMAAT.ActorDatasets._actorTypeRemoved(actorType);
				modal.modal('hide');
			});
			// add actorType button
			$('#timaat-actortype-add').attr('onclick','TIMAAT.ActorDatasets.addActorType()');

			// add/edit actorType functionality
			$('#timaat-actordatasets-actortype-meta').on('show.bs.modal', function (ev) {
				// Create/Edit actorType window setup
				var modal = $(this);
				var actorType = modal.data('actorType');				
				var heading = (actorType) ? "ActorType bearbeiten" : "ActorType hinzufügen";
				var submit = (actorType) ? "Speichern" : "Hinzufügen";
				var type = (actorType) ? actorType.model.type : 0;
				// setup UI
				$('#actorTypeMetaLabel').html(heading);
				$('#timaat-actordatasets-actortype-meta-submit').html(submit);
				$("#timaat-actordatasets-actortype-meta-name").val(type).trigger('input');
			});

			// Submit actorType data
			$('#timaat-actordatasets-actortype-meta-submit').click(function(ev) {
				// Create/Edit actorType window submitted data validation
				var modal = $('#timaat-actordatasets-actortype-meta');
				var actorType = modal.data('actorType');
				var type = $("#timaat-actordatasets-actortype-meta-name").val();

				if (actorType) {
					actorType.model.actor.actorTypeTranslations[0].type = type;
					actorType.updateUI();
					TIMAAT.ActorService.updateActorType(actorType);
					TIMAAT.ActorService.updateActorTypeTranslation(actorType);
				} else { // create new actorType
					var model = {
						id: 0,
						actorTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					};
					TIMAAT.ActorService.createActorType(model, modelTranslation, TIMAAT.ActorDatasets._actorTypeAdded); // TODO add actorType parameters
				}
				modal.modal('hide');
			});

			// validate actorType data	
			// TODO validate all required fields				
			$('#timaat-actordatasets-actortype-meta-name').on('input', function(ev) {
				if ( $("#timaat-actordatasets-actortype-meta-name").val().length > 0 ) {
					$('#timaat-actordatasets-actortype-meta-submit').prop("disabled", false);
					$('#timaat-actordatasets-actortype-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-actordatasets-actortype-meta-submit').prop("disabled", true);
					$('#timaat-actordatasets-actortype-meta-submit').attr("disabled");
				}
			});
		},

		initActors: function() {
			// console.log("TCL: ActorDatasets: initActors: function()");
			// nav-bar functionality
			$('#actors-tab-actor-metadata-form').click(function(event) {
				// $('.actor-data-tabs').show();
				$('.nav-tabs a[href="#actorDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-actordatasets-actor-metadata-form').show();
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'actor', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
			
			// delete actor button functionality (in actor list)
			$('#timaat-actordatasets-actor-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-actor-delete');
				var actor = modal.data('actor');
				if (actor) TIMAAT.ActorDatasets._actorRemoved(actor);
				modal.modal('hide');
				$('#timaat-actordatasets-actor-metadata-form').hide();
				$('.actors-data-tabs').hide();
				$('.form').hide();
			});

			// add actor button functionality (in actor list - opens datasheet form)
			// $('#timaat-actordatasets-actor-add').attr('onclick','TIMAAT.ActorDatasets.addActor("actor")');
			$('#timaat-actordatasets-actor-add').click(function(event) {
				$('#timaat-actordatasets-actor-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("actor");
			});
			
			// actor form handlers
			// Submit actor metadata button functionality
			$('#timaat-actordatasets-actor-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-actordatasets-actor-metadata-form').valid()) return false;

				// the birth actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-actor-metadata-form').data('actor');				
				// console.log("TCL: actor", actor);

				// Create/Edit actor window submitted data
				var formData = $('#timaat-actordatasets-actor-metadata-form').serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				// formDataObject.isFictional = (formDataObject.isFictional) ? true : false;
				formDataObject.nameUsedFrom = moment.utc(formDataObject.nameUsedFrom, "YYYY-MM-DD");
				formDataObject.nameUsedUntil = moment.utc(formDataObject.nameUsedUntil, "YYYY-MM-DD");

				if (actor) { // update actor
					// actor data
					actor = await TIMAAT.ActorDatasets.updateActorModelData(actor, formDataObject);
					// person data on actor dataseheet
					console.log("TCL: formDataObject", formDataObject);
					actor.updateUI();
					console.log("TCL actorType, actor: ", actor.model.actorType.actorTypeTranslations[0].type, actor);
					TIMAAT.ActorDatasets.updateActor(actor.model.actorType.actorTypeTranslations[0].type, actor);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', "actor", actor);
				} else { // create new actor
					var actorModel = await TIMAAT.ActorDatasets.createActorModel(formDataObject, formDataObject.typeId);
					var displayName = await TIMAAT.ActorDatasets.createNameModel(formDataObject);
					var primaryAddress = null // TODO await TIMAAT.ActorDatasets.createAddressModel(formDataObject);
					var primaryEmail = null // TODO await TIMAAT.ActorDatasets.createEmailModel(formDataObject);
					var primaryPhoneNumber = null // TODO await TIMAAT.ActorDatasets.createPhoneNumberModel(formDataObject);
					var actorType;
					var actorSubtypeModel;
					switch (formDataObject.typeId) {
						case "1": 
							actorType = "person";
							actorSubtypeModel = await TIMAAT.ActorDatasets.createPersonModel(formDataObject);
						break;
						case "2": 
							actorType = "collective";
							actorSubtypeModel = await TIMAAT.ActorDatasets.createCollectiveModel(formDataObject);
						break;
					}
					if (actorType) {
												await TIMAAT.ActorDatasets.createActor(actorType, actorModel, actorSubtypeModel, displayName);
						// await TIMAAT.ActorDatasets.createActor(actorType, actorModel, actorSubtypeModel, displayName, primaryAddress, primaryEmail, primaryPhoneNumber);
						var actor = TIMAAT.ActorDatasets.actor[TIMAAT.ActorDatasets.actor.length-1];
						TIMAAT.ActorDatasets.actorFormDatasheet('show', "actor", actor);
						// $('#timaat-actordatasets-actor-metadata-form').data('actor', actor); //? needed or not?
					}
				}
			});

			// edit content form button handler
			$('#timaat-actordatasets-actor-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormDatasheet('edit', 'actor', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-actordatasets-actor-metadata-form-dismiss').click( function(event) {
				var actor = $('#timaat-actordatasets-actor-metadata-form').data('actor');
				if (actor != null) {
					TIMAAT.ActorDatasets.actorFormDatasheet('show', "actor", actor);
				} else { // dismiss actor creation
					$('.form').hide();
				}
			});
			
			// // attach tag editor
			// $('#timaat-actordatasets-actor-tags').popover({
			// 	placement: 'right',
			// 	title: 'Actor Tags bearbeiten (datasets init function)',
			// 	trigger: 'click',
			// 	html: true,
			// 	content: `<div class="input-group">
			// 							<input class="form-control timaat-tag-input" type="text" value="">
			// 						</div>`,
			// 	container: 'body',
			// 	boundary: 'viewport',				
			// });

			// $('#timaat-actordatasets-actor-tags').on('inserted.bs.popover', function () {
			// 	var tags = "";
			// 	if ( actor == null ) {
			// 		$('.timaat-tag-input').html('Kein Actor geladen');
			// 		return;
			// 	} else {
			// 		$('.timaat-tag-input').html('');					
			// 	}
			// 	actor.tags.forEach(function(item) { tags += ','+item.name });
			// 	tags = tags.substring(1);
			// 	$('.timaat-tag-input').val(tags);
			//     $('.timaat-tag-input').tagsInput({
			//     	placeholder: 'Actor Tag hinzufügen (datasets init function)',
			//     	onAddTag: function(taginput,tag) {
			//     		TIMAAT.ActorService.addActorTag(actor, tag, function(newtag) {
			//     			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			//     		});
			//     	},
			//     	onRemoveTag: function(taginput,tag) {
			//     		TIMAAT.ActorService.removeActorTag(actor, tag, function(tagname) {
			//     			// find tag in model
			//     			var found = -1;
			//     			TIMAAT.VideoPlayer.model.video.tags.forEach(function(item, index) {
			//     				if ( item.name == tagname ) found = index;
			//     			});
			//     			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			//     		});
			//     	},
			//     	onChange: function() {
			//     		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			//     	}
			//     });
			// });

			// $('#timaat-actordatasets-actor-tags').on('hidden.bs.popover', function () { 
			// });
		},

		initPersons: function() {
			// nav-bar functionality
			$('#actors-tab-person-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#personDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-actordatasets-actor-metadata-form').show();
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
			
			// delete person button functionality (in person list)
			$('#timaat-actordatasets-person-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-person-delete');
				var person = modal.data('person');
				if (person) TIMAAT.ActorDatasets._actorSubtypeRemoved('person', person);
				modal.modal('hide');
				$('#timaat-actordatasets-actor-metadata-form').hide();
				$('.actors-data-tabs').hide();
				$('.form').hide();
			});

			// add person button functionality (opens form)
			// $('#timaat-actordatasets-person-add').attr('onclick','TIMAAT.ActorDatasets.addActor("person")');
			$('#timaat-actordatasets-person-add').click(function(event) {
				$('#timaat-actordatasets-actor-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("person");
			});

			// person form handlers
			// Submit person data button functionality
			$('#timaat-actordatasets-person-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-actordatasets-actor-metadata-form").valid()) return false;

				// the birth person model (in case of editing an existing person)
				var person = $('#timaat-actordatasets-actor-metadata-form').data('actor');		

				// Create/Edit person window submitted data
				var formData = $("#timaat-actordatasets-actor-metadata-form").serializeArray();
        // console.log("TCL: formData", formData);
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});				
				formDataObject.sexId = (formDataObject.sexId) ? formDataObject.sexId : 4; // set default to 'unknown' (id 4)
				// console.log("TCL: formDataObject", formDataObject);

				if (person) { // update person
					// actor data
					person = await TIMAAT.ActorDatasets.updateActorModelData(person, formDataObject);
					// person data
					person.model.actorPerson.title = formDataObject.title;
					person.model.actorPerson.dateOfBirth = moment.utc(formDataObject.dateOfBirth, "YYYY-MM-DD");
					person.model.actorPerson.placeOfBirth = formDataObject.placeOfBirth;
					person.model.actorPerson.dayOfDeath = moment.utc(formDataObject.dayOfDeath, "YYYY-MM-DD");
					person.model.actorPerson.placeOfDeath = formDataObject.placeOfDeath;
					person.model.actorPerson.sex.id = Number(formDataObject.sexId);
					// person.model.actorPerson.citizenships[0].name = formDataObject.citizenshipName; //? correct structure?
					// person.model.actorPerson.actorPersonTranslations.specialFeatures = formDataObject.specialFeatures;

					person.updateUI();
					console.log("TCL actorType, actor", 'person', person);
					TIMAAT.ActorDatasets.updateActor('person', person);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', person);
				} else { // create new person
					var personModel = await TIMAAT.ActorDatasets.createPersonModel(formDataObject);
					var actorModel = await TIMAAT.ActorDatasets.createActorModel(formDataObject, 1); // 1 = Person. TODO check clause to find proper id
					var displayName = await TIMAAT.ActorDatasets.createNameModel(formDataObject);
					var primaryAddress = null; //TODO  await TIMAAT.ActorDatasets.createAddressModel(formDataObject);
					var primaryEmail = null; // TODO await TIMAAT.ActorDatasets.createEmailModel(formDataObject);
					var primaryPhoneNumber = null; // TODO await TIMAAT.ActorDatasets.createPhoneNumberModel(formDataObject);
					// var citizenshipModel = await TIMAAT.ActorDatasets.createCitizenshipModel(formDataObject);
					// if (citizenshipModel != null) {
					// 	personModel.citizenships = citizenshipModel;
					// };
					
					await TIMAAT.ActorDatasets.createActor('person', actorModel, personModel, displayName);
					// await TIMAAT.ActorDatasets.createActor('person', actorModel, personModel, displayName, primaryAddress, primaryEmail, primaryPhoneNumber);
					var person = TIMAAT.ActorDatasets.persons[TIMAAT.ActorDatasets.persons.length-1];
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', person);
					$('#timaat-actordatasets-actor-metadata-form').data('actor', person);
				}
			});

			// edit content form button handler
			$('#timaat-actordatasets-person-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormDatasheet('edit', 'person', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
				// person.listView.find('.timaat-actordatasets-person-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-actordatasets-person-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initCollectives: function() {
			// nav-bar functionality
			$('#actors-tab-collective-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#collectiveDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-actordatasets-actor-metadata-form').show();
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
			
			// delete collective button functionality (in collective list)
			$('#timaat-actordatasets-collective-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-collective-delete');
				var collective = modal.data('collective');
				if (collective) TIMAAT.ActorDatasets._actorSubtypeRemoved('collective', collective);
				modal.modal('hide');
				$('#timaat-actordatasets-actor-metadata-form').hide();
				$('.actors-data-tabs').hide();
				$('.form').hide();
			});

			// add collective button functionality (opens form)
			// $('#timaat-actordatasets-collective-add').attr('onclick','TIMAAT.ActorDatasets.addActor("collective")');
			$('#timaat-actordatasets-collective-add').click(function(event) {
				$('#timaat-actordatasets-actor-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("collective");
			});

			// collective form handlers
			// Submit collective data button functionality
			$('#timaat-actordatasets-collective-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-actordatasets-actor-metadata-form").valid()) return false;

				// the birth collective model (in case of editing an existing collective)
				var collective = $('#timaat-actordatasets-actor-metadata-form').data('actor');		

				// Create/Edit collective window submitted data
				var formData = $("#timaat-actordatasets-actor-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (collective) { // update collective
					// actor data
					collective = await TIMAAT.ActorDatasets.updateActorModelData(collective, formDataObject);
					// collective data

					collective.updateUI();
					console.log("TCL actorType, actor", 'collective', collective);
					TIMAAT.ActorDatasets.updateActor('collective', collective);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', collective);
				} else { // create new collective
					var collectiveModel = await TIMAAT.ActorDatasets.createCollectiveModel(formDataObject);
					var actorModel = await TIMAAT.ActorDatasets.createActorModel(formDataObject, 2); // 2 = Collective. TODO check clause to find proper id
					var displayName = await TIMAAT.ActorDatasets.createNameModel(formDataObject);
					var primaryAddress = null; // await TIMAAT.ActorDatasets.createAddressModel(formDataObject);
					var primaryEmail = null; // await TIMAAT.ActorDatasets.createEmailModel(formDataObject);
					var primaryPhoneNumber = null; // await TIMAAT.ActorDatasets.createPhoneNumberModel(formDataObject);

					await TIMAAT.ActorDatasets.createActor('collective', actorModel, collectiveModel, displayName);
					// await TIMAAT.ActorDatasets.createActor('collective', actorModel, collectiveModel, displayName, primaryAddress, primaryEmail, primaryPhoneNumber);
					var collective = TIMAAT.ActorDatasets.collectives[TIMAAT.ActorDatasets.collectives.length-1];
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', collective);
					$('#timaat-actordatasets-actor-metadata-form').data('actor', collective);
				}
			});

			// edit content form button handler
			$('#timaat-actordatasets-collective-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormDatasheet('edit', 'collective', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
				// collective.listView.find('.timaat-actordatasets-collective-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-actordatasets-collective-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initNames: function() {
			$('#actors-tab-actor-names-form').click(function(event) {
				$('.nav-tabs a[href="#actorNames"]').tab('show');
				$('.form').hide();
				TIMAAT.ActorDatasets.setActorNameList($('#timaat-actordatasets-actor-metadata-form').data('actor'))
				$('#timaat-actordatasets-actor-actornames-form').show();
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
			
			// edit names form button handler
			$('#timaat-actordatasets-actor-actornames-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormNames('edit', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// Add name button click
			$(document).on('click','[data-role="new-name-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				console.log("TCL: add name to list");
				var listEntry = $(this).closest('[data-role="new-name-fields"]');
				var newName = [];
				if (listEntry.find('input').each(function(){           
					newName.push($(this).val());
          console.log("TCL: $(this).val()", $(this).val());
          console.log("TCL: newName", newName);
				}));
				if (newName != '') { // TODO is '' proper check?
					var namesInForm = $("#timaat-actordatasets-actor-actornames-form").serializeArray();
          console.log("TCL: namesInForm", namesInForm);
					var indexName = namesInForm[namesInForm.length-4].name; // find last used index. Extra -1 for 1 element in add new name row
					var indexString = indexName.substring(indexName.lastIndexOf("[") + 1, indexName.lastIndexOf("]"));
					var i = Number(indexString)+1;
					// console.log("TCL: namesInForm", namesInForm);
					// console.log("TCL: i", i);
					$('#dynamic-name-fields').append(
						`<div class="form-group" data-role="name-entry">
						<div class="form-row">
							<div class="col-sm-1 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayName"></label>
									<input class="form-check-input isDisplayName" type="radio" name="isDisplayName" placeholder="Is Display Name" data-role="displayName">
								</div>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isBirthName"></label>
									<input class="form-check-input isBirthName" type="radio" name="isBirthName" placeholder="Is birth Name" data-role="birthName">
								</div>
							</div>
							<div class="col-sm-5 col-md-5">
								<label class="sr-only">Name</label>
								<input class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-name" name="actorName[`+i+`]" data-role="actorName" value="`+newName[0]+`" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" required>
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used from</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-usedfrom" name="nameUsedFrom[`+i+`]" data-role="nameUsedFrom" value="`+newName[1]+`" placeholder="[Enter name used from]" aria-describedby="Name used from">
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used until</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-useduntil" name="nameUsedUntil[`+i+`]" data-role="nameUsedUntil" value="`+newName[2]+`" placeholder="[Enter name used until]" aria-describedby="Name used until">
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
					);
					$('input[name="actorName['+i+']"').rules("add",
					{
						required: true,
						minlength: 3,
						maxlength: 200,
					});
					if (listEntry.find('input').each(function(){
						// console.log("TCL: $(this).val()", $(this).val());
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						// console.log("TCL: $(this).val()", $(this).val());
						$(this).val('');
					}));
					$('.timaat-actordatasets-actor-actornames-name-usedfrom').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
					$('.timaat-actordatasets-actor-actornames-name-useduntil').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
				}
				else {
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove name button click
			$(document).on('click','[data-role="dynamic-name-fields"] > .form-group [data-role="remove"]', function(event) {
				event.preventDefault();
				var isDisplayName = $(this).closest('.form-group').find('input[name=isDisplayName]:checked').val();
				if (isDisplayName == "on") {
					// TODO modal informing that display name entry cannot be deleted					
					console.log("CANNOT DELETE DISPLAY NAME");
				}
				else {
					// TODO consider undo function or popup asking if user really wants to delete a name
					console.log("DELETE NAME ENTRY");
					$(this).closest('.form-group').remove();
				}
			});

			// Submit actor names button functionality
			$("#timaat-actordatasets-actor-actornames-form-submit").on('click', async function(event) {
				// console.log("TCL: Names form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-name-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}
				// test if form is valid 
				if (!$("#timaat-actordatasets-actor-actornames-form").valid()) {
					$('[data-role="new-name-fields"]').append(TIMAAT.ActorDatasets.appendNewNameField());				
					return false;
				}

				// the original actor model (in case of editing an existing actor)
				var actor = $("#timaat-actordatasets-actor-actornames-form").data("actor");
				var actorType = actor.model.actorType.actorTypeTranslations[0].type;

				// Create/Edit actor window submitted data
				var formData = $("#timaat-actordatasets-actor-actornames-form").serializeArray();
				var formNameList = [];
				var i = 0;
				while ( i < formData.length) { // fill formNameList with data
					var element = {
						isDisplayName: false,
						isBirthName: false,
						name: '',
						usedFrom: '',
						usedUntil: '',
					};
					if (formData[i].name == 'isDisplayName' && formData[i].value == 'on' ) {
						element.isDisplayName = true;
						if (formData[i+1].name == 'isBirthName' && formData[i+1].value == 'on' ) {
							// display name set, birth name set
							element.isBirthName = true;
							element.name = formData[i+2].value;
							element.usedFrom = formData[i+3].value;
							element.usedUntil = formData[i+4].value
							i = i+5;
						} else { // display name set, birth name not set
							element.isBirthName = false;
							element.name = formData[i+1].value;
							element.usedFrom = formData[i+2].value;
							element.usedUntil = formData[i+3].value
							i = i+4;
						}
					} else { // display name not set, birth name set
						element.isDisplayName = false;
						if (formData[i].name == 'isBirthName' && formData[i].value == 'on' ) {
							element.isBirthName = true;
							element.name = formData[i+1].value;
							element.usedFrom = formData[i+2].value;
							element.usedUntil = formData[i+3].value
							i = i+4;
						} else {
							// display name not set, birth name not set
							element.isBirthName = false;
							element.name = formData[i].value;
							element.usedFrom = formData[i+1].value;
							element.usedUntil = formData[i+2].value
							i = i+3;
						}
					}
					formNameList[formNameList.length] = element;
				}
				// console.log("TCL: formNameList", formNameList);

				// only updates to existing name entries
				if (formNameList.length == actor.model.actorNames.length) {
					var i = 0;
					for (; i < actor.model.actorNames.length; i++ ) { // update existing names
						var name = {
							id: actor.model.actorNames[i].id,
							name: formNameList[i].name,
							isDisplayName: formNameList[i].isDisplayName,
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						// only update if anything changed
						if (name != actor.model.actorNames[i]) {
							console.log("TCL: update existing name");
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
						// update display name
						var displayNameChanged = false;
						if (name.isDisplayName) {
							actor.model.displayName = actor.model.actorNames[i];
							displayNameChanged = true;
						}
						var birthNameChanged = false;
						// update birth name
						if (formNameList[i].isBirthName == true) {
							actor.model.birthName = actor.model.actorNames[i];
							birthNameChanged = true;
						}
						if ( birthNameChanged || displayNameChanged) {
							console.log("TCL actorType, actor", actorType, actor);
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
				}
				// update existing names and add new ones
				else if (formNameList.length > actor.model.actorNames.length) {
					var i = 0;
					for (; i < actor.model.actorNames.length; i++ ) { // update existing names
						var name = {
							id: actor.model.actorNames[i].id,
							name: formNameList[i].name,
							isDisplayName: formNameList[i].isDisplayName,
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						// only update if anything changed
						if (name != actor.model.actorNames[i]) {
							console.log("TCL: update existing names (and add new ones)");
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
					}
					i = actor.model.actorNames.length;
					var newNames = [];
					for (; i < formNameList.length; i++) { // create new names
						var name = {
							id: 0,
							name: formNameList[i].name,
							isDisplayName: formNameList[i].isDisplayName,
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						newNames.push(name);
					}
					console.log("TCL: (update existing names and) add new ones");
					await TIMAAT.ActorDatasets.addNames(actor, newNames);
					// for the whole list check new birth name
					i = 0;
					for (; i < formNameList.length; i++) {
						// update display name
						var displayNameChanged = false;
						if (formNameList[i].isDisplayName) {
							actor.model.displayName = actor.model.actorNames[i];
							displayNameChanged = true;
						}
						// update birth name
						var birthNameChanged = false;
						if (formNameList[i].isBirthName == true) {
							actor.model.birthName = actor.model.actorNames[i];
							birthNameChanged = true;
						}
						if ( birthNameChanged || displayNameChanged) {
							console.log("TCL actorType, actor", actorType, actor);
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
							break; // only one birthName needs to be found
							// TODO break still valid with birthName and displayName?
						}
					}
				}
				// update existing names and delete obsolete ones
				else if (formNameList.length < actor.model.actorNames.length) {
					var i = 0;
					for (; i < formNameList.length; i++ ) { // update existing names
						var name = {
							id: actor.model.actorNames[i].id,
							name: formNameList[i].name,
							isDisplayName: formNameList[i].isDisplayName,
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						if (name != actor.model.actorNames[i]) {
							console.log("TCL: update existing names (and delete obsolete ones)");
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
						// update display name
						var displayNameChanged = false;
						if (name.isDisplayName) {
							actor.model.displayName = actor.model.actorNames[i];
							displayNameChanged = true;
						}
						// update birth name
						var birthNameChanged = false;
						if (formNameList[i].isBirthName == true) {
							actor.model.birthName = actor.model.actorNames[i];
							birthNameChanged = true;
						}
						if (birthNameChanged || displayNameChanged) {
							console.log("TCL actorType, actor", actorType, actor);
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
					var i = actor.model.actorNames.length - 1;
					for (; i >= formNameList.length; i-- ) { // remove obsolete names starting at end of list
						console.log("TCL: actor.model", actor.model);
						if (actor.model.birthName != null && actor.model.birthName.id == actor.model.actorNames[i].id) {
							actor.model.birthName = null;
							console.log("TCL: remove birthName before deleting name");		
							console.log("TCL actorType, actor", actorType, actor);
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
						console.log("TCL: (update existing names and) delete obsolete ones");		
						TIMAAT.ActorService.removeName(actor.model.actorNames[i]);
						actor.model.actorNames.pop();
					}
				}
				console.log("TCL: show actor name form");
				TIMAAT.ActorDatasets.actorFormNames('show', actor);
			});

			// Cancel add/edit button in names form functionality
			$('#timaat-actordatasets-actor-actornames-form-dismiss').click( function(event) {
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
		},

		initAddresses: function() {
			$('#actors-tab-actor-addresses-form').click(function(event) {
				$('.nav-tabs a[href="#actorAddresses"]').tab('show');
				$('.form').hide();
				TIMAAT.ActorDatasets.setActorHasAddressList($('#timaat-actordatasets-actor-metadata-form').data('actor'))
				$('#timaat-actordatasets-actor-addresses-form').show();
				TIMAAT.ActorDatasets.actorFormAddresses('show', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
			
			// edit addresses form button handler
			$('#timaat-actordatasets-actor-addresses-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormAddresses('edit', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// Add address button click
			$(document).on('click','[data-role="new-actorhasaddress-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				console.log("TCL: add address to list");
				var listEntry = $(this).closest('[data-role="new-actorhasaddress-fields"]');
				var newAddress = [];
				var addressTypeId = 1;
				if (listEntry.find('select').each(function(){
					addressTypeId = $(this).val();
				}));
				if (listEntry.find('input').each(function(){           
					newAddress.push($(this).val());
				}));
				if (!$("#timaat-actordatasets-actor-addresses-form").valid()) 
					return false;
				console.log("TCL: newAddress", newAddress);
				if (newAddress != '') { // TODO is '' proper check?
					var addressesInForm = $("#timaat-actordatasets-actor-addresses-form").serializeArray();
					console.log("TCL: addressesInForm", addressesInForm);
					var i;
					var numberOfAddressElements = 9;
					if (addressesInForm.length > numberOfAddressElements) {
						var indexName = addressesInForm[addressesInForm.length-numberOfAddressElements-1].name; // find last used indexed name (first prior to new address fields)
						var indexString = indexName.substring(indexName.lastIndexOf("[") + 1, indexName.lastIndexOf("]"));
						i = Number(indexString)+1;
					}
					else {
						i = 0;
					}
					// console.log("TCL: i", i);
					$('#dynamic-address-fields').append(
						`<div class="form-group" data-role="address-entry">
							<div class="form-row">
								<div class="col-md-11">
									<fieldset>
										<legend>Address</legend>
										<div class="form-row align-items-center">
											<div class="col-md-2 col-auto">
												<div class="form-check form-check-inline">
													<input class="form-check-input isPrimaryAddress" type="radio" name="isPrimaryAddress" data-role="primaryAddress" placeholder="Is primary address">
													<label class="form-check-label col-form-label col-form-label-sm" for="isPrimaryAddress">Primary address</label>
												</div>
											</div>
											<div class="col-md-5">
												<label class="col-form-label col-form-label-sm">Street name</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetname" name="streetName[`+i+`]" data-role="streetName" value="`+newAddress[0]+`" placeholder="[Enter street name]" aria-describedby="Street name" minlength="3" maxlength="200" rows="1" readonly="true">
											</div>
											<div class="col-md-2">
												<label class="col-form-label col-form-label-sm">Street number</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetnumber" name="streetNumber[`+i+`]" data-role="streetNumber" value="`+newAddress[1]+`" placeholder="[Enter street number]" aria-describedby="Street number" maxlength="10">
											</div>
											<div class="col-md-3">
												<label class="col-form-label col-form-label-sm">Street addition</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetaddition" name="streetAddition[`+i+`]" data-role="streetAddition" value="`+newAddress[2]+`" placeholder="[Enter street addition]" aria-describedby="Street addition" maxlength="50">
											</div>
										</div>
										<div class="form-row">
											<div class="col-md-3">
												<label class="col-form-label col-form-label-sm">Postal code</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postalcode" name="postalCode[`+i+`]" data-role="postalCode" value="`+newAddress[3]+`" placeholder="[Enter postal code]" aria-describedby="Postal code" maxlength="8">
											</div>
											<div class="col-md-6">
												<label class="col-form-label col-form-label-sm">City</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-city" name="cityName[`+i+`]" data-role="cityName" value="`+newAddress[4]+`" placeholder="[Enter city]" aria-describedby="City" readonly="true">
											</div>
											<div class="col-md-3">
												<label class="col-form-label col-form-label-sm">Post office box</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postofficebox" name="postOfficeBox[`+i+`]" data-role="postOfficeBox" value="`+newAddress[5]+`" placeholder="[Enter post office box]" aria-describedby="Post office box" maxlength="10">
											</div>
										</div>
										<div class="form-row">
											<div class="col-md-4">
												<label class="col-form-label col-form-label-sm">Address type*</label>
												<select class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-addresstype-id" name="addressTypeId[`+i+`]" data-role="addressTypeId[`+i+`]" required>
													<option value="" disabled selected hidden>[Choose address type...]</option>
													<option value="1"> </option>
													<option value="2">business</option>
													<option value="3">home</option>
													<option value="4">other</option>
												</select>
											</div>
											<div class="col-md-4">
												<label class="col-form-label col-form-label-sm">Address used from</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-usedfrom" name="addressUsedFrom[`+i+`]" name="addressUsedFrom" value="`+newAddress[6]+`" placeholder="[Enter used from]" aria-describedby="Address used from">
											</div>
											<div class="col-md-4">
												<label class="col-form-label col-form-label-sm">Address used until</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-useduntil" name="addressUsedUntil[`+i+`]" name="addressUsedUntil" value="`+newAddress[7]+`" placeholder="[Enter used until]" aria-describedby="Address used until">
											</div>
										</div>
									</fieldset>
								</div>
								<div class="col-md-1 vertical-aligned">
									<button class="btn btn-danger" data-role="remove">
										<span class="fas fa-trash-alt"></span>
									</button>
								</div>
							</div>
						</div>`
					);
					$('input[name="actorAddress['+i+']"').rules("add", { required: true, minlength: 3, maxlength: 200});
					($('[data-role="addressTypeId['+i+']"]'))
						.find('option[value='+addressTypeId+']')
						.attr("selected",true);
					if (listEntry.find('input').each(function(){
						// console.log("TCL: find(input) $(this).val()", $(this).val());
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						// console.log("TCL: find(select) $(this).val()", $(this).val());
						$(this).val('');
					}));
					$('.timaat-actordatasets-actor-addresses-address-usedfrom').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
					$('.timaat-actordatasets-actor-addresses-address-useduntil').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
				}
				else {
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove address button click
			$(document).on('click','[data-role="dynamic-address-fields"] > .form-group [data-role="remove"]', function(event) {
				event.preventDefault();
					$(this).closest('.form-group').remove();
			});

			// Submit actor addresses button functionality
			$("#timaat-actordatasets-actor-addresses-form-submit").on('click', async function(event) {
				// console.log("TCL: Addresses form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-actorhasaddress-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}
				// test if form is valid 
				if (!$("#timaat-actordatasets-actor-addresses-form").valid()) {
					$('[data-role="new-actorhasaddress-fields"]').append(TIMAAT.ActorDatasets.appendNewAddressField());				
					return false;
				}

				// the original actor model (in case of editing an existing actor)
				var actor = $("#timaat-actordatasets-actor-addresses-form").data("actor");
				var actorType = actor.model.actorType.actorTypeTranslations[0].type;

				// Create/Edit actor window submitted data
				var formData = $("#timaat-actordatasets-actor-addresses-form").serializeArray();
				var formActorHasAddressesList = [];
				var i = 0;
				while ( i < formData.length) { // fill formActorHasAddressesList with data
					var element = {
						isPrimaryAddress: false,
						streetName: 'TEMP NAME',
						streetNumber: '',
						streetAddition: '',
						postalCode: '',
						cityName: 'TEMP NAME',
						postOfficeBox: '',
						addressTypeId: 0,
						addressUsedFrom: '',
						addressUsedUntil: '',
					};
						console.log("TCL: formData", formData);
						if (formData[i].name == 'isPrimaryAddress' && formData[i].value == 'on' ) {
							element.isPrimaryAddress = true;
							// element.streetName = formData[i+1].value;
							element.streetNumber = formData[i+2].value;
							element.streetAddition = formData[i+3].value;
							element.postalCode = formData[i+4].value;
							// element.cityName = formData[i+5].value;
							element.postOfficeBox = formData[i+6].value;
							element.addressTypeId = formData[i+7].value;
							element.addressUsedFrom = formData[i+8].value;
							element.addressUsedUntil = formData[i+9].value;
							i = i+10;
						} else {
							element.isPrimaryAddress = false;
							// element.streetName = formData[i].value;
							element.streetNumber = formData[i+1].value;
							element.streetAddition = formData[i+2].value;
							element.postalCode = formData[i+3].value;
							// element.cityName = formData[i+4].value;
							element.postOfficeBox = formData[i+5].value;
							element.addressTypeId = formData[i+6].value;
							element.addressUsedFrom = formData[i+7].value;
							element.addressUsedUntil = formData[i+8].value;
							i = i+9;
						}
					formActorHasAddressesList[formActorHasAddressesList.length] = element;
				}
				// console.log("TCL: formActorHasAddressesList", formActorHasAddressesList);

				// only updates to existing actorHasAddress entries
				if (formActorHasAddressesList.length == actor.model.actorHasAddresses.length) {
					var i = 0;
					for (; i < actor.model.actorHasAddresses.length; i++ ) { // update existing actorHasAddresses
						var updatedActorHasAddress = TIMAAT.ActorDatasets.updateActorHasAddressModel(actor.model.actorHasAddresses[i], formActorHasAddressesList[i]);
						// only update if anything changed
						// if (updatedActorHasAddress != actor.model.actorHasAddresses[i]) { // TODO currently actorHasAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing address");
							await TIMAAT.ActorDatasets.updateActorHasAddress(updatedActorHasAddress, actor);
						// }
						var primaryAddressChanged = false;
						// update primary actorHasAddress
						if (formActorHasAddressesList[i].isPrimaryAddress == true) {
							actor.model.primaryAddress = actor.model.actorHasAddresses[i].address;
							primaryAddressChanged = true;
						}
						if (primaryAddressChanged) {
							console.log("TCL actorType, actor", actorType, actor);
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
				}
				// update existing actorHasAddresses and add new ones
				else if (formActorHasAddressesList.length > actor.model.actorHasAddresses.length) {
					var i = 0;
					for (; i < actor.model.actorHasAddresses.length; i++ ) { // update existing actorHasAddresses
						console.log("TCL: actor", actor);
						var actorHasAddress = {}; 
						actorHasAddress = TIMAAT.ActorDatasets.updateActorHasAddressModel(actor.model.actorHasAddresses[i], formActorHasAddressesList[i]);
						// only update if anything changed
						// if (actorHasAddress != actor.model.actorHasAddresses[i]) { // TODO currently actorHasAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasAddresses (and add new ones)");
							await TIMAAT.ActorDatasets.updateActorHasAddress(actorHasAddress, actor);
						// }
					}
					i = actor.model.actorHasAddresses.length;
					var newActorHasAddresses = [];
					for (; i < formActorHasAddressesList.length; i++) { // create new actorHasAddresses
						var actorHasAddress = TIMAAT.ActorDatasets.createActorHasAddressModel(formActorHasAddressesList[i], actor.model.id, 0);
						newActorHasAddresses.push(actorHasAddress);
					}
					console.log("TCL: (update existing addresses and) add new ones");
					await TIMAAT.ActorDatasets.addActorHasAddresses(actor, newActorHasAddresses);
					// for the whole list check new primary actorHasAddress
					i = 0;
					for (; i < formActorHasAddressesList.length; i++) {
						// update primary address
						var primaryAddressChanged = false;
						if (formActorHasAddressesList[i].isPrimaryAddress == true) {
							actor.model.primaryAddress = actor.model.actorHasAddresses[i].address;
							primaryAddressChanged = true;
						}
						if (primaryAddressChanged) {
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
							break; // only one primary actorHasAddress needs to be found
						}
					}
				}
				// update existing actorHasAddresses and delete obsolete ones
				else if (formActorHasAddressesList.length < actor.model.actorHasAddresses.length) {
					var i = 0;
					for (; i < formActorHasAddressesList.length; i++ ) { // update existing actorHasAddresses
						var actorHasAddress = TIMAAT.ActorDatasets.updateActorHasAddressModel(actor.model.actorHasAddresses[i], formActorHasAddressesList[i]);
						// if (actorHasAddress != actor.model.actorHasAddresses[i]) { // TODO currently actorHasAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasAddresses (and delete obsolete ones)");
							await TIMAAT.ActorDatasets.updateActorHasAddress(actorHasAddress, actor);
						// }
						// update primary address
						var primaryAddressChanged = false;
						if (formActorHasAddressesList[i].isPrimaryAddress && actor.model.primaryAddress.id != actor.model.actorHasAddresses[i].id.addressId) {
							actor.model.primaryAddress = actor.model.actorHasAddresses[i].address;
							primaryAddressChanged = true;
						} else if (!formActorHasAddressesList[i].isPrimaryAddress && actor.model.primaryAddress.id == actor.model.actorHasAddresses[i].id.addressId) {
							actor.model.primaryAddress = null;
							primaryAddressChanged = true;
						}
						if (primaryAddressChanged) {
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
					var i = actor.model.actorHasAddresses.length - 1;
					for (; i >= formActorHasAddressesList.length; i-- ) { // remove obsolete addresses starting at end of list
						if (actor.model.primaryAddress != null && actor.model.primaryAddress.id == actor.model.actorHasAddresses[i].address.id) {
							actor.model.primaryAddress = null;
							console.log("TCL: remove primaryActorHasAddress before deleting address");		
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
						console.log("TCL: (update existing actorHasAddresses and) delete obsolete ones");		
						TIMAAT.ActorService.removeAddress(actor.model.actorHasAddresses[i].address);
						actor.model.actorHasAddresses.pop();
					}
				}
				console.log("TCL: show actor address form");
				TIMAAT.ActorDatasets.actorFormAddresses('show', actor);
			});

			// Cancel add/edit button in addresses form functionality
			$('#timaat-actordatasets-actor-addresses-form-dismiss').click( function(event) {
				TIMAAT.ActorDatasets.actorFormAddresses('show', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
		},

		initAddressTypes: function() {
			// console.log("TCL: ActorDatasets: initAddressTypes: function()");		
			// delete addressType functionality
			$('#timaat-addresstype-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-addresstype-delete');
				var addressType = modal.data('addressType');
				if (addressType) TIMAAT.ActorDatasets._addressTypeRemoved(addressType);
				modal.modal('hide');
			});
			// add addressType button
			$('#timaat-addresstype-add').attr('onclick','TIMAAT.ActorDatasets.addAddressType()');

			// add/edit addressType functionality
			$('#timaat-actordatasets-addresstype-meta').on('show.bs.modal', function (ev) {
				// Create/Edit addressType window setup
				var modal = $(this);
				var addressType = modal.data('addressType');				
				var heading = (addressType) ? "AddressType bearbeiten" : "AddressType hinzufügen";
				var submit = (addressType) ? "Speichern" : "Hinzufügen";
				var type = (addressType) ? addressType.model.type : 0;
				// setup UI
				$('#addressTypeMetaLabel').html(heading);
				$('#timaat-actordatasets-addresstype-meta-submit').html(submit);
				$("#timaat-actordatasets-addresstype-meta-name").val(type).trigger('input');
			});

			// Submit addressType data
			$('#timaat-actordatasets-addresstype-meta-submit').click(function(ev) {
				// Create/Edit addressType window submitted data validation
				var modal = $('#timaat-actordatasets-addresstype-meta');
				var addressType = modal.data('addressType');
				var type = $("#timaat-actordatasets-addresstype-meta-name").val();

				if (addressType) {
					addressType.model.actor.addressTypeTranslations[0].type = type;
					addressType.updateUI();
					TIMAAT.ActorService.updateAddressType(addressType);
					TIMAAT.ActorService.updateAddressTypeTranslation(addressType);
				} else { // create new addressType
					var model = {
						id: 0,
						addressTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					}
					TIMAAT.ActorService.createAddressType(model, modelTranslation, TIMAAT.ActorDatasets._addressTypeAdded); // TODO add addressType parameters
				}
				modal.modal('hide');
			});

			// validate addressType data	
			// TODO validate all required fields				
			$('#timaat-actordatasets-addresstype-meta-name').on('input', function(ev) {
				if ( $("#timaat-actordatasets-addresstype-meta-name").val().length > 0 ) {
					$('#timaat-actordatasets-addresstype-meta-submit').prop("disabled", false);
					$('#timaat-actordatasets-addresstype-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-actordatasets-addresstype-meta-submit').prop("disabled", true);
					$('#timaat-actordatasets-addresstype-meta-submit').attr("disabled");
				}
			});
		},

		initEmailAddresses: function() {

		},

		initPhoneNumbers: function() {

		},

		load: function() {
			TIMAAT.ActorDatasets.loadActors();
			TIMAAT.ActorDatasets.loadActorTypes();
			TIMAAT.ActorDatasets.loadAllActorSubtypes();
			TIMAAT.ActorDatasets.loadAddressTypes();
		},

		loadActorTypes: function() {
    	// console.log("TCL: loadActorTypes: function()");
			TIMAAT.ActorService.listActorTypes(TIMAAT.ActorDatasets.setActorTypeLists);
		},

		loadActors: function() {
    	// console.log("TCL: loadActors: function()");
			// load actors
			$('.actors-cards').hide();
			$('.actors-card').show();
			TIMAAT.ActorService.listActors(TIMAAT.ActorDatasets.setActorLists);
		},

		loadActorSubtype: function(actorSubtype) {
			$('.actors-cards').hide();
			$('.'+actorSubtype+'s-card').show();
			$('#timaat-actordatasets-actor-metadata-form').data('actorType', actorSubtype);
			switch (actorSubtype) {
				case 'person':
					TIMAAT.ActorService.listActorSubtype(actorSubtype, TIMAAT.ActorDatasets.setPersonLists);
					break;
				case 'collective':
					TIMAAT.ActorService.listActorSubtype(actorSubtype, TIMAAT.ActorDatasets.setCollectiveLists);
					break;
			}
		},

		loadAllActorSubtypes: function() {
			TIMAAT.ActorService.listActorSubtype('person', TIMAAT.ActorDatasets.setPersonLists);
			TIMAAT.ActorService.listActorSubtype('collective', TIMAAT.ActorDatasets.setCollectiveLists);
		},

		loadAddressTypes: function() {
			TIMAAT.ActorService.listAddressTypes(TIMAAT.ActorDatasets.setAddressTypeLists);
		},

		setActorTypeLists: function(actorTypes) {
			// console.log("TCL: actorTypes", actorTypes);
			if ( !actorTypes ) return;
			$('#timaat-actortype-list-loader').remove();
			// clear old UI list
			$('#timaat-actortype-list').empty();
			// setup model
			var actTypes = Array();
			actorTypes.forEach(function(actorType) { 
				if ( actorType.id > 0 ) 
					actTypes.push(new TIMAAT.ActorType(actorType)); 
				});
			TIMAAT.ActorDatasets.actorTypes = actTypes;
			TIMAAT.ActorDatasets.actorTypes.model = actorTypes;
		},
		
		setActorLists: function(actors) {
			$('.form').hide();
			$('.actors-data-tabs').hide();
    	// console.log("TCL: setActorLists -> actors", actors);
			if ( !actors ) return;

			$('#timaat-actordatasets-actor-metadata-form').data('actorType', 'actor');
			$('#timaat-actordatasets-actor-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-list').empty();
			// setup model
			var acts = Array();
			actors.forEach(function(actor) { 
				if ( actor.id > 0 ) {
					// console.log("TCL: actor", actor);
					actor.actorNames.forEach(function(name) {
						if (name.isDisplayName) {
							actor.displayName = name;
							return; // only one displayName exists/needs to be found
						}
					})
					acts.push(new TIMAAT.Actor(actor, 'actor'));
				}
			});
			TIMAAT.ActorDatasets.actors = acts;
			TIMAAT.ActorDatasets.actors.model = actors;
      console.log("TCL: TIMAAT.ActorDatasets.actors", TIMAAT.ActorDatasets.actors);
			// also set up video chooser list
			// TIMAAT.VideoChooser.setActors(TIMAAT.ActorDatasets.actors.model);
		},

		setPersonLists: function(persons) {
			console.log("TCL: setPersonLists -> persons", persons);
			$('.form').hide();
			$('.actors-data-tabs').hide();
			if ( !persons ) return;
			
			$('#timaat-actordatasets-person-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-person-list').empty();
			// setup model
			var pers = Array();
			var newPerson;
			persons.forEach(function(person) { 
				if (person.id > 0) {
					// console.log("TCL: person", person);
					person.actorNames.forEach(function(name) {
						if (name.isDisplayName) {
							person.displayName = name;
							return; // only one displayName exists/needs to be found
						}
					})
					newPerson = new TIMAAT.Actor(person, 'person');
					pers.push(newPerson);
				}
			});
			TIMAAT.ActorDatasets.persons = pers;
			TIMAAT.ActorDatasets.persons.model = persons;
      console.log("TCL: TIMAAT.ActorDatasets.persons", TIMAAT.ActorDatasets.persons);
		},

		setCollectiveLists: function(collectives) {
			console.log("TCL: setCollectiveLists -> collectives", collectives);
			$('.form').hide();
			$('.actors-data-tabs').hide();
			if ( !collectives ) return;
			
			$('#timaat-actordatasets-collective-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-collective-list').empty();
			// setup model
			var colls = Array();
			var newCollective;
			collectives.forEach(function(collective) { 
				if (collective.id > 0) {
					console.log("TCL: collective", collective);
					collective.actorNames.forEach(function(name) {
						if (name.isDisplayName) {
							collective.displayName = name;
							return; // only one displayName exists/needs to be found
						}
					})
					newCollective = new TIMAAT.Actor(collective, 'collective');
					colls.push(newCollective);
				}
			});
			TIMAAT.ActorDatasets.collectives = colls;
			TIMAAT.ActorDatasets.collectives.model = collectives;
      console.log("TCL: TIMAAT.ActorDatasets.collectives", TIMAAT.ActorDatasets.collectives);
		},

		setActorNameList: function(actor) {
			console.log("TCL: setActorNameList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-name-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-name-list').empty();
			// setup model
			var names = Array();
			actor.model.actorNames.forEach(function(name) { 
				if ( name.id > 0 )
					names.push(name); 
			});
			TIMAAT.ActorDatasets.names = names;
      console.log("TCL: TIMAAT.ActorDatasets.names", TIMAAT.ActorDatasets.names);
		},

		setActorHasAddressList: function(actor) {
			console.log("TCL: setActorHasAddressList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-address-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-address-list').empty();
			// setup model
			var actorHasAddrs = Array();
			actor.model.actorHasAddresses.forEach(function(actorHasAddress) { 
				if ( actorHasAddress.id.actorId > 0 && actorHasAddress.id.addressId > 0 )
				actorHasAddress.address.streetName = "TEMP NAME";
				actorHasAddress.address.cityName = "TEMP NAME";
				actorHasAddrs.push(actorHasAddress); 
			});
			TIMAAT.ActorDatasets.actorHasAddresses = actorHasAddrs;
      console.log("TCL: TIMAAT.ActorDatasets.actorHasAddresses", TIMAAT.ActorDatasets.actorHasAddresses);
		},

		setAddressTypeLists: function(addressTypes) {
			console.log("TCL: setAddressTypeList -> addressTypes", addressTypes);
			if ( !addressTypes ) return;
			$('#timaat-actordatasets-addresstype-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-addresstype-list').empty();
			// setup model
			var addrTypes = Array();
			addressTypes.forEach(function(addressType) { 
				if ( addressType.id > 0 )
					addrTypes.push(addressType); 
			});
			TIMAAT.ActorDatasets.addressTypes = addrTypes;
      // console.log("TCL: TIMAAT.ActorDatasets.addressTypes", TIMAAT.ActorDatasets.addressTypes);

		},

		setActorEmailAddressList: function(actor) {
			console.log("TCL: setActorEmailAddressList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-emailaddress-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-emailaddress-list').empty();
			// setup model
			var emailAddresses = Array();
			actor.model.emailAddresses.forEach(function(emailAddress) { 
				if ( emailAddress.id > 0 )
					emailAddresses.push(emailAddress); 
			});
			TIMAAT.ActorDatasets.emailAddresses = emailAddresses;
      console.log("TCL: TIMAAT.ActorDatasets.emailAddresses", TIMAAT.ActorDatasets.emailAddresses);
		},

		setActorPhoneNumberList: function(actor) {
			console.log("TCL: setActorPhoneNumberList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-phonenumber-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-phonenumber-list').empty();
			// setup model
			var phoneNumbers = Array();
			actor.model.phoneNumbers.forEach(function(phoneNumber) { 
				if ( phoneNumber.id > 0 )
					phoneNumbers.push(phoneNumber); 
			});
			TIMAAT.ActorDatasets.phoneNumbers = phoneNumbers;
      console.log("TCL: TIMAAT.ActorDatasets.phoneNumbers", TIMAAT.ActorDatasets.phoneNumbers);
		},
		
		addActor: function(actorType) {	
			// console.log("TCL: addActor: function()");
			console.log("TCL: addActor: actorType", actorType);
			$('.form').hide();
			$('.actors-data-tabs').hide();
			$('.nav-tabs a[href="#'+actorType+'Datasheet"]').show();
			// $('.nav-tabs a[href="#actorNames"]').hide();
			$('#timaat-actordatasets-actor-metadata-form').data(actorType, null);
			actorFormMetadataValidator.resetForm();
			$('#timaat-actordatasets-actor-metadata-form').trigger('reset');
			$('#timaat-actordatasets-actor-metadata-form').show();
			$('.datasheet-data').hide();
			$('.name-data').show();
			$('.actor-data').show();
			if (actorType == "actor") {
				$('.actortype-data').show();
			}
			else {
				$('.actortype-data').hide();
			}
			$('.'+actorType+'-data').show();
			if (actorType == "collective") {
				$('.person-data').hide(); // to display title in same row with actor name data
			}
			$('.datasheet-form-edit-button').hide();
			$('.datasheet-form-buttons').hide()
			$('.'+actorType+'-datasheet-form-submit').show();
			$('#timaat-actordatasets-actor-metadata-form :input').prop('disabled', false);
			$('#timaat-actordatasets-actor-metadata-name').focus();

			// setup form
			$('#actorFormHeader').html(actorType+" hinzufügen");
			$('#timaat-actordatasets-'+actorType+'-metadata-form-submit').html("Hinzufügen");
			$('#timaat-actordatasets-actor-metadata-isfictional').prop('checked', false);
			$('#timaat-actordatasets-actor-metadata-name-usedfrom').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
			$('#timaat-actordatasets-actor-metadata-name-useduntil').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
			$('#timaat-actordatasets-person-metadata-dateofbirth').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
			$('#timaat-actordatasets-person-metadata-dayofdeath').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
		},

		actorFormDatasheet: function(action, actorType, actorTypeData) {
    	console.log("TCL: action, actorType, actorTypeData", action, actorType, actorTypeData);
			$('#timaat-actordatasets-actor-metadata-form').trigger('reset');
			$('.datasheet-data').hide();
			$('.name-data').show();
			$('.actor-data').show();
			if (actorType == "actor") {
				$('.actortype-data').show();
			}
			else {
				$('.actortype-data').hide();
			}		
			$('.'+actorType+'-data').show();
			actorFormMetadataValidator.resetForm();

			// show tabs
			$('.'+actorType+'-data-tab').show();
			$('.name-data-tab').show();
			$('.address-data-tab').show();

			if (actorType == "collective") {
				$('.person-data').hide(); // to display title in same row with actor name data
			}
			$('.nav-tabs a[href="#'+actorType+'Datasheet"]').focus();
			$('#timaat-actordatasets-actor-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-actordatasets-actor-metadata-form :input').prop("disabled", true);
				$('.datasheet-form-edit-button').hide();
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit').show();
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit').prop("disabled", false);
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit :input').prop("disabled", false);
				$('.datasheet-form-buttons').hide()
				$('#actorFormHeader').html(actorType+" Datasheet (#"+ actorTypeData.model.id+')');
			}
			else if (action == 'edit') {
				$('.datasheet-form-buttons').hide();
				$('.'+actorType+'-datasheet-form-submit').show();
				$('#timaat-actordatasets-actor-metadata-form :input').prop("disabled", false);
				if (actorType == "actor") {
					$('#timaat-actordatasets-actor-metadata-actortype-id').prop("disabled", true);
				}
				else {
					$('#timaat-actordatasets-actor-metadata-actortype-id').hide();
				}
				$('#timaat-actordatasets-actor-metadata-name-usedfrom').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false, format: 'YYYY-MM-DD'});
				$('#timaat-actordatasets-actor-metadata-name-useduntil').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false, format: 'YYYY-MM-DD'});
				$('#timaat-actordatasets-person-metadata-dateofbirth').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false, format: 'YYYY-MM-DD'});
				$('#timaat-actordatasets-person-metadata-dayofdeath').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false, format: 'YYYY-MM-DD'});
				$('.datasheet-form-edit-button').hide();
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit').prop("disabled", true);
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit :input').prop("disabled", true);
				$('#actorFormHeader').html(actorType+" bearbeiten");
				$('#timaat-actordatasets-'+actorType+'-metadata-form-submit').html("Speichern");
				$('#timaat-actordatasets-actor-metadata-name').focus();
			}

			// setup UI
			var data = actorTypeData.model;
			console.log("TCL: data", data);

			// actor data
			$('#timaat-actordatasets-actor-metadata-actortype-id').val(data.actorType.id);
			// displayName data
			$('#timaat-actordatasets-actor-metadata-name').val(data.displayName.name);
			if(isNaN(moment(data.displayName.usedFrom)))
				$('timaat-actordatasets-actor-metadata-name-usedfrom').val('');
			else $('#timaat-actordatasets-actor-metadata-name-usedfrom').val(moment.utc(data.displayName.usedFrom).format('YYYY-MM-DD'));
			if(isNaN(moment(data.displayName.usedUntil)))
				$('timaat-actordatasets-actor-metadata-name-useduntil').val('');
			else $('#timaat-actordatasets-actor-metadata-name-useduntil').val(moment.utc(data.displayName.usedUntil).format('YYYY-MM-DD'));
			if (data.isFictional)
				$('#timaat-actordatasets-actor-metadata-isfictional').prop('checked', true);
				else $('#timaat-actordatasets-actor-metadata-isfictional').prop('checked', false);

			// actor subtype specific data
			switch (actorType) {
				case 'actor':
					$('#timaat-actordatasets-person-metadata-title').val(data.actorPerson.title);
				case 'person':
					$('#timaat-actordatasets-person-metadata-title').val(data.actorPerson.title);
					if(isNaN(moment(data.actorPerson.dateOfBirth)))
						$('#timaat-actordatasets-person-metadata-dateofbirth').val('');
						else $('#timaat-actordatasets-person-metadata-dateofbirth').val(moment.utc(data.actorPerson.dateOfBirth).format('YYYY-MM-DD'));
					$('#timaat-actordatasets-person-metadata-placeofbirth').val(data.actorPerson.placeOfBirth);
					if(isNaN(moment(data.actorPerson.dayOfDeath)))
						$('#timaat-actordatasets-person-metadata-dayofdeath').val('');
						else $('#timaat-actordatasets-person-metadata-dayofdeath').val(moment.utc(data.actorPerson.dayOfDeath).format('YYYY-MM-DD'));
					$('#timaat-actordatasets-person-metadata-placeofdeath').val(data.actorPerson.placeOfDeath);
					$('#timaat-actordatasets-person-metadata-sex-type').val(data.actorPerson.sex.id);
					// $('#timaat-actordatasets-person-metadata-specialfeatures').val(data.actorPerson.actorPersonTranslations.specialFeatures);
					// TODO remove once location is properly connected
					$('#timaat-actordatasets-person-metadata-placeofbirth').prop("disabled", true);
					$('#timaat-actordatasets-person-metadata-placeofdeath').prop("disabled", true);
				break;
				case 'collective':
					// TODO all collective data
				break;
			}
			$('#timaat-actordatasets-actor-metadata-form').data(actorType, actorTypeData);
		},

		actorFormNames: function(action, actor) {
    	console.log("TCL: actorFormNames: action, actor", action, actor);
			var node = document.getElementById("dynamic-name-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			var node = document.getElementById("new-name-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-actor-actornames-form').trigger('reset');
			actorFormNamesValidator.resetForm();
			// $('.actor-data-tab').show();
			$('.nav-tabs a[href="#actorNames"]').focus();
			$('#timaat-actordatasets-actor-actornames-form').show();
			
			// setup UI
			// display-name data
			var i = 0;
			var numNames = actor.model.actorNames.length;
      // console.log("TCL: actor.model.actorNames", actor.model.actorNames);
			for (; i< numNames; i++) {
				$('[data-role="dynamic-name-fields"]').append(
					`<div class="form-group" data-role="name-entry">
						<div class="form-row">
							<div class="col-sm-1 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayName"></label>
									<input class="form-check-input isDisplayName" type="radio" name="isDisplayName" data-role="displayName[`+actor.model.actorNames[i].id+`]" placeholder="Is Display Name">
								</div>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isBirthName"></label>
									<input class="form-check-input isBirthName" type="radio" name="isBirthName" data-role="birthName[`+actor.model.actorNames[i].id+`] placeholder="Is birth Name"">
								</div>
							</div>
							<div class="col-sm-5 col-md-5">
								<label class="sr-only">Name</label>
								<input class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-name" name="actorName[`+i+`]" data-role="actorName[`+i+`]" value="`+actor.model.actorNames[i].name+`" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" required>
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used from</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-usedfrom" name="nameUsedFrom[`+i+`]" data-role="nameUsedFrom[`+i+`]" placeholder="[Enter name used from]" aria-describedby="Name used from">
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used until</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-useduntil" name="nameUsedUntil[`+i+`]" data-role="nameUsedUntil[`+i+`]" placeholder="[Enter name used until]" aria-describedby="Name used until">
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
					);
					if (actor.model.actorNames[i].id == actor.model.displayName.id) {
						$('[data-role="displayName['+actor.model.actorNames[i].id+']"]')
							.prop("checked",true);
					}
					if (actor.model.birthName && actor.model.actorNames[i].id == actor.model.birthName.id) {
						$('[data-role="birthName['+actor.model.actorNames[i].id+']"]')
							.prop("checked",true);
					}
					if (actor.model.actorNames[i].usedFrom) {
						$('[data-role="nameUsedFrom['+i+']"]').val(moment.utc(actor.model.actorNames[i].usedFrom).format('YYYY-MM-DD'));
					} else {
						$('[data-role="nameUsedFrom['+i+']"]').val('');
					}
					if (actor.model.actorNames[i].usedUntil) {
						$('[data-role="nameUsedUntil['+i+']"]').val(moment.utc(actor.model.actorNames[i].usedUntil).format('YYYY-MM-DD'));
					} else {
						$('[data-role="nameUsedUntil['+i+']"]').val('');
					}
					$('input[name="name['+i+']"').rules("add",
						{
							required: true,
							minlength: 3,
							maxlength: 200,
						});
			}
			if ( action == 'show') {
				$('#timaat-actordatasets-actor-actornames-form :input').prop("disabled", true);
				$('#timaat-actordatasets-actor-actornames-form-edit').show();
				$('#timaat-actordatasets-actor-actornames-form-edit').prop("disabled", false);
				$('#timaat-actordatasets-actor-actornames-form-edit :input').prop("disabled", false);
				$('#timaat-actordatasets-actor-actornames-form-submit').hide();
				$('#timaat-actordatasets-actor-actornames-form-dismiss').hide();
				$('[data-role="new-name-fields"').hide();
				$('.name-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#actorNamesLabel').html("Actor Namensliste");
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-actornames-form-submit').show();
				$('#timaat-actordatasets-actor-actornames-form-dismiss').show();
				$('#timaat-actordatasets-actor-actornames-form :input').prop("disabled", false);
				$('#timaat-actordatasets-actor-actornames-form-edit').hide();
				$('#timaat-actordatasets-actor-actornames-form-edit').prop("disabled", true);
				$('#timaat-actordatasets-actor-actornames-form-edit :input').prop("disabled", true);
				$('[data-role="new-name-fields"').show();
				$('.name-form-divider').show();
				$('#actorNamesLabel').html("Actor Namensliste bearbeiten");
				$('#timaat-actordatasets-actor-actornames-form-submit').html("Speichern");
				$('#timaat-actordatasets-actor-metadata-name').focus();

				// fields for new name entry
				$('[data-role="new-name-fields"]').append(TIMAAT.ActorDatasets.appendNewNameField());

				$('.timaat-actordatasets-actor-actornames-name-usedfrom').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
				$('.timaat-actordatasets-actor-actornames-name-useduntil').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});

				$('#timaat-actordatasets-actor-actornames-form').data('actor', actor);
			}
		},

		actorFormAddresses: function(action, actor) {
    	console.log("TCL: actorFormAddresses: action, actor", action, actor);
			var node = document.getElementById("dynamic-address-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			var node = document.getElementById("new-actorhasaddress-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-actor-addresses-form').trigger('reset');
			actorFormAddressesValidator.resetForm();
			// $('.actor-data-tab').show();
			$('.nav-tabs a[href="#actorAddresses"]').focus();
			$('#timaat-actordatasets-actor-addresses-form').show();
			
			// setup UI
			var i = 0;
			var numAddresses = actor.model.actorHasAddresses.length;
      // console.log("TCL: actor.model.actorHasAddresses", actor.model.actorHasAddresses);
			for (; i< numAddresses; i++) {
				$('[data-role="dynamic-address-fields"]').append(
					`<div class="form-group" data-role="address-entry">
						<div class="form-row">
							<div class="col-md-11">
								<fieldset>
									<legend>Address</legend>
									<div class="form-row align-items-center">
										<div class="col-md-2 col-auto">
											<div class="form-check form-check-inline">
												<input class="form-check-input isPrimaryAddress" type="radio" name="isPrimaryAddress" data-role="primaryAddress[`+actor.model.actorHasAddresses[i].id.addressId+`]" placeholder="Is primary address">
												<label class="form-check-label col-form-label col-form-label-sm" for="isPrimaryAddress">Primary address</label>
											</div>
										</div>
										<div class="col-md-5">
											<label class="col-form-label col-form-label-sm">Street name</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetname" name="streetName[`+i+`]" data-role="streetName[`+i+`]" value="`+actor.model.actorHasAddresses[i].address.streetName+`" placeholder="[Enter street name]" aria-describedby="Street name" minlength="3" maxlength="200" rows="1" readonly="true">
										</div>
										<div class="col-md-2">
											<label class="col-form-label col-form-label-sm">Street number</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetnumber" name="streetNumber[`+i+`]" data-role="streetNumber[`+i+`]" value="`+actor.model.actorHasAddresses[i].address.streetNumber+`" placeholder="[Enter street number]" aria-describedby="Street number" maxlength="10">
										</div>
										<div class="col-md-3">
											<label class="col-form-label col-form-label-sm">Street addition</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetaddition" name="streetAddition[`+i+`]" data-role="streetAddition[`+i+`]" value="`+actor.model.actorHasAddresses[i].address.streetAddition+`" placeholder="[Enter street addition]" aria-describedby="Street addition" maxlength="50">
										</div>
									</div>
									<div class="form-row">
										<div class="col-md-3">
											<label class="col-form-label col-form-label-sm">Postal code</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postalcode" name="postalCode[`+i+`]" data-role="postalCode[`+i+`]" value="`+actor.model.actorHasAddresses[i].address.postalCode+`" placeholder="[Enter postal code]" aria-describedby="Postal code" maxlength="8">
										</div>
										<div class="col-md-6">
											<label class="col-form-label col-form-label-sm">City</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-city" name="cityName[`+i+`]" data-role="cityName[`+i+`]" value="`+actor.model.actorHasAddresses[i].address.cityName+`" placeholder="[Enter city]" aria-describedby="City" readonly="true">
										</div>
										<div class="col-md-3">
											<label class="col-form-label col-form-label-sm">Post office box</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postofficebox" name="postOfficeBox[`+i+`]" data-role="postOfficeBox[`+i+`]" value="`+actor.model.actorHasAddresses[i].address.postOfficeBox+`" placeholder="[Enter post office box]" aria-describedby="Post office box" maxlength="10">
										</div>
									</div>
									<div class="form-row">
										<div class="col-md-4">
											<label class="col-form-label col-form-label-sm">Address type*</label>
											<select class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-addresstype-id" name="addressTypeId[`+i+`]" data-role="addressTypeId[`+actor.model.actorHasAddresses[i].addressType.id+`]" required>
												<-- <option value="" disabled selected hidden>[Choose address type...]</option>
												<option value="1"> </option>
												<option value="2">business</option>
												<option value="3">home</option>
												<option value="4">other</option>
											</select>
										</div>
										<div class="col-md-4">
											<label class="col-form-label col-form-label-sm">Address used from</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-usedfrom" name="addressUsedFrom[`+i+`]" data-role="addressUsedFrom[`+i+`]" placeholder="[Enter used from]" aria-describedby="Address used from">
										</div>
										<div class="col-md-4">
											<label class="col-form-label col-form-label-sm">Address used until</label>
											<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-useduntil" name="addressUsedUntil[`+i+`]" data-role="addressUsedUntil[`+i+`]" placeholder="[Enter used until]" aria-describedby="Address used until">
										</div>
									</div>
								</fieldset>
							</div>
							<div class="col-md-1 vertical-aligned">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
				);
				if (actor.model.primaryAddress && actor.model.actorHasAddresses[i].id.addressId == actor.model.primaryAddress.id) {
					$('[data-role="primaryAddress['+actor.model.actorHasAddresses[i].id.addressId+']"]')
						.prop("checked",true);
				}
				if (actor.model.actorHasAddresses[i].usedFrom) {
					$('[data-role="addressUsedFrom['+i+']"]').val(moment.utc(actor.model.actorHasAddresses[i].usedFrom).format('YYYY-MM-DD'));
				} else {
					$('[data-role="addressUsedFrom['+i+']"]').val('');
				}
				if (actor.model.actorHasAddresses[i].usedUntil) {
					$('[data-role="addressUsedUntil['+i+']"]').val(moment.utc(actor.model.actorHasAddresses[i].usedUntil).format('YYYY-MM-DD'));
				} else {
					$('[data-role="addressUsedUntil['+i+']"]').val('');
				}
				$('input[name="name['+i+']"').rules("add", { required: true, minlength: 3, maxlength: 200});
				$('[data-role="addressTypeId['+actor.model.actorHasAddresses[i].addressType.id+']"')
					.find('option[value='+actor.model.actorHasAddresses[i].addressType.id+']')
					.attr("selected",true);
			}
			if ( action == 'show') {
				$('#timaat-actordatasets-actor-addresses-form :input').prop("disabled", true);
				$('#timaat-actordatasets-actor-addresses-form-edit').show();
				$('#timaat-actordatasets-actor-addresses-form-edit').prop("disabled", false);
				$('#timaat-actordatasets-actor-addresses-form-edit :input').prop("disabled", false);
				$('#timaat-actordatasets-actor-addresses-form-submit').hide();
				$('#timaat-actordatasets-actor-addresses-form-dismiss').hide();
				$('[data-role="new-actorhasaddress-fields"').hide();
				$('.address-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#actorAddressesLabel').html("Actor Addressensliste");
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-addresses-form-submit').show();
				$('#timaat-actordatasets-actor-addresses-form-dismiss').show();
				$('#timaat-actordatasets-actor-addresses-form :input').prop("disabled", false);
				$('#timaat-actordatasets-actor-addresses-form-edit').hide();
				$('#timaat-actordatasets-actor-addresses-form-edit').prop("disabled", true);
				$('#timaat-actordatasets-actor-addresses-form-edit :input').prop("disabled", true);
				$('[data-role="new-actorhasaddress-fields"').show();
				$('.address-form-divider').show();
				$('#actorAddressesLabel').html("Actor Addressensliste bearbeiten");
				$('#timaat-actordatasets-actor-addresses-form-submit').html("Speichern");
				$('#timaat-actordatasets-actor-metadata-address').focus();

				// fields for new address entry
				$('[data-role="new-actorhasaddress-fields"]').append(TIMAAT.ActorDatasets.appendNewAddressField());

				$('.timaat-actordatasets-actor-addresses-address-usedfrom').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
				$('.timaat-actordatasets-actor-addresses-address-useduntil').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});

				console.log("TCL: actor", actor);
				$('#timaat-actordatasets-actor-addresses-form').data('actor', actor);
			}
		},

		actorFormEmailAddresses: function(action, actor) {

		},

		actorFormPhoneNumbers: function(action, actor) {

		},

		createActor: async function(actorType, actorModel, actorSubtypeModel, displayName) {
			console.log("TCL: createActor: async function(actorType, actorModel, displayName)", actorType, actorModel, displayName);
			// createActor: async function(actorType, actorModel, actorSubtypeModel, displayName, address, email, phoneNumber) {
			// 	console.log("TCL: createActor: async function(actorType, actorModel, displayName, address, email, phoneNumber)", actorType, actorModel, displayName, address, email, phoneNumber);
			// // try {
			// 	// create primary address
			// 	var newPrimaryAddress = null;
			// 	if (address.length > 0) {
			// 		newPrimaryAddress = await TIMAAT.ActorService.createAddress(address);
			// 	}
			// } catch(error) {
			// 	console.log( "error: ", error);
			// }
			// try {
			// 	// create primary email
			// 	var newPrimaryEmailAddress = null;
			// 	if (email.length > 0) {
			// 		newPrimaryEmailAddress = await TIMAAT.ActorService.createEmail(email);
			// 	}
			// } catch(error) {
			// 	console.log( "error: ", error);
			// }
			// try {
			// 	// create primary phone number
			// 	var newPrimaryPhoneNumber = null;
			// 	if (phoneNumber.length > 0) {
			// 		newPrimaryPhoneNumber = await TIMAAT.ActorService.createPhoneNumber(phoneNumber);
			// 	}
			// } catch(error) {
			// 	console.log( "error: ", error);
			// }
			try {
				// create actor
				var tempActorModel = actorModel;
				var newActorModel = await TIMAAT.ActorService.createActor(tempActorModel);
        console.log("TCL: newActorModel", newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			}
			try {
				// create display name
				var newDisplayName = await TIMAAT.ActorService.addName(newActorModel.id, displayName);
				newActorModel.displayName = newDisplayName;
				newActorModel.actorNames[0] = newDisplayName;
        console.log("TCL: newActorModel", newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			}
			try {
				// create person translation with person id
				if (actorType == "person" && actorSubtypeModel.personTranslations != null) {
					await TIMAAT.ActorService.createPersonTranslation(newActorModel, actorSubtypeModel.personTranslations);
					actorSubtypeModel.personTranslations[0] = personModelTranslation;
				}
			} catch(error) {
				console.log( "error: ", error);
			}
			try {
				// create actorSubtype with actor id
				actorSubtypeModel.actorId = newActorModel.id;
				var newActorSubtypeModel = await TIMAAT.ActorService.createActorSubtype(actorType, newActorModel, actorSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			}
			try {
				// push new actor to dataset model
				console.log("TCL: newActorModel", newActorModel);
				switch (actorType) {
					case 'person':
						newActorModel.actorPerson = actorSubtypeModel;
					break;
					case 'collective':
						newActorModel.actorCollective = actorSubtypeModel;
					break;
				}
				console.log("TCL: newActorModel", newActorModel);
				await TIMAAT.ActorDatasets._actorAdded(actorType, newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		createName: async function(nameModel) {
			// console.log("TCL: createName: async function -> nameModel", nameModel);
			try {
				// create name
				var newNameModel = await TIMAAT.ActorService.createName(nameModel.model);
        console.log("TCL: newNameModel", newNameModel);
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		addNames: async function(actor, newNames) {
			// console.log("TCL: addNames: async function -> actor, newNames", actor, newNames);
			try {
				// create name
				var i = 0;
				for (; i <newNames.length; i++) {
					// var newName = await TIMAAT.ActorService.createName(newNames[i]);
					var addedNameModel = await TIMAAT.ActorService.addName(actor.model.id, newNames[i]);
					actor.model.actorNames.push(addedNameModel);
					console.log("TCL: actor.model.actorNames", actor.model.actorNames);
					console.log("TCL: actor.model.actorNames.length", actor.model.actorNames.length);	
				}
				// await TIMAAT.ActorDatasets.updateActor(actorType, actor);
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		addActorHasAddresses: async function(actor, newActorHasAddresses) {
			console.log("TCL: addActorHasAddresses: async function -> actor, newActorHasAddresses", actor, newActorHasAddresses);
			try {
				// create address
				var i = 0;
				for (; i <newActorHasAddresses.length; i++) {
					// modify models for backend
					var tempAddress = newActorHasAddresses[i].address;
					var tempActorHasAddress = newActorHasAddresses[i];
					tempAddress.street = {};
					tempAddress.street = { locationId: 282 }; // TODO temporarily until street location is properly connected
					delete tempAddress.streetName;
					delete tempAddress.cityName;
					delete tempActorHasAddress.address;
					
					var addedAddressModel = await TIMAAT.ActorService.addAddress(actor.model.id, tempAddress);
					var addedActorHasAddressModel = await TIMAAT.ActorService.updateActorHasAddress(actor.model.id, addedAddressModel.id, tempActorHasAddress);
					addedActorHasAddressModel.address = {};
					addedActorHasAddressModel.address = addedAddressModel;
					addedActorHasAddressModel.address.streetName = 'TEMP NAME';
					addedActorHasAddressModel.address.cityName = 'TEMP NAME';
					actor.model.actorHasAddresses.push(addedActorHasAddressModel);
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		createEmailAddress: async function(emailAddressModel) {

		},

		addEmailAddresses: async function(actor, newEmailAddresses) {

		},

		createPhoneNumber: async function(phoneNumberModel) {

		},

		addPhoneNumbers: async function(actor, newPhoneNumbers) {

		},

		updateActor: async function(actorSubtype, actor) {
			console.log("TCL: updateActor: async function: ", actorSubtype, actor);
				try {
					// update birth name
					if (actor.model.birthName) { // actor initially has no birth name set
						var tempBirthName = await TIMAAT.ActorService.updateName(actor.model.birthName);
						actor.model.birthName = tempBirthName;
					}

					var tempDisplayName = await TIMAAT.ActorService.updateName(actor.model.displayName);
					actor.model.displayName = tempDisplayName;

				// update primary address
				if (actor.model.primaryAddress) { // actor initially has no primary address set
					var tempPrimaryAddress = await TIMAAT.ActorService.updateAddress(actor.model.primaryAddress);
					actor.model.primaryAddress = tempPrimaryAddress;
				}

				} catch(error) {
					console.log( "error: ", error);
				}
	
				try {
					// update data that is part of actorSubtypeData
					var tempSubtypeModel;
					switch (actorSubtype) {
						case 'person':
							tempSubtypeModel = actor.model.actorPerson;
							// TODO remove deletions once implemented
							delete tempSubtypeModel.placeOfBirth;
							delete tempSubtypeModel.placeOfDeath;
							delete tempSubtypeModel.actorPersonIsMemberOfActorCollectives;
							delete tempSubtypeModel.actorPersonTranslations;
							delete tempSubtypeModel.citizenships;
						break;
						case 'collective':
							tempSubtypeModel = actor.model.actorCollective;
							break;
					}
					var tempActorSubtypeModel = await TIMAAT.ActorService.updateActorSubtype(actorSubtype, tempSubtypeModel);
				} catch(error) {
					console.log( "error: ", error);
				}
	
				try {
					// update data that is part of actor (includes updating last edited by/at)
					// update display name
					// var tempDisplayName = await TIMAAT.ActorService.updateName(actor.model.displayName);
					var tempActorModel = await TIMAAT.ActorService.updateActor(actor.model);

					// actor.model.displayName = tempDisplayName;

					console.log("TCL: tempActorModel", tempActorModel);
				} catch(error) {
					console.log( "error: ", error);
				}
				actor.updateUI();
		},

		updateName: async function(name, actor) {
			console.log("TCL: updateName: async function -> name at beginning of update process: ", name, actor);
			try {
				// update name
				var tempName = await TIMAAT.ActorService.updateName(name);
				console.log("TCL: tempName", tempName);
				var i = 0;
				for (; i < actor.model.actorNames.length; i++) {
					if (actor.model.actorNames[i].id == name.id)
						actor.model.actorNames[i] = tempName;
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		updateActorHasAddress: async function(actorHasAddress, actor) {
			console.log("TCL: updateActorHasAddress: async function -> actorHasAddress at beginning of update process: ", actorHasAddress, actor);
			try {
				// update address
				var tempActorHasAddress = actorHasAddress;
				var tempAddress = actorHasAddress.address;
				// modify models for backend
				delete tempActorHasAddress.address;
				delete tempAddress.streetName;
				delete tempAddress.cityName;
				var updatedTempAddress = await TIMAAT.ActorService.updateAddress(tempAddress);
				tempActorHasAddress.id.actorId = actor.model.id;
				tempActorHasAddress.id.addressId = updatedTempAddress.id;
				var updatedTempActorHasAddress = await TIMAAT.ActorService.updateActorHasAddress(actorHasAddress.id.actorId, actorHasAddress.id.addressId, tempActorHasAddress);
				updatedTempActorHasAddress.address = updatedTempAddress;
				updatedTempActorHasAddress.address.streetName = 'TEMP NAME';
				updatedTempActorHasAddress.address.cityName = 'TEMP NAME';

				var i = 0;
				for (; i < actor.model.actorHasAddresses.length; i++) {
					if (actor.model.actorHasAddresses[i].id == actorHasAddress.id)
						actor.model.actorHasAddresses[i] = updatedTempActorHasAddress;
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		_actorAdded: function(actorSubtype, actor) {
			try {
				console.log("TCL: _actorSubtypeAdded: function(actorSubtype, actor)");
				// console.log("TCL: actorSubtype", actorSubtype);
				// console.log("TCL: actor", actor);
				switch (actorSubtype) {
					case 'person':
						TIMAAT.ActorDatasets.persons.model.push(actor);
						var newActor = new TIMAAT.Actor(actor, 'person');
						TIMAAT.ActorDatasets.persons.push(newActor);
					break;
					case 'collective':
						TIMAAT.ActorDatasets.collectives.model.push(actor);
						var newActor = new TIMAAT.Actor(actor, 'collective');
						TIMAAT.ActorDatasets.collectives.push(newActor);
					break;
				}
				TIMAAT.ActorDatasets.actors.model.push(actor);
				TIMAAT.ActorDatasets.actors.push(newActor);
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		_actorRemoved: async function(actor) {
    	console.log("TCL: actor", actor);
			// sync to server
			// remove actor from all collections it is part of
			// function isActorInActorCollectionHasActors(actor, acha) {
			// 	if (acha.filter(x => x.actor.id == actor.id)) {
			// 		return true
			// 	} else
			// 	return false;
			// }
			// var i = 0;
			// for (; i < TIMAAT.VideoChooser.collections.length; i++) {
			// 	if (isActorInActorCollectionHasActors(actor, TIMAAT.VideoChooser.collections[i].actorCollectionHasActors)) {
			// 		await TIMAAT.Service.removeCollectionItem(TIMAAT.VideoChooser.collections[i], actor.model);
			// 	}
			// }

			TIMAAT.ActorService.removeActor(actor);
			actor.remove();
		},

		_actorSubtypeRemoved: function(actorSubtype, actorSubtypeData) {
			console.log("TCL: _actorSubtypeRemoved: function(actorSubtype, actorSubtypeData)", actorSubtype, actorSubtypeData);
			// sync to server
			TIMAAT.ActorService.removeActorSubtype(actorSubtype, actorSubtypeData);
			actorSubtypeData.remove();
		},

		updateActorModelData: function(actor, formDataObject) {
    console.log("TCL: updateActorModelData: actor, formDataObject", actor, formDataObject);
			// actor data
			actor.model.isFictional = (formDataObject.isFictional == "on") ? true : false;
			// displayName data
			actor.model.displayName.name = formDataObject.displayName;
			actor.model.displayName.usedFrom = moment.utc(formDataObject.nameUsedFrom, "YYYY-MM-DD");
			actor.model.displayName.usedUntil = moment.utc(formDataObject.nameUsedUntil, "YYYY-MM-DD");
			var i = 0;
			for (; i < actor.model.actorNames.length; i++) {
				if (actor.model.actorNames[i].isDisplayName) {
					actor.model.actorNames[i] = actor.model.displayName;
					break;
				}
			}
			switch (actor.model.actorType.actorTypeTranslations[0].type) {
				case 'person':
					actor.model.actorPerson.title = formDataObject.title;
				break;
				case 'collective':
				break;
			}
			// phone number data
			// if (!(formDataObject.phoneNumber == ""
			// 		&& formDataObject.phoneNumberTypeId == ""
			// 		&& formDataObject.iddPrefix == ""
			// 		&& formDataObject.areaCode == ""
			// 		&& actor.model.primaryPhoneNumber == null)) {
			// 	actor.model.primaryPhoneNumber.iddPrefix = formDataObject.iddPrefix;
			// 	actor.model.primaryPhoneNumber.areaCode = formDataObject.areaCode;
			// 	actor.model.primaryPhoneNumber.number = formDataObject.phoneNumber;
			// 	actor.model.primaryPhoneNumber.type = formDataObject.phoneNumberTypeId;
			// 	for (; i < actor.model.actorHasPhoneNumbers.length; i++) {
			// 		if (actor.model.primaryPhoneNumber.id == actor.model.actorHasPhoneNumbers[i].id) {
			// 			actor.model.actorHasPhoneNumbers[i] = actor.model.primaryPhoneNumber;
			// 			break;
			// 		}
			// 	}
			// }
			// address data
			// if (!(formDataObject.street == "" 
			// 		&& formDataObject.streetNumber == "" 
			// 		&& formDataObject.streetAddition == "" 
			// 		&& formDataObject.postalCode == "" 
			// 		&& formDataObject.postOfficeBox == ""
			// 		&& formDataObject.addressTypeId == ""
			// 		&& formDataObject.addressUsedFrom == ""
			// 		&& formDataObject.addressUsedUntil == ""
			// 		&& actor.model.primaryAddress == null)) {
			// 	actor.model.primaryAddress.street = formDataObject.street;
			// 	actor.model.primaryAddress.streetNumber = formDataObject.streetNumber;
			// 	actor.model.primaryAddress.streetAddition = formDataObject.streetAddition;
			// 	actor.model.primaryAddress.postalCode = formDataObject.postalCode;
			// 	actor.model.primaryAddress.postOfficeBox = formDataObject.postOfficeBox;
			// 	actor.model.primaryAddress.type = formDataObject.addressTypeId;
			// 	actor.model.primaryAddress.usedFrom = moment.utc(formDataObject.addressUsedFrom, "YYYY-MM-DD");
			// 	actor.model.primaryAddress.usedUntil = moment.utc(formDataObject.addressUsedUntil, "YYYY-MM-DD");
			// 	for (; i < actor.model.actorHasAddresses.length; i++) {
			// 		if (actor.model.primaryAddress.id == actor.model.actorHasAddresses[i].id) {
			// 			actor.model.actorHasAddresses[i] = actor.model.primaryAddress;
			// 			break;
			// 		}
			// 	}
			// }
			// email address data
			// if (!(formDataObject.emailAddress == ""
			// 		&& formDataObject.emailTypeId == ""
			// 		&& actor.model.primaryEmailAddress == null)) {
			// 	actor.model.primaryEmailAddress.address = formDataObject.emailAddress;
			// 	actor.model.primaryEmailAddress.type = formDataObject.emailTypeId;
			// 	for (; i < actor.model.actorHasEmailAddresses.length; i++) {
			// 		if (actor.model.primaryAddress.id == actor.model.actorHasEmailAddresses[i].id) {
			// 			actor.model.actorHasEmailAddresses[i] = actor.model.primaryAddress;
			// 			break;
			// 		}
			// 	}
			// }

			return actor;
		},

		createActorModel: function(formDataObject, actorTypeId) {
		// console.log("TCL: createActorModel: formDataObject", formDataObject);
			var actorModel = {
				id: 0,
				isFictional: (formDataObject.isFictional == "on") ? true : false,
				actorType: {
					id: Number(actorTypeId),
				},
				displayName: {
					name: formDataObject.displayName,
					isDisplayName: true,
					usedFrom: moment.utc(formDataObject.nameUsedFrom, "YYYY-MM-DD"),
					usedUntil: moment.utc(formDataObject.nameUsedUntil, "YYYY-MM-DD"),
				},
				actorNames: [{}],
				actorHasPhoneNumbers: [{}],
				actorHasAddresses: [{}],
				actorHasEmailAddresses: [{}],
			};
			console.log("TCL: actorModel", actorModel);
			return actorModel;
		},

		createPersonModel: function(formDataObject) {
    	console.log("TCL: createPersonModel: formDataObject", formDataObject);
			var personModel = {
				actorId: 0,
				title: formDataObject.title,
				dateOfBirth: moment.utc(formDataObject.dateOfBirth, "YYYY-MM-DD"),
				placeOfBirth: {
					id: (formDataObject.placeOfBirth == "") ? null : Number(formDataObject.placeOfBirth),
					},
				dayOfDeath: moment.utc(formDataObject.dayOfDeath, "YYYY-MM-DD"),
				placeOfDeath: {
					id: (formDataObject.placeOfDeath == "") ? null : Number(formDataObject.placeOfDeath),
				},
				sex: {
					id: Number(formDataObject.sexId),
				},
				// actorPersonTranslations: [{
				// 	id: 0,
				// 	language: {
				// 		id: 1 // TODO change to correct language
				// 	},
				// 	specialFeatures: formDataObject.specialFeatures,
				// }],
				// citizenships : null
			};
      console.log("TCL: personModel", personModel);
			return personModel;
		},

		createCollectiveModel: function(formDataObject) {
    // console.log("TCL: createCollectiveModel: formDataObject", formDataObject);
			var collectiveModel = {
				actorId: 0,
			};
			console.log("TCL: collectiveModel", collectiveModel);
			return collectiveModel;
		},

		createNameModel: function(formDataObject) {
    // console.log("TCL: createNameModel: formDataObject", formDataObject);
			var name = {
				id: 0,
				name: formDataObject.displayName,
				usedFrom: moment.utc(formDataObject.nameUsedFrom, "YYYY-MM-DD"),
				usedUntil: moment.utc(formDataObject.nameUsedUntil, "YYYY-MM-DD"),
				isDisplayName: true,
			};
      console.log("TCL: name", name);
			return name;
		},

		createActorHasAddressModel: function(data, actorId, addressId) {
    	// console.log("TCL: data, actorId, addressId", data, actorId, addressId);
			var actorHasAddressModel = {};
			actorHasAddressModel.id = {
				actorId: actorId,
				addressId: addressId
			};
			actorHasAddressModel.usedFrom = data.addressUsedFrom;
			actorHasAddressModel.usedUntil = data.addressUsedUntil;
			actorHasAddressModel.address = {
				id: addressId,
				postOfficeBox: data.postOfficeBox,
				postalCode: data.postalCode,
				streetNumber: data.streetNumber,
				streetAddition: data.streetAddition,
				streetName: 'TEMP NAME',
				cityName: 'TEMP NAME',
			};
			actorHasAddressModel.addressType = TIMAAT.ActorDatasets.addressTypes[Number(data.addressTypeId)-1];
			return actorHasAddressModel;
		},

		updateActorHasAddressModel: function(originalModel, data) {
			var updatedModel = originalModel;
			updatedModel.usedFrom = data.addressUsedFrom;
			updatedModel.usedUntil = data.addressUsedUntil;
			updatedModel.addressType = TIMAAT.ActorDatasets.addressTypes[Number(data.addressTypeId)-1];
			updatedModel.address.postOfficeBox = data.postOfficeBox;
			updatedModel.address.postalCode = data.postalCode;
			updatedModel.address.streetNumber = data.streetNumber;
			updatedModel.address.streetAddition = data.streetAddition;
			return updatedModel;
		},

		createEmailModel: function(formDataObject) {
    // console.log("TCL: createEmailModel: formDataObject", formDataObject);
			var primaryEmail = {};
			if (!(formDataObject.emailAddress == ""
					&& formDataObject.emailTypeId == "")) {
				primaryEmail = {
					email: formDataObject.emailAddress,
					type: Number(formDataObject.emailTypeId),
				};
        console.log("TCL: primaryEmail", primaryEmail);
			}
			return primaryEmail
		},

		createPhoneNumberModel: function(formDataObject) {
    // console.log("TCL: createPhoneNumberModel: formDataObject", formDataObject);
			var primaryPhoneNumber = {};
			if (!(formDataObject.phoneNumber == ""
					&& formDataObject.phoneNumberTypeId == ""
					&& formDataObject.iddPrefix == ""
					&& formDataObject.areaCode == "")) {
				primaryPhoneNumber = {
				number: formDataObject.phoneNumber,
				areaCode: formDataObject.areaCode,
				iddPrefix: formDataObject.iddPrefix,
				type: Number(formDataObject.phoneNumberTypeId),
			}
        console.log("TCL: primaryPhoneNumber", primaryPhoneNumber);
			}
			return primaryPhoneNumber;
		},

		createCitizenshipModel: function(formDataObject) {
    // console.log("TCL: createCitizenshipModel: formDataObject", formDataObject);
			var citizenshipModel = null;
			if(!(formDataObject.citizenshipName == "")) {
				citizenshipModel = [{
					id: 0,
					citizenshipTranslation: {
						id: 0,
						language: {
							id: 0,
						},
						name: formDataObject.citizenshipName,
					}
				}];
				console.log("TCL: citizenshipModel", citizenshipModel);
			}
			return citizenshipModel;
		},

		appendNewNameField: function() {
			var nameToAppend =
				`<div class="form-group" data-role="name-entry">
				<div class="form-row">
					<div class="col-md-2 text-center">
						<div class="form-check">
							<span>Add new name:</span>
						</div>
					</div>
					<div class="col-md-5">
						<label class="sr-only">Name*</label>
						<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-name" name="actorName" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" data-role="actorName" required>
					</div>
					<div class="col-md-2">
						<label class="sr-only">Name used from</label>
						<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-usedfrom" id="timaat-actordatasets-actor-actornames-name-usedfrom" name="nameUsedFrom" placeholder="[Enter name used from]" aria-describedby="Name used from">
					</div>
					<div class="col-md-2">
						<label class="sr-only">Name used until</label>
						<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-useduntil" id="timaat-actordatasets-actor-actornames-name-useduntil" name="nameUsedUntil" placeholder="[Enter name used until]" aria-describedby="Name used until">
					</div>
					<div class="col-md-1">
						<button class="btn btn-primary" data-role="add">
							<span class="fas fa-plus"></span>
						</button>
					</div>
				</div>
			</div>`;
			return nameToAppend;
		},

		appendNewAddressField: function() {
			var addressToAppend =
			`<div class="form-group" data-role="address-entry">
				<div class="form-row">
					<div class="col-md-11">
						<fieldset>
							<legend>Add new Address: (NB: Streetname and city currently not implemented!)</legend>
							<div class="form-row">
								<div class="col-md-6">
									<label class="col-form-label col-form-label-sm">Street name</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetname" name="streetName" data-role="streetName" placeholder="[Enter street name]" value="TEMP NAME" aria-describedby="Street name" minlength="3" maxlength="200" rows="1" readonly="true">
								</div>
								<div class="col-md-2">
									<label class="col-form-label col-form-label-sm">Street number</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetnumber" name="streetNumber" data-role="streetNumber" placeholder="[Enter street number]" aria-describedby="Street number" maxlength="10">
								</div>
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Street addition</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetaddition" name="streetAddition" data-role="streetAddition" placeholder="[Enter street addition]" aria-describedby="Street addition" maxlength="50">
								</div>
							</div>
							<div class="form-row">
								<div class="col-md-3">
									<label class="col-form-label col-form-label-sm">Postal code</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postalcode" name="postalCode" data-role="postalCode" placeholder="[Enter postal code]" aria-describedby="Postal code" maxlength="8">
								</div>
								<div class="col-md-6">
									<label class="col-form-label col-form-label-sm">City</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-city" name="cityName" data-role="city" placeholder="[Enter city]" value="TEMP NAME" aria-describedby="City" readonly="true">
								</div>
								<div class="col-md-3">
									<label class="col-form-label col-form-label-sm">Post office box</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postofficebox" name="postOfficeBox" data-role="postOfficeBox" placeholder="[Enter post office box]" aria-describedby="Post office box" maxlength="10">
								</div>
							</div>
							<div class="form-row">
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Address type*</label>
									<select class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-addresstype-id" name="addressTypeId" data-role="addressTypeId" required>
										<option value="" disabled selected hidden>[Choose address type...]</option>
										<option value="1"> </option>
										<option value="2">business</option>
										<option value="3">home</option>
										<option value="4">other</option>
									</select>
								</div>
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Address used from</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-usedfrom" id="timaat-actordatasets-actor-addresses-address-usedfrom" name="addressUsedFrom" data-role="addressUsedFrom" placeholder="[Enter used from]" aria-describedby="Address used from">
								</div>
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Address used until</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-useduntil" id="timaat-actordatasets-actor-addresses-address-useduntil" name="addressUsedUntil" data-role="addressUsedUntil" placeholder="[Enter used until]" aria-describedby="Address used until">
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col-md-1 vertical-aligned">
						<button class="btn btn-primary" data-role="add">
							<span class="fas fa-plus"></span>
						</button>
					</div>
				</div>
			</div>`;
			return addressToAppend;
		},

	}
	
}, window));
