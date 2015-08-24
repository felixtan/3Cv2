'use strict';

describe('Controller: CarFormModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CarFormModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarFormModalInstanceCtrl = $controller('CarFormModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
