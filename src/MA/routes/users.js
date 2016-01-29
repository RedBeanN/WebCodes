var express = require('express');
var router = express.Router();
var db = require('../db/db');
var cookieAge = 24 * 60 * 60 * 1000;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<nav navbar=""></nav>');
});
router.get('/detail', function (req, res) {
  if (!req.cookies || !req.cookies.username) res.json({targetUrl: ''});
  else db.getUser(req.cookies.username).
    then(function (data) {
      res.json({targetUrl: data.userRoot});
    }, function (err) {
      req.cookies('username', '', {maxAge: -1});
      res.json({targetUrl: ''});
    });
})
router.post('/login', function (req, res) {
  db.getUser(req.body.username).
    then(function (data) {
      if (data.password == req.body.password) {
        if (req.body.remember) res.cookie('username', req.body.username, {maxAge: cookieAge});
        else res.cookie('username', req.body.username);
        res.json({ targetUrl: data.userRoot });
      } else {
        res.json({message: 'password error'});
      }
    }, function (error) {
      res.json({message: 'username error'});
    })
});

module.exports = router;
