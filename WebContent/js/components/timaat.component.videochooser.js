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
	
	TIMAAT.VideoChooser = {
		
		collections: null,
		collection: null,
		initialized: false,
		curVideos: [],
	
		loadCollections: function() {
			// load media collections
			TIMAAT.Service.getMediaCollections(TIMAAT.VideoChooser.setupMediaCollections);
			// init datatable
			TIMAAT.VideoChooser.setupDatatable();
			if ( !TIMAAT.VideoChooser.collection ) {
				TIMAAT.VideoChooser.collection = 'init';
				TIMAAT.VideoChooser.setCollection(null);
			}
		},
		
		init: function() {		
			// setup video chooser list and UI events
			$('#timaat-videochooser-collectionlibrary').click(function(ev) {
				TIMAAT.VideoChooser.setMedia();
//				TIMAAT.VideoChooser.setVideoList(TIMAAT.MediaDatasets.videos.model);
				TIMAAT.VideoChooser.setCollection(null);
			});

			moment.locale('de');

			$('#timaat-videochooser-mediacollection-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var col = modal.data('mediacollection');				
				var heading = (col) ? "Mediensammlung bearbeiten" : "Mediensammlung hinzufügen";
				var submit = (col) ? "Speichern" : "Hinzufügen";
				var title = (col) ? col.title : "";
				var comment = (col) ? col.note : "";
				// setup UI from Video Player state
				$('#mediacollectionMetaLabel').html(heading);
				$('#timaat-mediacollection-meta-submit').html(submit);
				$("#timaat-mediacollection-meta-title").val(title).trigger('input');
				$("#timaat-mediacollection-meta-comment").val(comment);				
			});

			$('#timaat-mediacollection-delete-submit').click(function(ev) {
				var modal = $('#timaat-videochooser-mediacollection-delete');
				var col = modal.data('mediacollection');
				if (col) TIMAAT.VideoChooser._mediacollectionRemoved(col);
				modal.modal('hide');
			});

			$('#timaat-mediacollection-meta-submit').click(function(ev) {
				var modal = $('#timaat-videochooser-mediacollection-meta');
				var col = modal.data('mediacollection');
				var title = $("#timaat-mediacollection-meta-title").val();
				var comment = $("#timaat-mediacollection-meta-comment").val();				
				if (col) {
					TIMAAT.VideoChooser.collection.title = title;
					TIMAAT.VideoChooser.collection.note = comment;
					TIMAAT.VideoChooser.updateMediacollection(TIMAAT.VideoChooser.collection);
				} else {
					TIMAAT.Service.createMediacollection(title, comment, TIMAAT.VideoChooser._mediacollectionAdded);
				}
				modal.modal('hide');
			});

			$('#timaat-mediacollection-meta-title').on('input', function(ev) {
				if ( $("#timaat-mediacollection-meta-title").val().length > 0 ) {
					$('#timaat-mediacollection-meta-submit').prop("disabled", false);
					$('#timaat-mediacollection-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-mediacollection-meta-submit').prop("disabled", true);
					$('#timaat-mediacollection-meta-submit').attr("disabled");
				}
			});
			
			$('#timaat-videochooser-list-selectall input:checkbox').change(function() {
				$('#timaat-videochooser-table tr input:checkbox').prop('checked', $(this).prop('checked'));
				$('#timaat-videochooser-list-action-submit').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);
			});

			$('#timaat-videochooser-list-action').change(function() {
				if ( $('#timaat-videochooser-list-action').val() == 'add' )
					$('#timaat-videochooser-list-target').show();
				else
					$('#timaat-videochooser-list-target').hide();
			});
			
			$('#timaat-videochooser-list-action-submit').click(function() {
				TIMAAT.VideoChooser.dt.$('input:checked').each(function(index, item) {
					var medium = $(item).parents('tr').data('medium');
				});				
			});
			
			$('#timaat-videochooser-list-action-submit').click(function() {
				var action = $('#timaat-videochooser-list-action').val();
				if ( action == 'add' ) {
					var target = $('#timaat-videochooser-list-target-collection option:selected').data('collection');
					if ( target == null ) return;
					if ( TIMAAT.VideoChooser.collection != null && TIMAAT.VideoChooser.collection.id == target.id ) return;
					// gather and add items
					TIMAAT.VideoChooser.dt.$('input:checked').each(function(index, item) {
						var row = $(item).parents('tr');
						var medium = $(row).data('medium');
						if ( medium != null ) {
							// sync to server
							TIMAAT.Service.addCollectionItem(target, medium);
							// sync to model
							var found = false;
							target.mediaCollectionHasMediums.forEach(function(item) {
								if ( item.medium && item.medium.id == medium.id ) found = true;
							});
							
							if ( !found ) target.mediaCollectionHasMediums.push({
								id: null,
								medium: medium,
								sortOrder: 0
							});
						}
					});
				} else if ( action == 'remove') {
					if ( TIMAAT.VideoChooser.collection == null || TIMAAT.VideoChooser.dt == null ) return;
					// gather and remove items
					TIMAAT.VideoChooser.dt.$('input:checked').each(function(index, item) {
						var row = $(item).parents('tr');
						TIMAAT.VideoChooser._removeCollectionItemRow(row);
					});
				}
				// clear UI list
				$('#timaat-videochooser-list-selectall input:checkbox').prop('checked', false);
				$('#timaat-videochooser-list-action-submit').prop('disabled', true);
				TIMAAT.VideoChooser.dt.$('input:checked').each(function(index, item) { $(item).prop('checked', false); });
				
			});
			
			// upload event listeners
			$(document).on('added.upload.TIMAAT', function(event, video) {
				if ( !video ) return;
				let myvideo = $('#videochooser-item-'+video.id).parent().data('video');
				if ( !myvideo ) return;
				myvideo.ui.find('.timaat-video-upload').css('display', 'none');
			});
			$(document).on('success.upload.TIMAAT', function(event, video) {
				if ( !video ) return;
				let myvideo = $('#videochooser-item-'+video.id).parent().data('video');
				if ( !myvideo ) return;
				myvideo.mediumVideo.status = video.mediumVideo.status;
				myvideo.mediumVideo.width = video.mediumVideo.width;
				myvideo.mediumVideo.height = video.mediumVideo.height;
				myvideo.mediumVideo.length = video.mediumVideo.length;
				myvideo.mediumVideo.frameRate = video.mediumVideo.frameRate;

				myvideo.ui.find('.timaat-video-upload').css('display', 'none');
				myvideo.ui.find('.timaat-video-annotate').show();
				myvideo.ui.find('.timaat-video-status').show();
				myvideo.ui.find('.duration').html(TIMAAT.Util.formatTime(myvideo.mediumVideo.length));
				TIMAAT.VideoChooser.updateVideoStatus(myvideo);
			});
			$(document).on('removed.upload.TIMAAT', function(event, video) {
				if ( !video ) return;
				let myvideo = $('#videochooser-item-'+video.id).parent().data('video');
				if ( !myvideo ) return;
				if ( myvideo.mediumVideo.status == 'nofile' ) myvideo.ui.find('.timaat-video-upload').css('display', 'block');
			});

			
			$('#timaat-videochooser-table').hide();

			var DataTable = $.fn.dataTable;
			/* Set the defaults for DataTables initialisation */
			$.extend( true, DataTable.defaults, {
				dom:
					"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
					"<'row'<'col-sm-12'tr>>" +
					"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
				renderer: 'bootstrap'
			} );

			/* Default class modification */
			$.extend( DataTable.ext.classes, {
				sWrapper:      "dataTables_wrapper dt-bootstrap4",
				sFilterInput:  "form-control form-control-sm",
				sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
				sProcessing:   "dataTables_processing card",
				sPageButton:   "paginate_button page-item"
			} );

			/* Bootstrap paging button renderer */
			DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
				var api     = new DataTable.Api( settings );
				var classes = settings.oClasses;
				var lang    = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;

				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						e.preventDefault();
						if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
							api.page( e.data.action ).draw( 'page' );
						}
					};

					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];

						if ( $.isArray( button ) ) {
							attach( container, button );
						}
						else {
							btnDisplay = '';
							btnClass = '';

							switch ( button ) {
								case 'ellipsis':
									btnDisplay = '&#x2026;';
									btnClass = 'disabled';
									break;

								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' disabled');
									break;

								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' disabled');
									break;

								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' disabled');
									break;

								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' disabled');
									break;

								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										'active' : '';
									break;
							}

							if ( btnDisplay ) {
								node = $('<li>', {
										'class': classes.sPageButton+' '+btnClass,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.append( $('<a>', {
											'href': '#',
											'aria-controls': settings.sTableId,
											'aria-label': aria[ button ],
											'data-dt-idx': counter,
											'tabindex': settings.iTabIndex,
											'class': 'page-link'
										} )
										.html( btnDisplay )
									)
									.appendTo( container );

								settings.oApi._fnBindAction(
									node, {action: button}, clickHandler
								);

								counter++;
							}
						}
					}
				};
				
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. 
				var activeEl;

				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}

				attach(
					$(host).empty().html('<ul class="pagination"/>').children('ul'),
					buttons
				);

				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}

			};

		},
		
		setupDatatable: function() {
			// setup datatable
			TIMAAT.VideoChooser.dt = $('#timaat-videochooser-table').DataTable({
				"lengthMenu": [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Alle"]],
				"order": [[ 4, 'desc' ]],
				"pagingType": "simple_numbers",
				"processing": true,
				"serverSide": true,
				"ajax": {
					"url": "api/medium/video/list",
					"contentType": "application/json; charset=utf-8",
					"dataType": "json",
					"data": function(data) {
						let serverData = {
								start: data.start,
								length: data.length,
								mediumsubtype: 'video'
						}
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
						// setup model
						var vids = Array();
						var newVideo;
						data.forEach(function(video) { 
							if ( video.id > 0 ) {
								newVideo = new TIMAAT.Medium(video, 'video');
								vids.push(newVideo);
							}
						});
						TIMAAT.MediaDatasets.videos = vids;
						TIMAAT.MediaDatasets.videos.model = data;
						return data; // data.map(medium => new TIMAAT.Medium(medium));            
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let videoelement = $(row);
					let video = data;
					video.ui = videoelement;
					// TODO refactor
					videoelement.data('video', video);
					videoelement.data('medium', video);
					videoelement.find('input:checkbox').prop('checked', false);
					videoelement.find('input:checkbox').change(function() {
						$('#timaat-videochooser-list-action-submit').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);				
					});

					if ( video.mediumVideo.status != "nofile" ) TIMAAT.VideoChooser.loadThumbnail(video);
					TIMAAT.VideoChooser.setVideoStatus(video);
					
					// set up events
					videoelement.on('click', '.timaat-video-thumbnail', function(ev) {
						videoelement.find('.timaat-video-annotate').click();
					});

					videoelement.on('click', '.timaat-video-annotate', function(ev) {
						if ( video.mediumVideo.status && video.mediumVideo.status != 'ready' && video.mediumVideo.status != 'transcoding' && video.mediumVideo.status != 'waiting' ) return;
//						$('.timaat-video-card').removeClass('bg-info text-white');
//						$(this).addClass('bg-info text-white');
						TIMAAT.UI.showComponent('videoplayer');

						// setup video in player
						TIMAAT.VideoPlayer.setupVideo(video);
						// load video annotations from server
						TIMAAT.Service.getAnalysisLists(video.id, TIMAAT.VideoPlayer.setupAnalysisLists);
						// TIMAAT.VideoPlayer.setupAnalysisLists(video.medium.mediumAnalysisLists);
					});

					videoelement.on('click', '.timaat-mediadatasets-media-metadata', function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						$('.form').hide();
						$('.media-nav-tabs').show();
						$('.media-data-tabs').hide();
						$('.nav-tabs a[href="#mediumDatasheet"]').tab("show");
						var id = video.id;
						var selectedVideo;
						var i = 0;
						for (; i < TIMAAT.MediaDatasets.media.length; i++) {
							if (TIMAAT.MediaDatasets.media[i].model.id == id) {
								selectedVideo = TIMAAT.MediaDatasets.media[i];
								break;
							}
						}
						$('#timaat-mediadatasets-media-metadata-form').data('medium', selectedVideo);
						TIMAAT.MediaDatasets.mediumFormDatasheet("show", 'video', selectedVideo);
					});

					videoelement.on('click', '.timaat-video-collectionitemremove', function(ev) {
						var row = $(this).parents('tr');
						TIMAAT.VideoChooser._removeCollectionItemRow(row);
					});
					
					videoelement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
						if ( video.mediumVideo.status && video.mediumVideo.status == "nofile" ) return;
						let length = video.mediumVideo.length;
						if ( length < 0 ) length += 3600;
						let timecode = Math.round((ev.originalEvent.offsetX/254)*length);
						timecode = Math.min(Math.max(0, timecode),length);
						videoelement.find('.timaat-video-thumbnail').attr('src', "/TIMAAT/api/medium/video/"+video.id+"/thumbnail"+"?time="+timecode+"&token="+video.mediumVideo.viewToken);
					});
					
					videoelement.find('.card-img-top').bind("mouseleave", function(ev) {
						if ( video.mediumVideo.status && video.mediumVideo.status == "nofile" ) return;
						videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+video.id+"/thumbnail"+"?token="+video.mediumVideo.viewToken);
					});
								
					if ( video.mediumVideo.status != "ready" && video.mediumVideo.status != "unavailable" && video.mediumVideo.status != "nofile" )
						TIMAAT.VideoChooser.updateVideoStatus(video);

				},
				"columns": [
					{ data: 'id', className: 'videochooser-item', orderable: false, render: function(data, type, video, meta) {
						return '<input type="checkbox" aria-label="Checkbox">';
					}, createdCell( cell, cellData, rowData, rowIndex, colIndex ) {
						$(cell).attr('id', 'videochooser-item-'+cellData);
					}
				},
				{ data: null, className: 'videochooser-item-preview', orderable: false, render: function(data, type, video, meta) {
					 let ui = `<div class="timaat-video-status">
							<i class="fas fa-cog fa-spin"></i>
						 	</div>
						<img class="card-img-top timaat-video-thumbnail" src="img/video-placeholder.png" width="150" height="85" alt="Videovorschau"/>`;
					 return ui;
					}
				},
				{ data: 'id', className: 'title', render: function(data, type, video, meta) {
        	// console.log("TCL: video", video);
					let titleDisplay = `<p>`+video.displayTitle.name+`</p>`;
						if (video.originalTitle != null && video.displayTitle.id != video.originalTitle.id) {
							titleDisplay += `<p><i>(OT: `+video.originalTitle.name+`)</i></p>`;
						}
						video.titles.forEach(function(title) { // make additional titles searchable in medialibrary
							if (title.id != video.displayTitle.id && (video.originalTitle == null || title.id != video.originalTitle.id)) {
								titleDisplay += `<div style="display:none">`+title.name+`</div>`;
							}
						});
						return titleDisplay;
					}
				},
				{ data: 'mediumVideo.length', className: 'duration' , render: function(data, type, row, meta) {
						return TIMAAT.Util.formatTime(data);
					}
				},
				{ data: 'mediumHasActorWithRoles', className: 'producer', render: function(data, type, video, meta) {
						return TIMAAT.VideoChooser._getProducer(video);
					}
				},
				{ data: 'releaseDate', className: 'date', render: function(data, type, video, meta) {
						return moment(data).format('YYYY-MM-DD');
					}
				},
				{ data: null, className: 'actions', orderable: false, render: function(data, type, video, meta) {
					let ui = `<div>
							<form action="/TIMAAT/api/medium/video/`+video.id+`/upload" method="post" enctype="multipart/form-data">
								<input name="file" accept=".mp4" class="timaat-video-upload-file d-none" type="file" />
								<button type="submit" title="Videodatei hochladen" class="btn btn-outline-primary btn-sm btn-block timaat-video-upload"><i class="fas fa-upload"></i></button>
							</form>

							<button type="button" title="Video annotieren" class="btn btn-outline-success btn-sm btn-block timaat-video-annotate"><i class="fas fa-draw-polygon"></i></button>
							<button type="button" title="Datenblatt editieren" class="btn btn-outline-secondary btn-outline-secondary btn-sm btn-block timaat-mediadatasets-media-metadata"><i class="fas fa-file-alt"></i></button>`;
					if ( TIMAAT.VideoChooser.collection ) ui += `<button type="button" title="Aus Mediensammlung entfernen"class="btn btn-outline-secondary btn-sm btn-block timaat-video-collectionitemremove"><i class="fas fa-folder-minus"></i></button>`;
					ui += '</div>';
						return ui;
					},
				}				
				],
				"language": {
					"decimal": ",",
					"thousands": ".",
					"search": "Suche",
					"lengthMenu": "Zeige _MENU_ Videos pro Seite",
					"zeroRecords": "Keine Videos gefunden.",
					"info": "Seite _PAGE_ von _PAGES_",
					"infoEmpty": "Keine Videos verf&uuml;gbar.",
					"infoFiltered": "(gefilterte Liste vom Server)",
					"paginate": {
						"first":      "Erste",
						"previous":   "Vorherige",
						"next":       "N&auml;chste",
						"last":       "Letzte"
					},
				},				
			});				
		},
		
		setupMediaCollections: function(collections) {
			TIMAAT.VideoChooser.collections = collections;
			$('#timaat-mediacollection-list-loader').hide();
			
			collections.forEach(function(collection) {
				TIMAAT.VideoChooser._addCollection(collection);
			});
			TIMAAT.VideoChooser._sortCollections();
			
			// if ( !TIMAAT.VideoChooser.videos && TIMAAT.VideoChooser.collections.length > 0 ) {
			// 	TIMAAT.VideoChooser.setCollection(TIMAAT.VideoChooser.collections[0]);
			// }
		},

		updateVideoStatus: function(video) {
			// console.log("TCL: updateVideoStatus: function(video)", video);
			video.poll = window.setInterval(function() {
				if ( video.ui && !video.ui.is(':visible') ) return;
				jQuery.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/video/"+video.id+'/status',
					type:"GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					if ( video.mediumVideo.status && video.mediumVideo.status == data ) return;
					video.mediumVideo.status = data;
					
					TIMAAT.VideoChooser.setVideoStatus(video);
					
					if (video.mediumVideo.status == 'unavailable' || video.mediumVideo.status == 'ready')
						window.clearInterval(video.poll);
					
				})
				.fail(function(e) {
					// TODO handle error
					window.clearInterval(video.poll);
					video.ui.find('.timaat-video-status').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
					console.log( "error", e );
				});

			}, Math.round(30000+(Math.random()*15000)));
			
		},
		
		setVideoStatus: function (video) {			
			if ( !video || !video.ui ) return;
			// clear ui status
			video.ui.find('.timaat-video-status').hide();
			video.ui.find('.timaat-video-status i').removeClass('fa-cog');
			video.ui.find('.timaat-video-status i').removeClass('fa-hourglass-half');
			video.ui.find('.timaat-video-status i').addClass('fa-cog');
			video.ui.find('.timaat-video-transcoding').hide();
			
			if (video.mediumVideo.status == 'unavailable' || video.mediumVideo.status == 'ready') 
				window.clearInterval(video.poll);

			if ( video.mediumVideo.status == 'unavailable' ) {
				video.ui.find('.timaat-video-transcoding').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
				video.ui.find('.timaat-video-transcoding').show();
			}

			if ( video.mediumVideo.status != 'ready'  &&  video.mediumVideo.status != 'nofile' ) video.ui.find('.timaat-video-status').show();
			if ( video.mediumVideo.status == 'waiting' ) video.ui.find('.timaat-video-status i').removeClass('fa-cog').addClass('fa-hourglass-half');
			if ( video.mediumVideo.status == 'nofile'  ) {
				video.ui.find('.timaat-video-upload').css('display', 'block');
				video.ui.find('.timaat-video-annotate').hide();
				
				// upload button click triggers file selection
				video.ui.find('.timaat-video-upload').off('click').on('click', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					video.ui.find('.timaat-video-upload-file').click();
				});

				// user selected file, trigger form submit / upload
				video.ui.find('.timaat-video-upload-file').off('change').on('change', function(ev) {
					let filelist = video.ui.find('.timaat-video-upload-file')[0].files;
					if ( filelist.length  > 0 ) TIMAAT.UploadManager.queueUpload(video, video.ui.find('form'));
				});
			}
			if ( TIMAAT.UploadManager.isUploading(video) ) video.ui.find('.timaat-video-upload').css('display', 'none');
		},
		
		setCollection: function(collection) {
			if ( TIMAAT.VideoChooser.collection == collection ) return;
			
			$('#timaat-videochooser-list-loading').attr('style','');
			$('#timaat-videochooser-list-selectall input:checkbox').prop('checked', false);
			$('#timaat-videochooser-list-action-submit').prop('disabled', true);
			$('#timaat-videochooser-table').hide();
			$('#timaat-videochooser-list-action').val('add').change();
			
			$('#timaat-videochooser-collectionlibrary').removeClass("active");
			$('#timaat-videochooser-collectionlibrary').addClass("text-info");
			$('#timaat-videochooser-collectionlist li').removeClass("active");
			$('#timaat-videochooser-collectionlist li button').addClass("btn-outline");
			
			TIMAAT.VideoChooser.collection = collection;
			
			$('#timaat-videochooser-list-action-remove').prop('disabled', collection == null);

			if ( collection == null ) {
				$('#timaat-videochooser-collectionlibrary').addClass("active");
				$('li[id^="timaat-videochooser-collection-"]').removeClass("active");
				$('#timaat-videochooser-collectionlibrary').removeClass("text-info");
//				if ( !TIMAAT.MediaDatasets.videos.model ) return;
        // console.log("TCL: TIMAAT.MediaDatasets.videos.model", TIMAAT.MediaDatasets.videos.model);
//				TIMAAT.VideoChooser.setVideoList(TIMAAT.MediaDatasets.videos.model);
				// set ajax data source
				if ( TIMAAT.VideoChooser.dt ) {
					TIMAAT.VideoChooser.dt.ajax.url('/TIMAAT/api/medium/video/list');
					TIMAAT.VideoChooser.dt.ajax.reload();
				}
			} else {
				$('#timaat-videochooser-collectionlibrary').removeClass("active");
				$('#timaat-videochooser-collection-'+collection.id).addClass("active");
				$('#timaat-videochooser-collection-'+collection.id+' button').removeClass("btn-outline");
/*
				// load and set collection videos
				var videos = [];
				collection.mediaCollectionHasMediums.forEach(function (video) { 
					videos.push(video.medium); 
				});
//				TIMAAT.VideoChooser.setVideoList(videos);
*/
				// set ajax data source
				if ( TIMAAT.VideoChooser.dt ) {
					TIMAAT.VideoChooser.dt.ajax.url('/TIMAAT/api/mediacollection/'+collection.id+'/media');
					TIMAAT.VideoChooser.dt.ajax.reload();
				}
				
			}
			
			$('#timaat-videochooser-list-loading').attr('style','display:none !important');
			$('#timaat-videochooser-table').show();
		},
		
		setMedia: function() {
			// if (!TIMAAT.MediaDatasets.videos.model || TIMAAT.VideoChooser.videos) return;
			if (!TIMAAT.MediaDatasets.videos.model) return;
      // console.log("TCL: TIMAAT.MediaDatasets.videos.model", TIMAAT.MediaDatasets.videos.model);
			
			// TIMAAT.VideoChooser.videos = TIMAAT.MediaDatasets.videos.model;
			
			if ( !TIMAAT.VideoChooser.collection ) {
				TIMAAT.VideoChooser.collection = 'init';
				TIMAAT.VideoChooser.setCollection(null);
			}
		},

/*
		setVideoList: function(videos) {
			if ( TIMAAT.VideoChooser.dt != null ) return;
			// console.log("TCL: setVideoList: function(videos)");
			// console.log("TCL: VIDEOCHOOSER: setVideoList -> videos", videos);
			if ( !videos ) return;
			
			if ( TIMAAT.VideoChooser.dt != null ) {
				TIMAAT.VideoChooser.dt.destroy();
				TIMAAT.VideoChooser.dt = null;
				
				// TODO remove old listeners
				/*
				 			if ( video.ui ) {
								// remove event listeners
								if ( video.poll ) window.clearInterval(video.poll);
								video.ui.find('.timaat-video-annotate').off();
								video.ui.find('.card-img-top').off();
								// TODO remove video upload listener
								videoelement = video.ui;
							}
				 */
/*
		}

			// clear video UI list
			$('#timaat-videochooser-list').empty();
			
			videos.forEach(function(video) {
//				TIMAAT.VideoChooser._addVideo(video);
			});
			
			TIMAAT.VideoChooser.curVideos = videos;
			
		},
*/
		
		loadThumbnail: function (video) {
			if ( !video || !video.ui ) return;
			var img = $('<img />').appendTo('body').hide();
			img.data('video', video );
			img.on('load', function(ev) {
				var video = $(ev.target).data('video');
				video.ui.find('.card-img-top').attr('src', "api/medium/video/"+video.id+"/thumbnail"+"?token="+video.mediumVideo.viewToken);
				$(ev.target).remove();			
			});
			img.on('error', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				$(ev.target).remove();
			});
			img.attr('src', "api/medium/video/"+video.id+"/thumbnail"+"?token="+video.mediumVideo.viewToken);
		},
		
		addMediacollection: function() {
			$('#timaat-videochooser-mediacollection-meta').data('mediacollection', null);
			$('#timaat-videochooser-mediacollection-meta').modal('show');	
		},
		
		updateMediacollection: function(collection) {
			console.log("TCL: updateMediacollection: function(collection)");
			console.log("TCL: collection", collection);
			// sync to server
			TIMAAT.Service.updateMediacollection(collection);
			// update UI collection view
			collection.ui.find('.collection-title').html(collection.title);
			$('#timaat-videochooser-list-target-collection option[value="'+collection.id+'"]').text(collection.title);
			
			TIMAAT.VideoChooser._sortCollections();
		},
		
		removeMediacollection: function() {
			console.log("TCL: removeMediacollection: function()");
			if ( !TIMAAT.VideoChooser.collection ) return;
			$('#timaat-videochooser-mediacollection-delete').data('mediacollection', TIMAAT.VideoChooser.collection);
			$('#timaat-videochooser-mediacollection-delete').modal('show');
		},
		
		_mediacollectionAdded: function(col) {
			TIMAAT.VideoChooser.collections.push(col);
			TIMAAT.VideoChooser._addCollection(col);			
			TIMAAT.VideoChooser._sortCollections();
		},
		
		_mediacollectionRemoved: function(col) {
			console.log("TCL: _mediacollectionRemoved: function(col)");
			console.log("TCL: col", col);
			// sync to server
			TIMAAT.Service.removeMediacollection(col);

			// remove from model lists
			var index = TIMAAT.VideoChooser.collections.indexOf(col);
			if (index > -1) TIMAAT.VideoChooser.collections.splice(index, 1);
			
			// update UI list view
			if ( col.ui ) $('#timaat-videochooser-collection-'+col.id).remove();
			index--;
			if ( index < 0 ) index = 0;
			if ( index > (TIMAAT.VideoChooser.collections.length-1) ) index = -1;
			
			if ( index >= 0 ) TIMAAT.VideoChooser.setCollection(TIMAAT.VideoChooser.collections[index]);
			else TIMAAT.VideoChooser.setCollection(null);
			
			$('#timaat-videochooser-list-target-collection option[value="'+col.id+'"]').remove();			
			TIMAAT.VideoChooser._sortCollections();
		},
		
		_removeCollectionItemRow: function(row) {
			if ( row == null ) return;
			var video = $(row).data('medium');
			console.log(row, video);
			
			// remove from server
			TIMAAT.Service.removeCollectionItem(TIMAAT.VideoChooser.collection, video).then((success) => {
				// sync changes with UI
				TIMAAT.VideoChooser.dt.row(row).remove().draw();
			});
			
/*
			var item = null;
			TIMAAT.VideoChooser.collection.mediaCollectionHasMediums.forEach(function (colvideo) { 
				if ( colvideo.medium == video ) item = colvideo;
			});
			if ( !item ) return;				

			var index = TIMAAT.VideoChooser.collection.mediaCollectionHasMediums.indexOf(item);
			if (index > -1) TIMAAT.VideoChooser.collection.mediaCollectionHasMediums.splice(index, 1);
*/			
		},
		
		_sortCollections: function() {
			$("#timaat-videochooser-collectionlist li").sort(function sort_li(a, b) { return ($(b).text().toLowerCase()) < ($(a).text().toLowerCase()) ? 1 : -1; }).appendTo('#timaat-videochooser-collectionlist');
			$("#timaat-videochooser-list-target-collection option").sort(function sort_li(a, b) { return ($(b).text().toLowerCase()) < ($(a).text().toLowerCase()) ? 1 : -1; }).appendTo('#timaat-videochooser-list-target-collection');
		},

		_addCollection: function(collection) {
			var colelement = $('<li id="timaat-videochooser-collection-'+collection.id+'" class="list-group-item list-group-item-action">\
				<i class="fas fa-folder"></i> <span class="collection-title">'+collection.title+'</span>'+
				' <button type="button" onclick="TIMAAT.VideoChooser.removeMediacollection()" class="btn btn-danger btn-outline btn-sm float-right">\
				<i class="fas fa-trash-alt"></i></button></li>');
			
			colelement.appendTo('#timaat-videochooser-collectionlist');
			
			// collection events
			colelement.click(function(ev) { TIMAAT.VideoChooser.setCollection(collection); });
			colelement.dblclick(function(ev) {
				$('#timaat-videochooser-mediacollection-meta').data('mediacollection', collection);
				$('#timaat-videochooser-mediacollection-meta').modal('show');
			});
			collection.ui = colelement;

			// add to action target list
			var target = $('<option value="'+collection.id+'">'+collection.title+'</option>');
			$('#timaat-videochooser-list-target-collection').append(target);
			target.data('collection', collection);
			
		},
		
		_getProducer: function(video) {
			var producer = "";
			if ( !video || !video.mediumHasActorWithRoles ) return producer;
			var actor = null;
			video.mediumHasActorWithRoles.forEach(function(role) {
				if ( role.role.id == 112 ) actor = role.actor; // 112 == Producer, according to TIMAAT DB definition
			});
			if ( !actor || !actor.displayName ) return producer;
			// actor.actorNames.forEach(function(name) {
				// if ( actor.displayName.name.isPrimary && name.name ) producer = name.name; 
			producer = actor.displayName.name; 
			// });
			return producer;
		},

/*
		_addVideo: function(video) {
			// console.log("TCL: _addVideo: function(video)", video);
			// console.log("TCL: video", video);
			var videoelement;
			var titleDisplay = `<p>`+video.displayTitle.name+`</p>`;
			if (video.originalTitle != null && video.displayTitle.id != video.originalTitle.id) {
				titleDisplay += `<p><i>(OT: `+video.originalTitle.name+`)</i></p>`;
			}
			video.titles.forEach(function(title) { // make additional titles searchable in medialibrary
				if (title.id != video.displayTitle.id && (video.originalTitle == null || title.id != video.originalTitle.id)) {
					titleDisplay += `<div style="display:none">`+title.name+`</div>`;
				}
			});
			
			if ( video.ui ) {
				// remove event listeners
				if ( video.poll ) window.clearInterval(video.poll);
				video.ui.find('.timaat-video-annotate').off();
				video.ui.find('.card-img-top').off();
				// TODO remove video upload listener
				videoelement = video.ui;
				
			} else {
				videoelement = $(
					`<tr>
						<td class="videochooser-item" id="videochooser-item-`+video.id+`"><input type="checkbox" aria-label="Checkbox"></td>
						<td style="padding:0; width: 150px;">
							<div class="timaat-video-status">
								<i class="fas fa-cog fa-spin"></i>
							</div>
							<img class="card-img-top timaat-video-thumbnail" src="img/video-placeholder.png" width="150" height="85" alt="Videovorschau"/>
						</td>
						<td class="title"></td>
						<td class="duration">00:00:00</td>
						<td class="producer">xx.xx.xxxx xx:xx</td>
						<td class="date">xx.xx.xxxx xx:xx</td>
						<td class="actions" style="padding:5px 5px">
							<div>
								<form action="/TIMAAT/api/medium/video/`+video.id+`/upload" method="post" enctype="multipart/form-data">
									<input name="file" accept=".mp4" class="timaat-video-upload-file d-none" type="file" />
									<button type="submit" title="Videodatei hochladen" class="btn btn-outline-primary btn-sm btn-block timaat-video-upload"><i class="fas fa-upload"></i></button>
								</form>

								<button type="button" title="Video annotieren" class="btn btn-outline-success btn-sm btn-block timaat-video-annotate"><i class="fas fa-draw-polygon"></i></button>
								<button type="button" title="Datenblatt editieren" class="btn btn-outline-secondary btn-outline-secondary btn-sm btn-block timaat-mediadatasets-media-metadata"><i class="fas fa-file-alt"></i></button>
								<button type="button" title="Aus Mediensammlung entfernen"class="btn btn-outline-secondary btn-sm btn-block timaat-video-collectionitemremove"><i class="fas fa-folder-minus"></i></button>
							</div>
						</td>
					</tr>`
				);
				videoelement.data('video', video);
			}

			videoelement.find('.title').html(titleDisplay);
			videoelement.find('.duration').html(TIMAAT.Util.formatTime(video.mediumVideo.length));
			videoelement.find('.producer').html(TIMAAT.VideoChooser._getProducer(video));
			videoelement.find('.date').html(moment(video.releaseDate).format('YYYY-MM-DD'));

			videoelement.data('medium', video);
			videoelement.find('input:checkbox').prop('checked', false);
			videoelement.find('input:checkbox').change(function() {
				$('#timaat-videochooser-list-action-submit').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);				
			});

			videoelement.appendTo('#timaat-videochooser-list');
			if ( !TIMAAT.VideoChooser.collection ) {
				videoelement.find('.timaat-video-collectionitemremove').hide();
			} else {
				videoelement.find('.timaat-video-collectionitemremove').show();
			}
      
			video.ui = videoelement;

			// update media list to reflect changes to videos list
			if (TIMAAT.MediaDatasets.videos != null && TIMAAT.MediaDatasets.media != null) {
				var index = TIMAAT.MediaDatasets.videos.findIndex(element => element.model.id === TIMAAT.MediaDatasets.media.model.id);
				if (index > -1) {
					TIMAAT.MediaDatasets.media[index].model.ui = videoelement;
					TIMAAT.MediaDatasets.media.model[index].ui = videoelement;
				}
			}

			if ( video.mediumVideo.status != "nofile" ) TIMAAT.VideoChooser.loadThumbnail(video);
			TIMAAT.VideoChooser.setVideoStatus(video);
			
				
			// set up events
			videoelement.on('click', '.timaat-video-thumbnail', function(ev) {
				videoelement.find('.timaat-video-annotate').click();
			});

			videoelement.on('click', '.timaat-video-annotate', function(ev) {
				if ( video.mediumVideo.status && video.mediumVideo.status == 'nofile' ) {
					// start upload process
					
				};
				if ( video.mediumVideo.status && video.mediumVideo.status != 'ready' && video.mediumVideo.status != 'transcoding' && video.mediumVideo.status != 'waiting' ) return;
				$('.timaat-video-card').removeClass('bg-info text-white');
				$(this).addClass('bg-info text-white');
				TIMAAT.UI.showComponent('videoplayer');

				// setup video in player
				TIMAAT.VideoPlayer.setupVideo(video);
				// load video annotations from server
				TIMAAT.Service.getAnalysisLists(video.id, TIMAAT.VideoPlayer.setupAnalysisLists);
				// TIMAAT.VideoPlayer.setupAnalysisLists(video.medium.mediumAnalysisLists);
			});

			videoelement.on('click', '.timaat-mediadatasets-media-metadata', function(event) {
				event.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				TIMAAT.UI.showComponent('media');
				$('.form').hide();
				$('.media-nav-tabs').show();
				$('.media-data-tabs').hide();
				$('.nav-tabs a[href="#mediumDatasheet"]').tab("show");
				var id = video.id;
				var selectedVideo;
				var i = 0;
				for (; i < TIMAAT.MediaDatasets.media.length; i++) {
					if (TIMAAT.MediaDatasets.media[i].model.id == id) {
						selectedVideo = TIMAAT.MediaDatasets.media[i];
						break;
					}
				}
				$('#timaat-mediadatasets-media-metadata-form').data('medium', selectedVideo);
				TIMAAT.MediaDatasets.mediumFormDatasheet("show", 'video', selectedVideo);
			});

			videoelement.on('click', '.timaat-video-collectionitemremove', function(ev) {
				var row = $(this).parents('tr');
				TIMAAT.VideoChooser._removeCollectionItemRow(row);
			});
			
			videoelement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
				if ( video.mediumVideo.status && video.mediumVideo.status == "nofile" ) return;
				var timecode = Math.round((ev.originalEvent.offsetX/254)*video.mediumVideo.length);
				timecode = Math.min(Math.max(0, timecode),video.mediumVideo.length);
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+video.id+"/thumbnail"+"?time="+timecode+"&token="+video.mediumVideo.viewToken);
			});
			
			videoelement.find('.card-img-top').bind("mouseleave", function(ev) {
				if ( video.mediumVideo.status && video.mediumVideo.status == "nofile" ) return;
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+video.id+"/thumbnail"+"?token="+video.mediumVideo.viewToken);
			});
						
			if ( video.mediumVideo.status != "ready" && video.mediumVideo.status != "unavailable" && video.mediumVideo.status != "nofile" )
				TIMAAT.VideoChooser.updateVideoStatus(video);

		},
*/
		
	}
	
}, window));
