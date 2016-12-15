(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:DeleteobjmodalCtrl
   * @description
   * # DeleteobjmodalCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('DeleteObjModalCtrl', ['$scope', '$modal',
      function ($scope, $modal) {

      $scope.open = function (id) {
          var modalInstance = $modal.open({
              animation: true,
              templateUrl: 'views/deleteobjmodal.html',
              controller: 'DeleteObjModalInstanceCtrl',
              size: 'md',
              resolve: {
                  id: function() {
                      return id;
                  }
              }
          });

          modalInstance.result.then(function (input) {
              console.log('passed back from DeleteFieldModalInstanceCtrl:', input);
          }, function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };
    }]);
})();
