'use strict';

describe('MainCtrl', function () {
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

    controller = $controller('MainCtrl', { 
      $scope: scope,
      getCars: getCars
    });
  }));

  it('should direct to the correct url', function() {
    expect(state.href('dashboard.cars')).toEqual('#/dashboard/cars');
  });

  it('should load all the cars to scope', function() {
    state.go('dashboard.cars');
    expect(dataService.getCars).toHaveBeenCalled();
    expect(scope.cars).toBeDefined();
  });

  it('should load the car identifier to scope', function() {
    expect(scope.identifier).toBeDefined();
  });
});
