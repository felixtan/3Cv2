'use strict';

describe('Controller: DeleteObjModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('DeleteObjModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
