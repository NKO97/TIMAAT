if(window.attachEvent) {
    window.attachEvent('onload', setup);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function(evt) {
            curronload(evt);
            setup(evt);
        };
        window.onload = newonload;
    } else {
        window.onload = setup;
    }
}

var TIMAAT = {
		state: 0,
		token: ''
}

function allocateArray(strOrArr) {
	var arr = strOrArr instanceof Uint8Array || strOrArr instanceof Array ? strOrArr : Module.intArrayFromString(strOrArr);
	return Module.allocate(arr, 'i8', Module.ALLOC_NORMAL);
}

function getArgonHash(password, salt) {
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
}

function processLogin() {
	user = jQuery('#login-user').val();
	pass = jQuery('#login-pass').val();
	if ( user.length > 0 && pass.length > 0 ) {
		console.log("calculating...");
		hash = getArgonHash(pass,user+"timaat.kunden.bitgilde.de");
		var credentials = {
			username : user,
			password: hash
		}
		
		jQuery.ajax({
			  url:window.location.protocol+'//'+window.location.host+"/TIMAAT/api/authenticate",
			  type:"POST",
			  data:JSON.stringify(credentials),
			  contentType:"application/json; charset=utf-8",
			  dataType:"json",
			  }).done(function(e) {
			    console.log( "success", e );
			    TIMAAT.session = e;
			    TIMAAT.token = e.token;
			    jQuery('#login-modal').modal('hide');
			    jQuery('body').append('<div id="text-message" class="alert alert-success">Sie sind eingelogt als '+TIMAAT.session.accountName+'</div>');
			    
			  })
			  .fail(function(e) {
			    console.log( "error",e );
			    jQuery('#login-message').fadeIn();
			  });
	}
}

function setup() {
	jQuery('#login-pass').on('keyup', function (e) { if (e.keyCode == 13) jQuery('#login-submit').click(); });
	jQuery('#login-submit').on('click', processLogin);
	if ( TIMAAT.state != 1 ) jQuery('#login-modal').modal('show');
	
	
}