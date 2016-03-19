'use strict';

describe('CarsLogsCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state, rootScope, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_, $state, $window) {
    scope = $rootScope.$new();
    state = $state;
    dataService = _dataService_;
    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'getCar');
    controller = $controller('CarsLogsCtrl', {
      $scope: scope,
      getCar: getCar
    });
  }));

  
});
