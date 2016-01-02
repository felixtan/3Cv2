'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectdataCtrl
 * @description
 * # ProspectdataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectDataCtrl', function ($q, $modal, $state, dataService, $scope, getProspect, getProspects, getProspectStatuses) {
    
    $scope.prospect = getProspect.data;
    $scope.prospectStatuses = getProspectStatuses.data[0];
    $scope.statuses = $scope.prospectStatuses.statuses;

    ///////////////////
    ///// Data UI /////
    ///////////////////

    $scope.notStatus = function(field) {
        return (field.toLowerCase() != "status");
    };

    String.prototype.capitalizeIfStatus = function() {
        return (this === 'status') ? (this.charAt(0).toUpperCase() + this.slice(1)) : this;
    };

    $scope.notNameOrStatus = function(field) {
        return ((field != "First Name") && (field != "Last Name") && (field !== "fullName") && (field.toLowerCase() != "status"));
    };

    $scope.getFields = function(prospect) {
        $scope.fields = Object.keys($scope.prospect.data);
        return $scope.fields;
    };
    $scope.getFields();

    $scope.statusChanged = false;
    $scope.status = $scope.prospect.status.value;
    $scope.setStatusChanged = function(statusName) {
        var prospect = $scope.prospect;
        if((prospect.status.value != statusName) 
            || (prospect.data.status.value != statusName)
            && (typeof statusName !== 'undefined') 
            && (statusName !== null)) {
            $scope.statusChanged = true;
            $scope.status = statusName;
        }
    };

    // when status name changes
    $scope.updateStatus = function(prospect) {
        console.log(prospect);
        var deferred = $q.defer();
        prospect.status.value = $scope.status;
        prospect.data.status.value = $scope.status;
        deferred.resolve(prospect);
        deferred.reject(new Error("Error updating status of prospect" + prospect.id));
        return deferred.promise;
    };

    // all other fields
    $scope.updateFieldValue = function(value, field) {
        var prospect = $scope.prospect;
        if((prospect.data[field].value != value) 
            && (typeof value !== 'undefined') 
            && (value !== null)) {
            prospect.data[field].value = value;
            prospect.data[field].log = false;

            if((field == 'First Name') || (field == 'Last Name')) {
                prospect.data.fullName.value = prospect.data["First Name"].value + " " + prospect.data["Last Name"].value;
            }
            // console.log(prospect);
        }
    };

    $scope.fieldNameChanged = false;
    $scope.newFieldName = null;
    $scope.currentFieldName = null;
    $scope.setFieldNameChanged = function(newName, currentName) {
        $scope.newFieldName = newName;
        $scope.currentFieldName = currentName;
        if((newName !== null) 
            && (typeof newName !== 'undefined') 
            && (currentName !== null) 
            && (typeof currentName !== 'undefined') 
            && (currentName != newName)) {
            $scope.fieldNameChanged = true;
        }
    };

    $scope.updateFieldName = function(prospect) {
        var deferred = $q.defer();
        prospect.data[$scope.newFieldName] = prospect.data[$scope.currentFieldName];
        delete prospect.data[$scope.currentFieldName];
        deferred.resolve(prospect);
        deferred.reject(new Error('Error updating prospect field name, id: ' + prospect.id));
        return deferred.promise;
    };

    // pass in prospect and data.name
    $scope.updateProspectName = function(prospect) {
        var deferred = $q.defer();
        prospect.data.fullName.value = prospect.data["First Name"].value + " " + prospect.data["Last Name"].value;
        deferred.resolve(prospect);
        deferred.reject(new Error('Error updating driver fullName, id: ' + prospect.id));
        return deferred.promise;
    };

    // Update
    $scope.save = function (data, field) {
        // console.log(data);
        // console.log($scope.fieldNameChanged);
        // console.log($scope.statusChanged);

        var prospects = getProspects.data;

        if($scope.fieldNameChanged) {
            _.each(prospects, function(prospect) {
                $scope.updateFieldName(prospect).then(function(prospectWithUpdatedFieldName) {
                    // console.log(prospectWithUpdatedFieldName);
                    dataService.updateProspect(prospectWithUpdatedFieldName);    
                    // if(prospectWithUpdatedFieldName.id == $scope.prospect.id) $state.forceReload();
                    $state.forceReload();
                });
            });
        } else if($scope.statusChanged) {
            $scope.updateStatus($scope.prospect).then(function(prospectWithUpdatedStatus) {
                // console.log(prospectWithUpdatedStatus);
                dataService.updateProspect(prospectWithUpdatedStatus);
                $state.forceReload();
            });
        } else {
            $scope.updateProspectName($scope.prospect).then(function(prospectWithUpdatedName) {
                dataService.updateProspect(prospectWithUpdatedName);
                $state.forceReload();
            })
        }
    };
  });
