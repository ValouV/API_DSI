var express = require('express');
var router = express.Router();

//get all objets
router.get('/', function(req, res, next) {
	connection.query('SELECT * from objet', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

//get specific object
router.get('/:objet_id', function(req, res, next) {
	connection.query('SELECT * from objet WHERE id = ' + req.params.objet_id, function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
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
router.post('/', function(req, res, next) {
	connection.query('INSERT INTO objet (actif, isStock, commentaire, siteEPF, idCategorie, idUser) VALUES (' + + req.body.actif + ',' + req.body.isStock + ',"' + req.body.commentaire +'",' + req.body.siteEPF + ',' + req.body.idCategorie + ',' + req.body.idUser +')', function (error, results, fields) {
	  	if(error){
	  		res.send(JSON.stringify({"status": 500, "error": error, "response": null}));
	  		//If there is error, we send the error in the error section with 500 status
	  	} else {
  			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  			//If there is no error, all is good and response is 200OK.
	  	}
  	});
});

module.exports = router;
