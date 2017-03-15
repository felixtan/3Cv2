'use strict';

describe('Controller: AssetLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetLogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetLogsCtrl = $controller('AssetLogsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(AssetLogsCtrl.awesomeThings.length).toBe(3);
  });
});
