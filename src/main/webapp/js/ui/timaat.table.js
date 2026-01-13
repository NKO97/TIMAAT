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
    TIMAAT.Table = {}
    TIMAAT.Table.TableColumnConfig = class {
        _id;
        _title;
        _data;
        _sortingParameterName;
        _groupName;

        constructor(id, title, data, sortingParameterName = null, groupName = null) {
            this._id = id;
            this._title = title;
            this._data = data;
            this._sortingParameterName = sortingParameterName;
            this._groupName = groupName;
        }

        get title() {
            return this._title;
        }

        get data() {
            return this._data;
        }

        get id() {
            return this._id;
        }

        get sortingParameterName() {
            return this._sortingParameterName;
        }

        get groupName() {
            return this._groupName;
        }

        render(data, type, row) {
            throw new Error("This method need to get overridden")
        }

        createdCell(td, cellData, rowData, row, col) {
        }
    }
    TIMAAT.Table.FieldTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data, sortingParameterName = null, groupName = null) {
            super(id, title, data, sortingParameterName, groupName);
        }

        render(data, type, row) {
            let cellValue = data
            if (!data || (typeof data === 'string' && data.length === 0)) {
                cellValue = "-"
            }

            return `<p>${cellValue}</p>`
        }
    }
    TIMAAT.Table.DateTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data, sortingParameterName = null, groupName = null) {
            super(id, title, data, sortingParameterName, groupName);
        }

        render(data, type, row) {
            let cellValue
            if (!data || (typeof data === 'string' && data.length === 0)) {
                cellValue = "-"
            } else {
                cellValue = moment.utc(data).format('YYYY-MM-DD');
            }

            return `<p>${cellValue}</p>`
        }
    }

    TIMAAT.Table.TimeStampTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data, sortingParameterName = null, groupName = null) {
            super(id, title, data, sortingParameterName, groupName);
        }

        render(data, type, row) {
            let cellValue
            if (!data) {
                cellValue = "-"
            } else {
                cellValue = TIMAAT.Util.formatTime(data);
            }

            return `<p>${cellValue}</p>`
        }
    }

    TIMAAT.Table.BooleanTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data, sortingParameterName = null, groupName = null) {
            super(id, title, data, sortingParameterName, groupName);
        }

        render(data, type, row) {
            let cellValue
            if (data == null) {
                cellValue = "<p>-</p>"
            } else {
                if (data) {
                    cellValue = `<span class="fas fa-check"></span>`
                } else {
                    cellValue = `<span><strong>X</strong></span>`
                }
            }

            return cellValue
        }
    }

    TIMAAT.Table.ActionsTableColumnButton = class {
        _onClick
        _faIconClass
        _title

        /**
         * @param title used as tooltip
         * @param onClick (row) => void
         * @param faIconClass the name of the fontawesome icon class
         */
        constructor(title, onClick, faIconClass) {
            this._onClick = onClick
            this._faIconClass = faIconClass
            this._title = title
        }

        createButton() {
            return $(`<button title="${this._title}" class="btn btn-sm btn-outline btn-secondary fas ${this._faIconClass}"></button>`)
        }

        get onClick() {
            return this._onClick;
        }
    }

    TIMAAT.Table.ActionsTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        _actionTableColumnButtons

        constructor(id, actionTableColumnButtons) {
            super(id, "Actions", null, null);
            this._actionTableColumnButtons = actionTableColumnButtons;

            this.render = this.render.bind(this);
            this.createdCell = this.createdCell.bind(this);
        }

        render(data, type, row) {
            const $actionsTableCell = $("<div class='d-flex justify-content-between actionsTableCell'></div>")

            return $actionsTableCell.prop('outerHTML')
        }

        createdCell(td, cellData, rowData, row, col) {
            const $actionsTableCell = $(td).find(".actionsTableCell")
            for (let actionTableColumnButton of this._actionTableColumnButtons) {
                const $button = actionTableColumnButton.createButton()
                $button.on("click", () => actionTableColumnButton.onClick(rowData))
                $actionsTableCell.append($button)
            }
        }
    }

    TIMAAT.Table.ValueMapperTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        _valueMap;

        constructor(id, title, data, valueMap, sortingParameterName = null, groupName = null) {
            super(id, title, data, sortingParameterName, groupName);
            this._valueMap = valueMap;

            this.render = this.render.bind(this);
        }

        render(data, type, row) {
            let cellValue = '-'

            if (data && this._valueMap.has(data)) {
                cellValue = this._valueMap.get(data)
            }

            return `<p>${cellValue}</p>`
        }
    }

    TIMAAT.Table.ImageDownloadTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        _imagePathGeneratorFunction;

        /**
         * Constructs a table column downloading an image from the generated path of the
         * imagePathGeneratorFunction.
         * @param id
         * @param title
         * @param imagePathGeneratorFunction : (row) => string | null , (row) => Promise<string | null>
         */
        constructor(id, title, imagePathGeneratorFunction, groupName = null) {
            super(id, title, null, null, groupName);
            this._imagePathGeneratorFunction = imagePathGeneratorFunction;

            this.render = this.render.bind(this);
            this.createdCell = this.createdCell.bind(this);
        }

        render(data, type, row) {
            return `<img src="img/preview-placeholder.png" width="150" height="auto" alt="Image cell"/>`
        }

        createdCell(td, cellData, rowData, row, col) {
            const $img = $(td).find("img");

            if (this._imagePathGeneratorFunction.constructor.name === 'AsyncFunction') {
                this._imagePathGeneratorFunction(rowData).then(imgSrc => {
                    if (imgSrc) {
                        $img.prop("src", imgSrc);
                    }
                })
            } else {
                const imgSrc = this._imagePathGeneratorFunction(rowData)
                if (imgSrc) {
                    $img.prop("src", imgSrc);
                }
            }
        }
    }

    TIMAAT.Table.AddressTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data, groupName = null) {
            super(id, title, data, null, groupName);
        }

        render(data, type, row) {
            if (data) {
                return `<p>${data.street ?? ""} ${data.streetNumber ?? ""} ${data.streetAddition ?? ""}<br/>${data.postalCode} ${data.city}</p>`
            }
            return `<p>-</p>`
        }
    }

    TIMAAT.Table.Table = class {
        _active
        _tableColumnConfigsById
        _activeTableColumnIds
        _$container
        _dataUrl
        _tableId
        _reorderableColumns
        _urlSearchParams
        _dataTable = null;
        _searchable;

        constructor(tableId, containerSelector, tableColumnConfigs, defaultActiveTableColumnConfigs, dataUrl, reorderableColumns = true, active = true, urlSearchParams = new URLSearchParams(), searchable = true) {
            this._tableColumnConfigsById = new Map()
            for (let tableColumnConfig of tableColumnConfigs) {
                this._tableColumnConfigsById.set(tableColumnConfig.id, tableColumnConfig);
            }
            this._$container = $(containerSelector)
            this._activeTableColumnIds = TIMAAT.Table.TableConfigurationStorage.getActiveColumnsForTable(tableId) ?? defaultActiveTableColumnConfigs
            this._dataUrl = dataUrl;
            this._tableId = tableId
            this._reorderableColumns = reorderableColumns;
            this._active = active
            this._urlSearchParams = urlSearchParams
            this._searchable = searchable

            this.draw()
        }

        /**
         * Changes the active state of the specified column
         * @param columnId
         * @param active
         * @return boolean indicating the new state
         */
        changeTableColumnActivState(columnId, active) {
            const activeColumnIndex = this._activeTableColumnIds.indexOf(columnId);
            let changed = false

            if (active && activeColumnIndex === -1) {
                changed = true
                this._activeTableColumnIds.push(columnId);
                this.draw()
            } else if (!active && activeColumnIndex > -1 && this.activeTableColumnIds.length > 1) {
                changed = true
                this._activeTableColumnIds.splice(activeColumnIndex, 1);
                this.draw()
            }

            if (changed) {
                TIMAAT.Table.TableConfigurationStorage.saveActiveColumnsForTable(this._activeTableColumnIds, this._tableId)
                return active
            }

            return !active
        }

        set active(active) {
            const redrawNecessary = this._active !== active
            this._active = active

            if (redrawNecessary) {
                this.draw()
            }
        }

        updateUrlSearchParam(parameterName, parameterValues) {
            this._urlSearchParams.delete(parameterName)
            for (let parameterValue of parameterValues) {
                this._urlSearchParams.append(parameterName, parameterValue)
            }

            this.draw()
        }

        clearUrlSearchParam(parameterName) {
            this._urlSearchParams.delete(parameterName)
        }

        getUrlSearchParamValues(parameterName) {
            return this._urlSearchParams.getAll(parameterName)
        }

        get activeTableColumnIds() {
            return this._activeTableColumnIds;
        }

        get tableColumnConfigs() {
            return Array.from(this._tableColumnConfigsById.values());
        }

        draw() {
            const self = this
            this._dataTable?.clear().destroy(true)
            this._$container.empty()

            if (this._active) {
                const $table = $(`<table id="${this._tableId}" class="table table-striped table-bordered table-hover"></table>`)
                const $tableHead = $(`<thead class="thead-dark"></thead>`)
                const $tableBody = $(`<tbody></tbody>`)
                $tableHead.appendTo($table)
                $tableBody.appendTo($table)

                const $headerRow = $("<tr></tr>")
                $headerRow.appendTo($tableHead)

                const columnConfigs = []
                for (let activeTableColumnId of this._activeTableColumnIds) {
                    const currentTableColumnConfig = this._tableColumnConfigsById.get(activeTableColumnId);
                    columnConfigs.push({
                        title: currentTableColumnConfig.title,
                        data: currentTableColumnConfig.data,
                        render: currentTableColumnConfig.render,
                        orderable: currentTableColumnConfig.sortingParameterName !== null,
                        fnCreatedCell: currentTableColumnConfig.createdCell,
                        name: currentTableColumnConfig.sortingParameterName,
                    });
                    $('<th>').text(currentTableColumnConfig.title).appendTo($headerRow);
                }
                $table.appendTo(this._$container)

                const ajaxUrl = this._dataUrl + "?" + this._urlSearchParams.toString()

                this._dataTable = $table.DataTable({
                    "destroy": true,
                    "autoWidth": false,
                    "colReorder": {
                        "enable": this._reorderableColumns,
                        "order": Array.from(columnConfigs.keys())
                    },
                    "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                    "pagingType": "full",
                    "dom": '<lf<t>ip>',
                    "processing": true,
                    "searching": this._searchable,
                    "stateSave": true,
                    "scrollX": true,
                    "serverSide": true,
                    "ajax": {
                        "url": ajaxUrl,
                        "contentType": "application/json; charset=utf-8",
                        "dataType": "json",
                        "beforeSend": function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Bearer ' + TIMAAT.Service.token);
                        },
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
                        }
                    },
                    "initComplete": function () {
                        if (self._reorderableColumns) {
                            self._dataTable?.colReorder.reset()
                        }
                    },
                    "language": {
                        info: "Page _PAGE_ of _PAGES_ ( _TOTAL_ total entries)",
                        infoFiltered: "",
                        paginate    : {
                            "first"   : "<<",
                            "previous": "<",
                            "next"    : ">",
                            "last"    : ">>"
                        }
                    },
                    "columns": columnConfigs
                })

                $table.on('column-reorder.dt', (e, settings, details) => {
                    if (!details || !details.mapping) return;

                    const newOrder = details.mapping.map(i => self._activeTableColumnIds[i]);

                    self._activeTableColumnIds = newOrder;
                    TIMAAT.Table.TableConfigurationStorage
                        .saveActiveColumnsForTable(newOrder, this._tableId);
                });
            }
        }

        /*
        Sometimes the table dimension couldn't be calculated correctly and need to get recalculated.
        E.g. The table is located inside a collapse which is initially in a hidden state.
         */
        resizeToParent() {
            this._dataTable?.columns.adjust().draw()
        }
    }
    /**
     * This component opens a popover when clicking on the target button showing a list menu
     * which can be used to select specific values used as query parameter of a list
     */
    TIMAAT.Table.QueryParameterSelectorPopover = class {
        _table
        _queryParameterName
        _title
        _queryParameterValues
        _$queryParameterSelectorButton
        _minimumSelectedValues
        _currentSelectedParameterValues

        constructor(title, table, queryParameterName, queryParameterValues, queryParameterSelectorButtonSelector, minimumSelectedValues = 1, initiallyAllSelected = true) {
            this._table = table;
            this._queryParameterValues = queryParameterValues.sort((a, b) => a.title.localeCompare(b.title))
            this._queryParameterName = queryParameterName
            this._$queryParameterSelectorButton = $(queryParameterSelectorButtonSelector)
            this._title = title
            this._minimumSelectedValues = minimumSelectedValues
            this._currentSelectedParameterValues = new Set()

            this._$queryParameterSelectorButton.on('click', this.openPopover);
            this._$queryParameterSelectorButton.prop("title", this._title)

            if (initiallyAllSelected) {
                for (let queryParameterValue of queryParameterValues) {
                    this._currentSelectedParameterValues.add(queryParameterValue.value)
                }

                this._table.updateUrlSearchParam(queryParameterName, Array.from(this._currentSelectedParameterValues))
            }

            this.createPopover();
        }

        createPopover() {
            const popoverMenuItems = this.createMenuItems();
            this._$queryParameterSelectorButton.popover({
                title: this._title,
                content: popoverMenuItems,
                html: true,
                placement: "bottom"
            })
        }

        createMenuItems() {
            const $listGroup = $(`<ul class="list-group"></ul>`)

            for (const currentQueryParameterValue of this._queryParameterValues) {
                const $currentListGroupItemCheckbox = $(`<input class="ml-2" type="checkbox">`)
                const initialSelected = this._currentSelectedParameterValues.has(currentQueryParameterValue.value);
                $currentListGroupItemCheckbox.prop("checked", initialSelected)

                const table = this._table
                const queryParameterName = this._queryParameterName
                const selectedParameterValues = this._currentSelectedParameterValues
                const minimumSelectedValues = this._minimumSelectedValues

                $currentListGroupItemCheckbox.on("change", (e) => {
                    if (e.target.checked) {
                        selectedParameterValues.add(currentQueryParameterValue.value)
                    } else if (selectedParameterValues.size > minimumSelectedValues && selectedParameterValues.has(currentQueryParameterValue.value)) {
                        selectedParameterValues.delete(currentQueryParameterValue.value)
                    } else {
                        $currentListGroupItemCheckbox.prop("checked", true)
                    }

                    table.updateUrlSearchParam(queryParameterName, Array.from(selectedParameterValues))
                })

                const $currentListGroupItem = $(`<li class="list-group-item d-flex justify-content-between align-items-center">${currentQueryParameterValue.title}</li>`)
                $currentListGroupItem.append($currentListGroupItemCheckbox)

                $listGroup.append($currentListGroupItem)
            }

            return $listGroup
        }
    }


    TIMAAT.Table.ColumnSelectorPopover = class {
        _table
        _tableColumnConfigs
        _$columnSelectorButton

        constructor(table, columnSelectorButtonSelector) {
            this._table = table;
            this._tableColumnConfigs = table.tableColumnConfigs.sort((a, b) => a.title.localeCompare(b.title));

            this._$columnSelectorButton = $(columnSelectorButtonSelector)
            this._$columnSelectorButton.on('click', this.openPopover);
            this._$columnSelectorButton.prop("title", "Columns")

            this.createPopover();
        }

        createPopover() {
            const popoverMenuItems = this.createPopoverContent();
            this._$columnSelectorButton.popover({
                title: "Columns",
                content: popoverMenuItems,
                html: true,
                placement: "bottom",
                customClass: "ColumnSelectorPopover"
            })
        }

        createListGroup(tableColumnConfigs) {
            const currentActiveTableColumnIds = this._table.activeTableColumnIds
            const $listGroup = $(`<ul class="list-group"></ul>`)

            for (const currentTableColumnConfig of tableColumnConfigs) {
                const $currentListGroupItemCheckbox = $(`<input class="ml-2" type="checkbox">`)
                const initialSelected = currentActiveTableColumnIds.indexOf(currentTableColumnConfig.id) > -1;

                $currentListGroupItemCheckbox.prop("checked", initialSelected)

                const table = this._table
                $currentListGroupItemCheckbox.on("change", (e) => {
                    const newState = table.changeTableColumnActivState(currentTableColumnConfig.id, e.target.checked);
                    $currentListGroupItemCheckbox.prop("checked", newState)
                })

                const $currentListGroupItem = $(`<li class="list-group-item d-flex justify-content-between align-items-center">${currentTableColumnConfig.title}</li>`)
                $currentListGroupItem.append($currentListGroupItemCheckbox)

                $listGroup.append($currentListGroupItem)
            }

            return $listGroup
        }

        createPopoverContent() {
            const defaultGroupColumnConfigs = []
            const columnConfigsByGroupName = new Map()

            const $popoverContent = $('<div></div>')

            for (let currentTableColumnConfig of this._tableColumnConfigs) {
                const currentGroupName = currentTableColumnConfig.groupName
                if (currentGroupName) {
                    if (!columnConfigsByGroupName.has(currentGroupName)) {
                        columnConfigsByGroupName.set(currentGroupName, [])
                    }
                    const groupColumnConfigs = columnConfigsByGroupName.get(currentGroupName)
                    groupColumnConfigs.push(currentTableColumnConfig)
                } else {
                    defaultGroupColumnConfigs.push(currentTableColumnConfig)
                }
            }


            const $defaultListGroup = this.createListGroup(defaultGroupColumnConfigs)
            $popoverContent.append($defaultListGroup)


            for (const currentGroupName of columnConfigsByGroupName.keys().toArray().sort((a, b) => a.localeCompare(b))) {
                const groupColumnConfigs = columnConfigsByGroupName.get(currentGroupName)
                $popoverContent.append(`<span class="mt-1">${currentGroupName}</span>`)

                const $currentListGroup = this.createListGroup(groupColumnConfigs)
                $popoverContent.append($currentListGroup)
            }

            return $popoverContent
        }
    }
    TIMAAT.Table.TableConfigurationStorage = {
        saveActiveColumnsForTable: function (activeColumns, tableId) {
            const localStorageIdentifier = TIMAAT.Table.TableConfigurationStorage.createLocalStorageIdentifierForActiveColumns(tableId)
            localStorage.setItem(localStorageIdentifier, JSON.stringify(activeColumns))
        },

        getActiveColumnsForTable: function (tableId) {
            const localStorageIdentifier = TIMAAT.Table.TableConfigurationStorage.createLocalStorageIdentifierForActiveColumns(tableId)
            const activeColumnsJson = localStorage.getItem(localStorageIdentifier)

            if (activeColumnsJson) {
                return JSON.parse(activeColumnsJson)
            }

            return null
        },

        createLocalStorageIdentifierForActiveColumns: function (tableId) {
            return `TIMAAT.Table.${tableId}.activeColumns`
        }
    }
}, window))