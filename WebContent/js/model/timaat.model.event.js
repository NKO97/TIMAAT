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
		      // console.log("TCL: Event -> constructor -> model", model)
					// setup model
					this.model = model;
					// model.ui = this;
					// create and style list view element
					var deleteEvent = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-event-remove float-left"><i class="fas fa-trash-alt"></i></button>';
					if ( model.id < 0 ) deleteEvent = '';
					this.listView = $('<li class="list-group-item"> '
						+ deleteEvent +
						'<span class="timaat-event-list-name"></span>' +
						'<span class="text-nowrap timaat-event-list-tags float-right text-muted"><i class=""></i></span><br> \
						<span class="timaat-event-list-time"></span> \
						<div class="timaat-event-list-count text-muted float-left"></div> \
						<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
				 </li>'
					);
					$('#timaat-event-list').append(this.listView);
					// console.log("TCL: Event -> constructor -> this.updateUI()");
					this.updateUI();      
					var event = this; // save event for system events
					this.listView.find('.timaat-event-list-tags').popover({
						placement: 'right',
						title: 'Tags bearbeiten',
						trigger: 'manual',
						html: true,
						content: '<div class="input-group"><input class="form-control timaat-tag-input" type="text" value=""></div>',
						container: 'body',
						boundary: 'viewport',				
					});
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
		      console.log("TCL: Event -> constructor -> Display Bearbeitungslog");
						$('.timaat-user-log-details').html(
								'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+event.model.createdByUserAccount.id+'">[ID '+event.model.createdByUserAccount.id+']</span></b><br>\
								 '+TIMAAT.Util.formatDate(event.model.createdAt)+'<br>\
								 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+event.model.lastEditedByUserAccount.id+'">[ID '+event.model.lastEditedByUserAccount.id+']</span></b><br>\
								 '+TIMAAT.Util.formatDate(event.model.lastEditedAt)+'<br>'
						);
						$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
					});
					// attach tag editor
					this.listView.find('.timaat-event-list-tags').on('inserted.bs.popover', function () {
						var tags = "";
						event.model.tags.forEach(function(item) { tags += ','+item.name });
						tags = tags.substring(1);
						$('.timaat-tag-input').val(tags);
					    $('.timaat-tag-input').tagsInput({
					    	placeholder: 'Tag hinzufügen',
					    	onAddTag: function(taginput,tag) {
					    		TIMAAT.Service.addTag(event, tag, function(newtag) { // TODO addTag?
										event.model.tags.push(newtag);
										console.log("TCL: Event -> constructor -> event.updateUI() - onAddTag");
					    			event.updateUI();
					    		});
					    	},
					    	onRemoveTag: function(taginput,tag) {
					    		TIMAAT.Service.removeTag(event, tag, function(tagname) { // TODO removeTag?
					    			// find tag in model
					    			var found = -1;
					    			event.model.tags.forEach(function(item, index) {
					    				if ( item.name == tagname ) found = index;
					    			});
									if (found > -1) event.model.tags.splice(found, 1);
										console.log("TCL: Event -> constructor -> event.updateUI() - onRemoveTag");
					    			event.updateUI();
					    		});
					    	},
					    	onChange: function() {
					    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
					    	}
					    });
					});
					this.listView.find('.timaat-event-list-tags').on('hidden.bs.popover', function () { event.updateUI(); });
					this.listView.find('.timaat-event-list-tags').dblclick(function(ev) {ev.stopPropagation();});

					// attach user log info
					this.listView.find('.timaat-user-log').click(function(ev) {
						ev.preventDefault();
						ev.stopPropagation();
					});

					// attach event handlers
					$(this.listView).click(this, function(ev) {
						ev.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();				
						event.listView.find('.timaat-event-list-tags').popover('show');
					});
					$(this.listView).dblclick(this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();				
						// show metadata editor
						$('#timaat-eventdatasets-event-meta').data('event', event);
						$('#timaat-eventdatasets-event-meta').modal('show');			
					});			
					// remove handler
					this.listView.find('.timaat-event-remove').click(this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();				
						$('#timaat-eventdatasets-event-delete').data('event', event);
						$('#timaat-eventdatasets-event-delete').modal('show');
					});
				}

				updateUI() {
					// console.log("TCL: Event -> updateUI -> updateUI()");
					var name = this.model.eventTranslations[0].name;
					var beginsAt = new Date(this.model.beginsAtDate);
					var endsAt = new Date(this.model.endsAtDate);
					if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
					this.listView.find('.timaat-event-list-name').text(name);
					var dateLocale = "de-DE";
					var dateOptions = {timeZone: 'UTC', year: 'numeric', month: 'long', day: '2-digit'};
					this.listView.attr('data-beginsAtDate', beginsAt.toLocaleDateString(dateLocale, dateOptions));
					var eventDuration = " "+beginsAt.toLocaleDateString(dateLocale, dateOptions);
					if ( this.model.beginsAtDate != this.model.endsAtDate ) eventDuration += ' - '+endsAt.toLocaleDateString(dateLocale, dateOptions);
					this.listView.find('.timaat-event-list-time').html(eventDuration);	
					// tag count
					// var count = this.model.tags.length + " Tags";
					// if ( this.model.tags.length == 0 ) count = "keine Tags";
					// if ( this.model.tags.length == 1 ) count = "ein Tag";
					// this.listView.find('.timaat-event-list-count').text(count);
					// tags
					this.listView.find('.timaat-event-list-tags i').attr('title', this.model.tags.length+" Tags");			
					if (this.model.tags.length == 0) this.listView.find('.timaat-event-list-tags i').attr('class','fas fa-tag timaat-no-tags');
					else if (this.model.tags.length == 1) this.listView.find('.timaat-event-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
					else this.listView.find('.timaat-event-list-tags i').attr('class','fas fa-tags text-dark');		
				}

				remove() {
		      console.log("TCL: Event -> remove -> remove()");
					// remove event from UI
					this.listView.remove(); // TODO remove tags from event_has_tags
					// remove from event list
					var index = TIMAAT.EventDatasets.events.indexOf(this);
					if (index > -1) TIMAAT.EventDatasets.events.splice(index, 1);
					// remove from model list
					index = TIMAAT.EventDatasets.events.model.indexOf(this);
					if (index > -1) TIMAAT.EventDatasets.events.model.splice(index, 1);
				}
			}
	
}, window));
