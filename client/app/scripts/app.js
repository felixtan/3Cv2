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
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl' 
    })
    .state('emailverification', {
        url: '/register/verify?sptoken',
        templateUrl: 'views/emailverification.html',
        controller: 'EmailverificationCtrl'
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
    });
  })
  .run(function(editableOptions, $stormpath) {
    editableOptions.theme = 'bs3';
    $stormpath.uiRouter({
      loginState: 'login',
      defaultPostLoginState: 'main'
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
    //   .otherwise({
    //     redirectTo: '/login'
    //   });