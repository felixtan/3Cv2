'use strict';

describe('Filter: nameCapitalization', function () {

  // load the filter's module
  beforeEach(module('clientApp'));

  // initialize a new instance of the filter before each test
  var nameCapitalization;
  beforeEach(inject(function ($filter) {
    nameCapitalization = $filter('nameCapitalization');
  }));
});
