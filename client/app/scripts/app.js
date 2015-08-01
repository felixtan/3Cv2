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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          mainViewData: function(dataService) {
            return dataService.getAss();
          }
        }
      })
      .when('/add-car', {
        templateUrl: 'views/addcar.html',
        controller: 'AddcarCtrl',
        controllerAs: 'newCarForm',
        resolve: {
          addCarViewData: function(dataService) {
            return dataService.getDrivers();
          }
        }
      })
      .when('/add-driver', {
        templateUrl: 'views/adddriver.html',
        controller: 'AddDriverCtrl',
        controllerAs: 'newDriverForm',
        resolve: {
          addDriverViewData: function(dataService) {
            return dataService.getCars();
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
      .otherwise({
        redirectTo: '/'
      });
  });
