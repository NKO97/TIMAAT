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
		constructor(annotation) {
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
					element: $(`<div class="timaat-timeline-marker">
												<div class="timaat-timeline-markerbar">
												</div>
												<div class="timaat-timeline-markerhead">
												</div>
												<div class="timaat-timeline-marker-start">
												</div>
												<div class="timaat-timeline-marker-end">
												</div>
											</div>`),
			};
			this.ui.element.attr('id','timaat-marker-'+this.annotation.model.id);
				
			this.regionStart = $(this.ui.element.find('.timaat-timeline-marker-start'));
			this.regionEnd = $(this.ui.element.find('.timaat-timeline-marker-end'));
				
			var marker = this;
			var _markerLength;
			this.regionStart.draggable({
				axis: "x",
				containment: "#timaat-timeline-marker-pane",
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
					TIMAAT.VideoPlayer.jumpTo(newFrom / 1000.0);
						
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
				containment: "#timaat-timeline-marker-pane",
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

					TIMAAT.VideoPlayer.jumpTo(newLength / 1000.0);
				},
				stop: function(ev, ui) {
					var width = TIMAAT.VideoPlayer.timeline.ui.width;
					var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					var newOffset = Math.max(0.0, offset+ui.position.left+2);
					var newLength = newOffset * TIMAAT.VideoPlayer.duration / width;

					marker.parent.endTime = newLength;
					TIMAAT.VideoPlayer.jumpTo(newLength / 1000.0);
					marker.updateView();
					TIMAAT.VideoPlayer.inspector.updateItem();

					$(this).attr('style', 'position:relative');
				},
			});

			this._updateElementColor();
			this._updateElementOffset();
			$('#timaat-timeline-marker-pane').append(this.ui.element);
			TIMAAT.VideoPlayer.markerList.push(this);
				
			// add events
			this.ui.element.find('.timaat-timeline-markerbar,.timaat-timeline-markerhead').on('click', this, function(ev) {
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.jumpTo(ev.data.from/1000);
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
			
			if ( this.parent.isSelected() && this.parent.isAnimation() ) this.ui.element.addClass('timaat-timeline-marker-anim');
			else this.ui.element.removeClass('timaat-timeline-marker-anim');
			
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
			this.ui.element.find('.timaat-timeline-markerbar').css('background-color', this.hexToRgbA(this._colorHex, 0.3));
			this.ui.element.css('border-left-color', '#' + this._colorHex);
			this.ui.element.find('.timaat-timeline-markerhead').css('background-color', '#' + this._colorHex);
			this.ui.element.removeClass('timaat-timeline-marker-white');
			if ( this._colorHex.toLowerCase() == 'ffffff' ) this.ui.element.addClass('timaat-timeline-marker-white');
		}
			
		_updateElementOffset() {
			// console.log("TCL: Marker -> _updateElementOffset -> _updateElementOffset()");
			var magicOffset = 0; // TODO replace input slider

			var width =  $('#video-seek-bar').width();
			var length = (this._to - this._from) / TIMAAT.VideoPlayer.duration * width;
			length = Math.max(0, length);
			var offset = this._from / TIMAAT.VideoPlayer.duration * width;

			this.ui.element.css('width', (length / width * 100.0) + '%');
			this.ui.element.css('margin-left', (offset / width * 100.0) + '%');

//			  this.ui.element.css('width', length+'px');
//			  this.ui.element.css('margin-left', (offset+magicOffset)+'px');

			var startOffset = 20;
//			  if ( TIMAAT.VideoPlayer.activeLayer == 'audio' ) startOffset += 37; // compensate for audio waveform
			this.ui.element.find('.timaat-timeline-markerbar').css('margin-top', (startOffset + (this.ui.offset * 12)) + 'px' );
		}
		
		_updateElementStyle() {
			// console.log("TCL: Marker -> _updateElementStyle -> _updateElementStyle()");
			this.ui.element.find('.timaat-timeline-markerhead').removeClass('timaat-markerhead-polygon')
																													.removeClass('timaat-markerhead-anim');
			if ( this.parent.isAnimation() ) this.ui.element.find('.timaat-timeline-markerhead').addClass('timaat-markerhead-anim');
			else if ( this.parent.hasPolygons() ) this.ui.element.find('.timaat-timeline-markerhead').addClass('timaat-markerhead-polygon');
			
			(this.annotation.model.layerVisual) ? this.ui.element.addClass('timaat-timeline-marker-visual') : this.ui.element.removeClass('timaat-timeline-marker-visual');
			(this.annotation.model.layerAudio) ? this.ui.element.addClass('timaat-timeline-marker-audio') : this.ui.element.removeClass('timaat-timeline-marker-audio');
		}
		
		hexToRgbA(hex, alpha) {
			var r = parseInt(hex.slice(0, 2), 16);
			var	g = parseInt(hex.slice(2, 4), 16);
			var b = parseInt(hex.slice(4, 6), 16);
			return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
		}

		// hexToRgbA(hex, opacity) {
		// 	console.log("TCL: Marker -> hexToRgbA -> hex, opacity", hex, opacity);
		//   var c;
		//   if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
		// 	  c = hex.substring(1).split('');
		// 	  if ( c.length == 3 ) {
		// 		  c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		// 	  }
		// 	  c = '0x'+c.join('');
		// 	  return 'rgba('+[(c>>16)&255, (c>>8)&255, (c)&255].join(',')+','+opacity+')';
		//   }
		//   throw new Error('Bad Hex');
		// }
	}
	
}, window));
