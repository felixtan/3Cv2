'use strict';

describe('Controller: PayratemodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PayratemodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PayratemodalinstanceCtrl = $controller('PayratemodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PayratemodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
