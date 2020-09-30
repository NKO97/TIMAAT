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

  TIMAAT.AnalysisDatasets = {

    init: function() {
      TIMAAT.AnalysisDatasets.initAnalysis();
    },

    initAnalysis: function() {
      $('#timaat-analysis-add-submit').on('click', async function(event) {
        event.preventDefault();
        var modal = $('#timaat-videoplayer-analysis-add');
        var analysisMethodTypeId = modal.data('analysisMethodTypeId'); 
        var annotationId = modal.data('annotationId');

        switch(analysisMethodTypeId) {
          case 7:
            let analysisMethodId = Number($('#color-temperature-select-dropdown').val());
            let remark = $('#analysis-remark').val();
            let analysisModel = {
              id: 0,
              annotationId: annotationId,
              analysisMethodId: analysisMethodId,
              preproduction: "",
              remark: remark
            }; 
            await TIMAAT.AnalysisService.addStaticAnalysisMethodToAnalysis(analysisModel);
          break;
        }
        modal.modal('hide');
        console.log("TCL: reload dataTableAnnoAnalysis");
        TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
        console.log("TCL: TIMAAT.VideoPlayer.curAnnotation", TIMAAT.VideoPlayer.curAnnotation);
      });

      $('#timaat-analysis-delete-submit').on('click', async function(event) {
        event.preventDefault();
        var modal = $('#timaat-videoplayer-analysis-delete');
        // var analysisMethodTypeId = modal.data('analysisMethodTypeId'); 
        var analysisId = modal.data('analysisId');
        var isStatic = modal.data('isStatic');
        if (isStatic) {
          console.log("TCL: isStatic", isStatic);
          await TIMAAT.AnalysisService.removeStaticAnalysis(analysisId);
        } else {
          // delete analysis
          // delete analysismethod
          // delete analysismethod variant data
        }
        modal.modal('hide');
        TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
      });

      // Add event listener for opening and closing details
      $('#analysis-annotation-table tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.row(tr);
        var tdi = tr.find("i.fa");

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
            tdi.first().removeClass('fa-minus-square');
            tdi.first().addClass('fa-plus-square');
        }
        else {
            // Open this row
            row.child( TIMAAT.AnalysisDatasets.displayAnalysisDetails(row.data()) ).show();
            tr.addClass('shown');
            tdi.first().removeClass('fa-plus-square');
            tdi.first().addClass('fa-minus-square');
        }
      });
      
      // event listener to show tooltip for expand/collapse details
      $('#analysis-annotation-table').on('mouseenter', 'tbody tr', function () {
        var tr = $(this).closest('tr');
        var row = TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.row(tr);
        var tdi = tr.find("i.fa");
        if (row.child.isShown()) {
          $('td:first-child').attr('title', 'collapse');
        }
        else if (tdi.length > 0) {
          $('td:first-child').attr('title', 'expand');
        } 
        else {
          $('td:first-child').attr('title', null);
        }
      });
    },

    loadAnalysisDataTables: async function() {
      console.log("TCL: loadAnalysisDataTables: async function()");
      TIMAAT.AnalysisDatasets.setupAnalysisMethodsDataTable();
      TIMAAT.AnalysisDatasets.setupAnnotationAnalysisDataTable();
    },

    annotationAnalysisMethodAddModal: function(annotationId, analysisMethodType) {
      console.log("TCL: annotationId, analysisMethodType", annotationId, analysisMethodType);
      let modal = $('#timaat-videoplayer-analysis-add');
      modal.data('analysisMethodTypeId', analysisMethodType.id);
      modal.data('annotationId', annotationId);
      switch (analysisMethodType.id) {
        case 1: // Martinez Scheffel Unreliable Narration
          
        break;
        case 2: // Greimas Actantial Model

        break;
        case 3: // Van Sijll Cinematic Storytelling

        break;
        case 4: // Lohtman Renner Spacial Semantics

        break;
        case 5: // Genette Narrative Discourse

        break;
        case 6: // Stanzel Narrative Situations

        break;
        case 7: //* Color Temperature
          $('#analysisAddLabel').text('Choose color temperature');
          modal.find('.modal-body').html(`
            <div class="row">
              <label class="sr-only">Color temperature</label>
              <select class="form-control form-control-md"
                      style="width:100%;"
                      id="color-temperature-select-dropdown"
                      name="analysisMethodId"
                      data-role="analysisMethodId"
                      data-placeholder="Select color temperature"
                      required>
              </select>
            </div>
            <div class="row">
              <label class"sr-only">Remark</label>
              <textarea class="form-control form-control-sm"
                        id="analysis-remark"
                        aria-label="Remark"
                        placeholder="Remark"></textarea>
            </div>`);
          $('#color-temperature-select-dropdown').select2({
            closeOnSelect: true,
            scrollAfterSelect: true,
            allowClear: true,
            minimumResultsForSearch: 10,
            ajax: {
              url: 'api/analysis/method/'+analysisMethodType.id+'/selectList/',
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
            // minimumInputLength: 0,
          });
          $('#color-temperature-select-dropdown').on('change', function(){
            var text = $(this).find('option:selected').text()
            var $aux = $('<select/>').append($('<option/>').text(text))
            $(this).after($aux)
            $(this).width($aux.width())
            $aux.remove()
          }).change();
          modal.modal('show');
        break;
        case 8: // Concept Camera Movement and Direction

        break;
        case 9: // Camera Elevation

        break;
        case 10: // Camera Axis of Action

        break;
        case 11: // Camera Horizontal Angle
          
        break;
        case 12: //* Camera Vertical Angle

        break;
        case 13: //* Camera Shot Type

        break;
        case 14: // Camera Distance

        break;
        case 15: // Concept Camera Movement and Handling

        break;
        case 16: // Camera Movement

        break;
        case 17: // Camera Handling

        break;
        case 18: // Zelizer Beese Voice of the Visual

        break;
        case 19: // Barthes Rhetoric of the Image

        break;
        case 20: //* Sound Effect Descriptive

        break;
        case 21: // Analysis Ambient Sound
          
        break;
        case 22: // Analysis Music

        break;
        case 23: // Analysis Speech

        break;
        case 24: // Analysis Voice

        break;
        case 25: //? Lighting type

        break;
      }
      // if (analysisMethodType.isStatic) { // simple assignment of existing analysisMethod to analysis (analysis method information pre-exists)

      // }
      // else { // a new analysisMethod of that type has to be created since the data is dynamically created

      // }
    },

    annotationAnalysisMethodDeleteModal: function(analysis) {
      console.log("TCL: analysis", analysis);
      let modal = $('#timaat-videoplayer-analysis-delete');
      modal.data('analysisId', analysis.id);
      modal.data('isStatic', analysis.analysisMethod.analysisMethodType.isStatic);
      modal.modal('show');
    },

    displayAnalysisDetails: function( data ) {
      console.log("TCL: displayAnalysisDetails -> data", data);
      var details = 
        `<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">`;
      switch (data.analysisMethod.analysisMethodType.id) {
        case 7:
          details +=
            `<tr>
              <td>Color temperature:</td>
              <td>`+data.analysisMethod.colorTemperature.colorTemperatureTranslations[0].name+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
      }
      details += `</table>`;
      return details;
    },

    setupAnalysisMethodsDataTable: function() {
      TIMAAT.AnalysisDatasets.dataTableAnalysisMethods = $('#analysis-methods-available-table').DataTable({
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
					"url"        : "api/analysis/method/list",
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
						// if ( inspector.state.item && inspector.state.type == 'annotation' )
						// 	serverData.exclude_annotation = inspector.state.item.model.id;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) { return data.data; }
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: Inspector -> constructor -> data", data);
					let analysisMethodTypeElement = $(row);
					let analysisMethodType = data;
					analysisMethodTypeElement.data('analysisMethodType', analysisMethodType);

					analysisMethodTypeElement.find('.add-analysisMethod').on('click', analysisMethodType, async function(ev) {
          	// console.log("TCL: Inspector -> constructor -> analysisMethodType", analysisMethodType);
						ev.stopPropagation();
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						// $(this).remove();
						TIMAAT.AnalysisDatasets.annotationAnalysisMethodAddModal(TIMAAT.VideoPlayer.curAnnotation.model.id, analysisMethodType);
						// .then((result)=>{
						// 	// inspector.ui.dataTableAnalysisMethods.ajax.reload();
							// TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
						// }).catch((error)=>{
						// 	console.log("ERROR:", error);
						// });
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, analysisMethodType, meta) {
						// console.log("TCL: analysisMethodType", analysisMethodType);
						// let displayAnalysisTypeIcon = '';
						// switch (analysis.analysisMethodType.analysisMethodTypeTranslations[0].name) {
						// 	case 'person': 
						// 		displayAnalysisTypeIcon = '<i class="far fa-address-card"></i>';
						// 	break;
						// 	case 'collective': 
						// 		displayAnalysisTypeIcon = '<i class="fas fa-users"></i>';
						// 	break;
						// }
						// let nameDisplay = `<p>` + displayAnalysisTypeIcon + `  ` + analysis.analysisMethodType.analysisMethodTypeTranslations[0].name +`
						let nameDisplay = `<p>` + `  ` + analysisMethodType.analysisMethodTypeTranslations[0].name +`
								<span class="add-analysisMethod badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw"></i></span>
							</p>`;
						return nameDisplay;
					}
				}],
				language: {
          "decimal"          : ",",
          "thousands"        : ".",
          "search"           : "Search",
          "searchPlaceholder": "Search analysis methods",
          "processing"       : '<i class="fas fa-spinner fa-spin"></i> Loading Data...',
          "lengthMenu"       : "Show _MENU_ entries",
          "zeroRecords"      : "No analysis methods found.",
          "info"             : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ analysis methods total)",
          "infoEmpty"        : "No analysis methods available.",
          "infoFiltered"     : '(&mdash; _TOTAL_ of _MAX_ analysis methods)',
          "paginate"         : {
            "first"   : "<<",
            "previous": "<",
            "next"    : ">",
            "last"    : ">>"
          },
        },
			});
			// $(this.ui.dataTableAnalysisMethod.table().container()).find('.table-title').text('Verfügbare Analysen');
    },

    setupAnnotationAnalysisDataTable: function() {
			TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis = $('#analysis-annotation-table').DataTable({
				lengthChange: false,
				pageLength  : 10,
				dom         : 'rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				searching   : false,
				deferLoading: 0,
				order       : [[ 1, 'asc' ]],
				processing  : true,
				serverSide  : true,
				ajax        : {
					"url"        : "api/annotation/0/analysis",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							as_datatable: true,
						}
						// if ( data.search && data.search.value && data.search.value.length > 0 ) serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token); },
					"dataSrc": function(data) { return data.data; }
				},
				"createdRow": function(row, data, dataIndex) {
					let analysisElement = $(row);
					let analysis = data;
					analysisElement.data('analysis', analysis);

					analysisElement.find('.remove-analysis').on('click', analysis, async function(ev) {
						ev.stopPropagation();
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						// $(this).remove();
						TIMAAT.AnalysisDatasets.annotationAnalysisMethodDeleteModal(analysis);
						// TIMAAT.AnalysisService.removeAnnotationAnalysis(TIMAAT.VideoPlayer.curAnnotation.model.id, analysis.id)
						// .then((result)=>{
							// inspector.ui.dataTableAnalysisMethods.ajax.reload();
							// TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
						// }).catch((error)=>{
						// 	console.log("ERROR:", error);
						// });
					});
				},
				"columns": [
					{
						"className":      'details-control',
						"orderable":      false,
						"data":           null,
						"defaultContent": '',
						"render": function () {
							return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
						},
						// width:"15px"
					},
					{	data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, analysis, meta) {
							// console.log("TCL: analysis", analysis);
							// let displayAnalysisTypeIcon = '';
							// switch (analysis.analysisMethodType.analysisMethodTypeTranslations[0].name) {
							// 	case 'person': 
							// 		displayAnalysisTypeIcon = '<i class="far fa-address-card"></i>';
							// 	break;
							// 	case 'collective': 
							// 		displayAnalysisTypeIcon = '<i class="fas fa-users"></i>';
							// 	break;
							// }
							// let nameDisplay = `<p>` + displayAnalysisTypeIcon + `  ` + analysis.analysisMethodType.analysisMethodTypeTranslations[0].name+`
							let nameDisplay = `<p>` + `  ` + analysis.analysisMethod.analysisMethodType.analysisMethodTypeTranslations[0].name +`
							<span class="remove-analysis badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw"></i></span>
							</p>`;
							return nameDisplay;
						}
					}
				],
				language: {
          "decimal"          : ",",
          "thousands"        : ".",
          "search"           : "Search",
          "searchPlaceholder": "Search analysis methods",
          "processing"       : '<i class="fas fa-spinner fa-spin"></i> Loading Data...',
          "lengthMenu"       : "Show _MENU_ entries",
          "zeroRecords"      : "No analysis methods found.",
          "info"             : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ analysis methods total)",
          "infoEmpty"        : "No analysis methods available.",
          "infoFiltered"     : '(&mdash; _TOTAL_ of _MAX_ analysis methods)',
          "paginate"         : {
            "first"   : "<<",
            "previous": "<",
            "next"    : ">",
            "last"    : ">>"
          },
        },
			});
    },

  }

}, window));