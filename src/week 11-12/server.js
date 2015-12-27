var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mongodb = require('mongodb'),
    MongoClient = require('mongodb').MongoClient,
    jade = require('jade'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    validator = require('./public/js/validator.js'),
    port = 3000, cookieMaxAge = 1440000;

var users = {};
var db;

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
    res.render('regist.jade', {user: {}});
  }
});
app.get('/delete-cookies', function(req, res) {
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
    registUserToDB(users[user.username]);
    res.cookie('username', req.body.username, {maxAge: cookieMaxAge});
    res.redirect('/detail');
  } catch(err) {
    res.render('regist.jade', {error: err.message, user: user});
  }
});
app.post('/login', function(req, res) {
  try {
    if (!users[req.body.username]) throw new Error('Username error');
    authUser(req.body);
    res.cookie('username', req.body.username, {maxAge: cookieMaxAge});
    res.redirect('/detail');
  } catch(err) {
    console.log(err.message);
    res.render('login.jade', {error: '用户名或密码错误', user: {username: req.body.username}});
  }
});

// connect to database
MongoClient.connect("mongodb://localhost:27017/db", function(err, database) {
  if (err) console.error("ERROR");
  db = database;
  db.collection('users').find().toArray(function(err,data) {
    for (var key in data) {
      if(data[key].username) users[data[key].username] = data[key];
    }

    // run server
    var server = http.createServer(app);
    server.listen(app.get('port'), function() {
      console.log('Userlist:');
      for (var key in users) console.log(key);
      console.log('Express server listening on port: ' + app.get('port'));
    });
  });
});


// functions
function parseUser(body) {
  return {username: body.username, number: body.number, phone: body.phone, email: body.email};
}

function checkUser(user) {
  var errMsg = [];
  var pw = user['password'];
  for (var key in user) {
    if (!validator.isFieldValid(key, user[key]), pw) errMsg.push(validator.form[key].errorMessage);
    if (!validator.isAttrValueUnique(users, user, key)) errMsg.push(getUniqueErrorMessage(key));
  }
  if (errMsg.length > 0) throw new Error(errMsg.join('<br />'));
}

function authUser(user) {
  if (user.password != users[user.username].password) throw new Error('Password error');
}

function getUniqueErrorMessage(key) {
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

function registUserToDB(user) {
  db.collection('users').insert(user);
  console.log('Registed a user:\n', user)
}