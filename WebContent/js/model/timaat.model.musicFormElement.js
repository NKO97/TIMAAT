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

	TIMAAT.MusicFormElement = class MusicFormElement {
		constructor(model) {
			// console.log("TCL: MusicFormElement -> constructor -> model", model);
			// setup model
			this.model = model;
			this.active = false;

			// create and style list view element
			this.listView = $(`
				<li class="list-group-item timaat-annotation-list-music-form-element p-0 bg-secondary">
					<div class="d-flex justify-content-between">
						<span class="font-weight-bold pt-1 text-light pl-1">
							<i class="timaat-annotation-music-form-element-comment-icon fas fa-fw fa-comment" aria-hidden="true"></i>
							<span class="timaat-annotation-music-form-element-type"></span>
						</span>
					</div>
				</li>`
			);
			this.timelineView = $(`
				<div class="timaat-timeline-music-form-element">
					<div class="timaat-timeline-music-form-element-type text-white font-weight-bold"></div>
					<div class="timaat-timeline-music-form-element-lyrics" data-role="lyricsTooltip" title="" html="true" data-html="true" data-toggle="tooltip"></div>
				</div>`
			);
			this.timelineView.attr('data-start', this.model.startTime);
			this.timelineView.attr('data-end', this.model.endTime);

			var musicFormElement = this; // save annotation for events
		}

		updateUI() {
			// console.log("TCL: MusicFormElement -> updateUI -> updateUI()");
      // console.log("TCL: MusicFormElement -> updateUI -> this: ", this);
			this.listView.attr('data-starttime', this.model.startTime);
			this.listView.attr('data-endtime', this.model.endTime);
			this.listView.attr('id', 'musicFormElement-'+this.model.id);
			this.listView.attr('data-type', 'musicFormElement');
			this.timelineView.find('.timaat-timeline-music-form-element-type').html(this.model.musicFormElementType.musicFormElementTypeTranslations[0].type);
			// if (this.model.repeatLastRow && this.model.musicFormElementTranslations[0].text.length > 11) { // default value when empty, due to summernote, is '<p><br></p>
			if (this.model.musicFormElementTranslations[0].text.length > 11) { // default value when empty, due to summernote, is '<p><br></p>
			// 	this.timelineView.find('.timaat-timeline-music-form-element-lyrics').html('<i class="timaat-timeline-music-form-element-repeatLastRow-icon fas fa-fw fa-redo-alt"></i>' + this.model.musicFormElementTranslations[0].text);
			// } else {
			this.timelineView.find('.timaat-timeline-music-form-element-lyrics').html(this.model.musicFormElementTranslations[0].text);
			// }
			// this.timelineView.find('.timaat-timeline-music-form-element-lyrics').prop('title', this.model.musicFormElementTranslations[0].text);
			this.timelineView.find('.timaat-timeline-music-form-element-lyrics').attr('data-original-title', this.model.musicFormElementTranslations[0].text);
			} else {
				this.timelineView.find('.timaat-timeline-music-form-element-lyrics').html('');
				this.timelineView.find('.timaat-timeline-music-form-element-lyrics').attr('data-original-title', '');
			}
			// update timeline position
			let length = (this.model.endTime - this.model.startTime) / (TIMAAT.VideoPlayer.duration) * 100.0;
			let offset = this.model.startTime / (TIMAAT.VideoPlayer.duration) * 100.0;
			let colorHex = this.model.musicFormElementType.colorHex;
			this.timelineView.css('width', length+'%');
			this.timelineView.css('margin-left', (offset)+'%');
			this.timelineView.css('background-color', '#'+colorHex);
		}

		addUI() {
			// console.log("TCL: MusicFormElement -> addUI -> addUI()");
			$('#timaat-timeline-music-form-element-pane').append(this.timelineView);
			var musicFormElement = this; // save annotation for events

			// attach event handlers
			this.timelineView.on('click', this, function(ev) {
				TIMAAT.VideoPlayer.curMusicFormElement = musicFormElement;
				this.classList.add('timaat-timeline-selected-music-form-element');
				TIMAAT.VideoPlayer.selectedElementType = 'musicFormElement';
				TIMAAT.VideoPlayer.jumpVisible(musicFormElement.model.startTime, musicFormElement.model.endTime);
				TIMAAT.VideoPlayer.pause();
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				$('#timaat-timeline-keyframe-pane').hide();
				TIMAAT.VideoPlayer.inspector.setItem(musicFormElement, 'musicFormElement');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'MusicFormElement · '+musicFormElement.model.musicFormElementTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/musicFormElement/'+musicFormElement.model.id);
			});
			this.timelineView.on('dblclick', this, function(ev) {
				TIMAAT.VideoPlayer.curMusicFormElement = musicFormElement;
				this.classList.add('timaat-timeline-selected-music-form-element');
				TIMAAT.VideoPlayer.selectedElementType = 'musicFormElement';
				// TIMAAT.VideoPlayer.jumpVisible(musicFormElement.model.startTime, musicFormElement.model.endTime);
				TIMAAT.VideoPlayer.jumpTo(musicFormElement.model.startTime);
				TIMAAT.VideoPlayer.pause();
				if (TIMAAT.VideoPlayer.curAnnotation) {
					TIMAAT.VideoPlayer.curAnnotation.setSelected(false);
				}
				$('#timaat-timeline-keyframe-pane').hide();
				TIMAAT.VideoPlayer.inspector.setItem(musicFormElement, 'musicFormElement');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
				// TODO
				// TIMAAT.URLHistory.setURL(null, 'MusicFormElement · '+musicFormElement.model.musicFormElementTranslations[0].name, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id+'/musicFormElement/'+musicFormElement.model.id);
			});
			this.timelineView.on('.timaat-timeline-music-form-element-lyrics > mouseover', this, function(event) {
				// if (musicFormElement.model.musicFormElementTranslations[0].text.length > 11) { // default value when empty, due to summernote, is '<p><br></p>
					$('.timaat-timeline-music-form-element > [data-toggle="tooltip"]').tooltip({boundary: "window", trigger: "hover"});
				// }
			});
			// console.log("TCL: MusicFormElement -> addUI -> this.updateUI()");
			this.updateUI();
		}

		removeUI() {
			this.timelineView.remove();
			TIMAAT.VideoPlayer.selectedElementType = null;
			this.updateUI();
		}

		updateStatus(timeInSeconds, onTimeUpdate) {
			// console.log("TCL: MusicFormElement -> updateStatus -> time", time);
			let time = timeInSeconds * 1000;
			var highlight = false;
			if ( time >= this.model.startTime && time < this.model.endTime) highlight = true;

			// TODO change appearance of element when de-/selected
			if ( highlight != this.highlighted ) { // highlight changed?
				this.highlighted = highlight;
				if ( this.highlighted ) { //  element highlighted at current time?
					if (!this.timelineView[0].classList.contains('timaat-timeline-selected-music-form-element')) // only add bg-info if not already selected element
					this.timelineView.removeClass('timaat-timeline-selected-music-form-element');
				}
				else { // element not highlighted at current time
					this.timelineView.addClass('timaat-timeline-selected-music-form-element');
					if (!onTimeUpdate) // keep bg-primary if time changed due to timeline-slider change
						this.timelineView.removeClass('timaat-timeline-selected-music-form-element');
				}
			} else { // highlight remains unchanged
				if (TIMAAT.VideoPlayer.selectedElementType != 'musicFormElement') { // update bg-primary if other element in same structure is selected
          this.timelineView.removeClass('timaat-timeline-selected-music-form-element');
					if (this.highlighted) {
						this.timelineView.removeClass('timaat-timeline-selected-music-form-element');
					}
				}
				if (TIMAAT.VideoPlayer.curMusicFormElement && this.model.id != TIMAAT.VideoPlayer.curMusicFormElement.model.id) { // update bg-primary when switching elements on same hierarchy via timeline-slider and selecting
					this.timelineView.removeClass('timaat-timeline-selected-music-form-element');
				}
			}
		}

	}

}, window));
