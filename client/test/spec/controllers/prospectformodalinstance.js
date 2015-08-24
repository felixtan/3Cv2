'use strict';

describe('Controller: ProspectFormModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ProspectFormModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProspectFormModalInstanceCtrl = $controller('ProspectFormModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
