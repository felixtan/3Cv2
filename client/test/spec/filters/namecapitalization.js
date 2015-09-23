'use strict';

describe('Filter: nameCapitalization', function () {

  // load the filter's module
  beforeEach(module('clientApp'));

  // initialize a new instance of the filter before each test
  var nameCapitalization;
  beforeEach(inject(function ($filter) {
    nameCapitalization = $filter('nameCapitalization');
  }));

  it('should return the input prefixed with "nameCapitalization filter:"', function () {
    var text = 'angularjs';
    expect(nameCapitalization(text)).toBe('nameCapitalization filter: ' + text);
  });

});
