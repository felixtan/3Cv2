'use strict';

describe('Service: carHelpers', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var carHelpers;
  beforeEach(inject(function (_carHelpers_) {
    carHelpers = _carHelpers_;
  }));

  xit('should do something', function () {
    expect(!!carHelpers).toBe(true);
  });

});
