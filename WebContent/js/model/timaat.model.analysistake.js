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
				<li class="list-group-item timaat-annotation-list-take p-0 bg-secondary">
						<div class="d-flex justify-content-between">
							<span class="font-weight-bold pt-1 text-light pl-1">
								<i class="timaat-annotation-take-comment-icon fas fa-fw fa-comment" aria-hidden="true"></i>
								<span class="timaat-annotation-take-name"></span>
							</span>
						<button type="button" class="btn btn-sm btn-danger" onclick="TIMAAT.VideoPlayer.removeAnalysisTake();">
							<i class="fas fa-trash"></i>
						</button>
					</div>
				</li>`
			);
			this.timelineView = $(`
				<div class="timaat-timeline-take">
					<div class="timaat-timeline-take-name text-white font-weight-bold"></div>
				</div>`
			);
			var take = this; // save annotation for events
		}
				
		updateUI() {
			// console.log("TCL: AnalysisTake -> updateUI -> updateUI()");
			this.listView.attr('data-starttime', this.model.startTime);
			let timeString = " "+TIMAAT.Util.formatTime(this.model.startTime/1000.0, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime/1000.0, true);
			this.listView.find('.timaat-annotation-take-name').html(this.model.analysisTakeTranslations[0].name);
			this.listView.find('.timaat-annotation-take-shortDescription').html(this.model.analysisTakeTranslations[0].shortDescription);
			this.listView.find('.timaat-annotation-take-comment').html(this.model.analysisTakeTranslations[0].comment);
			this.listView.find('.timaat-annotation-take-transcript').html(this.model.analysisTakeTranslations[0].transcript);
			this.timelineView.find('.timaat-timeline-take-name ').html(this.model.analysisTakeTranslations[0].name);
			
			// comment
			// if ( this.model.analysisTakeTranslations[0].comment && this.model.analysisTakeTranslations[0].comment.length > 0 )
			// 	this.listView.find('.timaat-annotation-take-comment-icon').show();
			// else
			// 	this.listView.find('.timaat-annotation-take-comment-icon').hide();
			
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
			// console.log("TCL: AnalysisTake -> addUI -> addUI()");
			// $('#timaat-annotation-list').append(this.listView);
			$('#timaat-timeline-take-pane').append(this.timelineView);

			var take = this; // save annotation for events
			// attach event handlers
			// this.listView.on('click', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curTake = take;
			// 	TIMAAT.VideoPlayer.jumpVisible(take.model.startTime/1000.0, take.model.endTime/1000.0);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(take, 'analysistake');
			// });
			this.timelineView.on('click', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.findIndex(({model}) => model.id === take.model.sequenceId);
				TIMAAT.VideoPlayer.curSequence = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI[index];
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curSequence.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curTake = take;
				TIMAAT.VideoPlayer.jumpVisible(take.model.startTime/1000.0, take.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(take, 'analysistake');
			});
			// this.listView.on('dblclick', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curTake = take;
			// 	TIMAAT.VideoPlayer.jumpVisible(take.model.startTime/1000.0, take.model.endTime/1000.0);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(take, 'analysistake');
			// 	TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			// });
			this.timelineView.on('dblclick', this, function(ev) {
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.findIndex(({model}) => model.id === take.model.sequenceId);
				TIMAAT.VideoPlayer.curSequence = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI[index];
				index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curSequence.model.segmentId);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curTake = take;
				TIMAAT.VideoPlayer.jumpVisible(take.model.startTime/1000.0, take.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(take, 'analysistake');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			});
			// console.log("TCL: AnalysisTake -> addUI -> this.updateUI()");
			this.updateUI();
		}
		
		removeUI() {
			// console.log("TCL: AnalysisTake -> removeUI -> removeUI()");
			// this.listView.remove();
			this.timelineView.remove();
			// console.log("TCL: AnalysisTake -> removeUI -> this.updateUI()");
			this.updateUI();
		}
			
		updateStatus(time) {
//					console.log("TCL: AnalysisTake -> updateStatus -> time", time);
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
