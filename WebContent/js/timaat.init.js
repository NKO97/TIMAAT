requirejs.config({
	baseUrl: 'js',
	paths: {
		"argon2":					'../vendor/argon2/argon2-asm.min',
		"jquery": 					'../vendor/jquery/jquery.min',
		"jquery-ui":				'../vendor/jquery/plugins/jquery-ui/jquery-ui.min',
		"jquery-validate":			'../vendor/jquery/plugins/jquery.validate',
		"jquery-datetime":			'../vendor/jquery/plugins/jquery-datetimepicker/jquery.datetimepicker.full',
		"jquery-tinycolorpicker":	'../vendor/tinycolorpicker/jquery.tinycolorpicker',
		"jquery-dropzone":			'../vendor/dropzone/dropzone',
		"bootstrap":				'../vendor/bootstrap/js/bootstrap.bundle.min',
		"datatables":				'../vendor/datatables/datatables.min',
		"datatables.net" : '../vendor/datatables/DataTables-1.10.20/js/jquery.dataTables.min',
		"datatables.net-bs" : '../vendor/dataTables/DataTables-1.10.20/js/dataTables.bootstrap.min',
		"leaflet":					'../vendor/leaflet/leaflet',
		"leaflet-editable":			'../vendor/leaflet/plugins/Leaflet.Editable/src/Leaflet.Editable',
		"leaflet-pathdrag":			'../vendor/leaflet/plugins/Path.Drag.js/src/Path.Drag',
		"leaflet-customcontrol":	'../vendor/leaflet/plugins/Leaflet.Control.Custom/Leaflet.Control.Custom',
		"leaflet-sidebar":			'../vendor/leaflet/plugins/leaflet-sidebar-v2/js/leaflet-sidebar.min',
		"moment":					'../vendor/moment/moment',
		"popper":					'../vendor/popper/popper.min',
		"sbadmin2":					'sb-admin-2',
		"timaathtml":				'timaat.html',		
		"TIMAAT":					'timaat.main',
		"TIMAAT-ui":				'timaat.ui',
		"TIMAAT-videochooser":		'components/timaat.component.videochooser',
		"TIMAAT-videoplayer":		'components/timaat.component.videoplayer',
		"TIMAAT-settings":			'components/timaat.component.settings',
		"TIMAAT-datasets":			'datasets/timaat.datasets',
		"TIMAAT-actordatasets":		'datasets/timaat.datasets.actor',
		"TIMAAT-eventdatasets":		'datasets/timaat.datasets.event',
		"TIMAAT-locationdatasets":	'datasets/timaat.datasets.location',
		"TIMAAT-mediadatasets":		'datasets/timaat.datasets.media',
		"TIMAAT-service":			'service/timaat.service',
		"TIMAAT-actorservice":		'service/timaat.service.actor',
		"TIMAAT-locationservice":	'service/timaat.service.location',		
		"TIMAAT-mediaservice":		'service/timaat.service.media',
		"TIMAAT-eventservice":		'service/timaat.service.event',
		"TIMAAT-util":				'timaat.util',
		"TIMAAT-marker":			'model/timaat.marker',
		"TIMAAT-annotation":		'model/timaat.annotation', 
		"TIMAAT-categoryset":		'model/timaat.categoryset', 
		"TIMAAT-analysissegment":	'model/timaat.analysissegment',
		"TIMAAT-actor":				'model/timaat.model.actor',
		"TIMAAT-actortype":				'model/timaat.model.actortype', 
		"TIMAAT-event":				'model/timaat.model.event',
		"TIMAAT-medium":			'model/timaat.model.medium', 
		"TIMAAT-mediatype":			'model/timaat.model.mediatype', 
		"TIMAAT-location":			'model/timaat.model.location', 
		"TIMAAT-locationtype":		'model/timaat.model.locationtype', 
		"TIMAAT-country":			'model/timaat.model.location.country', 
		"TIMAAT-province":			'model/timaat.model.location.province', 
		"TIMAAT-county":			'model/timaat.model.location.county', 
		"TIMAAT-city":				'model/timaat.model.location.city', 
		"TIMAAT-street":			'model/timaat.model.location.street', 

	}, 
	shim: {
		'jquery': { exports: 'jquery' },
		'jquery-ui': { deps: [ 'jquery' ], exports: 'jQuery.ui' },
		'jquery-validate': { deps: [ 'jquery' ], exports: 'jQuery.validate' },
		'jquery-datetime': { deps: [ 'jquery' ], exports: 'jQuery.datetimepicker' },
		'jquery-tinycolorpicker': { deps: [ 'jquery' ], exports: 'jQuery.tinycolorpicker' },
		'jquery-dropzone': { deps: [ 'jquery' ], exports: 'jQuery.dropzone' },
		'bootstrap': { deps: ['jquery'], },
		'leaflet-editable': { deps: ['leaflet'], },
		'leaflet-pathdrag': { deps: ['leaflet'], exports: 'L.PathDraggable' },
		'leaflet-customcontrol': { deps: ['leaflet'], },
		'leaflet-sidebar': { deps: ['leaflet'], },
		'moment': { deps: [ 'jquery' ], exports: 'moment' },
		'datatables': { deps: [ 'bootstrap', 'jquery' ] },
	}
});

require(['domReady',
	'jquery',
	'jquery-ui',
	'jquery-validate',
	'jquery-datetime',
	'jquery-tinycolorpicker',
	'jquery-dropzone',

	'popper',
	'bootstrap',
	
	'argon2',
	
	'leaflet',
	'leaflet-editable',
	'leaflet-pathdrag',
	'leaflet-customcontrol',
	'leaflet-sidebar',
	], function (domReady) { domReady(function () {
	  console.log("TIMAAT::Init");
	  requirejs(['moment', 'datatables', 'sbadmin2', 'timaathtml', 
		  'TIMAAT', 'TIMAAT-ui', 'TIMAAT-videochooser', 'TIMAAT-videoplayer', 'TIMAAT-settings', 'TIMAAT-util', 
		  'TIMAAT-datasets', 'TIMAAT-actordatasets', 'TIMAAT-eventdatasets', 'TIMAAT-locationdatasets', 'TIMAAT-mediadatasets',
		  'TIMAAT-service', 'TIMAAT-actorservice', 'TIMAAT-locationservice', 'TIMAAT-mediaservice', 'TIMAAT-eventservice',
			'TIMAAT-marker', 'TIMAAT-annotation', 'TIMAAT-categoryset', 'TIMAAT-analysissegment',
			'TIMAAT-medium', 'TIMAAT-mediatype',
			'TIMAAT-actor', 'TIMAAT-actortype',
			'TIMAAT-location', 'TIMAAT-locationtype', 'TIMAAT-country', 'TIMAAT-province', 'TIMAAT-county', 'TIMAAT-city', 'TIMAAT-street',
			'TIMAAT-event', 
		  
		  ], function (moment) {
		  console.log("TIMAAT::Setup");
		  window.moment = moment;		  
		  
			var map = L.map('map', {
				zoomControl: false,
				attributionControl: false,
				zoom: 1,
				maxZoom: 0,
				center: [0,0],
				crs: L.CRS.Simple,
				editable: true,		
			});
			
			window.map = map; // TODO refactor	
			map.on('layeradd', function(ev) {
				if ( ev.layer.options.data ) 
					ev.layer.eachLayer(function (layer) {
						if ( !layer.options.editable ) layer.enableEdit();
						layer.options.editable = true;
					});
			});
			
			var bounds = [[450,0], [0,800]];
			map.setMaxBounds(bounds);
			map.fitBounds(bounds);	
			map.dragging.disable();
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();

			$(window).resize(function() {
				TIMAAT.VideoPlayer.markerList.forEach(function(marker) {
					marker._updateElementOffset();
				});
			});
			
			TIMAAT.UI.init();

			console.log("TIMAAT::Ready");

	  });
	  
		  
  });
});
