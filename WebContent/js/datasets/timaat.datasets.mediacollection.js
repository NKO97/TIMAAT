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
		mediaCollection: null,
		selectedMediumCollectionId: null,

		init: function() {
			TIMAAT.MediaCollectionDatasets.initMediaCollections();
			$('.media-data-tabs').hide();
			$('.media-datatables').hide();
			// $('.mediacollection-datatable').show();
		},

		initMediaCollections: function() {
			// add medium collection button functionality (in medium collection list - opens datasheet form)
			$('#timaat-mediacollectiondatasets-mediumcollection-add').on('click', function(event) {
				// $('#timaat-mediacollectiondatasets-metadata-form').attr('data-type', 'Collection');
				$('#timaat-mediacollectiondatasets-metadata-form').data('Collection', null);
				TIMAAT.MediaCollectionDatasets.addMediumCollection();
			});

			// delete medium collection button (in form) handler
			$('.mediumcollection-form-delete-button').on('click', function(event) {
				console.log("TCL: delete media collection button pressed");
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediacollectiondatasets-mediumcollection-delete').data('Collection', $('#timaat-mediacollectiondatasets-metadata-form').data('Collection'));
				$('#timaat-mediacollectiondatasets-mediumcollection-delete').modal('show');
			});

			// confirm delete medium collection modal functionality
			$('#timaat-mediacollectiondatasets-modal-delete-submit').on('click', async function(ev) {
				console.log("TCL: delete media collection modal submit pressed");
				var modal = $('#timaat-mediacollectiondatasets-mediumcollection-delete');
				var mediumCollection = modal.data('Collection');
        console.log("TCL: mediumCollection", mediumCollection);
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
				$('#timaat-mediacollectiondatasets-metadata-form').hide();
				$('.mediacollection-data-tabs').hide();
				$('.form').hide();
			});

			// edit content form button handler
			$('.mediumcollection-form-edit-button').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var type = $('#timaat-mediacollectiondatasets-metadata-form').attr('data-type');
				TIMAAT.MediaCollectionDatasets.mediumCollectionFormDataSheet('edit', type, $('#timaat-mediacollectiondatasets-metadata-form').data('Collection'));
				// medium.listView.find('.timaat-mediacollectiondatasets-medium-list-tags').popover('show');
			});

			// medium collection form handlers
			// submit medium collection metadata button functionality
			$('#timaat-mediacollectiondatasets-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-mediacollectiondatasets-metadata-form').valid()) return false;

				var type = $('#timaat-mediacollectiondatasets-metadata-form').attr('data-type');
				// the original medium model (in case of editing an existing medium collection)
				var mediumCollection = $('#timaat-mediacollectiondatasets-metadata-form').data('Collection');				

				// create/edit medium collection window submitted data
				$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', false);
				var formData = $('#timaat-mediacollectiondatasets-metadata-form').serializeArray();
				$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', true);
        console.log("TCL: formData", formData);
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				console.log("TCL: formDataObject", formDataObject);
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
				console.log("TCL: formDataSanitized", formDataSanitized);
				
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
					$('#timaat-mediacollectiondatasets-metadata-form').data('Collection', mediumCollection);
					// $('#media-tab-mediumcollection-metadata-form').trigger('click');
				}
				await TIMAAT.MediaCollectionDatasets.refreshDataTable();
				TIMAAT.MediaCollectionDatasets.selectLastSelection('mediumCollection', mediumCollection.model.id);
				TIMAAT.MediaCollectionDatasets.mediumCollectionFormDataSheet('show', type, mediumCollection);
			});

			// cancel add/edit button in content form functionality
			$('#timaat-mediacollectiondatasets-metadata-form-dismiss').on('click', function(event) {
				var mediumCollection = $('#timaat-mediacollectiondatasets-metadata-form').data('Collection');
				var type = $('#timaat-mediacollectiondatasets-metadata-form').attr('data-type');
				if (mediumCollection != null) {
					TIMAAT.MediaCollectionDatasets.mediumCollectionFormDataSheet('show', type, mediumCollection);
				} else { // dismiss medium creation
					$('.form').hide();
				}
			});

			$('#timaat-mediacollectiondatasets-metadata-type-id').on('change', function(event) {
				event.stopPropagation();
				var type = $('#timaat-mediacollectiondatasets-metadata-type-id').find('option:selected').html();
        console.log("TCL: type", type);
				$('.datasheet-data').hide();
				$('.mediumcollection-data').show();
				if (type == 'Album' || type == 'Series') {
					$('.mediumcollection-'+type+'-data').show();
				}
			});

		},

		load: function() {
			TIMAAT.MediaCollectionDatasets.loadMediaCollections();
		},

		loadMediaCollections: function() {
			$('.media-datatables').hide();
			$('.mediacollection-datatable').show();
      TIMAAT.MediaCollectionDatasets.setMediumCollectionList();
    },
    
    loadMediaCollectionDataTables: async function() {
    	console.log("TCL: loadMediaCollectionDataTables: async function()");
			TIMAAT.MediaCollectionDatasets.setupMediaCollectionListDataTable();
		},

		setMediumCollectionList: function() {
    	console.log("TCL: setMediumCollectionList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaCollectionDatasets.mediaCollectionList == null ) return;
			TIMAAT.MediaCollectionDatasets.clearLastMediumCollectionSelection();
			$('#timaat-mediacollectiondatasets-mediumcollection-list-loader').remove();
			// clear old UI list
			$('#timaat-mediacollectiondatasets-mediumcollection-list').empty();
			
			// set ajax data source
			if ( TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList ) {
				// TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.url('/TIMAAT/api/mediumcollection/list');
				TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList.ajax.reload(null, false);
			}
		},

		addMediumCollection: function() {	
			// console.log("TCL: addMediumCollection: type", type);
			$('.form').hide();
			$('.mediacollection-data-tabs').hide();
			$('.nav-tabs a[href="#mediumCollectionDataSheet"]').show();
			$('#timaat-mediacollectiondatasets-metadata-form').data('Collection', null);
			mediumFormMetadataValidator.resetForm();

			$('#timaat-mediacollectiondatasets-metadata-form').trigger('reset');
			$('#timaat-mediacollectiondatasets-metadata-form').show();
			var type = $('#timaat-mediacollectiondatasets-metadata-type-id').find('option:selected').html();
      console.log("TCL: type", type);
			$('.datasheet-data').hide();
			$('.mediumcollection-data').show();
			if (type == 'Album' || type == 'Series') {
				$('.mediumcollection-'+type+'-data').show();
			}

			$('.mediumcollection-form-edit-button').hide();
			$('.mediumcollection-form-edit-button').prop('disabled', true);
			$('.mediumcollection-form-edit-button :input').prop('disabled', true);
			$('.mediumcollection-form-delete-button').hide();
			$('.mediumcollection-form-delete-button').prop('disabled', true);
			$('.mediumcollection-form-delete-button :input').prop('disabled', true);
			$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', false);
			$('#timaat-mediacollectiondatasets-metadata-type-id :input').prop('disabled', false);
      $('#timaat-mediacollectiondatasets-metadata-form-submit').html('Add');
      $('#timaat-mediacollectiondatasets-metadata-form-submit').show();
      $('#timaat-mediacollectiondatasets-metadata-form-dismiss').show();
			$('#timaat-mediacollectiondatasets-metadata-form :input').prop('disabled', false);
			$('#mediumCollectionFormHeader').html("Add Collection");
			$('#timaat-mediacollectiondatasets-metadata-title').focus();
			// setup form
				$('#timaat-mediacollectiondatasets-metadata-series-started').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-mediacollectiondatasets-metadata-series-ended').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
		},

		mediumCollectionFormDataSheet: async function(action, type, data) {
			console.log("TCL: action, type, modelData", action, type, data);
			TIMAAT.MediaCollectionDatasets.selectLastSelection(data.model.id);
			$('#timaat-mediacollectiondatasets-metadata-form').trigger('reset');
			$('#timaat-mediacollectiondatasets-metadata-form').attr('data-type', type);
			$('.datasheet-data').hide();
			$('.mediumcollection-data').show();
			$('.mediumcollection-'+type+'-data').show();
			mediumFormMetadataValidator.resetForm();

			// show tabs

			$('.nav-tabs a[href="#mediumCollectionDataSheet"]').focus();
			$('#timaat-mediacollectiondatasets-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-mediacollectiondatasets-metadata-form :input').prop('disabled', true);
				$('.mediumcollection-form-edit-button').prop('disabled', false);
				$('.mediumcollection-form-edit-button :input').prop('disabled', false);
				$('.mediumcollection-form-edit-button').show();
				$('.mediumcollection-form-delete-button').prop('disabled', false);
				$('.mediumcollection-form-delete-button :input').prop('disabled', false);
				$('.mediumcollection-form-delete-button').show();
				$('#timaat-mediacollectiondatasets-metadata-form-submit').hide();
				$('#timaat-mediacollectiondatasets-metadata-form-dismiss').hide();
				$('#mediumCollectionFormHeader').html(type+" Datasheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				if (type == 'Series') {
					$('#timaat-mediacollectiondatasets-metadata-series-started').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
					$('#timaat-mediacollectiondatasets-metadata-series-ended').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				}
				$('#timaat-mediacollectiondatasets-metadata-form :input').prop('disabled', false);
				$('#timaat-mediacollectiondatasets-metadata-type-id').prop('disabled', true);
				$('#timaat-mediacollectiondatasets-metadata-type-id :input').prop('disabled', true);
				$('.mediumcollection-form-edit-button').hide();
				$('.mediumcollection-form-edit-button').prop('disabled', true);
				$('.mediumcollection-form-edit-button :input').prop('disabled', true);
				$('.mediumcollection-form-delete-button').hide();
				$('.mediumcollection-form-delete-button').prop('disabled', true);
				$('.mediumcollection-form-delete-button :input').prop('disabled', true);
				$('#timaat-mediacollectiondatasets-metadata-form-submit').html('Save');
				$('#timaat-mediacollectiondatasets-metadata-form-submit').show();
				$('#timaat-mediacollectiondatasets-metadata-form-dismiss').show();
				$('#mediumCollectionFormHeader').html("Edit "+type);
				$('#timaat-mediacollectiondatasets-metadata-title').focus();
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
			$('#timaat-mediacollectiondatasets-metadata-form').data(type, data);
		},

		setupMediumCollectionDataTable: async function(action, collectionData) {
			console.log("TCL: action, collectionData", action, collectionData);
			TIMAAT.MediaCollectionDatasets.selectLastSelection(collectionData.model.id);
			$('#timaat-mediacollectiondatasets-metadata-form').trigger('reset');
			$('.datasheet-data').hide();
			$('.mediumcollection-data').show();
      // mediumFormMetadataValidator.resetForm();
      
      TIMAAT.MediaCollectionDatasets.dataTableMediaCollection = $('#timaat-mediacollectiondatasets-mediacollection-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 2, 'asc' ]],
				"pagingType"    : "simple_numbers",
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : true,
				"rowId"					: 'id',
				"serverSide"		: true,
				"ajax": {
					"url": "api/mediaCollection/"+collectionData.model.id+"/list",
					"contentType": "application/json; charset=utf-8",
					"dataType": "json",
					"data": function(data) {
						let serverData = {
							draw: data.draw,
							start: data.start,
							length: data.length,
							orderby: data.columns[data.order[0].column].name,
							dir: data.order[0].dir,
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;

						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
						// setup model
						var media = Array();
						data.data.forEach(function(medium) { 
							if ( medium.id > 0 ) {
								media.push(new TIMAAT.Medium(medium, 'medium'));
							}
						});
						TIMAAT.MediaCollectionDatasets.mediaCollection = media;
						TIMAAT.MediaCollectionDatasets.mediaCollection.model = data.data;
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));            
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumCollectionElement = $(row);
					let medium = data;
					medium.ui = mediumCollectionElement;
					// TODO refactor
					mediumCollectionElement.data('medium', medium);
					// mediumCollectionElement.find('input:checkbox').prop('checked', false);
					// mediumCollectionElement.find('input:checkbox').change(function() {
					// 	$('#timaat-videochooser-list-action-submit').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);				
					// });

					if ( medium.fileStatus != "noFile" ) TIMAAT.VideoChooser.loadThumbnail(medium);
					TIMAAT.MediaCollectionDatasets.setMediumStatus(medium);
					
					// set up events
					mediumCollectionElement.on('click', '.timaat-medium-thumbnail', function(ev) {
						mediumCollectionElement.find('.timaat-medium-annotate').click();
					});

					mediumCollectionElement.on('click', '.timaat-medium-annotate', function(ev) {
						if ( medium.fileStatus && medium.fileStatus != 'ready' && medium.fileStatus != 'transcoding' && medium.fileStatus != 'waiting' ) return;
//						$('.timaat-medium-card').removeClass('bg-info text-white');
//						$(this).addClass('bg-info text-white');
						TIMAAT.UI.showComponent('videoplayer');

						// setup medium in player
						TIMAAT.VideoPlayer.setupVideo(medium);
						// load medium annotations from server
						TIMAAT.Service.getAnalysisLists(medium.id, TIMAAT.VideoPlayer.setupAnalysisLists);
						// TIMAAT.VideoPlayer.setupAnalysisLists(medium.medium.mediumAnalysisLists);
					});

					mediumCollectionElement.on('click', '.timaat-mediadatasets-media-metadata', async function(event) { // TODO
						console.log("TCL: TODO");
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.MediaCollectionDatasets.initMediaComponent();
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#mediumCollectionDataSheet"]').tab("show");
						var selectedVideo = {}
						selectedVideo.model = medium;
						TIMAAT.MediaDatasets.selectLastSelection(selectedVideo.model.id);
						TIMAAT.MediaDatasets.dataTableMedia.search(selectedVideo.model.displayTitle.name).draw();
						$('#timaat-mediadatasets-metadata-form').data('medium', selectedVideo);
						TIMAAT.MediaDatasets.mediumFormDatasheet('show', 'medium', selectedVideo);
					});

					mediumCollectionElement.on('click', '.timaat-medium-collectionitemremove', function(ev) {
						var row = $(this).parents('tr');
						TIMAAT.VideoChooser._removeCollectionItemRow(row);
					});
					
					mediumCollectionElement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
						if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
						let length = medium.mediumVideo.length;
						if ( length < 0 ) length += 3600;
						let timecode = Math.round((ev.originalEvent.offsetX/254)*length);
						timecode = Math.min(Math.max(0, timecode),length);
						mediumCollectionElement.find('.timaat-medium-thumbnail').attr('src', "/TIMAAT/api/medium/medium/"+medium.id+"/thumbnail"+"?time="+timecode+"&token="+medium.viewToken);
					});
					
					mediumCollectionElement.find('.card-img-top').bind("mouseleave", function(ev) {
						if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
						mediumCollectionElement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/medium/"+medium.id+"/thumbnail"+"?token="+medium.viewToken);
					});
								
					if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
						TIMAAT.VideoChooser.updateVideoStatus(medium);

				},
				"columns": [
					{ data: 'id', className: 'videochooser-item', orderable: false, render: function(data, type, medium, meta) {
						return '<input type="checkbox" aria-label="Checkbox">';
					}, createdCell( cell, cellData, rowData, rowIndex, colIndex ) {
						$(cell).attr('id', 'videochooser-item-'+cellData);
					}
					},
					{ data: null, className: 'videochooser-item-preview', orderable: false, render: function(data, type, medium, meta) {
						let ui = `<div class="timaat-medium-status">
								<i class="fas fa-cog fa-spin"></i>
								</div>
							<img class="card-img-top timaat-medium-thumbnail" src="img/medium-placeholder.png" width="150" height="85" alt="Videovorschau"/>`;
						return ui;
						}
					},
					{ data: 'id', name: 'title', className: 'title', render: function(data, type, medium, meta) {
						// console.log("TCL: medium", medium);
						let titleDisplay = `<p>`+medium.displayTitle.name+`</p>`;
							if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
							}
							// TODO not working anymore due to server side datatable data search
							medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
								if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
									titleDisplay += `<div style="display:none">`+title.name+`</div>`;
								}
							});
							return titleDisplay;
						}
					},
					{ data: 'mediumVideo.length', name: 'duration', className: 'duration' , render: function(data, type, row, meta) {
							return TIMAAT.Util.formatTime(data);
						}
					},
					{ data: 'mediumHasActorWithRoles', name: 'producer', className: 'producer', orderable: false, render: function(data, type, medium, meta) {
							return TIMAAT.VideoChooser._getProducer(medium);
						}
					},
					{ data: 'releaseDate', name: 'releaseDate', className: 'date', render: function(data, type, medium, meta) {
							return moment.utc(data).format('YYYY-MM-DD');
						}
					},
					{ data: null, className: 'actions', orderable: false, render: function(data, type, medium, meta) {
						let ui = `<div>
							<form action="/TIMAAT/api/medium/medium/`+medium.id+`/upload" method="post" enctype="multipart/form-data">
								<input name="file" accept=".mp4" class="timaat-medium-upload-file d-none" type="file" />
								<button type="submit" title="Videodatei hochladen" class="btn btn-outline-primary btn-sm btn-block timaat-medium-upload"><i class="fas fa-upload"></i></button>
							</form>
							<button type="button" title="Video annotieren" class="btn btn-outline-success btn-sm btn-block timaat-medium-annotate"><i class="fas fa-draw-polygon"></i></button>
							<button type="button" title="Datenblatt editieren" class="btn btn-outline-secondary btn-outline-secondary btn-sm btn-block timaat-mediadatasets-media-metadata"><i class="fas fa-file-alt"></i></button>`;
						if ( TIMAAT.VideoChooser.collection ) ui += `<button type="button" title="Aus Mediensammlung entfernen"class="btn btn-outline-secondary btn-sm btn-block timaat-medium-collectionitemremove"><i class="fas fa-folder-minus"></i></button>`;
						ui += '</div>';
							return ui;
						},
					}				
				],
				"language": {
					"decimal": ",",
					"thousands": ".",
					"search": "Suche",
					"lengthMenu": "Zeige _MENU_ Videos pro Seite",
					"zeroRecords": "Keine Videos gefunden.",
					"info": "Seite _PAGE_ von _PAGES_ &middot; (_MAX_ Videos gesamt)",
					"infoEmpty": "Keine Videos verf&uuml;gbar.",
                    "infoFiltered": " &mdash; _TOTAL_ von _MAX_ Videos angezeigt",
                    "paginate": {
						"first":      "Erste",
						"previous":   "Vorherige",
						"next":       "N&auml;chste",
						"last":       "Letzte"
					},
				},				
			});	

			// $('.nav-tabs a[href="#mediumCollectionDataSheet"]').focus(); // TODO proper id
			// $('#timaat-mediacollectiondatasets-metadata-form').show();

			// if ( action == 'show') {
			// 	$('#timaat-mediacollectiondatasets-metadata-form :input').prop('disabled', true);
			// 	$('.datasheet-form-edit-button').prop('disabled', false);
			// 	$('.datasheet-form-edit-button :input').prop('disabled', false);
			// 	$('.datasheet-form-edit-button').show();
			// 	$('.datasheet-form-delete-button').prop('disabled', false);
			// 	$('.datasheet-form-delete-button :input').prop('disabled', false);
			// 	$('.datasheet-form-delete-button').show();
			// 	$('#timaat-mediacollectiondatasets-metadata-form-submit').hide();
			// 	$('#timaat-mediacollectiondatasets-metadata-form-dismiss').hide();
			// 	$('#mediumFormHeader').html("Media Collection Datasheet (#"+ collectionData.model.id+')');
			// }
			// else if (action == 'edit') {
			// 	$('#timaat-mediacollectiondatasets-metadata-form :input').prop('disabled', false);
			// 	$('.datasheet-form-edit-button').hide();
			// 	$('.datasheet-form-edit-button').prop('disabled', true);
			// 	$('.datasheet-form-edit-button :input').prop('disabled', true);
			// 	$('.datasheet-form-upload-button').hide();
			// 	$('.datasheet-form-upload-button').prop('disabled', true);
			// 	$('.datasheet-form-annotate-button').hide();
			// 	$('.datasheet-form-annotate-button').prop('disabled', true);
			// 	$('.datasheet-form-delete-button').hide();
			// 	$('.datasheet-form-delete-button').prop('disabled', true);
			// 	$('.datasheet-form-delete-button :input').prop('disabled', true);
			// 	$('#timaat-mediacollectiondatasets-metadata-form-submit').html('Save');
			// 	$('#timaat-mediacollectiondatasets-metadata-form-submit').show();
			// 	$('#timaat-mediacollectiondatasets-metadata-form-dismiss').show();
			// 	$('#mediumFormHeader').html("Edit Collection");
			// 	$('#timaat-mediacollectiondatasets-metadata-medium-title').focus();
			// }

			// setup UI
			// $('#timaat-mediacollectiondatasets-metadata-form').data(mediumType, mediumTypeData);
		},

		setupMediaCollectionListDataTable: function() {			
			console.log("TCL: setupMediaCollectionListDataTable");
			// setup datatable
			TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList = $('#timaat-mediacollectiondatasets-mediacollection-list-table').DataTable({
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
						TIMAAT.MediaCollectionDatasets.clearLastMediumCollectionSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: Media dataTable -  createdRow");
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumCollectionElement = $(row);
					let mediumCollection = data;
					mediumCollection.ui = mediumCollectionElement;
					mediumCollectionElement.data('Collection', mediumCollection);
					// TIMAAT.MediaCollectionDatasets.displayFileStatus(medium);

					mediumCollectionElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						// $('#timaat-mediacollectiondatasets-media-tabs-container').append($('#timaat-mediacollectiondatasets-media-tabs'));
						// $('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						TIMAAT.MediaCollectionDatasets.clearLastMediumCollectionSelection();
						var selectedMediumCollection;
						var i = 0;
						for (; i < TIMAAT.MediaCollectionDatasets.mediaCollectionList.length; i++) {
							if (TIMAAT.MediaCollectionDatasets.mediaCollectionList[i].model.id == mediumCollection.id) {
								selectedMediumCollection = TIMAAT.MediaCollectionDatasets.mediaCollectionList[i];
								break;
							}
						}
						TIMAAT.MediaCollectionDatasets.selectLastSelection(mediumCollection.id);

						console.log("TCL: selectedMediumCollection", selectedMediumCollection);
						$('#timaat-mediacollectiondatasets-metadata-form').data('Collection', selectedMediumCollection);
						var type = selectedMediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
						// if (TIMAAT.MediaCollectionDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#mediumCollectionDataSheet"]').tab('show');
							TIMAAT.MediaCollectionDatasets.mediumCollectionFormDataSheet('show', type, selectedMediumCollection);
						// } else {
							// show tabs
							// $('.preview-data-tab').show();
							// $('.mediacollection-data-tab').show();
							// $('.title-data-tab').show();
							// $('.languagetrack-data-tab').show();
							// $('.mediumactorwithrole-data-tab').show();
							// $('.nav-tabs a[href="#'+TIMAAT.MediaCollectionDatasets.subNavTab+'"]').tab('show');
							// TIMAAT.MediaCollectionDatasets.showLastForm();
						// }
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
			return (newModel);
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
		
		selectLastSelection: function(id) {
      if (TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId && TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId != id) {
        $(TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList.row('#'+TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId).node()).removeClass('selected');
      }
			$(TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList.row('#'+id).node()).addClass('selected');
			TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId = id;
		},

		clearLastMediumCollectionSelection: function () {
			// $(TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList.row('#'+TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId).node()).removeClass('selected');
			let i = 0;
			for (; i < TIMAAT.MediaCollectionDatasets.mediaCollectionList.length; i++) {
				$(TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList.row('#'+TIMAAT.MediaCollectionDatasets.mediaCollectionList[i].model.id).node()).removeClass('selected');
			}
			TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId = null;
		},

		refreshDataTable: async function() {
			// console.log("TCL: refreshDataTable";
			// set ajax data source
      if (TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList) {
        // TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
        TIMAAT.MediaCollectionDatasets.dataTableMediaCollectionList.ajax.reload(null, false);
      }
		},

	}
	
}, window));
