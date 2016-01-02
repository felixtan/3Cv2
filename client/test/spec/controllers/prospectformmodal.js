'use strict';

describe('Controller: ProspectformmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectformmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectformmodalCtrl = $controller('ProspectformmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectformmodalCtrl.awesomeThings.length).toBe(3);
  });
});
