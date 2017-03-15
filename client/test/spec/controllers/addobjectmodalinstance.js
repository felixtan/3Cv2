'use strict';

describe('Controller: AddObjectModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var ctrl,
    scope,
    assetHelpers,
    prospectHelpers,
    carHelpers,
    driverHelpers,
    dataService,
    modalInstance,
    state,
    httpBackend,
    objectType;

    var _randomObjectType_ = function() {
      var num = Math.floor(Math.random() * 5);
      switch(num) {
        case 0:
          return 'car';
          break;
        case 1:
          return 'driver';
          break;
        case 2:
          return 'prospect';
          break;
        case 3:
          return 'asset';
          break;
        default:
          return 'foo';
          break;
      }
    };

    objectType = _randomObjectType_();

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($httpBackend, $state, _dataService_, _assetHelpers_, _prospectHelpers_, _carHelpers_, _driverHelpers_, $controller, $rootScope) {
    scope = $rootScope.$new();
    dataService = _dataService_;
    assetHelpers = _assetHelpers_;
    prospectHelpers = _prospectHelpers_;
    carHelpers = _carHelpers_;
    driverHelpers = _driverHelpers_;
    modalInstance = mockModalInstance;
    state = $state;
    httpBackend = $httpBackend;

    

    ctrl = $controller('AddObjectModalInstanceCtrl', {
      $scope: scope,
      // place here mocked dependencies
      $modalInstance: modalInstance,
      objectType: objectType,
      getCars: getCars,
      getDrivers: getDrivers,
      getProspects: getProspects,
      getAssets: getAssets
    });

    spyOn(scope, 'getNewFieldsToLog').and.callThrough();
    spyOn(scope, 'hide').and.callThrough();
    spyOn(scope, 'dontLog').and.callThrough();
    spyOn(scope, 'invalidIdentifier').and.callThrough();
    spyOn(scope, 'identifierChanged').and.callThrough();
    spyOn(scope, 'disableAddField').and.callThrough();

    spyOn(ctrl, 'getInequalitySign').and.callThrough();
    spyOn(ctrl, 'buildExpression').and.callThrough();
    spyOn(ctrl, 'hideExpressions').and.callThrough();

    spyOn(carHelpers, "getIdentifier");
    spyOn(assetHelpers, "getIdentifier");
    spyOn(assetHelpers, "getAssetTypes");
    spyOn(prospectHelpers, "getProspectStatuses");
  }));

  beforeEach(function() {
    // console.log('from addObjectModalInstance test:', scope.objectType);
    // httpBackend.whenGET("\[(.*)\]").respond("");
    // if(scope.objectType === 'car') {
    //   httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("views/carList.html").respond("");
    //   httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   httpBackend.expectGET("views/carList.html");
    // } else if(scope.objectType === 'driver') {
    //   httpBackend.whenGET("/api/drivers?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("views/carList.html").respond("");
    //   httpBackend.expectGET("/api/drivers?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   httpBackend.expectGET("views/carList.html");
    // } else if(scope.objectType === 'prospect') {
    //   httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("/api/prospects?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("/api/prospect-statuses?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.expectGET("/api/prospects?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   httpBackend.expectGET("/api/prospect-statuses?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    // } else if(scope.objectType === 'asset') {
    //   httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("/api/asset-types?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("/api/assets?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("views/carList.html").respond("");
    //   // httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   // httpBackend.expectGET("/api/asset-types?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   // httpBackend.expectGET("/api/assets?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   // httpBackend.expectGET("views/carList.html");
    // } else {
    //   httpBackend.whenGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x").respond('');
    //   httpBackend.whenGET("views/carList.html").respond("");
    //   httpBackend.expectGET("/api/cars?organizationId=3Qnv2pMAxLZqVdp7n8RZ0x");
    //   httpBackend.expectGET("views/carList.html");
    // }
  });

  afterEach(function() {
    // httpBackend.flush();
  });

  it('should get new fields to be logged', function () {
    var formData = {
      foo: {
        value: 'foo',
        log: false
      },
      bar: {
        value: 'bar',
        log: true
      }
    };

    var result = scope.getNewFieldsToLog(formData);
    expect(result).toEqual(['bar']);
    expect(result).not.toEqual(['foo', 'bar']);
    expect(result).not.toEqual(['foo']);
    expect(result).not.toEqual([]);
  });

  it("should return true if a field is to be hidden", function() {
    scope.fieldsToHide = ['foo', 'bar'];
    expect(scope.hide('foo')).toEqual(true);
    expect(scope.hide('bar')).toEqual(true);
    expect(scope.hide('baz')).toEqual(false);
  });

  it("should return true if a field is not to be logged", function() {
    scope.fieldsToNotLog = ['foo', 'bar'];
    expect(scope.dontLog('foo')).toEqual(true);
    expect(scope.dontLog('bar')).toEqual(true);
    expect(scope.dontLog('baz')).toEqual(false);
  });

  it("should return true if identifier is invalid", function() {
    var identifier = { value: null };
    expect(scope.invalidIdentifier(identifier)).toEqual(true);

    var identifier = { value: undefined };
    expect(scope.invalidIdentifier(identifier)).toEqual(true);

    var identifier = { value: 'foo' };
    expect(scope.invalidIdentifier(identifier)).toEqual(false);
  });

  it("should return true if identifier has changed", function() {
    scope.identifier = { value: 'foo' };
    scope.currentIdentifier = { value: 'bar' };
    expect(scope.identifierChanged()).toEqual(true);

    scope.identifier = { value: 'foo' };
    scope.currentIdentifier = { value: 'foo' };
    expect(scope.identifierChanged()).toEqual(false);
  });

  it("should disable add field button/input", function() {
    if(scope.objectType === 'asset') {
      
      scope.formData = { assetType: null };
      expect(scope.disableAddField()).toEqual(true);

      scope.formData = { assetType: undefined };
      expect(scope.disableAddField()).toEqual(true);

      scope.formData = { assetType: 'Gas Card' };
      expect(scope.disableAddField()).toEqual(false);
    } else {
      expect(scope.disableAddField()).toEqual(false);
    }
  });

  it("should build expression of object field", function() {
 
    var expressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*'}, { type: 'field', value: 'mileage' }]
    ctrl.buildExpression(expressionItems).then(function(expression) {
      expect(expression).toEqual("3.14*mileage");
    }); 
    
  });

  describe("hideExpressions - filter expressions which should be hidden from the form", function() {

    it("should filter function expression fields", function() {
      scope.fieldsToHide = [];
      scope.expressions = [];
      var expressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*'}, { type: 'field', value: 'mileage' }]
      var object = { 
        foo: { 
          expressionItems: expressionItems,
          type: 'function'
        } 
      };
      
      ctrl.hideExpressions(object).then(function() {
        expect(scope.fieldsToHide.length).toEqual(1);
        expect(ctrl.buildExpression).toHaveBeenCalled();
        expect(scope.expressions.length).toEqual(1);
      });
    });

    it("should filter inequality expression fields", function() {
      scope.fieldsToHide = [];
      scope.expressions = [];
      var leftExpressionItems = [{ type: 'constant', value: '3.14' }, { type: 'operator', value: '*'}, { type: 'field', value: 'mileage' }]
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
      
      ctrl.hideExpressions(object).then(function() {
        expect(scope.fieldsToHide.length).toEqual(1);
        expect(ctrl.buildExpression.calls.count()).toEqual(2);
        expect(ctrl.getInequalitySign).toHaveBeenCalled();
        expect(scope.expressions.length).toEqual(1);
      });
    });

    it("should not filter expressions for any other type", function() {
      scope.fieldsToHide = [];
      scope.expressions = [];
      var object = { 
        foo: { 
          type: 'text',
          dataType: 'text',
          value: 'foo',
          log: false
        } 
      };

      ctrl.hideExpressions(object).then(function() {
        expect(scope.fieldsToHide.length).toEqual(0);
        expect(ctrl.buildExpression).not.toHaveBeenCalled();
        expect(ctrl.getInequalitySign).not.toHaveBeenCalled();
        expect(scope.expressions.length).toEqual(0);
      });
    });
  });

  describe("set inequality sign", function() {
    it("should set the inequality sign to gt given 0", function() {
      expect(ctrl.getInequalitySign(0)).toBe('>');
    });

    it("should set the inequality sign to ge given 1", function() {
      expect(ctrl.getInequalitySign(1)).toBe('≥');
    });

    it("should set the inequality sign to lt given 2", function() {
      expect(ctrl.getInequalitySign(2)).toBe('<');
    });

    it("should set the inequality sign to le given 3", function() {
      expect(ctrl.getInequalitySign(3)).toBe('≤');
    });

    it("should set the inequality sign to ? given inappropriate id", function() {
      expect(ctrl.getInequalitySign(4)).toBe('?');
    });
  });

  describe("set methods and variables according to object type", function() {
    beforeEach(function() {
      httpBackend.expectGET("/api/.*");
    });
 
    it("should set for drivers", function() {
      if(scope.objectType === 'driver') {
        expect(scope.update).toEqual(driverHelpers.updateDriver);
        expect(scope.create).toEqual(driverHelpers.createDriver);
        expect(scope.save).toEqual(driverHelpers.saveDriver);
        expect(scope.getFormDataAndRepresentativeData).toEqual(driverHelpers.getFormDataAndRepresentativeData);

        // scope.$digest();
        // expect(ctrl.hideExpressions).toHaveBeenCalled();
      }
    });

    it("should set for cars", function() {
      if(scope.objectType === 'car') {
        expect(scope.update).toEqual(carHelpers.updateCar);
        expect(scope.create).toEqual(carHelpers.createCar);
        expect(scope.save).toEqual(carHelpers.saveCar);
        expect(scope.getFormDataAndRepresentativeData).toEqual(carHelpers.getFormDataAndRepresentativeData);

        // scope.$digest();
        // expect(carHelpers.getIdentifier).toHaveBeenCalled();
      }
    });

    it("should set for prospects", function() {
      if(scope.objectType === 'prospect') {
        expect(scope.update).toEqual(prospectHelpers.updateProspect);
        expect(scope.create).toEqual(prospectHelpers.createProspect);
        expect(scope.save).toEqual(prospectHelpers.saveProspect);
        expect(scope.getFormDataAndRepresentativeData).toEqual(prospectHelpers.getFormDataAndRepresentativeData);

        // scope.$digest();
        // expect(prospectHelpers.getProspectStatuses).toHaveBeenCalled();
      }
    });

    it("should set for assets", function() {
      if(scope.objectType === 'asset') {
        expect(scope.update).toEqual(assetHelpers.updateAsset);
        expect(scope.create).toEqual(assetHelpers.createAsset);
        expect(scope.save).toEqual(assetHelpers.saveAsset);

        // expect(assetHelpers.getAssetTypes).toHaveBeenCalled();

        // expect(scope.getFormDataAndRepresentativeData).toEqual(assetHelpers.getFormDataAndRepresentativeData);
      }
    });
  });

  describe("modal functions", function() {
    it("should reset the form", function() {
      expect(scope.reset).toBeDefined();
    });

    it("should close the modal on success", function() {
      expect(scope.ok).toBeDefined();
    });

    it("should dismiss the modal on cancel", function() {
      expect(scope.close).toBeDefined();
    });

    it("should open the add field modal", function() {
      expect(scope.addField).toBeDefined();
    });
  });
});
