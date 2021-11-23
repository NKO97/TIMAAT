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
	
	TIMAAT.AnalysisAction = class AnalysisAction {
		constructor(model) {
			// console.log("TCL: AnalysisAction -> constructor -> model", model);
			// setup model
			this.model = model;
			this.active = false;
			
			// create and style list view element
			this.listView = $(`
				<li class="list-group-item timaat-annotation-list-action p-0 bg-secondary">
					<div class="d-flex justify-content-between">
						<span class="font-weight-bold pt-1 text-light pl-1">
							<i class="timaat-annotation-action-comment-icon fas fa-fw fa-comment" aria-hidden="true"></i>
							<span class="timaat-annotation-action-name"></span>
						</span>
					</div>
				</li>`
			);
			this.timelineView = $(`
				<div class="timaat-timeline-action">
					<div class="timaat-timeline-action-name text-white font-weight-bold"></div>
				</div>`
			);
			
			var action = this; // save annotation for events

		}
				
		updateUI() {
			// console.log("TCL: AnalysisAction -> updateUI -> updateUI()");
			this.listView.attr('data-starttime', this.model.startTime);
			this.listView.attr('data-endtime', this.model.endTime);
			this.listView.attr('id', 'action-'+this.model.id);
			this.listView.attr('data-type', 'action');
			let timeString = " "+TIMAAT.Util.formatTime(this.model.startTime, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime, true);
			this.listView.find('.timaat-annotation-action-name').html(this.model.analysisActionTranslations[0].name);
			this.listView.find('.timaat-annotation-action-shortDescription').html(this.model.analysisActionTranslations[0].shortDescription);
			this.listView.find('.timaat-annotation-action-comment').html(this.model.analysisActionTranslations[0].comment);
			this.listView.find('.timaat-annotation-action-transcript').html(this.model.analysisActionTranslations[0].transcript);
			this.timelineView.find('.timaat-timeline-action-name ').html(this.model.analysisActionTranslations[0].name);
			
			// comment
			// if ( this.model.analysisActionTranslations[0].comment && this.model.analysisActionTranslations[0].comment.length > 0 )
			// 	this.listView.find('.timaat-annotation-action-comment-icon').show();
			// else
			// 	this.listView.find('.timaat-annotation-action-comment-icon').hide();
			
			// update timeline position
//			let width =  $('#video-seek-bar').width();
			let length = (this.model.endTime - this.model.startTime) / (TIMAAT.VideoPlayer.duration) * 100.0;
			let offset = this.model.startTime / (TIMAAT.VideoPlayer.duration) * 100.0;
			this.timelineView.css('width', length+'%');
			this.timelineView.css('margin-left', (offset)+'%');

		}
		
		addUI() {
			// console.log("TCL: AnalysisAction -> addUI -> addUI()");
			// $('#timaat-annotation-list').append(this.listView);
			$('#timaat-timeline-action-pane').append(this.timelineView);

			var action = this; // save annotation for events
			// attach event handlers
			// this.listView.on('click', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curAction = action;
			// 	TIMAAT.VideoPlayer.jumpVisible(action.model.startTime, action.model.endTime);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(action, 'action');
			// });
			this.timelineView.on('click', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.findIndex(({model}) => model.id === action.model.sceneId);
				TIMAAT.VideoPlayer.curScene = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI[index];
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curScene.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curAction = action;
				this.classList.replace('bg-info', 'bg-primary');
				this.classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'action';
				TIMAAT.VideoPlayer.jumpVisible(action.model.startTime, action.model.endTime);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				$('#timaat-timeline-keyframe-pane').hide();
				TIMAAT.VideoPlayer.inspector.setItem(action, 'action');
					// TODO
					// TIMAAT.URLHistory.setURL(null, 'Action · '+action.model.analysisActionTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/action/'+action.model.id);
			});
			// this.listView.on('dblclick', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curAction = action;
			// 	TIMAAT.VideoPlayer.jumpVisible(action.model.startTime, action.model.endTime);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(action, 'action');
			// 	TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			// });
			this.timelineView.on('dblclick', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.findIndex(({model}) => model.id === action.model.sceneId);
				TIMAAT.VideoPlayer.curScene = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI[index];
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curScene.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curAction = action;
				this.classList.replace('bg-info', 'bg-primary');
				this.classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'action';
				TIMAAT.VideoPlayer.jumpVisible(action.model.startTime, action.model.endTime);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				$('#timaat-timeline-keyframe-pane').hide();
				TIMAAT.VideoPlayer.inspector.setItem(action, 'action');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
					// TODO
					// TIMAAT.URLHistory.setURL(null, 'Action · '+action.model.analysisActionTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/action/'+action.model.id);
			});
			// console.log("TCL: AnalysisAction -> addUI -> this.updateUI()");
			this.updateUI();
		}
		
		removeUI() {
			// console.log("TCL: AnalysisAction -> removeUI -> removeUI()");
			// this.listView.remove();
			this.timelineView.remove();
			TIMAAT.VideoPlayer.selectedElementType = null;
			// console.log("TCL: AnalysisAction -> removeUI -> this.updateUI()");
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
				if (TIMAAT.VideoPlayer.selectedElementType != 'action') { // update bg-primary if other element in same structure is selected
					this.timelineView.removeClass('bg-primary');
					if(this.highlighted) {
						this.timelineView.addClass('bg-info');
					}
				}
				if (TIMAAT.VideoPlayer.curAction && this.model.id != TIMAAT.VideoPlayer.curAction.model.id) { // update bg-primary when switching elements on same hierarchy via timeline-slider and selecting
					this.timelineView.removeClass('bg-primary');
				}
			}
		}

	}
	
}, window));
