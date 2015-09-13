var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz App'});
});

module.exports = router;
