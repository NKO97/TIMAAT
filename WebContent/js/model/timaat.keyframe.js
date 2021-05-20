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
			// console.log("TCL: Keyframe -> constructor -> keyframe, annotation", keyframe, annotation);
			this.parent = annotation;
			this.model = keyframe;
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
					timelineTemplate : `<div class="timaat-timeline-keyframe"><div class="timaat-timeline-keyframehead"></div></div>`,
					inspectorTemplate : `<div class="list-group-item p-0">
					<div class="input-group input-group-sm">
						<div class="input-group-prepend">
							<span class="input-group-text keyframe-number">01</span>
						</div>
						<input type="text" class="form-control keyframe-time">
						<div class="input-group-append">
							<button class="btn btn-secondary keyframe-undo"><i class="fas fa-undo fa-fw"></i></button>
							<button class="btn btn-danger keyframe-remove"><i class="fas fa-trash-alt fa-fw"></i></button>
						</div>
					</div></div>`
			};
			this.ui.timelineView = $(this.ui.timelineTemplate);
			this.ui.inspectorView = $(this.ui.inspectorTemplate);
			if ( this._time == 0 ) {
				this.ui.inspectorView.find('.keyframe-time').prop('disabled', true);
				this.ui.inspectorView.find('.keyframe-remove').prop('disabled', true);
			}
			this.ui.head = this.ui.timelineView.find('.timaat-timeline-keyframehead');
			$('#timaat-timeline-keyframe-pane').append(this.ui.timelineView);
			if ( this.time == 0 ) this.ui.head.addClass('first');

			// add events
			this.ui.head.on('click', this, function(ev) {
				TIMAAT.VideoPlayer.pause();
				console.log("TCL: ev.data.time ",ev.data.time);
				TIMAAT.VideoPlayer.jumpTo(ev.data.parent.startTime/1000 + ev.data.time/1000);
			});
			if ( this._time != 0 ) this.ui.inspectorView.find('.keyframe-time').on('blur change', this, function(ev) {
				if ( !ev.data ) return;
				let keyframe = ev.data;
				let anno = keyframe.parent;
				let newTime = TIMAAT.Util.parseTime(keyframe.ui.inspectorView.find('.keyframe-time').val()) - anno.startTime;
				let minTime = 0;
				if ( anno.svg.keyframes.indexOf(keyframe) > 0 ) minTime = anno.svg.keyframes[ anno.svg.keyframes.indexOf(keyframe)-1 ].time + 0.001;
				minTime = parseFloat(minTime.toFixed(3));
				newTime = Math.max(minTime, newTime);
				let maxTime = anno.length;
				if ( anno.svg.keyframes.indexOf(keyframe) < (anno.svg.keyframes.length-1) ) maxTime = anno.svg.keyframes[ anno.svg.keyframes.indexOf(keyframe)+1 ].time - 0.001;
				maxTime = parseFloat(maxTime.toFixed(3));
				newTime = Math.min(newTime, maxTime);
				if ( newTime != keyframe.time ) {
					keyframe.time = newTime;
					keyframe.updateUI();
					anno._updateShapeUI();
					anno.updateEditableUI();
				}
			});
			this.ui.inspectorView.find('.keyframe-undo').on('click', this, function(ev) {
				if ( !ev.data ) return;
				ev.data.discardChanges();
				ev.data.parent._updateShapeUI();
				ev.data.parent.updateEditableUI();
			});
			this.ui.inspectorView.find('.keyframe-remove').on('click', this, function(ev) {
				if ( !ev.data ) return;
				ev.data.parent.removeKeyframe(ev.data);
			});

			this.updateUI();
			this._updateOffsetUI();
			this.updateTimeUI();
		}
		
		addShape(shape) {
			// check if shape id exists
			if ( this.shapeMap.has(shape.id) ) return;
			this.shapes.push(shape);
			this.shapeMap.set(shape.id, shape);
		}
		
		removeShape(shape) {
			if ( !shape ) return;
			let id = (shape.id) ? shape.id : shape;
			let kfShape = this.shapeMap.get(id);
			if ( !kfShape ) return;
			let index = this.shapes.indexOf(kfShape);
			if ( index < 0 ) return;
			this.shapes.splice(index, 1);
			this.shapeMap.delete(id);
		}
		
		get time() {
			return this._time;
		}

		set time(time) {
			if ( this._time == 0 ) return;
			this._time = parseFloat(time.toFixed(3));;
			this.parent.setChanged();
			this._updateOffsetUI();
			this.updateTimeUI();
			// send event
			$(document).trigger('keyframechanged.annotation.TIMAAT', this.parent);
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
			// send event
			$(document).trigger('keyframechanged.annotation.TIMAAT', this.parent);
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
			this.ui.inspectorView.find('.keyframe-time').off();
			this.ui.inspectorView.remove();
		}

		_updateOffsetUI() {
			  var width =  $('#timaat-video-seek-bar').width();
			  var offset = (this.parent.startTime+this.time) / TIMAAT.VideoPlayer.duration * width;
			  this.ui.timelineView.css('margin-left', offset+'px');

		}
		
		updateStatus() {
			
		}
		
		updateTimeUI() {
			this.ui.inspectorView.find('.keyframe-time').val(TIMAAT.Util.formatTime(this.parent.startTime+this._time, true));
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
				
				let maxPadding = (this.parent.svg.keyframes.length+1).toString().length;
				if (maxPadding < 2) maxPadding = 2;
				let frameNumber = this.parent.svg.keyframes.indexOf(this)+1;
				let padNumber = frameNumber;
				if ( typeof(String.prototype.padStart) === 'function' ) padNumber = frameNumber.toString().padStart(maxPadding, '0');
				else {
					// TODO only for Internet Explorer
					padNumber = ('000'+frameNumber).substr(-3);
				}
				this.ui.inspectorView.find('.keyframe-number').text(padNumber);
			}
			
		}
		
	}
	
}, window));
