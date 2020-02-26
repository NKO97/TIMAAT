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
	
	TIMAAT.AddressType = class AddressType {
		constructor(model) {
			// console.log("TCL: AddressType -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;

			// create and style list view element
			var deleteAddressTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-addresstype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteAddressTypeButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteAddressTypeButton +
				'<span class="timaat-addresstype-list-type"></span>' +
				'<br> \
				<div class="timaat-addresstype-list-count text-muted float-left"></div> \
				</li>'
			);

			$('#timaat-actordatasets-addresstype-list').append(this.listView);
			this.updateUI();      
			var AddressType = this; // save AddressType for system AddressTypes

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
				if (addressType.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+addressType.model.createdByUserAccount.id+'">[ID '+addressType.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(addressType.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+addressType.model.createdByUserAccount.id+'">[ID '+addressType.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(addressType.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+addressType.model.lastEditedByUserAccount.id+'">[ID '+addressType.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(addressType.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach AddressType handlers
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-actordatasets-addresstype-meta').data('AddressType', AddressType);
				$('#timaat-actordatasets-addresstype-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-addresstype-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-actordatasets-addresstype-delete').data('AddressType', AddressType);
				$('#timaat-actordatasets-addresstype-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: AddressType -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.addressTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[nicht zugeordnet]";
			this.listView.find('.timaat-addresstype-list-name').text(type);
		}

		remove() {
			console.log("TCL: AddressType -> remove -> remove()");
			// remove AddressType from UI
			this.listView.remove();
			// remove from AddressType list
			var index = TIMAAT.ActorDatasets.addressTypes.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.addressTypes.splice(index, 1);
			// remove from model list
			index = TIMAAT.ActorDatasets.addressTypes.model.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.addressTypes.model.splice(index, 1);
		}
	}
	
}, window));
