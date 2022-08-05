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
			}
			// if (mediumType == 'medium') { // only display icon in media list
				// displayMediumTypeIcon = '  <i class="fas fa-photo-video"></i> '; // default media icon
				switch (mediumType) {
					case 'audio':
						fileTypesAccepted = '.mp3';
					break;
					case 'document':
					break;
					case 'image':
						fileTypesAccepted = '.png,.jpg';
					break;
					case 'software':
					break;
					case 'text':
					break;
					case 'video':
						fileTypesAccepted = '.mp4';
					break;
					case 'videogame':
					break;
				}
			// }
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							displayMediumTypeIcon +
							`<span class="mediumDatasets`+mediumType+`ListName">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat__user-log">
									<i class="fas fa-user"></i>
								</div>
								<form action="/TIMAAT/api/medium/`+mediumType+`/`+this.model.id+`/upload" method="post" enctype="multipart/form-data">
									<input name="file" accept="`+fileTypesAccepted+`" class="mediumUploadFile d-none" type="file" />
									<button type="submit" title="Upload `+mediumType+`" class="btn btn-outline btn-primary btn-sm mediumDatasetsMediumUploadButton float-left"><i class="fas fa-upload"></i></button>
								</form>
								<button type="button" title="Annotate `+mediumType+`" class="btn btn-outline-success btn-sm btn-block mediumDatasetsMediumAnnotateButton"><i class="fas fa-draw-polygon"></i></button>
						  </div>
						</div>
					</div>
				</li>`
			);

			// console.log("TCL: append me to list:", mediumType);
			// $('#mediumDatasets'+mediumType+'List').append(this.listView);
			var medium = this; // save medium for system events

			// attach video upload functionality
			// upload button click triggers file selection
			this.listView.find('.mediumDatasetsMediumUploadButton').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
				medium.listView.find('.mediumUploadFile').click();
			});

			// user selected file, trigger form submit / upload
			this.listView.find('.mediumUploadFile').on('change', function(ev) {
				let fileList = medium.listView.find('.mediumUploadFile')[0].files;
				if ( fileList.length  > 0 ) TIMAAT.UploadManager.queueUpload(medium.model, medium.listView.find('form'));
			});

			this.updateUI();

			// attach user log info
			this.listView.find('.timaat__user-log').popover({
				placement: 'right',
				title: '<i class="fas fa-user"></i> editing log',
				trigger: 'click',
				html: true,
				content: '<div class="userLogDetails">Loading ...</div>',
				container: 'body',
				boundary: 'viewport',
			});

			this.listView.find('.timaat__user-log').on('show.bs.popover', function () {
				TIMAAT.UI.hidePopups();
			});

			this.listView.find('.timaat__user-log').on('inserted.bs.popover', function () {
				if (medium.model.lastEditedAt == null) {
					$('.userLogDetails').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+medium.model.createdByUserAccountId+'">[ID '+medium.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(medium.model.createdAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.userLogDetails').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+medium.model.createdByUserAccountId+'">[ID '+medium.model.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(medium.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+medium.model.lastEditedByUserAccountId+'">[ID '+medium.model.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(medium.model.lastEditedAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat__user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});
		}

		updateUI() {
			// console.log("TCL: Medium -> updateUI -> updateUI()");
			// title
			var type = $('#mediumFormMetadata').data('type');
			var name = this.model.displayTitle.name;
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.mediumDatasets'+type+'ListName').html(name);
			if (type == 'medium') {
				this.listView.find('.mediumDatasetsAllMediaListMediumType').html(type);
			}

			if ( this.model.fileStatus == "noFile" && !TIMAAT.UploadManager.isUploading(this.model) ) {
				this.listView.find('.mediumDatasetsMediumUploadButton').show();
			} else {
				this.listView.find('.mediumDatasetsMediumUploadButton').hide();
			}

			if ( this.model.fileStatus != "noFile" && this.model.fileStatus != "unavailable" ) {
				this.listView.find('.mediumDatasetsMediumAnnotateButton').show();
			} else {
				this.listView.find('.mediumDatasetsMediumAnnotateButton').hide();
			}
		}

		remove() {
			// console.log("TCL: Medium -> remove -> remove()");
			// remove medium from UI
			this.listView.remove(); // TODO remove tags from medium_has_tags
			$('#mediumFormMetadata').data('medium', null);
		}

	}

}, window));
