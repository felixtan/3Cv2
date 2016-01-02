'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:NewprospectformmodalCtrl
 * @description
 * # NewprospectformmodalCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectFormModalCtrl', function ($state, ENV, $q, dataService, getProspectStatuses, getProspects, $scope, $modalInstance, $modal) {
    $scope.newFieldsThisSession = [];   // store new fields created this session
    $scope.prospects = getProspects.data;
    $scope.statuses = getProspectStatuses.data[0].statuses;

    $scope.getDefaultStatus = function() {
        return _.findWhere($scope.statuses, { special: true });
    };

    $scope.thereAreProspects = function() {
      return (typeof $scope.prospects[0] !== 'undefined');
    };
    
    $scope.getFields = function () {
      $scope.fields = [];
      if($scope.thereAreProspects()) {
        var prospect = $scope.prospects[0];
        $scope.fields = Object.keys(prospect.data);
      }
    };
    $scope.getFields();

    $scope.notNameOrStatus = function(field) {
      return ((field != "First Name") && (field != "Last Name") && (field != "fullName") && (field != "Status") && (field != "status"));
    };

    $scope.nameEntered = function() {
      return (($scope.formData["First Name"].value !== null) && ($scope.formData["Last Name"].value !== null));
    };

    $scope.initializeForm = function() {
      $scope.formData = {
        "First Name": {
          value: null,
          log: false
        },
        "Last Name": {
          value: null,
          log: false
        },
        status: {
            value: null,
            log: false
        }
      };
      
      if($scope.prospects.length > 0) {
        var prospect = $scope.prospects[0];
        $scope.fields = Object.keys(prospect.data);
        _.each($scope.fields, function(field) {
          if($scope.notNameOrStatus(field)) {
            $scope.formData[field] = {
              value: null,
              log: prospect.data[field].log
            }
          }
        });
      }
    };
    $scope.initializeForm();

    $scope.setNewField = function() {
      $scope.newField = {
        name: null,
        type: null
      };  
    };
    $scope.setNewField();

    $scope.addField = function() {
      var newField = $scope.newField.name;
      $scope.newFieldsThisSession.push(newField);

      $scope.formData[newField] = {
        value: null,
        log: false
      };

      $scope.setNewField();

      if($scope.thereAreProspects()) {
        // add field to other prospects
        var prospects = $scope.prospects;

        _.each(prospects, function(prospect) {
          if(!(_.has(prospect.data, newField))) {
            // since log is set to false here, 
            // IMPORTANT to make sure it's updated 
            // for each prospect when prospectForm is submitted
            prospect.data[newField] = {
              log: false,
              value: null
            }

            dataService.updateProspect(prospect);
          }
        });
      }
    };

    $scope.addFullName = function(formData) {
      var prospectData = formData;
      prospectData.fullName = {
        value: (formData["First Name"].value + " " + formData["Last Name"].value),
        log: false
      };

      return prospectData;
    };

    // pass in $scope.formData
    $scope.newProspect = function(prospectData) {
      var deferred = $q.defer();
      var prospect = {
        identifier: "fullName",
        data: $scope.addFullName(prospectData),
        status: $scope.formData.status || getDefaultStatus().value,
        organizationId: (ENV.name === ('production' || 'staging')) ? $scope.user.customData.organizationId : '3Qnv2pMAxLZqVdp7n8RZ0x'
      };
      
      deferred.resolve(prospect);
      deferred.reject(new Error('Error creating new prospect object'));
      return deferred.promise;
    };

    $scope.submit = function () {
      var promise = $scope.newProspect($scope.formData);
      promise.then(function(prospect) {
        // console.log(prospect);
        dataService.createProspect(prospect).then(function(newProspect) {
          $scope.prospects.push(newProspect.data);
        });
      });
      
      $scope.reset();
    };

    $scope.reset = function () {
      $scope.initializeForm();
    };

    $scope.close = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.openDeleteFieldModal = function (size, thing) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/deletefieldmodal.html',
            controller: 'DeleteFieldModalInstanceCtrl',
            size: size,
            resolve: {
                thing: function() {
                    return thing;   // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ $scope.fields or $scope.dates
                },
                getProspects: function(dataService) {
                    return dataService.getProspects();
                },
                getCars: function() { 
                    return []; 
                },
                getDrivers: function() {
                    return [];
                }
            }
        });

        modalInstance.result.then(function (field) {
            if(typeof field !== 'undefined') delete $scope.formData[field];
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };
});
 
