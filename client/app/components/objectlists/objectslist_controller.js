(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name clientApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the clientApp
   */
  angular.module('clientApp')
    .controller('ObjectListCtrl', ['$q', 'objectType', 'objectHelpers', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '$state', '$uibModal', '$scope', '_',
      function ($q, objectType, objectHelpers, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state, $uibModal, $scope, _) {

      var ctrl = this;
      $scope.objectType = objectType;
      $scope.order = [];
      $scope.statusOrder = {};     // Track changes in status ordering

      ctrl.getObjects = function () {
          switch($scope.objectType) {
              case "car":
                  $scope.title = { value: "Car" };
                  $scope.profile = { state: 'carData({ id: object.id })' };
                  return carHelpers.get;
              case "driver":
                  $scope.title = { value: "Driver" };
                  $scope.profile = { state: 'driverData({ id: object.id })' };
                  return driverHelpers.get;
              case "prospect":
                  $scope.title = { value: "Prospect" };
                  $scope.profile = { state: 'prospectData({ id: object.id })' };

                  prospectHelpers.getStatuses().then(function(result) {
                      ctrl.prospectStatuses = result.data;
                      $scope.statuses = objectHelpers.convertArrayLikeObjToArrayOfObj(ctrl.prospectStatuses.statuses);
                  });

                  return prospectHelpers.get;

              case "asset":
                  $scope.title = { value: "Asset" };
                  $scope.profile = { state: 'assetData({ id: object.id })' };

                  assetHelpers.getTypes().then(function(result) {
                      ctrl.assetTypes = result.data;
                      $scope.types = objectHelpers.convertArrayLikeObjToArrayOfObj(ctrl.assetTypes.types);
                  });

                  return assetHelpers.get;

              default:
                  $scope.title = { value: "Car" };
                  $scope.profile = { state: 'carData({ id: object.id })' };
                  return carHelpers.get;
          }
      };

      ctrl.getObjects()().then(function(result) {
          $scope.objects = result.data;
          $scope.simpleObjects = objectHelpers.simplify($scope.objects);
      });

      $scope.thereAreObjects = function() {
          return (typeof $scope.objects !== 'undefined' && $scope.objects.length > 0);
      };

      $scope.addObject = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/objectcrud/addobjectmodal.html',
              controller: 'AddObjectModalCtrl',
              controllerAs: 'addObjectModal',
              size: 'md',
              resolve: {
                  objectType: function() {
                      return $scope.objectType;
                  },
                  getObjects: function() {
                      return $scope.objects;
                  }
              }
          });

          modalInstance.result.then(function () {
              $state.forceReload();
          }, function() {
            //   console.log('Modal dismissed at: ' + new Date());
          });
      };

      /**************
       * Asset list *
       **************/
      $scope.thereAreAssetsOfType = function(type) {
          var assets = _.filter($scope.assets, function(asset) {
              return asset.assetTtype === type;
          });
      };

      $scope.addType = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/assettypemodal.html',
              controller: 'AssetTypeModalCtrl',
              controllerAs: 'assetTypeModal',
              size: 'md',
              resolve: {
                  assetTypes: function() {
                      return ctrl.assetTypes;
                  }
              }
          });

          modalInstance.result.then(function () {
              // console.log('AssetTypeModal dismissed at: ' + new Date());
          });
      };

      /*
          accepts:
              1. asset object
              2. type object
      */
      $scope.belongsToType = assetHelpers.belongsToType;

      ctrl.updateOrder = function(arr, oldIndex, newIndex) {
        if (oldIndex !== newIndex && newIndex < arr.length) {
          arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
          $state.forceReload();
        } else if (oldIndex === newIndex) {
          // pass
        } else {
          // This shouldn't happen
          throw new Error("Index out of bounds.");
        }
      };

      // when type name changes
      $scope.updateTypeInAssets = function(oldName, newName) {
          _.each($scope.assets, function(asset) {
              if(asset.status.value === oldName) {
                  asset.status.value = newName;
                  asset.data.status.value = newName;
                  assetHelpers.update(asset);
              }
          });
      };

      $scope.saveType = function(data, oldIndex, oldName) {
          if(oldIndex != $scope.statusOrder[oldIndex]) {
            ctrl.updateOrder($scope.types, oldIndex, $scope.statusOrder[oldIndex]);
          }

          assetHelpers.updateTypes(ctrl.assetTypes);
          $scope.updateTypeInAssets(oldName, data.name);
          $state.forceReload();
      };

      /*****************
       * Prospect list *
       *****************/
      $scope.belongsToStatus = prospectHelpers.belongsToStatus;

      // when status name changes
      ctrl.updateStatusInProspects = function(oldName, newName) {
        var deferred = $q.defer();
        var updates = [];
        _.each($scope.objects, function(prospect) {
            if(prospect.status.value === oldName) {
                prospect.status.value = newName;
                prospect.data.status.value = newName;
                updates.push(prospectHelpers.update(prospect));
            }
        });

        $q.all(updates).then(function(values) {
          deferred.resolve(values);
          deferred.reject(new Error("Error updating prospect statuses"));
        });

        return deferred.promise;
      };

      $scope.saveStatus = function(data, oldIndex, oldName) {
          var updateTasks = [];
          var newIndex = !$scope.statusOrder[oldIndex] ? oldIndex : parseInt($scope.statusOrder[oldIndex]);
          oldIndex = parseInt(oldIndex);

          if (oldIndex !== newIndex) {
            ctrl.updateOrder($scope.statuses, oldIndex, newIndex);
          }

          if (oldName !== data.name) {
            updateTasks.push(ctrl.updateStatusInProspects(oldName, data.name));
          }

          ctrl.prospectStatuses.statuses = objectHelpers.convertArrayOfObjToArrayLikeObj($scope.statuses);
          updateTasks.push(prospectHelpers.updateStatuses(ctrl.prospectStatuses));

          $q.all(updateTasks).then(function() {
            $state.forceReload();
          });
      };

      ctrl.getDefaultStatus = function() {
          var status = null;

          for (var i = 0; i < $scope.statuses.length; i++) {
            if ($scope.statuses[i].special) {
              status = $scope.statuses[i];
              break;
            }
          }

          return status;
      };

      // Move prospects to Unassigned status when a status is deleted
      ctrl.unassignProspects = function(statusName) {
          var updatesToMake = [];
          var defaultStatus = ctrl.getDefaultStatus();

          _.each($scope.objects, function(prospect) {
              if(prospect.status.value === statusName) {
                  prospect.status = defaultStatus;
                  prospect.data.status = defaultStatus;
                  updatesToMake.push(prospectHelpers.update(prospect));
              }
          });

          $q.all(updatesToMake);
      };

      // TODO add warning for user
      // Prospects with the deleted status are reassigned to Unassigned
      $scope.deleteStatus = function(index, statusName) {
          $scope.statuses.splice(index, 1);
          ctrl.prospectStatuses.statuses = objectHelpers.convertArrayOfObjToArrayLikeObj($scope.statuses);
          prospectHelpers.updateStatuses(ctrl.prospectStatuses);
          ctrl.unassignProspects(statusName);
      };

      $scope.addStatus = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/prospectstatusmodal.html',
              controller: 'ProspectStatusModalCtrl',
              controllerAs: 'prospectStatusModal',
              size: 'md',
              resolve: {
                  prospectStatuses: function() {
                      return ctrl.prospectStatuses;
                  }
              }
          });

          modalInstance.result.then(function () {
            //   console.log('Modal dismissed at: ' + new Date());
          });
      };
  }]);
})();
