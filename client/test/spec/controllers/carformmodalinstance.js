'use strict';

describe('Controller: CarformmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CarformmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarformmodalinstanceCtrl = $controller('CarformmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CarformmodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
