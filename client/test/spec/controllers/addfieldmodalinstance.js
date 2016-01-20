'use strict';

describe('Controller: AddFieldModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state, modalInstance;

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
  beforeEach(inject(function ($controller, $rootScope, _dataService_) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    
    AddfieldmodalinstanceCtrl = $controller('AddfieldmodalinstanceCtrl', {
      $scope: scope,
      getDrivers: getDrivers,
      getCars: getCars
    });
  }));
});
