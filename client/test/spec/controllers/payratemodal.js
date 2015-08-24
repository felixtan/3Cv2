'use strict';

describe('Controller: PayRateModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PayRateModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PayRateModalCtrl = $controller('PayRateModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
