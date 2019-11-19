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
	
	TIMAAT.Image = class Image {
		constructor(model) {
			// console.log("TCL: Image -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteImageButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-mediadatasets-image-remove float-left" id="timaat-mediadatasets-image-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteImageButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								deleteImageButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-mediadatasets-image-list-name"></span>
							<br><br>
							<span class="timaat-mediadatasets-image-list-mediatype-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-mediadatasets-image-list').append(this.listView);
			this.updateUI();      
			var image = this; // save image for system events

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
				if (image.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+image.model.medium.createdByUserAccount.id+'">[ID '+image.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(image.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+image.model.medium.createdByUserAccount.id+'">[ID '+image.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(image.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+image.model.medium.lastEditedByUserAccount.id+'">[ID '+image.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(image.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach image handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Image -> constructor -> open image datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.media-nav-tabs').show();
				$('.media-data-tabs').hide();
				$('.image-data-tab').show();
				$('.title-data-tab').show();
				$('.nav-tabs a[href="#imageDatasheet"]').focus();
				// make certain the current medium model matches the current image model
				var imageMedium = new Object();
				imageMedium.model = image.model.medium;
				$('#timaat-mediadatasets-media-metadata-form').data('medium', imageMedium);
				$('#timaat-mediadatasets-media-metadata-form').data('image', image);
				TIMAAT.MediaDatasets.mediumFormDatasheet("show", "image", image);   			
				// image.listView.find('.timaat-mediadatasets-image-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-mediadatasets-image-remove').click(this, function(ev) {
      	console.log("TCL: Image -> constructor -> this.listView.find('.timaat-mediadatasets-image-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-image-delete').data('image', image);
				$('#timaat-mediadatasets-image-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Image -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediadatasets-image-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Image -> remove -> remove()");
			// remove image from UI
			this.listView.remove(); // TODO remove tags from image_has_tags
			// remove from image list
			var index = TIMAAT.MediaDatasets.images.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.images.splice(index, 1);
			// remove from model list
			var indexModel = TIMAAT.MediaDatasets.images.model.indexOf(this);
			if (indexModel > -1) TIMAAT.MediaDatasets.images.model.splice(index, 1);
		}

	}
	
}, window));
