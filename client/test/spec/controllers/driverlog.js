'use strict';

describe('Controller: DriverlogCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DriverlogCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DriverlogCtrl = $controller('DriverlogCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DriverlogCtrl.awesomeThings.length).toBe(3);
  });
});
