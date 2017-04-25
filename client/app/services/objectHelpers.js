(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name clientApp.objectHelpers
   * @description
   * # objectHelpers
   * Factory in the clientApp.
   */
  angular.module('clientApp')
      .factory('objectHelpers', ['$rootScope', 'ENV', '$q', 'dataService', '$state', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '_',
      function($rootScope, ENV, $q, dataService, $state, carHelpers, driverHelpers, prospectHelpers, assetHelpers, _) {

          return {
              isValid                                   : isValid,
              simplify                                  : simplify,
              simplifyOne                               : simplifyOne,
              updateDataIfFieldNameChanged              : updateDataIfFieldNameChanged,
              getFormDataAndReference                   : getFormDataAndReference,
              getIdentifierValue                        : getIdentifierValue,
              getStateRef                               : getStateRef,
              convertArrayLikeObjToArrayOfObj           : convertArrayLikeObjToArrayOfObj,
              convertArrayOfObjToArrayLikeObj           : convertArrayOfObjToArrayLikeObj
          };

          function convertArrayLikeObjToArrayOfObj(obj) {
            return _.reduce(obj, function(memo, v, k) {
              memo[k] = v;
              return memo;
            }, []);
          }

          function convertArrayOfObjToArrayLikeObj(arr) {
            return _.reduce(arr, function(memo, v) {
              memo[memo.length++] = v;
              return memo;
            }, { length: 0 });
          }

          /**
           * view is a String; either 'Data' or 'Logs'
           */
          function getStateRef(objectType, objectId, view) {
            return objectType + view + "({id:" + objectId + "})"
          }

          function getIdentifierValue(object) {
            var identifier = object.identifier
            return object.data[identifier].value
          }

          function isValid (value) {
              return value !== null && typeof value !== "undefined";
          }

          function simplify (objects) {
              return _.map(objects, function(object) {
                  return {
                      id: object.id,
                      identifier: object.identifier,
                      identifierValue: object.data[object.identifier].value,
                      assetType: (isValid(object.assetType) && (typeof object.assetType === 'string')) ? object.assetType : null,
                  };
              });
          }

          function simplifyOne (object) {
              return {
                  id: object.id,
                  identifier: object.identifier,
                  identifierValue: object.data[object.identifier].value,
                  assetType: (isValid(object.assetType) && (typeof object.assetType === 'string')) ? object.assetType : null,
              };
          }

          function updateDataIfFieldNameChanged (oldName, newName, object) {
              if(oldName !== newName) {
                  object.data[newName] = object.data[oldName];
                  delete object.data[oldName];
              }

              return object;
          }

          /*
              Used when creating a new field
          */
          function getFormDataAndReference (objectType, assetType) {
              var deferred = $q.defer(),
                  objectData,
                  formData = {},
                  get,
                  getDefaultObject,
                  object;

              if (objectType === 'car') {
                  get = carHelpers.get;
                  getDefaultObject = carHelpers.getDefaultCar;
              } else if (objectType === 'driver') {
                  get = driverHelpers.get;
                  getDefaultObject = driverHelpers.getDefaultDriver;
              } else if (objectType === 'prospect') {
                  get = prospectHelpers.get;
                  getDefaultObject = prospectHelpers.getDefaultProspect;
              } else if (objectType === 'asset') {
                  get = assetHelpers.getByType;
                  getDefaultObject = assetHelpers.getDefaultAsset;
              } else {
                  deferred.reject(undefined);
              }

              get(assetType).then(function(result) {
                  if(isValid(result.data)) {
                      if(result.data.length > 0) {
                          object = result.data[0];
                          objectData = object.data;

                          _.each(objectData, function(data, field, list) {
                              // console.log(data);
                              // console.log(field);
                              // console.log(list);
                              formData[field] = {
                                  value: (data.type === 'boolean') ? false : null,
                                  log: data.log,
                                  dataType: data.dataType,
                                  type: data.type,
                              };
                          });

                          deferred.resolve({
                              formData: formData,
                              referenceObject: object,
                          });
                          deferred.reject(new Error('Error initializing form data for ' + objectType));
                      } else {
                          getDefaultObject(assetType).then(function(result) {
                              // console.log(result);
                              deferred.resolve({
                                  formData: result.data,
                                  referenceObject: result,
                              });
                              deferred.reject(new Error('Error initializing form data for ' + objectType));
                          });
                      }
                  } else {
                      getDefaultObject(assetType).then(function(result) {
                          // console.log(result);
                          deferred.resolve({
                              formData: result.data,
                              referenceObject: result,
                          });
                          deferred.reject(new Error('Error initializing form data for ' + objectType));
                      });
                  }
              });

              // deferred.reject(new Error('Error initializing form data for ' + objectType));
              return deferred.promise;
          }
      }]);
})();
