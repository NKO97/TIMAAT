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
	
	TIMAAT.County = class County {
		constructor(model) {
			// console.log("TCL: County -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteCountyButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-county-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCountyButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCountyButton +
				'<span class="timaat-county-list-name"></span>' +
				'<br>' +
				'<div class="timaat-county-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-county-list').append(this.listView);
			this.updateUI();      
			var county = this; // save county for system events

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
				if (county.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+county.model.location.createdByUserAccountId+'">[ID '+county.model.location.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(county.model.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+county.model.location.createdByUserAccountId+'">[ID '+county.model.location.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(county.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+county.model.location.lastEditedByUserAccountId+'">[ID '+county.model.location.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(county.model.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach county handlers
			$(this.listView).on('click', this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// county.listView.find('.timaat-county-list-tags').popover('show');
			});

			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-county-meta').data('county', county);
				$('#timaat-locationdatasets-county-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-county-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-county-delete').data('county', county);
				$('#timaat-locationdatasets-county-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: County -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-county-list-name').text(name);
		}

		remove() {
			// console.log("TCL: County -> remove -> remove()");
			// remove county from UI
			this.listView.remove(); // TODO remove tags from county_has_tags
			// remove from county list
			var index = TIMAAT.LocationDatasets.counties.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.counties.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.counties.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.counties.model.splice(index, 1);
		}

	}
	
}, window));
