var express = require('express');
var router = express.Router();
var db = require('../db/db');

router.get('/data', function (req, res) {
  if (!req.cookies || !req.cookies.uid) res.json({targetUrl: '/'});
  else db.getUser(req.cookies.uid).
    then(function (user) {
      db.getHomeworks().
        then(function (data) {
          res.json({
            user: user,
            data: data,
            notifications: user.notifications,
            hasRead: !user.notifications.length
           })
        })
    }, function (err) {
      res.json(err);
    });
});
router.get('/homework/:id', function (req, res) {
  var id = req.params.id;
  db.getHomework(id).
    then(function (hw) {
      res.json(hw);
    }, function (err) {
      res.status(500).json(err);
    });
});

module.exports = router;