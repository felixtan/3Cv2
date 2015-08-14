'use strict';

describe('Controller: NewprospectformmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var NewprospectformmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewprospectformmodalCtrl = $controller('NewprospectformmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NewprospectformmodalCtrl.awesomeThings.length).toBe(3);
  });
});
