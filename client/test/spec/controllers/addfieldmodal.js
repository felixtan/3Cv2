'use strict';

describe('Controller: AddfieldmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddfieldmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddfieldmodalCtrl = $controller('AddfieldmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
