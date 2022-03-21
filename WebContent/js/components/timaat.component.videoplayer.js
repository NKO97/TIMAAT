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
		UI                          : Object(),
		annotationList              : [],
		curAction                   : null,
		curAnalysisList             : null,
		curAnnotation               : null,
		curCategorySet              : null,
		curMusic                    : null,
		curMusicChangeInTempoElement: null,
		curMusicArticulationElement : null,
		curMusicDynamicsElement		  : null,
		curMusicTextSettingElement  : null,
		curMusicFormElement         : null,
		curScene                    : null,
		curSegment                  : null,
		curSequence                 : null,
		curTake                     : null,
		currentPermissionLevel      : null,
		duration                    : 1,
		markerList                  : [],
		model                       : Object(),
		overlay                     : null,
		repeatSection               : false,
		selectedElementType         : null,
		selectedMedium              : null,
		tagAutocomplete             : [],
		userPermissionList          : null,
		volume                      : 1,

		init: function() {
			// init UI
			$('.timaat-videoplayer-noMedium').show();
			$('.timaat-videoplayer-ui').hide();

			this.viewer = L.map('timaat-videoplayer-viewer', {
				attributionControl: false,
				center            : [0,0],
				crs               : L.CRS.Simple,
				editable          : true,
				keyboard          : false,
				maxZoom           : 0.0,
				minZoom           : 0.0,
				zoomControl       : false,
				zoomSnap          : 0.000001,
			});

			let bounds = [[450,0], [0,800]];
			TIMAAT.VideoPlayer.viewer.setMaxBounds(bounds);
			TIMAAT.VideoPlayer.viewer.fitBounds(bounds);
			TIMAAT.VideoPlayer.viewer.dragging.disable();
			TIMAAT.VideoPlayer.viewer.touchZoom.disable();
			TIMAAT.VideoPlayer.viewer.doubleClickZoom.disable();
			TIMAAT.VideoPlayer.viewer.scrollWheelZoom.disable();

			// adjust timeline view upon window resize
			$(window).resize( function() {
				TIMAAT.VideoPlayer.timeline.invalidateSize();
				let selected = TIMAAT.VideoPlayer.selectedElementType;
				// TIMAAT.VideoPlayer.refreshTimelineElementsStructure();
				let index;
				TIMAAT.VideoPlayer.selectedElementType = selected;
				if (TIMAAT.VideoPlayer.curAnalysisList != null) {
					for (let marker of TIMAAT.VideoPlayer.markerList) marker._updateElementOffset();
					for (let anno of TIMAAT.VideoPlayer.annotationList) for (let keyframe of anno.svg.keyframes) keyframe._updateOffsetUI();
          // console.log("TCL: $ -> TIMAAT.VideoPlayer.selectedElementType", TIMAAT.VideoPlayer.selectedElementType);
					// switch (TIMAAT.VideoPlayer.selectedElementType) {
					// 	case 'segment':
					// 		index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curSegment.model.id);
					// 		TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index].timelineView[0].classList.replace('bg-info', 'bg-primary');
					// 	break;
					// 	case 'sequence':
					// 		index = TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curSequence.model.id);
					// 		TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI[index].timelineView[0].classList.replace('bg-info', 'bg-primary');
					// 	break;
					// 	case 'action':
					// 		index = TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curAction.model.id);
					// 		TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI[index].timelineView[0].classList.replace('bg-info', 'bg-primary');
					// 	break;
					// 	case 'scene':
					// 		index = TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curScene.model.id);
					// 		TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI[index].timelineView[0].classList.replace('bg-info', 'bg-primary');
					// 	break;
					// 	case 'take':
					// 		index = TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curTake.model.id);
					// 		TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI[index].timelineView[0].classList.replace('bg-info', 'bg-primary');
					// 	break;
					// }
				}
				// if (TIMAAT.VideoPlayer.curMusic != null) {
				// 	switch(TIMAAT.VideoPlayer.selectedElementType) {
				// 		// TODO check what to do instead
				// 		// index = TIMAAT.VideoPlayer.curMusic.musicFormElementsUI.findIndex(({model}) => model.id === TIMAAT.VideoPlayer.curMusicFormElement.model.id);
				// 		// TIMAAT.VideoPlayer.curMusic.musicFormElementsUI[index].timelineView[0].classList.replace('bg-info', 'bg-primary');
				// 		case 'musicFormElement':

				// 		break;
				// 		case 'musicChangeInTempoElement':

				// 		break;
				// 	}
				// }
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
						// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
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
				// console.log("trigger edit annotation");
				let annotation = notification.data;
				// console.log("remote annotation", annotation);
				if ( annotation && TIMAAT.VideoPlayer.curAnalysisList &&  TIMAAT.VideoPlayer.curAnalysisList.id == notification.dataID ) {
					// console.log("in local list");
					let localAnno = null;
					for ( let anno of TIMAAT.VideoPlayer.annotationList ) if ( anno.model.id == annotation.id ) localAnno = anno;
					if (localAnno) {
						// console.log("local annotation found", localAnno);
						// update local annotation
						localAnno.model = annotation;
						localAnno.setChanged();
						localAnno.discardChanges();
						// update UI list view
						localAnno.updateUI();
						TIMAAT.VideoPlayer.updateUI();
						// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
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
						// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
						// TODO Why is sorting again necessary?
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
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+TIMAAT.VideoPlayer.curAnalysisList.createdByUserAccountId+'">[ID '+TIMAAT.VideoPlayer.curAnalysisList.createdByUserAccountId+']</span></b><br>\
						 '+TIMAAT.Util.formatDate(TIMAAT.VideoPlayer.curAnalysisList.createdAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item,"mir")});
			});

			// $('#timaat-videoplayer-video-user-log').popover({
			// 	container: 'body',
			// 	html: true,
			// 	title: '<i class="fas fa-user"></i> Bearbeitungslog',
			// 	content: '<div class="timaat-user-log-details">Keine Daten erfasst</div>',
			// 	placement: 'left',
			// 	trigger: 'click',
			// });
		},

		initMenu: function() {
			// setup analysis lists UI and events
			$('#timaat-analysislist-chooser').on('change', async function(ev) {
				TIMAAT.VideoPlayer.inspector.reset();
				var list = TIMAAT.VideoPlayer.model.analysisLists.find(x => x.id === parseInt($(this).val()));
				if ( list && TIMAAT.VideoPlayer.curAnalysisList && list.id != TIMAAT.VideoPlayer.curAnalysisList.id )  {
					await TIMAAT.VideoPlayer.loadAnalysisList(list.id);
					TIMAAT.URLHistory.setURL(null, 'Analysis · '+ list.mediumAnalysisListTranslations[0].title, '#analysis/'+list.id);
				}
			});

			$('#timaat-videoplayer-analysis-manage').on('change paste keyup', '#userAccountForNewPermission', function(event) {
				$('#adminCanNotBeAddedInfo').hide();
				$('#userAccountDoesNotExistInfo').hide();
				$('#userAccountAlreadyInList').hide();
			});

			$('#timaat-videoplayer-analysis-manage').on('blur', '.custom-select', function(event) {
				$('[id^="adminCannotBeChanged_"]').hide();
			});

			$(document).on('click', '[data-role="newUserPermissionAnalysisList"] > [data-role="add"]', async function(event) {
				event.preventDefault();
				let listEntry = $(this).closest('[data-role="newPermission"]');
				let displayName = '';
				let permissionId = null;
				if (listEntry.find('input').each(function(){
					displayName = $(this).val();
				}));
				if (listEntry.find('select').each(function(){
					permissionId = $(this).val();
				}));

				if (displayName == '') return; // no data entered

				// 'admin' can't be added as admin always has access
				if (displayName.toLowerCase() == 'admin') {
					$('#adminCanNotBeAddedInfo').show();
					return;
				}
				// check if name exists
				// TODO make check case insensitive
				let displayNameExists = await TIMAAT.Service.displayNameExists(displayName);
				if (!displayNameExists) {
					$('#userAccountDoesNotExistInfo').show();
					return;
				}

				// check if name is already in the list
				let displayNameDuplicate = false;
				let i = 0;
				for (; i < TIMAAT.VideoPlayer.userPermissionList.length; i++) {
					if ($('#userAccountForNewPermission').val() == TIMAAT.VideoPlayer.userPermissionList[i].displayName ) {
						displayNameDuplicate = true;
						break;
					}
				}
				if (displayNameDuplicate) {
					$('#userAccountAlreadyInList').show();
					return;
				}

				// add new entry to the list
				let userAccountId = await TIMAAT.Service.getUserAccountIdByDisplayName(displayName);
				await TIMAAT.AnalysisListService.addUserAccountHasMediumAnalysisListWithPermission(userAccountId, TIMAAT.VideoPlayer.curAnalysisList.id, permissionId);
				TIMAAT.VideoPlayer.manageAnalysisList();
			});

			$(document).on('change', '[data-role="changeUserPermissionAnalysisList"] > [data-role="select"]', async function(event) {
				event.preventDefault();
				let userId = $(this).closest('.permissionContainer')[0].dataset.userId;
				let permissionId = $(this).closest('.custom-select').val();

				// prevent removal of the last admin. One admin has to exist at any time
				let adminCount = 0;
				$('.permissionContainer [data-role="select"]').each(function() {
					if ( $(this).val() == 4 ) {
						adminCount++;
					}
				});
				if (adminCount <= 0) {
					$(this).closest('.custom-select').val(4); // return invalidly changed option back to 'Administrate'
					$('#adminCannotBeChanged_'+userId).show();
					return;
				}

				await TIMAAT.AnalysisListService.updateUserAccountHasMediumAnalysisListWithPermission(userId, TIMAAT.VideoPlayer.curAnalysisList.id, permissionId);
				TIMAAT.VideoPlayer.userPermissionList = await TIMAAT.AnalysisListService.getDisplayNamesAndPermissions(TIMAAT.VideoPlayer.curAnalysisList.id);
			});

			$(document).on('change', 'input[type=radio][name=globalPermissionAnalysisList]', async function(event) {
				event.preventDefault();
				let globalPermissionValue = Number($(this).val());
				if (!globalPermissionValue || globalPermissionValue == null || globalPermissionValue > 2) globalPermissionValue = 0;
				let analysisList = TIMAAT.VideoPlayer.curAnalysisList;
				analysisList.globalPermission = globalPermissionValue;
				TIMAAT.AnalysisListService.updateMediumAnalysisList(analysisList);
			});

			$(document).on('click','[data-role="removeUserPermissionAnalysisList"] > [data-role="remove"]', async function (event) {
				event.preventDefault();
				let userId = $(this).closest('.permissionContainer')[0].dataset.userId;
				let index = TIMAAT.VideoPlayer.userPermissionList.findIndex(({userAccountId}) => userAccountId == userId);
				let userPermissionId = TIMAAT.VideoPlayer.userPermissionList[index].permissionId;
				if (!userPermissionId) return;

				// if the to be removed user has administrate permission, make sure that she is not the only one
				if (userPermissionId == 4) {
					// prevent removal of the last admin. One admin has to exist at any time
					let adminCount = 0;
					$('.permissionContainer [data-role="select"]').each(function() {
						if ( $(this).val() == 4 ) {
							adminCount++;
						}
					});
					if (adminCount <= 1) {
						$('#adminCannotBeChanged_'+userId).show();
						return;
					}
				}

				await TIMAAT.AnalysisListService.removeUserAccountHasMediumAnalysisList(userId, TIMAAT.VideoPlayer.curAnalysisList.id);
				$(this).closest('.permissionContainer').remove();
				TIMAAT.VideoPlayer.userPermissionList.splice(index, 1);
			});

			// publication dialog events
			$('#timaat-publish-analysis-switch, #timaat-publication-protected-switch').on('change', ev => {
				// TIMAAT.VideoPlayer._setupPublicationDialog($('#timaat-publish-analysis-switch').prop('checked'), $('#timaat-publication-protected-switch').prop('checked'));
				let enabled = $('#timaat-publish-analysis-switch').prop('checked');
				let restricted =  $('#timaat-publication-protected-switch').prop('checked');
				let credentials = {};
				try {
					credentials = JSON.parse(TIMAAT.VideoPlayer.publication.credentials);
				} catch (e) { credentials = {}; }
				let dialog = $('#timaat-videoplayer-publication');
				let username = ( credentials.user && enabled ) ? credentials.user : '';
				let password = ( credentials.password && enabled ) ? credentials.password : '';
				dialog.find('.protectedicon').removeClass('fa-lock').removeClass('fa-lock-open');
				if ( restricted ) dialog.find('.protectedicon').addClass('fa-lock'); else dialog.find('.protectedicon').addClass('fa-lock-open');
				dialog.find('#timaat-publication-protected-switch').prop('disabled', !enabled);
				dialog.find('.username').prop('disabled', !enabled || !restricted);
				dialog.find('.username').val(username);
				dialog.find('.password').prop('disabled', !enabled || !restricted);
				dialog.find('.password').val(password);
				dialog.find('.password').attr('type', 'password');
				$('#timaat-publication-settings-submit').prop('disabled', enabled && restricted && username == '' && password == '');
			});

			let dialog = $('#timaat-videoplayer-publication');

			dialog.find('.reveal').on('click', ev => {
				if ( dialog.find('.password').attr('type') === 'password' )
					dialog.find('.password').attr('type', 'text');
				else dialog.find('.password').attr('type', 'password');
			});

			dialog.find('.username, .password').on('change input', ev => {
				let enabled = $('#timaat-publish-analysis-switch').prop('checked');
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
				anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
				anno.addKeyframeAt(TIMAAT.VideoPlayer.medium.currentTime);
			});

			$('#timaat-videoplayer-keyframe-remove-button').on('click', function(ev) {
				ev.stopPropagation();
				if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
				TIMAAT.VideoPlayer.pause();
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
				anno.removeCurrentKeyframe();
			});

			$('#timaat-videoplayer-keyframe-prev-button').on('click', function(ev) {
				ev.stopPropagation();
				if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
				TIMAAT.VideoPlayer.pause();
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
				if ( !anno.isOnKeyframe() ) TIMAAT.VideoPlayer.jumpTo(anno.startTime + anno.currentKeyframe.time);
				else {
					let index = anno.getKeyframeIndex(anno.currentKeyframe) - 1;
					if ( index < 0 ) index = 0;
					TIMAAT.VideoPlayer.jumpTo(anno.startTime + anno.svg.keyframes[index].time);
				}
			});

			$('#timaat-videoplayer-keyframe-next-button').on('click', function(ev) {
				ev.stopPropagation();
				if ( !TIMAAT.VideoPlayer.curAnnotation ) return;
				TIMAAT.VideoPlayer.pause();
				let anno = TIMAAT.VideoPlayer.curAnnotation;
				anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
				TIMAAT.VideoPlayer.jumpTo(anno.startTime + anno.nextKeyframe.time);
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
					content : `<button data-type="rectangle" type="button" title="Rechteck-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createShape('rectangle')" class="rectangle btn btn-sm btn-light">
									<i class="fas fa-vector-square"></i>
								</button>
								<button data-type="polygon" type="button" title="Polygon-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createShape('polygon')" class="polygon ml-0 btn btn-sm btn-light">
									<i class="fas fa-draw-polygon"></i>
								</button>
								<button data-type="line" type="button" title="Linien-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createShape('line')" class="line ml-0 btn btn-sm btn-light">
									<i class="fas fa-slash"></i>
								</button>
								<button data-type="circle" type="button" title="Kreis-Annotation erstellen" onclick="TIMAAT.VideoPlayer.createShape('circle')" class="circle ml-0 btn btn-sm btn-light">
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
				x.layer.setStyle({color: '#'+TIMAAT.VideoPlayer.curAnnotation.svg.colorHex, weight: TIMAAT.VideoPlayer.curAnnotation.svg.strokeWidth});
			});

			TIMAAT.VideoPlayer.viewer.on('editable:vertex:dragend', function(ev) {
				if ( TIMAAT.VideoPlayer.curAnnotation ) {
					TIMAAT.VideoPlayer.curAnnotation.setChanged();
					// sync keyframe
					if ( ev.layer ) TIMAAT.VideoPlayer.curAnnotation.syncShape(ev.layer);
					// console.log("TIMAAT.VideoPLayer.updateUI() - editable:vertex:dragend");
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
					var latLngs = ( ev.layer.getLatLngs != null ) ? ev.layer.getLatLngs() : [ev.layer.getLatLng()];
					$(latLngs[0]).each(function(item,latLng) {
						var minLat = ( ev.layer instanceof L.Circle ) ? ev.layer.getRadius() : 0;
						var minLng = ( ev.layer instanceof L.Circle ) ? ev.layer.getRadius() : 0;
						var maxLat = ( ev.layer instanceof L.Circle ) ? (TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat-ev.layer.getRadius()) : TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat;
						var maxLng = ( ev.layer instanceof L.Circle ) ? (TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng-ev.layer.getRadius()) : TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng;
						if (latLng.lng < minLng ) latLng.lng = minLng;
						if (latLng.lat < minLat ) latLng.lat = minLat;
						if (latLng.lng > maxLng ) latLng.lng = maxLng;
						if (latLng.lat > maxLat ) latLng.lat = maxLat;
						if ( ev.layer instanceof L.Circle ) ev.layer.setLatLng(latLng);
					});
				}
			});

			// Animation Events
			$(document).on('keyframeadded.annotation.TIMAAT', function(event, anno) {
				if ( !anno ) return;
				anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
				TIMAAT.VideoPlayer.updateUI();
				TIMAAT.VideoPlayer.inspector.updateItem();
			});

			$(document).on('keyframeremoved.annotation.TIMAAT', function(event, anno) {
				if ( !anno ) return;
				anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
				TIMAAT.VideoPlayer.updateUI();
				TIMAAT.VideoPlayer.inspector.updateItem();
			});

			$(document).on('keyframechanged.annotation.TIMAAT', function(event, anno) {
				if ( !anno ) return;
				anno.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
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
				var latLng = ev.latlng;
				if (latLng.lng < 0 ) latLng.lng = 0;
				if (latLng.lat < 0 ) latLng.lat = 0;
				if (latLng.lng > TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng ) latLng.lng = TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng;
				if (latLng.lat > TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat ) latLng.lat = TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat;
				ev.vertex.setLatLng(latLng);
			});

			TIMAAT.VideoPlayer.viewer.on('editable:vertex:drag', function(ev) {
				var latLng = ev.latlng;
				if (latLng.lng < 0 ) latLng.lng = 0;
				if (latLng.lat < 0 ) latLng.lat = 0;
				if (latLng.lng > TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng ) latLng.lng = TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng;
				if (latLng.lat > TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat ) latLng.lat = TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat;
				ev.vertex.setLatLng(latLng);

				if ( TIMAAT.VideoPlayer.curTool == 'circle' || (ev.vertex.editor.feature.getRadius != null) ) {
					if ( ev.vertex.editor.feature.getLatLng() == ev.vertex.latlng ) return;
					var radius = TIMAAT.VideoPlayer.viewer.distance(ev.vertex.editor.feature.getLatLng(), ev.vertex.latlng);
					radius = Math.max(5,radius);
					ev.vertex.editor.feature.setRadius( radius );
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
					ev.layer.dragging._draggable = null;
					ev.layer.dragging.addHooks();
					ev.layer.enableEdit();
					if ( TIMAAT.VideoPlayer.curAnnotation.isAnimation() ) {
						ev.layer.editor.options.skipMiddleMarkers = true;
						ev.layer.editor.reset();
					}
				}
			});

			// -----------------------------------------------------

			// Zoom Control for non time-based media (images)
			L.Control.zoomHome = L.Control.extend({ options: {
				position: 'topleft',
			        zoomInText: '<i class="fas fa-search-plus" style="line-height:1.9;font-size:16px;"></i>',
			        zoomInTitle: 'Heranzoomen',
			        zoomOutText: '<i class="fas fa-search-minus" style="line-height:1.65;font-size:16px;"></i>',
			        zoomOutTitle: 'Herauszoomen',
			        zoomHomeText: '<i class="fas fa-image" style="line-height:1.9;font-size:16px;"></i>',
			        zoomHomeTitle: 'Ganzes Bild anzeigen'
			}, onAdd: function (map) {
			        var controlName = 'leaflet-control-zoom', container = L.DomUtil.create('div', controlName + ' leaflet-bar'), options = this.options;
			        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle, controlName + '-in-ctrl', container, this._zoomIn);
			        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle, controlName + '-home-ctrl', container, this._zoomHome);
			        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle, controlName + '-out-ctrl', container, this._zoomOut);
			        this._updateDisabled();
			        map.on('zoomend zoomlevelschange', this._updateDisabled, this);
			        return container;
			}, onRemove: function (map) { map.off('zoomend zoomlevelschange', this._updateDisabled, this); },
			_zoomIn: function (e) { this._map.zoomIn(e.shiftKey ? 1.5 : 0.5); },
			_zoomOut: function (e) { this._map.zoomOut(e.shiftKey ? 1.5 : 0.5); },
			_zoomHome: function (e) {
				TIMAAT.VideoPlayer.viewer.fitBounds(TIMAAT.VideoPlayer.mediumBounds);
			},
			_createButton: function (html, title, className, container, fn) {
			        var link = L.DomUtil.create('a', className, container);
			        link.innerHTML = html;
				link.href = "javascript:void()";
			        link.title = title;
			        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
				.on(link, 'click', L.DomEvent.stop).on(link, 'click', fn, this).on(link, 'click', this._refocusOnMap, this);
			        return link;
			}, _updateDisabled: function () {
				var map = this._map, className = 'leaflet-disabled';
				L.DomUtil.removeClass(this._zoomInButton, className);
				L.DomUtil.removeClass(this._zoomOutButton, className);
				if (map._zoom === map.getMinZoom()) L.DomUtil.addClass(this._zoomOutButton, className);
				if (map._zoom === map.getMaxZoom()) L.DomUtil.addClass(this._zoomInButton, className);
			}});
			TIMAAT.VideoPlayer.zoomCtrl = new L.Control.zoomHome();
			TIMAAT.VideoPlayer.zoomCtrl.addTo(TIMAAT.VideoPlayer.viewer);


		},

		initInspectorControls: function() {
			// setup sidebar inspector controls
			TIMAAT.VideoPlayer.inspector = new TIMAAT.Inspector(TIMAAT.VideoPlayer.viewer);

			// setup timeline controls
			TIMAAT.VideoPlayer.timeline = new TIMAAT.Timeline();

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

			$('#timaat-inspector-meta-lyrics').summernote({
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
				var list = modal.data('analysisList');
				if (list) TIMAAT.VideoPlayer._analysisListRemoved(list);
				modal.modal('hide');
			});

			$('#timaat-segment-element-delete-commit-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videoplayer-segment-element-delete');
				var type = modal.data('type');
        // console.log("TCL: $ -> type", type);
				var model = modal.data('model');
        // console.log("TCL: $ -> model", model);
				// if ( TIMAAT.VideoPlayer.inspector.state.type != 'segment' ) return;
				if ( type && model) {
					await TIMAAT.AnalysisListService.removeSegmentElement(type, model.id);
					if (TIMAAT.VideoPlayer.curAnalysisList) {
						TIMAAT.VideoPlayer.refreshTimelineElementsStructure();
					}
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

			$('#timaat-music-form-element-delete-commit-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videoplayer-music-form-element-delete');
				var model = $('#timaat-videoplayer-music-form-element-delete').data('model');
        // console.log("TCL: $ -> model", model);
				if ( model ) {
					await TIMAAT.MusicService.removeMusicFormElement(model.id);
					if (TIMAAT.VideoPlayer.curMusic) {
						TIMAAT.VideoPlayer.refreshTimelineElementsStructure();
					}
				}
				TIMAAT.VideoPlayer.inspector.setItem(null);
				TIMAAT.VideoPlayer.curMusicFormElement = null;
				modal.modal('hide');
			});

			$('#timaat-music-change-in-tempo-element-delete-commit-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videoplayer-music-change-in-tempo-element-delete');
				var model = $('#timaat-videoplayer-music-change-in-tempo-element-delete').data('model');
        // console.log("TCL: $ -> model", model);
				if ( model ) {
					await TIMAAT.MusicService.removeMusicChangeInTempoElement(model.id);
					if (TIMAAT.VideoPlayer.curMusic) {
						TIMAAT.VideoPlayer.refreshTimelineElementsStructure();
					}
				}
				TIMAAT.VideoPlayer.inspector.setItem(null);
				TIMAAT.VideoPlayer.curMusicChangeInTempoElement = null;
				modal.modal('hide');
			});

			$('#timaat-music-articulation-element-delete-commit-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videoplayer-music-articulation-element-delete');
				var model = $('#timaat-videoplayer-music-articulation-element-delete').data('model');
        // console.log("TCL: $ -> model", model);
				if ( model ) {
					await TIMAAT.MusicService.removeMusicArticulationElement(model.id);
					if (TIMAAT.VideoPlayer.curMusic) {
						TIMAAT.VideoPlayer.refreshTimelineElementsStructure();
					}
				}
				TIMAAT.VideoPlayer.inspector.setItem(null);
				TIMAAT.VideoPlayer.curMusicArticulationElement = null;
				modal.modal('hide');
			});

			$('#timaat-music-dynamics-element-delete-commit-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videoplayer-music-dynamics-element-delete');
				var model = $('#timaat-videoplayer-music-dynamics-element-delete').data('model');
        // console.log("TCL: $ -> model", model);
				if ( model ) {
					await TIMAAT.MusicService.removeMusicDynamicsElement(model.id);
					if (TIMAAT.VideoPlayer.curMusic) {
						TIMAAT.VideoPlayer.refreshTimelineElementsStructure();
					}
				}
				TIMAAT.VideoPlayer.inspector.setItem(null);
				TIMAAT.VideoPlayer.curMusicDynamicsElement = null;
				modal.modal('hide');
			});

			$('#timaat-music-text-setting-element-delete-commit-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videoplayer-music-text-setting-element-delete');
				var model = $('#timaat-videoplayer-music-text-setting-element-delete').data('model');
        // console.log("TCL: $ -> model", model);
				if ( model ) {
					await TIMAAT.MusicService.removeMusicTextSettingElement(model.id);
					if (TIMAAT.VideoPlayer.curMusic) {
						TIMAAT.VideoPlayer.refreshTimelineElementsStructure();
					}
				}
				TIMAAT.VideoPlayer.inspector.setItem(null);
				TIMAAT.VideoPlayer.curMusicTextSettingElement = null;
				modal.modal('hide');
			});

			// close select2 drop-downs when clicking outside
			$(document).on('click', function(event) {
				var $target = $(event.target);
				if(!$target.closest('#annotation-categories-multi-select-dropdown-container').length
				&& (!$target.is('[class^=select2'))
				&& $('#annotation-categories-multi-select-dropdown').hasClass("select2-hidden-accessible")) {
					$('#annotation-categories-multi-select-dropdown').select2('close');
				}
				if(!$target.closest('#annotation-tags-multi-select-dropdown-container').length
				&& (!$target.is('[class^=select2'))
				&& $('#annotation-tags-multi-select-dropdown').hasClass("select2-hidden-accessible")) {
					$('#annotation-tags-multi-select-dropdown').select2('close');
				}
				if(!$target.closest('#mediumAnalysisList-categorySets-multi-select-dropdown-container').length
				&& (!$target.is('[class^=select2'))
				&& $('#mediumAnalysisList-categorySets-multi-select-dropdown').hasClass("select2-hidden-accessible")) {
					$('#mediumAnalysisList-categorySets-multi-select-dropdown').select2('close');
				}
				if(!$target.closest('#mediumAnalysisList-tags-multi-select-dropdown-container').length
				&& (!$target.is('[class^=select2'))
				&& $('#mediumAnalysisList-tags-multi-select-dropdown').hasClass("select2-hidden-accessible")) {
					$('#mediumAnalysisList-tags-multi-select-dropdown').select2('close');
				}
				if(!$target.closest('#segment-element-categories-multi-select-dropdown-container').length
				&& (!$target.is('[class^=select2'))
				&& $('#segment-element-categories-multi-select-dropdown').hasClass("select2-hidden-accessible")) {
					$('#segment-element-categories-multi-select-dropdown').select2('close');
				}
			});
		},

		initTimeLineControls: function() {
			// setup timeline view events
			$('.timaat-button-visual-layer').on('click', function(ev) {
				$('.timaat-button-visual-layer').removeClass('btn-outline-secondary').addClass('btn-primary');
				$('.timaat-button-audio-layer').removeClass('btn-primary').addClass('btn-outline-secondary');
				$('#timaat-timeline-marker-pane').removeClass('timaat-timeline-audio-layer').addClass('timaat-timeline-visual-layer');
				$('.timaat-timeline-marker-audio').hide();
				$('.timeline-section-audio').hide();
				$('.timeline-section-music-structure').hide();
				$('.timaat-analysislist-music-dropdown').hide();
				$('.timaat-timeline-marker-visual').show();
				if ( TIMAAT.VideoPlayer.curAnnotation && TIMAAT.VideoPlayer.curAnnotation.isAnimation() ){
					$('#timaat-timeline-keyframe-pane').show();
				} else {
					$('#timaat-timeline-keyframe-pane').hide();
				}
				TIMAAT.VideoPlayer.activeLayer = 'visual';
				TIMAAT.VideoPlayer.sortListUI();
			});

			$('.timaat-button-audio-layer').on('click', function(ev) {
				$('.timaat-button-visual-layer').removeClass('btn-primary').addClass('btn-outline-secondary');
				$('.timaat-button-audio-layer').removeClass('btn-outline-secondary').addClass('btn-primary');
				$('#timaat-timeline-marker-pane').removeClass('timaat-timeline-visual-layer').addClass('timaat-timeline-audio-layer');
				$('.timaat-timeline-marker-visual').hide();
				$('#timaat-timeline-keyframe-pane').hide();
				$('.timaat-timeline-marker-audio').show();
				$('.timeline-section-audio').show();
				if (TIMAAT.VideoPlayer.curMusic) {
					$('.timeline-section-music-structure').show();
					$('.timaat-analysislist-music-dropdown').show();
				}
				TIMAAT.VideoPlayer.activeLayer = 'audio';
				TIMAAT.VideoPlayer.sortListUI();
			});

			// setup timeline preview
			var preview = $('#video-seek-bar-preview');
			preview.removeClass('show');
			preview.hide();

			$('#video-seek-bar').on('input', function(ev) {
			  this.style.background="linear-gradient(to right, #ed1e24 0%,#ed1e24 "+this.value+"%,#939393 "+this.value+"%,#939393 100%)";
			});

			$('#video-seek-bar').on('click change', function(ev) {
				var time = TIMAAT.VideoPlayer.medium.duration * (this.value / 100) * 1000;
				TIMAAT.VideoPlayer.jumpTo(time);
			});

			$('#video-seek-bar').mouseenter(function (ev) {
				if ( !TIMAAT.VideoPlayer.medium ) return;
				var preview = $('#video-seek-bar-preview');
				preview.addClass('show');
				preview.show();
			});

			$('#video-seek-bar').mouseleave(function (ev) {
				var preview = $('#video-seek-bar-preview');
				preview.removeClass('show');
				preview.hide();
			});

			$('#video-seek-bar').mousemove(function (ev) {
				if ( !TIMAAT.VideoPlayer.medium ) return;
				var token = TIMAAT.VideoPlayer.model.medium.viewToken;
				var bar = $(this);
				var time = Math.round(ev.originalEvent.offsetX/bar.width()*TIMAAT.VideoPlayer.duration);
				var preview = $('#video-seek-bar-preview');
				$('#video-seek-bar-preview').css('left', ev.originalEvent.pageX-(preview.width()/2)+'px');
				$('#video-seek-bar-preview').css('top', bar.offset().top-preview.height()-7+'px');
				preview.find('img').attr('src', "/TIMAAT/api/medium/video/"+TIMAAT.VideoPlayer.model.medium.id+"/thumbnail?token="+token+"&time="+time);
			});

		},

		initVideoPlayerControls: function() {
			// setup keyboard video controls
			$([document.body, TIMAAT.VideoPlayer.viewer]).keydown(function(ev) {
				if ( TIMAAT.UI.component != 'videoplayer' ) return;
				if ( ! TIMAAT.VideoPlayer.medium ) return;
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
					$('.stepBackButton').click();
					break;
				case "ArrowRight":
					ev.preventDefault();
					$('.stepForwardButton').click();
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

			$('.stepBackButton').on('click dblclick', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.pause();
				let frameTime = 1000 / TIMAAT.VideoPlayer.curFrameRate;
				TIMAAT.VideoPlayer.jumpTo( Math.max(0, (Math.round(TIMAAT.VideoPlayer.medium.currentTime * 1000 / frameTime) * frameTime) - frameTime));
			});

			$('.stepForwardButton').on('click dblclick', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.pause();
				let frameTime = 1000 / TIMAAT.VideoPlayer.curFrameRate;
				TIMAAT.VideoPlayer.jumpTo( Math.min(TIMAAT.VideoPlayer.medium.duration * 1000, (Math.round(TIMAAT.VideoPlayer.medium.currentTime * 1000 / frameTime) * frameTime) + frameTime) );
			});

			$('.repeatbutton').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				TIMAAT.VideoPlayer.repeatSection = !TIMAAT.VideoPlayer.repeatSection;
				$(this).removeClass('btn-outline-secondary').removeClass('btn-primary');
				if ( TIMAAT.VideoPlayer.repeatSection ) $(this).addClass('btn-primary'); else $(this).addClass('btn-outline-secondary');
			});

			$('#timaat-volume-slider').on('input change', function() {
				if ( !TIMAAT.VideoPlayer.medium ) return;
				TIMAAT.VideoPlayer.medium.volume = $(this).val() / 100;
				if ( TIMAAT.VideoPlayer.medium.volume > 0 ) {
					$('#timaat-volumeicon').find('.volume').show();
					$('#timaat-volumeicon').find('.mute').hide();
				} else {
					$('#timaat-volumeicon').find('.volume').hide();
					$('#timaat-volumeicon').find('.mute').show();
				}
			});

			$('#timaat-volumeicon').on('click', function() {
				if ( !TIMAAT.VideoPlayer.medium ) return;
				if ( TIMAAT.VideoPlayer.medium.volume > 0 ) {
					TIMAAT.VideoPlayer.volume = TIMAAT.VideoPlayer.medium.volume;
					$('#timaat-volume-slider').val(0);
				} else {
					$('#timaat-volume-slider').val(TIMAAT.VideoPlayer.volume * 100);
				}
				$('#timaat-volume-slider').change();
			});

			$('#timaat-videoplayer-video-speed').on('click', function() {
				if ( !TIMAAT.VideoPlayer.medium ) return;
				var playbackSpeeds = [1,2,0.5,0.25]; // TODO move to config

				var speed = playbackSpeeds.indexOf(TIMAAT.VideoPlayer.medium.playbackRate);
				if ( speed < 0 ) TIMAAT.VideoPlayer.medium.playbackRate = 1;
				else {
					speed++;
					if ( speed > playbackSpeeds.length-1 ) speed = 0;
					TIMAAT.VideoPlayer.medium.playbackRate = playbackSpeeds[speed];
				}
				let rateInfo = TIMAAT.VideoPlayer.medium.playbackRate;
				if ( rateInfo == 0.5 ) rateInfo = "&frac12;";
				if ( rateInfo == 0.25 ) rateInfo = "&frac14;";
				// update UI
				$(this).find('.video-speed-info').html(rateInfo+"&times;");
				if ( TIMAAT.VideoPlayer.medium.playbackRate != 1 ) $(this).addClass('active'); else $(this).removeClass('active');

			});

			$('#timaat-videoplayer-viewer').on('contextmenu', function(event){
				event.stopPropagation();
				event.preventDefault();
				return false;
			});
		},

		initializeAnnotationMode: async function(medium) {
			if ( !medium && !TIMAAT.VideoPlayer.mediaType == 'image' ) return;
			TIMAAT.UI.showComponent('videoplayer');

			// setup video in player
			TIMAAT.VideoPlayer.setupMedium(medium);
			// load video annotations from server
			let analysisLists = await TIMAAT.AnalysisListService.getMediumAnalysisLists(medium.id);
			await TIMAAT.VideoPlayer.setupMediumAnalysisLists(analysisLists);
			TIMAAT.VideoPlayer.loadAnalysisList(0);
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
			// console.log("TCL: createShape: function(type)");
			// console.log("TCL: type", type);

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
			// console.log("TCL: confineBounds: function(bounds, xOff, yOff)");
			// console.log("TCL: bounds", bounds);
			// console.log("TCL: xOff", xOff);
			// console.log("TCL: yOff", yOff);
	    	// check bounds
	    	if ( bounds.getSouthWest().lng + xOff < 0 )
	    		xOff -= bounds.getSouthWest().lng + xOff;
	    	if ( bounds.getNorthEast().lat - yOff > TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat )
	    		yOff += bounds.getNorthEast().lat - TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lat - yOff;
	    	if ( bounds.getNorthEast().lng + xOff > TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng )
	    		xOff -= bounds.getNorthEast().lng + xOff - TIMAAT.VideoPlayer.mediumBounds.getNorthEast().lng;
	    	if ( bounds.getSouthWest().lat + yOff < 0 )
	    		yOff += bounds.getSouthWest().lat + yOff;
	    	bounds.getSouthWest().lng += xOff;
	    	bounds.getNorthEast().lng += xOff;
	    	bounds.getSouthWest().lat -= yOff;
	    	bounds.getNorthEast().lat -= yOff;
	    	return bounds;
		},

		setupMedium: async function(medium) {
			// console.log("TCL: setupMedium: -> medium", medium);
			this.mediaType = medium.mediaType.mediaTypeTranslations[0].type;

			// setup model
			this.curFrameRate = 25; // required for step forward and step backward functionality
			this.model.medium = medium;
			// remove all annotations and markers
			this.annotationList.forEach(function(annotation) {annotation.remove()});
			this.annotationList = [];
			this.curAnnotation = null;

			// remove old medium
			if ( TIMAAT.VideoPlayer.medium ) {
				$(TIMAAT.VideoPlayer.medium).off('canplay');
				TIMAAT.VideoPlayer.pause();
				TIMAAT.VideoPlayer.jumpTo(0);
				$('#video-seek-bar').val(0);
				TIMAAT.VideoPlayer.medium.currentTime = 0;
			}
			if ( this.overlay ) TIMAAT.VideoPlayer.viewer.removeLayer(this.overlay);

			// setup annotation UI
			$('#timaat-annotation-list-loader').show();
			$('#timaat-videoplayer-annotation-add-button').prop('disabled', true);
			$('#timaat-videoplayer-annotation-add-button').attr('disabled');
			switch (this.mediaType) {
				case 'audio':
				case 'video':
					$('#timaat-videoplayer-annotation-quickadd-button').prop('disabled', false);
					$('#timaat-videoplayer-annotation-quickadd-button').removeAttr('disabled');
				break;
				case 'image':
					$('#timaat-videoplayer-annotation-quickadd-button').prop('disabled', true);
					$('#timaat-videoplayer-annotation-quickadd-button').attr('disabled');
				break;
			}

			// setup analysis list UI
			$('#timaat-analysislist-chooser').empty();
			TIMAAT.VideoPlayer.initEmptyAnalysisListMenu();

			switch (this.mediaType) {
				case 'audio':
				case 'video':
					// setup timeline UI
					$('.timaat-videoplayer-timeline-area').show();
					switch (this.mediaType) {
						case 'audio':
							$('#timeline-layer-buttons').hide();
							break;
						case 'video':
							$('#timeline-layer-buttons').show();
							break;
					}
					let token = TIMAAT.VideoPlayer.model.medium.viewToken;
					$('.timeline-section-audio .timaat-audio-waveform').css('background-image', 'url("img/audio-placeholder.png")');
					$('.timeline-section-audio .timaat-audio-waveform').css('background-image', 'url("/TIMAAT/api/medium/'+TIMAAT.VideoPlayer.model.medium.id+'/audio/combined?token='+token+'")');

					if (this.model.medium.music) {
						this.curMusic = await TIMAAT.MusicService.getMusic(this.model.medium.music.id);
					}

					// setup timeline
					TIMAAT.VideoPlayer.timeline.initMedium(medium);

					// setup video overlay and UI
					$(TIMAAT.VideoPlayer.viewer.getContainer()).removeClass('timaat-videoplayer-medium-viewer')
																										 .addClass('timaat-videoplayer-medium-viewer');
					TIMAAT.VideoPlayer.viewer.invalidateSize();
					$('.timaat-videoplayer-noMedium').hide();
					$('.timaat-sidebar-tab-videoplayer').removeClass('isDisabled');
					$('.timaat-videoplayer-ui').show();
					$('.timaat-videoplayer-video-controls').show();
					var newMedium = new TIMAAT.Medium(medium, 'audio');
					TIMAAT.VideoPlayer.selectedMedium = newMedium;
					$('.timaat-sidebar-tab-videoplayer a').attr('onclick', 'TIMAAT.VideoPlayer.initializeAnnotationMode(TIMAAT.VideoPlayer.selectedMedium.model);');
					$('.timaat-sidebar-tab-videoplayer a').attr('title', 'Annotate '+this.mediaType);
					$('.timaat-sidebar-tab-videoplayer a').attr('data-original-title', 'Annotate '+ this.mediaType);

					$('#timaat-videoplayer-video-title').html(medium.displayTitle.name);
					let timeProgressDisplay = "00:00:00.000 / 00:00:00.000";
					switch (this.mediaType) {
						case 'audio':
							timeProgressDisplay = "00:00:00.000 / " + TIMAAT.Util.formatTime(this.model.medium.mediumAudio.length, true);
						break;
						case 'video':
							timeProgressDisplay = "00:00:00.000 / " + TIMAAT.Util.formatTime(this.model.medium.mediumVideo.length, true);
						break;
					}
					$('.timaat-mediumDuration').html(timeProgressDisplay);
					$('#timaat-timeline-slider-pane').show();

					var mediumUrl = '/TIMAAT/api/medium/'+this.mediaType+'/'+this.model.medium.id+'/download'+'?token='+medium.viewToken;
					switch (this.mediaType) {
						case 'audio':
							this.mediumBounds = L.latLngBounds([[ 450, 0], [ 0, 450]]);
						break;
						case 'video':
							this.mediumBounds = L.latLngBounds([[ 450, 0], [ 0, 450 / medium.mediumVideo.height * medium.mediumVideo.width]]);
						break;
					}
					TIMAAT.VideoPlayer.viewer.setMaxBounds(this.mediumBounds);
					TIMAAT.VideoPlayer.viewer.setMinZoom( 0.0 );
					TIMAAT.VideoPlayer.viewer.fitBounds(this.mediumBounds);
					TIMAAT.VideoPlayer.viewer.setMaxZoom( 0 );
					this.overlay = L.videoOverlay(mediumUrl, this.mediumBounds, { autoplay: false, loop: false} ).addTo(TIMAAT.VideoPlayer.viewer);
					this.medium = this.overlay.getElement();

					// setup viewer controls
					TIMAAT.VideoPlayer.viewer.dragging.disable();
					TIMAAT.VideoPlayer.viewer.touchZoom.disable();
					TIMAAT.VideoPlayer.viewer.doubleClickZoom.disable();
					TIMAAT.VideoPlayer.viewer.scrollWheelZoom.disable();
					$(TIMAAT.VideoPlayer.zoomCtrl.getContainer()).hide();
					$(TIMAAT.VideoPlayer.savePolygonCtrl.getContainer()).show();
					$(TIMAAT.VideoPlayer.editShapesCtrl.getContainer()).show();
					$('#timaat-volume-slider').change();

					// setup music form element model
					// TODO make sure that timeline elements will be refreshed once even if no analysis list exists
					// if (this.curMusic) {
					// 	console.log("TCL: refresh element structure")
					// 	this.refreshTimelineElementsStructure();
					// }
				break;
				case 'image':
					// disable timeline UI
					$('.timaat-videoplayer-timeline-area').hide();
					$('.timaat-videoplayer-video-controls').hide();

					// setup image overlay and UI
					$(TIMAAT.VideoPlayer.viewer.getContainer()).removeClass('timaat-videoplayer-medium-viewer')
																										 .addClass('timaat-videoplayer-medium-viewer');
					TIMAAT.VideoPlayer.viewer.invalidateSize();
					$('.timaat-videoplayer-noMedium').hide();
					$('.timaat-sidebar-tab-videoplayer').removeClass('isDisabled');
					$('.timaat-videoplayer-ui').show();
					var newMedium = new TIMAAT.Medium(medium, 'image');
					TIMAAT.VideoPlayer.selectedMedium = newMedium;
					$('.timaat-sidebar-tab-videoplayer a').attr('onclick', 'TIMAAT.VideoPlayer.initializeAnnotationMode(TIMAAT.VideoPlayer.selectedMedium.model);');
					$('.timaat-sidebar-tab-videoplayer a').attr('title', 'Annotate image');
					$('.timaat-sidebar-tab-videoplayer a').attr('data-original-title', 'Annotate image');

					$('#timaat-videoplayer-video-title').html(medium.displayTitle.name);
					$('#timaat-timeline-slider-pane').hide();
					$('.timaat-mediumDuration').html('N/A');

					var mediumUrl = '/TIMAAT/api/medium/image/'+this.model.medium.id+'/download'+'?token='+medium.viewToken;
					this.mediumBounds = L.latLngBounds([[ medium.mediumImage.height, 0], [ 0, medium.mediumImage.width ]]);
					TIMAAT.VideoPlayer.viewer.setMaxBounds(this.mediumBounds);
					TIMAAT.VideoPlayer.viewer.setMinZoom( -100 );
					let minZoom = TIMAAT.VideoPlayer.viewer.getBoundsZoom(TIMAAT.VideoPlayer.mediumBounds);
					TIMAAT.VideoPlayer.viewer.setMinZoom( minZoom );
					TIMAAT.VideoPlayer.viewer.fitBounds(this.mediumBounds);
					TIMAAT.VideoPlayer.viewer.setMaxZoom( 1 );
					this.overlay = L.imageOverlay(mediumUrl, this.mediumBounds, { interactive: false} ).addTo(TIMAAT.VideoPlayer.viewer);
					this.medium = null; //? TODO: why null?

					// setup viewer controls
					TIMAAT.VideoPlayer.viewer.dragging.enable();
					TIMAAT.VideoPlayer.viewer.touchZoom.enable();
					TIMAAT.VideoPlayer.viewer.doubleClickZoom.enable();
					TIMAAT.VideoPlayer.viewer.scrollWheelZoom.enable();
					$(TIMAAT.VideoPlayer.zoomCtrl.getContainer()).show();
					$(TIMAAT.VideoPlayer.savePolygonCtrl.getContainer()).show();
					$(TIMAAT.VideoPlayer.editShapesCtrl.getContainer()).show();
				break;
			}

			// setup inspector
			TIMAAT.VideoPlayer.inspector.reset();

			// setup medium data sheet
			TIMAAT.UI.clearLastSelection('medium');
			$('#medium-metadata-form').data('medium', medium);
			$('#mediumPreviewTab').addClass('annotationView');
			$('#timaat-mediadatasets-medium-tabs').show();
			TIMAAT.UI.displayDataSetContentContainer('medium-data-tab', 'medium-metadata-form', 'medium');
			let mediumModel = {};
			mediumModel.model = medium;
			TIMAAT.UI.displayDataSetContent('dataSheet', mediumModel, 'medium');
			$('#timaat-videoplayer-medium-tabs-container').append($('#timaat-mediadatasets-medium-tabs'));
			$('#timaat-videoplayer-medium-modals-container').append($('#timaat-medium-modals'));
			TIMAAT.MediumDatasets.container = 'videoplayer';
			$('.medium-datasheet-form-annotate-button').hide();
			$('.medium-datasheet-form-annotate-button').prop('disabled', true);

			switch (this.mediaType) {
				case 'audio':
					// duration = TIMAAT.Util.formatTime(medium.mediumAudio.length, true);
					this.duration = medium.mediumAudio.length;
					TIMAAT.VideoPlayer.activeLayer = 'audio';
					// this.setupAudio(medium);
				break;
				case 'image':
					this.duration = 0; // disable time-based annotations
					TIMAAT.VideoPlayer.activeLayer = 'visual';
					// this.setupImage(medium);
				break;
				case 'video':
					// duration = TIMAAT.Util.formatTime(medium.mediumVideo.length, true);
					this.duration = medium.mediumVideo.length;
					TIMAAT.VideoPlayer.activeLayer = 'visual';
					$('.timaat-button-visual-layer').click();
					// this.setupVideo(medium);
				break;
				default:
					console.error("TCL: setupMedium: ERROR: Don't know how to handle media of type >"+type+"<", medium);
					alert("setupMedium: ERROR: Don't know how to handle media of type >"+type+"<");
					throw "setupMedium: ERROR: Don't know how to handle media of type >"+type+"<";
			}

			// attach event handlers for UI elements
			let curMedium = this.medium;

			$(curMedium).on('canplay', function(ev) {
				TIMAAT.VideoPlayer.medium.currentTime = 0;
				$('#video-seek-bar').val(0);
				TIMAAT.VideoPlayer.viewer.invalidateSize(true);
				TIMAAT.UI.setWaiting(false);
				$(curMedium).off('canplay');
			});

			$(curMedium).on('timeupdate', function(ev) {
				if (TIMAAT.VideoPlayer.duration == 0) return;
				let currentTime = TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.medium.currentTime * 1000, true);
				$('.videotime').val(currentTime);
				let timeProgressDisplay = currentTime + " / " + TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.duration, true);
				$('.timaat-mediumDuration').html(timeProgressDisplay);

				// update timeline
				TIMAAT.VideoPlayer.timeline.updateIndicator();

				var value = (100 / TIMAAT.VideoPlayer.medium.duration) * TIMAAT.VideoPlayer.medium.currentTime;
				$('#video-seek-bar').val(value);
				$('#video-seek-bar').css('background', "linear-gradient(to right, #ed1e24 0%, #ed1e24 "+value+"%,#939393 "+value+"%,#939393 100%)");
				// update annotation list UI
				TIMAAT.VideoPlayer.updateListUI("timeupdate");
				if (TIMAAT.VideoPlayer.curAnnotation) TIMAAT.VideoPlayer.animCtrl.updateUI();
				TIMAAT.VideoPlayer.updateUI();
			});
		},

		setupMediumAnalysisLists: async function (lists) {
			// console.log("TCL: setupMediumAnalysisLists: ", lists);
			// clear old lists if any
			$('#timaat-analysislist-chooser').empty();
			// setup model
			TIMAAT.VideoPlayer.model.analysisLists = lists;
			lists.forEach(function(list) {
				list.ui = $('<option value="'+list.id+'">'+TIMAAT.Util.getDefaultTranslation(list, 'mediumAnalysisListTranslations', 'title')+'</option>');
				list.ui.data('list', list);
				$('#timaat-analysislist-chooser').append(list.ui);
			});

			// update UI
			$('#timaat-analysislist-options').prop('disabled', false);
			$('#timaat-analysislist-options').removeAttr('disabled');
			$('#timaat-analysislist-chooser').prop('disabled', false);
			$('#timaat-analysislist-chooser').removeAttr('disabled');
			$('#timaat-analysislist-chooser').removeClass("timaat-item-disabled");
		},

		loadAnalysisList: async function(listId) {
      // console.log("TCL: loadAnalysisList:function -> listId", listId);
			if ( TIMAAT.VideoPlayer.model.analysisLists.length == 0 ) { // no analysis lists available
				await TIMAAT.VideoPlayer.setupAnalysisList(null);
				TIMAAT.VideoPlayer.initEmptyAnalysisListMenu();
			}	else { // load specific analysis list if possible, else load first available analysis list
				let index = TIMAAT.VideoPlayer.model.analysisLists.findIndex(({id}) => id === listId);
				if (index > 0) {
					await TIMAAT.VideoPlayer.setupAnalysisList(TIMAAT.VideoPlayer.model.analysisLists[index]);
					$('#timaat-analysislist-chooser').val(listId);
				} else {
					await TIMAAT.VideoPlayer.setupAnalysisList(TIMAAT.VideoPlayer.model.analysisLists[0]);
				}
				TIMAAT.VideoPlayer.initAnalysisListMenu();
			}
		},

		setupAnalysisList: async function(analysisList) {
			if (analysisList) this.currentPermissionLevel = await TIMAAT.AnalysisListService.getMediumAnalysisListPermissionLevel(analysisList.id);
			else this.currentPermissionLevel = null;

			if (analysisList == this.curAnalysisList) return; // no new analysis list loaded
			// console.log("TCL: setupAnalysisList: ", analysisList);
			if ( this.curAnnotation ) this.curAnnotation.setSelected(false);

			// setup model
			this.model.analysisList = analysisList;
			// close UI tag editors if any
			TIMAAT.UI.hidePopups();
			// clear polygon UI
			this.viewer.annoLayer.eachLayer(function(layer) {layer.remove()});
			this.viewer.editTools.editLayer.eachLayer(function(layer) {layer.remove()});

			// clear old list contents if any
			if (this.curAnalysisList != null) {
				this.annotationList.forEach(function(anno) {
					anno.remove();
				});
				this.clearTimelineElementsStructure();
			}
			this.annotationList = [];
			this.curAnalysisList = analysisList;
			// build annotation list from model
			if ( analysisList ) {
				analysisList.annotations.forEach(function(annotation) {
					TIMAAT.VideoPlayer.annotationList.push(new TIMAAT.Annotation(annotation));
				});
			}
			this.refreshTimelineElementsStructure();

			// this.selectAnnotation(null);
			this.inspector.setItem(this.curAnalysisList, 'analysisList');
			this.selectedElementType = 'analysisList';

			// setup analysisList UI
			$('#timaat-annotation-list-loader').hide();
			$('#timaat-videoplayer-annotation-add-button').prop('disabled', this.curAnalysisList == null);
			if ( this.curAnalysisList )
				$('#timaat-videoplayer-annotation-add-button').removeAttr('disabled');
			else
				$('#timaat-videoplayer-annotation-add-button').attr('disabled');
			$('#timaat-user-log-analysislist').prop('disabled', this.curAnalysisList == null);
			if ( this.curAnalysisList ) {
				$('#timaat-user-log-analysislist').removeAttr('disabled');
				// send notification to server
				TIMAAT.UI.sendNotification('subscribe-list', this.curAnalysisList.id);
			} else {
				$('#timaat-user-log-analysislist').attr('disabled');
			}

			if (this.curAnalysisList) {
				TIMAAT.URLHistory.setURL(null, 'Analysis · '+ this.curAnalysisList.mediumAnalysisListTranslations[0].title, '#analysis/'+this.curAnalysisList.id);
				// DEBUG
				$('#timeline-list-title').text('"'+this.curAnalysisList.mediumAnalysisListTranslations[0].title+'"');
			} else {
				TIMAAT.URLHistory.setURL(null, 'Video Player', '#analysis');
				// DEBUG
				$('#timeline-list-title').text('N/A');
			}
		},

		userLogForList: function() {
			// console.log("TCL: userLogForList: function()");
			$('#timaat-user-log-analysislist').popover('show');
		},

		addAnalysisList: function() {
			// console.log("TCL: addAnalysisList: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.inspector.setItem(null, 'analysisList');
		},

		updateAnalysisList: async function(analysisList) {
			// console.log("TCL: updateAnalysisList - analysisList", analysisList);
			// sync to server
			await TIMAAT.AnalysisListService.updateMediumAnalysisList(analysisList);
			// console.log("TCL: updateAnalysisList - analysisList", analysisList);
			// TODO update UI list view
			TIMAAT.VideoPlayer.curAnalysisList.ui.html(TIMAAT.Util.getDefaultTranslation(TIMAAT.VideoPlayer.curAnalysisList, 'mediumAnalysisListTranslations', 'title'));
		},

		editAnalysisList: function() {
			// console.log("TCL: editAnalysisList: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.selectAnnotation(null);
			TIMAAT.VideoPlayer.inspector.setItem(TIMAAT.VideoPlayer.curAnalysisList, 'analysisList');
			TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
		},

		removeAnalysisList: function() {
			// console.log("TCL: removeAnalysisList: function()");
			if ( !this.curAnalysisList ) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-analysislist-delete').data('analysisList', this.curAnalysisList);
			$('#timaat-videoplayer-analysislist-delete').modal('show');
		},

		manageAnalysisList: async function() {
			// console.log("TCL: manageAnalysisList: function()");
			// check if user is moderator or administrator of the analysis list.
			let permissionLevel = await TIMAAT.AnalysisListService.getMediumAnalysisListPermissionLevel(this.curAnalysisList.id);
			if (permissionLevel == 3 || permissionLevel == 4) {
				TIMAAT.VideoPlayer.pause();
				let modal = $('#timaat-videoplayer-analysis-manage');
				// get all display names and permissions for this analysis
				let userDisplayNameAndPermissionList = await TIMAAT.AnalysisListService.getDisplayNamesAndPermissions(this.curAnalysisList.id);
				TIMAAT.VideoPlayer.userPermissionList = userDisplayNameAndPermissionList;
				let modalBodyText = `<div class="col-12">
					<div class="row">
						<div class="col-7">
							<h6>User</h6>
							<div id="analysisPermissionUserName">
							</div>
						</div>
						<div class="col-4">
							<h6>Access rights</h6>
							<div id="analysisPermissionLevel">
							</div>
						</div>
						<div class="col-1">
						</div>
					</div>`;
				let i = 0;
				for (; i < userDisplayNameAndPermissionList.length; i++) {
					modalBodyText += `<div class="permissionContainer" data-userId="`+userDisplayNameAndPermissionList[i].userAccountId+`">
						<hr>
						<div class="row vertical-aligned">
							<div class="col-7">
								` + userDisplayNameAndPermissionList[i].displayName + `
							</div>
							<div class="col-4" data-role="changeUserPermissionAnalysisList">`;
					if ( permissionLevel == 3 ) {
						switch (userDisplayNameAndPermissionList[i].permissionId) {
							case 1:
								modalBodyText += `<select class="custom-select" data-role="select">
													<option value="1" selected>Read</option>
													<option value="2">Read+Write</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionAnalysisList">
												<button class="removePermission badge btn btn-sm btn-danger p-1 float-right" data-role="remove" data-userId="`+userDisplayNameAndPermissionList[i].userAccountId+`" data-listId="`+userDisplayNameAndPermissionList[i].permissionId+`">
													<i class="fas fa-minus fa-fw"></i>
												</button>
											</div>
										</div>
									</div>`;
							break;
							case 2:
								modalBodyText += `<select class="custom-select" data-role="select">
													<option value="1">Read</option>
													<option value="2" selected>Read+Write</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionAnalysisList">
												<button class="removePermission badge btn btn-sm btn-danger p-1 float-right" data-role="remove" data-userId="`+userDisplayNameAndPermissionList[i].userAccountId+`" data-listId="`+userDisplayNameAndPermissionList[i].permissionId+`">
													<i class="fas fa-minus fa-fw"></i>
												</button>
											</div>
										</div>
									</div>`;
							break;
							case 3:
								modalBodyText += `<select class="custom-select" data-role="select" disabled>
													<option value="3" selected>Moderate</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionAnalysisList">
											</div>
										</div>
									</div>`;
							break;
							case 4:
								modalBodyText += `<select class="custom-select" data-role="select" disabled>
													<option value="4" selected>Administrate</option>
												</select>
											</div>
											<div class="col-1" data-role="removeUserPermissionAnalysisList">
											</div>
										</div>
									</div>`;
							break;
							default:
								modalBodyText += `An error occurred!`; // should never occur
							break;
						}
					} else { // permissionLevel == 4
						switch (userDisplayNameAndPermissionList[i].permissionId) {
							case 1:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1" selected>Read</option>
										<option value="2">Read+Write</option>
										<option value="3">Moderate</option>
										<option value="4">Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" style="display: none; color: red;">At least one administrator needs to exist.</small>`;
							break;
							case 2:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1">Read</option>
										<option value="2" selected>Read+Write</option>
										<option value="3">Moderate</option>
										<option value="4">Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" style="display: none; color: red;">At least one administrator needs to exist.</small>`;
							break;
							case 3:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1">Read</option>
										<option value="2">Read+Write</option>
										<option value="3" selected>Moderate</option>
										<option value="4">Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" style="display: none; color: red;">At least one administrator needs to exist.</small>`;
							break;
							case 4:
								modalBodyText += `<select class="custom-select" data-role="select">
										<option value="1">Read</option>
										<option value="2">Read+Write</option>
										<option value="3">Moderate</option>
										<option value="4" selected>Administrate</option>
									</select>
									<small id="adminCannotBeChanged_`+userDisplayNameAndPermissionList[i].userAccountId+`" style="display: none; color: red;">At least one administrator needs to exist.</small>`;
							break;
							default:
								modalBodyText += `An error occurred!`; // should never occur
							break;
						}
						modalBodyText += `
									</div>
									<div class="col-1" data-role="removeUserPermissionAnalysisList">
										<button class="removePermission badge btn btn-sm btn-danger p-1 float-right" data-role="remove" data-userId="`+userDisplayNameAndPermissionList[i].userAccountId+`" data-listId="`+userDisplayNameAndPermissionList[i].permissionId+`">
											<i class="fas fa-minus fa-fw"></i>
										</button>
									</div>
								</div>
							</div>`;
					}
				}
				modalBodyText += `<div id="newPermissionContainer">
					<hr>
					<div class="row vertical-aligned" data-role="newPermission">
						<div class="col-2">
							<h6>Add user</h6>
						</div>
						<div class="col-5">
							<input type="text" id="userAccountForNewPermission" class="form-control username" placeholder="Username" aria-label="Username">
							<small id="userAccountDoesNotExistInfo" style="display: none; color: red;">This user name does not exist. Please check your spelling and try again.</small>
							<small id="userAccountAlreadyInList" style="display: none; color: red;">This user already has a permission level.</small>
							<small id="adminCanNotBeAddedInfo" style="display: none; color: red;">Admin can not be added.</small>
						</div>
						<div class="col-4">
							<select class="custom-select" id="newAccessRightsSelect">
								<option value="1" selected>Read</option>
								<option value="2">Read+Write</option>`;
				if (permissionLevel == 4) {	 // only admins can create mods and admins
					modalBodyText += `<option value="3">Moderate</option>
						<option value="4">Administrate</option>`;
				}
				modalBodyText += `</select>
							</div>
							<div class="col-1" data-role="newUserPermissionAnalysisList">
								<button class="addNewPermission btn btn-sm btn-primary p-1 float-right" data-role="add" data-userId="0" data-listId="0">
									<i class="fas fa-plus fa-fw"></i>
								</button>
							</div>
						</div>
						<div class="globalPermissionContainer">
							<hr>
							<div class="row vertical-aligned" data-role="globalUserPermission">
								<fieldset>
									<legend>You can grant all users access to this analysis</legend>
									<div id="globalPermission" class="radioButtonsHorizontalEvenlySpaced" data-role="select">
										<label>
											<input id="globalPermission_0" type="radio" name="globalPermissionAnalysisList" value="0"> No global access
										</label>
										<label>
											<input id="globalPermission_1" type="radio" name="globalPermissionAnalysisList" value="1"> Read
										</label>
										<label>
											<input id="globalPermission_2" type="radio" name="globalPermissionAnalysisList" value="2"> Read+Write
										</label>
									</div>
								</fieldset>
							</div>
						</div>
					</div>
				</div>`;
				modal.find('.modal-body').html(modalBodyText);
				if (TIMAAT.VideoPlayer.curAnalysisList.globalPermission == null) TIMAAT.VideoPlayer.curAnalysisList.globalPermission = 0;
				$('#globalPermission_'+ TIMAAT.VideoPlayer.curAnalysisList.globalPermission).prop('checked', true);
				modal.modal('show');
			}
			// TODO else show popup 'you have no rights'
		},

		addQuickAnnotation: function() {
			// console.log("TCL: addQuickAnnotation: function()");
			if ( !TIMAAT.VideoPlayer.curAnalysisList ) return;
			let model = {};
			if (TIMAAT.VideoPlayer.curAnalysisList.mediumType == 'video' || TIMAAT.VideoPlayer.curAnalysisList.mediumType == 'audio') {
				TIMAAT.VideoPlayer.pause();
				model = {
					id: 0,
					startTime: TIMAAT.VideoPlayer.medium.currentTime * 1000,
					endTime: TIMAAT.VideoPlayer.medium.currentTime * 1000,
					layerVisual: true,
					layerAudio: true,
					// actors: [],
					// annotations1: [],
					// annotations2: [],
					// categories: [],
					// events: [],
					// locations: [],
					// mediums: [],
					annotationTranslations: [{
						id: 0,
						comment: "Bookmark to edit",
						title: "Annotation at "+TIMAAT.Util.formatTime(TIMAAT.VideoPlayer.medium.currentTime * 1000,true),
					}],
					selectorSvgs: [{
						id: 0,
						colorHex: "555555",
						opacity: 30, //* 0..1 is stored as 0..100 (Byte)
						svgData: "{\"keyframes\":[{\"time\":0,\"shapes\":[]}]}",
						strokeWidth: 1,
						svgShapeType: {
							id: 5
						}
					}]
				}
			// } else if (TIMAAT.VideoPlayer.curAnalysisList.mediumType == 'image') {
			// 	model = {
			// 		id: 0,
			// 		startTime: 0,
			// 		endTime: 0,
			// 		layerVisual: true,
			// 		layerAudio: false,
			// 		annotationTranslations: [{
			// 			id: 0,
			// 			comment: "Bookmark to edit",
			// 			title: "Quick annotation",
			// 		}],
			// 		selectorSvgs: [{
			// 			id: 0,
			// 			colorHex: "555555",
			// 			opacity: 30, //* 0..1 is stored as 0..100 (Byte)
			// 			svgData: "{\"keyframes\":[{\"time\":0,\"shapes\":[]}]}",
			// 			strokeWidth: 1,
			// 			svgShapeType: {
			// 				id: 5
			// 			}
			// 		}]
			// 	}
			} else return; // for now only videos can receive quick annotations
			TIMAAT.AnnotationService.createAnnotation(model, TIMAAT.VideoPlayer.curAnalysisList.id, TIMAAT.VideoPlayer._annotationAdded);
		},

		addAnnotation: function() {
			// console.log("TCL: addAnnotation: function()");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.inspector.setItem(null, 'annotation');
		},

		updateAnnotation: function(annotation) {
			// console.log("TCL: updateAnnotation: annotation", annotation);
			// sync to server
			TIMAAT.AnnotationService.updateAnnotation(annotation.model);
			// update UI list view
			annotation.updateUI();
			this.updateUI();
			this.updateListUI();
			this.sortListUI();
		},

		updateAnnotations: function() {
			// console.log("TCL: updateAnnotations: function()");
			if ( this.annotationList == null ) return;
			this.annotationList.forEach(function(annotation) {
				if ( annotation.isSelected() && annotation.hasChanges() ) {
					annotation.saveChanges();
					TIMAAT.AnnotationService.updateAnnotation(annotation.model);
					// update UI
					annotation.updateUI();
					// console.log("TCL: annotation.updateUI()");
				}
			});

			// update UI list view
			this.updateListUI();
			this.sortListUI();
			this.updateUI();
		},

		removeAnnotation: function() {
			// console.log("TCL: removeAnnotation: function()");
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
				// switch layer if selected annotation is not available on active layer
				if (this.activeLayer == 'visual' && !this.curAnnotation.model.layerVisual) {
					$('.timaat-button-audio-layer').trigger('click');
				} else if (this.activeLayer == 'audio' && !this.curAnnotation.model.layerAudio) {
					$('.timaat-button-visual-layer').trigger('click');
				}
				this.curAnnotation.setSelected(true);
				$('#timaat-videoplayer-annotation-remove-button').prop('disabled', false);
				$('#timaat-videoplayer-annotation-remove-button').removeAttr('disabled');
			} else {
				$('#timaat-videoplayer-annotation-remove-button').prop('disabled', true);
				$('#timaat-videoplayer-annotation-remove-button').attr('disabled');
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
			// console.log("TCL: setCategorySet: function(categorySet)");
			// console.log("TCL: categorySet", categorySet);
			TIMAAT.VideoPlayer.curCategorySet = categorySet;
			TIMAAT.VideoPlayer.categoryAutocomplete.length = 0;
			if ( categorySet ) {
				$(categorySet.model.categories).each(function(index,category) {
					TIMAAT.VideoPlayer.categoryAutocomplete.push(category.name);
				});
			}
		},

		addAnalysisSegmentElement: function(type) {
			// console.log("TCL: addAnalysisSegmentElement: function("+type+")");
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.inspector.setItem(null, type);
		},

		removeAnalysisSegmentElement: function(type, data) {
			// console.log("TCL: removeAnalysisSegmentElement: type, data", type, data);
			if (!data) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-segment-element-delete').data('type', type);
			$('#timaat-videoplayer-segment-element-delete').data('model', data.model);
			$('#timaat-videoplayer-segment-element-delete').find('.modal-title').html("Delete "+ type);
			$('#timaat-videoplayer-segment-element-delete').find('.modal-body').html("Do you want to delete the selected "+ type + "?");
			$('#timaat-videoplayer-segment-element-delete').modal('show');
		},

		updateAnalysisSegmentElement: async function(type, element) {
			// console.log("TCL: updateAnalysisSegmentElement:function -> element", element);
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

		addMusicElement: function(type) {
			TIMAAT.VideoPlayer.pause();
			TIMAAT.VideoPlayer.inspector.setItem(null, type);
		},

		updateMusicFormElement: async function(musicFormElement) {
			// console.log("TCL: updateMusicFormElement:function -> musicFormElement: ", musicFormElement);
			// sync to server
			musicFormElement.model.musicFormElementType = await TIMAAT.MusicService.getMusicFormElementType(musicFormElement.model.musicFormElementType.id);
			await TIMAAT.MusicService.updateMusicFormElement(musicFormElement.model);
			await TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicFormElementsUI);

			// update UI list view
			musicFormElement.updateUI();
			this.updateListUI();
			// this.sortListUI();
		},

		updateMusicChangeInTempoElement: async function(musicChangeInTempoElement) {
			// console.log("TCL: updateMusicChangeInTempoElement:function -> musicChangeInTempoElement: ", musicChangeInTempoElement);
			// sync to server
			musicChangeInTempoElement.model.changeInTempo = await TIMAAT.MusicService.getChangeInTempo(musicChangeInTempoElement.model.changeInTempo.id);
			await TIMAAT.MusicService.updateMusicChangeInTempoElement(musicChangeInTempoElement.model);
			await TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI);

			// update UI list view
			musicChangeInTempoElement.updateUI();
			this.updateListUI();
			// this.sortListUI();
		},

		updateMusicArticulationElement: async function(musicArticulationElement) {
			// console.log("TCL: updateMusicArticulationElement:function -> musicArticulationElement: ", musicArticulationElement);
			// sync to server
			musicArticulationElement.model.articulation = await TIMAAT.MusicService.getArticulation(musicArticulationElement.model.articulation.id);
			await TIMAAT.MusicService.updateMusicArticulationElement(musicArticulationElement.model);
			await TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI);

			// update UI list view
			musicArticulationElement.updateUI();
			this.updateListUI();
			// this.sortListUI();
		},

		updateMusicDynamicsElement: async function(musicDynamicsElement) {
			// console.log("TCL: updateMusicDynamicsElement:function -> musicDynamicsElement: ", musicDynamicsElement);
			// sync to server
			musicDynamicsElement.model.dynamics = await TIMAAT.MusicService.getDynamics(musicDynamicsElement.model.dynamics.id);
			await TIMAAT.MusicService.updateMusicDynamicsElement(musicDynamicsElement.model);
			await TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI);

			// update UI list view
			musicDynamicsElement.updateUI();
			this.updateListUI();
			// this.sortListUI();
		},

		updateMusicTextSettingElement: async function(musicTextSettingElement) {
			// console.log("TCL: updateMusicTextSettingElement:function -> musicTextSettingElement: ", musicTextSettingElement);
			// sync to server
			musicTextSettingElement.model.musicTextSettingElementType = await TIMAAT.MusicService.getMusicTextSettingElementType(musicTextSettingElement.model.musicTextSettingElementType.id);
			await TIMAAT.MusicService.updateMusicTextSettingElement(musicTextSettingElement.model);
			await TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI);

			// update UI list view
			musicTextSettingElement.updateUI();
			this.updateListUI();
			// this.sortListUI();
		},

		removeMusicFormElement: function(data) {
			// console.log("TCL: removeMusicFormElement: data", data);
			if (!data) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-music-form-element-delete').data('model', data.model);
			$('#timaat-videoplayer-music-form-element-delete').find('.modal-title').html("Delete music form element");
			$('#timaat-videoplayer-music-form-element-delete').find('.modal-body').html("Do you want to delete the selected element?");
			$('#timaat-videoplayer-music-form-element-delete').modal('show');
		},

		removeMusicChangeInTempoElement: function(data) {
			// console.log("TCL: removeMusicChangeInTempoElement: data", data);
			if (!data) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-music-change-in-tempo-element-delete').data('model', data.model);
			$('#timaat-videoplayer-music-change-in-tempo-element-delete').find('.modal-title').html("Delete music change in tempo element");
			$('#timaat-videoplayer-music-change-in-tempo-element-delete').find('.modal-body').html("Do you want to delete the selected element?");
			$('#timaat-videoplayer-music-change-in-tempo-element-delete').modal('show');
		},

		removeMusicArticulationElement: function(data) {
			// console.log("TCL: removeMusicArticulationElement: data", data);
			if (!data) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-music-articulation-element-delete').data('model', data.model);
			$('#timaat-videoplayer-music-articulation-element-delete').find('.modal-title').html("Delete music articulation element");
			$('#timaat-videoplayer-music-articulation-element-delete').find('.modal-body').html("Do you want to delete the selected element?");
			$('#timaat-videoplayer-music-articulation-element-delete').modal('show');
		},

		removeMusicDynamicsElement: function(data) {
			// console.log("TCL: removeMusicDynamicsElement: data", data);
			if (!data) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-music-dynamics-element-delete').data('model', data.model);
			$('#timaat-videoplayer-music-dynamics-element-delete').find('.modal-title').html("Delete music dynamics element");
			$('#timaat-videoplayer-music-dynamics-element-delete').find('.modal-body').html("Do you want to delete the selected element?");
			$('#timaat-videoplayer-music-dynamics-element-delete').modal('show');
		},

		removeMusicTextSettingElement: function(data) {
			// console.log("TCL: removeMusicTextSettingElement: data", data);
			if (!data) return;
			TIMAAT.VideoPlayer.pause();
			$('#timaat-videoplayer-music-text-setting-element-delete').data('model', data.model);
			$('#timaat-videoplayer-music-text-setting-element-delete').find('.modal-title').html("Delete music text setting element");
			$('#timaat-videoplayer-music-text-setting-element-delete').find('.modal-body').html("Do you want to delete the selected element?");
			$('#timaat-videoplayer-music-text-setting-element-delete').modal('show');
		},

		offLinePublication: function() {
			let modal = $('#timaat-videoplayer-download-publication');
		if (TIMAAT.VideoPlayer.mediaType == 'video' || TIMAAT.VideoPlayer.mediaType == 'image' || TIMAAT.VideoPlayer.mediaType == 'audio') {
				modal.find('a.download-player-link').attr('href', 'api/publication/offline/'+TIMAAT.VideoPlayer.curAnalysisList.id+'?authToken='+TIMAAT.Service.session.token);
				modal.find('a.download-medium-link').attr('href', 'api/medium/'+TIMAAT.VideoPlayer.mediaType+'/'+this.model.medium.id+'/download'+'?token='+this.model.medium.viewToken+'&force=true');
			}
			modal.modal('show');
		},

		managePublication: function() {
			TIMAAT.PublicationService.getSinglePublication(TIMAAT.VideoPlayer.curAnalysisList.id).then(publication => {
      	console.log("TCL: TIMAAT.VideoPlayer.viewer.on -> publication", publication);
				let modal = $('#timaat-videoplayer-publication');
				TIMAAT.VideoPlayer.publication = publication;
				TIMAAT.VideoPlayer._setupPublicationDialog(publication !=null, publication !=null && publication.access == 'protected');
				modal.find('.saveinfo').hide();
				modal.modal('show');
			}).catch(publication => {
				let modal = $('#timaat-videoplayer-publication');
				// console.log("managePublication:fail", publication);
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
			if ( sortedList.length > 0 ) {
				// sort and display only annotations of the active layer
				let i = sortedList.length -1;
				if (TIMAAT.VideoPlayer.activeLayer == 'visual') {
					for (; i >= 0; i--) {
						if (!sortedList[i].model.layerVisual)
							sortedList.splice(i, 1);
					}
				} else if (TIMAAT.VideoPlayer.activeLayer == 'audio') {
					for (; i >= 0; i--) {
						if (!sortedList[i].model.layerAudio)
							sortedList.splice(i, 1);
					}
				}
			}
			sortedList.sort(function (a, b) {
				if ( b.startTime < a.startTime ) return 1;
				if ( b.startTime > a.startTime ) return -1;
				return 0;
			});

			// position annotation markers in timeline
			let maxOffset = 0;
			if ( sortedList.length > 0 ) {
				sortedList[0].marker.UIOffset = 0;
				for (let i = 1; i < sortedList.length; i++) {
					let curOffset = 0;
					let occupiedOffsets = [];
					// TODO
					for (var a = 0; a < i; a++) {
						if (sortedList[a].endTime >= sortedList[i].startTime ) {
							occupiedOffsets.push(sortedList[a].marker.UIOffset);
							while ( occupiedOffsets.indexOf(curOffset) >= 0 ) curOffset++;
						}
					}
					sortedList[i].marker.UIOffset = curOffset;
					if ( curOffset > maxOffset ) maxOffset = curOffset;
					sortedList[i].marker.updateView();
				}
			}
			$('#timaat-timeline-marker-pane').css('height', (30 + (maxOffset * 12)) + 'px');
		},

		updateListUI: function(viaTimeUpdate = null) {
			if ( TIMAAT.VideoPlayer.curAnalysisList != null && TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI != null) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
					segment.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
					if (TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI != null)
						TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.forEach(function(sequence) {
							sequence.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
							if (TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI != null)
								TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.forEach(function(take) {
									take.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
								});
						});
					if (TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI != null)
						TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.forEach(function(scene) {
							scene.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
							if (TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI != null)
								TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.forEach(function(action) {
									action.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
								});
						});
				});
			}

			if ( TIMAAT.VideoPlayer.annotationList ) for (let annotation of TIMAAT.VideoPlayer.annotationList) if ( TIMAAT.VideoPlayer.duration > 0 ) annotation.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);

			if ( TIMAAT.VideoPlayer.curMusic != null && TIMAAT.VideoPlayer.medium ) {
				if (TIMAAT.VideoPlayer.curMusic.musicFormElementsUI != null) {
					TIMAAT.VideoPlayer.curMusic.musicFormElementsUI.forEach(function(musicFormElement) {
						musicFormElement.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
					});
				}
				if ( TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI != null ) {
					TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI.forEach(function(musicChangeInTempoElement) {
						musicChangeInTempoElement.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
					});
				}
				if ( TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI != null ) {
					TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI.forEach(function(musicArticulationElement) {
						musicArticulationElement.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
					});
				}
				if ( TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI != null ) {
					TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI.forEach(function(musicDynamicsElement) {
						musicDynamicsElement.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
					});
				}
				if ( TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI != null ) {
					TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI.forEach(function(musicTextSettingElement) {
						musicTextSettingElement.updateStatus(TIMAAT.VideoPlayer.medium.currentTime, viaTimeUpdate);
					});
				}
			}
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
			if ( TIMAAT.VideoPlayer.duration == 0 && this.curAnnotation ) enabled = true; // switch for non time-based media (images)
			TIMAAT.VideoPlayer.editShapesCtrl.setEnabled(enabled);
			// $('.repeatbutton').prop('disabled', TIMAAT.VideoPlayer.curAnnotation == null );
		},

		refreshTimelineElementsStructure: async function() {
      // console.log("TCL: refreshTimelineElementsStructure:function()");
			await TIMAAT.VideoPlayer.clearTimelineElementsStructure();
			// Refresh current list data (required mainly for delete operations)
			if (TIMAAT.VideoPlayer.curAnalysisList) {
				TIMAAT.VideoPlayer.curAnalysisList = await TIMAAT.AnalysisListService.getAnalysisList(TIMAAT.VideoPlayer.curAnalysisList.id);
			}
			if (TIMAAT.VideoPlayer.curMusic) {
				TIMAAT.VideoPlayer.curMusic = await TIMAAT.MusicService.getMusic(TIMAAT.VideoPlayer.curMusic.id);
			}
			await TIMAAT.VideoPlayer.createTimelineElementsStructure();
			await TIMAAT.VideoPlayer.sortTimelineElementsStructure();
			await TIMAAT.VideoPlayer.showTimelineElementsStructure();
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

		clearTimelineElementsStructure: function() {
      // console.log("TCL: clearTimelineElementsStructure:function()");
			if (TIMAAT.VideoPlayer.curAnalysisList) {
				if (TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI) {
					TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
						segment.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI) {
					TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.forEach(function(sequence) {
						sequence.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI) {
					TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.forEach(function(take) {
						take.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI) {
					TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.forEach(function(scene) {
						scene.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI) {
					TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.forEach(function(action) {
						action.removeUI();
					});
				}
			}
			if (TIMAAT.VideoPlayer.curMusic) {
				if (TIMAAT.VideoPlayer.curMusic.musicFormElementsUI) {
					TIMAAT.VideoPlayer.curMusic.musicFormElementsUI.forEach(function(musicFormElement) {
						musicFormElement.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI) {
					TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI.forEach(function(musicChangeInTempoElement) {
						musicChangeInTempoElement.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI) {
					TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI.forEach(function(musicArticulationElement) {
						musicArticulationElement.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI) {
					TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI.forEach(function(musicDynamicsElement) {
						musicDynamicsElement.removeUI();
					});
				}
				if (TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI) {
					TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI.forEach(function(musicTextSettingElement) {
						musicTextSettingElement.removeUI();
					});
				}
			}
		},

		createTimelineElementsStructure: function() {
      // console.log("TCL: createTimelineElementsStructure:function()");
			// setup segment model
			if (TIMAAT.VideoPlayer.curAnalysisList) {
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
			}
			if (TIMAAT.VideoPlayer.curMusic) {
				TIMAAT.VideoPlayer.curMusic.musicFormElementsUI = Array();
				TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI = Array();
				TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI = Array();
				TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI = Array();
				TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI = Array();
				TIMAAT.VideoPlayer.curMusic.musicFormElementList.forEach(function(musicFormElement) {
					TIMAAT.VideoPlayer.curMusic.musicFormElementsUI.push(new TIMAAT.MusicFormElement(musicFormElement));
				});
				TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementList.forEach(function(musicChangeInTempoElement) {
					TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI.push(new TIMAAT.MusicChangeInTempoElement(musicChangeInTempoElement));
				});
				TIMAAT.VideoPlayer.curMusic.musicArticulationElementList.forEach(function(musicArticulationElement) {
					TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI.push(new TIMAAT.MusicArticulationElement(musicArticulationElement));
				});
				TIMAAT.VideoPlayer.curMusic.musicDynamicsElementList.forEach(function(musicDynamicsElement) {
					TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI.push(new TIMAAT.MusicDynamicsElement(musicDynamicsElement));
				});
				TIMAAT.VideoPlayer.curMusic.musicTextSettingElementList.forEach(function(musicTextSettingElement) {
					TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI.push(new TIMAAT.MusicTextSettingElement(musicTextSettingElement));
				});
			}
		},

		sortTimelineElementsStructure: function() {
      // console.log("TCL: sortTimelineElementsStructure:function()");
			if (this.curAnalysisList) {
				this.sort(this.curAnalysisList.analysisSegmentsUI);
				this.sort(this.curAnalysisList.analysisSequencesUI);
				this.sort(this.curAnalysisList.analysisTakesUI);
				this.sort(this.curAnalysisList.analysisScenesUI);
				this.sort(this.curAnalysisList.analysisActionsUI);
			}
			if (this.curMusic) {
				this.sort(this.curMusic.musicFormElementsUI);
				this.sort(this.curMusic.musicChangeInTempoElementsUI);
				this.sort(this.curMusic.musicArticulationElementsUI);
				this.sort(this.curMusic.musicDynamicsElementsUI);
				this.sort(this.curMusic.musicTextSettingElementsUI);
			}
		},

		showTimelineElementsStructure: function() {
    	// console.log("TCL: showTimelineElementsStructure:function()");
			// build annotation list from model
			$('.timeline-pane').hide();
			if (this.curAnalysisList != null && this.curAnalysisList.analysisSegmentsUI != null && this.curAnalysisList.analysisSegmentsUI.length > 0) {
				this.curAnalysisList.analysisSegmentsUI.forEach(function(segment) {
					segment.addUI();
				});
				$('#timaat-timeline-segment-pane').show();
				if (this.curAnalysisList.analysisSequencesUI != null && this.curAnalysisList.analysisSequencesUI.length > 0) {
					this.curAnalysisList.analysisSequencesUI.forEach(function(sequence) {
						sequence.addUI();
					});
					$('#timaat-timeline-sequence-pane').show();
					if (this.curAnalysisList.analysisTakesUI != null && this.curAnalysisList.analysisTakesUI.length > 0) {
						this.curAnalysisList.analysisTakesUI.forEach(function(take) {
							take.addUI();
						});
					$('#timaat-timeline-take-pane').show();
					}
				}
				if (this.curAnalysisList.analysisScenesUI != null && this.curAnalysisList.analysisScenesUI.length > 0) {
					this.curAnalysisList.analysisScenesUI.forEach(function(scene) {
						scene.addUI();
					});
					$('#timaat-timeline-scene-pane').show();
					if (this.curAnalysisList.analysisActionsUI != null && this.curAnalysisList.analysisActionsUI.length > 0) {
						this.curAnalysisList.analysisActionsUI.forEach(function(action) {
							action.addUI();
						});
						$('#timaat-timeline-action-pane').show();
					}
				}
			}
			if (this.curMusic != null) {
				if (this.curMusic.musicFormElementsUI != null) {
					this.curMusic.musicFormElementsUI.forEach(function(musicFormElement) {
						musicFormElement.addUI();
					});
					$('#timaat-timeline-music-form-element-pane').show();
				}
				if (this.curMusic.musicChangeInTempoElementsUI != null) {
					this.curMusic.musicChangeInTempoElementsUI.forEach(function(musicChangeInTempoElement) {
						musicChangeInTempoElement.addUI();
					});
					$('#timaat-timeline-music-change-in-tempo-element-pane').show();
				}
				if (this.curMusic.musicArticulationElementsUI != null) {
					this.curMusic.musicArticulationElementsUI.forEach(function(musicArticulationElement) {
						musicArticulationElement.addUI();
					});
					$('#timaat-timeline-music-articulation-element-pane').show();
				}
				if (this.curMusic.musicDynamicsElementsUI != null) {
					this.curMusic.musicDynamicsElementsUI.forEach(function(musicDynamicsElement) {
						musicDynamicsElement.addUI();
					});
					$('#timaat-timeline-music-dynamics-element-pane').show();
				}
				if (this.curMusic.musicTextSettingElementsUI != null) {
					this.curMusic.musicTextSettingElementsUI.forEach(function(musicTextSettingElement) {
						musicTextSettingElement.addUI();
					});
					$('#timaat-timeline-music-text-setting-element-pane').show();
				}
			}
		},

		isPlaying: function() {
			if (!this.medium || !this.medium.currentTime) return false;
			// return this.medium.currentTime > 0 && !this.medium.paused && !this.medium.ended && this.medium.readyState > this.medium.HAVE_CURRENT_DATA; //* this.medium.HAVE_CURRENT_DATA == 2
			return this.medium.currentTime > 0 && !this.medium.paused && !this.medium.ended; //! readyState is 1 when clicking a segment while time is not within segment time interval, ignoring to pause
		},

		pause: function() {
			if ( !this.medium || this.mediaType != 'video' && this.mediaType != 'audio') return;

			if (this.isPlaying()) {
				this.medium.pause();
			}
			$('.playbutton').removeClass('active');
		},

		play: function() {
			if ( !this.medium || this.mediaType != 'video' && this.mediaType != 'audio' ) return;

			if (!this.isPlaying()) {
				this.medium.play();
			}
			$('.playbutton').addClass('active');
		},

		jumpTo: function(timeInMilliseconds) {
			// console.log("TCL: jumpTo() -> timeInMilliseconds: ", timeInMilliseconds);
			if ( !this.medium || this.mediaType != 'video' && this.mediaType != 'audio' ) return;
			this.medium.currentTime = Math.floor(timeInMilliseconds) / 1000;
			// this.updateListUI(); // obsolete as updateListUI() is called within on(timeupdate), which is also called upon clicking within the time slider
		},

		jumpVisible: function(startInMilliseconds, endInMilliseconds) {
			// console.log("TCL: jumpVisible: function(startInSeconds, endInSeconds)", startInSeconds, endInSeconds);
			if ( !this.medium || this.mediaType != 'video' && this.mediaType != 'audio') return;
			let curTime = this.medium.currentTime * 1000;
			if ( curTime < startInMilliseconds || curTime >= endInMilliseconds ) this.medium.currentTime = startInMilliseconds / 1000;
			// this.updateListUI(); // obsolete as on timeupdate is called afterward
		},

		initEmptyAnalysisListMenu: function() {
			$('#timaat-analysislist-chooser').append('<option>No analyses available or accessible. You can create a new one.</option>');
			$('#timaat-analysislist-chooser').addClass("timaat-item-disabled");
			$('.timaat-annotation-add').addClass("timaat-item-disabled");
			$('.timaat-annotation-add').removeAttr('onclick');
			$('#timaat-analysislist-segment-options').addClass("timaat-item-disabled");
			$('#timaat-analysislist-segment-options').removeClass("dropdown-toggle");
			// $('.timaat-analysislist-segment-dropdown').hide();
			$('.timaat-segment-structure-add').addClass("timaat-item-disabled");
			$('.timaat-segment-structure-add').removeAttr('onclick');
			$('#timaat-medium-publication').addClass("timaat-item-disabled");
			$('#timaat-medium-publication').removeAttr('onclick');
			$('#timaat-analysislist-edit').addClass("timaat-item-disabled");
			$('#timaat-analysislist-edit').removeAttr('onclick');
			$('#timaat-analysislist-manage').addClass("timaat-item-disabled");
			$('#timaat-analysislist-manage').removeAttr('onclick');
			$('#timaat-analysislist-delete').addClass("timaat-item-disabled");
			$('#timaat-analysislist-delete').removeAttr('onclick');
			$('#timaat-medium-offlinepublication').addClass("timaat-item-disabled");
			$('#timaat-medium-offlinepublication').removeAttr('onclick');
			// $('#timaat-videoplayer-annotation-quickadd-button').prop('disabled', true);
			// $('#timaat-videoplayer-annotation-quickadd-button').attr('disabled');
			$('.leaflet-control-container').hide();
		},

		initAnalysisListMenu: function() {
			if (this.currentPermissionLevel && this.currentPermissionLevel >= 2) {
				$('#timaat-analysislist-chooser').removeClass("timaat-item-disabled");
				$('.timaat-analysissegment-add').removeClass("timaat-item-disabled");
				if (this.mediaType != 'video') $('.timaat-analysissegment-add').addClass("timaat-item-disabled");
				$('.timaat-analysissegment-add').attr('onclick', 'TIMAAT.VideoPlayer.addAnalysisSegmentElement("segment")');
				if (this.mediaType != 'video') $('.timaat-analysissegment-add').attr('onclick','');
				$('.timaat-annotation-add').removeClass("timaat-item-disabled");
				$('.timaat-annotation-add').attr('onclick', 'TIMAAT.VideoPlayer.addAnnotation()');
				$('#timaat-analysislist-segment-options').removeClass("timaat-item-disabled");
				$('#timaat-analysislist-segment-options').addClass("dropdown-toggle");
				// $('.timaat-analysislist-segment-dropdown').show();
				$('#timaat-analysislist-edit').removeClass("timaat-item-disabled");
				$('#timaat-analysislist-edit').attr('onclick', 'TIMAAT.VideoPlayer.editAnalysisList()');
				if (this.currentPermissionLevel >= 3) {
					$('#timaat-analysislist-manage').removeClass("timaat-item-disabled");
					$('#timaat-analysislist-manage').attr('onclick', 'TIMAAT.VideoPlayer.manageAnalysisList()');
				}
				$('#timaat-analysislist-delete').removeClass("timaat-item-disabled");
				$('#timaat-analysislist-delete').attr('onclick', 'TIMAAT.VideoPlayer.removeAnalysisList()');
				$('#timaat-medium-publication').removeClass("timaat-item-disabled");
				$('#timaat-medium-publication').attr('onclick', 'TIMAAT.VideoPlayer.managePublication()');
				$('#timaat-medium-offlinepublication').removeClass("timaat-item-disabled");
				$('#timaat-medium-offlinepublication').attr('onclick', 'TIMAAT.VideoPlayer.offLinePublication()');
				// $('#timaat-videoplayer-annotation-quickadd-button').prop('disabled', false);
				// $('#timaat-videoplayer-annotation-quickadd-button').removeAttr('disabled');
			}
			$('.leaflet-control-container').show();
		},

		_updatePublicationSettings: function() {
			let dialog = $('#timaat-videoplayer-publication');
			let enabled = $('#timaat-publish-analysis-switch').prop('checked');
			let restricted = $('#timaat-publication-protected-switch').prop('checked');
			let username = ( dialog.find('.username').val() && restricted ) ? dialog.find('.username').val() : '';
			let password = ( dialog.find('.password').val() && restricted ) ? dialog.find('.password').val() : '';
			$('#timaat-publication-settings-submit').prop('disabled', true);
			$('#timaat-publication-settings-submit i.login-spinner').removeClass('d-none');
			if ( enabled ) {
				let publication = (TIMAAT.VideoPlayer.publication) ? TIMAAT.VideoPlayer.publication : { id: 0 };
				publication.access = (restricted) ? 'protected' : 'public';
				publication.mediaCollectionAnalysisList = null;
				publication.ownerId = TIMAAT.Service.session.id;
				publication.settings = null;
				publication.slug = TIMAAT.Util.createUUIDv4();
				publication.mediumAnalysisListId = TIMAAT.VideoPlayer.curAnalysisList.id;
				publication.title = dialog.find('.publicationtitle').val();
				publication.credentials = JSON.stringify({
					scheme: 'password',
					user: username,
					password: password,
				});
				if (TIMAAT.VideoPlayer.publication) {
					TIMAAT.PublicationService.updateSinglePublication(publication).then(publication => {
						console.log("TCL: TIMAAT.VideoPlayer.viewer.on -> publication", publication);
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
					TIMAAT.PublicationService.createSinglePublication(publication).then(publication => {
						console.log("TCL: TIMAAT.VideoPlayer.viewer.on -> publication", publication);
						TIMAAT.VideoPlayer.publication = publication;
						TIMAAT.VideoPlayer._setupPublicationDialog(publication !=null, publication !=null && publication.access == 'protected');
						$('#timaat-publication-settings-submit').prop('disabled', false);
						$('#timaat-publication-settings-submit i.login-spinner').addClass('d-none');
						dialog.find('.saveinfo').show().delay(1000).fadeOut();
					}).catch( e => {
						$('#timaat-publication-settings-submit').prop('disabled', false);
						$('#timaat-publication-settings-submit i.login-spinner').addClass('d-none');
					})
				}
			} else {
				TIMAAT.PublicationService.deleteSinglePublication(TIMAAT.VideoPlayer.curAnalysisList.id).then(status => {
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
			$('#timaat-publish-analysis-switch').prop('checked', enabled);
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
				else url = '- Publication link will be available after saving -';
				dialog.find('.publicationurl').html(url);
			} else {
				dialog.find('.publicationtitle').val('');
				dialog.find('.publicationurl').html('- Medium not published -');
			}
		},

		_updateAnimations: function() {
			if ( !TIMAAT.VideoPlayer.medium || TIMAAT.VideoPlayer.medium.paused || !TIMAAT.VideoPlayer.annotationList || !TIMAAT.VideoPlayer.curAnalysisList ) return;

			// repeat video section if control activated
			if ( TIMAAT.VideoPlayer.repeatSection ) {
				if ( TIMAAT.VideoPlayer.curAnnotation ) {
					// repeat annotation
					if ( TIMAAT.VideoPlayer.medium.currentTime < TIMAAT.VideoPlayer.curAnnotation.startTime / 1000
							|| TIMAAT.VideoPlayer.medium.currentTime > TIMAAT.VideoPlayer.curAnnotation.endTime / 1000 )
							TIMAAT.VideoPlayer.jumpTo(TIMAAT.VideoPlayer.curAnnotation.startTime);
				} else {
					// repeat segment //! TODO repeat segment currently not working
					let curSegment = null;
					for (let index = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.length - 1; index >= 0; index-- ) {
						let segment = TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI[index];
						if (segment.active) { curSegment = segment; break; }
					}

					if ( curSegment ) {
						if ( TIMAAT.VideoPlayer.medium.currentTime < curSegment.model.startTime / 1000
								|| TIMAAT.VideoPlayer.medium.currentTime > curSegment.model.endTime / 1000 )
								TIMAAT.VideoPlayer.jumpTo(curSegment.model.startTime);
					}
				}
			// TODO: repeat music structure element
		}

			for (let annotation of TIMAAT.VideoPlayer.annotationList)
				if ( TIMAAT.VideoPlayer.duration > 0 ) annotation.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);

			// update timeline
			TIMAAT.VideoPlayer.timeline.updateIndicator();

		},

		_analysisListAdded: function(analysisList) {
			// console.log("TCL: _analysisListAdded: function(analysisList) - analysisList", analysisList);
			// console.log("TCL ~ TIMAAT.VideoPlayer.model", TIMAAT.VideoPlayer.model);
			var wasEmpty = TIMAAT.VideoPlayer.model.analysisLists.length == 0;
			TIMAAT.VideoPlayer.model.analysisLists.push(analysisList);

			analysisList.ui = $('<option value="'+analysisList.id+'">'+TIMAAT.Util.getDefaultTranslation(analysisList, 'mediumAnalysisListTranslations', 'title')+'</option>');
			analysisList.ui.data('list', analysisList);

			// update UI
			if ( wasEmpty ) $('#timaat-analysislist-chooser').empty();
			$('#timaat-analysislist-chooser').append(analysisList.ui);
			$('#timaat-analysislist-chooser').val(analysisList.id);

			$('#timaat-analysislist-chooser').trigger('change');
			// TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			TIMAAT.VideoPlayer.inspector.close();
			TIMAAT.VideoPlayer.initAnalysisListMenu();
		},

		_analysisListRemoved: async function(analysisList) {
			// console.log("TCL: _analysisListRemoved: function(analysisList)");
			// console.log("TCL: analysisList", analysisList);
			// sync to server
			TIMAAT.AnalysisListService.removeAnalysisList(analysisList);

			// remove from model lists
			var index = TIMAAT.VideoPlayer.model.analysisLists.indexOf(analysisList);
			if (index > -1) TIMAAT.VideoPlayer.model.analysisLists.splice(index, 1);

			// update UI list view
			$('#timaat-analysislist-chooser').find('[value="'+analysisList.id+'"]').remove();
			$('#timaat-analysislist-chooser').trigger('change');
			if ( TIMAAT.VideoPlayer.model.analysisLists.length == 0 ) {
				await TIMAAT.VideoPlayer.setupAnalysisList(null);
				TIMAAT.VideoPlayer.initEmptyAnalysisListMenu();
				// TIMAAT.URLHistory.setURL(null, 'Video Player', '#analysis');
			}
			// update annotation UI
		},

		_annotationAdded: function(annotation, openInspector=true) {
			// console.log("TCL: _annotationAdded: function(annotation): ", annotation);
			// console.log("TCL: annotation", annotation);
			TIMAAT.VideoPlayer.annotationList.push(annotation);
			TIMAAT.VideoPlayer.curAnalysisList.annotations.push(annotation.model);
			annotation.updateUI();
			if ( TIMAAT.VideoPlayer.duration > 0 ) annotation.updateStatus(TIMAAT.VideoPlayer.medium.currentTime);
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			// if ( openInspector ) TIMAAT.VideoPlayer.selectAnnotation(annotation);
			TIMAAT.VideoPlayer.selectAnnotation(annotation);
			annotation.setActive(true);
			TIMAAT.VideoPlayer.editShapesCtrl.setEnabled(true);
		},

		_annotationRemoved: function(annotation) {
			// console.log("TCL: _annotationRemoved: function(annotation)");
			// console.log("TCL: annotation", annotation);
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
			// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
			TIMAAT.VideoPlayer.selectAnnotation(null);
		},

		_segmentAdded: function(segment, openInspector=true) {
			// console.log("TCL: _segmentAdded: function(segment): ", segment);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI.push(segment);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSegmentsUI);
			TIMAAT.VideoPlayer.jumpTo(segment.model.startTime);
			TIMAAT.VideoPlayer.selectedElementType = 'segment';
			segment.addUI();
			TIMAAT.VideoPlayer.curSegment = segment;
			TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.replace('bg-info', 'bg-primary');
			TIMAAT.VideoPlayer.curSegment.timelineView[0].classList.add('bg-primary');

			if ( openInspector ) {
				TIMAAT.VideoPlayer.inspector.setItem(segment, 'segment');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-segment-pane').show();
			// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

		_sequenceAdded: function(sequence, openInspector=true) {
			// console.log("TCL: _sequenceAdded: function(sequence)", sequence);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI.push(sequence);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisSequencesUI);
			TIMAAT.VideoPlayer.jumpTo(sequence.model.startTime);
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
			// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

		_takeAdded: function(take, openInspector=true) {
			// console.log("TCL: _takeAdded: function(take)", take);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI.push(take);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisTakesUI);
			TIMAAT.VideoPlayer.jumpTo(take.model.startTime);
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
			// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

		_sceneAdded: function(scene, openInspector=true) {
			// console.log("TCL: _sceneAdded: function(scene)", scene);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI.push(scene);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisScenesUI);
			TIMAAT.VideoPlayer.jumpTo(scene.model.startTime);
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
			// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

		_actionAdded: function(action, openInspector=true) {
			// console.log("TCL: _actionAdded: function(action)", action);
			if (!TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI) {
				TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI = [];
			}
			TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI.push(action);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curAnalysisList.analysisActionsUI);
			TIMAAT.VideoPlayer.jumpTo(action.model.startTime);
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
			// console.log("TCL: $ -> TIMAAT.VideoPlayer.updateListUI()");
			TIMAAT.VideoPlayer.updateListUI();
			// TIMAAT.VideoPlayer.sortListUI();
		},

		_musicFormElementAdded: function(musicFormElement, openInspector=true) {
			// console.log("TCL: _musicFormElementAdded: function(musicFormElement): ", musicFormElement);
			// TODO refactor for persistent music form data display independent from analysislist
			if (!TIMAAT.VideoPlayer.curMusic.musicFormElementsUI) {
				TIMAAT.VideoPlayer.curMusic.musicFormElementsUI = [];
			}
			TIMAAT.VideoPlayer.curMusic.musicFormElementsUI.push(musicFormElement);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicFormElementsUI);
			TIMAAT.VideoPlayer.jumpTo(musicFormElement.model.startTime);
			TIMAAT.VideoPlayer.selectedElementType = 'musicFormElement';
			musicFormElement.addUI();
			TIMAAT.VideoPlayer.curMusicFormElement = musicFormElement;

			if ( openInspector ) {
				TIMAAT.VideoPlayer.inspector.setItem(musicFormElement, 'musicFormElement');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-music-form-element-pane').show();
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

		_musicChangeInTempoElementAdded: function(musicChangeInTempoElement, openInspector=true) {
			console.log("TCL: _musicChangeInTempoElementAdded: function(musicChangeInTempoElement): ", musicChangeInTempoElement);
			// TODO refactor for persistent music form data display independent from analysislist
			if (!TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI) {
				TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI = [];
			}
			TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI.push(musicChangeInTempoElement);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicChangeInTempoElementsUI);
			TIMAAT.VideoPlayer.jumpTo(musicChangeInTempoElement.model.startTime);
			TIMAAT.VideoPlayer.selectedElementType = 'musicChangeInTempoElement';
			musicChangeInTempoElement.addUI();
			TIMAAT.VideoPlayer.curMusicChangeInTempoElement = musicChangeInTempoElement;

			if ( openInspector ) {
				TIMAAT.VideoPlayer.inspector.setItem(musicChangeInTempoElement, 'musicChangeInTempoElement');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-music-change-in-tempo-element-pane').show();
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

		_musicArticulationElementAdded: function(musicArticulationElement, openInspector=true) {
			console.log("TCL: _musicArticulationElementAdded: function(musicArticulationElement): ", musicArticulationElement);
			// TODO refactor for persistent music form data display independent from analysislist
			if (!TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI) {
				TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI = [];
			}
			TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI.push(musicArticulationElement);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicArticulationElementsUI);
			TIMAAT.VideoPlayer.jumpTo(musicArticulationElement.model.startTime);
			TIMAAT.VideoPlayer.selectedElementType = 'musicArticulationElement';
			musicArticulationElement.addUI();
			TIMAAT.VideoPlayer.curMusicArticulationElement = musicArticulationElement;

			if ( openInspector ) {
				TIMAAT.VideoPlayer.inspector.setItem(musicArticulationElement, 'musicArticulationElement');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-music-articulation-element-pane').show();
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

		_musicDynamicsElementAdded: function(musicDynamicsElement, openInspector=true) {
			console.log("TCL: _musicDynamicsElementAdded: function(musicDynamicsElement): ", musicDynamicsElement);
			// TODO refactor for persistent music form data display independent from analysislist
			if (!TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI) {
				TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI = [];
			}
			TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI.push(musicDynamicsElement);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicDynamicsElementsUI);
			TIMAAT.VideoPlayer.jumpTo(musicDynamicsElement.model.startTime);
			TIMAAT.VideoPlayer.selectedElementType = 'musicDynamicsElement';
			musicDynamicsElement.addUI();
			TIMAAT.VideoPlayer.curMusicDynamicsElement = musicDynamicsElement;

			if ( openInspector ) {
				TIMAAT.VideoPlayer.inspector.setItem(musicDynamicsElement, 'musicDynamicsElement');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-music-dynamics-element-pane').show();
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

		_musicTextSettingElementAdded: function(musicTextSettingElement, openInspector=true) {
			console.log("TCL: _musicTextSettingElementAdded: function(musicTextSettingElement): ", musicTextSettingElement);
			// TODO refactor for persistent music form data display independent from analysislist
			if (!TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI) {
				TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI = [];
			}
			TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI.push(musicTextSettingElement);
			TIMAAT.VideoPlayer.sort(TIMAAT.VideoPlayer.curMusic.musicTextSettingElementsUI);
			TIMAAT.VideoPlayer.jumpTo(musicTextSettingElement.model.startTime);
			TIMAAT.VideoPlayer.selectedElementType = 'musicTextSettingElement';
			musicTextSettingElement.addUI();
			TIMAAT.VideoPlayer.curMusicTextSettingElement = musicTextSettingElement;

			if ( openInspector ) {
				TIMAAT.VideoPlayer.inspector.setItem(musicTextSettingElement, 'musicTextSettingElement');
				TIMAAT.VideoPlayer.inspector.open('timaat-inspector-metadata');
			}

			// update UI
			$('#timaat-timeline-music-text-setting-element-pane').show();
			TIMAAT.VideoPlayer.updateListUI();
			TIMAAT.VideoPlayer.sortListUI();
		},

	}

}, window));
