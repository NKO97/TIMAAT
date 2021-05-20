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
	
	TIMAAT.Settings = {
		
		init: function() {
      this.initSettings();
      TIMAAT.UI.displayComponent('settings', 'settings-general-tab', null);
		},

    initSettingsComponent: function() {
      TIMAAT.UI.showComponent('settings');
      $('#settings-general-tab').trigger('click');
    },

		initSettings: function() {
      // nav-bar functionality
			$('#settings-general-tab').on('click', function(event) {
				TIMAAT.Settings.loadSettings();
				TIMAAT.URLHistory.setURL(null, 'Settings', '#settings');
			});

      $('#length-fix-button').on('click', function(event) {
        TIMAAT.Settings.fixLength();
      });
    },    

    loadSettings: function() {
			TIMAAT.UI.displayComponent('settings', 'settings-general-tab', null);
			// TIMAAT.UI.addSelectedClassToSelectedItem('settings', null);
			// TIMAAT.UI.subNavTab = 'dataSheet';
		},

    fixLength: async function() {
      return new Promise(resolve => {
        $.ajax({
          url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/fileLengthFix",
          type:"PATCH",
          contentType:"application/json; charset=utf-8",
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
          },
        }).done(function(data) {
          resolve(data);
        }).fail(function(e) {
          console.log( "error", e );
          console.log( e.responseText );
        });
      }).catch((error) => {
        console.log( "error: ", error );
      });
    },

		
	}
	
}, window));
