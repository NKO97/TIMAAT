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
  
  TIMAAT.RoleGroup = class RoleGroup {
    constructor(model) {
      // console.log("TCL: RoleGroup -> constructor -> model", model);
			// setup model
			this.model = model;

			// create and style list view element
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							`<span class="timaat-rolelists-rolegroup-list-name">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat-user-log" style="margin-left: 12px; margin-bottom: 10px;">
									<i class="fas fa-user"></i>							
								</div>
						  </div>
						</div>
					</div>
				</li>`
			);

			// $('#timaat-rolelists-rolegroup-list').append(this.listView);
			// console.log("TCL: RoleGroup -> constructor -> this.updateUI()");    
			var roleGroup = this; // save rolegroup for system events

			this.updateUI();  

			// attach rolegroup handlers
			$(this.listView).on('click', this, function(ev) {
				// console.log("TCL: RoleGroup -> constructor -> open rolegroup datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.rolegroups-nav-tabs').show();
				$('.rolegroups-data-tabs').hide();
				$('.nav-tabs a[href="#roleGroupDatasheet"]').tab('show');
				$('#timaat-rolelists-metadata-form').data('rolegroup', roleGroup);
        console.log("TCL: RoleGroup -> constructor -> roleGroup", roleGroup);
				TIMAAT.RoleLists.roleOrRoleGroupFormDatasheet('show', 'rolegroup', roleGroup);
			});
    }

		updateUI() {
			var name = this.model.roleGroupTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-rolelists-rolegroup-list-name').text(name);
	
		}

		remove() {
			// remove rolegroup from UI
			this.listView.remove();
      console.log("TCL: RoleGroup -> remove -> this", this);
			$('#timaat-rolelists-metadata-form').data('rolegroup', null);
			// remove from role groups list
			var index;
			for (var i = 0; i < TIMAAT.RoleLists.roleGroups.length; i++) {
				if (TIMAAT.RoleLists.roleGroups[i].model.id == this.model.id) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				TIMAAT.RoleLists.roleGroups.splice(index, 1);
				TIMAAT.RoleLists.roleGroups.model.splice(index, 1);
			}
			// remove from roles list
      var roleIndex;
      for (var i = 0; i < TIMAAT.RoleLists.roles.length; i++) {
        if (TIMAAT.RoleLists.roles[i].model.id == this.model.id) {
          roleIndex = i;
          break;
        }
      }
      if (roleIndex > -1) {
        TIMAAT.RoleLists.roles.splice(roleIndex, 1);
        TIMAAT.RoleLists.roles.model.splice(roleIndex, 1);
      }
		}
  }
	
}, window));