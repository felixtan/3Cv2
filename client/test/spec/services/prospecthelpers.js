'use strict';

describe('Service: prospectHelpers', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var prospectHelpers;
  beforeEach(inject(function (_prospectHelpers_) {
    prospectHelpers = _prospectHelpers_;
  }));

  it('should do something', function () {
    expect(!!prospectHelpers).toBe(true);
  });

});
