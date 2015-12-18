var express = require('express');
var stormpath = require('express-stormpath');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.set('models', require('./db/models'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// stormpath
app.use(stormpath.init(app, {
  debug: 'info, error',
  website: true,
  web: {
    spaRoot: process.env.HOME + '/Development/3C/client/app/index.html'
  },
  postRegistrationHandler: function(account, res, req, next) {
    var hrefArray = account.href.split('/');

    account.getCustomData(function(err, data) {
      if(err) {
        next(err);
      } else {
        data.organizationId = hrefArray[hrefArray.length-1];
        data.save();
        next();
      }
    });
  }
}));

// development error handler
// will print stacktrace
if (app.get('env') === ('development')) {

  // This will change in production since we'll be using the dist folder
  app.use(express.static(path.join(__dirname, '../client')));
  // This covers serving up the index page
  app.use(express.static(path.join(__dirname, '../client/.tmp')));
  app.use(express.static(path.join(__dirname, '../client/app')));

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
if(app.get('env') === 'production') {

  // changes it to use the optimized version for production
  app.use(express.static(path.join(__dirname, '/dist')));

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

// attach stormpath routes
// if(process.env.NODE_ENV === 'production' || 'staging') {
//   spMiddleware.attachDefaults(app);
//   app.use(spMiddleware.authenticate);
// }

// Includes all routes
var router = require('./router')(app);

module.exports = app;
