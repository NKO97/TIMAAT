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

  TIMAAT.URLHistory = {

    init: function() {

      $(document).ready(window.location.hash = '');
      
      $(window).on('popstate', async function() {
        // console.log("TCL ~ $ ~ popstate");

        //* get url hash and traverse through each segment to determine what to load and display
        let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
      });

      $(window).on( 'hashchange', async function( e ) {
        // console.log("TCL ~ $ ~ hashchange");
        // TODO handling of deleted entries when using browser back button

        //* get url hash and traverse through each segment to determine what to load and display
        // let currentUrlHash = window.location.hash;
        // await TIMAAT.URLHistory.setupView(currentUrlHash);
        // history.pushState(null, document.title, window.location.href);
      } );
    },

    setURL: function(data, title, hash) {
      // console.log("TCL ~ data, title, hash", data, title, hash);
      let currentURL = new URL(document.URL);
      if (currentURL.hash != hash) {
        currentURL.hash = hash;
        let newURL = currentURL.href;
        history.pushState(data, title, newURL);
        document.title = title;
      }
    },

    setupView: async function(currentUrlHash) {
      currentUrlHash = currentUrlHash.slice(1); // remove #
      // separate url hash into its path segments
      const pathSegments = currentUrlHash.split('/');
      if ( pathSegments.length >= 1 ) {
        switch (pathSegments[0]) {
          case '':
            // open login page
          break;
          case 'medium': // #medium...
            // make sure media list is loaded
            if (!TIMAAT.MediumDatasets.mediaLoaded) {
              TIMAAT.MediumDatasets.setMediumList();
              TIMAAT.MediumDatasets.mediaLoaded = true;
            }
            // show media component
            TIMAAT.UI.showComponent('media');
            // show corresponding medium form
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current medium
              $('#timaat-mediadatasets-medium-list tr[id='+pathSegments[1]+']').trigger('click');
              let medium = {};
              medium.model = await TIMAAT.MediumService.getMedium(pathSegments[1]);
              TIMAAT.UI.clearLastSelection('medium');
              if ( pathSegments.length == 2 ) { // #medium/:id     (default view, show datasheet)
                TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-metadata', 'medium-metadata-form');
                TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');
              }
              else { // other medium form than datasheet
                switch (pathSegments[2]) {
                  case 'preview': // #medium/:id/preview
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-preview', 'medium-preview-form');
                    TIMAAT.UI.displayDataSetContent('preview', medium, 'medium');
                  break;
                  case 'titles': // #medium/:id/titles
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-titles', 'medium-titles-form');
                    TIMAAT.UI.displayDataSetContent('titles', medium, 'medium');
                  break;
                  case 'languages': // #medium/:id/languages
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-languagetracks', 'medium-languagetracks-form');
                    TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium');
                  break;
                  case 'actorsWithRoles': // #medium/:id/actorsWithRoles
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-actorwithroles', 'medium-actorwithroles-form');
                    TIMAAT.UI.displayDataSetContent('actorWithRoles', medium, 'medium');
                  break;
                }
              }
            }
            else {
              TIMAAT.UI.clearLastSelection(pathSegments[1]);
              switch (pathSegments[1]) {
                case 'list': // #medium/list
                  TIMAAT.MediumDatasets.loadMedia();
                break;
                case 'audio': // #medium/audio ...
                case 'document': // #medium/document ...
                case 'image': // #medium/image ...
                case 'software': // #medium/software ...
                case 'text': // #medium/text ...
                case 'video': // #medium/video ...
                case 'videogame': // #medium/videogame ...
                  $('#medium-metadata-form').data('type', pathSegments[1]);
                  if (pathSegments.length >= 3 && !isNaN(pathSegments[2])) { // path segment is id of current medium
                    $('#timaat-mediadatasets-'+pathSegments[1]+'-list tr[id='+pathSegments[2]+']').trigger('click');
                    let medium = {};
                    medium.model = await TIMAAT.MediumService.getMedium(pathSegments[2]);
                    let type = medium.model.mediaType.mediaTypeTranslations[0].type;
                    TIMAAT.UI.clearLastSelection(type);
                    if ( pathSegments.length == 3 ) { // #medium/:type/:id     (default view, show datasheet)
                      TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-metadata', 'medium-metadata-form');
                      TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');
                    }
                    else { // other medium form than datasheet
                      switch (pathSegments[3]) {
                        case 'preview': // #medium/:type/:id/preview
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-preview', 'medium-preview-form');
                          TIMAAT.UI.displayDataSetContent('preview', medium, type);
                        break;
                        case 'titles': // #medium/:type/:id/titles
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-titles', 'medium-titles-form');
                          TIMAAT.UI.displayDataSetContent('titles', medium, 'medium');
                        break;
                        case 'languages': // #medium/:type/:id/languages
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-languagetracks', 'medium-languagetracks-form');
                          TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium');
                        break;
                        case 'actorsWithRoles': // #medium/:type/:id/actorsWithRoles
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-actorwithroles', 'medium-actorwithroles-form');
                          TIMAAT.UI.displayDataSetContent('actorWithRoles', medium, 'medium');
                        break;
                      }
                    }
                  }
                  else if (pathSegments.length >= 3 && pathSegments[2] == 'list') { // .../list
                    TIMAAT.UI.clearLastSelection(pathSegments[1]);
                    TIMAAT.MediumDatasets.loadMediumSubtype(pathSegments[1]);
                  }
                break;
              }
            }
          break;
          case 'mediumCollection':
            // TODO make sure media collections are loaded
            // show media collection component
            TIMAAT.UI.showComponent('media');
            
            // show corresponding medium collection form
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current medium collection
              $('#timaat-mediumcollectiondatasets-mediumcollection-list tr[id='+pathSegments[1]+']').trigger('click');
              let mediumCollection = {};
              mediumCollection.model = await TIMAAT.MediumCollectionService.getMediumCollection(pathSegments[1]);
              TIMAAT.UI.clearLastSelection('mediumCollection');
              if (pathSegments.length == 2) { // #mediumCollection/:id    (default view, show datasheet)
                TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable', 'mediumcollection-tab-metadata', 'mediumcollection-metadata-form');
                TIMAAT.UI.displayDataSetContent('dataSheet', mediumCollection, 'mediumCollection');
              }
              else { // other mediumCollection form than datasheet
                switch (pathSegments[2]) {
                  case 'items': // #mediumCollection/:id/items
                    TIMAAT.MediumCollectionDatasets.clearLastItemSelection();
                    TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable', 'mediumcollection-tab-items', 'mediumcollection-mediaItems');
                    TIMAAT.UI.displayDataSetContent('items', mediumCollection, 'mediumCollection');
                  break;
                  case 'publication': // #mediumCollection/:id/publication
                  TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable', 'mediumcollection-tab-publication', 'mediumcollection-publication');
                  TIMAAT.UI.displayDataSetContent('publication', mediumCollection, 'mediumCollection');
                  break;
                }
              }
            }
            else {
              TIMAAT.UI.clearLastSelection('mediumCollection');
              switch (pathSegments[1]) {
              case 'list': // #mediumCollection/list
                TIMAAT.MediumCollectionDatasets.loadMediaCollections();
              break;
              }
            }
          break;
          case 'actor': // #actor...
          // make sure actor list is loaded
          if (!TIMAAT.ActorDatasets.actorsLoaded) {
            TIMAAT.ActorDatasets.setActorList();
            TIMAAT.ActorDatasets.actorsLoaded = true;
          }
          // show actors component
          TIMAAT.UI.showComponent('actors');
          // show corresponding actor form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current actor
            $('#timaat-actordatasets-actor-list tr[id='+pathSegments[1]+']').trigger('click');
            let actor = {};
            actor.model = await TIMAAT.ActorService.getActor(pathSegments[1]);
            TIMAAT.UI.clearLastSelection('actor');
            if ( pathSegments.length == 2 ) { // #actor/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-metadata', 'actor-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', actor, 'actor');
            }
            else { // other actor form than datasheet
              switch (pathSegments[2]) {
                case 'names': // #actor/:id/preview
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-names', 'actor-names-form');
                  TIMAAT.UI.displayDataSetContent('names', actor, 'actor');
                break;
                case 'addresses': // #actor/:id/titles
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-addresses', 'actor-addresses-form');
                  TIMAAT.UI.displayDataSetContent('addresses', actor, 'actor');
                break;
                case 'emails': // #actor/:id/languages
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-emailaddresses', 'actor-emailaddresses-form');
                  TIMAAT.UI.displayDataSetContent('emails', actor, 'actor');
                break;
                case 'phoneNumbers': // #actor/:id/actorsWithRoles
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-phonenumbers', 'actor-phonenumbers-form');
                  TIMAAT.UI.displayDataSetContent('phoneNumbers', actor, 'actor');
                break;
                case 'memberOfCollectives': // #actor/:id/preview
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-memberofcollectives', 'actor-memberofcollectives-form');
                  TIMAAT.UI.displayDataSetContent('memberOfCollectives', actor, 'actor');
                break;
                case 'roles': // #actor/:id/titles
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-roles', 'actor-roles-form');
                  TIMAAT.UI.displayDataSetContent('roles', actor, 'actor');
                break;
                case 'rolesInMedia': // #actor/:id/languages
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-role-in-medium', 'actor-role-in-medium-form');
                  TIMAAT.UI.displayDataSetContent('rolesInMedia', actor, 'actor');
                break;
              }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': // #actor/list
                TIMAAT.ActorDatasets.loadActors();
              break;
              case 'person': // #actor/person ...
              case 'collective': // #actor/collective ...
                $('#actor-metadata-form').data('type', pathSegments[1]);
                if (pathSegments.length >= 3 && !isNaN(pathSegments[2])) { // path segment is id of current actor
                  $('#timaat-actordatasets-'+pathSegments[1]+'-list tr[id='+pathSegments[2]+']').trigger('click');
                  let actor = {};
                  actor.model = await TIMAAT.ActorService.getActor(pathSegments[2]);
                  let type = actor.model.actorType.actorTypeTranslations[0].type;
                  TIMAAT.UI.clearLastSelection(type);
                  if ( pathSegments.length == 3 ) { // #actor/:type/:id     (default view, show datasheet)
                    TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-metadata', 'actor-metadata-form');
                    TIMAAT.UI.displayDataSetContent('dataSheet', actor, 'actor');
                  }
                  else { // other actor form than datasheet
                    switch (pathSegments[3]) {
                      case 'names': // #actor/:type/:id/preview
                        TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-names', 'actor-names-form');
                        TIMAAT.UI.displayDataSetContent('names', actor, 'actor');
                      break;
                      case 'addresses': // #actor/:type/:id/titles
                        TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-addresses', 'actor-addresses-form');
                        TIMAAT.UI.displayDataSetContent('addresses', actor, 'actor');
                      break;
                      case 'emails': // #actor/:type/:id/languages
                        TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-emailaddresses', 'actor-emailaddresses-form');
                        TIMAAT.UI.displayDataSetContent('emails', actor, 'actor');
                      break;
                      case 'phoneNumbers': // #actor/:type/:id/actorsWithRoles
                        TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-phonenumbers', 'actor-phonenumbers-form');
                        TIMAAT.UI.displayDataSetContent('phoneNumbers', actor, 'actor');
                      break;
                      case 'memberOfCollectives': // #actor/:type/:id/preview
                        TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-memberofcollectives', 'actor-memberofcollectives-form');
                        TIMAAT.UI.displayDataSetContent('memberOfCollectives', actor, 'actor');
                      break;
                      case 'roles': // #actor/:type/:id/titles
                        TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-roles', 'actor-roles-form');
                        TIMAAT.UI.displayDataSetContent('roles', actor, 'actor');
                      break;
                      case 'rolesInMedia': // #actor/:type/:id/languages
                        TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-role-in-medium', 'actor-role-in-medium-form');
                        TIMAAT.UI.displayDataSetContent('rolesInMedia', actor, 'actor');
                      break;
                    }
                  }
                }
                else if (pathSegments.length >= 3 && pathSegments[2] == 'list') { // .../list
                  TIMAAT.UI.clearLastSelection(pathSegments[1]);
                  TIMAAT.ActorDatasets.loadActorSubtype(pathSegments[1]);
                }
              break;
            }
          }
          break;
          case 'event': // #event...
          // make sure event list is loaded
          if (!TIMAAT.EventDatasets.eventsLoaded) {
            TIMAAT.EventDatasets.setEventList();
            TIMAAT.EventDatasets.eventsLoaded = true;
          }
          // show events component
          TIMAAT.UI.showComponent('events');
          // show corresponding event form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current event
            $('#timaat-eventdatasets-event-list tr[id='+pathSegments[1]+']').trigger('click');
            let event = {};
            event.model = await TIMAAT.EventService.getEvent(pathSegments[1]);
            // let type = event.model.eventType.eventTypeTranslations[0].type;
            TIMAAT.UI.clearLastSelection('event');
            if ( pathSegments.length == 2 ) { // #event/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('event', 'event-tab', 'event-datatable', 'event-tab-metadata', 'event-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', event, 'event');
            }
            else { // other event form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
              }
            }
          }
          else {
            TIMAAT.UI.clearLastSelection('event');
            switch (pathSegments[1]) {
              case 'list': // #event/list
                TIMAAT.EventDatasets.loadEvents();
              break;
            }
          }
          break;
          case 'category': // #category...
          // make sure category list is loaded
          if (!TIMAAT.Lists.listsLoaded) {
            TIMAAT.Lists.setLists();
            TIMAAT.Lists.listsLoaded = true;
          }
          // show category component
          TIMAAT.UI.showComponent('lists');
          // show corresponding category form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current category
            $('#timaat-categorylists-category-list tr[id='+pathSegments[1]+']').trigger('click');
            let category = {};
            category.model = await TIMAAT.CategoryService.getCategory(pathSegments[1]);
            TIMAAT.UI.clearLastSelection('category');
            if ( pathSegments.length == 2 ) { // #category/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('category', 'category-tab', 'category-datatable', 'list-tab-metadata', 'category-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', category, 'category');
            }
            else { // other category form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
              }
            }
          }
          else {
            TIMAAT.UI.clearLastSelection(pathSegments[0]);
            switch (pathSegments[1]) {
              case 'list': // #category/list
                TIMAAT.CategoryLists.loadCategories();
              break;
            }
          }
          break;
          case 'categorySet': // #categorySet...
          // make sure category set list is loaded
          if (!TIMAAT.Lists.listsLoaded) {
            TIMAAT.Lists.setLists();
            TIMAAT.Lists.listsLoaded = true;
          }
          // show category set component
          TIMAAT.UI.showComponent('lists');
          // show corresponding category set form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current category set
            $('#timaat-categorylists-categoryset-list tr[id='+pathSegments[1]+']').trigger('click');
            let categorySet = {};
            categorySet.model = await TIMAAT.CategorySetService.getCategorySet(pathSegments[1]);
            TIMAAT.UI.clearLastSelection('categorySet');
            if ( pathSegments.length == 2 ) { // #categorySet/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('categorySet', 'categoryset-tab', 'categoryset-datatable', 'list-tab-metadata', 'categoryset-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', categorySet, 'categorySet');
            }
            else { // other category set form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
              }
            }
          }
          else {
            TIMAAT.UI.clearLastSelection(pathSegments[0]);
            switch (pathSegments[1]) {
              case 'list': // #categorySet/list
                TIMAAT.CategoryLists.loadCategorySets();
              break;
            }
          }
          break;
          case 'role': // #role...
          // make sure role list is loaded
          if (!TIMAAT.Lists.listsLoaded) {
            TIMAAT.Lists.setLists();
            TIMAAT.Lists.listsLoaded = true;
          }
          // show role component
          TIMAAT.UI.showComponent('lists');
          // show corresponding role form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current role
            $('#timaat-rolelists-role-list tr[id='+pathSegments[1]+']').trigger('click');
            let role = {};
            role.model = await TIMAAT.RoleService.getRole(pathSegments[1]);
            TIMAAT.UI.clearLastSelection('role');
            if ( pathSegments.length == 2 ) { // #role/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('role', 'role-tab', 'role-datatable', 'list-tab-metadata', 'role-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', role, 'role');
            }
            else { // other role form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
              }
            }
          }
          else {
            TIMAAT.UI.clearLastSelection(pathSegments[0]);
            switch (pathSegments[1]) {
              case 'list': // #role/list
                TIMAAT.RoleLists.loadRoles();
              break;
            }
          }
          break;
          case 'roleGroup': // #roleGroup...
          // make sure role group list is loaded
          if (!TIMAAT.Lists.listsLoaded) {
            TIMAAT.Lists.setLists();
            TIMAAT.Lists.listsLoaded = true;
          }
          // show role group component
          TIMAAT.UI.showComponent('lists');
          // show corresponding role group form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current role group
            $('#timaat-rolelists-rolegroup-list tr[id='+pathSegments[1]+']').trigger('click');
            let roleGroup = {};
            roleGroup.model = await TIMAAT.RoleService.getRoleGroup(pathSegments[1]);
            TIMAAT.UI.clearLastSelection('roleGroup');
            if ( pathSegments.length == 2 ) { // #roleGroup/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('roleGroup', 'rolegroup-tab', 'rolegroup-datatable', 'list-tab-metadata', 'rolegroup-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', roleGroup, 'roleGroup');
            }
            else { // other role group form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
              }
            }
          }
          else {
            TIMAAT.UI.clearLastSelection(pathSegments[0]);
            switch (pathSegments[1]) {
              case 'list': // #roleGroup/list
                TIMAAT.RoleLists.loadRoleGroups();
              break;
            }
          }
          break;
          case 'language': // #language...
          // make sure language list is loaded
          if (!TIMAAT.Lists.listsLoaded) {
            TIMAAT.Lists.setLists();
            TIMAAT.Lists.listsLoaded = true;
          }
          // show language component
          TIMAAT.UI.showComponent('lists');
          // show corresponding language form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current language
            $('#timaat-languagelists-language-list tr[id='+pathSegments[1]+']').trigger('click');
            let language = {};
            language.model = await TIMAAT.LanguageService.getLanguage(pathSegments[1]);
            TIMAAT.UI.clearLastSelection('language');
            if ( pathSegments.length == 2 ) { // #language/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('language', 'language-tab', 'language-datatable', 'list-tab-metadata', 'language-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', language, 'language');
            }
            else { // other language form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
              }
            }
          }
          else {
            TIMAAT.UI.clearLastSelection(pathSegments[0]);
            switch (pathSegments[1]) {
              case 'list': // #language/list
                TIMAAT.LanguageLists.loadLanguages();
              break;
            }
          }
          break;
          case 'settings':
            TIMAAT.UI.showComponent('settings');
            TIMAAT.Settings.loadSettings();
          break;
          case 'mediaLibrary':
            // make sure videochooser collection list is loaded
            if (!TIMAAT.VideoChooser.videoChooserLoaded) {
              TIMAAT.VideoChooser.loadCollections();
              TIMAAT.VideoChooser.videoChooserLoaded = true;
            }
            TIMAAT.UI.showComponent('videochooser');
            // show corresponding videochooser collection list
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current videochooser collection item
              $('#timaat-videochooser-collection-'+pathSegments[1]).trigger('click');
              let collection = {};
              collection.model = await TIMAAT.MediumCollectionService.getMediumCollection(pathSegments[1]);
              // TIMAAT.UI.clearLastSelection('videochooser');
              if (pathSegments.length == 2) { // #mediaLibrary/:id (default view, show datatable)
                // TIMAAT.VideoChooser.setCollection(collection);
                TIMAAT.UI.displayComponent('videochooser', null, 'videochooser-datatable');
                TIMAAT.UI.displayDataSetContent('dataSheet', collection, 'videochooser');
              }
              else { // other videochooser form than datatable
                switch (pathSegments[2]) {
                  //* no further data tabs currently available
                }
              }
            }
            else {
              // TIMAAT.UI.clearLastSelection('videochooser');
              switch (pathSegments[1]) {
                case 'list': // #mediaLibrary/list
                  $('#timaat-videochooser-collectionlibrary').trigger('click');
                break;
              }
            }
          break;
        }
      }
    },

  }

}, window));