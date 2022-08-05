/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.TIMAAT = {})));
}(this, (function (exports) { 'use strict';

	var version = 'v0.15.3c-dev (2022-07-29)';

	document.title = 'TIMAAT - Client ' + version;
	$('#versionInfo').text(version);
	$('#titleInfo').text(`TIMAAT - Time-based Image Area Annotation Tool [` + version + ']');

	exports.version = version;
	window.TIMAAT = exports;

})));