'use strict';

describe('Controller: CardformmodalinstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CardformmodalinstanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CardformmodalinstanceCtrl = $controller('CardformmodalinstanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
