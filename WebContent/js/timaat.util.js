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
		
		formatTime: function(timeInMilliseconds, withFraction = false) {
			let timeInSeconds = timeInMilliseconds / 1000;
			var hours         = Math.floor(timeInSeconds / 3600);
			var minutes       = Math.floor((timeInSeconds - (hours * 3600)) / 60);
			var seconds       = timeInSeconds - ((hours * 3600) + (minutes * 60));
			var fraction      = seconds - Math.floor(seconds);
			seconds       		= Math.floor(seconds);
			
			var time = "";
			if ( hours < 10) time += "0";
			time += hours + ":";
			if ( minutes < 10 ) time += "0";
			time += minutes + ":";
			if ( seconds < 10 ) time += "0";
			time += seconds;
			if ( withFraction ) time += fraction.toFixed(3).substring(1);

			return time;
		},
		
		formatDate: function (timestamp) {
			var a      = new Date(timestamp);
			// var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
			var year   = a.getFullYear();
			var month  = ("0" + (a.getMonth()+1)).substr(-2);
			var date   = ("0" + a.getDate()).substr(-2);
			var hour   = ("0" + a.getHours()).substr(-2);
			var min    = ("0" + a.getMinutes()).substr(-2);
			var sec    = ("0" + a.getSeconds()).substr(-2);
			var time   = date + '.' + month + '.' + year + ', ' + hour + ':' + min + ':' + sec ;
			return time;
		},
		
		formatLogType: function(type) {
    	// console.log("TCL: formatLogType: function(type)");
			// var display = '['+type+']';
			switch (type) {
			case 'login':
				type = 'Anmeldung API';
				break;
			case 'mediumCreated':
				type = 'Video Upload';
				break;
			case 'analysisListCreated':
				type = 'Analyseliste angelegt';
				break;
			case 'analysisListEdited':
				type = 'Analyseliste bearbeitet';
				break;
			case 'analysisListDeleted':
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
    	// console.log("TCL: parseTime timecode ", timecode);
			if (!timecode || timecode == "") {
				timecode = "00:00:00.000";
			}
			let hms = timecode.split(":");
			let seconds = Number(hms[0]) * 3600 + Number(hms[1]) * 60 + Number(hms[2]);
			let milliseconds = Math.floor(seconds * 1000);
			return milliseconds;
		},
		
		resolveUserID: function(idElement, myself) {
			// console.log("TCL: resolveUserID: idElement, myself ", idElement, myself);
			if ( !myself ) myself = "mir";
			
			var id = $(idElement).data('userId');
			if (TIMAAT.Service.session.id == id) $(idElement).text(myself);
			else if ( TIMAAT.Service.idCache.has(id) ) $(idElement).text(TIMAAT.Service.idCache.get(id));
			else {
				TIMAAT.Service.getUserDisplayName(id,function(name) {
					$(idElement).text(name);
					TIMAAT.Service.idCache.set(id, name);
				});
			}
		},
		
		getInterpolatedShape: function (shapeFrom, shapeTo, percent) {
			if ( !shapeFrom || !shapeTo || percent == null ) return null;
			percent = percent < 0 ? 0 : percent;
			percent = percent > 1 ? 1 : percent;
			if ( shapeFrom.id != shapeTo.id ) return null;
			if ( shapeFrom == shapeTo ) return shapeFrom;
			if ( percent == 0 ) return shapeFrom;
			if ( percent == 1 ) return shapeTo;
			let interShape = { id: shapeFrom.id, type: shapeFrom.type };
			switch (shapeFrom.type) {
				case 'rectangle': 
					interShape.bounds = [ this._lerpValue(shapeFrom.bounds[0], shapeTo.bounds[0], percent), this._lerpValue(shapeFrom.bounds[1], shapeTo.bounds[1], percent) ];
					// interShape.bounds = L.latLngBounds( this._lerpValue(shapeFrom.bounds.getSouthWest(), shapeTo.bounds.getSouthWest(), percent), this._lerpValue(shapeFrom.bounds.getNorthEast(), shapeTo.bounds.getNorthEast(), percent) );
					break;
				case "polygon":
				case "line":
					interShape.points = new Array();
					for (let index=0; index < shapeFrom.points.length; index++)
						interShape.points.push(this._lerpValue(shapeFrom.points[index], shapeTo.points[index], percent));
					break;
				
				case "circle":
					interShape.point = this._lerpValue(shapeFrom.point, shapeTo.point, percent);
					interShape.radius = this._lerpValue(shapeFrom.radius, shapeTo.radius, percent);
					break;
			}
			return interShape;
		},
		
		_lerpValue: function (from, to, percent) {
			if ( !from || !to || percent == null ) return null;
			if ( Array.isArray(from) )
				return [from[0] + (to[0] - from[0]) * percent, from[1] + (to[1] - from[1]) * percent];
			else
				return from + (to - from) * percent;
		},
		
		getDefaultTranslation: function(item, list, prop) {
    	// console.log("TCL: item, list, prop", item, list, prop);
			var value = null;
			item[list].forEach(function(translation) {
				if ( translation && translation.language && translation.language.code == 'default' )
					value = translation[prop];
			});
			return value;
		},
		
		setDefaultTranslation: function(item, list, prop, value) {
			item[list].forEach(function(translation) {
				if ( translation && translation.language && translation.language.code == 'default' )
					translation[prop] = value;
			});
		},
		
		createUUIDv4() {
		    let dt = new Date().getTime();
		    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = (dt + Math.random()*16)%16 | 0;
		        dt = Math.floor(dt/16);
		        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		    });
		    return uuid;
		},

		getFuzzyDate(timestamp) {
			let fuzzyDate = '';

			let now     = Date.now();
			let seconds = Math.floor((now-timestamp) / 1000);
			let minutes = Math.floor(seconds / 60);
			let hours   = Math.floor(minutes / 60);
			let days    = Math.floor(hours / 24);
			let weeks   = Math.floor(days / 7);
			let months  = Math.floor(days / 30);
			let years   = Math.floor(days / 365);
			
			if ( years > 0 ) fuzzyDate = (years == 1) ? 'vor einem Jahr' : 'vor '+years+' Jahren';
			else if ( months > 0 ) fuzzyDate = (months == 1) ? 'vor einem Monat' : 'vor '+months+' Monaten';
			else if ( weeks > 0 ) fuzzyDate = (weeks == 1) ? 'letzte Woche' : 'vor '+weeks+' Wochen';
			else if ( days > 0 ) fuzzyDate = (days == 1) ? 'Gestern' : 'vor '+days+' Tagen';
			else if ( hours > 0 ) fuzzyDate = (hours == 1) ? 'vor einer Stunde' : 'vor '+hours+' Stunden';
			else if ( minutes > 0 ) fuzzyDate = (minutes == 1) ? 'vor einer Minute' : 'vor '+minutes+' Minuten';
			else if ( seconds > 4 ) fuzzyDate = 'vor '+seconds+' Sekunden';
			else fuzzyDate = 'jetzt';
			
			return fuzzyDate;
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
