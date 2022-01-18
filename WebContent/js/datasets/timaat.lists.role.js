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
      this.initRoles();
      this.initRoleGroups();
    },

    initRoles: function() {
      // nav-bar functionality
      $('#role-tab').on('click', function(event) {
        TIMAAT.RoleLists.loadRoles();
        TIMAAT.UI.displayComponent('role', 'role-tab', 'role-datatable');
        TIMAAT.URLHistory.setURL(null, 'Role Datasets', '#role/list');
      });

      // edit content form button handler
      $('#role-metadata-form-edit-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#role-metadata-form').data('role'), 'role', 'edit')
      });

      // submit content form button functionality
			$('#role-metadata-form-submit-button').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#role-metadata-form').valid()) return false;

				// the original role or role group model (in case of editing an existing role or role group)
				var role = $('#role-metadata-form').data('role');				

				// create/edit role or role group window submitted data
				var formDataRaw = $('#role-metadata-form').serializeArray();
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        // delete formDataObject.roleGroupId;
        var formSelectData = formDataRaw;
        formSelectData.splice(0,1); // remove entries not part of multi select data
        // TODO split id lists properly
        // create proper id list
        var i = 0;
        var roleGroupIdList = [];
        var roleActorIdList = [];
        for (; i < formSelectData.length; i++) {
          if (formSelectData[i].name == 'roleGroupId' )
            roleGroupIdList.push( {id: formSelectData[i].value} );
          if (formSelectData[i].name == 'actorId' )
            roleActorIdList.push( {id: formSelectData[i].value} );
        }
				if (role) { // update role
          role.model.roleTranslations[0].name = formDataObject.name;
          let roleData = role.model;
          delete roleData.ui;
          await TIMAAT.RoleLists.updateRole(roleData, roleGroupIdList, roleActorIdList);
        } 
        else { // create new role
					var roleModel = await TIMAAT.RoleLists.createRoleModel(formDataObject);
          var newRole = await TIMAAT.RoleService.createRole(roleModel);
          let i = 0;
          for (; i < roleGroupIdList.length; i++) {
            let roleGroup = await TIMAAT.RoleService.getRoleGroup(roleGroupIdList[i].id);
            roleGroup.roles.push(newRole);
            await TIMAAT.RoleService.updateRoleGroup(roleGroup);
          }
          i = 0;
          for (; i < roleActorIdList.length; i++) {
            let actor = await TIMAAT.ActorService.getActor(roleActorIdList[i].id);
            actor.roles.push(newRole);
            await TIMAAT.ActorService.updateActor(actor);
          }
          role = new TIMAAT.Role(newRole);
          $('#role-metadata-form').data('role', role);
          $('#list-tab-metadata').data('type', 'role');
					$('#list-tab-metadata').trigger('click');
        }
        TIMAAT.RoleLists.showAddRoleButton();
        await TIMAAT.UI.refreshDataTable('role');
        TIMAAT.UI.addSelectedClassToSelectedItem('role', role.model.id);
        TIMAAT.UI.displayDataSetContent('dataSheet', role, 'role');
			});

      // delete button (in form) handler
      $('#role-metadata-form-delete-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#timaat-rolelists-role-delete').data('role', $('#role-metadata-form').data('role'));
        $('#timaat-rolelists-role-delete').modal('show');
      });

      // confirm delete role modal functionality
      $('#timaat-rolelists-role-delete-submit-button').on('click', async function(ev) {
        var modal = $('#timaat-rolelists-role-delete');
        var role = modal.data('role');
        if (role) {
          try {	
            await TIMAAT.RoleService.deleteRole(role.model.id);
            role.remove();
          } catch(error) {
            console.error("ERROR: ", error);
          }
          try {
            await TIMAAT.UI.refreshDataTable('roleGroup');
            await TIMAAT.UI.refreshDataTable('role');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        // TIMAAT.RoleLists.loadRoles();
        $('#role-tab').trigger('click');
      });

      // cancel add/edit button in content form functionality
			$('#role-metadata-form-dismiss-button').on('click', async function(event) {
        TIMAAT.RoleLists.showAddRoleButton();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#timaat-rolelists-role-table').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

    },

    initRoleGroups: function() {
      // nav-bar functionality
      $('#rolegroup-tab').on('click', function(event) {
        TIMAAT.RoleLists.loadRoleGroups();
        TIMAAT.UI.displayComponent('roleGroup', 'rolegroup-tab', 'rolegroup-datatable');
        TIMAAT.URLHistory.setURL(null, 'Role Group Datasets', '#roleGroup/list');
      });

      // edit content form button handler
      $('#rolegroup-metadata-form-edit-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#rolegroup-metadata-form').data('roleGroup'), $('#list-tab-metadata').data('type'), 'edit')
      });

      // submit content form button functionality
			$('#rolegroup-metadata-form-submit-button').on('click', async function(event) {
				// continue only if client side validation has passed
				event.preventDefault();
				if (!$('#rolegroup-metadata-form').valid()) return false;

				// the original role or role group model (in case of editing an existing role or role group)
				var roleGroup = $('#rolegroup-metadata-form').data('roleGroup');

				// create/edit role or role group window submitted data
				var formDataRaw = $('#rolegroup-metadata-form').serializeArray();
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        // delete formDataObject.roleId;
        var formSelectData = formDataRaw;
        formSelectData.splice(0,1); // remove entries not part of multi select data
        // TODO split id lists properly
        // create proper id list
        var i = 0;
        var roleIdList = [];
        for (; i < formSelectData.length; i++) {
          if (formSelectData[i].name == 'roleId' )
            roleIdList.push( {id: formSelectData[i].value} );
        }
				if (roleGroup) { // update role group
          roleGroup.model.roleGroupTranslations[0].name = formDataObject.name;
          let roleGroupData = roleGroup.model;
          delete roleGroupData.ui;
          await TIMAAT.RoleLists.updateRoleGroup(roleGroupData, roleIdList);
        } 
        else { // create new role group
					var roleGroupModel = await TIMAAT.RoleLists.createRoleGroupModel(formDataObject);
          roleGroupModel.roles = roleIdList;
          var newRoleGroup = await TIMAAT.RoleService.createRoleGroup(roleGroupModel);
          roleGroup = new TIMAAT.RoleGroup(newRoleGroup);
          $('#rolegroup-metadata-form').data('roleGroup', roleGroup);
          $('#list-tab-metadata').data('type', 'roleGroup');
					$('#list-tab-metadata').trigger('click');
        }
        TIMAAT.RoleLists.showAddRoleGroupButton();
        await TIMAAT.UI.refreshDataTable('roleGroup');
        TIMAAT.UI.addSelectedClassToSelectedItem('roleGroup', roleGroup.model.id);
        TIMAAT.UI.displayDataSetContent('dataSheet', roleGroup, 'roleGroup');
			});

      // delete button (in form) handler
      $('#rolegroup-metadata-form-delete-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#timaat-rolelists-rolegroup-delete').data('roleGroup', $('#rolegroup-metadata-form').data('roleGroup'));
        $('#timaat-rolelists-rolegroup-delete').modal('show');
      });

      // confirm delete role group modal functionality
      $('#timaat-rolelists-rolegroup-delete-submit-button').on('click', async function(ev) {
        var modal = $('#timaat-rolelists-rolegroup-delete');
        var roleGroup = modal.data('roleGroup');
        // console.log("TCL: $ -> roleGroup", roleGroup);
        if (roleGroup) {
          try {	
            await TIMAAT.RoleService.deleteRoleGroup(roleGroup.model.id);
            roleGroup.remove();
          } catch(error) {
            console.error("ERROR: ", error);
          }
          try {
            await TIMAAT.UI.refreshDataTable('roleGroup');
            await TIMAAT.UI.refreshDataTable('role');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        // $('#list-tab-metadata').data('type', '');
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        // TIMAAT.RoleLists.loadRoleGroups();
        $('#rolegroup-tab').trigger('click');
      });
      
      // cancel add/edit button in content form functionality
			$('#rolegroup-metadata-form-dismiss-button').on('click', async function(event) {
        TIMAAT.RoleLists.showAddRoleGroupButton();
				let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#timaat-rolelists-rolegroup-table').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

    },

    load: function() {
      this.loadRoles();
      this.loadRoleGroups();
    },

    loadRoles: function() {
			$('#list-tab-metadata').data('type', 'role');
			TIMAAT.UI.addSelectedClassToSelectedItem('role', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
      this.showAddRoleButton();
      this.setRolesList();
    },

    loadRoleGroups: function() {
			$('#list-tab-metadata').data('type', 'roleGroup');
			TIMAAT.UI.addSelectedClassToSelectedItem('roleGroup', null);
			TIMAAT.UI.subNavTab = 'dataSheet';
      this.showAddRoleGroupButton();
      this.setRoleGroupsList();
    },

    loadRolesDataTables: function() {
      this.setupRoleDataTable();
      this.setupRoleGroupDataTable();
    },

    setRolesList: function() {
      if ( this.roles == null) return;
      if ( this.dataTableRoles ) {
        this.dataTableRoles.ajax.reload(null, false);
        TIMAAT.UI.clearLastSelection('role');
      }
    },

    setRoleGroupsList: function() {
      if ( this.roleGroups == null ) return;
      if ( this.dataTableRoleGroups ) {
        this.dataTableRoleGroups.ajax.reload(null, false);
        TIMAAT.UI.clearLastSelection('roleGroup');
      }
    },

    setupRoleDataTable: function() {			
      // console.log("TCL: setupRoleDataTable");
      // setup dataTable
      this.dataTableRoles = $('#timaat-rolelists-role-table').DataTable({
        "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "order"         : [[ 0, 'asc' ]],
        "pagingType"    : "full", // "simple_numbers",
        "dom"           : '<lf<t>ip>',
        "processing"    : true,
        "stateSave"     : true,
        "scrollY"       : "60vh",
        "scrollCollapse": true,
        "scrollX"       : false,
        "rowId"         : 'id',
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
            // setup model
            var roleArray = Array();
            data.data.forEach(function(role) { 
              if ( role.id > 0 ) {
                roleArray.push(new TIMAAT.Role(role));
              }
            });
            TIMAAT.RoleLists.roles = roleArray;
            TIMAAT.RoleLists.roles.model = data.data;
            return data.data;
          }
        },
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedRoleId) {
						TIMAAT.UI.clearLastSelection('role');
						$(row).addClass('selected');
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
            TIMAAT.RoleLists.setRoleDataTableOnItemSelect(role.id);
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

    setupRoleGroupDataTable: function() {			
      // console.log("TCL: setupRoleGroupDataTable");
      // setup dataTable
      this.dataTableRoleGroups = $('#timaat-rolelists-rolegroup-table').DataTable({
        "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "order"         : [[ 0, 'asc' ]],
        "pagingType"    : "full", // "simple_numbers",
        "dom"           : '<lf<t>ip>',
        "processing"    : true,
        "stateSave"     : true,
        "scrollY"       : "60vh",
        "scrollCollapse": true,
        "scrollX"       : false,
        "rowId"         : 'id',
        "serverSide"    : true,
        "ajax"          : {
          "url"        : "api/roleGroup/list",
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
            // setup model
            var roleGroupArray = Array();
            data.data.forEach(function(roleGroup) { 
              if ( roleGroup.id > 0 ) {
                roleGroupArray.push(new TIMAAT.RoleGroup(roleGroup));
              }
            });
            TIMAAT.RoleLists.roleGroups = roleGroupArray;
            TIMAAT.RoleLists.roleGroups.model = data.data;
            return data.data;
          }
        },
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedRoleGroupId) {
						TIMAAT.UI.clearLastSelection('roleGroup');
						$(row).addClass('selected');
					}
				},
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let roleGroupElement = $(row);
          let roleGroup = data;
          roleGroup.ui = roleGroupElement;
          roleGroupElement.data('roleGroup', roleGroup);

          roleGroupElement.on('click', '.name', function(event) {
            event.stopPropagation();
            TIMAAT.RoleLists.setRoleGroupDataTableOnItemSelect(roleGroup.id);
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

    setRoleDataTableOnItemSelect: function(selectedItemId) {
			// show tag editor - trigger popup
			TIMAAT.UI.hidePopups();
			// switch (TIMAAT.UI.subNavTab) {
			// 	case 'dataSheet':
      TIMAAT.UI.displayDataSetContentContainer('role-data-tab', 'role-metadata-form', 'role');
			// 	break;
			// }
			TIMAAT.UI.clearLastSelection('role');
			let index;
			let selectedItem;
      index = this.roles.findIndex(({model}) => model.id === selectedItemId);
      selectedItem = this.roles[index];
      $('#list-tab-metadata').data('type', 'role');
      $('#role-metadata-form').data('role', selectedItem);
      TIMAAT.UI.addSelectedClassToSelectedItem('role', selectedItemId);
      TIMAAT.URLHistory.setURL(null, selectedItem.model.roleTranslations[0].name + ' · Datasets · Role', '#role/' + selectedItem.model.id);
      this.showAddRoleButton();
			TIMAAT.UI.displayDataSetContent('dataSheet', selectedItem, 'role');
    },

    setRoleGroupDataTableOnItemSelect: function(selectedItemId) {
			// show tag editor - trigger popup
			TIMAAT.UI.hidePopups();
			// switch (TIMAAT.UI.subNavTab) {
			// 	case 'dataSheet':
      TIMAAT.UI.displayDataSetContentContainer('rolegroup-data-tab', 'rolegroup-metadata-form', 'roleGroup');
			// 	break;
			// }
			TIMAAT.UI.clearLastSelection('roleGroup');
			let index;
			let selectedItem;
      index = this.roleGroups.findIndex(({model}) => model.id === selectedItemId);
      selectedItem = this.roleGroups[index];
      $('#list-tab-metadata').data('type', 'roleGroup');
      $('#role-metadata-form').data('roleGroup', selectedItem);
      TIMAAT.UI.addSelectedClassToSelectedItem('roleGroup', selectedItemId);
      TIMAAT.URLHistory.setURL(null, selectedItem.model.roleGroupTranslations[0].name + ' · Datasets · Role Group', '#roleGroup/' + selectedItem.model.id);
			this.showAddRoleGroupButton();
      TIMAAT.UI.displayDataSetContent('dataSheet', selectedItem, 'roleGroup');
    },

    addRole: function() {	
			// console.log("TCL: addRole: function()");
      TIMAAT.UI.displayDataSetContentContainer('list-tab-metadata', 'role-metadata-form');
      $('#list-tab-metadata').data('type', 'role');
			$('#role-metadata-form').data('role', null);
      $('#rolegroups-multi-select-dropdown').val(null).trigger('change'); //! clears the visible list entries but not the selected elements of the dropdown list
      $('#actors-multi-select-dropdown').val(null).trigger('change'); //! clears the visible list entries but not the selected elements of the dropdown list
      var node = document.getElementById('dynamic-role-ispartof-rolegroup-fields');
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
      node = document.getElementById('dynamic-role-actor-fields');
			while (node.lastChild) {
				node.removeChild(node.lastChild);
      }
      roleFormMetadataValidator.resetForm();

      TIMAAT.UI.addSelectedClassToSelectedItem('role', null);

      // setup form
			$('#role-metadata-form').trigger('reset');
      this.initFormDataSheetData('role');
      this.initFormDataSheetForEdit('role');
      $('#role-metadata-form-submit-button').html("Add");
      $('#roleFormHeader').html("Add Role");

      $('#dynamic-role-ispartof-rolegroup-fields').append(this.appendRoleIsPartOfRoleGroupsDataset());
      $('#rolegroups-multi-select-dropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/roleGroup/selectList',
          type: 'GET',
          dataType: 'json',
          delay: 250,
          headers: {
            "Authorization": "Bearer "+TIMAAT.Service.token,
            "Content-Type": "application/json",
          },
          // additional parameters
          data: function(params) {
            // console.log("TCL: data: params", params);
            return {
              search: params.term,
              page: params.page
            };          
          },
          processResults: function(data, params) {
            // console.log("TCL: processResults: data", data);
            params.page = params.page || 1;
            return {
              results: data
            };
          },
          cache: false
        },
        minimumInputLength: 0,
      });
      $('#dynamic-role-actor-fields').append(this.appendRoleActorsDataset());
      $('#actors-multi-select-dropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/actor/selectList',
          type: 'GET',
          dataType: 'json',
          delay: 250,
          headers: {
            "Authorization": "Bearer "+TIMAAT.Service.token,
            "Content-Type": "application/json",
          },
          // additional parameters
          data: function(params) {
            // console.log("TCL: data: params", params);
            return {
              search: params.term,
              page: params.page
            };          
          },
          processResults: function(data, params) {
            // console.log("TCL: processResults: data", data);
            params.page = params.page || 1;
            return {
              results: data
            };
          },
          cache: false
        },
        minimumInputLength: 0,
      });
      
    },

    addRoleGroup: function() {	
			// console.log("TCL: addRoleGroup: function()");
      TIMAAT.UI.displayDataSetContentContainer('list-tab-metadata', 'rolegroup-metadata-form');
      $('#list-tab-metadata').data('type', 'roleGroup');
			$('#rolegroup-metadata-form').data('roleGroup', null);
      // $('#roles-multi-select-dropdown').val(null).trigger('change'); //! clears the visible list entries but not the selected elements of the dropdown list
      var node = document.getElementById('dynamic-rolegroup-contains-role-fields');
			while (node.lastChild) {
				node.removeChild(node.lastChild);
      }
      roleGroupFormMetadataValidator.resetForm();
      
      TIMAAT.UI.addSelectedClassToSelectedItem('roleGroup', null);

      // setup form
			$('#rolegroup-metadata-form').trigger('reset');
      this.initFormDataSheetData('roleGroup');
      this.initFormDataSheetForEdit('roleGroup');
      $('#rolegroup-metadata-form-submit-button').html("Add");
      $('#roleGroupFormHeader').html("Add Role Group");

      $('#dynamic-rolegroup-contains-role-fields').append(this.appendRoleGroupContainsRolesDataset());
      $('#roles-multi-select-dropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/role/selectList',
          type: 'GET',
          dataType: 'json',
          delay: 250,
          headers: {
            "Authorization": "Bearer "+TIMAAT.Service.token,
            "Content-Type": "application/json",
          },
          // additional parameters
          data: function(params) {
            // console.log("TCL: data: params", params);
            return {
              search: params.term,
              page: params.page
            };          
          },
          processResults: function(data, params) {
            // console.log("TCL: processResults: data", data);
            params.page = params.page || 1;
            return {
              results: data
            };
          },
          cache: false
        },
        minimumInputLength: 0,
      }); 
    },

    roleFormDataSheet: async function(action, data) {
      // console.log("TCL: roleFormDataSheet - action, data: ", action, data);
      var node = document.getElementById('dynamic-role-ispartof-rolegroup-fields');
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
      node = document.getElementById('dynamic-role-actor-fields');
			while (node.lastChild) {
				node.removeChild(node.lastChild);
      }

      TIMAAT.UI.addSelectedClassToSelectedItem('role', data.model.id);
      $('#role-metadata-form').trigger('reset');
      $('#list-tab-metadata').data('type', 'role');
      this.initFormDataSheetData('role');
      roleFormMetadataValidator.resetForm();

      $('#dynamic-role-ispartof-rolegroup-fields').append(this.appendRoleIsPartOfRoleGroupsDataset());
      $('#rolegroups-multi-select-dropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/roleGroup/selectList',
          type: 'GET',
          dataType: 'json',
          delay: 250,
          headers: {
            "Authorization": "Bearer "+TIMAAT.Service.token,
            "Content-Type": "application/json",
          },
          // additional parameters
          data: function(params) {
            // console.log("TCL: data: params", params);
            return {
              search: params.term,
              page: params.page
            };          
          },
          processResults: function(data, params) {
            // console.log("TCL: processResults: data", data);
            params.page = params.page || 1;
            return {
              results: data
            };
          },
          cache: false
        },
        minimumInputLength: 0,
      });
      await TIMAAT.RoleService.getRoleHasRoleGroupList(data.model.id).then(function (data) {
        // console.log("TCL: then: data", data);
        var roleGroupSelect = $('#rolegroups-multi-select-dropdown');
        if (data.length > 0) {
          data.sort((a, b) => (a.roleGroupTranslations[0].name > b.roleGroupTranslations[0].name) ? 1 : -1);
          // create the options and append to Select2
          var i = 0;
          for (; i < data.length; i++) {
            var option = new Option(data[i].roleGroupTranslations[0].name, data[i].id, true, true);
            roleGroupSelect.append(option).trigger('change');
          }
          // manually trigger the 'select2:select' event
          roleGroupSelect.trigger({
            type: 'select2:select',
            params: {
              data: data
            }
          });
        }
      });
      $('#dynamic-role-actor-fields').append(this.appendRoleActorsDataset());
      $('#actors-multi-select-dropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/actor/selectList',
          type: 'GET',
          dataType: 'json',
          delay: 250,
          headers: {
            "Authorization": "Bearer "+TIMAAT.Service.token,
            "Content-Type": "application/json",
          },
          // additional parameters
          data: function(params) {
            // console.log("TCL: data: params", params);
            return {
              search: params.term,
              page: params.page
            };          
          },
          processResults: function(data, params) {
            // console.log("TCL: processResults: data", data);
            params.page = params.page || 1;
            return {
              results: data
            };
          },
          cache: false
        },
        minimumInputLength: 0,
      });
      await TIMAAT.ActorService.getActorsWithThisRoleList(data.model.id).then(function (data) {
        var actorSelect = $('#actors-multi-select-dropdown');
        if (data.length > 0) {
          data.sort((a, b) => (a.displayName.name > b.displayName.name) ? 1 : -1);
          // create the options and append to Select2
          var i = 0;
          for (; i < data.length; i++) {
            var option = new Option(data[i].displayName.name, data[i].id, true, true);
            actorSelect.append(option).trigger('change');
          }
          // manually trigger the 'select2:select' event
          actorSelect.trigger({
            type: 'select2:select',
            params: {
              data: data
            }
          });
        }
      });

      if ( action == 'show') {
        $('#role-metadata-form :input').prop('disabled', true);
        this.initFormForShow();
        $('#roleFormHeader').html("Role data sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit('role');
        $('#role-metadata-form-submit-button').html("Save");
        $('#roleFormHeader').html("Edit Role");
      }
      // name data
      $('#timaat-role-metadata-name').val(data.model.roleTranslations[0].name);

      $('#role-metadata-form').data('role', data);
    },

    roleGroupFormDataSheet: async function(action, data) {
      // console.log("TCL: roleGroupFormDataSheet - action, data: ", action, data);
      var node = document.getElementById('dynamic-rolegroup-contains-role-fields');
			while (node.lastChild) {
				node.removeChild(node.lastChild);
      }

      TIMAAT.UI.addSelectedClassToSelectedItem('roleGroup', data.model.id);
      $('#rolegroup-metadata-form').trigger('reset');
      // $('#list-tab-metadata').data('type', 'roleGroup');
      this.initFormDataSheetData('roleGroup');
      roleGroupFormMetadataValidator.resetForm();

      $('#dynamic-rolegroup-contains-role-fields').append(this.appendRoleGroupContainsRolesDataset());
      $('#roles-multi-select-dropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/role/selectList',
          type: 'GET',
          dataType: 'json',
          delay: 250,
          headers: {
            "Authorization": "Bearer "+TIMAAT.Service.token,
            "Content-Type": "application/json",
          },
          // additional parameters
          data: function(params) {
            // console.log("TCL: data: params", params);
            return {
              search: params.term,
              page: params.page
            };          
          },
          processResults: function(data, params) {
            // console.log("TCL: processResults: data", data);
            params.page = params.page || 1;
            return {
              results: data
            };
          },
          cache: false
        },
        minimumInputLength: 0,
      });          
      var roleSelect = $('#roles-multi-select-dropdown');
      await TIMAAT.RoleService.getRoleGroupHasRoleList(data.model.id).then(function (data) {
        // console.log("TCL: then: data", data);
        if (data.length > 0) {
          data.sort((a, b) => (a.roleTranslations[0].name > b.roleTranslations[0].name) ? 1 : -1);
          // create the options and append to Select2
          var i = 0;
          for (; i < data.length; i++) {
            var option = new Option(data[i].roleTranslations[0].name, data[i].id, true, true);
            roleSelect.append(option).trigger('change');
          }
          // manually trigger the 'select2:select' event
          roleSelect.trigger({
            type: 'select2:select',
            params: {
              data: data
            }
          });
        }
      });

      if ( action == 'show') {
        $('#rolegroup-metadata-form :input').prop('disabled', true);
        this.initFormForShow();
        $('#roleGroupFormHeader').html("Role Group data sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit('roleGroup');
        $('#rolegroup-metadata-form-submit-button').html("Save");
        $('#roleGroupFormHeader').html("Edit Role Group");
      }
      // name data
      $('#timaat-rolegroup-metadata-name').val(data.model.roleGroupTranslations[0].name);

      $('#rolegroup-metadata-form').data('roleGroup', data);
    },

    createRoleModel: async function(formDataObject) {
      // console.log("TCL: formDataObject", formDataObject);
      let model = {
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
			return model;
		},

    createRoleGroupModel: async function(formDataObject) {
      // console.log("TCL: formDataObject", formDataObject);
      let model = {
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
      return model;
    },

    updateRole: async function(role, roleGroupIdList, roleActorIdList) {
      // console.log("TCL: updateRole: async function -> role at beginning of update process: ", role, roleGroupIdList, roleActorIdList);
      try { // update translation
        var tempName = await TIMAAT.RoleService.updateRoleTranslation(role.roleTranslations[0]);
        role.roleTranslations[0] = tempName;
      } catch(error) {
        console.error("ERROR: ", error);
      };
      try { // update role_group_has_role table entries via role
        var existingRoleGroupEntries = await TIMAAT.RoleService.getRoleHasRoleGroupList(role.id);
        // console.log("TCL: existingRoleGroupEntries", existingRoleGroupEntries);
        // console.log("TCL: roleGroupIdList", roleGroupIdList);
        if (roleGroupIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all existingRoleGroupEntries: ", existingRoleGroupEntries);
          var i = 0;
          for (; i < existingRoleGroupEntries.length; i++) {
            var index = existingRoleGroupEntries.findIndex( ({roleGroup}) => roleGroup.model.roles.id === role.id)
            existingRoleGroupEntries[i].model.roles.splice(index,1);
            await TIMAAT.RoleService.updateRoleGroup(existingRoleGroupEntries[i]);
          }         
        } else if (existingRoleGroupEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all roleGroupIdList: ", roleGroupIdList);
          var i = 0;
          for (; i < roleGroupIdList.length; i++) {
            // console.log("TCL: roleGroupIdList[i].id", roleGroupIdList[i].id);
            var roleGroup = await TIMAAT.RoleService.getRoleGroup(roleGroupIdList[i].id);
            roleGroup.roles.push(role);
            await TIMAAT.RoleService.updateRoleGroup(roleGroup);
          }
        } else { //* add/remove entries
          // delete removed entries
          var roleGroupEntriesToDelete = [];
          var i = 0;
          for (; i < existingRoleGroupEntries.length; i++) {
            var deleteId = true;
            var j = 0;
            for (; j < roleGroupIdList.length; j++) {
              if( existingRoleGroupEntries[i].id == roleGroupIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingRoleGroupEntries but not in roleGroupIdList
              // console.log("TCL: delete entry: ", existingRoleGroupEntries[i]);
              roleGroupEntriesToDelete.push(existingRoleGroupEntries[i]);
              existingRoleGroupEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: roleGroupEntriesToDelete", roleGroupEntriesToDelete);
          if (roleGroupEntriesToDelete.length > 0) { // anything to delete?
            var i = 0;
            for (; i < roleGroupEntriesToDelete.length; i++) {
              // console.log("TCL: roleGroupEntriesToDelete[i].id", roleGroupEntriesToDelete[i].id);
              var roleGroup = await TIMAAT.RoleService.getRoleGroup(roleGroupEntriesToDelete[i].id);
              var index = roleGroup.roles.findIndex(({id}) => id === role.id);
              roleGroup.roles.splice(index,1);
              await TIMAAT.RoleService.updateRoleGroup(roleGroup);
            }
          }
          // create new entries
          var idsToCreate = [];
          i = 0;
          for (; i < roleGroupIdList.length; i++) {
            // console.log("TCL: roleGroupIdList", roleGroupIdList);
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingRoleGroupEntries.length; j++) {
              // console.log("TCL: existingRoleGroupEntries", existingRoleGroupEntries);
              if (roleGroupIdList[i].id == existingRoleGroupEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = roleGroupIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
            var i = 0;
            for (; i < idsToCreate.length; i++ ) {
              // console.log("TCL: idsToCreate[i].id", idsToCreate[i].id);
              var roleGroup = await TIMAAT.RoleService.getRoleGroup(idsToCreate[i].id);
              roleGroup.roles.push(role);
              await TIMAAT.RoleService.updateRoleGroup(roleGroup);
            }
          }
        }
      } catch(error) {
        console.error("ERROR: ", error);
      };

      try { // update actor.roles entries
        var existingActorHasRolesEntries = await TIMAAT.ActorService.getActorsWithThisRoleList(role.id);
        // console.log("TCL: existingActorHasRolesEntries", existingActorHasRolesEntries);
        // console.log("TCL: roleActorIdList", roleActorIdList);
        if (roleActorIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all existingActorHasRolesEntries: ", existingActorHasRolesEntries);
          var i = 0;
          for (; i < existingActorHasRolesEntries.length; i++) {
            var index = existingActorHasRolesEntries.findIndex( ({actor}) => actor.model.roles.id === role.id)
            existingActorHasRolesEntries[i].model.roles.splice(index,1);
            await TIMAAT.ActorService.updateActor(existingActorHasRolesEntries[i]);
          }       
        } else if (existingActorHasRolesEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all roleActorIdList: ", roleActorIdList);
          var i = 0;
          for (; i < roleActorIdList.length; i++) {
            // console.log("TCL: roleActorIdList[i].id", roleActorIdList[i].id);
            var actor = await TIMAAT.ActorService.getActor(roleActorIdList[i].id);
            actor.roles.push(role);
            await TIMAAT.ActorService.updateActor(actor);
          }
        } else { //* add/remove entries
          // delete removed entries
          var actorHasRoleEntriesToDelete = [];
          var i = 0;
          for (; i < existingActorHasRolesEntries.length; i++) {
            var deleteId = true;
            var j = 0;
            for (; j < roleActorIdList.length; j++) {
              if( existingActorHasRolesEntries[i].id == roleActorIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingActorHasRolesEntries but not in roleActorIdList
              // console.log("TCL: delete entry: ", existingActorHasRolesEntries[i]);
              actorHasRoleEntriesToDelete.push(existingActorHasRolesEntries[i]);
              existingActorHasRolesEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: actorHasRoleEntriesToDelete", actorHasRoleEntriesToDelete);
          if (actorHasRoleEntriesToDelete.length > 0) { // anything to delete?
            var i = 0;
            for (; i < actorHasRoleEntriesToDelete.length; i++) {
              // console.log("TCL: actorHasRoleEntriesToDelete[i].id", actorHasRoleEntriesToDelete[i].id);
              var actor = await TIMAAT.ActorService.getActor(actorHasRoleEntriesToDelete[i].id);
              var index = actor.roles.findIndex(({id}) => id === role.id);
              actor.roles.splice(index,1);
              await TIMAAT.ActorService.updateActor(actor);
            }
          }
          // create new entries
          var idsToCreate = [];
          i = 0;
          for (; i < roleActorIdList.length; i++) {
            // console.log("TCL: roleActorIdList", roleActorIdList);
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingActorHasRolesEntries.length; j++) {
              // console.log("TCL: existingActorHasRolesEntries", existingActorHasRolesEntries);
              if (roleActorIdList[i].id == existingActorHasRolesEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = roleActorIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
            var i = 0;
            for (; i < idsToCreate.length; i++ ) {
              // console.log("TCL: idsToCreate[i].id", idsToCreate[i].id);
              var actor = await TIMAAT.ActorService.getActor(idsToCreate[i].id);
              actor.roles.push(role);
              await TIMAAT.ActorService.updateActor(actor);
            }
          }
        }
      } catch(error) {
        console.error("ERROR: ", error);
      };
      
      await TIMAAT.UI.refreshDataTable('role');
      await TIMAAT.UI.refreshDataTable('roleGroup');
      // await TIMAAT.UI.refreshDataTable('actor');
      await TIMAAT.UI.refreshDataTable('person');
      await TIMAAT.UI.refreshDataTable('collective');
    },

    updateRoleGroup: async function(roleGroup, roleIdList) {
      // console.log("TCL: updateRoleGroup: async function -> roleGroup at beginning of update process: ", roleGroup, roleIdList);
      try { // update translation
        var tempName = await TIMAAT.RoleService.updateRoleGroupTranslation(roleGroup.roleGroupTranslations[0]);
        roleGroup.roleGroupTranslations[0] = tempName;
      } catch(error) {
        console.error("ERROR: ", error);
      };

      try { // update role_group_has_role table entries via role group
        var existingRoleEntries = await TIMAAT.RoleService.getRoleGroupHasRoleList(roleGroup.id);
        // console.log("TCL: existingRoleEntries", existingRoleEntries);
        // console.log("TCL: roleIdList", roleIdList);
        if (roleIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all existingRoleEntries: ", existingRoleEntries);
          roleGroup.roles = [];
          await TIMAAT.RoleService.updateRoleGroup(roleGroup);       
        } else if (existingRoleEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all roleIdList: ", roleIdList);
          roleGroup.roles = roleIdList;
          await TIMAAT.RoleService.updateRoleGroup(roleGroup);          
        } else { //* add/remove entries
          // delete removed entries
          var roleEntriesToDelete = [];
          var i = 0;
          for (; i < existingRoleEntries.length; i++) {
            var deleteId = true;
            var j = 0;
            for (; j < roleIdList.length; j++) {
              if( existingRoleEntries[i].id == roleIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingRoleEntries but not in roleIdList
              // console.log("TCL: delete entry: ", existingRoleEntries[i]);
              roleEntriesToDelete.push(existingRoleEntries[i]);
              existingRoleEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: roleEntriesToDelete", roleEntriesToDelete);
          if (roleEntriesToDelete.length > 0) { // anything to delete?
            var i = 0;
            for (; i < roleEntriesToDelete.length; i++) {
              var index = roleGroup.roles.findIndex(({id}) => id === roleEntriesToDelete[i].id);
              roleGroup.roles.splice(index,1);
            }
            await TIMAAT.RoleService.updateRoleGroup(roleGroup);
          }
          // create new entries
          var idsToCreate = [];
          i = 0;
          for (; i < roleIdList.length; i++) {
            // console.log("TCL: roleIdList", roleIdList);
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingRoleEntries.length; j++) {
              // console.log("TCL: existingRoleEntries", existingRoleEntries);
              if (roleIdList[i].id == existingRoleEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = roleIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
            var i = 0;
            for (; i < idsToCreate.length; i++) {
              roleGroup.roles.push(idsToCreate[i]);
              await TIMAAT.RoleService.updateRoleGroup(roleGroup);
            }
          }
        }
      } catch(error) {
        console.error("ERROR: ", error);
      };
      
      await TIMAAT.UI.refreshDataTable('role');
      await TIMAAT.UI.refreshDataTable('roleGroup');
    },

    initFormDataSheetForEdit: function(type) {
      $('#role-metadata-form :input').prop('disabled', false);
      $('#rolegroup-metadata-form :input').prop('disabled', false);
      this.hideFormButtons();
      $('.form-submit-button').show();
      $('.form-dismiss-button').show();
      if (type == 'role') {
        $('#timaat-role-metadata-name').focus();
        this.hideAddRoleButton();
      } else {
        $('#timaat-rolegroup-metadata-name').focus();
        this.hideAddRoleGroupButton();
      }
    },

    initFormForShow: function() {
      $('.form-buttons').prop('disabled', false);
			$('.form-buttons :input').prop('disabled', false);
			$('.form-buttons').show();
      $('.form-submit-button').hide();
      $('.form-dismiss-button').hide();
    },

    initFormDataSheetData: function(type) {
      $('.datasheet-data').hide();
      $('.name-data').show();
      if (type == 'role') {
      $('.role-data').show();
      } else {
        $('.rolegroup-data').show();
      }
    },

    hideFormButtons: function() {
			$('.form-buttons').hide();
			$('.form-buttons').prop('disabled', true);
			$('.form-buttons :input').prop('disabled', true);
		},

    showAddRoleButton: function() {
      $('.add-role-button').prop('disabled', false);
      $('.add-role-button :input').prop('disabled', false);
      $('.add-role-button').show();
    },

    hideAddRoleButton: function() {
      $('.add-role-button').hide();
      $('.add-role-button').prop('disabled', true);
      $('.add-role-button :input').prop('disabled', true);
    },

    showAddRoleGroupButton: function() {
      $('.add-rolegroup-button').prop('disabled', false);
      $('.add-rolegroup-button :input').prop('disabled', false);
      $('.add-rolegroup-button').show();
    },

    hideAddRoleGroupButton: function() {
      $('.add-rolegroup-button').hide();
      $('.add-rolegroup-button').prop('disabled', true);
      $('.add-rolegroup-button :input').prop('disabled', true);
    },

    appendRoleIsPartOfRoleGroupsDataset: function() {
      var multiSelectFormData =
			`<div class="form-group" data-role="roleispartofrolegroup-entry">
				<div class="form-row">
					<div class="col-md-12">
            <label class="sr-only">Is part of Rolegroup(s)</label>
            <select class="form-control form-control-sm"
                    id="rolegroups-multi-select-dropdown"
                    name="roleGroupId"
                    data-placeholder="Select role group(s)"
                    multiple="multiple"
                    readonly="true">
            </select>
					</div>
				</div>
			</div>`;
			return multiSelectFormData;
    },

    appendRoleActorsDataset: function() {
      var multiSelectFormData =
			`<div class="form-group" data-role="role-actor-entry">
				<div class="form-row">
					<div class="col-md-12">
            <label class="sr-only">Actors with this role</label>
            <select class="form-control form-control-sm"
                    id="actors-multi-select-dropdown"
                    name="actorId"
                    data-placeholder="Select actor(s)"
                    multiple="multiple"
                    readonly="true">
            </select>
					</div>
				</div>
			</div>`;
			return multiSelectFormData;
    },

    appendRoleGroupContainsRolesDataset: function() {
      var isPartOfRoleFormData =
			`<div class="form-group" data-role="rolegroupcontainsrole-entry">
				<div class="form-row">
					<div class="col-md-12">
            <label class="sr-only">Contains Role(s)</label>
            <select class="form-control form-control-sm"
                    id="roles-multi-select-dropdown"
                    name="roleId"
                    data-placeholder="Select role(s)"
                    multiple="multiple"
                    readonly="true">
            </select>
					</div>
				</div>
			</div>`;
			return isPartOfRoleFormData;
    },

  }

}, window));