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
    .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings',
        sp: getsp()
    })
    .state('settings.models', {
        abstract: true,
        url: '/models',
        template: '<ui-view/>',
        sp: getsp()
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
        },
        sp: getsp()
    })
    .state('dashboard', {
        abstract: true,
        url: '/dashboard',
        template: '<ui-view/>',
        sp: getsp()
    })
    .state('dashboard.cars', {
        url: '/cars',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        resolve: {
          getCars: function(dataService) {
            return dataService.getCars();
          }
        },
        sp: getsp()
    })
    .state('dashboard.drivers', {
        url: '/drivers',
        templateUrl: '/views/driversui.html',
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
        templateUrl: 'views/carLogs.html',
        controller: 'CarLogsCtrl',
        resolve: {
            getCars: function(dataService) {
                return dataService.getCars();
            }
        },
        sp: getsp()
    })
    .state('logs.drivers', {
        url: '/drivers',
        templateUrl: 'views/driverLogs.html',
        controller: 'DriverLogsCtrl',
        controllerAs: 'driverlogs',
        resolve: {
            getDrivers: function(dataService) {
                return dataService.getDrivers();
            }
        },
        sp: getsp()
    })
    .state('logs.asset', {  // logs for assets of a certain type
        url: '/assets/:type/:id',
        templateUrl: '/views/assetTypeLogs.html',
        controller: 'AssetTypeLogsCtrl',
        resolve: {
            getAssets: function(dataService) {
                return dataService.getAssets();
            }
        },
        sp: getsp()
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
        },
        sp: getsp()
    })
    .state('carProfile.data', {
        url: '/data',
        templateUrl: '/views/cardataui.html',
        controller: 'CarDataCtrl',
        sp: getsp()
    })
    .state('carProfile.logs', {
        url: '/logs',
        templateUrl: '/views/carlogsui.html',
        controller: 'CarLogCtrl',
        sp: getsp()
    })
    .state('driverProfile', {
        abstract: true,
        url: '/driver/:id',
        templateUrl: '/views/driverprofile.html',
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
        templateUrl: '/views/driverdataui.html',
        controller: 'DriverDataCtrl',
        sp: getsp()
    })
    .state('driverProfile.logs', {
        url: '/logs',
        templateUrl: '/views/driverlogsui.html',
        controller: 'DriverLogCtrl',
        sp: getsp()
    })
    .state('prospectProfile', {
        abstract: true,
        url: '/prospect/:id',
        templateUrl: '/views/prospectprofile.html',
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
        templateUrl: '/views/prospectdata.html',
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