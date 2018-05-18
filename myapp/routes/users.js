var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


//get specific object
router.post('/connection', function(req, res, next) {
	connection.query('SELECT * from user WHERE email=? and password=?',[req.body.email,req.body.password], function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			//res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
		if (!results.length){
			res.send(JSON.stringify({"status": 200, "error": null, "response": results, message: 'Authentication failed. User not found.' }));
		}
		if (results.length){
				//res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        //
        //TODO regarder payload
        //
				const payload = {
					"sub": "1234567890"
				};
				var token = jwt.sign(payload, 'shit');
				    // return the information including token as JSON
				    res.json({
				    	success: true,
				    	message: 'Enjoy your token!',
				    	token: token
				    });
			}
	  	}
  	});
});

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


// apply the routes to our application with the prefix /api
//app.use('/api', apiRoutes);

module.exports = router;
