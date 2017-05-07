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
    .controller('ObjectListCtrl', ['$q', 'objectType', 'objectHelpers', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '$state', '$uibModal', '_',
      function ($q, objectType, objectHelpers, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state, $uibModal, _) {

      var ctrl = this;
      ctrl.objectType = objectType;
      ctrl.order = [];
      ctrl.statusOrder = {};     // Track changes in status ordering

      ctrl.getObjects = function () {
          switch(ctrl.objectType) {
              case "car":
                  ctrl.title = { value: "Car" };
                  ctrl.profile = { state: 'carData({ id: object.id })' };
                  return carHelpers.get;
              case "driver":
                  ctrl.title = { value: "Driver" };
                  ctrl.profile = { state: 'driverData({ id: object.id })' };
                  return driverHelpers.get;
              case "prospect":
                  ctrl.title = { value: "Prospect" };
                  ctrl.profile = { state: 'prospectData({ id: object.id })' };

                  prospectHelpers.getStatuses().then(function(result) {
                      ctrl.prospectStatuses = result.data;
                      ctrl.statuses = objectHelpers.convertArrayLikeObjToArrayOfObj(ctrl.prospectStatuses.statuses);
                  });

                  return prospectHelpers.get;

              case "asset":
                  ctrl.title = { value: "Asset" };
                  ctrl.profile = { state: 'assetData({ id: object.id })' };

                  assetHelpers.getTypes().then(function(result) {
                      ctrl.assetTypes = result.data;
                      ctrl.types = objectHelpers.convertArrayLikeObjToArrayOfObj(ctrl.assetTypes.types);
                  });

                  return assetHelpers.get;

              default:
                  ctrl.title = { value: "Car" };
                  ctrl.profile = { state: 'carData({ id: object.id })' };
                  return carHelpers.get;
          }
      };

      ctrl.getObjects()().then(function(result) {
          ctrl.objects = result.data;
          ctrl.simpleObjects = objectHelpers.simplify(ctrl.objects);
      });

      ctrl.thereAreObjects = function() {
          return (typeof ctrl.objects !== 'undefined' && ctrl.objects.length > 0);
      };

      ctrl.addObject = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/objectcrud/addobjectmodal.html',
              controller: 'AddObjectModalCtrl',
              controllerAs: 'addObjectModal',
              size: 'md',
              resolve: {
                  objectType: function() {
                      return ctrl.objectType;
                  },
                  getObjects: function() {
                      return ctrl.objects;
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
      ctrl.thereAreAssetsOfType = function(type) {
          var assets = _.filter(ctrl.assets, function(asset) {
              return asset.assetTtype === type;
          });
      };

      ctrl.addType = function() {
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
      ctrl.belongsToType = assetHelpers.belongsToType;

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
      ctrl.updateTypeInAssets = function(oldName, newName) {
          _.each(ctrl.assets, function(asset) {
              if(asset.status.value === oldName) {
                  asset.status.value = newName;
                  asset.data.status.value = newName;
                  assetHelpers.update(asset);
              }
          });
      };

      ctrl.saveType = function(data, oldIndex, oldName) {
          if(oldIndex != ctrl.statusOrder[oldIndex]) {
            ctrl.updateOrder(ctrl.types, oldIndex, ctrl.statusOrder[oldIndex]);
          }

          assetHelpers.updateTypes(ctrl.assetTypes);
          ctrl.updateTypeInAssets(oldName, data.name);
          $state.forceReload();
      };

      /*****************
       * Prospect list *
       *****************/
      ctrl.belongsToStatus = prospectHelpers.belongsToStatus;

      // when status name changes
      ctrl.updateStatusInProspects = function(oldName, newName) {
        var deferred = $q.defer();
        var updates = [];
        _.each(ctrl.objects, function(prospect) {
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

      ctrl.saveStatus = function(data, oldIndex, oldName) {
          var updateTasks = [];
          var newIndex = !ctrl.statusOrder[oldIndex] ? oldIndex : parseInt(ctrl.statusOrder[oldIndex]);
          oldIndex = parseInt(oldIndex);

          if (oldIndex !== newIndex) {
            ctrl.updateOrder(ctrl.statuses, oldIndex, newIndex);
          }

          if (oldName !== data.name) {
            updateTasks.push(ctrl.updateStatusInProspects(oldName, data.name));
          }

          ctrl.prospectStatuses.statuses = objectHelpers.convertArrayOfObjToArrayLikeObj(ctrl.statuses);
          updateTasks.push(prospectHelpers.updateStatuses(ctrl.prospectStatuses));

          $q.all(updateTasks).then(function() {
            $state.forceReload();
          });
      };

      ctrl.getDefaultStatus = function() {
          var status = null;

          for (var i = 0; i < ctrl.statuses.length; i++) {
            if (ctrl.statuses[i].special) {
              status = ctrl.statuses[i];
              break;
            }
          }

          return status;
      };

      // Move prospects to Unassigned status when a status is deleted
      ctrl.unassignProspects = function(statusName) {
          var updatesToMake = [];
          var defaultStatus = ctrl.getDefaultStatus();

          _.each(ctrl.objects, function(prospect) {
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
      ctrl.deleteStatus = function(index, statusName) {
          ctrl.statuses.splice(index, 1);
          ctrl.prospectStatuses.statuses = objectHelpers.convertArrayOfObjToArrayLikeObj(ctrl.statuses);
          prospectHelpers.updateStatuses(ctrl.prospectStatuses);
          ctrl.unassignProspects(statusName);
      };

      ctrl.addStatus = function() {
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

          modalInstance.result.then(function(data) {
            //   console.log('Deleted ' + data.type + ' with id = ' + data.id);
          });
      };
  }]);
})();
