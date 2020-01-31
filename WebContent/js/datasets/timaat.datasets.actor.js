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
		
		init: function() {   
			TIMAAT.ActorDatasets.initActors();
			TIMAAT.ActorDatasets.initPersons();
			TIMAAT.ActorDatasets.initCollectives();
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
					}
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

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-actor-metadata-form').data('actor');				
				// console.log("TCL: actor", actor);

				// Create/Edit actor window submitted data
				var formData = $('#timaat-actordatasets-actor-metadata-form').serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (actor) { // update actor
					// actor data
					actor = await TIMAAT.ActorDatasets.updateActorModelData(actor, formDataObject);

					actor.updateUI();
					await TIMAAT.ActorDatasets.updateActor(actor);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', "actor", actor);
				} else { // create new actor
					var actorModel = await TIMAAT.ActorDatasets.createActorModel(formDataObject, formDataObject.typeId);
					var displayName = await TIMAAT.ActorDatasets.createDisplayNameModel(formDataObject);
					var primaryAddress = await TIMAAT.ActorDatasets.createAddressModel(formDataObject);
					var primaryEmail = await TIMAAT.ActorDatasets.createEmailModel(formDataObject);
					var primaryPhoneNumber = await TIMAAT.ActorDatasets.createPhoneNumberModel(formDataObject);
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
						await TIMAAT.ActorDatasets.createActor(actorType, actorModel, displayName, primaryAddress, primaryEmail, primaryPhoneNumber);
						var actor = TIMAAT.ActorDatasets.actor[TIMAAT.ActorDatasets.actor.length-1];
						TIMAAT.ActorDatasets.actorFormDatasheet('show', "actor", actor);
						// $('#timaat-actordatasets-actor-metadata-form').data('actor', actor); //? needed or not?
					}
				};
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

				// the original person model (in case of editing an existing person)
				var person = $('#timaat-actordatasets-actor-metadata-form').data('actor');		

				// Create/Edit person window submitted data
				var formData = $("#timaat-actordatasets-actor-metadata-form").serializeArray();
        // console.log("TCL: formData", formData);
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				formDataObject.isFictional = (formDataObject.personIsFictional) ? true : false;
				formDataObject.sexId = (formDataObject.sexId) ? formDataObject.sexId : 4; // set default to 'unknown' (id 4)
				formDataObject.displayName = formDataObject.personDisplayName;
				formDataObject.nameUsedFrom = moment.utc(formDataObject.personNameUsedFrom, "YYY-MM-DD");
				formDataObject.nameUsedUntil = moment.utc(formDataObject.personNameUsedUntil, "YYY-MM-DD");
				// console.log("TCL: formDataObject", formDataObject);

				if (person) { // update person
					// actor data
					person = await TIMAAT.ActorDatasets.updateActorModelData(person, formDataObject);
					// person data
					person.model.actorPerson.title = formDataObject.title;
					person.model.actorPerson.dateOfBirth = moment.utc(formDataObject.dateOfBirth, "YYY-MM-DD");
					person.model.actorPerson.placeOfBirth = formDataObject.placeOfBirth;
					person.model.actorPerson.dayOfDeath = moment.utc(formDataObject.dayOfDeath, "YYY-MM-DD");
					person.model.actorPerson.placeOfDeath = formDataObject.placeOfDeath;
					person.model.actorPerson.sex.id = Number(formDataObject.sexId);
					person.model.actorPerson.citizenship[0].name = formDataObject.citizenshipName; //? correct structure?
					person.model.actorPerson.specialFeatures = formDataObject.specialFeatures;

					person.updateUI();
					await TIMAAT.ActorDatasets.updateActorSubtype('person', person);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', person);
				} else { // create new person
					var personModel = await TIMAAT.ActorDatasets.createPersonModel(formDataObject);
					var actorModel = await TIMAAT.ActorDatasets.createActorModel(formDataObject, 1); // 1 = Person. TODO check clause to find proper id
					var displayName = await TIMAAT.ActorDatasets.createDisplayNameModel(formDataObject);
					var primaryAddress = await TIMAAT.ActorDatasets.createAddressModel(formDataObject);
					var primaryEmail = await TIMAAT.ActorDatasets.createEmailModel(formDataObject);
					var primaryPhoneNumber = await TIMAAT.ActorDatasets.createPhoneNumberModel(formDataObject);
					
					await TIMAAT.ActorDatasets.createActor('person', actorModel, personModel, displayName, primaryAddress, primaryEmail, primaryPhoneNumber);
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

				// the original collective model (in case of editing an existing collective)
				var collective = $('#timaat-actordatasets-actor-metadata-form').data('actor');		

				// Create/Edit collective window submitted data
				var formData = $("#timaat-actordatasets-actor-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				formDataObject.isFictional = (formDataObject.collectiveIsFictional) ? true : false;
				formDataObject.sexId = (formDataObject.sexId) ? formDataObject.sexId : 4; // set default to 'unknown' (id 4)
				formDataObject.displayName = formDataObject.collectiveDisplayName;
				formDataObject.nameUsedFrom = moment.utc(formDataObject.collectivenNameUsedFrom, "YYY-MM-DD");
				formDataObject.nameUsedUntil = moment.utc(formDataObject.collectiveNameUsedUntil, "YYY-MM-DD");

				if (collective) { // update collective
					// actor data
					collective = await TIMAAT.ActorDatasets.updateActorModelData(collective, formDataObject);
					// collective data

					collective.updateUI();
					await TIMAAT.ActorDatasets.updateActorSubtype('collective', collective);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', collective);
				} else { // create new collective
					var collectiveModel = await TIMAAT.ActorDatasets.createCollectiveModel(formDataObject);
					var actorModel = await TIMAAT.ActorDatasets.createActorModel(formDataObject, 2); // 2 = Collective. TODO check clause to find proper id
					var displayName = await TIMAAT.ActorDatasets.createDisplayNameModel(formDataObject);
					var primaryAddress = await TIMAAT.ActorDatasets.createAddressModel(formDataObject);
					var primaryEmail = await TIMAAT.ActorDatasets.createEmailModel(formDataObject);
					var primaryPhoneNumber = await TIMAAT.ActorDatasets.createPhoneNumberModel(formDataObject);

					await TIMAAT.ActorDatasets.createActor('collective', actorModel, collectiveModel, displayName, primaryAddress, primaryEmail, primaryPhoneNumber);
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
			$('#actors-tab-names-form').click(function(event) {
				$('.nav-tabs a[href="#actorNames"]').tab('show');
				$('.form').hide();
				TIMAAT.ActorDatasets.setActorNameList($('#timaat-actordatasets-actor-metadata-form').data('actor'))
				$('#timaat-actordatasets-actor-names-form').show();
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
			
			// edit names form button handler
			$('#timaat-actordatasets-actor-names-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormNames('edit', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// Add name button click
			$(document).on('click','[data-role="new-name-fields"] > .form-group [data-role="add"]', function(e) {
				e.preventDefault();
				console.log("TCL: add name to list");
				var listEntry = $(this).closest('[data-role="new-name-fields"]');
				var name = '';
				var languageId = null;
				if (listEntry.find('input').each(function(){           
					name = $(this).val();
          console.log("TCL: name", name);
				}));
				if (listEntry.find('select').each(function(){
					languageId = $(this).val();
          console.log("TCL: languageId", languageId);
				}));
				// if (!$("#timaat-actordatasets-actor-names-form").valid()) return false;
				if (name != '' && languageId != null) {
					var namesInForm = $("#timaat-actordatasets-actor-names-form").serializeArray();
					console.log("TCL: namesInForm", namesInForm);
					var i = Math.floor((namesInForm.length - 1) / 2) - 1; //* first -1 is to account for 'add new name' row; latter -1 to compensate for single 'isDisplayName' occurence
					// TODO this formula may not work with the originalTital radiobutton addition
					$('#dynamic-name-fields').append(
						`<div class="form-group" data-role="name-entry">
						<div class="form-row">
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayName"></label>
									<input class="form-check-input isDisplayName" type="radio" name="isDisplayName" placeholder="Is Display Name" data-role="displayName">
								</div>
							</div>
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isBirthName"></label>
									<input class="form-check-input isBirthName" type="radio" name="isBirthName" placeholder="Is Original Name" data-role="birthName">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Name</label>
								<input class="form-control form-control-sm timaat-actordatasets-actor-names-name-name" name="name[`+i+`]" value="`+name+`" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" data-role="name" required>
							</div>
							<div class="col-sm-2 col-md-2">
								<label class="sr-only">Name's Language</label>
								<select class="form-control form-control-sm timaat-actordatasets-actor-names-name-language-id" name="nameLanguageId[`+i+`]" data-role="nameLanguageId[`+i+`]" required>
									<option value="2">English</option>
									<option value="3">German</option>
									<option value="4">French</option>
									<option value="5">Spanish</option>
									<option value="6">Russian</option>
									<option value="7">Arabic</option>
								</select>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
					);
					($('[data-role="nameLanguageId['+i+']"]'))
						.find('option[value='+languageId+']')
						.attr("selected",true);
					$('input[name="name['+i+']"').rules("add",
					{
						required: true,
						minlength: 3,
						maxlength: 200,
					});
				$('select[name="nameLanguageId['+i+']"').rules("add",
					{
						required: true,
					});
					if (listEntry.find('input').each(function(){
						console.log("TCL: $(this).val()", $(this).val());
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						console.log("TCL: $(this).val()", $(this).val());
						$(this).val('');
					}));
				}
				else {
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove name button click
			$(document).on('click','[data-role="dynamic-name-fields"] > .form-group [data-role="remove"]', function(e) {
				e.preventDefault();
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
			$("#timaat-actordatasets-actor-names-form-submit").on('click', async function(event) {
				console.log("TCL: Names form: submit");
				// add rules to dynamically added form fields
				// continue only if client side validation has passed
				event.preventDefault();
				var node = document.getElementById("new-name-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				};
				// test if form is valid 
				if (!$("#timaat-actordatasets-actor-names-form").valid()) {
					$('[data-role="new-name-fields"]').append(
						`<div class="form-group" data-role="name-entry">
							<div class="form-row">
								<div class="col-md-2 text-center">
									<div class="form-check">
										<span>Add new name:</span>
									</div>
								</div>
								<div class="col-md-6">
									<label class="sr-only">Name</label>
									<input class="form-control form-control-sm timaat-actordatasets-actor-names-name-name" name="name" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" data-role="name" required>
								</div>
								<div class="col-md-3">
									<label class="sr-only">Name's Language</label>
									<select class="form-control form-control-sm timaat-actordatasets-actor-names-name-language-id" name="nameLanguageId" required>
										<option value="" disabled selected hidden>[Choose name language...]</option>
										<option value="2">English</option>
										<option value="3">German</option>
										<option value="4">French</option>
										<option value="5">Spanish</option>
										<option value="6">Russian</option>
										<option value="7">Arabic</option>
									</select>
								</div>
								<div class="col-md-1 text-center">
									<button class="btn btn-primary" data-role="add">
										<span class="fas fa-plus"></span>
									</button>
								</div>
							</div>
						</div>`
					);					
					return false;
				}
				console.log("TCL: Names form: valid");

				// the original actor model (in case of editing an existing actor)
				var actor = $("#timaat-actordatasets-actor-names-form").data("actor");			

				// Create/Edit actor window submitted data
				var formData = $("#timaat-actordatasets-actor-names-form").serializeArray();
				var formNameList = [];
				var i = 0;
				while ( i < formData.length) {
					var element = {
					isDisplayName: false,
					isBirthName: false,
					name: '',
					nameLanguageId: 0,
				};
					if (formData[i].name == 'isDisplayName' && formData[i].value == 'on' ) {
						element.isDisplayName = true;
						if (formData[i+1].name == 'isBirthName' && formData[i+1].value == 'on' ) {
							// display name set, original name set
							element.isBirthName = true;
							element.name = formData[i+2].value;
							element.nameLanguageId = formData[i+3].value;
							i = i+4;
						} else { // display name set, original name not set
							element.isBirthName = false;
							element.name = formData[i+1].value;
							element.nameLanguageId = formData[i+2].value;
							i = i+3;
						}
					} else { // display name not set, original name set
						element.isDisplayName = false;
						if (formData[i].name == 'isBirthName' && formData[i].value == 'on' ) {
							element.isBirthName = true;
							element.name = formData[i+1].value;
							element.nameLanguageId = formData[i+2].value;
							i = i+3;
						} else {
							// display name not set, original name not set
							element.isBirthName = false;
							element.name = formData[i].value;
							element.nameLanguageId = formData[i+1].value;
							i = i+2;
						}
					};
					formNameList[formNameList.length] = element;
				}
				// only updates to existing names
				if (formNameList.length == actor.model.names.length) {
					var i = 0;
					for (; i < actor.model.names.length; i++ ) { // update existing names
						var name = {
							id: actor.model.names[i].id,
							language: {
								id: Number(formNameList[i].nameLanguageId),
							},
							name: formNameList[i].name,
							};
						console.log("TCL: update existing names");
						// only update if anything changed
						if (name != actor.model.names[i]) {
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
						// update display name
						var changed = false;
						if (formNameList[i].isDisplayName == true) {
							actor.model.displayName = actor.model.names[i];
							changed = true;
						}
						// update original name
						if (formNameList[i].isBirthName == true) {
							actor.model.birthName = actor.model.names[i];
							changed = true;
						}
						if (changed == true) {
							await TIMAAT.ActorDatasets.updateActor(actor);
						}
					};
				}
				// update existing names and add new ones
				else if (formNameList.length > actor.model.names.length) {
					var i = 0;
					for (; i < actor.model.names.length; i++ ) { // update existing names
						var name = {
							id: actor.model.names[i].id,
							language: {
								id: Number(formNameList[i].nameLanguageId),
							},
							name: formNameList[i].name,
							};
						// only update if anything changed
						if (name != actor.model.names[i]) {
							console.log("TCL: update existing names (and add new ones)");
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
					};
					i = actor.model.names.length;
					var newNames = [];
					for (; i < formNameList.length; i++) { // create new names
						var name = {
							id: 0,
							language: {
								id: Number(formNameList[i].nameLanguageId),
							},
							name: formNameList[i].name,
							};
						newNames.push(name);
					}
					console.log("TCL: (update existing names and) add new ones");
					await TIMAAT.ActorDatasets.addNames(actor, newNames);
					i = 0;
					for (; i < formNameList.length; i++) {
						// update display name
						var changed = false;
						if (formNameList[i].isDisplayName == true) {
							actor.model.displayName = actor.model.names[i];
							changed = true;
						}
						// update original name
						if (formNameList[i].isBirthName == true) {
							actor.model.birthName = actor.model.names[i];
							changed = true;
						}
						if (changed == true) {
							await TIMAAT.ActorDatasets.updateActor(actor);
						}
					}
				}
				// update existing names and delete obsolete ones
				else if (formNameList.length < actor.model.names.length) {
					var i = 0;
					for (; i < formNameList.length; i++ ) { // update existing names
						var name = {
							id: actor.model.names[i].id,
							language: {
								id: Number(formNameList[i].nameLanguageId),
							},
							name: formNameList[i].name,
							};
						if (name != actor.model.names[i]) {
							console.log("TCL: update existing names (and delete obsolete ones)");
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
						// update display name
						var changed = false;
						if (formNameList[i].isDisplayName == true) {
							actor.model.displayName = actor.model.names[i];
							changed = true;
						}
						// update original name
						if (formNameList[i].isBirthName == true) {
							actor.model.birthName = actor.model.names[i];
							changed = true;
						}
						if (changed == true) {
							await TIMAAT.ActorDatasets.updateActor(actor);
						}
					};
					var i = actor.model.names.length - 1;
					for (; i >= formNameList.length; i-- ) { // remove obsolete names
						if (actor.model.birthName.id == actor.model.names[i].id) {
							actor.model.birthName = null;
							console.log("TCL: remove birthName before deleting name");		
							await TIMAAT.ActorDatasets.updateActor(actor);
						}
						console.log("TCL: (update existing names and) delete obsolete ones");		
						TIMAAT.ActorService.removeName(actor.model.names[i]);
						actor.model.names.pop();		
					}
				}
				console.log("TCL: show actor name form");
				TIMAAT.ActorDatasets.actorFormNames('show', actor);
			});

			// Cancel add/edit button in names form functionality
			$('#timaat-actordatasets-actor-names-form-dismiss').click( function(event) {
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-actor-metadata-form').data('actor'));
			});
		},

		load: function() {
			TIMAAT.ActorDatasets.loadActors();
			TIMAAT.ActorDatasets.loadActorTypes();
			TIMAAT.ActorDatasets.loadAllActorSubtypes();
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
			};
		},

		loadAllActorSubtypes: function() {
			TIMAAT.ActorService.listActorSubtype('person', TIMAAT.ActorDatasets.setPersonLists);
			TIMAAT.ActorService.listActorSubtype('collective', TIMAAT.ActorDatasets.setCollectiveLists);
		},

		setActorTypeLists: function(actorTypes) {
			// console.log("TCL: actorTypes", actorTypes);
			if ( !actorTypes ) return;
			$('#timaat-actortype-list-loader').remove();
			// clear old UI list
			$('#timaat-actortype-list').empty();
			// setup model
			var actTypes = Array();
			actorTypes.forEach(function(actorType) { if ( actorType.id > 0 ) actTypes.push(new TIMAAT.ActorType(actorType)); });
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
					console.log("TCL: actor", actor);
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
					console.log("TCL: person", person);
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
			// console.log("TCL: setActorNameList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-name-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-name-list').empty();
			// setup model
			var actorNames = Array();
			actor.model.names.forEach(function(name) { 
				if ( name.actorId > 0 )
					actorNames.model.names.push(name); 
			});
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
			$('.datasheet-form-edit-button').hide();
			$('.datasheet-form-buttons').hide()
			$('.'+actorType+'-datasheet-form-submit').show();
			$('#timaat-actordatasets-actor-metadata-form :input').prop('disabled', false);
			$('#timaat-actordatasets-actor-metadata-name').focus();

			// setup form
			$('#actorFormHeader').html(actorType+" hinzufügen");
			$('#timaat-actordatasets-'+actorType+'-metadata-form-submit').html("Hinzufügen");
			$('#timaat-actordatasets-'+actorType+'-metadata-isfictional').prop('checked', false);
			$('#timaat-actordatasets-'+actorType+'-metadata-name-usedfrom').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
			$('#timaat-actordatasets-'+actorType+'-metadata-name-useduntil').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
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
			if (actorType == "collective") {
				$('.person-data').hide(); // to display academic title in same row with actor name data
			}
			$('.'+actorType+'-data').show();
			actorFormMetadataValidator.resetForm();
			$('.'+actorType+'-data-tab').show();
			$('.name-data-tab').show();
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

				$('.datasheet-form-edit-button').hide();
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit').prop("disabled", true);
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit :input').prop("disabled", true);
				$('#actorFormHeader').html(actorType+" bearbeiten");
				$('#timaat-actordatasets-'+actorType+'-metadata-form-submit').html("Speichern");
				$('#timaat-actordatasets-actor-metadata-name').focus();
			}

			console.log("TCL: actorTypeData", actorTypeData);
			// setup UI
			var data = actorTypeData.model;
			// actor data
			$('#timaat-actordatasets-actor-metadata-actortype-id').val(data.actorType.id);
			// display-name data
			// $('#timaat-actordatasets-actor-metadata-name').val(data.displayName.name);
			$('#timaat-actordatasets-actor-metadata-name').val(data.name);
			// actor subtype specific data
			switch (actorType) {
				case 'person':
					if(isNaN(moment(data.dateOfBirth)))
						$('#timaat-actordatasets-person-metadata-dateofbirth').val('');
						else $('#timaat-actordatasets-person-metadata-dateofbirth').val(moment.utc(data.actorPerson.dateOfBirth).format('YYYY-MM-DD'));
					if(isNaN(moment(data.dayOfDeath)))
						$('#timaat-actordatasets-person-metadata-dayofdeath').val('');
						else $('#timaat-actordatasets-person-metadata-dayofdeath').val(moment.utc(data.actorPerson.dayOfDeath).format('YYYY-MM-DD'));
					// TODO all person data
				break;
				case 'collective':
					// TODO all collective data
				break;
			}
			$('#timaat-actordatasets-actor-metadata-form').data(actorType, actorTypeData);
		},

		actorFormNames: function(action, actor) {
    	// console.log("TCL: actorFormNames: action, actor", action, actor);
			var node = document.getElementById("dynamic-name-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			var node = document.getElementById("new-name-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			$('#timaat-actordatasets-actor-names-form').trigger('reset');
			actorFormNamesValidator.resetForm();
			// $('.actor-data-tab').show();
			$('.nav-tabs a[href="#actorNames"]').focus();
			$('#timaat-actordatasets-actor-names-form').show();
			
			// setup UI
			// display-name data
			var i = 0;
			var numNames = actor.model.names.length;
      // console.log("TCL: actor.model.names", actor.model.names);
			for (; i< numNames; i++) {
				// console.log("TCL: actor.model.names[i].language.id", actor.model.names[i].language.id);
				$('[data-role="dynamic-name-fields"]').append(
					`<div class="form-group" data-role="name-entry">
						<div class="form-row">
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayName"></label>
									<input class="form-check-input isDisplayName" type="radio" name="isDisplayName" placeholder="Is Display Name" data-role="displayName[`+actor.model.names[i].id+`]">
								</div>
							</div>
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isBirthName"></label>
									<input class="form-check-input isBirthName" type="radio" name="isBirthName" placeholder="Is Original Name" data-role="birthName[`+actor.model.names[i].id+`]">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Name</label>
								<input class="form-control form-control-sm timaat-actordatasets-actor-names-name-name" name="name[`+i+`]" value="`+actor.model.names[i].name+`" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" data-role="name[`+i+`]" required>
							</div>
							<div class="col-sm-2 col-md-2">
								<label class="sr-only">Name's Language</label>
								<select class="form-control form-control-sm timaat-actordatasets-actor-names-name-language-id" name="nameLanguageId[`+i+`]" data-role="nameLanguageId[`+actor.model.names[i].language.id+`]" required>
									<!-- <option value="" disabled selected hidden>[Choose name language...]</option> -->
									<option value="2">English</option>
									<option value="3">German</option>
									<option value="4">French</option>
									<option value="5">Spanish</option>
									<option value="6">Russian</option>
									<option value="7">Arabic</option>
								</select>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
					);
					$('[data-role="nameLanguageId['+actor.model.names[i].language.id+']"')
						.find('option[value='+actor.model.names[i].language.id+']')
						.attr("selected",true);
					if (actor.model.names[i].id == actor.model.displayName.id) {
						$('[data-role="displayName['+actor.model.names[i].id+']"')
							.prop("checked",true);							
					}
					if (actor.model.birthName && actor.model.names[i].id == actor.model.birthName.id) {
						$('[data-role="birthName['+actor.model.names[i].id+']"')
							.prop("checked",true);							
					}
					$('input[name="name['+i+']"').rules("add",
						{
							required: true,
							minlength: 3,
							maxlength: 200,
						});
					$('select[name="nameLanguageId['+i+']"').rules("add",
						{
							required: true,
						});
			};

			if ( action == 'show') {
				$('#timaat-actordatasets-actor-names-form :input').prop("disabled", true);
				$('#timaat-actordatasets-actor-names-form-edit').show();
				$('#timaat-actordatasets-actor-names-form-edit').prop("disabled", false);
				$('#timaat-actordatasets-actor-names-form-edit :input').prop("disabled", false);
				$('#timaat-actordatasets-actor-names-form-submit').hide();
				$('#timaat-actordatasets-actor-names-form-dismiss').hide();
				$('[data-role="new-name-fields"').hide();
				$('.name-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#actorNamesLabel').html("Actor Titelliste");
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-names-form-submit').show();
				$('#timaat-actordatasets-actor-names-form-dismiss').show();
				$('#timaat-actordatasets-actor-names-form :input').prop("disabled", false);
				$('#timaat-actordatasets-actor-names-form-edit').hide();
				$('#timaat-actordatasets-actor-names-form-edit').prop("disabled", true);
				$('#timaat-actordatasets-actor-names-form-edit :input').prop("disabled", true);
				$('[data-role="new-name-fields"').show();
				$('.name-form-divider').show();
				$('#actorNamesLabel').html("Actor Titelliste bearbeiten");
				$('#timaat-actordatasets-actor-names-form-submit').html("Speichern");
				$('#timaat-actordatasets-actor-metadata-name').focus();

				// fields for new name entry
				$('[data-role="new-name-fields"]').append(
					`<div class="form-group" data-role="name-entry">
						<div class="form-row">
							<div class="col-md-2 text-center">
								<div class="form-check">
									<span>Add new name:</span>
								</div>
							</div>
							<div class="col-md-6">
								<label class="sr-only">Name</label>
								<input class="form-control form-control-sm timaat-actordatasets-actor-names-name-name" name="name" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" data-role="name" required>
							</div>
							<div class="col-md-3">
								<label class="sr-only">Name's Language</label>
								<select class="form-control form-control-sm timaat-actordatasets-actor-names-name-language-id" name="nameLanguageId" required>
									<option value="" disabled selected hidden>[Choose name language...]</option>
									<option value="2">English</option>
									<option value="3">German</option>
									<option value="4">French</option>
									<option value="5">Spanish</option>
									<option value="6">Russian</option>
									<option value="7">Arabic</option>
								</select>
							</div>
							<div class="col-md-1 text-center">
								<button class="btn btn-primary" data-role="add">
									<span class="fas fa-plus"></span>
								</button>
							</div>
						</div>
					</div>`
				);
				$('#timaat-actordatasets-actor-names-form').data('actor', actor);
			}
		},

		createActor: async function(actorType, actorModel, actorSubtypeModel, displayName, address, email, phoneNumber) {
			console.log("TCL: createActor: async function(actorType, actorModel, displayName, address, email, phoneNumber)", actorType, actorModel, displayName, address, email, phoneNumber);
			try {
				// create primary address
				var newPrimaryAddress = null;
				if (address.length > 0) {
					newPrimaryAddress = await TIMAAT.ActorService.createAddress(address);
				}
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// create primary email
				var newPrimaryEmailAddress = null;
				if (email.length > 0) {
					newPrimaryEmailAddress = await TIMAAT.ActorService.createEmail(email);
				}
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// create primary phone number
				var newPrimaryPhoneNumber = null;
				if (phoneNumber.length > 0) {
					newPrimaryPhoneNumber = await TIMAAT.ActorService.createPhoneNumber(phoneNumber);
				}
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// create actor
				var tempActorModel = actorModel;
				// tempActorModel.displayName = newDisplayName;
				tempActorModel.primaryAddress = (newPrimaryAddress) ? newPrimaryAddress : "" ;
				tempActorModel.primaryEmailAddress = (newPrimaryEmailAddress) ? newPrimaryEmailAddress : "";
				tempActorModel.primaryPhoneNumber = (newPrimaryPhoneNumber) ? newPrimaryPhoneNumber : "";
				var newActorModel = await TIMAAT.ActorService.createActor(tempActorModel);
        console.log("TCL: newActorModel", newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// create display name
				var newDisplayName = await TIMAAT.ActorService.addName(newActorModel.id, displayName);
        console.log("TCL: newDisplayName", newDisplayName);
				newActorModel.displayName = newDisplayName;
				newActorModel.actorNames[0] = newDisplayName;
        console.log("TCL: newActorModel", newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// create person translation with person id
				if (actorType == "person" && actorSubtypeModel.personTranslations != null) {
					await TIMAAT.ActorService.createPersonTranslation(newActorModel, actorSubtypeModel.personTranslations);
					actorSubtypeModel.personTranslations[0] = personModelTranslation;
				}
			} catch(error) {
				console.log( "error: ", error);
			};
			// try {
			// 	// update displayName (createActor created an empty displayName)
			// 	displayName.id = newActorModel.names[0].id;
			// 	var updatedDisplayName = await TIMAAT.MediaService.updateName(displayName);
			// 	newActorModel.names[0] = updatedDisplayName; // TODO refactor once several names can be added				
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };
			try {
				// create actorSubtype with actor id
				actorSubtypeModel.actorId = newActorModel.id;
				var newActorSubtypeModel = await TIMAAT.ActorService.createActorSubtype(actorType, newActorModel, actorSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			};
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
				};
				console.log("TCL: newActorModel", newActorModel);
				await TIMAAT.ActorDatasets._actorAdded(actorType, newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		createName: async function(nameModel) {
			// console.log("TCL: createName: async function -> nameModel", nameModel);
			try {
				// create name
				var newNameModel = await TIMAAT.ActorService.createName(nameModel.model);
        console.log("TCL: newNameModel", newNameModel);
			} catch(error) {
				console.log( "error: ", error);
			};
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
					console.log("TCL: actor.model.names", actor.model.actorNames);
					console.log("TCL: actor.model.names.length", actor.model.actorNames.length);	
				}
				// await TIMAAT.ActorDatasets.updateActor(actor);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		updateActor: async function(actor) {
			console.log("TCL: updateActor: async function -> actor at beginning of update process: ", actor);
				try {
					// update display name
					var tempDisplayName = await TIMAAT.ActorService.updateName(actor.model.displayName);
					actor.model.displayName = tempDisplayName;
	
					// update original name
					if (actor.model.birthName) { // actor initially has no original name set
						var tempBirthName = await TIMAAT.ActorService.updateName(actor.model.birthName);
						actor.model.birthName = tempBirthName;
					}
	
					// update source
					// var tempSource = await TIMAAT.ActorService.updateSource(actor.model.sources[0]);
					// actor.model.sources[0] = tempSource;
	
					// update data that is part of actor (includes updating last edited by/at)
					// console.log("TCL: updateActor: async function - actor.model", actor.model);
					var tempActorModel = await TIMAAT.ActorService.updateActor(actor.model);
					console.log("TCL: tempActorModel", tempActorModel);
				} catch(error) {
					console.log( "error: ", error);
				};
				// try { // actor has no translation at the moment
				// 	// update data that is part of  actor translation
				// 	// actor.actorTranslation[0] = await	TIMAAT.ActorService.updateActorTranslation(actor);
				// 	var tempActorTranslation = await	TIMAAT.ActorService.updateActorTranslation(actor);
				// 	actor.model.actorTranslations[0].name = tempActorTranslation.name;			
				// } catch(error) {
				// 	console.log( "error: ", error);
				// };
				actor.updateUI();
			},
	
		updateActorSubtype: async function(actorSubtype, actor) {
			console.log("TCL: updateActorSubtypeData async function -> actorSubtype, actorSubtypeData at beginning of update process: ", actorSubtype, actor);
			try {
				// update display name
				console.log("TCL: update name via update subactor")
				var tempDisplayName = await TIMAAT.ActorService.updateName(actor.model.displayName);
				actor.model.displayName = tempDisplayName;
				// update original name
				console.log("TCL: update name via update subactor")
				if (actor.model.birthName) { // actor initially has no original name set
					var tempBirthName = await TIMAAT.ActorService.updateName(actor.model.birthName);
					actor.model.birthName = tempBirthName;
				}
			} catch(error) {
				console.log( "error: ", error);
			};
			// try {
			// 	// update source
			// 	var tempSource = await TIMAAT.ActorService.updateSource(actor.model.sources[0]);
			// 	actor.model.sources[0] = tempSource;
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };

			try {
				// update data that is part of actorSubtypeData
				var tempSubtypeModel;
				switch (actorSubtype) {
					case 'person':
						tempSubtypeModel = actor.model.actorPerson;
					break;
					case 'collective':
						tempSubtypeModel = actor.model.actorCollective;
						break;
				}
				var tempActorSubtypeModel = await TIMAAT.ActorService.updateActorSubtype(actorSubtype, tempSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of actor and its translation
				// var actorSubtypeActorModel = actorSubtypeData;
				// console.log("TCL: updateActorSubtype: async function - actorSubtypeActorModel", actorSubtypeActorModel);
				var tempActorSubtypeModelUpdate = await TIMAAT.ActorService.updateActor(actor.model);				
			} catch(error) {
				console.log( "error: ", error);
			};
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

				// update data that is part of actor (includes updating last edited by/at)
				// console.log("TCL: updateActor: async function - actor.model", actor.model);
				// var tempActorModel = await TIMAAT.ActorService.updateActor(actor.model);
			} catch(error) {
				console.log( "error: ", error);
			};
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
			};
		},

		_actorRemoved: async function(actor) {
			// sync to server
			// remove actor from all collections it is part of
			// function isActorInActorCollectionHasActors(actor, acha) {
			// 	if (acha.filter(x => x.actor.id == actor.id)) {
			// 		return true
			// 	} else
			// 	return false;
			// };
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
			// actor data
			actor.model.isFictional = (formDataObject.isFictional == "on") ? true : false;
			actor.model.displayName.name = formDataObject.displayName;
			actor.model.displayName.usedFrom = moment.utc(formDataObject.nameUsedFrom, "YYYY-MM-DD");
			actor.model.displayName.usedUntil = moment.utc(formDataObject.nameUsedUntil, "YYYY-MM-DD");
			var i = 0;
			for (; i < actor.model.actorNames.length; i++) {
				if (actor.model.displayName.id == actor.model.actorNames[i].id) {
					actor.model.actorNames[i] = actor.model.displayName;
					break;
				}
			}
			// phone number data
			actor.model.phoneNumber.iddPrefix = formDataObject.iddPrefix;
			actor.model.phoneNumber.areaCode = formDataObject.areaCode;
			actor.model.phoneNumber.number = formDataObject.phoneNumber;
			actor.model.phoneNumber.type = formDataObject.phoneNumberTypeId;
			for (; i < actor.model.phoneNumbers.length; i++) {
				if (actor.model.primaryPhoneNumber.id == actor.model.phoneNumbers[i].id) {
					actor.model.phoneNumbers[i] = actor.model.primaryPhoneNumber;
					break;
				}
			}
			// address data
			actor.model.address.street = formDataObject.street;
			actor.model.address.streetNumber = formDataObject.streetNumber;
			actor.model.address.streetAddition = formDataObject.streetAddition;
			actor.model.address.postalCode = formDataObject.postalCode;
			actor.model.address.postOfficeBox = formDataObject.postOfficeBox;
			actor.model.address.type = formDataObject.addressTypeId;
			actor.model.address.usedFrom = moment.utc(formDataObject.addressUsedFrom, "YYYY-MM-DD");
			actor.model.address.usedUntil = moment.utc(formDataObject.addressUsedUntil, "YYYY-MM-DD");
			for (; i < actor.model.actorNames.length; i++) {
				if (actor.model.name.id == actor.model.actorNames[i].id) {
					actor.model.actorNames[i] = actor.model.name;
					break;
				}
			}
			// email address data
			actor.model.email.address = formDataObject.emailAddress;
			actor.model.email.type = formDataObject.emailTypeId;

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
				},
				actorNames: [{}],
				// actorNames: [{
				// 	id: 0,
				// 	name: formDataObject.displayName,
				// 	UsedFrom: moment.utc(formDataObject.nameUsedFrom, "YYYY-MM-DD"),
				// 	UsedUntil: moment.utc(formDataObject.nameUsedUntil, "YYYY-MM-DD"),
				// }],
				actorHasPhoneNumbers: [{}],
				// phoneNumbers: [{
				// 	id: 0,
				// 	iddPrefix: formDataObject.iddPrefix,
				// 	areaCode: formDataObject.areaCode,
				// 	number: formDataObject.phoneNumber,
				// 	type: Number(formDataObject.phoneNumberTypeId),
				// }],
				actorHasAddresses: [{}],
				// addresses: [{
				// 	id: 0,
				// 	street: formDataObject.street,
				// 	streetNumber: formDataObject.streetNumber,
				// 	streetAddition: formDataObject.streetAddition,
				// 	postalCode: formDataObject.postalCode,
				// 	postOfficeBox: formDataObject.postOfficeBox,
				// 	type: Number(formDataObject.addressTypeId),
				// 	usedFrom: moment.utc(formDataObject.addressUsedFrom, "YYYY-MM-DD"),
				// 	usedUntil: moment.utc(formDataObject.addressUsedUntil, "YYYY-MM-DD"),
				// }],
				actorHasEmailAddresses: [{}],
				// emails: [{
				// 	id: 0,
				// 	address: formDataObject.emailAddress,
				// 	type: Number(formDataObject.emailTypeId),
				// }],
			};
			console.log("TCL: actorModel", actorModel);
			return actorModel;
		},

		createPersonModel: function(formDataObject) {
    	// console.log("TCL: createPersonModel: formDataObject", formDataObject);
			var personModel = {
				actorId: 0,
				title: formDataObject.title,
				dateOfBirth: moment.utc(formDataObject.dateOfBirth, "YYYY-MM-DD"),
				placeOfBirth: (formDataObject.placeOfBirth == "") ? null : Number(formDataObject.placeOfBirth),
				dayOfDeath: moment.utc(formDataObject.dayOfDeath, "YYYY-MM-DD"),
				placeOfDeath: (formDataObject.placeOfDeath == "") ? null : Number(formDataObject.placeOfDeath),
				sex: {
					id: Number(formDataObject.sexId),
				},
				actorPersonTranslations: (formDataObject.specialFeatures == "") ? null : [{
					id: 0,
					language: {
						id: 1 // TODO change to correct language
					},
					specialFeatures: formDataObject.specialFeatures,
				}]
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

		createDisplayNameModel: function(formDataObject) {
    // console.log("TCL: createDisplayNameModel: formDataObject", formDataObject);
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

		createAddressModel: function(formDataObject) {
    	// console.log("TCL: createAddressModel: formDataObject", formDataObject);
			var primaryAddress = {};
			if (!(formDataObject.street == "" 
					&& formDataObject.streetNumber == "" 
					&& formDataObject.streetAddition == "" 
					&& formDataObject.postalCode == "" 
					&& formDataObject.postOfficeBox == ""
					&& formDataObject.addressTypeId == ""
					&& formDataObject.addressUsedFrom == ""
					&& formDataObject.addressUsedUntil == "")) {
				primaryAddress = {
					street: formDataObject.street,
					streetNumber: formDataObject.streetNumber,
					streetAddition: formDataObject.streetAddition,
					postalCode: formDataObject.postalCode,
					postOfficeBox: formDataObject.postOfficeBox,
					type: Number(formDataObject.addressTypeId),
					usedFrom: moment.utc(formDataObject.addressUsedFrom, "YYYY-MM-DD"),
					usedUntil: moment.utc(formDataObject.addressUsedUntil, "YYYY-MM-DD")
				};
        console.log("TCL: primaryAddress", primaryAddress);
			}
			return primaryAddress; 
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
			};
        console.log("TCL: primaryPhoneNumber", primaryPhoneNumber);
			}
			return primaryPhoneNumber;
		},

		createCitizenshipModel: function(formDataObject) {
    // console.log("TCL: createCitizenshipModel: formDataObject", formDataObject);
			var citizenshipModel = {};
			if(!(formDataObject.citizenshipName == "")) {
				citizenshipModel = {
					id: 0,
					language: {
						id: 0,
					},
					name: formDataObject.citizenshipName,
				}
				console.log("TCL: citizenshipModel", citizenshipModel);
			}
			return citizenshipModel
		}

	}
	
}, window));
