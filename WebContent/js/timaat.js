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
	
	// ------------------------
	
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
						<span class="text-nowrap timaat-annotation-list-tags float-right text-muted"><i class=""></i></span><br> \
						<div class="timaat-annotation-list-title text-muted float-left"></div> \
						<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
					</li>'
			);
			console.log("TCL: Annotation -> constructor -> this.updateUI()");
			this.updateUI();
			
			var anno = this; // save annotation for events

			$('#timaat-annotation-list').append(this.listView);
			this.listView.find('.timaat-annotation-list-tags').popover({
				placement: 'right',
				title: 'Tags bearbeiten',
				trigger: 'click',
				html: true,
				content: '<div class="input-group ui-front"><input class="form-control timaat-tag-input" type="text" value=""></div>',
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
						'<b><i class="far fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+anno.model.createdBy_UserAccountID+'">[ID '+anno.model.createdBy_UserAccountID+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(anno.model.created)+'<br>\
						 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+anno.model.lastEditedBy_UserAccountID+'">[ID '+anno.model.lastEditedBy_UserAccountID+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(anno.model.lastEditedAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			});
			
			// attach tag editor
			this.listView.find('.timaat-annotation-list-tags').on('shown.bs.popover', function (ev) {
				var curtsname = "keins";
				if ( TIMAAT.VideoPlayer.curTagset ) curtsname = TIMAAT.VideoPlayer.curTagset.model.name;
				
				var dropdown =  $('<br><div class="btn-group dropright timaat-tagset-chooser d-flex">' +
								'<button style="width:100%" type="button" class="btn btn-sm btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
								'Tagset: ' + curtsname + 
								'</button>' +
								'<div class="dropdown-menu">' +
								'</div></div>');	
				$($(this).data('bs.popover').tip).find('.popover-header').append(dropdown);
				var tschooser = $($(this).data('bs.popover').tip).find('.timaat-tagset-chooser');

				var empty = $('<a class="dropdown-item">(kein Tagset)</a>');
				tschooser.find('.dropdown-menu').append(empty);
				empty.click(function() {					
					TIMAAT.VideoPlayer.setTagset(null);
					dropdown.find('button').text("Tagset: keins");
				});
				$(TIMAAT.Settings.tagsets).each(function(index, tagset) {
					var item = $('<a class="dropdown-item">'+tagset.model.name+'</a>');
					tschooser.find('.dropdown-menu').append(item);
					item.click(function() {
						TIMAAT.VideoPlayer.setTagset(tagset);
						dropdown.find('button').text("Tagset: "+tagset.model.name);
						
					});
				});
				
				//				$(this).data('bs.popover').config.content = 'new content';
			});
			this.listView.find('.timaat-annotation-list-tags').on('inserted.bs.popover', function () {
				var tags = "";
				anno.model.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Tag hinzufügen',
			    	autocomplete: {
			    		position: { my : "right top", at: "right bottom" },
			    		source: TIMAAT.VideoPlayer.tagAutocomplete,
			    	},

			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.Service.addTag(anno, tag, function(newtag) {
								anno.model.tags.push(newtag);
								console.log("TCL: Annotation -> constructor -> anno.updateUI()");
                anno.updateUI();                
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.Service.removeTag(anno, tag, function(tagname) {
			    			// find tag in model
			    			var found = -1;
			    			anno.model.tags.forEach(function(item, index) {
			    				if ( item.name == tagname ) found = index;
			    			});
							if (found > -1) anno.model.tags.splice(found, 1);
							console.log("TCL: Annotation -> constructor -> anno.updateUI()");
			    			anno.updateUI();                
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			    	}
			    });
			});
			this.listView.find('.timaat-annotation-list-tags').on('hidden.bs.popover', function () { anno.updateUI(); });
      console.log("TCL: Annotation -> constructor -> anno.updateUI()");
			this.listView.find('.timaat-annotation-list-tags').dblclick(function(ev) {ev.stopPropagation();});

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
			// tags
			this.listView.find('.timaat-annotation-list-tags i').attr('title', this.model.tags.length+" Tags");			
			if (this.model.tags.length == 0) this.listView.find('.timaat-annotation-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			else if (this.model.tags.length == 1) this.listView.find('.timaat-annotation-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			else this.listView.find('.timaat-annotation-list-tags i').attr('class','fas fa-tags text-dark');
			
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
	
	// ------------------------
	
	Tagset: class Tagset {
		constructor(model) {
      // console.log("TCL: Tagset -> constructor -> model", model);
			// setup model
			this.model = model;
			model.ui = this;
			
			// create and style list view element
			var deltagset = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-tagset-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deltagset = '';
			this.listView = $('<li class="list-group-item"> '
					+ deltagset +
					'<span class="timaat-tagset-list-title"></span>' +
					'<span class="text-nowrap timaat-tagset-list-tags float-right text-muted"><i class=""></i></span><br> \
					<div class="timaat-tagset-list-count text-muted float-left"></div> \
					<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user-disabled"></i></div> \
				</li>'
		);

			$('#timaat-tagset-list').append(this.listView);
			// console.log("TCL: Tagset -> constructor -> this.updateUI()");
			this.updateUI();      
			
			var tagset = this; // save tagset for events
			
			this.listView.find('.timaat-tagset-list-tags').popover({
				placement: 'right',
				title: 'Tags bearbeiten',
				trigger: 'manual',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-tag-input" type="text" value=""></div>',
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
			// 			'<b><i class="far fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+tagset.model.createdByUserAccountID+'">[ID '+tagset.model.createdByUserAccountID+']</span></b><br>\
			// 			 '+TIMAAT.Util.formatDate(tagset.model.createdAt)+'<br>\
			// 			 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+tagset.model.lastEditedByUserAccountID+'">[ID '+tagset.model.lastEditedByUserAccountID+']</span></b><br>\
			// 			 '+TIMAAT.Util.formatDate(tagset.model.lastEditedAt)+'<br>'
			// 	);
			// 	$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			// });
			// attach tag editor
			this.listView.find('.timaat-tagset-list-tags').on('inserted.bs.popover', function () {
				var tags = "";
				tagset.model.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Tag hinzufügen',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.Service.addTag(tagset, tag, function(newtag) {
							tagset.model.tags.push(newtag);
								console.log("TCL: Tagset -> constructor -> tagset.updateUI() - onAddTag");
			    			tagset.updateUI();                
			    		});

			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.Service.removeTag(tagset, tag, function(tagname) {
			    			// find tag in model
			    			var found = -1;
			    			tagset.model.tags.forEach(function(item, index) {
			    				if ( item.name == tagname ) found = index;
			    			});
							if (found > -1) tagset.model.tags.splice(found, 1);
								console.log("TCL: Tagset -> constructor -> tagset.updateUI() - onRemoveTag");
			    			tagset.updateUI();                
			    		});

			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			    	}
			    });
			});
			// console.log("TCL: Tagset -> constructor -> tagset.updateUI()");
			this.listView.find('.timaat-tagset-list-tags').on('hidden.bs.popover', function () { tagset.updateUI(); });
			this.listView.find('.timaat-tagset-list-tags').dblclick(function(ev) {ev.stopPropagation();});

			// // attach user log info
			// this.listView.find('.timaat-user-log').click(function(ev) {
			// 	ev.preventDefault();
			// 	ev.stopPropagation();
			// });
			
			// attach event handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				tagset.listView.find('.timaat-tagset-list-tags').popover('show');
			});
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-settings-tagset-meta').data('tagset', tagset);
				$('#timaat-settings-tagset-meta').modal('show');			
			});
			
			// remove handler
			this.listView.find('.timaat-tagset-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-settings-tagset-delete').data('tagset', tagset);
				$('#timaat-settings-tagset-delete').modal('show');
			});

		}
		
		updateUI() {
      // console.log("TCL: Tagset -> updateUI -> updateUI()");
			// title
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-tagset-list-title').text(name);
			// tag count
			var count = this.model.tags.length + " Tags";
			if ( this.model.tags.length == 0 ) count = "keine Tags";
			if ( this.model.tags.length == 1 ) count = "ein Tag";
			this.listView.find('.timaat-tagset-list-count').text(count);
			// tags
			this.listView.find('.timaat-tagset-list-tags i').attr('title', this.model.tags.length+" Tags");			
			if (this.model.tags.length == 0) this.listView.find('.timaat-tagset-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			else if (this.model.tags.length == 1) this.listView.find('.timaat-tagset-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			else this.listView.find('.timaat-tagset-list-tags i').attr('class','fas fa-tags text-dark');
		}
		
		remove() {
      console.log("TCL: Tagset -> remove -> remove()");
			// remove annotation from UI
			this.listView.remove();
			
			// remove from tagset list
			var index = TIMAAT.Settings.tagsets.indexOf(this);
			if (index > -1) TIMAAT.Settings.tagsets.splice(index, 1);

			// remove from model list
			index = TIMAAT.Settings.tagsets.model.indexOf(this);
			if (index > -1) TIMAAT.Settings.tagsets.model.splice(index, 1);

		}
		
	},	
	
	// ------------------------
	
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
	
	// ------------------------
	
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
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/"+video.id+'/status',
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
    	console.log("TCL: videos", videos);
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
			videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/"+video.id+"/thumbnail"+"?token="+video.viewToken);
			videoelement.appendTo('#timaat-video-list');

			videoelement.find('.title').html(video.primaryTitle.title);
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
				TIMAAT.Service.getAnalysisLists(video.id, TIMAAT.VideoPlayer.setupAnalysisLists);
			});
			
			videoelement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
				var timecode = Math.round((ev.originalEvent.offsetX/254)*video.mediumVideo.length);
				timecode = Math.min(Math.max(0, timecode),video.mediumVideo.length);
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/"+video.id+"/thumbnail"+"?time="+timecode+"&token="+video.viewToken);
			});
			videoelement.find('.card-img-top').bind("mouseleave", function(ev) {
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/"+video.id+"/thumbnail"+"?token="+video.viewToken);
			});
			
			if ( video.status == "transcoding" ) TIMAAT.VideoChooser.updateVideoStatus(video);

		},
		
	},	

	// ------------------------
	
	VideoPlayer: {
		duration: 1,
		annotationList: [],
		curAnnotation: null,
		curList: null,
		curTagset: null,
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
			              '    <i class="far fa-bookmark"></i>'+
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
				preview.find('img').attr('src', "/TIMAAT/api/medium/"+TIMAAT.VideoPlayer.model.video.id+"/thumbnail?token="+token+"&time="+time);
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
						'<b><i class="far fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+TIMAAT.VideoPlayer.curList.userAccountID+'">[ID '+TIMAAT.VideoPlayer.curList.userAccountID+']</span></b><br>\
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
					TIMAAT.Service.createAnalysislist(title, comment, TIMAAT.VideoPlayer.model.video.id, TIMAAT.VideoPlayer._analysislistAdded);
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
    	var videoUrl = '/TIMAAT/api/medium/'+this.model.video.id+'/download'+'?token='+video.viewToken;
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
		
		setTagset: function(tagset) {
    console.log("TCL: setTagset: function(tagset)");
    console.log("TCL: tagset", tagset);
			TIMAAT.VideoPlayer.curTagset = tagset;
			TIMAAT.VideoPlayer.tagAutocomplete.length = 0;
			if ( tagset ) {
				$(tagset.model.tags).each(function(index,tag) {
					TIMAAT.VideoPlayer.tagAutocomplete.push(tag.name);
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

	// ------------------------

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
		
		getAllTagSets: function(callback) {
    // console.log("TCL: getAllTagSets: function(callback)");
    // console.log("TCL: callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/tag/tagset/all",
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
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/medium/"+TIMAAT.VideoPlayer.model.video.id,
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
			if ( set.constructor === TIMAAT.Tagset ) serviceEndpoint = "tag/tagset"; 
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
				TIMAAT.Service.updateTagsets(tagname);
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
			if  ( set.constructor === TIMAAT.Tagset ) serviceEndpoint = "tag/tagset";
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
				TIMAAT.Service.updateTagsets(tagname);
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
				TIMAAT.Service.updateTagsets(tagname);
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
				TIMAAT.Service.updateTagsets(tagname);
				callback(tagname);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},
		
		updateTagsets(tagname) {
      console.log("TCL: updateTagsets -> tagname", tagname);
			// TODO implement for updating unassigned tags
		},
		
		createTagset(name, callback) {
      console.log("TCL: createTagset -> createTagset(name, callback)");
      console.log("TCL:   -> createTagset -> name", name);
      // console.log("TCL: createTagset -> callback", callback);
      // console.log("TCL: createTagset -> name, callback", name, callback);
			var model = {
					"id": 0,
					"name": name,
					"tags": [],
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/tag/tagset/",
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
		
		updateTagset(tagset) {
      console.log("TCL: updateTagset -> tagset", tagset);
			var set = {
					id: tagset.model.id,
					name: tagset.model.name,
					tags: []
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/tag/tagset/"+set.id,
				type:"PATCH",
				data: JSON.stringify(set),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// TODO refactor
				tagset.model.id = data.id;
				tagset.model.name = data.name;
				tagset.model.tags = data.tags;
				console.log("TCL: updateTagset -> tagset.updateUI()");
				tagset.updateUI();        
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeTagset(tagset) {
      console.log("TCL: removeTagset -> tagset", tagset);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/tag/tagset/"+tagset.model.id,
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
				// 	languageID: list,
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
			// console.log("TCL: updateActor -> locationID", actor.model.locationID);
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

		// addActorTag(actor, tagname, callback) {
    //   console.log("TCL: addActorTag -> actor.id", actor.id);
    //   console.log("TCL: addActorTag -> actor, tagname, callback", actor, tagname, callback);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actor.id+"/tag/"+tagname,
		// 		type:"POST",
		// 		contentType:"application/json; charset=utf-8",
		// 		dataType:"json",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TIMAAT.Service.updateTagsets(tagname);
		// 		callback(data);
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});			
		// },

		// removeActorTag(actor, tagname, callback) {
    //   console.log("TCL: removeActorTag -> actor.id", actor.id);
    //   console.log("TCL: removeActorTag -> actor, tagname, callback", actor, tagname, callback);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/actor/"+actor.id+"/tag/"+tagname,
		// 		type:"DELETE",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TIMAAT.Service.updateTagsets(tagname);
		// 		callback(tagname);
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});			
		// },

		listLocations(callback) {
      // console.log("TCL: listLocations -> callback", callback);
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

		createLocation(name, type, callback) {
    console.log("TCL: createLocation -> createLocation(name, type, callback)", createLocation(name, type, callback));
			var model = { 	
				id: 0,   
				type: type,
				name: name, // TODO change to proper locationTranslation		
			};
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+model.id,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// callback(new TIMAAT.Location(data));
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

		updateLocation(location) {
			console.log("TCL: updateLocation -> location", location);
			var loc = {
				id: location.model.id,
				type: location.model.type,
				name: location.model.name,
			};
      console.log("TCL: updateLocation -> loc", loc);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+loc.id,
				type:"PATCH",
				data: JSON.stringify(loc),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      console.log("TCL: updateLocation -> data", data);
				// thisLocation.model = data;
				// loc.model = data;
				location.model.id = data.id;
				location.model.type = data.type;
				location.model.title = data.title;
				console.log("TCL: updateLocation -> location.updateUI()");
				location.updateUI(); 
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeLocation(location) {
      console.log("TCL: removeLocation -> location", location);
			var loc = location;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+loc.model.id,
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

		// addLocationTag(location, tagname, callback) {
    //   console.log("TCL: addLocationTag -> location.id", location.id);
    //   console.log("TCL: addLocationTag -> location, tagname, callback", location, tagname, callback);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+location.id+"/tag/"+tagname,
		// 		type:"POST",
		// 		contentType:"application/json; charset=utf-8",
		// 		dataType:"json",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TIMAAT.Service.updateTagsets(tagname);
		// 		callback(data);
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});			
		// },

		// removeLocationTag(location, tagname, callback) {
    //   console.log("TCL: removeLocationTag -> location.id", location.id);
    //   console.log("TCL: removeLocationTag -> location, tagname, callback", location, tagname, callback);
		// 	jQuery.ajax({
		// 		url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/location/"+location.id+"/tag/"+tagname,
		// 		type:"DELETE",
		// 		beforeSend: function (xhr) {
		// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 		},
		// 	}).done(function(data) {
		// 		// TIMAAT.Service.updateTagsets(tagname);
		// 		callback(tagname);
		// 	})
		// 	.fail(function(e) {
		// 		console.log( "error", e );
		// 		console.log( e.responseText );
		// 	});			
		// },

		listCountries(callback) {
      // console.log("TCL: listCountries -> callback", callback);
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/country/list",
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

		createCountry(name, idp, tp, ccc, tz, dst, callback) {
			console.log("TCL: createCountry -> name:", name);
      console.log("TCL: createCountry -> callback", callback);
			var model = { 	
				locationID: 0,         
				name: name, // TODO change to countryTranslation
				internationalDialingPrefix: idp,
				trunkPrefix: tp,
				countryCallingCode: ccc,
				timeZone: tz,
				dst: dst,
				// countryTranslation: [{
				// 	id: 0,
				// 	languageID: list,
				// 	name: name,
				// 	description: description
				// }]				
			};
			jQuery.ajax({
				// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/country/"+model.id,
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/country/"+model.locationID,
				type:"POST",
				data: JSON.stringify(model),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				// callback(new TIMAAT.Country(data));
				callback(data);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

		updateCountry(country) {
			console.log("TCL: updateCountry -> country", country);
			var loc = {
				locationID: country.model.locationID,
				name: country.model.name,
				internationalDialingPrefix: country.model.internationalDialingPrefix,
				trunkPrefix: country.model.trunkPrefix,
				countryCallingCode: country.model.countryCallingCode,
				timeZone: country.model.timeZone,
				dst: country.model.dst,
			};
      console.log("TCL: updateCountry -> loc", loc);
			// var thisCountry = country;
			jQuery.ajax({
				// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/country/"+thisCountry.model.id,
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/country/"+loc.locationID,
				type:"PATCH",
				data: JSON.stringify(loc),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      console.log("TCL: updateCountry -> data", data);
				// thisCountry.model = data;
				// loc.model = data;
				country.model.locationID = data.locationID;
				country.model.name = data.name;
				country.model.internationalDialingPrefix= data.internationalDialingPrefix;
				country.model.trunkPrefix = data.trunkPrefix;
				country.model.countryCallingCode = data.countryCallingCode;
				country.model.timeZone = data.timeZone;
				country.model.dst = data.dst;
				console.log("TCL: updateCountry -> country.updateUI()");
				country.updateUI(); 
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeCountry(country) {
      console.log("TCL: removeCountry -> country", country);
			var loc = country;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/country/"+loc.model.locationID,
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
				event.eventtranslations[0] = data;
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

		createEventTranslation(model, modelTranslation, callback) {
      // console.log("TCL: createEventTranslation -> model", model);
      // console.log("TCL: createEventTranslation -> modelTranslation", modelTranslation);
			// var modelTranslation = model.eventtranslations;
			// createEventTranslation(name, description, eventID) {
			// console.log("TCL: [4] createEventTranslation -> modelTranslation, eventID: ", modelTranslation, model.id);
			//  create Event translation
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+model.id+"/translation/"+modelTranslation.id,
				type:"POST",
				data: JSON.stringify(modelTranslation),
				contentType:"application/json; charset=utf-8",
				dataType:"json",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
      	// console.log("TCL: [5] createEventTranslation .done() -> data", data);
				// callback(new TIMAAT.Event(data));
				model.eventtranslations[0] = data;
				// console.log("TCL: [6] createEventTranslation -> modelTranslation.id", model.eventtranslations[0].id);
				// return model;
				// event.model.eventtranslations[0].name = data.eventtranslations[0].name;
				// event.model.eventtranslations[0].description = data.eventtranslations[0].description;
				callback(model);
			}).fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		// createEvent: async function(model) {
		// 	console.log("TCL: [1] createEvent -> model", model);
		// 	// create Event
		// 	try {
		// 		result = await jQuery.ajax({
		// 			url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+model.id,
		// 			type:"POST",
		// 			data: JSON.stringify(model),
		// 			contentType:"application/json; charset=utf-8",
		// 			dataType:"json",
		// 			beforeSend: function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		});
		// 		return data;
		// 	} catch (error) {
		// 		console.log("error: ", error.responseText);
		// 	}
		// },

		// createEventTranslation: async function(model, modelTranslation) {
		// // createEventTranslation(name, description, eventID) {
		// 	console.log("TCL: [4] createEventTranslation -> modelTranslation, eventID: ", modelTranslation, eventID);
		// 	//  create Event translation
		// 	try {
		// 		result = await jQuery.ajax({
		// 			url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+model.id+"/translation/"+modelTranslation.id,
		// 			type:"POST",
		// 			data: JSON.stringify(modelTranslation),
		// 			contentType:"application/json; charset=utf-8",
		// 			dataType:"json",
		// 			beforeSend: function (xhr) {
		// 				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
		// 			},
		// 		});
		// 		return data;
		// 	} catch (error) {
		// 		console.log("error: ", error.responseText);
		// 	}
		// },

		updateEvent(event) {
			console.log("TCL: updateEvent -> event", event);
			var updatedEvent = {
				id: event.model.id,
				// name: event.model.eventtranslations[0].name,
				// description: event.model.eventtranslations[0].description,
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
				event.model.eventtranslations[0].id = data.eventtranslations[0].id;
				event.model.eventtranslations[0].name = data.eventtranslations[0].name;
				event.model.eventtranslations[0].description = data.eventtranslations[0].description;				
				// console.log("TCL: update event translation", event);
				// TIMAAT.Service.updateEventTranslation(event);
				// console.log("TCL: updateEvent -> event.updateUI()");
				// event.updateUI(); 
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
				id: event.model.eventtranslations[0].id, // TODO get the correct translationID
				name: event.model.eventtranslations[0].name,
				description: event.model.eventtranslations[0].description,
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
				event.model.eventtranslations[0].id = translationData.id;
				event.model.eventtranslations[0].name = translationData.name;
				event.model.eventtranslations[0].description = translationData.description;
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
			var ev = event;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+ev.model.id,
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
      console.log("TCL: removeEvent -> event", event);
			var ev = event;
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/event/"+ev.model.id+"/translation/"+ev.model.eventtranslations[0].id,
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
				// TIMAAT.Service.updateTagsets(tagname);
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
				// TIMAAT.Service.updateTagsets(tagname);
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
		tagsets: null,
		
		init: function() {
    	// console.log("TCL: Settings: init: function()");
			// attach tag editor
			$('#timaat-medium-tags').popover({
				placement: 'right',
				title: 'Medium Tags bearbeiten',
				trigger: 'click',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-tag-input" type="text" value=""></div>',
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-medium-tags').on('inserted.bs.popover', function () {
				var tags = "";
				if ( TIMAAT.VideoPlayer.video == null ) {
					$('.timaat-tag-input').html('Kein Video geladen');
					return;
				} else {
					$('.timaat-tag-input').html('');					
				}
				TIMAAT.VideoPlayer.model.video.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Medium Tag hinzufügen',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.Service.addMediumTag(TIMAAT.VideoPlayer.model.video, tag, function(newtag) {
			    			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.Service.removeMediumTag(TIMAAT.VideoPlayer.model.video, tag, function(tagname) {
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
			$('#timaat-medium-tags').on('hidden.bs.popover', function () { 
			});			

			// delete tagset functionality
			$('#timaat-tagset-delete-submit').click(function(ev) {
				var modal = $('#timaat-settings-tagset-delete');
				var tagset = modal.data('tagset');
				if (tagset) TIMAAT.Settings._tagsetRemoved(tagset);
				modal.modal('hide');
			});
			
			// add/edit tagset functionality
			$('#timaat-tagset-add').attr('onclick','TIMAAT.Settings.addTagset()');
			$('#timaat-settings-tagset-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var tagset = modal.data('tagset');				
				var heading = (tagset) ? "Tagset bearbeiten" : "Tagset hinzufügen";
				var submit = (tagset) ? "Speichern" : "Hinzufügen";
				var title = (tagset) ? tagset.model.name : "";				
				// setup UI from Video Player state
				$('#tagsetMetaLabel').html(heading);
				$('#timaat-tagset-meta-submit').html(submit);
				$("#timaat-tagset-meta-title").val(title).trigger('input');				
			});
			$('#timaat-tagset-meta-submit').click(function(ev) {
				var modal = $('#timaat-settings-tagset-meta');
				var tagset = modal.data('tagset');
				var title = $("#timaat-tagset-meta-title").val();				
				if (tagset) {
					tagset.model.name = title;
					// console.log("TCL: tagset.updateUI() - Settings init()");
					tagset.updateUI();          
					TIMAAT.Service.updateTagset(tagset);
				} else {
					TIMAAT.Service.createTagset(title, TIMAAT.Settings._tagsetAdded);
				}
				modal.modal('hide');
			});
			$('#timaat-tagset-meta-title').on('input', function(ev) {
				console.log("TCL: validate tagset input");
				console.log("TCL: $(\"#timaat-tagset-meta-title\").val():", $("#timaat-tagset-meta-title").val());
				if ( $("#timaat-tagset-meta-title").val().length > 0 ) {
					$('#timaat-tagset-meta-submit').prop("disabled", false);
					$('#timaat-tagset-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-tagset-meta-submit').prop("disabled", true);
					$('#timaat-tagset-meta-submit').attr("disabled");
				}
			});
		},
		
		loadTagSets: function() {
    // console.log("TCL: loadTagSets: function()");
			// load tagsets
			TIMAAT.Service.getAllTagSets(TIMAAT.Settings.setTagSetLists);
		},
		
		setTagSetLists: function(tagsets) {
    // console.log("TCL: setTagSetLists: function(tagsets)");
    console.log("TCL: tagsets", tagsets);
			if ( !tagsets ) return;
			$('#timaat-tagset-list-loader').remove();

			// clear old UI list
			$('#timaat-tagset-list').empty();

			// setup model
			var ts = Array();
			tagsets.forEach(function(tagset) { if ( tagset.id > 0 ) ts.push(new TIMAAT.Tagset(tagset)); });
			TIMAAT.Settings.tagsets = ts;
			TIMAAT.Settings.tagsets.model = tagsets;
			
		},
		
		addTagset: function() {	
    console.log("TCL: addTagset: function()");
			$('#timaat-settings-tagset-meta').data('tagset', null);
			$('#timaat-settings-tagset-meta').modal('show');
		},
		
		_tagsetAdded: function(tagset) {
    console.log("TCL: _tagsetAdded: function(tagset)");
    console.log("TCL: tagset", tagset);
			TIMAAT.Settings.tagsets.model.push(tagset);
			TIMAAT.Settings.tagsets.push(new TIMAAT.Tagset(tagset));
		},
		
		_tagsetRemoved: function(tagset) {
    console.log("TCL: _tagsetRemoved: function(tagset)");
    console.log("TCL: tagset", tagset);
			// sync to server
			TIMAAT.Service.removeTagset(tagset);			
			tagset.remove();
			if ( TIMAAT.VideoPlayer.curTagset == tagset ) TIMAAT.VideoPlayer.setTagset(null);

		}
		
		
	},
	
	// ------------------------------------------------------------------------------------------------------------------------
		
	Datasets: {
		events: null,
		actors: null,
		locations: null,

		init: function() {
			TIMAAT.Datasets.initActors();
			TIMAAT.Datasets.initLocations();
			TIMAAT.Datasets.initEvents();
			TIMAAT.Datasets.initCountries();      
		},

		initActors: function() {
			// console.log("TCL: Datasets: initActors: function()");
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
			    		TIMAAT.Service.addActorTag(actor, tag, function(newtag) {
			    			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.Service.removeActorTag(actor, tag, function(tagname) {
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
				var modal = $('#timaat-datasets-actor-delete');
				var actor = modal.data('actor');
				if (actor) TIMAAT.Datasets._actorRemoved(actor);
				modal.modal('hide');
			});
			// add actor button
			$('#timaat-actor-add').attr('onclick','TIMAAT.Datasets.addActor()');
			// add/edit actor functionality
			$('#timaat-datasets-actor-meta').on('show.bs.modal', function (ev) {
				console.log("TCL: Create/Edit actor window setup");
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
				console.log("TCL: Create/Edit actor window submitted data validation");
				var modal = $('#timaat-datasets-actor-meta');
				var actor = modal.data('actor');
				var title = $("#timaat-actor-meta-title").val();
				if (actor) {
					actor.model.name = title;
					// console.log("TCL: actor.updateUI() - Datasets:init:function()");
					// console.log("TCL: Take values from form:")
					// console.log("TCL: $(\"#timaat-actor-meta-title\").val():", $("#timaat-actor-meta-title").val());
					actor.updateUI();
					TIMAAT.Service.updateActor(actor);
				} else {
					TIMAAT.Service.createActor(title, TIMAAT.Datasets._actorAdded); // TODO add actor parameters
				}
				modal.modal('hide');
			});
			//  validate actor data
			$('#timaat-actor-meta-title').on('input', function(ev) {
				console.log("TCL: allow saving only if data is valid");
				// console.log("TCL: $(\"#timaat-actor-meta-title\").val():", $("#timaat-actor-meta-title").val());
				if ( $("#timaat-actor-meta-title").val().length > 0 ) {
					$('#timaat-actor-meta-submit').prop("disabled", false);
					$('#timaat-actor-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-actor-meta-submit').prop("disabled", true);
					$('#timaat-actor-meta-submit').attr("disabled");
				}
			});
		},

		initLocations: function() {
			console.log("TCL: Datasets: initLocations: function()");		
			// delete location functionality
			$('#timaat-location-delete-submit').click(function(ev) {
				var modal = $('#timaat-datasets-location-delete');
				var location = modal.data('location');
				if (location) TIMAAT.Datasets._locationRemoved(location);
				modal.modal('hide');
			});
			// add location button
			$('#timaat-location-add').attr('onclick','TIMAAT.Datasets.addLocation()');
			// add/edit location functionality
			$('#timaat-datasets-location-meta').on('show.bs.modal', function (ev) {
				console.log("TCL: Create/Edit location window setup");
				var modal = $(this);
				var location = modal.data('location');				
				var heading = (location) ? "Location bearbeiten" : "Location hinzufügen";
				var submit = (location) ? "Speichern" : "Hinzufügen";
				var title = (location) ? location.model.name : "";

				// setup UI
				$('#locationMetaLabel').html(heading);
				$('#timaat-location-meta-submit').html(submit);
				$("#timaat-location-meta-name").val(title).trigger('input');		
			});
			// Submit location data
			$('#timaat-location-meta-submit').click(function(ev) {
				// console.log("TCL: Create/Edit location window submitted data validation");
				var modal = $('#timaat-datasets-location-meta');
				var location = modal.data('location');
				var name = $("#timaat-location-meta-name").val();
				// var locationType =$("timaat-location-meta-locationtype").val();	
				if (location) {
					location.model.name = name;		
					// location.model.locationTypeID = locationTypeID;
					// console.log("TCL: location.updateUI() - Datasets:init:function()");
					// console.log("TCL: Take values from form:")
					// console.log("TCL: $(\"#timaat-location-meta-name\").val():", $("#timaat-location-meta-name").val());
					location.updateUI();
					TIMAAT.Service.updateLocation(location);
				} else {
					TIMAAT.Service.createLocation(name, TIMAAT.Datasets._locationAdded); // TODO add location parameters
				}
				modal.modal('hide');
			});
			//  validate location data					
			$('#timaat-location-meta-name').on('input', function(ev) {
				// console.log("TCL: allow saving only if data is valid");
				// console.log("TCL: $(\"#timaat-location-meta-name\").val():", $("#timaat-location-meta-name").val());
				if ( $("#timaat-location-meta-name").val().length > 0 ) {
					$('#timaat-location-meta-submit').prop("disabled", false);
					$('#timaat-location-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-location-meta-submit').prop("disabled", true);
					$('#timaat-location-meta-submit').attr("disabled");
				}
			});
		},

		initCountries: function() {
			console.log("TCL: Datasets: initCountries: function()");		
			// delete country functionality
			$('#timaat-country-delete-submit').click(function(ev) {
				var modal = $('#timaat-datasets-country-delete');
				var country = modal.data('country');
				if (country) TIMAAT.Datasets._countryRemoved(country);
				modal.modal('hide');
			});
			// add country button
			$('#timaat-country-add').attr('onclick','TIMAAT.Datasets.addCountry()');
			// add/edit country functionality
			$('#timaat-datasets-country-meta').on('show.bs.modal', function (ev) {
				console.log("TCL: Create/Edit country window setup");
				var modal = $(this);
				var country = modal.data('country');				
				var heading = (country) ? "Country bearbeiten" : "Country hinzufügen";
				var submit = (country) ? "Speichern" : "Hinzufügen";
				var name = (country) ? country.model.name : "";
				var internationalDialingPrefix = (country) ? country.model.internationalDialingPrefix : "";
				var trunkPrefix = (country) ? country.model.trunkPrefix : "";
				var countryCallingCode = (country) ? country.model.countryCallingCode : "";
				var timeZone = (country) ? country.model.timeZone : "";
				var dst = (country) ? country.model.dst : "";	
				// setup UI
				$('#countryMetaLabel').html(heading);
				$('#timaat-country-meta-submit').html(submit);
				$("#timaat-country-meta-name").val(name).trigger('input');
				$("#timaat-country-meta-idp").val(internationalDialingPrefix);
				$("#timaat-country-meta-tp").val(trunkPrefix);
				$("#timaat-country-meta-ccc").val(countryCallingCode);
				$("#timaat-country-meta-tz").val(timeZone);
				$("#timaat-country-meta-dst").val(dst);
			});
			// Submit country data
			$('#timaat-country-meta-submit').click(function(ev) {
				console.log("TCL: Create/Edit country window submitted data validation");
				var modal = $('#timaat-datasets-country-meta');
				var country = modal.data('country');
				var name = $("#timaat-country-meta-name").val();
				var internationalDialingPrefix = $("#timaat-country-meta-idp").val();
				var trunkPrefix = $("#timaat-country-meta-tp").val();
				var countryCallingCode = $("#timaat-country-meta-ccc").val();
				var timeZone = $("#timaat-country-meta-tz").val();
				var dst = $("#timaat-country-meta-dst").val();
				// var locationType =$("timaat-country-meta-locationtype").val();	
				if (country) {
					country.model.name = name;
					country.model.internationalDialingPrefix = internationalDialingPrefix;
					country.model.trunkPrefix = trunkPrefix;
					country.model.countryCallingCode = countryCallingCode;
					country.model.timeZone = timeZone;
					country.model.dst = dst;
					// country.model.locationType = locationType;
					country.updateUI();
					TIMAAT.Service.updateCountry(country);
				} else {
					TIMAAT.Service.createCountry(name, internationalDialingPrefix, trunkPrefix, countryCallingCode, timeZone, dst, TIMAAT.Datasets._countryAdded);
				}
				modal.modal('hide');
			});
			//  validate country data
			$('#timaat-country-meta-name').on('input', function(ev) {
				console.log("TCL: allow saving only if data is valid");
				if ( $("#timaat-country-meta-name").val().length > 0 ) {
					$('#timaat-country-meta-submit').prop("disabled", false);
					$('#timaat-country-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-country-meta-submit').prop("disabled", true);
					$('#timaat-country-meta-submit').attr("disabled");
				}
			});
		},

		initEvents: function() {
			console.log("TCL: Datasets: initEvents: function()");
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
			    		TIMAAT.Service.addEventTag(event, tag, function(newtag) {
			    			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.Service.removeEventTag(event, tag, function(tagname) {
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
				var modal = $('#timaat-datasets-event-delete');
				var event = modal.data('event');
				if (event) TIMAAT.Datasets._eventRemoved(event);
				modal.modal('hide');
			});
			// add event button
			$('#timaat-event-add').attr('onclick','TIMAAT.Datasets.addEvent()');
			// add/edit event functionality
			$('#timaat-datasets-event-meta').on('show.bs.modal', function (ev) {
				// console.log("TCL: Create/Edit event window setup");
				var modal = $(this);
				var event = modal.data('event');				
				var heading = (event) ? "Event bearbeiten" : "Event hinzufügen";
				var submit = (event) ? "Speichern" : "Hinzufügen";
				var name = (event) ? event.model.eventtranslations[0].name : "";
				var description = (event) ? event.model.eventtranslations[0].description : "";
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
				$("#timaat-event-meta-start").val(beginsAtDate); // 1212-12-12
				$("#timaat-event-meta-end").val(endsAtDate); // 1212-12-12
				$("#timaat-event-meta-description").val(description);
			});
			// Submit event data
			$('#timaat-event-meta-submit').click(function(ev) {
				var modal = $('#timaat-datasets-event-meta');
				var event = modal.data('event');
				var name = $("#timaat-event-meta-name").val();
				var description = $("#timaat-event-meta-description").val();
				var beginsAtDate = $("#timaat-event-meta-start").val();
				var endsAtDate = $("#timaat-event-meta-end").val();
				if (!beginsAtDate ) beginsAtDate = 0; // required with type="date" input format to ensure !null
				if (!endsAtDate ) endssAtDate = 0; // required with type="date" input format to ensure !null
				if (event) {
					event.model.eventtranslations[0].name = name;
					event.model.eventtranslations[0].description = description;
					event.model.beginsAtDate = beginsAtDate;
					event.model.endsAtDate = endsAtDate;
					// console.log("TCL: event.updateUI() - Datasets:init:function()");
					event.updateUI(); // shouldn't be necessary as it will be called in the updateEvent(event) function again
					console.log("TCL: update event", event);
					TIMAAT.Service.updateEvent(event);
					// console.log("TCL: update event translation", event);
					// event.updateUI(); 
					TIMAAT.Service.updateEventTranslation(event);
					// event.updateUI(); 
				} else {
					console.log("TCL: create new event");
					var model = {
						id: 0,
						beginsAtDate: beginsAtDate,
						endsAtDate: endsAtDate,
						eventtranslations: [],
						tags: [],
						// eventtranslations: [{
						// 	id: 0,
						// 	name: name,
						// 	description: description,
						// }],
					};
					var modelTranslation = {
						id: 0,
						name: name,
						description: description,
					};
					TIMAAT.Service.createEvent(model, modelTranslation, TIMAAT.Datasets._eventAdded);
					
					/** 
					 * Start creating Event
					 * Before finishing creating Event: Create EventTranslation using Event.id
					 * After EventTranslation finishes: Report back that creating Event succeeded
					 * call _EventAdded to push complete Event information to event list
					*/

					// const myPromise = new Promise(function(resolve, reject) {
					// // code here
					// try {
					// 	TIMAAT.Service.createEvent(model).then(TIMAAT.Service.createEventTranslation(model, modelTranslation))
					// } catch (error) {
					// 	console.log("error: ", error.responseText);
					// });
					
					// 	if (model.id > 0) {
					// 		resolve('fine')
					// 	} else {
					// 		reject('error')
					// 	}
					// });

					// let promise = new Promise(
					// 	(resolve, reject) => {
					// 		TIMAAT.Service.createEvent(model);
					// 	}
					// )
					// promise.then(TIMAAT.Service.createEventTranslation(model))
					// 	.then(TIMAAT.Datasets._eventAdded(model));

					// console.log("TCL: initEvents createEvent -> model", model);
					// model.eventtranslations = TIMAAT.Service.createEventTranslation(modelTranslation, model.id);
					// console.log("TCL: initEvents createEvent -> model", model);
					// TIMAAT.Datasets._eventAdded(model);
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

		loadActors: function() {
    	// console.log("TCL: loadActors: function()");
			// load actors
			TIMAAT.Service.listActors(TIMAAT.Datasets.setActorLists);
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
			TIMAAT.Datasets.actors = acts;
			TIMAAT.Datasets.actors.model = actors;			
		},
		
		addActor: function() {	
    console.log("TCL: addActor: function()");
			$('#timaat-datasets-actor-meta').data('actor', null);
			$('#timaat-datasets-actor-meta').modal('show');
		},

		_actorAdded: function(actor) {
    	console.log("TCL: _actorAdded: function(actor)");
    	console.log("TCL: actor", actor);
			TIMAAT.Datasets.actors.model.push(actor);
			TIMAAT.Datasets.actors.push(new TIMAAT.Actor(actor));
		},

		_actorRemoved: function(actor) {
    console.log("TCL: _actorRemoved: function(actor)");
    console.log("TCL: actor", actor);
			// sync to server
			TIMAAT.Service.removeActor(actor);			
			actor.remove();	
			// if ( TIMAAT.VideoPlayer.curActor == actor ) TIMAAT.VideoPlayer.setActor(null);		
		},

		loadLocations: function() {
    	// console.log("TCL: loadLocations: function()");
			// load locations
			TIMAAT.Service.listLocations(TIMAAT.Datasets.setLocationLists);
		},
		
		setLocationLists: function(locations) {
    // console.log("TCL: setLocationLists: function(locations)");
    console.log("TCL: locations", locations);
			if ( !locations ) return;
			$('#timaat-location-list-loader').remove();
			// clear old UI list
			$('#timaat-location-list').empty();
			// setup model
			var locs = Array();
			locations.forEach(function(location) { if ( location.id > 0 ) locs.push(new TIMAAT.Location(location)); });
			TIMAAT.Datasets.locations = locs;
			TIMAAT.Datasets.locations.model = locations;
		},
		
		addLocation: function() {	
    console.log("TCL: addLocation: function()");
			$('#timaat-datasets-location-meta').data('location', null);
			$('#timaat-datasets-location-meta').modal('show');
		},

		_locationAdded: function(location) {
    	console.log("TCL: _locationAdded: function(location)");
    	console.log("TCL: location", location);
			TIMAAT.Datasets.locations.model.push(location);
			TIMAAT.Datasets.locations.push(new TIMAAT.Location(location));
		},

		_locationRemoved: function(location) {
    console.log("TCL: _locationRemoved: function(location)");
    console.log("TCL: location", location);
			// sync to server
			TIMAAT.Service.removeLocation(location);			
			location.remove();	
			// if ( TIMAAT.VideoPlayer.curLocation == location ) TIMAAT.VideoPlayer.setLocation(null);		
		},

		loadCountries: function() {
    	// console.log("TCL: loadCountries: function()");
			// load countries
			TIMAAT.Service.listCountries(TIMAAT.Datasets.setCountryLists);
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
			countries.forEach(function(country) { if ( country.id > 0 ) locs.push(new TIMAAT.Country(country)); });
			TIMAAT.Datasets.countries = locs;
			TIMAAT.Datasets.countries.model = countries;
		},
		
		addCountry: function() {	
    console.log("TCL: addCountry: function()");
			$('#timaat-datasets-country-meta').data('country', null);
			$('#timaat-datasets-country-meta').modal('show');
		},

		_countryAdded: function(country) {
    	console.log("TCL: _countryAdded: function(country)");
    	console.log("TCL: country", country);
			TIMAAT.Datasets.countries.model.push(country);
			TIMAAT.Datasets.countries.push(new TIMAAT.Country(country));
		},

		_countryRemoved: function(country) {
    console.log("TCL: _countryRemoved: function(country)");
    console.log("TCL: country", country);
			// sync to server
			TIMAAT.Service.removeCountry(country);			
			country.remove();	
			// if ( TIMAAT.VideoPlayer.curCountry == country ) TIMAAT.VideoPlayer.setCountry(null);		
		},

		loadEvents: function() {
    	// console.log("TCL: loadEvents: function()");
			// load events
			TIMAAT.Service.listEvents(TIMAAT.Datasets.setEventLists);
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
			TIMAAT.Datasets.events = evs;
			TIMAAT.Datasets.events.model = events;			
		},
		
		addEvent: function() {	
    // console.log("TCL: addEvent: function()");
			$('#timaat-datasets-event-meta').data('event', null);
			$('#timaat-datasets-event-meta').modal('show');
		},

		_eventAdded: function(event) {
    	// console.log("TCL: _eventAdded: function(event)");
    	// console.log("TCL: [6] _eventAdded: event", event);
			TIMAAT.Datasets.events.model.push(event);
			TIMAAT.Datasets.events.push(new TIMAAT.Event(event));
			return event;
      // console.log("TCL: _eventAdded successful?");			
		},

		// _eventTranslationAdded: function(eventTranslation) {
    // 	console.log("TCL: _eventTranslationAdded: function(event)");
		// 	console.log("TCL: _eventTranslationAdded: eventTranslation", eventTranslation);
		// 	var translatedEvent = TIMAAT.Datasets.events.model.pop()
    //   console.log("TCL: _eventTranslationAdded: -> translatedEvent", translatedEvent);
		// 	translatedEvent.eventtranslations = eventTranslation;
		// 	TIMAAT.Datasets.events.model.push(translatedEvent);
		// 	// TIMAAT.Datasets.events.push(new TIMAAT.Event(event));			
		// 	// TIMAAT.Datasets.events.model.eventtranslations.push(eventTranslation);
		// 	console.log("TCL: _eventTranslationAdded successful?");	
		// },

		_eventRemoved: function(event) {
    console.log("TCL: _eventRemoved: function(event)");
    console.log("TCL: event", event);
			// sync to server
			TIMAAT.Service.removeEvent(event);			
			event.remove();	
			// if ( TIMAAT.VideoPlayer.curEvent == event ) TIMAAT.VideoPlayer.setEvent(null);		
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	Actor: class Actor {
		constructor(model) {
			// console.log("TCL: Actor -> constructor -> model", model)
			// setup model
			this.model = model;
			model.ui = this;
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
						'<b><i class="far fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+actor.model.createdByUserAccountID+'">[ID '+actor.model.createdByUserAccountID+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+actor.model.lastEditedByUserAccountID+'">[ID '+actor.model.lastEditedByUserAccountID+']</span></b><br>\
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
				$('#timaat-datasets-actor-meta').data('actor', actor);
				$('#timaat-datasets-actor-meta').modal('show');			
			});			
			// remove handler
			this.listView.find('.timaat-actor-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-datasets-actor-delete').data('actor', actor);
				$('#timaat-datasets-actor-delete').modal('show');
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
			// remove from tagset list
			var index = TIMAAT.Datasets.actors.indexOf(this);
			// if (index > -1) TIMAAT.Datasets.actors.splice(index, 1);
			// remove from model list
			index = TIMAAT.Datasets.actors.model.indexOf(this);
			if (index > -1) TIMAAT.Datasets.actors.model.splice(index, 1);
		}	
	},

	// ------------------------------------------------------------------------------------------------------------------------

	Location: class Location {
		constructor(model) {
      // console.log("TCL: Location -> constructor -> model", model)
			// setup model
			this.model = model;
			model.ui = this;
			// create and style list view element
			var deleteLocation = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-location-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteLocation = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteLocation +
				'<span class="timaat-location-list-title"></span>' +
				'<br> \
				<div class="timaat-location-list-count text-muted float-left"></div> \
				<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
		 </li>'
			);
			$('#timaat-location-list').append(this.listView);
			// console.log("TCL: Location -> constructor -> this.updateUI()");
			this.updateUI();      
			var location = this; // save location for system locations
			// this.listView.find('.timaat-location-list-tags').popover({
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
      console.log("TCL: Location -> constructor -> Display Bearbeitungslog");
				$('.timaat-user-log-details').html(
						'<b><i class="far fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+location.model.createdByUserAccountID+'">[ID '+location.model.createdByUserAccountID+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(location.model.createdAt)+'<br>\
						 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+location.model.lastEditedByUserAccountID+'">[ID '+location.model.lastEditedByUserAccountID+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(location.model.lastEditedAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			});
			// attach tag editor
			// this.listView.find('.timaat-location-list-tags').on('inserted.bs.popover', function () {
			// 	var tags = "";
			// 	location.model.tags.forEach(function(item) { tags += ','+item.name });
			// 	tags = tags.substring(1);
			// 	$('.timaat-tag-input').val(tags);
			//     $('.timaat-tag-input').tagsInput({
			//     	placeholder: 'Tag hinzufügen',
			//     	onAddTag: function(taginput,tag) {
			//     		TIMAAT.Service.addTag(location, tag, function(newtag) { // TODO addTag?
			// 					location.model.tags.push(newtag);
			// 					// console.log("TCL: Location -> constructor -> location.updateUI() - onAddTag");
			//     			location.updateUI();                
			//     		});
			//     	},
			//     	onRemoveTag: function(taginput,tag) {
			//     		TIMAAT.Service.removeTag(location, tag, function(tagname) { // TODO removeTag?
			//     			// find tag in model
			//     			var found = -1;
			//     			location.model.tags.forEach(function(item, index) {
			//     				if ( item.name == tagname ) found = index;
			//     			});
			// 				if (found > -1) location.model.tags.splice(found, 1);
			// 					console.log("TCL: Location -> constructor -> location.updateUI() - onRemoveTag");
			//     			location.updateUI();                
			//     		});
			//     	},
			//     	onChange: function() {
			//     		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			//     	}
			//     });
			// });
			// console.log("TCL: Location -> constructor -> location.updateUI()");
			// this.listView.find('.timaat-location-list-tags').on('hidden.bs.popover', function () { location.updateUI(); });
			// this.listView.find('.timaat-location-list-tags').dblclick(function(ev) {ev.stopPropagation();});

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
				$('#timaat-datasets-location-meta').data('location', location);
				$('#timaat-datasets-location-meta').modal('show');			
			});			
			// remove handler
			this.listView.find('.timaat-location-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-datasets-location-delete').data('location', location);
				$('#timaat-datasets-location-delete').modal('show');
			});
		}

		updateUI() {
			console.log("TCL: Location -> updateUI -> updateUI()");
			// title
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-location-list-title').text(name);
			// tag count
			// var count = this.model.tags.length + " Tags";
			// if ( this.model.tags.length == 0 ) count = "keine Tags";
			// if ( this.model.tags.length == 1 ) count = "ein Tag";
			// this.listView.find('.timaat-location-list-count').text(count);
			// tags
			// this.listView.find('.timaat-location-list-tags i').attr('title', this.model.tags.length+" Tags");			
			// if (this.model.tags.length == 0) this.listView.find('.timaat-location-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			// else if (this.model.tags.length == 1) this.listView.find('.timaat-location-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			// else this.listView.find('.timaat-location-list-tags i').attr('class','fas fa-tags text-dark');		
		}

		remove() {
      console.log("TCL: Location -> remove -> remove()");
			// remove location from UI
			this.listView.remove(); // TODO remove tags from location_has_tags
			// remove from tagset list
			var index = TIMAAT.Datasets.locations.indexOf(this);
			// if (index > -1) TIMAAT.Datasets.locations.splice(index, 1);
			// remove from model list
			index = TIMAAT.Datasets.locations.model.indexOf(this);
			if (index > -1) TIMAAT.Datasets.locations.model.splice(index, 1);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	Country: class Country {
		constructor(model) {
			// console.log("TCL: Country -> constructor -> model", model)
			// setup model
			this.model = model;
			model.ui = this;
			// create and style list view element
			var deleteCountry = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-country-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCountry = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteCountry +
				'<span class="timaat-country-list-name"></span>' +
				'<br> \
				<div class="timaat-country-list-count text-muted float-left"></div> \
				<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
			</li>'
			);
			$('#timaat-country-list').append(this.listView);
			// console.log("TCL: Country -> constructor -> this.updateUI()");
			this.updateUI();      
			var country = this; // save country for system countries

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
			console.log("TCL: Country -> constructor -> Display Bearbeitungslog");
				$('.timaat-user-log-details').html(
						'<b><i class="far fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+country.model.createdByUserAccountID+'">[ID '+country.model.createdByUserAccountID+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+country.model.lastEditedByUserAccountID+'">[ID '+country.model.lastEditedByUserAccountID+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.lastEditedAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
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
				$('#timaat-datasets-country-meta').data('country', country);
				$('#timaat-datasets-country-meta').modal('show');			
			});			
			// remove handler
			this.listView.find('.timaat-country-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-datasets-country-delete').data('country', country);
				$('#timaat-datasets-country-delete').modal('show');
			});
		}

		updateUI() {
			console.log("TCL: Country -> updateUI -> updateUI()");
			// title
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-country-list-name').text(name);	
		}

		remove() {
			console.log("TCL: Country -> remove -> remove()");
			// remove country from UI
			this.listView.remove(); // TODO remove tags from country_has_tags
			// remove from tagset list
			var index = TIMAAT.Datasets.countrys.indexOf(this);
			// if (index > -1) TIMAAT.Datasets.countrys.splice(index, 1);
			// remove from model list
			index = TIMAAT.Datasets.countrys.model.indexOf(this);
			if (index > -1) TIMAAT.Datasets.countrys.model.splice(index, 1);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	Event: class Event {
		constructor(model) {
      // console.log("TCL: Event -> constructor -> model", model)
			// setup model
			this.model = model;
			model.ui = this;
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
						'<b><i class="far fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+event.model.createdByUserAccountID+'">[ID '+event.model.createdByUserAccountID+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(event.model.createdAt)+'<br>\
						 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+event.model.lastEditedByUserAccountID+'">[ID '+event.model.lastEditedByUserAccountID+']</span></b><br>\
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
				$('#timaat-datasets-event-meta').data('event', event);
				$('#timaat-datasets-event-meta').modal('show');			
			});			
			// remove handler
			this.listView.find('.timaat-event-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-datasets-event-delete').data('event', event);
				$('#timaat-datasets-event-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Event -> updateUI -> updateUI()");
			// console.log("TCL: Event -> updateUI -> this.model", this.model);
			// console.log("TCL: Event -> updateUI -> this.model.eventtranslations[0].name", this.model.eventtranslations[0].name);
			// var name = this.model.eventtranslations[0].name; // TODO not working with newly created events
			// if ( this.model.id >= 0 && this.model.eventtranslations.length > 0 ) var name = this.model.eventtranslations[0].name;
			// else var name = "[translation name not available yet]";
			var name = this.model.eventtranslations[0].name;
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
			// remove from tagset list
			var index = TIMAAT.Datasets.events.indexOf(this);
			// if (index > -1) TIMAAT.Datasets.events.splice(index, 1);
			// remove from model list
			index = TIMAAT.Datasets.events.model.indexOf(this);
			if (index > -1) TIMAAT.Datasets.events.model.splice(index, 1);
		}
	},

	// ------------------------------------------------------------------------------------------------------------------------

	UI: {
		component: null,
		
		init: function() {
    	console.log("TCL: UI: init: function()");
			$('[data-toggle="popover"]').popover();
			
			// init components
			TIMAAT.VideoChooser.init();	   
			TIMAAT.VideoPlayer.init();
			TIMAAT.Settings.init();
			TIMAAT.Datasets.init();
			
			TIMAAT.UI.showComponent('videochooser');	    
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
			    			icon = 'far fa-plus-square';
			    			break;
			    		case 'mediumEdited':
			    		case 'analysislistEdited':			    			
			    		case 'analysislistDeleted':
			    			icon = 'fas fa-edit';
			    			break;
			    		case 'mediumDeleted':
			    		case 'analysislistDeleted':			    			
			    		case 'annotationDeleted':
			    			icon = 'far fa-trash-alt';
			    			break;
			    		}

						html += '<b><i class="'+icon+'"></i> '+TIMAAT.Util.formatLogType(entry.userLogEventType.type)
							    +'</b><br>'+TIMAAT.Util.formatDate(entry.dateTime)+'<br>';
					});
					$('.timaat-user-log-details').html(html);
		    		
		    		$(log).each(function(index, entry) {TIMAAT.Service.idCache.set(entry.userAccount.id, entry.userAccount.accountName);});
//					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item,"ich")});
		    	});
			});

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
					  url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/authenticate",
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
							
					    TIMAAT.VideoChooser.loadVideos();
							TIMAAT.Settings.loadTagSets();
							TIMAAT.Datasets.loadEvents(); // TODO Move 
							TIMAAT.Datasets.loadActors();
							TIMAAT.Datasets.loadLocations();
							TIMAAT.Datasets.loadCountries();			    
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