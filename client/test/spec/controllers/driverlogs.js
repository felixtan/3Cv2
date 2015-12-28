'use strict';

describe('Controller: DriverlogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DriverlogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DriverlogsCtrl = $controller('DriverlogsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DriverlogsCtrl.awesomeThings.length).toBe(3);
  });
});
