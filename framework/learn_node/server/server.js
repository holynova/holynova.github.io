var http = require('http'),
    fs = require('fs'),
    url = require('url');
querystring = require('querystring');
var port = 8888;
http.createServer(function(request, response) {
    var urlObj = url.parse(request.url);
    var pathname = urlObj.pathname;
    var queryObj = urlObj.query;
    // var pathname = url.parse(request.url, true).pathname;
    console.log('resquest.url = %s,pathname = %s', request.url, pathname);
    // console.log(queryObj == );
    // 路由表
    if (pathname == '/') {
        pathname = '/index.html';
    }
    if (pathname.indexOf('index.html') !== -1 && queryObj != null) {
        //存入json
        //打开文件
        //读出原来的数据
        //处理数据
        //写入文件
        //关闭文件
        //刷新页面
        var dataArr
        console.log('into get routine');
        fs.readFile('./data.json', function(error, contents) {
            if (error) {
                response.writeHead(404);
                response.write(error.message);
                response.end();
            } else {
                dataArr = JSON.parse(contents);
                queryObj = querystring.parse(queryObj);
                dataArr.push(queryObj);
                fs.writeFile('./data.json', JSON.stringify(dataArr), function(error) {
                    if (error) {
                        response.writeHead(404);
                        response.write(error.message);
                        response.end();
                    } else {
                        response.writeHead(200);
                        response.end();
                    }
                });
            }
        });
        console.log(queryObj);
    } else {
        //文件处理
        console.log('into file routine');
        var filename = pathname.substring(1);
        var filetype = filename.substring(filename.lastIndexOf(".") + 1);
        var type;
        switch (filetype) {
            case "html":
            case "htm":
                type = 'text/html;charset=UTF-8';
                break;
            case "js":
                type = 'application/javascript';
                break;
            case "json":
                type = 'text/plain';
                break;
            default:
                type = 'text/plain';
                break;
        }
        fs.readFile('./' + filename, function(error, contents) {
            if (error) {
                response.writeHead(404);
                response.write(error.message);
                response.end();
            } else {
                response.writeHead(200, {
                    "Content-Type": type
                });
                response.write(contents);
                response.end();
            }
        });
    }
    // pathname = '.' + pathname;
    // console.log('----------------------------' + request.url);
    // // console.log(pathname);
    // fs.readFile(pathname, function(error, contents) {
    //     if (error) {
    //         console.log(error);
    //         response.writeHead(404, {
    //             'Content-Type': 'text/html'
    //         });
    //     } else {
    //         response.writeHead(200, {
    //             'Content-Type': 'text/html'
    //         });
    //         response.write(contents.toString());
    //     }
    //     response.end();
    // });
    // console.log(request);
}).listen(port);
console.log('server running at port ' + port);
