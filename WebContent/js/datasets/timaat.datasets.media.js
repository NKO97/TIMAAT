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
	
	TIMAAT.MediaDatasets = {
		media: null,
		mediaTypes: null,
		audios: null,
		documents: null,
		images: null,
		softwares: null,
		texts: null,
		videos: null,
		videogames: null,	
		titles: null,
		mediaDatasets: null,

		init: function() {
			TIMAAT.MediaDatasets.initMedia();
			// TIMAAT.MediaDatasets.initMediaTypes();
			TIMAAT.MediaDatasets.initAudios();
			TIMAAT.MediaDatasets.initDocuments();
			TIMAAT.MediaDatasets.initImages();
			TIMAAT.MediaDatasets.initSoftwares();
			TIMAAT.MediaDatasets.initTexts();
			TIMAAT.MediaDatasets.initVideos();
			TIMAAT.MediaDatasets.initVideogames();
			TIMAAT.MediaDatasets.initTitles();
			TIMAAT.MediaDatasets.initLanguageTracks();
			$('.media-data-tabs').hide();
			$('.media-cards').hide();
			$('.media-card').show();
			$('#timaat-mediadatasets-media-metadata-form').data('mediumType', 'medium');
		},

		initMediaTypes: function() {
			// console.log("TCL: MediaDatasets: initMediaTypes: function()");		
			// delete mediaType functionality
			$('#timaat-mediatype-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-mediumtype-delete');
				var mediaType = modal.data('mediaType');
				if (mediaType) TIMAAT.MediaDatasets._mediaTypeRemoved(mediaType);
				modal.modal('hide');
			});
			// add mediaType button
			$('#timaat-mediatype-add').attr('onclick','TIMAAT.MediaDatasets.addMediaType()');

			// add/edit mediaType functionality
			$('#timaat-mediadatasets-mediumtype-meta').on('show.bs.modal', function (ev) {
				// Create/Edit mediaType window setup
				var modal = $(this);
				var mediaType = modal.data('mediaType');				
				var heading = (mediaType) ? "MediaType bearbeiten" : "MediaType hinzufügen";
				var submit = (mediaType) ? "Speichern" : "Hinzufügen";
				var type = (mediaType) ? mediaType.model.type : 0;
				var hasVisual = (mediaType) ? mediaType.model.hasVisual : false;
				var hasAudio = (mediaType) ? mediaType.model.hasAudio : false;
				var hasContent = (mediaType) ? mediaType.model.hasContent : false;
				// setup UI
				$('#mediaTypeMetaLabel').html(heading);
				$('#timaat-mediadatasets-mediumtype-meta-submit').html(submit);
				$("#timaat-mediadatasets-mediumtype-meta-name").val(type).trigger('input');
				$("#timaat-mediadatasets-mediumtype-meta-hasvisual").val(hasVisual);
				$("#timaat-mediadatasets-mediumtype-meta-hasaudio").val(hasAudio);
				$("#timaat-mediadatasets-mediumtype-meta-hascontent").val(hasContent);
			});

			// Submit mediaType data
			$('#timaat-mediadatasets-mediumtype-meta-submit').click(function(ev) {
				// Create/Edit mediaType window submitted data validation
				var modal = $('#timaat-mediadatasets-mediumtype-meta');
				var mediaType = modal.data('mediaType');
				var type = $("#timaat-mediadatasets-mediumtype-meta-name").val();
				var hasVisual = $("#timaat-mediadatasets-mediumtype-meta-hasvisual").val();
				var hasAudio = $("#timaat-mediadatasets-mediumtype-meta-hasaudio").val();
				var hasContent = $("#timaat-mediadatasets-mediumtype-meta-hascontent").val();

				if (mediaType) {
					mediaType.model.medium.mediaTypeTranslations[0].type = type;
					mediaType.model.hasVisual = hasVisual;
					mediaType.model.hasAudio = hasAudio;
					mediaType.model.hasContent = hasContent;
					mediaType.updateUI();
					TIMAAT.MediaService.updateMediaType(mediaType);
					TIMAAT.MediaService.updateMediaTypeTranslation(mediaType);
				} else { // create new mediaType
					var model = {
						id: 0,
						hasVisual: hasVisual,
						hasAudio: hasAudio,
						hasContent: hasContent,
						mediaTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					}
					TIMAAT.MediaService.createMediaType(model, modelTranslation, TIMAAT.MediaDatasets._mediaTypeAdded); // TODO add mediaType parameters
				}
				modal.modal('hide');
			});

			// validate mediaType data	
			// TODO validate all required fields				
			$('#timaat-mediadatasets-mediumtype-meta-name').on('input', function(ev) {
				if ( $("#timaat-mediadatasets-mediumtype-meta-name").val().length > 0 ) {
					$('#timaat-mediadatasets-mediumtype-meta-submit').prop("disabled", false);
					$('#timaat-mediadatasets-mediumtype-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-mediadatasets-mediumtype-meta-submit').prop("disabled", true);
					$('#timaat-mediadatasets-mediumtype-meta-submit').attr("disabled");
				}
			});
		},

		initMedia: function() {
			// console.log("TCL: MediaDatasets: initMedia: function()");		
			
			// nav-bar functionality
			$('#media-tab-medium-metadata-form').click(function(event) {
				// $('.media-data-tabs').show();
				$('.nav-tabs a[href="#mediumDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'medium', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});
			
			// delete medium button functionality (in medium list)
			$('#timaat-mediadatasets-medium-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-medium-delete');
				var medium = modal.data('medium');
				if (medium) TIMAAT.MediaDatasets._mediumRemoved(medium);
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add medium button functionality (in medium list - opens datasheet form)
			// $('#timaat-mediadatasets-medium-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("medium")');
			$('#timaat-mediadatasets-medium-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("medium");
			});
			
			// medium form handlers
			// Submit medium metadata button functionality
			$('#timaat-mediadatasets-medium-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-mediadatasets-media-metadata-form').valid()) return false;

				// the original medium model (in case of editing an existing medium)
				var medium = $('#timaat-mediadatasets-media-metadata-form').data('medium');				
        // console.log("TCL: medium", medium);

				// Create/Edit medium window submitted data
				var formData = $('#timaat-mediadatasets-media-metadata-form').serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (medium) { // update medium
					// medium data
					medium.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					medium.model.copyright = formDataObject.copyright;
					medium.model.remark = formDataObject.remark;
					// title data
					medium.model.title.name = formDataObject.primaryTitle;
					medium.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < medium.model.titles.length; i++) {
						if (medium.model.title.id == medium.model.titles[i].id) {
							medium.model.titles[i] = medium.model.title;
							break;
						}
					}
					// medium.model.mediaType.id = Number(formDataObject.typeId); // Do not change type 
					// source data
					medium.model.sources[0].url = formDataObject.sourceUrl;
					medium.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					medium.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					medium.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;

					medium.updateUI();
					await TIMAAT.MediaDatasets.updateMedium(medium);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', "medium", medium);
				} else { // create new medium
					var model = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: Number(formDataObject.typeId),
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
					};
						// work: {
						// 	id: 1,  // TODO implement work
						// },
						// mediumTranslations: [],
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),            
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// Medium has no translation table at the moment
					// TIMAAT.MediaDatasets.createMedium(model, modelTranslation, TIMAAT.MediaDatasets._mediumAdded);
					await TIMAAT.MediaDatasets.createMedium(model, title, source);
					var medium = TIMAAT.MediaDatasets.media[TIMAAT.MediaDatasets.media.length-1];
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', "medium", medium);
				};
			});

			// edit content form button handler
			$('#timaat-mediadatasets-medium-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'medium', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-medium-metadata-form-dismiss').click( function(event) {
				var medium = $('#timaat-mediadatasets-media-metadata-form').data('medium');
				if (medium != null) {
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', "medium", medium);
				} else { // dismiss medium creation
					$('.form').hide();
				}
			});

		},

		initTitles: function() {
			$('#media-tab-titles-form').click(function(event) {
				$('.nav-tabs a[href="#mediumTitles"]').tab('show');
				$('.form').hide();
				TIMAAT.MediaDatasets.setMediumTitleList($('#timaat-mediadatasets-media-metadata-form').data('medium'))
				$('#timaat-mediadatasets-medium-titles-form').show();
				TIMAAT.MediaDatasets.mediumFormTitles('show', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});
			
			// edit titles form button handler
			$('#timaat-mediadatasets-medium-titles-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormTitles('edit', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			});

			// Add title button click
			$(document).on('click','[data-role="new-title-fields"] > .form-group [data-role="add"]', function(e) {
				e.preventDefault();
				console.log("TCL: add title to list");
				var listEntry = $(this).closest('[data-role="new-title-fields"]');
				var title = '';
				var languageId = null;
				if (listEntry.find('input').each(function(){           
					title = $(this).val();
          console.log("TCL: title", title);
				}));
				if (listEntry.find('select').each(function(){
					languageId = $(this).val();
          console.log("TCL: languageId", languageId);
				}));
				// if (!$("#timaat-mediadatasets-medium-titles-form").valid()) return false;
				if (title != '' && languageId != null) {
					var titlesInForm = $("#timaat-mediadatasets-medium-titles-form").serializeArray();
					console.log("TCL: titlesInForm", titlesInForm);
					var i = Math.floor((titlesInForm.length - 1) / 2) - 1; // first -1 is to account for 'add new title' row; latter -1 to compensate for single 'isPrimaryTitle' occurence
					$('#dynamic-title-fields').append(
						`<div class="form-group" data-role="title-entry">
						<div class="form-row">
							<div class="col-md-2 text-center">
								<div class="form-check">
									<label class="sr-only" for="isPrimaryTitle"></label>
									<input class="form-check-input isPrimaryTitle" type="radio" name="isPrimaryTitle" placeholder="Is Primary Title" data-role="title">
								</div>
							</div>
							<div class="col-md-6">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="title[`+i+`]" value="`+title+`" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" data-role="title" required>
							</div>
							<div class="col-md-3">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" name="titleLanguageId[`+i+`]" data-role="titleLanguageId[`+i+`]" required>
									<option value="2">English</option>
									<option value="3">German</option>
									<option value="4">French</option>
									<option value="5">Spanish</option>
									<option value="6">Russian</option>
									<option value="7">Arabic</option>
								</select>
							</div>
							<div class="col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
					);
					($('[data-role="titleLanguageId['+i+']"]'))
						.find('option[value='+languageId+']')
						.attr("selected",true);
					$('input[name="title['+i+']"').rules("add",
					{
						required: true,
						minlength: 3,
						maxlength: 200,
					});
				$('select[name="titleLanguageId['+i+']"').rules("add",
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

			// Remove title button click
			$(document).on('click','[data-role="dynamic-title-fields"] > .form-group [data-role="remove"]', function(e) {
				e.preventDefault();
				var isPrimaryTitle = $(this).closest('.form-group').find('input[name=isPrimaryTitle]:checked').val();
				if (isPrimaryTitle == "on") {
					// TODO modal informing that primary title entry cannot be deleted					
					console.log("CANNOT DELETE PRIMARY TITLE");
				}
				else {
					// TODO consider undo function or popup asking if user really wants to delete a title
					console.log("DELETE TITLE ENTRY");
					$(this).closest('.form-group').remove();
				}
			});

			// Submit medium titles button functionality
			$("#timaat-mediadatasets-medium-titles-form-submit").on('click', async function(event) {
				console.log("TCL: Titles form: submit");
				// add rules to dynamically added form fields
				console.log("TCL: Titles form: valid?");
				// continue only if client side validation has passed
				event.preventDefault();
				var node = document.getElementById("new-title-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				};
				// test if form is valid 
				if (!$("#timaat-mediadatasets-medium-titles-form").valid()) {
					$('[data-role="new-title-fields"]').append(
						`<div class="form-group" data-role="title-entry">
							<div class="form-row">
								<div class="col-md-2 text-center">
									<div class="form-check">
										<span>Add new title:</span>
									</div>
								</div>
								<div class="col-md-6">
									<label class="sr-only">Title</label>
									<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="title" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" data-role="title" required>
								</div>
								<div class="col-md-3">
									<label class="sr-only">Title's Language</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" name="titleLanguageId" required>
										<option value="" disabled selected hidden>[Choose title language...]</option>
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
				console.log("TCL: Titles form: valid");

				// the original medium model (in case of editing an existing medium)
				var medium = $("#timaat-mediadatasets-medium-titles-form").data("medium");			

				// Create/Edit medium window submitted data
				var formData = $("#timaat-mediadatasets-medium-titles-form").serializeArray();
				var formTitleList = [];
				var i = 0;
				while ( i < formData.length) {
					var element = {
					isPrimaryTitle: false,
					title: '',
					titleLanguageId: 0,
				};
					if (formData[i].name == 'isPrimaryTitle' && formData[i].value == 'on' ) {
						element.isPrimaryTitle = true;
						element.title = formData[i+1].value;
						element.titleLanguageId = formData[i+2].value;
						i = i+3;
					} else {
						element.isPrimaryTitle = false;
						element.title = formData[i].value;
						element.titleLanguageId = formData[i+1].value;
						i = i+2;
					};
					formTitleList[formTitleList.length] = element;
				}
				// only updates to existing titles
				if (formTitleList.length == medium.model.titles.length) {
					var i = 0;
					for (; i < medium.model.titles.length; i++ ) { // update existing titles
						var title = {
							id: medium.model.titles[i].id,
							language: {
								id: Number(formTitleList[i].titleLanguageId),
							},
							name: formTitleList[i].title,
							};
						await TIMAAT.MediaDatasets.updateTitle(title, medium);
					};
				}
				// update existing titles and add new ones
				else if (formTitleList.length > medium.model.titles.length) {
					var i = 0;
					for (; i < medium.model.titles.length; i++ ) { // update existing titles
						var title = {
							id: medium.model.titles[i].id,
							language: {
								id: Number(formTitleList[i].titleLanguageId),
							},
							name: formTitleList[i].title,
							};
						await TIMAAT.MediaDatasets.updateTitle(title, medium);
					};
					i = medium.model.titles.length;
					var newTitles = [];
					for (; i < formTitleList.length; i++) { // create new titles
						var title = {
							id: 0,
							language: {
								id: Number(formTitleList[i].titleLanguageId),
							},
							name: formTitleList[i].title,
							};
						newTitles.push(title);
					}
					await TIMAAT.MediaDatasets.addTitles(medium, newTitles);
				}
				// update existing titles and delete obsolete ones
				else if (formTitleList.length < medium.model.titles.length) {
					var i = 0;
					for (; i < formTitleList.length; i++ ) { // update existing titles
						var title = {
							id: medium.model.titles[i].id,
							language: {
								id: Number(formTitleList[i].titleLanguageId),
							},
							name: formTitleList[i].title,
							};
						await TIMAAT.MediaDatasets.updateTitle(title, medium);
					};
					var i = medium.model.titles.length - 1;
					for (; i >=  formTitleList.length; i-- ) { // remove obsolete titles
						TIMAAT.MediaService.removeTitle(medium.model.titles[i]);
						medium.model.titles.pop();				
					}
				}
				// set primary title
				var i = 0;
				for (; i < formTitleList.length; i++ ) {
					if (formTitleList[i].isPrimaryTitle) {
						medium.model.title = medium.model.titles[i];
						await TIMAAT.MediaDatasets.updateMedium(medium);
					}
				}
				console.log("TCL: show medium title form");
				TIMAAT.MediaDatasets.mediumFormTitles('show', medium);
			});

			// Cancel add/edit button in titles form functionality
			$('#timaat-mediadatasets-medium-titles-form-dismiss').click( function(event) {
				TIMAAT.MediaDatasets.mediumFormTitles('show', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});
		},

		initLanguageTracks: function() {
			// languagetrack tab click handling
			$('#media-tab-languagetracks-form').click(function(event) {
				$('.nav-tabs a[href="#mediumLanguageTracks"]').tab('show');
				$('.form').hide();
				TIMAAT.MediaDatasets.setMediumLanguageTrackList($('#timaat-mediadatasets-media-metadata-form').data('medium'))
				$('#timaat-mediadatasets-medium-languagetracks-form').show();
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});
			
			// edit languageTracks form button handler
			$('#timaat-mediadatasets-medium-languagetracks-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('edit', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			});

			// Add languageTrack button click
			$(document).on('click','[data-role="new-languagetrack-fields"] > .form-group [data-role="add"]', function(e) {
				e.preventDefault();
				console.log("TCL: add languageTrack to list");
				var listEntry = $(this).closest('[data-role="new-languagetrack-fields"]');
				var mediumLanguageTypeId = listEntry.find('[data-role="languageTrackTypeId"]').val();
				console.log("TCL: mediumLanguageTypeId: ", mediumLanguageTypeId);
				var languageId = listEntry.find('[data-role="languageTrackLanguageId"]').val();
				console.log("TCL: languageId: ", languageId);
				// if (!$("#timaat-mediadatasets-medium-languagetracks-form").valid()) return false;
				if (mediumLanguageTypeId != null && languageId != null) {
					// var duplicate = false;
					var medium = $('#timaat-mediadatasets-media-metadata-form').data('medium');
          console.log("TCL: medium", medium);
					// medium.model.mediumHasLanguages.forEach(function(entry) { // TODO this needs to check for current list, not mediumHasLanguages
					// 	if (entry.id.mediumLanguageTypeId == mediumLanguageTypeId && entry.id.languageId == languageId) {
					// 		duplicate = true;
					// 	}
					// });
					// if (duplicate) {
					// 	console.log("TCL: entry exists already.")
					// 	return;
					// } else {
						var languageTracksInForm = $("#timaat-mediadatasets-medium-languagetracks-form").serializeArray();
							console.log("TCL: languageTracksInForm", languageTracksInForm);
						var i = Math.floor((languageTracksInForm.length -1) / 2 ); // length -1 as the 'add new track' row is still part of the form and has to be removed
							console.log("TCL: i", i);
						$('#dynamic-languagetrack-fields').append(
							`<div class="form-group" data-role="languagetrack-entry">
							<div class="form-row">
								<div class="col-md-5">
									<label class="sr-only">Track Type</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id" name="languageTrackTypeId[`+i+`]" data-role="languageTrackTypeId[`+i+`]" required>
										<option value="1">Audio track</option>
										<option value="2">Subtitle track</option>
									</select>
								</div>
								<div class="col-md-5">
									<label class="sr-only">Track Language</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id" name="languageTrackLanguageId[`+i+`]" data-role="languageTrackLanguageId[`+i+`]" required>
										<option value="2">English</option>
										<option value="3">German</option>
										<option value="4">French</option>
										<option value="5">Spanish</option>
										<option value="6">Russian</option>
										<option value="7">Arabic</option>
									</select>
								</div>
								<div class="col-md-2 text-center">
									<button class="btn btn-danger" data-role="remove">
										<span class="fas fa-trash-alt"></span>
									</button>
								</div>
							</div>
						</div>`
						);
						($('[data-role="languageTrackTypeId['+i+']"]'))
							.find('option[value='+mediumLanguageTypeId+']')
							.attr("selected",true);
						($('[data-role="languageTrackLanguageId['+i+']"]'))
							.find('option[value='+languageId+']')
							.attr("selected",true);
						$('select[name="languageTrackTypeId['+i+']"').rules("add",
						{
							required: true,
						});
					$('select[name="languageTrackLanguageId['+i+']"').rules("add",
						{
							required: true,
						});
						listEntry.find('[data-role="languageTrackTypeId"]').val('');
						listEntry.find('[data-role="languageTrackLanguageId"]').val('');	
					}				
				// }
				else {
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove languageTrack button click
			$(document).on('click','[data-role="dynamic-languagetrack-fields"] > .form-group [data-role="remove"]', function(e) {
				e.preventDefault();
					// TODO consider undo function or popup asking if user really wants to delete a languagetrack
					console.log("DELETE languageTrack ENTRY");
					$(this).closest('.form-group').remove();
			});

			// Submit medium languageTracks button functionality
				$("#timaat-mediadatasets-medium-languagetracks-form-submit").on('click', async function(event) {
				console.log("TCL: languageTracks form: submit");
				// add rules to dynamically added form fields
				console.log("TCL: languageTracks form: valid?");
				// continue only if client side validation has passed
				event.preventDefault();
				var node = document.getElementById("new-languagetrack-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				};
				// test if form is valid
				// add empty 'add new trck' row to form
				if (!$("#timaat-mediadatasets-medium-languagetracks-form").valid()) {
					$('[data-role="new-languagetrack-fields"]').append(
						`<div class="form-group" data-role="languagetrack-entry">
							<div class="form-row">
								<div class="col-md-2 text-center">
									<div class="form-check">
										<span>Add new track:</span>
									</div>
								</div>
								<div class="col-md-4">
									<label class="sr-only">Track Type</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id" name="languageTrackTypeId" data-role="languageTrackTypeId" required>
										<option value="" disabled selected hidden>[Choose track type...]</option>
										<option value="1">Audio track</option>
										<option value="2">Subtitle track</option>
									</select>
								</div>
								<div class="col-md-4">
									<label class="sr-only">Track Language</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id" name="languageTrackLanguageId" data-role="languageTrackLanguageId" required>
										<option value="" disabled selected hidden>[Choose languagetrack language...]</option>
										<option value="2">English</option>
										<option value="3">German</option>
										<option value="4">French</option>
										<option value="5">Spanish</option>
										<option value="6">Russian</option>
										<option value="7">Arabic</option>
									</select>
								</div>
								<div class="col-md-2 text-center">
									<button class="btn btn-primary" data-role="add">
										<span class="fas fa-plus"></span>
									</button>
								</div>
							</div>
						</div>`
					);					
					return false;
				}
				console.log("TCL: languageTracks form: valid");

				// the original medium model (in case of editing an existing medium)
				var medium = $("#timaat-mediadatasets-medium-languagetracks-form").data("medium");			

				// Create/Edit medium window submitted data
				var formData = $("#timaat-mediadatasets-medium-languagetracks-form").serializeArray();
        console.log("TCL: formData", formData);
				var formLanguageTrackList = [];
				var i = 0;
				while ( i < formData.length) {
					var element = {
					languageTrackTypeId: 0,
					languageTrackLanguageId: 0,
					};
					element.languageTrackTypeId = formData[i].value;
					element.languageTrackLanguageId = formData[i+1].value;
					i = i+2;
					formLanguageTrackList[formLanguageTrackList.length] = element;
				}
				// only updates to existing languageTracks
				if (formLanguageTrackList.length == medium.model.mediumHasLanguages.length) {
					var i = 0;
					for (; i < medium.model.mediumHasLanguages.length; i++ ) { // update existing languageTracks
						var languageTrack = {
							mediumId: Number(medium.model.id),
							languageId: Number(formLanguageTrackList[i].languageTrackLanguageId),
							mediumLanguageTypeId: Number(formLanguageTrackList[i].languageTrackTypeId),
						};
						// console.log("TCL: medium.model.mediumHasLanguages[i].id", medium.model.mediumHasLanguages[i].id);
						// console.log("TCL: languageTrack", languageTrack);
						if (!(medium.model.mediumHasLanguages[i].id.languageId == languageTrack.languageId && medium.model.mediumHasLanguages[i].id.mediumLanguageTypeId == languageTrack.mediumLanguageTypeId)) {
							await TIMAAT.MediaDatasets.updateLanguageTrack(i, languageTrack, medium);
						}
					};
				}
				// update existing languageTracks and add new ones
				else if (formLanguageTrackList.length > medium.model.mediumHasLanguages.length) {
					var i = 0;
					for (; i < medium.model.mediumHasLanguages.length; i++ ) { // update existing languageTracks
						var languageTrack = {
							mediumId: Number(medium.model.id),
							languageId: Number(formLanguageTrackList[i].languageTrackLanguageId),
							mediumLanguageTypeId: Number(formLanguageTrackList[i].languageTrackTypeId),
						};
						if (!(medium.model.mediumHasLanguages[i].id.languageId == languageTrack.languageId && medium.model.mediumHasLanguages[i].id.mediumLanguageTypeId == languageTrack.mediumLanguageTypeId)) {
							await TIMAAT.MediaDatasets.updateLanguageTrack(i, languageTrack, medium);
						}
					};
					i = medium.model.mediumHasLanguages.length;
					var newLanguageTracks = [];
					for (; i < formLanguageTrackList.length; i++) { // create new languageTracks
						var languageTrack = {
							mediumId: Number(medium.model.id),
							languageId: Number(formLanguageTrackList[i].languageTrackLanguageId),
							mediumLanguageTypeId: Number(formLanguageTrackList[i].languageTrackTypeId),
						};
						newLanguageTracks.push(languageTrack);
					}
					// console.log("TCL: medium", medium);
          // console.log("TCL: newLanguageTracks", newLanguageTracks);
					await TIMAAT.MediaDatasets.addLanguageTracks(medium, newLanguageTracks);
				}
				// update existing languageTracks and delete obsolete ones
				else if (formLanguageTrackList.length < medium.model.mediumHasLanguages.length) {
					var i = 0;
					for (; i < formLanguageTrackList.length; i++ ) { // update existing languageTracks
						var languageTrack = {
							mediumId: Number(medium.model.id),
							languageId: Number(formLanguageTrackList[i].languageTrackLanguageId),
							mediumLanguageTypeId: Number(formLanguageTrackList[i].languageTrackTypeId),
						};
						if (!(medium.model.mediumHasLanguages[i].id.languageId == languageTrack.languageId && medium.model.mediumHasLanguages[i].id.mediumLanguageTypeId == languageTrack.mediumLanguageTypeId)) {
							await TIMAAT.MediaDatasets.updateLanguageTrack(i, languageTrack, medium);
						}
					};
					var i = medium.model.mediumHasLanguages.length - 1;
					for (; i >=  formLanguageTrackList.length; i-- ) { // remove obsolete languageTracks
						console.log("TCL: remove track entry i: ", i);
						await TIMAAT.MediaService.removeLanguageTrack(medium.model.mediumHasLanguages[i]);
						medium.model.mediumHasLanguages.pop();
					}
				}
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', medium);
			});

			// Cancel add/edit button in languageTracks form functionality
			$('#timaat-mediadatasets-medium-languagetracks-form-dismiss').click( function(event) {
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});
		},

		initAudios: function() {
			// nav-bar functionality
			$('#media-tab-audio-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#audioDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'audio', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});
			
			// delete audio button functionality (in audio list)
			$('#timaat-mediadatasets-audio-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-audio-delete');
				var audio = modal.data('audio');
				if (audio) TIMAAT.MediaDatasets._mediumSubtypeRemoved('audio', audio);
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add audio button functionality (opens form)
			// $('#timaat-mediadatasets-audio-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("audio")');
			$('#timaat-mediadatasets-audio-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("audio");
			});

			// audio form handlers
			// Submit audio data button functionality
			$('#timaat-mediadatasets-audio-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-media-metadata-form").valid()) return false;

				// the original audio model (in case of editing an existing audio)
				var audio = $('#timaat-mediadatasets-media-metadata-form').data('medium');		

				// Create/Edit audio window submitted data
				var formData = $("#timaat-mediadatasets-media-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (audio) { // update audio
					// medium data
					audio.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					audio.model.copyright = formDataObject.copyright;
					audio.model.remark = formDataObject.remark;
					// title data
					audio.model.title.name = formDataObject.primaryTitle;
					audio.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < audio.model.titles.length; i++) {
						if (audio.model.title.id == audio.model.titles[i].id) {
							audio.model.titles[i] = audio.model.title;
							break;
						}
					}
					// source data
					audio.model.sources[0].url = formDataObject.sourceUrl;
					audio.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					audio.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					audio.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// audio data
					audio.model.mediumAudio.length = TIMAAT.Util.parseTime(formDataObject.length);
					// TODO: audiocodecinformation

					audio.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype('audio', audio);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'audio', audio);
				} else { // create new audio
					var model = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct audio information
							id: 1,
						},
						length: TIMAAT.Util.parseTime(formDataObject.length),
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 1 // 1 = Audio. TODO check clause to find proper id
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or audio at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };
					await TIMAAT.MediaDatasets.createMediumSubtype('audio', model, medium, title, source);
					var audio = TIMAAT.MediaDatasets.audios[TIMAAT.MediaDatasets.audios.length-1];
					console.log("TCL: audio", audio);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'audio', audio);
					$('#timaat-mediadatasets-media-metadata-form').data('medium', audio);
				}
			});

			// edit content form button handler
			$('#timaat-mediadatasets-audio-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'audio', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// audio.listView.find('.timaat-mediadatasets-audio-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-audio-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initDocuments: function() {
			// nav-bar functionality
			$('#media-tab-document-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#documentDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'document', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});

			// delete document button functionality (in document list)
			$('#timaat-mediadatasets-document-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-document-delete');
				var mediumDocument = modal.data('document');
				if (mediumDocument) TIMAAT.MediaDatasets._mediumSubtypeRemoved('document', mediumDocument);
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add document button functionality (opens form)
			// $('#timaat-mediadatasets-document-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("document")');
			$('#timaat-mediadatasets-document-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("document");
			});

			// document form handlers
			// Submit document data button functionality
			$('#timaat-mediadatasets-document-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-media-metadata-form").valid()) return false;

				// the original document model (in case of editing an existing document)
				var mediumDocument = $('#timaat-mediadatasets-media-metadata-form').data('medium');			

				// Create/Edit document window submitted data
				var formData = $("#timaat-mediadatasets-media-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (mediumDocument) { // update document
					// medium data
					mediumDocument.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					mediumDocument.model.copyright = formDataObject.copyright;
					mediumDocument.model.remark = formDataObject.remark;
					// title data
					mediumDocument.model.title.name = formDataObject.primaryTitle;
					mediumDocument.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < mediumDocument.model.titles.length; i++) {
						if (mediumDocument.model.title.id == mediumDocument.model.titles[i].id) {
							mediumDocument.model.titles[i] = mediumDocument.model.title;
							break;
						}
					}
					// source data
					mediumDocument.model.sources[0].url = formDataObject.sourceUrl;
					mediumDocument.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					mediumDocument.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					mediumDocument.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// document data
					// currently empty

					mediumDocument.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype('document', mediumDocument);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'document', mediumDocument);
				} else { // create new document
					var model = {
						mediumId: 0,
					};
					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 2 // 2 = mediumDocument. TODO check clause to find proper id
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or document at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					await TIMAAT.MediaDatasets.createMediumSubtype('document', model, medium, title, source);
					var mediumDocument = TIMAAT.MediaDatasets.documents[TIMAAT.MediaDatasets.documents.length-1];
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'document', mediumDocument);
					$('#timaat-mediadatasets-media-metadata-form').data('medium', mediumDocument);
				}
			});

			// edit content form button handler
			$('#timaat-mediadatasets-document-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'document', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// document.listView.find('.timaat-mediadatasets-document-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-document-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});

		},

		initImages: function() {
			// nav-bar functionality
			$('#media-tab-image-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#imageDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'image', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});

			// delete image button functionality (in image list)
			$('#timaat-mediadatasets-image-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-image-delete');
				var image = modal.data('image');
				if (image) TIMAAT.MediaDatasets._mediumSubtypeRemoved('image', image);
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add image button functionality (opens form)
			// $('#timaat-mediadatasets-image-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("image")');
			$('#timaat-mediadatasets-image-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("image");
			});

			// image form handlers
			// Submit image data button functionality
			$('#timaat-mediadatasets-image-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-media-metadata-form").valid()) return false;

				// the original image model (in case of editing an existing image)
				var image = $('#timaat-mediadatasets-media-metadata-form').data('medium');			

				// Create/Edit image window submitted data
				var formData = $("#timaat-mediadatasets-media-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (image) { // update image
					// medium data
					image.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					image.model.copyright = formDataObject.copyright;
					image.model.remark = formDataObject.remark;
					// title data
					image.model.title.name = formDataObject.primaryTitle;
					image.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < image.model.titles.length; i++) {
						if (image.model.title.id == image.model.titles[i].id) {
							image.model.titles[i] = image.model.title;
							break;
						}
					}
					// source data
					image.model.sources[0].url = formDataObject.sourceUrl;
					image.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					image.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					image.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// image data
					image.model.mediumImage.width = formDataObject.width;
					image.model.mediumImage.height = formDataObject.height;
					image.model.mediumImage.bitDepth = formDataObject.bitDepth;

					image.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype('image', image);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'image', image);
				} else { // create new image
					var model = {
						mediumId: 0,
						width: formDataObject.width,
						height: formDataObject.height,
						bitDepth: formDataObject.bitDepth,
					};
					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 3 // 3 = image. TODO check clause to find proper id
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or image at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					await TIMAAT.MediaDatasets.createMediumSubtype('image', model, medium, title, source);
					var image = TIMAAT.MediaDatasets.images[TIMAAT.MediaDatasets.images.length-1];
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'image', image);
					$('#timaat-mediadatasets-media-metadata-form').data('medium', image);
				}
			});

			// edit content form button handler
			$('#timaat-mediadatasets-image-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'image', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// image.listView.find('.timaat-mediadatasets-image-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-image-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initSoftwares: function() {
			// nav-bar functionality
			$('#media-tab-software-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#softwareDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'software', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});

			// delete software button functionality (in software list)
			$('#timaat-mediadatasets-software-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-software-delete');
				var software = modal.data('software');
				if (software) TIMAAT.MediaDatasets._mediumSubtypeRemoved('software', software);
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add software button functionality (opens form)
			// $('#timaat-mediadatasets-software-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("software")');
			$('#timaat-mediadatasets-software-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("software");
			});

			// software form handlers
			// Submit software data button functionality
			$('#timaat-mediadatasets-software-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-media-metadata-form").valid()) return false;

				// the original software model (in case of editing an existing software)
				var software = $('#timaat-mediadatasets-media-metadata-form').data('medium');		

				// Create/Edit software window submitted data
				var formData = $("#timaat-mediadatasets-media-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (software) { // update software
					// medium data
					software.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					software.model.copyright = formDataObject.copyright;
					software.model.remark = formDataObject.remark;
					// title data
					software.model.title.name = formDataObject.primaryTitle;
					software.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < software.model.titles.length; i++) {
						if (software.model.title.id == software.model.titles[i].id) {
							software.model.titles[i] = software.model.title;
							break;
						}
					}
					// source data
					software.model.sources[0].url = formDataObject.sourceUrl;
					software.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					software.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					software.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// software data
					software.model.mediumSoftware.version = formDataObject.version;

					software.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype('software', software);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'software', software);
				} else { // create new software
					var model = {
						mediumId: 0,
						version: formDataObject.version,
					};
					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 4 // 4 = Software. TODO check clause to find proper id
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or software at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					await TIMAAT.MediaDatasets.createMediumSubtype('software', model, medium, title, source);
					var software = TIMAAT.MediaDatasets.softwares[TIMAAT.MediaDatasets.softwares.length-1];
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'software', software);
					$('#timaat-mediadatasets-media-metadata-form').data('medium', software);
				}
			});

			// edit content form button handler
			$('#timaat-mediadatasets-software-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'software', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// software.listView.find('.timaat-mediadatasets-software-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-software-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initTexts: function() {
			// nav-bar functionality
			$('#media-tab-text-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#textDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'text', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});

			// delete text button functionality (in text list)
			$('#timaat-mediadatasets-text-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-text-delete');
				var text = modal.data('text');
				if (text) TIMAAT.MediaDatasets._mediumSubtypeRemoved('text', text);
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add text button functionality (opens form)
			// $('#timaat-mediadatasets-text-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("text")');
			$('#timaat-mediadatasets-text-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("text");
			});

			// Submit text data button functionality
			$('#timaat-mediadatasets-text-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-media-metadata-form").valid()) return false;

				// the original text model (in case of editing an existing text)
				var text = $('#timaat-mediadatasets-media-metadata-form').data('medium');

				// Create/Edit text window submitted data
				var formData = $("#timaat-mediadatasets-media-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (text) { // update text
					// medium data
					text.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					text.model.copyright = formDataObject.copyright;
					text.model.remark = formDataObject.remark;
					// title data
					text.model.title.name = formDataObject.primaryTitle;
					text.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < text.model.titles.length; i++) {
						if (text.model.title.id == text.model.titles[i].id) {
							text.model.titles[i] = text.model.title;
							break;
						}
					}
					// source data
					text.model.sources[0].url = formDataObject.sourceUrl;
					text.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					text.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					text.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// text data
					text.model.mediumText.content = formDataObject.content;

					text.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype('text', text);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'text', text);
				} else { // create new text
					var model = {
						mediumId: 0,
						content: formDataObject.content,
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 5 // 5 = Text. TODO check clause to find proper id
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or text at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					await TIMAAT.MediaDatasets.createMediumSubtype('text', model, medium, title, source);
					var text = TIMAAT.MediaDatasets.texts[TIMAAT.MediaDatasets.texts.length-1];
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'text', text);
					$('#timaat-mediadatasets-media-metadata-form').data('medium', text);
				}
			});

			// edit content form button handler
			$('#timaat-mediadatasets-text-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'text', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// text.listView.find('.timaat-mediadatasets-text-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-text-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initVideos: function() {
			// nav-bar functionality
			$('#media-tab-video-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#videoDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'video', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});

			// delete video button functionality (in video list)
			$('#timaat-mediadatasets-video-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-video-delete');
				var video = modal.data('video');
				if (video) {
					TIMAAT.MediaDatasets._mediumSubtypeRemoved('video', video);
					// TIMAAT.MediaDatasets._mediumRemoved(video);
				}
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add medium button functionality (in medium list - opens datasheet form)
			// $('#timaat-mediadatasets-video-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("video")');
			$('#timaat-mediadatasets-video-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("video");
			});

			// video form handlers
			// Submit video metadata button functionality
			$('#timaat-mediadatasets-video-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-media-metadata-form").valid()) return false;

				// the original video model (in case of editing an existing video)
				var video = $('#timaat-mediadatasets-media-metadata-form').data('medium');

				// Create/Edit video window submitted data
				var formData = $("#timaat-mediadatasets-media-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (video) { // update video
					// medium data
					video.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					video.model.copyright = formDataObject.copyright;
					video.model.remark = formDataObject.remark;
					// title data
					video.model.title.name = formDataObject.primaryTitle;
					video.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < video.model.titles.length; i++) {
						if (video.model.title.id == video.model.titles[i].id) {
							video.model.titles[i] = video.model.title;
							break;
						}
					}
					// source data
					video.model.sources[0].url = formDataObject.sourceUrl;
					video.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					video.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					video.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// video data
					video.model.mediumVideo.length = TIMAAT.Util.parseTime(formDataObject.length);
					video.model.mediumVideo.videoCodec = formDataObject.videoCodec;
					video.model.mediumVideo.width = formDataObject.width;
					video.model.mediumVideo.height = formDataObject.height;
					video.model.mediumVideo.frameRate = formDataObject.frameRate;
					video.model.mediumVideo.dataRate = formDataObject.dataRate;
					video.model.mediumVideo.totalBitrate = formDataObject.totalBitrate;
					video.model.mediumVideo.isEpisode = (formDataObject.isEpisode) ? true : false;

					video.updateUI();
					console.log("TCL: video", video);
					TIMAAT.MediaDatasets.updateMediumSubtype('video', video);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'video', video);
				} else { // create new video
					var model = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct video information
							id: 1,
						},
						length: TIMAAT.Util.parseTime(formDataObject.length),
						videoCodec: formDataObject.videoCodec,
						width: formDataObject.width,
						height: formDataObject.height,
						frameRate: formDataObject.frameRate,
						dataRate: formDataObject.dataRate,
						totalBitrate: formDataObject.totalBitrate,
						isEpisode: (formDataObject.isEpisode) ? true : false,
						status: "nofile"
					};
					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 6 // 6 = Video. TODO check clause to find proper id
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or video at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					await TIMAAT.MediaDatasets.createMediumSubtype('video', model, medium, title, source);
					var video = TIMAAT.MediaDatasets.videos[TIMAAT.MediaDatasets.videos.length-1];
          console.log("TCL: video", video);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'video', video);
					$('#timaat-mediadatasets-media-metadata-form').data('medium', video);
				}
			});

			// edit content form button handler
			$('#timaat-mediadatasets-video-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'video', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// video.listView.find('.timaat-mediadatasets-video-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-video-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		initVideogames: function() {
			// nav-bar functionality
			$('#media-tab-videogame-metadata-form').click(function(event) {
				$('.nav-tabs a[href="#videogameDatasheet"]').tab('show');
				$('.form').hide();
				$('#timaat-mediadatasets-media-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'videogame', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
			});

			// delete videogame button functionality (in videogame list)
			$('#timaat-mediadatasets-videogame-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-videogame-delete');
				var videogame = modal.data('videogame');
				if (videogame) TIMAAT.MediaDatasets._mediumSubtypeRemoved('videogame', videogame);
				modal.modal('hide');
				$('#timaat-mediadatasets-media-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// add videogame button functionality (opens form)
			// $('#timaat-mediadatasets-videogame-add').attr('onclick','TIMAAT.MediaDatasets.addMedium("videogame")');
			$('#timaat-mediadatasets-videogame-add').click(function(event) {
				$('#timaat-mediadatasets-media-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("videogame");
			});

			// Submit videogame data button functionality
			$('#timaat-mediadatasets-videogame-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-media-metadata-form").valid()) return false;

				// the original videogame model (in case of editing an existing videogame)
				var videogame = $('#timaat-mediadatasets-media-metadata-form').data('medium');	

				// Create/Edit videogame window submitted data
				var formData = $("#timaat-mediadatasets-media-metadata-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (videogame) { // update videogame
					// medium data
					videogame.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					videogame.model.copyright = formDataObject.copyright;
					videogame.model.remark = formDataObject.remark;
					// title data
					videogame.model.title.name = formDataObject.primaryTitle;
					videogame.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					var i = 0;
					for (; i < videogame.model.titles.length; i++) {
						if (videogame.model.title.id == videogame.model.titles[i].id) {
							videogame.model.titles[i] = videogame.model.title;
							break;
						}
					}
					// source data
					videogame.model.sources[0].url = formDataObject.sourceUrl;
					videogame.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					videogame.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					videogame.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// videogame data
					videogame.model.mediumVideogame.isEpisode = (formDataObject.isEpisode) ? true : false;

					videogame.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype('videogame', videogame);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'videogame', videogame);
				} else { // create new videogame
					var model = {
						mediumId: 0,
						isEpisode: (formDataObject.isEpisode) ? true : false,
					};
					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 7 // 7 = Videogame. TODO check clause to find proper id
						},
						titles: [{
							id: 0,
							language: {
								id: Number(formDataObject.primaryTitleLanguageId),
							},
							name: formDataObject.primaryTitle,
						}],
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or videogame at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					await TIMAAT.MediaDatasets.createMediumSubtype('videogame', model, medium, title, source);
					var videogame = TIMAAT.MediaDatasets.videogames[TIMAAT.MediaDatasets.videogames.length-1];
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'videogame', videogame);
					$('#timaat-mediadatasets-media-metadata-form').data('medium', videogame);
				}
			});

			// edit content form button handler
			$('#timaat-mediadatasets-videogame-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', 'videogame', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				// videogame.listView.find('.timaat-mediadatasets-videogame-list-tags').popover('show');
			});

			// Cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-videogame-metadata-form-dismiss').click( function(event) {
				$('.form').hide();
			});
		},

		load: function() {
			TIMAAT.MediaDatasets.loadMedia();
			TIMAAT.MediaDatasets.loadMediaTypes();
			TIMAAT.MediaDatasets.loadAllMediumSubtypes();
		},

		loadMediaTypes: function() {
    	// console.log("TCL: loadMediaTypes: function()");
			TIMAAT.MediaService.listMediaTypes(TIMAAT.MediaDatasets.setMediaTypeLists);
		},
		
		loadMedia: function() {
			// console.log("TCL: loadMedia: function()");
			$('.media-cards').hide();
			$('.media-card').show();
			TIMAAT.MediaService.listMedia(TIMAAT.MediaDatasets.setMediumLists);
		},

		loadMediumSubtype: function(mediumSubtype) {
			$('.media-cards').hide();
			$('.'+mediumSubtype+'s-card').show();
			$('#timaat-mediadatasets-media-metadata-form').data('mediumType', mediumSubtype);
			switch (mediumSubtype) {
				case 'audio':
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setAudioLists);
					break;
				case 'document':
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setDocumentLists);
					break;
				case 'image':
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setImageLists);
					break;
				case 'software':
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setSoftwareLists);
					break;
				case 'text':
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setTextLists);
					break;
				case 'video':
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideoLists);
					break;
				case 'videogame':
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideogameLists);
					break;
			};
		},

		loadAllMediumSubtypes: function() {
			TIMAAT.MediaService.listMediumSubtype('audio', TIMAAT.MediaDatasets.setAudioLists);
			TIMAAT.MediaService.listMediumSubtype('document', TIMAAT.MediaDatasets.setDocumentLists);
			TIMAAT.MediaService.listMediumSubtype('image', TIMAAT.MediaDatasets.setImageLists);
			TIMAAT.MediaService.listMediumSubtype('software', TIMAAT.MediaDatasets.setSoftwareLists);
			TIMAAT.MediaService.listMediumSubtype('text', TIMAAT.MediaDatasets.setTextLists);
			TIMAAT.MediaService.listMediumSubtype('video', TIMAAT.MediaDatasets.setVideoLists);
			TIMAAT.MediaService.listMediumSubtype('videogame', TIMAAT.MediaDatasets.setVideogameLists);
		},

		setMediaTypeLists: function(mediaTypes) {
			// console.log("TCL: mediaTypes", mediaTypes);
			if ( !mediaTypes ) return;
			$('#timaat-mediatype-list-loader').remove();
			// clear old UI list
			$('#timaat-mediatype-list').empty();
			// setup model
			var medTypes = Array();
			mediaTypes.forEach(function(mediaType) { if ( mediaType.id > 0 ) medTypes.push(new TIMAAT.MediaType(mediaType)); });
			TIMAAT.MediaDatasets.mediaTypes = medTypes;
			TIMAAT.MediaDatasets.mediaTypes.model = mediaTypes;
		},

		setMediumLists: function(media) {
			$('.form').hide();
			$('.media-data-tabs').hide();
    	// console.log("TCL: setMediumLists -> media", media);
			if ( !media ) return;

			$('#timaat-mediadatasets-media-metadata-form').data('mediumType', 'medium');
			$('#timaat-mediadatasets-medium-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-medium-list').empty();
			// setup model
			var meds = Array();
			TIMAAT.MediaDatasets.mediaDatasets = new Array();
			media.forEach(function(medium) { 
				if ( medium.id > 0 ) {
					meds.push(new TIMAAT.Medium(medium, 'medium'));
					TIMAAT.MediaDatasets.mediaDatasets.push(medium);
				}
			});
			TIMAAT.MediaDatasets.media = meds;
			TIMAAT.MediaDatasets.media.model = media;
			// also set up video chooser list
			TIMAAT.VideoChooser.setMedia(TIMAAT.MediaDatasets.mediaDatasets);
		},

		setAudioLists: function(audios) {
			console.log("TCL: setAudioLists -> audios", audios);
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( !audios ) return;
			
			$('#timaat-mediadatasets-audio-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-audio-list').empty();
			// setup model
			var auds = Array();
			var newAudio;
			audios.forEach(function(audio) { 
				if (audio.id > 0) {
					newAudio = new TIMAAT.Medium(audio, 'audio');
					auds.push(newAudio);
				}
			});
			TIMAAT.MediaDatasets.audios = auds;
			TIMAAT.MediaDatasets.audios.model = audios;
		},

		setDocumentLists: function(documents) {
			console.log("TCL: setDocumentLists -> documents", documents);
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( !documents ) return;

			$('#timaat-mediadatasets-document-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-document-list').empty();
			// setup model
			var docs = Array();
			var newDocument;
			documents.forEach(function(mediumDocument) { 
				if ( mediumDocument.id > 0 ) {
					newDocument = new TIMAAT.Medium(mediumDocument, 'document');
					docs.push(newDocument);
				}
			});
			TIMAAT.MediaDatasets.documents = docs;
			TIMAAT.MediaDatasets.documents.model = documents;
		},

		setImageLists: function(images) {
			console.log("TCL: setImageLists -> images", images);
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( !images ) return;

			$('#timaat-mediadatasets-image-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-image-list').empty();
			// setup model
			var imgs = Array();
			var newImage;
			images.forEach(function(image) { 
				if ( image.id > 0 ) {
					newImage = new TIMAAT.Medium(image, 'image');
					imgs.push(newImage);
				}
			});
			TIMAAT.MediaDatasets.images = imgs;
			TIMAAT.MediaDatasets.images.model = images;
		},

		setSoftwareLists: function(softwares) {
			console.log("TCL: setSoftwareLists -> softwares", softwares);
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( !softwares ) return;

			$('#timaat-mediadatasets-software-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-software-list').empty();
			// setup model
			var softws = Array();
			var newSoftware;
			softwares.forEach(function(software) { 
				if ( software.id > 0 ) {
					newSoftware = new TIMAAT.Medium(software, 'software');
					softws.push(newSoftware);
				}
			});
			TIMAAT.MediaDatasets.softwares = softws;
			TIMAAT.MediaDatasets.softwares.model = softwares;
		},

		setTextLists: function(texts) {
			console.log("TCL: setTextLists -> texts", texts);
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( !texts ) return;
			$('#timaat-mediadatasets-text-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-text-list').empty();
			// setup model
			var txts = Array();
			var newText;
			texts.forEach(function(text) { 
				if ( text.id > 0 ) {
					newText = new TIMAAT.Medium(text, 'text');
					txts.push(newText);
				}
			});
			TIMAAT.MediaDatasets.texts = txts;
			TIMAAT.MediaDatasets.texts.model = texts;
		},
		
		setVideoLists: function(videos) {
			console.log("TCL: setVideoLists -> videos", videos);
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( !videos ) return;

			$('#timaat-mediadatasets-video-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-video-list').empty();
			// setup model
			var vids = Array();
			var newVideo;
			videos.forEach(function(video) { 
				if ( video.id > 0 ) {
					newVideo = new TIMAAT.Medium(video, 'video');
					vids.push(newVideo);
				}
			});
			TIMAAT.MediaDatasets.videos = vids;
			TIMAAT.MediaDatasets.videos.model = videos;
			// also set video chooser list
			// TIMAAT.VideoChooser.setVideoList(TIMAAT.MediaDatasets.mediaDatasets);
		},

		setVideogameLists: function(videogames) {
			console.log("TCL: setVideogameLists -> videogames", videogames);
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( !videogames ) return;
			$('#timaat-mediadatasets-videogame-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-videogame-list').empty();
			// setup model
			var vdgms = Array();
			var newVideogame;
			videogames.forEach(function(videogame) { 
				if ( videogame.id > 0 ) {
					newVideogame = new TIMAAT.Medium(videogame, 'videogame');
					vdgms.push(newVideogame);
				}
			});
			TIMAAT.MediaDatasets.videogames = vdgms;
			TIMAAT.MediaDatasets.videogames.model = videogames;
		},

		setMediumTitleList: function(medium) {
			// console.log("TCL: setMediumTitleList -> medium", medium);
			if ( !medium ) return;
			$('#timaat-title-list-loader').remove();
			// clear old UI list
			$('#timaat-title-list').empty();
			// setup model
			var mediumTitles = Array();
			medium.model.titles.forEach(function(title) { 
				if ( title.mediumId > 0 )
					mediumTitles.model.titles.push(title); 
			});
		},

		setMediumLanguageTrackList: function(medium) {
			// console.log("TCL: setMediumLanguageTrackList -> medium", medium);
			if ( !medium ) return;
			$('#timaat-languagetrack-list-loader').remove();
			// clear old UI list
			$('#timaat-languagetrack-list').empty();
			// setup model
			var mediumLanguageTracks = Array();
			medium.model.mediumHasLanguages.forEach(function(languageTrack) { 
				if ( languageTrack.mediumId > 0 )
					mediumLanguageTracks.model.mediumHasLanguages.push(languageTrack); 
			});
		},

		addMedium: function(mediumType) {	
			// console.log("TCL: addMedium: function()");
			console.log("TCL: addMedium: mediumType", mediumType);
			$('.form').hide();
			$('.media-data-tabs').hide();
			$('.nav-tabs a[href="#'+mediumType+'Datasheet"]').show();
			// $('.nav-tabs a[href="#mediumTitles"]').hide();
			$('#timaat-mediadatasets-media-metadata-form').data(mediumType, null);
			mediumFormMetadataValidator.resetForm();
			$('#timaat-mediadatasets-media-metadata-form').trigger('reset');
			$('#timaat-mediadatasets-media-metadata-form').show();
			$('.datasheet-data').hide();
			$('.title-data').show();
			$('.medium-data').show();
			if (mediumType == "medium") {
				$('.mediumtype-data').show();
			}
			else {
				$('.mediumtype-data').hide();
			}
			$('.source-data').show();
			$('.'+mediumType+'-data').show();
			$('.datasheet-form-edit-button').hide();
			$('.datasheet-form-buttons').hide()
			$('.'+mediumType+'-datasheet-form-submit').show();
			$('#timaat-mediadatasets-media-metadata-form :input').prop("disabled", false);
			$('#timaat-mediadatasets-media-metadata-title').focus();

			// setup form
			$('#mediumFormHeader').html(mediumType+" hinzufügen");
			$('#timaat-mediadatasets-'+mediumType+'-metadata-form-submit').html("Hinzufügen");
			$('#timaat-mediadatasets-media-metadata-releasedate').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
			$('#timaat-mediadatasets-media-metadata-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
			$('#timaat-mediadatasets-media-metadata-source-isprimarysource').prop('checked', true);
			$('#timaat-mediadatasets-media-metadata-source-isstillavailable').prop('checked', false);
		},

		mediumFormDatasheet: function(action, mediumType, mediumTypeData) {
    	console.log("TCL: action, mediumType, mediumTypeData", action, mediumType, mediumTypeData);
			$('#timaat-mediadatasets-media-metadata-form').trigger('reset');
			$('.datasheet-data').hide();
			$('.title-data').show();
			$('.medium-data').show();
			if (mediumType == "medium") {
				$('.mediumtype-data').show();
			}
			else {
				$('.mediumtype-data').hide();
			}
			$('.source-data').show();
			$('.'+mediumType+'-data').show();
			mediumFormMetadataValidator.resetForm();
			$('.'+mediumType+'-data-tab').show();
			$('.title-data-tab').show();
			$('.nav-tabs a[href="#'+mediumType+'Datasheet"]').focus();
			$('#timaat-mediadatasets-media-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-mediadatasets-media-metadata-form :input').prop("disabled", true);
				$('.datasheet-form-edit-button').hide();
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit').show();
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit').prop("disabled", false);
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit :input').prop("disabled", false);
				$('.datasheet-form-buttons').hide()
				$('#mediumFormHeader').html(mediumType+" Datasheet");
			}
			else if (action == 'edit') {
				$('.datasheet-form-buttons').hide();
				$('.'+mediumType+'-datasheet-form-submit').show();
				$('#timaat-mediadatasets-media-metadata-form :input').prop("disabled", false);
				if (mediumType == "medium") {
					$('#timaat-mediadatasets-media-metadata-mediatype-id').prop("disabled", true);
				}
				else {
					$('#timaat-mediadatasets-media-metadata-mediatype-id').hide();
				}
				$('#timaat-mediadatasets-media-metadata-releasedate').datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: 'YYYY-MM-DD'});
				$('#timaat-mediadatasets-media-metadata-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm'});
				$('.datasheet-form-edit-button').hide();
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit').prop("disabled", true);
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit :input').prop("disabled", true);
				$('#mediumFormHeader').html(mediumType+" bearbeiten");
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-submit').html("Speichern");
				$('#timaat-mediadatasets-media-metadata-title').focus();
			}

			console.log("TCL: mediumTypeData", mediumTypeData);
			// setup UI
			var data = mediumTypeData.model;
			// medium data
			$('#timaat-mediadatasets-media-metadata-mediatype-id').val(data.mediaType.id);
			$('#timaat-mediadatasets-media-metadata-remark').val(data.remark);
			$('#timaat-mediadatasets-media-metadata-copyright').val(data.copyright);
			if (isNaN(moment(data.releaseDate)))
				$('#timaat-mediadatasets-media-metadata-releasedate').val('');
				else $('#timaat-mediadatasets-media-metadata-releasedate').val(moment(data.releaseDate).format('YYYY-MM-DD'));
			// title data
			$('#timaat-mediadatasets-media-metadata-title').val(data.title.name);
			$('#timaat-mediadatasets-media-metadata-title-language-id').val(data.title.language.id);
			// source data
			if (data.sources[0].isPrimarySource)
				$('#timaat-mediadatasets-media-metadata-source-isprimarysource').prop('checked', true);
				else $('#timaat-mediadatasets-media-metadata-source-isprimarysource').prop('checked', false);
			$('#timaat-mediadatasets-media-metadata-source-url').val(data.sources[0].url);
			if (isNaN(moment.utc(data.sources[0].lastAccessed))) 
				$('#timaat-mediadatasets-media-metadata-source-lastaccessed').val('');
				else $('#timaat-mediadatasets-media-metadata-source-lastaccessed').val(moment.utc(data.sources[0].lastAccessed).format('YYYY-MM-DD HH:mm'));
			if (data.sources[0].isStillAvailable)
				$('#timaat-mediadatasets-media-metadata-source-isstillavailable').prop('checked', true);
				else $('#timaat-mediadatasets-media-metadata-source-isstillavailable').prop('checked', false);
			// medium subtype specific data
			switch (mediumType) {
				case 'audio':
					$("#timaat-mediadatasets-audio-metadata-length").val(mediumTypeData.model.mediumAudio.length);
				break;
				case "mediumDocument":
				break;
				case 'image':
					$("#timaat-mediadatasets-image-metadata-width").val(mediumTypeData.model.mediumImage.width);
					$("#timaat-mediadatasets-image-metadata-height").val(mediumTypeData.model.mediumImage.height);
					$("#timaat-mediadatasets-image-metadata-bitdepth").val(mediumTypeData.model.mediumImage.bitDepth);
				break;
				case 'software':
					$("#timaat-mediadatasets-software-metadata-version").val(mediumTypeData.model.mediumSoftware.version);
				break;
				case 'text':
					$("#timaat-mediadatasets-text-metadata-content").val(mediumTypeData.model.mediumText.content);
				break;
				case 'video':
					$('#timaat-mediadatasets-video-metadata-length').val(mediumTypeData.model.mediumVideo.length);
					$('#timaat-mediadatasets-video-metadata-videocodec').val(mediumTypeData.model.mediumVideo.videoCodec);
					$('#timaat-mediadatasets-video-metadata-width').val(mediumTypeData.model.mediumVideo.width);
					$('#timaat-mediadatasets-video-metadata-height').val(mediumTypeData.model.mediumVideo.height);
					$('#timaat-mediadatasets-video-metadata-framerate').val(mediumTypeData.model.mediumVideo.frameRate);
					$('#timaat-mediadatasets-video-metadata-datarate').val(mediumTypeData.model.mediumVideo.dataRate);
					$('#timaat-mediadatasets-video-metadata-totalbitrate').val(mediumTypeData.model.mediumVideo.totalBitrate);
					if (mediumTypeData.model.mediumVideo.isEpisode)
						$('#timaat-mediadatasets-video-metadata-isepisode').prop('checked', true);
						else $('#timaat-mediadatasets-video-metadata-isepisode').prop('checked', false);
				break;
				case 'videogame':
					if (mediumTypeData.model.mediumVideogame.isEpisode)
					$("#timaat-mediadatasets-videogame-metadata-isepisode").prop('checked', true);
					else $("#timaat-mediadatasets-videogame-metadata-isepisode").prop('checked', false);
				break;
			}
			$('#timaat-mediadatasets-media-metadata-form').data(mediumType, mediumTypeData);
		},

		mediumFormTitles: function(action, medium) {
    	// console.log("TCL: mediumFormTitles: action, medium", action, medium);
			var node = document.getElementById("dynamic-title-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			var node = document.getElementById("new-title-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			$('#timaat-mediadatasets-medium-titles-form').trigger('reset');
			mediumFormTitlesValidator.resetForm();
			// $('.medium-data-tab').show();
			$('.nav-tabs a[href="#mediumTitles"]').focus();
			$('#timaat-mediadatasets-medium-titles-form').show();
			
			// setup UI
			// title data
			var i = 0;
			var numTitles = medium.model.titles.length;
      // console.log("TCL: medium.model.titles", medium.model.titles);
			for (; i< numTitles; i++) {
				// console.log("TCL: medium.model.titles[i].language.id", medium.model.titles[i].language.id);
				$('[data-role="dynamic-title-fields"]').append(
					`<div class="form-group" data-role="title-entry">
						<div class="form-row">
							<div class="col-md-2 text-center">
								<div class="form-check">
									<label class="sr-only" for="isPrimaryTitle"></label>
									<input class="form-check-input isPrimaryTitle" type="radio" name="isPrimaryTitle" placeholder="Is Primary Title" data-role="primaryTitle[`+medium.model.titles[i].id+`]">
								</div>
							</div>
							<div class="col-md-6">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="title[`+i+`]" value="`+medium.model.titles[i].name+`" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" data-role="title[`+i+`]" required>
							</div>
							<div class="col-md-3">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" name="titleLanguageId[`+i+`]" data-role="titleLanguageId[`+medium.model.titles[i].language.id+`]" required>
									<!-- <option value="" disabled selected hidden>[Choose title language...]</option> -->
									<option value="2">English</option>
									<option value="3">German</option>
									<option value="4">French</option>
									<option value="5">Spanish</option>
									<option value="6">Russian</option>
									<option value="7">Arabic</option>
								</select>
							</div>
							<div class="col-md-1 text-center">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
					);
					$('[data-role="titleLanguageId['+medium.model.titles[i].language.id+']"')
						.find('option[value='+medium.model.titles[i].language.id+']')
						.attr("selected",true);
					if (medium.model.titles[i].id == medium.model.title.id) {
						$('[data-role="primaryTitle['+medium.model.titles[i].id+']"')
							.prop("checked",true);							
					}
					$('input[name="title['+i+']"').rules("add",
						{
							required: true,
							minlength: 3,
							maxlength: 200,
						});
					$('select[name="titleLanguageId['+i+']"').rules("add",
						{
							required: true,
						});
			};

			if ( action == 'show') {
				$('#timaat-mediadatasets-medium-titles-form :input').prop("disabled", true);
				$('#timaat-mediadatasets-medium-titles-form-edit').show();
				$('#timaat-mediadatasets-medium-titles-form-edit').prop("disabled", false);
				$('#timaat-mediadatasets-medium-titles-form-edit :input').prop("disabled", false);
				$('#timaat-mediadatasets-medium-titles-form-submit').hide();
				$('#timaat-mediadatasets-medium-titles-form-dismiss').hide();
				$('[data-role="new-title-fields"').hide();
				$('.title-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumTitlesLabel').html("Medium Titelliste");
			}
			else if (action == 'edit') {
				$('#timaat-mediadatasets-medium-titles-form-submit').show();
				$('#timaat-mediadatasets-medium-titles-form-dismiss').show();
				$('#timaat-mediadatasets-medium-titles-form :input').prop("disabled", false);
				$('#timaat-mediadatasets-medium-titles-form-edit').hide();
				$('#timaat-mediadatasets-medium-titles-form-edit').prop("disabled", true);
				$('#timaat-mediadatasets-medium-titles-form-edit :input').prop("disabled", true);
				$('[data-role="new-title-fields"').show();
				$('.title-form-divider').show();
				$('#mediumTitlesLabel').html("Medium Titelliste bearbeiten");
				$('#timaat-mediadatasets-medium-titles-form-submit').html("Speichern");
				$('#timaat-mediadatasets-media-metadata-title').focus();

				// fields for new title entry
				$('[data-role="new-title-fields"]').append(
					`<div class="form-group" data-role="title-entry">
						<div class="form-row">
							<div class="col-md-2 text-center">
								<div class="form-check">
									<span>Add new title:</span>
								</div>
							</div>
							<div class="col-md-6">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="title" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" data-role="title" required>
							</div>
							<div class="col-md-3">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" name="titleLanguageId" required>
									<option value="" disabled selected hidden>[Choose title language...]</option>
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
				$('#timaat-mediadatasets-medium-titles-form').data('medium', medium);
			}
		},

		mediumFormLanguageTracks: function(action, medium) {
    	// console.log("TCL: mediumFormLanguageTracks: action, medium", action, medium);
			var node = document.getElementById("dynamic-languagetrack-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			var node = document.getElementById("new-languagetrack-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			$('#timaat-mediadatasets-medium-languagetracks-form').trigger('reset');
			mediumFormLanguageTracksValidator.resetForm();
			// $('.medium-data-tab').show();
			$('.nav-tabs a[href="#mediumLanguageTracks"]').focus();
			$('#timaat-mediadatasets-medium-languagetracks-form').show();
			
			// setup UI
			// languageTrack data
			var i = 0;
			var numLanguageTracks = medium.model.mediumHasLanguages.length;
			// console.log("TCL: medium.model.mediumHasLanguages", medium.model.mediumHasLanguages);
			for (; i< numLanguageTracks; i++) {
				// console.log("TCL: TIMAAT.MediaDatasets.mediumHasLanguages[i]", medium.model.mediumHasLanguages[i]);
				// console.log("TCL: medium.model.mediumHasLanguages[i].languageId", medium.model.mediumHasLanguages[i].languageId);
				$('[data-role="dynamic-languagetrack-fields"]').append(
					`<div class="form-group" data-role="languagetrack-entry">
						<div class="form-row">
							<div class="col-md-5">
								<label class="sr-only">Track Type</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id" name="languageTrackTypeId[`+i+`]" data-role="languageTrackTypeId[`+medium.model.mediumHasLanguages[i].mediumLanguageType.id+`]" required>
									<!-- <option value="" disabled selected hidden>[Choose Track type...]</option> -->
									<option value="1">Audio Track</option>
									<option value="2">Subtitle Track</option>
								</select>
							</div>
							<div class="col-md-5">
								<label class="sr-only">Track Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id" name="languageTrackLanguageId[`+i+`]" data-role="languageTrackLanguageId[`+medium.model.mediumHasLanguages[i].language.id+`]" required>
									<!-- <option value="" disabled selected hidden>[Choose Track language...]</option> -->
									<option value="2">English</option>
									<option value="3">German</option>
									<option value="4">French</option>
									<option value="5">Spanish</option>
									<option value="6">Russian</option>
									<option value="7">Arabic</option>
								</select>
							</div>
							<div class="col-md-2 text-center">
								<button class="btn btn-danger" data-role="remove">
									<span class="fas fa-trash-alt"></span>
								</button>
							</div>
						</div>
					</div>`
					);
					$('[data-role="languageTrackTypeId['+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']"')
						.find('option[value='+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']')
						.attr("selected",true);
					$('[data-role="languageTrackLanguageId['+medium.model.mediumHasLanguages[i].language.id+']"')
						.find('option[value='+medium.model.mediumHasLanguages[i].language.id+']')
						.attr("selected",true);
					$('select[name="languageTrackTypeId['+i+']"').rules("add",
						{
							required: true,
						});
					$('select[name="languageTrackLanguageId['+i+']"').rules("add",
						{
							required: true,
						});
			};

			if ( action == 'show') {
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop("disabled", true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').show();
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').prop("disabled", false);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit :input').prop("disabled", false);
				$('#timaat-mediadatasets-medium-languagetracks-form-submit').hide();
				$('#timaat-mediadatasets-medium-languagetracks-form-dismiss').hide();
				$('[data-role="new-languagetrack-fields"').hide();
				$('.languagetrack-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumLanguageTracksLabel').html("Medium Spurliste");
			}
			else if (action == 'edit') {
				$('#timaat-mediadatasets-medium-languagetracks-form-submit').show();
				$('#timaat-mediadatasets-medium-languagetracks-form-dismiss').show();
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop("disabled", false);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').hide();
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').prop("disabled", true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit :input').prop("disabled", true);
				$('[data-role="new-languagetrack-fields"').show();
				$('.languagetrack-form-divider').show();
				$('#mediumLanguageTracksLabel').html("Medium Spurliste bearbeiten");
				$('#timaat-mediadatasets-medium-languagetracks-form-submit').html("Speichern");
				// $('#timaat-mediadatasets-media-metadata-languagetrack').focus();

				// fields for new languageTrack entry
				// add empty 'add new track' row to form when edit mode is enabled
				$('[data-role="new-languagetrack-fields"]').append(
					`<div class="form-group" data-role="languagetrack-entry">
						<div class="form-row">
							<div class="col-md-2 text-center">
								<div class="form-check">
									<span>Add new Track:</span>
								</div>
							</div>
							<div class="col-md-4">
								<label class="sr-only">Track type</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id" name="languageTrackTypeId" data-role="languageTrackTypeId" required>
									<option value="" disabled selected hidden>[Choose Track type...]</option>
									<option value="1">Audio Track</option>
									<option value="2">Subtitle Track</option>
								</select>
							</div>
							<div class="col-md-4">
								<label class="sr-only">Track language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id" name="languageTrackLanguageId" data-role="languageTrackLanguageId" required>
									<option value="" disabled selected hidden>[Choose Track language...]</option>
									<option value="2">English</option>
									<option value="3">German</option>
									<option value="4">French</option>
									<option value="5">Spanish</option>
									<option value="6">Russian</option>
									<option value="7">Arabic</option>
								</select>
							</div>
							<div class="col-md-2 text-center">
								<button class="btn btn-primary" data-role="add">
									<span class="fas fa-plus"></span>
								</button>
							</div>
						</div>
					</div>`
				);
				$('#timaat-mediadatasets-medium-languagetracks-form').data('medium', medium);
			}
		},

		createMedium: async function(mediumModel, title, source) {
			// createMedium: async function(mediumModel, mediumModelTranslation) { // medium has no translation table at the moment
			// NO MEDIUM SHOULD BE CREATED DIRECTLY. CREATE VIDEO, IMAGE, ETC. INSTEAD
			// This routine can be used to create empty media of a certain type
			// console.log("TCL: createMedium: async function -> mediumModel, title, source", mediumModel, title, source);
			try {
				// create title
				var newTitle = await TIMAAT.MediaService.createTitle(title);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {				
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.title = newTitle;
				tempMediumModel.source = source;
				var newMediumModel = await TIMAAT.MediaService.createMedium(tempMediumModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// update source (createMedium created an empty source)
				source.id = newMediumModel.sources[0].id;
				var updatedSource = await TIMAAT.MediaService.updateSource(source);
				newMediumModel.sources[0] = updatedSource; // TODO refactor once several sources can be added

				// create medium translation with medium id
				// var newTranslationData = await TIMAAT.MediaService.createMediumTranslation(newMediumModel, mediumModelTranslation);
				// newMediumModel.mediumTranslations[0] = newTranslationData;
				
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// push new medium to dataset model
				await TIMAAT.MediaDatasets._mediumAdded(newMediumModel);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		createMediumSubtype: async function(mediumSubtype, mediumSubtypeModel, mediumModel, title, source) {
    	console.log("TCL: mediumSubtype", mediumSubtype);
    	console.log("TCL: mediumModel", mediumModel);
			// createMediumSubtype: async function(mediumModel, mediumModelTranslation, mediumSubtypeModel) { // mediumSubtype has no translation table at the moment
			// console.log("TCL: createMediumSubtype: async function-> mediumSubtypeModel, mediumModel, title, source", mediumSubtypeModel, mediumModel, title, source);
			try {
				// create title
				var newTitle = await TIMAAT.MediaService.createTitle(title);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.title = newTitle;
				tempMediumModel.source = source;
				var newMediumModel = await TIMAAT.MediaService.createMedium(tempMediumModel);
        console.log("TCL: newMediumModel", newMediumModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// update source (createMedium created an empty source)
				source.id = newMediumModel.sources[0].id;
				var updatedSource = await TIMAAT.MediaService.updateSource(source);
				newMediumModel.sources[0] = updatedSource; // TODO refactor once several sources can be added
			} catch(error) {
				console.log( "error: ", error);
			};
			// try {
			// 	// push new medium to dataset model
			// 	await TIMAAT.MediaDatasets._mediumAdded(newMediumModel);
				
			// 	// create medium translation with medium id
			// 	// await TIMAAT.MediaService.createMediumTranslation(newMediumModel, mediumModelTranslation);
			// 	// newMediumModel.mediumTranslations[0] = mediumModelTranslation;
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };
			try {
				// create mediumSubtype with medium id
				mediumSubtypeModel.mediumId = newMediumModel.id;
				var newMediumSubtypeModel = await TIMAAT.MediaService.createMediumSubtype(mediumSubtype, newMediumModel, mediumSubtypeModel);
        console.log("TCL: newMediumSubtypeModel", newMediumSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			try {
				// push new mediumSubtype to dataset model
				console.log("TCL: newMediumModel", newMediumModel);
				switch (mediumSubtype) {
					case 'audio':
						newMediumModel.mediumAudio = mediumSubtypeModel;
					break;
					case 'document':
						newMediumModel.mediumDocument = mediumSubtypeModel;
					break;
					case 'image':
						newMediumModel.mediumImage = mediumSubtypeModel;
					break;
					case 'software':
						newMediumModel.mediumSoftware = mediumSubtypeModel;
					break;
				  case 'text':
						newMediumModel.mediumText = mediumSubtypeModel;
					break;
					case 'video':
						newMediumModel.mediumVideo = mediumSubtypeModel;
					break;
					case 'videogame':
						newMediumModel.mediumVideogame = mediumSubtypeModel;
					break;
				};
				console.log("TCL: newMediumModel", newMediumModel);
				await TIMAAT.MediaDatasets._mediumSubtypeAdded(mediumSubtype, newMediumModel);
			} catch(error) {
				console.log( "error: ", error);
			};
		},
		
		createTitle: async function(titleModel) {
			// console.log("TCL: createTitle: async function -> titleModel", titleModel);
			try {
				// create title
				var newTitleModel = await TIMAAT.MediaService.createTitle(titleModel.model);
        console.log("TCL: newTitleModel", newTitleModel);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		addTitles: async function(medium, newTitles) {
			// console.log("TCL: addTitles: async function -> medium, newTitles", medium, newTitles);
			try {
				// create title
				var i = 0;
				for (; i <newTitles.length; i++) {
					// var newTitle = await TIMAAT.MediaService.createTitle(newTitles[i]);
					var addedTitleModel = await TIMAAT.MediaService.addTitle(medium.model.id, newTitles[i]);
					medium.model.titles.push(addedTitleModel);
					console.log("TCL: medium.model.titles", medium.model.titles);
					console.log("TCL: medium.model.titles.length", medium.model.titles.length);	
				}
				// await TIMAAT.MediaDatasets.updateMedium(medium);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		addLanguageTracks: async function(medium, newLanguageTracks) {
			// console.log("TCL: addLanguageTracks: async function -> newLanguageTracks", newLanguageTracks);
			try {
				// create languageTrack
				var i = 0;
				for (; i < newLanguageTracks.length; i++) {
					// var newLanguageTrack = await TIMAAT.MediaService.createLanguageTrack(newLanguageTracks[i]);
					// console.log("TCL: newLanguageTracks[i]", newLanguageTracks[i]);
					var addedLanguageTrackModel = await TIMAAT.MediaService.addLanguageTrack(newLanguageTracks[i]);
          // console.log("TCL: addedLanguageTrackModel", addedLanguageTrackModel);
					addedLanguageTrackModel.id = newLanguageTracks[i];
          // console.log("TCL: addedLanguageTrackModel", addedLanguageTrackModel);
					medium.model.mediumHasLanguages.push(addedLanguageTrackModel);
					console.log("TCL: medium.model.mediumHasLanguages", medium.model.mediumHasLanguages);
					console.log("TCL: medium.model.mediumHasLanguages.length", medium.model.mediumHasLanguages.length);	
				}
				// await TIMAAT.MediaDatasets.updateMedium(medium);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		updateMedium: async function(medium) {
		// console.log("TCL: updateMedium: async function -> medium at beginning of update process: ", medium);
			try {
				// update primary title
				var tempTitle = await TIMAAT.MediaService.updateTitle(medium.model.title);
				medium.model.title = tempTitle;

				// update source
				var tempSource = await TIMAAT.MediaService.updateSource(medium.model.sources[0]);
				medium.model.sources[0] = tempSource;

				// update data that is part of medium (includes updating last edited by/at)
				// console.log("TCL: updateMedium: async function - medium.model", medium.model);
				var tempMediumModel = await TIMAAT.MediaService.updateMedium(medium.model);
        console.log("TCL: tempMediumModel", tempMediumModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			// try { // medium has no translation at the moment
			// 	// update data that is part of  medium translation
			// 	// medium.mediumTranslation[0] = await	TIMAAT.MediaService.updateMediumTranslation(medium);
			// 	var tempMediumTranslation = await	TIMAAT.MediaService.updateMediumTranslation(medium);
			// 	medium.model.mediumTranslations[0].name = tempMediumTranslation.name;			
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };
			medium.updateUI();
		},

		updateMediumSubtype: async function(mediumSubtype, medium) {
			console.log("TCL: updateMediumSubtypeData async function -> mediumSubtype, mediumSubtypeData at beginning of update process: ", mediumSubtype, medium);
			try {
				// update title
				console.log("TCL: update title via update submedium")
				var tempTitle = await TIMAAT.MediaService.updateTitle(medium.model.title);
				medium.model.title = tempTitle;
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update source
				var tempSource = await TIMAAT.MediaService.updateSource(medium.model.sources[0]);
				medium.model.sources[0] = tempSource;
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of mediumSubtypeData
				// console.log("TCL: mediumSubtype", mediumSubtype);
				// console.log("TCL: mediumSubtypeData.model", mediumSubtypeData.model);
				// var tempMediumSubtypeData = mediumSubtypeData;
				// tempMediumSubtypeData.model.medium.sources = null;
				// console.log("TCL: tempMediumSubtypeData", tempMediumSubtypeData);
				var tempSubtypeModel;
				switch (mediumSubtype) {
					case 'audio':
						tempSubtypeModel = medium.model.mediumAudio;
					break;
					case 'document':
						tempSubtypeModel = medium.model.mediumDocument;
						break;
					case 'image':
						tempSubtypeModel = medium.model.mediumImage;
						break;
					case 'software':
						tempSubtypeModel = medium.model.mediumSoftware;
						break;
					case 'text':
						tempSubtypeModel = medium.model.mediumText;
						break;
					case 'video':
						tempSubtypeModel = medium.model.mediumVideo;
						break;
					case 'videogame':
						tempSubtypeModel = medium.model.mediumVideogame;
						break;
				}
				var tempMediumSubtypeModel = await TIMAAT.MediaService.updateMediumSubtype(mediumSubtype, tempSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of medium and its translation
				// var mediumSubtypeMediumModel = mediumSubtypeData;
        // console.log("TCL: updateMediumSubtype: async function - mediumSubtypeMediumModel", mediumSubtypeMediumModel);
				var tempMediumSubtypeModelUpdate = await TIMAAT.MediaService.updateMedium(medium.model);				
			} catch(error) {
				console.log( "error: ", error);
			};
			medium.updateUI();
		},

		updateTitle: async function(title, medium) {
			// console.log("TCL: updateTitle: async function -> title at beginning of update process: ", title);
			try {
				// update title
				var tempTitle = await TIMAAT.MediaService.updateTitle(title);
				console.log("TCL: tempTitle", tempTitle);
				var i = 0;
				for (; i < medium.model.titles.length; i++) {
					if (medium.model.titles[i].id == title.id)
						medium.model.titles[i] = tempTitle;
				}

				// update data that is part of medium (includes updating last edited by/at)
				// console.log("TCL: updateMedium: async function - medium.model", medium.model);
				// var tempMediumModel = await TIMAAT.MediaService.updateMedium(medium.model);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		updateLanguageTrack: async function(i, newTrack, medium) {
			// console.log("TCL: updateLanguageTrack: async function -> i, newTrack, medium at beginning of update process: ", i, newTrack, medium);
			try {
				// update languageTrack
				var tempLanguageTrack = await TIMAAT.MediaService.updateLanguageTrack(medium.model.mediumHasLanguages[i], newTrack);
				tempLanguageTrack.id = newTrack;
				medium.model.mediumHasLanguages[i] = tempLanguageTrack;

				// update data that is part of medium (includes updating last edited by/at)
				// console.log("TCL: updateMedium: async function - medium.model", medium.model);
				// var tempMediumModel = await TIMAAT.MediaService.updateMedium(medium.model);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		_mediumAdded: async function(medium) {
			// console.log("TCL: _mediumAdded: function(medium)");
			console.log("TCL: medium", medium);
			TIMAAT.MediaDatasets.media.model.push(medium);
			TIMAAT.MediaDatasets.media.push(new TIMAAT.Medium(medium, 'medium'));
			// TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'medium', medium);
		},

		_mediumSubtypeAdded: async function(mediumSubtype, medium) {
			try {
				console.log("TCL: _mediumSubtypeAdded: function(mediumSubtype, medium)");
				// console.log("TCL: mediumSubtype", mediumSubtype);
				// console.log("TCL: medium", medium);
				switch (mediumSubtype) {
					case 'audio':
						TIMAAT.MediaDatasets.audios.model.push(medium);
						var newMedium = new TIMAAT.Medium(medium, 'audio');
						TIMAAT.MediaDatasets.audios.push(newMedium);
					break;
					case 'document':
						TIMAAT.MediaDatasets.documents.model.push(medium);
						var newMedium = new TIMAAT.Medium(medium, 'document');
						TIMAAT.MediaDatasets.documents.push(newMedium);
					break;
					case 'image':
						TIMAAT.MediaDatasets.images.model.push(medium);
						var newMedium = new TIMAAT.Medium(medium, 'image');
						TIMAAT.MediaDatasets.images.push(newMedium);
					break;
					case 'software':
						TIMAAT.MediaDatasets.softwares.model.push(medium);
						var newMedium = new TIMAAT.Medium(medium, 'software');
						TIMAAT.MediaDatasets.softwares.push(newMedium);
					break;
					case 'text':
						TIMAAT.MediaDatasets.texts.model.push(medium);
						var newMedium = new TIMAAT.Medium(medium, 'text');
						TIMAAT.MediaDatasets.texts.push(newMedium);
					break;
					case 'video':
						TIMAAT.MediaDatasets.videos.model.push(medium);
						var newMedium = new TIMAAT.Medium(medium, 'video');
						TIMAAT.MediaDatasets.videos.push(newMedium);
					break;
					case 'videogame':
						TIMAAT.MediaDatasets.videogames.model.push(medium);
						var newMedium = new TIMAAT.Medium(medium, 'videogame');
						TIMAAT.MediaDatasets.videogames.push(newMedium);
					break;
				}
				TIMAAT.MediaDatasets.media.model.push(medium);
				TIMAAT.MediaDatasets.media.push(newMedium);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		_mediumRemoved: async function(medium) {
    	// console.log("TCL: _mediumRemoved", medium);
			// console.log("TCL: _mediumRemoved: function(medium)");
			var i = 0;
			for (; i < TIMAAT.MediaDatasets.mediaDatasets.length; i++) {
				if (TIMAAT.MediaDatasets.mediaDatasets[i].id == medium.id) {
					TIMAAT.MediaDatasets.mediaDatasets[i].splice(i,1);
				}
			}
			// sync to server
			// remove medium from all collections it is part of
			function isMediumInMediaCollectionHasMediums(medium, mchm) {
				if (mchm.filter(x => x.medium.id == medium.id)) {
					return true
				} else
				return false;
			};
			var i = 0;
			for (; i < TIMAAT.VideoChooser.collections.length; i++) {
				if (isMediumInMediaCollectionHasMediums(medium, TIMAAT.VideoChooser.collections[i].mediaCollectionHasMediums)) {
					await TIMAAT.Service.removeCollectionItem(TIMAAT.VideoChooser.collections[i], medium.model);
				}
			}

			TIMAAT.MediaService.removeMedium(medium);
			// remove all titles from medium
			var i = 0;
			for (; i < medium.model.titles.length; i++ ) { // remove obsolete titles
				if ( medium.model.titles[i].id != medium.model.title.id ) {
					TIMAAT.MediaService.removeTitle(medium.model.titles[i]);
					medium.model.titles.splice(i,1);
				}
			}
			medium.remove();
		},

		_mediumSubtypeRemoved: function(mediumSubtype, mediumSubtypeData) {
			console.log("TCL: _mediumSubtypeRemoved: function(mediumSubtype, mediumSubtypeData)", mediumSubtype, mediumSubtypeData);
			// sync to server
			TIMAAT.MediaService.removeMediumSubtype(mediumSubtype, mediumSubtypeData);
			var i = 0;
			for (; i < mediumSubtypeData.model.medium.titles.length; i++ ) { // remove obsolete titles
				if ( mediumSubtypeData.model.medium.titles[i].id != mediumSubtypeData.model.medium.title.id ) {
					TIMAAT.MediaService.removeTitle(mediumSubtypeData.model.medium.titles[i]);
					mediumSubtypeData.model.medium.titles.splice(i,1);
				}
			}
			mediumSubtypeData.remove();
		},

	}
	
}, window));
