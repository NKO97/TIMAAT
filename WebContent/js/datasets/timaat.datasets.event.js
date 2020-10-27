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
		lastForm: null,
		selectedId: null,

		init: function() {
			TIMAAT.EventDatasets.initEvents();
			$('.events-data-tabs').hide();
			$('.events-datatables').hide();
			$('.events-datatable').show();
		},

		initEventComponent: function() {
			console.log("TCL: initEventComponent");
				if (!TIMAAT.EventDatasets.eventsLoaded) {
					TIMAAT.EventDatasets.setEventList();
					TIMAAT.EventDatasets.eventsLoaded = true;
				}
				TIMAAT.UI.showComponent('events');
			},

		initEvents: function() {
				// console.log("TCL: EventDatasets: initEvents: function()");

			// nav-bar functionality
			$('#events-tab-event-metadata-form').on('click', function(event) {
				$('.form').hide();
				TIMAAT.EventDatasets.subNavTab = null;
				$('.nav-tabs a[href="#eventDatasheet"]').tab('show');
				TIMAAT.EventDatasets.eventFormDataSheet('show', $('#timaat-eventdatasets-metadata-form').data('event'));
			});

			// add event button functionality (in event list - opens datasheet form)
			$('#timaat-eventdatasets-event-add').on('click', function(event) {
				$('#timaat-eventdatasets-metadata-form').data('event', null);
				TIMAAT.EventDatasets.addEvent('event');
			});

			// delete event button (in form) handler
			$('#timaat-eventdatasets-metadata-form-delete').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-eventdatasets-event-delete').data('event', $('#timaat-eventdatasets-metadata-form').data('event'));
				$('#timaat-eventdatasets-event-delete').modal('show');
			});

			// confirm delete event modal functionality
			$('#timaat-eventdatasets-modal-delete-submit').on('click', async function(ev) {
				var modal = $('#timaat-eventdatasets-event-delete');
				var event = modal.data('event');
				if (event) {
					try {
						await TIMAAT.EventDatasets._eventRemoved(event);
					} catch (error) {
						console.log("error: ", error);
					}
					try {
						await TIMAAT.EventDatasets.refreshDataTable();
					} catch (error) {
						console.log("error: ", error);
					}
				}
				modal.modal('hide');
				$('#timaat-eventdatasets-metadata-form').hide();
				$('.events-data-tabs').hide();
				$('.form').hide();
			});

			// edit content form button handler
			$('#timaat-eventdatasets-metadata-form-edit').on('click', function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				TIMAAT.EventDatasets.eventFormDataSheet('edit',  $('#timaat-eventdatasets-metadata-form').data('event'));
				// event.listView.find('.timaat-eventdatasets-event-list-tags').popover('show');
			});
			
			// event form handlers
			// submit event metadata button functionality
			$('#timaat-eventdatasets-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-eventdatasets-metadata-form').valid()) return false;

				// the event model (in case of editing an existing event)
				var event = $('#timaat-eventdatasets-metadata-form').data('event');				
				// console.log("TCL: event", event);

				// create/Edit event window submitted data
				var formDataRaw = $('#timaat-eventdatasets-metadata-form').serializeArray();
				var formDataObject = {};
				$(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
				});
				var formDataSanitized = formDataObject;
				formDataSanitized.beganAt = moment.utc(formDataObject.beganAt, "YYYY-MM-DD");
				formDataSanitized.endedAt = moment.utc(formDataObject.endedAt, "YYYY-MM-DD");
				
        // console.log("TCL: formDataSanitized", formDataSanitized);
				
				if (event) { // update event
					// event data
					event.model = await TIMAAT.EventDatasets.updateEventModelData(event.model, formDataSanitized);
					await TIMAAT.EventDatasets.updateEvent(event);
				} else { // create new event
					var eventModel = await TIMAAT.EventDatasets.createEventModel(formDataSanitized);
					var eventTranslationModel = await TIMAAT.EventDatasets.createEventTranslationModel(formDataSanitized);
					var newEvent = await TIMAAT.EventDatasets.createEvent(eventModel, eventTranslationModel);
					event = new TIMAAT.Event(newEvent);
					$('#timaat-eventdatasets-metadata-form').data('event', event);
				}
				await TIMAAT.EventDatasets.refreshDataTable();
				TIMAAT.EventDatasets.selectLastSelection(event.model.id);
				TIMAAT.EventDatasets.eventFormDataSheet('show', event);
			});

			// cancel add/edit button in content form functionality
			$('#timaat-eventdatasets-metadata-form-dismiss').on('click', function(event) {
				var event = $('#timaat-eventdatasets-metadata-form').data('event');
				if (event != null) {
					TIMAAT.EventDatasets.eventFormDataSheet('show', event);
				} else { // dismiss event creation
					$('.form').hide();
				}
			});

			// tag button handler
			$('#timaat-eventdatasets-metadata-form-tag').on('click', async function(event) {
				event.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#timaat-eventdatasets-event-tags');
				modal.data('event', $('#timaat-eventdatasets-metadata-form').data('event'));
				var event = modal.data('event');
				modal.find('.modal-body').html(`
					<form role="form" id="eventTagsModalForm">
						<div class="form-group">
							<label for="event-tags-multi-select-dropdown">Event tags</label>
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="event-tags-multi-select-dropdown"
												name="tagId"
												data-role="tagId"
												data-placeholder="Select event tags"
												multiple="multiple">
								</select>
							</div>
						</div>`+
					`</form>`);
        $('#event-tags-multi-select-dropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: true,
					allowClear: true,
					tags: true,
					tokenSeparators: [',', ' '],
					ajax: {
						url: 'api/tag/selectList/',
						type: 'GET',
						dataType: 'json',
						delay: 250,
						headers: {
							"Authorization": "Bearer "+TIMAAT.Service.token,
							"Content-Type": "application/json",
						},
						// additional parameters
						data: function(params) {
							return {
								search: params.term,
								page: params.page
							};          
						},
						processResults: function(data, params) {
							params.page = params.page || 1;
							return {
								results: data
							};
						},
						cache: true
					},
					minimumInputLength: 0,
				});
				await TIMAAT.EventService.getTagList(event.model.id).then(function(data) {
					console.log("TCL: then: data", data);
					var tagSelect = $('#event-tags-multi-select-dropdown');
					if (data.length > 0) {
						// create the options and append to Select2
						var i = 0;
						for (; i < data.length; i++) {
							var option = new Option(data[i].name, data[i].id, true, true);
							tagSelect.append(option).trigger('change');
						}
						// manually trigger the 'select2:select' event
						tagSelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					}
				});
				$('#timaat-eventdatasets-event-tags').modal('show');
			});

			// submit tag modal button functionality
			$('#timaat-eventdatasets-modal-tag-submit').on('click', async function(event) {
				event.preventDefault();
				var modal = $('#timaat-eventdatasets-event-tags');
				if (!$('#eventTagsModalForm').valid()) 
					return false;
				var event = modal.data('event');
        console.log("TCL: event", event);
				var formDataRaw = $('#eventTagsModalForm').serializeArray();
        console.log("TCL: formDataRaw", formDataRaw);
				var i = 0;
				var tagIdList = [];
				var newTagList = [];
				for (; i < formDataRaw.length; i++) {
					if (isNaN(Number(formDataRaw[i].value))) {
						newTagList.push( { id: 0, name: formDataRaw[i].value} ); // new tags that have to be added to the system first
					} else {
						tagIdList.push( {id: formDataRaw[i].value} );
					}
				}
				event.model = await TIMAAT.EventDatasets.updateEventHasTagsList(event.model, tagIdList);
				if (newTagList.length > 0) {
					var updatedEventModel = await TIMAAT.EventDatasets.createNewTagsAndAddToEvent(event.model, newTagList);
					console.log("TCL: updatedEventModel", updatedEventModel);
					event.model.tags = updatedEventModel.tags;
				}
				$('#timaat-eventdatasets-metadata-form').data('event', event);
				modal.modal('hide');
			});

			// key press events
			$('#timaat-eventdatasets-metadata-form-submit').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-eventdatasets-metadata-form-submit').trigger('click');
				}
			});

			$('#timaat-eventdatasets-metadata-form-dismiss').keypress(function(event) {
				event.stopPropagation();
				if (event.which == '13') {
					$('#timaat-eventdatasets-metadata-form-dismiss').trigger('click');
				}
			});
			
		},

		load: function() {
			TIMAAT.EventDatasets.loadEvents();
		},

		loadEvents: function() {
    	// console.log("TCL: loadEvents: function()");
			// load events
			$('.events-datatables').hide();
			$('.events-datatable').show();
			TIMAAT.EventDatasets.clearLastSelection();
		},

		loadEventDataTables: async function() {
			console.log("TCL: loadEventDataTables: async function()");
			TIMAAT.EventDatasets.setupEventDataTable();
		},
		
		setEventList: function(events) {
    	console.log("TCL: events", events);
			$('.form').hide();
			$('.events-data-tabs').hide();
			if ( TIMAAT.EventDatasets.events == null ) return;

			$('#timaat-eventdatasets-event-list-loader').remove();
			// clear old UI list
			$('#timaat-eventdatasets-event-list').empty();

			// set ajax data source
			if ( TIMAAT.EventDatasets.dataTableEvent ) {
				// TIMAAT.EventDatasets.dataTableEvent.ajax.url('/TIMAAT/api/event/list');
				TIMAAT.EventDatasets.dataTableEvent.ajax.reload(null, false);
			}	
		},
		
		addEvent: function() {	
    	// console.log("TCL: addEvent: function()");
			$('.form').hide();
			$('.events-data-tabs').hide();
			$('.nav-tabs a[href="#eventDatasheet"]').show();
			eventFormMetadataValidator.resetForm();

			$('#timaat-eventdatasets-metadata-form').trigger('reset');
			$('#timaat-eventdatasets-metadata-form').show();
			$('.datasheet-data').hide();
			$('.event-data').show();
			$('#timaat-eventdatasets-metadata-form-edit').hide();
      $('#timaat-eventdatasets-metadata-form-delete').hide();
      $('#timaat-eventdatasets-metadata-form-submit').html('Add');
      $('#timaat-eventdatasets-metadata-form-submit').show();
			$('#timaat-eventdatasets-metadata-form-dismiss').show();
			$('#timaat-eventdatasets-metadata-form :input').prop('disabled', false);
			$('#eventFormHeader').html("Add Event");

			$('#timaat-eventdatasets-metadata-event-name').focus();
			
			// setup form
			$('#timaat-eventdatasets-metadata-event-began-at').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#timaat-eventdatasets-metadata-event-ended-at').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			// TODO event domain
			// TODO event type
		},

		eventFormDataSheet: async function(action, eventData) {
			console.log("TCL: action, eventData", action, eventData);
			TIMAAT.EventDatasets.selectLastSelection(eventData.model.id);
			$('#timaat-eventdatasets-metadata-form').trigger('reset');
			$('.datasheet-data').hide();
			$('.event-data').show();
			eventFormMetadataValidator.resetForm();

			// show tabs

			$('.nav-tabs a[href="#eventDatasheet"]').focus();
			$('#timaat-eventdatasets-metadata-form').show();

			if ( action == 'show') {
				$('#timaat-eventdatasets-metadata-form :input').prop('disabled', true);
				$('#timaat-eventdatasets-metadata-form-tag').prop('disabled', false);
				$('#timaat-eventdatasets-metadata-form-tag :input').prop('disabled', false);
				$('#timaat-eventdatasets-metadata-form-tag').show();
				$('#timaat-eventdatasets-metadata-form-edit').prop('disabled', false);
				$('#timaat-eventdatasets-metadata-form-edit :input').prop('disabled', false);
				$('#timaat-eventdatasets-metadata-form-edit').show();
				$('#timaat-eventdatasets-metadata-form-delete').prop('disabled', false);
				$('#timaat-eventdatasets-metadata-form-delete :input').prop('disabled', false);
				$('#timaat-eventdatasets-metadata-form-delete').show();
				$('#timaat-eventdatasets-metadata-form-submit').hide();
				$('#timaat-eventdatasets-metadata-form-dismiss').hide();
				$('#eventFormHeader').html("Event Datasheet (#"+ eventData.model.id+')');
			}
			else if (action == 'edit') {
				$('.event-datasheet-form-submit').show();
				$('#timaat-eventdatasets-metadata-form :input').prop('disabled', false);
				$('#timaat-eventdatasets-metadata-event-began-at').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-eventdatasets-metadata-event-ended-at').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
				$('#timaat-eventdatasets-metadata-form-tag').hide();
				$('#timaat-eventdatasets-metadata-form-tag').prop('disabled', true);
				$('#timaat-eventdatasets-metadata-form-tag :input').prop('disabled', true);
				$('#timaat-eventdatasets-metadata-form-edit').hide();
				$('#timaat-eventdatasets-metadata-form-edit').prop('disabled', true);
				$('#timaat-eventdatasets-metadata-form-edit :input').prop('disabled', true);
				$('#timaat-eventdatasets-metadata-form-delete').hide();
				$('#timaat-eventdatasets-metadata-form-delete').prop('disabled', true);
				$('#timaat-eventdatasets-metadata-form-delete :input').prop('disabled', true);
				$('#timaat-eventdatasets-metadata-form-submit').html("Save");
				$('#timaat-eventdatasets-metadata-form-submit').show();
				$('#timaat-eventdatasets-metadata-form-dismiss').show();
				$('#eventFormHeader').html("Edit Event");
				$('#timaat-eventdatasets-metadata-event-name').focus();
			}

			// setup UI
			var data = eventData.model;
			// event data
			$('#timaat-eventdatasets-metadata-event-name').val(data.eventTranslations[0].name);
			$('#timaat-eventdatasets-metadata-event-description').val(data.eventTranslations[0].description);
			if (data.beganAt != null && !(isNaN(data.beganAt)))
				$('#timaat-eventdatasets-metadata-event-began-at').val(moment.utc(data.beganAt).format('YYYY-MM-DD'));
				else $('#timaat-eventdatasets-metadata-event-began-at').val('');
			if (data.endedAt != null && !(isNaN(data.endedAt)))
				$('#timaat-eventdatasets-metadata-event-ended-at').val(moment.utc(data.endedAt).format('YYYY-MM-DD'));
				else $('#timaat-eventdatasets-metadata-event-ended-at').val('');

			$('#timaat-eventdatasets-metadata-form').data('event', eventData);
		},

		createEvent: async function(eventModel, eventTranslationModel) {
			console.log("TCL: createEvent: async function(eventModel)", eventModel);
			try {
				// create event
				var tempEventModel = eventModel;
				var newEventModel = await TIMAAT.EventService.createEvent(tempEventModel);
        console.log("TCL: newEventModel", newEventModel);
			} catch(error) {
				console.log( "error: ", error);
			}

			try {
				// create event translation with event id
					var newEventModelTranslation = await TIMAAT.EventService.createEventTranslation(newEventModel, eventTranslationModel[0]); // TODO more than one translation?
					newEventModel.eventTranslations[0] = newEventModelTranslation;
			} catch(error) {
				console.log( "error: ", error);
			}

			return (newEventModel);
		},

		updateEvent: async function(event) {
			console.log("TCL: updateEvent: async function: ", event);
				try {
					// update data that is part of event (includes updating last edited by/at)
					var tempEventModel = await TIMAAT.EventService.updateEvent(event.model);
					// event.model.displayName = tempDisplayName;
					console.log("TCL: tempEventModel", tempEventModel);
				} catch(error) {
					console.log( "error: ", error);
				}
		},

		updateEventHasTagsList: async function(eventModel, tagIdList) {
    	console.log("TCL: eventModel, tagIdList", eventModel, tagIdList);
			try {
				var existingEventHasTagsEntries = await TIMAAT.EventService.getTagList(eventModel.id);
        console.log("TCL: existingEventHasTagsEntries", existingEventHasTagsEntries);
				if (tagIdList == null) { //* all entries will be deleted
					eventModel.tags = [];
					await TIMAAT.EventService.updateEvent(eventModel);
				} else if (existingEventHasTagsEntries.length == 0) { //* all entries will be added
					eventModel.tags = tagIdList;
					await TIMAAT.EventService.updateEvent(eventModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingEventHasTagsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < tagIdList.length; j++) {
							if (existingEventHasTagsEntries[i].id == tagIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingEventHasTagEntries but not in tagIdList
              console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingEventHasTagsEntries[i]);
							existingEventHasTagsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = eventModel.tags.findIndex(({id}) => id === entriesToDelete[i].id);
							eventModel.tags.splice(index,1);
							await TIMAAT.EventService.removeTag(eventModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing tags
					var idsToCreate = [];
          i = 0;
          for (; i < tagIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingEventHasTagsEntries.length; j++) {
              if (tagIdList[i].id == existingEventHasTagsEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = tagIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							eventModel.tags.push(idsToCreate[i]);
							await TIMAAT.EventService.addTag(eventModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.log( "error: ", error);
			}
			return eventModel;
		},

		createNewTagsAndAddToEvent: async function(eventModel, newTagList) {
			var i = 0;
			for (; i < newTagList.length; i++) {
				newTagList[i] = await TIMAAT.Service.createTag(newTagList[i].name);
				await TIMAAT.EventService.addTag(eventModel.id, newTagList[i].id);
				eventModel.tags.push(newTagList[i]);
			}
			return eventModel;
		},

		_eventRemoved: async function(event) {
			console.log("TCL: event", event);
			// sync to server
			try {
				await TIMAAT.EventService.removeEvent(event);
			} catch (error) {
				console.log("error: ", error);
			}
			event.remove();
		},

		updateEventModelData: function(eventModel, formDataObject) {
			// console.log("TCL: updateEventModelData: event, formDataObject", event, formDataObject);
			// event data
			eventModel.eventTranslations[0].name = formDataObject.name;
			eventModel.eventTranslations[0].description = formDataObject.description;
			eventModel.beganAt = formDataObject.beganAt;
			eventModel.endedAt = formDataObject.endedAt;
			console.log("TCL: eventModel", eventModel);
			return eventModel;
		},

		createEventModel: async function(formDataObject) {
			//  console.log("TCL: formDataObject", formDataObject);
			var model = {
				id: 0,
				beganAt: formDataObject.beganAt,
				endedAt: formDataObject.endedAt,
				eventTranslations: [],
				location: {
					id: 1 // TODO select correct location
				}
				// eventType: [],
				// eventDomain: [],
			};
			// console.log("TCL: eventModel", model);
			return model;
		},

		createEventTranslationModel: async function(formDataObject) {
			var model = [{
					id: 0,
					language: {
						id: 1 // TODO change to correct language
					},
					name: formDataObject.name,
					description: formDataObject.description
				}];
			return model;
		},

		setupEventDataTable: function() {
			console.log("TCL: setupDatatable");
			// setup datatable
			TIMAAT.EventDatasets.dataTableEvent = $('#timaat-eventdatasets-event-table').DataTable({
				"lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
				"order"         : [[ 0, 'asc' ]],
				"pagingType"    : "full", // "simple_numbers",
				"dom"           : '<lf<t>ip>',
				"processing"    : true,
				"stateSave"     : true,
				"scrollY"       : "60vh",
				"scrollCollapse": true,
				"scrollX"       : false,
				"rowId"					: 'id',
				"serverSide"    : true,
				"ajax"          : {
					"url"        : "api/event/list",
					"contentType": "application/json; charset=utf-8",
					"dataType"   : "json",
					"data"       : function(data) {
						let serverData = {
							draw   : data.draw,
							start  : data.start,
							length : data.length,
							orderby: data.columns[data.order[0].column].name,
							dir    : data.order[0].dir,
						}
						if ( data.search && data.search.value && data.search.value.length > 0 )
							serverData.search = data.search.value;
						return serverData;
					},
					"beforeSend": function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},
					"dataSrc": function(data) {
						// console.log("TCL: TIMAAT.EventDatasets.event (last)", TIMAAT.EventDatasets.event);
						// setup model
						var acts = Array();
						data.data.forEach(function(event) { 
							if ( event.id > 0 ) {
								acts.push(new TIMAAT.Event(event, 'event'));
							}
						});
						TIMAAT.EventDatasets.events = acts;
						TIMAAT.EventDatasets.events.model = data.data;
						// console.log("TCL: TIMAAT.EventDatasets.event (current)", TIMAAT.EventDatasets.event);
						return data.data; // data.map(event => new TIMAAT.Event(event));;
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.EventDatasets.selectedId) {
						TIMAAT.EventDatasets.clearLastSelection();
						$(row).addClass('selected');
					}
				},
				"createdRow": function(row, data, dataIndex) {
        	// console.log("TCL: row, data, dataIndex", row, data, dataIndex);
					let eventElement = $(row);
					let event = data;
					event.ui = eventElement;
					eventElement.data('event', event);

					eventElement.on('click', '.name', function(ev) {
						ev.stopPropagation();
						// show tag editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.UI.showComponent('events');
						$('.form').hide();
						$('.events-nav-tabs').show();
						$('.events-data-tabs').hide();
						var selectedEvent;
						var i = 0;
						for (; i < TIMAAT.EventDatasets.events.length; i++) {
							if (TIMAAT.EventDatasets.events[i].model.id == event.id) {
								selectedEvent = TIMAAT.EventDatasets.events[i];
								break;
							}
						}
						TIMAAT.EventDatasets.selectLastSelection(event.id);
            console.log("TCL: event", event);
						$('#timaat-eventdatasets-metadata-form').data('event', selectedEvent);
						if (TIMAAT.EventDatasets.subNavTab) {
							// console.log("TCL: TIMAAT.EventDatasets.subNavTab", TIMAAT.EventDatasets.subNavTab);
							// show tabs
							$('.event-data-tab').show();
							$('.nav-tabs a[href="#'+TIMAAT.EventDatasets.subNavTab+'"]').tab('show');
							TIMAAT.EventDatasets.showLastForm();
						} else {
							$('.nav-tabs a[href="#eventDatasheet"]').tab('show');
							TIMAAT.EventDatasets.eventFormDataSheet('show', selectedEvent);
						}
					});
				},
				"columns": [{
					data: 'id', name: 'name', className: 'name', render: function(data, type, event, meta) {
						// console.log("TCL: event", event);
						let nameDisplay = `<p>` + `  ` + event.eventTranslations[0].name +`</p>`;
						return nameDisplay;
					}
				}],
				"language": {
					"decimal"     : ",",
					"thousands"   : ".",
					"search"      : "Search",
					"lengthMenu"  : "Show _MENU_ entries",
					"zeroRecords" : "No events found.",
					"info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ events total)",
					"infoEmpty"   : "No events available.",
					"infoFiltered": "(&mdash; _TOTAL_ of _MAX_ events(s))",
					"paginate"    : {
						"first"   : "<<",
						"previous": "<",
						"next"    : ">",
						"last"    : ">>"
					},
				},				
			});				
		},

		selectLastSelection: function(id) {
			// console.log("TCL: selectLastSelection: id", id);
			// console.log("TCL: TIMAAT.EventDatasets.selectedId", TIMAAT.EventDatasets.selectedId);
			var table = TIMAAT.EventDatasets.dataTableEvent;
			// console.log("TCL: table", table);
			// remove selection from old rows
			if (TIMAAT.EventDatasets.selectedId && TIMAAT.EventDatasets.selectedId != id) {
				$(table.row('#'+TIMAAT.EventDatasets.selectedId).node()).removeClass('selected');
			}
			TIMAAT.EventDatasets.selectedId = id;
			// add selection to new rows
			$(table.row('#'+TIMAAT.EventDatasets.selectedId).node()).addClass('selected');
		},

		clearLastSelection: function () {
			$(TIMAAT.EventDatasets.dataTableEvent.row('#'+TIMAAT.EventDatasets.selectedId).node()).removeClass('selected');
			TIMAAT.EventDatasets.selectedId = null;
		},

		refreshDataTable: async function() {
			// console.log("TCL: refreshDataTable: ");
			// set ajax data source
			if (TIMAAT.EventDatasets.dataTableEvent) {
				TIMAAT.EventDatasets.dataTableEvent.ajax.reload(null, false);
			}	
		},

	}
}, window));
