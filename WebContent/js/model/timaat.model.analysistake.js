/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
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

	TIMAAT.AnalysisTake = class AnalysisTake {
		constructor(model) {
			// console.log("TCL: AnalysisTake -> constructor -> model", model);
			// setup model
			this.model = model;
			this.active = false;

			// create and style list view element
			this.listView = $(`
				<li class="list-group-item annotationListTake p-0 bg-secondary">
					<div class="d-flex justify-content-between">
						<span class="font-weight-bold pt-1 text-light pl-1">
							<i class="annotationTakeCommentIcon fas fa-fw fa-comment" aria-hidden="true"></i>
							<span class="annotationTakeName"></span>
						</span>
					</div>
				</li>`
			);
			this.timelineView = $(`
				<div class="timeline__take">
					<div class="timeline__take-name text-white font-weight-bold"></div>
				</div>`
			);
			var take = this; // save annotation for events
		}

		updateUI() {
			// console.log("TCL: AnalysisTake -> updateUI -> updateUI()");
			this.listView.attr('data-start-time', this.model.startTime);
			this.listView.attr('data-end-time', this.model.endTime);
			this.listView.attr('id', 'take-'+this.model.id);
			this.listView.attr('data-type', 'take');
			let timeString = " "+TIMAAT.Util.formatTime(this.model.startTime, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime, true);
			this.listView.find('.annotationTakeName').html(this.model.analysisTakeTranslations[0].name);
			this.listView.find('.annotationTakeShortDescription').html(this.model.analysisTakeTranslations[0].shortDescription);
			this.listView.find('.annotationTakeComment').html(this.model.analysisTakeTranslations[0].comment);
			this.listView.find('.annotationTakeTranscript').html(this.model.analysisTakeTranslations[0].transcript);
			this.timelineView.find('.timeline__take-name ').html(this.model.analysisTakeTranslations[0].name);

			// update timeline position
			// let width =  $('#videoSeekBar').width();
			let length = (this.model.endTime - this.model.startTime) / (TIMAAT.VideoPlayer.duration) * 100.0;
			let offset = this.model.startTime / (TIMAAT.VideoPlayer.duration) * 100.0;
			this.timelineView.css('width', length+'%');
			this.timelineView.css('margin-left', (offset)+'%');

		}

		addUI() {
			// console.log("TCL: AnalysisTake -> addUI -> addUI()");
			// $('#analysisList').append(this.listView);
			$('#timelinePaneTake').append(this.timelineView);

			var take = this; // save annotation for events
			// attach event handlers
			this.timelineView.on('click', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.findIndex(({model}) => model.id === take.model.sequenceId);
				TIMAAT.VideoPlayer.curSequence = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI[index];
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curSequence.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curTake = take;
				this.classList.replace('bg-info', 'bg-primary');
				this.classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'take';
				TIMAAT.VideoPlayer.jumpVisible(take.model.startTime, take.model.endTime);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				$('#timelineKeyframePane').hide();
				TIMAAT.VideoPlayer.inspector.setItem(take, 'take');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'Take · '+take.model.analysisTakeTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/take/'+take.model.id);
			});
			this.timelineView.on('dblclick', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.findIndex(({model}) => model.id === take.model.sequenceId);
				TIMAAT.VideoPlayer.curSequence = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI[index];
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curSequence.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curTake = take;
				this.classList.replace('bg-info', 'bg-primary');
				this.classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'take';
				TIMAAT.VideoPlayer.jumpTo(take.model.startTime);
				// TIMAAT.VideoPlayer.jumpVisible(take.model.startTime, take.model.endTime);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				$('#timelineKeyframePane').hide();
				TIMAAT.VideoPlayer.inspector.setItem(take, 'take');
				TIMAAT.VideoPlayer.inspector.open('inspectorMetadata');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'Take · '+take.model.analysisTakeTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/take/'+take.model.id);
			});
			// console.log("TCL: AnalysisTake -> addUI -> this.updateUI()");
			this.updateUI();
		}

		removeUI() {
			// console.log("TCL: AnalysisTake -> removeUI -> removeUI()");
			// this.listView.remove();
			this.timelineView.remove();
			TIMAAT.VideoPlayer.selectedElementType = null;
			// console.log("TCL: AnalysisTake -> removeUI -> this.updateUI()");
			this.updateUI();
		}

		updateStatus(timeInSeconds, onTimeUpdate) {
			// console.log("TCL: AnalysisSegment -> updateStatus -> time", time);
			let time = timeInSeconds * 1000;
			var highlight = false;
			if ( time >= this.model.startTime && time < this.model.endTime) highlight = true;

			if ( highlight != this.highlighted ) { // highlight changed?
				this.highlighted = highlight;
				if ( this.highlighted ) { //  element highlighted at current time?
					if (!this.timelineView[0].classList.contains('bg-primary')) // only add bg-info if not already selected element
						this.timelineView.addClass('bg-info');
				}
				else { // element not highlighted at current time
					this.timelineView.removeClass('bg-info');
					if (!onTimeUpdate) // keep bg-primary if time changed due to timeline-slider change
						this.timelineView.removeClass('bg-primary');
				}
			} else { // highlight remains unchanged
				if (TIMAAT.VideoPlayer.selectedElementType != 'take') { // update bg-primary if other element in same structure is selected
					this.timelineView.removeClass('bg-primary');
					if(this.highlighted) {
						this.timelineView.addClass('bg-info');
					}
				}
				if (TIMAAT.VideoPlayer.curTake && this.model.id != TIMAAT.VideoPlayer.curTake.model.id) { // update bg-primary when switching elements on same hierarchy via timeline-slider and selecting
					this.timelineView.removeClass('bg-primary');
				}
			}
		}

	}

}, window));
