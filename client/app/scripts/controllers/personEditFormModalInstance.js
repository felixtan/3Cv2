'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PersoneditformmodalinstanceCtrl
 * @description
 * # PersoneditformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PersonEditFormModalInstanceCtrl', function ($http, $scope, $modalInstance, getPerson, getGasCards, getEzPasses, getCars, $state) {
    $scope.formData = getPerson.data;
    $scope.typeOfPerson = getPerson.type;
    $scope.gasCards = getGasCards.data;
    $scope.ezPasses = getEzPasses.data;
    $scope.cars = getCars.data;
    $scope.prospectStatuses = ['Callers', 'Interviewed', 'Waiting List', 'Rejected'];

    $scope.submit = function() {
        var type = $scope.typeOfPerson.toLowerCase();   // driver or prospect
        var id = $scope.formData.id;

        if($scope.formData.middleInitial) { $scope.formData.middleInitial = $scope.formData.middleInitial.toUpperCase(); }
        if($scope.formData.givenName) { $scope.formData.givenName = $scope.formData.givenName.charAt(0).toUpperCase() + $scope.formData.givenName.substr(1).toLowerCase(); } 
        if($scope.formData.surName) { $scope.formData.surName = $scope.formData.surName.charAt(0).toUpperCase() + $scope.formData.surName.substr(1).toLowerCase(); }

        // building the request body
        var requestBody = {
            // fields in common
            givenName: $scope.formData.givenName,
            middleInitial: $scope.formData.middleInitial,
            surName: $scope.formData.surName,
            driversLicenseNum: $scope.formData.driversLicenseNum,
            phoneNumber: $scope.formData.phoneNumber,
            email: $scope.formData.email,
            address: $scope.formData.address,
            tlc: $scope.formData.tlc,
            dmv: $scope.formData.dmv,
            points: $scope.formData.points,
            accidents: $scope.formData.accidents,
            shift: $scope.formData.shift,
            paperwork: $scope.formData.paperwork,
            description: $scope.formData.description
        };

        if(type === 'driver') {
            if($scope.formData.payRate) { requestBody.payRate = $scope.formData.payRate.toString(); }
            if($scope.formData.ezPassId) { requestBody.ezPassId = $scope.formData.ezPass.id; }
            if($scope.formData.gasCardId) { requestBody.gasCardId = $scope.formData.gasCard.id; }
            if($scope.formData.carId) { requestBody.carId = $scope.formData.car.id; }
        } else if (type === 'prospect') {
            if($scope.formData.status) { requestBody.status = $scope.formData.status.toLowerCase(); }
        } else {
            console.error('What type of person is this?!');
        }

        // Fire the update request
        $http.put('/api/' + type + 's/' + id, requestBody).then(function() {
            $scope.close();
            setTimeout(function() { $state.forceReload(); }, 1000);
        }, function(err) {
            console.error(err);
        });
    };

    $scope.reset = function() {
        $scope.formData = getPerson.data;
        $scope.personEditForm.$setPristine();
        $scope.personEditForm.$setUntouched();
    };

    $scope.close = function() {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
