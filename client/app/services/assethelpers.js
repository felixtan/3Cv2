(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name clientApp.assetHelpers
   * @description
   * # assetHelpers
   * Factory in the clientApp.
   */
  angular.module('clientApp')
    .factory('assetHelpers', ['$rootScope', '$q', '$state', 'dataService', '_', 'ENV',
    function ($rootScope, $q, $state, dataService, _, ENV) {

      //////////////////////////
      //  Data CRUD and Forms //
      //////////////////////////

      var get = dataService.getAssets;
      var getById = dataService.getAsset;
      var saveAsset = dataService.createAsset;
      var update = dataService.updateAsset;
      var deleteAsset = dataService.deleteAsset;
      var getTypes = dataService.getTypes;

      return {

        // Data
        getOrganizationId: getOrganizationId,
        get: get,
        getTypes: getTypes,
        getByType: getByType,
        getById: getById,
        saveAsset: saveAsset,
        update: update,
        createAsset: createAsset,
        deleteAsset: deleteAsset,
        thereAreAssetsOfType: thereAreAssetsOfType,
        _getFields: _getFields,
        getFields: getFields,
        belongsToType: belongsToType,
        invalidAssetType: invalidAssetType,
        getIdentifier: getIdentifier,
        getFieldsToBeLogged: getFieldsToBeLogged,
        updateIdentifier: updateIdentifier,
        filterAssetsByType: filterAssetsByType,
        getDefaultAsset: getDefaultAsset,
        getLogDates: getLogDates,
      };

      function getByType (assetType) {
        // console.log(assetType);
        return get().then(function(result) {
          // console.log(result);
          if(typeof result.data !== 'undefined' && result.data !== null) {
            return {
              data: (_.filter(result.data, function(asset) {
                var _assetType_ = '';
                angular.copy(asset.assetType, _assetType_);
                // console.log(asset);
                // return asset.data.assetType.value === assetType;
                return asset.assetType === assetType;
              }))
            };
          } else {
            return { data: [] };
          }
        });
      }

      function getOrganizationId() {
        return (ENV.name === ('production' || 'staging')) ? $rootScope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
      }

      function thereAreAssetsOfType(assetType) {
        var deferred = $q.defer();
        get().then(function(result) {
          // console.log('checking if there are assets of type', result);
          var assets = _.filter(result.data, function(asset) {
              return asset.assetType === assetType;
          });

          deferred.resolve((assets.length > 0));
          deferred.reject(new Error('Error determining if there are assets.'));
        });
        return deferred.promise;
      }

      function _getFields() {
        var deferred = $q.defer();
        get().then(function(result) {
          deferred.resolve(Object.keys(result.data[0].data));
          deferred.reject(new Error('Failed to get fields'));
        });
        return deferred.promise;
      }

      function getFields(asset) {
        return Object.keys(asset.data);
      }

      function getLogDates(assetType) {
        var deferred = $q.defer();
        var logDates = [];

        getByType(assetType).then(function(result) {
          var assets = result.data;
          if(isValid(assets)) {
            if(assets.length > 0) {
              _.each(assets[0].logs, function(log) {
                logDates.push(log.weekOf);
              });
              // console.log(logDates);
              deferred.resolve(_.uniq(logDates.sort(), true).reverse());
              deferred.reject(new Error('Error getting asset log dates'));
            } else {
              deferred.resolve([]);
              deferred.reject(new Error('Error getting asset log dates'));
            }
          } else {
            deferred.resolve([]);
            deferred.reject(new Error('Error getting asset log dates'));
          }
        });

        return deferred.promise;
      }

      function isValid(value) {
          return value !== null && typeof value !== "undefined";
      }

      function createLogs(logDates, blankLogData) {
        var deferred = $q.defer();
        var logs = [];

        _.each(logDates, function(logDate) {
          logs.push({
            data: blankLogData,
            weekOf: logDate,
            createdAt: new Date()
          });
        });

        deferred.resolve(logs);
        deferred.reject(new Error('Error creating logs for asset'));
        return deferred.promise;
      }

      function createLogData(assetType) {
        var deferred = $q.defer();
        var logData = {};

        getFieldsToBeLogged(assetType).then(function(fields) {
          console.log(fields);
          _.each(fields, function(field) {
            logData[field] = null;
          });
          console.log(logData);
          deferred.resolve(logData);
          deferred.reject(new Error('Error creating log data for assets ' + assetType));
        });

        // deferred.reject(new Error('Error creating log data for assets ' + assetType));
        return deferred.promise;
      }

      function createAsset(assetData, identifier, assetType) {
        var deferred = $q.defer();
        // console.log(assetData);
        // console.log(identifier);
        // console.log(assetType);
        createLogData(assetType).then(function(logData) {
          // console.log(logData);
          getLogDates(assetType).then(function(logDates) {
            // console.log(logDates);
            createLogs(logDates, logData).then(function(logs) {
              // console.log(logs);

              deferred.resolve({
                identifier: identifier,
                assetType: assetType,
                data: assetData,
                logs: logs,
                driversAssigned: [],
                organizationId: getOrganizationId()
              });

              deferred.reject(new Error('Error creating asset of type ' + assetData.assetType.value));
            });
          });
        });

        // deferred.reject(new Error('Error creating asset of type ' + assetData.assetType.value));

        return deferred.promise;
      }

      function getDefaultAsset(assetType) {
        var deferred = $q.defer();

        deferred.resolve({
            identifier: null,
            assetType: assetType,
            data: {
              assetType: {
                value: assetType,
                log: false,
                type: 'text',
                dataType: 'text',
              }
            },
            logs: [],
            driversAssigned: [],
            organizationId: getOrganizationId(),
        });
        deferred.reject(new Error("Error getting default car."));
        return deferred.promise;
      }

      function getIdentifier(assetType) {
        var deferred = $q.defer();

        get().then(function(result) {
          var assets = _.filter(result.data, function(asset) {
            return (asset.assetType === assetType);
          });

          if(assets.length) {
            deferred.resolve(assets[0].identifier);
            deferred.reject(new Error("Error getting identifier."));
          } else {
            deferred.resolve(null);   // there are no assets of assetType
            deferred.reject(new Error("Error getting identifier."));
          }
        });

        return deferred.promise;
      }

      function filterAssetsByType(allAssets, assetType) {
        return _.filter(allAssets, function(asset) {
            return asset.assetType === assetType;
        });
      }

      function belongsToType(asset, type) {
        // console.log(asset);
        // console.log(type);
        return asset.assetType === type;
      }

      function invalidAssetType(formData) {
        return ((formData.assetType !== null) || (typeof formData.assetType === 'undefined'));
      }

      function getFieldsToBeLogged(assetType) {
        // console.log(assetType);
        var deferred = $q.defer();
        var fields = [];
        get().then(function(result) {
          // filterAssetsByType(result.data, assetType).then(function(assetsOfType) {
            // console.log(assetType);
            var assetsOfType = filterAssetsByType(result.data, assetType);
            console.log(assetsOfType);
            // console.log(assetsOfType.length);
            // console.log(Object.keys(assetsOfType[0].data));
            if(assetsOfType.length > 0) {
              fields = _.filter(Object.keys(assetsOfType[0].data), function(field) {
                console.log(assetsOfType[0].data[field]);
                return assetsOfType[0].data[field].log;
              });
              console.log(fields);
              deferred.resolve(fields);
              deferred.reject(new Error('Error getting fields to be logged'));
            } else {
              // console.log(fields);
              deferred.resolve(fields);
              deferred.reject(new Error('Error getting fields to be logged'));
            }
          // });
        });

        return deferred.promise;
      }

      function updateIdentifier(assets, currentVal, newVal) {
        if(currentVal !== newVal) {
          _.each(assets, function(asset) {
              asset.identifier = newVal;
              // console.log('updating identifier:',car);
              dataService.updateAsset(asset);
          });
        }

        $state.forceReload();
      }
    }]);
})();
