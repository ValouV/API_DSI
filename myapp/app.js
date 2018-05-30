var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require("mysql");
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var objetsRouter = require('./routes/objets');
var hPretsRouter = require('./routes/hPrets');
var hStocksRouter = require('./routes/hStocks');
var cLimitRouter = require('./routes/cLimit');
var catRouter = require('./routes/cat');
var alertesRouter = require('./routes/alertes');
var helisaRouter = require('./routes/helisa');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());

//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({

		//server connection ne pas toucher
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'inventaire',

		//louis
/*
    	port     : '3306',
		user     : 'root',
		password : '',
		database : 'bddclean',*/

		//val
		/*port     : '8889',
		user     : 'root',
		password : 'root',
		database : 'Inventaire_DSI',*/
		multipleStatements: true

	});
	connection.connect();
	next();
});

//TODO cron prets
/*
var cron = require('node-cron');
cron.schedule('* * * * *', function(){
  console.log('running a task every minute');
});
//TODO Faire un cron pour regarder les prêts non rendus alors qu'ils devraient l'être (soir même)
//TODO Faire un cron pour regarder les prêts non rendus alors qu'ils devraient l'être (tous les lundis matin)
https://nodemailer.com/about/
pour les mails
*/
//TODO routes admin
//TODO notifications
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/objets', objetsRouter);
app.use('/hPrets', hPretsRouter);
app.use('/hStocks', hStocksRouter);
app.use('/cLimit', cLimitRouter);
app.use('/cat', catRouter);
app.use('/alertes', alertesRouter);
app.use('/helisa', helisaRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var cron = require('node-cron');
cron.schedule('0 0 * * *', function(){
	var moment = require('moment');
	moment.locale('fr');
	var nodemailer = require('nodemailer');
	global.connection = mysql.createConnection({

		//server connection ne pas toucher
		host     : 'localhost',
		user     : 'root',
		password : '',
		database : 'inventaire',

		//louis
		/*
		port     : '3306',
		user     : 'root',
		password : '',
		database : 'bddclean',*/

		//val
		/*port     : '8889',
		user     : 'root',
		password : 'root',
		database : 'Inventaire_DSI',*/
		multipleStatements: true

	});
	connection.connect();
	connection.query('SELECT historiquepret.*, objet.*, categorie.*, uHelisa.* FROM historiquepret, objet, categorie, uHelisa WHERE historiquepret.retourEffectif = "0000-00-00 00:00:00" AND historiquepret.idObjet = objet.id AND objet.idCategorie = categorie.id AND historiquepret.idUserHelisa = ID_ETUDIANT', function (error, results, fields) {
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'epf.stock.dsi@gmail.com',
				pass: '1EPFadmin'
			}
		});
		var message = "";
		for (var i = 0; i < results.length; i++) {
			if(results[i].retourPrevu > moment().format()){
			message = message + "L'objet " + results[i].idObjet + " de type " + results[i].nom + " loué (pas les poulets) par " + results[i].APPRENANT_NOM + " " + results[i].APPRENANT_PRENOM + " (" + results[i].EMAIL + ") est en retard. Il aurait dû revenir le " + moment(results[i].retourPrevu).format('l') + ".</br>";
			var mailOptions = {
				from: 'epf.stock.dsi@gmail.com', // sender address
				to: results[i].EMAIL, // list of receivers
				subject: "RETARD SUR PRET",
				html: "Vous avez loué (pas les poulets) un objet de type" + results[i].nom + ". Vous auriez du le retourner en date du " + moment(results[i].retourPrevu).format('l') + " . Veuillez le retourner au plus vite avant que je sois dans l'obligation de manger vos énormes morts."
			};
			transporter.sendMail(mailOptions, function (err, info) {
				if(err)
				console.log(err)
				else
				console.log(info);
			});
		}
		}
		if(message != null){
		connection.query('SELECT email from user WHERE role = 1', function (error, results, fields) {
			results.forEach(function (to, i , array) {
				const mailOptions = {
					from: 'epf.stock.dsi@gmail.com', // sender address
					to: to.email, // list of receivers
					subject: "UPDATE RETARDS HEBDOMADAIRE",
					html: message
				};
				transporter.sendMail(mailOptions, function (err, info) {
					if(err)
					console.log(err)
					else
					console.log(info);
				});
			});
		});
	}
	});
});








module.exports = app;
