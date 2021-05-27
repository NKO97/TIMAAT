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

	TIMAAT.MediumCollectionDatasets = {
    mediaCollectionList: null,
		mediaCollectionItemList: null,
		mediaCollectionPublication: null,
		selectedMediumCollectionItemId: null,

		init: function() {
			this.initMediaCollections();
			this.initMediaCollectionItems();
			// this.initMediaCollectionPublication();
		},

		initMediaCollections: function() {
			// nav-bar functionality
			$('#mediumcollection-tab').on('click', function(event) {
				TIMAAT.MediumCollectionDatasets.loadMediaCollections();
				TIMAAT.UI.subNavTab = 'dataSheet';
				TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable');
				TIMAAT.URLHistory.setURL(null, 'Medium Collection Datasets', '#mediumCollection/list');
			});

			$('#mediumcollection-tab-metadata').on('click', function(event) {
				let mediumCollection = $('#mediumcollection-metadata-form').data('mediumCollection');
				let type = $('#mediumcollection-metadata-form').data('type');
				let title = mediumCollection.model.title;
				let id = mediumCollection.model.id;
				TIMAAT.UI.displayDataSetContentArea('mediumcollection-metadata-form');
				TIMAAT.UI.displayDataSetContent('dataSheet', mediumCollection, 'mediumCollection');
				TIMAAT.URLHistory.setURL(null, title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + id);
			});

			// delete medium collection button (in form) handler
			$('#mediumcollection-form-delete-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediumcollectiondatasets-mediumcollection-delete').data('mediumCollection', $('#mediumcollection-metadata-form').data('mediumCollection'));
				$('#timaat-mediumcollectiondatasets-mediumcollection-delete').modal('show');
			});

			// confirm delete medium collection modal functionality
			$('#timaat-mediumcollectiondatasets-modal-delete-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-mediumcollectiondatasets-mediumcollection-delete');
				var mediumCollection = modal.data('mediumCollection');
				if (mediumCollection) {
					try {	
						await TIMAAT.MediumCollectionDatasets._mediumCollectionRemoved(mediumCollection);
					} catch(error) {
						console.log("error: ", error);
					}
					try {
						await TIMAAT.UI.refreshDataTable('mediumCollection');
					} catch(error) {
						console.log("error: ", error);
					}
				}
				modal.modal('hide');
				TIMAAT.UI.hideDataSetContentContainer();
				// TIMAAT.MediumCollectionDatasets.loadMediaCollections();
				$('#mediumcollection-tab').trigger('click');
			});

			// edit content form button handler
			$('#mediumcollection-form-edit-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				let mediumCollection = $('#mediumcollection-metadata-form').data('mediumCollection');
				switch(TIMAAT.UI.subNavTab) {
					case 'items':
						TIMAAT.UI.displayDataSetContent('items', mediumCollection, 'mediumCollection', 'edit');
					break;
					case 'publication':
						TIMAAT.UI.displayDataSetContent('publication', mediumCollection, 'mediumCollection');
					break;
					default:
						TIMAAT.UI.displayDataSetContent('dataSheet', mediumCollection, 'mediumCollection', 'edit');
					break;
				}
				// medium.listView.find('.timaat-mediumcollectiondatasets-medium-list-tags').popover('show');
			});

			// medium collection form handlers
			// submit medium collection metadata button functionality
			$('#mediumcollection-metadata-form-submit-button').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#mediumcollection-metadata-form').valid()) return false;

				var type = $('#mediumcollection-metadata-form').data('type');
				var mediumCollection = $('#mediumcollection-metadata-form').data('mediumCollection');				

				// create/edit medium collection window submitted data
				$('#mediumcollection-type-select-dropdown').prop('disabled', false);
				var formData = $('#mediumcollection-metadata-form').serializeArray();
				$('#mediumcollection-type-select-dropdown').prop('disabled', true);
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
					mediumCollection.model.mediaCollectionType.id = formDataSanitized.typeId;
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
					await TIMAAT.MediumCollectionDatasets.updateMediumCollection(type, mediumCollection);
					// medium.updateUI();
				} else { // create new medium collection
					type = $('#mediumcollection-type-select-dropdown').find('option:selected').html();
					var mediumCollectionModel = await TIMAAT.MediumCollectionDatasets.createMediumCollectionModel(formDataSanitized);
					var mediumCollectionSubtypeModel = await TIMAAT.MediumCollectionDatasets.createMediumCollectionSubtypeModel(formDataSanitized, type);

					var newMediumCollection = await TIMAAT.MediumCollectionDatasets.createMediumCollection(type, mediumCollectionModel, mediumCollectionSubtypeModel);
					mediumCollection = new TIMAAT.MediumCollection(newMediumCollection);
					$('#mediumcollection-metadata-form').data('mediumCollection', mediumCollection);
					$('#medium-tab-mediumcollection-metadata-form').trigger('click');
					TIMAAT.URLHistory.setURL(null, mediumCollection.model.title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + mediumCollection.model.id);
				}
				$('.add-mediumcollection-button').prop('disabled', false);
				$('.add-mediumcollection-button :input').prop('disabled', false);
				$('.add-mediumcollection-button').show();
				await TIMAAT.UI.refreshDataTable('mediumCollection');
				TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', mediumCollection.model.id);
				TIMAAT.UI.displayDataSetContent('dataSheet', mediumCollection, 'mediumCollection');
			});

			// cancel add/edit button in content form functionality
			$('#mediumcollection-metadata-form-dismiss-button').on('click', async function(event) {
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
				var modal = $('#timaat-mediumcollectiondatasets-mediumcollection-tags');
				modal.data('mediumCollection', $('#mediumcollection-metadata-form').data('mediumCollection'));
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
				await TIMAAT.MediumCollectionService.getTagList(mediumCollection.model.id).then(function(data) {
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
				$('#timaat-mediumcollectiondatasets-mediumcollection-tags').modal('show');
			});

			// submit tag modal button functionality
			$('#timaat-mediumcollectiondatasets-modal-tag-submit-button').on('click', async function(event) {
				event.preventDefault();
				var modal = $('#timaat-mediumcollectiondatasets-mediumcollection-tags');
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
				mediumCollection.model = await TIMAAT.MediumCollectionDatasets.updateMediumCollectionHasTagsList(mediumCollection.model, tagIdList);
				if (newTagList.length > 0) {
					var updatedMediumCollectionModel = await TIMAAT.MediumCollectionDatasets.createNewTagsAndAddToMediumCollection(mediumCollection.model, newTagList);
					console.log("TCL: updatedMediumCollectionModel", updatedMediumCollectionModel);
					mediumCollection.model.tags = updatedMediumCollectionModel.tags;
				}
				$('#medium-metadata-form').data('mediumCollection', mediumCollection);
				modal.modal('hide');
			});

			$('#mediumcollection-type-select-dropdown').on('change', function(event) {
				event.stopPropagation();
				let type = $('#mediumcollection-type-select-dropdown').find('option:selected').html();
				TIMAAT.MediumCollectionDatasets.initFormDataSheetData(type);
			});

			// data table events
			$('#timaat-mediumcollectiondatasets-mediumcollection-list-table').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			$('#timaat-mediumcollectiondatasets-mediumcollection-items-table').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

		},

		initMediaCollectionItems: function() {
			// nav-bar functionality
			$('#mediumcollection-tab-items').on('click', async function(event) {
				let mediumCollection = $('#mediumcollection-metadata-form').data('mediumCollection');
				let type = $('#mediumcollection-metadata-form').data('type');
				let title = mediumCollection.model.title;
				let id = mediumCollection.model.id;
				TIMAAT.UI.displayDataSetContentArea('mediumcollection-mediaItems');
				TIMAAT.UI.subNavTab = 'items';
				TIMAAT.MediumCollectionDatasets.setMediumCollectionItemList();

				if (TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList) {
					TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediumCollection/' + id + '/hasMediaList')
					TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload();
				} else {
					await TIMAAT.MediumCollectionDatasets.setupMediumCollectionItemListDataTable(id);
					TIMAAT.MediumCollectionDatasets.setMediumCollectionItemList();
				}
				TIMAAT.UI.displayDataSetContent('items', mediumCollection, 'mediumCollection');
				$('#mediumcollection-items-add-button').prop('disabled', false);
				$('#mediumcollection-items-add-button :input').prop('disabled', false);
				$('#mediumcollection-items-add-button').show();
				TIMAAT.URLHistory.setURL(null, title + ' · Collection Items · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + id + '/items');
			});

			// add medium collection button functionality (in medium collection list - opens datasheet form)
			$('#mediumcollection-items-add-button').on('click', function(event) {
				let collection = $('#mediumcollection-metadata-form').data('mediumCollection');
        console.log("TCL ~ $ ~ collection", collection);
				TIMAAT.MediumCollectionDatasets.addMediumCollectionItem(collection.model.id);
			});

			$('#timaat-mediumcollectiondatasets-item-add').on('hide.bs.modal', function(event) {
				TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
			})

		},
		
		_setupPublicationSheet: function(enabled, restricted) {
			$('#timaat-publish-mediacollection-switch').prop('checked', enabled);
			$('#timaat-publication-mediacollection-protected-switch').prop('checked', restricted);
			let credentials = {};
			try {
				credentials = JSON.parse(this.publication.credentials);
			} catch (e) { credentials = {}; }
			let sheet = $('.mediumcollection-publication-wrapper');
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
			$('#timaat-mediumcollection-publication-settings-submit').prop('disabled', enabled && restricted && username == '' && password == '');

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
			let sheet = $('.mediumcollection-publication-wrapper');
			let enabled = $('#timaat-publish-mediacollection-switch').prop('checked');
			let restricted = $('#timaat-publication-mediacollection-protected-switch').prop('checked');
			let username = ( sheet.find('.username').val() && restricted ) ? sheet.find('.username').val() : '';
			let password = ( sheet.find('.password').val() && restricted ) ? sheet.find('.password').val() : '';
			$('#timaat-mediumcollection-publication-settings-submit').prop('disabled', true);
			$('#timaat-mediumcollection-publication-settings-submit i.login-spinner').removeClass('d-none');
			let dataset = this;
			let collection = $('#mediumcollection-metadata-form').data('mediumCollection');
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
					$('#timaat-mediumcollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediumcollection-publication-settings-submit i.login-spinner').addClass('d-none');
					sheet.find('.saveinfo').show().delay(1000).fadeOut();
				}).catch( e => {
					$('#timaat-mediumcollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediumcollection-publication-settings-submit i.login-spinner').addClass('d-none');
				})
			} else {
				TIMAAT.Service.deleteCollectionPublication(collection.model.id).then(status => {
					dataset.publication = null;
					dataset._setupPublicationSheet(false, false);
					$('#timaat-mediumcollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediumcollection-publication-settings-submit i.login-spinner').addClass('d-none');
					sheet.find('.saveinfo').show().delay(1000).fadeOut();
				}).catch( e => {
					$('#timaat-mediumcollection-publication-settings-submit').prop('disabled', false);
					$('#timaat-mediumcollection-publication-settings-submit i.login-spinner').addClass('d-none');
				})
			}
		},

		initMediaCollectionPublication: function() {
			let dataset = this;
			// events
			$('#timaat-publish-mediacollection-switch, #timaat-publication-mediacollection-protected-switch').on('change', ev => {
				dataset._setupPublicationSheet($('#timaat-publish-mediacollection-switch').prop('checked'), $('#timaat-publication-mediacollection-protected-switch').prop('checked'));
			});

			let sheet = $('.mediumcollection-publication-wrapper');
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
				$('#timaat-mediumcollection-publication-settings-submit').prop('disabled', enabled && restricted && username == '' && password == '');
			});

			$('#timaat-mediumcollection-publication-settings-submit').on('click', ev => {
				dataset._updatePublicationSettings();
			})

			// nav-bar functionality
			$('#mediumcollection-tab-publication').on('click', async function(event) {
				// console.log("TCL: Media Collection Publication Tab clicked");
				let mediumCollection = $('#mediumcollection-metadata-form').data('mediumCollection');
				let type = mediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
				TIMAAT.UI.displayDataSetContentArea('mediumcollection-publication');
				TIMAAT.UI.subNavTab = 'publication';
				TIMAAT.UI.displayDataSetContent('publication', mediumCollection, 'mediumCollection');
				TIMAAT.URLHistory.setURL(null, mediumCollection.model.title + ' · Collection Publication · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + mediumCollection.model.id + '/publication');
			});
		},

		load: function() {
			this.loadMediaCollections();
		},

		loadMediaCollections: function() {
			$('#mediumcollection-metadata-form').data('type', 'mediumCollection');
			$('#videoPreview').get(0).pause();
			this.setMediumCollectionList();
			TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', null);
			// TIMAAT.UI.subNavTab = 'dataSheet';
		},
		
		// loadMediaCollectionItems: function() {
		// 	this.setMediumCollectionItemList();
    // },
    
    loadMediaCollectionDataTables: async function() {
			await this.setupMediumCollectionListDataTable();
			await this.setupMediumCollectionItemListDataTable();
			await this.setupMediumCollectionAddMediaDataTable();
			await this.setupMediumCollectionAddedMediaDataTable();
		},

		setMediumCollectionList: function() {
    	// console.log("TCL: setMediumCollectionList");
			if ( this.mediaCollectionList == null ) return;

			if ( this.dataTableMediaCollectionList ) {
				this.dataTableMediaCollectionList.ajax.reload(null, false);
			}
			TIMAAT.UI.clearLastSelection('mediumCollection');
		},

		setMediumCollectionItemList: function() {
    	// console.log("TCL: setMediumCollectionItemList");
			if ( this.mediaCollectionItemList == null ) return;

			if ( this.dataTableMediaCollectionItemList ) {
				this.dataTableMediaCollectionItemList.ajax.reload(null, false);
				// this.clearLastItemSelection();
			}
		},

		addMediumCollection: function() {	
			// console.log("TCL: addMediumCollection: type", type);
			TIMAAT.UI.displayDataSetContentContainer('mediumcollection-tab-metadata', 'mediumcollection-metadata-form')
			$('.add-mediumcollection-button').hide();
			$('.add-mediumcollection-button').prop('disabled', true);
			$('.add-mediumcollection-button :input').prop('disabled', true);
			$('#mediumcollection-metadata-form').data('mediumCollection', null);
			mediumFormMetadataValidator.resetForm();

			TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
			$('#mediumcollection-metadata-form').trigger('reset');

			this.getMediumCollectionTypeDropDownData();
			let type = $('#mediumcollection-type-select-dropdown').find('option:selected').html();
			$('#mediumcollection-metadata-form').data('type', type);
			this.initFormDataSheetData(type);
			this.initFormDataSheetForEdit();
			$('#mediumcollection-metadata-form-submit-button').html('Add');
			$('#mediumCollectionFormHeader').html('Add media collection');
			$('#mediumcollection-type-select-dropdown').prop('disabled', false);
			$('#mediumcollection-type-select-dropdown :input').prop('disabled', false);
		},

		addMediumCollectionItem: async function(collectionId) {	
    	console.log("TCL: addMediumCollectionItem - collectionId: ", collectionId);
			if ( this.dataTableMedia ) {
				this.dataTableMedia.ajax.url('api/mediumCollection/'+collectionId+'/notInMediaList');
				this.dataTableMedia.ajax.reload(null, false);
			}
			if ( this.dataTableCollectionItems ) {
				this.dataTableCollectionItems.ajax.url('api/mediumCollection/'+collectionId+'/mediaList');
				this.dataTableCollectionItems.ajax.reload(null, false);
			}
			$('#timaat-mediumcollectiondatasets-item-add').modal('show');
		},

		mediumCollectionFormDataSheet: async function(action, type, data) {
			// console.log("TCL: action, type, data", action, type, data);
			TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', data.model.id);
			$('#mediumcollection-metadata-form').trigger('reset');
			$('#mediumcollection-metadata-form').data('type', type);
			this.initFormDataSheetData(type);
			mediumFormMetadataValidator.resetForm();

			this.getMediumCollectionTypeDropDownData();
			let typeSelect = $('#mediumcollection-type-select-dropdown');
			let option = new Option(data.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type, data.model.mediaCollectionType.id, true, true);
			typeSelect.append(option).trigger('change');
			$('#mediumcollection-type-select-dropdown').select2('destroy').attr('readonly', true);

			if ( action == 'show') {
				$('#mediumcollection-metadata-form :input').prop('disabled', true);
				$('.form-buttons').show();
				$('.form-buttons').prop('disabled', false);
				$('.form-buttons :input').prop('disabled', false);
				$('#mediumcollection-metadata-form-submit-button').hide();
				$('#mediumcollection-metadata-form-dismiss-button').hide();
				$('#mediumCollectionFormHeader').html(type+" Datasheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				$('#mediumcollection-metadata-form-submit-button').html('Save');
				$('#mediumCollectionFormHeader').html('Edit '+type);
				this.initFormDataSheetForEdit();
				$('#mediumcollection-type-select-dropdown').prop('disabled', true);
				$('#mediumcollection-type-select-dropdown :input').prop('disabled', true);
			}

			// console.log("TCL: modelData", modelData);
			// setup UI

			// medium collection data
			$('#timaat-mediumcollectiondatasets-metadata-title').val(data.model.title);
			$('#mediumcollection-type-select-dropdown').val(data.model.mediaCollectionType.id);
			if (data.model.isSystemic)
				$('#timaat-mediumcollectiondatasets-metadata-issystemic').prop('checked', true);
				else $('#timaat-mediumcollectiondatasets-metadata-issystemic').prop('checked', false);
			$('#timaat-mediumcollectiondatasets-metadata-remark').val(data.model.remark);

			// medium collection subtype specific data
			switch (type) {
				case 'Album':
					$('#timaat-mediumcollectiondatasets-metadata-album-tracks').val(data.model.mediaCollectionAlbum.tracks);
				break;
				case 'Series':
					$('#timaat-mediumcollectiondatasets-metadata-series-seasons').val(data.model.mediaCollectionSeries.seasons);
					if (data.model.mediaCollectionSeries.started != null && !(isNaN(data.model.mediaCollectionSeries.started)))
						$('#timaat-mediumcollectiondatasets-metadata-series-started').val(moment.utc(data.model.mediaCollectionSeries.started).format('YYYY-MM-DD'));
						else $('#timaat-mediumcollectiondatasets-metadata-series-started').val('');
					if (data.model.mediaCollectionSeries.ended != null && !(isNaN(data.model.mediaCollectionSeries.ended)))
						$('#timaat-mediumcollectiondatasets-metadata-series-ended').val(moment.utc(data.model.mediaCollectionSeries.ended).format('YYYY-MM-DD'));
						else $('#timaat-mediumcollectiondatasets-metadata-series-ended').val('');
				break;
			}
			$('#mediumcollection-metadata-form').data('mediumCollection', data);
		},

		mediumCollectionFormItems: async function(action, data) {
			// console.log("TCL: action, data", action, data);
			// TIMAAT.MediumCollectionDatasets.selectLastItemSelection(data.model.id); // TODO get medium Id of item
			TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', data.model.id);
			$('#mediumCollection-mediaItems').trigger('reset');
			var type = $('#mediumcollection-metadata-form').data('type');

			mediumFormMetadataValidator.resetForm();

			if ( action == 'show') {
				$('#mediumCollection-mediaItems :input').prop('disabled', true);
				$('.form-buttons').show();
				$('.form-buttons').prop('disabled', false);
				$('.form-buttons :input').prop('disabled', false);
				$('#mediumCollection-mediaItems-submit').hide();
				$('#mediumCollection-mediaItems-dismiss').hide();
				$('#mediumcollection-items-add-button').prop('disabled', false);
				$('#mediumcollection-items-add-button :input').prop('disabled', false);
				$('#mediumcollection-items-add-button').show();
				$('#mediumCollectionFormHeader').html(type+" Datasheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				$('#mediumCollection-mediaItems-submit').html('Save');
				$('#mediumCollectionFormHeader').html("Edit "+type);
				this.initFormDataSheetForEdit();
			}
			// medium collection item data
			// $('#mediumCollection-mediaItems').data(type, data);
		},

		mediumCollectionFormPublication: async function(collection) {
      console.log("TCL ~ mediumCollectionFormPublication:function ~ collection", collection);
			$('#mediumCollection-publication').trigger('reset');
			TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', collection.model.id);
			mediumFormMetadataValidator.resetForm();
			let publication = await TIMAAT.Service.getCollectionPublication(collection.model.id);
			this.mediaCollectionPublication = publication;
			this._setupPublicationSheet(publication !=null, publication !=null && publication.access == 'protected');
		},

		setupMediumCollectionItemListDataTable: async function() {
			// console.log("TCL: setupMediumCollectionItemListDataTable");
      this.dataTableMediaCollectionItemList = $('#timaat-mediumcollectiondatasets-mediumcollection-items-table').DataTable({
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
					"url"        : "api/mediumCollection/0/hasMediaList",
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
						TIMAAT.MediumCollectionDatasets.mediaCollectionItemList = data.data;
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> TIMAAT.MediumCollectionDatasets.mediaCollectionItemList", TIMAAT.MediumCollectionDatasets.mediaCollectionItemList);
						return data.data;       
					}
				},
				// "rowCallback": function( row, data ) {
					// console.log("TCL: rowCallback: row, data", row, data);
				// 	if (data.id == TIMAAT.MediumCollectionDatasets.selectedMediumCollectionItemId) {
				// 		TIMAAT.MediumCollectionDatasets.clearLastItemSelection();
				// 		$(row).addClass('selected');
				// 	}
				// },
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumCollectionElement = $(row);
					let mediumCollectionHasMedium = data;
					let medium = mediumCollectionHasMedium.medium;
					let type = medium.mediaType.mediaTypeTranslations[0].type;
					medium.ui = mediumCollectionElement;
					mediumCollectionElement.data('medium', medium);
					// mediumCollectionElement.find('input:checkbox').prop('checked', false);
					// mediumCollectionElement.find('input:checkbox').change(function() {
					// 	$('#timaat-videochooser-list-action-submit-button').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);				

					if ( medium.fileStatus != "noFile" ) TIMAAT.VideoChooser.loadThumbnail(medium);
					// TIMAAT.VideoChooser.setVideoStatus(medium);
					TIMAAT.MediumDatasets.setMediumStatus(medium);
					
					// set up events
					mediumCollectionElement.on('click', function(event) {
						TIMAAT.MediumCollectionDatasets.selectedMediumCollectionItemId = medium.id;
					});

					mediumCollectionElement.on('click', '.collectionItem-upload-button', async function(event) {
						event.stopPropagation();
						TIMAAT.UI.hidePopups();
						let item = new TIMAAT.Medium(medium, type);
						item.listView.find('.timaat-medium-upload-file').click();
					});

					mediumCollectionElement.on('click', '.collectionItem-annotate-button', async function(event) {
						event.stopPropagation();
						TIMAAT.UI.hidePopups();
						if ( !medium.mediumVideo && !medium.mediumImage ) return; //* allow annotating only for videos and images
						if ( medium.fileStatus && medium.fileStatus != 'ready' && medium.fileStatus != 'transcoding' && medium.fileStatus != 'waiting' ) return;
						await TIMAAT.VideoPlayer.initializeAnnotationMode(medium);
					});

					mediumCollectionElement.on('click', '.timaat-mediadatasets-media-metadata', async function(event) {
						event.stopPropagation();
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-metadata', 'medium-metadata-form');
            TIMAAT.UI.displayDataSetContent('dataSheet', mediumModel, 'medium');
						TIMAAT.MediumDatasets.setDataTableOnItemSelect(type, mediumModel);
					});

					mediumCollectionElement.on('click', '.timaat-mediumcollectiondatasets-collectionitem-remove', async function(ev) {
						var row = $(this).parents('tr');
						let collection = $('#mediumcollection-metadata-form').data('mediumCollection');
						let mediumToRemove = $(row).data('medium');
						await TIMAAT.MediumCollectionService.removeCollectionItem(collection.model.id, mediumToRemove.id);
						await TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
					});

					mediumCollectionElement.on('click', '.timaat-mediumcollectiondatasets-collectionitem-moveup', async function(event) {
						let row = $(this).parents('tr');
						let collection = $('#mediumcollection-metadata-form').data('mediumCollection');
						let mediumToMoveUp = $(row).data('medium');
						let collectionId = collection.model.id;
						let mediumId = mediumToMoveUp.id;
						let index = -1;
						//! This does only work if item list is sorted by sort order. TODO refactor if sorting by title is possible, too
						index = TIMAAT.MediumCollectionDatasets.mediaCollectionItemList.findIndex(({id}) => id.mediumId === mediumId);
						if (index > 0) {
							let sortOrder = TIMAAT.MediumCollectionDatasets.mediaCollectionItemList[index].sortOrder;
							await TIMAAT.MediumCollectionService.updateCollectionItem(collectionId,
																																			 mediumId,
																																			 TIMAAT.MediumCollectionDatasets.mediaCollectionItemList[index-1].sortOrder);
							await TIMAAT.MediumCollectionService.updateCollectionItem(collectionId, 
																																			 TIMAAT.MediumCollectionDatasets.mediaCollectionItemList[index-1].id.mediumId,
																																			 sortOrder);
						}
						await TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
					});

					mediumCollectionElement.on('click', '.timaat-mediumcollectiondatasets-collectionitem-movedown', async function(event) {
						let row = $(this).parents('tr');
						let collection = $('#mediumcollection-metadata-form').data('mediumCollection');
						let mediumToMoveDown = $(row).data('medium');
						let collectionId = collection.model.id;
						let mediumId = mediumToMoveDown.id;
						let index = -1;
						//! This does only work if item list is sorted by sort order. TODO refactor if sorting by title is possible, too
						index = TIMAAT.MediumCollectionDatasets.mediaCollectionItemList.findIndex(({id}) => id.mediumId === mediumId);
						if (index < TIMAAT.MediumCollectionDatasets.mediaCollectionItemList.length) {
							let sortOrder = TIMAAT.MediumCollectionDatasets.mediaCollectionItemList[index].sortOrder;
							await TIMAAT.MediumCollectionService.updateCollectionItem(collectionId,
																																			  mediumId,
																																			  TIMAAT.MediumCollectionDatasets.mediaCollectionItemList[index+1].sortOrder);
							await TIMAAT.MediumCollectionService.updateCollectionItem(collectionId, 
																																			  TIMAAT.MediumCollectionDatasets.mediaCollectionItemList[index+1].id.mediumId,
																																			  sortOrder);
						}
						await TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
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
								
					if ( type == 'video' && medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
						TIMAAT.VideoChooser.updateVideoStatus(medium);

				},
				"columns": [
					{ data: 'sortOrder', className: 'sortOrder', width: '5%', render: function(data, type, collectionItem, meta) {
						// console.log(`TCL: sortOrder:function -> data, type, collectionItem, meta`, data, type, collectionItem, meta);
						let order = 
							`<div class="row">
								<div class="col-md-6" style="text-align: right; padding-right: 1px; padding-left: 0px;">`+(collectionItem.sortOrder+1)+`</div>
								<div class="col-md-6">`;
						if (meta.row > 0) {
							order += `<button type="button" title="Sort up" class="btn btn-outline-secondary btn-sm timaat-mediumcollectiondatasets-collectionitem-moveup"><i class="fas fa-sort-up"></i></button>`;
						}
						if (meta.row < TIMAAT.MediumCollectionDatasets.mediaCollectionItemList.length-1) {
							order += `<button type="button" title="Sort down" class="btn btn-outline-secondary btn-sm timaat-mediumcollectiondatasets-collectionitem-movedown"><i class="fas fa-sort-down"></i></button>`;
						}
						order += `</div>
							</div>`;
						return order;
						}
					},
					{ data: null, className: 'videochooser-item-preview', orderable: false, width: '150px', render: function(data, type, collectionItem, meta) {
            // console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						let ui;
						if (collectionItem.medium.mediumVideo) {
							ui = `<div class="timaat-medium-status">
											<i class="fas fa-cog fa-spin"></i>
											</div>
										<img class="card-img-top center timaat-medium-thumbnail" src="img/video-placeholder.png" width="150" height="85" alt="Video preview"/>`;
						}
						else if (collectionItem.medium.mediumImage) {
							ui = `<div style="display:flex">
											<img class="card-img-top center timaat-medium-thumbnail" src="img/image-placeholder.png" width="150" height="85" alt="Image preview"/>
										</div>`;
						} else {
							ui = `<div style="display:flex">
											<img class="card-img-top center timaat-medium-thumbnail" src="img/preview-placeholder.png" width="150" height="85" alt="No preview available"/>
										</div>`;
						}
						return ui;
						}
					},
					{ data: 'id', name: 'title', className: 'title', orderable: false, render: function(data, type, collectionItem, meta) {
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						let displayMediumTypeIcon = '';
						switch (collectionItem.medium.mediaType.mediaTypeTranslations[0].type) {
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
							if ( collectionItem.medium.mediumAnalysisLists.length > 0) {
								analysisListIcon = '<i class="far fa-eye" title="Analysis available"></i> ';
							}

						let titleDisplay = `<p>` + displayMediumTypeIcon + analysisListIcon + collectionItem.medium.displayTitle.name + `</p>`;
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
					{ data: 'medium.mediumVideo.length', name: 'duration', className: 'duration', orderable: false, width: '10%', render: function(data, type, collectionItem, meta) {
							// console.log("TCL: data, type, collectionItem, meta - ", data, type, collectionItem, meta);
							if (collectionItem.medium.mediumVideo) {
								return TIMAAT.Util.formatTime(data);
							} else {
								return "-";
							}
						}
					},
					{ data: 'medium.mediumHasActorWithRoles', name: 'producer', className: 'producer', orderable: false, width: '10%', render: function(data, type, collectionItem, meta) {
							return TIMAAT.VideoChooser._getProducer(collectionItem.medium);
						}
					},
					{ data: 'medium.releaseDate', name: 'releaseDate', className: 'date', orderable: false, width: '10%', render: function(data, type, collectionItem, meta) {
							// console.log("TCL: data, type, collectionItem, meta", data, type, collectionItem, meta);
							if (data == null) { 
								return "no data available";
							} else {
								return moment.utc(data).format('YYYY-MM-DD');
							}
						}
					},
					{ data: 'medium.mediumHasLanguages', name: 'releaseDate', className: 'date', orderable: false, width: '10%', render: function(data, type, collectionItem, meta) {
						// console.log("TCL: data, type, collectionItem, meta", data, type, collectionItem, meta);
						if (data == null) { 
							return "no data available";
						} else {
							let i = 0;
							let languageDisplay = '';
							for (; i < data.length; i++) {
								if (data[i].mediumLanguageType.id == 1) {
									languageDisplay += `<p>` + data[i].language.name + ` (AT)</p>`;
								} else if (data[i].mediumLanguageType.id == 2) {
									languageDisplay += `<p>` + data[i].language.name + ` (STT)</p>`;
								}
							}
							return languageDisplay;
						}
					}
				},
					{ data: null, className: 'actions', orderable: false, width: '5%', render: function(data, type, collectionItem, meta) {
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						let ui = `<div>`;
						if ( collectionItem.medium.mediumVideo ){
							if ( !collectionItem.medium.fileStatus || collectionItem.medium.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload video" class="btn btn-outline-secondary btn-sm btn-block collectionItem-upload-button"><i class="fas fa-file-upload"></i></button>`;
								// ui += `<form action="/TIMAAT/api/medium/video/`+collectionItem.medium.id+`/upload" method="post" enctype="multipart/form-data">
								// 				<input name="file" accept=".mp4" class="timaat-medium-upload-file d-none" type="file" />
								// 				<button type="submit" title="Upload video" class="btn btn-outline-primary btn-sm btn-block timaat-medium-upload"><i class="fas fa-upload"></i></button>
								// 			 </form>`;
							} else {
								ui +=	`<button type="button" title="Annotate video" class="btn btn-outline-secondary btn-sm btn-block collectionItem-annotate-button"><i class="fas fa-draw-polygon"></i></button>`;
							}
						} else if (collectionItem.medium.mediumImage) {
							if ( !collectionItem.medium.fileStatus || collectionItem.medium.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload image" class="btn btn-outline-secondary btn-sm btn-block collectionItem-upload-button"><i class="fas fa-file-upload"></i></button>`;
								// ui += `<form action="/TIMAAT/api/medium/image/`+collectionItem.medium.id+`/upload" method="post" enctype="multipart/form-data">
								// 				<input name="file" accept=".png" class="timaat-medium-upload-file d-none" type="file" />
								// 				<button type="submit" title="Upload image" class="btn btn-outline-primary btn-sm btn-block timaat-medium-upload"><i class="fas fa-upload"></i></button>
								// 			</form>`;
								// }
							} else {
								ui +=	`<button type="button" title="Annotate image" class="btn btn-outline-secondary btn-sm btn-block collectionItem-annotate-button"><i class="fas fa-draw-polygon"></i></button>`;
							}
						}
						ui += `<button type="button" title="Edit data sheet" class="btn btn-outline-secondary btn-sm btn-block timaat-mediadatasets-media-metadata"><i class="fas fa-file-alt"></i></button>
									 <button type="button" title="Remove from collection"class="btn btn-outline-secondary btn-sm btn-block timaat-mediumcollectiondatasets-collectionitem-remove"><i class="fas fa-folder-minus"></i></button>
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
			this.dataTableMediaCollectionList = $('#timaat-mediumcollectiondatasets-mediumcollection-list-table').DataTable({
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
					"url"        : "api/mediumCollection/list",
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
						TIMAAT.MediumCollectionDatasets.mediaCollectionList = mediaCollections;
						TIMAAT.MediumCollectionDatasets.mediaCollectionList.model = data.data;
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: rowCallback: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumCollectionId) {
						TIMAAT.UI.clearLastSelection('mediumCollection');
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
					// TIMAAT.MediumDatasets.setMediumStatus(medium);

					mediumCollectionElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						$('#timaat-mediadatasets-medium-tabs-container').append($('#timaat-mediadatasets-medium-tabs'));
						$('#timaat-medium-modals-container').append($('#timaat-medium-modals'));
						TIMAAT.MediumDatasets.container = 'media';
						$('#previewTab').removeClass('annotationView');
						switch (TIMAAT.UI.subNavTab) {
							case 'dataSheet':
								TIMAAT.UI.displayDataSetContentContainer('mediumcollection-data-tab', 'mediumcollection-metadata-form', 'mediumCollection');
							break;
							case 'items':
								TIMAAT.UI.displayDataSetContentContainer('mediumcollection-items-tab', 'mediumcollection-mediaItems', 'mediumCollection');
							break;
							case 'publication':
								TIMAAT.UI.displayDataSetContentContainer('mediumcollection-publication-tab', 'mediumcollection-publication', 'mediumCollection');
							break;
						}
						TIMAAT.UI.clearLastSelection('mediumCollection');
						let index = TIMAAT.MediumCollectionDatasets.mediaCollectionList.findIndex(({model}) => model.id == mediumCollection.id);
						let selectedMediumCollection = TIMAAT.MediumCollectionDatasets.mediaCollectionList[index];
						TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', mediumCollection.id);
						if (TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList) {
							TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediumCollection/'+mediumCollection.id+'/hasMediaList')
							TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload();
						// } else {
						// 	await TIMAAT.MediumCollectionDatasets.setupMediumCollectionItemListDataTable(id);
						// 	TIMAAT.MediumCollectionDatasets.setMediumCollectionItemList();
						}

						// console.log("TCL: selectedMediumCollection", selectedMediumCollection);
						$('#mediumcollection-metadata-form').data('mediumCollection', selectedMediumCollection);
						let type = selectedMediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
						$('#mediumcollection-metadata-form').data('type', type);
						// $('#mediumcollection-metadata-form').data('type', type);
						TIMAAT.UI.displayDataSetContent(TIMAAT.UI.subNavTab, selectedMediumCollection, 'mediumCollection');
						if (TIMAAT.UI.subNavTab == 'dataSheet') {
							TIMAAT.URLHistory.setURL(null, selectedMediumCollection.model.title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + selectedMediumCollection.model.id);
						} else {
							TIMAAT.URLHistory.setURL(null, selectedMediumCollection.model.title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + selectedMediumCollection.model.id + '/' + TIMAAT.UI.subNavTab);
						}
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
					"url"        : "api/mediumCollection/0/notInMediaList",
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
						let collection = $('#mediumcollection-metadata-form').data('mediumCollection');
            console.log("TCL: collection", collection);
						$(this).remove();
						TIMAAT.MediumCollectionService.addCollectionItem(collection.model.id, medium.id)
						.then((result) => {
							TIMAAT.MediumCollectionDatasets.dataTableMedia.ajax.reload();
							TIMAAT.MediumCollectionDatasets.dataTableCollectionItems.ajax.reload();
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
					"url"        : "api/mediumCollection/0/mediaList",
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
						let collection = $('#mediumcollection-metadata-form').data('mediumCollection');
            console.log("TCL: collection", collection);
						$(this).remove();
						TIMAAT.MediumCollectionService.removeCollectionItem(collection.model.id, medium.id)
						.then((result)=>{
							TIMAAT.MediumCollectionDatasets.dataTableMedia.ajax.reload();
							TIMAAT.MediumCollectionDatasets.dataTableCollectionItems.ajax.reload();
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
				var newModel = await TIMAAT.MediumCollectionService.createMediumCollection(model);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// create subtype with medium collection id
				subTypeModel.mediaCollectionId = newModel.id;
				if (type != 'Collection') { //* Collection has no extra data table
					await TIMAAT.MediumCollectionService.createMediumCollectionSubtype(type, newModel, subTypeModel);
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
							await TIMAAT.MediumCollectionService.updateMediumCollectionSubtype(subType, tempSubtypeModel);
						break;
						case 'Series':
							tempSubtypeModel = mediumCollection.model.mediaCollectionSeries;
							await TIMAAT.MediumCollectionService.updateMediumCollectionSubtype(subType, tempSubtypeModel);
							break;
					}
				} catch(error) {
					console.log( "error: ", error);
				};
				
				try { // update mediumCollection
					await TIMAAT.MediumCollectionService.updateMediaCollection(mediumCollection.model);
				} catch(error) {
					console.log( "error: ", error);
				};
		},

		updateMediumCollectionHasTagsList: async function(mediumCollectionModel, tagIdList) {
    	console.log("TCL: mediumCollectionModel, tagIdList", mediumCollectionModel, tagIdList);
			try {
				var existingMediumCollectionHasTagsEntries = await TIMAAT.MediumCollectionService.getTagList(mediumCollectionModel.id);
        console.log("TCL: existingMediumCollectionHasTagsEntries", existingMediumCollectionHasTagsEntries);
				if (tagIdList == null) { //* all entries will be deleted
					mediumCollectionModel.tags = [];
					await TIMAAT.MediumCollectionService.updateMediaCollection(mediumCollectionModel);
				} else if (existingMediumCollectionHasTagsEntries.length == 0) { //* all entries will be added
					mediumCollectionModel.tags = tagIdList;
					await TIMAAT.MediumCollectionService.updateMediaCollection(mediumCollectionModel);
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
							await TIMAAT.MediumCollectionService.removeTag(mediumCollectionModel.id, entriesToDelete[i].id);
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
							await TIMAAT.MediumCollectionService.addTag(mediumCollectionModel.id, idsToCreate[i].id);
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
				await TIMAAT.MediumCollectionService.addTag(mediumCollectionModel.id, newTagList[i].id);
				mediumCollectionModel.tags.push(newTagList[i]);
			}
			return mediumCollectionModel;
		},

		_mediumCollectionRemoved: async function(mediumCollection) {
    	// console.log("TCL: _mediumCollectionRemoved: ", mediumCollection);
			// sync to server
			try {
				await TIMAAT.MediumCollectionService.removeMediaCollection(mediumCollection.model);
			} catch(error) {
				console.log("error: ", error);
			}

			mediumCollection.remove();
		},

		getMediumCollectionTypeDropDownData: function() {
			$('#mediumcollection-type-select-dropdown').select2({
				closeOnSelect: true,
				scrollAfterSelect: true,
				allowClear: false,
				ajax: {
					url: 'api/mediumCollection/type/selectList/',
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
							// search: params.term,
							// page: params.page
						};          
					},
					processResults: function(data, params) {
						console.log("TCL: processResults: data", data);
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

		initFormDataSheetData: function(type) {
			$('.datasheet-data').hide();
			$('.mediumcollection-data').show();
			if (type == 'Album' || type == 'Series') {
				$('.mediumcollection-'+type+'-data').show();
			}
		},

		initFormDataSheetForEdit: function() {
			// setup form
			$('#timaat-mediumcollectiondatasets-metadata-series-started').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-mediumcollectiondatasets-metadata-series-ended').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('.form-buttons').hide();
			$('.form-buttons').prop('disabled', true);
			$('.form-buttons :input').prop('disabled', true);
			$('#mediumcollection-metadata-form-submit-button').show();
      $('#mediumcollection-metadata-form-dismiss-button').show();
			$('#mediumcollection-metadata-form :input').prop('disabled', false);
			$('#timaat-mediumcollectiondatasets-metadata-title').focus();
		},

	}
	
}, window));
