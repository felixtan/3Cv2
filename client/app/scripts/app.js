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
    'stormpath.templates',
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
        controller: 'LoginCtrl'
    })
    .state('logout', {
        url: '/logout',
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl' 
    })
    .state('passwordResetRequest', {
        url: '/password/requestReset',
        templateUrl: 'views/passwordresetrequest.html',
        controller: 'PasswordResetRequestCtrl'
    })
    .state('passwordReset', {
        url: '/password/reset',
        templateUrl: 'views/passwordreset.html',
        controller: 'PasswordResetCtrl'
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

// $routeProvider
    //   .when('/', {
    //     templateUrl: 'views/main.html',
    //     controller: 'MainCtrl',
    //     controllerAs: 'main',
    //     resolve: {
    //       getCarsAndDrivers: function(dataService) {
    //         return dataService.getAss();
    //       },
    //       getProspects: function(dataService) {
    //         return dataService.getProspects();
    //       },
    //       getGasCards: function(dataService) {
    //         return dataService.getGasCards();
    //       },
    //       getEzPasses: function(dataService) {
    //         return dataService.getEzPasses();
    //       }
    //     }
    //   })
    //   .when('/add-driver', {
    //     templateUrl: 'views/adddriver.html',
    //     controller: 'AddDriverCtrl',
    //     controllerAs: 'newDriverForm',
    //     resolve: {
    //       getCars: function(dataService) {
    //         return dataService.getCars();
    //       },
    //       getGasCards: function(dataService) {
    //         return dataService.getGasCards();
    //       }
    //     }
    //   })
    //   .when('/pay-toll-gas', {
    //     templateUrl: 'views/ptg.html',
    //     controller: 'PtgCtrl',
    //     controllerAs: 'ptg',
    //     resolve: {
    //       getPtgLogs: function(dataService) {
    //         return dataService.getPtgLogs();
    //       },
    //       basicDriverData: function(dataService) {
    //         return dataService.getDrivers();
    //       }
    //     }
    //   })
    //   .when('/settings', {
    //     templateUrl: 'views/settings.html',
    //     controller: 'SettingsCtrl',
    //     controllerAs: 'settings',
    //     resolve: {
    //       settings: function(ptgLogSettingsService) {
    //         return ptgLogSettingsService.getSettings();
    //       }
    //     }
    //   })
    //   .when('/add-card', {
    //     templateUrl: 'views/addcard.html',
    //     controller: 'AddCardCtrl',
    //     controllerAs: 'newCardForm',
    //     resolve: {
    //       getGasCards: function(dataService) {
    //         return dataService.getGasCards();
    //       },
    //       getDrivers: function(dataService) {
    //         return dataService.getDrivers();
    //       }
    //     }
    //   })
    //   .when('/maintenance', {
    //     templateUrl: 'views/maintenanceLogs.html',
    //     controller: 'MaintenanceLogsCtrl',
    //     controllerAs: 'maintenance',
    //     resolve: {
    //       getMaintenanceLogs: function(dataService) {
    //         return dataService.getMaintenanceLogs();
    //       },
    //       basicCarData: function(dataService) {
    //         return dataService.getCars();
    //       }
    //     }
    //   })
    //   .when('/login', {
    //     templateUrl: 'views/login.html',
    //     controller: 'LoginCtrl',
    //     controllerAs: 'login'
    //   })
    // .when('/logout', {
    //   templateUrl: 'views/logout.html',
    //   controller: 'LogoutCtrl',
    //   controllerAs: 'logout'
    // })
    //   .otherwise({
    //     redirectTo: '/login'
    //   });