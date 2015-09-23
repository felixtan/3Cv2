'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectformodalinstanceCtrl
 * @description
 * # ProspectformodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectFormModalInstanceCtrl', function ($state, $http, $scope, $modalInstance) {
    $scope.prospectStatuses = ['Callers', 'Interviewed', 'Waiting List', 'Rejected'];
    $scope.formData = {};

    $scope.submit = function () {
      if($scope.formData.status === ' - ') {
        $scope.formData.status = 'Callers';
      }

      // Formatting
      if($scope.formData.status) { $scope.formData.status = $scope.formData.status.toLowerCase(); }
      if($scope.formData.middleInitial) { $scope.formData.middleInitial = $scope.formData.middleInitial.toUpperCase(); }
      $scope.formData.givenName = $scope.formData.givenName.charAt(0).toUpperCase() + $scope.formData.givenName.substr(1).toLowerCase();
      $scope.formData.surName = $scope.formData.surName.charAt(0).toUpperCase() + $scope.formData.surName.substr(1).toLowerCase();

      $http.post('/api/prospects', $scope.formData)
          .then(function() {
              $scope.reset();
          }, function(err) {
              console.error(err);
          });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.prospectForm.$setPristine();
      $scope.prospectForm.$setUntouched();
      $state.forceReload();
    };

    $scope.close = function () {
      $modalInstance.dismiss('cancel');
    };
  });
