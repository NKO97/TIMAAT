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
	
	TIMAAT.Settings = {
		categorysets: null,
		
		init: function() {
    	// console.log("TCL: Settings: init: function()");
			// attach category editor
			$('#timaat-medium-categories').popover({
				placement: 'right',
				title: 'Medium Categories bearbeiten',
				trigger: 'click',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-category-input" type="text" value=""></div>',
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-medium-categories').on('inserted.bs.popover', function () {
				var categories = "";
				if ( TIMAAT.VideoPlayer.video == null ) {
					$('.timaat-category-input').html('Kein Video geladen');
					return;
				} else {
					$('.timaat-category-input').html('');					
				}
				TIMAAT.VideoPlayer.model.video.categories.forEach(function(item) { categories += ','+item.name });
				categories = categories.substring(1);
				$('.timaat-category-input').val(categories);
			    $('.timaat-category-input').categoriesInput({
			    	placeholder: 'Medium Category hinzufügen',
			    	onAddCategory: function(categoryinput,category) {
			    		TIMAAT.Service.addMediumCategory(TIMAAT.VideoPlayer.model.video, category, function(newcategory) {
			    			TIMAAT.VideoPlayer.model.video.categories.push(newcategory);
			    		});
			    	},
			    	onRemoveCategory: function(categoryinput,category) {
			    		TIMAAT.Service.removeMediumCategory(TIMAAT.VideoPlayer.model.video, category, function(categoryname) {
			    			// find category in model
			    			var found = -1;
			    			TIMAAT.VideoPlayer.model.video.categories.forEach(function(item, index) {
			    				if ( item.name == categoryname ) found = index;
			    			});
			    			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_category').focus();
			    	}
			    });
			});
			$('#timaat-medium-categories').on('hidden.bs.popover', function () { 
			});			

			// delete categoryset functionality
			$('#timaat-categoryset-delete-submit').click(function(ev) {
				var modal = $('#timaat-settings-categoryset-delete');
				var categoryset = modal.data('categoryset');
				if (categoryset) TIMAAT.Settings._categorysetRemoved(categoryset);
				modal.modal('hide');
			});
			
			// add/edit categoryset functionality
			$('#timaat-categoryset-add').attr('onclick','TIMAAT.Settings.addCategorySet()');
			$('#timaat-settings-categoryset-meta').on('show.bs.modal', function (ev) {
				var modal = $(this);
				var categoryset = modal.data('categoryset');				
				var heading = (categoryset) ? "CategorySet bearbeiten" : "CategorySet hinzufügen";
				var submit = (categoryset) ? "Speichern" : "Hinzufügen";
				var title = (categoryset) ? categoryset.model.name : "";				
				// setup UI from Video Player state
				$('#categorysetMetaLabel').html(heading);
				$('#timaat-categoryset-meta-submit').html(submit);
				$("#timaat-categoryset-meta-title").val(title).trigger('input');				
			});
			$('#timaat-categoryset-meta-submit').click(function(ev) {
				var modal = $('#timaat-settings-categoryset-meta');
				var categoryset = modal.data('categoryset');
				var title = $("#timaat-categoryset-meta-title").val();				
				if (categoryset) {
					categoryset.model.name = title;
					// console.log("TCL: categoryset.updateUI() - Settings init()");
					categoryset.updateUI();          
					TIMAAT.Service.updateCategorySet(categoryset);
				} else {
					TIMAAT.Service.createCategorySet(title, TIMAAT.Settings._categorysetAdded);
				}
				modal.modal('hide');
			});
			$('#timaat-categoryset-meta-title').on('input', function(ev) {
				console.log("TCL: validate categoryset input");
				console.log("TCL: $(\"#timaat-categoryset-meta-title\").val():", $("#timaat-categoryset-meta-title").val());
				if ( $("#timaat-categoryset-meta-title").val().length > 0 ) {
					$('#timaat-categoryset-meta-submit').prop("disabled", false);
					$('#timaat-categoryset-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-categoryset-meta-submit').prop("disabled", true);
					$('#timaat-categoryset-meta-submit').attr("disabled");
				}
			});
		},
		
		loadCategorySets: function() {
    // console.log("TCL: loadCategorySets: function()");
			// load categorysets
			// TIMAAT.Service.getAllCategorySets(TIMAAT.Settings.setCategorySetLists); // TODO uncomment once working
		},
		
		setCategorySetLists: function(categorysets) {
    // console.log("TCL: setCategorySetLists: function(categorysets)");
    console.log("TCL: categorysets", categorysets);
			if ( !categorysets ) return;
			$('#timaat-categoryset-list-loader').remove();

			// clear old UI list
			$('#timaat-categoryset-list').empty();

			// setup model
			var ts = Array();
			categorysets.forEach(function(categoryset) { if ( categoryset.id > 0 ) ts.push(new TIMAAT.CategorySet(categoryset)); });
			TIMAAT.Settings.categorysets = ts;
			TIMAAT.Settings.categorysets.model = categorysets;
			
		},
		
		addCategorySet: function() {	
    console.log("TCL: addCategorySet: function()");
			$('#timaat-settings-categoryset-meta').data('categoryset', null);
			$('#timaat-settings-categoryset-meta').modal('show');
		},
		
		_categorysetAdded: function(categoryset) {
    console.log("TCL: _categorysetAdded: function(categoryset)");
    console.log("TCL: categoryset", categoryset);
			TIMAAT.Settings.categorysets.model.push(categoryset);
			TIMAAT.Settings.categorysets.push(new TIMAAT.CategorySet(categoryset));
		},
		
		_categorysetRemoved: function(categoryset) {
    console.log("TCL: _categorysetRemoved: function(categoryset)");
    console.log("TCL: categoryset", categoryset);
			// sync to server
			TIMAAT.Service.removeCategorySet(categoryset);			
			categoryset.remove();
			if ( TIMAAT.VideoPlayer.curCategorySet == categoryset ) TIMAAT.VideoPlayer.setCategorySet(null);

		}
		
		
	}
	
}, window));
