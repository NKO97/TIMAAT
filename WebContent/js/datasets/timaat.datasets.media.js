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
		mediaLoaded: false,

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
			$('#timaat-mediadatasets-metadata-form').data('mediumType', 'medium');
		},

		initMediaComponent: function() {
			console.log("TCL: initMediaComponent");
			if (!TIMAAT.MediaDatasets.mediaLoaded) {
				TIMAAT.MediaDatasets.setMediumList();
				TIMAAT.MediaDatasets.mediaLoaded = true;
			}
			TIMAAT.UI.showComponent('media');
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
					$('#timaat-mediadatasets-mediumtype-meta-submit').prop('disabled', false);
					$('#timaat-mediadatasets-mediumtype-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-mediadatasets-mediumtype-meta-submit').prop('disabled', true);
					$('#timaat-mediadatasets-mediumtype-meta-submit').attr('disabled');
				}
			});
		},

		initMedia: function() {
			// console.log("TCL: MediaDatasets: initMedia: function()");		
			
			// nav-bar functionality
			$('#media-tab-medium-metadata-form').on('click',function(event) {
				// $('.media-data-tabs').show();
				$('.nav-tabs a[href="#mediumDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', type, $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add medium button functionality (in medium list - opens datasheet form)
			$('#timaat-mediadatasets-medium-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'medium');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium('medium');
			});

			// delete medium button (in form) handler
			$('#timaat-mediadatasets-metadata-form-delete').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-medium-delete').data('medium', $('#timaat-mediadatasets-metadata-form').data('medium'));
				$('#timaat-mediadatasets-medium-delete').modal('show');
			});

			// confirm delete medium modal functionality
			$('#timaat-mediadatasets-modal-delete-submit').on('click', async function(ev) {
				var modal = $('#timaat-mediadatasets-medium-delete');
				var medium = modal.data('medium');
				// console.log("TCL: medium", medium);
				if (medium) {
					var mediaType = medium.model.mediaType.mediaTypeTranslations[0].type;
					try {	
						await TIMAAT.MediaDatasets._mediumRemoved(medium);
					} catch(error) {
						console.log("error: ", error);
					}
					try {
						await TIMAAT.MediaDatasets.refreshDatatable(mediaType);
						await TIMAAT.MediaDatasets.refreshDatatable('medium');
					} catch(error) {
						console.log("error: ", error);
					}
				}
				modal.modal('hide');
				$('#timaat-mediadatasets-metadata-form').hide();
				$('.media-data-tabs').hide();
				$('.form').hide();
			});

			// edit content form button handler
			$('#timaat-mediadatasets-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var type = $('#timaat-mediadatasets-metadata-form').attr('data-type');
				TIMAAT.MediaDatasets.mediumFormDatasheet('edit', type, $('#timaat-mediadatasets-metadata-form').data('medium'));
				// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			});			
			
			// medium form handlers
			// submit medium metadata button functionality
			$('#timaat-mediadatasets-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-mediadatasets-metadata-form').valid()) return false;

				var type = $('#timaat-mediadatasets-metadata-form').attr('data-type');
				// the original medium model (in case of editing an existing medium)
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');				
        // console.log("TCL: medium", medium);

				// create/edit medium window submitted data
				var formData = $('#timaat-mediadatasets-metadata-form').serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (medium) { // update medium
					// medium data
					medium = await TIMAAT.MediaDatasets.updateMediumModelData(medium, formDataObject);
					// medium subtype data
					switch (type) {
						case "audio":
							medium.model.mediumAudio.length = TIMAAT.Util.parseTime(formDataObject.length);
						break;
						case "document":
						break;
						case "image":
							medium.model.mediumImage.width = formDataObject.width;
							medium.model.mediumImage.height = formDataObject.height;
							medium.model.mediumImage.bitDepth = formDataObject.bitDepth;
						break;
						case "software":
							medium.model.mediumSoftware.version = formDataObject.version;
						break;
						case "text":
							medium.model.mediumText.content = formDataObject.content;
						break;
						case "video":
							medium.model.mediumVideo.length = TIMAAT.Util.parseTime(formDataObject.length);
							medium.model.mediumVideo.videoCodec = formDataObject.videoCodec;
							medium.model.mediumVideo.width = formDataObject.width;
							medium.model.mediumVideo.height = formDataObject.height;
							medium.model.mediumVideo.frameRate = formDataObject.frameRate;
							medium.model.mediumVideo.dataRate = formDataObject.dataRate;
							medium.model.mediumVideo.totalBitrate = formDataObject.totalBitrate;
							medium.model.mediumVideo.isEpisode = (formDataObject.isEpisode) ? true : false;
						break;
						case "videogame":
							medium.model.mediumVideogame.isEpisode = (formDataObject.isEpisode) ? true : false;
						break;
					}
					await TIMAAT.MediaDatasets.updateMedium(type, medium);
					medium.updateUI();
				} else { // create new medium
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataObject, type);
					var displayTitleModel = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataObject);
					var sourceModel = await TIMAAT.MediaDatasets.createSourceModel(formDataObject);
					var mediumSubtypeModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataObject, type);

					var newMedium = await TIMAAT.MediaDatasets.createMedium(type, mediumModel, mediumSubtypeModel, displayTitleModel, sourceModel);
					medium = new TIMAAT.Medium(newMedium, type);
					// $('#timaat-mediadatasets-metadata-form').data(type, medium);
				}
				await TIMAAT.MediaDatasets.refreshDatatable('medium');
				await TIMAAT.MediaDatasets.refreshDatatable(type);
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', type, medium);
			});

			// cancel add/edit button in content form functionality
			$('#timaat-mediadatasets-metadata-form-dismiss').on('click', function(event) {
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				var type = $('#timaat-mediadatasets-metadata-form').attr('data-type');
				if (medium != null) {
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', type, medium);
				} else { // dismiss medium creation
					$('.form').hide();
				}
			});

		},

		initAudios: function() {
			// nav-bar functionality
			$('#media-tab-audio-metadata-form').on('click', function(event) {
				$('.nav-tabs a[href="#audioDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'audio', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add audio button functionality (opens form)
			$('#timaat-mediadatasets-audio-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'audio');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("audio");
			});

		},

		initDocuments: function() {
			// nav-bar functionality
			$('#media-tab-document-metadata-form').on('click', function(event) {
				$('.nav-tabs a[href="#documentDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'document', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add document button functionality (opens form)
			$('#timaat-mediadatasets-document-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'document');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("document");
			});

		},

		initImages: function() {
			// nav-bar functionality
			$('#media-tab-image-metadata-form').on('click', function(event) {
				$('.nav-tabs a[href="#imageDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'image', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add image button functionality (opens form)
			$('#timaat-mediadatasets-image-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'image');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("image");
			});

		},

		initSoftwares: function() {
			// nav-bar functionality
			$('#media-tab-software-metadata-form').on('click', function(event) {
				$('.nav-tabs a[href="#softwareDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'software', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add software button functionality (opens form)
			$('#timaat-mediadatasets-software-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'software');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("software");
			});

		},

		initTexts: function() {
			// nav-bar functionality
			$('#media-tab-text-metadata-form').on('click', function(event) {
				$('.nav-tabs a[href="#textDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'text', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add text button functionality (opens form)
			$('#timaat-mediadatasets-text-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'text');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("text");
			});

		},

		initVideos: function() {
			// nav-bar functionality
			$('#media-tab-video-metadata-form').on('click', function(event) {
				$('.nav-tabs a[href="#videoDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'video', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add medium button functionality (in medium list - opens datasheet form)
			$('#timaat-mediadatasets-video-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'video');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("video");
			});

		},

		initVideogames: function() {
			// nav-bar functionality
			$('#media-tab-videogame-metadata-form').on('click', function(event) {
				$('.nav-tabs a[href="#videogameDatasheet"]').tab('show');
				$('.form').hide();
				// $('#timaat-mediadatasets-metadata-form').show();
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'videogame', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add videogame button functionality (opens form)
			$('#timaat-mediadatasets-videogame-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'videogame');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium("videogame");
			});

		},
		
		initTitles: function() {
			$('#media-tab-medium-titles-form').click(function(event) {
				$('.nav-tabs a[href="#mediumTitles"]').tab('show');
				$('.form').hide();
				TIMAAT.MediaDatasets.setMediumTitleList($('#timaat-mediadatasets-metadata-form').data('medium'))
				$('#timaat-mediadatasets-medium-titles-form').show();
				TIMAAT.MediaDatasets.mediumFormTitles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});
			
			// edit titles form button handler
			$('#timaat-mediadatasets-medium-titles-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormTitles('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
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
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="newTitle[`+i+`]" data-role="newTitle[`+i+`]" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" required>
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
					$('input[data-role="newTitle['+i+']"').attr("value", TIMAAT.MediaDatasets.replaceSpecialCharacters(title));
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
							element.title = TIMAAT.MediaDatasets.replaceSpecialCharacters(formData[i+2].value);
							element.titleLanguageId = formData[i+3].value;
							i = i+4;
						} else { // display title set, original title not set
							element.isOriginalTitle = false;
							element.title = TIMAAT.MediaDatasets.replaceSpecialCharacters(formData[i+1].value);
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						}
					} else { // display title not set, original title set
						element.isDisplayTitle = false;
						if (formData[i].name == 'isOriginalTitle' && formData[i].value == 'on' ) {
							element.isOriginalTitle = true;
							element.title = TIMAAT.MediaDatasets.replaceSpecialCharacters(formData[i+1].value);
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						} else {
							// display title not set, original title not set
							element.isOriginalTitle = false;
							element.title = TIMAAT.MediaDatasets.replaceSpecialCharacters(formData[i].value);
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
						// update original title
						var originalTitleChanged = false
						if (formTitleList[i].isOriginalTitle) {
							medium.model.originalTitle = medium.model.titles[i];
							originalTitleChanged = true;
						// }
						// // if form sets title and title was either not set or was set to different entry or title data has changed
						// if (formTitleList[i].isOriginalTitle && (medium.model.originalTitle == null || medium.model.originalTitle.id != medium.model.titles[i].id || medium.model.originalTitle == medium.model.titles[i])) {
						// 	console.log("medium.model.originalTitle", medium.model.originalTitle);
						// 	medium.model.originalTitle = medium.model.titles[i];
            //   console.log("medium.model.originalTitle", medium.model.originalTitle);
						// 	originalTitleChanged = true;
						// else if form does not set title and title was set before and title was set to this entry
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
						// update original title
						var originalTitleChanged = false
						if (formTitleList[i].isOriginalTitle) {
							medium.model.originalTitle = medium.model.titles[i];
							originalTitleChanged = true;
						// if (formTitleList[i].isOriginalTitle && (medium.model.originalTitle == null || medium.model.originalTitle.id != medium.model.titles[i].id || medium.model.originalTitle == medium.model.titles[i])) {
						// 	medium.model.originalTitle = medium.model.titles[i];
						// 	originalTitleChanged = true;
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
						// update original title
						var originalTitleChanged = false
						if (formTitleList[i].isOriginalTitle) {
							medium.model.originalTitle = medium.model.titles[i];
							originalTitleChanged = true;
						// if (formTitleList[i].isOriginalTitle && (medium.model.originalTitle == null || medium.model.originalTitle.id != medium.model.titles[i].id || medium.model.originalTitle == medium.model.titles[i])) {
						// 	medium.model.originalTitle = medium.model.titles[i];
						// 	originalTitleChanged = true;
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
				TIMAAT.MediaDatasets.mediumFormTitles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});
		},

		initLanguageTracks: function() {
			// languagetrack tab click handling
			$('#media-tab-medium-languagetracks-form').click(function(event) {
				$('.nav-tabs a[href="#mediumLanguageTracks"]').tab('show');
				$('.form').hide();
				TIMAAT.MediaDatasets.setMediumLanguageTrackList($('#timaat-mediadatasets-metadata-form').data('medium'))
				$('#timaat-mediadatasets-medium-languagetracks-form').show();
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});
			
			// edit languageTracks form button handler
			$('#timaat-mediadatasets-medium-languagetracks-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
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
					var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
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
					var entry = $(this).closest('.form-group').attr('data-id');
					var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
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
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});
		},

		load: function() {
    	console.log("TCL: load: async function()");
			TIMAAT.MediaDatasets.loadMedia();
			TIMAAT.MediaDatasets.loadMediaTypes();
			TIMAAT.MediaDatasets.loadAllMediumSubtypes();
		},

		loadMediaTypes: function() {
    	// console.log("TCL: loadMediaTypes: function()");
			TIMAAT.MediaService.listMediaTypes(TIMAAT.MediaDatasets.setMediaTypeList);
		},
		
		loadMedia: function() {
			console.log("TCL: loadMedia: async function()");
			$('.media-cards').hide();
			$('.media-card').show();
			$('#timaat-mediadatasets-metadata-form').data('mediumType', 'medium');
			// TIMAAT.MediaService.listMedia(TIMAAT.MediaDatasets.setMediumList);
			// TIMAAT.MediaDatasets.setMediumList();
		},

		loadMediaDatatables: async function() {
    	console.log("TCL: loadMediaDatatables: async function()");
			TIMAAT.MediaDatasets.setupMediaDatatable();
			TIMAAT.MediaDatasets.setupAudioDatatable();
			TIMAAT.MediaDatasets.setupDocumentDatatable();
			TIMAAT.MediaDatasets.setupImageDatatable();
			TIMAAT.MediaDatasets.setupSoftwareDatatable();
			TIMAAT.MediaDatasets.setupTextDatatable();
			TIMAAT.MediaDatasets.setupVideoDatatable();
			TIMAAT.MediaDatasets.setupVideogameDatatable();
		},

		loadMediumSubtype: function(mediumSubtype) {
    	console.log("TCL: loadMediumSubtype - mediumSubtype", mediumSubtype);
			$('.media-cards').hide();
			$('.form').hide();
			$('.'+mediumSubtype+'s-card').show();
			$('#timaat-mediadatasets-metadata-form').data('mediumType', mediumSubtype);
			switch (mediumSubtype) {
				case 'audio':
					// TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setAudioList);
					TIMAAT.MediaDatasets.setAudioList();
				break;
				case 'document':
					// TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setDocumentList);
					TIMAAT.MediaDatasets.setDocumentList();
				break;
				case 'image':
					// TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setImageList);
					TIMAAT.MediaDatasets.setImageList();
				break;
				case 'software':
					// TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setSoftwareList);
					TIMAAT.MediaDatasets.setSoftwareList();
				break;
				case 'text':
					// TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setTextList);
					TIMAAT.MediaDatasets.setTextList();
				break;
				case 'video':
					// TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideoList);
					TIMAAT.MediaDatasets.setVideoList();
				break;
				case 'videogame':
					// TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideogameList);
					TIMAAT.MediaDatasets.setVideogameList();
				break;
			};
		},

		loadAllMediumSubtypes: function() {
    	console.log("TCL: loadAllMediumSubtypes()");
			// TIMAAT.MediaService.listMediumSubtype('audio', TIMAAT.MediaDatasets.setAudioList);
			// TIMAAT.MediaService.listMediumSubtype('document', TIMAAT.MediaDatasets.setDocumentList);
			// TIMAAT.MediaService.listMediumSubtype('image', TIMAAT.MediaDatasets.setImageList);
			// TIMAAT.MediaService.listMediumSubtype('software', TIMAAT.MediaDatasets.setSoftwareList);
			// TIMAAT.MediaService.listMediumSubtype('text', TIMAAT.MediaDatasets.setTextList);
			// TIMAAT.MediaService.listMediumSubtype('video', TIMAAT.MediaDatasets.setVideoList);
			// TIMAAT.MediaService.listMediumSubtype('videogame', TIMAAT.MediaDatasets.setVideogameList);
			TIMAAT.MediaDatasets.setAudioList();
			TIMAAT.MediaDatasets.setDocumentList();
			TIMAAT.MediaDatasets.setImageList();
			TIMAAT.MediaDatasets.setSoftwareList();
			TIMAAT.MediaDatasets.setTextList();
			TIMAAT.MediaDatasets.setVideoList();
			TIMAAT.MediaDatasets.setVideogameList();
		},

		setMediaTypeList: function(mediaTypes) {
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

		setMediumList: function() {
    	console.log("TCL: setMediumList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.media == null ) return;
			
			$('#timaat-mediadatasets-medium-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-medium-list').empty();
			
			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableMedia ) {
				// TIMAAT.MediaDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
				TIMAAT.MediaDatasets.dataTableMedia.ajax.reload();
			}
		},

		setAudioList: function() {
			// console.log("TCL: setAudioList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.audios == null ) return;
			
			$('#timaat-mediadatasets-audio-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-audio-list').empty();

			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableAudio ) {
				// TIMAAT.MediaDatasets.dataTableAudio.ajax.url('/TIMAAT/api/medium/audio/list');
				TIMAAT.MediaDatasets.dataTableAudio.ajax.reload();
			}
		},

		setDocumentList: function() {
			// console.log("TCL: setDocumentList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.documents == null ) return;

			$('#timaat-mediadatasets-document-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-document-list').empty();

			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableDocument ) {
				// TIMAAT.MediaDatasets.dataTableDocument.ajax.url('/TIMAAT/api/medium/document/list');
				TIMAAT.MediaDatasets.dataTableDocument.ajax.reload();
			}
		},

		setImageList: function() {
			// console.log("TCL: setImageList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.images == null ) return;

			$('#timaat-mediadatasets-image-list-loader').remove();
			// clear old UI list

			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableImage ) {
				// TIMAAT.MediaDatasets.dataTableImage.ajax.url('/TIMAAT/api/medium/image/list');
				TIMAAT.MediaDatasets.dataTableImage.ajax.reload();
			}
			$('#timaat-mediadatasets-image-list').empty();
		},

		setSoftwareList: function() {
			// console.log("TCL: setSoftwareList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.softwares == null ) return;

			$('#timaat-mediadatasets-software-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-software-list').empty();

			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableSoftware ) {
				// TIMAAT.MediaDatasets.dataTableSoftware.ajax.url('/TIMAAT/api/medium/software/list');
				TIMAAT.MediaDatasets.dataTableSoftware.ajax.reload();
			}
		},

		setTextList: function() {
			// console.log("TCL: setTextList");
			$('.form');
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.texts == null ) return;
			$('#timaat-mediadatasets-text-list-loader').remove();
			// clear old UI list

			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableText ) {
				// TIMAAT.MediaDatasets.dataTableText.ajax.url('/TIMAAT/api/medium/text/list');
				TIMAAT.MediaDatasets.dataTableText.ajax.reload();
			}
			$('#timaat-mediadatasets-text-list').empty();
		},
		
		setVideoList: function() {
			console.log("TCL: setVideoList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.videos == null ) return;

			$('#timaat-mediadatasets-video-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-video-list').empty();

			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableVideo ) {
				// TIMAAT.MediaDatasets.dataTableVideo.ajax.url('/TIMAAT/api/medium/video/list');
				TIMAAT.MediaDatasets.dataTableVideo.ajax.reload();
			}
/*
			if (TIMAAT.VideoChooser.initialized == false) {
				TIMAAT.VideoChooser.setMedia();
				TIMAAT.VideoChooser.setVideoList(TIMAAT.MediaDatasets.videos.model);
				TIMAAT.VideoChooser.initialized = true;
			}
*/
		},

		setVideogameList: function() {
			// console.log("TCL: setVideogameList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaDatasets.videogames == null ) return;
			$('#timaat-mediadatasets-videogame-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-videogame-list').empty();

			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableVideogame ) {
				// TIMAAT.MediaDatasets.dataTableVideogame.ajax.url('/TIMAAT/api/medium/videogame/list');
				TIMAAT.MediaDatasets.dataTableVideogame.ajax.reload();
			}
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
			$('#timaat-mediadatasets-metadata-form').data(mediumType, null);
			mediumFormMetadataValidator.resetForm();

			$('#timaat-mediadatasets-metadata-form').trigger('reset');
			$('#timaat-mediadatasets-metadata-form').show();
			$('.datasheet-data').hide();
			$('.title-data').show();
			$('.medium-data').show();
			// if (mediumType == 'medium') {
			// 	$('.mediumtype-data').show();
			// }	else {
			// 	$('.mediumtype-data').hide();
			// }
			$('.source-data').show();
			$('.'+mediumType+'-data').show();

			$('#timaat-mediadatasets-metadata-form-edit').hide();
      $('#timaat-mediadatasets-metadata-form-delete').hide();
      $('#timaat-mediadatasets-metadata-form-submit').html('Add');
      $('#timaat-mediadatasets-metadata-form-submit').show();
      $('#timaat-mediadatasets-metadata-form-dismiss').show();
			$('#timaat-mediadatasets-metadata-form :input').prop('disabled', false);
			$('#mediumFormHeader').html("Add "+mediumType);

			$('#timaat-mediadatasets-metadata-title').focus();

			// setup form
			$('#timaat-mediadatasets-metadata-medium-releasedate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediadatasets-metadata-medium-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', true);
			// $('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', false);
		},

		mediumFormDatasheet: function(action, mediumType, mediumTypeData) {
    	console.log("TCL: action, mediumType, mediumTypeData", action, mediumType, mediumTypeData);
			$('#timaat-mediadatasets-metadata-form').trigger('reset');
			$('#timaat-mediadatasets-metadata-form').attr('data-type', mediumType);
			$('.datasheet-data').hide();
			$('.title-data').show();
			$('.medium-data').show();
			// if (mediumType == "medium") {
			// 	$('.mediumtype-data').show();
			// }	else {
			// 	$('.mediumtype-data').hide();
			// }
			$('.source-data').show();
			$('.'+mediumType+'-data').show();
			mediumFormMetadataValidator.resetForm();

			// show tabs
			$('.'+mediumType+'-data-tab').show();
			$('.title-data-tab').show();
			$('.languagetrack-data-tab').show();

			$('.nav-tabs a[href="#'+mediumType+'Datasheet"]').focus();
			$('#timaat-mediadatasets-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-mediadatasets-metadata-form :input').prop('disabled', true);
				$('#timaat-mediadatasets-metadata-form-edit').prop('disabled', false);
				$('#timaat-mediadatasets-metadata-form-edit :input').prop('disabled', false);
				$('#timaat-mediadatasets-metadata-form-edit').show();
				$('#timaat-mediadatasets-metadata-form-delete').prop('disabled', false);
				$('#timaat-mediadatasets-metadata-form-delete :input').prop('disabled', false);
				$('#timaat-mediadatasets-metadata-form-delete').show();
				$('#timaat-mediadatasets-metadata-form-submit').hide();
				$('#timaat-mediadatasets-metadata-form-dismiss').hide();
				$('#mediumFormHeader').html(mediumType+" Datasheet (#"+ mediumTypeData.model.id+')');
			}
			else if (action == 'edit') {
				// if (mediumType == 'medium') {
				// 	$('#timaat-mediadatasets-metadata-medium-mediatype-id').prop('disabled', true);
				// }	else {
				// 	$('#timaat-mediadatasets-metadata-medium-mediatype-id').hide();
				// }
				$('#timaat-mediadatasets-metadata-medium-releasedate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-mediadatasets-metadata-medium-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-mediadatasets-metadata-form :input').prop('disabled', false);
				$('#timaat-mediadatasets-metadata-form-edit').hide();
				$('#timaat-mediadatasets-metadata-form-edit').prop('disabled', true);
				$('#timaat-mediadatasets-metadata-form-edit :input').prop('disabled', true);
				$('#timaat-mediadatasets-metadata-form-delete').hide();
				$('#timaat-mediadatasets-metadata-form-delete').prop('disabled', true);
				$('#timaat-mediadatasets-metadata-form-delete :input').prop('disabled', true);
				$('#timaat-mediadatasets-metadata-form-submit').html('Save');
				$('#timaat-mediadatasets-metadata-form-submit').show();
				$('#timaat-mediadatasets-metadata-form-dismiss').show();
				$('#mediumFormHeader').html("Edit "+mediumType);
				$('#timaat-mediadatasets-metadata-medium-title').focus();
			}

			// console.log("TCL: mediumTypeData", mediumTypeData);
			// setup UI
			var data = mediumTypeData.model;
      // console.log("data", data);

			// medium data
			$('#timaat-mediadatasets-metadata-medium-mediatype-id').val(data.mediaType.id);
			$('#timaat-mediadatasets-metadata-medium-remark').val(data.remark);
			$('#timaat-mediadatasets-metadata-medium-copyright').val(data.copyright);
			if (isNaN(moment(data.releaseDate)))
				$('#timaat-mediadatasets-metadata-medium-releasedate').val('');
				else $('#timaat-mediadatasets-metadata-medium-releasedate').val(moment(data.releaseDate).format('YYYY-MM-DD'));
			// display-title data
			$('#timaat-mediadatasets-metadata-medium-title').val(data.displayTitle.name);
			$('#timaat-mediadatasets-metadata-medium-title-language-id').val(data.displayTitle.language.id);
			// source data
			if (data.sources[0].isPrimarySource)
				$('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', true);
				else $('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', false);
			$('#timaat-mediadatasets-metadata-medium-source-url').val(data.sources[0].url);
			if (isNaN(moment.utc(data.sources[0].lastAccessed))) 
				$('#timaat-mediadatasets-metadata-medium-source-lastaccessed').val('');
				else $('#timaat-mediadatasets-metadata-medium-source-lastaccessed').val(moment.utc(data.sources[0].lastAccessed).format('YYYY-MM-DD HH:mm'));
			if (data.sources[0].isStillAvailable)
				$('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', true);
				else $('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', false);
				
			// medium subtype specific data
			switch (mediumType) {
				case 'audio':
					$("#timaat-mediadatasets-metadata-audio-length").val(data.mediumAudio.length);
				break;
				case "mediumDocument":
				break;
				case 'image':
					$("#timaat-mediadatasets-metadata-image-width").val(data.mediumImage.width);
					$("#timaat-mediadatasets-metadata-image-height").val(data.mediumImage.height);
					$("#timaat-mediadatasets-metadata-image-bitdepth").val(data.mediumImage.bitDepth);
				break;
				case 'software':
					$("#timaat-mediadatasets-metadata-software-version").val(data.mediumSoftware.version);
				break;
				case 'text':
					$("#timaat-mediadatasets-metadata-text-content").val(data.mediumText.content);
				break;
				case 'video':
					$('#timaat-mediadatasets-metadata-video-length').val(data.mediumVideo.length);
					$('#timaat-mediadatasets-metadata-video-videocodec').val(data.mediumVideo.videoCodec);
					$('#timaat-mediadatasets-metadata-video-width').val(data.mediumVideo.width);
					$('#timaat-mediadatasets-metadata-video-height').val(data.mediumVideo.height);
					$('#timaat-mediadatasets-metadata-video-framerate').val(data.mediumVideo.frameRate);
					$('#timaat-mediadatasets-metadata-video-datarate').val(data.mediumVideo.dataRate);
					$('#timaat-mediadatasets-metadata-video-totalbitrate').val(data.mediumVideo.totalBitrate);
					if (data.mediumVideo.isEpisode)
						$('#timaat-mediadatasets-metadata-video-isepisode').prop('checked', true);
						else $('#timaat-mediadatasets-metadata-video-isepisode').prop('checked', false);
				break;
				case 'videogame':
					if (data.mediumVideogame.isEpisode)
					$("#timaat-mediadatasets-metadata-videogame-isepisode").prop('checked', true);
					else $("#timaat-mediadatasets-metadata-videogame-isepisode").prop('checked', false);
				break;
			}
			$('#timaat-mediadatasets-metadata-form').data(mediumType, mediumTypeData);
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
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" name="title[`+i+`]" data-role="title[`+medium.model.titles[i].id+`]" placeholder="[Enter title]" aria-describedby="Title" minlength="3" maxlength="200" rows="1" required>
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
						$('[data-role="displayTitle['+medium.model.titles[i].id+']"').prop('checked',true);							
					}
					if (medium.model.originalTitle && medium.model.titles[i].id == medium.model.originalTitle.id) {
						$('[data-role="originalTitle['+medium.model.titles[i].id+']"').prop('checked',true);							
					}
					$('input[name="title['+i+']"').rules("add", { required: true, minlength: 3, maxlength: 200, });
					$('input[data-role="title['+medium.model.titles[i].id+']"').attr("value", TIMAAT.MediaDatasets.replaceSpecialCharacters(medium.model.titles[i].name));
					$('[data-role="titleLanguageId['+medium.model.titles[i].id+']"')
					.find('option[value='+medium.model.titles[i].language.id+']')
					.attr("selected",true);
					$('select[name="titleLanguageId['+medium.model.titles[i].id+']"').rules("add", { required: true, });
			};

			if ( action == 'show') {
				$('#timaat-mediadatasets-medium-titles-form :input').prop('disabled', true);
				$('#timaat-mediadatasets-medium-titles-form-edit').show();
				$('#timaat-mediadatasets-medium-titles-form-edit').prop('disabled', false);
				$('#timaat-mediadatasets-medium-titles-form-edit :input').prop('disabled', false);
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
				$('#timaat-mediadatasets-medium-titles-form :input').prop('disabled', false);
				$('#timaat-mediadatasets-medium-titles-form-edit').hide();
				$('#timaat-mediadatasets-medium-titles-form-edit').prop('disabled', true);
				$('#timaat-mediadatasets-medium-titles-form-edit :input').prop('disabled', true);
				$('[data-role="new-title-fields"').show();
				$('.title-form-divider').show();
				$('#mediumTitlesLabel').html("Medium Titelliste bearbeiten");
				$('#timaat-mediadatasets-medium-titles-form-submit').html("Speichern");
				$('#timaat-mediadatasets-metadata-medium-title').focus();

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
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop('disabled', true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').show();
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').prop('disabled', false);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit :input').prop('disabled', false);
				$('#timaat-mediadatasets-medium-languagetracks-form-done').hide();
				$('[data-role="new-languagetrack-fields"').hide();
				$('.languagetrack-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumLanguageTracksLabel').html("Medium Spurliste");
			}
			else if (action == 'edit') {
				$('#timaat-mediadatasets-medium-languagetracks-form-done').show();
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop('disabled', false);
				$('.timaat-mediadatasets-medium-languagetracks-languagetrack-type-id').prop('disabled', true);
				$('.timaat-mediadatasets-medium-languagetracks-languagetrack-language-id').prop('disabled', true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').hide();
				$('#timaat-mediadatasets-medium-languagetracks-form-edit').prop('disabled', true);
				$('#timaat-mediadatasets-medium-languagetracks-form-edit :input').prop('disabled', true);
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
    	console.log("TCL: createMedium: mediumSubtype, mediumModel, mediumSubtypeModel, title, source", mediumSubtype, mediumModel, mediumSubtypeModel, title, source);
			try { // TODO needs to be called after createMedium once m-n-table is refactored to 1-n table (sure?)
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
				// await TIMAAT.MediaDatasets._mediumAdded(mediumSubtype, newMediumModel); //* commented out with datatables
			} catch(error) {
				console.log( "error: ", error);
			};
			return (newMediumModel);
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
        // console.log("tempDisplayTitle", tempDisplayTitle);
				medium.model.displayTitle = tempDisplayTitle;
			} catch(error) {
				console.log( "error: ", error);
			};

			try { // update original title
				if (medium.model.originalTitle) { // medium initially has no original title set
					// for changes in datasheet form that impact data in originaltitle
					if (medium.model.displayTitle.id == medium.model.originalTitle.id) {
						medium.model.originalTitle = medium.model.displayTitle;
					}
					var tempOriginalTitle = await TIMAAT.MediaService.updateTitle(medium.model.originalTitle);
          // console.log("tempOriginalTitle", tempOriginalTitle);
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

			// try { // update media lists
			// 	await TIMAAT.MediaDatasets._mediumUpdated(mediumSubtype, medium);
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };
			
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
    	console.log("TCL: _mediumAdded - mediumSubtype, medium: ", mediumSubtype, medium);
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
				// TIMAAT.MediaDatasets.media.model.push(medium);
				// TIMAAT.MediaDatasets.media.push(newMedium);
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		_mediumRemoved: async function(medium) {
    	// console.log("TCL: _mediumRemoved", medium);
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

			try {
				await TIMAAT.MediaService.removeMedium(medium);
			} catch(error) {
				console.log("error: ", error);
			}

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

		createMediumModel: async function(formDataObject, type) {
			let typeId = 0;
			switch (type) {
				case "audio":
					typeId = 1;
				break;
				case "document":
					typeId = 2;
				break;
				case "image":
					typeId = 3;
				break;
				case "software":
					typeId = 4;
				break;
				case "text":
					typeId = 5;
				break;
				case "video":
					typeId = 6;
				break;
				case "videogame":
					typeId = 7;
				break;
			}
			var medium = {
				id: 0,
				remark: formDataObject.remark,
				copyright: formDataObject.copyright,
				releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
				mediaType: {
					id: typeId,
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

		replaceSpecialCharacters: function(unsafe) {
			return unsafe
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "\"")
			.replace(/'/g, "\'");
				// .replace(/&/g, "&amp;")
				// .replace(/</g, "&lt;")
				// .replace(/>/g, "&gt;")
				// .replace(/"/g, "&quot;")
				// .replace(/'/g, "&#039;");
	 	},

		setupMediaDatatable: function() {			
			console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableMedia = $('#timaat-mediadatasets-media-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: ''
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
						// console.log("TCL: TIMAAT.MediaDatasets.media (last)", TIMAAT.MediaDatasets.media);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'medium'));
							}
						});
						TIMAAT.MediaDatasets.media = meds;
						TIMAAT.MediaDatasets.media.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.media (current)", TIMAAT.MediaDatasets.media);
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#mediumDatasheet"]').tab('show');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.media.length; i++) {
							if (TIMAAT.MediaDatasets.media[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.media[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', selectedMedium.model.mediaType.mediaTypeTranslations[0].type, selectedMedium);
					});
				},
				"columns": [
					{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
						// console.log("TCL: medium", medium);
						let displayMediumTypeIcon = '';
						switch (medium.mediaType.mediaTypeTranslations[0].type) {
							case 'audio':
								displayMediumTypeIcon = '  <i class="far fa-file-audio"></i>';
							break;
							case 'document':
								displayMediumTypeIcon = '  <i class="far fa-file-pdf"></i>';
							break;
							case 'image':
								displayMediumTypeIcon = '  <i class="far fa-file-image"></i>';
							break;
							case 'software':
								displayMediumTypeIcon = '  <i class="fas fa-compact-disc"></i>';
							break;
							case 'text':
								displayMediumTypeIcon = '  <i class="far fa-file-alt"></i>';
							break;
							case 'video':
								displayMediumTypeIcon = '  <i class="far fa-file-video"></i>';
							break;
							case 'videogame':
								displayMediumTypeIcon = '  <i class="fas fa-gamepad"></i>';
							break;
						}
						let titleDisplay = `<p>` + displayMediumTypeIcon + `  ` + medium.displayTitle.name +`</p>`;
							if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
							}
							medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
								if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
									titleDisplay += `<div style="display:none">`+title.name+`</div>`;
								}
							});
							return titleDisplay;
						}
					},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No media found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ media total)",
					"infoEmpty"   : "No media available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ media)",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupAudioDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableAudio = $('#timaat-mediadatasets-audio-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/audio/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: 'audio'
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
						// console.log("TCL: TIMAAT.MediaDatasets.audios (last)", TIMAAT.MediaDatasets.audios);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'audio'));
							}
						});
						TIMAAT.MediaDatasets.audios = meds;
						TIMAAT.MediaDatasets.audios.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.audios (current)", TIMAAT.MediaDatasets.audios);
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#audioDatasheet"]').tab("show");
						// $(this).addClass('.selectedEntry');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.audios.length; i++) {
							if (TIMAAT.MediaDatasets.audios[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.audios[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'audio', selectedMedium);
					});
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let titleDisplay = `<p>` + medium.displayTitle.name +`</p>`;
						if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
						}
						medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No audios found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ audios total)",
					"infoEmpty"   : "No audios available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ audio(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupDocumentDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableDocument = $('#timaat-mediadatasets-document-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/document/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: 'document'
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
						// console.log("TCL: TIMAAT.MediaDatasets.documents (last)", TIMAAT.MediaDatasets.documents);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'document'));
							}
						});
						TIMAAT.MediaDatasets.documents = meds;
						TIMAAT.MediaDatasets.documents.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.documents (current)", TIMAAT.MediaDatasets.documents);
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#documentDatasheet"]').tab("show");
						// $(this).addClass('.selectedEntry');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.documents.length; i++) {
							if (TIMAAT.MediaDatasets.documents[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.documents[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'document', selectedMedium);
					});
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let titleDisplay = `<p>` + medium.displayTitle.name +`</p>`;
						if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
						}
						medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No documents found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ documents total)",
					"infoEmpty"   : "No documents available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ documents(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupImageDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableImage = $('#timaat-mediadatasets-image-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/image/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: 'image'
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
						// console.log("TCL: TIMAAT.MediaDatasets.images (last)", TIMAAT.MediaDatasets.images);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'image'));
							}
						});
						TIMAAT.MediaDatasets.images = meds;
						TIMAAT.MediaDatasets.images.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.images (current)", TIMAAT.MediaDatasets.images);
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#imageDatasheet"]').tab("show");
						// $(this).addClass('.selectedEntry');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.images.length; i++) {
							if (TIMAAT.MediaDatasets.images[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.images[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'image', selectedMedium);
					});
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let titleDisplay = `<p>` + medium.displayTitle.name +`</p>`;
						if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
						}
						medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No images found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ images total)",
					"infoEmpty"   : "No images available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ image(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupSoftwareDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableSoftware = $('#timaat-mediadatasets-software-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/software/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: 'software'
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
						// console.log("TCL: TIMAAT.MediaDatasets.softwares (last)", TIMAAT.MediaDatasets.softwares);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'software'));
							}
						});
						TIMAAT.MediaDatasets.softwares = meds;
						TIMAAT.MediaDatasets.softwares.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.softwares (current)", TIMAAT.MediaDatasets.softwares);
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#softwareDatasheet"]').tab("show");
						// $(this).addClass('.selectedEntry');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.softwares.length; i++) {
							if (TIMAAT.MediaDatasets.softwares[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.softwares[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'software', selectedMedium);
					});
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let titleDisplay = `<p>` + medium.displayTitle.name +`</p>`;
						if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
						}
						medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No software found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ software total)",
					"infoEmpty"   : "No software available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ software(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupTextDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableText = $('#timaat-mediadatasets-text-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/text/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: 'text'
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
						// console.log("TCL: TIMAAT.MediaDatasets.texts (last)", TIMAAT.MediaDatasets.texts);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'text'));
							}
						});
						TIMAAT.MediaDatasets.texts = meds;
						TIMAAT.MediaDatasets.texts.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.texts (current)", TIMAAT.MediaDatasets.texts);
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#textDatasheet"]').tab("show");
						// $(this).addClass('.selectedEntry');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.texts.length; i++) {
							if (TIMAAT.MediaDatasets.texts[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.texts[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'text', selectedMedium);
					});
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let titleDisplay = `<p>` + medium.displayTitle.name +`</p>`;
						if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
						}
						medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No texts found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ texts total)",
					"infoEmpty"   : "No texts available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ text(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupVideoDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableVideo = $('#timaat-mediadatasets-video-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/video/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: 'video'
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
						// console.log("TCL: TIMAAT.MediaDatasets.videos (last)", TIMAAT.MediaDatasets.videos);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'video'));
							}
						});
						TIMAAT.MediaDatasets.videos = meds;
						TIMAAT.MediaDatasets.videos.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.videos (current)", TIMAAT.MediaDatasets.videos);
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#videoDatasheet"]').tab("show");
						// $(this).addClass('.selectedEntry');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.videos.length; i++) {
							if (TIMAAT.MediaDatasets.videos[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.videos[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'video', selectedMedium);
					});
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let titleDisplay = `<p>` + medium.displayTitle.name +`</p>`;
						if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
						}
						medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No videos found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ video total)",
					"infoEmpty"   : "No videos available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ video(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		setupVideogameDatatable: function() {			
			// console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.MediaDatasets.dataTableVideogame = $('#timaat-mediadatasets-videogame-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/medium/videogame/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// mediumsubtype: 'videogame'
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
						// console.log("TCL: TIMAAT.MediaDatasets.videogames (last)", TIMAAT.MediaDatasets.videogames);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'videogame'));
							}
						});
						TIMAAT.MediaDatasets.videogames = meds;
						TIMAAT.MediaDatasets.videogames.model = data.data;
						// console.log("TCL: TIMAAT.MediaDatasets.videogames (current)", TIMAAT.MediaDatasets.videogames);
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#videogameDatasheet"]').tab("show");
						// $(this).addClass('.selectedEntry');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.videogames.length; i++) {
							if (TIMAAT.MediaDatasets.videogames[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.videogames[i];
								break;
							}
						}
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'videogame', selectedMedium);
					});
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let titleDisplay = `<p>` + medium.displayTitle.name +`</p>`;
						if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
						}
						medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},			
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No videogames found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ videogames total)",
					"infoEmpty"   : "No videogames available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ videogame(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		refreshDatatable: async function(mediaType) {
			console.log("TCL: refreshDatatable - mediaType: ", mediaType);
			// set ajax data source
			switch(mediaType) {
				case 'medium':
					if (TIMAAT.MediaDatasets.dataTableMedia) {
						// TIMAAT.MediaDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
						TIMAAT.MediaDatasets.dataTableMedia.ajax.reload();
						TIMAAT.VideoChooser.dt.ajax.reload();
					}
				break;
				case 'audio':
					if (TIMAAT.MediaDatasets.dataTableAudio) {
						// TIMAAT.MediaDatasets.dataTableAudio.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableAudio.ajax.reload();
					}
				break;
				case 'document':
					if (TIMAAT.MediaDatasets.dataTableDocument) {
						// TIMAAT.MediaDatasets.dataTableDocument.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableDocument.ajax.reload();
					}
				break;
				case 'image':
					if (TIMAAT.MediaDatasets.dataTableImage) {
						// TIMAAT.MediaDatasets.dataTableImage.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableImage.ajax.reload();
					}
				break;
				case 'software':
					if (TIMAAT.MediaDatasets.dataTableSoftware) {
						// TIMAAT.MediaDatasets.dataTableSoftware.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableSoftware.ajax.reload();
					}
				break;
				case 'text':
					if (TIMAAT.MediaDatasets.dataTableText) {
						// TIMAAT.MediaDatasets.dataTableText.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableText.ajax.reload();
					}
				break;
				case 'video':
					if (TIMAAT.MediaDatasets.dataTableVideo) {
						// TIMAAT.MediaDatasets.dataTableVideo.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableVideo.ajax.reload();
					}
				break;
				case 'videogame':
					if (TIMAAT.MediaDatasets.dataTableVideogame) {
						// TIMAAT.MediaDatasets.dataTableVideogame.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableVideogame.ajax.reload();
					}
				break;
			}			
		},

	}
	
}, window));
