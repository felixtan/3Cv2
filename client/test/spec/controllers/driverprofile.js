'use strict';

describe('Controller: DriverProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state, stateParams;

  var driver1 = {
    id: 1,
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0y',
    data: {
      "First Name": {
        value: "John",
        log: false
      },
      "Last Name": {
        value: "Doe",
        log: false
      },
      revenue: {
        value: 1600,
        log: true
      }
    },
    logs: [
      {
        weekOf: 1448168400000,
        data: {
          revenue: 1540
        },
        driverId: 1
      },
      {
        weekOf: 1448773200000,
        data: {
          revenue: 1600
        },
        driverId: 1
      }
    ]
  },
  driver2 = {
    id: 2,
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0y',
    data: {
      "First Name": {
        value: "Jane",
        log: false
      },
      "Last Name": {
        value: "Wayne",
        log: false
      },
      revenue: {
        value: 1600,
        log: true
      }
    },
    logs: [
      {
        weekOf: 1448168400000,
        data: {
          revenue: 1557
        },
        driverId: 2
      },
      {
        weekOf: 1448773200000,
        data: {
          revenue: 1600
        },
        driverId: 2
      }
    ]
  };

  var getDriver = { data: driver1 };
  var getDrivers = { data: [driver1, driver2] };

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
