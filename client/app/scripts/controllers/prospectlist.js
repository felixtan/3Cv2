'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectlistCtrl
 * @description
 * # ProspectlistCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectListCtrl', function (prospectHelpers, getProspects, getProspectStatuses, dataService, $scope, $modal, $state) {
    $scope.prospectStatuses = getProspectStatuses.data;
    $scope.statuses = $scope.prospectStatuses.statuses;
    $scope.order = [];
    $scope.newIndex = { val: null };    // stores index changes
    for(var i = 0; i < $scope.statuses.length; i++) $scope.order[i] = i;    // populate order select
    $scope.prospects = getProspects.data;

    $scope.thereAreProspects = function() {
        return (typeof $scope.prospects[0] !== 'undefined');
    };

    /* accepts
        1. prospect object
        2. status object
    */
    $scope.belongsToStatus = prospectHelpers.belongsToStatus;

    // http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
    Array.prototype.move = function (old_index, new_index) {
        if (new_index >= this.length) {
            var k = new_index - this.length;
            while ((k--) + 1) {
                this.push(undefined);
            }
        }
        this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    };

    $scope.updateOrder = function(oldIndex, newIndex) {
        $scope.statuses.move(oldIndex, newIndex);
        $scope.prospectStatuses.statuses = $scope.statuses;
    };

    // when status name changes
    $scope.updateStatusInProspects = function(oldName, newName) {
        _.each($scope.prospects, function(prospect) {
            if(prospect.status.value === oldName) {
                prospect.status.value = newName;
                prospect.data.status.value = newName;
                dataService.updateProspect(prospect);
            }
        });
    };

    $scope.saveStatus = function(data, oldIndex, oldName) {
        if(oldIndex != $scope.newIndex.val) $scope.updateOrder(oldIndex, $scope.newIndex.val)
        dataService.updateProspectStatuses($scope.prospectStatuses);
        $scope.updateStatusInProspects(oldName, data.name);
        $state.forceReload();
    };

    $scope.getDefaultStatus = function() {
        return _.findWhere($scope.statuses, { special: true });
    };

    // when a status is deleted
    $scope.unassignProspects = function(statusName) {
        var defaultStatus = $scope.getDefaultStatus();
        _.each($scope.prospects, function(prospect) {
            if(prospect.status.value === statusName) {
                prospect.status = defaultStatus;
                prospect.data.status = defaultStatus;
                dataService.updateProspect(prospect);
            }
        });
    }

    // TODO add warning for user
    // Prospects with the deleted status are reassigned to Unassigned
    $scope.deleteStatus = function(index, statusName) {
        $scope.statuses.splice(index, 1);
        $scope.prospectStatuses.statuses = $scope.statuses;
        dataService.updateProspectStatuses($scope.prospectStatuses);
        $scope.unassignProspects(statusName);
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
