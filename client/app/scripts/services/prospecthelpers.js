'use strict';

/**
 * @ngdoc service
 * @name clientApp.prospectHelpers
 * @description
 * # prospectHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('prospectHelpers', function ($rootScope, $window, ENV, $q, dataService) {

    var _ = $window._,
        getStatuses = dataService.getProspectStatuses;

    //////////////////////////
    //  Data CRUD and Forms //
    //////////////////////////

    function isValid (value) {
        return value !== null && typeof value !== "undefined";
    }

    function getOrganizationId () {
      return (ENV.name === ('production' || 'staging')) ? $rootScope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
    }

    function getFullName (prospectData) {
      return prospectData["First Name"].value + " " + prospectData["Last Name"].value;
    }

    function namesNotNull (prospectData) {
      // console.log(prospectData);
      return ((prospectData["First Name"].value !== null) && (prospectData["Last Name"].value !== null));
    }

    function updateFullName (prospectData) {
      var deferred = $q.defer();

      prospectData['Name'] = {
        value: getFullName(prospectData),
        log: false,
        dataType: 'text',
        type: 'text'
      };

      deferred.resolve(prospectData);
      deferred.reject(new Error('Failed to inject full name'));
      return deferred.promise;
    }

    function createProspect (prospectData) {
      var deferred = $q.defer();
      
      if(prospectData.assetType) {
        delete prospectData.assetType;
      }

      updateFullName(prospectData).then(function(prospectDataWithFullName) {
        deferred.resolve({
          identifier: "Name",
          status: prospectDataWithFullName.status.value,
          data: prospectDataWithFullName,
          organizationId: getOrganizationId()
        });
        
        deferred.reject(new Error('Error creating prospect'));
      });

      return deferred.promise;
    }

    function getDefaultStatus () {
      var deferred = $q.defer(),
          statuses,
          defaultStatus;

      getStatuses().then(function(result) {
        if(isValid(result.data)) {
          if(result.data.statuses.length > 0) {
            statuses = result.data.statuses;
            defaultStatus = _.find(statuses, function(status) { return status.special; });
            
            deferred.resolve(defaultStatus);
            deferred.reject(new Error('Error getting default prospect status'));
          } else {
            // deferred.resolve(undefined);
            deferred.reject(new Error('Error getting default prospect status: no statuses'));
          }

        } else {
          // deferred.resolve(undefined);
          deferred.reject(new Error('Error getting default prospect status: return from getStatuses undefined'));
        }
      });

      return deferred.promise;
    }

    function getDefaultProspect () {
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
                type: 'text'
              },
              "Last Name": {
                value: null,
                log: false,
                dataType: 'text',
                type: 'text'
              },
              'Name': {
                value: null,
                log: false,
                dataType: 'text',
                type: 'text'
              },
              status: {
                value: defaultStatus.value,
                log: false,
                dataType: 'text',
                type: 'text'
              },
            },
            organizationId: getOrganizationId(),
          };
      });
    }

    function belongsToStatus (prospect, status) {
        return prospect.status.value === status.value;
    }

    return {
      // Data
      getOrganizationId: getOrganizationId,
      get: dataService.getProspects,
      getById: dataService.getProspect,
      getStatuses: dataService.getProspectStatuses,
      save: dataService.createProspect,
      update: dataService.updateProspect,
      updateStatuses: dataService.updateProspectStatuses,
      createProspect: createProspect,
      deleteProspect: dataService.deleteProspect,
      namesNotNull: namesNotNull,
      getFullName: getFullName,
      updateFullName: updateFullName,
      getDefaultProspect: getDefaultProspect,
      getDefaultStatus: getDefaultStatus,
      belongsToStatus: belongsToStatus
    };
  });
