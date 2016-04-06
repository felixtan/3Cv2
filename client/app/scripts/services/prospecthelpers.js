'use strict';

/**
 * @ngdoc service
 * @name clientApp.prospectHelpers
 * @description
 * # prospectHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
  .factory('prospectHelpers', function (ENV, $q, dataService, $state) {

    //////////////////////////
    //  Data CRUD and Forms //
    //////////////////////////

    var get = dataService.getProspects;
    var getById = dataService.getProspect;
    var saveProspect = dataService.createProspect;
    var update = dataService.updateProspect;
    var deleteProspect = dataService.deleteProspect;
    var getStatuses = dataService.getProspectStatuses;

    var getOrganizationId = function() {
      return (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x';
    };

    var getFullName = function(prospectData) {
      return prospectData["First Name"].value + " " + prospectData["Last Name"].value;
    };

    var thereAreProspects = function() {
      var deferred = $q.defer();
      get().then(function(result) {
        deferred.resolve((typeof result.data[0] !== 'undefined'));
        deferred.reject(new Error('Error determining if there are prospects.'));
      });
      return deferred.promise;
    };

    var _getFields = function() {
      var deferred = $q.defer();
      get().then(function(result) {
        deferred.resolve(Object.keys(result.data[0].data));
        deferred.reject(new Error('Failed to get fields'));
      });
      return deferred.promise;
    };

    var getFields = function(prospect) {
      return Object.keys(prospect.data); 
    };

    var notName = function(field) {
      return ((field !== "First Name") && (field !== "Last Name") && (field !== "Name"));
    };

    var namesNotNull = function(prospectData) {
      // console.log(prospectData);
      return ((prospectData["First Name"].value !== null) && (prospectData["Last Name"].value !== null));
    };

    var updateFullName = function(prospectData) {
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
    };

    var createProspect = function(prospectData) {
      var deferred = $q.defer();
      if(prospectData.assetType) delete prospectData.assetType;
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
    };

    var getDefaultStatus = function() {
      var deferred = $q.defer();

      getStatuses().then(function(result) {
        var statuses = result.data.statuses;
        // console.log(statuses);
        var defaultStatus = _.find(statuses, function(status) { return status.special; });
        deferred.resolve(defaultStatus);
        deferred.reject(new Error('Error getting default prospect status'));
      });

      return deferred.promise;
    };

    var getDefaultProspect = function() {
      return getDefaultStatus().then(function(defaultStatus) {
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
              }
            },
            organizationId: getOrganizationId(),
          }
        });
    };

    var getFormDataAndRepresentative = function() {
      var deferred = $q.defer();
      var formData = {};

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
                type: prospectData[field].type
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
            console.log('there are no prospects');
            deferred.resolve({
                formData: defaultProspect,
                representativeData: {}
            });
            deferred.reject(new Error('Error initializing prospect form data'));
          });
        }  
      });
      
      return deferred.promise;
    };

    var belongsToStatus = function(prospect, status) {
        return prospect.status.value === status.value;
    };

    return {

      // Data
      getOrganizationId: getOrganizationId,
      get: get,
      getById: getById,
      getStatuses: getStatuses,
      saveProspect: saveProspect,
      update: update,
      createProspect: createProspect,
      deleteProspect: deleteProspect,
      thereAreProspects: thereAreProspects,
      _getFields: _getFields,
      getFields: getFields,
      notName: notName,
      namesNotNull: namesNotNull,
      getFullName: getFullName,
      updateFullName: updateFullName,
      getDefaultProspect: getDefaultProspect,
      getFormDataAndRepresentative: getFormDataAndRepresentative,
      getDefaultStatus: getDefaultStatus,
      belongsToStatus: belongsToStatus

    };
  });
