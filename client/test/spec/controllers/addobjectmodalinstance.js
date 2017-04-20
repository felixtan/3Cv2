// 'use strict';

describe('Controller: AddObjectModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
      $scope,
      $childScope,
      $state,
      $httpBackend,
      assetHelpers,
      prospectHelpers,
      carHelpers,
      driverHelpers,
      dataService,
      modalInstance,
      objectType,
      $uibModalInstanceMock;

  function randomObjectType () {
    var num = Math.floor(Math.random() * 5);
    switch(num) {
      case 0:
        return 'car';
      case 1:
        return 'driver';
      case 2:
        return 'prospect';
      case 3:
        return 'asset';
      default:
        return 'foo';
    }
  }

  // Initialize the controller and a mock $scope
  beforeEach(inject(function (_$httpBackend_, _$state_, _dataService_, _assetHelpers_, _prospectHelpers_, _carHelpers_, _driverHelpers_, _$controller_, _$rootScope_) {
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $state = _$state_;
    $httpBackend = _$httpBackend_;
    $uibModalInstanceMock = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']),
    dataService = _dataService_;
    assetHelpers = _assetHelpers_;
    prospectHelpers = _prospectHelpers_;
    carHelpers = _carHelpers_;
    driverHelpers = _driverHelpers_;
    objectType = randomObjectType();

    // spyOn($scope, 'getNewFieldsToLog').and.callThrough();
    // spyOn($scope, 'hide').and.callThrough();
    // spyOn($scope, 'dontLog').and.callThrough();
    // spyOn($scope, 'invalidIdentifier').and.callThrough();
    // spyOn($scope, 'identifierChanged').and.callThrough();
    // spyOn($scope, 'disableAddField').and.callThrough();
    //
    // spyOn(ctrl, 'getInequalitySign').and.callThrough();
    // spyOn(ctrl, 'buildExpression').and.callThrough();
    // spyOn(ctrl, 'hideExpressions').and.callThrough();
    //
    // spyOn(carHelpers, "getIdentifier");
    // spyOn(assetHelpers, "getIdentifier");
    // spyOn(assetHelpers, "getAssetTypes");
    // spyOn(prospectHelpers, "getProspectStatuses");

    ctrl = _$controller_('AddObjectModalInstanceCtrl', {
      $scope: $scope,
      $uibModalInstance: $uibModalInstanceMock,
      getObjects: [],
      objectType: objectType,
    });
  }));

  describe("sets up the controller", function() {
    it('exists', function() {
        expect(ctrl).not.toBeNull();
    });

    it("should return true if a field is to be hidden", function() {
      $scope.fieldsToHide = ['foo', 'bar'];

      expect($scope.hide('foo')).toEqual(true);
      expect($scope.hide('bar')).toEqual(true);
      expect($scope.hide('baz')).toEqual(false);
    });

    it("should return true if identifier is invalid", function() {
      var identifier = { value: null };
      expect($scope.invalidIdentifier(identifier)).toEqual(true);

      identifier = { value: undefined };
      expect($scope.invalidIdentifier(identifier)).toEqual(true);

      identifier = { value: 'foo' };
      expect($scope.invalidIdentifier(identifier)).toEqual(false);
    });

    it("should return true if identifier has changed", function() {
      $scope.identifier = { value: 'foo' };
      $scope.currentIdentifier = { value: 'bar' };
      expect($scope.identifierChanged()).toEqual(true);

      $scope.identifier = { value: 'foo' };
      $scope.currentIdentifier = { value: 'foo' };
      expect($scope.identifierChanged()).toEqual(false);
    });

    it("should disable add field button/input", function() {
      if($scope.objectType === 'asset') {

        $scope.formData = { assetType: null };
        expect($scope.disableAddField()).toEqual(true);

        $scope.formData = { assetType: undefined };
        expect($scope.disableAddField()).toEqual(true);

        $scope.formData = { assetType: 'Gas Card' };
        expect($scope.disableAddField()).toEqual(false);

      } else {
        expect($scope.disableAddField()).toEqual(false);
      }
    });

    xit("should build expression of object field", function() {

      var expressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*'}, { type: 'field', value: 'mileage' }];
      ctrl.buildExpression(expressionItems).then(function(expression) {
        expect(expression).toEqual("3.14*mileage");
      });
    });
  });

  describe("hideExpressions - filter expressions which should be hidden from the form", function() {
    it("should filter function expression fields", function() {
      $scope.fieldsToHide = [];
      $scope.expressions = [];
      var expressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*'}, { type: 'field', value: 'mileage' }];
      var object = {
        foo: {
          expressionItems: expressionItems,
          type: 'function'
        }
      };
    });

    it("should filter inequality expression fields", function() {
      $scope.fieldsToHide = [];
      $scope.expressions = [];
      var leftExpressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*'}, { type: 'field', value: 'mileage' }];
      var rightExpressionItems = [{ type: 'constant', value: '50000' }];
      var inequalitySignId = 0;
      var object = {
        foo: {
          leftExpressionItems: leftExpressionItems,
          rightExpressionItems: rightExpressionItems,
          inequalitySignId: inequalitySignId,
          type: 'inequality'
        }
      };
    });

    it("should not filter expressions for any other type", function() {
      $scope.fieldsToHide = [];
      $scope.expressions = [];
      var object = {
        foo: {
          type: 'text',
          dataType: 'text',
          value: 'foo',
          log: false
        }
      };
    });
  });

  describe("set inequality sign", function() {
    xit("should set the inequality sign to gt given 0", function() {
      expect(ctrl.getInequalitySign(0)).toBe('>');
    });

    xit("should set the inequality sign to ge given 1", function() {
      expect(ctrl.getInequalitySign(1)).toBe('≥');
    });

    xit("should set the inequality sign to lt given 2", function() {
      expect(ctrl.getInequalitySign(2)).toBe('<');
    });

    xit("should set the inequality sign to le given 3", function() {
      expect(ctrl.getInequalitySign(3)).toBe('≤');
    });

    xit("should set the inequality sign to ? given inappropriate id", function() {
      expect(ctrl.getInequalitySign(4)).toBe('?');
    });
  });

  describe("set methods and variables according to object type", function() {
    beforeEach(function() {
      $httpBackend.expectGET("/api/.*");
    });

    it("should set for drivers", function() {
      if($scope.objectType === 'driver') {
        expect($scope.update).toEqual(driverHelpers.updateDriver);
        expect($scope.create).toEqual(driverHelpers.createDriver);
        expect($scope.save).toEqual(driverHelpers.saveDriver);
      }
    });

    it("should set for cars", function() {
      if($scope.objectType === 'car') {
        expect($scope.update).toEqual(carHelpers.updateCar);
        expect($scope.create).toEqual(carHelpers.createCar);
        expect($scope.save).toEqual(carHelpers.saveCar);
      }
    });

    it("should set for prospects", function() {
      if($scope.objectType === 'prospect') {
        expect($scope.update).toEqual(prospectHelpers.updateProspect);
        expect($scope.create).toEqual(prospectHelpers.createProspect);
        expect($scope.save).toEqual(prospectHelpers.saveProspect);
        // expect(prospectHelpers.getProspectStatuses).toHaveBeenCalled();
      }
    });

    it("should set for assets", function() {
      if($scope.objectType === 'asset') {
        expect($scope.update).toEqual(assetHelpers.updateAsset);
        expect($scope.create).toEqual(assetHelpers.createAsset);
        expect($scope.save).toEqual(assetHelpers.saveAsset);
        // expect(assetHelpers.getAssetTypes).toHaveBeenCalled();
      }
    });
  });

  describe("modal functions", function() {
    it("should reset the form", function() {
      expect($scope.reset).toBeDefined();
    });

    it("should close the modal on success", function() {
      expect($scope.ok).toBeDefined();
    });

    it("should dismiss the modal on cancel", function() {
      expect($scope.close).toBeDefined();
    });

    it("should open the add field modal", function() {
      expect($scope.addField).toBeDefined();
    });
  });
});
