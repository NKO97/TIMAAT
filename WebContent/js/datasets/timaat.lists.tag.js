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

	TIMAAT.TagLists = {
    tags: null,

		init: function() {
      // console.log("TCL: init: function()");
			TIMAAT.TagLists.initTags();
			// $('.dataTables').hide();
			// $('.tagDataTable').show();
    },

		initTags: function() {
      // console.log("TCL: initTags: function()");
      // nav-bar functionality
      $('#tag-tab-tag-metadata-form').on('click',function(event) {
        // $('.tagsDataTabs').show();
        $('.nav-tabs a[href="#tagDataSheet"]').tab('show');
        $('.form').hide();
        $('#tagListsFormMetadata').show();
        TIMAAT.TagLists.tagFormDataSheet('show', $('#tagListsFormMetadata').data('tag'));
      });

      // confirm delete tag modal functionality
      $('#tagListsTagDeleteSubmitButton').on('click', async function(ev) {
        var modal = $('#tagListsTagDeleteModal');
        var tag = modal.data('tag');
        if (tag) {
          try {
            await TIMAAT.TagLists._tagRemoved('tag', tag);
          } catch(error) {
            console.error("ERROR: ", error);
          }
          try {
            await TIMAAT.UI.refreshDataTable('tag');
          } catch(error) {
            console.error("ERROR: ", error);
          }
        }
        modal.modal('hide');
        $('#tagListsFormMetadata').hide();
        $('.form').hide();
      });

      // add tag button functionality (in tag list - opens data sheet form)
      $('#tagListsTagAddButton').on('click', function(event) {
        // console.log("TCL: add tag");
        $('#tagListsFormMetadata').data('tag', null);
        TIMAAT.TagLists.addTag();
      });

			// delete button (in form) handler
      $('#tagListsFormMetadataDelete').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        $('#tagListsTagDeleteModal').data('tag', $('#tagListsFormMetadata').data('tag'));
        $('#tagListsTagDeleteModal').modal('show');
			});

			// edit content form button handler
      $('#tagListsFormMetadataEdit').on('click', function(event) {
        event.stopPropagation();
        TIMAAT.UI.hidePopups();
        TIMAAT.TagLists.tagFormDataSheet('edit', $('#tagListsFormMetadata').data('tag'));
			});

      // submit content form button functionality
			$('#tagListsFormMetadataSubmit').on('click', async function(event) {
				// continue only if client side validation has passed
        event.preventDefault();
				if (!$('#tagListsFormMetadata').valid()) return false;

				// the original tag model (in case of editing an existing tag)
				var tag = $('#tagListsFormMetadata').data('tag');
        // console.log("TCL: tag", tag);

				// create/edit tag window submitted data
				var formDataRaw = $('#tagListsFormMetadata').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var formDataObject = {};
        $(formDataRaw).each(function(i, field){
					formDataObject[field.name] = field.value;
        });
        // console.log("TCL: formDataObject", formDataObject);
        var duplicateName = await TIMAAT.TagService.checkForDuplicateName(formDataObject.name);
        var duplicateCode = await TIMAAT.TagService.checkForDuplicateCode(formDataObject.code);
        if (!duplicateName && !duplicateCode || tag) {
          if (tag) { // update tag
            if (tag.model.id != 1) { //* Do not change 'default' entry
              // console.log("TCL: tag", tag);
              tag.model.name = formDataObject.name;
              tag.model.code = formDataObject.code;
              let tagData = tag.model;
              delete tagData.ui;
              await TIMAAT.TagLists.updateTag(tagData);
              // tag.updateUI();
            }
          }
          else { // create new tag
            var tagModel = await TIMAAT.TagLists.createTagModel(formDataObject);
            // console.log("TCL: tagModel", tagModel);
            var newTag = await TIMAAT.TagLists.createTag(tagModel);
            tag = new TIMAAT.Tag(newTag);
          }
          await TIMAAT.UI.refreshDataTable('tag');
          TIMAAT.TagLists.tagFormDataSheet('show', tag);
        }
        else {// duplicate tag name or code entered
          $('#tagListsTagDuplicateModal').modal('show');
        }
			});

			// cancel add/edit button in content form functionality
			$('#tagListsFormMetadataDismiss').on('click', function(event) {
				var tag = $('#tagListsFormMetadata').data('tag');
				if (tag != null) {
					TIMAAT.TagLists.tagFormDataSheet('show', tag);
				} else { // dismiss tag creation
					$('.form').hide();
				}
			});

      // inspector event handler
      $('#mediumAnalysisTagFormSubmitButton').on('click', async function(event) {
        event.preventDefault();
				// console.log("TCL: Submit Tags for analysis list");
				// var modal = $('#analysisListDatasetsMediumAnalysisListTags');
				if (!$('#mediumAnalysisListTagsForm').valid())
					return false;
				var mediumAnalysisList = TIMAAT.VideoPlayer.curAnalysisList;
        // console.log("TCL: Inspector -> constructor -> mediumAnalysisList", mediumAnalysisList);
				var formDataRaw = $('#mediumAnalysisListTagsForm').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
				var i = 0;
				var tagIdList = [];
				var newTagList = [];
				for (; i < formDataRaw.length; i++) {
					if (isNaN(Number(formDataRaw[i].value))) {
						newTagList.push( { id: 0, name: formDataRaw[i].value} ); // new tags that have to be added to the system first
					} else {
						tagIdList.push( {id: formDataRaw[i].value} );
					}
        }
        // console.log("TCL: tagIdList", tagIdList);
				mediumAnalysisList = await TIMAAT.TagLists.updateMediumAnalysisListHasTagsList(mediumAnalysisList, tagIdList);
				if (newTagList.length > 0) {
					var updatedMediumAnalysisList = await TIMAAT.TagLists.createNewTagsAndAddToMediumAnalysisList(mediumAnalysisList, newTagList);
					// console.log("TCL: updatedMediumAnalysisList", updatedMediumAnalysisList);
					mediumAnalysisList.tags = updatedMediumAnalysisList.tags;
				}
				// $('#mediumFormMetadata').data('mediumAnalysisList', mediumAnalysisList);
			});

      // inspector event handler
			$('#mediumAnalysisTagFormDismissButton').on('click', function(event) {
        // event.preventDefault();
        $('#mediumAnalysisTagsMultiSelectDropdown').val(null).trigger('change');
        $('#mediumAnalysisTagsMultiSelectDropdown').select2('destroy');
        $('#mediumAnalysisTagsMultiSelectDropdown').find('option').remove();

				$('#mediumAnalysisTagsMultiSelectDropdown').select2({
					closeOnSelect: false,
					scrollAfterSelect: true,
					allowClear: true,
					tags: true,
					tokenSeparators: [',', ' '],
					ajax: {
						url: 'api/tag/selectList/',
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
				TIMAAT.AnalysisListService.getTagList(TIMAAT.VideoPlayer.curAnalysisList.id).then(function(data) {
					// console.log("TCL: then: data", data);
					var tagSelect = $('#mediumAnalysisTagsMultiSelectDropdown');
					if (data.length > 0) {
						data.sort((a, b) => (a.name > b.name)? 1 : -1);
						// create the options and append to Select2
						var i = 0;
						for (; i < data.length; i++) {
							var option = new Option(data[i].name, data[i].id, true, true);
							tagSelect.append(option).trigger('change');
						}
						// manually trigger the 'select2:select' event
						tagSelect.trigger({
							type: 'select2:select',
							params: {
								data: data
							}
						});
					}
				});
			});

      // inspector event handler
      $('#annotationTagFormSubmitButton').on('click', async function(event) {
        event.preventDefault();
        if (TIMAAT.VideoPlayer.currentPermissionLevel < 2) {
          $('#analysisListNoPermissionModal').modal('show');
          return;
        }
        // console.log("TCL: Submit Tags for analysis list");
        // var modal = $('#annotationDatasetsAnnotationTagsModal');
        if (!$('#annotationFormTags').valid())
          return false;
        var annotation = TIMAAT.VideoPlayer.curAnnotation;
        // console.log("TCL: Inspector -> constructor -> annotation", annotation);
        var formDataRaw = $('#annotationFormTags').serializeArray();
        // console.log("TCL: formDataRaw", formDataRaw);
        var i = 0;
        var tagIdList = [];
        var newTagList = [];
        for (; i < formDataRaw.length; i++) {
          if (isNaN(Number(formDataRaw[i].value))) {
            newTagList.push( { id: 0, name: formDataRaw[i].value} ); // new tags that have to be added to the system first
          } else {
            tagIdList.push( {id: formDataRaw[i].value} );
          }
        }
        // console.log("TCL: tagIdList", tagIdList);
        annotation.model = await TIMAAT.TagLists.updateAnnotationHasTagsList(annotation.model, tagIdList);
        if (newTagList.length > 0) {
          var updatedAnnotationModel = await TIMAAT.TagLists.createNewTagsAndAddToAnnotation(annotation.model, newTagList);
          // console.log("TCL: updatedAnnotationModel", updatedAnnotationModel);
          annotation.model.tags = updatedAnnotationModel.tags;
        }
        // $('#mediumFormMetadata').data('annotation', annotation);
      });

      // inspector event handler
      $('#annotationFormTagDismissButton').on('click', function(event) {
        event.preventDefault();
        $('#annotationTagsMultiSelectDropdown').val(null).trigger('change');
        $('#annotationTagsMultiSelectDropdown').select2('destroy');
        $('#annotationTagsMultiSelectDropdown').find('option').remove();

        $('#annotationTagsMultiSelectDropdown').select2({
          closeOnSelect: false,
          scrollAfterSelect: true,
          allowClear: true,
          tags: true,
          tokenSeparators: [',', ' '],
          ajax: {
            url: 'api/tag/selectList/',
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
        TIMAAT.AnnotationService.getTagList(TIMAAT.VideoPlayer.curAnnotation.model.id).then(function(data) {
          // console.log("TCL: then: data", data);
          var tagSelect = $('#annotationTagsMultiSelectDropdown');
          if (data.length > 0) {
            data.sort((a, b) => (a.name > b.name)? 1 : -1);
            // create the options and append to Select2
            var i = 0;
            for (; i < data.length; i++) {
              var option = new Option(data[i].name, data[i].id, true, true);
              tagSelect.append(option).trigger('change');
            }
            // manually trigger the 'select2:select' event
            tagSelect.trigger({
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
    // console.log("TCL: load: function()");
			TIMAAT.TagLists.loadTags();
		},

		loadTags: function() {
    // console.log("TCL: loadTags: function()");
			// $('.dataTables').hide();
			$('.tagDataTable').show();
			TIMAAT.TagLists.setTagList();
		},

		loadTagsDataTables: function() {
			// console.log("TCL: loadTagsDataTables: function()");
      TIMAAT.TagLists.setupTagDataTable();
		},

		setTagList: function() {
      // console.log("TCL: setTagList: function()");
			$('.form').hide();
			$('.tagsDataTabs').hide();
			if ( TIMAAT.TagLists.tags == null) return;
      // console.log("TCL: TIMAAT.TagLists.tags", TIMAAT.TagLists.tags);

			$('#tagListLoader').remove();
			// clear old UI list
			$('#tagList').empty();

			// set ajax data source
			if ( TIMAAT.TagLists.dataTableTags ) {
				TIMAAT.TagLists.dataTableTags.ajax.reload(null, false);
			}
		},

		setupTagDataTable: function() {
      // console.log("TCL: setupTagDataTable");
      // setup dataTable
      TIMAAT.TagLists.dataTableTags = $('#tagListsTagDataTable').DataTable({
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
          "url"        : "api/tag/list",
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
            var langs = Array();
            data.data.forEach(function(tag) {
              if ( tag.id > 0 ) {
                langs.push(new TIMAAT.Tag(tag));
              }
            });
            TIMAAT.TagLists.tags = langs;
            TIMAAT.TagLists.tags.model = data.data;
            return data.data;
          }
        },
        "createdRow": function(row, data, dataIndex) {
          // console.log("TCL: data", data);
          // console.log("TCL: row, data, dataIndex", row, data, dataIndex);
          let tagElement = $(row);
          let tag = data;
          tag.ui = tagElement;
          tagElement.data('tag', tag);

          tagElement.on('click', '.name', function(event) {
            event.stopPropagation();
            // show tag editor - trigger popup
            TIMAAT.UI.hidePopups();
            TIMAAT.UI.showComponent('lists');
            $('.form').hide();
            $('.tagsNavTabs').show();
            $('.tagsDataTabs').hide();
            $('.nav-tabs a[href="#tagDataSheet"]').tab('show');
            var selectedTag;
            var i = 0;
            for (; i < TIMAAT.TagLists.tags.length; i++) {
              if (TIMAAT.TagLists.tags[i].model.id == tag.id) {
                selectedTag = TIMAAT.TagLists.tags[i];
                break;
              }
            }
            $('#tagListsFormMetadata').data('tag', selectedTag);
            TIMAAT.TagLists.tagFormDataSheet('show', selectedTag);
          });
        },
        "columns": [
          { data: 'id', name: 'name', className: 'name', render: function(data, type, tag, meta) {
            let nameDisplay = `<p>`+ tag.name +`</p>`;
            return nameDisplay;
            }
          },
        ],
        "tag": {
          "decimal"     : ",",
          "thousands"   : ".",
          "search"      : "Search",
          "lengthMenu"  : "Show _MENU_ entries",
          "zeroRecords" : "No tags found.",
          "info"        : "Page _PAGE_ of _PAGES_ &middot; (_MAX_ tags total)",
          "infoEmpty"   : "No tags available.",
          "infoFiltered": "(&mdash; _TOTAL_ of _MAX_ tag(s))",
          "paginate"    : {
            "first"   : "<<",
            "previous": "<",
            "next"    : ">",
            "last"    : ">>"
          },
        },
      });
    },

		addTag: function() {
			// console.log("TCL: addTag");
			$('.form').hide();
			$('#tagListsFormMetadata').data(null);
      tagFormMetadataValidator.resetForm();

      // setup form
			$('#tagListsFormMetadata').trigger('reset');
			$('#tagListsFormMetadata').show();
			$('.dataSheetData').hide();
      $('.nameData').show();

      $('#tagListsFormMetadataEdit').hide();
      $('#tagListsFormMetadataDelete').hide();
      $('#tagListsFormMetadataSubmit').html("Add");
      $('#tagListsFormMetadataSubmit').show();
      $('#tagListsFormMetadataDismiss').show();
			$('#tagListsFormMetadata :input').prop('disabled', false);
      $('#tagFormHeader').html("Add tag");

      $('#tagListsMetadataName').focus();
		},

		tagFormDataSheet: async function(action, data) {
      // console.log("TCL: action, data: ", action, data);
      $('#tagListsFormMetadata').trigger('reset');
      $('.dataSheetData').hide();
      $('.nameData').show();
      $('.tagData').show();
      tagFormMetadataValidator.resetForm();

      $('#tagListsFormMetadata').show();

      if ( action == 'show') {
        $('#tagListsFormMetadata :input').prop('disabled', true);
        $('#tagListsFormMetadataEdit').prop('disabled', false);
        $('#tagListsFormMetadataEdit :input').prop('disabled', false);
        $('#tagListsFormMetadataEdit').show();
        $('#tagListsFormMetadataDelete').prop('disabled', false);
        $('#tagListsFormMetadataDelete :input').prop('disabled', false);
        $('#tagListsFormMetadataDelete').show();
        $('#tagListsFormMetadataSubmit').hide();
        $('#tagListsFormMetadataDismiss').hide();
        $('#tagFormHeader').html("Tag Data Sheet (#"+ data.model.id+')');
      }
      else if (action == 'edit') {
        $('#tagListsFormMetadata :input').prop('disabled', false);
        $('#tagListsFormMetadataEdit').hide();
        $('#tagListsFormMetadataEdit').prop('disabled', true);
        $('#tagListsFormMetadataEdit :input').prop('disabled', true);
        $('#tagListsFormMetadataDelete').hide();
        $('#tagListsFormMetadataDelete').prop('disabled', true);
        $('#tagListsFormMetadataDelete :input').prop('disabled', true);
        $('#tagListsFormMetadataSubmit').html("Save");
        $('#tagListsFormMetadataSubmit').show();
        $('#tagListsFormMetadataDismiss').show();
        $('#tagFormHeader').html("Edit Tag");
        $('#tagListsMetadataName').focus();
      }
      // name data
      $('#tagListsMetadataName').val(data.model.name);
      $('#tagListsMetadataCode').val(data.model.code);

      $('#tagListsFormMetadata').data('tag', data);
    },

    createTagModel: async function(formDataObject) {
      // console.log("TCL: formDataObject", formDataObject);
      var model = {
        id: 0,
        name: formDataObject.name,
        code: formDataObject.code
      };
      return model;
    },

    createTag: async function(model) {
      // console.log("TCL: createTag: model: ", model);
      try {
        // create tag
        var newModel = await TIMAAT.TagService.createTag(model);
        // console.log("TCL: newModel", newModel);
        model.id = newModel.id;
      } catch(error) {
        console.error("ERROR: ", error);
      };
      // console.log("TCL: model", model);
      return (model);
    },

    // TODO update tags
    updateTag: async function(tag) {
      // console.log("TCL: updateTag: async function -> beginning of update: tag ", tag);

      try { // update translation
        var tempModel = await TIMAAT.TagService.updateTag(tag);
        tag = tempModel;
      } catch(error) {
        console.error("ERROR: ", error);
      };

      await TIMAAT.UI.refreshDataTable('tag');
    },

    updateMediumAnalysisListHasTagsList: async function(mediumAnalysisListModel, tagIdList) {
    	// console.log("TCL: mediumAnalysisListModel, tagIdList", mediumAnalysisListModel, tagIdList);
			try {
				var existingMediumAnalysisListHasTagsEntries = await TIMAAT.AnalysisListService.getTagList(mediumAnalysisListModel.id);
        // console.log("TCL: existingMediumAnalysisListHasTagsEntries", existingMediumAnalysisListHasTagsEntries);
				if (tagIdList == null) { //* all entries will be deleted
					mediumAnalysisListModel.tags = [];
					await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
				} else if (existingMediumAnalysisListHasTagsEntries.length == 0) { //* all entries will be added
					mediumAnalysisListModel.tags = tagIdList;
					await TIMAAT.AnalysisListService.updateMediumAnalysisList(mediumAnalysisListModel);
				} else { //* delete removed entries
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingMediumAnalysisListHasTagsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < tagIdList.length; j++) {
							if (existingMediumAnalysisListHasTagsEntries[i].id == tagIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingMediumAnalysisListHasTagEntries but not in tagIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingMediumAnalysisListHasTagsEntries[i]);
							existingMediumAnalysisListHasTagsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = mediumAnalysisListModel.tags.findIndex(({id}) => id === entriesToDelete[i].id);
							mediumAnalysisListModel.tags.splice(index,1);
							await TIMAAT.AnalysisListService.removeTag(mediumAnalysisListModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing tags
					var idsToCreate = [];
          i = 0;
          for (; i < tagIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingMediumAnalysisListHasTagsEntries.length; j++) {
              if (tagIdList[i].id == existingMediumAnalysisListHasTagsEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = tagIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							mediumAnalysisListModel.tags.push(idsToCreate[i]);
							await TIMAAT.AnalysisListService.addTag(mediumAnalysisListModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return mediumAnalysisListModel;
		},

		createNewTagsAndAddToMediumAnalysisList: async function (mediumAnalysisListModel, newTagList) {
      // console.log("TCL: Inspector -> createNewTagsAndAddToMediumAnalysisList -> mediumAnalysisListModel, newTagList", mediumAnalysisListModel, newTagList);
			var i = 0;
			for (; i < newTagList.length; i++) {
				newTagList[i] = await TIMAAT.Service.createTag(newTagList[i].name);
				await TIMAAT.AnalysisListService.addTag(mediumAnalysisListModel.id, newTagList[i].id);
				mediumAnalysisListModel.tags.push(newTagList[i]);
			}
			return mediumAnalysisListModel;
    },

    updateAnnotationHasTagsList: async function(annotationModel, tagIdList) {
    	// console.log("TCL: annotationModel, tagIdList", annotationModel, tagIdList);
			try {
				var existingAnnotationHasTagsEntries = await TIMAAT.AnnotationService.getTagList(annotationModel.id);
        // console.log("TCL: existingAnnotationHasTagsEntries", existingAnnotationHasTagsEntries);
        if (tagIdList == null) { //* all entries will be deleted
          // console.log("TCL: delete all tags");
					annotationModel.tags = [];
					await TIMAAT.AnnotationService.updateAnnotation(annotationModel);
        } else if (existingAnnotationHasTagsEntries.length == 0) { //* all entries will be added
          // console.log("TCL: add all tags");
					annotationModel.tags = tagIdList;
					await TIMAAT.AnnotationService.updateAnnotation(annotationModel);
        } else { //* delete removed entries
          // console.log("TCL: add/delete tags");
					var entriesToDelete = [];
					var i = 0;
					for (; i < existingAnnotationHasTagsEntries.length; i++) {
						var deleteId = true;
						var j = 0;
						for (; j < tagIdList.length; j++) {
							if (existingAnnotationHasTagsEntries[i].id == tagIdList[j].id) {
								deleteId = false;
								break; // no need to check further if match was found
							}
						}
						if (deleteId) { // id is in existingAnnotationHasTagEntries but not in tagIdList
              // console.log("TCL: deleteId", deleteId);
							entriesToDelete.push(existingAnnotationHasTagsEntries[i]);
							existingAnnotationHasTagsEntries.splice(i,1); // remove entry so it won't have to be checked again in the next step when adding new ids
							i--; // so the next list item is not jumped over due to the splicing
						}
					}
					if (entriesToDelete.length > 0) { // anything to delete?
						var i = 0;
						for (; i < entriesToDelete.length; i++) {
							var index = annotationModel.tags.findIndex(({id}) => id === entriesToDelete[i].id);
							annotationModel.tags.splice(index,1);
							await TIMAAT.AnnotationService.removeTag(annotationModel.id, entriesToDelete[i].id);
						}
					}
					//* add existing tags
					var idsToCreate = [];
          i = 0;
          for (; i < tagIdList.length; i++) {
            var idExists = false;
            var item = { id: 0 };
            var j = 0;
            for (; j < existingAnnotationHasTagsEntries.length; j++) {
              if (tagIdList[i].id == existingAnnotationHasTagsEntries[j].id) {
                idExists = true;
                break; // no need to check further if match was found
              }
            }
            if (!idExists) {
              item.id = tagIdList[i].id;
              idsToCreate.push(item);
            }
          }
          // console.log("TCL: idsToCreate", idsToCreate);
          if (idsToCreate.length > 0) { // anything to add?
            // console.log("TCL: idsToCreate", idsToCreate);
						var i = 0;
						for (; i < idsToCreate.length; i++) {
							annotationModel.tags.push(idsToCreate[i]);
							await TIMAAT.AnnotationService.addTag(annotationModel.id, idsToCreate[i].id);
						}
          }
				}
			} catch(error) {
				console.error("ERROR: ", error);
			}
			return annotationModel;
		},

		createNewTagsAndAddToAnnotation: async function (annotationModel, newTagList) {
      // console.log("TCL: Inspector -> createNewTagsAndAddToAnnotation -> annotationModel, newTagList", annotationModel, newTagList);
			var i = 0;
			for (; i < newTagList.length; i++) {
				newTagList[i] = await TIMAAT.Service.createTag(newTagList[i].name);
				await TIMAAT.AnnotationService.addTag(annotationModel.id, newTagList[i].id);
				annotationModel.tags.push(newTagList[i]);
			}
			return annotationModel;
		},

    _tagRemoved: async function(tag) {
      // console.log("TCL: _tagRemoved: tag", tag);
      try {
        await TIMAAT.TagService.deleteTag(tag.model.id);
      } catch(error) {
        console.error("ERROR: ", error);
      }
      tag.remove();
    },

	}
}, window));
