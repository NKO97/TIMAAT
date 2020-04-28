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
        // nav-bar functionality
        $('#role-tab-role-metadata-form').click(function(event) {
          // $('.roles-data-tabs').show();
          $('.nav-tabs a[href="#roleDatasheet"]').tab('show');
          $('.form').hide();
          $('#timaat-rolelists-metadata-form').show();
          TIMAAT.RoleLists.rolesFormDatasheet('show', 'role', $('#timaat-rolelists-metadata-form').data('role'));
        });
      },

      initRoleGroups: function() {
        // nav-bar functionality
        $('#role-tab-rolegroup-metadata-form').click(function(event) {
          // $('.roles-data-tabs').show();
          $('.nav-tabs a[href="#roleGroupDatasheet"]').tab('show');
          $('.form').hide();
          $('#timaat-rolelists-rolegroup-metadata-form').show();
          TIMAAT.RoleLists.rolesFormDatasheet('show', 'rolegroup', $('#timaat-rolelists-rolegroup-metadata-form').data('rolegroup'));
        });
      },

      load: function() {
        TIMAAT.RoleLists.loadRoles();
        TIMAAT.RoleLists.loadRoleGroups();
      },

      loadRoles: function() {
        $('.lists-cards').hide();
        $('.roles-card').show();
        TIMAAT.RoleLists.setRolesList();
      },

      loadRoleGroups: function() {
        $('.lists-cards').hide();
        $('.rolegroups-card').show();
        TIMAAT.RoleLists.setRoleGroupsList();
      },

      loadRoleDatatables: async function() {
        console.log("TCL: loadRoleDatatables: async function()");
        TIMAAT.RoleLists.setupRoleDatatable();
        TIMAAT.RoleLists.setupRoleGroupDatatable();
      },

      setRolesList: function() {
        $('.form').hide();
        $('.roles-data-tabs').hide();
        if ( TIMAAT.RoleLists.roles == null) return;
  
        $('#timaat-rolelists-role-list-loader').remove();
        // clear old UI list
        $('#timaat-rolelists-role-list').empty();

        // set ajax data source
        if ( TIMAAT.RoleLists.dataTableRoles ) {
          TIMAAT.RoleLists.dataTableRoles.ajax.reload();
        }
      },

      setRoleGroupsList: function() {
        $('.form').hide();
        $('.rolegroups-data-tabs').hide();
        if ( TIMAAT.RoleLists.roleGroups == null ) return;
  
        $('#timaat-rolelists-rolegroup-list-loader').remove();
        // clear old UI list
        $('#timaat-rolelists-rolegroup-list').empty();
        // set ajax data source
        if ( TIMAAT.RoleLists.dataTableRoleGroups ) {
          TIMAAT.RoleLists.dataTableRoleGroups.ajax.reload();
        }
      },

      setupRoleDatatable: function() {			
        console.log("TCL: setupRoleDatatable");
        // setup datatable
        TIMAAT.RoleLists.dataTableRoles = $('#timaat-rolelists-role-table').DataTable({
          "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
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
            "url"        : "api/role/list",
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
              // console.log("TCL: TIMAAT.RoleLists.roles (last)", TIMAAT.RoleLists.roles);
              // setup model
              var rols = Array();
              data.data.forEach(function(role) { 
                if ( role.id > 0 ) {
                  rols.push(new TIMAAT.Role(role, 'role'));
                }
              });
              TIMAAT.RoleLists.roles = rols;
              TIMAAT.RoleLists.roles.model = data.data;
              // console.log("TCL: TIMAAT.RoleLists.roles (current)", TIMAAT.RoleLists.roles);
              return data.data;
            }
          },
          "createdRow": function(row, data, dataIndex) {
            // console.log("TCL: data", data);
            // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
            let roleElement = $(row);
            let role = data;
            role.ui = roleElement;
            roleElement.data('role', role);
  
            roleElement.on('click', '.name', function(event) {
              event.stopPropagation();
              // show tag editor - trigger popup
              TIMAAT.UI.hidePopups();
              TIMAAT.UI.showComponent('lists');
              $('.form').hide();
              $('.roles-nav-tabs').show();
              $('.roles-data-tabs').hide();
              $('.nav-tabs a[href="#roleDatasheet"]').tab('show');
              var id = role.id;
              var selectedRole;
              var i = 0;
              for (; i < TIMAAT.RoleLists.roles.length; i++) {
                if (TIMAAT.RoleLists.roles[i].model.id == id) {
                  selectedRole = TIMAAT.RoleLists.roles[i];
                  break;
                }
              }
              $('#timaat-rolelists-roles-metadata-form').data('role', selectedRole);
              TIMAAT.RoleLists.rolesFormDatasheet('show', 'role', selectedRole);
            });
          },
          "columns": [
            { data: 'id', name: 'name', className: 'name', render: function(data, type, role, meta) {
              let nameDisplay = `<p>`+ role.roleTranslations[0].name +`</p>`;
              return nameDisplay;
              }
            },			
          ],
          "language": {
            "decimal"     : ",",
            "thousands"   : ".",
            "search"      : "Search",
            "lengthMenu"  : "Show _MENU_ entries",
            "zeroRecords" : "No roles found.",
            "info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ roles total)",
            "infoEmpty"   : "No roles available.",
            "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ role(s))",
            "paginate"    : {
              "first"   : "<<",
              "previous": "<",
              "next"    : ">",
              "last"    : ">>"
            },
          },				
        });				
      },

      setupRoleGroupDatatable: function() {			
        console.log("TCL: setupRoleGroupDatatable");
        // setup datatable
        TIMAAT.RoleLists.dataTableRoleGroups = $('#timaat-rolelists-rolegroup-table').DataTable({
          "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
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
            "url"        : "api/role/group/list",
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
              // console.log("TCL: TIMAAT.RoleLists.roleGroups (last)", TIMAAT.RoleLists.roleGroups);
              // setup model
              var rolegrps = Array();
              data.data.forEach(function(roleGroup) { 
                if ( roleGroup.id > 0 ) {
                  rolegrps.push(new TIMAAT.RoleGroup(roleGroup, 'roleGroup'));
                }
              });
              TIMAAT.RoleLists.roleGroups = rolegrps;
              TIMAAT.RoleLists.roleGroups.model = data.data;
              // console.log("TCL: TIMAAT.RoleLists.roleGroups (current)", TIMAAT.RoleLists.roleGroups);
              return data.data;
            }
          },
          "createdRow": function(row, data, dataIndex) {
            // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
            let roleGroupElement = $(row);
            let roleGroup = data;
            roleGroup.ui = roleGroupElement;
            roleGroupElement.data('rolegroup', roleGroup);
  
            roleGroupElement.on('click', '.name', function(event) {
              event.stopPropagation();
              // show tag editor - trigger popup
              TIMAAT.UI.hidePopups();
              TIMAAT.UI.showComponent('lists');
              $('.form').hide();
              $('.roles-nav-tabs').show();
              $('.roles-data-tabs').hide();
              $('.nav-tabs a[href="#roleGroupDatasheet"]').tab('show');
              var id = roleGroup.id;
              var selectedRoleGroup;
              var i = 0;
              for (; i < TIMAAT.RoleLists.roleGroups.length; i++) {
                if (TIMAAT.RoleLists.roleGroups[i].model.id == id) {
                  selectedRoleGroup = TIMAAT.RoleLists.roleGroups[i];
                  break;
                }
              }
              $('#timaat-rolelists-rolegroups-metadata-form').data('rolegroup', selectedRoleGroup);
              TIMAAT.RoleLists.rolesFormDatasheet('show', 'rolegroup', selectedRoleGroup);
            });
          },
          "columns": [
            { data: 'id', name: 'name', className: 'name', render: function(data, type, roleGroup, meta) {
              let nameDisplay = `<p>`+ roleGroup.roleGroupTranslations[0].name +`</p>`;
              return nameDisplay;
              }
            },			
          ],
          "language": {
            "decimal"     : ",",
            "thousands"   : ".",
            "search"      : "Search",
            "lengthMenu"  : "Show _MENU_ entries",
            "zeroRecords" : "No role groups found.",
            "info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ role groups total)",
            "infoEmpty"   : "No role groups available.",
            "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ role group(s))",
            "paginate"    : {
              "first"   : "<<",
              "previous": "<",
              "next"    : ">",
              "last"    : ">>"
            },
          },				
        });				
      },

      refreshDatatable: async function(type) {
        console.log("TCL: refreshDatatable - type: ", type);
        // set ajax data source
        switch(type) {
          case 'role':
            if (TIMAAT.RoleLists.dataTableRoles) {
              TIMAAT.RoleLists.dataTableRoles.ajax.reload();
            }
          break;
          case 'rolegroup':
            if (TIMAAT.RoleLists.dataTableRoleGroups) {
              TIMAAT.RoleLists.dataTableRoleGroups.ajax.reload();
            }
          break;
        }			
      },

      rolesFormDatasheet: function(action, type, data) {
        console.log("TCL: action, type, data", action, type, data);
        $('#timaat-rolelists-metadata-form').trigger('reset');
        $('.datasheet-data').hide();
        $('.name-data').show();
        rolesFormMetadataValidator.resetForm();
  
        // show tabs
        // $('.'+type+'-data-tab').show();
        // $('.name-data-tab').show();
  
        $('.nav-tabs a[href="#'+type+'Datasheet"]').focus();
        $('#timaat-rolelists-metadata-form').show();
  
        if ( action == 'show') {
          $('#timaat-rolelists-metadata-form :input').prop("disabled", true);
          $('.datasheet-form-edit-button').hide();
          $('#timaat-rolelists-metadata-form-edit').show();
          $('#timaat-rolelists-metadata-form-edit').prop("disabled", false);
          $('#timaat-rolelists-metadata-form-edit :input').prop("disabled", false);
          $('.datasheet-form-delete-button').show();
          $('#timaat-rolelists-role-remove').prop("disabled", false);
          $('#timaat-rolelists-role-remove :input').prop("disabled", false);
          $('.datasheet-form-buttons').hide()
          $('#'+type+'FormHeader').html(type+" Datasheet (#"+ data.model.id+')');
        }
        else if (action == 'edit') {
          $('.datasheet-form-buttons').hide();
          $('.'+type+'-datasheet-form-submit').show();
          $('#timaat-rolelists-metadata-form :input').prop("disabled", false);
          $('.datasheet-form-edit-button').hide();
          $('#timaat-rolelists-metadata-form-edit').prop("disabled", true);
          $('#timaat-rolelists-metadata-form-edit :input').prop("disabled", true);
          $('.datasheet-form-delete-button').hide();
          $('#timaat-rolelists-role-remove').prop("disabled", true);
          $('#timaat-rolelists-role-remove :input').prop("disabled", true);
          $('#'+type+'FormHeader').html(type+" bearbeiten");
          $('#timaat-rolelists-metadata-form-submit').html("Speichern");
          $('#timaat-rolelists-role-metadata-name').focus();
        }
  
        // console.log("TCL: data", data);
        // setup UI
  
        // role data
        // $('#timaat-rolelists-'+type+'-metadata-type-id').val(data.type.id);
        // name data
        switch(type) {
          case 'role':
            $('#timaat-rolelists-role-metadata-name').val(data.model.roleTranslations[0].name);
            $('#timaat-rolelists-role-metadata-name-language-id').val(data.model.roleTranslations[0].language.id);
          break;
          case 'rolegroup':
            $('#timaat-rolelists-role-metadata-name').val(data.model.roleGroupTranslations[0].name);
            $('#timaat-rolelists-role-metadata-name-language-id').val(data.model.roleGroupTranslations[0].language.id);
          break
        }

        $('#timaat-rolelists-metadata-form').data(type, data);
      },

    }

  }, window));