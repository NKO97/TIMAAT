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
	
	TIMAAT.Actor = class Actor {
		constructor(model, type) {
      // console.log("TCL: Actor -> constructor -> model, type", model, type);
			// setup model
			this.model = model;

			// create and style list view element
			var displayActorTypeIcon = '';
			if (type == 'actor') { // only display icon in actor list
				displayActorTypeIcon = '  <i class="fas fa-id-badge"></i>'; // default actor icon
				switch(this.model.actorType.actorTypeTranslations[0].type) {
					case 'person': 
						displayActorTypeIcon = '  <i class="far fa-address-card"></i>';
					break;
					case 'collective': 
						displayActorTypeIcon = '  <i class="fas fa-users"></i>';
					break;
				}
			}
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							displayActorTypeIcon +
							`  <span class="timaat-actordatasets-`+type+`-list-name">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat-user-log" style="margin-left: 12px; margin-bottom: 10px;">
									<i class="fas fa-user"></i>							
								</div>
						  </div>
						</div>
					</div>
				</li>`
			);

			// $('#timaat-actordatasets-'+type+'-list').append(this.listView);
			// console.log("TCL: Actor -> constructor -> this.updateUI()");    
			var actor = this; // save actor for system events

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
				if (actor.model.lastEditedAt == null) {
					$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+actor.model.createdByUserAccount.id+'">[ID '+actor.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-userId" data-userId="'+actor.model.createdByUserAccount.id+'">[ID '+actor.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-userId" data-userId="'+actor.model.lastEditedByUserAccount.id+'">[ID '+actor.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.lastEditedAt)+'<br>'
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
			// console.log("TCL: Actor -> updateUI -> updateUI()");
			// title
			// console.log("TCL: Actor -> updateUI -> this", this);
			// var name = this.model.displayName.name;
			var name = this.model.displayName.name;
			var type = this.model.actorType.actorTypeTranslations[0].type;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-actordatasets-'+type+'-list-name').html(name);
			if (type == 'actor') {
				this.listView.find('.timaat-actordatasets-actor-list-actortype').html(type);
			}

			// tag count
			// var count = this.model.tags.length + " Tags";
			// if ( this.model.tags.length == 0 ) count = "keine Tags";
			// if ( this.model.tags.length == 1 ) count = "ein Tag";
			// this.listView.find('.timaat-actordatasets-actor-list-count').text(count);
			// tags
			// this.listView.find('.timaat-actordatasets-actor-list-tags i').attr('title', this.model.tags.length+" Tags");			
			// if (this.model.tags.length == 0) this.listView.find('.timaat-actordatasets-actor-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			// else if (this.model.tags.length == 1) this.listView.find('.timaat-actordatasets-actor-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			// else this.listView.find('.timaat-actordatasets-actor-list-tags i').attr('class','fas fa-tags text-dark');		
		}

		remove() {
			console.log("TCL: Actor -> remove -> remove()");
			// remove actor from UI
			this.listView.remove(); // TODO remove tags from actor_has_tags
      // console.log("TCL: Actor -> remove -> this", this);
			$('#actor-metadata-form').data('actor', null);
		}
	}
	
}, window));
