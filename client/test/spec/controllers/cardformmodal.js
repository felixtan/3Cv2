'use strict';

describe('Controller: CardformmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CardformmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CardformmodalCtrl = $controller('CardformmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
