'use strict';

describe('Controller: AssettypemodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssettypemodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssettypemodalCtrl = $controller('AssettypemodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssettypemodalCtrl.awesomeThings.length).toBe(3);
  });
});
