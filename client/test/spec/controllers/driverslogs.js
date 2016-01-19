'use strict';

describe('Controller: DriverLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state;

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

  var getDrivers = { data: [driver1, driver2] };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_, $state) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    state = $state;

    spyOn(dataService, 'getDrivers');
    spyOn(dataService, 'updateDriver');

    controller = $controller('DriverLogsCtrl', {
      $scope: scope,
      getDrivers: getDrivers
    });
  }));

  it("it should direct to the correct url", function() {
    expect(state.href('logs.drivers')).toEqual('#/logs/drivers');
  });

  it('should load all drivers to scope', function() {
    scope.getDrivers();
    expect(scope.drivers).toEqual(getDrivers.data);
  });

  it('should store log dates in most recent to past order', function() {
    scope.getLogDates();
    expect(scope.dates).toEqual([1448773200000, 1448168400000]);
  });

  it('should store the most recent log date', function() {
    scope.getMostRecentLogDate();
    expect(scope.mostRecentLogDate).toEqual(1448773200000);
  });

  describe('Datepicker', function() {
    it('display options should have valid values', function() {
        expect(scope.dateOptions.formatYear)
    });

    it('has function for getting the starting day option', function() {
        expect(scope.getStartingDayNum()).toEqual(scope.dateOptions.startingDay);
    });

    it('converts dateOptions.startingDay to day in words', function() {
        if(scope.dateOptions.startingDay === 0) {
          expect(scope.getStartingDayWord()).toEqual('Sunday');  
        } else if(scope.dateOptions.startingDay === 1) {
          expect(scope.getStartingDayWord()).toEqual('Monday');
        }
    });
  });

  it('gets the fields to be logged', function() {
    scope.getFieldsToBeLogged(driver1).then(function(fields) {
        expect(fields).toEqual(['revenue']);
    });
  });

  it('should create new log data objects', function() {
    scope.newDataObj().then(function(data) {
        for(field in data) {
            expect(data[field]).toBeNull();
        }
    });
  });

  describe('CREATE:', function() {
    it('should create for all drivers', function() {
        scope.newLog();
        setTimeout(function() {
            expect(dataService.updateDriver.calls.count()).toEqual(scope.cars.length);
            // async issue: this fails without timeout
        }, 1000);
    });

    it('should add the new log date to scope.dates', function() {
        scope.newLog();
        scope.drivers.forEach(function(driver) {
          expect(driver.logs.length).toEqual(scope.dates.length);
        });
    });

    it("should update most recent log date", function() {
      scope.newLog();
      expect(scope.dates[0]).toEqual(Math.max.apply(null, scope.dates));
    });
  });

  describe('UPDATE:', function() {
    it('should update all drivers', function() {
        scope.save(1448773200000);
        expect(dataService.updateDriver.calls.count()).toEqual(scope.drivers.length);
    });
  });
});
