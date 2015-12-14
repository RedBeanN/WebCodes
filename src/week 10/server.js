var port = 3000,
    http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
    querystring = require('querystring'),
    mime = require('mime'),
    _ = require('lodash');

http.createServer(function (req, res) {
  var requrl = url.parse(req.url).pathname;
  if (requrl.indexOf('random') != -1) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    setTimeout(function() {
      var n = _.random(1,10);
      res.end('' + n);
    }, _.random(1000, 3000))
  } else {
    requrl = __dirname + requrl;
    if (mime.lookup(requrl) == 'application/octet-stream') requrl += '/';
    if (requrl[requrl.length - 1] == '/') requrl += 'index.html';
    if (mime.lookup(requrl) == 'text/css') requrl = __dirname + '/statics/style.css';
    fs.readFile(requrl, function (err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
      } else {
        res.writeHead(200, {'Content-Type': mime.lookup(requrl)});
        res.end(data);
      }
    })
  }
}).listen(port);
console.log('Server running at http://127.0.0.1:' + port);
console.log('Server running at http://localhost:' + port);
