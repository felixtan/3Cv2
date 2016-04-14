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
    'frapontillo.bootstrap-switch',
    'angular-toArrayFilter'
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
    };

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
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
          objectType: function() {
            return "car";
          }
        },
        // sp: getsp()
    })
    .state('dashboard.drivers', {
        url: '/drivers',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
            objectType: function() {
                return "driver";
            }
        }
    })
    .state('dashboard.prospects', {
        url: '/prospects',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
            // getProspectStatuses: function(dataService) {
            //     return dataService.getProspectStatuses();
            // },
            // getProspects: function(dataService) {
            //     return dataService.getProspects();
            // },
            objectType: function() {
                return "prospect";
            }
        }
    })
    .state('dashboard.assets', {
        url: '/assets',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
            // getAssetTypes: function(dataService) {
            //     return dataService.getAssetTypes();
            // },
            // getAssets: function(dataService) {
            //     return dataService.getAssets();
            // },
            objectType: function() {
                return "asset";
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
        templateUrl: 'views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            // getCars: function(dataService) {
            //     return dataService.getCars();
            // },
            objectType: function () {
                return "car";
            }
        },
        sp: getsp()
    })
    .state('logs.drivers', {
        url: '/drivers',
        templateUrl: 'views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            // getDrivers: function(dataService) {
            //     return dataService.getDrivers();
            // }
            objectType: function () {
                return "driver";
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
    .state('carData', {
        url: '/cars/:id/data',
        templateUrl: '/views/objectData.html',
        controller: 'ObjectDataCtrl',
        sp: getsp(),
        resolve: {
            objectType: function() {
                return "car";
            },
            objectId: function($stateParams) {
                return $stateParams.id;
            }
        }
    })
    .state('carLogs', {
        url: '/cars/:id/logs',
        templateUrl: '/views/objectLogs.html',
        controller: 'ObjectLogsCtrl',
        sp: getsp(),
        resolve: {
            objectType: function() {
                return "car";
            },
            objectId: function($stateParams) {
                return $stateParams.id;
            }
        }
    })
    .state('driverData', {
        url: '/drivers/:id/data',
        templateUrl: '/views/objectData.html',
        controller: 'ObjectDataCtrl',
        sp: getsp(),
        resolve: {
            objectType: function() {
                return "driver";
            },
            objectId: function($stateParams) {
                return $stateParams.id;
            }
        }
    })
    .state('driverLogs', {
        url: '/drivers/:id/logs',
        templateUrl: '/views/objectLogs.html',
        controller: 'ObjectLogsCtrl',
        sp: getsp(),
        resolve: {
            objectType: function() {
                return "driver";
            },
            objectId: function($stateParams) {
                return $stateParams.id;
            }
        }
    })
    .state('prospectData', {
        url: '/prospects/:id/data',
        templateUrl: '/views/objectData.html',
        controller: 'ObjectDataCtrl',
        sp: getsp(),
        resolve: {
            objectType: function() {
                return "prospect";
            },
            objectId: function($stateParams) {
                return $stateParams.id;
            }
        }
    })
    .state('assetData', {
        url: '/assets/:id/data',
        templateUrl: '/views/objectData.html',
        controller: 'ObjectDataCtrl',
        sp: getsp(),
        resolve: {
            objectType: function() {
                return "asset";
            },
            objectId: function($stateParams) {
                return $stateParams.id;
            }
        }
    })
    .state('assetLogs', {
        url: '/assets/:id/logs',
        templateUrl: '/views/assetLogs.html',
        controller: 'AssetLogsCtrl',
        sp: getsp(),
        resolve: {
            objectType: function() {
                return "asset";
            },
            objectId: function($stateParams) {
                return $stateParams.id;
            }
        }
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