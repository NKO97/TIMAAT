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

	TIMAAT.MusicDatasets = {
		mediumHasMusicList: null,
		musicLoaded       : false,
		churchMusicList   : null,
		musicList         : null,
		nashidList        : null,
		titles            : null,

		init: function() {
      this.initMusic();
			this.initTitles();
			this.initActorRoles();
			this.initMediumHasMusicList();
		},

    initMusicComponent: function() {
      if (!this.musicLoaded) {
        this.setMusicList();
      }
      if (TIMAAT.UI.component != 'music') {
        TIMAAT.UI.showComponent('music');
        $('#musicTab').trigger('click');
      }
    },

    initMusic: function() {
      $('#musicTab').on('click', function(event) {
        TIMAAT.MusicDatasets.initMusicComponent();
        TIMAAT.MusicDatasets.loadMusicList();
        TIMAAT.UI.displayComponent('music', 'musicTab', 'musicDataTable');
        TIMAAT.URLHistory.setURL(null, 'Music Datasets', '#music/list');
      });

			$('#nashidTab').on('click', function(event) {
				TIMAAT.MusicDatasets.loadMusicSubtype('nashid');
				TIMAAT.UI.displayComponent('music', 'nashidTab', 'nashidDataTable');
				TIMAAT.URLHistory.setURL(null, 'Anashid Datasets', '#music/nashid/list');
			});

			$('#churchMusicTab').on('click', function(event) {
				TIMAAT.MusicDatasets.loadMusicSubtype('churchMusic');
				TIMAAT.UI.displayComponent('music', 'churchMusicTab', 'churchMusicDataTable');
				TIMAAT.URLHistory.setURL(null, 'Church Music Datasets', '#music/churchMusic/list');
			});

			$('#musicTabMetadata').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				let type = music.model.musicType.musicTypeTranslations[0].type;
				let name = music.model.displayTitle.name;
				let id = music.model.id;
				TIMAAT.UI.displayDataSetContentArea('musicFormMetadata');
				TIMAAT.UI.displayDataSetContent('dataSheet', music, 'music');
				if ( type == 'music') {
					TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#music/' + id);
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#music/' + type + '/' + id);
				}
			});

			$('#musicTabPreview').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				let type = music.model.musicType.musicTypeTranslations[0].type;
				let name = music.model.displayTitle.name;
				let id = music.model.id;
				TIMAAT.UI.displayDataSetContentArea('musicFormPreview');
				TIMAAT.UI.displayDataSetContent('preview', music, 'music');
				if ( type == 'music') {
					TIMAAT.URLHistory.setURL(null, name + ' · Preview · ' + type[0].toUpperCase() + type.slice(1), '#music/' + id + '/preview');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Preview · ' + type[0].toUpperCase() + type.slice(1), '#music/' + type + '/' + id + '/preview');
				}
			});

			// delete music button (in form) handler
			$('.musicFormDataSheetDeleteButton').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				// $('#musicVideoPreview').get(0).pause(); // TODO check if needed
				$('#musicDatasetsMusicDeleteModal').data('music', $('#musicFormMetadata').data('music'));
				$('#musicDatasetsMusicDeleteModal').modal('show');
			});

			// confirm delete music modal functionality
			$('#musicDatasetsMusicDeleteModalSubmitButton').on('click', async function(event) {
				let modal = $('#musicDatasetsMusicDeleteModal');
				let music = modal.data('music');
				let type = music.model.musicType.musicTypeTranslations[0].type;
        // console.log("TCL: $ -> type", type);
				if (music) {
					try {
						await TIMAAT.MusicDatasets._musicRemoved(music);
					} catch(error) {
						console.error("ERROR: ", error);
					}
					try {
						if ($('#musicTab').hasClass('active')) {
							await TIMAAT.UI.refreshDataTable('music');
						} else {
							await TIMAAT.UI.refreshDataTable(type);
						}
					} catch(error) {
						console.error("ERROR: ", error);
					}
				}
				modal.modal('hide');
				if ( $('#musicTab').hasClass('active') ) {
					$('#musicTab').trigger('click');
				} else {
					$('#'+type+'Tab').trigger('click');
				}
			});

			// edit content form button handler
			$('.musicFormDataSheetEditButton').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				let music = $('#musicFormMetadata').data('music');
				TIMAAT.UI.displayDataSetContent(TIMAAT.UI.subNavTab, music, 'music', 'edit');
			});

			// music form handlers
			// submit music metadata button functionality
			$('#musicFormMetadataSubmitButton').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#musicFormMetadata').valid()) return false;

				var music = $('#musicFormMetadata').data('music');
				var type = $('#musicFormMetadata').data('type');

				// create/edit music window submitted data
				var formData = $('#musicFormMetadata').serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				// console.log("TCL: formDataObject", formDataObject);
				var formSelectData = formData;
				var voiceLeadingPatternIdList = [];
				let i = 0;
				for (; i < formSelectData.length; i++) {
					if (formSelectData[i].name == 'voiceLeadingPatternId') {
						voiceLeadingPatternIdList.push({id: Number(formSelectData[i].value)});
					}
				}
				// console.log("TCL: voiceLeadingPatternIdList: ", voiceLeadingPatternIdList);
				// sanitize form data
				var formDataSanitized = formDataObject;
				formDataSanitized.churchMusicalKeyId            = Number(formDataObject.churchMusicalKeyId);
				formDataSanitized.dynamicMarkingId              = Number(formDataObject.dynamicMarkingId);
				formDataSanitized.displayTitleLanguageId        = Number(formDataObject.displayTitleLanguageId);
				formDataSanitized.jinsId                        = Number(formDataObject.jinsId);
				formDataSanitized.maqamId                       = Number(formDataObject.maqamId);
				formDataSanitized.musicalKeyId                  = Number(formDataObject.musicalKeyId);
				formDataSanitized.mediumId                      = (isNaN(formDataObject.mediumId)) ? 0 : Number(formDataObject.mediumId);
				formDataSanitized.tempoMarkingId                = Number(formDataObject.tempoMarkingId);
				formDataSanitized.musicTextSettingElementTypeId = Number(formDataObject.musicTextSettingElementTypeId);
				formDataSanitized.voiceLeadingPatternList       = voiceLeadingPatternIdList;
        // console.log("TCL: formDataSanitized", formDataSanitized);
				if (music) { // update music
					// music data
					music.model = await TIMAAT.MusicDatasets.updateMusicModelData(music.model, formDataSanitized);
					// music subtype data
					switch (type) {
						case 'nashid':
							if (!isNaN(formDataSanitized.jinsId)) {
								if (!music.model.musicNashid.jins) {
									music.model.musicNashid.jins = {};
								}
								music.model.musicNashid.jins.id = formDataSanitized.jinsId;
							} else {
								delete music.model.musicNashid.jins;
							}
							if (!isNaN(formDataSanitized.maqamId)) {
								if (!music.model.musicNashid.maqam) {
									music.model.musicNashid.maqam = {};
								}
								music.model.musicNashid.maqam.id = formDataSanitized.maqamId;
							} else {
								delete music.model.musicNashid.maqam;
							}
						break;
						case 'churchMusic':
							if (!isNaN(formDataSanitized.churchMusicalKeyId)) {
								if (!music.model.musicChurchMusic.churchMusicalKey) {
									music.model.musicChurchMusic.churchMusicalKey = {};
								}
								music.model.musicChurchMusic.churchMusicalKey.id = formDataSanitized.churchMusicalKeyId;
							} else {
								delete music.model.musicChurchMusic.churchMusicalKey;
							}
						break;
					}
					// music.model = await TIMAAT.MusicDatasets.updateMusic(type, music);
					music.model = await TIMAAT.MusicDatasets.updateMusic(type, music, formDataSanitized.mediumId);
					// music.updateUI();
				} else { // create new music
					var musicModel = await TIMAAT.MusicDatasets.createMusicModel(formDataSanitized, type);
					var displayTitleModel = await TIMAAT.MusicDatasets.createDisplayTitleModel(formDataSanitized);
					var musicSubtypeModel = await TIMAAT.MusicDatasets.createMusicSubtypeModel(formDataSanitized, type);

					var newMusic = await TIMAAT.MusicDatasets.createMusic(type, musicModel, musicSubtypeModel, displayTitleModel, formDataSanitized.mediumId);
					music = new TIMAAT.Music(newMusic, type);
					// music.model.fileStatus = 'noFile';
					$('#musicFormMetadata').data('music', music);
					TIMAAT.UI.displayDataSetContentContainer('musicDataTab', 'musicFormMetadata', 'music');
					$('#musicTabMetadata').trigger('click');
				}
				TIMAAT.MusicDatasets.showAddMusicButton();
				if ($('#musicTab').hasClass('active')) {
					await TIMAAT.UI.refreshDataTable('music');
				} else {
					await TIMAAT.UI.refreshDataTable(type);
				}
				TIMAAT.UI.addSelectedClassToSelectedItem(type, music.model.id);
				TIMAAT.UI.displayDataSetContent('dataSheet', music, 'music');
			});

			// cancel add/edit button in content form functionality
			$('#musicFormMetadataDismissButton').on('click', async function(event) {
				TIMAAT.MusicDatasets.showAddMusicButton();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

			// category set button handler
			$('#musicFormDataSheetCategorySetButton').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#musicDatasetsEditMusicCategorySetsModal');
				modal.data('music', $('#musicFormMetadata').data('music'));
				var music = modal.data('music');
				modal.find('.modal-body').html(`
					<form role="form" id="musicCategorySetsForm">
						<div class="form-group">
							<!-- <label for="musicCategorySetsMultiSelectDropdown">Music category sets</label> -->
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="musicCategorySetsMultiSelectDropdown"
												name="categorySetId"
												data-role="categorySetId"
												data-placeholder="Select music category sets"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
				$('#musicCategorySetsMultiSelectDropdown').select2({
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
				TIMAAT.MusicService.getCategorySetList(music.model.id).then(function(data) {
					var categorySetSelect = $('#musicCategorySetsMultiSelectDropdown');
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
			$('#musicDatasetsEditMusicCategorySetsModalSubmitButton').on('click', async function(event) {
				event.preventDefault();
				// console.log("TCL: submit category set list");
				var modal = $('#musicDatasetsEditMusicCategorySetsModal');
				if (!$('#musicCategorySetsForm').valid())
					return false;
				var music = modal.data('music');
				// console.log("TCL: music", music);
				var formDataRaw = $('#musicCategorySetsForm').serializeArray();
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
				music.model = await TIMAAT.MusicDatasets.updateMusicHasCategorySetsList(music.model, categorySetIdList);
				if (newCategorySetList.length > 0) {
					var updatedMusicModel = await TIMAAT.MusicDatasets.addCategorySetsToMusic(music.model, newCategorySetList);
					// console.log("TCL: updatedMusicModel", updatedMusicModel);
					music.model.categorySets = updatedMusicModel.categorySets;
				}
				$('#musicFormMetadata').data('music', music);
				modal.modal('hide');
			});

			// category button handler
			$('#musicFormDataSheetCategoryButton').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#musicDatasetsEditMusicCategoriesModal');
				modal.data('music', $('#musicFormMetadata').data('music'));
				var music = modal.data('music');
				modal.find('.modal-body').html(`
					<form role="form" id="musicCategoriesForm">
						<div class="form-group">
							<!-- <label for="musicCategoriesMultiSelectDropdown">Music categories</label> -->
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="musicCategoriesMultiSelectDropdown"
												name="categoryId"
												data-role="categoryId"
												data-placeholder="Select music categories"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
				$('#musicCategoriesMultiSelectDropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: true,
					allowClear: true,
					minimumResultsForSearch: 10,
					ajax: {
						url: 'api/music/'+music.model.id+'/category/selectList/',
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
				TIMAAT.MusicService.getSelectedCategories(music.model.id).then(function(data) {
					// console.log("TCL: then: data", data);
					var categorySelect = $('#musicCategoriesMultiSelectDropdown');
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
			$('#musicDatasetsEditMusicCategoriesModalSubmitButton').on('click', async function(event) {
				event.preventDefault();
				// console.log("TCL: submit category list");
				var modal = $('#musicDatasetsEditMusicCategoriesModal');
				if (!$('#musicCategoriesForm').valid())
					return false;
				var music = modal.data('music');
				// console.log("TCL: music", music);
				var formDataRaw = $('#musicCategoriesForm').serializeArray();
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
				music.model = await TIMAAT.MusicDatasets.updateMusicHasCategoriesList(music.model, categoryIdList);
				if (newCategoryList.length > 0) {
					var updatedMusicModel = await TIMAAT.MusicDatasets.addCategoriesToMusic(music.model, newCategoryList);
					// console.log("TCL: updatedMusicModel", updatedMusicModel);
					music.model.categories = updatedMusicModel.categories;
				}
				$('#musicFormMetadata').data('music', music);
				modal.modal('hide');
			});

			// tag button handler
			$('#musicFormDataSheetTagButton').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#musicDatasetsMusicTagsModal');
				modal.data('music', $('#musicFormMetadata').data('music'));
				var music = modal.data('music');
				modal.find('.modal-body').html(`
					<form role="form" id="musicTagsForm">
						<div class="form-group">
							<label for="musicTagsMultiSelectDropdown">Music tags</label>
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="musicTagsMultiSelectDropdown"
												name="tagId"
												data-role="tagId"
												data-placeholder="Select music tags"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
        $('#musicTagsMultiSelectDropdown').select2({
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
				await TIMAAT.MusicService.getTagList(music.model.id).then(function(data) {
					// console.log("TCL: then: data", data);
					var tagSelect = $('#musicTagsMultiSelectDropdown');
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
			$('#musicDatasetsMusicTagsModalSubmitButton').on('click', async function(event) {
				event.preventDefault();
				var modal = $('#musicDatasetsMusicTagsModal');
				if (!$('#musicTagsForm').valid())
					return false;
				var music = modal.data('music');
				var formDataRaw = $('#musicTagsForm').serializeArray();
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
				music.model = await TIMAAT.MusicDatasets.updateMusicHasTagsList(music.model, tagIdList);
				if (newTagList.length > 0) {
					var updatedMusicModel = await TIMAAT.MusicDatasets.createNewTagsAndAddToMusic(music.model, newTagList);
					// console.log("TCL: updatedMusicModel", updatedMusicModel);
					music.model.tags = updatedMusicModel.tags;
				}
				$('#musicFormMetadata').data('music', music);
				modal.modal('hide');
			});

			$('#musicDatasetsMetadataTypeId').on('change', function(event) {
				event.stopPropagation();
				let type = $('#musicDatasetsMetadataTypeId').find('option:selected').html();
				TIMAAT.MusicDatasets.initFormDataSheetData(type);
			});

			// annotate button handler
			$('.musicFormDataSheetAnnotateButton').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var music = $('#musicFormMetadata').data('music');
				let medium = await TIMAAT.MusicService.getMediumByMusicId(music.model.id);
				if (medium.id && medium.fileStatus && medium.fileStatus != 'noFile') {
					TIMAAT.UI.showComponent('videoPlayer');
					// setup video in player
					await TIMAAT.VideoPlayer.setupMedium(medium);
					$('#timelineAudioLayer').prop('checked', true);
					// load video annotations from server
					let analysisLists = await TIMAAT.AnalysisListService.getMediumAnalysisLists(medium.id);
					await TIMAAT.VideoPlayer.setupMediumAnalysisLists(analysisLists);
					TIMAAT.VideoPlayer.loadAnalysisList(0);
				}
			});

			// data table events
			$('#musicDatasetsMusicTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			$('#musicDatasetsNashidTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			$('#musicDatasetsChurchMusicTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			// Key press events
			$('#musicFormMetadataSubmitButton').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#musicFormMetadataSubmitButton').trigger('click');
				}
			});

			$('#musicFormMetadataDismissButton').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#musicFormMetadataDismissButton').trigger('click');
				}
			});
    },

		initTitles: function() {
			$('#musicTabTitles').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				let type = music.model.musicType.musicTypeTranslations[0].type;
				let name = music.model.displayTitle.name;
				let id = music.model.id;
				TIMAAT.UI.displayDataSetContentArea('musicFormTitles');
				TIMAAT.MusicDatasets.setMusicTitleList(music);
				TIMAAT.UI.displayDataSetContent('titles', music, 'music');
				if (type == 'music') {
					TIMAAT.URLHistory.setURL(null, name + ' · Titles · ' + type[0].toUpperCase() + type.slice(1), '#music/' + id + '/titles');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Titles · ' + type[0].toUpperCase() + type.slice(1), '#music/' + type + '/' + id + '/titles');
				}
			});

			$(document).on('click', '.isOriginalTitleMusic', function(event) {
        if ($(this).data('wasChecked') == true) {
          $(this).prop('checked', false);
					$('input[name="isOriginalTitleMusic"]').data('wasChecked', false);
        }
        else {
					$('input[name="isOriginalTitleMusic"]').data('wasChecked', false);
					$(this).data('wasChecked', true);
				}
			});

			// Add title button click
			// $(document).on('click','[data-role="musicNewTitleFields"] > .form-group [data-role="add"]', function(event) {
			$(document).on('click','.addTitleButton', function(event) {
					event.preventDefault();
				// console.log("TCL: add title to list");
				var listEntry = $(this).closest('[data-role="musicNewTitleFields"]');
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
				if (!$('#musicFormTitles').valid())
					return false;
				if (title != '' && languageId != null) {
					var titlesInForm = $('#musicFormTitles').serializeArray();
					// console.log("TCL: titlesInForm", titlesInForm);
					var numberOfTitleElements = 2;
					var indexName = titlesInForm[titlesInForm.length-numberOfTitleElements-1].name; // find last used indexed name
					var indexString = indexName.substring(indexName.lastIndexOf("[") + 1, indexName.lastIndexOf("]"));
					var i = Number(indexString)+1;
          // console.log("i", i);
					$('#musicDynamicTitleFields').append(
						`<div class="form-group" data-role="titleEntry">
						<div class="form-row">
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayTitle"></label>
									<input class="form-check-input isDisplayTitle"
												 type="radio" name="isDisplayTitle"
												 data-role="displayTitle"
												 placeholder="Is Display Title">
								</div>
							</div>
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isOriginalTitleMusic"></label>
									<input class="form-check-input isOriginalTitleMusic"
												 type="radio" name="isOriginalTitleMusic"
												 data-role="originalTitle"
												 data-wasChecked="false"
												 placeholder="Is Original Title">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm musicDatasetsMusicTitlesTitleName"
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
								<select class="form-control form-control-sm musicDatasetsMusicTitlesTitleLanguageId"
												id="newMusicTitleLanguageSelectDropdown_`+i+`"
												name="newTitleLanguageId[`+i+`]"
												data-role="newTitleLanguageId[`+i+`]"
												required>
								</select>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="form-group__button js-form-group__button removeTitleButton btn btn-danger" data-role="remove">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
					);
					$('#newMusicTitleLanguageSelectDropdown_'+i).select2({
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
					var languageSelect = $('#newMusicTitleLanguageSelectDropdown_'+i);
					var option = new Option(languageName, languageId, true, true);
					languageSelect.append(option).trigger('change');
					$('input[name="newTitle['+i+']"]').rules('add', { required: true, minlength: 3, maxlength: 200, });
					$('input[data-role="newTitle['+i+']"]').attr('value', TIMAAT.MusicDatasets.replaceSpecialCharacters(title));
					$('#musicTitleLanguageSelectDropdown').empty();
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
			// $(document).on('click','[data-role="musicDynamicTitleFields"] > .form-group [data-role="remove"]', function(event) {
			$(document).on('click','.removeTitleButton', function(event) {
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

			// Submit music titles button functionality
			$('#musicFormTitlesSubmitButton').on('click', async function(event) {
				// console.log("TCL: Titles form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("musicNewTitleFields");
				while (node.lastChild) {
					node.removeChild(node.lastChild);
				};
				// test if form is valid
				if (!$('#musicFormTitles').valid()) {
					$('[data-role="musicNewTitleFields"]').append(TIMAAT.MusicDatasets.titleFormTitleToAppend());
					this.getTitleFormLanguageDropdownData();
					return false;
				}
				// console.log("TCL: Titles form: valid");

				// the original music model (in case of editing an existing music)
				var music = $('#musicFormTitles').data("music");
				var type = music.model.musicType.musicTypeTranslations[0].type;
        // console.log("TCL: type", type);

				// Create/Edit music window submitted data
				var formData = $('#musicFormTitles').serializeArray();
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
						if (formData[i+1].name == 'isOriginalTitleMusic' && formData[i+1].value == 'on' ) {
							// display title set, original title set
							element.isOriginalTitle = true;
							element.title = TIMAAT.MusicDatasets.replaceSpecialCharacters(formData[i+2].value);
							element.titleLanguageId = formData[i+3].value;
							i = i+4;
						} else { // display title set, original title not set
							element.isOriginalTitle = false;
							element.title = TIMAAT.MusicDatasets.replaceSpecialCharacters(formData[i+1].value);
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						}
					} else { // display title not set, original title set
						element.isDisplayTitle = false;
						if (formData[i].name == 'isOriginalTitleMusic' && formData[i].value == 'on' ) {
							element.isOriginalTitle = true;
							element.title = TIMAAT.MusicDatasets.replaceSpecialCharacters(formData[i+1].value);
							element.titleLanguageId = formData[i+2].value;
							i = i+3;
						} else {
							// display title not set, original title not set
							element.isOriginalTitle = false;
							element.title = TIMAAT.MusicDatasets.replaceSpecialCharacters(formData[i].value);
							element.titleLanguageId = formData[i+1].value;
							i = i+2;
						}
					};
					formTitleList[formTitleList.length] = element;
				}
				// console.log("formTitleList", formTitleList);
				// only updates to existing titles
				if (formTitleList.length == music.model.titles.length) {
					var i = 0;
					for (; i < music.model.titles.length; i++ ) { // update existing titles
						var title = {
							id: music.model.titles[i].id,
							language: {
								id: Number(formTitleList[i].titleLanguageId),
							},
							name: formTitleList[i].title,
						};
						// console.log("TCL: update existing titles");
						// only update if anything changed
						if (title != music.model.titles[i]) {
							await TIMAAT.MusicDatasets.updateTitle(title, music);
						}
						// update display title
						var displayTitleChanged = false;
						if (formTitleList[i].isDisplayTitle) {
							music.model.displayTitle = music.model.titles[i];
							displayTitleChanged = true;
						}
						// update original title
						var originalTitleChanged = false
						if (formTitleList[i].isOriginalTitle) {
							music.model.originalTitle = music.model.titles[i];
							originalTitleChanged = true;
						// }
						// // if form sets title and title was either not set or was set to different entry or title data has changed
						// if (formTitleList[i].isOriginalTitle && (music.model.originalTitle == null || music.model.originalTitle.id != music.model.titles[i].id || music.model.originalTitle == music.model.titles[i])) {
						// 	console.log("music.model.originalTitle", music.model.originalTitle);
						// 	music.model.originalTitle = music.model.titles[i];
            //   console.log("music.model.originalTitle", music.model.originalTitle);
						// 	originalTitleChanged = true;
						// else if form does not set title and title was set before and title was set to this entry
						} else if (!formTitleList[i].isOriginalTitle && music.model.originalTitle != null && music.model.originalTitle.id == music.model.titles[i].id) {
							music.model.originalTitle = null;
							originalTitleChanged = true;
						}
						if (displayTitleChanged || originalTitleChanged ) {
							await TIMAAT.MusicDatasets.updateMusic(type, music);
						}
					};
				}
				// update existing titles and add new ones
				else if (formTitleList.length > music.model.titles.length) {
					var i = 0;
					for (; i < music.model.titles.length; i++ ) { // update existing titles
						var title = {
							id: music.model.titles[i].id,
							language: {
								id: Number(formTitleList[i].titleLanguageId),
							},
							name: formTitleList[i].title,
						};
						// only update if anything changed
						if (title != music.model.titles[i]) {
							// console.log("TCL: update existing titles (and add new ones)");
							await TIMAAT.MusicDatasets.updateTitle(title, music);
						}
					};
					i = music.model.titles.length;
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
					await TIMAAT.MusicDatasets.addTitles(music, newTitles);
					i = 0;
					for (; i < formTitleList.length; i++) {
						// update display title
						var displayTitleChanged = false;
						if (formTitleList[i].isDisplayTitle) {
							music.model.displayTitle = music.model.titles[i];
							displayTitleChanged = true;
						}
						// update original title
						var originalTitleChanged = false
						if (formTitleList[i].isOriginalTitle) {
							music.model.originalTitle = music.model.titles[i];
							originalTitleChanged = true;
						// if (formTitleList[i].isOriginalTitle && (music.model.originalTitle == null || music.model.originalTitle.id != music.model.titles[i].id || music.model.originalTitle == music.model.titles[i])) {
						// 	music.model.originalTitle = music.model.titles[i];
						// 	originalTitleChanged = true;
						} else if (!formTitleList[i].isOriginalTitle && music.model.originalTitle != null && music.model.originalTitle.id == music.model.titles[i].id) {
							music.model.originalTitle = null;
							originalTitleChanged = true;
						}
						if (displayTitleChanged || originalTitleChanged ) {
							await TIMAAT.MusicDatasets.updateMusic(type, music);
						}
					}
				}
				// update existing titles and delete obsolete ones
				else if (formTitleList.length < music.model.titles.length) {
					var i = 0;
					for (; i < formTitleList.length; i++ ) { // update existing titles
						var title = {
							id: music.model.titles[i].id,
							language: {
								id: Number(formTitleList[i].titleLanguageId),
							},
							name: formTitleList[i].title,
						};
						if (title != music.model.titles[i]) {
							// console.log("TCL: update existing titles (and delete obsolete ones)");
							await TIMAAT.MusicDatasets.updateTitle(title, music);
						}
						// update display title
						var displayTitleChanged = false;
						if (formTitleList[i].isDisplayTitle) {
							music.model.displayTitle = music.model.titles[i];
							displayTitleChanged = true;
						}
						// update original title
						var originalTitleChanged = false
						if (formTitleList[i].isOriginalTitle) {
							music.model.originalTitle = music.model.titles[i];
							originalTitleChanged = true;
						// if (formTitleList[i].isOriginalTitle && (music.model.originalTitle == null || music.model.originalTitle.id != music.model.titles[i].id || music.model.originalTitle == music.model.titles[i])) {
						// 	music.model.originalTitle = music.model.titles[i];
						// 	originalTitleChanged = true;
						} else if (!formTitleList[i].isOriginalTitle && music.model.originalTitle != null && music.model.originalTitle.id == music.model.titles[i].id) {
							music.model.originalTitle = null;
							originalTitleChanged = true;
						}
						if (displayTitleChanged || originalTitleChanged ) {
							await TIMAAT.MusicDatasets.updateMusic(type, music);
						}
					};
					var i = music.model.titles.length - 1;
					for (; i >= formTitleList.length; i-- ) { // remove obsolete titles
						if (music.model.originalTitle != null && music.model.originalTitle.id == music.model.titles[i].id) {
							music.model.originalTitle = null;
							// console.log("TCL: remove originalTitle before deleting title");
							await TIMAAT.MusicDatasets.updateMusic(type, music);
						}
						// console.log("TCL: (update existing titles and) delete obsolete ones");
						TIMAAT.MusicService.removeTitle(music.model.titles[i]);
						music.model.titles.pop();
					}
				}
				// console.log("TCL: show music title form");
				if ($('#musicTab').hasClass('active')) {
					await TIMAAT.UI.refreshDataTable('music');
				} else {
					await TIMAAT.UI.refreshDataTable(type);
				}
				// TIMAAT.UI.addSelectedClassToSelectedItem(type, music.model.id);
				TIMAAT.UI.displayDataSetContent('titles', music, 'music');
			});

			// Cancel add/edit button in titles form functionality
			$('#musicFormTitlesDismissButton').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				TIMAAT.UI.displayDataSetContent('titles', music, 'music');
			});

			// Key press events
			$('#musicFormTitlesSubmitButton').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#musicFormTitlesSubmitButton').trigger('click');
				}
			});

			$('#musicFormTitlesDismissButton').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#musicFormTitlesDismissButton').trigger('click');
				}
			});

			$('#musicDynamicTitleFields').on('keypress', function(event) {
				// event.stopPropagation();
				if (event.which == '13') { // == enter
					event.preventDefault(); // prevent activating delete button when pressing enter in a field of the row
				}
			});

			$('#musicNewTitleFields').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					event.preventDefault();
					$('#musicNewTitleFields').find('[data-role="add"]').trigger('click');
				}
			});
		},

		initActorRoles: function() {
			$('#musicTabActorWithRoles').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				// let type = $('#musicFormMetadata').data('type');
				let type = music.model.musicType.musicTypeTranslations[0].type;
				let name = music.model.displayTitle.name;
				let id = music.model.id;
				TIMAAT.UI.displayDataSetContentArea('musicFormActorWithRoles');
				TIMAAT.UI.displayDataSetContent('actorWithRoles', music, 'music');
				if ( type == 'music') {
					TIMAAT.URLHistory.setURL(null, name + ' · Actors with Roles · ' + type[0].toUpperCase() + type.slice(1), '#music/' + id + '/actorsWithRoles');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Actors with Roles · ' + type[0].toUpperCase() + type.slice(1), '#music/' + type + '/' + id + '/actorsWithRoles');
				}
			});

			// add actor with roles button click
			// $(document).on('click','[data-role="musicNewActorWithRoleFields"] > .form-group [data-role="add"]', async function(event) {
			$(document).on('click','.addMusicHasActorWithRoleButton', async function(event) {
					// console.log("TCL: add new actor with role(s)");
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="musicNewActorWithRoleFields"]');
				var newFormEntry = [];
				if (listEntry.find('select').each(function(){
					newFormEntry.push($(this).val());
				}));
				// var newEntryId = newFormEntry[0];
				// console.log("TCL: newFormEntry", newFormEntry);

				if (!$('#musicFormActorWithRoles').valid() || newFormEntry[1].length == 0) //! temp solution to prevent adding actors without roles
				// if (!$('#musicFormActorWithRoles').valid())
				return false;

				$('.disableOnSubmit').prop('disabled', true);
				$('[id^="musicHasActorWithRoleActorId-"').prop('disabled', false);
				var existingEntriesInForm = $('#musicFormActorWithRoles').serializeArray();
				$('[id^="musicHasActorWithRoleActorId-"').prop('disabled', true);
				$('.disableOnSubmit').prop('disabled', false);
				// console.log("TCL: existingEntriesInForm", existingEntriesInForm);

				// create list of actorIds that the music is already connected with
				var existingEntriesIdList = [];
				var i = 0;
				for (; i < existingEntriesInForm.length; i++) {
					if (existingEntriesInForm[i].name == "actorId") {
						existingEntriesIdList.push(Number(existingEntriesInForm[i].value));
					}
				}
				existingEntriesIdList.pop(); // remove new actor id
				// console.log("TCL: existingEntriesIdList", existingEntriesIdList);
				// check for duplicate music-actor relation. only one allowed
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
					var newActorSelectData = $('#musicHasActorWithRoleActorId').select2('data');
					var newActorId = newActorSelectData[0].id;
					var newRoleSelectData = $('#musicActorWithRolesMultiSelectDropdown').select2('data');
					// var actorHasRoleIds = newFormEntry[1];
					$('#musicDynamicActorWithRoleFields').append(TIMAAT.MusicDatasets.appendActorWithRolesDataset(existingEntriesIdList.length, newActorId));
					TIMAAT.MusicDatasets.getMusicHasActorWithRoleData(newActorId);
					// select actor for new entry
					await TIMAAT.ActorService.getActor(newActorId).then(function (data) {
						var actorSelect = $('#musicHasActorWithRoleActorId-'+newActorId);
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
					$('#musicHasActorWithRoleActorId-'+newActorId).prop('disabled', true);

					// provide roles list for new actor entry
					TIMAAT.MusicDatasets.getMusicHasActorWithRolesDropdownData(newActorId);

					var roleSelect = $('#musicActorWithRolesMultiSelectDropdown-'+newActorId);
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
					$('#musicHasActorWithRoleActorId').val(null).trigger('change');
					// $('#musicHasActorWithRoleActorId').prop('required', true);
					$('#musicActorWithRolesMultiSelectDropdown').val(null).trigger('change');
					// $('#musicActorWithRolesMultiSelectDropdown').prop('required', true);
				}
				else { // duplicate actor
					$('#musicDatasetsActorWithRoleDuplicateModal').modal('show');
				}
			});

			// remove actor with roles button click
			// $(document).on('click','[data-role="musicDynamicActorWithRoleFields"] > .form-group [data-role="remove"]', async function(event) {
			$(document).on('click','.removeMusicHasActorWithRoleButton', async function(event) {
				// console.log("TCL: remove actor with role(s)");
				event.preventDefault();
				$(this).closest('.form-group').remove();
			});

			// submit actor with roles button functionality
			$('#musicFormActorWithRolesSubmitButton').on('click', async function(event) {
				// console.log("TCL: ActorWithRole form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("musicNewActorWithRoleFields");
				while (node.lastChild) {
					node.removeChild(node.lastChild);
				}

				//! temp solution to prevent adding actors without roles
				//TODO

				// test if form is valid
				if (!$('#musicFormActorWithRoles').valid()) {
					$('[data-role="musicNewActorWithRoleFields"]').append(this.appendNewActorHasRolesField());
					return false;
				}

				var music = $('#musicFormMetadata').data('music');

				// Create/Edit actor window submitted data
				$('.disableOnSubmit').prop('disabled', true);
				$('[id^="musicHasActorWithRoleActorId-"').prop('disabled', false);
				var formDataRaw = $('#musicFormActorWithRoles').serializeArray();
				$('[id^="musicHasActorWithRoleActorId-"').prop('disabled', true);
				$('.disableOnSubmit').prop('disabled', false);
				// console.log("TCL: formDataRaw", formDataRaw);

				var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });

				var formEntryIds = []; // List of all actors containing role data for this music
				var i = 0;
				for (; i < formDataRaw.length; i++) {
					if (formDataRaw[i].name == 'actorId') {
						formEntryIds.push(Number(formDataRaw[i].value));
					}
				}
				// console.log("TCL: Actor Ids in form", formEntryIds);
				// create actor id list for all already existing roles
				i = 0;
				var actorList = await TIMAAT.MusicService.getActorList(music.model.id);
        // console.log("TCL: Actors of current Music", actorList);
				var existingEntriesIdList = [];
				for (; i < actorList.length; i++) {
					existingEntriesIdList.push(actorList[i].id);
				}
				// DELETE actor with roles data if id is in existingEntriesIdList but not in formEntryIds
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
						// console.log("TCL: Actor removed: REMOVE music has actor (with all roles) datasets:", music.model.id, existingEntriesIdList[i]);
						await TIMAAT.MusicService.removeActorFromMusicHasActorWithRoles(music.model.id, existingEntriesIdList[i]);
						existingEntriesIdList.splice(i,1);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				// console.log("TCL: DELETE actorWithRole (end)");
				// ADD actor with roles data if id is not in existingEntriesIdList but in formEntryIds
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
						var roleSelectData = $('#musicActorWithRolesMultiSelectDropdown-'+formEntryIds[i]).select2('data');
						// console.log("TCL: roleSelectData", roleSelectData);
						var k = 0;
						for (; k < roleSelectData.length; k++) {
							// console.log("TCL: New Actor: ADD music has actor with role dataset: ", music.model.id, formEntryIds[i], Number(roleSelectData[k].id));
							await TIMAAT.MusicService.addMusicHasActorWithRoles(music.model.id, formEntryIds[i], Number(roleSelectData[k].id));
						}
						formEntryIds.splice(i,1);
            // console.log("TCL: formEntryIds", formEntryIds);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				// console.log("TCL: ADD new actorWithRole (end)");
				//* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
				// UPDATE actor with roles data if id is in existingEntriesIdList and in formEntryIds
				i = 0;
				for (; i < existingEntriesIdList.length; i++) {
					// console.log("TCL: check for UPDATE ACTOR: ", existingEntriesIdList[i]);
					var existingRoles = await TIMAAT.MusicService.getActorHasRoleList(music.model.id, existingEntriesIdList[i]);
          // console.log("TCL: existingRoles", existingRoles);
					var existingRoleIds = [];
					var j = 0;
					for (; j < existingRoles.length; j++) {
						existingRoleIds.push(existingRoles[j].id);
					}
					// console.log("TCL: existing role ids for the current actor", existingRoleIds);
					var roleSelectData = $('#musicActorWithRolesMultiSelectDropdown-'+existingEntriesIdList[i]).select2('data');
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
							// console.log("TCL: role removed: REMOVE music has actor with role dataset: ", music.model.id, existingEntriesIdList[i], existingRoleIds[j]);
							await TIMAAT.MusicService.removeRoleFromMusicHasActorWithRoles(music.model.id, existingEntriesIdList[i], existingRoleIds[j]);
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
							// console.log("TCL: role added: ADD music has actor with role dataset: ", music.model.id, existingEntriesIdList[i], roleSelectIds[j]);
							await TIMAAT.MusicService.addMusicHasActorWithRoles(music.model.id, existingEntriesIdList[i], roleSelectIds[j]);
							roleSelectIds.splice(j,1);
							// console.log("TCL: roleSelectIds", roleSelectIds);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					// no UPDATE as music-actor-role table only has ids and no information stored
				}
				music.model = await TIMAAT.MusicService.getMusic(music.model.id);
				// music.updateUI();
				TIMAAT.UI.displayDataSetContent('actorWithRoles', music, 'music');
			});

			// cancel add/edit button in titles form functionality
			$('#musicFormActorWithRolesDismissButton').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				TIMAAT.UI.displayDataSetContent('actorWithRoles', music, 'music');
			});

		},

		initMediumHasMusicList: function() {
			$('#musicTabMediumHasMusicList').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				// let type = $('#musicFormMetadata').data('type');
				let type = music.model.musicType.musicTypeTranslations[0].type;
				let name = music.model.displayTitle.name;
				let id = music.model.id;
				TIMAAT.UI.displayDataSetContentArea('musicFormMediumHasMusicList');
				TIMAAT.MusicDatasets.setMediumHasMusicList(music);
				TIMAAT.UI.displayDataSetContent('mediumHasMusicList', music, 'music');
				if ( type == 'music') {
					TIMAAT.URLHistory.setURL(null, name + ' · Media containing this Music · ' + type[0].toUpperCase() + type.slice(1), '#music/' + id + '/mediumHasMusicList');
				} else {
					TIMAAT.URLHistory.setURL(null, name + ' · Media containing this Music · ' + type[0].toUpperCase() + type.slice(1), '#music/' + type + '/' + id + '/mediumHasMusicList');
				}
			});

			// add medium has music list button click
			// $(document).on('click','[data-role="musicNewMediumHasMusicFields"] > .form-group [data-role="add"]', async function(event) {
			$(document).on('click','.addMusicIsInMediumButton', async function(event) {
					// console.log("TCL: add new medium with music(s)");
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="musicNewMediumHasMusicFields"]');
				var newFormEntry = [];
				var newEntryId = null;
				if (listEntry.find('select').each(function(){
					newEntryId = Number($(this).val());
				}));
				if (listEntry.find('input').each(function(){
					newFormEntry.push($(this).val());
				}));

				if (!$('#musicFormMediumHasMusicList').valid()) {
					return false;
				}

				var music = $('#musicFormMetadata').data('music');

				$('.musicDatasetMusicMediumHasMusicMediumId').prop('disabled', false);
				$('.disableOnSubmit').prop('disabled', true);
				var existingEntriesInForm = $('#musicFormMediumHasMusicList').serializeArray();
				$('.disableOnSubmit').prop('disabled', false);

				// create list of mediumIds that the music is already connected with
				var existingEntriesIdList = [];
				var i = 0;
				for (; i < existingEntriesInForm.length; i++) {
					if (existingEntriesInForm[i].name == "mediumId") {
						existingEntriesIdList.push(Number(existingEntriesInForm[i].value));
					}
				}
				existingEntriesIdList.pop(); // remove new medium id
				// check for duplicate music-medium relation. only one allowed
				var duplicate = false;
				i = 0;
				while (i < existingEntriesIdList.length) {
					if (newFormEntry[0] == existingEntriesIdList[i]) {
						duplicate = true;
						break;
					}
					i++;
				}

				if (!duplicate) {
					// var newMediumSelectData = $('#mediumHasMusicMediumId').select2('data');
					var newEntryDetails = [];
					i = 0;
					var j = 0;
					for (; j < newFormEntry.length -3; i++) { // -3 for empty fields of new entry that is not added yet
						newEntryDetails[i] = {
							mediumHasMusicMusicId : music.model.id,
							mediumHasMusicMediumId: newEntryId,
							id                    : Number(newFormEntry[j]), // == 0
							startTime             : newFormEntry[j+1],
							endTime               : newFormEntry[j+2]
						};
            // console.log("TCL: newEntryDetails[i]", newEntryDetails[i]);
						j += 3;
					}
					// console.log("TCL: newEntryDetails", newEntryDetails);
					// var newMediumId = newMediumSelectData[0].id;
					let mediumName = await TIMAAT.MediumService.getMediumDisplayTitle(newEntryId);
          // console.log("TCL: $ -> mediumName", mediumName);
					var appendNewFormDataEntry = TIMAAT.MusicDatasets.appendMediumHasMusicDataset(existingEntriesIdList.length, newEntryId, mediumName, newEntryDetails, 'sr-only', true);
					$('#musicDynamicMediumHasMusicFields').append(appendNewFormDataEntry);
					$('.musicDatasetMusicMediumHasMusicMediumId').prop('disabled', true);

					$('[data-role="newMediumHasMusicFields"]').find('[data-role="mediumHasMusicDetailEntry"]').remove();
					if (listEntry.find('input').each(function(){
						$(this).val('');
					}));
					if (listEntry.find('select').each(function(){
						$(this).val('');
					}));
					// $('.musicDatasetsMusicMediumHasMusicStartTime').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
					// $('.musicDatasetsMusicMediumHasMusicEndTime').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				}
				else { // duplicate medium
					$('#musicDatasetsMediumHasMusicDuplicateModal').modal('show');
				}
			});

			// add medium has music detail button click
			// $(document).on('click', '.form-group [data-role="addMediumHasMusicDetail"]', async function(event) {
			$(document).on('click', '.addMediumHasMusicDetailButton', async function(event) {
					// console.log("TCL: MediumHasMusic form: add details to mediumHasMusic");
				event.preventDefault();
				var listEntry = $(this).closest('[data-role="newMusicIsInMediumDetailFields"]');
				var newMusicInMediumData = [];
				var mediumId = $(this).closest(('[data-role="musicIsInMediumEntry"]')).attr("data-medium-id");
				if (listEntry.find('input').each(function(){
					newMusicInMediumData.push($(this).val());
				}));
				// if (newMusicInMediumData[1] == "" && newMusicInMediumData[2] == "") { // [0] is hidden id field
				// 	// console.log("no data entered");
				// 	return false; // don't add if all add fields were empty
				// }
				var newMediumHasMusicDetailEntry = {
					id: 0,
					startTime: newMusicInMediumData[1],
					endTime: newMusicInMediumData[2]
				};
        // console.log("TCL: $ -> newMediumHasMusicDetailEntry", newMediumHasMusicDetailEntry);
				var dataId = $(this).closest('[data-role="musicIsInMediumEntry"]').attr('data-id');
				var dataDetailId = $(this).closest('[data-role="newMusicIsInMediumDetailFields"]').attr("data-detail-id");
				$(this).closest('[data-role="newMusicIsInMediumDetailFields"]').before(TIMAAT.MusicDatasets.appendMediumHasMusicDetailFields(dataId, dataDetailId, mediumId, newMediumHasMusicDetailEntry, 'sr-only'));

				$('[data-role="mediumId['+mediumId+']"]').find('option[value='+mediumId+']').attr('selected', true);
				if (listEntry.find('input').each(function(){
					$(this).val('');
				}));
				if (listEntry.find('select').each(function(){
					$(this).val('');
				}));
				// $('.musicDatasetsMusicMediumHasMusicStartTime').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				// $('.musicDatasetsMusicMediumHasMusicEndTime').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			});

			// remove medium has music list button click
			// $(document).on('click','[data-role="musicDynamicMediumHasMusicFields"] > .form-group [data-role="remove"]', async function(event) {
			$(document).on('click','.removeMediumHasMusicButton', async function(event) {
					event.preventDefault();
				$(this).closest('.form-group').remove();
			});

			// remove medium has music detail button click
			$(document).on('click','.form-group [data-role="removeMediumHasMusicDetail"]', async function(event) {
				event.preventDefault();
				$(this).closest('.form-group').remove();
			});

			// submit medium has music list button functionality
			$('#musicFormMediumHasMusicListSubmitButton').on('click', async function(event) {
				// console.log("TCL: MediumHasMusic form: submit");
				// add rules to dynamically added form fields
				event.preventDefault();
				var node = document.getElementById("musicNewMediumHasMusicFields");
				while (node.lastChild) {
					node.removeChild(node.lastChild);
				}
				// the original music model (in case of editing an existing music dataset)
				let music = $('#musicFormMetadata').data('music');
				let type = music.model.musicType.musicTypeTranslations[0].type;

				// test if form is valid
				if (!$('#musicFormMediumHasMusicList').valid()) {
					$('[data-role="musicNewMediumHasMusicFields"]').append(this.appendNewMediumHasMusicListField());
					$('#mediumSelectDropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/medium/selectList/',
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
					return false;
				}

				// Create/Edit medium window submitted data
				$('.musicDatasetMusicMediumHasMusicMediumId').prop('disabled', false);
				$('.disableOnSubmit').prop('disabled', true);
				var formData = $('#musicFormMediumHasMusicList').serializeArray();
				$('.disableOnSubmit').prop('disabled', false);
				// console.log("TCL: formData", formData);
				var formEntries = [];
				var formEntryIds = []; // List of all media containing detail data for this music
				var formEntriesIdIndexes = []; // Index list of all mediumIds and number of detail sets
				var i = 0;
				for (; i < formData.length; i++) {
					if (formData[i].name == 'mediumId') {
						formEntriesIdIndexes.push({entryIndex: i, numDetailSets: 0});
					}
				}
				var numDetailElements = 3; // hidden detailId, startTime, EndTime
				i = 0;
				for (; i < formEntriesIdIndexes.length; i++) {
					if (i < formEntriesIdIndexes.length -1) {
						formEntriesIdIndexes[i].numDetailSets = (formEntriesIdIndexes[i+1].entryIndex - formEntriesIdIndexes[i].entryIndex - 2) / numDetailElements;
					} else { // last entry has to be calculated differently
						formEntriesIdIndexes[i].numDetailSets = (formData.length - formEntriesIdIndexes[i].entryIndex - 2) / numDetailElements;
					}
				}
				i = 0;
				for (; i < formEntriesIdIndexes.length; i++) {
						var element = {
							musicId: music.model.id ,
							mediumId: Number(formData[formEntriesIdIndexes[i].entryIndex].value),
							mediumHasMusicDetailList: []
						};
						formEntryIds.push(Number(formData[formEntriesIdIndexes[i].entryIndex].value));
					var j = 0;
					for (; j < formEntriesIdIndexes[i].numDetailSets; j++) {
						var detail = {
							id: Number(formData[formEntriesIdIndexes[i].entryIndex+numDetailElements*j+2].value),
							startTime: TIMAAT.Util.parseTime(formData[formEntriesIdIndexes[i].entryIndex+numDetailElements*j+3].value),
							endTime: TIMAAT.Util.parseTime(formData[formEntriesIdIndexes[i].entryIndex+numDetailElements*j+4].value),
						};
						element.mediumHasMusicDetailList.push(detail);
            // console.log("TCL: detail", detail);
					}
					formEntries.push(element);
				}
				// create medium id list for all already existing mediumHasMusicDetailList entries
				i = 0;
				var existingEntriesIdList = [];
				// console.log("TCL: $ -> music.model", music.model);
				for (; i < music.model.mediumHasMusicList.length; i++) {
					existingEntriesIdList.push(music.model.mediumHasMusicList[i].id.mediumId); //?
				}
				// DELETE mediumHasMusic data if id is in existingEntriesIdList but not in formEntryIds
				i = 0;
				for (; i < existingEntriesIdList.length; i++) {
					// console.log("TCL: check for DELETE MEDIUM: ", existingEntriesIdList[i]);
					var j = 0;
					var deleteDataset = true;
					for (; j < formEntryIds.length; j ++) {
						if (existingEntriesIdList[i] == formEntryIds[j]) {
							deleteDataset = false;
							break; // no need to check further if match was found
						}
					}
					if (deleteDataset) {
						await TIMAAT.MusicService.removeMediumHasMusic(music.model.mediumHasMusicList[i]);
						music.model.mediumHasMusicList.splice(i,1); // TODO should be moved to MusicDatasets.removeMediumHasMusic(..)
						existingEntriesIdList.splice(i,1);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				// ADD mediumHasMusic data if id is not in existingEntriesIdList but in formEntryIds
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
						await TIMAAT.MusicDatasets.addMediumHasMusic(music, formEntries[i]);
						formEntryIds.splice(i,1);
						formEntries.splice(i,1);
						i--; // so the next list item is not jumped over due to the splicing
					}
				}
				//* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
				// UPDATE mediumHasMusic data if id is in existingEntriesIdList and in formEntryIds
				i = 0;
				for (; i < existingEntriesIdList.length; i++) {
					// console.log("TCL: check for UPDATE COLLECTIVE: ", existingEntriesIdList[i]);
					// find corresponding mediumHasMusic id/index
					var currentMediumHasMusicIndex = -1;
					var j = 0;
					for (; j < music.model.mediumHasMusicList.length; j++) {
						if (existingEntriesIdList[i] == music.model.mediumHasMusicList[j].id.mediumId) { //?
							currentMediumHasMusicIndex = j;
							break; // no need to check further if index was found
						}
					}
					var currentMediumHasMusic = music.model.mediumHasMusicList[currentMediumHasMusicIndex];
					// var currentMediumHasMusicId = music.model.mediumHasMusicList[currentMediumHasMusicIndex].id.mediumId; //?

					// go through all mediumHasMusicDetailList and update/delete/add entries
					// create mediumHasMusicDetailList id list for all already existing mediumHasMusic with this medium
					var existingMediumHasMusicDetailIdList = [];
					j = 0;
					for (; j < currentMediumHasMusic.mediumHasMusicDetailList.length; j++) {
						existingMediumHasMusicDetailIdList.push(currentMediumHasMusic.mediumHasMusicDetailList[j].id);
					}
					// create mediumHasMusicDetailList id list for all form mediumHasMusic for this medium
					var formMediumHasMusicDetailIdList = [];
					j = 0;
					for (; j < formEntries[i].mediumHasMusicDetailList.length; j++ ) {
						formMediumHasMusicDetailIdList.push(formEntries[i].mediumHasMusicDetailList[j].id);
					}
					// DELETE mediumHasMusicDetailList data if id is in existingMediumHasMusicDetailIdList but not in mediumHasMusicDetailList of formEntries
					j = 0;
					for (; j < existingMediumHasMusicDetailIdList.length; j++) {
						var k = 0;
						var deleteDataset = true;
						for (; k < formMediumHasMusicDetailIdList.length; k++) { // 'j' since both mediumHasMusic id lists match after delete and add mediumHasMusic operations
							if (existingMediumHasMusicDetailIdList[j] == formMediumHasMusicDetailIdList[k]) {
								deleteDataset = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteDataset) {
							await TIMAAT.MusicService.removeMediumHasMusicDetail(music.model.mediumHasMusicList[i].mediumHasMusicDetailList[j]);
							music.model.mediumHasMusicList[i].mediumHasMusicDetailList.splice(j,1); // TODO should be moved to MusicDatasets.removeMediumHasMusicDetail(..)
							existingMediumHasMusicDetailIdList.splice(j,1);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					// console.log("TCL: DELETE mediumHasMusicDetailList (end)");
					// ADD mediumHasMusicDetailList data if id is not in existingMediumHasMusicDetailIdList but in mediumHasMusicDetailList of formEntries
					j = 0;
					var newMediumHasMusicDetail;
					for (; j < formMediumHasMusicDetailIdList.length; j++) {
						if (formMediumHasMusicDetailIdList[j] == 0) {
							newMediumHasMusicDetail = await TIMAAT.MusicService.addMediumHasMusicDetail(music.model.id, formEntries[i].mediumId, formEntries[i].mediumHasMusicDetailList[j]);
							music.model.mediumHasMusicList[i].mediumHasMusicDetailList.push(newMediumHasMusicDetail);
							formMediumHasMusicDetailIdList.splice(j,1);
							j--; // so the next list item is not jumped over due to the splicing
						}
					}
					//* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
					// UPDATE mediumHasMusicDetailList data if id is in existingMediumHasMusicDetailIdList and in mediumHasMusicDetailList of formEntries
					j = 0;
					for (; j < existingMediumHasMusicDetailIdList.length; j++) {
						await TIMAAT.MusicService.updateMediumHasMusicDetail(formEntries[i].mediumHasMusicDetailList[j]);
						music.model.mediumHasMusicList[i].mediumHasMusicDetailList[j] = formEntries[i].mediumHasMusicDetailList[j];
					}
				}
				if ($('#musicTab').hasClass('active')) {
					await TIMAAT.UI.refreshDataTable('music');
				} else {
					await TIMAAT.UI.refreshDataTable(type);
				}
				// music.updateUI();
				TIMAAT.UI.displayDataSetContent('mediumHasMusicList', music, 'music');
			});

			// cancel add/edit button in titles form functionality
			$('#musicFormMediumHasMusicListDismissButton').on('click', function(event) {
				let music = $('#musicFormMetadata').data('music');
				TIMAAT.UI.displayDataSetContent('mediumHasMusicList', music, 'music');
			});

		},

		load: function() {
      this.loadMusicList();
		},

    loadMusicList: function() {
      $('#musicFormMetadata').data('type', 'music');
      // $('#musicVideoPreview').get(0).pause(); // TODO check if needed
      this.setMusicList();
      TIMAAT.UI.addSelectedClassToSelectedItem('music', null);
      TIMAAT.UI.subNavTab = 'dataSheet';
    },

		loadMusicDataTables: function() {
      this.setupMusicDataTable();
			this.setupNashidDataTable();
			this.setupChurchMusicDataTable();
		},

		loadMusicSubtype: function(type) {
    	// console.log("TCL: $ -> type", type);
			$('#musicFormMetadata').data('type', type);
			// $('#musicVideoPreview').get(0).pause(); // TODO check if needed
			TIMAAT.UI.addSelectedClassToSelectedItem(type, null);
			TIMAAT.UI.subNavTab = 'dataSheet';
			this.showAddMusicButton();
			// TIMAAT.UI.clearLastSelection(type);
			switch (type) {
				case 'nashid':
					this.setNashidList();
				break;
				case 'churchMusic':
					this.setChurchMusicList();
				break;
			};
		},

    setMusicList: function() {
      if (this.musicList == null) return;

      // set ajax data source
      if (this.dataTableMusic) {
        this.dataTableMusic.ajax.reload(null, false);
        TIMAAT.UI.clearLastSelection('music');
      }
      this.musicLoaded = true;
    },

		setNashidList: function() {
			// console.log("TCL: setNashidList");
			if ( this.nashidList == null ) return;

			// set ajax data source
			if ( this.dataTableNashid ) {
				this.dataTableNashid.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('nashid');
			}
		},

		setChurchMusicList: function() {
			// console.log("TCL: setChurchMusicList");
			if ( this.churchMusicList == null ) return;

			// set ajax data source
			if ( this.dataTableChurchMusic ) {
				this.dataTableChurchMusic.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('churchMusic');
			}
		},

		setMusicTitleList: function(music) {
			// console.log("TCL: setMusicTitleList -> music", music);
			if ( !music ) return;
			// setup model
			var musicTitles = Array();
			music.model.titles.forEach(function(title) {
				if ( title.id > 0 )
					musicTitles.push(title);
			});
			this.titles = musicTitles;
		},

		setMediumHasMusicList: function(music) {
			if ( !music ) return;
			// setup model
			var mediumHasMusicList = Array();
			music.model.mediumHasMusicList.forEach(function(mediumHasMusic) {
				if ( mediumHasMusic.id.musicId > 0 && mediumHasMusic.id.mediumId > 0 )
				mediumHasMusicList.push(mediumHasMusic);
			});
			this.mediumHasMusicList = mediumHasMusicList;
		},

    addMusic: function(type) {
      // console.log("TCL: addMusic: type", type);
			TIMAAT.UI.displayDataSetContentContainer('musicTabMetadata', 'musicFormMetadata');
			$('.addMusicButton').hide();
			$('.addMusicButton').prop('disabled', true);
			$('.addMusicButton :input').prop('disabled', true);
			$('#musicFormMetadata').data('type', type);
			$('#musicFormMetadata').data('music', null);
			$('#musicChurchMusicMusicalKeySelectDropdown').empty().trigger('change');
			$('#musicDisplayTitleLanguageSelectDropdown').empty().trigger('change');
			$('#musicDynamicMarkingSelectDropdown').empty().trigger('change');
			$('#musicMusicalKeySelectDropdown').empty().trigger('change');
			$('#musicNashidJinsSelectDropdown').empty().trigger('change');
			$('#musicNashidMaqamSelectDropdown').empty().trigger('change');
			$('#musicPrimarySourceMediumSelectDropdown').empty().trigger('change');
			$('#musicTempoMarkingSelectDropdown').empty().trigger('change');
			$('#musicTextSettingSelectDropdown').empty().trigger('change');
			$('#voiceLeadingPatternMultiSelectDropdown').val(null).trigger('change');
			var node = document.getElementById('musicHasVoiceLeadingPatternFields');
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
			musicFormMetadataValidator.resetForm();
			// $('#musicVideoPreview').get(0).pause(); // TODO check if needed

			TIMAAT.UI.addSelectedClassToSelectedItem(type, null);
			TIMAAT.UI.subNavTab = 'dataSheet';
			$('#musicFormMetadata').trigger('reset');

			// setup form
			this.initFormDataSheetData(type);
			this.getMusicFormChurchMusicalKeyDropdownData();
			this.getMusicFormDynamicMarkingDropdownData();
			this.getMusicFormJinsDropdownData();
			this.getMusicFormMaqamDropdownData();
			this.getMusicFormMusicalKeyDropdownData();
			this.getMusicFormMediumDropdownData();
			this.getMusicFormTempoMarkingDropdownData();
			this.getMusicFormTextSettingElementTypeDropdownData();
			this.getMusicFormTitleLanguageDropdownData();
			this.initFormDataSheetForEdit();
			$('#musicFormMetadataSubmitButton').html('Add');
			$('#musicFormHeader').html("Add "+type);

			$('#musicHasVoiceLeadingPatternFields').append(this.appendMusicHasVoiceLeadingPatternsDataset());
      $('#voiceLeadingPatternMultiSelectDropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/music/voiceLeadingPattern/selectList',
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

    musicFormDataSheet: async function(action, type, data) {
      // console.log("TCL: action, type, data", action, type, data);
			// TIMAAT.UI.addSelectedClassToSelectedItem(type, data.model.id);
			var node = document.getElementById('musicHasVoiceLeadingPatternFields');
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
			$('#musicFormMetadata').trigger('reset');
			this.initFormDataSheetData(type);
			musicFormMetadataValidator.resetForm();
			// $('#musicVideoPreview').get(0).pause(); // TODO check if needed

			this.getMusicFormChurchMusicalKeyDropdownData();
			this.getMusicFormDynamicMarkingDropdownData();
			this.getMusicFormJinsDropdownData();
			this.getMusicFormMaqamDropdownData();
			this.getMusicFormMusicalKeyDropdownData();
			this.getMusicFormMediumDropdownData();
			this.getMusicFormTempoMarkingDropdownData();
			this.getMusicFormTextSettingElementTypeDropdownData();
			this.getMusicFormTitleLanguageDropdownData();
			var languageSelect = $('#musicDisplayTitleLanguageSelectDropdown');
			var option = new Option(data.model.displayTitle.language.name, data.model.displayTitle.language.id, true, true);
			languageSelect.append(option).trigger('change');
			$('#musicHasVoiceLeadingPatternFields').append(this.appendMusicHasVoiceLeadingPatternsDataset());
			this.getMusicFormVoiceLeadingPatternDropdownData();

			if ( action == 'show' ) {
				$('#musicFormMetadata :input').prop('disabled', true);
				$('.formButtons').prop('disabled', false);
				$('.formButtons :input').prop('disabled', false);
				$('.formButtons').show();
				this.initFormForShow(data.model.id);
				$('#musicFormMetadataSubmitButton').hide();
				$('#musicFormMetadataDismissButton').hide();
				$('#musicFormHeader').html(type+" Data Sheet (#"+ data.model.id+')');
				$('#musicDisplayTitleLanguageSelectDropdown').select2('destroy').attr("readonly", true);
				$('#musicDynamicMarkingSelectDropdown').select2('destroy').attr("readonly", true);
				$('#musicMusicalKeySelectDropdown').select2('destroy').attr("readonly", true);
				$('#musicPrimarySourceMediumSelectDropdown').select2('destroy').attr("readonly", true);
				$('#musicTempoMarkingSelectDropdown').select2('destroy').attr("readonly", true);
				$('#musicTextSettingSelectDropdown').select2('destroy').attr("readonly", true);
				switch(type) {
					case 'nashid':
						$('#musicNashidJinsSelectDropdown').select2('destroy').attr("readonly", true);
						$('#musicNashidMaqamSelectDropdown').select2('destroy').attr("readonly", true);
					break;
					case 'churchMusic':
						$('#musicChurchMusicMusicalKeySelectDropdown').select2('destroy').attr("readonly", true);
					break;
				}
			}
			else if ( action == 'edit' ) {
				this.initFormDataSheetForEdit();
				$('.addMusicButton').hide();
				$('.addMusicButton').prop('disabled', true);
				$('.addMusicButton :input').prop('disabled', true);
				$('#musicFormMetadataSubmitButton').html('Save');
				$('#musicFormHeader').html("Edit "+type);
			}

			// setup UI
			// music data
			$('#musicDatasetsMetadataMusicTypeId').val(data.model.musicType.id);
			$('#musicTempo').val(data.model.tempo);
			$('#musicBeat').val(data.model.beat);
			$('#musicRemark').val(data.model.remark);
			$('#music-instrumentation').val(data.model.instrumentation);
			if (data.model.dynamicMarking) {
				var dynamicMarkingSelect = $('#musicDynamicMarkingSelectDropdown');
				var option = new Option(data.model.dynamicMarking.dynamicMarkingTranslations[0].type, data.model.dynamicMarking.id, true, true);
				dynamicMarkingSelect.append(option).trigger('change');
			} else {
				$('#musicDynamicMarkingSelectDropdown').empty().trigger('change');
			}
			if (data.model.musicalKey) {
				var musicalKeySelect = $('#musicMusicalKeySelectDropdown');
				var option = new Option(data.model.musicalKey.musicalKeyTranslations[0].type, data.model.musicalKey.id, true, true);
				musicalKeySelect.append(option).trigger('change');
			} else {
				$('#musicMusicalKeySelectDropdown').empty().trigger('change');
			}
			let medium = await TIMAAT.MusicService.getMediumByMusicId(data.model.id);
			if (medium) {
				var mediumSelect = $('#musicPrimarySourceMediumSelectDropdown');
				var option = new Option(medium.displayTitle.name, medium.id, true, true);
				mediumSelect.append(option).trigger('change');
			} else {
				$('#musicPrimarySourceMediumSelectDropdown').empty().trigger('change');
			}
			if (data.model.tempoMarking) {
				var tempoMarkingSelect = $('#musicTempoMarkingSelectDropdown');
				var option = new Option(data.model.tempoMarking.tempoMarkingTranslations[0].type, data.model.tempoMarking.id, true, true);
				tempoMarkingSelect.append(option).trigger('change');
			} else {
				$('#musicTempoMarkingSelectDropdown').empty().trigger('change');
			}
			if (data.model.musicTextSettingElementType) {
				var musicTextSettingElementTypeSelect = $('#musicTextSettingSelectDropdown');
				var option = new Option(data.model.musicTextSettingElementType.musicTextSettingElementTypeTranslations[0].type, data.model.musicTextSettingElementType.id, true, true);
				musicTextSettingElementTypeSelect.append(option).trigger('change');
			} else {
				$('#musicTextSettingSelectDropdown').empty().trigger('change');
			}
			var voiceLeadingPatternSelect = $('#voiceLeadingPatternMultiSelectDropdown');
      await TIMAAT.MusicService.getMusicHasVoiceLeadingPatternList(data.model.id).then(function (data) {
        // console.log("TCL: then: data", data);
        if (data.length > 0) {
          data.sort((a, b) => (a.name > b.name)? 1 : -1);
          // create the options and append to Select2
          var i = 0;
          for (; i < data.length; i++) {
            var option = new Option(data[i].voiceLeadingPatternTranslationList[0].type, data[i].id, true, true);
            voiceLeadingPatternSelect.append(option).trigger('change');
          }
          // manually trigger the 'select2:select' event
          voiceLeadingPatternSelect.trigger({
            type: 'select2:select',
            params: {
              data: data
            }
          });
        }
      });
			// display-title data
			$('#musicDatasetsMetadataMusicTitle').val(data.model.displayTitle.name);

			// music subtype specific data
			switch (type) {
				case 'nashid':
					// set jins data
					if (data.model.musicNashid.jins) {
						var jinsSelect = $('#musicNashidJinsSelectDropdown');
						var option = new Option(data.model.musicNashid.jins.jinsTranslations[0].type, data.model.musicNashid.jins.id, true, true);
						jinsSelect.append(option).trigger('change');
					} else {
						$('#musicNashidJinsSelectDropdown').empty().trigger('change');
					}
					// set maqam data
					if (data.model.musicNashid.maqam) {
						let maqamSelect = $('#musicNashidMaqamSelectDropdown');
						var option = new Option(data.model.musicNashid.maqam.maqamSubtype.maqamSubtypeTranslations[0].subtype, data.model.musicNashid.maqam.id, true, true);
						maqamSelect.append(option).trigger('change');
					} else {
						$('#musicNashidMaqamSelectDropdown').empty().trigger('change');
					}
				break;
				case 'churchMusic':
					// set church music data
					if (data.model.musicChurchMusic.churchMusicalKey) {
						var churchMusicSelect = $('#musicChurchMusicMusicalKeySelectDropdown');
						var option = new Option(data.model.musicChurchMusic.churchMusicalKey.churchMusicalKeyTranslations[0].type, data.model.musicChurchMusic.churchMusicalKey.id, true, true);
						churchMusicSelect.append(option).trigger('change');
					} else {
						$('#musicChurchMusicMusicalKeySelectDropdown').empty().trigger('change');
					}
				break;
			}
			$('#musicFormMetadata').data('music', data);
    },

    musicFormPreview: async function(type, data) {
			// console.log("TCL: musicFormPreview - type, data", type, data);
			// TIMAAT.UI.addSelectedClassToSelectedItem(type, data.model.id);
			$('#musicFormPreview').trigger('reset');
			// musicFormMetadataValidator.resetForm();

			// handling if type is 'music' and user is in all music view
			if (type == 'music') type = data.model.musicType.musicTypeTranslations[0].type;
			let mediumType = null;
			let medium = await TIMAAT.MusicService.getMediumByMusicId(data.model.id);
			if (medium) mediumType = medium.mediaType.mediaTypeTranslations[0].type;

			$('#musicFormPreview :input').prop('disabled', true);
			if (medium && medium.fileStatus && medium.fileStatus != 'noFile' && (mediumType == 'video' || mediumType == 'image' ||mediumType == 'audio')) {
				$('.musicFormDataSheetAnnotateButton').prop('disabled', false);
				$('#musicAudioPreview').hide();
				$('#musicImagePreview').hide();
				$('#musicVideoPreview').hide();
				switch (mediumType) {
					case 'audio': // TODO check audioPreview functionality
						$('#musicAudioPreview').attr('src', '/TIMAAT/api/medium/audio/'+medium.id+'/download'+'?token='+medium.viewToken);
						$('#musicAudioPreview').show();
					break;
					case 'image':
						$('#musicImagePreview').attr('src', '/TIMAAT/api/medium/image/'+medium.id+'/preview'+'?token='+medium.viewToken);
						$('#musicImagePreview').attr('title', medium.displayTitle.name);
						$('#musicImagePreview').attr('alt', medium.displayTitle.name);
						$('#musicImagePreview').show();
					break;
					case 'video':
						if ( medium.fileStatus && (medium.fileStatus == 'ready' || medium.fileStatus == 'transcoding' || medium.fileStatus == 'waiting') ) {
							$('#musicVideoPreview').attr('src', '/TIMAAT/api/medium/video/'+medium.id+'/download'+'?token='+medium.viewToken);
							$('#musicVideoPreview').show();
						} else {
							$('#musicImagePreview').attr('src', 'img/preview-placeholder.png');
							$('#musicImagePreview').attr('title', 'placeholder');
							$('#musicImagePreview').attr('alt', 'placeholder');
							$('#musicImagePreview').show();
						}
					break;
					default:
						$('#musicImagePreview').attr('src', 'img/preview-placeholder.png');
						$('#musicVideoPreview').attr('src', '');
						$('#musicAudioPreview').attr('src', '');
					break;
				}
			} else {
				$('.musicFormDataSheetAnnotateButton').prop('disabled', true);
				$('#musicAudioPreview').attr('src', '');
				$('#musicImagePreview').attr('src', 'img/preview-placeholder.png');
				$('#musicVideoPreview').attr('src', '');
				$('#musicAudioPreview').hide();
				$('#musicImagePreview').show();
				$('#musicVideoPreview').hide();
			}
			$('.musicFormDataSheetDeleteButton').prop('disabled', false);
			$('.musicFormDataSheetDeleteButton :input').prop('disabled', false);
			$('.musicFormDataSheetDeleteButton').show();
			$('#musicPreviewFormHeader').html(type+" Preview (#"+ data.model.id+')');
		},

    musicFormTitles: function(action, music) {
			// console.log("TCL: musicFormTitles: action, music", action, music);
			// TIMAAT.UI.addSelectedClassToSelectedItem(music.model.musicType.musicTypeTranslations[0].type, music.model.id);
			var node = document.getElementById("musicDynamicTitleFields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			var node = document.getElementById("musicNewTitleFields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			$('#musicFormTitles').trigger('reset');
			musicFormTitlesValidator.resetForm();
			// $('#musicVideoPreview').get(0).pause(); // TODO check if needed

			// setup UI
			// display-title data
			var i = 0;
			var numTitles = music.model.titles.length;
      // console.log("TCL: music.model.titles", music.model.titles);
			for (; i < numTitles; i++) {
				// console.log("TCL: music.model.titles[i].language.id", music.model.titles[i].language.id);
				$('[data-role="musicDynamicTitleFields"]').append(
					`<div class="form-group" data-role="titleEntry">
						<div class="form-row">
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isDisplayTitle"></label>
									<input class="form-check-input isDisplayTitle"
												 type="radio"
												 name="isDisplayTitle"
												 data-role="displayTitle[`+music.model.titles[i].id+`]"
												 placeholder="Is Display Title">
								</div>
							</div>
							<div class="col-sm-2 col-md-1 text-center">
								<div class="form-check">
									<label class="sr-only" for="isOriginalTitleMusic"></label>
									<input class="form-check-input isOriginalTitleMusic"
												 type="radio"
												 name="isOriginalTitleMusic"
												 data-role="originalTitle[`+music.model.titles[i].id+`]"
												 data-wasChecked="true"
												 placeholder="Is Original Title">
								</div>
							</div>
							<div class="col-sm-5 col-md-7">
								<label class="sr-only">Title</label>
								<input class="form-control form-control-sm musicDatasetsMusicTitlesTitleName"
											 name="title[`+i+`]" data-role="title[`+music.model.titles[i].id+`]"
											 placeholder="[Enter title]"
											 aria-describedby="Title"
											 minlength="3"
											 maxlength="200"
											 rows="1"
											 required>
							</div>
							<div class="col-sm-2 col-md-2">
								<label class="sr-only">Title's Language</label>
								<select class="form-control form-control-sm musicDatasetsMusicTitlesTitleLanguageId"
												id="musicTitleLanguageSelectDropdown_`+music.model.titles[i].id+`"
												name="titleLanguageId[`+i+`]"
												data-role="titleLanguageId[`+music.model.titles[i].id+`]"
												data-placeholder="Select title language"
												required>
								</select>
							</div>
							<div class="col-sm-1 col-md-1 text-center">
								<button class="form-group__button js-form-group__button removeTitleButton btn btn-danger"
												data-role="remove">
									<i class="fas fa-trash-alt"></i>
								</button>
							</div>
						</div>
					</div>`
					);
					$('#musicTitleLanguageSelectDropdown_'+music.model.titles[i].id).select2({
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
					var languageSelect = $('#musicTitleLanguageSelectDropdown_'+music.model.titles[i].id);
					var option = new Option(music.model.titles[i].language.name, music.model.titles[i].language.id, true, true);
					languageSelect.append(option).trigger('change');

					if (music.model.titles[i].id == music.model.displayTitle.id) {
						$('[data-role="displayTitle['+music.model.titles[i].id+']"]').prop('checked', true);
					}
					if (music.model.originalTitle && music.model.titles[i].id == music.model.originalTitle.id) {
						$('[data-role="originalTitle['+music.model.titles[i].id+']"]').prop('checked', true);
					}
					$('input[name="title['+i+']"]').rules("add", { required: true, minlength: 3, maxlength: 200, });
					$('input[data-role="title['+music.model.titles[i].id+']"]').attr("value", TIMAAT.MusicDatasets.replaceSpecialCharacters(music.model.titles[i].name));
			};

			if ( action == 'show') {
				$('#musicFormTitles :input').prop('disabled', true);
				this.initFormForShow(music.model.id);
				$('#musicFormTitlesSubmitButton').hide();
				$('#musicFormTitlesDismissButton').hide();
				$('[data-role="musicNewTitleFields"').hide();
				$('.titleFormDivider').hide();
				// $('[data-role="remove"]').hide();
				// $('[data-role="add"]').hide();
				$('.js-form-group__button').hide();
				$('#musicTitlesLabel').html("Music titles");
				let i = 0;
				for (; i < numTitles; i++) {
					$('#musicTitleLanguageSelectDropdown_'+music.model.titles[i].id).select2('destroy').attr("readonly", true);
				}
			}
			else if (action == 'edit') {
				$('#musicFormTitles :input').prop('disabled', false);
				this.hideFormButtons();
				$('#musicFormTitlesSubmitButton').html("Save");
				$('#musicFormTitlesSubmitButton').show();
				$('#musicFormTitlesDismissButton').show();
				$('#musicTitlesLabel').html("Edit music titles");
				$('[data-role="musicNewTitleFields"').show();
				$('.titleFormDivider').show();
				$('#musicDatasetsMetadataMusicTitle').focus();

				// fields for new title entry
				$('[data-role="musicNewTitleFields"]').append(this.titleFormTitleToAppend());
				this.getTitleFormLanguageDropdownData();

				$('#musicFormTitles').data('music', music);
			}
		},

		musicFormMediumHasMusicList: async function(action, music) {
			// console.log("TCL: musicFormMediumHasMusicList: action, music", action, music);
			// TIMAAT.UI.addSelectedClassToSelectedItem(music.model.musicType.musicTypeTranslations[0].type, music.model.id);
			var node = document.getElementById("musicDynamicMediumHasMusicFields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			var node = document.getElementById("musicNewMediumHasMusicFields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			$('#musicFormMediumHasMusicList').trigger('reset');
			musicFormMediumHasMusicListValidator.resetForm();
			// $('#musicVideoPreview').get(0).pause(); // TODO check if needed

			// setup UI
			let i = 0;
			let numMediumHasMusicItems = music.model.mediumHasMusicList.length;
			let mhm;
			let mediumId;
			let numMediumHasMusicDetail;
			let mediumTitle;
			let editMode = (action == 'edit') ? true : false;
			let mediumHasMusicFormData;
			let mhmDetail;
			for (; i < numMediumHasMusicItems; i++) {
				mhm = music.model.mediumHasMusicList[i];
				mediumId = mhm.id.mediumId;
				if (mhm.mediumHasMusicDetailList == null) {
					numMediumHasMusicDetail = 0;
				} else {
					numMediumHasMusicDetail = mhm.mediumHasMusicDetailList.length;
				}
				mediumTitle = await TIMAAT.MediumService.getMediumDisplayTitle(mediumId);
        // console.log("TCL: musicFormMediumHasMusicList:function -> mhm", mhm);
				mediumHasMusicFormData = this.appendMediumHasMusicDataset(i, mediumId, mediumTitle, mhm.mediumHasMusicDetailList, 'sr-only', editMode);
				$('#musicDynamicMediumHasMusicFields').append(mediumHasMusicFormData);
				var j = 0;
				for (; j < numMediumHasMusicDetail; j++) {
					mhmDetail = mhm.mediumHasMusicDetailList[j];
          // console.log("TCL: musicFormMediumHasMusicList:function -> mhmDetail", mhmDetail);
					if (mhmDetail.startTime != null && !(isNaN(mhmDetail.startTime)))
						$('[data-role="startTime['+mediumId+']['+j+']"]').val(TIMAAT.Util.formatTime(mhmDetail.startTime, true));
						else $('[data-role="startTime['+mediumId+']['+j+']"]').val('00:00:00.000');
					if (mhmDetail.endTime != null && !(isNaN(mhmDetail.endTime)))
						$('[data-role="endTime['+mediumId+']['+j+']"]').val(TIMAAT.Util.formatTime(mhmDetail.endTime, true));
						else $('[data-role="endTime['+mediumId+']['+j+']"]').val('00:00:00.000');
				}
			}

			if ( action == 'show') {
				$('#musicFormMediumHasMusicList :input').prop('disabled', true);
				this.initFormForShow(music.model.id);
				$('#musicFormMediumHasMusicListSubmitButton').hide();
				$('#musicFormMediumHasMusicListDismissButton').hide();
				$('[data-role="musicNewMediumHasMusicFields"]').hide();
				$('.musicFormMediumHasMusicListDivider').hide();
				// $('[data-role="remove"]').hide();
				$('[data-role="removeMediumHasMusicDetail"]').hide();
				// $('[data-role="add"]').hide();
				// $('[data-role="addMediumHasMusicDetail"]').hide();
				// $('[data-role="save"]').hide();
				$('.js-form-group__button').hide();
				$('#musicMediumHasMusicListLabel').html("Music medium music");
			}
			else if (action == 'edit') {
				$('#musicFormMediumHasMusicList :input').prop('disabled', false);
				this.hideFormButtons();
				// $('#musicFormMediumHasMusicListSubmitButton').html("Save");
				$('#musicFormMediumHasMusicListSubmitButton').show();
				$('#musicFormMediumHasMusicListDismissButton').show();
				$('.musicDatasetMusicMediumHasMusicMediumId').prop('disabled', true);
				$('#musicMediumHasMusicListLabel').html("Edit music medium music");
				$('[data-role="musicNewMediumHasMusicFields"]').show();
				$('.musicFormMediumHasMusicListDivider').show();
				// $('#musicDatasetsMetadataMusicMediumHasMusic').focus();
				$('#mediumSelectDropdown').focus();

				// fields for new title entry
				$('[data-role="musicNewMediumHasMusicFields"]').append(this.appendNewMediumHasMusicFields());

				// provide list of media that already have a music_has_medium_with_music entry, filter by music_group
				$('#mediumSelectDropdown').select2({
					closeOnSelect: true,
					scrollAfterSelect: true,
					allowClear: true,
					ajax: {
						url: 'api/medium/selectList/', // TODO limit list to media that already have music associations
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

				$('#musicFormMediumHasMusicList').data('music', music);
			}
		},

    musicFormActorRoles: async function(action, music) {
			// console.log("TCL: musicFormActorRoles: action, music", action, music);
			// TIMAAT.UI.addSelectedClassToSelectedItem(music.model.musicType.musicTypeTranslations[0].type, music.model.id);
			var node = document.getElementById("musicDynamicActorWithRoleFields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			var node = document.getElementById("musicNewActorWithRoleFields");
			while (node.lastChild) {
				node.removeChild(node.lastChild);
			};
			$('#musicFormActorWithRoles').trigger('reset');
			// musicFormActorRolesValidator.resetForm();
			// $('#musicVideoPreview').get(0).pause(); // TODO check if needed

			// setup UI
			// actor roles data
			var actorIdList = [];
			var i = 0;
			for (; i < music.model.musicHasActorWithRoles.length; i++) {
				if (actorIdList[actorIdList.length-1] != music.model.musicHasActorWithRoles[i].actor.id) {
					actorIdList.push(music.model.musicHasActorWithRoles[i].actor.id);
				}
			}
			// console.log("TCL: actorIdList", actorIdList);

			// set up form content structure
			i = 0;
			for (; i < actorIdList.length; i++) {
				$('[data-role="musicDynamicActorWithRoleFields"]').append(this.appendActorWithRolesDataset(i, actorIdList[i]));

				// provide list of actors that already have a music_has_actor_with_role entry, filter by role_group
				this.getMusicHasActorWithRoleData(actorIdList[i]);
				// select actor for each entry
				// await TIMAAT.MusicService.getActorList(music.model.id).then(function (data) {
				await TIMAAT.ActorService.getActor(actorIdList[i]).then(function (data) {
					var actorSelect = $('#musicHasActorWithRoleActorId-'+actorIdList[i]);
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
				this.getMusicHasActorWithRolesDropdownData(actorIdList[i]);

				var roleSelect = $('#musicActorWithRolesMultiSelectDropdown-'+actorIdList[i]);
				// console.log("TCL: roleSelect", roleSelect);
				await TIMAAT.MusicService.getActorHasRoleList(music.model.id, actorIdList[i]).then(function (data) {
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
				$('#musicFormActorWithRoles :input').prop('disabled', true);
				this.initFormForShow(music.model.id);
				$('#musicFormActorWithRolesSubmitButton').hide();
				$('#musicFormActorWithRolesDismissButton').hide();
				$('[data-role="musicNewActorWithRoleFields"]').hide();
				$('.actorWithRoleFormDivider').hide();
				// $('[data-role="remove"]').hide();
				// $('[data-role="add"]').hide();
				$('.js-form-group__button').hide();
				$('#musicActorRolesLabel').html("Music actor roles");
			}
			else if (action == 'edit') {
				$('#musicFormActorWithRoles :input').prop('disabled', false);
				$('[id^="musicHasActorWithRoleActorId-"').prop('disabled', true);
				this.hideFormButtons();
				$('#musicFormActorWithRolesSubmitButton').html("Save");
				$('#musicFormActorWithRolesSubmitButton').show();
				$('#musicFormActorWithRolesDismissButton').show();
				$('#musicActorRolesLabel').html("Edit music actor roles");
				$('[data-role="musicNewActorWithRoleFields"]').show();
				$('.actorWithRoleFormDivider').show();
				// $('#musicDatasetsMetadataMusicActorWithRole').focus();

				// fields for new title entry
				$('[data-role="musicNewActorWithRoleFields"]').append(this.appendNewActorHasRolesField());

				// provide list of actors that already have a music_has_actor_with_role entry, filter by role_group
				$('#musicHasActorWithRoleActorId').select2({
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
				$('#musicHasActorWithRoleActorId').on('change', function (event) {
					// console.log("TCL: actor selection changed");
					// console.log("TCL: selected Actor Id", $(this).val());
					if (!($(this).val() == null)) {
						$('#musicActorWithRolesMultiSelectDropdown').val(null).trigger('change');
						// provide roles list for new selected actor
						$('#musicActorWithRolesMultiSelectDropdown').select2({
							closeOnSelect: false,
							scrollAfterSelect: true,
							allowClear: true,
							ajax: {
								url: 'api/music/hasActor/'+$(this).val()+'/withRoles/selectList',
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

				$('#musicFormActorWithRoles').data('music', music);
			}
		},

    createMusic: async function(musicSubtype, musicModel, musicSubtypeModel, title, mediumId) {
    	// console.log("TCL: createMusic: musicSubtype, musicModel, musicSubtypeModel, title, mediumId: ", musicSubtype, musicModel, musicSubtypeModel, title, mediumId);
			try { // TODO needs to be called after createMusic once m-n-table is refactored to 1-n table (sure?)
				// create display title
				var newDisplayTitle = await TIMAAT.MusicService.createTitle(title);
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// create music
				var tempMusicModel = musicModel;
				tempMusicModel.displayTitle = newDisplayTitle;
				tempMusicModel.originalTitle = newDisplayTitle;
				var newMusicModel = await TIMAAT.MusicService.createMusic(tempMusicModel, mediumId);
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// create musicSubtype with music id
				musicSubtypeModel.musicId = newMusicModel.id;
				let newMusicSubtypeModel = await TIMAAT.MusicService.createMusicSubtype(musicSubtype, newMusicModel, musicSubtypeModel);
				switch (musicSubtype) {
					case 'nashid':
						newMusicModel.musicNashid = newMusicSubtypeModel;
					break;
					case 'churchMusic':
						newMusicModel.musicChurchMusic = newMusicSubtypeModel;
					break;
				}
			} catch(error) {
				console.error("ERROR: ", error);
			};
			return newMusicModel;
		},

		createTitle: async function(titleModel) {
			// console.log("TCL: createTitle: async function -> titleModel", titleModel);
			try {
				// create title
				var newTitleModel = await TIMAAT.MusicService.createTitle(titleModel.model);
        // console.log("TCL: newTitleModel", newTitleModel);
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		addTitles: async function(music, newTitles) {
			// console.log("TCL: addTitles: async function -> music, newTitles", music, newTitles);
			try {
				// create title
				var i = 0;
				for (; i <newTitles.length; i++) {
					// var newTitle = await TIMAAT.MusicService.createTitle(newTitles[i]);
					var addedTitleModel = await TIMAAT.MusicService.addTitle(music.model.id, newTitles[i]);
					music.model.titles.push(addedTitleModel);
				}
				// await this.updateMusic(type, music);
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

    updateMusic: async function(musicSubtype, music, mediumId) {
			// console.log("TCL: updateMusic: async function -> music at beginning of update process: ", musicSubtype, music, mediumId);
			try { // update display title
				var tempDisplayTitle = await TIMAAT.MusicService.updateTitle(music.model.displayTitle);
        // console.log("tempDisplayTitle", tempDisplayTitle);
				music.model.displayTitle = tempDisplayTitle;
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try { // update original title
				if (music.model.originalTitle) { // music initially has no original title set
					// for changes in data sheet form that impact data in original title
					if (music.model.displayTitle.id == music.model.originalTitle.id) {
						music.model.originalTitle = music.model.displayTitle;
					}
					var tempOriginalTitle = await TIMAAT.MusicService.updateTitle(music.model.originalTitle);
          // console.log("tempOriginalTitle", tempOriginalTitle);
					music.model.originalTitle = tempOriginalTitle;
				}
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try { // update subtype
				let tempSubtypeModel;
				let tempMusicSubtypeModel;
				switch (musicSubtype) {
					case 'nashid':
						tempSubtypeModel = music.model.musicNashid;
						tempMusicSubtypeModel = await TIMAAT.MusicService.updateMusicSubtype(musicSubtype, tempSubtypeModel);
						music.model.musicNashid = tempMusicSubtypeModel;
						break;
					case 'churchMusic':
						tempSubtypeModel = music.model.musicChurchMusic;
						tempMusicSubtypeModel = await TIMAAT.MusicService.updateMusicSubtype(musicSubtype, tempSubtypeModel);
						music.model.musicChurchMusic = tempMusicSubtypeModel;
						break;
				}
			} catch(error) {
				console.error("ERROR: ", error);
			};

			let musicModel = await TIMAAT.MusicService.updateMusic(music.model);
			let medium = await TIMAAT.MusicService.getMediumByMusicId(musicModel.id);
			// update medium if music.id has changed (null -> x || x -> y || x -> null)
			if (medium && mediumId == 0) { // source medium removed -> null
				medium.music = null;
				TIMAAT.VideoPlayer.curMusic = null;
				await TIMAAT.MediumService.updateMedium(medium);
			} else if (!medium && mediumId > 0) { // source medium set from null -> x
				medium = await TIMAAT.MediumService.getMedium(mediumId);
				medium.music = {};
				medium.music.id = musicModel.id;
				await TIMAAT.MediumService.updateMedium(medium);
			} else if (medium && medium.id != mediumId) { // source medium changed -> update old and new medium connected to music
				medium.music = null;
				TIMAAT.VideoPlayer.curMusic = null;
				await TIMAAT.MediumService.updateMedium(medium);
				let medium2 = await TIMAAT.MediumService.getMedium(mediumId);
				medium2.music = {};
				medium2.music.id = musicModel.id;
				await TIMAAT.MediumService.updateMedium(medium2);
			} // else medium.id == mediumId -> no change

			return musicModel;
		},

		updateTitle: async function(title, music) {
			// console.log("TCL: updateTitle: async function -> title at beginning of update process: ", title, music);
			try {
				// update title
				var tempTitle = await TIMAAT.MusicService.updateTitle(title);
				var i = 0;
				for (; i < music.model.titles.length; i++) {
					if (music.model.titles[i].id == title.id)
						music.model.titles[i] = tempTitle;
				}

				// update data that is part of music (includes updating last edited by/at)
				// console.log("TCL: updateMusic: async function - music.model", music.model);
				// var tempMusicModel = await TIMAAT.MusicService.updateMusic(music.model);
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		updateMusicHasCategorySetsList: async function(musicModel, categorySetIdList) {
    	// console.log("TCL: musicModel, categorySetIdList", musicModel, categorySetIdList);
			try {
				var existingMusicHasCategorySetsEntries = await TIMAAT.MusicService.getCategorySetList(musicModel.id);
        // console.log("TCL: existingMusicHasCategorySetsEntries", existingMusicHasCategorySetsEntries);
				if (categorySetIdList == null) { //* all entries will be deleted
					musicModel.categorySets = [];
					await TIMAAT.MusicService.updateMusic(musicModel);
				} else if (existingMusicHasCategorySetsEntries.length == 0) { //* all entries will be added
					musicModel.categorySets = categorySetIdList;
					await TIMAAT.MusicService.updateMusic(musicModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMusicHasCategorySetsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < categorySetIdList.length; j++) {
							if (existingMusicHasCategorySetsEntries[i].id == categorySetIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMusicHasCategorySetEntries but not in categorySetIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMusicHasCategorySetsEntries[i]);
							existingMusicHasCategorySetsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = musicModel.categorySets.findIndex(({id}) => id === entriesToDelete[i].id);
							musicModel.categorySets.splice(index,1);
							await TIMAAT.MusicService.removeCategorySet(musicModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing categorySets
					var idsToCreate = [];
          i = 0;
          for (; i < categorySetIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMusicHasCategorySetsEntries.length; j++) {
              if (categorySetIdList[i].id == existingMusicHasCategorySetsEntries[j].id) {
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
							musicModel.categorySets.push(idsToCreate[i]);
							await TIMAAT.MusicService.addCategorySet(musicModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return musicModel;
		},

		addCategorySetsToMusic: async function(musicModel, newCategorySetList) {
      // console.log("TCL: addCategorySetsToMusic:function -> musicModel, newCategorySetList", musicModel, newCategorySetList);
			var i = 0;
			for (; i < newCategorySetList.length; i++) {
				await TIMAAT.MusicService.addCategorySet(musicModel.id, newCategorySetList[i].id);
				musicModel.categorySets.push(newCategorySetList[i]);
			}
			return musicModel;
		},

		updateMusicHasCategoriesList: async function(musicModel, categoryIdList) {
    	// console.log("TCL: musicModel, categoryIdList", musicModel, categoryIdList);
			try {
				var existingMusicHasCategoriesEntries = await TIMAAT.MusicService.getSelectedCategories(musicModel.id);
        // console.log("TCL: existingMusicHasCategoriesEntries", existingMusicHasCategoriesEntries);
				if (categoryIdList == null) { //* all entries will be deleted
					musicModel.categories = [];
					await TIMAAT.MusicService.updateMusic(musicModel);
				} else if (existingMusicHasCategoriesEntries.length == 0) { //* all entries will be added
					musicModel.categories = categoryIdList;
					await TIMAAT.MusicService.updateMusic(musicModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMusicHasCategoriesEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < categoryIdList.length; j++) {
							if (existingMusicHasCategoriesEntries[i].id == categoryIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMusicHasCategoryEntries but not in categoryIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMusicHasCategoriesEntries[i]);
							existingMusicHasCategoriesEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = musicModel.categories.findIndex(({id}) => id === entriesToDelete[i].id);
							musicModel.categories.splice(index,1);
							await TIMAAT.MusicService.removeCategory(musicModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing categories
					var idsToCreate = [];
          i = 0;
          for (; i < categoryIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMusicHasCategoriesEntries.length; j++) {
              if (categoryIdList[i].id == existingMusicHasCategoriesEntries[j].id) {
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
							musicModel.categories.push(idsToCreate[i]);
							await TIMAAT.MusicService.addCategory(musicModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return musicModel;
		},

		addCategoriesToMusic: async function(musicModel, newCategoryList) {
      // console.log("TCL: addCategoriesToMusic:function -> musicModel, newCategoryList", musicModel, newCategoryList);
			var i = 0;
			for (; i < newCategoryList.length; i++) {
				await TIMAAT.MusicService.addCategory(musicModel.id, newCategoryList[i].id);
				musicModel.categories.push(newCategoryList[i]);
			}
			return musicModel;
		},

		updateMusicHasTagsList: async function(musicModel, tagIdList) {
    	// console.log("TCL: musicModel, tagIdList", musicModel, tagIdList);
			try {
				var existingMusicHasTagsEntries = await TIMAAT.MusicService.getTagList(musicModel.id);
        // console.log("TCL: existingMusicHasTagsEntries", existingMusicHasTagsEntries);
				if (tagIdList == null) { //* all entries will be deleted
					musicModel.tags = [];
					await TIMAAT.MusicService.updateMusic(musicModel);
				} else if (existingMusicHasTagsEntries.length == 0) { //* all entries will be added
					musicModel.tags = tagIdList;
					await TIMAAT.MusicService.updateMusic(musicModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMusicHasTagsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < tagIdList.length; j++) {
							if (existingMusicHasTagsEntries[i].id == tagIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMusicHasTagEntries but not in tagIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMusicHasTagsEntries[i]);
							existingMusicHasTagsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = musicModel.tags.findIndex(({id}) => id === entriesToDelete[i].id);
							musicModel.tags.splice(index,1);
							await TIMAAT.MusicService.removeTag(musicModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing tags
					var idsToCreate = [];
          i = 0;
          for (; i < tagIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMusicHasTagsEntries.length; j++) {
              if (tagIdList[i].id == existingMusicHasTagsEntries[j].id) {
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
							musicModel.tags.push(idsToCreate[i]);
							await TIMAAT.MusicService.addTag(musicModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return musicModel;
		},

		createNewTagsAndAddToMusic: async function(musicModel, newTagList) {
      // console.log("TCL: createNewTagsAndAddToMusic:function -> musicModel, newTagList", musicModel, newTagList);
			var i = 0;
			for (; i < newTagList.length; i++) {
				newTagList[i] = await TIMAAT.Service.createTag(newTagList[i].name);
				await TIMAAT.MusicService.addTag(musicModel.id, newTagList[i].id);
				musicModel.tags.push(newTagList[i]);
			}
			return musicModel;
		},

		addMediumHasMusic: async function(music, mediumHasMusicData) {
      // console.log("TCL: addMediumHasMusic:function -> musicModel, mediumHasMusicData", music, mediumHasMusicData);
			try {
				// create mediumHasMusic
				// TODO create and add mediumHasMusicDetailList
				//? create model?
				var newMediumHasMusic = await TIMAAT.MusicService.addMediumHasMusic(mediumHasMusicData.musicId, mediumHasMusicData.mediumId);
				var i = 0;
				for (; i < mediumHasMusicData.mediumHasMusicDetailList.length; i++) {
					var newDetail = await TIMAAT.MusicService.addMediumHasMusicDetail(mediumHasMusicData.musicId, mediumHasMusicData.mediumId, mediumHasMusicData.mediumHasMusicDetailList[i]);
          // console.log("TCL: newDetails", newDetails);
					newMediumHasMusic.mediumHasMusicDetailList.push(newDetail);
				}
				music.model.mediumHasMusicList.push(newMediumHasMusic);
			} catch(error) {
				console.error("ERROR: ", error);
			}
		},

		_musicRemoved: async function(music) {
			// console.log("TCL: _musicRemoved", music);
			// to update removed musicId from medium information
			let mediumModel = {};
			mediumModel = await TIMAAT.MusicService.getMediumByMusicId(music.model.id);
			mediumModel.music = null;
			// sync to server
			try {
				await TIMAAT.MusicService.removeMusic(music);
			} catch(error) {
				console.error("ERROR: ", error);
			}

			// remove all titles from music
			var i = 0;
			for (; i < music.model.titles.length; i++ ) { // remove obsolete titles
				if ( music.model.titles[i].id != music.model.displayTitle.id ) {
					TIMAAT.MusicService.removeTitle(music.model.titles[i]);
					music.model.titles.splice(i,1);
				}
			}
			$('#musicFormMetadata').data('music', null);

			try {
				// TODO: This is a workaround so that musicId is removed from the medium data, which should be possible without an updateMedium call
				await TIMAAT.MediumService.updateMedium(mediumModel);
			} catch(error) {
				console.error("ERROR: ", error);
			}
		},

    updateMusicModelData: async function(model, formDataObject) {
    	// console.log("TCL: model, formDataObject", model, formDataObject);
			// music data
			if (!isNaN(formDataObject.dynamicMarkingId)) {
				if (model.dynamicMarking) {
					model.dynamicMarking.id = formDataObject.dynamicMarkingId;
				} else {
					model.dynamicMarking = {};
					model.dynamicMarking.id = formDataObject.dynamicMarkingId;
				}
			} else model.dynamicMarking = null;
			if (!isNaN(formDataObject.musicalKeyId)) {
				if (model.musicalKey) {
					model.musicalKey.id = formDataObject.musicalKeyId;
				} else {
					model.musicalKey = {};
					model.musicalKey.id = formDataObject.musicalKeyId;
				}
			} else model.musicalKey = null;
			if (!isNaN(formDataObject.tempoMarkingId)) {
				if (model.tempoMarking) {
					model.tempoMarking.id = formDataObject.tempoMarkingId;
				} else {
					model.tempoMarking = {};
					model.tempoMarking.id = formDataObject.tempoMarkingId;
				}
			} else model.tempoMarking = null;
			if (!isNaN(formDataObject.musicTextSettingElementTypeId)) {
				if (model.musicTextSettingElementType) {
					model.musicTextSettingElementType.id = formDataObject.musicTextSettingElementTypeId;
				} else {
					model.musicTextSettingElementType = {};
					model.musicTextSettingElementType.id = formDataObject.musicTextSettingElementTypeId;
				}
			} else model.musicTextSettingElementType = null;
			if (formDataObject.voiceLeadingPatternList.length > 0) {
				model.voiceLeadingPatternList = formDataObject.voiceLeadingPatternList;
			} else {
				model.voiceLeadingPatternList = [];
			}
			model.beat            = formDataObject.beat;
			model.tempo           = formDataObject.tempo;
			model.remark          = formDataObject.remark;
			model.instrumentation = formDataObject.instrumentation;
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
      // console.log("TCL: updateMusicModelData:function -> model", model);
			return model;
		},

		createMusicModel: async function(formDataObject, type) {
    	console.log("TCL: formDataObject, type", formDataObject, type);
			let typeId = 0;
			switch (type) {
				case 'nashid':
					typeId = 1;
				break;
				case 'churchMusic':
					typeId = 2;
				break;
			}
			var model = {
				id             : 0,
				beat           : formDataObject.beat,
				tempo          : formDataObject.tempo,
				remark         : formDataObject.remark,
				instrumentation: formDataObject.instrumentation,
				musicType      : {
					id: typeId,
				},
				titles: [{
					id      : 0,
					language: {
						id: formDataObject.displayTitleLanguageId,
					},
					name: formDataObject.displayTitle,
				}],
			};
			if (formDataObject.dynamicMarkingId > 0) {
				model.dynamicMarking = {};
				model.dynamicMarking.id = formDataObject.dynamicMarkingId;
			}
			if (formDataObject.musicalKeyId > 0) {
				model.musicalKey = {};
				model.musicalKey.id = formDataObject.musicalKeyId;
			}
			if (formDataObject.tempoMarkingId > 0) {
				model.tempoMarking = {};
				model.tempoMarking.id = formDataObject.tempoMarkingId;
			}
			if (formDataObject.musicTextSettingElementTypeId > 0) {
				model.musicTextSettingElementType = {};
				model.musicTextSettingElementType.id = formDataObject.musicTextSettingElementTypeId;
			}
			if (formDataObject.voiceLeadingPatternList.length > 0) {
				model.voiceLeadingPatternList = formDataObject.voiceLeadingPatternList;
			}
			return model;
		},

		createMusicSubtypeModel: async function(formDataObject, musicType) {
			var model = {};
			switch(musicType) {
				case 'nashid':
					model = {
						musicId: 0
					};
					if (formDataObject.jinsId) {
						model.jins = {};
						model.jins.id = formDataObject.jinsId;
					}
					if (formDataObject.maqamId) {
						model.maqam = {};
						model.maqam.id = formDataObject.maqamId;
					}
				break;
				case 'churchMusic':
					model = {
						musicId: 0
					};
					if (formDataObject.churchMusicalKeyId) {
						model.churchMusicalKey = {};
						model.churchMusicalKey.id = formDataObject.churchMusicalKeyId;
					}
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

    titleFormTitleToAppend: function() {
			var titleToAppend =
			`<div class="form-group" data-role="titleEntry">
				<div class="form-row">
					<div class="col-md-2 text-center">
						<div class="form-check">
							<span>Add new title:</span>
						</div>
					</div>
					<div class="col-md-6">
						<label class="sr-only">Title</label>
						<input class="form-control form-control-sm musicDatasetsMusicTitlesTitleName"
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
						<select class="form-control form-control-sm musicDatasetsMusicTitlesTitleLanguageId"
										id="musicTitleLanguageSelectDropdown"
										name="titleLanguageId"
										data-role="titleLanguageId"
										data-placeholder="Select title language"
										required>
						</select>
					</div>
					<div class="col-md-1 text-center">
						<button class="form-group__button form-group__button--add js-form-group__button addTitleButton btn btn-primary" data-role="add">
							<i class="fas fa-plus"></i>
						</button>
					</div>
				</div>
			</div>`;
			return titleToAppend;
		},

		appendActorWithRolesDataset: function(i, actorId) {
    	// console.log("TCL: i, actorId", i, actorId);
			var entryToAppend =
				`<div class="form-group" data-role="musicHasActorWithRoleEntry" data-id="`+i+`" data-actor-id=`+actorId+`>
					<div class="form-row">
						<div class="col-md-11">
							<div class="form-row">
								<div class="col-md-4">
									<label class="sr-only">Actor</label>
									<select class="form-control form-control-sm musicHasActorWithRoleActorId"
													id="musicHasActorWithRoleActorId-`+actorId+`"
													name="actorId"
													data-placeholder="Select actor"
													data-role="actorId-`+actorId+`"
													required>
									</select>
								</div>
								<div class="col-md-8">
									<label class="sr-only">Has Role(s)</label>
									<select class="form-control form-control-sm"
													id="musicActorWithRolesMultiSelectDropdown-`+actorId+`"
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
							<button class="form-group__button js-form-group__button removeMusicHasActorWithRoleButton btn btn-danger" data-role="remove">
								<i class="fas fa-trash-alt"></i>
							</button>
						</div>
					</div>
				</div>`;
			return entryToAppend;
		},

		appendNewActorHasRolesField: function() {
			let entryToAppend =
				`<div class="form-group" data-role="musicHasActorWithRoleEntry" data-id="-1">
					<div class="form-row">
						<div class="col-md-11">
							<fieldset>
								<legend>Add new Actor with role(s):</legend>
								<div class="form-row">
									<div class="col-md-4">
										<label class="sr-only">Actor</label>
										<select class="form-control form-control-sm musicHasActorWithRoleActorId"
														id="musicHasActorWithRoleActorId"
														name="actorId"
														data-placeholder="Select actor"
														data-role="actorId"
														required>
										</select>
									</div>
									<div class="col-md-8">
										<label class="sr-only">Has Role(s)</label>
										<select class="form-control form-control-sm"
														id="musicActorWithRolesMultiSelectDropdown"
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
						<div class="col-md-1 align-items--vertically">
							<button type="button" class="form-group__button js-form-group__button addMusicHasActorWithRoleButton btn btn-primary" data-role="add">
								<i class="fas fa-plus"></i>
							</button>
						</div>
					</div>
				</div>`;
			return entryToAppend;
		},

		appendMediumHasMusicDataset: function(i, mediumId, mediumTitle, mediumHasMusicListData, labelClassString, editMode) {
			// console.log("TCL: appendMediumHasMusicDataset:function -> i, mediumId, mediumTitle, mediumHasMusicListData, labelClassString, editMode", i, mediumId, mediumTitle, mediumHasMusicListData, labelClassString, editMode);
			var mediumHasMusicListFormData =
			`<div class="form-group" data-role="musicIsInMediumEntry" data-id=`+i+` data-medium-id=`+mediumId+`>
				<div class="form-row">
					<div class="col-md-11">
						<fieldset>
							<legend>Medium `+(i+1)+`</legend>
							<div class="form-row">
								<div class="hidden" aria-hidden="true">
									<input type="hidden"
												class="form-control form-control-sm"
												name="mediumId"
												value="`+mediumId+`">
								</div>
								<div class="col-md-6">
									<label class="sr-only">Exists in medium</label>
									<input type="text" class="form-control form-control-sm musicDatasetMusicMediumHasMusicMediumId"
													id="mediumTitle`+mediumId+`"
													name="mediumTitle"
													value="`+mediumTitle.name+`"
													data-role="mediumId[`+mediumId+`]"
													placeholder="Select medium"
													aria-describedby="Medium name"
													required>
								</div>
								<div class="col-md-6">
									<div data-role="musicMediumHasMusicListDetailEntries">`;
			// append list of time details
			var j = 0;
			for (; j < mediumHasMusicListData.length; j++) {
				mediumHasMusicListFormData +=	this.appendMediumHasMusicDetailFields(i, j, mediumId, mediumHasMusicListData[j], labelClassString);
			}
			mediumHasMusicListFormData +=
									`</div>
									<div class="form-group" data-role="newMusicIsInMediumDetailFields" data-detail-id="`+j+`">`;
			if (editMode) {
				mediumHasMusicListFormData += this.appendMediumHasMusicNewDetailFields();
			}
			mediumHasMusicListFormData +=
										`<!-- form sheet: one row for new medium has music list detail information that shall be added to the medium has music list -->
									</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col-md-1 align-items--vertically">
						<button type="button" class="form-group__button js-form-group__button removeMediumHasMusicButton btn btn-danger" data-role="remove">
							<i class="fas fa-trash-alt"></i>
						</button>
					</div>
				</div>
			</div>`;
			return mediumHasMusicListFormData;
		},

		/** adds empty fields for new mediumHasMusic dataset */
		appendNewMediumHasMusicFields: function() {
    	// console.log("TCL: appendNewMediumHasMusicFields");
			var mediumHasMusicToAppend =
			`<div class="form-group" data-role="musicIsInMediumEntry" data-id=-1>
				<div class="form-row">
					<div class="col-md-11">
						<fieldset>
							<legend>Add new medium:</legend>
							<div class="form-row">
								<div class="col-md-6">
									<label class="sr-only">Appears in medium</label>
									<select class="form-control form-control-sm"
													id="mediumSelectDropdown"
													name="mediumId"
													data-role="mediumId"
													data-placeholder="Select medium"
													required>
									</select>
								</div>
								<div class="col-md-6">
									<div class="form-group"
											 data-role="newMusicIsInMediumDetailFields"
											 data-detail-id="0">`;
			mediumHasMusicToAppend += this.appendMediumHasMusicNewDetailFields();
			mediumHasMusicToAppend +=
									`</div>
								</div>
							</div>
						</fieldset>
					</div>
					<div class="col-md-1 align-items--vertically">
						<button type="button" class="form-group__button js-form-group__button addMusicIsInMediumButton btn btn-primary" data-role="add">
							<i class="fas fa-plus"></i>
						</button>
					</div>
				</div>
			</div>`;
			return mediumHasMusicToAppend;
		},

		/** adds fields for details of mediumHasMusic data */
		appendMediumHasMusicDetailFields: function(i, j, mediumId, mediumHasMusicData, labelClassString) {
			// console.log("TCL: appendMediumHasMusicDetailFields:function -> i, j, mediumId, mediumHasMusicData, labelClassString", i, j, mediumId, mediumHasMusicData, labelClassString);
			var mediumHasMusicDetailList =
				`<div class="form-group" data-role="mediumHasMusicDetailEntry" data-detail-id="`+j+`">
					<div class="form-row">
						<div class="hidden" aria-hidden="true">
							<input type="hidden"
										 class="form-control form-control-sm"
										 name="appearsInDetailId"
										 value="`+mediumHasMusicData.id+`">
						</div>
						<div class="col-md-5">
							<label class="`+labelClassString+`">Starts at</label>
							<input type="text"
										 class="form-control form-control-sm musicDatasetsMusicMediumHasMusicListStartTime"
										 name="startTime[`+mediumId+`][`+j+`]"
										 data-role="startTime[`+mediumId+`][`+j+`]"`;
				if (mediumHasMusicData != null) { mediumHasMusicDetailList += `value="`+mediumHasMusicData.startTime+`"`; }
				mediumHasMusicDetailList +=
										`placeholder="00:00:00.000"
										aria-describedby="Music starts at">
						</div>
						<div class="col-md-5">
							<label class="`+labelClassString+`">Ends at</label>
							<input type="text"
										 class="form-control form-control-sm musicDatasetsMusicMediumHasMusicListEndTime"
										 name="endTime[`+mediumId+`][`+j+`]"
										 data-role="endTime[`+mediumId+`][`+j+`]"`;
				if (mediumHasMusicData != null) { mediumHasMusicDetailList += `value="`+mediumHasMusicData.endTime+`"`; }
				mediumHasMusicDetailList +=
										`placeholder="00:00:00.000"
										aria-describedby="Music ends at">
						</div>
						<div class="col-md-2 align-items--vertically">
							<button type="button" class="btn btn-danger" data-role="removeMediumHasMusicDetail">
								<i class="fas fa-trash-alt"></i>
							</button>
						</div>
					</div>
				</div>`;
			return mediumHasMusicDetailList;
		},

		/** adds new fields for details of mediumHasMusic data */
		appendMediumHasMusicNewDetailFields: function() {
			// console.log("TCL: appendMediumHasMusicNewDetailFields");
			var newMediumHasMusicDetail =
			`<div class="form-row">
				<div class="hidden" aria-hidden="true">
					<input type="hidden"
									class="form-control form-control-sm disableOnSubmit disableOnAdd"
									name="appearsInDetailId"
									value="0">
				</div>
				<div class="col-md-5">
					<label class="sr-only">Starts at</label>
					<input type="text"
								class="form-control disableOnSubmit form-control-sm musicDatasetsMusicMediumHasMusicListStartTime"
								name="startTime"
								data-role="startTime"
								placeholder="00:00:00.000"
								value="00:00:00.000"
								aria-describedby="Music starts at">
				</div>
				<div class="col-md-5">
					<label class="sr-only">Ends at</label>
					<input type="text"
								class="form-control disableOnSubmit form-control-sm musicDatasetsMusicMediumHasMusicListEndTime"
								name="endTime"
								data-role="endTime"
								placeholder="00:00:00.000"
								value="00:00:00.000"
								aria-describedby="Music ends at">
				</div>
				<div class="col-md-2 align-items--vertically">
					<button type="button" class="form-group__button js-form-group__button addMediumHasMusicDetailButton btn btn-primary" data-role="addMediumHasMusicDetail">
						<i class="fas fa-plus"></i>
					</button>
				</div>
			</div>`;
			return newMediumHasMusicDetail;
		},

		appendMusicHasVoiceLeadingPatternsDataset: function() {
			var hasVoiceLeadingPatternFormData =
      `<div class="form-group" data-role="musicHasVoiceLeadingPattern-entry">
        <div class="form-row">
          <div class="col-md-12">
            <label class="col-form-label col-form-label-sm" for="voiceLeadingPatternMultiSelectDropdown">Voice-leading pattern(s)</label>
            <select class="form-control form-control-sm multi-select-dropdown"
										style="width:100%;"
                    id="voiceLeadingPatternMultiSelectDropdown"
                    name="voiceLeadingPatternId"
                    data-placeholder="Select voice leading pattern(s)"
                    multiple="multiple">
            </select>
          </div>
        </div>
      </div>`;
      return hasVoiceLeadingPatternFormData;
		},

		initFormDataSheetForEdit: function() {
			$('#musicFormMetadata :input').prop('disabled', false);
			this.hideFormButtons();
			$('#musicFormMetadataSubmitButton').show();
			$('#musicFormMetadataDismissButton').show();
			$('#musicDatasetsMetadataMusicTitle').focus();
		},

		initFormForShow: async function (musicId) {
			$('.musicFormDataSheetEditButton').prop('disabled', false);
			$('.musicFormDataSheetEditButton :input').prop('disabled', false);
			$('.musicFormDataSheetEditButton').show();
			let medium = await TIMAAT.MusicService.getMediumByMusicId(musicId);
			if (medium &&
				  medium.fileStatus &&
					medium.fileStatus != 'noFile' &&
					(medium.mediaType.mediaTypeTranslations[0].type == 'video' ||
					 medium.mediaType.mediaTypeTranslations[0].type == 'image' ||
					 medium.mediaType.mediaTypeTranslations[0].type == 'audio')) {
				$('.musicFormDataSheetAnnotateButton').prop('disabled', false);
			} else {
				$('.musicFormDataSheetAnnotateButton').prop('disabled', true);
			}
		},

		initFormDataSheetData: function(type) {
			$('.dataSheetData').hide();
			$('.titleData').show();
			$('.musicData').show();
			$('.'+type+'Data').show();
		},

		hideFormButtons: function() {
			$('.formButtons').hide();
			$('.formButtons').prop('disabled', true);
			$('.formButtons :input').prop('disabled', true);
		},

		showAddMusicButton: function() {
			$('.addMusicButton').prop('disabled', false);
			$('.addMusicButton :input').prop('disabled', false);
			$('.addMusicButton').show();
		},

		getMusicFormTitleLanguageDropdownData: function() {
			$('#musicDisplayTitleLanguageSelectDropdown').select2({
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

		getMusicFormDynamicMarkingDropdownData: function() {
			$('#musicDynamicMarkingSelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/dynamicMarking/selectList/',
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

		getMusicFormMediumDropdownData: function() {
			$('#musicPrimarySourceMediumSelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/medium/selectList/',
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
							// results: data.results,
							// pagination: {
							// 	more: (params.page * 10) < data.count_filtered
							// }
						};
					},
					cache: false
				},
				minimumInputLength: 0,
			});
		},

		getMusicFormTempoMarkingDropdownData: function() {
			$('#musicTempoMarkingSelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/tempoMarking/selectList/',
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

		getMusicFormTextSettingElementTypeDropdownData: function() {
			$('#musicTextSettingSelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/musicTextSettingElementType/selectList/',
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

		getMusicFormMusicalKeyDropdownData: function() {
			$('#musicMusicalKeySelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/musicalKey/selectList/',
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

		getMusicFormJinsDropdownData: function() {
			$('#musicNashidJinsSelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/jins/selectList/',
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

		getMusicFormMaqamDropdownData: function() {
			$('#musicNashidMaqamSelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/maqam/selectList/',
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

		getMusicFormChurchMusicalKeyDropdownData: function() {
			$('#musicChurchMusicMusicalKeySelectDropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/churchMusicalKey/selectList/',
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

		getMusicFormVoiceLeadingPatternDropdownData: function() {
			$('#voiceLeadingPatternMultiSelectDropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/music/voiceLeadingPattern/selectList',
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
			$('#musicTitleLanguageSelectDropdown').select2({
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

		getMusicHasActorWithRoleData: function(id) {
			$('#musicHasActorWithRoleActorId-'+id).select2({
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

		getMusicHasActorWithRolesDropdownData: function(id) {
			$('#musicActorWithRolesMultiSelectDropdown-'+id).select2({
				closeOnSelect: false,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/hasActor/'+id+'/withRoles/selectList',
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

		getMediumHasMusicListData: function(id) {
    	// console.log("TCL: getMediumHasMusicListData: function -> id", id);
			$('#mediumHasMusicListActorId-'+id).select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: false,
				ajax: {
					url: 'api/medium/'+id+'/select',
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

		getMediumHasMusicListDropdownData: function(id) {
			$('#musicMediumHasMusicListSelectDropdown-'+id).select2({
				closeOnSelect: false,
				scrollAfterSelect: true,
				allowClear: true,
				ajax: {
					url: 'api/music/medium/'+id+'/hasMusicList/selectList',
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

		setupMusicDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableMusic = $('#musicDatasetsMusicTable').DataTable({
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
					"url"        : "api/music/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// musicSubtype: ''
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
						var musicList = Array();
						data.data.forEach(function(music) {
							if ( music.id > 0 ) {
								musicList.push(new TIMAAT.Music(music, 'music'));
							}
						});
						TIMAAT.MusicDatasets.musicList = musicList;
						TIMAAT.MusicDatasets.musicList.model = data.data;
						return data.data; // data.map(music => new TIMAAT.Music(music));
					}
				},
				"initComplete": async function( settings, json ) {
					TIMAAT.MusicDatasets.dataTableMusic.draw(); //* to scroll to selected row
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
					if (data.id == TIMAAT.UI.selectedMusicId) {
						TIMAAT.UI.clearLastSelection('music');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMusicId = data.id; //* as it is set to null in clearLastSelection
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: Music dataTable -  createdRow");
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let musicElement = $(row);
					let music = data;
					music.ui = musicElement;
					musicElement.data('music', music);
					// TIMAAT.MusicDatasets.setMusicStatus(music);

					musicElement.on('click', '.title', function(event) {
						event.stopPropagation();
						let musicModel = {};
						musicModel.model = music;
						TIMAAT.MusicDatasets.setDataTableOnItemSelect('music', musicModel);
					});

					// if ( music.fileStatus != "ready" && music.fileStatus != "unavailable" && music.fileStatus != "noFile" )
					// 	music.fileStatus = TIMAAT.MusicService.updateFileStatus(music, music.musicType.musicTypeTranslations[0].type);
				},
				"columns": [
					{ data: 'id', name: 'title', className: 'title', render: function(data, type, music, meta)
						{
							// console.log("TCL: data", data); // == musicId
							// console.log("TCL: music", music);
							// console.log("TCL: music.fileStatus", music.fileStatus);
							let displayMusicTypeIcon = '';
							switch (music.musicType.musicTypeTranslations[0].type) {
								case 'nashid':
									// displayMusicTypeIcon = '  <i class="far fa-file-audio" title="Nashid"></i> ';
								break;
								case 'churchMusic':
									// displayMusicTypeIcon = '  <i class="far fa-file-audio" title="Church Music"></i> ';
								break;
							}
							let noFileIcon = ' ';
							let commentIcon = ' ';
							if (music.remark.length > 0) {
								commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
							}
							let titleDisplay = `<p>` + displayMusicTypeIcon + noFileIcon + commentIcon + music.displayTitle.name + `</p>`;
							if (music.originalTitle != null && music.displayTitle.id != music.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+music.originalTitle.name+`)</i></p>`;
							}
							music.titles.forEach(function(title) { // make additional titles searchable in music library
								if (title.id != music.displayTitle.id && (music.originalTitle == null || title.id != music.originalTitle.id)) {
									titleDisplay += `<div class="display--none">`+title.name+`</div>`;
								}
							});
							// console.log("TCL: music", music);
							return titleDisplay;
						}
					},
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No music found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ music total)",
					"infoEmpty"   : "No music available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ music)",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},
			});
		},

		setupNashidDataTable: function() {
			// console.log("TCL: setupNashidDataTable");
			// setup dataTable
			this.dataTableNashid = $('#musicDatasetsNashidTable').DataTable({
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
					"url"        : "api/music/nashid/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// musicSubtype: 'nashid'
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
						// console.log("TCL: TIMAAT.MusicDatasets.nashidList (last)", TIMAAT.MusicDatasets.nashidList);
						// setup model
						var nashidList = Array();
						data.data.forEach(function(music) {
							if ( music.id > 0 ) {
								nashidList.push(new TIMAAT.Music(music, 'nashid'));
							}
						});
						TIMAAT.MusicDatasets.nashidList = nashidList;
						TIMAAT.MusicDatasets.nashidList.model = data.data;
						// console.log("TCL: TIMAAT.MusicDatasets.nashidList (current)", TIMAAT.MusicDatasets.nashidList);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
					TIMAAT.MusicDatasets.dataTableNashid.draw(); //* to scroll to selected row
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
					if (data.id == TIMAAT.UI.selectedMusicId) {
						TIMAAT.UI.clearLastSelection('nashid');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMusicId = data.id; //* as it is set to null in clearLastSelection
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let musicElement = $(row);
					let music = data;
					music.ui = musicElement;
					musicElement.data('music', music);

					// TIMAAT.MusicDatasets.setMusicStatus(music);

					musicElement.on('click', '.title', function(event) {
						event.stopPropagation();
						let musicModel = {};
						musicModel.model = music;
						TIMAAT.MusicDatasets.setDataTableOnItemSelect('nashid', musicModel);
					});

					// if ( music.fileStatus != "ready" && music.fileStatus != "unavailable" && music.fileStatus != "noFile" )
					// 	music.fileStatus = TIMAAT.MusicService.updateFileStatus(music, 'nashid');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, music, meta)
					{
						// console.log("TCL: music.fileStatus", music.fileStatus);
						let noFileIcon = '';
						let commentIcon = ' ';
						if (music.remark.length > 0) {
							commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
						}
						let titleDisplay = `<p>` + noFileIcon + commentIcon + music.displayTitle.name +`</p>`;
						if (music.originalTitle != null && music.displayTitle.id != music.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+music.originalTitle.name+`)</i></p>`;
						}
						music.titles.forEach(function(title) { // make additional titles searchable in music library
							if (title.id != music.displayTitle.id && (music.originalTitle == null || title.id != music.originalTitle.id)) {
								titleDisplay += `<div class="display--none">`+title.name+`</div>`;
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
					"zeroRecords" : "No nashid found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ anashid total)",
					"infoEmpty"   : "No nashid available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ (a)nashid)",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},
			});
		},

		setupChurchMusicDataTable: function() {
			// console.log("TCL: setupChurchMusicDataTable");
			// setup dataTable
			this.dataTableChurchMusic = $('#musicDatasetsChurchMusicTable').DataTable({
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
					"url"        : "api/music/churchMusic/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							// musicSubtype: 'churchMusic'
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
						// console.log("TCL: TIMAAT.MusicDatasets.churchMusicList (last)", TIMAAT.MusicDatasets.churchMusicList);
						// setup model
						var churchMusicList = Array();
						data.data.forEach(function(music) {
							if ( music.id > 0 ) {
								churchMusicList.push(new TIMAAT.Music(music, 'churchMusic'));
							}
						});
						TIMAAT.MusicDatasets.churchMusicList = churchMusicList;
						TIMAAT.MusicDatasets.churchMusicList.model = data.data;
						// console.log("TCL: TIMAAT.MusicDatasets.churchMusicList (current)", TIMAAT.MusicDatasets.churchMusicList);
						return data.data;
					}
				},
				"initComplete": async function( settings, json ) {
					TIMAAT.MusicDatasets.dataTableChurchMusic.draw(); //* to scroll to selected row
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
					if (data.id == TIMAAT.UI.selectedMusicId) {
						TIMAAT.UI.clearLastSelection('churchMusic');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMusicId = data.id; //* as it is set to null in clearLastSelection
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let musicElement = $(row);
					let music = data;
					music.ui = musicElement;
					musicElement.data('music', music);

					// TIMAAT.MusicDatasets.setMusicStatus(music);

					musicElement.on('click', '.title', function(event) {
						event.stopPropagation();
						let musicModel = {};
						musicModel.model = music;
						TIMAAT.MusicDatasets.setDataTableOnItemSelect('churchMusic', musicModel);
					});

					// if ( music.fileStatus != "ready" && music.fileStatus != "unavailable" && music.fileStatus != "noFile" )
					// 	music.fileStatus = TIMAAT.MusicService.updateFileStatus(music, 'churchMusic');
				},
				"columns": [
				{ data: 'id', name: 'title', className: 'title', render: function(data, type, music, meta)
					{
						// console.log("TCL: music.fileStatus", music.fileStatus);
						let noFileIcon = '';
						let commentIcon = ' ';
						if (music.remark.length > 0) {
							commentIcon = '<i class="fas fa-comment-alt" title="Remark available"></i> ';
						}
						let titleDisplay = `<p>` + noFileIcon + commentIcon + music.displayTitle.name +`</p>`;
						if (music.originalTitle != null && music.displayTitle.id != music.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+music.originalTitle.name+`)</i></p>`;
						}
						music.titles.forEach(function(title) { // make additional titles searchable in music library
							if (title.id != music.displayTitle.id && (music.originalTitle == null || title.id != music.originalTitle.id)) {
								titleDisplay += `<div class="display--none">`+title.name+`</div>`;
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
					"zeroRecords" : "No church music found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ church music(s) total)",
					"infoEmpty"   : "No church music available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ church music(s))",
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
			$('#musicDatasetsMusicTabsContainer').append($('#musicDatasetsMusicTabs'));
			$('#musicModalsContainer').append($('#musicModals'));
			// this.container = 'music';
			// $('#musicPreviewTab').removeClass('annotationMode');
			switch (TIMAAT.UI.subNavTab) {
				case 'dataSheet':
					TIMAAT.UI.displayDataSetContentContainer('musicDataTab', 'musicFormMetadata', 'music');
				break;
				case 'preview':
					TIMAAT.UI.displayDataSetContentContainer('musicDataTab', 'musicFormPreview', 'music');
				break;
				case 'titles':
					TIMAAT.UI.displayDataSetContentContainer('musicDataTab', 'musicFormTitles', 'music');
				break;
				case 'actorWithRoles':
					TIMAAT.UI.displayDataSetContentContainer('musicDataTab', 'musicFormActorWithRoles', 'music');
				break;
				case 'mediumHasMusicList':
					TIMAAT.UI.displayDataSetContentContainer('musicDataTab', 'musicFormMediumHasMusicList', 'music');
				break;
			}
			TIMAAT.UI.clearLastSelection(type);
			TIMAAT.UI.addSelectedClassToSelectedItem(type, selectedItem.model.id);
			if (type == 'music') {
				if (TIMAAT.UI.subNavTab == 'dataSheet') {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#music/' + selectedItem.model.id);
				} else {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#music/' + selectedItem.model.id + '/' + TIMAAT.UI.subNavTab);
				}
				type = selectedItem.model.musicType.musicTypeTranslations[0].type;
			} else {
				if (TIMAAT.UI.subNavTab == 'dataSheet') {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#music/' + type + '/' + selectedItem.model.id);
				} else {
					TIMAAT.URLHistory.setURL(null, selectedItem.model.displayTitle.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#music/' + type + '/' + selectedItem.model.id + '/' + TIMAAT.UI.subNavTab);
				}
			}
			$('#musicFormMetadata').data('type', type);
			$('#musicFormMetadata').data('music', selectedItem);
			this.showAddMusicButton();
			TIMAAT.UI.displayDataSetContent(TIMAAT.UI.subNavTab, selectedItem, 'music');
		},

	}

}, window));
