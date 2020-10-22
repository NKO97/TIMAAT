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
			TIMAAT.MediaCollectionDatasets.init();
			TIMAAT.MediaDatasets.init();
			TIMAAT.AnalysisDatasets.init();
			// Lists
			TIMAAT.RoleLists.init();
			TIMAAT.CategoryLists.init();
			TIMAAT.LanguageLists.init();
			TIMAAT.TagLists.init();
		},

		load: async function() {
			// Datasets
			TIMAAT.ActorDatasets.load();
			TIMAAT.EventDatasets.load();
			TIMAAT.LocationDatasets.load();
			TIMAAT.MediaCollectionDatasets.load();
			TIMAAT.MediaDatasets.load();
			// Lists
			TIMAAT.RoleLists.load();
			TIMAAT.LanguageLists.load();
			TIMAAT.CategoryLists.load();
			TIMAAT.TagLists.load();
		},

	}
	
}, window));
