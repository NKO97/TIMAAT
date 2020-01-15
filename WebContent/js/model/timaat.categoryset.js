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
					model.ui = this;
					
					// create and style list view element
					var delcategoryset = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-categoryset-remove float-left"><i class="fas fa-trash-alt"></i></button>';
					if ( model.id < 0 ) delcategoryset = '';
					this.listView = $('<li class="list-group-item categoryset-item list-group-item-action categoryset-item-'+model.id+'"> '
							+ delcategoryset +
							'<span class="timaat-categoryset-list-title"></span>' +
							'<span class="text-nowrap timaat-categoryset-list-categories float-right text-muted"><i class=""></i></span><br> \
							<div class="timaat-categoryset-list-count text-muted float-left"></div> \
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user-disabled"></i></div> \
						</li>'
				);

					$('#timaat-categoryset-list').append(this.listView);
					// console.log("TCL: CategorySet -> constructor -> this.updateUI()");
					this.updateUI();      
					
					var categoryset = this; // save categoryset for events
					
					// attach user log info
					// this.listView.find('.timaat-user-log').popover({
					// 	placement: 'right',
					// 	title: '<i class="fas fa-user"></i> Bearbeitungslog',
					// 	trigger: 'click',
					// 	html: true,
					// 	content: '<div class="timaat-user-log-details">Lade...</div>',
					// 	container: 'body',
					// 	boundary: 'viewport',				
					// });
					// this.listView.find('.timaat-user-log').on('show.bs.popover', function () {
					// 	TIMAAT.UI.hidePopups();
					// });
					// this.listView.find('.timaat-user-log').on('inserted.bs.popover', function () {
					// 	$('.timaat-user-log-details').html(
					// 			'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+categoryset.model.createdByUserAccount.id+'">[ID '+categoryset.model.createdByUserAccount.id+']</span></b><br>\
					// 			 '+TIMAAT.Util.formatDate(categoryset.model.createdAt)+'<br>\
					// 			 <b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+categoryset.model.lastEditedByUserAccount.id+'">[ID '+categoryset.model.lastEditedByUserAccount.id+']</span></b><br>\
					// 			 '+TIMAAT.Util.formatDate(categoryset.model.lastEditedAt)+'<br>'
					// 	);
					// 	$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
					// });
					// attach category editor
					// console.log("TCL: CategorySet -> constructor -> categoryset.updateUI()");
					this.listView.find('.timaat-categoryset-list-categories').on('hidden.bs.popover', function () { categoryset.updateUI(); });
					this.listView.find('.timaat-categoryset-list-categories').dblclick(function(ev) {ev.stopPropagation();});

					// // attach user log info
					// this.listView.find('.timaat-user-log').click(function(ev) {
					// 	ev.preventDefault();
					// 	ev.stopPropagation();
					// });
					
					// attach event handlers
					$(this.listView).click(this, function(ev) {
						ev.stopPropagation();
						// show category editor - trigger popup
						TIMAAT.UI.hidePopups();
						TIMAAT.Settings.loadCategories(model);
					});
					$(this.listView).dblclick(this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();				
						// show metadata editor
						$('#timaat-settings-categoryset-meta').data('categoryset', categoryset);
						$('#timaat-settings-categoryset-meta').modal('show');			
					});
					
					// remove handler
					this.listView.find('.timaat-categoryset-remove').click(this, function(ev) {
						ev.stopPropagation();
						TIMAAT.UI.hidePopups();				
						$('#timaat-settings-categoryset-delete').data('categoryset', categoryset);
						$('#timaat-settings-categoryset-delete').modal('show');
					});

				}
				
				updateUI() {
		      // console.log("TCL: CategorySet -> updateUI -> updateUI()");
					// title
					var name = this.model.name;
					if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
					this.listView.find('.timaat-categoryset-list-title').text(name);
					// category count
					/*
					var count = this.model.categorySetHasCategories.length + " Kategorien";
					if ( this.model.categorySetHasCategories.length == 0 ) count = "keine Kategorien";
					if ( this.model.categorySetHasCategories.length == 1 ) count = "eine Kategorie";
					this.listView.find('.timaat-categoryset-list-count').text(count);
					*/
					// tags
					/*
					this.listView.find('.timaat-categoryset-list-tags i').attr('title', this.model.tags.length+" Tags");			
					if (this.model.tags.length == 0) this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tag timaat-no-tags');
					else if (this.model.tags.length == 1) this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
					else this.listView.find('.timaat-categoryset-list-tags i').attr('class','fas fa-tags text-dark');
					*/
				}
				
				remove() {
		      console.log("TCL: CategorySet -> remove -> remove()");
					// remove annotation from UI
					this.listView.remove();
					
					// remove from categoryset list
					var index = TIMAAT.Settings.categorysets.indexOf(this);
					if (index > -1) TIMAAT.Settings.categorysets.splice(index, 1);

					// remove from model list
					index = TIMAAT.Settings.categorysets.model.indexOf(this);
					if (index > -1) TIMAAT.Settings.categorysets.model.splice(index, 1);

				}
				
			}
	
}, window));
