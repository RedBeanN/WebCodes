var express = require('express');
var router = express.Router();
var db = require('../db/db');
var cookieAge = 24 * 60 * 60 * 1000;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<nav navbar=""></nav>');
});
router.get('/detail', function (req, res) {
  if (!req.cookies || !req.cookies.uid) res.json({targetUrl: ''});
  else db.getUser(req.cookies.uid).
    then(function (data) {
      res.json({targetUrl: data.userRoot});
    }, function (err) {
      res.cookie('uid', '', {maxAge: -1});
      res.json({targetUrl: ''});
    });
});
router.post('/login', function (req, res) {
  db.getUserByUsername(req.body.username).
    then(function (data) {
      if (data.password == req.body.password) {
        if (req.body.remember) res.cookie('uid', data._id, {maxAge: cookieAge});
        else res.cookie('uid', data._id);
        res.json({ targetUrl: data.userRoot });
      } else {
        res.json({message: 'password error'});
      }
    }, function (error) {
      res.json({message: 'username error'});
    })
});
router.get('/read-notifications', function (req, res) {
  if (!req.cookies || !req.cookies.uid) res.status(500).end();
  else db.userReadNotifications(req.cookies.uid).
    then(function (data) {
      res.json(data);
    }, function (err) {
      res.status(500).json(err);
    })
});

module.exports = router;
