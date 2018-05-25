var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


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

//get all hprets
router.get('/', function(req, res, next) {
	connection.query('SELECT * from historiquepret', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//get specific hprets
//TODO retourner les informations de catégorie, d'objet et de user
router.get('/:hprets_id', function(req, res, next) {
	connection.query('SELECT * from historiquepret WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//modify hprets
//TODO supprimer cette route ?
router.patch('/:hprets_id', function(req, res, next) {
	connection.query('UPDATE historiquepret SET depart = "' + req.body.depart + '", retourPrevu = "' + req.body.retourPrevu + '", retourEffectif = "' + req.body.retourEffectif +'", idUserAdmin = ' + req.body.idUserAdmin + ', idObjet = ' + req.body.idObjet + ', idUserHelisa = ' + req.body.idUserHelisa + ' WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//delete hprets
//TODO supprimer cette route ?
router.delete('/:hprets_id', function(req, res, next) {
	connection.query('DELETE FROM historiquepret WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//create hprets
//TODO verify that objets has no hprets
//TODO verify that objets !isStock
//TODO mettre la date d'aujourd'hui par défault
//TODO mettre idUser nous même
//TODO vérifier qu'on a tous les paramètres
router.post('/', function(req, res, next) {
	connection.query('INSERT INTO historiquepret (depart, retourPrevu, retourEffectif, idUserAdmin, idObjet, idUserHelisa) VALUES ("' + req.body.depart + '","' + req.body.retourPrevu + '","' + req.body.retourEffectif +'",' + req.body.idUserAdmin + ',' + req.body.idObjet + ',' + req.body.idUserHelisa +')', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//TODO créer route de retour de pret

module.exports = router;
