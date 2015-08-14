'use strict';

describe('Controller: PayratemodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PayratemodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PayratemodalCtrl = $controller('PayratemodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PayratemodalCtrl.awesomeThings.length).toBe(3);
  });
});
