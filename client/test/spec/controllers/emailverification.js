'use strict';

describe('Controller: EmailverificationCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var EmailverificationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailverificationCtrl = $controller('EmailverificationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EmailverificationCtrl.awesomeThings.length).toBe(3);
  });
});
