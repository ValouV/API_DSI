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
	connection.query('SELECT * from historiquestock', function (error, results, fields) {
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
//TODO récupérer les limites, objets, catégorie
router.get('/:hstocks_id', function(req, res, next) {
	connection.query('SELECT * from historiquestock WHERE id = ' + req.params.hstocks_id, function (error, results, fields) {
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
//TODO supprimer cette route
router.patch('/:hstocks_id', function(req, res, next) {
	connection.query('UPDATE historiquestock SET depart = "' + req.body.depart + '", arrivée = "' + req.body.arrivée + '", idUserAdmin = ' + req.body.idUserAdmin + ', idObjet = ' + req.body.idObjet + ' WHERE id = ' + req.params.hstocks_id, function (error, results, fields) {
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
router.delete('/:hstocks_id', function(req, res, next) {
	connection.query('DELETE FROM historiquestock WHERE id = ' + req.params.hstocks_id, function (error, results, fields) {
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
//TODO verify that objets n'a pas de hStock
//TODO verify that objets isStock
//TODO mettre la date d'aujourd'hui par défault
//TODO mettre idUser via token
router.post('/', function(req, res, next) {
	connection.query('INSERT INTO historiquestock (arrivée, depart, idUserAdmin, idObjet) VALUES ("' + req.body.arrivée + '","' + req.body.depart + '",' + req.body.idUserAdmin + ',' + req.body.idObjet + ')', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//TODO créer route de retour de stock

module.exports = router;
