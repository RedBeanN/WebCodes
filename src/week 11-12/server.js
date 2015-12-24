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

var users = {};
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
app.get('/login', function(req, res) {
  res.render('login.jade', {user: {}});
});
app.get('/regist', function(req, res) {
  if (req.cookies.username) {
    res.redirect(301, '/detail');
  } else {
    //res.sendFile(__dirname + '/public/html/regist.html');
    res.render('regist.jade', {user: {}});
  }
});
app.get('/delete-cookies', function(req, res) {
  console.log('delete');
  res.clearCookie('username');
  res.redirect('/');
});
app.get('/detail', function(req, res) {
  if(users[req.cookies.username]) {
    res.render('detail.jade', {user: users[req.cookies.username]});
  } else res.redirect(301, '/delete-cookies');
});

// deal with posts
app.post('/regist', function(req, res) {
  try {
    var user = parseUser(req.body);
    checkUser(user);
    users[user.username] = user;
    users[user.username].password = req.body.password;
    res.cookie('username', req.body.username, {maxAge: cookieTime});
    res.redirect('/detail');
  } catch(err) {
    res.render('regist.jade', {error: err.message, user: user});
  }
});
app.post('/login', function(req, res) {
  try {
    if (!users[req.body.username]) throw new Error('Username error');
    authUser(req.body);
    res.cookie('username', req.body.username, {maxAge: cookieTime});
    res.redirect('/detail');
  } catch(err) {
    console.log(err.message);
    res.render('login.jade', {error: '用户名或密码错误', user: {username: req.body.username}});
  }
});

var server = http.createServer(app);
server.listen(app.get('port'), function() {
  console.log('Express server listening on port: ' + app.get('port'));
})

// functions
function parseUser(body) {
  return {username: body.username, number: body.number, phone: body.phone, email: body.email};
}

function checkUser(user) {
  var errMsg = [];
  for (var key in user) {
    if (!validator.isFieldValid(key, user[key])) errMsg.push(validator.form[key].errorMessage);
    if (!validator.isAttrValueUnique(users, user, key)) errMsg.push(getUniqueMessage(key));
  }
  if (errMsg.length > 0) throw new Error(errMsg.join('<br />'));
}

function authUser(user) {
  if (user.password != users[user.username].password) throw new Error('Password error');
}

function getUniqueMessage(key) {
  var msg;
  switch(key) {
    case 'username': msg = '用户名'; break;
    case 'number': msg = '学号'; break;
    case 'phone': msg = '电话'; break;
    case 'email': msg = '邮箱'; break;
  }
  msg += '已被注册。';
  return msg;
}