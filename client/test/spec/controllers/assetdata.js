'use strict';

describe('Controller: AssetdataCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetdataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetdataCtrl = $controller('AssetdataCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssetdataCtrl.awesomeThings.length).toBe(3);
  });
});
