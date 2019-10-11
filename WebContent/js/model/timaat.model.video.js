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
	
	TIMAAT.Video = class Video {
		constructor(model) {
			// console.log("TCL: Video -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editVideoButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-video-edit float-left" id="timaat-video-edit"><i class="fas fa-edit"></i></button>';
			var deleteVideoButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-video-remove float-left" id="timaat-video-remove"><i class="fas fa-trash-alt"></i></button>';
			var uploadVideoButton = '<button type="button" class="btn btn-outline btn-primary btn-sm timaat-video-list-upload float-left"><i class="fas fa-upload"></i></button>';
			
			if ( model.id < 0 ) { 
				deleteVideoButton = '';
				editVideoButton = '';
			};
			if ( model.status != "nofile" )
				uploadVideoButton = "";

			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editVideoButton +
								deleteVideoButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-video-list-name"></span>
							<br><br>
							<span class="timaat-video-list-medium-type-id"></span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class=btn-group-vertical>
							<div class="text-muted timaat-user-log" style="margin-left: 12px; margin-bottom: 10px;">
								<i class="fas fa-user"></i>
							</div>` +
							uploadVideoButton +
						  `</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-video-list').append(this.listView);
			
			var video = this; // save video for system events
			var listView = this.listView;

			// attach upload functionality
			if ( model.status == "nofile" ) {
				this.listView.find('.timaat-video-list-upload').dropzone({
					url: "/TIMAAT/api/medium/video/"+video.model.medium.id+"/upload",
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
								video.model.status = newvideo;
								listView.find('.timaat-video-list-upload').hide();
								video.model.width = newvideo.width;
								video.model.height = newvideo.height;
								video.model.length = newvideo.length;
								video.model.frameRate = newvideo.frameRate;
							}
							this.removeFile(file);
					}
				});

			}
			
			
			this.updateUI();      

			// attach user log info
			this.listView.find('.timaat-user-log').popover({
				placement: 'right',
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				trigger: 'click',
				html: true,
				content: '<div class="timaat-user-log-details">Lade...</div>',
				container: 'body',
				boundary: 'viewport',				
			});
			
			this.listView.find('.timaat-user-log').on('show.bs.popover', function () {
				TIMAAT.UI.hidePopups();
			});

			this.listView.find('.timaat-user-log').on('inserted.bs.popover', function () {
				if (video.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+video.model.medium.createdByUserAccount.id+'">[ID '+video.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(video.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+video.model.medium.createdByUserAccount.id+'">[ID '+video.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(video.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+video.model.medium.lastEditedByUserAccount.id+'">[ID '+video.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(video.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach video handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Video -> constructor -> open video datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-video-form').data('video', video);
				TIMAAT.MediaDatasets.videoFormData("show", video);				
				// video.listView.find('.timaat-video-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-video-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-video-form').data('video', video);
				TIMAAT.MediaDatasets.videoFormData("edit", video);
				// video.listView.find('.timaat-video-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-video-remove').click(this, function(ev) {
      	console.log("TCL: Video -> constructor -> this.listView.find('.timaat-video-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-video-delete').data('video', video);
				$('#timaat-mediadatasets-video-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Video -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-video-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Video -> remove -> remove()");
			// remove video from UI
			this.listView.remove(); // TODO remove tags from video_has_tags
			// remove from video list
			var index = TIMAAT.MediaDatasets.videos.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.videos.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.videos.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.videos.model.splice(index, 1);
		}

	}
	
}, window));
