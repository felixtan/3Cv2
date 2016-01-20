'use strict';

describe('Controller: AddObjectModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddObjectModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddObjectModalInstanceCtrl = $controller('AddObjectModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AddObjectModalInstanceCtrl.awesomeThings.length).toBe(3);
  });
});
