'use strict';

describe('Controller: PersoneditformmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PersoneditformmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersoneditformmodalinstanceCtrl = $controller('PersoneditformmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PersoneditformmodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
