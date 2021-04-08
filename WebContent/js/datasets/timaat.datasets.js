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
	
	TIMAAT.Datasets = {

		init: function() {
			// Datasets
			TIMAAT.ActorDatasets.init();
			TIMAAT.EventDatasets.init();
			TIMAAT.LocationDatasets.init();
			TIMAAT.MediumCollectionDatasets.init();
			TIMAAT.MediumDatasets.init();
			TIMAAT.AnalysisDatasets.init();
		},

		load: function() {
			// Datasets
			TIMAAT.ActorDatasets.load();
			TIMAAT.EventDatasets.load();
			TIMAAT.LocationDatasets.load();
			TIMAAT.MediumCollectionDatasets.load();
			TIMAAT.MediumDatasets.load();
		},

		loadDataTables: function() {
			TIMAAT.MediumCollectionDatasets.loadMediaCollectionDataTables();
			TIMAAT.MediumDatasets.loadMediaDataTables();
			TIMAAT.ActorDatasets.loadActorDataTables();
			TIMAAT.AnalysisDatasets.loadAnalysisDataTables();
			TIMAAT.EventDatasets.loadEventDataTables();
		},

	}
	
}, window));
