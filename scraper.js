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
		page.includeJs('https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js', function() { 
			page.evaluate(function(){ 
				window.setTimeout(function(){
					if(status == "success"){
						var content = page.content;
						response.write(content);
						response.close();
					} 
					else{
						response.write("fail");
						response.close();
					}
				}, 1); 
			});
		}); 
	});
	
	
	
	
	
	// page or error handler //
	page.onError = function(msg, trace){
		response.write("fail");
		response.close();
	}
});
