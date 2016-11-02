var http = require('http'),
    fs = require('fs'),
    url = require('url');
var port = 9999;
http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('resquest.url = %s,path = %s', request.url, pathname);
    // console.log
    // console.log('resquest for ' + pathname + ' recived');
    fs.readFile(pathname, function(error, contents) {
        if (error) {
            console.log(error);
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
        } else {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            response.write(contents.toString());
        }
        response.end();
    });
    // console.log(request);
}).listen(port);
console.log('server running at port ' + port);
