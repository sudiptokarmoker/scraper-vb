"use strict";
function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};



var webserver = require('webserver');
var server = webserver.create();
var webPage = require('webpage');
var page = webPage.create();
var port = require('system').env.PORT || 8080; // default back to 8080
var service = server.listen(port, function(request, response) {
	response.statusCode = 200; 
	var str = request.url;
	var url_to_scrap = str.split("/?url="); 
	/*
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
	 */
	 

	 
	 
	 
	page.open(url_to_scrap[1], function (status) {
	    // Check for page load success
	    if (status !== "success") {
        	response.write("fail");
			response.close();
	    } else {
	        // Wait for 'signin-dropdown' to be visible
	        waitFor(function() {
	            // Check in the page if a specific element is now visible
	            //page.evaluate(function() {
	                var content = page.content;
			response.write(content); 
			response.close();
	            //});
	        }, function() {
	           //console.log("All call end");
	           //response.close();
	           //phantom.exit();
	        });
	    }
	});
	
	
	// page or error handler //
	page.onError = function(msg, trace){
		response.write("fail");
		response.close();
		//phantom.exit();
	}
});

/*
var webserver = require('webserver');
var server = webserver.create();
var webPage = require('webpage');
var page = webPage.create();
var port = require('system').env.PORT || 8080; // default back to 8080
var service = server.listen(port, function(request, response) {
	response.statusCode = 200; 
	var str = request.url;
	var url_to_scrap = str.split("/?url="); 
	
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

*/
