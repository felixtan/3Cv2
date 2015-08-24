'use strict';

describe('Controller: AddCardCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddCardCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddCardCtrl = $controller('AddCardCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
