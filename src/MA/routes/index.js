var express = require('express');
var router = express.Router();
var db = require('../db/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function (req, res) {
  if (!req.cookies) res.render('login');
  else if (!req.cookies.username) res.render('login');
  else db.getUser(req.cookies.username).
    then(function (usr) {
      res.json({targetUrl: usr.userRoot});
    }, function (err) {
      res.json({targetUrl: '/'});
    });
});
router.get('/logout', function (req, res) {
  res.cookie('username', '', {maxAge: -1});
  res.redirect('/');
})
router.get('/nav', function (req, res) {
  res.render('nav', {username: 'Student', group: 23, sid: 14359047})
});
router.get('/partials/student', function (req, res) {
  res.render('student');
});
router.get('*',function (req, res) {res.render('index');})

module.exports = router;
