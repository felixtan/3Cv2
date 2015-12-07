'use strict';

describe('Controller: DeletefieldmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var DeletefieldmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeletefieldmodalinstanceCtrl = $controller('DeletefieldmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
