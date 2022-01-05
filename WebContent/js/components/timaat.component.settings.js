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
        if (TIMAAT.Service.session.displayName == "admin") {
          console.log("length fix button clicked");
          TIMAAT.Settings.fixLength();
        }
      });

      $('#no-permission-set-fix-button').on('click', function(event) {
        if (TIMAAT.Service.session.displayName == "admin") {
          console.log("add missing permissions");
          TIMAAT.Settings.fixPermissions();
        }
      });
      $('#no-annotation-uuid-set-fix-button').on('click', function(event) {
        if (TIMAAT.Service.session.displayName == "admin") {
          console.log("add missing annotation uuids");
          TIMAAT.Settings.fixAnnotationUUIDs();
        }
      });
      $('#keyframe-time-seconds-to-milliseconds-fix-button').on('click', function(event) {
        if (TIMAAT.Service.session.displayName == "admin") {
          console.log("fix annotation keyframe timestamps from s to ms");
          TIMAAT.Settings.fixKeyframeTimes();
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

    fixAnnotationUUIDs: async function() {
      console.log("fix annotation uuids");
      return new Promise(resolve => {
        $.ajax({
          url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/annotation/uuidFix"+'?authToken='+TIMAAT.Service.session.token,
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

    fixKeyframeTimes: async function() {
      console.log("fix keyframe timestamps");
      let selectorSvgList = await this.getSelectorSvgData();
      console.log("selectorSvgList", selectorSvgList);
      let svgDataList = [];
      selectorSvgList.forEach(function(selectorSvg) {
        svgDataList.push(JSON.parse(selectorSvg.svgData));
      });
      console.log("svgDataList: ", svgDataList);
      let i = selectorSvgList.length -1;
      for (; i >= 0; i--) {
        if (svgDataList[i].keyframes && svgDataList[i].keyframes.length > 1) { // fix time data s -> ms
          svgDataList[i].keyframes.forEach(function(keyframe) {
            console.log("TCL: fix value from ", keyframe.time);
            if (keyframe.time < 50) {
              keyframe.time *= 1000;
            }
            keyframe.time = Math.floor(keyframe.time);
            console.log("TCL: to ", keyframe.time);
          });
        } else { // reduce list to entries which have animation data
          selectorSvgList.splice(i,1);
          svgDataList.splice(i,1);
        }
      }
      console.log("svgDataList: ", svgDataList);
      i = 0;
      for (; i < selectorSvgList.length; i++) {
        selectorSvgList[i].svgData = JSON.stringify(svgDataList[i]);

      }
      console.log("selectorSvgList", selectorSvgList);
      await this.setFixedSelectorSvgData(selectorSvgList);
    },

    getSelectorSvgData: async function() {
      return new Promise(resolve => {
        $.ajax({
          url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysisList/keyframeFix"+'?authToken='+TIMAAT.Service.session.token,
          type:"GET",
          dataType: 'json',
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

    setFixedSelectorSvgData: async function(model) {
      return new Promise(resolve => {
        $.ajax({
          url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/analysisList/keyframeFix"+'?authToken='+TIMAAT.Service.session.token,
          type:"PATCH",
          data: JSON.stringify(model),
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
