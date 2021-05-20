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
		curVideos: [],
		videos: null,
		videoChooserLoaded: false,

		loadCollections: function() {
			// load media collections
			TIMAAT.MediumCollectionService.getMediaCollections(this.setupMediaCollections);
			// init datatable
			this.setupDataTable();
			// if ( !this.collection ) {
				this.collection = 'init';
				this.setCollection(null);
			// }
			TIMAAT.VideoChooser.videoChooserLoaded = true;
		},

		initVideoChooserComponent: function() {
			// console.log("TCL: initVideoChooserComponent");
			if (!this.videoChooserLoaded) {
				// TIMAAT.VideoChooser.setMedia();
				this.loadCollections();
			} 
			if (TIMAAT.UI.component != 'videochooser') {
				// this.dt.ajax.reload();
				TIMAAT.UI.showComponent('videochooser');
				$('#timaat-videochooser-collectionlibrary').trigger('click');
			}
		},
		
		init: function() {
			// setup video chooser list and UI events
			$('#timaat-videochooser-collectionlibrary').on('click', function(ev) {
				TIMAAT.VideoChooser.setCollection(null);
				TIMAAT.UI.displayComponent('videochooser', null, 'videochooser-datatable');
				TIMAAT.URLHistory.setURL(null, 'Media Library', '#mediaLibrary/list');
			});

			moment.locale('de');

			$('#timaat-videochooser-mediacollection-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var col = modal.data('mediacollection');				
				var heading = (col) ? "Mediensammlung bearbeiten" : "Mediensammlung hinzufügen";
				var submit = (col) ? "Speichern" : "Hinzufügen";
				var title = (col) ? col.title : "";
				var comment = (col) ? col.remark : "";
				// setup UI from Video Player state
				$('#mediumCollectionMetaLabel').html(heading);
				$('#timaat-mediacollection-meta-submit-button').html(submit);
				$("#timaat-mediacollection-meta-title").val(title).trigger('input');
				$("#timaat-mediacollection-meta-comment").val(comment);				
			});

			$('#timaat-mediacollection-delete-submit-button').on('click', function(ev) {
				var modal = $('#timaat-videochooser-mediacollection-delete');
				var col = modal.data('mediacollection');
				if (col) TIMAAT.VideoChooser._mediaCollectionRemoved(col);
				modal.modal('hide');
			});

			$('#timaat-mediacollection-meta-submit-button').on('click', async function(ev) {
				var modal = $('#timaat-videochooser-mediacollection-meta');
				var col = modal.data('mediacollection');
				var title = $("#timaat-mediacollection-meta-title").val();
				var comment = $("#timaat-mediacollection-meta-comment").val();				
				if (col) {
					TIMAAT.VideoChooser.collection.title = title;
					TIMAAT.VideoChooser.collection.remark = comment;
					TIMAAT.VideoChooser.updateMediaCollection(TIMAAT.VideoChooser.collection);
				} else {
					TIMAAT.MediumCollectionService.createMediaCollection(title, comment, TIMAAT.VideoChooser._mediaCollectionAdded);
				}
				await TIMAAT.UI.refreshDataTable('mediumCollection');
				modal.modal('hide');
			});

			$('#timaat-mediacollection-meta-title').on('input', function(ev) {
				if ( $("#timaat-mediacollection-meta-title").val().length > 0 ) {
					$('#timaat-mediacollection-meta-submit-button').prop('disabled', false);
					$('#timaat-mediacollection-meta-submit-button').removeAttr('disabled');
				} else {
					$('#timaat-mediacollection-meta-submit-button').prop('disabled', true);
					$('#timaat-mediacollection-meta-submit-button').attr('disabled');
				}
			});
			
			$('#timaat-videochooser-list-selectall input:checkbox').change(function() {
				$('#timaat-videochooser-table tr input:checkbox').prop('checked', $(this).prop('checked'));
				$('#timaat-videochooser-list-action-submit-button').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);
			});

			$('#timaat-videochooser-list-action').change(function() {
				if ( $('#timaat-videochooser-list-action').val() == 'add' )
					$('#timaat-videochooser-list-target').show();
				else
					$('#timaat-videochooser-list-target').hide();
			});
			
			$('#timaat-videochooser-list-action-submit-button').on('click', function() {
				TIMAAT.VideoChooser.dt.$('input:checked').each(function(index, item) {
					var medium = $(item).parents('tr').data('medium');
				});				
			});
			
			$('#timaat-videochooser-list-action-submit-button').on('click', function() {
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
							TIMAAT.MediumCollectionService.addCollectionItem(target.id, medium.id);
							// sync to model
							var found = false;
							target.mediaCollectionHasMediums.forEach(function(item) {
								if ( item.medium && item.medium.id == medium.id ) found = true;
							});
							// console.log("TCL: TIMAAT.VideoChooser.dt.$ -> found", found);
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
				$('#timaat-videochooser-list-action-submit-button').prop('disabled', true);
				TIMAAT.VideoChooser.dt.$('input:checked').each(function(index, item) { $(item).prop('checked', false); });
				
			});
			
			$('#timaat-videochooser-table').on('page.dt', function() {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			// upload event listeners
			$(document).on('added.upload.TIMAAT', function(event, video) {
				if ( !video ) return;
				let myvideo = $('#videochooser-item-'+video.id).parent().data('video');
				if ( !myvideo ) return;
				myvideo.ui.find('.timaat-medium-upload').css('display', 'none');
			});

			$(document).on('success.upload.TIMAAT', function(event, video) {
				if ( !video ) return;
				let myvideo = $('#videochooser-item-'+video.id).parent().data('video');
				if ( !myvideo ) return;
				myvideo.mediumVideo.width = video.mediumVideo.width;
				myvideo.mediumVideo.height = video.mediumVideo.height;
				myvideo.mediumVideo.length = video.mediumVideo.length;
				myvideo.mediumVideo.frameRate = video.mediumVideo.frameRate;

				myvideo.ui.find('.timaat-medium-upload').css('display', 'none');
				myvideo.ui.find('.timaat-video-annotate').show();
				myvideo.ui.find('.timaat-medium-status').show();
				myvideo.ui.find('.duration').html(TIMAAT.Util.formatTime(myvideo.mediumVideo.length,true));
				TIMAAT.VideoChooser.updateVideoStatus(myvideo);
				TIMAAT.VideoChooser.dt.ajax.reload(null, false);
			});

			$(document).on('removed.upload.TIMAAT', function(event, video) {
				if ( !video ) return;
				let myvideo = $('#videochooser-item-'+video.id).parent().data('video');
				if ( !myvideo ) return;
				if ( myvideo.fileStatus == 'noFile' ) myvideo.ui.find('.timaat-medium-upload').css('display', 'block');
			});
			
			$('#timaat-videochooser-list').hide();

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

		setupDataTable: function() {
			// setup datatable
			this.dt = $('#timaat-videochooser-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 2, 'asc' ]],
				"pagingType"    : "simple_numbers",
				"processing"    : true,
				"stateSave"     : true,
				"scrollX"       : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"rowId"					: 'id',
				"serverSide"		: true,
				"ajax": {
					"url"        : "api/medium/video/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw: data.draw,
							start: data.start,
							length: data.length,
							orderby: data.columns[data.order[0].column].name,
							dir: data.order[0].dir,
							// mediumsubtype: 'video'
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;

						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
						// setup model
						var vids = Array();
						var newVideo;
						data.data.forEach(function(video) { 
							if ( video.id > 0 && video.mediumVideo) {
								newVideo = new TIMAAT.Medium(video, 'video');
								vids.push(newVideo);
							}
						});
						TIMAAT.VideoChooser.videos = vids;
						TIMAAT.VideoChooser.videos.model = data.data;
						return data.data; // data.map(medium => new TIMAAT.Medium(medium));            
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let mediumElement = $(row);
					let medium = data;
					let type = medium.mediaType.mediaTypeTranslations[0].type;
					medium.ui = mediumElement;
					mediumElement.data('medium', medium);
					mediumElement.find('input:checkbox').prop('checked', false);
					mediumElement.find('input:checkbox').change(function() {
						$('#timaat-videochooser-list-action-submit-button').prop('disabled', TIMAAT.VideoChooser.dt.$('input:checked').length == 0);
					});

					if ( medium.fileStatus != "noFile" ) TIMAAT.VideoChooser.loadThumbnail(medium);
					TIMAAT.VideoChooser.setVideoStatus(medium);
					
					// set up events
					mediumElement.on('click', '.timaat-medium-thumbnail', function(ev) {
						mediumElement.find('.timaat-video-annotate').click();
					});

					mediumElement.on('click', '.timaat-video-annotate', async function(ev) {
						//* only videos can be annotated
						if (!medium.mediumVideo) return;
						if ( medium.fileStatus && medium.fileStatus != 'ready' && medium.fileStatus != 'transcoding' && medium.fileStatus != 'waiting' ) return;
						// $('.timaat-video-card').removeClass('bg-info text-white');
						// $(this).addClass('bg-info text-white');
						await TIMAAT.VideoPlayer.initializeAnnotationMode(medium);
					});

					mediumElement.on('click', '.timaat-mediadatasets-media-metadata', async function(event) {
						event.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('media');
						TIMAAT.MediumDatasets.load();
						TIMAAT.UI.clearLastSelection(type);
						let mediumModel = {};
						mediumModel.model = medium;
						TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-metadata', 'medium-metadata-form');
            TIMAAT.UI.displayDataSetContent('dataSheet', mediumModel, 'medium');
						TIMAAT.MediumDatasets.setDataTableOnItemSelect(type, mediumModel);
					});

					mediumElement.on('click', '.timaat-video-collectionitemremove', function(ev) {
						var row = $(this).parents('tr');
						TIMAAT.VideoChooser._removeCollectionItemRow(row);
					});
					
					mediumElement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
						//* only videos have thumbnail slideshow
						if (!medium.mediumVideo) return;
						if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
						let length = medium.mediumVideo.length;
						let timeCode = Math.round((ev.originalEvent.offsetX/254)*length);
						timeCode = Math.min(Math.max(0, timeCode),length);
						mediumElement.find('.timaat-medium-thumbnail').attr('src', "/TIMAAT/api/medium/video/"+medium.id+"/thumbnail"+"?time="+timeCode+"&token="+medium.viewToken);
					});
					
					mediumElement.find('.card-img-top').bind("mouseleave", function(ev) {
						//* only videos have thumbnail slideshow
						if (!medium.mediumVideo) return;
						if ( medium.fileStatus && medium.fileStatus == "noFile" ) return;
						mediumElement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+medium.id+"/thumbnail"+"?token="+medium.viewToken);
					});
								
					if ( type == 'video' && medium.fileStatus != "ready" && medium.fileStatus != "unavailable" && medium.fileStatus != "noFile" )
						TIMAAT.VideoChooser.updateVideoStatus(medium);

				},
				"columns": [
					{ data: 'id', className: 'videochooser-item', orderable: false, width: '5%', render: function(data, type, medium, meta) {
						return '<input type="checkbox" aria-label="Checkbox">';
						}, createdCell( cell, cellData, rowData, rowIndex, colIndex ) {
							$(cell).attr('id', 'videochooser-item-'+cellData);
						}
					},
					{ data: null, className: 'videochooser-item-preview', orderable: false, width: '150px', render: function(data, type, medium, meta) {
						let ui;
						if (medium.mediumVideo) {
							ui = `
								<div class="timaat-medium-status">
									<i class="fas fa-cog fa-spin"></i>
									</div>
								<img class="card-img-top center timaat-medium-thumbnail" src="img/video-placeholder.png" width="150" height="85" alt="Videovorschau"/>`;
						}
						else if (medium.mediumImage) {
							ui = `<div style="display:flex">
											<img class="card-img-top center timaat-medium-thumbnail" src="img/image-placeholder.png" width="150" height="85" alt="Image preview"/>
										</div>`;
						}
						else {
							ui = `<div style="display:flex">
											<img class="card-img-top center timaat-medium-thumbnail" src="img/preview-placeholder.png" width="150" height="85" alt="No preview available"/>
										</div>`;
						}
						return ui;
						}
					},
					{ data: 'id', name: 'title', className: 'title', width: '38%', render: function(data, type, medium, meta) {
						// console.log("TCL: medium", medium);
						let titleDisplay = `<p>`+medium.displayTitle.name+`</p>`;
							if (medium.originalTitle != null && medium.displayTitle.id != medium.originalTitle.id) {
								titleDisplay += `<p><i>(OT: `+medium.originalTitle.name+`)</i></p>`;
							}
							// TODO not working anymore due to server side datatable data search
							medium.titles.forEach(function(title) { // make additional titles searchable in medialibrary
								if (title.id != medium.displayTitle.id && (medium.originalTitle == null || title.id != medium.originalTitle.id)) {
									titleDisplay += `<div style="display:none">`+title.name+`</div>`;
								}
							});
							return titleDisplay;
						}
					},
					{ data: 'mediumVideo.length', name: 'duration', className: 'duration', width: '10%', render: function(data, type, medium, meta) {
						// console.log("TCL: data, type, medium, meta - ", data, type, medium, meta);
						if (medium.mediumVideo) {
								return TIMAAT.Util.formatTime(data);
							}
							return "";
						}
					},
					{ data: 'mediumHasActorWithRoles', name: 'producer', className: 'producer', orderable: false, width: '10%', render: function(data, type, video, meta) {
							return TIMAAT.VideoChooser._getProducer(video);
						}
					},
					{ data: 'releaseDate', name: 'releaseDate', className: 'date', width: '15%', render: function(data, type, medium, meta) {
							if (data == null) return "";
							return moment.utc(data).format('YYYY-MM-DD');
						}
					},
					{ data: null, className: 'actions', orderable: false, width: '7%', render: function(data, type, medium, meta) {
						let ui;
						if (medium.mediumVideo) {
							ui = `<div>
								<form action="/TIMAAT/api/medium/video/`+medium.id+`/upload" method="post" enctype="multipart/form-data">
									<input name="file" accept=".mp4" class="timaat-medium-upload-file d-none" type="file" />
									<button type="submit" title="Datei hochladen" class="btn btn-outline-primary btn-sm btn-block timaat-medium-upload"><i class="fas fa-upload"></i></button>
								</form>
								<button type="button" title="Video annotieren" class="btn btn-outline-success btn-sm btn-block timaat-video-annotate"><i class="fas fa-draw-polygon"></i></button>`;
						} else if (medium.mediumImage) {
							ui = `<div>
								<form action="/TIMAAT/api/medium/image/`+medium.id+`/upload" method="post" enctype="multipart/form-data">
									<input name="file" accept=".png" class="timaat-medium-upload-file d-none" type="file" />
									<button type="submit" title="Datei hochladen" class="btn btn-outline-primary btn-sm btn-block timaat-medium-upload"><i class="fas fa-upload"></i></button>
								</form>
								<button type="button" title="Video annotieren" class="btn btn-outline-success btn-sm btn-block timaat-video-annotate" style="display:none"><i class="fas fa-draw-polygon"></i></button>`;
						} else {
							ui = `<div>`;
						}
						ui += `<button type="button" title="Datenblatt editieren" class="btn btn-outline-secondary btn-sm btn-block timaat-mediadatasets-media-metadata"><i class="fas fa-file-alt"></i></button>`;
						if ( TIMAAT.VideoChooser.collection ) ui += `<button type="button" title="Aus Mediensammlung entfernen"class="btn btn-outline-secondary btn-sm btn-block timaat-video-collectionitemremove"><i class="fas fa-folder-minus"></i></button>`;
						ui += '</div>';
							return ui;
						},
					}				
				],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Suche",
					"lengthMenu"  : "Zeige _MENU_ Videos pro Seite",
					"zeroRecords" : "Keine Videos gefunden.",
					"info"        : "Seite _PAGE_ von _PAGES_ &middot; (_MAX_ Videos gesamt)",
					"infoEmpty"   : "Keine Videos verf&uuml;gbar.",
					"infoFiltered": " &mdash; _TOTAL_ von _MAX_ Videos angezeigt",
					"paginate"    : {
						"first"   : "Erste",
						"previous": "Vorherige",
						"next"    : "N&auml;chste",
						"last"    : "Letzte"
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
        	// console.log("TCL: data", data);
					if ( video.fileStatus && video.fileStatus == data ) return;
					video.fileStatus = data;
					
					this.setVideoStatus(video);
					
					if (video.fileStatus == 'unavailable' || video.fileStatus == 'ready')
						window.clearInterval(video.poll);
						// console.log("TCL: video.fileStatus", video.fileStatus);
				})
				.fail(function(e) {
					// TODO handle error
					window.clearInterval(video.poll);
					video.ui.find('.timaat-medium-status').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
					console.log( "error", e );
				});

			}, Math.round(30000+(Math.random()*15000)));
			
		},
		
		setVideoStatus: function (video) {
			if ( !video || !video.ui ) return;
			// clear ui status
			video.ui.find('.timaat-medium-status').hide();
			video.ui.find('.timaat-medium-status i').removeClass('fa-cog');
			video.ui.find('.timaat-medium-status i').removeClass('fa-hourglass-half');
			video.ui.find('.timaat-medium-status i').addClass('fa-cog');
			video.ui.find('.timaat-medium-transcoding').hide();
			
			if (video.fileStatus == 'unavailable' || video.fileStatus == 'ready') 
				window.clearInterval(video.poll);

			if ( video.fileStatus == 'unavailable' ) {
				video.ui.find('.timaat-medium-transcoding').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
				video.ui.find('.timaat-medium-transcoding').show();
			}

			if ( video.fileStatus != 'ready'  &&  video.fileStatus != 'noFile' ) video.ui.find('.timaat-medium-status').show();
			if ( video.fileStatus == 'waiting' ) video.ui.find('.timaat-medium-status i').removeClass('fa-cog').addClass('fa-hourglass-half');
			if ( video.fileStatus == 'noFile'  ) {
				video.ui.find('.timaat-medium-upload').css('display', 'block');
				video.ui.find('.timaat-video-annotate').hide();
				
				// upload button click triggers file selection
				video.ui.find('.timaat-medium-upload').off('click').on('click', function(ev) {
					ev.preventDefault();
					ev.stopPropagation();
					video.ui.find('.timaat-medium-upload-file').click();
				});

				// user selected file, trigger form submit / upload
				video.ui.find('.timaat-medium-upload-file').off('change').on('change', function(ev) {
					let filelist = video.ui.find('.timaat-medium-upload-file')[0].files;
					if ( filelist.length  > 0 ) TIMAAT.UploadManager.queueUpload(video, video.ui.find('form'));
				});
			}
			if ( TIMAAT.UploadManager.isUploading(video) ) video.ui.find('.timaat-medium-upload').css('display', 'none');
		},
		
		setCollection: function(collection) {
    	// console.log("TCL: collection", collection);
			if ( this.collection == collection ) return;
			
			$('#timaat-videochooser-list-loading').attr('style','');
			$('#timaat-videochooser-list-selectall input:checkbox').prop('checked', false);
			$('#timaat-videochooser-list-action-submit-button').prop('disabled', true);
			$('#timaat-videochooser-list').hide();
			$('#timaat-videochooser-list-action').val('add').change();
			
			$('#timaat-videochooser-collectionlibrary').removeClass("active");
			$('#timaat-videochooser-collectionlibrary').addClass("text-info");
			$('#timaat-videochooser-collectionlist li').removeClass("active");
			$('#timaat-videochooser-collectionlist li button').addClass("btn-outline");
			
			this.collection = collection;
			
			$('#timaat-videochooser-list-action-remove').prop('disabled', collection == null);

			if ( collection == null ) {
				$('#timaat-videochooser-collectionlibrary').addClass("active");
				$('li[id^="timaat-videochooser-collection-"]').removeClass("active");
				$('#timaat-videochooser-collectionlibrary').removeClass("text-info");
//				if ( !TIMAAT.MediumDatasets.videos.model ) return;
        // console.log("TCL: TIMAAT.MediumDatasets.videos.model", TIMAAT.MediumDatasets.videos.model);
//				this.setVideoList(TIMAAT.MediumDatasets.videos.model);
				// set ajax data source
				if ( this.dt ) {
					this.dt.ajax.url('/TIMAAT/api/medium/video/list');
					this.dt.ajax.reload();
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
//				this.setVideoList(videos);
*/
				// set ajax data source
				if ( this.dt ) {
					this.dt.ajax.url('/TIMAAT/api/mediumCollection/'+collection.id+'/media');
					this.dt.ajax.reload();
				}
				
			}
			
			$('#timaat-videochooser-list-loading').attr('style','display:none !important');
			$('#timaat-videochooser-list').show();
		},
		
		setMedia: function() {
			// if (!TIMAAT.MediumDatasets.videos.model || this.videos) return;
			// console.log("TCL: TIMAAT.MediumDatasets.videos.model", TIMAAT.MediumDatasets.videos.model);
			if (!TIMAAT.VideoChooser.videos.model) return;			
			// this.videos = TIMAAT.MediumDatasets.videos.model;			
			if ( !TIMAAT.VideoChooser.collection ) {
				TIMAAT.VideoChooser.collection = 'init';
				TIMAAT.VideoChooser.setCollection(null);
			}
		},

/*
		setVideoList: function(videos) {
			if ( this.dt != null ) return;
			// console.log("TCL: setVideoList: function(videos)");
			// console.log("TCL: VIDEOCHOOSER: setVideoList -> videos", videos);
			if ( !videos ) return;
			
			if ( this.dt != null ) {
				this.dt.destroy();
				this.dt = null;
				
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
//				this._addVideo(video);
			});
			
			this.curVideos = videos;
			
		},
*/
		
		loadThumbnail: function (video) {
			if ( !video || !video.ui ) return;
			var img = $('<img />').appendTo('body').hide();
			img.data('video', video );
			img.on('load', function(ev) {
				var video = $(ev.target).data('video');
				if (video.mediumVideo) {
					video.ui.find('.card-img-top').attr('src', "api/medium/video/"+video.id+"/thumbnail"+"?token="+video.viewToken);
				}
				if (video.mediumImage) {
					video.ui.find('.card-img-top').attr('src', "api/medium/image/"+video.id+"/thumbnail"+"?token="+video.viewToken);
				}
				$(ev.target).remove();			
			});
			img.on('error', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				$(ev.target).remove();
			});
			if (video.mediumVideo) {
				img.attr('src', "api/medium/video/"+video.id+"/thumbnail"+"?token="+video.viewToken);	
			}
			if (video.mediumImage) {
				img.attr('src', "api/medium/image/"+video.id+"/thumbnail"+"?token="+video.viewToken);
			}
		},
		
		addMediaCollection: function() {
			$('#timaat-videochooser-mediacollection-meta').data('mediacollection', null);
			$('#timaat-videochooser-mediacollection-meta').modal('show');	
		},
		
		updateMediaCollection: function(collection) {
			console.log("TCL: updateMediaCollection: function(collection)");
			console.log("TCL: collection", collection);
			// sync to server
			TIMAAT.MediumCollectionService.updateMediaCollection(collection);
			// update UI collection view
			collection.ui.find('.collection-title').html(collection.title);
			$('#timaat-videochooser-list-target-collection option[value="'+collection.id+'"]').text(collection.title);
			
			this._sortCollections();
		},
		
		removeMediaCollection: function() {
			console.log("TCL: removeMediaCollection: function()");
			if ( !this.collection ) return;
			$('#timaat-videochooser-mediacollection-delete').data('mediacollection', this.collection);
			$('#timaat-videochooser-mediacollection-delete').modal('show');
		},
		
		_mediaCollectionAdded: async function(col) {
			this.collections.push(col);
			this._addCollection(col);			
			this._sortCollections();
			await TIMAAT.UI.refreshDataTable('mediumCollection');
		},
		
		_mediaCollectionRemoved: async function(col) {
			console.log("TCL: _mediaCollectionRemoved: function(col)");
			console.log("TCL: col", col);
			// sync to server
			TIMAAT.MediumCollectionService.removeMediaCollection(col);
			await TIMAAT.UI.refreshDataTable('mediumCollection');

			// remove from model lists
			var index = this.collections.indexOf(col);
			if (index > -1) this.collections.splice(index, 1);
			
			// update UI list view
			if ( col.ui ) $('#timaat-videochooser-collection-'+col.id).remove();
			index--;
			if ( index < 0 ) index = 0;
			if ( index > (this.collections.length-1) ) index = -1;
			
			if ( index >= 0 ) this.setCollection(this.collections[index]);
			else this.setCollection(null);
			
			$('#timaat-videochooser-list-target-collection option[value="'+col.id+'"]').remove();			
			this._sortCollections();
		},
		
		_removeCollectionItemRow: function(row) {
			if ( row == null ) return;
			var video = $(row).data('medium');
			console.log(row, video);
			
			// remove from server
			TIMAAT.MediumCollectionService.removeCollectionItem(this.collection.id, video.id).then((success) => {
				// sync changes with UI
				this.dt.row(row).remove().draw();
			});
			
/*
			var item = null;
			this.collection.mediaCollectionHasMediums.forEach(function (colvideo) { 
				if ( colvideo.medium == video ) item = colvideo;
			});
			if ( !item ) return;				

			var index = this.collection.mediaCollectionHasMediums.indexOf(item);
			if (index > -1) this.collection.mediaCollectionHasMediums.splice(index, 1);
*/			
		},
		
		_sortCollections: function() {
			$("#timaat-videochooser-collectionlist li").sort(function sort_li(a, b) { return ($(b).text().toLowerCase()) < ($(a).text().toLowerCase()) ? 1 : -1; }).appendTo('#timaat-videochooser-collectionlist');
			$("#timaat-videochooser-list-target-collection option").sort(function sort_li(a, b) { return ($(b).text().toLowerCase()) < ($(a).text().toLowerCase()) ? 1 : -1; }).appendTo('#timaat-videochooser-list-target-collection');
		},

		_addCollection: function(collection) {
			var colelement = $('<li id="timaat-videochooser-collection-'+collection.id+'" class="list-group-item list-group-item-action">\
				<i class="fas fa-folder"></i> <span class="collection-title">'+collection.title+'</span>'+
				' <button type="button" onclick="TIMAAT.VideoChooser.removeMediaCollection()" class="btn btn-danger btn-outline btn-sm float-right">\
				<i class="fas fa-trash-alt"></i></button></li>');
			
			colelement.appendTo('#timaat-videochooser-collectionlist');
			
			// collection events
			colelement.on('click', function(ev) { 
				TIMAAT.VideoChooser.setCollection(collection); 
				TIMAAT.URLHistory.setURL(null, 'Media Library', '#mediaLibrary/'+collection.id);
			});

			colelement.on('dblclick', function(ev) {
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
			if ( !video || !video.mediumHasActorWithRoles ) return "-";
			var actors = [];
			video.mediumHasActorWithRoles.forEach(function(role) {
				if ( role.role.id == 5 ) actors.push(role.actor); // 5 == Producer, according to TIMAAT DB definition
			});
			if ( actors.length == 0 ) return "no data available";
			var producer = "";
			var i = 0;
			for (; i < actors.length; i++) {
				if (producer.length == 0) {
					producer += actors[i].displayName.name;
					if (actors[i].birthName && actors[i].birthName.name != actors[i].displayName.name) {
						producer += " <i>("+ actors[i].birthName.name+")<i>";
					}
				} else {
					producer += ",<br>"+actors[i].displayName.name;
					if (actors[i].birthName && actors[i].birthName.name != actors[i].displayName.name) {
						producer += " <i>("+ actors[i].birthName.name+")<i>";
					}
				}
			}
      // console.log("TCL: producer", producer);
			return producer;
		},

	}
	
}, window));
