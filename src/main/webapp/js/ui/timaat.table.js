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
         * @param imagePathGeneratorFunction : (row) => string | null
         */
        constructor(id, title, imagePathGeneratorFunction) {
            super(id, title, "", false);
            this._imagePathGeneratorFunction = imagePathGeneratorFunction;

            this.render = this.render.bind(this);
        }

        render(data, type, row) {
            const imagePath = this._imagePathGeneratorFunction(row);
            let imageSrc = imagePath ?? "img/preview-placeholder.png"
            return `<img src="${imageSrc}" width="150" height="auto" alt="Image column"/>`
        }
    }

    TIMAAT.Table.AddressTableColumnConfig = class extends TIMAAT.Table.TableColumnConfig {
        constructor(id, title, data) {
            super(id, title, data, false);
        }

        render(data, type, row) {
            if(data){
                return `<p>${data.street ?? ""} ${data.streetNumber ?? ""} ${data.streetAddition ?? ""}<br/>${data.postalCode} ${data.city}</p>`
            }
            return `<p>-</p>`
        }
    }

    TIMAAT.Table.Table = class {
        _tableColumnConfigsById
        _activeTableColumnIds
        _selector
        _dataUrl
        _dataTable = null;

        constructor(selector, tableColumnConfigs, activeTableColumnConfigIds, dataUrl) {
            this._tableColumnConfigsById = new Map()
            for (let tableColumnConfig of tableColumnConfigs) {
                this._tableColumnConfigsById.set(tableColumnConfig.id, tableColumnConfig);
            }
            this._selector = selector
            this._activeTableColumnIds = activeTableColumnConfigIds;
            this._dataUrl = dataUrl;
        }

        /**
         * Changes the active state of the specified column
         * @param columnId
         * @param active
         * @return boolean indicating the new state
         */
        changeTableColumnActivState(columnId, active){
            const activeColumnIndex = this._activeTableColumnIds.indexOf(columnId);
            if(active && activeColumnIndex === -1) {
                this._activeTableColumnIds.push(columnId);
                this.draw()
            }else if(!active && activeColumnIndex > -1 && this.activeTableColumnIds.length > 1){
                this._activeTableColumnIds.splice(activeColumnIndex, 1);
                this.draw()
            }

            return this._activeTableColumnIds.indexOf(columnId) > -1
        }

        get activeTableColumnIds() {
            return this._activeTableColumnIds;
        }

        draw() {
            this._dataTable?.clear().destroy()
            const $headerRow = $(this._selector + " thead tr")

            const columnConfigs = []
            $headerRow.empty()
            for (let activeTableColumnId of this._activeTableColumnIds) {
                const currentTableColumnConfig = this._tableColumnConfigsById.get(activeTableColumnId);
                columnConfigs.push({
                    title: currentTableColumnConfig.title,
                    data: currentTableColumnConfig.data,
                    render: currentTableColumnConfig.render,
                    orderable: currentTableColumnConfig.sortable
                });
                $('<th>').text(currentTableColumnConfig.title).appendTo($headerRow);
            }

            this._dataTable = $(this._selector).DataTable({
                "destroy": true,
                "autoWidth": false,
                "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
                "pagingType": "full",
                "dom": '<lf<t>ip>',
                "processing": true,
                "stateSave": true,
                "scrollX": true,
                "rowId": 'id',
                "serverSide": true,
                "ajax": {
                    "url": this._dataUrl,
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
                "columns": columnConfigs
            })
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
        constructor(table, columnSelectorButtonSelector, tableColumnConfigs) {
            this._table = table;
            this._tableColumnConfigs = tableColumnConfigs.sort((a, b) => a.title.localeCompare(b.title));

            this._$columnSelectorButton = $(columnSelectorButtonSelector)
            this._$columnSelectorButton.on('click', this.openPopover);

            this.createPopover();
        }

        createPopover(){
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

            for(const currentTableColumnConfig of this._tableColumnConfigs) {
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
}, window))