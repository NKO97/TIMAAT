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
		curAnalysisList: null,
		curSegment: null,
		curSequence: null,
		curScene: null,
		curTake: null,
		curAction: null,
		curCategorySet: null,
		tagAutocomplete: [],
		markerList: [],
		overlay: null,
		UI: Object(),
		model: Object(),
		volume: 1,
		repeatSection: false,
		selectedVideo: null,
		selectedElementType: null,

		init: function() {
			// init UI
			$('.timaat-videoplayer-novideo').show();
			$('.timaat-videoplayer-ui').hide();
			
			this.viewer = L.map('timaat-videoplayer-viewer', {
				zoomControl: false,
				attributionControl: false,
				zoom: 0.0,
				maxZoom: 0.0,
				center: [0,0],
				crs: L.CRS.Simple,
				editable: true,
				keyboard: false,
			});

			let bounds = [[450,0], [0,800]];
			TIMAAT.VideoPlayer.viewer.setMaxBounds(bounds);
			TIMAAT.VideoPlayer.viewer.fitBounds(bounds);	
			TIMAAT.VideoPlayer.viewer.dragging.disable();
			TIMAAT.VideoPlayer.viewer.touchZoom.disable();
			TIMAAT.VideoPlayer.viewer.doubleClickZoom.disable();
			TIMAAT.VideoPlayer.viewer.scrollWheelZoom.disable();

			$(window).resize(function() {
				for (let marker of TIMAAT.VideoPlayer.markerList) marker._updateElementOffset();
				for (let anno of TIMAAT.VideoPlayer.annotationList) for (let keyframe of anno.svg.keyframes) keyframe._updateOffsetUI();
			});

			this.initNotifications();
			this.initLogging();
			this.initMenu();
			this.initAnimationControls();
			this.initInspectorControls();
			this.initTimeLineControls();
			this.initVideoPlayerControls();
		},

		initNotifications: function() {
			// segment created remotely
			$(document).on('add-segment.notification.TIMAAT', function(ev, notification) {
				let segment = new TIMAAT.AnalysisSegment(notification.data);
				if ( segment && TIMAAT.VideoPlayer.curAnalysisList &&  TIMAAT.VideoPlayer.curAnalysisList.id == notification.dataID ) {
					TIMAAT.VideoPlayer._segmentAdded(segment, false);
				}
			});
			
			// segment edited remotely
			$(document).on('edit-segment.notification.TIMAAT', function(ev, notification) {
				let segment = notification.data;
				if ( segment && TIMAAT.VideoPlayer.curAnalysisList &&  TIMAAT.VideoPlayer.curAnalysisList.id == notification.dataID ) {
					let localSegment = null;
					for ( let seg of TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI ) if ( seg.model.id == segment.id ) localSegment = seg;
					if (localSegment) {
						// update local segment
						localSegment.model = segment;
						TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI);
						// TIMAAT.VideoPlayer.sortSegments();
						// update UI list view
						localSegment.updateUI();
						console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
						TIMAAT.VideoPlayer.updateListUI();
						TIMAAT.VideoPlayer.sortListUI();
						TIMAAT.VideoPlayer.inspector.updateItem();
					}
				}
			});
			
			// segment deleted remotely
			$(document).on('remove-segment.notification.TIMAAT', function(ev, notification) {
				let segment = new TIMAAT.AnalysisSegment(notification.data);
				if ( segment && TIMAAT.VideoPlayer.curAnalysisList &&  TIMAAT.VideoPlayer.curAnalysisList.id == notification.dataID ) {
					let localSegment = null;
					for ( let seg of TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI ) if ( seg.model.id == segment.model.id ) localSegment = seg;
					if (localSegment) {
						// remove local segment
						TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.splice(TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.indexOf(localSegment), 1);
						localSegment.removeUI();
						if ( TIMAAT.VideoPlayer.inspector.state.item == localSegment ) TIMAAT.VideoPlayer.inspector.setItem(null);
					}
				}
			});
			
			// annotation created remotely
			$(document).on('add-annotation.notification.TIMAAT', function(ev, notification) {
				let annotation = new TIMAAT.Annotation(notification.data);
				if ( annotation && TIMAAT.VideoPlayer.curAnalysisList &&  TIMAAT.VideoPlayer.curAnalysisList.id == notification.dataID ) {
					TIMAAT.VideoPlayer._annotationAdded(annotation, false);
				}
			});

			// annotation edited remotely
			$(document).on('edit-annotation.notification.TIMAAT', function(ev, notification) {
				console.log("trigger edit annotation");
				let annotation = notification.data;
				console.log("remote annotation", annotation);
				if ( annotation && TIMAAT.VideoPlayer.curAnalysisList &&  TIMAAT.VideoPlayer.curAnalysisList.id == notification.dataID ) {
					console.log("in local list");
					let localAnno = null;
					for ( let anno of TIMAAT.VideoPlayer.annotationList ) if ( anno.model.id == annotation.id ) localAnno = anno;
					if (localAnno) {
						console.log("local annotation found", localAnno);
						// update local annotation
						localAnno.model = annotation;
						localAnno.setChanged();
						localAnno.discardChanges();
						// update UI list view
						localAnno.updateUI();
						TIMAAT.VideoPlayer.updateUI();
						console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
						TIMAAT.VideoPlayer.updateListUI();
						TIMAAT.VideoPlayer.sortListUI();
						if ( TIMAAT.VideoPlayer.inspector.state.item == localAnno )  TIMAAT.VideoPlayer.inspector.setItem(localAnno, 'annotation');
					}
				}
			});

			// annotation deleted remotely
			$(document).on('remove-annotation.notification.TIMAAT', function(ev, notification) {
				let annotation = notification.data;
				if ( annotation && TIMAAT.VideoPlayer.curAnalysisList &&  TIMAAT.VideoPlayer.curAnalysisList.id == notification.dataID ) {
					let localAnno = null;
					for ( let anno of TIMAAT.VideoPlayer.annotationList ) if ( anno.model.id == annotation.id ) localAnno = anno;
					if (localAnno) {
						// remove local annotation
						TIMAAT.VideoPlayer.annotationList.splice(TIMAAT.VideoPlayer.annotationList.indexOf(localAnno), 1);
						// remove from model list
						let anno = TIMAAT.VideoPlayer.curAnalysisList.annotations.find(x => x.id === localAnno.model.id);
						let index = TIMAAT.VideoPlayer.curAnalysisList.annotations.indexOf(anno);
						if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.annotations.splice(index, 1);

						// update UI list view
						localAnno.remove();
						console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
						TIMAAT.VideoPlayer.updateListUI();
						TIMAAT.VideoPlayer.sortListUI();
						if ( TIMAAT.VideoPlayer.inspector.state.item == localAnno ) TIMAAT.VideoPlayer.selectAnnotation(null);
					}
				}
			});
		},

		initLogging: function() {
			$('#timaat-user-log-analysislist').popover({
				container: 'body',
				html: true,
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				content: '<div class="timaat-user-log-details">Laden...</div>',
				placement: 'bottom',
				trigger: 'manual',
			});

			$('#timaat-user-log-analysislist').on('inserted.bs.popover', function () {
				if ( ! TIMAAT.VideoPlayer.curAnalysisList ) {
					$('.timaat-user-log-details').html("Keine Analyse ausgewählt");
					return;
				}
				$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+TIMAAT.VideoPlayer.curAnalysisList.createdByUserAccountID+'">[ID '+TIMAAT.VideoPlayer.curAnalysisList.createdByUserAccountID+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(TIMAAT.VideoPlayer.curAnalysisList.createdAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item,"mir")});
			});

			$('#timaat-videoplayer-video-user-log').popover({
				container: 'body',
				html: true,
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				content: '<div class="timaat-user-log-details">Keine Daten erfasst</div>',
				placement: 'left',
				trigger: 'click',
			});			
		},

		initMenu: function() {
			// setup analysis lists UI and events
			$('#timaat-analysislist-chooser').on('change', function(ev) {
				// console.log("TCL: analysis list change");
				TIMAAT.VideoPlayer.inspector.reset();
				var list = TIMAAT.VideoPlayer.model.analysisLists.find(x => x.id === parseInt($(this).val()));
				if ( list )  {
					TIMAAT.VideoPlayer.setupAnalysisList(list);
					TIMAAT.URLHistory.setURL(null, 'Analysis · '+ list.mediumAnalysisListTranslations[0].title, '#analysis/'+list.id);
				}
			});

			// publication dialog events
			$('#timaat-publish-video-switch, #timaat-publication-protected-switch').on('change', ev => {
				TIMAAT.VideoPlayer._setupPublicationDialog($('#timaat-publish-video-switch').prop('checked'), $('#timaat-publication-protected-switch').prop('checked'));
			});

			let dialog = $('#timaat-videoplayer-publication');

			dialog.find('.reveal').on('click', ev => {
				if ( dialog.find('.password').attr('type') === 'password' )
					dialog.find('.password').attr('type', 'text');
				else dialog.find('.password').attr('type', 'password');
			});

			dialog.find('.username, .password').on('change input', ev => {
				let enabled = $('#timaat-publish-video-switch').prop('checked');
				let restricted = $('#timaat-publication-protected-switch').prop('checked');
				let username = dialog.find('.username').val();
				let password = dialog.find('.password').val();
				$('#timaat-publication-settings-submit').prop('disabled', enabled && restricted && username == '' && password == '');
			});
			
			$('#timaat-publication-settings-submit').on('click', ev => {
				TIMAAT.VideoPlayer._updatePublicationSettings();
			})
		},

		initAnimationControls: function() {
			// animation player shape updater
			let animFrameRate = 20;
			TIMAAT.VideoPlayer.animInterval = setInterval(this._updateAnimations, 1000 / animFrameRate);

			// animation keyframe control
			TIMAAT.VideoPlayer.animCtrl = L.control.custom({
					position: 'topleft',
					content : `<div class="text-center bg-light border-bottom" onclick="TIMAAT.VideoPlayer.inspector.open('timaat-inspector-animation')">Keyframes</div>
								<div class="keyframe-controls">
									<div class="btn-group btn-group-sm">
										<button title="vorheriges Keyframe auswählen" id="timaat-videoplayer-keyframe-prev-button" onclick="void(0)" type="button" class="btn btn-light">
											<i class="fas fa-arrow-left"></i>
										</button>
									<div title="aktuelles Keyframe" class="btn btn-light active" ondblclick="TIMAAT.VideoPlayer.inspector.open('timaat-inspector-animation')">
										<i class="fas fa-fw keyframeinfo">2</i>
									</div>
									<button title="nächstes Keyframe auswählen" id="timaat-videoplayer-keyframe-next-button" onclick="void(0)" type="button" class="btn btn-light" disabled="">
										<i class="fas fa-arrow-right"></i>
										</button>
									</div>
								</div>
								<button title="neues Keyframe an diesem Timecode" id="timaat-videoplayer-keyframe-add-button" class="btn btn-block btn-sm btn-success d-none" style="padding: 2px;margin: 0;font-size: 12px;">Neu&nbsp;<i class="fas fa-plus-circle fa-fw"></i></button>
								<button title="aktuelles Keyframe entfernen" id="timaat-videoplayer-keyframe-remove-button" class="btn btn-block btn-sm btn-danger d-none" style="padding: 2px;margin: 0;font-size: 12px;">Löschen&nbsp;<i class="fas fa-trash-alt fa-fw"></i></button>`,
					classes : 'leaflet-bar',
					id: 'timaat-animation-controlwidget',
					style   : { margin: '10px', padding: '0px 0 0 0', },
			});

			TIMAAT.VideoPlayer.animCtrl.updateUI = function() {
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				if ( !anno || !anno.isAnimation() ) {
					$(this.getContainer()).hide();
					return;
				}
				$(this.getContainer()).show();
				let index = anno.getKeyframeIndex(anno.currentKeyframe);
				$('#timaat-videoplayer-keyframe-prev-button').prop('disabled', (index == 0) && anno.isOnKeyframe());
				$('#timaat-videoplayer-keyframe-next-button').prop('disabled', (index >= (anno.svg.keyframes.length-1)) && anno.isOnKeyframe());
				let addButton = $('#timaat-videoplayer-keyframe-add-button');
				let removeButton = $('#timaat-videoplayer-keyframe-remove-button');
				let info = $(this.getContainer()).find('.keyframeinfo');
				addButton.addClass('d-none');
				removeButton.addClass('d-none');
				if ( anno.isOnKeyframe() ) {
					info.removeClass('fa-ellipsis-h');
					info.text(index+1);
					removeButton.removeClass('d-none');
					removeButton.prop('disabled', anno.svg.keyframes.length <= 2 || anno.currentKeyframe.time == 0);
				} else {
					info.addClass('fa-ellipsis-h');
					info.text('');
					addButton.removeClass('d-none');
					addButton.prop('disabled', !(anno.isSelected() && anno.isActive()) );
				}
			};

			TIMAAT.VideoPlayer.animCtrl.addTo(this.viewer);

			$('#timaat-videoplayer-keyframe-add-button').on('click', function(ev) {
				ev.stopPropagation();
				if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
				TIMAAT.VideoPlayer.pause();
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				anno.addKeyframeAt(TIMAAT.VideoPlayer.video.currentTime);				
			});

			$('#timaat-videoplayer-keyframe-remove-button').on('click', function(ev) {
				ev.stopPropagation();
				if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
				TIMAAT.VideoPlayer.pause();
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				anno.removeCurrentKeyframe();
			});

			$('#timaat-videoplayer-keyframe-prev-button').on('click', function(ev) {
				ev.stopPropagation();
				if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
				TIMAAT.VideoPlayer.pause();
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				if ( !anno.isOnKeyframe() ) TIMAAT.VideoPlayer.jumpTo(anno.startTime+anno.currentKeyframe.time);
				else {
					let index = anno.getKeyframeIndex(anno.currentKeyframe)-1;
					if ( index < 0 ) index = 0;
					TIMAAT.VideoPlayer.jumpTo(anno.startTime+anno.svg.keyframes[index].time);
				}
			});

			$('#timaat-videoplayer-keyframe-next-button').on('click', function(ev) {
				ev.stopPropagation();
				if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
				TIMAAT.VideoPlayer.pause();
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				TIMAAT.VideoPlayer.jumpTo(anno.startTime+anno.nextKeyframe.time);
			});

			// bookmark / add / remove annotation control
			L.control.custom({
					position: 'topleft',
					content : `<button id="timaat-videoplayer-annotation-quickadd-button" title="Annotation schnell anlegen" onclick="TIMAAT.VideoPlayer.addQuickAnnotation()" type="button" class="btn btn-light">
									<i class="fas fa-bookmark"></i>
								</button>
								<button id="timaat-videoplayer-annotation-add-button" title="Neue Annotation anlegen" onclick="TIMAAT.VideoPlayer.addAnnotation()" type="button" class="ml-0 btn btn-light">
									<i class="fa fa-plus"></i>
								</button>
								<button id="timaat-videoplayer-annotation-remove-button" title="Annotation löschen" onclick="TIMAAT.VideoPlayer.removeAnnotation()" disabled type="button" class="ml-0 btn btn-light">
									<i class="fa fa-trash-alt"></i>
								</button>`,
					classes : 'btn-group btn-group-sm btn-group-vertical leaflet-bar',
					style   :
					{ margin: '10px', padding: '0px 0 0 0', },
			})
			.addTo(TIMAAT.VideoPlayer.viewer);
						
			// save polygon changes control
			TIMAAT.VideoPlayer.savePolygonCtrl = L.control.custom({
				enabled: false,
					position: 'topleft',
					content : '<button disabled title="Änderungen der Annotation speichern" id="timaat-videoplayer-save-polygons-button" onclick="TIMAAT.VideoPlayer.updateAnnotations()" type="button" class="btn btn-light">'+
										'    <i class="fa fa-save"></i>' +
										'</button>',
					classes : 'btn-group-vertical btn-group-sm leaflet-bar',
					style   : { margin: '10px', padding: '0px 0 0 0', },
			});

			TIMAAT.VideoPlayer.savePolygonCtrl.setEnabled = function(enabled) {
				if ( this.options.enabled == enabled ) return;
				this.options.enabled = enabled;
				let button = $('#timaat-videoplayer-save-polygons-button');
				button.prop('disabled', !enabled);
				if ( enabled ) button.removeClass('btn-light').addClass('btn-success');
				else button.removeClass('btn-success').addClass('btn-light');
			};

			TIMAAT.VideoPlayer.savePolygonCtrl.addTo(this.viewer);

			TIMAAT.VideoPlayer.savePolygonCtrl.setEnabled(false);

			// shape editing control
			TIMAAT.VideoPlayer.editShapesCtrl = L.control.custom({
					position: 'topleft',
					enabled: true,
					content : `<button data-type="rectangle" type="button" title="Rechteck-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createShape('rectangle)" class="rectangle btn btn-sm btn-light">
									<i class="fas fa-vector-square"></i>
								</button>
								<button data-type="polygon" type="button" title="Polygon-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createShape('polygon')" class="polygon ml-0 btn btn-sm btn-light">
									<i class="fas fa-draw-polygon"></i>
								</button>
								<button data-type="line" type="button" title="Linien-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createShape('line')" class="line ml-0 btn btn-sm btn-light">
									<i class="fas fa-slash"></i>
								</button>
								<button data-type="circle" type="button" title="Kreis-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createshape('circle')" class="circle ml-0 btn btn-sm btn-light">
									<i class="far fa-circle"></i>
								</button>`,
					classes : 'btn-group btn-group-sm btn-group-vertical leaflet-bar',
					style   : { margin: '10px', padding: '0px 0 0 0', },
			});

			TIMAAT.VideoPlayer.editShapesCtrl.setEnabled = function(enabled) {
				if ( this.options.enabled == enabled ) return;
				this.options.enabled = enabled;
				$(this.getContainer()).find('button').prop('disabled', !enabled);
				if (!enabled) {
					$(this.getContainer()).find('button').removeClass('btn-success').addClass('btn-light');
					try { TIMAAT.VideoPlayer.viewer.editTools.stopDrawing(); } catch(err) {};
				}
			};

			TIMAAT.VideoPlayer.editShapesCtrl.addTo(this.viewer);

			TIMAAT.VideoPlayer.editShapesCtrl.setEnabled(false);

			// ------------------------------------------------------------------------------------

			// polygon layer
			var annoLayer = new L.LayerGroup();
			TIMAAT.VideoPlayer.viewer.annoLayer = annoLayer;
			TIMAAT.VideoPlayer.viewer.addLayer(annoLayer);

			TIMAAT.VideoPlayer.viewer.on('layeradd', function(ev) {
				if ( ev.layer.options.data ) 
					ev.layer.eachLayer(function (layer) {
						if ( ev.layer.options.annotation ) {
							if ( ev.layer.options.annotation.isSelected() ) {
								layer.enableEdit();
								if ( TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
									layer.editor.options.skipMiddleMarkers = true;
									layer.editor.reset();
								}

							} else {
								layer.disableEdit();
								layer.dragging.disable();
								layer.dragging._draggable = null;
							}
						}
					});
			});

			TIMAAT.VideoPlayer.viewer.on('editable:editing', function (e) {
					e.layer.setStyle({weight: 1, fillOpacity: 0.2});
			});

			TIMAAT.VideoPlayer.viewer.on('editable:drawing:start', function(x) {
				if ( !TIMAAT.VideoPlayer.curAnnotation ) {
					try {
						TIMAAT.VideoPlayer.viewer.editTools.stopDrawing();
					} catch (e) {}		    		
					return;
				}		    	
				TIMAAT.VideoPlayer.pause();		    	
				x.layer.setStyle({color: '#'+TIMAAT.VideoPlayer.curAnnotation.svg.color, weight: TIMAAT.VideoPlayer.curAnnotation.svg.strokeWidth});
			});

			TIMAAT.VideoPlayer.viewer.on('editable:vertex:dragend', function(ev) {
				if ( TIMAAT.VideoPlayer.curAnnotation ) {
					TIMAAT.VideoPlayer.curAnnotation.setChanged();
					// sync keyframe
					if ( ev.layer ) TIMAAT.VideoPlayer.curAnnotation.syncShape(ev.layer);
					console.log("TIMAAT.VideoPLayer.updateUI() - editable:vertex:dragend");
					TIMAAT.VideoPlayer.updateUI();		    		
				}
			});

			TIMAAT.VideoPlayer.viewer.on('editable:dragend', function(ev) {
				if ( ev.layer && ev.layer instanceof L.Circle ) {
					ev.layer.disableEdit();
					ev.layer.enableEdit();
					if ( TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
						ev.layer.editor.options.skipMiddleMarkers = true;
						ev.layer.editor.reset();
					}
				}
				// sync keyframe
				if ( TIMAAT.VideoPlayer.curAnnotation && ev.layer ) TIMAAT.VideoPlayer.curAnnotation.syncShape(ev.layer);

			});

			TIMAAT.VideoPlayer.viewer.on('editable:drag', function(ev) {
				var bounds = TIMAAT.VideoPlayer.confineBounds(ev.layer.getBounds(), ev.offset.x, ev.offset.y);
				if ( ev.layer.setBounds ) ev.layer.setBounds(L.latLngBounds(bounds.getNorthEast(),bounds.getSouthWest())); else {
					// TODO refactor
					var latlngs = ( ev.layer.getLatLngs != null ) ? ev.layer.getLatLngs() : [ev.layer.getLatLng()];
					$(latlngs[0]).each(function(item,latlng) {
						var minLat = ( ev.layer instanceof L.Circle ) ? ev.layer.getRadius() : 0;
						var minLng = ( ev.layer instanceof L.Circle ) ? ev.layer.getRadius() : 0;
						var maxLat = ( ev.layer instanceof L.Circle ) ? (TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat-ev.layer.getRadius()) : TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat;
						var maxLng = ( ev.layer instanceof L.Circle ) ? (TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng-ev.layer.getRadius()) : TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng;
						if (latlng.lng < minLng ) latlng.lng = minLng;
						if (latlng.lat < minLat ) latlng.lat = minLat;
						if (latlng.lng > maxLng ) latlng.lng = maxLng;
						if (latlng.lat > maxLat ) latlng.lat = maxLat;
						if ( ev.layer instanceof L.Circle ) ev.layer.setLatLng(latlng);
					});
				}		   
			});

			// Animation Events
			$(document).on('keyframeadded.annotation.TIMAAT', function(event, anno) {
				if ( !anno ) return;
				anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				TIMAAT.VideoPlayer.updateUI();
				TIMAAT.VideoPlayer.inspector.updateItem();
			});

			$(document).on('keyframeremoved.annotation.TIMAAT', function(event, anno) {
				if ( !anno ) return;
				anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				TIMAAT.VideoPlayer.updateUI();
				TIMAAT.VideoPlayer.inspector.updateItem();
			});

			$(document).on('keyframechanged.annotation.TIMAAT', function(event, anno) {
				if ( !anno ) return;
				anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
				TIMAAT.VideoPlayer.updateUI();
				TIMAAT.VideoPlayer.inspector.updateItem();
			});

			TIMAAT.VideoPlayer.viewer.on('editable:vertex:click', function(ev) {
				if ( TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation()  && !ev.layer.editor.drawing() ) ev.cancel();
			});

			TIMAAT.VideoPlayer.viewer.on('editable:vertex:new', function (ev) {
				// Animation Event
				let shouldDelete = TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation() && !ev.layer.editor.drawing();
				if ( shouldDelete ) {
					ev.vertex.delete();
					return;
				}
				var latlng = ev.latlng;
				if (latlng.lng < 0 ) latlng.lng = 0;
				if (latlng.lat < 0 ) latlng.lat = 0;
				if (latlng.lng > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng ) latlng.lng = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng;
				if (latlng.lat > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat ) latlng.lat = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat;
				ev.vertex.setLatLng(latlng);		    			    	
			});	

			TIMAAT.VideoPlayer.viewer.on('editable:vertex:drag', function(ev) {
				var latlng = ev.latlng;
				if (latlng.lng < 0 ) latlng.lng = 0;
				if (latlng.lat < 0 ) latlng.lat = 0;
				if (latlng.lng > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng ) latlng.lng = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lng;
				if (latlng.lat > TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat ) latlng.lat = TIMAAT.VideoPlayer.videoBounds.getNorthEast().lat;
				ev.vertex.setLatLng(latlng);

				if ( TIMAAT.VideoPlayer.curTool == 'circle' || (ev.vertex.editor.feature.getRadius != null) ) {
					if ( ev.vertex.editor.feature.getLatLng() == ev.vertex.latlng ) return;
					var radius = TIMAAT.VideoPlayer.viewer.distance(ev.vertex.editor.feature.getLatLng(),ev.vertex.latlng);
					radius = Math.max(5,radius);
					ev.vertex.editor.feature.setRadius( radius );
			//					console.log(ev.vertex, ev.vertex.editor.feature, ev.vertex.editor.feature.getRadius());
				}
								
				
			});

			TIMAAT.VideoPlayer.viewer.on('editable:drawing:end', function(ev) {
				$(TIMAAT.VideoPlayer.editShapesCtrl.getContainer()).find('button').removeClass('btn-success').addClass('btn-light');
				TIMAAT.VideoPlayer.curTool = null;
				ev.layer.dragging.enable();
				TIMAAT.VideoPlayer.viewer.removeLayer(ev.layer);
				if ( TIMAAT.VideoPlayer.curAnnotation ) {
					TIMAAT.VideoPlayer.curAnnotation.addSVGItem(ev.layer);
					TIMAAT.VideoPlayer.updateUI();
					console.log("TCL: TIMAAT.VideoPlayer.updateUI() - if ( TIMAAT.VideoPlayer.curAnnotation )");
					ev.layer.dragging._draggable = null;
					ev.layer.dragging.addHooks();
					ev.layer.enableEdit();
					if ( TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
						ev.layer.editor.options.skipMiddleMarkers = true;
						ev.layer.editor.reset();
					}
				}
			});
		},

		initInspectorControls: function() {
			// setup sidebar inspector controls
			TIMAAT.VideoPlayer.inspector = new TIMAAT.Inspector(TIMAAT.VideoPlayer.viewer);		
			
			// init summernote fields
			$('#timaat-inspector-meta-comment').summernote({
				toolbar: [
					['style', ['bold', 'italic', 'underline', 'clear']],
				],
				disableDragAndDrop: true,
				tabDisable: false,
				codeviewFilter: true,
				codeviewIframeFilter: true,
				codeviewIframeWhitelistSrc: []
			});

			$('#timaat-inspector-meta-transcript').summernote({
				toolbar: [
					['style', ['bold', 'italic', 'underline', 'clear']],
				],
				disableDragAndDrop: true,
				tabDisable: false,
				codeviewFilter: true,
				codeviewIframeFilter: true,
				codeviewIframeWhitelistSrc: []
			});

			$('#timaat-annotation-delete-submit-button').on('click', function(ev) {
				var modal = $('#timaat-videoplayer-annotation-delete');
				var anno = modal.data('annotation');
				if (anno) TIMAAT.VideoPlayer._annotationRemoved(anno);
				modal.modal('hide');
			});

			$('#timaat-analysislist-delete-submit-button').on('click', function(ev) {
				var modal = $('#timaat-videoplayer-analysislist-delete');
				var list = modal.data('analysislist');
				if (list) TIMAAT.VideoPlayer._analysislistRemoved(list);
				modal.modal('hide');
			});

			$('#timaat-segment-element-delete-commit-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videoplayer-segment-element-delete');
				var type = $('#timaat-videoplayer-segment-element-delete').data('type');
        console.log("TCL: $ -> type", type);
				var model = $('#timaat-videoplayer-segment-element-delete').data('model');
        console.log("TCL: $ -> model", model);
				// if ( TIMAAT.VideoPlayer.inspector.state.type != 'segment' ) return;
				if ( type ) {
					await TIMAAT.AnalysisListService.removeSegmentElement(type, model.id);
					TIMAAT.VideoPlayer.refreshTimelineSegmentElementStructure();
				}
				TIMAAT.VideoPlayer.inspector.setItem(null);
				switch (type) {
					case 'segment':
						TIMAAT.VideoPlayer.curSegment = null;
					break;
					case 'sequence':
						TIMAAT.VideoPlayer.curSequence = null;
					break;
					case 'take':
						TIMAAT.VideoPlayer.curTake = null;
					break;
					case 'scene':
						TIMAAT.VideoPlayer.curScene = null;
					break;
					case 'action':
						TIMAAT.VideoPlayer.curAction = null;
					break;
				}
				modal.modal('hide');
			});
		},

		initTimeLineControls: function() {
			// setup timeline view events
			$('.timaat-button-videolayer').on('click', function(ev) {
				$('.timaat-button-videolayer').removeClass('btn-outline-secondary').addClass('btn-primary');
				$('.timaat-button-audiolayer').removeClass('btn-primary').addClass('btn-outline-secondary');
				$('#timaat-timeline-marker-pane').removeClass('timaat-timeline-audiolayer').addClass('timaat-timeline-videolayer');
				TIMAAT.VideoPlayer.editAudioLayer = false;
				TIMAAT.VideoPlayer.sortListUI();
			});

			$('.timaat-button-audiolayer').on('click', function(ev) {
				$('.timaat-button-videolayer').removeClass('btn-primary').addClass('btn-outline-secondary');
				$('.timaat-button-audiolayer').removeClass('btn-outline-secondary').addClass('btn-primary');
				$('#timaat-timeline-marker-pane').removeClass('timaat-timeline-videolayer').addClass('timaat-timeline-audiolayer');
				TIMAAT.VideoPlayer.editAudioLayer = true;
				TIMAAT.VideoPlayer.sortListUI();
			});

			// setup timeline preview
			var preview = $('#timaat-video-seek-bar-preview');
			preview.removeClass('show');
			preview.hide();

			$('#timaat-video-seek-bar').change(function(ev) {
			  var time = TIMAAT.VideoPlayer.video.duration * (this.value / 100);
				TIMAAT.VideoPlayer.jumpTo(time);
			});

			$('#timaat-video-seek-bar').on('input', function(ev) {
			  this.style.background="linear-gradient(to right, #ed1e24 0%,#ed1e24 "+this.value+"%,#939393 "+this.value+"%,#939393 100%)";
			});	

			$('#timaat-video-seek-bar').on('click', function(ev) {
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
				preview.find('img').attr('src', "/TIMAAT/api/medium/video/"+TIMAAT.VideoPlayer.model.video.id+"/thumbnail?token="+token+"&time="+time);
			});
			
		},

		initVideoPlayerControls: function() {
			// setup keyboard video controls
			$([document.body,TIMAAT.VideoPlayer.viewer]).keydown(function(ev) {
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
				case "r":
					ev.preventDefault();
					$('.repeatbutton').click();
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

			// setup video controls UI events
			// TODO refactor
			$('.playbutton').on('click', function(ev) {
				ev.preventDefault();
				$(this).toggleClass('active');
				if ( $(this).hasClass('active') ) TIMAAT.VideoPlayer.play(); else TIMAAT.VideoPlayer.pause();
			});		

			$('.stepbckbutton').on('click dblclick', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.pause();
				let frameTime = 1 / TIMAAT.VideoPlayer.curFrameRate;
				TIMAAT.VideoPlayer.jumpTo(
					Math.max(0, (Math.round(TIMAAT.VideoPlayer.video.currentTime/frameTime)*frameTime) - frameTime)
				);
			});

			$('.stepfwdbutton').on('click dblclick', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.pause();
				let frameTime = 1 / TIMAAT.VideoPlayer.curFrameRate;
				TIMAAT.VideoPlayer.jumpTo(
					Math.min(TIMAAT.VideoPlayer.video.duration, (Math.round(TIMAAT.VideoPlayer.video.currentTime/frameTime)*frameTime) + frameTime)
				);
			});

			$('.repeatbutton').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.repeatSection = !TIMAAT.VideoPlayer.repeatSection;
				$(this).removeClass('btn-outline-secondary').removeClass('btn-primary');
				if ( TIMAAT.VideoPlayer.repeatSection ) $(this).addClass('btn-primary'); else $(this).addClass('btn-outline-secondary');
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

			$('#timaat-volumeicon').on('click', function() {
				if ( !TIMAAT.VideoPlayer.video ) return;
				if ( TIMAAT.VideoPlayer.video.volume > 0 ) {
					TIMAAT.VideoPlayer.volume = TIMAAT.VideoPlayer.video.volume;
					$('#timaat-volume-slider').val(0);
				} else {
					$('#timaat-volume-slider').val(TIMAAT.VideoPlayer.volume*100);
				}
				$('#timaat-volume-slider').change();
			});
			
			$('#timaat-videoplayer-video-speed').on('click', function() {
				if ( !TIMAAT.VideoPlayer.video ) return;
				var playbackSpeeds = [1,2,0.5,0.25]; // TODO move to config

				var speed = playbackSpeeds.indexOf(TIMAAT.VideoPlayer.video.playbackRate);
				if ( speed < 0 ) TIMAAT.VideoPlayer.video.playbackRate = 1;
				else {
					speed++;
					if ( speed > playbackSpeeds.length-1 ) speed = 0;
					TIMAAT.VideoPlayer.video.playbackRate = playbackSpeeds[speed];
				}
				let rateInfo = TIMAAT.VideoPlayer.video.playbackRate;
				if ( rateInfo == 0.5 ) rateInfo = "&frac12;";
				if ( rateInfo == 0.25 ) rateInfo = "&frac14;";
				// update UI
				$(this).find('.video-speed-info').html(rateInfo+"&times;");
				if ( TIMAAT.VideoPlayer.video.playbackRate != 1 ) $(this).addClass('active'); else $(this).removeClass('active');
				
			});
		},

		initializeAnnotationMode: async function(video) {
			if (!video) return;
			TIMAAT.UI.showComponent('videoplayer');

			// setup video in player
			// console.log("TCL: setupVideo");
			TIMAAT.VideoPlayer.setupVideo(video);
			// load video annotations from server
			// TIMAAT.AnalysisListService.getAnalysisLists(video.id, TIMAAT.VideoPlayer.setupMediumAnalysisLists);
			if (TIMAAT.VideoPlayer.curAnalysisList) {
				TIMAAT.VideoPlayer.clearTimelineSegmentElementStructure();
				TIMAAT.VideoPlayer.curAnalysisList = null;
			}
			let analysisLists = await TIMAAT.AnalysisListService.getMediumAnalysisLists(video.id);
			await TIMAAT.VideoPlayer.setupMediumAnalysisLists(analysisLists);
			// TIMAAT.VideoPlayer.setupMediumAnalysisLists(video.medium.mediumAnalysisLists);
			if (TIMAAT.VideoPlayer.curAnalysisList) {
				TIMAAT.URLHistory.setURL(null, 'Analysis · '+ TIMAAT.VideoPlayer.curAnalysisList.mediumAnalysisListTranslations[0].title, '#analysis/'+TIMAAT.VideoPlayer.curAnalysisList.id);
			} else {
				TIMAAT.URLHistory.setURL(null, 'Video Player', '#analysis');
			}
		},

		sort: function(elements) {
			if ( !elements ) return;
			elements.sort(function (a, b) {
				if ( b.model.startTime < a.model.startTime ) return 1;
				if ( b.model.startTime > a.model.startTime ) return -1;
				return 0;
			})
		},
		
		createShape: function(type) {
			console.log("TCL: createShape: function(type)");
			console.log("TCL: type", type);
			
			if ( TIMAAT.VideoPlayer.viewer.editTools.drawing() ) {
				let oldTool = TIMAAT.VideoPlayer.curTool;
				try { TIMAAT.VideoPlayer.viewer.editTools.stopDrawing(); } catch(err) {};
				$(TIMAAT.VideoPlayer.editShapesCtrl.getContainer()).find('button').removeClass('btn-success').addClass('btn-light');
				if ( type == oldTool ) return;
			}
			
			switch (type) {
			case 'rectangle':
				TIMAAT.VideoPlayer.curTool = type;
				TIMAAT.VideoPlayer.viewer.editTools.startRectangle();
				break;
			case 'polygon':
				TIMAAT.VideoPlayer.curTool = type;
				TIMAAT.VideoPlayer.viewer.editTools.startPolygon();
				break;
			case 'circle':
				TIMAAT.VideoPlayer.curTool = type;
				TIMAAT.VideoPlayer.viewer.editTools.startCircle();
				break;
			case 'line':
				TIMAAT.VideoPlayer.curTool = type;
				TIMAAT.VideoPlayer.viewer.editTools.startPolyline();
				break;
			}			
			// update UI
			$(TIMAAT.VideoPlayer.editShapesCtrl.getContainer()).find('button.'+type).removeClass('btn-light').addClass('btn-success');
		},

		confineBounds: function(bounds, xOff, yOff) {
//			console.log("TCL: confineBounds: function(bounds, xOff, yOff)");
//			console.log("TCL: bounds", bounds);
//			console.log("TCL: xOff", xOff);
//			console.log("TCL: yOff", yOff);
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
			console.log("TCL: setupVideo: function(video) ", video);
			// setup model
			if ( video.mediumVideo.length < 0 ) {
				console.log("TCL: TEMP FIX STILL NECESSARY");
				video.mediumVideo.length += 3600; // temp fix for DB problems
			}
			this.curFrameRate = 25; // TODO
			this.model.video = video;
			this.duration = video.mediumVideo.length;			
			// remove all annotations and markers
			this.annotationList.forEach(function(annotation) {annotation.remove()});
			this.annotationList = [];
			this.curAnnotation = null;			
			// remove old video
			if ( TIMAAT.VideoPlayer.video ) {
				$(TIMAAT.VideoPlayer.video).off('canplay');
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.jumpTo(0);
				$('#timaat-video-seek-bar').val(0);
				TIMAAT.VideoPlayer.video.currentTime = 0;
			}
			if ( this.overlay ) TIMAAT.VideoPlayer.viewer.removeLayer(this.overlay);
			
			// setup annotation UI
			$('#timaat-annotation-list-loader').show();
			$('#timaat-videoplayer-annotation-add-button').prop('disabled', true);
			$('#timaat-videoplayer-annotation-add-button').attr('disabled');

			// setup timeline UI
			let token = TIMAAT.VideoPlayer.model.video.viewToken;
			$('#timaat-timeline-marker-pane img.timaat-audio-waveform').attr('src', "img/audio-placeholder.png");
			$('#timaat-timeline-marker-pane img.timaat-audio-waveform').attr('src', "/TIMAAT/api/medium/video/"+TIMAAT.VideoPlayer.model.video.id+"/audio/combined?token="+token);
			
			// setup analysis list UI
			$('#timaat-analysislist-chooser').empty();
			TIMAAT.VideoPlayer.initEmptyAnalysisListMenu();

			// setup inspector
			TIMAAT.VideoPlayer.inspector.reset();
			
			// setup video overlay and UI
			$('.timaat-videoplayer-novideo').hide();
			$('.timaat-sidebar-tab-videoplayer').removeClass('isDisabled');			
			$('.timaat-videoplayer-ui').show();
			var medium = new TIMAAT.Medium(video, 'video');
			TIMAAT.VideoPlayer.selectedVideo = medium;
			$('.timaat-sidebar-tab-videoplayer a').attr('onclick', 'TIMAAT.VideoPlayer.initializeAnnotationMode(TIMAAT.VideoPlayer.selectedVideo.model);');
			$('.timaat-sidebar-tab-videoplayer').attr('title', 'Annotate video');
			TIMAAT.UI.clearLastSelection('medium');
			$('#medium-metadata-form').data('medium', medium);
			$('#previewTab').addClass('annotationView');
			$('#timaat-mediadatasets-medium-tabs').show();
			TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-metadata-form', 'medium');
			TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');			
			$('#timaat-videoplayer-medium-tabs-container').append($('#timaat-mediadatasets-medium-tabs'));
			$('#timaat-videoplayer-medium-modals-container').append($('#timaat-medium-modals'));
			TIMAAT.MediumDatasets.container = 'videoplayer';
			$('.datasheet-form-annotate-button').hide();
			$('.datasheet-form-annotate-button').prop('disabled', true);

			$('#timaat-videoplayer-video-title').html(video.displayTitle.name);
			$('.timaat-videoduration').html(TIMAAT.Util.formatTime(this.model.video.mediumVideo.length));
			var videoUrl = '/TIMAAT/api/medium/video/'+this.model.video.id+'/download'+'?token='+video.viewToken;
			// this.videoBounds = L.latLngBounds([[ video.mediumVideo.height, 0], [ 0, video.mediumVideo.width]]);
			this.videoBounds = L.latLngBounds([[ 450, 0], [ 0, 450 / video.mediumVideo.height * video.mediumVideo.width]]);
			TIMAAT.VideoPlayer.viewer.setMaxBounds(this.videoBounds);
			TIMAAT.VideoPlayer.viewer.fitBounds(this.videoBounds);
			this.overlay = L.videoOverlay(videoUrl, this.videoBounds, { autoplay: false, loop: false} ).addTo(TIMAAT.VideoPlayer.viewer);
			this.video = this.overlay.getElement();

			// attach event handlers for UI elements
			let curVideo = this.video;
			$(this.video).on('canplay', function(ev) {
				TIMAAT.VideoPlayer.video.currentTime = 0;
				$('#timaat-video-seek-bar').val(0);
				TIMAAT.VideoPlayer.viewer.invalidateSize(true);				
				TIMAAT.UI.setWaiting(false);
				$(curVideo).off('canplay');
			});
			$(this.video).on('timeupdate', function(ev) {
				$('.videotime').html(TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true));		
				var value = (100 / TIMAAT.VideoPlayer.video.duration) * TIMAAT.VideoPlayer.video.currentTime;
				$('#timaat-video-seek-bar').val(value);
				$('#timaat-video-seek-bar').css('background',"linear-gradient(to right,  #ed1e24 0%,#ed1e24 "+value+"%,#939393 "+value+"%,#939393 100%)");
				// update annotation list UI
				// console.log("TCL: timeupdate -> TIMAAT.VideoPlayer.updateListUI()");
				TIMAAT.VideoPlayer.updateListUI("timeupdate");
				if (TIMAAT.VideoPlayer.curAnnotation) TIMAAT.VideoPlayer.animCtrl.updateUI();
				TIMAAT.VideoPlayer.updateUI();
			});
			TIMAAT.VideoPlayer.editAudioLayer = false;
			$('.timaat-button-videolayer').click();
		},
		
		setupMediumAnalysisLists: function (lists) {
			// console.log("TCL: setupMediumAnalysisLists: ", lists);
			// clear old lists if any
			$('#timaat-analysislist-chooser').empty();
			// setup model
			TIMAAT.VideoPlayer.model.analysisLists = lists;
			lists.forEach(function(list) {
				list.ui = $('<option value="'+list.id+'">'+TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'title')+'</option>');
				list.ui.data('list', list);
				$('#timaat-analysislist-chooser').append(list.ui);
			});			
			// setup segment model
			lists.forEach(function(list) {
				list.analysisSegmentsUI = Array();
				list.analysisSequencesUI = Array();
				list.analysisTakesUI = Array();
				list.analysisScenesUI = Array();
				list.analysisActionsUI = Array();
				list.analysisSegments.forEach(function(segment) {
					list.analysisSegmentsUI.push(new TIMAAT.AnalysisSegment(segment));
					segment.analysisSequences.forEach(function(sequence) {
						sequence.segmentId = segment.id;
						list.analysisSequencesUI.push(new TIMAAT.AnalysisSequence(sequence));
						sequence.analysisTakes.forEach(function(take) {
							take.sequenceId = sequence.id;
							list.analysisTakesUI.push(new TIMAAT.AnalysisTake(take));
						});
					});
					segment.analysisScenes.forEach(function(scene) {
						scene.segmentId = segment.id;
						list.analysisScenesUI.push(new TIMAAT.AnalysisScene(scene));
						scene.analysisActions.forEach(function(action) {
							action.sceneId = scene.id;
							list.analysisActionsUI.push(new TIMAAT.AnalysisAction(action));
						});
					});
				});
			});
			TIMAAT.VideoPlayer.sortTimelineSegmentElementStructure();

			// update UI
			$('#timaat-analysislist-options').prop('disabled', false);
			$('#timaat-analysislist-options').removeAttr('disabled');
			$('#timaat-analysislist-chooser').prop('disabled', false);
			$('#timaat-analysislist-chooser').removeAttr('disabled');
			if ( lists.length > 0 ) {
				if (TIMAAT.VideoPlayer.curAnalysisList ){
					TIMAAT.VideoPlayer.setupAnalysisList(TIMAAT.VideoPlayer.curAnalysisList);	
				} else {
					TIMAAT.VideoPlayer.setupAnalysisList(lists[0]);
				}
				TIMAAT.VideoPlayer.initAnalysisListMenu();
			}
			else {
				TIMAAT.VideoPlayer.setupAnalysisList(null);
				TIMAAT.VideoPlayer.initEmptyAnalysisListMenu();
			}
		},
		
		setupAnalysisList: function(analysisList) {
			// console.log("TCL: setupAnalysisList: ", analysisList);
			if ( TIMAAT.VideoPlayer.curAnnotation ) TIMAAT.VideoPlayer.curAnnotation.setSelected(false);

			// setup model
			TIMAAT.VideoPlayer.model.analysisList = analysisList;
			// close UI tag editors if any
			TIMAAT.UI.hidePopups();
			// clear polygon UI
			TIMAAT.VideoPlayer.viewer.annoLayer.eachLayer(function(layer) {layer.remove()});
			TIMAAT.VideoPlayer.viewer.editTools.editLayer.eachLayer(function(layer) {layer.remove()});

			// clear old list contents if any
			if (TIMAAT.VideoPlayer.curAnalysisList != null) {
				TIMAAT.VideoPlayer.annotationList.forEach(function(anno) {
					anno.remove();
				});
				TIMAAT.VideoPlayer.clearTimelineSegmentElementStructure();
			}
			TIMAAT.VideoPlayer.annotationList = [];
			TIMAAT.VideoPlayer.curAnalysisList = analysisList;
			// build annotation list from model
			if ( analysisList ) {
				analysisList.annotations.forEach(function(annotation) {
					TIMAAT.VideoPlayer.annotationList.push(new TIMAAT.Annotation(annotation));				
				});
			}
			TIMAAT.VideoPlayer.showTimelineSegmentElementStructure();
			// TIMAAT.VideoPlayer.selectAnnotation(null);
			// console.log("TCL: setupAnalysisList -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			
			// TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.inspector.setItem(TIMAAT.VideoPlayer.curAnalysisList, 'analysisList');
			TIMAAT.VideoPlayer.selectedElementType = 'analysisList';

			// setup analysisList UI
			$('#timaat-annotation-list-loader').hide();
			$('#timaat-videoplayer-annotation-add-button').prop('disabled', TIMAAT.VideoPlayer.curAnalysisList == null);
			if ( TIMAAT.VideoPlayer.curAnalysisList )
				$('#timaat-videoplayer-annotation-add-button').removeAttr('disabled');
			else
				$('#timaat-videoplayer-annotation-add-button').attr('disabled');
			$('#timaat-user-log-analysislist').prop('disabled', TIMAAT.VideoPlayer.curAnalysisList == null);
			if ( TIMAAT.VideoPlayer.curAnalysisList ) {
				$('#timaat-user-log-analysislist').removeAttr('disabled');
				// send notification to server
				TIMAAT.UI.sendNotification('subscribe-list', TIMAAT.VideoPlayer.curAnalysisList.id);
			} else {
				$('#timaat-user-log-analysislist').attr('disabled');
			}
		},
		
		userLogForList: function() {
			console.log("TCL: userLogForList: function()");
			$('#timaat-user-log-analysislist').popover('show');
		},
		
		addAnalysisList: function() {
			console.log("TCL: addAnalysisList: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.inspector.setItem(null, 'analysislist');			
		},
		
		updateAnalysisList: async function(analysislist) {
			console.log("TCL: updateAnalysisList - analysislist", analysislist);
			// sync to server
			await TIMAAT.AnalysisListService.updateMediumAnalysisList(analysislist);
			console.log("TCL: updateAnalysisList - analysislist", analysislist);
			// TODO update UI list view
			TIMAAT.VideoPlayer.curAnalysisList.ui.html(TIMAAT.Util.getDefTranslation(TIMAAT.VideoPlayer.curAnalysisList, 'mediumAnalysisListTranslations', 'title'));
		},

		editAnalysisList: function() {
			console.log("TCL: editAnalysisList: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.inspector.setItem(TIMAAT.VideoPlayer.curAnalysisList, 'analysislist');
			TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
		},
		
		removeAnalysisList: function() {
			console.log("TCL: removeAnalysisList: function()");
			if ( !this.curAnalysisList ) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-delete').data('analysislist', this.curAnalysisList);
			$('#timaat-videoplayer-analysislist-delete').modal('show');
		},
		
		addQuickAnnotation: function() {
			console.log("TCL: addQuickAnnotation: function()");
			if ( !TIMAAT.VideoPlayer.curAnalysisList ) return;
			TIMAAT.VideoPlayer.pause();
			let layerVisual = (TIMAAT.VideoPlayer.editAudioLayer) ? 0 : 1;
			TIMAAT.AnnotationService.createAnnotation(
					"Annotation bei "+TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime), 
					"Lesezeichen, noch zu bearbeiten",
					TIMAAT.VideoPlayer.video.currentTime*1000.0,
					TIMAAT.VideoPlayer.video.currentTime*1000.0,
					"5555554C", 
					1,
					layerVisual,
					TIMAAT.VideoPlayer.curAnalysisList.id, 
					TIMAAT.VideoPlayer._annotationAdded
			);
		},
		
		addAnnotation: function() {
			console.log("TCL: addAnnotation: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.inspector.setItem(null, 'annotation');
		},
		
		updateAnnotation: function(annotation) {
			console.log("TCL: updateAnnotation: annotation", annotation);
			// sync to server
			TIMAAT.AnnotationService.updateAnnotation(annotation.model);
			// update UI list view
			annotation.updateUI();
			this.updateUI();
			this.updateListUI();
			this.sortListUI();
		},
		
		updateAnnotations: function() {
			console.log("TCL: updateAnnotations: function()");
			if ( this.annotationList == null ) return;
			this.annotationList.forEach(function(annotation) {
				if ( annotation.isSelected() && annotation.hasChanges() ) {
					annotation.saveChanges();
					TIMAAT.AnnotationService.updateAnnotation(annotation.model);
					// update UI
					annotation.updateUI();
					console.log("TCL: annotation.updateUI()");
				}
			});

			// update UI list view
			this.updateListUI();
			this.sortListUI();
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
			// console.log("TCL: selectAnnotation: function(annotation)", annotation);
			if ( annotation ) {
				this.inspector.setItem(annotation, 'annotation');
				this.selectedElementType = 'annotation';
			}
			else {
				if (this.selectedElementType == 'annotation') {
					this.selectedElementType = null;
				}
        this.inspector.setItem(null);
			}
			if ( this.curAnnotation == annotation && annotation != null ) return;
			if ( this.curAnnotation ) this.curAnnotation.setSelected(false);
			this.curAnnotation = annotation;
			if ( this.curAnnotation ) {
				this.curAnnotation.setSelected(true);
				$('#timaat-videoplayer-annotation-remove-button').prop('disabled', false);
				$('#timaat-videoplayer-annotation-remove-button').removeAttr('disabled');
				// TIMAAT.URLHistory.setURL(null, 'Annotation · '+this.curAnnotation.model.title, '#analysis/'+this.curAnalysisList.id+'/annotation/'+this.curAnnotation.model.id);
			} else {
				$('#timaat-videoplayer-annotation-remove-button').prop('disabled', true);
				$('#timaat-videoplayer-annotation-remove-button').attr('disabled');
				// TIMAAT.URLHistory.setURL(null, 'Analysis · '+ this.curAnalysisList.mediumAnalysisListTranslations[0].title, '#analysis/'+this.curAnalysisList.id);
				// stop editing in progress
				if ( TIMAAT.VideoPlayer.viewer.editTools.drawing() ) {
					try {
						TIMAAT.VideoPlayer.viewer.editTools.stopDrawing();
					} catch(err) {};
				}
			}
			this.updateUI();
		},

		setCategorySet: function(categorySet) {
			console.log("TCL: setCategorySet: function(categorySet)");
			console.log("TCL: categorySet", categorySet);
			TIMAAT.VideoPlayer.curCategorySet = categorySet;
			TIMAAT.VideoPlayer.categoryAutocomplete.length = 0;
			if ( categorySet ) {
				$(categorySet.model.categories).each(function(index,category) {
					TIMAAT.VideoPlayer.categoryAutocomplete.push(category.name);
				});
			}
		},

		addAnalysisSegmentElement: function(type) {
			console.log("TCL: addAnalysisSegmentElement: function("+type+")");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.inspector.setItem(null, type);
		},
		
		removeAnalysisSegmentElement: function(type, data) {
			console.log("TCL: removeAnalysisSegmentElement: type, data", type, data);
			if (!data) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-segment-element-delete').data('type', type);
			$('#timaat-videoplayer-segment-element-delete').data('model', data.model);
			$('#timaat-videoplayer-segment-element-delete').find('.modal-title').html("Delete "+ type);
			$('#timaat-videoplayer-segment-element-delete').find('.modal-body').html("Do you want to delete the selected "+ type + "?");
			$('#timaat-videoplayer-segment-element-delete').modal('show');
		},

		updateAnalysisSegmentElement: async function(type, element) {
			console.log("TCL: updateAnalysisSegmentElement:function -> element", element);
			// sync to server
			await TIMAAT.AnalysisListService.updateSegmentElement(type, element.model);
			switch (type) {
				case 'segment':
					await TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI);
				break;
				case 'sequence':
					await TIMAAT.AnalysisListService.updateSegmentElementTranslation(type, element.model.analysisSequenceTranslations[0]);
					TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI);
				break;
				case 'take':
					await TIMAAT.AnalysisListService.updateSegmentElementTranslation(type, element.model.analysisTakeTranslations[0]);
					TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI);
				break;
				case 'scene':
					await TIMAAT.AnalysisListService.updateSegmentElementTranslation(type, element.model.analysisSceneTranslations[0]);
					TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI);
				break;
				case 'action':
					await TIMAAT.AnalysisListService.updateSegmentElementTranslation(type, element.model.analysisActionTranslations[0]);
					TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI);
				break;
			}

			// update UI list view
			element.updateUI();      
			this.updateListUI();
			if (type == 'segment') {
				this.sortListUI();
			}
		},

		offLinePublication: function() {
			let modal = $('#timaat-videoplayer-download-publication');
			modal.find('a.download-player-link').attr('href', 'api/medium/video/offline/'+this.model.video.id+'.html'+'?authtoken='+TIMAAT.Service.session.token);
			modal.find('a.download-video-link').attr('href', 'api/medium/video/'+this.model.video.id+'/download'+'?token='+this.model.video.viewToken+'&force=true');
			modal.modal('show');
		},

		managePublication: function() {
			TIMAAT.Service.getSinglePublication(TIMAAT.VideoPlayer.model.video.id).then(publication => {
				let modal = $('#timaat-videoplayer-publication');
				TIMAAT.VideoPlayer.publication = publication;
				TIMAAT.VideoPlayer._setupPublicationDialog(publication !=null, publication !=null && publication.access == 'protected');
				modal.find('.saveinfo').hide();
				modal.modal('show');
			}).catch(publication => {
				let modal = $('#timaat-videoplayer-publication');
				console.log("managePublication:fail", publication);
				TIMAAT.VideoPlayer.publication = publication;
				TIMAAT.VideoPlayer._setupPublicationDialog(publication !=null, publication !=null && publication.access == 'protected');
				modal.find('.saveinfo').hide();
				modal.modal('show');
			});
		},

		sortListUI: function() {
			// console.log("TCL: sortListUI: function()");
			$("#timaat-annotation-list li").sort(function (a, b) {
				if ( (parseFloat($(b).attr('data-starttime'))) < (parseFloat($(a).attr('data-starttime'))) ) return 1;
				if ( (parseFloat($(b).attr('data-starttime'))) > (parseFloat($(a).attr('data-starttime'))) ) return -1;
				if ( !$(b).hasClass('timaat-annotation-list-segment') && $(a).hasClass('timaat-annotation-list-segment') ) return -1;
				return 0;
			}).appendTo('#timaat-annotation-list');
			
			// sort annotation markers in timeline
			var sortedList = TIMAAT.VideoPlayer.annotationList.concat();
			sortedList.sort(function (a, b) {
				if ( b.startTime < a.startTime ) return 1;
				if ( b.startTime > a.startTime ) return -1;
				return 0;
			});
			
			// position annotation markers in timeline
			let layerVisual = ( TIMAAT.VideoPlayer.editAudioLayer ) ? 0 : 1;
			let maxOffset = 0;
			if ( sortedList.length > 0 ) {
				sortedList[0].marker.UIOffset = 0;
				for (let i=1; i < sortedList.length; i++) {
					let curOffset = 0;
					let occupiedOffets = [];
					for (var a=0; a < i; a++) if ( sortedList[a].endTime >= sortedList[i].startTime && sortedList[a].layerVisual == layerVisual ) {
						occupiedOffets.push(sortedList[a].marker.UIOffset);
						while ( occupiedOffets.indexOf(curOffset) >= 0 ) curOffset++;
					}
					sortedList[i].marker.UIOffset = curOffset;
					if ( curOffset > maxOffset ) maxOffset = curOffset;
				}
			}
			$('#timaat-timeline-marker-pane').css('height', (15+(maxOffset*12))+'px');
		},
		
		updateListUI: function(viaTimeUpdate = null) {
			// console.log("TCL: updateListUI: function()");
			if ( TIMAAT.VideoPlayer.curAnalysisList != null && TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI != null) 
				TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
					segment.updateStatus(TIMAAT.VideoPlayer.video.currentTime, viaTimeUpdate);
					if (TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI != null)
						TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.forEach(function(sequence) {
							sequence.updateStatus(TIMAAT.VideoPlayer.video.currentTime, viaTimeUpdate);
							if (TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI != null)
								TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.forEach(function(take) {
									take.updateStatus(TIMAAT.VideoPlayer.video.currentTime, viaTimeUpdate);
								});
						});
					if (TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI != null)
						TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.forEach(function(scene) {
							scene.updateStatus(TIMAAT.VideoPlayer.video.currentTime, viaTimeUpdate);
							if (TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI != null)
								TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.forEach(function(action) {
									action.updateStatus(TIMAAT.VideoPlayer.video.currentTime, viaTimeUpdate);
								});
						});
				});
			if (this.annotationList) for (let annotation of this.annotationList) annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
		},
		
		updateUI: function() {
			// console.log("TCL: updateUI: function()");
			var hasChanges = false;
			if ( this.curAnnotation && this.curAnnotation.hasChanges() ) hasChanges = true;
			TIMAAT.VideoPlayer.savePolygonCtrl.setEnabled(hasChanges);
			TIMAAT.VideoPlayer.animCtrl.updateUI();
			if ( this.curAnnotation && this.curAnnotation.isAnimation() )
				$('#timaat-timeline-keyframe-pane').show();
			else $('#timaat-timeline-keyframe-pane').hide();
			let enabled = this.curAnnotation && this.curAnnotation.isActive() && this.curAnnotation.isOnKeyframe();
			TIMAAT.VideoPlayer.editShapesCtrl.setEnabled(enabled);
			// $('.repeatbutton').prop('disabled', TIMAAT.VideoPlayer.curAnnotation == null );
		},

		refreshTimelineSegmentElementStructure: async function() {
			TIMAAT.VideoPlayer.clearTimelineSegmentElementStructure();
			TIMAAT.VideoPlayer.curAnalysisList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
			TIMAAT.VideoPlayer.createTimelineSegmentElementStructure();
			TIMAAT.VideoPlayer.sortTimelineSegmentElementStructure();
			TIMAAT.VideoPlayer.showTimelineSegmentElementStructure();
		},

		clearTimelineSegmentElementStructure: function() {
			if (TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI != null) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
					segment.removeUI();
				});
			}
			if (TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI != null) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.forEach(function(sequence) {
					sequence.removeUI();
				});
			}
			if (TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI != null) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.forEach(function(take) {
					take.removeUI();
				});
			}
			if (TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI != null) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.forEach(function(scene) {
					scene.removeUI();
				});
			}
			if (TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI != null) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.forEach(function(action) {
					action.removeUI();
				});
			}
			$('#timaat-timeline-segment-pane').hide();
			$('#timaat-timeline-sequence-pane').hide();
			$('#timaat-timeline-take-pane').hide();
			$('#timaat-timeline-scene-pane').hide();
			$('#timaat-timeline-action-pane').hide();
		},

		createTimelineSegmentElementStructure: function() {
			// setup segment model
			TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI = Array();
			TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI = Array();
			TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI = Array();
			TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI = Array();
			TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI = Array();
			TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.forEach(function(segment) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.push(new TIMAAT.AnalysisSegment(segment));
				segment.analysisSequences.forEach(function(sequence) {
					sequence.segmentId = segment.id;
					TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.push(new TIMAAT.AnalysisSequence(sequence));
					sequence.analysisTakes.forEach(function(take) {
						take.sequenceId = sequence.id;
						TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.push(new TIMAAT.AnalysisTake(take));
					});
				});
				segment.analysisScenes.forEach(function(scene) {
					scene.segmentId = segment.id;
					TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.push(new TIMAAT.AnalysisScene(scene));
					scene.analysisActions.forEach(function(action) {
						action.sceneId = scene.id;
						TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.push(new TIMAAT.AnalysisAction(action));
					});
				});
			});
		},

		sortTimelineSegmentElementStructure: function() {
			if (TIMAAT.VideoPlayer.curAnalysisList) {
				TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI);
				TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI);
				TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI);
				TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI);
				TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI);
			}
		},

		showTimelineSegmentElementStructure: function() {
			// build annotation list from model
			if (TIMAAT.VideoPlayer.curAnalysisList != null) {
				if (TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI != null) {
					TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
						segment.addUI();
						$('#timaat-timeline-segment-pane').show();
					});
					if (TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI != null) {
						TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.forEach(function(sequence) {
							sequence.addUI();
							$('#timaat-timeline-sequence-pane').show();
						});
						if (TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI != null) {
							TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.forEach(function(take) {
								take.addUI();
								$('#timaat-timeline-take-pane').show();
							});
						}
					}
					if (TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI != null) {
						TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.forEach(function(scene) {
							scene.addUI();
							$('#timaat-timeline-scene-pane').show();
						});
						if (TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI != null) {
							TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.forEach(function(action) {
								action.addUI();
								$('#timaat-timeline-action-pane').show();
							});
						}
					}
				}
			}
		},
		
		pause: function() {
			// console.log("TCL: pause: function()");
			if ( !this.video ) return;
			this.video.pause();
			let frameTime = 1.0 / TIMAAT.VideoPlayer.curFrameRate;
			let videoTime = TIMAAT.VideoPlayer.video.currentTime;
			let time = Math.round(TIMAAT.VideoPlayer.video.currentTime/frameTime) * frameTime;
//			if ( videoTime != time ) TIMAAT.VideoPlayer.jumpTo(time);
			$('.playbutton').removeClass('active');
		},

		play: function() {
			// console.log("TCL: play: function()");
			if ( !this.video ) return;
			this.video.play();
			$('.playbutton').addClass('active');			
		},
		
		jumpTo: function(time) {
			// console.log("TCL: jumpTo: function(time)", time);
			if ( !this.video ) return;
			this.video.currentTime = time;
			// this.updateListUI(); // obsolete as updateListUI() is called within on(timeupdate), which is also called upon clicking within the time slider
		},
		
		jumpVisible: function(start, end) {
			// console.log("TCL: jumpVisible: function(start, end)", start, end);
			if ( !this.video ) return;
			var curTime = this.video.currentTime;
			if ( curTime < start || curTime >= end ) this.video.currentTime = start;
			// this.updateListUI(); // obsolete as on timeupdate is called afterward
		},

		initEmptyAnalysisListMenu: function() {
			$('#timaat-analysislist-chooser').append('<option>keine Analyse vorhanden</option');
			$('#timaat-analysislist-chooser').addClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').addClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').removeAttr('onclick');
			$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
			$('#timaat-analysislist-delete').removeAttr('onclick');
			$('#timaat-annotation-add').addClass("timaat-item-disabled");
			$('#timaat-annotation-add').removeAttr('onclick');
			$('.timaat-segment-structure-add').addClass("timaat-item-disabled");
			$('.timaat-segment-structure-add').removeAttr('onclick');
			$('#timaat-medium-offlinepublication').addClass("timaat-item-disabled");
			$('#timaat-medium-offlinepublication').removeAttr('onclick');
			// $('#timaat-videoplayer-annotation-quickadd-button').prop('disabled', true);
			// $('#timaat-videoplayer-annotation-quickadd-button').attr('disabled');
			$('.leaflet-control-container').hide();
		},

		initAnalysisListMenu: function() {
			$('#timaat-analysislist-chooser').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').attr('onclick','TIMAAT.VideoPlayer.editAnalysisList()');
			$('#timaat-analysissegment-add').removeClass("timaat-item-disabled");
			$('#timaat-analysissegment-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("segment")');
			$('#timaat-annotation-add').removeClass("timaat-item-disabled");
			$('#timaat-annotation-add').attr('onclick','TIMAAT.VideoPlayer.addAnnotation()');
			$('#timaat-analysislist-delete').removeClass("timaat-item-disabled");
			$('#timaat-analysislist-delete').attr('onclick','TIMAAT.VideoPlayer.removeAnalysisList()');
			$('#timaat-medium-offlinepublication').removeClass("timaat-item-disabled");
			$('#timaat-medium-offlinepublication').attr('onclick','TIMAAT.VideoPlayer.offLinePublication()');
			// $('#timaat-videoplayer-annotation-quickadd-button').prop('disabled', false);
			// $('#timaat-videoplayer-annotation-quickadd-button').removeAttr('disabled');
			$('.leaflet-control-container').show();
		},
		
		_updatePublicationSettings: function() {
			let dialog = $('#timaat-videoplayer-publication');
			let enabled = $('#timaat-publish-video-switch').prop('checked');
			let restricted = $('#timaat-publication-protected-switch').prop('checked');
			let username = ( dialog.find('.username').val() && restricted ) ? dialog.find('.username').val() : '';
			let password = ( dialog.find('.password').val() && restricted ) ? dialog.find('.password').val() : '';
			$('#timaat-publication-settings-submit').prop('disabled', true);
			$('#timaat-publication-settings-submit i.login-spinner').removeClass('d-none');
			if ( enabled ) {
				let publication = (TIMAAT.VideoPlayer.publication) ? TIMAAT.VideoPlayer.publication : { id: 0 };
				publication.access = (restricted) ? 'protected' : 'public';
				publication.collectionId = null;
				publication.ownerId = TIMAAT.Service.session.id;
				publication.settings = null;
				publication.slug = TIMAAT.Util.createUUIDv4();
				publication.startMediumId = TIMAAT.VideoPlayer.model.video.id;
				publication.title = dialog.find('.publicationtitle').val();
				publication.credentials = JSON.stringify({
					scheme: 'password',
					user: username,
					password: password,
				});
				TIMAAT.Service.updateSinglePublication(publication).then(publication => {
					TIMAAT.VideoPlayer.publication = publication;
					TIMAAT.VideoPlayer._setupPublicationDialog(publication !=null, publication !=null && publication.access == 'protected');
					$('#timaat-publication-settings-submit').prop('disabled', false);
					$('#timaat-publication-settings-submit i.login-spinner').addClass('d-none');
					dialog.find('.saveinfo').show().delay(1000).fadeOut();
				}).catch( e => {
					$('#timaat-publication-settings-submit').prop('disabled', false);
					$('#timaat-publication-settings-submit i.login-spinner').addClass('d-none');
				})
			} else {
				TIMAAT.Service.deleteSinglePublication(TIMAAT.VideoPlayer.model.video.id).then(status => {
					TIMAAT.VideoPlayer.publication = null;
					TIMAAT.VideoPlayer._setupPublicationDialog(false, false);
					$('#timaat-publication-settings-submit').prop('disabled', false);
					$('#timaat-publication-settings-submit i.login-spinner').addClass('d-none');
					dialog.find('.saveinfo').show().delay(1000).fadeOut();
				}).catch( e => {
					$('#timaat-publication-settings-submit').prop('disabled', false);
					$('#timaat-publication-settings-submit i.login-spinner').addClass('d-none');
				})
			}

		},
		
		_setupPublicationDialog: function(enabled, restricted) {
			$('#timaat-publish-video-switch').prop('checked', enabled);
			$('#timaat-publication-protected-switch').prop('checked', restricted);
			let credentials = {};
			try {
				credentials = JSON.parse(TIMAAT.VideoPlayer.publication.credentials);
			} catch (e) { credentials = {}; }
			let dialog = $('#timaat-videoplayer-publication');
			let title = ( TIMAAT.VideoPlayer.publication ) ? TIMAAT.VideoPlayer.publication.title : '';
			let username = ( credentials.user && enabled ) ? credentials.user : '';
			let password = ( credentials.password && enabled ) ? credentials.password : '';
			let url = ( TIMAAT.VideoPlayer.publication ) ? window.location.protocol+'//'+window.location.host+window.location.pathname+'publication/'+TIMAAT.VideoPlayer.publication.slug+'/' : '';
			dialog.find('.protectedicon').removeClass('fa-lock').removeClass('fa-lock-open');
			if ( restricted ) dialog.find('.protectedicon').addClass('fa-lock'); else dialog.find('.protectedicon').addClass('fa-lock-open');
			
			
			dialog.find('.publicationtitle').prop('disabled', !enabled);
			dialog.find('#timaat-publication-protected-switch').prop('disabled', !enabled);
			dialog.find('.username').prop('disabled', !enabled || !restricted);
			dialog.find('.username').val(username);
			dialog.find('.password').prop('disabled', !enabled || !restricted);
			dialog.find('.password').val(password);
			dialog.find('.password').attr('type', 'password');
			$('#timaat-publication-settings-submit').prop('disabled', enabled && restricted && username == '' && password == '');

			if ( enabled ) {
				dialog.find('.publicationtitle').val(title);
				if ( url.length > 0 ) url = '<a href="'+url+'" target="_blank">'+url+'</a>'; 
				else url = '- Publikationslink nach dem Speichern verfügbar -';
				dialog.find('.publicationurl').html(url);
			} else {
				dialog.find('.publicationtitle').val('');
				dialog.find('.publicationurl').html('- Video nicht publiziert -');
			}
			
		},
		
		_updateAnimations: function() {
			if ( !TIMAAT.VideoPlayer.video || TIMAAT.VideoPlayer.video.paused || !TIMAAT.VideoPlayer.annotationList || !TIMAAT.VideoPlayer.curAnalysisList ) return;
			
			// repeat video section if control activated
			if ( TIMAAT.VideoPlayer.repeatSection ) {
				if ( TIMAAT.VideoPlayer.curAnnotation ) {
					// repeat annotation
					if ( TIMAAT.VideoPlayer.video.currentTime < TIMAAT.VideoPlayer.curAnnotation.startTime
							|| TIMAAT.VideoPlayer.video.currentTime > TIMAAT.VideoPlayer.curAnnotation.endTime )
							TIMAAT.VideoPlayer.jumpTo(TIMAAT.VideoPlayer.curAnnotation.startTime);
				} else {
					// repeat segment
					let curSegment = null;
					for (let index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.length-1; index >= 0; index-- ) {
						let segment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
						if (segment.active) { curSegment = segment; break; }
					}

					if ( curSegment ) {
						if ( TIMAAT.VideoPlayer.video.currentTime < curSegment.model.startTime/1000.0
								|| TIMAAT.VideoPlayer.video.currentTime > curSegment.model.endTime/1000.0 )
								TIMAAT.VideoPlayer.jumpTo(curSegment.model.startTime/1000.0);
					}
				}
			} 
				
			for (let annotation of TIMAAT.VideoPlayer.annotationList)
				annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
		},
		
		_analysislistAdded: function(analysislist) {
			console.log("TCL: _analysislistAdded: function(analysislist) - analysislist", analysislist);
			console.log("TCL ~ TIMAAT.VideoPlayer.model", TIMAAT.VideoPlayer.model);
			var wasEmpty = TIMAAT.VideoPlayer.model.analysisLists.length == 0;
			TIMAAT.VideoPlayer.model.analysisLists.push(analysislist);
			
			analysislist.ui = $('<option value="'+analysislist.id+'">'+TIMAAT.Util.getDefTranslation(analysislist, 'mediumAnalysisListTranslations', 'title')+'</option>');
			analysislist.ui.data('list', analysislist);
			
			// update UI
			if ( wasEmpty ) $('#timaat-analysislist-chooser').empty();			
			$('#timaat-analysislist-chooser').append(analysislist.ui);
			$('#timaat-analysislist-chooser').val(analysislist.id);

			$('#timaat-analysislist-chooser').trigger('change');
			// TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			TIMAAT.VideoPlayer.inspector.close();
			TIMAAT.VideoPlayer.initAnalysisListMenu();
		},
		
		_analysislistRemoved: function(analysislist) {
			console.log("TCL: _analysislistRemoved: function(analysislist)");
			console.log("TCL: analysislist", analysislist);
			// sync to server
			TIMAAT.AnalysisListService.removeAnalysisList(analysislist);

			// remove from model lists
			var index = TIMAAT.VideoPlayer.model.analysisLists.indexOf(analysislist);
			if (index > -1) TIMAAT.VideoPlayer.model.analysisLists.splice(index, 1);
			
			// update UI list view
			$('#timaat-analysislist-chooser').find('[value="'+analysislist.id+'"]').remove();
			$('#timaat-analysislist-chooser').trigger('change');
			if ( TIMAAT.VideoPlayer.model.analysisLists.length == 0 ) {
				TIMAAT.VideoPlayer.setupAnalysisList(null);
				TIMAAT.VideoPlayer.initEmptyAnalysisListMenu();
				// TIMAAT.URLHistory.setURL(null, 'Video Player', '#analysis');
			}
			// update annotation UI
		},
		
		_annotationAdded: function(annotation, openInspector=true) {
			console.log("TCL: _annotationAdded: function(annotation)");
			console.log("TCL: annotation", annotation);
			TIMAAT.VideoPlayer.annotationList.push(annotation);
			TIMAAT.VideoPlayer.curAnalysisList.annotations.push(annotation.model);
			annotation.updateUI();
			console.log("TCL: annotation.updateUI()");
			annotation.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
			console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			if ( openInspector ) TIMAAT.VideoPlayer.selectAnnotation(annotation);
		},
		
		_annotationRemoved: function(annotation) {
			console.log("TCL: _annotationRemoved: function(annotation)");
			console.log("TCL: annotation", annotation);
			// sync to server
			TIMAAT.AnnotationService.removeAnnotation(annotation);
			var index = TIMAAT.VideoPlayer.annotationList.indexOf(annotation);
			if (index > -1) TIMAAT.VideoPlayer.annotationList.splice(index, 1);
			// remove from model list
			var anno = TIMAAT.VideoPlayer.curAnalysisList.annotations.find(x => x.id === annotation.model.id);
			index = TIMAAT.VideoPlayer.curAnalysisList.annotations.indexOf(anno);
			if (index > -1) TIMAAT.VideoPlayer.curAnalysisList.annotations.splice(index, 1);

			// update UI list view
			annotation.remove();
			console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			TIMAAT.VideoPlayer.selectAnnotation(null);
		},
		
		_segmentAdded: function(segment, openInspector=true) {
			console.log("TCL: _segmentAdded: function(segment)", segment);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.push(segment);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI);
			TIMAAT.VideoPlayer.jumpTo(segment.model.startTime/1000.0);
			TIMAAT.VideoPlayer.selectedElementType = 'segment';
			segment.addUI();
			TIMAAT.VideoPlayer.curSegment = segment;
			TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.replace('bg-info', 'bg-primary');
			TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.add('bg-primary');

			if ( openInspector ) {
				TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(segment, 'segment');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-segment-pane').show();
			console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

		_sequenceAdded: function(sequence, openInspector=true) {
			console.log("TCL: _sequenceAdded: function(sequence)", sequence);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.push(sequence);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI);
			TIMAAT.VideoPlayer.jumpTo(sequence.model.startTime/1000.0);
			TIMAAT.VideoPlayer.selectedElementType = 'sequence';
			sequence.addUI();
			TIMAAT.VideoPlayer.curSequence = sequence;
			TIMAAT.VideoPlayer.curSequence.timelineView[0].classList.replace('bg-info', 'bg-primary');
			TIMAAT.VideoPlayer.curSequence.timelineView[0].classList.add('bg-primary');

			if ( openInspector ) {
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(sequence, 'sequence');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-sequence-pane').show();
			console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

		_takeAdded: function(take, openInspector=true) {
			console.log("TCL: _takeAdded: function(take)", take);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.push(take);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI);
			TIMAAT.VideoPlayer.jumpTo(take.model.startTime/1000.0);
			TIMAAT.VideoPlayer.selectedElementType = 'take';
			take.addUI();
			TIMAAT.VideoPlayer.curTake = take;
			TIMAAT.VideoPlayer.curTake.timelineView[0].classList.replace('bg-info', 'bg-primary');
			TIMAAT.VideoPlayer.curTake.timelineView[0].classList.add('bg-primary');

			if ( openInspector ) {
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(take, 'take');

				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-take-pane').show();
			console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

		_sceneAdded: function(scene, openInspector=true) {
			console.log("TCL: _sceneAdded: function(scene)", scene);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.push(scene);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI);
			TIMAAT.VideoPlayer.jumpTo(scene.model.startTime/1000.0);
			TIMAAT.VideoPlayer.selectedElementType = 'scene';
			scene.addUI();
			TIMAAT.VideoPlayer.curScene = scene;
			TIMAAT.VideoPlayer.curScene.timelineView[0].classList.replace('bg-info', 'bg-primary');
			TIMAAT.VideoPlayer.curScene.timelineView[0].classList.add('bg-primary');

			if ( openInspector ) {
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(scene, 'scene');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-scene-pane').show();
			console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

		_actionAdded: function(action, openInspector=true) {
			console.log("TCL: _actionAdded: function(action)", action);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.push(action);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI);
			TIMAAT.VideoPlayer.jumpTo(action.model.startTime/1000.0);
			TIMAAT.VideoPlayer.selectedElementType = 'action';
			action.addUI();
			TIMAAT.VideoPlayer.curAction = action;
			TIMAAT.VideoPlayer.curAction.timelineView[0].classList.replace('bg-info', 'bg-primary');
			TIMAAT.VideoPlayer.curAction.timelineView[0].classList.add('bg-primary');

			if ( openInspector ) {
				// TIMAAT.VideoPlayer.selectAnnotation(null);
				TIMAAT.VideoPlayer.inspector.setItem(action, 'action');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-action-pane').show();
			console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

	}

}, window));
