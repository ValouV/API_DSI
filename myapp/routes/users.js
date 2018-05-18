var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


//get specific object
router.post('/connexion', function(req, res, next) {
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

//get all users
router.get('/', function(req, res, next) {
	connection.query('SELECT * from user', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//get specific object
router.get('/:user_id', function(req, res, next) {
	connection.query('SELECT * from user WHERE id = ' + req.params.user_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//modify object
router.patch('/:user_id', function(req, res, next) {
	connection.query('UPDATE user SET email = ' + req.body.email + ', nom = ' + req.body.nom + ', prenom = "' + req.body.prenom +'", password = ' + req.body.password + ', role = ' + req.body.role + ', siteEPF = ' + req.body.siteEPF + ' WHERE id = ' + req.params.user_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//delete object
router.delete('/:user_id', function(req, res, next) {
	connection.query('DELETE FROM user WHERE id = ' + req.params.user_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//create object
router.post('/', function(req, res, next) {
	connection.query('INSERT INTO user (email, nom, prenom, password, role, siteEPF) VALUES (' + + req.body.email + ',' + req.body.nom + ',"' + req.body.prenom +'",' + req.body.password + ',' + req.body.role + ',' + req.body.siteEPF +')', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});


module.exports = router;
