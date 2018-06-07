var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var moment = require('moment');


router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    jwt.verify(token, 'shit', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        req.token = token;

            connection.query('SELECT role from user WHERE id = '+ jwt.decode(token).iduser, function (error, results, fields) {
              if ([1,2].indexOf(results[0].role) !== -1 ){
                next();
              } else {
                return res.status(403).send({
                    success: false,
                    message: 'You should be admin to see this.'
                });
              }
            });
      }
    });
    // verifies secret and checks exp

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
      connection.end();
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
      connection.end();
  	});
});

//modify hprets
router.patch('/:hprets_id', function(req, res, next) {
  //on vérfie qu'on a tous les paramètres
  if (req.body.depart !== undefined && req.body.retourPrevu !== undefined && req.body.retourEffectif !== undefined && req.body.idUserAdmin !== undefined && req.body.idObjet !== undefined && req.body.idUserHelisa !== undefined && req.body.siteEPF !== undefined){
	connection.query('UPDATE historiquepret SET depart = "' + req.body.depart + '", retourPrevu = "' + req.body.retourPrevu + '", retourEffectif = "' + req.body.retourEffectif +'", idUserAdmin = ' + req.body.idUserAdmin + ', idObjet = ' + req.body.idObjet + ', idUserHelisa = ' + req.body.idUserHelisa + ', siteEPF = ' + req.body.siteEPF + ' WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
        connection.end();
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide all parameters", "response": null}));
  }
});

//delete hprets
/*router.delete('/:hprets_id', function(req, res, next) {
	connection.query('DELETE FROM historiquepret WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});*/

//create hprets
router.post('/', function(req, res, next) {
  //on vérifie qu'on a tous les paramètres
  if (req.body.idObjet !== undefined && req.body.idUserHelisa !== undefined && req.body.retourPrevu !== undefined){
    var date1 = req.body.retourPrevu;
    var date2 = moment().format("YYYY-MM-DD HH:mm:ss");
    var date1_ms = new Date(date1.replace(/-/g,'/'));
    var date2_ms = new Date(date2.replace(/-/g,'/'));
    //on vérifie que la date de retour prévue est après la date d'aujourd'hui
    if(date1_ms>date2_ms){
      //on récupère les informations de l'objet
    connection.query('SELECT isStock, siteEPF FROM objet WHERE objet.actif = 1 AND objet.id = ' + req.body.idObjet, function (error, objet, fields) {
      var siteEPF = objet[0].siteEPF;
      if(!objet.length || (objet[0].isStock == 1)){
        res.send(JSON.stringify({"status": 500, "error": "Unknown loan object", "response": null}));
      } else {
        //on vérifie qu'il n'y a pas de prêt en cours
        connection.query('SELECT id FROM historiquepret WHERE retourEffectif IS NULL AND idObjet = ' + req.body.idObjet, function (error, pret, fields) {
          if(pret.length){
            res.send(JSON.stringify({"status": 500, "error": "Object already in loan", "response": null}));
          } else {
            //on vérifie qu'on connait l'étudiant
            connection.query('SELECT APPRENANT_NOM FROM uHelisa WHERE ID_ETUDIANT = "' + req.body.idUserHelisa + '"', function (error, eleve, fields) {
              if(!eleve.length){
                  res.send(JSON.stringify({"status": 500, "error": "Unknown student", "response": null}));
              } else {
            var idUser = jwt.decode(req.token).iduser;
            var depart = moment().format("YYYY-MM-DD HH:mm:ss");
            //on écrit le pret dans la base de données
            connection.query('INSERT INTO historiquepret (depart, retourPrevu, retourEffectif, idUserAdmin, idObjet, idUserHelisa, siteEPF) VALUES ("' + depart + '","' + req.body.retourPrevu + '",NULL,' + idUser + ',' + req.body.idObjet + ',"' + req.body.idUserHelisa +'",' + siteEPF + '); UPDATE objet SET actif = 1 and isStock = 0 WHERE id = ' + req.body.idObjet + ';', function (error, results, fields) {
              if(error){
                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                //If there is error, we send the error in the error section with 500 status
              } else {
                res.send(JSON.stringify({"status": 200, "error": null, "response": results[0]}));
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
  connection.query('UPDATE historiquepret SET retourEffectif ="' + moment().format("YYYY-MM-DD HH:mm:ss") + '" WHERE id = ' + req.params.hprets_id, function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        //If there is no error, all is good and response is 200OK.
      }
    });
        connection.end();
});

module.exports = router;
