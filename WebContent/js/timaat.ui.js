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
				
				// init components
				TIMAAT.VideoChooser.init();	   
				TIMAAT.VideoPlayer.init();
				TIMAAT.Settings.init();
				TIMAAT.Datasets.init();
				
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
			
			setWaiting: function(waiting) {
	   		console.log("TCL: setWaiting: function(waiting)");
	    	console.log("TCL: waiting", waiting);
				if (waiting) $('#timaat-ui-waiting').modal('show');
				else $('#timaat-ui-waiting').modal('hide');
			},
			
			processLogin: function() {
	    	// console.log("TCL: processLogin: function()");
				var user = jQuery('#timaat-login-user').val();
				var pass = jQuery('#timaat-login-pass').val();
				if ( user.length > 0 && pass.length > 0 ) {
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
						    TIMAAT.Service.session = e;
						    TIMAAT.Service.token = e.token;
						    $('body').removeClass('timaat-login-modal-open');
						    $('#timaat-login-modal').modal('hide');
						    $('#timaat-user-info').html(e.accountName);							
						    TIMAAT.VideoChooser.loadCollections();
							TIMAAT.Settings.loadCategorySets();
							TIMAAT.Datasets.load();
						  })
						  .fail(function(e) {
	       				console.log("TCL: processLogin fail: e", e);
						    console.log( "error",e );
						    jQuery('#timaat-login-message').fadeIn();
						  });
				}
			}			
	}
	
	
}, window));
