var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
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
  connection.query('SELECT alertepret.*, historiquepret.idUserAdmin, objet.id AS idObjet from alertepret, historiquepret, objet WHERE alertepret.idHistoriquePret = historiquepret.id AND historiquepret.idObjet = objet.id', function (error, alertesPret, fields) {
    if(error){
      res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
      //If there is error, we send the error in the error section with 500 status
    } else {
      connection.query('SELECT alertestock.*, historiquestock.idUserAdmin, objet.id AS idObjet from alertestock, historiquestock, objet WHERE alertestock.idHistoriqueStock = historiquestock.id AND historiquestock.idObjet = objet.id', function (error, alertesStock, fields) {
        if(error){
          res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.send(JSON.stringify({"status": 200, "error": null, "response": {alertesPret, alertesStock}}));
          connection.query('UPDATE alertestock SET lu = 1; UPDATE alertepret SET lu = 1;'), function (error, results, fields) {
            if(error){
              console.log(error);
            }
          };
        }
      });
    }
  });
});


module.exports = router;
