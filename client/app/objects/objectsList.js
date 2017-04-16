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
                      $scope.statuses = ctrl.convertArrayLikeObjToArrayOfObj(ctrl.prospectStatuses.statuses);
                  });

                  return prospectHelpers.get;

              case "asset":
                  $scope.title = { value: "Asset" };
                  $scope.profile = { state: 'assetData({ id: object.id })' };

                  assetHelpers.getTypes().then(function(result) {
                      $scope.assetTypes = result.data;
                      $scope.types = $scope.assetTypes.types;
                      _.each($scope.types, function(type, i) {
                          $scope.order[i] = i;
                      });
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

      // Submit with enter
      // $scope.keypress = function(e, form) {
      //     if (e.which === 13) {
      //         form.$submit();
      //     }
      // };

      $scope.thereAreObjects = function() {
          return (typeof $scope.objects !== 'undefined' && $scope.objects.length > 0);
      };

      $scope.addObject = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/addobjectmodal.html',
              controller: 'AddObjectModalInstanceCtrl',
              size: 'md',
              resolve: {
                  objectType: function() {
                      return $scope.objectType;
                  },
                  getCars: function() {
                      return ($scope.objectType === 'car') ? carHelpers.get() : [];
                  },
                  getDrivers: function() {
                      return ($scope.objectType === 'driver') ? driverHelpers.get() : [];
                  },
                  getProspects: function() {
                      return ($scope.objectType === 'prospect') ? prospectHelpers.get() : [];
                  },
                  getAssets: function() {
                      return ($scope.objectType === 'asset') ? assetHelpers.get() : [];
                  },
                  assetType: function() {
                      return null;
                  }
              }
          });

          modalInstance.result.then(function () {
              // $state.forceReload();
          }, function() {
              // $state.forceReload();
              console.log('Modal dismissed at: ' + new Date());
          });
      };

      //
      // Asset list stuff
      /////////////////////////////////////////////////////////////////////
      $scope.thereAreAssetsOfType = function(type) {
          var assets = _.filter($scope.assets, function(asset) {
              return asset.assetTtype === type;
          });
      };

      $scope.addType = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/assetTypeModal.html',
              controller: 'AssetTypeModalCtrl',
              size: 'md',
              resolve: {
                  getTypes: function() {
                      return assetHelpers.getTypes();
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

      // TODO: make a functional method for this; modifying native methods is bad practice apparently
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

      ctrl.updateOrder = function(oldIndex, newIndex) {
          $scope.types.move(oldIndex, newIndex);
          $scope.assetTypes.types = $scope.types;
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
            ctrl.updateOrder(oldIndex, $scope.statusOrder[oldIndex]);
          }

          assetHelpers.updateTypes($scope.assetTypes);
          $scope.updateTypeInAssets(oldName, data.name);
          $state.forceReload();
      };

      /*****************
       * Prospect list *
       *****************/
      $scope.belongsToStatus = prospectHelpers.belongsToStatus;

      ctrl.convertArrayLikeObjToArrayOfObj = function(obj) {
        return _.reduce(obj, function(memo, v, k) {
          memo[k] = v;
          return memo;
        }, []);
      };

      ctrl.convertArrayOfObjToArrayLikeObj = function(arr) {
        return _.reduce(arr, function(memo, v) {
          memo[memo.length++] = v;
          return memo;
        }, { length: 0 });
      };

      ctrl.updateOrder = function(oldIndex, newIndex) {
          $scope.statuses.move(oldIndex, newIndex);
      };

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

      // $scope.setIndexVal = function(orderIndex) {
      //   $scope.statusOrder.val = orderIndex;
      // };

      $scope.saveStatus = function(data, oldIndex, oldName) {
          if(oldIndex !== $scope.statusOrder[oldIndex]) {
            ctrl.updateOrder(oldIndex, $scope.statusOrder[oldIndex]);
          }

          ctrl.prospectStatuses.statuses = ctrl.convertArrayOfObjToArrayLikeObj($scope.statuses);

          var promises = [
            prospectHelpers.updateStatuses(ctrl.prospectStatuses),        // updates statuses
            ctrl.updateStatusInProspects(oldName, data.name)              // updates prospects
          ];

          $q.all(promises).then(function(values) {
            // console.log(values);
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
          ctrl.prospectStatuses.statuses = ctrl.convertArrayOfObjToArrayLikeObj($scope.statuses);
          prospectHelpers.updateStatuses(ctrl.prospectStatuses);
          ctrl.unassignProspects(statusName);
          $state.forceReload();
      };

      $scope.addStatus = function() {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'views/prospectstatusmodal.html',
              controller: 'ProspectStatusModalCtrl',
              size: 'md',
              resolve: {
                  prospectStatuses: function() {
                      return ctrl.prospectStatuses;
                  }
              }
          });

          modalInstance.result.then(function () {
              console.log('Modal dismissed at: ' + new Date());
          });
      };
  }]);
})();
