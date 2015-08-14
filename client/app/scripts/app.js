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
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          getCarsAndDrivers: function(dataService) {
            return dataService.getAss();
          },
          getProspects: function(dataService) {
            return dataService.getProspects();
          }
        }
      })
      .when('/add-car', {
        templateUrl: 'views/addcar.html',
        controller: 'AddcarCtrl',
        controllerAs: 'newCarForm',
        resolve: {
          getDrivers: function(dataService) {
            return dataService.getDrivers();
          }
        }
      })
      .when('/add-driver', {
        templateUrl: 'views/adddriver.html',
        controller: 'AddDriverCtrl',
        controllerAs: 'newDriverForm',
        resolve: {
          getCars: function(dataService) {
            return dataService.getCars();
          },
          getGasCards: function(dataService) {
            return dataService.getGasCards();
          }
        }
      })
      .when('/pay-toll-gas', {
        templateUrl: 'views/ptg.html',
        controller: 'PtgCtrl',
        controllerAs: 'ptg',
        resolve: {
          ptgViewData: function(dataService) {
            return dataService.getPtgLogs();
          },
          basicDriverData: function(dataService) {
            return dataService.getDrivers();
          }
        }
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings',
        resolve: {
          settings: function(ptgLogSettingsService) {
            return ptgLogSettingsService.getSettings();
          }
        }
      })
      .when('/add-card', {
        templateUrl: 'views/addcard.html',
        controller: 'AddCardCtrl',
        controllerAs: 'newCardForm',
        resolve: {
          getGasCards: function(dataService) {
            return dataService.getGasCards();
          },
          getDrivers: function(dataService) {
            return dataService.getDrivers();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  });
