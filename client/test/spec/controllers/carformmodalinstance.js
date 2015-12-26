'use strict';

describe('CarFormModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, instanceScope, scope, dataService, state, modal, modalInstance, ENV, carHelpers;
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
  beforeEach(inject(function ($controller, $rootScope, _ENV_, _dataService_, $state, _carHelpers_) {
    scope = $rootScope.$new();
    instanceScope = $rootScope.$new();
    state = $state;
    carHelpers = _carHelpers_;
    dataService = _dataService_;

    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'createCar');

    modalInstance = $controller('CarFormModalInstanceCtrl', {
      $scope: instanceScope,
      $modalInstance: this,
      getCars: getCars
    });
  }));

  it('should be directed to the correct url', function() {
    state.go('main.carForm');
    expect(state.href('main.carForm')).toEqual('#/dashboard/car-form');
  });

  it('should load all the cars to scope', function() {
    expect(instanceScope.cars).toBeDefined();
  });

  it('stores fields created during the modal session', function() {
    expect(instanceScope.newFieldsThisSession).toBeDefined();
  });

  it('should store car data fields', function() {
    expect(instanceScope.fields).toBeDefined();
    // TODO: refactor getFields to take arguments and test with mock data
  });

  it('initialized the car form', function() {
    expect(instanceScope.formData).toBeDefined();
  });

  it('when created, a field should be added to all existing cars', function() {
    instanceScope.newField = { name: 'color', value: 'red', log: false };
    instanceScope.addField();
    expect(instanceScope.newField).toBeDefined();
    expect(instanceScope.formData['color']).toBeDefined();
    expect(instanceScope.formData['color'].value).toBeNull();
    expect(instanceScope.formData['color'].log).toBeFalsy();
    expect(dataService.updateCar.calls.count()).toEqual(instanceScope.cars.length);
    expect(instanceScope.newFieldsThisSession).toContain('color');
  });

  it('should create a blank new car', function() {
    var data = {
      licensePlate: {
          value: 'T231231C',
          log: false
      },
      licenseNumber: {
          value: 'FMJ lolwut',
          log: false
      },
      mileage: {
          value: '18304',
          log: true
      },
      description: {
          value: 'lorem ipsum',
          log: false
      }
    };

    instanceScope.newCar(data).then(function(car) {
      expect(car.data).toEqual(data);
      expect(car.logs.length).toBeDefined();
      expect(car.logs.length).toEqual(0);

      if(ENV.name === ('production' || 'staging')) {
        expect(car.organizationId).toBeString();
        expect(car.organizationId).toBeGreaterThan(20);
      } else {
        expect(car.organizationId).toEqual('3Qnv2pMAxLZqVdp7n8RZ0x');
      }
    });
  });

  describe('CREATE', function() {
    it('should save a new car to db', function() {
      instanceScope.formData = {
        licensePlate: {
          value: 'T231231C',
          log: false
        },
        licenseNumber: {
            value: 'FMJ lolwut',
            log: false
        },
        mileage: {
            value: '18304',
            log: true
        },
        description: {
            value: 'lorem ipsum',
            log: false
        }
      };

      instanceScope.submit();
      setTimeout(function() {
        expect(dataService.createCar).toHaveBeenCalled();
        // async
      }, 1000);
    });

    it('should update all other cars if log value of new fields were changed', function() {
      instanceScope.newField = { name: 'color', value: 'red', log: false };
      instanceScope.addField();

      instanceScope.formData = {
        licensePlate: {
          value: 'T231231C',
          log: false
        },
        licenseNumber: {
            value: 'FMJ lolwut',
            log: false
        },
        mileage: {
            value: '18304',
            log: true
        },
        description: {
            value: 'lorem ipsum',
            log: false
        },
        color: {
          value: 'red',
          log: true
        }
      };
    
      instanceScope.submit();
      setTimeout(function() {
        expect(dataService.updateCar.calls.count()).toEqual(instanceScope.cars.length);
      }, 1000);
    }); 
  });
});
