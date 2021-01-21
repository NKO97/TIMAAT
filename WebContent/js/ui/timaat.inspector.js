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
      console.log("TCL: Inspector -> constructor -> inspector", inspector);
			
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
        	// console.log("TCL: Inspector -> constructor -> data", data);
					let actorElement = $(row);
					let actor = data;
					actorElement.data('actor', actor);

					actorElement.find('.add-actor').on('click', actor, function(ev) {
						ev.stopPropagation();
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.AnnotationService.addAnnotationActor(TIMAAT.VideoPlayer.curAnnotation.model.id, actor.id)
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
				language: this.ui.actorLang,
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
						TIMAAT.AnnotationService.removeAnnotationActor(TIMAAT.VideoPlayer.curAnnotation.model.id, actor.id)
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
				dom				: 'rft<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				pageLength		: 3,
				deferLoading	: 0,
				pagingType		: 'full',
				order			: [[ 0, 'asc' ]],
				processing		: true,
				serverSide		: true,
				ajax			: {
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
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.AnnotationService.addAnnotationEvent(TIMAAT.VideoPlayer.curAnnotation.model.id, event.id)
						.then((result)=>{
							inspector.ui.dataTableEvents.ajax.reload();
							inspector.ui.dataTableAnnoEvents.ajax.reload();
						}).catch((error)=>{
							console.log("ERROR:", error);
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
			// $(this.ui.dataTableEvents.table().container()).find('.table-title').text('Verfügbare Events');
			
			this.ui.dataTableAnnoEvents = $('#timaat-inspector-events-pane .events-annotation').DataTable({
				lengthChange	: false,
				pageLength		: 10,
				dom				: 'rt<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				// dom				: 'r<"row"<"col-6"<"btn btn-sm btn-outline-dark disabled table-title">><"col-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
				searching		: false,
				deferLoading	: 0,
				order			: [[ 0, 'asc' ]],
				processing		: true,
				serverSide		: true,
				ajax			: {
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
							as_datatable: true,
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
						if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
						$(this).remove();
						TIMAAT.AnnotationService.removeAnnotationEvent(TIMAAT.VideoPlayer.curAnnotation.model.id, event.id)
						.then((result)=>{
							inspector.ui.dataTableEvents.ajax.reload();
							inspector.ui.dataTableAnnoEvents.ajax.reload();
						}).catch((error)=>{
							console.log("ERROR:", error);
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
				// annotations
				if ( inspector.state.type == 'annotation' ) {
					var anno = inspector.state.item;
					var title = $("#timaat-inspector-meta-name").val();
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
						anno.model.startTime = startTime*1000.0;
						anno.model.endTime = endTime*1000.0;
						anno.svg.color = color;
						anno.opacity = opacity;
						anno.layerVisual = layerVisual;
						anno.saveChanges();
						TIMAAT.VideoPlayer.updateAnnotation(anno);
					} else {
						TIMAAT.AnnotationService.createAnnotation(title, comment, startTime*1000.0, endTime*1000.0, color, 1, layerVisual, TIMAAT.VideoPlayer.curAnalysisList.id, TIMAAT.VideoPlayer._annotationAdded);
					}
				}
				// analysis lists
				if ( inspector.state.type == 'analysislist' ) {
					var list = inspector.state.item;
					var title = $('#timaat-inspector-meta-name').val();
					var comment = $('#timaat-inspector-meta-comment').val();				
					if (list) {
						TIMAAT.Util.setDefTranslation(TIMAAT.VideoPlayer.curAnalysisList, 'mediumAnalysisListTranslations', 'title', title);
						TIMAAT.Util.setDefTranslation(TIMAAT.VideoPlayer.curAnalysisList, 'mediumAnalysisListTranslations', 'text', comment);
						TIMAAT.VideoPlayer.updateAnalysisList(TIMAAT.VideoPlayer.curAnalysisList);
						inspector.close();
					} else {
						TIMAAT.AnalysisListService.createAnalysisList(title, comment, TIMAAT.VideoPlayer.model.video.id, TIMAAT.VideoPlayer._analysislistAdded);
					}
				}
				// analysis segments
				if ( inspector.state.type == 'analysissegment' ) {
					var segment = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').val();
					var transcript = $('#timaat-inspector-meta-transcript').val();
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val())*1000.0;
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val())*1000.0;

					// early out: segment has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-segment-noRange').modal('show');
					} else {
						var overlapping = false;
						var i = 0;
						var segmentList = TIMAAT.VideoPlayer.curAnalysisList.analysisSegments;
						if (segment) {
							var index = segmentList.findIndex(({id}) => id === segment.model.id);
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
							$('#timaat-videoplayer-segment-overlapping').modal('show');
						} else {
							if (segment) {
								segment.model.analysisSegmentTranslations[0].name = name;
								segment.model.analysisSegmentTranslations[0].shortDescription = shortDescription;
								segment.model.analysisSegmentTranslations[0].comment = comment;
								segment.model.analysisSegmentTranslations[0].transcript = transcript;
								segment.model.startTime = startTime;
								segment.model.endTime = endTime;

								// update segment UI
								TIMAAT.VideoPlayer.updateAnalysisSegment(segment);
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
								// TIMAAT.AnalysisListService.createSegment(model, TIMAAT.VideoPlayer.curAnalysisList.id, TIMAAT.VideoPlayer._segmentAdded);
								segment = await TIMAAT.AnalysisListService.createSegment(model, TIMAAT.VideoPlayer.curAnalysisList.id);
								segment = new TIMAAT.AnalysisSegment(segment);
								TIMAAT.VideoPlayer._segmentAdded(segment, true);
							}
							var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
							TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
						}
					}
				}
				// analysis sequences
				if ( inspector.state.type == 'analysissequence' ) {
					var sequence = inspector.state.item;
          console.log("TCL: Inspector -> $ -> sequence", sequence);
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').val();
					var transcript = $('#timaat-inspector-meta-transcript').val();
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val())*1000.0;
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val())*1000.0;

					// early out: sequence's time range exceeds segment's time range
					if (startTime < TIMAAT.VideoPlayer.curSegment.model.startTime || endTime > TIMAAT.VideoPlayer.curSegment.model.endTime) {
						$('#timaat-videoplayer-sequence-outOfBounds').modal('show');
					}
					// early out: sequence has no time range
					else if (startTime == endTime) {
						$('#timaat-videoplayer-sequence-noRange').modal('show');
					} else {
						var overlapping = false;
						var i = 0;
						var sequenceList = TIMAAT.VideoPlayer.curSegment.model.analysisSequences;
						if (sequence) {
							var index = sequenceList.findIndex(({id}) => id === sequence.model.id);
							sequenceList.splice(index,1);
						}
						for (; i < sequenceList.length; i++) {
							if (!(endTime <= sequenceList[i].startTime || startTime >= sequenceList[i].endTime) ) {
								overlapping = true;
								break;
							}
						}
						// early out: sequence overlaps with other sequences
						if (overlapping) {
							$('#timaat-videoplayer-sequence-overlapping').modal('show');
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
								TIMAAT.VideoPlayer.updateAnalysisSequence(sequence);
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
								sequence = await TIMAAT.AnalysisListService.createSequence(model, TIMAAT.VideoPlayer.curSegment.model.id);
								sequence = new TIMAAT.AnalysisSequence(sequence);
								TIMAAT.VideoPlayer._sequenceAdded(sequence, true);
							}
							var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
							TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
						}
					}
				}
				// analysis takes
				if ( inspector.state.type == 'analysistake' ) {
					var take = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').val();
					var transcript = $('#timaat-inspector-meta-transcript').val();
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val())*1000.0;
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val())*1000.0;

					// early out: take's time range exceeds sequence's time range
					if (startTime < TIMAAT.VideoPlayer.curSequence.model.startTime || endTime > TIMAAT.VideoPlayer.curSequence.model.endTime) {
						$('#timaat-videoplayer-take-outOfBounds').modal('show');
					}
					// early out: take has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-take-noRange').modal('show');
					} else {
						var overlapping = false;
						var i = 0;
						var takeList = TIMAAT.VideoPlayer.curSequence.model.analysisTakes;
						if (take) {
							var index = takeList.findIndex(({id}) => id === take.model.id);
							takeList.splice(index,1);
						}
						for (; i < takeList.length; i++) {
							if (!(endTime <= takeList[i].startTime || startTime >= takeList[i].endTime) ) {
								overlapping = true;
								break;
							}
						}
						// early out: take overlaps with other takes
						if (overlapping) {
							$('#timaat-videoplayer-take-overlapping').modal('show');
						} else {
							if (take) {
								take.model.analysisTakeTranslations[0].name = name;
								take.model.analysisTakeTranslations[0].shortDescription = shortDescription;
								take.model.analysisTakeTranslations[0].comment = comment;
								take.model.analysisTakeTranslations[0].transcript = transcript;
								take.model.startTime = startTime;
								take.model.endTime = endTime;

								// update take UI
								TIMAAT.VideoPlayer.updateAnalysisTake(take);
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
								take = await TIMAAT.AnalysisListService.createTake(model, TIMAAT.VideoPlayer.curSequence.model.id);
								take = new TIMAAT.AnalysisTake(take);
								TIMAAT.VideoPlayer._takeAdded(take, true);
							}
							var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
							TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
						}
					}
				}
				// analysis scenes
				if ( inspector.state.type == 'analysisscene' ) {
					var scene = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').val();
					var transcript = $('#timaat-inspector-meta-transcript').val();
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val())*1000.0;
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val())*1000.0;

					// early out: scene's time range exceeds segment's time range
					if (startTime < TIMAAT.VideoPlayer.curSegment.model.startTime || endTime > TIMAAT.VideoPlayer.curSegment.model.endTime) {
						$('#timaat-videoplayer-scene-outOfBounds').modal('show');
					}
					// early out: scene has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-scene-noRange').modal('show');
					} else {
						var overlapping = false;
						var i = 0;
						var sceneList = TIMAAT.VideoPlayer.curSegment.model.analysisScenes;
						if (scene) {
							var index = sceneList.findIndex(({id}) => id === scene.model.id);
							sceneList.splice(index,1);
						}
						for (; i < sceneList.length; i++) {
							if (!(endTime <= sceneList[i].startTime || startTime >= sceneList[i].endTime) ) {
								overlapping = true;
								break;
							}
						}
						// early out: scene overlaps with other scenes
						if (overlapping) {
							$('#timaat-videoplayer-scene-overlapping').modal('show');
						} else {
							if (scene) {
								scene.model.analysisSceneTranslations[0].name = name;
								scene.model.analysisSceneTranslations[0].shortDescription = shortDescription;
								scene.model.analysisSceneTranslations[0].comment = comment;
								scene.model.analysisSceneTranslations[0].transcript = transcript;
								scene.model.startTime = startTime;
								scene.model.endTime = endTime;

								// update scene UI
								TIMAAT.VideoPlayer.updateAnalysisScene(scene);
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
								scene = await TIMAAT.AnalysisListService.createScene(model, TIMAAT.VideoPlayer.curSegment.model.id);
								scene = new TIMAAT.AnalysisScene(scene);
								TIMAAT.VideoPlayer._sceneAdded(scene, true);
								// TIMAAT.AnalysisListService.createScene(model, TIMAAT.VideoPlayer.curSegment.model.id, TIMAAT.VideoPlayer._sceneAdded);
							}
							var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
							TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
						}
					}
				}
				// analysis actions
				if ( inspector.state.type == 'analysisaction' ) {
					var action = inspector.state.item;
					var name = $('#timaat-inspector-meta-name').val();
					var shortDescription = $('#timaat-inspector-meta-shortDescription').val();
					var comment = $('#timaat-inspector-meta-comment').val();
					var transcript = $('#timaat-inspector-meta-transcript').val();
					var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val())*1000.0;
					var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val())*1000.0;

					// early out: action's time range exceeds scene's time range
					if (startTime < TIMAAT.VideoPlayer.curScene.model.startTime || endTime > TIMAAT.VideoPlayer.curScene.model.endTime) {
						$('#timaat-videoplayer-action-outOfBounds').modal('show');
					}
					// early out: action has no time range
					if (startTime == endTime) {
						$('#timaat-videoplayer-action-noRange').modal('show');
					} else {
						var overlapping = false;
						var i = 0;
						var actionList = TIMAAT.VideoPlayer.curScene.model.analysisActions;
						if (action) {
							var index = actionList.findIndex(({id}) => id === action.model.id);
							actionList.splice(index,1);
						}
						for (; i < actionList.length; i++) {
							if (!(endTime <= actionList[i].startTime || startTime >= actionList[i].endTime) ) {
								overlapping = true;
								break;
							}
						}
						// early out: action overlaps with other actions
						if (overlapping) {
							$('#timaat-videoplayer-action-overlapping').modal('show');
						} else {
							if (action) {
								action.model.analysisActionTranslations[0].name = name;
								action.model.analysisActionTranslations[0].shortDescription = shortDescription;
								action.model.analysisActionTranslations[0].comment = comment;
								action.model.analysisActionTranslations[0].transcript = transcript;
								action.model.startTime = startTime;
								action.model.endTime = endTime;

								// update action UI
								TIMAAT.VideoPlayer.updateAnalysisAction(action);
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
								action = await TIMAAT.AnalysisListService.createAction(model, TIMAAT.VideoPlayer.curScene.model.id);
								action = new TIMAAT.AnalysisAction(action);
								TIMAAT.VideoPlayer._actionAdded(action, true);
								// TIMAAT.AnalysisListService.createAction(model, TIMAAT.VideoPlayer.curScene.id, TIMAAT.VideoPlayer._actionAdded);
							}
							var tempList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
							TIMAAT.VideoPlayer.curAnalysisList.analysisSegments = tempList.analysisSegments;
						}
					}
				}
				
			});

			$('#timaat-inspector-meta-delete').on('click', function(event) {
				switch (inspector.state.type) {
					case 'analysislist':
						TIMAAT.VideoPlayer.removeAnalysisList();
					break;
					case 'annotation':
						TIMAAT.VideoPlayer.removeAnnotation();
					break;
					case 'analysissegment':
						TIMAAT.VideoPlayer.removeAnalysisSegment();
					break;
					case 'analysissequence':
						TIMAAT.VideoPlayer.removeAnalysisSequence();
					break;
					case 'analysistake':
						TIMAAT.VideoPlayer.removeAnalysisTake();
					break;
					case 'analysisscene':
						TIMAAT.VideoPlayer.removeAnalysisScene();
					break;
					case 'analysisaction':
						TIMAAT.VideoPlayer.removeAnalysisAction();
					break;
				}
			});
			
			// setup annotation metadata UI and events
			$('#timaat-inspector-meta-colorPicker').tinycolorpicker();
			this.cp = $('#timaat-inspector-meta-colorPicker').data("plugin_tinycolorpicker");
			this.cp.setColor('rgb(3, 145, 206)');

			$('#timaat-inspector-meta-name').on('input', function(ev) {
				if ( $("#timaat-inspector-meta-name").val().length > 0 ) {
					$('#timaat-inspector-meta-submit').prop('disabled', false);
					$('#timaat-inspector-meta-submit').removeAttr('disabled');
				} else {
					$('#timaat-inspector-meta-submit').prop('disabled', true);
					$('#timaat-inspector-meta-submit').attr('disabled');
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
			
			$('#timaat-inspector-meta-setstart').on('click', function() {
				var startTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-start').val());
				var endTime = TIMAAT.Util.parseTime($('#timaat-inspector-meta-end').val());
				var duration = endTime-startTime;
				duration = Math.max(0,Math.min(duration, TIMAAT.VideoPlayer.video.duration));
				startTime = TIMAAT.VideoPlayer.video.currentTime;
				endTime = startTime+duration;
				$('#timaat-inspector-meta-start').val(TIMAAT.Util.formatTime(startTime, true));
				$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTime, true));
				$('#timaat-inspector-meta-start').trigger('blur');
			});
			$('#timaat-inspector-meta-setend').on('click', function() {
				var endTime = TIMAAT.VideoPlayer.video.currentTime;
				$('#timaat-inspector-meta-end').val(TIMAAT.Util.formatTime(endTime, true));
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
			this.ui.dataTableEvents.clear();
			this.ui.dataTableEvents.ajax.reload();
			// console.log("TCL: reset");
			// TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.clear();
			// TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload();
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
			$('#timaat-analysissequence-add').addClass("timaat-item-disabled");
			$('#timaat-analysissequence-add').removeAttr('onclick');
			$('#timaat-analysistake-add').addClass("timaat-item-disabled");
			$('#timaat-analysistake-add').removeAttr('onclick');
			$('#timaat-analysisscene-add').addClass("timaat-item-disabled");
			$('#timaat-analysisscene-add').removeAttr('onclick');
			$('#timaat-analysisaction-add').addClass("timaat-item-disabled");
			$('#timaat-analysisaction-add').removeAttr('onclick');
			
			// metadata panel default UI setting
			$('#timaat-inspector-meta-start').prop('disabled', false);
			$('#timaat-inspector-meta-setstart').prop('disabled', false);
			$('#timaat-inspector-meta-end').prop('disabled', false);
			$('#timaat-inspector-meta-setend').prop('disabled', false);
			$('#timaat-inspector-meta-setend-dropdown').prop('disabled', false);
			
			// animation panel default UI setting
			this.disablePanel('timaat-inspector-animation');
			this.disablePanel('timaat-inspector-categories-and-tags');
			this.disablePanel('timaat-inspector-actors');
			this.disablePanel('timaat-inspector-events');
			this.disablePanel('timaat-inspector-locations');
			this.disablePanel('timaat-inspector-analysis');
			this.ui.keyframeList.children().detach();
			
			// actors panel default UI setting
			this.ui.dataTableAnnoActors.ajax.url('api/annotation/0/actors');

			// analysis panel default UI setting
			TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.url('api/annotation/0/analysis');

			// events panel default UI setting
			this.ui.dataTableAnnoEvents.ajax.url('api/annotation/0/events');

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
						this.enablePanel('timaat-inspector-actors');
						this.enablePanel('timaat-inspector-events');
						this.enablePanel('timaat-inspector-locations');
						this.enablePanel('timaat-inspector-analysis');
						this.enablePanel('timaat-inspector-categories-and-tags');
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
					$('#timaat-inspector-meta-shortDescription-group').hide();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').hide();
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
					var start = (anno) ? TIMAAT.Util.formatTime(anno.model.startTime/1000.0, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true);
					var end = (anno) ? TIMAAT.Util.formatTime(anno.model.endTime/1000.0, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true);
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					this.cp.setColor('#'+color);
					$("#timaat-inspector-meta-name").val(title).trigger('input');
					$("#timaat-inspector-meta-opacity").val(opacity);
					this._setInspectorStroke(stroke);
					this._setInspectorAnnotationType(layerVisual);
					$("#timaat-inspector-meta-comment").val(comment);
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);	
					$('#timaat-inspector-categories-and-tags-title').html('Kategorien und Tags');

					if ( !anno ) this.open('timaat-inspector-metadata');
					else this.updateItem();
					
					if ( item ) {
            // console.log("TCL: Inspector -> setItem -> item", item);
						// actors panel
						this.ui.dataTableAnnoActors.ajax.url('api/annotation/'+item.model.id+'/actors');
						this.ui.dataTableAnnoActors.ajax.reload();
						this.ui.dataTableActors.ajax.reload();

						// events panel
						this.ui.dataTableAnnoEvents.ajax.url('api/annotation/'+item.model.id+'/events');
						this.ui.dataTableAnnoEvents.ajax.reload();
						this.ui.dataTableEvents.ajax.reload();

						// analysis panel
						TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.url('api/annotation/'+item.model.id+'/analysis');
						TIMAAT.AnalysisDatasets.dataTableAnnoAnalysis.ajax.reload();
						TIMAAT.AnalysisDatasets.dataTableAnalysisMethods.ajax.reload();

						// category and annotation panel
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
						$('#annotationCategoryPanel').show();
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
								cache: true
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
								cache: true
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
				}
				// analysis lists
				if ( type == 'analysislist' ) {
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
					var title = (list) ? TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'title') : "";
					var comment = (list) ? TIMAAT.Util.getDefTranslation(list, 'mediumAnalysisListTranslations', 'text') : "";
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-name").val(title).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment);
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
								url: 'api/category/set/selectList/',
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
								cache: true
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
								cache: true
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
				}
				// analysis segments
				if ( type == 'analysissegment' ) {
					// show segment substructure elements
					$('#timaat-analysissequence-add').removeClass("timaat-item-disabled");
					$('#timaat-analysissequence-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisSequence()');
					$('#timaat-analysisscene-add').removeClass("timaat-item-disabled");
					$('#timaat-analysisscene-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisScene()');

					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-shortDescription-group').show();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').show();
					var segment = item;
					if ( !segment ) this.open('timaat-inspector-metadata');
					var heading = (segment) ? '<i class="fas fa-indent"></i> Segment bearbeiten' : '<i class="fas fa-indent"></i> Segment hinzufügen';
					var submit = (segment) ? "Speichern" : "Hinzufügen";
					var name = (segment) ? segment.model.analysisSegmentTranslations[0].name : "";
					var shortDescription = (segment) ? segment.model.analysisSegmentTranslations[0].shortDescription : "";
					var comment = (segment) ? segment.model.analysisSegmentTranslations[0].comment : "";
					var transcript = (segment) ? segment.model.analysisSegmentTranslations[0].transcript : "";
					var startTime = (segment) ? segment.model.startTime/1000.0 : TIMAAT.VideoPlayer.video.currentTime;
					var endTime = (segment) ? segment.model.endTime/1000.0 : TIMAAT.VideoPlayer.video.duration;				
					// find closest segment to adjust end time
					if ( TIMAAT.VideoPlayer.curAnalysisList != null && TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI != null) {
						TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
							if ( segment.model.startTime/1000.0 > startTime && segment.model.endTime/1000.0 < endTime )
								endTime = segment.model.endTime/1000.0;
						});
					}
					var start = (segment) ? TIMAAT.Util.formatTime(segment.model.startTime/1000.0, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true);
					var end = TIMAAT.Util.formatTime(endTime, true);
					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-name").val(name).trigger('input');
					$("#timaat-inspector-meta-shortDescription").val(shortDescription).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment).trigger('input');
					$("#timaat-inspector-meta-transcript").val(transcript).trigger('input');
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);
					(segment) ? $('#timaat-segment-delete-submit').show() : $('#timaat-segment-delete-submit').hide();
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
				}
				// analysis sequences
				if ( type == 'analysissequence' ) {
					// show sequence substructure elements
					$('#timaat-analysistake-add').removeClass("timaat-item-disabled");
					$('#timaat-analysistake-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisTake()');

					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-shortDescription-group').show();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').show();
					var sequence = item;
					if ( !sequence ) this.open('timaat-inspector-metadata');
					var heading = (sequence) ? '<i class="fas fa-indent"></i> Sequenz bearbeiten' : '<i class="fas fa-indent"></i> Sequenz hinzufügen';
					var submit = (sequence) ? "Speichern" : "Hinzufügen";
					var name = (sequence) ? sequence.model.analysisSequenceTranslations[0].name : "";
					var shortDescription = (sequence) ? sequence.model.analysisSequenceTranslations[0].shortDescription : "";
					var comment = (sequence) ? sequence.model.analysisSequenceTranslations[0].comment : "";
					var transcript = (sequence) ? sequence.model.analysisSequenceTranslations[0].transcript : "";
					var startTime = (sequence) ? sequence.model.startTime/1000.0 : TIMAAT.VideoPlayer.video.currentTime;
					var endTime = (sequence) ? sequence.model.endTime/1000.0 : TIMAAT.VideoPlayer.video.duration;				
					// find closest sequence to adjust end time
					if ( TIMAAT.VideoPlayer.curAnalysisList != null && TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI != null) {
						TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.forEach(function(sequence) {
							if ( sequence.model.startTime/1000.0 > startTime && sequence.model.endTime/1000.0 < endTime )
								endTime = sequence.model.endTime/1000.0;
						});
					}
					var start = (sequence) ? TIMAAT.Util.formatTime(sequence.model.startTime/1000.0, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true);
					if (start < TIMAAT.VideoPlayer.curSegment.model.startTime)
						start = TIMAAT.VideoPlayer.curSegment.model.startTime;
					var end = TIMAAT.Util.formatTime(endTime, true);
					if (end > TIMAAT.VideoPlayer.curSegment.model.endTime)
						end = TIMAAT.VideoPlayer.curSegment.model.endTime;

					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-name").val(name).trigger('input');
					$("#timaat-inspector-meta-shortDescription").val(shortDescription).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment).trigger('input');
					$("#timaat-inspector-meta-transcript").val(transcript).trigger('input');
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);
					(sequence) ? $('#timaat-sequence-delete-submit').show() : $('#timaat-sequence-delete-submit').hide();
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
				}
				// analysis takes
				if ( type == 'analysistake' ) {
					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-shortDescription-group').show();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').show();
					var take = item;
					if ( !take ) this.open('timaat-inspector-metadata');
					var heading = (take) ? '<i class="fas fa-indent"></i> Take bearbeiten' : '<i class="fas fa-indent"></i> Take hinzufügen';
					var submit = (take) ? "Speichern" : "Hinzufügen";
					var name = (take) ? take.model.analysisTakeTranslations[0].name : "";
					var shortDescription = (take) ? take.model.analysisTakeTranslations[0].shortDescription : "";
					var comment = (take) ? take.model.analysisTakeTranslations[0].comment : "";
					var transcript = (take) ? take.model.analysisTakeTranslations[0].transcript : "";
					var startTime = (take) ? take.model.startTime/1000.0 : TIMAAT.VideoPlayer.video.currentTime;
					var endTime = (take) ? take.model.endTime/1000.0 : TIMAAT.VideoPlayer.video.duration;				
					// find closest take to adjust end time
					if ( TIMAAT.VideoPlayer.curAnalysisList != null && TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI != null) {
						TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.forEach(function(take) {
							if ( take.model.startTime/1000.0 > startTime && take.model.endTime/1000.0 < endTime )
								endTime = take.model.endTime/1000.0;
						});
					}
					var start = (take) ? TIMAAT.Util.formatTime(take.model.startTime/1000.0, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true);
					if (start < TIMAAT.VideoPlayer.curSequence.model.startTime)
						start = TIMAAT.VideoPlayer.curSequence.model.startTime;
					var end = TIMAAT.Util.formatTime(endTime, true);
					if (end > TIMAAT.VideoPlayer.curSequence.model.endTime)
						end = TIMAAT.VideoPlayer.curSequence.model.endTime;

					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-name").val(name).trigger('input');
					$("#timaat-inspector-meta-shortDescription").val(shortDescription).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment).trigger('input');
					$("#timaat-inspector-meta-transcript").val(transcript).trigger('input');
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);
					(take) ? $('#timaat-take-delete-submit').show() : $('#timaat-take-delete-submit').hide();
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
				}
				// analysis scenes
				if ( type == 'analysisscene' ) {
					// show scene substructure elements
					$('#timaat-analysisaction-add').removeClass("timaat-item-disabled");
					$('#timaat-analysisaction-add').attr('onclick','TIMAAT.VideoPlayer.addAnalysisAction()');

					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-shortDescription-group').show();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').show();
					var scene = item;
					if ( !scene ) this.open('timaat-inspector-metadata');
					var heading = (scene) ? '<i class="fas fa-indent"></i> Scene bearbeiten' : '<i class="fas fa-indent"></i> Scene hinzufügen';
					var submit = (scene) ? "Speichern" : "Hinzufügen";
					var name = (scene) ? scene.model.analysisSceneTranslations[0].name : "";
					var shortDescription = (scene) ? scene.model.analysisSceneTranslations[0].shortDescription : "";
					var comment = (scene) ? scene.model.analysisSceneTranslations[0].comment : "";
					var transcript = (scene) ? scene.model.analysisSceneTranslations[0].transcript : "";
					var startTime = (scene) ? scene.model.startTime/1000.0 : TIMAAT.VideoPlayer.video.currentTime;
					var endTime = (scene) ? scene.model.endTime/1000.0 : TIMAAT.VideoPlayer.video.duration;				
					// find closest scene to adjust end time
					if ( TIMAAT.VideoPlayer.curAnalysisList != null && TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI != null) {
						TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.forEach(function(scene) {
							if ( scene.model.startTime/1000.0 > startTime && scene.model.endTime/1000.0 < endTime )
								endTime = scene.model.endTime/1000.0;
						});
					}
					var start = (scene) ? TIMAAT.Util.formatTime(scene.model.startTime/1000.0, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true);
					if (start < TIMAAT.VideoPlayer.curSegment.model.startTime)
						start = TIMAAT.VideoPlayer.curSegment.model.startTime;
					var end = TIMAAT.Util.formatTime(endTime, true);
					if (end > TIMAAT.VideoPlayer.curSegment.model.endTime)
						end = TIMAAT.VideoPlayer.curSegment.model.endTime;

					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-name").val(name).trigger('input');
					$("#timaat-inspector-meta-shortDescription").val(shortDescription).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment).trigger('input');
					$("#timaat-inspector-meta-transcript").val(transcript).trigger('input');
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);
					(scene) ? $('#timaat-scene-delete-submit').show() : $('#timaat-scene-delete-submit').hide();
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
				}
				// analysis actions
				if ( type == 'analysisaction' ) {
					$('#timaat-inspector-meta-color-group').hide();
					$('#timaat-inspector-meta-opacity-group').hide();
					$('#timaat-inspector-meta-type-group').hide();
					$('#timaat-inspector-meta-timecode-group').show();
					$('#timaat-inspector-meta-shortDescription-group').show();
					$('#timaat-inspector-meta-comment-group').show();
					$('#timaat-inspector-meta-transcript-group').show();
					var action = item;
					if ( !action ) this.open('timaat-inspector-metadata');
					var heading = (action) ? '<i class="fas fa-indent"></i> Action bearbeiten' : '<i class="fas fa-indent"></i> Action hinzufügen';
					var submit = (action) ? "Speichern" : "Hinzufügen";
					var name = (action) ? action.model.analysisActionTranslations[0].name : "";
					var shortDescription = (action) ? action.model.analysisActionTranslations[0].shortDescription : "";
					var comment = (action) ? action.model.analysisActionTranslations[0].comment : "";
					var transcript = (action) ? action.model.analysisActionTranslations[0].transcript : "";
					var startTime = (action) ? action.model.startTime/1000.0 : TIMAAT.VideoPlayer.video.currentTime;
					var endTime = (action) ? action.model.endTime/1000.0 : TIMAAT.VideoPlayer.video.duration;				
					// find closest action to adjust end time
					if ( TIMAAT.VideoPlayer.curAnalysisList != null && TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI != null) {
						TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.forEach(function(action) {
							if ( action.model.startTime/1000.0 > startTime && action.model.endTime/1000.0 < endTime )
								endTime = action.model.endTime/1000.0;
						});
					}
					var start = (action) ? TIMAAT.Util.formatTime(action.model.startTime/1000.0, true) : TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.video.currentTime, true);
					if (start < TIMAAT.VideoPlayer.curScene.model.startTime)
						start = TIMAAT.VideoPlayer.curScene.model.startTime;
					var end = TIMAAT.Util.formatTime(endTime, true);
					if (end > TIMAAT.VideoPlayer.curScene.model.endTime)
						end = TIMAAT.VideoPlayer.curScene.model.endTime;

					// setup UI from Video Player state
					$('#timaat-inspector-metadata-title').html(heading);
					$('#timaat-inspector-meta-submit').html(submit);
					$("#timaat-inspector-meta-name").val(name).trigger('input');
					$("#timaat-inspector-meta-shortDescription").val(shortDescription).trigger('input');
					$("#timaat-inspector-meta-comment").val(comment).trigger('input');
					$("#timaat-inspector-meta-transcript").val(transcript).trigger('input');
					$("#timaat-inspector-meta-start").val(start);
					$("#timaat-inspector-meta-end").val(end);
					(action) ? $('#timaat-action-delete-submit').show() : $('#timaat-action-delete-submit').hide();
					if ( this.isOpen ) this.open('timaat-inspector-metadata');
				}
				console.log("TCL: setItem -> $ -> TIMAAT.VideoPlayer.updateListUI()");
				TIMAAT.VideoPlayer.updateListUI();
			}
		}
		
		updateItem() {
			if ( !this.state.item ) return;
			if (  this.state.type == 'annotation' ) {
				var start = TIMAAT.Util.formatTime(this.state.item.startTime, true);
				var end = TIMAAT.Util.formatTime(this.state.item.endTime, true);
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
				let name = this.state.item.model.analysisSegmentTranslations[0].name;
				let shortDescription = this.state.item.model.analysisSegmentTranslations[0].shortDescription;
				let comment = this.state.item.model.analysisSegmentTranslations[0].comment;
				let transcript = this.state.item.model.analysisSegmentTranslations[0].transcript;
				let startTime = this.state.item.model.startTime/1000.0;
				let endTime = this.state.item.model.endTime/1000.0;
				let start = TIMAAT.Util.formatTime(startTime, true);
				let end = TIMAAT.Util.formatTime(endTime, true);
				// setup UI from Video Player state
				$("#timaat-inspector-meta-name").val(name);
				$("#timaat-inspector-meta-shortDescription").val(shortDescription);
				$("#timaat-inspector-meta-comment").val(comment);
				$("#timaat-inspector-meta-transcript").val(transcript);
				$("#timaat-inspector-meta-start").val(start);
				$("#timaat-inspector-meta-end").val(end);
			} else
			if (  this.state.type == 'analysissequence' ) {
				let name = this.state.item.model.analysisSequenceTranslations[0].name;
				let shortDescription = this.state.item.model.analysisSequenceTranslations[0].shortDescription;
				let comment = this.state.item.model.analysisSequenceTranslations[0].comment;
				let transcript = this.state.item.model.analysisSequenceTranslations[0].transcript;
				let startTime = this.state.item.model.startTime/1000.0;
				let endTime = this.state.item.model.endTime/1000.0;
				let start = TIMAAT.Util.formatTime(startTime, true);
				let end = TIMAAT.Util.formatTime(endTime, true);
				// setup UI from Video Player state
				$("#timaat-inspector-meta-name").val(name);
				$("#timaat-inspector-meta-shortDescription").val(shortDescription);
				$("#timaat-inspector-meta-comment").val(comment);
				$("#timaat-inspector-meta-transcript").val(transcript);
				$("#timaat-inspector-meta-start").val(start);
				$("#timaat-inspector-meta-end").val(end);
			} else
			if (  this.state.type == 'analysistake' ) {
				let name = this.state.item.model.analysisTakeTranslations[0].name;
				let shortDescription = this.state.item.model.analysisTakeTranslations[0].shortDescription;
				let comment = this.state.item.model.analysisTakeTranslations[0].comment;
				let transcript = this.state.item.model.analysisTakeTranslations[0].transcript;
				let startTime = this.state.item.model.startTime/1000.0;
				let endTime = this.state.item.model.endTime/1000.0;
				let start = TIMAAT.Util.formatTime(startTime, true);
				let end = TIMAAT.Util.formatTime(endTime, true);
				// setup UI from Video Player state
				$("#timaat-inspector-meta-name").val(name);
				$("#timaat-inspector-meta-shortDescription").val(shortDescription);
				$("#timaat-inspector-meta-comment").val(comment);
				$("#timaat-inspector-meta-transcript").val(transcript);
				$("#timaat-inspector-meta-start").val(start);
				$("#timaat-inspector-meta-end").val(end);
			} else
			if (  this.state.type == 'analysisscene' ) {
				let name = this.state.item.model.analysisSceneTranslations[0].name;
				let shortDescription = this.state.item.model.analysisSceneTranslations[0].shortDescription;
				let comment = this.state.item.model.analysisSceneTranslations[0].comment;
				let transcript = this.state.item.model.analysisSceneTranslations[0].transcript;
				let startTime = this.state.item.model.startTime/1000.0;
				let endTime = this.state.item.model.endTime/1000.0;
				let start = TIMAAT.Util.formatTime(startTime, true);
				let end = TIMAAT.Util.formatTime(endTime, true);
				// setup UI from Video Player state
				$("#timaat-inspector-meta-name").val(name);
				$("#timaat-inspector-meta-shortDescription").val(shortDescription);
				$("#timaat-inspector-meta-comment").val(comment);
				$("#timaat-inspector-meta-transcript").val(transcript);
				$("#timaat-inspector-meta-start").val(start);
				$("#timaat-inspector-meta-end").val(end);
			} else
			if (  this.state.type == 'analysisaction' ) {
				let name = this.state.item.model.analysisActionTranslations[0].name;
				let shortDescription = this.state.item.model.analysisActionTranslations[0].shortDescription;
				let comment = this.state.item.model.analysisActionTranslations[0].comment;
				let transcript = this.state.item.model.analysisActionTranslations[0].transcript;
				let startTime = this.state.item.model.startTime/1000.0;
				let endTime = this.state.item.model.endTime/1000.0;
				let start = TIMAAT.Util.formatTime(startTime, true);
				let end = TIMAAT.Util.formatTime(endTime, true);
				// setup UI from Video Player state
				$("#timaat-inspector-meta-name").val(name);
				$("#timaat-inspector-meta-shortDescription").val(shortDescription);
				$("#timaat-inspector-meta-comment").val(comment);
				$("#timaat-inspector-meta-transcript").val(transcript);
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
