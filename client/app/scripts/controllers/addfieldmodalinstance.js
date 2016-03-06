'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalinstanceCtrl
 * @description
 * # AddfieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalInstanceCtrl', function ($q, $state, getAssets, getCars, getDrivers, getProspects, $scope, $modalInstance, dataService) {
    
    // var mexp = 
    $scope.formData = {};
    $scope.objects = [];
    $scope.objectType = null;
    $scope.assetType = null;
    $scope.update = function(object) { return; };
    $scope.fields = [];
    $scope.functionFieldSelect = { value: null };
    $scope.functionConstantInput = { value: null };

    $scope.functionItems = [];
    var testExpressionItems = [];
    $scope.validFunction = true;      // this will depend on results from mexp
    
    var testExpression = "";       // passed into mexp for validation, fields will be replaced with 1
    $scope.expressionErrorMessage;
    
    function validateExpression() {
      $scope.expressionErrorMessage = undefined;

      try {
        mexp.eval(testExpression);
      } catch(e){
        console.error(e);
        $scope.validFunction = false;
        $scope.expressionErrorMessage = e.message;
      }

      // set $scope.validFunction
    };

    function buildExpression() {
      $scope.field.expression = $scope.functionItems.join('');
      testExpression = testExpressionItems.join('');

      $scope.validFunction = true;
      validateExpression();
    }

    /*
      Type of field     Data type 
      -------------     ---------
      text              text
      number            number
      boolean           boolean
      function          number
      inequality        boolean
    */

    $scope.field = {  // when this value changes, the UI dynamically changes
      name: null,
      type: null,
      dataType: null,
      expression: ""
    };

    $scope.setDataType = function(field) {
      switch(field.type) {
        case "text":
          $scope.field.dataType = "text";
          break;
        case "number":
          $scope.field.dataType = "number";
          break;
        case "boolean":
          $scope.field.dataType = "boolean";
          break;
        case "function":
          $scope.field.dataType = "number";
          break;
        case "inequality":
          $scope.field.dataType = "boolean";
          break;
        default:
          $scope.field.dataType = undefined;
          break;
      }
    };

    $scope.invalidFieldType = function() {
      return (($scope.field.type === null) || (typeof $scope.field.type === 'undefined') || ($scope.field.dataType === null) || (typeof $scope.field.dataType === 'undefined'));
    };

    /*
      Type of items     Additonal actions 
      -------------     -----------------
      operator          ?
      constant          none
      field             replace with 1 for testExpression
    */
    $scope.appendItemToFunction = function(item, typeOfItem) {
      $scope.functionItems.push(item);

      // append to testExpression
      if(typeOfItem === "field") {
        testExpressionItems.push('1');
      } else {
        testExpressionItems.push(item);
      }

      // build testExpression
      buildExpression();

      // resetting
      $scope.functionFieldSelect.value = null;
      $scope.functionConstantInput.value = null;
    };

    $scope.undoFunction = function() {
      if($scope.functionItems.length) {
        var item = $scope.functionItems[$scope.functionItems.length-1];
        console.log('removed:', item);
        $scope.functionItems.pop();
        testExpressionItems.pop();
        buildExpression();
      }
    };

    $scope.clearFunction = function() {
      $scope.field.expression = "";
      testExpression = "";
      $scope.functionItems = [];
      testExpressionItems = [];
    };

    if($state.includes('carProfile') || $state.includes('dashboard.cars')) {
      console.log("add field modal called from carProfile");
      $scope.objects = getCars.data;
      $scope.objectType = 'car';
      $scope.update = dataService.updateCar;
    } else if($state.includes('driverProfile') || $state.includes('dashboard.drivers')) {
      console.log("add field modal called from driverProfile");
      $scope.objects = getDrivers.data;
      $scope.objectType = 'driver';
      $scope.update = dataService.updateDriver;
    } else if($state.includes('prospectProfile') || $state.includes('dashboard.prospects')) {
      console.log("add field modal called from prospectProfile");
      $scope.objects = getProspects.data;
      $scope.objectType = 'prospect';
      $scope.update = dataService.updateProspect;
    } else if($state.includes('assetProfile') || $state.includes('dashboard.assets')) {
      console.log("add field modal called from assetProfile");
      $scope.assetType = getAssets.type;
      $scope.objects = _.filter(getAssets.data, function(asset) { return asset.assetType === $scope.assetType; });
      $scope.objectType = 'asset';
      $scope.update = dataService.updateAsset;
    } else {
      console.log('add field modal called from invalid state', $state.current);
    }

    // General post-processing regardless of object
    $scope.fields = $scope.objects[0] ? (Object.keys($scope.objects[0].data)) : [];
    // $scope.numberFields = $scope.objects[0] ? (_.filter(Object.keys($scope.objects[0].data), function(field) { return $scope.objects[0].data[field].dataType === 'number'; });) : [];

    function createNewFieldData(field) {
      var deferred = $q.defer();
      console.log(field.expression);
      if((field.type === 'function' || field.type === 'inequality')) {
        console.log('it has an expression');
        console.log(((field.type === 'function' || field.type === 'inequality') ? field.expression : undefined));
        console.log(typeof field.expression);
      } else {
        console.log('it has NOOO expression');
        console.log(((field.type === 'function' || field.type === 'inequality') ? field.expression : undefined));
      }

      deferred.resolve({
        value: null,
        log: $scope.formData.log || false,
        dataType: field.dataType,
        type: field.type,
        expression: ((field.type === 'function' || field.type === 'inequality') ? field.expression : undefined)
      });
      deferred.reject(new Error('Error creating new field data'));
      return deferred.promise;
    };

    function appendNewFieldDataToEachObject(fieldName, fieldDataObj) {
      var deferred = $q.defer();
      console.log(fieldName);
      console.log(fieldDataObj);
      deferred.resolve(_.each($scope.objects, function(object) {
          // add field to each object
          object.data[fieldName] = fieldDataObj;
      }));
      deferred.reject(new Error('Error updating all objects'));
      return deferred.promise;
    };

    function updateObjects(objectsToUpdate) {
      var deferred = $q.defer();
      console.log(objectsToUpdate);
      deferred.resolve(_.each(objectsToUpdate, function(object) {
        $scope.update(object);
      }));
      deferred.reject(new Error('Error updating objects'));
      return deferred.promise;
    };

    $scope.submit = function(field) {
      var field = {};
      angular.copy($scope.field, field);

      createNewFieldData(field).then(function(fieldDataObj) {
        appendNewFieldDataToEachObject(field.name, fieldDataObj).then(function(objectsToUpdate) {
          updateObjects(objectsToUpdate).then(function(updatedObjects) {
            $scope.ok($scope.field.name);
          });
        });
      });
    };

    $scope.reset = function () {
      $scope.formData = {};
      $scope.form.$setPristine();
      $scope.form.$setUntouched();
      $state.forceReload();
    };

    $scope.ok = function(newField) {
      $modalInstance.close(newField)
      $state.forceReload();
    };

    $scope.close = function () {
        $state.forceReload();
        $modalInstance.dismiss('cancel');
    };
  });
