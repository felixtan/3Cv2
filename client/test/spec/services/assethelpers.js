'use strict';

describe('Service: assetHelpers', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var assetHelpers;
  beforeEach(inject(function (_assetHelpers_) {
    assetHelpers = _assetHelpers_;
  }));

  it('should do something', function () {
    expect(!!assetHelpers).toBe(true);
  });

});
