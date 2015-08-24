'use strict';

describe('Controller: MaintenanceLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var MaintenanceLogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaintenanceLogsCtrl = $controller('MaintenanceLogsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
