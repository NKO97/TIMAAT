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
	
	TIMAAT.ActorDatasets = {
		actors: null,

		init: function() {   
			TIMAAT.ActorDatasets.initActors();
		},

		load: function() {
			TIMAAT.ActorDatasets.loadActors();
		},

		initActors: function() {
			// console.log("TCL: ActorDatasets: initActors: function()");
			// attach tag editor
			$('#timaat-actor-tags').popover({
				placement: 'right',
				title: 'Actor Tags bearbeiten (datasets init function)',
				trigger: 'click',
				html: true,
				content: `<div class="input-group">
										<input class="form-control timaat-tag-input" type="text" value="">
									</div>`,
				container: 'body',
				boundary: 'viewport',				
			});
			$('#timaat-actor-tags').on('inserted.bs.popover', function () {
				var tags = "";
				if ( actor == null ) {
					$('.timaat-tag-input').html('Kein Actor geladen');
					return;
				} else {
					$('.timaat-tag-input').html('');					
				}
				actor.tags.forEach(function(item) { tags += ','+item.name });
				tags = tags.substring(1);
				$('.timaat-tag-input').val(tags);
			    $('.timaat-tag-input').tagsInput({
			    	placeholder: 'Actor Tag hinzufügen (datasets init function)',
			    	onAddTag: function(taginput,tag) {
			    		TIMAAT.ActorService.addActorTag(actor, tag, function(newtag) {
			    			TIMAAT.VideoPlayer.model.video.tags.push(newtag);
			    		});
			    	},
			    	onRemoveTag: function(taginput,tag) {
			    		TIMAAT.ActorService.removeActorTag(actor, tag, function(tagname) {
			    			// find tag in model
			    			var found = -1;
			    			TIMAAT.VideoPlayer.model.video.tags.forEach(function(item, index) {
			    				if ( item.name == tagname ) found = index;
			    			});
			    			if (found > -1) TIMAAT.VideoPlayer.model.video.splice(found, 1);
			    		});
			    	},
			    	onChange: function() {
			    		if ( this.length == 1) $('#'+this[0].id+'_tag').focus();
			    	}
			    });
			});
			$('#timaat-actor-tags').on('hidden.bs.popover', function () { 
			});
			// delete actor functionality
			$('#timaat-actor-delete-submit').click(function(ev) {
				var modal = $('#timaat-actordatasets-actor-delete');
				var actor = modal.data('actor');
				if (actor) TIMAAT.ActorDatasets._actorRemoved(actor);
				modal.modal('hide');
			});
			// add actor button
			$('#timaat-actor-add').attr('onclick','TIMAAT.ActorDatasets.addActor()');
			// add/edit actor functionality
			$('#timaat-actordatasets-actor-meta').on('show.bs.modal', function (ev) {
				// console.log("TCL: Create/Edit actor window setup");
				var modal = $(this);
				var actor = modal.data('actor');
				var heading = (actor) ? "Actor bearbeiten" : "Actor hinzufügen";
				var submit = (actor) ? "Speichern" : "Hinzufügen";
				var title = (actor) ? actor.model.name : "";

				// setup UI
				$('#actorMetaLabel').html(heading);
				$('#timaat-actor-meta-submit').html(submit);
				$("#timaat-actor-meta-title").val(title).trigger('input');
			});
			// Submit actor data
			$('#timaat-actor-meta-submit').click(function(ev) {
				// console.log("TCL: Create/Edit actor window submitted data validation");
				var modal = $('#timaat-actordatasets-actor-meta');
				var actor = modal.data('actor');
				var title = $("#timaat-actor-meta-title").val();
				if (actor) {
					actor.model.name = title;
					// console.log("TCL: actor.updateUI() - ActorDatasets:init:function()");
					// console.log("TCL: Take values from form:")
					// console.log("TCL: $(\"#timaat-actor-meta-title\").val():", $("#timaat-actor-meta-title").val());
					actor.updateUI();
					TIMAAT.ActorService.updateActor(actor);
				} else {
					TIMAAT.ActorService.createActor(title, TIMAAT.ActorDatasets._actorAdded); // TODO add actor parameters
				}
				modal.modal('hide');
			});
			//  validate actor data
			$('#timaat-actor-meta-title').on('input', function(ev) {
				// console.log("TCL: allow saving only if data is valid");
				if ( $("#timaat-actor-meta-title").val().length > 0 ) {
					$('#timaat-actor-meta-submit').prop("disabled", false);
					$('#timaat-actor-meta-submit').removeAttr("disabled");
				} else {
					$('#timaat-actor-meta-submit').prop("disabled", true);
					$('#timaat-actor-meta-submit').attr("disabled");
				}
			});
		},

		loadActors: function() {
    	// console.log("TCL: loadActors: function()");
			// load actors
			TIMAAT.ActorService.listActors(TIMAAT.ActorDatasets.setActorLists);
		},
		
		setActorLists: function(actors) {
    // console.log("TCL: setActorLists: function(actors)");
    // console.log("TCL: actors", actors);
			if ( !actors ) return;
			$('#timaat-actor-list-loader').remove();
			// clear old UI list
			$('#timaat-actor-list').empty();
			// setup model
			var acts = Array();
			actors.forEach(function(actor) { if ( actor.id > 0 ) acts.push(new TIMAAT.Actor(actor)); });
			TIMAAT.ActorDatasets.actors = acts;
			TIMAAT.ActorDatasets.actors.model = actors;			
		},
		
		addActor: function() {	
    console.log("TCL: addActor: function()");
			$('#timaat-actordatasets-actor-meta').data('actor', null);
			$('#timaat-actordatasets-actor-meta').modal('show');
		},

		_actorAdded: function(actor) {
    	console.log("TCL: _actorAdded: function(actor)");
    	console.log("TCL: actor", actor);
			TIMAAT.ActorDatasets.actors.model.push(actor);
			TIMAAT.ActorDatasets.actors.push(new TIMAAT.Actor(actor));
		},

		_actorRemoved: function(actor) {
    console.log("TCL: _actorRemoved: function(actor)");
    console.log("TCL: actor", actor);
			// sync to server
			TIMAAT.ActorService.removeActor(actor);			
			actor.remove();	
			// if ( TIMAAT.VideoPlayer.curActor == actor ) TIMAAT.VideoPlayer.setActor(null);		
		},

	}
	
}, window));
