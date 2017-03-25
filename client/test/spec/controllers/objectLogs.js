'use strict';

describe('CarLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller,
      scope,
      dataService,
      state,
      rootScope,
      carHelpers;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_carHelpers_, $controller, $rootScope, _dataService_, $state) {
    scope = $rootScope.$new();
    state = $state;
    dataService = _dataService_;
    carHelpers = _carHelpers_;

    controller = $controller('CarLogsCtrl', {
      $scope: scope,
      getCar: getCar
    });

    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'getCar');
    spyOn(carHelpers, 'getLogDates').and.returnValue([1448773200000, 1448168400000]);
    spyOn(scope, 'getMostRecentLogDate').and.callThrough();
    spyOn(scope, 'getFieldsToBeLogged').and.callThrough();
    spyOn(scope, 'updateMostRecentData').and.callThrough();
    spyOn(scope, 'save').and.callThrough();
  }));

  describe("SETUP", function() {
    xit("should direct to the correct url", function() {
      expect(state.href('carProfile.logs', { id: 1 })).toEqual('#/car/1/logs');
    });

    xit('should load the correct car (specified by id) to scope', function() {
      state.go('carProfile.logs', { id: 2 });
      expect(dataService.getCar).toHaveBeenCalledWith('2');
      expect(scope.car).toBeDefined();
    });

    xit('should setup varialbes and call setup methods and upon loading', function() {
      state.go('carProfile.logs', { id: 2 });
      expect(scope.car).toBeDefined();
      expect(scope.dates).toBeDefined();
      expect(scope.mostRecentLogDate).toBeDefined();
      expect(scope.tabs).toBeDefined();
      expect(carHelpers.getLogDates).toHaveBeenCalled();
      expect(scope.getFieldsToBeLogged).toHaveBeenCalled();
    });

    xit("should have the correct tab activated", function() {
      expect(scope.tabs[0].active).toEqual(false);     // Data
      expect(scope.tabs[1].active).toEqual(true);    // Logs
    });

    xit('getLogDates should store log dates in reverse temporal order', function() {
      // according to princples of unit testing, its no the responsibility of this controller
      // to test this method
    });

    xit("should get the most recent log date", function() {
      scope.dates = [1448773200000, 1448168400000];
      expect(scope.getMostRecentLogDate()).toBe(1448773200000);
    });

    xit("should get fields to be logged", function() {
      scope.getFieldsToBeLogged(scope.car).then(function(fields) {
        expect(fields).toBe(['mileage']);
      });
    });
  });

  describe("updateMostRecentData", function() {
    xit("should update the car with most recent log data", function() {
      scope.mostRecentLogDate = 1448773200000;
      scope.car.logs[1].data['mileage'] = 15000;
      scope.updateMostRecentData().then(function(car) {
        expect(car.data['mileage'].value).toBe(15000);
      });
    });

    xit("should not update if most recent log data is null", function() {
      var whatever = scope.car.data['mileage'].value;
      scope.mostRecentLogDate = 1448773200000;
      scope.car.logs[1].data['mileage'] = null;
      scope.updateMostRecentData().then(function(car) {
        expect(car.data['mileage'].value).toBe(whatever);
      });
    });

    xit("should not update if most recent log data is undefined", function() {
      var whatever = scope.car.data['mileage'].value;
      scope.mostRecentLogDate = 1448773200000;
      scope.car.logs[1].data['mileage'] = undefined;
      scope.updateMostRecentData().then(function(car) {
        expect(car.data['mileage'].value).toBe(whatever);
      });
    });
  });

  xit("should save data to the car's logs", function() {
    scope.mostRecentLogDate = 1448773200000;
    scope.save(1448168400000);
    expect(scope.updateMostRecentData).not.toHaveBeenCalled();
    expect(dataService.updateCar).toHaveBeenCalledWith(scope.car);
  });

  xit("should update car's data if most recent log was updated", function() {
    scope.mostRecentLogDate = 1448773200000;
    scope.save(1448773200000);
    expect(scope.updateMostRecentData).toHaveBeenCalled();
    expect(dataService.updateCar).toHaveBeenCalledWith();
  });
});
