var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


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
      }
    });
    // verifies secret and checks exp
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
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

//get all active objets
router.get('/', function(req, res, next) {
  connection.query('SELECT objet.*, categorie.nom AS "Categorie Nom", user.nom AS "User Nom", user.prenom AS "User Prenom" from objet, categorie, user WHERE objet.idCategorie = categorie.id AND objet.idUser = user.id AND objet.actif = 1', function (error, results, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(({"status": 200, "error": null, "response": results}));
      //If there is no error, all is good and response is 200OK.
    }
  });
});

//get all objets
router.get('/all', function(req, res, next) {
  connection.query('SELECT objet.*, categorie.nom AS "Categorie Nom", user.nom AS "User Nom", user.prenom AS "User Prenom" FROM objet, categorie, user WHERE objet.idCategorie = categorie.id AND objet.idUser = user.id', function (error, results, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(({"status": 200, "error": null, "response": results}));
      //If there is no error, all is good and response is 200OK.
    }
  });
});

//get specific object
router.get('/:objet_id', function(req, res, next) {
  connection.query('SELECT objet.*, categorie.nom AS "Categorie Nom", user.nom AS "User Nom", user.prenom AS "User Prenom" FROM objet, categorie, user WHERE objet.id = ' + req.params.objet_id + ' AND objet.idCategorie = categorie.id AND objet.idUser = user.id', function (error, results, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      //console.log(jwt.decode(req.token).iduser + " " + jwt.decode(req.token).emailuser);
      //If there is no error, all is good and response is 200OK.
    }
  });
});

router.get('/:objet_id/historique', function(req, res, next) {
  connection.query('SELECT historiquepret.*, uHelisa.APPRENANT_NOM AS "Nom emprunteur", uHelisa.APPRENANT_PRENOM AS "Prénom Empruteur" from historiquepret, uHelisa WHERE historiquepret.idUserHelisa = uHelisa.ID_ETUDIANT AND historiquepret.idObjet = ' + req.params.objet_id, function (error, historiquepret, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      connection.query('SELECT * from historiquestock WHERE historiquestock.idObjet = ' + req.params.objet_id, function (error, historiquestock, fields) {
        if(error){
          res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.send(JSON.stringify({"status": 200, "error": null, "response": {historiquepret, historiquestock}}));
          //console.log(jwt.decode(req.token).iduser + " " + jwt.decode(req.token).emailuser);
          //If there is no error, all is good and response is 200OK.
        }
      });
    }
  });
});

//modify object
router.patch('/:objet_id', function(req, res, next) {
  if (req.body.actif !== undefined && req.body.isStock !== undefined && req.body.commentaire !== undefined && req.body.idCategorie !== undefined){
    connection.query('SELECT siteEPF FROM user WHERE id = ' + jwt.decode(req.token).iduser, function (error, site, fields2) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": "User not recognized"}));
        //If there is error, we send the error in the error section with 500 status
      } else {
        connection.query('UPDATE objet SET actif = ' + req.body.actif + ', isStock = ' + req.body.isStock + ', commentaire = "' + req.body.commentaire +'", siteEPF = ' + site[0].siteEPF + ', idCategorie = ' + req.body.idCategorie + ', idUser = ' + jwt.decode(req.token).iduser + ' WHERE id = ' + req.params.objet_id, function (error, results, fields) {
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
  } else {
    res.send(JSON.stringify({"status": 500, "error": null, "response": "Please provide all parameters"}));
  }
});

//delete object
router.delete('/:objet_id', function(req, res, next) {
  connection.query('UPDATE objet SET actif = 0 WHERE id = ' + req.params.objet_id, function (error, results, fields) {
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
//TODO vérfier avec l'équipe Application que c'est peut être eux qui nous donnent l'id. Si oui vérifier id et créer route prochain id
router.post('/', function(req, res, next) {
  connection.query('SELECT siteEPF from user WHERE id = ' + jwt.decode(req.headers['x-access-token']).iduser, function (error, site, fields2) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
     // console.log(site);
      if (isNaN(req.body.idCategorie)) {res.send(JSON.stringify({"status": 500, "error": error, "response": "La catégorie d'objet doit être un nombre"}))}
else {
      connection.query('SELECT id FROM categorie WHERE id='+req.body.idCategorie, function (error, results2, fields) {
        if(error){
          res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
          //If there is error, we send the error in the error section with 500 status
        }
        if (!results2.length) {res.send(JSON.stringify({"status": 500, "error": error, "response": "Cette catégorie d'objet n'existe pas"}))}
         else {
          //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
          //If there is no error, all is good and response is 200OK.


      connection.query('INSERT INTO objet (actif, isStock, commentaire, siteEPF, idCategorie, idUser) VALUES (' + req.body.actif + ',' + req.body.isStock + ',"' + req.body.commentaire +'",' + site[0].siteEPF + ',' + req.body.idCategorie + ',' + jwt.decode(req.headers['x-access-token']).iduser +')', function (error, results, fields) {
        if(error){
          res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
          //If there is error, we send the error in the error section with 500 status
        } else {
          connection.query('SELECT * from objet WHERE id = ' + results.insertId , function (error, monObjet, fields) {
            connection.query('SELECT * from categorie WHERE id = ' + monObjet[0].idCategorie + ';', function(error3, maCategorie, fields3){
              if(error){
                res.send(JSON.stringify({"status": 500, "error": error3, "response": null}));
                //If there is error, we send the error in the error section with 500 status
              } else {
                var categorie = maCategorie[0];
                var objet = monObjet[0];
                res.send(JSON.stringify({"status": 200, "error": null, "response": {objet, categorie}, "results": results}));
              }
            });
          });
        }
      });
      }
      });
}
    }
  });
});

router.get('/state/:objet_id', function(req, res, next){
  connection.query('SELECT * from objet WHERE id = ' + req.params.objet_id, function (error, monObjet, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      if (!monObjet.length){
        res.send(JSON.stringify({"status": 200, "error": null, "response": { "mode":0 }}));
      } else {
        var objet = monObjet[0];
        connection.query('SELECT * from categorie WHERE id = ' + objet.idCategorie + ';', function(error3, maCategorie, fields3){
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error3, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            var categorie = maCategorie[0];
            if (objet.actif == 0){
              res.send(JSON.stringify({"status": 200, "error": null, "response":{ "mode":1 , objet, categorie }}));
            } else {
              if (objet.isStock == 1) {
                connection.query('SELECT * from objet WHERE actif = 1 and isStock = 1 AND idCategorie = ' + objet.idCategorie + ' AND siteEPF = ' + objet.siteEPF + ';' , function(error6, compte, fields6){
                  res.send(JSON.stringify({"status": 200, "error": null, "response": { "mode":2 , objet, categorie, "reste":compte.length }}));
                });
              } else {
                connection.query('SELECT historiquepret.*, uHelisa.APPRENANT_NOM, uHelisa.APPRENANT_PRENOM from historiquepret, uHelisa WHERE historiquepret.idUserHelisa = uHelisa.ID_ETUDIANT AND idObjet = ' + req.params.objet_id + ' AND retourEffectif = "0000-00-00 00:00:00"', function(error2, monPret, fields2){
                  if(error){
                    res.send(JSON.stringify({"status": 500, "error": error2, "response": null}));
                    //If there is error, we send the error in the error section with 500 status
                  } else {
                    if (!monPret.length){
                      res.send(JSON.stringify({"status": 200, "error": null, "response":  { "mode":3 , objet, categorie }}));
                    } else {
                      var pret = monPret[0];
                      res.send(JSON.stringify({"status": 200, "error": null, "response":  { "mode":4 , objet, categorie, pret }}));
                    }
                  }
                });
              }
            }
          }
        });
      }
    }
  });
});

module.exports = router;
