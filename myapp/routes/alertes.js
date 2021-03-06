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
        ////connection.end();
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
  //selection des informations d'alertes de pret
  connection.query('SELECT alertepret.*, historiquepret.idUserAdmin, objet.id AS idObjet from alertepret, historiquepret, objet WHERE alertepret.idHistoriquePret = historiquepret.id AND historiquepret.idObjet = objet.id', function (error, alertesPret, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      ////connection.end();
      //If there is error, we send the error in the error section with 500 status
    } else {
      //selection des informations d'alertes de stock
      connection.query('SELECT alertestock.*, historiquestock.idUserAdmin, objet.id AS idObjet from alertestock, historiquestock, objet WHERE alertestock.idHistoriqueStock = historiquestock.id AND historiquestock.idObjet = objet.id', function (error, alertesStock, fields) {
        if(error){
          res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
          //If there is error, we send the error in the error section with 500 status
          ////connection.end();
        } else {
          //envoi des alertes
          res.send(JSON.stringify({"status": 200, "error": null, "response": {alertesPret, alertesStock}}));
          //les alertes sont considérées comme lues
          connection.query('UPDATE alertestock SET lu = 1; UPDATE alertepret SET lu = 1;'), function (error, results, fields) {
            if(error){
              console.log(error);
            }
            ;
          };
        }
        connection.end()
      });
    }
  });
});


module.exports = router;
