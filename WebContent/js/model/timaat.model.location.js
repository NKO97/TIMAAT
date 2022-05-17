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

	TIMAAT.Location = class Location {
		constructor(model) {
		      // console.log("TCL: Location -> constructor -> model", model)
					// setup model
					this.model = model;

					// create and style list view element
					var deleteLocationButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-location-remove float-left"><i class="fas fa-trash-alt"></i></button>';
					if ( model.id < 0 ) deleteLocationButton = '';
					this.listView = $('<li class="list-group__item"> '
						+ deleteLocationButton +
						'<span class="timaat-location-list-name"></span>' +
						'<br> \
						<span class="timaat-location-list-locationtype-id"></span> \
						<div class="timaat-location-list-count text-muted float-left"></div> \
						<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
				 </li>'
					);

					$('#timaat-location-list').append(this.listView);
					this.updateUI();
					var location = this; // save location for system events

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
						// console.log("TCL: Location -> constructor -> location", location);
						if (location.model.lastEditedAt == null) {
							$('.timaat-user-log-details').html(
								'<b><i class="fas fa-plus-square"></i> Created by <span class="timaat-userId" data-userId="'+location.model.createdByUserAccountId+'">[ID '+location.model.createdByUserAccountId+']</span></b><br>\
								'+TIMAAT.Util.formatDate(location.model.createdAt)+'<br>'
							);
							$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
						} else {
							$('.timaat-user-log-details').html(
									'<b><i class="fas fa-plus-square"></i> Created by <span class="timaat-userId" data-userId="'+location.model.createdByUserAccountId+'">[ID '+location.model.createdByUserAccountId+']</span></b><br>\
									'+TIMAAT.Util.formatDate(location.model.createdAt)+'<br>\
									<b><i class="fas fa-edit"></i> Edited by <span class="timaat-userId" data-userId="'+location.model.lastEditedByUserAccountId+'">[ID '+location.model.lastEditedByUserAccountId+']</span></b><br>\
									'+TIMAAT.Util.formatDate(location.model.lastEditedAt)+'<br>'
							);
							$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
						}
					});

					// attach user log info
					this.listView.find('.timaat-user-log').on('click', function(ev) {
						ev.preventDefault();
						ev.stopPropagation();
					});

					// attach location handlers
					$(this.listView).on('click', this, function(ev) {
						ev.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						// location.listView.find('.timaat-location-list-tags').popover('show');
					});

					$(this.listView).on('dblclick', this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();
						// show metadata editor
						$('#timaat-locationdatasets-location-meta').data('location', location);
						$('#timaat-locationdatasets-location-meta').modal('show');
					});

					// remove handler
					this.listView.find('.timaat-location-remove').on('click', this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();
						$('#timaat-locationdatasets-location-delete').data('location', location);
						$('#timaat-locationdatasets-location-delete').modal('show');
					});
				}

				updateUI() {
					// console.log("TCL: Location -> updateUI -> updateUI() -> model", this.model);
					// title
					var name = this.model.locationTranslations[0].name;
					var type = this.model.locationType.locationTypeTranslations[0].type;
					if ( this.model.id < 0 ) name = "[not assigned]";
					this.listView.find('.timaat-location-list-name').text(name);
					this.listView.find('.timaat-location-list-locationtype-id').html(type);
				}

				remove() {
		      // console.log("TCL: Location -> remove -> remove()");
					// remove location from UI
					this.listView.remove(); // TODO remove tags from location_has_tags
					// remove from location list
					var index = TIMAAT.LocationDatasets.locations.indexOf(this);
					if (index > -1) TIMAAT.LocationDatasets.locations.splice(index, 1);
					// remove from model list
					index = TIMAAT.LocationDatasets.locations.model.indexOf(this);
					if (index > -1) TIMAAT.LocationDatasets.locations.model.splice(index, 1);
				}
			}

}, window));
