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
					this.model = model;
					this.svg = Object();
					this.svg.items = Array();
					this.svg.strokeWidth = this.model.selectorSvgs[0].strokeWidth ? 2 : 0;
					this.svg.color = this.model.selectorSvgs[0].colorRgba.substring(0,6);
					this._opacity = parseInt(this.model.selectorSvgs[0].colorRgba.substring(6,8), 16)/255;
					this.svg.model = JSON.parse(this.model.selectorSvgs[0].svgData);
					this.svg.layer = L.layerGroup(null, {data:'annotationlayer', "annotation":this});

					this._startTime = this.model.sequenceStartTime/1000.0;
					this._endTime = this.model.sequenceEndTime/1000.0;
					this._layerVisual = this.model.layerVisual;
					
					
					// create and style list view element
					this.listView = $('<li class="list-group-item" style="padding:0"> \
							    <div class="timaat-annotation-status-marker" style="float: left;line-height: 300%;margin-right: 5px;">&nbsp;</div> \
						 		<i class="timaat-annotation-list-type fas fa-image fa-fw" aria-hidden="true"></i><span class="timaat-annotation-list-time"></span> \
								<span class="text-nowrap timaat-annotation-list-categories float-right text-muted"><i class=""></i></span><br> \
								<div class="timaat-annotation-list-title text-muted float-left"></div> \
								<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
							</li>'
					);
					console.log("TCL: Annotation -> constructor -> this.updateUI()");

					this.updateUI();
					
					var anno = this; // save annotation for events

					$('#timaat-annotation-list').append(this.listView);
					this.listView.find('.timaat-annotation-list-categories').popover({
						placement: 'right',
						title: 'Categories bearbeiten',
						trigger: 'click',
						html: true,
						content: '<div class="input-group ui-front"><input class="form-control timaat-category-input" type="text" value=""></div>',
						container: 'body',
						boundary: 'viewport',
						
					});
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
								'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+anno.model.createdByUserAccount.id+'">[ID '+anno.model.createdByUserAccount.id+']</span></b><br>\
								 '+TIMAAT.Util.formatDate(anno.model.createdAt)+'<br>\
								 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+anno.model.lastEditedByUserAccount.id+'">[ID '+anno.model.lastEditedByUserAccount.id+']</span></b><br>\
								 '+TIMAAT.Util.formatDate(anno.model.lastEditedAt)+'<br>'
						);
						$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
					});
					
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
						$(TIMAAT.CategoryLists.categorysets).each(function(index, categoryset) {
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
					    		TIMAAT.CategoryService.addCategory(anno, category, function(newcategory) {
										anno.model.categories.push(newcategory);
										console.log("TCL: Annotation -> constructor -> anno.updateUI()");
		                anno.updateUI();                
					    		});
					    	},
					    	onRemoveCategory: function(categoryinput,category) {
					    		TIMAAT.CategoryService.removeCategory(anno, category, function(categoryname) {
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
					this.listView.find('.timaat-annotation-list-categories').dblclick(function(ev) {ev.stopPropagation();});

					// attach user log info
					this.listView.find('.timaat-user-log').click(function(ev) {
						ev.preventDefault();
						ev.stopPropagation();
					});
					
					// convert SVG data
					var anno = this;
					this.svg.model.forEach(function(svgitem) {
						var item = anno._parseSVG(svgitem);
						anno.addSVGItem(item);
						item.dragging.disable();
					});
					
					// attach event handlers
					$(this.listView).click(this, function(ev) {
						TIMAAT.VideoPlayer.jumpVisible(ev.data.startTime, ev.data.endTime);
						TIMAAT.VideoPlayer.selectAnnotation(ev.data);
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
		  };
		  
		  get endTime() {
			  return this._endTime;
		  }
			
		  set endTime(endTime) {
			  this._endTime = Math.min(endTime, TIMAAT.VideoPlayer.duration);
			  this._endTime = Math.max(this._startTime, this._endTime);
			  if ( this._endTime != this.model.endTime ) {this.setChanged();TIMAAT.VideoPlayer.updateUI();}
		  };	

		  hasPolygons() {
			  return this.svg.items.length > 0;
		  }
				
				updateUI() {
					console.log("TCL: Annotation -> updateUI -> updateUI()");
					this.listView.attr('data-starttime', this.model.sequenceStartTime);
					this.listView.find('.timaat-annotation-list-type').css('color', '#'+this.svg.color);
					var timeString = " "+TIMAAT.Util.formatTime(this.model.sequenceStartTime/1000.0, true);
					if ( this.model.sequenceStartTime != this.model.sequenceEndTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.sequenceEndTime/1000.0, true);
					this.listView.find('.timaat-annotation-list-time').html(timeString);
					this.listView.find('.timaat-annotation-list-title').html(this.model.title);
					// categories
					this.listView.find('.timaat-annotation-list-categories i').attr('title', this.model.categories.length+" Categories");			
					if (this.model.categories.length == 0) this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-category timaat-no-categories');
					else if (this.model.categories.length == 1) this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-category text-dark').attr('title', "ein Category");
					else this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-categories text-dark');
					// type
					this._updateAnnotationType();
					
					// update svg
					var anno = this;
					this.svg.items.forEach(function(item) {
					        item.setStyle({color:'#'+anno.svg.color, weight: anno.svg.strokeWidth, fillOpacity: anno.opacity});
					});
					
					// update marker
					if ( this.marker ) this.marker.updateView();
				}

				_updateAnnotationType() {
					this.listView.find('.timaat-annotation-list-type').removeClass('fa-image');
					this.listView.find('.timaat-annotation-list-type').removeClass('fa-draw-polygon');
					this.listView.find('.timaat-annotation-list-type').removeClass('fa-headphones');
					if ( this.layerVisual == 0 ) {
						this.listView.find('.timaat-annotation-list-type').addClass('fa-headphones');
					} else {
						if ( this.svg.items.length > 0 ) this.listView.find('.timaat-annotation-list-type').addClass('fa-draw-polygon');
						else this.listView.find('.timaat-annotation-list-type').addClass('fa-image');
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
					this.svg.items.push(item);
					this.svg.layer.addLayer(item);
					
					this.changed = true;

					// update UI
					this._updateAnnotationType();
					if ( this.marker ) this.marker.updateView();
					
					// attach item event handlers
					var anno = this;
					item.on('click', function(ev) {
						TIMAAT.VideoPlayer.selectAnnotation(anno);
						// delete annotation if user presses alt
						if ( ev.originalEvent.altKey ) {
							anno.removeSVGItem(ev.target);
						  TIMAAT.VideoPlayer.updateUI();
						  console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");
						}
						
					});
					item.on('dragstart', function(ev) {anno.setChanged();TIMAAT.VideoPlayer.updateUI();});
					console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");
					item.on('dragend', function(ev) {anno.setChanged;TIMAAT.VideoPlayer.updateUI();});
					console.log("TCL: Annotation -> addSVGItem -> TIMAAT.VideoPlayer.updateUI()");

				}
						
				removeSVGItem (item) {
					console.log("TCL: Annotation -> removeSVGItem -> item", item);
					if ( !item || !this.svg.items.includes(item) ) return;
					this.svg.layer.removeLayer(item);
					var index = this.svg.items.indexOf(item);
					if (index > -1) this.svg.items.splice(index, 1);
					
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

 					var anno = this;
					this.svg.model = JSON.parse(this.model.selectorSvgs[0].svgData);
					this.svg.model.forEach(function(svgitem) {
						var item = anno._parseSVG(svgitem);
						anno.addSVGItem(item);
					});
					
					// update UI
					this.changed = false;
					this.updateUI();

				}
				
				saveChanges() {
					console.log("TCL: Annotation -> saveChanges -> saveChanges()");
					this._syncToModel();
					this.changed = false;
				}

				updateStatus(time) {
//					console.log("TCL: Annotation -> updateStatus -> time", time);
					var active = false;
					if ( time >= this.startTime && time <= this.endTime ) active = true;
					this.setActive(active);
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
						
						if ( this.selected ) {

						} else {
							map.annoLayer.addLayer(this.svg.layer);
						}
						
						// scroll list
						this._scrollIntoView(this.listView);
						
					} else {
						this.listView.find('.timaat-annotation-status-marker').removeClass('bg-success');
						
						if ( this.selected ) {

						} else {
							map.annoLayer.removeLayer(this.svg.layer);
						}
//						if ( !this.isSelected() ) map.editTools.editLayer.removeLayer(this.svg.layer);

					}
				}
						
				setSelected(selected) {
					if (this._destroyed) return;
//					console.log("TCL: Annotation -> setSelected -> selected", selected);
					if ( this.selected == selected ) return;			
					this.selected = selected;
					if ( selected ) {

						this.listView.addClass('timaat-annotation-list-selected');

						map.annoLayer.removeLayer(this.svg.layer);
						map.editTools.editLayer.addLayer(this.svg.layer);
						this.svg.items.forEach(function(item) {
							item.dragging._draggable = null;
							item.dragging.addHooks();
							item.enableEdit();
						});
						
					}
					else {
						this.discardChanges();
						this.listView.removeClass('timaat-annotation-list-selected');
						
						map.editTools.editLayer.removeLayer(this.svg.layer);
						if ( this.active ) map.annoLayer.addLayer(this.svg.layer);
						
						this.svg.items.forEach(function(item) {
							item.dragging.disable();
							item.disableEdit();
						});

					}
					// update marker
					if ( this.marker ) this.marker.updateView();
				}

				isSelected() {
//					console.log("TCL: Annotation -> isSelected -> isSelected()");
					return this.selected;
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
					var factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height;
					var width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
					var height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
					switch (svgitem.type) {
						case "rectangle":
							// [[ height, x], [ y, width]]
							var bounds = [[ Math.round(450-(factor*svgitem.y*height)), Math.round(svgitem.x*factor*width)], [ Math.round(450-((svgitem.y+svgitem.height)*factor*height)), Math.round((svgitem.x+svgitem.width)*factor*width)]];
							return L.rectangle(bounds, {draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
						case "polygon":
							var points = new Array();
							$(svgitem.points).each(function(index,point) {
								var lat = 450-(point[1]*factor*height);
								var lng = point[0]*factor*width;
								points.push([lat,lng]);
							});
							return L.polygon(points, {draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
						case "line":
							var points = new Array();
							$(svgitem.points).each(function(index,point) {
								var lat = 450-(point[1]*factor*height);
								var lng = point[0]*factor*width;
								points.push([lat,lng]);
							});
							return L.polyline(points, {draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
						case "circle":
							var lat = 450-(svgitem.y*factor*height);
							var lng = svgitem.x*factor*width;
							var radius = svgitem.radius * factor;

							return L.circle([lat,lng], radius, {draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
					}
				}
				
				_syncToModel() {
					console.log("TCL: Annotation -> _syncToModel -> _syncToModel()");
					var jsonData = [];
					this.model.sequenceStartTime = this._startTime*1000.0;
					this.model.sequenceEndTime = this._endTime*1000.0;
					this.model.layerVisual = this._layerVisual;

					var factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height; // TODO get from videobounds
					var width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
					var height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
					this.model.selectorSvgs[0].colorRgba = this.svg.color + ("00" + this._opacity.toString(16)).substr(-2).toUpperCase();
					this.model.selectorSvgs[0].strokeWidth = this.svg.strokeWidth > 0 ? 1 : 0;

					this.svg.items.forEach(function(item) {
						if ( item instanceof L.Rectangle ) {
							var jsonItem = {
								type: 'rectangle',
								x: parseFloat( (Math.abs(item.getBounds().getWest()/factor) / width).toFixed(5) ),
								y: parseFloat( (Math.abs((450-item.getBounds().getNorth())/factor) / height).toFixed(5) ),
								width: parseFloat( (Math.abs((item.getBounds().getEast()-item.getBounds().getWest())/factor) / width).toFixed(5) ),
								height: parseFloat( (Math.abs((item.getBounds().getNorth()-item.getBounds().getSouth())/factor) / height).toFixed(5) ),
							}
							// sanitize data
							jsonItem.x = Math.max(0.0, Math.min(1.0,jsonItem.x));
							jsonItem.y = Math.max(0.0, Math.min(1.0,jsonItem.y));
							if ( jsonItem.width > 0 && jsonItem.height > 0 ) jsonData.push(jsonItem);
						} else if ( item instanceof L.Polygon ) {
							var jsonItem = {
									type: 'polygon',
									points: []
							}
							$(item.getLatLngs()[0]).each(function(index,point) {
								var x = parseFloat( Math.abs(point.lng/width/factor).toFixed(5) );
								var y = parseFloat( Math.abs((450-point.lat)/factor/height).toFixed(5) );
								// sanitize data
								x = Math.max(0.0, Math.min(1.0,x));
								y = Math.max(0.0, Math.min(1.0,y));
								jsonItem.points.push([x,y]);
							});
							jsonData.push(jsonItem);
						} else if ( item instanceof L.Polyline ) {
							var jsonItem = {
									type: 'line',
									points: []
							}
							$(item.getLatLngs()).each(function(index,point) {
								var x = parseFloat( Math.abs(point.lng/width/factor).toFixed(5) );
								var y = parseFloat( Math.abs((450-point.lat)/factor/height).toFixed(5) );
								// sanitize data
								x = Math.max(0.0, Math.min(1.0,x));
								y = Math.max(0.0, Math.min(1.0,y));
								jsonItem.points.push([x,y]);
							});
							jsonData.push(jsonItem);
						} else if ( item instanceof L.Circle ) {
							var jsonItem = {
									type: 'circle',
									x: parseFloat( (Math.abs(item.getLatLng().lng/factor) / width).toFixed(5) ),
									y: parseFloat( (Math.abs((450-item.getLatLng().lat)/factor) / height).toFixed(5) ),
									radius: parseFloat( (Math.abs(item.getRadius()/factor) ).toFixed(5) ),
								}
								// sanitize data
								jsonItem.x = Math.max(0.0, Math.min(1.0,jsonItem.x));
								jsonItem.y = Math.max(0.0, Math.min(1.0,jsonItem.y));
								jsonItem.radius = Math.max(5.0, jsonItem.radius);
								
								jsonData.push(jsonItem);
							} 
						
					});
					this.model.selectorSvgs[0].svgData = JSON.stringify(jsonData);
				}
				
			}
	
}, window));
