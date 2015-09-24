var express = require('express');
var stormpathExpressSdk = require('stormpath-sdk-express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.set('models', require('./db/models'));
console.log(process.env);
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// stormpath
// var apiKey = require(path.join(process.env.HOME, '/.stormpath/apiKey'));
var spMiddleware = stormpathExpressSdk.createMiddleware({
  cache: 'memory',
  apiKeyId: process.env.STORMPATH_API_KEY_ID || '61DEQ0RV2XQNYF92MLBGRJ40F',
  apiKeySecret: process.env.STORMPATH_API_KEY_SECRET || 'yYclBSybH5K1HTOnjepY2gHXhRZOMH4e7XdBAKvD+og',
  appHref: process.env.STORMPATH_URL || 'https://api.stormpath.com/v1/applications/2FK2EinsSqnyPZwzuOKGwk',
  secretKey: process.env.STORMPATH_SECRET_KEY || '27ENHv1QFu8j8bdt4RpMPXuKMCDn61JWbtv17gZzQmdu5/mMlr4oCQ==',
  expandCustomData: true,
  postRegistrationHandler: function(account, res, next) {
    var hrefArray = account.user.href.split('/');
    var accountId = hrefArray[hrefArray.length-1];
    account.user.getCustomData(function(err, data) {
      if(err) {
        next(err)
      } else {
        data.id = accountId;
        data.save();
        next();
      }
    });
  }
});

// development error handler
// will print stacktrace
if (app.get('env') === ('development' || 'production')) {

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
// if(app.get('env') === 'production') {

//   // changes it to use the optimized version for production
//   app.use(express.static(path.join(__dirname, '/dist')));

//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: {}
//     });
//   });
// }

// attach stormpath routes
spMiddleware.attachDefaults(app);
// app.use(spMiddleware.authenticate);

// Includes all routes
var router = require('./router')(app);

module.exports = app;
