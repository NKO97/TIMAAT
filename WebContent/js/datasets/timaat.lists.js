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

} (function (TIMAAT) {

  TIMAAT.Lists = {
    listsLoaded: false,

    init: function() {
      TIMAAT.CategoryLists.init();
      TIMAAT.RoleLists.init();
      TIMAAT.LanguageLists.initLanguages();
      TIMAAT.TagLists.init();
      this.initLists();
    },

    initListsComponent: function() {
      if (!this.listsLoaded) {
        this.setLists();
      }
      TIMAAT.UI.showComponent('lists');
      // $('#categoryset-tab').trigger('click');
    },

    initLists: function() {
      $('#list-tab-metadata').on('click', function(event) {
        let type = $('#list-tab-metadata').data('type');
        let data = null;
        let name = '';
        let id = 0;
        TIMAAT.UI.subNavTab = 'dataSheet';
        switch (type) {
          case 'category':
            data = $('#category-metadata-form').data('category');
            name = data.model.name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('category-metadata-form');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
          case 'categorySet':
            data = $('#categoryset-metadata-form').data('categorySet');
            name = data.model.name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('categoryset-metadata-form');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
          case 'role':
            data = $('#role-metadata-form').data('role');
            name = data.model.roleTranslations[0].name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('role-metadata-form');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
          case 'roleGroup':
            data = $('#rolegroup-metadata-form').data('roleGroup');
            name = data.model.roleGroupTranslations[0].name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('rolegroup-metadata-form');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
          case 'language':
            data = $('#language-metadata-form').data('language');
            name = data.model.name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('language-metadata-form');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
        }
        TIMAAT.UI.displayDataSetContent('dataSheet', data, type);
      });
    },

    load: function() {
      console.log("TCL: load: function()");
      // this.loadLists();
      TIMAAT.CategoryLists.load();
      TIMAAT.RoleLists.load();
      TIMAAT.LanguageLists.load();
			TIMAAT.TagLists.load();
    },

    loadLists: function() {
      console.log("TCL: loadLists: function()");
      // TIMAAT.UI.displayComponent(null, null, null);
      // TIMAAT.UI.addSelectedClassToSelectedItem(null);
      // TIMAAT.UI.subNavTab = 'dataSheet';
    },

    loadDataTables: function() {
			TIMAAT.CategoryLists.loadCategoriesDataTables();
      TIMAAT.RoleLists.loadRolesDataTables();
      TIMAAT.LanguageLists.loadLanguagesDataTables();
    },

    setLists: function() {
      TIMAAT.CategoryLists.setCategoriesList();
      TIMAAT.CategoryLists.setCategorySetsList();
      TIMAAT.RoleLists.setRolesList();
      TIMAAT.RoleLists.setRoleGroupsList();
      TIMAAT.LanguageLists.setLanguagesList();
      this.listsLoaded = true;
    },

  }

}, window));