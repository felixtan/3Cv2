'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:ProspectdataCtrl
 * @description
 * # ProspectdataCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('ProspectDataCtrl', function ($modal, $state, dataService, $scope, getProspect, getProspects, getProspectStatuses) {
    
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

    // when status name changes
    $scope.updateStatusInProspect = function(statusName) {
        var prospect = $scope.prospect;
        if((prospect.status.value != statusName) 
            || (prospect.data.status.value != statusName)
            && (typeof statusName !== 'undefined') 
            && (statusName !== null)) {
                prospect.status.value = statusName;
                prospect.data.status.value = statusName;
            // console.log(prospect);
        }
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

    $scope.newFieldName = null;
    $scope.oldFieldName = null;
    $scope.queueUpdateFieldName = function(newName, oldName) {        
        $scope.newFieldName = newName;
        $scope.oldFieldName = oldName;
    };

    $scope.validFieldNameChange = function() {
        if(($scope.newFieldName !== null) 
            && (typeof $scope.newFieldName !== 'undefined') 
            && ($scope.oldFieldName !== null) 
            && (typeof $scope.oldFieldName !== 'undefined') 
            && ($scope.oldFieldName !== $scope.newFieldName)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.updateFieldName = function() {
        var prospect = $scope.prospect;
        prospect.data[$scope.newFieldName] = prospect.data[$scope.oldFieldName];
        delete prospect.data[$scope.oldFieldName];
        // console.log('name replaced:', prospect);
    };

    $scope.updateOtherProspects = function() {
        var prospects = getProspects.data;
        prospects.forEach(function(prospect) {
            if(prospect.id != $scope.prospect.id) {
                prospect.data[$scope.newFieldName] = prospect.data[$scope.oldFieldName];
                delete prospect.data[$scope.oldFieldName];
                dataService.updateProspect(prospect);
            }
        });
    };

    // Update
    $scope.save = function (data, field) {
        // console.log(data.value);     // stores new value of field
        // console.log($scope.prospect);   // already updated? -> yes due to onbeforesave

        if($scope.validFieldNameChange()) {
            $scope.updateFieldName();
            $scope.updateOtherProspects();
        }
        
        // console.log('saving this:', $scope.prospect);
        dataService.updateProspect($scope.prospect);
        $state.forceReload();
    };
  });
