var express = require('express');
var stormpath = require('express-stormpath');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var productionSetup = require('./db/scripts/productionSetup');

var app = express();

app.set('models', require('./db/models'));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// stormpath
if(app.get('env') === 'production') {
  app.use(stormpath.init(app, {
    debug: 'info',
    website: true,
    expand: {
      customData: true,
      groups: true,
    },
    web: {
      spaRoot: __dirname + '/dist/index.html',
      register: {
        uri: '/#/registration',
        form: {
          fields: {
            givenName: {
              enabled: false
            },
            surname: {
              enabled: false
            },
            organization: {
              enabled: true,
              label: 'Organization',
              name: 'organization',
              required: true,
              type: 'text',
            }
          },
          fieldOrder: ['givenName', 'surname', 'organization', 'email', 'password']
        }
      }
    },

    postRegistrationHandler: function(account, res, req, next) {
      /*
        saves a users stormpath id in their custom data so it can be access by this app
      */
      var hrefArray = account.href.split('/');

      account.getCustomData(function(err, data) {
        if(err) {
          next(err);
        } else {
          var organizationId = hrefArray[hrefArray.length-1];
          data.organizationId = organizationId;
          data.save();
          productionSetup.createDefaultProspectStatuses(organizationId);
          productionSetup.createAssetTypes(organizationId);
          next();
        }
      });
    },

    /* 
      Stormpath doesn't delete cookies all cookies on logout
      after logging out of the app, and logging in to another user, data from the previous user was still present 
      https://stackoverflow.com/questions/35835491/stormpath-express-session-logout-not-deleting-session

      postLogoutHandler was implemented in March 2016
      https://docs.stormpath.com/nodejs/express/latest/logout.html
    */
    postLogoutHandler: function (account, req, res, next) {
      console.log('logged out:', account);
      console.log('req:', req);
      console.log('res:', res);
      // req.session = null;
      // res.cookie('express.sid', "", { expires: new Date() });
      next();
    },

  }));
}

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

  /*
    Redirect user to login page if not logged in
  */
}

// Includes all routes
var router = require('./router')(app);

module.exports = app;
