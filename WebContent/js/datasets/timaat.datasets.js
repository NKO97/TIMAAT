/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

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

	TIMAAT.Datasets = {

		init: function() {
			// Datasets
			TIMAAT.ActorDatasets.init();
			TIMAAT.EventDatasets.init();
			TIMAAT.LocationDatasets.init();
			TIMAAT.MediumCollectionDatasets.init();
			TIMAAT.MediumDatasets.init();
			TIMAAT.AnalysisDatasets.init();
			TIMAAT.MusicDatasets.init();
		},

		load: function() {
			// Datasets
			TIMAAT.ActorDatasets.load();
			TIMAAT.EventDatasets.load();
			TIMAAT.LocationDatasets.load();
			TIMAAT.MediumCollectionDatasets.load();
			TIMAAT.MediumDatasets.load();
			TIMAAT.MusicDatasets.load();
		},

		loadDataTables: function() {
			TIMAAT.MediumCollectionDatasets.loadMediaCollectionDataTables();
			TIMAAT.MediumDatasets.loadMediaDataTables();
			TIMAAT.ActorDatasets.loadActorDataTables();
			TIMAAT.AnalysisDatasets.loadAnalysisDataTables();
			TIMAAT.EventDatasets.loadEventDataTables();
			TIMAAT.MusicDatasets.loadMusicDataTables();
		},

	}

}, window));
