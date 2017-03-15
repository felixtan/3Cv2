'use strict';

describe('CarListCtrl', function () {
  var controller, rootScope, carHelpers, state, dataService, scope;

  // load the controller's module
  beforeEach(module('clientApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $state, _dataService_, _carHelpers_) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    dataService = _dataService_;
    carHelpers = _carHelpers_;
    state = $state;

    spyOn(dataService, 'getCars');
    spyOn(carHelpers, 'mapObject');

    controller = $controller('CarListCtrl', { 
      $scope: scope,
      getCars: getCars
    });

    // spyOn(scope, "keypress").and.callThrough();
  }));

  it('should direct to the correct url', function() {
    expect(state.href('dashboard.cars')).toEqual('#/dashboard/cars');
  });

  it('should load all the cars to scope', function() {
    state.go('dashboard.cars');
    expect(dataService.getCars).toHaveBeenCalled();
    expect(scope.cars).toBeDefined();
  });

  describe('simplified cars', function() {
    it('should store a simplified version of the cars', function() {
      state.go('dashboard.cars');
      setTimeout(function() {
        expect(carHelpers.mapObject).toHaveBeenCalled();
        expect(scope.simpleCars).toBeDefined();
      }, 500);
    });

    it('should have the same amount of simplified cars as full cars', function() {
      state.go('dashboard.cars');
      setTimeout(function() {
        expect(scope.cars.length).toEqual(scope.simpleCars.length);
      }, 500);      
    });
  });

  describe('car identifier', function() {
    it('should load the car identifier to scope', function() {
      expect(scope.identifier).toBeDefined();
    });

    it('should organize the cars in the view by identifier', function() {
      if(scope.cars.length) expect(scope.cars[0].identifier).toEqual(scope.identifier);

      _.each(scope.simpleCars, function(simpleCar) {
        expect(simpleCar.identifierValue).toBeDefined();
      });
    });
  });

  it('should determine if there is at least one car', function() {
    expect(scope.thereAreCars()).toEqual(true);

    scope.cars = [];
    expect(scope.thereAreCars()).toEqual(false);    
  });  

});
