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
          }
          // getProspects: function(dataService) {
          //   return dataService.getProspects();
          // }
        }
    })
    .state('main.carForm', {
        url: 'car-form',
        onEnter: function($modal, dataService, $state) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'views/carformmodal.html',
                controller: 'CarFormModalInstanceCtrl',
                size: 'md',
                resolve: {
                    getCars: function(dataService) {
                        return dataService.getCars();
                    }
                }
            });

            modalInstance.result.then(function () {
                // upon submit
                $state.go('main');
                console.log('Modal dismissed at: ' + new Date());
            }, function() {
                // upon dismiss
                $state.go('main');
            });
        }
    })
    .state('roster', {
        url: '/drivers',
        templateUrl: 'views/roster.html',
        controller: 'RosterCtrl',
        controllerAs: 'roster',
        resolve: {
          getDrivers: function(dataService) {
            return dataService.getDrivers();
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
    .state('logs', {
        abstract: true,
        url: '/logs',
        template: '<ui-view/>'
    })
    .state('logs.cars', {
        url: '/cars',
        templateUrl: 'views/carLogs.html',
        controller: 'CarLogsCtrl',
        controllerAs: 'logctrl',
        resolve: {
            getCars: function(dataService) {
                return dataService.getCars();
            }
        }
    })
    .state('carProfile', {
        abstract: true,
        url: '/car/:id',
        templateUrl: '/views/carprofile.html',
        controller: 'CarProfileCtrl',
        resolve: {
            getCar: function(dataService, $stateParams) {
                return dataService.getCar($stateParams.id);
            },
            getCars: function(dataService) {
                return dataService.getCars();
            }
        }
    })
    .state('carProfile.data', {
        url: '/data',
        templateUrl: '/views/cardataui.html',
        controller: 'CarDataCtrl'
    })
    .state('carProfile.logs', {
        url: '/logs',
        templateUrl: '/views/carlogsui.html',
        controller: 'CarLogCtrl'
    }); 
  })
    // inject ENV when grunt-ng-constant is working
  .run(function(ENV, editableOptions, $state, $stateParams, $rootScope) {
    editableOptions.theme = 'bs3';

    // exposes $state to $rootScope so it can be referenced on any view/scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  });