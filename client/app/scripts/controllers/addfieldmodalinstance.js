'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AddfieldmodalinstanceCtrl
 * @description
 * # AddfieldmodalinstanceCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('AddFieldModalInstanceCtrl', function ($state, getAssets, getCars, getDrivers, getProspects, $scope, $modalInstance, dataService) {
    
    // var mexp = 
    $scope.formData = {};
    $scope.objects = [];
    $scope.objectType = null;
    $scope.assetType = null;
    $scope.update = function(object) { return; };
    $scope.fields = [];
    $scope.functionFieldSelect = { value: null };
    $scope.functionConstantInput = { value: null };
    $scope.indicesBeforeAppendingLastItem = []
    $scope.functionItems = [];

    $scope.indicesOfOpeningParens = [];
    $scope.unmatchedOpeningParens = 0;

    /*
      Type of field     Data type 
      -------------     ---------
      text              text
      number            number
      function          number
      inequality        boolean
    */

    $scope.field = {  // when this value changes, the UI dynamically changes
      name: null,
      type: null,
      dataType: null,
      expression: null
    };

    $scope.setDataType = function(field) {
      switch(field.type) {
        case "text":
          $scope.field.dataType = "text";
          break;
        case "number":
          $scope.field.dataType = "number";
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

      // console.log($scope.field);
      var exp = "1/(2+8)*2";
      var value = mexp.eval(exp);
      console.log(value);
    };

    $scope.invalidFieldType = function() {
      return (($scope.field.type === null) || (typeof $scope.field.type === 'undefined') || ($scope.field.dataType === null) || (typeof $scope.field.dataType === 'undefined'));
    };

    $scope.appendItemToFunction = function(item) {
      if($scope.isOpeningParens(item)) {
        $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens + 1;
        $scope.indicesOfOpeningParens.push($scope.field.function.length);
      }
      
      if($scope.isClosingParens(item) && ($scope.unmatchedOpeningParens > 0)) {
        $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens - 1;
      }

      $scope.indicesBeforeAppendingLastItem.push($scope.field.function.length);   // keeps memory of function string before appending the op
      $scope.field.function = $scope.field.function + item;
      $scope.functionItems.push(item);
      $scope.functionFieldSelect.value = null;
      $scope.functionConstantInput.value = null;
      $scope.validFunction();
    };

    $scope.undoFunction = function() {
      if($scope.indicesBeforeAppendingLastItem.length) {
        var item = $scope.functionItems[$scope.functionItems.length-1];
        console.log(item);
        if($scope.isOpeningParens(item)) $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens - 1;
        if($scope.isClosingParens(item)) $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens + 1;
        $scope.field.function = $scope.field.function.substr(0, $scope.indicesBeforeAppendingLastItem[$scope.indicesBeforeAppendingLastItem.length-1]);
        $scope.indicesBeforeAppendingLastItem.pop();
        $scope.functionItems.pop();
        $scope.validFunction();
      }
    };

    $scope.clearFunction = function() {
      $scope.field.function = '';
      $scope.indicesBeforeAppendingLastItem = [];
      $scope.indicesOfOpeningParens = [];
      $scope.unmatchedOpeningParens = 0;
      $scope.functionItems = [];
      $scope.validFunction();
    };

    $scope.validDataType = function(dataType) {
      // console.log(dataType);
      return ((dataType === "number") && (dataType !== null) && (typeof dataType !== "undefined"));
    };

    $scope.isOperator = function(item) {
      return ((item === '+') || (item === '-') || (item === '*') || (item === '/')) ? true : false;
    };

    $scope.isParens = function(item) {
      return ((item === '(') || (item === ')'));
    };

    $scope.isOpeningParens = function(item) {
      return (item === '(');
    };

    $scope.isClosingParens = function(item) {
      return (item === ')');
    };

    $scope.parens = function() {
      var lastItem = ($scope.functionItems.length) ? $scope.functionItems[$scope.functionItems.length-1] : undefined;
      if($scope.isOpeningParens(lastItem) || (typeof lastItem === 'undefined')) {
        $scope.appendItemToFunction('(');
        $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens + 1;
      } else if($scope.isOperator(lastItem)) {
        $scope.appendItemToFunction('(');
        $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens + 1;
      } else {    // if it's a value or closing parens
        if($scope.unmatchedOpeningParens >= 1) {
          $scope.appendItemToFunction('(');
          $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens - 1;  
        } else {
          $scope.appendItemToFunction('*');
          $scope.appendItemToFunction('(');
          $scope.unmatchedOpeningParens = $scope.unmatchedOpeningParens + 1;
        }
      }
    };

    // Method: 
    //  1. For each math operator in the function, if the previous or following item is also an operator 
    //  or is undefined (operator at the beginning or end of the function), then it's invalid
    //  2. Values must have operators between them, i.e., no consecutive values
    $scope.validFunction = function() {
      // console.log('validating function...')
      var valid = true;

      if($scope.unmatchedOpeningParens !== 0) {
        console.log('error is unmatched parens');
        valid = false;
      } else {
        _.each($scope.functionItems, function(item, index) {
          var previousItem = $scope.functionItems[index-1];
          var followingItem = $scope.functionItems[index+1];
          if($scope.isOperator(item)) {
            if($scope.isOperator(previousItem) || (typeof previousItem === 'undefined') || $scope.isOperator(followingItem) || (typeof followingItem === 'undefined')) {
              console.log('error is consecutive operators or operator at the beginning or ending');
              valid = false;
            }
          } else if(($scope.functionItems.length > 1) && (!$scope.isParens(item))) {  // it must be a variable, constant, or function
            if((index === 0) && (!$scope.isOperator(followingItem) || (typeof followingItem === 'undefined'))) {  // conditions for first item
              console.log('error is non-operator after first value');
              valid = false;
            } else if((index === ($scope.functionItems.length-1)) && (!$scope.isOperator(previousItem) || (typeof previousItem === 'undefined'))) {  // conditions for last item
              console.log('error is non-operator before last value');
              valid = false; 
            } else if((index > 0) && (index < ($scope.functionItems.length-1)) && (!$scope.isOperator(previousItem) || (typeof previousItem === 'undefined') || !$scope.isOperator(followingItem) || (typeof followingItem === 'undefined'))) {   // conditions for middle items
              console.log('error is consecutive values');
              valid = false;
            }
          }
        });
      }

      return valid;
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

    $scope.submit = function () {
        _.each($scope.objects, function(object) {
            
            // add field to each object
            object.data[$scope.field.name] = {
                  value: null,
                  log: $scope.formData.log || false,
                  dataType: $scope.field.dataType,
                  type: $scope.field.type
            };

            if($scope.field.expression !== null) {
              object.data[$scope.field.name].expression = $scope.field.expression;
            }

            $scope.update(object);
        });

        $scope.ok($scope.field.name);
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
