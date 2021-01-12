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
	
	TIMAAT.Medium = class Medium {
		constructor(model, mediumType) {
      // console.log("TCL: Medium -> constructor -> model, mediumType", model, mediumType);
			// setup model
			this.model = model;
			
			// create and style list view element
			var displayMediumTypeIcon = '';
			var fileTypesAccepted = '*.*';
			if (mediumType == 'medium') { // Necessary to fix upload button functionality
				mediumType = model.mediaType.mediaTypeTranslations[0].type;
				// if (model.mediumAudio) mediumType = 'audio';
				// if (model.mediumDocument) mediumType = 'document';
				// if (model.mediumImage) mediumType = 'image';
				// if (model.mediumSoftware) mediumType = 'software';
				// if (model.mediumText) mediumType = 'text';
				// if (model.mediumVideo) mediumType = 'video';
				// if (model.mediumVideogame) mediumType = 'videogame';
			}
			// if (mediumType == 'medium') { // only display icon in media list
				// displayMediumTypeIcon = '  <i class="fas fa-photo-video"></i> '; // default media icon
				switch (mediumType) {
					case 'audio':
						// displayMediumTypeIcon = '  <i class="far fa-file-audio"></i> ';
					break;
					case 'document':
						// displayMediumTypeIcon = '  <i class="far fa-file-pdf"></i> ';
					break;
					case 'image':
						// displayMediumTypeIcon = '  <i class="far fa-file-image"></i> ';
						fileTypesAccepted = '.png';
					break;
					case 'software':
						// displayMediumTypeIcon = '  <i class="fas fa-compact-disc"></i> ';
					break;
					case 'text':
						// displayMediumTypeIcon = '  <i class="far fa-file-alt"></i> ';
					break;
					case 'video':
						// displayMediumTypeIcon = '  <i class="far fa-file-video"></i> ';
						fileTypesAccepted = '.mp4';
					break;
					case 'videogame':
						// displayMediumTypeIcon = '  <i class="fas fa-gamepad"></i> ';
					break;
				}
			// }
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							displayMediumTypeIcon +
							`<span class="timaat-mediadatasets-`+mediumType+`-list-name">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat-user-log" style="margin-left: 12px; margin-bottom: 10px;">
									<i class="fas fa-user"></i>							
								</div>
								<form action="/TIMAAT/api/medium/`+mediumType+`/`+this.model.id+`/upload" method="post" enctype="multipart/form-data">
									<input name="file" accept="`+fileTypesAccepted+`" class="timaat-medium-upload-file d-none" type="file" />
									<button type="submit" title="Datei hochladen" class="btn btn-outline btn-primary btn-sm timaat-mediadatasets-medium-upload float-left"><i class="fas fa-upload"></i></button>
								</form>
								<button type="button" title="Video annotieren" class="btn btn-outline-success btn-sm btn-block timaat-mediadatasets-medium-annotate"><i class="fas fa-draw-polygon"></i></button>
						  </div>
						</div>
					</div>
				</li>`
			);

			// console.log("TCL: append me to list:", mediumType);
			// $('#timaat-mediadatasets-'+mediumType+'-list').append(this.listView);     
			var medium = this; // save medium for system events

			// attach video upload functionality
			// upload button click triggers file selection
			this.listView.find('.timaat-mediadatasets-medium-upload').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				medium.listView.find('.timaat-medium-upload-file').click();
			});

			// user selected file, trigger form submit / upload
			this.listView.find('.timaat-medium-upload-file').on('change', function(ev) {
				let fileList = medium.listView.find('.timaat-medium-upload-file')[0].files;
				if ( fileList.length  > 0 ) TIMAAT.UploadManager.queueUpload(medium.model, medium.listView.find('form'));
			});

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
				if (medium.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+medium.model.createdByUserAccount.id+'">[ID '+medium.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(medium.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+medium.model.createdByUserAccount.id+'">[ID '+medium.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(medium.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+medium.model.lastEditedByUserAccount.id+'">[ID '+medium.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(medium.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach medium handlers
			// $(this.listView).on('click', this, function(ev) {
			// 	// console.log("TCL: Medium -> constructor -> open medium datasheet");
			// 	ev.stopPropagation();
			// 	// show tag editor - trigger popup
			// 	TIMAAT.UI.hidePopups();
			// 	$('.form').hide();
			// 	$('.media-nav-tabs').show();
			// 	$('.media-data-tabs').hide();
			// 	$('.nav-tabs a[href="#mediumDatasheet"]').tab("show");
			// 	$('#timaat-mediadatasets-metadata-form').data('medium', medium);
			// 	TIMAAT.MediaDatasets.mediumFormDatasheet("show", mediumType, medium);
			// 	// medium.listView.find('.timaat-mediadatasets-medium-list-tags').popover('show');
			// });

			// annotate handler
			// this.listView.find('.timaat-mediadatasets-medium-annotate').on('click', this, function(ev) {
			// 	ev.stopPropagation();
			// 	TIMAAT.UI.hidePopups();
			// 	TIMAAT.UI.showComponent('videoplayer');
			// 	console.log("TCL: Medium -> constructor -> medium", medium);
			// 	// setup video in player
			// 	TIMAAT.VideoPlayer.setupVideo(medium.model);
			// 	// load video annotations from server
			// 	TIMAAT.AnalysisListService.getAnalysisLists(medium.model.id, TIMAAT.VideoPlayer.setupMediumAnalysisLists);
			// });

		}

		updateUI() {
			// console.log("TCL: Medium -> updateUI -> updateUI()");
			// title
			var type = $('#timaat-mediadatasets-metadata-form').data('mediumType');
			var name = this.model.displayTitle.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediadatasets-'+type+'-list-name').html(name);
			if (type == 'medium') {
				this.listView.find('.timaat-mediadatasets-medium-list-mediatype').html(type);
			}

			if ( this.model.fileStatus == "noFile" && !TIMAAT.UploadManager.isUploading(this.model) ) {
				this.listView.find('.timaat-mediadatasets-medium-upload').show();
			} else {
				this.listView.find('.timaat-mediadatasets-medium-upload').hide();
			}

			if ( this.model.fileStatus != "noFile" && this.model.fileStatus != "unavailable" ) {
				this.listView.find('.timaat-mediadatasets-medium-annotate').show();
			} else {
				this.listView.find('.timaat-mediadatasets-medium-annotate').hide();
			}
		}

		remove() {
			// console.log("TCL: Medium -> remove -> remove()");
			// remove medium from UI
			this.listView.remove(); // TODO remove tags from medium_has_tags
			$('#timaat-mediadatasets-metadata-form').data('medium', null);
		}

	}
	
}, window));
