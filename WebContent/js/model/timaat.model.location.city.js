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
	
	TIMAAT.City = class City {
		constructor(model) {
			// console.log("TCL: City -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var deleteCityButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-city-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteCityButton = '';
			this.listView = $('<li class="list-group-item"> ' +
				deleteCityButton +
				'<span class="timaat-city-list-name"></span>' +
				'<br>' +
				'<div class="timaat-city-list-count text-muted float-left"></div>' +
				'<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div>' +
			'</li>'
			);

			$('#timaat-city-list').append(this.listView);
			this.updateUI();      
			var city = this; // save city for system events

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
				if (city.model.location.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+city.model.location.createdByUserAccount.id+'">[ID '+city.model.location.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(city.model.location.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+city.model.location.createdByUserAccount.id+'">[ID '+city.model.location.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(city.model.location.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+city.model.location.lastEditedByUserAccount.id+'">[ID '+city.model.location.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(city.model.location.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach city handlers
			$(this.listView).on('click', this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// city.listView.find('.timaat-city-list-tags').popover('show');
			});

			$(this.listView).on('dblclick', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-locationdatasets-city-meta').data('city', city);
				$('#timaat-locationdatasets-city-meta').modal('show');			
			});

			// remove handler
			this.listView.find('.timaat-city-remove').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-locationdatasets-city-delete').data('city', city);
				$('#timaat-locationdatasets-city-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: City -> updateUI -> updateUI()");
			// title
			var name = this.model.location.locationTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-city-list-name').text(name);
		}

		remove() {
			// console.log("TCL: City -> remove -> remove()");
			// remove city from UI
			this.listView.remove(); // TODO remove tags from city_has_tags
			// remove from city list
			var index = TIMAAT.LocationDatasets.cities.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.cities.splice(index, 1);
			// remove from model list
			index = TIMAAT.LocationDatasets.cities.model.indexOf(this);
			if (index > -1) TIMAAT.LocationDatasets.cities.model.splice(index, 1);
		}

	}
	
}, window));
