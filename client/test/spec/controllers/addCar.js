'use strict';

describe('Controller: AddcarCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AddcarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddcarCtrl = $controller('AddcarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
