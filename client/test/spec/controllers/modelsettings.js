'use strict';

describe('Controller: ModelsettingsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ModelsettingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModelsettingsCtrl = $controller('ModelsettingsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ModelsettingsCtrl.awesomeThings.length).toBe(3);
  });
});
