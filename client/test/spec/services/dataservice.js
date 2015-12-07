'use strict';

describe('Service: dataService', function () {

  beforeEach(module('clientApp'));

  var dataService, 
      httpBackend;

  beforeEach(inject(function($httpBackend, _dataService_) {
    httpBackend = $httpBackend;
    dataService = _dataService_;
  }));

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  // it('should call the api', function() {
  //   var response = [
  //     {
  //       organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x',
  //       data: {
  //           licensePlate: {
  //               value: 'T627067C',
  //               log: false
  //           },
  //           licenseNumber: {
  //               value: 'GPJ 6478',
  //               log: false
  //           },
  //           mileage: {
  //               value: '14081',
  //               log: true
  //           },
  //           description: {
  //               value: 'lorem ipsum',
  //               log: false
  //           }
  //       },
  //       logs: [
  //           {
  //               weekOf: 1448168400000,
  //               createdAt: '2015-11-23T20:55:20.432Z',
  //               data: {
  //                   mileage: '9412'
  //               }
  //           },
  //           {
  //               weekOf: 1448773200000,
  //               createdAt: '2015-11-23T21:05:36.954Z',
  //               data: {
  //                   mileage: '14081'
  //               }
  //           }
  //       ]
  //     }
  //   ];

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
