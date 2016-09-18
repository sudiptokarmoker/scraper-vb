var webserver = require('webserver');
var server = webserver.create();
var port = require('system').env.PORT || 8080; // default back to 8080

var service = server.listen(port, function(request, response) {
	//response.statusCode = 200; 
	var webPage = require('webpage');
	var page = webPage.create(), count = 0, forcedRenderTimeout, renderTimeout;
	var str = request.url;
	//var url_to_scrap = str.split("/?url="); 
	var resourceWait  = 300, maxRenderWait = 10000, url_to_scrap = str.split("/?url=");
	 
	 
	function doRender() {
		var content = page.content;
		response.write(content);
		response.close();
		//console.log(content); 
		//page.render('twitter.png');
		//phantom.exit();
	}

	page.onResourceRequested = function (req) {
		count += 1;
		//console.log('> ' + req.id + ' - ' + req.url);
		clearTimeout(renderTimeout);
	};

	page.onResourceReceived = function (res) {
		if (!res.stage || res.stage === 'end') {
			count -= 1;
			//console.log(res.id + ' ' + res.status + ' - ' + res.url);
			if (count === 0) {
				renderTimeout = setTimeout(doRender, resourceWait);
			}
		}
	};

	page.open(url_to_scrap[1], function (status) {
		if (status !== "success") {
			//console.log('Unable to load url');
			response.write("fail");
			response.close();
			//phantom.exit();
		} else {
			forcedRenderTimeout = setTimeout(function () {
				//console.log(count);
				doRender();
				//phantom.exit();
			}, maxRenderWait);
		}
		page.close();
	});
	
	
	
	
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
	// page or error handler //
	page.onError = function(msg, trace){
		response.write("fail");
		response.close();
	}*/
});
