var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('config');
// For Heroku
function configure(config, value) {
  if(config[value]) return config[value];
  else return process.env[value];
}
var tw_consumerKey = configure(config, "tw_consumerKey");
var tw_consumerSecret = configure(config, "tw_consumerSecret");
var tw_callback = configure(config, "tw_callback");
//var session = require('express-session');
var passport = require('passport');
var twitterStrategy = require('passport-twitter').Strategy;

// ルーティング
var routes = require('./routes/index');
var users = require('./routes/users');
var oauth  = require('./routes/oauth');
var setting = require('./routes/setting');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// twitter
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new twitterStrategy({
    consumerKey: tw_consumerKey,
    consumerSecret: tw_consumerSecret,
    callbackURL: tw_callback
  },
  function(token, tokenSecret, profile, done) {
    app.set("token", token);
    app.set("tokenSecret", tokenSecret);
    process.nextTick(function() {
      return done(null, profile);
    });
  }
));
app.set("passport", passport);

app.use(require('express-session')({
  secret: "SECRET"
}));
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/oauth', oauth);
app.use('/setting', setting);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
