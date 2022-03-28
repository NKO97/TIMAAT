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

      // $(document).ready(function() {
      //   if ()
      //   window.location.hash = '';
      // });

      $(window).on('popstate', async function() {
        // console.log("TCL ~ $ ~ popstate");

        //* get url hash and traverse through each segment to determine what to load and display
        let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
      });

      $(window).on('hashchange', async function( e ) {
        // console.log("TCL ~ $ ~ hashchange");
        // TODO handling of deleted entries when using browser back button

        //* get url hash and traverse through each segment to determine what to load and display
        // let currentUrlHash = window.location.hash;
        // await TIMAAT.URLHistory.setupView(currentUrlHash);
        // history.pushState(null, document.title, window.location.href);
      });
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
          // case '':
          //   // open login page
          // break;
          case 'medium': // #medium...
            // make sure media list is loaded
            // if (!TIMAAT.MediumDatasets.mediaLoaded) {
            //   TIMAAT.MediumDatasets.setMediumList();
            //   TIMAAT.MediumDatasets.mediaLoaded = true;
            // }
            // show media component
            TIMAAT.UI.showComponent('media');
            // show corresponding medium form
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current medium
              $('#timaat-mediadatasets-medium-list tr[id='+pathSegments[1]+']').trigger('click');
              let medium = {};
              medium.model = await TIMAAT.MediumService.getMedium(pathSegments[1]);
              let type = medium.model.mediaType.mediaTypeTranslations[0].type;
              TIMAAT.UI.selectedMediumId = pathSegments[1];
              $('#medium-metadata-form').data('type', type);
			        $('#medium-metadata-form').data('medium', medium);
              if ( pathSegments.length == 2 ) { //* #medium/:id     (default view, show datasheet)
                TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-metadata', 'medium-metadata-form');
                TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');
              }
              else { // other medium form than datasheet
                switch (pathSegments[2]) {
                  case 'preview': //* #medium/:id/preview
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-preview', 'medium-preview-form');
                    TIMAAT.UI.displayDataSetContent('preview', medium, 'medium');
                  break;
                  case 'titles': //* #medium/:id/titles
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-titles', 'medium-titles-form');
                    TIMAAT.UI.displayDataSetContent('titles', medium, 'medium');
                  break;
                  case 'languages': //* #medium/:id/languages
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-languagetracks', 'medium-languagetracks-form');
                    TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium');
                  break;
                  case 'actorsWithRoles': //* #medium/:id/actorsWithRoles
                    TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable', 'medium-tab-actorwithroles', 'medium-actorwithroles-form');
                    TIMAAT.UI.displayDataSetContent('actorWithRoles', medium, 'medium');
                  break;
                  default:
                    this.redirectToDefaultView();
                  break;
                }
              }
            }
            else {
              switch (pathSegments[1]) {
                case 'allMediaList':
                if (!TIMAAT.MediumDatasets.dataTableAllMediaList) {
                  await TIMAAT.MediumDatasets.setupAllMediaDataTable();
                }
                TIMAAT.MediumDatasets.dataTableAllMediaList.ajax.url('/TIMAAT/api/medium/allMediaList')
                TIMAAT.MediumDatasets.dataTableAllMediaList.ajax.reload();
                TIMAAT.UI.displayComponent('medium', null, 'medium-datatable');
                $('#medium-tab').addClass('active');
                TIMAAT.UI.displayDataSetContentArea('medium-allMedia');
                $('#timaat-mediumdatasets-all-media').addClass('active');
              break;
                // case 'list': //* #medium/list
                //   TIMAAT.MediumDatasets.loadMedia();
                //   TIMAAT.UI.displayComponent('medium', 'medium-tab', 'medium-datatable');
                // break;
                case 'audio': // #medium/audio ...
                case 'document': // #medium/document ...
                case 'image': // #medium/image ...
                case 'software': // #medium/software ...
                case 'text': // #medium/text ...
                case 'video': // #medium/video ...
                case 'videogame': // #medium/videogame ...
                  if (pathSegments.length >= 3 && !isNaN(pathSegments[2])) { // path segment is id of current medium
                    $('#timaat-mediadatasets-'+pathSegments[1]+'-list tr[id='+pathSegments[2]+']').trigger('click');
                    let medium = {};
                    medium.model = await TIMAAT.MediumService.getMedium(pathSegments[2]);
                    let type = medium.model.mediaType.mediaTypeTranslations[0].type;
                    TIMAAT.UI.selectedMediumId = pathSegments[2];
                    $('#medium-metadata-form').data('type', type);
			              $('#medium-metadata-form').data('medium', medium);
                    if ( pathSegments.length == 3 ) { //* #medium/:type/:id     (default view, show datasheet)
                      TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-metadata', 'medium-metadata-form');
                      TIMAAT.UI.displayDataSetContent('dataSheet', medium, 'medium');
                    }
                    else { // other medium form than datasheet
                      switch (pathSegments[3]) {
                        case 'preview': //* #medium/:type/:id/preview
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-preview', 'medium-preview-form');
                          TIMAAT.UI.displayDataSetContent('preview', medium, 'medium');
                        break;
                        case 'titles': //* #medium/:type/:id/titles
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-titles', 'medium-titles-form');
                          TIMAAT.UI.displayDataSetContent('titles', medium, 'medium');
                        break;
                        case 'languages': //* #medium/:type/:id/languages
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-languagetracks', 'medium-languagetracks-form');
                          TIMAAT.UI.displayDataSetContent('languageTracks', medium, 'medium');
                        break;
                        case 'actorsWithRoles': //* #medium/:type/:id/actorsWithRoles
                          TIMAAT.UI.displayComponent('medium', type+'-tab', type+'-datatable', 'medium-tab-actorwithroles', 'medium-actorwithroles-form');
                          TIMAAT.UI.displayDataSetContent('actorWithRoles', medium, 'medium');
                        break;
                        default:
                          this.redirectToDefaultView();
                        break;
                      }
                    }
                  }
                  else if (pathSegments.length >= 3 && pathSegments[2] == 'list') { //* .../list
                    TIMAAT.UI.clearLastSelection(pathSegments[1]);
                    TIMAAT.MediumDatasets.loadMediumSubtype(pathSegments[1]);
                    TIMAAT.UI.displayComponent('medium', pathSegments[1]+'-tab', pathSegments[1]+'-datatable');
                  } else {
                      this.redirectToDefaultView();
                  }
                break;
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          break;
          case 'mediumCollection': // #mediumCollection...
            // TODO make sure media collections are loaded
            // show media collection component
            TIMAAT.UI.showComponent('media');
            TIMAAT.UI.refreshDataTable('mediumCollection');

            // show corresponding medium collection form
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current medium collection
              $('#timaat-mediumcollectiondatasets-mediumcollection-list tr[id='+pathSegments[1]+']').trigger('click');
              let mediumCollection = {};
              mediumCollection.model = await TIMAAT.MediumCollectionService.getMediumCollection(pathSegments[1]);
              // console.log("TCL: setupView:function -> mediumCollection", mediumCollection);
              TIMAAT.MediumCollectionDatasets.currentPermissionLevel = await TIMAAT.MediumCollectionService.getMediumCollectionPermissionLevel(mediumCollection.model.id);
              TIMAAT.UI.selectedMediumCollectionId = pathSegments[1];
              $('#mediumcollection-metadata-form').data('mediumCollection', mediumCollection);
              let type = mediumCollection.model.mediaCollectionType.mediaCollectionTypeTranslations[0].type;
              $('#mediumcollection-metadata-form').data('type', type);
              if (pathSegments.length == 2) { //* #mediumCollection/:id    (default view, show datasheet)
                TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable', 'mediumcollection-tab-metadata', 'mediumcollection-metadata-form');
                TIMAAT.UI.displayDataSetContent('dataSheet', mediumCollection, 'mediumCollection');
              }
              else { // other mediumCollection form than datasheet
                switch (pathSegments[2]) {
                  case 'items': //* #mediumCollection/:id/items
                  if (TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList) {
                    TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.url('/TIMAAT/api/mediumCollection/' + mediumCollection.model.id + '/hasMediaList')
                    TIMAAT.MediumCollectionDatasets.dataTableMediaCollectionItemList.ajax.reload();
                  } else {
                    await TIMAAT.MediumCollectionDatasets.setupMediumCollectionItemListDataTable(mediumCollection.model.id);
                    TIMAAT.MediumCollectionDatasets.setMediumCollectionItemList();
                  }
                    // TIMAAT.MediumCollectionDatasets.clearLastItemSelection();
                    TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable', 'mediumcollection-tab-items', 'mediumcollection-mediaItems');
                    TIMAAT.UI.displayDataSetContent('items', mediumCollection, 'mediumCollection');
                  break;
                  // case 'publication': //* #mediumCollection/:id/publication
                  // TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable', 'mediumcollection-tab-publication', 'mediumcollection-publication');
                  // TIMAAT.UI.displayDataSetContent('publication', mediumCollection, 'mediumCollection');
                  // break;
                  default:
                    this.redirectToDefaultView();
                  break;
                }
              }
            }
            else {
              switch (pathSegments[1]) {
              case 'list': //* #mediumCollection/list
                TIMAAT.MediumCollectionDatasets.loadMediaCollections();
                TIMAAT.UI.displayComponent('mediumCollection', 'mediumcollection-tab', 'mediumcollection-datatable');
              break;
              default:
                this.redirectToDefaultView();
              break;
              }
            }
          break;
          case 'actor': // #actor...
            // make sure actor list is loaded
            // if (!TIMAAT.ActorDatasets.actorsLoaded) {
            //   TIMAAT.ActorDatasets.actorsLoaded = true;
            // }
            // show actors component
            TIMAAT.UI.showComponent('actors');
            // show corresponding actor form
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current actor
              $('#timaat-actordatasets-actor-list tr[id='+pathSegments[1]+']').trigger('click');
              let actor = {};
              actor.model = await TIMAAT.ActorService.getActor(pathSegments[1]);
              let type = actor.model.actorType.actorTypeTranslations[0].type;
              TIMAAT.UI.selectedActorId = pathSegments[1];
              $('#actor-metadata-form').data('type', type);
			        $('#actor-metadata-form').data('actor', actor);
              if ( pathSegments.length == 2 ) { //* #actor/:id     (default view, show datasheet)
                TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-metadata', 'actor-metadata-form');
                TIMAAT.UI.displayDataSetContent('dataSheet', actor, 'actor');
              }
              else { // other actor form than datasheet
                switch (pathSegments[2]) {
                  case 'names': //* #actor/:id/preview
                    TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-names', 'actor-names-form');
                    TIMAAT.UI.displayDataSetContent('names', actor, 'actor');
                  break;
                  case 'addresses': //* #actor/:id/titles
                    TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-addresses', 'actor-addresses-form');
                    TIMAAT.UI.displayDataSetContent('addresses', actor, 'actor');
                  break;
                  case 'emails': //* #actor/:id/languages
                    TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-emailaddresses', 'actor-emailaddresses-form');
                    TIMAAT.UI.displayDataSetContent('emails', actor, 'actor');
                  break;
                  case 'phoneNumbers': //* #actor/:id/actorsWithRoles
                    TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-phonenumbers', 'actor-phonenumbers-form');
                    TIMAAT.UI.displayDataSetContent('phoneNumbers', actor, 'actor');
                  break;
                  case 'memberOfCollectives': //* #actor/:id/preview
                    TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-memberofcollectives', 'actor-memberofcollectives-form');
                    TIMAAT.UI.displayDataSetContent('memberOfCollectives', actor, 'actor');
                  break;
                  case 'roles': //* #actor/:id/titles
                    TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-roles', 'actor-roles-form');
                    TIMAAT.UI.displayDataSetContent('roles', actor, 'actor');
                  break;
                  case 'rolesInMedia': //* #actor/:id/languages
                    TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable', 'actor-tab-role-in-medium', 'actor-role-in-medium-form');
                    TIMAAT.UI.displayDataSetContent('rolesInMedia', actor, 'actor');
                  break;
                  default:
                    this.redirectToDefaultView();
                  break;
                }
              }
            }
            else {
              switch (pathSegments[1]) {
                case 'list': //* #actor/list
                  TIMAAT.ActorDatasets.loadActors();
                  TIMAAT.UI.displayComponent('actor', 'actor-tab', 'actor-datatable');
                break;
                case 'person': // #actor/person ...
                case 'collective': // #actor/collective ...
                  // console.log("TCL: switch(pathSegments[1])", pathSegments[1]);
                  if (pathSegments.length >= 3 && !isNaN(pathSegments[2])) { // path segment is id of current actor
                    $('#timaat-actordatasets-'+pathSegments[1]+'-list tr[id='+pathSegments[2]+']').trigger('click');
                    let actor = {};
                    actor.model = await TIMAAT.ActorService.getActor(pathSegments[2]);
                    let type = actor.model.actorType.actorTypeTranslations[0].type;
                    $('#actor-metadata-form').data('actor', actor);
                    $('#actor-metadata-form').data('type', type);
                    TIMAAT.UI.selectedActorId = pathSegments[2];
                    if ( pathSegments.length == 3 ) { //* #actor/:type/:id     (default view, show datasheet)
                      TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-metadata', 'actor-metadata-form');
                      TIMAAT.UI.displayDataSetContent('dataSheet', actor, 'actor');
                    }
                    else { // other actor form than datasheet
                      switch (pathSegments[3]) {
                        case 'names': //* #actor/:type/:id/preview
                          TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-names', 'actor-names-form');
                          TIMAAT.UI.displayDataSetContent('names', actor, 'actor');
                        break;
                        case 'addresses': //* #actor/:type/:id/titles
                          TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-addresses', 'actor-addresses-form');
                          TIMAAT.UI.displayDataSetContent('addresses', actor, 'actor');
                        break;
                        case 'emails': //* #actor/:type/:id/languages
                          TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-emailaddresses', 'actor-emailaddresses-form');
                          TIMAAT.UI.displayDataSetContent('emails', actor, 'actor');
                        break;
                        case 'phoneNumbers': //* #actor/:type/:id/actorsWithRoles
                          TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-phonenumbers', 'actor-phonenumbers-form');
                          TIMAAT.UI.displayDataSetContent('phoneNumbers', actor, 'actor');
                        break;
                        case 'memberOfCollectives': //* #actor/:type/:id/preview
                          TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-memberofcollectives', 'actor-memberofcollectives-form');
                          TIMAAT.UI.displayDataSetContent('memberOfCollectives', actor, 'actor');
                        break;
                        case 'roles': //* #actor/:type/:id/titles
                          TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-roles', 'actor-roles-form');
                          TIMAAT.UI.displayDataSetContent('roles', actor, 'actor');
                        break;
                        case 'rolesInMedia': //* #actor/:type/:id/languages
                          TIMAAT.UI.displayComponent('actor', type+'-tab', type+'-datatable', 'actor-tab-role-in-medium', 'actor-role-in-medium-form');
                          TIMAAT.UI.displayDataSetContent('rolesInMedia', actor, 'actor');
                        break;
                        default:
                          this.redirectToDefaultView();
                        break;
                      }
                    }
                  }
                  else if (pathSegments.length >= 3 && pathSegments[2] == 'list') { //* .../list
                    TIMAAT.UI.clearLastSelection(pathSegments[1]);
                    TIMAAT.ActorDatasets.loadActorSubtype(pathSegments[1]);
                    TIMAAT.UI.displayComponent('actor', pathSegments[1]+'-tab', pathSegments[1]+'-datatable');
                  } else {
                    this.redirectToDefaultView();
                  }
                break;
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          break;
          case 'event': // #event...
          // make sure event list is loaded
          // if (!TIMAAT.EventDatasets.eventsLoaded) {
          //   TIMAAT.EventDatasets.setEventList();
          //   TIMAAT.EventDatasets.eventsLoaded = true;
          // }
          // show events component
          TIMAAT.UI.showComponent('events');
          // show corresponding event form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current event
            $('#timaat-eventdatasets-event-list tr[id='+pathSegments[1]+']').trigger('click');
            let event = {};
            event.model = await TIMAAT.EventService.getEvent(pathSegments[1]);
            let type = event.model.eventType.eventTypeTranslations[0].type;
            TIMAAT.UI.selecteEventId = pathSegments[1];
            $('#event-metadata-form').data('type', type);
            $('#event-metadata-form').data('event', event);
            if ( pathSegments.length == 2 ) { //* #event/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('event', 'event-tab', 'event-datatable', 'event-tab-metadata', 'event-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', event, 'event');
            }
            else { // other event form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': //* #event/list
                TIMAAT.EventDatasets.loadEvents();
                TIMAAT.UI.displayComponent('event', 'event-tab', 'event-datatable');
              break;
              default:
                this.redirectToDefaultView();
              break;
            }
          }
          break;
          case 'music': // #music...
          // show music component
          TIMAAT.UI.showComponent('music');
          // show corresponding music form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current music
            $('#timaat-musicdatasets-music-list tr[id='+pathSegments[1]+']').trigger('click');
            let music = {};
            music.model = await TIMAAT.MusicService.getMusic(pathSegments[1]);
            let type = music.model.musicType.musicTypeTranslations[0].type;
            TIMAAT.UI.selectedMusicId = pathSegments[1];
            $('#music-metadata-form').data('type', type);
            $('#music-metadata-form').data('music', music);
            if ( pathSegments.length == 2 ) { //* #music/:id (default view, show datasheet)
              TIMAAT.UI.displayComponent('music', 'music-tab', 'music-datatable', 'music-tab-metadata', 'music-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', music, 'music');
            }
            else { // other music form than datasheet
              switch (pathSegments[2]) {
                case 'preview': //* #music/:id/preview
                  TIMAAT.UI.displayComponent('music', 'music-tab', 'music-datatable', 'music-tab-preview', 'music-preview-form');
                  TIMAAT.UI.displayDataSetContent('preview', music, 'music');
                break;
                case 'titles': //* #music/:id/titles
                  TIMAAT.UI.displayComponent('music', 'music-tab', 'music-datatable', 'music-tab-titles', 'music-titles-form');
                  TIMAAT.UI.displayDataSetContent('titles', music, 'music');
                break;
                case 'actorsWithRoles': //* #music/:id/actorsWithRoles
                  TIMAAT.UI.displayComponent('music', 'music-tab', 'music-datatable', 'music-tab-actorwithroles', 'music-actorwithroles-form');
                  TIMAAT.UI.displayDataSetContent('actorWithRoles', music, 'music');
                break;
                case 'mediumHasMusicList': //* #music/:id/mediumHasMusicList
                  TIMAAT.UI.displayComponent('music', 'music-tab', 'music-datatable', 'music-tab-mediumhasmusiclist', 'music-mediumhasmusiclist-form');
                  TIMAAT.UI.displayDataSetContent('mediumHasMusicList', music, 'music');
                break;
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': //* #music/list
                TIMAAT.MusicDatasets.loadMusicList();
                TIMAAT.UI.displayComponent('music', 'music-tab', 'music-datatable');
              break;
              case 'nashid':
              case 'churchMusic':
                if (pathSegments.length >= 3 && !isNaN(pathSegments[2])) { // path segment is id of current music
                  $('#timaat-musicdatasets-'+pathSegments[1]+'-list tr[id='+pathSegments[2]+']').trigger('click');
                  let music = {};
                  music.model = await TIMAAT.MusicService.getMusic(pathSegments[2]);
                  let type = music.model.musicType.musicTypeTranslations[0].type;
                  TIMAAT.UI.selectedMusicId = pathSegments[2];
                  $('#music-metadata-form').data('type', type);
                  $('#music-metadata-form').data('music', music);
                  if ( pathSegments.length == 3 ) { //* #music/:type/:id     (default view, show datasheet)
                    TIMAAT.UI.displayComponent('music', type+'-tab', type+'-datatable', 'music-tab-metadata', 'music-metadata-form');
                    TIMAAT.UI.displayDataSetContent('dataSheet', music, 'music');
                  }
                  else { // other music form than datasheet
                    switch (pathSegments[3]) {
                      case 'preview': //* #music/:type/:id/preview
                        TIMAAT.UI.displayComponent('music', type+'-tab', type+'-datatable', 'music-tab-preview', 'music-preview-form');
                        TIMAAT.UI.displayDataSetContent('preview', music, 'music');
                      break;
                      case 'titles': //* #music/:type/:id/titles
                        TIMAAT.UI.displayComponent('music', type+'-tab', type+'-datatable', 'music-tab-titles', 'music-titles-form');
                        TIMAAT.UI.displayDataSetContent('titles', music, 'music');
                      break;
                      case 'actorsWithRoles': //* #music/:type/:id/actorsWithRoles
                        TIMAAT.UI.displayComponent('music', type+'-tab', type+'-datatable', 'music-tab-actorwithroles', 'music-actorwithroles-form');
                        TIMAAT.UI.displayDataSetContent('actorWithRoles', music, 'music');
                      break;
                      case 'mediumHasMusicList': //* #music/:type/:id/mediumHasMusicList
                        TIMAAT.UI.displayComponent('music', type+'-tab', type+'-datatable', 'music-tab-mediumhasmusiclist', 'music-mediumhasmusiclist-form');
                        TIMAAT.UI.displayDataSetContent('mediumHasMusicList', music, 'music');
                      break;
                      default:
                        this.redirectToDefaultView();
                      break;
                    }
                  }
                }
                else if (pathSegments.length >= 3 && pathSegments[2] == 'list') { //* .../list
                  TIMAAT.UI.clearLastSelection(pathSegments[1]);
                  TIMAAT.MusicDatasets.loadMusicSubtype(pathSegments[1]);
                  TIMAAT.UI.displayComponent('music', pathSegments[1]+'-tab', pathSegments[1]+'-datatable');
                } else {
                    this.redirectToDefaultView();
                }
              break;
              default:
                this.redirectToDefaultView();
              break;
            }
          }
          break;
          case 'category': // #category...
          // make sure category list is loaded
          // if (!TIMAAT.Lists.listsLoaded) {
          //   TIMAAT.Lists.setLists();
          //   TIMAAT.Lists.listsLoaded = true;
          // }
          // show category component
          TIMAAT.UI.showComponent('lists');
          // show corresponding category form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current category
            $('#timaat-categorylists-category-list tr[id='+pathSegments[1]+']').trigger('click');
            let category = {};
            category.model = await TIMAAT.CategoryService.getCategory(pathSegments[1]);
            TIMAAT.UI.selectedCategoryId = pathSegments[1];
            $('#list-tab-metadata').data('type', 'category');
            $('#category-metadata-form').data('category', category);
            if ( pathSegments.length == 2 ) { //* #category/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('category', 'category-tab', 'category-datatable', 'list-tab-metadata', 'category-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', category, 'category');
            }
            else { // other category form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': //* #category/list
                TIMAAT.CategoryLists.loadCategories();
                TIMAAT.UI.displayComponent('category', 'category-tab', 'category-datatable');
              break;
              default:
                this.redirectToDefaultView();
              break;
            }
          }
          break;
          case 'categorySet': // #categorySet...
          // make sure category set list is loaded
          // if (!TIMAAT.Lists.listsLoaded) {
          //   TIMAAT.Lists.setLists();
          //   TIMAAT.Lists.listsLoaded = true;
          // }
          // show category set component
          TIMAAT.UI.showComponent('lists');
          // show corresponding category set form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current category set
            $('#timaat-categorylists-categoryset-list tr[id='+pathSegments[1]+']').trigger('click');
            let categorySet = {};
            categorySet.model = await TIMAAT.CategorySetService.getCategorySet(pathSegments[1]);
            TIMAAT.UI.selectedCategorySetId = pathSegments[1];
            $('#list-tab-metadata').data('type', 'categorySet');
            $('#categoryset-metadata-form').data('categorySet', categorySet);
            if ( pathSegments.length == 2 ) { //* #categorySet/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('categorySet', 'categoryset-tab', 'categoryset-datatable', 'list-tab-metadata', 'categoryset-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', categorySet, 'categorySet');
            }
            else { // other category set form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': //* #categorySet/list
                TIMAAT.CategoryLists.loadCategorySets();
                TIMAAT.UI.displayComponent('categorySet', 'categoryset-tab', 'categoryset-datatable');
              break;
              default:
                this.redirectToDefaultView();
              break;
            }
          }
          break;
          case 'role': // #role...
          // make sure role list is loaded
          // if (!TIMAAT.Lists.listsLoaded) {
          //   TIMAAT.Lists.setLists();
          //   TIMAAT.Lists.listsLoaded = true;
          // }
          // show role component
          TIMAAT.UI.showComponent('lists');
          // show corresponding role form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current role
            $('#timaat-rolelists-role-list tr[id='+pathSegments[1]+']').trigger('click');
            let role = {};
            role.model = await TIMAAT.RoleService.getRole(pathSegments[1]);
            TIMAAT.UI.selectedRoleId = pathSegments[1];
            $('#list-tab-metadata').data('type', 'role');
            $('#role-metadata-form').data('role', role);
            if ( pathSegments.length == 2 ) { //* #role/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('role', 'role-tab', 'role-datatable', 'list-tab-metadata', 'role-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', role, 'role');
            }
            else { // other role form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': //* #role/list
                TIMAAT.RoleLists.loadRoles();
                TIMAAT.UI.displayComponent('role', 'role-tab', 'role-datatable');
              break;
              default:
                this.redirectToDefaultView();
              break;
            }
          }
          break;
          case 'roleGroup': // #roleGroup...
          // make sure role group list is loaded
          // if (!TIMAAT.Lists.listsLoaded) {
          //   TIMAAT.Lists.setLists();
          //   TIMAAT.Lists.listsLoaded = true;
          // }
          // show role group component
          TIMAAT.UI.showComponent('lists');
          // show corresponding role group form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current role group
            $('#timaat-rolelists-rolegroup-list tr[id='+pathSegments[1]+']').trigger('click');
            let roleGroup = {};
            roleGroup.model = await TIMAAT.RoleService.getRoleGroup(pathSegments[1]);
            TIMAAT.UI.selectedRoleGroupId = pathSegments[1];
            $('#list-tab-metadata').data('type', 'roleGroup');
            $('#rolegroup-metadata-form').data('roleGroup', roleGroup);
            if ( pathSegments.length == 2 ) { //* #roleGroup/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('roleGroup', 'rolegroup-tab', 'rolegroup-datatable', 'list-tab-metadata', 'rolegroup-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', roleGroup, 'roleGroup');
            }
            else { // other role group form than datasheet
              switch (pathSegments[2]) {
                //* no further data tabs currently available
                default:
                  this.redirectToDefaultView();
                break;
              }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': //* #roleGroup/list
                TIMAAT.RoleLists.loadRoleGroups();
                TIMAAT.UI.displayComponent('roleGroup', 'rolegroup-tab', 'rolegroup-datatable');
              break;
              default:
                this.redirectToDefaultView();
              break;
            }
          }
          break;
          case 'language': // #language...
          // make sure language list is loaded
          // if (!TIMAAT.Lists.listsLoaded) {
          //   TIMAAT.Lists.setLists();
          //   TIMAAT.Lists.listsLoaded = true;
          // }
          // show language component
          TIMAAT.UI.showComponent('lists');
          // show corresponding language form
          if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current language
            $('#timaat-languagelists-language-list tr[id='+pathSegments[1]+']').trigger('click');
            let language = {};
            language.model = await TIMAAT.LanguageService.getLanguage(pathSegments[1]);
            TIMAAT.UI.selectedLanguageId = pathSegments[1];
            $('#list-tab-metadata').data('type', 'language');
            $('#language-metadata-form').data('language', language);
            if ( pathSegments.length == 2 ) { //* #language/:id     (default view, show datasheet)
              TIMAAT.UI.displayComponent('language', 'language-tab', 'language-datatable', 'list-tab-metadata', 'language-metadata-form');
              TIMAAT.UI.displayDataSetContent('dataSheet', language, 'language');
            }
            else { // other language form than datasheet
              this.redirectToDefaultView();
              // switch (pathSegments[2]) {
              //   //* no further data tabs currently available
              // }
            }
          }
          else {
            switch (pathSegments[1]) {
              case 'list': //* #language/list
                TIMAAT.LanguageLists.loadLanguages();
                TIMAAT.UI.displayComponent('language', 'language-tab', 'language-datatable');
              break;
              default:
                this.redirectToDefaultView();
              break;
            }
          }
          break;
          case 'settings': // #settings...
            if (pathSegments.length > 1) {
              this.redirectToDefaultView();
            }
            TIMAAT.UI.showComponent('settings');
            TIMAAT.Settings.loadSettings();
          break;
          // case 'mediaLibrary': // #mediaLibrary...
          //   // make sure videochooser collection list is loaded
          //   // if (!TIMAAT.VideoChooser.videoChooserLoaded) {
          //   //   TIMAAT.VideoChooser.loadCollections();
          //   //   TIMAAT.VideoChooser.videoChooserLoaded = true;
          //   // }
          //   TIMAAT.UI.showComponent('videochooser');
          //   // show corresponding videochooser collection list
          //   if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current videochooser collection item
          //     $('#timaat-videochooser-collection-'+pathSegments[1]).trigger('click');
          //     let collection = await TIMAAT.MediumCollectionService.getMediumCollection(pathSegments[1]);
          //     // TIMAAT.UI.clearLastSelection('videochooser');
          //     if (pathSegments.length == 2) { //* #mediaLibrary/:id (default view, show datatable)
          //       TIMAAT.VideoChooser.setCollection(collection);
          //       TIMAAT.UI.displayComponent('videochooser', null, 'videochooser-datatable');
          //       // TIMAAT.UI.displayDataSetContent('dataSheet', collection, 'videochooser');
          //     }
          //     else { // other videochooser form than datatable
          //       switch (pathSegments[2]) {
          //         //* no further data tabs currently available
          //         default:
          //           this.redirectToDefaultView();
          //         break;
          //       }
          //     }
          //   }
          //   else {
          //     switch (pathSegments[1]) {
          //       case 'list': //* #mediaLibrary/list
          //         // $('#timaat-videochooser-collectionlibrary').trigger('click');
          //         TIMAAT.VideoChooser.setCollection(null);
				  //         TIMAAT.UI.displayComponent('videochooser', null, 'videochooser-datatable');
          //       break;
          //       default:
          //         this.redirectToDefaultView();
          //       break;
          //     }
          //   }
          // break;
          case 'analysis': // #analysis...
            // make sure analysis list is loaded
            // if (!TIMAAT.VideoPlayer.curAnalysisList) {
            //   TIMAAT.VideoPlayer.
            //   TIMAAT.MediumDatasets.mediaLoaded = true;
            // }
            // show video player component
            TIMAAT.UI.showComponent('videoplayer');
            // show corresponding video and analysis lists
            if ( pathSegments.length >= 2 && !isNaN(pathSegments[1]) ) { // path segment is id of current analysis
              // console.log("TCL: setupView:function -> pathSegments[1]", pathSegments[1]);
              //* determine analysis list and corresponding medium via hashPath
              let analysisList = await TIMAAT.AnalysisListService.getAnalysisList(pathSegments[1]);
              let medium = await TIMAAT.MediumService.getMedium(analysisList.mediumID);
              //* load necessary data to display UI
              TIMAAT.VideoPlayer.setupMedium(medium);
              let analysisLists = await TIMAAT.AnalysisListService.getMediumAnalysisLists(medium.id);
              //* setup UI
              await TIMAAT.VideoPlayer.setupMediumAnalysisLists(analysisLists);
              await TIMAAT.VideoPlayer.loadAnalysisList(analysisList.id);
              $('#timaat-analysislist-chooser').val(analysisList.id);
              if ( pathSegments.length == 2 ) { //* #analysis/:id     (default view, show analysis list)
              } else { //* as long as no substructure is accessible via url
                this.redirectToDefaultView();
              }
              // TODO annotation and segment data accessibility by url
              // else { // element in analysis list selected
              //   switch (pathSegments[2]) {
              //     case 'annotation': // #analysis/:analysisId/annotation/:annotationId
              //       console.log("TCL: setupView:function -> pathSegments[3] - Annotation: ", pathSegments[3]);
              //     $('#annotation-'+pathSegments[3]).trigger('click');
              //     break;
              //     case 'segment': // #analysis/:analysisId/segment/:segmentId
              //       console.log("TCL: setupView:function -> pathSegments[3] - Segment: ", pathSegments[3]);
              //       $('#segment-'+pathSegments[3]).trigger('click');
              //     break;
              //     case 'scene': // #analysis/:analysisId/scene/:sceneId
              //       $('#scene-'+pathSegments[3]).trigger('click');
              //     break;
              //     case 'action': // #analysis/:analysisId/action/:actionId
              //       $('#action-'+pathSegments[3]).trigger('click');
              //     break;
              //     case 'take': // #analysis/:analysisId/take/:takeId
              //       $('#take-'+pathSegments[3]).trigger('click');
              //     break;
              //   }
              // }
            }
            else {
              this.redirectToDefaultView();
            }
          break;
          default:
            this.redirectToDefaultView();
          break;
        }
      }
    },

    redirectToDefaultView: function() {
      console.log("TCL: redirectToDefaultView", );
      // redirect if invalid url path is entered
      TIMAAT.URLHistory.setupView('#medium/allMediaList');
      TIMAAT.URLHistory.setURL(null, 'Media Library', '#medium/allMediaList');
    },

  }

}, window));