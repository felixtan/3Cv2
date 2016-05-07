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

    function inProduction (ENV) {
        return (ENV.name === 'production' || ENV.name === 'staging');
    }

    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'login.html'
    })
    .state('registration', {
        url: '/registration',
        templateUrl: 'registration.html',
        // controller: 'RegistrationCtrl',
    })
    .state('verify', {
        url: '/verify?sptoken',
        templateUrl: 'verify.html'
    })
    .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'forgotpw.html'
    })
    .state('reset-password', {
        url:'/reset-password?sptoken',
        templateUrl: 'resetpw.html'
    })
    .state('api', {
        url: '/api',
        abstract: true,
        sp: {
            authorize: {
                group: 'dev'
            }
        }
    })
    .state('404', {
        url: '/404',
        templateUrl: '404.html',
    })
    .state('403', {
        url: '/403',
        templateUrl: '404.html',
    })
    .state('dashboard', {
        abstract: true,
        url: '/',
        template: '<ui-view/>',
        sp: {
            authenticate: inProduction(ENV),
            waitForUser: inProduction(ENV),
        }
    })
    .state('dashboard.cars', {
        sp: {
            authenticate: inProduction(ENV),
            waitForUser: inProduction(ENV),
        },
        // url: '/cars',
        url: 'dashboard/cars',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
          objectType: function() {
            return "car";
          }
        }
    })
    .state('dashboard.drivers', {
        sp: {
            authenticate: inProduction(ENV),
        },
        // url: '/drivers',
        url: 'dashboard/drivers',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
            objectType: function() {
                return "driver";
            }
        }
    })
    .state('dashboard.prospects', {
        sp: {
            authenticate: inProduction(ENV),
        },
        // url: '/prospects',
        url: 'dashboard/prospects',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
            objectType: function() {
                return "prospect";
            }
        }
    })
    .state('dashboard.assets', {
        sp: {
            authenticate: inProduction(ENV),
        },
        // url: '/assets',
        url: 'dashboard/assets',
        templateUrl: 'views/objectsList.html',
        controller: 'ObjectListCtrl',
        resolve: {
            objectType: function() {
                return "asset";
            }
        }
    })
    .state('logs', {
        sp: {
            authenticate: inProduction(ENV),
        },
        abstract: true,
        url: '/logs',
        template: '<ui-view/>',
    })
    .state('logs.cars', {
        sp: {
            authenticate: inProduction(ENV),
        },
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
        sp: {
            authenticate: inProduction(ENV),
        },
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
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/assets',
        templateUrl: 'views/objectsLogs.html',
        controller: 'ObjectsLogsCtrl',
        resolve: {
            objectType: function () {
                return "asset";
            }
        },
    })
    .state('carData', {
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/cars/:id/data',
        templateUrl: 'views/objectData.html',
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
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/cars/:id/logs',
        templateUrl: 'views/objectLogs.html',
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
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/drivers/:id/data',
        templateUrl: 'views/objectData.html',
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
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/drivers/:id/logs',
        templateUrl: 'views/objectLogs.html',
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
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/prospects/:id/data',
        templateUrl: 'views/objectData.html',
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
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/assets/:id/data',
        templateUrl: 'views/objectData.html',
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
        sp: {
            authenticate: inProduction(ENV),
        },
        url: '/assets/:id/logs',
        templateUrl: 'views/objectLogs.html',
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
  .run(function(ENV, editableOptions, $cookies, $window, $user, $stormpath, $state, $stateParams, $rootScope) {
    editableOptions.theme = 'bs3';

    // exposes $state to $rootScope so it can be referenced on any view/scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    if(ENV.name === 'production' || ENV.name === 'staging') {
        $stormpath.uiRouter({
            loginState: 'login',
            defaultPostLoginState: 'dashboard.cars',
            autoRedirect: true,
            forbiddenState: '403'
        });

        $rootScope.$on('$sessionEnd',function (event) {
            $window.location.reload();
            $state.go('login');
        });

        $rootScope.$on('$stateChangeUnauthenticated', function (e, toState, toParams){
          // Your custom logic for deciding how the user should login, and
          // if you want to redirect them to the desired state afterwards
          $state.go('login');
        });

        $rootScope.$on('$stateChangeUnauthorized', function (e,toState,toParams){
          // Your custom logic for deciding how the user should be
          // notified that they are forbidden from this state
        });

        $rootScope.$on('$notLoggedIn',function(){
            $state.go('login');
        });

        $rootScope.$on('$authenticated', function (event) {
        });
    }
  });