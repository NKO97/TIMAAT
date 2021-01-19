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
						<button type="button" class="btn btn-sm btn-danger" onclick="TIMAAT.VideoPlayer.removeAnalysisAction();">
							<i class="fas fa-trash"></i>
						</button>
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
			let timeString = " "+TIMAAT.Util.formatTime(this.model.startTime/1000.0, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime/1000.0, true);
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
			let magicoffset = 0; // TODO replace input slider
			let width =  $('#timaat-video-seek-bar').width();
			let length = (this.model.endTime - this.model.startTime) / (1000.0 * TIMAAT.VideoPlayer.duration) * width;
			length -= 2; // TODO magic number - replace input slider
			let offset = this.model.startTime / (1000.0 * TIMAAT.VideoPlayer.duration) * width;
			this.timelineView.css('width', length+'px');
			this.timelineView.css('margin-left', (offset+magicoffset)+'px');

		}
		
		addUI() {
			// console.log("TCL: AnalysisAction -> addUI -> addUI()");
			// $('#timaat-annotation-list').append(this.listView);
			$('#timaat-timeline-action-pane').append(this.timelineView);

			var action = this; // save annotation for events
			// attach event handlers
			// this.listView.on('click', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curAction = action;
			// 	TIMAAT.VideoPlayer.jumpVisible(action.model.startTime/1000.0, action.model.endTime/1000.0);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(action, 'analysisaction');
			// });
			this.timelineView.on('click', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.findIndex(({model}) => model.id === action.model.sceneId);
				TIMAAT.VideoPlayer.curScene = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI[index];
        console.log("TCL: AnalysisAction -> this.timelineView.on -> TIMAAT.VideoPlayer.curScene", TIMAAT.VideoPlayer.curScene);
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curScene.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
        console.log("TCL: AnalysisAction -> this.timelineView.on -> TIMAAT.VideoPlayer.curSegment", TIMAAT.VideoPlayer.curSegment);
				TIMAAT.VideoPlayer.curAction = action;
				TIMAAT.VideoPlayer.jumpVisible(action.model.startTime/1000.0, action.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(action, 'analysisaction');
			});
			// this.listView.on('dblclick', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curAction = action;
			// 	TIMAAT.VideoPlayer.jumpVisible(action.model.startTime/1000.0, action.model.endTime/1000.0);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(action, 'analysisaction');
			// 	TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			// });
			this.timelineView.on('dblclick', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.findIndex(({model}) => model.id === action.model.sceneId);
				TIMAAT.VideoPlayer.curScene = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI[index];
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curScene.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curAction = action;
				TIMAAT.VideoPlayer.jumpVisible(action.model.startTime/1000.0, action.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(action, 'analysisaction');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			});
			// console.log("TCL: AnalysisAction -> addUI -> this.updateUI()");
			this.updateUI();
		}
		
		removeUI() {
			// console.log("TCL: AnalysisAction -> removeUI -> removeUI()");
			// this.listView.remove();
			this.timelineView.remove();
			// console.log("TCL: AnalysisAction -> removeUI -> this.updateUI()");
			this.updateUI();
		}
			
		updateStatus(time) {
			// console.log("TCL: AnalysisAction -> updateStatus -> time", time);
			var status = false;
			if ( time >= this.model.startTime/1000.0 && time < this.model.endTime/1000.0) status = true;

			if ( status != this.active ) {
				this.active = status;
				if ( this.active ) this.timelineView.addClass('bg-info');
				else this.timelineView.removeClass('bg-info');
			}
		}

	}
	
}, window));
