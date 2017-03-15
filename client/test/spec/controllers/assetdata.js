'use strict';

describe('Controller: AssetDataCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetDataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetDataCtrl = $controller('AssetDataCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AssetDataCtrl.awesomeThings.length).toBe(3);
  });
});
