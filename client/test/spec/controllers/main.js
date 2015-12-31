'use strict';

describe('MainCtrl', function () {
  var controller, rootScope, carHelpers, state, dataService, scope;
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
    ],
    driversAssigned: [],
    identifier: 'licensePlate'
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
    ],
    driversAssigned: [],
    identifier: 'licensePlate'
  };
  var getCars = { data: [car1, car2] };

  // load the controller's module
  beforeEach(module('clientApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $state, _dataService_, _carHelpers_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    dataService = _dataService_;
    carHelpers = _carHelpers_;
    state = $state;

    spyOn(dataService, 'getCars');
    spyOn(carHelpers, 'mapObject');
    spyOn(carHelpers, 'getIdentifier');

    controller = $controller('MainCtrl', { 
      $scope: scope,
      getCars: getCars
    });
  }));

  it('should direct to the correct url', function() {
    expect(state.href('dashboard.cars')).toEqual('#/dashboard/cars');
  });

  it('should load all the cars to scope', function() {
    state.go('dashboard.cars');
    expect(dataService.getCars).toHaveBeenCalled();
    expect(scope.cars).toBeDefined();
  });

  it('should load the car identifier to scope', function() {
    expect(scope.identifier).toBeDefined();
  });

  it('should simplify car objects', function() {
    expect(carHelpers.getIdentifier).toHaveBeenCalled();
  });
});
