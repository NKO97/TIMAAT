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
		
		videos: null,
	
		init: function() {
    	// console.log("TCL: VideoChooser: init: function()");
			// setup video chooser list and UI events
			
			moment.locale('de');

		},

		updateVideoStatus: function(video) {
//			console.log("TCL: updateVideoStatus: function(video)");
			video.poll = window.setInterval(function() {
				jQuery.ajax({
					url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/video/"+video.mediumId+'/status',
					type:"GET",
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
				}).done(function(data) {
					if ( video.status && video.status == data ) return;
					video.status = data;
					
					TIMAAT.VideoChooser.setVideoStatus(video);
					
					if (video.status == 'unavailable' || video.status == 'ready')
						window.clearInterval(video.poll);
					
				})
				.fail(function(e) {
					// TODO handle error
					window.clearInterval(video.poll);
					video.ui.find('.timaat-video-status').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
					console.log( "error", e );
				});

			}, 1000);
			
		},
		
		setVideoStatus: function (video) {
			// clear ui status
			video.ui.find('.timaat-video-status').hide();
			video.ui.find('.timaat-video-status i').removeClass('fa-cog');
			video.ui.find('.timaat-video-status i').removeClass('fa-hourglass-half');
			video.ui.find('.timaat-video-status i').addClass('fa-cog');
			video.ui.find('.timaat-video-transcoding').hide();
			
			if (video.status == 'unavailable' || video.status == 'ready') 
				window.clearInterval(video.poll);

			if ( video.status == 'unavailable' ) {
				video.ui.find('.timaat-video-transcoding').html('<i class="fas fa-eye-slash"></i> nicht verfügbar');
				video.ui.find('.timaat-video-transcoding').show();
			}

			if ( video.status != 'ready'  &&  video.status != 'nofile' ) video.ui.find('.timaat-video-status').show();
			if ( video.status == 'waiting' ) video.ui.find('.timaat-video-status i').removeClass('fa-cog').addClass('fa-hourglass-half');
			if ( video.status == 'nofile' ) {
				video.ui.find('.timaat-video-upload').show();
				video.ui.find('.timaat-video-annotate').hide();

				if ( !video.ui.find('.timaat-video-upload').hasClass('dz-clickable') ) {
					video.ui.find('.timaat-video-upload').dropzone({
						url: "/TIMAAT/api/medium/video/"+video.medium.id+"/upload",
						createImageThumbnails: false,
						acceptedFiles: 'video/mp4',
						maxFilesize: 1024,
						timeout: 60*60*1000, // 1 hour
						maxFiles: 1,
						headers: {'Authorization': 'Bearer '+TIMAAT.Service.token},
						previewTemplate: '<div class="dz-preview dz-file-preview" style="margin-top:0px"> \
							<div class="progress" style="height: 24px;"> \
							  	<div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuemin="0" aria-valuemax="100" data-dz-uploadprogress><span data-dz-name></span></div> \
								</div> \
							</div>',
						complete: function(file) {
								if ( file.status == "success" && file.accepted ) {
									var newvideo = JSON.parse(file.xhr.response);
									video.status = newvideo;
									video.ui.find('.timaat-video-upload').hide();
									video.ui.find('.timaat-video-annotate').show();
									video.ui.find('.timaat-video-status').show();
									video.width = newvideo.width;
									video.height = newvideo.height;
									video.length = newvideo.length;
									video.frameRate = newvideo.frameRate;
									video.ui.find('.duration').html(TIMAAT.Util.formatTime(video.length));

									TIMAAT.VideoChooser.updateVideoStatus(video);
								}
								this.removeFile(file);
						}
					});
					video.ui.find('.timaat-video-upload i').on('click', function(ev) {$(this).parent().click();});
				}

			}			
		},
		
		setVideoList: function(videos) {
			// console.log("TCL: setVideoList: function(videos)");
			console.log("TCL: VIDEOCHOOSER: setVideoList -> videos", videos);
			if ( !videos ) return;
			
			$('#timaat-videochooser-list-loading').attr('style','display:none !important');
			
			// clear video UI list
			$('#timaat-videochooser-list').empty();
						
			TIMAAT.VideoChooser.videos = videos;
			
			if ( TIMAAT.VideoChooser.dt ) TIMAAT.VideoChooser.dt.destroy();
			
			videos.forEach(function(video) {
				TIMAAT.VideoChooser._addVideo(video);
			});
			
			TIMAAT.VideoChooser.dt = $('#timaat-videochooser-table').DataTable({
				"lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order": [[ 3, 'desc' ]],
				"pagingType": "simple_numbers",
				"columns": [
				    { "orderable": false },
				    null,
				    null,
				    null,
				    null,
				    { "orderable": false },
				  ],
				"language": {
					"decimal": ",",
					"thousands": ".",
					"search": "Suche",
					"lengthMenu": "Zeige _MENU_ Videos pro Seite",
					"zeroRecords": "Keine Videos gefunden.",
					"info": "Zeige Seite _PAGE_ von _PAGES_",
					"infoEmpty": "Keine Videos verf&uuml;gbar.",
					"infoFiltered": "(gefiltert, _MAX_ Videos gesamt)",
					"paginate": {
					            "first":      "Erste",
					            "previous":   "Vorherige",
					            "next":       "N&auml;chste",
					            "last":       "Letzte"
					        },
				},
				
			});

		},
		
		_addVideo: function(video) {
    	// console.log("TCL: _addVideo: function(video)");
    	// console.log("TCL: video", video);
/*
			var videoelement = $('<div class="card timaat-video-card"> <div class="timaat-video-status"><i class="fas fa-cog fa-spin"></i></div> \
					<div class="timaat-video-upload"><i class="fas fa-upload"></i> Videodatei hochladen</div> \
				  	<img class="card-img-top timmat-video-thumbnail" src="img/video-placeholder.png" alt="Video Platzhalter"> \
				  	<div class="text-right text-white duration">00:00</div> \
				  	<div class="card-footer text-left title">/div> \
				      </div>'
			);
*/
			var videoelement = $('<tr> \
					<td style="padding:0; width: 200px;"> \
					<div class="timaat-video-status"><i class="fas fa-cog fa-spin"></i></div> \
				  	<img class="card-img-top timmat-video-thumbnail" src="img/video-placeholder.png" width="200" height="113" alt="Videovorschau"> \
					</td> \
					<td class="title"></td>\
					<td class="duration">00:00:00</td>\
				      <td class="created">xx.xx.xxxx xx:xx</td>\
				      <td class="edited">xx.xx.xxxx xx:xx</td>\
				      <td>\
				      	<button type="button" class="btn btn-outline-primary btn-block timaat-video-upload"><i class="fas fa-upload"></i> Upload</button> \
					    <button type="button" class="btn btn-outline-success btn-block timaat-video-annotate"><i class="fas fa-draw-polygon"></i> Annotieren</button> \
					  </td> \
					</tr>'
			);

			if ( video.status != "nofile" ) videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+video.mediumId+"/thumbnail"+"?token="+video.viewToken);

			videoelement.appendTo('#timaat-videochooser-list');
			videoelement.find('.title').html(video.medium.title.name);
			videoelement.find('.duration').html(TIMAAT.Util.formatTime(video.length));
			videoelement.find('.created').html(moment(video.medium.createdAt).format('YYYY-MM-DD, kk:mm [Uhr]'));
			videoelement.find('.edited').html(moment(video.medium.lastEditedAt).format('YYYY-MM-DD, kk:mm [Uhr]'));
		
			video.ui = videoelement;
			TIMAAT.VideoChooser.setVideoStatus(video);
			
			// set up events
			videoelement.find('.timaat-video-annotate').click(function(ev) {
				if ( video.status && video.status == 'nofile' ) {
					// start upload process
					
				};
				if ( video.status && video.status != 'ready' && video.status != 'transcoding' && video.status != 'waiting' ) return;
				$('.timaat-video-card').removeClass('bg-info text-white');
				$(this).addClass('bg-info text-white');
				TIMAAT.UI.showComponent('videoplayer');

				// setup video in player
				TIMAAT.VideoPlayer.setupVideo(video);
				// load video annotations from server
				TIMAAT.Service.getAnalysisLists(video.mediumId, TIMAAT.VideoPlayer.setupAnalysisLists);
			});
			
			videoelement.find('.card-img-top').bind("mouseenter mousemove", function(ev) {
				if ( video.status && video.status == "nofile" ) return;
				var timecode = Math.round((ev.originalEvent.offsetX/254)*video.length);
				timecode = Math.min(Math.max(0, timecode),video.length);
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+video.mediumId+"/thumbnail"+"?time="+timecode+"&token="+video.viewToken);
			});
			videoelement.find('.card-img-top').bind("mouseleave", function(ev) {
				if ( video.status && video.status == "nofile" ) return;
				videoelement.find('.card-img-top').attr('src', "/TIMAAT/api/medium/video/"+video.mediumId+"/thumbnail"+"?token="+video.viewToken);
			});
			
			if ( video.status != "ready" && video.status != "unavailable" && video.status != "nofile" )
				TIMAAT.VideoChooser.updateVideoStatus(video);

		},
		
	}
	
}, window));
