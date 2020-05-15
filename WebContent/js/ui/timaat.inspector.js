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
	
	TIMAAT.Inspector = class Inspector {
		constructor(viewer) {
			console.log('TCL: Inspector -> constructor');
			
			// init sidebar control
			this._viewer = viewer;
			this._inspector = L.control.sidebar({
				autopan: false,
				container: 'timaat-inspector',
				closeButton: true,
				position: 'right',
			}).addTo(viewer);
			
			// init state system
			this.state = {
					item: null,
					type: null,
			}
			
			// init UI
			this.ui = {};
			this.ui.addAnimButton = $('#timaat-inspector-animation-add-button');
			this.ui.removeAnimButton = $('#timaat-inspector-animation-delete-button');
			this.ui.keyframeList = $('#timaat-inspector-animation-keyframes');
			let inspector = this;
			
			// actors panel
			this.ui.actorlang = {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "",
					"searchPlaceholder": "Suche Actors",
					"processing"  : '<i class="fas fa-spinner fa-spin"></i> Lade Daten...',
					"lengthMenu"  : "Zeige _MENU_ Einträge",
					"zeroRecords" : "Keine Actors gefunden.",
					"info"        : "Seite _PAGE_ / _PAGES_ &middot; (_MAX_ gesamt)",
					"infoEmpty"   : "Keine Actors gefunden.",
					"infoFiltered": '&mdash; <i class="fas fa-search"></i> _TOTAL_',
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					}
			};

			this.ui.dataTableActors = $('#timaat-inspector-actors-pane .actors-available').DataTable({
				lengthChange	: false,
				dom				: 'rft<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
//				dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				pageLength		: 3,
				deferLoading	: 0,
				pagingType		: 'full',
				order			: [[ 0, 'asc' ]],
				processing		: true,
				serverSide		: true,
				ajax			: {
					"url"        : "api/actor/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;
						if ( inspector.state.item && inspector.state.type == 'annotation' )
							serverData.exclude_annotation = inspector.state.item.model.id;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) { return data.data; }
				},
				"createdRow": function(row, data, dataIndex) {
					let actorElement = $(row);
					let actor = data;
					actorElement.data('actor', actor);

					actorElement.find('.add-actor').on('click', actor, function(ev) {
						ev.stopPropagation();
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.Service.addAnnotationActor(TIMAAT.VideoPlayer.curAnnotation.model.id, actor.id)
						.then((result)=>{
							inspector.ui.dataTableActors.ajax.reload();
							inspector.ui.dataTableAnnoActors.ajax.reload();
						}).catch((error)=>{
							console.log("ERROR:", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, actor, meta) {
						// console.log("TCL: actor", actor);
						let displayActorTypeIcon = '';
						switch (actor.actorType.actorTypeTranslations[0].type) {
							case 'person': 
								displayActorTypeIcon = '<i class="far fa-address-card"></i>';
							break;
							case 'collective': 
								displayActorTypeIcon = '<i class="fas fa-users"></i>';
							break;
						}
						let nameDisplay = `<p>` + displayActorTypeIcon + `  ` + actor.displayName.name +`
						<span class="add-actor badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw"></i></span>
						</p>`;
						if (actor.birthName != null && actor.displayName.id != actor.birthName.id) {
							nameDisplay += `<p><i>(BN: `+actor.birthName.name+`)</i></p>`;
						}
						actor.actorNames.forEach(function(name) { // make additional names searchable in actorlibrary
							if (name.id != actor.displayName.id && (actor.birthName == null || name.id != actor.birthName.id)) {
								nameDisplay += `<div style="display:none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				language: this.ui.actorlang,
			});
//			$(this.ui.dataTableActors.table().container()).find('.table-title').text('Verfügbare Actors');
			
			this.ui.dataTableAnnoActors = $('#timaat-inspector-actors-pane .actors-annotation').DataTable({
				lengthChange	: false,
				pageLength		: 10,
				dom				: 'rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
//				dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				searching		: false,
				deferLoading	: 0,
				order			: [[ 0, 'asc' ]],
				processing		: true,
				serverSide		: true,
				ajax			: {
					"url"        : "api/annotation/0/actors",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							as_datatable: true,
						}
//						if ( data.search && data.search.value && data.search.value.length > 0 ) serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token); },
					"dataSrc": function(data) { return data.data; }
				},
				"createdRow": function(row, data, dataIndex) {
					let actorElement = $(row);
					let actor = data;
					actorElement.data('actor', actor);

					actorElement.find('.remove-actor').on('click', actor, function(ev) {
						ev.stopPropagation();
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.Service.removeAnnotationActor(TIMAAT.VideoPlayer.curAnnotation.model.id, actor.id)
						.then((result)=>{
							inspector.ui.dataTableActors.ajax.reload();
							inspector.ui.dataTableAnnoActors.ajax.reload();
						}).catch((error)=>{
							console.log("ERROR:", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, actor, meta) {
						// console.log("TCL: actor", actor);
						let displayActorTypeIcon = '';
						switch (actor.actorType.actorTypeTranslations[0].type) {
							case 'person': 
								displayActorTypeIcon = '<i class="far fa-address-card"></i>';
							break;
							case 'collective': 
								displayActorTypeIcon = '<i class="fas fa-users"></i>';
							break;
						}
						let nameDisplay = `<p>` + displayActorTypeIcon + `  ` + actor.displayName.name +`
						<span class="remove-actor badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw"></i></span>
						</p>`;
						if (actor.birthName != null && actor.displayName.id != actor.birthName.id) {
							nameDisplay += `<p><i>(BN: `+actor.birthName.name+`)</i></p>`;
						}
						actor.actorNames.forEach(function(name) { // make additional names searchable in actorlibrary
							if (name.id != actor.displayName.id && (actor.birthName == null || name.id != actor.birthName.id)) {
								nameDisplay += `<div style="display:none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				language: this.ui.actorlang,
			});

			
			
			// attach listeners
			$('#timaat-inspector-meta-submit').click(function(ev) {
				if ( !inspector.state.type ) return;
				// annotations
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					var title = $("#timaat-inspector-meta-title").val();
					var opacity = $("#timaat-inspector-meta-opacity").val();
					var layerVisual = 1;
					if ( $('#timaat-inspector-meta-type-group .timaat-inspector-meta-audiolayer').hasClass('btn-secondary') ) layerVisual = 0;
					var comment = $("#timaat-inspector-meta-comment").val();
					var startTime = TIMAAT.Util.parseTime($("#timaat-inspector-meta-start").val());
					var endTime = TIMAAT.Util.parseTime($("#timaat-inspector-meta-end").val());
					var color = inspector.cp.colorHex.substring(1);
					if (anno) {
						anno.model.title = title;
						anno.model.comment = comment;
						anno.model.sequenceStartTime = startTime*1000.0;
						anno.model.sequenceEndTime = endTime*1000.0;
						anno.svg.color = color;
						anno.opacity = opacity;
						anno.layerVisual = layerVisual;
						anno.saveChanges();
						TIMAAT.VideoPlayer.updateAnnotation(anno);
					} else {
						TIMAAT.Service.createAnnotation(title, comment, startTime*1000.0, endTime*1000.0, color, 1, layerVisual, TIMAAT.VideoPlayer.curList.id, TIMAAT.VideoPlayer._annotationAdded);
					}
				}
				// analysis lists
				if ( inspector.state.type == 'analysislist' ) {
					var list = inspector.state.item;
					var title = $("#timaat-inspector-meta-title").val();
					var comment = $("#timaat-inspector-meta-comment").val();				
					if (list) {
						TIMAAT.Util.setDefTranslation(TIMAAT.VideoPlayer.curList, 'mediumAnalysisListTranslations', 'title', title);
						TIMAAT.Util.setDefTranslation(TIMAAT.VideoPlayer.curList, 'mediumAnalysisListTranslations', 'text', comment);
						TIMAAT.VideoPlayer.updateAnalysislist(TIMAAT.VideoPlayer.curList);
						inspector.close();
					} else {
						TIMAAT.Service.createAnalysislist(title, comment, TIMAAT.VideoPlayer.model.video.id, TIMAAT.VideoPlayer._analysislistAdded);
					}
				}
				// analysis segments
				if ( inspector.state.type == 'analysissegment' ) {
					var segment = inspector.state.item;
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
			
			// setup annotation metadata UI and events
			$('#timaat-inspector-meta-colorPicker').tinycolorpicker();
			this.cp = $('#timaat-inspector-meta-colorPicker').data("plugin_tinycolorpicker");
			this.cp.setColor('rgb(3, 145, 206)');

			$('#timaat-inspector-meta-title').on('input', function(ev) {
				if ( $("#timaat-inspector-meta-title").val().length > 0 ) {
					$('#timaat-inspector-meta-submit').prop("disabled", false);
					$('#timaat-inspector-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-inspector-meta-submit').prop("disabled", true);
					$('#timaat-inspector-meta-submit').attr("disabled");
				}
			});

			$('#timaat-inspector-meta-opacity').on('change input', function(ev) {
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					if ( !anno ) return;
					var opacity = $("#timaat-inspector-meta-opacity").val();
					anno.opacity = opacity;
					if ( opacity == 0 && anno.stroke == 0 ) $('#timaat-inspector-meta-outline').trigger('click');
				}
			});
			
			$('#timaat-inspector-meta-outline').on('click', function(ev) {
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					var stroke = $(this).hasClass('btn-primary') ? 0 : 2;
					
					if ( anno.opacity == 0 && stroke == 0 ) return; 
					anno.stroke = stroke;
					
					inspector._setInspectorStroke(anno.stroke);
				}
			});
			
			$('#timaat-inspector-meta-type-group .timaat-inspector-meta-videolayer').on('click', function(ev) {
				var anno = inspector.state.item;
				if ( anno ) anno.layerVisual = 1;
				inspector._setInspectorAnnotationType( (anno) ? anno.layerVisual : 1 );
			});
			$('#timaat-inspector-meta-type-group .timaat-inspector-meta-audiolayer').on('click', function(ev) {
				var anno = inspector.state.item;
				if ( anno ) anno.layerVisual = 0;
				inspector._setInspectorAnnotationType( (anno) ? anno.layerVisual : 0 );
			});
			
			$('#timaat-inspector-meta-start,#timaat-inspector-meta-end').on('blur change', function(ev) {
				var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
				startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
				endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
				$("#timaat-inspector-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
				$("#timaat-inspector-meta-end").val(TIMAAT.Util.formatTime(endTime, true));			
				
				if ( inspector.state.item && inspector.state.type == 'annotation' ) {
					inspector.state.item.startTime = startTime;
					inspector.state.item.endTime = endTime;
					inspector.state.item.marker.updateView();
				}
			});
			
			$('#timaat-inspector-meta-setstart').click(function() {
				var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
				var duration = endTime-startTime;
				duration = Math.max(0,Math.min(duration, TIMAAT.VideoPlayer.video.duration));
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
			$('#timaat-inspector-meta-duration').change(function(ev) {
				var time = parseInt($(this).val());
				if ( ! isNaN(time) ) inspector.setMetaEnd(time);
				$(this).parent().click();
			});
			// animation panel listeners
			this.ui.addAnimButton.on('click', function(ev) {
				if ( TIMAAT.VideoPlayer.curAnnotation && !TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
					TIMAAT.VideoPlayer.pause();
					let anno = TIMAAT.VideoPlayer.curAnnotation;
					anno.addKeyframeAt(anno.endTime);
				}
			});
			this.ui.removeAnimButton.on('click', function(ev) {
				if ( TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
					TIMAAT.VideoPlayer.pause();
					let anno = TIMAAT.VideoPlayer.curAnnotation;
					anno.removeAnimationKeyframes();
					anno.updateStatus(TIMAAT.VideoPlayer.video.currentTime);
					TIMAAT.VideoPlayer.updateUI();
					inspector.updateItem();
				}
			});
			

		}
		
		get isOpen() {
			return !$('#timaat-inspector').hasClass('collapsed');
		}
		
		reset() {
			this.setItem(null);
			this.ui.dataTableActors.clear();
			this.ui.dataTableActors.ajax.reload();
		}
		
		switchPosition() {
			if ( this.getPosition() == 'left' ) {
				this.setPosition('right');
				$('#timaat-inspector').removeClass('leaflet-sidebar-left');
				$('.leaflet-sidebar-close i').attr('class', 'fa fa-caret-right');
			} else {
				this.setPosition('left');
				$('#timaat-inspector').removeClass('leaflet-sidebar-right');
				$('.leaflet-sidebar-close i').attr('class', 'fa fa-caret-left');
			}
		}		

		setItem(item, type=null) {
			this.state.item = item;
			this.state.type = type;
			
			// metadata panel default UI setting
			$('#timaat-inspector-meta-start').prop('disabled', false);
			$('#timaat-inspector-meta-setstart').prop('disabled', false);
			$('#timaat-inspector-meta-end').prop('disabled', false);
			$('#timaat-inspector-meta-setend').prop('disabled', false);
			$('#timaat-inspector-meta-setend-dropdown').prop('disabled', false);
			
			// animation panel default UI setting
			this.disablePanel('timaat-inspector-animation');
			this.disablePanel('timaat-inspector-tags');
			this.disablePanel('timaat-inspector-actors');
			this.disablePanel('timaat-inspector-events');
			this.disablePanel('timaat-inspector-locations');
			this.ui.keyframeList.children().detach();
			
			// actors panel default UI setting
			this.ui.dataTableAnnoActors.ajax.url('api/annotation/0/actors');

			if ( !type ) {
				if ( this.isOpen ) this.open('timaat-inspector-metadata');
				this.disablePanel('timaat-inspector-metadata');
				$('#timaat-inspector-metadata-title').html('Kein Element ausgewählt');
			} else {
				this.enablePanel('timaat-inspector-metadata');
				// annotations
				if ( type == 'annotation' ) {
					// animation panel
					this.enablePanel('timaat-inspector-animation');
					if ( item != null ) {
						this.enablePanel('timaat-inspector-tags');
						this.enablePanel('timaat-inspector-actors');
						this.enablePanel('timaat-inspector-events');
						this.enablePanel('timaat-inspector-locations');
					}
					// metadata panel
					$('#timaat-inspector-meta-color-group').show();
					$('#timaat-inspector-meta-opacity-group').show();
					$('#timaat-inspector-meta-type-group').show();
					$('#timaat-inspector-meta-timecode-group').show();
					if (item) {
						$('#timaat-inspector-meta-start').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-setstart').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-end').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-setend').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-setend-dropdown').prop('disabled', item.isAnimation());
					}
					$('#timaat-inspector-meta-comment-group').show();
					var anno = item;
					var heading = (anno) ? "Annotation bearbeiten" : "Annotation hinzufügen";
					var submit = (anno) ? "Speichern" : "Hinzufügen";
					var color = (anno) ? anno.svg.color : this.cp.colorHex.substring(1);
					color = color.substring(0,6);
					var title = (anno) ? anno.model.title : "";
					var opacity = (anno) ? anno.opacity : 0.3;
					var stroke = (anno) ? anno.stroke : 2;
					var layerVisual = (anno) ? anno.layerVisual : (TIMAAT.VideoPlayer.editAudioLayer) ? 0 : 1;
					var comment = (anno) ? anno.model.comment : "";
					var start = (anno) ? TIMAAT.Util.formatTime(anno.model.sequenceStartTime/1000.0,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
					var end = (anno) ? TIMAAT.Util.formatTime(anno.model.sequenceEndTime/1000.0,true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime,true);
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					this.cp.setColor('#'+color);
					$("#timaat-inspector-meta-title").val(title).trigger('input');
					$("#timaat-inspector-meta-opacity").val(opacity);
					this._setInspectorStroke(stroke);
					this._setInspectorAnnotationType(layerVisual);
					$("#timaat-inspector-meta-comment").val(comment);
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);	
					if ( !anno ) this.open('timaat-inspector-metadata');
					else this.updateItem();
					
					// actors panel
					this.ui.dataTableAnnoActors.ajax.url('api/annotation/'+item.model.id+'/actors');
					this.ui.dataTableAnnoActors.ajax.reload();
					this.ui.dataTableActors.ajax.reload();
				}
				// analysis lists
				if ( type == 'analysislist' ) {
					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').hide();
					$('#timaat-inspector-meta-comment-group').show();
					var list = item;
					if ( !list ) this.open('timaat-inspector-metadata');
					var heading = (list) ? '<i class="fas fa-list-alt"></i> Liste bearbeiten' : '<i class="fas fa-list-alt"></i> Liste hinzufügen';
					var submit = (list) ? "Speichern" : "Hinzufügen";
					var title = (list) ? TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'title') : "";
					var comment = (list) ? TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'text') : "";
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-title").val(title).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment);				
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
				}
				// analysis segments
				if ( type == 'analysissegment' ) {
					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-comment-group').hide();
					var segment = item;
					if ( !segment ) this.open('timaat-inspector-metadata');
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
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
				}
			}
		}
		
		updateItem() {
			if ( !this.state.item ) return;
			if (  this.state.type == 'annotation' ) {
				var start = TIMAAT.Util.formatTime(this.state.item.startTime,true);
				var end = TIMAAT.Util.formatTime(this.state.item.endTime,true);
				// update UI
				// metadata panel
				$("#timaat-inspector-meta-start").val(start);
				$("#timaat-inspector-meta-end").val(end);
				
				// animation panel
				if ( this.state.item.isAnimation() ) {
					this.ui.addAnimButton.hide();
					this.ui.removeAnimButton.show();
				} else {
					this.ui.addAnimButton.show();
					this.ui.addAnimButton.prop('disabled', this.state.item.length == 0);
					this.ui.removeAnimButton.hide();
				}
				// set keyframes
				this.ui.keyframeList.children().detach();
				for (let keyframe of this.state.item.svg.keyframes)
					this.ui.keyframeList.append(keyframe.ui.inspectorView);
			} else
			if (  this.state.type == 'analysissegment' ) {
				let title = this.state.item.model.analysisSegmentTranslations[0].name;
				let startTime = this.state.item.model.startTime;
				let endTime = this.state.item.model.endTime;
				let start = TIMAAT.Util.formatTime(startTime, true);
				let end = TIMAAT.Util.formatTime(endTime, true);
				// setup UI from Video Player state
				$("#timaat-inspector-meta-title").val(title);
				$("#timaat-inspector-meta-start").val(start);
				$("#timaat-inspector-meta-end").val(end);
			}

		};
		
		setMetaEnd(time) {
//			console.log("TCL: setMetaEnd: function(time)");
//			console.log("TCL: time", time);
			var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
			var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
			if ( time == 0 ) {
				// 0 means current frame in video player
				time = TIMAAT.VideoPlayer.video.currentTime - startTime;
				time = Math.max(0.0, time);
			}
			endTime = startTime+time;
			startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
			endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
			$("#timaat-inspector-meta-start").val(TIMAAT.Util.formatTime(startTime, true));
			$("#timaat-inspector-meta-end").val(TIMAAT.Util.formatTime(endTime, true));
			
			if ( this.state.item && this.state.type == 'annotation' ) {
				this.state.item.startTime = startTime;
				this.state.item.endTime = endTime;
				this.state.item.marker.updateView();
			}
		}
		
		getPosition() {
			return this._inspector.getPosition();
		}
		setPosition(pos) {
			return this._inspector.setPosition(pos);			
		}
		
		enablePanel(panel) {
			$('#'+panel+'-pane').show();
			return this._inspector.enablePanel(panel);
		}
		disablePanel(panel) {
			$('#'+panel+'-pane').hide();
			return this._inspector.disablePanel(panel);
		}
		
		open(panel) {
			return this._inspector.open(panel);
		}
		close() {
			return this._inspector.close();
		}
		
		

		_setInspectorStroke(stroke) {
			if ( stroke > 0 ) {
				$('#timaat-inspector-meta-outline').attr('class', 'btn btn-primary');
				$('#timaat-inspector-meta-outline').find('i').attr('class', 'far fa-square');
			} else {
				$('#timaat-inspector-meta-outline').attr('class', 'btn btn-outline-secondary');
				$('#timaat-inspector-meta-outline').find('i').attr('class', 'fas fa-border-style');
			}					
		}

		_setInspectorAnnotationType(layerVisual) {
			$('#timaat-inspector-meta-type-group .timaat-inspector-meta-videolayer').removeClass('btn-secondary').removeClass('btn-outline-secondary');
			$('#timaat-inspector-meta-type-group .timaat-inspector-meta-audiolayer').removeClass('btn-secondary').removeClass('btn-outline-secondary');
			if ( layerVisual > 0 ) {
				$('#timaat-inspector-meta-type-group .timaat-inspector-meta-videolayer').addClass('btn-secondary');
				$('#timaat-inspector-meta-type-group .timaat-inspector-meta-audiolayer').addClass('btn-outline-secondary');
			} else {
				$('#timaat-inspector-meta-type-group .timaat-inspector-meta-videolayer').addClass('btn-outline-secondary');
				$('#timaat-inspector-meta-type-group .timaat-inspector-meta-audiolayer').addClass('btn-secondary');
			}					
		}

		
	}
	
}, window));
