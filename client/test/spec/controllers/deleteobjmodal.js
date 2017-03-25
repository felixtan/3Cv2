describe('Controller: DeleteObjModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
      $scope,
      $uibModal;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    $scope = $rootScope.$new();
    
    ctrl = $controller('DeleteObjModalCtrl', {
      $scope: $scope
    });
  }));

  it('should open the modal', function() {
    expect($scope.open).not.toBeNull();
    expect(typeof $scope.open).toBe('function');
  });
});
