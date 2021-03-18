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
        console.log("TCL: CategorySet -> constructor -> categorySet", categorySet);
				TIMAAT.CategoryLists.categoryOrCategorySetFormDataSheet('show', 'categorySet', categorySet);
			});
    }

		updateUI() {
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-categorylists-categoryset-list-name').text(name);
	
		}

		remove() {
			// remove categoryset from UI
			this.listView.remove();
      console.log("TCL: CategorySet -> remove -> this", this);
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
	
	// TIMAAT.CategorySet = class CategorySet {
	// 	constructor(model) {
	// 	      // console.log("TCL: CategorySet -> constructor -> model", model);
	// 				// setup model
	// 				this.model = model;
	// 				// model.ui = this;
					
	// 				// create and style list view element
	// 				var delcategorySet = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-categoryset-remove float-left"><i class="fas fa-trash-alt"></i></button>';
	// 				if ( model.id < 0 ) delcategorySet = '';
	// 				this.listView = $('<li class="list-group-item categoryset-item list-group-item-action categoryset-item-'+model.id+'"> '
	// 						+ delcategorySet +
	// 						'<span class="timaat-categoryset-list-title"></span>' +
	// 						'<span class="text-nowrap timaat-categoryset-list-categories float-right text-muted"><i class=""></i></span><br> \
	// 						<div class="timaat-categoryset-list-count text-muted float-left"></div> \
	// 						<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user-disabled"></i></div> \
	// 					</li>'
	// 			);

	// 				// $('#timaat-categoryset-list').append(this.listView);
	// 				// console.log("TCL: CategorySet -> constructor -> this.updateUI()");
	// 				this.updateUI();      
					
	// 				var categorySet = this; // save categoryset for events
					
	// 				// attach user log info
	// 				// this.listView.find('.timaat-user-log').popover({
	// 				// 	placement: 'right',
	// 				// 	title: '<i class="fas fa-user"></i> Bearbeitungslog',
	// 				// 	trigger: 'click',
	// 				// 	html: true,
	// 				// 	content: '<div class="timaat-user-log-details">Lade...</div>',
	// 				// 	container: 'body',
	// 				// 	boundary: 'viewport',				
	// 				// });
	// 				// this.listView.find('.timaat-user-log').on('show.bs.popover', function () {
	// 				// 	TIMAAT.UI.hidePopups();
	// 				// });
	// 				// this.listView.find('.timaat-user-log').on('inserted.bs.popover', function () {
	// 				// 	$('.timaat-user-log-details').html(
	// 				// 			'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+categorySet.model.createdByUserAccount.id+'">[ID '+categorySet.model.createdByUserAccount.id+']</span></b><br>\
	// 				// 			 '+TIMAAT.Util.formatDate(categorySet.model.createdAt)+'<br>\
	// 				// 			 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+categorySet.model.lastEditedByUserAccount.id+'">[ID '+categorySet.model.lastEditedByUserAccount.id+']</span></b><br>\
	// 				// 			 '+TIMAAT.Util.formatDate(categorySet.model.lastEditedAt)+'<br>'
	// 				// 	);
	// 				// 	$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
	// 				// });
	// 				// attach category editor
	// 				// console.log("TCL: CategorySet -> constructor -> categorySet.updateUI()");
	// 				this.listView.find('.timaat-categoryset-list-categories').on('hidden.bs.popover', function () { categorySet.updateUI(); });
	// 				this.listView.find('.timaat-categoryset-list-categories').on('dblclick', function(ev) {ev.stopPropagation();});

	// 				// // attach user log info
	// 				// this.listView.find('.timaat-user-log').on('click', function(ev) {
	// 				// 	ev.preventDefault();
	// 				// 	ev.stopPropagation();
	// 				// });
					
	// 				// attach event handlers
	// 				var _set = this;
	// 				$(this.listView).on('click', this, function(ev) {
	// 					ev.stopPropagation();
	// 					// show category editor - trigger popup
	// 					TIMAAT.UI.hidePopups();
	// 					TIMAAT.CategoryLists.loadCategories(_set);
	// 				});
	// 				$(this.listView).on('dblclick', this, function(ev) {
	// 					ev.stopPropagation();
	// 					TIMAAT.UI.hidePopups();				
	// 					// show metadata editor
	// 					$('#timaat-categorylists-categoryset-meta').data('categorySet', categorySet);
	// 					$('#timaat-categorylists-categoryset-meta').modal('show');			
	// 				});
					
	// 				// remove handler
	// 				this.listView.find('.timaat-categoryset-remove').on('click', this, function(ev) {
	// 					ev.stopPropagation();
	// 					TIMAAT.UI.hidePopups();				
	// 					$('#timaat-categorylists-categoryset-delete').data('categorySet', categorySet);
	// 					$('#timaat-categorylists-categoryset-delete').modal('show');
	// 				});

	// 			}
				
	// 			updateUI() {
	// 	      // console.log("TCL: CategorySet -> updateUI -> updateUI()");
	// 				// title
	// 				var name = this.model.name;
	// 				if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
	// 				this.listView.find('.timaat-categoryset-list-title').text(name);
	// 				// category count
	// 				/*
	// 				var count = this.model.categorySetHasCategories.length + " Kategorien";
	// 				if ( this.model.categorySetHasCategories.length == 0 ) count = "keine Kategorien";
	// 				if ( this.model.categorySetHasCategories.length == 1 ) count = "eine Kategorie";
	// 				this.listView.find('.timaat-categoryset-list-count').text(count);
	// 				*/
	// 				// tags
	// 				/*
	// 				this.listView.find('.timaat-categoryset-list-tags i').attr('title', this.model.tags.length+" Tags");			
	// 				if (this.model.tags.length == 0) this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tag timaat-no-tags');
	// 				else if (this.model.tags.length == 1) this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
	// 				else this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tags text-dark');
	// 				*/
	// 			}
				
	// 			remove() {
	// 	      console.log("TCL: CategorySet -> remove -> remove()");
	// 				// remove annotation from UI
	// 				this.listView.remove();
					
	// 				// remove from categoryset list
	// 				var index = TIMAAT.CategoryLists.categorySets.indexOf(this);
	// 				if (index > -1) TIMAAT.CategoryLists.categorySets.splice(index, 1);

	// 				// remove from model list
	// 				index = TIMAAT.CategoryLists.categorySets.model.indexOf(this);
	// 				if (index > -1) TIMAAT.CategoryLists.categorySets.model.splice(index, 1);

	// 			}
				
	// 		}
	
}, window));
