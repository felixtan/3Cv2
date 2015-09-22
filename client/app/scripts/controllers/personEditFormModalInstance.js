'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:PersoneditformmodalinstanceCtrl
 * @description
 * # PersoneditformmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('PersonEditFormModalInstanceCtrl', function ($state, $http, $scope, $modalInstance, getPerson, getGasCards, getEzPasses, getCars) {
    $scope.formData = getPerson.data;
    $scope.typeOfPerson = getPerson.type;
    $scope.gasCards = getGasCards.data;
    $scope.ezPasses = getEzPasses.data;
    $scope.cars = getCars.data;
    $scope.prospectStatuses = ['Callers', 'Interviewed', 'Waiting List', 'Rejected'];

    $scope.submit = function() {
        var type = $scope.typeOfPerson.toLowerCase();   // driver or prospect
        var id = $scope.formData.id;

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
        }

        if(type === 'driver') {
            requestBody.payRate = $scope.formData.payRate;
            requestBody.ezPassId = $scope.formData.ezPass.id;
            requestBody.gasCardId = $scope.formData.gasCard.id;
            requestBody.carId = $scope.formData.car.id;
        } else if (type === 'prospect') {
            requestBody.status = $scope.formData.status.toLowerCase();
        } else {
            console.log('What type of person is this?!');
        }

        console.log('updating ' + type + ':', requestBody);

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
        $state.forceReload();
    };

    $scope.close = function() {
        $modalInstance.dismiss('cancel');
    };
  });
