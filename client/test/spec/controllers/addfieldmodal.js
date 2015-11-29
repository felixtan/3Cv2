'use strict';

describe('Controller: AddfieldmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddfieldmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddfieldmodalCtrl = $controller('AddfieldmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddfieldmodalCtrl.awesomeThings.length).toBe(3);
  });
});
