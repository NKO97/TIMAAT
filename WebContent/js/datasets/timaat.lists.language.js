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

}(function (TIMAAT) {

	TIMAAT.LanguageLists = {
    languages: null,

		init: function() {
			this.initLanguages();
    },

		initLanguages: function() {
      // console.log("TCL: initLanguages: function()");
      // nav-bar functionality
      $('#languageTab').on('click', function(event) {
        TIMAAT.LanguageLists.loadLanguages();
        TIMAAT.UI.displayComponent('language', 'languageTab', 'languageDataTable');
        TIMAAT.URLHistory.setURL(null, 'Language Datasets', '#language/list');
      });

      // confirm delete language modal functionality
      $('#languageListLanguageDeleteModalSubmitButton').on('click', async function(ev) {
        var modal = $('#languageListLanguageDeleteModal');
        var language = modal.data('language');
        if (language) {
          try {
            await TIMAAT.LanguageService.deleteLanguage(language.model.id);
            language.remove();
          } catch(error) {
            console.error("ERROR: ", error);
          }
          try {
            await TIMAAT.UI.refreshDataTable('language');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        // TIMAAT.LanguageLists.loadLanguages();
        $('#languageTab').trigger('click');
      });

			// delete button (in form) handler
      $('#languageFormMetadataDeleteButton').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#languageListLanguageDeleteModal').data('language', $('#languageFormMetadata').data('language'));
        $('#languageListLanguageDeleteModal').modal('show');
			});

			// edit content form button handler
      $('#languageFormMetadataEditButton').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#languageFormMetadata').data('language'), 'language', 'edit');
			});

      // submit content form button functionality
			$('#languageFormMetadataSubmitButton').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();
				if (!$('#languageFormMetadata').valid()) return false;

				// the original language model (in case of editing an existing language)
				var language = $('#languageFormMetadata').data('language');
        // console.log("TCL: language", language);

				// create/edit language window submitted data
				var formDataRaw = $('#languageFormMetadata').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        // console.log("TCL: formDataObject", formDataObject);
        var duplicateName;
        var duplicateCode;
        if (duplicateName || duplicateCode) {
          $('#languageListLanguageDuplicateModal').modal('show');
        }
        if (language) { // update language
          if (language.model.id != 1) { //* Do not change 'default' entry
            duplicateName = await TIMAAT.LanguageService.checkForDuplicateName(formDataObject.name, language.model.id);
            duplicateCode = await TIMAAT.LanguageService.checkForDuplicateCode(formDataObject.code, language.model.id);
            if (duplicateName || duplicateCode) {
              $('#languageListLanguageDuplicateModal').modal('show');
              return;
            } else {
              // console.log("TCL: language", language);
              language.model.name = formDataObject.name;
              language.model.code = formDataObject.code;
              let languageData = language.model;
              delete languageData.ui;
              await TIMAAT.LanguageLists.updateLanguage(languageData);
            }
          }
        }
        else { // create new language
          duplicateName = await TIMAAT.LanguageService.checkForDuplicateName(formDataObject.name, 0);
          duplicateCode = await TIMAAT.LanguageService.checkForDuplicateCode(formDataObject.code, 0);
          if (duplicateName || duplicateCode) {
            $('#languageListLanguageDuplicateModal').modal('show');
            return;
          } else {
            var languageModel = await TIMAAT.LanguageLists.createLanguageModel(formDataObject);
            var newLanguage = await TIMAAT.LanguageLists.createLanguage(languageModel);
            language = new TIMAAT.Language(newLanguage);
            $('#languageFormMetadata').data('language', language);
            $('#listsTabMetadata').data('type', 'language');
            $('#listsTabMetadata').trigger('click');
          }
        }
        TIMAAT.LanguageLists.showAddLanguageButton();
        await TIMAAT.UI.refreshDataTable('language');
        TIMAAT.UI.addSelectedClassToSelectedItem('language', language.model.id);
        TIMAAT.UI.displayDataSetContent('dataSheet', language, 'language');
			});

			// cancel add/edit button in content form functionality
			$('#languageFormMetadataDismissButton').on('click', async function(event) {
        TIMAAT.LanguageLists.showAddLanguageButton();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#languageTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

		},

		load: function() {
      this.loadLanguages();
		},

		loadLanguages: function() {
			$('#listsTabMetadata').data('type', 'language');
			TIMAAT.UI.addSelectedClassToSelectedItem('language', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
      this.showAddLanguageButton();
			this.setLanguagesList();
		},

		loadLanguagesDataTables: function() {
      this.setupLanguageDataTable();
		},

		setLanguagesList: function() {
			if ( this.languages == null) return;
			if ( this.dataTableLanguages ) {
				this.dataTableLanguages.ajax.reload(null, false);
        TIMAAT.UI.clearLastSelection('language');
			}
    },

		setupLanguageDataTable: function() {
      // console.log("TCL: setupLanguageDataTable");
      // setup dataTable
      this.dataTableLanguages = $('#languageTable').DataTable({
        "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "order"         : [[ 0, 'asc' ]],
        "pagingType"    : "full", // "simple_numbers",
        "dom"           : '<lf<t>ip>',
        "processing"    : true,
        "stateSave"     : true,
        "scrollY"       : "60vh",
        "scrollCollapse": true,
        "scrollX"       : false,
        "rowId"         : 'id',
        "serverSide"    : true,
        "ajax"          : {
          "url"        : "api/language/list",
          "contentType": "application/json; charset=utf-8",
          "dataType"   : "json",
          "data"       : function(data) {
            let serverData = {
              draw   : data.draw,
              start  : data.start,
              length : data.length,
              orderby: data.columns[data.order[0].column].name,
              dir    : data.order[0].dir,
            }
            if ( data.search && data.search.value && data.search.value.length > 0 )
              serverData.search = data.search.value;
            return serverData;
          },
          "beforeSend": function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
          },
          "dataSrc": function(data) {
            // console.log("TCL: data", data);
            // setup model
            var langs = Array();
            data.data.forEach(function(language) {
              if ( language.id > 0 ) {
                langs.push(new TIMAAT.Language(language));
              }
            });
            TIMAAT.LanguageLists.languages = langs;
            TIMAAT.LanguageLists.languages.model = data.data;
            return data.data;
          }
        },
        "initComplete": async function( settings, json ) {
					TIMAAT.LanguageLists.dataTableLanguages.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let index = i+1;
							let position = $('table tbody > tr:nth-child('+index+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedLanguageId) {
						TIMAAT.UI.clearLastSelection('language');
						$(row).addClass('selected');
            TIMAAT.UI.selectedLanguageId = data.id; //* as it is set to null in clearLastSelection
					}
				},
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: data", data);
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let languageElement = $(row);
          let language = data;
          language.ui = languageElement;
          languageElement.data('language', language);

          languageElement.on('click', '.name', function(event) {
            event.stopPropagation();
            TIMAAT.LanguageLists.setDataTableOnItemSelect(language.id);
          });
        },
        "columns": [
          { data: 'id', name: 'name', className: 'name', render: function(data, type, language, meta) {
            let nameDisplay = `<p>`+ language.name +`</p>`;
            return nameDisplay;
            }
          },
        ],
        "language": {
          "decimal"     : ",",
          "thousands"   : ".",
          "search"      : "Search",
          "lengthMenu"  : "Show _MENU_ entries",
          "zeroRecords" : "No languages found.",
          "info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ languages total)",
          "infoEmpty"   : "No languages available.",
          "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ language(s))",
          "paginate"    : {
            "first"   : "<<",
            "previous": "<",
            "next"    : ">",
            "last"    : ">>"
          },
        },
      });
    },

    setDataTableOnItemSelect: function(selectedItemId) {
			// show tag editor - trigger popup
			TIMAAT.UI.hidePopups();
			// switch (this.subNavTab) {
			// 	case 'dataSheet':
        TIMAAT.UI.displayDataSetContentContainer('languageDataTab', 'languageFormMetadata', 'language');
			// 	break;
			// }
			TIMAAT.UI.clearLastSelection('language');
			let index;
			let selectedItem;
      index = this.languages.findIndex(({model}) => model.id === selectedItemId);
      selectedItem = this.languages[index];
      $('#listsTabMetadata').data('type', 'language');
      $('#languageFormMetadata').data('language', selectedItem);
      TIMAAT.UI.addSelectedClassToSelectedItem('language', selectedItemId);
      TIMAAT.URLHistory.setURL(null, selectedItem.model.name + ' · Datasets · Language', '#language/' + selectedItem.model.id);
      this.showAddLanguageButton();
			TIMAAT.UI.displayDataSetContent('dataSheet', selectedItem, 'language');
    },

		addLanguage: function() {
			// console.log("TCL: addLanguage");
      TIMAAT.UI.displayDataSetContentContainer('listsTabMetadata', 'languageFormMetadata');
      $('#listsTabMetadata').data('type', 'language');
			$('#languageFormMetadata').data('language', null);
      languageFormMetadataValidator.resetForm();

      TIMAAT.UI.addSelectedClassToSelectedItem('language', null);
      // setup form
			$('#languageFormMetadata').trigger('reset');
      this.initFormDataSheetData();
      this.initFormDataSheetForEdit();
      $('#languageFormMetadataSubmitButton').html("Add");
      $('#languageFormHeader').html("Add language");
		},

		languageFormDataSheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      // TIMAAT.UI.addSelectedClassToSelectedItem('language', data.model.id);
      $('#languageFormMetadata').trigger('reset');
      $('#listsTabMetadata').data('type', 'language');
      this.initFormDataSheetData();
      languageFormMetadataValidator.resetForm();

      if ( action == 'show') {
        $('#languageFormMetadata :input').prop('disabled', true);
        this.initFormForShow();
        $('#languageFormHeader').html("Language data sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit();
        $('#languageFormMetadataSubmitButton').html("Save");
        $('#languageFormHeader').html("Edit Language");
      }
      // name data
      $('#languageMetadataName').val(data.model.name);
      $('#languageMetadataCode').val(data.model.code);

      $('#languageFormMetadata').data('language', data);
    },

    initFormDataSheetForEdit: function() {
      this.hideFormButtons();
      this.hideAddLanguageButton();
      $('#languageFormMetadata :input').prop('disabled', false);
      $('#languageFormMetadataSubmitButton').show();
      $('#languageFormMetadataDismissButton').show();
      $('#languageMetadataName').focus();
    },

    initFormForShow: function(model) {
      $('.formButtons').prop('disabled', false);
      $('.formButtons :input').prop('disabled', false);
      $('.formButtons').show();
      $('#languageFormMetadataSubmitButton').hide();
      $('#languageFormMetadataDismissButton').hide();
    },

    initFormDataSheetData: function() {
      $('.dataSheetData').hide();
      $('.nameData').show();
    },

    hideFormButtons: function() {
			$('.formButtons').hide();
			$('.formButtons').prop('disabled', true);
			$('.formButtons :input').prop('disabled', true);
		},

    showAddLanguageButton: function() {
      $('.addLanguageButton').prop('disabled', false);
      $('.addLanguageButton :input').prop('disabled', false);
      $('.addLanguageButton').show();
    },

    hideAddLanguageButton: function() {
      $('.addLanguageButton').hide();
      $('.addLanguageButton').prop('disabled', true);
      $('.addLanguageButton :input').prop('disabled', true);
    },

    createLanguageModel: async function(formDataObject) {
      // console.log("TCL: formDataObject", formDataObject);
      var model = {
        id              : 0,
        name            : formDataObject.name,
        code            : formDataObject.code,
        isSystemLanguage: false                 //! TODO
      };
      return model;
    },

    createLanguage: async function(model) {
      // console.log("TCL: createLanguage: model: ", model);
      try {
        // create language
        var newModel = await TIMAAT.LanguageService.createLanguage(model);
        // console.log("TCL: newModel", newModel);
        model.id = newModel.id;
      } catch(error) {
        console.error("ERROR: ", error);
      };
      // console.log("TCL: model", model);
      return (model);
    },

    // TODO update languages
    updateLanguage: async function(language) {
      // console.log("TCL: updateLanguage: async function -> beginning of update: language ", language);
      try { // update translation
        var tempModel = await TIMAAT.LanguageService.updateLanguage(language);
        language = tempModel;
      } catch(error) {
        console.error("ERROR: ", error);
      };

      await TIMAAT.UI.refreshDataTable('language');
    },

	}
}, window));
