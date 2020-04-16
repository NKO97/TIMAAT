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

  TIMAAT.RoleService = {

    listRoles(callback) {
      jQuery.ajax({
        url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/list",
        type:"GET",
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
        },
      }).done(function(data) {
        // console.log("TCL: listRoles -> data", data);
        callback(data);
      }).fail(function(e) {
        console.log(e.responseText);
        console.log( "error", e );
      });			
    },

    listRoleGroups(callback) {
      jQuery.ajax({
        url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/role/group/list",
        type:"GET",
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
        },
      }).done(function(data) {
        // console.log("TCL: listRoleGroups -> data", data);
        callback(data);
      }).fail(function(e) {
        console.log(e.responseText);
        console.log( "error", e );
      });			
    },

  }
}, window));