(function() {
   loadOptions();
   submitHandler();
})();


function submitHandler() {
  var $submitButton = $('#submitButton');

  $submitButton.on('click', function() {

    var return_to = getQueryParam('return_to', 'pebblejs://close#');
    document.location = return_to + encodeURIComponent(JSON.stringify(getAndStoreConfigData()));
});
}

function loadOptions() {

   $.urlParam = function(name){
   var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
   if (!results) { return 0; }
	return results[1] || 0;
   }
   
    $("#text").val(decodeURIComponent($.urlParam("text")));
 	
	
	var background = decodeURIComponent($.urlParam("background"));
	
	background = leftPad(Number(background).toString(16).toUpperCase(),6,"0");
    background = background.length == 6 ? background : "FF0000";
    background = background.substring(0,6);
	$("#background-color").val("0x"+background).trigger('change');
	
}

function stringToBoolean(string){
	switch(string){
		case true: return "1";
		case false: return "0";
	}
}

function getAndStoreConfigData() {

  var background;
  try {
  	background=parseInt($("#background-color")[0].value.replace("#", ''),"16");
  }
  catch(err) {
  	background=0;
  }
  
  var options = {
          'text': $("#text").val(),
          'background': background,
        }

  console.log('Got options: ' + JSON.stringify(options));
  return options;
}

function getQueryParam(variable, defaultValue) {
	var query = location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
	   var pair = vars[i].split('=');
		if (pair[0] === variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return defaultValue || false;
}

function leftPad(val, size, ch) {
        var result = String(val);
        if(!ch) {
            ch = "0";
        }
        while (result.length < size) {
            result = ch + result;
        }
        return result;
}