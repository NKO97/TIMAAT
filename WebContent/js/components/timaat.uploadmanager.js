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

	TIMAAT.UploadItem = class UploadItem {
		constructor(medium, type, form) {
			this.medium = medium;
			this.form = form;
			this.state = 'init';
			this.ui = $(`<li class="list-group-item">
							<button type="button" class="cancelUpload btn float-right btn-outline-danger ml-2"><i class="fas fa-times-circle"></i></button>
							<span class="filename text-dark">[FILENAME]</span><br>
							<div class="progress">
								<div class="progressBar progress-bar bg-secondary width--100" role="progressbar">In queue...</div>
							</div>
						</li>
			`);

			this.attachListeners();

			let fileList = $(form).find('.mediumUploadFile')[0].files;
			if ( fileList && fileList.length > 0 ) {
				this.filename = fileList[0].name;
				this.fileSize = fileList[0].size;
				this.ui.find('.filename').text(this.filename);
			}

			let xhr = new XMLHttpRequest();
			this.xhr = xhr;
			$(form).off('submit'); $(form).off();

			let uploadItem = this;
			$(form).on('submit', function(e) {
				//prevent regular form posting
				e.preventDefault();
				let oldPercent = 0;
				xhr.upload.addEventListener('loadstart', function(event) {
					uploadItem.ui.find('.progressBar').removeClass('bg-secondary').css('width', '0%').text('0%');
					console.info('UPLOAD::Start', uploadItem.medium);
				}, false);

				xhr.upload.addEventListener('progress', function(event) {
						var percent = (100 * event.loaded / event.total);
						if ( oldPercent != percent.toFixed(1) ) {
							oldPercent = percent.toFixed(1);
	//			            console.log('UPLOAD:Progress: ' + percent.toFixed(1)+'%', uploadItem.video);
							uploadItem.ui.find('.progressBar').css('width', percent.toFixed(1) + '%').text(percent.toFixed(1)+'%');
						}
				}, false);

				xhr.upload.addEventListener('load', function(event) {
				}, false);

				xhr.addEventListener('readystatechange', function(event) {
					if ( uploadItem.state == 'abort' ) return;
					if (event.target.readyState == 4) {
						if (event.target.status == 200) {
							uploadItem.ui.find('.progressBar').addClass('bg-success').css('width', '100%').text('Upload successful');
							uploadItem.state = 'done';
							console.info('UPLOAD::SUCCESS');
							switch (type) {
								case 'audio':
									let newAudio = JSON.parse(event.target.responseText);
									uploadItem.medium.mediumAudio.length = newAudio.length;
								break;
								case 'image':
									var newImage = JSON.parse(event.target.responseText);
									uploadItem.medium.mediumImage.width = newImage.width;
									uploadItem.medium.mediumImage.height = newImage.height;
									// uploadItem.medium.mediumImage.bitDepth = newImage.bitDepth;
								break;
								case 'video':
									var newVideo = JSON.parse(event.target.responseText);
									uploadItem.medium.mediumVideo.width = newVideo.width;
									uploadItem.medium.mediumVideo.height = newVideo.height;
									uploadItem.medium.mediumVideo.length = newVideo.length;
									uploadItem.medium.mediumVideo.frameRate = newVideo.frameRate;
									// send event
									// $(document).trigger('success.upload.TIMAAT', uploadItem.medium);
								break;
							}
							// send event
							$(document).trigger('success.upload.medium.TIMAAT', uploadItem.medium);

							// remove this item from upload manager
							TIMAAT.UploadManager.removeUpload(uploadItem);
						} else {
							uploadItem.state = 'fail';
								console.error('UPLOAD FAILED: Error in the response.', event);
							uploadItem.ui.find('.progressBar').addClass('bg-danger').css('width', '100%').text('Upload failed');
						}
					} else console.info('STATE CHANGE: ', event);
				}, false);

				// posting the form with the same method and action as specified by the HTML markup
				xhr.open(this.getAttribute('method'), this.getAttribute('action'), true);
				xhr.setRequestHeader('Authorization', 'Bearer '+TIMAAT.Service.token);
				xhr.send(new FormData(this));

				this.reset();
			});

			// start upload immediately for now --> this can later be used to queue video uploads
			this.startUpload();
		}

		attachListeners() {
			this.ui.find('button.cancelUpload').off('click').on('click', this, this._handleAbort);
		}

		startUpload() {
			if ( !this.state == 'init' ) return;
			this.state = 'upload';
			$(this.form).trigger('submit');
		}

		_handleAbort(event) {
			let uploadItem = event.data;
			console.info('UPLOAD::Canceled by user request', uploadItem);
			uploadItem.state = 'abort';
			uploadItem.xhr.abort(); // cancel transfer if active
			TIMAAT.UploadManager.removeUpload(uploadItem);
		}


	},

	// ----------------------------------------------------------------------------------------------------

	TIMAAT.UploadManager = {

		uploads : [],

		init: function() {

			TIMAAT.UploadManager.ui = $(`<div>
					<span class="uploadsMessage">no active uploads</span>
					<ul class="upload__list list-group list-group-flush"></ul>
			</div>`);

			// init upload manager popover functionality
			$('#uploadManager').popover({
				placement: 'bottom',
				title: '<i class="fas fa-cloud-upload-alt"></i> Video uploads',
				trigger: 'click',
				html: true,
				template: '<div class="popover uploadPopover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
				content: `
				<div class="uploadDetails">
				</div>`,
				container: 'body',
				boundary: 'viewport',
			});
			$('#uploadManager').on('inserted.bs.popover', function () {
				$('.uploadDetails').append(TIMAAT.UploadManager.ui);
				for (let uploadItem of TIMAAT.UploadManager.uploads) uploadItem.attachListeners();
			});
		},

		isUploading: function(medium) {
			for (let item of TIMAAT.UploadManager.uploads) if ( item.medium.id == medium.id ) return true;
			return false;
		},

		queueUpload: function(medium, form) {
			if ( !medium || !form ) return;
			for (let uploadItem of TIMAAT.UploadManager.uploads) if (uploadItem.medium.id == medium.id) return;
			let uploadItem = new TIMAAT.UploadItem(medium, medium.mediaType.mediaTypeTranslations[0].type, form);
			TIMAAT.UploadManager.uploads.push(uploadItem);
			// add UI
			TIMAAT.UploadManager.ui.find('ul.upload__list').append(uploadItem.ui);
			TIMAAT.UploadManager.ui.find('.uploadsMessage').hide();
			$('#uploadManager').removeClass('btn-secondary').removeClass('btn-info').addClass('btn-info');

			// send event
			$(document).trigger('added.upload.TIMAAT', medium);
		},

		removeUpload: function(item) {
			if ( !item ) return;
			if ( TIMAAT.UploadManager.uploads.indexOf(item) < 0 ) return;
			item.ui.remove(); // remove UI;
			TIMAAT.UploadManager.uploads.splice(TIMAAT.UploadManager.uploads.indexOf(item),1);

			if ( TIMAAT.UploadManager.uploads.length == 0 ) {
				TIMAAT.UploadManager.ui.find('.uploadsMessage').show();
				$('#uploadManager').removeClass('btn-secondary').removeClass('btn-info').addClass('btn-secondary');
			}

			// send event
			$(document).trigger('removed.upload.TIMAAT', item.medium);

		}

	}

}, window));
