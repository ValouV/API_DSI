var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto')

//get specific user
//route non protégée
router.post('/connexion', function(req, res, next) {
	connection.query('SELECT id, email, nom, prenom, role, siteEPF from user WHERE email=? and password=?',[req.body.email, crypto.createHmac('sha256', 'ahbon').update(req.body.password).digest('hex')], function (error, results, fields) {
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
				const payload = {
					"iduser" : results[0].id,
					 "emailuser" : results[0].email
				};
				var token = jwt.sign(payload, 'shit', {expiresIn: '1d'});
				    // return the information including token as JSON
				    res.json({
				    	success: true,
				    	message: 'Enjoy your token!',
				    	token: token,
							user: results
				    });
			}
	  	}
	  	//connection.end();
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

//retourne les informations de l'utilisateur
router.get('/me', function(req, res, next){
	connection.query('SELECT id, email, nom, prenom, role, siteEPF from user WHERE id = ' + jwt.decode(req.token).iduser, function (error, results, fields) {
			if(error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				//If there is error, we send the error in the error section with 500 status
			} else {
				res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
				//If there is no error, all is good and response is 200OK.
			}
			//connection.end();
		});
});

//protection des routes users
router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    connection.query('SELECT role from user WHERE id = '+ jwt.decode(req.token).iduser, function (error, results, fields) {
			if (results[0].role == 1){
				next();
			} else {
				return res.status(403).send({
		        success: false,
		        message: 'You should be admin to modify users.'
		    });
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
	connection.query('SELECT id, email, nom, prenom, role, siteEPF from user', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {

	  		//affiche en console l'id et l'email de l'user qui a genere le token
	  		//console.log(jwt.decode(req.token).iduser + " " + jwt.decode(req.token).emailuser);
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
	  	//connection.end();
  	});
});

//get specific user
router.get('/:user_id', function(req, res, next) {
	connection.query('SELECT id, email, nom, prenom, role, siteEPF from user WHERE id = ' + req.params.user_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
	  	//connection.end();
  	});
});

//modify user
router.patch('/:user_id', function(req, res, next) {
	if (req.body.email !== undefined && req.body.nom !== undefined && req.body.prenom !== undefined && req.body.password !== undefined && req.body.role !== undefined && req.body.siteEPF !== undefined){
		connection.query('UPDATE user SET email = "' + req.body.email + '", nom = "' + req.body.nom + '", prenom = "' + req.body.prenom +'", password = "' + crypto.createHmac('sha256', 'ahbon').update(req.body.password).digest('hex') + '", role = ' + req.body.role + ', siteEPF = ' + req.body.siteEPF + ' WHERE id = ' + req.params.user_id, function (error, results, fields) {
			if(error){
				res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
				//If there is error, we send the error in the error section with 500 status
			} else {
				res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
				//If there is no error, all is good and response is 200OK.
			}
			//connection.end();
		});
	} else {
		res.send(JSON.stringify({"status": 200, "error": null, "response": "You should give all parameters"}));
	}
});

//delete user
router.delete('/:user_id', function(req, res, next) {
	connection.query('DELETE FROM user WHERE id = ' + req.params.user_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
	  	//connection.end();
  	});
});

//create user
router.post('/', function(req, res, next) {
	if (req.body.email !== undefined && req.body.nom !== undefined && req.body.prenom !== undefined && req.body.password !== undefined && req.body.role !== undefined && req.body.siteEPF !== undefined){
		connection.query('SELECT * FROM user WHERE email ="' + req.body.email + '";', function (error, results, fields) {
			if(results.length){
				res.send(JSON.stringify({"status": 200, "error": null, "response": "An account already exists with this email."}));
			} else {
				connection.query('INSERT INTO user (email, nom, prenom, password, role, siteEPF) VALUES ("' + req.body.email + '","' + req.body.nom + '","' + req.body.prenom +'","' + crypto.createHmac('sha256', 'ahbon').update(req.body.password).digest('hex') + '",' + req.body.role + ',' + req.body.siteEPF +')', function (error, results, fields) {
					if(error){
						res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
						//If there is error, we send the error in the error section with 500 status
					} else {
						res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
						//If there is no error, all is good and response is 200OK.
					}
					//connection.end();
				});
			}
		});
	} else {
		res.send(JSON.stringify({"status": 200, "error": null, "response": "You should give all parameters"}));
	}
});


module.exports = router;
