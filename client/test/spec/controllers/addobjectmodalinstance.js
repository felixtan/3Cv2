'use strict';

describe('Controller: AddobjectmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddobjectmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddobjectmodalinstanceCtrl = $controller('AddobjectmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddobjectmodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
