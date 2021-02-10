class AnalysisSegment {
		constructor(model) {
					// setup model
					this.model = model;
					this.active = false;
					this._startTime = this.model.startTime/1000.0;
					this._endTime = this.model.endTime/1000.0;
					
					// create and style list view element
					this.listView = $(`
						<li class="list-group-item timaat-annotation-list-segment p-0 bg-secondary">
							<div class="d-flex justify-content-between">
								<span class="font-weight-bold pt-1 text-light pl-1">
									<i class="timaat-annotation-segment-comment-icon fas fa-fw fa-comment" aria-hidden="true"></i> 
									<span class="timaat-annotation-segment-name"></span>
								</span>
							</div>
						</li>`
					);
					this.timelineView = $(`
						<div class="timaat-timeline-segment progress bg-info border border-dark" data-toggle="tooltip" data-placement="top" data-html="true">
							<!-- <div class="timaat-timeline-segment-name text-white font-weight-bold"></div> -->
						</div>`
					);
					
					var segment = this; // save annotation for events
				}
				
				updateUI() {
					this.listView.attr('data-starttime', this.model.startTime);
					let timeString = " "+TIMAATPub.formatTime(this.model.startTime/1000.0, true);
					let name = this.model.analysisSegmentTranslations[0].name;
					let desc = ( this.model.analysisSegmentTranslations[0].shortDescription ) ? this.model.analysisSegmentTranslations[0].shortDescription : '';
					let comment = this.model.analysisSegmentTranslations[0].comment;
					if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAATPub.formatTime(this.model.endTime/1000.0, true);
					this.listView.find('.timaat-annotation-segment-name').html(name);
					this.listView.find('.timaat-annotation-segment-shortDescription').html(desc);
					this.listView.find('.timaat-annotation-segment-comment').html(comment);
					this.timelineView.find('.timaat-timeline-segment-name ').html(name);
					this.timelineView.attr('title', '<strong>'+name+'</strong><div class="mb-1"><i class="far fa-clock"></i> '+TIMAATPub.formatTime(this.model.startTime/1000.0, true)+' - '+TIMAATPub.formatTime(this.model.endTime/1000.0, true)+'</div>'+desc);
					// comment
					if ( this.model.analysisSegmentTranslations[0].comment && this.model.analysisSegmentTranslations[0].comment.length > 0 )
						this.listView.find('.timaat-annotation-segment-comment-icon').show();
					else
						this.listView.find('.timaat-annotation-segment-comment-icon').hide();
					
					// update timeline position
					let magicoffset = 0;
					let width =  100;
					let length = ((this.model.endTime - this.model.startTime)/1000.0) / TIMAATPub.duration * width;
					let offset = (this.model.startTime/1000.0) / TIMAATPub.duration * width;
					this.timelineView.css('width', length+'%');
					this.timelineView.css('margin-left', (offset+magicoffset)+'%');

				}
				
				addUI() {
					$('#timaat-annotation-list').append(this.listView);
					$('.segment-seekbar').append(this.timelineView);

					var segment = this; // save annotation for events
					// attach event handlers
					this.listView.on('click', this, function(ev) {
						TIMAATPub.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
						TIMAATPub.pause();
						TIMAATPub.selectAnnotation(null);
						TIMAATPub.setSegmentMetadata(segment);
					});
					this.timelineView.on('click', this, function(ev) {
						TIMAATPub.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
						TIMAATPub.pause();
						TIMAATPub.selectAnnotation(null);
						TIMAATPub.setSegmentMetadata(segment);
					});
					this.listView.on('dblclick', this, function(ev) {
						TIMAATPub.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
						TIMAATPub.pause();
						TIMAATPub.selectAnnotation(null);
						TIMAATPub.setSegmentMetadata(segment);
					});
					this.timelineView.on('dblclick', this, function(ev) {
						TIMAATPub.jumpVisible(segment.model.startTime/1000.0, segment.model.endTime/1000.0);
						TIMAATPub.pause();
						TIMAATPub.selectAnnotation(null);
						TIMAATPub.setSegmentMetadata(segment);
					});
					this.updateUI();
					this.timelineView.tooltip();
					
				}
				
				removeUI() {
					this.listView.remove();
					this.timelineView.remove();
					this.updateUI();      
				}
					
				updateStatus(time) {
					var status = false;
					if ( time >= this.model.startTime/1000.0 && time <= this.model.endTime/1000.0) status = true;

					if ( status != this.active ) {
						this.active = status;
						if ( this.active ) this.timelineView.addClass('bg-info');
						else this.timelineView.removeClass('bg-info');
					}				
				}

}

/* ****************************************************************** */

class Marker {
		  constructor(annotation) {
     		console.log("TCL: Marker -> constructor -> annotation", annotation);
			  this.parent = annotation;
			  this.annotation = annotation;
			  // this.annotationID = annotation.model.id;
			  this._from = Math.min(annotation.startTime, TIMAATPub.duration);
			  this._to = Math.max(annotation.startTime, annotation.model.endTime/1000.0);
			  this._color = '#'+annotation.model.selectorSvgs[0].colorRgba.substring(0,6);
			  
			  // construct marker element
			  this.ui = {
					  offset: 0,
					  element: $('<div class="timaat-timeline-marker"><div class="timaat-timeline-markerbar"></div><div class="timaat-timeline-markerhead"></div><div class="timaat-timeline-marker-start"></div><div class="timaat-timeline-marker-end"></div></div>'),
			  };
			  this.ui.element.attr('id','timaat-marker-'+this.parent.model.id);
			    
			  this.regionstart = $(this.ui.element.find('.timaat-timeline-marker-start'));
			  this.regionend = $(this.ui.element.find('.timaat-timeline-marker-end'));
			    
			  var marker = this;
			  var _markerlength;

			  this._updateElementColor();
			  this._updateElementOffset();
			  $('#timaat-timeline-marker-pane').append(this.ui.element);
			  TIMAATPub.markerList.push(this);
			    
			  // add events
			  this.ui.element.find('.timaat-timeline-markerbar,.timaat-timeline-markerhead').on('click', this, function(ev) {
				  TIMAATPub.pause();
				  TIMAATPub.jumpTo(ev.data.from);
				  TIMAATPub.selectAnnotation(ev.data.parent);
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
				
		  get to() {
			  return this._to;
		  }
				
		  get color() {
			  return this._color;
		  }
			  
		  remove() {
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

			  var width =  $('.video-seekbar').width()
			  var length = (this._to - this._from) / TIMAATPub.duration * width;
			  length = Math.max(0,length);
			  var offset = this._from / TIMAATPub.duration * width;
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
	
/* ****************************************************************** */

class Keyframe {
		constructor(keyframe, annotation) {
			this.parent = annotation;
			// this.annotation = annotation;
			this.model = keyframe;
			// this.annotationID = annotation.model.id;
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
				TIMAATPub.pause();
				TIMAATPub.jumpTo(ev.data.parent.startTime + ev.data.time);
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

		getShape(id) {
			return this.shapeMap.get(id);
		}
		
		_parseModel(svgitem) {
			let shape = {
					type: svgitem.type,
			}
			let width = TIMAATPub.video.mediumVideo.width;
			let height = TIMAATPub.video.mediumVideo.height;
			let id = svgitem.id;
			if ( !id ) {
				id = TIMAAT.Util.createUUIDv4();
				console.log("WARNING: Keyframe -> _parseSVG -> svgitem: Required attribute ID missing from model", svgitem);
			}
			shape.id = id;
			switch (svgitem.type) {
				case "rectangle":
					shape.bounds = [ [Math.round(height-((svgitem.y+svgitem.height)*height)), Math.round(svgitem.x*width)], [Math.round(height-((svgitem.y)*height)), Math.round((svgitem.x+svgitem.width)*width)] ];
					return shape;
					
				case "polygon":
				case "line":
					let points = new Array();
					for (let point of svgitem.points) {
						let lat = height-(point[1]*height);
						let lng = point[0]*width;
						points.push([lat, lng]);
					};
					shape.points = points;
					return shape;

				case "circle":
					let lat = height-(svgitem.y*height);
					let lng = svgitem.x*width;
					shape.point = [lat, lng];
					shape.radius = svgitem.radius;
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
			  var width =  $('.video-seekbar').width()
			  var offset = (this.parent.startTime+this.time) / TIMAATPub.duration * width;
			  this.ui.timelineView.css('margin-left', offset+'px');

		}
		
		updateStatus() {
			
		}
		
		updateTimeUI() {
			this.ui.inspectorView.find('.keyframe-time').val(TIMAATPub.formatTime(this.parent.startTime+this._time, true));
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

/* ****************************************************************** */

class Annotation {
	constructor(model) {
		// setup model
		this._destroyed = false;
		this.active = false;
		this.selected = false;
		this._animTime = -1;
		this._type = 0;
		this.model = model;
		this.svg = Object();
		this.svg.items = Array();
		this.svg.keyframes = Array();
		this.svg.strokeWidth = this.model.selectorSvgs[0].strokeWidth ? 2 : 0;
		this.svg.color = this.model.selectorSvgs[0].colorRgba.substring(0,6);
		this._opacity = parseInt(this.model.selectorSvgs[0].colorRgba.substring(6,8), 16)/255;
		if ( isNaN(this._opacity) ) this._opacity = 0.3; // default value
		this.svg.model = JSON.parse(this.model.selectorSvgs[0].svgData);
		if ( Array.isArray(this.svg.model) ) {
			// upgrade old DB model
			let newModel = {
					keyframes: [{
						time: 0,
						shapes: this.svg.model,
					}],
			}
			for ( let shape of newModel.keyframes[0].shapes ) shape.id = "00000000-0000-4000-0000-000000000001";
			this.svg.model = newModel;
			this.model.selectorSvgs[0].svgData = JSON.stringify(this.svg.model);
		}

		this._startTime = this.model.startTime/1000.0;
		this._endTime = this.model.endTime/1000.0;
		this._layerVisual = this.model.layerVisual;
		// create keyframes
		for (let keyframe of this.svg.model.keyframes) this.svg.keyframes.push(new Keyframe(keyframe, this));

		this.svg.layer = L.layerGroup(null, {data:'annotationlayer', "annotation":this});
			
		// create and style list view element
		this.listView = $(`
			<li class="list-group-item" style="padding:0">
				<div class="timaat-annotation-status-marker" style="float: left;line-height: 300%;margin-right: 5px;">&nbsp;</div>
				<i class="timaat-annotation-list-type fas fa-image" aria-hidden="true"></i>
				<i class="timaat-annotation-list-comment fas fa-fw fa-comment" aria-hidden="true"></i>
				<span class="timaat-annotation-list-time"></span>
				<span class="text-nowrap timaat-annotation-list-categories pr-1 float-right text-muted"><i class=""></i></span>
				<div class="d-flex justify-content-between">
					<div class="timaat-annotation-list-title text-muted"></div>
				</div>
			</li>`
		);
			
		this.updateUI();
					
		let anno = this; // save annotation for events

		$('#timaat-annotation-list').append(this.listView);
		this.listView.find('.timaat-annotation-list-categories').on('click', this, function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			TIMAATPub.pause();
			if ( TIMAATPub.curAnnotation != ev.data ) TIMAATPub.selectAnnotation(ev.data);
		});
			this.listView.find('.timaat-annotation-list-categories').on('dblclick', function(ev) {ev.stopPropagation();});

			// convert SVG data
			this.polygonCount = this.svg.model.keyframes[0].shapes.length;
			for (let svgitem of this.svg.model.keyframes[0].shapes) {
				let item = this._parseSVG(svgitem);
				this.addSVGItem(item);
			};
			if ( !this.hasPolygons() ) this.addSVGItem(this._parseSVG({ id: "00000000-0000-4000-0000-000000000000", type: "rectangle", x: 0.0, y: 0.0, width: 1.0, height: 1.0, fill: 0 }));
			

			// attach event handlers
			$(this.listView).on('click', this, function(ev) {
				TIMAATPub.jumpVisible(ev.data.startTime, ev.data.endTime);
				if ( TIMAATPub.curAnnotation != ev.data ) TIMAATPub.selectAnnotation(ev.data);
				else TIMAATPub.selectAnnotation(null);
				TIMAATPub.pause();
			});
			$(this.listView).on('dblclick', this, function(ev) {
				TIMAATPub.jumpVisible(ev.data.startTime, ev.data.endTime);
				TIMAATPub.selectAnnotation(ev.data);
				TIMAATPub.pause();
				TIMAATPub.openSidebar('right');
			});

			// create marker with UI
			this.marker = new Marker(this);
			this.marker.updateView();
		}
		
		isAnimation() {
			return this.svg.keyframes.length > 1;
		}
		
		get currentKeyframe() {
			let curKeyframe = this.svg.keyframes[0];
			if ( !this.isAnimation() ) return curKeyframe;
			for (let keyframe of this.svg.keyframes) if ( this._animTime >= keyframe.time ) curKeyframe = keyframe;
			return curKeyframe;
		}
		
		get nextKeyframe() {
			if ( !this.isAnimation() ) return this.svg.keyframes[0];
			let index = this.svg.keyframes.indexOf(this.currentKeyframe);
			if ( index < 0 ) return this.svg.keyframes[0];
			index += 1;
			if ( index >= this.svg.keyframes.length ) index = this.svg.keyframes.length-1;
			return this.svg.keyframes[index];
		}
		
		isOnKeyframe() {
			let onKeyframe = false;
			if ( !this.isAnimation() ) onKeyframe = true;
			else for (let keyframe of this.svg.keyframes) if ( this._animTime == keyframe.time ) onKeyframe = true;
			return onKeyframe;
		}
		
		getKeyframeIndex(keyframe) {
			if ( !keyframe || !this.isAnimation() ) return 0;
			let index = this.svg.keyframes.indexOf(keyframe);
			if ( index < 0 ) index = 0;
			return index;
		}
		
		get opacity() {
			return this._opacity;
		}
			
		get layerVisual() {
			return this._layerVisual;
		}
		  
		get stroke() {
			return this.svg.strokeWidth;
		}

		get startTime() {
			return this._startTime;
		}
			
		get endTime() {
			return this._endTime;
		}
		
		get type() {
			return this._type;
		}
		

		get length() {
			return this._endTime - this._startTime;
		}

		hasPolygons() {
			return this.polygonCount;
		}

		
		updateUI() {
			this.listView.attr('data-starttime', this.model.startTime);
			this.listView.find('.timaat-annotation-list-type').css('color', '#'+this.svg.color);
			var timeString = " "+TIMAATPub.formatTime(this.model.startTime/1000.0, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAATPub.formatTime(this.model.endTime/1000.0, true);
			this.listView.find('.timaat-annotation-list-time').html(timeString);
			this.listView.find('.timaat-annotation-list-title').html(this.model.title);
			// categories
			this.listView.find('.timaat-annotation-list-categories i').attr('title', this.model.categories.length+" Kategorien");			
			if (this.model.categories.length == 0) this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-tag text-light timaat-no-categories');
			else if (this.model.categories.length == 1) this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-tag').attr('title', "eine Kategorie");
			else this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-tags');
			// type
			this._updateAnnotationType();
			
			// comment
			if ( this.model.comment && this.model.comment.length > 0 )
				this.listView.find('.timaat-annotation-list-comment').show();
			else
				this.listView.find('.timaat-annotation-list-comment').hide();
				
			// update svg
			for (let item of this.svg.items) {
				item.setStyle({color:'#'+this.svg.color, weight: this.svg.strokeWidth, fillOpacity: this.opacity});
			};
			
			// update marker
			if ( this.marker ) this.marker.updateView();
		}		  

		_updateAnnotationType() {
			let type = this.listView.find('.timaat-annotation-list-type');
			type.removeClass('fa-image').removeClass('fa-draw-polygon').removeClass('fa-headphones');
			if ( this.isAnimation() ) type.text(' \uf70c'); else type.text('');
			if ( this.layerVisual == 0 ) {
				type.addClass('fa-headphones');
				this._type = 2;
			} else {
				if ( this.hasPolygons() ) {
					this._type = 1;
					type.addClass('fa-draw-polygon');
				} else {
					this._type = 0;
					type.addClass('fa-image');
				}
			}
		};
		
		remove() {
			// remove annotation from UI
			this.listView.remove();
			this.marker.remove();
			this.svg.layer.remove();
			this.selected = false;
			this._destroyed = true;
		}
		
		addSVGItem (item) {
			if ( !item || this.svg.items.includes(item) ) return;
			// generate UUID for shape and propagate through keyframes
			if ( !item.options.id ) {
				item.options.id = '-----';
				let shape = { id: item.options.id };
				if ( item instanceof L.Rectangle ) shape.type = 'rectangle';
				else if ( item instanceof L.Polygon ) shape.type = 'polygon';
				else if ( item instanceof L.Polyline ) shape.type = 'line';
				else if ( item instanceof L.Circle ) shape.type = 'circle';
				shape = this.syncShape(item, shape);
				// propagate changes to keyframes
				// TODO check if stringify needed to decouple references
				for (let keyframe of this.svg.keyframes) keyframe.addShape(Object.assign({}, shape));
			}
			
			// add tooltip
			let tooltip = '<strong>'+this.model.title+'</strong>';
			if ( this.model.comment && this.model.comment.length > 0 ) tooltip += '<br><br>'+this.model.comment;
			item.bindTooltip(tooltip);

			// add to list of shapes
			this.svg.items.push(item);
			this.svg.layer.addLayer(item);
			
			// add events
			let anno = this;
			item.on('click', function(ev) { TIMAATPub.selectAnnotation(anno); });
			item.on('dblclick', function(ev) { TIMAATPub.selectAnnotation(anno); TIMAATPub.openSidebar('right') });

			// update UI
			this._updateAnnotationType();
			if ( this.marker ) this.marker.updateView();
		}
				
		removeSVGItem (item) {
			console.log("TCL: Annotation -> removeSVGItem -> item", item);
			if ( !item || !this.svg.items.includes(item) ) return;
			this.svg.layer.removeLayer(item);
			var index = this.svg.items.indexOf(item);
			if (index > -1) this.svg.items.splice(index, 1);
			// propagate changes to keyframes
			for (let keyframe of this.svg.keyframes) keyframe.removeShape(item.options.id);
			
			// update UI
			if ( this.svg.items.length == 0 ) {
				this._updateAnnotationType();
				if ( this.marker ) this.marker.updateView();
			}
		}
		
		getModel() {
			return this.model;
		}
		

		updateStatus(time) {
			time = parseFloat(time.toFixed(3));
			let animTime = time - this._startTime;
			animTime = parseFloat(animTime.toFixed(3));
			var active = false;
			if ( time >= this.startTime && time <= this.endTime ) active = true;
			this.setActive(active);
			if ( animTime == this._animTime ) return;
			this._animTime = animTime;
			this._updateShapeUI();
			// update keyframe UI
			if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();
		}
		
		isActive() {
			return this.active;
		}
		
		setActive(active) {
			if ( this.active == active ) return;
			this.active = active;
			if ( active ) {
				this.listView.find('.timaat-annotation-status-marker').addClass('bg-success');
				TIMAATPub.viewer.annoLayer.addLayer(this.svg.layer);
				// scroll list
				this._scrollIntoView(this.listView);
			} else {
				this.listView.find('.timaat-annotation-status-marker').removeClass('bg-success');
				TIMAATPub.viewer.annoLayer.removeLayer(this.svg.layer);
				this.svg.layer.options.removed = true;
			}
		}
				
		setSelected(selected) {
			if (this._destroyed) return;
			if ( this.selected == selected ) return;			
			this.selected = selected;
			if ( selected ) {
				this.listView.addClass('timaat-annotation-list-selected');
				for (let item of this.svg.items) {
					try {item.bringToFront();} catch(e){};
				};
			}
			else {
				this.listView.removeClass('timaat-annotation-list-selected');
			}
			// update marker
			if ( this.marker ) this.marker.updateView();
			// update keyframe UI
			if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();
		}

		isSelected() {
			return this.selected;
		}
		
		syncShape(svgitem, shape = null, force = this.isOnKeyframe()) {
			if ( !svgitem || !svgitem.options || !svgitem.options.id || !force) return;
			let id = svgitem.options.id;
			if ( !shape ) shape = this.currentKeyframe.getShape(id);
			if ( !shape ) return;
			switch (shape.type) {
				case 'rectangle':
					shape.bounds = [ [svgitem.getBounds().getSouthWest().lat, svgitem.getBounds().getSouthWest().lng], [svgitem.getBounds().getNorthEast().lat, svgitem.getBounds().getNorthEast().lng] ];
					break;

				case "polygon":
					shape.points = this._copyLatLngs(svgitem.getLatLngs()[0]);
					break;
				case "line":
					shape.points = this._copyLatLngs(svgitem.getLatLngs());
					break;

				case "circle":
					shape.point = [svgitem.getLatLng().lat, svgitem.getLatLng().lng];
					shape.radius = svgitem.getRadius();
					break;
			}
			return shape;
		}
		
		_copyLatLngs(latlngs) {
			let points = new Array();
			for (let latlng of latlngs) points.push([latlng.lat, latlng.lng]);
			return points;
		}
		
		_updateShapeUI() {
			if ( this._destroyed || !this.isAnimation() || !this.isActive() ) return;
			let fromKeyframe = this.currentKeyframe;
			let toKeyframe = this.nextKeyframe;
			let interpolate = ( fromKeyframe != toKeyframe );
			let percent = (this._animTime-fromKeyframe.time) / (toKeyframe.time-fromKeyframe.time);
			for (let item of this.svg.items) {
				if ( interpolate ) {
					this._updateSVGItem(item, TIMAATPub.getInterpolatedShape(
							fromKeyframe.getShape(item.options.id),
							toKeyframe.getShape(item.options.id),
							percent
					));
				} else this._updateSVGItem(item, fromKeyframe.getShape(item.options.id));
			}
		}

		_updateSVGItem(item, shape) {
			if ( !item || !shape ) return;
			if ( item.options.id != shape.id ) return;
			switch (shape.type) {
				case 'rectangle':
					item.setBounds(shape.bounds);
					return;

				case "polygon":
					item.setLatLngs([shape.points]);
					return;
				case "line":
					item.setLatLngs(shape.points);
					return;
				
				case "circle":
					item.setLatLng(shape.point);
					item.setRadius(shape.radius);
					return;
			}
		}
		
		_scrollIntoView(listItem) {
			var listTop = $('.timaat-annotation-wrapper').scrollTop();
			var listHeight = $('.timaat-annotation-wrapper').height();
			var elementTop = listItem.position().top;
			// TODO scroll from bottom if out of view
			if ( elementTop < 0 )
				$('.timaat-annotation-wrapper').animate({scrollTop:(listTop+elementTop)}, 100);
			if ( elementTop > listHeight )
				$('.timaat-annotation-wrapper').animate({scrollTop:(listTop+elementTop)-listHeight+48}, 100);
				
		}
		
		_parseSVG(svgitem) {
			let width = TIMAATPub.video.mediumVideo.width;
			let height = TIMAATPub.video.mediumVideo.height;
			let id = svgitem.id;
			if ( !id ) {
				id = '-----';
				console.log("WARNING: Annotation -> _parseSVG -> svgitem: Required attribute ID missing from model", svgitem);
			}
			switch (svgitem.type) {
				case "rectangle":
					// [[ height, x], [ y, width]]
					var bounds = [[ Math.round(height-(svgitem.y*height)), Math.round(svgitem.x*width)], [ Math.round(height-((svgitem.y+svgitem.height)*height)), Math.round((svgitem.x+svgitem.width)*width)]];
					let options = {transform: true, id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth}
					if ( svgitem.fill == 0 ) {
						options.fill = false;
						options.weight = 5
						options.opacity = 0.7;
					}
					return L.rectangle(bounds, options);
				case "polygon":
					var points = new Array();
					$(svgitem.points).each(function(index,point) {
						var lat = height-(point[1]*height);
						var lng = point[0]*width;
						points.push([lat,lng]);
					});
					return L.polygon(points, {transform: true, id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
				case "line":
					var points = new Array();
					$(svgitem.points).each(function(index,point) {
						var lat = height-(point[1]*height);
						var lng = point[0]*width;
						points.push([lat,lng]);
					});
					return L.polyline(points, {id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
				case "circle":
					var lat = height-(svgitem.y*height);
					var lng = svgitem.x*width;
					var radius = svgitem.radius;

					return L.circle([lat,lng], radius, {id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
			}
		}		
	}

/* ****************************************************************** */

class TIMAATPublication {
	constructor() {
		this.version = "v1.2";
		// setup model
		if ( TIMAATData.mediaCollectionHasMediums != null ) {
			this.collection = TIMAATData;
			this.video = null;
		} else {
			this.collection = null;
			this.video = TIMAATData;
			if ( this.video.mediumVideo.length < 0 ) this.video.mediumVideo.length += 3600; // temp fix for DB problems
			this.duration = this.video.mediumVideo.length;
		}
		this.frameRate = 25;
		this.volume = 1.0;
		this.markerList = [];

		// setup UI
		this.setupUI();
		
		// setup events
		$('.timaat-ui-mode').on('click', function() {
			
		})

		// animation player shape updater
		let animFrameRate = 20;
		if ( this.video ) this.animInterval = setInterval(this._updateAnimations, 1000 / animFrameRate);
		
		console.log("TIMAAT::Publication:"+this.version+" ready");
	}
	
	run() {
		let hash = location.hash;
		let startList = (this.video) ? TIMAATPub.video.mediumAnalysisLists[0] : null;
		if ( TIMAATSettings.defList && TIMAATSettings.defList > 0 && this.video ) for (let list of TIMAATPub.video.mediumAnalysisLists) if ( list.id == TIMAATSettings.defList ) startList = list;
		
    console.log("TCL ~ TIMAATPublication ~ run ~ startList", startList);
		if ( this.video ) this.setupAnalysisList(startList);

		// restore session
		if ( hash && hash.length > 1 ) location.hash = hash;
	}
	
	pause() {
		this.ui.video.pause();
		let frameTime = 1.0 / this.frameRate;
		let videoTime = this.ui.video.currentTime;
		let time = Math.round(this.ui.video.currentTime/frameTime) * frameTime;
		$('.toggle-play-pause').removeClass('pause').addClass('play');
	}

	play() {
		this.ui.video.play();
		$('.toggle-play-pause').removeClass('play').addClass('pause');
	}

	jumpTo(time) {
		this.ui.video.currentTime = time;
		this.updateListUI();
	}
	
	jumpVisible(start, end) {
		let curTime = this.ui.video.currentTime;
		if ( curTime < start || curTime > end ) this.ui.video.currentTime = start;
		this.updateListUI();
	}
	
	setVolume(volume) {
		if ( volume <= 0 ) $('.toggle-volume').removeClass('on').addClass('off');
		else $('.toggle-volume').removeClass('off').addClass('on');
		this.ui.video.volume = volume;
		// adjust slider
		this.ui.volumeSlider.css('width', parseFloat(this.ui.video.volume * 100.0).toString()+'%' );		
	}

	openSidebar(position='left') {
		$('#timaat-'+position+'-sidebar').css('width', "250px");
		$('#timaat-'+position+'-sidebar').removeClass('collapsed');
		$('#timaat-main').css('margin-'+position, "250px");
		$('#timaat-video-controls').css('margin-'+position, "250px");
		$('.toggle-'+position+'-sidebar').addClass('btn-secondary');
		this.fitVideo();
	}
	
	closeSidebar(position='left') {
		$('#timaat-'+position+'-sidebar').css('width', '0');
		$('#timaat-'+position+'-sidebar').addClass('collapsed');
		$('#timaat-main').css('margin-'+position, "0");
		$('#timaat-video-controls').css('margin-'+position, "0");
		$('.toggle-'+position+'-sidebar').removeClass('btn-secondary');
		this.fitVideo();
	}
	
	toggleSidebar(position='left') {
		if ( $('#timaat-'+position+'-sidebar').hasClass('collapsed') ) this.openSidebar(position);
		else this.closeSidebar(position);
	}
	
	fitVideo() {
		if ( !this.video ) return;
		this.viewer.invalidateSize();
		this.viewer.fitBounds(TIMAATPub.videoBounds);
/*
		let left = $(this.ui.video).offset().left;
		let right = $(this.ui.video).width();
		$('#timaat-video-controls').css('left', left+'px');
		$('#timaat-video-controls').css('width', right+'px');
*/
	}
	
	updateSeekBar() {
		this.ui.videoProgress.css('width', parseFloat( ((this.ui.video.currentTime / this.duration) * 100.0).toString() )+'%' );
	}
	
	updateTimeInfo() {
		this.ui.timeLabel.text(this.formatTime(this.ui.video.currentTime, true));
	}
	
	_updateAnimations() {
		if ( TIMAATPub.ui.video.paused ) return;
		
		for (let annotation of TIMAATPub.annotationList) {
			let wasActive = annotation.isActive();
			annotation.updateStatus(TIMAATPub.ui.video.currentTime);
			if ( annotation.isActive() && !wasActive ) {
				if ( TIMAATSettings.stopImage && annotation.type == 0 ) TIMAATPub.pause();
				if ( TIMAATSettings.stopPolygon && annotation.type == 1 ) TIMAATPub.pause();
				if ( TIMAATSettings.stopAudio && annotation.type == 2 ) TIMAATPub.pause();
			}
		}
	}
	
	getInterpolatedShape(shapeFrom, shapeTo, percent) {
			if ( !shapeFrom || !shapeTo || percent == null ) return null;
			percent = percent < 0 ? 0 : percent;
			percent = percent > 1 ? 1 : percent;
			if ( shapeFrom.id != shapeTo.id ) return null;
			if ( shapeFrom == shapeTo ) return shapeFrom;
			if ( percent == 0 ) return shapeFrom;
			if ( percent == 1 ) return shapeTo;
			let interShape = { id: shapeFrom.id, type: shapeFrom.type };
			switch (shapeFrom.type) {
				case 'rectangle': 
					interShape.bounds = [ this._lerpValue(shapeFrom.bounds[0], shapeTo.bounds[0], percent), this._lerpValue(shapeFrom.bounds[1], shapeTo.bounds[1], percent) ];
					break;
					
				case "polygon":
				case "line":
					interShape.points = new Array();
					for (let index=0; index < shapeFrom.points.length; index++)
						interShape.points.push(this._lerpValue(shapeFrom.points[index], shapeTo.points[index], percent));
					break;
				
				case "circle":
					interShape.point = this._lerpValue(shapeFrom.point, shapeTo.point, percent);
					interShape.radius = this._lerpValue(shapeFrom.radius, shapeTo.radius, percent);
					break;
			}
			return interShape;
	}
		
	_lerpValue(from, to, percent) {
			if ( !from || !to || percent == null ) return null;
			if ( Array.isArray(from) )
				return [from[0] + (to[0] - from[0]) * percent, from[1] + (to[1] - from[1]) * percent];
			else
				return from + (to - from) * percent;
	}
	
	
	formatTime(seconds, withFraction = false) {
		var hours = Math.floor(seconds / 60 / 60);
		var mins = Math.floor((seconds-(hours*60*60)) / 60);
		var secs = seconds - ((hours*60*60)+(mins*60));
		secs = Math.floor(secs);
		
		var time = "";
		if ( hours >0  ) time += hours+":";
		if (mins < 10 ) time += "0";
		time += mins+":";
		if (secs < 10 ) time += "0";
		time += secs;
					
		var fraction = seconds - ((hours*60*60) + (mins * 60) + secs);

		if ( withFraction ) time += "."+fraction.toFixed(3).substring(2);

		return time;
	}
	
	formatDate(timestamp) {
		var a = new Date(timestamp);
//		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
		var year = a.getFullYear();
		var month = ("0" + (a.getMonth()+1)).substr(-2);
		var date = ("0" + a.getDate()).substr(-2);
		var hour = ("0" + a.getHours()).substr(-2);
		var min = ("0" + a.getMinutes()).substr(-2);
		var sec = ("0" + a.getSeconds()).substr(-2);
		var time = date + '.' + month + '.' + year + ', ' + hour + ':' + min + ':' + sec ;
		return time;
	}
	
	setListMetadata() {
		if ( !this.curAnalysisList ) return;

		if ( !this.curAnalysisList.mediumAnalysisListTranslations[0].title || this.curAnalysisList.mediumAnalysisListTranslations[0].title.length == 0) this.ui.list.title.addClass('empty');
		else {
			this.ui.list.title.removeClass('empty');
			this.ui.list.title.find('.contents').html(this.curAnalysisList.mediumAnalysisListTranslations[0].title);
		}
		if ( !this.curAnalysisList.mediumAnalysisListTranslations[0].text || this.curAnalysisList.mediumAnalysisListTranslations[0].text.length == 0) this.ui.list.comment.addClass('empty');
		else {
			this.ui.list.comment.removeClass('empty');
			this.ui.list.comment.find('.contents').html(this.curAnalysisList.mediumAnalysisListTranslations[0].text);
		}
	}

	setSegmentMetadata(segment) {
		if ( !segment ) return;
		
		this.ui.segmentMetadata.removeClass('d-none');

		let name = segment.model.analysisSegmentTranslations[0].name;
		let desc = ( segment.model.analysisSegmentTranslations[0].shortDescription ) ? segment.model.analysisSegmentTranslations[0].shortDescription : '';
		let comment = segment.model.analysisSegmentTranslations[0].comment;
		let transcript = segment.model.analysisSegmentTranslations[0].transcript;

		if ( !name || name.length == 0) this.ui.segment.name.addClass('empty');
		else {
			this.ui.segment.title.removeClass('empty');
			this.ui.segment.title.find('.contents').html(name);
		}
		if ( !desc || desc.length == 0) this.ui.segment.description.addClass('empty');
		else {
			this.ui.segment.description.removeClass('empty');
			this.ui.segment.description.find('.contents').html(desc);
		}
		if ( !comment || comment.length == 0) this.ui.segment.comment.addClass('empty');
		else {
			this.ui.segment.comment.removeClass('empty');
			this.ui.segment.comment.find('.contents').html(comment);
		}
		if ( !transcript || transcript.length == 0) this.ui.segment.transcript.addClass('empty');
		else {
			this.ui.segment.transcript.removeClass('empty');
			this.ui.segment.transcript.find('.contents').html(transcript);
		}
	}

	setSequenceMetadata(sequence) {
		if ( !sequence ) return;
		
		this.ui.sequenceMetadata.removeClass('d-none');

		let name = sequence.model.analysisSequenceTranslations[0].name;
		let desc = ( sequence.model.analysisSequenceTranslations[0].shortDescription ) ? sequence.model.analysisSequenceTranslations[0].shortDescription : '';
		let comment = sequence.model.analysisSequenceTranslations[0].comment;
		let transcript = sequence.model.analysisSequenceTranslations[0].transcript;

		if ( !name || name.length == 0) this.ui.sequence.name.addClass('empty');
		else {
			this.ui.sequence.name.removeClass('empty');
			this.ui.sequence.name.find('.contents').html(name);
		}
		if ( !desc || desc.length == 0) this.ui.sequence.description.addClass('empty');
		else {
			this.ui.sequence.description.removeClass('empty');
			this.ui.sequence.description.find('.contents').html(desc);
		}
		if ( !comment || comment.length == 0) this.ui.sequence.comment.addClass('empty');
		else {
			this.ui.sequence.comment.removeClass('empty');
			this.ui.sequence.comment.find('.contents').html(comment);
		}
		if ( !transcript || transcript.length == 0) this.ui.sequence.transcript.addClass('empty');
		else {
			this.ui.sequence.transcript.removeClass('empty');
			this.ui.sequence.transcript.find('.contents').html(transcript);
		}
	}

	setTakeMetadata(take) {
		if ( !take ) return;
		
		this.ui.takeMetadata.removeClass('d-none');

		let name = take.model.analysisTakeTranslations[0].name;
		let desc = ( take.model.analysisTakeTranslations[0].shortDescription ) ? take.model.analysisTakeTranslations[0].shortDescription : '';
		let comment = take.model.analysisTakeTranslations[0].comment;
		let transcript = take.model.analysisTakeTranslations[0].transcript;

		if ( !name || name.length == 0) this.ui.take.name.addClass('empty');
		else {
			this.ui.take.name.removeClass('empty');
			this.ui.take.name.find('.contents').html(name);
		}
		if ( !desc || desc.length == 0) this.ui.take.description.addClass('empty');
		else {
			this.ui.take.description.removeClass('empty');
			this.ui.take.description.find('.contents').html(desc);
		}
		if ( !comment || comment.length == 0) this.ui.take.comment.addClass('empty');
		else {
			this.ui.take.comment.removeClass('empty');
			this.ui.take.comment.find('.contents').html(comment);
		}
		if ( !transcript || transcript.length == 0) this.ui.take.transcript.addClass('empty');
		else {
			this.ui.take.transcript.removeClass('empty');
			this.ui.take.transcript.find('.contents').html(transcript);
		}
	}

	setSceneMetadata(scene) {
		if ( !scene ) return;
		
		this.ui.sceneMetadata.removeClass('d-none');

		let name = scene.model.analysisSceneTranslations[0].name;
		let desc = ( scene.model.analysisSceneTranslations[0].shortDescription ) ? scene.model.analysisSceneTranslations[0].shortDescription : '';
		let comment = scene.model.analysisSceneTranslations[0].comment;
		let transcript = scene.model.analysisSceneTranslations[0].transcript;

		if ( !name || name.length == 0) this.ui.scene.name.addClass('empty');
		else {
			this.ui.scene.name.removeClass('empty');
			this.ui.scene.name.find('.contents').html(name);
		}
		if ( !desc || desc.length == 0) this.ui.scene.description.addClass('empty');
		else {
			this.ui.scene.description.removeClass('empty');
			this.ui.scene.description.find('.contents').html(desc);
		}
		if ( !comment || comment.length == 0) this.ui.scene.comment.addClass('empty');
		else {
			this.ui.scene.comment.removeClass('empty');
			this.ui.scene.comment.find('.contents').html(comment);
		}
		if ( !transcript || transcript.length == 0) this.ui.scene.transcript.addClass('empty');
		else {
			this.ui.scene.transcript.removeClass('empty');
			this.ui.scene.transcript.find('.contents').html(transcript);
		}
	}

	setActionMetadata(action) {
		if ( !action ) return;
		
		this.ui.actionMetadata.removeClass('d-none');

		let name = action.model.analysisActionTranslations[0].name;
		let desc = ( action.model.analysisActionTranslations[0].shortDescription ) ? action.model.analysisActionTranslations[0].shortDescription : '';
		let comment = action.model.analysisActionTranslations[0].comment;
		let transcript = action.model.analysisActionTranslations[0].transcript;

		if ( !name || name.length == 0) this.ui.action.name.addClass('empty');
		else {
			this.ui.action.name.removeClass('empty');
			this.ui.action.name.find('.contents').html(name);
		}
		if ( !desc || desc.length == 0) this.ui.action.description.addClass('empty');
		else {
			this.ui.action.description.removeClass('empty');
			this.ui.action.description.find('.contents').html(desc);
		}
		if ( !comment || comment.length == 0) this.ui.action.comment.addClass('empty');
		else {
			this.ui.action.comment.removeClass('empty');
			this.ui.action.comment.find('.contents').html(comment);
		}
		if ( !transcript || transcript.length == 0) this.ui.action.transcript.addClass('empty');
		else {
			this.ui.action.transcript.removeClass('empty');
			this.ui.action.transcript.find('.contents').html(transcript);
		}
	}
	
	selectAnnotation(annotation, changehash=true) {
		if ( this.curAnnotation == annotation && annotation != null ) return;
		if ( this.curAnnotation ) this.curAnnotation.setSelected(false);
		this.curAnnotation = annotation;
		if ( this.curAnnotation ) this.ui.segmentMetadata.addClass('d-none');
		if ( this.curAnnotation ) this.curAnnotation.setSelected(true);
		if ( this.curAnnotation ) this.ui.annoMetadata.removeClass('d-none'); else this.ui.annoMetadata.addClass('d-none');
		if ( changehash ) if (annotation) location.hash = '#'+annotation.model.uuid.uuid; else location.hash = '#' // UUIDs not yet available in timaat db
		this.setAnnotationMetadata();
	}
	
	setAnnotationMetadata() {
		if ( !this.curAnnotation ) return;

		if ( !this.curAnnotation.model.title || this.curAnnotation.model.title == 0) this.ui.annotation.title.addClass('empty');
		else {
			this.ui.annotation.title.removeClass('empty');
			this.ui.annotation.title.find('.contents').html(this.curAnnotation.model.title);
		}
		if ( !this.curAnnotation.model.comment || this.curAnnotation.model.comment == 0) this.ui.annotation.comment.addClass('empty');
		else {
			this.ui.annotation.comment.removeClass('empty');
			this.ui.annotation.comment.find('.contents').html(this.curAnnotation.model.comment);
		}
		this.ui.annotation.categories.addClass('empty');
		this.ui.annotation.actors.addClass('empty');
		this.ui.annotation.events.addClass('empty');
		this.ui.annotation.places.addClass('empty');
		this.ui.annotation.links.addClass('empty');
		
	}
	
	setupAnalysisList(analysislist, changehash=true) {
		if ( !this.video ) return;
		if ( this.curAnnotation ) this.curAnnotation.setSelected(false);
		
		if ( this.analysislist ) this.analysislist.ui.removeClass('selected');

		// setup model
		this.analysislist = analysislist;
		this.analysislist.ui.addClass('selected');
		this.ui.listLabel.text(this.analysislist.ui.find('.item-title').text());
		// clear polygon UI
		this.viewer.annoLayer.eachLayer(function(layer) {layer.remove()});

		// clear old list contents if any			
		if ( this.curAnalysisList != null && this.curAnalysisList.analysisSegmentsUI != null) {
			this.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
				segment.removeUI();
			});
			this.annotationList.forEach(function(anno) {
				anno.remove();
			});
		}
		this.annotationList = [];
		this.curAnalysisList = analysislist;
		this.setListMetadata();
		
		// setup segment model
		if ( !this.curAnalysisList.analysisSegmentsUI ) {
			this.curAnalysisList.analysisSegmentsUI = [];
			for ( let segment of this.curAnalysisList.analysisSegments ) this.curAnalysisList.analysisSegmentsUI.push(new AnalysisSegment(segment));
		}
		this.sortSegments();
		
		
		// build annotation list from model
		if ( analysislist )
			for (let annotation of analysislist.annotations) this.annotationList.push(new Annotation(annotation));
						
		if ( this.curAnalysisList != null && this.curAnalysisList.analysisSegmentsUI != null) this.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
			segment.addUI();
		});
		this.selectAnnotation(null, changehash);
		this.updateListUI();
		this.sortListUI();
		
		this.ui.video.pause();
	}
	
	sortSegments() {
		this.curAnalysisList.analysisSegmentsUI.sort(function (a, b) {
			if ( b.model.startTime < a.model.startTime ) return 1;
			if ( b.model.startTime > a.model.startTime ) return -1;
			return 0;
		})
	}
	
	updateControlsTimeout() {
		if ( this.ui.controlsTimeout ) clearTimeout(this.ui.controlsTimeout);
		if ( !this.ui.onControls ) this.ui.controlsTimeout = setTimeout(function() {$('#timaat-video-controls').fadeOut('slow')}, 3000);
	}
	
	updateListUI() {
		if (this.annotationList) for (let annotation of this.annotationList) annotation.updateStatus(TIMAATPub.ui.video.currentTime);
	}
	
	sortListUI() {
		$("#timaat-annotation-list li").sort(function (a, b) {
			if ( (parseFloat($(b).attr('data-starttime'))) < (parseFloat($(a).attr('data-starttime'))) ) return 1;
			if ( (parseFloat($(b).attr('data-starttime'))) > (parseFloat($(a).attr('data-starttime'))) ) return -1;
			if ( !$(b).hasClass('timaat-annotation-list-segment') &&  $(a).hasClass('timaat-annotation-list-segment') ) return -1;
			return 0;
		}).appendTo('#timaat-annotation-list');
	}
	
	setupUI() {
		if (this.ui) return;
		this.ui = {
			videoSeekBar: $('.video-seekbar'),
			videoProgress: $('.video-seekbar').find('.progress'),
			volumeSlider: $('.volume-seekbar').find('.progress'),
			timeLabel: $('.start-time'),
			durationLabel: $('.end-time'),
			listLabel: $('.timaat-list-title'),
			timeInfoLabel: $('#timaat-video-controls .time-info'),
			mediumMetadata: $('.medium-metadata'),
			medium: {
				title : $('.medium-title'),
				remark : $('.medium-remark'),
				releaseDate : $('.medium-release-date'),
				source : $('.medium-source'),
				copyright : $('.medium-copyright'),
				categories : $('.medium-categories'),
			},
			annotation: {
				title : $('.annotation-title'),
				comment : $('.annotation-comment'),
				categories : $('.annotation-categories'),
				actors : $('.annotation-actors'),
				events : $('.annotation-events'),
				places : $('.annotation-places'),
				links : $('.annotation-links'),
			},
			list: {
				title : $('.list-title'),
				comment : $('.list-comment'),
			},
			segment: {
				title : $('.segment-name'),
				description : $('.segment-description'),
				comment : $('.segment-comment'),
			},
			annoMetadata: $('.annotation-metadata'),
			listMetadata: $('.list-metadata'),
			segmentMetadata: $('.segment-metadata'),
			videoTemplate: `<li class="card mr-2 mb-2 bg-dark" style="width: 268px">
<a href="#" title="">
			<img src="#" alt="" class="preview img-responsive card m-auto b-block border-dark" height="150px">
			<h6 class="pt-1 pl-1 pr-1 text-light" style="font-size:80%;"><i class="fas fa-video"></i> <span class="title">Video</span></h6>
			<span class="duration badge badge-dark badge-pill" style="position: absolute;top: 10px;right: 20px; opacity: 0.8;">00:00</span>
		</a></li>`,
		};
		
		if ( this.video ) {
			// viewer
			this.viewer = L.map('timaat-viewer', {
				zoomControl: false,
				attributionControl: false,
				zoom: 0.0,
				zoomSnap: 0.0001,
				maxZoom: 2.0,
				minZoom: -2.0,
				center: [0,0],
				crs: L.CRS.Simple,
				editable: true,
				keyboard: false,
			});
			this.viewer.dragging.disable();
			this.viewer.touchZoom.disable();
			this.viewer.doubleClickZoom.disable();
			this.viewer.scrollWheelZoom.disable();
		
			// video
			this.videoBounds = L.latLngBounds([[ this.video.mediumVideo.height, 0], [ 0, this.video.mediumVideo.width]]);
			this.viewer.setMaxBounds(this.videoBounds);
			this.viewer.fitBounds(this.videoBounds);
			let filename = ( TIMAATSettings.offline ) ? this.video.id+'.mp4' : window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')+1) + 'item-'+this.video.id;
			this.overlay = L.videoOverlay(filename, this.videoBounds, { autoplay: false, loop: false} ).addTo(this.viewer);
			this.ui.video = this.overlay.getElement();

			// polygon layer
			this.viewer.annoLayer = new L.LayerGroup();;
			this.viewer.addLayer(this.viewer.annoLayer);
		
			// analysis lists
			this.ui.analysislist = $('#timaat-analysis-list');
			for (let list of this.video.mediumAnalysisLists) {
				let item = $('<li class="list-group-item list-group-item-action pt-0 pb-0 pl-2 pr-2"><i class="fas fa-check-circle"></i> <span class="item-title">'+list.mediumAnalysisListTranslations[0].title+'</span></li>');
				list.ui = item;
				this.ui.analysislist.append(item);
				item.on('click', ev => { TIMAATPub.setupAnalysisList(list) });
			}
		
			// mediumvideo metadata
			let title = this.video.displayTitle.name+' ('+this.video.displayTitle.language.code+')';
			if ( this.video.originalTitle ) title += '<br>OT: '+this.video.originalTitle.name+' ('+this.video.originalTitle.language.code+')'
			this.ui.medium.title.find('.contents').html(title);
			if ( !this.video.remark || this.video.remark.length == 0) this.ui.medium.remark.addClass('empty')
			else this.ui.medium.remark.find('.contents').html(this.video.remark);
			this.ui.medium.releaseDate.find('.contents').html(this.formatDate(this.video.releaseDate));
			if ( !this.video.sources || this.video.sources.length == 0 ) this.ui.medium.source.addClass('empty');
			else {
				let sources = '';
				for (let source of this.video.sources) {
					if ( source.isPrimarySource ) sources += '<div class="d-flex justify-content-between"><span class="badge badge-primary mt-1">Primary</span><span>'+this.formatDate(source.lastAccessed)+'</span></div>';
					else sources += '<div class="d-flex justify-content-end"><span>'+this.formatDate(source.lastAccessed)+'</span></div>';
					if ( source.isStillAvailable ) sources += '<a href="'+source.url+'">'+source.url+'</a>'; else sources += '<span class="text-muted">'+source.url+'</span>';
				}
				this.ui.medium.source.find('.contents').html(sources);
			}
			if ( !this.video.copyright || this.video.copyright.length == 0) this.ui.medium.copyright.addClass('empty')
			else this.ui.medium.copyright.find('.contents').html(this.video.copyright);
			this.ui.medium.categories.addClass('empty');
		} else {
			// setup video list
			let list = $('#timaat-collection');
			for ( let medium of this.collection.mediaCollectionHasMediums ) {
				medium = medium.medium;
				let title = medium.displayTitle.name+' ('+medium.displayTitle.language.code+')';
				if ( medium.originalTitle ) title += ' - OT: '+medium.originalTitle.name+' ('+medium.originalTitle.language.code+')';
				if ( medium.mediumVideo.length < 0 ) medium.mediumVideo.length += 3600; // temp fix for DB problems
				
				let item = $(this.ui.videoTemplate);
				item.find('a').attr('href', medium.id);
				item.find('.preview').attr('src', 'item-'+medium.id+'/preview.jpg');
				item.find('.preview').attr('alt', title);
				item.find('.title').text(title);
				item.find('.duration').html(this.formatTime(medium.mediumVideo.length));
				list.append(item);
			}
			console.log(list);
		}
		

		// settings events
		$('.timaat-publication-settings').on('click', function(ev) {ev.stopPropagation();});
		$('.settings-stop-image').prop('checked', TIMAATSettings.stopImage == true);
		$('.settings-stop-polygon').prop('checked', TIMAATSettings.stopPolygon == true);
		$('.settings-stop-audio').prop('checked', TIMAATSettings.stopAudio == true);
		$('.settings-stop-image,.settings-stop-polygon,.settings-stop-audio').on('change', ev => {
			let status = $(ev.currentTarget).prop('checked');
			if ( $(ev.currentTarget).hasClass('settings-stop-image') ) TIMAATSettings.stopImage = status;
			if ( $(ev.currentTarget).hasClass('settings-stop-polygon') ) TIMAATSettings.stopPolygon = status;
			if ( $(ev.currentTarget).hasClass('settings-stop-audio') ) TIMAATSettings.stopAudio = status;
		});

		// events
		$('#timaat-toggle-fullscreen').on('click', ev => {
			try {
				if ( document.fullscreenElement ) document.exitFullscreen();
				else $('#timaat-main')[0].requestFullscreen();
				
			} catch (e) {};
		});
		$(document).on('fullscreenchange', ev => {
			if ( document.fullscreenElement ) $('#timaat-toggle-fullscreen').removeClass('btn-outline-dark').addClass('btn-dark');
			else $('#timaat-toggle-fullscreen').addClass('btn-outline-dark').removeClass('btn-dark');
		});
		
		$('#timaat-viewer').on('mousemove', ev=> { $('#timaat-video-controls').fadeIn(); TIMAATPub.updateControlsTimeout(); });
		$('#timaat-video-controls').on('mouseenter', ev=> { TIMAATPub.ui.onControls = true; TIMAATPub.updateControlsTimeout(); });
		$('#timaat-video-controls').on('mouseleave', ev=> { TIMAATPub.ui.onControls = false; TIMAATPub.updateControlsTimeout(); });
		
		$('.sidebar').on('transitionend', function(ev) { TIMAATPub.fitVideo(); });
		$('.video-seekbar').on('mouseenter mouseleave', ev => { TIMAATPub.ui.seekBarPos = ev.originalEvent.layerX; 
			if ( ev.type == 'mouseenter' ) TIMAATPub.ui.timeInfoLabel.addClass('show');
			else TIMAATPub.ui.timeInfoLabel.removeClass('show');
			TIMAATPub.ui.timeInfoLabel.text(TIMAATPub.formatTime(parseFloat(ev.originalEvent.layerX / $('.video-seekbar').width() * TIMAATPub.duration)));
		});
		$('.video-seekbar').on('click mousemove', e => {
			TIMAATPub.ui.timeInfoLabel.css('left', (e.originalEvent.layerX-30)+'px');
			TIMAATPub.ui.timeInfoLabel.text(TIMAATPub.formatTime(parseFloat(e.originalEvent.layerX / $('.video-seekbar').width() * TIMAATPub.duration)));
			if ( e.type == 'mousemove' && e.originalEvent.buttons != 1 ) return;
			let seekPos = e.pageX - $('#timaat-video-controls')[0].offsetLeft - $('.video-seekbar')[0].offsetLeft;
			let seekVal = seekPos / $('.video-seekbar')[0].clientWidth;
			TIMAATPub.jumpTo(seekVal * TIMAATPub.duration);
		});
		$('.volume-seekbar').on('click mousemove', e => {
			e.preventDefault();
			if ( e.type == 'mousemove' && e.originalEvent.buttons != 1 ) return;
			let seekVal = e.originalEvent.layerX / ($('.volume-seekbar').width() + 2.0);
			seekVal = Math.max(0.0, Math.min(seekVal, 1.0));
			TIMAATPub.setVolume(seekVal);
		});
		$('.stepbckbutton').on('click dblclick', ev => {
			ev.preventDefault();
			ev.stopPropagation();
			TIMAATPub.pause();
			let frameTime = 1 / TIMAATPub.frameRate;
			TIMAATPub.jumpTo(
				Math.max(0, (Math.round(TIMAATPub.ui.video.currentTime/frameTime)*frameTime) - frameTime)
			);
		});
		$('.stepfwdbutton').on('click dblclick', ev => {
			ev.preventDefault();
			ev.stopPropagation();
			TIMAATPub.pause();
			let frameTime = 1 / TIMAATPub.frameRate;
			TIMAATPub.jumpTo(
				Math.min(TIMAATPub.ui.video.duration, (Math.round(TIMAATPub.ui.video.currentTime/frameTime)*frameTime) + frameTime)
			);
		});
		$('.video-speed').on('click', function() {
			var playbackSpeeds = [1,2,0.5,0.25]; // TODO move to config

			var speed = playbackSpeeds.indexOf(TIMAATPub.ui.video.playbackRate);
			if ( speed < 0 ) TIMAATPub.ui.video.playbackRate = 1;
			else {
				speed++;
				if ( speed > playbackSpeeds.length-1 ) speed = 0;
				TIMAATPub.ui.video.playbackRate = playbackSpeeds[speed];
			}
			let rateInfo = TIMAATPub.ui.video.playbackRate;
			if ( rateInfo == 0.5 ) rateInfo = "&frac12;";
			if ( rateInfo == 0.25 ) rateInfo = "&frac14;";
			// update UI
			$(this).find('.video-speed-info').html(rateInfo+"&times;");
			if ( TIMAATPub.ui.video.playbackRate != 1 ) $(this).addClass('active'); else $(this).removeClass('active');
		});
		
		$('.toggle-left-sidebar').on('click', ev => { this.toggleSidebar('left'); });
		$('.toggle-right-sidebar').on('click', ev => { this.toggleSidebar('right'); });
		
	    $(this.ui.video).on('loadeddata timeupdate', () => {
			this.updateSeekBar();
			this.updateTimeInfo();
			this.updateListUI();
		});
 	    $(this.ui.video).on('ended', () => {
			this.pause();
			this.updateSeekBar();
			this.updateTimeInfo();
		});
		 
		$('.toggle-play-pause').on('click', ev => {
			ev.preventDefault();
			if ( $('.toggle-play-pause').hasClass('play') ) TIMAATPub.play(); else TIMAATPub.pause();
		});
		$('.toggle-volume').on('click', ev => {
			ev.preventDefault();
			if ( TIMAATPub.ui.video.volume > 0 ) {
				TIMAATPub.volume = TIMAATPub.ui.video.volume;
				TIMAATPub.setVolume(0);
			} else TIMAATPub.setVolume(TIMAATPub.volume);			
		});
		 
		$(window).resize(function() { TIMAATPub.fitVideo(); });
		
		// key events
		let viewElement = ( this.video ) ? this.viewer : $('#timaat-collection');
		$([document.body,viewElement]).keydown(function(ev) {
			if ( ev.target != document.body && ev.target != TIMAATPub.viewer ) return;
			
			var key;
			if ( ev.originalEvent.key ) key = ev.originalEvent.key;
			else key = ev.originalEvent.originalEvent.key;
			
			switch (key) {
			case " ":
				ev.preventDefault();
				$('.toggle-play-pause').click();
				break;
			case "ArrowLeft":
				ev.preventDefault();
				$('.stepbckbutton').click();
				break;
			case "ArrowRight":
				ev.preventDefault();
				$('.stepfwdbutton').click();
				break;
			case "m":
				ev.preventDefault();
				$('.toggle-volume').click();
				break;
			case "a":
				ev.preventDefault();
				$('.toggle-left-sidebar').click();
				break;
			case "i":
				ev.preventDefault();
				$('.toggle-right-sidebar').click();
				break;
			case "f":
				ev.preventDefault();
				$('#timaat-toggle-fullscreen').click();
				break;
			case "s":
				ev.preventDefault();
				$('.video-speed').click();
				break;
			}
		});
		
		$(window).on('hashchange', ev=>{
			let hash = location.hash;
			if ( !hash || hash.length < 1 ) return;
			let id = 0;
//			try { id = parseInt(hash.substring(1)); } catch(e) {};
			id = hash.substring(1);
			if ( id == 0 ) return;
			let list = null;
			for ( let annoList of this.video.mediumAnalysisLists ) for ( let anno of annoList.annotations ) if ( anno.uuid.uuid == id ) list = annoList;
			if ( !list ) return;
			
			if ( list.id != TIMAATPub.curAnalysisList.id ) TIMAATPub.setupAnalysisList(list, false);
			
			if ( !TIMAATPub.curAnnotation || TIMAATPub.curAnnotation.model.uuid.uuid != id ) for ( let anno of TIMAATPub.annotationList ) if ( anno.model.uuid.uuid == id ) {
				TIMAATPub.selectAnnotation(anno);
				TIMAATPub.pause();
				TIMAATPub.jumpVisible(anno.startTime, anno.endTime);
			}
		});
		
		// text
		if ( this.video ) {
			$('.video-title').text(this.video.displayTitle.name);
			this.ui.durationLabel.html(this.formatTime(this.duration));
		} else {
			$('.video-title').text(this.collection.title);
		}
		
	}
	
}
