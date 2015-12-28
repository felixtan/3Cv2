'use strict';

describe('Controller: DriversuiCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DriversuiCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DriversuiCtrl = $controller('DriversuiCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DriversuiCtrl.awesomeThings.length).toBe(3);
  });
});
