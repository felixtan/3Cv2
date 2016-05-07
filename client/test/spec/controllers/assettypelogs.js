'use strict';

describe('Controller: AssetTypeLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetTypeLogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetTypeLogsCtrl = $controller('AssetTypeLogsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AssetTypeLogsCtrl.awesomeThings.length).toBe(3);
  });
});
