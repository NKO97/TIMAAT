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
		constructor(model) {
			// console.log("TCL: Actor -> constructor -> model", model)
			// setup model
			this.model = model;
			// model.ui = this;
			// create and style list view element
			var deleteActor = '<button type="button" class="btn btn-outline btn-danger btn-sm timaat-actor-remove float-left"><i class="fas fa-trash-alt"></i></button>';
			if ( model.id < 0 ) deleteActor = '';
			this.listView = $('<li class="list-group-item"> '
				+ deleteActor +
				'<span class="timaat-actor-list-title"></span>' +
				'<br> \
				<div class="timaat-actor-list-count text-muted float-left"></div> \
				<div class="float-right text-muted timaat-user-log" style="margin-right: -14px;"><i class="fas fa-user"></i></div> \
			</li>'
			);
			$('#timaat-actor-list').append(this.listView);
			// console.log("TCL: Actor -> constructor -> this.updateUI()");
			this.updateUI();      
			var actor = this; // save actor for system actors
			// this.listView.find('.timaat-actor-list-tags').popover({
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
			console.log("TCL: Actor -> constructor -> Display Bearbeitungslog");
				$('.timaat-user-log-details').html(
						'<b><i class="fas fa-plus-square"></i> Erstellt von <span class="timaat-user-id" data-userid="'+actor.model.createdByUserAccount.id+'">[ID '+actor.model.createdByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Bearbeitet von <span class="timaat-user-id" data-userid="'+actor.model.lastEditedByUserAccount.id+'">[ID '+actor.model.lastEditedByUserAccount.id+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.lastEditedAt)+'<br>'
				);
				$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "mir")});
			});
			// attach tag editor
			// this.listView.find('.timaat-actor-list-tags').on('inserted.bs.popover', function () {
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
			// this.listView.find('.timaat-actor-list-tags').on('hidden.bs.popover', function () { actor.updateUI(); });
			// this.listView.find('.timaat-actor-list-tags').dblclick(function(ev) {ev.stopPropagation();});

			// attach user log info
			this.listView.find('.timaat-user-log').click(function(ev) {
				ev.practorDefault();
				ev.stopPropagation();
			});
			// attach actor handlers
			$(this.listView).click(this, function(ev) {
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();				
				// actor.listView.find('.timaat-actor-list-tags').popover('show');
			});
			$(this.listView).dblclick(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				// show metadata editor
				$('#timaat-actordatasets-actor-meta').data('actor', actor);
				$('#timaat-actordatasets-actor-meta').modal('show');			
			});			
			// remove handler
			this.listView.find('.timaat-actor-remove').click(this, function(ev) {
				ev.stopPropagation();
				TIMAAT.UI.hidePopups();				
				$('#timaat-actordatasets-actor-delete').data('actor', actor);
				$('#timaat-actordatasets-actor-delete').modal('show');
			});
		}

		updateUI() {
			// console.log("TCL: Actor -> updateUI -> updateUI()");
			// title
			var name = this.model.name;			
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-actor-list-title').text(name);
			// tag count
			// var count = this.model.tags.length + " Tags";
			// if ( this.model.tags.length == 0 ) count = "keine Tags";
			// if ( this.model.tags.length == 1 ) count = "ein Tag";
			// this.listView.find('.timaat-actor-list-count').text(count);
			// tags
			this.listView.find('.timaat-actor-list-tags i').attr('title', this.model.tags.length+" Tags");			
			if (this.model.tags.length == 0) this.listView.find('.timaat-actor-list-tags i').attr('class','fas fa-tag timaat-no-tags');
			else if (this.model.tags.length == 1) this.listView.find('.timaat-actor-list-tags i').attr('class','fas fa-tag text-dark').attr('title', "ein Tag");
			else this.listView.find('.timaat-actor-list-tags i').attr('class','fas fa-tags text-dark');		
		}

		remove() {
			console.log("TCL: Actor -> remove -> remove()");
			// remove actor from UI
			this.listView.remove(); // TODO remove tags from actor_has_tags
			// remove from categoryset list
			var index = TIMAAT.ActorDatasets.actors.indexOf(this);
			// if (index > -1) TIMAAT.ActorDatasets.actors.splice(index, 1);
			// remove from model list
			index = TIMAAT.ActorDatasets.actors.model.indexOf(this);
			if (index > -1) TIMAAT.ActorDatasets.actors.model.splice(index, 1);
		}	
	}
	
}, window));
