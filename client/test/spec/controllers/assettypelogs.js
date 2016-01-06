'use strict';

describe('Controller: AssettypelogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var AssettypelogsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssettypelogsCtrl = $controller('AssettypelogsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssettypelogsCtrl.awesomeThings.length).toBe(3);
  });
});
