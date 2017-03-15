'use strict';

describe('Service: driverHelpers', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var driverHelpers;
  beforeEach(inject(function (_driverHelpers_) {
    driverHelpers = _driverHelpers_;
  }));

  xit('should do something', function () {
    expect(!!driverHelpers).toBe(true);
  });

});
