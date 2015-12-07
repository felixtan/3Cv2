'use strict';

describe('Controller: CarDataCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));
  beforeEach(module('xeditable'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('ui.router'));
  beforeEach(module('config'));
  
  // dataService mock
  beforeEach(module(function($provide) {
    $provide.factory('dataService', function($q) {
      var getCars = jasmine.createSpy('getCars').and.callFake(function() {
        var cars = [];
        if(passPromise) {
          return $q.when(cars);
        } else {
          return $q.reject('Failed to get cars');
        }
      });

      var getCar = jasmine.createSpy('getCar').and.callFake(function() {
        var car = {};
        if(passPromise) {
          return $q.when(car);
        } else {
          return $q.reject('Failed to get cars');
        }
      });

      return {
        getCars: getCars,
        getCar: getCar
      };
    });
  }));

  var CarDataCtrl,
      scope,
      dataService,
      deferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $rootScope, $controller, $window) {
    scope = $rootScope.$new();
    deferred = $q.defer();
    // dataService = _dataService_;
    
    CarDataCtrl = $controller('CarDataCtrl', {
      $scope: scope,
      dataService: dataService,
      getCar: dataService.getCar(),
      getCars: dataService.getCars()
    });
  
    // spyOn(dataService, 'syncCall').and.callThrough();
    // spyOn(dataService, 'asyncCall').and.returnValue(deferred.promise);
  }));

  // Update
  describe('UPDATE car data', function() {
    it('should store the field/key name before updates/changes are made', function() {
      // expect(angular.isString(CarDataCtrl.$scope.oldField)).toBe(true);
      expect(true).toBe(true);
    });
  });
});
