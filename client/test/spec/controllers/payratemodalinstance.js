'use strict';

describe('Controller: PayRateModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PayRateModalInstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PayRateModalInstanceCtrl = $controller('PayRateModalInstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
