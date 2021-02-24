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
      $(window).on('popstate', async function() {
        console.log("TCL ~ $ ~ popstate");

        //* get url hash and traverse through each segment to determine what to load and display
        let currentUrlHash = window.location.hash;
        await TIMAAT.URLHistory.setupView(currentUrlHash);
      });

      $(window).on( 'hashchange', async function( e ) {
        console.log("TCL ~ $ ~ hashchange");
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
      switch (pathSegments[0]) {
        case '':
          // open login page
        break;
        case 'medium':
          // make sure media list is loaded
          if (!TIMAAT.MediaDatasets.mediaLoaded) {
            TIMAAT.MediaDatasets.setMediumList();
            TIMAAT.MediaDatasets.mediaLoaded = true;
          }
          // show media component
          TIMAAT.UI.showComponent('media');
          // show medium data tabs
          $('#timaat-mediadatasets-media-tabs').show();
          // $('.nav-link-media').hide();
          $('.form').hide();
          TIMAAT.MediaDatasets.subNavTab = 'datasheet';
          TIMAAT.MediaDatasets.clearLastMediumSelection('medium');
          // show corresponding medium form
          if ( !isNaN(pathSegments[1]) ) { // path segment is id of current medium
            $('#timaat-mediadatasets-medium-list tr[id='+pathSegments[1]+']').trigger('click');
            let medium = {};
            medium.model = await TIMAAT.MediaService.getMedium(pathSegments[1]);
            let type = medium.model.mediaType.mediaTypeTranslations[0].type;
            if ( pathSegments.length == 2 ) { // default view, show datasheet
              TIMAAT.MediaDatasets.mediumFormDatasheet('show', type, medium);
            }
            else { // other medium form than datasheet
              switch (pathSegments[2]) {
                case 'preview':
                  TIMAAT.MediaDatasets.mediumFormPreview(type, medium);
                break;
                case 'titles':
                  TIMAAT.MediaDatasets.mediumFormTitles('show', medium);
                break;
                case 'languages':
                  TIMAAT.MediaDatasets.mediumFormLanguageTracks('show', medium);
                break;
                case 'actorWithRoles':
                  TIMAAT.MediaDatasets.mediumFormActorRoles('show', medium);
                break;
              }
            }
          }
          else switch (pathSegments[1]) {
            case 'list':
              TIMAAT.MediaDatasets.loadMedia();
            break;
          }
        break;
        case 'mediaCollection':
      }

    },

  }

}, window));