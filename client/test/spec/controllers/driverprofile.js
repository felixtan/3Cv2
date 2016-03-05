'use strict';

describe('Controller: DriverProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state, stateParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_, $state, $stateParams) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    state = $state;
    stateParams = $stateParams;

    spyOn(dataService, 'getDriver');

    controller = $controller('DriverProfileCtrl', {
      $scope: scope,
      getDriver: getDriver,
      getDrivers: getDrivers
    });
  }));

  it('should query backend for the correct driver', function () {
    state.go('driverProfile.data', { id: 2 });
    expect(dataService.getDriver).toHaveBeenCalledWith('2');
  });

  it('should the driver to scope', function() {
    expect(scope.getDriver).toBeDefined();
    scope.getDriver();
    expect(scope.driver).toBeDefined();
    expect(scope.driver).toEqual(driver1);
  });
});
