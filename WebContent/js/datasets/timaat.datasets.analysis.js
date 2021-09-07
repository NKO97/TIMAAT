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
          },
          preproduction: "",
          remark: remark
        }; 
        var analysisMethodId;
        var analysisMethodVariantModel = {};
        var audioPostProductionModel = {};
        var audioPostProductionTranslationModel = {};
        var analysis;

        switch(analysisMethodTypeId) {
          case 1: // Martinez Scheffel Unreliable Narration
            analysisMethodId = Number($('#martinez-scheffel-unreliable-narration-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 2: // Greimas Actantial Model //* won't be implemented
          break;
          case 3: // Van Sijll Cinematic Storytelling //* won't be implemented
          break;
          case 4: // Lotman Renner Spacial Semantics //* won't be implemented
          break;
          case 5: // Genette Narrative Discourse //* won't be implemented
          break;
          case 6: // Stanzel Narrative Situations //* won't be implemented
          break;
          case 7: // Color Temperature
            analysisMethodId = Number($('#color-temperature-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 8: // Concept Camera Position and Perspective
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              cameraDistance: null,
              cameraShotType: null,
              cameraVerticalAngle: null,
              cameraHorizontalAngle: null,
              cameraAxisOfAction: null,
              cameraElevation: null
            };
            (Number($('#camera-distance-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraDistance = { analysisMethodId: Number($('#camera-distance-select-dropdown').val()) };
            (Number($('#camera-shot-type-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraShotType = { analysisMethodId: Number($('#camera-shot-type-select-dropdown').val()) };
            (Number($('#camera-vertical-angle-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraVerticalAngle = { analysisMethodId: Number($('#camera-vertical-angle-select-dropdown').val()) };
            (Number($('#camera-horizontal-angle-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraHorizontalAngle = { analysisMethodId: Number($('#camera-horizontal-angle-select-dropdown').val()) };
            (Number($('#camera-axis-of-action-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraAxisOfAction = { analysisMethodId: Number($('#camera-axis-of-action-select-dropdown').val()) };
            (Number($('#camera-elevation-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraElevation = { analysisMethodId: Number($('#camera-elevation-select-dropdown').val()) };

            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.conceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "conceptCameraPositionAndPerspective");
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
          case 15: // Concept Camera Movement and Handling //* won't be implemented
          break;
          case 16: // Camera Movement
          analysisMethodVariantModel = {
            analysisMethodId: 0,
            cameraMovementType: null,
            cameraMovementCharacteristic: null,
            cameraHandling: null,
            conceptDirection: null,
            startConceptCameraPositionAndPerspective: {
              analysisMethodId: 0
            },
            endConceptCameraPositionAndPerspective: {
              analysisMethodId: 0
            },           
          };
          let startConceptCameraPositionAndPerspectiveModel = {
            analysisMethodId: 0,
            cameraDistance: null,
            cameraShotType: null,
            cameraVerticalAngle: null,
            cameraHorizontalAngle: null,
            cameraAxisOfAction: null,
            cameraElevation: null
          };
          let endConceptCameraPositionAndPerspectiveModel = {
            analysisMethodId: 0,
            cameraDistance: null,
            cameraShotType: null,
            cameraVerticalAngle: null,
            cameraHorizontalAngle: null,
            cameraAxisOfAction: null,
            cameraElevation: null
          };
          (Number($('#camera-movement-type-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraMovementType = { analysisMethodId: Number($('#camera-movement-type-select-dropdown').val()) };
          (Number($('#camera-movement-characteristic-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraMovementCharacteristic = { analysisMethodId: Number($('#camera-movement-characteristic-select-dropdown').val()) };
          (Number($('#camera-handling-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraHandling = { analysisMethodId: Number($('#camera-handling-select-dropdown').val()) };
          (Number($('#concept-direction-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.conceptDirection = { analysisMethodId: Number($('#concept-direction-select-dropdown').val()) };
          (Number($('#start-camera-distance-select-dropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraDistance = { analysisMethodId: Number($('#start-camera-distance-select-dropdown').val()) };
          (Number($('#start-camera-shot-type-select-dropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraShotType = { analysisMethodId: Number($('#start-camera-shot-type-select-dropdown').val()) };
          (Number($('#start-camera-vertical-angle-select-dropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraVerticalAngle = { analysisMethodId: Number($('#start-camera-vertical-angle-select-dropdown').val()) };
          (Number($('#start-camera-horizontal-angle-select-dropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraHorizontalAngle = { analysisMethodId: Number($('#start-camera-horizontal-angle-select-dropdown').val()) };
          (Number($('#start-camera-axis-of-action-select-dropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraAxisOfAction = { analysisMethodId: Number($('#start-camera-axis-of-action-select-dropdown').val()) };
          (Number($('#start-camera-elevation-select-dropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraElevation = { analysisMethodId: Number($('#start-camera-elevation-select-dropdown').val()) };
          (Number($('#end-camera-distance-select-dropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraDistance = { analysisMethodId: Number($('#end-camera-distance-select-dropdown').val()) };
          (Number($('#end-camera-shot-type-select-dropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraShotType = { analysisMethodId: Number($('#end-camera-shot-type-select-dropdown').val()) };
          (Number($('#end-camera-vertical-angle-select-dropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraVerticalAngle = { analysisMethodId: Number($('#end-camera-vertical-angle-select-dropdown').val()) };
          (Number($('#end-camera-horizontal-angle-select-dropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraHorizontalAngle = { analysisMethodId: Number($('#end-camera-horizontal-angle-select-dropdown').val()) };
          (Number($('#end-camera-axis-of-action-select-dropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraAxisOfAction = { analysisMethodId: Number($('#end-camera-axis-of-action-select-dropdown').val()) };
          (Number($('#end-camera-elevation-select-dropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraElevation = { analysisMethodId: Number($('#end-camera-elevation-select-dropdown').val()) };
          let startConceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(startConceptCameraPositionAndPerspectiveModel, 'conceptCameraPositionAndPerspective');
          analysisMethodVariantModel.startConceptCameraPositionAndPerspective.analysisMethodId = startConceptCameraPositionAndPerspective.analysisMethodId;
          let endConceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(endConceptCameraPositionAndPerspectiveModel, 'conceptCameraPositionAndPerspective');
          analysisMethodVariantModel.endConceptCameraPositionAndPerspective.analysisMethodId = endConceptCameraPositionAndPerspective.analysisMethodId;
          analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
          analysis.analysisMethod.conceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "cameraMovement");
          break;
          case 17: // Camera Handling
            analysisMethodId = Number($('#camera-handling-select-dropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId; 
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 18: // Zelizer Beese Voice of the Visual //* won't be implemented
          break;
          case 19: // Barthes Rhetoric of the Image //* won't be implemented
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
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.soundEffectDescriptive = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "soundEffectDescriptive");
          break;
          case 21: // Analysis Ambient Sound
          break;
          case 22: // Analysis Music
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              audioPostProduction: {
                id: 0,
                audioPostProductionTranslations: {
                  id: 0
                },
              },
              harmony: $('#analysis-music-harmony').val(),
              isPause: $('#analysis-music-isPause').prop('checked'),
              melody: $('#analysis-music-melody').val(),
              tempo: $('#analysis-music-tempo').val(),
              articulation: null,
              dynamicMarking: null,
              changeInDynamics: null,
              changeInTempo: null,
              tempoMarking: null,
              musicalKey: null,
              rhythm: null,
              timbre: null,
              jins: null,
              maqam: null,
              songStructure: null,
              lineupMembers: null,
              musicalNotations: null,
            };            
            (Number($('#analysis-music-articulation-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.articulation = { id: Number($('#analysis-music-articulation-select-dropdown').val()) };
            (Number($('#analysis-music-dynamicMarking-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.dynamicMarking = { id:  Number($('#analysis-music-dynamicMarking-select-dropdown').val())};
            (Number($('#analysis-music-changeInDynamics-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.changeInDynamics = { id:  Number($('#analysis-music-changeInDynamics-select-dropdown').val())};
            (Number($('#analysis-music-changeInTempo-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.changeInTempo = { id: Number($('#analysis-music-changeInTempo-select-dropdown').val())};
            (Number($('#analysis-music-tempoMarking-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.tempoMarking = { id: Number($('#analysis-music-tempoMarking-select-dropdown').val())};
            (Number($('#analysis-music-musicalKey-select-dropdown').val()) == 0 ) ? null : analysisMethodVariantModel.musicalKey = { id: Number($('#analysis-music-musicalKey-select-dropdown').val())};
            (Number($('#analysis-music-rhythm-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.rhythm = { id: Number($('#analysis-music-rhythm-select-dropdown').val())};
            (Number($('#analysis-music-timbre-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.timbre = { id: Number($('#analysis-music-timbre-select-dropdown').val())};
            (Number($('#analysis-music-jins-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.jins = { id: Number($('#analysis-music-jins-select-dropdown').val())};
            (Number($('#analysis-music-maqam-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.maqam = { id: Number($('#analysis-music-maqam-select-dropdown').val())};
            (Number($('#analysis-music-songStructure-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.songStructure = { id: Number($('#analysis-music-songStructure-select-dropdown').val())};
            (Number($('#analysis-music-lineupMembers-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.lineupMembers = [{ id: Number($('#analysis-music-lineupMembers-select-dropdown').val())}];
            (Number($('#analysis-music-musicalNotations-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.musicalNotations = [{ id: Number($('#analysis-music-musicalNotations-select-dropdown').val())}];
            audioPostProductionTranslationModel = {
              id: 0,
              audioPostProduction: {
                id: 0
              },
              language: {
                id: 1 // TODO
              },
              overdubbing: $('#audio-post-production-overdubbing').val(),
              reverb: $('#audio-post-production-reverb').val(),
              delay: $('#audio-post-production-delay').val(),
              panning: $('#audio-post-production-panning').val(),
              bass: $('#audio-post-production-bass').val(),
              treble: $('#audio-post-production-treble').val(),
            };
            audioPostProductionModel = await TIMAAT.AnalysisService.createAudioPostProduction();
            audioPostProductionTranslationModel.audioPostProduction.id = audioPostProductionModel.id;
            audioPostProductionTranslationModel = await TIMAAT.AnalysisService.createAudioPostProductionTranslation(audioPostProductionTranslationModel);
            audioPostProductionModel.audioPostProductionTranslations[0] = audioPostProductionTranslationModel;
            analysisMethodVariantModel.audioPostProduction = audioPostProductionModel;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.analysisMusic = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "analysisMusic");
          break;
          case 23: // Analysis Speech
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              audioPostProduction: {
                id: 0,
                audioPostProductionTranslations: {
                  id: 0
                },
              },
              // categorySet: { id: 0 },
              accent: $('#analysis-speech-accent').val(),
              intonation: $('#analysis-speech-intonation').val(),
              volume: $('#analysis-speech-volume').val(),
              tempo: $('#analysis-speech-tempo').val(),
              pauses: $('#analysis-speech-pauses').val(),
              timbre: $('#analysis-speech-timbre').val(),
            };
            audioPostProductionTranslationModel = {
              id: 0,
              audioPostProduction: {
                id: 0
              },
              language: {
                id: 1 // TODO
              },
              overdubbing: $('#audio-post-production-overdubbing').val(),
              reverb: $('#audio-post-production-reverb').val(),
              delay: $('#audio-post-production-delay').val(),
              panning: $('#audio-post-production-panning').val(),
              bass: $('#audio-post-production-bass').val(),
              treble: $('#audio-post-production-treble').val(),
            };
            audioPostProductionModel = await TIMAAT.AnalysisService.createAudioPostProduction();
            audioPostProductionTranslationModel.audioPostProduction.id = audioPostProductionModel.id;
            audioPostProductionTranslationModel = await TIMAAT.AnalysisService.createAudioPostProductionTranslation(audioPostProductionTranslationModel);
            audioPostProductionModel.audioPostProductionTranslations[0] = audioPostProductionTranslationModel;
            analysisMethodVariantModel.audioPostProduction = audioPostProductionModel;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysisMethodVariantModel = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "analysisSpeech");
            analysis.analysisMethod.analysisSpeech = analysisMethodVariantModel;
          break;
          case 24: // Analysis Voice
          break;
          case 25: // Lighting type - Part of 43: Lighting
          break;
          case 26: // Montage Figure Macro - Part of 34: Editing / Montage
          break;
          case 27: // Montage Figure Micro - Part of 34: Editing / Montage
          break;
          case 28: // Take Junction - Part of 34: Editing / Montage
          break;
          case 29: // Editing Rhythm - Part of 34: Editing / Montage
          break;
          case 30: // Take Length - Part of 34: Editing / Montage
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              text: $('#takeLength').val(),
            };
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.soundEffectDescriptive = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "takeLength");
          break;
          case 31: // Take Type Progression - Part of 34: Editing / Montage
          break;
          case 32: // Playback Speed - Part of 34: Editing / Montage
          break;
          case 33: // Image Cadre Editing - Part of 34: Editing / Montage
          break;
          case 34: // Editing / Montage
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              montageFigureMacro: null,
              montageFigureMicro: null,
              takeJunction: null,
              editingRhythm: null,
              takeLength: {
                analysisMethodId: null,
                text: ''
              },
              takeTypeProgression: null,
              cameraShotType: null,
              playbackSpeed: null,
              imageCadreEditing: null
            };
            (Number($('#montage-figure-macro-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.montageFigureMacro = { analysisMethodId: Number($('#montage-figure-macro-select-dropdown').val()) };
            (Number($('#montage-figure-micro-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.montageFigureMicro = { analysisMethodId: Number($('#montage-figure-micro-select-dropdown').val()) };
            (Number($('#take-junction-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.takeJunction = { analysisMethodId: Number($('#take-junction-select-dropdown').val()) };
            (Number($('#editing-rhythm-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.editingRhythm = { analysisMethodId: Number($('#editing-rhythm-select-dropdown').val()) };
            (Number($('#take-type-progression-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.takeTypeProgression = { analysisMethodId: Number($('#take-type-progression-select-dropdown').val()) };
            (Number($('#camera-shot-type-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraShotType = { analysisMethodId: Number($('#camera-shot-type-select-dropdown').val()) };
            (Number($('#playback-speed-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.playbackSpeed = { analysisMethodId: Number($('#playback-speed-select-dropdown').val()) };
            (Number($('#image-cadre-editing-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.imageCadreEditing = { analysisMethodId: Number($('#image-cadre-editing-select-dropdown').val()) };
            let takeLengthModel = {
              analysisMethodId: 0,
              text: $('#takeLength').val()
            };
            let takeLength = await TIMAAT.AnalysisService.createAnalysisMethodVariant(takeLengthModel, 'takeLength');
            analysisMethodVariantModel.takeLength.analysisMethodId = takeLength.analysisMethodId;

            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.editingMontage = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "editingMontage");
          break;
          case 35: // Concept Direction
          break;
          case 36: // Camera Movement Characteristic
          break;
          case 37: // Camera Movement Type
          break;
          case 38: // Light Position General - Part of 43: Lighting
          break;
          case 39: // Light Position Angle Horizontal - Part of 43: Lighting
          break;
          case 40: // Light Position Angle Vertical - Part of 43: Lighting
          break;
          case 41: // Light Modifier - Part of 43: Lighting
          break;
          case 42: // Lighting Duration - Part of 43: Lighting
          break;
          case 43: // Lighting
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              lightingType: null,
              lightPosition: null,
              lightPositionAngleHorizontal: null,
              lightPositionAngleVertical: null,
              lightModifier: null,
              lightingDuration: null
            };
            (Number($('#lighting-type-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.lightingType = { analysisMethodId: Number($('#lighting-type-select-dropdown').val()) };
            (Number($('#light-position-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.lightPosition = { analysisMethodId: Number($('#light-position-select-dropdown').val()) };
            (Number($('#light-position-angle-horizontal-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.lightPositionAngleHorizontal = { analysisMethodId: Number($('#light-position-angle-horizontal-select-dropdown').val()) };
            (Number($('#light-position-angle-vertical-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.lightPositionAngleVertical = { analysisMethodId: Number($('#light-position-angle-vertical-select-dropdown').val()) };
            (Number($('#light-modifier-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.lightModifier = { analysisMethodId: Number($('#light-modifier-select-dropdown').val()) };
            (Number($('#lighting-duration-select-dropdown').val()) == 0) ? null : analysisMethodVariantModel.lightingDuration = { analysisMethodId: Number($('#lighting-duration-select-dropdown').val()) };

            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.lighting = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "lighting");
            console.log("TCL: $ ->  analysis.analysisMethod",  analysis.analysisMethod);
          break;
        }
        modal.modal('hide');
        TIMAAT.VideoPlayer.curAnnotation.model.analysis.push(analysis);
        TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload(null, false);
        TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.url('/TIMAAT/api/analysis/method/list?visual='+TIMAAT.VideoPlayer.curAnnotation.model.layerVisual+'&audio='+TIMAAT.VideoPlayer.curAnnotation.model.layerAudio);
        TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload(null, false);
        TIMAAT.VideoPlayer.inspector.setItem(TIMAAT.VideoPlayer.curAnnotation, 'annotation'); // mainly to reverse unsaved layer changes
      });

      $('#timaat-analysis-delete-submit').on('click', async function(event) {
        event.preventDefault();
        var modal = $('#timaat-videoplayer-analysis-delete');
        var analysisId = modal.data('analysisId');
        var analysisMethodId = modal.data('analysisMethodId');
        var audioPostProductionId = modal.data('audioPostProductionId');
        var isStatic = modal.data('isStatic');
        if (isStatic) {
          await TIMAAT.AnalysisService.deleteStaticAnalysis(analysisId);
        } else {
          await TIMAAT.AnalysisService.deleteDynamicAnalysis(analysisMethodId);
          // if analysisMethod was linked to audio post production, delete audio post production
          if (audioPostProductionId != null) {
            await TIMAAT.AnalysisService.deleteAudioPostProduction(audioPostProductionId);
          }
        }
        modal.modal('hide');
        var i = 0;
        for (; i < TIMAAT.VideoPlayer.curAnnotation.model.analysis.length; i++) {
          if (TIMAAT.VideoPlayer.curAnnotation.model.analysis[i].id == analysisId) {
            TIMAAT.VideoPlayer.curAnnotation.model.analysis.splice(i, 1);
          }
        }
        TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload(null, false);
        TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.url('/TIMAAT/api/analysis/method/list?visual='+TIMAAT.VideoPlayer.curAnnotation.model.layerVisual+'&audio='+TIMAAT.VideoPlayer.curAnnotation.model.layerAudio);
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
      TIMAAT.AnalysisDatasets.setupAnalysisMethodsDataTable();
      TIMAAT.AnalysisDatasets.setupAnnotationAnalysisDataTable();
    },

    annotationAnalysisMethodAddModal: function(annotationId, analysisMethodType) {
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
          cache: false
        },
      };
      var audioPostProductionHtml = `<hr>
      <h5 class="modal-title">Post Production Information</h5>
      <div class="form-group">
        <label for="audio-post-production-overdubbing">Overdubbing</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audio-post-production-overdubbing"
                    maxlength="255"
                    aria-label="Overdubbing"
                    name="overdubbing"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audio-post-production-reverb">Reverb</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audio-post-production-reverb"
                    maxlength="255"
                    aria-label="Reverb"
                    name="reverb"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audio-post-production-delay">Delay</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audio-post-production-delay"
                    maxlength="255"
                    aria-label="Delay"
                    name="delay"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audio-post-production-panning">Panning</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audio-post-production-panning"
                    maxlength="255"
                    aria-label="Panning"
                    name="panning"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audio-post-production-bass">Bass</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audio-post-production-bass"
                    maxlength="255"
                    aria-label="Bass"
                    name="bass"
                    placeholder="Enter description"></textarea>
          </div>
      </div>
      <div class="form-group">
        <label ="audio-post-production-treble">Treble</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audio-post-production-treble"
                    maxlength="255"
                    aria-label="Treble"
                    name="treble"
                    placeholder="Enter description"></textarea>
        </div>
      </div>`;
      var remarkHtml = `<hr>
      <h5 class="modal-title">Remark</h5>
      <div class="form-group">
        <label class="sr-only" for="analysis-remark">Remark</label>
        <div class="col-md-12">
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
                <div class="col-md-12">
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
        case 2: // Greimas Actantial Model //* won't be implemented
        break;
        case 3: // Van Sijll Cinematic Storytelling //* won't be implemented
        break;
        case 4: // Lotman Renner Spacial Semantics //* won't be implemented
        break;
        case 5: // Genette Narrative Discourse //* won't be implemented
        break;
        case 6: // Stanzel Narrative Situations //* won't be implemented
        break;
        case 7: // Color Temperature
          $('#analysisAddLabel').text('Choose color temperature');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="color-temperature-select-dropdown">Color temperature</label>
                <div class="col-md-12">
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
        case 8: // Concept Camera Position and Perspective
        $('#analysisAddLabel').text('Describe camera position and perspective');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <h5 class="modal-title">Camera position and perspective</h5>
            <div class="form-group">
            <label for="camera-distance-select-dropdown">Camera distance</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-distance-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera distance">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="camera-shot-type-select-dropdown">Camera shot type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-shot-type-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera shot type">
                </select>
              </div>
            </div><div class="form-group">
            <label for="camera-vertical-angle-select-dropdown">Camera vertical angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-vertical-angle-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera vertical angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="camera-horizontal-angle-select-dropdown">Camera horizontal angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-horizontal-angle-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="camera-axis-of-action-select-dropdown">Camera axis of action</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-axis-of-action-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="camera-elevation-select-dropdown">Camera elevation</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-elevation-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera elevation">
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDistance/selectList/';
        $('#camera-distance-select-dropdown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
        $('#camera-shot-type-select-dropdown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraVerticalAngle/selectList/';
        $('#camera-vertical-angle-select-dropdown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHorizontalAngle/selectList/';
        $('#camera-horizontal-angle-select-dropdown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraAxisOfAction/selectList/';
        $('#camera-axis-of-action-select-dropdown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraElevation/selectList/';
        $('#camera-elevation-select-dropdown').select2(select2Options);
        break;
        case 9: // Camera Elevation
          $('#analysisAddLabel').text('Choose camera elevation');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="camera-elevation-select-dropdown">Camera elevation</label>
                <div class="col-md-12">
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
              <div class="col-md-12">
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
              <div class="col-md-12">
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
                <div class="col-md-12">
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
        case 13: // Camera Shot Type - part of 34: Editing / Montage
          $('#analysisAddLabel').text('Choose camera shot type');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="camera-shot-type-select-dropdown">Camera shot type</label>
                <div class="col-md-12">
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
                <div class="col-md-12">
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
        case 15: // Concept Camera Movement and Handling //* won't be implemented
        break;
        case 16: // Camera Movement
        $('#analysisAddLabel').text('Describe camera movement');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
            <label for="camera-movement-type-select-dropdown">Camera movement type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-movement-type-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera movement type">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="camera-movement-characteristic-select-dropdown">Camera movement characteristic</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-movement-characteristic-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera movement characteristic">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="camera-handling-select-dropdown">Camera handling</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="camera-handling-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera handling">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="concept-direction-select-dropdown">Concept direction</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="concept-direction-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select concept direction">
                </select>
              </div>
            </div>
            <h5 class="modal-title">Start camera position and perspective</h5>
            <div class="form-group">
            <label for="start-camera-distance-select-dropdown">Camera distance</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="start-camera-distance-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera distance">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="start-camera-shot-type-select-dropdown">Camera shot type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="start-camera-shot-type-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera shot type">
                </select>
              </div>
            </div><div class="form-group">
            <label for="start-camera-vertical-angle-select-dropdown">Camera vertical angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="start-camera-vertical-angle-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera vertical angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="start-camera-horizontal-angle-select-dropdown">Camera horizontal angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="start-camera-horizontal-angle-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="start-camera-axis-of-action-select-dropdown">Camera axis of action</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="start-camera-axis-of-action-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="start-camera-elevation-select-dropdown">Camera elevation</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="start-camera-elevation-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera elevation">
                </select>
              </div>
            </div>
            <h5 class="modal-title">End camera position and perspective</h5>
            <div class="form-group">
            <label for="end-camera-distance-select-dropdown">Camera distance</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="end-camera-distance-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera distance">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="end-camera-shot-type-select-dropdown">Camera shot type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="end-camera-shot-type-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera shot type">
                </select>
              </div>
            </div><div class="form-group">
            <label for="end-camera-vertical-angle-select-dropdown">Camera vertical angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="end-camera-vertical-angle-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera vertical angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="end-camera-horizontal-angle-select-dropdown">Camera horizontal angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="end-camera-horizontal-angle-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="end-camera-axis-of-action-select-dropdown">Camera axis of action</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="end-camera-axis-of-action-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="end-camera-elevation-select-dropdown">Camera elevation</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="end-camera-elevation-select-dropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera elevation">
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraMovementType/selectList/';
          $('#camera-movement-type-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraMovementCharacteristic/selectList/';
          $('#camera-movement-characteristic-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHandling/selectList/';
          $('#camera-handling-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/conceptDirection/selectList/';
          $('#concept-direction-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDistance/selectList/';
          $('#start-camera-distance-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
          $('#start-camera-shot-type-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraVerticalAngle/selectList/';
          $('#start-camera-vertical-angle-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHorizontalAngle/selectList/';
          $('#start-camera-horizontal-angle-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraAxisOfAction/selectList/';
          $('#start-camera-axis-of-action-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraElevation/selectList/';
          $('#start-camera-elevation-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDistance/selectList/';
          $('#end-camera-distance-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
          $('#end-camera-shot-type-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraVerticalAngle/selectList/';
          $('#end-camera-vertical-angle-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHorizontalAngle/selectList/';
          $('#end-camera-horizontal-angle-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraAxisOfAction/selectList/';
          $('#end-camera-axis-of-action-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraElevation/selectList/';
          $('#end-camera-elevation-select-dropdown').select2(select2Options);
        break;
        case 17: // Camera Handling
          $('#analysisAddLabel').text('Choose camera handling');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="camera-handling-select-dropdown">Camera handling</label>
                <div class="col-md-12">
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
        case 18: // Zelizer Beese Voice of the Visual //* won't be implemented
        break;
        case 19: // Barthes Rhetoric of the Image //* won't be implemented
        break;
        case 20: // Sound Effect Descriptive
          $('#analysisAddLabel').text('Describe sound effect');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q1">1.) Wie klingt das Geräusch (z.B. hölzern, metallisch, sanft, schnell)?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q1"
                            aria-label="Question 1"
                            name="question"
                            placeholder="Answer to question 1"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q2">2.) Ist das Geräusch realistisch oder künstlich erzeugt?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q2"
                            aria-label="Question 2"
                            name="question"
                            placeholder="Answer to question 2"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q3">3.) Von wo klingt das Geräusch?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q3"
                            aria-label="Question 3"
                            name="question"
                            placeholder="Answer to question 3"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q4">4.) Bewegt sich das Geräusch oder ist es statisch?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q4"
                            aria-label="Question 4"
                            name="question"
                            placeholder="Answer to question 4"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="sound-effect-descriptive-answer-q5">5.) Ist das Geräusch Teil der dargestellten / erzählten Welt oder nicht?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="sound-effect-descriptive-answer-q5"
                            aria-label="Question 5"
                            name="question"
                            placeholder="Answer to question 5"></textarea>
                  </div>
              </div>
              <div class="form-group">
                <label ="sound-effect-descriptive-answer-q6">6.) Wodurch ist das Auftreten des Geräusches motiviert (z.B. aus der Erzählung heraus, künstlerisch motiviert, es soll die Szene verfremden, es soll die Szene realistischer machen)?</label>
                <div class="col-md-12">
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
          $('#analysisAddLabel').text('Describe music');
          modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <h5 class="modal-title">Analysis Music</h5>
            <div class="form-group">
              <label for="analysis-music-harmony">Harmony</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-music-harmony"
                          aria-label="Harmony"
                          name="harmony"
                          placeholder="Enter harmony description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label>Pause</label>
              <div class="col-md-12">
                <div class="form-check">
                  <input class="form-check-input"
                         id="analysis-music-isPause"
                         type="checkbox"
                         name="isPause"
                         data-role="isPause"
                         placeholder="Is Pause">
                <label for="analysis-music-isPause">Is a Pause</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-melody">Melody</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-music-melody"
                          aria-label="Melody"
                          name="melody"
                          placeholder="Enter melody description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-articulation-select-dropdown">Articulation [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-articulation-select-dropdown"
                        name="articulation"
                        data-role="articulation"
                        data-placeholder="Select articulation">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-dynamicMarking-select-dropdown">Dynamic Marking</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-dynamicMarking-select-dropdown"
                        name="dynamicMarking"
                        data-role="dynamicMarking"
                        data-placeholder="Select dynamic marking">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-changeInDynamics-select-dropdown">Change in Dynamics</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-changeInDynamics-select-dropdown"
                        name="changeInDynamics"
                        data-role="changeInDynamics"
                        data-placeholder="Select change in dynamics">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-tempo">Tempo</label>
              <div class="col-md-12">
                <input class="form-control form-control-md analysis-music-tempo"
                        style="width:100%;"
                        id="analysis-music-tempo"
                        name="tempo"
                        data-role="tempo"
                        data-placeholder="Select tempo"
                        aria-describedby="Tempo"
                        max-length="4"
                        rows="1">
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-changeInTempo-select-dropdown">Change in Tempo</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-changeInTempo-select-dropdown"
                        name="changeInTempo"
                        data-role="changeInTempo"
                        data-placeholder="Select change in tempo">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-tempoMarking-select-dropdown">Tempo Marking</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-tempoMarking-select-dropdown"
                        name="tempoMarking"
                        data-role="tempoMarking"
                        data-placeholder="Select tempo marking">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-musicalKey-select-dropdown">Musical Key</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-musicalKey-select-dropdown"
                        name="musicalKey"
                        data-role="musicalKey"
                        data-placeholder="Select musical key">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-rhythm-select-dropdown">Rhythm [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-rhythm-select-dropdown"
                        name="rhythm"
                        data-role="rhythm"
                        data-placeholder="Select rhythm">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-timbre-select-dropdown">Timbre [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-timbre-select-dropdown"
                        name="timbre"
                        data-role="timbre"
                        data-placeholder="Select timbre">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-jins-select-dropdown">Jins</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-jins-select-dropdown"
                        name="jins"
                        data-role="jins"
                        data-placeholder="Select jins">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-maqam-select-dropdown">Maqam</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-maqam-select-dropdown"
                        name="maqam"
                        data-role="maqam"
                        data-placeholder="Select maqam">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-songStructure-select-dropdown">Song Structure [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-songStructure-select-dropdown"
                        name="songStructure"
                        data-role="songStructure"
                        data-placeholder="Select songStructure">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-lineupMembers-select-dropdown">Lineup Members [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-lineupMembers-select-dropdown"
                        name="lineupMembers"
                        data-role="lineupMembers"
                        data-placeholder="Select lineup members">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-music-musicalNotations-select-dropdown">Musical Notation [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysis-music-musicalNotations-select-dropdown"
                        name="musicalNotation"
                        data-role="musicalNotation"
                        data-placeholder="Select musical notation">
                </select>
              </div>
            </div>`+
            audioPostProductionHtml +
            remarkHtml +
          `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/articulation/selectList/';
          $('#analysis-music-articulation-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/dynamicMarking/selectList/';
          $('#analysis-music-dynamicMarking-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/changeInDynamics/selectList/';
          $('#analysis-music-changeInDynamics-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/changeInTempo/selectList/';
          $('#analysis-music-changeInTempo-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/tempoMarking/selectList/';
          $('#analysis-music-tempoMarking-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/musicalKey/selectList/';
          $('#analysis-music-musicalKey-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/rhythm/selectList/';
          $('#analysis-music-rhythm-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/timbre/selectList/';
          $('#analysis-music-timbre-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/jins/selectList/';
          $('#analysis-music-jins-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/maqam/selectList/';
          $('#analysis-music-maqam-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/songStructure/selectList/';
          $('#analysis-music-songStructure-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lineupMembers/selectList/';
          $('#analysis-music-lineupMembers-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/musicalNotations/selectList/';
          $('#analysis-music-musicalNotations-select-dropdown').select2(select2Options);          
        break;
        case 23: // Analysis Speech
        $('#analysisAddLabel').text('Describe speech');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <h5 class="modal-title">Analysis Speech</h5>
            <div class="form-group">
              <label for="analysis-speech-accent">Accent</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-speech-accent"
                          maxlength="255"
                          aria-label="Accent"
                          name="accent"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-speech-intonation">Intonation</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-speech-intonation"
                          maxlength="255"
                          aria-label="Intonation"
                          name="intonation"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-speech-volume">Volume</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-speech-volume"
                          maxlength="255"
                          aria-label="Volume"
                          name="volume"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-speech-tempo">Tempo</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-speech-tempo"
                          maxlength="255"
                          aria-label="Tempo"
                          name="tempo"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysis-speech-pauses">Pauses</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-speech-pauses"
                          maxlength="255"
                          aria-label="Pauses"
                          name="pauses"
                          placeholder="Enter description"></textarea>
                </div>
            </div>
            <div class="form-group">
              <label ="analysis-speech-timbre">Timbre</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysis-speech-timbre"
                          maxlength="255"
                          aria-label="Timbre"
                          name="timbre"
                          placeholder="Enter description"></textarea>
              </div>
            </div>`+
            audioPostProductionHtml +
            remarkHtml +
          `</form>`);
        break;
        case 24: // Analysis Voice
        break;
        case 25: // Lighting type - Part of 43: Lighting
        break;
        case 26: // Montage Figure Macro - Part of 34: Editing / Montage
        break;
        case 27: // Montage Figure Micro - Part of 34: Editing / Montage
        break;
        case 28: // Take Junction - Part of 34: Editing / Montage
        break;
        case 29: // Editing Rhythm - Part of 34: Editing / Montage
        break;
        case 30: // Take Length - Part of 34: Editing / Montage
        $('#analysisAddLabel').text('Describe take length');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
              <label for="takeLength">Take length</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="takeLength"
                          aria-label="Take length"
                          name="takeLength"
                          placeholder="Describe take length"></textarea>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
        break;
        case 31: // Take Type Progression - Part of 34: Editing / Montage
        break;
        case 32: // Playback Speed - Part of 34: Editing / Montage
        break;
        case 33: // Image Cadre Editing - Part of 34: Editing / Montage
        break;
        case 34: // Editing / Montage
          $('#analysisAddLabel').text('Describe editing/montage');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <h5 class="modal-title">Editing / Montage</h5>
              <div class="form-group">
              <label for="montage-figure-macro-select-dropdown">Montage figure macro</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="montage-figure-macro-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select montage figure macro">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="montage-figure-macro-select-dropdown">Montage figure micro</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="montage-figure-micro-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select montage figure micro">
                  </select>
                </div>
              </div><div class="form-group">
              <label for="take-junction-select-dropdown">Take junction</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="take-junction-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select take junction">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="editing-rhythm-select-dropdown">Editing rhythm</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="editing-rhythm-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select editing rhythm">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="take-length">Take length</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="takeLength"
                            aria-label="Take length"
                            name="takeLength"
                            placeholder="Take length"></textarea>
                </div>
              </div>
              <div class="form-group">
              <label for="take-type-progression-select-dropdown">Take type progression</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="take-type-progression-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select take type progression">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="camera-shot-type-select-dropdown">Camera shot type</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="camera-shot-type-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera shot type">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="playback-speed-select-dropdown">Playback speed</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="playback-speed-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select playback speed">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="image-cadre-editing-select-dropdown">Image cadre editing</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="image-cadre-editing-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select image cadre editing">
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/montageFigureMacro/selectList/';
          $('#montage-figure-macro-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/montageFigureMicro/selectList/';
          $('#montage-figure-micro-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/takeJunction/selectList/';
          $('#take-junction-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/editingRhythm/selectList/';
          $('#editing-rhythm-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/takeTypeProgression/selectList/';
          $('#take-type-progression-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
          $('#camera-shot-type-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/playbackSpeed/selectList/';
          $('#playback-speed-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/imageCadreEditing/selectList/';
          $('#image-cadre-editing-select-dropdown').select2(select2Options);
        break;
        case 35: // Concept Direction
        break;
        case 36: // Camera Movement Characteristic
        break;
        case 37: // Camera Movement Type
        break;
        case 38: // Light Position General - Part of 43: Lighting
        break;
        case 39: // Light Position Angle Horizontal - Part of 43: Lighting
        break;
        case 40: // Light Position Angle Vertical - Part of 43: Lighting
        break;
        case 41: // Light Modifier - Part of 43: Lighting
        break;
        case 42: // Lighting Duration - Part of 43: Lighting
        break;
        case 43: // Lighting
          $('#analysisAddLabel').text('Describe lighting');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <h5 class="modal-title">Lighting</h5>
              <div class="form-group">
              <label for="lighting-type-select-dropdown">Lighting type</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lighting-type-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select lighting type">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="light-position-select-dropdown">Light position</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="light-position-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select light position">
                  </select>
                </div>
                <div class="form-group">
                <label for="light-position-angle-horizontal-select-dropdown">Light position horizontal angle</label>
                  <div class="col-md-12">
                    <select class="form-control form-control-md select-dropdown"
                            style="width:100%;"
                            id="light-position-angle-horizontal-select-dropdown"
                            name="analysisMethodId"
                            data-role="analysisMethodId"
                            data-placeholder="Select light position horizontal angle">
                    </select>
                  </div>
                </div>
              </div><div class="form-group">
              <label for="light-position-angle-vertical-select-dropdown">Light position vertical angle</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="light-position-angle-vertical-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select light position vertical angle">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="light-modifier-select-dropdown">Light modifier</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="light-modifier-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select light modifier">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="lighting-duration-select-dropdown">Lighting duration</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lighting-duration-select-dropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select lighting duration">
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightingType/selectList/';
          $('#lighting-type-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightPosition/selectList/';
          $('#light-position-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightPositionAngleHorizontal/selectList/';
          $('#light-position-angle-horizontal-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightPositionAngleVertical/selectList/';
          $('#light-position-angle-vertical-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightModifier/selectList/';
          $('#light-modifier-select-dropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightingDuration/selectList/';
          $('#lighting-duration-select-dropdown').select2(select2Options);
        break;
      }
      // $('select[name="analysisMethodId"]').rules('add', { required: true });
      modal.modal('show');
    },

    annotationAnalysisMethodDeleteModal: function(analysis) {
      let modal = $('#timaat-videoplayer-analysis-delete');
      modal.data('analysisId', analysis.id);
      modal.data('isStatic', analysis.analysisMethod.analysisMethodType.isStatic);
      modal.data('analysisMethodId', analysis.analysisMethod.id);
      switch (analysis.analysisMethod.analysisMethodType.id) {
        case 23: // analysis speech
          modal.data('audioPostProductionId', analysis.analysisMethod.analysisSpeech.audioPostProduction.id);
        break;
        default:
          modal.data('audioPostProductionId', null);
        break;
      }
      modal.modal('show');
    },

    displayAnalysisDetails: function(data) {
      console.log("TCL: displayAnalysisDetails - data_ ", data);
      let cameraShotType;
      var details = 
        `<div>
          <table>
            <thead class="thead-dark">
              <tr>
                <th>Analysis Data</th>
                <th />
              </tr>
            </thead>`;
      switch (data.analysisMethod.analysisMethodType.id) {
        case 1: // Martinez Scheffel Unreliable Narration
          details +=
            `<tr>
              <td>Unreliable Narration (Martinez & Scheffel):</td>
              <td>`+data.analysisMethod.martinezScheffelUnreliableNarration.martinezScheffelUnreliableNarrationTranslations[0].type+`</td>
            </tr>`;
        break;
        case 2: // Greimas Actantial Model //* won't be implemented
        break;
        case 3: // Van Sijll Cinematic Storytelling //* won't be implemented
        break;
        case 4: // Lotman Renner Spacial Semantics //* won't be implemented
        break;
        case 5: // Genette Narrative Discourse //* won't be implemented
        break;
        case 6: // Stanzel Narrative Situations //* won't be implemented
        break;
        case 7: // Color Temperature
          details +=
            `<tr>
              <td>Color temperature:</td>
              <td>`+data.analysisMethod.colorTemperature.colorTemperatureTranslations[0].name+`</td>
            </tr>`;
        break;
        case 8: // Concept Camera Position and Perspective
          let cameraDistance = (data.analysisMethod.conceptCameraPositionAndPerspective.cameraDistance == null) ? '' : data.analysisMethod.conceptCameraPositionAndPerspective.cameraDistance.cameraDistanceTranslations[0].name;
          cameraShotType = (data.analysisMethod.conceptCameraPositionAndPerspective.cameraShotType == null) ? '' : data.analysisMethod.conceptCameraPositionAndPerspective.cameraShotType.cameraShotTypeTranslations[0].name;
          let cameraVerticalAngle = (data.analysisMethod.conceptCameraPositionAndPerspective.cameraVerticalAngle == null) ? '' : data.analysisMethod.conceptCameraPositionAndPerspective.cameraVerticalAngle.cameraVerticalAngleTranslations[0].name;
          let cameraHorizontalAngle = (data.analysisMethod.conceptCameraPositionAndPerspective.cameraHorizontalAngle == null) ? '' : data.analysisMethod.conceptCameraPositionAndPerspective.cameraHorizontalAngle.cameraHorizontalAngleTranslations[0].name;
          let cameraAxisOfAction = (data.analysisMethod.conceptCameraPositionAndPerspective.cameraAxisOfAction == null) ? '' : data.analysisMethod.conceptCameraPositionAndPerspective.cameraAxisOfAction.cameraAxisOfActionTranslations[0].name;
          let cameraElevation = (data.analysisMethod.conceptCameraPositionAndPerspective.cameraElevation == null) ? '' : data.analysisMethod.conceptCameraPositionAndPerspective.cameraElevation.cameraElevationTranslations[0].name;
          details +=
          `<tr>
            <td>Camera distance</td>
            <td>`+cameraDistance+`</td>
          </tr>
          <tr>
            <td>Camera shot type</td>
            <td>`+cameraShotType+`</td>
          </tr>
          <tr>
            <td>Camera vertical angle</td>
            <td>`+cameraVerticalAngle+`</td>
          </tr>
          <tr>
            <td>Camera horizontal angle</td>
            <td>`+cameraHorizontalAngle+`</td>
          </tr>
          <tr>
            <td>Camera axis of action</td>
            <td>`+cameraAxisOfAction+`</td>
          </tr>
          <tr>
            <td>Camera elevation</td>
            <td>`+cameraElevation+`</td>
          </tr>`;
        break;
        case 9: // Camera Elevation
          details +=
            `<tr>
              <td>Camera elevation:</td>
              <td>`+data.analysisMethod.cameraElevation.cameraElevationTranslations[0].name+`</td>
            </tr>`;
        break;
        case 10: // Camera Axis of Action
          details +=
            `<tr>
              <td>Camera axis of action:</td>
              <td>`+data.analysisMethod.cameraAxisOfAction.cameraAxisOfActionTranslations[0].name+`</td>
            </tr>`;
        break;
        case 11: // Camera Horizontal Angle
          details +=
            `<tr>
              <td>Camera horizontal angle:</td>
              <td>`+data.analysisMethod.cameraHorizontalAngle.cameraHorizontalAngleTranslations[0].name+`</td>
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
            </tr>`;
        break;
        case 14: // Camera Distance
          details +=
            `<tr>
              <td>Camera distance:</td>
              <td>`+data.analysisMethod.cameraDistance.cameraDistanceTranslations[0].name+`</td>
            </tr>`;
        break;
        case 15: // Concept Camera Movement and Handling //* won't be implemented
        break;
        case 16: // Camera Movement
          let cameraMovementType = (data.analysisMethod.cameraMovement.cameraMovementType == null) ? '' : data.analysisMethod.cameraMovement.cameraMovementType.cameraMovementTypeTranslations[0].type;
          let cameraMovementCharacteristic = (data.analysisMethod.cameraMovement.cameraMovementCharacteristic == null) ? '' : data.analysisMethod.cameraMovement.cameraMovementCharacteristic.cameraMovementCharacteristicTranslations[0].type;
          let cameraHandling = (data.analysisMethod.cameraMovement.cameraHandling == null) ? '' : data.analysisMethod.cameraMovement.cameraHandling.cameraHandlingTranslations[0].type;
          let conceptDirection = (data.analysisMethod.cameraMovement.conceptDirection == null) ? '' : data.analysisMethod.cameraMovement.conceptDirection.conceptDirectionTranslations[0].type;
          let startCameraDistance = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraDistance == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraDistance.cameraDistanceTranslations[0].name;
          let startCameraShotType = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraShotType == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraShotType.cameraShotTypeTranslations[0].name;
          let startCameraVerticalAngle = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraVerticalAngle == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraVerticalAngle.cameraVerticalAngleTranslations[0].name;
          let startCameraHorizontalAngle = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraHorizontalAngle == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraHorizontalAngle.cameraHorizontalAngleTranslations[0].name;
          let startCameraAxisOfAction = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraAxisOfAction == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraAxisOfAction.cameraAxisOfActionTranslations[0].name;
          let startCameraElevation = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraElevation == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraElevation.cameraElevationTranslations[0].name;
          let endCameraDistance = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraDistance == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraDistance.cameraDistanceTranslations[0].name;
          let endCameraShotType = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraShotType == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraShotType.cameraShotTypeTranslations[0].name;
          let endCameraVerticalAngle = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraVerticalAngle == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraVerticalAngle.cameraVerticalAngleTranslations[0].name;
          let endCameraHorizontalAngle = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraHorizontalAngle == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraHorizontalAngle.cameraHorizontalAngleTranslations[0].name;
          let endCameraAxisOfAction = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraAxisOfAction == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraAxisOfAction.cameraAxisOfActionTranslations[0].name;
          let endCameraElevation = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraElevation == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraElevation.cameraElevationTranslations[0].name;
          details +=
                `<tr>
                  <td>Camera movement type</td>
                  <td>`+cameraMovementType+`</td>
                </tr>
                <tr>
                  <td>Camera movement characteristic</td>
                  <td>`+cameraMovementCharacteristic+`</td>
                </tr>
                <tr>
                  <td>Camera handling</td>
                  <td>`+cameraHandling+`</td>
                </tr>
                <tr>
                  <td>Concept direction</td>
                  <td>`+conceptDirection+`</td>
                </tr>
              </table>
            </div>
            <div>
              <table>
                <thead class="thead-dark">
                  <tr>
                    <th>Start camera Position and Perspective</th>
                    <th />
                  </tr>
                </thead>
                <tr>
                  <td>Camera distance</td>
                  <td>`+startCameraDistance+`</td>
                </tr>
                <tr>
                  <td>Camera shot type</td>
                  <td>`+startCameraShotType+`</td>
                </tr>
                <tr>
                  <td>Camera vertical angle</td>
                  <td>`+startCameraVerticalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera horizontal angle</td>
                  <td>`+startCameraHorizontalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera axis of action</td>
                  <td>`+startCameraAxisOfAction+`</td>
                </tr>
                <tr>
                  <td>Camera elevation</td>
                  <td>`+startCameraElevation+`</td>
                </tr>
              </table>
            </div>
            <div>
              <table>
                <thead class="thead-dark">
                  <tr>
                    <th>End camera Position and Perspective</th>
                    <th />
                  </tr>
                </thead>
                <tr>
                  <td>Camera distance</td>
                  <td>`+endCameraDistance+`</td>
                </tr>
                <tr>
                  <td>Camera shot type</td>
                  <td>`+endCameraShotType+`</td>
                </tr>
                <tr>
                  <td>Camera vertical angle</td>
                  <td>`+endCameraVerticalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera horizontal angle</td>
                  <td>`+endCameraHorizontalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera axis of action</td>
                  <td>`+endCameraAxisOfAction+`</td>
                </tr>
                <tr>
                  <td>Camera elevation</td>
                  <td>`+endCameraElevation+`</td>
                </tr>`;
        break;
        case 17: // Camera Handling
          details +=
            `<tr>
              <td>Camera handling:</td>
              <td>`+data.analysisMethod.cameraHandling.cameraHandlingTranslations[0].type+`</td>
            </tr>`;
        break;
        case 18: // Zelizer Beese Voice of the Visual //* won't be implemented
        break;
        case 19: // Barthes Rhetoric of the Image //* won't be implemented
        break;
        case 20: // Sound Effect Descriptive
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
            </tr>`;
        break;
        case 21: // Analysis Ambient Sound
        break;
        case 22: // Analysis Music
          let articulation = (data.analysisMethod.analysisMusic.articulation == null) ? '' : data.analysisMethod.analysisMusic.articulation.articulationTranslations[0].type;
          let dynamicMarking = (data.analysisMethod.analysisMusic.dynamicMarking == null) ? '' : data.analysisMethod.analysisMusic.dynamicMarking.dynamicMarkingTranslations[0].type;
          let changeInDynamics = (data.analysisMethod.analysisMusic.changeInDynamics == null ) ? '' : data.analysisMethod.analysisMusic.changeInDynamics.changeInDynamicsTranslations[0].type;
          let changeInTempo = (data.analysisMethod.analysisMusic.changeInTempo == null) ? '' : data.analysisMethod.analysisMusic.changeInTempo.changeInTempoTranslations[0].type;
          let tempoMarking = (data.analysisMethod.analysisMusic.tempoMarking == null) ? '' : data.analysisMethod.analysisMusic.tempoMarking.tempoMarkingTranslations[0].type;
          let musicalKey = (data.analysisMethod.analysisMusic.musicalKey == null) ? '' : data.analysisMethod.analysisMusic.musicalKey.musicalKeyTranslations[0].type;
          let rhythm = (data.analysisMethod.analysisMusic.rhythm == null) ? '' : data.analysisMethod.analysisMusic.rhythm.type;
          let timbre = (data.analysisMethod.analysisMusic.timbre == null) ? '' : data.analysisMethod.analysisMusic.timbre.id;
          let jins = (data.analysisMethod.analysisMusic.jins == null) ? '' : data.analysisMethod.analysisMusic.jins.jinsTranslations[0].type;
          let maqamType = (data.analysisMethod.analysisMusic.maqam == null) ? '' : data.analysisMethod.analysisMusic.maqam.maqamType.maqamTypeTranslations[0].type;
          let maqamSubtype = (data.analysisMethod.analysisMusic.maqam == null) ? '' : data.analysisMethod.analysisMusic.maqam.maqamSubtype.maqamSubtypeTranslations[0].subtype;
          let songStructure = (data.analysisMethod.analysisMusic.songStructure == null) ? '' : data.analysisMethod.analysisMusic.songStructure;
          let lineupMembers = (data.analysisMethod.analysisMusic.lineupMembers == null) ? '' : data.analysisMethod.analysisMusic.lineupMembers;
          let musicalNotations = (data.analysisMethod.analysisMusic.musicalNotations == null) ? '' : data.analysisMethod.analysisMusic.musicalNotations;
          details +=
          `<tr>
            <td>Harmony</td>
            <td>`+data.analysisMethod.analysisMusic.harmony+`</td>
          </tr>
          <tr>
            <td>Is a Pause</td>
            <td>`+data.analysisMethod.analysisMusic.isPause+`</td>
          </tr>
          <tr>
            <td>Melody</td>
            <td>`+data.analysisMethod.analysisMusic.melody+`</td>
          </tr>
          <tr>
            <td>Articulation</td>
            <td>`+articulation+`</td>
          </tr>
          <tr>
            <td>Dynamic Marking</td>
            <td>`+dynamicMarking+`</td>
          </tr>
          <tr>
            <td>Change in Dynamics</td>
            <td>`+changeInDynamics+`</td>
          </tr>
          <tr>
            <td>Music Tempo</td>
            <td>`+data.analysisMethod.analysisMusic.tempo+`</td>
          </tr>
          <tr>
            <td>Change in Tempo</td>
            <td>`+changeInTempo+`</td>
          </tr>
          <tr>
            <td>Tempo Marking</td>
            <td>`+tempoMarking+`</td>
          </tr>
          <tr>
            <td>Musical Key</td>
            <td>`+musicalKey+`</td>
          </tr>
          <tr>
            <td>Rhythm</td>
            <td>`+rhythm+`</td>
          </tr>
          <tr>
            <td>Timbre [WIP]</td>
            <td>`+timbre+`</td>
          </tr>
          <tr>
            <td>Jins</td>
            <td>`+jins+`</td>
          </tr>
          <tr>
            <td>Maqam</td>
            <td><div>`+maqamType+`</div>
                <div>`+maqamSubtype+`</div>
            </td>
          </tr>
          <tr>
            <td>Song Structure [WIP]</td>
            <td>`+songStructure+`</td>
          </tr>
          <tr>
            <td>Lineup Members [WIP]</td>
            <td>`+lineupMembers+`</td>
          </tr>
          <tr>
            <td>Musical Notation [WIP]</td>
            <td>`+musicalNotations+`</td>
          </tr>
        </table>
      </div>
      <div>
        <table>
          <thead class="thead-dark">
            <tr>
              <th>Post Production</th>
              <th />
            </tr>
          </thead>
          <tr>
            <td>Overdubbing</td>
            <td>`+data.analysisMethod.analysisMusic.audioPostProduction.audioPostProductionTranslations[0].overdubbing+`</td>
          </tr>
          <tr>
            <td>Reverb</td>
            <td>`+data.analysisMethod.analysisMusic.audioPostProduction.audioPostProductionTranslations[0].reverb+`</td>
          </tr>
          <tr>
            <td>Delay</td>
            <td>`+data.analysisMethod.analysisMusic.audioPostProduction.audioPostProductionTranslations[0].delay+`</td>
          </tr>
          <tr>
            <td>Panning</td>
            <td>`+data.analysisMethod.analysisMusic.audioPostProduction.audioPostProductionTranslations[0].panning+`</td>
          </tr>
          <tr>
            <td>Bass</td>
            <td>`+data.analysisMethod.analysisMusic.audioPostProduction.audioPostProductionTranslations[0].bass+`</td>
          </tr>
          <tr>
            <td>Treble</td>
            <td>`+data.analysisMethod.analysisMusic.audioPostProduction.audioPostProductionTranslations[0].treble+`</td>
          </tr>`;
        break;
        case 23: // Analysis Speech
        details +=
            `<tr>
              <td>Accent</td>
              <td>`+data.analysisMethod.analysisSpeech.accent+`</td>
            </tr>
            <tr>
              <td>Intonation</td>
              <td>`+data.analysisMethod.analysisSpeech.intonation+`</td>
            </tr>
            <tr>
              <td>Volume</td>
              <td>`+data.analysisMethod.analysisSpeech.volume+`</td>
            </tr>
            <tr>
              <td>Speech tempo</td>
              <td>`+data.analysisMethod.analysisSpeech.tempo+`</td>
            </tr>
            <tr>
              <td>Pauses</td>
              <td>`+data.analysisMethod.analysisSpeech.pauses+`</td>
            </tr>
            <tr>
              <td>Timbre</td>
              <td>`+data.analysisMethod.analysisSpeech.timbre+`</td>
            </tr>
          </table>
        </div>
        <div>
          <table>
            <thead class="thead-dark">
              <tr>
                <th>Post Production</th>
                <th />
              </tr>
            </thead>
            <tr>
              <td>Overdubbing</td>
              <td>`+data.analysisMethod.analysisSpeech.audioPostProduction.audioPostProductionTranslations[0].overdubbing+`</td>
            </tr>
            <tr>
              <td>Reverb</td>
              <td>`+data.analysisMethod.analysisSpeech.audioPostProduction.audioPostProductionTranslations[0].reverb+`</td>
            </tr>
            <tr>
              <td>Delay</td>
              <td>`+data.analysisMethod.analysisSpeech.audioPostProduction.audioPostProductionTranslations[0].delay+`</td>
            </tr>
            <tr>
              <td>Panning</td>
              <td>`+data.analysisMethod.analysisSpeech.audioPostProduction.audioPostProductionTranslations[0].panning+`</td>
            </tr>
            <tr>
              <td>Bass</td>
              <td>`+data.analysisMethod.analysisSpeech.audioPostProduction.audioPostProductionTranslations[0].bass+`</td>
            </tr>
            <tr>
              <td>Treble</td>
              <td>`+data.analysisMethod.analysisSpeech.audioPostProduction.audioPostProductionTranslations[0].treble+`</td>
            </tr>`;
        break;
        case 24: // Analysis Voice
        break;
        case 25: // Lighting type
        break;
        case 26: // Montage Figure Macro - Part of 34: Editing / Montage
        break;
        case 27: // Montage Figure Micro - Part of 34: Editing / Montage
        break;
        case 28: // Take Junction - Part of 34: Editing / Montage
        break;
        case 29: // Editing Rhythm - Part of 34: Editing / Montage
        break;
        case 30: // Take Length - Part of 34: Editing / Montage
        details +=
            `<tr>
              <td>Take length</td>
              <td>`+data.analysisMethod.takeLength.text+`</td>
            </tr>`;
        break;
        case 31: // Take Type Progression - Part of 34: Editing / Montage
        break;
        case 32: // Playback Speed - Part of 34: Editing / Montage
        break;
        case 33: // Image Cadre Editing - Part of 34: Editing / Montage
        break;
        case 34: // Editing / Montage
          let montageFigureMacro = (data.analysisMethod.editingMontage.montageFigureMacro == null) ? '' : data.analysisMethod.editingMontage.montageFigureMacro.montageFigureMacroTranslations[0].name;
          let montageFigureMicro = (data.analysisMethod.editingMontage.montageFigureMicro == null) ? '' : data.analysisMethod.editingMontage.montageFigureMicro.montageFigureMicroTranslations[0].name;
          let takeJunction = (data.analysisMethod.editingMontage.takeJunction == null) ? '' : data.analysisMethod.editingMontage.takeJunction.takeJunctionTranslations[0].name;
          let editingRhythm = (data.analysisMethod.editingMontage.editingRhythm == null) ? '' : data.analysisMethod.editingMontage.editingRhythm.editingRhythmTranslations[0].name;
          let takeLength = (data.analysisMethod.editingMontage.takeLength == null) ? '' : data.analysisMethod.editingMontage.takeLength.text;
          let takeTypeProgression = (data.analysisMethod.editingMontage.takeTypeProgression == null) ? '' : data.analysisMethod.editingMontage.takeTypeProgression.takeTypeProgressionTranslations[0].name;
          cameraShotType = (data.analysisMethod.editingMontage.cameraShotType == null) ? '' : data.analysisMethod.editingMontage.cameraShotType.cameraShotTypeTranslations[0].name;
          let playbackSpeed = (data.analysisMethod.editingMontage.playbackSpeed == null) ? '' : data.analysisMethod.editingMontage.playbackSpeed.playbackSpeedTranslations[0].name;
          let imageCadreEditing = (data.analysisMethod.editingMontage.imageCadreEditing == null) ? '' : data.analysisMethod.editingMontage.imageCadreEditing.imageCadreEditingTranslations[0].name;
          details +=
          `<tr>
            <td>Montage figure macro</td>
            <td>`+montageFigureMacro+`</td>
          </tr>
          <tr>
            <td>Montage figure micro</td>
            <td>`+montageFigureMicro+`</td>
          </tr>
          <tr>
            <td>Take junction</td>
            <td>`+takeJunction+`</td>
          </tr>
          <tr>
            <td>Editing Rhythm</td>
            <td>`+editingRhythm+`</td>
          </tr>
          <tr>
            <td>Take length</td>
            <td>`+takeLength+`</td>
          </tr>
          <tr>
            <td>Take type progression</td>
            <td>`+takeTypeProgression+`</td>
          </tr>
          <tr>
            <td>Camera shot type:</td>
            <td>`+cameraShotType+`</td>
          </tr>
          <tr>
            <td>Playback speed</td>
            <td>`+playbackSpeed+`</td>
          </tr>
          <tr>
            <td>Image cadre editing</td>
            <td>`+imageCadreEditing+`</td>
          </tr>`;
        break;
        case 35: // Concept Direction
        break;
        case 36: // Camera Movement Characteristic
        break;
        case 37: // Camera Movement Type
        break;
        case 38: // Light Position General - Part of 43: Lighting
        break;
        case 39: // Light Position Angle Horizontal - Part of 43: Lighting
        break;
        case 40: // Light Position Angle Vertical - Part of 43: Lighting
        break;
        case 41: // Light Modifier - Part of 43: Lighting
        break;
        case 42: // Lighting Duration - Part of 43: Lighting
        break;
        case 43: // Lighting
          let lightingType = (data.analysisMethod.lighting.lightingType == null) ? '' : data.analysisMethod.lighting.lightingType.lightingTypeTranslations[0].name;
          let lightPosition = (data.analysisMethod.lighting.lightPosition == null) ? '' : data.analysisMethod.lighting.lightPosition.lightPositionTranslations[0].name;
          let lightPositionAngleHorizontal = (data.analysisMethod.lighting.lightPositionAngleHorizontal == null) ? '' : data.analysisMethod.lighting.lightPositionAngleHorizontal.lightPositionAngleHorizontalTranslations[0].name;
          let lightPositionAngleVertical = (data.analysisMethod.lighting.lightPositionAngleVertical == null) ? '' : data.analysisMethod.lighting.lightPositionAngleVertical.lightPositionAngleVerticalTranslations[0].name;
          let lightModifier = (data.analysisMethod.lighting.lightModifier == null) ? '' : data.analysisMethod.lighting.lightModifier.lightModifierTranslations[0].name;
          let lightingDuration = (data.analysisMethod.lighting.lightingDuration == null) ? '' : data.analysisMethod.lighting.lightingDuration.lightingDurationTranslations[0].name;
          details +=
          `<tr>
            <td>Lighting type</td>
            <td>`+lightingType+`</td>
          </tr>
          <tr>
            <td>Lighting position</td>
            <td>`+lightPosition+`</td>
          </tr>
          <tr>
            <td>Light position horizontal angle</td>
            <td>`+lightPositionAngleHorizontal+`</td>
          </tr>
          <tr>
            <td>Light position vertical angle</td>
            <td>`+lightPositionAngleVertical+`</td>
          </tr>
          <tr>
            <td>Light modifier</td>
            <td>`+lightModifier+`</td>
          </tr>
          <tr>
            <td>Lighting duration</td>
            <td>`+lightingDuration+`</td>
          </tr>`;
        break;
      }
      // add analysis table fields
      details += `
          </table>
        </div>
        <div>
          <table>
            <thead class="thead-dark">
              <tr>
                <th>Remark</th>
              </tr>
            </thead>
            <tr>
              <td>`+data.remark+`</td>
            </tr>
          </table>
        </div>`;
      return details;
    },

    setupAnalysisMethodsDataTable: function() {
      TIMAAT.AnalysisDatasets.dataTableAnalysisMethods = $('#analysis-methods-available-table').DataTable({
				lengthChange: false,
				dom         : 'rft<"row"<"col-sm-10"i><"col-sm-2"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				pageLength  : 5,
				deferLoading: 0,
				pagingType  : 'full',
				order       : [[ 0, 'asc' ]],
				processing  : true,
				serverSide  : true,
				ajax        : {
					"url"        : "api/analysis/method/list/?visual=false&audio=false",
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
					let analysisMethodTypeElement = $(row);
					let analysisMethodType = data;
					analysisMethodTypeElement.data('analysisMethodType', analysisMethodType);

					analysisMethodTypeElement.find('.add-analysisMethod').on('click', analysisMethodType, async function(ev) {
						ev.stopPropagation();
            if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						// $(this).remove();
						TIMAAT.AnalysisDatasets.annotationAnalysisMethodAddModal(TIMAAT.VideoPlayer.curAnnotation.model.id, analysisMethodType);
						// .then((result)=>{
						// 	// inspector.ui.dataTableAnalysisMethods.ajax.reload();
							// TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
						// }).catch((error)=>{
						// });
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, analysisMethodType, meta) {
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
            if ([1,7,8,9,10,11,12,14,16,17,20,22,23,34,43].indexOf(analysisMethodType.id) > -1 && TIMAAT.VideoPlayer.curAnnotation) { //* TODO allow adding only for existing methods
              var i = 0;
              var methodIsStaticAndExists = false;
              for (; i < TIMAAT.VideoPlayer.curAnnotation.model.analysis.length; i++) {
                if (TIMAAT.VideoPlayer.curAnnotation.model.analysis[i].analysisMethod.analysisMethodType.id == analysisMethodType.id && analysisMethodType.isStatic) {
                  methodIsStaticAndExists = true;
                  break;
                }
              }
              if (!methodIsStaticAndExists) { //* static analyses may only be assigned once, others can occur multiple times
                nameDisplay += `<span class="add-analysisMethod badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw" title="Add analysis guideline"></i></span>`;
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
          "searchPlaceholder": "Search analysis guidelines",
          "processing"       : '<i class="fas fa-spinner fa-spin"></i> Loading Data...',
          "lengthMenu"       : "Show _MENU_ entries",
          "zeroRecords"      : "No analysis guidelines found.",
          "info"             : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ analysis guidelines total)",
          "infoEmpty"        : "No analysis guidelines available.",
          "infoFiltered"     : '(&mdash; _TOTAL_ of _MAX_ analysis guildelines)',
          "paginate"         : {
            "first"   : "<<",
            "previous": "<",
            "next"    : ">",
            "last"    : ">>"
          },
        },
			});
			// $(this.ui.dataTableAnalysisMethod.table().container()).find('.table-title').text('Available Analyses');
    },

    setupAnnotationAnalysisDataTable: function() {
			TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis = $('#analysis-annotation-table').DataTable({
				lengthChange: false,
				pageLength  : 10,
				dom         : 'rft<"row"<"col-sm-10"i><"col-sm-2"p>>',
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

					analysisElement.find('.remove-AnalysisMethod').on('click', analysis, async function(ev) {
						ev.stopPropagation();
            if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						// $(this).remove();
						TIMAAT.AnalysisDatasets.annotationAnalysisMethodDeleteModal(analysis);
						// TIMAAT.AnalysisService.removeAnnotationAnalysis(TIMAAT.VideoPlayer.curAnnotation.model.id, analysis.id)
						// .then((result)=>{
							// inspector.ui.dataTableAnalysisMethods.ajax.reload();
							// TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
						// }).catch((error)=>{
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
							<span class="remove-AnalysisMethod badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw" title="Remove analysis guideline"></i></span>
							</p>`;
							return nameDisplay;
						}
					}
				],
				language: {
          "decimal"          : ",",
          "thousands"        : ".",
          "search"           : "Search",
          "searchPlaceholder": "Search analysis guidelines",
          "processing"       : '<i class="fas fa-spinner fa-spin"></i> Loading Data...',
          "lengthMenu"       : "Show _MENU_ entries",
          "zeroRecords"      : "No analysis guidelines found.",
          "info"             : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ analysis guidelines total)",
          "infoEmpty"        : "No analysis guidelines available.",
          "infoFiltered"     : '(&mdash; _TOTAL_ of _MAX_ analysis guidelines)',
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