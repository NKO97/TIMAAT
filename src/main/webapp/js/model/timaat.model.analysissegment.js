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

	TIMAAT.AnalysisSegment = class AnalysisSegment {
		constructor(model) {
			// console.log("TCL: AnalysisSegment -> constructor -> model", model);
			// setup model
			this.model = model;
			this.active = false;

			// create and style list view element
			this.listView = $(`
				<li class="list-group-item annotationListSegment analysis__list--li p-0 bg-secondary">
					<div class="d-flex justify-content-between">
						<span class="font-weight-bold pt-1 text-light pl-1">
							<i class="annotationSegmentCommentIcon fas fa-fw fa-comment" aria-hidden="true"></i>
							<span class="analysis-list-element__title js-analysis-list-element__title"></span>
						</span>
					</div>
				</li>`
			);
			this.timelineView = $(`
				<div class="timeline__segment">
					<div class="timeline__segment-name text-white font-weight-bold"></div>
				</div>`
			);
			this.timelineView.attr('data-start', this.model.startTime);
			this.timelineView.attr('data-end', this.model.endTime);

            this.openInInspector = this.openInInspector.bind(this);
		}

        openInInspector(collapseInspector) {
            TIMAAT.VideoPlayer.curSegment = this;
            this.timelineView.removeClass('bg-info');
            this.timelineView.addClass('bg-primary');
            TIMAAT.VideoPlayer.selectedElementType = 'segment';
            TIMAAT.VideoPlayer.curSequence = null;
            TIMAAT.VideoPlayer.curTake = null;
            TIMAAT.VideoPlayer.jumpVisible(this.model.startTime, this.model.endTime);
            TIMAAT.VideoPlayer.pause();
            // TIMAAT.VideoPlayer.selectAnnotation(null);
            if (TIMAAT.VideoPlayer.curAnnotation) {
                TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
            }
            $('#timelineKeyframePane').hide();
            TIMAAT.VideoPlayer.inspector.setItem(this, 'segment');

            if(collapseInspector){
                TIMAAT.VideoPlayer.inspector.open('inspectorMetadata');
            }
        }

		updateUI() {
			// console.log("TCL: AnalysisSegment -> updateUI -> updateUI()");
			this.listView.attr('data-start-time', this.model.startTime);
			this.listView.attr('data-end-time', this.model.endTime);
			this.listView.attr('id', 'segment-'+this.model.id);
			this.listView.attr('data-type', 'segment');
			let timeString = " "+TIMAAT.Util.formatTime(this.model.startTime, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime, true);
			this.listView.find('.js-analysis-list-element__title').html(this.model.analysisSegmentTranslations[0].name);
			this.listView.find('.annotationSegmentShortDescription').html(this.model.analysisSegmentTranslations[0].shortDescription);
			this.listView.find('.annotationSegmentComment').html(this.model.analysisSegmentTranslations[0].comment);
			this.listView.find('.annotationSegmentTranscript').html(this.model.analysisSegmentTranslations[0].transcript);
			this.timelineView.find('.timeline__segment-name').html(this.model.analysisSegmentTranslations[0].name);

			// comment
			if ( this.model.analysisSegmentTranslations[0].comment && this.model.analysisSegmentTranslations[0].comment.length > 0 )
				this.listView.find('.annotationSegmentCommentIcon').show();
			else
				this.listView.find('.annotationSegmentCommentIcon').hide();

			// update timeline position
//			let width =  $('#videoSeekBar').width();
			let length = (this.model.endTime - this.model.startTime) / (TIMAAT.VideoPlayer.duration) * 100.0;
			let offset = this.model.startTime / (TIMAAT.VideoPlayer.duration) * 100.0;
			this.timelineView.css('width', length+'%');
			this.timelineView.css('margin-left', (offset)+'%');

		}

		addUI() {
			$('#analysisList').append(this.listView);
			$('#timelinePaneSegment').append(this.timelineView);

			var segment = this; // save annotation for events

			// attach event handlers
			this.listView.on('click', this, function(ev) {
				segment.openInInspector(false)
			});
			this.timelineView.on('click', this, function(ev) {
                segment.openInInspector(false)
			});
			this.listView.on('dblclick', this, function(ev) {
				segment.openInInspector(true)
			});
			this.timelineView.on('dblclick', this, function(ev) {
				segment.openInInspector(true)
			});

			this.updateUI();
		}

		removeUI() {
			this.listView.remove();
			this.timelineView.remove();
			TIMAAT.VideoPlayer.selectedElementType = null;
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
