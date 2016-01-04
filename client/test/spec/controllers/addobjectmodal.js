'use strict';

describe('Controller: AddobjectmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddobjectmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddobjectmodalCtrl = $controller('AddobjectmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddobjectmodalCtrl.awesomeThings.length).toBe(3);
  });
});
