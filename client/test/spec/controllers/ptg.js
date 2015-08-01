'use strict';

describe('Controller: PtgCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PtgCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PtgCtrl = $controller('PtgCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PtgCtrl.awesomeThings.length).toBe(3);
  });
});
