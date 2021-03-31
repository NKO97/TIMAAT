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
	
	TIMAAT.AnalysisSegment = class AnalysisSegment {
		constructor(model) {
			// console.log("TCL: AnalysisSegment -> constructor -> model", model);
			// setup model
			this.model = model;
			this.active = false;
			
			// create and style list view element
			this.listView = $(`
				<li class="list-group-item timaat-annotation-list-segment p-0 bg-secondary">
					<div class="d-flex justify-content-between">
						<span class="font-weight-bold pt-1 text-light pl-1">
							<i class="timaat-annotation-segment-comment-icon fas fa-fw fa-comment" aria-hidden="true"></i>
							<span class="timaat-annotation-segment-name"></span>
						</span>
					</div>
				</li>`
			);
			this.timelineView = $(`
				<div class="timaat-timeline-segment">
					<div class="timaat-timeline-segment-name text-white font-weight-bold"></div>
				</div>`
			);
			
			var segment = this; // save annotation for events

		}
				
		updateUI() {
			// console.log("TCL: AnalysisSegment -> updateUI -> updateUI()");
			this.listView.attr('data-starttime', this.model.startTime);
			this.listView.attr('data-endtime', this.model.endTime);
			this.listView.attr('id', 'segment-'+this.model.id);
			this.listView.attr('data-type', 'segment');
			let timeString = " "+TIMAAT.Util.formatTime(this.model.startTime/1000.0, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime/1000.0, true);
			this.listView.find('.timaat-annotation-segment-name').html(this.model.analysisSegmentTranslations[0].name);
			this.listView.find('.timaat-annotation-segment-shortDescription').html(this.model.analysisSegmentTranslations[0].shortDescription);
			this.listView.find('.timaat-annotation-segment-comment').html(this.model.analysisSegmentTranslations[0].comment);
			this.listView.find('.timaat-annotation-segment-transcript').html(this.model.analysisSegmentTranslations[0].transcript);
			this.timelineView.find('.timaat-timeline-segment-name ').html(this.model.analysisSegmentTranslations[0].name);
			
			// comment
			if ( this.model.analysisSegmentTranslations[0].comment && this.model.analysisSegmentTranslations[0].comment.length > 0 )
				this.listView.find('.timaat-annotation-segment-comment-icon').show();
			else
				this.listView.find('.timaat-annotation-segment-comment-icon').hide();
			
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
			// console.log("TCL: AnalysisSegment -> addUI -> addUI()");
			$('#timaat-annotation-list').append(this.listView);
			$('#timaat-timeline-segment-pane').append(this.timelineView);
      // console.log("TCL: AnalysisSegment -> addUI -> this.timelineView", this.timelineView);

			var segment = this; // save annotation for events
			// console.log("TCL: AnalysisSegment -> addUI -> segment", segment);
			
			// attach event handlers
			this.listView.on('click', this, function(ev) {
				console.log("TCL: click");
				TIMAAT.VideoPlayer.curSegment = segment;
        console.log("TCL: AnalysisSegment -> this.listView.on -> segment", segment);
				TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.replace('bg-info', 'bg-primary');
				TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'segment';
				TIMAAT.VideoPlayer.curSequence = null;
				TIMAAT.VideoPlayer.curTake = null;
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				TIMAAT.VideoPlayer.inspector.setItem(segment, 'segment');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'Segment · '+segment.model.analysisSegmentTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/segment/'+segment.model.id);
			});
			this.timelineView.on('click', this, function(ev) {
				console.log("TCL: click");
				TIMAAT.VideoPlayer.curSegment = segment;
        console.log("TCL: AnalysisSegment -> this.timelineView.on -> segment", segment);
				this.classList.replace('bg-info', 'bg-primary');
				this.classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'segment';
				TIMAAT.VideoPlayer.curSequence = null;
				TIMAAT.VideoPlayer.curTake = null;
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				TIMAAT.VideoPlayer.inspector.setItem(segment, 'segment');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'Segment · '+segment.model.analysisSegmentTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/segment/'+segment.model.id);
			});
			this.listView.on('dblclick', this, function(ev) {
				TIMAAT.VideoPlayer.curSegment = segment;
				TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.replace('bg-info', 'bg-primary');
				TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'segment';
				TIMAAT.VideoPlayer.curSequence = null;
				TIMAAT.VideoPlayer.curTake = null;
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				TIMAAT.VideoPlayer.inspector.setItem(segment, 'segment');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'Segment · '+segment.model.analysisSegmentTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/segment/'+segment.model.id);
			});
			this.timelineView.on('dblclick', this, function(ev) {
				TIMAAT.VideoPlayer.curSegment = segment;
				this.classList.replace('bg-info', 'bg-primary');
				this.classList.add('bg-primary');
				TIMAAT.VideoPlayer.selectedElementType = 'segment';
				TIMAAT.VideoPlayer.curSequence = null;
				TIMAAT.VideoPlayer.curTake = null;
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
				TIMAAT.VideoPlayer.pause();
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				TIMAAT.VideoPlayer.inspector.setItem(segment, 'segment');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'Segment · '+segment.model.analysisSegmentTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/segment/'+segment.model.id);
			});
			// console.log("TCL: AnalysisSegment -> addUI -> this.updateUI()");
			this.updateUI();
		}
		
		removeUI() {
			// console.log("TCL: AnalysisSegment -> removeUI -> removeUI()");
			this.listView.remove();
			this.timelineView.remove();
			// console.log("TCL: AnalysisSegment -> removeUI -> this.updateUI()");
			this.updateUI();
		}
			
		updateStatus(time, onTimeUpdate) {
			// console.log("TCL: AnalysisSegment -> updateStatus -> time", time);
			var highlight = false;
			if ( time >= this.model.startTime/1000.0 && time < this.model.endTime/1000.0) highlight = true;

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
				if (TIMAAT.VideoPlayer.selectedElementType != 'segment') { // update bg-primary if other element in same structure is selected
          this.timelineView.removeClass('bg-primary');
					if(this.highlighted) {
						this.timelineView.addClass('bg-info');
					}
				}
				if (TIMAAT.VideoPlayer.curSegment && this.model.id != TIMAAT.VideoPlayer.curSegment.model.id) { // update bg-primary when switching elements on same hierarchy via timeline-slider and selecting
					this.timelineView.removeClass('bg-primary');
				}
			}
		}

	}
	
}, window));
