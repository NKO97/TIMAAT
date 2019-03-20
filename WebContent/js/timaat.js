function allocateArray(strOrArr) {
	var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr : Module.intArrayFromString(strOrArr);
	return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
}
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
	  
	},
	
	
	// ------------------------

	
	Annotation: class Annotation {
		constructor(model) {
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
						<div class="timaat-annotation-list-title text-muted"></div> \
					</li>'
			);
			this.updateUI();
			$('#timaat-annotation-list').append(this.listView);
			this.listView.find('.timaat-annotation-list-tags').popover({
				placement: 'right',
				title: 'Tags bearbeiten',
				trigger: 'click',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-tag-input" type="text" value=""></div>',
				container: 'body',
				boundary: 'viewport',
				
			});
			
			// attach tag editor
			var anno = this;
			this.listView.find('.timaat-annotation-list-tags').on('inserted.bs.popover', function () {
				var tags = "";
				anno.model.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Tag hinzufügen',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.Service.addTag(anno, tag, function(newtag) {
			    			anno.model.tags.push(newtag);
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
			    			anno.updateUI();
			    		});
			    	},				
			    });
			});
			this.listView.find('.timaat-annotation-list-tags').on('hidden.bs.popover', function () { anno.updateUI(); });
			this.listView.find('.timaat-annotation-list-tags').dblclick(function(ev) {ev.stopPropagation();});

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
			// remove annotation from UI
			this.listView.remove();
			map.removeLayer(this.svg.layer);
			this.marker.remove();
		}
		
		addSVGItem (item) {
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
				}
				
			});
			item.on('dragstart', function(ev) {anno.setChanged();TIMAAT.VideoPlayer.updateUI();});
			item.on('dragend', function(ev) {anno.setChanged;TIMAAT.VideoPlayer.updateUI();});
			
		}
				
		removeSVGItem (item) {
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
			this.changed = true;
		}
		
		hasChanges() {
			return this.changed;
		}

		
		getModel() {
			return this.model;
		}
		
		discardChanges() {
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
			this._syncToModel();
			this.changed = false;
		}

		updateStatus(time) {
			var active = false;
			if ( time >= this.model.startTime && time <= this.model.endTime ) active = true;
			this.setActive(active);
		}
		
		isActive() {
			return this.active;
		}
		
		setActive(active) {
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
			if ( this.selected == selected ) return;			
			this.selected = selected;
			if ( selected ) {
				this.listView.addClass('timat-annotation-list-selected');
			}
			else this.listView.removeClass('timat-annotation-list-selected');
		}
		
		_scrollIntoView(listItem) {
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
			var factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height;
			var width = TIMAAT.VideoPlayer.model.video.mediumVideo.width;
			var height = TIMAAT.VideoPlayer.model.video.mediumVideo.height;
			switch (svgitem.type) {
				case "rectangle":
					// [[ height, x], [ y, width]]
					var bounds = [[ Math.round(450-(factor*svgitem.y*height)), Math.round(svgitem.x*factor*width)], [ Math.round(450-((svgitem.y+svgitem.height)*factor*height)), Math.round((svgitem.x+svgitem.width)*factor*width)]];
					return L.rectangle(bounds, {draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
			}
		}
		
		_syncToModel() {
			var jsonData = [];
			var factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height;
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
				}
				
			});
			this.model.svg[0].svgData = JSON.stringify(jsonData);
		}
		
	},
	

	// ------------------------

	
	VideoChooser: {
		
		videos: null,
	
		init: function() {
			// setup video chooser list and UI events

		},
		
		loadVideos: function() {
			TIMAAT.Service.listVideos(TIMAAT.VideoChooser.setVideoList);
		},
		
		updateVideoStatus: function(video) {
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
			
			if ( video.status == "transcoding" ) TIMAAT.VideoChooser.updateVideoStatus(video);

		},
		
	},
	

	// ------------------------

	
	VideoPlayer: {
		duration: 1,
		annotationList: [],
		curAnnotation: null,
		curList: null,
		markerList: [],
		overlay: null,
		UI: Object(),
		model: Object(),
		
		init: function() {
			// init UI
			$('.timaat-videoplayer-novideo').show();
			$('.timaat-videoplayer-ui').hide();
			
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
		        options: {
		            position: 'topleft',
		            callback: map.editTools.startRectangle,
		            kind: 'Rechteck-Annotation',
		            html: '<i class="fas fa-vector-square"></i>'
		        }
		    });
		    
		    map.on('editable:editing', function (e) {
		        e.layer.setStyle({weight: 1, fillOpacity: 0.2});
		    });

		    var ctrl = new L.NewRectangleControl();
		    map.editCtrl = ctrl;
		    map.addControl(ctrl);
		    $(map.editCtrl._container).find('a').addClass('leaflet-disabled');
		    
		    map.on('editable:drawing:start', function(x) {
		    	TIMAAT.VideoPlayer.pause();
			    $(map.editCtrl._container).find('a').addClass('bg-success');
			    x.layer.setStyle({color: '#'+TIMAAT.VideoPlayer.curAnnotation.svg.color, weight: TIMAAT.VideoPlayer.curAnnotation.svg.strokeWidth});
		    });
		    
		    map.on('editable:drawing:end', function(x) {
			    $(map.editCtrl._container).find('a').removeClass('bg-success');
			    x.layer.dragging.enable();
			    map.removeLayer(x.layer);
			    if ( TIMAAT.VideoPlayer.curAnnotation ) {
				    TIMAAT.VideoPlayer.curAnnotation.addSVGItem(x.layer);
				    TIMAAT.VideoPlayer.updateUI();
				    x.layer.dragging._draggable = null;
				    x.layer.dragging.addHooks();
			    }
		    });
			
		    
		    
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
					$('#timaat-volume-slider').val(0);
				} else {
					$('#timaat-volume-slider').val(100);
				}
				$('#timaat-volume-slider').change();
			});
			
			$('#timaat-video-seek-bar').change(function(ev) {
			        var time = TIMAAT.VideoPlayer.video.duration * (this.value / 100);
				TIMAAT.VideoPlayer.jumpTo(time);
			});

			$('#timaat-video-seek-bar').on('input', function(ev) {
			        this.style.background="linear-gradient(to right,  #ed1e24 0%,#ed1e24 "+this.value+"%,#939393 "+this.value+"%,#939393 100%)";
			});
			
			$('#timaat-video-seek-bar').click(function(ev) {
			        var time = TIMAAT.VideoPlayer.video.duration * (this.value / 100);
				TIMAAT.VideoPlayer.jumpTo(time);
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
					TIMAAT.VideoPlayer.curList.analysisFreeTextField = comment;
					
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

			$('#timaat-videoplayer-analysislist-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var list = modal.data('analysislist');
				
				var heading = (list) ? "Liste bearbeiten" : "Liste hinzufügen";
				var submit = (list) ? "Speichern" : "Hinzufügen";
				var title = (list) ? list.title : "";
				var comment = (list) ? list.analysisFreeTextField : "";
				
				// setup UI from Video Player state
				$('#analysislistMetaLabel').html(heading);
				$('#timaat-analysislist-meta-submit').html(submit);
				$("#timaat-analysislist-meta-title").val(title).trigger('input');
				$("#timaat-analysislist-meta-comment").val(comment);
				
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
				var end = (anno) ? TIMAAT.Util.formatTime(anno.model.endTime,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.duration,true);
				
				// setup UI from Video Player state
				$('#annotationMetaLabel').html(heading);
				$('#timaat-annotation-meta-submit').html(submit);
				TIMAAT.VideoPlayer.UI.cp.setColor('#'+color);
				$("#timaat-annotation-meta-title").val(title).trigger('input');
				$("#timaat-annotation-meta-comment").val(comment);
				$("#timaat-annotation-meta-start").val(start);
				$("#timaat-annotation-meta-end").val(end);
				
			});
			
		},
		
		setupVideo: function(video) {
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
			
			videoBounds = [[ 450, 0], [ 0, 450 / video.mediumVideo.height * video.mediumVideo.width]];
			map.setMaxBounds(videoBounds);
			map.fitBounds(videoBounds);
    	    		this.overlay = L.videoOverlay(videoUrl, videoBounds, { autoplay: false, loop: false} )
			.addTo(map);
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
			// clear old lists if any
			$('#timaat-analysislist-chooser').empty();
			
			// setup model
			TIMAAT.VideoPlayer.model.lists = lists;
			lists.forEach(function(list) {
				list.ui = $('<option value="'+list.id+'">'+list.title+'</option>');
				list.ui.data('list', list);
				$('#timaat-analysislist-chooser').append(list.ui);
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
			// setup model
			TIMAAT.VideoPlayer.model.annotations = annotations;
			// close UI tag editors if any
			TIMAAT.UI.hidePopups();
			
			// clear old list contents if any
			if ( TIMAAT.VideoPlayer.curList ) {
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
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();

			// setup annotations UI
			$('#timaat-annotation-list-loader').hide();
			$('#timaat-videoplayer-annotation-add-button').prop("disabled", TIMAAT.VideoPlayer.curList == null);
			if ( TIMAAT.VideoPlayer.curList ) $('#timaat-videoplayer-annotation-add-button').removeAttr("disabled");
			else $('#timaat-videoplayer-annotation-add-button').attr("disabled");

		},
		
		addAnalysislist: function() {
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-meta').data('analysislist', null);
			$('#timaat-videoplayer-analysislist-meta').modal('show');
		},
		
		updateAnalysislist: function(analysislist) {
			// sync to server
			TIMAAT.Service.updateAnalysislist(analysislist);

			// TODO update UI list view
			TIMAAT.VideoPlayer.curList.ui.html(TIMAAT.VideoPlayer.curList.title);
		},

		editAnalysislist: function() {
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-meta').data('analysislist', TIMAAT.VideoPlayer.curList);
			$('#timaat-videoplayer-analysislist-meta').modal('show');			
		},
		
		removeAnalysislist: function() {
			if ( !TIMAAT.VideoPlayer.curList ) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-delete').data('analysislist', TIMAAT.VideoPlayer.curList);
			$('#timaat-videoplayer-analysislist-delete').modal('show');
		},
		
		addAnnotation: function() {
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-annotation-meta').data('annotation', null);
			$('#timaat-videoplayer-annotation-meta').modal('show');
		},
		
		updateAnnotation: function(annotation) {
			// sync to server
			TIMAAT.Service.updateAnnotation(annotation);

			// update UI list view
			annotation.updateUI();
			annotation.updateStatus(this.video.currentTime);
			this.updateListUI();
			this.sortListUI();
		},
		
		updateAnnotations: function() {
			if ( this.annotationList == null ) return;
			this.annotationList.forEach(function(annotation) {
				if ( annotation.isActive() && annotation.hasChanges() ) {
					annotation.saveChanges();
					TIMAAT.Service.updateAnnotation(annotation);
					// update UI
					annotation.updateUI();
				}
			});

			// update UI list view
			this.updateListUI();
			this.sortListUI();
			this.updateUI();
		},
		
		removeAnnotation: function() {
			if ( !this.curAnnotation ) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-annotation-delete').data('annotation', this.curAnnotation);
			$('#timaat-videoplayer-annotation-delete').modal('show');
		},
				
		selectAnnotation: function(annotation) {
			if ( this.curAnnotation == annotation ) return;
			if ( this.curAnnotation ) this.curAnnotation.setSelected(false);
			this.curAnnotation = annotation;
			if ( this.curAnnotation ) {
				$(map.editCtrl._container).find('a').removeClass('leaflet-disabled');
				this.curAnnotation.setSelected(true);
				$('#timaat-videoplayer-annotation-remove-button').prop("disabled", false);
				$('#timaat-videoplayer-annotation-remove-button').removeAttr("disabled");
				
			} else {
				// disable editing widget
				$(map.editCtrl._container).find('a').removeClass('bg-success');
				$(map.editCtrl._container).find('a').addClass('leaflet-disabled');
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
			// TODO refactor
			var startTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-start').val());
			var endTime = TIMAAT.Util.parseTime($('#timaat-annotation-meta-end').val());
			endTime = startTime+time;
			startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
			endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
			$("#timaat-annotation-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
			$("#timaat-annotation-meta-end").val(TIMAAT.Util.formatTime(endTime, true));
		},
		
		sortListUI: function() {
			$("#timaat-annotation-list li").sort(function (a, b) {return (parseInt($(b).attr('data-starttime'))) < (parseInt($(a).attr('data-starttime'))) ? 1 : -1;}) 
                        .appendTo('#timaat-annotation-list');			
		},
		
		updateListUI: function() {
			var hasChanges = false;
			this.annotationList.forEach(function(annotation) {
				annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				if ( TIMAAT.VideoPlayer.curAnnotation == annotation && !annotation.isActive() ) TIMAAT.VideoPlayer.selectAnnotation(null);
				if ( annotation.isActive() && annotation.hasChanges() ) hasChanges = true;
			});
			if ( hasChanges ) $('#timaat-videoplayer-save-polygons-button').show(); else $('#timaat-videoplayer-save-polygons-button').hide();
		},
		
		updateUI: function() {
			var hasChanges = false;
			this.annotationList.forEach(function(annotation) {
				if ( annotation.isActive() && annotation.hasChanges() ) hasChanges = true;
			});
			
			if ( hasChanges ) $('#timaat-videoplayer-save-polygons-button').show(); else $('#timaat-videoplayer-save-polygons-button').hide();
		},
		
		pause: function() {
			this.video.pause();
			if ( $('.playbutton').hasClass('playing') ) $('.playbutton').removeClass('playing');			
		},

		play: function() {
			this.video.play();
			if ( !$('.playbutton').hasClass('playing') ) $('.playbutton').addClass('playing');			
		},
		
		jumpTo: function(time) {
			this.video.currentTime = time;
			this.updateListUI();
		},
		
		jumpVisible: function(start, end) {
			var curTime = this.video.currentTime;
			if ( curTime < start || curTime > end ) this.video.currentTime = start;
			this.updateListUI();
		},
		
		_analysislistAdded: function(analysislist) {
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
		},

		
		_annotationAdded: function(annotation) {
			TIMAAT.VideoPlayer.annotationList.push(annotation);
			TIMAAT.VideoPlayer.curList.annotations.push(annotation.model);
			annotation.updateUI();
			annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			TIMAAT.VideoPlayer.selectAnnotation(annotation);
		},
		
		_annotationRemoved: function(annotation) {
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
		
	},
	
	

	// ------------------------

	Service: {
		state: 0,
		session: null,
		token: null,

		logout: function() {
			TIMAAT.Service.state = 2;
			TIMAAT.Service.token = null;
			TIMAAT.Service.session = null;
			location.reload(true);
		},

		listVideos(callback) {
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
			var model = {
					"id": 0,
					"analysisFreeTextField": comment,
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
			var list = {
					id: analysislist.id,
					title: analysislist.title,
					analysisFreeTextField: analysislist.analysisFreeTextField,
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
				analysislist.analysisFreeTextField = data.analysisFreeTextField;
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});
		},

		removeAnalysislist(analysislist) {
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

		addTag(annotation, tagname, callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotation.model.id+"/tag/"+tagname,
				type:"POST",
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
		removeTag(annotation, tagname, callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/"+annotation.model.id+"/tag/"+tagname,
				type:"DELETE",
				beforeSend: function (xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				},
			}).done(function(data) {
				callback(tagname);
			})
			.fail(function(e) {
				console.log( "error", e );
				console.log( e.responseText );
			});			
		},

	},
	
	// ------------------------
	    
	UI: {
		init: function() {
			$('[data-toggle="popover"]').popover();
			
			// init components
			TIMAAT.VideoChooser.init();	   
			TIMAAT.VideoPlayer.init();
			
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

		},
		
		hidePopups: function() {
			$('[data-toggle="popover"],[data-original-title]').each(function () {
				(($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false
	        });
		},
		
		showComponent: function(component) {
			$('.timaat-component').hide();
			$('.timaat-sidebar-tab').removeClass('bg-info');
			$('.timaat-sidebar-tab a').removeClass('selected');
			$('#timaat-component-'+component).show();
			$('.timaat-sidebar-tab-'+component).addClass('bg-info');
			$('.timaat-sidebar-tab-'+component+' a').addClass('selected');
		},
		
		setWaiting: function(waiting) {
			if (waiting) $('#timaat-ui-waiting').modal('show');
			else $('#timaat-ui-waiting').modal('hide');
		},
		
		processLogin: function() {
			var user = jQuery('#timaat-login-user').val();
			var pass = jQuery('#timaat-login-pass').val();
			if ( user.length > 0 && pass.length > 0 ) {
				hash = TIMAAT.Util.getArgonHash(pass,user+"timaat.kunden.bitgilde.de");
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
			    
					  })
					  .fail(function(e) {
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
		
		parseTime: function(timecode) {
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
		
		getArgonHash: function(password, salt) {
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
	
	/*
window.addEventListener('keypress', function (evt) {
    if (video.paused) { //or you can force it to pause here
        if (evt.keyCode === 37) { //left arrow
            //one frame back
            video.currentTime = Math.max(0, video.currentTime - frameTime);
        } else if (evt.keyCode === 39) { //right arrow
            //one frame forward
            //Don't go past the end, otherwise you may get an error
            video.currentTime = Math.min(video.duration, video.currentTime + frameTime);
        }
    }        
});
	*/
	

	   
	    TIMAAT.UI.init();

    
	    // DEBUG
	    $('#timaat-login-user').val('admin');
		$('#timaat-login-pass').val('geheim123');
		$('#timaat-login-submit').click();
		setTimeout(function() { 
		    $('body').removeClass('timaat-login-modal-open');
		    $('#timaat-login-modal').modal('hide');
		    $('#timaat-user-info').html("admin");
		}, 700);
		


}

if(window.attachEvent) {
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