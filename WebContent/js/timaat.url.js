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
            if (!TIMAAT.MediaDatasets.mediaLoaded) {
              TIMAAT.MediaDatasets.setMediumList();
              TIMAAT.MediaDatasets.mediaLoaded = true;
            }
            // show media component
            TIMAAT.UI.showComponent('media');
            // show corresponding medium form
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current medium
              $('#timaat-mediadatasets-medium-list tr[id='+pathSegments[1]+']').trigger('click');
              let medium = {};
              medium.model = await TIMAAT.MediaService.getMedium(pathSegments[1]);
              let type = medium.model.mediaType.mediaTypeTranslations[0].type;
              TIMAAT.MediaDatasets.clearLastSelection('medium');
              if ( pathSegments.length == 2 ) { // #medium/:id     (default view, show datasheet)
                TIMAAT.MediaDatasets.displayComponent('medium', 'media-tab', 'media-datatable', 'media-tab-medium-metadata', 'medium-metadata-form');
                TIMAAT.MediaDatasets.displayDataSetContent('dataSheet', medium, 'show', type);
              }
              else { // other medium form than datasheet
                switch (pathSegments[2]) {
                  case 'preview': // #medium/:id/preview
                    TIMAAT.MediaDatasets.displayComponent('medium', 'media-tab', 'media-datatable', 'media-tab-medium-preview', 'medium-preview-form');
                    TIMAAT.MediaDatasets.displayDataSetContent('preview', medium, null, type);
                  break;
                  case 'titles': // #medium/:id/titles
                    TIMAAT.MediaDatasets.displayComponent('medium', 'media-tab', 'media-datatable', 'media-tab-medium-titles', 'medium-titles-form');
                    TIMAAT.MediaDatasets.displayDataSetContent('titles', medium);
                  break;
                  case 'languages': // #medium/:id/languages
                    TIMAAT.MediaDatasets.displayComponent('medium', 'media-tab', 'media-datatable', 'media-tab-medium-languagetracks', 'medium-languagetracks-form');
                    TIMAAT.MediaDatasets.displayDataSetContent('languageTracks', medium);
                  break;
                  case 'actorsWithRoles': // #medium/:id/actorsWithRoles
                    TIMAAT.MediaDatasets.displayComponent('medium', 'media-tab', 'media-datatable', 'media-tab-medium-actorwithroles', 'medium-actorwithroles-form');
                    TIMAAT.MediaDatasets.displayDataSetContent('actorWithRoles', medium);
                  break;
                }
              }
            }
            else {
              TIMAAT.MediaDatasets.clearLastSelection(pathSegments[1]);
              switch (pathSegments[1]) {
                case 'list': // #medium/list
                  TIMAAT.MediaDatasets.loadMedia();
                break;
                case 'audio': // #medium/audio ...
                case 'document': // #medium/document ...
                case 'image': // #medium/image ...
                case 'software': // #medium/software ...
                case 'text': // #medium/text ...
                case 'video': // #medium/video ...
                case 'videogame': // #medium/videogame ...
                  $('#medium-metadata-form').attr('data-type', pathSegments[1]);
                  if (pathSegments.length >= 3 && !isNaN(pathSegments[2])) { // path segment is id of current medium
                    $('#timaat-mediadatasets-'+pathSegments[1]+'-list tr[id='+pathSegments[2]+']').trigger('click');
                    let medium = {};
                    medium.model = await TIMAAT.MediaService.getMedium(pathSegments[2]);
                    let type = medium.model.mediaType.mediaTypeTranslations[0].type;
                    TIMAAT.MediaDatasets.clearLastSelection(type);
                    if ( pathSegments.length == 3 ) { // #medium/:type/:id     (default view, show datasheet)
                      TIMAAT.MediaDatasets.displayComponent('medium', type+'s-tab', type+'s-datatable', 'media-tab-medium-metadata', 'medium-metadata-form');
                      TIMAAT.MediaDatasets.displayDataSetContent('dataSheet', medium, 'show', type);
                    }
                    else { // other medium form than datasheet
                      switch (pathSegments[3]) {
                        case 'preview': // #medium/:type/:id/preview
                          TIMAAT.MediaDatasets.displayComponent('medium', type+'s-tab', type+'s-datatable', 'media-tab-medium-preview', 'medium-preview-form');
                          TIMAAT.MediaDatasets.displayDataSetContent('preview', medium, null, type);
                        break;
                        case 'titles': // #medium/:type/:id/titles
                          TIMAAT.MediaDatasets.displayComponent('medium', type+'s-tab', type+'s-datatable', 'media-tab-medium-titles', 'medium-titles-form');
                          TIMAAT.MediaDatasets.displayDataSetContent('titles', medium);
                        break;
                        case 'languages': // #medium/:type/:id/languages
                          TIMAAT.MediaDatasets.displayComponent('medium', type+'s-tab', type+'s-datatable', 'media-tab-medium-languagetracks', 'medium-languagetracks-form');
                          TIMAAT.MediaDatasets.displayDataSetContent('languageTracks', medium);
                        break;
                        case 'actorsWithRoles': // #medium/:type/:id/actorsWithRoles
                          TIMAAT.MediaDatasets.displayComponent('medium', type+'s-tab', type+'s-datatable', 'media-tab-medium-actorwithroles', 'medium-actorwithroles-form');
                          TIMAAT.MediaDatasets.displayDataSetContent('actorWithRoles', medium);
                        break;
                      }
                    }
                  }
                  else if (pathSegments.length >= 3 && pathSegments[2] == 'list') { // .../list
                    TIMAAT.MediaDatasets.clearLastSelection(pathSegments[1]);
                    TIMAAT.MediaDatasets.loadMediumSubtype(pathSegments[1]);
                  }
                break;
              }
            }
          break;
          case 'mediaCollection':
            // TODO make sure media collections are loaded
            // show media collection component
            TIMAAT.UI.showComponent('media');
            
            // show corresponding medium collection form
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current medium collection
              $('#timaat-mediacollectiondatasets-mediumcollection-list tr[id='+pathSegments[1]+']').trigger('click');
              let mediumCollection = {};
              mediumCollection.model = await TIMAAT.MediaCollectionService.getMediumCollection(pathSegments[1]);
              let type = mediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
              TIMAAT.MediaCollectionDatasets.clearLastSelection();
              if (pathSegments.length == 2) { // #mediaCollection/:id    (default view, show datasheet)
                TIMAAT.MediaDatasets.displayComponent('mediumCollection', 'mediacollections-tab', 'mediacollection-datatable', 'mediacollection-tab-mediumcollection-metadata', 'mediacollection-metadata-form');
                TIMAAT.MediaCollectionDatasets.displayDataSetContent('dataSheet', mediumCollection, 'show', type);
              }
              else { // other mediaCollection form than datasheet
                switch (pathSegments[2]) {
                  case 'items': // #mediaCollection/:id/items
                    TIMAAT.MediaCollectionDatasets.clearLastItemSelection();
                    TIMAAT.MediaDatasets.displayComponent('mediumCollection', 'mediacollections-tab', 'mediacollection-datatable', 'mediacollection-tab-mediumcollection-items', 'mediacollection-mediaItems');
                    TIMAAT.MediaCollectionDatasets.displayDataSetContent('items', mediumCollection);
                  break;
                  case 'publication': // #mediaCollection/:id/publication
                  TIMAAT.MediaDatasets.displayComponent('mediumCollection', 'mediacollections-tab', 'mediacollection-datatable', 'mediacollection-tab-mediumcollection-publication', 'mediacollection-publication');
                  TIMAAT.MediaCollectionDatasets.displayDataSetContent('publication', mediumCollection);
                  break;
                }
              }
            }
            else {
              TIMAAT.MediaCollectionDatasets.clearLastSelection();
              switch (pathSegments[1]) {
              case 'list': // #mediaCollection/list
                TIMAAT.MediaCollectionDatasets.loadMediaCollections();
              break;
              }
            }
          break;
          case 'actor': // #actor...
          // make sure media list is loaded
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
            let type = actor.model.actorType.actorTypeTranslations[0].type;
            TIMAAT.ActorDatasets.clearLastSelection('actor');
            if ( pathSegments.length == 2 ) { // #actor/:id     (default view, show datasheet)
              TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-metadata', 'actor-metadata-form');
              TIMAAT.ActorDatasets.displayDataSetContent('dataSheet', actor, 'show', type);
            }
            else { // other actor form than datasheet
              switch (pathSegments[2]) {
                case 'names': // #actor/:id/preview
                  TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-names', 'actor-names-form');
                  TIMAAT.ActorDatasets.displayDataSetContent('names', actor, null, type);
                break;
                case 'addresses': // #actor/:id/titles
                  TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-addresses', 'actor-addresses-form');
                  TIMAAT.ActorDatasets.displayDataSetContent('addresses', actor);
                break;
                case 'emails': // #actor/:id/languages
                  TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-emailaddresses', 'actor-emailaddresses-form');
                  TIMAAT.ActorDatasets.displayDataSetContent('emails', actor);
                break;
                case 'phoneNumbers': // #actor/:id/actorsWithRoles
                  TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-phonenumbers', 'actor-phonenumbers-form');
                  TIMAAT.ActorDatasets.displayDataSetContent('phoneNumbers', actor);
                break;
                case 'memberOfCollectives': // #actor/:id/preview
                  TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-memberofcollectives', 'actor-memberofcollectives-form');
                  TIMAAT.ActorDatasets.displayDataSetContent('memberOfCollectives', actor, null, type);
                break;
                case 'roles': // #actor/:id/titles
                  TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-roles', 'actor-roles-form');
                  TIMAAT.ActorDatasets.displayDataSetContent('roles', actor);
                break;
                case 'rolesInMedia': // #actor/:id/languages
                  TIMAAT.ActorDatasets.displayComponent('actor', 'actors-tab', 'actors-datatable', 'actors-tab-actor-role-in-medium', 'actor-role-in-medium-form');
                  TIMAAT.ActorDatasets.displayDataSetContent('rolesInMedia', actor);
                break;
              }
            }
          }
          else {
            TIMAAT.ActorDatasets.clearLastSelection(pathSegments[1]);
            switch (pathSegments[1]) {
              case 'list': // #actor/list
                TIMAAT.ActorDatasets.loadActors();
              break;
              case 'person': // #actor/person ...
              case 'collective': // #actor/collective ...
                $('#actor-metadata-form').attr('data-type', pathSegments[1]);
                if (pathSegments.length >= 3 && !isNaN(pathSegments[2])) { // path segment is id of current actor
                  $('#timaat-actordatasets-'+pathSegments[1]+'-list tr[id='+pathSegments[2]+']').trigger('click');
                  let actor = {};
                  actor.model = await TIMAAT.ActorService.getActor(pathSegments[2]);
                  let type = actor.model.actorType.actorTypeTranslations[0].type;
                  TIMAAT.ActorDatasets.clearLastSelection(type);
                  if ( pathSegments.length == 3 ) { // #actor/:type/:id     (default view, show datasheet)
                    TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-metadata', 'actor-metadata-form');
                    TIMAAT.ActorDatasets.displayDataSetContent('dataSheet', actor, 'show', type);
                  }
                  else { // other actor form than datasheet
                    switch (pathSegments[3]) {
                      case 'names': // #actor/:type/:id/preview
                        TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-names', 'actor-names-form');
                        TIMAAT.ActorDatasets.displayDataSetContent('names', actor);
                      break;
                      case 'addresses': // #actor/:type/:id/titles
                        TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-addresses', 'actor-addresses-form');
                        TIMAAT.ActorDatasets.displayDataSetContent('addresses', actor);
                      break;
                      case 'emails': // #actor/:type/:id/languages
                        TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-emailaddresses', 'actor-emailaddresses-form');
                        TIMAAT.ActorDatasets.displayDataSetContent('emails', actor);
                      break;
                      case 'phoneNumbers': // #actor/:type/:id/actorsWithRoles
                        TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-phonenumbers', 'actor-phonenumbers-form');
                        TIMAAT.ActorDatasets.displayDataSetContent('phoneNumbers', actor);
                      break;
                      case 'memberOfCollectives': // #actor/:type/:id/preview
                        TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-memberofcollectives', 'actor-memberofcollectives-form');
                        TIMAAT.ActorDatasets.displayDataSetContent('memberOfCollectives', actor, 'show', type);
                      break;
                      case 'roles': // #actor/:type/:id/titles
                        TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-roles', 'actor-roles-form');
                        TIMAAT.ActorDatasets.displayDataSetContent('roles', actor);
                      break;
                      case 'rolesInMedia': // #actor/:type/:id/languages
                        TIMAAT.ActorDatasets.displayComponent('actor', type+'s-tab', type+'s-datatable', 'actors-tab-actor-role-in-medium', 'actor-role-in-medium-form');
                        TIMAAT.ActorDatasets.displayDataSetContent('rolesInMedia', actor);
                      break;
                    }
                  }
                }
                else if (pathSegments.length >= 3 && pathSegments[2] == 'list') { // .../list
                  TIMAAT.ActorDatasets.clearLastSelection(pathSegments[1]);
                  TIMAAT.ActorDatasets.loadActorSubtype(pathSegments[1]);
                }
              break;
            }
          }
          break;
          case 'event': // #event...
          // make sure media list is loaded
          if (!TIMAAT.EventDatasets.eventsLoaded) {
            TIMAAT.EventDatasets.setEventList();
            TIMAAT.EventDatasets.eventsLoaded = true;
          }
          // show events component
          TIMAAT.UI.showComponent('events');
          // show corresponding event form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current event
            $('#timaat-EventDatasets-event-list tr[id='+pathSegments[1]+']').trigger('click');
            let event = {};
            event.model = await TIMAAT.EventService.getEvent(pathSegments[1]);
            // let type = event.model.eventType.eventTypeTranslations[0].type;
            TIMAAT.EventDatasets.clearLastSelection('event');
            if ( pathSegments.length == 2 ) { // #event/:id     (default view, show datasheet)
              TIMAAT.EventDatasets.displayComponent('event', 'events-tab', 'events-datatable', 'events-tab-event-metadata', 'event-metadata-form');
              TIMAAT.EventDatasets.displayDataSetContent('dataSheet', event);
            }
            else { // other event form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
              }
            }
          }
          else {
            TIMAAT.EventDatasets.clearLastSelection(pathSegments[1]);
            switch (pathSegments[1]) {
              case 'list': // #event/list
                TIMAAT.EventDatasets.loadEvents();
              break;
            }
          }
          break;
        }
      }

    },

  }

}, window));