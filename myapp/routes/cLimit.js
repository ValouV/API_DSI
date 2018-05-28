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

//get all limits
router.get('/', function(req, res, next) {
	connection.query('SELECT catlimite.*, categorie.nom from catlimite, categorie WHERE catlimite.idCategorie = categorie.id', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//get specific limit
router.get('/:climit_id', function(req, res, next) {
	connection.query('SELECT catlimite.*, categorie.nom FROM catlimite, categorie WHERE catlimite.id = ' + req.params.climit_id +' AND catlimite.idCategorie = categorie.id', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//TODO vérifier qu'on a tous les paramètres
//CETTE ROUTE EST DEGUEU ET C'EST LA FAUTE DE LAURENE
router.patch('/updatebackoffice', function(req, res, next) {
	connection.query('UPDATE catlimite SET limite = ' + req.body.limite + ' WHERE idCategorie = ' + req.body.idCategorie + ' AND siteEPF = ' + req.body.siteEPF , function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//modify limit
//TODO vérifier qu'on a tous les paramètres
router.patch('/:climit_id', function(req, res, next) {
	connection.query('UPDATE catlimite SET limite = ' + req.body.limite + ', idCategorie = ' + req.body.idCategorie + ', siteEPF = ' + req.body.siteEPF +' WHERE id = ' + req.params.climit_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//delete limit
router.delete('/:climit_id', function(req, res, next) {
	connection.query('DELETE FROM catlimite WHERE id = ' + req.params.climit_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//create limit
//TODO vérifier que la limite n'est pas déjà entrée
//TODO vérifier qu'on a tous les paramètres
router.post('/', function(req, res, next) {
	connection.query('INSERT INTO catlimite (limite, idCategorie, siteEPF) VALUES (' + req.body.limite + ',' + req.body.idCategorie + ',' + req.body.siteEPF + ')', function (error, results, fields) {
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
