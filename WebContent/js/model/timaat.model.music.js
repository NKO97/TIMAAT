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
	
	TIMAAT.Music = class Music {
		constructor(model, musicType) {
      // console.log("TCL: Music -> constructor -> model, musicType", model, musicType);
			// setup model
			this.model = model;
			
			// create and style list view element
			var displayMusicTypeIcon = '';
			if (musicType == 'music') { // Necessary to fix upload button functionality
				musicType = model.musicType.musicTypeTranslations[0].type;
			}
			// if (musicType == 'music') { // only display icon in music list
				// displayMusicTypeIcon = '  <i class="fas fa-photo-video"></i> '; // default music icon
				switch (musicType) {
					case 'nashid':
						// displayMusicTypeIcon = '  <i class="far fa-file-audio"></i> ';
					break;
					case 'churchMusic':
						// displayMusicTypeIcon = '  <i class="far fa-file-audio"></i> ';
					break;
				}
			// }
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							displayMusicTypeIcon +
							`<span class="timaat-musicdatasets-`+musicType+`-list-name">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat-user-log" style="margin-left: 12px; margin-bottom: 10px;">
									<i class="fas fa-user"></i>							
								</div>
								<button type="button" title="Annotate `+musicType+`" class="btn btn-outline-success btn-sm btn-block timaat-musicdatasets-music-annotate"><i class="fas fa-draw-polygon"></i></button>
						  </div>
						</div>
					</div>
				</li>`
			);

			// console.log("TCL: append me to list:", musicType);
			// $('#timaat-musicdatasets-'+musicType+'-list').append(this.listView);     
			var music = this; // save music for system events

			this.updateUI(); 

			// attach user log info
			this.listView.find('.timaat-user-log').popover({
				placement: 'right',
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				trigger: 'click',
				html: true,
				content: '<div class="timaat-user-log-details">Lade...</div>',
				container: 'body',
				boundary: 'viewport',				
			});

			this.listView.find('.timaat-user-log').on('show.bs.popover', function () {
				TIMAAT.UI.hidePopups();
			});

			this.listView.find('.timaat-user-log').on('inserted.bs.popover', function () {
				if (music.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+music.model.createdByUserAccountId+'">[ID '+music.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(music.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+music.model.createdByUserAccountId+'">[ID '+music.model.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(music.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+music.model.lastEditedByUserAccountId+'">[ID '+music.model.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(music.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});
		}

		updateUI() {
			// console.log("TCL: Music -> updateUI -> updateUI()");
			// title
			var type = $('#music-metadata-form').data('type');
			var name = this.model.displayTitle.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-musicdatasets-'+type+'-list-name').html(name);
			if (type == 'music') {
				this.listView.find('.timaat-musicdatasets-music-list-musictype').html(type);
			}

			// if ( this.model.fileStatus != "noFile" && this.model.fileStatus != "unavailable" ) {
			// 	this.listView.find('.timaat-musicdatasets-music-annotate').show();
			// } else {
			// 	this.listView.find('.timaat-musicdatasets-music-annotate').hide();
			// }
		}

		remove() {
			// console.log("TCL: Music -> remove -> remove()");
			// remove music from UI
			this.listView.remove(); // TODO remove tags from music_has_tags
			$('#music-metadata-form').data('music', null);
		}

	}
	
}, window));
