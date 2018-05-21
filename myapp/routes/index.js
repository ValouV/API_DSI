var express = require('express');
var router = express.Router();

//TODO supprimer, ou faire mieux ?

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API DSI' });
});

module.exports = router;
