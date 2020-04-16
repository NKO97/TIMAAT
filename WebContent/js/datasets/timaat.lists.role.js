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
    
    TIMAAT.RoleLists = {
      roles: null,
      roleGroups: null,

      init: function() {
        TIMAAT.RoleLists.initRoles();
        TIMAAT.RoleLists.initRoleGroups();
        // $('.roles-data-tabs').hide();
        $('.lists-cards').hide();
        // $('.roles-card').show();
      },

      initRoles: function() {

      },

      initRoleGroups: function() {

      },

      load: function() {
        TIMAAT.RoleLists.loadRoles();
        TIMAAT.RoleLists.loadRoleGroups();
      },

      loadRoles: function() {
        // $('.roles-cards').hide();
        // $('.roles-card').show();
        TIMAAT.RoleService.listRoles(TIMAAT.RoleLists.setRolesList);
      },

      loadRoleGroups: function() {
        // $('.rolegroups-cards').hide();
        // $('.roles-card').show();
        TIMAAT.RoleService.listRoleGroups(TIMAAT.RoleLists.setRoleGroupsList);
      },

      setRolesList: function(roles) {
        console.log("TCL: setRoleLists -> roles", roles);
        $('.form').hide();
        $('.roles-data-tabs').hide();
        if ( !roles ) return;
  
        $('#timaat-roledatasets-role-list-loader').remove();
        // clear old UI list
        $('#timaat-roledatasets-role-list').empty();
        // setup model
        var rols = Array();
        roles.forEach(function(role) { 
          if ( role.id > 0 ) {
            rols.push(new TIMAAT.Role(role));
          }
        });
        TIMAAT.RoleLists.roles = rols;
        TIMAAT.RoleLists.roles.model = roles;
      },

      setRoleGroupsList: function(roleGroups) {
        console.log("TCL: setRoleGroupLists -> roleGroups", roleGroups);
        $('.form').hide();
        $('.rolegroups-data-tabs').hide();
        if ( !roleGroups ) return;
  
        $('#timaat-roledatasets-rolegroup-list-loader').remove();
        // clear old UI list
        $('#timaat-roledatasets-rolegroup-list').empty();
        // setup model
        var rolgrps = Array();
        roleGroups.forEach(function(roleGroup) { 
          if ( roleGroup.id > 0 ) {
            rolgrps.push(new TIMAAT.RoleGroup(roleGroup));
          }
        });
        TIMAAT.RoleLists.roleGroups = rolgrps;
        TIMAAT.RoleLists.roleGroups.model = roleGroups;
      },

    }

  }, window));