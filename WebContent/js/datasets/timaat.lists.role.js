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
    roleSelectObjects: null,
    roleSelectObjectsSorted: null,
    roleGroupSelectObjects: null,
    roleGroupSelectObjectsSorted: null,

    init: function() {
      TIMAAT.RoleLists.initRolesAndRoleGroups();
      TIMAAT.RoleLists.initRoles();
      TIMAAT.RoleLists.initRoleGroups();
      // $('.roles-data-tabs').hide();
      $('.lists-cards').hide();
      // $('.roles-card').show();
    },

    initRolesAndRoleGroups: function() {
      // delete button (in form) handler
      $('#timaat-rolelists-metadata-form-delete').on('click', function(event) {
        console.log("TCL: Delete button pressed.")
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        var type = $('#timaat-rolelists-metadata-form').attr('data-type');
        $('#timaat-rolelists-'+type+'-delete').data(type, $('#timaat-rolelists-metadata-form').data(type));
        $('#timaat-rolelists-'+type+'-delete').modal('show');
      });
    },

    initRoles: function() {
      // nav-bar functionality
      $('#role-tab-role-metadata-form').on('click',function(event) {
        // $('.roles-data-tabs').show();
        $('.nav-tabs a[href="#roleDatasheet"]').tab('show');
        $('.form').hide();
        $('#timaat-rolelists-metadata-form').show();
        TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'role', $('#timaat-rolelists-metadata-form').data('role'));
      });

      // confirm delete role modal functionality
      $('#timaat-rolelists-role-delete-submit').on('click', async function(ev) {
        var modal = $('#timaat-rolelists-role-delete');
        var role = modal.data('role');
        if (role) {
          try {	
            await TIMAAT.RoleLists._roleOrRoleGroupRemoved('role', role);
          } catch(error) {
            console.log("error: ", error);
          }
          try {
            await TIMAAT.RoleLists.refreshDatatable('rolegroup');
            await TIMAAT.RoleLists.refreshDatatable('role');
          } catch(error) {
            console.log("error: ", error);
          }
        }
        $('#timaat-rolelists-metadata-form').attr('data-type', '');
        modal.modal('hide');
        $('#timaat-rolelists-metadata-form').hide();
        // $('.roles-data-tabs').hide();
        $('.form').hide();
      });

      // add role button functionality (in role list - opens datasheet form)
			$('#timaat-rolelists-role-add').on('click', function(event) {
        console.log("TCL: add role");
				$('#timaat-rolelists-metadata-form').data('role', null);
				TIMAAT.RoleLists.addRoleOrRoleGroup('role');
      });
      
      // role form handlers
			// submit role metadata button functionality
			$('#timaat-rolelists-role-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-rolelists-metadata-form').valid()) return false;

				// the original role model (in case of editing an existing role)
				var role = $('#timaat-rolelists-metadata-form').data('role');				
        // console.log("TCL: role", role);

				// create/edit role window submitted data
				var formDataRaw = $('#timaat-rolelists-metadata-form').serializeArray();
        console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        delete formDataObject.roleId;
        console.log("TCL: formDataObject", formDataObject);
        var formSelectData = formDataRaw;
        formSelectData.splice(0,1); // remove entries not part of multi select data
        console.log("TCL: formSelectData", formSelectData);
        // create proper id list
        var i = 0;
        var roleGroupIdList = [];
        for (; i < formSelectData.length; i++) {
          roleGroupIdList.push( {id: formSelectData[i].value})
        }
        console.log("TCL: roleGroupIdList", roleGroupIdList);

				if (role) { // update role
					role = await TIMAAT.RoleLists.updateRoleOrRoleGroupModelData('role', role, formDataObject);
          await TIMAAT.RoleLists.updateRoleOrRoleGroup('role', role, roleGroupIdList);
					role.updateUI();
					await TIMAAT.RoleLists.refreshDatatable('role');
					TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'role', role);
        } 
        else { // create new role
					var roleModel = await TIMAAT.RoleLists.createRoleOrRoleGroupModel(formDataObject, 'role')
					// var nameModel = await TIMAAT.RoleLists.createNameModel(formDataObject);
          // var newRole = await TIMAAT.RoleLists.createRoleOrRoleGroup('role', roleModel, nameModel);
          var newRole = await TIMAAT.RoleLists.createRoleOrRoleGroup('role', roleModel, roleGroupIdList);
					role = new TIMAAT.Role(newRole, 'role');
					await TIMAAT.RoleLists.refreshDatatable('role');
					TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'role', role);
        }
        TIMAAT.RoleLists.setRoleGroupSelectListForId(role.model.id);
			});

      // edit content form button handler
      $('#timaat-rolelists-role-metadata-form-edit').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('edit', 'role', $('#timaat-rolelists-metadata-form').data('role'));
      });

      // Cancel add/edit button in content form functionality
			$('#timaat-rolelists-role-metadata-form-dismiss').on('click', function(event) {
				var role = $('#timaat-rolelists-metadata-form').data('role');
				if (role != null) {
					TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'role', role);
				} else { // dismiss role creation
					$('.form').hide();
				}
			});
    },

    initRoleGroups: function() {
      // nav-bar functionality
      $('#role-tab-rolegroup-metadata-form').on('click',function(event) {
        // $('.roles-data-tabs').show();
        $('.nav-tabs a[href="#roleGroupDatasheet"]').tab('show');
        $('.form').hide();
        $('#timaat-rolelists-metadata-form').show();
        TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'rolegroup', $('#timaat-rolelists-metadata-form').data('rolegroup'));
      });

      // confirm delete role group modal functionality
      $('#timaat-rolelists-rolegroup-delete-submit').on('click', async function(ev) {
        var modal = $('#timaat-rolelists-rolegroup-delete');
        var roleGroup = modal.data('rolegroup');
        if (roleGroup) {
          try {	
            await TIMAAT.RoleLists._roleOrRoleGroupRemoved('rolegroup', roleGroup);
          } catch(error) {
            console.log("error: ", error);
          }
          try {
            await TIMAAT.RoleLists.refreshDatatable('rolegroup');
            await TIMAAT.RoleLists.refreshDatatable('role');
          } catch(error) {
            console.log("error: ", error);
          }
        }
        $('#timaat-rolelists-metadata-form').attr('data-type', '');
        modal.modal('hide');
        $('#timaat-rolelists-metadata-form').hide();
        // $('.roles-data-tabs').hide();
        $('.form').hide();
      });

      // add role group button functionality (in role group list - opens datasheet form)
			$('#timaat-rolelists-rolegroup-add').on('click',function(event) {
        console.log("TCL: add rolegroup");
				$('#timaat-rolelists-metadata-form').data('rolegroup', null);
				TIMAAT.RoleLists.addRoleOrRoleGroup('rolegroup');
      });
      
      // role group form handlers
			// submit role group metadata button functionality
			$('#timaat-rolelists-rolegroup-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#timaat-rolelists-metadata-form').valid()) return false;

				// the original role group model (in case of editing an existing role group)
				var roleGroup = $('#timaat-rolelists-metadata-form').data('rolegroup');				
        // console.log("TCL: roleGroup", roleGroup);

				// create/edit role window submitted data
        var formDataRaw = $('#timaat-rolelists-metadata-form').serializeArray();
        console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
				$(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        delete formDataObject.roleId;
        console.log("TCL: formDataObject", formDataObject);
        var formSelectData = formDataRaw;
        formSelectData.splice(0,1); // remove entries not part of multi select data
        console.log("TCL: formSelectData", formSelectData);
        // create proper id list
        var i = 0;
        var roleIdList = [];
        for (; i < formSelectData.length; i++) {
          roleIdList.push( {id: formSelectData[i].value})
        }
        console.log("TCL: roleIdList", roleIdList);
        
				if (roleGroup) { // update role group
					roleGroup = await TIMAAT.RoleLists.updateRoleOrRoleGroupModelData('rolegroup', roleGroup, formDataObject);
					await TIMAAT.RoleLists.updateRoleOrRoleGroup('rolegroup', roleGroup, roleIdList);
					roleGroup.updateUI();
					await TIMAAT.RoleLists.refreshDatatable('rolegroup');
					TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'rolegroup', roleGroup);
        } 
        else { // create new role group
					var roleGroupModel = await TIMAAT.RoleLists.createRoleOrRoleGroupModel(formDataObject, 'rolegroup')
					// var nameModel = await TIMAAT.RoleLists.createNameModel(formDataObject);
          // var newRoleGroup = await TIMAAT.RoleLists.createRoleOrRoleGroup('rolegroup', roleModel, nameModel);
          var newRoleGroup = await TIMAAT.RoleLists.createRoleOrRoleGroup('rolegroup', roleGroupModel, roleIdList);
					roleGroup = new TIMAAT.RoleGroup(newRoleGroup, 'rolegroup');
					await TIMAAT.RoleLists.refreshDatatable('rolegroup');
					TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'rolegroup', roleGroup);
        }
        TIMAAT.RoleLists.setRoleSelectListForId(roleGroup.model.id);
			});

      // edit content form button handler
      $('#timaat-rolelists-rolegroup-metadata-form-edit').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('edit', 'rolegroup', $('#timaat-rolelists-metadata-form').data('rolegroup'));
      });

      // Cancel add/edit button in content form functionality
			$('#timaat-rolelists-rolegroup-metadata-form-dismiss').on('click', function(event) {
				var roleGroup = $('#timaat-rolelists-metadata-form').data('rolegroup');
				if (roleGroup != null) {
					TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'rolegroup', roleGroup);
				} else { // dismiss role creation
					$('.form').hide();
				}
			});
    },

    load: function() {
      TIMAAT.RoleLists.loadRoles();
      TIMAAT.RoleLists.loadRoleGroups();
      TIMAAT.RoleLists.loadSelectLists();
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

    loadRolesDatatables: async function() {
      console.log("TCL: loadRolesDatatables: async function()");
      TIMAAT.RoleLists.setupRoleDatatable();
      TIMAAT.RoleLists.setupRoleGroupDatatable();
    },

    loadSelectLists: function() {
      TIMAAT.RoleLists.setRoleSelectList();
      TIMAAT.RoleLists.setRoleGroupSelectList();
    },

    setRolesList: function() {
      $('.form').hide();
      $('.roles-data-tabs').hide();
      if ( TIMAAT.RoleLists.roles == null) return;
      console.log("TCL: TIMAAT.RoleLists.roles", TIMAAT.RoleLists.roles);

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

    setRoleSelectList: async function() {
			TIMAAT.RoleLists.roleSelectObjects = await TIMAAT.RoleService.getRoleOrRoleGroupSelectList('role');
      console.log("TCL: TIMAAT.RoleLists.roleSelectObjects", TIMAAT.RoleLists.roleSelectObjects);
			TIMAAT.RoleLists.sortRoleSelectOptions();
			TIMAAT.RoleLists.createRoleSortedOptionsString();
    },
    
    setRoleSelectListForId: async function(id) {
			TIMAAT.RoleLists.roleSelectObjects = await TIMAAT.RoleService.getRoleOrRoleGroupSelectListForId('role', id);
      console.log("TCL: TIMAAT.RoleLists.roleSelectObjects", TIMAAT.RoleLists.roleSelectObjects);
			TIMAAT.RoleLists.sortRoleSelectOptions();
			TIMAAT.RoleLists.createRoleSortedOptionsString();
		},

    setRoleGroupSelectList: async function() {
			TIMAAT.RoleLists.roleGroupSelectObjects = await TIMAAT.RoleService.getRoleOrRoleGroupSelectList('rolegroup');
      console.log("TCL: TIMAAT.RoleLists.roleGroupSelectObjects", TIMAAT.RoleLists.roleGroupSelectObjects);
			TIMAAT.RoleLists.sortRoleGroupSelectOptions();
			TIMAAT.RoleLists.createRoleGroupSortedOptionsString();
    },
    
    setRoleGroupSelectListForId: async function(id) {
			TIMAAT.RoleLists.roleGroupSelectObjects = await TIMAAT.RoleService.getRoleOrRoleGroupSelectListForId('rolegroup', id);
      console.log("TCL: TIMAAT.RoleLists.roleGroupSelectObjects", TIMAAT.RoleLists.roleGroupSelectObjects);
			TIMAAT.RoleLists.sortRoleGroupSelectOptions();
			TIMAAT.RoleLists.createRoleGroupSortedOptionsString();
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
            $('#timaat-rolelists-role-metadata-form').data('role', selectedRole);
            TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'role', selectedRole);
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
            $('.nav-tabs a[href="#rolegroupDatasheet"]').tab('show');
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
            TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'rolegroup', selectedRoleGroup);
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

    addRoleOrRoleGroup: function(type) {	
			// console.log("TCL: addRoleOrRolegroup: function()");
			console.log("TCL: addRoleOrRolegroup: type", type);
			$('.form').hide();
			// $('.roles-data-tabs').hide();
			// $('.nav-tabs a[href="#'+type+'Datasheet"]').show();
			$('#timaat-rolelists-metadata-form').data(type, null);
      roleOrRoleGroupFormMetadataValidator.resetForm();
      
			$('#timaat-rolelists-metadata-form').trigger('reset');
			$('#timaat-rolelists-metadata-form').show();
			$('.datasheet-data').hide();
			$('.name-data').show();
			// $('.'+type+'-data').show();
			$('.datasheet-form-edit-button').hide();
			$('.datasheet-form-delete-button').hide();
			$('.datasheet-form-buttons').hide()
			$('.'+type+'-datasheet-form-submit').show();
			$('#timaat-rolelists-metadata-form :input').prop('disabled', false);
			$('#timaat-rolelists-metadata-name').focus();

			// setup form
			$('#roleOrRoleGroupFormHeader').html(type+" hinzufügen");
      $('#timaat-rolelists-'+type+'-metadata-form-submit').html("Hinzufügen");

    },
    
    roleOrRoleGroupFormDatasheet: async function(action, type, data) {
      console.log("TCL: action, type, data: ", action, type, data);
      switch (type) {
        case 'role':
          var node = document.getElementById("dynamic-role-ispartof-rolegroup-fields");
        break;
        case 'rolegroup':
          var node = document.getElementById("dynamic-rolegroup-contains-role-fields");
        break;
      }
      
			while (node.lastChild) {
				node.removeChild(node.lastChild)
			}
      $('#timaat-rolelists-metadata-form').trigger('reset');
      $('#timaat-rolelists-metadata-form').attr('data-type', type);
      $('.datasheet-data').hide();
      $('.name-data').show();
      $('.'+type+'-data').show();
      roleOrRoleGroupFormMetadataValidator.resetForm();

      // show tabs
      // $('.'+type+'-data-tab').show();
      // $('.name-data-tab').show();

      // $('.nav-tabs a[href="#'+type+'Datasheet"]').focus();
      $('#timaat-rolelists-metadata-form').show();

      // for all ispartof entries of role, display multiple selection box with pre-selected items
      // if edit mode, allow editing of this list

      switch (type) {
        case 'role':
          var displayData = await TIMAAT.RoleService.getRoleOrRoleGroupSelectListForId('rolegroup', data.model.id)
          console.log("TCL: displayData", displayData);
          var isPartOfRoleGroupData = TIMAAT.RoleLists.appendRoleIsPartOfRoleGroupsDataset();
          $('#dynamic-role-ispartof-rolegroup-fields').append(isPartOfRoleGroupData);
          $('.rolegroups-multi-select-dropdown').select2({
            closeOnSelect: false,
            scrollAfterSelect: true,
            allowClear: true,
            data: displayData,
            // ajax: {
            //   url: 'api/role/group/selectlist',
            //   dataType: 'json',
            //   delay: 250,
            // //   // additional parameters
            //   data: function(params) {
            //     console.log("TCL: params", params);
            //     var queryParameters = {
            //       roleId: params.term
            //     }
            //     return queryParameters;
            //     var query = {
            //       search: params.term,
            //       page: params.page || 1
            //       type: 'public'
            //     }
            //     return query;
            // 
            //   beforeSend: function (xhr) {
            //     xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
            //   },
            //   processResults: function(data) {
            //     return {
            //       results: data.items;
            //       pagination: {
            //         more: (params.page * 10) < data.count_filtered
            //       }
            //     }
            //   }
            // },
          });
        break;
        case 'rolegroup':
          console.log("TCL: getRoleOrRoleGroupSelectListForId");
          var displayData = await TIMAAT.RoleService.getRoleOrRoleGroupSelectListForId('role', data.model.id);
          // console.log("TCL: displayData", displayData);
          var containsRoleData = TIMAAT.RoleLists.appendRoleGroupContainsRolesDataset();
          $('#dynamic-rolegroup-contains-role-fields').append(containsRoleData);
          $('.roles-multi-select-dropdown').select2({
            closeOnSelect: false,
            scrollAfterSelect: true,
            allowClear: true,
            data: displayData,
            // ajax: {
            //   url: 'api/role/selectlist',
            //   dataType: 'json'
            //   // additional parameters
            // }
          });
        break;
      }

      if ( action == 'show') {
        $('#timaat-rolelists-metadata-form :input').prop('disabled', true);
        $('.datasheet-form-edit-button').hide();
        $('#timaat-rolelists-'+type+'-metadata-form-edit').show();
        $('#timaat-rolelists-'+type+'-metadata-form-edit').prop('disabled', false);
        $('#timaat-rolelists-'+type+'-metadata-form-edit :input').prop('disabled', false);
        $('#timaat-rolelists-metadata-form-delete').show();
        $('#timaat-rolelists-metadata-form-delete').prop('disabled', false);
        $('#timaat-rolelists-metadata-form-delete :input').prop('disabled', false);
        $('.datasheet-form-buttons').hide()
        $('#roleOrRoleGroupFormHeader').html(type+" Datasheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        $('.datasheet-form-buttons').hide();
        $('.'+type+'-datasheet-form-submit').show();
        $('#timaat-rolelists-metadata-form :input').prop('disabled', false);
        $('.datasheet-form-edit-button').hide();
        $('#timaat-rolelists-'+type+'-metadata-form-edit').prop('disabled', true);
        $('#timaat-rolelists-'+type+'-metadata-form-edit :input').prop('disabled', true);
        $('#timaat-rolelists-metadata-form-delete').hide();
        $('#timaat-rolelists-metadata-form-delete').prop('disabled', true);
        $('#timaat-rolelists-metadata-form-delete :input').prop('disabled', true);
        $('#roleOrRoleGroupFormHeader').html(type+" bearbeiten");
        $('#timaat-rolelists-'+type+'-metadata-form-submit').html("Speichern");
        $('#timaat-rolelists-metadata-name').focus();
      }

      // console.log("TCL: data", data);
      // setup UI

      // role data
      // $('#timaat-rolelists-'+type+'-metadata-type-id').val(data.type.id);
      // name data
      switch(type) {
        case 'role':
          $('#timaat-rolelists-metadata-name').val(data.model.roleTranslations[0].name);
          $('#timaat-rolelists-metadata-name-language-id').val(data.model.roleTranslations[0].language.id);
        break;
        case 'rolegroup':
          $('#timaat-rolelists-metadata-name').val(data.model.roleGroupTranslations[0].name);
          $('#timaat-rolelists-metadata-name-language-id').val(data.model.roleGroupTranslations[0].language.id);
        break
      }

      $('#timaat-rolelists-metadata-form').data(type, data);
    },

    createRoleOrRoleGroupModel: async function(formDataObject, type) {
      switch(type) {
        case 'role':
          var model = {
            id: 0,
            roleTranslations: [{
              id: 0,
              role: {
                id: 0
              },
              language: {
                id: 1 //Number(formDataObject.languageId),
              },
              name: formDataObject.name,
            }],
          };
        break;
        case 'rolegroup':
          var model = {
            id: 0,
            roleGroupTranslations: [{
              id: 0,
              roleGroup: {
                id: 0
              },
              language: {
                id: 1 //Number(formDataObject.languageId),
              },
              name: formDataObject.name,
            }],
            roles: []
          };
        break;
      }
			
			return model;
		},

    updateRoleOrRoleGroupModelData: async function(type, data, formDataObject) {
    	console.log("TCL: type, data, formDataObject: ", type, data, formDataObject);
      // TODO check whether any data has to/can be changed here
      switch(type) {
        case 'role':
          data.model.roleTranslations[0].name = formDataObject.name;
          // model.roleTranslations[0].language.id = Number(formDataObject.languageId);
        break;
        case 'rolegroup':
          data.model.roleGroupTranslations[0].name = formDataObject.name;
          // model.roleGroupTranslations[0].language.id = Number(formDataObject.languageId);
        break;
      }
			return data;
    },

    createRoleOrRoleGroup: async function(type, model, roleOrRoleGroupIdList) {
    	console.log("TCL: createRoleOrRoleGroup: type, model, roleOrRoleGroupIdList: ", type, model, roleOrRoleGroupIdList);
			try {				
        // create role or role group
        var newModel = await TIMAAT.RoleService.createRoleOrRoleGroup(type);
        console.log("TCL: newModel", newModel);
        model.id = newModel.id;
        var newTranslation = await TIMAAT.RoleService.addTranslation(type, model)
        console.log("TCL: newTranslation", newTranslation);

        if (roleOrRoleGroupIdList != null) {
          await TIMAAT.RoleService.createRoleGroupHasRoles(type, model.id, roleOrRoleGroupIdList);
        }

        switch (type) {
          case 'role':
            model.roleTranslations[0] = newTranslation;
            TIMAAT.RoleLists.roleSelectObjects.push({id: model.id, text: model.roleTranslations[0].name, selected: false});
						TIMAAT.RoleLists.sortRoleSelectOptions();
						TIMAAT.RoleLists.createRoleSortedOptionsString();
          break;
          case 'rolegroup':
            model.roleGroupTranslations[0] = newTranslation;
            TIMAAT.RoleLists.roleGroupSelectObjects.push({id: model.id, text: model.roleGroupTranslations[0].name, selected: false});
						TIMAAT.RoleLists.sortRoleGroupSelectOptions();
						TIMAAT.RoleLists.createRoleGroupSortedOptionsString();
          break;
        }				
			} catch(error) {
				console.log( "error: ", error);
			};
      console.log("TCL: model", model);
			return (model);
		},

    updateRoleOrRoleGroup: async function(type, roleOrRoleGroup, roleOrRoleGroupIdList) {
      console.log("TCL: updateRoleOrRoleGroup: async function -> role/roleGroup at beginning of update process: ", type, roleOrRoleGroup, roleOrRoleGroupIdList);
      
      try { // update translation
        switch (type) {
          case 'role':
            var tempName = await TIMAAT.RoleService.updateTranslation(type, roleOrRoleGroup.model.roleTranslations[0], roleOrRoleGroup.model.id);
            roleOrRoleGroup.model.roleTranslations[0] = tempName;
          break;
          case 'rolegroup':
            var tempName = await TIMAAT.RoleService.updateTranslation(type, roleOrRoleGroup.model.roleGroupTranslations[0], roleOrRoleGroup.model.id);
            roleOrRoleGroup.model.roleGroupTranslations[0] = tempName;
          break;
        }
      } catch(error) {
        console.log( "error: ", error);
      };

      try { // update role_group_has_role table entries
        // var existingTranslations = await TIMAAT.RoleService.getRoleGroupHasRoleList(type, roleOrRoleGroup.model.id);
        // console.log("TCL: existingTranslations", existingTranslations);
        var existingTranslations = [];
        switch (type) {
          case 'role':
            existingTranslations = await TIMAAT.RoleService.getRoleGroupHasRoleList(type, roleOrRoleGroup.model.id);
            console.log("TCL: existingTranslations", existingTranslations);
          break;
          case 'rolegroup':
            existingTranslations = await TIMAAT.RoleService.getRoleGroupHasRoleList(type, roleOrRoleGroup.model.id);
            // existingTranslations = roleOrRoleGroup.model.roles;
            console.log("TCL: existingTranslations", existingTranslations);
          break;
        }
        if (roleOrRoleGroupIdList == null) { //* all entries will be deleted
          console.log("TCL: delete all existingTranslations: ", existingTranslations);
          // delete existingTranslations.roleTranslations; // only keep role id for delete procedure
          await TIMAAT.RoleService.deleteRoleGroupHasRoles(type, roleOrRoleGroup.model.id, existingTranslations);
        } else if (existingTranslations.length == 0) { //* all entries will be added
          console.log("TCL: add all roleOrRoleGroupIdList entries: ", roleOrRoleGroupIdList);
          await TIMAAT.RoleService.createRoleGroupHasRoles(type, roleOrRoleGroup.model.id, roleOrRoleGroupIdList);
        } else {
          console.log("TCL: existingTranslations", existingTranslations);
          console.log("TCL: roleOrRoleGroupIdList", roleOrRoleGroupIdList);
          //* delete removed entries
          var translationsToDelete = [];
          var i = 0;
          for (; i < existingTranslations.length; i++) {
            var deleteId = true;
            var item = {};
            var j = 0;
            for (; j < roleOrRoleGroupIdList.length; j++) {
              if( existingTranslations[i].id == roleOrRoleGroupIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingTranslations but not in roleOrRoleGroupIdList
              console.log("TCL: delete entry: ", existingTranslations[i]);
              item.id = existingTranslations[i].id;
              translationsToDelete.push(item);
              existingTranslations.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          console.log("TCL: translationsToDelete", translationsToDelete);
          if (translationsToDelete.length > 0) { // anything to delete?
            await TIMAAT.RoleService.deleteRoleGroupHasRoles(type, roleOrRoleGroup.model.id, translationsToDelete);
          }
          //* create new entries
          var idsToCreate = [];
          i = 0;
          for (; i < roleOrRoleGroupIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingTranslations.length; j++) {
              if (roleOrRoleGroupIdList[i].id == existingTranslations[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = roleOrRoleGroupIdList[i].id;
              console.log("TCL: roleOrRoleGroupIdList[i]", roleOrRoleGroupIdList[i]);
              console.log("TCL: item", item);
              idsToCreate.push(item);
              console.log("TCL: idsToCreate", idsToCreate);
            }
          }
          console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            await TIMAAT.RoleService.createRoleGroupHasRoles(type, roleOrRoleGroup.model.id, idsToCreate);
          }
        }
          if (type == 'rolegroup') {
            roleOrRoleGroup.model.roles = await TIMAAT.RoleService.getRoleGroupHasRoleList(type, roleOrRoleGroup.model.id);
          }
      } catch(error) {
        console.log( "error: ", error);
      };
      
      roleOrRoleGroup.updateUI();
    },

    _roleOrRoleGroupRemoved: async function(type, model) {
      console.log("TCL: type, model", type, model);
      try {
        switch(type) {
          case 'role':
            // remove deleted role from role select option list
            var index = TIMAAT.RoleLists.roleSelectObjects.findIndex( ({id}) => id === model.id );
            TIMAAT.RoleLists.roleSelectObjects.splice(index,1);
            TIMAAT.RoleLists.createRoleSortedOptionsString();

            // TODO check whether current actors have to be updated here and now
          break;
          case 'rolegroup':
            // remove deleted role group from role group select option list
            var index = TIMAAT.RoleLists.roleGroupSelectObjects.findIndex( ({id}) => id === model.id );
            TIMAAT.RoleLists.roleGroupSelectObjects.splice(index,1);
            TIMAAT.RoleLists.createRoleGroupSortedOptionsString();
          break;
        }
      } catch(error) {
        console.log("error: ", error)
      }

      try {
        await TIMAAT.RoleService.deleteRoleOrRoleGroup(type, model);
      } catch(error) {
        console.log("error: ", error)
      }
      model.remove();
    },

    appendRoleIsPartOfRoleGroupsDataset: function() {
      var isPartOfRoleGroupFormData =
			`<div class="form-group" data-role="roleispartofrolegroup-entry">
				<div class="form-row">
					<div class="col-md-12">
            <label class="sr-only">Is part of Rolegroup(s)</label>
            <select class="form-control form-control-sm rolegroups-multi-select-dropdown"
                    name="roleGroupId"
                    data-placeholder="Select role group(s)"
                    multiple="multiple"
                    readonly="true">`;
      // append list of rolegroups for selection list
      // isPartOfRoleGroupFormData +=	TIMAAT.RoleLists.roleGroupSelectObjectsSorted;
      isPartOfRoleGroupFormData +=
            `</select>
					</div>
				</div>
			</div>`;
			return isPartOfRoleGroupFormData;
    },

    appendRoleGroupContainsRolesDataset: function() {
      var isPartOfRoleFormData =
			`<div class="form-group" data-role="rolegroupcontainsrole-entry">
				<div class="form-row">
					<div class="col-md-12">
            <label class="sr-only">Contains Role(s)</label>
            <select class="form-control form-control-sm roles-multi-select-dropdown"
                    name="roleId"
                    data-placeholder="Select role(s)"
                    multiple="multiple"
                    readonly="true">`;
      // append list of rolegroups for selection list
      // isPartOfRoleFormData +=	TIMAAT.RoleLists.roleSelectObjectsSorted;
      isPartOfRoleFormData +=
            `</select>
					</div>
				</div>
			</div>`;
			return isPartOfRoleFormData;
    },

    /** sorts list of role objects by their name */
		sortRoleSelectOptions: function() {
			TIMAAT.RoleLists.roleSelectObjects.sort(function(a,b) {
				var x = a.text.toLowerCase();
				var y = b.text.toLowerCase();
				if (x < y) {return -1;}
				if (x > y) {return 1;}
				return 0;
			});
    },
    
    /** sorts list of role group objects by their name */
		sortRoleGroupSelectOptions: function() {
			TIMAAT.RoleLists.roleGroupSelectObjects.sort(function(a,b) {
				var x = a.text.toLowerCase();
				var y = b.text.toLowerCase();
				if (x < y) {return -1;}
				if (x > y) {return 1;}
				return 0;
			});
    },
    
    /** creates string of option entries for role selection in form based on the sorted role object list */
		createRoleSortedOptionsString: function() {
			// delete any outdated list
			if (TIMAAT.RoleLists.roleSelectObjectsSorted != '') {
				TIMAAT.RoleLists.roleSelectObjectsSorted = '';
			}
			TIMAAT.RoleLists.roleSelectObjects.forEach(function(entry) {
				TIMAAT.RoleLists.roleSelectObjectsSorted += `<option value="`+entry.id+`" selected="`+entry.selected+`">`+entry.text+`</option>
				`;
			});
    },
    
    /** creates string of option entries for role group selection in form based on the sorted role group object list */
		createRoleGroupSortedOptionsString: function() {
			// delete any outdated list
			if (TIMAAT.RoleLists.roleGroupSelectObjectsSorted != '') {
				TIMAAT.RoleLists.roleGroupSelectObjectsSorted = '';
			}
			TIMAAT.RoleLists.roleGroupSelectObjects.forEach(function(entry) {
				TIMAAT.RoleLists.roleGroupSelectObjectsSorted += `<option value="`+entry.id+`" selected="`+entry.selected+`">`+entry.text+`</option>
				`;
			});
    },
    
    serializeObject: function(formData) {
      var o = {};
      $.each(formData, function() {
        // formMultiSelectObject[field.name] = field.value;
        if (o[this.name]) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    },

  }

}, window));