'use strict';

describe('CarLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state, rootScope, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_, $state, $window) {
    scope = $rootScope.$new();
    state = $state;
    dataService = _dataService_;
    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'getCar');
    controller = $controller('CarLogsCtrl', {
      $scope: scope,
      getCar: getCar
    });
  }));

  it("it should direct to the correct url", function() {
    expect(state.href('carProfile.logs', { id: 1 })).toEqual('#/car/1/logs');
  });

  it('should load the correct car (specified by id) to scope', function() {
    state.go('carProfile.logs', { id: 2 });
    expect(dataService.getCar).toHaveBeenCalledWith('2');
    expect(scope.car).toBeDefined();
  });

  it('getLogDates should store log dates in recent to past order', function() {
    expect(scope.dates).toBeDefined();
    expect(scope.dates.length).toEqual(scope.car.logs.length);
  });

  xit("should activate the correct tab", function() {
    expect(scope.$parent.tabs[1].active).toEqual(false);
    expect(scope.$parent.tabs[0].active).toEqual(true);
  });

  it('should store the most recent log date', function() {
    expect(scope.mostRecentLogDate).toBeDefined();
    expect(scope.mostRecentLogDate).toEqual(Math.max.apply(null, scope.dates));
  });

  it("should get fields to be logged", function() {
    scope.getFieldsToBeLogged(car1).then(function(fields) {
      expect(fields).toEqual(['mileage']);
    })
  });

  describe('UPDATE', function() {
    it("should save data to the car's logs", function() {
      scope.save(1448168400000);
      expect(dataService.updateCar).toHaveBeenCalledWith(scope.car);
    });
  });
});
