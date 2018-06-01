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

router.get('/', function(req, res, next) {
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
                  if (i==req.nbrcategorie - 1){res.send(JSON.stringify({"status": 200, "error": null, "response": req.materielsobjet}))};
        });

      }
    }
  });
});
module.exports = router;
