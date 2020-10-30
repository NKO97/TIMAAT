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

	TIMAAT.CategoryLists = {
		categorySets: null,
    categories: null,
    listsLoaded: false,
		
		init: function() {
			TIMAAT.CategoryLists.initCategoriesAndCategorySets();
			TIMAAT.CategoryLists.initCategories();
			TIMAAT.CategoryLists.initCategorySets();
			$('.lists-datatables').hide();
			$('.categorysets-datatable').show();
    },
    
    initListsComponent: function() {
      console.log("TCL: initListsComponent");
      if (!TIMAAT.CategoryLists.listsLoaded) {
        TIMAAT.CategoryLists.setCategorySetsList();
        TIMAAT.CategoryLists.listsLoaded = true;
      }
      TIMAAT.UI.showComponent('lists');
    },

		initCategoriesAndCategorySets: function() {
      // console.log("TCL: initCategoriesAndCategorySets: function()");
			// delete button (in form) handler
      $('#timaat-categorylists-metadata-form-delete').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        var type = $('#timaat-categorylists-metadata-form').attr('data-type');
        console.log("TCL: type", type);
        $('#timaat-categorylists-'+type+'-delete').data(type, $('#timaat-categorylists-metadata-form').data(type));
        $('#timaat-categorylists-'+type+'-delete').modal('show');
			});
			
			// edit content form button handler
      $('#timaat-categorylists-metadata-form-edit').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        var type = $('#timaat-categorylists-metadata-form').attr('data-type');
        TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('edit', type, $('#timaat-categorylists-metadata-form').data(type));
			});

			// TODO combine delete submits

      // submit content form button functionality
			$('#timaat-categorylists-metadata-form-submit').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();
        
				if (!$('#timaat-categorylists-metadata-form').valid()) return false;

        var type = $('#timaat-categorylists-metadata-form').attr('data-type');
				// the original category or category set model (in case of editing an existing category or category set)
				var categoryOrCategorySet = $('#timaat-categorylists-metadata-form').data(type);				
        // console.log("TCL: categoryOrCategorySet", categoryOrCategorySet);

				// create/edit category or category set window submitted data
				var formDataRaw = $('#timaat-categorylists-metadata-form').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });

        var duplicate = await TIMAAT.CategoryService.checkForDuplicate(formDataObject.name);
        if (!duplicate || categoryOrCategorySet) {
          if (type == 'category') {
            delete formDataObject.categorySetId;
          } else if (type == 'categoryset') {
            delete formDataObject.categoryId;
          }
          // console.log("TCL: formDataObject", formDataObject);
          var formSelectData = formDataRaw;
          formSelectData.splice(0,1); // remove entries not part of multi select data
          // console.log("TCL: formSelectData", formSelectData);
          // create proper id list
          var i = 0;
          var categoryOrCategorySetIdList = [];
          for (; i < formSelectData.length; i++) {
            categoryOrCategorySetIdList.push( {id: Number(formSelectData[i].value)})
          }
          // console.log("TCL: categoryOrCategorySetIdList", categoryOrCategorySetIdList);

          if (categoryOrCategorySet) { // update category or category set
            console.log("TCL: categoryOrCategorySet", categoryOrCategorySet);
            categoryOrCategorySet.model.name = formDataObject.name;
            let categoryOrCategorySetData = categoryOrCategorySet.model;
            delete categoryOrCategorySetData.ui;
            await TIMAAT.CategoryLists.updateCategoryOrCategorySet(type, categoryOrCategorySetData, categoryOrCategorySetIdList);
            categoryOrCategorySet.updateUI();
            await TIMAAT.CategoryLists.refreshDatatable(type);
            TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('show', type, categoryOrCategorySet);
          } 
          else { // create new category or category set
            var categoryOrCategorySetModel = await TIMAAT.CategoryLists.createCategoryOrCategorySetModel(type, formDataObject);
            // console.log("TCL: categoryOrCategorySetModel", categoryOrCategorySetModel);
            var newCategoryOrCategorySet = await TIMAAT.CategoryLists.createCategoryOrCategorySet(type, categoryOrCategorySetModel, categoryOrCategorySetIdList);
            if (type == 'category') {
              categoryOrCategorySet = new TIMAAT.Category(newCategoryOrCategorySet);
            } else if (type == 'categoryset') {
              categoryOrCategorySet = new TIMAAT.CategorySet(newCategoryOrCategorySet);
            }
            await TIMAAT.CategoryLists.refreshDatatable(type);
            TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('show', type, categoryOrCategorySet);
          }
        }
        else {// duplicate category set name entered
          $('#timaat-categorylists-categoryset-duplicate').modal('show');
        }
			});
			
			// cancel add/edit button in content form functionality
			$('#timaat-categorylists-metadata-form-dismiss').on('click', function(event) {
				var type = $('#timaat-categorylists-metadata-form').attr('data-type');
				var categoryOrCategorySet = $('#timaat-categorylists-metadata-form').data(type);
				if (categoryOrCategorySet != null) {
					TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('show', type, categoryOrCategorySet);
				} else { // dismiss category or category set creation
					$('.form').hide();
				}
			});
		},

		initCategories: function() {
      // console.log("TCL: initCategories: function()");
			// nav-bar functionality
      $('#category-tab-category-metadata-form').on('click',function(event) {
        // $('.categories-data-tabs').show();
        $('.nav-tabs a[href="#categoryDatasheet"]').tab('show');
        $('.form').hide();
        $('#timaat-categorylists-metadata-form').show();
        TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('show', 'category', $('#timaat-categorylists-metadata-form').data('category'));
      });

      // confirm delete category modal functionality
      $('#timaat-categorylists-category-delete-submit').on('click', async function(ev) {
        var modal = $('#timaat-categorylists-category-delete');
        var category = modal.data('category');
        if (category) {
          try {	
            await TIMAAT.CategoryLists._categoryOrCategorySetRemoved('category', category);
          } catch(error) {
            console.log("error: ", error);
          }
          try {
            await TIMAAT.CategoryLists.refreshDatatable('categoryset');
            await TIMAAT.CategoryLists.refreshDatatable('category');
          } catch(error) {
            console.log("error: ", error);
          }
        }
        $('#timaat-categorylists-metadata-form').attr('data-type', '');
        modal.modal('hide');
        $('#timaat-categorylists-metadata-form').hide();
        // $('.categories-data-tabs').hide();
        $('.form').hide();
      });

      // add category button functionality (in category list - opens datasheet form)
			$('#timaat-categorylists-category-add').on('click', function(event) {
        console.log("TCL: add category");
        $('#timaat-categorylists-metadata-form').attr('data-type', 'category');
				$('#timaat-categorylists-metadata-form').data('category', null);
				TIMAAT.CategoryLists.addCategoryOrCategorySet('category');
      });

      // inspector event handler
      $('#timaat-annotation-category-form-submit').on('click', async function(event) {
        event.preventDefault();
        console.log("TCL: Submit Categories for analysis list");
        // var modal = $('#timaat-annotationdatasets-annotation-categories');
        if (!$('#annotationCategoriesForm').valid()) 
          return false;
        var annotation = TIMAAT.VideoPlayer.curAnnotation;
        console.log("TCL: Inspector -> constructor -> annotation", annotation);
        var formDataRaw = $('#annotationCategoriesForm').serializeArray();
        console.log("TCL: formDataRaw", formDataRaw);
        var i = 0;
        var categoryIdList = [];
        for (; i < formDataRaw.length; i++) {
          categoryIdList.push( {id: formDataRaw[i].value} );
        }
        console.log("TCL: categoryIdList", categoryIdList);
        annotation.model = await TIMAAT.CategoryLists.updateAnnotationHasCategoriesList(annotation.model, categoryIdList);
        // $('#timaat-mediadatasets-metadata-form').data('annotation', annotation);
      });

      // inspector event handler
      $('#timaat-annotation-category-form-dismiss').on('click', function(event) {
        // event.preventDefault();
        $('#annotation-categories-multi-select-dropdown').val(null).trigger('change');
        $('#annotation-categories-multi-select-dropdown').select2('destroy');
        $('#annotation-categories-multi-select-dropdown').find('option').remove();
        
        $('#annotation-categories-multi-select-dropdown').select2({
          closeOnSelect: false,
          scrollAfterSelect: true,
          allowClear: true,
          categories: true,
          tokenSeparators: [',', ' '],
          ajax: {
            url: 'api/category/selectList/',
            type: 'GET',
            dataType: 'json',
            delay: 250,
            headers: {
              "Authorization": "Bearer "+TIMAAT.Service.token,
              "Content-Type": "application/json",
            },
            // additional parameters
            data: function(params) {
              return {
                search: params.term,
                page: params.page
              };          
            },
            processResults: function(data, params) {
              params.page = params.page || 1;
              return {
                results: data
              };
            },
            cache: true
          },
          minimumInputLength: 0,
        });
        TIMAAT.AnnotationService.getCategoryList(TIMAAT.VideoPlayer.curAnnotation.id).then(function(data) {
          console.log("TCL: then: data", data);
          var categorySelect = $('#annotation-categories-multi-select-dropdown');
          if (data.length > 0) {
            data.sort((a, b) => (a.name > b.name)? 1 : -1);
            // create the options and append to Select2
            var i = 0;
            for (; i < data.length; i++) {
              var option = new Option(data[i].name, data[i].id, true, true);
              categorySelect.append(option).trigger('change');
            }
            // manually trigger the 'select2:select' event
            categorySelect.trigger({
              type: 'select2:select',
              params: {
                data: data
              }
            });
          }
        });
      });

			// // console.log("TCL: CategoryLists: init: function()");
			// $('#timaat-categorylists-categorylibrary').on('click', function(ev) { TIMAAT.CategoryLists.loadCategories(null) });

			// // attach category editor
			// $('#timaat-mediadatasets-medium-categories').popover({
			// 	placement: 'right',
			// 	title: 'Medium Categories bearbeiten',
			// 	trigger: 'click',
			// 	html: true,
			// 	content: '<div class="input-group"><input class="form-control timaat-category-input" type="text" value=""></div>',
			// 	container: 'body',
			// 	boundary: 'viewport',				
			// });

			// $('#timaat-mediadatasets-medium-categories').on('inserted.bs.popover', function () {
			// 	var categories = "";
			// 	if ( TIMAAT.VideoPlayer.video == null ) {
			// 		$('.timaat-category-input').html('Kein Video geladen');
			// 		return;
			// 	} else {
			// 		$('.timaat-category-input').html('');					
			// 	}
			// 	TIMAAT.VideoPlayer.model.video.categories.forEach(function(item) { categories += ','+item.name });
			// 	categories = categories.substring(1);
			// 	$('.timaat-category-input').val(categories);
			//     $('.timaat-category-input').categoriesInput({
			//     	placeholder: 'Medium Category hinzufügen',
			//     	onAddCategory: function(categoryinput,category) {
			//     		TIMAAT.CategoryService.addMediumCategory(TIMAAT.VideoPlayer.model.video, category, function(newcategory) {
			//     			TIMAAT.VideoPlayer.model.video.categories.push(newcategory);
			//     		});
			//     	},
			//     	onRemoveCategory: function(categoryinput,category) {
			//     		TIMAAT.CategoryService.removeMediumCategory(TIMAAT.VideoPlayer.model.video, category, function(categoryname) {
			//     			// find category in model
			//     			var found = -1;
			//     			TIMAAT.VideoPlayer.model.video.categories.forEach(function(item, index) {
			//     				if ( item.name == categoryname ) found = index;
			//     			});
			//     			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			//     		});
			//     	},
			//     	onChange: function() {
			//     		if ( this.length == 1) $('#'+this[0].id+'_category').focus();
			//     	}
			//     });
			// });

			// $('#timaat-mediadatasets-medium-categories').on('hidden.bs.popover', function () { 
			// });			
			
			// // delete category functionality
			// $('#timaat-category-delete-submit').on('click', function(ev) {
			// 	var modal = $('#timaat-categorylists-category-delete');
			// 	var category = modal.data('category');
			// 	if (category) TIMAAT.CategoryLists._categoryDeleted(category);
			// 	modal.modal('hide');
			// });

		},

		initCategorySets: function() {
			// nav-bar functionality
      $('#category-tab-categoryset-metadata-form').on('click',function(event) {
        // $('.categorysets-data-tabs').show();
        $('.form').hide();
        $('.nav-tabs a[href="#categorySetDatasheet"]').tab('show');
        TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('show', 'categoryset', $('#timaat-categorylists-metadata-form').data('categoryset'));
      });

      // confirm delete category set modal functionality
      $('#timaat-categorylists-categoryset-delete-submit').on('click', async function(ev) {
        var modal = $('#timaat-categorylists-categoryset-delete');
        var categorySet = modal.data('categoryset');
        if (categorySet) {
          try {	
            await TIMAAT.CategoryLists._categoryOrCategorySetRemoved('categoryset', categorySet);
          } catch(error) {
            console.log("error: ", error);
          }
          try {
            await TIMAAT.CategoryLists.refreshDatatable('categoryset');
            await TIMAAT.CategoryLists.refreshDatatable('category');
          } catch(error) {
            console.log("error: ", error);
          }
        }
        $('#timaat-categorylists-metadata-form').attr('data-type', '');
        modal.modal('hide');
        $('#timaat-categorylists-metadata-form').hide();
        // $('.categorysets-data-tabs').hide();
        $('.form').hide();
      });

      // add category set button functionality (in category set list - opens datasheet form)
			$('#timaat-categorylists-categoryset-add').on('click',function(event) {
        console.log("TCL: add categoryset");
        $('#timaat-categorylists-metadata-form').attr('data-type', 'categoryset');
				$('#timaat-categorylists-metadata-form').data('categoryset', null);
				TIMAAT.CategoryLists.addCategoryOrCategorySet('categoryset');
      });

      // inspector event handler
      $('#timaat-mediumAnalysisList-categorySet-form-submit').on('click', async function(event) {
        event.preventDefault();
        console.log("TCL: Submit category sets for analysis list");
        if (!$('#mediumAnalysisListCategorySetsForm').valid()) 
          return false;
        var mediumAnalysisList = TIMAAT.VideoPlayer.curList;
        console.log("TCL: Inspector -> constructor -> mediumAnalysisList", mediumAnalysisList);
        var formDataRaw = $('#mediumAnalysisListCategorySetsForm').serializeArray();
        console.log("TCL: formDataRaw", formDataRaw);
        var i = 0;
        var categorySetIdList = [];

        for (; i < formDataRaw.length; i++) {
            categorySetIdList.push( {id: Number(formDataRaw[i].value)} );
        }
        console.log("TCL: categorySetIdList", categorySetIdList);
        // TODO check if any annotation is using categories from category sets that will be removed with this operation
        var annosUseCategorySet = false;
        var annoInBothLists = false;
        if (categorySetIdList.length < mediumAnalysisList.categorySets.length) {
          annosUseCategorySet = true;
          console.log("TCL: list contains less sets than before.");
        } else {
          i = 0;
          var j = 0;
          for (; i < mediumAnalysisList.categorySets.length; i++) {
            annoInBothLists = false;
            for (; j < categorySetIdList.length; j++) {
              if (mediumAnalysisList.categorySets[i].id == categorySetIdList[j].id) {
                annoInBothLists = true;
                console.log("TCL: match found!");
                break;
              }
            }
            if (!annoInBothLists) {
              console.log("TCL mediumAnalysisList.categorySets[i].id not available anymore", mediumAnalysisList.categorySets[i].id);
              annosUseCategorySet = true;
              break;
            }
          }
        }
        if (annosUseCategorySet) {
          $('#timaat-mediumAnalysisList-categorySet-in-use').data('mediumAnalysisList', mediumAnalysisList);
          $('#timaat-mediumAnalysisList-categorySet-in-use').data('categorySetIdList', categorySetIdList);
          $('#timaat-mediumAnalysisList-categorySet-in-use').modal('show');
        } else 
        mediumAnalysisList = await TIMAAT.CategoryLists.updateMediumAnalysisListHasCategorySetsList(mediumAnalysisList, categorySetIdList);
      });

      $('#timaat-mediumAnalysisList-categorySet-in-use-confirm').on('click', async function(event) {
        var modal = $('#timaat-mediumAnalysisList-categorySet-in-use');
        var mediumAnalysisList = modal.data('mediumAnalysisList');
        var categorySetIdList = modal.data('categorySetIdList');
        await TIMAAT.CategoryLists.updateMediumAnalysisListHasCategorySetsList(mediumAnalysisList, categorySetIdList);
        modal.modal('hide');
      });

      // inspector event handler
      $('#timaat-mediumAnalysisList-categorySet-form-dismiss').on('click', function(event) {
        // event.preventDefault();
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').val(null).trigger('change');
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').select2('destroy');
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').find('option').remove();
        
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').select2({
          closeOnSelect: false,
          scrollAfterSelect: true,
          allowClear: true,
          ajax: {
            url: 'api/category/set/selectList/',
            type: 'GET',
            dataType: 'json',
            delay: 250,
            headers: {
              "Authorization": "Bearer "+TIMAAT.Service.token,
              "Content-Type": "application/json",
            },
            // additional parameters
            data: function(params) {
              return {
                search: params.term,
                page: params.page
              };          
            },
            processResults: function(data, params) {
              params.page = params.page || 1;
              return {
                results: data
              };
            },
            cache: true
          },
          minimumInputLength: 0,
        });
        TIMAAT.AnalysisListService.getCategorySetList(TIMAAT.VideoPlayer.curList.id).then(function(data) {
          console.log("TCL: then: data", data);
          var categorySetSelect = $('#mediumAnalysisList-categorySets-multi-select-dropdown');
          if (data.length > 0) {
            data.sort((a, b) => (a.name > b.name)? 1 : -1);
            // create the options and append to Select2
            var i = 0;
            for (; i < data.length; i++) {
              var option = new Option(data[i].name, data[i].id, true, true);
              categorySetSelect.append(option).trigger('change');
            }
            // manually trigger the 'select2:select' event
            categorySetSelect.trigger({
              type: 'select2:select',
              params: {
                data: data
              }
            });
          }
        });
      });

      
			// // delete categoryset functionality
			// $('#timaat-categoryset-delete-submit').on('click', function(ev) {
			// 	var modal = $('#timaat-categorylists-categoryset-delete');
			// 	var categorySet = modal.data('categoryset');
			// 	if (categorySet) TIMAAT.CategoryLists._categorySetRemoved(categorySet);
			// 	modal.modal('hide');
			// });
			
			// // add/edit categoryset functionality
			// $('#timaat-categoryset-add').attr('onclick','TIMAAT.CategoryLists.addCategorySet()');

			// $('#timaat-categorylists-categoryset-meta').on('show.bs.modal', function (ev) {
			// 	var modal = $(this);
			// 	var categorySet = modal.data('categoryset');				
			// 	var heading = (categorySet) ? "CategorySet bearbeiten" : "CategorySet hinzufügen";
			// 	var submit = (categorySet) ? "Speichern" : "Hinzufügen";
			// 	var title = (categorySet) ? categorySet.model.name : "";				
			// 	// setup UI from Video Player state
			// 	$('#categorySetMetaLabel').html(heading);
			// 	$('#timaat-categoryset-meta-submit').html(submit);
			// 	$("#timaat-categoryset-meta-title").val(title).trigger('input');				
			// });

			// $('#timaat-categoryset-meta-submit').on('click', function(ev) {
			// 	var modal = $('#timaat-categorylists-categoryset-meta');
			// 	var categorySet = modal.data('categoryset');
			// 	var title = $("#timaat-categoryset-meta-title").val();				
			// 	if (categorySet) {
			// 		categorySet.model.name = title;
			// 		// console.log("TCL: categorySet.updateUI() - CategoryLists init()");
			// 		categorySet.updateUI();          
			// 		TIMAAT.CategoryService.updateCategorySet(categorySet);
			// 	} else {
			// 		TIMAAT.CategoryService.createCategorySet(title, TIMAAT.CategoryLists._categorySetAdded);
			// 	}
			// 	modal.modal('hide');
			// });

			// $('#timaat-categoryset-meta-title').on('input', function(ev) {
			// 	console.log("TCL: validate categoryset input");
			// 	console.log("TCL: $(\"#timaat-categoryset-meta-title\").val():", $("#timaat-categoryset-meta-title").val());
			// 	if ( $("#timaat-categoryset-meta-title").val().length > 0 ) {
			// 		$('#timaat-categoryset-meta-submit').prop('disabled', false);
			// 		$('#timaat-categoryset-meta-submit').removeAttr('disabled');
			// 	} else {
			// 		$('#timaat-categoryset-meta-submit').prop('disabled', true);
			// 		$('#timaat-categoryset-meta-submit').attr('disabled');
			// 	}
			// });			
		},

		load: function() {
      // console.log("TCL: load: function()");
			TIMAAT.CategoryLists.loadCategories();
			TIMAAT.CategoryLists.loadCategorySets();
		},
		
		loadCategories: function() {
			$('.lists-datatables').hide();
			$('.categories-datatable').show();
			TIMAAT.CategoryLists.setCategoriesList();

		// loadCategories: function(set, force) {
		// 	$('.lists-cards').hide();
		// 	$('.categories-card').show();
		// 	TIMAAT.CategoryLists.setCategoriesList();

			// var setId = 0;
			// if ( set && set.model && set.model.id ) setId = set.model.id;
			
			// var oldSetId = 0;
			// if ( TIMAAT.CategoryLists.categories.set ) oldSetId = TIMAAT.CategoryLists.categories.set.model.id;
			// if ( setId == oldSetId && !force ) return;
			
			// if ( TIMAAT.CategoryLists.categories.dt != null ) {
			// 	TIMAAT.CategoryLists.categories.dt.destroy();
			// 	TIMAAT.CategoryLists.categories.dt = null;
			// }			
			// TIMAAT.CategoryLists.categories.set = set;

			// // clear video UI list
			// $('#timaat-category-list').empty();
			
			// TIMAAT.CategoryLists.categories.dt = $('#timaat-category-table').DataTable({
			// 	ajax: {
			//         url: "api/category/set/"+setId+"/contents",
			//         dataSrc: '',
			// 		beforeSend: function (xhr) {
			// 			xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
			// 		},

			//     },
			//     rowId: 'id',
			//     processing: true,
		  //       "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
			// 	"order": [[ 1, 'desc' ]],
			// 	"pagingType": "simple_numbers",
			// 	"columns": [
			// 	    {
			// 	    	data: "id",
			// 	    	"orderable": false,
			// 	    	render: function( data, type, row, meta ) {
			// 	    		return '<input class="category-item" id="category-item-'+data+'" data-id="'+data+'" type="checkbox">';
			// 	    	},
			// 	    },
			// 	    { data: "name" },
			// 	    {
			// 	    	data: "id",
			// 	    	"orderable": false,
			// 	    	render: function( data, type, row, meta ) {
			// 	    		if ( type == 'display' ) {
			// 		    		if ( TIMAAT.CategoryLists.categories.set )
			// 		    			return '<button type="button" data-action="remove" data-id="'+data+'" title="Aus Kategorieset entfernen" class="btn btn-outline-secondary btn-sm timaat-categoryset-collectionitemremove"><i class="fas fa-folder-minus"></i></button>';
			// 		    		else 
			// 		    			return '<button type="button" data-action="delete" data-id="'+data+'" title="Kategorie löschen" class="btn btn-outline-danger btn-sm timaat-category-itemremove"><i class="fas fa-trash-alt"></i></button>';
			// 	    		} else return data;
			// 	    	},
			// 	    },
			// 	  ],
			// 	"language": {
			// 		"processing": "Lade Daten...",
			// 		"decimal": ",",
			// 		"thousands": ".",
			// 		"search": "Suche",
			// 		"lengthMenu": "Zeige _MENU_ Kategorien pro Seite",
			// 		"zeroRecords": "Keine Kategorien gefunden.",
			// 		"info": "Seite _PAGE_ von _PAGES_",
			// 		"infoEmpty": "Keine Kategorien verf&uuml;gbar.",
			// 		"infoFiltered": "(gefiltert, _MAX_ Kategorien gesamt)",
			// 		"paginate": {
			// 		            "first":      "Erste",
			// 		            "previous":   "Vorherige",
			// 		            "next":       "N&auml;chste",
			// 		            "last":       "Letzte"
			// 		        },
			// 	},
				
			// })
			// // events
			// .on( 'draw', function () {
			// 	$('#timaat-category-list button').off('click').on('click', function(ev) {
			// 		var action = $(this).data('action');
			// 		var id = $(this).data('id');
			// 		var catname = TIMAAT.CategoryLists.categories.dt.row("#"+id).data().name;
			// 		if ( action == 'remove' ) {
			// 			// remove category from set
			// 			TIMAAT.CategoryService.removeCategory(TIMAAT.CategoryLists.categories.set, catname, function(cat) {
			// 				console.log("removed ", cat);
			// 				TIMAAT.CategoryLists.categories.dt.row("#"+id).remove();
			// 				TIMAAT.CategoryLists.categories.dt.draw();
			// 			})
			// 		} else if ( action == 'delete' ) {
			// 			// delete category from system
			// 			TIMAAT.UI.hidePopups();				
			// 			$('#timaat-categorylists-category-delete').data('category', id);
			// 			$('#timaat-categorylists-category-delete').modal('show');
			// 		}
			// 	});
			// });
			
			// $('#timaat-categoryset-list li.categoryset-item').removeClass('active');
			// $('#timaat-categoryset-list li.categoryset-item button').addClass('btn-outline');
			
			// if ( setId ) {
			// 	$('#timaat-categorylists-categorylibrary').removeClass('active');
			// 	$('#timaat-categoryset-list li.categoryset-item-'+setId).addClass('active');
			// 	$('#timaat-categoryset-list li.categoryset-item-'+setId+' button').removeClass('btn-outline');
			// } else $('#timaat-categorylists-categorylibrary').addClass('active');
			
		},
		
		loadCategorySets: function() {
			// console.log("TCL: loadCategorySets: function()");
			$('.lists-datatables').hide();
			$('.categorysets-datatable').show();
			TIMAAT.CategoryLists.setCategorySetsList();
      $('#timaat-categorylists-metadata-form').data('data-type', 'categorySet');
			// load categorysets
			// TIMAAT.CategoryService.getAllCategorySets(TIMAAT.CategoryLists.setCategorySetsLists); // TODO uncomment once working
		},

		loadCategoriesDataTables: function() {
			// console.log("TCL: loadCategoriesDataTables: function()");
      TIMAAT.CategoryLists.setupCategoryDatatable();
      TIMAAT.CategoryLists.setupCategorySetDatatable();
		},

		setCategoriesList: function() {
      // console.log("TCL: setCategoriesList: function()");
			$('.form').hide();
      $('.categories-data-tabs').hide();
      if ( TIMAAT.CategoryLists.categories == null) return;
      console.log("TCL: TIMAAT.CategoryLists.categories", TIMAAT.CategoryLists.categories);

			$('#timaat-categorylists-category-list-loader').remove();
			// clear old UI list
			$('#timaat-categorylists-category-list').empty();

			// set ajax data source
			if ( TIMAAT.CategoryLists.dataTableCategories ) {
				TIMAAT.CategoryLists.dataTableCategories.ajax.reload(null, false);
			}
		},
		
		setCategorySetsList: function() {
      // console.log("TCL: setCategorySetList");
			$('.form').hide();
			$('.categorysets-data-tabs').hide();
			if ( TIMAAT.CategoryLists.categorySets == null ) return;
      console.log("TCL: TIMAAT.CategoryLists.categorySets", TIMAAT.CategoryLists.categorySets);

			$('#timaat-categorylists-categoryset-list-loader').remove();
			// clear old UI list
			$('#timaat-categorylists-categoryset-list').empty();

			// // setup model
			// var ts = Array();
			// categorySets.forEach(function(categorySet) { if ( categorySet.id > 0 ) ts.push(new TIMAAT.CategorySet(categorySet)); });
			// TIMAAT.CategoryLists.categorySets = ts;
			// TIMAAT.CategoryLists.categorySets.model = categorySets;

			// set ajax data source
			if ( TIMAAT.CategoryLists.dataTableCategorySets ) {
				TIMAAT.CategoryLists.dataTableCategorySets.ajax.reload(null, false);
			}
		},

		setupCategoryDatatable: function() {			
      // console.log("TCL: setupCategoryDatatable");
      // setup datatable
      TIMAAT.CategoryLists.dataTableCategories = $('#timaat-categorylists-category-table').DataTable({
        "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
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
          "url"        : "api/category/list",
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
            var categs = Array();
            data.data.forEach(function(category) { 
              if ( category.id > 0 ) {
                categs.push(new TIMAAT.Category(category));
              }
            });
            TIMAAT.CategoryLists.categories = categs;
            TIMAAT.CategoryLists.categories.model = data.data;
            return data.data;
          }
        },
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: data", data);
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let categoryElement = $(row);
          let category = data;
          category.ui = categoryElement;
          categoryElement.data('category', category);

          categoryElement.on('click', '.name', function(event) {
            event.stopPropagation();
            // show tag editor - trigger popup
            TIMAAT.UI.hidePopups();
            TIMAAT.UI.showComponent('lists');
            $('.form').hide();
            $('.categories-nav-tabs').show();
            $('.categories-data-tabs').hide();
            $('.nav-tabs a[href="#categoryDatasheet"]').tab('show');
            var id = category.id;
            var selectedCategory;
            var i = 0;
            for (; i < TIMAAT.CategoryLists.categories.length; i++) {
              if (TIMAAT.CategoryLists.categories[i].model.id == id) {
                selectedCategory = TIMAAT.CategoryLists.categories[i];
                break;
              }
            }
            $('#timaat-categorylists-category-metadata-form').data('category', selectedCategory);
            TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('show', 'category', selectedCategory);
          });
        },
        "columns": [
          { data: 'id', name: 'name', className: 'name', render: function(data, type, category, meta) {
            let nameDisplay = `<p>`+ category.name +`</p>`;
            return nameDisplay;
            }
          },			
        ],
        "language": {
          "decimal"     : ",",
          "thousands"   : ".",
          "search"      : "Search",
          "lengthMenu"  : "Show _MENU_ entries",
          "zeroRecords" : "No categories found.",
          "info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ categories total)",
          "infoEmpty"   : "No categories available.",
          "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ category(s))",
          "paginate"    : {
            "first"   : "<<",
            "previous": "<",
            "next"    : ">",
            "last"    : ">>"
          },
        },				
      });				
    },

    setupCategorySetDatatable: function() {			
      // console.log("TCL: setupCategorySetDatatable");
      // setup datatable
      TIMAAT.CategoryLists.dataTableCategorySets = $('#timaat-categorylists-categoryset-table').DataTable({
        "lengthMenu"    : [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
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
          "url"        : "api/category/set/list",
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
          	// console.log("TCL: data", data);
            // setup model
            var catsets = Array();
            data.data.forEach(function(categorySet) { 
              if ( categorySet.id > 0 ) {
                catsets.push(new TIMAAT.CategorySet(categorySet));
              }
            });
            TIMAAT.CategoryLists.categorySets = catsets;
            TIMAAT.CategoryLists.categorySets.model = data.data;
            return data.data;
          }
        },
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let categorySetElement = $(row);
          let categorySet = data;
          categorySet.ui = categorySetElement;
          categorySetElement.data('categoryset', categorySet);

          categorySetElement.on('click', '.name', function(event) {
            event.stopPropagation();
            // show tag editor - trigger popup
            TIMAAT.UI.hidePopups();
            TIMAAT.UI.showComponent('lists');
            $('.form').hide();
            $('.categorysets-nav-tabs').show();
            $('.categorysets-data-tabs').hide();
            $('.nav-tabs a[href="#categorySetDatasheet"]').tab('show');
            var selectedCategorySet;
            var i = 0;
            for (; i < TIMAAT.CategoryLists.categorySets.length; i++) {
              if (TIMAAT.CategoryLists.categorySets[i].model.id == categorySet.id) {
                selectedCategorySet = TIMAAT.CategoryLists.categorySets[i];
                break;
              }
            }
            $('#timaat-categorylists-metadata-form').data('categoryset', selectedCategorySet);
            TIMAAT.CategoryLists.categoryOrCategorySetFormDatasheet('show', 'categoryset', selectedCategorySet);
          });
        },
        "columns": [
          { data: 'id', name: 'name', className: 'name', render: function(data, type, categorySet, meta) {
            let nameDisplay = `<p>`+ categorySet.name +`</p>`;
            return nameDisplay;
            }
          },			
        ],
        "language": {
          "decimal"     : ",",
          "thousands"   : ".",
          "search"      : "Search",
          "lengthMenu"  : "Show _MENU_ entries",
          "zeroRecords" : "No category sets found.",
          "info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ category sets total)",
          "infoEmpty"   : "No category sets available.",
          "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ category set(s))",
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
      // console.log("TCL: refreshDatatable - type: ", type);
      // set ajax data source
      switch(type) {
        case 'category':
          if (TIMAAT.CategoryLists.dataTableCategories) {
            TIMAAT.CategoryLists.dataTableCategories.ajax.reload(null, false);
          }
        break;
        case 'categoryset':
          if (TIMAAT.CategoryLists.dataTableCategorySets) {
            TIMAAT.CategoryLists.dataTableCategorySets.ajax.reload(null, false);
          }
        break;
      }			
    },

		addCategoryOrCategorySet: function(type) {	
			// console.log("TCL: addCategoryOrCategorySet: function()");
			console.log("TCL: addCategoryOrCategorySet: type", type);
			$('.form').hide();
			$('#timaat-categorylists-metadata-form').data(type, null);
      categoryOrCategorySetFormMetadataValidator.resetForm();
      
      // setup form
			$('#timaat-categorylists-metadata-form').trigger('reset');
			$('#timaat-categorylists-metadata-form').show();
			$('.datasheet-data').hide();
      $('.name-data').show();
      
      $('#timaat-categorylists-metadata-form-edit').hide();
      $('#timaat-categorylists-metadata-form-delete').hide();
      $('#timaat-categorylists-metadata-form-submit').html("Add");
      $('#timaat-categorylists-metadata-form-submit').show();
      $('#timaat-categorylists-metadata-form-dismiss').show();
			$('#timaat-categorylists-metadata-form :input').prop('disabled', false);
      $('#categoryOrCategorySetFormHeader').html("Add "+type);
      
      $('#timaat-categorylists-metadata-name').focus();
		},
		
		categoryOrCategorySetFormDatasheet: async function(action, type, data) {
      console.log("TCL: action, type, data: ", action, type, data);
      var node = document.getElementById("dynamic-category-ispartof-categoryset-fields");
      while (node.lastChild) {
        node.removeChild(node.lastChild)
      }
      node = document.getElementById("dynamic-categoryset-contains-category-fields");
			while (node.lastChild) {
				node.removeChild(node.lastChild)
      }
      $('#timaat-categorylists-metadata-form').trigger('reset');
      $('#timaat-categorylists-metadata-form').attr('data-type', type);
      $('.datasheet-data').hide();
      $('.name-data').show();
      $('.'+type+'-data').show();
      categoryOrCategorySetFormMetadataValidator.resetForm();

      $('#timaat-categorylists-metadata-form').show();

      switch (type) {
        case 'category':
          $('#dynamic-category-ispartof-categoryset-fields').append(TIMAAT.CategoryLists.appendCategoryIsPartOfCategorySetsDataset());
          $('#categorysets-multi-select-dropdown').select2({
            closeOnSelect: false,
            scrollAfterSelect: true,
            allowClear: true,
            ajax: {
              url: 'api/category/set/selectList',
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
              cache: true
            },
            minimumInputLength: 0,
          });
          var categorySetSelect = $('#categorysets-multi-select-dropdown');
          // console.log("TCL: categorySetSelect", categorySetSelect);
          await TIMAAT.CategoryService.getCategoryOrCategorySetList(type, data.model.id).then(function (data) {
            console.log("TCL: then: data", data);
            if (data.length > 0) {
              data.sort((a, b) => (a.name > b.name)? 1 : -1);
              // create the options and append to Select2
              var i = 0;
              for (; i < data.length; i++) {
                var option = new Option(data[i].name, data[i].id, true, true);
                categorySetSelect.append(option).trigger('change');
              }
              // manually trigger the 'select2:select' event
              categorySetSelect.trigger({
                type: 'select2:select',
                params: {
                  data: data
                }
              });
            }
          });
        break;
        case 'categoryset':
          $('#dynamic-categoryset-contains-category-fields').append(TIMAAT.CategoryLists.appendCategorySetContainsCategoriesDataset());
          $('#categories-multi-select-dropdown').select2({
            closeOnSelect: false,
            scrollAfterSelect: true,
            allowClear: true,
            ajax: {
              url: 'api/category/selectList',
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
              cache: true
            },
            minimumInputLength: 0,
          });          
          var categorySelect = $('#categories-multi-select-dropdown');
          // console.log("TCL: categorySelect", categorySelect);
          await TIMAAT.CategoryService.getCategoryOrCategorySetList(type, data.model.id).then(function (data) {
            console.log("TCL: then: data", data);
            if (data.length > 0) {
              data.sort((a, b) => (a.name > b.name)? 1 : -1);
              // create the options and append to Select2
              var i = 0;
              for (; i < data.length; i++) {
                var option = new Option(data[i].name, data[i].id, true, true);
                categorySelect.append(option).trigger('change');
              }
              // manually trigger the 'select2:select' event
              categorySelect.trigger({
                type: 'select2:select',
                params: {
                  data: data
                }
              });
            }
          });
        break;
      }

      if ( action == 'show') {
        $('#timaat-categorylists-metadata-form :input').prop('disabled', true);
        $('#timaat-categorylists-metadata-form-edit').prop('disabled', false);
        $('#timaat-categorylists-metadata-form-edit :input').prop('disabled', false);
        $('#timaat-categorylists-metadata-form-edit').show();
        $('#timaat-categorylists-metadata-form-delete').prop('disabled', false);
        $('#timaat-categorylists-metadata-form-delete :input').prop('disabled', false);
        $('#timaat-categorylists-metadata-form-delete').show();
        $('#timaat-categorylists-metadata-form-submit').hide();
        $('#timaat-categorylists-metadata-form-dismiss').hide();
        $('#categoryOrCategorySetFormHeader').html(type+" Datasheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        $('#timaat-categorylists-metadata-form :input').prop('disabled', false);
        $('#timaat-categorylists-metadata-form-edit').hide();
        $('#timaat-categorylists-metadata-form-edit').prop('disabled', true);
        $('#timaat-categorylists-metadata-form-edit :input').prop('disabled', true);
        $('#timaat-categorylists-metadata-form-delete').hide();
        $('#timaat-categorylists-metadata-form-delete').prop('disabled', true);
        $('#timaat-categorylists-metadata-form-delete :input').prop('disabled', true);
        $('#timaat-categorylists-metadata-form-submit').html("Save");
        $('#timaat-categorylists-metadata-form-submit').show();
        $('#timaat-categorylists-metadata-form-dismiss').show();
        $('#categoryOrCategorySetFormHeader').html("Edit "+type);
        $('#timaat-categorylists-metadata-name').focus();
      }
      // name data
      switch(type) {
        case 'category':
          $('#timaat-categorylists-metadata-name').val(data.model.name);
        break;
        case 'categoryset':
          $('#timaat-categorylists-metadata-name').val(data.model.name);
        break
      }

      $('#timaat-categorylists-metadata-form').data(type, data);
    },

    createCategoryOrCategorySetModel: async function(type, formDataObject) {
      // console.log("TCL: type, formDataObject", type, formDataObject);
      switch(type) {
        case 'category':
          var model = {
            id: 0,
            name: formDataObject.name
          };
        break;
        case 'categoryset':
          var model = {
            id: 0,
            name: formDataObject.name,
            // categorySetHasCategories: [{}]
          };
        break;
      }
      return model;
    },
  
    createCategoryOrCategorySet: async function(type, model, categoryOrCategorySetIdList) {
      console.log("TCL: createCategoryOrCategorySet: type, model, categoryOrCategorySetIdList: ", type, model, categoryOrCategorySetIdList);
      try {				
        // create category or category set
        var newModel = await TIMAAT.CategoryService.createCategoryOrCategorySet(type, model);
        console.log("TCL: newModel", newModel);
        model.id = newModel.id;

        // if (categoryOrCategorySetIdList != null) {
        //   await TIMAAT.CategoryLists.updateCategoryOrCategorySet(type, model, categoryOrCategorySetIdList); // TODO may have to be adjusted once list can be created upon category/categoryset creation
        // }				
      } catch(error) {
        console.log( "error: ", error);
      };
      console.log("TCL: model", model);
      return (model);
    },

    // TODO update categorySetHasCategories
    updateCategoryOrCategorySet: async function(type, categoryOrCategorySet, categoryOrCategorySetIdList) {
      console.log("TCL: updateCategoryOrCategorySet: async function -> beginning of update: type, categoryOrCategorySet, categoryOrCategorySetIdList ", type, categoryOrCategorySet, categoryOrCategorySetIdList);

      try { // update translation
        switch (type) {
          case 'category':
            var tempModel = await TIMAAT.CategoryService.updateCategory(categoryOrCategorySet);
          break;
          case 'categoryset':
            var tempModel = await TIMAAT.CategoryService.updateCategorySet(categoryOrCategorySet);
            console.log("TCL: tempModel", tempModel);
          break;
        }
        categoryOrCategorySet = tempModel;
      } catch(error) {
        console.log( "error: ", error);
      };

      try { // update category_set_has_category table entries via category or category set
        var existingCategorySetOrCategoryEntries = await TIMAAT.CategoryService.getCategoryOrCategorySetList(type, categoryOrCategorySet.id);
        console.log("TCL: existingCategorySetOrCategoryEntries", existingCategorySetOrCategoryEntries);
        console.log("TCL: categoryOrCategorySetIdList", categoryOrCategorySetIdList);
        if (categoryOrCategorySetIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all existingCategorySetOrCategoryEntries: ", existingCategorySetOrCategoryEntries);
          switch (type) {
            case 'category': //* find all categorySets this category is connected to and delete the connection
              var i = 0;
              for (; i < existingCategorySetOrCategoryEntries.length; i++) {
                // var index = existingCategorySetOrCategoryEntries.findIndex( ({categorySet}) => categorySet.model.categorySetHasCategories.id.categoryId === categoryOrCategorySet.id)
                // existingCategorySetOrCategoryEntries[i].model.categorySetHasCategories.splice(index,1);
                await TIMAAT.CategoryService.deleteCategorySetHasCategory(existingCategorySetOrCategoryEntries[i].id, categoryOrCategorySet.id);
              }
            break;
            case 'categoryset': //* remove all category connections from this categorySet
              categoryOrCategorySet.categorySetHasCategories = [];
              var i = 0;
              for (; i < existingCategorySetOrCategoryEntries.length; i++) {
                await TIMAAT.CategoryService.deleteCategorySetHasCategory(categoryOrCategorySet.id, existingCategorySetOrCategoryEntries[i].id);
              }
            break;
          }          
        } else if (existingCategorySetOrCategoryEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all categoryOrCategorySetIdList: ", categoryOrCategorySetIdList);
          switch (type) {
            case 'category': //* find all categorySets this category shall be connected to and add the connection
              var i = 0;
              for (; i < categoryOrCategorySetIdList.length; i++) {
                // console.log("TCL: categoryOrCategorySetIdList[i].id", categoryOrCategorySetIdList[i].id);
                // var categorySet = await TIMAAT.CategoryService.getCategorySet(categoryOrCategorySetIdList[i].id);
                var newCategorySetHasCategory = {
                  categorySetHasCategories: [],
                  categorySetHasCategory: null,
                  id: {
                    categorySetId: categoryOrCategorySetIdList[i].id,
                    categoryId: categoryOrCategorySet.id
                  }
                };
                console.log("TCL: newCategorySetHasCategory", newCategorySetHasCategory);
                // categorySet.categorySetHasCategories.push(newCategorySetHasCategory);
                await TIMAAT.CategoryService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
              }
            break;
            case 'categoryset': //* add all category connections to this categorySet
              var i = 0;
              for (; i < categoryOrCategorySetIdList.length; i++) {
                categoryOrCategorySet.categorySetHasCategories.push({id: {categorySetId: categoryOrCategorySet.id, categoryId: categoryOrCategorySetIdList[i]}});
                var newCategorySetHasCategory = {
                  categorySetHasCategories: [],
                  categorySetHasCategory: null,
                  id: {
                    categorySetId: categoryOrCategorySet.id,
                    categoryId: categoryOrCategorySetIdList[i].id
                  }
                };
                await TIMAAT.CategoryService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
              }
            break;
          }
          
        } else { //* add/remove entries
          // DELETE removed entries
          var categorySetOrCategoryEntriesToDelete = [];
          var i = 0;
          for (; i < existingCategorySetOrCategoryEntries.length; i++) {
            var deleteId = true;
            var j = 0;
            for (; j < categoryOrCategorySetIdList.length; j++) {
              if( existingCategorySetOrCategoryEntries[i].id == categoryOrCategorySetIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingCategorySetOrCategoryEntries but not in categoryOrCategorySetIdList
              // console.log("TCL: delete entry: ", existingCategorySetOrCategoryEntries[i]);
              categorySetOrCategoryEntriesToDelete.push(existingCategorySetOrCategoryEntries[i]);
              existingCategorySetOrCategoryEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: categorySetOrCategoryEntriesToDelete", categorySetOrCategoryEntriesToDelete);
          if (categorySetOrCategoryEntriesToDelete.length > 0) { // anything to delete?
            switch (type) {
              case 'category': //* find the corresponding categorySet and delete the connection with this category
                var i = 0;
                for (; i < categorySetOrCategoryEntriesToDelete.length; i++) {
                  // console.log("TCL: categorySetOrCategoryEntriesToDelete[i].id", categorySetOrCategoryEntriesToDelete[i].id);
                  // var categorySet = await TIMAAT.CategoryService.getCategorySet(categorySetOrCategoryEntriesToDelete[i].id);
                  // var index = categorySet.categorySetHasCategories.findIndex(({id}) => id === categoryOrCategorySet.id);
                  // categorySet.categorySetHasCategories.id.splice(index,1);
                  await TIMAAT.CategoryService.deleteCategorySetHasCategory(categorySetOrCategoryEntriesToDelete[i].id, categoryOrCategorySet.id);
                }
              break;
              case 'categoryset': //* delete connections with categories
                var i = 0;
                for (; i < categorySetOrCategoryEntriesToDelete.length; i++) {
                  // var index = categoryOrCategorySet.categorySetHasCategories.findIndex(({id}) => id === categorySetOrCategoryEntriesToDelete[i].id);
                  // categoryOrCategorySet.categorySetHasCategories.splice(index,1);
                  await TIMAAT.CategoryService.deleteCategorySetHasCategory(categoryOrCategorySet.id, categorySetOrCategoryEntriesToDelete[i].id);
                }
              break;
            }
          }
          // CREATE new entries
          var idsToCreate = [];
          i = 0;
          for (; i < categoryOrCategorySetIdList.length; i++) {
            console.log("TCL: categoryOrCategorySetIdList", categoryOrCategorySetIdList);
            var idExists = false;
            var j = 0;
            for (; j < existingCategorySetOrCategoryEntries.length; j++) {
              console.log("TCL: existingCategorySetOrCategoryEntries", existingCategorySetOrCategoryEntries);
              if (categoryOrCategorySetIdList[i].id == existingCategorySetOrCategoryEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              idsToCreate.push(categoryOrCategorySetIdList[i].id);
              categoryOrCategorySetIdList.splice(i,1);
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            console.log("TCL: idsToCreate", idsToCreate);
            switch (type) {
              case 'category': //* find the corresponding categorySets and add the connection with this category
                var i = 0;
                for (; i < idsToCreate.length; i++ ) {
                  console.log("TCL: idsToCreate[i]", idsToCreate[i]);
                  // var categorySet = await TIMAAT.CategoryService.getCategorySet(idsToCreate[i]);
                  // console.log("TCL: categorySet", categorySet);
                  // categorySet.categorySetHasCategories.push({id: {categorySetId: categorySet.id, categoryId: idsToCreate[i]}});
                  // console.log("TCL: categorySet", categorySet);
                  var newCategorySetHasCategory = {
                    categorySetHasCategories: [],
                    categorySetHasCategory: null,
                    id: {
                      categorySetId: idsToCreate[i],
                      categoryId: categoryOrCategorySet.id
                    }
                  };
                  await TIMAAT.CategoryService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
                }
              break;
              case 'categoryset': //* add connections with categories
                var i = 0;
                for (; i < idsToCreate.length; i++) {
                  var newCategorySetHasCategory = {
                    categorySetHasCategories: [],
                    categorySetHasCategory: null,
                    id: {
                      categorySetId: categoryOrCategorySet.id,
                      categoryId: idsToCreate[i]
                    }
                  };
                  // categoryOrCategorySet.categorySetHasCategories.push({id: {categorySetId: categoryOrCategorySet.id, categoryId: idsToCreate[i]}});
                  console.log("TCL: newCategorySetHasCategory", newCategorySetHasCategory);
                  await TIMAAT.CategoryService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
                }
              break;
            }
          }
          //* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
          // UPDATE changed entries // TODO activate once categorySet-category connection contains data
          // i = 0;
          // switch (type) {
          //   case 'category': //* find the corresponding categorySets and update connections
          //     for (; i < categoryOrCategorySetIdList.length; i++) {
          //       console.log("TCL: categoryOrCategorySetIdList", categoryOrCategorySetIdList);
          //       var categorySet = await TIMAAT.CategoryService.getCategorySet(idsToCreate[i]);
          //       var updateCategorySetHasCategory = {
          //         categorySetHasCategories: [],
          //         categorySetHasCategory: null,
          //         id: {
          //           categorySetId: categoryOrCategorySetIdList[i].id,
          //           categoryId: categoryOrCategorySet.id
          //         }
          //       };
          //       await TIMAAT.CategoryService.updateCategorySetHasCategory(updateCategorySetHasCategory); // TODO categorySetHasCategory data
          //     }
          //   break;
          //   case 'categoryset': //* update corresponding category connections
          //     for (; i < categoryOrCategorySetIdList.length; i++) {
          //       console.log("TCL: categoryOrCategorySetIdList", categoryOrCategorySetIdList);
          //       var updateCategorySetHasCategory = {
          //         categorySetHasCategories: [],
          //         categorySetHasCategory: null,
          //         id: {
          //           categorySetId: categoryOrCategorySet.id,
          //           categoryId: categoryOrCategorySetIdList[i].id
          //         }
          //       };
          //       await TIMAAT.CategoryService.updateCategorySetHasCategory(updateCategorySetHasCategory) // TODO categorySetHasCategory data
          //     }
          //   break
          // }
        }
      } catch(error) {
        console.log( "error: ", error);
      };
      
      TIMAAT.CategoryLists.refreshDatatable('category');
      TIMAAT.CategoryLists.refreshDatatable('categoryset');
    },

    updateMediumAnalysisListHasCategorySetsList: async function(mediumAnalysisListModel, categorySetIdList) {
    	console.log("TCL: mediumAnalysisListModel, categorySetIdList", mediumAnalysisListModel, categorySetIdList);
			try {
				var existingMediumAnalysisListHasCategorySetsEntries = await TIMAAT.AnalysisListService.getCategorySetList(mediumAnalysisListModel.id);
        console.log("TCL: existingMediumAnalysisListHasCategorySetsEntries", existingMediumAnalysisListHasCategorySetsEntries);
        if (categorySetIdList == null || categorySetIdList.length == 0) { //* all entries will be deleted
          console.log("TCL: delete all entries");
					mediumAnalysisListModel.categorySets = [];
          await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
          // remove categories from annotations that belong to those category sets (= all)
          var i = 0;
          for (; i < mediumAnalysisListModel.annotations.length; i++) {
            await TIMAAT.CategoryLists.updateAnnotationHasCategoriesList(mediumAnalysisListModel.annotations[i], null);
          }
        } else if (existingMediumAnalysisListHasCategorySetsEntries.length == 0) { //* all entries will be added
          console.log("TCL: add  all entries");
					mediumAnalysisListModel.categorySets = categorySetIdList;
					await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
        } else { //* delete removed entries
          console.log("TCL: add/delete entries");
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMediumAnalysisListHasCategorySetsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < categorySetIdList.length; j++) {
							if (existingMediumAnalysisListHasCategorySetsEntries[i].id == categorySetIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMediumAnalysisListHasCategorySetEntries but not in categorySetIdList
              console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMediumAnalysisListHasCategorySetsEntries[i]);
							existingMediumAnalysisListHasCategorySetsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = mediumAnalysisListModel.categorySets.findIndex(({id}) => id === entriesToDelete[i].id);
							mediumAnalysisListModel.categorySets.splice(index,1);
              await TIMAAT.AnalysisListService.removeCategorySet(mediumAnalysisListModel.id, entriesToDelete[i].id);
            }
            // categories will be removed from annotations if corresponding category set is removed from analysislist
            i = 0;
            for (; i < mediumAnalysisListModel.annotations.length; i++) {
              mediumAnalysisListModel.annotations[i].categories = await TIMAAT.AnnotationService.getSelectedCategories(mediumAnalysisListModel.annotations[i].id);
            }
					}
					//* add existing categorySets
					var idsToCreate = [];
          i = 0;
          for (; i < categorySetIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMediumAnalysisListHasCategorySetsEntries.length; j++) {
              if (categorySetIdList[i].id == existingMediumAnalysisListHasCategorySetsEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = categorySetIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							mediumAnalysisListModel.categorySets.push(idsToCreate[i]);
							await TIMAAT.AnalysisListService.addCategorySet(mediumAnalysisListModel.id, idsToCreate[i].id);
						}
          }
          await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
          console.log("TCL: TIMAAT.VideoPlayer.annotationList", TIMAAT.VideoPlayer.curList);
          var i = 0;
          for (; i < TIMAAT.VideoPlayer.annotationList.length; i++) {
            TIMAAT.VideoPlayer.selectAnnotation(TIMAAT.VideoPlayer.annotationList[i]);
            TIMAAT.VideoPlayer.curAnnotation.updateUI();
          }
          TIMAAT.VideoPlayer.curAnnotation = null;
        }
			} catch(error) {
				console.log( "error: ", error);
			}
			return mediumAnalysisListModel;
    },
    
    updateAnnotationHasCategoriesList: async function(annotationModel, categoryIdList) {
    	console.log("TCL: annotationModel, categoryIdList", annotationModel, categoryIdList);
			try {
				var existingAnnotationHasCategoriesEntries = await TIMAAT.AnnotationService.getSelectedCategories(annotationModel.id);
        console.log("TCL: existingAnnotationHasCategoriesEntries", existingAnnotationHasCategoriesEntries);
        if (categoryIdList == null) { //* all entries will be deleted
          console.log("TCL: delete all categories");
					annotationModel.categories = [];
          await TIMAAT.AnnotationService.updateAnnotation(annotationModel);
        } else if (existingAnnotationHasCategoriesEntries.length == 0) { //* all entries will be added
          console.log("TCL: add all categories");
					annotationModel.categories = categoryIdList;
					await TIMAAT.AnnotationService.updateAnnotation(annotationModel);
        } else { //* delete removed entries
          console.log("TCL: add/delete categories");
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingAnnotationHasCategoriesEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < categoryIdList.length; j++) {
							if (existingAnnotationHasCategoriesEntries[i].id == categoryIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingAnnotationHasCategoryEntries but not in categoryIdList
              console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingAnnotationHasCategoriesEntries[i]);
							existingAnnotationHasCategoriesEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = annotationModel.categories.findIndex(({id}) => id === entriesToDelete[i].id);
							annotationModel.categories.splice(index,1);
							await TIMAAT.AnnotationService.removeCategory(annotationModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing categories
					var idsToCreate = [];
          i = 0;
          for (; i < categoryIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingAnnotationHasCategoriesEntries.length; j++) {
              if (categoryIdList[i].id == existingAnnotationHasCategoriesEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = categoryIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							annotationModel.categories.push(idsToCreate[i]);
							await TIMAAT.AnnotationService.addCategory(annotationModel.id, idsToCreate[i].id);
						}
          }
        }
        if (TIMAAT.VideoPlayer.curAnnotation) {
          TIMAAT.VideoPlayer.curAnnotation.updateUI();
        }
			} catch(error) {
				console.log( "error: ", error);
			}
			return annotationModel;
		},

    _categoryOrCategorySetRemoved: async function(type, categoryOrCategorySet) {
      console.log("TCL: _categoryOrCategorySetRemoved: type, categoryOrCategorySet", type, categoryOrCategorySet);
      try {
        await TIMAAT.CategoryService.deleteCategoryOrCategorySet(type, categoryOrCategorySet.model.id);
      } catch(error) {
        console.log("error: ", error)
      }
      categoryOrCategorySet.remove();
    },

    appendCategoryIsPartOfCategorySetsDataset: function() {
      var isPartOfCategorySetFormData =
      `<div class="form-group" data-role="categoryispartofcategoryset-entry">
        <div class="form-row">
          <div class="col-md-12">
            <label class="sr-only">Is part of CategorySet(s)</label>
            <select class="form-control form-control-sm"
                    id="categorysets-multi-select-dropdown"
                    name="categorySetId"
                    data-placeholder="Select category set(s)"
                    multiple="multiple"
                    readonly="true">
            </select>
          </div>
        </div>
      </div>`;
      return isPartOfCategorySetFormData;
    },

    appendCategorySetContainsCategoriesDataset: function() {
      var isPartOfCategoryFormData =
      `<div class="form-group" data-role="categorysetcontainscategory-entry">
        <div class="form-row">
          <div class="col-md-12">
            <label class="sr-only">Contains Category(s)</label>
            <select class="form-control form-control-sm"
                    id="categories-multi-select-dropdown"
                    name="categoryId"
                    data-placeholder="Select category(s)"
                    multiple="multiple"
                    readonly="true">
            </select>
          </div>
        </div>
      </div>`;
      return isPartOfCategoryFormData;
    },


		
		// addCategorySet: function() {
		// 	console.log("TCL: addCategorySet: function()");
		// 	$('#timaat-categorylists-categoryset-meta').data('categoryset', null);
		// 	$('#timaat-categorylists-categoryset-meta').modal('show');
		// },
		
		// _categorySetAdded: function(categorySet) {
		// 	console.log("TCL: _categorySetAdded: function(categorySet)");
		// 	console.log("TCL: categorySet", categorySet);
		// 	TIMAAT.CategoryLists.categorySets.model.push(categorySet);
		// 	TIMAAT.CategoryLists.categorySets.push(new TIMAAT.CategorySet(categorySet));
		// },
		
		// _categorySetRemoved: function(categorySet) {
		// 	console.log("TCL: _categorySetRemoved: function(categorySet)");
		// 	console.log("TCL: categorySet", categorySet);
		// 	// sync to server
		// 	TIMAAT.CategoryService.deleteCategorySet(categorySet);			
		// 	categorySet.remove();
		// 	if ( TIMAAT.VideoPlayer.curCategorySet == categorySet ) TIMAAT.VideoPlayer.setCategorySet(null);
		// },
		
		// _categoryDeleted: function(category) {
		// 	console.log("TCL: _categoryDeleted: function(category)");
		// 	console.log("TCL: category", category);
		// 	// sync to server
		// 	TIMAAT.CategoryService.deleteCategory(category);
		// 	TIMAAT.CategoryLists.categories.dt.row("#"+category).remove();
		// 	TIMAAT.CategoryLists.categories.dt.draw();
		// }
		
	}
	
}, window));
