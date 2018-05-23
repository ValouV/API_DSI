var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
//TODO vérfier avec l'équipe Application que c'est peut être eux qui nous donnent l'id.
router.post('/', function(req, res, next) {
	connection.query('INSERT INTO objet (actif, isStock, commentaire, siteEPF, idCategorie, idUser) VALUES (' + req.body.actif + ',' + req.body.isStock + ',"' + req.body.commentaire +'",' + req.body.siteEPF + ',' + req.body.idCategorie + ',' + req.body.idUser +')', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});



router.post('/materiels', function(req, res, next) {


  connection.query('SELECT id from categorie', function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
        req.nbrcategorie=results.length;

      }

    });



  req.materielsobjet = [{"materiel_stock":0}];

for (var i = 0; i < 3; i++) {


  connection.query("SELECT * from objet WHERE idCategorie='" + i + "' and siteEPF=1 and actif=1", function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
        if (!results.length) {
          req.materielsobjet.forEach [i]["etat_sceaux"] = 0;
        } else {
      //res.send(JSON.stringify({"status": 200, "error": null, "response": results.length}));

      req.materielsobjet[i]["etat_sceaux"] = results.length;
      //req.materielsobjet.push({"materiel_stock":i});
      //res.send(materielsobjet);
      }
      }
    });
  req.materielsobjet.push({"materiel_stock":i+1});
}
    connection.query('SELECT * from objet WHERE idCategorie=1 and siteEPF=2 and actif=1', function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
        if (!results.length) {
          req.materielsobjet[0]["etat_troyes"] = 0;
        } else {
          req.materielsobjet[0]["etat_troyes"] = results.length;
      }
      }
    });

    connection.query('SELECT * from objet WHERE idCategorie=1 and siteEPF=3 and actif=1', function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
        if (!results.length) {
          req.materielsobjet[0]["etat_montpellier"] = 0;
        } else {
          req.materielsobjet[0]["etat_montpellier"] = results.length;
      }
      }
    });

    connection.query('SELECT limite from catlimite WHERE idCategorie=1 and siteEPF=1', function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
            if (!results.length){
        req.materielsobjet[0]["mini_sceaux"] = 0;
        res.send(req.materielsobjet);
      } else{
        req.materielsobjet[0]["mini_sceaux"] = results[0].limite;
        //res.send(req.materielsobjet);
      }

      }
    });

    connection.query('SELECT limite from catlimite WHERE idCategorie=1 and siteEPF=2', function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
            if (!results.length){
        req.materielsobjet[0]["mini_troyes"] = 0;
        //res.send(req.materielsobjet);
      } else{
        req.materielsobjet[0]["mini_troyes"] = results[0].limite;
        //res.send(req.materielsobjet);
      }

      }
    });

    connection.query('SELECT limite from catlimite WHERE idCategorie=1 and siteEPF=3', function (error, results, fields) {
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else {
            if (!results.length){
        req.materielsobjet[0]["mini_montpellier"] = 0;
        //res.send(req.materielsobjet);
      } else{
        req.materielsobjet[0]["mini_montpellier"] = results[0].limite;

      }

      if (req.materielsobjet[0]["mini_sceaux"] > req.materielsobjet[0]["etat_sceaux"]) {
        req.materielsobjet[0]["besoin_sceaux"] = req.materielsobjet[0]["mini_sceaux"] - req.materielsobjet[0]["etat_sceaux"];
      } else {req.materielsobjet[0]["besoin_sceaux"] = 0;}

      if (req.materielsobjet[0]["mini_troyes"] > req.materielsobjet[0]["etat_troyes"]) {
        req.materielsobjet[0]["besoin_troyes"] = req.materielsobjet[0]["mini_troyes"] - req.materielsobjet[0]["etat_troyes"];
      } else {req.materielsobjet[0]["besoin_troyes"] = 0;}

      if (req.materielsobjet[0]["mini_montpellier"] > req.materielsobjet[0]["etat_montpellier"]) {
        req.materielsobjet[0]["besoin_montpellier"] = req.materielsobjet[0]["mini_montpellier"] - req.materielsobjet[0]["etat_montpellier"];
      } else {req.materielsobjet[0]["besoin_montpellier"] = 0;}

      req.materielsobjet[0]["total_besoin"] = req.materielsobjet[0]["besoin_sceaux"] + req.materielsobjet[0]["besoin_troyes"] + req.materielsobjet[0]["besoin_montpellier"];

        //res.send(req.materielsobjet);
        //req.materielsobjet.push({"materiel_stock":2});
        res.send(req.materielsobjet);
      }
    });



});

module.exports = router;
