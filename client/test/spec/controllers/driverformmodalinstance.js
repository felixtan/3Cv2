'use strict';

describe('Controller: DriverformmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DriverformmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DriverformmodalinstanceCtrl = $controller('DriverformmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DriverformmodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
