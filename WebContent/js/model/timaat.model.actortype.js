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
	
	TIMAAT.ActorType = class ActorType {
		constructor(model) {
			// console.log("TCL: ActorType -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;

			// create and style list view element
			var deleteActorTypeButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-actortype-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteActorTypeButton = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteActorTypeButton +
				'<span class="timaat-actortype-list-type"></span>' +
				'<br> \
				<div class="timaat-actortype-list-count text-muted float-left"></div> \
				</li>'
			);

			$('#timaat-actordatasets-mediumtype-list').append(this.listView);
			this.updateUI();      
			var ActorType = this; // save ActorType for system ActorTypes

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
				if (actorType.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+actorType.model.createdByUserAccountId+'">[ID '+actorType.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(actorType.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+actorType.model.createdByUserAccountId+'">[ID '+actorType.model.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actorType.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+actorType.model.lastEditedByUserAccountId+'">[ID '+actorType.model.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actorType.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach ActorType handlers
			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-actordatasets-mediumtype-meta').data('ActorType', ActorType);
				$('#timaat-actordatasets-mediumtype-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-actortype-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-actordatasets-mediumtype-delete').data('ActorType', ActorType);
				$('#timaat-actordatasets-mediumtype-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: ActorType -> updateUI -> updateUI() -> model", this.model);
			// title
			var type = this.model.actorTypeTranslations[0].type;
			if ( this.model.id < 0 ) type = "[nicht zugeordnet]";
			this.listView.find('.timaat-actortype-list-name').text(type);
		}

		remove() {
			// console.log("TCL: ActorType -> remove -> remove()");
			// remove ActorType from UI
			this.listView.remove(); // TODO remove tags from medium_type_has_tags
			// remove from ActorType list
			var index = TIMAAT.ActorDatasets.actorTypes.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.actorTypes.splice(index, 1);
			// remove from model list
			index = TIMAAT.ActorDatasets.actorTypes.model.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.actorTypes.model.splice(index, 1);
		}
	}
	
}, window));
