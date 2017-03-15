'use strict';

describe('Controller: AssetListCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetListCtrl = $controller('AssetListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AssetListCtrl.awesomeThings.length).toBe(3);
  });
});
