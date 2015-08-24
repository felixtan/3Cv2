'use strict';

describe('Controller: ProspectFormModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectFormModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectFormModalCtrl = $controller('ProspectFormModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
