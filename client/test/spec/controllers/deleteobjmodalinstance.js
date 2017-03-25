describe('Controller: DeleteObjModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('ui.router'));

  var ctrl,
      $scope,
      $state,
      $uibModalInstanceMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$state_) {
    $scope = $rootScope.$new();
    $state = _$state_;
    $uibModalInstanceMock = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);

    // spyOn($state, 'forceReload');

    controller = $controller('DeleteObjModalInstanceCtrl', {
      $scope: $scope,
      $state: { current: { name: 'dashboard.drivers', forceReload: function(){} }},
      $uibModalInstance: $uibModalInstanceMock,
      id: 0
    });
  }));

  it('should set state variables depending on object type', function() {
    expect($scope.objectType).toBe('driver');
    expect($scope.delete).not.toBeNull();
    expect($scope.postDeleteState).toBe('dashboard.drivers');
  });

  it('should be able to submit the form', function() {
    expect($scope.submit).not.toBeNull();
    expect(typeof $scope.submit).toBe('function');

    expect($scope.ok).not.toBeNull();
    expect(typeof $scope.ok).toBe('function');
  });

  it("should be able to close the form", function() {
    expect($scope.close).not.toBeNull();
    expect(typeof $scope.close).toBe('function');
  });
});
