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
router.get('/:hstocks_id', function(req, res, next) {
	connection.query('SELECT historiquestock.*, categorie.nom from historiquestock, categorie WHERE id = ' + req.params.hstocks_id, function (error, results, fields) {
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
router.post('/', function(req, res, next) {
  if (req.body.idObjet !== undefined){
    connection.query('SELECT isStock FROM objet WHERE objet.actif = 1 AND id = ' + req.body.idObjet, function (error, objet, fields) {
      if (!objet.length){
        res.send(JSON.stringify({"status": 500, "error": "Object not found", "response": null}));
      } else if (objet[0].isStock == 0){
        res.send(JSON.stringify({"status": 500, "error": "Object is not Stock", "response": null}));
      } else {
        var idUser = jwt.decode(req.token).iduser;
        var arrival = new Date().toISOString().slice(0, 19).replace("T", " ");
        connection.query('SELECT * FROM historiquestock WHERE depart = "0000-00-00 00:00:00" AND idObjet =' + req.body.idObjet, function (error, historique, fields) {
          if (historique.length){
            res.send(JSON.stringify({"status": 500, "error": "Object is already in stock", "response": null}));
          } else {
            connection.query('INSERT INTO historiquestock (arrivée, depart, idUserAdmin, idObjet) VALUES ("' + arrival + '","' + '0000-00-00 00:00:00' + '",' + idUser + ',' + req.body.idObjet + ')', function (error, results, fields) {
              if(error){
                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                //If there is error, we send the error in the error section with 500 status
              } else {
                res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                //If there is no error, all is good and response is 200OK.
              }
            });
          }
        });
      }
    });
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide all parameters", "response": null}));
  }
});

//TODO test si objet actif 1 avant
router.patch('/depart/:hstocks_id', function(req, res, next) {
  connection.query('UPDATE historiquestock, objet SET historiquestock.depart ="' + new Date().toISOString().slice(0, 19).replace("T", " ") + '", objet.actif=0 WHERE historiquestock.idObjet=objet.id AND historiqueobjet.depart = "0000-00-00 00:00:00" AND historiquestock.id=' + req.params.hstocks_id, function (error, results, fields) {
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
