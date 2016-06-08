var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('airmap');
});
// router.get('/map', function(req, res) {
//   res.render('airmap');
// });

module.exports = router;