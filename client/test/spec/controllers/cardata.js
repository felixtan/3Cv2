'use strict';

describe('Controller: CardataCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var CardataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CardataCtrl = $controller('CardataCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CardataCtrl.awesomeThings.length).toBe(3);
  });
});
