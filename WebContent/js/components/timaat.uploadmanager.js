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
		constructor(video, form) {
			this.video = video;
			this.form = form;
			this.state = 'init';
			this.ui = $(`<li class="list-group-item">
							<button type="button" class="upload-cancel btn float-right btn-outline-danger ml-2"><i class="fas fa-times-circle"></i></button>
							<span class="filename text-dark">[FILENAME]</span><br>
							<div class="progress">
								<div class="progress-bar bg-secondary" role="progressbar" style="width: 100%;">In der Warteschlange...</div>
							</div>
						</li>
			`);
			
			this.attachListeners();
			
			let filelist = $(form).find('.timaat-video-upload-file')[0].files;
			if ( filelist && filelist.length > 0 ) {
				this.filename = filelist[0].name;
				this.filesize = filelist[0].size;
				this.ui.find('.filename').text(this.filename);
			}
			
			let xhr = new XMLHttpRequest();
			this.xhr = xhr;
			$(form).off('submit'); $(form).off();

			let uploaditem = this;
			$(form).on('submit', function(e) {
		        //prevent regular form posting
		        e.preventDefault();
		        let oldpercent = 0;
		        xhr.upload.addEventListener('loadstart', function(event) {
		        	uploaditem.ui.find('.progress-bar').removeClass('bg-secondary').css('width', '0%').text('0%');
		        	console.log('UPLOAD::Start', uploaditem.video);
		        }, false);

		        xhr.upload.addEventListener('progress', function(event) {
		            var percent = (100 * event.loaded / event.total);
		            if ( oldpercent != percent.toFixed(1) ) {
		            	oldpercent = percent.toFixed(1);
//			            console.log('UPLOAD:Progress: ' + percent.toFixed(1)+'%', uploaditem.video);
			            uploaditem.ui.find('.progress-bar').css('width', percent.toFixed(1) + '%').text(percent.toFixed(1)+'%');
		            }
		        }, false);

		        xhr.upload.addEventListener('load', function(event) {
		        }, false);

		        xhr.addEventListener('readystatechange', function(event) {
		        	if ( uploaditem.state == 'abort' ) return;
		            if (event.target.readyState == 4) {
		            	if (event.target.status == 200) {
				            uploaditem.ui.find('.progress-bar').addClass('bg-success').css('width', '100%').text('Upload erfolgreich');
		            		uploaditem.state = 'done';
		            		console.log('UPLOAD::SUCCESS');
			            	var newvideo = JSON.parse(event.target.responseText);
							uploaditem.video.mediumVideo.status = newvideo.status;
							uploaditem.video.mediumVideo.width = newvideo.width;
							uploaditem.video.mediumVideo.height = newvideo.height;
							uploaditem.video.mediumVideo.length = newvideo.length;
							uploaditem.video.mediumVideo.frameRate = newvideo.frameRate;
							// send event
							$(document).trigger('success.upload.TIMAAT', uploaditem.video);
							
							// remove this item from upload manager
							TIMAAT.UploadManager.removeUpload(uploaditem);
		            	} else {
		            		uploaditem.state = 'fail';
			                console.log('UPLOAD FAILED: Error in the response.', event);
				            uploaditem.ui.find('.progress-bar').addClass('bg-danger').css('width', '100%').text('Upload fehlgeschlagen');
		            	}
		            } else console.log('STATE CHANGE: ',event);
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
			this.ui.find('button.upload-cancel').off('click').on('click', this, this._handleAbort);
		}
		
		startUpload() {
			if ( !this.state == 'init' ) return;
			this.state = 'upload';
			$(this.form).trigger('submit');
		}
		
		_handleAbort(event) {
			let uploaditem = event.data;
			console.log('UPLOAD::Canceled by user request', uploaditem);
			uploaditem.state = 'abort';
			uploaditem.xhr.abort(); // cancel transfer if active
			TIMAAT.UploadManager.removeUpload(uploaditem);
		}
		
		
	},

	// ----------------------------------------------------------------------------------------------------
	
	TIMAAT.UploadManager = {
			
		uploads : [],
		
		init: function() {
			
			TIMAAT.UploadManager.ui = $(`<div>
					<span class="timaat-uploads-message">keine aktiven Uploads</span>
					<ul class="timaat-upload-list list-group list-group-flush"></ul>
			</div>`);
			
			// init upload manager popover functionality
			$('#timaat-upload-manager').popover({
				placement: 'bottom',
				title: '<i class="fas fa-cloud-upload-alt"></i> Video Uploads',
				trigger: 'click',
				html: true,
				template: '<div class="popover timaat-upload-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
				content: `
				<div class="timaat-upload-details">
				</div>`,
				container: 'body',
				boundary: 'viewport',
			});
			$('#timaat-upload-manager').on('inserted.bs.popover', function () {
				$('.timaat-upload-details').append(TIMAAT.UploadManager.ui);
				for (let uploaditem of TIMAAT.UploadManager.uploads) uploaditem.attachListeners();
			});

			
		},
		
		isUploading: function(video) {
			for (let item of TIMAAT.UploadManager.uploads) if ( item.video.id == video.id ) return true;
			return false;
		},
		
		queueUpload: function(video, form) {
			if ( !video || !form ) return;
			for (let uploaditem of TIMAAT.UploadManager.uploads) if (uploaditem.video.id == video.id) return;
			let uploaditem = new TIMAAT.UploadItem(video, form);
			TIMAAT.UploadManager.uploads.push(uploaditem);
			// add UI
			TIMAAT.UploadManager.ui.find('ul.timaat-upload-list').append(uploaditem.ui);
			TIMAAT.UploadManager.ui.find('.timaat-uploads-message').hide();
			$('#timaat-upload-manager').removeClass('btn-secondary').removeClass('btn-info').addClass('btn-info');
						
			// send event
			$(document).trigger('added.upload.TIMAAT', video);
		},
		
		removeUpload: function(item) {
			if ( !item ) return;
			if ( TIMAAT.UploadManager.uploads.indexOf(item) < 0 ) return;
			item.ui.remove(); // remove UI;
			TIMAAT.UploadManager.uploads.splice(TIMAAT.UploadManager.uploads.indexOf(item),1);
			
			if ( TIMAAT.UploadManager.uploads.length == 0 ) {
				TIMAAT.UploadManager.ui.find('.timaat-uploads-message').show();
				$('#timaat-upload-manager').removeClass('btn-secondary').removeClass('btn-info').addClass('btn-secondary');
			}
			
			// send event
			$(document).trigger('removed.upload.TIMAAT', item.video);

		}
		
	}
	
}, window));
