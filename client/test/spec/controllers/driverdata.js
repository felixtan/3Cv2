'use strict';

describe('Controller: DriverDataCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, state, dataService, driverHelpers;

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
  beforeEach(inject(function ($controller, $rootScope, _dataService_, $state, _driverHelpers_) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    state = $state;
    driverHelpers = _driverHelpers_;
    
    spyOn(dataService, 'updateDriver');
    spyOn(dataService, 'getDriver');

    controller = $controller('DriverDataCtrl', {
      $scope: scope,
      getDrivers: getDrivers,
      getDriver: getDriver
    });
  }));

  it("it should direct to the correct url", function() {
    expect(state.href('driverProfile.data', { id: 2 })).toEqual('#/driver/2/data');
  });

  it('should load the correct driver (specified by id) to scope', function() {
    state.go('driverProfile.data', { id: 3 });
    expect(dataService.getDriver).toHaveBeenCalledWith('3');
    expect(scope.driver).toBeDefined();
  });

  it('should activate the correct tab', function() {
    expect(scope.tabs[0].active).toEqual(true);   // Data tab
  });

  it('should get fields to be logged from the driver object', function() {
    scope.getFields(driver1);
    expect(scope.fields).toEqual(['First Name', 'Last Name', 'revenue']);

    expect(scope.getFields(driver2)).toEqual(['First Name', 'Last Name', 'revenue']);
  });

  describe('UPDATE', function() {
    it('should load all the cars', function() {
      // var data = { name: 'profit', value: 1600, log: true };
      // scope.save(data);
      expect(scope.drivers).toEqual(getDrivers.data);
    });

    it('should update the name of a data field for all cars', function() {
      var data = { name: 'profit', value: 1600, log: true };
      scope.save(data);
      expect(scope.driver.data.profit).toEqual({ value: 1600, log: true });
      expect(scope.driver.revenue).not.toBeDefined();
      expect(dataService.updateDriver).toHaveBeenCalledWith(scope.driver);
      expect(dataService.updateDriver.calls.count()).toEqual(scope.drivers.length);

      scope.drivers.forEach(function(driver) {
        if(driver.id !== 1) {
          expect(driver.data.profit).toBeDefined();
          expect(driver.data.profit.log).toEqual(true); 
          expect(driver.data.revenue).not.toBeDefined();
        }
      });
    });

    it('should update the value for the relevant car only', function() {
      var data = { name: 'revenue', value: 1650, log: true };
      scope.save(data);
      expect(scope.driver.data.revenue).toEqual({ value: 1650, log: true });
      expect(dataService.updateDriver).toHaveBeenCalledWith(scope.driver);
      expect(dataService.updateDriver.calls.count()).toEqual(1);
    });

    it('should update the log value for all the cars', function() {
      var data = { name: 'revenue', value: 1600, log: false };
      scope.save(data);
      expect(scope.driver.data.revenue).toEqual({ value: 1600, log: false });
      expect(dataService.updateDriver).toHaveBeenCalledWith(scope.driver);
      expect(dataService.updateDriver.calls.count()).toEqual(scope.drivers.length);

      scope.drivers.forEach(function(driver) {
        if(driver.id !== 1) {
          expect(driver.data.revenue).toBeDefined();
          expect(driver.data.revenue.log).toEqual(false); 
        }
      });
    });

    it('should handle all changes to field name, value, and log simultaneously', function() {
      var data = { name: 'profit', value: 1650, log: false };
      scope.save(data);
      expect(scope.driver.data.profit).toEqual({ value: 1600, log: false });
      expect(scope.driver.revenue).not.toBeDefined();
      expect(dataService.updateDriver).toHaveBeenCalledWith(scope.driver);
      expect(dataService.updateDriver.calls.count()).toEqual(scope.drivers.length);

      scope.drivers.forEach(function(driver) {
        if(driver.id !== 1) {
          expect(driver.data.profit).toBeDefined();
          expect(driver.data.profit.log).toEqual(false); 
          expect(driver.data.revenue).not.toBeDefined();
        }
      });
    });
  });
});
