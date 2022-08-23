/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
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
      $('#analysisAddSubmitButton').on('click', async function(event) {
        event.preventDefault();
        var modal = $('#analysisAddModal');
        if (!$('#newAnalysisMethodModalForm').valid())
					return false;
        var analysisMethodTypeId = modal.data('analysisMethodTypeId');
        var annotationId = modal.data('annotationId');
        let remark = $('#analysisRemark').val();
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
          preProduction: "",
          remark: remark
        };
        var analysisMethodId;
        var analysisMethodVariantModel = {};
        var audioPostProductionModel = {};
        var audioPostProductionTranslationModel = {};
        var analysis;

        switch(analysisMethodTypeId) {
          case 1: // Martinez Scheffel Unreliable Narration
            analysisMethodId = Number($('#martinezScheffelUnreliableNarrationSelectDropdown').val());
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
            analysisMethodId = Number($('#colorTemperatureSelectDropdown').val());
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
              cameraElevation: null,
              cameraDepthOfFocus: null,
            };
            (Number($('#cameraDistanceSelectDropDown').val()) == 0) ? null : analysisMethodVariantModel.cameraDistance = { analysisMethodId: Number($('#cameraDistanceSelectDropDown').val()) };
            (Number($('#cameraShotTypeSelectDropDown').val()) == 0) ? null : analysisMethodVariantModel.cameraShotType = { analysisMethodId: Number($('#cameraShotTypeSelectDropDown').val()) };
            (Number($('#cameraVerticalAngleSelectDropDown').val()) == 0) ? null : analysisMethodVariantModel.cameraVerticalAngle = { analysisMethodId: Number($('#cameraVerticalAngleSelectDropDown').val()) };
            (Number($('#cameraHorizontalAngleSelectDropDown').val()) == 0) ? null : analysisMethodVariantModel.cameraHorizontalAngle = { analysisMethodId: Number($('#cameraHorizontalAngleSelectDropDown').val()) };
            (Number($('#cameraAxisOfActionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraAxisOfAction = { analysisMethodId: Number($('#cameraAxisOfActionSelectDropdown').val()) };
            (Number($('#cameraElevationSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraElevation = { analysisMethodId: Number($('#cameraElevationSelectDropdown').val()) };
            (Number($('#cameraDepthOfFocusSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraDepthOfFocus = { analysisMethodId: Number($('#cameraDepthOfFocusSelectDropdown').val()) };

            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.conceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "conceptCameraPositionAndPerspective");
          break;
          case 9: // Camera Elevation
            analysisMethodId = Number($('#cameraElevationSelectDropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 10: // Camera Axis of Action
            analysisMethodId = Number($('#cameraAxisOfActionSelectDropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 11: // Camera Horizontal Angle
            analysisMethodId = Number($('#cameraHorizontalAngleSelectDropDown').val());
            analysisModel.analysisMethod.id = analysisMethodId;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 12: // Camera Vertical Angle
            analysisMethodId = Number($('#cameraVerticalAngleSelectDropDown').val());
            analysisModel.analysisMethod.id = analysisMethodId;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 13: // Camera Shot Type
            analysisMethodId = Number($('#cameraShotTypeSelectDropDown').val());
            analysisModel.analysisMethod.id = analysisMethodId;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
          case 14: // Camera Distance
            analysisMethodId = Number($('#cameraDistanceSelectDropDown').val());
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
            cameraElevation: null,
            cameraDepthOfFocus: null
          };
          let endConceptCameraPositionAndPerspectiveModel = {
            analysisMethodId: 0,
            cameraDistance: null,
            cameraShotType: null,
            cameraVerticalAngle: null,
            cameraHorizontalAngle: null,
            cameraAxisOfAction: null,
            cameraElevation: null,
            cameraDepthOfFocus: null
          };
          (Number($('#cameraMovementTypeSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraMovementType = { analysisMethodId: Number($('#cameraMovementTypeSelectDropdown').val()) };
          (Number($('#cameraMovementCharacteristicSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraMovementCharacteristic = { analysisMethodId: Number($('#cameraMovementCharacteristicSelectDropdown').val()) };
          (Number($('#cameraHandlingSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.cameraHandling = { analysisMethodId: Number($('#cameraHandlingSelectDropdown').val()) };
          (Number($('#conceptDirectionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.conceptDirection = { analysisMethodId: Number($('#conceptDirectionSelectDropdown').val()) };
          (Number($('#startCameraDistanceSelectDropDown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraDistance = { analysisMethodId: Number($('#startCameraDistanceSelectDropDown').val()) };
          (Number($('#startCameraShotTypeSelectDropDown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraShotType = { analysisMethodId: Number($('#startCameraShotTypeSelectDropDown').val()) };
          (Number($('#startCameraVerticalAngleSelectDropDown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraVerticalAngle = { analysisMethodId: Number($('#startCameraVerticalAngleSelectDropDown').val()) };
          (Number($('#startCameraHorizontalAngleSelectDropDown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraHorizontalAngle = { analysisMethodId: Number($('#startCameraHorizontalAngleSelectDropDown').val()) };
          (Number($('#startCameraAxisOfActionSelectDropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraAxisOfAction = { analysisMethodId: Number($('#startCameraAxisOfActionSelectDropdown').val()) };
          (Number($('#startCameraElevationSelectDropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraElevation = { analysisMethodId: Number($('#startCameraElevationSelectDropdown').val()) };
          (Number($('#startCameraDepthOfFocusSelectDropdown').val()) == 0) ? null : startConceptCameraPositionAndPerspectiveModel.cameraDepthOfFocus = { analysisMethodId: Number($('#startCameraDepthOfFocusSelectDropdown').val()) };
          (Number($('#endCameraDistanceSelectDropDown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraDistance = { analysisMethodId: Number($('#endCameraDistanceSelectDropDown').val()) };
          (Number($('#endCameraShotTypeSelectDropDown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraShotType = { analysisMethodId: Number($('#endCameraShotTypeSelectDropDown').val()) };
          (Number($('#endCameraVerticalAngleSelectDropDown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraVerticalAngle = { analysisMethodId: Number($('#endCameraVerticalAngleSelectDropDown').val()) };
          (Number($('#endCameraHorizontalAngleSelectDropDown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraHorizontalAngle = { analysisMethodId: Number($('#endCameraHorizontalAngleSelectDropDown').val()) };
          (Number($('#endCameraAxisOfActionSelectDropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraAxisOfAction = { analysisMethodId: Number($('#endCameraAxisOfActionSelectDropdown').val()) };
          (Number($('#endCameraElevationSelectDropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraElevation = { analysisMethodId: Number($('#endCameraElevationSelectDropdown').val()) };
          (Number($('#endCameraDepthOfFocusSelectDropdown').val()) == 0) ? null : endConceptCameraPositionAndPerspectiveModel.cameraDepthOfFocus = { analysisMethodId: Number($('#endCameraDepthOfFocusSelectDropdown').val()) };
          let startConceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(startConceptCameraPositionAndPerspectiveModel, 'conceptCameraPositionAndPerspective');
          analysisMethodVariantModel.startConceptCameraPositionAndPerspective.analysisMethodId = startConceptCameraPositionAndPerspective.analysisMethodId;
          let endConceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(endConceptCameraPositionAndPerspectiveModel, 'conceptCameraPositionAndPerspective');
          analysisMethodVariantModel.endConceptCameraPositionAndPerspective.analysisMethodId = endConceptCameraPositionAndPerspective.analysisMethodId;
          analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
          analysis.analysisMethod.conceptCameraPositionAndPerspective = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "cameraMovement");
          break;
          case 17: // Camera Handling
            analysisMethodId = Number($('#cameraHandlingSelectDropdown').val());
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
              answerQ1: $('#soundEffectDescriptiveAnswerQ1').val(),
              answerQ2: $('#soundEffectDescriptiveAnswerQ2').val(),
              answerQ3: $('#soundEffectDescriptiveAnswerQ3').val(),
              answerQ4: $('#soundEffectDescriptiveAnswerQ4').val(),
              answerQ5: $('#soundEffectDescriptiveAnswerQ5').val(),
              answerQ6: $('#soundEffectDescriptiveAnswerQ6').val()
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
              harmony: $('#analysisMusicHarmony').val(),
              isPause: $('#analysisMusicIsPause').prop('checked'),
              melody: $('#analysisMusicMelody').val(),
              tempo: $('#analysisMusicTempo').val(),
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
            (Number($('#analysisMusicArticulationSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.articulation = { id: Number($('#analysisMusicArticulationSelectDropdown').val()) };
            (Number($('#analysisMusicDynamicMarkingSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.dynamicMarking = { id:  Number($('#analysisMusicDynamicMarkingSelectDropdown').val())};
            (Number($('#analysisMusicChangeInDynamicsSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.changeInDynamics = { id:  Number($('#analysisMusicChangeInDynamicsSelectDropdown').val())};
            (Number($('#analysisMusicChangeInTempoSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.changeInTempo = { id: Number($('#analysisMusicChangeInTempoSelectDropdown').val())};
            (Number($('#analysisMusicTempoMarkingSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.tempoMarking = { id: Number($('#analysisMusicTempoMarkingSelectDropdown').val())};
            (Number($('#analysisMusicMusicalKeySelectDropdown').val()) == 0 ) ? null : analysisMethodVariantModel.musicalKey = { id: Number($('#analysisMusicMusicalKeySelectDropdown').val())};
            (Number($('#analysisMusicRhythmSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.rhythm = { id: Number($('#analysisMusicRhythmSelectDropdown').val())};
            (Number($('#analysisMusicTimbreSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.timbre = { id: Number($('#analysisMusicTimbreSelectDropdown').val())};
            (Number($('#analysisMusicJinsSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.jins = { id: Number($('#analysisMusicJinsSelectDropdown').val())};
            (Number($('#analysisMusicMaqamSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.maqam = { id: Number($('#analysisMusicMaqamSelectDropdown').val())};
            (Number($('#analysisMusicSongStructureSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.songStructure = { id: Number($('#analysisMusicSongStructureSelectDropdown').val())};
            (Number($('#analysisMusicLineupMembersSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.lineupMembers = [{ id: Number($('#analysisMusicLineupMembersSelectDropdown').val())}];
            (Number($('#analysisMusicMusicalNotationsSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.musicalNotations = [{ id: Number($('#analysisMusicMusicalNotationsSelectDropdown').val())}];
            audioPostProductionTranslationModel = {
              id: 0,
              audioPostProduction: {
                id: 0
              },
              language: {
                id: 1 // TODO
              },
              overdubbing: $('#audioPostProductionOverdubbing').val(),
              reverb: $('#audioPostProductionReverb').val(),
              delay: $('#audioPostProductionDelay').val(),
              panning: $('#audioPostProductionPanning').val(),
              bass: $('#audioPostProductionBass').val(),
              treble: $('#audioPostProductionTreble').val(),
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
              accent: $('#analysisSpeechAccent').val(),
              intonation: $('#analysisSpeechIntonation').val(),
              volume: $('#analysisSpeechVolume').val(),
              tempo: $('#analysisSpeechTempo').val(),
              pauses: $('#analysisSpeechPauses').val(),
              timbre: $('#analysisSpeechTimbre').val(),
            };
            audioPostProductionTranslationModel = {
              id: 0,
              audioPostProduction: {
                id: 0
              },
              language: {
                id: 1 // TODO
              },
              overdubbing: $('#audioPostProductionOverdubbing').val(),
              reverb: $('#audioPostProductionReverb').val(),
              delay: $('#audioPostProductionDelay').val(),
              panning: $('#audioPostProductionPanning').val(),
              bass: $('#audioPostProductionBass').val(),
              treble: $('#audioPostProductionTreble').val(),
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
            (Number($('#montageFigureMacroSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.montageFigureMacro = { analysisMethodId: Number($('#montageFigureMacroSelectDropdown').val()) };
            (Number($('#montageFigureMicroSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.montageFigureMicro = { analysisMethodId: Number($('#montageFigureMicroSelectDropdown').val()) };
            (Number($('#takeJunctionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.takeJunction = { analysisMethodId: Number($('#takeJunctionSelectDropdown').val()) };
            (Number($('#editingRhythmSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.editingRhythm = { analysisMethodId: Number($('#editingRhythmSelectDropdown').val()) };
            (Number($('#takeTypeProgressionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.takeTypeProgression = { analysisMethodId: Number($('#takeTypeProgressionSelectDropdown').val()) };
            (Number($('#cameraShotTypeSelectDropDown').val()) == 0) ? null : analysisMethodVariantModel.cameraShotType = { analysisMethodId: Number($('#cameraShotTypeSelectDropDown').val()) };
            (Number($('#playbackSpeedSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.playbackSpeed = { analysisMethodId: Number($('#playbackSpeedSelectDropdown').val()) };
            (Number($('#imageCadreEditingSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.imageCadreEditing = { analysisMethodId: Number($('#imageCadreEditingSelectDropdown').val()) };
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
            (Number($('#lightingTypeSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.lightingType = { analysisMethodId: Number($('#lightingTypeSelectDropdown').val()) };
            (Number($('#lightPositionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.lightPosition = { analysisMethodId: Number($('#lightPositionSelectDropdown').val()) };
            (Number($('#lightPositionAngleHorizontalSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.lightPositionAngleHorizontal = { analysisMethodId: Number($('#lightPositionAngleHorizontalSelectDropdown').val()) };
            (Number($('#lightPositionAngleVerticalSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.lightPositionAngleVertical = { analysisMethodId: Number($('#lightPositionAngleVerticalSelectDropdown').val()) };
            (Number($('#lightModifierSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.lightModifier = { analysisMethodId: Number($('#lightModifierSelectDropdown').val()) };
            (Number($('#lightingDurationSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.lightingDuration = { analysisMethodId: Number($('#lightingDurationSelectDropdown').val()) };

            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.lighting = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "lighting");
            // console.log("TCL: $ ->  analysis.analysisMethod",  analysis.analysisMethod);
          break;
          case 44: // AnalysisActor
            analysisMethodVariantModel = {
              analysisMethodId: 0,
              actingTechnique: null,
              facialExpression: null,
              facialExpressionIntensity: null,
              gesturalEmotion: null,
              gesturalEmotionIntensity: null,
              physicalExpression: null,
              physicalExpressionIntensity: null
            };
            (Number($('#actingTechniqueSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.actingTechnique = { analysisMethodId: Number($('#actingTechniqueSelectDropdown').val()) };
            (Number($('#facialExpressionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.facialExpression = { analysisMethodId: Number($('#facialExpressionSelectDropdown').val()) };
            (Number($('#facialExpressionIntensitySelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.facialExpressionIntensity = { analysisMethodId: Number($('#facialExpressionIntensitySelectDropdown').val()) };
            (Number($('#gesturalEmotionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.gesturalEmotion = { analysisMethodId: Number($('#gesturalEmotionSelectDropdown').val()) };
            (Number($('#gesturalEmotionIntensitySelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.gesturalEmotionIntensity = { analysisMethodId: Number($('#gesturalEmotionIntensitySelectDropdown').val()) };
            (Number($('#physicalExpressionSelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.physicalExpression = { analysisMethodId: Number($('#physicalExpressionSelectDropdown').val()) };
            (Number($('#physicalExpressionIntensitySelectDropdown').val()) == 0) ? null : analysisMethodVariantModel.physicalExpressionIntensity = { analysisMethodId: Number($('#physicalExpressionIntensitySelectDropdown').val()) };

            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
            analysisMethodVariantModel.analysisMethodId = analysis.analysisMethod.id;
            analysis.analysisMethod.analysisActor = await TIMAAT.AnalysisService.createAnalysisMethodVariant(analysisMethodVariantModel, "analysisActor");
            // console.log("TCL: $ ->  analysis.analysisMethod",  analysis.analysisMethod);
          break;
          case 45: // Acting Technique - Part of 44: Analysis Actor
          break;
          case 46: // Facial Expression - Part of 44: Analysis Actor
          break;
          case 47: // Facial Expression Intensity - Part of 44: Analysis Actor
          break;
          case 48: // Gestural Emotion - Part of 44: Analysis Actor
          break;
          case 49: // Gestural Emotion Intensity - Part of 44: Analysis Actor
          break;
          case 50: // Physical Expression - Part of 44: Analysis Actor
          break;
          case 51: // Physical Expression Intensity - Part of 44: Analysis Actor
          break;
          case 52: // Camera Depth of Focus - Part of 8: Concept Camera Position and Perspective
            analysisMethodId = Number($('#cameraDepthOfFocusSelectDropdown').val());
            analysisModel.analysisMethod.id = analysisMethodId;
            analysis = await TIMAAT.AnalysisService.addAnalysisMethodToAnalysis(analysisModel);
          break;
        }
        modal.modal('hide');
        TIMAAT.VideoPlayer.curAnnotation.model.analysis.push(analysis);
        TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload(null, false);
        TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.url('/TIMAAT/api/analysis/method/list?visual='+TIMAAT.VideoPlayer.curAnnotation.model.layerVisual+'&audio='+TIMAAT.VideoPlayer.curAnnotation.model.layerAudio);
        TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload(null, false);
        TIMAAT.VideoPlayer.inspector.setItem(TIMAAT.VideoPlayer.curAnnotation, 'annotation'); // mainly to reverse unsaved layer changes
      });

      $('#analysisGuidelineDeleteSubmitButton').on('click', async function(event) {
        event.preventDefault();
        var modal = $('#analysisGuidelineDeleteModal');
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
      $('#annotationAnalysisGuidelineTable tbody').on('click', 'td.details-control', function () {
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
      $('#annotationAnalysisGuidelineTable').on('mouseenter', 'tbody tr', function () {
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

      // event listener to close select2 dropdown when modal is closed
      $('#analysisAddModal').on('hidden.bs.modal', function() {
        $('.select-dropdown').select2('close');
      });
    },

    loadAnalysisDataTables: async function() {
      TIMAAT.AnalysisDatasets.setupAnalysisMethodsDataTable();
      TIMAAT.AnalysisDatasets.setupAnnotationAnalysisDataTable();
    },

    annotationAnalysisMethodAddModal: function(annotationId, analysisMethodType) {
      let modal = $('#analysisAddModal');
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
        <label for="audioPostProductionOverdubbing">Overdubbing</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audioPostProductionOverdubbing"
                    maxlength="255"
                    aria-label="Overdubbing"
                    name="overdubbing"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audioPostProductionReverb">Reverb</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audioPostProductionReverb"
                    maxlength="255"
                    aria-label="Reverb"
                    name="reverb"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audioPostProductionDelay">Delay</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audioPostProductionDelay"
                    maxlength="255"
                    aria-label="Delay"
                    name="delay"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audioPostProductionPanning">Panning</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audioPostProductionPanning"
                    maxlength="255"
                    aria-label="Panning"
                    name="panning"
                    placeholder="Enter description"></textarea>
        </div>
      </div>
      <div class="form-group">
        <label for="audioPostProductionBass">Bass</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audioPostProductionBass"
                    maxlength="255"
                    aria-label="Bass"
                    name="bass"
                    placeholder="Enter description"></textarea>
          </div>
      </div>
      <div class="form-group">
        <label for="audioPostProductionTreble">Treble</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="audioPostProductionTreble"
                    maxlength="255"
                    aria-label="Treble"
                    name="treble"
                    placeholder="Enter description"></textarea>
        </div>
      </div>`;
      var remarkHtml = `<hr>
      <h5 class="modal-title">Remark</h5>
      <div class="form-group">
        <label class="sr-only" for="analysisRemark">Remark</label>
        <div class="col-md-12">
          <textarea class="form-control form-control-sm"
                    id="analysisRemark"
                    aria-label="Remark"
                    placeholder="Remark"></textarea>
        </div>
      </div>`;

      switch (analysisMethodType.id) {
        case 1: // Martinez Scheffel Unreliable Narration
          $('#analysisAddLabel').text('Choose Unreliable Narration (Martinez & Scheffel)');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="martinezScheffelUnreliableNarrationSelectDropdown">Unreliable Narration</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="martinezScheffelUnreliableNarrationSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select unreliable narration"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#martinezScheffelUnreliableNarrationSelectDropdown').select2(select2Options);
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
          $('#analysisAddLabel').text('Choose Color Temperature');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="colorTemperatureSelectDropdown">Color Temperature</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="colorTemperatureSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select color temperature"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#colorTemperatureSelectDropdown').select2(select2Options);
        break;
        case 8: // Concept Camera Position and Perspective
        $('#analysisAddLabel').text('Describe Camera Position and Perspective');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <h5 class="modal-title">Camera Position and Perspective</h5>
            <div class="form-group">
            <label for="cameraDistanceSelectDropDown">Camera Distance</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraDistanceSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera distance">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="cameraShotTypeSelectDropDown">Camera Shot Type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraShotTypeSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera shot type">
                </select>
              </div>
            </div><div class="form-group">
            <label for="cameraVerticalAngleSelectDropDown">Camera Vertical Angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraVerticalAngleSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera vertical angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="cameraHorizontalAngleSelectDropDown">Camera Horizontal Angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraHorizontalAngleSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="cameraAxisOfActionSelectDropdown">Camera Axis of Action</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraAxisOfActionSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="cameraElevationSelectDropdown">Camera Elevation</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraElevationSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera elevation">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="cameraDepthOfFocusSelectDropdown">Camera Depth of Focus</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraDepthOfFocusSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera depth of focus">
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDistance/selectList/';
        $('#cameraDistanceSelectDropDown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
        $('#cameraShotTypeSelectDropDown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraVerticalAngle/selectList/';
        $('#cameraVerticalAngleSelectDropDown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHorizontalAngle/selectList/';
        $('#cameraHorizontalAngleSelectDropDown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraAxisOfAction/selectList/';
        $('#cameraAxisOfActionSelectDropdown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraElevation/selectList/';
        $('#cameraElevationSelectDropdown').select2(select2Options);
        select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDepthOfFocus/selectList/';
        $('#cameraDepthOfFocusSelectDropdown').select2(select2Options);
        break;
        case 9: // Camera Elevation
          $('#analysisAddLabel').text('Choose Camera Elevation');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="cameraElevationSelectDropdown">Camera Elevation</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="cameraElevationSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera elevation"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#cameraElevationSelectDropdown').select2(select2Options);
        break;
        case 10: // Camera Axis of Action
        $('#analysisAddLabel').text('Choose Axis of Action');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
              <label for="cameraAxisOfActionSelectDropdown">Camera Axis of Action</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraAxisOfActionSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action"
                        required>
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
        $('#cameraAxisOfActionSelectDropdown').select2(select2Options);
        break;
        case 11: // Camera Horizontal Angle
        $('#analysisAddLabel').text('Choose Camera Horizontal Angle');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
            <label for="cameraHorizontalAngleSelectDropDown">Camera Horizontal Angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraHorizontalAngleSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle"
                        required>
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
        $('#cameraHorizontalAngleSelectDropDown').select2(select2Options);
        break;
        case 12: // Camera Vertical Angle
          $('#analysisAddLabel').text('Choose Camera Vertical Angle');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="cameraVerticalAngleSelectDropDown">Camera Vertical Angle</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="cameraVerticalAngleSelectDropDown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera vertical angle"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#cameraVerticalAngleSelectDropDown').select2(select2Options);
        break;
        case 13: // Camera Shot Type - part of 34: Editing / Montage
          $('#analysisAddLabel').text('Choose Camera Shot Type');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="cameraShotTypeSelectDropDown">Camera Shot Type</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="cameraShotTypeSelectDropDown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera shot type"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#cameraShotTypeSelectDropDown').select2(select2Options);
        break;
        case 14: // Camera Distance
          $('#analysisAddLabel').text('Choose Camera Distance');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="cameraDistanceSelectDropDown">Camera Distance</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="cameraDistanceSelectDropDown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera distance"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#cameraDistanceSelectDropDown').select2(select2Options);
        break;
        case 15: // Concept Camera Movement and Handling //* won't be implemented
        break;
        case 16: // Camera Movement
        $('#analysisAddLabel').text('Describe Camera Movement');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
            <label for="cameraMovementTypeSelectDropdown">Camera Movement Type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraMovementTypeSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera movement type">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="cameraMovementCharacteristicSelectDropdown">Camera Movement Characteristic</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraMovementCharacteristicSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera movement characteristic">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="cameraHandlingSelectDropdown">Camera Handling</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="cameraHandlingSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera handling">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="conceptDirectionSelectDropdown">Concept Direction</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="conceptDirectionSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select concept direction">
                </select>
              </div>
            </div>
            <h5 class="modal-title">Start Camera Position and Perspective</h5>
            <div class="form-group">
            <label for="startCameraDistanceSelectDropDown">Camera Distance</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="startCameraDistanceSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera distance">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="startCameraShotTypeSelectDropDown">Camera Shot Type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="startCameraShotTypeSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera shot type">
                </select>
              </div>
            </div><div class="form-group">
            <label for="startCameraVerticalAngleSelectDropDown">Camera Vertical Angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="startCameraVerticalAngleSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera vertical angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="startCameraHorizontalAngleSelectDropDown">Camera Horizontal Angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="startCameraHorizontalAngleSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="startCameraAxisOfActionSelectDropdown">Camera Axis of Action</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="startCameraAxisOfActionSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="startCameraElevationSelectDropdown">Camera Elevation</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="startCameraElevationSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera elevation">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="startCameraDepthOfFocusSelectDropdown">Camera Depth of Focus</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="startCameraDepthOfFocusSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera depth of focus">
                </select>
              </div>
            </div>
            <h5 class="modal-title">End Camera Position and Perspective</h5>
            <div class="form-group">
            <label for="endCameraDistanceSelectDropDown">Camera Distance</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="endCameraDistanceSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera distance">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="endCameraShotTypeSelectDropDown">Camera Shot Type</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="endCameraShotTypeSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera shot type">
                </select>
              </div>
            </div><div class="form-group">
            <label for="endCameraVerticalAngleSelectDropDown">Camera Vertical Angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="endCameraVerticalAngleSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera vertical angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="endCameraHorizontalAngleSelectDropDown">Camera Horizontal Angle</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="endCameraHorizontalAngleSelectDropDown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera horizontal angle">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="endCameraAxisOfActionSelectDropdown">Camera Axis of Action</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="endCameraAxisOfActionSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera axis of action">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="endCameraElevationSelectDropdown">Camera Elevation</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="endCameraElevationSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera elevation">
                </select>
              </div>
            </div>
            <div class="form-group">
            <label for="endCameraDepthOfFocusSelectDropdown">Camera Depth of Focus</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="endCameraDepthOfFocusSelectDropdown"
                        name="analysisMethodId"
                        data-role="analysisMethodId"
                        data-placeholder="Select camera depth of focus">
                </select>
              </div>
            </div>`+
            remarkHtml +
          `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraMovementType/selectList/';
          $('#cameraMovementTypeSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraMovementCharacteristic/selectList/';
          $('#cameraMovementCharacteristicSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHandling/selectList/';
          $('#cameraHandlingSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/conceptDirection/selectList/';
          $('#conceptDirectionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDistance/selectList/';
          $('#startCameraDistanceSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
          $('#startCameraShotTypeSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraVerticalAngle/selectList/';
          $('#startCameraVerticalAngleSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHorizontalAngle/selectList/';
          $('#startCameraHorizontalAngleSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraAxisOfAction/selectList/';
          $('#startCameraAxisOfActionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraElevation/selectList/';
          $('#startCameraElevationSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDepthOfFocus/selectList/';
          $('#startCameraDepthOfFocusSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDistance/selectList/';
          $('#endCameraDistanceSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
          $('#endCameraShotTypeSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraVerticalAngle/selectList/';
          $('#endCameraVerticalAngleSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraHorizontalAngle/selectList/';
          $('#endCameraHorizontalAngleSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraAxisOfAction/selectList/';
          $('#endCameraAxisOfActionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraElevation/selectList/';
          $('#endCameraElevationSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraDepthOfFocus/selectList/';
          $('#endCameraDepthOfFocusSelectDropdown').select2(select2Options);
        break;
        case 17: // Camera Handling
          $('#analysisAddLabel').text('Choose Camera Handling');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
              <label for="cameraHandlingSelectDropdown">Camera Handling</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="cameraHandlingSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera handling"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#cameraHandlingSelectDropdown').select2(select2Options);
        break;
        case 18: // Zelizer Beese Voice of the Visual //* won't be implemented
        break;
        case 19: // Barthes Rhetoric of the Image //* won't be implemented
        break;
        case 20: // Sound Effect Descriptive
          $('#analysisAddLabel').text('Describe Sound Effect');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="soundEffectDescriptiveAnswerQ1">1.) What does the sound sound like (z.B. wooden, metallic, soft, fast)?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="soundEffectDescriptiveAnswerQ1"
                            aria-label="Question 1"
                            name="question"
                            placeholder="Answer to question 1"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="soundEffectDescriptiveAnswerQ2">2.) Is the sound realistic oder artificial?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="soundEffectDescriptiveAnswerQ2"
                            aria-label="Question 2"
                            name="question"
                            placeholder="Answer to question 2"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="soundEffectDescriptiveAnswerQ3">3.) From where does the sound sound?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="soundEffectDescriptiveAnswerQ3"
                            aria-label="Question 3"
                            name="question"
                            placeholder="Answer to question 3"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="soundEffectDescriptiveAnswerQ4">4.) Does the sound move or is it stationary?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="soundEffectDescriptiveAnswerQ4"
                            aria-label="Question 4"
                            name="question"
                            placeholder="Answer to question 4"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label for="soundEffectDescriptiveAnswerQ5">5.) Is the sound part of the narrated scene or not?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="soundEffectDescriptiveAnswerQ5"
                            aria-label="Question 5"
                            name="question"
                            placeholder="Answer to question 5"></textarea>
                  </div>
              </div>
              <div class="form-group">
                <label ="soundEffectDescriptiveAnswerQ6">6.) What motivates the sound (e.g., does it originate in the narration, is it artistically motivated, does it make the scene more or less realistic)?</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="soundEffectDescriptiveAnswerQ6"
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
          $('#analysisAddLabel').text('Describe Music');
          modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <h5 class="modal-title">Analysis Music</h5>
            <div class="form-group">
              <label for="analysisMusicHarmony">Harmony</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisMusicHarmony"
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
                         id="analysisMusicIsPause"
                         type="checkbox"
                         name="isPause"
                         data-role="isPause"
                         placeholder="Is Pause">
                <label for="analysisMusicIsPause">Is a Pause</label>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicMelody">Melody</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisMusicMelody"
                          aria-label="Melody"
                          name="melody"
                          placeholder="Enter melody description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicArticulationSelectDropdown">Articulation</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicArticulationSelectDropdown"
                        name="articulation"
                        data-role="articulation"
                        data-placeholder="Select articulation">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicDynamicMarkingSelectDropdown">Dynamic Marking</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicDynamicMarkingSelectDropdown"
                        name="dynamicMarking"
                        data-role="dynamicMarking"
                        data-placeholder="Select dynamic marking">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicChangeInDynamicsSelectDropdown">Change in Dynamics</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicChangeInDynamicsSelectDropdown"
                        name="changeInDynamics"
                        data-role="changeInDynamics"
                        data-placeholder="Select change in dynamics">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicTempo">Tempo</label>
              <div class="col-md-12">
                <input class="form-control form-control-md analysisMusicTempo"
                        style="width:100%;"
                        id="analysisMusicTempo"
                        name="tempo"
                        data-role="tempo"
                        data-placeholder="Enter tempo"
                        aria-describedby="Tempo"
                        maxlength="4"
                        rows="1">
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicChangeInTempoSelectDropdown">Change in Tempo</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicChangeInTempoSelectDropdown"
                        name="changeInTempo"
                        data-role="changeInTempo"
                        data-placeholder="Select change in tempo">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicTempoMarkingSelectDropdown">Tempo Marking</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicTempoMarkingSelectDropdown"
                        name="tempoMarking"
                        data-role="tempoMarking"
                        data-placeholder="Select tempo marking">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicMusicalKeySelectDropdown">Musical Key</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicMusicalKeySelectDropdown"
                        name="musicalKey"
                        data-role="musicalKey"
                        data-placeholder="Select musical key">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicRhythmSelectDropdown">Rhythm [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicRhythmSelectDropdown"
                        name="rhythm"
                        data-role="rhythm"
                        data-placeholder="Select rhythm">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicTimbreSelectDropdown">Timbre [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicTimbreSelectDropdown"
                        name="timbre"
                        data-role="timbre"
                        data-placeholder="Select timbre">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicJinsSelectDropdown">Jins</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicJinsSelectDropdown"
                        name="jins"
                        data-role="jins"
                        data-placeholder="Select jins">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicMaqamSelectDropdown">Maqam</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicMaqamSelectDropdown"
                        name="maqam"
                        data-role="maqam"
                        data-placeholder="Select maqam">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicSongStructureSelectDropdown">Song Structure [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicSongStructureSelectDropdown"
                        name="songStructure"
                        data-role="songStructure"
                        data-placeholder="Select songStructure">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicLineupMembersSelectDropdown">Lineup Members [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicLineupMembersSelectDropdown"
                        name="lineupMembers"
                        data-role="lineupMembers"
                        data-placeholder="Select lineup members">
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisMusicMusicalNotationsSelectDropdown">Musical Notation [WIP]</label>
              <div class="col-md-12">
                <select class="form-control form-control-md select-dropdown"
                        style="width:100%;"
                        id="analysisMusicMusicalNotationsSelectDropdown"
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
          $('#analysisMusicArticulationSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/dynamicMarking/selectList/';
          $('#analysisMusicDynamicMarkingSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/changeInDynamics/selectList/';
          $('#analysisMusicChangeInDynamicsSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/changeInTempo/selectList/';
          $('#analysisMusicChangeInTempoSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/tempoMarking/selectList/';
          $('#analysisMusicTempoMarkingSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/musicalKey/selectList/';
          $('#analysisMusicMusicalKeySelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/rhythm/selectList/';
          $('#analysisMusicRhythmSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/timbre/selectList/';
          $('#analysisMusicTimbreSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/jins/selectList/';
          $('#analysisMusicJinsSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/maqam/selectList/';
          $('#analysisMusicMaqamSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/songStructure/selectList/';
          $('#analysisMusicSongStructureSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lineupMembers/selectList/';
          $('#analysisMusicLineupMembersSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/musicalNotations/selectList/';
          $('#analysisMusicMusicalNotationsSelectDropdown').select2(select2Options);
        break;
        case 23: // Analysis Speech
        $('#analysisAddLabel').text('Describe Speech');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <h5 class="modal-title">Analysis Speech</h5>
            <div class="form-group">
              <label for="analysisSpeechAccent">Accent</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisSpeechAccent"
                          maxlength="255"
                          aria-label="Accent"
                          name="accent"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisSpeechIntonation">Intonation</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisSpeechIntonation"
                          maxlength="255"
                          aria-label="Intonation"
                          name="intonation"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisSpeechVolume">Volume</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisSpeechVolume"
                          maxlength="255"
                          aria-label="Volume"
                          name="volume"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisSpeechTempo">Tempo</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisSpeechTempo"
                          maxlength="255"
                          aria-label="Tempo"
                          name="tempo"
                          placeholder="Enter description"></textarea>
              </div>
            </div>
            <div class="form-group">
              <label for="analysisSpeechPauses">Pauses</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisSpeechPauses"
                          maxlength="255"
                          aria-label="Pauses"
                          name="pauses"
                          placeholder="Enter description"></textarea>
                </div>
            </div>
            <div class="form-group">
              <label ="analysisSpeechTimbre">Timbre</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="analysisSpeechTimbre"
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
        $('#analysisAddLabel').text('Describe Take Length');
        modal.find('.modal-body').html(`
          <form role="form" id="newAnalysisMethodModalForm">
            <div class="form-group">
              <label for="takeLength">Take Length</label>
              <div class="col-md-12">
                <textarea class="form-control form-control-sm"
                          id="takeLength"
                          aria-label="Take length"
                          name="takeLength"
                          placeholder="Describe Take Length"></textarea>
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
          $('#analysisAddLabel').text('Describe Editing/Montage');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <h5 class="modal-title">Editing/Montage</h5>
              <div class="form-group">
              <label for="montageFigureMacroSelectDropdown">Montage Figure Macro</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="montageFigureMacroSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select montage figure macro">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="montageFigureMacroSelectDropdown">Montage Figure Micro</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="montageFigureMicroSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select montage figure micro">
                  </select>
                </div>
              </div><div class="form-group">
              <label for="takeJunctionSelectDropdown">Take Junction</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="takeJunctionSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select take junction">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="editingRhythmSelectDropdown">Editing Rhythm</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="editingRhythmSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select editing rhythm">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="take-length">Take Length</label>
                <div class="col-md-12">
                  <textarea class="form-control form-control-sm"
                            id="takeLength"
                            aria-label="Take length"
                            name="takeLength"
                            placeholder="Take length"></textarea>
                </div>
              </div>
              <div class="form-group">
              <label for="takeTypeProgressionSelectDropdown">Take Type Progression</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="takeTypeProgressionSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select take type progression">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="cameraShotTypeSelectDropDown">Camera Shot Type</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="cameraShotTypeSelectDropDown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera shot type">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="playbackSpeedSelectDropdown">Playback Speed</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="playbackSpeedSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select playback speed">
                  </select>
                </div>
              </div>
              <div class="form-group">
              <label for="imageCadreEditingSelectDropdown">Image Cadre Editing</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="imageCadreEditingSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select image cadre editing">
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/montageFigureMacro/selectList/';
          $('#montageFigureMacroSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/montageFigureMicro/selectList/';
          $('#montageFigureMicroSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/takeJunction/selectList/';
          $('#takeJunctionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/editingRhythm/selectList/';
          $('#editingRhythmSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/takeTypeProgression/selectList/';
          $('#takeTypeProgressionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/cameraShotType/selectList/';
          $('#cameraShotTypeSelectDropDown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/playbackSpeed/selectList/';
          $('#playbackSpeedSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/imageCadreEditing/selectList/';
          $('#imageCadreEditingSelectDropdown').select2(select2Options);
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
          $('#analysisAddLabel').text('Describe Lighting');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <h5 class="modal-title">Lighting</h5>
              <div class="form-group">
                <label for="lightingTypeSelectDropdown">Lighting Type</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lightingTypeSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select lighting type">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="lightPositionSelectDropdown">Light Position</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lightPositionSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select light position">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="lightPositionAngleHorizontalSelectDropdown">Light Position Horizontal Angle</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lightPositionAngleHorizontalSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select light position horizontal angle">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="lightPositionAngleVerticalSelectDropdown">Light Position Vertical Angle</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lightPositionAngleVerticalSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select light position vertical angle">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="lightModifierSelectDropdown">Light Modifier</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lightModifierSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select light modifier">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="lightingDurationSelectDropdown">Lighting Duration</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="lightingDurationSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select lighting duration">
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightingType/selectList/';
          $('#lightingTypeSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightPosition/selectList/';
          $('#lightPositionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightPositionAngleHorizontal/selectList/';
          $('#lightPositionAngleHorizontalSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightPositionAngleVertical/selectList/';
          $('#lightPositionAngleVerticalSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightModifier/selectList/';
          $('#lightModifierSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/lightingDuration/selectList/';
          $('#lightingDurationSelectDropdown').select2(select2Options);
        break;
        case 44:
          $('#analysisAddLabel').text('Describe Actor');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <h5 class="modal-title">Analysis Actor</h5>
              <div class="form-group">
                <label for="actingTechniqueSelectDropdown">Acting Technique</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="actingTechniqueSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select acting technique">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="facialExpressionSelectDropdown">Facial Expression</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="facialExpressionSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select facial expression">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="facialExpressionIntensitySelectDropdown">Facial Expression Intensity</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="facialExpressionIntensitySelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select facial expression intensity">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="physicalExpressionSelectDropdown">Physical Expression</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="physicalExpressionSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select physical expression">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="physicalExpressionIntensitySelectDropdown">Physical Expression Intensity</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="physicalExpressionIntensitySelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select physical expression intensity">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="gesturalEmotionSelectDropdown">Gestural Emotion</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="gesturalEmotionSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select gestural emotion">
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="gesturalEmotionIntensitySelectDropdown">Gestural Emotion Intensity</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="gesturalEmotionIntensitySelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select gestural emotion intensity">
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/actingTechnique/selectList/';
          $('#actingTechniqueSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/facialExpression/selectList/';
          $('#facialExpressionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/facialExpressionIntensity/selectList/';
          $('#facialExpressionIntensitySelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/physicalExpression/selectList/';
          $('#physicalExpressionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/physicalExpressionIntensity/selectList/';
          $('#physicalExpressionIntensitySelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/gesturalEmotion/selectList/';
          $('#gesturalEmotionSelectDropdown').select2(select2Options);
          select2Options.ajax.url = 'api/analysis/method/'+analysisMethodType.id+'/gesturalEmotionIntensity/selectList/';
          $('#gesturalEmotionIntensitySelectDropdown').select2(select2Options);
        break;
        case 45: // Acting Technique - Part of 44: Analysis Actor
        break;
        case 46: // Facial Expression - Part of 44: Analysis Actor
        break;
        case 47: // Facial Expression Intensity - Part of 44: Analysis Actor
        break;
        case 48: // Gestural Emotion - Part of 44: Analysis Actor
        break;
        case 49: // Gestural Emotion Intensity - Part of 44: Analysis Actor
        break;
        case 50: // Physical Expression - Part of 44: Analysis Actor
        break;
        case 51: // Physical Expression Intensity - Part of 44: Analysis Actor
        break;
        case 52: // Camera Depth of Focus - Part of 8: Concept Camera Position and Perspective
          $('#analysisAddLabel').text('Choose Camera Depth of Focus');
          modal.find('.modal-body').html(`
            <form role="form" id="newAnalysisMethodModalForm">
              <div class="form-group">
                <label for="cameraDepthOfFocusSelectDropdown">Camera Depth of Focus</label>
                <div class="col-md-12">
                  <select class="form-control form-control-md select-dropdown"
                          style="width:100%;"
                          id="cameraDepthOfFocusSelectDropdown"
                          name="analysisMethodId"
                          data-role="analysisMethodId"
                          data-placeholder="Select camera depth of focus"
                          required>
                  </select>
                </div>
              </div>`+
              remarkHtml +
            `</form>`);
          $('#cameraDepthOfFocusSelectDropdown').select2(select2Options);
        break;
      }
      // $('select[name="analysisMethodId"]').rules('add', { required: true });
      modal.modal('show');
    },

    annotationAnalysisGuidelineDeleteModal: function(analysis) {
      let modal = $('#analysisGuidelineDeleteModal');
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
      // console.log("TCL: displayAnalysisDetails - data: ", data);
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
              <td>Color Temperature</td>
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
          let cameraDepthOfFocus = (data.analysisMethod.conceptCameraPositionAndPerspective.cameraDepthOfFocus == null) ? '' : data.analysisMethod.conceptCameraPositionAndPerspective.cameraDepthOfFocus.cameraDepthOfFocusTranslations[0].type;
          details +=
          `<tr>
            <td>Camera Distance</td>
            <td>`+cameraDistance+`</td>
          </tr>
          <tr>
            <td>Camera Shot Type</td>
            <td>`+cameraShotType+`</td>
          </tr>
          <tr>
            <td>Camera Vertical Angle</td>
            <td>`+cameraVerticalAngle+`</td>
          </tr>
          <tr>
            <td>Camera Horizontal Angle</td>
            <td>`+cameraHorizontalAngle+`</td>
          </tr>
          <tr>
            <td>Camera Axis of Action</td>
            <td>`+cameraAxisOfAction+`</td>
          </tr>
          <tr>
            <td>Camera Elevation</td>
            <td>`+cameraElevation+`</td>
          </tr>
          <tr>
            <td>Camera Depth of Focus</td>
            <td>`+cameraDepthOfFocus+`</td>
          </tr>`;
        break;
        case 9: // Camera Elevation
          details +=
            `<tr>
              <td>Camera Elevation:</td>
              <td>`+data.analysisMethod.cameraElevation.cameraElevationTranslations[0].name+`</td>
            </tr>`;
        break;
        case 10: // Camera Axis of Action
          details +=
            `<tr>
              <td>Camera Axis of Action:</td>
              <td>`+data.analysisMethod.cameraAxisOfAction.cameraAxisOfActionTranslations[0].name+`</td>
            </tr>`;
        break;
        case 11: // Camera Horizontal Angle
          details +=
            `<tr>
              <td>Camera Horizontal Angle:</td>
              <td>`+data.analysisMethod.cameraHorizontalAngle.cameraHorizontalAngleTranslations[0].name+`</td>
            </tr>`;
        break;
        case 12: // Camera Vertical Angle
          details +=
            `<tr>
              <td>Camera Vertical Angle:</td>
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
              <td>Camera Shot Type:</td>
              <td>`+data.analysisMethod.cameraShotType.cameraShotTypeTranslations[0].type+`</td>
            </tr>`;
        break;
        case 14: // Camera Distance
          details +=
            `<tr>
              <td>Camera Distance:</td>
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
          let startCameraDepthOfFocus = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraDepthOfFocus == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraDepthOfFocus.cameraDepthOfFocusTranslations[0].type;
          let endCameraDistance = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraDistance == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraDistance.cameraDistanceTranslations[0].name;
          let endCameraShotType = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraShotType == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraShotType.cameraShotTypeTranslations[0].name;
          let endCameraVerticalAngle = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraVerticalAngle == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraVerticalAngle.cameraVerticalAngleTranslations[0].name;
          let endCameraHorizontalAngle = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraHorizontalAngle == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraHorizontalAngle.cameraHorizontalAngleTranslations[0].name;
          let endCameraAxisOfAction = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraAxisOfAction == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraAxisOfAction.cameraAxisOfActionTranslations[0].name;
          let endCameraElevation = (data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraElevation == null) ? '' : data.analysisMethod.cameraMovement.endConceptCameraPositionAndPerspective.cameraElevation.cameraElevationTranslations[0].name;
          let endCameraDepthOfFocus = (data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraDepthOfFocus == null) ? '' : data.analysisMethod.cameraMovement.startConceptCameraPositionAndPerspective.cameraDepthOfFocus.cameraDepthOfFocusTranslations[0].type;
          details +=
                `<tr>
                  <td>Camera Movement Type</td>
                  <td>`+cameraMovementType+`</td>
                </tr>
                <tr>
                  <td>Camera Movement Characteristic</td>
                  <td>`+cameraMovementCharacteristic+`</td>
                </tr>
                <tr>
                  <td>Camera Handling</td>
                  <td>`+cameraHandling+`</td>
                </tr>
                <tr>
                  <td>Concept Direction</td>
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
                  <td>Camera Distance</td>
                  <td>`+startCameraDistance+`</td>
                </tr>
                <tr>
                  <td>Camera Shot Type</td>
                  <td>`+startCameraShotType+`</td>
                </tr>
                <tr>
                  <td>Camera Vertical Angle</td>
                  <td>`+startCameraVerticalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera Horizontal Angle</td>
                  <td>`+startCameraHorizontalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera Axis of Action</td>
                  <td>`+startCameraAxisOfAction+`</td>
                </tr>
                <tr>
                  <td>Camera Elevation</td>
                  <td>`+startCameraElevation+`</td>
                </tr>
                <tr>
                  <td>Camera Depth of Focus</td>
                  <td>`+startCameraDepthOfFocus+`</td>
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
                  <td>Camera Distance</td>
                  <td>`+endCameraDistance+`</td>
                </tr>
                <tr>
                  <td>Camera Shot Type</td>
                  <td>`+endCameraShotType+`</td>
                </tr>
                <tr>
                  <td>Camera Vertical Angle</td>
                  <td>`+endCameraVerticalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera Horizontal Angle</td>
                  <td>`+endCameraHorizontalAngle+`</td>
                </tr>
                <tr>
                  <td>Camera Axis of Action</td>
                  <td>`+endCameraAxisOfAction+`</td>
                </tr>
                <tr>
                  <td>Camera Elevation</td>
                  <td>`+endCameraElevation+`</td>
                </tr>
                <tr>
                  <td>Camera Depth of Focus</td>
                  <td>`+endCameraDepthOfFocus+`</td>
                </tr>`;
        break;
        case 17: // Camera Handling
          details +=
            `<tr>
              <td>Camera Handling:</td>
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
              <td>What does the sound sound like (e.g., wooden, metallic, soft, fast)?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ1+`</td>
            </tr>
            <tr>
              <td>Is the sound realistic oder artificial?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ2+`</td>
            </tr>
            <tr>
              <td>VFrom where does the sound sound?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ3+`</td>
            </tr>
            <tr>
              <td>Does the sound move or is it stationary?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ4+`</td>
            </tr>
            <tr>
              <td>Is the sound part of the narrated scene or not?</td>
              <td>`+data.analysisMethod.soundEffectDescriptive.answerQ5+`</td>
            </tr>
            <tr>
              <td>What motivates the sound?</td>
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
              <td>Speech Tempo</td>
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
              <td>Take Length</td>
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
            <td>Montage Figure Macro</td>
            <td>`+montageFigureMacro+`</td>
          </tr>
          <tr>
            <td>Montage Figure Micro</td>
            <td>`+montageFigureMicro+`</td>
          </tr>
          <tr>
            <td>Take Junction</td>
            <td>`+takeJunction+`</td>
          </tr>
          <tr>
            <td>Editing Rhythm</td>
            <td>`+editingRhythm+`</td>
          </tr>
          <tr>
            <td>Take Length</td>
            <td>`+takeLength+`</td>
          </tr>
          <tr>
            <td>Take Type Progression</td>
            <td>`+takeTypeProgression+`</td>
          </tr>
          <tr>
            <td>Camera Shot Type:</td>
            <td>`+cameraShotType+`</td>
          </tr>
          <tr>
            <td>Playback Speed</td>
            <td>`+playbackSpeed+`</td>
          </tr>
          <tr>
            <td>Image Cadre Editing</td>
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
            <td>Lighting Type</td>
            <td>`+lightingType+`</td>
          </tr>
          <tr>
            <td>Lighting Position</td>
            <td>`+lightPosition+`</td>
          </tr>
          <tr>
            <td>Light Position Horizontal Angle</td>
            <td>`+lightPositionAngleHorizontal+`</td>
          </tr>
          <tr>
            <td>Light Position Vertical Angle</td>
            <td>`+lightPositionAngleVertical+`</td>
          </tr>
          <tr>
            <td>Light Modifier</td>
            <td>`+lightModifier+`</td>
          </tr>
          <tr>
            <td>Lighting Duration</td>
            <td>`+lightingDuration+`</td>
          </tr>`;
        break;
        case 44: // Analysis Actor
          let actingTechnique = (data.analysisMethod.analysisActor.actingTechnique == null) ? '' : data.analysisMethod.analysisActor.actingTechnique.actingTechniqueTranslations[0].name;
          let facialExpression = (data.analysisMethod.analysisActor.facialExpression == null) ? '' : data.analysisMethod.analysisActor.facialExpression.facialExpressionTranslations[0].name;
          let facialExpressionIntensity = (data.analysisMethod.analysisActor.facialExpressionIntensity == null) ? '' : data.analysisMethod.analysisActor.facialExpressionIntensity.value + ' ' + data.analysisMethod.analysisActor.facialExpressionIntensity.facialExpressionIntensityTranslations[0].name;
          let gesturalEmotion = (data.analysisMethod.analysisActor.gesturalEmotion == null) ? '' : data.analysisMethod.analysisActor.gesturalEmotion.gesturalEmotionTranslations[0].name;
          let gesturalEmotionIntensity = (data.analysisMethod.analysisActor.gesturalEmotionIntensity == null) ? '' : data.analysisMethod.analysisActor.gesturalEmotionIntensity.value + ' ' + data.analysisMethod.analysisActor.gesturalEmotionIntensity.gesturalEmotionIntensityTranslations[0].name;
          let physicalExpression = (data.analysisMethod.analysisActor.physicalExpression == null) ? '' : data.analysisMethod.analysisActor.physicalExpression.physicalExpressionTranslations[0].name;
          let physicalExpressionIntensity = (data.analysisMethod.analysisActor.physicalExpressionIntensity == null) ? '' : data.analysisMethod.analysisActor.physicalExpressionIntensity.value + ' ' + data.analysisMethod.analysisActor.physicalExpressionIntensity.physicalExpressionIntensityTranslations[0].name;
          details +=
          `<tr>
            <td>Acting Technique</td>
            <td>`+actingTechnique+`</td>
          </tr>
          <tr>
            <td>Facial Expression</td>
            <td>`+facialExpression+`</td>
          </tr>
          <tr>
            <td>Facial Expression Intensity</td>
            <td>`+facialExpressionIntensity+`</td>
          </tr>
          <tr>
            <td>Physical Expression</td>
            <td>`+physicalExpression+`</td>
          </tr>
          <tr>
            <td>Physical Expression Intensity</td>
            <td>`+physicalExpressionIntensity+`</td>
          </tr>
          <tr>
            <td>Gestural Emotion</td>
            <td>`+gesturalEmotion+`</td>
          </tr>
          <tr>
            <td>Gestural Emotion Intensity</td>
            <td>`+gesturalEmotionIntensity+`</td>
          </tr>`;
        break;
        case 45: // Acting Technique - Part of 44: Analysis Actor
        break;
        case 46: // Facial Expression - Part of 44: Analysis Actor
        break;
        case 47: // Facial Expression Intensity - Part of 44: Analysis Actor
        break;
        case 48: // Gestural Emotion - Part of 44: Analysis Actor
        break;
        case 49: // Gestural Emotion Intensity - Part of 44: Analysis Actor
        break;
        case 50: // Physical Expression - Part of 44: Analysis Actor
        break;
        case 51: // Physical Expression Intensity - Part of 44: Analysis Actor
        break;
        case 9: // Camera Depth of Focus - Part of 8: Concept Camera Position and Perspective
          details +=
            `<tr>
              <td>Camera depth of Focus</td>
              <td>`+data.analysisMethod.cameraDepthOfFocus.cameraDepthOfFocusTranslations[0].type+`</td>
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
      TIMAAT.AnalysisDatasets.dataTableAnalysisMethods = $('#annotationAnalysisGuidelinesAvailableTable').DataTable({
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

					analysisMethodTypeElement.find('.addAnalysisMethod').on('click', analysisMethodType, async function(ev) {
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
					data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, analysisMethodType, meta) {
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
            if ([1,7,8,9,10,11,12,14,16,17,20,22,23,34,43,44].indexOf(analysisMethodType.id) > -1 && TIMAAT.VideoPlayer.curAnnotation) { //* TODO allow adding only for existing methods
              var i = 0;
              var methodIsStaticAndExists = false;
              for (; i < TIMAAT.VideoPlayer.curAnnotation.model.analysis.length; i++) {
                if (TIMAAT.VideoPlayer.curAnnotation.model.analysis[i].analysisMethod.analysisMethodType.id == analysisMethodType.id && analysisMethodType.isStatic) {
                  methodIsStaticAndExists = true;
                  break;
                }
              }
              if (!methodIsStaticAndExists) { //* static analyses may only be assigned once, others can occur multiple times
                nameDisplay += `<span class="addAnalysisMethod badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw" title="Add analysis guideline"></i></span>`;
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
          "processing"       : '<i class="fas fa-spinner fa-spin"></i> Loading data...',
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
			// $(this.ui.dataTableAnalysisMethod.table().container()).find('.table-title').text('Available Analyses');
    },

    setupAnnotationAnalysisDataTable: function() {
			TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis = $('#annotationAnalysisGuidelineTable').DataTable({
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
							asDataTable: true,
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

					analysisElement.find('.removeAnalysisMethod').on('click', analysis, async function(ev) {
						ev.stopPropagation();
            if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						// $(this).remove();
						TIMAAT.AnalysisDatasets.annotationAnalysisGuidelineDeleteModal(analysis);
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
					{	data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, analysis, meta) {
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
							<span class="removeAnalysisMethod badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw" title="Remove analysis guideline"></i></span>
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