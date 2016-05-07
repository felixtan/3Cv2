'use strict';

describe('Controller: AssetTypeModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetTypeModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetTypeModalCtrl = $controller('AssetTypeModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AssetTypeModalCtrl.awesomeThings.length).toBe(3);
  });
});
