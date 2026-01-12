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
    if (typeof window !== 'undefined' && window.TIMAAT) {
        factory(window.TIMAAT);
    }

}(function (TIMAAT) {

    TIMAAT.SegmentStructureElementService = {
        async getMediumAnalysisList(segmentStructureType, segmentStructureId) {
            return new Promise(resolve => {
                $.ajax({
                    url: window.location.protocol + '//' + window.location.host + "/TIMAAT/api/segment-structure-elements/" + segmentStructureType + "/" + segmentStructureId +
                        "/analysis-list",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Bearer ' + TIMAAT.Service.token);
                    },
                }).done(function (data) {
                    resolve(data);
                })
                    .fail(function (error) {
                        console.error("ERROR responseText: ", error.responseText);
                        console.error("ERROR: ", error);
                    });
            }).catch((error) => {
                console.error("ERROR: ", error);
            });
        }
    }
}))