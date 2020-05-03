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
	
	TIMAAT.Keyframe = class Keyframe {
		constructor(keyframe, annotation) {
//			console.log("TCL: Keyframe -> constructor -> keyframe, annotation", keyframe, annotation);
			this.parent = annotation;
			this.annotation = annotation;
			this.model = keyframe;
			this.annotationID = annotation.model.id;
			this._time = this.model.time;
			this._visible = true;
			this._selected = false;
			
			this.shapes = [];
			this.shapeMap = new Map();
			for (let svgitem of this.model.shapes) {
				let shape = this._parseModel(svgitem);
				this.addShape(shape);
			}
			// init keyframe UI
			this.ui = {
					timelineTemplate : `<div class="timaat-timeline-keyframe"><div class="timaat-timeline-keyframehead"></div></div>`
			}
			this.ui.timelineView = $(this.ui.timelineTemplate);
			this.ui.head = this.ui.timelineView.find('.timaat-timeline-keyframehead');
			$('#timaat-timeline-keyframe-pane').append(this.ui.timelineView);
			if ( this.time == 0 ) this.ui.head.addClass('first');
			// add events
			this.ui.head.click(this, function(ev) {
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.jumpTo(ev.data.parent.startTime+ev.data.time);
			});

			this.updateUI();
			this._updateOffsetUI();
		}
		
		addShape(shape) {
			// TODO check if shape id exists
			this.shapes.push(shape);
			this.shapeMap.set(shape.id, shape);
		}
		
		get time() {
			return this._time;
		}

		set time(time) {
			this._time = time;
			this._updateOffsetUI();
		}
		
		getShape(id) {
			return this.shapeMap.get(id);
		}
		
		discardChanges() {
			this._time = this.model.time;
			this.shapes = [];
			this.shapeMap.clear();
			for (let svgitem of this.model.shapes) {
				let shape = this._parseModel(svgitem);
				this.shapes.push(shape);
				this.shapeMap.set(shape.id, shape);
			}
			this.updateUI();
			this._updateOffsetUI();
		}
		
		saveChanges() {
			this.model = this._syncToModel(this.shapes);
		}
		
		_syncToModel(shapes) {
			let factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height;
			let width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
			let height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
			let model = {
					time: this._time,
					shapes: []
			}
			for (let shape of shapes) {
				let id = shape.id;
				if ( !id ) {
					console.log("WARNING: Keyframe -> saveChanges(): Required attribute ID missing from svg shape", shape);
					id = TIMAAT.Util.createUUIDv4();
				}
				let jsonItem = { id: id };

				if ( shape.type == 'rectangle' ) {
					jsonItem.type = 'rectangle';
					jsonItem.x = parseFloat( (Math.abs(shape.bounds[0][1]/factor) / width).toFixed(5) );
					jsonItem.y = parseFloat( (Math.abs((450-shape.bounds[1][0])/factor) / height).toFixed(5) );
					jsonItem.width = parseFloat( (Math.abs((shape.bounds[1][1]-shape.bounds[0][1])/factor) / width).toFixed(5) );
					jsonItem.height = parseFloat( (Math.abs((shape.bounds[1][0]-shape.bounds[0][0])/factor) / height).toFixed(5) );
					// sanitize data
					jsonItem.x = Math.max(0.0, Math.min(1.0,jsonItem.x));
					jsonItem.y = Math.max(0.0, Math.min(1.0,jsonItem.y));
					model.shapes.push(jsonItem);
				} else if ( shape.type == 'polygon' ) {
					jsonItem.type = 'polygon';
					jsonItem.points = [];
					for (let point of shape.points) {
						let x = parseFloat( Math.abs(point[1]/width/factor).toFixed(5) );
						var y = parseFloat( Math.abs((450-point[0])/factor/height).toFixed(5) );
						// sanitize data
						x = Math.max(0.0, Math.min(1.0,x));
						y = Math.max(0.0, Math.min(1.0,y));
						jsonItem.points.push([x,y]);
					}
					model.shapes.push(jsonItem);
				} else if ( shape.type == 'line' ) {
					jsonItem.type = 'line';
					jsonItem.points = [];
					for (let point of shape.points) {
						let x = parseFloat( Math.abs(point[1]/width/factor).toFixed(5) );
						var y = parseFloat( Math.abs((450-point[0])/factor/height).toFixed(5) );
						// sanitize data
						x = Math.max(0.0, Math.min(1.0,x));
						y = Math.max(0.0, Math.min(1.0,y));
						jsonItem.points.push([x,y]);
					}
					model.shapes.push(jsonItem);
				} else if ( shape.type == 'circle' ) {
					jsonItem.type = 'circle';
					jsonItem.x = parseFloat( (Math.abs(shape.point[1]/factor) / width).toFixed(5) );
					jsonItem.y = parseFloat( (Math.abs((450-shape.point[0])/factor) / height).toFixed(5) );
					jsonItem.radius = parseFloat( (Math.abs(shape.radius/factor) ).toFixed(5) );
					// sanitize data
					jsonItem.x = Math.max(0.0, Math.min(1.0,jsonItem.x));
					jsonItem.y = Math.max(0.0, Math.min(1.0,jsonItem.y));
					jsonItem.radius = Math.max(5.0, jsonItem.radius);
					model.shapes.push(jsonItem);
				}
			}
			
			return model;
		}
		
		_parseModel(svgitem) {
			let shape = {
					type: svgitem.type,
			}
			let factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height;
			let width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
			let height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
			let id = svgitem.id;
			if ( !id ) {
				id = TIMAAT.Util.createUUIDv4();
				console.log("WARNING: Keyframe -> _parseSVG -> svgitem: Required attribute ID missing from model", svgitem);
			}
			shape.id = id;
			switch (svgitem.type) {
				case "rectangle":
					shape.bounds = [ [Math.round(450-(factor*(svgitem.y+svgitem.height)*height)), Math.round(svgitem.x*factor*width)], [Math.round(450-((svgitem.y)*factor*height)), Math.round((svgitem.x+svgitem.width)*factor*width)] ];
//					shape.bounds = L.latLngBounds( L.latLng(Math.round(450-(factor*svgitem.y*height)), Math.round(svgitem.x*factor*width)), L.latLng(Math.round(450-((svgitem.y+svgitem.height)*factor*height)), Math.round((svgitem.x+svgitem.width)*factor*width)) );
					return shape;
					
				case "polygon":
				case "line":
					let points = new Array();
					for (let point of svgitem.points) {
						let lat = 450-(point[1]*factor*height);
						let lng = point[0]*factor*width;
						points.push([lat, lng]);
//						points.push(L.latLng(lat, lng));
					};
					shape.points = points;
					return shape;

				case "circle":
					let lat = 450-(svgitem.y*factor*height);
					let lng = svgitem.x*factor*width;
					shape.point = [lat, lng];
//					shape.point = L.latLng(lat,lng);
					shape.radius = svgitem.radius * factor;
					return shape;
			}
		}
		
		remove() {
			// remove UI
			this.ui.timelineView.remove();
		}

		_updateOffsetUI() {
			  var width =  $('#timaat-video-seek-bar').width();
			  var offset = (this.parent.startTime+this.time) / TIMAAT.VideoPlayer.duration * width;
			  this.ui.timelineView.css('margin-left', offset+'px');

		}
				
		
		updateUI() {
			let visible = this.parent.isSelected() && this.parent.isAnimation();
			if ( visible != this._visible ) {
				this._visible = visible;
				if ( visible ) {
					this.ui.timelineView.show();
					this._updateOffsetUI();
				} else  this.ui.timelineView.hide();
			}
			if ( this._visible ) {
				let selected = this.parent.isOnKeyframe() && this.parent.currentKeyframe == this;
				if ( selected != this._selected ) {
					this._selected = selected;
					if ( selected ) this.ui.head.addClass('selected'); else this.ui.head.removeClass('selected');
				}
			}
			
		}
		
	}
	
}, window));
