var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var moment = require('moment');
var mysql = require("mysql");

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
    console.log('SELECT role from user WHERE id = '+ jwt.decode(token).iduser);
    connection.query('SELECT role from user WHERE id = '+ jwt.decode(token).iduser, function (error, results, fields) {
<<<<<<< Updated upstream
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
    connection.end();
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
    connection.end();
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
    connection.end();
  });
});

//retourne l'historique d'un objet
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
        connection.end();
      });
    }
  });

});

//modify object
router.patch('/:objet_id', function(req, res, next) {
  //on vérifie qu'on a tous les paramètres
  if (req.body.actif !== undefined && req.body.isStock !== undefined && req.body.commentaire !== undefined && req.body.idCategorie !== undefined){
    //on récupère le site via l'utilisateur
    connection.query('SELECT siteEPF FROM user WHERE id = ' + jwt.decode(req.token).iduser, function (error, site, fields2) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": "User not recognized"}));
        //If there is error, we send the error in the error section with 500 status
      } else {
        //on inclus le nouvel objet dans la base de données
        connection.query('UPDATE objet SET actif = ' + req.body.actif + ', isStock = ' + req.body.isStock + ', commentaire = "' + req.body.commentaire +'", siteEPF = ' + site[0].siteEPF + ', idCategorie = ' + req.body.idCategorie + ', idUser = ' + jwt.decode(req.token).iduser + ' WHERE id = ' + req.params.objet_id, function (error, results, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.
          }
          connection.end();
        });
      }
    });
  } else {
    res.send(JSON.stringify({"status": 500, "error": null, "response": "Please provide all parameters"}));
  }
});

//delete object
//TODO supprimer alerte associée, fermer prêt, foermer stock
router.delete('/:objet_id', function(req, res, next) {
  connection.query('UPDATE objet SET actif = 0 WHERE id = ' + req.params.objet_id, function (error, results, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      console.log(moment().format("YYYY-MM-DD h:mm:ss"));
      //fermeture des prets en cours
      connection.query('UPDATE historiquepret SET retourEffectif = "' + moment().format("YYYY-MM-DD HH:mm:ss") + '" WHERE idObjet = ' + req.params.objet_id, function(error, hist, fields){
<<<<<<< Updated upstream
        //fermeture des stocks en cours
        connection.query('UPDATE historiquestock SET depart = "' + moment().format("YYYY-MM-DD HH:mm:ss") + '" WHERE idObjet = ' + req.params.objet_id, function(error, hist, fields){
          //supression des alertes
          connection.query('DELETE alertepret.* FROM alertepret LEFT JOIN historiquepret AS h ON alertepret.idHistoriquePret = h.id LEFT JOIN objet AS obj ON h.idObjet = obj.id WHERE obj.id =' + req.params.objet_id, function(error, alerte, fields){
          });
=======
        connection.query('DELETE alertepret.* FROM alertepret LEFT JOIN historiquepret AS h ON alertepret.idHistoriquePret = h.id LEFT JOIN objet AS obj ON h.idObjet = obj.id WHERE obj.id =' + req.params.objet_id, function(error, alerte, fields){
        connection.end();
>>>>>>> Stashed changes
        });
      });
      //If there is no error, all is good and response is 200OK.
    }
  });
});

//create object
router.post('/', function(req, res, next) {
  //on récupère le siteEPF
  connection.query('SELECT siteEPF from user WHERE id = ' + jwt.decode(req.headers['x-access-token']).iduser, function (error, site, fields2) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      //on vérifie que la catégorie d'objet est un int
      if (isNaN(req.body.idCategorie)) {res.send(JSON.stringify({"status": 500, "error": error, "response": "La catégorie d'objet doit être un nombre"}))}
      else {
        //on vérifie que la catégorie existe
        connection.query('SELECT id FROM categorie WHERE id='+req.body.idCategorie, function (error, results2, fields) {
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          }
          if (!results2.length) {res.send(JSON.stringify({"status": 500, "error": error, "response": "Cette catégorie d'objet n'existe pas"}))}
          else {
            //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
            //If there is no error, all is good and response is 200OK.

            //on crée l'objet
            connection.query('INSERT INTO objet (actif, isStock, commentaire, siteEPF, idCategorie, idUser) VALUES (' + req.body.actif + ',' + req.body.isStock + ',"' + req.body.commentaire +'",' + site[0].siteEPF + ',' + req.body.idCategorie + ',' + jwt.decode(req.headers['x-access-token']).iduser +')', function (error, results, fields) {
              if(error){
                res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
                //If there is error, we send the error in the error section with 500 status
              } else {
                connection.query('SELECT * from objet WHERE id = ' + results.insertId , function (error, monObjet, fields) {
                  if (monObjet[0].isStock == 1){
                    connection.query('INSERT INTO historiquestock (arrivée, depart, idUserAdmin, idObjet, siteEPF) VALUES ("' + moment().format("YYYY-MM-DD HH:mm:ss") + '",NULL,' + jwt.decode(req.headers['x-access-token']).iduser + ',' + monObjet[0].id + ',' + site[0].siteEPF + ');', function (error7, results7, fields7) {
                      console.log(error7);
                    });
                  }
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
              connection.end();
            });
          }
        });
      }
    }
  });
});

//donne l'état d'un objet
router.get('/state/:objet_id', function(req, res, next){
  //on récupère l'objet
  connection.query('SELECT * from objet WHERE id = ' + req.params.objet_id, function (error, monObjet, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      //si il n'existe pas le mode est 0
      if (!monObjet.length){
        res.send(JSON.stringify({"status": 200, "error": null, "response": { "mode":0 }}));
      } else {
        var objet = monObjet[0];
        //on récupère sa catégorie
        connection.query('SELECT * from categorie WHERE id = ' + objet.idCategorie + ';', function(error3, maCategorie, fields3){
          if(error){
            res.send(JSON.stringify({"status": 500, "error": error3, "response": null}));
            //If there is error, we send the error in the error section with 500 status
          } else {
            var categorie = maCategorie[0];
            //si il est inactif le mode est 1
            if (objet.actif == 0){
              res.send(JSON.stringify({"status": 200, "error": null, "response":{ "mode":1 , objet, categorie }}));
              connection.end();
            } else {
              //si il est en stock le mode est 2
              if (objet.isStock == 1) {
                connection.query('SELECT * from objet WHERE actif = 1 and isStock = 1 AND idCategorie = ' + objet.idCategorie + ' AND siteEPF = ' + objet.siteEPF + ';' , function(error6, compte, fields6){
<<<<<<< Updated upstream
                  connection.query('SELECT * from historiquestock WHERE depart is NULL AND idObjet = ' + objet.id + ';', function(error8, stock, fields8){
                    var hStock = stock[0];
                    res.send(JSON.stringify({"status": 200, "error": null, "response": { "mode":2 , objet, categorie, hStock, "reste":compte.length }}));
                  });
=======
                  res.send(JSON.stringify({"status": 200, "error": null, "response": { "mode":2 , objet, categorie, "reste":compte.length }}));
                connection.end();
>>>>>>> Stashed changes
                });
              } else {
                connection.query('SELECT historiquepret.*, uHelisa.APPRENANT_NOM, uHelisa.APPRENANT_PRENOM from historiquepret, uHelisa WHERE historiquepret.idUserHelisa = uHelisa.ID_ETUDIANT AND idObjet = ' + req.params.objet_id + ' AND retourEffectif IS NULL', function(error2, monPret, fields2){
                  if(error){
                    res.send(JSON.stringify({"status": 500, "error": error2, "response": null}));
                    //If there is error, we send the error in the error section with 500 status
                  } else {
                    //si il est en flotte de prêt sans être en prêt le mode est 3
                    if (!monPret.length){
                      res.send(JSON.stringify({"status": 200, "error": null, "response":  { "mode":3 , objet, categorie }}));
                    } else {
                      var pret = monPret[0];
                      //si il est actuellement prêté le mode est 4
                      res.send(JSON.stringify({"status": 200, "error": null, "response":  { "mode":4 , objet, categorie, pret }}));
                    }
                  }
                  connection.end();
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
