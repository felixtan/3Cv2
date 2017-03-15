'use strict';

describe('Controller: DeleteObjModalCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var controller, scope, modal, modalInstance;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $modal, $q) {
    scope = $rootScope.$new();
    modal = $modal;
    modalInstance = {
      result: function() {
        var deferred = $q.defer();
        deferred.resolve('modalInstance result');
        return deferred.promise;
      }
    };

    spyOn(modal, 'open');

    controller = $controller('DeleteObjModalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
