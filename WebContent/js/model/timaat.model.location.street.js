/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

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

	TIMAAT.Street = class Street {
		constructor(model) {
			// console.log("TCL: Street -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteStreetButton = '<button type="button" class="btn btn-outline btn-danger btn-sm streetRemoveButton float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteStreetButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteStreetButton +
				'<span class="locationDatasetsStreetListName"></span>' +
				'<br>' +
				'<div class="locationDatasetsStreetListCount text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat__user-log"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#locationDatasetsStreetList').append(this.listView);
			this.updateUI();
			var street = this; // save street for system events

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
				if (street.model.location.lastEditedAt == null) {
					$('.userLogDetails').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+street.model.location.createdByUserAccountId+'">[ID '+street.model.location.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(street.model.location.createdAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.userLogDetails').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+street.model.location.createdByUserAccountId+'">[ID '+street.model.location.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(street.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+street.model.location.lastEditedByUserAccountId+'">[ID '+street.model.location.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(street.model.location.lastEditedAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat__user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach street handlers
			$(this.listView).on('click', this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				// street.listView.find('.locationDatasetsStreetListTags').popover('show');
			});

			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				// show metadata editor
				$('#locationDatasetsAddStreetModal').data('street', street);
				$('#locationDatasetsAddStreetModal').modal('show');
			});

			// remove handler
			this.listView.find('.streetRemoveButton').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#locationDatasetsDeleteStreetModal').data('street', street);
				$('#locationDatasetsDeleteStreetModal').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Street -> updateUI -> updateUI()");
			// title
			// var name = this.model.location.locationTranslations[0].name; // TODO reenable once working again
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.locationDatasetsStreetListName').text(name);
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
