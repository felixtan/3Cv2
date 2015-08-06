'use strict';

describe('Controller: AddgascardJsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddgascardJsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddgascardJsCtrl = $controller('AddgascardJsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AddgascardJsCtrl.awesomeThings.length).toBe(3);
  });
});
