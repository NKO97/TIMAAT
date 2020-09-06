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
		subNavTab: 'datasheet',
		lastForm: null,
		selectedMediumId: null,

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
			TIMAAT.MediaDatasets.initActorRoles();
			$('.media-data-tabs').hide();
			$('.media-datatables').hide();
			$('.media-datatable').show();
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
			$('#timaat-mediatype-delete-submit').on('click', function(ev) {
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
				$('#timaat-mediadatasets-mediumtype-meta-name').val(type).trigger('input');
				$('#timaat-mediadatasets-mediumtype-meta-hasvisual').val(hasVisual);
				$('#timaat-mediadatasets-mediumtype-meta-hasaudio').val(hasAudio);
				$('#timaat-mediadatasets-mediumtype-meta-hascontent').val(hasContent);
			});

			// Submit mediaType data
			$('#timaat-mediadatasets-mediumtype-meta-submit').on('click', function(ev) {
				// Create/Edit mediaType window submitted data validation
				var modal = $('#timaat-mediadatasets-mediumtype-meta');
				var mediaType = modal.data('mediaType');
				var type = $('#timaat-mediadatasets-mediumtype-meta-name').val();
				var hasVisual = $('#timaat-mediadatasets-mediumtype-meta-hasvisual').val();
				var hasAudio = $('#timaat-mediadatasets-mediumtype-meta-hasaudio').val();
				var hasContent = $('#timaat-mediadatasets-mediumtype-meta-hascontent').val();

				if (mediaType) {
					mediaType.model.medium.mediaTypeTranslations[0].type = type;
					mediaType.model.hasVisual = hasVisual;
					mediaType.model.hasAudio = hasAudio;
					mediaType.model.hasContent = hasContent;
					// mediaType.updateUI();
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
				if ( $('#timaat-mediadatasets-mediumtype-meta-name').val().length > 0 ) {
					$('#timaat-mediadatasets-mediumtype-meta-submit').prop('disabled', false);
					$('#timaat-mediadatasets-mediumtype-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-mediadatasets-mediumtype-meta-submit').prop('disabled', true);
					$('#timaat-mediadatasets-mediumtype-meta-submit').attr('disabled');
				}
			});
		},

		initMedia: function() {
			// nav-bar functionality
			$('#media-tab-medium-metadata-form').on('click', function(event) {
				console.log("TCL: Media Tab clicked");
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#mediumDatasheet"]').tab('show');
				TIMAAT.MediaDatasets.mediumFormDatasheet('show', type, $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			$('#media-tab-medium-preview-form').on('click', function(event) {
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'mediumPreview';
				TIMAAT.MediaDatasets.lastForm = 'preview';	
				$('.nav-tabs a[href="#mediumPreview"]').tab('show');
				TIMAAT.MediaDatasets.mediumFormPreview(type, $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// add medium button functionality (in medium list - opens datasheet form)
			$('#timaat-mediadatasets-medium-add').on('click', function(event) {
				$('#timaat-mediadatasets-metadata-form').attr('data-type', 'medium');
				$('#timaat-mediadatasets-metadata-form').data('medium', null);
				TIMAAT.MediaDatasets.addMedium('medium');
			});

			// delete medium button (in form) handler
			$('.datasheet-form-delete-button').on('click', function(event) {
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
			$('.mediadatasheet-form-edit-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				switch (TIMAAT.MediaDatasets.lastForm) {
					case 'languagetracks':
						TIMAAT.MediaDatasets.mediumFormLanguageTracks('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
					break;
					case 'titles':
						TIMAAT.MediaDatasets.mediumFormTitles('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
					break;
					case 'actorroles':
						TIMAAT.MediaDatasets.mediumFormActorRoles('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
					break;
					default:
						var type = $('#timaat-mediadatasets-metadata-form').attr('data-type');
						TIMAAT.MediaDatasets.mediumFormDatasheet('edit', type, $('#timaat-mediadatasets-metadata-form').data('medium'));
					break;
				}
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
				// console.log("TCL: formDataObject", formDataObject);
				// sanitize form data
				var formDataSanitized = formDataObject;
				// console.log("TCL: formDataSanitized", formDataSanitized);
				formDataSanitized.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
				// formDataSanitized.releaseDate = (formDataObject.releaseDate != null && !(isNaN(formDataObject.releaseDate))) ? moment.utc(formDataObject.releaseDate, "YYYY-MM-DD") : null;
				formDataSanitized.displayTitleLanguageId = Number(formDataObject.displayTitleLanguageId);
				formDataSanitized.sourceUrl = (formDataObject.sourceUrl.length == 0 ) ? null : formDataObject.sourceUrl;
				formDataSanitized.sourceIsPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
				formDataSanitized.sourceLastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
				// formDataSanitized.sourceLastAccessed = (formDataObject.sourceLastAccessed != null && !(isNaN(formDataObject.sourceLastAccessed))) ? moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm") : null;
				formDataSanitized.sourceIsStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
				formDataSanitized.length = TIMAAT.Util.parseTime(formDataObject.length);
				formDataSanitized.isEpisode = (formDataObject.isEpisode == "on") ? true : false;
        // console.log("TCL: formDataSanitized", formDataSanitized);

				if (medium) { // update medium
					// medium data
					medium = await TIMAAT.MediaDatasets.updateMediumModelData(medium, formDataSanitized);
					// medium subtype data
					switch (type) {
						case "audio":
							medium.model.mediumAudio.length = formDataSanitized.length;
						break;
						case "document":
						break;
						case "image":
							medium.model.mediumImage.width = formDataSanitized.width;
							medium.model.mediumImage.height = formDataSanitized.height;
							medium.model.mediumImage.bitDepth = formDataSanitized.bitDepth;
						break;
						case "software":
							medium.model.mediumSoftware.version = formDataSanitized.version;
						break;
						case "text":
							medium.model.mediumText.content = formDataSanitized.content;
						break;
						case "video":
							medium.model.mediumVideo.length = formDataSanitized.length;
							medium.model.mediumVideo.videoCodec = formDataSanitized.videoCodec;
							medium.model.mediumVideo.width = formDataSanitized.width;
							medium.model.mediumVideo.height = formDataSanitized.height;
							medium.model.mediumVideo.frameRate = formDataSanitized.frameRate;
							medium.model.mediumVideo.dataRate = formDataSanitized.dataRate;
							medium.model.mediumVideo.totalBitrate = formDataSanitized.totalBitrate;
							medium.model.mediumVideo.isEpisode = formDataSanitized.isEpisode;
						break;
						case "videogame":
							medium.model.mediumVideogame.isEpisode = formDataSanitized.isEpisode;
						break;
					}
					await TIMAAT.MediaDatasets.updateMedium(type, medium);
					// medium.updateUI();
				} else { // create new medium
					var mediumModel = await TIMAAT.MediaDatasets.createMediumModel(formDataSanitized, type);
					var displayTitleModel = await TIMAAT.MediaDatasets.createDisplayTitleModel(formDataSanitized);
					var sourceModel = await TIMAAT.MediaDatasets.createSourceModel(formDataSanitized);
					var mediumSubtypeModel = await TIMAAT.MediaDatasets.createMediumSubtypeModel(formDataSanitized, type);

					var newMedium = await TIMAAT.MediaDatasets.createMedium(type, mediumModel, mediumSubtypeModel, displayTitleModel, sourceModel);
					medium = new TIMAAT.Medium(newMedium, type);
					medium.model.fileStatus = 'noFile';
					$('#timaat-mediadatasets-metadata-form').data('medium', medium);
					$('#media-tab-medium-metadata-form').trigger('click');
				}
				await TIMAAT.MediaDatasets.refreshDatatable('medium');
				await TIMAAT.MediaDatasets.refreshDatatable(type);
				TIMAAT.MediaDatasets.selectLastSelection('medium', medium.model.id);
				TIMAAT.MediaDatasets.selectLastSelection(type, medium.model.id);
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

			// upload button handler
			$('.datasheet-form-upload-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;
				medium.listView.find('.timaat-medium-upload-file').click();
			});

			// file upload success event handler
			$(document).on('success.upload.medium.TIMAAT', async function(event, uploadedMedium) {
      	console.log("TCL: Medium -> constructor -> event, uploadedMedium", event, uploadedMedium);
				if ( !uploadedMedium ) return;
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				if ( medium == undefined || medium.model.id != uploadedMedium.id ) return;
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;
				medium.model.fileStatus = await TIMAAT.MediaService.updateFileStatus(medium.model, type);
				medium.model.viewToken = await TIMAAT.MediaService.updateViewToken(medium.model);
				// console.log("TCL: (document).one('success.upload.medium.TIMAAT') for id: ", uploadedMedium.id);
				// console.log("TCL: uploadedMedium.fileStatus", uploadedMedium.fileStatus);
				switch (type) {
					case 'image':
						if ( event.type == 'success' ) {
							medium.model.mediumImage.width = uploadedMedium.mediumImage.width;
							medium.model.mediumImage.height = uploadedMedium.mediumImage.height;
							// medium.model.mediumImage.bitDepth = uploadedMedium.mediumImage.bitDepth; // TODO
							TIMAAT.MediaDatasets.refreshDatatable('image');
							TIMAAT.MediaDatasets.refreshDatatable('medium');
						}
					break;
					case 'video':
						if ( event.type == 'success' ) {
							medium.model.mediumVideo.width = uploadedMedium.mediumVideo.width;
							medium.model.mediumVideo.height = uploadedMedium.mediumVideo.height;
							medium.model.mediumVideo.length = uploadedMedium.mediumVideo.length;
							medium.model.mediumVideo.frameRate = uploadedMedium.mediumVideo.frameRate;
							TIMAAT.MediaDatasets.refreshDatatable('video');
							TIMAAT.MediaDatasets.refreshDatatable('medium');
						}
					break;
				}
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				if (TIMAAT.MediaDatasets.lastForm == 'preview') {
					TIMAAT.MediaDatasets.mediumFormPreview(type, $('#timaat-mediadatasets-metadata-form').data('medium'));
				} else {
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', type, $('#timaat-mediadatasets-metadata-form').data('medium'));
				}
			});

			// annotate button handler
			$('.datasheet-form-annotate-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				TIMAAT.UI.showComponent('videoplayer');
				// setup video in player
				TIMAAT.VideoPlayer.setupVideo(medium.model);
				// load video annotations from server
				TIMAAT.Service.getAnalysisLists(medium.model.id, TIMAAT.VideoPlayer.setupAnalysisLists);
			});
			
			// Key press events
			$('#timaat-mediadatasets-metadata-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-mediadatasets-metadata-form-submit').trigger('click');
				}
			});

			$('#timaat-mediadatasets-metadata-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-mediadatasets-metadata-form-dismiss').trigger('click');
				}
			});

		},

		initAudios: function() {
			// nav-bar functionality
			$('#media-tab-audio-metadata-form').on('click', function(event) {
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#audioDatasheet"]').tab('show');
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
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#documentDatasheet"]').tab('show');
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
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#imageDatasheet"]').tab('show');
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
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#softwareDatasheet"]').tab('show');
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
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#textDatasheet"]').tab('show');
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
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#videoDatasheet"]').tab('show');
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
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'datasheet';
				TIMAAT.MediaDatasets.lastForm = 'datasheet';
				$('.nav-tabs a[href="#videogameDatasheet"]').tab('show');
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
			$('#media-tab-medium-titles-form').on('click', function(event) {
				$('.nav-tabs a[href="#mediumTitles"]').tab('show');
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'mediumTitles';
				TIMAAT.MediaDatasets.lastForm = 'titles';	
				TIMAAT.MediaDatasets.setMediumTitleList($('#timaat-mediadatasets-metadata-form').data('medium'))
				TIMAAT.MediaDatasets.mediumFormTitles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});
			
			// edit titles form button handler
			// $('.mediadatasheet-form-edit-button').on('click', function(event) {
			// 	event.stopPropagation();
			// 	TIMAAT.UI.hidePopups();
			// 	TIMAAT.MediaDatasets.mediumFormTitles('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
			// 	// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			// });

			$(document).on('click', '.isOriginalTitle', function(event) {
        if ($(this).data('waschecked') == true)
        {
          $(this).prop('checked', false);
					// $(this).data('waschecked', false);
					$('input[name="isOriginalTitle"]').data('waschecked', false);
        }
        else {
					$('input[name="isOriginalTitle"]').data('waschecked', false);
					$(this).data('waschecked', true);
				}
			});

			// Add title button click
			$(document).on('click','[data-role="new-title-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				// console.log("TCL: add title to list");
				var listEntry = $(this).closest('[data-role="new-title-fields"]');
				var title = '';
				var languageId = null;
				var languageName = '';
				if (listEntry.find('input').each(function(){           
					title = $(this).val();
				}));
				if (listEntry.find('select').each(function(){
					languageId = $(this).val();
					languageName =$(this).text();
				}));
				if (!$('#timaat-mediadatasets-medium-titles-form').valid()) 
					return false;
				if (title != '' && languageId != null) {
					var titlesInForm = $('#timaat-mediadatasets-medium-titles-form').serializeArray();
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
									<input class="form-check-input isOriginalTitle" type="radio" name="isOriginalTitle" data-role="originalTitle" data-waschecked="false" placeholder="Is Original Title">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name"
											 name="newTitle[`+i+`]"
											 data-role="newTitle[`+i+`]"
											 placeholder="[Enter title]"
											 aria-describedby="Title"
											 minlength="3"
											 maxlength="200"
											 rows="1"
											 required>
							</div>
							<div class="col-sm-2 col-md-2">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id"
												id="new-title-language-select-dropdown_`+i+`"
												name="newTitleLanguageId[`+i+`]"
												data-role="newTitleLanguageId[`+i+`]"
												required>
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
					$('#new-title-language-select-dropdown_'+i).select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/language/selectList/',
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
					var languageSelect = $('#new-title-language-select-dropdown_'+i);
					var option = new Option(languageName, languageId, true, true);
					languageSelect.append(option).trigger('change');
					$('input[name="newTitle['+i+']"').rules('add', { required: true, minlength: 3, maxlength: 200, });
					$('input[data-role="newTitle['+i+']"').attr('value', TIMAAT.MediaDatasets.replaceSpecialCharacters(title));
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
			$('#timaat-mediadatasets-medium-titles-form-submit').on('click', async function(event) {
				// console.log("TCL: Titles form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-title-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				};
				// test if form is valid 
				if (!$('#timaat-mediadatasets-medium-titles-form').valid()) {
					$('[data-role="new-title-fields"]').append(TIMAAT.MediaDatasets.titleFormTitleToAppend());
					$('#title-language-select-dropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/language/selectList/',
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
				// console.log("TCL: Titles form: valid");

				// the original medium model (in case of editing an existing medium)
				var medium = $('#timaat-mediadatasets-medium-titles-form').data("medium");	
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;		
        // console.log("TCL: type", type);

				// Create/Edit medium window submitted data
				var formData = $('#timaat-mediadatasets-medium-titles-form').serializeArray();
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
							await TIMAAT.MediaDatasets.updateMedium(type, medium);
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
							await TIMAAT.MediaDatasets.updateMedium(type, medium);
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
							await TIMAAT.MediaDatasets.updateMedium(type, medium);
						}
					};
					var i = medium.model.titles.length - 1;
					for (; i >= formTitleList.length; i-- ) { // remove obsolete titles
						if (medium.model.originalTitle != null && medium.model.originalTitle.id == medium.model.titles[i].id) {
							medium.model.originalTitle = null;
							console.log("TCL: remove originalTitle before deleting title");		
							await TIMAAT.MediaDatasets.updateMedium(type, medium);
						}
						console.log("TCL: (update existing titles and) delete obsolete ones");		
						TIMAAT.MediaService.removeTitle(medium.model.titles[i]);
						medium.model.titles.pop();		
					}
				}
				console.log("TCL: show medium title form");
				await TIMAAT.MediaDatasets.refreshDatatable(type);
				await TIMAAT.MediaDatasets.refreshDatatable('medium');
				TIMAAT.MediaDatasets.selectLastSelection('medium', medium.model.id);
				TIMAAT.MediaDatasets.selectLastSelection(type, medium.model.id);
				TIMAAT.MediaDatasets.mediumFormTitles('show', medium);
			});

			// Cancel add/edit button in titles form functionality
			$('#timaat-mediadatasets-medium-titles-form-dismiss').on('click', function(event) {
				TIMAAT.MediaDatasets.mediumFormTitles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

			// Key press events
			$('#timaat-mediadatasets-medium-titles-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-mediadatasets-medium-titles-form-submit').trigger('click');
				}
			});

			$('#timaat-mediadatasets-medium-titles-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-mediadatasets-medium-titles-form-dismiss').trigger('click');
				}
			});

			$('#dynamic-title-fields').keypress(function(event) {
				// event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault(); // prevent activating delete button when pressing enter in a field of the row
				}
			});

			$('#new-title-fields').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					event.preventDefault();
					$('#new-title-fields').find('[data-role="add"]').trigger('click');
				}
			});
		},

		initLanguageTracks: function() {
			// languagetrack tab click handling
			$('#media-tab-medium-languagetracks-form').click(function(event) {
				$('.nav-tabs a[href="#mediumLanguageTracks"]').tab('show');
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'mediumLanguageTracks';
				TIMAAT.MediaDatasets.lastForm = 'languagetracks';	
				TIMAAT.MediaDatasets.setMediumLanguageTrackList($('#timaat-mediadatasets-metadata-form').data('medium'))
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});
			
			// edit languageTracks form button handler
			// $('.mediadatasheet-form-edit-button').on('click', function(event) {
			// 	event.stopPropagation();
			// 	TIMAAT.UI.hidePopups();
			// 	TIMAAT.MediaDatasets.mediumFormLanguageTracks('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
			// 	// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			// });

			// Add languageTrack button click
			$(document).on('click','[data-role="new-languagetrack-fields"] > .form-group [data-role="add"]', async function(e) {
				e.preventDefault();
				var listEntry = $(this).closest('[data-role="new-languagetrack-fields"]');
				var mediumLanguageTypeId = listEntry.find('[data-role="languageTrackTypeId"]').val();
				var languageId = listEntry.find('[data-role="languageTrackLanguageId"]').val();
				var languageName = listEntry.find('[data-role="languageTrackLanguageId"]').text();
				// if (!$('#timaat-mediadatasets-medium-languagetracks-form').valid()) return false;
				if (mediumLanguageTypeId != null && languageId != null) {
					var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
					var languageTracksInForm = $('#timaat-mediadatasets-medium-languagetracks-form').serializeArray();
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
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id"
													name="languageTrackTypeId[`+i+`]"
													data-role="languageTrackTypeId[`+i+`]"
													required
													readonly="true">
										<option value="1">Audio track</option>
										<option value="2">Subtitle track</option>
									</select>
								</div>
								<div class="col-md-5">
									<label class="sr-only">Track Language</label>
									<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id"
													id="new-languagetrack-language-select-dropdown_`+i+`"
													name="languageTrackLanguageId[`+i+`]"
													data-role="languageTrackLanguageId[`+i+`]"
													required>
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
						$('#new-languagetrack-language-select-dropdown_'+i).select2({
							closeOnSelect: true,
							scrollAfterSelect: true,
							allowClear: true,
							ajax: {
								url: 'api/language/selectList/',
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
						var languageSelect = $('#new-languagetrack-language-select-dropdown_'+i);
						var option = new Option(languageName, languageId, true, true);
						languageSelect.append(option).trigger('change');
						$('[data-role="languageTrackTypeId['+i+']"]').find('option[value='+mediumLanguageTypeId+']').attr('selected', true);
						$('select[name="languageTrackTypeId['+i+']"').rules('add', { required: true, });
						listEntry.find('[data-role="languageTrackTypeId"]').val('');
						listEntry.find('[data-role="languageTrackLanguageId"]').val('');
						await TIMAAT.MediaDatasets.addLanguageTrack(medium, newTrackEntry);
						// medium.updateUI();
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
					// medium.updateUI();
					TIMAAT.MediaDatasets.mediumFormLanguageTracks('edit', medium);
			});

			// Done button in languageTracks form functionality
			$('#timaat-mediadatasets-medium-languagetracks-form-done').click( function(event) {
				TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

		},

		initActorRoles: function() {
			$('#media-tab-medium-actorwithroles-form').on('click', function(event) {
				$('.nav-tabs a[href="#mediumActorRoles"]').tab('show');
				$('.form').hide();
				TIMAAT.MediaDatasets.subNavTab = 'mediumActorRoles';
				TIMAAT.MediaDatasets.lastForm = 'actorroles';				
				TIMAAT.MediaDatasets.mediumFormActorRoles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});
			
			// edit actorwithroles form button handler
			// $('.mediadatasheet-form-edit-button').on('click', function(event) {
			// 	event.stopPropagation();
			// 	TIMAAT.UI.hidePopups();
			// 	TIMAAT.MediaDatasets.mediumFormActorRoles('edit', $('#timaat-mediadatasets-metadata-form').data('medium'));
			// 	// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			// });

			// add actorwithroles button click
			$(document).on('click','[data-role="new-actorwithrole-fields"] > .form-group [data-role="add"]', async function(event) {
				console.log("TCL: add new actor with role(s)");
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="new-actorwithrole-fields"]');
				var newFormEntry = [];
				if (listEntry.find('select').each(function(){           
					newFormEntry.push($(this).val());
				}));
				// var newEntryId = newFormEntry[0];
				console.log("TCL: newFormEntry", newFormEntry);

				if (!$('#timaat-mediadatasets-medium-actorwithroles-form').valid() || newFormEntry[1].length == 0) //! temp solution to prevent adding actors without roles
				// if (!$('#timaat-mediadatasets-medium-actorwithroles-form').valid())	
				return false;

				// var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
				$('.disable-on-submit').prop('disabled', true);
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', false);
				var existingEntriesInForm = $('#timaat-mediadatasets-medium-actorwithroles-form').serializeArray();
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', true);
				$('.disable-on-submit').prop('disabled', false);
				console.log("TCL: existingEntriesInForm", existingEntriesInForm);

				// create list of actorIds that the medium is already connected with
				var existingEntriesIdList = [];
				var i = 0;
				for (; i < existingEntriesInForm.length; i++) {
					if (existingEntriesInForm[i].name == "actorId") {
						existingEntriesIdList.push(Number(existingEntriesInForm[i].value));
					}
				}
				existingEntriesIdList.pop(); // remove new actor id
				// console.log("TCL: existingEntriesIdList", existingEntriesIdList);
				// check for duplicate medium-actor relation. only one allowed
				var duplicate = false;
				i = 0;
				while (i < existingEntriesIdList.length) {
					if (newFormEntry[0] == existingEntriesIdList[i]) {
						duplicate = true;
						console.log("TCL: duplicate entry found");
						break;
					}
					// console.log("TCL: newEntryId", newEntryId);
					console.log("TCL: existingEntriesIdList[i]", existingEntriesIdList[i]);
					i++;
				}

				if (!duplicate) {
					// var newActorId = newFormEntry[0];
					var newActorSelectData = $('#mediumhasactorwithrole-actorid').select2('data');
					var newActorId = newActorSelectData[0].id;
					var newRoleSelectData = $('#actorwithroles-multi-select-dropdown').select2('data');
					// var actorHasRoleIds = newFormEntry[1];
					$('#dynamic-actorwithrole-fields').append(TIMAAT.MediaDatasets.appendActorWithRolesDataset(existingEntriesIdList.length, newActorId));
					$('#mediumhasactorwithrole-actorid-'+newActorId).select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: false,
						ajax: {
							url: 'api/actor/'+newActorId+'/select',
							type: 'GET',
							dataType: 'json',
							delay: 250,
							headers: {
								"Authorization": "Bearer "+TIMAAT.Service.token,
								"Content-Type": "application/json",
							},
							// additional parameters
							data: function(params) {
								console.log("TCL: data: params", params);
								return {
									search: params.term,
									page: params.page
								};          
							},
							processResults: function(data, params) {
								console.log("TCL: processResults: data", data);
								params.page = params.page || 1;
								return {
									results: data
								};
							},
							cache: true
						},
						minimumInputLength: 0,
					});
					// select actor for new entry

					await TIMAAT.ActorService.getActor(newActorId).then(function (data) {
						var actorSelect = $('#mediumhasactorwithrole-actorid-'+newActorId);
						// console.log("TCL: actorSelect", actorSelect);
						console.log("TCL: then: data", data);
						var option = new Option(data.displayName.name, data.id, true, true);
						actorSelect.append(option).trigger('change');
						// manually trigger the 'select2:select' event
						actorSelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					});
					$('#mediumhasactorwithrole-actorid-'+newActorId).prop('disabled', true);
					
					// provide roles list for new actor entry
					$('#actorwithroles-multi-select-dropdown-'+newActorId).select2({
						closeOnSelect: false,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/medium/hasActor/'+newActorId+'/withRoles/selectList',
							type: 'GET',
							dataType: 'json',
							delay: 250,
							headers: {
								"Authorization": "Bearer "+TIMAAT.Service.token,
								"Content-Type": "application/json",
							},
							// additional parameters
							data: function(params) {
								console.log("TCL: data: params", params);
								return {
									search: params.term,
									page: params.page
								};          
							},
							processResults: function(data, params) {
								console.log("TCL: processResults: data", data);
								params.page = params.page || 1;
								return {
									results: data
								};
							},
							cache: true
						},
						minimumInputLength: 0,
					});

					var roleSelect = $('#actorwithroles-multi-select-dropdown-'+newActorId);
					var j = 0;
					for (; j < newRoleSelectData.length; j++) {
						var option = new Option(newRoleSelectData[j].text, newRoleSelectData[j].id, true, true);
						roleSelect.append(option).trigger('change');
					}
					roleSelect.trigger({
						type: 'select2:select',
						params: {
							data: newRoleSelectData
						}
					});

					// clear new entry values
					$('#mediumhasactorwithrole-actorid').val(null).trigger('change');
					// $('#mediumhasactorwithrole-actorid').prop('required', true);
					$('#actorwithroles-multi-select-dropdown').val(null).trigger('change');
					// $('#actorwithroles-multi-select-dropdown').prop('required', true);
				}
				else { // duplicate actor
					$('#timaat-mediadatasets-actorwithrole-duplicate').modal('show');
				}
			});

			// remove actorwithroles button click
			$(document).on('click','[data-role="dynamic-actorwithrole-fields"] > .form-group [data-role="remove"]', async function(event) {
				console.log("TCL: remove actor with role(s)");
				event.preventDefault();
				$(this).closest('.form-group').remove();
			});

			// submit actorwithroles button functionality
			$('#timaat-mediadatasets-medium-actorwithroles-form-submit').on('click', async function(event) {
				console.log("TCL: ActorWithRole form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("new-actorwithrole-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild)
				}

				//! temp solution to prevent adding actors without roles
				//TODO 

				// test if form is valid 
				if (!$('#timaat-mediadatasets-medium-actorwithroles-form').valid()) {
					$('[data-role="new-actorwithrole-fields"]').append(TIMAAT.MediaDatasets.appendNewActorHasRolesField());				
					return false;
				}

				var medium = $('#timaat-mediadatasets-metadata-form').data('medium');

				// Create/Edit actor window submitted data
				$('.disable-on-submit').prop('disabled', true);
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', false);
				var formDataRaw = $('#timaat-mediadatasets-medium-actorwithroles-form').serializeArray();
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', true);
				$('.disable-on-submit').prop('disabled', false);
				console.log("TCL: formDataRaw", formDataRaw);
				
				var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });

				var formEntryIds = []; // List of all actors containing role data for this medium
				var i = 0;
				for (; i < formDataRaw.length; i++) {
					if (formDataRaw[i].name == 'actorId') {
						formEntryIds.push(Number(formDataRaw[i].value));
					}
				}
				console.log("TCL: Actor Ids in form", formEntryIds);
				// create actor id list for all already existing roles
				i = 0;
				var actorList = await TIMAAT.MediaService.getActorList(medium.model.id);
        console.log("TCL: Actors of current Medium", actorList);
				var existingEntriesIdList = [];
				for (; i < actorList.length; i++) {
					existingEntriesIdList.push(actorList[i].id);
				}
				// DELETE actorwithroles data if id is in existingEntriesIdList but not in formEntryIds
				i = 0;
				for (; i < existingEntriesIdList.length; i++) {
					// console.log("TCL: check for DELETE ACTOR: ", existingEntriesIdList[i]);
					var j = 0;
					var deleteDataset = true;
					for (; j < formEntryIds.length; j ++) {
						if (existingEntriesIdList[i] == formEntryIds[j]) {
							deleteDataset = false;
							break; // no need to check further if match was found
						}
					}
					if (deleteDataset) {
						// console.log("TCL: REMOVE actor entries with Id: ", formEntryIds[j]);
						console.log("TCL: Actor removed: REMOVE medium has actor (with all roles) datasets:", medium.model.id, existingEntriesIdList[i]);
						await TIMAAT.MediaService.removeActorFromMediumHasActorWithRoles(medium.model.id, existingEntriesIdList[i]);
						existingEntriesIdList.splice(i,1);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				// console.log("TCL: DELETE actorWithRole (end)");
				// ADD actorwithroles data if id is not in existingEntriesIdList but in formEntryIds
				i = 0;
				for (; i < formEntryIds.length; i++) {
					// console.log("TCL: check for ADD ACTOR: ", formEntryIds[i]);
					var j = 0;
					var datasetExists = false;
					for (; j < existingEntriesIdList.length; j++) {
						if (formEntryIds[i] == existingEntriesIdList[j]) {
							datasetExists = true;
							break; // no need to check further if match was found
						}
					}
					if (!datasetExists) {
						// console.log("TCL: ADD actor entries with id: ", formEntryIds[i]);
						var roleSelectData = $('#actorwithroles-multi-select-dropdown-'+formEntryIds[i]).select2('data');
						console.log("TCL: roleSelectData", roleSelectData);
						var k = 0;
						for (; k < roleSelectData.length; k++) {
							console.log("TCL: New Actor: ADD medium has actor with role dataset: ", medium.model.id, formEntryIds[i], Number(roleSelectData[k].id));
							await TIMAAT.MediaService.addMediumHasActorWithRoles(medium.model.id, formEntryIds[i], Number(roleSelectData[k].id));
						}
						formEntryIds.splice(i,1);
            // console.log("TCL: formEntryIds", formEntryIds);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				// console.log("TCL: ADD new actorWithRole (end)");
				//* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
				// UPDATE actorwithroles data if id is in existingEntriesIdList and in formEntryIds
				i = 0;
				for (; i < existingEntriesIdList.length; i++) {
					// console.log("TCL: check for UPDATE ACTOR: ", existingEntriesIdList[i]);
					var existingRoles = await TIMAAT.MediaService.getActorHasRoleList(medium.model.id, existingEntriesIdList[i]);
          console.log("TCL: existingRoles", existingRoles);
					var existingRoleIds = [];
					var j = 0;
					for (; j < existingRoles.length; j++) {
						existingRoleIds.push(existingRoles[j].id);
					}
					console.log("TCL: existing role ids for the current actor", existingRoleIds);
					var roleSelectData = $('#actorwithroles-multi-select-dropdown-'+existingEntriesIdList[i]).select2('data');
					console.log("TCL: roleSelectData", roleSelectData);
					if (roleSelectData == undefined) {
						roleSelectData = [];
					}
					var roleSelectIds = [];
					j = 0;
					for (; j < roleSelectData.length; j++) {
						roleSelectIds.push(Number(roleSelectData[j].id));
					}
					console.log("TCL: form role ids for the current actor: ", roleSelectIds);
					// DELETE role entry if id is in existingRoleIds but not in roleSelectIds
					j = 0;
					for (; j < existingRoleIds.length; j++) {
						// console.log("TCL: check for DELETE ROLE: ", existingRoleIds[j]);
						var k = 0;
						var deleteDataset = true;
						for (; k < roleSelectIds.length; k++) {
							if (existingRoleIds[j] == roleSelectIds[k]) {
								deleteDataset = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteDataset) {
							// console.log("TCL: REMOVE role entry with Id: ", existingRoleIds[j]);
							console.log("TCL: role removed: REMOVE medium has actor with role dataset: ", medium.model.id, existingEntriesIdList[i], existingRoleIds[j]);
							await TIMAAT.MediaService.removeRoleFromMediumHasActorWithRoles(medium.model.id, existingEntriesIdList[i], existingRoleIds[j]);
							existingRoleIds.splice(j,1);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					// ADD role entry if id is not in existingRoleIds but in roleSelectIds
					j = 0;
					for (; j < roleSelectIds.length; j++) {
						// console.log("TCL: check for ADD ROLE: ", roleSelectIds[j]);
						var k = 0;
						var datasetExists = false;
						for (; k < existingRoleIds.length; k++) {
							if (roleSelectIds[j] == existingRoleIds[k]) {
								datasetExists = true;
								break; // no need to check further if match was found
							}
						}
						if (!datasetExists) {
							// console.log("TCL: ADD actor entries with id: ", roleSelectIds[j]);
							console.log("TCL: role added: ADD medium has actor with role dataset: ", medium.model.id, existingEntriesIdList[i], roleSelectIds[j]);
							await TIMAAT.MediaService.addMediumHasActorWithRoles(medium.model.id, existingEntriesIdList[i], roleSelectIds[j]);
							roleSelectIds.splice(j,1);
							// console.log("TCL: roleSelectIds", roleSelectIds);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					// no UPDATE as medium-actor-role table only has ids and no information stored 
				}
				medium.model = await TIMAAT.MediaService.getMedium(medium.model.id);
				// medium.updateUI();
				console.log("TCL: show medium actorwithroles form");
				TIMAAT.MediaDatasets.mediumFormActorRoles('show', medium);
			});

			// cancel add/edit button in titles form functionality
			$('#timaat-mediadatasets-medium-actorwithroles-form-dismiss').on('click', function(event) {
				TIMAAT.MediaDatasets.mediumFormActorRoles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
			});

		},

		load: function() {
			TIMAAT.MediaDatasets.loadMedia();
			TIMAAT.MediaDatasets.loadMediaTypes();
			TIMAAT.MediaDatasets.loadAllMediumSubtypes();
		},

		loadMediaTypes: function() {
			TIMAAT.MediaService.listMediaTypes(TIMAAT.MediaDatasets.setMediaTypeList);
		},
		
		loadMedia: function() {
			$('.media-datatables').hide();
			$('.media-datatable').show();
			$('.form').hide();
			$('#timaat-mediadatasets-metadata-form').data('mediumType', 'medium');
			// TIMAAT.MediaService.listMedia(TIMAAT.MediaDatasets.setMediumList);
			// TIMAAT.MediaDatasets.setMediumList();
		},

		loadMediaDataTables: async function() {
			TIMAAT.MediaDatasets.setupMediaDatatable();
			TIMAAT.MediaDatasets.setupAudioDatatable();
			TIMAAT.MediaDatasets.setupDocumentDatatable();
			TIMAAT.MediaDatasets.setupImageDatatable();
			TIMAAT.MediaDatasets.setupSoftwareDatatable();
			TIMAAT.MediaDatasets.setupTextDatatable();
			TIMAAT.MediaDatasets.setupVideoDatatable();
			TIMAAT.MediaDatasets.setupVideogameDatatable();
		},

		loadMediumSubtype: function(type) {
    	console.log("TCL: loadMediumSubtype - type", type);
			$('.media-datatables').hide();
			$('.form').hide();
			TIMAAT.MediaDatasets.clearLastMediumSelection(type);
			$('.'+type+'s-datatable').show();
			$('#timaat-mediadatasets-metadata-form').data('mediumType', type);
			switch (type) {
				case 'audio':
					// TIMAAT.MediaService.listMediumSubtype(type, TIMAAT.MediaDatasets.setAudioList);
					TIMAAT.MediaDatasets.setAudioList();
				break;
				case 'document':
					// TIMAAT.MediaService.listMediumSubtype(type, TIMAAT.MediaDatasets.setDocumentList);
					TIMAAT.MediaDatasets.setDocumentList();
				break;
				case 'image':
					// TIMAAT.MediaService.listMediumSubtype(type, TIMAAT.MediaDatasets.setImageList);
					TIMAAT.MediaDatasets.setImageList();
				break;
				case 'software':
					// TIMAAT.MediaService.listMediumSubtype(type, TIMAAT.MediaDatasets.setSoftwareList);
					TIMAAT.MediaDatasets.setSoftwareList();
				break;
				case 'text':
					// TIMAAT.MediaService.listMediumSubtype(type, TIMAAT.MediaDatasets.setTextList);
					TIMAAT.MediaDatasets.setTextList();
				break;
				case 'video':
					// TIMAAT.MediaService.listMediumSubtype(type, TIMAAT.MediaDatasets.setVideoList);
					TIMAAT.MediaDatasets.setVideoList();
				break;
				case 'videogame':
					// TIMAAT.MediaService.listMediumSubtype(type, TIMAAT.MediaDatasets.setVideogameList);
					TIMAAT.MediaDatasets.setVideogameList();
				break;
			};
		},

		loadAllMediumSubtypes: function() {
    	// console.log("TCL: loadAllMediumSubtypes()");
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

			TIMAAT.MediaDatasets.clearLastMediumSelection('medium');
			$('#timaat-mediadatasets-medium-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-medium-list').empty();
			
			// set ajax data source
			if ( TIMAAT.MediaDatasets.dataTableMedia ) {
				// TIMAAT.MediaDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
				TIMAAT.MediaDatasets.dataTableMedia.ajax.reload(null, false);
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
				TIMAAT.MediaDatasets.dataTableAudio.ajax.reload(null, false);
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
				TIMAAT.MediaDatasets.dataTableDocument.ajax.reload(null, false);
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
				TIMAAT.MediaDatasets.dataTableImage.ajax.reload(null, false);
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
				TIMAAT.MediaDatasets.dataTableSoftware.ajax.reload(null, false);
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
				TIMAAT.MediaDatasets.dataTableText.ajax.reload(null, false);
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
				TIMAAT.MediaDatasets.dataTableVideo.ajax.reload(null, false);
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
				TIMAAT.MediaDatasets.dataTableVideogame.ajax.reload(null, false);
			}
		},

		// TODO check if obsolete
		setMediumTitleList: function(medium) {
			// console.log("TCL: setMediumTitleList -> medium", medium);
			if ( !medium ) return;
			$('#timaat-mediadatasets-title-list-loader').remove();
			// clear old UI list
			$('#timaat-mediadatasets-title-list').empty();
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

			$('#medium-title-language-select-dropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/language/selectList/',
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
			$('.mediadatasheet-form-edit-button').hide();
			$('.mediadatasheet-form-edit-button').prop('disabled', true);
			$('.mediadatasheet-form-edit-button :input').prop('disabled', true);
			$('.datasheet-form-delete-button').hide();
			$('.datasheet-form-upload-button').hide();
			$('.datasheet-form-upload-button').prop('disabled', true);
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

		mediumFormDatasheet: async function(action, mediumType, mediumTypeData) {
			console.log("TCL: action, mediumType, mediumTypeData", action, mediumType, mediumTypeData);
			TIMAAT.MediaDatasets.selectLastSelection(mediumType, mediumTypeData.model.id);
			TIMAAT.MediaDatasets.selectLastSelection('medium', mediumTypeData.model.id);
			$('#timaat-mediadatasets-metadata-form').trigger('reset');
			$('#timaat-mediadatasets-metadata-form').attr('data-type', mediumType);
			$('.datasheet-data').hide();
			$('.title-data').show();
			$('.medium-data').show();
			// if (mediumType == "medium") { $('.mediumtype-data').show(); }	else { $('.mediumtype-data').hide(); }
			$('.source-data').show();
			$('.'+mediumType+'-data').show();
			mediumFormMetadataValidator.resetForm();

			// show tabs
			if ($('#previewTab').hasClass('annotationView')) {
				$('.preview-data-tab').hide();
			} else {
				$('.preview-data-tab').show();
				$('#previewTab').removeClass('annotationView');
			}
			$('.'+mediumType+'-data-tab').show();
			$('.title-data-tab').show();
			$('.languagetrack-data-tab').show();
			$('.mediumactorwithrole-data-tab').show();

			$('.nav-tabs a[href="#'+mediumType+'Datasheet"]').focus();
			$('#timaat-mediadatasets-metadata-form').show();

			$('#medium-title-language-select-dropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/language/selectList/',
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
			var languageSelect = $('#medium-title-language-select-dropdown');
			var option = new Option(mediumTypeData.model.displayTitle.language.name, mediumTypeData.model.displayTitle.language.id, true, true);
			languageSelect.append(option).trigger('change');

			if ( action == 'show') {
				$('#timaat-mediadatasets-metadata-form :input').prop('disabled', true);
				$('.mediadatasheet-form-edit-button').prop('disabled', false);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', false);
				$('.mediadatasheet-form-edit-button').show();
				if ( mediumTypeData.model.fileStatus == 'noFile' || !mediumTypeData.model.fileStatus) {
					$('.datasheet-form-upload-button').prop('disabled', false);
					$('.datasheet-form-upload-button').show();
					$('.datasheet-form-annotate-button').hide();
					$('.datasheet-form-annotate-button').prop('disabled', true);
				} else {
					$('.datasheet-form-upload-button').hide();
					$('.datasheet-form-upload-button').prop('disabled', true);
					if (mediumType == 'video') {
						$('.datasheet-form-annotate-button').prop('disabled', false);
						$('.datasheet-form-annotate-button').show();
					} else {
						$('.datasheet-form-annotate-button').hide();
					$('.datasheet-form-annotate-button').prop('disabled', true);
					}
				}
				$('.datasheet-form-delete-button').prop('disabled', false);
				$('.datasheet-form-delete-button :input').prop('disabled', false);
				$('.datasheet-form-delete-button').show();
				$('#timaat-mediadatasets-metadata-form-submit').hide();
				$('#timaat-mediadatasets-metadata-form-dismiss').hide();
				$('#mediumFormHeader').html(mediumType+" Datasheet (#"+ mediumTypeData.model.id+')');
				$('#medium-title-language-select-dropdown').select2('destroy').attr("readonly", true);
			}
			else if (action == 'edit') {
				// if (mediumType == 'medium') { $('#timaat-mediadatasets-metadata-medium-mediatype-id').prop('disabled', true);
				// }	else {	$('#timaat-mediadatasets-metadata-medium-mediatype-id').hide(); }
				$('#timaat-mediadatasets-metadata-medium-releasedate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-mediadatasets-metadata-medium-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-mediadatasets-metadata-form :input').prop('disabled', false);
				$('.mediadatasheet-form-edit-button').hide();
				$('.mediadatasheet-form-edit-button').prop('disabled', true);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', true);
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				$('.datasheet-form-annotate-button').hide();
				$('.datasheet-form-annotate-button').prop('disabled', true);
				$('.datasheet-form-delete-button').hide();
				$('.datasheet-form-delete-button').prop('disabled', true);
				$('.datasheet-form-delete-button :input').prop('disabled', true);
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
			if (data.releaseDate != null && !(isNaN(data.releaseDate)))
				$('#timaat-mediadatasets-metadata-medium-releasedate').val(moment.utc(data.releaseDate).format('YYYY-MM-DD'));
				else $('#timaat-mediadatasets-metadata-medium-releasedate').val('');
			// display-title data
			$('#timaat-mediadatasets-metadata-medium-title').val(data.displayTitle.name);
			// source data
			if (data.sources[0].isPrimarySource)
				$('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', true);
				else $('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', false);
			$('#timaat-mediadatasets-metadata-medium-source-url').val(data.sources[0].url);
			if (data.sources[0].lastAccessed != null && !(isNaN(data.sources[0].lastAccessed)))
				$('#timaat-mediadatasets-metadata-medium-source-lastaccessed').val(moment.utc(data.sources[0].lastAccessed).format('YYYY-MM-DD HH:mm'));
				else $('#timaat-mediadatasets-metadata-medium-source-lastaccessed').val('');
			if (data.sources[0].isStillAvailable)
				$('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', true);
				else $('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', false);
				
			// medium subtype specific data
			switch (mediumType) {
				case 'audio':
					$('#timaat-mediadatasets-metadata-audio-length').val(data.mediumAudio.length);
				break;
				case "mediumDocument":
				break;
				case 'image':
					$('#timaat-mediadatasets-metadata-image-width').val(data.mediumImage.width);
					$('#timaat-mediadatasets-metadata-image-height').val(data.mediumImage.height);
					$('#timaat-mediadatasets-metadata-image-bitdepth').val(data.mediumImage.bitDepth);
				break;
				case 'software':
					$('#timaat-mediadatasets-metadata-software-version').val(data.mediumSoftware.version);
				break;
				case 'text':
					$('#timaat-mediadatasets-metadata-text-content').val(data.mediumText.content);
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
						$('#timaat-mediadatasets-metadata-videogame-isepisode').prop('checked', true);
					else $('#timaat-mediadatasets-metadata-videogame-isepisode').prop('checked', false);
				break;
			}
			$('#timaat-mediadatasets-metadata-form').data(mediumType, mediumTypeData);
		},

		mediumFormPreview: function(mediumType, mediumTypeData) {
			console.log("TCL: mediumType, mediumTypeData", mediumType, mediumTypeData);
			TIMAAT.MediaDatasets.selectLastSelection(mediumType, mediumTypeData.model.id);
			TIMAAT.MediaDatasets.selectLastSelection('medium', mediumTypeData.model.id);
			$('#timaat-mediadatasets-medium-preview-form').trigger('reset');
			// $('#timaat-mediadatasets-metadata-form').attr('data-type', mediumType);
			// mediumFormMetadataValidator.resetForm();

			$('.nav-tabs a[href="#mediumPreview"]').focus();
			$('#timaat-mediadatasets-medium-preview-form').show();

			$('#timaat-mediadatasets-medium-preview-form :input').prop('disabled', true);
			// $('#timaat-mediadatasets-medium-preview-form-edit').prop('disabled', false);
			// $('#timaat-mediadatasets-medium-preview-form-edit :input').prop('disabled', false);
			// $('#timaat-mediadatasets-medium-preview-form-edit').show();
			if ( mediumTypeData.model.fileStatus == 'noFile' || !mediumTypeData.model.fileStatus) {
				$('.datasheet-form-upload-button').prop('disabled', false);
				$('.datasheet-form-upload-button').show();
				$('.datasheet-form-annotate-button').hide();
				$('.datasheet-form-annotate-button').prop('disabled', true);
				$('.video-preview').hide();
				$('.image-preview').show();
				switch (mediumType) {
					case 'image':
						$('#mediumPreview').attr('src' , 'img/image-placeholder.png');
					break;
					default:
						$('#mediumPreview').attr('src' , 'img/preview-placeholder.png');
					break;
				}
			} else {
				// console.log("TCL: display image preview");
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				if (mediumType == 'video') {
					$('.datasheet-form-annotate-button').prop('disabled', false);
					$('.datasheet-form-annotate-button').show();
				} else {
					$('.datasheet-form-annotate-button').hide();
				$('.datasheet-form-annotate-button').prop('disabled', true);
				}
				switch (mediumType) {
					case 'image':
						$('.video-preview').hide();
						$('#mediumPreview').attr('src', '/TIMAAT/api/medium/image/'+mediumTypeData.model.id+'/preview'+'?token='+mediumTypeData.model.viewToken);
						$('#mediumPreview').attr('title', mediumTypeData.model.displayTitle.name);
						$('#mediumPreview').attr('alt', mediumTypeData.model.displayTitle.name);
						$('.image-preview').show();
					break;
					case 'video':
						if ( mediumTypeData.model.fileStatus && mediumTypeData.model.fileStatus != 'ready' && mediumTypeData.model.fileStatus != 'transcoding' && mediumTypeData.model.fileStatus != 'waiting' ) {
							$('.video-preview').hide();
							$('#mediumPreview').attr('src', 'img/preview-placeholder.png');
							$('.image-preview').show();
						} else {
							$('.image-preview').hide();
							// $('#videoSource').attr('src', '/TIMAAT/api/medium/video/'+mediumTypeData.model.id+'/download'+'?token='+mediumTypeData.model.viewToken);
							$('#videoPreview').attr('src', '/TIMAAT/api/medium/video/'+mediumTypeData.model.id+'/download'+'?token='+mediumTypeData.model.viewToken);
							$('.video-preview').show();
						}
					default:
						$('#mediumPreview').attr('src', 'img/preview-placeholder.png');
					break;
				}
			}
			$('.datasheet-form-delete-button').prop('disabled', false);
			$('.datasheet-form-delete-button :input').prop('disabled', false);
			$('.datasheet-form-delete-button').show();
			// $('#timaat-mediadatasets-medium-preview-form-submit').hide();
			// $('#timaat-mediadatasets-medium-preview-form-dismiss').hide();
			$('#mediumPreviewFormHeader').html(mediumType+" Preview (#"+ mediumTypeData.model.id+')');
		},

		mediumFormTitles: function(action, medium) {
			console.log("TCL: mediumFormTitles: action, medium", action, medium);
			TIMAAT.MediaDatasets.selectLastSelection(medium.model.mediaType.mediaTypeTranslations[0].type, medium.model.id);
			TIMAAT.MediaDatasets.selectLastSelection('medium', medium.model.id);
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
									<input class="form-check-input isDisplayTitle"
												 type="radio"
												 name="isDisplayTitle"
												 data-role="displayTitle[`+medium.model.titles[i].id+`]"
												 placeholder="Is Display Title">
								</div>
							</div>
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isOriginalTitle"></label>
									<input class="form-check-input isOriginalTitle" 
												 type="radio"
												 name="isOriginalTitle"
												 data-role="originalTitle[`+medium.model.titles[i].id+`]"
												 data-waschecked="true"
												 placeholder="Is Original Title">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name"
											 name="title[`+i+`]" data-role="title[`+medium.model.titles[i].id+`]"
											 placeholder="[Enter title]"
											 aria-describedby="Title"
											 minlength="3"
											 maxlength="200"
											 rows="1"
											 required>
							</div>
							<div class="col-sm-2 col-md-2">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id" 
												id="title-language-select-dropdown_`+medium.model.titles[i].id+`"
												name="titleLanguageId[`+i+`]" 
												data-role="titleLanguageId[`+medium.model.titles[i].id+`]" 
												data-placeholder="Select title language"
												required>
								</select>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="btn btn-danger" 
												data-role="remove">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
					);
					$('#title-language-select-dropdown_'+medium.model.titles[i].id).select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/language/selectList/',
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
					var languageSelect = $('#title-language-select-dropdown_'+medium.model.titles[i].id);
					var option = new Option(medium.model.titles[i].language.name, medium.model.titles[i].language.id, true, true);
					languageSelect.append(option).trigger('change');

					if (medium.model.titles[i].id == medium.model.displayTitle.id) {
						$('[data-role="displayTitle['+medium.model.titles[i].id+']"').prop('checked', true);							
					}
					if (medium.model.originalTitle && medium.model.titles[i].id == medium.model.originalTitle.id) {
						$('[data-role="originalTitle['+medium.model.titles[i].id+']"').prop('checked', true);							
					}
					$('input[name="title['+i+']"').rules("add", { required: true, minlength: 3, maxlength: 200, });
					$('input[data-role="title['+medium.model.titles[i].id+']"').attr("value", TIMAAT.MediaDatasets.replaceSpecialCharacters(medium.model.titles[i].name));
			};

			if ( action == 'show') {
				$('#timaat-mediadatasets-medium-titles-form :input').prop('disabled', true);
				$('.mediadatasheet-form-edit-button').prop('disabled', false);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', false);
				$('.mediadatasheet-form-edit-button').show();
				if ( medium.model.fileStatus == 'noFile' || !medium.model.fileStatus) {
					$('.datasheet-form-upload-button').prop('disabled', false);
					$('.datasheet-form-upload-button').show();
					$('.datasheet-form-annotate-button').hide();
					$('.datasheet-form-annotate-button').prop('disabled', true);
				} else {
					$('.datasheet-form-upload-button').hide();
					$('.datasheet-form-upload-button').prop('disabled', true);
					if (medium.model.mediaType.mediaTypeTranslations[0].type == 'video') {
						$('.datasheet-form-annotate-button').prop('disabled', false);
						$('.datasheet-form-annotate-button').show();
					} else {
						$('.datasheet-form-annotate-button').hide();
						$('.datasheet-form-annotate-button').prop('disabled', true);
					}
				}
				$('#timaat-mediadatasets-medium-titles-form-submit').hide();
				$('#timaat-mediadatasets-medium-titles-form-dismiss').hide();
				$('[data-role="new-title-fields"').hide();
				$('.title-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumTitlesLabel').html("Medium titles");
				let i = 0;
				for (; i < numTitles; i++) {
					$('#title-language-select-dropdown_'+medium.model.titles[i].id).select2('destroy').attr("readonly", true);
				}
			}
			else if (action == 'edit') {
				$('#timaat-mediadatasets-medium-titles-form :input').prop('disabled', false);
				$('.mediadatasheet-form-edit-button').hide();
				$('.mediadatasheet-form-edit-button').prop('disabled', true);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', true);
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				$('.datasheet-form-annotate-button').hide();
				$('.datasheet-form-annotate-button').prop('disabled', true);
				$('#timaat-mediadatasets-medium-titles-form-submit').html("Save");
				$('#timaat-mediadatasets-medium-titles-form-submit').show();
				$('#timaat-mediadatasets-medium-titles-form-dismiss').show();
				$('#mediumTitlesLabel').html("Edit medium titles");
				$('[data-role="new-title-fields"').show();
				$('.title-form-divider').show();				
				$('#timaat-mediadatasets-metadata-medium-title').focus();

				// fields for new title entry
				$('[data-role="new-title-fields"]').append(TIMAAT.MediaDatasets.titleFormTitleToAppend());
				$('#title-language-select-dropdown').select2({
					closeOnSelect: true,
					scrollAfterSelect: true,
					allowClear: true,
					ajax: {
						url: 'api/language/selectList/',
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
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id"
												name="languageTrackTypeId[`+i+`]"
												data-role="languageTrackTypeId[`+medium.model.mediumHasLanguages[i].mediumLanguageType.id+`]"
												required>
									<!-- <option value="" disabled selected hidden>[Choose Track type...]</option> -->
									<option value="1">Audio Track</option>
									<option value="2">Subtitle Track</option>
								</select>
							</div>
							<div class="col-md-5">
								<label class="sr-only">Track Language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id"
												id="languagetrack-language-select-dropdown_`+i+`"
												name="languageTrackLanguageId[`+i+`]"
												data-role="languageTrackLanguageId[`+medium.model.mediumHasLanguages[i].language.id+`]"
												required>
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
					$('#languagetrack-language-select-dropdown_'+i).select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/language/selectList/',
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
					var languageSelect = $('#languagetrack-language-select-dropdown_'+i);
					var option = new Option(medium.model.mediumHasLanguages[i].language.name, medium.model.mediumHasLanguages[i].language.id, true, true);
					languageSelect.append(option).trigger('change');
					$('[data-role="languageTrackTypeId['+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']"')
						.find('option[value='+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']')
						.attr('selected', true);
					$('select[name="languageTrackTypeId['+i+']"').rules("add", { required: true, });
					$('#languagetrack-language-select-dropdown_'+i).select2('destroy').attr("readonly", true);
			};

			if ( action == 'show') {
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop('disabled', true);
				$('.mediadatasheet-form-edit-button').prop('disabled', false);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', false);
				$('.mediadatasheet-form-edit-button').show();
				if ( medium.model.fileStatus == 'noFile' || !medium.model.fileStatus) {
					$('.datasheet-form-upload-button').prop('disabled', false);
					$('.datasheet-form-upload-button').show();
					$('.datasheet-form-annotate-button').hide();
					$('.datasheet-form-annotate-button').prop('disabled', true);
				} else {
					$('.datasheet-form-upload-button').hide();
					$('.datasheet-form-upload-button').prop('disabled', true);
					if (medium.model.mediaType.mediaTypeTranslations[0].type == 'video') {
						$('.datasheet-form-annotate-button').prop('disabled', false);
						$('.datasheet-form-annotate-button').show();
					} else {
						$('.datasheet-form-annotate-button').hide();
					$('.datasheet-form-annotate-button').prop('disabled', true);
					}
				}
				$('#timaat-mediadatasets-medium-languagetracks-form-done').hide();
				$('[data-role="new-languagetrack-fields"').hide();
				$('.languagetrack-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumLanguageTracksLabel').html("Medium track list");
			}
			else if (action == 'edit') {
				$('.timaat-mediadatasets-medium-languagetracks-languagetrack-type-id').prop('disabled', true);
				$('#timaat-mediadatasets-medium-languagetracks-form :input').prop('disabled', false);
				$('.mediadatasheet-form-edit-button').hide();
				$('.mediadatasheet-form-edit-button').prop('disabled', true);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', true);
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				$('.datasheet-form-annotate-button').hide();
				$('.datasheet-form-annotate-button').prop('disabled', true);
				$('#timaat-mediadatasets-medium-languagetracks-form-done').html("Done");
				$('#timaat-mediadatasets-medium-languagetracks-form-done').show();
				$('[data-role="new-languagetrack-fields"').show();
				$('.languagetrack-form-divider').show();
				$('#mediumLanguageTracksLabel').html("Edit medium track list");

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
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-type-id"
												name="languageTrackTypeId"
												data-role="languageTrackTypeId"
												required>
									<option value="" disabled selected hidden>[Choose Track type...]</option>
									<option value="1">Audio Track</option>
									<option value="2">Subtitle Track</option>
								</select>
							</div>
							<div class="col-md-5">
								<label class="sr-only">Track language</label>
								<select class="form-control form-control-sm timaat-mediadatasets-medium-languagetracks-languagetrack-language-id"
												id="languagetrack-language-select-dropdown"
												name="languageTrackLanguageId"
												data-role="languageTrackLanguageId"
												data-placeholder="Select language"
												required>
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
				$('#languagetrack-language-select-dropdown').select2({
					closeOnSelect: true,
					scrollAfterSelect: true,
					allowClear: true,
					ajax: {
						url: 'api/language/selectList/',
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

				$('#timaat-mediadatasets-medium-languagetracks-form').data('medium', medium);
			}
		},

		mediumFormActorRoles: async function(action, medium) {
			// console.log("TCL: mediumFormTitles: action, medium", action, medium);
			var node = document.getElementById("dynamic-actorwithrole-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			var node = document.getElementById("new-actorwithrole-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			};
			$('#timaat-mediadatasets-medium-actorwithroles-form').trigger('reset');
			// mediumFormActorRolesValidator.resetForm();
			$('.nav-tabs a[href="#mediumActorRoles"]').focus();
			$('#timaat-mediadatasets-medium-actorwithroles-form').show();

			// setup UI
			// actor roles data
			var actorIdList = [];
			var i = 0;
			for (; i < medium.model.mediumHasActorWithRoles.length; i++) {
				if (actorIdList[actorIdList.length-1] != medium.model.mediumHasActorWithRoles[i].actor.id) {
					actorIdList.push(medium.model.mediumHasActorWithRoles[i].actor.id);
				}
			}
			console.log("TCL: actorIdList", actorIdList);

			// set up form content structure
			i = 0;
			for (; i < actorIdList.length; i++) {
				$('[data-role="dynamic-actorwithrole-fields"]').append(TIMAAT.MediaDatasets.appendActorWithRolesDataset(i, actorIdList[i]));

				// provide list of actors that already have a medium_has_actor_with_role entry, filter by role_group
				$('#mediumhasactorwithrole-actorid-'+actorIdList[i]).select2({
					closeOnSelect: true,
					scrollAfterSelect: true,
					allowClear: false,
					ajax: {
						url: 'api/actor/'+actorIdList[i]+'/select',
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
								// search: params.term,
								// page: params.page
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
				// select actor for each entry
				// await TIMAAT.MediaService.getActorList(medium.model.id).then(function (data) {
				await TIMAAT.ActorService.getActor(actorIdList[i]).then(function (data) {
					var actorSelect = $('#mediumhasactorwithrole-actorid-'+actorIdList[i]);
					// console.log("TCL: actorSelect", actorSelect);
					console.log("TCL: then: data", data);
					var option = new Option(data.displayName.name, data.id, true, true);
					actorSelect.append(option).trigger('change');
					// manually trigger the 'select2:select' event
					actorSelect.trigger({
						type: 'select2:select',
						params: {
							data: data
						}
					});
				});

				// url for role fetch needs to chance on actor change
				// provide roles list for new selected actor
				$('#actorwithroles-multi-select-dropdown-'+actorIdList[i]).select2({
					closeOnSelect: false,
					scrollAfterSelect: true,
					allowClear: true,
					ajax: {
						url: 'api/medium/hasActor/'+actorIdList[i]+'/withRoles/selectList',
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

				var roleSelect = $('#actorwithroles-multi-select-dropdown-'+actorIdList[i]);
				// console.log("TCL: roleSelect", roleSelect);
				await TIMAAT.MediaService.getActorHasRoleList(medium.model.id, actorIdList[i]).then(function (data) {
					console.log("TCL: then: data", data);
					if (data.length > 0) {
						// create the options and append to Select2
						var j = 0;
						for (; j < data.length; j++) {
							var option = new Option(data[j].roleTranslations[0].name, data[j].id, true, true);
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
			}

			if ( action == 'show') {
				$('#timaat-mediadatasets-medium-actorwithroles-form :input').prop('disabled', true);
				$('.mediadatasheet-form-edit-button').prop('disabled', false);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', false);
				$('.mediadatasheet-form-edit-button').show();
				if ( medium.model.fileStatus == 'noFile' || !medium.model.fileStatus) {
					$('.datasheet-form-upload-button').prop('disabled', false);
					$('.datasheet-form-upload-button').show();
					$('.datasheet-form-annotate-button').hide();
					$('.datasheet-form-annotate-button').prop('disabled', true);
				} else {
					$('.datasheet-form-upload-button').hide();
					$('.datasheet-form-upload-button').prop('disabled', true);
					if (medium.model.mediaType.mediaTypeTranslations[0].type == 'video') {
						$('.datasheet-form-annotate-button').prop('disabled', false);
						$('.datasheet-form-annotate-button').show();
					} else {
						$('.datasheet-form-annotate-button').hide();
					$('.datasheet-form-annotate-button').prop('disabled', true);
					}
				}
				$('#timaat-mediadatasets-medium-actorwithroles-form-submit').hide();
				$('#timaat-mediadatasets-medium-actorwithroles-form-dismiss').hide();
				$('[data-role="new-actorwithrole-fields"]').hide();
				$('.actorwithrole-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumActorRolesLabel').html("Medium actor roles");
			}
			else if (action == 'edit') {
				$('#timaat-mediadatasets-medium-actorwithroles-form :input').prop('disabled', false);
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', true);
				$('.mediadatasheet-form-edit-button').hide();
				$('.mediadatasheet-form-edit-button').prop('disabled', true);
				$('.mediadatasheet-form-edit-button :input').prop('disabled', true);
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				$('.datasheet-form-annotate-button').hide();
				$('.datasheet-form-annotate-button').prop('disabled', true);
				$('#timaat-mediadatasets-medium-actorwithroles-form-submit').html("Save");
				$('#timaat-mediadatasets-medium-actorwithroles-form-submit').show();
				$('#timaat-mediadatasets-medium-actorwithroles-form-dismiss').show();
				$('#mediumActorRolesLabel').html("Edit medium actor roles");
				$('[data-role="new-actorwithrole-fields"]').show();
				$('.actorwithrole-form-divider').show();				
				// $('#timaat-mediadatasets-metadata-medium-actorwithrole').focus();

				// fields for new title entry
				$('[data-role="new-actorwithrole-fields"]').append(
					`<div class="form-group" data-role="mediumhasactorwithrole-entry" data-id="-1">
						<div class="form-row">
							<div class="col-md-11">
								<fieldset>
									<legend>Add new Actor with role(s):</legend>
									<div class="form-row">
										<div class="col-md-4">
											<label class="sr-only">Actor</label>
											<select class="form-control form-control-sm mediumhasactorwithrole-actorid"
															id="mediumhasactorwithrole-actorid"
															name="actorId" 
															data-placeholder="Select actor"
															data-role="actorId"
															required>
											</select>
										</div>
										<div class="col-md-8">
											<label class="sr-only">Has Role(s)</label>
											<select class="form-control form-control-sm"
															id="actorwithroles-multi-select-dropdown"
															name="roleId"
															data-placeholder="Select role(s)"
															multiple="multiple"
															readonly="true"
															required>
											</select>
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
					</div>`
				);

				// provide list of actors that already have a medium_has_actor_with_role entry, filter by role_group
				$('#mediumhasactorwithrole-actorid').select2({
					closeOnSelect: true,
					scrollAfterSelect: true,
					allowClear: true,
					ajax: {
						url: 'api/actor/selectList/', // TODO limit list to actors that already have roles associations
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

				// url for role fetch needs to chance on actor change
				$('#mediumhasactorwithrole-actorid').on('change', function (event) {
					console.log("TCL: actor selection changed");
					console.log("TCL: selected Actor Id", $(this).val());
					if (!($(this).val() == null)) {
						$('#actorwithroles-multi-select-dropdown').val(null).trigger('change');
						// provide roles list for new selected actor
						$('#actorwithroles-multi-select-dropdown').select2({
							closeOnSelect: false,
							scrollAfterSelect: true,
							allowClear: true,
							ajax: {
								url: 'api/medium/hasActor/'+$(this).val()+'/withRoles/selectList',
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
					}
				});
				
				$('#timaat-mediadatasets-medium-actorwithroles-form').data('medium', medium);
			}
		},

		showLastForm: function() {
			switch (TIMAAT.MediaDatasets.lastForm) {
				case 'datasheet':
					var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
					TIMAAT.MediaDatasets.mediumFormDatasheet('show', medium.model.mediaType.mediaTypeTranslations[0].type, $('#timaat-mediadatasets-metadata-form').data('medium'));
				break;
				case 'preview':
					var medium = $('#timaat-mediadatasets-metadata-form').data('medium');
					TIMAAT.MediaDatasets.mediumFormPreview(medium.model.mediaType.mediaTypeTranslations[0].type, $('#timaat-mediadatasets-metadata-form').data('medium'));
				break;
				case 'titles':
					TIMAAT.MediaDatasets.mediumFormTitles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
				break;
				case 'languagetracks':
					TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
				break;
				case 'actorroles':
					TIMAAT.MediaDatasets.mediumFormActorRoles('show', $('#timaat-mediadatasets-metadata-form').data('medium'));
				break;
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
				tempMediumModel.originalTitle = newDisplayTitle;
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

		displayFileStatus: function(medium) {
    	// console.log("TCL: displayFileStatus: medium.id, medium.fileStatus", medium.id, medium.fileStatus);
			if ( !medium || !medium.ui ) return;
			// clear ui status
			medium.ui.find('.timaat-medium-status').hide();
			medium.ui.find('.timaat-medium-status i').removeClass('fa-cog');
			medium.ui.find('.timaat-medium-status i').removeClass('fa-hourglass-half');
			medium.ui.find('.timaat-medium-status i').addClass('fa-cog');
			medium.ui.find('.timaat-medium-transcoding').hide();
			
			if (medium.fileStatus == 'unavailable' || medium.fileStatus == 'ready') 
				window.clearInterval(medium.poll);

			if ( medium.fileStatus == 'unavailable' ) {
				medium.ui.find('.timaat-medium-transcoding').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
				medium.ui.find('.timaat-medium-transcoding').show();
			}

			if ( medium.fileStatus != 'ready'  &&  medium.fileStatus != 'noFile' ) medium.ui.find('.timaat-medium-status').show();
			if ( medium.fileStatus == 'waiting' ) medium.ui.find('.timaat-medium-status i').removeClass('fa-cog').addClass('fa-hourglass-half');
			if ( medium.fileStatus == 'noFile'  ) {
				medium.ui.find('.timaat-medium-upload').css('display', 'block');
				medium.ui.find('.timaat-video-annotate').hide();
				
				// upload button click triggers file selection
				medium.ui.find('.timaat-medium-upload').off('click').on('click', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					medium.ui.find('.timaat-medium-upload-file').click();
				});

				// user selected file, trigger form submit / upload
				medium.ui.find('.timaat-medium-upload-file').off('change').on('change', function(ev) {
					let filelist = medium.ui.find('.timaat-medium-upload-file')[0].files;
					if ( filelist.length  > 0 ) TIMAAT.UploadManager.queueUpload(medium, medium.ui.find('form'));
				});
			}
			if ( TIMAAT.UploadManager.isUploading(medium) ) medium.ui.find('.timaat-medium-upload').css('display', 'none');
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
			
			// medium.updateUI();
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
					await TIMAAT.MediaCollectionService.removeCollectionItem(TIMAAT.VideoChooser.collections[i], medium.model);
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
			medium.model.releaseDate = formDataObject.releaseDate;
			medium.model.copyright = formDataObject.copyright;
			medium.model.remark = formDataObject.remark;
			// display-title data
			medium.model.displayTitle.name = formDataObject.displayTitle;
			medium.model.displayTitle.language.id = formDataObject.displayTitleLanguageId;
			var i = 0;
			for (; i < medium.model.titles.length; i++) {
				if (medium.model.displayTitle.id == medium.model.titles[i].id) {
					medium.model.titles[i] = medium.model.displayTitle;
					break;
				}
			}
			// source data
			medium.model.sources[0].url = formDataObject.sourceUrl;
			medium.model.sources[0].isPrimarySource = formDataObject.sourceIsPrimarySource;
			medium.model.sources[0].lastAccessed = formDataObject.sourceLastAccessed;
			medium.model.sources[0].isStillAvailable = formDataObject.sourceIsStillAvailable;

			return medium;
		},

		createMediumModel: async function(formDataObject, type) {
    	// console.log("TCL: formDataObject, type", formDataObject, type);
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
				releaseDate: formDataObject.releaseDate,
				mediaType: {
					id: typeId,
				},
				titles: [{
					id: 0,
					language: {
						id: formDataObject.displayTitleLanguageId,
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
						length: formDataObject.length,
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
						length: formDataObject.length,
						videoCodec: formDataObject.videoCodec,
						width: formDataObject.width,
						height: formDataObject.height,
						frameRate: formDataObject.frameRate,
						dataRate: formDataObject.dataRate,
						totalBitrate: formDataObject.totalBitrate,
						isEpisode: formDataObject.isEpisode,
					};
				break;
				case 'videogame':
					mediumSubtypeModel = {
						mediumId: 0,
						isEpisode: formDataObject.isEpisode,
					};
				break;
			}
			return mediumSubtypeModel;
		},

		createDisplayTitleModel: async function(formDataObject) {
			var displayTitle = {
				id: 0,
				language: {
					id: formDataObject.displayTitleLanguageId,
				},
				name: formDataObject.displayTitle,
			};
			return displayTitle;
		},

		createSourceModel: async function(formDataObject) {
    	// console.log("TCL: formDataObject", formDataObject);
			var source = {
				id: 0,
				medium: {
					id: 0,
				},
				isPrimarySource: formDataObject.sourceIsPrimarySource,            
				url: formDataObject.sourceUrl,
				lastAccessed: formDataObject.sourceLastAccessed,
				isStillAvailable: formDataObject.sourceIsStillAvailable,
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
						<input class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-name" 
									 name="title"
									 data-role="title"
									 placeholder="[Enter title]"
									 aria-describedby="Title"
									 minlength="3"
									 maxlength="200"
									 rows="1"
									 required>
					</div>
					<div class="col-md-3">
						<label class="sr-only">Title's Language</label>
						<select class="form-control form-control-sm timaat-mediadatasets-medium-titles-title-language-id"
										id="title-language-select-dropdown"
										name="titleLanguageId"
										data-role="titleLanguageId"
										data-placeholder="Select title language"
										required>
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

		appendActorWithRolesDataset: function(i, actorId) {
    	console.log("TCL: i, actorId", i, actorId);
			var entryToAppend = 
				`<div class="form-group" data-role="mediumhasactorwithrole-entry" data-id="`+i+`" data-actor-id=`+actorId+`>
					<div class="form-row">
						<div class="col-md-11">
							<div class="form-row">
								<div class="col-md-4">
									<label class="sr-only">Actor</label>
									<select class="form-control form-control-sm mediumhasactorwithrole-actorid"
													id="mediumhasactorwithrole-actorid-`+actorId+`"
													name="actorId" 
													data-placeholder="Select actor"
													data-role="actorId-`+actorId+`" 
													required>
									</select>
								</div>
								<div class="col-md-8">
									<label class="sr-only">Has Role(s)</label>
									<select class="form-control form-control-sm"
													id="actorwithroles-multi-select-dropdown-`+actorId+`"
													name="roleId"
													data-placeholder="Select role(s)"
													data-role="actorRoles-`+actorId+`"
													multiple="multiple"
													required>
									</select>
								</div>
							</div>
						</div>
						<div class="col-md-1 text-center">
							<button class="btn btn-danger" data-role="remove">
								<i class="fas fa-trash-alt"></i>
							</button>
						</div>
					</div>
				</div>`;
			return entryToAppend;
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
          	// console.log("TCL: data", data);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'medium'));
							}
						});
						TIMAAT.MediaDatasets.media = meds;
						TIMAAT.MediaDatasets.media.model = data.data;
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('medium');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: Media dataTable -  createdRow");
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);
					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('medium');
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.media.length; i++) {
							if (TIMAAT.MediaDatasets.media[i].model.id == medium.id) {
								selectedMedium = TIMAAT.MediaDatasets.media[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('medium', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						var type = selectedMedium.model.mediaType.mediaTypeTranslations[0].type;
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#'+type+'Datasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', type, selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.'+type+'-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, medium.mediaType.mediaTypeTranslations[0].type);
				},
				"columns": [
					{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta)
						{
							// console.log("TCL: data", data); // == mediumId
							// console.log("TCL: medium", medium);
							// console.log("TCL: medium.fileStatus", medium.fileStatus);
							let displayMediumTypeIcon = '';
							switch (medium.mediaType.mediaTypeTranslations[0].type) {
								case 'audio':
									displayMediumTypeIcon = '  <i class="far fa-file-audio" title="Audio"></i> ';
								break;
								case 'document':
									displayMediumTypeIcon = '  <i class="far fa-file-pdf" title="Document"></i> ';
								break;
								case 'image':
									displayMediumTypeIcon = '  <i class="far fa-file-image" title="Image"></i> ';
								break;
								case 'software':
									displayMediumTypeIcon = '  <i class="fas fa-compact-disc" title="Software"></i> ';
								break;
								case 'text':
									displayMediumTypeIcon = '  <i class="far fa-file-alt" title="Text"></i> ';
								break;
								case 'video':
									displayMediumTypeIcon = '  <i class="far fa-file-video" title="Video"></i> ';
								break;
								case 'videogame':
									displayMediumTypeIcon = '  <i class="fas fa-gamepad" title="Videogame"></i> ';
								break;
							}
							let noFileIcon = ' ';
							if (medium.fileStatus == 'noFile') {
								noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
							}
							let commentIcon = ' ';
							if (medium.remark.length > 0) {
								commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
							}
							let titleDisplay = `<p>` + displayMediumTypeIcon + noFileIcon + commentIcon + medium.displayTitle.name + `</p>`;
							if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
							}
							medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
								if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
									titleDisplay += `<div style="display:none">`+title.name+`</div>`;
								}
							});
							// console.log("TCL: medium", medium);
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
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('audio');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('audio');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.audios.length; i++) {
							if (TIMAAT.MediaDatasets.audios[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.audios[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('audio', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#audioDatasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'audio', selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.audio-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, 'audio');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) 
					{
						// console.log("TCL: medium.fileStatus", medium.fileStatus);
						let noFileIcon = '';
						if (medium.fileStatus == 'noFile') {
							noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
						}
						let commentIcon = ' ';
						if (medium.remark.length > 0) {
							commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
						}
						let titleDisplay = `<p>` + noFileIcon + commentIcon + medium.displayTitle.name +`</p>`;		
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
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('document');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('document');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.documents.length; i++) {
							if (TIMAAT.MediaDatasets.documents[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.documents[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('document', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#documentDatasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'document', selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.document-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, 'document');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let noFileIcon = '';
					if (medium.fileStatus == 'noFile') {
						noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
					}
					let commentIcon = ' ';
					if (medium.remark.length > 0) {
						commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
					}
					let titleDisplay = `<p>` + noFileIcon + commentIcon + medium.displayTitle.name +`</p>`;
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
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('image');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('image');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.images.length; i++) {
							if (TIMAAT.MediaDatasets.images[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.images[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('image', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#imageDatasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'image', selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.image-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, 'image');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let noFileIcon = '';
					if (medium.fileStatus == 'noFile') {
						noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
					}
					let commentIcon = ' ';
					if (medium.remark.length > 0) {
						commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
					}
					let titleDisplay = `<p>` + noFileIcon + commentIcon + medium.displayTitle.name +`</p>`;
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
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('software');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('software');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.softwares.length; i++) {
							if (TIMAAT.MediaDatasets.softwares[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.softwares[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('software', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#softwareDatasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'software', selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.software-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, 'software');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let noFileIcon = '';
					if (medium.fileStatus == 'noFile') {
						noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
					}
					let commentIcon = ' ';
					if (medium.remark.length > 0) {
						commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
					}
					let titleDisplay = `<p>` + noFileIcon + commentIcon + medium.displayTitle.name +`</p>`;
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
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('text');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('text');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.texts.length; i++) {
							if (TIMAAT.MediaDatasets.texts[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.texts[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('text', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#textDatasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'text', selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.text-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, 'text');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let noFileIcon = '';
					if (medium.fileStatus == 'noFile') {
						noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
					}
					let commentIcon = ' ';
					if (medium.remark.length > 0) {
						commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
					}
					let titleDisplay = `<p>` + noFileIcon + commentIcon + medium.displayTitle.name +`</p>`;
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
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'video'));
							}
						});
						TIMAAT.MediaDatasets.videos = meds;
						TIMAAT.MediaDatasets.videos.model = data.data;
						return data.data;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('video');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('video');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.videos.length; i++) {
							if (TIMAAT.MediaDatasets.videos[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.videos[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('video', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#videoDatasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'video', selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.video-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" ) {
					// 	console.log("TCL: medium.fileStatus", medium.fileStatus);
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, 'video');
					// }
          // console.log("TCL: medium.fileStatus", medium.fileStatus);
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let noFileIcon = '';
					if (medium.fileStatus == 'noFile') {
						noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
					}
					let commentIcon = ' ';
					if (medium.remark.length > 0) {
						commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
					}
					let titleDisplay = `<p>` + noFileIcon + commentIcon + medium.displayTitle.name +`</p>`;
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
				"rowCallback": function( row, data ) {
					console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaDatasets.selectedMediumId) {
						TIMAAT.MediaDatasets.clearLastMediumSelection('videogame');
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					// TIMAAT.MediaDatasets.displayFileStatus(medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaDatasets.clearLastMediumSelection('videogame');
						var id = medium.id;
						var selectedMedium;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.videogames.length; i++) {
							if (TIMAAT.MediaDatasets.videogames[i].model.id == id) {
								selectedMedium = TIMAAT.MediaDatasets.videogames[i];
								break;
							}
						}
						TIMAAT.MediaDatasets.selectLastSelection('videogame', medium.id);

						$('#timaat-mediadatasets-metadata-form').data('medium', selectedMedium);
						if (TIMAAT.MediaDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#videogameDatasheet"]').tab('show');
							TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'videogame', selectedMedium);
						} else {
							// show tabs
							$('.preview-data-tab').show();
							$('.videogame-data-tab').show();
							$('.title-data-tab').show();
							$('.languagetrack-data-tab').show();
							$('.mediumactorwithrole-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.MediaDatasets.subNavTab+'"]').tab('show');
							TIMAAT.MediaDatasets.showLastForm();
						}
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, 'videogame');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
					// console.log("TCL: medium", medium);
					let noFileIcon = '';
					if (medium.fileStatus == 'noFile') {
						noFileIcon = '<i class="fas fa-file-upload" title="No file uploaded"></i> ';
					}
					let commentIcon = ' ';
					if (medium.remark.length > 0) {
						commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
					}
					let titleDisplay = `<p>` + noFileIcon + commentIcon + medium.displayTitle.name +`</p>`;
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

		selectLastSelection: function(type, id) {
			// console.log("TCL: selectLastSelection: type, id", type, id);
			// console.log("TCL: TIMAAT.MediaDatasets.selectedMediumId", TIMAAT.MediaDatasets.selectedMediumId);
			var table;
			switch(type) {
				case 'medium':
					if (TIMAAT.MediaDatasets.selectedMediumId && TIMAAT.MediaDatasets.selectedMediumId != id) {
						$(TIMAAT.MediaDatasets.dataTableMedia.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
					}
					$(TIMAAT.MediaDatasets.dataTableMedia.row('#'+id).node()).addClass('selected');
					table = TIMAAT.VideoChooser.dt;
				break;
				case 'audio':
					table = TIMAAT.MediaDatasets.dataTableAudio;
				break;
				case 'document':
					table = TIMAAT.MediaDatasets.dataTableDocument;
				break;
				case 'image':
					table = TIMAAT.MediaDatasets.dataTableImage;
				break;
				case 'software':
					table = TIMAAT.MediaDatasets.dataTableSoftware;
				break;
				case 'text':
					table = TIMAAT.MediaDatasets.dataTableText;
				break;
				case 'video':
					table = TIMAAT.MediaDatasets.dataTableVideo;
				break;
				case 'videogame':
					table = TIMAAT.MediaDatasets.dataTableVideogame;
				break;
			}
			// console.log("TCL: table", table);
			// remove selection from old rows
			if (TIMAAT.MediaDatasets.selectedMediumId && TIMAAT.MediaDatasets.selectedMediumId != id) {
				$(table.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
			}
			// add selection to new rows
			$(table.row('#'+id).node()).addClass('selected');
			TIMAAT.MediaDatasets.selectedMediumId = id;
		},

		clearLastMediumSelection: function (type) {
    	console.log("TCL: clearLastMediumSelection");
			let i = 0;
			switch (type) {
				case 'medium':
					for (; i < TIMAAT.MediaDatasets.media.length; i++) {
						$(TIMAAT.MediaDatasets.dataTableMedia.row('#'+TIMAAT.MediaDatasets.media[i].model.id).node()).removeClass('selected');
						$(TIMAAT.VideoChooser.dt.row('#'+TIMAAT.MediaDatasets.media[i].model.id).node()).removeClass('selected');
					}
				break;
				case 'audio':
					for (; i < TIMAAT.MediaDatasets.audios.length; i++) {
						$(TIMAAT.MediaDatasets.dataTableAudio.row('#'+TIMAAT.MediaDatasets.audios[i].model.id).node()).removeClass('selected');
					}
				break;
				case 'document':
					for (; i < TIMAAT.MediaDatasets.documents.length; i++) {
						$(TIMAAT.MediaDatasets.dataTableDocument.row('#'+TIMAAT.MediaDatasets.documents[i].model.id).node()).removeClass('selected');
					}
				break;
				case 'image':
					for (; i < TIMAAT.MediaDatasets.images.length; i++) {
						$(TIMAAT.MediaDatasets.dataTableImage.row('#'+TIMAAT.MediaDatasets.images[i].model.id).node()).removeClass('selected');
					}
				break;
				case 'software':
					for (; i < TIMAAT.MediaDatasets.softwares.length; i++) {
						$(TIMAAT.MediaDatasets.dataTableSoftware.row('#'+TIMAAT.MediaDatasets.softwares[i].model.id).node()).removeClass('selected');
					}
				break;
				case 'text':
					for (; i < TIMAAT.MediaDatasets.texts.length; i++) {
						$(TIMAAT.MediaDatasets.dataTableText.row('#'+TIMAAT.MediaDatasets.texts[i].model.id).node()).removeClass('selected');
					}
				break;
				case 'video':
					for (; i < TIMAAT.MediaDatasets.videos.length; i++) {
						// $(TIMAAT.VideoChooser.dt.row('#'+TIMAAT.MediaDatasets.media[i].model.id).node()).removeClass('selected');
						$(TIMAAT.MediaDatasets.dataTableVideo.row('#'+TIMAAT.MediaDatasets.videos[i].model.id).node()).removeClass('selected');
					}
				break;
				case 'videogame':
					for (; i < TIMAAT.MediaDatasets.videogames.length; i++) {
						$(TIMAAT.MediaDatasets.dataTableVideogame.row('#'+TIMAAT.MediaDatasets.videogames[i].model.id).node()).removeClass('selected');
					}
				break;
			}
			// for (; i < TIMAAT.MediaDatasets.media.length; i++) {
				$(TIMAAT.MediaDatasets.dataTableMedia.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.VideoChooser.dt.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.MediaDatasets.dataTableAudio.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.MediaDatasets.dataTableDocument.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.MediaDatasets.dataTableImage.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.MediaDatasets.dataTableSoftware.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.MediaDatasets.dataTableText.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.MediaDatasets.dataTableVideo.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
				$(TIMAAT.MediaDatasets.dataTableVideogame.row('#'+TIMAAT.MediaDatasets.selectedMediumId).node()).removeClass('selected');
			// }
			TIMAAT.MediaDatasets.selectedMediumId = null;
		},

		refreshDatatable: async function(type) {
			// console.log("TCL: refreshDatatable - type: ", type);
			// set ajax data source
			switch(type) {
				case 'medium':
					if (TIMAAT.MediaDatasets.dataTableMedia) {
						// TIMAAT.MediaDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
						TIMAAT.MediaDatasets.dataTableMedia.ajax.reload(null, false);
						TIMAAT.VideoChooser.dt.ajax.reload(null, false);
					}
				break;
				case 'audio':
					if (TIMAAT.MediaDatasets.dataTableAudio) {
						// TIMAAT.MediaDatasets.dataTableAudio.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableAudio.ajax.reload(null, false);
					}
				break;
				case 'document':
					if (TIMAAT.MediaDatasets.dataTableDocument) {
						// TIMAAT.MediaDatasets.dataTableDocument.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableDocument.ajax.reload(null, false);
					}
				break;
				case 'image':
					if (TIMAAT.MediaDatasets.dataTableImage) {
						// TIMAAT.MediaDatasets.dataTableImage.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableImage.ajax.reload(null, false);
					}
				break;
				case 'software':
					if (TIMAAT.MediaDatasets.dataTableSoftware) {
						// TIMAAT.MediaDatasets.dataTableSoftware.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableSoftware.ajax.reload(null, false);
					}
				break;
				case 'text':
					if (TIMAAT.MediaDatasets.dataTableText) {
						// TIMAAT.MediaDatasets.dataTableText.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableText.ajax.reload(null, false);
					}
				break;
				case 'video':
					if (TIMAAT.MediaDatasets.dataTableVideo) {
						// TIMAAT.MediaDatasets.dataTableVideo.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableVideo.ajax.reload(null, false);
					}
				break;
				case 'videogame':
					if (TIMAAT.MediaDatasets.dataTableVideogame) {
						// TIMAAT.MediaDatasets.dataTableVideogame.ajax.url('/TIMAAT/api/medium/'+mediaType+'/list');
						TIMAAT.MediaDatasets.dataTableVideogame.ajax.reload(null, false);
					}
				break;
			}
		},

	}
	
}, window));
