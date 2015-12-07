'use strict';

describe('Controller: MainCtrl', function () {
  var $controller, $rootScope, $httpBackend;

  // load the controller's module
  beforeEach(module('clientApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_) {
    // scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $controller = _$controller_('MainCtrl', { '$scope': $rootScope });
  }));

});
