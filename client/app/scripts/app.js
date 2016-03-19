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
    // 'stormpath',
    'stormpath.templates',
    'config',
    'frapontillo.bootstrap-switch'
    // 'toggleSwitch'
    // 'angular-toggle-switch'
    // 'angular-bootstrap-toggle-switch'
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

    var getsp = function() {
        var authOn = { authenticate: true };
        var authOff = {};
        return authOff;
    }

    // $urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/dashboard/cars');

    $stateProvider
    .state('wtf', {
        url: '/',
        templateUrl: '<div></div>'
    })
    .state('login', {
        url: '/login',
        templateUrl: 'login.html'
    })
    .state('registration', {
        url: '/registration',
        templateUrl: 'registration.html'
    })
    .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'forgotpw.html'
    })
    .state('reset-password', {
        url:'/reset?sptoken',
        templateUrl: 'resetpw.html'
    })
    .state('dashboard', {
        abstract: true,
        url: '/dashboard',
        template: '<ui-view/>',
        sp: getsp()
    })
    .state('dashboard.cars', {
        url: '/cars',
        templateUrl: 'views/carList.html',
        controller: 'CarListCtrl',
        controllerAs: 'carList',
        resolve: {
          getCars: function(dataService) {
            return dataService.getCars();
          }
        },
        sp: getsp()
    })
    .state('dashboard.drivers', {
        url: '/drivers',
        templateUrl: '/views/driverList.html',
        controller: 'DriversUICtrl',
        controllerAs: 'driversui',
        resolve: {
            getDrivers: function(dataService) {
                return dataService.getDrivers();
            }
        }
    })
    .state('dashboard.prospects', {
        url: '/prospects',
        templateUrl: '/views/prospectList.html',
        controller: 'ProspectListCtrl',
        resolve: {
            getProspectStatuses: function(dataService) {
                return dataService.getProspectStatuses();
            },
            getProspects: function(dataService) {
                return dataService.getProspects();
            }
        }
    })
    .state('dashboard.assets', {
        url: '/assets',
        templateUrl: '/views/assetList.html',
        controller: 'AssetListCtrl',
        resolve: {
            getAssetTypes: function(dataService) {
                return dataService.getAssetTypes();
            },
            getAssets: function(dataService) {
                return dataService.getAssets();
            }
        }
    })
    .state('logs', {
        abstract: true,
        url: '/logs',
        template: '<ui-view/>',
        sp: getsp()
    })
    .state('logs.cars', {
        url: '/cars',
        templateUrl: 'views/carsLogs.html',
        controller: 'CarsLogsCtrl',
        resolve: {
            getCars: function(dataService) {
                return dataService.getCars();
            }
        },
        sp: getsp()
    })
    .state('logs.drivers', {
        url: '/drivers',
        templateUrl: 'views/driversLogs.html',
        controller: 'DriverLogsCtrl',
        controllerAs: 'driverlogs',
        resolve: {
            getDrivers: function(dataService) {
                return dataService.getDrivers();
            }
        },
        sp: getsp()
    })
    .state('logs.assets', {  // logs for assets of a certain type
        url: '/assets',
        templateUrl: '/views/assetTypeLogs.html',
        controller: 'AssetTypeLogsCtrl',
        resolve: {
            getAssets: function(dataService) {
                return dataService.getAssets();
            },
            getAssetTypes: function(dataService) {
                return dataService.getAssetTypes();
            }
        },
        sp: getsp()
    })
    .state('carProfile', {
        abstract: true,
        url: '/car/:id',
        templateUrl: '/views/carProfile.html',
        controller: 'CarProfileCtrl',
        resolve: {
            getCar: function(dataService, $stateParams) {
                return dataService.getCar($stateParams.id);
            },
            getCars: function(dataService) {
                return dataService.getCars();
            }
        },
        sp: getsp()
    })
    .state('carProfile.data', {
        url: '/data',
        templateUrl: '/views/carData.html',
        controller: 'CarDataCtrl',
        sp: getsp()
    })
    .state('carProfile.logs', {
        url: '/logs',
        templateUrl: '/views/carLogs.html',
        controller: 'CarLogsCtrl',
        sp: getsp()
    })
    .state('driverProfile', {
        abstract: true,
        url: '/driver/:id',
        templateUrl: '/views/driverProfile.html',
        controller: 'DriverProfileCtrl',
        resolve: {
            getDriver: function(dataService, $stateParams) {
                return dataService.getDriver($stateParams.id);
            },
            getDrivers: function(dataService) {
                return dataService.getDrivers();
            }
        },
        sp: getsp()
    })
    .state('driverProfile.data', {
        url: '/data',
        templateUrl: '/views/driverData.html',
        controller: 'DriverDataCtrl',
        sp: getsp()
    })
    .state('driverProfile.logs', {
        url: '/logs',
        templateUrl: '/views/driverLogs.html',
        controller: 'DriverLogCtrl',
        sp: getsp()
    })
    .state('prospectProfile', {
        abstract: true,
        url: '/prospect/:id',
        templateUrl: '/views/prospectProfile.html',
        controller: 'ProspectProfileCtrl',
        resolve: {
            getProspect: function(dataService, $stateParams) {
                return dataService.getProspect($stateParams.id);
            },
            getProspects: function(dataService) {
                return dataService.getProspects();
            },
            getProspectStatuses: function(dataService) {
                return dataService.getProspectStatuses();
            }
        },
        sp: getsp()
    })
    .state('prospectProfile.data', {
        url: '/data',
        templateUrl: '/views/prospectData.html',
        controller: 'ProspectDataCtrl',
        sp: getsp()
    })
    .state('assetProfile', {
        abstract: true,
        url: '/assets/:type/:id',
        templateUrl: '/views/assetProfile.html',
        controller: 'AssetProfileCtrl',
        resolve: {
            getAsset: function(dataService, $stateParams) {
                return dataService.getAsset($stateParams.id);
            },
            getAssets: function(dataService) {
                return dataService.getAssets();
            },
            getAssetTypes: function(dataService) {
                return dataService.getAssetTypes();
            },
        },
        sp: getsp()
    })
    .state('assetProfile.data', {
        url: '/data',
        templateUrl: '/views/assetData.html',
        controller: 'AssetDataCtrl',
        sp: getsp()
    })
    .state('assetProfile.logs', {
        url: '/logs',
        templateUrl: '/views/assetLogs.html',
        controller: 'AssetLogsCtrl',
        sp: getsp()
    }); 
  })
    // inject ENV when grunt-ng-constant is working
    // add when you want stormpath: , $stormpath
  .run(function(ENV, editableOptions, $state, $stateParams, $rootScope) {
    editableOptions.theme = 'bs3';

    // exposes $state to $rootScope so it can be referenced on any view/scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // $stormpath.uiRouter({
    //     loginState: 'login',
    //     defaultPostLoginState: 'dashboard'
    // });
  });