var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    jade = require('jade'),
    querystring = require('querystring'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    validator = require('./public/js/validator.js'),
    port = 8000, cookieTime = 14400000;

// all environments
var app = express();
app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static('public'));

// get functions
app.get('/', function(req, res) {
  if (req.cookies.username) {
    res.redirect(301, '/detail');
  } else {
    res.sendFile(__dirname + '/public/html/index.html');
  }
});
app.get('/regist', function(req, res) {
  if (req.cookies.username) {
    res.redirect(301, '/detail');
  } else {
    res.sendFile(__dirname + '/public/html/regist.html');
  }
});
app.get('/delete-cookies', function(req, res) {
  console.log('delete');
  res.cookie('username', '', {maxAge: 0});
  res.redirect(301, '/');
});
app.get('/detail', function(req, res) {
  if(req.cookies.username) {
    console.log('de');
    sendDetail(req, res);
  } else res.redirect(301, '/');
});

// deal with posts
app.post('/regist', function(req, res) {
  res.cookie('username', req.body.username, {maxAge: cookieTime});
  res.cookie('number', req.body.number, {maxAge: cookieTime});
  res.cookie('phone', req.body.phone, {maxAge: cookieTime});
  res.cookie('email', req.body.email, {maxAge: cookieTime});
  res.redirect(301, '/');
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port: ' + app.get('port'));
})

function sendDetail(req, res) {
  var template = __dirname + '/public/html/detail.jade';
  var usr = {username: req.cookies.username, number: req.cookies.number, phone: req.cookies.phone, email: req.cookies.email};
  res.render(template, usr);
}

