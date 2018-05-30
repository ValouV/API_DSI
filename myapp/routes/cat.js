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

//get all categorie
router.get('/', function(req, res, next) {
	connection.query('SELECT * from categorie', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});



router.get('/stocks', function(req, res, next) {
  connection.query('SELECT id, nom from categorie', function (error, results, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      req.categorie = results;
      req.nbrcategorie = results.length;
      //console.log(req.nbrcategorie);

      req.materielsobjet = [{}];

      for (let i = 0; i < req.nbrcategorie; i++) {
        //console.log(req.categorie[i]["nom"]);
        req.materielsobjet[i]={"id":req.categorie[i]["id"], "materiel_stock":req.categorie[i]["nom"]};
        // req.materielsobjet.push({"materiel_stock":i+1});
        connection.query("SELECT * from objet WHERE idCategorie='" + i + "'+1 and siteEPF=1 and actif=1", function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            if (!results.length) {
              req.materielsobjet[i]["etat_sceaux"] = 0;
            } else {
              //res.send(JSON.stringify({"status": 200, "error": null, "response": results.length}));

              req.materielsobjet[i]["etat_sceaux"] = results.length;
              //req.materielsobjet.push({"materiel_stock":i});
              //res.send(materielsobjet);
            }
          }
        });


        connection.query('SELECT * from objet WHERE idCategorie="' + i + '"+1 and siteEPF=2 and actif=1', function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            if (!results.length) {
              req.materielsobjet[i]["etat_troyes"] = 0;
            } else {
              req.materielsobjet[i]["etat_troyes"] = results.length;
            }
          }
        });

        connection.query('SELECT * from objet WHERE idCategorie="' + i + '"+1 and siteEPF=3 and actif=1', function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            if (!results.length) {
              req.materielsobjet[i]["etat_montpellier"] = 0;
            } else {
              req.materielsobjet[i]["etat_montpellier"] = results.length;
            }
          }
        });

        connection.query('SELECT limite from catlimite WHERE idCategorie="' + i + '"+1 and siteEPF=1', function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            if (!results.length){
              req.materielsobjet[i]["mini_sceaux"] = 0;
              //res.send(req.materielsobjet);
            } else{
              req.materielsobjet[i]["mini_sceaux"] = results[0].limite;
              //res.send(req.materielsobjet);
            }

          }
        });

        connection.query('SELECT limite from catlimite WHERE idCategorie="' + i + '"+1 and siteEPF=2', function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            if (!results.length){
              req.materielsobjet[i]["mini_troyes"] = 0;
              //res.send(req.materielsobjet);
            } else{
              req.materielsobjet[i]["mini_troyes"] = results[0].limite;
              //res.send(req.materielsobjet);
            }

          }
        });

        connection.query('SELECT limite from catlimite WHERE idCategorie="' + i + '"+1 and siteEPF=3', function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            if (!results.length){
              req.materielsobjet[i]["mini_montpellier"] = 0;
              //res.send(req.materielsobjet);
            } else{
              req.materielsobjet[i]["mini_montpellier"] = results[0].limite;

            }

            if (req.materielsobjet[i]["mini_sceaux"] > req.materielsobjet[i]["etat_sceaux"]) {
              req.materielsobjet[i]["besoin_sceaux"] = req.materielsobjet[i]["mini_sceaux"] - req.materielsobjet[i]["etat_sceaux"];
            } else {req.materielsobjet[i]["besoin_sceaux"] = 0;}

            if (req.materielsobjet[i]["mini_troyes"] > req.materielsobjet[i]["etat_troyes"]) {
              req.materielsobjet[i]["besoin_troyes"] = req.materielsobjet[i]["mini_troyes"] - req.materielsobjet[i]["etat_troyes"];
            } else {req.materielsobjet[i]["besoin_troyes"] = 0;}

            if (req.materielsobjet[i]["mini_montpellier"] > req.materielsobjet[i]["etat_montpellier"]) {
              req.materielsobjet[i]["besoin_montpellier"] = req.materielsobjet[i]["mini_montpellier"] - req.materielsobjet[i]["etat_montpellier"];
            } else {req.materielsobjet[i]["besoin_montpellier"] = 0;}

            req.materielsobjet[i]["total_besoins"] = req.materielsobjet[i]["besoin_sceaux"] + req.materielsobjet[i]["besoin_troyes"] + req.materielsobjet[i]["besoin_montpellier"];

            //res.send(req.materielsobjet);
            //req.materielsobjet.push({"materiel_stock":2});
            //if (i==req.nbrcategorie - 1 ) { res.send(req.materielsobjet)};
            if (i==req.nbrcategorie - 1){res.send(JSON.stringify({"status": 200, "error": null, "response": req.materielsobjet}))};
          }
        });
      }


    }

  });

  //res.send(req.materielsobjet);
  //req.materielsobjet.push({"materiel_stock":2});


});

router.get('/prets', function(req, res, next) {
  connection.query('SELECT historiquepret.*, categorie.nom, uHelisa.EMAIL, uHelisa.APPRENANT_NOM, uHelisa.APPRENANT_PRENOM from historiquepret, objet, categorie, uHelisa WHERE historiquepret.idUserHelisa = uHelisa.ID_ETUDIANT AND historiquepret.idObjet = objet.id AND objet.idCategorie = categorie.id AND historiquepret.retourEffectif = "0000-00-00 00:00:00"', function (error, prets, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({"status": 200, "error": null, "response": prets}));
      //If there is no error, all is good and response is 200OK.
    }
  });
});

//get specific categorie
router.get('/:cat_id', function(req, res, next) {

	connection.query('SELECT categorie.* from categorie WHERE id = ' + req.params.cat_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});

});

//modify categorie
router.patch('/:cat_id', function(req, res, next) {
  if (req.body.nom !== undefined){
    connection.query('SELECT id from categorie WHERE nom = "' + req.body.nom + '"', function (error, results, fields) {
      if (!results.length){
        connection.query('UPDATE categorie SET nom = "' + req.body.nom + '" WHERE id = ' + req.params.cat_id, function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
          }
        });
      } else {
        res.send(JSON.stringify({"status": 500, "error": "Category name already taken", "response": null}));
      }
    });
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide parameter", "response": null}));
  }
});

//delete categorie
router.delete('/:cat_id', function(req, res, next) {
  connection.query('SELECT objet.id FROM objet, categorie WHERE objet.idCategorie = ' + req.params.cat_id, function (error, results, fields) {
    if(results.length){
      res.send(JSON.stringify({"status": 500, "error": "There are stil active objets in the Category", "response": null}));
    } else {
      connection.query('DELETE FROM categorie WHERE id = ' + req.params.cat_id, function (error, results, fields) {
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
});

//create categorie
router.post('/', function(req, res, next) {
  if (req.body.nom !== undefined){
    connection.query('SELECT id from categorie WHERE nom = "' + req.body.nom + '"', function (error, results, fields) {
      if (!results.length){
        connection.query('INSERT INTO categorie (nom) VALUES ("' + req.body.nom + '")', function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
          }
        });
      } else {
        res.send(JSON.stringify({"status": 500, "error": "Category name already taken", "response": null}));
      }
    });
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide parameter", "response": null}));
  }
});


module.exports = router;
