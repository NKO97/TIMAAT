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
			
			let timeline = this;
			this.ui.indicator = $('.time-indicator');
			this.ui.pane = $('#timeline .timeline-layer-pane');
			this.ui.zoomin = $('.timeline-zoom-in');
			this.ui.zoomout = $('.timeline-zoom-out');
			this.ui.zoomin.prop('disabled', true);
			this.ui.zoomout.prop('disabled', true);
			
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
			
			this.ui.zoomin.on('click', function(ev) { timeline.setZoom(timeline.ui.zoom-1); });
			this.ui.zoomout.on('click', function(ev) { timeline.setZoom(timeline.ui.zoom+1); });
			
			this.ui.timeinfo.on('click', function(ev) {
				console.log(ev.originalEvent);
			});
					

		}
		
		initVideo(video) {
			this.video = video;
			if ( this.video ) {
				this.ui.zoom = 0;
				this.duration = this.video.mediumVideo.length;
				this.ui.minZoom = Math.max(1, Math.floor(this.duration / 1000.0 / 40.0));
				this.setZoom(this.ui.minZoom);
			}
		}
				
		reset() {
		}
		
		setZoom(zoom) {
			let newZoom = Math.min(this.ui.minZoom, Math.max(this.ui.maxZoom, zoom));
			if ( newZoom == this.ui.zoom ) return;
			
			this.ui.zoom = newZoom;
			this.ui.width = (this.duration / 1000.0 / this.ui.zoom * 50.0);
			this.ui.pane.find('.timeline-section-content').css('width', this.ui.width+'px');
			this._initTicks();
			
			
			this.ui.zoomin.prop('disabled', this.ui.zoom == this.ui.maxZoom);
			this.ui.zoomout.prop('disabled', this.ui.zoom == this.ui.minZoom);
		}
		
		setTime(time) {
//			this.ui.indicator.css('margin-left', (TIMAAT.VideoPlayer.video.currentTime*100000.0/TIMAAT.VideoPlayer.model.video.mediumVideo.length)+'%');
		}
		
		_initTicks() {
			this.ui.timeinfo.empty();
			for (let i = 0; i <= Math.ceil(this.duration / 1000.0 / this.ui.zoom)+1; i++) {
				let tick = $(this.ui.tickTemplate);
				let time = i * this.ui.zoom;
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
