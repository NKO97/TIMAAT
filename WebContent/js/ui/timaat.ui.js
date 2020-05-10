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
	
	TIMAAT.UI = {
		component: null,
		
		init: function() {
			// console.log("TCL: UI: init: function()");
			$('[data-toggle="popover"]').popover();
			
			this.templates = {
					notification: `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
						<div class="toast-header">
							<span class="notification-action-color badge"><i class="notification-action fas fa-fw"></i></span>
							&nbsp;<strong class="notification-user mr-auto">(unbekannt)</strong>
							<small class="notification-time text-muted">jetzt</small>
							<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						</div>
						<div class="notification-message toast-body"></div>
					</div>`,
			}
			
			// init components
			TIMAAT.Datasets.init();
			TIMAAT.UploadManager.init();
			TIMAAT.VideoChooser.init();	 
			TIMAAT.VideoPlayer.init();
			TIMAAT.Settings.init();
			
			// After login show media library
			TIMAAT.UI.showComponent('videochooser');

			$('#timaat-login-user').on('keyup', function (e) { if (e.keyCode == 13) jQuery('#timaat-login-submit').click(); });
			$('#timaat-login-pass').on('keyup', function (e) { if (e.keyCode == 13) jQuery('#timaat-login-submit').click(); });
			$('#timaat-login-submit').on('click', TIMAAT.UI.processLogin);
			if ( TIMAAT.Service.state != 1 ) {
				$('body').addClass('timaat-login-modal-open');
				$('#timaat-login-modal').modal('show');
			}
			
			// init tag popover functionality
			$(document).on('click', function (e) {
				$('[data-toggle="popover"],[data-original-title]').each(function () {
					if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
						(($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false
					}
				});
			});
							
			// init user log popover functionality
			$('#timaat-user-log-list').popover({
				placement: 'bottom',
				title: '<i class="fas fa-user"></i> Bearbeitungslog',
				trigger: 'click',
				html: true,
				content: '<div class="timaat-user-log-details">Lade...</div>',
				container: 'body',
				boundary: 'viewport',
			});
			
			$('#timaat-user-log-list').on('inserted.bs.popover', function () {
				TIMAAT.Service.getUserLog(TIMAAT.Service.session.id, 12, function(log) {
					var html = '';
					if ( log.length == 0 ) html = "Keine Daten vorhanden";
				$(log).each(function(index, entry) {
					var icon = 'fas fa-info';
					switch (entry.userLogEventType.type) {
					case 'login':
						icon = 'fas fa-sign-in-alt';
						break;
					case 'userCreated':
					case 'mediumCreated':
					case 'analysislistCreated':			    			
					case 'annotationCreated':
						icon = 'fas fa-plus-square';
						break;
					case 'mediumEdited':
					case 'analysislistEdited':			    			
					case 'analysislistDeleted':
						icon = 'fas fa-edit';
						break;
					case 'mediumDeleted':
					case 'analysislistDeleted':			    			
					case 'annotationDeleted':
						icon = 'fas fa-trash-alt';
						break;
					}

					html += '<b><i class="'+icon+'"></i> '+TIMAAT.Util.formatLogType(entry.userLogEventType.type)
								+'</b><br>'+TIMAAT.Util.formatDate(entry.dateTime)+'<br>';
				});
				$('.timaat-user-log-details').html(html);
					
				$(log).each(function(index, entry) {TIMAAT.Service.idCache.set(entry.userAccount.id, entry.userAccount.accountName);});
				//	$('.timaat-user-log-details').find('.timaat-user-id').each(function(index,item) {TIMAAT.Util.resolveUserID(item,"ich")});
				});
			});

			$.datetimepicker.setDateFormatter('moment');
		},
		
		hidePopups: function() {
			// console.log("TCL: hidePopups: function()");
			$('[data-toggle="popover"],[data-original-title]').each(function () {
				(($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false
			});
		},
		
		showComponent: function(component) {
			// console.log("TCL: showComponent: function(component)");
			// console.log("TCL: component", component);
			TIMAAT.UI.component = component;
			TIMAAT.VideoPlayer.pause(); // TODO refactor
			$('.timaat-component').hide();
			$('.timaat-sidebar-tab').removeClass('bg-info');
			$('.timaat-sidebar-tab a').removeClass('selected');
			$('#timaat-component-'+component).show();
			$('.timaat-sidebar-tab-'+component).addClass('bg-info');
			$('.timaat-sidebar-tab-'+component+' a').addClass('selected');
		},
		
		receiveNotification(notificationEvent) {
			try {
				console.log("notification event", notificationEvent);
				let notification = JSON.parse(notificationEvent.data);
				console.log("notification data", notification);
				// TODO refactor
				// only show if notification is for current list
				if ( TIMAAT.VideoPlayer.curList && TIMAAT.VideoPlayer.curList.id == notification.dataID ) {
					TIMAAT.UI.showNotification( notification );
					// trigger local event and action
					console.log("trigger ",notification.message+'.notification.TIMAAT');
					$(document).trigger(notification.message+'.notification.TIMAAT', notification);
				}
			} catch(e) {
				console.log("notification error", e);
			}
		},
		
		sendNotification(type, dataID=0, data=null) {
			if ( !this.notificationSocket || this.notificationSocket.readyState == WebSocket.CLOSED ) {
				// init websocket
				let protocol = ( location.protocol == 'http:') ? 'ws://' : 'wss://';
				this.notificationSocket = new WebSocket(protocol+location.host+location.pathname+'api/notification');
				let request = type;
				let storedID = dataID;
				this.notificationSocket.onopen = function() {
					// send notification request to server
					TIMAAT.UI.notificationSocket.send( JSON.stringify({token:TIMAAT.Service.token,request:request,dataID:storedID}) );
				}
				this.notificationSocket.onmessage = TIMAAT.UI.receiveNotification;
				// send notification request to server
			} else this.notificationSocket.send( JSON.stringify({token:TIMAAT.Service.token,request:type,dataID:dataID}) );

		},
		
		showNotification(notification) {
			if (!notification) return;
			let ui = $(this.templates.notification);
			let color = 'badge-info';
			let action = 'fa-question';
			let user = notification.username;
			let message = 'hat eine unbekannte Aktion durchgeführt';
			
			// parse and style notification
			switch (notification.message) {
				case 'subscribe-list':
					color = 'badge-primary';
					action = 'fa-eye';
					message = 'aktuelle Liste geöffnet'
					break;
				case 'unsubscribe-list':
					color = 'badge-secondary';
					action = 'fa-eye';
					message = 'aktuelle Liste geschlossen'
					break;
				case 'add-segment':
					color = 'badge-success';
					action = 'fa-plus';
					message = 'Segment <strong>"'+notification.data.analysisSegmentTranslations[0].name+'"</strong> hinzugefügt';
					break;
				case 'edit-segment':
					color = 'badge-warning';
					action = 'fa-edit';
					message = 'Segment <strong>"'+notification.data.analysisSegmentTranslations[0].name+'"</strong> bearbeitet';
					break;
				case 'remove-segment':
					color = 'badge-danger';
					action = 'fa-trash-alt';
					message = 'Segment <strong>"'+notification.data.analysisSegmentTranslations[0].name+'"</strong> gelöscht';
					break;
				case 'add-annotation':
					color = 'badge-success';
					action = 'fa-plus';
					message = 'Annotation <strong>"'+notification.data.title+'"</strong> hinzugefügt';
					break;
				case 'edit-annotation':
					color = 'badge-warning';
					action = 'fa-edit';
					message = 'Annotation <strong>"'+notification.data.title+'"</strong> bearbeitet';
					break;
				case 'remove-annotation':
					color = 'badge-danger';
					action = 'fa-trash-alt';
					message = 'Annotation <strong>"'+notification.data.title+'"</strong> gelöscht';
					break;
				default:
					message = 'unbekannte Aktion: '+notification.message;
					break;
			}
			ui.find('.notification-action-color').addClass(color);
			ui.find('.notification-action').addClass(action);
			ui.find('.notification-user').text(user);
			ui.find('.notification-message').html(message);
			
			$('#timaat-notification-pane').append(ui);
			// display notification
			ui.toast({delay:3000})
			.on('hidden.bs.toast',function(){$(this).toast('dispose').remove();})
			.toast('show');
		},
		
		
		setWaiting: function(waiting) {
			console.log("TCL: setWaiting: function(waiting)");
			console.log("TCL: waiting", waiting);
			if (waiting) $('#timaat-ui-waiting').modal('show');
			else $('#timaat-ui-waiting').modal('hide');
		},
		
		setLoginEnabled: function(enabled) {
			$('#timaat-login-user').prop('disabled', !enabled);
			$('#timaat-login-pass').prop('disabled', !enabled);
			$('#timaat-login-submit').prop('disabled', !enabled);
			if ( enabled ) $('#timaat-login-submit i.login-spinner').addClass('d-none');
			else $('#timaat-login-submit i.login-spinner').removeClass('d-none');
		},
		
		processLogin: function() {
			// console.log("TCL: processLogin: function()");
			var user = jQuery('#timaat-login-user').val();
			var pass = jQuery('#timaat-login-pass').val();
			if ( user.length > 0 && pass.length > 0 ) {
				TIMAAT.UI.setLoginEnabled(false);
				
				setTimeout(function() {
					var hash = TIMAAT.Util.getArgonHash(pass,user+"timaat.kunden.bitgilde.de"); // TODO refactor
					var credentials = {
						username : user,
						password: hash
					}
			
					$.ajax({
						// url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/authenticate",
						url:"api/authenticate",
						type:"POST",
						data:JSON.stringify(credentials),
						contentType:"application/json; charset=utf-8",
						dataType:"json",
					}).done(function(e) {
						TIMAAT.UI.setLoginEnabled(true);
						TIMAAT.Service.session = e;
						TIMAAT.Service.token = e.token;
						$('body').removeClass('timaat-login-modal-open');
						$('#timaat-login-modal').modal('hide');
						$('#timaat-user-info').html(e.accountName);							
						TIMAAT.VideoChooser.loadCollections();
						TIMAAT.MediaDatasets.loadMediaDatatables();
						TIMAAT.ActorDatasets.loadActorDatatables();
						TIMAAT.Settings.loadCategorySets();
						TIMAAT.Datasets.load();
						// load categories
						TIMAAT.Settings.loadCategories(null,true);
					}).fail(function(e) {
						TIMAAT.UI.setLoginEnabled(true);
						console.log("TCL: processLogin fail: e", e);
						console.log( "error",e );
						jQuery('#timaat-login-message').fadeIn();
					});
				}, 50);
			}
		}			
	}
	
	
}, window));
