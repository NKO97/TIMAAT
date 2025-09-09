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
 * Component responsible to connect and manage the subscriptions to entity update events
 * @author Nico Kotlenga
 */
'use strict';
(function (factory, window) {
    /*globals define, module, require*/

    // define an AMD module that relies on 'TIMAAT'
    if (typeof define === 'function' && define.amd) {
        define(['TIMAAT', 'eventsource'], factory);


        // define a Common JS module that relies on 'TIMAAT'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('TIMAAT'), require('eventsource'));
    }

    // attach your plugin to the global 'TIMAAT' variable
    if(typeof window !== 'undefined' && window.TIMAAT){
        factory(window.TIMAAT, window.eventsource);
    }

}(function (TIMAAT, eventsource) {
    TIMAAT.EntityUpdate = {
        eventSource: null,
        entityUpdateListener: [],
        init: function (){
        },
        initEntityUpdate : function() {
            this.eventSource = new eventsource.EventSourcePolyfill("api/entity-update-events", {
                headers: {
                    'Authorization': 'Bearer '+TIMAAT.Service.token
                }
            })
            for(const currentRegisteredEntityUpdateListener of this.entityUpdateListener){
                const eventName = currentRegisteredEntityUpdateListener[0]
                const handler = currentRegisteredEntityUpdateListener[1]
                this.eventSource.addEventListener(eventName, (changeMessage) => {
                    const jsonData = JSON.parse(changeMessage.data)
                    handler(jsonData)
                })
            }
        },
        registerEntityUpdateListener : function (eventName, entityReceivedCallback){
            this.entityUpdateListener.push([eventName, entityReceivedCallback])
            if(this.eventSource){
                this.eventSource.addEventListener(eventName, (changeMessage) => {
                    const jsonData = JSON.parse(changeMessage.data)
                    entityReceivedCallback(jsonData)
                })
            }
        }
    }
}, window))