function allocateArray(strOrArr) {
	var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr : Module.intArrayFromString(strOrArr);
	return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
}

const TIMAAT = {
	Marker: class Marker {
	  constructor(annotation) {
      console.log("TCL: Marker -> constructor -> annotation", annotation);
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
      console.log("TCL: Marker -> getfrom -> from()");
		return this._from;
		}
		
	  set from(from) {
			console.log("TCL: Marker -> setfrom -> from", from);
		  this._from = Math.min(from, TIMAAT.VideoPlayer.duration);
		  this._to = Math.max(from, this._to);
		  this._updateElementOffset();
	  };
	  
	  get to() {
   		console.log("TCL: Marker -> getto -> to()");
		  return this.to;
		}
		
	  set to(to) {
   		console.log("TCL: Marker -> setto -> to", to);
		  this._from = Math.min(this._from, TIMAAT.VideoPlayer.duration);
		  this._to = Math.max(this._from, to);
		  this._updateElementOffset();
		};	
		  
	  setRange(from, to) {
		console.log("TCL: Marker -> setRange -> from", from);
		console.log("TCL: Marker -> setRange -> to", to);
		  this._from = Math.min(from, TIMAAT.VideoPlayer.duration);
		  this._to = Math.max(from, to);
		  this._updateElementOffset();
	  }
	  
	  get color() {
   		console.log("TCL: Marker -> getcolor -> color()");
		  return this._color;
	  }
	  
	  remove() {
      console.log("TCL: Marker -> remove -> remove()");
		  this.element.remove();
	  }
	  
	  updateView() {
      console.log("TCL: Marker -> updateView -> updateView()");
		  this._from = this.parent.model.startTime;
		  this._to = this.parent.model.endTime;
		  this._color = '#'+this.parent.svg.color;
		  this._updateElementColor();
		  this._updateElementOffset();
	  }

	  _updateElementColor() {
      console.log("TCL: Marker -> _updateElementColor -> _updateElementColor()");
      this.element.css('background-color', this.hexToRgbA (this._color, 0.3));
	    this.element.css('border-left-color', this._color);
	    this.element.find('.timaat-timeline-markerhead').css('background-color', this._color);	  	
	  }
	  
	  _updateElementOffset() {
      console.log("TCL: Marker -> _updateElementOffset -> _updateElementOffset()");
		  var magicoffset = 1; // TODO replace input slider

		  var width =  $('#timaat-video-seek-bar').width();
		  var length = (this._to - this._from) / TIMAAT.VideoPlayer.duration * width;
		  var offset = this._from / TIMAAT.VideoPlayer.duration * width;
		  this.element.css('width', length+'px');
		  this.element.css('margin-left', (offset+magicoffset)+'px');
	  }
	  
	  hexToRgbA(hex, opacity) {
      console.log("TCL: Marker -> hexToRgbA -> hex", hex);
      console.log("TCL: Marker -> hexToRgbA -> opacity", opacity);
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
	  
	},	
	
	// ------------------------------------------------------------------------------------------------------------------------
	
	Annotation: class Annotation {
		constructor(model) {
      console.log("TCL: Annotation -> constructor -> model", model);
			// setup model
			this.active = false;
			this.model = model;
			this.marker = new TIMAAT.Marker(this);
			this.svg = Object();
			this.svg.items = Array();
			this.svg.strokeWidth = this.model.svg[0].strokeWidth;
			this.svg.color = this.model.svg[0].color;
			this.svg.model = JSON.parse(this.model.svg[0].svgData);
			this.svg.layer = L.layerGroup(null, {data:'annotationlayer'});
			
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
			});
			
			// attach event handlers
			$(this.listView).click(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(ev.data.model.startTime, ev.data.model.endTime);
				TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				TIMAAT.VideoPlayer.pause();
			});
			$(this.listView).dblclick(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(ev.data.model.startTime, ev.data.model.endTime);
				TIMAAT.VideoPlayer.selectAnnotation(ev.data);
				TIMAAT.VideoPlayer.pause();
				$('#timaat-videoplayer-annotation-meta').data('annotation', anno);
				$('#timaat-videoplayer-annotation-meta').modal('show');
			});
			
			this.changed = false;

		}
		
		updateUI() {
      console.log("TCL: Annotation -> updateUI -> updateUI()");
			this.listView.attr('data-starttime', this.model.startTime);
			this.listView.find('.timaat-annotation-list-type').css('color', '#'+this.svg.color);
			var timeString = " "+TIMAAT.Util.formatTime(this.model.startTime, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime, true);
			this.listView.find('.timaat-annotation-list-time').html(timeString);
			this.listView.find('.timaat-annotation-list-title').html(this.model.title);
			// categories
			this.listView.find('.timaat-annotation-list-categories i').attr('title', this.model.categories.length+" Categories");			
			if (this.model.categories.length == 0) this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-category timaat-no-categories');
			else if (this.model.categories.length == 1) this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-category text-dark').attr('title', "ein Category");
			else this.listView.find('.timaat-annotation-list-categories i').attr('class','fas fa-categories text-dark');
			
			// update svg
			var anno = this;
			this.svg.items.forEach(function(item) {
			        item.setStyle({color:'#'+anno.svg.color, weight: anno.svg.strokeWidth, fillOpacity: 0.2});
			});
			
			// update marker
			if ( this.marker ) this.marker.updateView();
		}
		
		remove() {
      console.log("TCL: Annotation -> remove -> remove()");
			// remove annotation from UI
			this.listView.remove();
			map.removeLayer(this.svg.layer);
			this.marker.remove();
		}
		
		addSVGItem (item) {
      console.log("TCL: Annotation -> addSVGItem -> item", item);
			if ( !item || this.svg.items.includes(item) ) return;
			this.svg.items.push(item);
			this.svg.layer.addLayer(item);
			
			this.changed = true;

			// update UI
			this.listView.find('.timaat-annotation-list-type').removeClass('fa-image');
			this.listView.find('.timaat-annotation-list-type').addClass('fa-draw-polygon');
			
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
				this.listView.find('.timaat-annotation-list-type').removeClass('fa-draw-polygon');
				this.listView.find('.timaat-annotation-list-type').addClass('fa-image');
			}
		}
		
		setChanged() {
      console.log("TCL: Annotation -> setChanged -> setChanged()");
			this.changed = true;
		}
		
		hasChanges() {
      console.log("TCL: Annotation -> hasChanges -> hasChanges()");
			return this.changed;
		}

		
		getModel() {
      console.log("TCL: Annotation -> getModel -> getModel()");
			return this.model;
		}
		
		discardChanges() {
      console.log("TCL: Annotation -> discardChanges -> discardChanges()");
			if ( !this.changed ) return;
			this.svg.layer.clearLayers();
			this.svg.items = Array();
			
			var anno = this;
			this.svg.model = JSON.parse(this.model.svg[0].svgData);
			this.svg.model.forEach(function(svgitem) {
				var item = anno._parseSVG(svgitem);
				anno.addSVGItem(item);
			});
			
			// update UI
			if ( this.svg.items.length == 0 ) {
				this.listView.find('.timaat-annotation-list-type').removeClass('fa-draw-polygon');
				this.listView.find('.timaat-annotation-list-type').addClass('fa-image');
			} else {
				this.listView.find('.timaat-annotation-list-type').removeClass('fa-image');
				this.listView.find('.timaat-annotation-list-type').addClass('fa-draw-polygon');
			}
			
			this.changed = false;

		}
		
		saveChanges() {
      console.log("TCL: Annotation -> saveChanges -> saveChanges()");
			this._syncToModel();
			this.changed = false;
		}

		updateStatus(time) {
      console.log("TCL: Annotation -> updateStatus -> time", time);
			var active = false;
			if ( time >= this.model.startTime && time <= this.model.endTime ) active = true;
			this.setActive(active);
		}
		
		isActive() {
      console.log("TCL: Annotation -> isActive -> isActive()");
			return this.active;
		}
		
		setActive(active) {
      console.log("TCL: Annotation -> setActive -> active", active);
			if ( this.active == active ) return;
			this.active = active;
			if ( active ) {
				this.listView.find('.timaat-annotation-status-marker').addClass('bg-success');
				map.editTools.editLayer.addLayer(this.svg.layer);
				this.svg.items.forEach(function(item) {
					item.dragging._draggable = null;
					item.dragging.addHooks();
				});
				// scroll list
				this._scrollIntoView(this.listView);
				
			} else {
				this.discardChanges();
				this.listView.find('.timaat-annotation-status-marker').removeClass('bg-success');
				map.editTools.editLayer.removeLayer(this.svg.layer);
			}
		}
				
		setSelected(selected) {
      console.log("TCL: Annotation -> setSelected -> selected", selected);
			if ( this.selected == selected ) return;			
			this.selected = selected;
			if ( selected ) {
				this.listView.addClass('timaat-annotation-list-selected');
			}
			else this.listView.removeClass('timaat-annotation-list-selected');
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
			}
		}
		
		_syncToModel() {
      console.log("TCL: Annotation -> _syncToModel -> _syncToModel()");
			var jsonData = [];
			var factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height; // TODO get from videobounds
			var width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
			var height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
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
				} 
				
			});
			this.model.svg[0].svgData = JSON.stringify(jsonData);
		}
		
	},
	
	// ------------------------------------------------------------------------------------------------------------------------
	
	CategorySet: class CategorySet {
		constructor(model) {
      // console.log("TCL: CategorySet -> constructor -> model", model);
			// setup model
			this.model = model;
			model.ui = this;
			
			// create and style list view element
			var delcategoryset = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-categoryset-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) delcategoryset = '';
			this.listView = $('<li class="list-group-item"> '
					+ delcategoryset +
					'<span class="timaat-categoryset-list-title"></span>' +
					'<span class="text-nowrap timaat-categoryset-list-categories float-right text-muted"><i class=""></i></span><br> \
					<div class="timaat-categoryset-list-count text-muted float-left"></div> \
					<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user-disabled"></i></div> \
				</li>'
		);

			$('#timaat-categoryset-list').append(this.listView);
			// console.log("TCL: CategorySet -> constructor -> this.updateUI()");
			this.updateUI();      
			
			var categoryset = this; // save categoryset for events
			
			this.listView.find('.timaat-categoryset-list-categories').popover({
				placement: 'right',
				title: 'Categories bearbeiten',
				trigger: 'manual',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-category-input" type="text" value=""></div>',
				container: 'body',
				boundary: 'viewport',				
			});
			// attach user log info
			// this.listView.find('.timaat-user-log').popover({
			// 	placement: 'right',
			// 	title: '<i class="fas fa-user"></i> Bearbeitungslog',
			// 	trigger: 'click',
			// 	html: true,
			// 	content: '<div class="timaat-user-log-details">Lade...</div>',
			// 	container: 'body',
			// 	boundary: 'viewport',				
			// });
			// this.listView.find('.timaat-user-log').on('show.bs.popover', function () {
			// 	TIMAAT.UI.hidePopups();
			// });
			// this.listView.find('.timaat-user-log').on('inserted.bs.popover', function () {
			// 	$('.timaat-user-log-details').html(
			// 			'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+categoryset.model.createdByUserAccount.id+'">[ID '+categoryset.model.createdByUserAccount.id+']</span></b><br>\
			// 			 '+TIMAAT.Util.formatDate(categoryset.model.createdAt)+'<br>\
			// 			 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+categoryset.model.lastEditedByUserAccount.id+'">[ID '+categoryset.model.lastEditedByUserAccount.id+']</span></b><br>\
			// 			 '+TIMAAT.Util.formatDate(categoryset.model.lastEditedAt)+'<br>'
			// 	);
			// 	$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			// });
			// attach category editor
			this.listView.find('.timaat-categoryset-list-categories').on('inserted.bs.popover', function () {
				var categories = "";
				categoryset.model.categories.forEach(function(item) { categories += ','+item.name });
				categories = categories.substring(1);
				$('.timaat-category-input').val(categories);
			    $('.timaat-category-input').categoriesInput({
			    	placeholder: 'Category hinzufügen',
			    	onAddCategory: function(categoryinput,category) {
			    		TIMAAT.Service.addCategory(categoryset, category, function(newcategory) {
							categoryset.model.categories.push(newcategory);
								console.log("TCL: CategorySet -> constructor -> categoryset.updateUI() - onAddCategory");
			    			categoryset.updateUI();                
			    		});

			    	},
			    	onRemoveCategory: function(categoryinput,category) {
			    		TIMAAT.Service.removeCategory(categoryset, category, function(categoryname) {
			    			// find category in model
			    			var found = -1;
			    			categoryset.model.categories.forEach(function(item, index) {
			    				if ( item.name == categoryname ) found = index;
			    			});
							if (found > -1) categoryset.model.categories.splice(found, 1);
								console.log("TCL: CategorySet -> constructor -> categoryset.updateUI() - onRemoveCategory");
			    			categoryset.updateUI();                
			    		});

			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_category').focus();
			    	}
			    });
			});
			// console.log("TCL: CategorySet -> constructor -> categoryset.updateUI()");
			this.listView.find('.timaat-categoryset-list-categories').on('hidden.bs.popover', function () { categoryset.updateUI(); });
			this.listView.find('.timaat-categoryset-list-categories').dblclick(function(ev) {ev.stopPropagation();});

			// // attach user log info
			// this.listView.find('.timaat-user-log').click(function(ev) {
			// 	ev.preventDefault();
			// 	ev.stopPropagation();
			// });
			
			// attach event handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show category editor - trigger popup
				TIMAAT.UI.hidePopups();				
				categoryset.listView.find('.timaat-categoryset-list-categories').popover('show');
			});
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-settings-categoryset-meta').data('categoryset', categoryset);
				$('#timaat-settings-categoryset-meta').modal('show');			
			});
			
			// remove handler
			this.listView.find('.timaat-categoryset-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-settings-categoryset-delete').data('categoryset', categoryset);
				$('#timaat-settings-categoryset-delete').modal('show');
			});

		}
		
		updateUI() {
      // console.log("TCL: CategorySet -> updateUI -> updateUI()");
			// title
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-categoryset-list-title').text(name);
			// tag count
			var count = this.model.tags.length + " Tags";
			if ( this.model.tags.length == 0 ) count = "keine Tags";
			if ( this.model.tags.length == 1 ) count = "ein Tag";
			this.listView.find('.timaat-categoryset-list-count').text(count);
			// tags
			this.listView.find('.timaat-categoryset-list-tags i').attr('title', this.model.tags.length+" Tags");			
			if (this.model.tags.length == 0) this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			else if (this.model.tags.length == 1) this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			else this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tags text-dark');
		}
		
		remove() {
      console.log("TCL: CategorySet -> remove -> remove()");
			// remove annotation from UI
			this.listView.remove();
			
			// remove from categoryset list
			var index = TIMAAT.Settings.categorysets.indexOf(this);
			if (index > -1) TIMAAT.Settings.categorysets.splice(index, 1);

			// remove from model list
			index = TIMAAT.Settings.categorysets.model.indexOf(this);
			if (index > -1) TIMAAT.Settings.categorysets.model.splice(index, 1);

		}
		
	},	
	
	// ------------------------------------------------------------------------------------------------------------------------
	
	AnalysisSegment: class AnalysisSegment {
		constructor(model) {
      console.log("TCL: AnalysisSegment -> constructor -> model", model);
			// setup model
			this.model = model;
			this.active = false;
			
			// create and style list view element
			this.listView = $('<li class="list-group-item timaat-annotation-list-segment" style="padding:0"> \
						<div class="timaat-annotation-segment-title text-white font-weight-bold"></div> \
					</li>'
			);
			this.timelineView = $('<div class="timaat-timeline-segment"> \
					<div class="timaat-timeline-segment-title text-white font-weight-bold"></div> \
					</div>'
			);
			
			
			var segment = this; // save annotation for events

			

		}
		
		updateUI() {
      console.log("TCL: AnalysisSegment -> updateUI -> updateUI()");
			this.listView.attr('data-starttime', this.model.startTime);
			var timeString = " "+TIMAAT.Util.formatTime(this.model.startTime, true);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime, true);
			this.listView.find('.timaat-annotation-segment-title').html(this.model.name);
			this.timelineView.find('.timaat-timeline-segment-title ').html(this.model.name);

			// update timeline position
			var magicoffset = 1; // TODO replace input slider
			var width =  $('#timaat-video-seek-bar').width();
			var length = (this.model.endTime - this.model.startTime) / TIMAAT.VideoPlayer.duration * width;
			var offset = this.model.startTime / TIMAAT.VideoPlayer.duration * width;
			this.timelineView.css('width', length+'px');
			this.timelineView.css('margin-left', (offset+magicoffset)+'px');

		}
		
		addUI() {
      console.log("TCL: AnalysisSegment -> addUI -> addUI()");
			$('#timaat-annotation-list').append(this.listView);
			$('#timaat-timeline-segment-pane').append(this.timelineView);

			var segment = this; // save annotation for events
			// attach event handlers
			this.listView.click(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
				TIMAAT.VideoPlayer.pause();
			});
			this.timelineView.click(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
				TIMAAT.VideoPlayer.pause();
			});
			this.listView.dblclick(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
				TIMAAT.VideoPlayer.pause();
				$('#timaat-videoplayer-segment-meta').data('segment', segment);
				$('#timaat-videoplayer-segment-meta').modal('show');
			});
			this.timelineView.dblclick(this, function(ev) {
				TIMAAT.VideoPlayer.jumpVisible(segment.model.startTime, segment.model.endTime);
				TIMAAT.VideoPlayer.pause();
				$('#timaat-videoplayer-segment-meta').data('segment', segment);
				$('#timaat-videoplayer-segment-meta').modal('show');
			});
			console.log("TCL: AnalysisSegment -> addUI -> this.updateUI()");
			this.updateUI();
		}
		
		removeUI() {
      console.log("TCL: AnalysisSegment -> removeUI -> removeUI()");
			this.listView.remove();
			this.timelineView.remove();
			console.log("TCL: AnalysisSegment -> removeUI -> this.updateUI()");
			this.updateUI();      
		}
			
		updateStatus(time) {
      console.log("TCL: AnalysisSegment -> updateStatus -> time", time);
			var status = false;
			if ( time >= this.model.startTime && time <= this.model.endTime) status = true;

			if ( status != this.active ) {
				this.active = status;
				if ( this.active ) this.timelineView.addClass('bg-info');
				else this.timelineView.removeClass('bg-info');
			}				
		}

	},
	
	// ------------------------------------------------------------------------------------------------------------------------
	
	VideoChooser: {
		
		videos: null,
	
		init: function() {
    	// console.log("TCL: VideoChooser: init: function()");
			// setup video chooser list and UI events

		},
		
		loadVideos: function() {
    	// console.log("TCL: loadVideos: function()");
			TIMAAT.Service.listVideos(TIMAAT.VideoChooser.setVideoList);
		},
		
		updateVideoStatus: function(video) {
    	console.log("TCL: updateVideoStatus: function(video)");
    // console.log("TCL: video", video);
			video.poll = window.setInterval(function() {
				jQuery.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+video.mediumId+'/status',
					type:"GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					video.status = data;
					if (data == 'unavailable' || data == 'ready') {
						window.clearInterval(video.poll);
						// TODO handle unavailable video error
						if ( data == 'unavailable' ) video.ui.find('.timaat-video-transcoding').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
						if ( data == 'ready' ) video.ui.find('.timaat-video-transcoding').hide();
					}
				})
				.fail(function(e) {
					// TODO handle error
					window.clearInterval(video.poll);
					video.ui.find('.timaat-video-transcoding').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
					console.log( "error", e );
				});

			}, 1000);
			
		},
		
		setVideoList: function(videos) {
    	// console.log("TCL: setVideoList: function(videos)");
    	console.log("TCL: VIDEOCHOOSER: setVideoList -> videos", videos);
			if ( !videos ) return;
			
			// clear video UI list
			$('#timaat-video-list').empty();
			
			// setup upload dropzone UI and events
			this.uploadItem = $('<div class="card timaat-video-card timaat-video-upload-card"><div id="timaat-video-upload"></div> \
												<img class="card-img-top" src="img/video-upload.png" alt="Video Upload" /> \
												<div class="card-footer text-center title">Videodatei hochladen</div> \
												</div>');
			this.uploadItem.appendTo('#timaat-video-list');
			TIMAAT.VideoChooser.uploadZone = new Dropzone("#timaat-video-upload", {
				url: "/TIMAAT/api/medium/upload",
				createImageThumbnails: false,
				acceptedFiles: 'video/mp4',
				maxFilesize: 1024,
				timeout: 60*60*1000, // 1 hour
				maxFiles: 1,
				headers: {'Authorization': 'Bearer '+TIMAAT.Service.token},
				previewTemplate: '<div class="dz-preview dz-file-preview" style="margin-top:136px"> \
					<div class="progress" style="height: 24px;"> \
					  	<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress><span data-dz-name></span></div> \
						</div> \
					</div>',
			});
			
			TIMAAT.VideoChooser.uploadZone.on("complete", function(file) {
				if ( file.status == "success" && file.accepted ) {
					var video = JSON.parse(file.xhr.response);
					TIMAAT.VideoChooser.videos.push(video);
					TIMAAT.VideoChooser._addVideo(video);
				}
				TIMAAT.VideoChooser.uploadZone.removeFile(file);
			});
			
			
			TIMAAT.VideoChooser.videos = videos;
			videos.forEach(function(video) {
				TIMAAT.VideoChooser._addVideo(video);
			});
		},
		
		_addVideo: function(video) {
    	// console.log("TCL: _addVideo: function(video)");
    	console.log("TCL: video", video);
			var videoelement = $('<div class="card timaat-video-card"> <div class="timaat-video-transcoding"><i class="fas fa-cog fa-spin"></i> Transcodiere...</div> \
				  	<img class="card-img-top timmat-video-thumbnail" src="img/video-placeholder.png" alt="Video Platzhalter"> \
				  	<div class="text-right text-white duration">00:00</div> \
				  	<div class="card-footer text-left title">/div> \
				      </div>'
			);
			videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+video.mediumId+"/thumbnail"+"?token="+video.viewToken);
			videoelement.appendTo('#timaat-video-list');
			videoelement.find('.title').html(video.title.name);
			videoelement.find('.duration').html(TIMAAT.Util.formatTime(video.mediumVideo.length));
		
			if ( video.status != 'ready' ) videoelement.find('.timaat-video-transcoding').show();
			if ( video.status == 'unavailable' ) videoelement.find('.timaat-video-transcoding').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
			
			video.ui = videoelement;
			videoelement.click(function(ev) {
				if ( video.status && video.status != 'ready' ) return;
				$('.timaat-video-card').removeClass('bg-info text-white');
				$(this).addClass('bg-info text-white');
				TIMAAT.UI.showComponent('videoplayer');

				// setup video in player
				TIMAAT.VideoPlayer.setupVideo(video);
				// load video annotations from server
				TIMAAT.Service.getAnalysisLists(video.mediumId, TIMAAT.VideoPlayer.setupAnalysisLists);
			});
			
			videoelement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
				var timecode = Math.round((ev.originalEvent.offsetX/254)*video.mediumVideo.length);
				timecode = Math.min(Math.max(0, timecode),video.mediumVideo.length);
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/"+video.mediumId+"/thumbnail"+"?time="+timecode+"&token="+video.viewToken);
			});
			videoelement.find('.card-img-top').bind("mouseleave", function(ev) {
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/"+video.mediumId+"/thumbnail"+"?token="+video.viewToken);
			});
			
			if ( video.status == "transcoding" ) TIMAAT.VideoChooser.updateVideoStatus(video);

		},
		
	},	

	// ------------------------------------------------------------------------------------------------------------------------
	
	VideoPlayer: {
		duration: 1,
		annotationList: [],
		curAnnotation: null,
		curList: null,
		curCategorySet: null,
		tagAutocomplete: [],
		markerList: [],
		overlay: null,
		UI: Object(),
		model: Object(),
		volume: 1,
		
		init: function() {
    	// console.log("TCL: VideoPlayer: init: function()");
			// init UI
			$('.timaat-videoplayer-novideo').show();
			$('.timaat-videoplayer-ui').hide();
			
			L.control.custom({
			    position: 'topleft',
			    content : '<button id="timaat-videoplayer-annotation-quickadd-button" onclick="TIMAAT.VideoPlayer.addQuickAnnotation()" type="button" class="btn btn-light">'+
			              '    <i class="fas fa-bookmark"></i>'+
			              '</button>',
			    classes : 'btn-group-vertical btn-group-sm leaflet-bar',
			    style   :
			    {
			        margin: '10px',
			        padding: '0px 0 0 0',
			        cursor: 'pointer',
			    },
			})
			.addTo(map);
			L.control.custom({
			    position: 'topleft',
			    content : '<button id="timaat-videoplayer-annotation-add-button" onclick="TIMAAT.VideoPlayer.addAnnotation()" type="button" class="btn btn-light">'+
			              '    <i class="fa fa-plus"></i>'+
			              '</button>'+
			              '<button id="timaat-videoplayer-annotation-remove-button" onclick="TIMAAT.VideoPlayer.removeAnnotation()" disabled type="button" class="btn btn-light">'+
			              '    <i class="fa fa-minus"></i>'+
			              '</button>',
			    classes : 'btn-group-vertical btn-group-sm leaflet-bar',
			    style   :
			    {
			        margin: '10px',
			        padding: '0px 0 0 0',
			        cursor: 'pointer',
			    },
			})
			.addTo(map);			
			L.EditControl = L.Control.extend({

		        options: {
		            position: 'topleft',
		            callback: null,
		            kind: '',
		            html: ''
		        },

		        onAdd: function (map) {
		            var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
		                link = L.DomUtil.create('a', '', container);

		            link.href = '#';
		            link.title = 'Erzeuge ' + this.options.kind;
		            link.innerHTML = this.options.html;
		            L.DomEvent.on(link, 'click', L.DomEvent.stop)
		                      .on(link, 'click', function () {
					      if ( !$(this._container).find('a').hasClass('leaflet-disabled') )
						      window.LAYER = this.options.callback.call(map.editTools);
		                      }, this);
		            return container;
		        }
		    });			
			TIMAAT.VideoPlayer.savePolygonCtrl = L.control.custom({
			    position: 'topleft',
			    content : '<button id="timaat-videoplayer-save-polygons-button" onclick="TIMAAT.VideoPlayer.updateAnnotations()" type="button" class="btn btn-success">'+
			              '    <i class="fa fa-save"></i>' +
			              '</button>',
			    classes : 'btn-group-vertical btn-group-sm leaflet-bar',
			    style   :
			    {
			        margin: '10px',
			        padding: '0px 0 0 0',
			        cursor: 'pointer',
			    },
			});
			TIMAAT.VideoPlayer.savePolygonCtrl.addTo(map);
			$('#timaat-videoplayer-save-polygons-button').hide();
			
			L.NewRectangleControl = L.EditControl.extend({
				type: 'rectangle',
					options: {
							position: 'topleft',
							callback: TIMAAT.VideoPlayer.createRectangle,
							kind: 'Rechteck-Annotation',
							html: '<i class="fas fa-vector-square"></i>'
					}
			});
			L.NewPolygonControl = L.EditControl.extend({
				type: 'polygon',
					options: {
							position: 'topleft',
							callback: TIMAAT.VideoPlayer.createPolygon,
							kind: 'Polygon-Annotation',
							html: '<i class="fas fa-draw-polygon"></i>'
					}
			});
			L.NewLineControl = L.EditControl.extend({
				type: 'line',
					options: {
							position: 'topleft',
							callback: TIMAAT.VideoPlayer.createLine,
							kind: 'Linien-Annotation',
							html: '<i class="fas fa-slash"></i>'
					}
			});

			var ctrl = new L.NewRectangleControl();
			map.editCtrl = new Array();
			map.editCtrl.push(ctrl);
			map.editCtrl.push(new L.NewPolygonControl());
			map.editCtrl.push(new L.NewLineControl());
			
			$(map.editCtrl).each(function(index,item) {map.addControl(item)});

			$(map.editCtrl).each(function(index,item) {$(item._container).find('a').addClass('leaflet-disabled');});
			
			map.on('editable:editing', function (e) {
					e.layer.setStyle({weight: 1, fillOpacity: 0.2});
			});
			map.on('editable:drawing:start', function(x) {
				if ( !TIMAAT.VideoPlayer.curAnnotation ) {
					try {
						map.editTools.stopDrawing();
					} catch (e) {}		    		
					return;
				}		    	
				TIMAAT.VideoPlayer.pause();		    	
				x.layer.setStyle({color: '#'+TIMAAT.VideoPlayer.curAnnotation.svg.color, weight: TIMAAT.VideoPlayer.curAnnotation.svg.strokeWidth});
			});
			map.on('editable:vertex:dragend', function(x) {
				if ( TIMAAT.VideoPlayer.curAnnotation ) {
				TIMAAT.VideoPlayer.curAnnotation.setChanged();
				console.log("TIMAAT.VideoPLayer.updateUI() - editable:vertex:dragend");
					TIMAAT.VideoPlayer.updateUI();		    		
				}
			});		    
			map.on('editable:drag', function(ev) {
				var bounds = TIMAAT.VideoPlayer.confineBounds(ev.layer.getBounds(), ev.offset.x, ev.offset.y);
				if ( ev.layer.setBounds ) ev.layer.setBounds(L.latLngBounds(bounds.getNorthEast(),bounds.getSouthWest())); else {
					// TODO refactor
					var latlngs = ev.layer.getLatLngs();
					$(latlngs[0]).each(function(item,latlng) {
						if (latlng.lng < 0 ) latlng.lng = 0;
						if (latlng.lat < 0 ) latlng.lat = 0;
						if (latlng.lng > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng ) latlng.lng = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng;
						if (latlng.lat > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat ) latlng.lat = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat;
					});
				}		   
			});
			map.on('editable:vertex:new', function (ev) {
				var latlng = ev.latlng;
				if (latlng.lng < 0 ) latlng.lng = 0;
				if (latlng.lat < 0 ) latlng.lat = 0;
				if (latlng.lng > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng ) latlng.lng = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng;
				if (latlng.lat > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat ) latlng.lat = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat;
				ev.vertex.setLatLng(latlng);		    			    	
			});		    
			map.on('editable:vertex:drag', function(ev) {
				var latlng = ev.latlng;
				if (latlng.lng < 0 ) latlng.lng = 0;
				if (latlng.lat < 0 ) latlng.lat = 0;
				if (latlng.lng > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng ) latlng.lng = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng;
				if (latlng.lat > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat ) latlng.lat = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat;
				ev.vertex.setLatLng(latlng);
			});				
			map.on('editable:drawing:end', function(x) {
				$(map.editCtrl).each(function(index,item) {$(item._container).find('a').removeClass('bg-success');});
				TIMAAT.VideoPlayer.curTool = null;
				x.layer.dragging.enable();
				map.removeLayer(x.layer);
				if ( TIMAAT.VideoPlayer.curAnnotation ) {
					TIMAAT.VideoPlayer.curAnnotation.addSVGItem(x.layer);
					TIMAAT.VideoPlayer.updateUI();
					console.log("TCL: TIMAAT.VideoPlayer.updateUI() - if ( TIMAAT.VideoPlayer.curAnnotation )");
					x.layer.dragging._draggable = null;
					x.layer.dragging.addHooks();
				}
			});			
			
			// setup keyboard video controls
			$([document.body,window.map]).keydown(function(ev) {
				if ( TIMAAT.UI.component != 'videoplayer' ) return;
				if ( ! TIMAAT.VideoPlayer.video ) return;
				if ( ev.target != document.body && ev.target != window.map ) return;
				
				var key;
				if ( ev.originalEvent.key ) key = ev.originalEvent.key;
				else key = ev.originalEvent.originalEvent.key;
				
				switch (key) {
				case " ":
					ev.preventDefault();
					$('.playbutton').click();
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
					$('#timaat-volumeicon').click();
					break;
				case "s":
					ev.preventDefault();
					$('#timaat-videoplayer-video-speed').click();
					break;
				}
			});
			
			// setup timeline preview
			var preview = $('#timaat-video-seek-bar-preview');
			preview.removeClass('show');
			preview.hide();
		    
			// setup video controls UI events
			$('.playbutton').click(function(ev) {
				ev.preventDefault();
				$(this).toggleClass('playing');
				if ( $(this).hasClass('playing') ) TIMAAT.VideoPlayer.play(); else TIMAAT.VideoPlayer.pause();
			});			
			$('.stepbckbutton').click(function(ev) {
				ev.preventDefault();
				TIMAAT.VideoPlayer.pause();
				var frameTime = 1 / 25;
				TIMAAT.VideoPlayer.jumpTo(
					Math.max(0, TIMAAT.VideoPlayer.video.currentTime - frameTime)
				);
			});
			$('.stepfwdbutton').click(function(ev) {
				ev.preventDefault();
				TIMAAT.VideoPlayer.pause();
				var frameTime = 1 / 25;
				TIMAAT.VideoPlayer.jumpTo(
					Math.min(TIMAAT.VideoPlayer.video.duration, TIMAAT.VideoPlayer.video.currentTime + frameTime)
				);
			});
			
			$('#timaat-volume-slider').on('input change', function() {
				if ( !TIMAAT.VideoPlayer.video ) return;
				TIMAAT.VideoPlayer.video.volume = $(this).val() / 100; 

				if ( TIMAAT.VideoPlayer.video.volume > 0 ) {
					$('#timaat-volumeicon').find('.volume').show();
					$('#timaat-volumeicon').find('.mute').hide();
				} else {
					$('#timaat-volumeicon').find('.volume').hide();
					$('#timaat-volumeicon').find('.mute').show();
				}
			});			
			$('#timaat-volumeicon').click(function() {
				if ( !TIMAAT.VideoPlayer.video ) return;
				if ( TIMAAT.VideoPlayer.video.volume > 0 ) {
					TIMAAT.VideoPlayer.volume = TIMAAT.VideoPlayer.video.volume;
					$('#timaat-volume-slider').val(0);
				} else {
					$('#timaat-volume-slider').val(TIMAAT.VideoPlayer.volume*100);
				}
				$('#timaat-volume-slider').change();
			});
			
			$('#timaat-videoplayer-video-speed').click(function() {
				if ( !TIMAAT.VideoPlayer.video ) return;
				var playbackSpeeds = [1,2,0.5,0.25]; // TODO move to config

				var speed = playbackSpeeds.indexOf(TIMAAT.VideoPlayer.video.playbackRate);
				if ( speed < 0 ) TIMAAT.VideoPlayer.video.playbackRate = 1;
				else {
					speed++;
					if ( speed > playbackSpeeds.length-1 ) speed = 0;
					TIMAAT.VideoPlayer.video.playbackRate = playbackSpeeds[speed];
				}
				
				// update UI
				$('#timaat-videoplayer-video-speed').text(TIMAAT.VideoPlayer.video.playbackRate+"x");
			});
			
			$('#timaat-video-seek-bar').change(function(ev) {
			  var time = TIMAAT.VideoPlayer.video.duration * (this.value / 100);
				TIMAAT.VideoPlayer.jumpTo(time);
			});
			$('#timaat-video-seek-bar').on('input', function(ev) {
			  this.style.background="linear-gradient(to right, #ed1e24 0%,#ed1e24 "+this.value+"%,#939393 "+this.value+"%,#939393 100%)";
			});			
			$('#timaat-video-seek-bar').click(function(ev) {
				var time = TIMAAT.VideoPlayer.video.duration * (this.value / 100);
				TIMAAT.VideoPlayer.jumpTo(time);
			});			
			$('#timaat-video-seek-bar').mouseenter(function (ev) {
				if ( !TIMAAT.VideoPlayer.video ) return;
				var preview = $('#timaat-video-seek-bar-preview');
				preview.addClass('show');
				preview.show();
			});
			$('#timaat-video-seek-bar').mouseleave(function (ev) {
				var preview = $('#timaat-video-seek-bar-preview');
				preview.removeClass('show');
				preview.hide();
			});
			$('#timaat-video-seek-bar').mousemove(function (ev) {
				if ( !TIMAAT.VideoPlayer.video ) return;
				var token = TIMAAT.VideoPlayer.model.video.viewToken;
				var bar = $(this);
				var time = Math.round(ev.originalEvent.offsetX/bar.width()*TIMAAT.VideoPlayer.duration);
				var preview = $('#timaat-video-seek-bar-preview');
				$('#timaat-video-seek-bar-preview').css('left', ev.originalEvent.pageX-(preview.width()/2)+'px');
				$('#timaat-video-seek-bar-preview').css('top', bar.offset().top-preview.height()-7+'px');
				preview.find('img').attr('src', "/TIMAAT/api/medium/"+TIMAAT.VideoPlayer.model.video.mediumId+"/thumbnail?token="+token+"&time="+time);
			});
			
			$('#timaat-user-log-analysislist').popover({
				container: 'body',
				html: true,
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				content: '<div class="timaat-user-log-details">Laden...</div>',
				placement: 'bottom',
				trigger: 'manual',
			});
			$('#timaat-user-log-analysislist').on('inserted.bs.popover', function () {
				if ( ! TIMAAT.VideoPlayer.curList ) {
					$('.timaat-user-log-details').html("Keine Liste ausgewählt");
					return;
				}
				$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+TIMAAT.VideoPlayer.curList.userAccountID+'">[ID '+TIMAAT.VideoPlayer.curList.userAccountID+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(TIMAAT.VideoPlayer.curList.createdAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item,"mir")});
			});
			$('#timaat-videoplayer-video-user-log').popover({
				container: 'body',
				html: true,
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				content: '<div class="timaat-user-log-details">Keine Daten erfasst</div>',
				placement: 'left',
				trigger: 'click',
			});			
			
			// setup analysis lists UI and events
			$('#timaat-analysislist-chooser').change(function(ev) {
				var list = TIMAAT.VideoPlayer.model.lists.find(x => x.id === parseInt($(this).val()));
				if ( list ) TIMAAT.VideoPlayer.setupAnnotations(list);
			});
			
			// setup annotation modal UI and events
			$('#timaat-annotation-meta-colorPicker').tinycolorpicker();
			TIMAAT.VideoPlayer.UI.cp = $('#timaat-annotation-meta-colorPicker').data("plugin_tinycolorpicker");
			TIMAAT.VideoPlayer.UI.cp.setColor('rgb(3, 145, 206)');
			
			$('#timaat-annotation-meta-duration').change(function(ev) {
				var time = parseInt($(this).val());
				if ( ! isNaN(time) ) TIMAAT.VideoPlayer.annotationEnd(time);				
				$(this).parent().click();
			});

			$('#timaat-annotation-delete-submit').click(function(ev) {
				var modal = $('#timaat-videoplayer-annotation-delete');
				var anno = modal.data('annotation');
				if (anno) TIMAAT.VideoPlayer._annotationRemoved(anno);
				modal.modal('hide');
			});

			$('#timaat-analysislist-delete-submit').click(function(ev) {
				var modal = $('#timaat-videoplayer-analysislist-delete');
				var list = modal.data('analysislist');
				if (list) TIMAAT.VideoPlayer._analysislistRemoved(list);
				modal.modal('hide');
			});
			$('#timaat-analysislist-meta-submit').click(function(ev) {
				var modal = $('#timaat-videoplayer-analysislist-meta');
				var list = modal.data('analysislist');
				var title = $("#timaat-analysislist-meta-title").val();
				var comment = $("#timaat-analysislist-meta-comment").val();				
				if (list) {
					TIMAAT.VideoPlayer.curList.title = title;
					TIMAAT.VideoPlayer.curList.text = comment;					
					TIMAAT.VideoPlayer.updateAnalysislist(TIMAAT.VideoPlayer.curList);
				} else {
					TIMAAT.Service.createAnalysislist(title, comment, TIMAAT.VideoPlayer.model.video.mediumId, TIMAAT.VideoPlayer._analysislistAdded);
				}
				modal.modal('hide');
			});
			$('#timaat-analysislist-meta-title').on('input', function(ev) {
				if ( $("#timaat-analysislist-meta-title").val().length > 0 ) {
					$('#timaat-analysislist-meta-submit').prop("disabled", false);
					$('#timaat-analysislist-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-analysislist-meta-submit').prop("disabled", true);
					$('#timaat-analysislist-meta-submit').attr("disabled");
				}
			});

			// Create/Update annotation dataset
			$('#timaat-annotation-meta-submit').click(function(ev) {
				var modal = $('#timaat-videoplayer-annotation-meta');
				var anno = modal.data('annotation');
				var title = $("#timaat-annotation-meta-title").val();
				var comment = $("#timaat-annotation-meta-comment").val();
				var startTime = TIMAAT.Util.parseTime($("#timaat-annotation-meta-start").val());
				var endTime = TIMAAT.Util.parseTime($("#timaat-annotation-meta-end").val());
				var color = TIMAAT.VideoPlayer.UI.cp.colorHex.substring(1);				
				if (anno) {
					anno.model.title = title;
					anno.model.comment = comment;
					anno.model.startTime = startTime;
					anno.model.endTime = endTime;
					anno.svg.color = color;
					anno.model.svg[0].color = color;
					TIMAAT.VideoPlayer.updateAnnotation(anno);
				} else {
					TIMAAT.Service.createAnnotation(title, comment, startTime, endTime, color, 1, TIMAAT.VideoPlayer.curList.id, TIMAAT.VideoPlayer._annotationAdded);
				}
				modal.modal('hide');
			});
			$('#timaat-annotation-meta-title').on('input', function(ev) {
				// console.log("TCL: validate annotation form data");
				// console.log("TCL: $(\"#timaat-annotation-meta-title\").val():", $("#timaat-annotation-meta-title").val());
				// console.log("TCL: $(\"#timaat-annotation-meta-start\").val():", $("#timaat-annotation-meta-start").val());
				// console.log("TCL: $(\"#timaat-annotation-meta-end\").val():", $("#timaat-annotation-meta-end").val());
				if ( $("#timaat-annotation-meta-title").val().length > 0 ) {
					$('#timaat-annotation-meta-submit').prop("disabled", false);
					$('#timaat-annotation-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-annotation-meta-submit').prop("disabled", true);
					$('#timaat-annotation-meta-submit').attr("disabled");
				}
			});
			$('#timaat-annotation-meta-start,#timaat-annotation-meta-end').on('blur', function(ev) {
				var startTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-end').val());
				startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
				endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
				$("#timaat-annotation-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
				$("#timaat-annotation-meta-end").val(TIMAAT.Util.formatTime(endTime, true));				
			});
			$('#timaat-annotation-meta-setstart').click(function() {
				var startTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-end').val());
				var duration = endTime-startTime;
				duration = Math.max(0,Math.min(duration,TIMAAT.VideoPlayer.video.duration));
				startTime = TIMAAT.VideoPlayer.video.currentTime;
				endTime = startTime+duration;
				$('#timaat-annotation-meta-start').val(TIMAAT.Util.formatTime(startTime,true));
				$('#timaat-annotation-meta-end').val(TIMAAT.Util.formatTime(endTime,true));
				$('#timaat-annotation-meta-start').trigger('blur');
			});
			$('#timaat-annotation-meta-setend').click(function() {
				endTime = TIMAAT.VideoPlayer.video.currentTime;
				$('#timaat-annotation-meta-end').val(TIMAAT.Util.formatTime(endTime,true));
				$('#timaat-annotation-meta-start').trigger('blur');				
			});

			$('#timaat-videoplayer-annotation-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var anno = modal.data('annotation');				
				var heading = (anno) ? "Annotation bearbeiten" : "Annotation hinzufügen";
				var submit = (anno) ? "Speichern" : "Hinzufügen";
				var color = (anno) ? anno.svg.color : TIMAAT.VideoPlayer.UI.cp.colorHex.substring(1);
				var title = (anno) ? anno.model.title : "";
				var comment = (anno) ? anno.model.comment : "";
				var start = (anno) ? TIMAAT.Util.formatTime(anno.model.startTime,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
				var end = (anno) ? TIMAAT.Util.formatTime(anno.model.endTime,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
				// setup UI from Video Player state
				$('#annotationMetaLabel').html(heading);
				$('#timaat-annotation-meta-submit').html(submit);
				TIMAAT.VideoPlayer.UI.cp.setColor('#'+color);
				$("#timaat-annotation-meta-title").val(title).trigger('input');
				$("#timaat-annotation-meta-comment").val(comment);
				$("#timaat-annotation-meta-start").val(start);
				$("#timaat-annotation-meta-end").val(end);				
			});
			
			$('#timaat-videoplayer-analysislist-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var list = modal.data('analysislist');				
				var heading = (list) ? "Liste bearbeiten" : "Liste hinzufügen";
				var submit = (list) ? "Speichern" : "Hinzufügen";
				var title = (list) ? list.title : "";
				var comment = (list) ? list.text : "";
				// setup UI from Video Player state
				$('#analysislistMetaLabel').html(heading);
				$('#timaat-analysislist-meta-submit').html(submit);
				$("#timaat-analysislist-meta-title").val(title).trigger('input');
				$("#timaat-analysislist-meta-comment").val(comment);				
			});
			
			// analysis segments			
			$('#timaat-segment-meta-submit').click(function(ev) {
				var modal = $('#timaat-videoplayer-segment-meta');
				var segment = modal.data('segment');
				var title = $("#timaat-segment-meta-title").val();
				var startTime = TIMAAT.Util.parseTime($("#timaat-segment-meta-start").val());
				var endTime = TIMAAT.Util.parseTime($("#timaat-segment-meta-end").val());
				
				if (segment) {
					segment.model.name = title;
					segment.model.startTime = startTime;
					segment.model.endTime = endTime;
					// update segment UI
					TIMAAT.VideoPlayer.updateAnalysisSegment(segment);
				} else {
					TIMAAT.Service.createSegment(title, startTime, endTime, TIMAAT.VideoPlayer.curList.id, TIMAAT.VideoPlayer._segmentAdded);
				}
				modal.modal('hide');
			});
			$('#timaat-segment-meta-title').on('input', function(ev) {
				if ( $("#timaat-segment-meta-title").val().length > 0 ) {
					$('#timaat-segment-meta-submit').prop("disabled", false);
					$('#timaat-segment-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-segment-meta-submit').prop("disabled", true);
					$('#timaat-segment-meta-submit').attr("disabled");
				}
			});
			$('#timaat-segment-meta-start,#timaat-segment-meta-end').on('blur', function(ev) {
				var startTime = TIMAAT.Util.parseTime($('#timaat-segment-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-segment-meta-end').val());
				startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
				endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
				$("#timaat-segment-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
				$("#timaat-segment-meta-end").val(TIMAAT.Util.formatTime(endTime, true));				
			});
			$('#timaat-segment-meta-setstart').click(function() {
				var startTime = TIMAAT.Util.parseTime($('#timaat-segment-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-segment-meta-end').val());
				var duration = endTime-startTime;
				duration = Math.max(0,Math.min(duration,TIMAAT.VideoPlayer.video.duration));				
				startTime = TIMAAT.VideoPlayer.video.currentTime;
				endTime = startTime+duration;
				$('#timaat-segment-meta-start').val(TIMAAT.Util.formatTime(startTime,true));
				$('#timaat-segment-meta-end').val(TIMAAT.Util.formatTime(endTime,true));
				$('#timaat-segment-meta-start').trigger('blur');
			});
			$('#timaat-segment-meta-setend').click(function() {
				endTime = TIMAAT.VideoPlayer.video.currentTime;
				$('#timaat-segment-meta-end').val(TIMAAT.Util.formatTime(endTime,true));
				$('#timaat-segment-meta-start').trigger('blur');				
			});
			$('#timaat-videoplayer-segment-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var segment = modal.data('segment');				
				var heading = (segment) ? "Segment bearbeiten" : "Segment hinzufügen";
				var submit = (segment) ? "Speichern" : "Hinzufügen";
				var title = (segment) ? segment.model.name : "";
				var startTime = (segment) ? segment.model.startTime : TIMAAT.VideoPlayer.video.currentTime;
				var endTime = (segment) ? segment.model.endTime : TIMAAT.VideoPlayer.video.duration;				
				// find closest segment to adjust end time
				TIMAAT.VideoPlayer.curList.segments.forEach(function(segment) {
					if ( segment.model.startTime > startTime && segment.model.endTime < endTime )
						endTime = segment.model.endTime;
				});
				var start = (segment) ? TIMAAT.Util.formatTime(segment.model.startTime,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
				var end = TIMAAT.Util.formatTime(endTime,true);
				// setup UI from Video Player state
				$('#segmentMetaLabel').html(heading);
				$('#timaat-segment-meta-submit').html(submit);
				$("#timaat-segment-meta-title").val(title).trigger('input');
				$("#timaat-segment-meta-start").val(start);
				$("#timaat-segment-meta-end").val(end);
				(segment) ? $('#timaat-segment-delete-submit').show() : $('#timaat-segment-delete-submit').hide();
			});
			// delete segment functionality
			$('#timaat-segment-delete-commit-submit').click(function(ev) {
				var modal = $('#timaat-videoplayer-segment-delete');
				var segment = modal.data('segment');
				if (segment) TIMAAT.Service.removeSegment(segment);
				modal.modal('hide');
			});			
		},
		
		createPolygon: function() {
    	console.log("TCL: createPolygon: function()");
			TIMAAT.VideoPlayer.createShape('polygon');
		},

		createRectangle: function() {
    	console.log("TCL: createRectangle: function()");
			TIMAAT.VideoPlayer.createShape('rectangle');
		},
		
		createLine: function() {
    	console.log("TCL: createLine: function()");
			TIMAAT.VideoPlayer.createShape('line');
		},
		
		createShape: function(type) {
			console.log("TCL: createShape: function(type)");
			console.log("TCL: type", type);
			switch (type) {
			case 'rectangle':
				TIMAAT.VideoPlayer.curTool = type;
				map.editTools.startRectangle();
				break;
			case 'polygon':
				TIMAAT.VideoPlayer.curTool = type;
				map.editTools.startPolygon();
				break;
			case 'line':
				TIMAAT.VideoPlayer.curTool = type;
				map.editTools.startPolyline();
				break;
			}
			
			// update UI
			$(map.editCtrl).each(function(index,item) {
				if ( item.type == type ) $(item._container).find('a').addClass('bg-success');
			});
		},

		confineBounds: function(bounds, xOff, yOff) {
			console.log("TCL: confineBounds: function(bounds, xOff, yOff)");
			console.log("TCL: bounds", bounds);
			console.log("TCL: xOff", xOff);
			console.log("TCL: yOff", yOff);
	    	// check bounds
	    	if ( bounds.getSouthWest().lng + xOff < 0 )
	    		xOff -= bounds.getSouthWest().lng + xOff;
	    	if ( bounds.getNorthEast().lat - yOff > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat )
	    		yOff += bounds.getNorthEast().lat - TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat - yOff;
	    	if ( bounds.getNorthEast().lng + xOff > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng )
	    		xOff -= bounds.getNorthEast().lng + xOff - TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng;
	    	if ( bounds.getSouthWest().lat + yOff < 0 )
	    		yOff += bounds.getSouthWest().lat + yOff;
	    	bounds.getSouthWest().lng += xOff;
	    	bounds.getNorthEast().lng += xOff;
	    	bounds.getSouthWest().lat -= yOff;
	    	bounds.getNorthEast().lat -= yOff;
	    	return bounds;
		},
		
		setupVideo: function(video) {
			console.log("TCL: setupVideo: function(video) ");
			console.log("TCL: video", video);
			// setup model
			this.model.video = video;
			this.duration = video.mediumVideo.length;			
			// remove all annotations and markers
			this.annotationList.forEach(function(annotation) {annotation.remove()});
			this.annotationList = [];
			this.curAnnotation = null;			
			// remove old video
			if ( TIMAAT.VideoPlayer.video ) {
				$(TIMAAT.VideoPlayer.video).unbind('canplay');
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.jumpTo(0);
				$('#timaat-video-seek-bar').val(0);
			}
			if ( this.overlay ) map.removeLayer(this.overlay);
			
			// setup annotation UI
			$('#timaat-annotation-list-loader').show();
			$('#timaat-videoplayer-annotation-add-button').prop("disabled", true);
			$('#timaat-videoplayer-annotation-add-button').attr("disabled");
			
			// setup analysis list UI
			$('#timaat-analysislist-chooser').empty();
			$('#timaat-analysislist-chooser').append('<option>keine Liste vorhanden</option');
			$('#timaat-analysislist-chooser').addClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').addClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').removeAttr('onclick');
			$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
			$('#timaat-analysislist-delete').removeAttr('onclick');
			$('#timaat-analysislist-add').addClass("timaat-item-disabled");
			$('#timaat-analysislist-add').removeAttr('onclick');

			// setup video overlay and UI
			$('.timaat-videoplayer-novideo').hide();
			$('.timaat-videoplayer-ui').show();
			$('#timaat-videoplayer-video-title').html(video.primaryTitle.title);
			$('.timaat-videoduration').html(TIMAAT.Util.formatTime(this.model.video.mediumVideo.length));
    	var videoUrl = '/TIMAAT/api/medium/'+this.model.video.mediumId+'/download'+'?token='+video.viewToken;
			this.videoBounds = L.latLngBounds([[ 450, 0], [ 0, 450 / video.mediumVideo.height * video.mediumVideo.width]]);
			map.setMaxBounds(this.videoBounds);
			map.fitBounds(this.videoBounds);
			this.overlay = L.videoOverlay(videoUrl, this.videoBounds, { autoplay: false, loop: false} ).addTo(map);
			this.video = this.overlay.getElement();			
			// attach event handlers for UI elements
			$(this.video).on('canplay', function(ev) {
				$('#timaat-video-seek-bar').val(0);
				map.invalidateSize(true);				
				TIMAAT.UI.setWaiting(false);
			});
			$(this.video).on('timeupdate', function(ev) {
				$('.videotime').html(TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true));		
				var value = (100 / TIMAAT.VideoPlayer.video.duration) * TIMAAT.VideoPlayer.video.currentTime;
				$('#timaat-video-seek-bar').val(value);
				$('#timaat-video-seek-bar').css('background',"linear-gradient(to right,  #ed1e24 0%,#ed1e24 "+value+"%,#939393 "+value+"%,#939393 100%)");
				// update annotation list UI
				TIMAAT.VideoPlayer.updateListUI();
			});	
		},
		
		setupAnalysisLists: function (lists) {
    console.log("TCL: setupAnalysisLists: function (lists)");
    console.log("TCL: lists", lists);
			// clear old lists if any
			$('#timaat-analysislist-chooser').empty();			
			// setup model
			TIMAAT.VideoPlayer.model.lists = lists;
			lists.forEach(function(list) {
				list.ui = $('<option value="'+list.id+'">'+list.title+'</option>');
				list.ui.data('list', list);
				$('#timaat-analysislist-chooser').append(list.ui);
			});			
			// setup segment model
			lists.forEach(function(list) {
				list.segments = Array();
				list.analysisSegments.forEach(function(segment) {
					list.segments.push(new TIMAAT.AnalysisSegment(segment));
				});
			});			
			
			// update UI
			$('#timaat-analysislist-options').prop("disabled", false);
			$('#timaat-analysislist-options').removeAttr("disabled");
			$('#timaat-analysislist-chooser').prop("disabled", false);
			$('#timaat-analysislist-chooser').removeAttr("disabled");
			$('#timaat-analysislist-add').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysislist()');			
			if ( lists.length > 0 ) {
				TIMAAT.VideoPlayer.setupAnnotations(lists[0]);
				$('#timaat-analysislist-chooser').removeClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').removeClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').attr('onclick','TIMAAT.VideoPlayer.editAnalysislist()');
				$('#timaat-analysislist-delete').removeClass("timaat-item-disabled");
				$('#timaat-analysislist-delete').attr('onclick','TIMAAT.VideoPlayer.removeAnalysislist()');
			}
			else {
				TIMAAT.VideoPlayer.setupAnnotations(null);
				$('#timaat-analysislist-chooser').append('<option>keine Liste vorhanden</option');
				$('#timaat-analysislist-chooser').addClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').addClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').removeAttr('onclick');
				$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
				$('#timaat-analysislist-delete').removeAttr('onclick');
			}
		},
		
		setupAnnotations: function(annotations) {
			console.log("TCL: setupAnnotations: function(annotations)");
			console.log("TCL: annotations", annotations);
			// setup model
			TIMAAT.VideoPlayer.model.annotations = annotations;
			// close UI tag editors if any
			TIMAAT.UI.hidePopups();			
			// clear old list contents if any
			if ( TIMAAT.VideoPlayer.curList != null && TIMAAT.VideoPlayer.curList.segments != null) {
				TIMAAT.VideoPlayer.curList.segments.forEach(function(segment) {
					segment.removeUI();
				});
				TIMAAT.VideoPlayer.annotationList.forEach(function(anno) {
					anno.remove();
				});
			}
			TIMAAT.VideoPlayer.annotationList = [];
			TIMAAT.VideoPlayer.curList = annotations;						
			// build annotation list from model
			if ( annotations ) {
				annotations.annotations.forEach(function(annotation) {
					TIMAAT.VideoPlayer.annotationList.push(new TIMAAT.Annotation(annotation));				
				});				
			}			
			if ( TIMAAT.VideoPlayer.curList != null && TIMAAT.VideoPlayer.curList.segments != null) TIMAAT.VideoPlayer.curList.segments.forEach(function(segment) {
				segment.addUI();
			});
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();

			// setup annotations UI
			$('#timaat-annotation-list-loader').hide();
			$('#timaat-videoplayer-annotation-add-button').prop("disabled", TIMAAT.VideoPlayer.curList == null);
			if ( TIMAAT.VideoPlayer.curList )
				$('#timaat-videoplayer-annotation-add-button').removeAttr("disabled");
			else
				$('#timaat-videoplayer-annotation-add-button').attr("disabled");
			$('#timaat-user-log-analysislist').prop("disabled", TIMAAT.VideoPlayer.curList == null);
			if ( TIMAAT.VideoPlayer.curList ) 
				$('#timaat-user-log-analysislist').removeAttr("disabled");
			else 
				$('#timaat-user-log-analysislist').attr("disabled");
		},
		
		userLogForList: function() {
    	console.log("TCL: userLogForList: function()");
			$('#timaat-user-log-analysislist').popover('show');
		},
		
		addAnalysislist: function() {
    	console.log("TCL: addAnalysislist: function()");
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-meta').data('analysislist', null);
			$('#timaat-videoplayer-analysislist-meta').modal('show');
		},
		
		updateAnalysislist: function(analysislist) {
			console.log("TCL: updateAnalysislist: function(analysislist)");
			console.log("TCL: analysislist", analysislist);
			// sync to server
			TIMAAT.Service.updateAnalysislist(analysislist);
			// TODO update UI list view
			TIMAAT.VideoPlayer.curList.ui.html(TIMAAT.VideoPlayer.curList.title);
		},

		editAnalysislist: function() {
    console.log("TCL: editAnalysislist: function()");
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-meta').data('analysislist', TIMAAT.VideoPlayer.curList);
			$('#timaat-videoplayer-analysislist-meta').modal('show');			
		},
		
		removeAnalysislist: function() {
    	console.log("TCL: removeAnalysislist: function()");
			if ( !TIMAAT.VideoPlayer.curList ) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-delete').data('analysislist', TIMAAT.VideoPlayer.curList);
			$('#timaat-videoplayer-analysislist-delete').modal('show');
		},
		
		addQuickAnnotation: function() {
    	console.log("TCL: addQuickAnnotation: function()");
			if ( !TIMAAT.VideoPlayer.curList ) return;
			TIMAAT.VideoPlayer.pause();
			TIMAAT.Service.createAnnotation(
					"Annotation bei "+TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime), 
					"Lesezeichen, noch zu bearbeiten",
					TIMAAT.VideoPlayer.video.currentTime,
					TIMAAT.VideoPlayer.video.currentTime,
					"555555", 
					1, 
					TIMAAT.VideoPlayer.curList.id, 
					TIMAAT.VideoPlayer._annotationAdded
			);
		},
		
		addAnnotation: function() {
   	 console.log("TCL: addAnnotation: function()");
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-annotation-meta').data('annotation', null);
			$('#timaat-videoplayer-annotation-meta').modal('show');
		},
		
		updateAnnotation: function(annotation) {
    	console.log("TCL: updateAnnotation: function(annotation)");
    	console.log("TCL: annotation", annotation);
			// sync to server
			TIMAAT.Service.updateAnnotation(annotation);
			// update UI list view
			annotation.updateUI();
      console.log("TCL: annotation.updateUI()");
			annotation.updateStatus(this.video.currentTime);
			this.updateListUI();
			this.sortListUI();
		},
		
		updateAnnotations: function() {
    console.log("TCL: updateAnnotations: function()");
			if ( this.annotationList == null ) return;
			this.annotationList.forEach(function(annotation) {
				if ( annotation.isActive() && annotation.hasChanges() ) {
					annotation.saveChanges();
					TIMAAT.Service.updateAnnotation(annotation);
					// update UI
					annotation.updateUI();
          console.log("TCL: annotation.updateUI()");
				}
			});

			// update UI list view
			this.updateListUI();
			this.sortListUI();
			console.log("TCL: this.updateUI()");
			this.updateUI();      
		},
		
		removeAnnotation: function() {
    	console.log("TCL: removeAnnotation: function()");
			if ( !this.curAnnotation ) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-annotation-delete').data('annotation', this.curAnnotation);
			$('#timaat-videoplayer-annotation-delete').modal('show');
		},
				
		selectAnnotation: function(annotation) {
			console.log("TCL: selectAnnotation: function(annotation)");
			console.log("TCL: annotation", annotation);
			if ( this.curAnnotation == annotation && annotation != null ) return;
			if ( this.curAnnotation ) this.curAnnotation.setSelected(false);
			this.curAnnotation = annotation;
			if ( this.curAnnotation ) {
			  $(map.editCtrl).each(function(index,item) {$(item._container).find('a').removeClass('leaflet-disabled');});
				this.curAnnotation.setSelected(true);
				$('#timaat-videoplayer-annotation-remove-button').prop("disabled", false);
				$('#timaat-videoplayer-annotation-remove-button').removeAttr("disabled");
				
			} else {
				// disable editing widget
			  $(map.editCtrl).each(function(index,item) {$(item._container).find('a').removeClass('bg-success');});
			  $(map.editCtrl).each(function(index,item) {$(item._container).find('a').addClass('leaflet-disabled');});
				$('#timaat-videoplayer-annotation-remove-button').prop("disabled", true);
				$('#timaat-videoplayer-annotation-remove-button').attr("disabled");
				// stop editing in progress
				if ( map.editTools.drawing() ) {
					try {
						map.editTools.stopDrawing();
					} catch(err) {};
				}
			}
		},
		
		annotationEnd: function(time) {
			console.log("TCL: annotationEnd: function(time)");
			console.log("TCL: time", time);
			// TODO refactor
			var startTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-start').val());
			var endTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-end').val());
			endTime = startTime+time;
			startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
			endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
			$("#timaat-annotation-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
			$("#timaat-annotation-meta-end").val(TIMAAT.Util.formatTime(endTime, true));
		},
		
		setCategorySet: function(categoryset) {
    console.log("TCL: setCategorySet: function(categoryset)");
    console.log("TCL: categoryset", categoryset);
			TIMAAT.VideoPlayer.curCategorySet = categoryset;
			TIMAAT.VideoPlayer.categoryAutocomplete.length = 0;
			if ( categoryset ) {
				$(categoryset.model.categories).each(function(index,category) {
					TIMAAT.VideoPlayer.categoryAutocomplete.push(category.name);
				});
			}
		},
		
		addAnalysisSegment: function() {
    	console.log("TCL: addAnalysisSegment: function()");
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-segment-meta').data('segment', null);
			$('#timaat-videoplayer-segment-meta').modal('show');
		},
		
		updateAnalysisSegment: function(segment) {
    	console.log("TCL: updateAnalysisSegment: function(segment)");
    	console.log("TCL: segment", segment);
			// sync to server
			TIMAAT.Service.updateSegment(segment);

			// update UI list view
			console.log("TCL: segment.updateUI()");
			segment.updateUI();      
			segment.updateStatus(this.video.currentTime);
			this.updateListUI();
			this.sortListUI();
		},
		
		removeAnalysisSegment: function() {
    	console.log("TCL: removeAnalysisSegment: function() ");
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-segment-meta').modal('hide');
			var segment = $('#timaat-videoplayer-segment-meta').data('segment');
			$('#timaat-videoplayer-segment-delete').data('segment', segment);
			$('#timaat-videoplayer-segment-delete').modal('show');
		},

		segmentEnd: function(time) {
    	console.log("TCL: segmentEnd: function(time)");
    	console.log("TCL: time", time);
			// TODO refactor
			var startTime = TIMAAT.Util.parseTime($('#timaat-segment-meta-start').val());
			var endTime = TIMAAT.Util.parseTime($('#timaat-segment-meta-end').val());
			endTime = startTime+time;
			startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
			endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
			$("#timaat-segment-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
			$("#timaat-segment-meta-end").val(TIMAAT.Util.formatTime(endTime, true));
		},
		
		sortListUI: function() {
    	console.log("TCL: sortListUI: function()");
			$("#timaat-annotation-list li").sort(function (a, b) {return (parseInt($(b).attr('data-starttime'))) < (parseInt($(a).attr('data-starttime'))) ? 1 : -1;}) 
                        .appendTo('#timaat-annotation-list');			
		},
		
		updateListUI: function() {
    	console.log("TCL: updateListUI: function()");
			var hasChanges = false;
			
			if ( TIMAAT.VideoPlayer.curList != null && TIMAAT.VideoPlayer.curList.segments != null ) TIMAAT.VideoPlayer.curList.segments.forEach(function(segment) {
				segment.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				
			});
			
			this.annotationList.forEach(function(annotation) {
				annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				if ( TIMAAT.VideoPlayer.curAnnotation == annotation && !annotation.isActive() ) TIMAAT.VideoPlayer.selectAnnotation(null);
				if ( annotation.isActive() && annotation.hasChanges() ) hasChanges = true;
			});
			if ( hasChanges ) $('#timaat-videoplayer-save-polygons-button').show(); else $('#timaat-videoplayer-save-polygons-button').hide();
		},
		
		updateUI: function() {
    	// console.log("TCL: updateUI: function()");
			var hasChanges = false;
			this.annotationList.forEach(function(annotation) {
				if ( annotation.isActive() && annotation.hasChanges() ) hasChanges = true;
			});
			
			if ( hasChanges ) $('#timaat-videoplayer-save-polygons-button').show(); else $('#timaat-videoplayer-save-polygons-button').hide();
		},
		
		pause: function() {
    	// console.log("TCL: pause: function()");
			if ( !this.video ) return;
			this.video.pause();
			if ( $('.playbutton').hasClass('playing') ) $('.playbutton').removeClass('playing');			
		},

		play: function() {
    // console.log("TCL: play: function()");
			if ( !this.video ) return;
			this.video.play();
			if ( !$('.playbutton').hasClass('playing') ) $('.playbutton').addClass('playing');			
		},
		
		jumpTo: function(time) {
    // console.log("TCL: jumpTo: function(time)");
    // console.log("TCL: time", time);
			if ( !this.video ) return;
			this.video.currentTime = time;
			this.updateListUI();
		},
		
		jumpVisible: function(start, end) {
    // console.log("TCL: jumpVisible: function(start, end)");
    // console.log("TCL: start", start);
    // console.log("TCL: end", end);
			if ( !this.video ) return;
			var curTime = this.video.currentTime;
			if ( curTime < start || curTime > end ) this.video.currentTime = start;
			this.updateListUI();
		},
		
		_analysislistAdded: function(analysislist) {
    	console.log("TCL: _analysislistAdded: function(analysislist)");
    	console.log("TCL: analysislist", analysislist);
			var wasEmpty = TIMAAT.VideoPlayer.model.lists.length == 0;
			TIMAAT.VideoPlayer.model.lists.push(analysislist);
			
			analysislist.ui = $('<option value="'+analysislist.id+'">'+analysislist.title+'</option>');
			analysislist.ui.data('list', analysislist);
			
			// update UI
			if ( wasEmpty ) $('#timaat-analysislist-chooser').empty();			
			$('#timaat-analysislist-chooser').append(analysislist.ui);
			$('#timaat-analysislist-chooser').val(analysislist.id);
			$('#timaat-analysislist-chooser').trigger('change');

			$('#timaat-analysislist-chooser').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').attr('onclick','TIMAAT.VideoPlayer.editAnalysislist()');
			$('#timaat-analysislist-delete').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-delete').attr('onclick','TIMAAT.VideoPlayer.removeAnalysislist()');
		},
		
		_analysislistRemoved: function(analysislist) {
    	console.log("TCL: _analysislistRemoved: function(analysislist)");
    	console.log("TCL: analysislist", analysislist);
			// sync to server
			TIMAAT.Service.removeAnalysislist(analysislist);

			// remove from model lists
			var index = TIMAAT.VideoPlayer.model.lists.indexOf(analysislist);
			if (index > -1) TIMAAT.VideoPlayer.model.lists.splice(index, 1);
			
			// update UI list view
			$('#timaat-analysislist-chooser').find('[value="'+analysislist.id+'"]').remove();
			$('#timaat-analysislist-chooser').trigger('change');
			if ( TIMAAT.VideoPlayer.model.lists.length == 0 ) {
				TIMAAT.VideoPlayer.setupAnnotations(null);
				$('#timaat-analysislist-chooser').append('<option>keine Liste vorhanden</option');
				$('#timaat-analysislist-chooser').addClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').addClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').removeAttr('onclick');
				$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
				$('#timaat-analysislist-delete').removeAttr('onclick');
			}
			// update annotation UI
		},
		
		_annotationAdded: function(annotation) {
    	console.log("TCL: _annotationAdded: function(annotation)");
    	console.log("TCL: annotation", annotation);
			TIMAAT.VideoPlayer.annotationList.push(annotation);
			TIMAAT.VideoPlayer.curList.annotations.push(annotation.model);
			annotation.updateUI();
      console.log("TCL: annotation.updateUI()");
			annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			TIMAAT.VideoPlayer.selectAnnotation(annotation);
		},
		
		_annotationRemoved: function(annotation) {
    console.log("TCL: _annotationRemoved: function(annotation)");
    console.log("TCL: annotation", annotation);
			// sync to server
			TIMAAT.Service.removeAnnotation(annotation);
			var index = TIMAAT.VideoPlayer.annotationList.indexOf(annotation);
			if (index > -1) TIMAAT.VideoPlayer.annotationList.splice(index, 1);
			// remove from model list
			var anno = TIMAAT.VideoPlayer.curList.annotations.find(x => x.id === annotation.model.id);
			index = TIMAAT.VideoPlayer.curList.annotations.indexOf(anno);
			if (index > -1) TIMAAT.VideoPlayer.curList.annotations.splice(index, 1);

			// update UI list view
			annotation.remove();
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			TIMAAT.VideoPlayer.selectAnnotation(null);
		},
		
		_segmentAdded: function(segment) {
    console.log("TCL: _segmentAdded: function(segment)");
    console.log("TCL: segment", segment);
			TIMAAT.VideoPlayer.curList.segments.push(segment);
			segment.addUI();

			// update UI
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

	},	

	// ------------------------------------------------------------------------------------------------------------------------

	Service: {
		state: 0,
		session: null,
		token: null,
		idCache: new Map(),
		
		logout: function() {
    	console.log("TCL: logout: function()");
			TIMAAT.Service.state = 2;
			TIMAAT.Service.token = null;
			TIMAAT.Service.session = null;
			location.reload(true);
		},
		
		getAllCategorySets: function(callback) {
    // console.log("TCL: getAllCategorySets: function(callback)");
    // console.log("TCL: callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/categoryset/all",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
		},
		
		getUserName: function(id, callback) {
      // console.log("TCL: getUserName: function(id, callback)");
			// console.log("TCL: id, callback", id, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/user/"+id+"/name",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"text",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
		},
		
		getUserLog: function(id, limit, callback) {
    // console.log("TCL: getUserLog: function(id, limit, callback)");
    // console.log("TCL: id, limit, callback", id, limit, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/log/user/"+id+"",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});		},

		listVideos(callback) {
      // console.log("TCL: listVideos -> listVideos(callback)");
      // console.log("TCL: listVideos -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
			
		},
		
		getAnalysisLists(videoID, callback) {
      console.log("TCL: getAnalysisLists -> getAnalysisLists(videoID, callback) ");
      console.log("TCL: getAnalysisLists -> videoID", videoID);
      // console.log("TCL: getAnalysisLists -> callback", callback);
      // console.log("TCL: getAnalysisLists -> videoID, callback", videoID, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+videoID+"/analysislists",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
			
		},

		createAnalysislist(title, comment, mediumID, callback) {
      console.log("TCL: createAnalysislist -> createAnalysislist(title, comment, mediumID, callback)");
      console.log("TCL: createAnalysislist -> title", title);
      console.log("TCL: createAnalysislist -> comment", comment);
      console.log("TCL: createAnalysislist -> mediumID", mediumID);
      // console.log("TCL: createAnalysislist -> callback", callback);
      // console.log("TCL: createAnalysislist -> title, comment, mediumID, callback", title, comment, mediumID, callback);
			var model = {
					"id": 0,
					"text": comment,
					"title": title,
					"analysisSegments": [],
					"annotations": [],
					"mediumID": mediumID
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/medium/"+mediumID,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

		updateAnalysislist(analysislist) {
      console.log("TCL: updateAnalysislist -> analysislist", analysislist);
			var list = {
					id: analysislist.id,
					title: analysislist.title,
					text: analysislist.text,
					mediumID: analysislist.mediumID
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+list.id,
				type:"PATCH",
				data: JSON.stringify(list),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TODO refactor
				analysislist.id = data.id;
				analysislist.title = data.title;
				analysislist.text = data.text;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeAnalysislist(analysislist) {
      console.log("TCL: removeAnalysislist -> analysislist", analysislist);
			var list = analysislist;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+list.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},
		
		createAnnotation(title, comment, startTime, endTime, color, strokeWidth, list, callback) {
      console.log("TCL: createAnnotation -> title, comment, startTime, endTime, color, strokeWidth, list, callback", title, comment, startTime, endTime, color, strokeWidth, list, callback);
			var model = { 	
				id: 0, 
				analysisListID: list,
				comment: comment,
				title: title,
				startTime: startTime,
				endTime: endTime,
				svg: [{
					id: 0,
					color: color,
					svgData: "[]",
					strokeWidth: strokeWidth
					}]
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/medium/"+TIMAAT.VideoPlayer.model.video.mediumId,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(new TIMAAT.Annotation(data));
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		updateAnnotation(annotation) {
      console.log("TCL: updateAnnotation -> annotation", annotation);
			var anno = annotation;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+anno.model.id,
				type:"PATCH",
				data: JSON.stringify(annotation.getModel()),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				anno.model = data;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeAnnotation(annotation) {
      console.log("TCL: removeAnnotation -> annotation", annotation);
			var anno = annotation;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+anno.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},
		
		createSegment(name, startTime, endTime, list, callback) {
      console.log("TCL: createSegment -> name, startTime, endTime, list, callback", name, startTime, endTime, list, callback);
			var model = { 	
				id: 0, 
				name: name,
				startTime: startTime,
				endTime: endTime,
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/"+list+"/segment",
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(new TIMAAT.AnalysisSegment(data));
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		updateSegment(segment) {
      console.log("TCL: updateSegment -> segment", segment);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+segment.model.id,
				type:"PATCH",
				data: JSON.stringify(segment.model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				segment.model = data;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},
		
		removeSegment(segment) {
      console.log("TCL: removeSegment -> segment", segment);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysislist/segment/"+segment.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TODO refactor
				
				// remove segment
				var index = TIMAAT.VideoPlayer.curList.segments.indexOf(segment);
				if (index > -1) TIMAAT.VideoPlayer.curList.segments.splice(index, 1);

				// update UI
				segment.removeUI();
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
			
		},

		addTag(set, tagname, callback) {
      // console.log("TCL: addTag -> addTag(set, tagname, callback)");
      // console.log("TCL: addTag -> set", set);
      // console.log("TCL: addTag -> tagname", tagname);
      // console.log("TCL: addTag -> callback", callback);
      // console.log("TCL: addTag -> set, tagname, callback", set, tagname, callback);
			var serviceEndpoint = "annotation";
			if ( set.constructor === TIMAAT.CategorySet ) serviceEndpoint = "tag/categoryset"; 
			else if ( set.constructor === TIMAAT.Actor ) serviceEndpoint = "actor";
			else if ( set.constructor === TIMAAT.Location ) serviceEndpoint = "location";
			else if ( set.constructor === TIMAAT.Country ) serviceEndpoint = "country";
			else if ( set.constructor === TIMAAT.Event ) serviceEndpoint = "event";

			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/"+serviceEndpoint+"/"+set.model.id+"/tag/"+tagname,
				type:"POST",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				TIMAAT.Service.updateCategorySets(tagname);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

		removeTag(set, tagname, callback) {
      // console.log("TCL: removeTag -> removeTag(set, tagname, callback)");
      // console.log("TCL: removeTag -> set", set);
      // console.log("TCL: removeTag -> tagname", tagname);
      // console.log("TCL: removeTag -> callback", callback);
      // console.log("TCL: removeTag -> set, tagname, callback", set, tagname, callback);
			var serviceEndpoint = "annotation";
			if  ( set.constructor === TIMAAT.CategorySet ) serviceEndpoint = "tag/categoryset";
			else if ( set.constructor === TIMAAT.Actor ) serviceEndpoint = "actor";
			else if ( set.constructor === TIMAAT.Location ) serviceEndpoint = "location";
			else if ( set.constructor === TIMAAT.Country ) serviceEndpoint = "country";
			else if ( set.constructor === TIMAAT.Event ) serviceEndpoint = "event";
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/"+serviceEndpoint+"/"+set.model.id+"/tag/"+tagname,
				type:"DELETE",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				TIMAAT.Service.updateCategorySets(tagname);
				callback(tagname);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		addMediumTag(medium, tagname, callback) {
      console.log("TCL: addMediumTag -> medium, tagname, callback", medium, tagname, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.id+"/tag/"+tagname,
				type:"POST",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				TIMAAT.Service.updateCategorySets(tagname);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		removeMediumTag(medium, tagname, callback) {
      console.log("TCL: removeMediumTag -> medium, tagname, callback", medium, tagname, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.id+"/tag/"+tagname,
				type:"DELETE",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				TIMAAT.Service.updateCategorySets(tagname);
				callback(tagname);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		updateCategorySets(categoryname) {
      console.log("TCL: updateCategorySets -> categoryname", categoryname);
			// TODO implement for updating unassigned categories
		},
			
		createCategorySet(name, callback) {
			console.log("TCL: createCategorySet -> createCategorySet(name, callback)");
			console.log("TCL:   -> createCategorySet -> name", name);
			// console.log("TCL: createCategorySet -> callback", callback);
			// console.log("TCL: createCategorySet -> name, callback", name, callback);
			var model = {
					"id": 0,
					"name": name,
					"categories": [],
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/categoryset/",
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		updateCategorySet(categoryset) {
      console.log("TCL: updateCategorySet -> categoryset", categoryset);
			var set = {
					id: categoryset.model.id,
					name: categoryset.model.name,
					categories: []
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/categoryset/"+set.id,
				type:"PATCH",
				data: JSON.stringify(set),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TODO refactor
				categoryset.model.id = data.id;
				categoryset.model.name = data.name;
				categoryset.model.categories = data.categories;
				console.log("TCL: updateCategorySet -> categoryset.updateUI()");
				categoryset.updateUI();        
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeCategorySet(categoryset) {
      console.log("TCL: removeCategorySet -> categoryset", categoryset);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/category/categoryset/"+categoryset.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},	

	},

	// ------------------------------------------------------------------------------------------------------------------------

	LocationService: {

		listLocationTypes(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/locationtype/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});			
		},

		listLocations(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});			
		},

		listLocationSubtype(locationSubtype, callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
			
		},

		async createLocation(locationModel) {
			var newLocationModel = {
				id: 0,
				locationType: {
					id: locationModel.locationType.id,
				}
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationModel.id,
					type:"POST",
					data: JSON.stringify(newLocationModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(locationData) {
					resolve(locationData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createLocationTranslation(model, modelTranslation) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+model.id+"/translation/"+modelTranslation.id,
					type:"POST",
					data: JSON.stringify(modelTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createLocationSubtype(locationSubtype, locationModel, subtypeModel) {
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/"+locationModel.id,
					type:"POST",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(subtypeData) {
						resolve(subtypeData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateLocation(locationModel) {
      console.log("TCL: updateLocation -> locationModel", locationModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationModel.id,
					type:"PATCH",
					data: JSON.stringify(locationModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateLocationTranslation(locationId, locationTranslation) {
      console.log("TCL: async updateLocationTranslation -> locationId, updatedLocationTranslation", locationId, locationTranslation);
			// var updatedLocationTranslation = {
			// 	id: location.model.locationTranslations[0].id, // TODO get the correct translation_id
			// 	name: location.model.locationTranslations[0].name,
			// };
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationId+"/translation/"+locationTranslation.id,
					type:"PATCH",
					data: JSON.stringify(locationTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateLocationSubtype(locationSubtype, subtypeModel) {
			console.log("TCL: async updateLocationSubtype -> locationSubtype, subtypeModel", locationSubtype, subtypeModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/"+subtypeModel.locationId,
					type:"PATCH",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
				console.log("TCL: async updateLocationSubtype -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		removeLocation(location) {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+location.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeSubtype(locationSubtype, subtype) {
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+locationSubtype+"/"+subtype.model.locationId,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},	

	},

	// ------------------------------------------------------------------------------------------------------------------------

	MediaService: {

		listMediaTypes(callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/mediatype/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});			
		},

		listMedia(callback) {
			// console.log("TCL: listMedia -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: listMedia -> data", data);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});			
		},

		listMediumSubtype(mediumSubtype, callback) {
			// console.log("TCL: listVideos -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumSubtype+"/list",
				type:"GET",
				// data: JSON.stringify(mediaType),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: listMediumSubtype -> mediumSuptype, data", mediumSubtype, data);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});			
		},

		async createMedium(mediumModel) {
			console.log("TCL: async createMedium -> mediumModel", mediumModel);
			var newMediumModel = {
				id: 0,
				remark: mediumModel.remark,
				releaseDate: mediumModel.releaseDate,
				copyright: mediumModel.copyright,
				mediaType: {
					id: mediumModel.mediaType.id,
				},
				// work: {
				// 	id: mediumModel.work.id,
				// },
				title: {
					id: mediumModel.title.id,
				},
			};
      console.log("TCL: createMedium -> newMediumModel", newMediumModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumModel.id,
					type:"POST",
					data: JSON.stringify(newMediumModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(mediumData) {
					console.log("TCL: createMedium -> mediumData", mediumData);
					resolve(mediumData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText);
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		// not yet needed (no translation data or translation table available at the moment)
		async createMediumTranslation(model, modelTranslation) {
			// console.log("TCL: createMediumTranslation -> model, modelTranslation", model, modelTranslation);			
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+model.id+"/translation/"+modelTranslation.id,
					type:"POST",
					data: JSON.stringify(modelTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
					// console.log("TCL: createMediumTranslation -> translationData", translationData);
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createMediumSubtype(mediumSubtype, mediumModel, subtypeModel) {
      console.log("TCL: createMediumSubtype -> mediumSubtype, mediumModel, subtypeModel", mediumSubtype, mediumModel, subtypeModel);			
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumSubtype+"/"+mediumModel.id,
					type:"POST",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(subtypeData) {
					console.log("TCL: createMediumSubtype subtypeData", subtypeData);
					resolve(subtypeData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createTitle(title) {
			console.log("TCL: async createTitle -> title", title);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/title/"+title.id,
					type:"POST",
					data: JSON.stringify(title),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(titleData) {
					console.log("TCL: createTitle -> titleData", titleData);
					resolve(titleData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async createSource(source) {
			console.log("TCL: async createSource -> source", source);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/source/"+source.id,
					type:"POST",
					data: JSON.stringify(source),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(sourceData) {
					console.log("TCL: createSource -> sourceData", sourceData);
					resolve(sourceData);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateMedium(mediumModel) {
			console.log("TCL: MediaService: async updateMedium -> mediumModel", mediumModel);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumModel.id,
					type:"PATCH",
					data: JSON.stringify(mediumModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateMedium -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		// not yet needed (no translation data or translation table available at the moment)
		async updateMediumTranslation(medium) {
			// console.log("TCL: MediaService async updateMediumTranslation -> medium", medium);
			var updatedMediumTranslation = {
				id: medium.model.mediumTranslations[0].id, // TODO get the correct translation_id
				name: medium.model.mediumTranslations[0].name,
			};
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.model.id+"/translation/"+updatedMediumTranslation.id,
					type:"PATCH",
					data: JSON.stringify(updatedMediumTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(translationData) {
				// console.log("TCL: updateMediumTranslation -> translationData", translationData);
					resolve(translationData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error );
			});
		},

		async updateMediumSubtype(mediumSubtype, subtypeModel) {
		console.log("TCL: updateMediumSubtype -> mediumSubtype, subtypeModel", mediumSubtype, subtypeModel);			
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumSubtype+"/"+subtypeModel.mediumId,
					type:"PATCH",
					data: JSON.stringify(subtypeModel),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateMediumSubtype -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateTitle(title) {
			console.log("TCL: async updateTitle -> title", title);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/title/"+title.id,
					type:"PATCH",
					data: JSON.stringify(title),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateTitle -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		async updateSource(source) {
			console.log("TCL: async updateSource -> source", source);
			return new Promise(resolve => {
				$.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/source/"+source.id,
					type:"PATCH",
					data: JSON.stringify(source),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(updateData) {
					console.log("TCL: async updateSource -> updateData", updateData);
					resolve(updateData);
				}).fail(function(e) {
					console.log( "error", e );
					console.log( e.responseText );
				});
			}).catch((error) => {
				console.log( "error: ", error);
			});
		},

		removeMedium(medium) {
			console.log("TCL: removeMedium -> medium", medium);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+medium.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeMediumSubtype(mediumSubtype, subtype) {
      console.log("TCL: removeMediumSubtype -> mediumSubtype, subtype", mediumSubtype, subtype);
			$.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+mediumSubtype+"/"+subtype.model.mediumId,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

	},

	// ------------------------------------------------------------------------------------------------------------------------

	ActorService: {

		listActors(callback) {
			// console.log("TCL: listActors -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
			
		},

		createActor(name, callback) {
		// createActor(name, callback) {
			// console.log("TCL: createActor -> name:", name);
			// console.log("TCL: createActor -> callback", callback);
			var model = {
				id: 0,
				name: name, // TODO change to actorTranslation
				// tags: []
				// actorTranslation: [{
				// 	id: 0,
				// 	languageId: list,
				// 	name: name,
				// 	description: description
				// }]
			};
			jQuery.ajax({
				// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+model.id,
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+model.id,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// callback(new TIMAAT.Actor(data));
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});		
		},

		updateActor(actor) {
			// console.log("TCL: updateActor -> actor", actor);
			var ac = {
				id: actor.model.id,
				name: actor.model.name,
			// 	// tags: []
			};
			console.log("TCL: updateActor -> ac", ac);
			// console.log("TCL: updateActor -> locationId", actor.model.locationId);
			// var thisActor = actor;
			jQuery.ajax({
				// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+thisActor.model.id,
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+ac.id,
				type:"PATCH",
				data: JSON.stringify(ac),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			console.log("TCL: updateActor -> data", data);
				// thisActor.model = data;
				// ac.model = data;
				actor.model.id = data.id;
				actor.model.title = data.title;
				console.log("TCL: updateActor -> actor.updateUI()");
				actor.updateUI(); 
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeActor(actor) {
			// console.log("TCL: removeActor -> actor", actor);
			var ac = actor;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+ac.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},	

	},

	// ------------------------------------------------------------------------------------------------------------------------

	EventService: {

		listEvents(callback) {
			// console.log("TCL: listEvents -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/list",
				type:"GET",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
			});
		},

		createEvent(model, modelTranslation, callback) {
			console.log("TCL: [1] createEvent -> model", model);
			var event = model;
			console.log("TCL: [1a] createEvent -> event", event);			
			// create Event
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+model.id,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// console.log("TCL: [2] createEvent done -> data", data);
				event.id = data.id;
				// console.log("TCL: [2a] createEvent -> event", event);
				jQuery.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+data.id+"/translation/"+modelTranslation.id,
					type:"POST",
					data: JSON.stringify(modelTranslation),
					contentType:"application/json; charset=utf-8",
					dataType:"json",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
				// console.log("TCL: [3] createEventTranslation -> data", data);
				event.eventTranslations[0] = data;
				// console.log("TCL: [3a] createEvent -> event", event);
				callback(event);
				}).fail(function(e) {
					console.log( "error: ", e.responseText );
				})
			}).done(function(data) {
				// console.log("TCL: [4] createEvent -> data", data);
				// console.log("TCL: [4a] createEvent -> event", event);
			}).fail(function(e) {
				console.log( "error: ", e.responseText );
			});
		},

		updateEvent(event) {
			console.log("TCL: updateEvent -> event", event);
			var updatedEvent = {
				id: event.model.id,
				// name: event.model.eventTranslations[0].name,
				// description: event.model.eventTranslations[0].description,
				beginsAtDate: event.model.beginsAtDate,
				endsAtDate: event.model.endsAtDate,
			};
			console.log("TCL: updateEvent -> updatedEvent:", updatedEvent);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+updatedEvent.id,
				type:"PATCH",
				data: JSON.stringify(updatedEvent),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			console.log("TCL: updateEvent -> data", data);
				event.model.id = data.id;
				event.model.beginsAtDate = data.beginsAtDate;
				event.model.endsAtDate = data.endsAtDate;
				event.model.eventTranslations[0].id = data.eventTranslations[0].id;
				event.model.eventTranslations[0].name = data.eventTranslations[0].name;
				event.model.eventTranslations[0].description = data.eventTranslations[0].description;				
				// console.log("TCL: update event translation", event);
				// TIMAAT.Service.updateEventTranslation(event);
				// console.log("TCL: updateEvent -> event.updateUI()");
				event.updateUI();
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		updateEventTranslation(event) {
			console.log("TCL: updateEventTranslation -> event", event);
			console.log("TCL: updateEventTranslation -> event.model.id", event.model.id);
			// update event translation
			var updatedEventTranslation = {
				id: event.model.eventTranslations[0].id, // TODO get the correct translation_id
				name: event.model.eventTranslations[0].name,
				description: event.model.eventTranslations[0].description,
			};
			console.log("TCL: updateEventTranslation -> updatedEventTranslation", updatedEventTranslation);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id+"/translation/"+updatedEventTranslation.id,
				type:"PATCH",
				data: JSON.stringify(updatedEventTranslation),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(translationData) {
			console.log("TCL: updateEventTranslation -> translationData", translationData);
				event.model.eventTranslations[0].id = translationData.id;
				event.model.eventTranslations[0].name = translationData.name;
				event.model.eventTranslations[0].description = translationData.description;
				console.log("TCL: updateEventTranslation -> event.updateUI()");
				event.updateUI();  // will be called by updateEvent(event)
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeEvent(event) {
			console.log("TCL: removeEvent -> event", event);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeEventTranslation(event) {
			console.log("TCL: removeEventTranslation -> event", event);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.model.id+"/translation/"+event.model.eventTranslations[0].id,
				type:"DELETE",
				contentType:"application/json; charset=utf-8",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		addEventTag(event, tagname, callback) {
			console.log("TCL: addEventTag -> event.id", event.id);
			console.log("TCL: addEventTag -> event, tagname, callback", event, tagname, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.id+"/tag/"+tagname,
				type:"POST",
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TIMAAT.Service.updateCategorySets(tagname);
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

		removeEventTag(event, tagname, callback) {
			console.log("TCL: removeEventTag -> event.id", event.id);
			console.log("TCL: removeEventTag -> event, tagname, callback", event, tagname, callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+event.id+"/tag/"+tagname,
				type:"DELETE",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TIMAAT.Service.updateCategorySets(tagname);
				callback(tagname);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},		

	},

	// ------------------------------------------------------------------------------------------------------------------------
	    
	Settings: {
		categorysets: null,
		
		init: function() {
    	// console.log("TCL: Settings: init: function()");
			// attach category editor
			$('#timaat-medium-categories').popover({
				placement: 'right',
				title: 'Medium Categories bearbeiten',
				trigger: 'click',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-category-input" type="text" value=""></div>',
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-medium-categories').on('inserted.bs.popover', function () {
				var categories = "";
				if ( TIMAAT.VideoPlayer.video == null ) {
					$('.timaat-category-input').html('Kein Video geladen');
					return;
				} else {
					$('.timaat-category-input').html('');					
				}
				TIMAAT.VideoPlayer.model.video.categories.forEach(function(item) { categories += ','+item.name });
				categories = categories.substring(1);
				$('.timaat-category-input').val(categories);
			    $('.timaat-category-input').categoriesInput({
			    	placeholder: 'Medium Category hinzufügen',
			    	onAddCategory: function(categoryinput,category) {
			    		TIMAAT.Service.addMediumCategory(TIMAAT.VideoPlayer.model.video, category, function(newcategory) {
			    			TIMAAT.VideoPlayer.model.video.categories.push(newcategory);
			    		});
			    	},
			    	onRemoveCategory: function(categoryinput,category) {
			    		TIMAAT.Service.removeMediumCategory(TIMAAT.VideoPlayer.model.video, category, function(categoryname) {
			    			// find category in model
			    			var found = -1;
			    			TIMAAT.VideoPlayer.model.video.categories.forEach(function(item, index) {
			    				if ( item.name == categoryname ) found = index;
			    			});
			    			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_category').focus();
			    	}
			    });
			});
			$('#timaat-medium-categories').on('hidden.bs.popover', function () { 
			});			

			// delete categoryset functionality
			$('#timaat-categoryset-delete-submit').click(function(ev) {
				var modal = $('#timaat-settings-categoryset-delete');
				var categoryset = modal.data('categoryset');
				if (categoryset) TIMAAT.Settings._categorysetRemoved(categoryset);
				modal.modal('hide');
			});
			
			// add/edit categoryset functionality
			$('#timaat-categoryset-add').attr('onclick','TIMAAT.Settings.addCategorySet()');
			$('#timaat-settings-categoryset-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var categoryset = modal.data('categoryset');				
				var heading = (categoryset) ? "CategorySet bearbeiten" : "CategorySet hinzufügen";
				var submit = (categoryset) ? "Speichern" : "Hinzufügen";
				var title = (categoryset) ? categoryset.model.name : "";				
				// setup UI from Video Player state
				$('#categorysetMetaLabel').html(heading);
				$('#timaat-categoryset-meta-submit').html(submit);
				$("#timaat-categoryset-meta-title").val(title).trigger('input');				
			});
			$('#timaat-categoryset-meta-submit').click(function(ev) {
				var modal = $('#timaat-settings-categoryset-meta');
				var categoryset = modal.data('categoryset');
				var title = $("#timaat-categoryset-meta-title").val();				
				if (categoryset) {
					categoryset.model.name = title;
					// console.log("TCL: categoryset.updateUI() - Settings init()");
					categoryset.updateUI();          
					TIMAAT.Service.updateCategorySet(categoryset);
				} else {
					TIMAAT.Service.createCategorySet(title, TIMAAT.Settings._categorysetAdded);
				}
				modal.modal('hide');
			});
			$('#timaat-categoryset-meta-title').on('input', function(ev) {
				console.log("TCL: validate categoryset input");
				console.log("TCL: $(\"#timaat-categoryset-meta-title\").val():", $("#timaat-categoryset-meta-title").val());
				if ( $("#timaat-categoryset-meta-title").val().length > 0 ) {
					$('#timaat-categoryset-meta-submit').prop("disabled", false);
					$('#timaat-categoryset-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-categoryset-meta-submit').prop("disabled", true);
					$('#timaat-categoryset-meta-submit').attr("disabled");
				}
			});
		},
		
		loadCategorySets: function() {
    // console.log("TCL: loadCategorySets: function()");
			// load categorysets
			// TIMAAT.Service.getAllCategorySets(TIMAAT.Settings.setCategorySetLists); // TODO uncomment once working
		},
		
		setCategorySetLists: function(categorysets) {
    // console.log("TCL: setCategorySetLists: function(categorysets)");
    console.log("TCL: categorysets", categorysets);
			if ( !categorysets ) return;
			$('#timaat-categoryset-list-loader').remove();

			// clear old UI list
			$('#timaat-categoryset-list').empty();

			// setup model
			var ts = Array();
			categorysets.forEach(function(categoryset) { if ( categoryset.id > 0 ) ts.push(new TIMAAT.CategorySet(categoryset)); });
			TIMAAT.Settings.categorysets = ts;
			TIMAAT.Settings.categorysets.model = categorysets;
			
		},
		
		addCategorySet: function() {	
    console.log("TCL: addCategorySet: function()");
			$('#timaat-settings-categoryset-meta').data('categoryset', null);
			$('#timaat-settings-categoryset-meta').modal('show');
		},
		
		_categorysetAdded: function(categoryset) {
    console.log("TCL: _categorysetAdded: function(categoryset)");
    console.log("TCL: categoryset", categoryset);
			TIMAAT.Settings.categorysets.model.push(categoryset);
			TIMAAT.Settings.categorysets.push(new TIMAAT.CategorySet(categoryset));
		},
		
		_categorysetRemoved: function(categoryset) {
    console.log("TCL: _categorysetRemoved: function(categoryset)");
    console.log("TCL: categoryset", categoryset);
			// sync to server
			TIMAAT.Service.removeCategorySet(categoryset);			
			categoryset.remove();
			if ( TIMAAT.VideoPlayer.curCategorySet == categoryset ) TIMAAT.VideoPlayer.setCategorySet(null);

		}
		
		
	},
	
	// ------------------------------------------------------------------------------------------------------------------------
		
	Datasets: {

		init: function() {
			TIMAAT.ActorDatasets.init();
			TIMAAT.EventDatasets.init();
			TIMAAT.LocationDatasets.init();   
			TIMAAT.MediaDatasets.init();
		},

		load: function() {
			TIMAAT.ActorDatasets.load();
			TIMAAT.EventDatasets.load();
			TIMAAT.LocationDatasets.load();   
			TIMAAT.MediaDatasets.load();
		},

	},
	
	// ------------------------------------------------------------------------------------------------------------------------
		
	EventDatasets: {
		events: null,

		init: function() {
			TIMAAT.EventDatasets.initEvents();
		},

		load: function() {
			TIMAAT.EventDatasets.loadEvents();
		},

		initEvents: function() {
			// console.log("TCL: EventDatasets: initEvents: function()");
			// attach tag editor
			$('#timaat-event-tags').popover({
				placement: 'right',
				title: 'Event Tags bearbeiten (datasets init function)',
				trigger: 'click',
				html: true,
				content: `<div class="input-group">
										<input class="form-control timaat-tag-input" type="text" value="">
									</div>`,
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-event-tags').on('inserted.bs.popover', function () {
				var tags = "";
				if ( event == null ) {
					$('.timaat-tag-input').html('Kein Event geladen');
					return;
				} else {
					$('.timaat-tag-input').html('');					
				}
				event.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Event Tag hinzufügen (datasets init function)',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.EventService.addEventTag(event, tag, function(newtag) {
			    			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.EventService.removeEventTag(event, tag, function(tagname) {
			    			// find tag in model
			    			var found = -1;
			    			TIMAAT.VideoPlayer.model.video.tags.forEach(function(item, index) {
			    				if ( item.name == tagname ) found = index;
			    			});
			    			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			    	}
			    });
			});
			$('#timaat-event-tags').on('hidden.bs.popover', function () { 
			});
			// delete event functionality
			$('#timaat-event-delete-submit').click(function(ev) {
				var modal = $('#timaat-eventdatasets-event-delete');
				var event = modal.data('event');
				if (event) TIMAAT.EventDatasets._eventRemoved(event);
				modal.modal('hide');
			});
			// add event button
			$('#timaat-event-add').attr('onclick','TIMAAT.EventDatasets.addEvent()');
			// add/edit event functionality
			$('#timaat-eventdatasets-event-meta').on('show.bs.modal', function (ev) {
				// console.log("TCL: Create/Edit event window setup");
				var modal = $(this);
				var event = modal.data('event');				
				var heading = (event) ? "Event bearbeiten" : "Event hinzufügen";
				var submit = (event) ? "Speichern" : "Hinzufügen";
				var name = (event) ? event.model.eventTranslations[0].name : "";
				var description = (event) ? event.model.eventTranslations[0].description : "";
				var beginsAtDate = (event) ? event.model.beginsAtDate : 0;
				var endsAtDate = (event) ? event.model.endsAtDate : 0;

				// console.log("TCL: beginsAtDate:", beginsAtDate);
				// var dateLocale = "en-US";
				// var dateOptions = {timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit'};
				// var beginsAt = new Date(beginsAtDate); 
        // console.log("TCL: beginsAt", beginsAt);
				// var mm = beginsAt.getMonth() + 1;
				// var dd = beginsAt.getDate();
				// var yyyy = beginsAt.getFullYear();
				// var beginsAtConverted = yyyy + '-' + mm + '-' + dd;
        // console.log("TCL: beginsAtConverted", beginsAtConverted);
				// var endsAt = new Date(endsAtDate);
				// var mm = endsAt.getMonth();
				// var dd = endsAt.getDate();
				// var yyyy = endsAt.getFullYear();
				// var endsAtConverted = yyyy + '-' + mm + '-' + dd;
				// var beginsAt = new Date(beginsAtDate);
				// beginsAt = beginsAt.toUTCString();
				// setup UI
				$('#eventMetaLabel').html(heading);
				$('#timaat-event-meta-submit').html(submit);
				$("#timaat-event-meta-name").val(name).trigger('input');
				$("#timaat-event-meta-start").val(Date(beginsAtDate)); // 1212-12-12
        console.log("TCL: initEvents -> beginsAtDate", beginsAtDate);
				$("#timaat-event-meta-end").val(Date(endsAtDate)); // 1212-12-12
				$("#timaat-event-meta-description").val(description);
			});
			// Submit event data
			$('#timaat-event-meta-submit').click(function(ev) {
				var modal = $('#timaat-eventdatasets-event-meta');
				var event = modal.data('event');
				var name = $("#timaat-event-meta-name").val();
				var description = $("#timaat-event-meta-description").val();
				var beginsAtDate = $("#timaat-event-meta-start").val();
				var endsAtDate = $("#timaat-event-meta-end").val();
				if (!beginsAtDate ) beginsAtDate = 0; // required with type="date" input format to ensure !null
				if (!endsAtDate ) endssAtDate = 0; // required with type="date" input format to ensure !null
				if (event) {
					event.model.eventTranslations[0].name = name;
					event.model.eventTranslations[0].description = description;
					event.model.beginsAtDate = beginsAtDate;
					event.model.endsAtDate = endsAtDate;
					event.updateUI(); // shouldn't be necessary as it will be called in the updateEvent(event) function again
					console.log("TCL: update event", event);
					TIMAAT.EventService.updateEvent(event);
					TIMAAT.EventService.updateEventTranslation(event);
				} else { // create new event
					var model = {
						id: 0,
						beginsAtDate: beginsAtDate,
						endsAtDate: endsAtDate,
						eventTranslations: [],
						tags: [],
					};
					var modelTranslation = {
						id: 0,
						name: name,
						description: description,
					};
					TIMAAT.EventService.createEvent(model, modelTranslation, TIMAAT.EventDatasets._eventAdded);
				}
				modal.modal('hide');
			});
			//  validate event data
			$('#timaat-event-meta-name').on('input', function(ev) {
				// console.log("TCL: allow saving only if data is valid");
				if ( $("#timaat-event-meta-name").val().length > 0 ) {
					$('#timaat-event-meta-submit').prop("disabled", false);
					$('#timaat-event-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-event-meta-submit').prop("disabled", true);
					$('#timaat-event-meta-submit').attr("disabled");
				}
			});
			// $('#timaat-event-meta-start').on('inputStart', function(ev) {
			// 	if ( $("#timaat-event-meta-start").val() != "" ) {
			// 		$('#timaat-event-meta-submit').prop("disabled", false);
			// 		$('#timaat-event-meta-submit').removeAttr("disabled");
			// 	} else {
			// 		$('#timaat-event-meta-submit').prop("disabled", true);
			// 		$('#timaat-event-meta-submit').attr("disabled");
			// 		}
			// });
			// $('#timaat-event-meta-end').on('input', function(ev) {
			// 	if ( $("#timaat-event-meta-end").val() >= $("#timaat-event-meta-start").val()) {
			// 		$('#timaat-event-meta-submit').prop("disabled", false);
			// 		$('#timaat-event-meta-submit').removeAttr("disabled");
			// 	} else {
			// 		$('#timaat-event-meta-submit').prop("disabled", true);
			// 		$('#timaat-event-meta-submit').attr("disabled");
			// 	}
			// });
		},

		loadEvents: function() {
    	// console.log("TCL: loadEvents: function()");
			// load events
			TIMAAT.EventService.listEvents(TIMAAT.EventDatasets.setEventLists);
		},
		
		setEventLists: function(events) {
    	// console.log("TCL: setEventLists: function(events)");
    	console.log("TCL: events: ", events);
			if ( !events ) return;
			$('#timaat-event-list-loader').remove();
			// clear old UI list
			$('#timaat-event-list').empty();
			// setup model
			var evs = Array();
			events.forEach(function(event) { if ( event.id > 0 ) evs.push(new TIMAAT.Event(event)); });
			TIMAAT.EventDatasets.events = evs;
			TIMAAT.EventDatasets.events.model = events;			
		},
		
		addEvent: function() {	
    // console.log("TCL: addEvent: function()");
			$('#timaat-eventdatasets-event-meta').data('event', null);
			$('#timaat-eventdatasets-event-meta').modal('show');
		},

		_eventAdded: function(event) {
    	// console.log("TCL: _eventAdded: function(event)");
			TIMAAT.EventDatasets.events.model.push(event);
			TIMAAT.EventDatasets.events.push(new TIMAAT.Event(event));
			return event;
		},

		_eventRemoved: function(event) {
    console.log("TCL: _eventRemoved: function(event)");
    console.log("TCL: event", event);
			// sync to server
			TIMAAT.EventService.removeEvent(event);			
			event.remove();	
			// if ( TIMAAT.VideoPlayer.curEvent == event ) TIMAAT.VideoPlayer.setEvent(null);		
		}
	},
	
	// ------------------------------------------------------------------------------------------------------------------------
		
	ActorDatasets: {
		actors: null,

		init: function() {   
			TIMAAT.ActorDatasets.initActors();
		},

		load: function() {
			TIMAAT.ActorDatasets.loadActors();
		},

		initActors: function() {
			// console.log("TCL: ActorDatasets: initActors: function()");
			// attach tag editor
			$('#timaat-actor-tags').popover({
				placement: 'right',
				title: 'Actor Tags bearbeiten (datasets init function)',
				trigger: 'click',
				html: true,
				content: `<div class="input-group">
										<input class="form-control timaat-tag-input" type="text" value="">
									</div>`,
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-actor-tags').on('inserted.bs.popover', function () {
				var tags = "";
				if ( actor == null ) {
					$('.timaat-tag-input').html('Kein Actor geladen');
					return;
				} else {
					$('.timaat-tag-input').html('');					
				}
				actor.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Actor Tag hinzufügen (datasets init function)',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.ActorService.addActorTag(actor, tag, function(newtag) {
			    			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.ActorService.removeActorTag(actor, tag, function(tagname) {
			    			// find tag in model
			    			var found = -1;
			    			TIMAAT.VideoPlayer.model.video.tags.forEach(function(item, index) {
			    				if ( item.name == tagname ) found = index;
			    			});
			    			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			    	}
			    });
			});
			$('#timaat-actor-tags').on('hidden.bs.popover', function () { 
			});
			// delete actor functionality
			$('#timaat-actor-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-actor-delete');
				var actor = modal.data('actor');
				if (actor) TIMAAT.ActorDatasets._actorRemoved(actor);
				modal.modal('hide');
			});
			// add actor button
			$('#timaat-actor-add').attr('onclick','TIMAAT.ActorDatasets.addActor()');
			// add/edit actor functionality
			$('#timaat-actordatasets-actor-meta').on('show.bs.modal', function (ev) {
				// console.log("TCL: Create/Edit actor window setup");
				var modal = $(this);
				var actor = modal.data('actor');
				var heading = (actor) ? "Actor bearbeiten" : "Actor hinzufügen";
				var submit = (actor) ? "Speichern" : "Hinzufügen";
				var title = (actor) ? actor.model.name : "";

				// setup UI
				$('#actorMetaLabel').html(heading);
				$('#timaat-actor-meta-submit').html(submit);
				$("#timaat-actor-meta-title").val(title).trigger('input');
			});
			// Submit actor data
			$('#timaat-actor-meta-submit').click(function(ev) {
				// console.log("TCL: Create/Edit actor window submitted data validation");
				var modal = $('#timaat-actordatasets-actor-meta');
				var actor = modal.data('actor');
				var title = $("#timaat-actor-meta-title").val();
				if (actor) {
					actor.model.name = title;
					// console.log("TCL: actor.updateUI() - ActorDatasets:init:function()");
					// console.log("TCL: Take values from form:")
					// console.log("TCL: $(\"#timaat-actor-meta-title\").val():", $("#timaat-actor-meta-title").val());
					actor.updateUI();
					TIMAAT.ActorService.updateActor(actor);
				} else {
					TIMAAT.ActorService.createActor(title, TIMAAT.ActorDatasets._actorAdded); // TODO add actor parameters
				}
				modal.modal('hide');
			});
			//  validate actor data
			$('#timaat-actor-meta-title').on('input', function(ev) {
				// console.log("TCL: allow saving only if data is valid");
				if ( $("#timaat-actor-meta-title").val().length > 0 ) {
					$('#timaat-actor-meta-submit').prop("disabled", false);
					$('#timaat-actor-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-actor-meta-submit').prop("disabled", true);
					$('#timaat-actor-meta-submit').attr("disabled");
				}
			});
		},

		loadActors: function() {
    	// console.log("TCL: loadActors: function()");
			// load actors
			TIMAAT.ActorService.listActors(TIMAAT.ActorDatasets.setActorLists);
		},
		
		setActorLists: function(actors) {
    // console.log("TCL: setActorLists: function(actors)");
    console.log("TCL: actors", actors);
			if ( !actors ) return;
			$('#timaat-actor-list-loader').remove();
			// clear old UI list
			$('#timaat-actor-list').empty();
			// setup model
			var acts = Array();
			actors.forEach(function(actor) { if ( actor.id > 0 ) acts.push(new TIMAAT.Actor(actor)); });
			TIMAAT.ActorDatasets.actors = acts;
			TIMAAT.ActorDatasets.actors.model = actors;			
		},
		
		addActor: function() {	
    console.log("TCL: addActor: function()");
			$('#timaat-actordatasets-actor-meta').data('actor', null);
			$('#timaat-actordatasets-actor-meta').modal('show');
		},

		_actorAdded: function(actor) {
    	console.log("TCL: _actorAdded: function(actor)");
    	console.log("TCL: actor", actor);
			TIMAAT.ActorDatasets.actors.model.push(actor);
			TIMAAT.ActorDatasets.actors.push(new TIMAAT.Actor(actor));
		},

		_actorRemoved: function(actor) {
    console.log("TCL: _actorRemoved: function(actor)");
    console.log("TCL: actor", actor);
			// sync to server
			TIMAAT.ActorService.removeActor(actor);			
			actor.remove();	
			// if ( TIMAAT.VideoPlayer.curActor == actor ) TIMAAT.VideoPlayer.setActor(null);		
		},

	},

	// ------------------------------------------------------------------------------------------------------------------------
	
	LocationDatasets: {
		locations: null,
		locationTypes: null,
		countries: null,
		provinces: null,
		counties: null,
		cities: null,
		streets: null,

		init: function() {
			TIMAAT.LocationDatasets.initLocations();
			TIMAAT.LocationDatasets.initLocationTypes();
			TIMAAT.LocationDatasets.initCountries();
			TIMAAT.LocationDatasets.initProvinces();
			TIMAAT.LocationDatasets.initCounties();
			TIMAAT.LocationDatasets.initCities();
			TIMAAT.LocationDatasets.initStreets();
		},
		
		initLocationTypes: function() {
			// delete locationType functionality
			$('#timaat-locationtype-delete-submit').click(function(ev) {
				var modal = $('#timaat-locationdatasets-locationtype-delete');
				var locationType = modal.data('locationType');
				if (locationType) TIMAAT.LocationDatasets._locationTypeRemoved(locationType);
				modal.modal('hide');
			});
			// add locationType button
			$('#timaat-locationtype-add').attr('onclick','TIMAAT.LocationDatasets.addLocationType()');
			// add/edit locationType functionality
			$('#timaat-locationdatasets-locationtype-meta').on('show.bs.modal', function (ev) {
				// Create/Edit locationType window setup
				var modal = $(this);
				var locationType = modal.data('locationType');				
				var heading = (locationType) ? "LocationType bearbeiten" : "LocationType hinzufügen";
				var submit = (locationType) ? "Speichern" : "Hinzufügen";
				var type = (locationType) ? locationType.model.type : 0;
				// setup UI
				$('#locationTypeMetaLabel').html(heading);
				$('#timaat-locationtype-meta-submit').html(submit);
				$("#timaat-locationtype-meta-name").val(type).trigger('input');
			});
			// Submit locationType data
			$('#timaat-locationtype-meta-submit').click(function(ev) {
				// Create/Edit locationType window submitted data validation;
				var modal = $('#timaat-locationdatasets-locationtype-meta');
				var locationType = modal.data('locationType');
				var type = $("#timaat-locationtype-meta-name").val();

				if (locationType) {
					locationType.model.location.locationTypeTranslations[0].type = type;
					locationType.updateUI();
					TIMAAT.LocationService.updateLocationType(locationType);
					TIMAAT.LocationService.updateLocationTypeTranslation(locationType);
				} else { // create new locationType
					var model = {
						id: 0,
						locationTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					}
					TIMAAT.LocationService.createLocationType(model, modelTranslation, TIMAAT.LocationDatasets._locationTypeAdded); // TODO add locationType parameters
				}
				modal.modal('hide');
			});
			// validate locationType data		
			// TODO validate all required fields			
			$('#timaat-locationtype-meta-name').on('input', function(ev) {
				if ( $("#timaat-locationtype-meta-name").val().length > 0 ) {
					$('#timaat-locationtype-meta-submit').prop("disabled", false);
					$('#timaat-locationtype-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-locationtype-meta-submit').prop("disabled", true);
					$('#timaat-locationtype-meta-submit').attr("disabled");
				}
			});
		},

		initLocations: function() {
			// console.log("TCL: LocationDatasets: initLocations: function()");		
			// delete location functionality
			$('#timaat-location-delete-submit').click(function(ev) {
				var modal = $('#timaat-locationdatasets-location-delete');
				var location = modal.data('location');
				if (location) TIMAAT.LocationDatasets._locationRemoved(location);
				modal.modal('hide');
			});
			// add location button
			$('#timaat-location-add').attr('onclick','TIMAAT.LocationDatasets.addLocation()');
			// add/edit location functionality
			$('#timaat-locationdatasets-location-meta').on('show.bs.modal', function (ev) {
				// Create/Edit location window setup
				var modal = $(this);
				var location = modal.data('location');				
				var heading = (location) ? "Location bearbeiten" : "Location hinzufügen";
				var submit = (location) ? "Speichern" : "Hinzufügen";
				var name = (location) ? location.model.locationTranslations[0].name : "";
				var typeId = (location) ? location.model.locationType.id : "";

				// setup UI
				$('#locationMetaLabel').html(heading);
				$('#timaat-location-meta-submit').html(submit);
				$("#timaat-location-meta-name").val(name).trigger('input');
				$("#timaat-location-meta-locationtype-id").val(typeId);
			});

			// Submit location data
			$('#timaat-location-meta-submit').click(function(ev) {
				// Create/Edit location window submitted data validation
				var modal = $('#timaat-locationdatasets-location-meta');
				var location = modal.data('location');
				var name = $("#timaat-location-meta-name").val();
				var typeSelector = document.getElementById("timaat-location-meta-locationtype-id");
				var typeId = Number(typeSelector.options[typeSelector.selectedIndex].value);

				if (location) {
					location.model.locationTranslations[0].name = name;
					location.model.locationType.id = typeId;
					location.updateUI();
					TIMAAT.LocationDatasets.updateLocation(location);   
				} else { // create new location
					var model = {
						id: 0,
						locationType: {
							id: typeId,
						},
						locationTranslations: [],
					};
					console.log("TCL: model", model);
					var modelTranslation = {
						id: 0,
						name: name,
					};
					// no callback should be required anymore
					// TIMAAT.LocationDatasets.createLocation(model, modelTranslation, TIMAAT.LocationDatasets._locationAdded);
					TIMAAT.LocationDatasets.createLocation(model, modelTranslation);
				}
				modal.modal('hide');
			});
			// validate location data	
			// TODO: validate all required fields
			$('#timaat-location-meta-name').on('input', function(ev) {
				if ( $("#timaat-location-meta-name").val().length > 0) {
					$('#timaat-location-meta-submit').prop("disabled", false);
					$('#timaat-location-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-location-meta-submit').prop("disabled", true);
					$('#timaat-location-meta-submit').attr("disabled");
				}
			});
		},

		initCountries: function() {
			// console.log("TCL: LocationDatasets: initCountries: function()");		
			// delete country functionality
			$('#timaat-country-delete-submit').click(function(ev) {
				var modal = $('#timaat-locationdatasets-country-delete');
				var country = modal.data('country');
				if (country) TIMAAT.LocationDatasets._locationSubtypeRemoved("country", country);
				modal.modal('hide');
			});

			// add country button
			$('#timaat-country-add').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("country")');

			// add/edit country functionality
			$('#timaat-locationdatasets-country-meta').on('show.bs.modal', function (ev) {
				// Create/Edit country window setup
				var modal = $(this);
				var country = modal.data('country');
				var heading = (country) ? "Country bearbeiten" : "Country hinzufügen";
				var submit = (country) ? "Speichern" : "Hinzufügen";
				// location data
				var name = (country) ? country.model.location.locationTranslations[0].name : "";
				// country data
				var internationalDialingPrefix = (country) ? country.model.internationalDialingPrefix : "";
				var trunkPrefix = (country) ? country.model.trunkPrefix : "";
				var countryCallingCode = (country) ? country.model.countryCallingCode : "";
				var timeZone = (country) ? country.model.timeZone : "";
				var daylightSavingTime = (country) ? country.model.daylightSavingTime : "";

				// setup UI
				$('#countryMetaLabel').html(heading);
				$('#timaat-country-meta-submit').html(submit);
				// location data
				$("#timaat-country-meta-name").val(name).trigger('input');
				// country data
				$("#timaat-country-meta-idp").val(internationalDialingPrefix);
				$("#timaat-country-meta-tp").val(trunkPrefix);
				$("#timaat-country-meta-ccc").val(countryCallingCode);
				$("#timaat-country-meta-tz").val(timeZone);
				$("#timaat-country-meta-dst").val(daylightSavingTime);
			});

			// Submit country data
			$('#timaat-country-meta-submit').click(function(ev) {
				// Create/Edit country window submitted data validation
				var modal = $('#timaat-locationdatasets-country-meta');
				var country = modal.data('country');
				// location data
				var name = $("#timaat-country-meta-name").val();
				// country data
				var internationalDialingPrefix = $("#timaat-country-meta-idp").val();
				var trunkPrefix = $("#timaat-country-meta-tp").val();
				var countryCallingCode = $("#timaat-country-meta-ccc").val();
				var timeZone = $("#timaat-country-meta-tz").val();
				var daylightSavingTime = $("#timaat-country-meta-dst").val();

				if (country) {
					// location data
					country.model.location.locationTranslations[0].name = name;
					// country data
					country.model.internationalDialingPrefix = internationalDialingPrefix;
					country.model.trunkPrefix = trunkPrefix;
					country.model.countryCallingCode = countryCallingCode;
					country.model.timeZone = timeZone;
					country.model.daylightSavingTime = daylightSavingTime;

					country.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("country", country);
				} else {
					var model = {
						locationId: 0,
						internationalDialingPrefix: internationalDialingPrefix,
						trunkPrefix: trunkPrefix,
						countryCallingCode: countryCallingCode,
						timeZone: timeZone,
						daylightSavingTime: daylightSavingTime,
					};
					var location = {
							id: 0,
							locationType: {
								id: 1 // 1 = Country. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("country", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate country data
			// TODO validate all required fields
			$('#timaat-country-meta-name').on('input', function(ev) {
				if ( $("#timaat-country-meta-name").val().length > 0 ) {
					$('#timaat-country-meta-submit').prop("disabled", false);
					$('#timaat-country-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-country-meta-submit').prop("disabled", true);
					$('#timaat-country-meta-submit').attr("disabled");
				}
			});
		},

		initProvinces: function() {
			// console.log("TCL: LocationDatasets: initProvinces: function()");		
			// delete province functionality
			$('#timaat-province-delete-submit').click(function(ev) {
				var modal = $('#timaat-locationdatasets-province-delete');
				var province = modal.data('province');
				if (province) TIMAAT.LocationDatasets._locationSubtypeRemoved("province", province);
				modal.modal('hide');
			});

			// add province button
			$('#timaat-province-add').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("province")');

			// add/edit province functionality
			$('#timaat-locationdatasets-province-meta').on('show.bs.modal', function (ev) {
				// Create/Edit province window setup
				var modal = $(this);
				var province = modal.data('province');
				var heading = (province) ? "Province bearbeiten" : "Province hinzufügen";
				var submit = (province) ? "Speichern" : "Hinzufügen";
				// location data
				var name = (province) ? province.model.location.locationTranslations[0].name : "";
				// province data

				// setup UI
				$('#provinceMetaLabel').html(heading);
				$('#timaat-province-meta-submit').html(submit);
				// location data
				$("#timaat-province-meta-name").val(name).trigger('input');
				// province data
			});

			// Submit province data
			$('#timaat-province-meta-submit').click(function(ev) {
				// Create/Edit province window submitted data validation
				var modal = $('#timaat-locationdatasets-province-meta');
				var province = modal.data('province');
				// location data
				var name = $("#timaat-province-meta-name").val();
				// province data

				if (province) {
					// location data
					province.model.location.locationTranslations[0].name = name;
					// province data

					province.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("province", province);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 2 // 2 = Province. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("province", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate province data
			// TODO validate all required fields
			$('#timaat-province-meta-name').on('input', function(ev) {
				if ( $("#timaat-province-meta-name").val().length > 0 ) {
					$('#timaat-province-meta-submit').prop("disabled", false);
					$('#timaat-province-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-province-meta-submit').prop("disabled", true);
					$('#timaat-province-meta-submit').attr("disabled");
				}
			});
		},

		initCounties: function() {
			// console.log("TCL: LocationDatasets: initCounties: function()");		
			// delete county functionality
			$('#timaat-county-delete-submit').click(function(ev) {
				var modal = $('#timaat-locationdatasets-county-delete');
				var county = modal.data('county');
				if (county) TIMAAT.LocationDatasets._locationSubtypeRemoved("county", county);
				modal.modal('hide');
			});

			// add county button
			$('#timaat-county-add').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("county")');

			// add/edit county functionality
			$('#timaat-locationdatasets-county-meta').on('show.bs.modal', function (ev) {
				// Create/Edit county window setup
				var modal = $(this);
				var county = modal.data('county');
				var heading = (county) ? "County bearbeiten" : "County hinzufügen";
				var submit = (county) ? "Speichern" : "Hinzufügen";
				// location data
				var name = (county) ? county.model.location.locationTranslations[0].name : "";
				// county data

				// setup UI
				$('#countyMetaLabel').html(heading);
				$('#timaat-county-meta-submit').html(submit);
				// location data
				$("#timaat-county-meta-name").val(name).trigger('input');
				// county data
			});

			// Submit county data
			$('#timaat-county-meta-submit').click(function(ev) {
				// Create/Edit county window submitted data validation
				var modal = $('#timaat-locationdatasets-county-meta');
				var county = modal.data('county');
				// location data
				var name = $("#timaat-county-meta-name").val();
				// county data

				if (county) {
					// location data
					county.model.location.locationTranslations[0].name = name;
					// county data

					county.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("county", county);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 3 // 3 = County. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("county", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate county data
			// TODO validate all required fields
			$('#timaat-county-meta-name').on('input', function(ev) {
				if ( $("#timaat-county-meta-name").val().length > 0 ) {
					$('#timaat-county-meta-submit').prop("disabled", false);
					$('#timaat-county-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-county-meta-submit').prop("disabled", true);
					$('#timaat-county-meta-submit').attr("disabled");
				}
			});
		},

		initCities: function() {
			// console.log("TCL: LocationDatasets: initCities: function()");		
			// delete city functionality
			$('#timaat-city-delete-submit').click(function(ev) {
				var modal = $('#timaat-locationdatasets-city-delete');
				var city = modal.data('city');
				if (city) TIMAAT.LocationDatasets._locationSubtypeRemoved("city", city);
				modal.modal('hide');
			});

			// add city button
			$('#timaat-city-add').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("city")');

			// add/edit city functionality
			$('#timaat-locationdatasets-city-meta').on('show.bs.modal', function (ev) {
				// Create/Edit city window setup
				var modal = $(this);
				var city = modal.data('city');
				var heading = (city) ? "City bearbeiten" : "City hinzufügen";
				var submit = (city) ? "Speichern" : "Hinzufügen";
				// location data
				var name = (city) ? city.model.location.locationTranslations[0].name : "";
				// city data

				// setup UI
				$('#cityMetaLabel').html(heading);
				$('#timaat-city-meta-submit').html(submit);
				// location data
				$("#timaat-city-meta-name").val(name).trigger('input');
				// city data
			});

			// Submit city data
			$('#timaat-city-meta-submit').click(function(ev) {
				// Create/Edit city window submitted data validation
				var modal = $('#timaat-locationdatasets-city-meta');
				var city = modal.data('city');
				// location data
				var name = $("#timaat-city-meta-name").val();
				// city data

				if (city) {
					// location data
					city.model.location.locationTranslations[0].name = name;
					// city data

					city.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("city", city);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 4 // 4 = City. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("city", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate city data
			// TODO validate all required fields
			$('#timaat-city-meta-name').on('input', function(ev) {
				if ( $("#timaat-city-meta-name").val().length > 0 ) {
					$('#timaat-city-meta-submit').prop("disabled", false);
					$('#timaat-city-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-city-meta-submit').prop("disabled", true);
					$('#timaat-city-meta-submit').attr("disabled");
				}
			});
		},

		initStreets: function() {
			// console.log("TCL: LocationDatasets: initStreets: function()");		
			// delete street functionality
			$('#timaat-street-delete-submit').click(function(ev) {
				var modal = $('#timaat-locationdatasets-street-delete');
				var street = modal.data('street');
				if (street) TIMAAT.LocationDatasets._locationSubtypeRemoved("street", street);
				modal.modal('hide');
			});

			// add street button
			$('#timaat-street-add').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("street")');

			// add/edit street functionality
			$('#timaat-locationdatasets-street-meta').on('show.bs.modal', function (ev) {
				// Create/Edit street window setup
				var modal = $(this);
				var street = modal.data('street');
				var heading = (street) ? "Street bearbeiten" : "Street hinzufügen";
				var submit = (street) ? "Speichern" : "Hinzufügen";
				// location data
				var name = (street) ? street.model.location.locationTranslations[0].name : "";
				// street data

				// setup UI
				$('#streetMetaLabel').html(heading);
				$('#timaat-street-meta-submit').html(submit);
				// location data
				$("#timaat-street-meta-name").val(name).trigger('input');
				// street data
			});

			// Submit street data
			$('#timaat-street-meta-submit').click(function(ev) {
				// Create/Edit street window submitted data validation
				var modal = $('#timaat-locationdatasets-street-meta');
				var street = modal.data('street');
				// location data
				var name = $("#timaat-street-meta-name").val();
				// street data

				if (street) {
					// location data
					street.model.location.locationTranslations[0].name = name;
					// street data

					street.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("street", street);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 5 // 5 = Street. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("street", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate street data
			// TODO validate all required fields
			$('#timaat-street-meta-name').on('input', function(ev) {
				if ( $("#timaat-street-meta-name").val().length > 0 ) {
					$('#timaat-street-meta-submit').prop("disabled", false);
					$('#timaat-street-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-street-meta-submit').prop("disabled", true);
					$('#timaat-street-meta-submit').attr("disabled");
				}
			});
		},

		load: function() {
			TIMAAT.LocationDatasets.loadLocations();
			TIMAAT.LocationDatasets.loadLocationTypes();
			TIMAAT.LocationDatasets.loadAllLocationSubtypes();   
		},

		loadLocationTypes: function() {
			// console.log("TCL: loadLocationTypes: function()");
			// load locations
			TIMAAT.LocationService.listLocationTypes(TIMAAT.LocationDatasets.setLocationTypeLists);
		},

		loadLocations: function() {
			// console.log("TCL: loadLocations: function()");
			// load locations
			TIMAAT.LocationService.listLocations(TIMAAT.LocationDatasets.setLocationLists);
		},

		loadLocationSubtype: function(locationSubtype) {
			switch (locationSubtype) {
				case "country":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setCountryLists);
					break;
				case "province":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setProvinceLists);
					break;
				case "county":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setCountyLists);
					break;
				case "city":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setCityLists);
					break;
				case "street":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setStreetLists);
					break;
			};
		},

		loadAllLocationSubtypes: function() {
			TIMAAT.LocationService.listLocationSubtype("country", TIMAAT.LocationDatasets.setCountryLists);
			TIMAAT.LocationService.listLocationSubtype("province", TIMAAT.LocationDatasets.setProvinceLists);
			TIMAAT.LocationService.listLocationSubtype("county", TIMAAT.LocationDatasets.setCountyLists);
			TIMAAT.LocationService.listLocationSubtype("city", TIMAAT.LocationDatasets.setCityLists);
			TIMAAT.LocationService.listLocationSubtype("street", TIMAAT.LocationDatasets.setStreetLists);
		},

		setLocationTypeLists: function(locationTypes) {
			console.log("TCL: locationTypes", locationTypes);
			if ( !locationTypes ) return;
			$('#timaat-locationtype-list-loader').remove();
			// clear old UI list
			$('#timaat-locationtype-list').empty();
			// setup model
			var locTypes = Array();
			locationTypes.forEach(function(locationType) { if ( locationType.id > 0 ) locTypes.push(new TIMAAT.LocationType(locationType)); });
			TIMAAT.LocationDatasets.locationTypes = locTypes;
			TIMAAT.LocationDatasets.locationTypes.model = locationTypes;
		},
		
		setLocationLists: function(locations) {
			console.log("TCL: locations", locations);
			if ( !locations ) return;
			$('#timaat-location-list-loader').remove();
			// clear old UI list
			$('#timaat-location-list').empty();
			// setup model
			var locs = Array();
			locations.forEach(function(location) { if ( location.id > 0 ) locs.push(new TIMAAT.Location(location)); });
			TIMAAT.LocationDatasets.locations = locs;
			TIMAAT.LocationDatasets.locations.model = locations;
		},
		
		setCountryLists: function(countries) {
			// console.log("TCL: setCountryLists: function(countries)");
			console.log("TCL: countries", countries);
			if ( !countries ) return;
			$('#timaat-country-list-loader').remove();
			// clear old UI list
			$('#timaat-country-list').empty();
			// setup model
			var locs = Array();
			countries.forEach(function(country) { 
				if ( country.id > 0 )
					locs.push(new TIMAAT.Country(country));
			});
			TIMAAT.LocationDatasets.countries = locs;
			TIMAAT.LocationDatasets.countries.model = countries;
		},

		setProvinceLists: function(provinces) {
			// console.log("TCL: setProvinceLists: function(provinces)");
			console.log("TCL: provinces", provinces);
			if ( !provinces ) return;
			$('#timaat-province-list-loader').remove();
			// clear old UI list
			$('#timaat-province-list').empty();
			// setup model
			var locs = Array();
			provinces.forEach(function(province) { 
				if ( province.id > 0 )
					locs.push(new TIMAAT.Province(province));
			});
			TIMAAT.LocationDatasets.provinces = locs;
			TIMAAT.LocationDatasets.provinces.model = provinces;
		},

		setCountyLists: function(counties) {
			// console.log("TCL: setCountyLists: function(counties)");
			console.log("TCL: counties", counties);
			if ( !counties ) return;
			$('#timaat-county-list-loader').remove();
			// clear old UI list
			$('#timaat-county-list').empty();
			// setup model
			var locs = Array();
			counties.forEach(function(county) { 
				if ( county.id > 0 )
					locs.push(new TIMAAT.County(county));
			});
			TIMAAT.LocationDatasets.counties = locs;
			TIMAAT.LocationDatasets.counties.model = counties;
		},

		setCityLists: function(cities) {
			// console.log("TCL: setCityLists: function(cities)");
			console.log("TCL: cities", cities);
			if ( !cities ) return;
			$('#timaat-city-list-loader').remove();
			// clear old UI list
			$('#timaat-city-list').empty();
			// setup model
			var locs = Array();
			cities.forEach(function(city) { 
				if ( city.id > 0 )
					locs.push(new TIMAAT.City(city));
			});
			TIMAAT.LocationDatasets.cities = locs;
			TIMAAT.LocationDatasets.cities.model = cities;
		},

		setStreetLists: function(streets) {
			// console.log("TCL: setStreetLists: function(streets)");
			console.log("TCL: streets", streets);
			if ( !streets ) return;
			$('#timaat-street-list-loader').remove();
			// clear old UI list
			$('#timaat-street-list').empty();
			// setup model
			var locs = Array();
			streets.forEach(function(street) { 
				if ( street.id > 0 )
					locs.push(new TIMAAT.Street(street));
			});
			TIMAAT.LocationDatasets.streets = locs;
			TIMAAT.LocationDatasets.streets.model = streets;
		},

		addLocation: function() {	
			// console.log("TCL: addLocation: function()");
			$('#timaat-locationdatasets-location-meta').data('location', null);
			$('#timaat-locationdatasets-location-meta').modal('show');
		},

		addLocationSubtype: function(locationSubtype) {	
			switch (locationSubtype) {
				case "country":
					$('#timaat-locationdatasets-country-meta').data('country', null);
					$('#timaat-locationdatasets-country-meta').modal('show');
					break;
				case "province":
					$('#timaat-locationdatasets-province-meta').data('province', null);
					$('#timaat-locationdatasets-province-meta').modal('show');
					break;
				case "county":
					$('#timaat-locationdatasets-county-meta').data('county', null);
					$('#timaat-locationdatasets-county-meta').modal('show');
					break;
				case "city":
					$('#timaat-locationdatasets-city-meta').data('city', null);
					$('#timaat-locationdatasets-city-meta').modal('show');
					break;
				case "street":
					$('#timaat-locationdatasets-street-meta').data('street', null);
					$('#timaat-locationdatasets-street-meta').modal('show');
					break;
			}
		},
	
		createLocation: async function(locationModel, locationModelTranslation) {
		// NO LOCATION SHOULD BE CREATED DIRECTLY. CREATE COUNTRY, CITY, ETC. INSTEAD
		// This routine can be used to create empty locations of a certain type
		// console.log("TCL: createLocation -> locationModel, locationModelTranslation", locationModel, locationModelTranslation);
			try {
				// create location
				var newLocationModel = await TIMAAT.LocationService.createLocation(locationModel);

				// create location translation with location id
				var newTranslationData = await TIMAAT.LocationService.createLocationTranslation(newLocationModel, locationModelTranslation);
				newLocationModel.locationTranslations[0] = newTranslationData;

				// create country/city/etc depending on country type
				// TODO switch (locationModel.locationType)

				// push new location to dataset model
				await TIMAAT.LocationDatasets._locationAdded(newLocationModel);
			} catch(error) {
				console.log( "error: ", error);
			};
			// location.updateUI();
		},

		createLocationSubtype: async function(locationSubtype, locationSubtypeModel, locationModel, locationModelTranslation) {
			// console.log("TCL: createLocationSubtype -> locationModel, locationModelTranslation, locationSubtypeModel", locationModel, locationModelTranslation, locationSubtypeModel);
			try {
				// create location
				var newLocationModel = await TIMAAT.LocationService.createLocation(locationModel);

				// create location translation with location id
				await TIMAAT.LocationService.createLocationTranslation(newLocationModel, locationModelTranslation);
				newLocationModel.locationTranslations[0] = locationModelTranslation;

				// push new location to dataset model
				await TIMAAT.LocationDatasets._locationAdded(newLocationModel);

				// create locationSubtype with location id
				locationSubtypeModel.locationId = newLocationModel.id;
				var newLocationSubtypeModel = await TIMAAT.LocationService.createLocationSubtype(locationSubtype, newLocationModel, locationSubtypeModel);

				// push new locationSubtype to dataset model
				await TIMAAT.LocationDatasets._locationSubtypeAdded(locationSubtype, newLocationSubtypeModel);

			} catch(error) {
				console.log( "error: ", error);
			};
			// location.updateUI();
		},

		updateLocation: async function(location) {
		console.log("TCL: updateLocation async function -> location at beginning of update process: ", location);
			try {
				// update data that is part of location (includes updating last edited by/at)
				var tempLocationModel = await TIMAAT.LocationService.updateLocation(location.model);
				location.model.locationType.id = tempLocationModel.locationType.id;
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of location translation
				// TODO: send request for each translation or for all translations
				console.log("TCL: location", location);
				var tempLocationTranslation = await	TIMAAT.LocationService.updateLocationTranslation(location.model.id, location.model.locationTranslations[0]);
				// location.model.locationTranslations[0].name = tempLocationTranslation.name;			
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		updateLocationSubtype: async function(locationSubtype, locationSubtypeData) {
			console.log("TCL: updateLocationSubtype async function -> locationSubtype, locationSubtypeData at beginning of update process: ", locationSubtype, locationSubtypeData);
			try {
				// update data that is part of locationSubtype
				var tempLocationSubtypeModel = await TIMAAT.LocationService.updateLocationSubtype(locationSubtype, locationSubtypeData.model);
			} catch(error) {
				console.log( "error: ", error);

			};
			try {
				// update data that is part of location and its translation
				var locationSubtypeLocationModel = locationSubtypeData.model.location;
        console.log("TCL: locationSubtypeLocationModel", locationSubtypeLocationModel);
				var tempLocationSubtypeModelUpdate = await TIMAAT.LocationService.updateLocation(locationSubtypeLocationModel);

				// update data that is part of location translation
				// var locationSubtypeLocation = locationSubtypeData.location;
				console.log("TCL: locationSubtypeData", locationSubtypeData);
				var tempLocationTranslation = await	TIMAAT.LocationService.updateLocationTranslation(locationSubtypeData.model.id, locationSubtypeData.model.location.locationTranslations[0]);
				// location.model.locationTranslations[0].name = tempLocationTranslation.name;			
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		_locationAdded: async function(location) {
			// console.log("TCL: _locationAdded: function(location)");
			// console.log("TCL: location", location);
			TIMAAT.LocationDatasets.locations.model.push(location);
			TIMAAT.LocationDatasets.locations.push(new TIMAAT.Location(location));
			// return location;
		},
		
		_locationSubtypeAdded: async function(locationSubtype, locationSubtypeData) {
			// console.log("TCL: _countryAdded: function(country)");
			switch (locationSubtype) {
				case "country":
					TIMAAT.LocationDatasets.countries.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.countries.push(new TIMAAT.Country(locationSubtypeData));
					break;
				case "province":
					TIMAAT.LocationDatasets.provinces.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.provinces.push(new TIMAAT.Province(locationSubtypeData));
					break;
				case "county":
					TIMAAT.LocationDatasets.counties.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.counties.push(new TIMAAT.County(locationSubtypeData));
					break;
				case "city":
					TIMAAT.LocationDatasets.cities.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.cities.push(new TIMAAT.City(locationSubtypeData));
					break;
				case "street":
					TIMAAT.LocationDatasets.streets.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.streets.push(new TIMAAT.Street(locationSubtypeData));
					break;
			};
		},

		_locationRemoved: function(location) {
			// console.log("TCL: _locationRemoved: function(location)");
			// console.log("TCL: location", location);
			// sync to server
			TIMAAT.LocationService.removeLocation(location);
			location.remove();
		},

		_locationSubtypeRemoved: function(locationSubtype, locationSubtypeData) {
			// console.log("TCL: _locationSubtypeRemoved: function(locationSubtype, locationSubtypeData)");
			// sync to server
		 TIMAAT.LocationService.removeLocationSubtype(locationSubtype, locationSubtypeData)
		 locationSubtypeData.remove();
		},

	},

	// ------------------------------------------------------------------------------------------------------------------------
		
	MediaDatasets: {
		media: null,
		mediaTypes: null,
		audios: null,
		documents: null,
		images: null,
		softwares: null,
		texts: null,
		videos: null,
		videogames: null,	

		init: function() {
			TIMAAT.MediaDatasets.initMedia();
			TIMAAT.MediaDatasets.initMediaTypes();
			TIMAAT.MediaDatasets.initAudios();
			TIMAAT.MediaDatasets.initDocuments();
			TIMAAT.MediaDatasets.initImages();
			TIMAAT.MediaDatasets.initSoftwares();
			TIMAAT.MediaDatasets.initTexts();
			TIMAAT.MediaDatasets.initVideos();
			TIMAAT.MediaDatasets.initVideogames();
		},

		initMediaTypes: function() {
			// console.log("TCL: MediaDatasets: initMediaTypes: function()");		
			// delete mediaType functionality
			$('#timaat-mediatype-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-medium-type-delete');
				var mediaType = modal.data('mediaType');
				if (mediaType) TIMAAT.MediaDatasets._mediaTypeRemoved(mediaType);
				modal.modal('hide');
			});
			// add mediaType button
			$('#timaat-mediatype-add').attr('onclick','TIMAAT.MediaDatasets.addMediaType()');

			// add/edit mediaType functionality
			$('#timaat-mediadatasets-medium-type-meta').on('show.bs.modal', function (ev) {
				// Create/Edit mediaType window setup
				var modal = $(this);
				var mediaType = modal.data('mediaType');				
				var heading = (mediaType) ? "MediaType bearbeiten" : "MediaType hinzufügen";
				var submit = (mediaType) ? "Speichern" : "Hinzufügen";
				var type = (mediaType) ? mediaType.model.type : 0;
				var hasVisual = (mediaType) ? mediaType.model.hasVisual : false;
				var hasAudio = (mediaType) ? mediaType.model.hasAudio : false;
				var hasContent = (mediaType) ? mediaType.model.hasContent : false;
				// setup UI
				$('#mediaTypeMetaLabel').html(heading);
				$('#timaat-mediatype-meta-submit').html(submit);
				$("#timaat-mediatype-meta-name").val(type).trigger('input');
				$("#timaat-mediatype-meta-hasvisual").val(hasVisual);
				$("#timaat-mediatype-meta-hasaudio").val(hasAudio);
				$("#timaat-mediatype-meta-hascontent").val(hasContent);
			});

			// Submit mediaType data
			$('#timaat-mediatype-meta-submit').click(function(ev) {
				// Create/Edit mediaType window submitted data validation
				var modal = $('#timaat-mediadatasets-medium-type-meta');
				var mediaType = modal.data('mediaType');
				var type = $("#timaat-mediatype-meta-name").val();
				var hasVisual = $("#timaat-mediatype-meta-has-visual").val();
				var hasAudio = $("#timaat-mediatype-meta-has-audio").val();
				var hasContent = $("#timaat-mediatype-meta-has-content").val();

				if (mediaType) {
					mediaType.model.medium.mediaTypeTranslations[0].type = type;
					mediaType.model.hasVisual = hasVisual;
					mediaType.model.hasAudio = hasAudio;
					mediaType.model.hasContent = hasContent;
					mediaType.updateUI();
					TIMAAT.MediaService.updateMediaType(mediaType);
					TIMAAT.MediaService.updateMediaTypeTranslation(mediaType);
				} else { // create new mediaType
					var model = {
						id: 0,
						hasVisual: hasVisual,
						hasAudio: hasAudio,
						hasContent: hasContent,
						mediaTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					}
					TIMAAT.MediaService.createMediaType(model, modelTranslation, TIMAAT.MediaDatasets._mediaTypeAdded); // TODO add mediaType parameters
				}
				modal.modal('hide');
			});

			// validate mediaType data	
			// TODO validate all required fields				
			$('#timaat-mediatype-meta-name').on('input', function(ev) {
				if ( $("#timaat-mediatype-meta-name").val().length > 0 ) {
					$('#timaat-mediatype-meta-submit').prop("disabled", false);
					$('#timaat-mediatype-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-mediatype-meta-submit').prop("disabled", true);
					$('#timaat-mediatype-meta-submit').attr("disabled");
				}
			});
		},

		initMedia: function() {
			// console.log("TCL: MediaDatasets: initMedia: function()");		
			// delete button functionality
			$('#timaat-medium-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-medium-delete');
				var medium = modal.data('medium');
				if (medium) TIMAAT.MediaDatasets._mediumRemoved(medium);
				modal.modal('hide');
				$('#timaat-mediadatasets-medium-form').hide();
			});

			// add medium button functionality (opens form)
			$('#timaat-medium-add').attr('onclick','TIMAAT.MediaDatasets.addMedium()');
			
			// Submit medium data button functionality
			$("#timaat-medium-meta-submit").on('click', function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-medium-form").valid()) return false;

				// the original medium model (in case of editing an existing medium)
				var medium = $("#timaat-mediadatasets-medium-form").data("medium");				
				// Create/Edit medium window submitted data
				var formData = $("#timaat-mediadatasets-medium-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				// console.log("TCL: formDataObject", formDataObject);

				if (medium) { // update medium
          // console.log("TCL: medium", medium);
					// medium data
					medium.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
          // console.log("TCL: releaseDate", medium.model.releaseDate);
					medium.model.copyright = formDataObject.copyright;
					medium.model.remark = formDataObject.remark;
					// title data
					medium.model.title.name = formDataObject.primaryTitle;
					medium.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// medium.model.mediaType.id = Number(formDataObject.typeId); // Do not change type 
					// source data
					medium.model.sources[0].url = formDataObject.sourceUrl;
					medium.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					medium.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
          // console.log("TCL: lastAccessed", medium.model.sources[0].lastAccessed);
					medium.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;

					medium.updateUI();
					TIMAAT.MediaDatasets.updateMedium(medium);
				} else { // create new medium
					var model = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: Number(formDataObject.typeId),
						},
						// work: {
						// 	id: 1,  // TODO implement work
						// },
						// mediumTranslations: [],
					};
					// console.log("TCL: releaseDate", model.releaseDate);
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),            
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// console.log("TCL: lastAccessed", source.lastAccessed);
					// Medium has no translation table at the moment
					// TIMAAT.MediaDatasets.createMedium(model, modelTranslation, TIMAAT.MediaDatasets._mediumAdded);
					TIMAAT.MediaDatasets.createMedium(model, title, source);
				};
				$('#timaat-mediadatasets-medium-form').data('medium', null);
				$('#timaat-mediadatasets-medium-form').trigger('reset');
				$('#timaat-mediadatasets-medium-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-medium-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-medium-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-medium-form').data('medium', null);
				$('#timaat-mediadatasets-medium-form').trigger('reset');
				mediumFormValidator.resetForm();
				$('#timaat-mediadatasets-medium-form').hide();
			});
		},

		initAudios: function() {
			// console.log("TCL: MediaDatasets: initAudios: function()");		
			// delete audio functionality
			$('#timaat-audio-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-audio-delete');
				var audio = modal.data('audio');
				if (audio) TIMAAT.MediaDatasets._mediumSubtypeRemoved("audio", audio);
				modal.modal('hide');
				$('#timaat-mediadatasets-audio-form').hide();
			});

			// add audio button functionality (opens form)
			$('#timaat-audio-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("audio")');

			// Submit audio data button functionality
			$('#timaat-audio-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-audio-form").valid()) return false;

				// the original audio model (in case of editing an existing audio)
				var audio = $("#timaat-mediadatasets-audio-form").data("audio");				
				// Create/Edit audio window submitted data
				var formData = $("#timaat-mediadatasets-audio-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (audio) { // update audio
					// medium data
					audio.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					audio.model.medium.copyright = formDataObject.copyright;
					audio.model.medium.remark = formDataObject.remark;
					// title data
					audio.model.medium.title.name = formDataObject.primaryTitle;
					audio.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					audio.model.medium.sources[0].url = formDataObject.sourceUrl;
					audio.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					audio.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					audio.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// audio data
					audio.model.length = TIMAAT.Util.parseTime(formDataObject.length);
					// TODO: audiocodecinformation

					audio.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("audio", audio);

				} else { // create new audio
					var model = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct audio information
							id: 1,
						},
						length: TIMAAT.Util.parseTime(formDataObject.length),
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 1 // 1 = Audio. TODO check clause to find proper id
						},
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or audio at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					TIMAAT.MediaDatasets.createMediumSubtype("audio", model, medium, title, source);
				}
				$('#timaat-mediadatasets-audio-form').data('audio', null);
				$('#timaat-mediadatasets-audio-form').trigger('reset');
				$('#timaat-mediadatasets-audio-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-audio-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-audio-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-audio-form').data('audio', null);
				$('#timaat-mediadatasets-audio-form').trigger('reset');
				audioFormValidator.resetForm();
				$('#timaat-mediadatasets-audio-form').hide();
			});
		},

		initDocuments: function() {
			// console.log("TCL: MediaDatasets: initDocuments: function()");		
			// delete document functionality
			$('#timaat-document-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-document-delete');
				var mediumDocument = modal.data('document');
				if (mediumDocument) TIMAAT.MediaDatasets._mediumSubtypeRemoved("document", mediumDocument);
				modal.modal('hide');
				$('#timaat-mediadatasets-document-form').hide();
			});

			// add document button functionality (opens form)
			$('#timaat-document-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("document")');

			// Submit document data button functionality
			$('#timaat-document-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-document-form").valid()) return false;

				// the original document model (in case of editing an existing document)
				var mediumDocument = $("#timaat-mediadatasets-document-form").data("document");				
				// Create/Edit document window submitted data
				var formData = $("#timaat-mediadatasets-document-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				console.log("TCL: formDataObject", formDataObject);

				if (mediumDocument) { // update document
          console.log("TCL: mediumDocument", mediumDocument);
					// medium data
					mediumDocument.medium.model.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					mediumDocument.medium.model.copyright = formDataObject.copyright;
					mediumDocument.medium.model.remark = formDataObject.remark;
					// title data
					mediumDocument.medium.model.title.name = formDataObject.primaryTitle;
					mediumDocument.medium.model.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					mediumDocument.medium.model.sources[0].url = formDataObject.sourceUrl;
					mediumDocument.medium.model.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					mediumDocument.medium.model.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					mediumDocument.medium.model.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// document data
					// currently empty

					mediumDocument.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("document", mediumDocument);

				} else { // create new document
					var model = {
						mediumId: 0,
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 2 // 2 = mediumDocument. TODO check clause to find proper id
						},
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or document at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					TIMAAT.MediaDatasets.createMediumSubtype("document", model, medium, title, source);
				}
				$('#timaat-mediadatasets-document-form').data('document', null);
				$('#timaat-mediadatasets-document-form').trigger('reset');
				$('#timaat-mediadatasets-document-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-document-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-document-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-document-form').data('document', null);
				$('#timaat-mediadatasets-document-form').trigger('reset');
				documentFormValidator.resetForm();
				$('#timaat-mediadatasets-document-form').hide();
			});

		},

		initImages: function() {
			// console.log("TCL: MediaDatasets: initImages: function()");		
			// delete image functionality
			$('#timaat-image-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-image-delete');
				var image = modal.data('image');
				if (image) TIMAAT.MediaDatasets._mediumSubtypeRemoved("image", image);
				modal.modal('hide');
				$('#timaat-mediadatasets-image-form').hide();
			});

			// add image button functionality (opens form)
			$('#timaat-image-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("image")');

			// Submit image data button functionality
			$('#timaat-image-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-image-form").valid()) return false;

				// the original image model (in case of editing an existing image)
				var image = $("#timaat-mediadatasets-image-form").data("image");				
				// Create/Edit image window submitted data
				var formData = $("#timaat-mediadatasets-image-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (image) { // update image
					// medium data
					image.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					image.model.medium.copyright = formDataObject.copyright;
					image.model.medium.remark = formDataObject.remark;
					// title data
					image.model.medium.title.name = formDataObject.primaryTitle;
					image.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					image.model.medium.sources[0].url = formDataObject.sourceUrl;
					image.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					image.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					image.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// image data
					image.model.width = formDataObject.width;
					image.model.height = formDataObject.height;
					image.model.bitDepth = formDataObject.bitDepth;

					image.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("image", image);

				} else { // create new image
					var model = {
						mediumId: 0,
						width: formDataObject.width,
						height: formDataObject.height,
						bitDepth: formDataObject.bitDepth,
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 3 // 3 = image. TODO check clause to find proper id
						},
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or image at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					TIMAAT.MediaDatasets.createMediumSubtype("image", model, medium, title, source);
				}
				$('#timaat-mediadatasets-image-form').data('image', null);
				$('#timaat-mediadatasets-image-form').trigger('reset');
				$('#timaat-mediadatasets-image-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-image-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-image-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-image-form').data('image', null);
				$('#timaat-mediadatasets-image-form').trigger('reset');
				imageFormValidator.resetForm();
				$('#timaat-mediadatasets-image-form').hide();
			});
		},

		initSoftwares: function() {
			// console.log("TCL: MediaDatasets: initSoftwares: function()");		
			// delete software functionality
			$('#timaat-software-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-software-delete');
				var software = modal.data('software');
				if (software) TIMAAT.MediaDatasets._mediumSubtypeRemoved("software", software);
				modal.modal('hide');
				$('#timaat-mediadatasets-software-form').hide();
			});

			// add software button functionality (opens form)
			$('#timaat-software-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("software")');

			// Submit software data button functionality
			$('#timaat-software-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-software-form").valid()) return false;

				// the original software model (in case of editing an existing software)
				var software = $("#timaat-mediadatasets-software-form").data("software");				
				// Create/Edit software window submitted data
				var formData = $("#timaat-mediadatasets-software-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (software) { // update software
					// medium data
					software.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					software.model.medium.copyright = formDataObject.copyright;
					software.model.medium.remark = formDataObject.remark;
					// title data
					software.model.medium.title.name = formDataObject.primaryTitle;
					software.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					software.model.medium.sources[0].url = formDataObject.sourceUrl;
					software.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					software.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					software.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// software data
					software.model.version = formDataObject.version;

					software.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("software", software);

				} else { // create new software
					var model = {
						mediumId: 0,
						version: formDataObject.version,
					};
					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 4 // 4 = Software. TODO check clause to find proper id
						},
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or software at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					TIMAAT.MediaDatasets.createMediumSubtype("software", model, medium, title, source);
				}
				$('#timaat-mediadatasets-software-form').data('software', null);
				$('#timaat-mediadatasets-software-form').trigger('reset');
				$('#timaat-mediadatasets-software-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-software-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-software-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-software-form').data('software', null);
				$('#timaat-mediadatasets-software-form').trigger('reset');
				softwareFormValidator.resetForm();
				$('#timaat-mediadatasets-software-form').hide();
			});
		},

		initTexts: function() {
			// console.log("TCL: MediaDatasets: initTexts: function()");		
			// delete text functionality
			$('#timaat-text-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-text-delete');
				var text = modal.data('text');
				if (text) TIMAAT.MediaDatasets._mediumSubtypeRemoved("text", text);
				modal.modal('hide');
				$('#timaat-mediadatasets-text-form').hide();
			});

			// add text button functionality (opens form)
			$('#timaat-text-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("text")');

			// Submit text data button functionality
			$('#timaat-text-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-text-form").valid()) return false;

				// the original text model (in case of editing an existing text)
				var text = $("#timaat-mediadatasets-text-form").data("text");				
				// Create/Edit text window submitted data
				var formData = $("#timaat-mediadatasets-text-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (text) { // update text
					// medium data
					text.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					text.model.medium.copyright = formDataObject.copyright;
					text.model.medium.remark = formDataObject.remark;
					// title data
					text.model.medium.title.name = formDataObject.primaryTitle;
					text.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					text.model.medium.sources[0].url = formDataObject.sourceUrl;
					text.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					text.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					text.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// text data
					text.model.content = formDataObject.content;

					text.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("text", text);

				} else { // create new text
					var model = {
						mediumId: 0,
						content: formDataObject.content,
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 5 // 5 = Text. TODO check clause to find proper id
						},
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or text at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					TIMAAT.MediaDatasets.createMediumSubtype("text", model, medium, title, source);
				}
				$('#timaat-mediadatasets-text-form').data('text', null);
				$('#timaat-mediadatasets-text-form').trigger('reset');
				$('#timaat-mediadatasets-text-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-text-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-text-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-text-form').data('text', null);
				$('#timaat-mediadatasets-text-form').trigger('reset');
				textFormValidator.resetForm();
				$('#timaat-mediadatasets-text-form').hide();
			});
		},

		initVideos: function() {
			// console.log("TCL: MediaDatasets: initVideos: function()");		
			// delete video functionality
			$('#timaat-video-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-video-delete');
				var video = modal.data('video');
				if (video) TIMAAT.MediaDatasets._mediumSubtypeRemoved("video", video);
				modal.modal('hide');
				$('#timaat-mediadatasets-video-form').hide();
			});

			// add video button functionality (opens form)
			$('#timaat-video-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("video")');

			// Submit video data button functionality
			$('#timaat-video-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-video-form").valid()) return false;

				// the original video model (in case of editing an existing video)
				var video = $("#timaat-mediadatasets-video-form").data("video");				
				// Create/Edit video window submitted data
				var formData = $("#timaat-mediadatasets-video-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (video) { // update video
					// medium data
					video.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					video.model.medium.copyright = formDataObject.copyright;
					video.model.medium.remark = formDataObject.remark;
					// title data
					video.model.medium.title.name = formDataObject.primaryTitle;
					video.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					video.model.medium.sources[0].url = formDataObject.sourceUrl;
					video.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					video.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					video.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// video data
					video.model.length = TIMAAT.Util.parseTime(formDataObject.length);
					video.model.videoCodec = formDataObject.videoCodec;
					video.model.width = formDataObject.width;
					video.model.height = formDataObject.height;
					video.model.frameRate = formDataObject.frameRate;
					video.model.dataRate = formDataObject.dataRate;
					video.model.totalBitrate = formDataObject.totalBitrate;
					video.model.isEpisode = (formDataObject.isEpisode) ? true : false;

					video.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("video", video);

				} else { // create new video
					var model = {
						mediumId: 0,
						audioCodecInformation: { // TODO get correct video information
							id: 1,
						},
						length: TIMAAT.Util.parseTime(formDataObject.length),
						videoCodec: formDataObject.videoCodec,
						width: formDataObject.width,
						height: formDataObject.height,
						frameRate: formDataObject.frameRate,
						dataRate: formDataObject.dataRate,
						totalBitrate: formDataObject.totalBitrate,
						isEpisode: (formDataObject.isEpisode) ? true : false,
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 6 // 6 = Video. TODO check clause to find proper id
						},
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or video at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					TIMAAT.MediaDatasets.createMediumSubtype("video", model, medium, title, source);
				}
				$('#timaat-mediadatasets-video-form').data('video', null);
				$('#timaat-mediadatasets-video-form').trigger('reset');
				$('#timaat-mediadatasets-video-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-video-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-video-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-video-form').data('video', null);
				$('#timaat-mediadatasets-video-form').trigger('reset');
				videoFormValidator.resetForm();
				$('#timaat-mediadatasets-video-form').hide();
			});
		},

		initVideogames: function() {
			// console.log("TCL: MediaDatasets: initVideogames: function()");		
			// delete videogame functionality
			$('#timaat-videogame-delete-submit').click(function(ev) {
				var modal = $('#timaat-mediadatasets-videogame-delete');
				var videogame = modal.data('videogame');
				if (videogame) TIMAAT.MediaDatasets._mediumSubtypeRemoved("videogame", videogame);
				modal.modal('hide');
				$('#timaat-mediadatasets-videogame-form').hide();
			});

			// add videogame button functionality (opens form)
			$('#timaat-videogame-add').attr('onclick','TIMAAT.MediaDatasets.addMediumSubtype("videogame")');

			// Submit videogame data button functionality
			$('#timaat-videogame-meta-submit').click(function(ev) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$("#timaat-mediadatasets-videogame-form").valid()) return false;

				// the original videogame model (in case of editing an existing videogame)
				var videogame = $("#timaat-mediadatasets-videogame-form").data("videogame");				
				// Create/Edit videogame window submitted data
				var formData = $("#timaat-mediadatasets-videogame-form").serializeArray();
				var formDataObject = {};
				$(formData).each(function(i, field){
					formDataObject[field.name] = field.value;
				});

				if (videogame) { // update videogame
          console.log("TCL: videogame", videogame);
					// medium data
					videogame.model.medium.releaseDate = moment.utc(formDataObject.releaseDate, "YYYY-MM-DD");
					videogame.model.medium.copyright = formDataObject.copyright;
					videogame.model.medium.remark = formDataObject.remark;
					// title data
					videogame.model.medium.title.name = formDataObject.primaryTitle;
					videogame.model.medium.title.language.id = Number(formDataObject.primaryTitleLanguageId);
					// source data
					videogame.model.medium.sources[0].url = formDataObject.sourceUrl;
					videogame.model.medium.sources[0].isPrimarySource = (formDataObject.sourceIsPrimarySource == "on") ? true : false;
					videogame.model.medium.sources[0].lastAccessed = moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm");
					videogame.model.medium.sources[0].isStillAvailable = (formDataObject.sourceIsStillAvailable == "on") ? true : false;
					// videogame data
					videogame.model.isEpisode = (formDataObject.isEpisode) ? true : false;

					videogame.updateUI();
					TIMAAT.MediaDatasets.updateMediumSubtype("videogame", videogame);

				} else { // create new videogame
					var model = {
						mediumId: 0,
						isEpisode: (formDataObject.isEpisode) ? true : false,
					};

					var medium = {
						id: 0,
						remark: formDataObject.remark,
						copyright: formDataObject.copyright,
						releaseDate: moment.utc(formDataObject.releaseDate, "YYYY-MM-DD"),
						mediaType: {
							id: 7 // 7 = Videogame. TODO check clause to find proper id
						},
						// mediumTranslations: [],
					};
					// var modelTranslation = {
					// 	id: 0,
					// 	name: name,
					// };
					var title = {
						id: 0,
						language: {
							id: Number(formDataObject.primaryTitleLanguageId),
						},
						name: formDataObject.primaryTitle,
					};
					var source = {
						id: 0,
						medium: {
							id: 0,
						},
						isPrimarySource: ( formDataObject.sourceIsPrimarySource == "on" ) ? true : false,            
						url: formDataObject.sourceUrl,
						lastAccessed: moment.utc(formDataObject.sourceLastAccessed, "YYYY-MM-DD HH:mm"),
						isStillAvailable: (formDataObject.sourceIsStillAvailable == "on") ? true : false,
					};
					// There are no translation data for medium or videogame at the moment
					// var mediumTranslation = {
					// 		id: 0,
					// 		name: name,
					// };					
					TIMAAT.MediaDatasets.createMediumSubtype("videogame", model, medium, title, source);
				}
				$('#timaat-mediadatasets-videogame-form').data('videogame', null);
				$('#timaat-mediadatasets-videogame-form').trigger('reset');
				$('#timaat-mediadatasets-videogame-form').hide();
			});

			// Cancel add/edit button in form functionality
			$('#timaat-videogame-meta-dismiss').click( function(ev) {
	      console.log("TCL: $('#timaat-videogame-meta-dismiss').click(function(ev)");
				$('#timaat-mediadatasets-videogame-form').data('videogame', null);
				$('#timaat-mediadatasets-videogame-form').trigger('reset');
				videogameFormValidator.resetForm();
				$('#timaat-mediadatasets-videogame-form').hide();
			});
		},

		load: function() {
			TIMAAT.MediaDatasets.loadMedia();
			TIMAAT.MediaDatasets.loadMediaTypes();
			TIMAAT.MediaDatasets.loadAllMediumSubtypes();
		},

		loadMediaTypes: function() {
    	// console.log("TCL: loadMediaTypes: function()");
			TIMAAT.MediaService.listMediaTypes(TIMAAT.MediaDatasets.setMediaTypeLists);
		},
		
		loadMedia: function() {
    	// console.log("TCL: loadMedia: function()");
			TIMAAT.MediaService.listMedia(TIMAAT.MediaDatasets.setMediumLists);
		},

		loadMediumSubtype: function(mediumSubtype) {
			switch (mediumSubtype) {
				case "audio":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setAudioLists);
					break;
				case "document":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setDocumentLists);
					break;
				case "image":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setImageLists);
					break;
				case "software":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setSoftwareLists);
					break;
				case "text":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setTextLists);
					break;
				case "video":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideoLists);
					break;
				case "videogame":
					TIMAAT.MediaService.listMediumSubtype(mediumSubtype, TIMAAT.MediaDatasets.setVideogameLists);
					break;
			};
		},

		loadAllMediumSubtypes: function() {
			TIMAAT.MediaService.listMediumSubtype("audio", TIMAAT.MediaDatasets.setAudioLists);
			TIMAAT.MediaService.listMediumSubtype("document", TIMAAT.MediaDatasets.setDocumentLists);
			TIMAAT.MediaService.listMediumSubtype("image", TIMAAT.MediaDatasets.setImageLists);
			TIMAAT.MediaService.listMediumSubtype("software", TIMAAT.MediaDatasets.setSoftwareLists);
			TIMAAT.MediaService.listMediumSubtype("text", TIMAAT.MediaDatasets.setTextLists);
			TIMAAT.MediaService.listMediumSubtype("video", TIMAAT.MediaDatasets.setVideoLists);
			TIMAAT.MediaService.listMediumSubtype("videogame", TIMAAT.MediaDatasets.setVideogameLists);
		},

		setMediaTypeLists: function(mediaTypes) {
			console.log("TCL: mediaTypes", mediaTypes);
			if ( !mediaTypes ) return;
			$('#timaat-mediatype-list-loader').remove();
			// clear old UI list
			$('#timaat-mediatype-list').empty();
			// setup model
			var medTypes = Array();
			mediaTypes.forEach(function(mediaType) { if ( mediaType.id > 0 ) medTypes.push(new TIMAAT.MediaType(mediaType)); });
			TIMAAT.MediaDatasets.mediaTypes = medTypes;
			TIMAAT.MediaDatasets.mediaTypes.model = mediaTypes;
		},

		setMediumLists: function(media) {
    	console.log("TCL: setMediumLists -> media", media);
			if ( !media ) return;
			$('#timaat-medium-list-loader').remove();
			// clear old UI list
			$('#timaat-medium-list').empty();
			// setup model
			var meds = Array();
			media.forEach(function(medium) { 
				if ( medium.id > 0 ) 
					meds.push(new TIMAAT.Medium(medium)); 
			});
			TIMAAT.MediaDatasets.media = meds;
			TIMAAT.MediaDatasets.media.model = media;
		},

		// will probably not work this way
		// setMediumSubtypeLists: function(mediumSubtype, mediumSubtypeDatasets) {
    // console.log("TCL: mediumSubtype, mediumSubtypeDatasets", mediumSubtype, mediumSubtypeDatasets);
		// 	if ( !mediumSubtypeDatasets ) return;
		// 	switch (mediumSubtype) {
		// 		case "audio":
		// 			$('#timaat-audio-list-loader').remove();
		// 			// clear old UI list
		// 			$('#timaat-audio-list').empty();
		// 			// setup model
		// 			var auds = Array();
		// 			audios.forEach(function(audio) { 
		// 				if ( audio.mediumId > 0 )
		// 					auds.push(new TIMAAT.Audio(audio)); 
		// 			});
		// 			TIMAAT.MediaDatasets.audios = auds;
		// 			TIMAAT.MediaDatasets.audios.model = audios;
		// 			break;
		// 		case "document":
		// 			break;
		// 		case "image":
		// 			break;
		// 		case "software":
		// 			break;
		// 		case "text":
		// 			break;
		// 		case "video":
		// 			break;
		// 		case "videogame":
		// 			break;
		// 	};
		// },

		setAudioLists: function(audios) {
			console.log("TCL: setAudioLists -> audios", audios);
				if ( !audios ) return;
				$('#timaat-audio-list-loader').remove();
				// clear old UI list
				$('#timaat-audio-list').empty();
				// setup model
				var auds = Array();
				audios.forEach(function(audio) { 
					if ( audio.mediumId > 0 )
						auds.push(new TIMAAT.Audio(audio)); 
				});
				TIMAAT.MediaDatasets.audios = auds;
				TIMAAT.MediaDatasets.audios.model = audios;
		},

		setDocumentLists: function(documents) {
			console.log("TCL: setDocumentLists -> documents", documents);
				if ( !documents ) return;
				$('#timaat-document-list-loader').remove();
				// clear old UI list
				$('#timaat-document-list').empty();
				// setup model
				var docs = Array();
				documents.forEach(function(mediumDocument) { 
					if ( mediumDocument.mediumId > 0 )
						docs.push(new TIMAAT.Document(mediumDocument)); 
				});
				TIMAAT.MediaDatasets.documents = docs;
				TIMAAT.MediaDatasets.documents.model = documents;
		},

		setImageLists: function(images) {
			console.log("TCL: setImageLists -> images", images);
				if ( !images ) return;
				$('#timaat-image-list-loader').remove();
				// clear old UI list
				$('#timaat-image-list').empty();
				// setup model
				var imgs = Array();
				images.forEach(function(image) { 
					if ( image.mediumId > 0 )
						imgs.push(new TIMAAT.Image(image)); 
				});
				TIMAAT.MediaDatasets.images = imgs;
				TIMAAT.MediaDatasets.images.model = images;
		},

		setSoftwareLists: function(softwares) {
			console.log("TCL: setSoftwareLists -> softwares", softwares);
				if ( !softwares ) return;
				$('#timaat-software-list-loader').remove();
				// clear old UI list
				$('#timaat-software-list').empty();
				// setup model
				var softws = Array();
				softwares.forEach(function(software) { 
					if ( software.mediumId > 0 )
						softws.push(new TIMAAT.Software(software)); 
				});
				TIMAAT.MediaDatasets.softwares = softws;
				TIMAAT.MediaDatasets.softwares.model = softwares;
		},

		setTextLists: function(texts) {
			console.log("TCL: setTextLists -> texts", texts);
				if ( !texts ) return;
				$('#timaat-text-list-loader').remove();
				// clear old UI list
				$('#timaat-text-list').empty();
				// setup model
				var txts = Array();
				texts.forEach(function(text) { 
					if ( text.mediumId > 0 )
						txts.push(new TIMAAT.Text(text)); 
				});
				TIMAAT.MediaDatasets.texts = txts;
				TIMAAT.MediaDatasets.texts.model = texts;
		},
		
		setVideoLists: function(videos) {
			console.log("TCL: setVideoLists -> videos", videos);
				if ( !videos ) return;
				$('#timaat-video-list-loader').remove();
				// clear old UI list
				$('#timaat-video-list').empty();
				// setup model
				var vids = Array();
				videos.forEach(function(video) { 
					if ( video.mediumId > 0 )
						vids.push(new TIMAAT.Video(video)); 
				});
				TIMAAT.MediaDatasets.videos = vids;
				TIMAAT.MediaDatasets.videos.model = videos;
		},

		setVideogameLists: function(videogames) {
			console.log("TCL: setVideogameLists -> videogames", videogames);
			if ( !videogames ) return;
			$('#timaat-videogame-list-loader').remove();
			// clear old UI list
			$('#timaat-videogame-list').empty();
			// setup model
			var vdgms = Array();
			videogames.forEach(function(videogame) { 
				if ( videogame.mediumId > 0 )
					vdgms.push(new TIMAAT.Videogame(videogame)); 
			});
			TIMAAT.MediaDatasets.videogames = vdgms;
			TIMAAT.MediaDatasets.videogames.model = videogames;
		},
		
		addMedium: function() {	
    	console.log("TCL: addMedium: function()");
			$('#timaat-mediadatasets-medium-form').data('medium', null);
			mediumFormValidator.resetForm();
			$('#timaat-mediadatasets-medium-form').trigger('reset');
			$('#timaat-mediadatasets-medium-form').show();
			$('#timaat-medium-meta-submit').show();
			$('#timaat-medium-meta-dismiss').show();
			$('#timaat-mediadatasets-medium-form :input').prop("disabled", false);
			$('#timaat-medium-meta-title').focus();

			// setup form
			$('#mediumMetaLabel').html("Medium hinzufügen");
			$('#timaat-medium-meta-submit').html("Hinzufügen");
			$("#timaat-medium-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
			$("#timaat-medium-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
			$("#timaat-medium-meta-source-isprimarysource").prop('checked', true);
			$("#timaat-medium-meta-source-isstillavailable").prop('checked', false);
		},

		addMediumSubtype: function(mediumSubtype) {
			console.log("TCL: addMediumSubtype -> mediumSubtype", mediumSubtype);
			switch (mediumSubtype) {
				case "audio":
					$('#timaat-mediadatasets-audio-form').data('audio', null);
					audioFormValidator.resetForm();
					$('#timaat-mediadatasets-audio-form').trigger('reset');
					$('#timaat-mediadatasets-audio-form').show();
					$('#timaat-audio-meta-submit').show();
					$('#timaat-audio-meta-dismiss').show();
					$('#timaat-mediadatasets-audio-form :input').prop("disabled", false);
					$('#timaat-audio-meta-title').focus();
					// setup form
					$('#audioMetaLabel').html("Audio hinzufügen");
					$('#timaat-audio-meta-submit').html("Hinzufügen");
					$("#timaat-audio-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-audio-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-audio-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-audio-meta-source-isstillavailable").prop('checked', false);
					break;

				case "document":
					$('#timaat-mediadatasets-document-form').data('document', null);
					documentFormValidator.resetForm();
					$('#timaat-mediadatasets-document-form').trigger('reset');
					$('#timaat-mediadatasets-document-form').show();
					$('#timaat-document-meta-submit').show();
					$('#timaat-document-meta-dismiss').show();
					$('#timaat-mediadatasets-document-form :input').prop("disabled", false);
					$('#timaat-document-meta-title').focus();
					// setup form
					$('#documentMetaLabel').html("Document hinzufügen");
					$('#timaat-document-meta-submit').html("Hinzufügen");
					$("#timaat-document-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-document-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-document-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-document-meta-source-isstillavailable").prop('checked', false);
					break;

				case "image":
					$('#timaat-mediadatasets-image-form').data('image', null);
					imageFormValidator.resetForm();
					$('#timaat-mediadatasets-image-form').trigger('reset');
					$('#timaat-mediadatasets-image-form').show();
					$('#timaat-image-meta-submit').show();
					$('#timaat-image-meta-dismiss').show();
					$('#timaat-mediadatasets-image-form :input').prop("disabled", false);
					$('#timaat-image-meta-title').focus();
					// setup form
					$('#imageMetaLabel').html("Image hinzufügen");
					$('#timaat-image-meta-submit').html("Hinzufügen");
					$("#timaat-image-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-image-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-image-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-image-meta-source-isstillavailable").prop('checked', false);
					break;

				case "software":
					$('#timaat-mediadatasets-software-form').data('software', null);
					softwareFormValidator.resetForm();
					$('#timaat-mediadatasets-software-form').trigger('reset');
					$('#timaat-mediadatasets-software-form').show();
					$('#timaat-software-meta-submit').show();
					$('#timaat-software-meta-dismiss').show();
					$('#timaat-mediadatasets-software-form :input').prop("disabled", false);
					$('#timaat-software-meta-title').focus();
					// setup form
					$('#softwareMetaLabel').html("Software hinzufügen");
					$('#timaat-software-meta-submit').html("Hinzufügen");
					$("#timaat-software-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-software-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-software-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-software-meta-source-isstillavailable").prop('checked', false);
					break;

				case "text":
					$('#timaat-mediadatasets-text-form').data('text', null);
					textFormValidator.resetForm();
					$('#timaat-mediadatasets-text-form').trigger('reset');
					$('#timaat-mediadatasets-text-form').show();
					$('#timaat-text-meta-submit').show();
					$('#timaat-text-meta-dismiss').show();
					$('#timaat-mediadatasets-text-form :input').prop("disabled", false);
					$('#timaat-text-meta-title').focus();
					// setup form
					$('#textMetaLabel').html("Text hinzufügen");
					$('#timaat-text-meta-submit').html("Hinzufügen");
					$("#timaat-text-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-text-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-text-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-text-meta-source-isstillavailable").prop('checked', false);
					break;

				case "video":
					$('#timaat-mediadatasets-video-form').data('video', null);
					videoFormValidator.resetForm();
					$('#timaat-mediadatasets-video-form').trigger('reset');
					$('#timaat-mediadatasets-video-form').show();
					$('#timaat-video-meta-submit').show();
					$('#timaat-video-meta-dismiss').show();
					$('#timaat-mediadatasets-video-form :input').prop("disabled", false);
					$('#timaat-video-meta-title').focus();
					// setup form
					$('#videoMetaLabel').html("Video hinzufügen");
					$('#timaat-video-meta-submit').html("Hinzufügen");
					$("#timaat-video-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-video-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-video-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-video-meta-source-isstillavailable").prop('checked', false);
					break;

				case "videogame":
					$('#timaat-mediadatasets-videogame-form').data('videogame', null);
					videogameFormValidator.resetForm();
					$('#timaat-mediadatasets-videogame-form').trigger('reset');
					$('#timaat-mediadatasets-videogame-form').show();
					$('#timaat-videogame-meta-submit').show();
					$('#timaat-videogame-meta-dismiss').show();
					$('#timaat-mediadatasets-videogame-form :input').prop("disabled", false);
					$('#timaat-videogame-meta-title').focus();
					// setup form
					$('#videogameMetaLabel').html("Videogame hinzufügen");
					$('#timaat-videogame-meta-submit').html("Hinzufügen");
					$("#timaat-videogame-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
					$("#timaat-videogame-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
					$("#timaat-videogame-meta-source-isprimarysource").prop('checked', true);
					$("#timaat-videogame-meta-source-isstillavailable").prop('checked', false);
					break;
			}
		},

		mediumFormData: function(action, medium) {
			$('#timaat-mediadatasets-medium-form').trigger('reset');
			mediumFormValidator.resetForm();
			$('#timaat-mediadatasets-medium-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-medium-form :input').prop("disabled", true);
			// $('#timaat-medium-edit-in-form').show();
			// $('#timaat-medium-edit-in-form').prop("disabled", false);
			// $('#timaat-medium-edit-in-form :input').prop("disabled", false);
			$('#timaat-medium-meta-submit').hide();
			$('#timaat-medium-meta-dismiss').hide();
			$('#mediumMetaLabel').html("Medium Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-medium-meta-submit').show();
				$('#timaat-medium-meta-dismiss').show();
				$('#timaat-mediadatasets-medium-form :input').prop("disabled", false);
				$('#timaat-medium-meta-medium-type-id').prop("disabled", true);
				$("#timaat-medium-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-medium-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-medium-edit-in-form').hide();
				$('#mediumMetaLabel').html("Medium bearbeiten");
				$('#timaat-medium-meta-submit').html("Speichern");
				$('#timaat-medium-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-medium-meta-medium-type-id").val(medium.model.mediaType.id);
			$("#timaat-medium-meta-remark").val(medium.model.remark);
			$("#timaat-medium-meta-copyright").val(medium.model.copyright);
			if (isNaN(moment(medium.model.releaseDate)))
				$("#timaat-medium-meta-releasedate").val("");
				else	$("#timaat-medium-meta-releasedate").val(moment(medium.model.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-medium-meta-title").val(medium.model.title.name);
			$("#timaat-medium-meta-title-language-id").val(medium.model.title.language.id);
			// source data
			if (medium.model.sources[0].isPrimarySource)
				$("#timaat-medium-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-medium-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-medium-meta-source-url").val(medium.model.sources[0].url);
			if (isNaN(moment.utc(medium.model.sources[0].lastAccessed))) 
				$("#timaat-medium-meta-source-lastaccessed").val("");
				else	$("#timaat-medium-meta-source-lastaccessed").val(moment.utc(medium.model.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (medium.model.sources[0].isStillAvailable)
				$("#timaat-medium-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-medium-meta-source-isstillavailable").prop('checked', false);

			if ( action == "edit") {
				$('#timaat-mediadatasets-medium-form').data('medium', medium);
			}
		},

		audioFormData: function(action, audio) {
			$('#timaat-mediadatasets-audio-form').trigger('reset');
			audioFormValidator.resetForm();
			$('#timaat-mediadatasets-audio-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-audio-form :input').prop("disabled", true);
			// $('#timaat-audio-edit-in-form').show();
			// $('#timaat-audio-edit-in-form').prop("disabled", false);
			// $('#timaat-audio-edit-in-form :input').prop("disabled", false);
			$('#timaat-audio-meta-submit').hide();
			$('#timaat-audio-meta-dismiss').hide();
			$('#audioMetaLabel').html("Audio Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-audio-meta-submit').show();
				$('#timaat-audio-meta-dismiss').show();
				$('#timaat-mediadatasets-audio-form :input').prop("disabled", false);
				$('#timaat-audio-meta-medium-type-id').prop("disabled", true);
				$("#timaat-audio-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-audio-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-audio-edit-in-form').hide();
				$('#audioMetaLabel').html("Audio bearbeiten");
				$('#timaat-audio-meta-submit').html("Speichern");
				$('#timaat-audio-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-audio-meta-medium-type-id").val(audio.model.medium.mediaType.id);
			$("#timaat-audio-meta-remark").val(audio.model.medium.remark);
			$("#timaat-audio-meta-copyright").val(audio.model.medium.copyright);
			if (isNaN(moment(audio.model.medium.releaseDate)))
				$("#timaat-audio-meta-releasedate").val("");
				else	$("#timaat-audio-meta-releasedate").val(moment(audio.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-audio-meta-title").val(audio.model.medium.title.name);
			$("#timaat-audio-meta-title-language-id").val(audio.model.medium.title.language.id);
			// source data
			if (audio.model.medium.sources[0].isPrimarySource)
				$("#timaat-audio-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-audio-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-audio-meta-source-url").val(audio.model.medium.sources[0].url);
			if (isNaN(moment.utc(audio.model.medium.sources[0].lastAccessed))) 
				$("#timaat-audio-meta-source-lastaccessed").val("");
				else	$("#timaat-audio-meta-source-lastaccessed").val(moment.utc(audio.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (audio.model.medium.sources[0].isStillAvailable)
				$("#timaat-audio-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-audio-meta-source-isstillavailable").prop('checked', false);
			// audio data
			$("#timaat-audio-meta-length").val(audio.model.length);

			if ( action == "edit") {
				$('#timaat-mediadatasets-audio-form').data('audio', audio);
			}
		},

		documentFormData: function(action, mediumDocument) {
			$('#timaat-mediadatasets-document-form').trigger('reset');
			documentFormValidator.resetForm();
			$('#timaat-mediadatasets-document-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-document-form :input').prop("disabled", true);
			// $('#timaat-document-edit-in-form').show();
			// $('#timaat-document-edit-in-form').prop("disabled", false);
			// $('#timaat-document-edit-in-form :input').prop("disabled", false);
			$('#timaat-document-meta-submit').hide();
			$('#timaat-document-meta-dismiss').hide();
			$('#documentMetaLabel').html("document Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-document-meta-submit').show();
				$('#timaat-document-meta-dismiss').show();
				$('#timaat-mediadatasets-document-form :input').prop("disabled", false);
				$('#timaat-document-meta-medium-type-id').prop("disabled", true);
				$("#timaat-document-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-document-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-document-edit-in-form').hide();
				$('#documentMetaLabel').html("Document bearbeiten");
				$('#timaat-document-meta-submit').html("Speichern");
				$('#timaat-document-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-document-meta-medium-type-id").val(mediumDocument.model.medium.mediaType.id);
			$("#timaat-document-meta-remark").val(mediumDocument.model.medium.remark);
			$("#timaat-document-meta-copyright").val(mediumDocument.model.medium.copyright);
			if (isNaN(moment(mediumDocument.model.medium.releaseDate)))
				$("#timaat-document-meta-releasedate").val("");
				else	$("#timaat-document-meta-releasedate").val(moment(mediumDocument.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-document-meta-title").val(mediumDocument.model.medium.title.name);
			$("#timaat-document-meta-title-language-id").val(mediumDocument.model.medium.title.language.id);
			// source data
			if (mediumDocument.model.medium.sources[0].isPrimarySource)
				$("#timaat-document-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-document-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-document-meta-source-url").val(mediumDocument.model.medium.sources[0].url);
			if (isNaN(moment.utc(mediumDocument.model.medium.sources[0].lastAccessed))) 
				$("#timaat-document-meta-source-lastaccessed").val("");
				else	$("#timaat-document-meta-source-lastaccessed").val(moment.utc(mediumDocument.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (mediumDocument.model.medium.sources[0].isStillAvailable)
				$("#timaat-document-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-document-meta-source-isstillavailable").prop('checked', false);
			// document data
			// currently empty

			if ( action == "edit") {
				$('#timaat-mediadatasets-document-form').data('document', mediumDocument);
			}
		},

		imageFormData: function(action, image) {
			$('#timaat-mediadatasets-image-form').trigger('reset');
			imageFormValidator.resetForm();
			$('#timaat-mediadatasets-image-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-image-form :input').prop("disabled", true);
			// $('#timaat-image-edit-in-form').show();
			// $('#timaat-image-edit-in-form').prop("disabled", false);
			// $('#timaat-image-edit-in-form :input').prop("disabled", false);
			$('#timaat-image-meta-submit').hide();
			$('#timaat-image-meta-dismiss').hide();
			$('#imageMetaLabel').html("image Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-image-meta-submit').show();
				$('#timaat-image-meta-dismiss').show();
				$('#timaat-mediadatasets-image-form :input').prop("disabled", false);
				$('#timaat-image-meta-medium-type-id').prop("disabled", true);
				$("#timaat-image-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-image-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-image-edit-in-form').hide();
				$('#imageMetaLabel').html("Image bearbeiten");
				$('#timaat-image-meta-submit').html("Speichern");
				$('#timaat-image-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-image-meta-medium-type-id").val(image.model.medium.mediaType.id);
			$("#timaat-image-meta-remark").val(image.model.medium.remark);
			$("#timaat-image-meta-copyright").val(image.model.medium.copyright);
			if (isNaN(moment(image.model.medium.releaseDate)))
				$("#timaat-image-meta-releasedate").val("");
				else	$("#timaat-image-meta-releasedate").val(moment(image.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-image-meta-title").val(image.model.medium.title.name);
			$("#timaat-image-meta-title-language-id").val(image.model.medium.title.language.id);
			// source data
			if (image.model.medium.sources[0].isPrimarySource)
				$("#timaat-image-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-image-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-image-meta-source-url").val(image.model.medium.sources[0].url);
			if (isNaN(moment.utc(image.model.medium.sources[0].lastAccessed))) 
				$("#timaat-image-meta-source-lastaccessed").val("");
				else	$("#timaat-image-meta-source-lastaccessed").val(moment.utc(image.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (image.model.medium.sources[0].isStillAvailable)
				$("#timaat-image-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-image-meta-source-isstillavailable").prop('checked', false);
			// image data
			$("#timaat-image-meta-width").val(image.model.width);
			$("#timaat-image-meta-height").val(image.model.height);
			$("#timaat-image-meta-bitdepth").val(image.model.bitDepth);

			if ( action == "edit") {
				$('#timaat-mediadatasets-image-form').data('image', image);
			}
		},

		softwareFormData: function(action, software) {
			$('#timaat-mediadatasets-software-form').trigger('reset');
			softwareFormValidator.resetForm();
			$('#timaat-mediadatasets-software-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-software-form :input').prop("disabled", true);
			// $('#timaat-software-edit-in-form').show();
			// $('#timaat-software-edit-in-form').prop("disabled", false);
			// $('#timaat-software-edit-in-form :input').prop("disabled", false);
			$('#timaat-software-meta-submit').hide();
			$('#timaat-software-meta-dismiss').hide();
			$('#softwareMetaLabel').html("software Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-software-meta-submit').show();
				$('#timaat-software-meta-dismiss').show();
				$('#timaat-mediadatasets-software-form :input').prop("disabled", false);
				$('#timaat-software-meta-medium-type-id').prop("disabled", true);
				$("#timaat-software-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-software-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-software-edit-in-form').hide();
				$('#softwareMetaLabel').html("software bearbeiten");
				$('#timaat-software-meta-submit').html("Speichern");
				$('#timaat-software-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-software-meta-medium-type-id").val(software.model.medium.mediaType.id);
			$("#timaat-software-meta-remark").val(software.model.medium.remark);
			$("#timaat-software-meta-copyright").val(software.model.medium.copyright);
			if (isNaN(moment(software.model.medium.releaseDate)))
				$("#timaat-software-meta-releasedate").val("");
				else	$("#timaat-software-meta-releasedate").val(moment(software.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-software-meta-title").val(software.model.medium.title.name);
			$("#timaat-software-meta-title-language-id").val(software.model.medium.title.language.id);
			// source data
			if (software.model.medium.sources[0].isPrimarySource)
				$("#timaat-software-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-software-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-software-meta-source-url").val(software.model.medium.sources[0].url);
			if (isNaN(moment.utc(software.model.medium.sources[0].lastAccessed))) 
				$("#timaat-software-meta-source-lastaccessed").val("");
				else	$("#timaat-software-meta-source-lastaccessed").val(moment.utc(software.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (software.model.medium.sources[0].isStillAvailable)
				$("#timaat-software-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-software-meta-source-isstillavailable").prop('checked', false);
			// software data
			$("#timaat-software-meta-version").val(software.model.version);

			if ( action == "edit") {
				$('#timaat-mediadatasets-software-form').data('software', software);
			}
		},

		textFormData: function(action, text) {
			$('#timaat-mediadatasets-text-form').trigger('reset');
			textFormValidator.resetForm();
			$('#timaat-mediadatasets-text-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-text-form :input').prop("disabled", true);
			// $('#timaat-text-edit-in-form').show();
			// $('#timaat-text-edit-in-form').prop("disabled", false);
			// $('#timaat-text-edit-in-form :input').prop("disabled", false);
			$('#timaat-text-meta-submit').hide();
			$('#timaat-text-meta-dismiss').hide();
			$('#textMetaLabel').html("text Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-text-meta-submit').show();
				$('#timaat-text-meta-dismiss').show();
				$('#timaat-mediadatasets-text-form :input').prop("disabled", false);
				$('#timaat-text-meta-medium-type-id').prop("disabled", true);
				$("#timaat-text-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-text-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-text-edit-in-form').hide();
				$('#textMetaLabel').html("Text bearbeiten");
				$('#timaat-text-meta-submit').html("Speichern");
				$('#timaat-text-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-text-meta-medium-type-id").val(text.model.medium.mediaType.id);
			$("#timaat-text-meta-remark").val(text.model.medium.remark);
			$("#timaat-text-meta-copyright").val(text.model.medium.copyright);
			if (isNaN(moment(text.model.medium.releaseDate)))
				$("#timaat-text-meta-releasedate").val("");
				else	$("#timaat-text-meta-releasedate").val(moment(text.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-text-meta-title").val(text.model.medium.title.name);
			$("#timaat-text-meta-title-language-id").val(text.model.medium.title.language.id);
			// source data
			if (text.model.medium.sources[0].isPrimarySource)
				$("#timaat-text-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-text-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-text-meta-source-url").val(text.model.medium.sources[0].url);
			if (isNaN(moment.utc(text.model.medium.sources[0].lastAccessed))) 
				$("#timaat-text-meta-source-lastaccessed").val("");
				else	$("#timaat-text-meta-source-lastaccessed").val(moment.utc(text.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (text.model.medium.sources[0].isStillAvailable)
				$("#timaat-text-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-text-meta-source-isstillavailable").prop('checked', false);
			// text data
			$("#timaat-text-meta-content").val(text.model.content);

			if ( action == "edit") {
				$('#timaat-mediadatasets-text-form').data('text', text);
			}
		},

		videoFormData: function(action, video) {
			$('#timaat-mediadatasets-video-form').trigger('reset');
			videoFormValidator.resetForm();
			$('#timaat-mediadatasets-video-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-video-form :input').prop("disabled", true);
			// $('#timaat-video-edit-in-form').show();
			// $('#timaat-video-edit-in-form').prop("disabled", false);
			// $('#timaat-video-edit-in-form :input').prop("disabled", false);
			$('#timaat-video-meta-submit').hide();
			$('#timaat-video-meta-dismiss').hide();
			$('#videoMetaLabel').html("video Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-video-meta-submit').show();
				$('#timaat-video-meta-dismiss').show();
				$('#timaat-mediadatasets-video-form :input').prop("disabled", false);
				$('#timaat-video-meta-medium-type-id').prop("disabled", true);
				$("#timaat-video-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-video-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-video-edit-in-form').hide();
				$('#videoMetaLabel').html("Video bearbeiten");
				$('#timaat-video-meta-submit').html("Speichern");
				$('#timaat-video-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-video-meta-medium-type-id").val(video.model.medium.mediaType.id);
			$("#timaat-video-meta-remark").val(video.model.medium.remark);
			$("#timaat-video-meta-copyright").val(video.model.medium.copyright);
			if (isNaN(moment(video.model.medium.releaseDate)))
				$("#timaat-video-meta-releasedate").val("");
				else	$("#timaat-video-meta-releasedate").val(moment(video.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-video-meta-title").val(video.model.medium.title.name);
			$("#timaat-video-meta-title-language-id").val(video.model.medium.title.language.id);
			// source data
			if (video.model.medium.sources[0].isPrimarySource)
				$("#timaat-video-meta-source-isprimarysource").prop('checked', true);
				else $("#timaat-video-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-video-meta-source-url").val(video.model.medium.sources[0].url);
			if (isNaN(moment.utc(video.model.medium.sources[0].lastAccessed))) 
				$("#timaat-video-meta-source-lastaccessed").val("");
				else	$("#timaat-video-meta-source-lastaccessed").val(moment.utc(video.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (video.model.medium.sources[0].isStillAvailable)
				$("#timaat-video-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-video-meta-source-isstillavailable").prop('checked', false);
			// video data
			$("#timaat-video-meta-length").val(video.model.length);
			$("#timaat-video-meta-videocodec").val(video.model.videoCodec);
			$("#timaat-video-meta-width").val(video.model.width);
			$("#timaat-video-meta-height").val(video.model.height);
			$("#timaat-video-meta-framerate").val(video.model.frameRate);
			$("#timaat-video-meta-datarate").val(video.model.dataRate);
			$("#timaat-video-meta-totalbitrate").val(video.model.totalBitrate);
			if (video.model.isEpisode)
				$("#timaat-video-meta-isepisode").prop('checked', true);
			  else $("#timaat-video-meta-isepisode").prop('checked', false);

			if ( action == "edit") {
				$('#timaat-mediadatasets-video-form').data('video', video);
			}
		},

		videogameFormData: function(action, videogame) {
			$('#timaat-mediadatasets-videogame-form').trigger('reset');
			videogameFormValidator.resetForm();
			$('#timaat-mediadatasets-videogame-form').show();

			if ( action == "show") {
			$('#timaat-mediadatasets-videogame-form :input').prop("disabled", true);
			// $('#timaat-videogame-edit-in-form').show();
			// $('#timaat-videogame-edit-in-form').prop("disabled", false);
			// $('#timaat-videogame-edit-in-form :input').prop("disabled", false);
			$('#timaat-videogame-meta-submit').hide();
			$('#timaat-videogame-meta-dismiss').hide();
			$('#videogameMetaLabel').html("Videogame Datenblatt");
			}
			else if (action == "edit") {
				$('#timaat-videogame-meta-submit').show();
				$('#timaat-videogame-meta-dismiss').show();
				$('#timaat-mediadatasets-videogame-form :input').prop("disabled", false);
				$('#timaat-videogame-meta-medium-type-id').prop("disabled", true);
				$("#timaat-videogame-meta-releasedate").datetimepicker({timepicker: false, scrollMonth: false, scrollInput: false,format: "YYYY-MM-DD"});
				$("#timaat-videogame-meta-source-lastaccessed").datetimepicker({format: "YYYY-MM-DD HH:mm"});
				// $('#timaat-videogame-edit-in-form').hide();
				$('#videogameMetaLabel').html("Videogame bearbeiten");
				$('#timaat-videogame-meta-submit').html("Speichern");
				$('#timaat-videogame-meta-title').focus();
			}

			// setup UI
			// medium data
			$("#timaat-videogame-meta-medium-type-id").val(videogame.model.medium.mediaType.id);
			$("#timaat-videogame-meta-remark").val(videogame.model.medium.remark);
			$("#timaat-videogame-meta-copyright").val(videogame.model.medium.copyright);
			if (isNaN(moment(videogame.model.medium.releaseDate)))
				$("#timaat-videogame-meta-releasedate").val("");
				else	$("#timaat-videogame-meta-releasedate").val(moment(videogame.model.medium.releaseDate).format("YYYY-MM-DD"));
			// title data
			$("#timaat-videogame-meta-title").val(videogame.model.medium.title.name);
			$("#timaat-videogame-meta-title-language-id").val(videogame.model.medium.title.language.id);
			// source data
			if (videogame.model.medium.sources[0].isPrimarySource)
				$("#timaat-videogame-meta-source-isprimarysource").prop('checked', true);
			  else $("#timaat-videogame-meta-source-isprimarysource").prop('checked', false);
			$("#timaat-videogame-meta-source-url").val(videogame.model.medium.sources[0].url);
			if (isNaN(moment.utc(videogame.model.medium.sources[0].lastAccessed))) 
				$("#timaat-videogame-meta-source-lastaccessed").val("");
				else	$("#timaat-videogame-meta-source-lastaccessed").val(moment.utc(videogame.model.medium.sources[0].lastAccessed).format("YYYY-MM-DD HH:mm"));
			if (videogame.model.medium.sources[0].isStillAvailable)
				$("#timaat-videogame-meta-source-isstillavailable").prop('checked', true);
			  else $("#timaat-videogame-meta-source-isstillavailable").prop('checked', false);
			// videogame data
			if (videogame.model.isEpisode)
				$("#timaat-videogame-meta-isepisode").prop('checked', true);
			  else $("#timaat-videogame-meta-isepisode").prop('checked', false);

			if ( action == "edit") {
				$('#timaat-mediadatasets-videogame-form').data('videogame', videogame);
			}
		},

		createMedium: async function(mediumModel, title, source) {
			// createMedium: async function(mediumModel, mediumModelTranslation) { // medium has no translation table at the moment
			// NO MEDIUM SHOULD BE CREATED DIRECTLY. CREATE VIDEO, IMAGE, ETC. INSTEAD
			// This routine can be used to create empty media of a certain type
			console.log("TCL: createMedium: async function -> mediumModel, title, source", mediumModel, title, source);
			try {
				// create title
				var newTitle = await TIMAAT.MediaService.createTitle(title);
				
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.title = newTitle;
				tempMediumModel.source = source;
				var newMediumModel = await TIMAAT.MediaService.createMedium(tempMediumModel);

				// update source (createMedium created an empty source)
				source.id = newMediumModel.sources[0].id;
				var updatedSource = await TIMAAT.MediaService.updateSource(source);
				newMediumModel.sources[0] = updatedSource; // TODO refactor once several sources can be added

				// create medium translation with medium id
				// var newTranslationData = await TIMAAT.MediaService.createMediumTranslation(newMediumModel, mediumModelTranslation);
				// newMediumModel.mediumTranslations[0] = newTranslationData;
				
				// create video/image/etc depending on video type
				// TODO switch (mediumModel.mediaType)

				// push new medium to dataset model
				await TIMAAT.MediaDatasets._mediumAdded(newMediumModel);

			} catch(error) {
				console.log( "error: ", error);
			};
		},

		createMediumSubtype: async function(mediumSubtype, mediumSubtypeModel, mediumModel, title, source) {
			// createMediumSubtype: async function(mediumModel, mediumModelTranslation, mediumSubtypeModel) { // mediumSubtype has no translation table at the moment
			console.log("TCL: createMediumSubtype: async function-> mediumSubtypeModel, mediumModel, title", mediumSubtypeModel, mediumModel, title);
			try {
				// create title
				var newTitle = await TIMAAT.MediaService.createTitle(title);
				
				// create medium
				var tempMediumModel = mediumModel;
				tempMediumModel.title = newTitle;
				tempMediumModel.source = source;
				var newMediumModel = await TIMAAT.MediaService.createMedium(tempMediumModel);

				// update source (createMedium created an empty source)
				source.id = newMediumModel.sources[0].id;
				var updatedSource = await TIMAAT.MediaService.updateSource(source);
				newMediumModel.sources[0] = updatedSource; // TODO refactor once several sources can be added

				// push new medium to dataset model
				await TIMAAT.MediaDatasets._mediumAdded(newMediumModel);
				
				// create medium translation with medium id
				// await TIMAAT.MediaService.createMediumTranslation(newMediumModel, mediumModelTranslation);
				// newMediumModel.mediumTranslations[0] = mediumModelTranslation;

				// create mediumSubtype with medium id
				mediumSubtypeModel.mediumId = newMediumModel.id;
				var newMediumSubtypeModel = await TIMAAT.MediaService.createMediumSubtype(mediumSubtype, newMediumModel, mediumSubtypeModel);

				// push new mediumSubtype to dataset model
				await TIMAAT.MediaDatasets._mediumSubtypeAdded(mediumSubtype, newMediumSubtypeModel);

			} catch(error) {
				console.log( "error: ", error);
			};
		},

		updateMedium: async function(medium) {
		console.log("TCL: updateMedium: async function -> medium at beginning of update process: ", medium);
			try {
				// update title
				var tempTitle = await TIMAAT.MediaService.updateTitle(medium.model.title);
				medium.model.title = tempTitle;

				// update source
				var tempSource = await TIMAAT.MediaService.updateSource(medium.model.sources[0]);

				// update data that is part of medium (includes updating last edited by/at)
				console.log("TCL: updateMedium: async function - medium.model", medium.model);
				var tempMediumModel = await TIMAAT.MediaService.updateMedium(medium.model);
			} catch(error) {
				console.log( "error: ", error);
			};
			// try { // medium has no translation at the moment
			// 	// update data that is part of  medium translation
			// 	// medium.mediumTranslation[0] = await	TIMAAT.MediaService.updateMediumTranslation(medium);
			// 	var tempMediumTranslation = await	TIMAAT.MediaService.updateMediumTranslation(medium);
			// 	medium.model.mediumTranslations[0].name = tempMediumTranslation.name;			
			// } catch(error) {
			// 	console.log( "error: ", error);
			// };
			// medium.updateUI();
		},

		updateMediumSubtype: async function(mediumSubtype, mediumSubtypeData) {
			console.log("TCL: updateMediumSubtypeData async function -> mediumSubtype, mediumSubtypeData at beginning of update process: ", mediumSubtype, mediumSubtypeData);
			try {
				// update title
				var tempTitle = await TIMAAT.MediaService.updateTitle(mediumSubtypeData.model.medium.title);
				mediumSubtypeData.model.medium.title = tempTitle;
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update source
				var tempSource = await TIMAAT.MediaService.updateSource(mediumSubtypeData.model.medium.sources[0]);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of mediumSubtypeData
				console.log("TCL: mediumSubtype", mediumSubtype);
				console.log("TCL: mediumSubtypeData.model", mediumSubtypeData.model);
				var tempMediumSubtypeData = mediumSubtypeData;
				// tempMediumSubtypeData.model.medium.sources = null;
        console.log("TCL: tempMediumSubtypeData", tempMediumSubtypeData);
				var tempMediumSubtypeModel = await TIMAAT.MediaService.updateMediumSubtype(mediumSubtype, tempMediumSubtypeData.model);
			} catch(error) {
				console.log( "error: ", error);
			};

			try {
				// update data that is part of medium and its translation
				var mediumSubtypeMediumModel = mediumSubtypeData.model.medium;
        console.log("TCL: UpdateMediumSubtype: async function - mediumSubtypeMediumModel", mediumSubtypeMediumModel);
				var tempMediumSubtypeModelUpdate = await TIMAAT.MediaService.updateMedium(mediumSubtypeMediumModel);				
			} catch(error) {
				console.log( "error: ", error);
			};
		},

		_mediumAdded: async function(medium) {
    	// console.log("TCL: _mediumAdded: function(medium)");
			TIMAAT.MediaDatasets.media.model.push(medium);
			TIMAAT.MediaDatasets.media.push(new TIMAAT.Medium(medium));
		},

		_mediumSubtypeAdded: async function(mediumSubtype, mediumSubtypeData) {
			// console.log("TCL: _mediumSubtypeAdded: function(mediumSubtype, mediumSubtypeData)");
			switch (mediumSubtype) {
				case "audio":
					TIMAAT.MediaDatasets.audios.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.audios.push(new TIMAAT.Audio(mediumSubtypeData));
					break;
				case "document":
					TIMAAT.MediaDatasets.documents.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.documents.push(new TIMAAT.Document(mediumSubtypeData));
					break;
				case "image":
					TIMAAT.MediaDatasets.images.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.images.push(new TIMAAT.Image(mediumSubtypeData));
					break;
				case "software":
					TIMAAT.MediaDatasets.softwares.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.softwares.push(new TIMAAT.Software(mediumSubtypeData));
					break;
				case "text":
					TIMAAT.MediaDatasets.texts.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.texts.push(new TIMAAT.Text(mediumSubtypeData));
					break;
				case "video":
					TIMAAT.MediaDatasets.videos.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.videos.push(new TIMAAT.Video(mediumSubtypeData));
					break;
				case "videogame":
					TIMAAT.MediaDatasets.videogames.model.push(mediumSubtypeData);
					TIMAAT.MediaDatasets.videogames.push(new TIMAAT.Videogame(mediumSubtypeData));
					break;
			}
		},
		
		_mediumRemoved: function(medium) {
    	// console.log("TCL: _mediumRemoved: function(medium)");
			// sync to server
			TIMAAT.MediaService.removeMedium(medium);
			medium.remove();
		},

		_mediumSubtypeRemoved: function(mediumSubtype, mediumSubtypeData) {
			// console.log("TCL: _videoRemoved: function(video)");
			// sync to server
		 TIMAAT.MediaService.removeMediumSubtype(mediumSubtype, mediumSubtypeData)
		 mediumSubtypeData.remove();
	 },

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Medium: class Medium {
		constructor(model) {
			// console.log("TCL: Medium -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editMediumButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-medium-edit float-left" id="timaat-medium-edit"><i class="fas fa-edit"></i></button>';
			var deleteMediumButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-medium-remove float-left" id="timaat-medium-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteMediumButton = '';
				editMediumButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editMediumButton +
								deleteMediumButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-medium-list-name"></span>
							<br><br>
							<span class="timaat-medium-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-medium-list').append(this.listView);
			this.updateUI();      
			var medium = this; // save medium for system events

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
				if (medium.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+medium.model.createdByUserAccount.id+'">[ID '+medium.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(medium.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+medium.model.createdByUserAccount.id+'">[ID '+medium.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(medium.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+medium.model.lastEditedByUserAccount.id+'">[ID '+medium.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(medium.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach medium handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Medium -> constructor -> open medium datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-medium-form').data('medium', medium);
				TIMAAT.MediaDatasets.mediumFormData("show", medium);				
				// medium.listView.find('.timaat-medium-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-medium-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-medium-form').data('medium', medium);
				TIMAAT.MediaDatasets.mediumFormData("edit", medium);
				// medium.listView.find('.timaat-medium-list-tags').popover('show');
			});

			// TODO: make button click in form work
			// // in-form edit handler
			// $(this.listView).find('.timaat-medium-edit-in-form').on('click', this, function(ev) {
      // console.log("TCL: Medium -> constructor -> this", this);
			// 	// console.log("TCL: Medium -> constructor -> this.listView.find('.timaat-medium-edit')");
			// 	ev.stopPropagation();
			// 	TIMAAT.UI.hidePopups();
			// 	$('#timaat-mediadatasets-medium-form').data('medium', medium);
			// 	// console.log("TCL: Medium -> constructor -> medium", medium);
			// 	TIMAAT.MediaDatasets.mediumFormData("edit", medium);
			// 	// medium.listView.find('.timaat-medium-list-tags').popover('show');
			// });

			// remove handler
			this.listView.find('.timaat-medium-remove').click(this, function(ev) {
      	console.log("TCL: Medium -> constructor -> this.listView.find('.timaat-medium-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-medium-delete').data('medium', medium);
				$('#timaat-mediadatasets-medium-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Medium -> updateUI -> updateUI() -> model", this.model);
			// title
			var name = this.model.title.name;
			var type = this.model.mediaType.mediaTypeTranslations[0].type;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-medium-list-name').text(name);
			this.listView.find('.timaat-medium-list-medium-type-id').html(type);
		}

		remove() {
			// console.log("TCL: Medium -> remove -> remove()");
			// remove medium from UI
			this.listView.remove(); // TODO remove tags from medium_has_tags
			// remove from medium list
			var index = TIMAAT.MediaDatasets.media.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.media.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.media.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.media.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	MediaType: class MediaType {
		constructor(model) {
      // console.log("TCL: MediaType -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;

			// create and style list view element
			var deleteMediaTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-mediatype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteMediaTypeButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteMediaTypeButton +
				'<span class="timaat-mediatype-list-type"></span>' +
				'<br> \
				<div class="timaat-mediatype-list-count text-muted float-left"></div> \
				</li>'
			);

			$('#timaat-medium-type-list').append(this.listView);
			this.updateUI();      
			var MediaType = this; // save MediaType for system MediaTypes

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
				if (mediaType.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+mediaType.model.createdByUserAccount.id+'">[ID '+mediaType.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(mediaType.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+mediaType.model.createdByUserAccount.id+'">[ID '+mediaType.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediaType.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+mediaType.model.lastEditedByUserAccount.id+'">[ID '+mediaType.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediaType.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach MediaType handlers
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-mediadatasets-medium-type-meta').data('MediaType', MediaType);
				$('#timaat-mediadatasets-medium-type-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-mediatype-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-medium-type-delete').data('MediaType', MediaType);
				$('#timaat-mediadatasets-medium-type-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: MediaType -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.mediaTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediatype-list-name').text(type);
		}

		remove() {
      console.log("TCL: MediaType -> remove -> remove()");
			// remove MediaType from UI
			this.listView.remove(); // TODO remove tags from medium_type_has_tags
			// remove from MediaType list
			var index = TIMAAT.MediaDatasets.mediaTypes.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.mediaTypes.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.mediaTypes.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.mediaTypes.model.splice(index, 1);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	Audio: class Audio {
		constructor(model) {
			// console.log("TCL: Audio -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editAudioButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-audio-edit float-left" id="timaat-audio-edit"><i class="fas fa-edit"></i></button>';
			var deleteAudioButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-audio-remove float-left" id="timaat-audio-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteAudioButton = '';
				editAudioButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editAudioButton +
								deleteAudioButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-audio-list-name"></span>
							<br><br>
							<span class="timaat-audio-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-audio-list').append(this.listView);
			this.updateUI();      
			var audio = this; // save audio for system events

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
				if (audio.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+audio.model.medium.createdByUserAccount.id+'">[ID '+audio.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(audio.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+audio.model.medium.createdByUserAccount.id+'">[ID '+audio.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(audio.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+audio.model.medium.lastEditedByUserAccount.id+'">[ID '+audio.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(audio.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach audio handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Audio -> constructor -> open audio datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-audio-form').data('audio', audio);
				TIMAAT.MediaDatasets.audioFormData("show", audio);				
				// audio.listView.find('.timaat-audio-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-audio-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-audio-form').data('audio', audio);
				TIMAAT.MediaDatasets.audioFormData("edit", audio);
				// audio.listView.find('.timaat-audio-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-audio-remove').click(this, function(ev) {
      	console.log("TCL: Audio -> constructor -> this.listView.find('.timaat-audio-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-audio-delete').data('audio', audio);
				$('#timaat-mediadatasets-audio-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Audio -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-audio-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Audio -> remove -> remove()");
			// remove audio from UI
			this.listView.remove(); // TODO remove tags from audio_has_tags
			// remove from audio list
			var index = TIMAAT.MediaDatasets.audios.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.audios.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.audios.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.audios.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Document: class Document {
		constructor(model) {
			// console.log("TCL: Document -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editDocumentButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-document-edit float-left" id="timaat-document-edit"><i class="fas fa-edit"></i></button>';
			var deleteDocumentButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-document-remove float-left" id="timaat-document-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteDocumentButton = '';
				editDocumentButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editDocumentButton +
								deleteDocumentButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-document-list-name"></span>
							<br><br>
							<span class="timaat-document-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-document-list').append(this.listView);
			this.updateUI();      
			var mediumDocument = this; // save document for system events

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
				if (mediumDocument.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+mediumDocument.model.medium.createdByUserAccount.id+'">[ID '+mediumDocument.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(mediumDocument.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+mediumDocument.model.medium.createdByUserAccount.id+'">[ID '+mediumDocument.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediumDocument.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+mediumDocument.model.medium.lastEditedByUserAccount.id+'">[ID '+mediumDocument.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediumDocument.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach document handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Document -> constructor -> open document datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-document-form').data('document', mediumDocument);
				TIMAAT.MediaDatasets.documentFormData("show", mediumDocument);				
				// document.listView.find('.timaat-document-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-document-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-document-form').data('document', mediumDocument);
				TIMAAT.MediaDatasets.documentFormData("edit", mediumDocument);
				// document.listView.find('.timaat-document-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-document-remove').click(this, function(ev) {
      	console.log("TCL: Document -> constructor -> this.listView.find('.timaat-document-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-document-delete').data('document', mediumDocument);
				$('#timaat-mediadatasets-document-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Document -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-document-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Document -> remove -> remove()");
			// remove document from UI
			this.listView.remove(); // TODO remove tags from document_has_tags
			// remove from document list
			var index = TIMAAT.MediaDatasets.documents.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.documents.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.documents.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.documents.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Image: class Image {
		constructor(model) {
			// console.log("TCL: Image -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editImageButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-image-edit float-left" id="timaat-image-edit"><i class="fas fa-edit"></i></button>';
			var deleteImageButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-image-remove float-left" id="timaat-image-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteImageButton = '';
				editImageButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editImageButton +
								deleteImageButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-image-list-name"></span>
							<br><br>
							<span class="timaat-image-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-image-list').append(this.listView);
			this.updateUI();      
			var image = this; // save image for system events

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
				if (image.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+image.model.medium.createdByUserAccount.id+'">[ID '+image.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(image.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+image.model.medium.createdByUserAccount.id+'">[ID '+image.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(image.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+image.model.medium.lastEditedByUserAccount.id+'">[ID '+image.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(image.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach image handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Image -> constructor -> open image datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-image-form').data('image', image);
				TIMAAT.MediaDatasets.imageFormData("show", image);				
				// image.listView.find('.timaat-image-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-image-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-image-form').data('image', image);
				TIMAAT.MediaDatasets.imageFormData("edit", image);
				// image.listView.find('.timaat-image-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-image-remove').click(this, function(ev) {
      	console.log("TCL: Image -> constructor -> this.listView.find('.timaat-image-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-image-delete').data('image', image);
				$('#timaat-mediadatasets-image-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Image -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-image-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Image -> remove -> remove()");
			// remove image from UI
			this.listView.remove(); // TODO remove tags from image_has_tags
			// remove from image list
			var index = TIMAAT.MediaDatasets.images.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.images.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.images.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.images.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Software: class Software {
		constructor(model) {
			// console.log("TCL: Software -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editSoftwareButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-software-edit float-left" id="timaat-software-edit"><i class="fas fa-edit"></i></button>';
			var deleteSoftwareButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-software-remove float-left" id="timaat-software-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteSoftwareButton = '';
				editSoftwareButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editSoftwareButton +
								deleteSoftwareButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-software-list-name"></span>
							<br><br>
							<span class="timaat-software-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-software-list').append(this.listView);
			this.updateUI();      
			var software = this; // save software for system events

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
				if (software.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+software.model.medium.createdByUserAccount.id+'">[ID '+software.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(software.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+software.model.medium.createdByUserAccount.id+'">[ID '+software.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(software.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+software.model.medium.lastEditedByUserAccount.id+'">[ID '+software.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(software.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach software handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Software -> constructor -> open software datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-software-form').data('software', software);
				TIMAAT.MediaDatasets.softwareFormData("show", software);				
				// software.listView.find('.timaat-software-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-software-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-software-form').data('software', software);
				TIMAAT.MediaDatasets.softwareFormData("edit", software);
				// software.listView.find('.timaat-software-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-software-remove').click(this, function(ev) {
      	console.log("TCL: Software -> constructor -> this.listView.find('.timaat-software-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-software-delete').data('software', software);
				$('#timaat-mediadatasets-software-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Software -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-software-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Software -> remove -> remove()");
			// remove software from UI
			this.listView.remove(); // TODO remove tags from software_has_tags
			// remove from software list
			var index = TIMAAT.MediaDatasets.softwares.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.softwares.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.softwares.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.softwares.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Text: class Text {
		constructor(model) {
			// console.log("TCL: Text -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editTextButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-text-edit float-left" id="timaat-text-edit"><i class="fas fa-edit"></i></button>';
			var deleteTextButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-text-remove float-left" id="timaat-text-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteTextButton = '';
				editTextButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editTextButton +
								deleteTextButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-text-list-name"></span>
							<br><br>
							<span class="timaat-text-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-text-list').append(this.listView);
			this.updateUI();      
			var text = this; // save text for system events

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
				if (text.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+text.model.medium.createdByUserAccount.id+'">[ID '+text.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(text.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+text.model.medium.createdByUserAccount.id+'">[ID '+text.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(text.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+text.model.medium.lastEditedByUserAccount.id+'">[ID '+text.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(text.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach text handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Text -> constructor -> open text datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-text-form').data('text', text);
				TIMAAT.MediaDatasets.textFormData("show", text);				
				// text.listView.find('.timaat-text-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-text-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-text-form').data('text', text);
				TIMAAT.MediaDatasets.textFormData("edit", text);
				// text.listView.find('.timaat-text-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-text-remove').click(this, function(ev) {
      	console.log("TCL: Text -> constructor -> this.listView.find('.timaat-text-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-text-delete').data('text', text);
				$('#timaat-mediadatasets-text-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Text -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-text-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Text -> remove -> remove()");
			// remove text from UI
			this.listView.remove(); // TODO remove tags from text_has_tags
			// remove from text list
			var index = TIMAAT.MediaDatasets.texts.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.texts.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.texts.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.texts.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Video: class Video {
		constructor(model) {
			// console.log("TCL: Video -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editVideoButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-video-edit float-left" id="timaat-video-edit"><i class="fas fa-edit"></i></button>';
			var deleteVideoButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-video-remove float-left" id="timaat-video-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteVideoButton = '';
				editVideoButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editVideoButton +
								deleteVideoButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-video-list-name"></span>
							<br><br>
							<span class="timaat-video-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-video-list').append(this.listView);
			this.updateUI();      
			var video = this; // save video for system events

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
				if (video.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+video.model.medium.createdByUserAccount.id+'">[ID '+video.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(video.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+video.model.medium.createdByUserAccount.id+'">[ID '+video.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(video.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+video.model.medium.lastEditedByUserAccount.id+'">[ID '+video.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(video.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach video handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Video -> constructor -> open video datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-video-form').data('video', video);
				TIMAAT.MediaDatasets.videoFormData("show", video);				
				// video.listView.find('.timaat-video-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-video-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-video-form').data('video', video);
				TIMAAT.MediaDatasets.videoFormData("edit", video);
				// video.listView.find('.timaat-video-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-video-remove').click(this, function(ev) {
      	console.log("TCL: Video -> constructor -> this.listView.find('.timaat-video-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-video-delete').data('video', video);
				$('#timaat-mediadatasets-video-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Video -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-video-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Video -> remove -> remove()");
			// remove video from UI
			this.listView.remove(); // TODO remove tags from video_has_tags
			// remove from video list
			var index = TIMAAT.MediaDatasets.videos.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.videos.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.videos.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.videos.model.splice(index, 1);
		}

	},

		// ------------------------------------------------------------------------------------------------------------------------

	Videogame: class Videogame {
		constructor(model) {
			// console.log("TCL: Videogame -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editVideogameButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-videogame-edit float-left" id="timaat-videogame-edit"><i class="fas fa-edit"></i></button>';
			var deleteVideogameButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-videogame-remove float-left" id="timaat-videogame-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteVideogameButton = '';
				editVideogameButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editVideogameButton +
								deleteVideogameButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-videogame-list-name"></span>
							<br><br>
							<span class="timaat-videogame-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-videogame-list').append(this.listView);
			this.updateUI();      
			var videogame = this; // save videogame for system events

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
				if (videogame.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+videogame.model.medium.createdByUserAccount.id+'">[ID '+videogame.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(videogame.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+videogame.model.medium.createdByUserAccount.id+'">[ID '+videogame.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(videogame.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+videogame.model.medium.lastEditedByUserAccount.id+'">[ID '+videogame.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(videogame.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach videogame handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Videogame -> constructor -> open videogame datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-videogame-form').data('videogame', videogame);
				TIMAAT.MediaDatasets.videogameFormData("show", videogame);				
				// videogame.listView.find('.timaat-videogame-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-videogame-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-videogame-form').data('videogame', videogame);
				TIMAAT.MediaDatasets.videogameFormData("edit", videogame);
				// videogame.listView.find('.timaat-videogame-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-videogame-remove').click(this, function(ev) {
      	console.log("TCL: Videogame -> constructor -> this.listView.find('.timaat-videogame-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-videogame-delete').data('videogame', videogame);
				$('#timaat-mediadatasets-videogame-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Videogame -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-videogame-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Videogame -> remove -> remove()");
			// remove videogame from UI
			this.listView.remove(); // TODO remove tags from videogame_has_tags
			// remove from videogame list
			var index = TIMAAT.MediaDatasets.videogames.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.videogames.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.videogames.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.videogames.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------

	Actor: class Actor {
		constructor(model) {
			// console.log("TCL: Actor -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;
			// create and style list view element
			var deleteActor = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-actor-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteActor = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteActor +
				'<span class="timaat-actor-list-title"></span>' +
				'<br> \
				<div class="timaat-actor-list-count text-muted float-left"></div> \
				<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
			</li>'
			);
			$('#timaat-actor-list').append(this.listView);
			// console.log("TCL: Actor -> constructor -> this.updateUI()");
			this.updateUI();      
			var actor = this; // save actor for system actors
			// this.listView.find('.timaat-actor-list-tags').popover({
			// 	placement: 'right',
			// 	title: 'Tags bearbeiten',
			// 	trigger: 'manual',
			// 	html: true,
			// 	content: '<div class="input-group"><input class="form-control timaat-tag-input" type="text" value=""></div>',
			// 	container: 'body',
			// 	boundary: 'viewport',				
			// });
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
			console.log("TCL: Actor -> constructor -> Display Bearbeitungslog");
				$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+actor.model.createdByUserAccount.id+'">[ID '+actor.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+actor.model.lastEditedByUserAccount.id+'">[ID '+actor.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.lastEditedAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			});
			// attach tag editor
			// this.listView.find('.timaat-actor-list-tags').on('inserted.bs.popover', function () {
			// 	var tags = "";
			// 	actor.model.tags.forEach(function(item) { tags += ','+item.name });
			// 	tags = tags.substring(1);
			// 	$('.timaat-tag-input').val(tags);
			// 		$('.timaat-tag-input').tagsInput({
			// 			placeholder: 'Tag hinzufügen',
			// 			onAddTag: function(taginput,tag) {
			// 				TIMAAT.Service.addTag(actor, tag, function(newtag) { // TODO addTag?
			// 					actor.model.tags.push(newtag);
			// 					// console.log("TCL: Actor -> constructor -> actor.updateUI() - onAddTag");
			// 					actor.updateUI();                
			// 				});
			// 			},
			// 			onRemoveTag: function(taginput,tag) {
			// 				TIMAAT.Service.removeTag(actor, tag, function(tagname) { // TODO removeTag?
			// 					// find tag in model
			// 					var found = -1;
			// 					actor.model.tags.forEach(function(item, index) {
			// 						if ( item.name == tagname ) found = index;
			// 					});
			// 				if (found > -1) actor.model.tags.splice(found, 1);
			// 					console.log("TCL: Actor -> constructor -> actor.updateUI() - onRemoveTag");
			// 					actor.updateUI();                
			// 				});
			// 			},
			// 			onChange: function() {
			// 				if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			// 			}
			// 		});
			// });
			// console.log("TCL: Actor -> constructor -> actor.updateUI()");
			// this.listView.find('.timaat-actor-list-tags').on('hidden.bs.popover', function () { actor.updateUI(); });
			// this.listView.find('.timaat-actor-list-tags').dblclick(function(ev) {ev.stopPropagation();});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.practorDefault();
				ev.stopPropagation();
			});
			// attach actor handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// actor.listView.find('.timaat-actor-list-tags').popover('show');
			});
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-actordatasets-actor-meta').data('actor', actor);
				$('#timaat-actordatasets-actor-meta').modal('show');			
			});			
			// remove handler
			this.listView.find('.timaat-actor-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-actordatasets-actor-delete').data('actor', actor);
				$('#timaat-actordatasets-actor-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Actor -> updateUI -> updateUI()");
			// title
			var name = this.model.name;			
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-actor-list-title').text(name);
			// tag count
			// var count = this.model.tags.length + " Tags";
			// if ( this.model.tags.length == 0 ) count = "keine Tags";
			// if ( this.model.tags.length == 1 ) count = "ein Tag";
			// this.listView.find('.timaat-actor-list-count').text(count);
			// tags
			this.listView.find('.timaat-actor-list-tags i').attr('title', this.model.tags.length+" Tags");			
			if (this.model.tags.length == 0) this.listView.find('.timaat-actor-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			else if (this.model.tags.length == 1) this.listView.find('.timaat-actor-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			else this.listView.find('.timaat-actor-list-tags i').attr('class','fas fa-tags text-dark');		
		}

		remove() {
			console.log("TCL: Actor -> remove -> remove()");
			// remove actor from UI
			this.listView.remove(); // TODO remove tags from actor_has_tags
			// remove from categoryset list
			var index = TIMAAT.ActorDatasets.actors.indexOf(this);
			// if (index > -1) TIMAAT.ActorDatasets.actors.splice(index, 1);
			// remove from model list
			index = TIMAAT.ActorDatasets.actors.model.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.actors.model.splice(index, 1);
		}	
	},

	// ------------------------------------------------------------------------------------------------------------------------

	Location: class Location {
		constructor(model) {
      // console.log("TCL: Location -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteLocationButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-location-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteLocationButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteLocationButton +
				'<span class="timaat-location-list-name"></span>' +
				'<br> \
				<span class="timaat-location-list-locationtype-id"></span> \
				<div class="timaat-location-list-count text-muted float-left"></div> \
				<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
		 </li>'
			);

			$('#timaat-location-list').append(this.listView);
			this.updateUI();      
			var location = this; // save location for system events

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
				console.log("TCL: Location -> constructor -> location", location);
				if (location.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+location.model.createdByUserAccount.id+'">[ID '+location.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(location.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+location.model.createdByUserAccount.id+'">[ID '+location.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(location.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+location.model.lastEditedByUserAccount.id+'">[ID '+location.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(location.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach location handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// location.listView.find('.timaat-location-list-tags').popover('show');
			});

			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-location-meta').data('location', location);
				$('#timaat-locationdatasets-location-meta').modal('show');			
			});		

			// remove handler
			this.listView.find('.timaat-location-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-location-delete').data('location', location);
				$('#timaat-locationdatasets-location-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Location -> updateUI -> updateUI() -> model", this.model);
			// title
			var name = this.model.locationTranslations[0].name;
			var type = this.model.locationType.locationTypeTranslations[0].type;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-location-list-name').text(name);
			this.listView.find('.timaat-location-list-locationtype-id').html(type);
		}

		remove() {
      // console.log("TCL: Location -> remove -> remove()");
			// remove location from UI
			this.listView.remove(); // TODO remove tags from location_has_tags
			// remove from location list
			var index = TIMAAT.LocationDatasets.locations.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.locations.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.locations.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.locations.model.splice(index, 1);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	LocationType: class LocationType {
		constructor(model) {
      // console.log("TCL: LocationType -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;

			// create and style list view element
			var deleteLocationTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-locationtype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteLocationTypeButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteLocationTypeButton +
				'<span class="timaat-locationtype-list-type"></span>' +
				'<br> \
				<div class="timaat-locationtype-list-count text-muted float-left"></div> \
				</li>'
			);

			$('#timaat-locationtype-list').append(this.listView);
			this.updateUI();      
			var locationType = this; // save locationType for system locationTypes

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
				// console.log("TCL: Locationtype -> constructor -> Display Bearbeitungslog");
				if (locationtype.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+locationtype.model.createdByUserAccount.id+'">[ID '+locationtype.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(locationtype.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+locationtype.model.createdByUserAccount.id+'">[ID '+locationtype.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(locationtype.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+locationtype.model.lastEditedByUserAccount.id+'">[ID '+locationtype.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(locationtype.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach locationType handlers
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-locationtype-meta').data('locationType', locationType);
				$('#timaat-locationdatasets-locationtype-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-locationtype-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-locationtype-delete').data('locationType', locationType);
				$('#timaat-locationdatasets-locationtype-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Locationtype -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.locationTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[nicht zugeordnet]";
			this.listView.find('.timaat-locationtype-list-name').text(type);
		}

		remove() {
      // console.log("TCL: Locationtype -> remove -> remove()");
			// remove locationType from UI
			this.listView.remove(); // TODO remove tags from location_type_has_tags
			// remove from locationType list
			var index = TIMAAT.LocationDatasets.locationTypes.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.locationTypes.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.locationTypes.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.locationTypes.model.splice(index, 1);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	Country: class Country {
		constructor(model) {
			// console.log("TCL: Country -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteCountryButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-country-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCountryButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCountryButton +
				'<span class="timaat-country-list-name"></span>' +
				'<br>' +
				'<div class="timaat-country-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-country-list').append(this.listView);
			this.updateUI();      
			var country = this; // save country for system events

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
				console.log("TCL: Country -> constructor -> country", country);
				if (country.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+country.model.location.location.location.createdByUserAccount.id+'">[ID '+country.model.location.location.location.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(country.model.location.location.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+country.model.location.location.location.createdByUserAccount.id+'">[ID '+country.model.location.location.location.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.location.location.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+country.model.location.location.location.lastEditedByUserAccount.id+'">[ID '+country.model.location.location.location.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.location.location.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach country handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// country.listView.find('.timaat-country-list-tags').popover('show');
			});

			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-country-meta').data('country', country);
				$('#timaat-locationdatasets-country-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-country-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-country-delete').data('country', country);
				$('#timaat-locationdatasets-country-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Country -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-country-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Country -> remove -> remove()");
			// remove country from UI
			this.listView.remove(); // TODO remove tags from country_has_tags
			// remove from country list
			var index = TIMAAT.LocationDatasets.countries.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.countries.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.countries.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.countries.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Province: class Province {
		constructor(model) {
			// console.log("TCL: Province -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteProvinceButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-province-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteProvinceButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteProvinceButton +
				'<span class="timaat-province-list-name"></span>' +
				'<br>' +
				'<div class="timaat-province-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-province-list').append(this.listView);
			this.updateUI();      
			var province = this; // save province for system events

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
				if (province.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+province.model.location.createdByUserAccount.id+'">[ID '+province.model.location.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(province.model.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+province.model.location.createdByUserAccount.id+'">[ID '+province.model.location.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(province.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+province.model.location.lastEditedByUserAccount.id+'">[ID '+province.model.location.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(province.model.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach province handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// province.listView.find('.timaat-province-list-tags').popover('show');
			});

			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-province-meta').data('province', province);
				$('#timaat-locationdatasets-province-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-province-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-province-delete').data('province', province);
				$('#timaat-locationdatasets-province-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Province -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-province-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Province -> remove -> remove()");
			// remove province from UI
			this.listView.remove(); // TODO remove tags from province_has_tags
			// remove from province list
			var index = TIMAAT.LocationDatasets.provinces.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.provinces.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.provinces.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.provinces.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	County: class County {
		constructor(model) {
			// console.log("TCL: County -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteCountyButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-county-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCountyButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCountyButton +
				'<span class="timaat-county-list-name"></span>' +
				'<br>' +
				'<div class="timaat-county-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-county-list').append(this.listView);
			this.updateUI();      
			var county = this; // save county for system events

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
				if (county.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+county.model.location.createdByUserAccount.id+'">[ID '+county.model.location.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(county.model.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+county.model.location.createdByUserAccount.id+'">[ID '+county.model.location.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(county.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+county.model.location.lastEditedByUserAccount.id+'">[ID '+county.model.location.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(county.model.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach county handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// county.listView.find('.timaat-county-list-tags').popover('show');
			});

			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-county-meta').data('county', county);
				$('#timaat-locationdatasets-county-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-county-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-county-delete').data('county', county);
				$('#timaat-locationdatasets-county-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: County -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-county-list-name').text(name);
		}

		remove() {
			// console.log("TCL: County -> remove -> remove()");
			// remove county from UI
			this.listView.remove(); // TODO remove tags from county_has_tags
			// remove from county list
			var index = TIMAAT.LocationDatasets.counties.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.counties.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.counties.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.counties.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	City: class City {
		constructor(model) {
			// console.log("TCL: City -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteCityButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-city-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCityButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCityButton +
				'<span class="timaat-city-list-name"></span>' +
				'<br>' +
				'<div class="timaat-city-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-city-list').append(this.listView);
			this.updateUI();      
			var city = this; // save city for system events

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
				if (city.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+city.model.location.createdByUserAccount.id+'">[ID '+city.model.location.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(city.model.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+city.model.location.createdByUserAccount.id+'">[ID '+city.model.location.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(city.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+city.model.location.lastEditedByUserAccount.id+'">[ID '+city.model.location.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(city.model.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach city handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// city.listView.find('.timaat-city-list-tags').popover('show');
			});

			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-city-meta').data('city', city);
				$('#timaat-locationdatasets-city-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-city-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-city-delete').data('city', city);
				$('#timaat-locationdatasets-city-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: City -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-city-list-name').text(name);
		}

		remove() {
			// console.log("TCL: City -> remove -> remove()");
			// remove city from UI
			this.listView.remove(); // TODO remove tags from city_has_tags
			// remove from city list
			var index = TIMAAT.LocationDatasets.cities.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.cities.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.cities.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.cities.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------

	Street: class Street {
		constructor(model) {
			// console.log("TCL: Street -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteStreetButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-street-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteStreetButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteStreetButton +
				'<span class="timaat-street-list-name"></span>' +
				'<br>' +
				'<div class="timaat-street-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-street-list').append(this.listView);
			this.updateUI();      
			var street = this; // save street for system events

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
				if (street.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+street.model.location.createdByUserAccount.id+'">[ID '+street.model.location.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(street.model.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+street.model.location.createdByUserAccount.id+'">[ID '+street.model.location.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(street.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+street.model.location.lastEditedByUserAccount.id+'">[ID '+street.model.location.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(street.model.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach street handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// street.listView.find('.timaat-street-list-tags').popover('show');
			});

			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-street-meta').data('street', street);
				$('#timaat-locationdatasets-street-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-street-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-street-delete').data('street', street);
				$('#timaat-locationdatasets-street-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Street -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-street-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Street -> remove -> remove()");
			// remove street from UI
			this.listView.remove(); // TODO remove tags from street_has_tags
			// remove from street list
			var index = TIMAAT.LocationDatasets.streets.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.streets.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.streets.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.streets.model.splice(index, 1);
		}

	},

	// ------------------------------------------------------------------------------------------------------------------------
	// ------------------------------------------------------------------------------------------------------------------------

	Event: class Event {
		constructor(model) {
      // console.log("TCL: Event -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;
			// create and style list view element
			var deleteEvent = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-event-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteEvent = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteEvent +
				'<span class="timaat-event-list-name"></span>' +
				'<span class="text-nowrap timaat-event-list-tags float-right text-muted"><i class=""></i></span><br> \
				<span class="timaat-event-list-time"></span> \
				<div class="timaat-event-list-count text-muted float-left"></div> \
				<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
		 </li>'
			);
			$('#timaat-event-list').append(this.listView);
			// console.log("TCL: Event -> constructor -> this.updateUI()");
			this.updateUI();      
			var event = this; // save event for system events
			this.listView.find('.timaat-event-list-tags').popover({
				placement: 'right',
				title: 'Tags bearbeiten',
				trigger: 'manual',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-tag-input" type="text" value=""></div>',
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
      console.log("TCL: Event -> constructor -> Display Bearbeitungslog");
				$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+event.model.createdByUserAccount.id+'">[ID '+event.model.createdByUserAccount.id+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(event.model.createdAt)+'<br>\
						 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+event.model.lastEditedByUserAccount.id+'">[ID '+event.model.lastEditedByUserAccount.id+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(event.model.lastEditedAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			});
			// attach tag editor
			this.listView.find('.timaat-event-list-tags').on('inserted.bs.popover', function () {
				var tags = "";
				event.model.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Tag hinzufügen',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.Service.addTag(event, tag, function(newtag) { // TODO addTag?
								event.model.tags.push(newtag);
								console.log("TCL: Event -> constructor -> event.updateUI() - onAddTag");
			    			event.updateUI();
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.Service.removeTag(event, tag, function(tagname) { // TODO removeTag?
			    			// find tag in model
			    			var found = -1;
			    			event.model.tags.forEach(function(item, index) {
			    				if ( item.name == tagname ) found = index;
			    			});
							if (found > -1) event.model.tags.splice(found, 1);
								console.log("TCL: Event -> constructor -> event.updateUI() - onRemoveTag");
			    			event.updateUI();
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			    	}
			    });
			});
			this.listView.find('.timaat-event-list-tags').on('hidden.bs.popover', function () { event.updateUI(); });
			this.listView.find('.timaat-event-list-tags').dblclick(function(ev) {ev.stopPropagation();});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach event handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				event.listView.find('.timaat-event-list-tags').popover('show');
			});
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-eventdatasets-event-meta').data('event', event);
				$('#timaat-eventdatasets-event-meta').modal('show');			
			});			
			// remove handler
			this.listView.find('.timaat-event-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-eventdatasets-event-delete').data('event', event);
				$('#timaat-eventdatasets-event-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Event -> updateUI -> updateUI()");
			var name = this.model.eventTranslations[0].name;
			var beginsAt = new Date(this.model.beginsAtDate);
			var endsAt = new Date(this.model.endsAtDate);
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-event-list-name').text(name);
			var dateLocale = "de-DE";
			var dateOptions = {timeZone: 'UTC', year: 'numeric', month: 'long', day: '2-digit'};
			this.listView.attr('data-beginsAtDate', beginsAt.toLocaleDateString(dateLocale, dateOptions));
			var eventDuration = " "+beginsAt.toLocaleDateString(dateLocale, dateOptions);
			if ( this.model.beginsAtDate != this.model.endsAtDate ) eventDuration += ' - '+endsAt.toLocaleDateString(dateLocale, dateOptions);
			this.listView.find('.timaat-event-list-time').html(eventDuration);	
			// tag count
			// var count = this.model.tags.length + " Tags";
			// if ( this.model.tags.length == 0 ) count = "keine Tags";
			// if ( this.model.tags.length == 1 ) count = "ein Tag";
			// this.listView.find('.timaat-event-list-count').text(count);
			// tags
			this.listView.find('.timaat-event-list-tags i').attr('title', this.model.tags.length+" Tags");			
			if (this.model.tags.length == 0) this.listView.find('.timaat-event-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			else if (this.model.tags.length == 1) this.listView.find('.timaat-event-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			else this.listView.find('.timaat-event-list-tags i').attr('class','fas fa-tags text-dark');		
		}

		remove() {
      console.log("TCL: Event -> remove -> remove()");
			// remove event from UI
			this.listView.remove(); // TODO remove tags from event_has_tags
			// remove from event list
			var index = TIMAAT.EventDatasets.events.indexOf(this);
			if (index > -1) TIMAAT.EventDatasets.events.splice(index, 1);
			// remove from model list
			index = TIMAAT.EventDatasets.events.model.indexOf(this);
			if (index > -1) TIMAAT.EventDatasets.events.model.splice(index, 1);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	UI: {
		component: null,
		
		init: function() {
    	// console.log("TCL: UI: init: function()");
			$('[data-toggle="popover"]').popover();
			
			// init components
			TIMAAT.VideoChooser.init();	   
			TIMAAT.VideoPlayer.init();
			TIMAAT.Settings.init();
			TIMAAT.Datasets.init();
			
			TIMAAT.UI.showComponent('media');
			$('#timaat-login-pass').on('keyup', function (e) { if (e.keyCode == 13) jQuery('#timaat-login-submit').click(); });
			$('#timaat-login-submit').on('click', TIMAAT.UI.processLogin);
			if ( TIMAAT.Service.state != 1 ) {
				$('body').addClass('timaat-login-modal-open');
				$('#timaat-login-modal').modal('show');
			}
			
			// init tag popover functionality
			$(document).on('click', function (e) {
					$('[data-toggle="popover"],[data-original-title]').each(function () {
							if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
									(($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false
							}
					});
			});
			
			// init user log popover functionality
			$('#timaat-user-log-list').popover({
			placement: 'bottom',
			title: '<i class="fas fa-user"></i> Bearbeitungslog',
			trigger: 'click',
			html: true,
			content: '<div class="timaat-user-log-details">Lade...</div>',
			container: 'body',
			boundary: 'viewport',
			});
			
			$('#timaat-user-log-list').on('inserted.bs.popover', function () {
		    	TIMAAT.Service.getUserLog(TIMAAT.Service.session.id, 12, function(log) {
		    		var html = '';
		    		if ( log.length == 0 ) html = "Keine Daten vorhanden";
					$(log).each(function(index, entry) {
			    		var icon = 'fas fa-info';
			    		switch (entry.userLogEventType.type) {
			    		case 'login':
			    			icon = 'fas fa-sign-in-alt';
			    			break;
			    		case 'userCreated':
			    		case 'mediumCreated':
			    		case 'analysislistCreated':			    			
			    		case 'annotationCreated':
			    			icon = 'fas fa-plus-square';
			    			break;
			    		case 'mediumEdited':
			    		case 'analysislistEdited':			    			
			    		case 'analysislistDeleted':
			    			icon = 'fas fa-edit';
			    			break;
			    		case 'mediumDeleted':
			    		case 'analysislistDeleted':			    			
			    		case 'annotationDeleted':
			    			icon = 'fas fa-trash-alt';
			    			break;
			    		}

						html += '<b><i class="'+icon+'"></i> '+TIMAAT.Util.formatLogType(entry.userLogEventType.type)
							    +'</b><br>'+TIMAAT.Util.formatDate(entry.dateTime)+'<br>';
					});
					$('.timaat-user-log-details').html(html);
		    		
					$(log).each(function(index, entry) {TIMAAT.Service.idCache.set(entry.userAccount.id, entry.userAccount.accountName);});
					//	$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item,"ich")});
		    	});
			});

			$.datetimepicker.setDateFormatter('moment');
		},
		
		hidePopups: function() {
    	// console.log("TCL: hidePopups: function()");
			$('[data-toggle="popover"],[data-original-title]').each(function () {
				(($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false
	        });
		},
		
		showComponent: function(component) {
			// console.log("TCL: showComponent: function(component)");
			// console.log("TCL: component", component);
			TIMAAT.UI.component = component;
			TIMAAT.VideoPlayer.pause(); // TODO refactor
			$('.timaat-component').hide();
			$('.timaat-sidebar-tab').removeClass('bg-info');
			$('.timaat-sidebar-tab a').removeClass('selected');
			$('#timaat-component-'+component).show();
			$('.timaat-sidebar-tab-'+component).addClass('bg-info');
			$('.timaat-sidebar-tab-'+component+' a').addClass('selected');
			
		},
		
		setWaiting: function(waiting) {
   		console.log("TCL: setWaiting: function(waiting)");
    	console.log("TCL: waiting", waiting);
			if (waiting) $('#timaat-ui-waiting').modal('show');
			else $('#timaat-ui-waiting').modal('hide');
		},
		
		processLogin: function() {
    	// console.log("TCL: processLogin: function()");
			var user = jQuery('#timaat-login-user').val();
			var pass = jQuery('#timaat-login-pass').val();
			if ( user.length > 0 && pass.length > 0 ) {
				hash = TIMAAT.Util.getArgonHash(pass,user+"timaat.kunden.bitgilde.de"); // TODO refactor
				var credentials = {
					username : user,
					password: hash
				}
		
				$.ajax({
						// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/authenticate",
						url:"api/authenticate",
					  type:"POST",
					  data:JSON.stringify(credentials),
					  contentType:"application/json; charset=utf-8",
					  dataType:"json",
					  }).done(function(e) {
					    TIMAAT.Service.session = e;
					    TIMAAT.Service.token = e.token;
					    $('body').removeClass('timaat-login-modal-open');
					    $('#timaat-login-modal').modal('hide');
					    $('#timaat-user-info').html(e.accountName);
							
					    // TIMAAT.VideoChooser.loadVideos(); // TODO re-enable and differentiate between medium and video
							TIMAAT.Settings.loadCategorySets();
							TIMAAT.Datasets.load();
					  })
					  .fail(function(e) {
       				console.log("TCL: processLogin fail: e", e);
					    console.log( "error",e );
					    jQuery('#timaat-login-message').fadeIn();
					  });
			}
		}
		
	},
		
	// ------------------------
	    
	Util: {
		serverprefix: "",
		
		formatTime: function(seconds, withFraction = false) {
    // console.log("TCL: formatTime: function(seconds, withFraction = false)");
    // console.log("TCL:   -> seconds", seconds);
    // console.log("TCL:   -> withFraction = false", withFraction);
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
		},
		
		formatDate: function (timestamp) {
    // console.log("TCL: formatDate: function (timestamp)");
    // console.log("TCL:   -> timestamp", timestamp);
			  var a = new Date(timestamp);
//			  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
			  var year = a.getFullYear();
			  var month = ("0" + (a.getMonth()+1)).substr(-2);
			  var date = ("0" + a.getDate()).substr(-2);
			  var hour = ("0" + a.getHours()).substr(-2);
			  var min = ("0" + a.getMinutes()).substr(-2);
			  var sec = ("0" + a.getSeconds()).substr(-2);
			  var time = date + '.' + month + '.' + year + ', ' + hour + ':' + min + ':' + sec ;
			  return time;
		},
		
		formatLogType: function(type) {
    // console.log("TCL: formatLogType: function(type)");
    // console.log("TCL:   -> type", type);
			var display = '['+type+']';
			
			switch (type) {
			case 'login':
				type = 'Anmeldung API';
				break;
			case 'mediumCreated':
				type = 'Video Upload';
				break;
			case 'analysislistCreated':
				type = 'Analyseliste angelegt';
				break;
			case 'analysislistEdited':
				type = 'Analyseliste bearbeitet';
				break;
			case 'analysislistDeleted':
				type = 'Analyseliste gelöscht';
				break;
			case 'annotationCreated':
				type = 'Annotation angelegt';
				break;
			case 'annotationEdited':
				type = 'Annotation bearbeitet';
				break;
			case 'annotationDeleted':
				type = 'Annotation gelöscht';
				break;
			}
			
			return type;
		},
		
		parseTime: function(timecode) {
    // console.log("TCL: parseTime: function(timecode) ");
    // console.log("TCL:   -> timecode", timecode);
			var time = 0;
			var hours = 0;
			var mins = 0;
			var secs = 0;
			var fraction = 0;
			
			// parse fraction
			if ( timecode.indexOf('.') > -1 ) {
				var temp = timecode.substring(timecode.indexOf('.'));
				fraction = parseFloat(temp);
				if ( isNaN(fraction) ) fraction = 0;
				timecode = timecode.substring(0,timecode.indexOf('.'));
			}
			// parse hours
			if ( (timecode.match(/:/g) || []).length  > 1 ) {
				var temp = timecode.substring(0,timecode.indexOf(':'));
				timecode = timecode.substring(timecode.indexOf(':')+1);
				hours = parseInt(temp);
				if ( isNaN(hours) ) hours = 0;
				
			}
			// parse minutes
			if ( (timecode.match(/:/g) || []).length  > 0 ) {
				var temp = timecode.substring(0,timecode.indexOf(':'));
				timecode = timecode.substring(timecode.indexOf(':')+1);
				mins = parseInt(temp);
				if ( isNaN(mins) ) mins = 0;
			}
			// parse seconds
			secs = parseInt(timecode);
			if ( isNaN(secs) ) secs = 0;
			
			time = (hours*60*60)+(mins*60)+secs+fraction;
						
			return time;
		},
		
		resolveUserID: function(idElement, myself) {
    // console.log("TCL: resolveUserID: function(idElement, myself)");
    // console.log("TCL:   -> idElement", idElement);
    // console.log("TCL:   -> myself", myself);
			if ( !myself ) myself="mir";
			
			var id = $(idElement).data('userid');
			if (TIMAAT.Service.session.id == id) $(idElement).text(myself);
			else if ( TIMAAT.Service.idCache.has(id) ) $(idElement).text(TIMAAT.Service.idCache.get(id));
			else {
				TIMAAT.Service.getUserName(id,function(name) {
					$(idElement).text(name);
					TIMAAT.Service.idCache.set(id, name);
				});
			}
		},
		
		getArgonHash: function(password, salt) {
    // console.log("TCL: getArgonHash: function(password, salt)");
			var hash = Module.allocate(new Array(32), 'i8', Module.ALLOC_NORMAL);
			var encoded = Module.allocate(new Array(512), 'i8', Module.ALLOC_NORMAL);
			var passwordArr = allocateArray(password);
			var saltArr = allocateArray(salt);

			Module._argon2_hash(8, 4096, 1, passwordArr, password.length, saltArr, salt.length,
			            hash, 32, encoded, 512,
			            2, 0x13);

			var hashArr = [];
			for (var i = hash; i < hash + 32; i++) { hashArr.push(Module.HEAP8[i]); }
	
			var argonHash = hashArr.map(function(b) { return ('0' + (0xFF & b).toString(16)).slice(-2); }).join('');
	
			Module._free(passwordArr);
			Module._free(saltArr);
			Module._free(hash);
			Module._free(encoded);
	
			return argonHash;
		},
		
	}
};

// ------------------------------------------------------------------------------------------------------------------------

function setupTIMAAT() {
	var map = L.map('map', {
		zoomControl: false,
		attributionControl: false,
		zoom: 1,
		maxZoom: 0,
		center: [0,0],
		crs: L.CRS.Simple,
		editable: true,		
	});
	window.map = map; // TODO refactor	
	map.on('layeradd', function(ev) {
		if ( ev.layer.options.data ) 
			ev.layer.eachLayer(function (layer) {
				if ( !layer.options.editable ) layer.enableEdit();
				layer.options.editable = true;
			});
	});
	
	var bounds = [[450,0], [0,800]];
	map.setMaxBounds(bounds);
	map.fitBounds(bounds);	
	map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();

	$(window).resize(function() {
		TIMAAT.VideoPlayer.markerList.forEach(function(marker) {
			marker._updateElementOffset();
		});
	});	   
	TIMAAT.UI.init();
}

if (window.attachEvent) {
  window.attachEvent('onload', setupTIMAAT);
} else {
	if(window.onload) {
		var curronload = window.onload;
		var newonload = function(evt) {
			curronload(evt);
			setupTIMAAT();
		};
		window.onload = newonload;
	} else {
		window.onload = setupTIMAAT;
	}
}