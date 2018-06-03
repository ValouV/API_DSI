var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
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

//get all hstocks
router.get('/', function(req, res, next) {
	connection.query('SELECT * from historiquestock', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//get specific hstock
router.get('/:hstocks_id', function(req, res, next) {
	connection.query('SELECT historiquestock.*, categorie.nom AS "Nom Categorie" from historiquestock, categorie, objet WHERE historiquestock.id = ' + req.params.hstocks_id + ' AND historiquestock.idObjet = objet.id AND objet.idCategorie = categorie.id', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//modify hstock
router.patch('/:hstocks_id', function(req, res, next) {
  if(req.body.depart !== undefined && req.body.arrivee !== undefined && req.body.idUserAdmin !== undefined && req.body.idObjet !== undefined && req.body.siteEPF){
    	connection.query('UPDATE historiquestock SET depart = "' + req.body.depart + '", arrivée = "' + req.body.arrivée + '", idUserAdmin = ' + req.body.idUserAdmin + ', idObjet = ' + req.body.idObjet + ' AND siteEPF = ' + req.body.siteEPF + ' WHERE id = ' + req.params.hstocks_id, function (error, results, fields) {
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

//delete hstock
/*
router.delete('/:hstocks_id', function(req, res, next) {
	connection.query('DELETE FROM historiquestock WHERE id = ' + req.params.hstocks_id, function (error, results, fields) {
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
  //on vérifie qu'on a tous les objets
  if (req.body.idObjet !== undefined){
    //on récupère les informations de l'objet
    connection.query('SELECT isStock, siteEPF FROM objet WHERE objet.actif = 1 AND id = ' + req.body.idObjet, function (error, objet, fields) {
      if (!objet.length){
        res.send(JSON.stringify({"status": 500, "error": "Object not found", "response": null}));
      } else if (objet[0].isStock == 0){
        res.send(JSON.stringify({"status": 500, "error": "Object is not Stock", "response": null}));
      } else {
        var siteEPF= objet[0].siteEPF
        var idUser = jwt.decode(req.token).iduser;
        var arrival = moment().format("YYYY-MM-DD HH:mm:ss");
        //on vérifie que l'objet n'est pas déjà en stock
        connection.query('SELECT * FROM historiquestock WHERE depart = "0000-00-00 00:00:00" AND idObjet =' + req.body.idObjet, function (error, historique, fields) {
          if (historique.length){
            res.send(JSON.stringify({"status": 500, "error": "Object is already in stock", "response": null}));
          } else {
            //on entre l'objet en stock
            connection.query('INSERT INTO historiquestock (arrivée, depart, idUserAdmin, idObjet, siteEPF) VALUES ("' + arrival + '","' + '0000-00-00 00:00:00' + '",' + idUser + ',' + req.body.idObjet + ',' + siteEPF + '); UPDATE objet SET actif = 1 and isStock = 1 WHERE id = ' + req.body.idObjet+ ';', function (error, results, fields) {
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
  } else {
    res.send(JSON.stringify({"status": 500, "error": "Please provide all parameters", "response": null}));
  }
});


//route de sortie de stock
router.patch('/depart/:hstocks_id', function(req, res, next) {
  //on entre la date de sortie dans la base de données
  connection.query('UPDATE historiquestock, objet SET historiquestock.depart ="' + moment().format("YYYY-MM-DD HH:mm:ss") + '", objet.actif=0 WHERE historiquestock.idObjet=objet.id AND historiquestock.depart = "0000-00-00 00:00:00" AND historiquestock.id=' + req.params.hstocks_id, function (error, results, fields) {
      console.log(results.affectedRows);
      if(error){
        res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
        //If there is error, we send the error in the error section with 500 status
      } else if (results.affectedRows != 2){
        res.send(JSON.stringify({"status": 500, "error": "Impossible to close this stock", "response": null}));
      } else {
        //on gère les alertes via une fonction
        var message = alerteStock(req.params.hstocks_id);
        res.send(JSON.stringify({"status": 200, "error": message, "response": results}));
        //If there is no error, all is good and response is 200OK.
      }
    });
});

module.exports = router;

//gestion des alertes
function alerteStock(results){
  var idStock = results;
  //on récupère les informations d'historique
  connection.query('SELECT * from historiquestock WHERE id = ' + results, function (error, results, fields) {
    var idObjet = results[0].idObjet;
    //on récupère les informations d'objet
    connection.query('SELECT objet.idCategorie, objet.siteEPF FROM objet WHERE objet.id = ' + idObjet, function (error, results, fields) {
      var idCategorie = results[0].idCategorie;
      var siteEPF = results[0].siteEPF;
      console.log(idStock, idObjet, idCategorie, siteEPF);
      //on récupère les objets de la catégorie
      connection.query('SELECT id from objet WHERE objet.idCategorie = ' + idCategorie + ' AND objet.siteEPF = ' + siteEPF + ' AND objet.actif = 1 AND objet.isStock = 1', function (error, results, fields) {
        var count = results.length;
        //on récupère les informations de limite
        connection.query('SELECT limite from catlimite WHERE catlimite.idCategorie = ' + idCategorie + ' AND catlimite.siteEPF = ' + siteEPF, function (error, results, fields) {
          var limite = results[0].limite;
          //si on est égal ou en dessous de la limite
          if (limite >= count){
            //on récupère le nom de la catégorie
            connection.query('SELECT nom from categorie WHERE id = ' + idCategorie, function (error, results, fields) {
              //on crée un message
              var message = "Vous avez atteint la limite pour l'objet de type " + results[0].nom + " sur le site de " + nomSiteEPF(siteEPF) + ". Il vous reste " + count + " objets.";
              //on récupère les emails
              connection.query('SELECT email from user WHERE role = 1', function (error, results, fields) {
                //on envoie un mail
                mail(results, "Alerte Stock", message);
                //on crée la notification onesignal
                var messageNotif = {
                  app_id: "9f332b69-e10b-446d-8d77-0b452f8ba64a",
                  contents: {"en": message},
                  included_segments: ["All"]
                };
                //on envoie une notification
                sendNotification(messageNotif);
                //on créer l'alerte associée
                connection.query('INSERT INTO alerteStock(date, message, lu, type, idHistoriqueStock) VALUES ("'+ moment().format("YYYY-MM-DD HH:mm:ss") +'","' + message + '",0,0,' + idStock +')', function (error, results, fields) {
                });
                return message;
              });
            });
          }
        });
      });
    });
  });
  return null;
}

function nomSiteEPF(siteEPF){
	switch (siteEPF){
		case 1:
		return "Sceaux";
		break;
		case 2:
		return "Troyes";
		break;
		default:
		return "Montpellier";
	}
}

//envoi de mail
function mail(destination, subject, message){
  //le mail sera envoyé via une adresse mail spécifique
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'epf.stock.dsi@gmail.com',
      pass: '1EPFadmin'
    }
  });
//pour chaque destinataire
  destination.forEach(function (to, i , array) {
    //on crée le message a envoyer
    const mailOptions = {
      from: 'epf.stock.dsi@gmail.com', // sender address
      to: to.email, // list of receivers
      subject: subject,
      html: message
    };
//puis on l'envoie en vérifiant le bon déroulé
    transporter.sendMail(mailOptions, function (err, info) {
      if(err)
      console.log(err)
      else
      console.log(info);
    });
  });
}

//envoi de la notification via le système onesignal
function sendNotification(data) {
  //authentification
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic ZGRlYmE2N2MtNGZjOS00NzAzLThmOTgtN2ZiY2M0ZDQ0MmI1"
  };

  //envoi à tous les abonnés
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  //on crée la requête
  var https = require('https');
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });

  //on envoie au service en vérifiant la réponse en console
  req.write(JSON.stringify(data));
  req.end();
};
