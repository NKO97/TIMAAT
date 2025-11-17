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
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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
  if(typeof window !== 'undefined' && window.TIMAAT){
      factory(window.TIMAAT);
  }

} (function (TIMAAT) {

  TIMAAT.Lists = {
    listsLoaded: false,

    init: function() {
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
       $('#roleGroupTab').trigger('click');
    },

    initLists: function() {
      $('#listsTabMetadata').on('click', function(event) {
        let type = $('#listsTabMetadata').data('type');
        let data = null;
        let name = '';
        let id = 0;
        TIMAAT.UI.subNavTab = 'dataSheet';
        switch (type) {
          case 'role':
            data = $('#roleFormMetadata').data('role');
            name = data.model.roleTranslations[0].name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('roleFormMetadata');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
          case 'roleGroup':
            data = $('#roleGroupFormMetadata').data('roleGroup');
            name = data.model.roleGroupTranslations[0].name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('roleGroupFormMetadata');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
          case 'language':
            data = $('#languageFormMetadata').data('language');
            name = data.model.name;
            id = data.model.id;
            TIMAAT.UI.displayDataSetContentArea('languageFormMetadata');
            TIMAAT.URLHistory.setURL(null, name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + id);
            break;
        }
      });
    },

    load: function() {
      // console.log("TCL: load: function()");
      // this.loadLists();
      TIMAAT.RoleLists.load();
      TIMAAT.LanguageLists.load();
			TIMAAT.TagLists.load();
    },

    loadLists: function() {
      // console.log("TCL: loadLists: function()");
      // TIMAAT.UI.displayComponent(null, null, null);
      // TIMAAT.UI.addSelectedClassToSelectedItem(null);
      // TIMAAT.UI.subNavTab = 'dataSheet';
    },

    loadDataTables: function() {
      TIMAAT.RoleLists.loadRolesDataTables();
      TIMAAT.LanguageLists.loadLanguagesDataTables();
    },

    setLists: function() {
      TIMAAT.RoleLists.setRolesList();
      TIMAAT.RoleLists.setRoleGroupsList();
      TIMAAT.LanguageLists.setLanguagesList();
      this.listsLoaded = true;
    },

  }

}, window));