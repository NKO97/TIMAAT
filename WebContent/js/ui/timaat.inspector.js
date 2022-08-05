/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
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
				container  : 'mediaPlayerInspector',
				closeButton: true,
				position   : 'right',
			}).addTo(viewer);

			// activate floating inspector
			$('#mediaPlayerInspector').appendTo('#componentVideoPlayer');
			$('#mediaPlayerInspector').draggable({handle:'.inspector__title', containment:'#wrapper'});
			$('#mediaPlayerInspector .leaflet-sidebar-tabs ul:not(.inspector__tabs)').remove();
			// ul#list li:not(.active)

			// init state system
			this.state = {
					item: null,
					type: null,
			}

			// init UI
			this.ui = {};
			this.ui.addAnimButton = $('#inspectorAnimationAddButton');
			this.ui.removeAnimButton = $('#inspectorAnimationDeleteButton');
			this.ui.keyframeList = $('#inspectorAnimationKeyframes');
			let inspector = this;

			// actors panel
			this.ui.actorLang = {
				"decimal"          : ",",
				"thousands"        : ".",
				"search"           : "Search",
				"searchPlaceholder": "Search actors",
				"processing"       : '<i class="fas fa-spinner fa-spin"></i> Loading data...',
				"lengthMenu"       : "Show _MENU_ entries",
				"zeroRecords"      : "No Actors found.",
				"info"             : "Page _PAGE_ / _PAGES_ &middot; (_MAX_ total)",
				"infoEmpty"        : "No actors available.",
				"infoFiltered"     : '&mdash; <i class="fas fa-search"></i> _TOTAL_',
				"paginate"         : {
					"first"   : "<<",
					"previous": "<",
					"next"    : ">",
					"last"    : ">>"
				}
			};

			this.ui.dataTableActors = $('#annotationAvailableActorsTable').DataTable({
				lengthChange	: false,
				dom						: 'rft<"row"<"col-sm-10"i><"col-sm-2"p>>',
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

					actorElement.find('.addActor').on('click', actor, function(ev) {
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
					data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, actor, meta) {
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
								<span class="addActor badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw"></i></span>
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
								nameDisplay += `<div class="display--none">`+name.name+`</div>`;
							}
						});
						return nameDisplay;
					}
				}],
				language: this.ui.actorLang,
			});
//			$(this.ui.dataTableActors.table().container()).find('.table-title').text('Available Actors');

			this.ui.dataTableAnnoActors = $('#annotationActorsTable').DataTable({
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

					actorElement.find('.removeActor').on('click', actor, function(ev) {
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
					data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, actor, meta) {
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
						<span class="removeActor badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw"></i></span>
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
								nameDisplay += `<div class="display--none">`+name.name+`</div>`;
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
				"search"           : "Search",
				"searchPlaceholder": "Search events",
				"processing"       : '<i class="fas fa-spinner fa-spin"></i> Load data...',
				"lengthMenu"       : "Show _MENU_ entries",
				"zeroRecords"      : "No events found.",
				"info"             : "Page _PAGE_ / _PAGES_ &middot; (_MAX_ total)",
				"infoEmpty"        : "No events available.",
				"infoFiltered"     : '&mdash; <i class="fas fa-search"></i> _TOTAL_',
				"paginate"         : {
					"first"   : "<<",
					"previous": "<",
					"next"    : ">",
					"last"    : ">>"
				}
			};

			this.ui.dataTableEvents = $('#annotationAvailableEventsTable').DataTable({
				lengthChange	: false,
				dom						: 'rft<"row"<"col-sm-10"i><"col-sm-2"p>>',
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

					eventElement.find('.addEvent').on('click', event, function(ev) {
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
					data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, event, meta) {
						// console.log("TCL: event", event);
						let nameDisplay = `<p>` + event.eventTranslations[0].name +
								`<span class="addEvent badge btn btn-sm btn-success p-1 float-right"><i class="fas fa-plus fa-fw"></i></span>` +
							`</p>`;
						return nameDisplay;
					}
				}],
				language: this.ui.eventLang,
			});
			// $(this.ui.dataTableEvents.table().container()).find('.table-title').text('Available Events');

			this.ui.dataTableAnnoEvents = $('#annotationEventsTable').DataTable({
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

					eventElement.find('.removeEvent').on('click', event, function(ev) {
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
					data: 'id', name: 'name', className: 'name table--padding', render: function(data, type, event, meta) {
						// console.log("TCL: event", event);
						let nameDisplay = `<p>` + event.eventTranslations[0].name +
							`<span class="removeEvent badge btn btn-sm btn-danger p-1 float-right"><i class="fas fa-minus fa-fw"></i></span>` +
						`</p>`;
						return nameDisplay;
					}
				}],
				language: this.ui.eventLang,
			});

			// attach listeners
			$('#inspectorSubmitButton').on('click', async function(ev) {
				if ( !inspector.state.type ) return;
				if (TIMAAT.VideoPlayer.currentPermissionLevel < 2 && !(inspector.state.type == 'analysisList' && !inspector.state.item)) {
					$('#analysisListNoPermissionModal').modal('show');
					return;
				}
				// annotations
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					var title = $('#inspectorName').val();
					var opacity = Number($('#inspectorOpacity').val());
					let layerVisual = $('#inspectorVisualLayerCheckbox').is(":checked") ? true : false;
					let layerAudio = $('#inspectorAudioLayerCheckbox').is(":checked") ? true : false;
					if (TIMAAT.VideoPlayer.curAnalysisList.mediumType == 'audio') layerAudio = true; // layer display is invisible in audio but needs to be set
					if (TIMAAT.VideoPlayer.curAnalysisList.mediumType == 'image') layerVisual = true; // layer display is invisible in image but needs to be set
					var comment = $('#inspectorComment').summernote('code');
					comment = comment.substring(0,4096);
					$('#inspectorComment').summernote('code', comment);
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
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
					var title = $('#inspectorName').val();
					var comment = $('#inspectorComment').summernote('code');
					comment = comment.substring(0,4096);
					$('#inspectorComment').summernote('code', comment);
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
					var name = $('#inspectorName').val();
					var shortDescription = $('#inspectorShortDescription').val();
					var comment = $('#inspectorComment').summernote('code');
					comment = comment.substring(0,4096);
					$('#inspectorComment').summernote('code', comment);
					var transcript = $('#inspectorTranscript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					let i = 0;

					// early out: segment has no time range
					if (startTime == endTime) {
						$('#segmentElementModal').find('.modal-title').html('Segment has no time range');
						$('#segmentElementModal').find('.modal-body').html("Segments need to cover a spatial area. Start and end time may not be identical.");
						$('#segmentElementModal').modal('show');
						return;
					}
					// early out: segment's sequences and scenes do not exceed new time range
					if (segment) {
						let sequenceList = TIMAAT.VideoPlayer.curSegment.model.analysisSequences;
						i = 0;
						for (; i < sequenceList.length; i++) {
							if (startTime > sequenceList[i].startTime || endTime < sequenceList[i].endTime) {
								$('#segmentElementModal').find('.modal-title').html('Segment time interval too small');
								$('#segmentElementModal').find('.modal-body').html("The segment's time interval has to be large enough to encompass its elements. Remove or alter conflicting sequences and scenes first.");
								$('#segmentElementModal').modal('show');
								return;
							}
						}
						let sceneList = TIMAAT.VideoPlayer.curSegment.model.analysisScenes;
						i = 0;
						for (; i < sceneList.length; i++) {
							if (startTime > sceneList[i].startTime || endTime < sceneList[i].endTime) {
								$('#segmentElementModal').find('.modal-title').html('Segment time interval too small');
								$('#segmentElementModal').find('.modal-body').html("The segment's time interval has to be large enough to encompass its elements. Remove or alter conflicting sequences and scenes first.");
								$('#segmentElementModal').modal('show');
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
						$('#segmentElementModal').find('.modal-title').html('Segment is overlapping');
						$('#segmentElementModal').find('.modal-body').html("Segments are not allowed to overlap. Please check your start and end time values.");
						$('#segmentElementModal').modal('show');
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
					var name = $('#inspectorName').val();
					var shortDescription = $('#inspectorShortDescription').val();
					var comment = $('#inspectorComment').summernote('code');
					comment = comment.substring(0,4096);
					$('#inspectorComment').summernote('code', comment);
					var transcript = $('#inspectorTranscript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					let i = 0;

					// early out: sequence has no time range
					if (startTime == endTime) {
						$('#segmentElementModal').find('.modal-title').html('Sequence has no time range');
						$('#segmentElementModal').find('.modal-body').html("Sequences need to cover a spatial area. Start and end time may not be identical.");
						$('#segmentElementModal').modal('show');
						return;
					}
					// early out: sequence's time range exceeds segment's time range
					if (startTime < TIMAAT.VideoPlayer.curSegment.model.startTime || endTime > TIMAAT.VideoPlayer.curSegment.model.endTime) {
						$('#segmentElementModal').find('.modal-title').html('Sequence out of bounds');
						$('#segmentElementModal').find('.modal-body').html("The sequence's start and end time have to be within the range of the segment it belongs to.");
						$('#segmentElementModal').modal('show');
						return;
					}
					if (sequence) {
						// early out: sequence's takes do not exceed new time range
						let takeList = TIMAAT.VideoPlayer.curSequence.model.analysisTakes;
						i = 0;
						for (; i < takeList.length; i++) {
							if (startTime > takeList[i].startTime || endTime < takeList[i].endTime) {
								$('#segmentElementModal').find('.modal-title').html('Sequence time interval too small');
								$('#segmentElementModal').find('.modal-body').html("The sequence's time interval has to be large enough to encompass its elements. Remove or alter conflicting takes first.");
								$('#segmentElementModal').modal('show');
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
						$('#segmentElementModal').find('.modal-title').html('Sequence is overlapping');
						$('#segmentElementModal').find('.modal-body').html("Sequences are not allowed to overlap. Please check your start and end time values.");
						$('#segmentElementModal').modal('show');
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
					var name = $('#inspectorName').val();
					var shortDescription = $('#inspectorShortDescription').val();
					var comment = $('#inspectorComment').summernote('code');
					comment = comment.substring(0,4096);
					$('#inspectorComment').summernote('code', comment);
					var transcript = $('#inspectorTranscript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());

					// early out: take has no time range
					if (startTime == endTime) {
						$('#segmentElementModal').find('.modal-title').html('Take has no time range');
						$('#segmentElementModal').find('.modal-body').html("Takes need to cover a spatial area. Start and end time may not be identical.");
						$('#segmentElementModal').modal('show');
						return;
					}
					// early out: take's time range exceeds sequence's time range
					if (startTime < TIMAAT.VideoPlayer.curSequence.model.startTime || endTime > TIMAAT.VideoPlayer.curSequence.model.endTime) {
						$('#segmentElementModal').find('.modal-title').html('Take out of bounds');
						$('#segmentElementModal').find('.modal-body').html("The take's start and end time have to be within the range of the sequence it belongs to.");
						$('#segmentElementModal').modal('show');
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
						$('#segmentElementModal').find('.modal-title').html('Take is overlapping');
						$('#segmentElementModal').find('.modal-body').html("Takes are not allowed to overlap. Please check your start and end time values.");
						$('#segmentElementModal').modal('show');
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
					var name = $('#inspectorName').val();
					var shortDescription = $('#inspectorShortDescription').val();
					var comment = $('#inspectorComment').summernote('code');
					comment = comment.substring(0,4096);
					$('#inspectorComment').summernote('code', comment);
					var transcript = $('#inspectorTranscript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					let i = 0;

					// early out: scene has no time range
					if (startTime == endTime) {
						$('#segmentElementModal').find('.modal-title').html('Scene has no time range');
						$('#segmentElementModal').find('.modal-body').html("Scenes need to cover a spatial area. Start and end time may not be identical.");
						$('#segmentElementModal').modal('show');
						return;
					}
					// early out: scene's time range exceeds segment's time range
					if (startTime < TIMAAT.VideoPlayer.curSegment.model.startTime || endTime > TIMAAT.VideoPlayer.curSegment.model.endTime) {
						$('#segmentElementModal').find('.modal-title').html('Scene out of bounds');
						$('#segmentElementModal').find('.modal-body').html("The scene's start and end time have to be within the range of the segment it belongs to.");
						$('#segmentElementModal').modal('show');
						return;
					}
					// early out: scene's actions do not exceed new time range
					if (scene) {
						let actionList = TIMAAT.VideoPlayer.curScene.model.analysisActions;
						i = 0;
						for (; i < actionList.length; i++) {
							if (startTime > actionList[i].startTime || endTime < actionList[i].endTime) {
								$('#segmentElementModal').find('.modal-title').html('Scene time interval too small');
								$('#segmentElementModal').find('.modal-body').html("The scene's time interval has to be large enough to encompass its elements. Remove or alter conflicting actions first.");
								$('#segmentElementModal').modal('show');
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
						$('#segmentElementModal').find('.modal-title').html('Scene is overlapping');
						$('#segmentElementModal').find('.modal-body').html("Scenes are not allowed to overlap. Please check your start and end time values.");
						$('#segmentElementModal').modal('show');
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
					var name = $('#inspectorName').val();
					var shortDescription = $('#inspectorShortDescription').val();
					var comment = $('#inspectorComment').summernote('code');
					comment = comment.substring(0,4096);
					$('#inspectorComment').summernote('code', comment);
					var transcript = $('#inspectorTranscript').summernote('code');
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());

					// early out: action has no time range
					if (startTime == endTime) {
						$('#segmentElementModal').find('.modal-title').html('Action has no time range');
						$('#segmentElementModal').find('.modal-body').html("Actions need to cover a spatial area. Start and end time may not be identical.");
						$('#segmentElementModal').modal('show');
						return;
					}
					// early out: action's time range exceeds scene's time range
					if (startTime < TIMAAT.VideoPlayer.curScene.model.startTime || endTime > TIMAAT.VideoPlayer.curScene.model.endTime) {
						$('#segmentElementModal').find('.modal-title').html('Action out of bounds');
						$('#segmentElementModal').find('.modal-body').html("The action's start and end time have to be within the range of the scene it belongs to.");
						$('#segmentElementModal').modal('show');
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
						$('#segmentElementModal').find('.modal-title').html('Action is overlapping');
						$('#segmentElementModal').find('.modal-body').html("Actions are not allowed to overlap. Please check your start and end time values.");
						$('#segmentElementModal').modal('show');
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
				// music form elements
				if ( inspector.state.type == 'musicFormElement' ) {
					var musicFormElement = inspector.state.item;
          // console.log("TCL: Inspector -> $ -> inspector.state.item", inspector.state.item);
					var text = $('#inspectorLyrics').summernote('code');
					text = text.substring(0, 4096);
					$('#inspectorLyrics').summernote('code', text);
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					var repeatLastRow = $('#inspectorRepeatLastRow').is(':checked') ? true : false;
					let i = 0;
					let typeId = $('#musicFormElementTypeSelectionDropdown').val();

					// early out: musicFormElement has no time range
					if (startTime == endTime) {
						$('#musicFormElementModal').find('.modal-title').html('Music Form Element has no time range');
						$('#musicFormElementModal').find('.modal-body').html("Music Form Elements need to cover a spatial area. Start and end time may not be identical.");
						$('#musicFormElementModal').modal('show');
						return;
					}
					// musicFormElement has a time range and still encompasses its sub elements. Now check for overlap with other musicFormElementList
					var overlapping = false;
					i = 0;
					var musicFormElementList = [];
					if (TIMAAT.VideoPlayer.curMusic) musicFormElementList = TIMAAT.VideoPlayer.curMusic.musicFormElementList;
					if (musicFormElement) {
						let index = musicFormElementList.findIndex(({id}) => id === musicFormElement.model.id);
						musicFormElementList.splice(index,1);
					}
					for (; i < musicFormElementList.length; i++) {
						if (!(endTime <= musicFormElementList[i].startTime || startTime >= musicFormElementList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: musicFormElement overlaps with other musicFormElementList
					if (overlapping) {
						$('#musicFormElementModal').find('.modal-title').html('Music Form Element is overlapping');
						$('#musicFormElementModal').find('.modal-body').html("Music Form Elements are not allowed to overlap. Please check your start and end time values.");
						$('#musicFormElementModal').modal('show');
					} else {
						if (musicFormElement) {
							musicFormElement.model.musicFormElementTranslations[0].text = text;
							musicFormElement.model.startTime = startTime;
							musicFormElement.model.endTime = endTime;
							musicFormElement.model.repeatLastRow = repeatLastRow;
							musicFormElement.model.musicFormElementType = {};
							musicFormElement.model.musicFormElementType.id = typeId;

							// update musicFormElement UI
							await TIMAAT.VideoPlayer.updateMusicFormElement(musicFormElement);
						} else {
							var model = {
								id: 0,
								musicFormElementTranslations: [{
									id: 0,
									text: text,
								}],
								musicFormElementType: {
									id: typeId,
								},
								startTime: startTime,
								endTime: endTime,
								repeatLastRow: repeatLastRow
							};
							// let musicId = TIMAAT.MusicService.getMusicIdByMediumId(TIMAAT.VideoPlayer.model.medium.id);
							musicFormElement = await TIMAAT.MusicService.createMusicFormElement(model, TIMAAT.VideoPlayer.model.medium.music.id);
							musicFormElement = new TIMAAT.MusicFormElement(musicFormElement);
							TIMAAT.VideoPlayer._musicFormElementAdded(musicFormElement, true);
						}
						var tempMusic = await TIMAAT.MusicService.getMusic(TIMAAT.VideoPlayer.curMusic.id);
						TIMAAT.VideoPlayer.curMusic.musicFormElementList = tempMusic.musicFormElementList;
					}
				}
				// music change in tempo elements
				if ( inspector.state.type == 'musicChangeInTempoElement' ) {
					var musicChangeInTempoElement = inspector.state.item;
          // console.log("TCL: Inspector -> $ -> inspector.state.item", inspector.state.item);
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					let i = 0;
					let changeInTempoId = $('#musicChangeInTempoElementSelectDropdown').val();

					// early out: musicChangeInTempoElement has no time range
					if (startTime == endTime) {
						$('#musicChangeInTempoElementModal').find('.modal-title').html('Music Change In Tempo Element has no time range');
						$('#musicChangeInTempoElementModal').find('.modal-body').html("Music Change In Tempo Elements need to cover a spatial area. Start and end time may not be identical.");
						$('#musicChangeInTempoElementModal').modal('show');
						return;
					}
					// musicChangeInTempoElement has a time range and still encompasses its sub elements. Now check for overlap with other musicChangeInTempoElementList
					var overlapping = false;
					i = 0;
					var musicChangeInTempoElementList = [];
					if (TIMAAT.VideoPlayer.curMusic) musicChangeInTempoElementList = TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementList;
					if (musicChangeInTempoElement) {
						let index = musicChangeInTempoElementList.findIndex(({id}) => id === musicChangeInTempoElement.model.id);
						musicChangeInTempoElementList.splice(index,1);
					}
					for (; i < musicChangeInTempoElementList.length; i++) {
						if (!(endTime <= musicChangeInTempoElementList[i].startTime || startTime >= musicChangeInTempoElementList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: musicChangeInTempoElement overlaps with other musicChangeInTempoElementList
					if (overlapping) {
						$('#musicChangeInTempoElementModal').find('.modal-title').html('Music Change In Tempo Element is overlapping');
						$('#musicChangeInTempoElementModal').find('.modal-body').html("Music Change In Tempo Elements are not allowed to overlap. Please check your start and end time values.");
						$('#musicChangeInTempoElementModal').modal('show');
					} else {
						if (musicChangeInTempoElement) {
							musicChangeInTempoElement.model.startTime = startTime;
							musicChangeInTempoElement.model.endTime = endTime;
							musicChangeInTempoElement.model.changeInTempo = {};
							musicChangeInTempoElement.model.changeInTempo.id = changeInTempoId;

							// update musicChangeInTempoElement UI
							await TIMAAT.VideoPlayer.updateMusicChangeInTempoElement(musicChangeInTempoElement);
						} else {
							var model = {
								id: 0,
								changeInTempo: {
									id: changeInTempoId,
								},
								startTime: startTime,
								endTime: endTime,
							};
							// let musicId = TIMAAT.MusicService.getMusicIdByMediumId(TIMAAT.VideoPlayer.model.medium.id);
							musicChangeInTempoElement = await TIMAAT.MusicService.createMusicChangeInTempoElement(model, TIMAAT.VideoPlayer.model.medium.music.id);
							musicChangeInTempoElement = new TIMAAT.MusicChangeInTempoElement(musicChangeInTempoElement);
							TIMAAT.VideoPlayer._musicChangeInTempoElementAdded(musicChangeInTempoElement, true);
						}
						var tempMusic = await TIMAAT.MusicService.getMusic(TIMAAT.VideoPlayer.curMusic.id);
						TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementList = tempMusic.musicChangeInTempoElementList;
					}
				}
				// music articulation elements
				if ( inspector.state.type == 'musicArticulationElement' ) {
					var musicArticulationElement = inspector.state.item;
          // console.log("TCL: Inspector -> $ -> inspector.state.item", inspector.state.item);
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					let i = 0;
					let articulationId = $('#articulationElementSelectDropdown').val();

					// early out: musicArticulationElement has no time range
					if (startTime == endTime) {
						$('#musicArticulationElementModal').find('.modal-title').html('Music Articulation Element has no time range');
						$('#musicArticulationElementModal').find('.modal-body').html("Music Articulation Elements need to cover a spatial area. Start and end time may not be identical.");
						$('#musicArticulationElementModal').modal('show');
						return;
					}
					// musicArticulationElement has a time range and still encompasses its sub elements. Now check for overlap with other musicArticulationElementList
					var overlapping = false;
					i = 0;
					var musicArticulationElementList = [];
					if (TIMAAT.VideoPlayer.curMusic) musicArticulationElementList = TIMAAT.VideoPlayer.curMusic.musicArticulationElementList;
					if (musicArticulationElement) {
						let index = musicArticulationElementList.findIndex(({id}) => id === musicArticulationElement.model.id);
						musicArticulationElementList.splice(index,1);
					}
					for (; i < musicArticulationElementList.length; i++) {
						if (!(endTime <= musicArticulationElementList[i].startTime || startTime >= musicArticulationElementList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: musicArticulationElement overlaps with other musicArticulationElementList
					if (overlapping) {
						$('#musicArticulationElementModal').find('.modal-title').html('Music Articulation Element is overlapping');
						$('#musicArticulationElementModal').find('.modal-body').html("Music Articulation Elements are not allowed to overlap. Please check your start and end time values.");
						$('#musicArticulationElementModal').modal('show');
					} else {
						if (musicArticulationElement) {
							musicArticulationElement.model.startTime = startTime;
							musicArticulationElement.model.endTime = endTime;
							musicArticulationElement.model.articulation = {};
							musicArticulationElement.model.articulation.id = articulationId;

							// update musicArticulationElement UI
							await TIMAAT.VideoPlayer.updateMusicArticulationElement(musicArticulationElement);
						} else {
							var model = {
								id: 0,
								articulation: {
									id: articulationId,
								},
								startTime: startTime,
								endTime: endTime,
							};
							// let musicId = TIMAAT.MusicService.getMusicIdByMediumId(TIMAAT.VideoPlayer.model.medium.id);
							musicArticulationElement = await TIMAAT.MusicService.createMusicArticulationElement(model, TIMAAT.VideoPlayer.model.medium.music.id);
							musicArticulationElement = new TIMAAT.MusicArticulationElement(musicArticulationElement);
							TIMAAT.VideoPlayer._musicArticulationElementAdded(musicArticulationElement, true);
						}
						var tempMusic = await TIMAAT.MusicService.getMusic(TIMAAT.VideoPlayer.curMusic.id);
						TIMAAT.VideoPlayer.curMusic.musicArticulationElementList = tempMusic.musicArticulationElementList;
					}
				}
				// music dynamics elements
				if ( inspector.state.type == 'musicDynamicsElement' ) {
					var musicDynamicsElement = inspector.state.item;
          // console.log("TCL: Inspector -> $ -> inspector.state.item", inspector.state.item);
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					let i = 0;
					let typeId = $('#musicDynamicsElementSelectDropdown').val();

					// early out: musicDynamicsElement has no time range
					if (startTime == endTime) {
						$('#musicDynamicsElementModal').find('.modal-title').html('Music Text Setting Element has no time range');
						$('#musicDynamicsElementModal').find('.modal-body').html("Music Text Setting Elements need to cover a spatial area. Start and end time may not be identical.");
						$('#musicDynamicsElementModal').modal('show');
						return;
					}
					// musicDynamicsElement has a time range and still encompasses its sub elements. Now check for overlap with other musicDynamicsElementList
					var overlapping = false;
					i = 0;
					var musicDynamicsElementList = [];
					if (TIMAAT.VideoPlayer.curMusic) musicDynamicsElementList = TIMAAT.VideoPlayer.curMusic.musicDynamicsElementList;
					if (musicDynamicsElement) {
						let index = musicDynamicsElementList.findIndex(({id}) => id === musicDynamicsElement.model.id);
						musicDynamicsElementList.splice(index,1);
					}
					for (; i < musicDynamicsElementList.length; i++) {
						if (!(endTime <= musicDynamicsElementList[i].startTime || startTime >= musicDynamicsElementList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: musicDynamicsElement overlaps with other musicDynamicsElementList
					if (overlapping) {
						$('#musicDynamicsElementModal').find('.modal-title').html('Music Text Setting Element is overlapping');
						$('#musicDynamicsElementModal').find('.modal-body').html("Music Text Setting Elements are not allowed to overlap. Please check your start and end time values.");
						$('#musicDynamicsElementModal').modal('show');
					} else {
						if (musicDynamicsElement) {
							musicDynamicsElement.model.startTime = startTime;
							musicDynamicsElement.model.endTime = endTime;
							musicDynamicsElement.model.musicDynamicsElementType = {};
							musicDynamicsElement.model.musicDynamicsElementType.id = typeId;

							// update musicDynamicsElement UI
							await TIMAAT.VideoPlayer.updateMusicDynamicsElement(musicDynamicsElement);
						} else {
							var model = {
								id: 0,
								musicDynamicsElementType: {
									id: typeId,
								},
								startTime: startTime,
								endTime: endTime,
							};
							// let musicId = TIMAAT.MusicService.getMusicIdByMediumId(TIMAAT.VideoPlayer.model.medium.id);
							musicDynamicsElement = await TIMAAT.MusicService.createMusicDynamicsElement(model, TIMAAT.VideoPlayer.model.medium.music.id);
							musicDynamicsElement = new TIMAAT.MusicDynamicsElement(musicDynamicsElement);
							TIMAAT.VideoPlayer._musicDynamicsElementAdded(musicDynamicsElement, true);
						}
						var tempMusic = await TIMAAT.MusicService.getMusic(TIMAAT.VideoPlayer.curMusic.id);
						TIMAAT.VideoPlayer.curMusic.musicDynamicsElementList = tempMusic.musicDynamicsElementList;
					}
				}
				// music textSetting elements
				if ( inspector.state.type == 'musicTextSettingElement' ) {
					var musicTextSettingElement = inspector.state.item;
          // console.log("TCL: Inspector -> $ -> inspector.state.item", inspector.state.item);
					var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
					var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
					let i = 0;
					let typeId = $('#musicTextSettingElementSelectDropdown').val();

					// early out: musicTextSettingElement has no time range
					if (startTime == endTime) {
						$('#musicTextSettingElementModal').find('.modal-title').html('Music Text Setting Element has no time range');
						$('#musicTextSettingElementModal').find('.modal-body').html("Music Text Setting Elements need to cover a spatial area. Start and end time may not be identical.");
						$('#musicTextSettingElementModal').modal('show');
						return;
					}
					// musicTextSettingElement has a time range and still encompasses its sub elements. Now check for overlap with other musicTextSettingElementList
					var overlapping = false;
					i = 0;
					var musicTextSettingElementList = [];
					if (TIMAAT.VideoPlayer.curMusic) musicTextSettingElementList = TIMAAT.VideoPlayer.curMusic.musicTextSettingElementList;
					if (musicTextSettingElement) {
						let index = musicTextSettingElementList.findIndex(({id}) => id === musicTextSettingElement.model.id);
						musicTextSettingElementList.splice(index,1);
					}
					for (; i < musicTextSettingElementList.length; i++) {
						if (!(endTime <= musicTextSettingElementList[i].startTime || startTime >= musicTextSettingElementList[i].endTime) ) {
							overlapping = true;
							break;
						}
					}
					// early out: musicTextSettingElement overlaps with other musicTextSettingElementList
					if (overlapping) {
						$('#musicTextSettingElementModal').find('.modal-title').html('Music Text Setting Element is overlapping');
						$('#musicTextSettingElementModal').find('.modal-body').html("Music Text Setting Elements are not allowed to overlap. Please check your start and end time values.");
						$('#musicTextSettingElementModal').modal('show');
					} else {
						if (musicTextSettingElement) {
							musicTextSettingElement.model.startTime = startTime;
							musicTextSettingElement.model.endTime = endTime;
							musicTextSettingElement.model.musicTextSettingElementType = {};
							musicTextSettingElement.model.musicTextSettingElementType.id = typeId;

							// update musicTextSettingElement UI
							await TIMAAT.VideoPlayer.updateMusicTextSettingElement(musicTextSettingElement);
						} else {
							var model = {
								id: 0,
								musicTextSettingElementType: {
									id: typeId,
								},
								startTime: startTime,
								endTime: endTime,
							};
							// let musicId = TIMAAT.MusicService.getMusicIdByMediumId(TIMAAT.VideoPlayer.model.medium.id);
							musicTextSettingElement = await TIMAAT.MusicService.createMusicTextSettingElement(model, TIMAAT.VideoPlayer.model.medium.music.id);
							musicTextSettingElement = new TIMAAT.MusicTextSettingElement(musicTextSettingElement);
							TIMAAT.VideoPlayer._musicTextSettingElementAdded(musicTextSettingElement, true);
						}
						var tempMusic = await TIMAAT.MusicService.getMusic(TIMAAT.VideoPlayer.curMusic.id);
						TIMAAT.VideoPlayer.curMusic.musicTextSettingElementList = tempMusic.musicTextSettingElementList;
					}
				}
			});

			$('#inspectorVisualLayerCheckbox').on('click', function(event) {
				// if svg and/or animation data is available, prevent un-checking
				if (!$('#inspectorVisualLayerCheckbox').is(":checked") && TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.model.selectorSvgs[0].svgData != '{"keyframes":[{"time":0,"shapes":[]}]}') {
					event.preventDefault();
					$('#annotationAnalysisLayerInUseModal').modal('show');
					return;
				}
				// if an analysis is attached that is only available for the visual-layer, prevent un-checking
				if (!$('#inspectorVisualLayerCheckbox').is(":checked")) {
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
							$('#annotationAnalysisLayerInUseModal').modal('show');
							return;
						}
					}
				}
				// if both checkboxes are unchecked after un-checking a checkbox, check the other one
				if (!$('#inspectorVisualLayerCheckbox').is(":checked") && !$('#inspectorAudioLayerCheckbox').is(":checked")) {
					$('#inspectorAudioLayerCheckbox').prop("checked", true);
				}
			});

			$('#inspectorAudioLayerCheckbox').on('click', function(event) {
				if (!$('#inspectorAudioLayerCheckbox').is(":checked")) {
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
							$('#annotationAnalysisLayerInUseModal').modal('show');
							return;
						}
					}
				}
				// if both checkboxes are unchecked after un-checking a checkbox, check the other one
				if (!$('#inspectorAudioLayerCheckbox').is(":checked") && !$('#inspectorVisualLayerCheckbox').is(":checked")) {
					$('#inspectorVisualLayerCheckbox').prop("checked", true);
				}
			});

			$('#inspectorDeleteButton').on('click', function() {
				//* musicFormElement is not part of an analysisList and therefore modifying is not restricted to certain users
				if (inspector.state.type == 'musicFormElement') {
					TIMAAT.VideoPlayer.removeMusicFormElement(TIMAAT.VideoPlayer.curMusicFormElement);
				}
				//* musicChangeInTempoElement is not part of an analysisList and therefore modifying is not restricted to certain users
				if (inspector.state.type == 'musicChangeInTempoElement') {
					TIMAAT.VideoPlayer.removeMusicChangeInTempoElement(TIMAAT.VideoPlayer.curMusicChangeInTempoElement);
				}
				//* musicArticulationElement is not part of an analysisList and therefore modifying is not restricted to certain users
				if (inspector.state.type == 'musicArticulationElement') {
					TIMAAT.VideoPlayer.removeMusicArticulationElement(TIMAAT.VideoPlayer.curMusicArticulationElement);
				}
				//* musicDynamicsElement is not part of an analysisList and therefore modifying is not restricted to certain users
				if (inspector.state.type == 'musicDynamicsElement') {
					TIMAAT.VideoPlayer.removeMusicDynamicsElement(TIMAAT.VideoPlayer.curMusicDynamicsElement);
				}
				//* musicTextSettingElement is not part of an analysisList and therefore modifying is not restricted to certain users
				if (inspector.state.type == 'musicTextSettingElement') {
					TIMAAT.VideoPlayer.removeMusicTextSettingElement(TIMAAT.VideoPlayer.curMusicTextSettingElement);
				}
				//* check if user has enough permission to change analysisList content
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
			$('#inspectorColorPicker').tinycolorpicker();
			this.cp = $('#inspectorColorPicker').data("plugin_tinycolorpicker");
			this.cp.setColor('rgb(3, 145, 206)');

			$('#inspectorName').on('input', function(ev) {
				if ( $('#inspectorName').val().length > 0 ) {
					$('#inspectorSubmitButton').prop('disabled', false);
					$('#inspectorSubmitButton').removeAttr('disabled');
				} else {
					$('#inspectorSubmitButton').prop('disabled', true);
					$('#inspectorSubmitButton').attr('disabled');
				}
			});

			$('#musicFormElementTypeSelectionDropdown').on('change', function(ev) {
				if ( $('#musicFormElementTypeSelectionDropdown').val() > 0 ) {
					$('#inspectorSubmitButton').prop('disabled', false);
					$('#inspectorSubmitButton').removeAttr('disabled');
				} else {
					$('#inspectorSubmitButton').prop('disabled', true);
					$('#inspectorSubmitButton').attr('disabled');
				}
			});

			$('#musicChangeInTempoElementSelectDropdown').on('change', function(ev) {
				if ( $('#musicChangeInTempoElementSelectDropdown').val() > 0 ) {
					$('#inspectorSubmitButton').prop('disabled', false);
					$('#inspectorSubmitButton').removeAttr('disabled');
				} else {
					$('#inspectorSubmitButton').prop('disabled', true);
					$('#inspectorSubmitButton').attr('disabled');
				}
			});

			$('#articulationElementSelectDropdown').on('change', function(ev) {
				if ( $('#articulationElementSelectDropdown').val() > 0 ) {
					$('#inspectorSubmitButton').prop('disabled', false);
					$('#inspectorSubmitButton').removeAttr('disabled');
				} else {
					$('#inspectorSubmitButton').prop('disabled', true);
					$('#inspectorSubmitButton').attr('disabled');
				}
			});

			$('#musicDynamicsElementSelectDropdown').on('change', function(ev) {
				if ( $('#musicDynamicsElementSelectDropdown').val() > 0 ) {
					$('#inspectorSubmitButton').prop('disabled', false);
					$('#inspectorSubmitButton').removeAttr('disabled');
				} else {
					$('#inspectorSubmitButton').prop('disabled', true);
					$('#inspectorSubmitButton').attr('disabled');
				}
			});

			$('#musicTextSettingElementSelectDropdown').on('change', function(ev) {
				if ( $('#musicTextSettingElementSelectDropdown').val() > 0 ) {
					$('#inspectorSubmitButton').prop('disabled', false);
					$('#inspectorSubmitButton').removeAttr('disabled');
				} else {
					$('#inspectorSubmitButton').prop('disabled', true);
					$('#inspectorSubmitButton').attr('disabled');
				}
			});

			// $('#inspectorColorPicker').on('change', function(event) {
      //   if ( inspector.state.type == 'annotation' ) {
			// 		console.log("TCL: Inspector -> inspectorColorPicker -> on change");
			// 		let anno = inspector.state.item;
      //     console.log("TCL: Inspector -> $ -> anno", anno);
			// 		if (!anno) return;
			// 		let color = $('#inspectorColorPicker').data("plugin_tinycolorpicker").colorHex;
      //     console.log("TCL: Inspector -> $ -> color", color);
			// 		for (let item of anno.svg.items) {
			// 			item.setStyle({color: + color });
			// 		};
			// 		// inspector.state.item = anno; // needed?
			// 	}
			// })

			$('#inspectorOpacity').on('change input', function(ev) {
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					if ( !anno ) return;
					let opacity = Number($('#inspectorOpacity').val());
					anno.opacity = opacity;
					if ( opacity == 0 && anno.stroke == 0 ) $('#inspectorOutlineButton').trigger('click');
				}
			});

			$('#inspectorOutlineButton').on('click', function(ev) {
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					var stroke = $(this).hasClass('btn-primary') ? 0 : 2;

					if ( anno.opacity == 0 && stroke == 0 ) return;
					anno.stroke = stroke;

					inspector._setInspectorStroke(anno.stroke);
				}
			});

			$('#inspectorStartTimecode, #inspectorEndTimecode').on('blur change', function(ev) {
				var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
				var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
				startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
				endTime = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
				$('#inspectorStartTimecode').val(TIMAAT.Util.formatTime(startTime, true));
				$('#inspectorEndTimecode').val(TIMAAT.Util.formatTime(endTime, true));

				if ( inspector.state.item && inspector.state.type == 'annotation' ) {
					inspector.state.item.startTime = startTime;
					inspector.state.item.endTime = endTime;
					inspector.state.item.marker.updateView();
				}
			});

			$('#inspectorStartTimecodeSetCurrentTime').on('click', function() {
				var startTimeInMs = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
				var endTimeInMs = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
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
				$('#inspectorStartTimecode').val(TIMAAT.Util.formatTime(startTimeInMs, true));
				endTimeInMs = startTimeInMs + durationInMs;
				$('#inspectorEndTimecode').val(TIMAAT.Util.formatTime(endTimeInMs, true));
				$('#inspectorStartTimecode').trigger('blur');
			});

			$('#inspectorEndTimecodeSetCurrentTime').on('click', function() {
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
				$('#inspectorEndTimecode').val(TIMAAT.Util.formatTime(endTimeInMs, true));
				$('#inspectorStartTimecode').trigger('blur');
			});

			$('#inspectorEndTimecodeDuration').change(function(ev) {
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
					$('#inspectorVisualLayerCheckbox').prop('checked', true);

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
			return !$('#mediaPlayerInspector').hasClass('collapsed');
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
				$('#mediaPlayerInspector').removeClass('leaflet-sidebar-left');
				$('.leaflet-sidebar-close i').attr('class', 'fa fa-caret-right');
			} else {
				this.setPosition('left');
				$('#mediaPlayerInspector').removeClass('leaflet-sidebar-right');
				$('.leaflet-sidebar-close i').attr('class', 'fa fa-caret-left');
			}
		}

		setItem(item, type=null) {
      // console.log("TCL: Inspector -> setItem -> item, type", item, type);
			this.state.item = item;
			this.state.type = type;

			// hide segment substructure elements
			$('.addSegmentSubElement').addClass("item--disabled");
			$('.addSegmentSubElement').removeAttr('onclick');

			$('#segmentElementCategoriesForm').data('type', type);

			// metadata panel default UI setting
			$('#inspectorStartTimecode').prop('disabled', false);
			$('#inspectorStartTimecodeSetCurrentTime').prop('disabled', false);
			$('#inspectorEndTimecode').prop('disabled', false);
			$('#inspectorEndTimecodeSetCurrentTime').prop('disabled', false);
			$('#inspectorEndTimecodeSetEndTimeDropdown').prop('disabled', false);

			if (item) {
				$('#inspectorDeleteButton').prop('disabled', false);
				$('#inspectorDeleteButton').removeAttr('disabled');
				$('#inspectorDeleteButton').show();
			} else {
				$('#inspectorDeleteButton').prop('disabled', true);
				$('#inspectorDeleteButton').attr('disabled');
				$('#inspectorDeleteButton').hide();
			}

			// animation panel default UI setting
			this.disablePanel('inspectorAnimation');
			this.disablePanel('inspectorCategoriesAndTags');
			this.disablePanel('inspectorActors');
			this.disablePanel('inspectorEvents');
			// this.disablePanel('inspectorLocations');
			this.disablePanel('inspectorAnalysisGuidelines');
			this.ui.keyframeList.children().detach();

			// actors panel default UI setting
			this.ui.dataTableAnnoActors.ajax.url('api/annotation/0/actors');

			// analysis panel default UI setting
			TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.url('api/annotation/0/analysis');

			// events panel default UI setting
			this.ui.dataTableAnnoEvents.ajax.url('api/annotation/0/events');

			let model = {};

			switch (type) {
				case undefined:
				case null:
					if ( this.isOpen ) this.open('inspectorMetadata');
					this.disablePanel('inspectorMetadata');
					$('#inspectorTitle').html('No element selected');
				break;
				case 'annotation':
					if (!item) {
						TIMAAT.VideoPlayer.curAnnotation = null;
					}
					this.enablePanel('inspectorMetadata');
					// animation panel
					if ( TIMAAT.VideoPlayer.model.medium.mediumVideo ) this.enablePanel('inspectorAnimation');
					else this.disablePanel('inspectorAnimation');
					if ( item != null ) {
						this.enablePanel('inspectorActors');
						this.enablePanel('inspectorEvents');
						// this.enablePanel('inspectorLocations');
						this.enablePanel('inspectorAnalysisGuidelines');
						this.enablePanel('inspectorCategoriesAndTags');
					}
					// metadata panel
					$('#inspectorName').show();
					$('#inspectorColorGroup').show();
					$('#inspectorOpacityGroup').show();
					if ( TIMAAT.VideoPlayer.model.medium.mediumVideo) $('#inspectorTypeGroup').show(); // TODO may have to change when new media types can be annotated
					else $('#inspectorTypeGroup').hide();
					if ( TIMAAT.VideoPlayer.duration > 0 ) $('#inspectorTimecodeGroup').show();
					else $('#inspectorTimecodeGroup').hide();
					if (item) {
						$('#inspectorStartTimecode').prop('disabled', item.isAnimation());
						$('#inspectorStartTimecodeSetCurrentTime').prop('disabled', item.isAnimation());
						$('#inspectorEndTimecode').prop('disabled', item.isAnimation());
						$('#inspectorEndTimecodeSetCurrentTime').prop('disabled', item.isAnimation());
						$('#inspectorEndTimecodeSetEndTimeDropdown').prop('disabled', item.isAnimation());
					}
					$('#inspectorShortDescriptionGroup').hide();
					$('#inspectorCommentGroup').show();
					$('#inspectorTranscriptGroup').hide();
					$('#inspectorMusicFormElementTypeGroup').hide();
					$('#inspectorLyricsGroup').hide();
					$('#inspectorMusicRepeatLastRowGroup').hide();
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
					$('#inspectorTitle').html(heading);
					$('#inspectorSubmitButton').html(submit);
					this.cp.setColor('#'+colorHex);
					$('#inspectorName').val(title).trigger('input');
					$('#inspectorOpacity').val(opacity);
					this._setInspectorStroke(stroke);
					if (layerVisual) {
						$('#inspectorVisualLayerCheckbox').prop('checked', true);
					} else {
						$('#inspectorVisualLayerCheckbox').prop('checked', false);
					}
					if (layerAudio) {
						$('#inspectorAudioLayerCheckbox').prop('checked', true);
					} else {
						$('#inspectorAudioLayerCheckbox').prop('checked', false);
					}
					$('#inspectorComment').summernote('code', comment);
					$('#inspectorStartTimecode').val(start);
					$('#inspectorEndTimecode').val(end);
					$('#inspectorCategoriesAndTagsTitle').html('Categories and tags');

					if ( !anno ) this.open('inspectorMetadata');
					else this.updateItem();

					if ( item ) {
						// console.log("TCL: Inspector -> setItem -> item", item);
						// actors panel
						this.ui.dataTableAnnoActors.ajax.url('api/annotation/'+item.model.id+'/actors');
						this.ui.dataTableAnnoActors.ajax.reload();
						this.ui.dataTableActors.ajax.reload();
						if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
							$('#inspectorAddActors').hide();
							$('#inspectorAddEvents').hide();
							$('#inspectorAddAnalysisGuidelines').hide();
						} else {
							$('#inspectorAddActors').show();
							$('#inspectorAddEvents').show();
							$('#inspectorAddAnalysisGuidelines').show();
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
						$('#annotationCategoriesMultiSelectDropdown').val(null).trigger('change');
						if ($('#annotationCategoriesMultiSelectDropdown').hasClass('select2-hidden-accessible')) {
							$('#annotationCategoriesMultiSelectDropdown').select2('destroy');
						}
						$('#annotationCategoriesMultiSelectDropdown').find('option').remove();

						$('#annotationTagsMultiSelectDropdown').val(null).trigger('change');
						if ($('#annotationTagsMultiSelectDropdown').hasClass('select2-hidden-accessible')) {
							$('#annotationTagsMultiSelectDropdown').select2('destroy');
						}
						$('#annotationTagsMultiSelectDropdown').find('option').remove();

						$('.categoryAndTagPanel').hide();
						$('#mediumAnalysisListCategoryPanel').show();
						$('.mediumAnalysisListCategories').hide();
						$('#annotationCategories').show();
						$('#annotationTagPanel').show();

						$('#annotationCategoriesMultiSelectDropdown').select2({
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
							var categorySelect = $('#annotationCategoriesMultiSelectDropdown');
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

						$('#annotationTagsMultiSelectDropdown').select2({
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
							var tagSelect = $('#annotationTagsMultiSelectDropdown');
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
					this.enablePanel('inspectorMetadata');
					this.initInspectorAnalysisElements();
					var list = item;
					if ( !list ) this.open('inspectorMetadata');
					var heading = (list) ? '<i class="fas fa-list-alt"></i> Edit analysis' : '<i class="fas fa-list-alt"></i> Add analysis';
					var submit = (list) ? "Save" : "Add";
					var title = (list) ? TIMAAT.Util.getDefaultTranslation(list, 'mediumAnalysisListTranslations', 'title') : "";
					var comment = (list) ? TIMAAT.Util.getDefaultTranslation(list, 'mediumAnalysisListTranslations', 'text') : "";
					// setup UI from Video Player state
					$('#inspectorTitle').html(heading);
					$('#inspectorSubmitButton').html(submit);
					$('#inspectorName').val(title).trigger('input');
					$('#inspectorComment').summernote('code', comment);
					$('#inspectorCategoriesAndTagsTitle').html('Category sets and tags');
					if ( item != null ) {
						$('#AnalysisCategorySetsMultiSelectDropdown').val(null).trigger('change');
						if ($('#AnalysisCategorySetsMultiSelectDropdown').hasClass('select2-hidden-accessible')) {
							$('#AnalysisCategorySetsMultiSelectDropdown').select2('destroy');
						}
						$('#AnalysisCategorySetsMultiSelectDropdown').find('option').remove();

						$('#mediumAnalysisTagsMultiSelectDropdown').val(null).trigger('change');
						if ($('#mediumAnalysisTagsMultiSelectDropdown').hasClass('select2-hidden-accessible')) {
							$('#mediumAnalysisTagsMultiSelectDropdown').select2('destroy');
						}
						$('#mediumAnalysisTagsMultiSelectDropdown').find('option').remove();

						$('.categoryAndTagPanel').hide();
						$('#mediumAnalysisListCategorySetPanel').show();
						$('#mediumAnalysisListTagPanel').show();
						this.enablePanel('inspectorCategoriesAndTags');

						$('#AnalysisCategorySetsMultiSelectDropdown').select2({
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
							var categorySetSelect = $('#AnalysisCategorySetsMultiSelectDropdown');
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

						$('#mediumAnalysisTagsMultiSelectDropdown').select2({
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
							var tagSelect = $('#mediumAnalysisTagsMultiSelectDropdown');
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

					if ( this.isOpen ) this.open('inspectorMetadata');
					TIMAAT.VideoPlayer.updateListUI();
				break;
				case 'segment':
				case 'sequence':
				case 'take':
				case 'scene':
				case 'action':
					// metadata panel
					this.enablePanel('inspectorMetadata');
					this.initInspectorSegmentElements();
					if (!item) this.open('inspectorMetadata');

					// categories panel
					if (item != null) {
						this.enablePanel('inspectorCategoriesAndTags');
						$('#inspectorCategoriesAndTagsTitle').html('Categories');
					}

					// setup UI from Video Player state
					model = {
						heading: '<i class="fas fa-indent"></i> Add '+type,
						submit: (item) ? "Save" : "Add",
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
								model.comment          = item.model.analysisSegmentTranslations[0].comment;
								model.heading          = '<i class="fas fa-indent"></i> Edit segment';
								model.name             = item.model.analysisSegmentTranslations[0].name;
								model.shortDescription = item.model.analysisSegmentTranslations[0].shortDescription;
								model.transcript       = item.model.analysisSegmentTranslations[0].transcript;
								$('.addSequence').removeClass("item--disabled");
								$('.addSequence').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("sequence")');
								$('.addScene').removeClass("item--disabled");
								$('.addScene').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("scene")');
							break;
							case 'sequence':
								model.heading          = '<i class="fas fa-indent"></i> Edit sequence';
								model.name             = item.model.analysisSequenceTranslations[0].name;
								model.shortDescription = item.model.analysisSequenceTranslations[0].shortDescription;
								model.comment          = item.model.analysisSequenceTranslations[0].comment;
								model.transcript       = item.model.analysisSequenceTranslations[0].transcript;
								$('.addTake').removeClass("item--disabled");
								$('.addTake').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("take")');
							break;
							case 'scene':
								model.heading          = '<i class="fas fa-indent"></i> Edit scene';
								model.name             = item.model.analysisSceneTranslations[0].name;
								model.shortDescription = item.model.analysisSceneTranslations[0].shortDescription;
								model.comment          = item.model.analysisSceneTranslations[0].comment;
								model.transcript       = item.model.analysisSceneTranslations[0].transcript;
								$('.addAction').removeClass("item--disabled");
								$('.addAction').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSegmentElement("action")');
							break;
							case 'take':
								model.heading          = '<i class="fas fa-indent"></i> Edit take';
								model.name             = item.model.analysisTakeTranslations[0].name;
								model.shortDescription = item.model.analysisTakeTranslations[0].shortDescription;
								model.comment          = item.model.analysisTakeTranslations[0].comment;
								model.transcript       = item.model.analysisTakeTranslations[0].transcript;
							break;
							case 'action':
								model.heading          = '<i class="fas fa-indent"></i> Edit action';
								model.name             = item.model.analysisActionTranslations[0].name;
								model.shortDescription = item.model.analysisActionTranslations[0].shortDescription;
								model.comment          = item.model.analysisActionTranslations[0].comment;
								model.transcript       = item.model.analysisActionTranslations[0].transcript;
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
					this.fillInspectorSegmentElements(model);

					if (item) {
						// category panel
						$('#segmentElementCategoriesMultiSelectDropdown').val(null).trigger('change');
						if ($('#segmentElementCategoriesMultiSelectDropdown').hasClass('select2-hidden-accessible')) {
							$('#segmentElementCategoriesMultiSelectDropdown').select2('destroy');
						}
						$('#segmentElementCategoriesMultiSelectDropdown').find('option').remove();

						$('.categoryAndTagPanel').hide();
						$('#mediumAnalysisListCategoryPanel').show();
						$('.mediumAnalysisListCategories').hide();
						$('#segmentElementCategories').show();

						$('#segmentElementCategoriesMultiSelectDropdown').select2({
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
							var categorySelect = $('#segmentElementCategoriesMultiSelectDropdown');
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
				case 'musicFormElement':
					// metadata panel
					this.enablePanel('inspectorMetadata');
					this.initInspectorMusicFormElements();
					if (!item) this.open('inspectorMetadata');

					// setup UI from Video Player state
					model = {
						heading      : '<i class="fas fa-indent"></i> Add form element',
						submit       : (item) ? "Save"                                 : "Add",
						type         : null,
						text         : '',
						repeatLastRow: false,
						start        : (item) ? item.model.startTime                   : TIMAAT.VideoPlayer.medium.currentTime * 1000,
						end          : (item) ? item.model.endTime                     : TIMAAT.VideoPlayer.duration,
					};

					if (item) {
						model.heading       = '<i class="fas fa-indent"></i> Edit music form element';
						model.repeatLastRow = item.model.repeatLastRow;
						model.text          = item.model.musicFormElementTranslations[0].text;
						model.type          = item.model.musicFormElementType.id;
					}
					this.fillInspectorMusicFormElements(model);
					(model.repeatLastRow) ? $('#inspectorRepeatLastRow').prop('checked', true) : $('#inspectorRepeatLastRow').prop('checked', false);
					// category panel
					// $('#musicFormElementTypeSelectionDropdown').empty().trigger('change');
					$('#musicFormElementTypeSelectionDropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/music/formElementType/selectList/',
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
					if (item && item.model.musicFormElementType) {
						var musicFormElementTypeSelect = $('#musicFormElementTypeSelectionDropdown');
						var option = new Option(item.model.musicFormElementType.musicFormElementTypeTranslations[0].type, item.model.musicFormElementType.id, true, true);
						musicFormElementTypeSelect.append(option).trigger('change');
					} else {
						$('#musicFormElementTypeSelectionDropdown').empty().trigger('change');
					}
					TIMAAT.VideoPlayer.updateListUI();
				break;
				case 'musicChangeInTempoElement':
					// metadata panel
					this.enablePanel('inspectorMetadata');
					this.initInspectorMusicChangeInTempoElements();
					if (!item) this.open('inspectorMetadata');

					// setup UI from Video Player state
					model = {
						heading: '<i class="fas fa-indent"></i> Add change in tempo element',
						submit: (item) ? "Save" : "Add",
						type: null,
						start: (item) ? item.model.startTime : TIMAAT.VideoPlayer.medium.currentTime * 1000,
						end: (item) ? item.model.endTime : TIMAAT.VideoPlayer.duration,
					};

					if (item) {
						model.heading = '<i class="fas fa-indent"></i> Edit change in tempo element';
						model.type    = item.model.changeInTempo.id;
					}
					this.fillInspectorMusicChangeInTempoElements(model);
					// category panel
					// $('#musicChangeInTempoElementSelectDropdown').empty().trigger('change');
					$('#musicChangeInTempoElementSelectDropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/music/changeInTempoElement/selectList/',
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
					if (item && item.model.changeInTempo) {
						var changeInTempoSelect = $('#musicChangeInTempoElementSelectDropdown');
						var option = new Option(item.model.changeInTempo.changeInTempoTranslations[0].type, item.model.changeInTempo.id, true, true);
						changeInTempoSelect.append(option).trigger('change');
					} else {
						$('#musicChangeInTempoElementSelectDropdown').empty().trigger('change');
					}
					TIMAAT.VideoPlayer.updateListUI();
				break;
				case 'musicArticulationElement':
					// metadata panel
					this.enablePanel('inspectorMetadata');
					this.initInspectorMusicArticulationElements();
					if (!item) this.open('inspectorMetadata');

					// setup UI from Video Player state
					model = {
						heading: '<i class="fas fa-indent"></i> Add articulation element',
						submit : (item) ? "Save"                                         : "Add",
						type   : null,
						start  : (item) ? item.model.startTime                           : TIMAAT.VideoPlayer.medium.currentTime * 1000,
						end    : (item) ? item.model.endTime                             : TIMAAT.VideoPlayer.duration,
					};

					if (item) {
						model.heading = '<i class="fas fa-indent"></i> Edit articulation element';
						model.type    = item.model.articulation.id;
					}
					this.fillInspectorMusicArticulationElements(model);
					// category panel
					// $('#articulationElementSelectDropdown').empty().trigger('change');
					$('#articulationElementSelectDropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/music/articulationElement/selectList/',
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
					if (item && item.model.articulation) {
						var articulationSelect = $('#articulationElementSelectDropdown');
						var option = new Option(item.model.articulation.articulationTranslations[0].type, item.model.articulation.id, true, true);
						articulationSelect.append(option).trigger('change');
					} else {
						$('#articulationElementSelectDropdown').empty().trigger('change');
					}
					TIMAAT.VideoPlayer.updateListUI();
				break;
				case 'musicDynamicsElement':
					// metadata panel
					this.enablePanel('inspectorMetadata');
					this.initInspectorMusicDynamicsElements();
					if (!item) this.open('inspectorMetadata');

					// setup UI from Video Player state
					model = {
						heading: '<i class="fas fa-indent"></i> Add dynamics element',
						submit : (item) ? "Save"                                     : "Add",
						type   : null,
						start  : (item) ? item.model.startTime                       : TIMAAT.VideoPlayer.medium.currentTime * 1000,
						end    : (item) ? item.model.endTime                         : TIMAAT.VideoPlayer.duration,
					};

					if (item) {
						model.heading = '<i class="fas fa-indent"></i> Edit dynamics element';
						model.type    = item.model.musicDynamicsElementType.id;
					}
					this.fillInspectorMusicDynamicsElements(model);
					// category panel
					// $('#musicDynamicsElementSelectDropdown').empty().trigger('change');
					$('#musicDynamicsElementSelectDropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/music/musicDynamicsElementType/selectList/',
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
					if (item && item.model.musicDynamicsElementType) {
						var musicDynamicsElementTypeSelect = $('#musicDynamicsElementSelectDropdown');
						var option = new Option(item.model.musicDynamicsElementType.musicDynamicsElementTypeTranslations[0].type, item.model.musicDynamicsElementType.id, true, true);
						musicDynamicsElementTypeSelect.append(option).trigger('change');
					} else {
						$('#musicDynamicsElementSelectDropdown').empty().trigger('change');
					}
					TIMAAT.VideoPlayer.updateListUI();
				break;
				case 'musicTextSettingElement':
					// metadata panel
					this.enablePanel('inspectorMetadata');
					this.initInspectorMusicTextSettingElements();
					if (!item) this.open('inspectorMetadata');

					// setup UI from Video Player state
					model = {
						heading: '<i class="fas fa-indent"></i> Add text setting element',
						submit : (item) ? "Save"                                         : "Add",
						type   : null,
						start  : (item) ? item.model.startTime                           : TIMAAT.VideoPlayer.medium.currentTime * 1000,
						end    : (item) ? item.model.endTime                             : TIMAAT.VideoPlayer.duration,
					};

					if (item) {
						model.heading = '<i class="fas fa-indent"></i> Edit text setting element';
						model.type    = item.model.musicTextSettingElementType.id;
					}
					this.fillInspectorMusicTextSettingElements(model);
					// category panel
					// $('#musicTextSettingElementSelectDropdown').empty().trigger('change');
					$('#musicTextSettingElementSelectDropdown').select2({
						closeOnSelect: true,
						scrollAfterSelect: true,
						allowClear: true,
						ajax: {
							url: 'api/music/musicTextSettingElementType/selectList/',
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
					if (item && item.model.musicTextSettingElementType) {
						var musicTextSettingElementTypeSelect = $('#musicTextSettingElementSelectDropdown');
						var option = new Option(item.model.musicTextSettingElementType.musicTextSettingElementTypeTranslations[0].type, item.model.musicTextSettingElementType.id, true, true);
						musicTextSettingElementTypeSelect.append(option).trigger('change');
					} else {
						$('#musicTextSettingElementSelectDropdown').empty().trigger('change');
					}
					TIMAAT.VideoPlayer.updateListUI();
				break;
			}
		}


		initInspectorAnalysisElements() {
			$('#inspectorName').show();
			$('#inspectorColorGroup').hide();
			$('#inspectorOpacityGroup').hide();
			$('#inspectorTypeGroup').hide();
			$('#inspectorTimecodeGroup').hide();
			$('#inspectorShortDescriptionGroup').hide();
			$('#inspectorCommentGroup').show();
			$('#inspectorTranscriptGroup').hide();
			$('#inspectorMusicFormElementTypeGroup').hide();
			$('#inspectorMusicChangeInTempoElementTypeGroup').hide();
			$('#inspectorMusicArticulationElementTypeGroup').hide();
			$('#inspectorMusicDynamicsElementTypeGroup').hide();
			$('#inspectorMusicTextSettingElementTypeGroup').hide();
			$('#inspectorLyricsGroup').hide();
			$('#inspectorMusicRepeatLastRowGroup').hide();
		}

		initInspectorSegmentElements() {
			$('#inspectorName').show();
			$('#inspectorColorGroup').hide();
			$('#inspectorOpacityGroup').hide();
			$('#inspectorTypeGroup').hide();
			$('#inspectorTimecodeGroup').show();
			$('#inspectorShortDescriptionGroup').show();
			$('#inspectorCommentGroup').show();
			$('#inspectorTranscriptGroup').show();
			$('#inspectorMusicFormElementTypeGroup').hide();
			$('#inspectorMusicChangeInTempoElementTypeGroup').hide();
			$('#inspectorMusicArticulationElementTypeGroup').hide();
			$('#inspectorMusicDynamicsElementTypeGroup').hide();
			$('#inspectorMusicTextSettingElementTypeGroup').hide();
			$('#inspectorLyricsGroup').hide();
			$('#inspectorMusicRepeatLastRowGroup').hide();
		}

		initInspectorMusicFormElements() {
			$('#inspectorName').hide();
			$('#inspectorColorGroup').hide();
			$('#inspectorOpacityGroup').hide();
			$('#inspectorTypeGroup').hide();
			$('#inspectorTimecodeGroup').show();
			$('#inspectorShortDescriptionGroup').hide();
			$('#inspectorCommentGroup').hide();
			$('#inspectorTranscriptGroup').hide();
			$('#inspectorMusicFormElementTypeGroup').show();
			$('#inspectorMusicChangeInTempoElementTypeGroup').hide();
			$('#inspectorMusicArticulationElementTypeGroup').hide();
			$('#inspectorMusicDynamicsElementTypeGroup').hide();
			$('#inspectorMusicTextSettingElementTypeGroup').hide();
			$('#inspectorLyricsGroup').show();
			$('#inspectorMusicRepeatLastRowGroup').show();
		}

		initInspectorMusicChangeInTempoElements() {
			$('#inspectorName').hide();
			$('#inspectorColorGroup').hide();
			$('#inspectorOpacityGroup').hide();
			$('#inspectorTypeGroup').hide();
			$('#inspectorTimecodeGroup').show();
			$('#inspectorShortDescriptionGroup').hide();
			$('#inspectorCommentGroup').hide();
			$('#inspectorTranscriptGroup').hide();
			$('#inspectorMusicFormElementTypeGroup').hide();
			$('#inspectorMusicChangeInTempoElementTypeGroup').show();
			$('#inspectorMusicArticulationElementTypeGroup').hide();
			$('#inspectorMusicDynamicsElementTypeGroup').hide();
			$('#inspectorMusicTextSettingElementTypeGroup').hide();
			$('#inspectorLyricsGroup').hide();
			$('#inspectorMusicRepeatLastRowGroup').hide();
		}

		initInspectorMusicArticulationElements() {
			$('#inspectorName').hide();
			$('#inspectorColorGroup').hide();
			$('#inspectorOpacityGroup').hide();
			$('#inspectorTypeGroup').hide();
			$('#inspectorTimecodeGroup').show();
			$('#inspectorShortDescriptionGroup').hide();
			$('#inspectorCommentGroup').hide();
			$('#inspectorTranscriptGroup').hide();
			$('#inspectorMusicFormElementTypeGroup').hide();
			$('#inspectorMusicChangeInTempoElementTypeGroup').hide();
			$('#inspectorMusicArticulationElementTypeGroup').show();
			$('#inspectorMusicDynamicsElementTypeGroup').hide();
			$('#inspectorMusicTextSettingElementTypeGroup').hide();
			$('#inspectorLyricsGroup').hide();
			$('#inspectorMusicRepeatLastRowGroup').hide();
		}

		initInspectorMusicDynamicsElements() {
			$('#inspectorName').hide();
			$('#inspectorColorGroup').hide();
			$('#inspectorOpacityGroup').hide();
			$('#inspectorTypeGroup').hide();
			$('#inspectorTimecodeGroup').show();
			$('#inspectorShortDescriptionGroup').hide();
			$('#inspectorCommentGroup').hide();
			$('#inspectorTranscriptGroup').hide();
			$('#inspectorMusicFormElementTypeGroup').hide();
			$('#inspectorMusicChangeInTempoElementTypeGroup').hide();
			$('#inspectorMusicArticulationElementTypeGroup').hide();
			$('#inspectorMusicDynamicsElementTypeGroup').show();
			$('#inspectorMusicTextSettingElementTypeGroup').hide();
			$('#inspectorLyricsGroup').hide();
			$('#inspectorMusicRepeatLastRowGroup').hide();
		}

		initInspectorMusicTextSettingElements() {
			$('#inspectorName').hide();
			$('#inspectorColorGroup').hide();
			$('#inspectorOpacityGroup').hide();
			$('#inspectorTypeGroup').hide();
			$('#inspectorTimecodeGroup').show();
			$('#inspectorShortDescriptionGroup').hide();
			$('#inspectorCommentGroup').hide();
			$('#inspectorTranscriptGroup').hide();
			$('#inspectorMusicFormElementTypeGroup').hide();
			$('#inspectorMusicChangeInTempoElementTypeGroup').hide();
			$('#inspectorMusicArticulationElementTypeGroup').hide();
			$('#inspectorMusicDynamicsElementTypeGroup').hide();
			$('#inspectorMusicTextSettingElementTypeGroup').show();
			$('#inspectorLyricsGroup').hide();
			$('#inspectorMusicRepeatLastRowGroup').hide();
		}

		fillInspectorSegmentElements(model) {
      // console.log("TCL: Inspector -> fillInspectorSegmentElements -> model", model);
			model.start = TIMAAT.Util.formatTime(model.start, true);
			model.end = TIMAAT.Util.formatTime(model.end, true);
			$('#inspectorTitle').html(model.heading);
			$('#inspectorSubmitButton').html(model.submit);
			$('#inspectorName').val(model.name).trigger('input');
			$('#inspectorShortDescription').val(model.shortDescription).trigger('input');
			$('#inspectorComment').summernote('code', model.comment);
			$('#inspectorTranscript').summernote('code', model.transcript);
			$('#inspectorStartTimecode').val(model.start);
			$('#inspectorEndTimecode').val(model.end);
		}

		fillInspectorMusicFormElements(model) {
      // console.log("TCL: Inspector -> fillInspectorMusicFormElements -> model", model);
			model.start = TIMAAT.Util.formatTime(model.start, true);
			model.end = TIMAAT.Util.formatTime(model.end, true);
			$('#inspectorTitle').html(model.heading);
			$('#inspectorSubmitButton').html(model.submit);
			$('#inspectorStartTimecode').val(model.start);
			$('#inspectorEndTimecode').val(model.end);
			$('#inspectorLyrics').summernote('code', model.text);
			$('#inspectorRepeatLastRow').val(model.repeatLastRow);
		}

		fillInspectorMusicChangeInTempoElements(model) {
      // console.log("TCL: Inspector -> fillInspectorMusicChangeInTempoElements -> model", model);
			model.start = TIMAAT.Util.formatTime(model.start, true);
			model.end = TIMAAT.Util.formatTime(model.end, true);
			$('#inspectorTitle').html(model.heading);
			$('#inspectorSubmitButton').html(model.submit);
			$('#inspectorStartTimecode').val(model.start);
			$('#inspectorEndTimecode').val(model.end);
		}

		fillInspectorMusicArticulationElements(model) {
      // console.log("TCL: Inspector -> fillInspectorMusicArticulationElements -> model", model);
			model.start = TIMAAT.Util.formatTime(model.start, true);
			model.end = TIMAAT.Util.formatTime(model.end, true);
			$('#inspectorTitle').html(model.heading);
			$('#inspectorSubmitButton').html(model.submit);
			$('#inspectorStartTimecode').val(model.start);
			$('#inspectorEndTimecode').val(model.end);
		}

		fillInspectorMusicDynamicsElements(model) {
      // console.log("TCL: Inspector -> fillInspectorMusicDynamicsElements -> model", model);
			model.start = TIMAAT.Util.formatTime(model.start, true);
			model.end = TIMAAT.Util.formatTime(model.end, true);
			$('#inspectorTitle').html(model.heading);
			$('#inspectorSubmitButton').html(model.submit);
			$('#inspectorStartTimecode').val(model.start);
			$('#inspectorEndTimecode').val(model.end);
		}

		fillInspectorMusicTextSettingElements(model) {
      // console.log("TCL: Inspector -> fillInspectorMusicTextSettingElements -> model", model);
			model.start = TIMAAT.Util.formatTime(model.start, true);
			model.end = TIMAAT.Util.formatTime(model.end, true);
			$('#inspectorTitle').html(model.heading);
			$('#inspectorSubmitButton').html(model.submit);
			$('#inspectorStartTimecode').val(model.start);
			$('#inspectorEndTimecode').val(model.end);
		}

		updateItem() {
			if ( !this.state.item ) return;
			let model = {
				heading: $('#inspectorTitle').val(),
				submit: $('#inspectorSubmitButton').val(),
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
					$('#inspectorStartTimecode').val(start);
					$('#inspectorEndTimecode').val(end);

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
					model.name             = this.state.item.model.analysisSegmentTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisSegmentTranslations[0].shortDescription;
					model.comment          = this.state.item.model.analysisSegmentTranslations[0].comment;
					model.transcript       = this.state.item.model.analysisSegmentTranslations[0].transcript;
					model.start            = this.state.item.model.startTime;
					model.end              = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorSegmentElements(model);
				break;
				case 'sequence':
					model.name             = this.state.item.model.analysisSequenceTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisSequenceTranslations[0].shortDescription;
					model.comment          = this.state.item.model.analysisSequenceTranslations[0].comment;
					model.transcript       = this.state.item.model.analysisSequenceTranslations[0].transcript;
					model.start            = this.state.item.model.startTime;
					model.end              = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorSegmentElements(model);
				break;
				case 'take':
					model.name             = this.state.item.model.analysisTakeTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisTakeTranslations[0].shortDescription;
					model.comment          = this.state.item.model.analysisTakeTranslations[0].comment;
					model.transcript       = this.state.item.model.analysisTakeTranslations[0].transcript;
					model.start            = this.state.item.model.startTime;
					model.end              = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorSegmentElements(model);
				break;
				case 'scene':
					model.name             = this.state.item.model.analysisSceneTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisSceneTranslations[0].shortDescription;
					model.comment          = this.state.item.model.analysisSceneTranslations[0].comment;
					model.transcript       = this.state.item.model.analysisSceneTranslations[0].transcript;
					model.start            = this.state.item.model.startTime;
					model.end              = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorSegmentElements(model);
				break;
				case 'action':
					model.name             = this.state.item.model.analysisActionTranslations[0].name;
					model.shortDescription = this.state.item.model.analysisActionTranslations[0].shortDescription;
					model.comment          = this.state.item.model.analysisActionTranslations[0].comment;
					model.transcript       = this.state.item.model.analysisActionTranslations[0].transcript;
					model.start            = this.state.item.model.startTime;
					model.end              = this.state.item.model.endTime;
					// setup UI from Video Player state
					this.fillInspectorSegmentElements(model);
				break;
			}
		}

		setMetaEnd(milliseconds) {
			// console.log("TCL: setMetaEnd: function(milliseconds) ", milliseconds);
			var startTime = TIMAAT.Util.parseTime($('#inspectorStartTimecode').val());
			var endTime = TIMAAT.Util.parseTime($('#inspectorEndTimecode').val());
			if ( milliseconds == 0 ) {
				// 0 means current frame in video player
				milliseconds = TIMAAT.VideoPlayer.medium.currentTime * 1000 - startTime;
				milliseconds = Math.max(0, milliseconds);
			}
			endTime   = startTime+milliseconds;
			startTime = Math.min(Math.max(0,startTime), TIMAAT.VideoPlayer.duration);
			endTime   = Math.min(Math.max(startTime,endTime), TIMAAT.VideoPlayer.duration);
			$('#inspectorStartTimecode').val(TIMAAT.Util.formatTime(startTime, true));
			$('#inspectorEndTimecode').val(TIMAAT.Util.formatTime(endTime, true));

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
				$('#inspectorOutlineButton').attr('class', 'btn btn-primary');
				$('#inspectorOutlineButton').find('i').attr('class', 'far fa-square');
			} else {
				$('#inspectorOutlineButton').attr('class', 'btn btn-outline-secondary');
				$('#inspectorOutlineButton').find('i').attr('class', 'fas fa-border-style');
			}
		}

	}
}, window));
