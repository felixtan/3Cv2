(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name clientApp.prospectHelpers
   * @description
   * # prospectHelpers
   * Factory in the clientApp.
   */
  angular.module('clientApp')
    .factory('prospectHelpers', ['$rootScope', '$q', 'dataService', '_', 'ENV', function ($rootScope, $q, dataService, _, ENV) {

      //////////////////////////
      //  Data CRUD and Forms //
      //////////////////////////

      var get = dataService.getProspects;
      var getById = dataService.getProspect;
      var saveProspect = dataService.createProspect;
      var update = dataService.updateProspect;
      var deleteProspect = dataService.deleteProspect;
      var getStatuses = dataService.getProspectStatuses;
      var updateStatuses = dataService.updateProspectStatuses;

      return {
        getOrganizationId             : getOrganizationId,
        get                           : get,
        getById                       : getById,
        getStatuses                   : getStatuses,
        saveProspect                  : saveProspect,
        update                        : update,
        updateStatuses                : updateStatuses,
        createProspect                : createProspect,
        deleteProspect                : deleteProspect,
        thereAreProspects             : thereAreProspects,
        _getFields                    : _getFields,
        getFields                     : getFields,
        notName                       : notName,
        namesNotNull                  : namesNotNull,
        getFullName                   : getFullName,
        updateFullName                : updateFullName,
        getDefaultProspect            : getDefaultProspect,
        getFormDataAndRepresentative  : getFormDataAndRepresentative,
        getDefaultStatus              : getDefaultStatus,
        belongsToStatus               :  belongsToStatus,
      }

      function isValid(value) {
          return value !== null && typeof value !== "undefined";
      }

      function getOrganizationId() {
        return (ENV.name === ('production' || 'staging')) ? $rootScope.user.customData.organizationId : ENV.stormpathConfig.organizationId;
      }

      function getFullName(prospectData) {
        return prospectData["First Name"].value + " " + prospectData["Last Name"].value;
      }

      function thereAreProspects() {
        var deferred = $q.defer();
        get().then(function(result) {
          deferred.resolve((typeof result.data[0] !== 'undefined'));
          deferred.reject(new Error('Error determining if there are prospects.'));
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

      function getFields(prospect) {
        return Object.keys(prospect.data);
      }

      function notName(field) {
        return ((field !== "First Name") && (field !== "Last Name") && (field !== "Name"));
      }

      function namesNotNull(prospectData) {
        // console.log(prospectData);
        return ((prospectData["First Name"].value !== null) && (prospectData["Last Name"].value !== null));
      }

      function updateFullName(prospectData) {
        prospectData.Name = {
          value: getFullName(prospectData),
          log: false,
          dataType: 'text',
        }

        return prospectData;
      }

      function createProspect(prospectData) {
        var deferred = $q.defer();

        if(prospectData.assetType) {
          delete prospectData.assetType;
        }

        var data = updateFullName(prospectData);

        deferred.resolve({
          identifier: "Name",
          status: data.status.value,
          data: data,
          organizationId: getOrganizationId(),
        });
        return deferred.promise;
      }

      function getDefaultStatus() {
        var deferred = $q.defer();

        getStatuses().then(function(result) {
          if(isValid(result.data)) {

            if(result.data.statuses.length > 0) {

              var statuses = result.data.statuses;

              var defaultStatus = _.find(statuses, function(status) {
                return status.special;
              });

              deferred.resolve(defaultStatus);
              deferred.reject(new Error('Error getting default prospect status'));

            } else {
              deferred.reject(new Error('Error getting default prospect status: no statuses'));
            }

          } else {
            deferred.reject(new Error('Error getting default prospect status: return from getStatuses undefined'));
          }
        });

        return deferred.promise;
      }

      function getDefaultProspect() {
        return getDefaultStatus().then(function(defaultStatus) {
          // console.log(defaultStatus);
          return {
              identifier: "Name",
              status: defaultStatus,
              data: {
                "First Name": {
                  value: null,
                  log: false,
                  dataType: 'text',
                },
                "Last Name": {
                  value: null,
                  log: false,
                  dataType: 'text',
                },
                'Name': {
                  value: null,
                  log: false,
                  dataType: 'text',
                },
                status: {
                  value: defaultStatus.value,
                  log: false,
                  dataType: 'text',
                },
              },
              organizationId: getOrganizationId(),
            }
        });
      }

      function getFormDataAndRepresentative() {
        var deferred = $q.defer();
        var formData = {}

        thereAreProspects().then(function(ans) {
          if(ans) {
            console.log('there are prospects');
            get().then(function(result) {
              // console.log(result);
              var prospectData = result.data[0].data;
              // console.log(prospect);
              _.each(Object.keys(prospectData), function(field) {
                formData[field] = {
                  value: null,
                  log: prospectData[field].log,
                  dataType: prospectData[field].dataType,
                }
              });
              deferred.resolve({
                formData: formData,
                representativeData: prospectData
              });
              deferred.reject(new Error('Error initializing prospect form data'));
            });
          } else {
            getDefaultProspect().then(function(defaultProspect) {
              // console.log('there are no prospects');
              deferred.resolve({
                  formData: defaultProspect.data,
                  representativeData: defaultProspect,
              });
              deferred.reject(new Error('Error initializing prospect form data'));
            });
          }
        });

        return deferred.promise;
      }

      function belongsToStatus(prospect, status) {
          return prospect.status.value === status.value;
      }
    }]);
})();
