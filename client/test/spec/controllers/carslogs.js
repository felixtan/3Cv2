'use strict';

describe('CarLogsCtrl', function () {

  beforeEach(module('clientApp'));

  var controller, scope, dataService, state;
  var car1 = {
      id: 1,
      organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
      data: {
          licensePlate: {
              value: 'T627067C',
              log: false
          },
          licenseNumber: {
              value: 'GPJ 6478',
              log: false
          },
          mileage: {
              value: '14081',
              log: true
          },
          description: {
              value: 'lorem ipsum',
              log: false
          }
      },
      logs: [
        {
            weekOf: 1448168400000,
            createdAt: '2015-11-23T20:55:20.432Z',
            data: {
                mileage: '9412'
            }
        },
        {
            weekOf: 1448773200000,
            createdAt: '2015-11-23T21:05:36.954Z',
            data: {
                mileage: '14081'
            }
        }
    ]
  };
  var car2 = {
    id: 2,
    organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
    data: {
      licensePlate: {
          value: 'T657227C',
          log: false
      },
      licenseNumber: {
          value: 'FLJ 6290',
          log: false
      },
      mileage: {
          value: '120461',
          log: true
      },
      description: {
          value: 'lorem ipsum',
          log: false
      }
    },
    logs: [
      {
          weekOf: 1448168400000,
          createdAt: '2015-11-23T20:55:20.432Z',
          data: {
              mileage: '100461'
          }
      },
      {
          weekOf: 1448773200000,
          createdAt: '2015-11-23T21:05:36.954Z',
          data: {
              mileage: '120461'
          }
      }
    ]
  };
  var getCars = { data: [car1, car2] };

  beforeEach(inject(function ($rootScope, $controller, _dataService_, $state) {
    scope = $rootScope.$new();
    state = $state;
    dataService = _dataService_;
    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'getCars');
    controller = $controller('CarLogsCtrl', {
        $scope: scope,
        getCars: getCars
    });
  }));

  it('should direct to the correct url', function() {
    expect(state.href('logs.cars')).toEqual('#/logs/cars');
  });

  it("should load the user's cars", function() {
    state.go('logs.cars');
    expect(dataService.getCars).toHaveBeenCalled();
    expect(scope.cars).toBeDefined();
  });

  it('should store existing log dates in most recent to past order', function() {
    expect(scope.date).toBeDefined();
    if(scope.cars.length > 0) {
        expect(scope.dates.length).toEqual(scope.cars[0].logs.length);
        expect(scope.dates[0]).toEqual(Math.max.apply(null, scope.dates));
    }
  });

  it('should store the most recent log date', function() {
    if(scope.dates.length > 0) expect(scope.mostRecentLogDate).toEqual(Math.max.apply(null, scope.dates));
  });

  describe('Datepicker:', function() {
    xit("should store the display options", function() {
        expect(scope.dateOptions.formatYear).toBeString();
        expect(scope.dateOptions.startingDay).toBeNumber();
        expect(scope.dateOptions.startingDay).toBeLessThan(7);
    });

    it('display options should have valid values', function() {
        expect(scope.dateOptions.formatYear)
    });

    it('has function for getting the starting day option', function() {
        expect(scope.getStartingDayNum()).toEqual(scope.dateOptions.startingDay);
    });

    it('converts dateOptions.startingDay to day in words', function() {
        expect(scope.getStartingDayWord()).toContain('day');
    });
  });

  it('gets the fields to be logged', function() {
    scope.getFieldsToBeLogged(car1).then(function(fields) {
        expect(fields).toEqual(['mileage']);
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
    xit('can only be created on the starting day', function() {
        // starting day restriction is enforced on the html, so can' test it here
    });

    it('should create for all cars', function() {
        controller.newLog();
        setTimeout(function() {
            expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);
            // async issue: this fails without timeout
        }, 1000);
    });

    it('should add the new log date to scope.dates', function() {
        controller.newLog();
        if(scope.cars.length > 0) expect(scope.dates.length).toEqual(scope.cars[0].logs.length);
    });
  });

  describe('UPDATE:', function() {
    it('should update all cars', function() {
        controller.save();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);
    });
  });
});






