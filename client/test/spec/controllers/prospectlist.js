'use strict';

describe('Controller: ProspectListCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectListCtrl = $controller('ProspectListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  xit('should attach a list of awesomeThings to the scope', function () {
    expect(ProspectListCtrl.awesomeThings.length).toBe(3);
  });
});
