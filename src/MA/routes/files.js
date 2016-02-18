var router = require('express').Router();

router.put('/text', function (req, res) {
  console.log(req.body);
  res.end();
});

router.post('/upload', function (req, res) {
  console.log('post file');
  res.end();
});

router.get('/download/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  res.end();
});

module.exports = router;