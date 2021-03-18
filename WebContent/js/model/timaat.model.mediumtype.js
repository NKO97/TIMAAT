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
	
	TIMAAT.MediumType = class MediumType {
		constructor(model) {
			// console.log("TCL: MediumType -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;

			// create and style list view element
			var deleteMediumTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-mediatype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteMediumTypeButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteMediumTypeButton +
				'<span class="timaat-mediatype-list-type"></span>' +
				'<br> \
				<div class="timaat-mediatype-list-count text-muted float-left"></div> \
				</li>'
			);

			$('#timaat-mediadatasets-mediumtype-list').append(this.listView);
			this.updateUI();      
			var MediumType = this; // save MediumType for system MediumTypes

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
				if (mediaType.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+mediaType.model.createdByUserAccount.id+'">[ID '+mediaType.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(mediaType.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+mediaType.model.createdByUserAccount.id+'">[ID '+mediaType.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediaType.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+mediaType.model.lastEditedByUserAccount.id+'">[ID '+mediaType.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediaType.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach MediumType handlers
			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-mediadatasets-mediumtype-meta').data('MediumType', MediumType);
				$('#timaat-mediadatasets-mediumtype-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-mediatype-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-mediumtype-delete').data('MediumType', MediumType);
				$('#timaat-mediadatasets-mediumtype-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: MediumType -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.mediaTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediatype-list-name').text(type);
		}

		remove() {
			console.log("TCL: MediumType -> remove -> remove()");
			// remove MediumType from UI
			this.listView.remove(); // TODO remove tags from medium_type_has_tags
			// remove from MediumType list
			var index = TIMAAT.MediumDatasets.mediaTypes.indexOf(this);
			if (index > -1) TIMAAT.MediumDatasets.mediaTypes.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediumDatasets.mediaTypes.model.indexOf(this);
			if (index > -1) TIMAAT.MediumDatasets.mediaTypes.model.splice(index, 1);
		}
	}
	
}, window));
