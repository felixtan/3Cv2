'use strict';

describe('Controller: DriverLogCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state;
  
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_, $state) {
    scope = $rootScope.$new();
    state = $state;
    dataService = _dataService_;

    spyOn(dataService, 'getDriver');
    spyOn(dataService, 'updateDriver');

    controller = $controller('DriverLogCtrl', {
      $scope: scope,
      getDriver: getDriver
    });
  }));

  it("it should direct to the correct url", function() {
    expect(state.href('driverProfile.logs', { id: 2 })).toEqual('#/driver/2/logs');
  });

  it('should load the correct driver (specified by id) to scope', function() {
    state.go('driverProfile.logs', { id: 3 });
    expect(dataService.getDriver).toHaveBeenCalledWith('3');
    expect(scope.driver).toBeDefined();
  });

  it('should activate the correct tab', function() {
    expect(scope.tabs[1].active).toEqual(true);   // Logs tab
  });

  it('should get fields to be logged from the driver object', function() {
    scope.getFieldsToBeLogged();
    expect(scope.fieldsToBeLogged).toEqual(['revenue']);
  });

  it('should store log dates in most recent to past order', function() {
    scope.getLogDates();
    expect(scope.dates).toEqual([1448773200000, 1448168400000]);
  });

  it('should store the most recent log date', function() {
    scope.getMostRecentLogDate();
    expect(scope.mostRecentLogDate).toEqual(1448773200000);
  });

  describe('UPDATE', function() {
    it('should save a log', function() {
      scope.save(1448168400000);
      expect(dataService.updateDriver).toHaveBeenCalled();
    });

    it("should update driver's data if the most recent log was updated", function() {
      scope.driver.logs[1].data.revenue = 1800;
      scope.save(1448773200000);
      expect(dataService.updateDriver).toHaveBeenCalled();
      expect(scope.driver.data.revenue.value).toEqual(1800);
    });
  });
});
