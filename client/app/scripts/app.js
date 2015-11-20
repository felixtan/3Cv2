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
    'ui.router',
    'ngMessages',
    'config'
  ])
  .config(function (ENV, $stateProvider, $urlRouterProvider, $provide) {
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

    // if(ENV.name === 'production' || 'staging') {
    //     $urlRouterProvider.otherwise('/login');
    // } else {
    //     $urlRouterProvider.otherwise('/');
    // }

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
    })
    .state('settings.models', {
        abstract: true,
        url: '/models',
        template: '<ui-view/>'
    })
    .state('settings.models.car', {
        url: '/car',
        templateUrl: 'views/settings/models/Car.html',
        controller: 'CarModelCtrl',
        controllerAs: 'carSettings',
        resolve: {
            getCarProperties: function(dataService) {
                return dataService.getCarProperties();
            }
        }
    })
    .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          getCars: function(dataService) {
            return dataService.getCars();
          },
          getProspects: function(dataService) {
            return dataService.getProspects();
          }
          // getGasCards: function(dataService) {
          //   return dataService.getGasCards();
          // },
          // getEzPasses: function(dataService) {
          //   return dataService.getEzPasses();
          // }
        }
    })
    .state('roster', {
        url: '/drivers',
        templateUrl: 'views/roster.html',
        controller: 'RosterCtrl',
        controllerAs: 'roster',
        resolve: {
          getDriversFull: function(dataService) {
            return dataService.getDriversFull();
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
    })
    .state('carProfile', {
        url: '/car/:id',
        templateUrl: '/views/carprofile.html',
        controller: 'CarProfileCtrl',
        controllerAs: 'car',
        resolve: {
            getCar: function(dataService, $stateParams) {
                return dataService.getCar($stateParams.id);
            }
        }
    });
  })
    // inject ENV when grunt-ng-constant is working
  .run(function(ENV, editableOptions, $state, $stateParams, $rootScope) {
    editableOptions.theme = 'bs3';

    // exposes $state to $rootScope so it can be referenced on any view/scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });