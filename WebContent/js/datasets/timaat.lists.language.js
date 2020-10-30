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
    // console.log("TCL: init: function()");
			TIMAAT.LanguageLists.initLanguages();
			$('.lists-datatables').hide();
			// $('.languages-datatable').show();
    },

		initLanguages: function() {
      // console.log("TCL: initLanguages: function()");
      // nav-bar functionality
      $('#language-tab-language-metadata-form').on('click',function(event) {
        // $('.languages-data-tabs').show();
        $('.nav-tabs a[href="#languageDatasheet"]').tab('show');
        $('.form').hide();
        $('#timaat-languagelists-metadata-form').show();
        TIMAAT.LanguageLists.languageFormDatasheet('show', $('#timaat-languagelists-metadata-form').data('language'));
      });

      // confirm delete language modal functionality
      $('#timaat-languagelists-language-delete-submit').on('click', async function(ev) {
        var modal = $('#timaat-languagelists-language-delete');
        var language = modal.data('language');
        if (language) {
          try {	
            await TIMAAT.LanguageLists._languageRemoved('language', language);
          } catch(error) {
            console.log("error: ", error);
          }
          try {
            await TIMAAT.LanguageLists.refreshDatatable('language');
          } catch(error) {
            console.log("error: ", error);
          }
        }
        modal.modal('hide');
        $('#timaat-languagelists-metadata-form').hide();
        $('.form').hide();
      });

      // add language button functionality (in language list - opens datasheet form)
      $('#timaat-languagelists-language-add').on('click', function(event) {
        // console.log("TCL: add language");
        $('#timaat-languagelists-metadata-form').data('language', null);
        TIMAAT.LanguageLists.addLanguage();
      });

			// delete button (in form) handler
      $('#timaat-languagelists-metadata-form-delete').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#timaat-languagelists-language-delete').data('language', $('#timaat-languagelists-metadata-form').data('language'));
        $('#timaat-languagelists-language-delete').modal('show');
			});
			
			// edit content form button handler
      $('#timaat-languagelists-metadata-form-edit').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.LanguageLists.languageFormDatasheet('edit', $('#timaat-languagelists-metadata-form').data('language'));
			});

      // submit content form button functionality
			$('#timaat-languagelists-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();        
				if (!$('#timaat-languagelists-metadata-form').valid()) return false;

				// the original language model (in case of editing an existing language)
				var language = $('#timaat-languagelists-metadata-form').data('language');				
        // console.log("TCL: language", language);

				// create/edit language window submitted data
				var formDataRaw = $('#timaat-languagelists-metadata-form').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        console.log("TCL: formDataObject", formDataObject);
        var duplicateName = await TIMAAT.LanguageService.checkForDuplicateName(formDataObject.name);
        var duplicateCode = await TIMAAT.LanguageService.checkForDuplicateCode(formDataObject.code);
        if (!duplicateName && !duplicateCode || language) {
          if (language) { // update language
            if (language.model.id != 1) { //* Do not change 'default' entry
              console.log("TCL: language", language);
              language.model.name = formDataObject.name;
              language.model.code = formDataObject.code;
              let languageData = language.model;
              delete languageData.ui;
              await TIMAAT.LanguageLists.updateLanguage(languageData);
              // language.updateUI();
            }
          } 
          else { // create new language 
            var languageModel = await TIMAAT.LanguageLists.createLanguageModel(formDataObject);
            // console.log("TCL: languageModel", languageModel);
            var newLanguage = await TIMAAT.LanguageLists.createLanguage(languageModel);
            language = new TIMAAT.Language(newLanguage);
          }
          await TIMAAT.LanguageLists.refreshDatatable();
          TIMAAT.LanguageLists.languageFormDatasheet('show', language);
        }
        else {// duplicate language name or code entered
          $('#timaat-languagelists-language-duplicate').modal('show');
        }
			});
			
			// cancel add/edit button in content form functionality
			$('#timaat-languagelists-metadata-form-dismiss').on('click', function(event) {
				var language = $('#timaat-languagelists-metadata-form').data('language');
				if (language != null) {
					TIMAAT.LanguageLists.languageFormDatasheet('show', language);
				} else { // dismiss language creation
					$('.form').hide();
				}
			});
		},

		load: function() {
    // console.log("TCL: load: function()");
			TIMAAT.LanguageLists.loadLanguages();
		},
		
		loadLanguages: function() {
    // console.log("TCL: loadLanguages: function()");
			$('.lists-datatables').hide();
			$('.languages-datatable').show();
			TIMAAT.LanguageLists.setLanguageList();
		},

		loadLanguagesDataTables: function() {
			// console.log("TCL: loadLanguagesDataTables: function()");
      TIMAAT.LanguageLists.setupLanguageDatatable();
		},

		setLanguageList: function() {
      // console.log("TCL: setLanguageList: function()");
			$('.form').hide();
			$('.languages-data-tabs').hide();
			if ( TIMAAT.LanguageLists.languages == null) return;
      console.log("TCL: TIMAAT.LanguageLists.languages", TIMAAT.LanguageLists.languages);

			$('#timaat-languagelists-language-list-loader').remove();
			// clear old UI list
			$('#timaat-languagelists-language-list').empty();

			// set ajax data source
			if ( TIMAAT.LanguageLists.dataTableLanguages ) {
				TIMAAT.LanguageLists.dataTableLanguages.ajax.reload(null, false);
			}
		},

		setupLanguageDatatable: function() {			
      // console.log("TCL: setupLanguageDatatable");
      // setup datatable
      TIMAAT.LanguageLists.dataTableLanguages = $('#timaat-languagelists-language-table').DataTable({
        "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "order"         : [[ 0, 'asc' ]],
        "pagingType"    : "full", // "simple_numbers",
        "dom"           : '<lf<t>ip>',
        "processing"    : true,
        "stateSave"     : true,
        "scrollY"       : "60vh",
        "scrollCollapse": true,
        "scrollX"       : false,
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
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: data", data);
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let languageElement = $(row);
          let language = data;
          language.ui = languageElement;
          languageElement.data('language', language);

          languageElement.on('click', '.name', function(event) {
            event.stopPropagation();
            // show tag editor - trigger popup
            TIMAAT.UI.hidePopups();
            TIMAAT.UI.showComponent('lists');
            $('.form').hide();
            $('.languages-nav-tabs').show();
            $('.languages-data-tabs').hide();
            $('.nav-tabs a[href="#languageDatasheet"]').tab('show');
            var selectedLanguage;
            var i = 0;
            for (; i < TIMAAT.LanguageLists.languages.length; i++) {
              if (TIMAAT.LanguageLists.languages[i].model.id == language.id) {
                selectedLanguage = TIMAAT.LanguageLists.languages[i];
                break;
              }
            }
            $('#timaat-languagelists-metadata-form').data('language', selectedLanguage);
            TIMAAT.LanguageLists.languageFormDatasheet('show', selectedLanguage);
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

    refreshDatatable: async function() {
      // console.log("TCL: refreshDatatable");
      // set ajax data source
      if (TIMAAT.LanguageLists.dataTableLanguages) {
        TIMAAT.LanguageLists.dataTableLanguages.ajax.reload(null, false);
      }	
    },

		addLanguage: function() {	
			// console.log("TCL: addLanguage");
			$('.form').hide();
			$('#timaat-languagelists-metadata-form').data(null);
      languageFormMetadataValidator.resetForm();
      
      // setup form
			$('#timaat-languagelists-metadata-form').trigger('reset');
			$('#timaat-languagelists-metadata-form').show();
			$('.datasheet-data').hide();
      $('.name-data').show();
      
      $('#timaat-languagelists-metadata-form-edit').hide();
      $('#timaat-languagelists-metadata-form-delete').hide();
      $('#timaat-languagelists-metadata-form-submit').html("Add");
      $('#timaat-languagelists-metadata-form-submit').show();
      $('#timaat-languagelists-metadata-form-dismiss').show();
			$('#timaat-languagelists-metadata-form :input').prop('disabled', false);
      $('#languageFormHeader').html("Add language");
      
      $('#timaat-languagelists-metadata-name').focus();
		},
		
		languageFormDatasheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      $('#timaat-languagelists-metadata-form').trigger('reset');
      $('.datasheet-data').hide();
      $('.name-data').show();
      $('.language-data').show();
      languageFormMetadataValidator.resetForm();

      $('#timaat-languagelists-metadata-form').show();

      if ( action == 'show') {
        $('#timaat-languagelists-metadata-form :input').prop('disabled', true);
        $('#timaat-languagelists-metadata-form-edit').prop('disabled', false);
        $('#timaat-languagelists-metadata-form-edit :input').prop('disabled', false);
        $('#timaat-languagelists-metadata-form-edit').show();
        $('#timaat-languagelists-metadata-form-delete').prop('disabled', false);
        $('#timaat-languagelists-metadata-form-delete :input').prop('disabled', false);
        $('#timaat-languagelists-metadata-form-delete').show();
        $('#timaat-languagelists-metadata-form-submit').hide();
        $('#timaat-languagelists-metadata-form-dismiss').hide();
        $('#languageFormHeader').html("Language Datasheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        $('#timaat-languagelists-metadata-form :input').prop('disabled', false);
        $('#timaat-languagelists-metadata-form-edit').hide();
        $('#timaat-languagelists-metadata-form-edit').prop('disabled', true);
        $('#timaat-languagelists-metadata-form-edit :input').prop('disabled', true);
        $('#timaat-languagelists-metadata-form-delete').hide();
        $('#timaat-languagelists-metadata-form-delete').prop('disabled', true);
        $('#timaat-languagelists-metadata-form-delete :input').prop('disabled', true);
        $('#timaat-languagelists-metadata-form-submit').html("Save");
        $('#timaat-languagelists-metadata-form-submit').show();
        $('#timaat-languagelists-metadata-form-dismiss').show();
        $('#languageFormHeader').html("Edit Language");
        $('#timaat-languagelists-metadata-name').focus();
      }
      // name data
      $('#timaat-languagelists-metadata-name').val(data.model.name);
      $('#timaat-languagelists-metadata-code').val(data.model.code);

      $('#timaat-languagelists-metadata-form').data('language', data);
    },

    createLanguageModel: async function(formDataObject) {
      // console.log("TCL: formDataObject", formDataObject);
      var model = {
        id: 0,
        name: formDataObject.name,
        code: formDataObject.code
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

      TIMAAT.LanguageLists.refreshDatatable('language');
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
