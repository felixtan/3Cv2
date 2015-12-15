'use strict';

describe('DeleteFieldModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state, thing, modalInstance;
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

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    
    jasmine.createSpy(dataService.updateCar);
    modalInstance = {
      ok: function() {},
      close: function() {},
      submit: function(input, thing) {
        if(input === 'DELETE') {
          switch(thing.type) {
            case 'field':
              getCars.data.forEach(function(car) {
                delete car.data[thing.value];
                dataService.updateCar(car);
              });
              break;
            case 'log':
              getCars.data.forEach(function(car) {
                car.logs.forEach(function(log) {
                  if(log.weekOf === thing.value) {
                    car.logs.splice(car.logs.indexOf(log), 1);
                    dataService.updateCar(car);
                  }
                });
              });
              break;
            default:
              return;
          }
        }
      }
    };
    
    spyOn(dataService, 'getCars');
    spyOn(dataService, 'updateCar');

    controller = $controller('DeleteFieldModalCtrl', {
      $scope: scope,
      getCars: getCars,
      $modalInstance: modalInstance,
      thing: {}
    });
  }));

  it('should correctly instantiate the modal', function() {
    scope.open();
    expect(modalInstance.ok).toBeDefined();
    expect(modalInstance.close).toBeDefined();
    expect(modalInstance.submit).toBeDefined();
  });

  xit('should load all the cars to scope', function() {
    expect(scope.cars).toBeDefined();
    // getCars loaded to modalInstance not modal
  });

  it('submit should only be called if user input = "DELETE"', function() {
    scope.input = 'DELEET';
    thing = { type: 'log', value: 1448773200000 };
    modalInstance.submit(scope.input, thing);
    expect(dataService.updateCar).not.toHaveBeenCalled();
  });

  it('should delete the log from all cars', function() {
    scope.input = 'DELETE';
    thing = { type: 'log', value: 1448773200000 };
    modalInstance.submit(scope.input, thing);

    expect(car1.logs.length).toEqual(1);
    expect(car2.logs.length).toEqual(1);

    expect(car1.logs[0].weekOf).toEqual(1448168400000);
    expect(car2.logs[0].weekOf).toEqual(1448168400000);

    expect(dataService.updateCar.calls.count()).toEqual(getCars.data.length);
  });

  it('should delete the same field from all cars', function() {
    scope.input = 'DELETE';
    thing = { type: 'field', value: 'description' };
    modalInstance.submit(scope.input, thing);

    var fields1 = Object.keys(car1.data);
    var fields2 = Object.keys(car2.data);
    
    expect(fields1.indexOf(thing.value)).toEqual(-1);
    expect(fields2.indexOf(thing.value)).toEqual(-1);

    expect(dataService.updateCar.calls.count()).toEqual(getCars.data.length);
  });
});
