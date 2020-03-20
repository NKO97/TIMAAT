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

			// delete medium button (in form) handler
			$('#timaat-mediadatasets-medium-remove').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-medium-delete').data('medium', $('#timaat-mediadatasets-media-metadata-form').data('medium'));
				$('#timaat-mediadatasets-medium-delete').modal('show');
			});

			// confirm delete medium modal functionality
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
					medium = await TIMAAT.MediaDatasets.updateMediumModelData(medium, formDataObject);

					medium.updateUI();
					await TIMAAT.MediaDatasets.updateMedium(medium.model.mediaType.mediaTypeTranslations[0].type, medium);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', "medium", medium);
				} else { // create new medium
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, formDataObject.typeId)
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);
					var mediumType;
					switch(formDataObject.typeId) {
						case "1":
							mediumType = "audio";
						break;
						case "2":
							mediumType = "document";
						break;
						case "3":
							mediumType = "image";
						break;
						case "4":
							mediumType = "software";
						break;
						case "5":
							mediumType = "text";
						break;
						case "6":
							mediumType = "video";
						break;
						case "7":
							mediumType = "videogame";							
						break;
					}
					var mediumSubtypeModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, mediumType);

					await TIMAAT.MediaDatasets.createMedium(mediumType, mediumModel, mediumSubtypeModel, displayTitle, source);
					var medium = TIMAAT.MediaDatasets.media[TIMAAT.MediaDatasets.media.length-1];
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', "medium", medium);
					// $('#timaat-mediadatasets-media-metadata-form').data('medium', medium); //? needed or not?
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
			$('#media-tab-medium-titles-form').click(function(event) {
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
			$(document).on('click','[data-role="new-title-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				// console.log("TCL: add title to list");
				var listEntry = $(this).closest('[data-role="new-title-fields"]');
				var title = '';
				var languageId = null;
				if (listEntry.find('input').each(function(){           
					title = $(this).val();
				}));
				if (listEntry.find('select').each(function(){
					languageId = $(this).val();
				}));
				if (!$("#timaat-mediadatasets-medium-titles-form").valid()) 
					return false;
				if (title != '' && languageId != null) {
					var titlesInForm = $("#timaat-mediadatasets-medium-titles-form").serializeArray();
					// console.log("TCL: titlesInForm", titlesInForm);
					var numberOfTitleElements = 2;
					var indexName = titlesInForm[titlesInForm.length-numberOfTitleElements-1].name; // find last used indexed name
					var indexString = indexName.substring(indexName.lastIndexOf("[") + 1, indexName.lastIndexOf("]"));
					var i = Number(indexString)+1;
          // console.log("i", i);
					$('#dynamic-title-fields').append(
						`<div class="form-group" data-role="title-entry">
						<div class="form-row">
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayTitle"></label>
									<input class="form-check-input isDisplayTitle" type="radio" name="isDisplayTitle" data-role="displayTitle" placeholder="Is Display Title">
								</div>
							</div>
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isOriginalTitle"></label>
									<input class="form-check-input isOriginalTitle" type="radio" name="isOriginalTitle" data-role="originalTitle" placeholder="Is Original Title">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="newTitle[`+i+`]" data-role="newTitle[`+i+`]" value="`+title+`" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" required>
							</div>
							<div class="col-sm-2 col-md-2">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" name="newTitleLanguageId[`+i+`]" data-role="newTitleLanguageId[`+i+`]" required>
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
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
					);
					$('input[name="newTitle['+i+']"').rules("add", { required: true, minlength: 3, maxlength: 200, });
					$('[data-role="newTitleLanguageId['+i+']"]').find('option[value='+languageId+']').attr("selected",true);
					$('select[name="newTitleLanguageId['+i+']"').rules("add", { required: true, });
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

			// Remove title button click
			$(document).on('click','[data-role="dynamic-title-fields"] > .form-group [data-role="remove"]', function(event) {
				event.preventDefault();
				var isDisplayTitle = $(this).closest('.form-group').find('input[name=isDisplayTitle]:checked').val();
				if (isDisplayTitle == "on") {
					// TODO modal informing that display title entry cannot be deleted					
					console.log("CANNOT DELETE DISPLAY TITLE");
				}
				else {
					// TODO consider undo function or popup asking if user really wants to delete a title
					console.log("DELETE TITLE ENTRY");
					$(this).closest('.form-group').remove();
				}
			});

			// Submit medium titles button functionality
			$("#timaat-mediadatasets-medium-titles-form-submit").on('click', async function(event) {
				// console.log("TCL: Titles form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-title-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				};
				// test if form is valid 
				if (!$("#timaat-mediadatasets-medium-titles-form").valid()) {
					$('[data-role="new-title-fields"]').append(TIMAAT.MediaDatasets.titleFormTitleToAppend());
					return false;
				}
				// console.log("TCL: Titles form: valid");

				// the original medium model (in case of editing an existing medium)
				var medium = $("#timaat-mediadatasets-medium-titles-form").data("medium");	
				var mediumType = medium.model.mediaType.mediaTypeTranslations[0].type;		
        // console.log("TCL: mediumType", mediumType);

				// Create/Edit medium window submitted data
				var formData = $("#timaat-mediadatasets-medium-titles-form").serializeArray();
				var formTitleList = [];
				var i = 0;
				while ( i < formData.length) {
					var element = {
						isDisplayTitle: false,
						isOriginalTitle: false,
						title: '',
						titleLanguageId: 0,
					};
					if (formData[i].name == 'isDisplayTitle' && formData[i].value == 'on' ) {
						element.isDisplayTitle = true;
						if (formData[i+1].name == 'isOriginalTitle' && formData[i+1].value == 'on' ) {
							// display title set, original title set
							element.isOriginalTitle = true;
							element.title = formData[i+2].value;
							element.titleLanguageId = formData[i+3].value;
							i = i+4;
						} else { // display title set, original title not set
							element.isOriginalTitle = false;
							element.title = formData[i+1].value;
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						}
					} else { // display title not set, original title set
						element.isDisplayTitle = false;
						if (formData[i].name == 'isOriginalTitle' && formData[i].value == 'on' ) {
							element.isOriginalTitle = true;
							element.title = formData[i+1].value;
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						} else {
							// display title not set, original title not set
							element.isOriginalTitle = false;
							element.title = formData[i].value;
							element.titleLanguageId = formData[i+1].value;
							i = i+2;
						}
					};
					formTitleList[formTitleList.length] = element;
				}
				// console.log("formTitleList", formTitleList);				
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
						console.log("TCL: update existing titles");
						// only update if anything changed
						if (title != medium.model.titles[i]) {
							await TIMAAT.MediaDatasets.updateTitle(title, medium);
						}
						// update display title
						var displayTitleChanged = false;
						if (formTitleList[i].isDisplayTitle) {
							medium.model.displayTitle = medium.model.titles[i];
							displayTitleChanged = true;
						}
						var originalTitleChanged = false
						// update original title
						if (formTitleList[i].isOriginalTitle && (medium.model.originalTitle == null || medium.model.originalTitle.id != medium.model.titles[i].id)) {
							medium.model.originalTitle = medium.model.titles[i];
							originalTitleChanged = true;
						} else if (!formTitleList[i].isOriginalTitle && medium.model.originalTitle != null && medium.model.originalTitle.id == medium.model.titles[i].id) {
							medium.model.originalTitle = null;
							originalTitleChanged = true;
						}
						if (displayTitleChanged || originalTitleChanged ) {
							await TIMAAT.MediaDatasets.updateMedium(mediumType, medium);
						}
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
						// only update if anything changed
						if (title != medium.model.titles[i]) {
							console.log("TCL: update existing titles (and add new ones)");
							await TIMAAT.MediaDatasets.updateTitle(title, medium);
						}
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
					console.log("TCL: (update existing titles and) add new ones");
					await TIMAAT.MediaDatasets.addTitles(medium, newTitles);
					i = 0;
					for (; i < formTitleList.length; i++) {
						// update display title
						var displayTitleChanged = false;
						if (formTitleList[i].isDisplayTitle) {
							medium.model.displayTitle = medium.model.titles[i];
							displayTitleChanged = true;
						}
						var originalTitleChanged = false
						// update original title
						if (formTitleList[i].isOriginalTitle && (medium.model.originalTitle == null || medium.model.originalTitle.id != medium.model.titles[i].id)) {
							medium.model.originalTitle = medium.model.titles[i];
							originalTitleChanged = true;
						} else if (!formTitleList[i].isOriginalTitle && medium.model.originalTitle != null && medium.model.originalTitle.id == medium.model.titles[i].id) {
							medium.model.originalTitle = null;
							originalTitleChanged = true;
						}
						if (displayTitleChanged || originalTitleChanged ) {
							await TIMAAT.MediaDatasets.updateMedium(mediumType, medium);
						}
					}
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
						if (title != medium.model.titles[i]) {
							console.log("TCL: update existing titles (and delete obsolete ones)");
							await TIMAAT.MediaDatasets.updateTitle(title, medium);
						}
						// update display title
						var displayTitleChanged = false;
						if (formTitleList[i].isDisplayTitle) {
							medium.model.displayTitle = medium.model.titles[i];
							displayTitleChanged = true;
						}
						var originalTitleChanged = false
						// update original title
						if (formTitleList[i].isOriginalTitle && (medium.model.originalTitle == null || medium.model.originalTitle.id != medium.model.titles[i].id)) {
							medium.model.originalTitle = medium.model.titles[i];
							originalTitleChanged = true;
						} else if (!formTitleList[i].isOriginalTitle && medium.model.originalTitle != null && medium.model.originalTitle.id == medium.model.titles[i].id) {
							medium.model.originalTitle = null;
							originalTitleChanged = true;
						}
						if (displayTitleChanged || originalTitleChanged ) {
							await TIMAAT.MediaDatasets.updateMedium(mediumType, medium);
						}
					};
					var i = medium.model.titles.length - 1;
					for (; i >= formTitleList.length; i-- ) { // remove obsolete titles
						if (medium.model.originalTitle.id == medium.model.titles[i].id) {
							medium.model.originalTitle = null;
							console.log("TCL: remove originalTitle before deleting title");		
							await TIMAAT.MediaDatasets.updateMedium(mediumType, medium);
						}
						console.log("TCL: (update existing titles and) delete obsolete ones");		
						TIMAAT.MediaService.removeTitle(medium.model.titles[i]);
						medium.model.titles.pop();		
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
			$('#media-tab-medium-languagetracks-form').click(function(event) {
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
			$(document).on('click','[data-role="new-languagetrack-fields"] > .form-group [data-role="add"]', async function(e) {
				e.preventDefault();
				var listEntry = $(this).closest('[data-role="new-languagetrack-fields"]');
				var mediumLanguageTypeId = listEntry.find('[data-role="languageTrackTypeId"]').val();
				var languageId = listEntry.find('[data-role="languageTrackLanguageId"]').val();
				// if (!$("#timaat-mediadatasets-medium-languagetracks-form").valid()) return false;
				if (mediumLanguageTypeId != null && languageId != null) {
					var medium = $('#timaat-mediadatasets-media-metadata-form').data('medium');
					var languageTracksInForm = $("#timaat-mediadatasets-medium-languagetracks-form").serializeArray();
					var newTrackEntry = {
						mediumId: medium.model.id,
						languageId: Number(languageTracksInForm[languageTracksInForm.length-1].value),
						mediumLanguageTypeId: Number(languageTracksInForm[languageTracksInForm.length-2].value),
					};
					var duplicate = false;
					var i = 0;
					while ( i < medium.model.mediumHasLanguages.length) {
						if (newTrackEntry.mediumLanguageTypeId == medium.model.mediumHasLanguages[i].id.mediumLanguageTypeId && newTrackEntry.languageId == medium.model.mediumHasLanguages[i].id.languageId) {
							duplicate = true;
							break;
						}
						i++;
					}
					if (!duplicate) {
						var i = Math.floor((languageTracksInForm.length -2) / 2 ); // length -2 as the 'add new track' row is still part of the form and has to be removed
							// console.log("TCL: i", i);
						$('#dynamic-languagetrack-fields').append(
							`<div class="form-group" data-role="languagetrack-entry" data-id="`+i+`">
							<div class="form-row">
								<div class="col-md-5">
									<label class="sr-only">Track Type</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id" name="languageTrackTypeId[`+i+`]" data-role="languageTrackTypeId[`+i+`]" required readonly="true">
										<option value="1">Audio track</option>
										<option value="2">Subtitle track</option>
									</select>
								</div>
								<div class="col-md-5">
									<label class="sr-only">Track Language</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id" name="languageTrackLanguageId[`+i+`]" data-role="languageTrackLanguageId[`+i+`]" required readonly="true">
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
										<i class="fas fa-trash-alt"></i>
									</button>
								</div>
							</div>
						</div>`
						);
						$('[data-role="languageTrackTypeId['+i+']"]').find('option[value='+mediumLanguageTypeId+']').attr("selected",true);
						$('select[name="languageTrackTypeId['+i+']"').rules("add", { required: true, });
						$('[data-role="languageTrackLanguageId['+i+']"]').find('option[value='+languageId+']').attr("selected",true);
						$('select[name="languageTrackLanguageId['+i+']"').rules("add", { required: true, });
						listEntry.find('[data-role="languageTrackTypeId"]').val('');
						listEntry.find('[data-role="languageTrackLanguageId"]').val('');
						await TIMAAT.MediaDatasets.addLanguageTrack(medium, newTrackEntry);
						medium.updateUI();
						TIMAAT.MediaDatasets.mediumFormLanguageTracks('edit', medium);
					}
					else { // duplicate entry
						$('#timaat-mediadatasets-languagetrack-duplicate').modal("show");
					}
				}
				else { // incomplete form data
					// TODO open modal showing error that not all required fields are set.
				}
			});

			// Remove languageTrack button click
			$(document).on('click','[data-role="dynamic-languagetrack-fields"] > .form-group [data-role="remove"]', async function(e) {
				e.preventDefault();
					var entry = $(this).closest('.form-group').attr("data-id");
					var medium = $('#timaat-mediadatasets-media-metadata-form').data('medium');
					var listEntry = $(this).closest('[data-role="dynamic-languagetrack-fields"]');
					var mediumLanguageTypeId = listEntry.find('[name="languageTrackTypeId['+entry+']"]').val();
					var languageId = listEntry.find('[name="languageTrackLanguageId['+entry+']"]').val();
					var i = 0;
					for (; i< medium.model.mediumHasLanguages.length; i++) {
						if (medium.model.mediumHasLanguages[i].id.languageId == languageId
						 && medium.model.mediumHasLanguages[i].id.mediumLanguageTypeId == mediumLanguageTypeId) {
							await TIMAAT.MediaService.removeLanguageTrack(medium.model.mediumHasLanguages[i]);
							medium.model.mediumHasLanguages.splice(i,1);
							break;
						}
					}
					medium.updateUI();
					TIMAAT.MediaDatasets.mediumFormLanguageTracks('edit', medium);
			});

			// Done button in languageTracks form functionality
			$('#timaat-mediadatasets-medium-languagetracks-form-done').click( function(event) {
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
					audio = await TIMAAT.MediaDatasets.updateMediumModelData(audio, formDataObject);
					// audio data
					audio.model.mediumAudio.length = TIMAAT.Util.parseTime(formDataObject.length);
					// TODO: audiocodecinformation

					audio.updateUI();
					TIMAAT.MediaDatasets.updateMedium('audio', audio);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'audio', audio);
				} else { // create new audio
					var audioModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, 'audio')
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, 1); // 1 = Audio. TODO check clause to find proper id
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);

					await TIMAAT.MediaDatasets.createMedium('audio', mediumModel, audioModel, displayTitle, source);
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
					mediumDocument = await TIMAAT.MediaDatasets.updateMediumModelData(mediumDocument, formDataObject);
					// document data
					// currently empty

					mediumDocument.updateUI();
					TIMAAT.MediaDatasets.updateMedium('document', mediumDocument);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'document', mediumDocument);
				} else { // create new document
					var documentModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, 'document');
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, 2); // 2 = Document. TODO check clause to find proper id
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);
					// There are no translation data for medium or document at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					await TIMAAT.MediaDatasets.createMedium('document', mediumModel, documentModel, displayTitle, source);
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
					image = await TIMAAT.MediaDatasets.updateMediumModelData(image, formDataObject);
					// image data
					image.model.mediumImage.width = formDataObject.width;
					image.model.mediumImage.height = formDataObject.height;
					image.model.mediumImage.bitDepth = formDataObject.bitDepth;

					image.updateUI();
					TIMAAT.MediaDatasets.updateMedium('image', image);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'image', image);
				} else { // create new image
					var imageModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, 'image');
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, 3); // 3 = Image. TODO check clause to find proper id
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);

					await TIMAAT.MediaDatasets.createMedium('image', mediumModel, imageModel, displayTitle, source);
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
					software = await TIMAAT.MediaDatasets.updateMediumModelData(software, formDataObject);
					// software data
					software.model.mediumSoftware.version = formDataObject.version;

					software.updateUI();
					TIMAAT.MediaDatasets.updateMedium('software', software);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'software', software);
				} else { // create new software
					var softwareModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject,'software');
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, 4); // 4 = Software. TODO check clause to find proper id
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);
			
					await TIMAAT.MediaDatasets.createMedium('software', mediumModel, softwareModel, displayTitle, source);
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
					text = await TIMAAT.MediaDatasets.updateMediumModelData(text, formDataObject);
					// text data
					text.model.mediumText.content = formDataObject.content;

					text.updateUI();
					TIMAAT.MediaDatasets.updateMedium('text', text);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'text', text);
				} else { // create new text
					var textModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, 'text');
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, 5); // 5 = Text. TODO check clause to find proper id
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);
				
					await TIMAAT.MediaDatasets.createMedium('text', mediumModel, textModel, displayTitle, source);
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
        console.log("TCL: formData", formData);
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				console.log("TCL: formDataObject", formDataObject);

				if (video) { // update video
					// medium data
					video = await TIMAAT.MediaDatasets.updateMediumModelData(video, formDataObject);
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
					TIMAAT.MediaDatasets.updateMedium('video', video);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'video', video);
				} else { // create new video
					var videoModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, 'video')
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, 6); // 6 = Video. TODO check clause to find proper id
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);

					await TIMAAT.MediaDatasets.createMedium('video', mediumModel, videoModel, displayTitle, source);
					var video = TIMAAT.MediaDatasets.videos[TIMAAT.MediaDatasets.videos.length-1];
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
					videogame = await TIMAAT.MediaDatasets.updateMediumModelData(videogame, formDataObject);
					// videogame data
					videogame.model.mediumVideogame.isEpisode = (formDataObject.isEpisode) ? true : false;

					videogame.updateUI();
					TIMAAT.MediaDatasets.updateMedium('videogame', videogame);
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'videogame', videogame);
				} else { // create new videogame
					var videogameModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, 'videogame');
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, 7); // 7 = Videogame. TODO check clause to find proper id
					var displayTitle = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var source = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);

					await TIMAAT.MediaDatasets.createMedium('videogame', mediumModel, videogameModel, displayTitle, source);
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

		load: async function() {
			await TIMAAT.MediaDatasets.loadMedia();
			TIMAAT.MediaDatasets.loadMediaTypes();
			await TIMAAT.MediaDatasets.loadAllMediumSubtypes();
		},

		loadMediaTypes: function() {
    	// console.log("TCL: loadMediaTypes: function()");
			TIMAAT.MediaService.listMediaTypes(TIMAAT.MediaDatasets.setMediaTypeLists);
		},
		
		loadMedia: async function() {
			// console.log("TCL: loadMedia: function()");
			$('.media-cards').hide();
			$('.media-card').show();
			await TIMAAT.MediaService.listMedia(TIMAAT.MediaDatasets.setMediumLists);
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

		loadAllMediumSubtypes: async function() {
			TIMAAT.MediaService.listMediumSubtype('audio', TIMAAT.MediaDatasets.setAudioLists);
			TIMAAT.MediaService.listMediumSubtype('document', TIMAAT.MediaDatasets.setDocumentLists);
			TIMAAT.MediaService.listMediumSubtype('image', TIMAAT.MediaDatasets.setImageLists);
			TIMAAT.MediaService.listMediumSubtype('software', TIMAAT.MediaDatasets.setSoftwareLists);
			TIMAAT.MediaService.listMediumSubtype('text', TIMAAT.MediaDatasets.setTextLists);
			await TIMAAT.MediaService.listMediumSubtype('video', TIMAAT.MediaDatasets.setVideoLists);
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

		setMediumLists: async function(media) {
			$('.form').hide();
			$('.media-data-tabs').hide();
    	console.log("TCL: setMediumLists -> media", media);
			if ( !media ) return;

			$('#timaat-mediadatasets-media-metadata-form').data('mediumType', 'medium');
			$('#timaat-mediadatasets-medium-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-medium-list').empty();
			// setup model
			var meds = Array();
			media.forEach(function(medium) { 
				if ( medium.id > 0 ) {
					meds.push(new TIMAAT.Medium(medium, 'medium'));
				}
			});
			TIMAAT.MediaDatasets.media = meds;
			TIMAAT.MediaDatasets.media.model = media;
			// also set up video chooser list
			// TIMAAT.VideoChooser.setMedia();
		},

		setAudioLists: function(audios) {
			// console.log("TCL: setAudioLists -> audios", audios);
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
			// console.log("TCL: setDocumentLists -> documents", documents);
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
			// console.log("TCL: setImageLists -> images", images);
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
			// console.log("TCL: setSoftwareLists -> softwares", softwares);
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
			// console.log("TCL: setTextLists -> texts", texts);
			$('.form');
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
		
		setVideoLists: async function(videos) {
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
			// TIMAAT.MediaService.listMedia(TIMAAT.MediaDatasets.setMediumLists);
			if (TIMAAT.VideoChooser.initialized == false) {
				TIMAAT.VideoChooser.setMedia();
				TIMAAT.VideoChooser.setVideoList(TIMAAT.MediaDatasets.videos.model);
				TIMAAT.VideoChooser.initialized = true;
			}
		},

		setVideogameLists: function(videogames) {
			// console.log("TCL: setVideogameLists -> videogames", videogames);
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
			$('#timaat-mediadatasets-media-title-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-media-title-list').empty();
			// setup model
			var mediumTitles = Array();
			medium.model.titles.forEach(function(title) { 
				if ( title.id > 0 )
					mediumTitles.push(title); 
			});
			TIMAAT.MediaDatasets.titles = mediumTitles;
      console.log("TCL: TIMAAT.MediaDatasets.titles", TIMAAT.MediaDatasets.titles);
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
			}	else {
				$('.mediumtype-data').hide();
			}
			$('.source-data').show();
			$('.'+mediumType+'-data').show();
			$('.datasheet-form-edit-button').hide();
			$('.datasheet-form-delete-button').hide();
			$('.datasheet-form-buttons').hide()
			$('.'+mediumType+'-datasheet-form-submit').show();
			$('#timaat-mediadatasets-media-metadata-form :input').prop('disabled', false);
			$('#timaat-mediadatasets-media-metadata-title').focus();

			// setup form
			$('#mediumFormHeader').html(mediumType+" hinzufügen");
			$('#timaat-mediadatasets-'+mediumType+'-metadata-form-submit').html("Hinzufügen");
			$('#timaat-mediadatasets-media-metadata-releasedate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediadatasets-media-metadata-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediadatasets-media-metadata-source-isprimarysource').prop('checked', true);
			// $('#timaat-mediadatasets-media-metadata-source-isstillavailable').prop('checked', false);
		},

		mediumFormDatasheet: function(action, mediumType, mediumTypeData) {
    	// console.log("TCL: action, mediumType, mediumTypeData", action, mediumType, mediumTypeData);
			$('#timaat-mediadatasets-media-metadata-form').trigger('reset');
			$('.datasheet-data').hide();
			$('.title-data').show();
			$('.medium-data').show();
			if (mediumType == "medium") {
				$('.mediumtype-data').show();
			}	else {
				$('.mediumtype-data').hide();
			}
			$('.source-data').show();
			$('.'+mediumType+'-data').show();
			mediumFormMetadataValidator.resetForm();
			$('.'+mediumType+'-data-tab').show();
			$('.title-data-tab').show();
			$('.languagetrack-data-tab').show();
			$('.nav-tabs a[href="#'+mediumType+'Datasheet"]').focus();
			$('#timaat-mediadatasets-media-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-mediadatasets-media-metadata-form :input').prop("disabled", true);
				$('.datasheet-form-edit-button').hide();
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit').show();
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit').prop("disabled", false);
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit :input').prop("disabled", false);
				$('.datasheet-form-delete-button').show();
				$('#timaat-mediadatasets-medium-remove').prop("disabled", false);
				$('#timaat-mediadatasets-medium-remove :input').prop("disabled", false);
				$('.datasheet-form-buttons').hide()
				$('#mediumFormHeader').html(mediumType+" Datasheet (#"+ mediumTypeData.model.id+')');
			}
			else if (action == 'edit') {
				$('.datasheet-form-buttons').hide();
				$('.'+mediumType+'-datasheet-form-submit').show();
				$('#timaat-mediadatasets-media-metadata-form :input').prop("disabled", false);
				if (mediumType == "medium") {
					$('#timaat-mediadatasets-media-metadata-mediatype-id').prop("disabled", true);
				}	else {
					$('#timaat-mediadatasets-media-metadata-mediatype-id').hide();
				}
				$('#timaat-mediadatasets-media-metadata-releasedate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-mediadatasets-media-metadata-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('.datasheet-form-edit-button').hide();
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit').prop("disabled", true);
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-edit :input').prop("disabled", true);
				$('.datasheet-form-delete-button').hide();
				$('#timaat-mediadatasets-medium-remove').prop("disabled", true);
				$('#timaat-mediadatasets-medium-remove :input').prop("disabled", true);
				$('#mediumFormHeader').html(mediumType+" bearbeiten");
				$('#timaat-mediadatasets-'+mediumType+'-metadata-form-submit').html("Speichern");
				$('#timaat-mediadatasets-media-metadata-title').focus();
			}

			// console.log("TCL: mediumTypeData", mediumTypeData);
			// setup UI
			var data = mediumTypeData.model;
			// medium data
			$('#timaat-mediadatasets-media-metadata-mediatype-id').val(data.mediaType.id);
			$('#timaat-mediadatasets-media-metadata-remark').val(data.remark);
			$('#timaat-mediadatasets-media-metadata-copyright').val(data.copyright);
			if (isNaN(moment(data.releaseDate)))
				$('#timaat-mediadatasets-media-metadata-releasedate').val('');
				else $('#timaat-mediadatasets-media-metadata-releasedate').val(moment(data.releaseDate).format('YYYY-MM-DD'));
			// display-title data
			$('#timaat-mediadatasets-media-metadata-title').val(data.displayTitle.name);
			$('#timaat-mediadatasets-media-metadata-title-language-id').val(data.displayTitle.language.id);
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
					$("#timaat-mediadatasets-audio-metadata-length").val(data.mediumAudio.length);
				break;
				case "mediumDocument":
				break;
				case 'image':
					$("#timaat-mediadatasets-image-metadata-width").val(data.mediumImage.width);
					$("#timaat-mediadatasets-image-metadata-height").val(data.mediumImage.height);
					$("#timaat-mediadatasets-image-metadata-bitdepth").val(data.mediumImage.bitDepth);
				break;
				case 'software':
					$("#timaat-mediadatasets-software-metadata-version").val(data.mediumSoftware.version);
				break;
				case 'text':
					$("#timaat-mediadatasets-text-metadata-content").val(data.mediumText.content);
				break;
				case 'video':
					$('#timaat-mediadatasets-video-metadata-length').val(data.mediumVideo.length);
					$('#timaat-mediadatasets-video-metadata-videocodec').val(data.mediumVideo.videoCodec);
					$('#timaat-mediadatasets-video-metadata-width').val(data.mediumVideo.width);
					$('#timaat-mediadatasets-video-metadata-height').val(data.mediumVideo.height);
					$('#timaat-mediadatasets-video-metadata-framerate').val(data.mediumVideo.frameRate);
					$('#timaat-mediadatasets-video-metadata-datarate').val(data.mediumVideo.dataRate);
					$('#timaat-mediadatasets-video-metadata-totalbitrate').val(data.mediumVideo.totalBitrate);
					if (data.mediumVideo.isEpisode)
						$('#timaat-mediadatasets-video-metadata-isepisode').prop('checked', true);
						else $('#timaat-mediadatasets-video-metadata-isepisode').prop('checked', false);
				break;
				case 'videogame':
					if (data.mediumVideogame.isEpisode)
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
			// display-title data
			var i = 0;
			var numTitles = medium.model.titles.length;
      // console.log("TCL: medium.model.titles", medium.model.titles);
			for (; i< numTitles; i++) {
				// console.log("TCL: medium.model.titles[i].language.id", medium.model.titles[i].language.id);
				$('[data-role="dynamic-title-fields"]').append(
					`<div class="form-group" data-role="title-entry">
						<div class="form-row">
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayTitle"></label>
									<input class="form-check-input isDisplayTitle" type="radio" name="isDisplayTitle" data-role="displayTitle[`+medium.model.titles[i].id+`]" placeholder="Is Display Title">
								</div>
							</div>
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isOriginalTitle"></label>
									<input class="form-check-input isOriginalTitle" type="radio" name="isOriginalTitle" data-role="originalTitle[`+medium.model.titles[i].id+`]" placeholder="Is Original Title">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="title[`+i+`]" data-role="title[`+medium.model.titles[i].id+`]" value="`+medium.model.titles[i].name+`" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" required>
							</div>
							<div class="col-sm-2 col-md-2">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" name="titleLanguageId[`+i+`]" data-role="titleLanguageId[`+medium.model.titles[i].id+`]" required>
									<!-- <option value="" disabled selected hidden>[Choose title language...]</option> -->
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
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
					);
					if (medium.model.titles[i].id == medium.model.displayTitle.id) {
						$('[data-role="displayTitle['+medium.model.titles[i].id+']"').prop("checked",true);							
					}
					if (medium.model.originalTitle && medium.model.titles[i].id == medium.model.originalTitle.id) {
						$('[data-role="originalTitle['+medium.model.titles[i].id+']"').prop("checked",true);							
					}
					$('input[name="title['+i+']"').rules("add", { required: true, minlength: 3, maxlength: 200, });
					$('[data-role="titleLanguageId['+medium.model.titles[i].id+']"')
					.find('option[value='+medium.model.titles[i].language.id+']')
					.attr("selected",true);
					$('select[name="titleLanguageId['+medium.model.titles[i].id+']"').rules("add", { required: true, });
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
				$('[data-role="new-title-fields"]').append(TIMAAT.MediaDatasets.titleFormTitleToAppend());
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
			console.log("TCL: medium", medium);
			var numLanguageTracks = medium.model.mediumHasLanguages.length;
			for (; i< numLanguageTracks; i++) {
				$('[data-role="dynamic-languagetrack-fields"]').append(
					`<div class="form-group" data-role="languagetrack-entry" data-id="`+i+`">
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
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
					);
					$('[data-role="languageTrackTypeId['+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']"')
						.find('option[value='+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']')
						.attr("selected",true);
					$('select[name="languageTrackTypeId['+i+']"').rules("add", { required: true, });
					$('[data-role="languageTrackLanguageId['+medium.model.mediumHasLanguages[i].language.id+']"')
						.find('option[value='+medium.model.mediumHasLanguages[i].language.id+']')
						.attr("selected",true);
					$('select[name="languageTrackLanguageId['+i+']"').rules("add", { required: true, });
			};

			if ( action == 'show') {
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop("disabled", true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').show();
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').prop("disabled", false);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit :input').prop("disabled", false);
				$('#timaat-mediadatasets-medium-languagetracks-form-done').hide();
				$('[data-role="new-languagetrack-fields"').hide();
				$('.languagetrack-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumLanguageTracksLabel').html("Medium Spurliste");
			}
			else if (action == 'edit') {
				$('#timaat-mediadatasets-medium-languagetracks-form-done').show();
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop("disabled", false);
				$('.timaat-mediadatasets-medium-languagetracks-languagetrack-type-id').prop("disabled", true);
				$('.timaat-mediadatasets-medium-languagetracks-languagetrack-language-id').prop("disabled", true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').hide();
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').prop("disabled", true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit :input').prop("disabled", true);
				$('[data-role="new-languagetrack-fields"').show();
				$('.languagetrack-form-divider').show();
				$('#mediumLanguageTracksLabel').html("Medium Spurliste bearbeiten");
				$('#timaat-mediadatasets-medium-languagetracks-form-done').html("Fertig");

				// fields for new languageTrack entry
				// add empty 'add new track' row to form when edit mode is enabled
				$('[data-role="new-languagetrack-fields"]').append(
					`<div class="form-group" data-role="languagetrack-entry">
						<div class="form-row">
							<div class="col-md-12 text-left">
								<div class="form-check">
									<span>Add new Track:</span>
								</div>
							</div>
						</div>
						<div class="form-row">
							<div class="col-md-5">
								<label class="sr-only">Track type</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id" name="languageTrackTypeId" data-role="languageTrackTypeId" required>
									<option value="" disabled selected hidden>[Choose Track type...]</option>
									<option value="1">Audio Track</option>
									<option value="2">Subtitle Track</option>
								</select>
							</div>
							<div class="col-md-5">
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
									<i class="fas fa-plus"></i>
								</button>
							</div>
						</div>
					</div>`
				);
				$('#timaat-mediadatasets-medium-languagetracks-form').data('medium', medium);
			}
		},

		createMedium: async function(mediumSubtype, mediumModel, mediumSubtypeModel, title, source) {
    	// console.log("TCL: createMedium: mediumSubtype, mediumModel, mediumSubtypeModel, title, source", mediumSubtype, mediumModel, mediumSubtypeModel, title, source);
			try { // TODO needs to be called after createMedium once m-n-table is refactored to 1-n table
				// create display title
				var newDisplayTitle = await TIMAAT.MediaService.createTitle(title);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {				
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.displayTitle = newDisplayTitle;
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
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// create mediumSubtype with medium id
				mediumSubtypeModel.mediumId = newMediumModel.id;
				var newMediumSubtypeModel = await TIMAAT.MediaService.createMediumSubtype(mediumSubtype, newMediumModel, mediumSubtypeModel);
        // console.log("TCL: newMediumSubtypeModel", newMediumSubtypeModel);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// push new medium to dataset model
				// console.log("TCL: newMediumModel", newMediumModel);
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
				// console.log("TCL: newMediumModel", newMediumModel);
				await TIMAAT.MediaDatasets._mediumAdded(mediumSubtype, newMediumModel);
			} catch(error) {
				console.log( "error: ", error);
			};
		},
		
		createTitle: async function(titleModel) {
			// console.log("TCL: createTitle: async function -> titleModel", titleModel);
			try {
				// create title
				var newTitleModel = await TIMAAT.MediaService.createTitle(titleModel.model);
        // console.log("TCL: newTitleModel", newTitleModel);
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
				}
				// await TIMAAT.MediaDatasets.updateMedium(mediumType, medium);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		addLanguageTrack: async function(medium, newLanguageTrack) {
			// console.log("TCL: addLanguageTrack: async function -> newLanguageTrack", newLanguageTrack);
			try {
				var addedLanguageTrackModel = await TIMAAT.MediaService.addLanguageTrack(newLanguageTrack);
				addedLanguageTrackModel.id = newLanguageTrack;
				medium.model.mediumHasLanguages.push(addedLanguageTrackModel);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		updateMedium: async function(mediumSubtype, medium) {
		console.log("TCL: updateMedium: async function -> medium at beginning of update process: ", mediumSubtype, medium);
			try { // update display title
				var tempDisplayTitle = await TIMAAT.MediaService.updateTitle(medium.model.displayTitle);
				medium.model.displayTitle = tempDisplayTitle;
			} catch(error) {
				console.log( "error: ", error);
			};

			try { // update original title
				if (medium.model.originalTitle) { // medium initially has no original title set
					var tempOriginalTitle = await TIMAAT.MediaService.updateTitle(medium.model.originalTitle);
					medium.model.originalTitle = tempOriginalTitle;
				}
			} catch(error) {
				console.log( "error: ", error);
			};
			
			try { // update source
				var tempSource = await TIMAAT.MediaService.updateSource(medium.model.sources[0]);
				medium.model.sources[0] = tempSource;
			} catch(error) {
				console.log( "error: ", error);
			};
			
			try { // update subtype
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
			
			try { // update medium
				var tempMediumModel = await TIMAAT.MediaService.updateMedium(medium.model);
			} catch(error) {
				console.log( "error: ", error);
			};

			try { // update media lists
				await TIMAAT.MediaDatasets._mediumUpdated(mediumSubtype, medium);
			} catch(error) {
				console.log( "error: ", error);
			};
			
			medium.updateUI();
		},

		updateTitle: async function(title, medium) {
			// console.log("TCL: updateTitle: async function -> title at beginning of update process: ", title, medium);
			try {
				// update title
				var tempTitle = await TIMAAT.MediaService.updateTitle(title);
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

		_mediumAdded: async function(mediumSubtype, medium) {
    	console.log("TCL: _mediumAdded: mediumSubtype, medium", mediumSubtype, medium);
			try {
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

		_mediumUpdated: async function(mediumSubtype, updatedMedium) {
    	console.log("TCL: _mediumUpdated: mediumSubtype, updatedMedium", mediumSubtype, updatedMedium);
			switch (mediumSubtype) {
				case 'audio':
					var index = TIMAAT.MediaDatasets.audios.findIndex(element => element.model.id === updatedMedium.model.id);
					if (index > -1) {
						TIMAAT.MediaDatasets.audios[index] = updatedMedium;
						TIMAAT.MediaDatasets.audios.model[index] = updatedMedium.model;
					}
				break;
				case 'document':
					var index = TIMAAT.MediaDatasets.documents.findIndex(element => element.model.id === updatedMedium.model.id);
					if (index > -1) {
						TIMAAT.MediaDatasets.documents[index] = updatedMedium;
						TIMAAT.MediaDatasets.documents.model[index] = updatedMedium.model;
					}
				break;
				case 'image':
					var index = TIMAAT.MediaDatasets.images.findIndex(element => element.model.id === updatedMedium.model.id);
					if (index > -1) {
						TIMAAT.MediaDatasets.images[index] = updatedMedium;
						TIMAAT.MediaDatasets.images.model[index] = updatedMedium.model;
					}
				break;
				case 'software':
					var index = TIMAAT.MediaDatasets.softwares.findIndex(element => element.model.id === updatedMedium.model.id);
					if (index > -1) {
						TIMAAT.MediaDatasets.softwares[index] = updatedMedium;
						TIMAAT.MediaDatasets.softwares.model[index] = updatedMedium.model;
					}
				break;
				case 'text':
					var index = TIMAAT.MediaDatasets.texts.findIndex(element => element.model.id === updatedMedium.model.id);
					if (index > -1) {
						TIMAAT.MediaDatasets.texts[index] = updatedMedium;
						TIMAAT.MediaDatasets.texts.model[index] = updatedMedium.model;
					}
				break;
				case 'video':
					var index = TIMAAT.MediaDatasets.videos.findIndex(element => element.model.id === updatedMedium.model.id);
					if (index > -1) {
						TIMAAT.MediaDatasets.videos[index] = updatedMedium;
						TIMAAT.MediaDatasets.videos.model[index] = updatedMedium.model;

						// update medialibrary data
						TIMAAT.VideoChooser.setVideoList(TIMAAT.MediaDatasets.videos.model);
					}
				break;
				case 'videogame':
					var index = TIMAAT.MediaDatasets.videogames.findIndex(element => element.model.id === updatedMedium.model.id);
					if (index > -1) {
						TIMAAT.MediaDatasets.videogames[index] = updatedMedium;
						TIMAAT.MediaDatasets.videogames.model[index] = updatedMedium.model;
					}
				break;
			}
			var index = TIMAAT.MediaDatasets.media.findIndex(element => element.model.id === updatedMedium.model.id);
			if (index > -1) {
				TIMAAT.MediaDatasets.media[index] = updatedMedium;
				TIMAAT.MediaDatasets.media.model[index] = updatedMedium.model;      
			}
		},

		_mediumRemoved: async function(medium) {
    	// console.log("TCL: _mediumRemoved", medium);
			// console.log("TCL: _mediumRemoved: function(medium)");
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
				if ( medium.model.titles[i].id != medium.model.displayTitle.id ) {
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

		updateMediumModelData: async function(medium, formDataObject) {
    	// console.log("TCL: medium, formDataObject", medium, formDataObject);
			// medium data
			medium.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
			medium.model.copyright = formDataObject.copyright;
			medium.model.remark = formDataObject.remark;
			// display-title data
			medium.model.displayTitle.name = formDataObject.displayTitle;
			medium.model.displayTitle.language.id = Number(formDataObject.displayTitleLanguageId);
			var i = 0;
			for (; i < medium.model.titles.length; i++) {
				if (medium.model.displayTitle.id == medium.model.titles[i].id) {
					medium.model.titles[i] = medium.model.displayTitle;
					break;
				}
			}
			// source data
			medium.model.sources[0].url = formDataObject.sourceUrl;
			medium.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
			medium.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
			medium.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;

			return medium;
		},

		createMediumModel: async function(formDataObject, mediaTypeId) {
			var medium = {
				id: 0,
				remark: formDataObject.remark,
				copyright: formDataObject.copyright,
				releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
				mediaType: {
					id: Number(mediaTypeId),
				},
				titles: [{
					id: 0,
					language: {
						id: Number(formDataObject.displayTitleLanguageId),
					},
					name: formDataObject.displayTitle,
				}],
			};
			return medium;
		},

		createMediumSubtypeModel: async function(formDataObject, mediaType) {
			var mediumSubtypeModel = {};
			switch(mediaType) {
				case 'audio':
					mediumSubtypeModel = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct audio codec information
							id: 1,
						},
						length: TIMAAT.Util.parseTime(formDataObject.length),
					};
				break;
				case 'document':
					mediumSubtypeModel = {
						mediumId: 0,
					};
				break;
				case 'image':
					mediumSubtypeModel = {
						mediumId: 0,
						width: formDataObject.width,
						height: formDataObject.height,
						bitDepth: formDataObject.bitDepth,
					};
				break;
				case 'software':
					mediumSubtypeModel = {
						mediumId: 0,
						version: formDataObject.version,
					};
				break;
				case 'text':
					mediumSubtypeModel = {
						mediumId: 0,
						content: formDataObject.content,
					};
				break;
				case 'video':
					mediumSubtypeModel = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct audio codec information
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
				break;
				case 'videogame':
					mediumSubtypeModel = {
						mediumId: 0,
						isEpisode: (formDataObject.isEpisode) ? true : false,
					};
				break;
			}
			return mediumSubtypeModel;
		},

		createDisplayTitleModel: async function(formDataObject) {
			var displayTitle = {
				id: 0,
				language: {
					id: Number(formDataObject.displayTitleLanguageId),
				},
				name: formDataObject.displayTitle,
			};
			return displayTitle;
		},

		createSourceModel: async function(formDataObject) {
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
			return source;
		},

		titleFormTitleToAppend: function() {
			var titleToAppend =
			`<div class="form-group" data-role="title-entry">
							<div class="form-row">
								<div class="col-md-2 text-center">
									<div class="form-check">
										<span>Add new title:</span>
									</div>
								</div>
								<div class="col-md-6">
									<label class="sr-only">Title</label>
									<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="title" data-role="title" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" required>
								</div>
								<div class="col-md-3">
									<label class="sr-only">Title's Language</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" name="titleLanguageId" data-role="titleLanguageId" required>
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
										<i class="fas fa-plus"></i>
									</button>
								</div>
							</div>
						</div>`;
						return titleToAppend;
		},

	}
	
}, window));
