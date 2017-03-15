'use strict';

describe('Service: datePicker', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var datePicker;
  beforeEach(inject(function (_datePicker_) {
    datePicker = _datePicker_;
  }));

  xit('should do something', function () {
    expect(true).toBe(true);
  });

});
