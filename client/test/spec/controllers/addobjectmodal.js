'use strict';

describe('Controller: AddObjectModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
      dataService,
      $scope,
      $state,
      $uibModalMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_, _$state_) {
    $scope = $rootScope.$new();

    ctrl = $controller('AddObjectModalCtrl', {
      $scope: $scope,
      $state: _$state_,
      dataService: _dataService_,
    });
  }));

  it('should have an open modal function', function () {
    expect($scope.open).not.toBeNull();
  });
});
