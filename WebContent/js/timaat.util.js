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
	
	TIMAAT.Util = {
		serverprefix: "",
		
		formatTime: function(seconds, withFraction = false) {
    // console.log("TCL: formatTime: function(seconds, withFraction = false)");
    // console.log("TCL:   -> seconds", seconds);
    // console.log("TCL:   -> withFraction = false", withFraction);
			var hours = Math.floor(seconds / 60 / 60);
			var mins = Math.floor((seconds-(hours*60*60)) / 60);
			var secs = seconds - ((hours*60*60)+(mins*60));
			secs = Math.floor(secs);
			
			var time = "";
			if ( hours >0  ) time += hours+":";
			if (mins < 10 ) time += "0";
			time += mins+":";
			if (secs < 10 ) time += "0";
			time += secs;
						
			var fraction = seconds - ((hours*60*60) + (mins * 60) + secs);

			if ( withFraction ) time += "."+fraction.toFixed(3).substring(2);

			return time;
		},
		
		formatDate: function (timestamp) {
    // console.log("TCL: formatDate: function (timestamp)");
    // console.log("TCL:   -> timestamp", timestamp);
			  var a = new Date(timestamp);
//			  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
			  var year = a.getFullYear();
			  var month = ("0" + (a.getMonth()+1)).substr(-2);
			  var date = ("0" + a.getDate()).substr(-2);
			  var hour = ("0" + a.getHours()).substr(-2);
			  var min = ("0" + a.getMinutes()).substr(-2);
			  var sec = ("0" + a.getSeconds()).substr(-2);
			  var time = date + '.' + month + '.' + year + ', ' + hour + ':' + min + ':' + sec ;
			  return time;
		},
		
		formatLogType: function(type) {
    // console.log("TCL: formatLogType: function(type)");
    // console.log("TCL:   -> type", type);
			var display = '['+type+']';
			
			switch (type) {
			case 'login':
				type = 'Anmeldung API';
				break;
			case 'mediumCreated':
				type = 'Video Upload';
				break;
			case 'analysislistCreated':
				type = 'Analyseliste angelegt';
				break;
			case 'analysislistEdited':
				type = 'Analyseliste bearbeitet';
				break;
			case 'analysislistDeleted':
				type = 'Analyseliste gelöscht';
				break;
			case 'annotationCreated':
				type = 'Annotation angelegt';
				break;
			case 'annotationEdited':
				type = 'Annotation bearbeitet';
				break;
			case 'annotationDeleted':
				type = 'Annotation gelöscht';
				break;
			}
			
			return type;
		},
		
		parseTime: function(timecode) {
    // console.log("TCL: parseTime: function(timecode) ");
    // console.log("TCL:   -> timecode", timecode);
			var time = 0;
			var hours = 0;
			var mins = 0;
			var secs = 0;
			var fraction = 0;
			
			// parse fraction
			if ( timecode.indexOf('.') > -1 ) {
				var temp = timecode.substring(timecode.indexOf('.'));
				fraction = parseFloat(temp);
				if ( isNaN(fraction) ) fraction = 0;
				timecode = timecode.substring(0,timecode.indexOf('.'));
			}
			// parse hours
			if ( (timecode.match(/:/g) || []).length  > 1 ) {
				var temp = timecode.substring(0,timecode.indexOf(':'));
				timecode = timecode.substring(timecode.indexOf(':')+1);
				hours = parseInt(temp);
				if ( isNaN(hours) ) hours = 0;
				
			}
			// parse minutes
			if ( (timecode.match(/:/g) || []).length  > 0 ) {
				var temp = timecode.substring(0,timecode.indexOf(':'));
				timecode = timecode.substring(timecode.indexOf(':')+1);
				mins = parseInt(temp);
				if ( isNaN(mins) ) mins = 0;
			}
			// parse seconds
			secs = parseInt(timecode);
			if ( isNaN(secs) ) secs = 0;
			
			time = (hours*60*60)+(mins*60)+secs+fraction;
						
			return time;
		},
		
		resolveUserID: function(idElement, myself) {
    // console.log("TCL: resolveUserID: function(idElement, myself)");
    // console.log("TCL:   -> idElement", idElement);
    // console.log("TCL:   -> myself", myself);
			if ( !myself ) myself = "mir";
			
			var id = $(idElement).data('userid');
			if (TIMAAT.Service.session.id == id) $(idElement).text(myself);
			else if ( TIMAAT.Service.idCache.has(id) ) $(idElement).text(TIMAAT.Service.idCache.get(id));
			else {
				TIMAAT.Service.getUserName(id,function(name) {
					$(idElement).text(name);
					TIMAAT.Service.idCache.set(id, name);
				});
			}
		},
		
		getDefTranslation: function(item, list, prop) {
			var value = null;
			item[list].forEach(function(translation) {
				if ( translation && translation.language && translation.language.code == 'default' )
					value = translation[prop];
			});
			return value;
		},
		
		setDefTranslation: function(item, list, prop, value) {
			item[list].forEach(function(translation) {
				if ( translation && translation.language && translation.language.code == 'default' )
					translation[prop] = value;
			});
		},
		
		getArgonHash: function(password, salt) {
    // console.log("TCL: getArgonHash: function(password, salt)");
			var hash = Module.allocate(new Array(32), 'i8', Module.ALLOC_NORMAL);
			var encoded = Module.allocate(new Array(512), 'i8', Module.ALLOC_NORMAL);
			var passwordArr = allocateArray(password);
			var saltArr = allocateArray(salt);

			Module._argon2_hash(8, 4096, 1, passwordArr, password.length, saltArr, salt.length,
			            hash, 32, encoded, 512,
			            2, 0x13);

			var hashArr = [];
			for (var i = hash; i < hash + 32; i++) { hashArr.push(Module.HEAP8[i]); }
	
			var argonHash = hashArr.map(function(b) { return ('0' + (0xFF & b).toString(16)).slice(-2); }).join('');
	
			Module._free(passwordArr);
			Module._free(saltArr);
			Module._free(hash);
			Module._free(encoded);
	
			return argonHash;
		},	
	}
	
}, window));
