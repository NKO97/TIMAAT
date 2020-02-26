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
		categories: {},
		
		init: function() {
			// console.log("TCL: Settings: init: function()");
			// attach category editor
			$('#timaat-mediadatasets-medium-categories').popover({
				placement: 'right',
				title: 'Medium Categories bearbeiten',
				trigger: 'click',
				html: true,
				content: '<div class="input-group"><input class="form-control timaat-category-input" type="text" value=""></div>',
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-mediadatasets-medium-categories').on('inserted.bs.popover', function () {
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
			$('#timaat-mediadatasets-medium-categories').on('hidden.bs.popover', function () { 
			});			
			
			$('#timaat-settings-categorylibrary').click(function(ev) { TIMAAT.Settings.loadCategories(null) });

			// delete category functionality
			$('#timaat-category-delete-submit').click(function(ev) {
				var modal = $('#timaat-settings-category-delete');
				var category = modal.data('category');
				if (category) TIMAAT.Settings._categoryDeleted(category);
				modal.modal('hide');
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
		
		
		loadCategories: function(set, force) {
			var setId = 0;
			if ( set && set.model && set.model.id ) setId = set.model.id;
			
			var oldSetId = 0;
			if ( TIMAAT.Settings.categories.set ) oldSetId = TIMAAT.Settings.categories.set.model.id;
			if ( setId == oldSetId && !force ) return;
			
			if ( TIMAAT.Settings.categories.dt != null ) {
				TIMAAT.Settings.categories.dt.destroy();
				TIMAAT.Settings.categories.dt = null;
			}			
			TIMAAT.Settings.categories.set = set;

			// clear video UI list
			$('#timaat-category-list').empty();
			
			TIMAAT.Settings.categories.dt = $('#timaat-category-table').DataTable({
				ajax: {
			        url: "api/category/set/"+setId+"/contents",
			        dataSrc: '',
					beforeSend: function (xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
					},

			    },
			    rowId: 'id',
			    processing: true,
		        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Alle"]],
				"order": [[ 1, 'desc' ]],
				"pagingType": "simple_numbers",
				"columns": [
				    {
				    	data: "id",
				    	"orderable": false,
				    	render: function( data, type, row, meta ) {
				    		return '<input class="category-item" id="category-item-'+data+'" data-id="'+data+'" type="checkbox">';
				    	},
				    },
				    { data: "name" },
				    {
				    	data: "id",
				    	"orderable": false,
				    	render: function( data, type, row, meta ) {
				    		if ( type == 'display' ) {
					    		if ( TIMAAT.Settings.categories.set )
					    			return '<button type="button" data-action="remove" data-id="'+data+'" title="Aus Kategorieset entfernen" class="btn btn-outline-secondary btn-sm timaat-categoryset-collectionitemremove"><i class="fas fa-folder-minus"></i></button>';
					    		else 
					    			return '<button type="button" data-action="delete" data-id="'+data+'" title="Kategorie löschen" class="btn btn-outline-danger btn-sm timaat-category-itemremove"><i class="fas fa-trash-alt"></i></button>';
				    		} else return data;
				    	},
				    },
				  ],
				"language": {
					"processing": "Lade Daten...",
					"decimal": ",",
					"thousands": ".",
					"search": "Suche",
					"lengthMenu": "Zeige _MENU_ Kategorien pro Seite",
					"zeroRecords": "Keine Kategorien gefunden.",
					"info": "Seite _PAGE_ von _PAGES_",
					"infoEmpty": "Keine Kategorien verf&uuml;gbar.",
					"infoFiltered": "(gefiltert, _MAX_ Kategorien gesamt)",
					"paginate": {
					            "first":      "Erste",
					            "previous":   "Vorherige",
					            "next":       "N&auml;chste",
					            "last":       "Letzte"
					        },
				},
				
			})
			// events
			.on( 'draw', function () {
				$('#timaat-category-list button').off('click').click(function(ev) {
					var action = $(this).data('action');
					var id = $(this).data('id');
					var catname = TIMAAT.Settings.categories.dt.row("#"+id).data().name;
					if ( action == 'remove' ) {
						// remove category from set
						TIMAAT.Service.removeCategory(TIMAAT.Settings.categories.set, catname, function(cat) {
							console.log("removed ", cat);
							TIMAAT.Settings.categories.dt.row("#"+id).remove();
							TIMAAT.Settings.categories.dt.draw();
						})
					} else if ( action == 'delete' ) {
						// delete category from system
						TIMAAT.UI.hidePopups();				
						$('#timaat-settings-category-delete').data('category', id);
						$('#timaat-settings-category-delete').modal('show');
					}
				});
			});
			
			$('#timaat-categoryset-list li.categoryset-item').removeClass('active');
			$('#timaat-categoryset-list li.categoryset-item button').addClass('btn-outline');
			
			if ( setId ) {
				$('#timaat-settings-categorylibrary').removeClass('active');
				$('#timaat-categoryset-list li.categoryset-item-'+setId).addClass('active');
				$('#timaat-categoryset-list li.categoryset-item-'+setId+' button').removeClass('btn-outline');
			} else $('#timaat-settings-categorylibrary').addClass('active');
			
		},
		
		
		loadCategorySets: function() {
			// console.log("TCL: loadCategorySets: function()");
			// load categorysets
			TIMAAT.Service.getAllCategorySets(TIMAAT.Settings.setCategorySetLists); // TODO uncomment once working
		},
		
		setCategorySetLists: function(categorysets) {
			// console.log("TCL: categorysets", categorysets);
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
			TIMAAT.Service.deleteCategorySet(categoryset);			
			categoryset.remove();
			if ( TIMAAT.VideoPlayer.curCategorySet == categoryset ) TIMAAT.VideoPlayer.setCategorySet(null);
		},
		
		_categoryDeleted: function(category) {
			console.log("TCL: _categoryDeleted: function(category)");
			console.log("TCL: category", category);
			// sync to server
			TIMAAT.Service.deleteCategory(category);
			TIMAAT.Settings.categories.dt.row("#"+category).remove();
			TIMAAT.Settings.categories.dt.draw();
		}

		
		
	}
	
}, window));
