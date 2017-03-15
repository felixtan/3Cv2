'use strict';

describe('Service: objectHelpers', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var objectHelpers;
  beforeEach(inject(function (_objectHelpers_) {
    objectHelpers = _objectHelpers_;
  }));

  xit('should do something', function () {
    expect(!!objectHelpers).toBe(true);
  });

});
