'use strict';

describe('Controller: CarFormModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CarFormModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarFormModalCtrl = $controller('CarFormModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
