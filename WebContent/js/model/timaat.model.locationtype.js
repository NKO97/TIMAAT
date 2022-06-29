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
					var deleteLocationTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm locationTypeRemoveButton float-left"><i class="fas fa-trash-alt"></i></button>';
					if ( model.id < 0 ) deleteLocationTypeButton = '';
					this.listView = $('<li class="list-group-item"> '
						+ deleteLocationTypeButton +
						'<span class="locationTypeListType"></span>' +
						'<br> \
						<div class="locationTypeListCount text-muted float-left"></div> \
						</li>'
					);

					$('#locationTypeList').append(this.listView);
					this.updateUI();
					var locationType = this; // save locationType for system locationTypes

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
						// console.log("TCL: LocationType -> constructor -> Display editing log");
						if (locationType.model.lastEditedAt == null) {
							$('.userLogDetails').html(
								'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+locationType.model.createdByUserAccountId+'">[ID '+locationType.model.createdByUserAccountId+']</span></b><br>\
								'+TIMAAT.Util.formatDate(locationType.model.createdAt)+'<br>'
							);
							$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
						} else {
							$('.userLogDetails').html(
									'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+locationType.model.createdByUserAccountId+'">[ID '+locationType.model.createdByUserAccountId+']</span></b><br>\
									'+TIMAAT.Util.formatDate(locationType.model.createdAt)+'<br>\
									<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+locationType.model.lastEditedByUserAccountId+'">[ID '+locationType.model.lastEditedByUserAccountId+']</span></b><br>\
									'+TIMAAT.Util.formatDate(locationType.model.lastEditedAt)+'<br>'
							);
							$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
						}
					});

					// attach user log info
					this.listView.find('.timaat__user-log').on('click', function(ev) {
						ev.preventDefault();
						ev.stopPropagation();
					});

					// attach locationType handlers
					$(this.listView).on('dblclick', this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();
						// show metadata editor
						$('#locationDatasetsLocationTypeMeta').data('locationType', locationType);
						$('#locationDatasetsLocationTypeMeta').modal('show');
					});

					// remove handler
					this.listView.find('.locationTypeRemoveButton').on('click', this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();
						$('#locationDatasetsLocationTypeDeleteModal').data('locationType', locationType);
						$('#locationDatasetsLocationTypeDeleteModal').modal('show');
					});
				}

				updateUI() {
					// console.log("TCL: LocationType -> updateUI -> updateUI() -> model", this.model);
					// title
					var type = this.model.locationTypeTranslations[0].type;
					if ( this.model.id < 0 ) type = "[not assigned]";
					this.listView.find('.locationTypeListName').text(type);
				}

				remove() {
		      // console.log("TCL: LocationType -> remove -> remove()");
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
