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
		emailAddressTypes: null,
		phoneNumbers: null,
		phoneNumberTypes: null,
		personIsMemberOfCollectives: null,
		collectiveSelectObjects: null,
		collectiveSelectObjectsSorted: '',
		actorsLoaded: false,
		subNavTab: null,
		lastForm: null,
		selectedId: null,

		init: function() {   
			TIMAAT.ActorDatasets.initActors();
			TIMAAT.ActorDatasets.initPersons();
			TIMAAT.ActorDatasets.initCollectives();
			TIMAAT.ActorDatasets.initNames();
			TIMAAT.ActorDatasets.initAddresses();
			TIMAAT.ActorDatasets.initEmailAddresses();
			TIMAAT.ActorDatasets.initPhoneNumbers();
			TIMAAT.ActorDatasets.initMemberOfCollectives();
			TIMAAT.ActorDatasets.initRoles();
			TIMAAT.ActorDatasets.initRoleMedium();
			$('.actors-data-tabs').hide();
			$('.actors-datatables').hide();
			$('.actors-datatable').show();
			$('#timaat-actordatasets-metadata-form').data('actorType', 'actor');
		},

		initActorComponent: function() {
    console.log("TCL: initActorComponent");
			if (!TIMAAT.ActorDatasets.actorsLoaded) {
				TIMAAT.ActorDatasets.setActorList();
				TIMAAT.ActorDatasets.actorsLoaded = true;
			}
			TIMAAT.UI.showComponent('actors');
		},

		initActorTypes: function() {
			// console.log("TCL: ActorDatasets: initActorTypes: function()");		
			// delete actorType functionality
			$('#timaat-actortype-delete-submit').on('click', function(ev) {
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
				$('#timaat-actordatasets-actortype-meta-name').val(type).trigger('input');
			});

			// Submit actorType data
			$('#timaat-actordatasets-actortype-meta-submit').on('click', function(ev) {
				// Create/Edit actorType window submitted data validation
				var modal = $('#timaat-actordatasets-actortype-meta');
				var actorType = modal.data('actorType');
				var type = $('#timaat-actordatasets-actortype-meta-name').val();

				if (actorType) {
					actorType.model.actor.actorTypeTranslations[0].type = type;
					// actorType.updateUI();
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
				if ( $('#timaat-actordatasets-actortype-meta-name').val().length > 0 ) {
					$('#timaat-actordatasets-actortype-meta-submit').prop('disabled', false);
					$('#timaat-actordatasets-actortype-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-actordatasets-actortype-meta-submit').prop('disabled', true);
					$('#timaat-actordatasets-actortype-meta-submit').attr('disabled');
				}
			});
		},

		initActors: function() {
			// console.log("TCL: ActorDatasets: initActors: function()");

			// nav-bar functionality
			$('#actors-tab-actor-metadata-form').on('click', function(event) {
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');
				var type = actor.model.actorType.actorTypeTranslations[0].type;
				$('.form').hide();
				TIMAAT.ActorDatasets.subNavTab = null;
				$('.nav-tabs a[href="#actorDatasheet"]').tab('show');
				TIMAAT.ActorDatasets.actorFormDatasheet('show', type, $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// add actor button functionality (in actor list - opens datasheet form)
			$('#timaat-actordatasets-actor-add').on('click', function(event) {
				$('#timaat-actordatasets-metadata-form').attr('data-type', 'actor');
				$('#timaat-actordatasets-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor('actor');
			});

			$('.toggleAble > legend').on('click', function(event) {
				if ($('#actor-profile-images').css('visibility') == 'hidden') {
					$('#actor-profile-images').css('visibility', 'visible');
					$('#legend-collapse-icon').toggleClass('fa-caret-down fa-caret-up');
					let actor = $('#timaat-actordatasets-metadata-form').data('actor');
					let maxHeight = Math.max.apply(Math, actor.model.profileImages.map(function(o) {return o.height}));
					if (maxHeight > 480)
						$('#profile-image-carousel-inner').css('height', 480);
					else
						$('#profile-image-carousel-inner').css('height', maxHeight);
				}
				else {
					$('#actor-profile-images').css('visibility', 'hidden');
					$('#profile-image-carousel-inner').css('height', 0);
					$('#legend-collapse-icon').toggleClass('fa-caret-down fa-caret-up');
				}
			});

			// delete actor button (in form) handler
			$('#timaat-actordatasets-metadata-form-delete').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-actordatasets-actor-delete').data('actor', $('#timaat-actordatasets-metadata-form').data('actor'));
				$('#timaat-actordatasets-actor-delete').modal('show');
			});

			// confirm delete actor modal functionality
			$('#timaat-actordatasets-modal-delete-submit').on('click', async function(ev) {
				var modal = $('#timaat-actordatasets-actor-delete');
				var actor = modal.data('actor');
				if (actor) {
					var actorType = actor.model.actorType.actorTypeTranslations[0].type;
					try {
						await TIMAAT.ActorDatasets._actorRemoved(actor);
					} catch (error) {
						console.log("error: ", error);
					}
					try {
						await TIMAAT.ActorDatasets.refreshDatatable(actorType);
						await TIMAAT.ActorDatasets.refreshDatatable('actor');
					} catch (error) {
						console.log("error: ", error);
					}
				}
				modal.modal('hide');
				$('#timaat-actordatasets-metadata-form').hide();
				$('.actors-data-tabs').hide();
				$('.form').hide();
			});

			// edit content form button handler
			$('#timaat-actordatasets-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var type = $('#timaat-actordatasets-metadata-form').attr('data-type');
				TIMAAT.ActorDatasets.actorFormDatasheet('edit', type, $('#timaat-actordatasets-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});
			
			// actor form handlers
			// carousel button handler
			$('a[data-slide="prev"]').on('click', function() {
				$('#dynamic-profile-image-fields').carousel('prev');
			});
			
			// carousel button handler
			$('a[data-slide="next"]').on('click', function() {
				$('#dynamic-profile-image-fields').carousel('next');
			});

			// add profile image to list
			$('.datasheet-form-add-profile-image-button').on('click', function(event) {
				var entryToAppend =
					`<div class="form-group" data-role="ActorProfileImageEntry">
						<div class="form-row">
							<div class="col-md-12">
								<label class="sr-only">Has Role(s)</label>
								<select class="form-control form-control-sm"
												id="ActorProfileImageMultiSelectDropdown"
												name="mediumId"
												data-placeholder="Select media"
												multiple="multiple"
												readonly="true">
								</select>
							</div>
						</div>
					</div>`;
			});

			// remove currently displayed profile image
			$('.datasheet-form-remove-profile-image-button').on('click', function(event) {
				$('#dynamic-profile-image-fields').find('.carousel-indicators > li.active').remove();
				$('#dynamic-profile-image-fields').find('.carousel-indicators > li').first().addClass('active');
				$('#dynamic-profile-image-fields').find('.carousel-item.active').remove();
				$('#dynamic-profile-image-fields').find('.carousel-item').first().addClass('active');
				var remainingElements = $('.carousel-inner > div').length;
				if (remainingElements == 0) {
					$('#dynamic-profile-image-fields').hide();
					$('#dynamic-profile-image-fields-placeholder').show();
				} else {
					var i = 1;
					for (; i <= remainingElements; i++) {
						$('.carousel-indicators > li:nth-child('+i+')').attr('data-slide-to', i-1); // adjust carousel-indicators order
					}
				}
			});

			// submit actor metadata button functionality
			$('#timaat-actordatasets-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-actordatasets-metadata-form').valid()) return false;

				var type = $('#timaat-actordatasets-metadata-form').attr('data-type');
				// the actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');				
				// console.log("TCL: actor", actor);

				// create/Edit actor window submitted data
				var formDataRaw = $('#timaat-actordatasets-metadata-form').serializeArray();
				var formDataObject = {};
				$(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				var formDataSanitized = formDataObject;
				formDataSanitized.isFictional = (formDataObject.isFictional == "on") ? true : false;
				formDataSanitized.nameUsedFrom = moment.utc(formDataObject.nameUsedFrom, "YYYY-MM-DD");
				formDataSanitized.nameUsedUntil = moment.utc(formDataObject.nameUsedUntil, "YYYY-MM-DD");
				formDataSanitized.sexId = (formDataObject.sexId === undefined) ? 4 : Number(formDataObject.sexId); // set default to 'unknown' (id 4)
				formDataSanitized.dateOfBirth = moment.utc(formDataObject.dateOfBirth, "YYYY-MM-DD");
				formDataSanitized.dayOfDeath = moment.utc(formDataObject.dayOfDeath, "YYYY-MM-DD");
				formDataSanitized.placeOfBirth = (formDataObject.placeOfBirth == "") ? null : Number(formDataObject.placeOfBirth);
				formDataSanitized.placeOfDeath = (formDataObject.placeOfDeath == "") ? null : Number(formDataObject.placeOfDeath);
				formDataSanitized.founded = moment.utc(formDataObject.founded, "YYYY-MM-DD");
				formDataSanitized.disbanded = moment.utc(formDataObject.disbanded, "YYYY-MM-DD");
				delete formDataSanitized.imageId;
				
				var formImageIds = [];
				var i = 0;
				for (; i < formDataRaw.length; i++) {
					if (formDataRaw[i].name == 'imageId') {
						formImageIds.push({ mediumId: Number(formDataRaw[i].value)});
					}
				}
				// console.log("TCL: formImageIds", formImageIds);
				formDataSanitized.profileImages = formImageIds;
        // console.log("TCL: formDataSanitized", formDataSanitized);
				
				if (actor) { // update actor
					// actor data
					actor.model = await TIMAAT.ActorDatasets.updateActorModelData(actor.model, formDataSanitized);
					// actor subtype data
					switch (type) {
						case 'person':
							actor.model.actorPerson.title = formDataSanitized.title;
							actor.model.actorPerson.dateOfBirth = formDataSanitized.dateOfBirth;
							actor.model.actorPerson.placeOfBirth = formDataSanitized.placeOfBirth;
							actor.model.actorPerson.dayOfDeath = formDataSanitized.dayOfDeath;
							actor.model.actorPerson.placeOfDeath = formDataSanitized.placeOfDeath;
							actor.model.actorPerson.sex.id = formDataSanitized.sexId;
							// actor.model.actorPerson.citizenships[0].citizenshipTranslations[0].name = formDataSanitized.citizenshipName; // TODO
							actor.model.actorPerson.actorPersonTranslations[0].specialFeatures = formDataSanitized.specialFeatures;
						break;
						case 'collective':
							actor.model.actorCollective.founded = formDataSanitized.founded;
							actor.model.actorCollective.disbanded = formDataSanitized.disbanded;
						break;
					}
					await TIMAAT.ActorDatasets.updateActor(type, actor, formImageIds);
					// actor.updateUI();
				} else { // create new actor
					var actorModel = await TIMAAT.ActorDatasets.createActorModel(type, formDataSanitized);
					var actorSubtypeModel = await TIMAAT.ActorDatasets.createActorSubtypeModel(type, formDataSanitized);
					var displayNameModel = await TIMAAT.ActorDatasets.createNameModel(formDataSanitized);
					var actorSubtypeTranslationModel = null;
					var citizenshipModel = null;
					if (type == 'person') {
						actorSubtypeTranslationModel = await TIMAAT.ActorDatasets.createActorPersonTranslationModel(formDataSanitized);
						// citizenshipModel = await TIMAAT.ActorDatasets.createCitizenshipModel(formDataSanitized); // TODO
					}
					var newActor = await TIMAAT.ActorDatasets.createActor(type, actorModel, actorSubtypeModel, displayNameModel, actorSubtypeTranslationModel, citizenshipModel);
					actor = new TIMAAT.Actor(newActor, type);
					$('#timaat-actordatasets-metadata-form').data('actor', actor);
				}
				await TIMAAT.ActorDatasets.refreshDatatable('actor');
				await TIMAAT.ActorDatasets.refreshDatatable(type);
				TIMAAT.ActorDatasets.selectLastSelection('actor', actor.model.id);
				TIMAAT.ActorDatasets.selectLastSelection(type, actor.model.id);
				TIMAAT.ActorDatasets.actorFormDatasheet('show', type, actor);
			});

			// cancel add/edit button in content form functionality
			$('#timaat-actordatasets-metadata-form-dismiss').on('click', function(event) {
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');
				var type = $('#timaat-actordatasets-metadata-form').attr('data-type');
				if (actor != null) {
					TIMAAT.ActorDatasets.actorFormDatasheet('show', type, actor);
				} else { // dismiss actor creation
					$('.form').hide();
				}
			});

			// tag button handler
			$('#timaat-actordatasets-metadata-form-tag').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#timaat-actordatasets-actor-tags');
				modal.data('actor', $('#timaat-actordatasets-metadata-form').data('actor'));
				var actor = modal.data('actor');
				modal.find('.modal-body').html(`
					<form role="form" id="actorTagsModalForm">
						<div class="form-group">
							<label for="actor-tags-multi-select-dropdown">Actor tags</label>
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="actor-tags-multi-select-dropdown"
												name="tagId"
												data-role="tagId"
												data-placeholder="Select actor tags"
												multiple="multiple">
								</select>
							</div>
						</div>`+
					`</form>`);
        $('#actor-tags-multi-select-dropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: true,
					allowClear: true,
					tags: true,
					tokenSeparators: [',', ' '],
					ajax: {
						url: 'api/tag/selectList/',
						type: 'GET',
						dataType: 'json',
						delay: 250,
						headers: {
							"Authorization": "Bearer "+TIMAAT.Service.token,
							"Content-Type": "application/json",
						},
						// additional parameters
						data: function(params) {
							return {
								search: params.term,
								page: params.page
							};          
						},
						processResults: function(data, params) {
							params.page = params.page || 1;
							return {
								results: data
							};
						},
						cache: true
					},
					minimumInputLength: 0,
				});
				await TIMAAT.ActorService.getTagList(actor.model.id).then(function(data) {
					console.log("TCL: then: data", data);
					var tagSelect = $('#actor-tags-multi-select-dropdown');
					if (data.length > 0) {
						// create the options and append to Select2
						var i = 0;
						for (; i < data.length; i++) {
							var option = new Option(data[i].name, data[i].id, true, true);
							tagSelect.append(option).trigger('change');
						}
						// manually trigger the 'select2:select' event
						tagSelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					}
				});
				$('#timaat-actordatasets-actor-tags').modal('show');
			});

			// submit tag modal button functionality
			$('#timaat-actordatasets-modal-tag-submit').on('click', async function(event) {
				event.preventDefault();
				var modal = $('#timaat-actordatasets-actor-tags');
				if (!$('#actorTagsModalForm').valid()) 
					return false;
				var actor = modal.data('actor');
        console.log("TCL: actor", actor);
				var formDataRaw = $('#actorTagsModalForm').serializeArray();
        console.log("TCL: formDataRaw", formDataRaw);
				var i = 0;
				var tagIdList = [];
				var newTagList = [];
				for (; i < formDataRaw.length; i++) {
					if (isNaN(Number(formDataRaw[i].value))) {
						newTagList.push( { id: 0, name: formDataRaw[i].value} ); // new tags that have to be added to the system first
					} else {
						tagIdList.push( {id: formDataRaw[i].value} );
					}
				}
				actor.model = await TIMAAT.ActorDatasets.updateActorHasTagsList(actor.model, tagIdList);
				if (newTagList.length > 0) {
					var updatedActorModel = await TIMAAT.ActorDatasets.createNewTagsAndAddToActor(actor.model, newTagList);
					console.log("TCL: updatedActorModel", updatedActorModel);
					actor.model.tags = updatedActorModel.tags;
				}
				$('#timaat-actordatasets-metadata-form').data('actor', actor);
				modal.modal('hide');
			});

			// key press events
			$('#timaat-actordatasets-metadata-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-metadata-form-submit').trigger('click');
				}
			});

			$('#timaat-actordatasets-metadata-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-metadata-form-dismiss').trigger('click');
				}
			});
			
		},

		initPersons: function() {
			// nav-bar functionality
			$('#actors-tab-person-metadata-form').on('click', function(event) {
				$('.form').hide();
				TIMAAT.ActorDatasets.subNavTab = null;
				$('.nav-tabs a[href="#personDatasheet"]').tab('show');
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// add person button functionality (opens form)
			$('#timaat-actordatasets-person-add').on('click', function(event) {
				$('#timaat-actordatasets-metadata-form').attr('data-type', 'person');
				$('#timaat-actordatasets-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("person");
			});

		},

		initCollectives: function() {
			// nav-bar functionality
			$('#actors-tab-collective-metadata-form').on('click', function(event) {
				$('.form').hide();
				TIMAAT.ActorDatasets.subNavTab = null;
				$('.nav-tabs a[href="#collectiveDatasheet"]').tab('show');
				TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// add collective button functionality (opens form)
			$('#timaat-actordatasets-collective-add').on('click', function(event) {
				$('#timaat-actordatasets-metadata-form').attr('data-type', 'collective');
				$('#timaat-actordatasets-metadata-form').data('actor', null);
				TIMAAT.ActorDatasets.addActor("collective");
			});

		},

		initNames: function() {
			$('#actors-tab-actor-names-form').on('click', function(event) {
				$('.nav-tabs a[href="#actorNames"]').tab('show');
				TIMAAT.ActorDatasets.subNavTab = 'actorNames';
				TIMAAT.ActorDatasets.lastForm = 'names';
				$('.form').hide();
				// TIMAAT.ActorDatasets.setActorNameList($('#timaat-actordatasets-metadata-form').data('actor'))
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});
			
			// edit names form button handler
			$('#timaat-actordatasets-actor-actornames-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormNames('edit', $('#timaat-actordatasets-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			$(document).on('click', '.isBirthName', function(event) {
        if ($(this).data('waschecked') == true)
        {
          $(this).prop('checked', false);
					// $(this).data('waschecked', false);
					$('input[name="isBirthName"]').data('waschecked', false);
        }
        else {
					$('input[name="isBirthName"]').data('waschecked', false);
					$(this).data('waschecked', true);
				}
			});

			// Add name button click
			$(document).on('click','[data-role="new-name-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				console.log("TCL: add name to list");
				var listEntry = $(this).closest('[data-role="new-name-fields"]');
				var newName = [];
				if (listEntry.find('input').each(function(){           
					newName.push($(this).val());
          // console.log("TCL: $(this).val()", $(this).val());
          // console.log("TCL: newName", newName);
				}));
				if (!$('#timaat-actordatasets-actor-actornames-form').valid()) 
					return false;
				if (newName != '') { // TODO is '' proper check?
					var namesInForm = $('#timaat-actordatasets-actor-actornames-form').serializeArray();
					console.log("TCL: namesInForm", namesInForm);
					var numberOfNameElements = 3;
					var indexName = namesInForm[namesInForm.length-numberOfNameElements-1].name; // find last used indexed name (first prior to new address fields)
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
									<input class="form-check-input isDisplayName" type="radio" name="isDisplayName" data-role="displayName" placeholder="Is Display Name">
								</div>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isBirthName"></label>
									<input class="form-check-input isBirthName" type="radio" name="isBirthName" data-role="birthName" data-waschecked="false" placeholder="Is birth Name">
								</div>
							</div>
							<div class="col-sm-5 col-md-5">
								<label class="sr-only">Name</label>
								<input class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-name" name="newActorName[`+i+`]" data-role="newActorName[`+i+`]" value="`+newName[0]+`" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" required>
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used from</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-usedfrom" name="newNameUsedFrom[`+i+`]" data-role="newNameUsedFrom[`+i+`]" value="`+newName[1]+`" placeholder="[Enter name used from]" aria-describedby="Name used from">
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used until</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-useduntil" name="newNameUsedUntil[`+i+`]" data-role="newNameUsedUntil[`+i+`]" value="`+newName[2]+`" placeholder="[Enter name used until]" aria-describedby="Name used until">
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
					);
					$('input[name="newActorName['+i+']"]').rules("add", { required: true, minlength: 3, maxlength: 200, });
					if (listEntry.find('input').each(function(){
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						$(this).val('');
					}));
					$('.timaat-actordatasets-actor-actornames-name-usedfrom').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
					$('.timaat-actordatasets-actor-actornames-name-useduntil').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
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
			$('#timaat-actordatasets-actor-actornames-form-submit').on('click', async function(event) {
				// console.log("TCL: Names form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-name-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}
				// test if form is valid 
				if (!$('#timaat-actordatasets-actor-actornames-form').valid()) {
					$('[data-role="new-name-fields"]').append(TIMAAT.ActorDatasets.appendNewNameField());				
					return false;
				}

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-actor-actornames-form').data("actor");
				var type = actor.model.actorType.actorTypeTranslations[0].type;

				// Create/Edit actor window submitted data
				var formData = $('#timaat-actordatasets-actor-actornames-form').serializeArray();
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
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						// only update if anything changed // TODO check will always pass due to different data formats
						if (name != actor.model.actorNames[i]) {
							console.log("TCL: update existing name");
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
						// update display name
						var displayNameChanged = false;
						if (formNameList[i].isDisplayName) {
							actor.model.displayName = actor.model.actorNames[i];
							displayNameChanged = true;
						}
						// update birth name
						var birthNameChanged = false
						if (formNameList[i].isBirthName) {
							actor.model.birthName = actor.model.actorNames[i];
							birthNameChanged = true;
						// // update display name
						// var displayNameChanged = false;
						// if (formNameList[i].isDisplayName && (actor.model.displayName == null || actor.model.displayName.id != actor.model.actorNames[i].id)) {
						// 	actor.model.displayName = actor.model.actorNames[i];
						// 	displayNameChanged = true;
						// } else if (!formNameList[i].isDisplayName && actor.model.displayName != null && actor.model.displayName.id == actor.model.actorNames[i].id) {
						// 	actor.model.displayName = null;
						// 	displayNameChanged = true;
						// }
						// var birthNameChanged = false;
						// // update birth name
						// if (formNameList[i].isBirthName && (actor.model.birthName == null || actor.model.birthName.id != actor.model.actorNames[i].id)) {
						// 	actor.model.birthName = actor.model.actorNames[i];
						// 	birthNameChanged = true;
						} else if (!formNameList[i].isBirthName && actor.model.birthName != null && actor.model.birthName.id == actor.model.actorNames[i].id) {
							actor.model.birthName = null;
							birthNameChanged = true;
						}
						if ( birthNameChanged || displayNameChanged) {
							// console.log("TCL type, actor", type, actor);
							await TIMAAT.ActorDatasets.updateActor(type, actor);
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
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						// only update if anything changed // TODO check will always pass due to different data formats
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
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						newNames.push(name);
					}
					console.log("TCL: newNames", newNames);
					console.log("TCL: (update existing names and) add new ones");
					await TIMAAT.ActorDatasets.addNames(actor, newNames);
					// for the whole list check new birth name
					i = 0;
					for (; i < formNameList.length; i++) {
						console.log("TCL: formNameList", formNameList);
						console.log("TCL: actor.model", actor.model);
						// update display name
						var displayNameChanged = false;
						if (formNameList[i].isDisplayName) {
							actor.model.displayName = actor.model.actorNames[i];
							displayNameChanged = true;
						}
						// update birth name
						var birthNameChanged = false
						if (formNameList[i].isBirthName) {
							actor.model.birthName = actor.model.actorNames[i];
							birthNameChanged = true;
						// // update display name
						// var displayNameChanged = false;
						// if (formNameList[i].isDisplayName && (actor.model.displayName == null || actor.model.displayName.id != actor.model.actorNames[i].id)) {
						// 	actor.model.displayName = actor.model.actorNames[i];
						// 	displayNameChanged = true;
						// } else if (!formNameList[i].isDisplayName && actor.model.displayName != null && actor.model.displayName.id == actor.model.actorNames[i].id) {
						// 	actor.model.displayName = null;
						// 	displayNameChanged = true;
						// }
						// // update birth name
						// var birthNameChanged = false;
						// if (formNameList[i].isBirthName && (actor.model.birthName == null || actor.model.birthName.id != actor.model.actorNames[i].id)) {
						// 	actor.model.birthName = actor.model.actorNames[i];
						// 	birthNameChanged = true;
						} else if (!formNameList[i].isBirthName && actor.model.birthName != null && actor.model.birthName.id == actor.model.actorNames[i].id) {
							actor.model.birthName = null;
							birthNameChanged = true;
						}
						// only update if anything changed // TODO check will always pass due to different data formats
						if ( birthNameChanged || displayNameChanged) {
							// console.log("TCL type, actor", type, actor);
							await TIMAAT.ActorDatasets.updateActor(type, actor);
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
							usedFrom: formNameList[i].usedFrom,
							usedUntil: formNameList[i].usedUntil,
						};
						if (name != actor.model.actorNames[i]) {
							console.log("TCL: update existing names (and delete obsolete ones)");
							await TIMAAT.ActorDatasets.updateName(name, actor);
						}
						// update display name
						var displayNameChanged = false;
						if (formNameList[i].isDisplayName) {
							actor.model.displayName = actor.model.actorNames[i];
							displayNameChanged = true;
						}
						// update birth name
						var birthNameChanged = false
						if (formNameList[i].isBirthName) {
							actor.model.birthName = actor.model.actorNames[i];
							birthNameChanged = true;
						// // update display name
						// var displayNameChanged = false;
						// if (formNameList[i].isDisplayName && (actor.model.displayName == null || actor.model.displayName.id != actor.model.actorNames[i].id)) {
						// 	actor.model.displayName = actor.model.actorNames[i];
						// 	displayNameChanged = true;
						// } else if (!formNameList[i].isDisplayName && actor.model.displayName != null && actor.model.displayName.id == actor.model.actorNames[i].id) {
						// 	actor.model.displayName = null;
						// 	displayNameChanged = true;
						// }
						// // update birth name
						// var birthNameChanged = false;
						// if (formNameList[i].isBirthName && (actor.model.birthName == null || actor.model.birthName.id != actor.model.actorNames[i].id)) {
						// 	actor.model.birthName = actor.model.actorNames[i];
						// 	birthNameChanged = true;
						} else if (!formNameList[i].isBirthName && actor.model.birthName != null && actor.model.birthName.id == actor.model.actorNames[i].id) {
							actor.model.birthName = null;
							birthNameChanged = true;
						}
						if (birthNameChanged || displayNameChanged) {
							console.log("TCL type, actor", type, actor);
							await TIMAAT.ActorDatasets.updateActor(type, actor);
						}
					}
					var i = actor.model.actorNames.length - 1;
					for (; i >= formNameList.length; i-- ) { // remove obsolete names starting at end of list
						console.log("TCL: actor.model", actor.model);
						if (actor.model.birthName != null && actor.model.birthName.id == actor.model.actorNames[i].id) {
							actor.model.birthName = null;
							console.log("TCL: remove birthName before deleting name");		
							console.log("TCL type, actor", type, actor);
							await TIMAAT.ActorDatasets.updateActor(type, actor);
						}
						console.log("TCL: (update existing names and) delete obsolete ones");		
						TIMAAT.ActorService.removeName(actor.model.actorNames[i]);
						actor.model.actorNames.pop();
					}
				}
				console.log("TCL: show actor name form");
				await TIMAAT.ActorDatasets.refreshDatatable(type);
				await TIMAAT.ActorDatasets.refreshDatatable('actor');
				TIMAAT.ActorDatasets.selectLastSelection('actor', actor.model.id);
				TIMAAT.ActorDatasets.selectLastSelection(type, actor.model.id);
				TIMAAT.ActorDatasets.actorFormNames('show', actor);
			});

			// Cancel add/edit button in names form functionality
			$('#timaat-actordatasets-actor-actornames-form-dismiss').on('click', function(event) {
				TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// Key press events
			$('#timaat-actordatasets-actor-actornames-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-actornames-form-submit').trigger('click');
				}
			});

			$('#timaat-actordatasets-actor-actornames-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-actornames-form-dismiss').trigger('click');
				}
			});

			$('#dynamic-name-fields').keypress(function(event) {
				// event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault(); // prevent activating delete button when pressing enter in a field of the row
				}
			});

			$('#new-name-fields').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault();
					$('#new-name-fields').find('[data-role="add"]').trigger('click');
				}
			});
		},

		initAddresses: function() {
			$('#actors-tab-actor-addresses-form').on('click', function(event) {
				$('.nav-tabs a[href="#actorAddresses"]').tab('show');
				TIMAAT.ActorDatasets.subNavTab = 'actorAddresses';
				TIMAAT.ActorDatasets.lastForm = 'addresses';
				$('.form').hide();
				TIMAAT.ActorDatasets.setActorHasAddressList($('#timaat-actordatasets-metadata-form').data('actor'))
				TIMAAT.ActorDatasets.actorFormAddresses('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});
			
			// edit addresses form button handler
			$('#timaat-actordatasets-actor-addresses-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormAddresses('edit', $('#timaat-actordatasets-metadata-form').data('actor'));
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
				if (!$('#timaat-actordatasets-actor-addresses-form').valid()) 
					return false;
				console.log("TCL: newAddress", newAddress);
				if (newAddress != '') { // TODO is '' proper check?
					var addressesInForm = $('#timaat-actordatasets-actor-addresses-form').serializeArray();
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
					$('#dynamic-actorhasaddress-fields').append(
						`<div class="form-group" data-role="address-entry">
							<div class="form-row">
								<div class="col-md-11">
									<fieldset>
										<legend>Address</legend>
										<div class="form-row align-items-center">
											<div class="col-md-2 col-auto">
												<div class="form-check form-check-inline">
													<input class="form-check-input isPrimaryAddress"
																 type="radio" name="isPrimaryAddress"
																 data-role="primaryAddress"
																 placeholder="Is primary address">
													<label class="form-check-label col-form-label col-form-label-sm" for="isPrimaryAddress">Primary address</label>
												</div>
											</div>
											<div class="col-md-5">
												<label class="col-form-label col-form-label-sm">Street name</label>
												<input type="text"
															 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetname"
															 name="newStreetName[`+i+`]"
															 data-role="newStreetName[`+i+`]"
															 value="`+newAddress[0]+`"
															 placeholder="[Enter street name]"
															 aria-describedby="Street name"
															 minlength="3"
															 maxlength="200"
															 rows="1"
															 readonly="true">
											</div>
											<div class="col-md-2">
												<label class="col-form-label col-form-label-sm">Street number</label>
												<input type="text"
															 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetnumber"
															 name="newStreetNumber[`+i+`]"
															 data-role="newStreetNumber[`+i+`]"
															 value="`+newAddress[1]+`"
															 placeholder="[Enter street number]"
															 aria-describedby="Street number"
															 maxlength="10">
											</div>
											<div class="col-md-3">
												<label class="col-form-label col-form-label-sm">Street addition</label>
												<input type="text"
															 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetaddition"
															 name="newStreetAddition[`+i+`]" data-role="newStreetAddition[`+i+`]"
															 value="`+newAddress[2]+`"
															 placeholder="[Enter street addition]"
															 aria-describedby="Street addition" maxlength="50">
											</div>
										</div>
										<div class="form-row">
											<div class="col-md-3">
												<label class="col-form-label col-form-label-sm">Postal code</label>
												<input type="text"
															 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postalcode"
															 name="newPostalCode[`+i+`]"
															 data-role="newPostalCode[`+i+`]"
															 value="`+newAddress[3]+`"
															 placeholder="[Enter postal code]"
															 aria-describedby="Postal code"
															 maxlength="8">
											</div>
											<div class="col-md-6">
												<label class="col-form-label col-form-label-sm">City</label>
												<input type="text"
															 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-cityname"
															 name="newCityName[`+i+`]"
															 data-role="newCityName[`+i+`]"
															 value="`+newAddress[4]+`"
															 placeholder="[Enter city]"
															 aria-describedby="City"
															 readonly="true">
											</div>
											<div class="col-md-3">
												<label class="col-form-label col-form-label-sm">Post office box</label>
												<input type="text"
															 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postofficebox"
															 name="newPostOfficeBox[`+i+`]"
															 data-role="newPostOfficeBox[`+i+`]"
															 value="`+newAddress[5]+`"
															 placeholder="[Enter post office box]"
															 aria-describedby="Post office box"
															 maxlength="10">
											</div>
										</div>
										<div class="form-row">
											<div class="col-md-4">
												<label class="col-form-label col-form-label-sm">Address type*</label>
												<select class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-addresstype-id" name="newAddressTypeId[`+i+`]" data-role="newAddressTypeId[`+i+`]" required>
													<option value="" disabled selected hidden>[Choose address type...]</option>
													<option value="1"> </option>
													<option value="2">business</option>
													<option value="3">home</option>
													<option value="4">other</option>
												</select>
											</div>
											<div class="col-md-4">
												<label class="col-form-label col-form-label-sm">Address used from</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-usedfrom" name="addressUsedFrom[`+i+`]" data-role="addressUsedFrom" value="`+newAddress[6]+`" placeholder="[Enter used from]" aria-describedby="Address used from">
											</div>
											<div class="col-md-4">
												<label class="col-form-label col-form-label-sm">Address used until</label>
												<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-useduntil" name="addressUsedUntil[`+i+`]" data-role="addressUsedUntil" value="`+newAddress[7]+`" placeholder="[Enter used until]" aria-describedby="Address used until">
											</div>
										</div>
									</fieldset>
								</div>
								<div class="col-md-1 vertical-aligned">
									<button class="btn btn-danger" data-role="remove">
										<i class="fas fa-trash-alt"></i>
									</button>
								</div>
							</div>
						</div>`
					);
					$('input[name="newActorAddress['+i+']"]').rules("add", { required: true, minlength: 3, maxlength: 200});
					$('[data-role="newAddressTypeId['+i+']"]').find('option[value='+addressTypeId+']').attr('selected', true);
					if (listEntry.find('input').each(function(){
						// console.log("TCL: find(input) $(this).val()", $(this).val());
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						// console.log("TCL: find(select) $(this).val()", $(this).val());
						$(this).val('');
					}));
					$('.timaat-actordatasets-actor-addresses-address-usedfrom').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
					$('.timaat-actordatasets-actor-addresses-address-useduntil').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				}
				else {
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove address button click
			$(document).on('click','[data-role="dynamic-actorhasaddress-fields"] > .form-group [data-role="remove"]', function(event) {
				event.preventDefault();
					$(this).closest('.form-group').remove();
			});

			// Submit actor addresses button functionality
			$('#timaat-actordatasets-actor-addresses-form-submit').on('click', async function(event) {
				// console.log("TCL: Addresses form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-actorhasaddress-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}
				// test if form is valid 
				if (!$('#timaat-actordatasets-actor-addresses-form').valid()) {
					$('[data-role="new-actorhasaddress-fields"]').append(TIMAAT.ActorDatasets.appendNewAddressField());				
					return false;
				}

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-actor-addresses-form').data("actor");
				var actorType = actor.model.actorType.actorTypeTranslations[0].type;

				// Create/Edit actor window submitted data
				var formData = $('#timaat-actordatasets-actor-addresses-form').serializeArray();
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
						var updatedActorHasAddress = await TIMAAT.ActorDatasets.updateActorHasAddressModel(actor.model.actorHasAddresses[i], formActorHasAddressesList[i]);
						// only update if anything changed
						// if (updatedActorHasAddress != actor.model.actorHasAddresses[i]) { // TODO currently actorHasAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing address");
							await TIMAAT.ActorDatasets.updateActorHasAddress(updatedActorHasAddress, actor);
						// }
						var primaryAddressChanged = false;
						// update primary actorHasAddress
						if (formActorHasAddressesList[i].isPrimaryAddress && (actor.model.primaryAddress == null || actor.model.primaryAddress.id != actor.model.actorHasAddresses[i].id.addressId)) {
							actor.model.primaryAddress = actor.model.actorHasAddresses[i].address;
							primaryAddressChanged = true;
						} else if (!formActorHasAddressesList[i].isPrimaryAddress && actor.model.primaryAddress != null && actor.model.primaryAddress.id == actor.model.actorHasAddresses[i].id.addressId) {
							actor.model.primaryAddress = null;
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
						actorHasAddress = await TIMAAT.ActorDatasets.updateActorHasAddressModel(actor.model.actorHasAddresses[i], formActorHasAddressesList[i]);
						// only update if anything changed
						// if (actorHasAddress != actor.model.actorHasAddresses[i]) { // TODO currently actorHasAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasAddresses (and add new ones)");
							await TIMAAT.ActorDatasets.updateActorHasAddress(actorHasAddress, actor);
						// }
					}
					i = actor.model.actorHasAddresses.length;
					var newActorHasAddresses = [];
					for (; i < formActorHasAddressesList.length; i++) { // create new actorHasAddresses
						var actorHasAddress = await TIMAAT.ActorDatasets.createActorHasAddressModel(formActorHasAddressesList[i], actor.model.id, 0);
						newActorHasAddresses.push(actorHasAddress);
					}
					console.log("TCL: (update existing addresses and) add new ones");
					await TIMAAT.ActorDatasets.addActorHasAddresses(actor, newActorHasAddresses);
					// for the whole list check new primary actorHasAddress
					i = 0;
					for (; i < formActorHasAddressesList.length; i++) {
						// update primary address
						var primaryAddressChanged = false;
						if (formActorHasAddressesList[i].isPrimaryAddress && (actor.model.primaryAddress == null || actor.model.primaryAddress.id != actor.model.actorHasAddresses[i].id.addressId)) {
							actor.model.primaryAddress = actor.model.actorHasAddresses[i].address;
							primaryAddressChanged = true;
						} else if (!formActorHasAddressesList[i].isPrimaryAddress && actor.model.primaryAddress != null && actor.model.primaryAddress.id == actor.model.actorHasAddresses[i].id.addressId) {
							actor.model.primaryAddress = null;
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
						var actorHasAddress = await TIMAAT.ActorDatasets.updateActorHasAddressModel(actor.model.actorHasAddresses[i], formActorHasAddressesList[i]);
						// if (actorHasAddress != actor.model.actorHasAddresses[i]) { // TODO currently actorHasAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasAddresses (and delete obsolete ones)");
							await TIMAAT.ActorDatasets.updateActorHasAddress(actorHasAddress, actor);
						// }
						// update primary address
						var primaryAddressChanged = false;
						if (formActorHasAddressesList[i].isPrimaryAddress && (actor.model.primaryAddress == null || actor.model.primaryAddress.id != actor.model.actorHasAddresses[i].id.addressId)) {
							actor.model.primaryAddress = actor.model.actorHasAddresses[i].address;
							primaryAddressChanged = true;
						} else if (!formActorHasAddressesList[i].isPrimaryAddress && actor.model.primaryAddress != null && actor.model.primaryAddress.id == actor.model.actorHasAddresses[i].id.addressId) {
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
			$('#timaat-actordatasets-actor-addresses-form-dismiss').on('click', function(event) {
				TIMAAT.ActorDatasets.actorFormAddresses('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// Key press events
			$('#timaat-actordatasets-actor-addresses-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-addresses-form-submit').trigger('click');
				}
			});

			$('#timaat-actordatasets-actor-addresses-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-addresses-form-dismiss').trigger('click');
				}
			});

			$('#dynamic-actorhasaddress-fields').keypress(function(event) {
				// event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault(); // prevent activating delete button when pressing enter in a field of the row
				}
			});

			$('#new-actorhasaddress-fields').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault();
					$('#new-actorhasaddress-fields').find('[data-role="add"]').trigger('click');
				}
			});

		},

		initAddressTypes: function() {
			// console.log("TCL: ActorDatasets: initAddressTypes: function()");		
			// delete addressType functionality
			$('#timaat-addresstype-delete-submit').on('click', function(ev) {
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
				$('#timaat-actordatasets-addresstype-meta-name').val(type).trigger('input');
			});

			// Submit addressType data
			$('#timaat-actordatasets-addresstype-meta-submit').on('click', function(ev) {
				// Create/Edit addressType window submitted data validation
				var modal = $('#timaat-actordatasets-addresstype-meta');
				var addressType = modal.data('addressType');
				var type = $('#timaat-actordatasets-addresstype-meta-name').val();

				if (addressType) {
					addressType.model.actor.addressTypeTranslations[0].type = type;
					// addressType.updateUI();
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
				if ( $('#timaat-actordatasets-addresstype-meta-name').val().length > 0 ) {
					$('#timaat-actordatasets-addresstype-meta-submit').prop('disabled', false);
					$('#timaat-actordatasets-addresstype-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-actordatasets-addresstype-meta-submit').prop('disabled', true);
					$('#timaat-actordatasets-addresstype-meta-submit').attr('disabled');
				}
			});
		},

		initEmailAddresses: function() {
			$('#actors-tab-actor-emailaddresses-form').on('click',function(event) {
				$('.nav-tabs a[href="#actorEmailAddresses"]').tab('show');
				TIMAAT.ActorDatasets.subNavTab = 'actorEmailAddresses';
				TIMAAT.ActorDatasets.lastForm = 'emailAddresses';
				$('.form').hide();
				TIMAAT.ActorDatasets.setActorHasEmailAddressList($('#timaat-actordatasets-metadata-form').data('actor'))
				TIMAAT.ActorDatasets.actorFormEmailAddresses('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});
			
			// edit email addresses form button handler
			$('#timaat-actordatasets-actor-emailaddresses-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormEmailAddresses('edit', $('#timaat-actordatasets-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// Add email address button click
			$(document).on('click','[data-role="new-actorhasemailaddress-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				console.log("TCL: add email address to list");
				var listEntry = $(this).closest('[data-role="new-actorhasemailaddress-fields"]');
				var newEmailAddress = [];
				var emailAddressTypeId = 1;
				if (listEntry.find('select').each(function(){
					emailAddressTypeId = $(this).val();
				}));
				if (listEntry.find('input').each(function(){           
					newEmailAddress.push($(this).val());
				}));
				if (!$('#timaat-actordatasets-actor-emailaddresses-form').valid()) 
					return false;
				console.log("TCL: newEmailAddress", newEmailAddress);
				if (newEmailAddress != '') { // TODO is '' proper check?
					var emailAddressesinForm = $('#timaat-actordatasets-actor-emailaddresses-form').serializeArray();
					console.log("TCL: emailAddressesinForm", emailAddressesinForm);
					var i;
					var numberOfEmailAddressElements = 2;
					if (emailAddressesinForm.length > numberOfEmailAddressElements) {
						var indexName = emailAddressesinForm[emailAddressesinForm.length-numberOfEmailAddressElements-1].name; // find last used indexed name (first prior to new address fields)
						var indexString = indexName.substring(indexName.lastIndexOf("[") + 1, indexName.lastIndexOf("]"));
						i = Number(indexString)+1;
					}
					else {
						i = 0;
					}
					// console.log("TCL: i", i);
					$('#dynamic-actorhasemailaddress-fields').append(
						`<div class="form-group" data-role="emailaddress-entry">
							<div class="form-row">
									<div class="col-md-2 text-center">
										<div class="form-check">
											<input class="form-check-input isPrimaryEmailAddress" type="radio" name="isPrimaryEmailAddress" data-role="primaryEmailAddress" placeholder="Is primary email address">
											<label class="sr-only" for="isPrimaryEmailAddress"></label>
										</div>
									</div>
									<div class="col-md-3">
									<label class="sr-only">Email address type*</label>
									<select class="form-control form-control-sm timaat-actordatasets-actor-emailaddresses-emailaddresstype-id" name="newEmailAddressTypeId[`+i+`]" data-role="newEmailAddressTypeId[`+i+`]" required>
										<option value="" disabled selected hidden>[Choose email type...]</option>
										<option value="1"> </option>
										<option value="2">home</option>
										<option value="3">work</option>
										<option value="4">other</option>
										<option value="5">mobile</option>
										<option value="6">custom</option>
									</select>
								</div>
									<div class="col-md-6">
										<label class="sr-only">Email address</label>
										<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-emailaddresses-emailaddress" name="newEmailAddress[`+i+`]" data-role="newEmailAddress[`+i+`]" value="`+newEmailAddress[0]+`" placeholder="[Enter email address]" aria-describedby="Email address" required>
									</div>
								<div class="col-md-1 text-center">
									<button class="btn btn-danger" data-role="remove">
										<i class="fas fa-trash-alt"></i>
									</button>
								</div>
							</div>
						</div>`
					);
					$('[data-role="newEmailAddressTypeId['+i+']"]')
						.find('option[value='+emailAddressTypeId+']')
						.attr('selected', true);
					$('input[name="newEmailAddress['+i+']"]').rules("add", { required: true, email: true});
					if (listEntry.find('input').each(function(){
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						$(this).val('');
					}));
				}
				else {
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove email address button click
			$(document).on('click','[data-role="dynamic-actorhasemailaddress-fields"] > .form-group [data-role="remove"]', function(event) {
				event.preventDefault();
					$(this).closest('.form-group').remove();
			});

			// Submit actor email addresses button functionality
			$('#timaat-actordatasets-actor-emailaddresses-form-submit').on('click', async function(event) {
				// console.log("TCL: Email addresses form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-actorhasemailaddress-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}
				// test if form is valid 
				if (!$('#timaat-actordatasets-actor-emailaddresses-form').valid()) {
					$('[data-role="new-actorhasemailaddress-fields"]').append(TIMAAT.ActorDatasets.appendNewEmailAddressField());				
					return false;
				}

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-actor-emailaddresses-form').data("actor");
				var actorType = actor.model.actorType.actorTypeTranslations[0].type;

				// Create/Edit actor window submitted data
				var formData = $('#timaat-actordatasets-actor-emailaddresses-form').serializeArray();
				var formActorHasEmailAddressesList = [];
				var i = 0;
				while ( i < formData.length) { // fill formActorHasEmailAddressesList with data
					var element = {
						isPrimaryEmailAddress: false,
						emailAddressTypeId: 0,
						email: '',
					};
						console.log("TCL: formData", formData);
						if (formData[i].name == 'isPrimaryEmailAddress' && formData[i].value == 'on' ) {
							element.isPrimaryEmailAddress = true;
							element.emailAddressTypeId = formData[i+1].value;
							element.email = formData[i+2].value;
							i = i+3;
						} else {
							element.isPrimaryEmailAddress = false;
							element.emailAddressTypeId = formData[i].value;
							element.email = formData[i+1].value;
							i = i+2;
						}
					formActorHasEmailAddressesList[formActorHasEmailAddressesList.length] = element;
				}
				// console.log("TCL: formActorHasEmailAddressesList", formActorHasEmailAddressesList);

				// only updates to existing actorHasEmailAddress entries
				if (formActorHasEmailAddressesList.length == actor.model.actorHasEmailAddresses.length) {
					var i = 0;
					for (; i < actor.model.actorHasEmailAddresses.length; i++ ) { // update existing actorHasEmailAddresses
						var updatedActorHasEmailAddress = await TIMAAT.ActorDatasets.updateActorHasEmailAddressModel(actor.model.actorHasEmailAddresses[i], formActorHasEmailAddressesList[i]);
						// only update if anything changed
						// if (updatedActorHasEmailAddress != actor.model.actorHasEmailAddresses[i]) { // TODO currently actorHasEmailAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing email address");
							await TIMAAT.ActorDatasets.updateActorHasEmailAddress(updatedActorHasEmailAddress, actor);
						// }
						var primaryEmailAddressChanged = false;
						// update primary actorHasEmailAddress
						if (formActorHasEmailAddressesList[i].isPrimaryEmailAddress && (actor.model.primaryEmailAddress == null || actor.model.primaryEmailAddress.id != actor.model.actorHasEmailAddresses[i].id.emailAddressId)) {
							actor.model.primaryEmailAddress = actor.model.actorHasEmailAddresses[i].emailAddress;
							primaryEmailAddressChanged = true;
						} else if (!formActorHasEmailAddressesList[i].isPrimaryEmailAddress && actor.model.primaryEmailAddress != null && actor.model.primaryEmailAddress.id == actor.model.actorHasEmailAddresses[i].id.emailAddressId) {
							actor.model.primaryEmailAddress = null;
							primaryEmailAddressChanged = true;
						}
						if (primaryEmailAddressChanged) {
							console.log("TCL actorType, actor", actorType, actor);
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
				}
				// update existing actorHasEmailAddresses and add new ones
				else if (formActorHasEmailAddressesList.length > actor.model.actorHasEmailAddresses.length) {
					var i = 0;
					for (; i < actor.model.actorHasEmailAddresses.length; i++ ) { // update existing actorHasEmailAddresses
						console.log("TCL: actor", actor);
						var actorHasEmailAddress = {}; 
						actorHasEmailAddress = await TIMAAT.ActorDatasets.updateActorHasEmailAddressModel(actor.model.actorHasEmailAddresses[i], formActorHasEmailAddressesList[i]);
						// only update if anything changed
						// if (actorHasEmailAddress != actor.model.actorHasEmailAddresses[i]) { // TODO currently actorHasEmailAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasEmailAddresses (and add new ones)");
							await TIMAAT.ActorDatasets.updateActorHasEmailAddress(actorHasEmailAddress, actor);
						// }
					}
					i = actor.model.actorHasEmailAddresses.length;
					var newActorHasEmailAddresses = [];
					for (; i < formActorHasEmailAddressesList.length; i++) { // create new actorHasEmailAddresses
						var actorHasEmailAddress = await TIMAAT.ActorDatasets.createActorHasEmailAddressModel(formActorHasEmailAddressesList[i], actor.model.id, 0);
						newActorHasEmailAddresses.push(actorHasEmailAddress);
					}
					console.log("TCL: (update existing actorHasEmailAddresses and) add new ones");
					await TIMAAT.ActorDatasets.addActorHasEmailAddresses(actor, newActorHasEmailAddresses);
					// for the whole list check new primary actorHasEmailAddress
					i = 0;
					for (; i < formActorHasEmailAddressesList.length; i++) {
						// update primary email address
						var primaryEmailAddressChanged = false;
						if (formActorHasEmailAddressesList[i].isPrimaryEmailAddress && (actor.model.primaryEmailAddress == null || actor.model.primaryEmailAddress.id != actor.model.actorHasEmailAddresses[i].id.emailAddressId)) {
							actor.model.primaryEmailAddress = actor.model.actorHasEmailAddresses[i].emailAddress;
							primaryEmailAddressChanged = true;
						} else if (!formActorHasEmailAddressesList[i].isPrimaryEmailAddress && actor.model.primaryEmailAddress != null && actor.model.primaryEmailAddress.id == actor.model.actorHasEmailAddresses[i].id.emailAddressId) {
							actor.model.primaryEmailAddress = null;
							primaryEmailAddressChanged = true;
						}
						if (primaryEmailAddressChanged) {
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
							break; // only one primary actorHasEmailAddress needs to be found
						}
					}
				}
				// update existing actorHasEmailAddresses and delete obsolete ones
				else if (formActorHasEmailAddressesList.length < actor.model.actorHasEmailAddresses.length) {
					var i = 0;
					for (; i < formActorHasEmailAddressesList.length; i++ ) { // update existing actorHasEmailAddresses
						var actorHasEmailAddress = await TIMAAT.ActorDatasets.updateActorHasEmailAddressModel(actor.model.actorHasEmailAddresses[i], formActorHasEmailAddressesList[i]);
						// if (actorHasEmailAddress != actor.model.actorHasEmailAddresses[i]) { // TODO currently actorHasEmailAddresses[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasEmailAddresses (and delete obsolete ones)");
							await TIMAAT.ActorDatasets.updateActorHasEmailAddress(actorHasEmailAddress, actor);
						// }
						// update primary address
						var primaryEmailAddressChanged = false;
						if (formActorHasEmailAddressesList[i].isPrimaryEmailAddress && (actor.model.primaryEmailAddress == null || actor.model.primaryEmailAddress.id != actor.model.actorHasEmailAddresses[i].id.emailAddressId)) {
							actor.model.primaryEmailAddress = actor.model.actorHasEmailAddresses[i].emailAddress;
							primaryEmailAddressChanged = true;
						} else if (!formActorHasEmailAddressesList[i].isPrimaryEmailAddress && actor.model.primaryEmailAddress != null && actor.model.primaryEmailAddress.id == actor.model.actorHasEmailAddresses[i].id.emailAddressId) {
							actor.model.primaryEmailAddress = null;
							primaryEmailAddressChanged = true;
						}
						if (primaryEmailAddressChanged) {
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
					var i = actor.model.actorHasEmailAddresses.length - 1;
					for (; i >= formActorHasEmailAddressesList.length; i-- ) { // remove obsolete addresses starting at end of list
						if (actor.model.primaryEmailAddress != null && actor.model.primaryEmailAddress.id == actor.model.actorHasEmailAddresses[i].emailAddress.id) {
							actor.model.primaryEmailAddress = null;
							console.log("TCL: remove primaryActorHasEmailAddress before deleting email address");		
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
						console.log("TCL: (update existing actorHasEmailAddresses and) delete obsolete ones");		
						TIMAAT.ActorService.removeEmailAddress(actor.model.actorHasEmailAddresses[i].emailAddress);
						actor.model.actorHasEmailAddresses.pop();
					}
				}
				console.log("TCL: show actor email address form");
				TIMAAT.ActorDatasets.actorFormEmailAddresses('show', actor);
			});

			// Cancel add/edit button in email addresses form functionality
			$('#timaat-actordatasets-actor-emailaddresses-form-dismiss').on('click', function(event) {
				TIMAAT.ActorDatasets.actorFormEmailAddresses('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// Key press events
			$('#timaat-actordatasets-actor-emailaddresses-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-emailaddresses-form-submit').trigger('click');
				}
			});

			$('#timaat-actordatasets-actor-emailaddresses-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-emailaddresses-form-dismiss').trigger('click');
				}
			});

			$('#dynamic-actorhasemailaddress-fields').keypress(function(event) {
				// event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault(); // prevent activating delete button when pressing enter in a field of the row
				}
			});

			$('#new-actorhasemailaddress-fields').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault();
					$('#new-actorhasemailaddress-fields').find('[data-role="add"]').trigger('click');
				}
			});
		},

		initEmailAddressTypes: function() {
			// console.log("TCL: ActorDatasets: initEmailAddressTypes: function()");		
			// delete emailAddressType functionality
			$('#timaat-emailaddresstype-delete-submit').on('click', function(ev) {
				var modal = $('#timaat-actordatasets-emailaddresstype-delete');
				var emailAddressType = modal.data('emailAddressType');
				if (emailAddressType) TIMAAT.ActorDatasets._emailAddressTypeRemoved(emailAddressType);
				modal.modal('hide');
			});
			// add emailAddressType button
			$('#timaat-emailaddresstype-add').attr('onclick','TIMAAT.ActorDatasets.addEmailAddressType()');

			// add/edit emailAddressType functionality
			$('#timaat-actordatasets-emailaddresstype-meta').on('show.bs.modal', function (ev) {
				// Create/Edit emailAddressType window setup
				var modal = $(this);
				var emailAddressType = modal.data('emailAddressType');				
				var heading = (emailAddressType) ? "EmailAddressType bearbeiten" : "EmailAddressType hinzufügen";
				var submit = (emailAddressType) ? "Speichern" : "Hinzufügen";
				var type = (emailAddressType) ? emailAddressType.model.type : 0;
				// setup UI
				$('#emailAddressTypeMetaLabel').html(heading);
				$('#timaat-actordatasets-emailaddresstype-meta-submit').html(submit);
				$('#timaat-actordatasets-emailaddresstype-meta-name').val(type).trigger('input');
			});

			// Submit emailAddressType data
			$('#timaat-actordatasets-emailaddresstype-meta-submit').on('click', function(ev) {
				// Create/Edit emailAddressType window submitted data validation
				var modal = $('#timaat-actordatasets-emailaddresstype-meta');
				var emailAddressType = modal.data('emailAddressType');
				var type = $('#timaat-actordatasets-emailaddresstype-meta-name').val();

				if (emailAddressType) {
					emailAddressType.model.actor.emailAddressTypeTranslations[0].type = type;
					// emailAddressType.updateUI();
					TIMAAT.ActorService.updateEmailAddressType(emailAddressType);
					TIMAAT.ActorService.updateEmailAddressTypeTranslation(emailAddressType);
				} else { // create new emailAddressType
					var model = {
						id: 0,
						emailAddressTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					}
					TIMAAT.ActorService.createEmailAddressType(model, modelTranslation, TIMAAT.ActorDatasets._emailAddressTypeAdded); // TODO add emailAddressType parameters
				}
				modal.modal('hide');
			});

			// validate emailAddressType data	
			// TODO validate all required fields				
			$('#timaat-actordatasets-emailaddresstype-meta-name').on('input', function(ev) {
				if ( $('#timaat-actordatasets-emailaddresstype-meta-name').val().length > 0 ) {
					$('#timaat-actordatasets-emailaddresstype-meta-submit').prop('disabled', false);
					$('#timaat-actordatasets-emailaddresstype-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-actordatasets-emailaddresstype-meta-submit').prop('disabled', true);
					$('#timaat-actordatasets-emailaddresstype-meta-submit').attr('disabled');
				}
			});
		},

		initPhoneNumbers: function() {
			$('#actors-tab-actor-phonenumbers-form').on('click', function(event) {
				$('.nav-tabs a[href="#actorPhoneNumbers"]').tab('show');
				TIMAAT.ActorDatasets.subNavTab = 'actorPhoneNumbers';
				TIMAAT.ActorDatasets.lastForm = 'phoneNumbers';
				$('.form').hide();
				TIMAAT.ActorDatasets.setActorHasPhoneNumberList($('#timaat-actordatasets-metadata-form').data('actor'))
				TIMAAT.ActorDatasets.actorFormPhoneNumbers('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});
			
			// edit phonenumbers form button handler
			$('#timaat-actordatasets-actor-phonenumbers-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormPhoneNumbers('edit', $('#timaat-actordatasets-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// Add phone number button click
			$(document).on('click','[data-role="new-actorhasphonenumber-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				console.log("TCL: add phone number to list");
				var listEntry = $(this).closest('[data-role="new-actorhasphonenumber-fields"]');
				var newPhoneNumber = [];
				var phoneNumberTypeId = 1;
				if (listEntry.find('select').each(function(){
					phoneNumberTypeId = $(this).val();
				}));
				if (listEntry.find('input').each(function(){           
					newPhoneNumber.push($(this).val());
				}));
				if (!$('#timaat-actordatasets-actor-phonenumbers-form').valid()) 
					return false;
				console.log("TCL: newPhoneNumber", newPhoneNumber);
				if (newPhoneNumber != '') { // TODO is '' proper check?
					var phoneNumbersinForm = $('#timaat-actordatasets-actor-phonenumbers-form').serializeArray();
					console.log("TCL: phoneNumbersinForm", phoneNumbersinForm);
					var i;
					var numberOfPhoneNumberElements = 2;
					if (phoneNumbersinForm.length > numberOfPhoneNumberElements) {
						var indexName = phoneNumbersinForm[phoneNumbersinForm.length-numberOfPhoneNumberElements-1].name; // find last used indexed name (first prior to new phone number fields)
						var indexString = indexName.substring(indexName.lastIndexOf("[") + 1, indexName.lastIndexOf("]"));
						i = Number(indexString)+1;
					}
					else {
						i = 0;
					}
					// console.log("TCL: i", i);
					$('#dynamic-actorhasphonenumber-fields').append(
						`<div class="form-group" data-role="phonenumber-entry">
							<div class="form-row">
									<div class="col-md-2 text-center">
										<div class="form-check">
											<input class="form-check-input isPrimaryPhoneNumber" type="radio" name="isPrimaryPhoneNumber" data-role="primaryPhoneNumber" placeholder="Is primary phone number">
											<label class="sr-only" for="isPrimaryPhoneNumber"></label>
										</div>
									</div>
									<div class="col-md-3">
									<label class="sr-only">Phone number type*</label>
									<select class="form-control form-control-sm timaat-actordatasets-actor-phonenumbers-phonenumbertype-id" name="newPhoneNumberTypeId[`+i+`]" data-role="newPhoneNumberTypeId[`+i+`]" required>
										<option value="" disabled selected hidden>[Choose phone number type...]</option>
										<option value="1"> </option>
										<option value="2">mobile</option>
										<option value="3">home</option>
										<option value="4">work</option>
										<option value="5">pager</option>
										<option value="6">other</option>
										<option value="7">custom</option>
									</select>
								</div>
								<div class="col-md-6">
									<label class="sr-only">Phone number</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-phonenumbers-phonenumber" name="newPhoneNumber[`+i+`]" data-role="newPhoneNumber[`+i+`]" value="`+newPhoneNumber[0]+`" maxlength="30" placeholder="[Enter phone number] "aria-describedby="Phone number" required>
								</div>
								<div class="col-md-1 text-center">
									<button class="btn btn-danger" data-role="remove">
										<i class="fas fa-trash-alt"></i>
									</button>
								</div>
							</div>
						</div>`
					);
					($('[data-role="newPhoneNumberTypeId['+i+']"]'))
						.find('option[value='+phoneNumberTypeId+']')
						.attr('selected', true);
					$('input[name="newPhoneNumber['+i+']"]').rules("add", { required: true, maxlength: 30 });
					if (listEntry.find('input').each(function(){
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						$(this).val('');
					}));
				}
				else {
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove phone number button click
			$(document).on('click','[data-role="dynamic-actorhasphonenumber-fields"] > .form-group [data-role="remove"]', function(event) {
				event.preventDefault();
					$(this).closest('.form-group').remove();
			});

			// Submit actor phonenumbers button functionality
			$('#timaat-actordatasets-actor-phonenumbers-form-submit').on('click', async function(event) {
				// console.log("TCL: Phone numberes form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-actorhasphonenumber-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}
				// test if form is valid 
				if (!$('#timaat-actordatasets-actor-phonenumbers-form').valid()) {
					$('[data-role="new-actorhasphonenumber-fields"]').append(TIMAAT.ActorDatasets.appendNewPhoneNumberField());				
					return false;
				}

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-actor-phonenumbers-form').data("actor");
				var actorType = actor.model.actorType.actorTypeTranslations[0].type;

				// Create/Edit actor window submitted data
				var formData = $('#timaat-actordatasets-actor-phonenumbers-form').serializeArray();
				var formActorHasPhoneNumbersList = [];
				var i = 0;
				while ( i < formData.length) { // fill formActorHasPhoneNumbersList with data
					var element = {
						isPrimaryPhoneNumber: false,
						phoneNumberTypeId: 0,
						phoneNumber: '',
					};
						console.log("TCL: formData", formData);
						if (formData[i].name == 'isPrimaryPhoneNumber' && formData[i].value == 'on' ) {
							element.isPrimaryPhoneNumber = true;
							element.phoneNumberTypeId = formData[i+1].value;
							element.phoneNumber = formData[i+2].value;
							i = i+3;
						} else {
							element.isPrimaryPhoneNumber = false;
							element.phoneNumberTypeId = formData[i].value;
							element.phoneNumber = formData[i+1].value;
							i = i+2;
						}
					formActorHasPhoneNumbersList[formActorHasPhoneNumbersList.length] = element;
				}
				// console.log("TCL: formActorHasPhoneNumbersList", formActorHasPhoneNumbersList);

				// only updates to existing actorHasPhoneNumber entries
				if (formActorHasPhoneNumbersList.length == actor.model.actorHasPhoneNumbers.length) {
					var i = 0;
					for (; i < actor.model.actorHasPhoneNumbers.length; i++ ) { // update existing actorHasPhoneNumbers
						var updatedActorHasPhoneNumber = await TIMAAT.ActorDatasets.updateActorHasPhoneNumberModel(actor.model.actorHasPhoneNumbers[i], formActorHasPhoneNumbersList[i]);
						// only update if anything changed
						// if (updatedActorHasPhoneNumber != actor.model.actorHasPhoneNumbers[i]) { // TODO currently actorHasPhoneNumbers[i] values change too early causing this check to always fail
							console.log("TCL: update existing phone number");
							await TIMAAT.ActorDatasets.updateActorHasPhoneNumber(updatedActorHasPhoneNumber, actor);
						// }
						var primaryPhoneNumberChanged = false;
						// update primary actorHasPhoneNumber
						if (formActorHasPhoneNumbersList[i].isPrimaryPhoneNumber && (actor.model.primaryPhoneNumber == null || actor.model.primaryPhoneNumber.id != actor.model.actorHasPhoneNumbers[i].id.phoneNumberId)) {
							actor.model.primaryPhoneNumber = actor.model.actorHasPhoneNumbers[i].phoneNumber;
							primaryPhoneNumberChanged = true;
						} else if (!formActorHasPhoneNumbersList[i].isPrimaryPhoneNumber && actor.model.primaryPhoneNumber != null && actor.model.primaryPhoneNumber.id == actor.model.actorHasPhoneNumbers[i].id.phoneNumberId) {
							actor.model.primaryPhoneNumber = null;
							primaryPhoneNumberChanged = true;
						}
						if (primaryPhoneNumberChanged) {
							console.log("TCL actorType, actor", actorType, actor);
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
				}
				// update existing actorHasPhoneNumbers and add new ones
				else if (formActorHasPhoneNumbersList.length > actor.model.actorHasPhoneNumbers.length) {
					var i = 0;
					for (; i < actor.model.actorHasPhoneNumbers.length; i++ ) { // update existing actorHasPhoneNumbers
						console.log("TCL: actor", actor);
						var actorHasPhoneNumber = {}; 
						actorHasPhoneNumber = await TIMAAT.ActorDatasets.updateActorHasPhoneNumberModel(actor.model.actorHasPhoneNumbers[i], formActorHasPhoneNumbersList[i]);
						// only update if anything changed
						// if (actorHasPhoneNumber != actor.model.actorHasPhoneNumbers[i]) { // TODO currently actorHasPhoneNumbers[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasPhoneNumbers (and add new ones)");
							await TIMAAT.ActorDatasets.updateActorHasPhoneNumber(actorHasPhoneNumber, actor);
						// }
					}
					i = actor.model.actorHasPhoneNumbers.length;
					var newActorHasPhoneNumbers = [];
					for (; i < formActorHasPhoneNumbersList.length; i++) { // create new actorHasPhoneNumbers
						var actorHasPhoneNumber = await TIMAAT.ActorDatasets.createActorHasPhoneNumberModel(formActorHasPhoneNumbersList[i], actor.model.id, 0);
						newActorHasPhoneNumbers.push(actorHasPhoneNumber);
					}
					console.log("TCL: (update existing actorHasPhoneNumbers and) add new ones");
					await TIMAAT.ActorDatasets.addActorHasPhoneNumbers(actor, newActorHasPhoneNumbers);
					// for the whole list check new primary actorHasPhoneNumber
					i = 0;
					for (; i < formActorHasPhoneNumbersList.length; i++) {
						// update primary phone number
						var primaryPhoneNumberChanged = false;
						if (formActorHasPhoneNumbersList[i].isPrimaryPhoneNumber && (actor.model.primaryPhoneNumber == null || actor.model.primaryPhoneNumber.id != actor.model.actorHasPhoneNumbers[i].id.phoneNumberId)) {
							actor.model.primaryPhoneNumber = actor.model.actorHasPhoneNumbers[i].phoneNumber;
							primaryPhoneNumberChanged = true;
						} else if (!formActorHasPhoneNumbersList[i].isPrimaryPhoneNumber && actor.model.primaryPhoneNumber != null && actor.model.primaryPhoneNumber.id == actor.model.actorHasPhoneNumbers[i].id.phoneNumberId) {
							actor.model.primaryPhoneNumber = null;
							primaryPhoneNumberChanged = true;
						}
						if (primaryPhoneNumberChanged) {
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
							break; // only one primary actorHasPhoneNumber needs to be found
						}
					}
				}
				// update existing actorHasPhoneNumbers and delete obsolete ones
				else if (formActorHasPhoneNumbersList.length < actor.model.actorHasPhoneNumbers.length) {
					var i = 0;
					for (; i < formActorHasPhoneNumbersList.length; i++ ) { // update existing actorHasPhoneNumbers
						var actorHasPhoneNumber = await TIMAAT.ActorDatasets.updateActorHasPhoneNumberModel(actor.model.actorHasPhoneNumbers[i], formActorHasPhoneNumbersList[i]);
						// if (actorHasPhoneNumber != actor.model.actorHasPhoneNumbers[i]) { // TODO currently actorHasPhoneNumbers[i] values change too early causing this check to always fail
							console.log("TCL: update existing actorHasPhoneNumbers (and delete obsolete ones)");
							await TIMAAT.ActorDatasets.updateActorHasPhoneNumber(actorHasPhoneNumber, actor);
						// }
						// update primary phone number
						var primaryPhoneNumberChanged = false;
						if (formActorHasPhoneNumbersList[i].isPrimaryPhoneNumber && (actor.model.primaryPhoneNumber == null || actor.model.primaryPhoneNumber.id != actor.model.actorHasPhoneNumbers[i].id.phoneNumberId)) {
							actor.model.primaryPhoneNumber = actor.model.actorHasPhoneNumbers[i].phoneNumber;
							primaryPhoneNumberChanged = true;
						} else if (!formActorHasPhoneNumbersList[i].isPrimaryPhoneNumber && actor.model.primaryPhoneNumber != null && actor.model.primaryPhoneNumber.id == actor.model.actorHasPhoneNumbers[i].id.phoneNumberId) {
							actor.model.primaryPhoneNumber = null;
							primaryPhoneNumberChanged = true;
						}
						if (primaryPhoneNumberChanged) {
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
					}
					var i = actor.model.actorHasPhoneNumbers.length - 1;
					for (; i >= formActorHasPhoneNumbersList.length; i-- ) { // remove obsolete phone numbers starting at end of list
						if (actor.model.primaryPhoneNumber != null && actor.model.primaryPhoneNumber.id == actor.model.actorHasPhoneNumbers[i].phoneNumber.id) {
							actor.model.primaryPhoneNumber = null;
							console.log("TCL: remove primaryActorHasPhoneNumber before deleting phone number");		
							await TIMAAT.ActorDatasets.updateActor(actorType, actor);
						}
						console.log("TCL: (update existing actorHasPhoneNumbers and) delete obsolete ones");		
						TIMAAT.ActorService.removePhoneNumber(actor.model.actorHasPhoneNumbers[i].phoneNumber);
						actor.model.actorHasPhoneNumbers.pop();
					}
				}
				console.log("TCL: show actor phone number form");
				TIMAAT.ActorDatasets.actorFormPhoneNumbers('show', actor);
			});

			// Cancel add/edit button in phone numbers form functionality
			$('#timaat-actordatasets-actor-phonenumbers-form-dismiss').on('click', function(event) {
				TIMAAT.ActorDatasets.actorFormPhoneNumbers('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// Key press events
			$('#timaat-actordatasets-actor-phonenumbers-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-phonenumbers-form-submit').trigger('click');
				}
			});

			$('#timaat-actordatasets-actor-phonenumbers-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-actordatasets-actor-phonenumbers-form-dismiss').trigger('click');
				}
			});

			$('#dynamic-actorhasphonenumber-fields').keypress(function(event) {
				// event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault(); // prevent activating delete button when pressing enter in a field of the row
				}
			});

			$('#new-actorhasphonenumber-fields').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault();
					$('#new-actorhasphonenumber-fields').find('[data-role="add"]').trigger('click');
				}
			});
		},

		initPhoneNumberTypes: function() {
			// console.log("TCL: ActorDatasets: initPhoneNumberTypes: function()");		
			// delete phoneNumberType functionality
			$('#timaat-phonenumbertype-delete-submit').on('click', function(ev) {
				var modal = $('#timaat-actordatasets-phonenumbertype-delete');
				var phoneNumberType = modal.data('phoneNumberType');
				if (phoneNumberType) TIMAAT.ActorDatasets._phoneNumberTypeRemoved(phoneNumberType);
				modal.modal('hide');
			});
			// add phoneNumberType button
			$('#timaat-phonenumbertype-add').attr('onclick','TIMAAT.ActorDatasets.addPhoneNumberType()');

			// add/edit phoneNumberType functionality
			$('#timaat-actordatasets-phonenumbertype-meta').on('show.bs.modal', function (ev) {
				// Create/Edit phoneNumberType window setup
				var modal = $(this);
				var phoneNumberType = modal.data('phoneNumberType');				
				var heading = (phoneNumberType) ? "PhoneNumberType bearbeiten" : "PhoneNumberType hinzufügen";
				var submit = (phoneNumberType) ? "Speichern" : "Hinzufügen";
				var type = (phoneNumberType) ? phoneNumberType.model.type : 0;
				// setup UI
				$('#phoneNumberTypeMetaLabel').html(heading);
				$('#timaat-actordatasets-phonenumbertype-meta-submit').html(submit);
				$('#timaat-actordatasets-phonenumbertype-meta-name').val(type).trigger('input');
			});

			// Submit phoneNumberType data
			$('#timaat-actordatasets-phonenumbertype-meta-submit').on('click', function(ev) {
				// Create/Edit phoneNumberType window submitted data validation
				var modal = $('#timaat-actordatasets-phonenumbertype-meta');
				var phoneNumberType = modal.data('phoneNumberType');
				var type = $('#timaat-actordatasets-phonenumbertype-meta-name').val();

				if (phoneNumberType) {
					phoneNumberType.model.actor.phoneNumberTypeTranslations[0].type = type;
					// phoneNumberType.updateUI();
					TIMAAT.ActorService.updatePhoneNumberType(phoneNumberType);
					TIMAAT.ActorService.updatePhoneNumberTypeTranslation(phoneNumberType);
				} else { // create new phoneNumberType
					var model = {
						id: 0,
						phoneNumberTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					}
					TIMAAT.ActorService.createPhoneNumberType(model, modelTranslation, TIMAAT.ActorDatasets._phoneNumberTypeAdded); // TODO add phoneNumberType parameters
				}
				modal.modal('hide');
			});

			// validate phoneNumberType data	
			// TODO validate all required fields				
			$('#timaat-actordatasets-phonenumbertype-meta-name').on('input', function(ev) {
				if ( $('#timaat-actordatasets-phonenumbertype-meta-name').val().length > 0 ) {
					$('#timaat-actordatasets-phonenumbertype-meta-submit').prop('disabled', false);
					$('#timaat-actordatasets-phonenumbertype-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-actordatasets-phonenumbertype-meta-submit').prop('disabled', true);
					$('#timaat-actordatasets-phonenumbertype-meta-submit').attr('disabled');
				}
			});
		},

		initMemberOfCollectives: function() {
			$('#actors-tab-actor-memberofcollectives-form').on('click', function(event) {
				$('.nav-tabs a[href="#actorMemberOfCollectives"]').tab('show');
				console.log("TCL: TIMAAT.ActorDatasets.lastForm", TIMAAT.ActorDatasets.lastForm);
				TIMAAT.ActorDatasets.subNavTab = 'actorMemberOfCollectives';
				TIMAAT.ActorDatasets.lastForm = 'memberOfCollectives';
				$('.form').hide();
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');
				var type = actor.model.actorType.actorTypeTranslations[0].type;
				TIMAAT.ActorDatasets.setPersonIsMemberOfCollectiveList(type, $('#timaat-actordatasets-metadata-form').data('actor'))
				TIMAAT.ActorDatasets.actorFormMemberOfCollectives('show', type, $('#timaat-actordatasets-metadata-form').data('actor'));
			});
			
			// edit memberofcollectives form button handler
			$('#timaat-actordatasets-actor-memberofcollective-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');
				var type = actor.model.actorType.actorTypeTranslations[0].type;
				TIMAAT.ActorDatasets.actorFormMemberOfCollectives('edit', type, $('#timaat-actordatasets-metadata-form').data('actor'));
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

			// add membership button click
			$(document).on('click','[data-role="new-personismemberofcollective-fields"] > .form-group [data-role="add"]', async function(event) {
				console.log("TCL: MemberOfCollective form: add new membership");
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="new-personismemberofcollective-fields"]');
				var newFormEntry = [];
				var newEntryId = null;
				if (listEntry.find('select').each(function(){           
					newEntryId = Number($(this).val());
				}));
				if (listEntry.find('input').each(function(){           
					newFormEntry.push($(this).val());
				}));
				console.log("TCL: newFormEntry", newFormEntry);

				if (!$('#timaat-actordatasets-actor-memberofcollective-form').valid()) {
					return false;
				}
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');
				var type = actor.model.actorType.actorTypeTranslations[0].type;

				$('.timaat-actordatasets-actor-memberofcollective-actor-id').prop('disabled', false);			
				$('.disable-on-submit').prop('disabled', true);
				var existingEntriesInForm = $('#timaat-actordatasets-actor-memberofcollective-form').serializeArray();
				$('.disable-on-submit').prop('disabled', false);
				console.log("TCL: existingEntriesInForm", existingEntriesInForm);

				// create list of collectiveIds that the person is is already a member of
				var existingEntriesIdList = [];
				var i = 0;
				for (; i < existingEntriesInForm.length; i++) {
					if (existingEntriesInForm[i].name == "actorId") {
						existingEntriesIdList.push(Number(existingEntriesInForm[i].value));
					}
				}
				existingEntriesIdList.pop(); // remove new membership collective/person id
				// console.log("TCL: existingEntriesIdList", existingEntriesIdList);
				// check for duplicate person-collective relation. only one allowed
				var duplicate = false;
				i = 0;
				while (i < existingEntriesIdList.length) {
					if (newEntryId == existingEntriesIdList[i]) {
						duplicate = true;
						console.log("TCL: duplicate entry found");
						break;
					}
					// console.log("TCL: newEntryId", newEntryId);
					console.log("TCL: existingEntriesIdList[i]", existingEntriesIdList[i]);
					i++;
				}

				if (!duplicate) {
					var newEntryDetails = [];
					i = 0;
					var j = 0;
					for (; j < newFormEntry.length -3; i++) { // -3 for empty fields of new entry that is not added yet
						newEntryDetails[i] = {
							actorPersonActorId: (type == 'person') ? actor.model.id : newEntryId,
							memberOfActorCollectiveActorId: (type == 'person') ? newEntryId : actor.model.id,
							id: Number(newFormEntry[j]), // == 0
							joinedAt: newFormEntry[j+1],
							leftAt: newFormEntry[j+2]
						};
            // console.log("TCL: newEntryDetails[i]", newEntryDetails[i]);
						j += 3;
					}
					let actorName = await TIMAAT.ActorService.getActorName(newEntryId);
					var appendNewFormDataEntry = TIMAAT.ActorDatasets.appendMemberOfCollectiveDataset(existingEntriesIdList.length, newEntryId, actorName, newEntryDetails, 'sr-only', true);
					$('#dynamic-personismemberofcollective-fields').append(appendNewFormDataEntry);
					$('.timaat-actordatasets-actor-memberofcollective-actor-id').prop('disabled', true);

					$('[data-role="new-personismemberofcollective-fields"]').find('[data-role="memberofcollective-details-entry"]').remove();
					if (listEntry.find('input').each(function(){
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						$(this).val('');
					}));
					$('.timaat-actordatasets-actor-memberofcollectives-joinedat').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
					$('.timaat-actordatasets-actor-memberofcollectives-leftat').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
					
					// only needed when changes have to be saved immediately
					// await TIMAAT.ActorDatasets.addPersonIsMemberOfCollective(actor.model.id, newMemberOfCollectiveEntry);
					// actor.updateUI();
					// TIMAAT.ActorDatasets.actorFormMemberOfCollectives('edit', type, actor);
				}
				else { // duplicate collective
					$('#timaat-actordatasets-memberofcollective-duplicate').modal('show');
				}
			});

			// add membership detail button click
			// $(document).on('click','[data-role="new-personismemberofcollective-details-fields"] > .form-group [data-role="personismemberofcollective-entry"] > .form-group [data-role="memberofcollective-details-entry"] > .form-group [data-role="addMembershipDetails"]', async function(event) {
			$(document).on('click', '.form-group [data-role="addMembershipDetails"]', async function(event) {
				console.log("TCL: MemberOfCollective form: add details to membership");
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="new-personismemberofcollective-details-fields"]');
				var newMemberOfCollectiveData = [];
				var actorId = $(this).closest(('[data-role="personismemberofcollective-entry"]')).attr("data-actor-id");
				if (listEntry.find('input').each(function(){
					newMemberOfCollectiveData.push($(this).val());
				}));
				console.log("TCL: newMemberOfCollectiveData", newMemberOfCollectiveData);
				if (newMemberOfCollectiveData[1] == "" && newMemberOfCollectiveData[2] == "") { // [0] is hidden id field
					console.log("no data endered");
					return false; // don't add if all add fields were empty
				}
				var newMembershipDetailsEntry = {
					id: 0,
					joinedAt: newMemberOfCollectiveData[1],
					leftAt: newMemberOfCollectiveData[2]
				};
				var dataId = $(this).closest('[data-role="personismemberofcollective-entry"]').attr('data-id');
				var dataDetailsId = $(this).closest('[data-role="new-personismemberofcollective-details-fields"]').attr("data-details-id");
				$(this).closest('[data-role="new-personismemberofcollective-details-fields"]').before(TIMAAT.ActorDatasets.appendMemberOfCollectiveDetailFields(dataId, dataDetailsId, actorId, newMembershipDetailsEntry, 'sr-only'));

				$('[data-role="actorId['+actorId+']"]').find('option[value='+actorId+']').attr('selected', true);
				if (listEntry.find('input').each(function(){
					$(this).val('');
				}));
				if (listEntry.find('select').each(function(){
					$(this).val('');
				}));
				$('.timaat-actordatasets-actor-memberofcollectives-joinedat').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('.timaat-actordatasets-actor-memberofcollectives-leftat').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			});

			// remove member of collective button click
			$(document).on('click','[data-role="dynamic-personismemberofcollective-fields"] > .form-group [data-role="remove"]', async function(event) {
				console.log("TCL: MemberOfCollective form: remove membership");
				event.preventDefault();
				$(this).closest('.form-group').remove();
			});

			// remove membership detail button click
			$(document).on('click','.form-group [data-role="removeMembershipDetails"]', async function(event) {
				console.log("TCL: MemberOfCollective form: remove details");
				event.preventDefault();
				$(this).closest('.form-group').remove();
			});

			// submit actor memberofcollectives button functionality
			$('#timaat-actordatasets-actor-memberofcollective-form-submit').on('click', async function(event) {
				// console.log("TCL: MemberOfCollective form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-personismemberofcollective-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}
				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');
				var type = actor.model.actorType.actorTypeTranslations[0].type;

				// test if form is valid 
				if (!$('#timaat-actordatasets-actor-memberofcollective-form').valid()) {
					$('[data-role="new-personismemberofcollective-fields"]').append(TIMAAT.ActorDatasets.appendNewMemberOfCollectiveField());
					var listType = (type == 'person') ? 'collective' : 'person'; // person needs collective entries and vice versa
					$('#actor-select-dropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/actor/'+listType+'/selectList/',
							type: 'GET',
							dataType: 'json',
							delay: 250,
							headers: {
								"Authorization": "Bearer "+TIMAAT.Service.token,
								"Content-Type": "application/json",
							},
							// additional parameters
							data: function(params) {
								// console.log("TCL: data: params", params);
								return {
									search: params.term,
									page: params.page
								};          
							},
							processResults: function(data, params) {
								// console.log("TCL: processResults: data", data);
								params.page = params.page || 1;
								return {
									results: data
								};
							},
							cache: true
						},
						minimumInputLength: 0,
					});
					return false;
				}

				// create/edit actor window submitted data
				$('.timaat-actordatasets-actor-memberofcollective-actor-id').prop('disabled', false);
				$('.disable-on-submit').prop('disabled', true);
				var formDataRaw = $('#timaat-actordatasets-actor-memberofcollective-form').serializeArray();
				$('.disable-on-submit').prop('disabled', false);
        console.log("TCL: formDataRaw", formDataRaw);
				var formEntries = [];
				var formEntryIds = []; // List of all collectives containing membership data for this actor
				var formEntriesIdIndexes = []; // Index list of all collectiveIds/personIds and number of detail sets
				var i = 0;
				for (; i < formDataRaw.length; i++) {
					if (formDataRaw[i].name == 'actorId') {
						formEntriesIdIndexes.push({entryIndex: i, numDetailSets: 0});
					}
				}
				var numDetailElements = 3; // hidden membershipDetailId, joinedAt, leftAt
				i = 0;
				for (; i < formEntriesIdIndexes.length; i++) {
					if (i < formEntriesIdIndexes.length -1) {
						formEntriesIdIndexes[i].numDetailSets = (formEntriesIdIndexes[i+1].entryIndex - formEntriesIdIndexes[i].entryIndex - 2) / numDetailElements;
					} else { // last entry has to be calculated differently
						formEntriesIdIndexes[i].numDetailSets = (formDataRaw.length - formEntriesIdIndexes[i].entryIndex - 2) / numDetailElements;
					}
				}
				i = 0;
				for (; i < formEntriesIdIndexes.length; i++) {
						var element = {
							actorId: (type == 'person') ? actor.model.id : Number(formDataRaw[formEntriesIdIndexes[i].entryIndex].value),
							collectiveId: (type == 'person') ? Number(formDataRaw[formEntriesIdIndexes[i].entryIndex].value) : actor.model.id,
							membershipDetails: []
						};
						formEntryIds.push(Number(formDataRaw[formEntriesIdIndexes[i].entryIndex].value));
					var j = 0;
					for (; j < formEntriesIdIndexes[i].numDetailSets; j++) {
						var details = {
							id: Number(formDataRaw[formEntriesIdIndexes[i].entryIndex+numDetailElements*j+2].value),
							joinedAt: moment.utc(formDataRaw[formEntriesIdIndexes[i].entryIndex+numDetailElements*j+3].value, "YYYY-MM-DD"),
							leftAt: moment.utc(formDataRaw[formEntriesIdIndexes[i].entryIndex+numDetailElements*j+4].value, "YYYY-MM-DD"),
							role: null
						};
						element.membershipDetails.push(details);
            // console.log("TCL: details", details);
					}
					formEntries.push(element);
				}
				// create collective/person id list for all already existing memberships
				i = 0;
				var existingEntriesIdList = [];
				switch (type) {
					case 'person':
						for (; i < actor.model.actorPerson.actorPersonIsMemberOfActorCollectives.length; i++) {
							existingEntriesIdList.push(actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i].id.memberOfActorCollectiveActorId);
						}
					break;
					case 'collective':
						for (; i < actor.model.actorCollective.actorPersonIsMemberOfActorCollectives.length; i++) {
							existingEntriesIdList.push(actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i].id.actorPersonActorId);
						}
				}
				// DELETE memberOfCollective data if id is in existingEntriesIdList but not in formEntryIds
				i = 0;
				for (; i < existingEntriesIdList.length; i++) {
					// console.log("TCL: check for DELETE COLLECTIVE: ", existingEntriesIdList[i]);
					var j = 0;
					var deleteDataset = true;
					for (; j < formEntryIds.length; j ++) {
						if (existingEntriesIdList[i] == formEntryIds[j]) {
							deleteDataset = false;
							break; // no need to check further if match was found
						}
					}
					if (deleteDataset) {
						switch (type) {
							case 'person':
								await TIMAAT.ActorService.removeMemberOfCollective(actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i]);
								actor.model.actorPerson.actorPersonIsMemberOfActorCollectives.splice(i,1); // TODO should be moved to ActorDatasets.removeMemberOfCollective(..)
							break;
							case 'collective':
								await TIMAAT.ActorService.removeMemberOfCollective(actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i]);
								actor.model.actorCollective.actorPersonIsMemberOfActorCollectives.splice(i,1); // TODO should be moved to ActorDatasets.removeMemberOfCollective(..)
							break
						}
						existingEntriesIdList.splice(i,1);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				// ADD memberOfCollective data if id is not in existingEntriesIdList but in formEntryIds
				i = 0;
				for (; i < formEntryIds.length; i++) {
					var j = 0;
					var datasetExists = false;
					for (; j < existingEntriesIdList.length; j++) {
						if (formEntryIds[i] == existingEntriesIdList[j]) {
							datasetExists = true;
							break; // no need to check further if match was found
						}
					}
					if (!datasetExists) {
						await TIMAAT.ActorDatasets.addPersonIsMemberOfCollective(actor, formEntries[i]);
						formEntryIds.splice(i,1);
						formEntries.splice(i,1);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				//* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
				// UPDATE memberOfCollective data if id is in existingEntriesIdList and in formEntryIds
				i = 0;
				for (; i < existingEntriesIdList.length; i++) {
					// console.log("TCL: check for UPDATE COLLECTIVE: ", existingEntriesIdList[i]);
					// find corresponding actorPersonIsMemberOfActorCollectives id/index
					var currentMemberOfCollectiveIndex = -1;
					var j = 0;
					switch (type) {
						case 'person':
							for (; j < actor.model.actorPerson.actorPersonIsMemberOfActorCollectives.length; j++) {
								if (existingEntriesIdList[i] == actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[j].id.memberOfActorCollectiveActorId) {
									currentMemberOfCollectiveIndex = j;
									break; // no need to check further if index was found
								}
							}
							var currentMemberOfCollective = actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[currentMemberOfCollectiveIndex];
							var currentMemberOfCollectiveId = actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[currentMemberOfCollectiveIndex].id.memberOfActorCollectiveActorId;
						break;
						case 'collective':
							for (; j < actor.model.actorCollective.actorPersonIsMemberOfActorCollectives.length; j++) {
								if (existingEntriesIdList[i] == actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[j].id.actorPersonActorId) {
									currentMemberOfCollectiveIndex = j;
									break; // no need to check further if index was found
								}
							}
							var currentMemberOfCollective = actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[currentMemberOfCollectiveIndex];
							var currentMemberOfCollectiveId = actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[currentMemberOfCollectiveIndex].id.actorPersonActorId;
						break;
					}
					// go through all membershipDetails and update/delete/add entries
					// create membershipDetail id list for all already existing memberships with this collective
					var existingMembershipDetailIdList = [];
					j = 0;
					for (; j < currentMemberOfCollective.membershipDetails.length; j++) {
						existingMembershipDetailIdList.push(currentMemberOfCollective.membershipDetails[j].id);
					}
					// create membershipDetail id list for all form memberships for this collective
					var formMembershipDetailIdList = [];
					j = 0;
					for (; j < formEntries[i].membershipDetails.length; j++ ) {
						formMembershipDetailIdList.push(formEntries[i].membershipDetails[j].id);
					}
					// DELETE membershipDetail data if id is in existingMembershipDetailIdList but not in membershipDetails of formEntries
					j = 0;
					for (; j < existingMembershipDetailIdList.length; j++) {
						var k = 0;
						var deleteDataset = true;
						for (; k < formMembershipDetailIdList.length; k++) { // 'j' since both collective id lists match after delete and add memberOfCollective operations
							if (existingMembershipDetailIdList[j] == formMembershipDetailIdList[k]) {
								deleteDataset = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteDataset) {
							switch (type) {
								case 'person':
									await TIMAAT.ActorService.removeMembershipDetails(actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i].membershipDetails[j]);
									actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i].membershipDetails.splice(j,1); // TODO should be moved to ActorDatasets.removeMembershipDetail(..)
								break;
								case 'collective':
									await TIMAAT.ActorService.removeMembershipDetails(actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i].membershipDetails[j]);
									actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i].membershipDetails.splice(j,1); // TODO should be moved to ActorDatasets.removeMembershipDetail(..)
								break;
							}
							existingMembershipDetailIdList.splice(j,1);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					// console.log("TCL: DELETE membershipDetail (end)");
					// ADD membershipDetail data if id is not in existingMembershipDetailIdList but in membershipDetails of formEntries
					j = 0;
					for (; j < formMembershipDetailIdList.length; j++) {
						if (formMembershipDetailIdList[j] == 0) {
							switch (type) {
								case 'person':
									var newMembershipDetails = await TIMAAT.ActorService.addMembershipDetails(actor.model.id, formEntries[i].collectiveId, formEntries[i].membershipDetails[j]);
									actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i].membershipDetails.push(newMembershipDetails);
								break;
								case 'collective':
									var newMembershipDetails = await TIMAAT.ActorService.addMembershipDetails(formEntries[i].actorId, actor.model.id, formEntries[i].membershipDetails[j]);
									actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i].membershipDetails.push(newMembershipDetails);
								break;
							}
							formMembershipDetailIdList.splice(j,1);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					//* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
					// UPDATE membershipDetail data if id is in existingMembershipDetailIdList and in membershipDetails of formEntries
					j = 0;
					for (; j < existingMembershipDetailIdList.length; j++) {
						await TIMAAT.ActorService.updateMembershipDetails(formEntries[i].membershipDetails[j]);
						switch (type) {
							case 'person':
								actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i].membershipDetails[j] = formEntries[i].membershipDetails[j];
							break;
							case 'collective':
								actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i].membershipDetails[j] = formEntries[i].membershipDetails[j];
							break;
						}
					}
				}
				// actor.updateUI();
				TIMAAT.ActorDatasets.refreshDatatable('actor');
				if (type == 'person') {
					TIMAAT.ActorDatasets.refreshDatatable('collective');
				} else if (type == 'collective') {
					TIMAAT.ActorDatasets.refreshDatatable('person');
				}
				console.log("TCL: show actor memberOfCollective form");
				TIMAAT.ActorDatasets.actorFormMemberOfCollectives('show', type, actor);
			});

			// cancel add/edit button in membershipofcollective form functionality
			$('#timaat-actordatasets-actor-memberofcollective-form-dismiss').on('click', function(event) {
				console.log("TCL: MemberOfCollective form: dismiss");
				var actor = $('#timaat-actordatasets-actor-memberofcollective-form').data('actor');
				var type = actor.model.actorType.actorTypeTranslations[0].type;
				TIMAAT.ActorDatasets.actorFormMemberOfCollectives('show', type, $('#timaat-actordatasets-metadata-form').data('actor'));
			});

		},

		initRoles: function() {
			// nav-bar functionality
			$('#actors-tab-actor-roles-form').on('click', function(event) {
				$('.nav-tabs a[href="#actorRoles"]').tab('show');
				$('.form').hide();
				TIMAAT.ActorDatasets.subNavTab = 'actorRoles';
				TIMAAT.ActorDatasets.lastForm = 'roles';
				TIMAAT.ActorDatasets.actorFormRoles('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});
			
			// actor role form handlers
			// submit actor role button functionality
			$('#timaat-actordatasets-actor-role-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				// if (!$('#timaat-actordatasets-actor-role-form').valid()) return false;

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');				
        console.log("TCL: actor", actor);

				// create/edit role window submitted data
				var formSelectData = $('#timaat-actordatasets-actor-role-form').serializeArray();
        console.log("TCL: formSelectData", formSelectData);
        // console.log("TCL: formDataRaw", formDataRaw);
        // var formDataObject = {};
        // $(formDataRaw).each(function(i, field){
				// 	formDataObject[field.name] = field.value;
        // });
        // // delete formDataObject.roleId;
        // console.log("TCL: formDataObject", formDataObject);
        // var formSelectData = formDataRaw;				
        // formSelectData.splice(0,1); // remove entries not part of multi select data
        // console.log("TCL: formSelectData", formSelectData);
        // create proper id list
        var i = 0;
        var roleIdList = [];
        for (; i < formSelectData.length; i++) {
          roleIdList.push( {id: formSelectData[i].value})
        }
        // console.log("TCL: roleIdList", roleIdList);

				// update actor
				let actorModel = actor.model;
				await TIMAAT.ActorDatasets.updateActorHasRole(actorModel, roleIdList);
				// actor.updateUI();
				TIMAAT.ActorDatasets.actorFormRoles('show', actor);
			});

			// edit role form button handler
			$('#timaat-actordatasets-actor-role-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormRoles('edit', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// cancel add/edit button in actor roles form functionality
			$('#timaat-actordatasets-actor-role-form-dismiss').on('click', function(event) {
				TIMAAT.ActorDatasets.actorFormRoles('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

		},

		initRoleMedium: function() {
			// nav-bar functionality
			$('#actors-tab-actor-role-medium-form').on('click', function(event) {
				$('.nav-tabs a[href="#actorRoleMedium"]').tab('show');
				$('.form').hide();
				TIMAAT.ActorDatasets.subNavTab = 'actorRoleMedium';
				TIMAAT.ActorDatasets.lastForm = 'roleMedium';
				TIMAAT.ActorDatasets.actorFormRoleMedium('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});
			
			// actor role medium form handlers
			// submit actor role medium button functionality
			$('#timaat-actordatasets-actor-role-medium-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				// if (!$('#timaat-actordatasets-actor-role-form').valid()) return false;

				// the original actor model (in case of editing an existing actor)
				var actor = $('#timaat-actordatasets-metadata-form').data('actor');				
        console.log("TCL: actor", actor);

				// create/edit role medium window submitted data
				var formSelectData = $('#timaat-actordatasets-actor-role-medium-form').serializeArray();
        console.log("TCL: formSelectData", formSelectData);
        // console.log("TCL: formDataRaw", formDataRaw);
        // var formDataObject = {};
        // $(formDataRaw).each(function(i, field){
				// 	formDataObject[field.name] = field.value;
        // });
        // // delete formDataObject.roleId;
        // console.log("TCL: formDataObject", formDataObject);
        // var formSelectData = formDataRaw;				
        // formSelectData.splice(0,1); // remove entries not part of multi select data
        // console.log("TCL: formSelectData", formSelectData);
        // create proper id list
        var i = 0;
        var mediumIdList = [];
        for (; i < formSelectData.length; i++) {
          mediumIdList.push( {id: formSelectData[i].value})
        }
        // console.log("TCL: mediumIdList", mediumIdList);
				// TODO currently only Producer (5) is checked. Change once other roles have to be altered here
				var roleId = 5;
				// update actor
				let actorModel = actor.model;
				await TIMAAT.ActorDatasets.updateActorRoleInMedium(actorModel, mediumIdList, roleId); // TODO once more than one Producer can be assigned, a list of role ids is required here
				// actor.updateUI();
				TIMAAT.ActorDatasets.actorFormRoleMedium('show', actor);
			});

			// edit role form button handler
			$('#timaat-actordatasets-actor-role-medium-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.ActorDatasets.actorFormRoleMedium('edit', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

			// cancel add/edit button in actor role medium form functionality
			$('#timaat-actordatasets-actor-role-medium-form-dismiss').on('click', function(event) {
				TIMAAT.ActorDatasets.actorFormRoleMedium('show', $('#timaat-actordatasets-metadata-form').data('actor'));
			});

		},

		load: function() {
			TIMAAT.ActorDatasets.loadActors();
			TIMAAT.ActorDatasets.loadActorTypes();
			TIMAAT.ActorDatasets.loadAllActorSubtypes();
			TIMAAT.ActorDatasets.loadAddressTypes();
			TIMAAT.ActorDatasets.loadEmailAddressTypes();
			TIMAAT.ActorDatasets.loadPhoneNumberTypes();
		},

		loadActorTypes: function() {
    	// console.log("TCL: loadActorTypes: function()");
			TIMAAT.ActorService.listActorTypes(TIMAAT.ActorDatasets.setActorTypeList);
		},

		loadActors: function() {
    	// console.log("TCL: loadActors: function()");
			// load actors
			$('.actors-datatables').hide();
			$('.actors-datatable').show();
			TIMAAT.ActorDatasets.clearLastSelection();
			$('#timaat-actordatasets-metadata-form').data('actorType', 'actor');
			// TIMAAT.ActorService.listActors(TIMAAT.ActorDatasets.setActorList);
			// TIMAAT.ActorDatasets.setActorList();
		},

		loadActorDataTables: async function() {
			console.log("TCL: loadActorDataTables: async function()");
			TIMAAT.ActorDatasets.setupActorDatatable();
			TIMAAT.ActorDatasets.setupPersonDatatable();
			TIMAAT.ActorDatasets.setupCollectiveDatatable();
		},

		loadActorSubtype: function(actorSubtype) {
			$('.actors-datatables').hide();
			$('.form').hide();
			TIMAAT.ActorDatasets.clearLastSelection();
			$('.'+actorSubtype+'s-datatable').show();
			$('#timaat-actordatasets-metadata-form').data('actorType', actorSubtype);
			switch (actorSubtype) {
				case 'person':
					// TIMAAT.ActorService.listActorSubtype(actorSubtype, TIMAAT.ActorDatasets.setPersonList);
					TIMAAT.ActorDatasets.setPersonList();
					break;
				case 'collective':
					// TIMAAT.ActorService.listActorSubtype(actorSubtype, TIMAAT.ActorDatasets.setCollectiveList);
					TIMAAT.ActorDatasets.setCollectiveList();
					break;
			}
		},

		loadAllActorSubtypes: function() {
			// TIMAAT.ActorService.listActorSubtype('person', TIMAAT.ActorDatasets.setPersonList);
			// TIMAAT.ActorService.listActorSubtype('collective', TIMAAT.ActorDatasets.setCollectiveList);
			TIMAAT.ActorDatasets.setPersonList();
			TIMAAT.ActorDatasets.setCollectiveList();
		},

		loadAddressTypes: function() {
			TIMAAT.ActorService.listAddressTypes(TIMAAT.ActorDatasets.setAddressTypeList);
		},

		loadEmailAddressTypes: function() {
			TIMAAT.ActorService.listEmailAddressTypes(TIMAAT.ActorDatasets.setEmailAddressTypeList);
		},

		loadPhoneNumberTypes: function() {
			TIMAAT.ActorService.listPhoneNumberTypes(TIMAAT.ActorDatasets.setPhoneNumberTypeList);
		},

		setActorTypeList: function(actorTypes) {
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
		
		setActorList: function() {
			console.log("TCL: setActorList");
			$('.form').hide();
			$('.actors-data-tabs').hide();
			if ( TIMAAT.ActorDatasets.actors == null ) return;

			$('#timaat-actordatasets-actor-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-list').empty();

			// set ajax data source
			if ( TIMAAT.ActorDatasets.dataTableActor ) {
				// TIMAAT.ActorDatasets.dataTableActor.ajax.url('/TIMAAT/api/actor/list');
				TIMAAT.ActorDatasets.dataTableActor.ajax.reload(null, false);
			}
		},

		setPersonList: function() {
			console.log("TCL: setPersonList");
			$('.form').hide();
			$('.actors-data-tabs').hide();
			if ( TIMAAT.ActorDatasets.persons == null) return;
			
			$('#timaat-actordatasets-person-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-person-list').empty();

			// set ajax data source
			if ( TIMAAT.ActorDatasets.dataTablePerson ) {
				// TIMAAT.ActorDatasets.dataTablePerson.ajax.url('/TIMAAT/api/actor/person/list');
				TIMAAT.ActorDatasets.dataTablePerson.ajax.reload(null, false);
			}
		},

		setCollectiveList: function() {
			console.log("TCL: setCollectiveList");
			$('.form').hide();
			$('.actors-data-tabs').hide();
			if ( TIMAAT.ActorDatasets.collectives == null ) return;
			
			$('#timaat-actordatasets-collective-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-collective-list').empty();

			// set ajax data source
			if ( TIMAAT.ActorDatasets.dataTableCollective ) {
				// TIMAAT.ActorDatasets.dataTableCollective.ajax.url('/TIMAAT/api/actor/collective/list');
				TIMAAT.ActorDatasets.dataTableCollective.ajax.reload(null, false);
			}

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
      // console.log("TCL: TIMAAT.ActorDatasets.names", TIMAAT.ActorDatasets.names);
		},

		setActorHasAddressList: function(actor) {
			// console.log("TCL: setActorHasAddressList -> actor", actor);
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
      // console.log("TCL: TIMAAT.ActorDatasets.actorHasAddresses", TIMAAT.ActorDatasets.actorHasAddresses);
		},

		setActorHasEmailAddressList: function(actor) {
			// console.log("TCL: setActorHasEmailAddressList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-emailaddress-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-emailaddress-list').empty();
			// setup model
			var actorHasEmailAddrs = Array();
			actor.model.actorHasEmailAddresses.forEach(function(actorHasEmailAddress) { 
				if ( actorHasEmailAddress.id.actorId > 0 && actorHasEmailAddress.id.emailAddressId > 0 )
				actorHasEmailAddrs.push(actorHasEmailAddress); 
			});
			TIMAAT.ActorDatasets.actorHasEmailAddresses = actorHasEmailAddrs;
      // console.log("TCL: TIMAAT.ActorDatasets.actorHasEmailAddresses", TIMAAT.ActorDatasets.actorHasEmailAddresses);
		},

		setActorHasPhoneNumberList: function(actor) {
			// console.log("TCL: setActorHasPhoneNumberList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-phonenumber-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-phonenumber-list').empty();
			// setup model
			var actorHasPhoneNmbrs = Array();
			actor.model.actorHasPhoneNumbers.forEach(function(actorHasPhoneNumber) { 
				if ( actorHasPhoneNumber.id.actorId > 0 && actorHasPhoneNumber.id.emailAddressId > 0 )
				actorHasPhoneNmbrs.push(actorHasPhoneNumber); 
			});
			TIMAAT.ActorDatasets.actorHasPhoneNumbers = actorHasPhoneNmbrs;
      // console.log("TCL: TIMAAT.ActorDatasets.actorHasPhoneNumbers", TIMAAT.ActorDatasets.actorHasPhoneNumbers);
		},

		setPersonIsMemberOfCollectiveList: function(type, actor) {
			// console.log("TCL: setPersonIsMemberOfCollectiveList -> actor", actor);
			if ( !actor ) return;
			$('#timaat-actordatasets-actor-memberofcollective-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-actor-memberofcollective-list').empty();
			// setup model
			var actorIsMOfCs = Array();
			switch (type) {
				case 'person':
					actor.model.actorPerson.actorPersonIsMemberOfActorCollectives.forEach(function(personIsMemberOfCollective) { 
						if ( personIsMemberOfCollective.id.actorPersonActorId > 0 && personIsMemberOfCollective.id.memberOfActorCollectiveActorId > 0 )
						actorIsMOfCs.push(personIsMemberOfCollective);
					});
				break;
				case 'collective':
					actor.model.actorCollective.actorPersonIsMemberOfActorCollectives.forEach(function(personIsMemberOfCollective) { 
						if ( personIsMemberOfCollective.id.actorPersonActorId > 0 && personIsMemberOfCollective.id.memberOfActorCollectiveActorId > 0 )
						actorIsMOfCs.push(personIsMemberOfCollective);
					});
				break;
			}
			TIMAAT.ActorDatasets.personIsMemberOfCollectives = actorIsMOfCs;
      // console.log("TCL: TIMAAT.ActorDatasets.personIsMemberOfCollectives", TIMAAT.ActorDatasets.personIsMemberOfCollectives);
		},

		setCitizenshipsList: function(actor) {

		},

		setAddressTypeList: function(addressTypes) {
			// console.log("TCL: setAddressTypeList -> addressTypes", addressTypes);
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

		setEmailAddressTypeList: function(emailAddressTypes) {
			// console.log("TCL: setAddressTypeList -> emailAddressTypes", emailAddressTypes);
			if ( !emailAddressTypes ) return;
			$('#timaat-actordatasets-emailaddresstype-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-emailaddresstype-list').empty();
			// setup model
			var emailAddrTypes = Array();
			emailAddressTypes.forEach(function(emailAddressType) { 
				if ( emailAddressType.id > 0 )
					emailAddrTypes.push(emailAddressType); 
			});
			TIMAAT.ActorDatasets.emailAddressTypes = emailAddrTypes;
      // console.log("TCL: TIMAAT.ActorDatasets.emailAddressTypes", TIMAAT.ActorDatasets.emailAddressTypes);
		},

		setPhoneNumberTypeList: function(phoneNumberTypes) {
			// console.log("TCL: setAddressTypeList -> phoneNumberTypes", phoneNumberTypes);
			if ( !phoneNumberTypes ) return;
			$('#timaat-actordatasets-phonenumbertype-list-loader').remove();
			// clear old UI list
			$('#timaat-actordatasets-phonenumbertype-list').empty();
			// setup model
			var phoneNmbrTypes = Array();
			phoneNumberTypes.forEach(function(phoneNumberType) { 
				if ( phoneNumberType.id > 0 )
					phoneNmbrTypes.push(phoneNumberType); 
			});
			TIMAAT.ActorDatasets.phoneNumberTypes = phoneNmbrTypes;
      // console.log("TCL: TIMAAT.ActorDatasets.phoneNumberTypes", TIMAAT.ActorDatasets.phoneNumberTypes);
		},
		
		addActor: function(actorType) {	
			// console.log("TCL: addActor: function()");
			console.log("TCL: addActor: actorType", actorType);
			$('.form').hide();
			$('.actors-data-tabs').hide();
			$('.nav-tabs a[href="#'+actorType+'Datasheet"]').show();
			// $('.nav-tabs a[href="#actorNames"]').hide();
			$('#timaat-actordatasets-metadata-form').data(actorType, null);
			actorFormMetadataValidator.resetForm();

			$('.carousel-inner').empty();
			$('.carousel-indicators').empty();
			var node = document.getElementById("actor-datasheet-form-profile-image-selection");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}

			$('#timaat-actordatasets-metadata-form').trigger('reset');
			$('#timaat-actordatasets-metadata-form').show();
			$('#dynamic-profile-image-fields').hide();
			$('#dynamic-profile-image-fields-placeholder').show();
			$('.carousel-item').first().addClass('active');
			$('.carousel-indicators > li').first().addClass('active');
			$('#dynamic-profile-image-fields').carousel();
			$('.datasheet-data').hide();
			$('.name-data').show();
			$('.actor-data').show();
			// if (actorType == "actor") {
			// 	$('.actortype-data').show();
			// }	else {
			// 	$('.actortype-data').hide();
			// }
			$('.'+actorType+'-data').show();
			$('#timaat-actordatasets-metadata-form-edit').hide();
      $('#timaat-actordatasets-metadata-form-delete').hide();
      $('#timaat-actordatasets-metadata-form-submit').html('Add');
      $('#timaat-actordatasets-metadata-form-submit').show();
			$('#timaat-actordatasets-metadata-form-dismiss').show();
			$('#actor-datasheet-form-profile-image-selection').show();
			$('#timaat-actordatasets-metadata-form :input').prop('disabled', false);
			$('#actorFormHeader').html("Add "+actorType);

			$('#timaat-actordatasets-metadata-actor-name').focus();

			let imageSelect =
					`<label class="col-form-label col-form-label-sm">Change the associated profile images (max. 5 in total):</label>
					<div class="form-group" data-role="profileImages-entry">
						<div class="form-row">
							<div class="col-md-12">
								<label class="sr-only">Profile Image(s)</label>
								<select class="form-control form-control-sm"
												id="actor-profile-image-multi-select-dropdown"
												name="imageId"
												data-placeholder="Select images"
												multiple="multiple"
												readonly="true">
								</select>
							</div>
						</div>
					</div>`;
				$('#actor-datasheet-form-profile-image-selection').append(imageSelect);
				  function formatPreview(data) {
          // console.log("TCL: formatPreview -> data", data);
					if (data.loading) {
						return data.text;
					}
					var $container = $(
						"<div class='select2-result-repository clearfix' style='display:flex'>" +
							"<div class='select2-result-repository__avatar'><img src='/TIMAAT/api/medium/image/"+data.id+"/thumbnail"+"?token="+data.token+"' style='max-height:100%; max-width:100%'></div>" +
							"<div class='select2-result-repository__meta'>" +
								"<div class='select2-result-repository__title'></div>" +
								"<div class='select2-result-repository__description'></div>" +
							"</div>" +
						"</div>");
					$container.find('.select2-result-repository__title').text(data.text);
					return $container;
				};
				
				function formatSelection(data) {
					return data.text;
				}
				$('#actor-profile-image-multi-select-dropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: false,
					maximumSelectionLength: 5,
					allowClear: true,
					ajax: {
						url: 'api/medium/image/selectList/',
						type: 'GET',
						dataType: 'json',
						delay: 250,
						headers: {
							"Authorization": "Bearer "+TIMAAT.Service.token,
							"Content-Type": "application/json",
						},
						// additional parameters
						data: function(params) {
							// console.log("TCL: data: params", params);
							return {
								search: params.term,
								page: params.page
							};          
						},
						processResults: function(data, params) {
							// console.log("TCL: processResults: data", data);
							params.page = params.page || 1;
							return {
								results: data,
								// pagination: {
								// 	more: (params.page * 10) < data.total_count
								// }
							};
						},
						cache: true
					},
					templateResult: formatPreview,
					templateSelection: formatSelection,
					minimumInputLength: 0,
					placeholder: 'Select image(s) (max. 5)'
				});

			// setup form
			$('#timaat-actordatasets-metadata-actor-isfictional').prop('checked', false);
			$('#timaat-actordatasets-metadata-actor-name-usedfrom').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-actordatasets-metadata-actor-name-useduntil').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-actordatasets-metadata-person-dateofbirth').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-actordatasets-metadata-person-dayofdeath').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-actordatasets-metadata-collective-founded').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-actordatasets-metadata-collective-disbanded').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
		},

		actorFormDatasheet: async function(action, actorType, actorTypeData) {
			console.log("TCL: action, actorType, actorTypeData", action, actorType, actorTypeData);
			TIMAAT.ActorDatasets.selectLastSelection(actorType, actorTypeData.model.id);
			TIMAAT.ActorDatasets.selectLastSelection('actor', actorTypeData.model.id);
			$('.carousel-inner').empty();
			$('.carousel-indicators').empty();
			var node = document.getElementById("actor-datasheet-form-profile-image-selection");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-metadata-form').trigger('reset');

			if (actorTypeData.model.profileImages.length == 0) {
				$('#dynamic-profile-image-fields').hide();
				$('#dynamic-profile-image-fields-placeholder').show();
			} else {
				$('#dynamic-profile-image-fields-placeholder').hide();
				$('#dynamic-profile-image-fields').show();
				var i = 0;
				for (; i < actorTypeData.model.profileImages.length; i++) {
					// console.log("TCL: actorTypeData.model.profileImages["+i+"]", actorTypeData.model.profileImages[i]);
					let viewToken = await TIMAAT.MediaService.getViewToken(actorTypeData.model.profileImages[i].mediumId);
					$(`<div class="carousel-item"
									data-id=`+actorTypeData.model.profileImages[i].mediumId+`>
							<img src="/TIMAAT/api/actor/profileImage/`+actorTypeData.model.profileImages[i].mediumId+`?token=`+viewToken+`"
									style="max-height:100%; max-width:100%"
									class="center">
						</div>`).appendTo('.carousel-inner');
					$(`<li data-target="#dynamic-profile-image-fields"
								data-slide-to="`+i+`">
						</li>`).appendTo('.carousel-indicators');
				}
				let maxHeight = Math.max.apply(Math, actorTypeData.model.profileImages.map(function(o) {return o.height}));
				if (maxHeight > 480)
					$('#profile-image-carousel-inner').css('height', 480);
				else
					$('#profile-image-carousel-inner').css('height', maxHeight);
				$('.carousel-item').first().addClass('active');
				$('.carousel-indicators > li').first().addClass('active');
				$('#dynamic-profile-image-fields').carousel();
			}

			$('#timaat-actordatasets-metadata-form').attr('data-type', actorType);
			$('.datasheet-data').hide();
			$('.name-data').show();
			$('.actor-data').show();
			// if (actorType == "actor") { $('.actortype-data').show(); }	else {	$('.actortype-data').hide(); }		
			$('.'+actorType+'-data').show();
			actorFormMetadataValidator.resetForm();

			// show tabs
			$('.'+actorType+'-data-tab').show();
			$('.name-data-tab').show();
			$('.address-data-tab').show();
			$('.emailaddress-data-tab').show();
			$('.phonenumber-data-tab').show();
			$('.actorroles-data-tab').show();
			$('.actorrolemedium-data-tab').show();
			$('.memberofcollective-data-tab').show();

			$('#actor-profile-images').css('visibility', 'visible');
			$('.nav-tabs a[href="#'+actorType+'Datasheet"]').focus();
			$('#timaat-actordatasets-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-actordatasets-metadata-form :input').prop('disabled', true);
				$('#timaat-actordatasets-metadata-form-tag').prop('disabled', false);
				$('#timaat-actordatasets-metadata-form-tag :input').prop('disabled', false);
				$('#timaat-actordatasets-metadata-form-tag').show();
				$('#timaat-actordatasets-metadata-form-edit').prop('disabled', false);
				$('#timaat-actordatasets-metadata-form-edit :input').prop('disabled', false);
				$('#timaat-actordatasets-metadata-form-edit').show();
				$('#timaat-actordatasets-metadata-form-delete').prop('disabled', false);
				$('#timaat-actordatasets-metadata-form-delete :input').prop('disabled', false);
				$('#timaat-actordatasets-metadata-form-delete').show();
				$('#timaat-actordatasets-metadata-form-submit').hide();
				$('#timaat-actordatasets-metadata-form-dismiss').hide();
				$('#actor-datasheet-form-profile-image-selection').hide();
				$('#actorFormHeader').html(actorType+" Datasheet (#"+ actorTypeData.model.id+')');
			}
			else if (action == 'edit') {
				$('.'+actorType+'-datasheet-form-submit').show();
				$('#timaat-actordatasets-metadata-form :input').prop('disabled', false);
				// if (actorType == "actor") {	$('#timaat-actordatasets-metadata-actor-actortype-id').prop('disabled', true); }
				// else { $('#timaat-actordatasets-metadata-actor-actortype-id').hide(); }
				$('#timaat-actordatasets-metadata-actor-name-usedfrom').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-actordatasets-metadata-actor-name-useduntil').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-actordatasets-metadata-person-dateofbirth').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-actordatasets-metadata-person-dayofdeath').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-actordatasets-metadata-collective-founded').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-actordatasets-metadata-collective-disbanded').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-actordatasets-metadata-form-tag').hide();
				$('#timaat-actordatasets-metadata-form-tag').prop('disabled', true);
				$('#timaat-actordatasets-metadata-form-tag :input').prop('disabled', true);
				$('#timaat-actordatasets-metadata-form-edit').hide();
				$('#timaat-actordatasets-metadata-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-metadata-form-edit :input').prop('disabled', true);
				$('#timaat-actordatasets-metadata-form-delete').hide();
				$('#timaat-actordatasets-metadata-form-delete').prop('disabled', true);
				$('#timaat-actordatasets-metadata-form-delete :input').prop('disabled', true);
				$('#timaat-actordatasets-metadata-form-submit').html("Save");
				$('#timaat-actordatasets-metadata-form-submit').show();
				$('#timaat-actordatasets-metadata-form-dismiss').show();
				$('#actor-datasheet-form-profile-image-selection').show();
				$('#actorFormHeader').html("Edit "+actorType);
				$('#timaat-actordatasets-metadata-actor-name').focus();

				let imageSelect =
					`<label class="col-form-label col-form-label-sm">Change the associated profile images (max. 5 in total):</label>
					<div class="form-group" data-role="profileImages-entry">
						<div class="form-row">
							<div class="col-md-12">
								<label class="sr-only">Profile Image(s)</label>
								<select class="form-control form-control-sm"
												id="actor-profile-image-multi-select-dropdown"
												name="imageId"
												data-placeholder="Select images"
												multiple="multiple"
												readonly="true">
								</select>
							</div>
						</div>
					</div>`;
				$('#actor-datasheet-form-profile-image-selection').append(imageSelect);
				  function formatPreview(data) {
          // console.log("TCL: formatPreview -> data", data);
					if (data.loading) {
						return data.text;
					}
					var $container = $(
						"<div class='select2-result-repository clearfix' style='display:flex'>" +
							"<div class='select2-result-repository__avatar'><img src='/TIMAAT/api/medium/image/"+data.id+"/thumbnail"+"?token="+data.token+"' style='max-height:100%; max-width:100%'></div>" +
							"<div class='select2-result-repository__meta'>" +
								"<div class='select2-result-repository__title'></div>" +
								"<div class='select2-result-repository__description'></div>" +
							"</div>" +
						"</div>");
					$container.find('.select2-result-repository__title').text(data.text);
					return $container;
				};
				
				function formatSelection(data) {
					return data.text;
				}
				$('#actor-profile-image-multi-select-dropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: false,
					maximumSelectionLength: 5,
					allowClear: true,
					ajax: {
						url: 'api/medium/image/selectList/',
						type: 'GET',
						dataType: 'json',
						delay: 250,
						headers: {
							"Authorization": "Bearer "+TIMAAT.Service.token,
							"Content-Type": "application/json",
						},
						// additional parameters
						data: function(params) {
							// console.log("TCL: data: params", params);
							return {
								search: params.term,
								page: params.page
							};          
						},
						processResults: function(data, params) {
							// console.log("TCL: processResults: data", data);
							params.page = params.page || 1;
							return {
								results: data,
								// pagination: {
								// 	more: (params.page * 10) < data.total_count
								// }
							};
						},
						cache: true
					},
					templateResult: formatPreview,
					templateSelection: formatSelection,
					minimumInputLength: 0,
					placeholder: 'Select image(s) (max. 5)'
				});
				var profileImageSelect = $('#actor-profile-image-multi-select-dropdown');
				await TIMAAT.ActorService.getActorHasImageList(actorTypeData.model.id).then(async function(data) {
					// console.log("TCL: then: data", data);
					if (data.length > 0) {
						data.sort((a, b) => (a.displayTitle.name > b.displayTitle.name)? 1 : -1);
						// create the options and append to Select2
						var i = 0;
						for (; i < data.length; i++) {
							let medium = await TIMAAT.MediaService.getMedium(data[i].mediumId);
							var option = new Option(medium.displayTitle.name, data[i].mediumId, true, true);
							profileImageSelect.append(option).trigger('change');
						}
						// manually trigger the 'select2:select' event
						profileImageSelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					}
				});
			}

			// setup UI
			var data = actorTypeData.model;
			// actor data
			if (data.profileImages.length == 0) {
				$('.datasheet-form-remove-profile-image-button').prop('disabled', true);
				$('.datasheet-form-remove-profile-image-button :input').prop('disabled', true);
				$('.datasheet-form-remove-profile-image-button').removeClass('btn-danger').removeClass('btn-outline').addClass('btn-secondary');
			} else if (data.profileImages.length >= 5) {
				$('.datasheet-form-add-profile-image-button').prop('disabled', true);
				$('.datasheet-form-add-profile-image-button :input').prop('disabled', true);
				$('.datasheet-form-add-profile-image-button').removeClass('btn-primary').removeClass('btn-outline').addClass('btn-secondary');
			} else {
				$('.datasheet-form-add-profile-image-button').prop('disabled', false);
				$('.datasheet-form-add-profile-image-button :input').prop('disabled', false);
				$('.datasheet-form-add-profile-image-button').removeClass('btn-secondary').addClass('btn-outline').addClass('btn-primary');
				$('.datasheet-form-remove-profile-image-button').prop('disabled', false);
				$('.datasheet-form-remove-profile-image-button :input').prop('disabled', false);
				$('.datasheet-form-remove-profile-image-button').removeClass('btn-secondary').addClass('btn-outline').addClass('btn-danger');
			}
			$('#timaat-actordatasets-metadata-actor-actortype-id').val(data.actorType.id);
			$('#timaat-actordatasets-metadata-actor-name').val(data.displayName.name);
			if (data.displayName.usedFrom != null && !(isNaN(data.displayName.usedFrom)))
				$('#timaat-actordatasets-metadata-actor-name-usedfrom').val(moment.utc(data.displayName.usedFrom).format('YYYY-MM-DD'));
				else $('#timaat-actordatasets-metadata-actor-name-usedfrom').val('');
			if(data.displayName.usedUntil != null && !(isNaN(data.displayName.usedUntil)))
				$('#timaat-actordatasets-metadata-actor-name-useduntil').val(moment.utc(data.displayName.usedUntil).format('YYYY-MM-DD'));
				else $('#timaat-actordatasets-metadata-actor-name-useduntil').val('');
			if (data.isFictional)
				$('#timaat-actordatasets-metadata-actor-isfictional').prop('checked', true);
				else $('#timaat-actordatasets-metadata-actor-isfictional').prop('checked', false);

			// actor subtype specific data
			switch (actorType) {
				case 'person':
					$('#timaat-actordatasets-metadata-person-title').val(data.actorPerson.title);
					if (data.actorPerson.dateOfBirth != null && !(isNaN(data.actorPerson.dateOfBirth)))
						$('#timaat-actordatasets-metadata-person-dateofbirth').val(moment.utc(data.actorPerson.dateOfBirth).format('YYYY-MM-DD'));
						else $('#timaat-actordatasets-metadata-person-dateofbirth').val('');
					$('#timaat-actordatasets-metadata-person-placeofbirth').val(data.actorPerson.placeOfBirth);
					if (data.actorPerson.dayOfDeath != null && !(isNaN(data.actorPerson.dayOfDeath)))
						$('#timaat-actordatasets-metadata-person-dayofdeath').val(moment.utc(data.actorPerson.dayOfDeath).format('YYYY-MM-DD'));
						else $('#timaat-actordatasets-metadata-person-dayofdeath').val('');
					$('#timaat-actordatasets-metadata-person-placeofdeath').val(data.actorPerson.placeOfDeath);
					$('#timaat-actordatasets-metadata-person-sex-type').val(data.actorPerson.sex.id);
					// $('#timaat-actordatasets-metadata-person-citizenship-name').val(data.actorPerson.citizenships[0].citizenshipTranslations[0].name);
					$('#timaat-actordatasets-metadata-person-specialfeatures').val(data.actorPerson.actorPersonTranslations[0].specialFeatures);
					// TODO remove once location is properly connected
					$('#timaat-actordatasets-metadata-person-placeofbirth').prop('disabled', true);
					$('#timaat-actordatasets-metadata-person-placeofdeath').prop('disabled', true);
				break;
				case 'collective':
					if (data.actorCollective.founded != null && !(isNaN(data.actorCollective.founded)))
						$('#timaat-actordatasets-metadata-collective-founded').val(moment.utc(data.actorCollective.founded).format('YYYY-MM-DD'));
						else $('#timaat-actordatasets-metadata-collective-founded').val('');
					if (data.actorCollective.disbanded != null && !(isNaN(data.actorCollective.disbanded)))
						$('#timaat-actordatasets-metadata-collective-disbanded').val(moment.utc(data.actorCollective.disbanded).format('YYYY-MM-DD'));
						else $('#timaat-actordatasets-metadata-collective-disbanded').val('');
				break;
			}
			$('#timaat-actordatasets-metadata-form').data(actorType, actorTypeData);
		},

		actorFormNames: function(action, actor) {
			console.log("TCL: actorFormNames: action, actor", action, actor);
			TIMAAT.ActorDatasets.selectLastSelection(actor.model.actorType.actorTypeTranslations[0].type, actor.model.id);
			TIMAAT.ActorDatasets.selectLastSelection('actor', actor.model.id);
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
									<input class="form-check-input isBirthName" type="radio" name="isBirthName" data-role="birthName[`+actor.model.actorNames[i].id+`]" data-waschecked="true" placeholder="Is birth Name"">
								</div>
							</div>
							<div class="col-sm-5 col-md-5">
								<label class="sr-only">Name</label>
								<input class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-name" name="actorName[`+i+`]" data-role="actorName[`+actor.model.actorNames[i].id+`]" placeholder="[Enter name]" aria-describedby="Name" minlength="3" maxlength="200" rows="1" required>
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used from</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-usedfrom" id="nameUsedFrom[`+i+`]" name="nameUsedFrom[`+i+`]" data-role="nameUsedFrom[`+actor.model.actorNames[i].id+`]" placeholder="[Enter name used from]" aria-describedby="Name used from">
							</div>
							<div class="col-md-2">
								<label class="sr-only">Name used until</label>
								<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-useduntil" id="nameUsedUntil[`+i+`]" name="nameUsedUntil[`+i+`]" data-role="nameUsedUntil[`+actor.model.actorNames[i].id+`]" placeholder="[Enter name used until]" aria-describedby="Name used until">
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
				);
				var name = actor.model.actorNames[i];
				if (actor.model.displayName.id == name.id) {
					$('[data-role="displayName['+name.id+']"]').prop('checked', true);
				}
				if (actor.model.birthName && actor.model.birthName.id == name.id) {
					$('[data-role="birthName['+name.id+']"]').prop('checked', true);
				}
				$('input[name="name['+i+']"]').rules("add", { required: true, minlength: 3, maxlength: 200 });
				$('[data-role="actorName['+name.id+']"]').attr('value', name.name);
				if (name.usedFrom != null && !(isNaN(name.usedFrom)))
					$('[data-role="nameUsedFrom['+name.id+']"]').val(moment.utc(name.usedFrom).format('YYYY-MM-DD'));
					else $('[data-role="nameUsedFrom['+name.id+']"]').val('');
				if (name.usedUntil != null && !(isNaN(name.usedUntil)))
					$('[data-role="nameUsedUntil['+name.id+']"]').val(moment.utc(name.usedUntil).format('YYYY-MM-DD'));
					else $('[data-role="nameUsedUntil['+name.id+']"]').val('');
			}
			if ( action == 'show') {
				$('#timaat-actordatasets-actor-actornames-form :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-actornames-form-edit').show();
				$('#timaat-actordatasets-actor-actornames-form-edit').prop('disabled', false);
				$('#timaat-actordatasets-actor-actornames-form-edit :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-actornames-form-submit').hide();
				$('#timaat-actordatasets-actor-actornames-form-dismiss').hide();
				$('[data-role="new-name-fields"').hide();
				$('.name-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#actorNamesLabel').html("Actor name list");
				if (actor.model.actorType.actorTypeTranslations[0].type == "person") {
					$('#actor-display-name-header').html("Display Name");
					$('#actor-birth-name-header').html("Birth Name");
				}
				if (actor.model.actorType.actorTypeTranslations[0].type == "collective") {
					$('#actor-display-name-header').html("Display Designation");
					$('#actor-birth-name-header').html("Original Designation");
				}
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-actornames-form-submit').show();
				$('#timaat-actordatasets-actor-actornames-form-dismiss').show();
				$('#timaat-actordatasets-actor-actornames-form :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-actornames-form-edit').hide();
				$('#timaat-actordatasets-actor-actornames-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-actor-actornames-form-edit :input').prop('disabled', true);
				$('[data-role="new-name-fields"').show();
				$('.name-form-divider').show();
				$('#actorNamesLabel').html("Edit actor name list");
				$('#timaat-actordatasets-actor-actornames-form-submit').html("Save");
				$('#timaat-actordatasets-metadata-actor-name').focus();

				// fields for new name entry
				$('[data-role="new-name-fields"]').append(TIMAAT.ActorDatasets.appendNewNameField());

				$('.timaat-actordatasets-actor-actornames-name-usedfrom').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('.timaat-actordatasets-actor-actornames-name-useduntil').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});

				$('#timaat-actordatasets-actor-actornames-form').data('actor', actor);
			}
		},

		actorFormAddresses: function(action, actor) {
    	console.log("TCL: actorFormAddresses: action, actor", action, actor);
			var node = document.getElementById("dynamic-actorhasaddress-fields");
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
				$('[data-role="dynamic-actorhasaddress-fields"]').append(
					`<div class="form-group" data-role="address-entry">
						<div class="form-row">
							<div class="col-md-11">
								<fieldset>
									<legend>Address</legend>
									<div class="form-row align-items-center">
										<div class="col-md-2 col-auto">
											<div class="form-check form-check-inline">
												<input class="form-check-input isPrimaryAddress"
															 type="radio" name="isPrimaryAddress"
															 data-role="primaryAddress[`+actor.model.actorHasAddresses[i].id.addressId+`]"
															 placeholder="Is primary address">
												<label class="form-check-label col-form-label col-form-label-sm" for="isPrimaryAddress">Primary address</label>
											</div>
										</div>
										<div class="col-md-5">
											<label class="col-form-label col-form-label-sm">Street name</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetname"
														 name="streetName[`+i+`]"
														 data-role="streetName[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 value="`+actor.model.actorHasAddresses[i].address.streetName+`"
														 placeholder="[Enter street name]"
														 aria-describedby="Street name"
														 minlength="3"
														 maxlength="200"
														 rows="1"
														 readonly="true">
										</div>
										<div class="col-md-2">
											<label class="col-form-label col-form-label-sm">Street number</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetnumber"
														 name="streetNumber[`+i+`]"
														 data-role="streetNumber[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 value="`+actor.model.actorHasAddresses[i].address.streetNumber+`"
														 placeholder="[Enter street number]"
														 aria-describedby="Street number"
														 maxlength="10">
										</div>
										<div class="col-md-3">
											<label class="col-form-label col-form-label-sm">Street addition</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetaddition"
														 name="streetAddition[`+i+`]"
														 data-role="streetAddition[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 value="`+actor.model.actorHasAddresses[i].address.streetAddition+`"
														 placeholder="[Enter street addition]"
														 aria-describedby="Street addition"
														 maxlength="50">
										</div>
									</div>
									<div class="form-row">
										<div class="col-md-3">
											<label class="col-form-label col-form-label-sm">Postal code</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postalcode"
														 name="postalCode[`+i+`]"
														 data-role="postalCode[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 value="`+actor.model.actorHasAddresses[i].address.postalCode+`"
														 placeholder="[Enter postal code]"
														 aria-describedby="Postal code"
														 maxlength="8">
										</div>
										<div class="col-md-6">
											<label class="col-form-label col-form-label-sm">City</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-cityname"
														 name="cityName[`+i+`]"
														 data-role="cityName[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 value="`+actor.model.actorHasAddresses[i].address.cityName+`"
														 placeholder="[Enter city]"
														 aria-describedby="City"
														 readonly="true">
										</div>
										<div class="col-md-3">
											<label class="col-form-label col-form-label-sm">Post office box</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postofficebox"
														 name="postOfficeBox[`+i+`]"
														 data-role="postOfficeBox[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 value="`+actor.model.actorHasAddresses[i].address.postOfficeBox+`"
														 placeholder="[Enter post office box]"
														 aria-describedby="Post office box"
														 maxlength="10">
										</div>
									</div>
									<div class="form-row">
										<div class="col-md-4">
											<label class="col-form-label col-form-label-sm">Address type*</label>
											<select class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-addresstype-id"
															name="addressTypeId[`+i+`]"
															data-role="addressTypeId[`+actor.model.actorHasAddresses[i].id.addressId+`]"
															required>
												<-- <option value="" disabled selected hidden>[Choose address type...]</option>
												<option value="1"> </option>
												<option value="2">business</option>
												<option value="3">home</option>
												<option value="4">other</option>
											</select>
										</div>
										<div class="col-md-4">
											<label class="col-form-label col-form-label-sm">Address used from</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-usedfrom"
														 name="addressUsedFrom[`+i+`]"
														 data-role="addressUsedFrom[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 placeholder="[Enter used from]"
														 aria-describedby="Address used from">
										</div>
										<div class="col-md-4">
											<label class="col-form-label col-form-label-sm">Address used until</label>
											<input type="text"
														 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-useduntil"
														 name="addressUsedUntil[`+i+`]"
														 data-role="addressUsedUntil[`+actor.model.actorHasAddresses[i].id.addressId+`]"
														 placeholder="[Enter used until]"
														 aria-describedby="Address used until">
										</div>
									</div>
								</fieldset>
							</div>
							<div class="col-md-1 vertical-aligned">
								<button class="btn btn-danger" data-role="remove">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
				);
				var address = actor.model.actorHasAddresses[i];
				if (actor.model.primaryAddress && actor.model.primaryAddress.id == address.id.addressId) {
					$('[data-role="primaryAddress['+address.id.addressId+']"]')
						.prop('checked', true);
				}
				// $('input[name="name['+i+']"]').rules("add", { required: true, minlength: 3, maxlength: 200});
				$('[data-role="addressTypeId['+address.id.addressId+']"]')
				.find('option[value='+address.addressType.id+']')
				.attr('selected', true);
				if (address.usedFrom != null && !(isNaN(address.usedFrom)))
					$('[data-role="addressUsedFrom['+address.id.addressId+']"]').val(moment.utc(address.usedFrom).format('YYYY-MM-DD'));
					else $('[data-role="addressUsedFrom['+address.id.addressId+']"]').val('');
				if (address.usedUntil != null && !(isNaN(address.usedUntil)))
					$('[data-role="addressUsedUntil['+address.id.addressId+']"]').val(moment.utc(address.usedUntil).format('YYYY-MM-DD'));
					else $('[data-role="addressUsedUntil['+address.id.addressId+']"]').val('');
			}
			if ( action == 'show') {
				$('#timaat-actordatasets-actor-addresses-form :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-addresses-form-edit').show();
				$('#timaat-actordatasets-actor-addresses-form-edit').prop('disabled', false);
				$('#timaat-actordatasets-actor-addresses-form-edit :input').prop('disabled', false);
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
				$('#timaat-actordatasets-actor-addresses-form :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-addresses-form-edit').hide();
				$('#timaat-actordatasets-actor-addresses-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-actor-addresses-form-edit :input').prop('disabled', true);
				$('[data-role="new-actorhasaddress-fields"').show();
				$('.address-form-divider').show();
				$('#actorAddressesLabel').html("Actor Addressensliste bearbeiten");
				$('#timaat-actordatasets-actor-addresses-form-submit').html("Speichern");
				$('#timaat-actordatasets-metadata-actor-address').focus();

				// fields for new address entry
				$('[data-role="new-actorhasaddress-fields"]').append(TIMAAT.ActorDatasets.appendNewAddressField());

				$('.timaat-actordatasets-actor-addresses-address-usedfrom').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('.timaat-actordatasets-actor-addresses-address-useduntil').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});

				console.log("TCL: actor", actor);
				$('#timaat-actordatasets-actor-addresses-form').data('actor', actor);
			}
		},

		actorFormEmailAddresses: function(action, actor) {
    	console.log("TCL: actorFormEmailAddresses: action, actor", action, actor);
			var node = document.getElementById("dynamic-actorhasemailaddress-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			var node = document.getElementById("new-actorhasemailaddress-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-actor-emailaddresses-form').trigger('reset');
			actorFormEmailAddressesValidator.resetForm();
			// $('.actor-data-tab').show();
			$('.nav-tabs a[href="#actorEmailAddresses"]').focus();
			$('#timaat-actordatasets-actor-emailaddresses-form').show();
			
			// setup UI
			var i = 0;
			var numEmailAddresses = actor.model.actorHasEmailAddresses.length;
      // console.log("TCL: actor.model.actorHasEmailAddresses", actor.model.actorHasEmailAddresses);
			for (; i< numEmailAddresses; i++) {
				$('[data-role="dynamic-actorhasemailaddress-fields"]').append(
					`<div class="form-group" data-role="emailaddress-entry">
							<div class="form-row">
									<div class="col-md-2 text-center">
										<div class="form-check">
											<input class="form-check-input isPrimaryEmailAddress" type="radio" name="isPrimaryEmailAddress" data-role="primaryEmailAddress[`+actor.model.actorHasEmailAddresses[i].id.emailAddressId+`]" placeholder="Is primary email address">
											<label class="sr-only" for="isPrimaryEmailAddress"></label>
										</div>
									</div>
									<div class="col-md-3">
									<label class="sr-only">Email address type*</label>
									<select class="form-control form-control-sm timaat-actordatasets-actor-emailaddresses-emailaddresstype-id" name="emailAddressTypeId[`+i+`]" data-role="emailAddressTypeId[`+actor.model.actorHasEmailAddresses[i].id.emailAddressId+`]" required>
										<option value="" disabled selected hidden>[Choose email type...]</option>
										<option value="1"> </option>
										<option value="2">home</option>
										<option value="3">work</option>
										<option value="4">other</option>
										<option value="5">mobile</option>
										<option value="6">custom</option>
									</select>
								</div>
									<div class="col-md-6">
										<label class="sr-only">Email address</label>
										<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-emailaddresses-emailaddress" name="emailAddress[`+i+`]" data-role="emailAddress[`+actor.model.actorHasEmailAddresses[i].id.emailAddressId+`]" value="`+actor.model.actorHasEmailAddresses[i].emailAddress.email+`" placeholder="[Enter email address]" aria-describedby="Email address" required>
									</div>
								<div class="col-md-1 text-center">
									<button class="btn btn-danger" data-role="remove">
										<i class="fas fa-trash-alt"></i>
									</button>
								</div>
							</div>
						</div>`
				);
				var email = actor.model.actorHasEmailAddresses[i];
				if (actor.model.primaryEmailAddress && actor.model.primaryEmailAddress.id == email.id.emailAddressId) {
					$('[data-role="primaryEmailAddress['+email.id.emailAddressId+']"]').prop('checked', true);
				}
				$('[data-role="emailAddressTypeId['+email.id.emailAddressId+']"]')
					.find('option[value='+email.emailAddressType.id+']').attr('selected', true);
				$('input[name="emailAddress['+i+']"]').rules("add", { required: true, email: true});
			}
			if ( action == 'show') {
				$('#timaat-actordatasets-actor-emailaddresses-form :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-emailaddresses-form-edit').show();
				$('#timaat-actordatasets-actor-emailaddresses-form-edit').prop('disabled', false);
				$('#timaat-actordatasets-actor-emailaddresses-form-edit :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-emailaddresses-form-submit').hide();
				$('#timaat-actordatasets-actor-emailaddresses-form-dismiss').hide();
				$('[data-role="new-actorhasemailaddress-fields"').hide();
				$('.emailaddress-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#actorEmailAddressesLabel').html("Actor email list");
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-emailaddresses-form-submit').show();
				$('#timaat-actordatasets-actor-emailaddresses-form-dismiss').show();
				$('#timaat-actordatasets-actor-emailaddresses-form :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-emailaddresses-form-edit').hide();
				$('#timaat-actordatasets-actor-emailaddresses-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-actor-emailaddresses-form-edit :input').prop('disabled', true);
				$('[data-role="new-actorhasemailaddress-fields"').show();
				$('.emailaddress-form-divider').show();
				$('#actorEmailAddressesLabel').html("Edit Actor email list");
				$('#timaat-actordatasets-actor-emailaddresses-form-submit').html("Speichern");
				$('#timaat-actordatasets-metadata-actor-emailaddress').focus();

				// fields for new email address entry
				$('[data-role="new-actorhasemailaddress-fields"]').append(TIMAAT.ActorDatasets.appendNewEmailAddressField());
				console.log("TCL: actor", actor);
				$('#timaat-actordatasets-actor-emailaddresses-form').data('actor', actor);
			}
		},

		actorFormPhoneNumbers: function(action, actor) {
    	console.log("TCL: actorFormPhoneNumbers: action, actor", action, actor);
			var node = document.getElementById("dynamic-actorhasphonenumber-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			var node = document.getElementById("new-actorhasphonenumber-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-actor-phonenumbers-form').trigger('reset');
			actorFormPhoneNumbersValidator.resetForm();
			// $('.actor-data-tab').show();
			$('.nav-tabs a[href="#actorPhoneNumbers"]').focus();
			$('#timaat-actordatasets-actor-phonenumbers-form').show();
			
			// setup UI
			var i = 0;
			var numPhoneNumbers = actor.model.actorHasPhoneNumbers.length;
      // console.log("TCL: actor.model.actorHasPhoneNumbers", actor.model.actorHasPhoneNumbers);
			for (; i< numPhoneNumbers; i++) {
				$('[data-role="dynamic-actorhasphonenumber-fields"]').append(
					`<div class="form-group" data-role="phonenumber-entry">
							<div class="form-row">
									<div class="col-md-2 text-center">
										<div class="form-check">
											<input class="form-check-input isPrimaryPhoneNumber" type="radio" name="isPrimaryPhoneNumber" data-role="primaryPhoneNumber[`+actor.model.actorHasPhoneNumbers[i].id.phoneNumberId+`]" placeholder="Is primary phone number">
											<label class="sr-only" for="isPrimaryPhoneNumber"></label>
										</div>
									</div>
									<div class="col-md-3">
									<label class="sr-only">Phone number type*</label>
									<select class="form-control form-control-sm timaat-actordatasets-actor-phonenumbers-phonenumbertype-id" name="phoneNumberTypeId[`+i+`]" data-role="phoneNumberTypeId[`+actor.model.actorHasPhoneNumbers[i].id.phoneNumberId+`]" required>
										<option value="" disabled selected hidden>[Choose phone number type...]</option>
										<option value="1"> </option>
										<option value="2">mobile</option>
										<option value="3">home</option>
										<option value="4">work</option>
										<option value="5">pager</option>
										<option value="6">other</option>
										<option value="7">custom</option>
									</select>
								</div>
								<div class="col-md-6">
									<label class="sr-only">Phone number</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-phonenumbers-phonenumber" name="phoneNumber[`+i+`]" data-role="phoneNumber[`+actor.model.actorHasPhoneNumbers[i].id.phoneNumberId+`]" value="`+actor.model.actorHasPhoneNumbers[i].phoneNumber.phoneNumber+`" maxlength="30" placeholder="[Enter phone number]" aria-describedby="Phone number" required>
								</div>
								<div class="col-md-1 text-center">
									<button class="btn btn-danger" data-role="remove">
										<i class="fas fa-trash-alt"></i>
									</button>
								</div>
							</div>
						</div>`
				);
				var phoneNumber = actor.model.actorHasPhoneNumbers[i];
				if (actor.model.primaryPhoneNumber && actor.model.primaryPhoneNumber.id == phoneNumber.id.phoneNumberId) {
					$('[data-role="primaryPhoneNumber['+phoneNumber.id.phoneNumberId+']"]')
						.prop('checked', true);
				}
				$('[data-role="phoneNumberTypeId['+phoneNumber.id.phoneNumberId+']"]')
					.find('option[value='+phoneNumber.phoneNumberType.id+']')
					.attr('selected', true);
				$('input[name="phoneNumber['+i+']"]').rules("add", { required: true, maxlength: 30});
			}
			if ( action == 'show') {
				$('#timaat-actordatasets-actor-phonenumbers-form :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-phonenumbers-form-edit').show();
				$('#timaat-actordatasets-actor-phonenumbers-form-edit').prop('disabled', false);
				$('#timaat-actordatasets-actor-phonenumbers-form-edit :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-phonenumbers-form-submit').hide();
				$('#timaat-actordatasets-actor-phonenumbers-form-dismiss').hide();
				$('[data-role="new-actorhasphonenumber-fields"').hide();
				$('.phonenumber-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#actorPhoneNumbersLabel').html("Actor phone number list");
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-phonenumbers-form-submit').show();
				$('#timaat-actordatasets-actor-phonenumbers-form-dismiss').show();
				$('#timaat-actordatasets-actor-phonenumbers-form :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-phonenumbers-form-edit').hide();
				$('#timaat-actordatasets-actor-phonenumbers-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-actor-phonenumbers-form-edit :input').prop('disabled', true);
				$('[data-role="new-actorhasphonenumber-fields"').show();
				$('.phonenumber-form-divider').show();
				$('#actorPhoneNumbersLabel').html("Edit Actor phone number list");
				$('#timaat-actordatasets-actor-phonenumbers-form-submit').html("Speichern");
				$('#timaat-actordatasets-metadata-actor-phonenumber').focus();

				// fields for new phone number entry
				$('[data-role="new-actorhasphonenumber-fields"]').append(TIMAAT.ActorDatasets.appendNewPhoneNumberField());
				console.log("TCL: actor", actor);
				$('#timaat-actordatasets-actor-phonenumbers-form').data('actor', actor);
			}
		},

		actorFormMemberOfCollectives: async function(action, type, actor) {
    	console.log("TCL: actorFormMemberOfCollectives: action, type, actor", action, type, actor);
			var node = document.getElementById("dynamic-personismemberofcollective-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			var node = document.getElementById("new-personismemberofcollective-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-actor-memberofcollective-form').trigger('reset');
			actorFormMemberOfCollectivesValidator.resetForm();
			// $('.actor-data-tab').show();
			$('.nav-tabs a[href="#actorMemberOfCollectives"]').focus();
			$('#timaat-actordatasets-actor-memberofcollective-form').show();
			
			// setup UI
			var i = 0;
			switch (type) {
				case 'person':
					var numMemberOfCollectives = actor.model.actorPerson.actorPersonIsMemberOfActorCollectives.length;
					// console.log("TCL: actor.model.actorPerson.actorPersonIsMemberOfActorCollectives", actor.model.actorPerson.actorPersonIsMemberOfActorCollectives);
				break;
				case 'collective':
					var numMemberOfCollectives = actor.model.actorCollective.actorPersonIsMemberOfActorCollectives.length;
          // console.log("TCL: actor.model.actorCollective.actorPersonIsMemberOfActorCollectives", actor.model.actorCollective.actorPersonIsMemberOfActorCollectives);
				break;
			}
			var listType = (type == 'person') ? 'collective' : 'person'; // person needs collective entries and vice versa
			// console.log("TCL: listType", listType);
			for (; i < numMemberOfCollectives; i++) {
				switch (type) {
					case 'person':
						var apimoac = actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i];
						var actorId = apimoac.id.memberOfActorCollectiveActorId;
					break;
					case 'collective':
						var apimoac = actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i];
						var actorId = apimoac.id.actorPersonActorId;
					break;
				}
				var numMembershipDetails;
				if (apimoac.membershipDetails == null) {
					numMembershipDetails = 0;
				} else numMembershipDetails = apimoac.membershipDetails.length;
				let actorName = await TIMAAT.ActorService.getActorName(actorId);
				var editMode = (action == 'edit') ? true : false;
				var memberOfCollectiveFormData = TIMAAT.ActorDatasets.appendMemberOfCollectiveDataset(i, actorId, actorName, apimoac.membershipDetails, 'sr-only', editMode);
				// TODO expand form by membershipDetail information
				$('#dynamic-personismemberofcollective-fields').append(memberOfCollectiveFormData);
				var j = 0;
				for (; j < numMembershipDetails; j++) {
					var apimoacmd = apimoac.membershipDetails[j];
          // console.log("TCL: apimoacmd", apimoacmd);
					if (apimoacmd.joinedAt != null && !(isNaN(apimoacmd.joinedAt)))
						$('[data-role="joinedAt['+actorId+']['+j+']"]').val(moment.utc(apimoacmd.joinedAt).format('YYYY-MM-DD'));
						else $('[data-role="joinedAt['+actorId+']['+j+']"]').val('');
					if (apimoacmd.leftAt != null && !(isNaN(apimoacmd.leftAt)))
						$('[data-role="leftAt['+actorId+']['+j+']"]').val(moment.utc(apimoacmd.leftAt).format('YYYY-MM-DD'));
						else $('[data-role="leftAt['+actorId+']['+j+']"]').val('');
				}
			}
			if ( action == 'show') {
				$('#timaat-actordatasets-actor-memberofcollective-form :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-memberofcollective-form-edit').show();
				$('#timaat-actordatasets-actor-memberofcollective-form-edit').prop('disabled', false);
				$('#timaat-actordatasets-actor-memberofcollective-form-edit :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-memberofcollective-form-submit').hide();
				$('#timaat-actordatasets-actor-memberofcollective-form-dismiss').hide();
				$('[data-role="new-personismemberofcollective-fields"]').hide();
				$('.memberofcollective-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="removeMembershipDetails"]').hide();
				$('[data-role="add"]').hide();
				$('[data-role="addMembershipDetails"]').hide();
				$('[data-role="save"]').hide();
				switch (type) {
					case 'person':
						$('#actorMemberOfCollectiveLabel').html("Person is member of collective list");
						$('#memberLabel').html("Member of collective");
					break;
					case 'collective':
						$('#actorMemberOfCollectiveLabel').html("Collective has member list");
						$('#memberLabel').html("Member");
					break;
				}
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-memberofcollective-form-submit').show();
				$('#timaat-actordatasets-actor-memberofcollective-form-dismiss').show();
				$('#timaat-actordatasets-actor-memberofcollective-form :input').prop('disabled', false);
				$('.timaat-actordatasets-actor-memberofcollective-actor-id').prop('disabled', true);
				$('#timaat-actordatasets-actor-memberofcollective-form-edit').hide();
				$('#timaat-actordatasets-actor-memberofcollective-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-actor-memberofcollective-form-edit :input').prop('disabled', true);
				$('[data-role="new-personismemberofcollective-fields"]').show();
				$('.memberofcollective-form-divider').show();
				switch (type) {
					case 'person':
						$('#actorMemberOfCollectiveLabel').html("Edit person is member of collective list");
						$('#memberLabel').html("Member of collective");
						$('#newMemberLabel').html("Member of collective");
					break;
					case 'collective':
						$('#actorMemberOfCollectiveLabel').html("Edit collective has member list");
						$('#memberLabel').html("Member");
						$('#newMemberLabel').html("Member");
					break;
				}
				// $('#timaat-actordatasets-actor-memberofcollective-form-submit').html("Save");
				$('#actor-select-dropdown').focus();

				// fields for new memberofcollective entry
				$('[data-role="new-personismemberofcollective-fields"]').append(TIMAAT.ActorDatasets.appendNewMemberOfCollectiveFields());
				$('#actor-select-dropdown').select2({
					closeOnSelect: true,
					scrollAfterSelect: true,
					allowClear: true,
					ajax: {
						url: 'api/actor/'+listType+'/selectList/',
						type: 'GET',
						dataType: 'json',
						delay: 250,
						headers: {
							"Authorization": "Bearer "+TIMAAT.Service.token,
							"Content-Type": "application/json",
						},
						// additional parameters
						data: function(params) {
							// console.log("TCL: data: params", params);
							return {
								search: params.term,
								page: params.page
							};          
						},
						processResults: function(data, params) {
							// console.log("TCL: processResults: data", data);
							params.page = params.page || 1;
							return {
								results: data
							};
						},
						cache: true
					},
					minimumInputLength: 0,
				});

				$('.timaat-actordatasets-actor-memberofcollectives-joinedat').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('.timaat-actordatasets-actor-memberofcollectives-leftat').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});

				// console.log("TCL: actor", actor);
				$('#timaat-actordatasets-actor-memberofcollective-form').data('actor', actor);
			}
		},

		actorFormRoles: async function(action, actor) {
			console.log("TCL: actorFormRoles: action, actor", action, actor);
			var node = document.getElementById("dynamic-actorhasrole-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-actor-roles-form').trigger('reset');
			// actorFormRolesValidator.resetForm();
			$('.nav-tabs a[href="#actorRoles"]').focus();
			$('#timaat-actordatasets-actor-role-form').show();

			$('#dynamic-actorhasrole-fields').append(TIMAAT.ActorDatasets.appendActorHasRolesDataset());
			$('#actorroles-multi-select-dropdown').select2({
				closeOnSelect: false,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/role/selectList/',
					type: 'GET',
					dataType: 'json',
					delay: 250,
					headers: {
						"Authorization": "Bearer "+TIMAAT.Service.token,
						"Content-Type": "application/json",
					},
					// additional parameters
					data: function(params) {
						// console.log("TCL: data: params", params);
						return {
							search: params.term,
							page: params.page
						};          
					},
					processResults: function(data, params) {
						// console.log("TCL: processResults: data", data);
						params.page = params.page || 1;
						return {
							results: data
						};
					},
					cache: true
				},
				minimumInputLength: 0,
			});
			var roleSelect = $('#actorroles-multi-select-dropdown');
			await TIMAAT.ActorService.getActorHasRoleList(actor.model.id).then(function(data) {
				console.log("TCL: then: data", data);
				if (data.length > 0) {
					data.sort((a, b) => (a.roleTranslations[0].name > b.roleTranslations[0].name)? 1 : -1);
					// create the options and append to Select2
					var i = 0;
					for (; i < data.length; i++) {
						var option = new Option(data[i].roleTranslations[0].name, data[i].id, true, true);
						roleSelect.append(option).trigger('change');
					}
					// manually trigger the 'select2:select' event
					roleSelect.trigger({
						type: 'select2:select',
						params: {
							data: data
						}
					});
				}
			});

			if ( action == 'show') {
				$('#timaat-actordatasets-actor-role-form :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-role-form-edit').show();
				$('#timaat-actordatasets-actor-role-form-edit').prop('disabled', false);
				$('#timaat-actordatasets-actor-role-form-edit :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-role-form-submit').hide();
				$('#timaat-actordatasets-actor-role-form-dismiss').hide();
				$('.actorroles-form-divider').hide();
				$('[data-role="save"]').hide();
				$('#actorRolesLabel').html("Actor has role(s) list");
			}
			else if (action == 'edit') {
				$('#timaat-actordatasets-actor-role-form :input').prop('disabled', false);
				$('#timaat-actordatasets-actor-role-form-edit').hide();
				$('#timaat-actordatasets-actor-role-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-actor-role-form-edit :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-role-form-submit').show();
				$('#timaat-actordatasets-actor-role-form-dismiss').show();
				$('#timaat-actordatasets-actor-role-form-submit').html("Speichern");
				$('.actorroles-form-divider').show();
				$('#actorRolesLabel').html("Edit actor roles list");
				$('#actorroles-multi-select-dropdown').focus();

				// console.log("TCL: actor", actor);
				$('#timaat-actordatasets-actor-role-form').data('actor', actor);
			}
		},

		actorFormRoleMedium: async function(action, actor) {
			console.log("TCL: actorFormRoleMedium: action, actor", action, actor);
			var node = document.getElementById("dynamic-actorroleinmedium-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
			$('#timaat-actordatasets-actor-role-medium-form').trigger('reset');
			// actorFormRolesValidator.resetForm();
			$('.nav-tabs a[href="#actorRoleMedium"]').focus();
			var actorIsProducer = false;
			var i = 0;
			for (; i < actor.model.roles.length; i++) {
				if (actor.model.roles[i].id == 5) {
					actorIsProducer = true;
          console.log("TCL: actorIsProducer", actorIsProducer);
				}	
			}	
			if (actorIsProducer) {
				$('#timaat-actordatasets-actor-role-medium-form').show();
				$('.form-subheader').show();

				$('#dynamic-actorroleinmedium-fields').append(TIMAAT.ActorDatasets.appendActorRoleInMediumDataset());
				$('#actorrolemedium-multi-select-dropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: false,
					allowClear: true,
					ajax: {
						url: 'api/medium/video/selectList/',
						type: 'GET',
						dataType: 'json',
						delay: 250,
						headers: {
							"Authorization": "Bearer "+TIMAAT.Service.token,
							"Content-Type": "application/json",
						},
						// additional parameters
						data: function(params) {
							// console.log("TCL: data: params", params);
							return {
								search: params.term,
								page: params.page
							};          
						},
						processResults: function(data, params) {
							// console.log("TCL: processResults: data", data);
							params.page = params.page || 1;
							return {
								results: data
							};
						},
						cache: true
					},
					minimumInputLength: 0,
				});
				var roleMediumSelect = $('#actorrolemedium-multi-select-dropdown');
				await TIMAAT.ActorService.getActorRoleInMediumList(actor.model.id, 5).then(function(data) { // TODO 5 = Producer
					console.log("TCL: then: data", data);
					if (data.length > 0) {
						data.sort((a, b) => (a.displayTitle.name > b.displayTitle.name)? 1 : -1);
						// create the options and append to Select2
						var i = 0;
						for (; i < data.length; i++) {
							var option = new Option(data[i].displayTitle.name, data[i].id, true, true);
							roleMediumSelect.append(option).trigger('change');
						}
						// manually trigger the 'select2:select' event
						roleMediumSelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					}
				});

				if ( action == 'show') {
					$('#timaat-actordatasets-actor-role-medium-form :input').prop('disabled', true);
					$('#timaat-actordatasets-actor-role-medium-form-edit').show();
					$('#timaat-actordatasets-actor-role-medium-form-edit').prop('disabled', false);
					$('#timaat-actordatasets-actor-role-medium-form-edit :input').prop('disabled', false);
					$('#timaat-actordatasets-actor-role-medium-form-submit').hide();
					$('#timaat-actordatasets-actor-role-medium-form-dismiss').hide();
					$('.actorrolemedium-form-divider').hide();
					$('[data-role="save"]').hide();
					$('#actorRoleMediumLabel').html("Actor has role in medium list");
				}
				else if (action == 'edit') {
					$('#timaat-actordatasets-actor-role-medium-form :input').prop('disabled', false);
					$('#timaat-actordatasets-actor-role-medium-form-edit').hide();
					$('#timaat-actordatasets-actor-role-medium-form-edit').prop('disabled', true);
					$('#timaat-actordatasets-actor-role-medium-form-edit :input').prop('disabled', true);
					$('#timaat-actordatasets-actor-role-medium-form-submit').show();
					$('#timaat-actordatasets-actor-role-medium-form-dismiss').show();
					$('#timaat-actordatasets-actor-role-medium-form-submit').html("Speichern");
					$('.actorrolemedium-form-divider').show();
					$('#actorRoleMediumLabel').html("Edit actor has role in medium list");
					$('#actorrolemedium-multi-select-dropdown').focus();

					// console.log("TCL: actor", actor);
					$('#timaat-actordatasets-actor-role-medium-form').data('actor', actor);
				}
			} else {
				$('#timaat-actordatasets-actor-role-medium-form').show();
				$('.form-subheader').hide();
				$('#timaat-actordatasets-actor-role-medium-form-edit').hide();
				$('#timaat-actordatasets-actor-role-medium-form-edit').prop('disabled', true);
				$('#timaat-actordatasets-actor-role-medium-form-edit :input').prop('disabled', true);
				$('#timaat-actordatasets-actor-role-medium-form-submit').hide();
				$('#timaat-actordatasets-actor-role-medium-form-dismiss').hide();
				$('#actorRoleMediumLabel').html("Actor is no Producer");
			}
		},

		showLastForm: function() {
			switch (TIMAAT.ActorDatasets.lastForm) {
				case 'names':
					TIMAAT.ActorDatasets.actorFormNames('show', $('#timaat-actordatasets-metadata-form').data('actor'));
				break;
				case 'addresses':
					TIMAAT.ActorDatasets.actorFormAddresses('show', $('#timaat-actordatasets-metadata-form').data('actor'));
				break;
				case 'emailAddresses':
					TIMAAT.ActorDatasets.actorFormEmailAddresses('show', $('#timaat-actordatasets-metadata-form').data('actor'));
				break;
				case 'phoneNumbers':
					TIMAAT.ActorDatasets.actorFormPhoneNumbers('show', $('#timaat-actordatasets-metadata-form').data('actor'));
				break;
				case 'memberOfCollectives':
					var actor = $('#timaat-actordatasets-metadata-form').data('actor');
					var type = actor.model.actorType.actorTypeTranslations[0].type;
					TIMAAT.ActorDatasets.actorFormMemberOfCollectives('show', type, $('#timaat-actordatasets-metadata-form').data('actor'));
				break;
				case 'roles':
					TIMAAT.ActorDatasets.actorFormRoles('show', $('#timaat-actordatasets-metadata-form').data('actor'));
				break;
				case 'roleMedium':
					TIMAAT.ActorDatasets.actorFormRoleMedium('show', $('#timaat-actordatasets-metadata-form').data('actor'));
				break;
			}
		},

		createActor: async function(actorType, actorModel, actorSubtypeModel, displayNameModel, actorSubtypeTranslationModel, citizenshipModel) {
			console.log("TCL: createActor: async function(actorType, actorModel, actorSubtypeModel, displayNameModel, actorSubtypeTranslationModel, citizenshipModel)", 
									actorType, actorModel, actorSubtypeModel, displayNameModel, actorSubtypeTranslationModel, citizenshipModel);
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
				displayNameModel.actor.id = newActorModel.id;
				var newDisplayName = await TIMAAT.ActorService.addName(newActorModel.id, displayNameModel);
        console.log("TCL: newDisplayName", newDisplayName);
				newActorModel.displayName = newDisplayName;
				newActorModel.birthName = newDisplayName;
				newActorModel.actorNames[0] = newDisplayName;
        console.log("TCL: newActorModel", newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			}

			try {
				// update display and birth name in actor
				await TIMAAT.ActorService.updateActor(newActorModel);
				console.log("TCL: newActorModel", newActorModel);
			} catch(error) {
				console.log( "error: ", error);
			}

			try {
				// create actorSubtype with actor id
				actorSubtypeModel.actorId = newActorModel.id;
				if (actorType == 'person') {
					actorSubtypeModel.placeOfBirth = null; // TODO implement
					actorSubtypeModel.placeOfDeath = null; // TODO implement
				}
				var newActorSubtypeModel = await TIMAAT.ActorService.createActorSubtype(actorType, newActorModel, actorSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			}

			try {
				// create person translation with person id
				if (actorType == "person" && actorSubtypeTranslationModel != null) {
					var newActorPersonModelTranslation = await TIMAAT.ActorService.createActorPersonTranslation(newActorModel, actorSubtypeTranslationModel[0]); // TODO more than one translation?
					actorSubtypeModel.actorPersonTranslations[0] = newActorPersonModelTranslation;
				}
			} catch(error) {
				console.log( "error: ", error);
			}

			try {
				// create person_has_citizenship with person id
				if (actorType == "person" && citizenshipModel != null) {
          console.log("TCL: citizenshipModel", citizenshipModel);
					var addedCitizenshipModel = await TIMAAT.ActorService.addCitizenship(newActorModel.id, citizenshipModel); // TODO more than one citizenship
					// var addedCitizenshipModel = await TIMAAT.ActorService.addCitizenship(newActorModel.id, newCitizenshipModel); // <- once createCitizenship is used again
					actorSubtypeModel.citizenships[0] = addedCitizenshipModel;
				}
			} catch(error) {
				console.log( "error: ", error);
			}

			try {
				// push new actor to dataset model
				switch (actorType) {
					case 'person':
						newActorModel.actorPerson = actorSubtypeModel;
					break;
					case 'collective':
						newActorModel.actorCollective = actorSubtypeModel;
					break;
				}
				// console.log("TCL: newActorModel", newActorModel);
				// await TIMAAT.ActorDatasets._actorAdded(actorType, newActorModel); //* commented out with datatables
			} catch(error) {
				console.log( "error: ", error);
			}
			return (newActorModel);
		},

		// createName: async function(nameModel) {
		// 	// console.log("TCL: createName: async function -> nameModel", nameModel);
		// 	try {
		// 		// create name
		// 		var newNameModel = await TIMAAT.ActorService.createName(nameModel.model);
    //     // console.log("TCL: newNameModel", newNameModel);
		// 	} catch(error) {
		// 		console.log( "error: ", error);
		// 	}
		// },

		addNames: async function(actor, newNames) {
			console.log("TCL: addNames: async function -> actor, newNames", actor, newNames);
			try {
				// create name
				var i = 0;
				for (; i < newNames.length; i++) {
					// var newName = await TIMAAT.ActorService.createName(newNames[i]);
					var addedNameModel = await TIMAAT.ActorService.addName(actor.model.id, newNames[i]);
					actor.model.actorNames.push(addedNameModel);
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		addActorHasAddresses: async function(actor, newActorHasAddresses) {
			console.log("TCL: addActorHasAddresses: async function -> actor, newActorHasAddresses", actor, newActorHasAddresses);
			try {
				// create address
				var i = 0;
				for (; i < newActorHasAddresses.length; i++) {
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

		addActorHasEmailAddresses: async function(actor, newActorHasEmailAddresses) {
			console.log("TCL: addActorHasEmailAddresses: async function -> actor, newActorHasEmailAddresses", actor, newActorHasEmailAddresses);
			try {
				// create email address
				var i = 0;
				for (; i < newActorHasEmailAddresses.length; i++) {
					// modify models for backend
					var tempEmailAddress = newActorHasEmailAddresses[i].emailAddress;
					var tempActorHasEmailAddress = newActorHasEmailAddresses[i];
					delete tempActorHasEmailAddress.emailAddress;
					
					var addedEmailAddressModel = await TIMAAT.ActorService.addEmailAddress(actor.model.id, tempEmailAddress);
					var addedActorHasEmailAddressModel = await TIMAAT.ActorService.updateActorHasEmailAddress(actor.model.id, addedEmailAddressModel.id, tempActorHasEmailAddress);
					addedActorHasEmailAddressModel.emailAddress = {};
					addedActorHasEmailAddressModel.emailAddress = addedEmailAddressModel;
					actor.model.actorHasEmailAddresses.push(addedActorHasEmailAddressModel);
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		addActorHasPhoneNumbers: async function(actor, newActorHasPhoneNumbers) {
			console.log("TCL: addActorHasPhoneNumbers: async function -> actor, newActorHasPhoneNumbers", actor, newActorHasPhoneNumbers);
			try {
				// create phone number
				var i = 0;
				for (; i < newActorHasPhoneNumbers.length; i++) {
					// modify models for backend
					var tempPhoneNumber = newActorHasPhoneNumbers[i].phoneNumber;
					var tempActorHasPhoneNumber = newActorHasPhoneNumbers[i];
					delete tempActorHasPhoneNumber.phoneNumber;
					
					var addedPhoneNumberModel = await TIMAAT.ActorService.addPhoneNumber(actor.model.id, tempPhoneNumber);
					var addedActorHasPhoneNumberModel = await TIMAAT.ActorService.updateActorHasPhoneNumber(actor.model.id, addedPhoneNumberModel.id, tempActorHasPhoneNumber);
					addedActorHasPhoneNumberModel.phoneNumber = {};
					addedActorHasPhoneNumberModel.phoneNumber = addedPhoneNumberModel;
					actor.model.actorHasPhoneNumbers.push(addedActorHasPhoneNumberModel);
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		addPersonIsMemberOfCollective: async function(actor, personIsMemberOfCollectiveData) {
			console.log("TCL: addPersonIsMemberOfCollective: async function -> actor, personIsMemberOfCollectiveData", actor, personIsMemberOfCollectiveData);
			try {
				// create memberofcollective
				// TODO create and add membershipDetails
				//? create model?
				var newPersonIsMemberOfCollective = await TIMAAT.ActorService.addPersonIsMemberOfCollective(personIsMemberOfCollectiveData.actorId, personIsMemberOfCollectiveData.collectiveId);
				console.log("TCL: newPersonIsMemberOfCollective", newPersonIsMemberOfCollective);
				var i = 0;
				for (; i < personIsMemberOfCollectiveData.membershipDetails.length; i++) {
					var newDetails = await TIMAAT.ActorService.addMembershipDetails(personIsMemberOfCollectiveData.actorId, personIsMemberOfCollectiveData.collectiveId, personIsMemberOfCollectiveData.membershipDetails[i]);
          console.log("TCL: newDetails", newDetails);
					newPersonIsMemberOfCollective.membershipDetails.push(newDetails);
				}
				console.log("TCL: newPersonIsMemberOfCollective", newPersonIsMemberOfCollective);
				switch (actor.model.actorType.actorTypeTranslations[0].type) {
					case 'person':
						actor.model.actorPerson.actorPersonIsMemberOfActorCollectives.push(newPersonIsMemberOfCollective);
					break;
					case 'collective':
						actor.model.actorCollective.actorPersonIsMemberOfActorCollectives.push(newPersonIsMemberOfCollective);
					break;
				}
				
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		updateActor: async function(actorSubtype, actor, imageIdList) {
			console.log("TCL: updateActor: async function: ", actorSubtype, actor, imageIdList);
				try {
					// update birthname
					if (actor.model.birthName) { // actor initially has no birth name set
						var tempBirthName = await TIMAAT.ActorService.updateName(actor.model.birthName);
						actor.model.birthName = tempBirthName;
					}
					// update displayname
					var tempDisplayName = await TIMAAT.ActorService.updateName(actor.model.displayName);
					actor.model.displayName = tempDisplayName;
					// update primary address
					if (actor.model.primaryAddress) { // actor initially has no primary address set
						var tempPrimaryAddress = await TIMAAT.ActorService.updateAddress(actor.model.primaryAddress);
						actor.model.primaryAddress = tempPrimaryAddress;
					}
					// update primary email address
					if (actor.model.primaryEmailAddress) { // actor initially has no primary email address set
						var tempPrimaryEmailAddress = await TIMAAT.ActorService.updateEmailAddress(actor.model.primaryEmailAddress);
						actor.model.primaryEmailAddress = tempPrimaryEmailAddress;
					}
					// update phone number address
					if (actor.model.primaryPhoneNumber) { // actor initially has no primaryphone number set
						var tempPrimaryPhoneNumber = await TIMAAT.ActorService.updatePhoneNumber(actor.model.primaryPhoneNumber);
						actor.model.primaryPhoneNumber = tempPrimaryPhoneNumber;
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
							tempSubtypeModel.placeOfBirth = null;
							tempSubtypeModel.placeOfDeath = null;
						break;
						case 'collective':
							tempSubtypeModel = actor.model.actorCollective;
						break;
					}
					// console.log("TCL: tempSubtypeModel", tempSubtypeModel);
					var tempActorSubtypeModel = await TIMAAT.ActorService.updateActorSubtype(actorSubtype, tempSubtypeModel);
				} catch(error) {
					console.log( "error: ", error);
				}

				try {
					switch (actorSubtype) {
						case 'person':
							// update data that is part of person translation
							// TODO: send request for each translation or for all translations
							var tempActorPersonTranslation = await TIMAAT.ActorService.updateActorPersonTranslation(actor.model.id, actor.model.actorPerson.actorPersonTranslations[0]);
							if (actor.model.actorPerson.citizenships.length > 0) {
								var tempActorPersonCitizenshipTranslation = await TIMAAT.ActorService.updateCitizenshipTranslation(actor.model.actorPerson.citizenships[0].citizenshipTranslations[0], actor.model.actorPerson.citizenships[0].citizenshipTranslations[0].language.id);
							}
						break;
					}
				} catch(error) {
					console.log( "error: ", error);
				};

				try { // update actor_has_medium_image table entries
					var existingActorHasImageEntries = await TIMAAT.ActorService.getActorHasImageList(actor.model.id);
					console.log("TCL: existingActorHasImageEntries", existingActorHasImageEntries);
					console.log("TCL: imageIdList", imageIdList);
					if (imageIdList == null) { //* all entries will be deleted
						// console.log("TCL: delete all existingActorHasImageEntries: ", existingActorHasImageEntries);
						actor.model.profileImages = [];
						await TIMAAT.ActorService.updateActor(actor.model);        
					} else if (existingActorHasImageEntries.length == 0) { //* all entries will be added
						// console.log("TCL: add all imageIdList: ", imageIdList);
						var i = 0;
						for (; i < imageIdList.length; i++ ) {
							actor.model.profileImages.push(imageIdList[i]);
						}
						console.log("TCL: actor.model.profileImages", actor.model.profileImages);
						await TIMAAT.ActorService.updateActor(actor.model);          
					} else { //* add/remove entries
						// delete removed entries
						var actorHasImageEntriesToDelete = [];
						var i = 0;
						for (; i < existingActorHasImageEntries.length; i++) {
							var deleteId = true;
							var item = {};
							var j = 0;
							for (; j < imageIdList.length; j++) {
								if (existingActorHasImageEntries[i].mediumId == imageIdList[j]) {
									deleteId = false;
									break; // no need to check further if match was found
								}
							}
							if (deleteId) { // id is in existingActorHasImageEntries but not in imageIdList
								// console.log("TCL: delete entry: ", existingActorHasImageEntries[i]);
								item = existingActorHasImageEntries[i];
								actorHasImageEntriesToDelete.push(item);
								existingActorHasImageEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
								i--; // so the next list item is not jumped over due to the splicing
							}
						}
						
						// console.log("TCL: actorHasImageEntriesToDelete", actorHasImageEntriesToDelete);
						if (actorHasImageEntriesToDelete.length > 0) { // anything to delete?
							var i = 0;
							for (; i < actorHasImageEntriesToDelete.length; i++) {
								var index = actor.model.profileImages.findIndex(({mediumId}) => mediumId === actorHasImageEntriesToDelete[i].mediumId);
								actor.model.profileImages.splice(index,1);
							}
							// console.log("TCL: actor.model.profileImages", actor.model.profileImages);
							await TIMAAT.ActorService.updateActor(actor.model);
						}
	
						// create new entries
						var idsToCreate = [];
						i = 0;
						for (; i < imageIdList.length; i++) {
							// console.log("TCL: imageIdList", imageIdList);
							var idExists = false;
							var j = 0;
							for (; j < existingActorHasImageEntries.length; j++) {
								// console.log("TCL: existingActorHasImageEntries", existingActorHasImageEntries);
								if (imageIdList[i] == existingActorHasImageEntries[j].mediumId) {
									idExists = true;
									break; // no need to check further if match was found
								}
							}
							if (!idExists) {
								idsToCreate.push(imageIdList[i]);
							}
						}
						// console.log("TCL: idsToCreate", idsToCreate);
						if (idsToCreate.length > 0) { // anything to add?
							// console.log("TCL: idsToCreate", idsToCreate);
							var i = 0;
							for (; i < idsToCreate.length; i++) {
								actor.model.profileImages.push(idsToCreate[i]);
							}
							// console.log("TCL: actor.model.profileImages", actor.model.profileImages);
							await TIMAAT.ActorService.updateActor(actor.model);
						}
					}
				} catch(error) {
					console.log( "error: ", error);
				};
	
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
				// actor.updateUI();
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

		updateActorHasEmailAddress: async function(actorHasEmailAddress, actor) {
			console.log("TCL: updateActorHasEmailAddress: async function -> actorHasEmailAddress at beginning of update process: ", actorHasEmailAddress, actor);
			try {
				// update address
				var tempActorHasEmailAddress = actorHasEmailAddress;
				var tempEmailAddress = actorHasEmailAddress.emailAddress;
				// modify models for backend
				delete tempActorHasEmailAddress.emailAddress;
				var updatedTempEmailAddress = await TIMAAT.ActorService.updateEmailAddress(tempEmailAddress);
				tempActorHasEmailAddress.id.actorId = actor.model.id;
				tempActorHasEmailAddress.id.emailAddressId = updatedTempEmailAddress.id;
				var updatedTempActorHasEmailAddress = await TIMAAT.ActorService.updateActorHasEmailAddress(actorHasEmailAddress.id.actorId, actorHasEmailAddress.id.emailAddressId, tempActorHasEmailAddress);
				updatedTempActorHasEmailAddress.emailAddress = updatedTempEmailAddress;

				var i = 0;
				for (; i < actor.model.actorHasEmailAddresses.length; i++) {
					if (actor.model.actorHasEmailAddresses[i].id == actorHasEmailAddress.id)
						actor.model.actorHasEmailAddresses[i] = updatedTempActorHasEmailAddress;
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		updateActorHasPhoneNumber: async function(actorHasPhoneNumber, actor) {
			console.log("TCL: updateActorHasPhoneNumber: async function -> actorHasPhoneNumber at beginning of update process: ", actorHasPhoneNumber, actor);
			try {
				// update address
				var tempActorHasPhoneNumber = actorHasPhoneNumber;
				var tempPhoneNumber = actorHasPhoneNumber.phoneNumber;
				// modify models for backend
				delete tempActorHasPhoneNumber.phoneNumber;
				var updatedTempPhoneNumber = await TIMAAT.ActorService.updatePhoneNumber(tempPhoneNumber);
				tempActorHasPhoneNumber.id.actorId = actor.model.id;
				tempActorHasPhoneNumber.id.phoneNumberId = updatedTempPhoneNumber.id;
				var updatedTempActorHasPhoneNumber = await TIMAAT.ActorService.updateActorHasPhoneNumber(actorHasPhoneNumber.id.actorId, actorHasPhoneNumber.id.phoneNumberId, tempActorHasPhoneNumber);
				updatedTempActorHasPhoneNumber.phoneNumber = updatedTempPhoneNumber;

				var i = 0;
				for (; i < actor.model.actorHasPhoneNumbers.length; i++) {
					if (actor.model.actorHasPhoneNumbers[i].id == actorHasPhoneNumber.id)
						actor.model.actorHasPhoneNumbers[i] = updatedTempActorHasPhoneNumber;
				}
			} catch(error) {
				console.log( "error: ", error);
			}
		},

		//? not in use
		// updatePersonIsMemberOfCollective: async function(actor, actorId, personIsMemberOfCollectiveData) {
		// 	console.log("TCL: updatePersonIsMemberOfCollective: async function -> personIsMemberOfCollective at beginning of update process: ", actor, actorId, personIsMemberOfCollectiveData);
		// 	try {
		// 		// update memberofcollective
		// 		var updatedPersonIsMemberOfCollective = await TIMAAT.ActorService.updatePersonIsMemberOfCollective(actor.model.id, actorId, personIsMemberOfCollectiveData);
		// 		var i = 0;
		// 		for (; i < actor.model.actorPerson.actorPersonIsMemberOfActorCollectives.length; i++) {
		// 			if (actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i].id.memberOfActorCollectiveActorId == personIsMemberOfCollectiveData.id.memberOfActorCollectiveActorId) {
		// 				actor.model.actorPerson.actorPersonIsMemberOfActorCollectives[i] = updatedPersonIsMemberOfCollective;
		// 			}
		// 		}
		// 	} catch(error) {
		// 		console.log( "error: ", error);
		// 	}
		// },

		updateActorHasRole: async function(actorModel, roleIdList) {
    console.log("TCL: actorModel, roleIdList", actorModel, roleIdList);
			try { // update actor_has_role table entries
        var existingActorHasRoleEntries = await TIMAAT.ActorService.getActorHasRoleList(actorModel.id);
        // console.log("TCL: existingActorHasRoleEntries", existingActorHasRoleEntries);
        // console.log("TCL: roleIdList", roleIdList);
        if (roleIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all existingActorHasRoleEntries: ", existingActorHasRoleEntries);
					actorModel.roles = [];
					await TIMAAT.ActorService.updateActor(actorModel);        
        } else if (existingActorHasRoleEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all roleIdList: ", roleIdList);
					actorModel.roles = roleIdList;
					await TIMAAT.ActorService.updateActor(actorModel);          
        } else { //* add/remove entries
          // delete removed entries
          var actorHasRoleEntriesToDelete = [];
          var i = 0;
          for (; i < existingActorHasRoleEntries.length; i++) {
            var deleteId = true;
            var item = {};
            var j = 0;
            for (; j < roleIdList.length; j++) {
              if( existingActorHasRoleEntries[i].id == roleIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingActorHasRoleEntries but not in roleIdList
              // console.log("TCL: delete entry: ", existingActorHasRoleEntries[i]);
              item = existingActorHasRoleEntries[i];
              actorHasRoleEntriesToDelete.push(item);
              existingActorHasRoleEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
					}
					
          // console.log("TCL: actorHasRoleEntriesToDelete", actorHasRoleEntriesToDelete);
          if (actorHasRoleEntriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < actorHasRoleEntriesToDelete.length; i++) {
							var index = actorModel.roles.findIndex(({id}) => id === actorHasRoleEntriesToDelete[i].id);
							actorModel.roles.splice(index,1);
						}
						await TIMAAT.ActorService.updateActor(actorModel);
          }

          // create new entries
          var idsToCreate = [];
          i = 0;
          for (; i < roleIdList.length; i++) {
            // console.log("TCL: roleIdList", roleIdList);
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingActorHasRoleEntries.length; j++) {
              // console.log("TCL: existingActorHasRoleEntries", existingActorHasRoleEntries);
              if (roleIdList[i].id == existingActorHasRoleEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = roleIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							actorModel.roles.push(idsToCreate[i]);
							await TIMAAT.ActorService.updateActor(actorModel);
						}
          }
        }
      } catch(error) {
        console.log( "error: ", error);
      };
      
			TIMAAT.ActorDatasets.refreshDatatable(actorModel.actorType.actorTypeTranslations[0].type);
			TIMAAT.ActorDatasets.selectLastSelection(actorModel.actorType.actorTypeTranslations[0].type, actorModel.id);
		},

		// TODO currently only for Producer.
		updateActorRoleInMedium: async function(actorModel, mediumIdList, roleId) {
			console.log("TCL: actorModel, mediumIdList, roleId", actorModel, mediumIdList, roleId);
				try { // update actor_has_role table entries
					var existingActorRoleInMediumEntries = await TIMAAT.ActorService.getActorRoleInMediumList(actorModel.id, roleId);
					// console.log("TCL: existingActorRoleInMediumEntries", existingActorRoleInMediumEntries);
					// console.log("TCL: mediumIdList", mediumIdList);
					if (mediumIdList == null) { //* all entries will be deleted
						// console.log("TCL: delete all existingActorRoleInMediumEntries: ", existingActorRoleInMediumEntries);
						var i = 0;
						for (; existingActorRoleInMediumEntries.length; i++) {
							await TIMAAT.MediaService.removeRoleFromMediumHasActorWithRoles(existingActorRoleInMediumEntries[i].id, actorModel.id, roleId);
						}
					} else if (existingActorRoleInMediumEntries.length == 0) { //* all entries will be added
						// console.log("TCL: add all mediumIdList: ", mediumIdList);
						var i = 0;
						for (; mediumIdList.length; i++) {
							await TIMAAT.MediaService.addMediumHasActorWithRoles(mediumIdList[i].id, actorModel.id, roleId);
						}
					} else { //* add/remove entries
						// delete removed entries
						var actorRoleInMediumEntriesToDelete = [];
						var i = 0;
						for (; i < existingActorRoleInMediumEntries.length; i++) {
							var deleteId = true;
							var item = {};
							var j = 0;
							for (; j < mediumIdList.length; j++) {
								if( existingActorRoleInMediumEntries[i].id == mediumIdList[j].id) {
									deleteId = false;
									break; // no need to check further if match was found
								}
							}
							if (deleteId) { // id is in existingActorRoleInMediumEntries but not in mediumIdList
								// console.log("TCL: delete entry: ", existingActorRoleInMediumEntries[i]);
								item = existingActorRoleInMediumEntries[i];
								actorRoleInMediumEntriesToDelete.push(item);
								existingActorRoleInMediumEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
								i--; // so the next list item is not jumped over due to the splicing
							}
						}
						
						// console.log("TCL: actorRoleInMediumEntriesToDelete", actorRoleInMediumEntriesToDelete);
						if (actorRoleInMediumEntriesToDelete.length > 0) { // anything to delete?
							var i = 0;
							for (; i < actorRoleInMediumEntriesToDelete.length; i++) {
								await TIMAAT.MediaService.removeRoleFromMediumHasActorWithRoles(actorRoleInMediumEntriesToDelete[i].id, actorModel.id, roleId);
							}
						}
	
						// create new entries
						var idsToCreate = [];
						i = 0;
						for (; i < mediumIdList.length; i++) {
							// console.log("TCL: mediumIdList", mediumIdList);
							var idExists = false;
							var item = { id: 0 };
							var j = 0;
							for (; j < existingActorRoleInMediumEntries.length; j++) {
								// console.log("TCL: existingActorRoleInMediumEntries", existingActorRoleInMediumEntries);
								if (mediumIdList[i].id == existingActorRoleInMediumEntries[j].id) {
									idExists = true;
									break; // no need to check further if match was found
								}
							}
							if (!idExists) {
								item.id = mediumIdList[i].id;
								idsToCreate.push(item);
							}
						}
						// console.log("TCL: idsToCreate", idsToCreate);
						if (idsToCreate.length > 0) { // anything to add?
							// console.log("TCL: idsToCreate", idsToCreate);
							var i = 0;
							for (; i < idsToCreate.length; i++) {
								await TIMAAT.MediaService.addMediumHasActorWithRoles(idsToCreate[i].id, actorModel.id, roleId);
							}
						}
					}
				} catch(error) {
					console.log( "error: ", error);
				};
				TIMAAT.MediaDatasets.refreshDatatable('medium');
				TIMAAT.MediaDatasets.refreshDatatable('video');
		},

		updateActorHasTagsList: async function(actorModel, tagIdList) {
    	console.log("TCL: actorModel, tagIdList", actorModel, tagIdList);
			try {
				var existingActorHasTagsEntries = await TIMAAT.ActorService.getTagList(actorModel.id);
        console.log("TCL: existingActorHasTagsEntries", existingActorHasTagsEntries);
				if (tagIdList == null) { //* all entries will be deleted
					actorModel.tags = [];
					await TIMAAT.ActorService.updateActor(actorModel);
				} else if (existingActorHasTagsEntries.length == 0) { //* all entries will be added
					actorModel.tags = tagIdList;
					await TIMAAT.ActorService.updateActor(actorModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingActorHasTagsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < tagIdList.length; j++) {
							if (existingActorHasTagsEntries[i].id == tagIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingActorHasTagEntries but not in tagIdList
              console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingActorHasTagsEntries[i]);
							existingActorHasTagsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = actorModel.tags.findIndex(({id}) => id === entriesToDelete[i].id);
							actorModel.tags.splice(index,1);
							await TIMAAT.ActorService.removeTag(actorModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing tags
					var idsToCreate = [];
          i = 0;
          for (; i < tagIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingActorHasTagsEntries.length; j++) {
              if (tagIdList[i].id == existingActorHasTagsEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = tagIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							actorModel.tags.push(idsToCreate[i]);
							await TIMAAT.ActorService.addTag(actorModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.log( "error: ", error);
			}
			return actorModel;
		},

		createNewTagsAndAddToActor: async function(actorModel, newTagList) {
			var i = 0;
			for (; i < newTagList.length; i++) {
				newTagList[i] = await TIMAAT.Service.createTag(newTagList[i].name);
				await TIMAAT.ActorService.addTag(actorModel.id, newTagList[i].id);
				actorModel.tags.push(newTagList[i]);
			}
			return actorModel;
		},

		_actorRemoved: async function(actor) {
			console.log("TCL: actor", actor);
			// remove all citizenships from actorPerson
			// TODO check if this can be solved via CASCADE
			if (actor.model.actorType.actorTypeTranslations[0].type == "person") {
				try {
					var i = 0;
					for (; i < actor.model.actorPerson.citizenships.length; i++ ) { // remove obsolete citizenships
						TIMAAT.ActorService.removeCitizenship(actor.model.actorPerson.citizenships[i]);
						actor.model.actorPerson.citizenships.splice(i,1);
					}
				} catch (error) {
					console.log("error:", error);
				}
			}
			if (actor.model.actorType.actorTypeTranslations[0].type == "collective") {
				try {
					// delete actorPersonIsMemberOfActorCollectives information from currently loaded actorPersons // TODO
					var i = 0;
					for (; i < actor.model.actorCollective.actorPersonIsMemberOfActorCollectives.length; i++) {
						await TIMAAT.ActorService.removeMemberOfCollective(actor.model.actorCollective.actorPersonIsMemberOfActorCollectives[i]);
					}
				} catch (error) {
					console.log("error:", error);
				}
			}
			// sync to server
			try {
				await TIMAAT.ActorService.removeActor(actor);
			} catch (error) {
				console.log("error: ", error);
			}
			actor.remove();
		},

		updateActorModelData: function(actorModel, formDataObject) {
		// console.log("TCL: updateActorModelData: actor, formDataObject", actor, formDataObject);
			// actor data
			actorModel.isFictional = formDataObject.isFictional;
			// displayName data
			actorModel.displayName.name = formDataObject.displayName;
			actorModel.displayName.usedFrom = formDataObject.nameUsedFrom;
			actorModel.displayName.usedUntil = formDataObject.nameUsedUntil;
			var i = 0;
			for (; i < actorModel.actorNames.length; i++) {
				if (actorModel.actorNames[i].id == actorModel.displayName.id) {
					actorModel.actorNames[i] = actorModel.displayName;
					break;
				}
			}
			// i = 0;
			// actorModel.profileImages = {};
			// for (; i < profileImageList.length; i++) {
			// 	actorModel.profileImages[i].mediumId = profileImageList[i];
			// }
      console.log("TCL: actorModel", actorModel);
			return actorModel;
		},

		createActorModel: async function(actorType, formDataObject) {
   	//  console.log("TCL: actorType, formDataObject", actorType, formDataObject);
			let typeId = 0;
			switch (actorType) {
				case 'person':
					typeId = 1;
				break;
				case 'collective':
					typeId = 2;
				break;
			}
			var model = {
				id: 0,
				isFictional: formDataObject.isFictional,
				actorType: {
					id: typeId,
				},
				displayName: {
					id: 0,
					actor: {
						id: 0
					},
					name: formDataObject.displayName,
					usedFrom: formDataObject.nameUsedFrom,
					usedUntil: formDataObject.nameUsedUntil,
				},
				birthName: {
					id: 0,
					actor: {
						id: 0
					},
					name: formDataObject.displayName,
					usedFrom: formDataObject.nameUsedFrom,
					usedUntil: formDataObject.nameUsedUntil,
				},
				// actorNames: [{}],
				// actorHasPhoneNumbers: [{}],
				// actorHasAddresses: [{}],
				// actorHasEmailAddresses: [{}],
				profileImages: formDataObject.profileImages,
			};
			// var i = 0;
			// for (; i < profileImageList.length; i++) {
			// 	model.profileImages[i] = {mediumId: profileImageList[i]};
			// }
			// console.log("TCL: actorModel", model);
			return model;
		},

		createActorSubtypeModel: async function(actorType, formDataObject) {
    	// console.log("TCL: formDataObject, actorType", formDataObject, actorType);
			var model = {};
			switch(actorType) {
				case 'person':
					model = {
						actorId: 0,
						title: formDataObject.title,
						dateOfBirth: formDataObject.dateOfBirth,
						placeOfBirth: {
							id: formDataObject.placeOfBirth,
							},
						dayOfDeath: formDataObject.dayOfDeath,
						placeOfDeath: {
							id: formDataObject.placeOfDeath,
						},
						sex: {
							id: formDataObject.sexId,
						},
						actorPersonIsMemberOfActorCollectives: [],
						actorPersonTranslations: [],
						citizenships : []
					};
				break;
				case 'collective':
					model	= {
						actorId: 0,
						founded: formDataObject.founded,
						disbanded: formDataObject.disbanded,
					};
				break;
			}
      console.log("model", model);
			return model;
		},

		createActorPersonTranslationModel: async function(formDataObject) {
			var model = [{
					id: 0,
					language: {
						id: 1 // TODO change to correct language
					},
					specialFeatures: formDataObject.specialFeatures,
				}];
			return model;
		},

		createNameModel: async function(formDataObject) {
    	console.log("TCL: createNameModel: formDataObject", formDataObject);
			var model = {
				id: 0,
				actor: {
					id: 0,
				},
				name: formDataObject.displayName,
				usedFrom: formDataObject.nameUsedFrom,
				usedUntil: formDataObject.nameUsedUntil,
			};
      console.log("TCL: name", model);
			return model;
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

		createActorHasEmailAddressModel: async function(data, actorId, emailAddressId) {
    	// console.log("TCL: data, actorId, emailAddressId", data, actorId, emailAddressId);
			var model = {};
			model.id = {
				actorId: actorId,
				emailAddressId: emailAddressId
			};
			model.emailAddress = {
				id: emailAddressId,
				email: data.email,
			};
			model.emailAddressType = TIMAAT.ActorDatasets.emailAddressTypes[Number(data.emailAddressTypeId)-1];
			return model;
		},

		updateActorHasEmailAddressModel: async function(originalModel, data) {
			var updatedModel = originalModel;
			updatedModel.emailAddressType = TIMAAT.ActorDatasets.emailAddressTypes[Number(data.emailAddressTypeId)-1];
			updatedModel.emailAddress.email = data.email;
			return updatedModel;
		},

		createActorHasPhoneNumberModel: async function(data, actorId, phoneNumberId) {
    	// console.log("TCL: data, actorId, phoneNumberId", data, actorId, phoneNumberId);
			var model = {};
			model.id = {
				actorId: actorId,
				phoneNumberId: phoneNumberId
			};
			model.phoneNumber = {
				id: phoneNumberId,
				phoneNumber: data.phoneNumber,
			};
			model.phoneNumberType = TIMAAT.ActorDatasets.phoneNumberTypes[Number(data.phoneNumberTypeId)-1];
			return model;
		},

		updateActorHasPhoneNumberModel: async function(originalModel, data) {
			var updatedModel = originalModel;
			updatedModel.phoneNumberType = TIMAAT.ActorDatasets.phoneNumberTypes[Number(data.phoneNumberTypeId)-1];
			updatedModel.phoneNumber.phoneNumber = data.phoneNumber;
			return updatedModel;
		},

		createCitizenshipModel: async function(formDataObject) {
    // console.log("TCL: createCitizenshipModel: formDataObject", formDataObject);
			var model = {
					id: 0,
					citizenshipTranslations: [{
						id: 0,
						language: {
							id: 1, // TODO set proper language
						},
						name: formDataObject.citizenshipName, // TODO link actual citizenships
					}],
				};
				console.log("TCL: model", model);
			return model;
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
						<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-usedfrom" id="timaat-actordatasets-actor-actornames-name-usedfrom" name="nameUsedFrom" data-role="nameUsedFrom" placeholder="[Enter name used from]" aria-describedby="Name used from">
					</div>
					<div class="col-md-2">
						<label class="sr-only">Name used until</label>
						<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-actornames-name-useduntil" id="timaat-actordatasets-actor-actornames-name-useduntil" name="nameUsedUntil" data-role="nameUsedUntil" placeholder="[Enter name used until]" aria-describedby="Name used until">
					</div>
					<div class="col-md-1">
						<button class="btn btn-primary" data-role="add">
							<i class="fas fa-plus"></i>
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
									<input type="text" 
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetname"
												 name="streetName"
												 data-role="streetName"
												 placeholder="[Enter street name]"
												 value="TEMP NAME"
												 aria-describedby="Street name"
												 minlength="3"
												 maxlength="200"
												 rows="1"
												 readonly="true">
								</div>
								<div class="col-md-2">
									<label class="col-form-label col-form-label-sm">Street number</label>
									<input type="text"
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetnumber"
												 name="streetNumber"
												 data-role="streetNumber"
												 placeholder="[Enter street number]"
												 aria-describedby="Street number"
												 maxlength="10">
								</div>
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Street addition</label>
									<input type="text"
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-streetaddition"
												 name="streetAddition"
												 data-role="streetAddition"
												 placeholder="[Enter street addition]"
												 aria-describedby="Street addition"
												 maxlength="50">
								</div>
							</div>
							<div class="form-row">
								<div class="col-md-3">
									<label class="col-form-label col-form-label-sm">Postal code</label>
									<input type="text"
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postalcode"
												 name="postalCode"
												 data-role="postalCode"
												 placeholder="[Enter postal code]"
												 aria-describedby="Postal code"
												 maxlength="8">
								</div>
								<div class="col-md-6">
									<label class="col-form-label col-form-label-sm">City</label>
									<input type="text"
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-cityname"
												 name="cityName"
												 data-role="cityName"
												 placeholder="[Enter city]"
												 value="TEMP NAME"
												 aria-describedby="City"
												 readonly="true">
								</div>
								<div class="col-md-3">
									<label class="col-form-label col-form-label-sm">Post office box</label>
									<input type="text"
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-postofficebox"
												 name="postOfficeBox"
												 ata-role="postOfficeBox"
												 placeholder="[Enter post office box]"
												 aria-describedby="Post office box"
												 maxlength="10">
								</div>
							</div>
							<div class="form-row">
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Address type*</label>
									<select class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-addresstype-id"
													name="addressTypeId"
													data-role="addressTypeId"
													required>
										<option value="" disabled selected hidden>[Choose address type...]</option>
										<option value="1"> </option>
										<option value="2">business</option>
										<option value="3">home</option>
										<option value="4">other</option>
									</select>
								</div>
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Address used from</label>
									<input type="text"
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-usedfrom"
												 id="timaat-actordatasets-actor-addresses-address-usedfrom"
												 name="addressUsedFrom"
												 data-role="addressUsedFrom"
												 placeholder="[Enter used from]"
												 aria-describedby="Address used from">
								</div>
								<div class="col-md-4">
									<label class="col-form-label col-form-label-sm">Address used until</label>
									<input type="text"
												 class="form-control form-control-sm timaat-actordatasets-actor-addresses-address-useduntil"
												 id="timaat-actordatasets-actor-addresses-address-useduntil"
												 name="addressUsedUntil"
												 data-role="addressUsedUntil"
												 placeholder="[Enter used until]"
												 aria-describedby="Address used until">
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col-md-1 vertical-aligned">
						<button class="btn btn-primary" data-role="add">
							<i class="fas fa-plus"></i>
						</button>
					</div>
				</div>
			</div>`;
			return addressToAppend;
		},

		appendNewEmailAddressField: function() {
			var emailAddressToAppend = 
				`<div class="form-group" data-role="emailaddress-entry">
					<div class="form-row">
						<div class="col-md-2 text-center">
							<div class="form-check">
								<span>Add new email:</span>
							</div>
						</div>
						<div class="col-md-3">
							<label class="sr-only">Email address type*</label>
							<select class="form-control form-control-sm timaat-actordatasets-actor-emailaddresses-emailaddresstype-id" name="emailAddressTypeId" data-role="emailAddressTypeId" required>
								<option value="" disabled selected hidden>[Choose email type...]</option>
								<option value="1"> </option>
								<option value="2">home</option>
								<option value="3">work</option>
								<option value="4">other</option>
								<option value="5">mobile</option>
								<option value="6">custom</option>
							</select>
						</div>
						<div class="col-md-6">
							<label class="sr-only">Email address</label>
							<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-emailaddresses-emailaddress" name="emailAddress" data-role="emailAddress" placeholder="[Enter email address]" aria-describedby="Email address" required>
						</div>
						<div class="col-md-1">
							<button class="btn btn-primary" data-role="add">
								<i class="fas fa-plus"></i>
							</button>
						</div>
					</div>
				</div>`;
			return emailAddressToAppend;
		},

		appendNewPhoneNumberField: function() {
			var phoneNumberToAppend = 
				`<div class="form-group" data-role="phonenumber-entry">
					<div class="form-row">
						<div class="col-md-2 text-center">
							<div class="form-check">
								<span>Add new phone number:</span>
							</div>
						</div>
						<div class="col-md-3">
							<label class="sr-only">Phone number type*</label>
							<select class="form-control form-control-sm timaat-actordatasets-actor-phonenumbers-phonenumbertype-id" name="phoneNumberTypeId" data-role="phoneNumberTypeId" required>
								<option value="" disabled selected hidden>[Choose phone number type...]</option>
								<option value="1"> </option>
								<option value="2">mobile</option>
										<option value="3">home</option>
										<option value="4">work</option>
										<option value="5">pager</option>
										<option value="6">other</option>
										<option value="7">custom</option>
							</select>
						</div>
						<div class="col-md-6">
							<label class="sr-only">Phone number</label>
							<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-phonenumbers-phonenumber" name="phoneNumber" data-role="phoneNumber" maxlength="30" placeholder="[Enter phone number]" aria-describedby="Phone number" rerquired>
						</div>
						<div class="col-md-1">
							<button class="btn btn-primary" data-role="add">
								<i class="fas fa-plus"></i>
							</button>
						</div>
					</div>
				</div>`;
			return phoneNumberToAppend;
		},

		appendMemberOfCollectiveDataset: function(i, actorId, actorName, memberOfCollectiveData, labelClassString, editMode) {
			console.log("TCL: appendMemberOfCollectiveDataset -> i, actorId, actorName, memberOfCollectiveData, labelClassString, editMode", i, actorId, actorName, memberOfCollectiveData, labelClassString, editMode);
			var memberOfCollectiveFormData = 
			`<div class="form-group" data-role="personismemberofcollective-entry" data-id=`+i+` data-actor-id=`+actorId+`>
				<div class="form-row">
					<div class="col-md-11">
						<fieldset>
							<legend>Membership `+(i+1)+`</legend>
							<div class="form-row">
								<div class="hidden" aria-hidden="true">
									<input type="hidden"
												class="form-control form-control-sm"
												name="actorId"
												value="`+actorId+`">
								</div>
								<div class="col-md-6">
									<label class="sr-only">Member of collective</label>
									<input type="text" class="form-control form-control-sm timaat-actordatasets-actor-memberofcollective-actor-id"
													id="actorName_`+actorId+`"
													name="actorName"
													value="`+actorName.name+`"
													data-role="actorId[`+actorId+`]"
													placeholder="Select actor"
													aria-describedby="actor name"
													required>
								</div>
								<div class="col-md-6 person-memberofcollectives-details-container">
									<div data-role="person-memberofcollectives-details-entries">`;
			// append list of membership details
			var j = 0;
			for (; j < memberOfCollectiveData.length; j++) {
				memberOfCollectiveFormData +=	TIMAAT.ActorDatasets.appendMemberOfCollectiveDetailFields(i, j, actorId, memberOfCollectiveData[j], labelClassString);
			}
			memberOfCollectiveFormData +=	
									`</div>
									<div class="form-group" data-role="new-personismemberofcollective-details-fields" data-details-id="`+j+`">`;
			if (editMode) {
				memberOfCollectiveFormData += TIMAAT.ActorDatasets.appendMemberOfCollectiveNewDetailFields();
			}
			memberOfCollectiveFormData +=
										`<!-- form sheet: one row for new memberOfCollective detail information that shall be added to the memberofcollective --> 
									</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col-md-1 vertical-aligned">
						<button type="button" class="btn btn-danger" data-role="remove">
							<i class="fas fa-trash-alt"></i>
						</button>
					</div>
				</div>
			</div>`;
			return memberOfCollectiveFormData;
		},

		/** adds empty fields for new memberOfCollective dataset */
		appendNewMemberOfCollectiveFields: function() {
    	// console.log("TCL: appendNewMemberOfCollectiveFields");
			// var numMembershipDetails = 0; // TODO
			var memberOfCollectiveToAppend =
			`<div class="form-group" data-role="personismemberofcollective-entry" data-id=-1>
				<div class="form-row">
					<div class="col-md-11">
						<fieldset>
							<legend>Add new member of collective:</legend>
							<div class="form-row">
								<div class="col-md-6">
									<label class="sr-only">Member of collective</label>
									<select class="form-control form-control-sm"
													id="actor-select-dropdown"
													name="actorId"
													data-role="actorId"
													data-placeholder="Select actor"
													required>
									</select>
								</div>
								<div class="col-md-6 person-memberofcollectives-details-container">
									<div class="form-group"
											 data-role="new-personismemberofcollective-details-fields"
											 data-details-id="0">`;
			memberOfCollectiveToAppend += TIMAAT.ActorDatasets.appendMemberOfCollectiveNewDetailFields();
			memberOfCollectiveToAppend += 
									`</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col-md-1 vertical-aligned">
						<button type="button" class="btn btn-primary" data-role="add">
							<i class="fas fa-plus"></i>
						</button>
					</div>
				</div>
			</div>`;
			return memberOfCollectiveToAppend;
		},

		/** adds fields for details of memberIsCollective data */
		appendMemberOfCollectiveDetailFields: function(i, j, actorId, memberOfCollectiveData, labelClassString) {
    	// console.log("TCL: appendMemberOfCollectiveDetailFields: i, j, actorId, memberOfCollectiveData, labelClassString", i, j, actorId, memberOfCollectiveData, labelClassString);
			var membershipDetails =
				`<div class="form-group" data-role="memberofcollective-details-entry" data-details-id="`+j+`">
					<div class="form-row">
						<div class="hidden" aria-hidden="true">
							<input type="hidden"
										 class="form-control form-control-sm"
										 name="membershipDetailId"
										 value="`+memberOfCollectiveData.id+`">
						</div>
						<div class="col-md-5">
							<label class="`+labelClassString+`">Joined at</label>
							<input type="text"
										 class="form-control form-control-sm timaat-actordatasets-actor-memberofcollectives-joinedat"
										 name="joinedAt[`+actorId+`][`+j+`]"
										 data-role="joinedAt[`+actorId+`][`+j+`]"`;
				if (memberOfCollectiveData != null) { membershipDetails += `value="`+memberOfCollectiveData.joinedAt+`"`; }
				membershipDetails +=
										`placeholder="[Enter joined at]"
										aria-describedby="Collective joined at">
						</div>
						<div class="col-md-5">
							<label class="`+labelClassString+`">Left at</label>
							<input type="text"
										 class="form-control form-control-sm timaat-actordatasets-actor-memberofcollectives-leftat"
										 name="leftAt[`+actorId+`][`+j+`]"
										 data-role="leftAt[`+actorId+`][`+j+`]"`;
				if (memberOfCollectiveData != null) { membershipDetails += `value="`+memberOfCollectiveData.leftAt+`"`; }
				membershipDetails +=
										`placeholder="[Enter left at]"
										aria-describedby="Collective left at">
						</div>
						<div class="col-md-2 vertical-aligned">
							<button type="button" class="btn btn-danger" data-role="removeMembershipDetails">
								<i class="fas fa-trash-alt"></i>
							</button>
						</div>
					</div>
				</div>`;
			return membershipDetails;
		},

		/** adds new fields for details of memberIsCollective data */
		appendMemberOfCollectiveNewDetailFields: function() {
			// console.log("TCL: appendMemberOfCollectiveNewDetailFields");
			var newMembershipDetails =
			`<div class="form-row">
				<div class="hidden" aria-hidden="true">
					<input type="hidden"
									class="form-control form-control-sm disable-on-submit disable-on-add"
									name="membershipDetailId"
									value="0">
				</div>
				<div class="col-md-5">
					<label class="sr-only">Joined at</label>
					<input type="text"
								class="form-control disable-on-submit form-control-sm timaat-actordatasets-actor-memberofcollectives-joinedat"
								name="joinedAt"
								data-role="joinedAt"
								placeholder="[Enter joined at]"
								aria-describedby="Collective joined at">
				</div>
				<div class="col-md-5">
					<label class="sr-only">Left at</label>
					<input type="text"
								class="form-control disable-on-submit form-control-sm timaat-actordatasets-actor-memberofcollectives-leftat"
								name="leftAt"
								data-role="leftAt"
								placeholder="[Enter left at]"
								aria-describedby="Collective left at">
				</div>
				<div class="col-md-2 vertical-aligned">
					<button type="button" class="btn btn-primary" data-role="addMembershipDetails">
						<i class="fas fa-plus"></i>
					</button>
				</div>
			</div>`;
			return newMembershipDetails;
		},

		appendActorHasRolesDataset: function() {
			var entryToAppend =
			`<div class="form-group" data-role="actorhasrole-entry">
				<div class="form-row">
					<div class="col-md-12">
            <label class="sr-only">Has Role(s)</label>
            <select class="form-control form-control-sm"
                    id="actorroles-multi-select-dropdown"
                    name="roleId"
                    data-placeholder="Select role(s)"
                    multiple="multiple"
                    readonly="true">
            </select>
					</div>
				</div>
			</div>`;
			return entryToAppend;
		},

		appendActorRoleInMediumDataset: function() {
			var entryToAppend =
			`<div class="form-group" data-role="actorroleinmedium-entry">
				<div class="form-row">
					<div class="col-md-12">
            <label class="sr-only">Has Role(s)</label>
            <select class="form-control form-control-sm"
                    id="actorrolemedium-multi-select-dropdown"
                    name="mediumId"
                    data-placeholder="Select media"
                    multiple="multiple"
                    readonly="true">
            </select>
					</div>
				</div>
			</div>`;
			return entryToAppend;
		},

		setupActorDatatable: function() {
			console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.ActorDatasets.dataTableActor = $('#timaat-actordatasets-actor-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"rowId"					: 'id',
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/actor/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// actorsubtype: ''
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
						// console.log("TCL: TIMAAT.ActorDatasets.actor (last)", TIMAAT.ActorDatasets.actor);
						// setup model
						var acts = Array();
						data.data.forEach(function(actor) { 
							if ( actor.id > 0 ) {
								acts.push(new TIMAAT.Actor(actor, 'actor'));
							}
						});
						TIMAAT.ActorDatasets.actors = acts;
						TIMAAT.ActorDatasets.actors.model = data.data;
						// console.log("TCL: TIMAAT.ActorDatasets.actor (current)", TIMAAT.ActorDatasets.actor);
						return data.data; // data.map(actor => new TIMAAT.Actor(actor));;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.ActorDatasets.selectedId) {
						TIMAAT.ActorDatasets.clearLastSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let actorElement = $(row);
					let actor = data;
					actor.ui = actorElement;
					actorElement.data('actor', actor);

					actorElement.on('click', '.name', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('actors');
						$('.form').hide();
						$('.actors-nav-tabs').show();
						$('.actors-data-tabs').hide();
						var selectedActor;
						var i = 0;
						for (; i < TIMAAT.ActorDatasets.actors.length; i++) {
							if (TIMAAT.ActorDatasets.actors[i].model.id == actor.id) {
								selectedActor = TIMAAT.ActorDatasets.actors[i];
								break;
							}
						}
						TIMAAT.ActorDatasets.selectLastSelection('actor', actor.id);

						var type = selectedActor.model.actorType.actorTypeTranslations[0].type;
						$('#timaat-actordatasets-metadata-form').data('actor', selectedActor);
						if (TIMAAT.ActorDatasets.subNavTab) {
							// console.log("TCL: TIMAAT.ActorDatasets.subNavTab", TIMAAT.ActorDatasets.subNavTab);
							// show tabs
							$('.'+type+'-data-tab').show();
							$('.name-data-tab').show();
							$('.address-data-tab').show();
							$('.emailaddress-data-tab').show();
							$('.phonenumber-data-tab').show();
							$('.actorroles-data-tab').show();
							$('.actorrolemedium-data-tab').show();
							$('.memberofcollective-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.ActorDatasets.subNavTab+'"]').tab('show');
							TIMAAT.ActorDatasets.showLastForm();
						} else {
							$('.nav-tabs a[href="#'+type+'Datasheet"]').tab('show');
							TIMAAT.ActorDatasets.actorFormDatasheet('show', type, selectedActor);
						}
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name', render: function(data, type, actor, meta) {
						// console.log("TCL: actor", actor);
						let displayActorTypeIcon = '';
						switch (actor.actorType.actorTypeTranslations[0].type) {
							case 'person': 
								displayActorTypeIcon = '  <i class="far fa-address-card"></i>';
							break;
							case 'collective': 
								displayActorTypeIcon = '  <i class="fas fa-users"></i>';
							break;
						}
						let nameDisplay = `<p>` + displayActorTypeIcon + `  ` + actor.displayName.name +`</p>`;
						if (actor.birthName != null && actor.displayName.id != actor.birthName.id) {
							nameDisplay += `<p><i>(BN: `+actor.birthName.name+`)</i></p>`;
						}
						actor.actorNames.forEach(function(name) { // make additional names searchable in actorlibrary
							if (name.id != actor.displayName.id && (actor.birthName == null || name.id != actor.birthName.id)) {
								nameDisplay += `<div style="display:none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No actors found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ actors total)",
					"infoEmpty"   : "No actors available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ actors(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupPersonDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.ActorDatasets.dataTablePerson = $('#timaat-actordatasets-person-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"rowId"					: 'id',
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/actor/person/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// actorsubtype: 'person'
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
          	// console.log("TCL: data", data);
						// console.log("TCL: TIMAAT.ActorDatasets.persons (last)", TIMAAT.ActorDatasets.persons);
						// setup model
						var acts = Array();
						data.data.forEach(function(actor) { 
							if ( actor.id > 0 ) {
								acts.push(new TIMAAT.Actor(actor, 'person'));
							}
						});
						TIMAAT.ActorDatasets.persons = acts;
						TIMAAT.ActorDatasets.persons.model = data.data;
						// console.log("TCL: TIMAAT.ActorDatasets.persons (current)", TIMAAT.ActorDatasets.persons);
						return data.data;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.ActorDatasets.selectedId) {
						TIMAAT.ActorDatasets.clearLastSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let actorElement = $(row);
					let actor = data;
					actor.ui = actorElement;
					actorElement.data('actor', actor);

					actorElement.on('click', '.name', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('actors');
						$('.form').hide();
						$('.actors-nav-tabs').show();
						$('.actors-data-tabs').hide();
						var selectedActor;
						var i = 0;
						for (; i < TIMAAT.ActorDatasets.persons.length; i++) {
							if (TIMAAT.ActorDatasets.persons[i].model.id == actor.id) {
								selectedActor = TIMAAT.ActorDatasets.persons[i];
								break;
							}
						}
						TIMAAT.ActorDatasets.selectLastSelection('person', actor.id);

						$('#timaat-actordatasets-metadata-form').data('actor', selectedActor);
						if (TIMAAT.ActorDatasets.subNavTab) {
							console.log("TCL: TIMAAT.ActorDatasets.subNavTab", TIMAAT.ActorDatasets.subNavTab);
							// show tabs
							$('.person-data-tab').show();
							$('.name-data-tab').show();
							$('.address-data-tab').show();
							$('.emailaddress-data-tab').show();
							$('.phonenumber-data-tab').show();
							$('.actorroles-data-tab').show();
							$('.actorrolemedium-data-tab').show();
							$('.memberofcollective-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.ActorDatasets.subNavTab+'"]').tab('show');
							TIMAAT.ActorDatasets.showLastForm();
						} else {
							$('.nav-tabs a[href="#personDatasheet"]').tab('show');
							TIMAAT.ActorDatasets.actorFormDatasheet('show', 'person', selectedActor);
						}
					});
				},
				"columns": [{ 
					data: 'id', name: 'name', className: 'name', render: function(data, type, actor, meta) {
						// console.log("TCL: actor", actor);
						let nameDisplay = `<p>` + actor.displayName.name +`</p>`;
						if (actor.birthName != null && actor.displayName.id != actor.birthName.id) {
							nameDisplay += `<p><i>(BN: `+actor.birthName.name+`)</i></p>`;
						}
						actor.actorNames.forEach(function(name) { // make additional names searchable in actorlibrary
							if (name.id != actor.displayName.id && (actor.birthName == null || name.id != actor.birthName.id)) {
								nameDisplay += `<div style="display:none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No person found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ persons total)",
					"infoEmpty"   : "No persons available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ person(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupCollectiveDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.ActorDatasets.dataTableCollective = $('#timaat-actordatasets-collective-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"rowId"					: 'id',
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/actor/collective/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// actorsubtype: 'collective'
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
          	// console.log("TCL: data", data);
						// console.log("TCL: TIMAAT.ActorDatasets.collectives (last)", TIMAAT.ActorDatasets.collectives);
						// setup model
						var acts = Array();
						data.data.forEach(function(actor) { 
							if ( actor.id > 0 ) {
								acts.push(new TIMAAT.Actor(actor, 'collective'));
							}
						});
						TIMAAT.ActorDatasets.collectives = acts;
						TIMAAT.ActorDatasets.collectives.model = data.data;
						// console.log("TCL: TIMAAT.ActorDatasets.collectives (current)", TIMAAT.ActorDatasets.collectives);
						return data.data;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.ActorDatasets.selectedId) {
						TIMAAT.ActorDatasets.clearLastSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let actorElement = $(row);
					let actor = data;
					actor.ui = actorElement;
					actorElement.data('actor', actor);

					actorElement.on('click', '.name', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('actors');
						$('.form').hide();
						$('.actors-nav-tabs').show();
						$('.actors-data-tabs').hide();
						var selectedActor;
						var i = 0;
						for (; i < TIMAAT.ActorDatasets.collectives.length; i++) {
							if (TIMAAT.ActorDatasets.collectives[i].model.id == actor.id) {
								selectedActor = TIMAAT.ActorDatasets.collectives[i];
								break;
							}
						}
						TIMAAT.ActorDatasets.selectLastSelection('collective', actor.id)

						$('#timaat-actordatasets-metadata-form').data('actor', selectedActor);
						if (TIMAAT.ActorDatasets.subNavTab) {
							console.log("TCL: TIMAAT.ActorDatasets.subNavTab", TIMAAT.ActorDatasets.subNavTab);
							// show tabs
							$('.collective-data-tab').show();
							$('.name-data-tab').show();
							$('.address-data-tab').show();
							$('.emailaddress-data-tab').show();
							$('.phonenumber-data-tab').show();
							$('.actorroles-data-tab').show();
							$('.actorrolemedium-data-tab').show();
							$('.memberofcollective-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.ActorDatasets.subNavTab+'"]').tab('show');
							TIMAAT.ActorDatasets.showLastForm();
						} else {
							$('.nav-tabs a[href="#collectiveDatasheet"]').tab('show');
							TIMAAT.ActorDatasets.actorFormDatasheet('show', 'collective', selectedActor);
						}
					});
				},
				"columns": [{ 
					data: 'id', name: 'name', className: 'name', render: function(data, type, actor, meta) {
						// console.log("TCL: actor", actor);
						let nameDisplay = `<p>` + actor.displayName.name +`</p>`;
						if (actor.birthName != null && actor.displayName.id != actor.birthName.id) {
							nameDisplay += `<p><i>(BN: `+actor.birthName.name+`)</i></p>`;
						}
						actor.actorNames.forEach(function(name) { // make additional names searchable in actorlibrary
							if (name.id != actor.displayName.id && (actor.birthName == null || name.id != actor.birthName.id)) {
								nameDisplay += `<div style="display:none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No collectives found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ collectives total)",
					"infoEmpty"   : "No collectives available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ collective(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					}
				}			
			});				
		},

		selectLastSelection: function(type, id) {
			// console.log("TCL: selectLastSelection: type, id", type, id);
			// console.log("TCL: TIMAAT.ActorDatasets.selectedId", TIMAAT.ActorDatasets.selectedId);
			var table;
			switch(type) {
				case 'actor':
					table = TIMAAT.ActorDatasets.dataTableActor;
				break;
				case 'person':
					table = TIMAAT.ActorDatasets.dataTablePerson;
				break;
				case 'collective':
					table = TIMAAT.ActorDatasets.dataTableCollective;
				break;
			}
			// console.log("TCL: table", table);
			// remove selection from old rows
			if (TIMAAT.ActorDatasets.selectedId && TIMAAT.ActorDatasets.selectedId != id) {
				$(table.row('#'+TIMAAT.ActorDatasets.selectedId).node()).removeClass('selected');
			}
			TIMAAT.ActorDatasets.selectedId = id;
			// add selection to new rows
			$(table.row('#'+TIMAAT.ActorDatasets.selectedId).node()).addClass('selected');
		},

		clearLastSelection: function () {
			$(TIMAAT.ActorDatasets.dataTableActor.row('#'+TIMAAT.ActorDatasets.selectedId).node()).removeClass('selected');
			$(TIMAAT.ActorDatasets.dataTablePerson.row('#'+TIMAAT.ActorDatasets.selectedId).node()).removeClass('selected');
			$(TIMAAT.ActorDatasets.dataTableCollective.row('#'+TIMAAT.ActorDatasets.selectedId).node()).removeClass('selected');
			TIMAAT.ActorDatasets.selectedId = null;
		},

		refreshDatatable: async function(type) {
			// console.log("TCL: refreshDatatable - type: ", type);
			// set ajax data source
			switch(type) {
				case 'actor':
					if (TIMAAT.ActorDatasets.dataTableActor) {
						// TIMAAT.ActorDatasets.dataTableActor.ajax.url('/TIMAAT/api/actor/list');
						TIMAAT.ActorDatasets.dataTableActor.ajax.reload(null, false);
					}
				break;
				case 'person':
					if (TIMAAT.ActorDatasets.dataTablePerson) {
						// TIMAAT.ActorDatasets.dataTablePerson.ajax.url('/TIMAAT/api/actor/'+type+'/list');
						TIMAAT.ActorDatasets.dataTablePerson.ajax.reload(null, false);
					}
				break;
				case 'collective':
					if (TIMAAT.ActorDatasets.dataTableCollective) {
						// TIMAAT.ActorDatasets.dataTableCollective.ajax.url('/TIMAAT/api/actor/'+type+'/list');
						TIMAAT.ActorDatasets.dataTableCollective.ajax.reload(null, false);
					}
				break;
			}			
		},

	}
	
}, window));
