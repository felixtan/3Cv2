'use strict';

describe('Controller: CarformmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CarformmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarformmodalCtrl = $controller('CarformmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CarformmodalCtrl.awesomeThings.length).toBe(3);
  });
});
