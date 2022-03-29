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

	TIMAAT.MediumDatasets = {
		allMediaList: null,
		audios      : null,
		container   : 'media',
		documents   : null,
		images      : null,
		media       : null,
		mediaLoaded : false,
		mediaTypes  : null,
		softwares   : null,
		texts       : null,
		titles      : null,
		videogames  : null,
		videos      : null,

		init: function() {
			this.initMedia();
			// this.initMediumTypes();
			this.initTitles();
			this.initLanguageTracks();
			this.initActorRoles();
		},

		initMediaComponent: function() {
			// console.log("TCL: initMediaComponent");
			if (!this.mediaLoaded) {
				this.setMediumList();
			}
			if (TIMAAT.UI.component != 'media') {
				TIMAAT.UI.showComponent('media');
				$('#medium-tab').trigger('click');
			}
		},

		initMediumTypes: function() {
			// console.log("TCL: MediumDatasets: initMediumTypes: function()");
			// delete mediaType functionality
			$('#timaat-mediatype-delete-submit').on('click', function(ev) {
				var modal = $('#timaat-mediadatasets-mediumtype-delete');
				let type = modal.data('mediaType');
				if (type) TIMAAT.MediumDatasets._mediaTypeRemoved(type);
				modal.modal('hide');
			});

			// add mediaType button
			$('#timaat-mediatype-add').attr('onclick','TIMAAT.MediumDatasets.addMediumType()');

			// add/edit mediaType functionality
			$('#timaat-mediadatasets-mediumtype-meta').on('show.bs.modal', function (ev) {
				// Create/Edit mediaType window setup
				var modal = $(this);
				var mediaType = modal.data('mediaType');
				var heading = (mediaType) ? "MediumType bearbeiten" : "MediumType hinzufügen";
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
					TIMAAT.MediumService.updateMediumType(mediaType);
					TIMAAT.MediumService.updateMediumTypeTranslation(mediaType);
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
					TIMAAT.MediumService.createMediumType(model, modelTranslation, TIMAAT.MediumDatasets._mediaTypeAdded); // TODO add mediaType parameters
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
			$('#medium-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.initMediaComponent();
				TIMAAT.MediumDatasets.loadMedia();
				TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable');
				$('#timaat-mediumdatasets-all-media').trigger('click');
				// TIMAAT.URLHistory.setURL(null, 'Medium Datasets', '#medium/list');
			});

			$('#audio-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.loadMediumSubtype('audio');
				TIMAAT.UI.displayComponent('medium', 'audio-tab', 'audio-datatable');
				TIMAAT.URLHistory.setURL(null, 'Audio Datasets', '#medium/audio/list');
			});

			$('#document-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.loadMediumSubtype('document');
				TIMAAT.UI.displayComponent('medium', 'document-tab', 'document-datatable');
				TIMAAT.URLHistory.setURL(null, 'Document Datasets', '#medium/document/list');
			});

			$('#image-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.loadMediumSubtype('image');
				TIMAAT.UI.displayComponent('medium', 'image-tab', 'image-datatable');
				TIMAAT.URLHistory.setURL(null, 'Image Datasets', '#medium/image/list');
			});

			$('#software-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.loadMediumSubtype('software');
				TIMAAT.UI.displayComponent('medium', 'software-tab', 'software-datatable');
				TIMAAT.URLHistory.setURL(null, 'Software Datasets', '#medium/software/list');
			});

			$('#text-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.loadMediumSubtype('text');
				TIMAAT.UI.displayComponent('medium', 'text-tab', 'text-datatable');
				TIMAAT.URLHistory.setURL(null, 'Text Datasets', '#medium/text/list');
			});

			$('#video-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.loadMediumSubtype('video');
				TIMAAT.UI.displayComponent('medium', 'video-tab', 'video-datatable');
				TIMAAT.URLHistory.setURL(null, 'Video Datasets', '#medium/video/list');
			});

			$('#videogame-tab').on('click', function(event) {
				TIMAAT.MediumDatasets.loadMediumSubtype('videogame');
				TIMAAT.UI.displayComponent('medium', 'videogame-tab', 'videogame-datatable');
				TIMAAT.URLHistory.setURL(null, 'Videogame Datasets', '#medium/videogame/list');
			});

			$('#medium-tab-metadata').on('click', function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				let type = medium.model.mediaType.mediaTypeTranslations[0].type;
				let name = medium.model.displayTitle.name;
				let id = medium.model.id;
				TIMAAT.UI.displayDataSetContentArea('medium-metadata-form');
				TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');
				if ( type == 'medium') {
					TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + id);
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + type + '/' + id);
				}
			});

			$('#medium-tab-preview').on('click', function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				let type = medium.model.mediaType.mediaTypeTranslations[0].type;
				let name = medium.model.displayTitle.name;
				let id = medium.model.id;
				TIMAAT.UI.displayDataSetContentArea('medium-preview-form');
				TIMAAT.UI.displayDataSetContent('preview', medium, 'medium');
				if ( type == 'medium') {
					TIMAAT.URLHistory.setURL(null, name + ' · Preview · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + id + '/preview');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Preview · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + type + '/' + id + '/preview');
				}
			});

			$('#timaat-mediumdatasets-all-media').on('click', async function(event) {
				TIMAAT.UI.displayDataSetContentArea('medium-allMedia');
				$('#medium-nav-tabs').hide();

				// TIMAAT.MediumDatasets.setMediumList();
				if (!TIMAAT.MediumDatasets.dataTableAllMediaList) {
					await TIMAAT.MediumDatasets.setupAllMediaDataTable();
				}
				TIMAAT.MediumDatasets.dataTableAllMediaList.ajax.url('/TIMAAT/api/medium/allMediaList')
				TIMAAT.MediumDatasets.dataTableAllMediaList.ajax.reload();
				// TIMAAT.UI.displayDataSetContent('allMedia', null, 'mediumCollection');
				if (!TIMAAT.UI.selectedMediumId) {
					TIMAAT.UI.clearLastSelection('medium');
				}
				$('#mediumcollection-metadata-form').data('medium', null);
				$('#mediumcollection-metadata-form').data('type', null);
				$('#timaat-mediumdatasets-all-media').addClass('active');

				// TIMAAT.MediumDatasets.loadMedia();
				// TIMAAT.UI.displayComponent('medium', 'mediumc-tab', 'medium-datatable');
				TIMAAT.URLHistory.setURL(null, 'Media Library', '#medium/allMediaList');
			});

			// add medium button functionality (in medium list - opens datasheet form)
			//* media have to be created via submedium
			// $('#timaat-mediadatasets-medium-add').on('click', function(event) {
			// 	$('#medium-metadata-form').data('type', 'medium');
			// 	$('#medium-metadata-form').data('medium', null);
			// 	TIMAAT.MediumDatasets.addMedium('medium');
			// });

			// delete medium button (in form) handler
			$('.mediadatasheet-form-delete-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#mediumVideoPreview').get(0).pause();
				$('#timaat-mediadatasets-medium-delete').data('medium', $('#medium-metadata-form').data('medium'));
				$('#timaat-mediadatasets-medium-delete').modal('show');
			});

			// confirm delete medium modal functionality
			$('#timaat-mediadatasets-modal-delete-submit-button').on('click', async function(event) {
				let modal = $('#timaat-mediadatasets-medium-delete');
				let medium = modal.data('medium');
				let type = medium.model.mediaType.mediaTypeTranslations[0].type;
        // console.log("TCL: $ -> type", type);
				if (medium) {
					try {
						await TIMAAT.MediumDatasets._mediumRemoved(medium);
					} catch(error) {
						console.error("ERROR: ", error);
					}
					try {
						if ($('#medium-tab').hasClass('active')) {
							await TIMAAT.UI.refreshDataTable('medium');
						} else {
							await TIMAAT.UI.refreshDataTable(type);
						}
					} catch(error) {
						console.error("ERROR: ", error);
					}
				}
				modal.modal('hide');
				if ( $('#medium-tab').hasClass('active') ) {
					$('#medium-tab').trigger('click');
				} else {
					$('#'+type+'-tab').trigger('click');
				}
			});

			// edit content form button handler
			$('.mediadatasheet-form-edit-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				let medium = $('#medium-metadata-form').data('medium');
				TIMAAT.UI.displayDataSetContent(TIMAAT.UI.subNavTab, medium, 'medium', 'edit');
			});

			// medium form handlers
			// submit medium metadata button functionality
			$('#medium-metadata-form-submit-button').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#medium-metadata-form').valid()) return false;

				var medium = $('#medium-metadata-form').data('medium');
        // console.log("TCL: $ -> medium", medium);
				var type = $('#medium-metadata-form').data('type');
        // console.log("TCL: $ -> type", type);

				// create/edit medium window submitted data
				TIMAAT.MediumDatasets.disableReadOnlyDataFields(false);
				var formData = $('#medium-metadata-form').serializeArray();
				TIMAAT.MediumDatasets.disableReadOnlyDataFields(true);
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				// console.log("TCL: formDataObject", formDataObject);
				// sanitize form data
				var formDataSanitized = formDataObject;
				formDataSanitized.displayTitleLanguageId = Number(formDataObject.displayTitleLanguageId);
				formDataSanitized.isEpisode              = (formDataObject.isEpisode == "on") ? true : false;
				formDataSanitized.length                 = TIMAAT.Util.parseTime(formDataObject.length);
				formDataSanitized.recordingEndDate       = moment.utc(formDataObject.recordingEndDate, "YYYY-MM-DD");
				formDataSanitized.recordingStartDate     = moment.utc(formDataObject.recordingStartDate, "YYYY-MM-DD");
				formDataSanitized.releaseDate            = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
				formDataSanitized.sourceIsPrimarySource  = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
				formDataSanitized.sourceIsStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
				formDataSanitized.sourceLastAccessed     = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
				formDataSanitized.sourceUrl              = (formDataObject.sourceUrl.length == 0 ) ? null : formDataObject.sourceUrl;
        // console.log("TCL: formDataSanitized", formDataSanitized);

				if (medium) { // update medium
					// medium data
					medium.model = await TIMAAT.MediumDatasets.updateMediumModelData(medium.model, formDataSanitized);
					// medium subtype data
					switch (type) {
						case "audio":
							if (!medium.model.mediumAudio.audioPostProduction) { //* for existing audio media which were created before audio post production was added
								let audioPostProductionModel = await TIMAAT.MediumService.createAudioPostProduction();
								let audioPostProductionTranslationModel = await TIMAAT.MediumDatasets.createAudioPostProductionTranslationModel(formDataSanitized);
								audioPostProductionTranslationModel.audioPostProduction.id = audioPostProductionModel.id;
								audioPostProductionTranslationModel = await TIMAAT.MediumService.createAudioPostProductionTranslation(audioPostProductionTranslationModel);
								medium.model.mediumAudio.audioPostProduction = {};
								medium.model.mediumAudio.audioPostProduction.id = audioPostProductionModel.id;
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations = [];
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0] = audioPostProductionTranslationModel;
							} else {
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].overdubbing = formDataSanitized.overdubbing;
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].reverb = formDataSanitized.reverb;
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].delay = formDataSanitized.delay;
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].panning = formDataSanitized.panning;
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].bass = formDataSanitized.bass;
								medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].treble = formDataSanitized.treble;
							}
							medium.model.mediumAudio.length = formDataSanitized.length;
						break;
						case "document":
						break;
						case "image":
							medium.model.mediumImage.width = formDataSanitized.width;
							medium.model.mediumImage.height = formDataSanitized.height;
							// medium.model.mediumImage.bitDepth = formDataSanitized.bitDepth;
						break;
						case "software":
							medium.model.mediumSoftware.version = formDataSanitized.version;
						break;
						case "text":
							medium.model.mediumText.content = formDataSanitized.content;
						break;
						case "video":
							medium.model.mediumVideo.length = formDataSanitized.length;
							// medium.model.mediumVideo.videoCodec = formDataSanitized.videoCodec;
							medium.model.mediumVideo.width = formDataSanitized.width;
							medium.model.mediumVideo.height = formDataSanitized.height;
							medium.model.mediumVideo.frameRate = formDataSanitized.frameRate;
							// medium.model.mediumVideo.dataRate = formDataSanitized.dataRate;
							// medium.model.mediumVideo.totalBitrate = formDataSanitized.totalBitrate;
							medium.model.mediumVideo.isEpisode = formDataSanitized.isEpisode;
						break;
						case "videogame":
							medium.model.mediumVideogame.isEpisode = formDataSanitized.isEpisode;
						break;
					}
					medium.model = await TIMAAT.MediumDatasets.updateMedium(type, medium);
					// medium.updateUI();
				} else { // create new medium
					// console.log("TCL: $ -> type", type);
					var mediumModel = await TIMAAT.MediumDatasets.createMediumModel(formDataSanitized, type);
					var displayTitleModel = await TIMAAT.MediumDatasets.createDisplayTitleModel(formDataSanitized);
					var sourceModel = await TIMAAT.MediumDatasets.createSourceModel(formDataSanitized);
					var mediumSubtypeModel = await TIMAAT.MediumDatasets.createMediumSubtypeModel(formDataSanitized, type);
					if (type == 'audio') {
						let audioPostProductionModel = await TIMAAT.MediumService.createAudioPostProduction();
						let audioPostProductionTranslationModel = await TIMAAT.MediumDatasets.createAudioPostProductionTranslationModel(formDataSanitized);
						audioPostProductionTranslationModel.audioPostProduction.id = audioPostProductionModel.id;
						audioPostProductionTranslationModel = await TIMAAT.MediumService.createAudioPostProductionTranslation(audioPostProductionTranslationModel);
						mediumSubtypeModel.audioPostProduction.id = audioPostProductionModel.id;
						mediumSubtypeModel.audioPostProduction.audioPostProductionTranslations[0] = audioPostProductionTranslationModel;
					}
					var newMedium = await TIMAAT.MediumDatasets.createMedium(type, mediumModel, mediumSubtypeModel, displayTitleModel, sourceModel);
					medium = new TIMAAT.Medium(newMedium, type);
					medium.model.fileStatus = 'noFile';
					$('#medium-metadata-form').data('medium', medium);
					TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-metadata-form', 'medium');
					$('#medium-tab-metadata').trigger('click');
				}
				TIMAAT.MediumDatasets.showAddMediumButton();
				if ($('#medium-tab').hasClass('active')) {
					await TIMAAT.UI.refreshDataTable('medium');
				} else {
					await TIMAAT.UI.refreshDataTable(type);
				}
				// TIMAAT.UI.addSelectedClassToSelectedItem(type, medium.model.id); // is done in displayDataSetContent
				TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');
			});

			// cancel add/edit button in content form functionality
			$('#medium-metadata-form-dismiss-button').on('click', async function(event) {
				TIMAAT.MediumDatasets.showAddMediumButton();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

			// category set button handler
			$('#medium-datasheet-form-categoryset-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#timaat-mediadatasets-medium-categorysets');
				modal.data('medium', $('#medium-metadata-form').data('medium'));
				var medium = modal.data('medium');
				modal.find('.modal-body').html(`
					<form role="form" id="mediumCategorySetsForm">
						<div class="form-group">
							<!-- <label for="medium-categorySets-multi-select-dropdown">Medium category sets</label> -->
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="medium-categorySets-multi-select-dropdown"
												name="categorySetId"
												data-role="categorySetId"
												data-placeholder="Select medium category sets"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
				$('#medium-categorySets-multi-select-dropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: true,
					allowClear: true,
					minimumResultsForSearch: 10,
					ajax: {
						url: 'api/categorySet/selectList/',
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
						cache: false
					},
					minimumInputLength: 0,
				});
				TIMAAT.MediumService.getCategorySetList(medium.model.id).then(function(data) {
					// console.log("TCL: then: data", data);
					var categorySetSelect = $('#medium-categorySets-multi-select-dropdown');
					if (data.length > 0) {
						data.sort((a, b) => (a.name > b.name)? 1 : -1);
						// create the options and append to Select2
						var i = 0;
						for (; i < data.length; i++) {
							var option = new Option(data[i].name, data[i].id, true, true);
							categorySetSelect.append(option).trigger('change');
						}
						// manually trigger the 'select2:select' event
						categorySetSelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					}
				});
				modal.modal('show');
			});

			// submit category set modal button functionality
			$('#timaat-mediadatasets-modal-categoryset-submit').on('click', async function(event) {
				event.preventDefault();
				// console.log("TCL: submit category set list");
				var modal = $('#timaat-mediadatasets-medium-categorysets');
				if (!$('#mediumCategorySetsForm').valid())
					return false;
				var medium = modal.data('medium');
				// console.log("TCL: medium", medium);
				var formDataRaw = $('#mediumCategorySetsForm').serializeArray();
				// console.log("TCL: formDataRaw", formDataRaw);
				var i = 0;
				var categorySetIdList = [];
				var newCategorySetList = [];
				for (; i < formDataRaw.length; i++) {
					if (isNaN(Number(formDataRaw[i].value))) {
						newCategorySetList.push( { id: 0, name: formDataRaw[i].value} ); // new category sets that have to be added to the system first
					} else {
						categorySetIdList.push( {id: formDataRaw[i].value} );
					}
				}
				medium.model = await TIMAAT.MediumDatasets.updateMediumHasCategorySetsList(medium.model, categorySetIdList);
				if (newCategorySetList.length > 0) {
					var updatedMediumModel = await TIMAAT.MediumDatasets.addCategorySetsToMedium(medium.model, newCategorySetList);
					// console.log("TCL: updatedMediumModel", updatedMediumModel);
					medium.model.categorySets = updatedMediumModel.categorySets;
				}
				$('#medium-metadata-form').data('medium', medium);
				modal.modal('hide');
			});

			// category button handler
			$('#medium-datasheet-form-category-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#timaat-mediadatasets-medium-categories');
				modal.data('medium', $('#medium-metadata-form').data('medium'));
				var medium = modal.data('medium');
				modal.find('.modal-body').html(`
					<form role="form" id="mediumCategoriesForm">
						<div class="form-group">
							<!-- <label for="medium-categories-multi-select-dropdown">Medium categories</label> -->
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="medium-categories-multi-select-dropdown"
												name="categoryId"
												data-role="categoryId"
												data-placeholder="Select medium categories"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
				$('#medium-categories-multi-select-dropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: true,
					allowClear: true,
					minimumResultsForSearch: 10,
					ajax: {
						url: 'api/medium/'+medium.model.id+'/category/selectList/',
						// url: 'api/category/selectList/',
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
						cache: false
					},
					minimumInputLength: 0,
				});
				TIMAAT.MediumService.getSelectedCategories(medium.model.id).then(function(data) {
					// console.log("TCL: then: data", data);
					var categorySelect = $('#medium-categories-multi-select-dropdown');
					if (data.length > 0) {
						data.sort((a, b) => (a.name > b.name)? 1 : -1);
						// create the options and append to Select2
						var i = 0;
						for (; i < data.length; i++) {
							var option = new Option(data[i].name, data[i].id, true, true);
							categorySelect.append(option).trigger('change');
						}
						// manually trigger the 'select2:select' event
						categorySelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					}
				});
				modal.modal('show');
			});

			// submit category modal button functionality
			$('#timaat-mediadatasets-modal-category-submit').on('click', async function(event) {
				event.preventDefault();
				// console.log("TCL: submit category list");
				var modal = $('#timaat-mediadatasets-medium-categories');
				if (!$('#mediumCategoriesForm').valid())
					return false;
				var medium = modal.data('medium');
				// console.log("TCL: medium", medium);
				var formDataRaw = $('#mediumCategoriesForm').serializeArray();
				// console.log("TCL: formDataRaw", formDataRaw);
				var i = 0;
				var categoryIdList = [];
				var newCategoryList = [];
				for (; i < formDataRaw.length; i++) {
					if (isNaN(Number(formDataRaw[i].value))) {
						newCategoryList.push( { id: 0, name: formDataRaw[i].value} ); // new categories that have to be added to the system first
					} else {
						categoryIdList.push( {id: formDataRaw[i].value} );
					}
				}
				medium.model = await TIMAAT.MediumDatasets.updateMediumHasCategoriesList(medium.model, categoryIdList);
				if (newCategoryList.length > 0) {
					var updatedMediumModel = await TIMAAT.MediumDatasets.addCategoriesToMedium(medium.model, newCategoryList);
					// console.log("TCL: updatedMediumModel", updatedMediumModel);
					medium.model.categories = updatedMediumModel.categories;
				}
				$('#medium-metadata-form').data('medium', medium);
				modal.modal('hide');
			});

			// tag button handler
			$('#medium-datasheet-form-tag-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#timaat-mediadatasets-medium-tags');
				modal.data('medium', $('#medium-metadata-form').data('medium'));
				var medium = modal.data('medium');
				modal.find('.modal-body').html(`
					<form role="form" id="mediumTagsForm">
						<div class="form-group">
							<label for="medium-tags-multi-select-dropdown">Medium tags</label>
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="medium-tags-multi-select-dropdown"
												name="tagId"
												data-role="tagId"
												data-placeholder="Select medium tags"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
        $('#medium-tags-multi-select-dropdown').select2({
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
						cache: false
					},
					minimumInputLength: 0,
				});
				await TIMAAT.MediumService.getTagList(medium.model.id).then(function(data) {
					// console.log("TCL: then: data", data);
					var tagSelect = $('#medium-tags-multi-select-dropdown');
					if (data.length > 0) {
						data.sort((a, b) => (a.name > b.name)? 1 : -1);
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
				modal.modal('show');
			});

			// submit tag modal button functionality
			$('#timaat-mediadatasets-modal-tag-submit').on('click', async function(event) {
				event.preventDefault();
				var modal = $('#timaat-mediadatasets-medium-tags');
				if (!$('#mediumTagsForm').valid())
					return false;
				var medium = modal.data('medium');
				var formDataRaw = $('#mediumTagsForm').serializeArray();
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
				medium.model = await TIMAAT.MediumDatasets.updateMediumHasTagsList(medium.model, tagIdList);
				if (newTagList.length > 0) {
					var updatedMediumModel = await TIMAAT.MediumDatasets.createNewTagsAndAddToMedium(medium.model, newTagList);
					// console.log("TCL: updatedMediumModel", updatedMediumModel);
					medium.model.tags = updatedMediumModel.tags;
				}
				$('#medium-metadata-form').data('medium', medium);
				modal.modal('hide');
			});

			$('#timaat-mediadatasets-metadata-type-id').on('change', function(event) {
				event.stopPropagation();
				let type = $('#timaat-mediadatasets-metadata-type-id').find('option:selected').html();
				TIMAAT.MediumDatasets.initFormDataSheetData(type);
			});

			// upload button handler
			$('.datasheet-form-upload-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				let medium = $('#medium-metadata-form').data('medium');
				let type = medium.model.mediaType.mediaTypeTranslations[0].type;
				medium = new TIMAAT.Medium(medium.model, type);
				medium.listView.find('.timaat-medium-upload-file').click();
			});

			// file upload success event handler
			$(document).on('success.upload.medium.TIMAAT', async function(event, uploadedMedium) {
      	// console.log("TCL: Medium -> constructor -> event, uploadedMedium", event, uploadedMedium);
				if ( !uploadedMedium ) return;
				var medium = $('#medium-metadata-form').data('medium');
				if ( medium == undefined || medium.model.id != uploadedMedium.id ) return;
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;
				medium.model.fileStatus = await TIMAAT.MediumService.updateFileStatus(medium.model, type);
				medium.model.viewToken = await TIMAAT.MediumService.updateViewToken(medium.model);
				// console.log("TCL: (document).one('success.upload.medium.TIMAAT') for id: ", uploadedMedium.id);
				// console.log("TCL: uploadedMedium.fileStatus", uploadedMedium.fileStatus);
				if ( event.type == 'success' ) {
					switch (type) {
						case 'audio':
							medium.model.mediumAudio.length = uploadedMedium.mediumAudio.length;
							if ($('#medium-tab').hasClass('active')) {
								await TIMAAT.UI.refreshDataTable('medium');
							} else {
								await TIMAAT.UI.refreshDataTable('audio');
							}
						break;
						case 'image':
							medium.model.mediumImage.width = uploadedMedium.mediumImage.width;
							medium.model.mediumImage.height = uploadedMedium.mediumImage.height;
							// medium.model.mediumImage.bitDepth = uploadedMedium.mediumImage.bitDepth; // TODO
							if ($('#medium-tab').hasClass('active')) {
								await TIMAAT.UI.refreshDataTable('medium');
							} else {
								await TIMAAT.UI.refreshDataTable('image');
							}
						break;
						case 'video':
							medium.model.mediumVideo.width = uploadedMedium.mediumVideo.width;
							medium.model.mediumVideo.height = uploadedMedium.mediumVideo.height;
							medium.model.mediumVideo.length = uploadedMedium.mediumVideo.length;
							medium.model.mediumVideo.frameRate = uploadedMedium.mediumVideo.frameRate;
							if ($('#medium-tab').hasClass('active')) {
								await TIMAAT.UI.refreshDataTable('medium');
							} else {
								await TIMAAT.UI.refreshDataTable('video');
							}
						break;
					}
				}
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				if (TIMAAT.UI.subNavTab == 'preview') {
					TIMAAT.UI.displayDataSetContent('preview', medium, 'medium');
				} else {
					TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');
				}
			});

			// annotate button handler
			$('.medium-datasheet-form-annotate-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var medium = $('#medium-metadata-form').data('medium');
				TIMAAT.UI.showComponent('videoplayer');
				// setup video in player
				TIMAAT.VideoPlayer.setupMedium(medium.model);
				// load video annotations from server
				let analysisLists = await TIMAAT.AnalysisListService.getMediumAnalysisLists(medium.model.id);
				await TIMAAT.VideoPlayer.setupMediumAnalysisLists(analysisLists);
				TIMAAT.VideoPlayer.loadAnalysisList(0);
			});

			// data table events
			$('.mediadataset-table').on('page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			// Key press events
			$('#medium-metadata-form-submit-button').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#medium-metadata-form-submit-button').trigger('click');
				}
			});

			$('#medium-metadata-form-dismiss-button').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#medium-metadata-form-dismiss-button').trigger('click');
				}
			});

		},

		initTitles: function() {
			$('#medium-tab-titles').on('click', function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				let type = medium.model.mediaType.mediaTypeTranslations[0].type;
				let name = medium.model.displayTitle.name;
				let id = medium.model.id;
				TIMAAT.UI.displayDataSetContentArea('medium-titles-form');
				TIMAAT.MediumDatasets.setMediumTitleList(medium);
				TIMAAT.UI.displayDataSetContent('titles', medium, 'medium');
				if (type == 'medium') {
					TIMAAT.URLHistory.setURL(null, name + ' · Titles · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + id + '/titles');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Titles · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + type + '/' + id + '/titles');
				}
			});

			$(document).on('click', '.isOriginalTitle', function(event) {
        if ($(this).data('wasChecked') == true)
        {
          $(this).prop('checked', false);
					// $(this).data('wasChecked', false);
					$('input[name="isOriginalTitle"]').data('wasChecked', false);
        }
        else {
					$('input[name="isOriginalTitle"]').data('wasChecked', false);
					$(this).data('wasChecked', true);
				}
			});

			// Add title button click
			$(document).on('click','[data-role="medium-new-title-fields"] > .form-group [data-role="add"]', function(event) {
				event.preventDefault();
				// console.log("TCL: add title to list");
				var listEntry = $(this).closest('[data-role="medium-new-title-fields"]');
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
				if (!$('#medium-titles-form').valid())
					return false;
				if (title != '' && languageId != null) {
					var titlesInForm = $('#medium-titles-form').serializeArray();
					// console.log("TCL: titlesInForm", titlesInForm);
					var numberOfTitleElements = 2;
					var indexName = titlesInForm[titlesInForm.length-numberOfTitleElements-1].name; // find last used indexed name
					var indexString = indexName.substring(indexName.lastIndexOf("[") + 1, indexName.lastIndexOf("]"));
					var i = Number(indexString)+1;
          // console.log("i", i);
					$('#medium-dynamic-title-fields').append(
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
									<input class="form-check-input isOriginalTitle" type="radio" name="isOriginalTitle" data-role="originalTitle" data-wasChecked="false" placeholder="Is Original Title">
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
												id="medium-new-title-language-select-dropdown_`+i+`"
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
					$('#medium-new-title-language-select-dropdown_'+i).select2({
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
							cache: false
						},
						minimumInputLength: 0,
					});
					var languageSelect = $('#medium-new-title-language-select-dropdown_'+i);
					var option = new Option(languageName, languageId, true, true);
					languageSelect.append(option).trigger('change');
					$('input[name="newTitle['+i+']"]').rules('add', { required: true, minlength: 3, maxlength: 200, });
					$('input[data-role="newTitle['+i+']"]').attr('value', TIMAAT.MediumDatasets.replaceSpecialCharacters(title));
					$('#medium-title-language-select-dropdown').empty();
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
			$(document).on('click','[data-role="medium-dynamic-title-fields"] > .form-group [data-role="remove"]', function(event) {
				event.preventDefault();
				var isDisplayTitle = $(this).closest('.form-group').find('input[name=isDisplayTitle]:checked').val();
				if (isDisplayTitle == "on") {
					// TODO modal informing that display title entry cannot be deleted
					console.info("CANNOT DELETE DISPLAY TITLE");
				}
				else {
					// TODO consider undo function or popup asking if user really wants to delete a title
					console.log("DELETE TITLE ENTRY");
					$(this).closest('.form-group').remove();
				}
			});

			// Submit medium titles button functionality
			$('#medium-titles-form-submit').on('click', async function(event) {
				// console.log("TCL: Titles form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("medium-new-title-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild);
				};
				// test if form is valid
				if (!$('#medium-titles-form').valid()) {
					$('[data-role="medium-new-title-fields"]').append(TIMAAT.MediumDatasets.titleFormTitleToAppend());
					this.getTitleFormLanguageDropdownData();
					return false;
				}
				// console.log("TCL: Titles form: valid");

				// the original medium model (in case of editing an existing medium)
				var medium = $('#medium-titles-form').data("medium");
				var type = medium.model.mediaType.mediaTypeTranslations[0].type;
        // console.log("TCL: type", type);

				// Create/Edit medium window submitted data
				var formData = $('#medium-titles-form').serializeArray();
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
							element.title = TIMAAT.MediumDatasets.replaceSpecialCharacters(formData[i+2].value);
							element.titleLanguageId = formData[i+3].value;
							i = i+4;
						} else { // display title set, original title not set
							element.isOriginalTitle = false;
							element.title = TIMAAT.MediumDatasets.replaceSpecialCharacters(formData[i+1].value);
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						}
					} else { // display title not set, original title set
						element.isDisplayTitle = false;
						if (formData[i].name == 'isOriginalTitle' && formData[i].value == 'on' ) {
							element.isOriginalTitle = true;
							element.title = TIMAAT.MediumDatasets.replaceSpecialCharacters(formData[i+1].value);
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						} else {
							// display title not set, original title not set
							element.isOriginalTitle = false;
							element.title = TIMAAT.MediumDatasets.replaceSpecialCharacters(formData[i].value);
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
						// console.log("TCL: update existing titles");
						// only update if anything changed
						if (title != medium.model.titles[i]) {
							await TIMAAT.MediumDatasets.updateTitle(title, medium);
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
							await TIMAAT.MediumDatasets.updateMedium(type, medium);
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
							// console.log("TCL: update existing titles (and add new ones)");
							await TIMAAT.MediumDatasets.updateTitle(title, medium);
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
					// console.log("TCL: (update existing titles and) add new ones");
					await TIMAAT.MediumDatasets.addTitles(medium, newTitles);
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
							await TIMAAT.MediumDatasets.updateMedium(type, medium);
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
							// console.log("TCL: update existing titles (and delete obsolete ones)");
							await TIMAAT.MediumDatasets.updateTitle(title, medium);
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
							await TIMAAT.MediumDatasets.updateMedium(type, medium);
						}
					};
					var i = medium.model.titles.length - 1;
					for (; i >= formTitleList.length; i-- ) { // remove obsolete titles
						if (medium.model.originalTitle != null && medium.model.originalTitle.id == medium.model.titles[i].id) {
							medium.model.originalTitle = null;
							// console.log("TCL: remove originalTitle before deleting title");
							await TIMAAT.MediumDatasets.updateMedium(type, medium);
						}
						// console.log("TCL: (update existing titles and) delete obsolete ones");
						TIMAAT.MediumService.removeTitle(medium.model.titles[i]);
						medium.model.titles.pop();
					}
				}
				// console.log("TCL: show medium title form");
				if ($('#medium-tab').hasClass('active')) {
					await TIMAAT.UI.refreshDataTable('medium');
				} else {
					await TIMAAT.UI.refreshDataTable(type);
				}
				// TIMAAT.UI.addSelectedClassToSelectedItem(type, medium.model.id); // is done in displayDataSetContent
				TIMAAT.UI.displayDataSetContent('titles', medium, 'medium');
			});

			// Cancel add/edit button in titles form functionality
			$('#medium-titles-form-dismiss').on('click', function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				TIMAAT.UI.displayDataSetContent('titles', medium, 'medium');
			});

			// Key press events
			$('#medium-titles-form-submit').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#medium-titles-form-submit').trigger('click');
				}
			});

			$('#medium-titles-form-dismiss').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#medium-titles-form-dismiss').trigger('click');
				}
			});

			$('#medium-dynamic-title-fields').on('keypress', function(event) {
				// event.stopPropagation();
				if (event.which == '13') { // == enter
					event.preventDefault(); // prevent activating delete button when pressing enter in a field of the row
				}
			});

			$('#medium-new-title-fields').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					event.preventDefault();
					$('#medium-new-title-fields').find('[data-role="add"]').trigger('click');
				}
			});
		},

		initLanguageTracks: function() {
			// languagetrack tab click handling
			$('#medium-tab-languagetracks').on('click', function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				let type = medium.model.mediaType.mediaTypeTranslations[0].type;
				let name = medium.model.displayTitle.name;
				let id = medium.model.id;
				TIMAAT.UI.displayDataSetContentArea('medium-languagetracks-form');
				TIMAAT.MediumDatasets.setMediumLanguageTrackList(medium);
				TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium');
				if (type == 'medium') {
					TIMAAT.URLHistory.setURL(null, name + ' · Languages · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + id + '/languages');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Languages · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + type + '/' + id + '/languages');
				}
			});

			// Add languageTrack button click
			$(document).on('click','[data-role="medium-new-languagetrack-fields"] > .form-group [data-role="add"]', async function(event) {
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="medium-new-languagetrack-fields"]');
				var mediumLanguageTypeId = listEntry.find('[data-role="languageTrackTypeId"]').val();
				var languageId = listEntry.find('[data-role="languageTrackLanguageId"]').val();
				var languageName = listEntry.find('[data-role="languageTrackLanguageId"]').text();
				// if (!$('#medium-languagetracks-form').valid()) return false;
				if (mediumLanguageTypeId != null && languageId != null) {
					var medium = $('#medium-metadata-form').data('medium');
					var languageTracksInForm = $('#medium-languagetracks-form').serializeArray();
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
						$('#medium-dynamic-languagetrack-fields').append(
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
								cache: false
							},
							minimumInputLength: 0,
						});
						var languageSelect = $('#new-languagetrack-language-select-dropdown_'+i);
						var option = new Option(languageName, languageId, true, true);
						languageSelect.append(option).trigger('change');
						$('[data-role="languageTrackTypeId['+i+']"]').find('option[value='+mediumLanguageTypeId+']').attr('selected', true);
						$('select[name="languageTrackTypeId['+i+']"]').rules('add', { required: true });
						listEntry.find('[data-role="languageTrackTypeId"]').val('');
						listEntry.find('[data-role="languageTrackLanguageId"]').val('');
						await TIMAAT.MediumDatasets.addLanguageTrack(medium, newTrackEntry);
						// medium.updateUI();
						TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium', 'edit');
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
			$(document).on('click','[data-role="medium-dynamic-languagetrack-fields"] > .form-group [data-role="remove"]', async function(event) {
				event.preventDefault();
				var entry = $(this).closest('.form-group').attr('data-id');
				var medium = $('#medium-metadata-form').data('medium');
				var listEntry = $(this).closest('[data-role="medium-dynamic-languagetrack-fields"]');
				var mediumLanguageTypeId = listEntry.find('[name="languageTrackTypeId['+entry+']"]').val();
				var languageId = listEntry.find('[name="languageTrackLanguageId['+entry+']"]').val();
				var i = 0;
				for (; i< medium.model.mediumHasLanguages.length; i++) {
					if (medium.model.mediumHasLanguages[i].id.languageId == languageId
						&& medium.model.mediumHasLanguages[i].id.mediumLanguageTypeId == mediumLanguageTypeId) {
						await TIMAAT.MediumService.removeLanguageTrack(medium.model.mediumHasLanguages[i]);
						medium.model.mediumHasLanguages.splice(i,1);
						break;
					}
				}
				TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium', 'edit');
			});

			// Done button in languageTracks form functionality
			$('#medium-languagetracks-form-done').click( function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium');
			});

		},

		initActorRoles: function() {
			$('#medium-tab-actorwithroles').on('click', function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				let type = medium.model.mediaType.mediaTypeTranslations[0].type;
				let name = medium.model.displayTitle.name;
				let id = medium.model.id;
				TIMAAT.UI.displayDataSetContentArea('medium-actorwithroles-form');
				TIMAAT.UI.displayDataSetContent('actorWithRoles', medium, 'medium');
				if ( type == 'medium') {
					TIMAAT.URLHistory.setURL(null, name + ' · Actors with Roles · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + id + '/actorsWithRoles');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Actors with Roles · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + type + '/' + id + '/actorsWithRoles');
				}
			});

			// add actorwithroles button click
			$(document).on('click','[data-role="medium-new-actorwithrole-fields"] > .form-group [data-role="add"]', async function(event) {
				// console.log("TCL: add new actor with role(s)");
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="medium-new-actorwithrole-fields"]');
				var newFormEntry = [];
				if (listEntry.find('select').each(function(){
					newFormEntry.push($(this).val());
				}));
				// var newEntryId = newFormEntry[0];
				// console.log("TCL: newFormEntry", newFormEntry);

				if (!$('#medium-actorwithroles-form').valid() || newFormEntry[1].length == 0) //! temp solution to prevent adding actors without roles
				// if (!$('#medium-actorwithroles-form').valid())
				return false;

				$('.disable-on-submit').prop('disabled', true);
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', false);
				var existingEntriesInForm = $('#medium-actorwithroles-form').serializeArray();
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', true);
				$('.disable-on-submit').prop('disabled', false);
				// console.log("TCL: existingEntriesInForm", existingEntriesInForm);

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
						// console.log("TCL: duplicate entry found");
						break;
					}
					// console.log("TCL: newEntryId", newEntryId);
					// console.log("TCL: existingEntriesIdList[i]", existingEntriesIdList[i]);
					i++;
				}

				if (!duplicate) {
					// var newActorId = newFormEntry[0];
					var newActorSelectData = $('#mediumhasactorwithrole-actorid').select2('data');
					var newActorId = newActorSelectData[0].id;
          console.log("TCL: $ -> newActorId", newActorId);
					var newRoleSelectData = $('#medium-actorwithroles-multi-select-dropdown').select2('data');
					// var actorHasRoleIds = newFormEntry[1];
					$('#medium-dynamic-actorwithrole-fields').append(TIMAAT.MediumDatasets.appendActorWithRolesDataset(existingEntriesIdList.length, newActorId));
					TIMAAT.MediumDatasets.getMediumHasActorWithRoleData(newActorId);
					// select actor for new entry
					await TIMAAT.ActorService.getActor(newActorId).then(function (data) {
            console.log("TCL: newActorId", newActorId);
						var actorSelect = $('#mediumhasactorwithrole-actorid-'+newActorId);
						// console.log("TCL: actorSelect", actorSelect);
						// console.log("TCL: then: data", data);
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
					TIMAAT.MediumDatasets.getMediumHasActorWithRolesDropdownData(newActorId);

					var roleSelect = $('#medium-actorwithroles-multi-select-dropdown-'+newActorId);
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
					$('#medium-actorwithroles-multi-select-dropdown').val(null).trigger('change');
					// $('#medium-actorwithroles-multi-select-dropdown').prop('required', true);
				}
				else { // duplicate actor
					$('#timaat-mediadatasets-actorwithrole-duplicate').modal('show');
				}
			});

			// remove actorwithroles button click
			$(document).on('click','[data-role="medium-dynamic-actorwithrole-fields"] > .form-group [data-role="remove"]', async function(event) {
				// console.log("TCL: remove actor with role(s)");
				event.preventDefault();
				$(this).closest('.form-group').remove();
			});

			// submit actorwithroles button functionality
			$('#medium-actorwithroles-form-submit').on('click', async function(event) {
				// console.log("TCL: ActorWithRole form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("medium-new-actorwithrole-fields");
				while (node.lastChild) {
					node.removeChild(node.lastChild);
				}

				//! temp solution to prevent adding actors without roles
				//TODO

				// test if form is valid
				if (!$('#medium-actorwithroles-form').valid()) {
					$('[data-role="medium-new-actorwithrole-fields"]').append(this.appendNewActorHasRolesField());
					return false;
				}

				var medium = $('#medium-metadata-form').data('medium');

				// Create/Edit actor window submitted data
				$('.disable-on-submit').prop('disabled', true);
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', false);
				var formDataRaw = $('#medium-actorwithroles-form').serializeArray();
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', true);
				$('.disable-on-submit').prop('disabled', false);
				// console.log("TCL: formDataRaw", formDataRaw);

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
				// console.log("TCL: Actor Ids in form", formEntryIds);
				// create actor id list for all already existing roles
				i = 0;
				var actorList = await TIMAAT.MediumService.getActorList(medium.model.id);
        // console.log("TCL: Actors of current Medium", actorList);
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
						// console.log("TCL: Actor removed: REMOVE medium has actor (with all roles) datasets:", medium.model.id, existingEntriesIdList[i]);
						await TIMAAT.MediumService.removeActorFromMediumHasActorWithRoles(medium.model.id, existingEntriesIdList[i]);
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
						var roleSelectData = $('#medium-actorwithroles-multi-select-dropdown-'+formEntryIds[i]).select2('data');
						// console.log("TCL: roleSelectData", roleSelectData);
						var k = 0;
						for (; k < roleSelectData.length; k++) {
							// console.log("TCL: New Actor: ADD medium has actor with role dataset: ", medium.model.id, formEntryIds[i], Number(roleSelectData[k].id));
							await TIMAAT.MediumService.addMediumHasActorWithRoles(medium.model.id, formEntryIds[i], Number(roleSelectData[k].id));
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
					var existingRoles = await TIMAAT.MediumService.getActorHasRoleList(medium.model.id, existingEntriesIdList[i]);
          // console.log("TCL: existingRoles", existingRoles);
					var existingRoleIds = [];
					var j = 0;
					for (; j < existingRoles.length; j++) {
						existingRoleIds.push(existingRoles[j].id);
					}
					// console.log("TCL: existing role ids for the current actor", existingRoleIds);
					var roleSelectData = $('#medium-actorwithroles-multi-select-dropdown-'+existingEntriesIdList[i]).select2('data');
					// console.log("TCL: roleSelectData", roleSelectData);
					if (roleSelectData == undefined) {
						roleSelectData = [];
					}
					var roleSelectIds = [];
					j = 0;
					for (; j < roleSelectData.length; j++) {
						roleSelectIds.push(Number(roleSelectData[j].id));
					}
					// console.log("TCL: form role ids for the current actor: ", roleSelectIds);
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
							// console.log("TCL: role removed: REMOVE medium has actor with role dataset: ", medium.model.id, existingEntriesIdList[i], existingRoleIds[j]);
							await TIMAAT.MediumService.removeRoleFromMediumHasActorWithRoles(medium.model.id, existingEntriesIdList[i], existingRoleIds[j]);
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
							// console.log("TCL: role added: ADD medium has actor with role dataset: ", medium.model.id, existingEntriesIdList[i], roleSelectIds[j]);
							await TIMAAT.MediumService.addMediumHasActorWithRoles(medium.model.id, existingEntriesIdList[i], roleSelectIds[j]);
							roleSelectIds.splice(j,1);
							// console.log("TCL: roleSelectIds", roleSelectIds);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					// no UPDATE as medium-actor-role table only has ids and no information stored
				}
				medium.model = await TIMAAT.MediumService.getMedium(medium.model.id);
				// medium.updateUI();
				TIMAAT.UI.displayDataSetContent('actorWithRoles', medium, 'medium');
			});

			// cancel add/edit button in titles form functionality
			$('#medium-actorwithroles-form-dismiss').on('click', function(event) {
				let medium = $('#medium-metadata-form').data('medium');
				TIMAAT.UI.displayDataSetContent('actorWithRoles', medium, 'medium');
			});

		},

		load: function() {
			this.loadMedia();
			this.loadMediaTypes();
			// this.setAudioList();
			// this.setDocumentList();
			// this.setImageList();
			// this.setSoftwareList();
			// this.setTextList();
			// this.setVideoList();
			// this.setVideogameList();
		},

		loadMediaTypes: function() {
			TIMAAT.MediumService.listMediumTypes(this.setMediumTypeList);
		},

		loadMedia: function() {
			$('#medium-metadata-form').data('type', 'medium');
			$('#mediumVideoPreview').get(0).pause();
			this.setMediumList();
			TIMAAT.UI.addSelectedClassToSelectedItem('medium', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
		},

		loadMediaDataTables: async function() {
			this.setupMediaDataTable();
			this.setupAudioDataTable();
			this.setupDocumentDataTable();
			this.setupImageDataTable();
			this.setupSoftwareDataTable();
			this.setupTextDataTable();
			this.setupVideoDataTable();
			this.setupVideogameDataTable();
		},

		loadMediumSubtype: function(type) {
    	// console.log("TCL: $ -> type", type);
			$('#medium-metadata-form').data('type', type);
			$('#mediumVideoPreview').get(0).pause();
			TIMAAT.UI.addSelectedClassToSelectedItem(type, null);
			TIMAAT.UI.subNavTab = 'dataSheet';
			this.showAddMediumButton();
			// TIMAAT.UI.clearLastSelection(type);
			switch (type) {
				case 'audio':
					this.setAudioList();
				break;
				case 'document':
					this.setDocumentList();
				break;
				case 'image':
					this.setImageList();
				break;
				case 'software':
					this.setSoftwareList();
				break;
				case 'text':
					this.setTextList();
				break;
				case 'video':
					this.setVideoList();
				break;
				case 'videogame':
					this.setVideogameList();
				break;
			};
		},

		setMediumTypeList: function(mediaTypes) {
			// console.log("TCL: mediaTypes", mediaTypes);
			if ( !mediaTypes ) return;
			// setup model
			var medTypes = Array();
			mediaTypes.forEach(function(mediaType) {
				if ( mediaType.id > 0 )
					medTypes.push(new TIMAAT.MediumType(mediaType));
			});
			TIMAAT.MediumDatasets.mediaTypes = medTypes;
			TIMAAT.MediumDatasets.mediaTypes.model = mediaTypes;
		},

		setMediumList: function() {
			if ( this.media == null ) return;

			// set ajax data source
			if ( this.dataTableMedia ) {
				this.dataTableMedia.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('medium');
			}
			this.mediaLoaded = true;
		},

		setAudioList: function() {
			// console.log("TCL: setAudioList");
			if ( this.audios == null ) return;

			// set ajax data source
			if ( this.dataTableAudio ) {
				this.dataTableAudio.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('audio');
			}
		},

		setDocumentList: function() {
			// console.log("TCL: setDocumentList");
			if ( this.documents == null ) return;

			// set ajax data source
			if ( this.dataTableDocument ) {
				this.dataTableDocument.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('document');
		}
		},

		setImageList: function() {
			// console.log("TCL: setImageList");
			if ( this.images == null ) return;

			// set ajax data source
			if ( this.dataTableImage ) {
				this.dataTableImage.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('image');
			}
		},

		setSoftwareList: function() {
			// console.log("TCL: setSoftwareList");
			if ( this.softwares == null ) return;

			// set ajax data source
			if ( this.dataTableSoftware ) {
				this.dataTableSoftware.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('software');
		}
		},

		setTextList: function() {
			// console.log("TCL: setTextList");
			if ( this.texts == null ) return;

			// set ajax data source
			if ( this.dataTableText ) {
				this.dataTableText.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('text');
			}
		},

		setVideoList: function() {
			// console.log("TCL: setVideoList");
			if ( this.videos == null ) return;

			if ( this.dataTableVideo ) {
				this.dataTableVideo.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('video');
		}
		},

		setVideogameList: function() {
			// console.log("TCL: setVideogameList");
			if ( this.videogames == null ) return;

			// set ajax data source
			if ( this.dataTableVideogame ) {
				this.dataTableVideogame.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('videogame');
			}
		},

		setMediumTitleList: function(medium) {
			// console.log("TCL: setMediumTitleList -> medium", medium);
			if ( !medium ) return;
			// setup model
			var mediumTitles = Array();
			medium.model.titles.forEach(function(title) {
				if ( title.id > 0 )
					mediumTitles.push(title);
			});
			this.titles = mediumTitles;
		},

		setMediumLanguageTrackList: function(medium) {
			// console.log("TCL: setMediumLanguageTrackList -> medium", medium);
			if ( !medium ) return;
			// setup model
			var mediumLanguageTracks = Array();
			medium.model.mediumHasLanguages.forEach(function(languageTrack) {
				if ( languageTrack.mediumId > 0 )
					mediumLanguageTracks.model.mediumHasLanguages.push(languageTrack);
			});
		},

		addMedium: function(type) {
			// console.log("TCL: addMedium: type", type);
			TIMAAT.UI.displayDataSetContentContainer('medium-tab-metadata', 'medium-metadata-form');
			$('.add-medium-button').hide();
			$('.add-medium-button').prop('disabled', true);
			$('.add-medium-button :input').prop('disabled', true);
			$('#medium-metadata-form').data('type', type);
			$('#medium-metadata-form').data('medium', null);
			$('#medium-displayTitle-language-select-dropdown').empty().trigger('change');
			mediumFormMetadataValidator.resetForm();
			$('#mediumVideoPreview').get(0).pause();

			TIMAAT.UI.addSelectedClassToSelectedItem(type, null);
			TIMAAT.UI.subNavTab = 'dataSheet';
			$('#medium-metadata-form').trigger('reset');

			// setup form
			this.initFormDataSheetData(type);
			this.getMediumFormTitleLanguageDropdownData();
			this.initFormDataSheetForEdit();
			$('#medium-metadata-form-submit-button').html('Add');
			$('#mediumFormHeader').html("Add "+type);
			$('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', true);
			// $('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', false);
		},

		mediumFormDataSheet: async function(action, type, data) {
			// console.log("TCL: action, type, data", action, type, data);
			// TIMAAT.UI.addSelectedClassToSelectedItem(type, data.model.id);
			$('#medium-metadata-form').trigger('reset');
			this.initFormDataSheetData(type);
			mediumFormMetadataValidator.resetForm();
			$('#mediumVideoPreview').get(0).pause();

			this.getMediumFormTitleLanguageDropdownData();
			var languageSelect = $('#medium-displayTitle-language-select-dropdown');
			var option = new Option(data.model.displayTitle.language.name, data.model.displayTitle.language.id, true, true);
			languageSelect.append(option).trigger('change');

			if ( action == 'show' ) {
				$('#medium-metadata-form :input').prop('disabled', true);
				$('.form-buttons').prop('disabled', false);
				$('.form-buttons :input').prop('disabled', false);
				$('.form-buttons').show();
				this.initFormForShow(data.model);
				$('#medium-metadata-form-submit-button').hide();
				$('#medium-metadata-form-dismiss-button').hide();
				$('#mediumFormHeader').html(type+" Data Sheet (#"+ data.model.id+')');
				$('#medium-displayTitle-language-select-dropdown').select2('destroy').attr("readonly", true);
			}
			else if ( action == 'edit' ) {
				this.initFormDataSheetForEdit();
				this.disableReadOnlyDataFields(true);
				$('.add-medium-button').hide();
				$('.add-medium-button').prop('disabled', true);
				$('.add-medium-button :input').prop('disabled', true);
				$('#medium-metadata-form-submit-button').html('Save');
				$('#mediumFormHeader').html("Edit "+type);
			}

			// setup UI
			// medium data
			$('#timaat-mediadatasets-metadata-medium-type-id').val(data.model.mediaType.id);
			$('#timaat-mediadatasets-metadata-medium-copyright').val(data.model.copyright);
			$('#timaat-mediadatasets-metadata-medium-remark').val(data.model.remark);
			if (data.model.releaseDate != null && !(isNaN(data.model.releaseDate)))
				$('#timaat-mediadatasets-metadata-medium-releasedate').val(moment.utc(data.model.releaseDate).format('YYYY-MM-DD'));
				else $('#timaat-mediadatasets-metadata-medium-releasedate').val('');
			if (data.model.recordingStartDate != null && !(isNaN(data.model.recordingStartDate)))
				$('#timaat-mediadatasets-metadata-medium-recordingstartdate').val(moment.utc(data.model.recordingStartDate).format('YYYY-MM-DD'));
				else $('#timaat-mediadatasets-metadata-medium-recordingstartdate').val('');
			if (data.model.recordingEndDate != null && !(isNaN(data.model.recordingEndDate)))
				$('#timaat-mediadatasets-metadata-medium-recordingenddate').val(moment.utc(data.model.recordingEndDate).format('YYYY-MM-DD'));
				else $('#timaat-mediadatasets-metadata-medium-recordingenddate').val('');
			// display-title data
			$('#timaat-mediadatasets-metadata-medium-title').val(data.model.displayTitle.name);
			// source data
			if (data.model.sources[0].isPrimarySource)
				$('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', true);
				else $('#timaat-mediadatasets-metadata-medium-source-isprimarysource').prop('checked', false);
			$('#timaat-mediadatasets-metadata-medium-source-url').val(data.model.sources[0].url);
			if (data.model.sources[0].lastAccessed != null && !(isNaN(data.model.sources[0].lastAccessed)))
				$('#timaat-mediadatasets-metadata-medium-source-lastaccessed').val(moment.utc(data.model.sources[0].lastAccessed).format('YYYY-MM-DD HH:mm'));
				else $('#timaat-mediadatasets-metadata-medium-source-lastaccessed').val('');
			if (data.model.sources[0].isStillAvailable)
				$('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', true);
				else $('#timaat-mediadatasets-metadata-medium-source-isstillavailable').prop('checked', false);

			// medium subtype specific data
			switch (type) {
				case 'audio':
					$('#timaat-mediadatasets-metadata-audio-length').val(TIMAAT.Util.formatTime(data.model.mediumAudio.length));
					if (data.model.mediumAudio.audioPostProduction) {
						$('#timaat-mediadatasets-metadata-audio-audio-post-production-overdubbing').val(data.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].overdubbing);
						$('#timaat-mediadatasets-metadata-audio-audio-post-production-reverb').val(data.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].reverb);
						$('#timaat-mediadatasets-metadata-audio-audio-post-production-delay').val(data.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].delay);
						$('#timaat-mediadatasets-metadata-audio-audio-post-production-panning').val(data.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].panning);
						$('#timaat-mediadatasets-metadata-audio-audio-post-production-bass').val(data.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].bass);
						$('#timaat-mediadatasets-metadata-audio-audio-post-production-treble').val(data.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0].treble);
					}
				break;
				case "mediumDocument":
				break;
				case 'image':
					$('#timaat-mediadatasets-metadata-image-width').val(data.model.mediumImage.width);
					$('#timaat-mediadatasets-metadata-image-height').val(data.model.mediumImage.height);
					// $('#timaat-mediadatasets-metadata-image-bitdepth').val(data.model.mediumImage.bitDepth);
				break;
				case 'software':
					$('#timaat-mediadatasets-metadata-software-version').val(data.model.mediumSoftware.version);
				break;
				case 'text':
					$('#timaat-mediadatasets-metadata-text-content').val(data.model.mediumText.content);
				break;
				case 'video':
					$('#timaat-mediadatasets-metadata-video-length').val(TIMAAT.Util.formatTime(data.model.mediumVideo.length));
					// $('#timaat-mediadatasets-metadata-video-videocodec').val(data.model.mediumVideo.videoCodec);
					$('#timaat-mediadatasets-metadata-video-width').val(data.model.mediumVideo.width);
					$('#timaat-mediadatasets-metadata-video-height').val(data.model.mediumVideo.height);
					$('#timaat-mediadatasets-metadata-video-framerate').val(data.model.mediumVideo.frameRate);
					// $('#timaat-mediadatasets-metadata-video-datarate').val(data.model.mediumVideo.dataRate);
					// $('#timaat-mediadatasets-metadata-video-totalbitrate').val(data.model.mediumVideo.totalBitrate);
					if (data.model.mediumVideo.isEpisode)
						$('#timaat-mediadatasets-metadata-video-isepisode').prop('checked', true);
					else $('#timaat-mediadatasets-metadata-video-isepisode').prop('checked', false);
				break;
				case 'videogame':
					if (data.model.mediumVideogame.isEpisode)
						$('#timaat-mediadatasets-metadata-videogame-isepisode').prop('checked', true);
					else $('#timaat-mediadatasets-metadata-videogame-isepisode').prop('checked', false);
				break;
			}
			$('#medium-metadata-form').data('medium', data);
		},

		mediumFormPreview: function(type, data) {
			// console.log("TCL: mediumFormPreview - type, data", type, data);
			// TIMAAT.UI.addSelectedClassToSelectedItem(type, data.model.id);
			$('#medium-preview-form').trigger('reset');
			// mediumFormMetadataValidator.resetForm();

			// handling if type is 'medium' and user is in all media view
			if (type == 'medium')	type = data.model.mediaType.mediaTypeTranslations[0].type;

			$('#medium-preview-form :input').prop('disabled', true);
			if ( data.model.fileStatus == 'noFile' || !data.model.fileStatus) {
				if (data.model.mediumVideo || data.model.mediumImage || data.model.mediumAudio ) {
					$('.datasheet-form-upload-button').prop('disabled', false);
					$('.datasheet-form-upload-button').show();
				}
				$('.medium-datasheet-form-annotate-button').hide();
				$('.medium-datasheet-form-annotate-button').prop('disabled', true);
				$('.video-preview').hide();
				$('.image-preview').show();
				switch (type) {
					case 'image':
						$('#mediumImagePreview').attr('src' , 'img/image-placeholder.png');
					break;
					default:
						$('#mediumImagePreview').attr('src' , 'img/preview-placeholder.png');
					break;
				}
			} else {
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				if (type == 'video' || type == 'image' || type == 'audio') {
					$('.medium-datasheet-form-annotate-button').prop('disabled', false);
					$('.medium-datasheet-form-annotate-button').show();
				} else {
					$('.medium-datasheet-form-annotate-button').hide();
					$('.medium-datasheet-form-annotate-button').prop('disabled', true);
				}
				switch (type) {
					case 'audio': // TODO check audio-preview functionality
						$('.video-preview').hide();
						$('.image-preview').hide();
						$('#mediumAudioPreview').attr('src', '/TIMAAT/api/medium/audio/'+data.model.id+'/download'+'?token='+data.model.viewToken);
						$('.audio-preview').show();
					break;
					case 'image':
						$('.audio-preview').hide();
						$('.video-preview').hide();
						$('#mediumImagePreview').attr('src', '/TIMAAT/api/medium/image/'+data.model.id+'/preview'+'?token='+data.model.viewToken);
						$('#mediumImagePreview').attr('title', data.model.displayTitle.name);
						$('#mediumImagePreview').attr('alt', data.model.displayTitle.name);
						$('.image-preview').show();
					break;
					case 'video':
						if ( data.model.fileStatus && data.model.fileStatus != 'ready' && data.model.fileStatus != 'transcoding' && data.model.fileStatus != 'waiting' ) {
							$('.video-preview').hide();
							$('#mediumImagePreview').attr('src', 'img/preview-placeholder.png');
							$('#mediumImagePreview').attr('title', 'placeholder');
							$('#mediumImagePreview').attr('alt', 'placeholder');
							$('.image-preview').show();
						} else {
							$('.audio-preview').hide();
							$('.image-preview').hide();
							$('#mediumVideoPreview').attr('src', '/TIMAAT/api/medium/video/'+data.model.id+'/download'+'?token='+data.model.viewToken);
							$('.video-preview').show();
						}
					break;
					default:
						$('#mediumImagePreview').attr('src', 'img/preview-placeholder.png');
					break;
				}
			}
			$('.mediadatasheet-form-delete-button').prop('disabled', false);
			$('.mediadatasheet-form-delete-button :input').prop('disabled', false);
			$('.mediadatasheet-form-delete-button').show();
			$('#mediumPreviewFormHeader').html(type+" Preview (#"+ data.model.id+')');
		},

		mediumFormTitles: function(action, medium) {
			// console.log("TCL: mediumFormTitles: (action, medium): ", action, medium);
			// TIMAAT.UI.addSelectedClassToSelectedItem(medium.model.mediaType.mediaTypeTranslations[0].type, medium.model.id);
			var node = document.getElementById("medium-dynamic-title-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			var node = document.getElementById("medium-new-title-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			$('#medium-titles-form').trigger('reset');
			mediumFormTitlesValidator.resetForm();
			$('#mediumVideoPreview').get(0).pause();

			// setup UI
			// display-title data
			var i = 0;
			var numTitles = medium.model.titles.length;
      // console.log("TCL: medium.model.titles", medium.model.titles);
			for (; i < numTitles; i++) {
				console.log("TCL: medium.model.titles[i].language.id", medium.model.titles[i].language.id);
				$('[data-role="medium-dynamic-title-fields"]').append(
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
												 data-wasChecked="true"
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
												id="medium-title-language-select-dropdown_`+medium.model.titles[i].id+`"
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
					$('#medium-title-language-select-dropdown_'+medium.model.titles[i].id).select2({
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
							cache: false
						},
						minimumInputLength: 0,
					});
					var languageSelect = $('#medium-title-language-select-dropdown_'+medium.model.titles[i].id);
					var option = new Option(medium.model.titles[i].language.name, medium.model.titles[i].language.id, true, true);
					languageSelect.append(option).trigger('change');

					if (medium.model.titles[i].id == medium.model.displayTitle.id) {
						$('[data-role="displayTitle['+medium.model.titles[i].id+']"]').prop('checked', true);
					}
					if (medium.model.originalTitle && medium.model.titles[i].id == medium.model.originalTitle.id) {
						$('[data-role="originalTitle['+medium.model.titles[i].id+']"]').prop('checked', true);
					}
					$('input[name="title['+i+']"]').rules("add", { required: true, minlength: 3, maxlength: 200, });
					$('input[data-role="title['+medium.model.titles[i].id+']"]').attr("value", TIMAAT.MediumDatasets.replaceSpecialCharacters(medium.model.titles[i].name));
			};

			if ( action == 'show') {
				$('#medium-titles-form :input').prop('disabled', true);
				this.initFormForShow(medium.model);
				$('#medium-titles-form-submit').hide();
				$('#medium-titles-form-dismiss').hide();
				$('[data-role="medium-new-title-fields"').hide();
				$('.title-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumTitlesLabel').html("Medium titles");
				let i = 0;
				for (; i < numTitles; i++) {
					$('#medium-title-language-select-dropdown_'+medium.model.titles[i].id).select2('destroy').attr("readonly", true);
				}
			}
			else if (action == 'edit') {
				$('#medium-titles-form :input').prop('disabled', false);
				this.hideFormButtons();
				$('#medium-titles-form-submit').html("Save");
				$('#medium-titles-form-submit').show();
				$('#medium-titles-form-dismiss').show();
				$('#mediumTitlesLabel').html("Edit medium titles");
				$('[data-role="medium-new-title-fields"').show();
				$('.title-form-divider').show();
				$('#timaat-mediadatasets-metadata-medium-title').focus();

				// fields for new title entry
				$('[data-role="medium-new-title-fields"]').append(this.titleFormTitleToAppend());
				this.getTitleFormLanguageDropdownData();

				$('#medium-titles-form').data('medium', medium);
			}
		},

		mediumFormLanguageTracks: function(action, medium) {
    	// console.log("TCL: mediumFormLanguageTracks: action, medium", action, medium);
			// TIMAAT.UI.addSelectedClassToSelectedItem(medium.model.mediaType.mediaTypeTranslations[0].type, medium.model.id);
			var node = document.getElementById("medium-dynamic-languagetrack-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			var node = document.getElementById("medium-new-languagetrack-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			$('#medium-languagetracks-form').trigger('reset');
			mediumFormLanguageTracksValidator.resetForm();
			$('#mediumVideoPreview').get(0).pause();

			// setup UI
			// languageTrack data
			var i = 0;
			// console.log("TCL: medium", medium);
			var numLanguageTracks = medium.model.mediumHasLanguages.length;
			for (; i < numLanguageTracks; i++) {
				$('[data-role="medium-dynamic-languagetrack-fields"]').append(
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
							cache: false
						},
						minimumInputLength: 0,
					});
					var languageSelect = $('#languagetrack-language-select-dropdown_'+i);
					var option = new Option(medium.model.mediumHasLanguages[i].language.name, medium.model.mediumHasLanguages[i].language.id, true, true);
					languageSelect.append(option).trigger('change');
					$('[data-role="languageTrackTypeId['+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']"')
						.find('option[value='+medium.model.mediumHasLanguages[i].mediumLanguageType.id+']')
						.attr('selected', true);
					$('select[name="languageTrackTypeId['+i+']"]').rules("add", { required: true });
					$('#languagetrack-language-select-dropdown_'+i).select2('destroy').attr("readonly", true);
			};

			if ( action == 'show') {
				$('#medium-languagetracks-form :input').prop('disabled', true);
				this.initFormForShow(medium.model);
				$('#medium-languagetracks-form-done').hide();
				$('[data-role="medium-new-languagetrack-fields"').hide();
				$('.languagetrack-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumLanguageTracksLabel').html("Medium track list");
			}
			else if (action == 'edit') {
				$('.timaat-mediadatasets-medium-languagetracks-languagetrack-type-id').prop('disabled', true);
				$('#medium-languagetracks-form :input').prop('disabled', false);
				this.initFormDataSheetForEdit();
				this.hideFormButtons();
				$('#medium-languagetracks-form-done').html("Done");
				$('#medium-languagetracks-form-done').show();
				$('[data-role="medium-new-languagetrack-fields"').show();
				$('.languagetrack-form-divider').show();
				$('#mediumLanguageTracksLabel').html("Edit medium track list");

				// fields for new languageTrack entry
				// add empty 'add new track' row to form when edit mode is enabled
				$('[data-role="medium-new-languagetrack-fields"]').append(
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
						cache: false
					},
					minimumInputLength: 0,
				});

				$('#medium-languagetracks-form').data('medium', medium);
			}
		},

		mediumFormActorRoles: async function(action, medium) {
			// console.log("TCL: mediumFormActorRoles: action, medium", action, medium);
			// TIMAAT.UI.addSelectedClassToSelectedItem(medium.model.mediaType.mediaTypeTranslations[0].type, medium.model.id);
			var node = document.getElementById("medium-dynamic-actorwithrole-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			var node = document.getElementById("medium-new-actorwithrole-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			$('#medium-actorwithroles-form').trigger('reset');
			// mediumFormActorRolesValidator.resetForm();
			$('#mediumVideoPreview').get(0).pause();

			// setup UI
			// actor roles data
			var actorIdList = [];
			var i = 0;
			for (; i < medium.model.mediumHasActorWithRoles.length; i++) {
				if (actorIdList[actorIdList.length-1] != medium.model.mediumHasActorWithRoles[i].actor.id) {
					actorIdList.push(medium.model.mediumHasActorWithRoles[i].actor.id);
				}
			}
			// console.log("TCL: actorIdList", actorIdList);

			// set up form content structure
			i = 0;
			for (; i < actorIdList.length; i++) {
        // console.log("TCL: mediumFormActorRoles:function -> actorIdList", actorIdList);
				$('[data-role="medium-dynamic-actorwithrole-fields"]').append(this.appendActorWithRolesDataset(i, actorIdList[i]));

				// provide list of actors that already have a medium_has_actor_with_role entry, filter by role_group
				this.getMediumHasActorWithRoleData(actorIdList[i]);
				// select actor for each entry
				// await TIMAAT.MediumService.getActorList(medium.model.id).then(function (data) {
				await TIMAAT.ActorService.getActor(actorIdList[i]).then(function (data) {
          // console.log("TCL: actorIdList[i]", actorIdList[i]);
					var actorSelect = $('#mediumhasactorwithrole-actorid-'+actorIdList[i]);
					// console.log("TCL: actorSelect", actorSelect);
					// console.log("TCL: then: data", data);
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

				// url for role fetch needs to change on actor change
				// provide roles list for new selected actor
				this.getMediumHasActorWithRolesDropdownData(actorIdList[i]);

				var roleSelect = $('#medium-actorwithroles-multi-select-dropdown-'+actorIdList[i]);
				// console.log("TCL: roleSelect", roleSelect);
				await TIMAAT.MediumService.getActorHasRoleList(medium.model.id, actorIdList[i]).then(function (data) {
					// console.log("TCL: then: data", data);
					if (data.length > 0) {
						data.sort((a, b) => (a.roleTranslations[0].name > b.roleTranslations[0].name)? 1 : -1);
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
				$('#medium-actorwithroles-form :input').prop('disabled', true);
				this.initFormForShow(medium.model);
				$('#medium-actorwithroles-form-submit').hide();
				$('#medium-actorwithroles-form-dismiss').hide();
				$('[data-role="medium-new-actorwithrole-fields"]').hide();
				$('.actorwithrole-form-divider').hide();
				$('[data-role="remove"]').hide();
				$('[data-role="add"]').hide();
				$('#mediumActorRolesLabel').html("Medium actor roles");
			}
			else if (action == 'edit') {
				$('#medium-actorwithroles-form :input').prop('disabled', false);
				$('[id^="mediumhasactorwithrole-actorid-"').prop('disabled', true);
				this.hideFormButtons();
				$('#medium-actorwithroles-form-submit').html("Save");
				$('#medium-actorwithroles-form-submit').show();
				$('#medium-actorwithroles-form-dismiss').show();
				$('#mediumActorRolesLabel').html("Edit medium actor roles");
				$('[data-role="medium-new-actorwithrole-fields"]').show();
				$('.actorwithrole-form-divider').show();
				// $('#timaat-mediadatasets-metadata-medium-actorwithrole').focus();

				// fields for new title entry
				$('[data-role="medium-new-actorwithrole-fields"]').append(this.appendNewActorHasRolesField());

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
						cache: false
					},
					minimumInputLength: 0,
				});

				// url for role fetch needs to change on actor change
				$('#mediumhasactorwithrole-actorid').on('change', function (event) {
					// console.log("TCL: actor selection changed");
					// console.log("TCL: selected Actor Id", $(this).val());
					if (!($(this).val() == null)) {
						$('#medium-actorwithroles-multi-select-dropdown').val(null).trigger('change');
						// provide roles list for new selected actor
						$('#medium-actorwithroles-multi-select-dropdown').select2({
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
								cache: false
							},
							minimumInputLength: 0,
						});
					}
				});

				$('#medium-actorwithroles-form').data('medium', medium);
			}
		},

		createMedium: async function(mediumSubtype, mediumModel, mediumSubtypeModel, title, source) {
    	// console.log("TCL: createMedium: mediumSubtype, mediumModel, mediumSubtypeModel, title, source", mediumSubtype, mediumModel, mediumSubtypeModel, title, source);
			try { // TODO needs to be called after createMedium once m-n-table is refactored to 1-n table (sure?)
				// create display title
				var newDisplayTitle = await TIMAAT.MediumService.createTitle(title);
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.displayTitle = newDisplayTitle;
				tempMediumModel.originalTitle = newDisplayTitle;
				tempMediumModel.source = source;
				var newMediumModel = await TIMAAT.MediumService.createMedium(tempMediumModel);
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// update source (createMedium created an empty source)
				source.id = newMediumModel.sources[0].id;
				var updatedSource = await TIMAAT.MediumService.updateSource(source);
				newMediumModel.sources[0] = updatedSource; // TODO refactor once several sources can be added
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// create mediumSubtype with medium id
				mediumSubtypeModel.mediumId = newMediumModel.id;
				var newMediumSubtypeModel = await TIMAAT.MediumService.createMediumSubtype(mediumSubtype, newMediumModel, mediumSubtypeModel);
        // console.log("TCL: newMediumSubtypeModel", newMediumSubtypeModel);
			} catch(error) {
				console.error("ERROR: ", error);
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
				console.error("ERROR: ", error);
			};
			return (newMediumModel);
		},

		createTitle: async function(titleModel) {
			// console.log("TCL: createTitle: async function -> titleModel", titleModel);
			try {
				// create title
				var newTitleModel = await TIMAAT.MediumService.createTitle(titleModel.model);
        // console.log("TCL: newTitleModel", newTitleModel);
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		addTitles: async function(medium, newTitles) {
			// console.log("TCL: addTitles: async function -> medium, newTitles", medium, newTitles);
			try {
				// create title
				var i = 0;
				for (; i <newTitles.length; i++) {
					// var newTitle = await TIMAAT.MediumService.createTitle(newTitles[i]);
					var addedTitleModel = await TIMAAT.MediumService.addTitle(medium.model.id, newTitles[i]);
					medium.model.titles.push(addedTitleModel);
				}
				// await this.updateMedium(type, medium);
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		addLanguageTrack: async function(medium, newLanguageTrack) {
			// console.log("TCL: addLanguageTrack: async function -> newLanguageTrack", newLanguageTrack);
			try {
				var addedLanguageTrackModel = await TIMAAT.MediumService.addLanguageTrack(newLanguageTrack);
				addedLanguageTrackModel.id = newLanguageTrack;
				medium.model.mediumHasLanguages.push(addedLanguageTrackModel);
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		setMediumStatus: function (medium) {
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
				medium.ui.find('.timaat-medium-annotate').hide();

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
				var tempDisplayTitle = await TIMAAT.MediumService.updateTitle(medium.model.displayTitle);
        // console.log("tempDisplayTitle", tempDisplayTitle);
				medium.model.displayTitle = tempDisplayTitle;
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try { // update original title
				if (medium.model.originalTitle) { // medium initially has no original title set
					// for changes in datasheet form that impact data in originaltitle
					if (medium.model.displayTitle.id == medium.model.originalTitle.id) {
						medium.model.originalTitle = medium.model.displayTitle;
					}
					var tempOriginalTitle = await TIMAAT.MediumService.updateTitle(medium.model.originalTitle);
          // console.log("tempOriginalTitle", tempOriginalTitle);
					medium.model.originalTitle = tempOriginalTitle;
				}
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try { // update source
				var tempSource = await TIMAAT.MediumService.updateSource(medium.model.sources[0]);
				medium.model.sources[0] = tempSource;
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try { // update subtype
				var tempSubtypeModel;
				switch (mediumSubtype) {
					case 'audio':
						tempSubtypeModel = medium.model.mediumAudio;
						tempSubtypeModel.audioPostProduction.audioPostProductionTranslations[0] = await TIMAAT.MediumService.updateAudioPostProductionTranslation(medium.model.mediumAudio.audioPostProduction.audioPostProductionTranslations[0]); // TODO multi-language
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
				var tempMediumSubtypeModel = await TIMAAT.MediumService.updateMediumSubtype(mediumSubtype, tempSubtypeModel);
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try { // update medium
				var tempMediumModel = await TIMAAT.MediumService.updateMedium(medium.model);
        // console.log("TCL: updateMedium:function -> tempMediumModel", tempMediumModel);
			} catch(error) {
				console.error("ERROR: ", error);
			};

			// try { // update media lists
			// 	await this._mediumUpdated(mediumSubtype, medium);
			// } catch(error) {
			// 	console.error("ERROR: ", error);
			// };
			return tempMediumModel;
			// medium.updateUI();
		},

		updateTitle: async function(title, medium) {
			// console.log("TCL: updateTitle: async function -> title at beginning of update process: ", title, medium);
			try {
				// update title
				var tempTitle = await TIMAAT.MediumService.updateTitle(title);
				var i = 0;
				for (; i < medium.model.titles.length; i++) {
					if (medium.model.titles[i].id == title.id)
						medium.model.titles[i] = tempTitle;
				}

				// update data that is part of medium (includes updating last edited by/at)
				// console.log("TCL: updateMedium: async function - medium.model", medium.model);
				// var tempMediumModel = await TIMAAT.MediumService.updateMedium(medium.model);
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		updateMediumHasCategorySetsList: async function(mediumModel, categorySetIdList) {
    	// console.log("TCL: mediumModel, categorySetIdList", mediumModel, categorySetIdList);
			try {
				var existingMediumHasCategorySetsEntries = await TIMAAT.MediumService.getCategorySetList(mediumModel.id);
        // console.log("TCL: existingMediumHasCategorySetsEntries", existingMediumHasCategorySetsEntries);
				if (categorySetIdList == null) { //* all entries will be deleted
					mediumModel.categorySets = [];
					await TIMAAT.MediumService.updateMedium(mediumModel);
				} else if (existingMediumHasCategorySetsEntries.length == 0) { //* all entries will be added
					mediumModel.categorySets = categorySetIdList;
					await TIMAAT.MediumService.updateMedium(mediumModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMediumHasCategorySetsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < categorySetIdList.length; j++) {
							if (existingMediumHasCategorySetsEntries[i].id == categorySetIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMediumHasCategorySetEntries but not in categorySetIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMediumHasCategorySetsEntries[i]);
							existingMediumHasCategorySetsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = mediumModel.categorySets.findIndex(({id}) => id === entriesToDelete[i].id);
							mediumModel.categorySets.splice(index,1);
							await TIMAAT.MediumService.removeCategorySet(mediumModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing categorySets
					var idsToCreate = [];
          i = 0;
          for (; i < categorySetIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMediumHasCategorySetsEntries.length; j++) {
              if (categorySetIdList[i].id == existingMediumHasCategorySetsEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = categorySetIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							mediumModel.categorySets.push(idsToCreate[i]);
							await TIMAAT.MediumService.addCategorySet(mediumModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return mediumModel;
		},

		addCategorySetsToMedium: async function(mediumModel, newCategorySetList) {
      // console.log("TCL: addCategorySetsToMedium:function -> mediumModel, newCategorySetList", mediumModel, newCategorySetList);
			var i = 0;
			for (; i < newCategorySetList.length; i++) {
				await TIMAAT.MediumService.addCategorySet(mediumModel.id, newCategorySetList[i].id);
				mediumModel.categorySets.push(newCategorySetList[i]);
			}
			return mediumModel;
		},

		updateMediumHasCategoriesList: async function(mediumModel, categoryIdList) {
    	// console.log("TCL: mediumModel, categoryIdList", mediumModel, categoryIdList);
			try {
				var existingMediumHasCategoriesEntries = await TIMAAT.MediumService.getSelectedCategories(mediumModel.id);
        // console.log("TCL: existingMediumHasCategoriesEntries", existingMediumHasCategoriesEntries);
				if (categoryIdList == null) { //* all entries will be deleted
					mediumModel.categories = [];
					await TIMAAT.MediumService.updateMedium(mediumModel);
				} else if (existingMediumHasCategoriesEntries.length == 0) { //* all entries will be added
					mediumModel.categories = categoryIdList;
					await TIMAAT.MediumService.updateMedium(mediumModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMediumHasCategoriesEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < categoryIdList.length; j++) {
							if (existingMediumHasCategoriesEntries[i].id == categoryIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMediumHasCategoryEntries but not in categoryIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMediumHasCategoriesEntries[i]);
							existingMediumHasCategoriesEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = mediumModel.categories.findIndex(({id}) => id === entriesToDelete[i].id);
							mediumModel.categories.splice(index,1);
							await TIMAAT.MediumService.removeCategory(mediumModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing categories
					var idsToCreate = [];
          i = 0;
          for (; i < categoryIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMediumHasCategoriesEntries.length; j++) {
              if (categoryIdList[i].id == existingMediumHasCategoriesEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = categoryIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							mediumModel.categories.push(idsToCreate[i]);
							await TIMAAT.MediumService.addCategory(mediumModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return mediumModel;
		},

		addCategoriesToMedium: async function(mediumModel, newCategoryList) {
      // console.log("TCL: addCategoriesToMedium:function -> mediumModel, newCategoryList", mediumModel, newCategoryList);
			var i = 0;
			for (; i < newCategoryList.length; i++) {
				await TIMAAT.MediumService.addCategory(mediumModel.id, newCategoryList[i].id);
				mediumModel.categories.push(newCategoryList[i]);
			}
			return mediumModel;
		},

		updateMediumHasTagsList: async function(mediumModel, tagIdList) {
    	// console.log("TCL: mediumModel, tagIdList", mediumModel, tagIdList);
			try {
				var existingMediumHasTagsEntries = await TIMAAT.MediumService.getTagList(mediumModel.id);
        // console.log("TCL: existingMediumHasTagsEntries", existingMediumHasTagsEntries);
				if (tagIdList == null) { //* all entries will be deleted
					mediumModel.tags = [];
					await TIMAAT.MediumService.updateMedium(mediumModel);
				} else if (existingMediumHasTagsEntries.length == 0) { //* all entries will be added
					mediumModel.tags = tagIdList;
					await TIMAAT.MediumService.updateMedium(mediumModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMediumHasTagsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < tagIdList.length; j++) {
							if (existingMediumHasTagsEntries[i].id == tagIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMediumHasTagEntries but not in tagIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMediumHasTagsEntries[i]);
							existingMediumHasTagsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = mediumModel.tags.findIndex(({id}) => id === entriesToDelete[i].id);
							mediumModel.tags.splice(index,1);
							await TIMAAT.MediumService.removeTag(mediumModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing tags
					var idsToCreate = [];
          i = 0;
          for (; i < tagIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMediumHasTagsEntries.length; j++) {
              if (tagIdList[i].id == existingMediumHasTagsEntries[j].id) {
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
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							mediumModel.tags.push(idsToCreate[i]);
							await TIMAAT.MediumService.addTag(mediumModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return mediumModel;
		},

		createNewTagsAndAddToMedium: async function(mediumModel, newTagList) {
      // console.log("TCL: createNewTagsAndAddToMedium:function -> mediumModel, newTagList", mediumModel, newTagList);
			var i = 0;
			for (; i < newTagList.length; i++) {
				newTagList[i] = await TIMAAT.Service.createTag(newTagList[i].name);
				await TIMAAT.MediumService.addTag(mediumModel.id, newTagList[i].id);
				mediumModel.tags.push(newTagList[i]);
			}
			return mediumModel;
		},

		_mediumRemoved: async function(medium) {
    	// console.log("TCL: _mediumRemoved", medium);
			// sync to server
			try {
				if (medium.model.mediumAudio && medium.model.mediumAudio.audioPostProduction) await TIMAAT.MediumService.deleteAudioPostProduction(medium.model.mediumAudio.audioPostProduction.id);
				await TIMAAT.MediumService.removeMedium(medium);
			} catch(error) {
				console.error("ERROR: ", error);
			}

			// remove all titles from medium
			var i = 0;
			for (; i < medium.model.titles.length; i++ ) { // remove obsolete titles
				if ( medium.model.titles[i].id != medium.model.displayTitle.id ) {
					TIMAAT.MediumService.removeTitle(medium.model.titles[i]);
					medium.model.titles.splice(i,1);
				}
			}
			$('#medium-metadata-form').data('medium', null);
		},

		updateMediumModelData: async function(model, formDataObject) {
    	// console.log("TCL: updateMediumModelData: model, formDataObject", model, formDataObject);
			// medium data
			model.releaseDate = formDataObject.releaseDate;
			model.recordingStartDate = formDataObject.recordingStartDate;
			model.recordingEndDate = formDataObject.recordingEndDate;
			model.copyright = formDataObject.copyright;
			model.remark = formDataObject.remark;
			// display-title data
			model.displayTitle.name = formDataObject.displayTitle;
			model.displayTitle.language.id = formDataObject.displayTitleLanguageId;
			var i = 0;
			for (; i < model.titles.length; i++) {
				if (model.displayTitle.id == model.titles[i].id) {
					model.titles[i] = model.displayTitle;
					break;
				}
			}
			// source data
			model.sources[0].url = formDataObject.sourceUrl;
			model.sources[0].isPrimarySource = formDataObject.sourceIsPrimarySource;
			model.sources[0].lastAccessed = formDataObject.sourceLastAccessed;
			model.sources[0].isStillAvailable = formDataObject.sourceIsStillAvailable;

			return model;
		},

		createMediumModel: async function(formDataObject, type) {
    	// console.log("TCL: formDataObject, type", formDataObject, type);
			let typeId = 0;
			switch (type) {
				case 'audio':
					typeId = 1;
				break;
				case 'document':
					typeId = 2;
				break;
				case 'image':
					typeId = 3;
				break;
				case 'software':
					typeId = 4;
				break;
				case 'text':
					typeId = 5;
				break;
				case 'video':
					typeId = 6;
				break;
				case 'videogame':
					typeId = 7;
				break;
			}
			var model = {
				id: 0,
				remark: formDataObject.remark,
				copyright: formDataObject.copyright,
				releaseDate: formDataObject.releaseDate,
				recordingStartDate: formDataObject.recordingStartDate,
				recordingEndDate: formDataObject.recordingEndDate,
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
			return model;
		},

		createMediumSubtypeModel: async function(formDataObject, mediaType) {
			var model = {};
			switch(mediaType) {
				case 'audio':
					model = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct audio codec information
							id: 1,
						},
						audioPostProduction: {
							id: 0,
							audioPostProductionTranslations: [{
								id: 0,
							}],
						},
						length: formDataObject.length,
					};
				break;
				case 'document':
					model = {
						mediumId: 0,
					};
				break;
				case 'image':
					model = {
						mediumId: 0,
						width: formDataObject.width,
						height: formDataObject.height,
						bitDepth: 0, // TODO bit depth neither implemented nor displayed in UI
					};
				break;
				case 'software':
					model = {
						mediumId: 0,
						version: formDataObject.version,
					};
				break;
				case 'text':
					model = {
						mediumId: 0,
						content: formDataObject.content,
					};
				break;
				case 'video':
					model = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct audio codec information
							id: 1,
						},
						length: formDataObject.length,
						videoCodec: "", // TODO video codec neither implemented nor displayed in UI
						width: formDataObject.width,
						height: formDataObject.height,
						frameRate: formDataObject.frameRate,
						// dataRate: formDataObject.dataRate,
						// totalBitrate: formDataObject.totalBitrate,
						isEpisode: formDataObject.isEpisode,
					};
				break;
				case 'videogame':
					model = {
						mediumId: 0,
						isEpisode: formDataObject.isEpisode,
					};
				break;
			}
			return model;
		},

		createDisplayTitleModel: async function(formDataObject) {
			var model = {
				id: 0,
				language: {
					id: formDataObject.displayTitleLanguageId,
				},
				name: formDataObject.displayTitle,
			};
			return model;
		},

		createSourceModel: async function(formDataObject) {
    	// console.log("TCL: formDataObject", formDataObject);
			var model = {
				id: 0,
				medium: {
					id: 0,
				},
				isPrimarySource: formDataObject.sourceIsPrimarySource,
				url: formDataObject.sourceUrl,
				lastAccessed: formDataObject.sourceLastAccessed,
				isStillAvailable: formDataObject.sourceIsStillAvailable,
			};
			return model;
		},

		createAudioPostProductionTranslationModel: async function(formDataObject) {
			let model = {
				id: 0,
				audioPostProduction: {
					id: 0
				},
				language: {
					id: 1 // TODO
				},
				overdubbing: formDataObject.overdubbing,
				reverb: formDataObject.reverb,
				delay: formDataObject.delay,
				panning: formDataObject.panning,
				bass: formDataObject.bass,
				treble: formDataObject.treble
			};
			return model;
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
										id="medium-title-language-select-dropdown"
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
    	console.log("TCL: appendActorWithRolesDataset (i, actorId): ", i, actorId);
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
													id="medium-actorwithroles-multi-select-dropdown-`+actorId+`"
													name="roleId"
													data-placeholder="Select role(s)"
													data-role="actorWithRoles-`+actorId+`"
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

		appendNewActorHasRolesField: function() {
			let entryToAppend =
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
														id="medium-actorwithroles-multi-select-dropdown"
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
				</div>`;
			return entryToAppend;
		},

		initFormDataSheetForEdit: function() {
			$('#timaat-mediadatasets-metadata-medium-releasedate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediadatasets-metadata-medium-recordingstartdate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediadatasets-metadata-medium-recordingenddate').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediadatasets-metadata-medium-source-lastaccessed').datetimepicker({format: 'YYYY-MM-DD HH:mm', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#medium-metadata-form :input').prop('disabled', false);
			this.hideFormButtons();
			$('#medium-metadata-form-submit-button').show();
			$('#medium-metadata-form-dismiss-button').show();
			$('#timaat-mediadatasets-metadata-medium-title').focus();
		},

		initFormForShow: function (model) {
			$('.mediadatasheet-form-edit-button').prop('disabled', false);
			$('.mediadatasheet-form-edit-button :input').prop('disabled', false);
			$('.mediadatasheet-form-edit-button').show();
			$('.datasheet-form-upload-button').hide();
			$('.datasheet-form-upload-button').prop('disabled', true);
			if ( model.fileStatus == 'noFile' || !model.fileStatus) {
				if (model.mediumVideo || model.mediumImage || model.mediumAudio) {
					$('.datasheet-form-upload-button').prop('disabled', false);
					$('.datasheet-form-upload-button').show();
				}
				$('.medium-datasheet-form-annotate-button').hide();
				$('.medium-datasheet-form-annotate-button').prop('disabled', true);
			} else {
				if (model.mediaType.mediaTypeTranslations[0].type == 'video' || model.mediaType.mediaTypeTranslations[0].type == 'image' || model.mediaType.mediaTypeTranslations[0].type == 'audio') {
					$('.medium-datasheet-form-annotate-button').prop('disabled', false);
					$('.medium-datasheet-form-annotate-button').show();
				} else {
					$('.medium-datasheet-form-annotate-button').hide();
					$('.medium-datasheet-form-annotate-button').prop('disabled', true);
				}
			}
			if (this.container == 'videoplayer') {
				$('.medium-datasheet-form-annotate-button').hide();
				$('.medium-datasheet-form-annotate-button').prop('disabled', true);
			}
		},

		initFormDataSheetData: function(type) {
			$('.datasheet-data').hide();
			$('.title-data').show();
			$('.medium-data').show();
			$('.source-data').show();
			$('.'+type+'-data').show();
		},

		hideFormButtons: function() {
			$('.form-buttons').hide();
			$('.form-buttons').prop('disabled', true);
			$('.form-buttons :input').prop('disabled', true);
		},

		disableReadOnlyDataFields: function(disabled) {
				$('#timaat-mediadatasets-metadata-audio-length').prop('disabled', disabled);
				$('#timaat-mediadatasets-metadata-audio-audiocodec').prop('disabled', disabled);
				$('#timaat-mediadatasets-metadata-image-width').prop('disabled', disabled);
				$('#timaat-mediadatasets-metadata-image-height').prop('disabled', disabled);
				// $('#timaat-mediadatasets-metadata-image-bitdepth').prop('disabled', disabled);
				$('#timaat-mediadatasets-metadata-video-length').prop('disabled', disabled);
				// $('#timaat-mediadatasets-metadata-video-videocodec').prop('disabled', disabled);
				$('#timaat-mediadatasets-metadata-video-width').prop('disabled', disabled);
				$('#timaat-mediadatasets-metadata-video-height').prop('disabled', disabled);
				$('#timaat-mediadatasets-metadata-video-framerate').prop('disabled', disabled);
				// $('#timaat-mediadatasets-metadata-video-datarate').prop('disabled', disabled);
				// $('#timaat-mediadatasets-metadata-video-totalbitrate').prop('disabled', disabled);
		},

		showAddMediumButton: function() {
			$('.add-medium-button').prop('disabled', false);
			$('.add-medium-button :input').prop('disabled', false);
			$('.add-medium-button').show();
		},

		getMediumFormTitleLanguageDropdownData: function() {
			$('#medium-displayTitle-language-select-dropdown').select2({
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
					cache: false
				},
				minimumInputLength: 0,
			});
		},

		getTitleFormLanguageDropdownData: function() {
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
					cache: false
				},
				minimumInputLength: 0,
			});
		},

		getMediumHasActorWithRoleData: function(id) {
    	console.log("TCL: getMediumHasActorWithRoleData:function -> id", id);
			$('#mediumhasactorwithrole-actorid-'+id).select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: false,
				ajax: {
					url: 'api/actor/'+id+'/select',
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
					cache: false
				},
				minimumInputLength: 0,
			});
		},

		getMediumHasActorWithRolesDropdownData: function(id) {
			$('#medium-actorwithroles-multi-select-dropdown-'+id).select2({
				closeOnSelect: false,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/medium/hasActor/'+id+'/withRoles/selectList',
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
					cache: false
				},
				minimumInputLength: 0,
			});
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

		setupAllMediaDataTable: async function() {
			// console.log("TCL: setupAllMediaDataTable");
			this.dataTableAllMediaList = $('#timaat-mediumdatasets-medium-all-media-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 1, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"processing"    : true,
				"stateSave"     : true,
				"scrollX"				: true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"rowId"					: 'id',
				"serverSide"		: true,
				"ajax": {
					"url"        : "api/medium/allMediaList",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						// console.log("TCL: data", data);
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
						// console.log("TCL: dataSrc - data", data);
						// setup model
						TIMAAT.MediumDatasets.allMediaList = data.data;
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
					// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let rowItem = $(row);
					let medium = data;
					let type = medium.mediaType.mediaTypeTranslations[0].type;
					medium.ui = rowItem;
					rowItem.data('medium', medium);

					if ( medium.fileStatus != "noFile" ) TIMAAT.VideoChooser.loadThumbnail(medium);
					// TIMAAT.VideoChooser.setVideoStatus(medium);
					TIMAAT.MediumDatasets.setMediumStatus(medium);

					// set up events
					// rowItem.on('click', function(event) {
					// });

					rowItem.on('click', '.mediumItem-upload-button', async function(event) {
						event.stopPropagation();
						TIMAAT.UI.hidePopups();
						let item = new TIMAAT.Medium(medium, type);
						item.listView.find('.timaat-medium-upload-file').click();
					});

					rowItem.on('click', '.mediumItem-annotate-button', async function(event) {
						event.stopPropagation();
						TIMAAT.UI.hidePopups();
						if ( !medium.mediumVideo && !medium.mediumImage && !medium.mediumAudio) return; //* allow annotating only for videos, images and audio
						if ( medium.fileStatus && medium.fileStatus != 'ready' && medium.fileStatus != 'transcoding' && medium.fileStatus != 'waiting' ) return;
						await TIMAAT.VideoPlayer.initializeAnnotationMode(medium);
					});

					rowItem.on('click', '.timaat-mediadatasets-media-metadata', async function(event) {
						event.stopPropagation();
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-metadata', 'medium-metadata-form');
						TIMAAT.UI.displayDataSetContent('dataSheet', mediumModel, 'medium');
						TIMAAT.MediumDatasets.setDataTableOnItemSelect(type, mediumModel);
					});

					if ( type == 'video' && medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
						TIMAAT.VideoChooser.updateVideoStatus(medium);

				},
				"columns": [
					{ data: null, className: 'videochooser-item-preview', orderable: false, width: '150px', render: function(data, type, mediumItem, meta) {
						// console.log("TCL: setupAllMediaDataTable:function -> data, type, mediumItem, meta", data, type, mediumItem, meta);
						let ui;
						if (mediumItem.mediumVideo) {
							ui = `<div class="timaat-medium-status">
											<i class="fas fa-cog fa-spin"></i>
											</div>
										<img class="card-img-top center timaat-medium-thumbnail" src="img/video-placeholder.png" width="150" height="85" alt="Video preview"/>`;
						}
						else if (mediumItem.mediumImage) {
							ui = `<div style="display:flex">
											<img class="card-img-top center timaat-medium-thumbnail" src="img/image-placeholder.png" width="150" height="85" alt="Image preview"/>
										</div>`;
						} else if (mediumItem.mediumAudio) {
							ui = `<div style="display:flex">
											<i class="center fas fa-file-audio fa-5x"></i>
										</div>`;
						} else {
							ui = `<div style="display:flex">
											<img class="card-img-top center timaat-medium-thumbnail" src="img/preview-placeholder.png" width="150" height="85" alt="No preview available"/>
										</div>`;
						}
						return ui;
						}
					},
					{ data: 'id', name: 'title', className: 'title', render: function(data, type, mediumItem, meta) {
						// console.log("TCL: setupAllMediaDataTable:function -> data, type, mediumItem, meta", data, type, mediumItem, meta);
						let displayMediumTypeIcon = '';
						switch (mediumItem.mediaType.mediaTypeTranslations[0].type) {
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
						let analysisListIcon = ' ';
							if ( mediumItem.mediumAnalysisLists.length > 0) {
								analysisListIcon = '<i class="far fa-eye" title="Analysis available"></i> ';
							}

						let titleDisplay = `<p>` + displayMediumTypeIcon + analysisListIcon + mediumItem.displayTitle.name + `</p>`;
							if (mediumItem.originalTitle != null && mediumItem.displayTitle.id != mediumItem.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+mediumItem.originalTitle.name+`)</i></p>`;
							}
							// TODO not working anymore due to server side dataTable data search
							mediumItem.titles.forEach(function(title) { // make additional titles searchable in media library
								if (title.id != mediumItem.displayTitle.id && (mediumItem.originalTitle == null || title.id != mediumItem.originalTitle.id)) {
									titleDisplay += `<div style="display:none">`+title.name+`</div>`;
								}
							});
							return titleDisplay;
						}
					},
					{ data: null, name: 'duration', className: 'duration', orderable: false, width: '10%', render: function(data, type, mediumItem, meta) {
							// console.log("TCL: data, type, mediumItem, meta - ", data, type, mediumItem, meta);
							if (mediumItem.mediumVideo && mediumItem.mediumVideo.length > 0) {
								return TIMAAT.Util.formatTime(mediumItem.mediumVideo.length);
							} else if (mediumItem.mediumAudio && mediumItem.mediumAudio.length > 0) {
								return TIMAAT.Util.formatTime(mediumItem.mediumAudio.length);
							} else {
								return "-";
							}
						}
					},
					{ data: 'medium.mediumHasActorWithRoles', name: 'producer', className: 'producer', orderable: false, width: '10%', render: function(data, type, mediumItem, meta) {
						// console.log("TCL: setupAllMediaDataTable:function -> data, type, mediumItem, met", data, type, mediumItem, met);
						return TIMAAT.VideoChooser._getProducer(mediumItem);
						}
					},
					{ data: 'releaseDate', name: 'releaseDate', className: 'date', width: '10%', render: function(data, type, mediumItem, meta) {
						// console.log("TCL: data, type, mediumItem, meta", data, type, mediumItem, meta);
							if (mediumItem.releaseDate) {
								return moment.utc(mediumItem.releaseDate).format('YYYY-MM-DD');
							} else {
								return "-";
							}
						}
					},
					{ data: 'mediumHasLanguages', name: 'language', className: 'language', orderable: false, width: '10%', render: function(data, type, mediumItem, meta) {
							// console.log("TCL: data, type, mediumItem, meta", data, type, mediumItem, meta);
							if (mediumItem.mediumHasLanguages && mediumItem.mediumHasLanguages.length > 0) {
								let i = 0;
								let languageDisplay = '';
								data.sort((a,b) => a.mediumLanguageType.id > b.mediumLanguageType.id ? 1 : ((b.mediumLanguageType.id > a.mediumLanguageType.id) ? -1 : 0));
								for (; i < data.length; i++) {
									if (data[i].mediumLanguageType.id == 1) {
										languageDisplay += `<p>` + data[i].language.name + ` (AT)</p>`;
									} else if (data[i].mediumLanguageType.id == 2) {
										languageDisplay += `<p>` + data[i].language.name + ` (STT)</p>`;
									}
								}
								return languageDisplay;
							} else {
								return "-";
							}
						}
					},
					{ data: null, className: 'actions', orderable: false, width: '5%', render: function(data, type, mediumItem, meta) {
						// console.log("TCL: setupAllMediaDataTable:function -> data, type, mediumItem, meta", data, type, mediumItem, meta);
						let ui = `<div>`;
						if ( mediumItem.mediumVideo ){
							if ( !mediumItem.fileStatus || mediumItem.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload video" class="btn btn-outline-secondary btn-sm btn-block mediumItem-upload-button"><i class="fas fa-file-upload"></i></button>`;
							} else {
								ui +=	`<button type="button" title="Annotate video" class="btn btn-outline-secondary btn-sm btn-block mediumItem-annotate-button"><i class="fas fa-draw-polygon"></i></button>`;
							}
						} else if ( mediumItem.mediumAudio ){
							if ( !mediumItem.fileStatus || mediumItem.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload audio" class="btn btn-outline-secondary btn-sm btn-block mediumItem-upload-button"><i class="fas fa-file-upload"></i></button>`;
							} else {
								ui +=	`<button type="button" title="Annotate audio" class="btn btn-outline-secondary btn-sm btn-block mediumItem-annotate-button"><i class="fas fa-draw-polygon"></i></button>`;
							}
						} else if (mediumItem.mediumImage) {
							if ( !mediumItem.fileStatus || mediumItem.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload image" class="btn btn-outline-secondary btn-sm btn-block mediumItem-upload-button"><i class="fas fa-file-upload"></i></button>`;
							} else {
								ui +=	`<button type="button" title="Annotate image" class="btn btn-outline-secondary btn-sm btn-block mediumItem-annotate-button"><i class="fas fa-draw-polygon"></i></button>`;
							}
						}
						ui += `<button type="button" title="Edit data sheet" class="btn btn-outline-secondary btn-sm btn-block timaat-mediadatasets-media-metadata"><i class="fas fa-file-alt"></i></button>
									</div>`;
						return ui;
						},
					}
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "This collection is empty.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ items total)",
					"infoEmpty"   : "No items available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ items)",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},
			});
		},

		setupMediaDataTable: function() {
			// console.log("TCL: setupMediaDataTable");
			// setup dataTable
			this.dataTableMedia = $('#timaat-mediadatasets-media-table').DataTable({
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
							// mediumSubtype: ''
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
						var allMediaList = Array();
						data.data.forEach(function(medium) {
							if ( medium.id > 0 ) {
								allMediaList.push(new TIMAAT.Medium(medium, 'medium'));
							}
						});
						TIMAAT.MediumDatasets.media = allMediaList;
						TIMAAT.MediumDatasets.media.model = data.data;
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));
					}
				},
				"initComplete": async function( settings, json ) {
					TIMAAT.MediumDatasets.dataTableMedia.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let index = i+1;
							let position = $('table tbody > tr:nth-child('+index+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('medium');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: Media dataTable -  createdRow");
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);

					mediumElement.on('click', '.title', function(event) {
						event.stopPropagation();
						$('#timaat-mediumdatasets-all-media').removeClass('active');
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('medium', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, medium.mediaType.mediaTypeTranslations[0].type);
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

		setupAudioDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableAudio = $('#timaat-mediadatasets-audio-table').DataTable({
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
							// mediumSubtype: 'audio'
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
						// console.log("TCL: TIMAAT.MediumDatasets.audios (last)", TIMAAT.MediumDatasets.audios);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) {
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'audio'));
							}
						});
						TIMAAT.MediumDatasets.audios = meds;
						TIMAAT.MediumDatasets.audios.model = data.data;
						// console.log("TCL: TIMAAT.MediumDatasets.audios (current)", TIMAAT.MediumDatasets.audios);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
					TIMAAT.MediumDatasets.dataTableAudio.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let position = $('table tbody > tr:nth-child('+i+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('audio');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
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
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('audio', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, 'audio');
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

		setupDocumentDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableDocument = $('#timaat-mediadatasets-document-table').DataTable({
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
							// mediumSubtype: 'document'
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
						// console.log("TCL: TIMAAT.MediumDatasets.documents (last)", TIMAAT.MediumDatasets.documents);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) {
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'document'));
							}
						});
						TIMAAT.MediumDatasets.documents = meds;
						TIMAAT.MediumDatasets.documents.model = data.data;
						// console.log("TCL: TIMAAT.MediumDatasets.documents (current)", TIMAAT.MediumDatasets.documents);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
        	// console.log("TCL: setupDocumentDataTable:function -> settings, json", settings, json);
					TIMAAT.MediumDatasets.dataTableDocument.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					// console.log("TCL_ DataTables has redrawn the table");
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let position = $('table tbody > tr:nth-child('+i+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('document');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
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
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('document', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, 'document');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta)
					{
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

		setupImageDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableImage = $('#timaat-mediadatasets-image-table').DataTable({
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
							// mediumSubtype: 'image'
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
						// console.log("TCL: TIMAAT.MediumDatasets.images (last)", TIMAAT.MediumDatasets.images);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) {
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'image'));
							}
						});
						TIMAAT.MediumDatasets.images = meds;
						TIMAAT.MediumDatasets.images.model = data.data;
						// console.log("TCL: TIMAAT.MediumDatasets.images (current)", TIMAAT.MediumDatasets.images);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
        	// console.log("TCL: setupImageDataTable:function -> settings, json", settings, json);
					TIMAAT.MediumDatasets.dataTableImage.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					// console.log("TCL_ DataTables has redrawn the table");
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let position = $('table tbody > tr:nth-child('+i+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('image');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
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
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('image', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, 'image');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta)
					{
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

		setupSoftwareDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableSoftware = $('#timaat-mediadatasets-software-table').DataTable({
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
							// mediumSubtype: 'software'
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
						// console.log("TCL: TIMAAT.MediumDatasets.softwares (last)", TIMAAT.MediumDatasets.softwares);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) {
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'software'));
							}
						});
						TIMAAT.MediumDatasets.softwares = meds;
						TIMAAT.MediumDatasets.softwares.model = data.data;
						// console.log("TCL: TIMAAT.MediumDatasets.softwares (current)", TIMAAT.MediumDatasets.softwares);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
        	// console.log("TCL: setupSoftwareDataTable:function -> settings, json", settings, json);
					TIMAAT.MediumDatasets.dataTableSoftware.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					// console.log("TCL_ DataTables has redrawn the table");
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let position = $('table tbody > tr:nth-child('+i+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('software');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
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
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('software', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, 'software');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta)
					{
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

		setupTextDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableText = $('#timaat-mediadatasets-text-table').DataTable({
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
							// mediumSubtype: 'text'
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
						// console.log("TCL: TIMAAT.MediumDatasets.texts (last)", TIMAAT.MediumDatasets.texts);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) {
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'text'));
							}
						});
						TIMAAT.MediumDatasets.texts = meds;
						TIMAAT.MediumDatasets.texts.model = data.data;
						// console.log("TCL: TIMAAT.MediumDatasets.texts (current)", TIMAAT.MediumDatasets.texts);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
        	// console.log("TCL: setupTextDataTable:function -> settings, json", settings, json);
					TIMAAT.MediumDatasets.dataTableText.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					// console.log("TCL_ DataTables has redrawn the table");
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let position = $('table tbody > tr:nth-child('+i+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('text');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
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
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('text', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, 'text');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta)
					{
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

		setupVideoDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableVideo = $('#timaat-mediadatasets-video-table').DataTable({
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
							// mediumSubtype: 'video'
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
						TIMAAT.MediumDatasets.videos = meds;
						TIMAAT.MediumDatasets.videos.model = data.data;
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
        	// console.log("TCL: setupVideoDataTable:function -> settings, json", settings, json);
					TIMAAT.MediumDatasets.dataTableVideo.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					// console.log("TCL_ DataTables has redrawn the table");
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let position = $('table tbody > tr:nth-child('+i+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('video');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
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
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('video', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" ) {
					// 	console.log("TCL: medium.fileStatus", medium.fileStatus);
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, 'video');
					// }
          // console.log("TCL: medium.fileStatus", medium.fileStatus);
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta)
					{
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

		setupVideogameDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableVideogame = $('#timaat-mediadatasets-videogame-table').DataTable({
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
							// mediumSubtype: 'videogame'
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
						// console.log("TCL: TIMAAT.MediumDatasets.videogames (last)", TIMAAT.MediumDatasets.videogames);
						// setup model
						var meds = Array();
						data.data.forEach(function(medium) {
							if ( medium.id > 0 ) {
								meds.push(new TIMAAT.Medium(medium, 'videogame'));
							}
						});
						TIMAAT.MediumDatasets.videogames = meds;
						TIMAAT.MediumDatasets.videogames.model = data.data;
						// console.log("TCL: TIMAAT.MediumDatasets.videogames (current)", TIMAAT.MediumDatasets.videogames);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
        	// console.log("TCL: setupVideogameDataTable:function -> settings, json", settings, json);
					TIMAAT.MediumDatasets.dataTableVideogame.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					// console.log("TCL_ DataTables has redrawn the table");
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let position = $('table tbody > tr:nth-child('+i+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumId) {
						TIMAAT.UI.clearLastSelection('videogame');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumId = data.id; //* as it is set to null in clearLastSelection
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
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.MediumDatasets.setDataTableOnItemSelect('videogame', mediumModel);
					});

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediumService.updateFileStatus(medium, 'videogame');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta)
					{
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

		setDataTableOnItemSelect: function(type, selectedItem) {
    	// console.log("TCL: setDataTableOnItemSelect:function -> type, selectedItem", type, selectedItem);
			// show tag editor - trigger popup
			TIMAAT.UI.hidePopups();
			$('#timaat-mediadatasets-medium-tabs-container').append($('#timaat-mediadatasets-medium-tabs'));
			$('#timaat-medium-modals-container').append($('#timaat-medium-modals'));
			this.container = 'media';
			$('#mediumPreviewTab').removeClass('annotationView');
			switch (TIMAAT.UI.subNavTab) {
				case 'dataSheet':
					TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-metadata-form', 'medium');
				break;
				case 'preview':
					TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-preview-form', 'medium');
				break;
				case 'titles':
					TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-titles-form', 'medium');
				break;
				case 'languageTracks':
					TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-languagetracks-form', 'medium');
				break;
				case 'actorWithRoles':
					TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-actorwithroles-form', 'medium');
				break;
			}
			TIMAAT.UI.clearLastSelection(type);
			// TIMAAT.UI.addSelectedClassToSelectedItem(type, selectedItem.model.id); // is done in displayDataSetContent
			if (type == 'medium') {
				if (TIMAAT.UI.subNavTab == 'dataSheet') {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + selectedItem.model.id);
				} else {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + selectedItem.model.id + '/' + TIMAAT.UI.subNavTab);
				}
				type = selectedItem.model.mediaType.mediaTypeTranslations[0].type;
			} else {
				if (TIMAAT.UI.subNavTab == 'dataSheet') {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + type + '/' + selectedItem.model.id);
				} else {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#medium/' + type + '/' + selectedItem.model.id + '/' + TIMAAT.UI.subNavTab);
				}
			}
			$('#medium-metadata-form').data('type', type);
			$('#medium-metadata-form').data('medium', selectedItem);
			this.showAddMediumButton();
			TIMAAT.UI.displayDataSetContent(TIMAAT.UI.subNavTab, selectedItem, 'medium');
		},

	}

}, window));
