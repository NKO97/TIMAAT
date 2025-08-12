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

	TIMAAT.Marker = class Marker {
		constructor(annotation, containerSelector) {
			// console.log("TCL: Marker -> constructor -> annotation", annotation);
			this.parent = annotation;
			this.annotation = annotation;
			// this.annotationID = annotation.model.id;
			this._from = Math.min(annotation.startTime, TIMAAT.VideoPlayer.duration);
			this._to = Math.max(annotation.startTime, annotation.model.endTime);
			this._colorHex = annotation.model.selectorSvgs[0].colorHex;

			// construct marker element
			this.ui = {
					offset: 0,
					element: $(`<div class="timeline__marker">
												<div class="timeline__marker-bar">
												</div>
												<div class="timeline__marker-head">
												</div>
												<div class="timeline__marker-start">
												</div>
												<div class="timeline__marker-end">
												</div>
											</div>`),
			};
			this.ui.element.attr('id','timaat-marker-'+this.annotation.model.id);

			this.regionStart = $(this.ui.element.find('.timeline__marker-start'));
			this.regionEnd = $(this.ui.element.find('.timeline__marker-end'));

			var marker = this;
			var _markerLength;
			this.regionStart.draggable({
				axis: "x",
				containment: containerSelector,
				start: function(ev,ui) {
					_markerLength = Math.max(0.0, marker.regionEnd.position().left);
					if (_markerLength > 0 ) _markerLength += 1;
					TIMAAT.VideoPlayer.pause();
				},
				drag: function(ev,ui) {
					if ( ui.position.left > _markerLength ) ui.position.left = _markerLength;

					var width = TIMAAT.VideoPlayer.timeline.ui.width;
					var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					var newOffset = Math.max(0.0, offset + ui.position.left);
					var newFrom = TIMAAT.VideoPlayer.duration * newOffset / width;
					TIMAAT.VideoPlayer.jumpTo(newFrom);

				},
				stop: function(ev, ui) {
					var width = TIMAAT.VideoPlayer.timeline.ui.width;
					var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					var newOffset = Math.max(0.0, offset + ui.position.left);
					var newFrom = TIMAAT.VideoPlayer.duration * newOffset / width;

					marker.parent.startTime = newFrom;
					marker.updateView();
					TIMAAT.VideoPlayer.inspector.updateItem();

					$(this).attr('style', 'position:relative');
				},
			});
			this.regionEnd.draggable({
				axis: "x",
				containment: containerSelector,
				start: function(ev,ui) {
					TIMAAT.VideoPlayer.pause();
					_markerLength = -Math.max(0.0, $(this).position().left);
					if (_markerLength < 0 ) _markerLength -= 1;
				},
				drag: function(ev,ui) {
					if ( ui.position.left < -2 ) ui.position.left = -2;

					var width = TIMAAT.VideoPlayer.timeline.ui.width;
					var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					var newOffset = Math.max(0.0, offset+ui.position.left+2);
					var newLength = newOffset * TIMAAT.VideoPlayer.duration / width;

					TIMAAT.VideoPlayer.jumpTo(newLength);
				},
				stop: function(ev, ui) {
					var width = TIMAAT.VideoPlayer.timeline.ui.width;
					var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					var newOffset = Math.max(0.0, offset+ui.position.left+2);
					var newLength = newOffset * TIMAAT.VideoPlayer.duration / width;

					marker.parent.endTime = newLength;
					TIMAAT.VideoPlayer.jumpTo(newLength);
					marker.updateView();
					TIMAAT.VideoPlayer.inspector.updateItem();

					$(this).attr('style', 'position:relative');
				},
			});

			this._updateElementColor();
			this._updateElementOffset();
			$(containerSelector).append(this.ui.element);
			TIMAAT.VideoPlayer.markerList.push(this);

			// add events
			this.ui.element.find('.timeline__marker-bar,.timeline__marker-head').on('click', this, function(ev) {
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.jumpTo(ev.data.from);
				TIMAAT.VideoPlayer.selectAnnotation(ev.data.parent);
			});
			this._updateElementStyle();
		}

		get UIOffset() {
			return this.ui.offset;
		}

		set UIOffset(offset) {
			if ( this.ui.offset == offset ) return;
			this.ui.offset = offset;
			this._updateElementOffset();
		};

		get from() {
			return this._from;
		}

		set from(from) {
			this._from = Math.min(from, TIMAAT.VideoPlayer.duration);
			this._to = Math.max(from, this._to);
			this._updateElementOffset();
		};

		get to() {
			return this._to;
		}

		set to(to) {
			this._from = Math.min(this._from, TIMAAT.VideoPlayer.duration);
			this._to = Math.max(this._from, to);
			this._updateElementOffset();
		};

		setRange(from, to) {
			this._from = Math.min(from, TIMAAT.VideoPlayer.duration);
			this._to = Math.max(from, to);
			this._updateElementOffset();
		}

		get color() {
			return this._colorHex;
		}

		remove() {
			this.ui.element.remove();
		}

		updateView() {
			this._from = this.parent.startTime;
			this._to = this.parent.endTime;
			this._colorHex = this.parent.svg.colorHex;
			this._updateElementColor();
			this._updateElementOffset();
			this._updateElementStyle();

			if ( this.parent.isSelected() && this.parent.isAnimation() ) this.ui.element.addClass('timeline__marker-anim');
			else this.ui.element.removeClass('timeline__marker-anim');

			if ( this.parent.isSelected() && !this.parent.isAnimation() ) {
				this.regionStart.attr('style','position:relative;');
				this.regionStart.show();
				this.regionEnd.attr('style','position:relative;');
				this.regionEnd.show();
			} else {
				this.regionStart.hide();
				this.regionEnd.hide();
			}
		}

		_updateElementColor() {
			// console.log("TCL: Marker -> _updateElementColor -> _updateElementColor()");
			this.ui.element.find('.timeline__marker-bar').css('background-color', this.hexToRgbA(this._colorHex, 0.3));
			this.ui.element.css('border-left-color', '#' + this._colorHex);
			this.ui.element.find('.timeline__marker-head').css('background-color', '#' + this._colorHex);
			this.ui.element.removeClass('timeline__marker-white');
			if ( this._colorHex.toLowerCase() == 'ffffff' ) this.ui.element.addClass('timeline__marker-white');
		}

		_updateElementOffset() {
			// console.log("TCL: Marker -> _updateElementOffset -> _updateElementOffset()");
			var magicOffset = 0; // TODO replace input slider

			var width =  $('#videoSeekBar').width();
			var length = (this._to - this._from) / TIMAAT.VideoPlayer.duration * width;
			length = Math.max(0, length);
			var offset = this._from / TIMAAT.VideoPlayer.duration * width;

			this.ui.element.css('width', (length / width * 100.0) + '%');
			this.ui.element.css('margin-left', (offset / width * 100.0) + '%');

//			  this.ui.element.css('width', length+'px');
//			  this.ui.element.css('margin-left', (offset+magicOffset)+'px');

			var startOffset = 5;
			this.ui.element.find('.timeline__marker-bar').css('margin-top', (startOffset + (this.ui.offset * 12)) + 'px' );
		}

		_updateElementStyle() {
			// console.log("TCL: Marker -> _updateElementStyle -> _updateElementStyle()");
			this.ui.element.find('.timeline__marker-head').removeClass('timeline__marker-head--polygon')
																										.removeClass('timeline__marker-head--animation');
			if ( this.parent.isAnimation() ) this.ui.element.find('.timeline__marker-head').addClass('timeline__marker-head--animation');
			else if ( this.parent.hasPolygons() ) this.ui.element.find('.timeline__marker-head').addClass('timeline__marker-head--polygon');

			(this.annotation.model.layerVisual) ? this.ui.element.addClass('timelineMarkerVisual') : this.ui.element.removeClass('timelineMarkerVisual');
			(this.annotation.model.layerAudio) ? this.ui.element.addClass('timelineMarkerAudio') : this.ui.element.removeClass('timelineMarkerAudio');
		}

		hexToRgbA(hex, alpha) {
			var r = parseInt(hex.slice(0, 2), 16);
			var	g = parseInt(hex.slice(2, 4), 16);
			var b = parseInt(hex.slice(4, 6), 16);
			return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
		}
	}
    TIMAAT.TemporaryWaveformMarker = class TemporaryWaveformMarker {

        constructor(startXPercentage, parent) {
            this._startXPercentage = startXPercentage
            this._endXPercentage = startXPercentage;

            this.ui = $(`<div class="temporary_waveform_marker"></div>`);
            parent.append(this.ui)
            this.updateUI();
        }

        set endXPercentage(endXPercentage) {
            this._endXPercentage = endXPercentage;
            this.updateUI();
        }

        get startXPercentage() {
            if(this._startXPercentage < this._endXPercentage) {
                return this._startXPercentage
            }else {
                return this._endXPercentage;
            }
        }

        get endXPercentage() {
            if(this._startXPercentage > this._endXPercentage) {
                return this._startXPercentage
            }else {
                return this._endXPercentage;
            }
        }

        updateUI() {
            let left;
            let width;
            if(this._startXPercentage > this._endXPercentage){
                left = this._endXPercentage
                width = this._startXPercentage - this._endXPercentage
            }else {
                left = this._startXPercentage
                width = this._endXPercentage - this._startXPercentage
            }

            this.ui.css('width', width * 100+ '%');
            this.ui.css('left', left  * 100+ '%');
        }

        removeFromUi(){
            this.ui.remove();
        }
    }
}, window));
