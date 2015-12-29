'use strict';

describe('Controller: DeleteobjmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DeleteobjmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeleteobjmodalinstanceCtrl = $controller('DeleteobjmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DeleteobjmodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
