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
			$('#actor-tab-actor-metadata-form').click(function(event) {
				// $('.actor-data-tabs').show();
				$('.nav-tabs a[href="#actorDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-actordatasets-actors-metadata-form').show();
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'actor', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
			});
			
			// delete actor button functionality (in actor list)
			$('#timaat-actordatasets-actor-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-actor-delete');
				var actor = modal.data('actor');
				if (actor) TIMAAT.ActorDatasets._actorRemoved(actor);
				modal.modal('hide');
				$('#timaat-actordatasets-actors-metadata-form').hide();
				$('.actors-data-tabs').hide();
				$('.form').hide();
			});

			// add actor button functionality (in actor list - opens datasheet form)
			// $('#timaat-actordatasets-actor-add').attr('onclick','TIMAAT.ActorDatasets.addActor("actor")');
			$('#timaat-actordatasets-actor-add').click(function(event) {
				$('#timaat-actordatasets-actors-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("actor");
			});
			
			// actor form handlers
			// Submit actor metadata button functionality
			$('#timaat-actordatasets-actor-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-actordatasets-actors-metadata-form').valid()) return false;

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-actors-metadata-form').data('actor');				
				// console.log("TCL: actor", actor);

				// Create/Edit actor window submitted data
				var formData = $('#timaat-actordatasets-actors-metadata-form').serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (actor) { // update actor
					// actor data
					actor = TIMAAT.ActorDatasets.updateActorModelData(actor, formDataObject);

					actor.updateUI();
					await TIMAAT.ActorDatasets.updateActor(actor);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', "actor", actor);
				} else { // create new actor
					var model = {
						id: 0,
						// remark: formDataObject.remark,
						// copyright: formDataObject.copyright,
						// releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						actorType: {
							id: Number(formDataObject.typeId),
						},
						names: [{
							id: 0,
							// language: {
							// 	id: Number(formDataObject.displayNameLanguageId),
							// },
							name: formDataObject.displayName,
						}],
					};
					var displayName = {
						id: 0,
						// language: {
						// 	id: Number(formDataObject.displayNameLanguageId),
						// },
						name: formDataObject.displayName,
					};
					// await TIMAAT.ActorDatasets.createActor(model, displayName, source);
					await TIMAAT.ActorDatasets.createActor(model, displayName, );
					var actor = TIMAAT.ActorDatasets.actor[TIMAAT.ActorDatasets.actor.length-1];
					TIMAAT.ActorDatasets.actorFormDatasheet('show', "actor", actor);
				};
			});

			// edit content form button handler
			$('#timaat-actordatasets-actor-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormDatasheet('edit', 'actor', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-actordatasets-actor-metadata-form-dismiss').click( function(event) {
				var actor = $('#timaat-actordatasets-actors-metadata-form').data('actor');
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
				$('#timaat-actordatasets-actors-metadata-form').show();
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
			});
			
			// delete person button functionality (in person list)
			$('#timaat-actordatasets-person-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-person-delete');
				var person = modal.data('person');
				if (person) TIMAAT.ActorDatasets._actorSubtypeRemoved('person', person);
				modal.modal('hide');
				$('#timaat-actordatasets-actors-metadata-form').hide();
				$('.actors-data-tabs').hide();
				$('.form').hide();
			});

			// add person button functionality (opens form)
			// $('#timaat-actordatasets-person-add').attr('onclick','TIMAAT.ActorDatasets.addActor("person")');
			$('#timaat-actordatasets-person-add').click(function(event) {
				$('#timaat-actordatasets-actors-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("person");
			});

			// person form handlers
			// Submit person data button functionality
			$('#timaat-actordatasets-person-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-actordatasets-actors-metadata-form").valid()) return false;

				// the original person model (in case of editing an existing person)
				var person = $('#timaat-actordatasets-actors-metadata-form').data('actor');		

				// Create/Edit person window submitted data
				var formData = $("#timaat-actordatasets-actors-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (person) { // update person
					// actor data
					person = TIMAAT.ActorDatasets.updateActorModelData(person, formDataObject);
					// person data
					// person.model.actorPerson.length = TIMAAT.Util.parseTime(formDataObject.length);

					person.updateUI();
					TIMAAT.ActorDatasets.updateActorSubtype('person', person);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', person);
				} else { // create new person
					var model = {
						actorId: 0,
						personCodecInformation: { // TODO get correct person information
							id: 1,
						},
						length: TIMAAT.Util.parseTime(formDataObject.length),
					};
					var actor = TIMAAT.ActorDatasets.createActorModel(formDataObject, 1); // 1 = Person. TODO check clause to find proper id
					var displayTitle = TIMAAT.ActorDatasets.createDisplayTitleModel(formDataObject);
					var source = TIMAAT.ActorDatasets.createSourceModel(formDataObject);			
					await TIMAAT.ActorDatasets.createActorSubtype('person', model, actor, displayTitle, source);
					var person = TIMAAT.ActorDatasets.persons[TIMAAT.ActorDatasets.persons.length-1];
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', person);
					$('#timaat-actordatasets-actors-metadata-form').data('actor', person);
				}
			});

			// edit content form button handler
			$('#timaat-actordatasets-person-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormDatasheet('edit', 'person', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
				// person.listView.find('.timaat-actordatasets-person-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-actordatasets-person-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initNames: function() {
			$('#actors-tab-names-form').click(function(event) {
				$('.nav-tabs a[href="#actorNames"]').tab('show');
				$('.form').hide();
				TIMAAT.ActorDatasets.setActorNameList($('#timaat-actordatasets-actors-metadata-form').data('actor'))
				$('#timaat-actordatasets-actor-names-form').show();
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
			});
			
			// edit names form button handler
			$('#timaat-actordatasets-actor-names-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormNames('edit', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
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
					var i = Math.floor((namesInForm.length - 1) / 2) - 1; // first -1 is to account for 'add new name' row; latter -1 to compensate for single 'isDisplayName' occurence
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
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
			});
		},

		initCollectives: function() {
			// nav-bar functionality
			$('#actors-tab-collective-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#collectiveDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-actordatasets-actors-metadata-form').show();
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
			});
			
			// delete collective button functionality (in collective list)
			$('#timaat-actordatasets-collective-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-collective-delete');
				var collective = modal.data('collective');
				if (collective) TIMAAT.ActorDatasets._actorSubtypeRemoved('collective', collective);
				modal.modal('hide');
				$('#timaat-actordatasets-actors-metadata-form').hide();
				$('.actors-data-tabs').hide();
				$('.form').hide();
			});

			// add collective button functionality (opens form)
			// $('#timaat-actordatasets-collective-add').attr('onclick','TIMAAT.ActorDatasets.addActor("collective")');
			$('#timaat-actordatasets-collective-add').click(function(event) {
				$('#timaat-actordatasets-actors-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("collective");
			});

			// collective form handlers
			// Submit collective data button functionality
			$('#timaat-actordatasets-collective-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-actordatasets-actors-metadata-form").valid()) return false;

				// the original collective model (in case of editing an existing collective)
				var collective = $('#timaat-actordatasets-actors-metadata-form').data('actor');		

				// Create/Edit collective window submitted data
				var formData = $("#timaat-actordatasets-actors-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (collective) { // update collective
					// actor data
					collective = TIMAAT.ActorDatasets.updateActorModelData(collective, formDataObject);
					// collective data
					// collective.model.actorCollective.length = TIMAAT.Util.parseTime(formDataObject.length);

					collective.updateUI();
					TIMAAT.ActorDatasets.updateActorSubtype('collective', collective);
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', collective);
				} else { // create new collective
					var model = {
						actorId: 0,
						collectiveCodecInformation: { // TODO get correct collective information
							id: 1,
						},
						length: TIMAAT.Util.parseTime(formDataObject.length),
					};
					var actor = TIMAAT.ActorDatasets.createActorModel(formDataObject, 1); // 1 = Collective. TODO check clause to find proper id
					var displayTitle = TIMAAT.ActorDatasets.createDisplayTitleModel(formDataObject);
					var source = TIMAAT.ActorDatasets.createSourceModel(formDataObject);			
					await TIMAAT.ActorDatasets.createActorSubtype('collective', model, actor, displayTitle, source);
					var collective = TIMAAT.ActorDatasets.collectives[TIMAAT.ActorDatasets.collectives.length-1];
					TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', collective);
					$('#timaat-actordatasets-actors-metadata-form').data('actor', collective);
				}
			});

			// edit content form button handler
			$('#timaat-actordatasets-collective-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormDatasheet('edit', 'collective', $('#timaat-actordatasets-actors-metadata-form').data('actor'));
				// collective.listView.find('.timaat-actordatasets-collective-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-actordatasets-collective-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
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
			$('#timaat-actordatasets-actors-metadata-form').data('actorType', actorSubtype);
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

			$('#timaat-actordatasets-actors-metadata-form').data('actorType', 'actor');
			$('#timaat-actordatasets-actor-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-list').empty();
			// setup model
			var acts = Array();
			actors.forEach(function(actor) { 
				if ( actor.id > 0 ) {
					acts.push(new TIMAAT.Actor(actor, 'actor'));
				}
			});
			TIMAAT.ActorDatasets.actors = acts;
			TIMAAT.ActorDatasets.actors.model = actors;
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
					newPerson = new TIMAAT.Actor(person, 'person');
					pers.push(newPerson);
				}
			});
			TIMAAT.ActorDatasets.persons = pers;
			TIMAAT.ActorDatasets.persons.model = persons;
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
					newCollective = new TIMAAT.Actor(collective, 'collective');
					colls.push(newCollective);
				}
			});
			TIMAAT.ActorDatasets.collectives = colls;
			TIMAAT.ActorDatasets.collectives.model = collectives;
		},

		setActorNameList: function(actor) {
			// console.log("TCL: setActorNameList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actors-name-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actors-name-list').empty();
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
			// $('.nav-tabs a[href="#actorTitles"]').hide();
			$('#timaat-actordatasets-actors-metadata-form').data(actorType, null);
			actorFormMetadataValidator.resetForm();
			$('#timaat-actordatasets-actors-metadata-form').trigger('reset');
			$('#timaat-actordatasets-actors-metadata-form').show();
			$('.datasheet-data').hide();
			// $('.title-data').show();
			$('.actor-data').show();
			if (actorType == "actor") {
				$('.actortype-data').show();
			}
			else {
				$('.actortype-data').hide();
			}
			// $('.source-data').show();
			$('.'+actorType+'-data').show();
			$('.datasheet-form-edit-button').hide();
			$('.datasheet-form-buttons').hide()
			$('.'+actorType+'-datasheet-form-submit').show();
			$('#timaat-actordatasets-actors-metadata-form :input').prop("disabled", false);
			$('#timaat-actordatasets-actors-metadata-title').focus();

			// setup form
			$('#actorFormHeader').html(actorType+" hinzufügen");
			$('#timaat-actordatasets-'+actorType+'-metadata-form-submit').html("Hinzufügen");
			// $('#timaat-actordatasets-actors-metadata-releasedate').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
			// $('#timaat-actordatasets-actors-metadata-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
			// $('#timaat-actordatasets-actors-metadata-source-isprimarysource').prop('checked', true);
			// $('#timaat-actordatasets-actors-metadata-source-isstillavailable').prop('checked', false);
		},

		actorFormDatasheet: function(action, actorType, actorTypeData) {
    	// console.log("TCL: action, actorType, actorTypeData", action, actorType, actorTypeData);
			$('#timaat-actordatasets-actors-metadata-form').trigger('reset');
			$('.datasheet-data').hide();
			$('.name-data').show();
			$('.actor-data').show();
			if (actorType == "actor") {
				$('.actortype-data').show();
			}
			else {
				$('.actortype-data').hide();
			}
			// $('.source-data').show();
			$('.'+actorType+'-data').show();
			actorFormMetadataValidator.resetForm();
			$('.'+actorType+'-data-tab').show();
			$('.name-data-tab').show();
			$('.nav-tabs a[href="#'+actorType+'Datasheet"]').focus();
			$('#timaat-actordatasets-actors-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-actordatasets-actors-metadata-form :input').prop("disabled", true);
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
				$('#timaat-actordatasets-actors-metadata-form :input').prop("disabled", false);
				if (actorType == "actor") {
					$('#timaat-actordatasets-actors-metadata-actortype-id').prop("disabled", true);
				}
				else {
					$('#timaat-actordatasets-actors-metadata-actortype-id').hide();
				}
				// $('#timaat-actordatasets-actors-metadata-releasedate').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
				// $('#timaat-actordatasets-actors-metadata-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
				$('.datasheet-form-edit-button').hide();
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit').prop("disabled", true);
				$('#timaat-actordatasets-'+actorType+'-metadata-form-edit :input').prop("disabled", true);
				$('#actorFormHeader').html(actorType+" bearbeiten");
				$('#timaat-actordatasets-'+actorType+'-metadata-form-submit').html("Speichern");
				$('#timaat-actordatasets-actors-metadata-name').focus();
			}

			// console.log("TCL: actorTypeData", actorTypeData);
			// setup UI
			var data = actorTypeData.model;
			// actor data
			$('#timaat-actordatasets-actors-metadata-actortype-id').val(data.actorType.id);
			// $('#timaat-actordatasets-actors-metadata-remark').val(data.remark);
			// $('#timaat-actordatasets-actors-metadata-copyright').val(data.copyright);
			// if (isNaN(moment(data.releaseDate)))
			// 	$('#timaat-actordatasets-actors-metadata-releasedate').val('');
			// 	else $('#timaat-actordatasets-actors-metadata-releasedate').val(moment(data.releaseDate).format('YYYY-MM-DD'));
			// display-name data
			$('#timaat-actordatasets-actors-metadata-name').val(data.displayTitle.name);
			// $('#timaat-actordatasets-actors-metadata-name-language-id').val(data.displayTitle.language.id);
			// source data
			// if (data.sources[0].isPrimarySource)
			// 	$('#timaat-actordatasets-actors-metadata-source-isprimarysource').prop('checked', true);
			// 	else $('#timaat-actordatasets-actors-metadata-source-isprimarysource').prop('checked', false);
			// $('#timaat-actordatasets-actors-metadata-source-url').val(data.sources[0].url);
			// if (isNaN(moment.utc(data.sources[0].lastAccessed))) 
			// 	$('#timaat-actordatasets-actors-metadata-source-lastaccessed').val('');
			// 	else $('#timaat-actordatasets-actors-metadata-source-lastaccessed').val(moment.utc(data.sources[0].lastAccessed).format('YYYY-MM-DD HH:mm'));
			// if (data.sources[0].isStillAvailable)
			// 	$('#timaat-actordatasets-actors-metadata-source-isstillavailable').prop('checked', true);
			// 	else $('#timaat-actordatasets-actors-metadata-source-isstillavailable').prop('checked', false);
			// actor subtype specific data
			switch (actorType) {
				case 'person':
				break;
				case "collective":
				break;
			}
			$('#timaat-actordatasets-actors-metadata-form').data(actorType, actorTypeData);
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
				$('#timaat-actordatasets-actors-metadata-name').focus();

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

		// createActor: async function(actorModel, name, source) {
		createActor: async function(actorModel, name) {
			// createActor: async function(actorModel, actorModelTranslation) { // actor has no translation table at the moment
			// NO ACTOR SHOULD BE CREATED DIRECTLY. CREATE VIDEO, IMAGE, ETC. INSTEAD
			// This routine can be used to create empty actor of a certain type
			// console.log("TCL: createActor: async function -> actorModel, name, source", actorModel, name, source);
			try {
				// create display name
				var newDisplayName = await TIMAAT.ActorService.createName(name);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {				
				// create actor
				var tempActorModel = actorModel;
				tempActorModel.displayName = newDisplayName;
				// tempActorModel.source = source;
				var newActorModel = await TIMAAT.ActorService.createActor(tempActorModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			// try {
			// 	// update source (createActor created an empty source)
			// 	source.id = newActorModel.sources[0].id;
			// 	var updatedSource = await TIMAAT.ActorService.updateSource(source);
			// 	newActorModel.sources[0] = updatedSource; // TODO refactor once several sources can be added

			// 	// create actor translation with actor id
			// 	// var newTranslationData = await TIMAAT.ActorService.createActorTranslation(newActorModel, actorModelTranslation);
			// 	// newActorModel.actorTranslations[0] = newTranslationData;
				
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };
			try {
				// push new actor to dataset model
				await TIMAAT.ActorDatasets._actorAdded(newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		// createActorSubtype: async function(actorSubtype, actorSubtypeModel, actorModel, name, source) {
		createActorSubtype: async function(actorSubtype, actorSubtypeModel, actorModel, name) {
    	console.log("TCL: actorSubtype", actorSubtype);
    	console.log("TCL: actorModel", actorModel);
			// createActorSubtype: async function(actorModel, actorModelTranslation, actorSubtypeModel) { // actorSubtype has no translation table at the moment
			// console.log("TCL: createActorSubtype: async function-> actorSubtypeModel, actorModel, name, source", actorSubtypeModel, actorModel, name, source);
			try {
				// create name
				var newDisplayName = await TIMAAT.ActorService.createName(name);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// create actor
				var tempActorModel = actorModel;
				tempActorModel.displayName = newDisplayName;
				// tempActorModel.source = source;
				var newActorModel = await TIMAAT.ActorService.createActor(tempActorModel);
        console.log("TCL: newActorModel", newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			// try {
			// 	// update source (createActor created an empty source)
			// 	source.id = newActorModel.sources[0].id;
			// 	var updatedSource = await TIMAAT.ActorService.updateSource(source);
			// 	newActorModel.sources[0] = updatedSource; // TODO refactor once several sources can be added
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };
			try {
				// create actorSubtype with actor id
				actorSubtypeModel.actorId = newActorModel.id;
				var newActorSubtypeModel = await TIMAAT.ActorService.createActorSubtype(actorSubtype, newActorModel, actorSubtypeModel);
        console.log("TCL: newActorSubtypeModel", newActorSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// push new actorSubtype to dataset model
				console.log("TCL: newActorModel", newActorModel);
				switch (actorSubtype) {
					case 'person':
						newActorModel.actorPerson = actorSubtypeModel;
					break;
					case 'collective':
						newActorModel.actorCollective = actorSubtypeModel;
					break;
				};
				console.log("TCL: newActorModel", newActorModel);
				await TIMAAT.ActorDatasets._actorSubtypeAdded(actorSubtype, newActorModel);
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
					actor.model.names.push(addedNameModel);
					console.log("TCL: actor.model.names", actor.model.names);
					console.log("TCL: actor.model.names.length", actor.model.names.length);	
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
					var tempSource = await TIMAAT.ActorService.updateSource(actor.model.sources[0]);
					actor.model.sources[0] = tempSource;
	
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

			try {
				// update source
				var tempSource = await TIMAAT.ActorService.updateSource(actor.model.sources[0]);
				actor.model.sources[0] = tempSource;
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of actorSubtypeData
				// console.log("TCL: actorSubtype", actorSubtype);
				// console.log("TCL: actorSubtypeData.model", actorSubtypeData.model);
				// var tempActorSubtypeData = actorSubtypeData;
				// tempActorSubtypeData.model.actor.sources = null;
				// console.log("TCL: tempActorSubtypeData", tempActorSubtypeData);
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
				for (; i < actor.model.names.length; i++) {
					if (actor.model.names[i].id == name.id)
						actor.model.names[i] = tempName;
				}

				// update data that is part of actor (includes updating last edited by/at)
				// console.log("TCL: updateActor: async function - actor.model", actor.model);
				// var tempActorModel = await TIMAAT.ActorService.updateActor(actor.model);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		_actorAdded: function(actor) {
    	console.log("TCL: actor", actor);
			TIMAAT.ActorDatasets.actors.model.push(actor);
			TIMAAT.ActorDatasets.actors.push(new TIMAAT.Actor(actor, 'actor'));
		},

		_actorSubtypeAdded: async function(actorSubtype, actor) {
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
			// remove all names from actor
			var i = 0;
			for (; i < actor.model.names.length; i++ ) { // remove obsolete names
				if ( actor.model.names[i].id != actor.model.displayName.id ) {
					TIMAAT.ActorService.removeName(actor.model.names[i]);
					actor.model.names.splice(i,1);
				}
			}
			actor.remove();
		},

		_actorSubtypeRemoved: function(actorSubtype, actorSubtypeData) {
			console.log("TCL: _actorSubtypeRemoved: function(actorSubtype, actorSubtypeData)", actorSubtype, actorSubtypeData);
			// sync to server
			TIMAAT.ActorService.removeActorSubtype(actorSubtype, actorSubtypeData);
			var i = 0;
			for (; i < actorSubtypeData.model.actor.names.length; i++ ) { // remove obsolete names
				if ( actorSubtypeData.model.actor.names[i].id != actorSubtypeData.model.actor.name.id ) {
					TIMAAT.ActorService.removeName(actorSubtypeData.model.actor.names[i]);
					actorSubtypeData.model.actor.names.splice(i,1);
				}
			}
			actorSubtypeData.remove();
		},

		updateActorModelData: function(actor, formDataObject) {
			// actor data
			// actor.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
			// actor.model.copyright = formDataObject.copyright;
			// actor.model.remark = formDataObject.remark;
			// display-title data
			actor.model.displayName.name = formDataObject.displayName;
			actor.model.displayName.language.id = Number(formDataObject.displayNameLanguageId);
			var i = 0;
			for (; i < actor.model.names.length; i++) {
				if (actor.model.displayName.id == actor.model.names[i].id) {
					actor.model.names[i] = actor.model.displayName;
					break;
				}
			}
			// source data
			// actor.model.sources[0].url = formDataObject.sourceUrl;
			// actor.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
			// actor.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
			// actor.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;

			return actor;
		},

		createActorModel: function(formDataObject, actorTypeId) {
			var actor = {
				id: 0,
				// remark: formDataObject.remark,
				// copyright: formDataObject.copyright,
				// releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
				actorType: {
					id: actorTypeId,
				},
				names: [{
					id: 0,
					// language: {
					// 	id: Number(formDataObject.displayNameLanguageId),
					// },
					name: formDataObject.displayName,
				}],
				// actorTranslations: [],
			};
			return actor;
		},

		createDisplayNameModel: function(formDataObject) {
			var displayName = {
				id: 0,
				// language: {
				// 	id: Number(formDataObject.displayNameLanguageId),
				// },
				name: formDataObject.displayName,
			};
			return displayName;
		},

	}
	
}, window));
