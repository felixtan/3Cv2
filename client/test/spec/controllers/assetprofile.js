'use strict';

describe('Controller: AssetProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetProfileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetProfileCtrl = $controller('AssetProfileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AssetProfileCtrl.awesomeThings.length).toBe(3);
  });
});