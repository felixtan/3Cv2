'use strict';

describe('Controller: ProspectStatusModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectStatusModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectStatusModalCtrl = $controller('ProspectStatusModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectStatusModalCtrl.awesomeThings.length).toBe(3);
  });
});
