'use strict';

describe('Controller: PasswordresetrequestCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PasswordresetrequestCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasswordresetrequestCtrl = $controller('PasswordresetrequestCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PasswordresetrequestCtrl.awesomeThings.length).toBe(3);
  });
});
