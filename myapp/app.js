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

	/*	//louis
    port     : '3306',
		user     : 'root',
		password : '',
		database : 'bddv1',*/

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


//TODO route Hélisa
//TODO mail alertes
//TODO routes d'alertes
//TODO routes admin
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/objets', objetsRouter);
app.use('/hPrets', hPretsRouter);
app.use('/hStocks', hStocksRouter);
app.use('/cLimit', cLimitRouter);
app.use('/cat', catRouter);


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

module.exports = app;
