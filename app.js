var express = require('express');
var everyauth = require('everyauth');
		    
var conf = require('./conf');

var app = module.exports = express.createServer();

everyauth.facebook.appId(conf.fb.appId)
	          .appSecret(conf.fb.secret)
		  .findOrCreateUser(function (session, accessToken, accessTokenExtra, fbUserMetadata) {
		      console.log(arguments);
		      return 5;
		  })
		  .redirectPath('/');
everyauth.helpExpress(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
      secret: conf.sessionSecret,
  }));
  app.use(everyauth.middleware());
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

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);