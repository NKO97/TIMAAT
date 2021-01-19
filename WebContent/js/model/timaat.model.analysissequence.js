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
	
	TIMAAT.AnalysisSequence = class AnalysisSequence {
		constructor(model) {
			// console.log("TCL: AnalysisSequence -> constructor -> model", model);
			// setup model
			this.model = model;
			this.active = false;
			
			// create and style list view element
			this.listView = $(`
				<li class="list-group-item timaat-annotation-list-sequence p-0 bg-secondary">
						<div class="d-flex justify-content-between">
							<span class="font-weight-bold pt-1 text-light pl-1">
								<i class="timaat-annotation-sequence-comment-icon fas fa-fw fa-comment" aria-hidden="true"></i>
								<span class="timaat-annotation-sequence-name"></span>
							</span>
						<button type="button" class="btn btn-sm btn-danger" onclick="TIMAAT.VideoPlayer.removeAnalysisSequence();">
							<i class="fas fa-trash"></i>
						</button>
					</div>
				</li>`
			);
			this.timelineView = $(`
				<div class="timaat-timeline-sequence">
					<div class="timaat-timeline-sequence-name text-white font-weight-bold"></div>
				</div>`
			);
			var sequence = this; // save annotation for events
		}
				
		updateUI() {
			// console.log("TCL: AnalysisSequence -> updateUI -> updateUI()");
			this.listView.attr('data-starttime', this.model.startTime);
			let timeString = " "+TIMAAT.Util.formatTime(this.model.startTime/1000.0, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime/1000.0, true);
			this.listView.find('.timaat-annotation-sequence-name').html(this.model.analysisSequenceTranslations[0].name);
			this.listView.find('.timaat-annotation-sequence-shortDescription').html(this.model.analysisSequenceTranslations[0].shortDescription);
			this.listView.find('.timaat-annotation-sequence-comment').html(this.model.analysisSequenceTranslations[0].comment);
			this.listView.find('.timaat-annotation-sequence-transcript').html(this.model.analysisSequenceTranslations[0].transcript);
			this.timelineView.find('.timaat-timeline-sequence-name ').html(this.model.analysisSequenceTranslations[0].name);
			
			// comment
			// if ( this.model.analysisSequenceTranslations[0].comment && this.model.analysisSequenceTranslations[0].comment.length > 0 )
			// 	this.listView.find('.timaat-annotation-sequence-comment-icon').show();
			// else
			// 	this.listView.find('.timaat-annotation-sequence-comment-icon').hide();
			
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
			// console.log("TCL: AnalysisSequence -> addUI -> addUI()");
			// $('#timaat-annotation-list').append(this.listView);
			$('#timaat-timeline-sequence-pane').append(this.timelineView);

			var sequence = this; // save annotation for events
      console.log("TCL: AnalysisSequence -> addUI -> sequence", sequence);
			// attach event handlers
			// this.listView.on('click', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curSequence = sequence;
			// 	TIMAAT.VideoPlayer.jumpVisible(sequence.model.startTime/1000.0, sequence.model.endTime/1000.0);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(sequence, 'analysissequence');
			// });
			this.timelineView.on('click', this, function(ev) {
				console.log("TCL: AnalysisSequence -> addUI -> sequence", sequence);
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === sequence.model.segmentId);
        console.log("TCL: AnalysisSequence -> this.timelineView.on -> index", index);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curSequence = sequence;
				TIMAAT.VideoPlayer.curTake = null;
				TIMAAT.VideoPlayer.jumpVisible(sequence.model.startTime/1000.0, sequence.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(sequence, 'analysissequence');
			});
			// this.listView.on('dblclick', this, function(ev) {
			// 	TIMAAT.VideoPlayer.curSequence = sequence;
			// 	TIMAAT.VideoPlayer.jumpVisible(sequence.model.startTime/1000.0, sequence.model.endTime/1000.0);
			// 	TIMAAT.VideoPlayer.pause();
			// 	TIMAAT.VideoPlayer.selectAnnotation(null);
			// 	TIMAAT.VideoPlayer.inspector.setItem(sequence, 'analysissequence');
			// 	TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			// });
			this.timelineView.on('dblclick', this, function(ev) {
				console.log("TCL: AnalysisSequence -> addUI -> sequence", sequence);
				var index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === sequence.model.segmentId);
        console.log("TCL: AnalysisSequence -> this.timelineView.on -> index", index);
				TIMAAT.VideoPlayer.curSegment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
				TIMAAT.VideoPlayer.curSequence = sequence;
				TIMAAT.VideoPlayer.curTake = null;
				TIMAAT.VideoPlayer.jumpVisible(sequence.model.startTime/1000.0, sequence.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(sequence, 'analysissequence');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			});
			// console.log("TCL: AnalysisSequence -> addUI -> this.updateUI()");
			this.updateUI();
		}
		
		removeUI() {
			// console.log("TCL: AnalysisSequence -> removeUI -> removeUI()");
			// this.listView.remove();
			this.timelineView.remove();
			// console.log("TCL: AnalysisSequence -> removeUI -> this.updateUI()");
			this.updateUI();
		}
			
		updateStatus(time) {
			// console.log("TCL: AnalysisSequence -> updateStatus -> time", time);
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
