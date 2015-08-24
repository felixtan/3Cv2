'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectformodalinstanceCtrl
 * @description
 * # ProspectformodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectFormModalInstanceCtrl', function ($http, $route, $scope, $modalInstance) {
    $scope.formData = {};

      $scope.submit = function () {
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
        $route.reload();
      };

      $scope.close = function () {
        $modalInstance.dismiss('cancel');
      };
  });
