'use strict';

describe('Controller: AssetlogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssetlogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssetlogsCtrl = $controller('AssetlogsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssetlogsCtrl.awesomeThings.length).toBe(3);
  });
});
