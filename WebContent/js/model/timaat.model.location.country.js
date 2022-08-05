/**
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

	TIMAAT.Country = class Country {
		constructor(model) {
			// console.log("TCL: Country -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteCountryButton = '<button type="button" class="btn btn-outline btn-danger btn-sm countryRemoveButton float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCountryButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCountryButton +
				'<span class="locationDatasetsCountryListName"></span>' +
				'<br>' +
				'<div class="locationDatasetsCountryListCount text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat__user-log"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#locationDatasetsCountryList').append(this.listView);
			this.updateUI();
			var country = this; // save country for system events

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
				// console.log("TCL: Country -> constructor -> country", country);
				if (country.model.location.lastEditedAt == null) {
					$('.userLogDetails').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+country.model.location.location.location.createdByUserAccountId+'">[ID '+country.model.location.location.location.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(country.model.location.location.location.createdAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.userLogDetails').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+country.model.location.location.location.createdByUserAccountId+'">[ID '+country.model.location.location.location.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.location.location.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+country.model.location.location.location.lastEditedByUserAccountId+'">[ID '+country.model.location.location.location.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(country.model.location.location.location.lastEditedAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat__user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach country handlers
			$(this.listView).on('click', this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				// country.listView.find('.locationDatasetsCountryListTags').popover('show');
			});

			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				// show metadata editor
				$('#locationDatasetsAddCountryModal').data('country', country);
				$('#locationDatasetsAddCountryModal').modal('show');
			});

			// remove handler
			this.listView.find('.countryRemoveButton').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#locationDatasetsDeleteCountryModal').data('country', country);
				$('#locationDatasetsDeleteCountryModal').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Country -> updateUI -> updateUI()");
			// title
			// console.log("TCL: Country -> updateUI -> this", this);
			var name = this.model.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.locationDatasetsCountryListName').text(name);
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
