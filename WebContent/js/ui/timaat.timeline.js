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
			this.ui = {};
			this.ui.zoom = 1;
			this.ui.minZoom = 1;
			this.ui.maxZoom = 1;
			this.ui.tracking = false;
			
			let timeline = this;
			this.ui.indicator = $('.time-indicator');
			this.ui.pane = $('#timeline .timeline-layer-pane');
			this.ui.zoomIn = $('.timeline-zoom-in');
			this.ui.zoomOut = $('.timeline-zoom-out');
			this.ui.track = $('.timeline-track');
			this.ui.zoomIn.prop('disabled', true);
			this.ui.zoomOut.prop('disabled', true);
			
			this.ui.timeinfo = this.ui.pane.find('.timeline-info');
			this.ui.tickTemplate = `<div class="timeline-fulltick float-left pt-1">
				<div class="timeline-tick-0" style="font-size: 11px;padding-left: 2px;height: 28px;border-left: 1px solid #fff;position: absolute;margin-left: 0%;"><div class="timecode-label text-light" style="margin-top: -2px;">00:01</div></div><div class="timeline-tick-1" style="margin-top: 18px;height: 10px;border-left: 1px solid #eee;position: absolute;margin-left: 10%;"></div>
				<div class="timeline-tick-2" style="margin-top: 18px;height: 10px; border-left: 1px solid #eee; position: absolute; margin-left: 20%;"></div>
				<div class="timeline-tick-3" style="margin-top: 18px;height: 10px; border-left: 1px solid #eee; position: absolute; margin-left: 30%;"></div>
				<div class="timeline-tick-4" style="margin-top: 18px;height: 10px; border-left: 1px solid #eee; position: absolute; margin-left: 40%;"></div>
				<div class="timeline-tick-5" style="margin-top: 13px;height: 15px; border-left: 1px solid #eee;	position: absolute; margin-left: 50%;"></div>
				<div class="timeline-tick-6" style="margin-top: 18px;height: 10px; border-left: 1px solid #eee; position: absolute; margin-left: 60%;"></div>
				<div class="timeline-tick-7" style="margin-top: 18px;height: 10px; border-left: 1px solid #eee; position: absolute; margin-left: 70%;"></div>
				<div class="timeline-tick-8" style="margin-top: 18px;height: 10px; border-left: 1px solid #eee; position: absolute; margin-left: 80%;"></div>
				<div class="timeline-tick-9" style="margin-top: 18px;height: 10px; border-left: 1px solid #eee; position: absolute; margin-left: 90%;"></div>
			</div>`;

			// attach listeners
			this.ui.pane.on('scroll', function(ev) {
				timeline.ui.pane.find('.timeline-section-header').css('margin-left', timeline.ui.pane.scrollLeft()+'px');
			});
			
			this.ui.pane.find('.timeline-sortable-sections').sortable({
				axis: 'y',
				handle: '.timeline-section-header',
				containment: 'parent',
			});
	
			this.ui.pane.find('.timeline-section .timeline-section-header .collapse-widget').on('click', function() {
				let section = $(this).parent().parent().parent().parent();
				if ( section.hasClass('collapsed') ) section.removeClass('collapsed'); else section.addClass('collapsed');
			});
			this.tracking = this.ui.tracking;
			
			this.ui.zoomIn.on('click', function(ev) { timeline.setZoom(timeline.ui.zoom-1); });
			this.ui.zoomOut.on('click', function(ev) { timeline.setZoom(timeline.ui.zoom+1); });
			this.ui.track.on('click', function(ev) { timeline.tracking = !timeline.isTacking; });
			
			this.ui.timeinfo.on('click mousedown drag', function(ev) {
				let el = $(ev.target);
				let offset = ev.offsetX;
				if ( el && el.hasClass('timeline-fulltick') ) {
					TIMAAT.VideoPlayer.jumpTo(parseInt(el.attr('data-start')) + ((offset / 50.0) * timeline.ui.zoom));
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
		
		initAudio(audio) {
			this.audio = audio;
			if ( this.audio ) {
				this.ui.zoom = 0;
				this.duration = this.audio.mediumAudio.length;
				this.durationSec = this.audio.mediumAudio.length / 1000.0;				
				this.ui.minZoom = Math.max(1, Math.floor(this.duration / 1000.0 / 40.0));
				this.setZoom(this.ui.minZoom);
				this.invalidateSize();
				this.updateIndicator();
			}
		}
		initVideo(video) {
			this.video = video;
			if ( this.video ) {
				this.ui.zoom = 0;
				this.duration = this.video.mediumVideo.length;
				this.durationSec = this.video.mediumVideo.length / 1000.0;				
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
			this.ui.pane.find('.timeline-section-content').css('width', this.ui.width + 'px');
			this._initTicks();

			this.ui.zoomIn.prop('disabled', this.ui.zoom == this.ui.maxZoom);
			this.ui.zoomOut.prop('disabled', this.ui.zoom == this.ui.minZoom);
			this.updateIndicator();
			this.ui.pane.scrollLeft((center * this.ui.width) - (this.ui.uiWidth / 2 ));			
		}
		
		updateIndicator() {
			if ( !TIMAAT.VideoPlayer.video || !TIMAAT.VideoPlayer.video.currentTime ) return;
			let pos = (TIMAAT.VideoPlayer.video.currentTime / this.durationSec) * this.ui.width;
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
			this.ui.uiWidth = $('#timeline').width();
		}
		
		_initTicks() {
			this.ui.timeinfo.empty();
			for (let i = 0; i <= Math.ceil(this.duration / 1000.0 / this.ui.zoom)+1; i++) {
				let tick = $(this.ui.tickTemplate);
				let time = i * this.ui.zoom;
				tick.attr('data-start', time);
				let hour = Math.floor(time / 3600.0);
				let min = Math.floor((time-(hour*60)) / 60.0);
				let sek = time % 60;
				let timecode = '';
				if ( hour > 0 ) timecode += hour+':';
				timecode += (min < 10) ? '0'+min+':' : min+':';
				timecode += (sek < 10) ? '0'+sek : sek;
				tick.find('.timecode-label').text(timecode);
				this.ui.timeinfo.append(tick);
			}
		
		}
	}
	
}, window));
