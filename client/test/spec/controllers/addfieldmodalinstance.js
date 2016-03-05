'use strict';

describe('Controller: AddFieldModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, dataService, state, modalInstance;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _dataService_, $state) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    state = $state;

    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'updateDriver');
    spyOn(dataService, 'updateProspect');
    spyOn(dataService, 'updateAsset');
    
    controller = $controller('AddFieldModalInstanceCtrl', {
      $scope: scope,
      getDrivers: getDrivers,
      getCars: getCars,
      getProspects: getProspects,
      getAssets: getAssets
    });
  }));

  describe('Recognizing the object', function() {
    xit('should recognize calls from the car ui', function() {
      // this is an integration test
    });

    
  });
});
