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

	TIMAAT.Language = class Language {
    constructor(model) {
      // console.log("TCL: Language -> constructor -> model", model);
			// setup model
			this.model = model;

			// create and style list view element
			this.listView = $(
				`<li class="list-group-item">
					<div class="row">
						<div class="col-lg-10">` +
							`<span class="timaat-languagelists-language-list-name">
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

			// $('#timaat-languagelists-language-list').append(this.listView);
			// console.log("TCL: Language -> constructor -> this.updateUI()");    
			var language = this; // save language for system events

			this.updateUI();  

			// attach language handlers
			$(this.listView).on('click', this, function(ev) {
				// console.log("TCL: Language -> constructor -> open language datasheet");
				ev.stopPropagation();
				// show tag editor - trigger popup
				TIMAAT.UI.hidePopups();
				$('.form').hide();
				$('.languages-nav-tabs').show();
				$('.languages-data-tabs').hide();
				$('.nav-tabs a[href="#languageDatasheet"]').tab('show');
				$('#timaat-languagelists-metadata-form').data('language', language);
				TIMAAT.LanguageLists.languageFormDataSheet('show', language);
			});
    }

		updateUI() {
			var name = this.model.name;
			if ( this.model.id < 0 ) name = "[nicht zugeordnet]";
			this.listView.find('.timaat-languagelists-language-list-name').text(name);
	
		}

		remove() {
			// remove language from UI
			this.listView.remove();
      console.log("TCL: Language -> remove -> this", this);
			$('#timaat-languagelists-metadata-form').data('language', null);
			// remove from languageset lists
			var index;
			for (var i = 0; i < TIMAAT.LanguageLists.languages.length; i++) {
				if (TIMAAT.LanguageLists.languages[i].model.id == this.model.id) {
					index = i;
					break;
				}
			}
			if (index > -1) {
				TIMAAT.LanguageLists.languages.splice(index, 1);
				TIMAAT.LanguageLists.languages.model.splice(index, 1);
			}
		}
	}
	
}, window));
