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
    if (typeof window !== 'undefined' && window.TIMAAT) {
        factory(window.TIMAAT);
    }

}(function (TIMAAT) {
    TIMAAT.Categories = {
        categoryDataTable: null, categorySetDataTable: null,

        init: function () {
            $('#categorySetTab').on('click', function (event) {
                TIMAAT.Categories.updateItemTypeSelection("categorySet")
            });

            $('#categoryTab').on('click', function (event) {
                TIMAAT.Categories.updateItemTypeSelection("category")
            });

            /*
            Category set related event handler
             */
            const $categorySetDataTable = $('#categorySetDataTable')
            $categorySetDataTable.on('click', '.categorySetEditButton', function (event) {
                const categorySet = JSON.parse(decodeURIComponent($(event.currentTarget).data('category-set')));
                TIMAAT.Categories.showEditCategorySetPanel(categorySet);
            })
            $categorySetDataTable.on('click', '.categorySetDeleteButton', function (event) {
                const categorySet = JSON.parse(decodeURIComponent($(event.currentTarget).data('category-set')));
                TIMAAT.Categories.showDeleteCategorySetModal(categorySet);
            })
            $("#categorySetDataTableSelectAll").on('click', function (event) {
                if (TIMAAT.Categories.categorySetDataTable) {
                    if (event.currentTarget.checked) {
                        TIMAAT.Categories.categorySetDataTable.rows().select()
                    } else {
                        TIMAAT.Categories.categorySetDataTable.rows().deselect()
                    }
                }
            })
        }, initCategoriesComponent: function () {
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
                    TIMAAT.Categories.loadCategories()
                    break
                case 'categorySet':
                    TIMAAT.UI.displayComponent('category', 'categorySetTab', 'categorySetDataTableCard');
                    TIMAAT.URLHistory.setURL(null, 'Category Sets', '#categories/categorySets');
                    TIMAAT.Categories.loadCategorySets()
                    break
            }
        },

        showAddCategoryPanel() {

        },

        showAddCategorySetPanel() {

        },

        showEditCategorySetPanel(categorySet) {
            console.log("editCategorySet", categorySet)
        },

        showDeleteCategorySetModal(categorySet) {
            console.log("deleteCategorySet", categorySet)
        },

        loadCategorySets() {
            if (!TIMAAT.Categories.categorySetDataTable) {
                TIMAAT.Categories.categorySetDataTable = $('#categorySetDataTable').DataTable({
                    "autoWidth": false,
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "order": [[0, 'asc']],
                    "pagingType": "full",
                    "dom": '<lf<t>ip>',
                    "processing": true,
                    "stateSave": true,
                    "scrollY": "60vh",
                    "scrollCollapse": true,
                    "scrollX": false,
                    "rowId": 'id',
                    "serverSide": true,
                    "select": {
                        "style": 'multi', "selector": 'td:not(.actions)'
                    },
                    "ajax": {
                        "url": "api/categorySet/list",
                        "contentType": "application/json; charset=utf-8",
                        "dataType": "json",
                        "data": function (data) {
                            let serverData = {
                                draw: data.draw,
                                start: data.start,
                                length: data.length,
                                orderby: data.columns[data.order[0].column].name,
                                dir: data.order[0].dir, // musicSubtype: ''
                            }
                            if (data.search && data.search.value && data.search.value.length > 0) serverData.search = data.search.value;
                            return serverData;
                        },
                        "beforeSend": function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + TIMAAT.Service.token);
                        }
                    },
                    "columns": [{
                        data: null,
                        orderable: false,
                        searchable: false,
                        defaultContent: '',
                        width: '1%',
                        className: "select-checkbox",
                    }, {
                        data: 'name',
                        name: 'name',
                        className: 'name',
                        width: '100%',
                        render: function (data, type, row) {
                            // console.log("TCL: event", event);
                            return `<p>` + `  ` + row.name + `</p>`;
                        }
                    }, {
                        data: null,
                        className: 'actions',
                        orderable: false,
                        searchable: false,
                        width: '1%',
                        render: function (data, type, row) {
                            const rowJson = encodeURIComponent(JSON.stringify(row));

                            return `<div class="d-flex justify-content-end">
                                <div class="btn-group" role="group" aria-label="Category set row options">
                                  <button type="button" class="btn btn-sm btn-outline btn-secondary categorySetEditButton" data-category-set="${rowJson}"><i class="fas fa-edit"></i></button>
                                  <button type="button" class="btn btn-sm btn-outline btn-danger categorySetDeleteButton" data-category-set="${rowJson}"><i class="fas fa-trash-alt"></i></button>
                                </div>
                              </div>`
                        }
                    }],
                    "language": {
                        "decimal": ",",
                        "thousands": ".",
                        "search": "Search",
                        "lengthMenu": "Show _MENU_ entries",
                        "zeroRecords": "No category set found.",
                        "info": "Page _PAGE_ of _PAGES_ &middot; (_MAX_ category sets total)",
                        "infoEmpty": "No category set available.",
                        "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ music)",
                        "paginate": {
                            "first": "<<", "previous": "<", "next": ">", "last": ">>"
                        },
                    },
                });
                TIMAAT.Categories.categorySetDataTable.on('select deselect', function () {
                    const selectedCategorySets = TIMAAT.Categories.categorySetDataTable.rows({ selected: true }).data().toArray();
                    console.log(selectedCategorySets)

                    const selectedCount = selectedCategorySets.length;
                    const totalCount = TIMAAT.Categories.categorySetDataTable.rows().count();
                    $('#categorySetDataTableSelectAll').prop('checked', selectedCount === totalCount && totalCount > 0);
                });
            } else {
                //The datatable was already initialized. We just need to reload the entries
                TIMAAT.Categories.categorySetDataTable.ajax.reload();
            }
        },

        loadCategories: function () {
            if (!TIMAAT.Categories.categorySetDataTable) {

            } else {
                //The datatable was already initialized. We just need to reload the entries
            }
        }
    }
}))