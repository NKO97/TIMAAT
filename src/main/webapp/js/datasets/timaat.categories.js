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

            /*
            Category related event handler
             */
            const $categoryDataTable = $('#categoryDataTable')
            $categoryDataTable.on('click', '.categoryEditButton', function (event) {
                const category = JSON.parse(decodeURIComponent($(event.currentTarget).data('category')));
                TIMAAT.Categories.showEditCategoryPanel(category);
            })
            $categoryDataTable.on('click', '.categoryDeleteButton', function (event) {
                const category = JSON.parse(decodeURIComponent($(event.currentTarget).data('category')));
                TIMAAT.Categories.showDeleteCategoryModal(category);
            })
            $("#categoryDataTableSelectAll").on('click', function (event) {
                if (TIMAAT.Categories.categoryDataTable) {
                    if (event.currentTarget.checked) {
                        TIMAAT.Categories.categoryDataTable.rows().select()
                    } else {
                        TIMAAT.Categories.categoryDataTable.rows.deselect()
                    }
                }
            })
            $('#categoriesCategoryDeleteModalSubmitButton').on('click', async function (event) {
                const categoryId = $(event.currentTarget).data("category-id")
                await TIMAAT.CategoryService.deleteCategory(categoryId)

                TIMAAT.Categories.categoryDataTable?.ajax.reload()
                $('#categoriesCategoryDeleteModal').modal('hide');
                TIMAAT.Categories.updateCategorySelectAllCheckboxState()
            })

            $('#categoryCreateChangeFormDismissButton').on('click',() =>  {
                TIMAAT.Categories.showAssignedEntitiesPanel()
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

        updateCategorySelectAllCheckboxState() {
            const selectedCount = TIMAAT.Categories.categoryDataTable.rows({selected: true}).count()
            const totalCount = TIMAAT.Categories.categoryDataTable.rows().count();
            $('#categoryDataTableSelectAll').prop('checked', selectedCount === totalCount && totalCount > 0);
        },

        createCategorySetDropDown: function (){
            const categorySetsDropDown = $('#categorySetsMultiSelectDropdown')
            categorySetsDropDown.empty()
            categorySetsDropDown.select2({
                closeOnSelect: false,
                scrollAfterSelect: true,
                allowClear: true,
                ajax: {
                    url: 'api/categorySet/selectList',
                    type: 'GET',
                    dataType: 'json',
                    delay: 250,
                    minWidth: "200px",
                    headers: {
                        "Authorization": "Bearer " + TIMAAT.Service.token,
                        "Content-Type": "application/json",
                    },
                    // additional parameters
                    data: function (params) {
                        // console.log("TCL: data: params", params);
                        return {
                            search: params.term,
                            page: params.page
                        };
                    },
                    processResults: function (data, params) {
                        // console.log("TCL: processResults: data", data);
                        params.page = params.page || 1;
                        return {
                            results: data
                        };
                    },
                    cache: false
                },
                minimumInputLength: 0,
            })

            return categorySetsDropDown
        },

        showAddCategoryPanel() {
            $('.categoriesRightPanelContent').hide()

            const $categoryCreateChangeForm = $('#categoryCreateChangeForm')
            TIMAAT.Categories.resetCategoryCreateChangeFormState($categoryCreateChangeForm)
            $categoryCreateChangeForm.find('#categoryCreateChangeFormHeader').text('Create category')

            const categorySetsDropDown = TIMAAT.Categories.createCategorySetDropDown()
            const categoryCreateChangeFormSubmitButton = $categoryCreateChangeForm.find('#categoryCreateChangeFormSubmitButton')
            const categoryNameInput = $categoryCreateChangeForm.find('#categoryCreateChangeFormName')

            categorySetsDropDown.val([]).trigger('change');
            categoryNameInput.val("")

            categoryCreateChangeFormSubmitButton.off('click')
            categoryCreateChangeFormSubmitButton.on('click', async function (event) {
                event.preventDefault();
                if ($categoryCreateChangeForm.valid()) {
                    const categoryName = categoryNameInput.val()
                    const categorySetIds = categorySetsDropDown.val();

                    await TIMAAT.CategoryService.createCategory(categoryName, categorySetIds)
                    TIMAAT.Categories.categoryDataTable?.ajax.reload()
                    TIMAAT.Categories.showAssignedEntitiesPanel()
                }
            })
            $categoryCreateChangeForm.show()
        },

        resetCategoryCreateChangeFormState($categoryCreateChangeForm) {
            $categoryCreateChangeForm.validate().resetForm()
            $categoryCreateChangeForm.find(".error").removeClass("error")
            $categoryCreateChangeForm.find(".valid").removeClass("valid")
            $('.categoryCreateChangeFormName-error').remove()
        },

        showAssignedEntitiesPanel() {
            $('.categoriesRightPanelContent').hide()
        },

        showAddCategorySetPanel() {

        },

        showEditCategorySetPanel(categorySet) {
            console.log("editCategorySet", categorySet)
        },

        showDeleteCategorySetModal(categorySet) {
            console.log("deleteCategorySet", categorySet)
        },
        showEditCategoryPanel(category) {
            $('.categoriesRightPanelContent').hide()

            const $categoryCreateChangeForm = $('#categoryCreateChangeForm')
            TIMAAT.Categories.resetCategoryCreateChangeFormState($categoryCreateChangeForm)
            $categoryCreateChangeForm.find('#categoryCreateChangeFormHeader').text('Edit category')

            const categorySetsDropDown = TIMAAT.Categories.createCategorySetDropDown()
            const categoryCreateChangeFormSubmitButton = $categoryCreateChangeForm.find('#categoryCreateChangeFormSubmitButton')
            const categoryNameInput = $categoryCreateChangeForm.find('#categoryCreateChangeFormName')

            categorySetsDropDown.val([]).trigger('change');
            TIMAAT.CategoryService.getCategorySetsOfCategory(category.id).then(categorySets => {
                for(const currentCategorySet of categorySets) {
                    const option = new Option(currentCategorySet.name, currentCategorySet.id, true, true)
                    categorySetsDropDown.append(option)
                }
            })
            categorySetsDropDown.trigger('change');

            categoryNameInput.val(category.name).trigger('change');
            categoryCreateChangeFormSubmitButton.off('click')
            categoryCreateChangeFormSubmitButton.on('click', async function (event) {
                event.preventDefault();
                if ($categoryCreateChangeForm.valid()) {
                    const categoryName = categoryNameInput.val()
                    const categorySetIds = categorySetsDropDown.val();

                    await TIMAAT.CategoryService.updateCategory(category.id, categoryName, categorySetIds)
                    TIMAAT.Categories.categoryDataTable?.ajax.reload()
                    TIMAAT.Categories.showAssignedEntitiesPanel()
                }
            })
            $categoryCreateChangeForm.show()
        },

        showDeleteCategoryModal(category) {
            const $categoriesCategoryDeleteModal = $('#categoriesCategoryDeleteModal')

            $categoriesCategoryDeleteModal.find(".modal-body").text(`Do you really want to delete category "${category.name}"?`)
            $('#categoriesCategoryDeleteModalSubmitButton').data('category-id', category.id)
            $categoriesCategoryDeleteModal.modal('show');
        },

        loadCategorySets() {
            if (!TIMAAT.Categories.categorySetDataTable) {
                TIMAAT.Categories.categorySetDataTable = $('#categorySetDataTable').DataTable({
                    "autoWidth": false,
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "order": [[1, 'asc']],
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
                        "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ category sets)",
                        "paginate": {
                            "first": "<<", "previous": "<", "next": ">", "last": ">>"
                        },
                    },
                });
                TIMAAT.Categories.categorySetDataTable.on('select deselect', function () {
                    const selectedCategorySets = TIMAAT.Categories.categorySetDataTable.rows({selected: true}).data().toArray();

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
            if (!TIMAAT.Categories.categoryDataTable) {
                TIMAAT.Categories.categoryDataTable = $('#categoryDataTable').DataTable({
                    "autoWidth": false,
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "order": [[1, 'asc']],
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
                        "url": "api/category/list",
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
                                <div class="btn-group" role="group" aria-label="Categories row options">
                                  <button type="button" class="btn btn-sm btn-outline btn-secondary categoryEditButton" data-category="${rowJson}"><i class="fas fa-edit"></i></button>
                                  <button type="button" class="btn btn-sm btn-outline btn-danger categoryDeleteButton" data-category="${rowJson}"><i class="fas fa-trash-alt"></i></button>
                                </div>
                              </div>`
                        }
                    }],
                    "language": {
                        "decimal": ",",
                        "thousands": ".",
                        "search": "Search",
                        "lengthMenu": "Show _MENU_ entries",
                        "zeroRecords": "No category found.",
                        "info": "Page _PAGE_ of _PAGES_ &middot; (_MAX_ categories total)",
                        "infoEmpty": "No categories available.",
                        "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ categories)",
                        "paginate": {
                            "first": "<<", "previous": "<", "next": ">", "last": ">>"
                        },
                    },
                });
                TIMAAT.Categories.categoryDataTable.on('select deselect', function () {
                    TIMAAT.Categories.updateCategorySelectAllCheckboxState()
                });
            } else {
                //The datatable was already initialized. We just need to reload the entries
                TIMAAT.Categories.categoryDataTable.ajax.reload();
            }
        }
    }
}))