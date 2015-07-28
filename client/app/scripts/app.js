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
      .otherwise({
        redirectTo: '/'
      });
  });
