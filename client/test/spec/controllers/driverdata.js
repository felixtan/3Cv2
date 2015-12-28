'use strict';

describe('Controller: DriverdataCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DriverdataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DriverdataCtrl = $controller('DriverdataCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DriverdataCtrl.awesomeThings.length).toBe(3);
  });
});
