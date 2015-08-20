'use strict';

describe('Controller: CarstatuslogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CarstatuslogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarstatuslogsCtrl = $controller('CarstatuslogsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CarstatuslogsCtrl.awesomeThings.length).toBe(3);
  });
});
