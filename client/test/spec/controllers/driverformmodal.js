'use strict';

describe('Controller: DriverFormFodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DriverFormFodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DriverFormFodalCtrl = $controller('DriverFormFodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
