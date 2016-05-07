'use strict';

describe('CarsLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, 
      scope, 
      dataService, 
      state, 
      rootScope, 
      datepicker,
      carHelpers;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_carHelpers_, _datepicker_, $controller, $rootScope, _dataService_, $state) {
    scope = $rootScope.$new();
    state = $state;
    dataService = _dataService_;
    datepicker = _datepicker_;
    carHelpers = _carHelpers_;
    
    controller = $controller('CarsLogsCtrl', {
      $scope: scope,
      getCars: getCars
    });

    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'getCar');
    spyOn(carHelpers, 'mapObject');
    spyOn(scope, 'getLogDates').and.callThrough();
    spyOn(scope, 'getMostRecentLogDate').and.callThrough();
    spyOn(scope, 'getFieldsToBeLogged').and.callThrough();
    spyOn(scope, 'newDataObj').and.callThrough();
    spyOn(scope, 'createLogForCar').and.callThrough();
    spyOn(scope, 'newLog').and.callThrough();
    spyOn(scope, 'save').and.callThrough();
    spyOn(scope, 'createNewRow').and.callThrough();
  }));

  it("it should direct to the correct url", function() {
    expect(state.href('logs.cars')).toEqual('#/logs/cars');
  });

  it("should call certain functions upon entering the state", function() {
    state.go('logs.cars');

    expect(carHelpers.mapObject).toHaveBeenCalled();
    expect(scope.getLogDates).toHaveBeenCalled();
    expect(scope.getMostRecentLogDate).toHaveBeenCalled();
  });



  it("should integrate angular ui bootstrap datepicker", function() {
    expect(scope.datepicker).toBeDefined();
    expect(scope.datepicker.dt).toBeDefined();
    expect(scope.datepicker.minDate).toBeDefined();
    expect(scope.datepicker.today).toBeDefined();
    expect(scope.datepicker.getStartingDay).toBeDefined();
  });

  it("should load all the cars", function() {
    expect(scope.cars).toBeDefined();
  });

  it("should load the identifier if there are cars", function() {
    expect(scope.identifier).toBeDefined();
    if(scope.cars.length) expect(scope.identifier).toEqual(scope.cars[0].identifier);
  });

  it("should store a simplified version of cars", function() {
    expect(scope.simpleCars).toBeDefined();
    
    expect(scope.simpleCars.length).toEqual(scope.cars.length);
    if(scope.cars.length) {
      var identifier = scope.cars[0].identifier;
      expect(scope.simpleCars[0].id).toEqual(scope.cars[0].id);
      expect(scope.simpleCars[0].identifierValue).toEqual(scope.cars[0].data[identifier].value);
    }
  });

  it("stores existing log dates in reverse temporal order", function() {
    expect(scope.dates).toBeDefined();
    scope.getLogDates().then(function(dates) {
      expect(dates).toBe([1448773200000, 1448168400000]);
      expect(scope.dates).toBe(dates);
    });
  });

  it("should get the fields to be logged", function() {
    scope.getFieldsToBeLogged(scope.cars[0]).then(function(fields) {
      expect(fields).toEqual(['mileage']);
    });
  });

  it("should store the most recent log date", function() {
    scope.dates = [1448773200000, 1448168400000];
    scope.getMostRecentLogDate();
    expect(scope.mostRecentLogDate).toBe(1448773200000);
  });

  it("mostRecentLogDate should be null if there are no logs", function() {
    scope.dates = [];
    scope.getMostRecentLogDate();
    expect(scope.mostRecentLogDate).toBeNull();
  });

  it("should create a data object for new logs", function() {
    scope.newDataObj().then(function(data) {
      expect(data['mileage']).toBeNull();
    });
  });

  it("should create an empty data object if there are no fields to log", function() {
    scope.cars[0].data['mileage'].log = false;
    scope.newDataObj().then(function(data) {
      expect(data['mileage']).not.toBeDefined();
      expect(data).toBe({});
    });
  });

  it("should add a new log to a car", function() {
    var weekOf = (new Date()).getTime();
    var data = { 'mileage': null };
    scope.createLogForCar(scope.cars[0], weekOf, data).then(function(car) {
      expect(car.logs.length).toBe(3);
      expect(car.logs[2].weekOf).toEqual();
      expect(car.logs[2].data).toBe(data);
      expect(car.logs[2].weekOf).toBeDefined();
    });
  });

  it("should create new log for cars", function() {
    scope.newLog();

    expect(scope.newDataObj).toHaveBeenCalled();
    // scope.$digest();
    expect(scope.createLogForCar).toHaveBeenCalled();
    // scope.$digest();
    expect(dataService.updateCar).toHaveBeenCalled();
    // scope.$digest();
    expect(scope.createNewRow).toHaveBeenCalled();
  });

  it("should save new logs for all cars", function() {
    scope.save((new Date()).getTime());
    expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);
  });

  it("should create a new row of logs", function() {
    var old = scope.dates.length;
    scope.createNewRow((new Date()).getTime());
    expect(scope.dates.length).toEqual(old+1);
  });
});
