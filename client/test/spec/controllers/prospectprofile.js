'use strict';

describe('Controller: ProspectProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectProfileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectProfileCtrl = $controller('ProspectProfileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectProfileCtrl.awesomeThings.length).toBe(3);
  });
});
