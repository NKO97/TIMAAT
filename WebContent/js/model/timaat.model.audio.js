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
	
	TIMAAT.Audio = class Audio {
		constructor(model) {
			// console.log("TCL: Audio -> constructor -> model", model)
			// setup model
			this.model = model;

			// create and style list view element
			var editAudioButton = '<button type="button" class="btn btn-outline btn-secondary btn-sm timaat-audio-edit float-left" id="timaat-audio-edit"><i class="fas fa-edit"></i></button>';
			var deleteAudioButton = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-audio-remove float-left" id="timaat-audio-remove"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) { 
				deleteAudioButton = '';
				editAudioButton = '';
			};
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-2">
							<div class=btn-group-vertical>` +
								editAudioButton +
								deleteAudioButton +
							`</div>
						</div>
						<div class="col-lg-8">
							<span class="timaat-audio-list-name"></span>
							<br><br>
							<span class="timaat-audio-list-mediatype-id"></span>
						</div>
						<div class="col-lg-2">
							<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;">
								<i class="fas fa-user"></i>
							</div>
						</div>
					</div>
				</li>`
			);

			$('#timaat-audio-list').append(this.listView);
			this.updateUI();      
			var audio = this; // save audio for system events

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
				if (audio.model.medium.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+audio.model.medium.createdByUserAccount.id+'">[ID '+audio.model.medium.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(audio.model.medium.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+audio.model.medium.createdByUserAccount.id+'">[ID '+audio.model.medium.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(audio.model.medium.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+audio.model.medium.lastEditedByUserAccount.id+'">[ID '+audio.model.medium.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(audio.model.medium.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach audio handlers
			$(this.listView).on('click', this, function(ev) {
				console.log("TCL: Audio -> constructor -> open audio datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-audio-form').data('audio', audio);
				TIMAAT.MediaDatasets.audioFormDatasheet("show", audio);				
				// audio.listView.find('.timaat-audio-list-tags').popover('show');
			});

			// edit handler
			$(this.listView).find('.timaat-audio-edit').on('click', this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();
				$('#timaat-mediadatasets-audio-form').data('audio', audio);
				TIMAAT.MediaDatasets.audioFormDatasheet("edit", audio);
				// audio.listView.find('.timaat-audio-list-tags').popover('show');
			});

			// remove handler
			this.listView.find('.timaat-audio-remove').click(this, function(ev) {
      	console.log("TCL: Audio -> constructor -> this.listView.find('.timaat-audio-remove')");
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-mediadatasets-audio-delete').data('audio', audio);
				$('#timaat-mediadatasets-audio-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Audio -> updateUI -> updateUI()");
			// title
			var name = this.model.medium.title.name;
			if ( this.model.mediumId < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-audio-list-name').text(name);
		}

		remove() {
			// console.log("TCL: Audio -> remove -> remove()");
			// remove audio from UI
			this.listView.remove(); // TODO remove tags from audio_has_tags
			// remove from audio list
			var index = TIMAAT.MediaDatasets.audios.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.audios.splice(index, 1);
			// remove from model list
			index = TIMAAT.MediaDatasets.audios.model.indexOf(this);
			if (index > -1) TIMAAT.MediaDatasets.audios.model.splice(index, 1);
		}

	}
	
}, window));
