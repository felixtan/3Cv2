'use strict';

describe('Controller: AddDriverCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddDriverCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddDriverCtrl = $controller('AddDriverCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
