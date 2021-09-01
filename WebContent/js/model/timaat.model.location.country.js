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
	
	TIMAAT.Country = class Country {
		constructor(model) {
			// console.log("TCL: Country -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteCountryButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-country-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCountryButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCountryButton +
				'<span class="timaat-country-list-name"></span>' +
				'<br>' +
				'<div class="timaat-country-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-country-list').append(this.listView);
			this.updateUI();      
			var country = this; // save country for system events

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
				// console.log("TCL: Country -> constructor -> country", country);
				if (country.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+country.model.location.location.location.createdByUserAccountId+'">[ID '+country.model.location.location.location.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(country.model.location.location.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+country.model.location.location.location.createdByUserAccountId+'">[ID '+country.model.location.location.location.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.location.location.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+country.model.location.location.location.lastEditedByUserAccountId+'">[ID '+country.model.location.location.location.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.location.location.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach country handlers
			$(this.listView).on('click', this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// country.listView.find('.timaat-country-list-tags').popover('show');
			});

			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-country-meta').data('country', country);
				$('#timaat-locationdatasets-country-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-country-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-country-delete').data('country', country);
				$('#timaat-locationdatasets-country-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Country -> updateUI -> updateUI()");
			// title
			// console.log("TCL: Country -> updateUI -> this", this);
			var name = this.model.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-country-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Country -> remove -> remove()");
			// remove country from UI
			this.listView.remove(); // TODO remove tags from country_has_tags
			// remove from country list
			var index = TIMAAT.LocationDatasets.countries.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.countries.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.countries.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.countries.model.splice(index, 1);
		}

	}
	
}, window));
