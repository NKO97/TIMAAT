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

	TIMAAT.PhoneNumberType = class PhoneNumberType {
		constructor(model) {
			// console.log("TCL: PhoneNumberType -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;

			// create and style list view element
			var deletePhoneNumberTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm phoneNumberTypeRemoveButton float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deletePhoneNumberTypeButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deletePhoneNumberTypeButton +
				'<span class="phoneNumberTypeListType"></span>' +
				'<br> \
				<div class="phoneNumberTypeListCount text-muted float-left"></div> \
				</li>'
			);

			$('#actorDatasetsPhoneNumberTypeList').append(this.listView);
			this.updateUI();
			var PhoneNumberType = this; // save PhoneNumberType for system PhoneNumberTypes

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
				if (phoneNumberType.model.lastEditedAt == null) {
					$('.userLogDetails').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+phoneNumberType.model.createdByUserAccountId+'">[ID '+phoneNumberType.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(phoneNumberType.model.createdAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.userLogDetails').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+phoneNumberType.model.createdByUserAccountId+'">[ID '+phoneNumberType.model.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(phoneNumberType.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+phoneNumberType.model.lastEditedByUserAccountId+'">[ID '+phoneNumberType.model.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(phoneNumberType.model.lastEditedAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat__user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach PhoneNumberType handlers
			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				// show metadata editor
				$('#actorDatasetsPhoneNumberTypeMetaModal').data('PhoneNumberType', PhoneNumberType);
				$('#actorDatasetsPhoneNumberTypeMetaModal').modal('show');
			});

			// remove handler
			this.listView.find('.phoneNumberTypeRemoveButton').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#actorDatasetsPhoneNumberTypeDeleteModal').data('PhoneNumberType', PhoneNumberType);
				$('#actorDatasetsPhoneNumberTypeDeleteModal').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: PhoneNumberType -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.phoneNumberTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[not assigned]";
			this.listView.find('.phoneNumberTypeListName').text(type);
		}

		remove() {
			// console.log("TCL: PhoneNumberType -> remove -> remove()");
			// remove PhoneNumberType from UI
			this.listView.remove();
			// remove from PhoneNumberType list
			var index = TIMAAT.ActorDatasets.phoneNumberTypes.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.phoneNumberTypes.splice(index, 1);
			// remove from model list
			index = TIMAAT.ActorDatasets.phoneNumberTypes.model.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.phoneNumberTypes.model.splice(index, 1);
		}
	}

}, window));
