var SSE = require('sse'),
	http = require('http'),
	jade = require('jade'),
	fs = require('fs');

function handleRequest(req, res){

	var jsRes = javascriptRegex.exec(req.url);
	if (req.method === 'GET' && jsRes ){
		return res.end(fs.readFileSync(__dirname + '/assets/javascripts/'+jsRes[1]+'.js'));
	}

	var cssRes = stylesheetRegex.exec(req.url);
	if (req.method === 'GET' && cssRes ){
		return res.end(fs.readFileSync(__dirname + '/assets/css/'+cssRes[1]+'.css'));
	}

	if (req.method === 'GET' && req.url === '/') {
		res.end(jade.renderFile('views/index.jade', {pageTitle: 'SSE - Example'}));
	} else {
		res.end('404');
	}
}

var server = http.createServer(function(req, res){
	try{
		handleRequest(req,res);
	} catch(err){
		console.log(err);
		res.end('500');
	}
});
var port = process.argv[2] || 8080;

//Routing
var javascriptRegex = /assets\/javascripts\/(.*).js/
var stylesheetRegex = /assets\/css\/(.*).css/

server.listen(port, function(){
	console.log("Server listening on port %s", port);

	var sse = new SSE(server);
	sse.on('connection', function(client) {
		client.send('Open');

		var msgCounter = 0;
		var intervalId = -1;
		var loop = function(){
			msgCounter++;
			client.send('Message ' + msgCounter)
		}

		intervalId = setInterval(loop, 2000);

		client.on('close', function() {
    		console.log('stopping client interval');
    		clearInterval(intervalId);
    	});
	});
});