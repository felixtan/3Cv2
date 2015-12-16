'use strict';

describe('CarFormModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('CarFormModalCtrl', {
      $scope: scope
    });
  }));

  it("should open the instance modal", function() {
    expect(scope.open).toBeDefined();
  });
});
