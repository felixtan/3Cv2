'use strict';

describe('Service: assignmentService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var assignmentService;
  beforeEach(inject(function (_assignmentService_) {
    assignmentService = _assignmentService_;
  }));

  it('should do something', function () {
    expect(!!assignmentService).toBe(true);
  });

});
