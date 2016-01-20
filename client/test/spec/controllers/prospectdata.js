'use strict';

describe('Controller: ProspectDataCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectDataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectDataCtrl = $controller('ProspectDataCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectDataCtrl.awesomeThings.length).toBe(3);
  });
});
