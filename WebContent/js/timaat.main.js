(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.TIMAAT = {})));
}(this, (function (exports) { 'use strict';

	// var today = new Date();
	// var dd = String(today.getDate()).padStart(2, '0');
	// var mm = String(today.getMonth() + 1).padStart(2, '0');
	// var yyyy = today.getFullYear();	
	// today = yyyy + '-' + mm + '-' + dd;

	var version = 'v0.10.2c-dev (2020-11-25)';

	document.title = 'TIMAAT - Client '+version;
	$('#timaat-version-info').text(version);
	
	exports.version = version;
	window.TIMAAT = exports;
	
})));