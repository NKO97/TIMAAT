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
		mediaCollection: null,
		selectedMediumCollectionId: null,

		init: function() {
			TIMAAT.MediaCollectionDatasets.initMediaCollections();
			$('.media-data-tabs').hide();
			$('.media-datatables').hide();
			// $('.mediacollection-datatable').show();
		},

		initMediaCollections: function() {

		},

		load: function() {
			TIMAAT.MediaCollectionDatasets.loadMediaCollections();
		},

		loadMediaCollections: function() {
			$('.media-datatables').hide();
			$('.mediacollection-datatable').show();
      TIMAAT.MediaCollectionDatasets.clearLastMediumCollectionSelection();
      TIMAAT.MediaCollectionDatasets.setMediumCollectionList();
    },
    
    loadMediaCollectionDataTables: async function() {
    	console.log("TCL: loadMediaCollectionDataTables: async function()");
			TIMAAT.MediaCollectionDatasets.setupMediaCollectionDataTable();
		},

		setMediumCollectionList: function() {
    	console.log("TCL: setMediumCollectionList");
			$('.form').hide();
			$('.media-data-tabs').hide();
			if ( TIMAAT.MediaCollectionDatasets.mediaCollection == null ) return;
			
			$('#timaat-mediacollectiondatasets-mediumcollection-list-loader').remove();
			// clear old UI list
			$('#timaat-mediacollectiondatasets-mediumcollection-list').empty();
			
			// set ajax data source
			if ( TIMAAT.MediaCollectionDatasets.dataTableMediaCollection ) {
				// TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.url('/TIMAAT/api/mediumcollection/list');
				TIMAAT.MediaCollectionDatasets.dataTableMediaCollection.ajax.reload(null, false);
			}
		},

		mediumCollectionDataSheet: async function(action, collectionData) {
			console.log("TCL: action, collectionData", action, collectionData);
			TIMAAT.MediaCollectionDatasets.selectLastSelection('mediumCollection', collectionData.model.id);
			$('#timaat-mediacollectiondatasets-metadata-form').trigger('reset');
			$('.datasheet-data').hide();
			$('.mediumcollection-data').show();
			mediumFormMetadataValidator.resetForm();

			$('.nav-tabs a[href="#MediumCollectionDatasheet"]').focus(); // TODO proper id
			$('#timaat-mediacollectiondatasets-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-mediacollectiondatasets-metadata-form :input').prop('disabled', true);
				$('.datasheet-form-edit-button').prop('disabled', false);
				$('.datasheet-form-edit-button :input').prop('disabled', false);
				$('.datasheet-form-edit-button').show();
				$('.datasheet-form-delete-button').prop('disabled', false);
				$('.datasheet-form-delete-button :input').prop('disabled', false);
				$('.datasheet-form-delete-button').show();
				$('#timaat-mediacollectiondatasets-metadata-form-submit').hide();
				$('#timaat-mediacollectiondatasets-metadata-form-dismiss').hide();
				$('#mediumFormHeader').html("Media Collection Datasheet (#"+ collectionData.model.id+')');
			}
			else if (action == 'edit') {
				$('#timaat-mediacollectiondatasets-metadata-form :input').prop('disabled', false);
				$('.datasheet-form-edit-button').hide();
				$('.datasheet-form-edit-button').prop('disabled', true);
				$('.datasheet-form-edit-button :input').prop('disabled', true);
				$('.datasheet-form-upload-button').hide();
				$('.datasheet-form-upload-button').prop('disabled', true);
				$('.datasheet-form-annotate-button').hide();
				$('.datasheet-form-annotate-button').prop('disabled', true);
				$('.datasheet-form-delete-button').hide();
				$('.datasheet-form-delete-button').prop('disabled', true);
				$('.datasheet-form-delete-button :input').prop('disabled', true);
				$('#timaat-mediacollectiondatasets-metadata-form-submit').html('Save');
				$('#timaat-mediacollectiondatasets-metadata-form-submit').show();
				$('#timaat-mediacollectiondatasets-metadata-form-dismiss').show();
				$('#mediumFormHeader').html("Edit Collection");
				$('#timaat-mediacollectiondatasets-metadata-medium-title').focus();
			}

			// setup UI
			// $('#timaat-mediacollectiondatasets-metadata-form').data(mediumType, mediumTypeData);
		},

		setupMediaCollectionDataTable: function() {			
			console.log("TCL: setupMediaCollectionDataTable");
			// setup datatable
			TIMAAT.MediaCollectionDatasets.dataTableMediaCollection = $('#timaat-mediacollectiondatasets-mediacollection-table').DataTable({
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
          	console.log("TCL: data", data);
						// setup model
						var mediaCollections = Array();
						data.data.forEach(function(mediumCollection) { 
							if ( mediumCollection.id > 0 ) {
								mediaCollections.push(new TIMAAT.MediumCollection(mediumCollection));
							}
						});
						TIMAAT.MediaCollectionDatasets.mediaCollection = mediaCollections;
						TIMAAT.MediaCollectionDatasets.mediaCollection.model = data.data;
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.MediaCollectionDatasets.selectedMediumId) {
						TIMAAT.MediaCollectionDatasets.clearLastMediumSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: Media dataTable -  createdRow");
        	console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumCollectionElement = $(row);
					let mediumCollection = data;
					mediumCollection.ui = mediumCollectionElement;
					mediumCollectionElement.data('mediumCollection', mediumCollection);
					// TIMAAT.MediaCollectionDatasets.displayFileStatus(medium);

					mediumCollectionElement.on('click', '.title', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('#timaat-mediacollectiondatasets-media-tabs-container').append($('#timaat-mediacollectiondatasets-media-tabs'));
						$('#previewTab').removeClass('annotationView');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						var selectedMediumCollection;
						var i = 0;
						for (; i < TIMAAT.MediaCollectionDatasets.mediaCollection.length; i++) {
							if (TIMAAT.MediaCollectionDatasets.mediaCollection[i].model.id == mediumCollection.id) {
								selectedMediumCollection = TIMAAT.MediaCollectionDatasets.mediaCollection[i];
								break;
							}
						}
						TIMAAT.MediaCollectionDatasets.selectLastSelection('mediumCollection', mediumCollection.id);

						$('#timaat-mediacollectiondatasets-metadata-form').data('mediumCollection', selectedMediumCollection);
						// var type = selectedMediumCollection.model.mediaType.mediaTypeTranslations[0].type;
						// if (TIMAAT.MediaCollectionDatasets.subNavTab == 'datasheet') {
							$('.nav-tabs a[href="#mediumCollectionDatasheet"]').tab('show');
							TIMAAT.MediaCollectionDatasets.mediumCollectionDataSheet('show', selectedMediumCollection);
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

					// if ( medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
					// 	medium.fileStatus = TIMAAT.MediaService.updateFileStatus(medium, medium.mediaType.mediaTypeTranslations[0].type);
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

		selectLastSelection: function(id) {
			// console.log("TCL: selectLastSelection: type, id", type, id);
			// console.log("TCL: TIMAAT.MediaCollectionDatasets.selectedMediumId", TIMAAT.MediaCollectionDatasets.selectedMediumId);
      if (TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId && TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId != id) {
        $(TIMAAT.MediaCollectionDatasets.dataTableMediaCollection.row('#'+TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId).node()).removeClass('selected');
      }
      $(TIMAAT.MediaCollectionDatasets.dataTableMediaCollection.row('#'+id).node()).addClass('selected');
		},

		clearLastMediumCollectionSelection: function () {
			$(TIMAAT.MediaCollectionDatasets.dataTableMediaCollection.row('#'+TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId).node()).removeClass('selected');
			TIMAAT.MediaCollectionDatasets.selectedMediumCollectionId = null;
		},

		refreshDatatable: async function() {
			// console.log("TCL: refreshDatatable - type: ", type);
			// set ajax data source
      if (TIMAAT.MediaCollectionDatasets.dataTableMediaCollection) {
        // TIMAAT.MediaCollectionDatasets.dataTableMedia.ajax.url('/TIMAAT/api/medium/list');
        TIMAAT.MediaCollectionDatasets.dataTableMediaCollection.ajax.reload(null, false);
      }
		},

	}
	
}, window));
