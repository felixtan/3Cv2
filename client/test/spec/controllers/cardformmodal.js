'use strict';

describe('CardFormModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    controller = $controller('CardFormModalCtrl', {
      $scope: scope
    });
  }));
});
