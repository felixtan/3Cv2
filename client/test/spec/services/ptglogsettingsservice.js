'use strict';

describe('Service: ptgLogPeriodService', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var ptgLogPeriodService;
  beforeEach(inject(function (_ptgLogPeriodService_) {
    ptgLogPeriodService = _ptgLogPeriodService_;
  }));

  it('should do something', function () {
    expect(!!ptgLogPeriodService).toBe(true);
  });

});
