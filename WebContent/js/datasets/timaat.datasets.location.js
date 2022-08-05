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

	TIMAAT.LocationDatasets = {
		locations: null,
		locationTypes: null,
		countries: null,
		provinces: null,
		counties: null,
		cities: null,
		streets: null,

		init: function() {
			TIMAAT.LocationDatasets.initLocations();
			TIMAAT.LocationDatasets.initLocationTypes();
			TIMAAT.LocationDatasets.initCountries();
			TIMAAT.LocationDatasets.initProvinces();
			TIMAAT.LocationDatasets.initCounties();
			TIMAAT.LocationDatasets.initCities();
			TIMAAT.LocationDatasets.initStreets();
		},

		initLocationTypes: function() {
			// delete locationType functionality
			$('#locationTypeDeleteSubmitButton').on('click', function(ev) {
				var modal = $('#locationDatasetsLocationTypeDeleteModal');
				var locationType = modal.data('locationType');
				if (locationType) TIMAAT.LocationDatasets._locationTypeRemoved(locationType);
				modal.modal('hide');
			});
			// add locationType button
			$('#locationTypeAdd').attr('onclick','TIMAAT.LocationDatasets.addLocationType()');
			// add/edit locationType functionality
			$('#locationDatasetsLocationTypeMeta').on('show.bs.modal', function (ev) {
				// Create/Edit locationType window setup
				var modal = $(this);
				var locationType = modal.data('locationType');
				var heading = (locationType) ? "Edit location type" : "Add location type";
				var submit = (locationType) ? "Save" : "Add";
				var type = (locationType) ? locationType.model.type : 0;
				// setup UI
				$('#locationTypeMetaLabel').html(heading);
				$('#locationTypeMetaSubmitButton').html(submit);
				$("#locationTypeMetaName").val(type).trigger('input');
			});
			// Submit locationType data
			$('#locationTypeMetaSubmitButton').on('click', function(ev) {
				// Create/Edit locationType window submitted data validation;
				var modal = $('#locationDatasetsLocationTypeMeta');
				var locationType = modal.data('locationType');
				var type = $("#locationTypeMetaName").val();

				if (locationType) {
					locationType.model.location.locationTypeTranslations[0].type = type;
					locationType.updateUI();
					TIMAAT.LocationService.updateLocationType(locationType);
					TIMAAT.LocationService.updateLocationTypeTranslation(locationType);
				} else { // create new locationType
					var model = {
						id: 0,
						locationTypeTranslations: [],
					};
					var modelTranslation = {
						id: 0,
						type: type,
					}
					TIMAAT.LocationService.createLocationType(model, modelTranslation, TIMAAT.LocationDatasets._locationTypeAdded); // TODO add locationType parameters
				}
				modal.modal('hide');
			});
			// validate locationType data
			// TODO validate all required fields
			$('#locationTypeMetaName').on('input', function(ev) {
				if ( $("#locationTypeMetaName").val().length > 0 ) {
					$('#locationTypeMetaSubmitButton').prop('disabled', false);
					$('#locationTypeMetaSubmitButton').removeAttr('disabled');
				} else {
					$('#locationTypeMetaSubmitButton').prop('disabled', true);
					$('#locationTypeMetaSubmitButton').attr('disabled');
				}
			});
		},

		initLocations: function() {
			// console.log("TCL: LocationDatasets: initLocations: function()");
			// delete location functionality
			$('#locationDatasetsDeleteLocationModalSubmitButton').on('click', function(ev) {
				var modal = $('#locationDatasetsDeleteLocationModal');
				var location = modal.data('location');
				if (location) TIMAAT.LocationDatasets._locationRemoved(location);
				modal.modal('hide');
			});
			// add location button
			$('#locationDatasetsAddLocationButton').attr('onclick','TIMAAT.LocationDatasets.addLocation()');
			// add/edit location functionality
			$('#locationDatasetsAddLocationModal').on('show.bs.modal', function (ev) {
				// Create/Edit location window setup
				var modal = $(this);
				var location = modal.data('location');
				var heading = (location) ? "Edit location" : "Add location";
				var submit = (location) ? "Save" : "Add";
				var name = (location) ? location.model.locationTranslations[0].name : "";
				var typeId = (location) ? location.model.locationType.id : "";

				// setup UI
				$('#locationMetaLabel').html(heading);
				$('#locationDatasetsAddLocationModalSubmitButton').html(submit);
				$("#locationName").val(name).trigger('input');
				$("#locationTypeId").val(typeId);
			});

			// Submit location data
			$('#locationDatasetsAddLocationModalSubmitButton').on('click', function(ev) {
				// Create/Edit location window submitted data validation
				var modal = $('#locationDatasetsAddLocationModal');
				var location = modal.data('location');
				var name = $("#locationName").val();
				var typeSelector = document.getElementById("locationTypeId");
				var typeId = Number(typeSelector.options[typeSelector.selectedIndex].value);

				if (location) {
					location.model.locationTranslations[0].name = name;
					location.model.locationType.id = typeId;
					location.updateUI();
					TIMAAT.LocationDatasets.updateLocation(location);
				} else { // create new location
					var model = {
						id: 0,
						locationType: {
							id: typeId,
						},
						locationTranslations: [],
					};
					// console.log("TCL: model", model);
					var modelTranslation = {
						id: 0,
						name: name,
					};
					// no callback should be required anymore
					// TIMAAT.LocationDatasets.createLocation(model, modelTranslation, TIMAAT.LocationDatasets._locationAdded);
					TIMAAT.LocationDatasets.createLocation(model, modelTranslation);
				}
				modal.modal('hide');
			});
			// validate location data
			// TODO: validate all required fields
			$('#locationName').on('input', function(ev) {
				if ( $("#locationName").val().length > 0) {
					$('#locationDatasetsAddLocationModalSubmitButton').prop('disabled', false);
					$('#locationDatasetsAddLocationModalSubmitButton').removeAttr('disabled');
				} else {
					$('#locationDatasetsAddLocationModalSubmitButton').prop('disabled', true);
					$('#locationDatasetsAddLocationModalSubmitButton').attr('disabled');
				}
			});
		},

		initCountries: function() {
			// console.log("TCL: LocationDatasets: initCountries: function()");
			// delete country functionality
			$('#locationDatasetsDeleteCountryModalSubmitButton').on('click', function(ev) {
				var modal = $('#locationDatasetsDeleteCountryModal');
				var country = modal.data('country');
				if (country) TIMAAT.LocationDatasets._locationSubtypeRemoved("country", country);
				modal.modal('hide');
			});

			// add country button
			$('#locationDatasetsAddCountryButton').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("country")');

			// add/edit country functionality
			$('#locationDatasetsAddCountryModal').on('show.bs.modal', function (ev) {
				// Create/Edit country window setup
				var modal = $(this);
				var country = modal.data('country');
				var heading = (country) ? "Edit country" : "Add country";
				var submit = (country) ? "Save" : "Add";
				// location data
				var name = (country) ? country.model.location.locationTranslations[0].name : "";
				// country data
				var internationalDialingPrefix = (country) ? country.model.internationalDialingPrefix : "";
				var trunkPrefix = (country) ? country.model.trunkPrefix : "";
				var countryCallingCode = (country) ? country.model.countryCallingCode : "";
				var timeZone = (country) ? country.model.timeZone : "";
				var daylightSavingTime = (country) ? country.model.daylightSavingTime : "";

				// setup UI
				$('#countryMetaLabel').html(heading);
				$('#countryMetadataSubmitButton').html(submit);
				// location data
				$("#countryMetadataName").val(name).trigger('input');
				// country data
				$("#countryMetadataIDP").val(internationalDialingPrefix);
				$("#countryMetadataTP").val(trunkPrefix);
				$("#countryMetadataCCC").val(countryCallingCode);
				$("#countryMetadataTZ").val(timeZone);
				$("#countryMetadataDST").val(daylightSavingTime);
			});

			// Submit country data
			$('#countryMetadataSubmitButton').on('click', function(ev) {
				// Create/Edit country window submitted data validation
				var modal = $('#locationDatasetsAddCountryModal');
				var country = modal.data('country');
				// location data
				var name = $("#countryMetadataName").val();
				// country data
				var internationalDialingPrefix = $("#countryMetadataIDP").val();
				var trunkPrefix = $("#countryMetadataTP").val();
				var countryCallingCode = $("#countryMetadataCCC").val();
				var timeZone = $("#countryMetadataTZ").val();
				var daylightSavingTime = $("#countryMetadataDST").val();

				if (country) {
					// location data
					country.model.location.locationTranslations[0].name = name;
					// country data
					country.model.internationalDialingPrefix = internationalDialingPrefix;
					country.model.trunkPrefix = trunkPrefix;
					country.model.countryCallingCode = countryCallingCode;
					country.model.timeZone = timeZone;
					country.model.daylightSavingTime = daylightSavingTime;

					country.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("country", country);
				} else {
					var model = {
						locationId: 0,
						internationalDialingPrefix: internationalDialingPrefix,
						trunkPrefix: trunkPrefix,
						countryCallingCode: countryCallingCode,
						timeZone: timeZone,
						daylightSavingTime: daylightSavingTime,
					};
					var location = {
							id: 0,
							locationType: {
								id: 1 // 1 = Country. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("country", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate country data
			// TODO validate all required fields
			$('#countryMetadataName').on('input', function(ev) {
				if ( $("#countryMetadataName").val().length > 0 ) {
					$('#countryMetadataSubmitButton').prop('disabled', false);
					$('#countryMetadataSubmitButton').removeAttr('disabled');
				} else {
					$('#countryMetadataSubmitButton').prop('disabled', true);
					$('#countryMetadataSubmitButton').attr('disabled');
				}
			});
		},

		initProvinces: function() {
			// console.log("TCL: LocationDatasets: initProvinces: function()");
			// delete province functionality
			$('#locationDatasetsDeleteProvinceModalSubmitButton').on('click', function(ev) {
				var modal = $('#locationDatasetsDeleteProvinceModal');
				var province = modal.data('province');
				if (province) TIMAAT.LocationDatasets._locationSubtypeRemoved("province", province);
				modal.modal('hide');
			});

			// add province button
			$('#locationDatasetsAddProvinceButton').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("province")');

			// add/edit province functionality
			$('#locationDatasetsAddProvinceModal').on('show.bs.modal', function (ev) {
				// Create/Edit province window setup
				var modal = $(this);
				var province = modal.data('province');
				var heading = (province) ? "Edit province" : "Add province";
				var submit = (province) ? "Save" : "Add";
				// location data
				var name = (province) ? province.model.location.locationTranslations[0].name : "";
				// province data

				// setup UI
				$('#provinceMetaLabel').html(heading);
				$('#provinceMetadataSubmitButton').html(submit);
				// location data
				$("#provinceMetadataName").val(name).trigger('input');
				// province data
			});

			// Submit province data
			$('#provinceMetadataSubmitButton').on('click', function(ev) {
				// Create/Edit province window submitted data validation
				var modal = $('#locationDatasetsAddProvinceModal');
				var province = modal.data('province');
				// location data
				var name = $("#provinceMetadataName").val();
				// province data

				if (province) {
					// location data
					province.model.location.locationTranslations[0].name = name;
					// province data

					province.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("province", province);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 2 // 2 = Province. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("province", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate province data
			// TODO validate all required fields
			$('#provinceMetadataName').on('input', function(ev) {
				if ( $("#provinceMetadataName").val().length > 0 ) {
					$('#provinceMetadataSubmitButton').prop('disabled', false);
					$('#provinceMetadataSubmitButton').removeAttr('disabled');
				} else {
					$('#provinceMetadataSubmitButton').prop('disabled', true);
					$('#provinceMetadataSubmitButton').attr('disabled');
				}
			});
		},

		initCounties: function() {
			// console.log("TCL: LocationDatasets: initCounties: function()");
			// delete county functionality
			$('#locationDatasetsDeleteCountyModalSubmitButton').on('click', function(ev) {
				var modal = $('#locationDatasetsDeleteCountyModal');
				var county = modal.data('county');
				if (county) TIMAAT.LocationDatasets._locationSubtypeRemoved("county", county);
				modal.modal('hide');
			});

			// add county button
			$('#locationDatasetsAddCountyButton').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("county")');

			// add/edit county functionality
			$('#locationDatasetsAddCountyModal').on('show.bs.modal', function (ev) {
				// Create/Edit county window setup
				var modal = $(this);
				var county = modal.data('county');
				var heading = (county) ? "Edit county" : "Add county";
				var submit = (county) ? "Save" : "Add";
				// location data
				var name = (county) ? county.model.location.locationTranslations[0].name : "";
				// county data

				// setup UI
				$('#countyMetaLabel').html(heading);
				$('#countyMetadataSubmitButton').html(submit);
				// location data
				$("#countyMetadataName").val(name).trigger('input');
				// county data
			});

			// Submit county data
			$('#countyMetadataSubmitButton').on('click', function(ev) {
				// Create/Edit county window submitted data validation
				var modal = $('#locationDatasetsAddCountyModal');
				var county = modal.data('county');
				// location data
				var name = $("#countyMetadataName").val();
				// county data

				if (county) {
					// location data
					county.model.location.locationTranslations[0].name = name;
					// county data

					county.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("county", county);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 3 // 3 = County. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("county", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate county data
			// TODO validate all required fields
			$('#countyMetadataName').on('input', function(ev) {
				if ( $("#countyMetadataName").val().length > 0 ) {
					$('#countyMetadataSubmitButton').prop('disabled', false);
					$('#countyMetadataSubmitButton').removeAttr('disabled');
				} else {
					$('#countyMetadataSubmitButton').prop('disabled', true);
					$('#countyMetadataSubmitButton').attr('disabled');
				}
			});
		},

		initCities: function() {
			// console.log("TCL: LocationDatasets: initCities: function()");
			// delete city functionality
			$('#locationDatasetsDeleteCityModalSubmitButton').on('click', function(ev) {
				var modal = $('#locationDatasetsDeleteCityModal');
				var city = modal.data('city');
				if (city) TIMAAT.LocationDatasets._locationSubtypeRemoved("city", city);
				modal.modal('hide');
			});

			// add city button
			$('#locationDatasetsAddCityButton').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("city")');

			// add/edit city functionality
			$('#locationDatasetsAddCityModal').on('show.bs.modal', function (ev) {
				// Create/Edit city window setup
				var modal = $(this);
				var city = modal.data('city');
				var heading = (city) ? "Edit city" : "Add city";
				var submit = (city) ? "Save" : "Add";
				// location data
				var name = (city) ? city.model.location.locationTranslations[0].name : "";
				// city data

				// setup UI
				$('#cityMetaLabel').html(heading);
				$('#cityMetadataSubmitButton').html(submit);
				// location data
				$("#cityMetadataName").val(name).trigger('input');
				// city data
			});

			// Submit city data
			$('#cityMetadataSubmitButton').on('click', function(ev) {
				// Create/Edit city window submitted data validation
				var modal = $('#locationDatasetsAddCityModal');
				var city = modal.data('city');
				// location data
				var name = $("#cityMetadataName").val();
				// city data

				if (city) {
					// location data
					city.model.location.locationTranslations[0].name = name;
					// city data

					city.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("city", city);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 4 // 4 = City. TODO check clause to find proper id
							},
						locationTranslations: [],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("city", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate city data
			// TODO validate all required fields
			$('#cityMetadataName').on('input', function(ev) {
				if ( $("#cityMetadataName").val().length > 0 ) {
					$('#cityMetadataSubmitButton').prop('disabled', false);
					$('#cityMetadataSubmitButton').removeAttr('disabled');
				} else {
					$('#cityMetadataSubmitButton').prop('disabled', true);
					$('#cityMetadataSubmitButton').attr('disabled');
				}
			});
		},

		initStreets: function() {
			// console.log("TCL: LocationDatasets: initStreets: function()");
			// delete street functionality
			$('#locationDatasetsDeleteStreetModalSubmitButton').on('click', function(ev) {
				var modal = $('#locationDatasetsDeleteStreetModal');
				var street = modal.data('street');
				if (street) TIMAAT.LocationDatasets._locationSubtypeRemoved("street", street);
				modal.modal('hide');
			});

			// add street button
			$('#locationDatasetsAddStreetButton').attr('onclick','TIMAAT.LocationDatasets.addLocationSubtype("street")');

			// add/edit street functionality
			$('#locationDatasetsAddStreetModal').on('show.bs.modal', function (ev) {
				// Create/Edit street window setup
				var modal = $(this);
				var street = modal.data('street');
				var heading = (street) ? "Edit street" : "Add street";
				var submit = (street) ? "Save" : "Add";
				// location data
				var name = (street) ? street.model.location.locationTranslations[0].name : "";
				// street data

				// setup UI
				$('#streetMetaLabel').html(heading);
				$('#streetMetadataSubmitButton').html(submit);
				// location data
				$("#streetMetadataName").val(name).trigger('input');
				// street data
			});

			// Submit street data
			$('#streetMetadataSubmitButton').on('click', function(ev) {
				// Create/Edit street window submitted data validation
				var modal = $('#locationDatasetsAddStreetModal');
				var street = modal.data('street');
				// location data
				var name = $("#streetMetadataName").val();
				// street data

				if (street) {
					// location data
					street.model.location.locationTranslations[0].name = name;
					// street data

					street.updateUI();
					TIMAAT.LocationDatasets.updateLocationSubtype("street", street);
				} else {
					var model = {
						locationId: 0,
					};
					var location = {
							id: 0,
							locationType: {
								id: 5 // 5 = Street. TODO check clause to find proper id
							},
						locationTranslations: [{
							id: 282, // TODO change (temp value so actor can work)
							name: name,
						}],
					};
					var locationTranslation = {
							id: 0,
							name: name,
					};
					TIMAAT.LocationDatasets.createLocationSubtype("street", model, location, locationTranslation);
				}
				modal.modal('hide');
			});
			// validate street data
			// TODO validate all required fields
			$('#streetMetadataName').on('input', function(ev) {
				if ( $("#streetMetadataName").val().length > 0 ) {
					$('#streetMetadataSubmitButton').prop('disabled', false);
					$('#streetMetadataSubmitButton').removeAttr('disabled');
				} else {
					$('#streetMetadataSubmitButton').prop('disabled', true);
					$('#streetMetadataSubmitButton').attr('disabled');
				}
			});
		},

		load: function() {
			TIMAAT.LocationDatasets.loadLocations();
			TIMAAT.LocationDatasets.loadLocationTypes();
			TIMAAT.LocationDatasets.loadAllLocationSubtypes();
		},

		loadLocationTypes: function() {
			// console.log("TCL: loadLocationTypes: function()");
			// load locations
			TIMAAT.LocationService.listLocationTypes(TIMAAT.LocationDatasets.setLocationTypeList);
		},

		loadLocations: function() {
			// console.log("TCL: loadLocations: function()");
			// load locations
			TIMAAT.LocationService.listLocations(TIMAAT.LocationDatasets.setLocationLists);
		},

		loadLocationSubtype: function(locationSubtype) {
			switch (locationSubtype) {
				case "country":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setCountryLists);
					break;
				case "province":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setProvinceLists);
					break;
				case "county":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setCountyLists);
					break;
				case "city":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setCityLists);
					break;
				case "street":
					TIMAAT.LocationService.listLocationSubtype(locationSubtype, TIMAAT.LocationDatasets.setStreetLists);
					break;
			};
		},

		loadAllLocationSubtypes: function() {
			TIMAAT.LocationService.listLocationSubtype("country", TIMAAT.LocationDatasets.setCountryLists);
			TIMAAT.LocationService.listLocationSubtype("province", TIMAAT.LocationDatasets.setProvinceLists);
			TIMAAT.LocationService.listLocationSubtype("county", TIMAAT.LocationDatasets.setCountyLists);
			TIMAAT.LocationService.listLocationSubtype("city", TIMAAT.LocationDatasets.setCityLists);
			TIMAAT.LocationService.listLocationSubtype("street", TIMAAT.LocationDatasets.setStreetLists);
		},

		setLocationTypeList: function(locationTypes) {
			// console.log("TCL: locationTypes", locationTypes);
			if ( !locationTypes ) return;
			// setup model
			var locTypes = Array();
			locationTypes.forEach(function(locationType) { if ( locationType.id > 0 ) locTypes.push(new TIMAAT.LocationType(locationType)); });
			TIMAAT.LocationDatasets.locationTypes = locTypes;
			TIMAAT.LocationDatasets.locationTypes.model = locationTypes;
		},

		setLocationLists: function(locations) {
			// console.log("TCL: locations", locations);
			if ( !locations ) return;
			// setup model
			var locs = Array();
			locations.forEach(function(location) { if ( location.id > 0 ) locs.push(new TIMAAT.Location(location)); });
			TIMAAT.LocationDatasets.locations = locs;
			TIMAAT.LocationDatasets.locations.model = locations;
		},

		setCountryLists: function(countries) {
			// console.log("TCL: setCountryLists: function(countries)");
			// console.log("TCL: countries", countries);
			if ( !countries ) return;
			// setup model
			var locs = Array();
			countries.forEach(function(country) {
				if ( country.id > 0 )
					locs.push(new TIMAAT.Country(country));
			});
			TIMAAT.LocationDatasets.countries = locs;
			TIMAAT.LocationDatasets.countries.model = countries;
		},

		setProvinceLists: function(provinces) {
			// console.log("TCL: setProvinceLists: function(provinces)");
			// console.log("TCL: provinces", provinces);
			if ( !provinces ) return;
			// setup model
			var locs = Array();
			provinces.forEach(function(province) {
				if ( province.id > 0 )
					locs.push(new TIMAAT.Province(province));
			});
			TIMAAT.LocationDatasets.provinces = locs;
			TIMAAT.LocationDatasets.provinces.model = provinces;
		},

		setCountyLists: function(counties) {
			// console.log("TCL: setCountyLists: function(counties)");
			// console.log("TCL: counties", counties);
			if ( !counties ) return;
			// setup model
			var locs = Array();
			counties.forEach(function(county) {
				if ( county.id > 0 )
					locs.push(new TIMAAT.County(county));
			});
			TIMAAT.LocationDatasets.counties = locs;
			TIMAAT.LocationDatasets.counties.model = counties;
		},

		setCityLists: function(cities) {
			// console.log("TCL: setCityLists: function(cities)");
			// console.log("TCL: cities", cities);
			if ( !cities ) return;
			// setup model
			var locs = Array();
			cities.forEach(function(city) {
				if ( city.id > 0 )
					locs.push(new TIMAAT.City(city));
			});
			TIMAAT.LocationDatasets.cities = locs;
			TIMAAT.LocationDatasets.cities.model = cities;
		},

		setStreetLists: function(streets) {
			// console.log("TCL: setStreetLists: function(streets)");
			// console.log("TCL: streets", streets);
			if ( !streets ) return;
			// setup model
			var locs = Array();
			streets.forEach(function(street) {
      	// console.log("TCL: street", street);
				if ( street.id > 0 )
					locs.push(new TIMAAT.Street(street));
			});
			TIMAAT.LocationDatasets.streets = locs;
			TIMAAT.LocationDatasets.streets.model = streets;
		},

		addLocation: function() {
			// console.log("TCL: addLocation: function()");
			$('#locationDatasetsAddLocationModal').data('location', null);
			$('#locationDatasetsAddLocationModal').modal('show');
		},

		addLocationSubtype: function(locationSubtype) {
			switch (locationSubtype) {
				case "country":
					$('#locationDatasetsAddCountryModal').data('country', null);
					$('#locationDatasetsAddCountryModal').modal('show');
					break;
				case "province":
					$('#locationDatasetsAddProvinceModal').data('province', null);
					$('#locationDatasetsAddProvinceModal').modal('show');
					break;
				case "county":
					$('#locationDatasetsAddCountyModal').data('county', null);
					$('#locationDatasetsAddCountyModal').modal('show');
					break;
				case "city":
					$('#locationDatasetsAddCityModal').data('city', null);
					$('#locationDatasetsAddCityModal').modal('show');
					break;
				case "street":
					$('#locationDatasetsAddStreetModal').data('street', null);
					$('#locationDatasetsAddStreetModal').modal('show');
					break;
			}
		},

		createLocation: async function(locationModel, locationModelTranslation) {
		// NO LOCATION SHOULD BE CREATED DIRECTLY. CREATE COUNTRY, CITY, ETC. INSTEAD
		// This routine can be used to create empty locations of a certain type
		// console.log("TCL: createLocation -> locationModel, locationModelTranslation", locationModel, locationModelTranslation);
			try {
				// create location
				var newLocationModel = await TIMAAT.LocationService.createLocation(locationModel);

				// create location translation with location id
				var newTranslationData = await TIMAAT.LocationService.createLocationTranslation(newLocationModel, locationModelTranslation);
				newLocationModel.locationTranslations[0] = newTranslationData;

				// create country/city/etc depending on country type
				// TODO switch (locationModel.locationType)

				// push new location to dataset model
				await TIMAAT.LocationDatasets._locationAdded(newLocationModel);
			} catch(error) {
				console.error("ERROR: ", error);
			};
			// location.updateUI();
		},

		createLocationSubtype: async function(locationSubtype, locationSubtypeModel, locationModel, locationModelTranslation) {
			// console.log("TCL: createLocationSubtype -> locationModel, locationModelTranslation, locationSubtypeModel", locationModel, locationModelTranslation, locationSubtypeModel);
			try {
				// create location
				var newLocationModel = await TIMAAT.LocationService.createLocation(locationModel);

				// create location translation with location id
				await TIMAAT.LocationService.createLocationTranslation(newLocationModel, locationModelTranslation);
				newLocationModel.locationTranslations[0] = locationModelTranslation;

				// push new location to dataset model
				await TIMAAT.LocationDatasets._locationAdded(newLocationModel);

				// create locationSubtype with location id
				locationSubtypeModel.locationId = newLocationModel.id;
				var newLocationSubtypeModel = await TIMAAT.LocationService.createLocationSubtype(locationSubtype, newLocationModel, locationSubtypeModel);

				// push new locationSubtype to dataset model
				await TIMAAT.LocationDatasets._locationSubtypeAdded(locationSubtype, newLocationSubtypeModel);

			} catch(error) {
				console.error("ERROR: ", error);
			};
			// location.updateUI();
		},

		updateLocation: async function(location) {
		// console.log("TCL: updateLocation async function -> location at beginning of update process: ", location);
			try {
				// update data that is part of location (includes updating last edited by/at)
				var tempLocationModel = await TIMAAT.LocationService.updateLocation(location.model);
				location.model.locationType.id = tempLocationModel.locationType.id;
			} catch(error) {
				console.error("ERROR: ", error);
			};

			try {
				// update data that is part of location translation
				// TODO: send request for each translation or for all translations
				// console.log("TCL: location", location);
				var tempLocationTranslation = await	TIMAAT.LocationService.updateLocationTranslation(location.model.id, location.model.locationTranslations[0]);
				// location.model.locationTranslations[0].name = tempLocationTranslation.name;
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		updateLocationSubtype: async function(locationSubtype, locationSubtypeData) {
			// console.log("TCL: updateLocationSubtype async function -> locationSubtype, locationSubtypeData at beginning of update process: ", locationSubtype, locationSubtypeData);
			try {
				// update data that is part of locationSubtype
				var tempLocationSubtypeModel = await TIMAAT.LocationService.updateLocationSubtype(locationSubtype, locationSubtypeData.model);
			} catch(error) {
				console.error("ERROR: ", error);

			};
			try {
				// update data that is part of location and its translation
				var locationSubtypeLocationModel = locationSubtypeData.model.location;
        // console.log("TCL: locationSubtypeLocationModel", locationSubtypeLocationModel);
				var tempLocationSubtypeModelUpdate = await TIMAAT.LocationService.updateLocation(locationSubtypeLocationModel);

				// update data that is part of location translation
				// var locationSubtypeLocation = locationSubtypeData.location;
				// console.log("TCL: locationSubtypeData", locationSubtypeData);
				var tempLocationTranslation = await	TIMAAT.LocationService.updateLocationTranslation(locationSubtypeData.model.id, locationSubtypeData.model.location.locationTranslations[0]);
				// location.model.locationTranslations[0].name = tempLocationTranslation.name;
			} catch(error) {
				console.error("ERROR: ", error);
			};
		},

		_locationAdded: async function(location) {
			// console.log("TCL: _locationAdded: function(location)");
			// console.log("TCL: location", location);
			TIMAAT.LocationDatasets.locations.model.push(location);
			TIMAAT.LocationDatasets.locations.push(new TIMAAT.Location(location));
			// return location;
		},

		_locationSubtypeAdded: async function(locationSubtype, locationSubtypeData) {
			// console.log("TCL: _countryAdded: function(country)");
			switch (locationSubtype) {
				case "country":
					TIMAAT.LocationDatasets.countries.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.countries.push(new TIMAAT.Country(locationSubtypeData));
					break;
				case "province":
					TIMAAT.LocationDatasets.provinces.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.provinces.push(new TIMAAT.Province(locationSubtypeData));
					break;
				case "county":
					TIMAAT.LocationDatasets.counties.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.counties.push(new TIMAAT.County(locationSubtypeData));
					break;
				case "city":
					TIMAAT.LocationDatasets.cities.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.cities.push(new TIMAAT.City(locationSubtypeData));
					break;
				case "street":
					TIMAAT.LocationDatasets.streets.model.push(locationSubtypeData);
					TIMAAT.LocationDatasets.streets.push(new TIMAAT.Street(locationSubtypeData));
					break;
			};
		},

		_locationRemoved: function(location) {
			// console.log("TCL: _locationRemoved: function(location)");
			// console.log("TCL: location", location);
			// sync to server
			TIMAAT.LocationService.removeLocation(location);
			location.remove();
		},

		_locationSubtypeRemoved: function(locationSubtype, locationSubtypeData) {
			// console.log("TCL: _locationSubtypeRemoved: function(locationSubtype, locationSubtypeData)");
			// sync to server
		 TIMAAT.LocationService.removeLocationSubtype(locationSubtype, locationSubtypeData)
		 locationSubtypeData.remove();
		},

	}

}, window));
