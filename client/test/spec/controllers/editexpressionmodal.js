'use strict';

describe('Controller: EditExpressionModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('EditExpressionModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(ctrl.awesomeThings.length).toBe(3);
  });
});
