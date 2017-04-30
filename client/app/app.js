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
    'ui.bootstrap',
    'ngMessages',
    // 'stormpath',
    // 'stormpath.templates',
    'ui.router',
    'config',
    'frapontillo.bootstrap-switch',
  ])
  .config(function ($stateProvider, $urlRouterProvider, $provide, $qProvider) {

    $qProvider.errorOnUnhandledRejections(false);

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

    // $urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/dashboard/cars');

    $stateProvider
    .state('root', {
        url: '/',
        templateUrl: '<div></div>'
    })
    // .state('login', {
    //     url: '/login',
    //     templateUrl: 'login.html'
    // })
    // .state('registration', {
    //     url: '/registration',
    //     templateUrl: 'registration.html'
    // })
    // .state('forgot-password', {
    //     url: '/forgot-password',
    //     templateUrl: 'forgotpw.html'
    // })
    // .state('reset-password', {
    //     url:'/reset?sptoken',
    //     templateUrl: 'resetpw.html'
    // })
    .state('dashboard', {
        abstract: true,
        url: '/dashboard',
        template: '<ui-view/>',
    })
    .state('dashboard.cars', {
        url: '/cars',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
          objectType: function() {
            return "car";
          }
        }
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
            objectType: function() {
                return "asset";
            }
        }
    })
    .state('logs', {
        abstract: true,
        url: '/logs',
        template: '<ui-view/>',
    })
    .state('logs.cars', {
        url: '/cars',
        templateUrl: 'views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            objectType: function () {
                return "car";
            }
        }
    })
    .state('logs.drivers', {
        url: '/drivers',
        templateUrl: 'views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            objectType: function () {
                return "driver";
            }
        }
    })
    .state('logs.assets', {  // logs for assets of a certain type
        url: '/assets',
        templateUrl: '/views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            objectType: function () {
                return "asset";
            }
        }
    })
    .state('carData', {
        url: '/cars/:id/data',
        templateUrl: '/views/objectData.html',
        controller: 'ObjectDataCtrl',
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
        templateUrl: '/views/objectLogs.html',
        controller: 'ObjectLogsCtrl',
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

  // add when you want stormpath: , $stormpath
  .run(function(editableOptions, $state, $stateParams, $rootScope) {
    editableOptions.theme = 'bs3';

    // exposes $state to $rootScope so it can be referenced on any view/scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    // $stormpath.uiRouter({
    //     loginState: 'login',
    //     defaultPostLoginState: 'dashboard'
    // });
  });
