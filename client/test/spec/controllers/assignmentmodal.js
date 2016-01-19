'use strict';

describe('Controller: AssigncarmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssigncarmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssigncarmodalCtrl = $controller('AssigncarmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssigncarmodalCtrl.awesomeThings.length).toBe(3);
  });
});
