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
	
	TIMAAT.Videogame = class Videogame {
		constructor(model) {
			// console.log("TCL: Videogame -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteVideogameButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-mediadatasets-videogame-remove float-left" id="timaat-mediadatasets-videogame-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteVideogameButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								deleteVideogameButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-mediadatasets-videogame-list-name"></span>
							<br><br>
							<span class="timaat-mediadatasets-videogame-list-mediatype-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-mediadatasets-videogame-list').append(this.listView);
			this.updateUI();      
			var videogame = this; // save videogame for system events

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
				if (videogame.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+videogame.model.medium.createdByUserAccount.id+'">[ID '+videogame.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(videogame.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+videogame.model.medium.createdByUserAccount.id+'">[ID '+videogame.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(videogame.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+videogame.model.medium.lastEditedByUserAccount.id+'">[ID '+videogame.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(videogame.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach videogame handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Videogame -> constructor -> open videogame datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.media-nav-tabs').show();
				$('.media-data-tabs').hide();
				$('.videogame-data-tab').show();
				$('.title-data-tab').show();
				$('.nav-tabs a[href="#videogameDatasheet"]').focus();
				// make certain the current medium model matches the current videogame model
				var videogameMedium = new Object();
				videogameMedium.model = videogame.model.medium;
				$('#timaat-mediadatasets-media-metadata-form').data('medium', videogameMedium);
				$('#timaat-mediadatasets-media-metadata-form').data('videogame', videogame);
				TIMAAT.MediaDatasets.mediumFormDatasheet("show", "videogame", videogame);   			
				// videogame.listView.find('.timaat-mediadatasets-videogame-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-mediadatasets-videogame-remove').click(this, function(ev) {
      	console.log("TCL: Videogame -> constructor -> this.listView.find('.timaat-mediadatasets-videogame-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-videogame-delete').data('videogame', videogame);
				$('#timaat-mediadatasets-videogame-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Videogame -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-mediadatasets-videogame-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Videogame -> remove -> remove()");
			// remove videogame from UI
			this.listView.remove(); // TODO remove tags from videogame_has_tags
			// remove from videogame list
			var index = TIMAAT.MediaDatasets.videogames.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.videogames.splice(index, 1);
			// remove from model list
			var indexModel = TIMAAT.MediaDatasets.videogames.model.indexOf(this);
			if (indexModel > -1) TIMAAT.MediaDatasets.videogames.model.splice(index, 1);
		}

	}
	
}, window));
