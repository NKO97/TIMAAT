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
	
	TIMAAT.EventDatasets = {
		events: null,

		init: function() {
			TIMAAT.EventDatasets.initEvents();
		},

		load: function() {
			TIMAAT.EventDatasets.loadEvents();
		},

		initEvents: function() {
			// console.log("TCL: EventDatasets: initEvents: function()");
			// attach tag editor
			$('#timaat-event-tags').popover({
				placement: 'right',
				title: 'Event Tags bearbeiten (datasets init function)',
				trigger: 'click',
				html: true,
				content: `<div class="input-group">
										<input class="form-control timaat-tag-input" type="text" value="">
									</div>`,
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-event-tags').on('inserted.bs.popover', function () {
				var tags = "";
				if ( event == null ) {
					$('.timaat-tag-input').html('Kein Event geladen');
					return;
				} else {
					$('.timaat-tag-input').html('');					
				}
				event.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Event Tag hinzufügen (datasets init function)',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.EventService.addEventTag(event, tag, function(newtag) {
			    			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.EventService.removeEventTag(event, tag, function(tagname) {
			    			// find tag in model
			    			var found = -1;
			    			TIMAAT.VideoPlayer.model.video.tags.forEach(function(item, index) {
			    				if ( item.name == tagname ) found = index;
			    			});
			    			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			    	}
			    });
			});
			$('#timaat-event-tags').on('hidden.bs.popover', function () { 
			});
			// delete event functionality
			$('#timaat-event-delete-submit').click(function(ev) {
				var modal = $('#timaat-eventdatasets-event-delete');
				var event = modal.data('event');
				if (event) TIMAAT.EventDatasets._eventRemoved(event);
				modal.modal('hide');
			});
			// add event button
			$('#timaat-event-add').attr('onclick','TIMAAT.EventDatasets.addEvent()');
			// add/edit event functionality
			$('#timaat-eventdatasets-event-meta').on('show.bs.modal', function (ev) {
				// console.log("TCL: Create/Edit event window setup");
				var modal = $(this);
				var event = modal.data('event');				
				var heading = (event) ? "Event bearbeiten" : "Event hinzufügen";
				var submit = (event) ? "Speichern" : "Hinzufügen";
				var name = (event) ? event.model.eventTranslations[0].name : "";
				var description = (event) ? event.model.eventTranslations[0].description : "";
				var beginsAtDate = (event) ? event.model.beginsAtDate : 0;
				var endsAtDate = (event) ? event.model.endsAtDate : 0;

				// console.log("TCL: beginsAtDate:", beginsAtDate);
				// var dateLocale = "en-US";
				// var dateOptions = {timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit'};
				// var beginsAt = new Date(beginsAtDate); 
        // console.log("TCL: beginsAt", beginsAt);
				// var mm = beginsAt.getMonth() + 1;
				// var dd = beginsAt.getDate();
				// var yyyy = beginsAt.getFullYear();
				// var beginsAtConverted = yyyy + '-' + mm + '-' + dd;
        // console.log("TCL: beginsAtConverted", beginsAtConverted);
				// var endsAt = new Date(endsAtDate);
				// var mm = endsAt.getMonth();
				// var dd = endsAt.getDate();
				// var yyyy = endsAt.getFullYear();
				// var endsAtConverted = yyyy + '-' + mm + '-' + dd;
				// var beginsAt = new Date(beginsAtDate);
				// beginsAt = beginsAt.toUTCString();
				// setup UI
				$('#eventMetaLabel').html(heading);
				$('#timaat-event-meta-submit').html(submit);
				$("#timaat-event-meta-name").val(name).trigger('input');
				$("#timaat-event-meta-start").val(Date(beginsAtDate)); // 1212-12-12
        console.log("TCL: initEvents -> beginsAtDate", beginsAtDate);
				$("#timaat-event-meta-end").val(Date(endsAtDate)); // 1212-12-12
				$("#timaat-event-meta-description").val(description);
			});
			// Submit event data
			$('#timaat-event-meta-submit').click(function(ev) {
				var modal = $('#timaat-eventdatasets-event-meta');
				var event = modal.data('event');
				var name = $("#timaat-event-meta-name").val();
				var description = $("#timaat-event-meta-description").val();
				var beginsAtDate = $("#timaat-event-meta-start").val();
				var endsAtDate = $("#timaat-event-meta-end").val();
				if (!beginsAtDate ) beginsAtDate = 0; // required with type="date" input format to ensure !null
				if (!endsAtDate ) endssAtDate = 0; // required with type="date" input format to ensure !null
				if (event) {
					event.model.eventTranslations[0].name = name;
					event.model.eventTranslations[0].description = description;
					event.model.beginsAtDate = beginsAtDate;
					event.model.endsAtDate = endsAtDate;
					event.updateUI(); // shouldn't be necessary as it will be called in the updateEvent(event) function again
					console.log("TCL: update event", event);
					TIMAAT.EventService.updateEvent(event);
					TIMAAT.EventService.updateEventTranslation(event);
				} else { // create new event
					var model = {
						id: 0,
						beginsAtDate: beginsAtDate,
						endsAtDate: endsAtDate,
						eventTranslations: [],
						tags: [],
					};
					var modelTranslation = {
						id: 0,
						name: name,
						description: description,
					};
					TIMAAT.EventService.createEvent(model, modelTranslation, TIMAAT.EventDatasets._eventAdded);
				}
				modal.modal('hide');
			});
			//  validate event data
			$('#timaat-event-meta-name').on('input', function(ev) {
				// console.log("TCL: allow saving only if data is valid");
				if ( $("#timaat-event-meta-name").val().length > 0 ) {
					$('#timaat-event-meta-submit').prop("disabled", false);
					$('#timaat-event-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-event-meta-submit').prop("disabled", true);
					$('#timaat-event-meta-submit').attr("disabled");
				}
			});
			// $('#timaat-event-meta-start').on('inputStart', function(ev) {
			// 	if ( $("#timaat-event-meta-start").val() != "" ) {
			// 		$('#timaat-event-meta-submit').prop("disabled", false);
			// 		$('#timaat-event-meta-submit').removeAttr("disabled");
			// 	} else {
			// 		$('#timaat-event-meta-submit').prop("disabled", true);
			// 		$('#timaat-event-meta-submit').attr("disabled");
			// 		}
			// });
			// $('#timaat-event-meta-end').on('input', function(ev) {
			// 	if ( $("#timaat-event-meta-end").val() >= $("#timaat-event-meta-start").val()) {
			// 		$('#timaat-event-meta-submit').prop("disabled", false);
			// 		$('#timaat-event-meta-submit').removeAttr("disabled");
			// 	} else {
			// 		$('#timaat-event-meta-submit').prop("disabled", true);
			// 		$('#timaat-event-meta-submit').attr("disabled");
			// 	}
			// });
		},

		loadEvents: function() {
    	// console.log("TCL: loadEvents: function()");
			// load events
			TIMAAT.EventService.listEvents(TIMAAT.EventDatasets.setEventLists);
		},
		
		setEventLists: function(events) {
    	// console.log("TCL: setEventLists: function(events)");
    	// console.log("TCL: events: ", events);
			if ( !events ) return;
			$('#timaat-event-list-loader').remove();
			// clear old UI list
			$('#timaat-event-list').empty();
			// setup model
			var evs = Array();
			events.forEach(function(event) { if ( event.id > 0 ) evs.push(new TIMAAT.Event(event)); });
			TIMAAT.EventDatasets.events = evs;
			TIMAAT.EventDatasets.events.model = events;			
		},
		
		addEvent: function() {	
    // console.log("TCL: addEvent: function()");
			$('#timaat-eventdatasets-event-meta').data('event', null);
			$('#timaat-eventdatasets-event-meta').modal('show');
		},

		_eventAdded: function(event) {
    	// console.log("TCL: _eventAdded: function(event)");
			TIMAAT.EventDatasets.events.model.push(event);
			TIMAAT.EventDatasets.events.push(new TIMAAT.Event(event));
			return event;
		},

		_eventRemoved: function(event) {
    console.log("TCL: _eventRemoved: function(event)");
    console.log("TCL: event", event);
			// sync to server
			TIMAAT.EventService.removeEvent(event);			
			event.remove();	
			// if ( TIMAAT.VideoPlayer.curEvent == event ) TIMAAT.VideoPlayer.setEvent(null);		
		}
	}
	
}, window));
