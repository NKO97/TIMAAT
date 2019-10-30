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
	
	TIMAAT.Title = class Title {
		constructor(model) {
			// console.log("TCL: Title -> constructor -> model", model)
			// setup model
      this.model = model;
      
      // create and style list view element
			var deleteTitleButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-mediadatasets-title-remove float-left" id="timaat-mediadatasets-title-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteTitleButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								deleteTitleButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-mediadatasets-title-list-name"></span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class=btn-group-vertical>
								<div class="text-muted timaat-user-log" style="margin-left: 12px; margin-bottom: 10px;">
									<i class="fas fa-user"></i>							
								</div>` +
						  `</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-mediadatasets-title-list').append(this.listView);
			this.updateUI();      
			var title = this; // save title for system events

			// attach title handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Title -> constructor -> open title datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				// $('#timaat-mediadatasets-title-metadata-tabs').show();
				// $('.nav-tabs a[href="#titleDatasheet"]').tab("show");
				$('.media-data-tabs').show();
				$('.nav-tabs a[href="#mediumTitles"]').show();
				$('.nav-tabs a[href="#mediumTitles"]').focus();
				$('#timaat-mediadatasets-medium-titles-form').data('title', title);
				TIMAAT.MediaDatasets.mediumFormTitles("show", title);
				// title.listView.find('.timaat-mediadatasets-title-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-mediadatasets-title-remove').click(this, function(ev) {
      	console.log("TCL: Title -> constructor -> this.listView.find('.timaat-mediadatasets-title-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-title-delete').data('title', title);
				$('#timaat-mediadatasets-title-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Title -> updateUI -> updateUI() -> model", this.model);
			// title
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediadatasets-title-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Title -> remove -> remove()");
			// remove title from UI
			this.listView.remove(); // TODO remove tags from title_has_tags
			// remove from title list
			var index = TIMAAT.MediaDatasets.titles.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.titles.splice(index, 1);
			// remove from model list
			// index = TIMAAT.MediaDatasets.titles.model.indexOf(this);
			// if (index > -1) TIMAAT.MediaDatasets.titles.model.splice(index, 1);
		}

	}
	
}, window));
