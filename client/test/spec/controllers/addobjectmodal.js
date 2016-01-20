'use strict';

describe('Controller: AddObjectModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddObjectModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddObjectModalCtrl = $controller('AddObjectModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AddObjectModalCtrl.awesomeThings.length).toBe(3);
  });
});
