'use strict';

describe('dataService', function () {

  beforeEach(module('clientApp'));

  var dataService, httpBackend, q, ENV;
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

  beforeEach(inject(function ($httpBackend, _dataService_, $q, _ENV_) {
    httpBackend = $httpBackend;
    dataService = _dataService_;
    q = $q;
    ENV = _ENV_;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  xit('send a POST request when create car', function() {
    httpBackend.whenPOST('/api/cars')
      .respond(200, 'Car created');
  });

  //   httpBackend
  //     .expectGET('/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x')
  //     .respond(200);
  //   dataService.getCars(); //.then(handler.success, handler.error);
  //   httpBackend.flush();

  //   expect(handler.success).toHaveBeenCalled();
  //   expect(myThings).toEqual(response);
  //   expect(handler.error).not.toHaveBeenCalled();
  //   expect(errorStatus).toEqual('');
  // });
});
