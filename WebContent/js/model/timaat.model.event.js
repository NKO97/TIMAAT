/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
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
							`  <span class="eventDatasetsEventListName">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat__user-log">
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
				if (event.model.lastEditedAt == null) {
					$('.userLogDetails').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+event.model.createdByUserAccountId+'">[ID '+event.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(event.model.createdAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.userLogDetails').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+event.model.createdByUserAccountId+'">[ID '+event.model.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(event.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+event.model.lastEditedByUserAccountId+'">[ID '+event.model.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(event.model.lastEditedAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat__user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

		}

		updateUI() {
			// console.log("TCL: Event -> updateUI -> updateUI()");
			// title
			// console.log("TCL: Event -> updateUI -> this", this);
			var name = this.model.eventTranslations[0].name;
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.eventDatasetsEventListName').html(name);

			// tag count
			// var count = this.model.tags.length + " tags";
			// if ( this.model.tags.length == 0 ) count = "No tags";
			// if ( this.model.tags.length == 1 ) count = "one tag";
			// this.listView.find('.eventDatasetsEventListCount').text(count);
			// tags
			// this.listView.find('.eventDatasetsEventListTags i').attr('title', this.model.tags.length+" Tags");
			// if (this.model.tags.length == 0) this.listView.find('.eventDatasetsEventListTags i').attr('class','fas fa-tag dataset__no-tags');
			// else if (this.model.tags.length == 1) this.listView.find('.eventDatasetsEventListTags i').attr('class','fas fa-tag text-dark').attr('title', "one tag");
			// else this.listView.find('.eventDatasetsEventListTags i').attr('class','fas fa-tags text-dark');
		}

		remove() {
			// console.log("TCL: Event -> remove -> remove()");
			// remove event from UI
			this.listView.remove(); // TODO remove tags from event_has_tags
      // console.log("TCL: Event -> remove -> this", this);
			$('#eventFormMetadata').data('event', null);
		}
	}

}, window));
