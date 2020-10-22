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
			var deletePhoneNumberTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-phonenumbertype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deletePhoneNumberTypeButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deletePhoneNumberTypeButton +
				'<span class="timaat-phonenumbertype-list-type"></span>' +
				'<br> \
				<div class="timaat-phonenumbertype-list-count text-muted float-left"></div> \
				</li>'
			);

			$('#timaat-actordatasets-phonenumbertype-list').append(this.listView);
			this.updateUI();      
			var PhoneNumberType = this; // save PhoneNumberType for system PhoneNumberTypes

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
				if (phoneNumberType.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+phoneNumberType.model.createdByUserAccount.id+'">[ID '+phoneNumberType.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(phoneNumberType.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+phoneNumberType.model.createdByUserAccount.id+'">[ID '+phoneNumberType.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(phoneNumberType.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+phoneNumberType.model.lastEditedByUserAccount.id+'">[ID '+phoneNumberType.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(phoneNumberType.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach PhoneNumberType handlers
			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-actordatasets-phonenumbertype-meta').data('PhoneNumberType', PhoneNumberType);
				$('#timaat-actordatasets-phonenumbertype-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-phonenumbertype-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-actordatasets-phonenumbertype-delete').data('PhoneNumberType', PhoneNumberType);
				$('#timaat-actordatasets-phonenumbertype-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: PhoneNumberType -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.phoneNumberTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[nicht zugeordnet]";
			this.listView.find('.timaat-phonenumbertype-list-name').text(type);
		}

		remove() {
			console.log("TCL: PhoneNumberType -> remove -> remove()");
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
