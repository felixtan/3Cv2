'use strict';

describe('Controller: CarlogCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CarlogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarlogCtrl = $controller('CarlogCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CarlogCtrl.awesomeThings.length).toBe(3);
  });
});
