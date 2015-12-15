'use strict';

describe('CarDataCtrl', function () {

  beforeEach(module('clientApp'));
  
  var controller, scope, dataService, state, rootScope, httpBackend;
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
  var getCar = { data: car1 };
  var getCars = { data: [car1, car2] };
      
  beforeEach(inject(function ($rootScope, $controller, _dataService_, $state, $httpBackend) {
      rootScope = $rootScope;
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      state = $state;
      dataService = _dataService_;
      spyOn(dataService, 'updateCar');
      spyOn(dataService, 'getCar');
      controller = $controller('CarDataCtrl', {
        $scope: scope,
        getCar:getCar,
        getCars: getCars
      });
  }));

  it('should direct to the correct url', function() {
    expect(state.href('carProfile.data', { id: 1 })).toEqual('#/car/1/data');
    // state.transitionTo('carProfile.data');
  });

  xit('should render the correct html file', function() {
    // state shows parent carProfile for some reason
    state.go('carProfile.data', { id: 1 });
    expect(dataService.getCar).toHaveBeenCalledWith('1');
    // expect(state.current.templateUrl).toEqual('/views/cardataui.html');
  });

  it('should load the correct car (specified by id) to scope', function() {
    state.go('carProfile.data', { id: 2 });
    expect(dataService.getCar).toHaveBeenCalledWith('2');
    // can't currently test that scope.car is correct here because scope.car is hard-coded
  });
  
  it('should store the fields/keys describing the car to scope', function() {
    expect(scope.fields).toBeDefined();
  });

  it("should activate the correct tab", function() {
    expect(scope.tabs[1].active).toEqual(true);
    expect(scope.tabs[0].active).toEqual(false);
  });

  describe('UPDATE:', function() {
    it('should store the field/key name to scope before updates/changes are made', function() {
      expect(scope.oldField).toBeDefined();
    });

    it("if a value is changed, only the current car's data should be updated", function() {
      var data = { name: 'mileage', value: 20000, log: true };
      scope.save(data); // causes TypeError: 'undefined' is not an object (evaluating 'car.data[$scope.oldField].value')
      scope.oldField = 'mileage';

      expect(scope.car.data['mileage'].value).toBe(20001);
      expect(scope.car.data['mileage'].log).toEqual(true);
      expect(dataService.updateCar).toHaveBeenCalledWith(scope.car);
      expect(dataService.updateCar.calls.count()).toEqual(1);
    });
    
    it('if a field is renamed, all cars should be updated', function() {
      var data = { name: 'notes', value: 'lorem ipsum', log: false };
      scope.save(data); // TypeError: 'undefined' is not an object (evaluating 'car.data[$scope.oldField].value')
      scope.oldField = 'description';
      expect(scope.oldField).toBeDefined();

      var fields = Object.keys(scope.car.data);
      expect(fields).toContain('notes');
      expect(dataService.updateCar).toHaveBeenCalledWith(scope.car);

      expect(scope.cars).toBeDefined();
      scope.cars.forEach(function(car) {
        expect(car).toBeDefined();
        expect(car.data['notes']).toBeDefined();
        expect(car.data['notes'].log).toEqual(false);
        if(car.id !== scope.car.id) expect(dataService.updateCar).toHaveBeenCalledWith(car);        
      });
      expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);
    });

    it('if log value for an existing field has changed, all cars should be updated', function() {
      var data = { name: 'description', value: 'lorem ipsum', log: true };
      scope.save(data); // TypeError: 'undefined' is not an object (evaluating 'car.data[$scope.oldField].value')
      scope.oldField = 'description';
      expect(scope.oldField).toBeDefined();

      expect(scope.cars).toBeDefined();
      scope.cars.forEach(function(car) {
        expect(car).toBeDefined();
        expect(car.data['description']).toBeDefined();
        expect(car.data['description'].log).toEqual(true);
        if(car.id !== scope.car.id) expect(dataService.updateCar).toHaveBeenCalledWith(car);        
      });
      expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);
    });
  });
});
