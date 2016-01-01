'use strict';

describe('Controller: ProspectstatusmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectstatusmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectstatusmodalCtrl = $controller('ProspectstatusmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectstatusmodalCtrl.awesomeThings.length).toBe(3);
  });
});
