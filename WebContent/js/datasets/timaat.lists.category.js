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
		
		init: function() {
			this.initCategories();
			this.initCategorySets();
    },

		initCategories: function() {
			// nav-bar functionality
      $('#category-tab').on('click', function(event) {
        TIMAAT.CategoryLists.loadCategories();
        TIMAAT.UI.displayComponent('category', 'category-tab', 'category-datatable');
        TIMAAT.URLHistory.setURL(null, 'Category Datasets', '#category/list');
      });

      // edit content form button handler
      $('#category-metadata-form-edit-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#category-metadata-form').data('category'), 'category', 'edit');
			});

            // submit content form button functionality
			$('#category-metadata-form-submit-button').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();
				if (!$('#category-metadata-form').valid()) return false;

				// the original category or category set model (in case of editing an existing category or category set)
				var category = $('#category-metadata-form').data('category');				

				// create/edit category or category set window submitted data
				var formDataRaw = $('#category-metadata-form').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });

        // var duplicate = await TIMAAT.CategorySetService.checkForDuplicate(formDataObject.name);
        // if (duplicate && categorySet.model.name != formDataObject.name) { // duplicate category set name entered
        //   $('#timaat-categorylists-categoryset-duplicate').modal('show');
        // }
        // else {
        delete formDataObject.categorySetId;
        // console.log("TCL: formDataObject", formDataObject);
        var formSelectData = formDataRaw;
        formSelectData.splice(0,1); // remove entries not part of multi select data
        // console.log("TCL: formSelectData", formSelectData);
        // create proper id list
        var i = 0;
        var categoryIdList = [];
        for (; i < formSelectData.length; i++) {
          categoryIdList.push( {id: Number(formSelectData[i].value)})
        }

        if (category) { // update category
          category.model.name = formDataObject.name;
          let categoryData = category.model;
          delete categoryData.ui;
          await TIMAAT.CategoryLists.updateCategory(categoryData, categoryIdList);
          // category.updateUI();
        } 
        else { // create new category
          var categoryModel = await TIMAAT.CategoryLists.createCategoryModel(formDataObject);
          var newCategory = await TIMAAT.CategoryLists.createCategory(categoryModel, categoryIdList);
          category = new TIMAAT.Category(newCategory);
          $('#category-metadata-form').data('category', category); 
          $('#list-tab-metadata').data('type', 'category');
          $('#list-tab-metadata').trigger('click');
        }
        TIMAAT.CategoryLists.showAddCategoryButton();
        await TIMAAT.UI.refreshDataTable('category');
        TIMAAT.UI.addSelectedClassToSelectedItem('category', category.model.id);
        TIMAAT.UI.displayDataSetContent('dataSheet', category, 'category');
        // }
			});

      // delete button (in form) handler
      $('#category-metadata-form-delete-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#timaat-categorylists-category-delete').data('category', $('#category-metadata-form').data('category'));
        $('#timaat-categorylists-category-delete').modal('show');
      });

      // confirm delete category modal functionality
      $('#timaat-categorylists-category-delete-submit-button').on('click', async function(ev) {
        var modal = $('#timaat-categorylists-category-delete');
        var category = modal.data('category');
        // console.log("TCL: $ -> category", category);
        if (category) {
          try {	
            await TIMAAT.CategoryService.deleteCategory(category.model.id);
            category.remove();
          } catch(error) {
            console.error("ERROR: ", error);
          }
          try {
            await TIMAAT.UI.refreshDataTable('categorySet');
            await TIMAAT.UI.refreshDataTable('category');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        // TIMAAT.CategoryLists.loadCategories();
        $('#category-tab').trigger('click');
      });

      // cancel add/edit button in content form functionality
			$('#category-metadata-form-dismiss-button').on('click', async function(event) {
        TIMAAT.CategoryLists.showAddCategoryButton();
        let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#timaat-categorylists-category-table').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

      // inspector event handler
      $('#timaat-annotation-category-form-submit-button').on('click', async function(event) {
        event.preventDefault();
        if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
          $('#analysisListNoPermissionModal').modal('show');
          return;
        }
        // console.log("TCL: Submit Categories for analysis list");
        // var modal = $('#timaat-annotationdatasets-annotation-categories');
        if (!$('#annotationCategoriesForm').valid()) 
          return false;
        var annotation = TIMAAT.VideoPlayer.curAnnotation;
        // console.log("TCL: Inspector -> constructor -> annotation", annotation);
        var formDataRaw = $('#annotationCategoriesForm').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var i = 0;
        var categoryIdList = [];
        for (; i < formDataRaw.length; i++) {
          categoryIdList.push( {id: formDataRaw[i].value} );
        }
        // console.log("TCL: categoryIdList", categoryIdList);
        annotation.model = await TIMAAT.CategoryLists.updateElementHasCategoriesList(annotation.model, categoryIdList, 'annotation');
        // $('#medium-metadata-form').data('annotation', annotation);
      });

      // inspector event handler
      $('#timaat-annotation-category-form-dismiss-button').on('click', async function(event) {
        // event.preventDefault();
        $('#annotation-categories-multi-select-dropdown').val(null).trigger('change');
        $('#annotation-categories-multi-select-dropdown').select2('destroy');
        $('#annotation-categories-multi-select-dropdown').find('option').remove();
        
        $('#annotation-categories-multi-select-dropdown').select2({
          closeOnSelect: false,
          scrollAfterSelect: true,
          allowClear: true,
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
            cache: false
          },
          minimumInputLength: 0,
        });
        TIMAAT.AnnotationService.getSelectedCategories(TIMAAT.VideoPlayer.curAnnotation.model.id).then(function(data) {
          // console.log("TCL: then: data", data);
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

      // inspector event handler
      $('#timaat-segment-element-category-form-submit').on('click', async function(event) {
        event.preventDefault();
        if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
          $('#analysisListNoPermissionModal').modal('show');
          return;
        }
        let type = $('#segmentElementCategoriesForm').data('type');
        // var modal = $('#timaat-segmentdatasets-segment-categories');
        if (!$('#segmentElementCategoriesForm').valid()) return false;
        var segmentElement;
        switch (type) {
          case 'segment':
            segmentElement= TIMAAT.VideoPlayer.curSegment;
          break;
          case 'sequence':
            segmentElement= TIMAAT.VideoPlayer.curSequence;
          break;
          case 'take':
            segmentElement= TIMAAT.VideoPlayer.curTake;
          break;
          case 'scene':
            segmentElement= TIMAAT.VideoPlayer.curScene;
          break;
          case 'action':
            segmentElement= TIMAAT.VideoPlayer.curAction;
          break;
        }
        // console.log("TCL: Inspector -> constructor -> segmentElement", segmentElement);
        var formDataRaw = $('#segmentElementCategoriesForm').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var i = 0;
        var categoryIdList = [];
        for (; i < formDataRaw.length; i++) {
          categoryIdList.push( {id: formDataRaw[i].value} );
        }
        // console.log("TCL: categoryIdList", categoryIdList);
        segmentElement.model = await TIMAAT.CategoryLists.updateElementHasCategoriesList(segmentElement.model, categoryIdList, type);
        // console.log("TCL: $ -> segmentElement", segmentElement);
        // $('#medium-metadata-form').data('segment', segment);
      });

      // inspector event handler
      $('#timaat-segment-element-category-form-dismiss').on('click', function(event) {
        // event.preventDefault();
        $('#segment-element-categories-multi-select-dropdown').val(null).trigger('change');
        $('#segment-element-categories-multi-select-dropdown').select2('destroy');
        $('#segment-element-categories-multi-select-dropdown').find('option').remove();
        let type = $('#segmentElementCategoriesForm').data('type');
        let segmentElementId;
        switch (type) {
          case 'segment':
            segmentElementId = TIMAAT.VideoPlayer.curSegment.model.id
          break;
          case 'sequence':
            segmentElementId = TIMAAT.VideoPlayer.curSequence.model.id
          break;
          case 'take':
            segmentElementId = TIMAAT.VideoPlayer.curTake.model.id
          break;
          case 'scene':
            segmentElementId = TIMAAT.VideoPlayer.curScene.model.id
          break;
          case 'action':
            segmentElementId = TIMAAT.VideoPlayer.curAction.model.id
          break;
        }
        
        $('#segment-element-categories-multi-select-dropdown').select2({
          closeOnSelect: false,
          scrollAfterSelect: true,
          allowClear: true,
          ajax: {
            url: 'api/analysislist/'+type+'/'+segmentElementId+'/category/selectList/',
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
            cache: false
          },
          minimumInputLength: 0,
        });
        TIMAAT.AnalysisListService.getSelectedCategories(segmentElementId, type).then(function(data) {
          // console.log("TCL: then: data", data);
          var categorySelect = $('#segment-element-categories-multi-select-dropdown');
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

		},

		initCategorySets: function() {
			// nav-bar functionality
      $('#categoryset-tab').on('click', function(event) {
        TIMAAT.CategoryLists.loadCategorySets();
        TIMAAT.UI.displayComponent('categorySet', 'categoryset-tab', 'categoryset-datatable');
        TIMAAT.URLHistory.setURL(null, 'Category Set Datasets', '#categorySet/list');
      });

      // edit content form button handler
      $('#categoryset-metadata-form-edit-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#categoryset-metadata-form').data('categorySet'), 'categorySet', 'edit');
			});

            // submit content form button functionality
			$('#categoryset-metadata-form-submit-button').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();
				if (!$('#categoryset-metadata-form').valid()) return false;

				// the original category or category set model (in case of editing an existing category or category set)
				var categorySet = $('#categoryset-metadata-form').data('categorySet');				

				// create/edit category or category set window submitted data
				var formDataRaw = $('#categoryset-metadata-form').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });

        var duplicate = await TIMAAT.CategorySetService.checkForDuplicate(formDataObject.name);
        if (duplicate && categorySet && categorySet.model.name != formDataObject.name || duplicate && !categorySet) { // duplicate category set name entered
          $('#timaat-categorylists-categoryset-duplicate').modal('show');
        } 
        else {
          delete formDataObject.categoryId;
          // console.log("TCL: formDataObject", formDataObject);
          var formSelectData = formDataRaw;
          formSelectData.splice(0,1); // remove entries not part of multi select data
          // console.log("TCL: formSelectData", formSelectData);
          // create proper id list
          var i = 0;
          var categorySetIdList = [];
          for (; i < formSelectData.length; i++) {
            categorySetIdList.push( {id: Number(formSelectData[i].value)})
          }

          if (categorySet) { // update category set
            categorySet.model.name = formDataObject.name;
            let categorySetData = categorySet.model;
            delete categorySetData.ui;
            await TIMAAT.CategoryLists.updateCategorySet(categorySetData, categorySetIdList);
          }
          else { // create new category set
            var categorySetModel = await TIMAAT.CategoryLists.createCategorySetModel(formDataObject);
            var newCategorySet = await TIMAAT.CategoryLists.createCategorySet(categorySetModel, categorySetIdList);
            categorySet = new TIMAAT.CategorySet(newCategorySet);
            $('#categoryset-metadata-form').data('categorySet', categorySet);
            $('#list-tab-metadata').data('type', 'categorySet');
            $('#list-tab-metadata').trigger('click');
          }
          TIMAAT.CategoryLists.showAddCategorySetButton();
          await TIMAAT.UI.refreshDataTable('categorySet');
          TIMAAT.UI.addSelectedClassToSelectedItem('categorySet', categorySet.model.id);
          TIMAAT.UI.displayDataSetContent('dataSheet', categorySet, 'categorySet');
        }
			});

      // delete button (in form) handler
      $('#categoryset-metadata-form-delete-button').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#timaat-categorylists-categoryset-delete').data('categorySet', $('#categoryset-metadata-form').data('categorySet'));
        $('#timaat-categorylists-categoryset-delete').modal('show');
      });

      // confirm delete category set modal functionality
      $('#timaat-categorylists-categoryset-delete-submit-button').on('click', async function(ev) {
        var modal = $('#timaat-categorylists-categoryset-delete');
        var categorySet = modal.data('categorySet');
        if (categorySet) {
          try {	
            // await TIMAAT.CategoryLists._categorySetRemoved(categorySet.model.id);
            await TIMAAT.CategorySetService.deleteCategorySet(categorySet.model.id);
            categorySet.remove();
          } catch(error) {
            console.error("ERROR: ", error);
          }
          try {
            await TIMAAT.UI.refreshDataTable('categorySet');
            await TIMAAT.UI.refreshDataTable('category');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        // TIMAAT.CategoryLists.loadCategorySets();
        $('#categoryset-tab').trigger('click');
      });

      // cancel add/edit button in content form functionality
			$('#categoryset-metadata-form-dismiss-button').on('click', async function(event) {
        TIMAAT.CategoryLists.showAddCategorySetButton();
        let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#timaat-categorylists-categoryset-table').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

      // inspector event handler
      $('#timaat-mediumAnalysisList-categorySet-form-submit-button').on('click', async function(event) {
        event.preventDefault();
        if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
          $('#analysisListNoPermissionModal').modal('show');
          return;
        }
        // console.log("TCL: Submit category sets for analysis list");
        if (!$('#mediumAnalysisListCategorySetsForm').valid()) 
          return false;
        var mediumAnalysisList = TIMAAT.VideoPlayer.curAnalysisList;
        // console.log("TCL: Inspector -> constructor -> mediumAnalysisList", mediumAnalysisList);
        var formDataRaw = $('#mediumAnalysisListCategorySetsForm').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var i = 0;
        var categorySetIdList = [];

        for (; i < formDataRaw.length; i++) {
            categorySetIdList.push( {id: Number(formDataRaw[i].value)} );
        }
        // console.log("TCL: categorySetIdList", categorySetIdList);
        // TODO check if any annotation is using categories from category sets that will be removed with this operation
        var annosUseCategorySet = false;
        var annoInBothLists = false;
        if (categorySetIdList.length < mediumAnalysisList.categorySets.length) {
          annosUseCategorySet = true;
          // console.log("TCL: list contains less sets than before.");
        } else {
          i = 0;
          var j = 0;
          for (; i < mediumAnalysisList.categorySets.length; i++) {
            annoInBothLists = false;
            for (; j < categorySetIdList.length; j++) {
              if (mediumAnalysisList.categorySets[i].id == categorySetIdList[j].id) {
                annoInBothLists = true;
                // console.log("TCL: match found!");
                break;
              }
            }
            if (!annoInBothLists) {
              // console.log("TCL mediumAnalysisList.categorySets[i].id not available anymore", mediumAnalysisList.categorySets[i].id);
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

      // inspector event handler
      $('#timaat-mediumAnalysisList-categorySet-in-use-confirm-button').on('click', async function(event) {
        var modal = $('#timaat-mediumAnalysisList-categorySet-in-use');
        var mediumAnalysisList = modal.data('mediumAnalysisList');
        var categorySetIdList = modal.data('categorySetIdList');
        await TIMAAT.CategoryLists.updateMediumAnalysisListHasCategorySetsList(mediumAnalysisList, categorySetIdList);
        modal.modal('hide');
      });

      // inspector event handler
      $('#timaat-mediumAnalysisList-categorySet-form-dismiss-button').on('click', async function(event) {
        // event.preventDefault();
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').val(null).trigger('change');
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').select2('destroy');
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').find('option').remove();
        
        $('#mediumAnalysisList-categorySets-multi-select-dropdown').select2({
          closeOnSelect: false,
          scrollAfterSelect: true,
          allowClear: true,
          ajax: {
            url: 'api/categorySet/selectList/',
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
            cache: false
          },
          minimumInputLength: 0,
        });
        TIMAAT.AnalysisListService.getCategorySetList(TIMAAT.VideoPlayer.curAnalysisList.id).then(function(data) {
          // console.log("TCL: then: data", data);
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

		},

		load: function() {
      this.loadCategories();
      this.loadCategorySets();
		},
		
		loadCategories: function() {
      $('#list-tab-metadata').data('type', 'category');
      TIMAAT.UI.addSelectedClassToSelectedItem('category', null);
      TIMAAT.UI.subNavTab = 'dataSheet';
      this.showAddCategoryButton();
      this.setCategoriesList();
		},
		
		loadCategorySets: function() {
      $('#list-tab-metadata').data('type', 'categorySet');
      TIMAAT.UI.addSelectedClassToSelectedItem('categorySet', null);
      TIMAAT.UI.subNavTab = 'dataSheet';
      this.showAddCategorySetButton();
      this.setCategorySetsList();
		},

		loadCategoriesDataTables: function() {
      this.setupCategoryDataTable();
      this.setupCategorySetDataTable();
		},

		setCategoriesList: function() {
      if ( this.categories == null) return;
			if ( this.dataTableCategories ) {
				this.dataTableCategories.ajax.reload(null, false);
	      TIMAAT.UI.clearLastSelection('category');
		}
		},
		
		setCategorySetsList: function() {
			if ( this.categorySets == null ) return;
			if ( this.dataTableCategorySets ) {
				this.dataTableCategorySets.ajax.reload(null, false);
        TIMAAT.UI.clearLastSelection('categorySet');
			}
		},

		setupCategoryDataTable: function() {			
      // console.log("TCL: setupCategoryDataTable");
      // setup datatable
      this.dataTableCategories = $('#timaat-categorylists-category-table').DataTable({
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
            var categoryArray = Array();
            data.data.forEach(function(category) { 
              if ( category.id > 0 ) {
                categoryArray.push(new TIMAAT.Category(category));
              }
            });
            TIMAAT.CategoryLists.categories = categoryArray;
            TIMAAT.CategoryLists.categories.model = data.data;
            return data.data;
          }
        },
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedCategoryId) {
						TIMAAT.UI.clearLastSelection('category');
						$(row).addClass('selected');
					}
				},
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let categoryElement = $(row);
          let category = data;
          category.ui = categoryElement;
          categoryElement.data('category', category);

          categoryElement.on('click', '.name', function(event) {
            event.stopPropagation();
            TIMAAT.CategoryLists.setDataTableOnItemSelect('category', category.id);
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

    setupCategorySetDataTable: function() {			
      // console.log("TCL: setupCategorySetDataTable");
      // setup datatable
      this.dataTableCategorySets = $('#timaat-categorylists-categoryset-table').DataTable({
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
          "url"        : "api/categorySet/list",
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
            var categorySetArray = Array();
            data.data.forEach(function(categorySet) { 
              if ( categorySet.id > 0 ) {
                categorySetArray.push(new TIMAAT.CategorySet(categorySet));
              }
            });
            TIMAAT.CategoryLists.categorySets = categorySetArray;
            TIMAAT.CategoryLists.categorySets.model = data.data;
            return data.data;
          }
        },
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedCategorySetId) {
						TIMAAT.UI.clearLastSelection('categorySet');
						$(row).addClass('selected');
					}
				},
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let categorySetElement = $(row);
          let categorySet = data;
          categorySet.ui = categorySetElement;
          categorySetElement.data('categorySet', categorySet);

          categorySetElement.on('click', '.name', function(event) {
            event.stopPropagation();
            TIMAAT.CategoryLists.setDataTableOnItemSelect('categorySet', categorySet.id);
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

    setDataTableOnItemSelect: function(type, selectedItemId) {
      // console.log("TCL: type, selectedItemId", type, selectedItemId);
			// show tag editor - trigger popup
			TIMAAT.UI.hidePopups();
			// switch (this.subNavTab) {
			// 	case 'dataSheet':
      if (type == 'category') {
					TIMAAT.UI.displayDataSetContentContainer(type+'-data-tab', type+'-metadata-form', type);
      } else {
        TIMAAT.UI.displayDataSetContentContainer('categoryset-data-tab', 'categoryset-metadata-form', type);
      }
			// 	break;
			// }
			TIMAAT.UI.clearLastSelection(type);
			let index;
			let selectedItem;
			switch (type) {
				case 'category':
					index = this.categories.findIndex(({model}) => model.id === selectedItemId);
					selectedItem = this.categories[index];
          $('#category-metadata-form').data(type, selectedItem);
          this.showAddCategoryButton();
				break;
				case 'categorySet':
					index = this.categorySets.findIndex(({model}) => model.id === selectedItemId);
					selectedItem = this.categorySets[index];
          $('#categoryset-metadata-form').data(type, selectedItem);
          this.showAddCategorySetButton();
			break;
			}
      $('#list-tab-metadata').data('type', type);
      TIMAAT.UI.addSelectedClassToSelectedItem(type, selectedItemId);
      TIMAAT.URLHistory.setURL(null, selectedItem.model.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + selectedItem.model.id);
			TIMAAT.UI.displayDataSetContent('dataSheet', selectedItem, type);
		},

		addCategory: function() {	
			// console.log("TCL: addCategory()");
      TIMAAT.UI.displayDataSetContentContainer('list-tab-metadata', 'category-metadata-form');
			$('#list-tab-metadata').data('type', 'category');
      $('#category-metadata-form').data('category', null);
      categoryOrCategorySetFormMetadataValidator.resetForm();
      
      TIMAAT.UI.addSelectedClassToSelectedItem('category', null);
      // this.subNavTab = 'dataSheet';

      // setup form
			$('#category-metadata-form').trigger('reset');
      this.initFormDataSheetData('category');
      this.initFormDataSheetForEdit('category');
      $('#category-metadata-form-submit-button').html("Add");
      $('#categoryFormHeader').html("Add category");
		},

    addCategorySet: function() {	
			// console.log("TCL: addCategorySet()");
      TIMAAT.UI.displayDataSetContentContainer('list-tab-metadata', 'categoryset-metadata-form');
			$('#list-tab-metadata').data('type', 'categorySet');
      $('#categoryset-metadata-form').data('categorySet', null);
      categoryOrCategorySetFormMetadataValidator.resetForm();
      
      TIMAAT.UI.addSelectedClassToSelectedItem('categorySet', null);
      // this.subNavTab = 'dataSheet';

      // setup form
			$('#categoryset-metadata-form').trigger('reset');
      this.initFormDataSheetData('categorySet');
      this.initFormDataSheetForEdit('categorySet');
      $('#categoryset-metadata-form-submit-button').html("Add");
      $('#categorySetFormHeader').html("Add category set");
		},
		
		categoryFormDataSheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      var node = document.getElementById('dynamic-category-ispartof-categoryset-fields');
      while (node.lastChild) {
        node.removeChild(node.lastChild)
      }

      // TIMAAT.UI.addSelectedClassToSelectedItem('category', data.model.id);
      $('#category-metadata-form').trigger('reset');
      $('#list-tab-metadata').data('type', 'category');
      this.initFormDataSheetData('category');
      categoryOrCategorySetFormMetadataValidator.resetForm();

      $('#dynamic-category-ispartof-categoryset-fields').append(this.appendCategoryIsPartOfCategorySetsDataset());
      $('#categorysets-multi-select-dropdown').select2({
        closeOnSelect: false,
        scrollAfterSelect: true,
        allowClear: true,
        ajax: {
          url: 'api/categorySet/selectList',
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
      var categorySetSelect = $('#categorysets-multi-select-dropdown');
      await TIMAAT.CategoryService.getCategoryHasCategorySetList(data.model.id).then(function (data) {
        // console.log("TCL: then: data", data);
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

      if ( action == 'show') {
        $('#category-metadata-form :input').prop('disabled', true);
        this.initFormsForShow();
        $('#categoryFormHeader').html("Category Data Sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit('category');
        $('#category-metadata-form-submit-button').html("Save");
        $('#categoryFormHeader').html("Edit Category");
      }
      // name data
      $('#timaat-category-metadata-name').val(data.model.name);

      $('#category-metadata-form').data('category', data);
    },

    categorySetFormDataSheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      var node = document.getElementById('dynamic-categoryset-contains-category-fields');
			while (node.lastChild) {
				node.removeChild(node.lastChild)
      }

      // TIMAAT.UI.addSelectedClassToSelectedItem('categorySet', data.model.id);
      $('#categoryset-metadata-form').trigger('reset');
      $('#list-tab-metadata').data('type', 'categorySet');
      this.initFormDataSheetData('categorySet');
      categoryOrCategorySetFormMetadataValidator.resetForm();

      $('#dynamic-categoryset-contains-category-fields').append(this.appendCategorySetContainsCategoriesDataset());
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
          cache: false
        },
        minimumInputLength: 0,
      });          
      var categorySelect = $('#categories-multi-select-dropdown');
      await TIMAAT.CategorySetService.getCategorySetHasCategoryList(data.model.id).then(function (data) {
        // console.log("TCL: then: data", data);
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

      if ( action == 'show') {
        $('#categoryset-metadata-form :input').prop('disabled', true);
        this.initFormsForShow();
        $('#categorySetFormHeader').html("Category Set Data Sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit('categorySet');
        $('#categoryset-metadata-form-submit-button').html("Save");
        $('#categorySetFormHeader').html("Edit Category Set");
      }
      // name data
      $('#timaat-categoryset-metadata-name').val(data.model.name);

      $('#categoryset-metadata-form').data('categorySet', data);
    },

    createCategoryModel: async function(formDataObject) {
      // console.log("TCL: createCategoryModel - formDataObject", formDataObject);
      let model = {
        id: 0,
        name: formDataObject.name
      };
      return model;
    },

    createCategorySetModel: async function(formDataObject) {
      // console.log("TCL: createCategorySetModel - formDataObject", formDataObject);
      let model = {
        id: 0,
        name: formDataObject.name,
        // categorySetHasCategories: [{}]
      };
      return model;
    },
  
    createCategory: async function(model, categoryIdList) {
      // console.log("TCL: createCategory: model, categoryIdList: ", model, categoryIdList);
      try {				
        // create category or category set
        var newModel = await TIMAAT.CategoryService.createCategory(model);
        // console.log("TCL: newModel", newModel);
        model.id = newModel.id;

        // if (categoryIdList != null) {
        //   await this.updateCategory(model, categoryIdList); // TODO may have to be adjusted once list can be created upon category/categoryset creation
        // }				
      } catch(error) {
        console.error("ERROR: ", error);
      };
      return (model);
    },

    createCategorySet: async function(model, categorySetIdList) {
      // console.log("TCL: createCategorySet: model, categorySetIdList: ", model, categorySetIdList);
      try {				
        // create category or category set
        var newModel = await TIMAAT.CategorySetService.createCategorySet(model);
        // console.log("TCL: newModel", newModel);
        model.id = newModel.id;
        // if (categorySetIdList != null) {
        //   await this.updateCategorySet(model, categorySetIdList); // TODO may have to be adjusted once list can be created upon category/categoryset creation
        // }				
      } catch(error) {
        console.error("ERROR: ", error);
      };
      return (model);
    },

    // TODO update categorySetHasCategories
    updateCategory: async function(category, categoryIdList) {
      // console.log("TCL: updateCategory: async function -> beginning of update: category, categoryIdList ", category, categoryIdList);

      try { // update translation
        var tempModel = await TIMAAT.CategoryService.updateCategory(category);
        category = tempModel;
      } catch(error) {
        console.error("ERROR: ", error);
      };

      try { // update category_set_has_category table entries via category or category set
        var existingEntries = await TIMAAT.CategoryService.getCategoryHasCategorySetList(category.id);
        // console.log("TCL: existingEntries", existingEntries);
        // console.log("TCL: categoryIdList", categoryIdList);
        if (categoryIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all existingEntries: ", existingEntries);
          var i = 0;
          for (; i < existingEntries.length; i++) {
            await TIMAAT.CategorySetService.deleteCategorySetHasCategory(existingEntries[i].id, category.id);
          }       
        } else if (existingEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all categoryIdList: ", categoryIdList);
          //* find all categorySets this category shall be connected to and add the connection
          var i = 0;
          for (; i < categoryIdList.length; i++) {
            var newCategorySetHasCategory = {
              categorySetHasCategories: [],
              categorySetHasCategory: null,
              id: {
                categorySetId: categoryIdList[i].id,
                categoryId: category.id
              }
            };
            // console.log("TCL: newCategorySetHasCategory", newCategorySetHasCategory);
            // categorySet.categorySetHasCategories.push(newCategorySetHasCategory);
            await TIMAAT.CategorySetService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
          }
        } else { //* add/remove entries
          // DELETE removed entries
          var entriesToDelete = [];
          var i = 0;
          for (; i < existingEntries.length; i++) {
            var deleteId = true;
            var j = 0;
            for (; j < categoryIdList.length; j++) {
              if( existingEntries[i].id == categoryIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingEntries but not in categoryIdList
              // console.log("TCL: delete entry: ", existingEntries[i]);
              entriesToDelete.push(existingEntries[i]);
              existingEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: entriesToDelete", entriesToDelete);
          if (entriesToDelete.length > 0) { // anything to delete?
            var i = 0;
            for (; i < entriesToDelete.length; i++) {
              await TIMAAT.CategorySetService.deleteCategorySetHasCategory(entriesToDelete[i].id, category.id);
            }
          }
          // CREATE new entries
          var idsToCreate = [];
          i = 0;
          for (; i < categoryIdList.length; i++) {
            // console.log("TCL: categoryIdList", categoryIdList);
            var idExists = false;
            var j = 0;
            for (; j < existingEntries.length; j++) {
              // console.log("TCL: existingEntries", existingEntries);
              if (categoryIdList[i].id == existingEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              idsToCreate.push(categoryIdList[i].id);
              categoryIdList.splice(i,1);
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
            var i = 0;
            for (; i < idsToCreate.length; i++ ) {
              // console.log("TCL: idsToCreate[i]", idsToCreate[i]);
              var newCategorySetHasCategory = {
                categorySetHasCategories: [],
                categorySetHasCategory: null,
                id: {
                  categorySetId: idsToCreate[i],
                  categoryId: category.id
                }
              };
              await TIMAAT.CategorySetService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
            }
          }
          //* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
          // UPDATE changed entries // TODO activate once categorySet-category connection contains data
          // i = 0;
          // for (; i < categoryIdList.length; i++) {
          //   console.log("TCL: categoryIdList", categoryIdList);
          //   var categorySet = await TIMAAT.CategorySetService.getCategorySet(idsToCreate[i]);
          //   var updateCategorySetHasCategory = {
          //     categorySetHasCategories: [],
          //     categorySetHasCategory: null,
          //     id: {
          //       categorySetId: categoryIdList[i].id,
          //       categoryId: category.id
          //     }
          //   };
          //   await TIMAAT.CategorySetService.updateCategorySetHasCategory(updateCategorySetHasCategory); // TODO categorySetHasCategory data
          // }
        }
      } catch(error) {
        console.error("ERROR: ", error);
      };
      
      await TIMAAT.UI.refreshDataTable('category');
      await TIMAAT.UI.refreshDataTable('categorySet');
    },

    updateCategorySet: async function(categorySet, categorySetIdList) {
      // console.log("TCL: updateCategorySet:function -> categorySet, categorySetIdList", categorySet, categorySetIdList);
      try { // update translation
        let tempModel = await TIMAAT.CategorySetService.updateCategorySet(categorySet);
        categorySet = tempModel;
      } catch(error) {
        console.error("ERROR: ", error);
      };
      try { // update category_set_has_category table entries via category or category set
        var existingEntries = await TIMAAT.CategorySetService.getCategorySetHasCategoryList(categorySet.id);
        // console.log("TCL: existingEntries", existingEntries);
        // console.log("TCL: categorySetIdList", categorySetIdList);
        if (categorySetIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all existingEntries: ", existingEntries);
          categorySet.categorySetHasCategories = [];
          let i = 0;
          for (; i < existingEntries.length; i++) {
            await TIMAAT.CategorySetService.deleteCategorySetHasCategory(categorySet.id, existingEntries[i].id);
          }
        } 
        else if (existingEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all categorySetIdList: ", categorySetIdList);
          let i = 0;
          for (; i < categorySetIdList.length; i++) {
            categorySet.categorySetHasCategories.push({id: {categorySetId: categorySet.id, categoryId: categorySetIdList[i]}});
            var newCategorySetHasCategory = {
              categorySetHasCategories: [],
              categorySetHasCategory: null,
              id: {
                categorySetId: categorySet.id,
                categoryId: categorySetIdList[i].id
              }
            };
            await TIMAAT.CategorySetService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
          }
        } 
        else { //* add/remove entries
          // DELETE removed entries
          var entriesToDelete = [];
          var i = 0;
          for (; i < existingEntries.length; i++) {
            var deleteId = true;
            var j = 0;
            for (; j < categorySetIdList.length; j++) {
              if( existingEntries[i].id == categorySetIdList[j].id) {
                deleteId = false;
                break; // no need to check further if match was found
              }
            }
            if (deleteId) { // id is in existingEntries but not in categorySetIdList
              // console.log("TCL: delete entry: ", existingEntries[i]);
              entriesToDelete.push(existingEntries[i]);
              existingEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: entriesToDelete", entriesToDelete);
          if (entriesToDelete.length > 0) { // anything to delete?
            var i = 0;
            for (; i < entriesToDelete.length; i++) {
              await TIMAAT.CategorySetService.deleteCategorySetHasCategory(categorySet.id, entriesToDelete[i].id);
            }
          }
          // CREATE new entries
          var idsToCreate = [];
          i = 0;
          for (; i < categorySetIdList.length; i++) {
            // console.log("TCL: categorySetIdList", categorySetIdList);
            var idExists = false;
            var j = 0;
            for (; j < existingEntries.length; j++) {
              // console.log("TCL: existingEntries", existingEntries);
              if (categorySetIdList[i].id == existingEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              idsToCreate.push(categorySetIdList[i].id);
              categorySetIdList.splice(i,1);
              i--; // so the next list item is not jumped over due to the splicing
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
            var i = 0;
            for (; i < idsToCreate.length; i++) {
              var newCategorySetHasCategory = {
                categorySetHasCategories: [],
                categorySetHasCategory: null,
                id: {
                  categorySetId: categorySet.id,
                  categoryId: idsToCreate[i]
                }
              };
              // categorySet.categorySetHasCategories.push({id: {categorySetId: categorySet.id, categoryId: idsToCreate[i]}});
              // console.log("TCL: newCategorySetHasCategory", newCategorySetHasCategory);
              await TIMAAT.CategorySetService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
            }
          }
          //* the splicing in remove and add sections reduced both id lists to the same entries remaining to compute
          // UPDATE changed entries // TODO activate once categorySet-category connection contains data
          // i = 0;
          // for (; i < categorySetIdList.length; i++) {
          //   console.log("TCL: categorySetIdList", categorySetIdList);
          //   var updateCategorySetHasCategory = {
          //     categorySetHasCategories: [],
          //     categorySetHasCategory: null,
          //     id: {
          //       categorySetId: categorySet.id,
          //       categoryId: categorySetIdList[i].id
          //     }
          //   };
          //   await TIMAAT.CategorySetService.updateCategorySetHasCategory(updateCategorySetHasCategory) // TODO categorySetHasCategory data
          // }
        }
      } catch(error) {
        console.error("ERROR: ", error);
      };
      
      await TIMAAT.UI.refreshDataTable('category');
      await TIMAAT.UI.refreshDataTable('categorySet');
    },

    updateMediumAnalysisListHasCategorySetsList: async function(mediumAnalysisListModel, categorySetIdList) {
    	// console.log("TCL: mediumAnalysisListModel, categorySetIdList", mediumAnalysisListModel, categorySetIdList);
			try {
				var existingMediumAnalysisListHasCategorySetsEntries = await TIMAAT.AnalysisListService.getCategorySetList(mediumAnalysisListModel.id);
        // console.log("TCL: existingMediumAnalysisListHasCategorySetsEntries", existingMediumAnalysisListHasCategorySetsEntries);
        if (categorySetIdList == null || categorySetIdList.length == 0) { //* all entries will be deleted
          // console.log("TCL: delete all entries");
					mediumAnalysisListModel.categorySets = [];
          await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
          // remove categories from annotations that belong to those category sets (= all)
          var i = 0;
          for (; i < mediumAnalysisListModel.annotations.length; i++) {
            await this.updateElementHasCategoriesList(mediumAnalysisListModel.annotations[i], null, 'annotation');
          }
        } else if (existingMediumAnalysisListHasCategorySetsEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add  all entries");
					mediumAnalysisListModel.categorySets = categorySetIdList;
					await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
        } else { //* delete removed entries
          // console.log("TCL: add/delete entries");
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
              // console.log("TCL: deleteId", deleteId);
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
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							mediumAnalysisListModel.categorySets.push(idsToCreate[i]);
							await TIMAAT.AnalysisListService.addCategorySet(mediumAnalysisListModel.id, idsToCreate[i].id);
						}
          }
          await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
          //! TODO check if annotationList or curAnalysisList.annotations should be checked here
          // console.log("TCL: TIMAAT.VideoPlayer.annotationList", TIMAAT.VideoPlayer.annotationList);
          var i = 0;
          for (; i < TIMAAT.VideoPlayer.annotationList.length; i++) {
            TIMAAT.VideoPlayer.selectAnnotation(TIMAAT.VideoPlayer.annotationList[i]);
            TIMAAT.VideoPlayer.curAnnotation.updateUI();
          }
          TIMAAT.VideoPlayer.curAnnotation = null;
        }
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return mediumAnalysisListModel;
    },
    
    updateElementHasCategoriesList: async function(model, categoryIdList, type) {
    	// console.log("TCL: model, categoryIdList, type", model, categoryIdList, type);
      var existingEntries;
			try {
        switch(type) {
          case 'annotation':
            existingEntries = await TIMAAT.AnnotationService.getSelectedCategories(model.id);
          break;
          case 'segment':
          case 'sequence':
          case 'take':
          case 'scene':
          case 'action':
            existingEntries = await TIMAAT.AnalysisListService.getSelectedCategories(model.id, type);
          break;
        }
				
        // console.log("TCL: existingEntries", existingEntries);
        if (categoryIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all categories");
					model.categories = [];
          switch(type) {
            case 'annotation':
              await TIMAAT.AnnotationService.updateAnnotation(model);
            break;
            case 'segment':
            case 'sequence':
            case 'take':
            case 'scene':
            case 'action':
              await TIMAAT.AnalysisListService.updateSegmentElement(type, model);
            break;
          }
        } else if (existingEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all categories");
					model.categories = categoryIdList;
          switch(type) {
            case 'annotation':
              await TIMAAT.AnnotationService.updateAnnotation(model);
            break;
            case 'segment':
            case 'sequence':
            case 'take':
            case 'scene':
            case 'action':
              await TIMAAT.AnalysisListService.updateSegmentElement(type, model);
            break;
          }
        } else { //* delete removed entries
          // console.log("TCL: add/delete categories");
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < categoryIdList.length; j++) {
							if (existingEntries[i].id == categoryIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingAnnotationHasCategoryEntries but not in categoryIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingEntries[i]);
							existingEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = model.categories.findIndex(({id}) => id === entriesToDelete[i].id);
							model.categories.splice(index,1);
              switch(type) {
                case 'annotation':
                  await TIMAAT.AnnotationService.removeCategory(model.id, entriesToDelete[i].id);
                break;
                case 'segment':
                case 'sequence':
                case 'take':
                case 'scene':
                case 'action':
                  await TIMAAT.AnalysisListService.removeCategory(model.id, entriesToDelete[i].id, type);
                break;
              }
						}
					}
					//* add existing categories
					var idsToCreate = [];
          i = 0;
          for (; i < categoryIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingEntries.length; j++) {
              if (categoryIdList[i].id == existingEntries[j].id) {
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
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							model.categories.push(idsToCreate[i]);
              switch(type) {
                case 'annotation':
                  await TIMAAT.AnnotationService.addCategory(model.id, idsToCreate[i].id);
                break;
                case 'segment':
                case 'sequence':
                case 'take':
                case 'scene':
                case 'action':
                  await TIMAAT.AnalysisListService.addCategory(model.id, idsToCreate[i].id, type);
                break;
              }
						}
          }
        }
        switch (type) {
          case 'annotation':
            TIMAAT.VideoPlayer.curAnnotation.updateUI();
          break;
          case 'segment':
            TIMAAT.VideoPlayer.curSegment.updateUI();
          break;
          case 'sequence':
            TIMAAT.VideoPlayer.curSequence.updateUI();
          break;
          case 'take':
            TIMAAT.VideoPlayer.curTake.updateUI();
          break;
          case 'scene':
            TIMAAT.VideoPlayer.curScene.updateUI();
          break;
          case 'action':
            TIMAAT.VideoPlayer.curAction.updateUI();
          break;
        }
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return model;
		},

    initFormDataSheetForEdit: function(type) {
      $('#category-metadata-form :input').prop('disabled', false);
      $('#categoryset-metadata-form :input').prop('disabled', false);
      this.hideFormButtons();
      $('.form-submit-button').show();
      $('.form-dismiss-button').show();
      if (type == 'category') {
        $('#timaat-category-metadata-name').focus();
        this.hideAddCategoryButton();
      } else {
        $('#timaat-categoryset-metadata-name').focus();
        this.hideAddCategorySetButton();
      }
    },

    initFormsForShow: function() {
      $('.form-buttons').prop('disabled', false);
      $('.form-buttons :input').prop('disabled', false);
      $('.form-buttons').show();
      $('.form-submit-button').hide();
      $('.form-dismiss-button').hide();
		},

    initFormDataSheetData: function(type) {
      $('.datasheet-data').hide();
      $('.name-data').show();
      if (type == 'category') {
        $('.category-data').show();
      } else {
        $('.categoryset-data').show();
      }
    },

    hideFormButtons: function() {
      $('.form-buttons').hide();
			$('.form-buttons').prop('disabled', true);
			$('.form-buttons :input').prop('disabled', true);
    },

    showAddCategoryButton: function() {
      $('.add-category-button').prop('disabled', false);
      $('.add-category-button :input').prop('disabled', false);
      $('.add-category-button').show();
    },

    hideAddCategoryButton: function() {
      $('.add-category-button').hide();
      $('.add-category-button').prop('disabled', true);
      $('.add-category-button :input').prop('disabled', true);
    },

    showAddCategorySetButton: function() {
      $('.add-categoryset-button').prop('disabled', false);
      $('.add-categoryset-button :input').prop('disabled', false);
      $('.add-categoryset-button').show();
    },

    hideAddCategorySetButton: function() {
      $('.add-categoryset-button').hide();
			$('.add-categoryset-button').prop('disabled', true);
			$('.add-categoryset-button :input').prop('disabled', true);
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

	}
	
}, window));
