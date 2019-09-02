/**
 * TIMAAT: Annotation logic class
 */

const TIMAAT = {
		Marker: class Marker {
			  constructor(annotation) {
			    this.parent = annotation;
			    this.annotation = annotation.model;
			    this.annotationID = annotation.model.id;
			    this._from = Math.min(annotation.model.startTime, TIMAAT.VideoPlayer.duration);
			    this._to = Math.max(annotation.model.startTime, annotation.model.endTime);
			    this._color = '#'+annotation.model.svg[0].color;
			    
			    // construct marker element
			    this.element = $('<div class="timaat-timeline-marker"><div class="timaat-timeline-markerhead"></div></div>');
			    this.element.attr('id','timaat-marker-'+this.annotationID);
			    
			    this._updateElementColor();
			    this._updateElementOffset();
			    $('#timaat-timeline-marker-pane').append(this.element);
			    TIMAAT.VideoPlayer.markerList.push(this);
			    
			    // add events
			    this.element.click(this, function(ev) {
				    TIMAAT.VideoPlayer.pause();
				    TIMAAT.VideoPlayer.jumpTo(ev.data.from);
				    TIMAAT.VideoPlayer.selectAnnotation(ev.data.parent);
			    });
			  }
			  
			  get from() {
				  return this._from;
			  }
			  set from(from) {
				  this._from = Math.min(from, TIMAAT.VideoPlayer.duration);
				  this._to = Math.max(from, this._to);
				  this._updateElementOffset();
			  };
			  
			  get to() {
				  return this.to;
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
				  return this._color;
			  }
			  
			  remove() {
				  this.element.remove();
			  }
			  
			  updateView() {
				  this._from = this.parent.model.startTime;
				  this._to = this.parent.model.endTime;
				  this._color = '#'+this.parent.svg.color;
				  this._updateElementColor();
				  this._updateElementOffset();
			  }
			  

			  _updateElementColor() {
		      	    this.element.css('background-color', this.hexToRgbA (this._color, 0.3));
			    this.element.css('border-left-color', this._color);
			    this.element.find('.timaat-timeline-markerhead').css('background-color', this._color);	  	
			  }
			  
			  _updateElementOffset() {
				  var magicoffset = 1; // TODO replace input slider

				  var width =  $('#timaat-video-seek-bar').width();
				  var length = (this._to - this._from) / TIMAAT.VideoPlayer.duration * width;
				  var offset = this._from / TIMAAT.VideoPlayer.duration * width;
				  this.element.css('width', length+'px');
				  this.element.css('margin-left', (offset+magicoffset)+'px');
			  }
			  
			  hexToRgbA(hex, opacity) {
			      var c;
			      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			          c= hex.substring(1).split('');
			          if(c.length== 3){
			              c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			          }
			          c= '0x'+c.join('');
			          return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
			      }
			      throw new Error('Bad Hex');
			  }
			  
			}
}