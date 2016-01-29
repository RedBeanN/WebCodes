var express = require('express');
var router = express.Router();
var models = require('../db/models');

router.get('/data', function (req, res) {
  if (!req.cookies || !req.cookies.username) res.json({targetUrl: '/'});
  else models.getUser(req.cookies.username).
    then(function (user) {
      models.getHomeworks().
        then(function (data) {
          res.json({user: user, data: data})
        })
    }, function (err) {
      res.json(err);
    });
});
router.get('/homework/:id', function (req, res) {
  var id = req.params.id;
  models.getHomework(id).
    then(function (hw) {
      res.json(hw);
    }, function (err) {
      res.status(500).json(err);
    });
})

module.exports = router;