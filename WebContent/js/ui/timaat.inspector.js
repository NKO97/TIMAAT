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
			// console.log('TCL: Inspector -> constructor');

			// init sidebar control
			this._viewer = viewer;
			this._inspector = L.control.sidebar({
				autoPan    : false,
				container  : 'timaat-inspector',
				closeButton: true,
				position   : 'right',
			}).addTo(viewer);

			// activate floating inspector
			$('#timaat-inspector').appendTo('#timaat-component-videoplayer');
			$('#timaat-inspector').draggable({handle:'.inspector-title', containment:'#wrapper'});
			$('#timaat-inspector .leaflet-sidebar-tabs ul:not(.inspector-tabs)').remove();
			// ul#list li:not(.active)

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
			this.ui.actorLang = {
				"decimal"          : ",",
				"thousands"        : ".",
				"search"           : "",
				"searchPlaceholder": "Suche Actors",
				"processing"       : '<i class="fas fa-spinner fa-spin"></i> Lade Daten...',
				"lengthMenu"       : "Zeige _MENU_ Einträge",
				"zeroRecords"      : "Keine Actors gefunden.",
				"info"             : "Seite _PAGE_ / _PAGES_ &middot; (_MAX_ gesamt)",
				"infoEmpty"        : "Keine Actors gefunden.",
				"infoFiltered"     : '&mdash; <i class="fas fa-search"></i> _TOTAL_',
				"paginate"         : {
					"first"   : "<<",
					"previous": "<",
					"next"    : ">",
					"last"    : ">>"
				}
			};

			this.ui.dataTableActors = $('#timaat-inspector-actors-pane .actors-available').DataTable({
				lengthChange	: false,
				dom						: 'rt<"row"<"col-sm-10"i><"col-sm-2"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				pageLength		: 3,
				deferLoading	: 0,
				pagingType		: 'full',
				order					: [[ 0, 'asc' ]],
				processing		: true,
				serverSide		: true,
				ajax					: {
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
        	// console.log("TCL: Inspector -> constructor -> data", data);
					let actorElement = $(row);
					let actor = data;
					actorElement.data('actor', actor);

					actorElement.find('.add-actor').on('click', actor, function(ev) {
						ev.stopPropagation();
						if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.AnnotationService.addAnnotationActor(TIMAAT.VideoPlayer.curAnnotation.model.id, actor.id)
						.then((result)=>{
							inspector.ui.dataTableActors.ajax.reload();
							inspector.ui.dataTableAnnoActors.ajax.reload();
						}).catch((error)=>{
							console.error("ERROR: ", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, actor, meta) {
						let displayActorTypeIcon = '';
						let actorType = actor.actorType.actorTypeTranslations[0].type;
						switch (actorType) {
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
							if (actorType == 'person') {
								nameDisplay += `<p><i>(BN: `+actor.birthName.name+`)</i></p>`;
							} else {
								nameDisplay += `<p><i>(OD: `+actor.birthName.name+`)</i></p>`;
							}
						}
						actor.actorNames.forEach(function(name) { // make additional names searchable in actor library
							if (name.id != actor.displayName.id && (actor.birthName == null || name.id != actor.birthName.id)) {
								nameDisplay += `<div style="display:none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				language: this.ui.actorLang,
			});
//			$(this.ui.dataTableActors.table().container()).find('.table-title').text('Available Actors');

			this.ui.dataTableAnnoActors = $('#timaat-inspector-actors-pane .actors-annotation').DataTable({
				lengthChange	: false,
				pageLength		: 10,
				dom						: 'rt<"row"<"col-sm-10"i><"col-sm-2"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				searching			: false,
				deferLoading	: 0,
				order					: [[ 0, 'asc' ]],
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
							asDataTable: true,
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
						if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.AnnotationService.removeAnnotationActor(TIMAAT.VideoPlayer.curAnnotation.model.id, actor.id)
						.then((result)=>{
							inspector.ui.dataTableActors.ajax.reload();
							inspector.ui.dataTableAnnoActors.ajax.reload();
						}).catch((error)=>{
							console.error("ERROR: ", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, actor, meta) {
						let displayActorTypeIcon = '';
						let actorType = actor.actorType.actorTypeTranslations[0].type
						switch (actorType) {
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
							if (actorType == 'person') {
								nameDisplay += `<p><i>(BN: `+actor.birthName.name+`)</i></p>`;
							} else {
								nameDisplay += `<p><i>(OD: `+actor.birthName.name+`)</i></p>`;
							}
						}
						actor.actorNames.forEach(function(name) { // make additional names searchable in actor library
							if (name.id != actor.displayName.id && (actor.birthName == null || name.id != actor.birthName.id)) {
								nameDisplay += `<div style="display:none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				language: this.ui.actorLang,
			});

			// events panel
			this.ui.eventLang = {
				"decimal"          : ",",
				"thousands"        : ".",
				"search"           : "",
				"searchPlaceholder": "Suche Events",
				"processing"       : '<i class="fas fa-spinner fa-spin"></i> Lade Daten...',
				"lengthMenu"       : "Zeige _MENU_ Einträge",
				"zeroRecords"      : "Keine Events gefunden.",
				"info"             : "Seite _PAGE_ / _PAGES_ &middot; (_MAX_ gesamt)",
				"infoEmpty"        : "Keine Events gefunden.",
				"infoFiltered"     : '&mdash; <i class="fas fa-search"></i> _TOTAL_',
				"paginate"         : {
					"first"   : "<<",
					"previous": "<",
					"next"    : ">",
					"last"    : ">>"
				}
			};

			this.ui.dataTableEvents = $('#timaat-inspector-events-pane .events-available').DataTable({
				lengthChange	: false,
				dom				: 'rft<"row"<"col-sm-10"i><"col-sm-2"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				pageLength		: 3,
				deferLoading	: 0,
				pagingType		: 'full',
				order					: [[ 0, 'asc' ]],
				processing		: true,
				serverSide		: true,
				ajax					: {
					"url"        : "api/event/list",
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
        	// console.log("TCL: Inspector -> constructor -> data", data);
					let eventElement = $(row);
					let event = data;
					eventElement.data('event', event);

					eventElement.find('.add-event').on('click', event, function(ev) {
						ev.stopPropagation();
						if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.AnnotationService.addAnnotationEvent(TIMAAT.VideoPlayer.curAnnotation.model.id, event.id)
						.then((result)=>{
							inspector.ui.dataTableEvents.ajax.reload();
							inspector.ui.dataTableAnnoEvents.ajax.reload();
						}).catch((error)=>{
							console.error("ERROR: ", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, event, meta) {
						// console.log("TCL: event", event);
						let nameDisplay = `<p>` + event.eventTranslations[0].name +
								`<span class="add-event badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw"></i></span>` +
							`</p>`;
						return nameDisplay;
					}
				}],
				language: this.ui.eventLang,
			});
			// $(this.ui.dataTableEvents.table().container()).find('.table-title').text('Available Events');

			this.ui.dataTableAnnoEvents = $('#timaat-inspector-events-pane .events-annotation').DataTable({
				lengthChange	: false,
				pageLength		: 10,
				dom						: 'rt<"row"<"col-sm-10"i><"col-sm-2"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				searching			: false,
				deferLoading	: 0,
				order					: [[ 0, 'asc' ]],
				processing		: true,
				serverSide		: true,
				ajax					: {
					"url"        : "api/annotation/0/events",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
							asDataTable: true,
						}
						// if ( data.search && data.search.value && data.search.value.length > 0 ) serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token); },
					"dataSrc": function(data) { return data.data; }
				},
				"createdRow": function(row, data, dataIndex) {
					let eventElement = $(row);
					let event = data;
					eventElement.data('event', event);

					eventElement.find('.remove-event').on('click', event, function(ev) {
						ev.stopPropagation();
						if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.AnnotationService.removeAnnotationEvent(TIMAAT.VideoPlayer.curAnnotation.model.id, event.id)
						.then((result)=>{
							inspector.ui.dataTableEvents.ajax.reload();
							inspector.ui.dataTableAnnoEvents.ajax.reload();
						}).catch((error)=>{
							console.error("ERROR: ", error);
						});
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name timaat-padding', render: function(data, type, event, meta) {
						// console.log("TCL: event", event);
						let nameDisplay = `<p>` + event.eventTranslations[0].name +
							`<span class="remove-event badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw"></i></span>` +
						`</p>`;
						return nameDisplay;
					}
				}],
				language: this.ui.eventLang,
			});

			// attach listeners
			$('#timaat-inspector-meta-submit').on('click', async function(ev) {
				if ( !inspector.state.type ) return;
				if (TIMAAT.VideoPlayer.currentPermissionLevel < 2 && !(inspector.state.type == 'analysisList' && !inspector.state.item)) {
					$('#analysisListNoPermissionModal').modal('show');
					return;
				}
				// annotations
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					var title = $('#timaat-inspector-meta-name').val();
					var opacity = Number($('#timaat-inspector-meta-opacity').val());
					let layerVisual = $('#timaat-inspector-meta-visual-layer').is(":checked") ? true : false;
					let layerAudio = $('#timaat-inspector-meta-audio-layer').is(":checked") ? true : false;
					if (TIMAAT.VideoPlayer.curAnalysisList.mediumType == 'audio') layerAudio = true; // layer display is invisible in audio but needs to be set
					if (TIMAAT.VideoPlayer.curAnalysisList.mediumType == 'image') layerVisual = true; // layer display is invisible in image but needs to be set
					var comment = $('#timaat-inspector-meta-comment').summernote('code');
					comment = comment.substring(0,4096);
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
					var color = inspector.cp.colorHex.substring(1);
					if (anno) {
						anno.model.annotationTranslations[0].title = title;
						anno.model.annotationTranslations[0].comment = comment;
						anno.model.startTime = startTime;
						anno.model.endTime = endTime;
						anno.svg.colorHex = color;
						anno.svg.opacity = opacity;
						anno.model.layerVisual = layerVisual;
						anno.model.layerAudio = layerAudio;
						anno.saveChanges();
						TIMAAT.VideoPlayer.updateAnnotation(anno);
						TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.url('/TIMAAT/api/analysis/method/list?visual='+anno.model.layerVisual+'&audio='+anno.model.layerAudio);
						TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload();
					} else {
						let model = {
							id: 0,
							startTime: startTime,
							endTime: endTime,
							layerVisual: layerVisual,
							layerAudio: layerAudio,
							// actors: [],
							// annotations1: [],
							// annotations2: [],
							// categories: [],
							// events: [],
							// locations: [],
							// mediums: [],
							annotationTranslations: [{
								id: 0,
								comment: comment,
								title: title,
							}],
							selectorSvgs: [{
								id: 0,
								colorHex: color,
								opacity: opacity * 100, //* 0..1 is stored as 0..100 (Byte)
								svgData: "{\"keyframes\":[{\"time\":0,\"shapes\":[]}]}",
								strokeWidth: 1,
								svgShapeType: {
									id: 5
								}
							}]
						};
						TIMAAT.AnnotationService.createAnnotation(model, TIMAAT.VideoPlayer.curAnalysisList.id, TIMAAT.VideoPlayer._annotationAdded);
					}
				}
				// analysis lists
				if ( inspector.state.type == 'analysisList' ) {
					var list = inspector.state.item;
					var title = $('#timaat-inspector-meta-name').val();
					var comment = $('#timaat-inspector-meta-comment').summernote('code');
					comment = comment.substring(0,4096);
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					if (list) {
						TIMAAT.Util.setDefaultTranslation(TIMAAT.VideoPlayer.curAnalysisList, 'mediumAnalysisListTranslations', 'title', title);
						TIMAAT.Util.setDefaultTranslation(TIMAAT.VideoPlayer.curAnalysisList, 'mediumAnalysisListTranslations', 'text', comment);
						TIMAAT.VideoPlayer.updateAnalysisList(TIMAAT.VideoPlayer.curAnalysisList);
						inspector.close();
					} else {
						TIMAAT.AnalysisListService.createAnalysisList(title, comment, TIMAAT.VideoPlayer.model.medium.id, TIMAAT.VideoPlayer._analysisListAdded);
					}
				}
				// analysis segments
				if ( inspector.state.type == 'segment' ) {
					var segment = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').summernote('code');
					comment = comment.substring(0,4096);
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					var transcript = $('#timaat-inspector-meta-transcript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
					let i = 0;

					// early out: segment has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Segment has no time range');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Segments need to cover a spatial area. Start and end time may not be identical.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}
					// early out: segment's sequences and scenes do not exceed new time range
					if (segment) {
						let sequenceList = TIMAAT.VideoPlayer.curSegment.model.analysisSequences;
						i = 0;
						for (; i < sequenceList.length; i++) {
							if (startTime > sequenceList[i].startTime || endTime < sequenceList[i].endTime) {
								$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Segment time interval too small');
								$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The segment's time interval has to be large enough to encompass its elements. Remove or alter conflicting sequences and scenes first.");
								$('#timaat-videoplayer-segment-element-modal').modal('show');
								return;
							}
						}
						let sceneList = TIMAAT.VideoPlayer.curSegment.model.analysisScenes;
						i = 0;
						for (; i < sceneList.length; i++) {
							if (startTime > sceneList[i].startTime || endTime < sceneList[i].endTime) {
								$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Segment time interval too small');
								$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The segment's time interval has to be large enough to encompass its elements. Remove or alter conflicting sequences and scenes first.");
								$('#timaat-videoplayer-segment-element-modal').modal('show');
								return;
							}
						}
					}

					// segment has a time range and still encompasses its sub elements. Now check for overlap with other segments
					var overlapping = false;
					i = 0;
					var segmentList = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments;
					if (segment) {
						let index = segmentList.findIndex(({id}) => id === segment.model.id);
						segmentList.splice(index,1);
					}
					for (; i < segmentList.length; i++) {
						if (!(endTime <= segmentList[i].startTime || startTime >= segmentList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: segment overlaps with other segments
					if (overlapping) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Segment is overlapping');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Segments are not allowed to overlap. Please check your start and end time values.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
					} else {
						if (segment) {
							segment.model.analysisSegmentTranslations[0].name = name;
							segment.model.analysisSegmentTranslations[0].shortDescription = shortDescription;
							segment.model.analysisSegmentTranslations[0].comment = comment;
							segment.model.analysisSegmentTranslations[0].transcript = transcript;
							segment.model.startTime = startTime;
							segment.model.endTime = endTime;

							// update segment UI
							await TIMAAT.VideoPlayer.updateAnalysisSegmentElement(inspector.state.type, segment);
						} else {
							var model = {
								id: 0,
								analysisSegmentTranslations: [{
									id: 0,
									name: name,
									shortDescription: shortDescription,
									comment: comment,
									transcript: transcript
								}],
								startTime: startTime,
								endTime: endTime
							};
							segment = await TIMAAT.AnalysisListService.createSegmentElement(inspector.state.type, model, TIMAAT.VideoPlayer.curAnalysisList.id);
							segment = new TIMAAT.AnalysisSegment(segment);
							TIMAAT.VideoPlayer._segmentAdded(segment, true);
						}
						var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
						TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
					}
				}
				// analysis sequences
				if ( inspector.state.type == 'sequence' ) {
					var sequence = inspector.state.item;
          // console.log("TCL: Inspector -> $ -> sequence", sequence);
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').summernote('code');
					comment = comment.substring(0,4096);
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					var transcript = $('#timaat-inspector-meta-transcript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
					let i = 0;

					// early out: sequence has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Sequence has no time range');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Sequences need to cover a spatial area. Start and end time may not be identical.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}
					// early out: sequence's time range exceeds segment's time range
					if (startTime < TIMAAT.VideoPlayer.curSegment.model.startTime || endTime > TIMAAT.VideoPlayer.curSegment.model.endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Sequence out of bounds');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The sequence's start and end time have to be within the range of the segment it belongs to.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}
					if (sequence) {
						// early out: sequence's takes do not exceed new time range
						let takeList = TIMAAT.VideoPlayer.curSequence.model.analysisTakes;
						i = 0;
						for (; i < takeList.length; i++) {
							if (startTime > takeList[i].startTime || endTime < takeList[i].endTime) {
								$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Sequence time interval too small');
								$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The sequence's time interval has to be large enough to encompass its elements. Remove or alter conflicting takes first.");
								$('#timaat-videoplayer-segment-element-modal').modal('show');
								return;
							}
						}
					}

					// sequence has a time range, does not exceed its segment's, and still encompasses its sub elements. Now check for overlap with other sequences
					var overlapping = false;
					i = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.findIndex(({id}) => id === TIMAAT.VideoPlayer.curSegment.model.id);
					let sequenceList = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments[i].analysisSequences;
					if (sequence) {
						let index = sequenceList.findIndex(({id}) => id === sequence.model.id);
						sequenceList.splice(index,1);
					}
					i = 0;
					for (; i < sequenceList.length; i++) {
						if (!(endTime <= sequenceList[i].startTime || startTime >= sequenceList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: sequence overlaps with other sequences
					if (overlapping) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Sequence is overlapping');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Sequences are not allowed to overlap. Please check your start and end time values.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
					} else {
						if (sequence) {
							sequence.model.analysisSequenceTranslations[0].name = name;
							sequence.model.analysisSequenceTranslations[0].shortDescription = shortDescription;
							sequence.model.analysisSequenceTranslations[0].comment = comment;
							sequence.model.analysisSequenceTranslations[0].transcript = transcript;
							sequence.model.startTime = startTime;
							sequence.model.endTime = endTime;
							sequence.model.segmentId = TIMAAT.VideoPlayer.curSegment.model.id;

							// update sequence UI
							await TIMAAT.VideoPlayer.updateAnalysisSegmentElement(inspector.state.type, sequence);
						} else {
							var model = {
								id: 0,
								analysisSequenceTranslations: [{
									id: 0,
									name: name,
									shortDescription: shortDescription,
									comment: comment,
									transcript: transcript
								}],
								startTime: startTime,
								endTime: endTime,
								segmentId: TIMAAT.VideoPlayer.curSegment.model.id
							};
							sequence = await TIMAAT.AnalysisListService.createSegmentElement(inspector.state.type, model, TIMAAT.VideoPlayer.curSegment.model.id);
							sequence = new TIMAAT.AnalysisSequence(sequence);
							TIMAAT.VideoPlayer._sequenceAdded(sequence, true);
						}
						var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
						TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
					}

				}
				// analysis takes
				if ( inspector.state.type == 'take' ) {
					var take = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').summernote('code');
					comment = comment.substring(0,4096);
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					var transcript = $('#timaat-inspector-meta-transcript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());

					// early out: take has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Take has no time range');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Takes need to cover a spatial area. Start and end time may not be identical.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}
					// early out: take's time range exceeds sequence's time range
					if (startTime < TIMAAT.VideoPlayer.curSequence.model.startTime || endTime > TIMAAT.VideoPlayer.curSequence.model.endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Take out of bounds');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The take's start and end time have to be within the range of the sequence it belongs to.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}

					// take has a time range and does not exceed its sequence's. Now check for overlap with other takes
					var overlapping = false;
					let i = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.findIndex(({id}) => id === TIMAAT.VideoPlayer.curSegment.model.id);
					let j = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments[i].analysisSequences.findIndex(({id}) => id === TIMAAT.VideoPlayer.curSequence.model.id);
					let takeList = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments[i].analysisSequences[j].analysisTakes;
					if (take) {
						let index = takeList.findIndex(({id}) => id === take.model.id);
						takeList.splice(index,1);
					}
					i = 0;
					for (; i < takeList.length; i++) {
						if (!(endTime <= takeList[i].startTime || startTime >= takeList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: take overlaps with other takes
					if (overlapping) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Take is overlapping');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Takes are not allowed to overlap. Please check your start and end time values.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
					} else {
						if (take) {
							take.model.analysisTakeTranslations[0].name = name;
							take.model.analysisTakeTranslations[0].shortDescription = shortDescription;
							take.model.analysisTakeTranslations[0].comment = comment;
							take.model.analysisTakeTranslations[0].transcript = transcript;
							take.model.startTime = startTime;
							take.model.endTime = endTime;

							// update take UI
							await TIMAAT.VideoPlayer.updateAnalysisSegmentElement(inspector.state.type, take);
						} else {
							var model = {
								id: 0,
								analysisTakeTranslations: [{
									id: 0,
									name: name,
									shortDescription: shortDescription,
									comment: comment,
									transcript: transcript
								}],
								startTime: startTime,
								endTime: endTime,
								sequenceId: TIMAAT.VideoPlayer.curSequence.model.id
							};
							take = await TIMAAT.AnalysisListService.createSegmentElement(inspector.state.type, model, TIMAAT.VideoPlayer.curSequence.model.id);
							take = new TIMAAT.AnalysisTake(take);
							TIMAAT.VideoPlayer._takeAdded(take, true);
						}
						var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
						TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
					}

				}
				// analysis scenes
				if ( inspector.state.type == 'scene' ) {
					var scene = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').summernote('code');
					comment = comment.substring(0,4096);
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					var transcript = $('#timaat-inspector-meta-transcript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
					let i = 0;

					// early out: scene has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Scene has no time range');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Scenes need to cover a spatial area. Start and end time may not be identical.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}
					// early out: scene's time range exceeds segment's time range
					if (startTime < TIMAAT.VideoPlayer.curSegment.model.startTime || endTime > TIMAAT.VideoPlayer.curSegment.model.endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Scene out of bounds');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The scene's start and end time have to be within the range of the segment it belongs to.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}
					// early out: scene's actions do not exceed new time range
					if (scene) {
						let actionList = TIMAAT.VideoPlayer.curScene.model.analysisActions;
						i = 0;
						for (; i < actionList.length; i++) {
							if (startTime > actionList[i].startTime || endTime < actionList[i].endTime) {
								$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Scene time interval too small');
								$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The scene's time interval has to be large enough to encompass its elements. Remove or alter conflicting actions first.");
								$('#timaat-videoplayer-segment-element-modal').modal('show');
								return;
							}
						}
					}

					// scene has a time range, does not exceed its segment's, and still encompasses its sub elements. Now check for overlap with other scenes
					var overlapping = false;
					i = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.findIndex(({id}) => id === TIMAAT.VideoPlayer.curSegment.model.id);
					let sceneList = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments[i].analysisScenes;
					if (scene) {
						let index = sceneList.findIndex(({id}) => id === scene.model.id);
						sceneList.splice(index,1);
					}
					i = 0;
					for (; i < sceneList.length; i++) {
						if (!(endTime <= sceneList[i].startTime || startTime >= sceneList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: scene overlaps with other scenes
					if (overlapping) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Scene is overlapping');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Scenes are not allowed to overlap. Please check your start and end time values.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
					} else {
						if (scene) {
							scene.model.analysisSceneTranslations[0].name = name;
							scene.model.analysisSceneTranslations[0].shortDescription = shortDescription;
							scene.model.analysisSceneTranslations[0].comment = comment;
							scene.model.analysisSceneTranslations[0].transcript = transcript;
							scene.model.startTime = startTime;
							scene.model.endTime = endTime;

							// update scene UI
							await TIMAAT.VideoPlayer.updateAnalysisSegmentElement(inspector.state.type, scene);
						} else {
							var model = {
								id: 0,
								analysisSceneTranslations: [{
									id: 0,
									name: name,
									shortDescription: shortDescription,
									comment: comment,
									transcript: transcript
								}],
								startTime: startTime,
								endTime: endTime,
								segmentId: TIMAAT.VideoPlayer.curSegment.model.id
							};
							scene = await TIMAAT.AnalysisListService.createSegmentElement(inspector.state.type, model, TIMAAT.VideoPlayer.curSegment.model.id);
							scene = new TIMAAT.AnalysisScene(scene);
							TIMAAT.VideoPlayer._sceneAdded(scene, true);
						}
						var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
						TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
					}

				}
				// analysis actions
				if ( inspector.state.type == 'action' ) {
					var action = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').summernote('code');
					comment = comment.substring(0,4096);
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					var transcript = $('#timaat-inspector-meta-transcript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());

					// early out: action has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Action has no time range');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Actions need to cover a spatial area. Start and end time may not be identical.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}
					// early out: action's time range exceeds scene's time range
					if (startTime < TIMAAT.VideoPlayer.curScene.model.startTime || endTime > TIMAAT.VideoPlayer.curScene.model.endTime) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Action out of bounds');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("The action's start and end time have to be within the range of the scene it belongs to.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
						return;
					}

					// action has a time range and does not exceed its scene's. Now check for overlap with other actions
					var overlapping = false;
					let i = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments.findIndex(({id}) => id === TIMAAT.VideoPlayer.curSegment.model.id);
					let j = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments[i].analysisScenes.findIndex(({id}) => id === TIMAAT.VideoPlayer.curScene.model.id);
					let actionList = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments[i].analysisScenes[j].analysisActions;
					if (action) {
						let index = actionList.findIndex(({id}) => id === action.model.id);
						actionList.splice(index,1);
					}
					i = 0;
					for (; i < actionList.length; i++) {
						if (!(endTime <= actionList[i].startTime || startTime >= actionList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: action overlaps with other actions
					if (overlapping) {
						$('#timaat-videoplayer-segment-element-modal').find('.modal-title').html('Action is overlapping');
						$('#timaat-videoplayer-segment-element-modal').find('.modal-body').html("Actions are not allowed to overlap. Please check your start and end time values.");
						$('#timaat-videoplayer-segment-element-modal').modal('show');
					} else {
						if (action) {
							action.model.analysisActionTranslations[0].name = name;
							action.model.analysisActionTranslations[0].shortDescription = shortDescription;
							action.model.analysisActionTranslations[0].comment = comment;
							action.model.analysisActionTranslations[0].transcript = transcript;
							action.model.startTime = startTime;
							action.model.endTime = endTime;

							// update action UI
							await TIMAAT.VideoPlayer.updateAnalysisSegmentElement(inspector.state.type, action);
						} else {
							var model = {
								id: 0,
								analysisActionTranslations: [{
									id: 0,
									name: name,
									shortDescription: shortDescription,
									comment: comment,
									transcript: transcript
								}],
								startTime: startTime,
								endTime: endTime,
								sceneId: TIMAAT.VideoPlayer.curScene.model.id
							};
							action = await TIMAAT.AnalysisListService.createSegmentElement(inspector.state.type, model, TIMAAT.VideoPlayer.curScene.model.id);
							action = new TIMAAT.AnalysisAction(action);
							TIMAAT.VideoPlayer._actionAdded(action, true);
						}
						var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
						TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
					}
				}

			});

			$('#timaat-inspector-meta-visual-layer').on('click', function(event) {
				// if svg and/or animation data is available, prevent un-checking
				if (!$('#timaat-inspector-meta-visual-layer').is(":checked") && TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.model.selectorSvgs[0].svgData != '{"keyframes":[{"time":0,"shapes":[]}]}') {
					event.preventDefault();
					$('#timaat-annotation-analysis-layer-in-use').modal('show');
					return;
				}
				// if an analysis is attached that is only available for the visual-layer, prevent un-checking
				if (!$('#timaat-inspector-meta-visual-layer').is(":checked")) {
					if (TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.model.analysis.length > 0) { // early out
						let indexes = TIMAAT.VideoPlayer.curAnnotation.model.analysis.reduce((result, entry, index) => entry.analysisMethod.analysisMethodType.layerVisual === true ? result.concat(index) : result, []);
						let i = 0;
						let preventUncheck = false;
						for (; i < indexes.length; i++) {
							if (TIMAAT.VideoPlayer.curAnnotation.model.analysis[indexes[i]].analysisMethod.analysisMethodType.layerAudio == false) {
								preventUncheck = true;
								continue;
							}
						}
						if (preventUncheck) {
							event.preventDefault();
							$('#timaat-annotation-analysis-layer-in-use').modal('show');
							return;
						}
					}
				}
				// if both checkboxes are unchecked after un-checking a checkbox, check the other one
				if (!$('#timaat-inspector-meta-visual-layer').is(":checked") && !$('#timaat-inspector-meta-audio-layer').is(":checked")) {
					$('#timaat-inspector-meta-audio-layer').prop("checked", true);
				}
			});

			$('#timaat-inspector-meta-audio-layer').on('click', function(event) {
				if (!$('#timaat-inspector-meta-audio-layer').is(":checked")) {
					if (TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.model.analysis.length > 0) { // early out
						let indexes = TIMAAT.VideoPlayer.curAnnotation.model.analysis.reduce((result, entry, index) => entry.analysisMethod.analysisMethodType.layerAudio === true ? result.concat(index) : result, []);
						let i = 0;
						let preventUncheck = false;
						for (; i < indexes.length; i++) {
							if (TIMAAT.VideoPlayer.curAnnotation.model.analysis[indexes[i]].analysisMethod.analysisMethodType.layerVisual == false) {
								preventUncheck = true;
								continue;
							}
						}
						if (preventUncheck) {
							event.preventDefault();
							$('#timaat-annotation-analysis-layer-in-use').modal('show');
							return;
						}
					}
				}
				// if both checkboxes are unchecked after un-checking a checkbox, check the other one
				if (!$('#timaat-inspector-meta-audio-layer').is(":checked") && !$('#timaat-inspector-meta-visual-layer').is(":checked")) {
					$('#timaat-inspector-meta-visual-layer').prop("checked", true);
				}
			});

			$('#timaat-inspector-meta-delete').on('click', function() {
				if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
					$('#analysisListNoPermissionModal').modal('show');
					return;
				}
				switch (inspector.state.type) {
					case 'analysisList':
						if (TIMAAT.VideoPlayer.currentPermissionLevel < 4) {
              $('#analysisListNoPermissionModal').modal('show');
              return;
            }
						TIMAAT.VideoPlayer.removeAnalysisList();
					break;
					case 'annotation':
						TIMAAT.VideoPlayer.removeAnnotation();
					break;
					case 'segment':
						TIMAAT.VideoPlayer.removeAnalysisSegmentElement('segment', TIMAAT.VideoPlayer.curSegment);
					break;
					case 'sequence':
						TIMAAT.VideoPlayer.removeAnalysisSegmentElement('sequence', TIMAAT.VideoPlayer.curSequence);
					break;
					case 'take':
						TIMAAT.VideoPlayer.removeAnalysisSegmentElement('take', TIMAAT.VideoPlayer.curTake);
					break;
					case 'scene':
						TIMAAT.VideoPlayer.removeAnalysisSegmentElement('scene', TIMAAT.VideoPlayer.curScene);
					break;
					case 'action':
						TIMAAT.VideoPlayer.removeAnalysisSegmentElement('action', TIMAAT.VideoPlayer.curAction);
					break;
				}
			});

			// setup annotation metadata UI and events
			$('#timaat-inspector-meta-colorPicker').tinycolorpicker();
			this.cp = $('#timaat-inspector-meta-colorPicker').data("plugin_tinycolorpicker");
			this.cp.setColor('rgb(3, 145, 206)');

			$('#timaat-inspector-meta-name').on('input', function(ev) {
				if ( $('#timaat-inspector-meta-name').val().length > 0 ) {
					$('#timaat-inspector-meta-submit').prop('disabled', false);
					$('#timaat-inspector-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-inspector-meta-submit').prop('disabled', true);
					$('#timaat-inspector-meta-submit').attr('disabled');
				}
			});

			// $('#timaat-inspector-meta-colorPicker').on('change', function(event) {
      //   if ( inspector.state.type == 'annotation' ) {
			// 		console.log("TCL: Inspector -> timaat-inspector-meta-colorPicker -> on change");
			// 		let anno = inspector.state.item;
      //     console.log("TCL: Inspector -> $ -> anno", anno);
			// 		if (!anno) return;
			// 		let color = $('#timaat-inspector-meta-colorPicker').data("plugin_tinycolorpicker").colorHex;
      //     console.log("TCL: Inspector -> $ -> color", color);
			// 		for (let item of anno.svg.items) {
			// 			item.setStyle({color: + color });
			// 		};
			// 		// inspector.state.item = anno; // needed?
			// 	}
			// })

			$('#timaat-inspector-meta-opacity').on('change input', function(ev) {
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					if ( !anno ) return;
					let opacity = Number($('#timaat-inspector-meta-opacity').val());
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

			$('#timaat-inspector-meta-start, #timaat-inspector-meta-end').on('blur change', function(ev) {
				var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
				startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
				endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
				$('#timaat-inspector-meta-start').val(TIMAAT.Util.formatTime(startTime, true));
				$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTime, true));

				if ( inspector.state.item && inspector.state.type == 'annotation' ) {
					inspector.state.item.startTime = startTime;
					inspector.state.item.endTime = endTime;
					inspector.state.item.marker.updateView();
				}
			});

			$('#timaat-inspector-meta-setstart').on('click', function() {
				var startTimeInMs = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
				var endTimeInMs = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
				var durationInMs = endTimeInMs - startTimeInMs;
				let currentTimeInMs = TIMAAT.VideoPlayer.medium.currentTime * 1000;
				durationInMs = Math.max(0, Math.min(durationInMs, TIMAAT.VideoPlayer.duration * 1000));
				startTimeInMs = TIMAAT.VideoPlayer.medium.currentTime * 1000;
				switch (TIMAAT.VideoPlayer.inspector.state.type) {
					case 'sequence':
					case 'scene':
						if (currentTimeInMs < TIMAAT.VideoPlayer.curSegment.model.startTime || currentTimeInMs > TIMAAT.VideoPlayer.curSegment.model.endTime)
							startTimeInMs = TIMAAT.VideoPlayer.curSegment.model.startTime;
						durationInMs = Math.max(0, Math.min(durationInMs, TIMAAT.VideoPlayer.curSegment.model.endTime - startTimeInMs));
					break;
					case 'take':
						if (currentTimeInMs < TIMAAT.VideoPlayer.curSequence.model.startTime || currentTimeInMs > TIMAAT.VideoPlayer.curSequence.model.endTime)
							startTimeInMs = TIMAAT.VideoPlayer.curSequence.model.startTime;
						durationInMs = Math.max(0, Math.min(durationInMs, TIMAAT.VideoPlayer.curSequence.model.endTime - startTimeInMs));
					break;
					case 'action':
						if (currentTimeInMs < TIMAAT.VideoPlayer.curScene.model.startTime || currentTimeInMs > TIMAAT.VideoPlayer.curScene.model.endTime)
							startTimeInMs = TIMAAT.VideoPlayer.curScene.model.startTime;
						durationInMs = Math.max(0, Math.min(durationInMs, TIMAAT.VideoPlayer.curScene.model.endTime - startTimeInMs));
					break;
				}
				$('#timaat-inspector-meta-start').val(TIMAAT.Util.formatTime(startTimeInMs, true));
				endTimeInMs = startTimeInMs + durationInMs;
				$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTimeInMs, true));
				$('#timaat-inspector-meta-start').trigger('blur');
			});

			$('#timaat-inspector-meta-setend').on('click', function() {
				let currentTimeInMs = TIMAAT.VideoPlayer.medium.currentTime * 1000;
				let endTimeInMs = currentTimeInMs;
				switch (TIMAAT.VideoPlayer.inspector.state.type) {
					case 'sequence':
					case 'scene':
						if (currentTimeInMs > TIMAAT.VideoPlayer.curSegment.model.endTime || currentTimeInMs < TIMAAT.VideoPlayer.curSegment.model.startTime)
							endTimeInMs = TIMAAT.VideoPlayer.curSegment.model.endTime;
					break;
					case 'take':
						if (currentTimeInMs > TIMAAT.VideoPlayer.curSequence.model.endTime || currentTimeInMs < TIMAAT.VideoPlayer.curSequence.model.startTime)
							endTimeInMs = TIMAAT.VideoPlayer.curSequence.model.endTime;
					break;
					case 'action':
						if (currentTimeInMs > TIMAAT.VideoPlayer.curScene.model.endTime || currentTimeInMs < TIMAAT.VideoPlayer.curScene.model.startTime)
							endTimeInMs = TIMAAT.VideoPlayer.curScene.model.endTime;
					break;
				}
				$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTimeInMs, true));
				$('#timaat-inspector-meta-start').trigger('blur');
			});
			$('#timaat-inspector-meta-duration').change(function(ev) {
				var time = parseInt($(this).val());
				if ( ! isNaN(time) ) inspector.setMetaEnd(time);
				$(this).parent().click();
			});

			// animation panel listeners
			this.ui.addAnimButton.on('click', function(ev) {
				if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
					$('#analysisListNoPermissionModal').modal('show');
					return;

				}
				if (TIMAAT.VideoPlayer.curAnnotation.model.selectorSvgs[0].svgData == '{"keyframes":[{"time":0,"shapes":[]}]}') {
					$('#annotationNoGeometricDataModal').modal('show');
					return;
				}
				if ( TIMAAT.VideoPlayer.curAnnotation && !TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
					TIMAAT.VideoPlayer.pause();
					let anno = TIMAAT.VideoPlayer.curAnnotation;
					anno.addKeyframeAt(anno.endTime / 1000);
					$('#timaat-inspector-meta-visual-layer').prop('checked', true);

				}
			});

			this.ui.removeAnimButton.on('click', function(ev) {
				if ( TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
					TIMAAT.VideoPlayer.pause();
					let anno = TIMAAT.VideoPlayer.curAnnotation;
					anno.removeAnimationKeyframes();
					anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
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
			this.ui.dataTableEvents.clear();
			this.ui.dataTableEvents.ajax.reload();
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
      // console.log("TCL: Inspector -> setItem -> item, type", item, type);
			this.state.item = item;
			this.state.type = type;

			// hide segment substructure elements
			$('.timaat-segment-substructure-add').addClass("timaat-item-disabled");
			$('.timaat-segment-substructure-add').removeAttr('onclick');

			$('#segmentElementCategoriesForm').data('type', type);

			// metadata panel default UI setting
			$('#timaat-inspector-meta-start').prop('disabled', false);
			$('#timaat-inspector-meta-setstart').prop('disabled', false);
			$('#timaat-inspector-meta-end').prop('disabled', false);
			$('#timaat-inspector-meta-setend').prop('disabled', false);
			$('#timaat-inspector-meta-setend-dropdown').prop('disabled', false);

			if (item) {
				$('#timaat-inspector-meta-delete').prop('disabled', false);
				$('#timaat-inspector-meta-delete').removeAttr('disabled');
				$('#timaat-inspector-meta-delete').show();
			} else {
				$('#timaat-inspector-meta-delete').prop('disabled', true);
				$('#timaat-inspector-meta-delete').attr('disabled');
				$('#timaat-inspector-meta-delete').hide();
			}

			// animation panel default UI setting
			this.disablePanel('timaat-inspector-animation');
			this.disablePanel('timaat-inspector-categories-and-tags');
			this.disablePanel('timaat-inspector-actors');
			this.disablePanel('timaat-inspector-events');
			// this.disablePanel('timaat-inspector-locations');
			this.disablePanel('timaat-inspector-analysis');
			this.ui.keyframeList.children().detach();

			// actors panel default UI setting
			this.ui.dataTableAnnoActors.ajax.url('api/annotation/0/actors');

			// analysis panel default UI setting
			TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.url('api/annotation/0/analysis');

			// events panel default UI setting
			this.ui.dataTableAnnoEvents.ajax.url('api/annotation/0/events');

			switch (type) {
				case undefined:
				case null:
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
					this.disablePanel('timaat-inspector-metadata');
					$('#timaat-inspector-metadata-title').html('Kein Element ausgewählt');
				break;
				case 'annotation':
					if (!item) {
						TIMAAT.VideoPlayer.curAnnotation = null;
					}
					this.enablePanel('timaat-inspector-metadata');
					// animation panel
					if ( TIMAAT.VideoPlayer.model.medium.mediumVideo ) this.enablePanel('timaat-inspector-animation');
					else this.disablePanel('timaat-inspector-animation');
					if ( item != null ) {
						this.enablePanel('timaat-inspector-actors');
						this.enablePanel('timaat-inspector-events');
						// this.enablePanel('timaat-inspector-locations');
						this.enablePanel('timaat-inspector-analysis');
						this.enablePanel('timaat-inspector-categories-and-tags');
					}
					// metadata panel
					$('#timaat-inspector-meta-color-group').show();
					$('#timaat-inspector-meta-opacity-group').show();
					if ( TIMAAT.VideoPlayer.model.video.mediumVideo) $('#timaat-inspector-meta-type-group').show(); // TODO may have to change when new media types can be annotated
					else $('#timaat-inspector-meta-type-group').hide();
					if ( TIMAAT.VideoPlayer.duration > 0 ) $('#timaat-inspector-meta-timecode-group').show();
					else $('#timaat-inspector-meta-timecode-group').hide();
					if (item) {
						$('#timaat-inspector-meta-start').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-setstart').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-end').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-setend').prop('disabled', item.isAnimation());
						$('#timaat-inspector-meta-setend-dropdown').prop('disabled', item.isAnimation());
					}
					$('#timaat-inspector-meta-shortDescription-group').hide();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').hide();
					var anno = item;
					var heading = (anno) ? "Edit annotation" : "Add annotation";
					var submit = (anno) ? "Save" : "Add";
					var colorHex = (anno) ? anno.svg.colorHex : this.cp.colorHex.substring(1);
					var title = (anno) ? anno.model.annotationTranslations[0].title : "";
					var opacity = (anno) ? anno.opacity : 0.3;
					var stroke = (anno) ? anno.stroke : 2;
					let layerVisual = false;
					let layerAudio = false;
					switch (TIMAAT.VideoPlayer.curAnalysisList.mediumType) {
						case 'audio':
							layerAudio = (anno) ? anno.layerAudio : true;
						break;
						case 'image':
							layerVisual = (anno) ? anno.layerVisual : true;
						break;
						case 'video':
							layerVisual = (anno) ? anno.layerVisual : true;
							layerAudio = (anno) ? anno.layerAudio : true;
						break;
					}
					var comment = (anno) ? anno.model.annotationTranslations[0].comment : "";
					var start = ( TIMAAT.VideoPlayer.duration == 0 ) ? TIMAAT.Util.formatTime(0, true) : (anno) ? TIMAAT.Util.formatTime(anno.model.startTime, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.medium.currentTime * 1000, true);
					var end = ( TIMAAT.VideoPlayer.duration == 0 ) ? TIMAAT.Util.formatTime(0, true) : (anno) ? TIMAAT.Util.formatTime(anno.model.endTime, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.medium.currentTime * 1000, true);


					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					this.cp.setColor('#'+colorHex);
					$('#timaat-inspector-meta-name').val(title).trigger('input');
					$('#timaat-inspector-meta-opacity').val(opacity);
					this._setInspectorStroke(stroke);
					if (layerVisual) {
						$('#timaat-inspector-meta-visual-layer').prop('checked', true);
					} else {
						$('#timaat-inspector-meta-visual-layer').prop('checked', false);
					}
					if (layerAudio) {
						$('#timaat-inspector-meta-audio-layer').prop('checked', true);
					} else {
						$('#timaat-inspector-meta-audio-layer').prop('checked', false);
					}
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					$('#timaat-inspector-meta-start').val(start);
					$('#timaat-inspector-meta-end').val(end);
					$('#timaat-inspector-categories-and-tags-title').html('Categories and tags');

					if ( !anno ) this.open('timaat-inspector-metadata');
					else this.updateItem();

					if ( item ) {
						// console.log("TCL: Inspector -> setItem -> item", item);
						// actors panel
						this.ui.dataTableAnnoActors.ajax.url('api/annotation/'+item.model.id+'/actors');
						this.ui.dataTableAnnoActors.ajax.reload();
						this.ui.dataTableActors.ajax.reload();
						if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
							$('#timaat-inspector-add-actors').hide();
							$('#timaat-inspector-add-events').hide();
							$('#timaat-inspector-add-analyses').hide();
						} else {
							$('#timaat-inspector-add-actors').show();
							$('#timaat-inspector-add-events').show();
							$('#timaat-inspector-add-analyses').show();
						}

						// events panel
						this.ui.dataTableAnnoEvents.ajax.url('api/annotation/'+item.model.id+'/events');
						this.ui.dataTableAnnoEvents.ajax.reload();
						this.ui.dataTableEvents.ajax.reload();

						// analysis panel
						TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.url('api/annotation/'+item.model.id+'/analysis');
						TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
						TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.url('/TIMAAT/api/analysis/method/list?visual='+item.model.layerVisual+'&audio='+item.model.layerAudio);
						TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload();

						// category and tag panel
						$('#annotation-categories-multi-select-dropdown').val(null).trigger('change');
						if ($('#annotation-categories-multi-select-dropdown').hasClass('select2-hidden-accessible')) {
							$('#annotation-categories-multi-select-dropdown').select2('destroy');
						}
						$('#annotation-categories-multi-select-dropdown').find('option').remove();

						$('#annotation-tags-multi-select-dropdown').val(null).trigger('change');
						if ($('#annotation-tags-multi-select-dropdown').hasClass('select2-hidden-accessible')) {
							$('#annotation-tags-multi-select-dropdown').select2('destroy');
						}
						$('#annotation-tags-multi-select-dropdown').find('option').remove();

						$('.categoryAndTagPanel').hide();
						$('#mediumAnalysisListCategoryPanel').show();
						$('.mediumAnalysisListCategories').hide();
						$('#annotation-categories').show();
						$('#annotationTagPanel').show();

						$('#annotation-categories-multi-select-dropdown').select2({
							closeOnSelect: false,
							scrollAfterSelect: true,
							allowClear: true,
							minimumResultsForSearch: 10,
							ajax: {
								url: 'api/annotation/'+item.model.id+'/category/selectList/',
								type: 'GET',
								dataType: 'json',
								delay: 250,
								headers: {
									"Authorization": "Bearer "+TIMAAT.Service.token,
									"Content-Type": "application/json",
								},
								// additional parameters
								data: function(params) {
									return {
										search: params.term,
										page: params.page
									};
								},
								processResults: function(data, params) {
									params.page = params.page || 1;
									return {
										results: data
									};
								},
								cache: false
							},
							minimumInputLength: 0,
						});
						TIMAAT.AnnotationService.getSelectedCategories(item.model.id).then(function(data) {
							// console.log("TCL: then: data", data);
							var categorySelect = $('#annotation-categories-multi-select-dropdown');
							if (data.length > 0) {
								data.sort((a, b) => (a.name > b.name)? 1 : -1);
								// create the options and append to Select2
								var i = 0;
								for (; i < data.length; i++) {
									var option = new Option(data[i].name, data[i].id, true, true);
									categorySelect.append(option).trigger('change');
								}
								// manually trigger the 'select2:select' event
								categorySelect.trigger({
									type: 'select2:select',
									params: {
										data: data
									}
								});
							}
						});

						$('#annotation-tags-multi-select-dropdown').select2({
							closeOnSelect: false,
							scrollAfterSelect: true,
							allowClear: true,
							tags: true,
							tokenSeparators: [',', ' '],
							minimumResultsForSearch: 10,
							ajax: {
								url: 'api/tag/selectList/',
								type: 'GET',
								dataType: 'json',
								delay: 250,
								headers: {
									"Authorization": "Bearer "+TIMAAT.Service.token,
									"Content-Type": "application/json",
								},
								// additional parameters
								data: function(params) {
									return {
										search: params.term,
										page: params.page
									};
								},
								processResults: function(data, params) {
									params.page = params.page || 1;
									return {
										results: data
									};
								},
								cache: false
							},
							minimumInputLength: 0,
						});
						TIMAAT.AnnotationService.getTagList(item.model.id).then(function(data) {
							// console.log("TCL: then: data", data);
							var tagSelect = $('#annotation-tags-multi-select-dropdown');
							if (data.length > 0) {
								data.sort((a, b) => (a.name > b.name)? 1 : -1);
								// create the options and append to Select2
								var i = 0;
								for (; i < data.length; i++) {
									var option = new Option(data[i].name, data[i].id, true, true);
									tagSelect.append(option).trigger('change');
								}
								// manually trigger the 'select2:select' event
								tagSelect.trigger({
									type: 'select2:select',
									params: {
										data: data
									}
								});
							}
						});
					}
					TIMAAT.VideoPlayer.updateListUI();
				break;
				case 'analysisList':
					this.enablePanel('timaat-inspector-metadata');
					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').hide();
					$('#timaat-inspector-meta-shortDescription-group').hide();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').hide();
					var list = item;
					if ( !list ) this.open('timaat-inspector-metadata');
					var heading = (list) ? '<i class="fas fa-list-alt"></i> Analyse bearbeiten' : '<i class="fas fa-list-alt"></i> Analyse hinzufügen';
					var submit = (list) ? "Speichern" : "Hinzufügen";
					var title = (list) ? TIMAAT.Util.getDefaultTranslation(list, 'mediumAnalysisListTranslations', 'title') : "";
					var comment = (list) ? TIMAAT.Util.getDefaultTranslation(list, 'mediumAnalysisListTranslations', 'text') : "";
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$('#timaat-inspector-meta-name').val(title).trigger('input');
					$('#timaat-inspector-meta-comment').summernote('code', comment);
					$('#timaat-inspector-categories-and-tags-title').html('Kategorien-Sets und Tags');
					if ( item != null ) {
						$('#mediumAnalysisList-categorySets-multi-select-dropdown').val(null).trigger('change');
						if ($('#mediumAnalysisList-categorySets-multi-select-dropdown').hasClass('select2-hidden-accessible')) {
							$('#mediumAnalysisList-categorySets-multi-select-dropdown').select2('destroy');
						}
						$('#mediumAnalysisList-categorySets-multi-select-dropdown').find('option').remove();

						$('#mediumAnalysisList-tags-multi-select-dropdown').val(null).trigger('change');
						if ($('#mediumAnalysisList-tags-multi-select-dropdown').hasClass('select2-hidden-accessible')) {
							$('#mediumAnalysisList-tags-multi-select-dropdown').select2('destroy');
						}
						$('#mediumAnalysisList-tags-multi-select-dropdown').find('option').remove();

						$('.categoryAndTagPanel').hide();
						$('#mediumAnalysisListCategorySetPanel').show();
						$('#mediumAnalysisListTagPanel').show();
						this.enablePanel('timaat-inspector-categories-and-tags');

						$('#mediumAnalysisList-categorySets-multi-select-dropdown').select2({
							closeOnSelect: false,
							scrollAfterSelect: true,
							allowClear: true,
							minimumResultsForSearch: 10,
							ajax: {
								url: 'api/categorySet/selectList/',
								type: 'GET',
								dataType: 'json',
								delay: 250,
								headers: {
									"Authorization": "Bearer "+TIMAAT.Service.token,
									"Content-Type": "application/json",
								},
								// additional parameters
								data: function(params) {
									return {
										search: params.term,
										page: params.page
									};
								},
								processResults: function(data, params) {
									params.page = params.page || 1;
									return {
										results: data
									};
								},
								cache: false
							},
							minimumInputLength: 0,
						});
						TIMAAT.AnalysisListService.getCategorySetList(item.id).then(function(data) {
							// console.log("TCL: then: data", data);
							var categorySetSelect = $('#mediumAnalysisList-categorySets-multi-select-dropdown');
							if (data.length > 0) {
								data.sort((a, b) => (a.name > b.name)? 1 : -1);
								// create the options and append to Select2
								var i = 0;
								for (; i < data.length; i++) {
									var option = new Option(data[i].name, data[i].id, true, true);
									categorySetSelect.append(option).trigger('change');
								}
								// manually trigger the 'select2:select' event
								categorySetSelect.trigger({
									type: 'select2:select',
									params: {
										data: data
									}
								});
							}
						});

						$('#mediumAnalysisList-tags-multi-select-dropdown').select2({
							closeOnSelect: false,
							scrollAfterSelect: true,
							allowClear: true,
							tags: true,
							tokenSeparators: [',', ' '],
							minimumResultsForSearch: 10,
							ajax: {
								url: 'api/tag/selectList/',
								type: 'GET',
								dataType: 'json',
								delay: 250,
								headers: {
									"Authorization": "Bearer "+TIMAAT.Service.token,
									"Content-Type": "application/json",
								},
								// additional parameters
								data: function(params) {
									return {
										search: params.term,
										page: params.page
									};
								},
								processResults: function(data, params) {
									params.page = params.page || 1;
									return {
										results: data
									};
								},
								cache: false
							},
							minimumInputLength: 0,
						});
						TIMAAT.AnalysisListService.getTagList(item.id).then(function(data) {
							// console.log("TCL: then: data", data);
							var tagSelect = $('#mediumAnalysisList-tags-multi-select-dropdown');
							if (data.length > 0) {
								data.sort((a, b) => (a.name > b.name)? 1 : -1);
								// create the options and append to Select2
								var i = 0;
								for (; i < data.length; i++) {
									var option = new Option(data[i].name, data[i].id, true, true);
									tagSelect.append(option).trigger('change');
								}
								// manually trigger the 'select2:select' event
								tagSelect.trigger({
									type: 'select2:select',
									params: {
										data: data
									}
								});
							}
						});
					}

					if ( this.isOpen ) this.open('timaat-inspector-metadata');
					TIMAAT.VideoPlayer.updateListUI();
				break;
				case 'segment':
				case 'sequence':
				case 'take':
				case 'scene':
				case 'action':
					// metadata panel
					this.enablePanel('timaat-inspector-metadata');
					this.initInspectorMetadataSegmentElements();
					if (!item) this.open('timaat-inspector-metadata');

					// categories panel
					if (item != null) {
						this.enablePanel('timaat-inspector-categories-and-tags');
						$('#timaat-inspector-categories-and-tags-title').html('Kategorien');
					}

					// setup UI from Video Player state
					let model = {
						heading: '<i class="fas fa-indent"></i> '+type+' hinzufügen',
						submit: (item) ? "Speichern" : "Hinzufügen",
						name: "",
						shortDescription: "",
						comment: "",
						transcript: "",
						start: (item) ? item.model.startTime : TIMAAT.VideoPlayer.medium.currentTime * 1000,
						end: (item) ? item.model.endTime : TIMAAT.VideoPlayer.duration,
					};

					if (item) {
						switch (type) {
							case 'segment':
								model.heading ='<i class="fas fa-indent"></i> Segment bearbeiten';
								model.name =  item.model.analysisSegmentTranslations[0].name;
								model.shortDescription = item.model.analysisSegmentTranslations[0].shortDescription;
								model.comment =  item.model.analysisSegmentTranslations[0].comment;
								model.transcript = item.model.analysisSegmentTranslations[0].transcript;
								$('#timaat-analysissequence-add').removeClass("timaat-item-disabled");
								$('#timaat-analysissequence-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("sequence")');
								$('#timaat-analysisscene-add').removeClass("timaat-item-disabled");
								$('#timaat-analysisscene-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("scene")');
							break;
							case 'sequence':
								model.heading ='<i class="fas fa-indent"></i> Sequence bearbeiten';
								model.name =  item.model.analysisSequenceTranslations[0].name;
								model.shortDescription = item.model.analysisSequenceTranslations[0].shortDescription;
								model.comment =  item.model.analysisSequenceTranslations[0].comment;
								model.transcript = item.model.analysisSequenceTranslations[0].transcript;
								$('#timaat-analysistake-add').removeClass("timaat-item-disabled");
								$('#timaat-analysistake-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("take")');
							break;
							case 'scene':
								model.heading ='<i class="fas fa-indent"></i> Scene bearbeiten';
								model.name =  item.model.analysisSceneTranslations[0].name;
								model.shortDescription = item.model.analysisSceneTranslations[0].shortDescription;
								model.comment =  item.model.analysisSceneTranslations[0].comment;
								model.transcript = item.model.analysisSceneTranslations[0].transcript;
								$('#timaat-analysisaction-add').removeClass("timaat-item-disabled");
								$('#timaat-analysisaction-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("action")');
							break;
							case 'take':
								model.heading ='<i class="fas fa-indent"></i> Take bearbeiten';
								model.name =  item.model.analysisTakeTranslations[0].name;
								model.shortDescription = item.model.analysisTakeTranslations[0].shortDescription;
								model.comment =  item.model.analysisTakeTranslations[0].comment;
								model.transcript = item.model.analysisTakeTranslations[0].transcript;
							break;
							case 'action':
								model.heading ='<i class="fas fa-indent"></i> Action bearbeiten';
								model.name =  item.model.analysisActionTranslations[0].name;
								model.shortDescription = item.model.analysisActionTranslations[0].shortDescription;
								model.comment =  item.model.analysisActionTranslations[0].comment;
								model.transcript = item.model.analysisActionTranslations[0].transcript;
							break;
						}
					}
					if (!item) {
						switch (type) {
							case 'sequence':
							case 'scene':
								// Adjust start and end time if current player time is outside of current segment
								if (TIMAAT.VideoPlayer.medium.currentTime < TIMAAT.VideoPlayer.curSegment.model.startTime / 1000.0 || TIMAAT.VideoPlayer.medium.currentTime > TIMAAT.VideoPlayer.curSegment.model.endTime / 1000.0 ) {
									model.start = TIMAAT.VideoPlayer.curSegment.model.startTime;
									model.end = TIMAAT.VideoPlayer.curSegment.model.endTime;
								} else { // Adjust start and end time to match current time frame if within segment
									if (TIMAAT.VideoPlayer.medium.currentTime >= TIMAAT.VideoPlayer.curSegment.model.startTime / 1000.0 && TIMAAT.VideoPlayer.medium.currentTime < TIMAAT.VideoPlayer.curSegment.model.endTime / 1000.0 )
										model.start = TIMAAT.VideoPlayer.medium.currentTime * 1000;
										model.end = TIMAAT.VideoPlayer.curSegment.model.endTime;
								}
							break;
							case 'take':
								// Adjust start and end time if current player time is outside of current sequence
								if (TIMAAT.VideoPlayer.medium.currentTime < TIMAAT.VideoPlayer.curSequence.model.startTime / 1000.0 || TIMAAT.VideoPlayer.medium.currentTime > TIMAAT.VideoPlayer.curSequence.model.endTime / 1000.0 ) {
									model.start = TIMAAT.VideoPlayer.curSequence.model.startTime;
									model.end = TIMAAT.VideoPlayer.curSequence.model.endTime;
								} else { // Adjust start and end time to match current time frame if within sequence
									if (TIMAAT.VideoPlayer.medium.currentTime >= TIMAAT.VideoPlayer.curSequence.model.startTime / 1000.0 && TIMAAT.VideoPlayer.medium.currentTime < TIMAAT.VideoPlayer.curSequence.model.endTime / 1000.0 )
										model.start = TIMAAT.VideoPlayer.medium.currentTime * 1000;
										model.end = TIMAAT.VideoPlayer.curSequence.model.endTime;
								}
							break;
							case 'action':
								// Adjust start and end time if current player time is outside of current scene
								if (TIMAAT.VideoPlayer.medium.currentTime < TIMAAT.VideoPlayer.curScene.model.startTime / 1000.0 || TIMAAT.VideoPlayer.medium.currentTime > TIMAAT.VideoPlayer.curScene.model.endTime / 1000.0 ) {
									model.start = TIMAAT.VideoPlayer.curScene.model.startTime;
									model.end = TIMAAT.VideoPlayer.curScene.model.endTime;
								} else { // Adjust start and end time to match current time frame if within scene
									if (TIMAAT.VideoPlayer.medium.currentTime >= TIMAAT.VideoPlayer.curScene.model.startTime / 1000.0 && TIMAAT.VideoPlayer.medium.currentTime < TIMAAT.VideoPlayer.curScene.model.endTime / 1000.0 )
										model.start = TIMAAT.VideoPlayer.medium.currentTime * 1000;
										model.end = TIMAAT.VideoPlayer.curScene.model.endTime;
								}
							break;
						}
					}
					this.fillInspectorMetadataSegmentElements(model);

					if (item) {
						// category panel
						$('#segment-element-categories-multi-select-dropdown').val(null).trigger('change');
						if ($('#segment-element-categories-multi-select-dropdown').hasClass('select2-hidden-accessible')) {
							$('#segment-element-categories-multi-select-dropdown').select2('destroy');
						}
						$('#segment-element-categories-multi-select-dropdown').find('option').remove();

						$('.categoryAndTagPanel').hide();
						$('#mediumAnalysisListCategoryPanel').show();
						$('.mediumAnalysisListCategories').hide();
						$('#segment-element-categories').show();

						$('#segment-element-categories-multi-select-dropdown').select2({
							closeOnSelect: false,
							scrollAfterSelect: true,
							allowClear: true,
							minimumResultsForSearch: 10,
							ajax: {
								url: 'api/analysisList/'+type+'/'+item.model.id+'/category/selectList/',
								type: 'GET',
								dataType: 'json',
								delay: 250,
								headers: {
									"Authorization": "Bearer "+TIMAAT.Service.token,
									"Content-Type": "application/json",
								},
								// additional parameters
								data: function(params) {
									return {
										search: params.term,
										page: params.page
									};
								},
								processResults: function(data, params) {
									params.page = params.page || 1;
									return {
										results: data
									};
								},
								cache: false
							},
							minimumInputLength: 0,
						});
						TIMAAT.AnalysisListService.getSelectedCategories(item.model.id, type).then(function(data) {
							// console.log("TCL: then: data", data);
							var categorySelect = $('#segment-element-categories-multi-select-dropdown');
							if (data.length > 0) {
								data.sort((a, b) => (a.name > b.name)? 1 : -1);
								// create the options and append to Select2
								var i = 0;
								for (; i < data.length; i++) {
									var option = new Option(data[i].name, data[i].id, true, true);
									categorySelect.append(option).trigger('change');
								}
								// manually trigger the 'select2:select' event
								categorySelect.trigger({
									type: 'select2:select',
									params: {
										data: data
									}
								});
							}
						});
					}
					TIMAAT.VideoPlayer.updateListUI();
				break;
			}
		}

		initInspectorMetadataSegmentElements() {
			$('#timaat-inspector-meta-color-group').hide();
			$('#timaat-inspector-meta-opacity-group').hide();
			$('#timaat-inspector-meta-type-group').hide();
			$('#timaat-inspector-meta-timecode-group').show();
			$('#timaat-inspector-meta-shortDescription-group').show();
			$('#timaat-inspector-meta-comment-group').show();
			$('#timaat-inspector-meta-transcript-group').show();
		}

		fillInspectorMetadataSegmentElements(model) {
      // console.log("TCL: Inspector -> fillInspectorMetadataSegmentElements -> model", model);
			model.start = TIMAAT.Util.formatTime(model.start, true);
			model.end = TIMAAT.Util.formatTime(model.end, true);
			$('#timaat-inspector-metadata-title').html(model.heading);
			$('#timaat-inspector-meta-submit').html(model.submit);
			$('#timaat-inspector-meta-name').val(model.name).trigger('input');
			$('#timaat-inspector-meta-shortDescription').val(model.shortDescription).trigger('input');
			$('#timaat-inspector-meta-comment').summernote('code', model.comment);
			$('#timaat-inspector-meta-transcript').summernote('code', model.transcript);
			$('#timaat-inspector-meta-start').val(model.start);
			$('#timaat-inspector-meta-end').val(model.end);
		}

		updateItem() {
			if ( !this.state.item ) return;
			let model = {
				heading: $('#timaat-inspector-metadata-title').val(),
				submit: $('#timaat-inspector-meta-submit').val(),
				name: "",
				shortDescription: "",
				comment: "",
				transcript: "",
				start: 0,
				end: 0,
			};
			switch (this.state.type) {
				case 'annotation':
					var start = TIMAAT.Util.formatTime(this.state.item.startTime, true);
					var end = TIMAAT.Util.formatTime(this.state.item.endTime, true);
					// update UI
					// metadata panel
					$('#timaat-inspector-meta-start').val(start);
					$('#timaat-inspector-meta-end').val(end);

					// animation panel
					if ( this.state.item.isAnimation() ) {
						this.ui.addAnimButton.hide();
						this.ui.removeAnimButton.show();
					} else {
						this.ui.addAnimButton.show();
						this.ui.addAnimButton.prop('disabled', this.state.item.length == 0);
						if (TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.model.selectorSvgs[0].svgData == '{"keyframes":[{"time":0,"shapes":[]}]}') {
							 this.ui.addAnimButton.prop('disabled', true);
						}
						this.ui.removeAnimButton.hide();
					}
					// set keyframes
					this.ui.keyframeList.children().detach();
					for (let keyframe of this.state.item.svg.keyframes)
						this.ui.keyframeList.append(keyframe.ui.inspectorView);
				break;
				case 'segment':
					model.name = this.state.item.model.analysisSegmentTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisSegmentTranslations[0].shortDescription;
					model.comment = this.state.item.model.analysisSegmentTranslations[0].comment;
					model.transcript = this.state.item.model.analysisSegmentTranslations[0].transcript;
					model.start = this.state.item.model.startTime;
					model.end = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorMetadataSegmentElements(model);
				break;
				case 'sequence':
					model.name = this.state.item.model.analysisSequenceTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisSequenceTranslations[0].shortDescription;
					model.comment = this.state.item.model.analysisSequenceTranslations[0].comment;
					model.transcript = this.state.item.model.analysisSequenceTranslations[0].transcript;
					model.start = this.state.item.model.startTime;
					model.end = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorMetadataSegmentElements(model);
				break;
				case 'take':
					model.name = this.state.item.model.analysisTakeTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisTakeTranslations[0].shortDescription;
					model.comment = this.state.item.model.analysisTakeTranslations[0].comment;
					model.transcript = this.state.item.model.analysisTakeTranslations[0].transcript;
					model.start = this.state.item.model.startTime;
					model.end = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorMetadataSegmentElements(model);
				break;
				case 'scene':
					model.name = this.state.item.model.analysisSceneTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisSceneTranslations[0].shortDescription;
					model.comment = this.state.item.model.analysisSceneTranslations[0].comment;
					model.transcript = this.state.item.model.analysisSceneTranslations[0].transcript;
					model.start = this.state.item.model.startTime;
					model.end = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorMetadataSegmentElements(model);
				break;
				case 'action':
					model.name = this.state.item.model.analysisActionTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisActionTranslations[0].shortDescription;
					model.comment = this.state.item.model.analysisActionTranslations[0].comment;
					model.transcript = this.state.item.model.analysisActionTranslations[0].transcript;
					model.start = this.state.item.model.startTime;
					model.end = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorMetadataSegmentElements(model);
				break;
			}
		}

		setMetaEnd(milliseconds) {
			// console.log("TCL: setMetaEnd: function(milliseconds) ", milliseconds);
			var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
			var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
			if ( milliseconds == 0 ) {
				// 0 means current frame in video player
				milliseconds = TIMAAT.VideoPlayer.medium.currentTime * 1000 - startTime;
				milliseconds = Math.max(0, milliseconds);
			}
			endTime   = startTime+milliseconds;
			startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
			endTime   = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
			$('#timaat-inspector-meta-start').val(TIMAAT.Util.formatTime(startTime, true));
			$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTime, true));

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


	}

}, window));
