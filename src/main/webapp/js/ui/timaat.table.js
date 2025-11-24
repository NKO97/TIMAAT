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
         * @param imagePathGeneratorFunction: (row) => string | null
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

    TIMAAT.Table.Table = class {
        _tableColumnConfigsById
        _activeTableColumnIds
        _selector
        _dataUrl
        _$headerRow
        _dataTable = null;

        constructor(selector, tableColumnConfigs, activeTableColumnConfigIds, dataUrl) {
            this._tableColumnConfigsById = new Map()
            for (let tableColumnConfig of tableColumnConfigs) {
                this._tableColumnConfigsById.set(tableColumnConfig.id, tableColumnConfig);
            }
            this._selector = selector
            this._activeTableColumnIds = activeTableColumnConfigIds;
            this._dataUrl = dataUrl;
            this._$headerRow = $(selector + " thead tr")
        }

        set activeTableColumnIds(activeTableColumnConfigIds) {
            this._activeTableColumnIds = activeTableColumnConfigIds;
        }

        draw() {
            const columnConfigs = []
            this._$headerRow.empty()
            for (let activeTableColumnId of this._activeTableColumnIds) {
                const currentTableColumnConfig = this._tableColumnConfigsById.get(activeTableColumnId);
                columnConfigs.push({
                    title: currentTableColumnConfig.title,
                    data: currentTableColumnConfig.data,
                    render: currentTableColumnConfig.render,
                    orderable: currentTableColumnConfig.sortable
                });
                $('<th>').text(currentTableColumnConfig.title).appendTo(this._$headerRow);
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
}, window))