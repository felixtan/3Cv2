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

    var getFullName = function(assetData) {
      return assetData["First Name"].value + " " + assetData["Last Name"].value;
    };

    var thereAreAssetsOfType = function() {
      var deferred = $q.defer();
      getAssets().then(function(result) {
        var assets = _.filter(result.data, function(asset) {
            return asset.type.value === type;
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

    var notName = function(field) {
      return ((field !== "First Name") && (field !== "Last Name") && (field !== "fullName"));
    };

    var namesNotNull = function(assetData) {
      // console.log(assetData);
      return ((assetData["First Name"].value !== null) && (assetData["Last Name"].value !== null));
    };

    var updateFullName = function(assetData) {
      var deferred = $q.defer();

      assetData.fullName = {
        value: getFullName(assetData),
        log: false
      };

      deferred.resolve(assetData);
      deferred.reject(new Error('Failed to inject full name'));
      return deferred.promise;
    };

    var createAsset = function(assetData) {
      var deferred = $q.defer();
      updateFullName(assetData).then(function(assetDataWithFullName) {
        deferred.resolve({
          identifier: "fullName",
          data: assetDataWithFullName,
          organizationId: getOrganizationId()
        });
        
        deferred.reject(new Error('Error creating asset'));
      });

      return deferred.promise;
    };

    var getDefaultType = function() {
      var deferred = $q.defer();

      getAssetTypes().then(function(result) {
        var types = result.data[0].types;
        // console.log(types);
        var defaultType = _.find(types, function(status) { return status.special; });
        deferred.resolve(defaultType);
        deferred.reject(new Error('Error getting default asset status'));
      });

      return deferred.promise;
    };

    var getDefaultAsset = function() {
      var deferred = $q.defer();
      getDefaultType().then(function(defaultType) {
        deferred.resolve({
          identifier: "fullName",
          status: defaultType,
          data: {
            "First Name": {
              value: null,
              log: false
            },
            "Last Name": {
              value: null,
              log: false
            },
            fullName: {
              value: null,
              log: false
            },
            status: {
              value: defaultType.value,
              log: false
            }
          },
          organizationId: getOrganizationId()
        });

        deferred.reject(new Error('Error getting default asset.'));
      });

      return deferred.promise;
    };

    // Needs overhaul
    var getFormData = function() {
      // var deferred = $q.defer();
      // var formData = {};

      // thereAreAssets().then(function(ans) {
      //   if(ans) {
      //     console.log('there are assets');
      //     getAssets().then(function(result) {
      //       // console.log(result);
      //       var assetData = result.data[0].data;
      //       // console.log(asset);
      //       _.each(Object.keys(assetData), function(field) {
      //         formData[field] = {
      //           value: null,
      //           log: assetData[field].log
      //         }
      //       });
      //       deferred.resolve(formData);
      //       deferred.reject(new Error('Error initializing asset form data'));
      //     });
      //   } else {
      //     getDefaultAsset().then(function(defaultAsset) {
      //       console.log('there are no assets');
      //       deferred.resolve(defaultAsset.data);
      //       deferred.reject(new Error('Error initializing asset form data'));
      //     });
      //   }  
      // });
      
      // return deferred.promise;
    };

    var mapObject = function(objects, identifier) {
      return _.map(objects, function(object) {
          return {
              id: object.id,
              identifierValue: object.data[identifier].value
          };
      });
    };

    var belongsToType = function(asset, type) {
      return asset.type.value === type.value;
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
      notName: notName,
      namesNotNull: namesNotNull,
      getFullName: getFullName,
      updateFullName: updateFullName,
      getDefaultAsset: getDefaultAsset,
      getFormData: getFormData,
      getDefaultType: getDefaultType,
      belongsToType: belongsToType

    };
  });
