var webserver = require('webserver');
var server = webserver.create();
var webPage = require('webpage');
var page = webPage.create();
var port = require('system').env.PORT || 8080; // default back to 8080
var service = server.listen(port, function(request, response) {
	response.statusCode = 200; 
	var str = request.url;
	var url_to_scrap = str.split("/?url="); 
	
	
	// advance for ensure that page is laodded //
	page.onInitialized = function() {
	    page.onCallback = function(data) {
	        console.log('Main page is loaded and ready');
	        //Do whatever here
	    }; 
	    page.evaluate(function() {
	        document.addEventListener('DOMContentLoaded', function() {
	            window.callPhantom();
	        }, false);
	        console.log("Added listener to wait for page ready");
	    }); 
	};
	// end of advance check //
	
	
	page.open(url_to_scrap[1], function (status) {
		if(status == "success"){
			var content = page.content;
			response.write(content);
			response.close();
		} 
		else{
			response.write("fail");
			response.close();
		}
	});
	// page or error handler //
	page.onError = function(msg, trace){
		response.write("fail");
		response.close();
	}
});
