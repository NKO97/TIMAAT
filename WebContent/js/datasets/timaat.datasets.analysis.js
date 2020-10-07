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
        if (!$('#newAnalysisMethodModalForm').valid()) 
					return false;
        var analysisMethodTypeId = modal.data('analysisMethodTypeId'); 
        var annotationId = modal.data('annotationId');
        let remark = $('#analysis-remark').val();
        let analysisModel = {
          id: 0,
          annotation: {
            id: annotationId
          },
          analysisMethod: {
            id: 0,
            analysisMethodType: {
              id: analysisMethodTypeId,
            },
            cameraAxisOfAction: null,
            cameraDistance: null,
            cameraElevation: null,
            cameraHandling: null,
            cameraHorizontalAngle: null,
            cameraShotType: null,
            cameraVerticalAngle: null,
            colorTemperature: null,
            soundEffectDescriptive: null,
            zelizerBeeseVoiceOfTheVisual: null
          },
          preproduction: "",
          remark: remark
        }; 
        var analysisMethodId;
        var analysisMethodVariantModel = {};
        var analysis;

        switch(analysisMethodTypeId) {
          case 1: // Martinez Scheffel Unreliable Narration
            analysisMethodId = Number($('#martinez-scheffel-unreliable-narration-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
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
          case 7: // Color Temperature
            analysisMethodId = Number($('#color-temperature-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 8: // Concept Camera Movement and Direction

          break;
          case 9: // Camera Elevation
            analysisMethodId = Number($('#camera-elevation-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
            case 10: // Camera Axis of Action
            analysisMethodId = Number($('#camera-axis-of-action-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 11: // Camera Horizontal Angle
            analysisMethodId = Number($('#camera-horizontal-angle-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 12: // Camera Vertical Angle
            analysisMethodId = Number($('#camera-vertical-angle-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 13: // Camera Shot Type
            analysisMethodId = Number($('#camera-shot-type-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 14: // Camera Distance
            analysisMethodId = Number($('#camera-distance-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 15: // Concept Camera Movement and Handling

          break;
          case 16: // Camera Movement

          break;
          case 17: // Camera Handling
            analysisMethodId = Number($('#camera-handling-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 18: // Zelizer Beese Voice of the Visual
            analysisMethodId = Number($('#zelizer-beese-voice-of-the-visual-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 19: // Barthes Rhetoric of the Image

          break;
          case 20: // Sound Effect Descriptive
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              answerQ1: $('#sound-effect-descriptive-answer-q1').val(),
              answerQ2: $('#sound-effect-descriptive-answer-q2').val(),
              answerQ3: $('#sound-effect-descriptive-answer-q3').val(),
              answerQ4: $('#sound-effect-descriptive-answer-q4').val(),
              answerQ5: $('#sound-effect-descriptive-answer-q5').val(),
              answerQ6: $('#sound-effect-descriptive-answer-q6').val()
            };
            // analysisModel.analysisMethod.soundEffectDescriptive = analysisMethodVariantModel;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            console.log("TCL: analysis", analysis);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysisMethodVariantModel = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "soundEffectDescriptive");
            analysis.analysisMethod.soundEffectDescriptive = analysisMethodVariantModel;
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
        modal.modal('hide');
        TIMAAT.VideoPlayer.curAnnotation.model.analysis.push(analysis);
        TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload(null, false);
        TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload(null, false);
        console.log("TCL: TIMAAT.VideoPlayer.curAnnotation", TIMAAT.VideoPlayer.curAnnotation);
      });

      $('#timaat-analysis-delete-submit').on('click', async function(event) {
        event.preventDefault();
        var modal = $('#timaat-videoplayer-analysis-delete');
        var analysisId = modal.data('analysisId');
        var analysisMethodId = modal.data('analysisMethodId');
        var isStatic = modal.data('isStatic');
        if (isStatic) {
          // console.log("TCL: isStatic", isStatic);
          await TIMAAT.AnalysisService.removeStaticAnalysis(analysisId);
        } else {
          await TIMAAT.AnalysisService.removeDynamicAnalysis(analysisMethodId);
        }
        modal.modal('hide');
        var i = 0;
        for (; i < TIMAAT.VideoPlayer.curAnnotation.model.analysis.length; i++) {
          if (TIMAAT.VideoPlayer.curAnnotation.model.analysis[i].id == analysisId) {
            TIMAAT.VideoPlayer.curAnnotation.model.analysis.splice(i, 1);
          }
        }
        TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload(null, false);
        TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload(null, false);
      });

      $('.select-dropdown').on('change', function(){
        var text = $(this).find('option:selected').text()
        var $aux = $('<select/>').append($('<option/>').text(text))
        $(this).after($aux)
        $(this).width($aux.width())
        $aux.remove()
      }).change();

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
      var select2Options = {
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
          cache: true
        },
      };
      var remarkHtml = `<div class="form-group">
                          <label for="analysis-remark">Remark</label>
                          <div class="col-md-11">
                            <textarea class="form-control form-control-sm"
                                      id="analysis-remark"
                                      aria-label="Remark"
                                      placeholder="Remark"></textarea>
                          </div>
                        </div>`;

      switch (analysisMethodType.id) {
        case 1: // Martinez Scheffel Unreliable Narration
          $('#analysisAddLabel').text('Choose unreliable Narration (Martinez & Scheffel)');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="martinez-scheffel-unreliable-narration-select-dropdown">Unreliable Narration</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="martinez-scheffel-unreliable-narration-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select unreliable narration"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#martinez-scheffel-unreliable-narration-select-dropdown').select2(select2Options);
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
        case 7: // Color Temperature
          $('#analysisAddLabel').text('Choose color temperature');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="color-temperature-select-dropdown">Color temperature</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="color-temperature-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select color temperature"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#color-temperature-select-dropdown').select2(select2Options);
        break;
        case 8: // Concept Camera Movement and Direction

        break;
        case 9: // Camera Elevation
          $('#analysisAddLabel').text('Choose camera elevation');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="camera-elevation-select-dropdown">Camera elevation</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="camera-elevation-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera elevation"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#camera-elevation-select-dropdown').select2(select2Options);
        break;
        case 10: // Camera Axis of Action
        $('#analysisAddLabel').text('Choose axis of action');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
              <label for="camera-axis-of-action-select-dropdown">Camera axis of action</label>
              <div class="col-md-11">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-axis-of-action-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action"
                        required>
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
        $('#camera-axis-of-action-select-dropdown').select2(select2Options);
        break;
        case 11: // Camera Horizontal Angle
        $('#analysisAddLabel').text('Choose camera horizontal angle');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
            <label for="camera-horizontal-angle-select-dropdown">Camera horizontal angle</label>
              <div class="col-md-11">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-horizontal-angle-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle"
                        required>
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
        $('#camera-horizontal-angle-select-dropdown').select2(select2Options);
        break;
        case 12: // Camera Vertical Angle
          $('#analysisAddLabel').text('Choose camera vertical angle');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="camera-vertical-angle-select-dropdown">Camera vertical angle</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="camera-vertical-angle-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera vertical angle"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#camera-vertical-angle-select-dropdown').select2(select2Options);
        break;
        case 13: // Camera Shot Type
          $('#analysisAddLabel').text('Choose camera shot type');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="camera-shot-type-select-dropdown">Camera shot type</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="camera-shot-type-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera shot type"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#camera-shot-type-select-dropdown').select2(select2Options);
        break;
        case 14: // Camera Distance
          $('#analysisAddLabel').text('Choose camera distance');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="camera-distance-select-dropdown">Camera distance</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="camera-distance-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera distance"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#camera-distance-select-dropdown').select2(select2Options);
        break;
        case 15: // Concept Camera Movement and Handling

        break;
        case 16: // Camera Movement

        break;
        case 17: // Camera Handling
          $('#analysisAddLabel').text('Choose camera handling');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="camera-handling-select-dropdown">Camera handling</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="camera-handling-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera handling"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#camera-handling-select-dropdown').select2(select2Options);
        break;
        case 18: // Zelizer Beese Voice of the Visual
          $('#analysisAddLabel').text('Choose Voice of the Visual (Zelizer & Beese)');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="zelizer-beese-voice-of-the-visual-select-dropdown">Voice of the visual</label>
                <div class="col-md-11">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="zelizer-beese-voice-of-the-visual-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select voice of the visual"
                          required>
                  </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
          $('#zelizer-beese-voice-of-the-visual-select-dropdown').select2(select2Options);
        break;
        case 19: // Barthes Rhetoric of the Image

        break;
        case 20: // Sound Effect Descriptive
          $('#analysisAddLabel').text('Describe sound effect');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q1">1.) Wie klingt das Geräusch (z.B. hölzern, metallisch, sanft, schnell)?</label>
                <div class="col-md-11">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q1"
                            aria-label="Question 1"
                            name="question"
                            placeholder="Answer to question 1"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q2">2.) Ist das Geräusch realistisch oder künstlich erzeugt?</label>
                <div class="col-md-11">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q2"
                            aria-label="Question 2"
                            name="question"
                            placeholder="Answer to question 2"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q3">3.) Von wo klingt das Geräusch?</label>
                <div class="col-md-11">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q3"
                            aria-label="Question 3"
                            name="question"
                            placeholder="Answer to question 3"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q4">4.) Bewegt sich das Geräusch oder ist es statisch?</label>
                <div class="col-md-11">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q4"
                            aria-label="Question 4"
                            name="question"
                            placeholder="Answer to question 4"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q5">5.) Ist das Geräusch Teil der dargestellten / erzählten Welt oder nicht?</label>
                <div class="col-md-11">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q5"
                            aria-label="Question 5"
                            name="question"
                            placeholder="Answer to question 5"></textarea>
                  </div>
              </div>
              <div class="form-group">
                <label ="sound-effect-descriptive-answer-q6">6.) Wodurch ist das Auftreten des Geräusches motiviert (z.B. aus der Erzählung heraus, künstlerisch motiviert, es soll die Szene verfremden, es soll die Szene realistischer machen)?</label>
                <div class="col-md-11">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q6"
                            aria-label="Question 6"
                            name="question"
                            placeholder="Answer to question 6"></textarea>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
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
      // $('select[name="analysisMethodId"]').rules('add', { required: true });
      modal.modal('show');
    },

    annotationAnalysisMethodDeleteModal: function(analysis) {
      // console.log("TCL: analysis", analysis);
      let modal = $('#timaat-videoplayer-analysis-delete');
      modal.data('analysisId', analysis.id);
      modal.data('isStatic', analysis.analysisMethod.analysisMethodType.isStatic);
      modal.data('analysisMethodId', analysis.analysisMethod.id);
      modal.modal('show');
    },

    displayAnalysisDetails: function( data ) {
      console.log("TCL: displayAnalysisDetails -> data", data);
      var details = 
        `<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">`;
      switch (data.analysisMethod.analysisMethodType.id) {
        case 1: // Martinez Scheffel Unreliable Narration
          details +=
            `<tr>
              <td>Unreliable Narration (Martinez & Scheffel):</td>
              <td>`+data.analysisMethod.martinezScheffelUnreliableNarration.martinezScheffelUnreliableNarrationTranslations[0].type+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
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
        case 7: // Color Temperature
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
        case 8: // Concept Camera Movement and Direction

        break;
        case 9: // Camera Elevation
          details +=
            `<tr>
              <td>Camera elevation:</td>
              <td>`+data.analysisMethod.cameraElevation.cameraElevationTranslations[0].name+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 10: // Camera Axis of Action
          details +=
            `<tr>
              <td>Camera axis of action:</td>
              <td>`+data.analysisMethod.cameraAxisOfAction.cameraAxisOfActionTranslations[0].name+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 11: // Camera Horizontal Angle
          details +=
            `<tr>
              <td>Camera horizontal angle:</td>
              <td>`+data.analysisMethod.cameraHorizontalAngle.cameraHorizontalAngleTranslations[0].name+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 12: // Camera Vertical Angle
          details +=
            `<tr>
              <td>Camera vertical angle:</td>
              <td>`+data.analysisMethod.cameraVerticalAngle.cameraVerticalAngleTranslations[0].name+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 13: // Camera Shot Type
          details +=
            `<tr>
              <td>Camera shot type:</td>
              <td>`+data.analysisMethod.cameraShotType.cameraShotTypeTranslations[0].type+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 14: // Camera Distance
          details +=
            `<tr>
              <td>Camera distance:</td>
              <td>`+data.analysisMethod.cameraDistance.cameraDistanceTranslations[0].name+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 15: // Concept Camera Movement and Handling

        break;
        case 16: // Camera Movement

        break;
        case 17: // Camera Handling
          details +=
            `<tr>
              <td>Camera handling:</td>
              <td>`+data.analysisMethod.cameraHandling.cameraHandlingTranslations[0].type+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 18: // Zelizer Beese Voice of the Visual
          details +=
            `<tr>
              <td>Voice of the Visual (Zelizer & Beese):</td>
              <td>`+data.analysisMethod.zelizerBeeseVoiceOfTheVisual.zelizerBeeseVoiceOfTheVisualTranslations[0].type+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
        break;
        case 19: // Barthes Rhetoric of the Image

        break;
        case 20: //* Sound Effect Descriptive
          details +=
            `<tr>
              <td>Wie klingt das Geräusch (z.B. hölzern, metallisch, sanft, schnell)?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ1+`</td>
            </tr>
            <tr>
              <td>Ist das Geräusch realistisch oder künstlich erzeugt?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ2+`</td>
            </tr>
            <tr>
              <td>Von wo klingt das Geräusch?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ3+`</td>
            </tr>
            <tr>
              <td>Bewegt sich das Geräusch oder ist es statisch?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ4+`</td>
            </tr>
            <tr>
              <td>Ist das Geräusch Teil der dargestellten / erzählten Welt oder nicht?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ5+`</td>
            </tr>
            <tr>
              <td>Wodurch ist das Auftreten des Geräusches motiviert?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ6+`</td>
            </tr>
            <tr>
              <td>Remark:</td>
              <td>`+data.remark+`</td>
            </tr>`;
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
            let nameDisplay = `<p>` + `  ` + analysisMethodType.analysisMethodTypeTranslations[0].name;
            if ([1,7,9,10,11,12,13,14,17,18,20].indexOf(analysisMethodType.id) > -1 && TIMAAT.VideoPlayer.curAnnotation) { //* TODO allow adding only for existing methods
              var i = 0;
              var exists = false;
              for (; i < TIMAAT.VideoPlayer.curAnnotation.model.analysis.length; i++) {
                if (TIMAAT.VideoPlayer.curAnnotation.model.analysis[i].analysisMethod.analysisMethodType.id == analysisMethodType.id) {
                  exists = true;
                }
              }
              if (!exists) { //* allow only one analysis of a type for the moment
                nameDisplay += `<span class="add-analysisMethod badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw" title="Add analysis method"></i></span>`;
              }
            }
						nameDisplay += `</p>`;
            
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
							<span class="remove-analysis badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw" title="Remove analysis method"></i></span>
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