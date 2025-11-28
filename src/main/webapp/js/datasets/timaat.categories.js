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
        categoryDataTable: null, categorySetDataTable: null, relatedMusicTable: null, relatedMediumTable: null,
        relatedActorTable: null,

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
            $('#categorySetCreateChangeFormDismissButton').on('click', () => {
                TIMAAT.Categories.showAssignedEntitiesPanel()
            })

            $('#categoriesCategorySetDeleteModalSubmitButton').on('click', async function (event) {
                const categoryId = $(event.currentTarget).data("category-set-id")
                await TIMAAT.CategorySetService.deleteCategorySet(categoryId)

                TIMAAT.Categories.categorySetDataTable?.ajax.reload()
                $('#categoriesCategorySetDeleteModal').modal('hide');
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

            $('#categoryCreateChangeFormDismissButton').on('click', () => {
                TIMAAT.Categories.showAssignedEntitiesPanel()
            })


            //init datatables
            TIMAAT.Categories.relatedMusicTable = TIMAAT.Categories.initRelatedMusicTable()
            TIMAAT.Categories.relatedMediumTable = TIMAAT.Categories.initRelatedMediumTable()
            TIMAAT.Categories.relatedActorTable = TIMAAT.Categories.initRelatedActorTable()
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
            TIMAAT.Categories.showAssignedEntitiesPanel()
        },

        updateCategorySelectAllCheckboxState() {
            const selectedCount = TIMAAT.Categories.categoryDataTable.rows({selected: true}).count()
            const totalCount = TIMAAT.Categories.categoryDataTable.rows().count();
            $('#categoryDataTableSelectAll').prop('checked', selectedCount === totalCount && totalCount > 0);
        },

        createCategorySetDropDown: function () {
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

        initRelatedMusicTable: function () {
            const musicTypesById = new Map([[1, "Anashid"], [2, "Church music"]])
            const columns = [new TIMAAT.Table.FieldTableColumnConfig("title", "Title", "displayTitle.name"), new TIMAAT.Table.FieldTableColumnConfig("id", "ID", "id"), new TIMAAT.Table.FieldTableColumnConfig("beat", "Beat", "beat"),
                new TIMAAT.Table.FieldTableColumnConfig("instrumentation", "Instrumentation", "instrumentation"), new TIMAAT.Table.FieldTableColumnConfig("tempo", "Tempo", "tempo"), new TIMAAT.Table.FieldTableColumnConfig("remark", "Remark", "remark"),
                new TIMAAT.Table.FieldTableColumnConfig("harmony", "Harmony", "harmony"), new TIMAAT.Table.FieldTableColumnConfig("melody", "Melody", "melody"), new TIMAAT.Table.ValueMapperTableColumnConfig("musicType", "Music Type", "musicType.id", musicTypesById)]
            const activeColumnIds = ["id", "title", "musicType", "beat", "instrumentation", "tempo", "remark", "harmony", "melody"]
            const musicTable = new TIMAAT.Table.Table("#categoriesMusicTable", columns, activeColumnIds, "api/music/list")
            $('#musicTableCollapse').on('shown.bs.collapse', (event) => {
                musicTable.resizeToParent()
            });

            return musicTable
        },

        initRelatedMediumTable: function () {
            //TODO: Check subtypes
            const mediaTypesById = new Map([[1, "Audio"], [2, "Document"], [3, "Image"], [4, "Software"], [5, "Text"], [6, " Video"], [7, "Videogame"]])

            const MediumDurationColumnConfig = class MediumDurationColumnConfig extends TIMAAT.Table.TableColumnConfig {
                constructor() {
                    super("duration", "Duration", "");
                }

                render(data, type, row) {
                    let cellValue;
                    if (row.mediumVideo) {
                        cellValue = TIMAAT.Util.formatTime(row.mediumVideo.length);
                    } else if (row.mediumAudio) {
                        cellValue = TIMAAT.Util.formatTime(row.mediumAudio.length);
                    } else {
                        cellValue = "-"
                    }

                    return `<p>${cellValue}</p>`
                }
            }

            const imageThumbnailGeneratorFunction = (row) => {
                let thumbnailPath = null
                if (row.mediumVideo) {
                    thumbnailPath = "/TIMAAT/api/medium/video/" + row.id + "/thumbnail" + "?token=" + row.viewToken
                }

                return thumbnailPath
            }

            const columns = [new TIMAAT.Table.FieldTableColumnConfig("id", "ID", "id"), new TIMAAT.Table.FieldTableColumnConfig("copyright", "Copyright", "copyright"), new TIMAAT.Table.FieldTableColumnConfig("fileHash", "File Hash", "fileHash"),
                new TIMAAT.Table.FieldTableColumnConfig("releaseDate", "ReleaseDate", "releaseDate"), new TIMAAT.Table.DateTableColumnConfig("releaseDate", "Release Date", "releaseDate"), new TIMAAT.Table.DateTableColumnConfig("recordingStartDate", "Recording Start Date", "recordingStartDate"),
                new TIMAAT.Table.DateTableColumnConfig("recordingEndDate", "Recording End Date", "recordingEndDate"), new TIMAAT.Table.FieldTableColumnConfig("remark", "Remark", "remark"), new TIMAAT.Table.FieldTableColumnConfig("title", "Title", "displayTitle.name"),
                new TIMAAT.Table.ValueMapperTableColumnConfig("mediaType", "Media Type", "mediaType.id", mediaTypesById), new MediumDurationColumnConfig(), new TIMAAT.Table.ImageDownloadTableColumnConfig("thumbnail", "Thumbnail", imageThumbnailGeneratorFunction)]
            const activeColumnIds = ["thumbnail", "id", "title", "mediaType", "duration", "releaseDate", 'recordingStartDate', 'recordingEndDate', "fileHash", "copyright", "remark"]
            const mediumTable = new TIMAAT.Table.Table("#categoriesMediumTable", columns, activeColumnIds, "api/medium/list")

            $('#mediumTableCollapse').on('shown.bs.collapse', (event) => {
                mediumTable.resizeToParent()
            });

            return mediumTable
        },

        initRelatedActorTable: function () {
            const actorTypesById = new Map([[1, "Person"], [2, "Collective"]])
            const sexTypesById = new Map([[1, "Female"], [2, "Male"], [3, "Other"], [4, "Unknown"]])

            const columns = [new TIMAAT.Table.FieldTableColumnConfig("id", "ID", "id"), new TIMAAT.Table.ValueMapperTableColumnConfig("type", "Type", "actorType.id", actorTypesById),
                new TIMAAT.Table.FieldTableColumnConfig("name", "Name", "displayName.name"), new TIMAAT.Table.DateTableColumnConfig("nameUsedFrom", "Name used from", "displayName.usedFrom"),
                new TIMAAT.Table.DateTableColumnConfig("nameUsedUntil", "Name used until", "displayName.usedUntil"), new TIMAAT.Table.AddressTableColumnConfig("primaryAddress", "Primary address", "primaryAddress"),
                new TIMAAT.Table.FieldTableColumnConfig("primaryPhoneNumber", "Primary phone number", "primaryPhoneNumber.phoneNumber"), new TIMAAT.Table.FieldTableColumnConfig("primaryEmailAddress", "Primary email address", "primaryEmailAddress.email"),
                new TIMAAT.Table.DateTableColumnConfig("disbanded", "Disbanded", "actorCollective.disbanded"), new TIMAAT.Table.DateTableColumnConfig("founded", "Founded", "actorCollective.founded"),
                new TIMAAT.Table.DateTableColumnConfig("dateOfBirth", "Date of birth", "actorPerson.dateOfBirth"), new TIMAAT.Table.DateTableColumnConfig("dayOfDeath", "Day of death", "actorPerson.dayOfDeath"),
                new TIMAAT.Table.FieldTableColumnConfig("title", "Title", "actorPerson.title"), new TIMAAT.Table.FieldTableColumnConfig("citizenship", "Citizenship", "actorPerson.citizenship"),
                new TIMAAT.Table.FieldTableColumnConfig("placeOfBirth", "Place of birth", "actorPerson.placeOfBirth"), new TIMAAT.Table.FieldTableColumnConfig("placeOfDeath", "Place of death", "actorPerson.placeOfDeath"),
                new TIMAAT.Table.ValueMapperTableColumnConfig("sex", "Sex", "actorPerson.sex.id", sexTypesById)
            ]
            const activeColumnIds = ["id", "name", "nameUsedFrom", "nameUsedUntil", "type", "primaryAddress", "primaryPhoneNumber", "primaryEmailAddress", "disbanded", "founded", "dateOfBirth", "dayOfDeath", "title", "citizenship", "placeOfBirth", "placeOfDeath", "sex"]
            const actorTable = new TIMAAT.Table.Table("#categoriesActorTable", columns, activeColumnIds, "api/actor/list")

            $('#actorTableCollapse').on('shown.bs.collapse', (event) => {
                actorTable.resizeToParent()
            });

            return actorTable
        },

        initRelatedAnnotationTable: function () {
            const columns = []
            const activeColumnIds = []

            const annotationTable = new TIMAAT.Table.Table("#categoriesAnnotationTable", columns, activeColumnIds, "api/annotation/list")
        },

        createCategoriesDropDown: function () {
            const categoryDropDown = $('#categoryMultiSelectDropdown')
            categoryDropDown.empty()
            categoryDropDown.select2({
                closeOnSelect: false,
                scrollAfterSelect: true,
                allowClear: true,
                ajax: {
                    url: 'api/category/selectList',
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

            return categoryDropDown
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

        resetCategorySetCreateChangeFormState($categorySetCreateChangeForm) {
            $categorySetCreateChangeForm.validate().resetForm()
            $categorySetCreateChangeForm.find(".error").removeClass("error")
            $categorySetCreateChangeForm.find(".valid").removeClass("valid")
            $('.categoryCreateChangeFormName-error').remove()
        },

        showAssignedEntitiesPanel() {
            $('.categoriesRightPanelContent').hide()
            $('#categoriesAssignedEntitiesPanel').show()
            TIMAAT.Categories.relatedMusicTable.draw()
            TIMAAT.Categories.relatedMediumTable.draw()
            TIMAAT.Categories.relatedActorTable.draw()
        },

        showAddCategorySetPanel() {
            $('.categoriesRightPanelContent').hide()

            const $categorySetCreateChangeForm = $('#categorySetCreateChangeForm')
            TIMAAT.Categories.resetCategorySetCreateChangeFormState($categorySetCreateChangeForm)
            $categorySetCreateChangeForm.find('#categorySetCreateChangeFormHeader').text('Create category set')

            const categoriesDropDown = TIMAAT.Categories.createCategoriesDropDown()
            const categorySetCreateChangeFormSubmitButton = $categorySetCreateChangeForm.find('#categorySetCreateChangeFormSubmitButton')
            const categorySetNameInput = $categorySetCreateChangeForm.find('#categorySetCreateChangeFormName')

            categoriesDropDown.val([]).trigger('change');
            categorySetNameInput.val("")

            categorySetCreateChangeFormSubmitButton.off('click')
            categorySetCreateChangeFormSubmitButton.on('click', async function (event) {
                event.preventDefault();
                if ($categorySetCreateChangeForm.valid()) {
                    const categorySetName = categorySetNameInput.val()
                    const categoryIds = categoriesDropDown.val();

                    await TIMAAT.CategorySetService.createCategorySet(categorySetName, categoryIds)
                    TIMAAT.Categories.categorySetDataTable?.ajax.reload()
                    TIMAAT.Categories.showAssignedEntitiesPanel()
                }
            })
            $categorySetCreateChangeForm.show()
        },

        showEditCategorySetPanel(categorySet) {
            $('.categoriesRightPanelContent').hide()

            const $categorySetCreateChangeForm = $('#categorySetCreateChangeForm')
            TIMAAT.Categories.resetCategorySetCreateChangeFormState($categorySetCreateChangeForm)
            $categorySetCreateChangeForm.find('#categoryCreateChangeFormHeader').text('Edit category set')

            const categoriesDropDown = TIMAAT.Categories.createCategoriesDropDown()
            const categorySetCreateChangeFormSubmitButton = $categorySetCreateChangeForm.find('#categorySetCreateChangeFormSubmitButton')
            const categorySetNameInput = $categorySetCreateChangeForm.find('#categorySetCreateChangeFormName')

            categoriesDropDown.val([]).trigger('change');
            TIMAAT.CategorySetService.getCategoriesOfCategorySet(categorySet.id).then(categories => {
                for (const currentCategory of categories) {
                    const option = new Option(currentCategory.name, currentCategory.id, true, true)
                    categoriesDropDown.append(option)
                }
            })
            categoriesDropDown.trigger('change');

            categorySetNameInput.val(categorySet.name).trigger('change');
            categorySetCreateChangeFormSubmitButton.off('click')
            categorySetCreateChangeFormSubmitButton.on('click', async function (event) {
                event.preventDefault();
                if ($categorySetCreateChangeForm.valid()) {
                    const categorySetName = categorySetNameInput.val()
                    const categoriesIds = categoriesDropDown.val();

                    await TIMAAT.CategorySetService.updateCategorySet(categorySet.id, categorySetName, categoriesIds)
                    TIMAAT.Categories.categorySetDataTable?.ajax.reload()
                    TIMAAT.Categories.showAssignedEntitiesPanel()
                }
            })
            $categorySetCreateChangeForm.show()
        },

        showDeleteCategorySetModal(categorySet) {
            const $categoriesCategorySetDeleteModal = $('#categoriesCategorySetDeleteModal')

            $categoriesCategorySetDeleteModal.find(".modal-body").text(`Do you really want to delete category set "${categorySet.name}"?`)
            $('#categoriesCategorySetDeleteModalSubmitButton').data('category-set-id', categorySet.id)
            $categoriesCategorySetDeleteModal.modal('show');
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
                for (const currentCategorySet of categorySets) {
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