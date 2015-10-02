'use strict';

describe('Controller: PersoneditformmodalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var PersoneditformmodalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersoneditformmodalCtrl = $controller('PersoneditformmodalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
