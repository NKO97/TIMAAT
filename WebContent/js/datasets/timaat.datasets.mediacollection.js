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

	TIMAAT.MediaCollectionDatasets = {
    mediaCollectionList: null,
		mediaCollectionItemList: null,
		mediaCollectionPublication: null,
		selectedMediumCollectionId: null,
		selectedMediumCollectionItemId: null,
		lastForm: null,
		subNavTab: 'dataSheet',

		init: function() {
			this.initMediaCollections();
			this.initMediaCollectionItems();
			this.initMediaCollectionPublication();
			TIMAAT.MediaDatasets.displayComponent('mediumCollection', 'mediacollections-tab', 'mediacollection-datatable');
		},

		initMediaCollections: function() {
			// nav-bar functionality
			$('#mediacollections-tab').on('click', function(event) {
				TIMAAT.MediaCollectionDatasets.loadMediaCollections();
				TIMAAT.URLHistory.setURL(null, 'Medium Collection Datasets', '#mediaCollection/list');
			});

			$('#mediacollection-tab-mediumcollection-metadata').on('click', function(event) {
				let mediumCollection = $('#mediacollection-metadata-form').data('mediumCollection');
				let type = $('#mediacollection-metadata-form').data('data-type');
				TIMAAT.MediaDatasets.displayDataSetContentArea('mediacollection-metadata-form');
				TIMAAT.MediaCollectionDatasets.subNavTab = 'dataSheet';
				TIMAAT.MediaCollectionDatasets.lastForm = 'dataSheet';
				TIMAAT.MediaCollectionDatasets.displayDataSetContent('dataSheet', mediumCollection, 'show', type);
				TIMAAT.URLHistory.setURL(null, mediumCollection.model.title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediaCollection/' + mediumCollection.model.id);
			});

			// add medium collection button functionality (in medium collection list - opens datasheet form)
			$('#timaat-mediacollectiondatasets-mediumcollection-add').on('click', function(event) {
				$('#mediacollection-metadata-form').data('mediumCollection', null);
				TIMAAT.MediaCollectionDatasets.addMediumCollection();
			});

			// delete medium collection button (in form) handler
			$('#mediumcollection-form-delete-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediacollectiondatasets-mediumcollection-delete').data('mediumCollection', $('#mediacollection-metadata-form').data('mediumCollection'));
				$('#timaat-mediacollectiondatasets-mediumcollection-delete').modal('show');
			});

			// confirm delete medium collection modal functionality
			$('#timaat-mediacollectiondatasets-modal-delete-submit').on('click', async function(ev) {
				var modal = $('#timaat-mediacollectiondatasets-mediumcollection-delete');
				var mediumCollection = modal.data('mediumCollection');
				if (mediumCollection) {
					try {	
						await TIMAAT.MediaCollectionDatasets._mediumCollectionRemoved(mediumCollection);
					} catch(error) {
						console.log("error: ", error);
					}
					try {
						await TIMAAT.MediaCollectionDatasets.refreshDataTable();
					} catch(error) {
						console.log("error: ", error);
					}
				}
				modal.modal('hide');
				TIMAAT.MediaDatasets.hideDataSetContentContainer();
				TIMAAT.MediaCollectionDatasets.loadMediaCollections();
			});

			// edit content form button handler
			$('#mediumcollection-form-edit-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				let mediumCollection = $('#mediacollection-metadata-form').data('mediumCollection');
				let type = $('#mediacollection-metadata-form').data('data-type');
				switch(TIMAAT.MediaCollectionDatasets.lastForm) {
					case 'dataSheet':
						TIMAAT.MediaCollectionDatasets.displayDataSetContent('dataSheet', mediumCollection, 'edit', type);
					break;
					case 'items':
						TIMAAT.MediaCollectionDatasets.displayDataSetContent('items', mediumCollection, 'edit');
					break;
					case 'publication':
						TIMAAT.MediaCollectionDatasets.displayDataSetContent('publication', mediumCollection);
					break;
				}
				// medium.listView.find('.timaat-mediacollectiondatasets-medium-list-tags').popover('show');
			});

			// medium collection form handlers
			// submit medium collection metadata button functionality
			$('#mediacollection-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#mediacollection-metadata-form').valid()) return false;

				var type = $('#mediacollection-metadata-form').data('data-type');
				var mediumCollection = $('#mediacollection-metadata-form').data('mediumCollection');				

				// create/edit medium collection window submitted data
				$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', false);
				var formData = $('#mediacollection-metadata-form').serializeArray();
				$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', true);
        // console.log("TCL: formData", formData);
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				// console.log("TCL: formDataObject", formDataObject);
				// sanitize form data
				var formDataSanitized = formDataObject;
				formDataSanitized.typeId = Number(formDataObject.typeId);
				formDataSanitized.tracks = Number(formDataObject.tracks);
				if (isNaN(formDataSanitized.tracks)) {
					formDataSanitized.tracks = 0;
				}
				formDataSanitized.seasons = Number(formDataObject.seasons);
				if (isNaN(formDataSanitized.seasons)) {
					formDataSanitized.seasons = 0;
				}
				formDataSanitized.isSystemic = (formDataObject.isSystemic == "on") ? true : false;
				if (formDataSanitized.typeId == 3) { // 3 == Series
					formDataSanitized.started = moment.utc(formDataObject.started, "YYYY-MM-DD");
					formDataSanitized.ended = moment.utc(formDataObject.ended, "YYYY-MM-DD");
					}
				// console.log("TCL: formDataSanitized", formDataSanitized);
				
				if (mediumCollection) { // update medium collection
					// medium collection data
					mediumCollection.model.title = formDataSanitized.title;
					mediumCollection.model.isSystemic = formDataSanitized.isSystemic;
					mediumCollection.model.remark = formDataSanitized.remark;
					// medium collection subtype data
					switch (type) {
						case "Album":
							mediumCollection.model.mediaCollectionAlbum.tracks = formDataSanitized.tracks;
						break;
						case "Series":
							mediumCollection.model.mediaCollectionSeries.started = formDataSanitized.started;
							mediumCollection.model.mediaCollectionSeries.ended = formDataSanitized.ended;
							mediumCollection.model.mediaCollectionSeries.seasons = formDataSanitized.seasons;
						break;
					}
					await TIMAAT.MediaCollectionDatasets.updateMediumCollection(type, mediumCollection);
					// medium.updateUI();
				} else { // create new medium collection
					type = $('#timaat-mediacollectiondatasets-metadata-type-id').find('option:selected').html();
					var mediumCollectionModel = await TIMAAT.MediaCollectionDatasets.createMediumCollectionModel(formDataSanitized);
					var mediumCollectionSubtypeModel = await TIMAAT.MediaCollectionDatasets.createMediumCollectionSubtypeModel(formDataSanitized, type);

					var newMediumCollection = await TIMAAT.MediaCollectionDatasets.createMediumCollection(type, mediumCollectionModel, mediumCollectionSubtypeModel);
					mediumCollection = new TIMAAT.MediumCollection(newMediumCollection);
					$('#mediacollection-metadata-form').data('mediumCollection', mediumCollection);
					$('#media-tab-mediumcollection-metadata-form').trigger('click');
					TIMAAT.URLHistory.setURL(null, mediumCollection.model.title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediaCollection/' + mediumCollection.model.id);
				}
				$('.add-mediumcollection-button').prop('disabled', false);
				$('.add-mediumcollection-button :input').prop('disabled', false);
				$('.add-mediumcollection-button').show();
				await TIMAAT.MediaCollectionDatasets.refreshDataTable();
				TIMAAT.MediaCollectionDatasets.selectLastListSelection(mediumCollection.model.id);
				TIMAAT.MediaCollectionDatasets.displayDataSetContent('dataSheet', mediumCollection, 'show', type);
			});

			// cancel add/edit button in content form functionality
			$('#mediacollection-metadata-form-dismiss').on('click', async function(event) {
				$('.add-mediumcollection-button').prop('disabled', false);
				$('.add-mediumcollection-button :input').prop('disabled', false);
				$('.add-mediumcollection-button').show();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

			// tag button handler
			$('#mediumcollection-form-tag-button').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#timaat-mediacollectiondatasets-mediumcollection-tags');
				modal.data('mediumCollection', $('#mediacollection-metadata-form').data('mediumCollection'));
				var mediumCollection = modal.data('mediumCollection');
				modal.find('.modal-body').html(`
					<form role="form" id="mediumCollectionTagsModalForm">
						<div class="form-group">
							<label for="mediumcollection-tags-multi-select-dropdown">Medium collection tags</label>
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="mediumcollection-tags-multi-select-dropdown"
												name="tagId"
												data-role="tagId"
												data-placeholder="Select medium collection tags"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
        $('#mediumcollection-tags-multi-select-dropdown').select2({
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
				await TIMAAT.MediaCollectionService.getTagList(mediumCollection.model.id).then(function(data) {
					console.log("TCL: then: data", data);
					var tagSelect = $('#mediumcollection-tags-multi-select-dropdown');
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
				$('#timaat-mediacollectiondatasets-mediumcollection-tags').modal('show');
			});

			// submit tag modal button functionality
			$('#timaat-mediacollectiondatasets-modal-tag-submit').on('click', async function(event) {
				event.preventDefault();
				var modal = $('#timaat-mediacollectiondatasets-mediumcollection-tags');
				if (!$('#mediumCollectionTagsModalForm').valid()) 
					return false;
				var mediumCollection = modal.data('mediumCollection');
				var formDataRaw = $('#mediumCollectionTagsModalForm').serializeArray();
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
				mediumCollection.model = await TIMAAT.MediaCollectionDatasets.updateMediumCollectionHasTagsList(mediumCollection.model, tagIdList);
				if (newTagList.length > 0) {
					var updatedMediumCollectionModel = await TIMAAT.MediaCollectionDatasets.createNewTagsAndAddToMediumCollection(mediumCollection.model, newTagList);
					console.log("TCL: updatedMediumCollectionModel", updatedMediumCollectionModel);
					mediumCollection.model.tags = updatedMediumCollectionModel.tags;
				}
				$('#medium-metadata-form').data('mediumCollection', mediumCollection);
				modal.modal('hide');
			});

			$('#timaat-mediacollectiondatasets-metadata-type-id').on('change', function(event) {
				event.stopPropagation();
				let type = $('#timaat-mediacollectiondatasets-metadata-type-id').find('option:selected').html();
				TIMAAT.MediaCollectionDatasets.initFormDataSheetData(type);
			});

		},

		initMediaCollectionItems: function() {
			// nav-bar functionality
			$('#mediacollection-tab-mediumcollection-items').on('click', async function(event) {
				let mediumCollection = $('#mediacollection-metadata-form').data('mediumCollection');
				let type = mediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
				let title = mediumCollection.model.title;
				let id = mediumCollection.model.id;
				TIMAAT.MediaDatasets.displayDataSetContentArea('mediacollection-mediaItems');
				TIMAAT.MediaCollectionDatasets.subNavTab = 'items';
				TIMAAT.MediaCollectionDatasets.lastForm = 'items';
				TIMAAT.MediaCollectionDatasets.setMediumCollectionItemList();
		
				if (TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList) {
					TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediaCollection/' + id + '/hasMediaList')
					TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload();
				} else {
					await TIMAAT.MediaCollectionDatasets.setupMediumCollectionItemListDataTable(id);
					TIMAAT.MediaCollectionDatasets.setMediumCollectionItemList();
				}
				TIMAAT.MediaCollectionDatasets.displayDataSetContent('items', mediumCollection);
				$('#mediumcollection-items-add-button').prop('disabled', false);
				$('#mediumcollection-items-add-button :input').prop('disabled', false);
				$('#mediumcollection-items-add-button').show();
				TIMAAT.URLHistory.setURL(null, title + ' · Collection Items · ' + type[0].toUpperCase() + type.slice(1), '#mediaCollection/' + id + '/items');
			});

			// add medium collection button functionality (in medium collection list - opens datasheet form)
			$('#mediumcollection-items-add-button').on('click', function(event) {
				let collection = $('#mediacollection-metadata-form').data('mediumCollection');
        console.log("TCL ~ $ ~ collection", collection);
				TIMAAT.MediaCollectionDatasets.addMediumCollectionItem(collection.model.id);
			});

			$('#timaat-mediacollectiondatasets-item-add').on('hide.bs.modal', function(event) {
				TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
			})

		},
		
		_setupPublicationSheet: function(enabled, restricted) {
			$('#timaat-publish-mediacollection-switch').prop('checked', enabled);
			$('#timaat-publication-mediacollection-protected-switch').prop('checked', restricted);
			let credentials = {};
			try {
				credentials = JSON.parse(this.publication.credentials);
			} catch (e) { credentials = {}; }
			let sheet = $('.mediacollection-publication-wrapper');
			let title = ( this.publication ) ? this.publication.title : '';
			let username = ( credentials.user && enabled ) ? credentials.user : '';
			let password = ( credentials.password && enabled ) ? credentials.password : '';
			let url = ( this.publication ) ? window.location.protocol+'//'+window.location.host+window.location.pathname+'publication/'+this.publication.slug+'/' : '';
			sheet.find('.protectedicon').removeClass('fa-lock').removeClass('fa-lock-open');
			if ( restricted ) sheet.find('.protectedicon').addClass('fa-lock'); else sheet.find('.protectedicon').addClass('fa-lock-open');
			
			sheet.find('.publicationtitle').prop('disabled', !enabled);
			sheet.find('#timaat-publication-protected-switch').prop('disabled', !enabled);
			sheet.find('.username').prop('disabled', !enabled || !restricted);
			sheet.find('.username').val(username);
			sheet.find('.password').prop('disabled', !enabled || !restricted);
			sheet.find('.password').val(password);
			sheet.find('.password').attr('type', 'password');
			$('#timaat-mediacollection-publication-settings-submit').prop('disabled', enabled && restricted && username == '' && password == '');

			if ( enabled ) {
				sheet.find('.publicationtitle').val(title);
				if ( url.length > 0 ) url = '<a href="'+url+'" target="_blank">'+url+'</a>'; 
				else url = '- Publikationslink nach dem Speichern verfügbar -';
				sheet.find('.publicationurl').html(url);
			} else {
				sheet.find('.publicationtitle').val('');
				sheet.find('.publicationurl').html('- Collection nicht publiziert -');
			}
		},
		
		_updatePublicationSettings: function() {
			let sheet = $('.mediacollection-publication-wrapper');
			let enabled = $('#timaat-publish-mediacollection-switch').prop('checked');
			let restricted = $('#timaat-publication-mediacollection-protected-switch').prop('checked');
			let username = ( sheet.find('.username').val() && restricted ) ? sheet.find('.username').val() : '';
			let password = ( sheet.find('.password').val() && restricted ) ? sheet.find('.password').val() : '';
			$('#timaat-mediacollection-publication-settings-submit').prop('disabled', true);
			$('#timaat-mediacollection-publication-settings-submit i.login-spinner').removeClass('d-none');
			let dataset = this;
			let collection = $('#mediacollection-metadata-form').data('mediumCollection');
			if ( enabled ) {
				let publication = (this.publication) ? this.publication : { id: 0 };
				publication.access = (restricted) ? 'protected' : 'public';
				publication.collectionId = null;
				publication.ownerId = TIMAAT.Service.session.id;
				publication.settings = null;
				publication.slug = TIMAAT.Util.createUUIDv4();
				publication.collectionId = collection.model.id;
				publication.startMediumId = null;
				publication.title = sheet.find('.publicationtitle').val();
				publication.credentials = JSON.stringify({
					scheme: 'password',
					user: username,
					password: password,
				});
				TIMAAT.Service.updateCollectionPublication(publication).then(publication => {
					dataset.publication = publication;
					dataset._setupPublicationSheet(publication !=null, publication !=null && publication.access == 'protected');
					$('#timaat-mediacollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediacollection-publication-settings-submit i.login-spinner').addClass('d-none');
					sheet.find('.saveinfo').show().delay(1000).fadeOut();
				}).catch( e => {
					$('#timaat-mediacollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediacollection-publication-settings-submit i.login-spinner').addClass('d-none');
				})
			} else {
				TIMAAT.Service.deleteCollectionPublication(collection.model.id).then(status => {
					dataset.publication = null;
					dataset._setupPublicationSheet(false, false);
					$('#timaat-mediacollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediacollection-publication-settings-submit i.login-spinner').addClass('d-none');
					sheet.find('.saveinfo').show().delay(1000).fadeOut();
				}).catch( e => {
					$('#timaat-mediacollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediacollection-publication-settings-submit i.login-spinner').addClass('d-none');
				})
			}
		},

		initMediaCollectionPublication: function() {
			let dataset = this;
			// events
			$('#timaat-publish-mediacollection-switch, #timaat-publication-mediacollection-protected-switch').on('change', ev => {
				dataset._setupPublicationSheet($('#timaat-publish-mediacollection-switch').prop('checked'), $('#timaat-publication-mediacollection-protected-switch').prop('checked'));
			});

			let sheet = $('.mediacollection-publication-wrapper');
			sheet.find('.reveal').on('click', ev => {
				if ( sheet.find('.password').attr('type') === 'password' )
					sheet.find('.password').attr('type', 'text');
				else sheet.find('.password').attr('type', 'password');
			});
			sheet.find('.username, .password').on('change input', ev => {
				let enabled = $('#timaat-publish-mediacollection-switch').prop('checked');
				let restricted = $('#timaat-publication-mediacollection-protected-switch').prop('checked');
				let username = sheet.find('.username').val();
				let password = sheet.find('.password').val();
				$('#timaat-mediacollection-publication-settings-submit').prop('disabled', enabled && restricted && username == '' && password == '');
			});

			$('#timaat-mediacollection-publication-settings-submit').on('click', ev => {
				dataset._updatePublicationSettings();
			})

			// nav-bar functionality
			$('#mediacollection-tab-mediumcollection-publication').on('click', async function(event) {
				// console.log("TCL: Media Collection Publication Tab clicked");
				let mediumCollection = $('#mediacollection-metadata-form').data('mediumCollection');
				TIMAAT.MediaDatasets.displayDataSetContentArea('mediacollection-publication');
				TIMAAT.MediaCollectionDatasets.subNavTab = 'publication';
				TIMAAT.MediaCollectionDatasets.lastForm = 'publication';
				TIMAAT.MediaCollectionDatasets.displayDataSetContent('publication', mediumCollection);
				TIMAAT.URLHistory.setURL(null, mediumCollection.model.title + ' · Collection Publication · ' + mediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type[0].toUpperCase() + mediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type.slice(1), '#mediaCollection/' + mediumCollection.model.id + '/publication');
			});
		},

		load: function() {
			this.loadMediaCollections();
		},

		loadMediaCollections: function() {
			TIMAAT.MediaDatasets.displayComponent('mediumCollection', 'mediacollections-tab', 'mediacollection-datatable');
			$('#videoPreview').get(0).pause();
			this.setMediumCollectionList();
			this.selectLastListSelection(0);
			this.subNavTab = 'dataSheet';
		},
		
		// loadMediaCollectionItems: function() {
		// 	this.setMediumCollectionItemList();
    // },
    
    loadMediaCollectionDataTables: async function() {
			this.setupMediumCollectionListDataTable();
			this.setupMediumCollectionItemListDataTable();
			this.setupMediumCollectionAddMediaDataTable();
			this.setupMediumCollectionAddedMediaDataTable();
		},

		setMediumCollectionList: function() {
    	// console.log("TCL: setMediumCollectionList");
			if ( this.mediaCollectionList == null ) return;

			this.clearLastSelection();
			$('#timaat-mediacollectiondatasets-mediumcollection-list-loader').remove();
			// clear old UI list
			$('#timaat-mediacollectiondatasets-mediumcollection-list').empty();
			
			// set ajax data source
			if ( this.dataTableMediaCollectionList ) {
				this.dataTableMediaCollectionList.ajax.reload(null, false);
			}
		},

		setMediumCollectionItemList: function() {
    	// console.log("TCL: setMediumCollectionItemList");
			if ( this.mediaCollectionItemList == null ) return;

			this.clearLastItemSelection();
			$('#timaat-mediacollectiondatasets-mediumcollection-items-loader').remove();
			// clear old UI list
			$('#timaat-mediacollectiondatasets-mediumcollection-items').empty();
			
			// set ajax data source
			if ( this.dataTableMediaCollectionItemList ) {
        // console.log("TCL: this.dataTableMediaCollectionItemList", this.dataTableMediaCollectionItemList);
				this.dataTableMediaCollectionItemList.ajax.reload(null, false);
			}
		},

		displayDataSetContent: function(form, mediumCollection, mode = 'show', type = null) {
			this.subNavTab = form;
			switch(form) {
				case 'dataSheet':
					TIMAAT.MediaDatasets.setDataSetContentActiveNavTab('mediacollection-tab-mediumcollection-metadata');
					this.mediumCollectionFormDataSheet(mode, type, mediumCollection);
				break;
				case 'items':
					TIMAAT.MediaDatasets.setDataSetContentActiveNavTab('mediacollection-tab-mediumcollection-items');
					this.mediumCollectionFormItems(mode, mediumCollection);
				break;
				case 'publication':
					TIMAAT.MediaDatasets.setDataSetContentActiveNavTab('mediacollection-tab-mediumcollection-publication');
					this.mediumCollectionFormPublication(mediumCollection);
				break;
			}
		},

		addMediumCollection: function() {	
			// console.log("TCL: addMediumCollection: type", type);
			TIMAAT.MediaDatasets.displayDataSetContentContainer('mediacollection-tab-mediumcollection-metadata', 'mediacollection-metadata-form')
			$('.add-mediumcollection-button').hide();
			$('.add-mediumcollection-button').prop('disabled', true);
			$('.add-mediumcollection-button :input').prop('disabled', true);
			$('#mediacollection-metadata-form').data('mediumCollection', null);
			mediumFormMetadataValidator.resetForm();

			this.selectLastListSelection(null);
			this.subNavTab = 'dataSheet';
			$('#mediacollection-metadata-form').trigger('reset');

			let type = $('#timaat-mediacollectiondatasets-metadata-type-id').find('option:selected').html();
			this.initFormDataSheetData(type);
			this.initFormDataSheetForEdit();
			$('#mediacollection-metadata-form-submit').html('Add');
			$('#mediumCollectionFormHeader').html('Add media collection');
			$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', false);
			$('#timaat-mediacollectiondatasets-metadata-type-id :input').prop('disabled', false);
		},

		addMediumCollectionItem: async function(collectionId) {	
    	console.log("TCL: addMediumCollectionItem - collectionId: ", collectionId);
			if ( this.dataTableMedia ) {
				this.dataTableMedia.ajax.url('api/mediaCollection/'+collectionId+'/notInMediaList');
				this.dataTableMedia.ajax.reload(null, false);
			}
			if ( this.dataTableCollectionItems ) {
				this.dataTableCollectionItems.ajax.url('api/mediaCollection/'+collectionId+'/mediaList');
				this.dataTableCollectionItems.ajax.reload(null, false);
			}
			$('#timaat-mediacollectiondatasets-item-add').modal('show');
		},

		mediumCollectionFormDataSheet: async function(action, type, data) {
			// console.log("TCL: action, type, data", action, type, data);
			this.selectLastListSelection(data.model.id);
			$('#mediacollection-metadata-form').trigger('reset');
			$('#mediacollection-metadata-form').data('data-type', type);
			this.initFormDataSheetData(type);
			mediumFormMetadataValidator.resetForm();

			if ( action == 'show') {
				$('#mediacollection-metadata-form :input').prop('disabled', true);
				$('.form-buttons').show();
				$('.form-buttons').prop('disabled', false);
				$('.form-buttons :input').prop('disabled', false);
				$('#mediacollection-metadata-form-submit').hide();
				$('#mediacollection-metadata-form-dismiss').hide();
				$('#mediumCollectionFormHeader').html(type+" Datasheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				$('#mediacollection-metadata-form-submit').html('Save');
				$('#mediumCollectionFormHeader').html('Edit '+type);
				this.initFormDataSheetForEdit();
				$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', true);
				$('#timaat-mediacollectiondatasets-metadata-type-id :input').prop('disabled', true);
			}

			// console.log("TCL: modelData", modelData);
			// setup UI

			// medium collection data
			$('#timaat-mediacollectiondatasets-metadata-title').val(data.model.title);
			$('#timaat-mediacollectiondatasets-metadata-type-id').val(data.model.mediaCollectionType.id);
			if (data.model.isSystemic)
				$('#timaat-mediacollectiondatasets-metadata-issystemic').prop('checked', true);
				else $('#timaat-mediacollectiondatasets-metadata-issystemic').prop('checked', false);
			$('#timaat-mediacollectiondatasets-metadata-remark').val(data.model.remark);

			// medium collection subtype specific data
			switch (type) {
				case 'Album':
					$('#timaat-mediacollectiondatasets-metadata-album-tracks').val(data.model.mediaCollectionAlbum.tracks);
				break;
				case 'Series':
					$('#timaat-mediacollectiondatasets-metadata-series-seasons').val(data.model.mediaCollectionSeries.seasons);
					if (data.model.mediaCollectionSeries.started != null && !(isNaN(data.model.mediaCollectionSeries.started)))
						$('#timaat-mediacollectiondatasets-metadata-series-started').val(moment.utc(data.model.mediaCollectionSeries.started).format('YYYY-MM-DD'));
						else $('#timaat-mediacollectiondatasets-metadata-series-started').val('');
					if (data.model.mediaCollectionSeries.ended != null && !(isNaN(data.model.mediaCollectionSeries.ended)))
						$('#timaat-mediacollectiondatasets-metadata-series-ended').val(moment.utc(data.model.mediaCollectionSeries.ended).format('YYYY-MM-DD'));
						else $('#timaat-mediacollectiondatasets-metadata-series-ended').val('');
				break;
			}
			$('#mediacollection-metadata-form').data('mediumCollection', data);
		},

		mediumCollectionFormItems: async function(action, data) {
			console.log("TCL: action, data", action, data);
			// TIMAAT.MediaCollectionDatasets.selectLastItemSelection(data.model.id); // TODO get medium Id of item
			this.selectLastListSelection(data.model.id);
			$('#mediacollection-mediaItems').trigger('reset');
			var type = $('#mediacollection-metadata-form').data('data-type');

			mediumFormMetadataValidator.resetForm();

			if ( action == 'show') {
				$('#mediacollection-mediaItems :input').prop('disabled', true);
				$('.form-buttons').show();
				$('.form-buttons').prop('disabled', false);
				$('.form-buttons :input').prop('disabled', false);
				$('#mediacollection-mediaItems-submit').hide();
				$('#mediacollection-mediaItems-dismiss').hide();
				$('#mediumcollection-items-add-button').prop('disabled', false);
				$('#mediumcollection-items-add-button :input').prop('disabled', false);
				$('#mediumcollection-items-add-button').show();
				$('#mediumCollectionFormHeader').html(type+" Datasheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				$('#mediacollection-mediaItems-submit').html('Save');
				$('#mediumCollectionFormHeader').html("Edit "+type);
				this.initFormDataSheetForEdit();
			}
			// medium collection item data
			// $('#mediacollection-mediaItems').data(type, data);
		},

		mediumCollectionFormPublication: async function(collection) {
      console.log("TCL ~ mediumCollectionFormPublication:function ~ collection", collection);
			$('#mediacollection-publication').trigger('reset');
			this.selectLastListSelection(collection.model.id);
			mediumFormMetadataValidator.resetForm();
			let publication = await TIMAAT.Service.getCollectionPublication(collection.model.id);
			this.mediaCollectionPublication = publication;
			this._setupPublicationSheet(publication !=null, publication !=null && publication.access == 'protected');
		},

		setupMediumCollectionItemListDataTable: async function() {
			// console.log("TCL: setupMediumCollectionItemListDataTable");
      this.dataTableMediaCollectionItemList = $('#timaat-mediacollectiondatasets-mediumcollection-items-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"processing"    : true,
				"stateSave"     : true,
				"scrollX"				: true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"rowId"					: 'id',
				"serverSide"		: true,
				"ajax": {
					"url"        : "api/mediaCollection/0/hasMediaList",
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
						TIMAAT.MediaCollectionDatasets.mediaCollectionItemList = data.data;
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> TIMAAT.MediaCollectionDatasets.mediaCollectionItemList", TIMAAT.MediaCollectionDatasets.mediaCollectionItemList);
						return data.data;       
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: rowCallback: row, data", row, data);
					if (data.id == TIMAAT.MediaCollectionDatasets.selectedMediumCollectionItemId) {
						TIMAAT.MediaCollectionDatasets.clearLastItemSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumCollectionElement = $(row);
					let mediumCollectionHasMedium = data;
					mediumCollectionHasMedium.ui = mediumCollectionElement;
					// TODO refactor
					mediumCollectionElement.data('medium', mediumCollectionHasMedium.medium);
					// mediumCollectionElement.find('input:checkbox').prop('checked', false);
					// mediumCollectionElement.find('input:checkbox').change(function() {
					// 	$('#timaat-videochooser-list-action-submit').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);				
					// });

					// if ( medium.fileStatus != "noFile" ) TIMAAT.VideoChooser.loadThumbnail(medium);
					// TIMAAT.MediaCollectionDatasets.setMediumStatus(medium);
					
					// set up events
					// mediumCollectionElement.on('click', '.timaat-medium-thumbnail', function(ev) {
					// 	mediumCollectionElement.find('.timaat-medium-annotate').click();
					// });

					mediumCollectionElement.on('click', function(event) {
						TIMAAT.MediaCollectionDatasets.selectedMediumCollectionItemId = mediumCollectionHasMedium.id.mediumId;
					});

					mediumCollectionElement.on('click', '.timaat-medium-annotate', function(event) {
						event.stopPropagation();
						TIMAAT.UI.hidePopups();
						if (!mediumCollectionHasMedium.medium.mediumVideo) return; //* allow annotating only for Videos
						if ( mediumCollectionHasMedium.medium.fileStatus && mediumCollectionHasMedium.medium.fileStatus != 'ready' && mediumCollectionHasMedium.medium.fileStatus != 'transcoding' && mediumCollectionHasMedium.medium.fileStatus != 'waiting' ) return;
						TIMAAT.UI.showComponent('videoplayer');
						// setup medium in player
						console.log("TCL: setupVideo");
						TIMAAT.VideoPlayer.setupVideo(mediumCollectionHasMedium.medium);
						// load medium annotations from server
						TIMAAT.AnalysisListService.getAnalysisLists(mediumCollectionHasMedium.medium.id, TIMAAT.VideoPlayer.setupMediumAnalysisLists);
					});

					mediumCollectionElement.on('click', '.timaat-mediadatasets-media-metadata', async function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.MediaDatasets.initMediaComponent();
						var type = mediumCollectionHasMedium.medium.mediaType.mediaTypeTranslations[0].type;
						var selectedMedium = {};
						selectedMedium.model = mediumCollectionHasMedium.medium;
            // console.log("TCL: selectedMedium", selectedMedium);
						TIMAAT.MediaDatasets.selectLastSelection(type, selectedMedium.model.id);
						TIMAAT.MediaDatasets.dataTableMedia.search(selectedMedium.model.displayTitle.name).draw();
						$('#medium-metadata-form').data('medium', selectedMedium);
						TIMAAT.MediaDatasets.mediumFormDataSheet('show', type, selectedMedium);
					});

					mediumCollectionElement.on('click', '.timaat-mediacollectiondatasets-collectionitem-remove', async function(ev) {
						var row = $(this).parents('tr');
						let collection = $('#mediacollection-metadata-form').data('mediumCollection');
						let medium = $(row).data('medium');
						await TIMAAT.MediaCollectionService.removeCollectionItem(collection.model.id, medium.id);
						await TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
					});

					mediumCollectionElement.on('click', '.timaat-mediacollectiondatasets-collectionitem-moveup', async function(event) {
						let row = $(this).parents('tr');
						let collection = $('#mediacollection-metadata-form').data('mediumCollection');
						let medium = $(row).data('medium');
						let collectionId = collection.model.id;
						let mediumId = medium.id;
						let index = -1;
						//! This does only work if item list is sorted by sort order. TODO refactor if sorting by title is possible, too
						index = TIMAAT.MediaCollectionDatasets.mediaCollectionItemList.findIndex(({id}) => id.mediumId === mediumId);
						if (index > 0) {
							let sortOrder = TIMAAT.MediaCollectionDatasets.mediaCollectionItemList[index].sortOrder;
							await TIMAAT.MediaCollectionService.updateCollectionItem(collectionId,
																																			 mediumId,
																																			 TIMAAT.MediaCollectionDatasets.mediaCollectionItemList[index-1].sortOrder);
							await TIMAAT.MediaCollectionService.updateCollectionItem(collectionId, 
																																			 TIMAAT.MediaCollectionDatasets.mediaCollectionItemList[index-1].id.mediumId,
																																			 sortOrder);
						}
						await TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
					});

					mediumCollectionElement.on('click', '.timaat-mediacollectiondatasets-collectionitem-movedown', async function(event) {
						let row = $(this).parents('tr');
						let collection = $('#mediacollection-metadata-form').data('mediumCollection');
						let medium = $(row).data('medium');
						let collectionId = collection.model.id;
						let mediumId = medium.id;
						let index = -1;
						//! This does only work if item list is sorted by sort order. TODO refactor if sorting by title is possible, too
						index = TIMAAT.MediaCollectionDatasets.mediaCollectionItemList.findIndex(({id}) => id.mediumId === mediumId);
						if (index < TIMAAT.MediaCollectionDatasets.mediaCollectionItemList.length) {
							let sortOrder = TIMAAT.MediaCollectionDatasets.mediaCollectionItemList[index].sortOrder;
							await TIMAAT.MediaCollectionService.updateCollectionItem(collectionId,
																																			 mediumId,
																																			 TIMAAT.MediaCollectionDatasets.mediaCollectionItemList[index+1].sortOrder);
							await TIMAAT.MediaCollectionService.updateCollectionItem(collectionId, 
																																			 TIMAAT.MediaCollectionDatasets.mediaCollectionItemList[index+1].id.mediumId,
																																			 sortOrder);
						}
						await TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
					});
					
					// mediumCollectionElement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
					// 	if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
					// 	let length = medium.mediumVideo.length;
					// 	if ( length < 0 ) length += 3600;
					// 	let timecode = Math.round((ev.originalEvent.offsetX/254)*length);
					// 	timecode = Math.min(Math.max(0, timecode),length);
					// 	mediumCollectionElement.find('.timaat-medium-thumbnail').attr('src', "/TIMAAT/api/medium/"+medium.id+"/thumbnail"+"?time="+timecode+"&token="+medium.viewToken);
					// });
					
					// mediumCollectionElement.find('.card-img-top').bind("mouseleave", function(ev) {
					// 	if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
					// 	mediumCollectionElement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/"+medium.id+"/thumbnail"+"?token="+medium.viewToken);
					// });
								
					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	TIMAAT.VideoChooser.updateVideoStatus(medium);

				},
				"columns": [
					// { data: 'id', className: 'videochooser-item', orderable: false, render: function(data, type, medium, meta) {
					// 	return '<input type="checkbox" aria-label="Checkbox">';
					// }, createdCell( cell, cellData, rowData, rowIndex, colIndex ) {
					// 	$(cell).attr('id', 'videochooser-item-'+cellData);
					// }
					// },
					// { data: null, className: 'videochooser-item-preview', orderable: false, render: function(data, type, medium, meta) {
					// 	let ui = `<div class="timaat-medium-status">
					// 			<i class="fas fa-cog fa-spin"></i>
					// 			</div>
					// 		<img class="card-img-top timaat-medium-thumbnail" src="img/medium-placeholder.png" width="150" height="85" alt="Videovorschau"/>`;
					// 	return ui;
					// 	}
					// },
					{ data: 'sortOrder', className: 'sortOrder', width: '5%', render: function(data, type, collectionItem, meta) {
						// console.log(`TCL: sortOrder:function -> data, type, collectionItem, meta`, data, type, collectionItem, meta);
						let order = 
							`<div class="row">
								<div class="col-md-6" style="text-align: right; padding-right: 1px; padding-left: 0px;">`+(collectionItem.sortOrder+1)+`</div>
								<div class="col-md-6">`;
						if (meta.row > 0) {
							order += `<button type="button" title="Sort up" class="btn btn-outline-secondary btn-sm timaat-mediacollectiondatasets-collectionitem-moveup"><i class="fas fa-sort-up"></i></button>`;
						}
						if (meta.row < TIMAAT.MediaCollectionDatasets.mediaCollectionItemList.length-1) {
							order += `<button type="button" title="Sort down" class="btn btn-outline-secondary btn-sm timaat-mediacollectiondatasets-collectionitem-movedown"><i class="fas fa-sort-down"></i></button>`;
						}
						order += `</div>
							</div>`;
						return order;
						}
					},
					{ data: 'id', name: 'title', className: 'title', orderable: false, render: function(data, type, collectionItem, meta) {
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						let titleDisplay = `<p>`+collectionItem.medium.displayTitle.name+`</p>`;
							if (collectionItem.medium.originalTitle != null && collectionItem.medium.displayTitle.id != collectionItem.medium.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+collectionItem.medium.originalTitle.name+`)</i></p>`;
							}
							// TODO not working anymore due to server side datatable data search
							collectionItem.medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
								if (title.id != collectionItem.medium.displayTitle.id && (collectionItem.medium.originalTitle == null || title.id != collectionItem.medium.originalTitle.id)) {
									titleDisplay += `<div style="display:none">`+title.name+`</div>`;
								}
							});
							return titleDisplay;
						}
					},
					// { data: 'mediumVideo.length', name: 'duration', className: 'duration' , render: function(data, type, row, meta) {
					// 		return TIMAAT.Util.formatTime(data);
					// 	}
					// },
					// { data: 'mediumHasActorWithRoles', name: 'producer', className: 'producer', orderable: false, render: function(data, type, medium, meta) {
					// 		return TIMAAT.VideoChooser._getProducer(medium);
					// 	}
					// },
					// { data: 'releaseDate', name: 'releaseDate', className: 'date', render: function(data, type, medium, meta) {
					// 		return moment.utc(data).format('YYYY-MM-DD');
					// 	}
					// },
					{ data: null, className: 'actions', orderable: false, width: '5%', render: function(data, type, collectionItem, meta) {
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						let ui = `
							<div>
								<form action="/TIMAAT/api/medium/`+collectionItem.medium.id+`/upload" method="post" enctype="multipart/form-data">
									<input name="file" accept=".mp4" class="timaat-medium-upload-file d-none" type="file" />
									<button type="submit" title="Videodatei hochladen" class="btn btn-outline-primary btn-sm btn-block timaat-medium-upload"><i class="fas fa-upload"></i></button>
								</form>`;
							if (collectionItem.medium.mediumVideo && collectionItem.medium.fileStatus && (collectionItem.medium.fileStatus == 'ready' || collectionItem.medium.fileStatus == 'transcoding' || collectionItem.medium.fileStatus == 'waiting')) {
								ui +=	`<button type="button" title="Video annotieren" class="btn btn-outline-success btn-sm btn-block timaat-medium-annotate"><i class="fas fa-draw-polygon"></i></button>`;
							}
							ui +=	`
								<button type="button" title="Datenblatt editieren" class="btn btn-outline-secondary btn-sm btn-block timaat-mediadatasets-media-metadata"><i class="fas fa-file-alt"></i></button>
								<button type="button" title="Aus Mediensammlung entfernen"class="btn btn-outline-secondary btn-sm btn-block timaat-mediacollectiondatasets-collectionitem-remove"><i class="fas fa-folder-minus"></i></button>
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

		setupMediumCollectionListDataTable: function() {			
			// console.log("TCL: setupMediumCollectionListDataTable");
			this.dataTableMediaCollectionList = $('#timaat-mediacollectiondatasets-mediacollection-list-table').DataTable({
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
					"url"        : "api/mediaCollection/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
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
          	// console.log("TCL: data", data);
						// setup model
						var mediaCollections = Array();
						data.data.forEach(function(mediumCollection) { 
							if ( mediumCollection.id > 0 ) {
								mediaCollections.push(new TIMAAT.MediumCollection(mediumCollection));
							}
						});
						TIMAAT.MediaCollectionDatasets.mediaCollectionList = mediaCollections;
						TIMAAT.MediaCollectionDatasets.mediaCollectionList.model = data.data;
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: rowCallback: row, data", row, data);
					if (data.id == TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId) {
						TIMAAT.MediaCollectionDatasets.clearLastSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: Media dataTable -  createdRow");
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumCollectionElement = $(row);
					let mediumCollection = data;
					mediumCollection.ui = mediumCollectionElement;
					mediumCollectionElement.data('mediumCollection', mediumCollection);
					// TIMAAT.MediaCollectionDatasets.displayFileStatus(medium);

					mediumCollectionElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						$('#timaat-mediadatasets-media-tabs-container').append($('#timaat-mediadatasets-media-tabs'));
						$('#timaat-medium-modals-container').append($('#timaat-medium-modals'));
						TIMAAT.MediaDatasets.container = 'media';
						$('#previewTab').removeClass('annotationView');
						switch (TIMAAT.MediaCollectionDatasets.subNavTab) {
							case 'dataSheet':
								TIMAAT.MediaDatasets.displayDataSetContentContainer('mediumcollection-data-tab', 'mediacollection-metadata-form', 'mediumCollection');
							break;
							case 'items':
								TIMAAT.MediaDatasets.displayDataSetContentContainer('mediumcollection-data-tab', 'mediacollection-mediaItems', 'mediumCollection');
							break;
							case 'publication':
								TIMAAT.MediaDatasets.displayDataSetContentContainer('mediumcollection-data-tab', 'mediacollection-publication', 'mediumCollection');
							break;
						}
						TIMAAT.MediaCollectionDatasets.clearLastSelection();
						let index = TIMAAT.MediaCollectionDatasets.mediaCollectionList.findIndex(({model}) => model.id == mediumCollection.id);
						let selectedMediumCollection = TIMAAT.MediaCollectionDatasets.mediaCollectionList[index];
						TIMAAT.MediaCollectionDatasets.selectLastListSelection(mediumCollection.id);
						
						if (TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList) {
							TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediaCollection/'+mediumCollection.id+'/hasMediaList')
							TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload();
						}

						// console.log("TCL: selectedMediumCollection", selectedMediumCollection);
						$('#mediacollection-metadata-form').data('mediumCollection', selectedMediumCollection);
						let type = selectedMediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
						// $('#mediacollection-metadata-form').data('data-type', type);
						TIMAAT.MediaCollectionDatasets.displayDataSetContent(TIMAAT.MediaCollectionDatasets.subNavTab, selectedMediumCollection, 'show', type);
						TIMAAT.URLHistory.setURL(null, selectedMediumCollection.model.title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediaCollection/' + selectedMediumCollection.model.id);
					});
				},
				"columns": [
					{ data: 'id', name: 'title', className: 'title', render: function(data, type, mediumCollection, meta)
						{
							// console.log("TCL: data", data); // == mediumCollectionId
							let titleDisplay = `<p>` + mediumCollection.title + `</p>`;
							return titleDisplay;
						}
					},
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No collections found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ collections total)",
					"infoEmpty"   : "No collections available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ collections)",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});
		},

		setupMediumCollectionAddMediaDataTable: async function() {
			this.dataTableMedia = $('#timaat-mediacollection-items-modal .media-available').DataTable({
				lengthChange: false,
				dom         : 'rft<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				pageLength  : 5,
				deferLoading: 0,
				pagingType  : 'full',
				order       : [[ 0, 'asc' ]],
				processing  : true,
				serverSide  : true,
				ajax        : {
					"url"        : "api/mediaCollection/0/notInMediaList",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
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
						return data.data;
					}
				},
				"createdRow": function(row, data, dataIndex) {
					let mediumElement = $(row);
					let medium = data;
					mediumElement.data('medium', medium);

					mediumElement.find('.add-medium').on('click', medium, async function(ev) {
						ev.stopPropagation();
						// if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						let collection = $('#mediacollection-metadata-form').data('mediumCollection');
            console.log("TCL: collection", collection);
						$(this).remove();
						TIMAAT.MediaCollectionService.addCollectionItem(collection.model.id, medium.id)
						.then((result) => {
							TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.reload();
							TIMAAT.MediaCollectionDatasets.dataTableCollectionItems.ajax.reload();
						}).catch((error)=>{
							console.log("ERROR:", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, medium, meta) {
						// console.log("TCL: medium", medium);
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
							let titleDisplay = `<p>` + displayMediumTypeIcon + medium.displayTitle.name + `
									<span class="add-medium badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw"></i></span>
								</p>`;
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
				}],
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

		setupMediumCollectionAddedMediaDataTable: async function() {
			this.dataTableCollectionItems = $('#timaat-mediacollection-items-modal .media-collection').DataTable({
				lengthChange: false,
				pageLength  : 10,
				pagingType  : 'full',
				// dom         : 'rft<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				"dom"           : '<lf<t>ip>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				deferLoading: 0,
				order       : [[ 0, 'asc' ]],
				processing  : true,
				serverSide  : true,
				ajax        : {
					"url"        : "api/mediaCollection/0/mediaList",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
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
						return data.data; 
					}
				},
				"createdRow": function(row, data, dataIndex) {
					let mediumElement = $(row);
					let medium = data;
					mediumElement.data('medium', medium);

					mediumElement.find('.remove-medium').on('click', medium, function(ev) {
						ev.stopPropagation();
						// if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						let collection = $('#mediacollection-metadata-form').data('mediumCollection');
            console.log("TCL: collection", collection);
						$(this).remove();
						TIMAAT.MediaCollectionService.removeCollectionItem(collection.model.id, medium.id)
						.then((result)=>{
							TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.reload();
							TIMAAT.MediaCollectionDatasets.dataTableCollectionItems.ajax.reload();
						}).catch((error)=>{
							console.log("ERROR:", error);
						});
					});
				},
				"columns": [
					{ data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, medium, meta) {
						// console.log("TCL: medium", medium);
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
							let titleDisplay = `<p>` + displayMediumTypeIcon + medium.displayTitle.name + `
									<span class="remove-medium badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw"></i></span>
								</p>`;
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
				}],
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
		
		createMediumCollectionModel: async function(formDataObject) {
    	console.log("TCL: formDataObject, type", formDataObject);
			var model = {
				id: 0,
				isSystemic: formDataObject.isSystemic,
				title: formDataObject.title,
				remark: formDataObject.remark,
				mediaCollectionType: {
					id: formDataObject.typeId,
				}
			};
			return model;
		},

		createMediumCollectionSubtypeModel: async function(formDataObject, type) {
			var model = {};
			switch(type) {
				case 'Album':
					model = {
						mediaCollectionId: 0,
						tracks: formDataObject.tracks
					};
				break;
				case 'Series':
					model = {
						mediaCollectionId: 0,
						seasons: formDataObject.seasons,
						started: formDataObject.started,
						ended: formDataObject.ended
					};
				break;
			}
      console.log("TCL: model", model);
			return model;
		},

		createMediumCollection: async function(type, model, subTypeModel) {
    	console.log("TCL: createMediumCollection: type, model, subTypeModel", type, model, subTypeModel);
			try {				
				// create medium collection
				var newModel = await TIMAAT.MediaCollectionService.createMediumCollection(model);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// create subtype with medium collection id
				subTypeModel.mediaCollectionId = newModel.id;
				if (type != 'Collection') { //* Collection has no extra data table
					await TIMAAT.MediaCollectionService.createMediumCollectionSubtype(type, newModel, subTypeModel);
				}
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// push new medium collection to dataset model
				switch (type) {
					case 'Album':
						newModel.mediaCollectionAlbum = subTypeModel;
					break;
					case 'Series':
						newModel.mediaCollectionSeries = subTypeModel;
					break;
				};
			} catch(error) {
				console.log( "error: ", error);
			};
			return newModel;
		},

		updateMediumCollection: async function(subType, mediumCollection) {
			console.log("TCL: updateMediumCollection: async function -> mediumCollection at beginning of update process: ", subType, mediumCollection);
				try { // update subtype
					var tempSubtypeModel;
					switch (subType) {
						case 'Album':
							tempSubtypeModel = mediumCollection.model.mediaCollectionAlbum;
							await TIMAAT.MediaCollectionService.updateMediumCollectionSubtype(subType, tempSubtypeModel);
						break;
						case 'Series':
							tempSubtypeModel = mediumCollection.model.mediaCollectionSeries;
							await TIMAAT.MediaCollectionService.updateMediumCollectionSubtype(subType, tempSubtypeModel);
							break;
					}
				} catch(error) {
					console.log( "error: ", error);
				};
				
				try { // update mediumCollection
					await TIMAAT.MediaCollectionService.updateMediaCollection(mediumCollection.model);
				} catch(error) {
					console.log( "error: ", error);
				};
		},

		updateMediumCollectionHasTagsList: async function(mediumCollectionModel, tagIdList) {
    	console.log("TCL: mediumCollectionModel, tagIdList", mediumCollectionModel, tagIdList);
			try {
				var existingMediumCollectionHasTagsEntries = await TIMAAT.MediaCollectionService.getTagList(mediumCollectionModel.id);
        console.log("TCL: existingMediumCollectionHasTagsEntries", existingMediumCollectionHasTagsEntries);
				if (tagIdList == null) { //* all entries will be deleted
					mediumCollectionModel.tags = [];
					await TIMAAT.MediaCollectionService.updateMediaCollection(mediumCollectionModel);
				} else if (existingMediumCollectionHasTagsEntries.length == 0) { //* all entries will be added
					mediumCollectionModel.tags = tagIdList;
					await TIMAAT.MediaCollectionService.updateMediaCollection(mediumCollectionModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMediumCollectionHasTagsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < tagIdList.length; j++) {
							if (existingMediumCollectionHasTagsEntries[i].id == tagIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMediumCollectionHasTagEntries but not in tagIdList
              console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMediumCollectionHasTagsEntries[i]);
							existingMediumCollectionHasTagsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = mediumCollectionModel.tags.findIndex(({id}) => id === entriesToDelete[i].id);
							mediumCollectionModel.tags.splice(index,1);
							await TIMAAT.MediaCollectionService.removeTag(mediumCollectionModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing tags
					var idsToCreate = [];
          i = 0;
          for (; i < tagIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMediumCollectionHasTagsEntries.length; j++) {
              if (tagIdList[i].id == existingMediumCollectionHasTagsEntries[j].id) {
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
							mediumCollectionModel.tags.push(idsToCreate[i]);
							await TIMAAT.MediaCollectionService.addTag(mediumCollectionModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.log( "error: ", error);
			}
			return mediumCollectionModel;
		},

		createNewTagsAndAddToMediumCollection: async function(mediumCollectionModel, newTagList) {
			var i = 0;
			for (; i < newTagList.length; i++) {
				newTagList[i] = await TIMAAT.Service.createTag(newTagList[i].name);
				await TIMAAT.MediaCollectionService.addTag(mediumCollectionModel.id, newTagList[i].id);
				mediumCollectionModel.tags.push(newTagList[i]);
			}
			return mediumCollectionModel;
		},

		_mediumCollectionRemoved: async function(mediumCollection) {
    	// console.log("TCL: _mediumCollectionRemoved: ", mediumCollection);
			// sync to server
			try {
				await TIMAAT.MediaCollectionService.removeMediaCollection(mediumCollection.model);
			} catch(error) {
				console.log("error: ", error);
			}

			mediumCollection.remove();
		},

		initFormDataSheetData: function(type) {
    	console.log("TCL ~ type", type);
			$('.datasheet-data').hide();
			$('.mediumcollection-data').show();
			if (type == 'Album' || type == 'Series') {
				$('.mediumcollection-'+type+'-data').show();
			}
		},

		initFormDataSheetForEdit: function() {
			// setup form
			$('#timaat-mediacollectiondatasets-metadata-series-started').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediacollectiondatasets-metadata-series-ended').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('.form-buttons').hide();
			$('.form-buttons').prop('disabled', true);
			$('.form-buttons :input').prop('disabled', true);
			$('#mediacollection-metadata-form-submit').show();
      $('#mediacollection-metadata-form-dismiss').show();
			$('#mediacollection-metadata-form :input').prop('disabled', false);
			$('#timaat-mediacollectiondatasets-metadata-title').focus();
		},

		selectLastListSelection: function(id) {
      if (this.selectedMediumCollectionId && this.selectedMediumCollectionId != id) {
        $(this.dataTableMediaCollectionList.row('#'+this.selectedMediumCollectionId).node()).removeClass('selected');
      }
			// remove selection from old rows 
			if (this.selectedMediumCollectionId && this.selectedMediumCollectionId != id) {
				$(this.dataTableMediaCollectionList.row('#'+this.selectedMediumCollectionId).node()).removeClass('selected');
			}
			$(this.dataTableMediaCollectionList.row('#'+id).node()).addClass('selected');
			this.selectedMediumCollectionId = id;
		},

		selectLastItemSelection: function(id) {
      if (this.selectedMediumCollectionItemId && this.selectedMediumCollectionItemId != id) {
        $(this.dataTableMediaCollectionItemList.row('#'+this.selectedMediumCollectionItemId).node()).removeClass('selected');
      }
			$(this.dataTableMediaCollectionItemList.row('#'+id).node()).addClass('selected');
			this.selectedMediumCollectionItemId = id;
		},

		clearLastSelection: function () {
			// $(this.dataTableMediaCollectionList.row('#'+this.selectedMediumCollectionId).node()).removeClass('selected');
			let i = 0;
			for (; i < this.mediaCollectionList.length; i++) {
				$(this.dataTableMediaCollectionList.row('#'+this.mediaCollectionList[i].model.id).node()).removeClass('selected');
			}
			this.selectedMediumCollectionId = null;
		},

		clearLastItemSelection: function () {
			let i = 0;
			for (; i < this.mediaCollectionItemList.length; i++) {
        $(this.dataTableMediaCollectionItemList.row('#'+this.mediaCollectionItemList[i].id.mediumId).node()).removeClass('selected');
			}
			this.selectedMediumCollectionItemId = null;
		},

		showLastForm: function() {
			// console.log("TCL: showLastForm");
			// console.log("TCL: TIMAAT.MediaCollectionDatasets.lastForm", TIMAAT.MediaCollectionDatasets.lastForm);
			let mediumCollection = $('#mediacollection-metadata-form').data('mediumCollection');
			let type = $('#mediacollection-metadata-form').data('data-type');
      console.log("TCL ~ type", type);
			switch (this.lastForm) {
				case 'dataSheet':
					this.displayDataSetContent('dataSheet', mediumCollection, 'show', type);
				break;
				case 'items':
					this.displayDataSetContent('items', mediumCollection);
				break;
				case 'publication':
					this.displayDataSetContent('publication', mediumCollection);
				break;
			}
		},

		refreshDataTable: async function() {
			// console.log("TCL: refreshDataTable");
			// set ajax data source
      if (this.dataTableMediaCollectionList) {
        // TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
        this.dataTableMediaCollectionList.ajax.reload(null, false);
			}
			if (this.dataTableMediaCollectionItemList) {
        // TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
        this.dataTableMediaCollectionItemList.ajax.reload(null, false);
      }
		},

	}
	
}, window));
