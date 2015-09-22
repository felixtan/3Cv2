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

        $scope.formData.status = $scope.formData.status.toLowerCase();

        $http.post('/api/prospects', $scope.formData)
            .then(function(prospect) {
                console.log(prospect.data);    
                $scope.reset();
            }, function(err) {
                console.error(err);
            });
      };

      $scope.reset = function () {
        $scope.formData = {};
        $state.forceReload();
      };

      $scope.close = function () {
        $modalInstance.dismiss('cancel');
      };
  });
