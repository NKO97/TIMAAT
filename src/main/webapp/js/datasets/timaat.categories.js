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
 * @author Nico Kotlenga <nico@kotlenga.dev>
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

} (function (TIMAAT) {
    TIMAAT.Categories = {
        init: function() {
            $('#categorySetTab').on('click', function(event) {
                TIMAAT.Categories.updateItemTypeSelection("categorySet")
            });

            $('#categoryTab').on('click', function(event) {
                TIMAAT.Categories.updateItemTypeSelection("category")
            });
        },
        initCategoriesComponent: function () {
            TIMAAT.UI.showComponent('categories');
            $('#categoryTab').trigger('click');
        },

        /**
         * This method switches the selection of the current item type of the categories view
         * @param itemType which will be selected. Can be category or categorySet
         */
        updateItemTypeSelection: function (itemType) {
            switch (itemType) {
                case 'category':
                    TIMAAT.UI.displayComponent('category', 'categoryTab', 'categoryDataTableCard');
                    TIMAAT.URLHistory.setURL(null, 'Categories', '#categories/categories');
                    break
                case 'categorySet':
                    TIMAAT.UI.displayComponent('category', 'categorySetTab', 'categorySetDataTableCard');
                    TIMAAT.URLHistory.setURL(null, 'Category Sets', '#categories/categorySets');
                    break
            }
        },

        showAddCategoryPanel(){

        },

        showAddCategorySetPanel(){

        }
    }
}))