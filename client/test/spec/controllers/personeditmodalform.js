'use strict';

describe('Controller: PersoneditmodalformCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PersoneditmodalformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersoneditmodalformCtrl = $controller('PersoneditmodalformCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PersoneditmodalformCtrl.awesomeThings.length).toBe(3);
  });
});
