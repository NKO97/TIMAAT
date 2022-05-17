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

	TIMAAT.EmailAddressType = class EmailAddressType {
		constructor(model) {
			// console.log("TCL: EmailAddressType -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;

			// create and style list view element
			var deleteEmailAddressTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-emailaddresstype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteEmailAddressTypeButton = '';
			this.listView = $('<li class="list-group__item"> '
				+ deleteEmailAddressTypeButton +
				'<span class="timaat-emailaddresstype-list-type"></span>' +
				'<br> \
				<div class="timaat-emailaddresstype-list-count text-muted float-left"></div> \
				</li>'
			);

			$('#timaat-actordatasets-emailaddresstype-list').append(this.listView);
			this.updateUI();
			var EmailAddressType = this; // save EmailAddressType for system EmailAddressTypes

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
				if (emailAddressType.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="timaat-userId" data-userId="'+emailAddressType.model.createdByUserAccountId+'">[ID '+emailAddressType.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(emailAddressType.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="timaat-userId" data-userId="'+emailAddressType.model.createdByUserAccountId+'">[ID '+emailAddressType.model.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(emailAddressType.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="timaat-userId" data-userId="'+emailAddressType.model.lastEditedByUserAccountId+'">[ID '+emailAddressType.model.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(emailAddressType.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach EmailAddressType handlers
			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				// show metadata editor
				$('#timaat-actordatasets-emailaddresstype-meta').data('EmailAddressType', EmailAddressType);
				$('#timaat-actordatasets-emailaddresstype-meta').modal('show');
			});

			// remove handler
			this.listView.find('.timaat-emailaddresstype-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-actordatasets-emailaddresstype-delete').data('EmailAddressType', EmailAddressType);
				$('#timaat-actordatasets-emailaddresstype-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: EmailAddressType -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.emailAddressTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[not assigned]";
			this.listView.find('.timaat-emailaddresstype-list-name').text(type);
		}

		remove() {
			// console.log("TCL: EmailAddressType -> remove -> remove()");
			// remove EmailAddressType from UI
			this.listView.remove();
			// remove from EmailAddressType list
			var index = TIMAAT.ActorDatasets.emailAddressTypes.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.emailAddressTypes.splice(index, 1);
			// remove from model list
			index = TIMAAT.ActorDatasets.emailAddressTypes.model.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.emailAddressTypes.model.splice(index, 1);
		}
	}

}, window));
