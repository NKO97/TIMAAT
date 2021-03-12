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
	
	TIMAAT.Event = class Event {
		constructor(model) {
      // console.log("TCL: Event -> constructor -> model", model);
			// setup model
			this.model = model;

			// create and style list view element
			var displayEventTypeIcon = '  <i class="fas fa-calendar-alt"></i>'; // default event icon
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							displayEventTypeIcon +
							`  <span class="timaat-eventdatasets-event-list-name">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat-user-log" style="margin-left: 12px; margin-bottom: 10px;">
									<i class="fas fa-user"></i>							
								</div>
						  </div>
						</div>
					</div>
				</li>`
			);

			// console.log("TCL: Event -> constructor -> this.updateUI()");    
			var event = this; // save event for system events

			this.updateUI();  

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
				if (event.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+event.model.createdByUserAccount.id+'">[ID '+event.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(event.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+event.model.createdByUserAccount.id+'">[ID '+event.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(event.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+event.model.lastEditedByUserAccount.id+'">[ID '+event.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(event.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

		}

		updateUI() {
			// console.log("TCL: Event -> updateUI -> updateUI()");
			// title
			// console.log("TCL: Event -> updateUI -> this", this);
			var name = this.model.eventTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-eventdatasets-event-list-name').html(name);

			// tag count
			// var count = this.model.tags.length + " Tags";
			// if ( this.model.tags.length == 0 ) count = "keine Tags";
			// if ( this.model.tags.length == 1 ) count = "ein Tag";
			// this.listView.find('.timaat-eventdatasets-event-list-count').text(count);
			// tags
			// this.listView.find('.timaat-eventdatasets-event-list-tags i').attr('title', this.model.tags.length+" Tags");			
			// if (this.model.tags.length == 0) this.listView.find('.timaat-eventdatasets-event-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			// else if (this.model.tags.length == 1) this.listView.find('.timaat-eventdatasets-event-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			// else this.listView.find('.timaat-eventdatasets-event-list-tags i').attr('class','fas fa-tags text-dark');		
		}

		remove() {
			console.log("TCL: Event -> remove -> remove()");
			// remove event from UI
			this.listView.remove(); // TODO remove tags from event_has_tags
      // console.log("TCL: Event -> remove -> this", this);
			$('#event-metadata-form').data('event', null);
		}
	}
	
}, window));
