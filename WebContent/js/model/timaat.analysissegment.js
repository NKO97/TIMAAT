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
		      console.log("TCL: AnalysisSegment -> constructor -> model", model);
					// setup model
					this.model = model;
					this.active = false;
					
					// create and style list view element
					this.listView = $('<li class="list-group-item timaat-annotation-list-segment" style="padding:0"> \
								<div class="timaat-annotation-segment-title text-white font-weight-bold"></div> \
							</li>'
					);
					this.timelineView = $('<div class="timaat-timeline-segment"> \
							<div class="timaat-timeline-segment-title text-white font-weight-bold"></div> \
							</div>'
					);
					
					
					var segment = this; // save annotation for events

					

				}
				
				updateUI() {
					console.log("TCL: AnalysisSegment -> updateUI -> updateUI()");
					this.listView.attr('data-starttime', this.model.startTime);
					var timeString = " "+TIMAAT.Util.formatTime(this.model.startTime, true);
					if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime, true);
					this.listView.find('.timaat-annotation-segment-title').html(this.model.analysisSegmentTranslations[0].name);
					this.timelineView.find('.timaat-timeline-segment-title ').html(this.model.analysisSegmentTranslations[0].name);

					// update timeline position
					var magicoffset = 1; // TODO replace input slider
					var width =  $('#timaat-video-seek-bar').width();
					var length = (this.model.endTime - this.model.startTime) / TIMAAT.VideoPlayer.duration * width;
					var offset = this.model.startTime / TIMAAT.VideoPlayer.duration * width;
					this.timelineView.css('width', length+'px');
					this.timelineView.css('margin-left', (offset+magicoffset)+'px');

				}
				
				addUI() {
		      console.log("TCL: AnalysisSegment -> addUI -> addUI()");
					$('#timaat-annotation-list').append(this.listView);
					$('#timaat-timeline-segment-pane').append(this.timelineView);

					var segment = this; // save annotation for events
					// attach event handlers
					this.listView.click(this, function(ev) {
						TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
						TIMAAT.VideoPlayer.pause();
					});
					this.timelineView.click(this, function(ev) {
						TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
						TIMAAT.VideoPlayer.pause();
					});
					this.listView.dblclick(this, function(ev) {
						TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
						TIMAAT.VideoPlayer.pause();
						$('#timaat-videoplayer-segment-meta').data('segment', segment);
						$('#timaat-videoplayer-segment-meta').modal('show');
					});
					this.timelineView.dblclick(this, function(ev) {
						TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
						TIMAAT.VideoPlayer.pause();
						$('#timaat-videoplayer-segment-meta').data('segment', segment);
						$('#timaat-videoplayer-segment-meta').modal('show');
					});
					console.log("TCL: AnalysisSegment -> addUI -> this.updateUI()");
					this.updateUI();
				}
				
				removeUI() {
		      console.log("TCL: AnalysisSegment -> removeUI -> removeUI()");
					this.listView.remove();
					this.timelineView.remove();
					console.log("TCL: AnalysisSegment -> removeUI -> this.updateUI()");
					this.updateUI();      
				}
					
				updateStatus(time) {
		      console.log("TCL: AnalysisSegment -> updateStatus -> time", time);
					var status = false;
					if ( time >= this.model.startTime && time <= this.model.endTime) status = true;

					if ( status != this.active ) {
						this.active = status;
						if ( this.active ) this.timelineView.addClass('bg-info');
						else this.timelineView.removeClass('bg-info');
					}				
				}

			}
	
}, window));
