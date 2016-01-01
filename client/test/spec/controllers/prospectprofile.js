'use strict';

describe('Controller: ProspectprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectprofileCtrl = $controller('ProspectprofileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectprofileCtrl.awesomeThings.length).toBe(3);
  });
});
