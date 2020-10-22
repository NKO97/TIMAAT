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
			  this.annotationID = annotation.model.id;
			  this._from = Math.min(annotation.startTime, TIMAAT.VideoPlayer.duration);
			  this._to = Math.max(annotation.startTime, annotation.model.sequenceEndTime/1000.0);
			  this._color = '#'+annotation.model.selectorSvgs[0].colorRgba.substring(0,6);
			  
			  // construct marker element
			  this.ui = {
					  offset: 0,
					  element: $('<div class="timaat-timeline-marker"><div class="timaat-timeline-markerbar"></div><div class="timaat-timeline-markerhead"></div><div class="timaat-timeline-marker-start"></div><div class="timaat-timeline-marker-end"></div></div>'),
			  };
			  this.ui.element.attr('id','timaat-marker-'+this.annotationID);
			    
			  this.regionstart = $(this.ui.element.find('.timaat-timeline-marker-start'));
			  this.regionend = $(this.ui.element.find('.timaat-timeline-marker-end'));
			    
			  var marker = this;
			  var _markerlength;
			  this.regionstart.draggable({
				  axis: "x",
				  containment: "#timaat-timeline-marker-pane",
				  start: function(ev,ui) {
					  _markerlength = Math.max(0.0, marker.regionend.position().left);
					  if (_markerlength > 0 ) _markerlength += 1;
					  TIMAAT.VideoPlayer.pause();
				  },
				  drag: function(ev,ui) {
					  if ( ui.position.left > _markerlength ) ui.position.left = _markerlength;
			    	
					  var width = $('#timaat-video-seek-bar').width();
					  var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					  var newoffset = Math.max(0.0, offset+ui.position.left);
					  var newfrom = newoffset * TIMAAT.VideoPlayer.duration / width;
					  TIMAAT.VideoPlayer.jumpTo(newfrom);
			    		
				  },
				  stop: function(ev, ui) {
					  var width = $('#timaat-video-seek-bar').width();
					  var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					  var newoffset = Math.max(0.0, offset+ui.position.left);
					  var newfrom = newoffset * TIMAAT.VideoPlayer.duration / width;

					  marker.parent.startTime = newfrom;
					  marker.updateView();
					  TIMAAT.VideoPlayer.inspector.updateItem();
			    		
					  $(this).attr('style', 'position:relative');
				  },
			  });
			  this.regionend.draggable({
				  axis: "x",
				  containment: "#timaat-timeline-marker-pane",
				  start: function(ev,ui) {
					  TIMAAT.VideoPlayer.pause();
					  _markerlength = -Math.max(0.0, $(this).position().left);
					  console.log(_markerlength);
					  if (_markerlength < 0 ) _markerlength -= 1;
				  },
				  drag: function(ev,ui) {
					  console.log(ui.position.left, _markerlength);
					  if ( ui.position.left < -2 ) ui.position.left = -2;

					  var width = $('#timaat-video-seek-bar').width();
					  var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					  var newoffset = Math.max(0.0, offset+ui.position.left+2);
					  var newlength = newoffset * TIMAAT.VideoPlayer.duration / width;

					  TIMAAT.VideoPlayer.jumpTo(newlength);
				  },
				  stop: function(ev, ui) {
					  var width = $('#timaat-video-seek-bar').width();
					  var offset = marker._from / TIMAAT.VideoPlayer.duration * width;
					  var newoffset = Math.max(0.0, offset+ui.position.left+2);
					  var newlength = newoffset * TIMAAT.VideoPlayer.duration / width;

					  marker.parent.endTime = newlength;
					  TIMAAT.VideoPlayer.jumpTo(newlength);
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
//			  console.log("TCL: Marker -> getfrom -> from()");
			  return this._from;
		  }
				
		  set from(from) {
//			  console.log("TCL: Marker -> setfrom -> from", from);
			  this._from = Math.min(from, TIMAAT.VideoPlayer.duration);
			  this._to = Math.max(from, this._to);
			  this._updateElementOffset();
		  };
			  
		  get to() {
//			  console.log("TCL: Marker -> getto -> to()");
			  return this._to;
		  }
				
		  set to(to) {
//			  console.log("TCL: Marker -> setto -> to", to);
			  this._from = Math.min(this._from, TIMAAT.VideoPlayer.duration);
			  this._to = Math.max(this._from, to);
			  this._updateElementOffset();
		  };	
				  
		  setRange(from, to) {
//			  console.log("TCL: Marker -> setRange -> from", from);
//			  console.log("TCL: Marker -> setRange -> to", to);
			  this._from = Math.min(from, TIMAAT.VideoPlayer.duration);
			  this._to = Math.max(from, to);
			  this._updateElementOffset();
		  }
			  
		  get color() {
//			  console.log("TCL: Marker -> getcolor -> color()");
			  return this._color;
		  }
			  
		  remove() {
//			  console.log("TCL: Marker -> remove -> remove()");
			  this.ui.element.remove();
		  }
			  
		  updateView() {
//			  console.log("TCL: Marker -> updateView -> updateView()");
			  this._from = this.parent.startTime;
			  this._to = this.parent.endTime;
			  this._color = '#'+this.parent.svg.color;
			  this._updateElementColor();
			  this._updateElementOffset();
			  this._updateElementStyle();
			  
			  if ( this.parent.isSelected() && this.parent.isAnimation() ) this.ui.element.addClass('timaat-timeline-marker-anim');
			  else this.ui.element.removeClass('timaat-timeline-marker-anim');
			  
			  if ( this.parent.isSelected() && !this.parent.isAnimation() ) {
				  this.regionstart.attr('style','position:relative;');
				  this.regionstart.show();
				  this.regionend.attr('style','position:relative;');
				  this.regionend.show();
			  } else {
				  this.regionstart.hide();
				  this.regionend.hide();
			  }
		  }

		  _updateElementColor() {
//			  console.log("TCL: Marker -> _updateElementColor -> _updateElementColor()");
			  this.ui.element.find('.timaat-timeline-markerbar').css('background-color', this.hexToRgbA(this._color,0.3));
			  this.ui.element.css('border-left-color', this._color);
			  this.ui.element.find('.timaat-timeline-markerhead').css('background-color', this._color);
			  this.ui.element.removeClass('timaat-timeline-marker-white');
			  if ( this._color.toLowerCase() == '#ffffff' ) this.ui.element.addClass('timaat-timeline-marker-white');
		  }
			  
		  _updateElementOffset() {
//			  console.log("TCL: Marker -> _updateElementOffset -> _updateElementOffset()");
			  var magicoffset = 0; // TODO replace input slider

			  var width =  $('#timaat-video-seek-bar').width();
			  var length = (this._to - this._from) / TIMAAT.VideoPlayer.duration * width;
			  length = Math.max(0,length);
			  var offset = this._from / TIMAAT.VideoPlayer.duration * width;
			  this.ui.element.css('width', length+'px');
			  this.ui.element.css('margin-left', (offset+magicoffset)+'px');

			  var startoffset = 20;
			  if ( this.annotation.model.layerVisual == 0 ) startoffset += 37;
			  this.ui.element.find('.timaat-timeline-markerbar').css('margin-top', (startoffset+(this.ui.offset*12))+'px' );
		  
		  }
		  
		  _updateElementStyle() {
//			  console.log("TCL: Marker -> _updateElementStyle -> _updateElementStyle()");
			  this.ui.element.find('.timaat-timeline-markerhead').removeClass('timaat-markerhead-polygon').removeClass('timaat-markerhead-anim');
			  if ( this.parent.isAnimation() ) this.ui.element.find('.timaat-timeline-markerhead').addClass('timaat-markerhead-anim');
			  else if ( this.parent.hasPolygons() ) this.ui.element.find('.timaat-timeline-markerhead').addClass('timaat-markerhead-polygon');
			  
			  this.ui.element.removeClass('timaat-timeline-marker-video').removeClass('timaat-timeline-marker-audio');
			  if ( this.annotation.model.layerVisual != 0 ) this.ui.element.addClass('timaat-timeline-marker-video');
			  else this.ui.element.addClass('timaat-timeline-marker-audio');
		  }
		  
		  hexToRgbA(hex, opacity) {
//			  console.log("TCL: Marker -> hexToRgbA -> hex", hex);
//			  console.log("TCL: Marker -> hexToRgbA -> opacity", opacity);
			  var c;
			  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
				  c = hex.substring(1).split('');
				  if ( c.length == 3 ) {
					  c = [c[0], c[0], c[1], c[1], c[2], c[2]];
				  }
				  c = '0x'+c.join('');
				  return 'rgba('+[(c>>16)&255, (c>>8)&255, (c)&255].join(',')+','+opacity+')';
			  }
			  throw new Error('Bad Hex');
		  }
	}
	
}, window));
