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
		eventsLoaded: false,

		init: function() {
			this.initEvents();
		},

		initEventComponent: function() {
			// console.log("TCL: initEventComponent");
			if (!this.eventsLoaded) {
				this.setEventList();
			}
			if (TIMAAT.UI.component != 'events') {
				TIMAAT.UI.showComponent('events');
				$('#eventTab').trigger('click');
			}
		},

		initEvents: function() {
			// nav-bar functionality
			$('#eventTab').on('click', function(event) {
				TIMAAT.EventDatasets.loadEvents();
				TIMAAT.UI.displayComponent('event', 'eventTab', 'eventDataTable');
				TIMAAT.URLHistory.setURL(null, 'Event Datasets', '#event/list');
			});

			$('#eventTabMetadata').on('click', function(ev) {
				let event = $('#eventFormMetadata').data('event');
				// let type = event.model.eventType.eventTypeTranslations[0].type;
				let name = event.model.eventTranslations[0].name;
				let id = event.model.id;
				TIMAAT.UI.displayDataSetContentArea('eventFormMetadata');
				TIMAAT.UI.displayDataSetContent('dataSheet', event, 'event');
				// if ($('#eventFormMetadata').data('type') == 'event') {
					TIMAAT.URLHistory.setURL(null, name + ' · Datasets', '#event/' + id);
				// } else {
				// 	TIMAAT.URLHistory.setURL(null, name + ' · Datasets', '#event/' + type + '/' + id);
				// }
			});

			// delete event button (in form) handler
			$('#eventFormDataSheetDeleteButton').on('click', function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#eventDatasetsEventDeleteModal').data('event', $('#eventFormMetadata').data('event'));
				$('#eventDatasetsEventDeleteModal').modal('show');
			});

			// confirm delete event modal functionality
			$('#eventDatasetsEventDeleteModalSubmitButton').on('click', async function(ev) {
				var modal = $('#eventDatasetsEventDeleteModal');
				var event = modal.data('event');
				if (event) {
					try {
						await TIMAAT.EventDatasets._eventRemoved(event);
					} catch (error) {
						console.error("ERROR: ", error);
					}
					try {
						await TIMAAT.UI.refreshDataTable('event');
					} catch (error) {
						console.error("ERROR: ", error);
					}
				}
				modal.modal('hide');
				TIMAAT.UI.hideDataSetContentContainer();
				// if ( $('#eventFormMetadata').data('type') == 'event') {
					// TIMAAT.EventDatasets.loadEvents();
					$('#eventTab').trigger('click');
				// } else {
				// 	TIMAAT.EventDatasets.loadEventSubtype(type);
				// }
			});

			// edit content form button handler
			$('#eventFormDataSheetEditButton').on('click', function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				let event = $('#eventFormMetadata').data('event');
				switch (TIMAAT.UI.subNavTab) {
					default:
						TIMAAT.UI.displayDataSetContent('dataSheet', event, 'event', 'edit');
					break;
				}
				// event.listView.find('.eventDatasetsEventListTags').popover('show');
			});

			// event form handlers
			// submit event metadata button functionality
			$('#eventFormMetadataSubmitButton').on('click', async function(ev) {
				// continue only if client side validation has passed
				ev.preventDefault();
				if (!$('#eventFormMetadata').valid()) return false;

				// the event model (in case of editing an existing event)
				var event = $('#eventFormMetadata').data('event');
				// console.log("TCL: event", event);

				// create/Edit event window submitted data
				var formDataRaw = $('#eventFormMetadata').serializeArray();
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
					$('#eventFormMetadata').data('event', event);
					$('#eventTabMetadata').trigger('click');
				}
				$('.addEventButton').prop('disabled', false);
				$('.addEventButton :input').prop('disabled', false);
				$('.addEventButton').show();
				await TIMAAT.UI.refreshDataTable('event');
				// TIMAAT.UI.addSelectedClassToSelectedItem('event', event.model.id);
				TIMAAT.UI.displayDataSetContent('dataSheet', event, 'event');
			});

			// cancel add/edit button in content form functionality
			$('#eventFormMetadataDismissButton').on('click', async function(event) {
				$('.addEventButton').prop('disabled', false);
				$('.addEventButton :input').prop('disabled', false);
				$('.addEventButton').show();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

			// tag button handler
			$('#eventFormMetadataTagButton').on('click', async function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				var modal = $('#eventDatasetsEventTagsModal');
				modal.data('event', $('#eventFormMetadata').data('event'));
				var event = modal.data('event');
				modal.find('.modal-body').html(`
					<form role="form" id="eventTagsModalForm">
						<div class="form-group">
							<label for="eventTagsMultiSelectDropdown">Event tags</label>
							<div class="col-md-12">
								<select class="form-control form-control-md multi-select-dropdown"
												style="width:100%;"
												id="eventTagsMultiSelectDropdown"
												name="tagId"
												data-role="tagId"
												data-placeholder="Select event tags"
												multiple="multiple">
								</select>
							</div>
						</div>`+
					`</form>`);
        $('#eventTagsMultiSelectDropdown').select2({
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
						cache: false
					},
					minimumInputLength: 0,
				});
				await TIMAAT.EventService.getTagList(event.model.id).then(function(data) {
					// console.log("TCL: then: data", data);
					var tagSelect = $('#eventTagsMultiSelectDropdown');
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
				$('#eventDatasetsEventTagsModal').modal('show');
			});

			// submit tag modal button functionality
			$('#eventDatasetsEventTagsModalSubmitButton').on('click', async function(ev) {
				ev.preventDefault();
				var modal = $('#eventDatasetsEventTagsModal');
				if (!$('#eventTagsModalForm').valid())
					return false;
				var event = modal.data('event');
        // console.log("TCL: event", event);
				var formDataRaw = $('#eventTagsModalForm').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
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
					// console.log("TCL: updatedEventModel", updatedEventModel);
					event.model.tags = updatedEventModel.tags;
				}
				$('#eventFormMetadata').data('event', event);
				modal.modal('hide');
			});

			// data table events
			$('#eventDatasetsEventTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

			// key press events
			$('#eventFormMetadataSubmitButton').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#eventFormMetadataSubmitButton').trigger('click');
				}
			});

			$('#eventFormMetadataDismissButton').on('keypress', function(event) {
				event.stopPropagation();
				if (event.which == '13') { // == enter
					$('#eventFormMetadataDismissButton').trigger('click');
				}
			});

		},

		load: function() {
			this.loadEvents();
		},

		loadEvents: function() {
			TIMAAT.UI.addSelectedClassToSelectedItem('event', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
		},

		loadEventDataTables: async function() {
			this.setupEventDataTable();
		},

		setEventList: function() {
    	// console.log("TCL: events", events);
			if ( this.events == null ) return;

			// set ajax data source
			if ( this.dataTableEvent ) {
				// this.dataTableEvent.ajax.url('/TIMAAT/api/event/list');
				this.dataTableEvent.ajax.reload(null, false);
				TIMAAT.UI.clearLastSelection('event');
			}
			this.eventsLoaded = true;
		},

		addEvent: function() {
    	// console.log("TCL: addEvent: function()");
			TIMAAT.UI.displayDataSetContentContainer('eventTabMetadata', 'eventFormMetadata');
			$('.addEventButton').hide();
			$('.addEventButton').prop('disabled', true);
			$('.addEventButton :input').prop('disabled', true);
			$('#eventFormMetadata').data('event', null);
			eventFormMetadataValidator.resetForm();

			TIMAAT.UI.addSelectedClassToSelectedItem('event', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
			$('#eventFormMetadata').trigger('reset');

			this.initFormDataSheetData();
			this.initEventFormDataForEdit();
			$('#eventFormMetadataSubmitButton').html('Add');
			$('#eventFormHeader').html("Add Event");
			// TODO event domain
			// TODO event type
		},

		eventFormDataSheet: async function(action, data) {
			// console.log("TCL: action, data", action, data);
			TIMAAT.UI.addSelectedClassToSelectedItem('event', data.model.id);
			$('#eventFormMetadata').trigger('reset');
			this.initFormDataSheetData();
			eventFormMetadataValidator.resetForm();

			if ( action == 'show') {
				$('#eventFormMetadata :input').prop('disabled', true);
				$('.formButtons').prop('disabled', false);
				$('.formButtons :input').prop('disabled', false);
				$('.formButtons').show();
				this.initFormForShow(data.model);
				$('#eventFormMetadataSubmitButton').hide();
				$('#eventFormMetadataDismissButton').hide();
				$('#eventFormHeader').html("Event Data Sheet (#"+ data.model.id+')');
			}
			else if (action == 'edit') {
				this.initEventFormDataForEdit();
				$('.addEventButton').hide();
				$('.addEventButton').prop('disabled', true);
				$('.addEventButton :input').prop('disabled', true);
				$('#eventFormMetadataSubmitButton').html("Save");
				$('#eventFormHeader').html("Edit Event");
			}

			// setup UI
			$('#eventDatasetsMetadataEventName').val(data.model.eventTranslations[0].name);
			$('#eventDatasetsMetadataEventDescription').val(data.model.eventTranslations[0].description);
			if (data.model.beganAt != null && !(isNaN(data.model.beganAt)))
				$('#eventDatasetsMetadataEventBeganAt').val(moment.utc(data.model.beganAt).format('YYYY-MM-DD'));
				else $('#eventDatasetsMetadataEventBeganAt').val('');
			if (data.model.endedAt != null && !(isNaN(data.endedAt)))
				$('#eventDatasetsMetadataEventEndedAt').val(moment.utc(data.model.endedAt).format('YYYY-MM-DD'));
				else $('#eventDatasetsMetadataEventEndedAt').val('');

			$('#eventFormMetadata').data('event', data);
		},

		createEvent: async function(eventModel, eventTranslationModel) {
			// console.log("TCL: createEvent: async function(eventModel)", eventModel);
			try {
				// create event
				var newEventModel = await TIMAAT.EventService.createEvent(eventModel);
        // console.log("TCL: newEventModel", newEventModel);
			} catch(error) {
				console.error("ERROR: ", error);
			}

			try {
				// create event translation with event id
					var newEventModelTranslation = await TIMAAT.EventService.createEventTranslation(newEventModel, eventTranslationModel[0]); // TODO more than one translation?
					newEventModel.eventTranslations[0] = newEventModelTranslation;
			} catch(error) {
				console.error("ERROR: ", error);
			}

			return (newEventModel);
		},

		updateEvent: async function(event) {
			// console.log("TCL: updateEvent: async function: ", event);
				try {
					// update data that is part of event (includes updating last edited by/at)
					var tempEventModel = await TIMAAT.EventService.updateEvent(event.model);
					// event.model.displayName = tempDisplayName;
					var tempEventTranslationModel = await TIMAAT.EventService.updateEventTranslation(event.model);

					// console.log("TCL: tempEventModel", tempEventModel);
				} catch(error) {
					console.error("ERROR: ", error);
				}
		},

		updateEventHasTagsList: async function(eventModel, tagIdList) {
    	// console.log("TCL: eventModel, tagIdList", eventModel, tagIdList);
			try {
				var existingEventHasTagsEntries = await TIMAAT.EventService.getTagList(eventModel.id);
        // console.log("TCL: existingEventHasTagsEntries", existingEventHasTagsEntries);
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
              // console.log("TCL: deleteId", deleteId);
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
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							eventModel.tags.push(idsToCreate[i]);
							await TIMAAT.EventService.addTag(eventModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
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
			// console.log("TCL: event", event);
			// sync to server
			try {
				await TIMAAT.EventService.removeEvent(event);
			} catch (error) {
				console.error("ERROR: ", error);
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
			// console.log("TCL: eventModel", eventModel);
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

		initEventFormDataForEdit: function() {
			// setup form
			$('#eventDatasetsMetadataEventBeganAt').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#eventDatasetsMetadataEventEndedAt').datetimepicker({timepicker: false, changeMonth: true, changeYear: true, scrollInput: false, format: 'YYYY-MM-DD', yearStart: 1900, yearEnd: new Date().getFullYear()});
			$('#eventFormMetadata :input').prop('disabled', false);
			this.hideFormButtons();
			$('#eventFormMetadataSubmitButton').show();
			$('#eventFormMetadataDismissButton').show();
			$('#eventDatasetsMetadataEventName').focus();
		},

		initFormForShow: function (model) {
			$('.eventFormDataSheetEditButton').prop('disabled', false);
			$('.eventFormDataSheetEditButton :input').prop('disabled', false);
			$('.eventFormDataSheetEditButton').show();
		},

		initFormDataSheetData: function(type) {
			$('.dataSheetData').hide();
			$('.eventData').show();
		},

		hideFormButtons: function() {
			$('.formButtons').hide();
			$('.formButtons').prop('disabled', true);
			$('.formButtons :input').prop('disabled', true);
		},

		setupEventDataTable: function() {
			// console.log("TCL: setupDataTable");
			// setup dataTable
			this.dataTableEvent = $('#eventDatasetsEventTable').DataTable({
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
						return data.data; // data.map(event => new TIMAAT.Event(event));
					}
				},
				"initComplete": async function( settings, json ) {
					TIMAAT.EventDatasets.dataTableEvent.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let index = i+1;
							let position = $('table tbody > tr:nth-child('+index+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
				"rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedEventId) {
						TIMAAT.UI.clearLastSelection('event');
						$(row).addClass('selected');
						TIMAAT.UI.selectedEventId = data.id; //* as it is set to null in clearLastSelection
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
						TIMAAT.EventDatasets.setDataTableOnItemSelect('event', event.id);
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

		setDataTableOnItemSelect(type, previousEventId) {
			// show tag editor - trigger popup
			TIMAAT.UI.hidePopups();
			switch (TIMAAT.UI.subNavTab) {
				case 'dataSheet':
					TIMAAT.UI.displayDataSetContentContainer('eventDataTab', 'eventFormMetadata', 'event');
				break;
			}
			TIMAAT.UI.clearLastSelection('event');
			let index;
			let selectedEvent;
			switch (type) {
				case 'event':
					index = this.events.findIndex(({model}) => model.id === previousEventId);
					selectedEvent = this.events[index];
				break;
			}
			// TIMAAT.UI.addSelectedClassToSelectedItem('event', previousEventId);
			$('#eventFormMetadata').data('event', selectedEvent);
			$('#eventFormMetadata').data('type', 'event');
			// if (type == 'event') {
				TIMAAT.URLHistory.setURL(null, selectedEvent.model.eventTranslations[0].name + ' · Datasets', '#event/' + selectedEvent.model.id);
				// type = selectedActor.model.actorType.actorTypeTranslations[0].type;
			// } else {
			// 	TIMAAT.URLHistory.setURL(null, selectedActor.model.displayName.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#actor/' + type + '/' + selectedActor.model.id);
			// }
			TIMAAT.UI.displayDataSetContent(TIMAAT.UI.subNavTab, selectedEvent, 'event');
		},

	}
}, window));
