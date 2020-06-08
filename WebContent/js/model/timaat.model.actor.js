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
		constructor(model, actorType) {
      // console.log("TCL: Actor -> constructor -> model, actorType", model, actorType);
			// setup model
			this.model = model;

			// create and style list view element
			var displayActorTypeIcon = '';
			if (actorType == 'actor') { // only display icon in actor list
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
							`  <span class="timaat-actordatasets-`+actorType+`-list-name">
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

			// $('#timaat-actordatasets-'+actorType+'-list').append(this.listView);
			// console.log("TCL: Actor -> constructor -> this.updateUI()");    
			var actor = this; // save actor for system events

			this.updateUI();  

			// this.listView.find('.timaat-actordatasets-actor-list-tags').popover({
			// 	placement: 'right',
			// 	title: 'Tags bearbeiten',
			// 	trigger: 'manual',
			// 	html: true,
			// 	content: '<div class="input-group"><input class="form-control timaat-tag-input" type="text" value=""></div>',
			// 	container: 'body',
			// 	boundary: 'viewport',				
			// });

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
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+actor.model.createdByUserAccount.id+'">[ID '+actor.model.createdByUserAccount.id+']</span></b><br>\
						'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				} else {
					$('.timaat-user-log-details').html(
							'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+actor.model.createdByUserAccount.id+'">[ID '+actor.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+actor.model.lastEditedByUserAccount.id+'">[ID '+actor.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.lastEditedAt)+'<br>'
					);
					$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
				}
			});

			// attach user log info
			this.listView.find('.timaat-user-log').on('click', function(ev) {
				ev.preventDefault();
				ev.stopPropagation();
			});

			// attach tag editor
			// this.listView.find('.timaat-actordatasets-actor-list-tags').on('inserted.bs.popover', function () {
			// 	var tags = "";
			// 	actor.model.tags.forEach(function(item) { tags += ','+item.name });
			// 	tags = tags.substring(1);
			// 	$('.timaat-tag-input').val(tags);
			// 		$('.timaat-tag-input').tagsInput({
			// 			placeholder: 'Tag hinzufügen',
			// 			onAddTag: function(taginput,tag) {
			// 				TIMAAT.Service.addTag(actor, tag, function(newtag) { // TODO addTag?
			// 					actor.model.tags.push(newtag);
			// 					// console.log("TCL: Actor -> constructor -> actor.updateUI() - onAddTag");
			// 					actor.updateUI();                
			// 				});
			// 			},
			// 			onRemoveTag: function(taginput,tag) {
			// 				TIMAAT.Service.removeTag(actor, tag, function(tagname) { // TODO removeTag?
			// 					// find tag in model
			// 					var found = -1;
			// 					actor.model.tags.forEach(function(item, index) {
			// 						if ( item.name == tagname ) found = index;
			// 					});
			// 				if (found > -1) actor.model.tags.splice(found, 1);
			// 					console.log("TCL: Actor -> constructor -> actor.updateUI() - onRemoveTag");
			// 					actor.updateUI();                
			// 				});
			// 			},
			// 			onChange: function() {
			// 				if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			// 			}
			// 		});
			// });
			// console.log("TCL: Actor -> constructor -> actor.updateUI()");
			// this.listView.find('.timaat-actordatasets-actor-list-tags').on('hidden.bs.popover', function () { actor.updateUI(); });
			// this.listView.find('.timaat-actordatasets-actor-list-tags').dblclick(function(ev) {ev.stopPropagation();});

			// attach actor handlers
			$(this.listView).on('click', this, function(ev) {
				// console.log("TCL: Actor -> constructor -> open actor datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.actors-nav-tabs').show();
				$('.actors-data-tabs').hide();
				$('.nav-tabs a[href="#actorDatasheet"]').tab("show");
				$('#timaat-actordatasets-metadata-form').data('actor', actor);
				TIMAAT.ActorDatasets.actorFormDatasheet("show", actorType, actor);
				// actor.listView.find('.timaat-actordatasets-actor-list-tags').popover('show');
			});

		}

		updateUI() {
			// console.log("TCL: Actor -> updateUI -> updateUI()");
			// title
			// console.log("TCL: Actor -> updateUI -> this", this);
			var actorType = $('#timaat-actordatasets-metadata-form').data('actorType');
			// var name = this.model.displayName.name;
			var name = this.model.displayName.name;
			var type = this.model.actorType.actorTypeTranslations[0].type;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-actordatasets-'+actorType+'-list-name').html(name);
			if (actorType == 'actor') {
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
			$('#timaat-actordatasets-metadata-form').data('actor', null);
		}
	}
	
}, window));
