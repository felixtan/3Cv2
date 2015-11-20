'use strict';

describe('Service: dataService', function () {
  // instantiate service
  var dataService, $httpBackend, $q;

  // load the service's module
  beforeEach(function() {
    module('clientApp');
    module('ngMock');

    inject(function (_dataService_, _$httpBackend_, _$q_) {
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      dataService = _dataService_;
    });
  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('GET /api/cars when .getUsers()', function($httpBackend) {
    $httpBackend
      .expectGET('http://localhost:' + '9001' + '/api/cars')
      .respond(200);
    dataService.getCars();
    $httpBackend.flush();
  });
});
