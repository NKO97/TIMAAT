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
	
	TIMAAT.Software = class Software {
		constructor(model) {
			// console.log("TCL: Software -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteSoftwareButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-mediadatasets-software-remove float-left" id="timaat-mediadatasets-software-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteSoftwareButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								deleteSoftwareButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-mediadatasets-software-list-name"></span>
							<br><br>
							<span class="timaat-mediadatasets-software-list-mediatype-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-mediadatasets-software-list').append(this.listView);
			this.updateUI();      
			var software = this; // save software for system events

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
				if (software.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+software.model.medium.createdByUserAccount.id+'">[ID '+software.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(software.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+software.model.medium.createdByUserAccount.id+'">[ID '+software.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(software.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+software.model.medium.lastEditedByUserAccount.id+'">[ID '+software.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(software.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach software handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Software -> constructor -> open software datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.media-nav-tabs').show();
				$('.media-data-tabs').hide();
				$('.software-data-tab').show();
				$('.title-data-tab').show();
				$('.nav-tabs a[href="#softwareDatasheet"]').focus();
				// make certain the current medium model matches the current software model
				var softwareMedium = new Object();
				softwareMedium.model = software.model.medium;
				$('#timaat-mediadatasets-media-metadata-form').data('medium', softwareMedium);
				$('#timaat-mediadatasets-media-metadata-form').data('software', software);
				TIMAAT.MediaDatasets.mediumFormDatasheet("show", "software", software);   				
				// software.listView.find('.timaat-mediadatasets-software-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-mediadatasets-software-remove').click(this, function(ev) {
      	console.log("TCL: Software -> constructor -> this.listView.find('.timaat-mediadatasets-software-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-software-delete').data('software', software);
				$('#timaat-mediadatasets-software-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Software -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediadatasets-software-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Software -> remove -> remove()");
			// remove software from UI
			this.listView.remove(); // TODO remove tags from software_has_tags
			// remove from software list
			var index = TIMAAT.MediaDatasets.softwares.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.softwares.splice(index, 1);
			// remove from model list
			var indexModel = TIMAAT.MediaDatasets.softwares.model.indexOf(this);
			if (indexModel > -1) TIMAAT.MediaDatasets.softwares.model.splice(index, 1);
		}

	}
	
}, window));
