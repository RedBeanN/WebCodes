
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/api'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');

var app = module.exports = express.createServer();

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configuration

app.configure(function (){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
  app.use(express.favicon(__dirname + '/publick/img/favicon.png'));
});


app.configure('development', function (){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function (){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
app.get('/user/user', routes.user);

// JSON API

app.get('/api/posts', api.posts);

app.get('/api/post/:id', api.post);
app.post('/api/post', api.addPost);
app.put('/api/post/:id', api.editPost);
app.delete('/api/post/:id', api.deletePost);
// ADD
app.post('/api/login', api.login);
app.post('/api/regist', api.regist);
app.get('/api/logout', api.logout);
app.get('/api/login', api.getLogin);
app.get('/api/index', api.getIndex);
app.get('/api/regist', api.getRegist);
app.get('/api/hide-post/:id', api.hidePost);
app.put('/api/postpage', api.postPage);
app.put('/api/add-reply', api.addReply);
app.put('/api/hide-reply', api.hideReply);
app.put('/api/delete-reply', api.deleteReply);
app.put('/api/add-comment/:id', api.addComment);
app.put('/api/hide-comment', api.hideComment);
app.put('/api/delete-comment', api.deleteComment);
// END ADD

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function (){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
