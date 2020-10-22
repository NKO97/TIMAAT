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
	
	TIMAAT.LocationType = class LocationType {
		constructor(model) {
		      // console.log("TCL: LocationType -> constructor -> model", model)
					// setup model
					this.model = model;
					// model.ui = this;

					// create and style list view element
					var deleteLocationTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-locationtype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
					if ( model.id < 0 ) deleteLocationTypeButton = '';
					this.listView = $('<li class="list-group-item"> '
						+ deleteLocationTypeButton +
						'<span class="timaat-locationtype-list-type"></span>' +
						'<br> \
						<div class="timaat-locationtype-list-count text-muted float-left"></div> \
						</li>'
					);

					$('#timaat-locationtype-list').append(this.listView);
					this.updateUI();      
					var locationType = this; // save locationType for system locationTypes

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
						// console.log("TCL: Locationtype -> constructor -> Display Bearbeitungslog");
						if (locationtype.model.lastEditedAt == null) {
							$('.timaat-user-log-details').html(
								'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+locationtype.model.createdByUserAccount.id+'">[ID '+locationtype.model.createdByUserAccount.id+']</span></b><br>\
								'+TIMAAT.Util.formatDate(locationtype.model.createdAt)+'<br>'
							);
							$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
						} else {
							$('.timaat-user-log-details').html(
									'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+locationtype.model.createdByUserAccount.id+'">[ID '+locationtype.model.createdByUserAccount.id+']</span></b><br>\
									'+TIMAAT.Util.formatDate(locationtype.model.createdAt)+'<br>\
									<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+locationtype.model.lastEditedByUserAccount.id+'">[ID '+locationtype.model.lastEditedByUserAccount.id+']</span></b><br>\
									'+TIMAAT.Util.formatDate(locationtype.model.lastEditedAt)+'<br>'
							);
							$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
						}
					});

					// attach user log info
					this.listView.find('.timaat-user-log').on('click', function(ev) {
						ev.preventDefault();
						ev.stopPropagation();
					});

					// attach locationType handlers
					$(this.listView).on('dblclick', this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();				
						// show metadata editor
						$('#timaat-locationdatasets-locationtype-meta').data('locationType', locationType);
						$('#timaat-locationdatasets-locationtype-meta').modal('show');			
					});

					// remove handler
					this.listView.find('.timaat-locationtype-remove').on('click', this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();				
						$('#timaat-locationdatasets-locationtype-delete').data('locationType', locationType);
						$('#timaat-locationdatasets-locationtype-delete').modal('show');
					});
				}

				updateUI() {
					// console.log("TCL: Locationtype -> updateUI -> updateUI() -> model", this.model);
					// title
					var type = this.model.locationTypeTranslations[0].type;
					if ( this.model.id < 0 ) type = "[nicht zugeordnet]";
					this.listView.find('.timaat-locationtype-list-name').text(type);
				}

				remove() {
		      // console.log("TCL: Locationtype -> remove -> remove()");
					// remove locationType from UI
					this.listView.remove(); // TODO remove tags from location_type_has_tags
					// remove from locationType list
					var index = TIMAAT.LocationDatasets.locationTypes.indexOf(this);
					if (index > -1) TIMAAT.LocationDatasets.locationTypes.splice(index, 1);
					// remove from model list
					index = TIMAAT.LocationDatasets.locationTypes.model.indexOf(this);
					if (index > -1) TIMAAT.LocationDatasets.locationTypes.model.splice(index, 1);
				}
			}
	
}, window));
