var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var path = require('path');



router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'shit', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        req.token = token;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});

router.get('/:id_user', function(req, res, next){
	connection.query('SELECT * FROM uHelisa WHERE ID_ETUDIANT = "' + req.params.id_user + '"', function (error, results, fields) {
			if(error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				//If there is error, we send the error in the error section with 500 status
			} else {
				res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
				//If there is no error, all is good and response is 200OK.
			}
		});
});

router.get('/photo/:id_user', function(req, res, next){
	connection.query('SELECT PHOTO_IDENTITE FROM uHelisa WHERE ID_ETUDIANT = "' + req.params.id_user + '"', function (error, results, fields) {
			if(error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				//If there is error, we send the error in the error section with 500 status
			} else {
				res.sendFile(path.resolve('./public/images/helisa/' + results[0].PHOTO_IDENTITE));
				//If there is no error, all is good and response is 200OK.
			}
		});
});



module.exports = router;