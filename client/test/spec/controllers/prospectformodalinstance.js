'use strict';

describe('Controller: ProspectformodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectformodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectformodalinstanceCtrl = $controller('ProspectformodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectformodalinstanceCtrl.awesomeThings.length).toBe(3);
  });
});
