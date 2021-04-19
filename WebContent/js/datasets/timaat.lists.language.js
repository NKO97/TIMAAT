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
      $('#language-tab').on('click', function(event) {
        TIMAAT.LanguageLists.loadLanguages();
        TIMAAT.UI.displayComponent('language', 'language-tab', 'language-datatable');
        TIMAAT.URLHistory.setURL(null, 'Language Datasets', '#language/list');
      });

      // confirm delete language modal functionality
      $('#timaat-languagelists-language-delete-submit-button').on('click', async function(ev) {
        var modal = $('#timaat-languagelists-language-delete');
        var language = modal.data('language');
        if (language) {
          try {	
            await TIMAAT.LanguageLists._languageRemoved(language);
          } catch(error) {
            console.log("error: ", error);
          }
          try {
            await TIMAAT.UI.refreshDataTable('language');
          } catch(error) {
            console.log("error: ", error);
          }
        }
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        TIMAAT.LanguageLists.loadLanguages();
      });

			// delete button (in form) handler
      $('#language-metadata-form-delete-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#timaat-languagelists-language-delete').data('language', $('#language-metadata-form').data('language'));
        $('#timaat-languagelists-language-delete').modal('show');
			});
			
			// edit content form button handler
      $('#language-metadata-form-edit-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#language-metadata-form').data('language'), 'language', 'edit');
			});

      // submit content form button functionality
			$('#language-metadata-form-submit-button').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();        
				if (!$('#language-metadata-form').valid()) return false;

				// the original language model (in case of editing an existing language)
				var language = $('#language-metadata-form').data('language');				
        // console.log("TCL: language", language);

				// create/edit language window submitted data
				var formDataRaw = $('#language-metadata-form').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        // console.log("TCL: formDataObject", formDataObject);
        var duplicateName;
        var duplicateCode;
        if (duplicateName || duplicateCode) {
          $('#timaat-languagelists-language-duplicate').modal('show');
        } 
        if (language) { // update language
          if (language.model.id != 1) { //* Do not change 'default' entry
            duplicateName = await TIMAAT.LanguageService.checkForDuplicateName(formDataObject.name, language.model.id);
            duplicateCode = await TIMAAT.LanguageService.checkForDuplicateCode(formDataObject.code, language.model.id);
            if (duplicateName || duplicateCode) {
              $('#timaat-languagelists-language-duplicate').modal('show');
              return;
            } else {
              console.log("TCL: language", language);
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
            $('#timaat-languagelists-language-duplicate').modal('show');
            return;
          } else {
            var languageModel = await TIMAAT.LanguageLists.createLanguageModel(formDataObject);
            var newLanguage = await TIMAAT.LanguageLists.createLanguage(languageModel);
            language = new TIMAAT.Language(newLanguage);
            $('#language-metadata-form').data('language', language);
            $('#list-tab-metadata').data('type', 'language');
            $('#list-tab-metadata').trigger('click');
          }
        }
        TIMAAT.LanguageLists.showAddLanguageButton();
        await TIMAAT.UI.refreshDataTable('language');
        TIMAAT.UI.addSelectedClassToSelectedItem('language', language.model.id);
        TIMAAT.UI.displayDataSetContent('dataSheet', language, 'language');
			});
			
			// cancel add/edit button in content form functionality
			$('#language-metadata-form-dismiss-button').on('click', async function(event) {
        TIMAAT.LanguageLists.showAddLanguageButton();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#timaat-languagelists-language-table').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

		},

		load: function() {
      this.loadLanguages();
		},
		
		loadLanguages: function() {
			$('#list-tab-metadata').data('type', 'language');
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
      // setup datatable
      this.dataTableLanguages = $('#timaat-languagelists-language-table').DataTable({
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
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedLanguageId) {
						TIMAAT.UI.clearLastSelection('language');
						$(row).addClass('selected');
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
        TIMAAT.UI.displayDataSetContentContainer('language-data-tab', 'language-metadata-form', 'language');
			// 	break;
			// }
			TIMAAT.UI.clearLastSelection('language');
			let index;
			let selectedItem;
      index = this.languages.findIndex(({model}) => model.id === selectedItemId);
      selectedItem = this.languages[index];
      $('#list-tab-metadata').data('type', 'language');
      $('#language-metadata-form').data('language', selectedItem);
      TIMAAT.UI.addSelectedClassToSelectedItem('language', selectedItemId);
      TIMAAT.URLHistory.setURL(null, selectedItem.model.name + ' · Datasets · Language', '#language/' + selectedItem.model.id);
      this.showAddLanguageButton();
			TIMAAT.UI.displayDataSetContent('dataSheet', selectedItem, 'language');
    },

		addLanguage: function() {	
			// console.log("TCL: addLanguage");
      TIMAAT.UI.displayDataSetContentContainer('list-tab-metadata', 'language-metadata-form');
      $('#list-tab-metadata').data('type', 'language');
			$('#language-metadata-form').data('language', null);
      languageFormMetadataValidator.resetForm();
      
      TIMAAT.UI.addSelectedClassToSelectedItem('language', null);
      // setup form
			$('#language-metadata-form').trigger('reset');
      this.initFormDataSheetData();
      this.initFormDataSheetForEdit();
      $('#language-metadata-form-submit-button').html("Add");
      $('#languageFormHeader').html("Add language");
		},
		
		languageFormDataSheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      TIMAAT.UI.addSelectedClassToSelectedItem('language', data.model.id);
      $('#language-metadata-form').trigger('reset');
      $('#list-tab-metadata').data('type', 'language');
      this.initFormDataSheetData();
      languageFormMetadataValidator.resetForm();

      if ( action == 'show') {
        $('#language-metadata-form :input').prop('disabled', true);
        this.initFormForShow();
        $('#languageFormHeader').html("Language data sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit();
        $('#language-metadata-form-submit-button').html("Save");
        $('#languageFormHeader').html("Edit Language");
      }
      // name data
      $('#timaat-language-metadata-name').val(data.model.name);
      $('#timaat-languagelists-metadata-code').val(data.model.code);

      $('#language-metadata-form').data('language', data);
    },

    initFormDataSheetForEdit: function() {
      this.hideFormButtons();
      this.hideAddLanguageButton();
      $('#language-metadata-form :input').prop('disabled', false);
      $('#language-metadata-form-submit-button').show();
      $('#language-metadata-form-dismiss-button').show();
      $('#timaat-language-metadata-name').focus();
    },

    initFormForShow: function(model) {
      $('.language-form-edit-button').prop('disabled', false);
			$('.language-form-edit-button :input').prop('disabled', false);
			$('.language-form-edit-button').show();
      $('.form-buttons').prop('disabled', false);
      $('.form-buttons :input').prop('disabled', false);
      $('.form-buttons').show();
      $('#language-metadata-form-submit-button').hide();
      $('#language-metadata-form-dismiss-button').hide();
    },

    initFormDataSheetData: function() {
      $('.datasheet-data').hide();
      $('.name-data').show();
    },

    hideFormButtons: function() {
			$('.form-buttons').hide();
			$('.form-buttons').prop('disabled', true);
			$('.form-buttons :input').prop('disabled', true);
		},

    showAddLanguageButton: function() {
      $('.add-language-button').prop('disabled', false);
      $('.add-language-button :input').prop('disabled', false);
      $('.add-language-button').show();
    },

    hideAddLanguageButton: function() {
      $('.add-language-button').hide();
      $('.add-language-button').prop('disabled', true);
      $('.add-language-button :input').prop('disabled', true);
    },

    createLanguageModel: async function(formDataObject) {
      // console.log("TCL: formDataObject", formDataObject);
      var model = {
        id: 0,
        name: formDataObject.name,
        code: formDataObject.code,
        isSystemLanguage: false //! TODO
      };
      return model;
    },
  
    createLanguage: async function(model) {
      console.log("TCL: createLanguage: model: ", model);
      try {				
        // create language
        var newModel = await TIMAAT.LanguageService.createLanguage(model);
        console.log("TCL: newModel", newModel);
        model.id = newModel.id;		
      } catch(error) {
        console.log( "error: ", error);
      };
      console.log("TCL: model", model);
      return (model);
    },

    // TODO update languages
    updateLanguage: async function(language) {
      console.log("TCL: updateLanguage: async function -> beginning of update: language ", language);

      try { // update translation
        var tempModel = await TIMAAT.LanguageService.updateLanguage(language);
        language = tempModel;
      } catch(error) {
        console.log( "error: ", error);
      };

      await TIMAAT.UI.refreshDataTable('language');
    },

    _languageRemoved: async function(language) {
      console.log("TCL: _languageRemoved: language", language);
      try {
        await TIMAAT.LanguageService.deleteLanguage(language.model.id);
      } catch(error) {
        console.log("error: ", error)
      }
      language.remove();
    },
		
	}	
}, window));
