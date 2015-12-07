'use strict';

describe('Controller: AddfieldmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddfieldmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddfieldmodalinstanceCtrl = $controller('AddfieldmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
