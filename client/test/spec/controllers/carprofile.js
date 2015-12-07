'use strict';

describe('Controller: CarprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CarprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarprofileCtrl = $controller('CarprofileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
