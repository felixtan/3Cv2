'use strict';

describe('Controller: AssetTypeModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
      $scope,
      $state,
      assetHelpers;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _assetHelpers_) {
    $scope = $rootScope.$new();
    assetHelpers = _assetHelpers_;

    ctrl = $controller('AssetTypeModalCtrl', {
      $scope: $scope,
      $uibModalInstance: jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']),
      assetHelpers: assetHelpers,
      assetTypes: {
        types: {
          0: { value: 'foo' },
          1: { value: 'bar'},
          length: 2
        }
      }
    });
  }));

  it("should load the data", function() {
    expect(ctrl.assetTypes.types.length).toBe(2);
    expect($scope.newType.value).toBeNull()
  });

  it('should determine if the form is valid', function () {
    $scope.newType.value = null;
    expect($scope.validForm()).toBe(false);

    $scope.newType.value = undefined;
    expect($scope.validForm()).toBe(false);

    $scope.newType.value = 'baz'
    expect($scope.validForm()).toBe(true);
  });

  it('should be able to close the form', function () {
    expect($scope.close).not.toBeNull();
    expect(typeof $scope.close).toBe('function');
  });

  it('should be able to reset the form', function () {
    expect($scope.reset).not.toBeNull();
    expect(typeof $scope.reset).toBe('function');

    $scope.newType.value = 'baz';
    $scope.reset();
    expect($scope.newType.value).toBeNull();
  });

  it('should be able to submit the form', function() {
    expect($scope.submit).not.toBeNull();
    expect(typeof $scope.submit).toBe('function');
  });
});
