(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.TIMAAT = {})));
}(this, (function (exports) { 'use strict';

	var version = "v0.Sprint-5b7 (2020-01-08)";

	document.title = 'TIMAAT - Client '+version;
	$('#timaat-version-info').text(version);
	
	exports.version = version;
	window.TIMAAT = exports;
	
})));