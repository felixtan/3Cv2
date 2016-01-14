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
    var saveAsset = dataService.createAsset;
    var updateAsset = dataService.updateAsset;
    var deleteAsset = dataService.deleteAsset;
    var getAssetTypes = dataService.getAssetTypes;

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

    var createAsset = function(assetData, identifier, assetType) {
      var deferred = $q.defer();

      deferred.resolve({
        identifier: identifier,
        assetType: assetType,
        data: assetData,
        logs: [],
        driversAssigned: [],
        organizationId: getOrganizationId()
      });
      
      deferred.reject(new Error('Error creating asset of type ' + assetData.assetType.value));

      return deferred.promise;
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

    // Needs overhaul
    var getFormData = function(assetType) {
      var deferred = $q.defer();
      var formData = {};
      
      getAssets().then(function(result) {
        if(result.data.length) {
          // console.log('there are assets of type ' + assetType);
          var assets = _.filter(result.data[0], function(asset) {
            return (asset.assetType === assetType);
          });

          _.each(Object.keys(assets), function(field) {
            formData[field] = {
              value: ((field === 'assetType') ? assetType : null),
              log: asset.data[field].log
            }
          });

          deferred.resolve(formData);
          deferred.reject(new Error('Error initializing asset form data'));
        } else {
          // console.log(result);
          // console.log('there are no assets of type ' + assetType);
          deferred.resolve({ assetType: { value: assetType, log: false } });
          deferred.reject(new Error('Error initializing asset form data'));
        }
      });
      
      return deferred.promise;
    };

    var mapObject = function(objects, identifier) {
      return _.map(objects, function(object) {
          return {
              id: object.id,
              identifierValue: object.data[object.identifier].value,
              assetType: object.assetType
          };
      });
    };

    var belongsToType = function(asset, type) {
      return asset.assetType === type.value;
    };

    var invalidAssetType = function(formData) {
      return ((formData.assetType.value !== null) || (typeof formData.assetType.value === 'undefined'));
    };

    return {

      // Data
      mapObject: mapObject,
      getOrganizationId: getOrganizationId,
      getAssets: getAssets,
      getAssetTypes: getAssetTypes,
      saveAsset: saveAsset,
      updateAsset: updateAsset,
      createAsset: createAsset,
      deleteAsset: deleteAsset,
      thereAreAssetsOfType: thereAreAssetsOfType,
      _getFields: _getFields,
      getFields: getFields,
      getFormData: getFormData,
      belongsToType: belongsToType,
      invalidAssetType: invalidAssetType,
      getIdentifier: getIdentifier

    };
  });
