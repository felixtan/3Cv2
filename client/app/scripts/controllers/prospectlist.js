'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectlistCtrl
 * @description
 * # ProspectlistCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectListCtrl', function (prospectHelpers, getProspectStatuses, dataService, $scope, $modal, $state) {
    $scope.prospectStatuses = getProspectStatuses.data[0];
    $scope.statuses = $scope.prospectStatuses.statuses;
    $scope.order = [];
    $scope.newIndex = { val: null };    // stores index changes

    // populate order select
    for(var i = 0; i < $scope.statuses.length; i++) $scope.order[i] = i;

    // http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
        // return this; // for testing purposes
    };

    $scope.updateOrder = function(oldIndex, newIndex) {
        $scope.statuses.move(oldIndex, newIndex);
        $scope.prospectStatuses.statuses = $scope.statuses;
    };

    $scope.saveStatus = function(data, oldIndex) {
        if(oldIndex != $scope.newIndex.val) $scope.updateOrder(oldIndex, $scope.newIndex.val)
        dataService.updateProspectStatuses($scope.prospectStatuses);
        $state.forceReload();
    };

    // TODO add warning for user
    // Prospects with the deleted status are reassigned to Unassigned
    $scope.deleteStatus = function(index) {
        $scope.statuses.splice(index, 1);
        $scope.prospectStatuses.statuses = $scope.statuses;
        dataService.updateProspectStatuses($scope.prospectStatuses);
        $state.forceReload();
    };

    $scope.addStatus = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/prospectstatusmodal.html',
            controller: 'ProspectStatusModalCtrl',
            size: 'md',
            resolve: {
                getProspectStatuses: function(dataService) {
                    return dataService.getProspectStatuses();
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
  });
