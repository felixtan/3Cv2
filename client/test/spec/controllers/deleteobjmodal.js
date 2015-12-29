'use strict';

describe('Controller: DeleteobjmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DeleteobjmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeleteobjmodalCtrl = $controller('DeleteobjmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DeleteobjmodalCtrl.awesomeThings.length).toBe(3);
  });
});
