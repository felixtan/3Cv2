'use strict';

describe('Controller: SettingsModelsCarJsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var SettingsModelsCarJsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettingsModelsCarJsCtrl = $controller('SettingsModelsCarJsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SettingsModelsCarJsCtrl.awesomeThings.length).toBe(3);
  });
});
