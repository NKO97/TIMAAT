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
        console.log("length fix button clicked");
        if (TIMAAT.Service.session.displayName == "admin") {
          TIMAAT.Settings.fixLength();
        }
      });

      $('#no-permission-set-fix-button').on('click', function(event) {
        console.log("add missing permissions");
        if (TIMAAT.Service.session.displayName == "admin") {
          console.log("admin may use the button");
          TIMAAT.Settings.fixPermissions();
        }
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
          url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/medium/fileLengthFix"+'?authToken='+TIMAAT.Service.session.token,
          type:"PATCH",
          contentType:"application/json; charset=utf-8",
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
          },
        }).done(function(data) {
          resolve(data);
        }).fail(function(error) {
          console.error("ERROR: ", error);
          console.error("ERROR responseText: ", error.responseText);
        });
      }).catch((error) => {
        console.error("ERROR: ", error);
      });
    },

    fixPermissions: async function() {
      console.log("fix permissions");
      return new Promise(resolve => {
        $.ajax({
          url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/user/permissionFix"+'?authToken='+TIMAAT.Service.session.token,
          type:"PATCH",
          contentType:"application/json; charset=utf-8",
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
          },
        }).done(function(data) {
          resolve(data);
        }).fail(function(error) {
          console.error("ERROR: ", error);
          console.error("ERROR responseText: ", error.responseText);
        });
      }).catch((error) => {
        console.error("ERROR: ", error);
      });
    },
		
	}
	
}, window));
