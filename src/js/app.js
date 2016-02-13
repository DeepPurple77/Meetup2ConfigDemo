var DEBUG = true;

function appMessageAck(e) {
    console.log("options sent to Pebble successfully");
}

function appMessageNack(e) {
    console.log("options not sent to Pebble: " + e.error);
	console.log("Transaction ID: " + e.data.transactionId);
}

Pebble.addEventListener("ready", function() {
	console.log("Pebble JS ready");
	Pebble.sendAppMessage({
		"ready":1
	});
});

Pebble.addEventListener("appmessage",
                        function(e) {
});

Pebble.addEventListener("webviewclosed", function(e) {
    if (DEBUG) console.log("configuration closed");
    if (e.response !== '' && e.response !== undefined) {
		var options = JSON.parse(decodeURIComponent(e.response));
		if (DEBUG) console.log(JSON.stringify(options));
		localStorage.setItem('options', JSON.stringify(options));
		Pebble.sendAppMessage(options, appMessageAck, appMessageNack);
    } else {
		if (DEBUG) console.log("no options received");
    }
});

Pebble.addEventListener("showConfiguration", function() {
	var url,uri,host,options;
	try {
		options = JSON.parse(localStorage.getItem('options'));
	}
	catch(err) {
		options = false;
	}
 
	host = 'http://meetup-demo3.s3-website-eu-west-1.amazonaws.com/';
		
	if (DEBUG) console.log("Showing Configuration using host: " + host);
	
    if (options){
		uri = '?background=' + options.background + "&text=" + options.text;
	}
    else {
 		uri = "?background=16711680&text=Welcome Pebblers";
    }
	url = host + uri;
    if (DEBUG) console.log ("URI: " + uri);
	Pebble.openURL(url);  
});