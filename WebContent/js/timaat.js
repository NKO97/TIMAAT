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
				 		<i class="fas fa-image fa-fw" aria-hidden="true"></i><span class="timaat-time"></span><br> \
						<div class="timaat-annotation-list-title text-muted"></div> \
					</li>'
			);
			this.updateUI();
			$('#timaat-annotation-list').append(this.listView);
			
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
			
			
		}
		
		updateUI() {
			this.listView.attr('data-starttime', this.model.startTime);
			this.listView.find('i').css('color', '#'+this.svg.color);
			var timeString = " "+TIMAAT.Util.formatTime(this.model.startTime);
			if ( this.model.startTime != this.model.endTime ) timeString += ' - '+TIMAAT.Util.formatTime(this.model.endTime);
			this.listView.find('span').html(timeString);
			this.listView.find('.timaat-annotation-list-title').html(this.model.title);
			
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

			// update UI
			this.listView.find('i').removeClass('fa-image');
			this.listView.find('i').addClass('fa-draw-polygon');
			
			// attach item event handlers
			var anno = this;
			item.on('click', function(ev) {
				TIMAAT.VideoPlayer.selectAnnotation(anno);
				// delete annotation if user presses alt
				if ( ev.originalEvent.altKey ) {
					anno.removeSVGItem(ev.target);
				    TIMAAT.Service.updateAnnotation(anno);
				}
				
			});
			item.on('dragstart', function(ev) {TIMAAT.VideoPlayer.selectAnnotation(anno);});
			item.on('dragend', function(ev) {TIMAAT.Service.updateAnnotation(anno);});
			
		}
		
		removeSVGItem (item) {
			if ( !item || !this.svg.items.includes(item) ) return;
			this.svg.layer.removeLayer(item);
			var index = this.svg.items.indexOf(item);
			if (index > -1) this.svg.items.splice(index, 1);

			// update UI
			if ( this.svg.items.length == 0 ) {
				this.listView.find('i').removeClass('fa-draw-polygon');
				this.listView.find('i').addClass('fa-image');
			}
		}
		
		getModel() {
			this._syncToModel();
			return this.model;
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
			switch (svgitem.type) {
				case "rectangle":
					// [[ height, x], [ y, width]]
					var bounds = [[ 450-(factor*svgitem.y), svgitem.x*factor], [ 450-((svgitem.y+svgitem.height)*factor), (svgitem.x+svgitem.width)*factor]];
					return L.rectangle(bounds, {draggable: true, color: '#'+this.svg.color, weight: this.svg.strokeWidth});
				
			}
		}
		
		_syncToModel() {
			var jsonData = [];
			var factor = 450 / TIMAAT.VideoPlayer.model.video.mediumVideo.height;
			this.svg.items.forEach(function(item) {
				if ( item instanceof L.Rectangle ) {
					var jsonItem = {
						type: 'rectangle',
						x: Math.abs(item.getBounds().getWest()/factor),
						y: Math.abs((450-item.getBounds().getNorth())/factor),
						width: Math.abs((item.getBounds().getEast()-item.getBounds().getWest())/factor),
						height: Math.abs((item.getBounds().getNorth()-item.getBounds().getSouth())/factor),
					}
					jsonData.push(jsonItem);
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
		
		setVideoList: function(videos) {
			if ( !videos ) return;
			
			// clear video UI list
			$('#timaat-video-list').empty();
			
			this.videos = videos;
			videos.forEach(function(video) {
				var videoelement = $('<div class="card timaat-video-card"> \
						  	<img class="card-img-top" src="img/video-placeholder.png" alt="Video Platzhalter"> \
						  	<div class="text-right text-white duration">00:00</div> \
						  	<div class="card-footer text-left title">/div> \
						      </div>'
				).appendTo('#timaat-video-list');

				videoelement.find('.title').html(video.primaryTitle.title);
				videoelement.find('.duration').html(TIMAAT.Util.formatTime(video.mediumVideo.length));
				
				videoelement.click(function(ev) {
					$('.timaat-video-card').removeClass('bg-info text-white');
					$(this).addClass('bg-info text-white');
					TIMAAT.UI.showComponent('videoplayer');

					// setup video in player
					TIMAAT.VideoPlayer.setupVideo(video);
					// load video annotations from server
					TIMAAT.Service.listAnnotations(video.id, TIMAAT.VideoPlayer.setupAnnotations);
				});
				
			});
		},
		
	},
	

	// ------------------------

	
	VideoPlayer: {
		duration: 1,
		annotationList: [],
		curAnnotation: null,
		markerList: [],
		overlay: null,
		UI: Object(),
		model: Object(),
		
		init: function() {
			// init UI
			$('.timaat-videoplayer-novideo').show();
			$('.timaat-videoplayer-ui').hide();
			
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
					TIMAAT.Service.createAnnotation(title, comment, startTime, endTime, color, 1, TIMAAT.VideoPlayer._annotationAdded);
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
			$('#timaat-videoplayer-annotation-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var anno = modal.data('annotation');
				
				var heading = (anno) ? "Annotation bearbeiten" : "Annotation hinzufügen";
				var submit = (anno) ? "Speichern" : "Hinzufügen";
				var color = (anno) ? anno.svg.color : TIMAAT.VideoPlayer.UI.cp.colorHex.substring(1);
				var title = (anno) ? anno.model.title : "";
				var comment = (anno) ? anno.model.comment : "";
				var start = (anno) ? TIMAAT.Util.formatTime(anno.model.startTime,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
				var end = (anno) ? TIMAAT.Util.formatTime(anno.model.endTime,true) : TIMAAT.Util.formatTime(Math.min(TIMAAT.VideoPlayer.video.currentTime+2,TIMAAT.VideoPlayer.duration),true);
				
				// setup UI from Video Player state
				$('#annotationMetaLabel').html(heading);
				$('#timaat-annotation-meta-submit').html(submit);
				TIMAAT.VideoPlayer.UI.cp.setColor('#'+color);
				$("#timaat-annotation-meta-title").val(title).trigger('input');
				$("#timaat-annotation-meta-comment").val(comment);
				$("#timaat-annotation-meta-start").val(start);
				$("#timaat-annotation-meta-end").val(end);
				
			})
			
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
			if ( this.overlay ) map.removeLayer(this.overlay);
			
			// setup annotation UI
			$('#timaat-annotation-list-loader').show();
			$('#timaat-videoplayer-annotation-add-button').prop("disabled", true);
			$('#timaat-videoplayer-annotation-add-button').attr("disabled");

			// setup video overlay and UI
			$('.timaat-videoplayer-novideo').hide();
			$('.timaat-videoplayer-ui').show();			
//    			var videoUrl = '../data/al-hayat-transcoded.mp4'+'?token='+video.viewToken; // TODO retrieve from model
    			var videoUrl = '/TIMAAT/api/media/'+this.model.video.id+'/download'+'?token='+video.viewToken;
			
			videoBounds = [[ 450, 0], [ 0, 450 / video.mediumVideo.height * video.mediumVideo.width]];
			map.setMaxBounds(videoBounds);
			map.fitBounds(videoBounds);
    	    		this.overlay = L.videoOverlay(videoUrl, videoBounds, { autoplay: false, loop: false} )
			.addTo(map);
			this.video = this.overlay.getElement();
			
			// attach event handlers for UI elements
			$(this.video).on('canplay', function(ev) {
				secs = TIMAAT.VideoPlayer.video.duration;
				mins = Math.floor(secs / 60);
				secs = secs - (mins*60);
				secs = Math.floor(secs);
				if (mins < 10 ) mins = "0"+mins;
				if (secs < 10 ) secs = "0"+secs;
		
				$('.videoduration').html(mins+":"+secs);
				$('#timaat-video-seek-bar').val(0);
				map.invalidateSize(true);
				
				TIMAAT.UI.setWaiting(false);

			});
			$(this.video).on('timeupdate', function(ev) {
				secs = TIMAAT.VideoPlayer.video.currentTime;
				frame = Math.floor(25 * (secs % 1));
				mins = Math.floor(secs / 60);
				secs = secs - (mins*60);
				secs = Math.floor(secs);
				if (mins < 10 ) mins = "0"+mins;
				if (secs < 10 ) secs = "0"+secs;
		
				$('.videotime').html(mins+":"+secs+"."+frame);
		
				var value = (100 / TIMAAT.VideoPlayer.video.duration) * TIMAAT.VideoPlayer.video.currentTime;
				$('#timaat-video-seek-bar').val(value);
				$('#timaat-video-seek-bar').css('background',"linear-gradient(to right,  #ed1e24 0%,#ed1e24 "+value+"%,#939393 "+value+"%,#939393 100%)");
				
				// update annotation list UI
				TIMAAT.VideoPlayer.updateListUI();
			});	
		},
		
		setupAnnotations: function(annotations) {
			// setup model
			TIMAAT.VideoPlayer.model.annotations = annotations;

			// build annotation list from model
			annotations.annotations.forEach(function(annotation) {
				TIMAAT.VideoPlayer.annotationList.push(new TIMAAT.Annotation(annotation));				
			});
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();

			// setup annotations UI
			$('#timaat-annotation-list-loader').hide();
			$('#timaat-videoplayer-annotation-add-button').prop("disabled", false);
			$('#timaat-videoplayer-annotation-add-button').removeAttr("disabled");
		},
		
		addAnnotation: function() {
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
		
		removeAnnotation: function() {
			if ( !this.curAnnotation ) return;
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
			this.annotationList.forEach(function(annotation) {
				annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				if ( TIMAAT.VideoPlayer.curAnnotation == annotation && !annotation.isActive() ) TIMAAT.VideoPlayer.selectAnnotation(null);
			});
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
		
		_annotationAdded: function(annotation) {
			TIMAAT.VideoPlayer.annotationList.push(annotation);
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
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/media/list",
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
		
		listAnnotations(videoID, callback) {
			jQuery.ajax({
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/media/"+videoID+"/list",
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
		
		createAnnotation(title, comment, startTime, endTime, color, strokeWidth, callback) {
			var model = { 	
				id: 0, 
				analysisListID: 0,
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
				url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/media/"+TIMAAT.VideoPlayer.model.video.id,
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
			
			// TODO sync to server and callback
			model.id = Math.floor(Math.random() * 1000) + 1;
			model.svg.id = Math.floor(Math.random() * 1000) + 1;
//			callback(new TIMAAT.Annotation(model));
			
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

			if ( fraction != 0 && withFraction ) time += "."+fraction.toFixed(2).substring(2);

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
		    $(map.editCtrl._container).find('a').addClass('bg-success');
		    x.layer.setStyle({color: '#'+TIMAAT.VideoPlayer.curAnnotation.svg.color, weight: TIMAAT.VideoPlayer.curAnnotation.svg.strokeWidth});
	    });
	    
	    map.on('editable:drawing:end', function(x) {
		    $(map.editCtrl._container).find('a').removeClass('bg-success');
		    x.layer.dragging.enable();
		    map.removeLayer(x.layer);
		    if ( TIMAAT.VideoPlayer.curAnnotation ) {
			    TIMAAT.VideoPlayer.curAnnotation.addSVGItem(x.layer);
			    TIMAAT.Service.updateAnnotation(TIMAAT.VideoPlayer.curAnnotation);
			    x.layer.dragging._draggable = null;
			    x.layer.dragging.addHooks();
		    }
	    });
	   
	    TIMAAT.UI.init();


	    /*
	    map.on('editable:drawing:click', updateTooltip);
	    */


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