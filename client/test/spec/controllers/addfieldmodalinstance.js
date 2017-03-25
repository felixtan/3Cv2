'use strict';

describe('Controller: AddFieldModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
      $scope,
      $state,
      $httpBackend,
      dataService,
      deferred,
      objectType,
      modalInstance;

  // Initialize the controller and a mock $scope
  beforeEach(inject(function (_$httpBackend_, $q, $controller, $rootScope, _dataService_, _$state_) {
    $scope = $rootScope.$new();
    dataService = _dataService_;
    $state = _$state_;
    deferred = $q.defer();
    objectType = randomObjectType();
    $httpBackend = _$httpBackend_;

    ctrl = $controller('AddFieldModalInstanceCtrl', {
      $scope: $scope,
      getDrivers: getDrivers,
      getCars: getCars,
      getProspects: getProspects,
      getAssets: getAssets,
      $modalInstance: mockModalInstance,
      assetType: 'Gas Card',
      objectType: objectType
    });

    modalInstance = mockModalInstance;
    // spyOn(modalInstance, 'close');
    // spyOn(modalInstance, 'dismiss');
    spyOn(state, 'go');
    spyOn(state, 'forceReload');
    spyOn(dataService, 'updateCar');
    spyOn(dataService, 'updateDriver');
    spyOn(dataService, 'updateProspect');
    spyOn(dataService, 'updateAsset');
    spyOn($scope, 'update');
    spyOn($scope, 'setInequalitySign').and.callThrough();
    spyOn($scope, 'setDataType').and.callThrough();
    spyOn($scope, 'invalidFieldType').and.callThrough();
    spyOn($scope, 'appendItemToFunction').and.callThrough();
    spyOn($scope, 'clearExpression').and.callThrough();
    spyOn($scope, '$eval').and.callThrough();
    spyOn($scope, 'undoExpression').and.callThrough();
    spyOn($scope, 'reset').and.callThrough();
    spyOn($scope, 'ok').and.callThrough();
    spyOn($scope, 'close').and.callThrough();
    spyOn($scope, 'submit').and.callThrough();
    spyOn(ctrl, 'setValidFieldsForExpressions').and.callThrough();
    spyOn(ctrl, 'validate').and.callThrough();
    spyOn(ctrl, 'firstStageValidation').and.callThrough();
    spyOn(ctrl, 'displayExpression').and.callThrough();
    spyOn(ctrl, 'buildTestExpression').and.callThrough();
    spyOn(ctrl, 'validateExpression').and.callThrough();
    spyOn(ctrl, 'firstStageValidate_Undo').and.callThrough();
    spyOn(ctrl, 'createNewFieldData').and.callThrough();
    spyOn(ctrl, 'appendNewFieldToObject').and.callThrough();
    spyOn(ctrl, 'evaluateExpression').and.callThrough();
    spyOn(ctrl, 'evaluateInequalityValue').and.callThrough();
    spyOn(ctrl, 'buildExpression').and.callThrough();
  }));

  describe('setup', function() {
    xit("should extract fields with number data type for use in expressions given object's data", function() {

      if(objectType === 'car') {
        ctrl.setValidFieldsForExpressions($scope.objects[0].data);
        expect($scope.validFieldsForExpressions).toEqual(['mileage', 'testExpression']);
      } else if(objectType === 'driver') {
        ctrl.setValidFieldsForExpressions($scope.objects[0].data);
        expect($scope.validFieldsForExpressions).toEqual(['revenue']);
      } else if(objectType === 'prospect') {
        ctrl.setValidFieldsForExpressions($scope.objects[0].data);
        expect($scope.validFieldsForExpressions).toEqual(['accidents']);
      } else if(objectType === 'asset') {
        ctrl.setValidFieldsForExpressions($scope.objects[0].data);
        expect($scope.validFieldsForExpressions).toEqual(['Balance']);
      }

    });
  });

  describe("set inequality sign", function() {
    xit("should set the inequality sign to gt given 0", function() {
      $scope.setInequalitySign(0);
      expect($scope.field.inequalitySign).toBe('>');
      expect($scope.field.inequalitySignId).toBe(0);
    });

    xit("should set the inequality sign to ge given 1", function() {
      $scope.setInequalitySign(1);
      expect($scope.field.inequalitySign).toBe('≥');
      expect($scope.field.inequalitySignId).toBe(1);
    });

    xit("should set the inequality sign to lt given 2", function() {
      $scope.setInequalitySign(2);
      expect($scope.field.inequalitySign).toBe('<');
      expect($scope.field.inequalitySignId).toBe(2);
    });

    xit("should set the inequality sign to le given 3", function() {
      $scope.setInequalitySign(3);
      expect($scope.field.inequalitySign).toBe('≤');
      expect($scope.field.inequalitySignId).toBe(3);
    });

    xit("should set the inequality sign to undefined given inappropriate id", function() {
      $scope.setInequalitySign(4);
      expect($scope.field.inequalitySign).not.toBeDefined();
      expect($scope.field.inequalitySignId).toBeNull();
    });
  });

  describe("set field data type given field type", function() {
    xit("should set to text given text", function() {
      $scope.setDataType('text');
      expect($scope.clearExpression).toHaveBeenCalled();
      expect($scope.field.dataType).toEqual('text');
    });

    xit("should set to number given number", function() {
      $scope.setDataType('number');
      expect($scope.clearExpression).toHaveBeenCalled();
      // setTimeout(function() {
        expect($scope.field.dataType).toEqual('number');
      // }, 100);
    });

    xit("should set to boolean given boolean", function() {
      $scope.setDataType('boolean');
      expect($scope.clearExpression).toHaveBeenCalled();
      // setTimeout(function() {
        expect($scope.field.dataType).toEqual('boolean');
      // }, 100);
    });

    xit("should set to number given function", function() {
      $scope.setDataType('function');
      expect($scope.clearExpression).toHaveBeenCalled();
      // setTimeout(function() {
        expect($scope.field.dataType).toEqual('number');
      // }, 100);
    });

    xit("should set to boolean given inequality", function() {
      $scope.setDataType('inequality');
      expect($scope.clearExpression).toHaveBeenCalled();
      // setTimeout(function() {
        expect($scope.field.dataType).toEqual('boolean');
      // }, 100);
    });

    xit("should set to undefined given unrecognized type", function() {
      $scope.setDataType(0);
      expect($scope.clearExpression).toHaveBeenCalled();
      // setTimeout(function() {
        expect($scope.field.dataType).not.toBeDefined();
      // }, 100);
    });
  });

  describe("xit should disable submit button if invalied field", function() {
    xit("should return true if field type is null", function() {
      $scope.field.type = null;
      $scope.field.dataType = 'text';
      expect($scope.invalidFieldType()).toBe(true);
    });

    xit("should return true if field type is undefined", function() {
      $scope.field.type = undefined;
      $scope.field.dataType = 'text';
      expect($scope.invalidFieldType()).toBe(true);
    });

    xit("should return true if field data type is null", function() {
      $scope.field.type = 'number';
      $scope.field.dataType = null;
      expect($scope.invalidFieldType()).toBe(true);
    });

    xit("should return true if field type is undefined", function() {
      $scope.field.type = 'number';
      $scope.field.dataType = undefined;
      expect($scope.invalidFieldType()).toBe(true);
    });

    xit("should return false if field type and dataType are defined", function() {
      $scope.field.type = 'function';
      $scope.field.dataType = 'number';
      expect($scope.invalidFieldType()).toBe(false);
    });
  });

  describe("xit should append an item to an expression and then validate xit", function() {
    xit("should append items to functions", function() {
      $scope.field.type = 'function';
      $scope.setDataType($scope.field);
      $scope.appendItemToFunction('mileage', 'field');

      expect($scope.field.expressionItems.length).toBe(1);
      expect(ctrl.testExpressionItems.length).toBe(1);
      expect(ctrl.validate).toHaveBeenCalled();
      expect($scope.expressionFieldSelect.value).toBeNull();
      expect($scope.expressionConstantInput.value).toBeNull();
    });

    xit("should append items to the lhs expression of an inequality", function() {
      $scope.field.type = 'inequality';
      $scope.rightSide.value = false;
      $scope.setDataType($scope.field);
      $scope.appendItemToFunction('operator', '+');

      expect($scope.field.leftExpressionItems.length).toBe(1);
      expect($scope.field.rightExpressionItems.length).toBe(0);
      expect(ctrl.leftTestExpressionItems.length).toBe(1);
      expect(ctrl.rightTestExpressionItems.length).toBe(0);
      expect(ctrl.validate).toHaveBeenCalled();
      expect($scope.expressionFieldSelect.value).toBeNull();
      expect($scope.expressionConstantInput.value).toBeNull();
    });

    xit("should append items to the rhs expression of an inequality", function() {
      $scope.field.type = 'inequality';
      $scope.rightSide.value = true;
      $scope.setDataType($scope.field);
      $scope.appendItemToFunction('1000', 'constant');

      expect($scope.field.leftExpressionItems.length).toBe(0);
      expect($scope.field.rightExpressionItems.length).toBe(1);
      expect(ctrl.rightTestExpressionItems.length).toBe(1);
      expect(ctrl.leftTestExpressionItems.length).toBe(0);
      expect(ctrl.validate).toHaveBeenCalled();
      expect($scope.expressionFieldSelect.value).toBeNull();
      expect($scope.expressionConstantInput.value).toBeNull();
    });

    xit("should replace values of fields with 1 for testing - functions", function() {
      $scope.field.type = 'function';
      $scope.setDataType($scope.field);
      $scope.appendItemToFunction('mileage', 'field');

      expect(ctrl.testExpressionItems).toEqual([{ type: 'field', value: '1' }]);
      expect(ctrl.testExpressionItems).not.toEqual([{ type: 'field', value: '14081' }]);
    });

    xit("should replace values of fields with 1 for testing - inequalities", function() {
      $scope.field.type = 'inequality';
      $scope.rightSide.value = false;
      $scope.setDataType($scope.field);
      $scope.appendItemToFunction('mileage', 'field');

      expect(ctrl.leftTestExpressionItems).toEqual([{ type: 'field', value: '1' }]);
      expect(ctrl.leftTestExpressionItems).not.toEqual([{ type: 'field', value: '14081' }]);
      expect(ctrl.rightTestExpressionItems).toEqual([]);
    });
  });

  describe("xit should validate test expressions", function() {

    describe("general validation", function() {
      beforeEach(function() {
        httpBackend.whenGET("views/carList.html").respond('');
        httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
        httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
        httpBackend.expectGET("views/carList.html");
      });

      afterEach(function() {
        httpBackend.flush();
      });

      xit("should involve multiple stages of validation", function() {
        var testExpressionItems = [{ type: 'constant', value: '3.14' }];
        var typeOfNewItem = 'operator';
        var newItem = '*';

        ctrl.validate(testExpressionItems, typeOfNewItem, newItem);
        expect(ctrl.firstStageValidation).toHaveBeenCalledWith(testExpressionItems, typeOfNewItem, newItem);
        $scope.$digest();
        expect(ctrl.displayExpression).toHaveBeenCalled();
        $scope.$digest();
        expect(ctrl.buildTestExpression).toHaveBeenCalled();
      });

      xit("should proceed to second stage validation if the test expression passes the first", function() {
        var testExpressionItems = [{ type: 'constant', value: '3.14' }, { type: 'constant', value: '*' }];
        var typeOfNewItem = 'field';
        var newItem = 'mileage';

        ctrl.validate(testExpressionItems, typeOfNewItem, newItem);
        expect(ctrl.firstStageValidation).toHaveBeenCalledWith(testExpressionItems, typeOfNewItem, newItem);
        $scope.$digest();
        expect(ctrl.displayExpression).toHaveBeenCalled();
        $scope.$digest();
        expect(ctrl.buildTestExpression).toHaveBeenCalled();
        $scope.$digest();
        expect(ctrl.validateExpression).toHaveBeenCalled();
        // $scope.$digest();
      });

      xit("should not proceed to second stage validation if the test expression fails the first", function() {
        var testExpressionItems = [{ type: 'constant', value: '3.14' }];
        var typeOfNewItem = 'field';
        var newItem = 'mileage';

        ctrl.validate(testExpressionItems, typeOfNewItem, newItem);
        expect(ctrl.firstStageValidation).toHaveBeenCalledWith(testExpressionItems, typeOfNewItem, newItem);
        $scope.$digest();
        expect(ctrl.displayExpression).toHaveBeenCalled();
        $scope.$digest();
        expect(ctrl.buildTestExpression).toHaveBeenCalled();
        $scope.$digest();
        expect(ctrl.validateExpression).not.toHaveBeenCalled();
        $scope.$digest();
      });
    });

    //
    // first stage validation: makes sure that fields are tested correctly
    ///////////////////////////////////////////////////////
    describe("first stage validation", function() {

      beforeEach(function() {
        httpBackend.whenGET("views/carList.html").respond('');
        httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
        httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
        httpBackend.expectGET("views/carList.html");
      });

      afterEach(function() {
        httpBackend.flush();
      });

      xit("should evaluate expressions to be invalid if fields are not preceeded or followed by an operator", function() {
        var testExpressionItems = [{ type: 'constant', value: '3.14' }];
        var typeOfNewItem = 'field';
        var newItem = 'mileage';
        var testExpressionItems_f = [{ type: 'constant', value: '3.14' }, { type: 'field', value: 'mileage' }];

        ctrl.firstStageValidation(testExpressionItems, typeOfNewItem, newItem).then(function(result) {
          expect(result.valid).toBe(false);
          expect(result._testExpressionItems_).toEqual(testExpressionItems_f);
          expect($scope.validExpression).toBe(false);
          expect($scope.expressionErrorMessage).toBeString();
        });
        $scope.$digest();
      });

      xit("should evaluate expressions to be invalid if constants are not preceeded or followed by an operator", function() {
        var testExpressionItems = [{ type: 'field', value: '1' }];
        var typeOfNewItem = 'constant';
        var newItem = '3.14';
        var testExpressionItems_f = [{ type: 'field', value: '1' }, { type: 'constant', value: '3.14' }];

        ctrl.firstStageValidation(testExpressionItems, typeOfNewItem, newItem).then(function(result) {
          expect(result.valid).toBe(false);
          expect(result._testExpressionItems_).toEqual(testExpressionItems_f);
          expect($scope.validExpression).toBe(false);
          expect($scope.expressionErrorMessage).toBeString();
        });
        $scope.$digest();
      });

      xit("should replace field value with 1 before pushing to testExpressionItems", function() {
        var testExpressionItems = [{ type: 'field', value: '1' }, { type: 'operator', value: '*' }];
        var typeOfNewItem = 'field';
        var newItem = 'mileage';
        var testExpressionItems_f = [{ type: 'field', value: '1' }, { type: 'operator', value: '*' }, { type: 'field', value: '1' }];

        ctrl.firstStageValidation(testExpressionItems, typeOfNewItem, newItem).then(function(result) {
          expect(result.valid).toBe(true);
          expect(result._testExpressionItems_).toEqual(testExpressionItems_f);
          expect($scope.validExpression).toBe(true);
          expect($scope.expressionErrorMessage).not.toBeString();
        });
        $scope.$digest();
      });

      xit("should push constants to testExpressionItems as long as an operator preceeded xit or if xit's the first item", function() {
        var testExpressionItems = [{ type: 'field', value: '1' }, { type: 'operator', value: '*' }];
        var typeOfNewItem = 'constant';
        var newItem = '3.14';
        var testExpressionItems_f = [{ type: 'field', value: '1' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }];

        ctrl.firstStageValidation(testExpressionItems, typeOfNewItem, newItem).then(function(result) {
          expect(result.valid).toBe(true);
          expect(result._testExpressionItems_).toEqual(testExpressionItems_f);
          expect($scope.validExpression).toBe(true);
          expect($scope.expressionErrorMessage).not.toBeString();
        });
        $scope.$digest();
      });

      xit("should evaluate expressions to be valid if constants are preceeded or followed by an operator", function() {
        var testExpressionItems = [{ type: 'field', value: '1' }];
        var typeOfNewItem = 'operator';
        var newItem = '*';
        var testExpressionItems_f = [{ type: 'field', value: '1' }, { type: 'operator', value: '*' }];

        ctrl.firstStageValidation(testExpressionItems, typeOfNewItem, newItem).then(function(result) {
          expect(result.valid).toBe(true);
          expect(result._testExpressionItems_).toEqual(testExpressionItems_f);
          expect($scope.validExpression).toBe(true);
          expect($scope.expressionErrorMessage).not.toBeString();
        });
        $scope.$digest();
      });

      xit("should evaluate expressions to be valid if fields are preceeded or followed by an operator", function() {
        var testExpressionItems = [{ type: 'constant', value: '1' }];
        var typeOfNewItem = 'operator';
        var newItem = '/';
        var testExpressionItems_f = [{ type: 'constant', value: '1' }, { type: 'operator', value: '/' }];

        ctrl.firstStageValidation(testExpressionItems, typeOfNewItem, newItem).then(function(result) {
          expect(result.valid).toBe(true);
          expect(result._testExpressionItems_).toEqual(testExpressionItems_f);
          expect($scope.validExpression).toBe(true);
          expect($scope.expressionErrorMessage).not.toBeString();
        });
        $scope.$digest();
      });
    });

    describe("mid stage functions", function() {

      beforeEach(function() {
        httpBackend.whenGET("views/carList.html").respond('');
        httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
        httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
        httpBackend.expectGET("views/carList.html");
      });

      afterEach(function() {
        httpBackend.flush();
      });

      xit("should build a test expression out of testExpressionItems", function() {
        var testExpressionItems = [{ type: 'field', value: '1' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }];
        ctrl.buildTestExpression(testExpressionItems).then(function(expression) {
          expect(expression).toEqual("1*3.14");
        });
        $scope.$digest();
      });

      xit("should build a test expression out of testExpressionItems even if xit's invalid", function() {
        var testExpressionItems = [{ type: 'field', value: '1' }, { type: 'constant', value: '3.14' }];
        ctrl.buildTestExpression(testExpressionItems).then(function(expression) {
          expect(expression).toEqual("13.14");
        });
        $scope.$digest();
      });

      xit("should build a display expression out of testExpressionItems where field names are shown", function() {
        $scope.field.expressionItems = [{ type: 'field', value: 'mileage' }, { type: 'constant', value: '3.14' }];
        $scope.field.type = 'function';
        ctrl.displayExpression().then(function(expression) {
          expect($scope.field.expression).toEqual('mileage3.14');
        });
        $scope.$digest();
      });

      xit("should build a display expression out of leftTestExpressionItems if inequality and left side selected", function() {
        $scope.field.leftExpressionItems = [{ type: 'field', value: 'mileage' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }];
        $scope.field.type = 'inequality';
        $scope.rightSide.value = false;
        ctrl.displayExpression().then(function(expression) {
          expect($scope.field.leftExpression).toEqual('mileage*3.14');
        });
        $scope.$digest();
      });

      xit("should build a display expression out of rightTestExpressionItems if inequality and right side selected", function() {
        $scope.field.rightExpressionItems = [{ type: 'field', value: 'mileage' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }, { type: 'operator', value: '(' }];
        $scope.field.type = 'inequality';
        $scope.rightSide.value = true;
        ctrl.displayExpression().then(function(expression) {
          expect($scope.field.rightExpression).toEqual('mileage*3.14(');
        });
        $scope.$digest();
      });
    });

    describe("second stage validation", function() {
      xit("should evaluate expressions to be valid if they're valid", function() {
        ctrl.testExpression = '3.14*1';
        ctrl.validateExpression();
        expect($scope.expressionErrorMessage).not.toBeDefined();
        expect($scope.$eval).toHaveBeenCalledWith(ctrl.testExpression);
        expect($scope.validExpression).toBe(true);
      });

      xit("should throw when invalid expressions", function() {
        ctrl.testExpression = "3.14*";
        ctrl.validateExpression();
        expect($scope.expressionErrorMessage).toBeString();
        expect($scope.$eval).toHaveBeenCalledWith(ctrl.testExpression);
        expect($scope.validExpression).toBe(false);
      });

      xit("should throw when invalid expressions - parens", function() {
        ctrl.testExpression = "3.14*1)";
        ctrl.validateExpression();
        expect($scope.expressionErrorMessage).toBeString();
        expect($scope.$eval).toHaveBeenCalledWith(ctrl.testExpression);
        expect($scope.validExpression).toBe(false);
      });
    });
  });

  describe("undo expression", function() {

    beforeEach(function() {
      // httpBackend.whenGET("views/carList.html").respond('');
      // httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond(getCars);
      // httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
      // httpBackend.expectGET("views/carList.html");
    });

    afterEach(function() {
      // httpBackend.flush();
    });

    xit('should validate after removing last item from expression', function() {
      httpBackend.whenGET("views/carList.html").respond('');
      httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
      httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
      httpBackend.expectGET("views/carList.html");

      $scope.field.type = 'function';
      $scope.field.expressionItems = ctrl.testExpressionItems = [{ type: 'constant', value: '3.14'}];
      $scope.undoExpression();

      expect(ctrl.firstStageValidate_Undo).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.displayExpression).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.buildTestExpression).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.validateExpression).toHaveBeenCalled();

      httpBackend.flush();
    });

    xit("should remove last item from function", function() {
      $scope.field.type = 'function';
      $scope.field.expressionItems = ctrl.testExpressionItems = [{ type: 'constant', value: '3.14'}];
      $scope.undoExpression();
      expect($scope.field.expressionItems.length).toBe(0);
      expect(ctrl.testExpressionItems.length).toBe(0);
    });

    xit("should remove last item from lhs of inequality", function() {
      $scope.field.type = 'inequality';
      $scope.rightSide.value = false;
      $scope.field.leftExpressionItems = ctrl.leftTestExpressionItems = [{ type: 'constant', value: '3.14'}];
      $scope.undoExpression();
      expect($scope.field.leftExpressionItems.length).toBe(0);
      expect(ctrl.leftTestExpressionItems.length).toBe(0);
    });

    xit("should remove last item from rhs of inequality", function() {
      $scope.field.type = 'inequality';
      $scope.rightSide.value = true;
      $scope.field.rightExpressionItems = ctrl.rightTestExpressionItems = [{ type: 'constant', value: '3.14'}];
      $scope.undoExpression();
      expect($scope.field.rightExpressionItems.length).toBe(0);
      expect(ctrl.rightTestExpressionItems.length).toBe(0);
    });
  });

  // slightly different than normal
  // reasses if i actually need xit or can use the original firstStageValidate
  describe("evaluate expression after undo", function() {

    beforeEach(function() {
      httpBackend.whenGET("views/carList.html").respond('');
      httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
      httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
      httpBackend.expectGET("views/carList.html");
    });

    afterEach(function() {
      httpBackend.flush();
    });

    xit("should return true if testExpressionItems has 1 item", function() {
      $scope.field.type = 'function';
      ctrl.testExpressionItems = [{ type: 'constant', value: '3.14' }];
      ctrl.firstStageValidate_Undo().then(function(valid) {
        expect($scope.validExpression).toBe(true);
      });
      $scope.$digest();
    });

    xit("should return true if testExpressionItems has 0 items", function() {
      $scope.field.type = 'inequality';
      $scope.rightSide.value = true;
      ctrl.rightTestExpressionItems = [];
      ctrl.firstStageValidate_Undo().then(function(valid) {
        expect($scope.validExpression).toBe(true);
      });
      $scope.$digest();
    });

    xit("should not throw error if the new last item is an operator", function() {
      $scope.field.type = 'function';
      ctrl.testExpressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*' }];
      ctrl.firstStageValidate_Undo().then(function(valid) {
        expect($scope.validExpression).toBe(true);
      });
      $scope.$digest();
    });

    xit("should throw error if the new last item is a field and item before xit is not an operator", function() {
      $scope.field.type = 'function';
      ctrl.testExpressionItems = [{ type: 'constant', value: '3.14' }, { type: 'field', value: '1' }];
      ctrl.firstStageValidate_Undo().then(function(valid) {
        expect($scope.validExpression).toBe(false);
      });
      $scope.$digest();
    });

    xit("should throw error if the new last item is a constant and item before xit is not an operator", function() {
      $scope.field.type = 'function';
      ctrl.testExpressionItems = [{ type: 'constant', value: '3.14' }, { type: 'constant', value: '1' }];
      ctrl.firstStageValidate_Undo().then(function(valid) {
        expect($scope.validExpression).toBe(false);
      });
      $scope.$digest();
    });

    xit("should be good if the new last item is a field and item before xit is an operator", function() {
      $scope.field.type = 'function';
      ctrl.testExpressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*' }, { type:'field', value:'1' }];
      ctrl.firstStageValidate_Undo().then(function(valid) {
        expect($scope.validExpression).toBe(true);
      });
      $scope.$digest();
    });
  });

  xit("should clear $scope.field", function() {
    ctrl.testExpression = $scope.expressionErrorMessage = $scope.field.expression = $scope.field.leftExpression = $scope.field.rightExpression = $scope.inequalitySign = 'foo';
    ctrl.testExpressionItems = ctrl.rightTestExpressionItems = ctrl.leftTestExpressionItems = $scope.field.expressionItems = $scope.field.leftExpressionItems = $scope.field.rightExpressionItems = [{ foo: 'foo' }];
    $scope.validExpression = false;
    $scope.field.inequalitySignId = 0;
    $scope.clearExpression();
    expect(ctrl.testExpression).toBe("");
    expect($scope.field.expression).toBe("");
    expect($scope.field.leftExpression).toBe("");
    expect($scope.field.rightExpression).toBe("");
    expect($scope.field.inequalitySign).toBe("");
    expect($scope.field.expressionItems.length).toBe(0);
    expect(ctrl.testExpressionItems.length).toBe(0);
    expect($scope.field.leftExpressionItems.length).toBe(0);
    expect($scope.field.rightExpressionItems.length).toBe(0);
    expect(ctrl.rightTestExpressionItems.length).toBe(0);
    expect(ctrl.leftTestExpressionItems.length).toBe(0);
    expect($scope.field.inequalitySignId).toBeNull();
    expect($scope.validExpression).toBe(true);
    expect($scope.expressionErrorMessage).not.toBeDefined();
  });

  describe('object type recognition', function() {
    xit('should recognize if object type is car and load cars', function() {
      if(objectType === 'car') {
        expect($scope.objects).toEqual(getCars.data);
        expect($scope.update).toBeFunction();
        // can't check $scope.update against dataService.update because the former is a function, latter is a spy
      }
    });

    xit('should recognize if object type is driver and load drivers', function() {
      if(objectType === 'driver') {
        expect($scope.objects).toEqual(getDrivers.data);
        expect($scope.update).toBeFunction();
      }
    });

    xit('should recognize if object type is prospect and load prospects', function() {
      if(objectType === 'prospect') {
        expect($scope.objects).toEqual(getProspects.data);
        expect($scope.update).toBeFunction();
      }
    });

    xit('should recognize if object type is asset and load assets', function() {
      if(objectType === 'asset') {
        expect($scope.assetType).toEqual('Gas Card');
        expect($scope.objects[0]).toEqual(getAssets.data[0]);
        expect($scope.update).toBeFunction();
      }
    });

    xit("should redirect to car dashboard if invalid object type", function() {
      if(objectType !== 'car'
        && objectType !== 'driver'
        && objectType !== 'prospect'
        && objectType !== 'asset') {
        // expect(state.go).toHaveBeenCalled();
      }
    });
  });

  describe("createNewFieldData", function() {

    beforeEach(function() {
      httpBackend.whenGET("views/carList.html").respond('');
      httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
      httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
      httpBackend.expectGET("views/carList.html");
    });

    afterEach(function() {
      httpBackend.flush();
    });

    xit("should return a data object for function field", function() {
      $scope.field.type = 'function';
      $scope.field.dataType = 'number';
      $scope.field.expressionItems = [{ type: 'field', value: 'mileage' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }];
      $scope.formData.log = true;

      ctrl.createNewFieldData($scope.field).then(function(data) {
        expect(data.value).toBeNull();
        expect(data.log).toBe(true);
        expect(data.dataType).toBe('number');
        expect(data.type).toBe('function');
        expect(data.expressionItems).toEqual([{ type: 'field', value: 'mileage' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }]);
      });
      $scope.$digest();
    });

    xit("should return a data object for inequality field", function() {
      $scope.field.type = 'inequality';
      $scope.field.dataType = 'boolean';
      $scope.field.leftExpressionItems = [{ type: 'field', value: 'mileage' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }];
      $scope.field.inequalitySignId = 0;
      $scope.field.rightExpressionItems = [{ type: 'constant', value: '20000' }];
      $scope.formData.log = true;

      ctrl.createNewFieldData($scope.field).then(function(data) {
        expect(data.value).toBeNull();
        expect(data.log).toBe(true);
        expect(data.dataType).toBe('boolean');
        expect(data.type).toBe('inequality');
        expect(data.leftExpressionItems).toEqual([{ type: 'field', value: 'mileage' }, { type: 'operator', value: '*' }, { type: 'constant', value: '3.14' }]);
        expect(data.rightExpressionItems).toEqual([{ type: 'constant', value: '20000' }]);
        expect(data.inequalitySignId).toBe(0);
      });
      $scope.$digest();
    });

    xit("should return a data object for text fields", function() {
      $scope.field.type = 'text';
      $scope.field.dataType = 'text';
      $scope.formData.log = false;

      ctrl.createNewFieldData($scope.field).then(function(data) {
        expect(data.value).toBeNull();
        expect(data.log).toBe(false);
        expect(data.dataType).toBe('text');
        expect(data.type).toBe('text');
      });
      $scope.$digest();
    });

    xit("should return a data object for number fields", function() {
      $scope.field.type = 'number';
      $scope.field.dataType = 'number';
      $scope.formData.log = true;

      ctrl.createNewFieldData($scope.field).then(function(data) {
        expect(data.value).toBeNull();
        expect(data.log).toBe(true);
        expect(data.dataType).toBe('number');
        expect(data.type).toBe('number');
      });
      $scope.$digest();
    });

    xit("should return a data object for boolean fields", function() {
      $scope.field.type = 'boolean';
      $scope.field.dataType = 'boolean';
      $scope.formData.log = true;

      ctrl.createNewFieldData($scope.field).then(function(data) {
        expect(data.value).toBeNull();
        expect(data.log).toBe(true);
        expect(data.dataType).toBe('boolean');
        expect(data.type).toBe('boolean');
      });
      $scope.$digest();
    });
  });

  xit('should append new field to object', function() {
    var fieldName = 'test';
    var fieldDataObj = {
      log: true,
      value: null,
      type: 'number',
      dataType: 'number'
    };
    var foo = { data: {} };

    expect(ctrl.appendNewFieldToObject(fieldName, fieldDataObj, foo)).toEqual( { data: { 'test': fieldDataObj } });
  });

  describe("evaluate inequality value", function() {
    xit("should evaluate gt", function() {
      var leftExpressionValue = 1,
          rightExpressionValue = 2,
          result = false;
      $scope.field.inequalitySignId = 0;

      expect(ctrl.evaluateInequalityValue(leftExpressionValue, rightExpressionValue)).toEqual(result);
    });

    xit("should evaluate ge", function() {
      var leftExpressionValue = 1,
          rightExpressionValue = 1,
          result = true;
      $scope.field.inequalitySignId = 1;

      expect(ctrl.evaluateInequalityValue(leftExpressionValue, rightExpressionValue)).toEqual(result);
    });

    xit("should evaluate lt", function() {
      var leftExpressionValue = 2,
          rightExpressionValue = 1,
          result = false;
      $scope.field.inequalitySignId = 2;

      expect(ctrl.evaluateInequalityValue(leftExpressionValue, rightExpressionValue)).toEqual(result);
    });

    xit("should evaluate lt", function() {
      var leftExpressionValue = 1,
          rightExpressionValue = 2,
          result = true;
      $scope.field.inequalitySignId = 3;

      expect(ctrl.evaluateInequalityValue(leftExpressionValue, rightExpressionValue)).toEqual(result);
    });
  });

  describe("determine if inequality expression is non empty", function() {

    beforeEach(function() {
      $scope.field.type = 'inequality';
      $scope.field.rightExpressionItems = [{ type: 'constant', value: '20000'}];
      $scope.field.leftExpressionItems = [{ type: 'field', value: 'mileage' }];
      $scope.field.inequalitySignId = 1;
    });

    xit("should return false if rightExpressionItems is empty", function() {
      $scope.field.rightExpressionItems = [];
      expect($scope.inequalityIsComplete()).toEqual(false);
    });

    xit("should return false if leftExpressionItems is empty", function() {
      $scope.field.leftExpressionItems = [];
      expect($scope.inequalityIsComplete()).toEqual(false);
    });

    xit("should return false if inequalitySign is empty", function() {
      $scope.field.inequalitySignId = null;
      expect($scope.inequalityIsComplete()).toEqual(false);
    });

    xit("should return false if inequalitySign is empty", function() {
      $scope.field.inequalitySignId = undefined;
      expect($scope.inequalityIsComplete()).toEqual(false);
    });

    xit("should return true if right and left expressionItems are unempty and inequalitySign is valid", function() {
      expect($scope.inequalityIsComplete()).toEqual(true);
    });

    xit("should return true if not an inequality - function", function() {
      $scope.field.type = 'function';
      expect($scope.inequalityIsComplete()).toEqual(true);
    });

    xit("should return true if not an inequality - number", function() {
      $scope.field.type = 'number';
      expect($scope.inequalityIsComplete()).toEqual(true);
    });

    xit("should return true if not an inequality - text", function() {
      $scope.field.type = 'text';
      expect($scope.inequalityIsComplete()).toEqual(true);
    });

    xit("should return true if not an inequality - boolean", function() {
      $scope.field.type = 'boolean';
      expect($scope.inequalityIsComplete()).toEqual(true);
    });
  });

  describe("determine if general expression is empty", function() {
    xit("should return true only if expressionItems empty - function", function() {
      $scope.field.type = 'function';
      $scope.field.expressionItems = ['foo'];
      expect($scope.emptyExpression()).toEqual(false);
    });

    xit("should return false only if expressionItems non empty - function", function() {
      $scope.field.type = 'function';
      $scope.field.expressionItems = [];
      expect($scope.emptyExpression()).toEqual(true);
    });

    xit("should return false only if expressionItems non empty - left", function() {
      $scope.field.type = 'inequality';
      $scope.field.leftExpressionItems = [];
      $scope.field.righttExpressionItems = ['foo'];
      $scope.inequalitySignId = 1;
      expect($scope.emptyExpression()).toEqual(true);
    });

    xit("should return false only if expressionItems non empty - right", function() {
      $scope.field.type = 'inequality';
      $scope.field.leftExpressionItems = ['foo'];
      $scope.field.righttExpressionItems = [];
      $scope.inequalitySignId = 1;
      expect($scope.emptyExpression()).toEqual(true);
    });

    xit("should return false only if expressionItems non empty - empty", function() {
      $scope.field.type = 'inequality';
      $scope.field.leftExpressionItems = [];
      $scope.field.rightExpressionItems = [];
      $scope.inequalitySignId = 1;
      expect($scope.emptyExpression()).toEqual(true);
    });

    xit("should return true for non expression fields - text", function() {
      $scope.field.type = 'text';
      expect($scope.emptyExpression()).toEqual(false);
    });

    xit("should return true for non expression fields - number", function() {
      $scope.field.type = 'number';
      expect($scope.emptyExpression()).toEqual(false);
    });

    xit("should return true for non expression fields - boolean", function() {
      $scope.field.type = 'boolean';
      expect($scope.emptyExpression()).toEqual(false);
    });
  });

  describe("modal methods", function() {
    xit("should reset the form", function() {
      expect($scope.reset).toBeDefined();
      expect($scope.ok).toBeDefined();
      expect($scope.close).toBeDefined();
    });
  });

  describe('build and evaluate expression for object', function() {

    beforeEach(function() {
      httpBackend.whenGET("views/carList.html").respond('');
      httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
      httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
      httpBackend.expectGET("views/carList.html");
    });

    afterEach(function() {
      httpBackend.flush();
    });

    xit("should build expression for an object", function() {
      var expressionItems = [{ type: 'field', value: 'mileage' }];
      var object = getCars.data[0];

      ctrl.buildExpression(object, expressionItems).then(function(expression) {
        expect(expression).toEqual(object.data['mileage'].value);
      });
      $scope.$digest();
    });

    xit("should evaluate an expression for object", function() {
      var expressionItems = [{ type: 'field', value: 'mileage' }, { type: 'operator', value: '*'}, { type: 'constant', value: '2' }];
      var object = getCars.data[0];

      ctrl.evaluateExpression(object, expressionItems).then(function(value) {
        expect(ctrl.buildExpression).toHaveBeenCalled();
        // $scope.$digest();
        expect(value).toEqual(object.data['mileage'].value*2);
      });
      $scope.$digest();
    });
  });

  describe('submit', function() {

    beforeEach(function() {
      httpBackend.whenGET("views/carList.html").respond('');
      httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond("");
      httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
      httpBackend.expectGET("views/carList.html");
    });

    afterEach(function() {
      httpBackend.flush();
    });

    xit("should update all objects in field is function", function() {
      $scope.field.type = 'function';
      $scope.submit();

      expect(ctrl.createNewFieldData).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.evaluateExpression.calls.count()).toEqual($scope.objects.length);
      $scope.$digest();
      expect(ctrl.appendNewFieldToObject.calls.count()).toEqual($scope.objects.length);
      $scope.$digest();
      expect($scope.update.calls.count()).toEqual($scope.objects.length);
    });

    xit("should update all objects in field is inequality", function() {
      $scope.field.type = 'inequality';
      $scope.field.inequalitySignId = 0;
      $scope.submit();

      expect(ctrl.createNewFieldData).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.evaluateExpression.calls.count()).toEqual($scope.objects.length*2);
      $scope.$digest();
      expect(ctrl.evaluateInequalityValue.calls.count()).toEqual($scope.objects.length);
      expect(ctrl.appendNewFieldToObject.calls.count()).toEqual($scope.objects.length);
      expect($scope.update.calls.count()).toEqual($scope.objects.length);
    });

    xit("should update all objects in field is number", function() {
      $scope.field.type = 'number';
      $scope.submit();

      expect(ctrl.createNewFieldData).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.appendNewFieldToObject.calls.count()).toEqual($scope.objects.length);
      expect($scope.update.calls.count()).toEqual($scope.objects.length);
    });

    xit("should update all objects in field is boolean", function() {
      $scope.field.type = 'boolean';
      $scope.submit();

      expect(ctrl.createNewFieldData).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.appendNewFieldToObject.calls.count()).toEqual($scope.objects.length);
      expect($scope.update.calls.count()).toEqual($scope.objects.length);
    });

    xit("should update all objects in field is text", function() {
      $scope.field.type = 'text';
      $scope.submit();

      expect(ctrl.createNewFieldData).toHaveBeenCalled();
      $scope.$digest();
      expect(ctrl.appendNewFieldToObject.calls.count()).toEqual($scope.objects.length);
      expect($scope.update.calls.count()).toEqual($scope.objects.length);
    });
  });
});
