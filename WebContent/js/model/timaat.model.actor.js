/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
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
							`  <span class="actorDatasets`+type+`ListName">
							</span>
						</div>
						<div class="col-lg-2 float-right">
						  <div class="btn-group-vertical">
								<div class="text-muted timaat__user-log">
									<i class="fas fa-user"></i>
								</div>
						  </div>
						</div>
					</div>
				</li>`
			);

			// $('#actorDatasets'+type+'List').append(this.listView);
			// console.log("TCL: Actor -> constructor -> this.updateUI()");
			var actor = this; // save actor for system events

			this.updateUI();

			// attach user log info
			this.listView.find('.timaat__user-log').popover({
				placement: 'right',
				title: '<i class="fas fa-user"></i> editing log',
				trigger: 'click',
				html: true,
				content: '<div class="userLogDetails">Loading ...</div>',
				container: 'body',
				boundary: 'viewport',
			});

			this.listView.find('.timaat__user-log').on('show.bs.popover', function () {
				TIMAAT.UI.hidePopups();
			});

			this.listView.find('.timaat__user-log').on('inserted.bs.popover', function () {
				if (actor.model.lastEditedAt == null) {
					$('.userLogDetails').html(
						'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+actor.model.createdByUserAccountId+'">[ID '+actor.model.createdByUserAccountId+']</span></b><br>\
						'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				} else {
					$('.userLogDetails').html(
							'<b><i class="fas fa-plus-square"></i> Created by <span class="userId" data-user-id="'+actor.model.createdByUserAccountId+'">[ID '+actor.model.createdByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.createdAt)+'<br>\
							<b><i class="fas fa-edit"></i> Edited by <span class="userId" data-user-id="'+actor.model.lastEditedByUserAccountId+'">[ID '+actor.model.lastEditedByUserAccountId+']</span></b><br>\
							'+TIMAAT.Util.formatDate(actor.model.lastEditedAt)+'<br>'
					);
					$('.userLogDetails').find('.userId').each(function(index,item) {TIMAAT.Util.resolveUserID(item, "me")});
				}
			});

			// attach user log info
			this.listView.find('.timaat__user-log').on('click', function(ev) {
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
			if ( this.model.id < 0 ) name = "[not assigned]";
			this.listView.find('.actorDatasets'+type+'ListName').html(name);
			if (type == 'actor') {
				this.listView.find('.actorDatasetsActorListActorType').html(type);
			}

			// tag count
			// var count = this.model.tags.length + " tags";
			// if ( this.model.tags.length == 0 ) count = "No tags";
			// if ( this.model.tags.length == 1 ) count = "One Tag";
			// this.listView.find('.actorDatasetsActorListCount').text(count);
			// tags
			// this.listView.find('.actorDatasetsActorListTags i').attr('title', this.model.tags.length+" Tags");
			// if (this.model.tags.length == 0) this.listView.find('.actorDatasetsActorListTags i').attr('class','fas fa-tag dataset__no-tags');
			// else if (this.model.tags.length == 1) this.listView.find('.actorDatasetsActorListTags i').attr('class','fas fa-tag text-dark').attr('title', "one tag");
			// else this.listView.find('.actorDatasetsActorListTags i').attr('class','fas fa-tags text-dark');
		}

		remove() {
			// console.log("TCL: Actor -> remove -> remove()");
			// remove actor from UI
			this.listView.remove(); // TODO remove tags from actor_has_tags
      // console.log("TCL: Actor -> remove -> this", this);
			$('#actorFormMetadata').data('actor', null);
		}
	}

}, window));
