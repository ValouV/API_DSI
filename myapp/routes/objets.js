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

//get all objets
//TODO donner que les actifs et créer une route qui donne les non actifs
router.get('/', function(req, res, next) {
  connection.query('SELECT * from objet', function (error, results, fields) {
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
//TODO balancer l'historique avec ou créer une route d'historique
//TODO donner la catégorie avec
router.get('/:objet_id', function(req, res, next) {
  connection.query('SELECT * from objet WHERE id = ' + req.params.objet_id, function (error, results, fields) {
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

//modify object
//TODO récupérer l'id utilisateur du token
router.patch('/:objet_id', function(req, res, next) {
  connection.query('UPDATE objet SET actif = ' + req.body.actif + ', isStock = ' + req.body.isStock + ', commentaire = "' + req.body.commentaire +'", siteEPF = ' + req.body.siteEPF + ', idCategorie = ' + req.body.idCategorie + ', idUser = ' + req.body.idUser + ' WHERE id = ' + req.params.objet_id, function (error, results, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      //If there is no error, all is good and response is 200OK.
    }
  });
});

//delete object
//TODO transformer en non actif
router.delete('/:objet_id', function(req, res, next) {
  connection.query('DELETE FROM objet WHERE id = ' + req.params.objet_id, function (error, results, fields) {
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
//TODO vérfier avec l'équipe Application que c'est peut être eux qui nous donnent l'id. Si oui vérifier id
router.post('/', function(req, res, next) {
  connection.query('SELECT siteEPF from user WHERE id = ' + jwt.decode(req.token).iduser, function (error, site, fields2) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      console.log(site);
      connection.query('INSERT INTO objet (actif, isStock, commentaire, siteEPF, idCategorie, idUser) VALUES (' + req.body.actif + ',' + req.body.isStock + ',"' + req.body.commentaire +'",' + site[0].siteEPF + ',' + req.body.idCategorie + ',' + jwt.decode(req.token).iduser +')', function (error, results, fields) {
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
                res.send(JSON.stringify({"status": 200, "error": null, "response": {objet, categorie}}));
              }
            });
          });
        }
      });
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
                res.send(JSON.stringify({"status": 200, "error": null, "response": { "mode":2 , objet, categorie }}));
              } else {
                connection.query('SELECT * from historiquepret WHERE idObjet = ' + req.params.objet_id + ' AND retourEffectif = "0000-00-00 00:00:00"', function(error2, monPret, fields2){
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
