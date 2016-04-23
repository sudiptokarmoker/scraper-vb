var webserver = require('webserver');
var server = webserver.create();
var webPage = require('webpage');
var page = webPage.create();
var port = require('system').env.PORT || 8080; // default back to 8080
var service = server.listen(port, function(request, response) {
  response.statusCode = 200; 
  var str = request.url;
    var url_to_scrap = str.split("/?url=");
    page.settings.userAgent = 'SpecialAgent';
	page.open(url_to_scrap[1], function (status) {
		page.evaluate(function() {
		      var content = page.content;
			response.write(content);
			response.close();
	        });
		/*if(status == "success"){
			var content = page.content;
			response.write(content);
			response.close();
		} 
		else{
			response.write("fail");
			response.close();
		}*/
	});
	// page or error handler //
	page.onError = function(msg, trace){
		response.write("fail");
		response.close();
	}
});
