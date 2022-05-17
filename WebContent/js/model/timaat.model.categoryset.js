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
				`<li class="list-group__item">
					<div class="row">
						<div class="col-lg-10">` +
							`<span class="timaat-categorylists-categoryset-list-name">
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

			// $('#timaat-categorylists-categoryset-list').append(this.listView);
			// console.log("TCL: CategorySet -> constructor -> this.updateUI()");
			var categorySet = this; // save categoryset for system events

			this.updateUI();

			// attach categoryset handlers
			$(this.listView).on('click', this, function(ev) {
				// console.log("TCL: CategorySet -> constructor -> open categoryset datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.categorysets-nav-tabs').show();
				$('.categorysets-data-tabs').hide();
				$('.nav-tabs a[href="#categorySetDatasheet"]').tab('show');
				$('#category-metadata-form').data('categorySet', categorySet);
        // console.log("TCL: CategorySet -> constructor -> categorySet", categorySet);
				TIMAAT.CategoryLists.categoryOrCategorySetFormDataSheet('show', 'categorySet', categorySet);
			});
    }

		updateUI() {
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.timaat-categorylists-categoryset-list-name').text(name);

		}

		remove() {
			// remove categoryset from UI
			this.listView.remove();
      // console.log("TCL: CategorySet -> remove -> this", this);
			$('#category-metadata-form').data('categorySet', null);
			// remove from categoryset lists
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
