var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var moment = require('moment');


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
router.get('/:hprets_id', function(req, res, next) {
	connection.query('SELECT historiquepret.*, categorie.nom, uHelisa.APPRENANT_PRENOM AS "Prénom Emprunteur", uHelisa.APPRENANT_NOM AS "Nom Emprunteur" from historiquepret, uHelisa, categorie, objet WHERE historiquepret.id = ' + req.params.hprets_id + ' AND historiquepret.idUserHelisa = uHelisa.ID_ETUDIANT AND historiquepret.idObjet = objet.id AND objet.idCategorie = categorie.id', function (error, results, fields) {
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
router.patch('/:hprets_id', function(req, res, next) {
  if (req.body.depart !== undefined && req.body.retourPrevu !== undefined && req.body.retourEffectif !== undefined && req.body.idUserAdmin !== undefined && req.body.idObjet !== undefined && req.body.idUserHelisa !== undefined){
	connection.query('UPDATE historiquepret SET depart = "' + req.body.depart + '", retourPrevu = "' + req.body.retourPrevu + '", retourEffectif = "' + req.body.retourEffectif +'", idUserAdmin = ' + req.body.idUserAdmin + ', idObjet = ' + req.body.idObjet + ', idUserHelisa = ' + req.body.idUserHelisa + ' WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide all parameters", "response": null}));
  }
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
router.post('/', function(req, res, next) {
  if (req.body.idObjet !== undefined && req.body.idUserHelisa !== undefined && req.body.retourPrevu !== undefined){
    var date1 = req.body.retourPrevu;
    var date2 = moment().format();
    var date1_ms = new Date(date1.replace(/-/g,'/'));
    var date2_ms = new Date(date2.replace(/-/g,'/'));
    if(date1_ms>date2_ms){
    connection.query('SELECT isStock FROM objet WHERE objet.actif = 1 AND objet.id = ' + req.body.idObjet, function (error, objet, fields) {
      if(!objet.length || (objet[0].isStock == 1)){
        res.send(JSON.stringify({"status": 500, "error": "Unknown loan object", "response": null}));
      } else {
        connection.query('SELECT id FROM historiquepret WHERE retourEffectif = "0000-00-00 00:00:00" AND idObjet = ' + req.body.idObjet, function (error, pret, fields) {
          if(pret.length){
            res.send(JSON.stringify({"status": 500, "error": "Object already in loan", "response": null}));
          } else {
            connection.query('SELECT APPRENANT_NOM FROM uHelisa WHERE ID_ETUDIANT = "' + req.body.idUserHelisa + '"', function (error, eleve, fields) {
              if(!eleve.length){
                  res.send(JSON.stringify({"status": 500, "error": "Unknown student", "response": null}));
              } else {
            var idUser = jwt.decode(req.token).iduser;
            var depart = moment().format();
            connection.query('INSERT INTO historiquepret (depart, retourPrevu, retourEffectif, idUserAdmin, idObjet, idUserHelisa) VALUES ("' + depart + '","' + req.body.retourPrevu + '","0000-00-00 00:00:00",' + idUser + ',' + req.body.idObjet + ',"' + req.body.idUserHelisa +'")', function (error, results, fields) {
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
      }
    });
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide a date in the future", "response": null}));
  }
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide all parameters", "response": null}));
  }
});

//retour de pret
router.patch('/retour/:hprets_id', function(req, res, next) {
  connection.query('UPDATE historiquepret SET retourEffectif ="' + moment().format() + '" WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
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
