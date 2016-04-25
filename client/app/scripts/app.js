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
    'stormpath',
    'stormpath.templates',
    'config',
    'frapontillo.bootstrap-switch',
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

    function getsp (ENV) {
        return (ENV.name === 'production' || ENV.name === 'staging') ? { authenticate: true } : { authenticate: false };
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
        sp: getsp(ENV),
    })
    .state('dashboard.cars', {
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
        abstract: true,
        url: '/logs',
        template: '<ui-view/>',
    })
    .state('logs.cars', {
        sp: getsp(ENV),
        url: '/cars',
        templateUrl: 'views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            objectType: function () {
                return "car";
            }
        },
    })
    .state('logs.drivers', {
        sp: getsp(ENV),
        url: '/drivers',
        templateUrl: 'views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            objectType: function () {
                return "driver";
            }
        },
    })
    .state('logs.assets', {  // logs for assets of a certain type
        sp: getsp(ENV),
        url: '/assets',
        templateUrl: '/views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            objectType: function () {
                return "asset";
            }
        },
    })
    .state('carData', {
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
        sp: getsp(ENV),
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
    // inject ENV when grunt-ng-constant is working
    // add when you want stormpath: , $stormpath
  .run(function(ENV, editableOptions, $stormpath, $state, $stateParams, $rootScope) {
    console.log("Running AngularJS in environment ", ENV);

    editableOptions.theme = 'bs3';

    // exposes $state to $rootScope so it can be referenced on any view/scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    if(ENV.name === 'production' || ENV.name === 'staging') {
        $stormpath.uiRouter({
            loginState: 'login',
            defaultPostLoginState: 'dashboard.cars'
        });
    }
  });