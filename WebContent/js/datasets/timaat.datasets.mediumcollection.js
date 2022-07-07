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
    currentPermissionLevel    : null,
    mediaCollectionItemList   : null,
    mediaCollectionList       : null,
    mediaCollectionPublication: null,
    mediaCollectionListLoaded : false,
    userPermissionList        : null,

		init: function() {
			this.initMediaCollections();
			this.initMediaCollectionItems();
			// this.initMediaCollectionPublication();
		},

		initMediaCollectionComponent: function() {
			// console.log("TCL: initMediaComponent");
			if (!this.mediaCollectionListLoaded) {
				this.setMediumCollectionList();
			}
			if (TIMAAT.UI.component != 'media') {
				TIMAAT.UI.showComponent('media');
				$('#mediumCollectionTab').trigger('click');
			}
		},

		initMediaCollections: function() {
			// nav-bar functionality
			$('#mediumCollectionTab').on('click', function(event) {
				TIMAAT.MediumCollectionDatasets.loadMediaCollections();
				// TIMAAT.UI.subNavTab = 'dataSheet';
				TIMAAT.UI.displayComponent('mediumCollection', 'mediumCollectionTab', 'mediumCollectionDataTable');
				TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionList.ajax.url('/TIMAAT/api/mediumCollection/list'+'?authToken='+TIMAAT.Service.session.token)
				TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionList.ajax.reload().draw();
				TIMAAT.UI.clearLastSelection('mediumCollection');
				$('#mediumCollectionFormMetadata').data('mediumCollection', null);
				TIMAAT.URLHistory.setURL(null, 'Medium Collection Datasets', '#mediumCollection/list');
			});

			$('#mediumCollectionMetadataTab').on('click', function(event) {
				let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
				let type = $('#mediumCollectionFormMetadata').data('type');
				let title = mediumCollection.model.title;
				let id = mediumCollection.model.id;
				TIMAAT.UI.displayDataSetContentArea('mediumCollectionFormMetadata');
				TIMAAT.UI.displayDataSetContent('dataSheet', mediumCollection, 'mediumCollection');
				TIMAAT.URLHistory.setURL(null, title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + id);
			});

			// delete medium collection button (in form) handler
			$('#mediumCollectionFormDeleteButton').on('click', function(event) {
				event.stopPropagation();
				if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 4) {
					$('#mediumCollectionInsufficientPermissionModal').modal('show');
					return;
				}
				TIMAAT.UI.hidePopups();
				$('#mediumCollectionDatasetsMediumCollectionDeleteModal').data('mediumCollection', $('#mediumCollectionFormMetadata').data('mediumCollection'));
				$('#mediumCollectionDatasetsMediumCollectionDeleteModal').modal('show');
			});

			// confirm delete medium collection modal functionality
			$('#mediumCollectionDatasetsModalDeleteSubmitButton').on('click', async function(ev) {
				var modal = $('#mediumCollectionDatasetsMediumCollectionDeleteModal');
				if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 4) {
					$('#mediumCollectionInsufficientPermissionModal').modal('show');
					return;
				}
				var mediumCollection = modal.data('mediumCollection');
				if (mediumCollection) {
					try {
						TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediumCollection/0/hasMediaList')
						TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload();
						await TIMAAT.MediumCollectionDatasets._mediumCollectionRemoved(mediumCollection);
					} catch(error) {
						console.error("ERROR: ", error);
					}
					try {
						await TIMAAT.UI.refreshDataTable('mediumCollection');
					} catch(error) {
						console.error("ERROR: ", error);
					}
				}
				modal.modal('hide');
				// TIMAAT.UI.hideDataSetContentContainer();
				// TIMAAT.MediumCollectionDatasets.loadMediaCollections();
				$('#mediumCollectionTab').trigger('click');
			});

			// edit content form button handler
			$('#mediumCollectionFormEditButton').on('click', function(event) {
				event.stopPropagation();
				if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
					$('#mediumCollectionInsufficientPermissionModal').modal('show');
					return;
				}
				TIMAAT.UI.hidePopups();
				let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
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
				// medium.listView.find('.mediumCollectionDatasetsMediumListTags').popover('show');
			});

			// medium collection form handlers
			// submit medium collection metadata button functionality
			$('#mediumCollectionFormMetadataSubmitButton').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#mediumCollectionFormMetadata').valid()) return false;

				var type = $('#mediumCollectionFormMetadata').data('type');
				var mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');

				// create/edit medium collection window submitted data
				$('#mediumCollectionTypeSelectDropdown').prop('disabled', false);
				var formData = $('#mediumCollectionFormMetadata').serializeArray();
				$('#mediumCollectionTypeSelectDropdown').prop('disabled', true);
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
					type = $('#mediumCollectionTypeSelectDropdown').find('option:selected').html();
					var mediumCollectionModel = await TIMAAT.MediumCollectionDatasets.createMediumCollectionModel(formDataSanitized);
					var mediumCollectionSubtypeModel = await TIMAAT.MediumCollectionDatasets.createMediumCollectionSubtypeModel(formDataSanitized, type);

					var newMediumCollection = await TIMAAT.MediumCollectionDatasets.createMediumCollection(type, mediumCollectionModel, mediumCollectionSubtypeModel);
					mediumCollection = new TIMAAT.MediumCollection(newMediumCollection);
					$('#mediumCollectionFormMetadata').data('mediumCollection', mediumCollection);
					$('#mediumTabMediumCollectionFormMetadata').trigger('click'); // TODO only occurrence of this id. investigate.
					TIMAAT.URLHistory.setURL(null, mediumCollection.model.title + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + mediumCollection.model.id);
				}
				$('.addMediumCollectionButton').prop('disabled', false);
				$('.addMediumCollectionButton :input').prop('disabled', false);
				$('.addMediumCollectionButton').show();
				await TIMAAT.UI.refreshDataTable('mediumCollection');
				TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', mediumCollection.model.id);
				TIMAAT.UI.displayDataSetContent('dataSheet', mediumCollection, 'mediumCollection');
				TIMAAT.MediumCollectionDatasets.currentPermissionLevel = await TIMAAT.MediumCollectionService.getMediumCollectionPermissionLevel(mediumCollection.model.id);
			});

			// cancel add/edit button in content form functionality
			$('#mediumCollectionFormMetadataDismissButton').on('click', async function(event) {
				$('.addMediumCollectionButton').prop('disabled', false);
				$('.addMediumCollectionButton :input').prop('disabled', false);
				$('.addMediumCollectionButton').show();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

			// tag button handler
			$('#mediumCollectionFormTagButton').on('click', async function(event) {
				event.stopPropagation();
				if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
					$('#mediumCollectionInsufficientPermissionModal').modal('show');
					return;
				}
				TIMAAT.UI.hidePopups();
				var modal = $('#mediumCollectionDatasetsMediumCollectionTagsModal');
				modal.data('mediumCollection', $('#mediumCollectionFormMetadata').data('mediumCollection'));
				var mediumCollection = modal.data('mediumCollection');
				modal.find('.modal-body').html(`
					<form role="form" id="mediumCollectionTagsModalForm">
						<div class="form-group">
							<label for="mediumCollectionTagsMultiSelectDropdown">Medium collection tags</label>
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="mediumCollectionTagsMultiSelectDropdown"
												name="tagId"
												data-role="tagId"
												data-placeholder="Select medium collection tags"
												multiple="multiple">
								</select>
							</div>
						</div>
					</form>`);
        $('#mediumCollectionTagsMultiSelectDropdown').select2({
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
					// console.log("TCL: then: data", data);
					var tagSelect = $('#mediumCollectionTagsMultiSelectDropdown');
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
				$('#mediumCollectionDatasetsMediumCollectionTagsModal').modal('show');
			});

			// tag button handler
			$('#mediumCollectionFormPermissionButton').on('click', function(event) {
				event.stopPropagation();
				if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 3) {
					$('#mediumCollectionInsufficientPermissionModal').modal('show');
					return;
				}
				TIMAAT.MediumCollectionDatasets.manageMediumCollection();
			});

			$('#mediumCollectionDatasetsMediumCollectionManageModal').on('change paste keyup', '#userAccountForNewPermission', function(event) {
				$('#adminCanNotBeAddedInfo').hide();
				$('#userAccountDoesNotExistInfo').hide();
				$('#userAccountAlreadyInList').hide();
			});

			$('#mediumCollectionDatasetsMediumCollectionManageModal').on('blur', '.custom-select', function(event) {
				$('[id^="adminCannotBeChanged_"]').hide();
			});

			$(document).on('click', '[data-role="newUserPermissionMediumCollection"] > [data-role="add"]', async function(event) {
				event.preventDefault();
				let listEntry = $(this).closest('[data-role="newPermission"]');
				let displayName = '';
				let permissionId = null;
				if (listEntry.find('input').each(function(){
					displayName = $(this).val();
				}));
				if (listEntry.find('select').each(function(){
					permissionId = $(this).val();
				}));

				if (displayName == '') return; // no data entered

				// 'admin' can't be added as admin always has access
				if (displayName.toLowerCase() == 'admin') {
					$('#adminCanNotBeAddedInfo').show();
					return;
				}
				// check if name exists
				// TODO make check case insensitive
				let displayNameExists = await TIMAAT.Service.displayNameExists(displayName);
				if (!displayNameExists) {
					$('#userAccountDoesNotExistInfo').show();
					return;
				}

				// check if name is already in the list
				let displayNameDuplicate = false;
				let i = 0;
				for (; i < TIMAAT.MediumCollectionDatasets.userPermissionList.length; i++) {
					if ($('#userAccountForNewPermission').val() == TIMAAT.MediumCollectionDatasets.userPermissionList[i].displayName ) {
						displayNameDuplicate = true;
						break;
					}
				}
				if (displayNameDuplicate) {
					$('#userAccountAlreadyInList').show();
					return;
				}

				// add new entry to the list
				let userAccountId = await TIMAAT.Service.getUserAccountIdByDisplayName(displayName);
				let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
				await TIMAAT.MediumCollectionService.addUserAccountHasMediumCollectionWithPermission(userAccountId, mediumCollection.model.id, permissionId);
				TIMAAT.MediumCollectionDatasets.manageMediumCollection();
			});

			$(document).on('change', '[data-role="changeUserPermissionMediumCollection"] > [data-role="select"]', async function(event) {
				event.preventDefault();
				let userId = $(this).closest('.permissionContainer').data('userid');
				let permissionId = $(this).closest('.custom-select').val();

				// prevent removal of the last admin. One admin has to exist at any time
				let adminCount = 0;
				$('.permissionContainer [data-role="select"]').each(function() {
					if ( $(this).val() == 4 ) {
						adminCount++;
					}
				});
				if (adminCount <= 0) {
					$(this).closest('.custom-select').val(4); // return invalidly changed option back to 'Administrate'
					$('#adminCannotBeChanged_'+userId).show();
					return;
				}
				let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
				await TIMAAT.MediumCollectionService.updateUserAccountHasMediumCollectionWithPermission(userId, mediumCollection.model.id, permissionId);
				TIMAAT.MediumCollectionDatasets.userPermissionList = await TIMAAT.MediumCollectionService.getDisplayNamesAndPermissions(mediumCollection.model.id);
			});

			$(document).on('change', 'input[type=radio][name=globalPermissionMediumCollection]', async function(event) {
				event.preventDefault();
				let globalPermissionValue = Number($(this).val());
				if (!globalPermissionValue || globalPermissionValue == null || globalPermissionValue > 2) globalPermissionValue = 0;
				let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
				mediumCollection.model.globalPermission = globalPermissionValue;
				TIMAAT.MediumCollectionService.updateMediaCollection(mediumCollection.model);
			});

			$(document).on('click','[data-role="removeUserPermissionMediumCollection"] > [data-role="remove"]', async function (event) {
				event.preventDefault();
				let userId = $(this).closest('.permissionContainer').data('userid');
				let index = TIMAAT.MediumCollectionDatasets.userPermissionList.findIndex(({userAccountId}) => userAccountId == userId);
				let userPermissionId = TIMAAT.MediumCollectionDatasets.userPermissionList[index].permissionId;
				if (!userPermissionId) return;

				// if the to be removed user has administrate permission, make sure that she is not the only one
				if (userPermissionId == 4) {
					// prevent removal of the last admin. One admin has to exist at any time
					let adminCount = 0;
					$('.permissionContainer [data-role="select"]').each(function() {
						if ( $(this).val() == 4 ) {
							adminCount++;
						}
					});
					if (adminCount <= 1) {
						$('#adminCannotBeChanged_'+userId).show();
						return;
					}
				}
				let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
				await TIMAAT.MediumCollectionService.removeUserAccountHasMediumCollection(userId, mediumCollection.model.id);
				$(this).closest('.permissionContainer').remove();
				TIMAAT.MediumCollectionDatasets.userPermissionList.splice(index, 1);
			});

			// submit tag modal button functionality
			$('#mediumCollectionDatasetsModalTagSubmitButton').on('click', async function(event) {
				event.preventDefault();
				var modal = $('#mediumCollectionDatasetsMediumCollectionTagsModal');
				if (!$('#mediumCollectionTagsModalForm').valid())
					return false;
				var mediumCollection = modal.data('mediumCollection');
				var formDataRaw = $('#mediumCollectionTagsModalForm').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
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
					// console.log("TCL: updatedMediumCollectionModel", updatedMediumCollectionModel);
					mediumCollection.model.tags = updatedMediumCollectionModel.tags;
				}
				$('#mediumFormMetadata').data('mediumCollection', mediumCollection);
				modal.modal('hide');
			});

			$('#mediumCollectionTypeSelectDropdown').on('change', function(event) {
				event.stopPropagation();
				let type = $('#mediumCollectionTypeSelectDropdown').find('option:selected').html();
				TIMAAT.MediumCollectionDatasets.initFormDataSheetData(type);
			});

			// data table events
			$('#mediumCollectionListDataTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			$('#mediumCollectionDatasetsMediumCollectionItemsDataTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

		},

		initMediaCollectionItems: function() {
			// nav-bar functionality
			$('#mediumCollectionItemsTab').on('click', async function(event) {
				let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
				let type = $('#mediumCollectionFormMetadata').data('type');
				let title = mediumCollection.model.title;
				let id = mediumCollection.model.id;
				TIMAAT.UI.displayDataSetContentArea('mediumCollectionMediaItems');
				TIMAAT.UI.subNavTab = 'items';
				TIMAAT.MediumCollectionDatasets.setMediumCollectionItemList();

				if (!TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList) {
					await TIMAAT.MediumCollectionDatasets.setupMediumCollectionItemListDataTable(id);
					TIMAAT.MediumCollectionDatasets.setMediumCollectionItemList();
				}
				TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediumCollection/' + id + '/hasMediaList')
				TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload().columns.adjust();
				TIMAAT.UI.displayDataSetContent('items', mediumCollection, 'mediumCollection');
				$('#mediumCollectionItemsAddButton').prop('disabled', false);
				$('#mediumCollectionItemsAddButton :input').prop('disabled', false);
				$('#mediumCollectionItemsAddButton').show();
				TIMAAT.URLHistory.setURL(null, title + ' · Collection Items · ' + type[0].toUpperCase() + type.slice(1), '#mediumCollection/' + id + '/items');
			});

			// add medium collection button functionality (in medium collection list - opens dataSheet form)
			$('#mediumCollectionItemsAddButton').on('click', function(event) {
				if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
					$('#mediumCollectionInsufficientPermissionModal').modal('show');
					return;
				}
				let collection = $('#mediumCollectionFormMetadata').data('mediumCollection');
        // console.log("TCL ~ $ ~ collection", collection);
				TIMAAT.MediumCollectionDatasets.addMediumCollectionItem(collection.model.id);
			});

			$('#mediumCollectionDatasetsAddItemModal').on('hide.bs.modal', function(event) {
				TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
			})

		},

		load: function() {
			this.loadMediaCollections();
		},

		loadMediaCollections: function() {
			$('#mediumCollectionFormMetadata').data('type', 'mediumCollection');
			$('#mediumVideoPreview').get(0).pause();
			this.setMediumCollectionList();
			TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
		},

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
				TIMAAT.UI.clearLastSelection('mediumCollection');
			}
			this.mediaCollectionListLoaded = true;
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
			TIMAAT.UI.displayDataSetContentContainer('mediumCollectionMetadataTab', 'mediumCollectionFormMetadata')
			$('.addMediumCollectionButton').hide();
			$('.addMediumCollectionButton').prop('disabled', true);
			$('.addMediumCollectionButton :input').prop('disabled', true);
			$('#mediumCollectionFormMetadata').data('mediumCollection', null);
			mediumFormMetadataValidator.resetForm();

			TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
			$('#mediumCollectionFormMetadata').trigger('reset');

			this.getMediumCollectionTypeDropDownData();
			let type = $('#mediumCollectionTypeSelectDropdown').find('option:selected').html();
			$('#mediumCollectionFormMetadata').data('type', type);
			this.initFormDataSheetData(type);
			this.initFormDataSheetForEdit();
			$('#mediumCollectionFormMetadataSubmitButton').html('Add');
			$('#mediumCollectionFormHeader').html('Add media collection');
			$('#mediumCollectionTypeSelectDropdown').prop('disabled', false);
			$('#mediumCollectionTypeSelectDropdown :input').prop('disabled', false);
		},

		addMediumCollectionItem: async function(collectionId) {
    	// console.log("TCL: addMediumCollectionItem - collectionId: ", collectionId);
			if ( this.dataTableMedia ) {
				this.dataTableMedia.ajax.url('api/mediumCollection/'+collectionId+'/notInMediaList');
				this.dataTableMedia.ajax.reload(null, false);
			}
			if ( this.dataTableCollectionItems ) {
				this.dataTableCollectionItems.ajax.url('api/mediumCollection/'+collectionId+'/mediaList');
				this.dataTableCollectionItems.ajax.reload(null, false);
			}
			$('#mediumCollectionDatasetsAddItemModal').modal('show');
		},

		mediumCollectionFormDataSheet: async function(action, type, data) {
			// console.log("TCL: action, type, data", action, type, data);
			// TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', data.model.id);
			$('#mediumCollectionFormMetadata').trigger('reset');
			$('#mediumCollectionFormMetadata').data('type', type);
			this.initFormDataSheetData(type);
			mediumFormMetadataValidator.resetForm();

			this.getMediumCollectionTypeDropDownData();
			let typeSelect = $('#mediumCollectionTypeSelectDropdown');
			let option = new Option(data.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type, data.model.mediaCollectionType.id, true, true);
			typeSelect.append(option).trigger('change');
			$('#mediumCollectionTypeSelectDropdown').select2('destroy').attr('readonly', true);

			if ( action == 'show') {
				$('#mediumCollectionFormMetadata :input').prop('disabled', true);
				$('.formButtons').show();
				$('.formButtons').prop('disabled', false);
				$('.formButtons :input').prop('disabled', false);
				$('#mediumCollectionFormMetadataSubmitButton').hide();
				$('#mediumCollectionFormMetadataDismissButton').hide();
				$('#mediumCollectionFormHeader').html(type+" Data Sheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				$('#mediumCollectionFormMetadataSubmitButton').html('Save');
				$('#mediumCollectionFormHeader').html('Edit '+type);
				this.initFormDataSheetForEdit();
				$('#mediumCollectionTypeSelectDropdown').prop('disabled', true);
				$('#mediumCollectionTypeSelectDropdown :input').prop('disabled', true);
			}

			// console.log("TCL: modelData", modelData);
			// setup UI

			// medium collection data
			$('#mediumCollectionDatasetsMetadataTitle').val(data.model.title);
			$('#mediumCollectionTypeSelectDropdown').val(data.model.mediaCollectionType.id);
			if (data.model.isSystemic)
				$('#mediumCollectionDatasetsMetadataIsSystemic').prop('checked', true);
				else $('#mediumCollectionDatasetsMetadataIsSystemic').prop('checked', false);
			$('#mediumCollectionDatasetsMetadataRemark').val(data.model.remark);

			// medium collection subtype specific data
			switch (type) {
				case 'Album':
					$('#mediumCollectionDatasetsMetadataAlbumTracks').val(data.model.mediaCollectionAlbum.tracks);
				break;
				case 'Series':
					$('#mediumCollectionDatasetsMetadataSeriesSeasons').val(data.model.mediaCollectionSeries.seasons);
					if (data.model.mediaCollectionSeries.started != null && !(isNaN(data.model.mediaCollectionSeries.started)))
						$('#mediumCollectionDatasetsMetadataSeriesStarted').val(moment.utc(data.model.mediaCollectionSeries.started).format('YYYY-MM-DD'));
						else $('#mediumCollectionDatasetsMetadataSeriesStarted').val('');
					if (data.model.mediaCollectionSeries.ended != null && !(isNaN(data.model.mediaCollectionSeries.ended)))
						$('#mediumCollectionDatasetsMetadataSeriesEnded').val(moment.utc(data.model.mediaCollectionSeries.ended).format('YYYY-MM-DD'));
						else $('#mediumCollectionDatasetsMetadataSeriesEnded').val('');
				break;
			}
			$('#mediumCollectionFormMetadata').data('mediumCollection', data);
		},

		mediumCollectionFormItems: async function(action, data) {
			// console.log("TCL: action, data", action, data);
			// TIMAAT.MediumCollectionDatasets.selectLastItemSelection(data.model.id); // TODO get medium Id of item
			// TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', data.model.id);
			$('#mediumCollectionMediaItems').trigger('reset');
			var type = $('#mediumCollectionFormMetadata').data('type');

			mediumFormMetadataValidator.resetForm();

			if ( action == 'show') {
				$('#mediumCollectionMediaItems :input').prop('disabled', true);
				$('.formButtons').show();
				$('.formButtons').prop('disabled', false);
				$('.formButtons :input').prop('disabled', false);
				// $('#mediumCollectionMediaItems-submit').hide();
				// $('#mediumCollectionMediaItems-dismiss').hide();
				$('#mediumCollectionItemsAddButton').prop('disabled', false);
				$('#mediumCollectionItemsAddButton :input').prop('disabled', false);
				$('#mediumCollectionItemsAddButton').show();
				$('#mediumCollectionFormHeader').html(type+" Data Sheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				// $('#mediumCollectionMediaItems-submit').html('Save');
				$('#mediumCollectionFormHeader').html("Edit "+type);
				this.initFormDataSheetForEdit();
			}
			// medium collection item data
			// $('#mediumCollectionMediaItems').data(type, data);
		},

		manageMediumCollection: async function() {
			// console.log("TCL: manageMediumCollection: function()");
			// check if user is moderator or administrator of the media collection.
			let mediumCollection = $('#mediumCollectionFormMetadata').data('mediumCollection');
      // console.log("TCL: manageMediumCollection:function -> mediumCollection", mediumCollection);
			let permissionLevel = await TIMAAT.MediumCollectionService.getMediumCollectionPermissionLevel(mediumCollection.model.id);
      // console.log("TCL: manageMediumCollection:function -> permissionLevel", permissionLevel);
			if (permissionLevel == 3 || permissionLevel == 4) {
				let modal = $('#mediumCollectionDatasetsMediumCollectionManageModal');
				// get all display names and permissions for this media collection
				let userDisplayNameAndPermissionList = await TIMAAT.MediumCollectionService.getDisplayNamesAndPermissions(mediumCollection.model.id);
        // console.log("TCL: manageMediumCollection:function -> userDisplayNameAndPermissionList", userDisplayNameAndPermissionList);
				TIMAAT.MediumCollectionDatasets.userPermissionList = userDisplayNameAndPermissionList;
				let modalBodyText = `<div class="col-12">
					<div class="row">
						<div class="col-7">
							<h6>User</h6>
							<div id="mediumCollectionPermissionUserName">
							</div>
						</div>
						<div class="col-4">
							<h6>Access rights</h6>
							<div id="mediumCollectionPermissionLevel">
							</div>
						</div>
						<div class="col-1">
						</div>
					</div>`;
				let i = 0;
				for (; i < userDisplayNameAndPermissionList.length; i++) {
					modalBodyText += `<div class="permissionContainer" data-user-id="`+userDisplayNameAndPermissionList[i].userAccountId+`">
						<hr>
						<div class="row align-items--vertically">
							<div class="col-7">
								` + userDisplayNameAndPermissionList[i].displayName + `
							</div>
							<div class="col-4" data-role="changeUserPermissionMediumCollection">`;
					if ( permissionLevel == 3 ) {
						switch (userDisplayNameAndPermissionList[i].permissionId) {
							case 1:
								modalBodyText += `<select class="custom-select" data-role="select">
													<option value="1" selected>Read</option>
													<option value="2">Read+Write</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionMediumCollection">
												<button class="removePermission badge btn btn-sm btn-danger p-1 float-right" data-role="remove" data-user-id="`+userDisplayNameAndPermissionList[i].userAccountId+`" data-listId="`+userDisplayNameAndPermissionList[i].permissionId+`">
													<i class="fas fa-minus fa-fw"></i>
												</button>
											</div>
										</div>
									</div>`;
							break;
							case 2:
								modalBodyText += `<select class="custom-select" data-role="select">
													<option value="1">Read</option>
													<option value="2" selected>Read+Write</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionMediumCollection">
												<button class="removePermission badge btn btn-sm btn-danger p-1 float-right" data-role="remove" data-user-id="`+userDisplayNameAndPermissionList[i].userAccountId+`" data-listId="`+userDisplayNameAndPermissionList[i].permissionId+`">
													<i class="fas fa-minus fa-fw"></i>
												</button>
											</div>
										</div>
									</div>`;
							break;
							case 3:
								modalBodyText += `<select class="custom-select" data-role="select" disabled>
													<option value="3" selected>Moderate</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionMediumCollection">
											</div>
										</div>
									</div>`;
							break;
							case 4:
								modalBodyText += `<select class="custom-select" data-role="select" disabled>
													<option value="4" selected>Administrate</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionMediumCollection">
											</div>
										</div>
									</div>`;
							break;
							default:
								modalBodyText += `An error occurred!`; // should never occur
							break;
						}
					} else { // permissionLevel == 4
						switch (userDisplayNameAndPermissionList[i].permissionId) {
							case 1:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1" selected>Read</option>
										<option value="2">Read+Write</option>
										<option value="3">Moderate</option>
										<option value="4">Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" class="danger-text">At least one administrator needs to exist.</small>`;
							break;
							case 2:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1">Read</option>
										<option value="2" selected>Read+Write</option>
										<option value="3">Moderate</option>
										<option value="4">Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" class="danger-text">At least one administrator needs to exist.</small>`;
							break;
							case 3:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1">Read</option>
										<option value="2">Read+Write</option>
										<option value="3" selected>Moderate</option>
										<option value="4">Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" class="danger-text">At least one administrator needs to exist.</small>`;
							break;
							case 4:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1">Read</option>
										<option value="2">Read+Write</option>
										<option value="3">Moderate</option>
										<option value="4" selected>Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" class="danger-text">At least one administrator needs to exist.</small>`;
							break;
							default:
								modalBodyText += `An error occurred!`; // should never occur
							break;
						}
						modalBodyText += `
									</div>
									<div class="col-1" data-role="removeUserPermissionMediumCollection">
										<button class="removePermission badge btn btn-sm btn-danger p-1 float-right" data-role="remove" data-user-id="`+userDisplayNameAndPermissionList[i].userAccountId+`" data-listId="`+userDisplayNameAndPermissionList[i].permissionId+`">
											<i class="fas fa-minus fa-fw"></i>
										</button>
									</div>
								</div>
							</div>`;
					}
				}
				modalBodyText += `<div id="newPermissionContainer">
					<hr>
					<div class="row align-items--vertically" data-role="newPermission">
						<div class="col-2">
							<h6>Add user</h6>
						</div>
						<div class="col-5">
							<input type="text" id="userAccountForNewPermission" class="form-control username" placeholder="Username" aria-label="Username">
							<small id="userAccountDoesNotExistInfo" class="danger-text">This user name does not exist. Please check your spelling and try again.</small>
							<small id="userAccountAlreadyInList" class="danger-text">This user already has a permission level.</small>
							<small id="adminCanNotBeAddedInfo" class="danger-text">Admin can not be added.</small>
						</div>
						<div class="col-4">
							<select class="custom-select" id="newAccessRightsSelect">
								<option value="1" selected>Read</option>
								<option value="2">Read+Write</option>`;
				if (permissionLevel == 4) {	 // only admins can create mods and admins
					modalBodyText += `<option value="3">Moderate</option>
						<option value="4">Administrate</option>`;
				}
				modalBodyText += `</select>
							</div>
							<div class="col-1" data-role="newUserPermissionMediumCollection">
								<button class="addNewPermission btn btn-sm btn-primary p-1 float-right" data-role="add" data-user-id="0" data-listId="0">
									<i class="fas fa-plus fa-fw"></i>
								</button>
							</div>
						</div>
						<div class="globalPermissionContainer">
							<hr>
							<div class="row align-items--vertically" data-role="globalUserPermission">
								<fieldset>
									<legend>You can grant all users access to this medium collection</legend>
									<div id="globalPermission" class="radio-buttons__horizontal--evenly-spaced" data-role="select">
										<label>
											<input id="globalPermission_0" type="radio" name="globalPermissionMediumCollection" value="0"> No global access
										</label>
										<label>
											<input id="globalPermission_1" type="radio" name="globalPermissionMediumCollection" value="1"> Read
										</label>
										<label>
											<input id="globalPermission_2" type="radio" name="globalPermissionMediumCollection" value="2"> Read+Write
										</label>
									</div>
								</fieldset>
							</div>
						</div>
					</div>
				</div>`;
				modal.find('.modal-body').html(modalBodyText);
				if (mediumCollection.model.globalPermission == null) mediumCollection.model.globalPermission = 0;
				$('#globalPermission_'+ mediumCollection.model.globalPermission).prop('checked', true);
				modal.modal('show');
			}
			// TODO else show popup 'you have no rights'
		},

		mediumCollectionFormPublication: async function(collection) {
      // console.log("TCL ~ mediumCollectionFormPublication:function ~ collection", collection);
			$('#mediumCollectionPublication').trigger('reset');
			// TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', collection.model.id);
			mediumFormMetadataValidator.resetForm();
			let publication = await TIMAAT.PublicationService.getCollectionPublication(collection.model.id);
			this.mediaCollectionPublication = publication;
			this._setupPublicationSheet(publication !=null, publication !=null && publication.access == 'protected');
		},

		setupMediumCollectionItemListDataTable: async function() {
			// console.log("TCL: setupMediumCollectionItemListDataTable");
      this.dataTableMediaCollectionItemList = $('#mediumCollectionDatasetsMediumCollectionItemsDataTable').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<l<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollX"				: false,
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
				// "initComplete": function(settings, json) {
				// 	TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload()
				// },
				"drawCallback": function( settings ) {
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if (api.context[0].aoData[i]._aData.medium.id == TIMAAT.UI.selectedMediumCollectionItemId) { //* no test for selected class as we don't want list entry to show as selected
							let index = i+1;
							let position = $('table tbody > tr:nth-child('+index+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},0);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: rowCallback: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumCollectionItemId) {
					TIMAAT.UI.clearLastSelection('mediumCollectionItem');
						// $(row).addClass('selected');
						TIMAAT.UI.selectedMediumCollectionItemId = data.id; //* as it is set to null in clearLastSelection
					}
				},
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

					if ( medium.fileStatus != "noFile" ) TIMAAT.VideoPlayer.loadThumbnail(medium);
					TIMAAT.MediumDatasets.setMediumStatus(medium);

					// set up events
					mediumCollectionElement.on('click', function(event) {
						TIMAAT.UI.selectedMediumCollectionItemId = medium.id;
					});

					mediumCollectionElement.on('click', '.collectionItemUploadButton', async function(event) {
						event.stopPropagation();
						TIMAAT.UI.hidePopups();
						let item = new TIMAAT.Medium(medium, type);
						item.listView.find('.mediumUploadFile').click();
					});

					mediumCollectionElement.on('click', '.collectionItemAnnotateButton', async function(event) {
						event.stopPropagation();
						TIMAAT.UI.hidePopups();
						if ( !medium.mediumVideo && !medium.mediumImage && !medium.mediumAudio) return; //* allow annotating only for videos, images and audio
						if ( medium.fileStatus && medium.fileStatus != 'ready' && medium.fileStatus != 'transcoding' && medium.fileStatus != 'waiting' ) return;
						await TIMAAT.VideoPlayer.initializeAnnotationMode(medium);
					});

					mediumCollectionElement.on('click', '.mediumDatasetsMediumMetadata', async function(event) {
						event.stopPropagation();
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.UI.displayComponent('medium', type+'Tab', type+'DataTable', 'mediumMetadataTab', 'mediumFormMetadata');
            TIMAAT.UI.displayDataSetContent('dataSheet', mediumModel, 'medium');
						TIMAAT.MediumDatasets.setDataTableOnItemSelect(type, mediumModel);
					});

					mediumCollectionElement.on('click', '.mediumCollectionDatasetsCollectionItemRemove', async function(ev) {
						if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
							$('#mediumCollectionInsufficientPermissionModal').modal('show');
							return;
						}
						var row = $(this).parents('tr');
						let collection = $('#mediumCollectionFormMetadata').data('mediumCollection');
						let mediumToRemove = $(row).data('medium');
						await TIMAAT.MediumCollectionService.removeCollectionItem(collection.model.id, mediumToRemove.id);
						await TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
					});

					mediumCollectionElement.on('click', '.mediumCollectionDatasetsCollectionItemMoveUp', async function(event) {
						if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
							$('#mediumCollectionInsufficientPermissionModal').modal('show');
							return;
						}
						let row = $(this).parents('tr');
						let collection = $('#mediumCollectionFormMetadata').data('mediumCollection');
						let mediumToMoveUp = $(row).data('medium');
						let collectionId = collection.model.id;
						let mediumId = mediumToMoveUp.id;
						TIMAAT.UI.selectedMediumCollectionItemId = mediumId;
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
						// await TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
						TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.draw(false); //* to scroll to selected row
					});

					mediumCollectionElement.on('click', '.mediumCollectionDatasetsCollectionItemMoveDown', async function(event) {
						if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
							$('#mediumCollectionInsufficientPermissionModal').modal('show');
							return;
						}
						let row = $(this).parents('tr');
						let collection = $('#mediumCollectionFormMetadata').data('mediumCollection');
						let mediumToMoveDown = $(row).data('medium');
						let collectionId = collection.model.id;
						let mediumId = mediumToMoveDown.id;
						TIMAAT.UI.selectedMediumCollectionItemId = mediumId;
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
						// await TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload(null, false);
						TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.draw(false); //* to scroll to selected row
					});

					mediumCollectionElement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
						//* only videos have thumbnail slideshow
						if (!medium.mediumVideo) return;
						if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
						let length = medium.mediumVideo.length;
						let timeCode = Math.round((ev.originalEvent.offsetX/254)*length);
						timeCode = Math.min(Math.max(0, timeCode),length);
						mediumCollectionElement.find('.mediumThumbnail').attr('src', "/TIMAAT/api/medium/video/"+medium.id+"/thumbnail"+"?time="+timeCode+"&token="+medium.viewToken);
					});

					mediumCollectionElement.find('.card-img-top').bind("mouseleave", function(ev) {
						//* only videos have thumbnail slideshow
						if (!medium.mediumVideo) return;
						if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
						mediumCollectionElement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+medium.id+"/thumbnail"+"?token="+medium.viewToken);
					});

					if ( type == 'video' && medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
						TIMAAT.MediumDatasets.updateVideoStatus(medium);

				},
				"columns": [
					{ data: 'sortOrder', className: 'sortOrder', width: '5%', render: function(data, type, collection, meta) {
						// console.log(`TCL: sortOrder:function -> data, type, collection, meta`, data, type, collection, meta);
						let order =
							`<div class="row">
								<div class="col-md-6 text-align--right pr-2 pl-0">`+(collection.sortOrder+1)+`</div>
								<div class="btn-group-vertical">`;
						if (meta.row > 0) {
							order += `<button type="button" title="Sort up" class="btn btn-outline-secondary btn-sm mediumCollectionDatasetsCollectionItemMoveUp"><i class="fas fa-sort-up"></i></button>`;
						}
						if (meta.row < TIMAAT.MediumCollectionDatasets.mediaCollectionItemList.length-1) {
							order += `<button type="button" title="Sort down" class="btn btn-outline-secondary btn-sm mediumCollectionDatasetsCollectionItemMoveDown"><i class="fas fa-sort-down"></i></button>`;
						}
						order += `</div>
							</div>`;
						return order;
						}
					},
					{ data: null, className: 'mediumPreview', orderable: false, width: '20%', render: function(data, type, collectionItem, meta) {
            // console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						let ui;
						if (collectionItem.medium.mediumVideo) {
							ui = `<div class="medium-file-status js-medium-file-status">
											<i class="js-medium-file-status__icon fas fa-cog fa-spin"></i>
											</div>
										<img class="card-img-top center mediumThumbnail" src="img/preview-placeholder.png" width="150" height="85" alt="Video preview"/>`;
						}
						else if (collectionItem.medium.mediumImage) {
							ui = `<div class="display--flex">
											<img class="card-img-top center mediumThumbnail" src="img/preview-placeholder.png" width="150" height="85" alt="Image preview"/>
										</div>`;
						} else if (collectionItem.medium.mediumAudio) {
							ui = `<div class="display--flex">
											<i class="center fas fa-file-audio fa-5x"></i>
										</div>`;
						} else {
							ui = `<div class="display--flex">
											<img class="card-img-top center" src="img/preview-placeholder.png" width="150" height="85" alt="No preview available"/>
										</div>`;
						}
						return ui;
						}
					},
					{ data: 'id', name: 'title', className: 'title', orderable: false, width: '30%', render: function(data, type, collectionItem, meta) {
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
							// TODO not working anymore due to server side dataTable data search
							collectionItem.medium.titles.forEach(function(title) { // make additional titles searchable in media library
								if (title.id != collectionItem.medium.displayTitle.id && (collectionItem.medium.originalTitle == null || title.id != collectionItem.medium.originalTitle.id)) {
									titleDisplay += `<div class="display--none">`+title.name+`</div>`;
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
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						return TIMAAT.MediumCollectionDatasets._getProducer(collectionItem.medium);
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
							data.sort((a,b) => a.mediumLanguageType.id > b.mediumLanguageType.id ? 1 : ((b.mediumLanguageType.id > a.mediumLanguageType.id) ? -1 : 0));
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
					{ data: null, className: 'actions text-align--center', orderable: false, width: '5%', render: function(data, type, collectionItem, meta) {
						// console.log("TCL: setupMediumCollectionItemListDataTable:function -> data, type, collectionItem, meta", data, type, collectionItem, meta);
						let ui = `<div class="btn-group-vertical" role="group">`;
						if ( collectionItem.medium.mediumVideo ){
							if ( !collectionItem.medium.fileStatus || collectionItem.medium.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload video" class="btn btn-outline-secondary btn-sm collectionItemUploadButton"><i class="fas fa-file-upload"></i></button>`;
							} else {
								ui +=	`<button type="button" title="Annotate video" class="btn btn-outline-secondary btn-sm collectionItemAnnotateButton"><i class="fas fa-draw-polygon"></i></button>`;
							}
						} else if ( collectionItem.medium.mediumAudio ){
							if ( !collectionItem.medium.fileStatus || collectionItem.medium.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload audio" class="btn btn-outline-secondary btn-sm collectionItemUploadButton"><i class="fas fa-file-upload"></i></button>`;
							} else {
								ui +=	`<button type="button" title="Annotate audio" class="btn btn-outline-secondary btn-sm collectionItemAnnotateButton"><i class="fas fa-draw-polygon"></i></button>`;
							}
						} else if (collectionItem.medium.mediumImage) {
							if ( !collectionItem.medium.fileStatus || collectionItem.medium.fileStatus == 'noFile' ) {
								ui +=	`<button type="button" title="Upload image" class="btn btn-outline-secondary btn-sm collectionItemUploadButton"><i class="fas fa-file-upload"></i></button>`;
							} else {
								ui +=	`<button type="button" title="Annotate image" class="btn btn-outline-secondary btn-sm collectionItemAnnotateButton"><i class="fas fa-draw-polygon"></i></button>`;
							}
						}
						ui += `<button type="button" title="Edit data sheet" class="btn btn-outline-secondary btn-sm mediumDatasetsMediumMetadata"><i class="fas fa-file-alt"></i></button>
									 <button type="button" title="Remove from collection" class="btn btn-outline-secondary btn-sm mediumCollectionDatasetsCollectionItemRemove"><i class="fas fa-folder-minus"></i></button>
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
			this.dataTableMediaCollectionList = $('#mediumCollectionListDataTable').DataTable({
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
					"url"        : "api/mediumCollection/list/"+'?authToken='+TIMAAT.Service.session.token,
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
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));
					}
				},
				"initComplete": async function( settings, json ) {
					TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionList.draw(); //* to scroll to selected row
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
					// console.log("TCL: rowCallback: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedMediumCollectionId) {
					TIMAAT.UI.clearLastSelection('mediumCollection');
						$(row).addClass('selected');
						TIMAAT.UI.selectedMediumCollectionId = data.id; //* as it is set to null in clearLastSelection
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

					mediumCollectionElement.on('click', '.title', async function(event) {
						event.stopPropagation();
						TIMAAT.MediumCollectionDatasets.currentPermissionLevel = await TIMAAT.MediumCollectionService.getMediumCollectionPermissionLevel(mediumCollection.id);
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						$('#mediumDatasetsMediumTabsContainer').append($('#mediumDatasetsMediumTabs'));
						$('#mediumModalsContainer').append($('#mediumModals'));
						TIMAAT.MediumDatasets.container = 'media';
						$('#mediumPreviewDataTab').removeClass('annotationMode');
						switch (TIMAAT.UI.subNavTab) {
							case 'dataSheet':
								TIMAAT.UI.displayDataSetContentContainer('mediumCollectionDataTab', 'mediumCollectionFormMetadata', 'mediumCollection');
							break;
							case 'items':
								TIMAAT.UI.displayDataSetContentContainer('mediumCollectionItemsTab', 'mediumCollectionMediaItems', 'mediumCollection');
							break;
							// case 'publication':
							// 	TIMAAT.UI.displayDataSetContentContainer('mediumCollectionPublication-tab', 'mediumCollectionPublication', 'mediumCollection');
							// break;
						}
						TIMAAT.UI.clearLastSelection('mediumCollection');
						let index = TIMAAT.MediumCollectionDatasets.mediaCollectionList.findIndex(({model}) => model.id == mediumCollection.id);
						let selectedMediumCollection = TIMAAT.MediumCollectionDatasets.mediaCollectionList[index];
						TIMAAT.UI.addSelectedClassToSelectedItem('mediumCollection', mediumCollection.id);
						if (TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList) {
							TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediumCollection/'+mediumCollection.id+'/hasMediaList')
							TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload().columns.adjust();
						// } else {
						// 	await TIMAAT.MediumCollectionDatasets.setupMediumCollectionItemListDataTable(id);
						// 	TIMAAT.MediumCollectionDatasets.setMediumCollectionItemList();
						}

						// console.log("TCL: selectedMediumCollection", selectedMediumCollection);
						$('#mediumCollectionFormMetadata').data('mediumCollection', selectedMediumCollection);
						let type = selectedMediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
						$('#mediumCollectionFormMetadata').data('type', type);
						// $('#mediumCollectionFormMetadata').data('type', type);
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
			this.dataTableMedia = $('#mediumCollectionAvailableItemsDataTable').DataTable({
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

					mediumElement.find('.addMedium').on('click', medium, async function(ev) {
						ev.stopPropagation();
						if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
							$('#mediumCollectionInsufficientPermissionModal').modal('show');
							return;
						}
						// if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						let collection = $('#mediumCollectionFormMetadata').data('mediumCollection');
            // console.log("TCL: collection", collection);
						$(this).remove();
						TIMAAT.MediumCollectionService.addCollectionItem(collection.model.id, medium.id)
						.then((result) => {
							TIMAAT.MediumCollectionDatasets.dataTableMedia.ajax.reload();
							TIMAAT.MediumCollectionDatasets.dataTableCollectionItems.ajax.reload();
						}).catch((error)=>{
							console.error("ERROR: ", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, medium, meta) {
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
									<span class="addMedium badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw"></i></span>
								</p>`;
							if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
							}
							medium.titles.forEach(function(title) { // make additional titles searchable in media library
								if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
									titleDisplay += `<div class="display--none">`+title.name+`</div>`;
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
			this.dataTableCollectionItems = $('#mediumCollectionItemsDataTable').DataTable({
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

					mediumElement.find('.removeMedium').on('click', medium, function(ev) {
						ev.stopPropagation();
						if (TIMAAT.MediumCollectionDatasets.currentPermissionLevel < 2) {
							$('#mediumCollectionInsufficientPermissionModal').modal('show');
							return;
						}
						// if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						let collection = $('#mediumCollectionFormMetadata').data('mediumCollection');
            // console.log("TCL: collection", collection);
						$(this).remove();
						TIMAAT.MediumCollectionService.removeCollectionItem(collection.model.id, medium.id)
						.then((result)=>{
							TIMAAT.MediumCollectionDatasets.dataTableMedia.ajax.reload();
							TIMAAT.MediumCollectionDatasets.dataTableCollectionItems.ajax.reload();
						}).catch((error)=>{
							console.error("ERROR: ", error);
						});
					});
				},
				"columns": [
					{ data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, medium, meta) {
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
									<span class="removeMedium badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw"></i></span>
								</p>`;
							if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
							}
							medium.titles.forEach(function(title) { // make additional titles searchable in media library
								if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
									titleDisplay += `<div class="display--none">`+title.name+`</div>`;
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
    	// console.log("TCL: formDataObject, type", formDataObject);
			var model = {
				id                 : 0,
				isSystemic         : formDataObject.isSystemic,
				title              : formDataObject.title,
				remark             : formDataObject.remark,
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
						tracks           : formDataObject.tracks
					};
				break;
				case 'Series':
					model = {
						mediaCollectionId: 0,
						seasons          : formDataObject.seasons,
						started          : formDataObject.started,
						ended            : formDataObject.ended
					};
				break;
			}
      // console.log("TCL: model", model);
			return model;
		},

		createMediumCollection: async function(type, model, subtypeModel) {
    	// console.log("TCL: createMediumCollection: type, model, subtypeModel", type, model, subtypeModel);
			try {
				// create medium collection
				var newModel = await TIMAAT.MediumCollectionService.createMediumCollection(model);
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// create subtype with medium collection id
				subtypeModel.mediaCollectionId = newModel.id;
				if (type != 'Collection') { //* Collection has no extra data table
					await TIMAAT.MediumCollectionService.createMediumCollectionSubtype(type, newModel, subtypeModel);
				}
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// push new medium collection to dataset model
				switch (type) {
					case 'Album':
						newModel.mediaCollectionAlbum = subtypeModel;
					break;
					case 'Series':
						newModel.mediaCollectionSeries = subtypeModel;
					break;
				};
			} catch(error) {
				console.error("ERROR: ", error);
			};
			return newModel;
		},

		updateMediumCollection: async function(subtype, mediumCollection) {
			// console.log("TCL: updateMediumCollection: async function -> mediumCollection at beginning of update process: ", subtype, mediumCollection);
				try { // update subtype
					var tempSubtypeModel;
					switch (subtype) {
						case 'Album':
							tempSubtypeModel = mediumCollection.model.mediaCollectionAlbum;
							await TIMAAT.MediumCollectionService.updateMediumCollectionSubtype(subtype, tempSubtypeModel);
						break;
						case 'Series':
							tempSubtypeModel = mediumCollection.model.mediaCollectionSeries;
							await TIMAAT.MediumCollectionService.updateMediumCollectionSubtype(subtype, tempSubtypeModel);
							break;
					}
				} catch(error) {
					console.error("ERROR: ", error);
				};

				try { // update mediumCollection
					await TIMAAT.MediumCollectionService.updateMediaCollection(mediumCollection.model);
				} catch(error) {
					console.error("ERROR: ", error);
				};
		},

		updateMediumCollectionHasTagsList: async function(mediumCollectionModel, tagIdList) {
    	// console.log("TCL: mediumCollectionModel, tagIdList", mediumCollectionModel, tagIdList);
			try {
				var existingMediumCollectionHasTagsEntries = await TIMAAT.MediumCollectionService.getTagList(mediumCollectionModel.id);
        // console.log("TCL: existingMediumCollectionHasTagsEntries", existingMediumCollectionHasTagsEntries);
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
              // console.log("TCL: deleteId", deleteId);
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
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							mediumCollectionModel.tags.push(idsToCreate[i]);
							await TIMAAT.MediumCollectionService.addTag(mediumCollectionModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
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
				console.error("ERROR: ", error);
			}
			let index = TIMAAT.MediumCollectionDatasets.mediaCollectionList.findIndex(({model}) => model.id == mediumCollection.id);
			TIMAAT.MediumCollectionDatasets.mediaCollectionList.splice(index,1);
			TIMAAT.MediumCollectionDatasets.mediaCollectionList.model.splice(index,1);
			$('#mediumCollectionFormMetadata').data('mediumCollection', null);
			// TIMAAT.UI.selectedMediumCollectionId = null;
			// mediumCollection.remove();
		},

		getMediumCollectionTypeDropDownData: function() {
			$('#mediumCollectionTypeSelectDropdown').select2({
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

		initFormDataSheetData: function(type) {
			$('.dataSheetData').hide();
			$('.mediumCollectionData').show();
			if (type == 'Album' || type == 'Series') {
				$('.mediumCollection'+type+'Data').show();
			}
		},

		initFormDataSheetForEdit: function() {
			// setup form
			$('#mediumCollectionDatasetsMetadataSeriesStarted').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#mediumCollectionDatasetsMetadataSeriesEnded').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('.formButtons').hide();
			$('.formButtons').prop('disabled', true);
			$('.formButtons :input').prop('disabled', true);
			$('#mediumCollectionFormMetadataSubmitButton').show();
      $('#mediumCollectionFormMetadataDismissButton').show();
			$('#mediumCollectionFormMetadata :input').prop('disabled', false);
			$('#mediumCollectionDatasetsMetadataTitle').focus();
		},

		_getProducer: function(video) {
			if ( !video || !video.mediumHasActorWithRoles ) return "-";
			var actors = [];
			video.mediumHasActorWithRoles.forEach(function(role) {
				if ( role.role.id == 5 ) actors.push(role.actor); // 5 == Producer, according to TIMAAT DB definition
			});
			if ( actors.length == 0 ) return "-";
			var producer = "";
			var i = 0;
			for (; i < actors.length; i++) {
				if (producer.length == 0) {
					producer += actors[i].displayName.name;
					if (actors[i].birthName && actors[i].birthName.name != actors[i].displayName.name) {
						producer += " <i>("+ actors[i].birthName.name+")<i>";
					}
				} else {
					producer += ",<br>"+actors[i].displayName.name;
					if (actors[i].birthName && actors[i].birthName.name != actors[i].displayName.name) {
						producer += " <i>("+ actors[i].birthName.name+")<i>";
					}
				}
			}
      // console.log("TCL: producer", producer);
			return producer;
		},

	}

}, window));
