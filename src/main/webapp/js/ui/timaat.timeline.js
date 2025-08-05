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

	TIMAAT.Timeline = class Timeline {
		constructor() {
			// console.log('TCL: Timeline -> constructor');

			// init UI
			let timeline      = this;
			this.ui           = {};
			this.ui.indicator = $('.js-timeline__position-indicator');
			this.ui.maxZoom   = 1;
			this.ui.minZoom   = 1;
			this.ui.pane      = $('.js-timeline__layer-pane');
			this.ui.timeInfo  = this.ui.pane.find('.timeline-info');
			this.ui.track     = $('.timelineTrack');
			this.ui.tracking  = false;
			this.ui.zoom      = 1;
			this.ui.zoomIn    = $('.timelineZoomIn');
			this.ui.zoomIn.prop('disabled', true);
			this.ui.zoomOut   = $('.timelineZoomOut');
			this.ui.zoomOut.prop('disabled', true);
			this.ui.tickTemplate =
				`<div class="timeline__scale-segment float-left pt-1">
					<span class="timeline__scale-segment--graduation-mark-0 timecodeLabel text-light">00:01</span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-1"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-2"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-3"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-4"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-5"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-6"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-7"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-8"></span>
					<span class="timeline__scale-segment--graduation-mark timeline__scale-segment--graduation-mark-9"></span>
				</div>`;

			// attach listeners
			this.ui.pane.on('scroll', function(ev) {
				timeline.ui.pane.find('.js-timeline__section-header').css('margin-left', timeline.ui.pane.scrollLeft()+'px');
			});

            this.ui.pane.on('wheel', TIMAAT.Util.throttle(function(ev) {
                //Check if the scroll event is a vertical scrolling on touch pads
                if(Math.abs(ev.originalEvent.deltaY) > Math.abs(ev.originalEvent.deltaX)){
                    if(ev.originalEvent.deltaY > 0){
                        const newZoom = this.ui.zoom + 1
                        this.setZoom(newZoom)
                    }else if(ev.originalEvent.deltaY < 0) {
                        const newZoom = this.ui.zoom - 1
                        this.setZoom(newZoom)
                    }
                }
            }.bind(this), 50));

			this.ui.pane.on('scroll', function(ev) {
				timeline.ui.pane.find('.js-timeline__movable_content').css('margin-left', timeline.ui.pane.scrollLeft()+'px');
			});

			this.ui.pane.find('.timelineSortableSections').sortable({
				axis: 'y',
				handle: '.js-timeline__section-header',
				containment: 'parent',
			});

			this.tracking = this.ui.tracking;

			this.ui.zoomIn.on('click', function(ev) { timeline.setZoom(timeline.ui.zoom-1); });
			this.ui.zoomOut.on('click', function(ev) { timeline.setZoom(timeline.ui.zoom+1); });
			this.ui.track.on('click', function(ev) { timeline.tracking = !timeline.isTacking; });

			this.ui.timeInfo.on('click mousedown drag', function(ev) {
				let el = $(ev.target);
				let offset = ev.offsetX;
				if ( el && el.hasClass('timeline__scale-segment') ) {
					let timeInMs = Math.floor(parseInt(el.attr('data-start')) + ((offset / 50.0) * timeline.ui.zoom));
					TIMAAT.VideoPlayer.jumpTo(timeInMs);
				}
			});

		}

		get isTacking() {
			return this.ui.tracking;
		}

		set tracking(tracking) {
			this.ui.tracking = tracking;
			this.ui.track.removeClass('btn-primary').removeClass('btn-outline-secondary');
			this.ui.track.addClass((this.ui.tracking)?'btn-primary':'btn-outline-secondary');
		}

		initMedium(medium) {
			this.medium = medium;
			if ( this.medium ) {
				this.ui.zoom = 0;
				if (this.medium.mediumAudio) {
					this.duration = this.medium.mediumAudio.length;
					this.durationSec = this.medium.mediumAudio.length / 1000.0;
				} else if (this.medium.mediumVideo) {
					this.duration = this.medium.mediumVideo.length;
					this.durationSec = this.medium.mediumVideo.length / 1000.0;
				}
				this.ui.minZoom = Math.max(1, Math.floor(this.duration / 1000.0 / 40.0));
				this.setZoom(this.ui.minZoom);
				this.invalidateSize();
				this.updateIndicator();
			}
		}

		reset() {
			this.invalidateSize();
		}

		setZoom(zoom) {
			let newZoom = Math.min(this.ui.minZoom, Math.max(this.ui.maxZoom, zoom));
			if ( newZoom == this.ui.zoom ) return;

			let center = (this.ui.pane.scrollLeft() + (this.ui.uiWidth / 2)) / this.ui.width;

			this.ui.zoom = newZoom;
			this.ui.width = (this.duration / 1000.0 / this.ui.zoom * 50.0);
			this.ui.pane.find('.timeline__section-content').css('width', this.ui.width + 'px');
			this._initTicks();

			this.ui.zoomIn.prop('disabled', this.ui.zoom == this.ui.maxZoom);
			this.ui.zoomOut.prop('disabled', this.ui.zoom == this.ui.minZoom);
			this.updateIndicator();
			this.ui.pane.scrollLeft((center * this.ui.width) - (this.ui.uiWidth / 2 ));
		}

		updateIndicator() {
			if ( !TIMAAT.VideoPlayer.medium || !TIMAAT.VideoPlayer.medium.currentTime ) return;
			let pos = (TIMAAT.VideoPlayer.medium.currentTime / this.durationSec) * this.ui.width;
			this.ui.indicator.css('margin-left', pos + 'px');

			if ( this.ui.tracking ) {
				// keep time indicator visible
				let scroll = this.ui.pane.scrollLeft();
				if ( pos < scroll ) this.ui.pane.scrollLeft(pos-100);
				else if ( (!TIMAAT.VideoPlayer.isPlaying() && pos > (scroll + this.ui.uiWidth))
					   || (TIMAAT.VideoPlayer.isPlaying() && pos > (scroll + (this.ui.uiWidth/2))) ) {
					 this.ui.pane.scrollLeft( (TIMAAT.VideoPlayer.isPlaying()) ? (pos-(this.ui.uiWidth/2)) : (pos+this.ui.uiWidth-100) );
				}
			}
		}
		invalidateSize() {
			this.ui.uiWidth = $('.timeline').width();
		}

		_initTicks() {
			this.ui.timeInfo.empty();
			for (let i = 0; i <= Math.ceil(this.duration / 1000.0 / this.ui.zoom)+1; i++) {
				let tick = $(this.ui.tickTemplate);
				let time = i * this.ui.zoom;
				tick.attr('data-start', time * 1000);
				let hour = Math.floor(time / 3600.0);
				let min = Math.floor((time-(hour*60)) / 60.0);
				let sek = time % 60;
				let timecode = '';
				if ( hour > 0 ) timecode += hour+':';
				timecode += (min < 10) ? '0'+min+':' : min+':';
				timecode += (sek < 10) ? '0'+sek : sek;
				tick.find('.timecodeLabel').text(timecode);
				this.ui.timeInfo.append(tick);
			}

		}
	}

}, window));
