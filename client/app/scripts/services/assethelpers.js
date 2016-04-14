'use strict';

/**
 * @ngdoc service
 * @name clientApp.assetHelpers
 * @description
 * # assetHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('assetHelpers', function (ENV, $q, dataService, $state) {

    //////////////////////////
    //  Data CRUD and Forms //
    //////////////////////////

    var getAssets = dataService.getAssets;
    var getById = dataService.getAsset;
    var saveAsset = dataService.createAsset;
    var update = dataService.updateAsset;
    var deleteAsset = dataService.deleteAsset;
    var getAssetTypes = dataService.getAssetTypes;
    var getAssetsOfType = dataService.getAssetsOfType;
    var getByType = dataService.getAssetsOfType;

    var getOrganizationId = function() {
      return (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
    };

    var thereAreAssetsOfType = function(assetType) {
      var deferred = $q.defer();
      getAssets().then(function(result) {
        // console.log('checking if there are assets of type', result);
        var assets = _.filter(result.data, function(asset) {
            return asset.assetType === assetType;
        });

        deferred.resolve((assets.length > 0));
        deferred.reject(new Error('Error determining if there are assets.'));
      });
      return deferred.promise;
    };

    var _getFields = function() {
      var deferred = $q.defer();
      getAssets().then(function(result) {
        deferred.resolve(Object.keys(result.data[0].data));
        deferred.reject(new Error('Failed to get fields'));
      });
      return deferred.promise;
    };

    var getFields = function(asset) {
      return Object.keys(asset.data); 
    };

    var getLogDates = function(assetType) {
      var deferred = $q.defer();
      var logDates = [];
      thereAreAssetsOfType(assetType).then(function(result) {
        console.log(result);
        if(result) {
          getAssets().then(function(result) {
            filterAssets(result.data, assetType).then(function(assetsOfType) {
              _.each(assetsOfType[0].logs, function(log) {
                logDates.push(log.weekOf);
              });
              console.log(logDates);
              deferred.resolve(_.uniq(logDates.sort(), true).reverse());
              deferred.reject(new Error('Error getting asset log dates'));
            });
          }); 
        } else {
          deferred.resolve([]);
          deferred.reject(new Error('Error getting asset log dates'));
        }
      });

      return deferred.promise;
    };

    var createLogs = function(logDates, blankLogData) {
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
    };

    var createLogData = function(assetType) {
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
    };

    var createAsset = function(assetData, identifier, assetType) {
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
    };

    function getDefaultAsset () {
      
    };

    var getIdentifier = function(assetType) {
      var deferred = $q.defer();
      
      getAssets().then(function(result) {
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
    };

    var filterAssets = function(allAssets, assetType) {
      var deferred = $q.defer();
      // console.log(allAssets);
      // console.log(assetType);
      var assetsOfType = _.filter(allAssets, function(asset) {
          return asset.assetType === assetType;
      });
      // console.log(assetsOfType);
      deferred.resolve(assetsOfType);
      deferred.reject(new Error('Error filtering assets of type ' + assetType));
      return deferred.promise;
    };

    // Needs overhaul
    var getFormDataAndRepresentative = function(assetType) {
      var deferred = $q.defer();
      var formData = {};
      // console.log(assetType);
      getAssets().then(function(result) {
        filterAssets(result.data, assetType).then(function(assets) {
          if(typeof assets !== 'undefined') {
            if(assets.length > 0) {
              // console.log('there are assets of type ' + assetType);
              _.each(assets[0].data, function(data, field) {
                formData[field] = {
                  value: (field === 'assetType') ? assetType : null,
                  log: data.log,
                  dataType: data.dataType || null,
                  type: data.type || null,
                  expression: (data.type === 'function') ? data.expression : undefined,
                  expressionItems: (data.type === 'function') ? data.expressionItems : undefined,
                  leftExpressionItems: (data.type === 'inequality') ? data.leftExpressionItems : undefined,
                  rightExpressionItems: (data.type === 'inequality') ? data.rightExpressionItems : undefined,
                  inequalitySignId: (data.type === 'inequality') ? data.inequalitySignId : undefined,
                  leftExpression: (data.type === 'inequality') ? data.leftExpression : undefined,
                  rightExpression: (data.type === 'inequality') ? data.rightExpression : undefined,
                  inequalitySign: (data.type === 'inequality') ? data.inequalitySign : undefined,
                }
              });
              // console.log(formData);
              deferred.resolve({
                formData: formData,
                representativeData: assets[0].data
              });
              deferred.reject(new Error('Error initializing asset form data'));
            }
          } else {
            // console.log(result);
            // console.log('there are no assets of type ' + assetType);
            deferred.resolve({
              formData: { assetType: { value: assetType, log: false } },
              representativeData: {}
            });
            deferred.reject(new Error('Error initializing asset form data'));
          }
        });
      });
      
      return deferred.promise;
    };

    var belongsToType = function(asset, type) {
      return asset.assetType === type.value;
    };

    var invalidAssetType = function(formData) {
      return ((formData.assetType !== null) || (typeof formData.assetType === 'undefined'));
    };

    var getFieldsToBeLogged = function(assetType) {
      console.log(assetType);
      var deferred = $q.defer();
      var fields = [];
      getAssets().then(function(result) {
        filterAssets(result.data, assetType).then(function(assetsOfType) {
          console.log(assetType);
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
        });
      });

      return deferred.promise;
    };

    var updateIdentifier = function(assets, currentVal, newVal) {
      if(currentVal !== newVal) {
        _.each(assets, function(asset) {    
            asset.identifier = newVal;
            // console.log('updating identifier:',car);
            dataService.updateAsset(asset);
        });
      }

      $state.forceReload();
    };

    return {

      // Data
      getOrganizationId: getOrganizationId,
      getAssets: getAssets,
      getAssetsOfType: getAssetsOfType,
      getAssetTypes: getAssetTypes,
      saveAsset: saveAsset,
      update: update,
      createAsset: createAsset,
      deleteAsset: deleteAsset,
      thereAreAssetsOfType: thereAreAssetsOfType,
      _getFields: _getFields,
      getFields: getFields,
      getFormDataAndRepresentative: getFormDataAndRepresentative,
      belongsToType: belongsToType,
      invalidAssetType: invalidAssetType,
      getIdentifier: getIdentifier,
      getFieldsToBeLogged: getFieldsToBeLogged,
      updateIdentifier: updateIdentifier,
      filterAssets: filterAssets

    };
  });
