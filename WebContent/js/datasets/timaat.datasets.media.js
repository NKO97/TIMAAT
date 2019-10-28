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

		init: function() {
			TIMAAT.MediaDatasets.initMedia();
			TIMAAT.MediaDatasets.initMediaTypes();
			TIMAAT.MediaDatasets.initAudios();
			TIMAAT.MediaDatasets.initDocuments();
			TIMAAT.MediaDatasets.initImages();
			TIMAAT.MediaDatasets.initSoftwares();
			TIMAAT.MediaDatasets.initTexts();
			TIMAAT.MediaDatasets.initVideos();
			TIMAAT.MediaDatasets.initVideogames();
		},

		initMediaTypes: function() {
			// console.log("TCL: MediaDatasets: initMediaTypes: function()");		
			// delete mediaType functionality
			$('#timaat-mediatype-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-medium-type-delete');
				var mediaType = modal.data('mediaType');
				if (mediaType) TIMAAT.MediaDatasets._mediaTypeRemoved(mediaType);
				modal.modal('hide');
			});
			// add mediaType button
			$('#timaat-mediatype-add').attr('onclick','TIMAAT.MediaDatasets.addMediaType()');

			// add/edit mediaType functionality
			$('#timaat-mediadatasets-medium-type-meta').on('show.bs.modal', function (ev) {
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
				$('#timaat-mediatype-meta-submit').html(submit);
				$("#timaat-mediatype-meta-name").val(type).trigger('input');
				$("#timaat-mediatype-meta-hasvisual").val(hasVisual);
				$("#timaat-mediatype-meta-hasaudio").val(hasAudio);
				$("#timaat-mediatype-meta-hascontent").val(hasContent);
			});

			// Submit mediaType data
			$('#timaat-mediatype-meta-submit').click(function(ev) {
				// Create/Edit mediaType window submitted data validation
				var modal = $('#timaat-mediadatasets-medium-type-meta');
				var mediaType = modal.data('mediaType');
				var type = $("#timaat-mediatype-meta-name").val();
				var hasVisual = $("#timaat-mediatype-meta-has-visual").val();
				var hasAudio = $("#timaat-mediatype-meta-has-audio").val();
				var hasContent = $("#timaat-mediatype-meta-has-content").val();

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
			$('#timaat-mediatype-meta-name').on('input', function(ev) {
				if ( $("#timaat-mediatype-meta-name").val().length > 0 ) {
					$('#timaat-mediatype-meta-submit').prop("disabled", false);
					$('#timaat-mediatype-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-mediatype-meta-submit').prop("disabled", true);
					$('#timaat-mediatype-meta-submit').attr("disabled");
				}
			});
		},

		initMedia: function() {
			// console.log("TCL: MediaDatasets: initMedia: function()");		
			// delete button functionality
			$('#timaat-medium-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-medium-delete');
				var medium = modal.data('medium');
				if (medium) TIMAAT.MediaDatasets._mediumRemoved(medium);
				modal.modal('hide');
				$('#timaat-mediadatasets-medium-form').hide();
			});

			// add medium button functionality (opens form)
			$('#timaat-medium-add').attr('onclick','TIMAAT.MediaDatasets.addMedium()');
			
			// Submit medium data button functionality
			$("#timaat-medium-meta-submit").on('click', function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-medium-form").valid()) return false;

				// the original medium model (in case of editing an existing medium)
				var medium = $("#timaat-mediadatasets-medium-form").data("medium");				
				// Create/Edit medium window submitted data
				var formData = $("#timaat-mediadatasets-medium-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				// console.log("TCL: formDataObject", formDataObject);

				if (medium) { // update medium
          // console.log("TCL: medium", medium);
					// medium data
					medium.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
          // console.log("TCL: releaseDate", medium.model.releaseDate);
					medium.model.copyright = formDataObject.copyright;
					medium.model.remark = formDataObject.remark;
					// title data
					medium.model.title.name = formDataObject.primaryTitle;
					medium.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// medium.model.mediaType.id = Number(formDataObject.typeId); // Do not change type 
					// source data
					medium.model.sources[0].url = formDataObject.sourceUrl;
					medium.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					medium.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
          // console.log("TCL: lastAccessed", medium.model.sources[0].lastAccessed);
					medium.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;

					medium.updateUI();
					TIMAAT.MediaDatasets.updateMedium(medium);
				} else { // create new medium
					var model = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: Number(formDataObject.typeId),
						},
						// work: {
						// 	id: 1,  // TODO implement work
						// },
						// mediumTranslations: [],
					};
					// console.log("TCL: releaseDate", model.releaseDate);
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
					// console.log("TCL: lastAccessed", source.lastAccessed);
					// Medium has no translation table at the moment
					// TIMAAT.MediaDatasets.createMedium(model, modelTranslation, TIMAAT.MediaDatasets._mediumAdded);
					TIMAAT.MediaDatasets.createMedium(model, title, source);
				};
				$('#timaat-mediadatasets-medium-form').data('medium', null);
				$('#timaat-mediadatasets-medium-form').trigger('reset');
				$('#timaat-mediadatasets-medium-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-medium-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-medium-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-medium-form').data('medium', null);
				$('#timaat-mediadatasets-medium-form').trigger('reset');
				mediumFormValidator.resetForm();
				$('#timaat-mediadatasets-medium-form').hide();
			});
		},

		initAudios: function() {
			// console.log("TCL: MediaDatasets: initAudios: function()");		
			// delete audio functionality
			$('#timaat-audio-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-audio-delete');
				var audio = modal.data('audio');
				if (audio) TIMAAT.MediaDatasets._mediumSubtypeRemoved("audio", audio);
				modal.modal('hide');
				$('#timaat-mediadatasets-audio-form').hide();
			});

			// add audio button functionality (opens form)
			$('#timaat-audio-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("audio")');

			// Submit audio data button functionality
			$('#timaat-audio-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-audio-form").valid()) return false;

				// the original audio model (in case of editing an existing audio)
				var audio = $("#timaat-mediadatasets-audio-form").data("audio");				
				// Create/Edit audio window submitted data
				var formData = $("#timaat-mediadatasets-audio-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (audio) { // update audio
					// medium data
					audio.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					audio.model.medium.copyright = formDataObject.copyright;
					audio.model.medium.remark = formDataObject.remark;
					// title data
					audio.model.medium.title.name = formDataObject.primaryTitle;
					audio.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					audio.model.medium.sources[0].url = formDataObject.sourceUrl;
					audio.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					audio.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					audio.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// audio data
					audio.model.length = TIMAAT.Util.parseTime(formDataObject.length);
					// TODO: audiocodecinformation

					audio.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("audio", audio);

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
					TIMAAT.MediaDatasets.createMediumSubtype("audio", model, medium, title, source);
				}
				$('#timaat-mediadatasets-audio-form').data('audio', null);
				$('#timaat-mediadatasets-audio-form').trigger('reset');
				$('#timaat-mediadatasets-audio-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-audio-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-audio-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-audio-form').data('audio', null);
				$('#timaat-mediadatasets-audio-form').trigger('reset');
				audioFormValidator.resetForm();
				$('#timaat-mediadatasets-audio-form').hide();
			});
		},

		initDocuments: function() {
			// console.log("TCL: MediaDatasets: initDocuments: function()");		
			// delete document functionality
			$('#timaat-document-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-document-delete');
				var mediumDocument = modal.data('document');
				if (mediumDocument) TIMAAT.MediaDatasets._mediumSubtypeRemoved("document", mediumDocument);
				modal.modal('hide');
				$('#timaat-mediadatasets-document-form').hide();
			});

			// add document button functionality (opens form)
			$('#timaat-document-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("document")');

			// Submit document data button functionality
			$('#timaat-document-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-document-form").valid()) return false;

				// the original document model (in case of editing an existing document)
				var mediumDocument = $("#timaat-mediadatasets-document-form").data("document");				
				// Create/Edit document window submitted data
				var formData = $("#timaat-mediadatasets-document-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				console.log("TCL: formDataObject", formDataObject);

				if (mediumDocument) { // update document
          console.log("TCL: mediumDocument", mediumDocument);
					// medium data
					mediumDocument.medium.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					mediumDocument.medium.model.copyright = formDataObject.copyright;
					mediumDocument.medium.model.remark = formDataObject.remark;
					// title data
					mediumDocument.medium.model.title.name = formDataObject.primaryTitle;
					mediumDocument.medium.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					mediumDocument.medium.model.sources[0].url = formDataObject.sourceUrl;
					mediumDocument.medium.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					mediumDocument.medium.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					mediumDocument.medium.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// document data
					// currently empty

					mediumDocument.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("document", mediumDocument);

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
					TIMAAT.MediaDatasets.createMediumSubtype("document", model, medium, title, source);
				}
				$('#timaat-mediadatasets-document-form').data('document', null);
				$('#timaat-mediadatasets-document-form').trigger('reset');
				$('#timaat-mediadatasets-document-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-document-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-document-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-document-form').data('document', null);
				$('#timaat-mediadatasets-document-form').trigger('reset');
				documentFormValidator.resetForm();
				$('#timaat-mediadatasets-document-form').hide();
			});

		},

		initImages: function() {
			// console.log("TCL: MediaDatasets: initImages: function()");		
			// delete image functionality
			$('#timaat-image-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-image-delete');
				var image = modal.data('image');
				if (image) TIMAAT.MediaDatasets._mediumSubtypeRemoved("image", image);
				modal.modal('hide');
				$('#timaat-mediadatasets-image-form').hide();
			});

			// add image button functionality (opens form)
			$('#timaat-image-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("image")');

			// Submit image data button functionality
			$('#timaat-image-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-image-form").valid()) return false;

				// the original image model (in case of editing an existing image)
				var image = $("#timaat-mediadatasets-image-form").data("image");				
				// Create/Edit image window submitted data
				var formData = $("#timaat-mediadatasets-image-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (image) { // update image
					// medium data
					image.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					image.model.medium.copyright = formDataObject.copyright;
					image.model.medium.remark = formDataObject.remark;
					// title data
					image.model.medium.title.name = formDataObject.primaryTitle;
					image.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					image.model.medium.sources[0].url = formDataObject.sourceUrl;
					image.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					image.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					image.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// image data
					image.model.width = formDataObject.width;
					image.model.height = formDataObject.height;
					image.model.bitDepth = formDataObject.bitDepth;

					image.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("image", image);

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
					TIMAAT.MediaDatasets.createMediumSubtype("image", model, medium, title, source);
				}
				$('#timaat-mediadatasets-image-form').data('image', null);
				$('#timaat-mediadatasets-image-form').trigger('reset');
				$('#timaat-mediadatasets-image-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-image-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-image-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-image-form').data('image', null);
				$('#timaat-mediadatasets-image-form').trigger('reset');
				imageFormValidator.resetForm();
				$('#timaat-mediadatasets-image-form').hide();
			});
		},

		initSoftwares: function() {
			// console.log("TCL: MediaDatasets: initSoftwares: function()");		
			// delete software functionality
			$('#timaat-software-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-software-delete');
				var software = modal.data('software');
				if (software) TIMAAT.MediaDatasets._mediumSubtypeRemoved("software", software);
				modal.modal('hide');
				$('#timaat-mediadatasets-software-form').hide();
			});

			// add software button functionality (opens form)
			$('#timaat-software-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("software")');

			// Submit software data button functionality
			$('#timaat-software-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-software-form").valid()) return false;

				// the original software model (in case of editing an existing software)
				var software = $("#timaat-mediadatasets-software-form").data("software");				
				// Create/Edit software window submitted data
				var formData = $("#timaat-mediadatasets-software-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (software) { // update software
					// medium data
					software.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					software.model.medium.copyright = formDataObject.copyright;
					software.model.medium.remark = formDataObject.remark;
					// title data
					software.model.medium.title.name = formDataObject.primaryTitle;
					software.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					software.model.medium.sources[0].url = formDataObject.sourceUrl;
					software.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					software.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					software.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// software data
					software.model.version = formDataObject.version;

					software.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("software", software);

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
					TIMAAT.MediaDatasets.createMediumSubtype("software", model, medium, title, source);
				}
				$('#timaat-mediadatasets-software-form').data('software', null);
				$('#timaat-mediadatasets-software-form').trigger('reset');
				$('#timaat-mediadatasets-software-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-software-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-software-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-software-form').data('software', null);
				$('#timaat-mediadatasets-software-form').trigger('reset');
				softwareFormValidator.resetForm();
				$('#timaat-mediadatasets-software-form').hide();
			});
		},

		initTexts: function() {
			// console.log("TCL: MediaDatasets: initTexts: function()");		
			// delete text functionality
			$('#timaat-text-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-text-delete');
				var text = modal.data('text');
				if (text) TIMAAT.MediaDatasets._mediumSubtypeRemoved("text", text);
				modal.modal('hide');
				$('#timaat-mediadatasets-text-form').hide();
			});

			// add text button functionality (opens form)
			$('#timaat-text-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("text")');

			// Submit text data button functionality
			$('#timaat-text-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-text-form").valid()) return false;

				// the original text model (in case of editing an existing text)
				var text = $("#timaat-mediadatasets-text-form").data("text");				
				// Create/Edit text window submitted data
				var formData = $("#timaat-mediadatasets-text-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (text) { // update text
					// medium data
					text.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					text.model.medium.copyright = formDataObject.copyright;
					text.model.medium.remark = formDataObject.remark;
					// title data
					text.model.medium.title.name = formDataObject.primaryTitle;
					text.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					text.model.medium.sources[0].url = formDataObject.sourceUrl;
					text.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					text.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					text.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// text data
					text.model.content = formDataObject.content;

					text.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("text", text);

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
					TIMAAT.MediaDatasets.createMediumSubtype("text", model, medium, title, source);
				}
				$('#timaat-mediadatasets-text-form').data('text', null);
				$('#timaat-mediadatasets-text-form').trigger('reset');
				$('#timaat-mediadatasets-text-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-text-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-text-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-text-form').data('text', null);
				$('#timaat-mediadatasets-text-form').trigger('reset');
				textFormValidator.resetForm();
				$('#timaat-mediadatasets-text-form').hide();
			});
		},

		initVideos: function() {
			// console.log("TCL: MediaDatasets: initVideos: function()");		
			// delete video functionality
			$('#timaat-video-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-video-delete');
				var video = modal.data('video');
				if (video) TIMAAT.MediaDatasets._mediumSubtypeRemoved("video", video);
				modal.modal('hide');
				$('#timaat-mediadatasets-video-form').hide();
			});

			// add video button functionality (opens form)
			$('#timaat-video-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("video")');

			// Submit video data button functionality
			$('#timaat-video-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-video-form").valid()) return false;

				// the original video model (in case of editing an existing video)
				var video = $("#timaat-mediadatasets-video-form").data("video");				
				// Create/Edit video window submitted data
				var formData = $("#timaat-mediadatasets-video-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (video) { // update video
					// medium data
					video.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					video.model.medium.copyright = formDataObject.copyright;
					video.model.medium.remark = formDataObject.remark;
					// title data
					video.model.medium.title.name = formDataObject.primaryTitle;
					video.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					video.model.medium.sources[0].url = formDataObject.sourceUrl;
					video.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					video.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					video.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// video data
					video.model.length = TIMAAT.Util.parseTime(formDataObject.length);
					video.model.videoCodec = formDataObject.videoCodec;
					video.model.width = formDataObject.width;
					video.model.height = formDataObject.height;
					video.model.frameRate = formDataObject.frameRate;
					video.model.dataRate = formDataObject.dataRate;
					video.model.totalBitrate = formDataObject.totalBitrate;
					video.model.isEpisode = (formDataObject.isEpisode) ? true : false;

					video.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("video", video);

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
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 6 // 6 = Video. TODO check clause to find proper id
						},
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
					TIMAAT.MediaDatasets.createMediumSubtype("video", model, medium, title, source);
				}
				$('#timaat-mediadatasets-video-form').data('video', null);
				$('#timaat-mediadatasets-video-form').trigger('reset');
				$('#timaat-mediadatasets-video-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-video-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-video-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-video-form').data('video', null);
				$('#timaat-mediadatasets-video-form').trigger('reset');
				videoFormValidator.resetForm();
				$('#timaat-mediadatasets-video-form').hide();
			});
		},

		initVideogames: function() {
			// console.log("TCL: MediaDatasets: initVideogames: function()");		
			// delete videogame functionality
			$('#timaat-videogame-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-videogame-delete');
				var videogame = modal.data('videogame');
				if (videogame) TIMAAT.MediaDatasets._mediumSubtypeRemoved("videogame", videogame);
				modal.modal('hide');
				$('#timaat-mediadatasets-videogame-form').hide();
			});

			// add videogame button functionality (opens form)
			$('#timaat-videogame-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("videogame")');

			// Submit videogame data button functionality
			$('#timaat-videogame-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-videogame-form").valid()) return false;

				// the original videogame model (in case of editing an existing videogame)
				var videogame = $("#timaat-mediadatasets-videogame-form").data("videogame");				
				// Create/Edit videogame window submitted data
				var formData = $("#timaat-mediadatasets-videogame-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (videogame) { // update videogame
          console.log("TCL: videogame", videogame);
					// medium data
					videogame.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					videogame.model.medium.copyright = formDataObject.copyright;
					videogame.model.medium.remark = formDataObject.remark;
					// title data
					videogame.model.medium.title.name = formDataObject.primaryTitle;
					videogame.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					videogame.model.medium.sources[0].url = formDataObject.sourceUrl;
					videogame.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					videogame.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					videogame.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// videogame data
					videogame.model.isEpisode = (formDataObject.isEpisode) ? true : false;

					videogame.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("videogame", videogame);

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
					TIMAAT.MediaDatasets.createMediumSubtype("videogame", model, medium, title, source);
				}
				$('#timaat-mediadatasets-videogame-form').data('videogame', null);
				$('#timaat-mediadatasets-videogame-form').trigger('reset');
				$('#timaat-mediadatasets-videogame-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-videogame-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-videogame-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-videogame-form').data('videogame', null);
				$('#timaat-mediadatasets-videogame-form').trigger('reset');
				videogameFormValidator.resetForm();
				$('#timaat-mediadatasets-videogame-form').hide();
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
			TIMAAT.MediaService.listMedia(TIMAAT.MediaDatasets.setMediumLists);
		},

		loadMediumSubtype: function(mediumSubtype) {
			switch (mediumSubtype) {
				case "audio":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setAudioLists);
					break;
				case "document":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setDocumentLists);
					break;
				case "image":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setImageLists);
					break;
				case "software":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setSoftwareLists);
					break;
				case "text":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setTextLists);
					break;
				case "video":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideoLists);
					break;
				case "videogame":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideogameLists);
					break;
			};
		},

		loadAllMediumSubtypes: function() {
			TIMAAT.MediaService.listMediumSubtype("audio", TIMAAT.MediaDatasets.setAudioLists);
			TIMAAT.MediaService.listMediumSubtype("document", TIMAAT.MediaDatasets.setDocumentLists);
			TIMAAT.MediaService.listMediumSubtype("image", TIMAAT.MediaDatasets.setImageLists);
			TIMAAT.MediaService.listMediumSubtype("software", TIMAAT.MediaDatasets.setSoftwareLists);
			TIMAAT.MediaService.listMediumSubtype("text", TIMAAT.MediaDatasets.setTextLists);
			TIMAAT.MediaService.listMediumSubtype("video", TIMAAT.MediaDatasets.setVideoLists);
			TIMAAT.MediaService.listMediumSubtype("videogame", TIMAAT.MediaDatasets.setVideogameLists);
		},

		setMediaTypeLists: function(mediaTypes) {
			console.log("TCL: mediaTypes", mediaTypes);
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
			console.log("TCL: setMediumLists -> media", media);
			if ( !media ) return;
			

			// also set up video chooser list
			TIMAAT.VideoChooser.setMedia(media);

			$('#timaat-medium-list-loader').remove();
			// clear old UI list
			$('#timaat-medium-list').empty();
			// setup model
			var meds = Array();
			media.forEach(function(medium) { 
				if ( medium.id > 0 ) 
					meds.push(new TIMAAT.Medium(medium)); 
			});
			TIMAAT.MediaDatasets.media = meds;
			TIMAAT.MediaDatasets.media.model = media;
		},

		// will probably not work this way
		// setMediumSubtypeLists: function(mediumSubtype, mediumSubtypeDatasets) {
    // console.log("TCL: mediumSubtype, mediumSubtypeDatasets", mediumSubtype, mediumSubtypeDatasets);
		// 	if ( !mediumSubtypeDatasets ) return;
		// 	switch (mediumSubtype) {
		// 		case "audio":
		// 			$('#timaat-audio-list-loader').remove();
		// 			// clear old UI list
		// 			$('#timaat-audio-list').empty();
		// 			// setup model
		// 			var auds = Array();
		// 			audios.forEach(function(audio) { 
		// 				if ( audio.mediumId > 0 )
		// 					auds.push(new TIMAAT.Audio(audio)); 
		// 			});
		// 			TIMAAT.MediaDatasets.audios = auds;
		// 			TIMAAT.MediaDatasets.audios.model = audios;
		// 			break;
		// 		case "document":
		// 			break;
		// 		case "image":
		// 			break;
		// 		case "software":
		// 			break;
		// 		case "text":
		// 			break;
		// 		case "video":
		// 			break;
		// 		case "videogame":
		// 			break;
		// 	};
		// },

		setAudioLists: function(audios) {
			console.log("TCL: setAudioLists -> audios", audios);
				if ( !audios ) return;
				$('#timaat-audio-list-loader').remove();
				// clear old UI list
				$('#timaat-audio-list').empty();
				// setup model
				var auds = Array();
				audios.forEach(function(audio) { 
					if ( audio.mediumId > 0 )
						auds.push(new TIMAAT.Audio(audio)); 
				});
				TIMAAT.MediaDatasets.audios = auds;
				TIMAAT.MediaDatasets.audios.model = audios;
		},

		setDocumentLists: function(documents) {
			console.log("TCL: setDocumentLists -> documents", documents);
				if ( !documents ) return;
				$('#timaat-document-list-loader').remove();
				// clear old UI list
				$('#timaat-document-list').empty();
				// setup model
				var docs = Array();
				documents.forEach(function(mediumDocument) { 
					if ( mediumDocument.mediumId > 0 )
						docs.push(new TIMAAT.Document(mediumDocument)); 
				});
				TIMAAT.MediaDatasets.documents = docs;
				TIMAAT.MediaDatasets.documents.model = documents;
		},

		setImageLists: function(images) {
			console.log("TCL: setImageLists -> images", images);
				if ( !images ) return;
				$('#timaat-image-list-loader').remove();
				// clear old UI list
				$('#timaat-image-list').empty();
				// setup model
				var imgs = Array();
				images.forEach(function(image) { 
					if ( image.mediumId > 0 )
						imgs.push(new TIMAAT.Image(image)); 
				});
				TIMAAT.MediaDatasets.images = imgs;
				TIMAAT.MediaDatasets.images.model = images;
		},

		setSoftwareLists: function(softwares) {
			console.log("TCL: setSoftwareLists -> softwares", softwares);
				if ( !softwares ) return;
				$('#timaat-software-list-loader').remove();
				// clear old UI list
				$('#timaat-software-list').empty();
				// setup model
				var softws = Array();
				softwares.forEach(function(software) { 
					if ( software.mediumId > 0 )
						softws.push(new TIMAAT.Software(software)); 
				});
				TIMAAT.MediaDatasets.softwares = softws;
				TIMAAT.MediaDatasets.softwares.model = softwares;
		},

		setTextLists: function(texts) {
			console.log("TCL: setTextLists -> texts", texts);
				if ( !texts ) return;
				$('#timaat-text-list-loader').remove();
				// clear old UI list
				$('#timaat-text-list').empty();
				// setup model
				var txts = Array();
				texts.forEach(function(text) { 
					if ( text.mediumId > 0 )
						txts.push(new TIMAAT.Text(text)); 
				});
				TIMAAT.MediaDatasets.texts = txts;
				TIMAAT.MediaDatasets.texts.model = texts;
		},
		
		setVideoLists: function(videos) {
			console.log("TCL: setVideoLists -> videos", videos);
				if ( !videos ) return;

				$('#timaat-video-list-loader').remove();
				// clear old UI list
				$('#timaat-video-list').empty();
				// setup model
				var vids = Array();
				videos.forEach(function(video) { 
					if ( video.mediumId > 0 )
						vids.push(new TIMAAT.Video(video)); 
				});
				TIMAAT.MediaDatasets.videos = vids;
				TIMAAT.MediaDatasets.videos.model = videos;
		},

		setVideogameLists: function(videogames) {
			console.log("TCL: setVideogameLists -> videogames", videogames);
			if ( !videogames ) return;
			$('#timaat-videogame-list-loader').remove();
			// clear old UI list
			$('#timaat-videogame-list').empty();
			// setup model
			var vdgms = Array();
			videogames.forEach(function(videogame) { 
				if ( videogame.mediumId > 0 )
					vdgms.push(new TIMAAT.Videogame(videogame)); 
			});
			TIMAAT.MediaDatasets.videogames = vdgms;
			TIMAAT.MediaDatasets.videogames.model = videogames;
		},
		
		addMedium: function() {	
    	console.log("TCL: addMedium: function()");
			$('#timaat-mediadatasets-medium-form').data('medium', null);
			mediumFormValidator.resetForm();
			$('#timaat-mediadatasets-medium-form').trigger('reset');
			$('#timaat-mediadatasets-medium-form').show();
			$('#timaat-medium-meta-submit').show();
			$('#timaat-medium-meta-dismiss').show();
			$('#timaat-mediadatasets-medium-form :input').prop("disabled", false);
			$('#timaat-medium-meta-title').focus();

			// setup form
			$('#mediumMetaLabel').html("Medium hinzufügen");
			$('#timaat-medium-meta-submit').html("Hinzufügen");
			$("#timaat-medium-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
			$("#timaat-medium-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
			$("#timaat-medium-meta-source-isprimarysource").prop('checked', true);
			$("#timaat-medium-meta-source-isstillavailable").prop('checked', false);
		},

		addMediumSubtype: function(mediumSubtype) {
			console.log("TCL: addMediumSubtype -> mediumSubtype", mediumSubtype);
			switch (mediumSubtype) {
				case "audio":
					$('#timaat-mediadatasets-audio-form').data('audio', null);
					audioFormValidator.resetForm();
					$('#timaat-mediadatasets-audio-form').trigger('reset');
					$('#timaat-mediadatasets-audio-form').show();
					$('#timaat-audio-meta-submit').show();
					$('#timaat-audio-meta-dismiss').show();
					$('#timaat-mediadatasets-audio-form :input').prop("disabled", false);
					$('#timaat-audio-meta-title').focus();
					// setup form
					$('#audioMetaLabel').html("Audio hinzufügen");
					$('#timaat-audio-meta-submit').html("Hinzufügen");
					$("#timaat-audio-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-audio-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-audio-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-audio-meta-source-isstillavailable").prop('checked', false);
					break;

				case "document":
					$('#timaat-mediadatasets-document-form').data('document', null);
					documentFormValidator.resetForm();
					$('#timaat-mediadatasets-document-form').trigger('reset');
					$('#timaat-mediadatasets-document-form').show();
					$('#timaat-document-meta-submit').show();
					$('#timaat-document-meta-dismiss').show();
					$('#timaat-mediadatasets-document-form :input').prop("disabled", false);
					$('#timaat-document-meta-title').focus();
					// setup form
					$('#documentMetaLabel').html("Document hinzufügen");
					$('#timaat-document-meta-submit').html("Hinzufügen");
					$("#timaat-document-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-document-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-document-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-document-meta-source-isstillavailable").prop('checked', false);
					break;

				case "image":
					$('#timaat-mediadatasets-image-form').data('image', null);
					imageFormValidator.resetForm();
					$('#timaat-mediadatasets-image-form').trigger('reset');
					$('#timaat-mediadatasets-image-form').show();
					$('#timaat-image-meta-submit').show();
					$('#timaat-image-meta-dismiss').show();
					$('#timaat-mediadatasets-image-form :input').prop("disabled", false);
					$('#timaat-image-meta-title').focus();
					// setup form
					$('#imageMetaLabel').html("Image hinzufügen");
					$('#timaat-image-meta-submit').html("Hinzufügen");
					$("#timaat-image-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-image-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-image-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-image-meta-source-isstillavailable").prop('checked', false);
					break;

				case "software":
					$('#timaat-mediadatasets-software-form').data('software', null);
					softwareFormValidator.resetForm();
					$('#timaat-mediadatasets-software-form').trigger('reset');
					$('#timaat-mediadatasets-software-form').show();
					$('#timaat-software-meta-submit').show();
					$('#timaat-software-meta-dismiss').show();
					$('#timaat-mediadatasets-software-form :input').prop("disabled", false);
					$('#timaat-software-meta-title').focus();
					// setup form
					$('#softwareMetaLabel').html("Software hinzufügen");
					$('#timaat-software-meta-submit').html("Hinzufügen");
					$("#timaat-software-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-software-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-software-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-software-meta-source-isstillavailable").prop('checked', false);
					break;

				case "text":
					$('#timaat-mediadatasets-text-form').data('text', null);
					textFormValidator.resetForm();
					$('#timaat-mediadatasets-text-form').trigger('reset');
					$('#timaat-mediadatasets-text-form').show();
					$('#timaat-text-meta-submit').show();
					$('#timaat-text-meta-dismiss').show();
					$('#timaat-mediadatasets-text-form :input').prop("disabled", false);
					$('#timaat-text-meta-title').focus();
					// setup form
					$('#textMetaLabel').html("Text hinzufügen");
					$('#timaat-text-meta-submit').html("Hinzufügen");
					$("#timaat-text-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-text-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-text-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-text-meta-source-isstillavailable").prop('checked', false);
					break;

				case "video":
					$('#timaat-mediadatasets-video-form').data('video', null);
					videoFormValidator.resetForm();
					$('#timaat-mediadatasets-video-form').trigger('reset');
					$('#timaat-mediadatasets-video-form').show();
					$('#timaat-video-meta-submit').show();
					$('#timaat-video-meta-dismiss').show();
					$('#timaat-mediadatasets-video-form :input').prop("disabled", false);
					$('#timaat-video-meta-title').focus();
					// setup form
					$('#videoMetaLabel').html("Video hinzufügen");
					$('#timaat-video-meta-submit').html("Hinzufügen");
					$("#timaat-video-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-video-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-video-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-video-meta-source-isstillavailable").prop('checked', false);
					break;

				case "videogame":
					$('#timaat-mediadatasets-videogame-form').data('videogame', null);
					videogameFormValidator.resetForm();
					$('#timaat-mediadatasets-videogame-form').trigger('reset');
					$('#timaat-mediadatasets-videogame-form').show();
					$('#timaat-videogame-meta-submit').show();
					$('#timaat-videogame-meta-dismiss').show();
					$('#timaat-mediadatasets-videogame-form :input').prop("disabled", false);
					$('#timaat-videogame-meta-title').focus();
					// setup form
					$('#videogameMetaLabel').html("Videogame hinzufügen");
					$('#timaat-videogame-meta-submit').html("Hinzufügen");
					$("#timaat-videogame-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-videogame-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-videogame-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-videogame-meta-source-isstillavailable").prop('checked', false);
					break;
			}
		},

		mediumFormData: function(action, medium) {
			$('#timaat-mediadatasets-medium-form').trigger('reset');
			mediumFormValidator.resetForm();
			$('#timaat-mediadatasets-medium-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-medium-form :input').prop("disabled", true);
			// $('#timaat-medium-edit-in-form').show();
			// $('#timaat-medium-edit-in-form').prop("disabled", false);
			// $('#timaat-medium-edit-in-form :input').prop("disabled", false);
			$('#timaat-medium-meta-submit').hide();
			$('#timaat-medium-meta-dismiss').hide();
			$('#mediumMetaLabel').html("Medium Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-medium-meta-submit').show();
				$('#timaat-medium-meta-dismiss').show();
				$('#timaat-mediadatasets-medium-form :input').prop("disabled", false);
				$('#timaat-medium-meta-medium-type-id').prop("disabled", true);
				$("#timaat-medium-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-medium-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-medium-edit-in-form').hide();
				$('#mediumMetaLabel').html("Medium bearbeiten");
				$('#timaat-medium-meta-submit').html("Speichern");
				$('#timaat-medium-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-medium-meta-medium-type-id").val(medium.model.mediaType.id);
			$("#timaat-medium-meta-remark").val(medium.model.remark);
			$("#timaat-medium-meta-copyright").val(medium.model.copyright);
			if (isNaN(moment(medium.model.releaseDate)))
				$("#timaat-medium-meta-releasedate").val("");
				else	$("#timaat-medium-meta-releasedate").val(moment(medium.model.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-medium-meta-title").val(medium.model.title.name);
			$("#timaat-medium-meta-title-language-id").val(medium.model.title.language.id);
			// source data
			if (medium.model.sources[0].isPrimarySource)
				$("#timaat-medium-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-medium-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-medium-meta-source-url").val(medium.model.sources[0].url);
			if (isNaN(moment.utc(medium.model.sources[0].lastAccessed))) 
				$("#timaat-medium-meta-source-lastaccessed").val("");
				else	$("#timaat-medium-meta-source-lastaccessed").val(moment.utc(medium.model.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (medium.model.sources[0].isStillAvailable)
				$("#timaat-medium-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-medium-meta-source-isstillavailable").prop('checked', false);

			if ( action == "edit") {
				$('#timaat-mediadatasets-medium-form').data('medium', medium);
			}
		},

		audioFormData: function(action, audio) {
			$('#timaat-mediadatasets-audio-form').trigger('reset');
			audioFormValidator.resetForm();
			$('#timaat-mediadatasets-audio-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-audio-form :input').prop("disabled", true);
			// $('#timaat-audio-edit-in-form').show();
			// $('#timaat-audio-edit-in-form').prop("disabled", false);
			// $('#timaat-audio-edit-in-form :input').prop("disabled", false);
			$('#timaat-audio-meta-submit').hide();
			$('#timaat-audio-meta-dismiss').hide();
			$('#audioMetaLabel').html("Audio Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-audio-meta-submit').show();
				$('#timaat-audio-meta-dismiss').show();
				$('#timaat-mediadatasets-audio-form :input').prop("disabled", false);
				$('#timaat-audio-meta-medium-type-id').prop("disabled", true);
				$("#timaat-audio-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-audio-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-audio-edit-in-form').hide();
				$('#audioMetaLabel').html("Audio bearbeiten");
				$('#timaat-audio-meta-submit').html("Speichern");
				$('#timaat-audio-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-audio-meta-medium-type-id").val(audio.model.medium.mediaType.id);
			$("#timaat-audio-meta-remark").val(audio.model.medium.remark);
			$("#timaat-audio-meta-copyright").val(audio.model.medium.copyright);
			if (isNaN(moment(audio.model.medium.releaseDate)))
				$("#timaat-audio-meta-releasedate").val("");
				else	$("#timaat-audio-meta-releasedate").val(moment(audio.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-audio-meta-title").val(audio.model.medium.title.name);
			$("#timaat-audio-meta-title-language-id").val(audio.model.medium.title.language.id);
			// source data
			if (audio.model.medium.sources[0].isPrimarySource)
				$("#timaat-audio-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-audio-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-audio-meta-source-url").val(audio.model.medium.sources[0].url);
			if (isNaN(moment.utc(audio.model.medium.sources[0].lastAccessed))) 
				$("#timaat-audio-meta-source-lastaccessed").val("");
				else	$("#timaat-audio-meta-source-lastaccessed").val(moment.utc(audio.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (audio.model.medium.sources[0].isStillAvailable)
				$("#timaat-audio-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-audio-meta-source-isstillavailable").prop('checked', false);
			// audio data
			$("#timaat-audio-meta-length").val(audio.model.length);

			if ( action == "edit") {
				$('#timaat-mediadatasets-audio-form').data('audio', audio);
			}
		},

		documentFormData: function(action, mediumDocument) {
			$('#timaat-mediadatasets-document-form').trigger('reset');
			documentFormValidator.resetForm();
			$('#timaat-mediadatasets-document-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-document-form :input').prop("disabled", true);
			// $('#timaat-document-edit-in-form').show();
			// $('#timaat-document-edit-in-form').prop("disabled", false);
			// $('#timaat-document-edit-in-form :input').prop("disabled", false);
			$('#timaat-document-meta-submit').hide();
			$('#timaat-document-meta-dismiss').hide();
			$('#documentMetaLabel').html("document Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-document-meta-submit').show();
				$('#timaat-document-meta-dismiss').show();
				$('#timaat-mediadatasets-document-form :input').prop("disabled", false);
				$('#timaat-document-meta-medium-type-id').prop("disabled", true);
				$("#timaat-document-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-document-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-document-edit-in-form').hide();
				$('#documentMetaLabel').html("Document bearbeiten");
				$('#timaat-document-meta-submit').html("Speichern");
				$('#timaat-document-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-document-meta-medium-type-id").val(mediumDocument.model.medium.mediaType.id);
			$("#timaat-document-meta-remark").val(mediumDocument.model.medium.remark);
			$("#timaat-document-meta-copyright").val(mediumDocument.model.medium.copyright);
			if (isNaN(moment(mediumDocument.model.medium.releaseDate)))
				$("#timaat-document-meta-releasedate").val("");
				else	$("#timaat-document-meta-releasedate").val(moment(mediumDocument.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-document-meta-title").val(mediumDocument.model.medium.title.name);
			$("#timaat-document-meta-title-language-id").val(mediumDocument.model.medium.title.language.id);
			// source data
			if (mediumDocument.model.medium.sources[0].isPrimarySource)
				$("#timaat-document-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-document-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-document-meta-source-url").val(mediumDocument.model.medium.sources[0].url);
			if (isNaN(moment.utc(mediumDocument.model.medium.sources[0].lastAccessed))) 
				$("#timaat-document-meta-source-lastaccessed").val("");
				else	$("#timaat-document-meta-source-lastaccessed").val(moment.utc(mediumDocument.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (mediumDocument.model.medium.sources[0].isStillAvailable)
				$("#timaat-document-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-document-meta-source-isstillavailable").prop('checked', false);
			// document data
			// currently empty

			if ( action == "edit") {
				$('#timaat-mediadatasets-document-form').data('document', mediumDocument);
			}
		},

		imageFormData: function(action, image) {
			$('#timaat-mediadatasets-image-form').trigger('reset');
			imageFormValidator.resetForm();
			$('#timaat-mediadatasets-image-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-image-form :input').prop("disabled", true);
			// $('#timaat-image-edit-in-form').show();
			// $('#timaat-image-edit-in-form').prop("disabled", false);
			// $('#timaat-image-edit-in-form :input').prop("disabled", false);
			$('#timaat-image-meta-submit').hide();
			$('#timaat-image-meta-dismiss').hide();
			$('#imageMetaLabel').html("image Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-image-meta-submit').show();
				$('#timaat-image-meta-dismiss').show();
				$('#timaat-mediadatasets-image-form :input').prop("disabled", false);
				$('#timaat-image-meta-medium-type-id').prop("disabled", true);
				$("#timaat-image-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-image-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-image-edit-in-form').hide();
				$('#imageMetaLabel').html("Image bearbeiten");
				$('#timaat-image-meta-submit').html("Speichern");
				$('#timaat-image-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-image-meta-medium-type-id").val(image.model.medium.mediaType.id);
			$("#timaat-image-meta-remark").val(image.model.medium.remark);
			$("#timaat-image-meta-copyright").val(image.model.medium.copyright);
			if (isNaN(moment(image.model.medium.releaseDate)))
				$("#timaat-image-meta-releasedate").val("");
				else	$("#timaat-image-meta-releasedate").val(moment(image.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-image-meta-title").val(image.model.medium.title.name);
			$("#timaat-image-meta-title-language-id").val(image.model.medium.title.language.id);
			// source data
			if (image.model.medium.sources[0].isPrimarySource)
				$("#timaat-image-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-image-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-image-meta-source-url").val(image.model.medium.sources[0].url);
			if (isNaN(moment.utc(image.model.medium.sources[0].lastAccessed))) 
				$("#timaat-image-meta-source-lastaccessed").val("");
				else	$("#timaat-image-meta-source-lastaccessed").val(moment.utc(image.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (image.model.medium.sources[0].isStillAvailable)
				$("#timaat-image-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-image-meta-source-isstillavailable").prop('checked', false);
			// image data
			$("#timaat-image-meta-width").val(image.model.width);
			$("#timaat-image-meta-height").val(image.model.height);
			$("#timaat-image-meta-bitdepth").val(image.model.bitDepth);

			if ( action == "edit") {
				$('#timaat-mediadatasets-image-form').data('image', image);
			}
		},

		softwareFormData: function(action, software) {
			$('#timaat-mediadatasets-software-form').trigger('reset');
			softwareFormValidator.resetForm();
			$('#timaat-mediadatasets-software-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-software-form :input').prop("disabled", true);
			// $('#timaat-software-edit-in-form').show();
			// $('#timaat-software-edit-in-form').prop("disabled", false);
			// $('#timaat-software-edit-in-form :input').prop("disabled", false);
			$('#timaat-software-meta-submit').hide();
			$('#timaat-software-meta-dismiss').hide();
			$('#softwareMetaLabel').html("software Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-software-meta-submit').show();
				$('#timaat-software-meta-dismiss').show();
				$('#timaat-mediadatasets-software-form :input').prop("disabled", false);
				$('#timaat-software-meta-medium-type-id').prop("disabled", true);
				$("#timaat-software-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-software-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-software-edit-in-form').hide();
				$('#softwareMetaLabel').html("software bearbeiten");
				$('#timaat-software-meta-submit').html("Speichern");
				$('#timaat-software-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-software-meta-medium-type-id").val(software.model.medium.mediaType.id);
			$("#timaat-software-meta-remark").val(software.model.medium.remark);
			$("#timaat-software-meta-copyright").val(software.model.medium.copyright);
			if (isNaN(moment(software.model.medium.releaseDate)))
				$("#timaat-software-meta-releasedate").val("");
				else	$("#timaat-software-meta-releasedate").val(moment(software.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-software-meta-title").val(software.model.medium.title.name);
			$("#timaat-software-meta-title-language-id").val(software.model.medium.title.language.id);
			// source data
			if (software.model.medium.sources[0].isPrimarySource)
				$("#timaat-software-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-software-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-software-meta-source-url").val(software.model.medium.sources[0].url);
			if (isNaN(moment.utc(software.model.medium.sources[0].lastAccessed))) 
				$("#timaat-software-meta-source-lastaccessed").val("");
				else	$("#timaat-software-meta-source-lastaccessed").val(moment.utc(software.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (software.model.medium.sources[0].isStillAvailable)
				$("#timaat-software-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-software-meta-source-isstillavailable").prop('checked', false);
			// software data
			$("#timaat-software-meta-version").val(software.model.version);

			if ( action == "edit") {
				$('#timaat-mediadatasets-software-form').data('software', software);
			}
		},

		textFormData: function(action, text) {
			$('#timaat-mediadatasets-text-form').trigger('reset');
			textFormValidator.resetForm();
			$('#timaat-mediadatasets-text-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-text-form :input').prop("disabled", true);
			// $('#timaat-text-edit-in-form').show();
			// $('#timaat-text-edit-in-form').prop("disabled", false);
			// $('#timaat-text-edit-in-form :input').prop("disabled", false);
			$('#timaat-text-meta-submit').hide();
			$('#timaat-text-meta-dismiss').hide();
			$('#textMetaLabel').html("text Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-text-meta-submit').show();
				$('#timaat-text-meta-dismiss').show();
				$('#timaat-mediadatasets-text-form :input').prop("disabled", false);
				$('#timaat-text-meta-medium-type-id').prop("disabled", true);
				$("#timaat-text-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-text-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-text-edit-in-form').hide();
				$('#textMetaLabel').html("Text bearbeiten");
				$('#timaat-text-meta-submit').html("Speichern");
				$('#timaat-text-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-text-meta-medium-type-id").val(text.model.medium.mediaType.id);
			$("#timaat-text-meta-remark").val(text.model.medium.remark);
			$("#timaat-text-meta-copyright").val(text.model.medium.copyright);
			if (isNaN(moment(text.model.medium.releaseDate)))
				$("#timaat-text-meta-releasedate").val("");
				else	$("#timaat-text-meta-releasedate").val(moment(text.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-text-meta-title").val(text.model.medium.title.name);
			$("#timaat-text-meta-title-language-id").val(text.model.medium.title.language.id);
			// source data
			if (text.model.medium.sources[0].isPrimarySource)
				$("#timaat-text-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-text-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-text-meta-source-url").val(text.model.medium.sources[0].url);
			if (isNaN(moment.utc(text.model.medium.sources[0].lastAccessed))) 
				$("#timaat-text-meta-source-lastaccessed").val("");
				else	$("#timaat-text-meta-source-lastaccessed").val(moment.utc(text.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (text.model.medium.sources[0].isStillAvailable)
				$("#timaat-text-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-text-meta-source-isstillavailable").prop('checked', false);
			// text data
			$("#timaat-text-meta-content").val(text.model.content);

			if ( action == "edit") {
				$('#timaat-mediadatasets-text-form').data('text', text);
			}
		},

		videoFormData: function(action, video) {
			$('#timaat-mediadatasets-video-form').trigger('reset');
			videoFormValidator.resetForm();
			$('#timaat-mediadatasets-video-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-video-form :input').prop("disabled", true);
			// $('#timaat-video-edit-in-form').show();
			// $('#timaat-video-edit-in-form').prop("disabled", false);
			// $('#timaat-video-edit-in-form :input').prop("disabled", false);
			$('#timaat-video-meta-submit').hide();
			$('#timaat-video-meta-dismiss').hide();
			$('#videoMetaLabel').html("video Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-video-meta-submit').show();
				$('#timaat-video-meta-dismiss').show();
				$('#timaat-mediadatasets-video-form :input').prop("disabled", false);
				$('#timaat-video-meta-medium-type-id').prop("disabled", true);
				$("#timaat-video-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-video-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-video-edit-in-form').hide();
				$('#videoMetaLabel').html("Video bearbeiten");
				$('#timaat-video-meta-submit').html("Speichern");
				$('#timaat-video-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-video-meta-medium-type-id").val(video.model.medium.mediaType.id);
			$("#timaat-video-meta-remark").val(video.model.medium.remark);
			$("#timaat-video-meta-copyright").val(video.model.medium.copyright);
			if (isNaN(moment(video.model.medium.releaseDate)))
				$("#timaat-video-meta-releasedate").val("");
				else	$("#timaat-video-meta-releasedate").val(moment(video.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-video-meta-title").val(video.model.medium.title.name);
			$("#timaat-video-meta-title-language-id").val(video.model.medium.title.language.id);
			// source data
			if (video.model.medium.sources[0].isPrimarySource)
				$("#timaat-video-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-video-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-video-meta-source-url").val(video.model.medium.sources[0].url);
			if (isNaN(moment.utc(video.model.medium.sources[0].lastAccessed))) 
				$("#timaat-video-meta-source-lastaccessed").val("");
				else	$("#timaat-video-meta-source-lastaccessed").val(moment.utc(video.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (video.model.medium.sources[0].isStillAvailable)
				$("#timaat-video-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-video-meta-source-isstillavailable").prop('checked', false);
			// video data
			$("#timaat-video-meta-length").val(video.model.length);
			$("#timaat-video-meta-videocodec").val(video.model.videoCodec);
			$("#timaat-video-meta-width").val(video.model.width);
			$("#timaat-video-meta-height").val(video.model.height);
			$("#timaat-video-meta-framerate").val(video.model.frameRate);
			$("#timaat-video-meta-datarate").val(video.model.dataRate);
			$("#timaat-video-meta-totalbitrate").val(video.model.totalBitrate);
			if (video.model.isEpisode)
				$("#timaat-video-meta-isepisode").prop('checked', true);
			  else $("#timaat-video-meta-isepisode").prop('checked', false);

			if ( action == "edit") {
				$('#timaat-mediadatasets-video-form').data('video', video);
			}
		},

		videogameFormData: function(action, videogame) {
			$('#timaat-mediadatasets-videogame-form').trigger('reset');
			videogameFormValidator.resetForm();
			$('#timaat-mediadatasets-videogame-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-videogame-form :input').prop("disabled", true);
			// $('#timaat-videogame-edit-in-form').show();
			// $('#timaat-videogame-edit-in-form').prop("disabled", false);
			// $('#timaat-videogame-edit-in-form :input').prop("disabled", false);
			$('#timaat-videogame-meta-submit').hide();
			$('#timaat-videogame-meta-dismiss').hide();
			$('#videogameMetaLabel').html("Videogame Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-videogame-meta-submit').show();
				$('#timaat-videogame-meta-dismiss').show();
				$('#timaat-mediadatasets-videogame-form :input').prop("disabled", false);
				$('#timaat-videogame-meta-medium-type-id').prop("disabled", true);
				$("#timaat-videogame-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-videogame-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-videogame-edit-in-form').hide();
				$('#videogameMetaLabel').html("Videogame bearbeiten");
				$('#timaat-videogame-meta-submit').html("Speichern");
				$('#timaat-videogame-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-videogame-meta-medium-type-id").val(videogame.model.medium.mediaType.id);
			$("#timaat-videogame-meta-remark").val(videogame.model.medium.remark);
			$("#timaat-videogame-meta-copyright").val(videogame.model.medium.copyright);
			if (isNaN(moment(videogame.model.medium.releaseDate)))
				$("#timaat-videogame-meta-releasedate").val("");
				else	$("#timaat-videogame-meta-releasedate").val(moment(videogame.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-videogame-meta-title").val(videogame.model.medium.title.name);
			$("#timaat-videogame-meta-title-language-id").val(videogame.model.medium.title.language.id);
			// source data
			if (videogame.model.medium.sources[0].isPrimarySource)
				$("#timaat-videogame-meta-source-isprimarysource").prop('checked', true);
			  else $("#timaat-videogame-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-videogame-meta-source-url").val(videogame.model.medium.sources[0].url);
			if (isNaN(moment.utc(videogame.model.medium.sources[0].lastAccessed))) 
				$("#timaat-videogame-meta-source-lastaccessed").val("");
				else	$("#timaat-videogame-meta-source-lastaccessed").val(moment.utc(videogame.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (videogame.model.medium.sources[0].isStillAvailable)
				$("#timaat-videogame-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-videogame-meta-source-isstillavailable").prop('checked', false);
			// videogame data
			if (videogame.model.isEpisode)
				$("#timaat-videogame-meta-isepisode").prop('checked', true);
			  else $("#timaat-videogame-meta-isepisode").prop('checked', false);

			if ( action == "edit") {
				$('#timaat-mediadatasets-videogame-form').data('videogame', videogame);
			}
		},

		createMedium: async function(mediumModel, title, source) {
			// createMedium: async function(mediumModel, mediumModelTranslation) { // medium has no translation table at the moment
			// NO MEDIUM SHOULD BE CREATED DIRECTLY. CREATE VIDEO, IMAGE, ETC. INSTEAD
			// This routine can be used to create empty media of a certain type
			console.log("TCL: createMedium: async function -> mediumModel, title, source", mediumModel, title, source);
			try {
				// create title
				var newTitle = await TIMAAT.MediaService.createTitle(title);
				
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.title = newTitle;
				tempMediumModel.source = source;
				var newMediumModel = await TIMAAT.MediaService.createMedium(tempMediumModel);

				// update source (createMedium created an empty source)
				source.id = newMediumModel.sources[0].id;
				var updatedSource = await TIMAAT.MediaService.updateSource(source);
				newMediumModel.sources[0] = updatedSource; // TODO refactor once several sources can be added

				// create medium translation with medium id
				// var newTranslationData = await TIMAAT.MediaService.createMediumTranslation(newMediumModel, mediumModelTranslation);
				// newMediumModel.mediumTranslations[0] = newTranslationData;
				
				// create video/image/etc depending on video type
				// TODO switch (mediumModel.mediaType)

				// push new medium to dataset model
				await TIMAAT.MediaDatasets._mediumAdded(newMediumModel);

			} catch(error) {
				console.log( "error: ", error);
			};
		},

		createMediumSubtype: async function(mediumSubtype, mediumSubtypeModel, mediumModel, title, source) {
			// createMediumSubtype: async function(mediumModel, mediumModelTranslation, mediumSubtypeModel) { // mediumSubtype has no translation table at the moment
			console.log("TCL: createMediumSubtype: async function-> mediumSubtypeModel, mediumModel, title", mediumSubtypeModel, mediumModel, title);
			try {
				// create title
				var newTitle = await TIMAAT.MediaService.createTitle(title);
				
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.title = newTitle;
				tempMediumModel.source = source;
				var newMediumModel = await TIMAAT.MediaService.createMedium(tempMediumModel);

				// update source (createMedium created an empty source)
				source.id = newMediumModel.sources[0].id;
				var updatedSource = await TIMAAT.MediaService.updateSource(source);
				newMediumModel.sources[0] = updatedSource; // TODO refactor once several sources can be added

				// push new medium to dataset model
				await TIMAAT.MediaDatasets._mediumAdded(newMediumModel);
				
				// create medium translation with medium id
				// await TIMAAT.MediaService.createMediumTranslation(newMediumModel, mediumModelTranslation);
				// newMediumModel.mediumTranslations[0] = mediumModelTranslation;

				// create mediumSubtype with medium id
				mediumSubtypeModel.mediumId = newMediumModel.id;
				var newMediumSubtypeModel = await TIMAAT.MediaService.createMediumSubtype(mediumSubtype, newMediumModel, mediumSubtypeModel);

				// push new mediumSubtype to dataset model
				await TIMAAT.MediaDatasets._mediumSubtypeAdded(mediumSubtype, newMediumSubtypeModel);

			} catch(error) {
				console.log( "error: ", error);
			};
		},

		updateMedium: async function(medium) {
		console.log("TCL: updateMedium: async function -> medium at beginning of update process: ", medium);
			try {
				// update title
				var tempTitle = await TIMAAT.MediaService.updateTitle(medium.model.title);
				medium.model.title = tempTitle;

				// update source
				var tempSource = await TIMAAT.MediaService.updateSource(medium.model.sources[0]);

				// update data that is part of medium (includes updating last edited by/at)
				console.log("TCL: updateMedium: async function - medium.model", medium.model);
				var tempMediumModel = await TIMAAT.MediaService.updateMedium(medium.model);
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
			// medium.updateUI();
		},

		updateMediumSubtype: async function(mediumSubtype, mediumSubtypeData) {
			console.log("TCL: updateMediumSubtypeData async function -> mediumSubtype, mediumSubtypeData at beginning of update process: ", mediumSubtype, mediumSubtypeData);
			try {
				// update title
				var tempTitle = await TIMAAT.MediaService.updateTitle(mediumSubtypeData.model.medium.title);
				mediumSubtypeData.model.medium.title = tempTitle;
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update source
				var tempSource = await TIMAAT.MediaService.updateSource(mediumSubtypeData.model.medium.sources[0]);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of mediumSubtypeData
				console.log("TCL: mediumSubtype", mediumSubtype);
				console.log("TCL: mediumSubtypeData.model", mediumSubtypeData.model);
				var tempMediumSubtypeData = mediumSubtypeData;
				// tempMediumSubtypeData.model.medium.sources = null;
        console.log("TCL: tempMediumSubtypeData", tempMediumSubtypeData);
				var tempMediumSubtypeModel = await TIMAAT.MediaService.updateMediumSubtype(mediumSubtype, tempMediumSubtypeData.model);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of medium and its translation
				var mediumSubtypeMediumModel = mediumSubtypeData.model.medium;
        console.log("TCL: UpdateMediumSubtype: async function - mediumSubtypeMediumModel", mediumSubtypeMediumModel);
				var tempMediumSubtypeModelUpdate = await TIMAAT.MediaService.updateMedium(mediumSubtypeMediumModel);				
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		_mediumAdded: async function(medium) {
    	// console.log("TCL: _mediumAdded: function(medium)");
			TIMAAT.MediaDatasets.media.model.push(medium);
			TIMAAT.MediaDatasets.media.push(new TIMAAT.Medium(medium));
		},

		_mediumSubtypeAdded: async function(mediumSubtype, mediumSubtypeData) {
			// console.log("TCL: _mediumSubtypeAdded: function(mediumSubtype, mediumSubtypeData)");
			switch (mediumSubtype) {
				case "audio":
					TIMAAT.MediaDatasets.audios.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.audios.push(new TIMAAT.Audio(mediumSubtypeData));
					break;
				case "document":
					TIMAAT.MediaDatasets.documents.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.documents.push(new TIMAAT.Document(mediumSubtypeData));
					break;
				case "image":
					TIMAAT.MediaDatasets.images.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.images.push(new TIMAAT.Image(mediumSubtypeData));
					break;
				case "software":
					TIMAAT.MediaDatasets.softwares.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.softwares.push(new TIMAAT.Software(mediumSubtypeData));
					break;
				case "text":
					TIMAAT.MediaDatasets.texts.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.texts.push(new TIMAAT.Text(mediumSubtypeData));
					break;
				case "video":
					TIMAAT.MediaDatasets.videos.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.videos.push(new TIMAAT.Video(mediumSubtypeData));
					break;
				case "videogame":
					TIMAAT.MediaDatasets.videogames.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.videogames.push(new TIMAAT.Videogame(mediumSubtypeData));
					break;
			}
		},
		
		_mediumRemoved: function(medium) {
    	// console.log("TCL: _mediumRemoved: function(medium)");
			// sync to server
			TIMAAT.MediaService.removeMedium(medium);
			medium.remove();
		},

		_mediumSubtypeRemoved: function(mediumSubtype, mediumSubtypeData) {
			// console.log("TCL: _videoRemoved: function(video)");
			// sync to server
		 TIMAAT.MediaService.removeMediumSubtype(mediumSubtype, mediumSubtypeData)
		 mediumSubtypeData.remove();
	 },

	}
	
}, window));
