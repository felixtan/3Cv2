'use strict';

describe('CarDataCtrl', function () {

  beforeEach(module('clientApp'));
  
  var controller, 
      scope, 
      dataService, 
      state, 
      carHelpers,
      modal,
      modalInstance,
      deferred,
      q;
      
  beforeEach(inject(function ($q, $modal, _carHelpers_, $rootScope, $controller, _dataService_, $state) {
      scope = $rootScope.$new();
      state = $state;
      dataService = _dataService_;
      modal = $modal;
      modalInstance = mockModalInstance;    // from helpers/modals.js
      carHelpers = _carHelpers_;
      q = $q;
      deferred = $q.defer();
      
      controller = $controller('CarDataCtrl', {
        $scope: scope,
        getCar:getCar,
        getCars: getCars
      });

      spyOn(dataService, 'updateCar');
      spyOn(dataService, 'getCar');
      spyOn(modal, 'open').and.returnValue(modalInstance);
  }));

  it('should direct to the correct url', function() {
    expect(state.href('carProfile.data', { id: 1 })).toEqual('#/car/1/data');
    // state.transitionTo('carProfile.data');
  });

  it("should have tabs between data and logs", function() {
    expect(scope.tabs).toBeDefined();
  });

  it("should have the correct tab activated", function() {
    expect(scope.tabs[0].active).toEqual(true);     // Data
    expect(scope.tabs[1].active).toEqual(false);    // Logs
  });

  it('should load the correct car (specified by id) to scope', function() {
    state.go('carProfile.data', { id: 2 });
    expect(dataService.getCar).toHaveBeenCalledWith('2');
    expect(scope.car.id).toEqual(1);
    // can't currently test that scope.car is correct here because scope.car is hard-coded
  });
  
  it('should load all the cars', function() {
    // field additions and deletions affect all cars
    expect(scope.cars).toBeDefined();
  });

  it("should store the identifier if there are cars", function() {
    if(scope.cars.length) {
      expect(scope.currentIdentifier.name).toEqual(scope.car.identifier);
      expect(scope.newIdentifier.name).toEqual(scope.car.identifier);
    } else {
      expect(scope.currentIdentifier.name).toBeNull();
      expect(scope.newIdentifier.name).toBeNull();
    }
  });

  describe('UPDATE:', function() {
    beforeEach(function() {
      spyOn(scope, 'checkIdentifier').and.callThrough();
      spyOn(scope, 'checkFieldName').and.callThrough();
      spyOn(scope, 'checkFieldValue').and.callThrough();
      spyOn(scope, 'checkLogValue').and.callThrough();
      spyOn(scope, 'updateIdentifier').and.callThrough();
      spyOn(scope, 'updateLogVal').and.callThrough();
      spyOn(scope, 'updateFieldName').and.callThrough();
      spyOn(scope, 'addFieldToLogs').and.callThrough();
    });

    // check identifier change
    it('should keep track of changes to identifier', function() {
      expect(scope.newIdentifier.name).toBeDefined();
      expect(scope.currentIdentifier.name).toBeDefined();
      expect(scope.identifierChanged).toBeDefined();
      expect(scope.checkIdentifier).toBeDefined();

      scope.checkIdentifier('new', 'current');
      expect(scope.newIdentifier.name).toEqual('new');
      expect(scope.currentIdentifier.name).toEqual('current');
    });

    it('should know if identifier was changed', function() {
      scope.checkIdentifier('new', 'current');
      expect(scope.identifierChanged()).toBe(true);
    });

    it('should know if identifier was not changed', function() {
      scope.checkIdentifier('current', 'current');
      expect(scope.identifierChanged()).toBe(false);
    });

    // check field name change
    it('should keep track of changes to field name', function() {
      expect(scope.newFieldName).toBeDefined();
      expect(scope.currentFieldName).toBeDefined();
      expect(scope.checkFieldName).toBeDefined();
      expect(scope.fieldNameChanged).toBeDefined();

      scope.checkFieldName('new', 'current');
      expect(scope.newFieldName).toEqual('new');
      expect(scope.currentFieldName).toEqual('current');
    });

    it('should know if a field name was changed', function() {
      scope.checkFieldName('new', 'current');
      expect(scope.fieldNameChanged()).toBe(true);
    });

    it('should know if a field name was not changed', function() {
      scope.checkFieldName('current', 'current');
      expect(scope.fieldNameChanged()).toBe(false);
    });

    // check field value change
    it('should keep track of changes to field value', function() {
      expect(scope.newFieldVal).toBeDefined();
      expect(scope.currentFieldVal).toBeDefined();
      expect(scope.checkFieldValue).toBeDefined();
      expect(scope.fieldValChanged).toBeDefined();

      scope.checkFieldValue('new', 'current');
      expect(scope.newFieldVal).toEqual('new');
      expect(scope.currentFieldVal).toEqual('current');
    });

    it('should know if a field value was changed', function() {
      scope.checkFieldValue('new', 'current');
      expect(scope.fieldValChanged()).toBe(true);
    });

    it('should know if a field value was not changed', function() {
      scope.checkFieldValue('current', 'current');
      expect(scope.fieldValChanged()).toBe(false);
    });

    // check log value change
    it('should keep track of changes to log value', function() {
      expect(scope.newLogVal).toBeDefined();
      expect(scope.currentLogVal).toBeDefined();
      expect(scope.checkLogValue).toBeDefined();
      expect(scope.logValChanged).toBeDefined();

      scope.checkLogValue('new', 'current');
      expect(scope.newLogVal).toEqual('new');
      expect(scope.currentLogVal).toEqual('current');
    });

    it('should know if a log value was changed', function() {
      scope.checkLogValue('new', 'current');
      expect(scope.logValChanged()).toBe(true);
    });

    it('should know if a log value was not changed', function() {
      scope.checkLogValue('current', 'current');
      expect(scope.logValChanged()).toBe(false);
    });

    describe('Mutation methods', function() {
      it("should update a car's field name and identifier if they changes", function() {
        var licenseNumberData = scope.car.data['licenseNumber'];
        
        scope.checkIdentifier('licenseNumber', 'licensePlate');
        scope.checkFieldName('licenseNumba', 'licenseNumber');

        scope.updateFieldName(scope.car).then(function(car) {
          expect(scope.updateFieldName).toHaveBeenCalled();
          expect(car.identifier).toEqual(scope.newFieldName);
          expect(car.data['licenseNumba']).toBeDefined();
          expect(car.data['licenseNumba']).toEqual(licenseNumberData);
          expect(car.data['licenseNumber']).not.toBeDefined();
        });
      });

      it("should update a car's field name and not identifier if only it changes", function() {
        var licenseNumberData = scope.car.data['licenseNumber'];
        
        scope.checkIdentifier('licensePlate', 'licensePlate');
        scope.checkFieldName('licenseNumba', 'licenseNumber');

        scope.updateFieldName(scope.car).then(function(car) {
          expect(scope.updateFieldName).toHaveBeenCalled();
          expect(car.identifier).toEqual(scope.currentIdentifier);
          expect(car.data['licenseNumba']).toBeDefined();
          expect(car.data['licenseNumba']).toEqual(licenseNumberData);
          expect(car.data['licenseNumber']).not.toBeDefined();
        });
      });

      it("should update a car's field log value if it changes", function() {
        var oldLogVal = scope.car.data['licenseNumber'].log;

        scope.checkFieldName('licenseNumber', 'licenseNumber');
        scope.checkLogValue(true, false);
        scope.updateLogVal(scope.car).then(function(car) {
          expect(scope.updateLogVal).toHaveBeenCalled();
          expect(car.data['licenseNumber'].log).toBe(!oldLogVal);
        });
      });

      it("should be able to add field to all logs if the log value changes to true", function() {
        var currentNumLoggedFields = Object.keys(scope.car.logs[0].data).length;
        
        scope.addFieldToLogs(scope.car, 'licenseNumber').then(function(car) {
          expect(scope.addFieldToLogs).toHaveBeenCalledWith(scope.car, 'licenseNumber');
          
          _.each(car.logs, function(log) {
            expect(log.data['licenseNumber']).toBeDefined();
            expect(log.data['licenseNumber']).toBeNull();
          });

          var newNumLoggedFields = Object.keys(car.logs[0].data).length;
          expect(newNumLoggedFields).toEqual(currentNumLoggedFields+1);
        });
      });

      it("should update a car's identifier if it changes", function() {
        scope.checkIdentifier('licenseNumber' ,'licensePlate');
        scope.updateIdentifier(scope.car).then(function(car) {
          expect(scope.updateIdentifier).toHaveBeenCalled();
          expect(car.identifier).toEqual('licenseNumber');
        });
      });
    });

    describe('Save:', function() {
      beforeEach(function() {
        // spyOn(this, 'setData').and.callThrough();
        spyOn(scope, 'identifierChanged').and.callThrough();
        spyOn(scope, 'fieldNameChanged').and.callThrough();
        spyOn(scope, 'logValChanged').and.callThrough();
        spyOn(scope, 'fieldValChanged').and.callThrough();
        spyOn(scope, 'save').and.callThrough();
        spyOn(carHelpers, 'updateIdentifier');    // need this whenever calling save or else I get 
                                                  // Error: Cannot transition to abstract state '[object Object]'
                                                  // The error occurs when .and.callThrough() is added
        
        scope.newIdentifier.name = scope.currentIdentifier.name = scope.car.identifier;
        scope.newFieldName = scope.currentFieldName = 'mileage';
        scope.newLogVal = scope.currentLogVal = scope.car.data[scope.currentFieldName].log;
        scope.newFieldVal = scope.currentFieldVal = scope.car.data[scope.currentFieldName].value;

        // use this to set the data input to save after making changes to the above variable values
        this.setData = function() {
          return {    
            name: scope.newFieldName,     // turns out only name is used in save, it doesn't even used field parameter
            value: scope.newFieldVal,
            log: scope.newLogVal
          }
        }

        // tried to put these in afterEach
        // tests will fail saying expected spied to have been called
        this.expectChangeCheckMethodCalls = function() {
          expect(scope.save).toHaveBeenCalled();
          expect(scope.identifierChanged).toHaveBeenCalled();
          expect(scope.fieldNameChanged).toHaveBeenCalled();
          expect(scope.logValChanged).toHaveBeenCalled();
          expect(scope.fieldValChanged).toHaveBeenCalled();
        }
      });

      it('should have a save method', function() {
        expect(scope.save).toBeDefined();
      });

      /*
        Save decision tree for if else chain
        1. field value changed
        2. log value changed
        3. field name changed     (if this is true, enact it last)
        4. identifier changed     (or if this is true, enact it last?)

        4 bit string truth value of each
        1234
      */

      // 0000
      it('should do nothing if nothing changes', function() {
        var data = this.setData();
        scope.save(data);
        
        // change checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(false);

        expect(dataService.updateCar.calls.count()).toEqual(0);

        this.expectChangeCheckMethodCalls();
      });

      // 0001
      it('should update identifier for all cars if only it changes', function() {
        scope.newIdentifier.name = 'licenseNumber';
        var data = this.setData();

        scope.save(data);

        // change checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(false);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 0010
      it("should update field name for all cars if only it changes", function() {
        scope.newFieldName = 'miles';
        var data = this.setData();  

        scope.save(data);
        
        // checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(false);

        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });
      
      // 0011
      it("should update field name and identifier for all cars if they change", function() {
        scope.newFieldName = 'miles';
        scope.newIdentifier.name = 'licenseNumber';
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(false);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 0100
      it("should update log value for all cars if only it changes", function() {
        scope.newLogVal = !scope.newLogVal;
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(false);

        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);
        // scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 0101
      it("should update log value for present car only and identifier for all cars if they change", function() {
        scope.newIdentifier.name = 'licenseNumber';
        scope.newLogVal = !scope.newLogVal;
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(false);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);       // doesn't work for some reason because its called from within another promise
        // scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 0110
      it("should update log value and field name for all cars if they change", function() {
        scope.newFieldName = 'miles';
        scope.newLogVal = !scope.newLogVal;
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(false);

        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);
        // scope.$digest();
        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 0111
      it("should update log value, field name, and identifier for all cars if they change", function() {
        scope.newFieldName = 'miles';
        scope.newLogVal = !scope.newLogVal;
        scope.newIdentifier.name = 'licenseNumber';
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(false);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);
        // scope.$digest();
        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 1000
      it("should update field value for present car only if only it changes", function() {
        scope.newFieldVal = 20000;
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(true);

        expect(dataService.updateCar.calls.count()).toEqual(1);

        this.expectChangeCheckMethodCalls();
      });

      // 1001
      it("should update field value for present car only and identifier for all cars", function() {
        scope.newFieldVal = 20000;
        scope.newIdentifier.name = 'licenseNumber';
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(true);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 1010
      it("should update field value for present car only and field name for all cars", function() {
        scope.newFieldVal = 20000;
        scope.newFieldName = 'miles';
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(true);

        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 1011
      it("should update field value for present car only, field name and identifier for all cars", function() {
        scope.newFieldName = 'miles';
        scope.newIdentifier.name = 'licenseNumber';
        scope.newFieldVal = 20000;
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(false);
        expect(scope.fieldValChanged()).toBe(true);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 1100
      it("should update field value for present car only, log value for call cars", function() {
        scope.newFieldVal = 20000;
        scope.newLogVal = !scope.newLogVal;
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(true);

        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);
        // scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 1101
      it("should update field value for present car only, log value and identifier for call cars", function() {
        scope.newFieldVal = 20000;
        scope.newLogVal = !scope.newLogVal;
        scope.newIdentifier.name = 'licenseNumber';
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(false);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(true);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);
        // scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 1110
      it("should update field value for present car only, log value and field name for call cars", function() {
        scope.newFieldVal = 20000;
        scope.newLogVal = !scope.newLogVal;
        scope.newFieldName = 'miles';
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(false);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(true);

        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);
        // scope.$digest();
        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });

      // 1111
      it("should update field value for present car only, log value, identifier, and field name for call cars", function() {
        scope.newFieldVal = 20000;
        scope.newLogVal = !scope.newLogVal;
        scope.newFieldName = 'miles';
        scope.newIdentifier.name = 'licenseNumber';
        var data = this.setData();

        scope.save(data);

        // checkers
        expect(scope.identifierChanged()).toBe(true);
        expect(scope.fieldNameChanged()).toBe(true);
        expect(scope.logValChanged()).toBe(true);
        expect(scope.fieldValChanged()).toBe(true);

        expect(scope.updateIdentifier.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(scope.updateLogVal.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        // expect(scope.addFieldToLogs.calls.count()).toEqual(scope.cars.length);
        // scope.$digest();
        expect(scope.updateFieldName.calls.count()).toEqual(scope.cars.length);
        scope.$digest();
        expect(dataService.updateCar.calls.count()).toEqual(scope.cars.length);

        this.expectChangeCheckMethodCalls();
      });
    });
  });

  describe("Modals", function() {
    it("should open a modal for add field UI", function() {
      expect(scope.addField).toBeDefined();
      scope.addField();
      expect(modal.open).toHaveBeenCalled();
    });

    it("should open a modal for assignment UI", function() {
      expect(scope.assign).toBeDefined();
      scope.assign();
      expect(modal.open).toHaveBeenCalled();
    });

    it("should open a modal for editing expression UI", function() {
      expect(scope.editExpression).toBeDefined();
      scope.editExpression();
      expect(modal.open).toHaveBeenCalled();
    });
  });

  describe("Edit expression", function() {
    beforeEach(function() {
      spyOn(scope, 'validateExpression').and.callThrough();
      spyOn(scope, 'buildExpression').and.callThrough();
    });

    it("should validate an expression in order to display its value", function() {
      expect(scope.validateExpression).toBeDefined();
    });

    it("should build an expression given array of expression items", function() {
      expect(scope.buildExpression).toBeDefined();
    });
  });
});
