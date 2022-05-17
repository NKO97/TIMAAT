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

	TIMAAT.Street = class Street {
		constructor(model) {
			// console.log("TCL: Street -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteStreetButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-street-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteStreetButton = '';
			this.listView = $('<li class="list-group__item"> ' +
				deleteStreetButton +
				'<span class="timaat-street-list-name"></span>' +
				'<br>' +
				'<div class="timaat-street-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-street-list').append(this.listView);
			this.updateUI();
			var street = this; // save street for system events

			// attach user log info
			this.listView.find('.timaat-user-log').popover({
				placement: 'right',
				title: '<i class="fas fa-user"></i> editing log',
				trigger: 'click',
				html: true,
				content: '<div class="timaat-user-log-details">Loading ...</div>',
				container: 'body',
				boundary: 'viewport',
			});

			this.listView.find('.timaat-user-log').on('show.bs.popover', function () {
				TIMAAT.UI.hidePopups();
			});

			this.listView.find('.timaat-user-log').on('inserted.bs.popover', function () {
				if (street.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="timaat-userId" data-userId="'+street.model.location.createdByUserAccountId+'">[ID '+street.model.location.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(street.model.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="timaat-userId" data-userId="'+street.model.location.createdByUserAccountId+'">[ID '+street.model.location.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(street.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="timaat-userId" data-userId="'+street.model.location.lastEditedByUserAccountId+'">[ID '+street.model.location.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(street.model.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach street handlers
			$(this.listView).on('click', this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				// street.listView.find('.timaat-street-list-tags').popover('show');
			});

			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				// show metadata editor
				$('#timaat-locationdatasets-street-meta').data('street', street);
				$('#timaat-locationdatasets-street-meta').modal('show');
			});

			// remove handler
			this.listView.find('.timaat-street-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-locationdatasets-street-delete').data('street', street);
				$('#timaat-locationdatasets-street-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Street -> updateUI -> updateUI()");
			// title
			// var name = this.model.location.locationTranslations[0].name; // TODO reenable once working again
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.timaat-street-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Street -> remove -> remove()");
			// remove street from UI
			this.listView.remove(); // TODO remove tags from street_has_tags
			// remove from street list
			var index = TIMAAT.LocationDatasets.streets.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.streets.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.streets.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.streets.model.splice(index, 1);
		}

	}

}, window));
