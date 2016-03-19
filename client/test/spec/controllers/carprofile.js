'use strict';

describe('Controller: CarProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
    scope,
    carHelpers;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _carHelpers_) {
    scope = $rootScope.$new();
    carHelpers = _carHelpers_;

    ctrl = $controller('CarProfileCtrl', {
      $scope: scope,
      getCars: getCars,
      getCar: getCar
    });

    // spyOn(ctrl, 'getCar');
    spyOn(carHelpers, 'simplify');
  }));

  it('get the car', function() {
    // expect(scope.getCar).toBeDefined();
    // expect(scope.getCar).toHaveBeenCalled();
    expect(scope.car).toBeDefined();
  });

  it('should simplify the car', function() {
    setTimeout(function() {
      expect(carHelpers.simplify).toHaveBeenCalled();
      expect(scope.simpleCar).toBeDefined();
      expect(scope.simpleCar.id).toEqual(scope.car.id);
      expect(scope.simpleCar.identifierValue).toEqual(scope.car.data[scope.car.identifier].value);
    }, 500);
  });
});
