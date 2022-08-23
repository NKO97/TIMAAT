/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
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

	TIMAAT.CategorySet = class CategorySet {
    constructor(model) {
      // console.log("TCL: CategorySet -> constructor -> model", model);
			// setup model
			this.model = model;

			// create and style list view element
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							`<span class="categorySetListName">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat__user-log">
									<i class="fas fa-user"></i>
								</div>
						  </div>
						</div>
					</div>
				</li>`
			);

			// $('#categorySetList').append(this.listView);
			// console.log("TCL: CategorySet -> constructor -> this.updateUI()");
			var categorySet = this; // save category set for system events

			this.updateUI();

			// attach categoryset handlers
			$(this.listView).on('click', this, function(ev) {
				// console.log("TCL: CategorySet -> constructor -> open category set dataSheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.categorySetsNavTabs').show();
				$('.categorySetsDataTabs').hide();
				$('.nav-tabs a[href="#categorySetDataSheet"]').tab('show');
				$('#categoryFormMetadata').data('categorySet', categorySet);
        // console.log("TCL: CategorySet -> constructor -> categorySet", categorySet);
				TIMAAT.CategoryLists.categoryOrCategorySetFormDataSheet('show', 'categorySet', categorySet);
			});
    }

		updateUI() {
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.categorySetListName').text(name);

		}

		remove() {
			// remove category set from UI
			this.listView.remove();
      // console.log("TCL: CategorySet -> remove -> this", this);
			$('#categoryFormMetadata').data('categorySet', null);
			// remove from category set lists
			var index;
			for (var i = 0; i < TIMAAT.CategoryLists.categorySets.length; i++) {
				if (TIMAAT.CategoryLists.categorySets[i].model.id == this.model.id) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				TIMAAT.CategoryLists.categorySets.splice(index, 1);
				TIMAAT.CategoryLists.categorySets.model.splice(index, 1);
			}
			// remove from categories list
      var categoryIndex;
      for (var i = 0; i < TIMAAT.CategoryLists.categories.length; i++) {
        if (TIMAAT.CategoryLists.categories[i].model.id == this.model.id) {
          categoryIndex = i;
          break;
        }
      }
      if (categoryIndex > -1) {
        TIMAAT.CategoryLists.categories.splice(categoryIndex, 1);
        TIMAAT.CategoryLists.categories.model.splice(categoryIndex, 1);
      }
		}
	}

}, window));
