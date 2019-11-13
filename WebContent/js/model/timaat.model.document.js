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
	
	TIMAAT.Document = class Document {
		constructor(model) {
			// console.log("TCL: Document -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteDocumentButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-document-remove float-left" id="timaat-mediadatasets-document-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteDocumentButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								deleteDocumentButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-mediadatasets-document-list-name"></span>
							<br><br>
							<span class="timaat-mediadatasets-document-list-mediatype-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-mediadatasets-document-list').append(this.listView);
			this.updateUI();      
			var mediumDocument = this; // save document for system events

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
				if (mediumDocument.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+mediumDocument.model.medium.createdByUserAccount.id+'">[ID '+mediumDocument.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(mediumDocument.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+mediumDocument.model.medium.createdByUserAccount.id+'">[ID '+mediumDocument.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediumDocument.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+mediumDocument.model.medium.lastEditedByUserAccount.id+'">[ID '+mediumDocument.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(mediumDocument.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach document handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Document -> constructor -> open document datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.media-nav-tabs').show();
				$('.media-data-tabs').hide();
				$('.document-data-tab').show();
				$('.title-data-tab').show();
				$('.nav-tabs a[href="#documentDatasheet"]').focus();
				// make certain the current medium model matches the current document model
				var documentMedium = new Object();
				documentMedium.model = mediumDocument.model.medium;
				$('#timaat-mediadatasets-media-metadata-form').data('medium', documentMedium);
				$('#timaat-mediadatasets-media-metadata-form').data('document', mediumDocument);
				TIMAAT.MediaDatasets.mediumFormDatasheet("show", "document", mediumDocument);   			
				// document.listView.find('.timaat-mediadatasets-document-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-mediadatasets-document-remove').click(this, function(ev) {
      	console.log("TCL: Document -> constructor -> this.listView.find('.timaat-mediadatasets-document-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-document-delete').data('document', mediumDocument);
				$('#timaat-mediadatasets-document-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Document -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediadatasets-document-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Document -> remove -> remove()");
			// remove document from UI
			this.listView.remove(); // TODO remove tags from document_has_tags
			// remove from document list
			var index = TIMAAT.MediaDatasets.documents.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.documents.splice(index, 1);
			// remove from model list
			var indexModel = TIMAAT.MediaDatasets.documents.model.indexOf(this);
			if (indexModel > -1) TIMAAT.MediaDatasets.documents.model.splice(index, 1);
		}

	}
	
}, window));
