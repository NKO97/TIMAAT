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
	
	TIMAAT.VideoPlayer = {
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
			              '    <i class="fa fa-trash-alt"></i>'+
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
			
			// polygon layer
			var annoLayer = new L.LayerGroup();
			map.annoLayer = annoLayer;
			map.addLayer(annoLayer);

			map.on('layeradd', function(ev) {
				if ( ev.layer.options.data ) 
					ev.layer.eachLayer(function (layer) {
						if ( ev.layer.options.annotation ) {
							if ( ev.layer.options.annotation.isSelected() ) layer.enableEdit();
							else {
								layer.disableEdit();
								layer.dragging.disable();
								layer.dragging._draggable = null;
							}
						}
					});
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

			// TODO refactor into own inspector class
			// setup sidebar inspector controls
			TIMAAT.VideoPlayer.inspector = L.control.sidebar({
			    autopan: false,
			    container: 'timaat-inspector',
			    closeButton: true,
			    position: 'right',
			}).addTo(map);
			TIMAAT.VideoPlayer.inspector.state = {
					item: null,
					type: null
			}
			TIMAAT.VideoPlayer.inspector.updateItem = function() {
				if ( !TIMAAT.VideoPlayer.inspector.state.item ) return;
				if (  TIMAAT.VideoPlayer.inspector.state.type == 'annotation' ) {
					var start = TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.inspector.state.item.startTime,true);
					var end = TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.inspector.state.item.endTime,true);
					// update UI
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);	
				}
			};

			$('#timaat-inspector-meta-submit').click(function(ev) {
				// TODO refactor, move to inspector function
				if ( !TIMAAT.VideoPlayer.inspector.state.type ) return;
				// annotations
				if ( TIMAAT.VideoPlayer.inspector.state.type == 'annotation' ) {
					var anno = TIMAAT.VideoPlayer.inspector.state.item;
					var title = $("#timaat-inspector-meta-title").val();
					var opacity = $("#timaat-inspector-meta-opacity").val();
					var comment = $("#timaat-inspector-meta-comment").val();
					var startTime = TIMAAT.Util.parseTime($("#timaat-inspector-meta-start").val());
					var endTime = TIMAAT.Util.parseTime($("#timaat-inspector-meta-end").val());
					var color = TIMAAT.VideoPlayer.UI.cp.colorHex.substring(1);
					if (anno) {
						anno.model.title = title;
						anno.model.comment = comment;
						anno.model.sequenceStartTime = startTime*1000.0;
						anno.model.sequenceEndTime = endTime*1000.0;
						anno.svg.color = color;
						anno.opacity = opacity;
						anno.saveChanges();
						TIMAAT.VideoPlayer.updateAnnotation(anno);
					} else {
						TIMAAT.Service.createAnnotation(title, comment, startTime*1000.0, endTime*1000.0, color, 1, TIMAAT.VideoPlayer.curList.id, TIMAAT.VideoPlayer._annotationAdded);
					}
				}
				// analysis lists
				if ( TIMAAT.VideoPlayer.inspector.state.type == 'analysislist' ) {
					var list = TIMAAT.VideoPlayer.inspector.state.item;
					var title = $("#timaat-inspector-meta-title").val();
					var comment = $("#timaat-inspector-meta-comment").val();				
					if (list) {
						TIMAAT.Util.setDefTranslation(TIMAAT.VideoPlayer.curList, 'mediumAnalysisListTranslations', 'title', title);
						TIMAAT.Util.setDefTranslation(TIMAAT.VideoPlayer.curList, 'mediumAnalysisListTranslations', 'text', comment);
						TIMAAT.VideoPlayer.updateAnalysislist(TIMAAT.VideoPlayer.curList);
						TIMAAT.VideoPlayer.inspector.close();
					} else {
						TIMAAT.Service.createAnalysislist(title, comment, TIMAAT.VideoPlayer.model.video.id, TIMAAT.VideoPlayer._analysislistAdded);
					}
				}
				// analysis segments
				if ( TIMAAT.VideoPlayer.inspector.state.type == 'analysissegment' ) {
					var segment = TIMAAT.VideoPlayer.inspector.state.item;
					var title = $("#timaat-inspector-meta-title").val();
					var startTime = TIMAAT.Util.parseTime($("#timaat-inspector-meta-start").val());
					var endTime = TIMAAT.Util.parseTime($("#timaat-inspector-meta-end").val());
					
					if (segment) {
						segment.model.analysisSegmentTranslations[0].name = title;
						segment.model.startTime = startTime;
						segment.model.endTime = endTime;
						// update segment UI
						TIMAAT.VideoPlayer.updateAnalysisSegment(segment);
					} else {
						TIMAAT.Service.createSegment(title, startTime, endTime, TIMAAT.VideoPlayer.curList.id, TIMAAT.VideoPlayer._segmentAdded);
					}
				}
				
			});
			$('#timaat-inspector-meta-title').on('input', function(ev) {
				if ( $("#timaat-inspector-meta-title").val().length > 0 ) {
					$('#timaat-inspector-meta-submit').prop("disabled", false);
					$('#timaat-inspector-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-inspector-meta-submit').prop("disabled", true);
					$('#timaat-inspector-meta-submit').attr("disabled");
				}
			});

			var sliderupdate = function(ev) {
				if ( TIMAAT.VideoPlayer.inspector.state.type == 'annotation' ) {
					var anno = TIMAAT.VideoPlayer.inspector.state.item;
					var opacity = $("#timaat-inspector-meta-opacity").val();
					anno.opacity = opacity;
				}
			};
			$('#timaat-inspector-meta-opacity').on({ 'change':sliderupdate,'input':sliderupdate});
			
			
			var metatimechange = function(ev) {
				var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
				startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
				endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
				$("#timaat-inspector-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
				$("#timaat-inspector-meta-end").val(TIMAAT.Util.formatTime(endTime, true));			
				
				if ( TIMAAT.VideoPlayer.inspector.state.item && TIMAAT.VideoPlayer.inspector.state.type == 'annotation' ) {
					TIMAAT.VideoPlayer.inspector.state.item.startTime = startTime;
					TIMAAT.VideoPlayer.inspector.state.item.endTime = endTime;
					TIMAAT.VideoPlayer.inspector.state.item.marker.updateView();
				}
			};
			$('#timaat-inspector-meta-start,#timaat-inspector-meta-end').on({'blur': metatimechange, 'change':metatimechange} );
			
			$('#timaat-inspector-meta-setstart').click(function() {
				var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
				var duration = endTime-startTime;
				duration = Math.max(0,Math.min(duration,TIMAAT.VideoPlayer.video.duration));
				startTime = TIMAAT.VideoPlayer.video.currentTime;
				endTime = startTime+duration;
				$('#timaat-inspector-meta-start').val(TIMAAT.Util.formatTime(startTime,true));
				$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTime,true));
				$('#timaat-inspector-meta-start').trigger('blur');
			});
			$('#timaat-inspector-meta-setend').click(function() {
				var endTime = TIMAAT.VideoPlayer.video.currentTime;
				$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTime,true));
				$('#timaat-inspector-meta-start').trigger('blur');
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
				var token = TIMAAT.VideoPlayer.model.video.mediumVideo.viewToken;
				var bar = $(this);
				var time = Math.round(ev.originalEvent.offsetX/bar.width()*TIMAAT.VideoPlayer.duration);
				var preview = $('#timaat-video-seek-bar-preview');
				$('#timaat-video-seek-bar-preview').css('left', ev.originalEvent.pageX-(preview.width()/2)+'px');
				$('#timaat-video-seek-bar-preview').css('top', bar.offset().top-preview.height()-7+'px');
				preview.find('img').attr('src', "/TIMAAT/api/medium/video/"+TIMAAT.VideoPlayer.model.video.id+"/thumbnail?token="+token+"&time="+time);
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
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+TIMAAT.VideoPlayer.curList.createdByUserAccountID+'">[ID '+TIMAAT.VideoPlayer.curList.createdByUserAccountID+']</span></b><br>\
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
			$('#timaat-inspector-meta-colorPicker').tinycolorpicker();
			TIMAAT.VideoPlayer.UI.cp = $('#timaat-inspector-meta-colorPicker').data("plugin_tinycolorpicker");
			TIMAAT.VideoPlayer.UI.cp.setColor('rgb(3, 145, 206)');
			
			$('#timaat-inspector-meta-duration').change(function(ev) {
				var time = parseInt($(this).val());
				if ( ! isNaN(time) ) TIMAAT.VideoPlayer.inspectorMetaEnd(time);
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
			
			$('#timaat-segment-delete-commit-submit').click(function(ev) {
				var modal = $('#timaat-videoplayer-segment-delete');
				if ( TIMAAT.VideoPlayer.inspector.state.type != 'analysissegment' ) return;
				var segment = TIMAAT.VideoPlayer.inspector.state.item;
				if (segment) TIMAAT.Service.removeSegment(segment);
				TIMAAT.VideoPlayer.setInspectorMetadata(null);
				modal.modal('hide');
			});			
		},
		
		switchInspector: function() {
			if ( TIMAAT.VideoPlayer.inspector.getPosition() == 'left' ) {
				TIMAAT.VideoPlayer.inspector.setPosition('right');
				$('#timaat-inspector').removeClass('leaflet-sidebar-left');
				$('.leaflet-sidebar-close i').attr('class', 'fa fa-caret-right');
			} else {
				TIMAAT.VideoPlayer.inspector.setPosition('left');
				$('#timaat-inspector').removeClass('leaflet-sidebar-right');
				$('.leaflet-sidebar-close i').attr('class', 'fa fa-caret-left');
			}
		},
		
		setInspectorMetadata: function(item, type) {
			TIMAAT.VideoPlayer.inspector.state.item = item;
			TIMAAT.VideoPlayer.inspector.state.type = type;
			if ( !type ) {
				TIMAAT.VideoPlayer.inspector.disablePanel('timaat-inspector-metadata');
				$('#timaat-inspector-metadata-pane').hide();
				$('#timaat-inspector-metadata-title').html('Kein Element ausgewählt');
			} else {
				TIMAAT.VideoPlayer.inspector.enablePanel('timaat-inspector-metadata');
				$('#timaat-inspector-metadata-pane').show();
				// annotations
				if ( type == 'annotation' ) {
					$('#timaat-inspector-meta-color-group').show();
					$('#timaat-inspector-meta-opacity-group').show();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-comment-group').show();
					var anno = item;
					var heading = (anno) ? "Annotation bearbeiten" : "Annotation hinzufügen";
					var submit = (anno) ? "Speichern" : "Hinzufügen";
					var color = (anno) ? anno.svg.color : TIMAAT.VideoPlayer.UI.cp.colorHex.substring(1);
					color = color.substring(0,6);
					var title = (anno) ? anno.model.title : "";
					var opacity = (anno) ? anno.opacity : "0.3";
					var comment = (anno) ? anno.model.comment : "";
					var start = (anno) ? TIMAAT.Util.formatTime(anno.model.sequenceStartTime/1000.0,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
					var end = (anno) ? TIMAAT.Util.formatTime(anno.model.sequenceEndTime/1000.0,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					TIMAAT.VideoPlayer.UI.cp.setColor('#'+color);
					$("#timaat-inspector-meta-title").val(title).trigger('input');
					$("#timaat-inspector-meta-opacity").val(opacity);
					$("#timaat-inspector-meta-comment").val(comment);
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);	
					if ( !anno ) TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
				}
				// analysis lists
				if ( type == 'analysislist' ) {
					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-timecode-group').hide();
					$('#timaat-inspector-meta-comment-group').show();
					var list = item;
					if ( !list ) TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
					var heading = (list) ? '<i class="fas fa-list-alt"></i> Liste bearbeiten' : '<i class="fas fa-list-alt"></i> Liste hinzufügen';
					var submit = (list) ? "Speichern" : "Hinzufügen";
					var title = (list) ? TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'title') : "";
					var comment = (list) ? TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'text') : "";
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-title").val(title).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment);				
				}
				// analysis segments
				if ( type == 'analysissegment' ) {
					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-comment-group').hide();
					var segment = item;
					if ( !segment ) TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
					var heading = (segment) ? '<i class="fas fa-indent"></i> Segment bearbeiten' : '<i class="fas fa-indent"></i> Segment hinzufügen';
					var submit = (segment) ? "Speichern" : "Hinzufügen";
					var title = (segment) ? segment.model.analysisSegmentTranslations[0].name : "";
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
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-title").val(title).trigger('input');
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);
					(segment) ? $('#timaat-segment-delete-submit').show() : $('#timaat-segment-delete-submit').hide();
				}
			}
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
			if ( video.mediumVideo.length < 0 ) video.mediumVideo.length += 3600; // temp fix for DB problems
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
			$('#timaat-analysissegment-edit').addClass("timaat-item-disabled");
			$('#timaat-analysissegment-edit').removeAttr('onclick');
			$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
			$('#timaat-analysislist-delete').removeAttr('onclick');
			$('#timaat-analysislist-add').addClass("timaat-item-disabled");
			$('#timaat-analysislist-add').removeAttr('onclick');
			$('#timaat-videoplayer-annotation-quickadd-button').prop("disabled", true);
			$('#timaat-videoplayer-annotation-quickadd-button').attr("disabled");

			// setup video overlay and UI
			$('.timaat-videoplayer-novideo').hide();
			$('.timaat-videoplayer-ui').show();
			$('#timaat-videoplayer-video-title').html(video.displayTitle.name);
			$('.timaat-videoduration').html(TIMAAT.Util.formatTime(this.model.video.mediumVideo.length));
			var videoUrl = '/TIMAAT/api/medium/video/'+this.model.video.id+'/download'+'?token='+video.mediumVideo.viewToken;
//			this.videoBounds = L.latLngBounds([[ video.mediumVideo.height, 0], [ 0, video.mediumVideo.width]]);
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
				list.ui = $('<option value="'+list.id+'">'+TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'title')+'</option>');
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
				$('#timaat-analysissegment-edit').removeClass("timaat-item-disabled");
				$('#timaat-analysissegment-edit').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegment()');
				$('#timaat-analysislist-delete').removeClass("timaat-item-disabled");
				$('#timaat-analysislist-delete').attr('onclick','TIMAAT.VideoPlayer.removeAnalysislist()');
				$('#timaat-videoplayer-annotation-quickadd-button').prop("disabled", false);
				$('#timaat-videoplayer-annotation-quickadd-button').removeAttr("disabled");
			}
			else {
				TIMAAT.VideoPlayer.setupAnnotations(null);
				$('#timaat-analysislist-chooser').append('<option>keine Liste vorhanden</option');
				$('#timaat-analysislist-chooser').addClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').addClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').removeAttr('onclick');
				$('#timaat-analysissegment-edit').addClass("timaat-item-disabled");
				$('#timaat-analysissegment-edit').removeAttr('onclick');
				$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
				$('#timaat-analysislist-delete').removeAttr('onclick');
				$('#timaat-videoplayer-annotation-quickadd-button').prop("disabled", true);
				$('#timaat-videoplayer-annotation-quickadd-button').attr("disabled");
			}
		},
		
		setupAnnotations: function(annotations) {
			console.log("TCL: setupAnnotations: function(annotations)");
			console.log("TCL: annotations", annotations);
			if ( TIMAAT.VideoPlayer.curAnnotation ) TIMAAT.VideoPlayer.curAnnotation.setSelected(false);

			// setup model
			TIMAAT.VideoPlayer.model.annotations = annotations;
			// close UI tag editors if any
			TIMAAT.UI.hidePopups();
			// clear polygon UI
			map.annoLayer.eachLayer(function(layer) {layer.remove()});
			map.editTools.editLayer.eachLayer(function(layer) {layer.remove()});

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
			
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.setInspectorMetadata(TIMAAT.VideoPlayer.curList, 'analysislist');			

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
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.setInspectorMetadata(null, 'analysislist');			
		},
		
		updateAnalysislist: function(analysislist) {
			console.log("TCL: updateAnalysislist: function(analysislist)");
			console.log("TCL: analysislist", analysislist);
			// sync to server
			TIMAAT.Service.updateAnalysislist(analysislist);
			console.log(analysislist);
			// TODO update UI list view
			TIMAAT.VideoPlayer.curList.ui.html(TIMAAT.Util.getDefTranslation(TIMAAT.VideoPlayer.curList, 'mediumAnalysisListTranslations', 'title'));
		},

		editAnalysislist: function() {
			console.log("TCL: editAnalysislist: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.setInspectorMetadata(TIMAAT.VideoPlayer.curList, 'analysislist');
			TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
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
					TIMAAT.VideoPlayer.video.currentTime*1000.0,
					TIMAAT.VideoPlayer.video.currentTime*1000.0,
					"5555554C", 
					1, 
					TIMAAT.VideoPlayer.curList.id, 
					TIMAAT.VideoPlayer._annotationAdded
			);
		},
		
		addAnnotation: function() {
			console.log("TCL: addAnnotation: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.setInspectorMetadata(null,'annotation');
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
				if ( annotation.isSelected() && annotation.hasChanges() ) {
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
//			console.log("TCL: selectAnnotation: function(annotation)");
//			console.log("TCL: annotation", annotation);
			if ( annotation ) TIMAAT.VideoPlayer.setInspectorMetadata(annotation, 'annotation');
			else TIMAAT.VideoPlayer.setInspectorMetadata(null);
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
		
		inspectorMetaEnd: function(time) {
			console.log("TCL: inspectorMetaEnd: function(time)");
			console.log("TCL: time", time);
			// TODO refactor
			var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
			var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
			endTime = startTime+time;
			startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
			endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
			$("#timaat-inspector-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
			$("#timaat-inspector-meta-end").val(TIMAAT.Util.formatTime(endTime, true));
			
			if ( TIMAAT.VideoPlayer.inspector.state.item && TIMAAT.VideoPlayer.inspector.state.type == 'annotation' ) {
				TIMAAT.VideoPlayer.inspector.state.item.startTime = startTime;
				TIMAAT.VideoPlayer.inspector.state.item.endTime = endTime;
				TIMAAT.VideoPlayer.inspector.state.item.marker.updateView();
			}

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
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.setInspectorMetadata(null,'analysissegment');
//			$('#timaat-videoplayer-segment-meta').data('segment', null);
//			$('#timaat-videoplayer-segment-meta').modal('show');
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
		
		sortListUI: function() {
//			console.log("TCL: sortListUI: function()");
			$("#timaat-annotation-list li").sort(function (a, b) {
				if ( (parseFloat($(b).attr('data-starttime'))) < (parseFloat($(a).attr('data-starttime'))) ) return 1;
				if ( (parseFloat($(b).attr('data-starttime'))) > (parseFloat($(a).attr('data-starttime'))) ) return -1;
				if ( !$(b).hasClass('timaat-annotation-list-segment') &&  $(a).hasClass('timaat-annotation-list-segment') ) return -1;
				return 0;
			}).appendTo('#timaat-annotation-list');
			
			// sort annotation markers in timeline
			var sortedList = TIMAAT.VideoPlayer.annotationList.concat();
			sortedList.sort(function (a, b) {
				if ( b.startTime < a.startTime ) return 1;
				if ( b.startTime > a.startTime ) return -1;
				return 0;
			});
			
			if ( sortedList.length > 0 ) {
				sortedList[0].marker.UIOffset = 0;
				var maxOffset = 0;
				for (var i=1; i < sortedList.length; i++) {
					var curOffset = 0;
					for (var a=0; a < i; a++) if ( sortedList[a].endTime >= sortedList[i].startTime )
						if ( curOffset == sortedList[a].marker.UIOffset ) curOffset++; // = sortedList[a].marker.UIOffset+1;
					sortedList[i].marker.UIOffset = curOffset;
					if ( curOffset > maxOffset ) maxOffset = curOffset;
				}
			}
			$('#timaat-timeline-marker-pane').css('height', (15+(maxOffset*12))+'px');
			
			
		},
		
		updateListUI: function() {
			console.log("TCL: updateListUI: function()");
			var hasChanges = false;
			
			if ( TIMAAT.VideoPlayer.curList != null && TIMAAT.VideoPlayer.curList.segments != null ) TIMAAT.VideoPlayer.curList.segments.forEach(function(segment) {
				segment.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				
			});
			
			this.annotationList.forEach(function(annotation) {
				annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				// update  behavior model --> annotation is only selected by user, regardless of timeline status
//				if ( TIMAAT.VideoPlayer.curAnnotation == annotation && !annotation.isActive() ) TIMAAT.VideoPlayer.selectAnnotation(null);
				if ( annotation.isSelected() && annotation.hasChanges() ) hasChanges = true;
			});
			if ( hasChanges ) $('#timaat-videoplayer-save-polygons-button').show(); else $('#timaat-videoplayer-save-polygons-button').hide();
		},
		
		updateUI: function() {
			// console.log("TCL: updateUI: function()");
			var hasChanges = false;
			this.annotationList.forEach(function(annotation) {
				if ( annotation.isSelected() && annotation.hasChanges() ) hasChanges = true;
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
			
			analysislist.ui = $('<option value="'+analysislist.id+'">'+TIMAAT.Util.getDefTranslation(analysislist, 'mediumAnalysisListTranslations', 'title')+'</option>');
			analysislist.ui.data('list', analysislist);
			
			// update UI
			if ( wasEmpty ) $('#timaat-analysislist-chooser').empty();			
			$('#timaat-analysislist-chooser').append(analysislist.ui);
			$('#timaat-analysislist-chooser').val(analysislist.id);

			$('#timaat-analysislist-chooser').trigger('change');
//			TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			TIMAAT.VideoPlayer.inspector.close();

			$('#timaat-analysislist-chooser').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').attr('onclick','TIMAAT.VideoPlayer.editAnalysislist()');
			$('#timaat-analysissegment-edit').removeClass("timaat-item-disabled");
			$('#timaat-analysissegment-edit').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegment()');
			$('#timaat-analysislist-delete').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-delete').attr('onclick','TIMAAT.VideoPlayer.removeAnalysislist()');			
			$('#timaat-videoplayer-annotation-quickadd-button').prop("disabled", false);
			$('#timaat-videoplayer-annotation-quickadd-button').removeAttr("disabled");
			

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
				$('#timaat-analysissegment-edit').addClass("timaat-item-disabled");
				$('#timaat-analysissegment-edit').removeAttr('onclick');
				$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
				$('#timaat-analysislist-delete').removeAttr('onclick');
				$('#timaat-videoplayer-annotation-quickadd-button').prop("disabled", true);
				$('#timaat-videoplayer-annotation-quickadd-button').attr("disabled");
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

			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.setInspectorMetadata(segment, 'analysissegment');
			TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');

			// update UI
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

	}
	
	

}, window));
