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
        _sortable;

        constructor(id, title, data, sortable = true) {
            this._id = id;
            this._title = title;
            this._data = data;
            this._sortable = sortable;
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

        get sortable() {
            return this._sortable;
        }

        render(data, type, row) {
            throw new Error("This method need to get overridden")
        }
    }
    TIMAAT.Table.FieldTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data, sortable = true) {
            super(id, title, data, sortable);
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
        constructor(id, title, data, sortable = true) {
            super(id, title, data, sortable);
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
        constructor(id, title, data, sortable = true) {
            super(id, title, data, sortable);
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
        constructor(id, title, data, sortable = true) {
            super(id, title, data, sortable);
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

    TIMAAT.Table.ValueMapperTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        _valueMap;

        constructor(id, title, data, valueMap, sortable = true) {
            super(id, title, data, sortable);
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
        constructor(id, title, imagePathGeneratorFunction) {
            super(id, title, "", false);
            this._imagePathGeneratorFunction = imagePathGeneratorFunction;

            this.render = this.render.bind(this);
        }

        render(data, type, row) {
            const imagePath = this._imagePathGeneratorFunction(row);
            let imageSrc = imagePath ?? "img/preview-placeholder.png"
            return `<img src="${imageSrc}" width="150" height="auto" alt="Image cell"/>`
        }
    }

    TIMAAT.Table.AddressTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data) {
            super(id, title, data, false);
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

        constructor(tableId, containerSelector, tableColumnConfigs, defaultActiveTableColumnConfigs, dataUrl, reorderableColumns = true, active = true, urlSearchParams = new URLSearchParams()) {
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

        set urlSearchParams(urlSearchParams) {
            this._urlSearchParams = urlSearchParams
            this.draw()
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
                        orderable: currentTableColumnConfig.sortable,
                    });
                    $('<th>').text(currentTableColumnConfig.title).appendTo($headerRow);
                }
                $table.appendTo(this._$container)

                const ajaxUrl = this._dataUrl + "?" + this._urlSearchParams.toString()
                console.log(ajaxUrl)
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
                    "stateSave": true,
                    "scrollX": true,
                    "rowId": 'id',
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

    TIMAAT.Table.ColumnSelectorPopover = class {
        _table
        _tableColumnConfigs
        _$columnSelectorButton

        constructor(table, columnSelectorButtonSelector) {
            this._table = table;
            this._tableColumnConfigs = table.tableColumnConfigs.sort((a, b) => a.title.localeCompare(b.title));

            this._$columnSelectorButton = $(columnSelectorButtonSelector)
            this._$columnSelectorButton.on('click', this.openPopover);

            this.createPopover();
        }

        createPopover() {
            const popoverMenuItems = this.createMenuItems();
            this._$columnSelectorButton.popover({
                title: "Columns",
                content: popoverMenuItems,
                html: true,
                placement: "bottom"
            })
        }

        createMenuItems() {
            const $listGroup = $(`<ul class="list-group"></ul>`)
            const currentActiveTableColumnIds = this._table.activeTableColumnIds

            for (const currentTableColumnConfig of this._tableColumnConfigs) {
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