'use strict';

describe('Controller: AssignCarModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssignCarModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssignCarModalCtrl = $controller('AssignCarModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AssignCarModalCtrl.awesomeThings.length).toBe(3);
  });
});
