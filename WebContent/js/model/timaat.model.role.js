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
  
  TIMAAT.Role = class Role {
    constructor(model) {
      // console.log("TCL: Role -> constructor -> model", model);
			// setup model
			this.model = model;

			// create and style list view element
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							`  <span class="timaat-roledatasets-role-list-name">
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

			$('#timaat-roledatasets-role-list').append(this.listView);
			// console.log("TCL: Role -> constructor -> this.updateUI()");    
			var role = this; // save role for system events

			this.updateUI();  

			// attach role handlers
			$(this.listView).on('click', this, function(ev) {
				// console.log("TCL: Role -> constructor -> open role datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.roles-nav-tabs').show();
				$('.roles-data-tabs').hide();
				$('.nav-tabs a[href="#roleDatasheet"]').tab("show");
				$('#timaat-roledatasets-role-metadata-form').data('role', role);
				TIMAAT.RoleLists.roleFormDatasheet("show", role);
			});
    }

		updateUI() {
			var name = this.model.roleTranslations[0].name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-roledatasets-role-list-name').text(name);
	
		}

		remove() {
			// remove role from UI
			this.listView.remove();
      console.log("TCL: Role -> remove -> this", this);
			$('#timaat-roledatasets-role-metadata-form').data('role', null);
			// remove from roles list
			var index;
			for (var i = 0; i < TIMAAT.RoleLists.roles.length; i++) {
				if (TIMAAT.RoleLists.roles[i].model.id == this.model.id) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				TIMAAT.RoleLists.roles.splice(index, 1);
				TIMAAT.RoleLists.roles.model.splice(index, 1);
			}
			// remove from rolegroup list
      var roleGroupIndex;
      for (var i = 0; i < TIMAAT.RoleLists.roleGroups.length; i++) {
        if (TIMAAT.RoleLists.roleGroups[i].model.id == this.model.id) {
          roleGroupIndex = i;
          break;
        }
      }
      if (roleGroupIndex > -1) {
        TIMAAT.RoleLists.roleGroups.splice(roleGroupIndex, 1);
        TIMAAT.RoleLists.roleGroups.model.splice(roleGroupIndex, 1);
      }
		}
  }
	
}, window));