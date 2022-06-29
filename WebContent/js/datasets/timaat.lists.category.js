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
      $('#categoryTab').on('click', function(event) {
        TIMAAT.CategoryLists.loadCategories();
        TIMAAT.UI.displayComponent('category', 'categoryTab', 'categoryDataTable');
        TIMAAT.URLHistory.setURL(null, 'Category Datasets', '#category/list');
      });

      // edit content form button handler
      $('#categoryFormMetadataEditButton').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#categoryFormMetadata').data('category'), 'category', 'edit');
			});

            // submit content form button functionality
			$('#categoryFormMetadataSubmitButton').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();
				if (!$('#categoryFormMetadata').valid()) return false;

				// the original category or category set model (in case of editing an existing category or category set)
				var category = $('#categoryFormMetadata').data('category');

				// create/edit category or category set window submitted data
				var formDataRaw = $('#categoryFormMetadata').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });

        // var duplicate = await TIMAAT.CategorySetService.checkForDuplicate(formDataObject.name);
        // if (duplicate && categorySet.model.name != formDataObject.name) { // duplicate category set name entered
        //   $('#categoryListCategorySetDuplicateModal').modal('show');
        // }
        // else {
        delete formDataObject.categorySetId;
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

        if (category) { // update category
          category.model.name = formDataObject.name;
          let categoryData = category.model;
          delete categoryData.ui;
          await TIMAAT.CategoryLists.updateCategory(categoryData, categorySetIdList);
          // category.updateUI();
        }
        else { // create new category
          var categoryModel = await TIMAAT.CategoryLists.createCategoryModel(formDataObject);
          var newCategory = await TIMAAT.CategoryService.createCategory(categoryModel);
          let i = 0;
          for (; i < categorySetIdList.length; i++) {
            var newCategorySetHasCategory = {
              id: {
                categoryId: newCategory.id,
                categorySetId: categorySetIdList[i].id
              }
            };
            await TIMAAT.CategorySetService.createCategorySetHasCategory(newCategorySetHasCategory);
            newCategory.categorySetHasCategories.push(newCategorySetHasCategory);
          }
          category = new TIMAAT.Category(newCategory);
          $('#categoryFormMetadata').data('category', category);
          $('#listsTabMetadata').data('type', 'category');
          $('#listsTabMetadata').trigger('click');
        }
        TIMAAT.CategoryLists.showAddCategoryButton();
        await TIMAAT.UI.refreshDataTable('category');
        TIMAAT.UI.addSelectedClassToSelectedItem('category', category.model.id);
        TIMAAT.UI.displayDataSetContent('dataSheet', category, 'category');
        // }
			});

      // delete button (in form) handler
      $('#categoryFormMetadataDeleteButton').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#categoryListCategoryDeleteModal').data('category', $('#categoryFormMetadata').data('category'));
        $('#categoryListCategoryDeleteModal').modal('show');
      });

      // confirm delete category modal functionality
      $('#categoryListCategoryDeleteModalSubmitButton').on('click', async function(ev) {
        var modal = $('#categoryListCategoryDeleteModal');
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
            // await TIMAAT.UI.refreshDataTable('categorySet');
            await TIMAAT.UI.refreshDataTable('category');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        // TIMAAT.CategoryLists.loadCategories();
        $('#categoryTab').trigger('click');
      });

      // cancel add/edit button in content form functionality
			$('#categoryFormMetadataDismissButton').on('click', async function(event) {
        TIMAAT.CategoryLists.showAddCategoryButton();
        let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#categoryTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

      // inspector event handler
      $('#annotationCategoryFormSubmitButton').on('click', async function(event) {
        event.preventDefault();
        if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
          $('#analysisListNoPermissionModal').modal('show');
          return;
        }
        // console.log("TCL: Submit Categories for analysis list");
        // var modal = $('#annotationDatasetsAnnotationCategories');
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
        // $('#mediumFormMetadata').data('annotation', annotation);
      });

      // inspector event handler
      $('#annotationCategoryFormDismissButton').on('click', async function(event) {
        // event.preventDefault();
        $('#annotationCategoriesMultiSelectDropdown').val(null).trigger('change');
        $('#annotationCategoriesMultiSelectDropdown').select2('destroy');
        $('#annotationCategoriesMultiSelectDropdown').find('option').remove();

        $('#annotationCategoriesMultiSelectDropdown').select2({
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
          var categorySelect = $('#annotationCategoriesMultiSelectDropdown');
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
      $('#segmentElementCategoryFormSubmitButton').on('click', async function(event) {
        event.preventDefault();
        if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
          $('#analysisListNoPermissionModal').modal('show');
          return;
        }
        let type = $('#segmentElementCategoriesForm').data('type');
        // var modal = $('#segmentDatasetsSegmentCategories');
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
        // $('#mediumFormMetadata').data('segment', segment);
      });

      // inspector event handler
      $('#segmentElementCategoryFormDismissButton').on('click', function(event) {
        // event.preventDefault();
        $('#segmentElementCategoriesMultiSelectDropdown').val(null).trigger('change');
        $('#segmentElementCategoriesMultiSelectDropdown').select2('destroy');
        $('#segmentElementCategoriesMultiSelectDropdown').find('option').remove();
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

        $('#segmentElementCategoriesMultiSelectDropdown').select2({
          closeOnSelect: false,
          scrollAfterSelect: true,
          allowClear: true,
          ajax: {
            url: 'api/analysisList/'+type+'/'+segmentElementId+'/category/selectList/',
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
          var categorySelect = $('#segmentElementCategoriesMultiSelectDropdown');
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
      $('#categorySetTab').on('click', function(event) {
        TIMAAT.CategoryLists.loadCategorySets();
        TIMAAT.UI.displayComponent('categorySet', 'categorySetTab', 'categorySetDataTable');
        TIMAAT.URLHistory.setURL(null, 'Category Set Datasets', '#categorySet/list');
      });

      // edit content form button handler
      $('#categorySetFormMetadataEditButton').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.UI.displayDataSetContent('dataSheet', $('#categorySetFormMetadata').data('categorySet'), 'categorySet', 'edit');
			});

      // submit content form button functionality
			$('#categorySetFormMetadataSubmitButton').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();
				if (!$('#categorySetFormMetadata').valid()) return false;

				// the original category or category set model (in case of editing an existing category or category set)
				var categorySet = $('#categorySetFormMetadata').data('categorySet');

				// create/edit category or category set window submitted data
				var formDataRaw = $('#categorySetFormMetadata').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });

        var duplicate = await TIMAAT.CategorySetService.checkForDuplicate(formDataObject.name);
        if (duplicate && categorySet && categorySet.model.name != formDataObject.name || duplicate && !categorySet) { // duplicate category set name entered
          $('#categoryListCategorySetDuplicateModal').modal('show');
        }
        else {
          delete formDataObject.categoryId;
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

          if (categorySet) { // update category set
            categorySet.model.name = formDataObject.name;
            let categorySetData = categorySet.model;
            delete categorySetData.ui;
            await TIMAAT.CategoryLists.updateCategorySet(categorySetData, categoryIdList);
          }
          else { // create new category set
            var categorySetModel = await TIMAAT.CategoryLists.createCategorySetModel(formDataObject);
            var newCategorySet = await TIMAAT.CategorySetService.createCategorySet(categorySetModel);
            let i = 0;
            for (; i < categoryIdList.length; i++) {
              var newCategorySetHasCategory = {
                id: {
                  categoryId: categoryIdList[i].id,
                  categorySetId: newCategorySet.id
                }
              };
              await TIMAAT.CategorySetService.createCategorySetHasCategory(newCategorySetHasCategory);
              newCategorySet.categorySetHasCategories.push(newCategorySetHasCategory);
            }
            categorySet = new TIMAAT.CategorySet(newCategorySet);
            $('#categorySetFormMetadata').data('categorySet', categorySet);
            $('#listsTabMetadata').data('type', 'categorySet');
            $('#listsTabMetadata').trigger('click');
          }
        }
        TIMAAT.CategoryLists.showAddCategorySetButton();
        await TIMAAT.UI.refreshDataTable('categorySet');
        TIMAAT.UI.addSelectedClassToSelectedItem('categorySet', categorySet.model.id);
        TIMAAT.UI.displayDataSetContent('dataSheet', categorySet, 'categorySet');
			});

      // delete button (in form) handler
      $('#categorySetFormMetadataDeleteButton').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#categoryListCategorySetDeleteModal').data('categorySet', $('#categorySetFormMetadata').data('categorySet'));
        $('#categoryListCategorySetDeleteModal').modal('show');
      });

      // confirm delete category set modal functionality
      $('#categoryListCategorySetDeleteModalSubmitButton').on('click', async function(ev) {
        var modal = $('#categoryListCategorySetDeleteModal');
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
            // await TIMAAT.UI.refreshDataTable('category');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        modal.modal('hide');
        TIMAAT.UI.hideDataSetContentContainer();
        // TIMAAT.CategoryLists.loadCategorySets();
        $('#categorySetTab').trigger('click');
      });

      // cancel add/edit button in content form functionality
			$('#categorySetFormMetadataDismissButton').on('click', async function(event) {
        TIMAAT.CategoryLists.showAddCategorySetButton();
        let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
			});

      // data table events
			$('#categorySetTable').on( 'page.dt', function () {
				$('.dataTables_scrollBody').scrollTop(0);
			});

      // inspector event handler
      $('#analysisCategorySetFormSubmitButton').on('click', async function(event) {
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
        var annotationsUseCategorySet = false;
        var annotationInBothLists = false;
        if (categorySetIdList.length < mediumAnalysisList.categorySets.length) {
          annotationsUseCategorySet = true;
          // console.log("TCL: list contains less sets than before.");
        } else {
          i = 0;
          var j = 0;
          for (; i < mediumAnalysisList.categorySets.length; i++) {
            annotationInBothLists = false;
            for (; j < categorySetIdList.length; j++) {
              if (mediumAnalysisList.categorySets[i].id == categorySetIdList[j].id) {
                annotationInBothLists = true;
                // console.log("TCL: match found!");
                break;
              }
            }
            if (!annotationInBothLists) {
              // console.log("TCL mediumAnalysisList.categorySets[i].id not available anymore", mediumAnalysisList.categorySets[i].id);
              annotationsUseCategorySet = true;
              break;
            }
          }
        }
        if (annotationsUseCategorySet) {
          // console.log("TCL: $ -> annotationsUseCategorySet", annotationsUseCategorySet);
          $('#mediumAnalysisCategorySetInUseModal').data('mediumAnalysisList', mediumAnalysisList);
          $('#mediumAnalysisCategorySetInUseModal').data('categorySetIdList', categorySetIdList);
          $('#mediumAnalysisCategorySetInUseModal').modal('show');
        } else
        mediumAnalysisList = await TIMAAT.CategoryLists.updateMediumAnalysisListHasCategorySetsList(mediumAnalysisList, categorySetIdList);
      });

      // inspector event handler
      $('#mediumAnalysisCategorySetInUseModalConfirmButton').on('click', async function(event) {
        var modal = $('#mediumAnalysisCategorySetInUseModal');
        var mediumAnalysisList = modal.data('mediumAnalysisList');
        var categorySetIdList = modal.data('categorySetIdList');
        await TIMAAT.CategoryLists.updateMediumAnalysisListHasCategorySetsList(mediumAnalysisList, categorySetIdList);
        modal.modal('hide');
      });

      // inspector event handler
      $('#analysisCategorySetFormDismissButton').on('click', async function(event) {
        // event.preventDefault();
        $('#AnalysisCategorySetsMultiSelectDropdown').val(null).trigger('change');
        $('#AnalysisCategorySetsMultiSelectDropdown').select2('destroy');
        $('#AnalysisCategorySetsMultiSelectDropdown').find('option').remove();

        $('#AnalysisCategorySetsMultiSelectDropdown').select2({
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
          var categorySetSelect = $('#AnalysisCategorySetsMultiSelectDropdown');
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
      $('#listsTabMetadata').data('type', 'category');
      TIMAAT.UI.addSelectedClassToSelectedItem('category', null);
      TIMAAT.UI.subNavTab = 'dataSheet';
      this.showAddCategoryButton();
      this.setCategoriesList();
		},

		loadCategorySets: function() {
      $('#listsTabMetadata').data('type', 'categorySet');
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
      // setup dataTable
      this.dataTableCategories = $('#categoryTable').DataTable({
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
        "initComplete": async function( settings, json ) {
					TIMAAT.CategoryLists.dataTableCategories.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let index = i+1;
							let position = $('table tbody > tr:nth-child('+index+')').position();
							if (position) {
                $('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedCategoryId) {
						TIMAAT.UI.clearLastSelection('category');
						$(row).addClass('selected');
            TIMAAT.UI.selectedCategoryId = data.id; //* as it is set to null in clearLastSelection
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
      // setup dataTable
      this.dataTableCategorySets = $('#categorySetTable').DataTable({
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
        "initComplete": async function( settings, json ) {
					TIMAAT.CategoryLists.dataTableCategorySets.draw(); //* to scroll to selected row
				},
				"drawCallback": function( settings ) {
					let api = this.api();
					let i = 0;
					for (; i < api.context[0].aoData.length; i++) {
						if ($(api.context[0].aoData[i].nTr).hasClass('selected')) {
							let index = i+1;
							let position = $('table tbody > tr:nth-child('+index+')').position();
							if (position) {
								$('.dataTables_scrollBody').animate({
									scrollTop: api.context[0].aoData[i].nTr.offsetTop
								},100);
							}
						}
					}
				},
        "rowCallback": function( row, data ) {
					// console.log("TCL: row, data", row, data);
					if (data.id == TIMAAT.UI.selectedCategorySetId) {
						TIMAAT.UI.clearLastSelection('categorySet');
						$(row).addClass('selected');
            TIMAAT.UI.selectedCategorySetId = data.id; //* as it is set to null in clearLastSelection
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
				TIMAAT.UI.displayDataSetContentContainer('categoryDataTab', 'categoryFormMetadata', type);
      } else {
        TIMAAT.UI.displayDataSetContentContainer('categorySetDataTab', 'categorySetFormMetadata', type);
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
          $('#categoryFormMetadata').data(type, selectedItem);
          this.showAddCategoryButton();
				break;
				case 'categorySet':
					index = this.categorySets.findIndex(({model}) => model.id === selectedItemId);
					selectedItem = this.categorySets[index];
          $('#categorySetFormMetadata').data(type, selectedItem);
          this.showAddCategorySetButton();
			break;
			}
      $('#listsTabMetadata').data('type', type);
      TIMAAT.UI.addSelectedClassToSelectedItem(type, selectedItemId);
      TIMAAT.URLHistory.setURL(null, selectedItem.model.name + ' · Datasets · ' + type[0].toUpperCase() + type.slice(1), '#'+type+'/' + selectedItem.model.id);
			TIMAAT.UI.displayDataSetContent('dataSheet', selectedItem, type);
		},

		addCategory: function() {
			// console.log("TCL: addCategory()");
      TIMAAT.UI.displayDataSetContentContainer('listsTabMetadata', 'categoryFormMetadata');
			$('#listsTabMetadata').data('type', 'category');
      $('#categoryFormMetadata').data('category', null);
      $('#categorySetsMultiSelectDropdown').val(null).trigger('change');
      var node = document.getElementById('dynamicCategoryIsPartOfCategorySetFields');
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
      categoryOrCategorySetFormMetadataValidator.resetForm();

      TIMAAT.UI.addSelectedClassToSelectedItem('category', null);

      // setup form
			$('#categoryFormMetadata').trigger('reset');
      this.initFormDataSheetData('category');
      this.initFormDataSheetForEdit('category');
      $('#categoryFormMetadataSubmitButton').html("Add");
      $('#categoryFormHeader').html("Add category");

      $('#dynamicCategoryIsPartOfCategorySetFields').append(this.appendCategoryIsPartOfCategorySetsDataset());
      $('#categorySetsMultiSelectDropdown').select2({
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
		},

    addCategorySet: function() {
			// console.log("TCL: addCategorySet()");
      TIMAAT.UI.displayDataSetContentContainer('listsTabMetadata', 'categorySetFormMetadata');
			$('#listsTabMetadata').data('type', 'categorySet');
      $('#categorySetFormMetadata').data('categorySet', null);
      $('#categoriesMultiSelectDropdown').val(null).trigger('change');
      var node = document.getElementById('dynamicCategorySetContainsCategoryFields');
			while (node.lastChild) {
				node.removeChild(node.lastChild);
      }
      categoryOrCategorySetFormMetadataValidator.resetForm();

      TIMAAT.UI.addSelectedClassToSelectedItem('categorySet', null);

      // setup form
			$('#categorySetFormMetadata').trigger('reset');
      this.initFormDataSheetData('categorySet');
      this.initFormDataSheetForEdit('categorySet');
      $('#categorySetFormMetadataSubmitButton').html("Add");
      $('#categorySetFormHeader').html("Add category set");

      $('#dynamicCategorySetContainsCategoryFields').append(this.appendCategorySetContainsCategoriesDataset());
      $('#categoriesMultiSelectDropdown').select2({
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
		},

		categoryFormDataSheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      var node = document.getElementById('dynamicCategoryIsPartOfCategorySetFields');
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }

      // TIMAAT.UI.addSelectedClassToSelectedItem('category', data.model.id);
      $('#categoryFormMetadata').trigger('reset');
      $('#listsTabMetadata').data('type', 'category');
      this.initFormDataSheetData('category');
      categoryOrCategorySetFormMetadataValidator.resetForm();

      $('#dynamicCategoryIsPartOfCategorySetFields').append(this.appendCategoryIsPartOfCategorySetsDataset());
      $('#categorySetsMultiSelectDropdown').select2({
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
      var categorySetSelect = $('#categorySetsMultiSelectDropdown');
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
        $('#categoryFormMetadata :input').prop('disabled', true);
        this.initFormsForShow();
        $('#categoryFormHeader').html("Category Data Sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit('category');
        $('#categoryFormMetadataSubmitButton').html("Save");
        $('#categoryFormHeader').html("Edit Category");
      }
      // name data
      $('#categoryMetadataName').val(data.model.name);

      $('#categoryFormMetadata').data('category', data);
    },

    categorySetFormDataSheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      var node = document.getElementById('dynamicCategorySetContainsCategoryFields');
			while (node.lastChild) {
				node.removeChild(node.lastChild);
      }

      // TIMAAT.UI.addSelectedClassToSelectedItem('categorySet', data.model.id);
      $('#categorySetFormMetadata').trigger('reset');
      $('#listsTabMetadata').data('type', 'categorySet');
      this.initFormDataSheetData('categorySet');
      categoryOrCategorySetFormMetadataValidator.resetForm();

      $('#dynamicCategorySetContainsCategoryFields').append(this.appendCategorySetContainsCategoriesDataset());
      $('#categoriesMultiSelectDropdown').select2({
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
      var categorySelect = $('#categoriesMultiSelectDropdown');
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
        $('#categorySetFormMetadata :input').prop('disabled', true);
        this.initFormsForShow();
        $('#categorySetFormHeader').html("Category Set Data Sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        this.initFormDataSheetForEdit('categorySet');
        $('#categorySetFormMetadataSubmitButton').html("Save");
        $('#categorySetFormHeader').html("Edit Category Set");
      }
      // name data
      $('#categorySetMetadataName').val(data.model.name);

      $('#categorySetFormMetadata').data('categorySet', data);
    },

    createCategoryModel: async function(formDataObject) {
      // console.log("TCL: createCategoryModel - formDataObject", formDataObject);
      let model = {
        id: 0,
        name: formDataObject.name,
        categorySetHasCategories: []
      };
      return model;
    },

    createCategorySetModel: async function(formDataObject) {
      // console.log("TCL: createCategorySetModel - formDataObject", formDataObject);
      let model = {
        id: 0,
        name: formDataObject.name,
        categorySetHasCategories: []
      };
      return model;
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
      // await TIMAAT.UI.refreshDataTable('categorySet');
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
            var newCategorySetHasCategory = {
              id: {
                categorySetId: categorySet.id,
                categoryId: categorySetIdList[i].id
              }
            };
            await TIMAAT.CategorySetService.createCategorySetHasCategory(newCategorySetHasCategory); // TODO categorySetHasCategory data
            categorySet.categorySetHasCategories.push({id: {categorySetId: categorySet.id, categoryId: categorySetIdList[i]}});

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

      // await TIMAAT.UI.refreshDataTable('category');
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
          let i = 0;
          for (; i < mediumAnalysisListModel.annotations.length; i++) {
            await this.updateElementHasCategoriesList(mediumAnalysisListModel.annotations[i], null, 'annotation');
          }
          // remove categories from segment structure elements that belong to those category sets (= all)
          i = 0;
          let j = 0;
          let k = 0;
          for (; i < mediumAnalysisListModel.analysisSegments.length; i++) {
            await this.updateElementHasCategoriesList(mediumAnalysisListModel.analysisSegments[i], null, 'segment');
            j = 0;
            for (; j < mediumAnalysisListModel.analysisSegments[i].analysisSequences.length; j++) {
              await this.updateElementHasCategoriesList(mediumAnalysisListModel.analysisSegments[i].analysisSequences[j], null, 'sequence');
              k = 0;
              for (; k < mediumAnalysisListModel.analysisSegments[i].analysisSequences[j].analysisTakes.length; k++) {
                await this.updateElementHasCategoriesList(mediumAnalysisListModel.analysisSegments[i].analysisSequences[j].analysisTakes[k], null, 'take');
              }
            }
            j = 0;
            for (; j < mediumAnalysisListModel.analysisSegments[i].analysisScenes.length; j++) {
              await this.updateElementHasCategoriesList(mediumAnalysisListModel.analysisSegments[i].analysisScenes[j], null, 'scene');
              k = 0;
              for (; k < mediumAnalysisListModel.analysisSegments[i].analysisScenes[j].analysisActions.length; k++) {
                await this.updateElementHasCategoriesList(mediumAnalysisListModel.analysisSegments[i].analysisScenes[j].analysisActions[k], null, 'action');
              }
            }
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
              // will also remove categories from all affected elements (annotations, segment structure elements)
              await TIMAAT.AnalysisListService.removeCategorySet(mediumAnalysisListModel.id, entriesToDelete[i].id);
            }
            // categories will be removed from annotations if corresponding category set is removed from analysisList
            i = 0;
            for (; i < mediumAnalysisListModel.annotations.length; i++) {
              mediumAnalysisListModel.annotations[i].categories = await TIMAAT.AnnotationService.getSelectedCategories(mediumAnalysisListModel.annotations[i].id);
            }
            // categories will be removed from segment structure elements if corresponding category set is removed from analysisList
            i = 0;
            let j = 0;
            let k = 0;
            for (; i < mediumAnalysisListModel.analysisSegments.length; i++) {
              mediumAnalysisListModel.analysisSegments[i].categories = await TIMAAT.AnalysisListService.getSelectedCategories(mediumAnalysisListModel.analysisSegments[i].id, 'segment');
              j = 0;
              for (; j < mediumAnalysisListModel.analysisSegments[i].analysisSequences.length; j++) {
                mediumAnalysisListModel.analysisSegments[i].analysisSequences[j].categories = await TIMAAT.AnalysisListService.getSelectedCategories(mediumAnalysisListModel.analysisSegments[i].analysisSequences[j].id, 'sequence');
                k = 0;
                for (; k < mediumAnalysisListModel.analysisSegments[i].analysisSequences[j].analysisTakes.length; k++) {
                  mediumAnalysisListModel.analysisSegments[i].analysisSequences[j].analysisTakes[k].categories = await TIMAAT.AnalysisListService.getSelectedCategories(mediumAnalysisListModel.analysisSegments[i].analysisSequences[j].analysisTakes[k].id, 'take');
                }
              }
              j = 0;
              for (; j < mediumAnalysisListModel.analysisSegments[i].analysisScenes.length; j++) {
                mediumAnalysisListModel.analysisSegments[i].analysisScenes[j].categories = await TIMAAT.AnalysisListService.getSelectedCategories(mediumAnalysisListModel.analysisSegments[i].analysisScenes[j].id, 'scene');
                k = 0;
                for (; k < mediumAnalysisListModel.analysisSegments[i].analysisScenes[j].analysisActions.length; k++) {
                  mediumAnalysisListModel.analysisSegments[i].analysisScenes[j].analysisActions[k].categories =  await TIMAAT.AnalysisListService.getSelectedCategories(mediumAnalysisListModel.analysisSegments[i].analysisScenes[j].analysisActions[k].id, 'action');
                }
              }
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
          // console.log("TCL: updateMediumAnalysisListHasCategorySetsList:function -> mediumAnalysisListModel", mediumAnalysisListModel);
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
      TIMAAT.VideoPlayer.inspector.setItem(this.curAnalysisList, 'analysisList');
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
            if (TIMAAT.VideoPlayer.curAnnotation)
              TIMAAT.VideoPlayer.curAnnotation.updateUI();
          break;
          case 'segment':
            if (TIMAAT.VideoPlayer.curSegment)
              TIMAAT.VideoPlayer.curSegment.updateUI();
          break;
          case 'sequence':
            if (TIMAAT.VideoPlayer.curSequence)
              TIMAAT.VideoPlayer.curSequence.updateUI();
          break;
          case 'take':
            if (TIMAAT.VideoPlayer.curTake)
              TIMAAT.VideoPlayer.curTake.updateUI();
          break;
          case 'scene':
            if (TIMAAT.VideoPlayer.curScene)
              TIMAAT.VideoPlayer.curScene.updateUI();
          break;
          case 'action':
            if (TIMAAT.VideoPlayer.curAction)
              TIMAAT.VideoPlayer.curAction.updateUI();
          break;
        }
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return model;
		},

    initFormDataSheetForEdit: function(type) {
      $('#categoryFormMetadata :input').prop('disabled', false);
      $('#categorySetFormMetadata :input').prop('disabled', false);
      this.hideFormButtons();
      $('.formSubmitButton').show();
      $('.formDismissButton').show();
      if (type == 'category') {
        $('#categoryMetadataName').focus();
        this.hideAddCategoryButton();
      } else {
        $('#categorySetMetadataName').focus();
        this.hideAddCategorySetButton();
      }
    },

    initFormsForShow: function() {
      $('.formButtons').prop('disabled', false);
      $('.formButtons :input').prop('disabled', false);
      $('.formButtons').show();
      $('.formSubmitButton').hide();
      $('.formDismissButton').hide();
		},

    initFormDataSheetData: function(type) {
      $('.dataSheetData').hide();
      $('.nameData').show();
      if (type == 'category') {
        $('.categoryData').show();
      } else {
        $('.categorySetData').show();
      }
    },

    hideFormButtons: function() {
      $('.formButtons').hide();
			$('.formButtons').prop('disabled', true);
			$('.formButtons :input').prop('disabled', true);
    },

    showAddCategoryButton: function() {
      $('.addCategoryButton').prop('disabled', false);
      $('.addCategoryButton :input').prop('disabled', false);
      $('.addCategoryButton').show();
    },

    hideAddCategoryButton: function() {
      $('.addCategoryButton').hide();
      $('.addCategoryButton').prop('disabled', true);
      $('.addCategoryButton :input').prop('disabled', true);
    },

    showAddCategorySetButton: function() {
      $('.addCategorySetButton').prop('disabled', false);
      $('.addCategorySetButton :input').prop('disabled', false);
      $('.addCategorySetButton').show();
    },

    hideAddCategorySetButton: function() {
      $('.addCategorySetButton').hide();
			$('.addCategorySetButton').prop('disabled', true);
			$('.addCategorySetButton :input').prop('disabled', true);
    },

    appendCategoryIsPartOfCategorySetsDataset: function() {
      var isPartOfCategorySetFormData =
      `<div class="form-group" data-role="categoryIsPartOfCategorySetEntry">
        <div class="form-row">
          <div class="col-md-12">
            <label class="sr-only">Is part of CategorySet(s)</label>
            <select class="form-control form-control-sm"
                    id="categorySetsMultiSelectDropdown"
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
      `<div class="form-group" data-role="categorySetContainsCategoryEntry">
        <div class="form-row">
          <div class="col-md-12">
            <label class="sr-only">Contains Category(s)</label>
            <select class="form-control form-control-sm"
                    id="categoriesMultiSelectDropdown"
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
