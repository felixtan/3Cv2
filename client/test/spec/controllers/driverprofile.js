'use strict';

describe('Controller: DriverprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DriverprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DriverprofileCtrl = $controller('DriverprofileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DriverprofileCtrl.awesomeThings.length).toBe(3);
  });
});
