
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
	, path = require('path')
	, MongoStore = require('connect-mongo')(express)
	, settings = require('./settings')
	, flash = require('connect-flash');

//var app = module.exports = express.createServer();
var app = express();

// Configuration

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
	app.use(flash());
	app.use(express.favicon());
	app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: settings.cookieSecret,
		key: settings.db, // cookie name
		cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30 days
		store: new MongoStore({
			db: settings.db
		})
	}));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
routes(app);
//app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
