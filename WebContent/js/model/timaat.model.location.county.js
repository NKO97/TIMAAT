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
			var deleteCountyButton = '<button type="button" class="btn btn-outline btn-danger btn-sm countyRemoveButton float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCountyButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCountyButton +
				'<span class="locationDatasetsCountyListName"></span>' +
				'<br>' +
				'<div class="locationDatasetsCountyListCount text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat__user-log"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#locationDatasetsCountyList').append(this.listView);
			this.updateUI();
			var county = this; // save county for system events

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
				if (county.model.location.lastEditedAt == null) {
					$('.userLogDetails').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+county.model.location.createdByUserAccountId+'">[ID '+county.model.location.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(county.model.location.createdAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.userLogDetails').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+county.model.location.createdByUserAccountId+'">[ID '+county.model.location.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(county.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+county.model.location.lastEditedByUserAccountId+'">[ID '+county.model.location.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(county.model.location.lastEditedAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat__user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach county handlers
			$(this.listView).on('click', this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				// county.listView.find('.locationDatasetsCountyListTags').popover('show');
			});

			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				// show metadata editor
				$('#locationDatasetsAddCountyModal').data('county', county);
				$('#locationDatasetsAddCountyModal').modal('show');
			});

			// remove handler
			this.listView.find('.countyRemoveButton').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#locationDatasetsDeleteCountyModal').data('county', county);
				$('#locationDatasetsDeleteCountyModal').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: County -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.locationDatasetsCountyListName').text(name);
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
