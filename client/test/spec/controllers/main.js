'use strict';

describe('Controller: MainCtrl', function () {
  var $controller, $rootScope, $httpBackend;

  // load the controller's module
  beforeEach(module('clientApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$rootScope_, _$httpBackend_) {
    // scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $controller = _$controller_('MainCtrl', { '$scope': $rootScope });
  }));

  it("should only GET cars with the current user's organizationId", function(){
    var $scope = {};
    var controller = $controller('MainCtrl', { $scope: $scope });
    $httpBackend.expect('GET', '/api/cars', {[
      {
        data: {
            licensePlate: 'T627067C',
            licenseNumber: 'GPJ 6478',
            mileage: 14081,
            description: 'lorem ipsum'
        },
        organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x'
      },
      {
        data: {
            licensePlate: 'T657227C',
            licenseNumber: 'FLJ 6290',
            mileage: 120461,
            description: 'lorem ipsum'
        },
        organizationId: '3Qnv2pMAxLZqVdp7n8RZ0x'
      }
    ]});
  });
});
