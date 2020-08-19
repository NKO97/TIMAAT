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
	
	TIMAAT.Annotation = class Annotation {
		constructor(model) {
			console.log("TCL: Annotation -> constructor -> model", model);
			// setup model
			this._destroyed = false;
			this.active = false;
			this.selected = false;
			this._animTime = -1;
			this.model = model;
			this.svg = Object();
			this.svg.items = Array();
			this.svg.keyframes = Array();
			this.svg.strokeWidth = this.model.selectorSvgs[0].strokeWidth ? 2 : 0;
			this.svg.color = this.model.selectorSvgs[0].colorRgba.substring(0,6);
			this._opacity = parseInt(this.model.selectorSvgs[0].colorRgba.substring(6,8), 16)/255;
			if ( isNaN(this._opacity) ) this._opacity = 0.3; // default value
			this.svg.model = JSON.parse(this.model.selectorSvgs[0].svgData);
			this._upgradeModel();

			this._startTime = this.model.sequenceStartTime/1000.0;
			this._endTime = this.model.sequenceEndTime/1000.0;
			this._layerVisual = this.model.layerVisual;
			// create keyframes
			for (let keyframe of this.svg.model.keyframes) this.svg.keyframes.push(new TIMAAT.Keyframe(keyframe, this));

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
						<div class="text-muted timaat-user-log pr-1"><i class="fas fa-user"></i></div>
					</div>
				</li>`
			);
			
//			console.log("TCL: Annotation -> constructor -> this.updateUI()");
			this.updateUI();
					
			let anno = this; // save annotation for events

			$('#timaat-annotation-list').append(this.listView);
			this.listView.find('.timaat-annotation-list-categories').on('click', this, function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.pause();
				if ( TIMAAT.VideoPlayer.curAnnotation != ev.data ) TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-tags');
			});
			/*
			this.listView.find('.timaat-annotation-list-categories').popover({
				placement: 'right',
				title: 'Categories bearbeiten',
				trigger: 'click',
				html: true,
				content: '<div class="input-group ui-front"><input class="form-control timaat-category-input" type="text" value=""></div>',
				container: 'body',
				boundary: 'viewport',
			});
			*/
			// attach user log info
			this.listView.find('.timaat-user-log').popover({
				placement: 'right',
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				trigger: 'click',
				html: true,
				content: '<div class="timaat-user-log-details">Lade...</div>',
				container: 'body',
				boundary: 'viewport',				
			});
			this.listView.find('.timaat-user-log').on('show.bs.popover', function () {
				TIMAAT.UI.hidePopups();
			});
			this.listView.find('.timaat-user-log').on('inserted.bs.popover', function () {
				console.log("TCL: Annotation -> constructor -> Display Bearbeitungslog");
				$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+anno.model.createdByUserAccountId+'">[ID '+anno.model.createdByUserAccountId+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(anno.model.createdAt)+'<br>\
						 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+anno.model.lastEditedByUserAccountId+'">[ID '+anno.model.lastEditedByUserAccountId+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(anno.model.lastEditedAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			});
					
			/*
			// attach category editor
			this.listView.find('.timaat-annotation-list-categories').on('shown.bs.popover', function (ev) {
				var curtsname = "keins";
				if ( TIMAAT.VideoPlayer.curCategoryset ) curtsname = TIMAAT.VideoPlayer.curCategoryset.model.name;
						
				var dropdown =  $('<br><div class="btn-group dropright timaat-categoryset-chooser d-flex">' +
									'<button style="width:100%" type="button" class="btn btn-sm btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
									'Categoryset: ' + curtsname + 
									'</button>' +
									'<div class="dropdown-menu">' +
									'</div></div>');	
				$($(this).data('bs.popover').tip).find('.popover-header').append(dropdown);
				var tschooser = $($(this).data('bs.popover').tip).find('.timaat-categoryset-chooser');

				var empty = $('<a class="dropdown-item">(kein Categoryset)</a>');
				tschooser.find('.dropdown-menu').append(empty);
				empty.click(function() {					
					TIMAAT.VideoPlayer.setCategoryset(null);
					dropdown.find('button').text("Categoryset: keins");
				});
				$(TIMAAT.Settings.categorysets).each(function(index, categoryset) {
					var item = $('<a class="dropdown-item">'+categoryset.model.name+'</a>');
					tschooser.find('.dropdown-menu').append(item);
					item.click(function() {
						TIMAAT.VideoPlayer.setCategoryset(categoryset);
						dropdown.find('button').text("Categoryset: "+categoryset.model.name);				
					});
				});
						
//				$(this).data('bs.popover').config.content = 'new content';
			});
			this.listView.find('.timaat-annotation-list-categories').on('inserted.bs.popover', function () {
				var categories = "";
				anno.model.categories.forEach(function(item) { categories += ','+item.name });
				categories = categories.substring(1);
				$('.timaat-category-input').val(categories);
				$('.timaat-category-input').categoriesInput({
					placeholder: 'Category hinzufügen',
					autocomplete: {
						position: { my : "right top", at: "right bottom" },
						source: TIMAAT.VideoPlayer.categoryAutocomplete,
					},

					onAddCategory: function(categoryinput,category) {
						TIMAAT.Service.addCategory(anno, category, function(newcategory) {
							anno.model.categories.push(newcategory);
							console.log("TCL: Annotation -> constructor -> anno.updateUI()");
							anno.updateUI();                
						});
					},
					onRemoveCategory: function(categoryinput,category) {
						TIMAAT.Service.removeCategory(anno, category, function(categoryname) {
							// find category in model
							var found = -1;
							anno.model.categories.forEach(function(item, index) {
								if ( item.name == categoryname ) found = index;
							});
							if (found > -1) anno.model.categories.splice(found, 1);
							console.log("TCL: Annotation -> constructor -> anno.updateUI()");
							anno.updateUI();                
						});
					},
					onChange: function() {
						if ( this.length == 1) $('#'+this[0].id+'_category').focus();
					}
				});
			});
			this.listView.find('.timaat-annotation-list-categories').on('hidden.bs.popover', function () { anno.updateUI(); });
			console.log("TCL: Annotation -> constructor -> anno.updateUI()");
*/
			this.listView.find('.timaat-annotation-list-categories').dblclick(function(ev) {ev.stopPropagation();});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// convert SVG data
			for (let svgitem of this.svg.model.keyframes[0].shapes) {
				let item = this._parseSVG(svgitem);
				this.addSVGItem(item);
				item.dragging.disable();
			};

			// attach event handlers
			$(this.listView).click(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(ev.data.startTime, ev.data.endTime);
				if ( TIMAAT.VideoPlayer.curAnnotation != ev.data ) TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				else TIMAAT.VideoPlayer.selectAnnotation(null);
//						TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				TIMAAT.VideoPlayer.pause();
			});
			$(this.listView).dblclick(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(ev.data.startTime, ev.data.endTime);
				TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			});

			// create marker with UI
			this.marker = new TIMAAT.Marker(this);
			this.marker.updateView();

			this.changed = false;
		}
		
		_upgradeModel() {
			if ( Array.isArray(this.svg.model) ) {
				// upgrade old DB model
				let newModel = {
						keyframes: [{
							time: 0,
							shapes: this.svg.model,
						}],
				}
				for ( let shape of newModel.keyframes[0].shapes ) shape.id = TIMAAT.Util.createUUIDv4();
				this.svg.model = newModel;
				this.model.selectorSvgs[0].svgData = JSON.stringify(this.svg.model);
			}
		};

		
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
		
		addKeyframeAt(time) {
			if ( this._destroyed ) return;
			this.updateStatus(time);
			let relTime = time - this.startTime;
			relTime = parseFloat(relTime.toFixed(3));
			relTime = (relTime < 0) ? 0 : relTime;
			if ( relTime  == 0 ) return;
			let exists = false;
			for (let keyframe of this.svg.keyframes) if ( keyframe.time == relTime ) exists = true;
			if ( exists ) return;
			let cur = this.currentKeyframe;
			let next = this.nextKeyframe;
			let first = this.svg.keyframes[0];
			let model = JSON.parse(JSON.stringify(cur.model));
			if ( cur != next ) {
				let percent = (relTime-cur.time) / (next.time-cur.time);
				let shapes = new Array();
				for (let item of model.shapes) {
					shapes.push(
						TIMAAT.Util.getInterpolatedShape(
							cur.getShape(item.id),
							next.getShape(item.id),
							percent
						)
					);
				}
				model = first._syncToModel(shapes);
			}
			
			model.time = relTime;
			let keyframe = new TIMAAT.Keyframe(model, this);
			this.svg.keyframes.push(keyframe);
			// sort keyframe array by time index
			this.svg.keyframes.sort(function ( a, b ) {
				if ( a.time < b.time ) return -1;
				if ( a.time > b.time ) return 1;
				return 0;
			});
			this.changed = true;
			for (let frame of this.svg.keyframes) frame.updateUI();
			this.updateEditableUI();
			this.updateUI();
			// send event
			$(document).trigger('keyframeadded.annotation.TIMAAT', this);
		}
		
		removeCurrentKeyframe() {
			if ( this._destroyed ) return;
			if ( this.svg.keyframes.length <= 2 || this.currentKeyframe.time == 0 ) return;
			let cur = this.currentKeyframe;
			this.removeKeyframe(cur);
		}
		
		removeKeyframe(keyframe) {
			if ( this._destroyed || !keyframe ) return;
			if ( this.svg.keyframes.length < 2 || keyframe.time == 0 ) return;
			if ( this.svg.keyframes.indexOf(keyframe) < 1 ) return;
			keyframe.remove();
			let index = this.svg.keyframes.indexOf(keyframe);
			if ( index < 0 ) return;
			this.svg.keyframes.splice(index, 1);
			this.changed = true;
			for (let frame of this.svg.keyframes) frame.updateUI();
			this._updateShapeUI();
			this.updateEditableUI();
			this.updateUI();
			// send event
			$(document).trigger('keyframeremoved.annotation.TIMAAT', this);
		}

		
		removeAnimationKeyframes() {
			if ( this._destroyed ) return;
			let first = this.svg.keyframes[0];
			for (let keyframe of this.svg.keyframes) if ( keyframe != first ) keyframe.remove();
			this.svg.keyframes = [first];
			this.changed = true;
			for (let item of this.svg.items) this._updateSVGItem(item, first.getShape(item.options.id));
			this.updateEditableUI();
			this.updateUI();
			// send event
			$(document).trigger('keyframeremoved.annotation.TIMAAT', this);
		}
		
		get opacity() {
			return this._opacity;
		}
			
		set opacity(opacity) {
			this._opacity = Math.min(1.0, Math.max(0.0,opacity));
			this.setChanged();
			TIMAAT.VideoPlayer.updateUI();
			this.updateUI();
		};

		get layerVisual() {
			return this._layerVisual;
		}

		set layerVisual(layerVisual) {
			this._layerVisual = layerVisual;
			this.setChanged();
			TIMAAT.VideoPlayer.updateUI();
			this.updateUI();
		};
		  
		get stroke() {
			return this.svg.strokeWidth;
		}

		set stroke(stroke) {
			if ( stroke < 0 ) stroke = 0;
			if ( this.svg.strokeWidth != stroke ) {
				this.svg.strokeWidth = stroke;
				this.setChanged();
				TIMAAT.VideoPlayer.updateUI();
				this.updateUI();
			}
		};
		
		get startTime() {
			return this._startTime;
		}
			
		set startTime(startTime) {
			this._startTime = Math.min(startTime, TIMAAT.VideoPlayer.duration);
			this._startTime = Math.max(0, this._startTime);
			this._endTime = Math.max(startTime, this._endTime);
			if ( this._startTime != this.model.startTime ) {this.setChanged();TIMAAT.VideoPlayer.updateUI();}
			if ( this._endTime != this.model.endTime ) {this.setChanged();TIMAAT.VideoPlayer.updateUI();}
			this.svg.keyframes[0].updateTimeUI();
		};
		  
		get endTime() {
			return this._endTime;
		}

		set endTime(endTime) {
			this._endTime = Math.min(endTime, TIMAAT.VideoPlayer.duration);
			this._endTime = Math.max(this._startTime, this._endTime);
			if ( this._endTime != this.model.endTime ) {this.setChanged();TIMAAT.VideoPlayer.updateUI();}
		};
		
		get length() {
			return this._endTime - this._startTime;
		}

		hasPolygons() {
			return this.svg.items.length > 0;
		}

		
		updateUI() {
//			  console.log("TCL: Annotation -> updateUI -> updateUI()");
			  this.listView.attr('data-starttime', this.model.sequenceStartTime);
			  this.listView.find('.timaat-annotation-list-type').css('color', '#'+this.svg.color);
			  var timeString = " "+TIMAAT.Util.formatTime(this.model.sequenceStartTime/1000.0, true);
			  if ( this.model.sequenceStartTime != this.model.sequenceEndTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.sequenceEndTime/1000.0, true);
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
					} else {
						if ( this.svg.items.length > 0 ) type.addClass('fa-draw-polygon');
						else type.addClass('fa-image');
					}
				};
				
				remove() {
					console.log("TCL: Annotation -> remove -> remove()");
					// remove annotation from UI
					this.listView.remove();
					this.marker.remove();
					this.svg.layer.remove();
					this.selected = false;
					this._destroyed = true;
				}
				
				addSVGItem (item) {
					console.log("TCL: Annotation -> addSVGItem -> item", item);
					if ( !item || this.svg.items.includes(item) ) return;
					// generate UUID for shape and propagate through keyframes
					if ( !item.options.id ) {
						item.options.id = TIMAAT.Util.createUUIDv4();
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
					// add to list of shapes
					this.svg.items.push(item);
					this.svg.layer.addLayer(item);
					
					this.changed = true;

					// update UI
					this._updateAnnotationType();
					if ( this.marker ) this.marker.updateView();
					
					// attach item event handlers
					let anno = this;
					item.on('click', function(ev) {
						TIMAAT.VideoPlayer.selectAnnotation(anno);
						// delete annotation if user presses alt
						if ( ev.originalEvent.altKey && TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isOnKeyframe()  ) {
							anno.removeSVGItem(ev.target);
							TIMAAT.VideoPlayer.updateUI();
							console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");
						}
					});
					item.on('dragstart', function(ev) {anno.setChanged();TIMAAT.VideoPlayer.updateUI();});
					console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");
					item.on('dragend', function(ev) {anno.setChanged();TIMAAT.VideoPlayer.updateUI();});
					console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");

				}
						
				removeSVGItem (item) {
					console.log("TCL: Annotation -> removeSVGItem -> item", item);
					if ( !item || !this.svg.items.includes(item) ) return;
					this.svg.layer.removeLayer(item);
					var index = this.svg.items.indexOf(item);
					if (index > -1) this.svg.items.splice(index, 1);
					// propagate changes to keyframes
					for (let keyframe of this.svg.keyframes) keyframe.removeShape(item.options.id);
					
					this.changed = true;

					// update UI
					if ( this.svg.items.length == 0 ) {
						this._updateAnnotationType();
						if ( this.marker ) this.marker.updateView();
					}
				}
				
				setChanged() {
//					console.log("TCL: Annotation -> setChanged -> setChanged()");
					this.changed = true;
				}
				
				hasChanges() {
//					console.log("TCL: Annotation -> hasChanges -> hasChanges()");
					return this.changed;
				}

				
				getModel() {
//					console.log("TCL: Annotation -> getModel -> getModel()");
//					this.model.sequenceStartTime = TIMAAT.Util.formatTime(this.model.startTime, true);
//					this.model.sequenceEndTime = TIMAAT.Util.formatTime(this.model.startTime, true);
					return this.model;
				}
				
				discardChanges() {
					console.log("TCL: Annotation -> discardChanges -> discardChanges()");
					if ( !this.changed ) return;
					this.svg.layer.clearLayers();
					this.svg.items = Array();
					this._layerVisual = this.model.layerVisual;
					this._startTime = this.model.sequenceStartTime/1000.0;
					this._endTime = this.model.sequenceEndTime/1000.0;
					this.svg.color = this.model.selectorSvgs[0].colorRgba.substring(0,6);
					this._opacity = parseInt(this.model.selectorSvgs[0].colorRgba.substring(6,8), 16)/255;
					this.svg.strokeWidth = this.model.selectorSvgs[0].strokeWidth ? 2 : 0;

					this.svg.model = JSON.parse(this.model.selectorSvgs[0].svgData);
					this._upgradeModel();
					for (let svgitem of this.svg.model.keyframes[0].shapes) {
						let item = this._parseSVG(svgitem);
						this.addSVGItem(item);
					}
					
					for (let keyframe of this.svg.keyframes) keyframe.remove();
					this.svg.keyframes = new Array();
					for (let keyframe of this.svg.model.keyframes) this.svg.keyframes.push(new TIMAAT.Keyframe(keyframe, this));
					
					// update UI
					this.changed = false;
					this.updateUI();
					this._updateShapeUI();
					this.updateEditableUI();
					// update keyframe UI
					if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();

				}
				
				saveChanges() {
					console.log("TCL: Annotation -> saveChanges -> saveChanges()");
					this._syncToModel();
					this.changed = false;
				}

				updateStatus(time) {
					time = parseFloat(time.toFixed(3));
//					console.log("TCL: Annotation -> updateStatus -> time", time);
					let animTime = time - this._startTime;
					animTime = parseFloat(animTime.toFixed(3));
					var active = false;
					if ( time >= this.startTime && time <= this.endTime ) active = true;
					this.setActive(active);
					if ( animTime == this._animTime ) return;
					this._animTime = animTime;
					this._updateShapeUI();
					this.updateEditableUI();
					// update keyframe UI
					if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();
				}
				
				isActive() {
//					console.log("TCL: Annotation -> isActive -> isActive()");
					return this.active;
				}
				
				setActive(active) {
//					console.log("TCL: Annotation -> setActive -> active", active);
					if ( this.active == active ) return;
					this.active = active;
					if ( active ) {
						this.listView.find('.timaat-annotation-status-marker').addClass('bg-success');
						TIMAAT.VideoPlayer.viewer.annoLayer.addLayer(this.svg.layer);
						// scroll list
						this._scrollIntoView(this.listView);
					} else {
						this.listView.find('.timaat-annotation-status-marker').removeClass('bg-success');
						TIMAAT.VideoPlayer.viewer.annoLayer.removeLayer(this.svg.layer);
						this.svg.layer.options.removed = true;
					}
				}
				
				updateEditableUI() {
					let added = false;
					for (let item of this.svg.items) {
						item.dragging.disable();
						item.disableEdit();
						if ( this.isSelected() && this.isActive() && this.isOnKeyframe() ) {
							if ( this.svg.layer.options.removed ) {
								item.dragging._draggable = null;
								item.dragging.addHooks();
								added = true;
							}
							item.dragging.enable();
							item.enableEdit();
							if ( this.isAnimation() ) {
								item.editor.options.skipMiddleMarkers = true;
								item.editor.reset();
							}
						}
					};
					if ( added ) this.svg.layer.options.removed = false;
				}
						
				setSelected(selected) {
					if (this._destroyed) return;
//					console.log("TCL: Annotation -> setSelected -> selected", selected);
					if ( this.selected == selected ) return;			
					this.selected = selected;
					if ( selected ) {

						this.listView.addClass('timaat-annotation-list-selected');
						
						for (let item of this.svg.items) {
							item.bringToFront();
/*
							item.dragging.enable();
							item.enableEdit();
							if ( this.isAnimation() ) {
								item.editor.options.skipMiddleMarkers = true;
								item.editor.reset();
							}
*/
						};
					}
					else {
						this.discardChanges();
						this.listView.removeClass('timaat-annotation-list-selected');
/*
						this.svg.items.forEach(function(item) {
							item.dragging.disable();
							item.disableEdit();
						});
*/
					}
					// update marker
					if ( this.marker ) this.marker.updateView();
					// update keyframe UI
					if ( this.isAnimation() ) for (let keyframe of this.svg.keyframes) keyframe.updateUI();
					// update editing UI
					this.updateEditableUI();
				}

				isSelected() {
//					console.log("TCL: Annotation -> isSelected -> isSelected()");
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
							this._updateSVGItem(item, TIMAAT.Util.getInterpolatedShape(
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
					console.log("TCL: Annotation -> _scrollIntoView -> listItem", listItem);
					var listTop = $('.timaat-annotation-list-wrapper').scrollTop();
					var listHeight = $('.timaat-annotation-list-wrapper').height();
					var elementTop = listItem.position().top;
					// TODO scroll from bottom if out of view
					if ( elementTop < 0 )
						$('.timaat-annotation-list-wrapper').animate({scrollTop:(listTop+elementTop)}, 100);
					if ( elementTop > listHeight )
						$('.timaat-annotation-list-wrapper').animate({scrollTop:(listTop+elementTop)-listHeight+48}, 100);
						
				}
				
				_parseSVG(svgitem) {
					console.log("TCL: Annotation -> _parseSVG -> svgitem", svgitem);
					let factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height;
					let width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
					let height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
					let id = svgitem.id;
					if ( !id ) {
						id = TIMAAT.Util.createUUIDv4();
						console.log("WARNING: Annotation -> _parseSVG -> svgitem: Required attribute ID missing from model", svgitem);
					}
					switch (svgitem.type) {
						case "rectangle":
							// [[ height, x], [ y, width]]
							var bounds = [[ Math.round(450-(factor*svgitem.y*height)), Math.round(svgitem.x*factor*width)], [ Math.round(450-((svgitem.y+svgitem.height)*factor*height)), Math.round((svgitem.x+svgitem.width)*factor*width)]];
							return L.rectangle(bounds, {transform: true, id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
						case "polygon":
							var points = new Array();
							$(svgitem.points).each(function(index,point) {
								var lat = 450-(point[1]*factor*height);
								var lng = point[0]*factor*width;
								points.push([lat,lng]);
							});
							return L.polygon(points, {transform: true, id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
						case "line":
							var points = new Array();
							$(svgitem.points).each(function(index,point) {
								var lat = 450-(point[1]*factor*height);
								var lng = point[0]*factor*width;
								points.push([lat,lng]);
							});
							return L.polyline(points, {id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
						case "circle":
							var lat = 450-(svgitem.y*factor*height);
							var lng = svgitem.x*factor*width;
							var radius = svgitem.radius * factor;

							return L.circle([lat,lng], radius, {id: id, draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
					}
				}
				
				_syncToModel() {
					console.log("TCL: Annotation -> _syncToModel -> _syncToModel()");
					let jsonData = { keyframes: [] };
					this.model.sequenceStartTime = this._startTime*1000.0;
					this.model.sequenceEndTime = this._endTime*1000.0;
					this.model.layerVisual = this._layerVisual;

					var factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height; // TODO get from videobounds
					var width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
					var height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
					this.model.selectorSvgs[0].colorRgba = this.svg.color + ("00" + this._opacity.toString(16)).substr(-2).toUpperCase();
					this.model.selectorSvgs[0].strokeWidth = this.svg.strokeWidth > 0 ? 1 : 0;
					
					this.svg.keyframes[0].time = 0;
					for (let keyframe of this.svg.keyframes) {
						keyframe.saveChanges();
						jsonData.keyframes.push(keyframe.model);
						
					}
					this.model.selectorSvgs[0].svgData = JSON.stringify(jsonData);
				}
				
			}
	
}, window));
