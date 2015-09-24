'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'xeditable',
    'ng-sortable',
    'ui.bootstrap',
    'stormpath',
    'ui.router',
    'ngMessages'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        sp: {
            authenticate: false
        }
    })
    .state('logout', {
        url: '/logout',
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        sp: {
            authenticate: false
        }
    })
    .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        sp: {
            authenticate: false
        }
    })
    .state('passwordResetRequest', {
        url: '/password/requestReset',
        templateUrl: 'views/passwordresetrequest.html',
        sp: {
            authenticate: false
        }
    })
    .state('passwordReset', {
        url: '/password/reset',
        templateUrl: 'views/passwordreset.html',
        sp: {
            authenticate: false
        }
    })
    .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          getCarsAndDrivers: function(dataService) {
            return dataService.getAss();
          },
          getProspects: function(dataService) {
            return dataService.getProspects();
          },
          getGasCards: function(dataService) {
            return dataService.getGasCards();
          },
          getEzPasses: function(dataService) {
            return dataService.getEzPasses();
          }
        },
        sp: {
            authenticate: true
        }
    })
    .state('ptg', {
        url: '/pay-toll-gas',
        templateUrl: 'views/ptg.html',
        controller: 'PtgCtrl',
        controllerAs: 'ptg',
        resolve: {
          getPtgLogs: function(dataService) {
            return dataService.getPtgLogs();
          },
          basicDriverData: function(dataService) {
            return dataService.getDrivers();
          }
        },
        sp: {
            authenticate: true
        }
    })
    .state('maintenance', {
        url: '/maintenance',
        templateUrl: 'views/maintenanceLogs.html',
        controller: 'MaintenanceLogsCtrl',
        controllerAs: 'maintenance',
        resolve: {
          getMaintenanceLogs: function(dataService) {
            return dataService.getMaintenanceLogs();
          },
          basicCarData: function(dataService) {
            return dataService.getCars();
          }
        },
        sp: {
            authenticate: true
        }
    });
  })
  .run(function(editableOptions, $stormpath) {
    editableOptions.theme = 'bs3';
    $stormpath.uiRouter({
      loginState: 'login',
      defaultPostLoginState: 'main',
      forbiddenState: 'login',
      autoRedirect: true
    });
  });