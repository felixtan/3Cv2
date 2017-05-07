(function() {
  'use strict';

  angular.module('clientApp')
    .controller('ObjectsLogsCtrl', ['$q', '$uibModal', 'objectType', 'objectHelpers', 'datepicker', 'carHelpers', 'driverHelpers', 'prospectHelpers', 'assetHelpers', '$state', '_', '$window',
      function ($q, $uibModal, objectType, objectHelpers, datepicker, carHelpers, driverHelpers, prospectHelpers, assetHelpers, $state, _, $window) {

      var ctrl = this;
      ctrl.objectType = objectType;
      ctrl.datepicker = datepicker;
      ctrl.dummyNum = { value: null };

      // Helpers
      ctrl.getIdentifierValue = objectHelpers.getIdentifierValue
      ctrl.getStateRef = objectHelpers.getStateRef

      ctrl.getObjects = function () {
          if(ctrl.objectType === 'car') {
              ctrl.title = 'Car';
              ctrl.update = carHelpers.update;
              return carHelpers.get;
          } else if(ctrl.objectType === 'driver') {
              ctrl.title = 'Driver';
              ctrl.update = driverHelpers.update;
              return driverHelpers.get;
          } else if(ctrl.objectType === 'prospect') {
              ctrl.title = 'Prospect';
              ctrl.update = prospectHelpers.update;
              return prospectHelpers.get;
          } else if(ctrl.objectType === 'asset') {
              ctrl.update = assetHelpers.update;
              return assetHelpers.getTypes;
          }
      };

      ctrl.getLogDates = function () {
          if(ctrl.objectType === 'car') {
              return carHelpers.getLogDates;
          } else if(ctrl.objectType === 'driver') {
              return driverHelpers.getLogDates;
          } else if(ctrl.objectType === 'prospect') {
              return function () {};
          } else if(ctrl.objectType === 'asset') {
              return assetHelpers.getLogDates;
          }
      };

      ctrl.getAssetsOfTypeAndLogs = function (assetType) {
          ctrl.title = assetType;

          assetHelpers.getByType(assetType).then(function(result) {
            ctrl.objects = result.data;
          });

          ctrl.getLogDates()(assetType).then(function(dates) {
              ctrl.dates = dates;
              ctrl.getMostRecentLogDate();
          });
      };

      ctrl.getObjects()().then(function(result) {
          if (ctrl.objectType !== 'asset') {

              ctrl.objects = result.data;
              ctrl.getLogDates()().then(function(dates) {
                ctrl.dates = dates
                ctrl.getMostRecentLogDate()
              });
          } else {
              ctrl.assetTypes = result.data.types;
              ctrl.assetType = ctrl.assetTypes[0].value;
              ctrl.tabs = [];

              _.each(ctrl.assetTypes, function(assetType, index) {
                  ctrl.tabs.push({
                      title: assetType.value,
                      active: (index === 0),
                  });
              });

              ctrl.getAssetsOfTypeAndLogs(ctrl.assetType);
          }
      });



      ctrl.renderLogs = function (assetType) {
          // console.log(assetType);
          ctrl.assetType = assetType;
          ctrl.title = assetType;
          ctrl.getAssetsOfTypeAndLogs(ctrl.assetType);
      };

      ctrl.ifAssetIsOfType = function (object) {
          if (ctrl.objectType === 'asset') {
              return object.assetType === ctrl.assetType;
          } else {
              return true;
          }
      };

      ctrl.getMostRecentLogDate = function() {
          // return Math.max(...ctrl.dates); -> assuming unsorted

          // assuming sorted from recent to past
          if(ctrl.dates.length > 0) {
              ctrl.mostRecentLogDate = ctrl.dates[0];
          } else {
              ctrl.mostRecentLogDate = null;
          }
      };

      ctrl.getFieldsToBeLogged = function(object) {
          var fields = [];

          for (var field in object.data) {
              if (object.data[field].log) {
                fields.push(field);
              }
          }

          return fields;
      };

      // returns an object to be object.logs[i].data with keys (feilds) to be logged
      ctrl.newDataObj = function() {
          var data = {};
          var objects = (ctrl.objectType !== 'asset') ? ctrl.objects : assetHelpers.filterAssetsByType(ctrl.objects, ctrl.assetType);

          if (objects.length === 0) {
            alert("Sorry, there are no " + ctrl.objectType + "s.")
          } else {
            // first object is taken because fields in object.data are assumed to be uniform for all objects
            var fields = ctrl.getFieldsToBeLogged(objects[0]);

            _.each(fields, function(field) {
                data[field] = null;
            });
          }

          return data;
      };

      ctrl.createLogForObject = function(object, date, data) {
          if (!_.includes(ctrl.dates, date)) {
              object.logs.push({
                  createdAt: (new Date()),
                  weekOf: date,
                  data: data
              });
          }

          return object;
      };

      ctrl.newLog = function() {
          // 1. show date picker
          // 2. user picks date -> store in log.date
          // 3. start of week -> stored in log.weekStarting
          // 4. create for all objects
          // employ loading animation

          var d = ctrl.datepicker.dt;
          var weekOf = (new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).getTime();
          var blankDataObj = ctrl.newDataObj();
          var promises = [];

          _.each(ctrl.objects, function(object) {
              var objectToUpdate = ctrl.createLogForObject(object, weekOf, blankDataObj);
              promises.push(ctrl.update(objectToUpdate));
          });

          if(!_.includes(ctrl.dates, weekOf)) {
              $q.all(promises).then(function(values) {
                  ctrl.createNewRow(weekOf);
                  $state.forceReload();
              }).catch(function(err) {
                  console.error(err);
              });
          } else {
              // TODO: make this into a nice modal
              $window.alert('Log for ' + d.toDateString() + ' already exists!');
          }
      };

      // need to make this more efficient
      ctrl.save = function(logDate) {
          // if(ctrl.invalidEntries.length === 0) {
              var mostRecentLog = null;
              _.each(ctrl.objects, function(object) {
                  if (ctrl.objectType !== 'asset') {
                      if (logDate === ctrl.mostRecentLogDate) {
                          // update object.data is new value isn't null
                          mostRecentLog = _.find(object.logs, function(log) { return log.weekOf === ctrl.mostRecentLogDate; });
                          for(var field in mostRecentLog.data) {
                              if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') { object.data[field].value = mostRecentLog.data[field]; }
                          }
                      }
                  } else {
                      if (ctrl.assetType === ctrl.objectType) {
                          if (logDate === ctrl.mostRecentLogDate) {
                              // update object.data is new value isn't null
                              mostRecentLog = _.find(object.logs, function(log) { return log.weekOf === ctrl.mostRecentLogDate; });
                              for(var field in mostRecentLog.data) {
                                  if(mostRecentLog.data[field] !== null && typeof mostRecentLog.data[field] !== 'undefined') { object.data[field].value = mostRecentLog.data[field]; }
                              }
                          }
                      }
                  }

                  ctrl.update(object);
              });
          // }
      };

      ctrl.getLog = function (date) {
          return _.find(ctrl.object.logs, function(log) {
              return log.weekOf === date;
          });
      };

      // TODO: Refactor
    //   ctrl.invalidEntries = [];
    //   ctrl.validValue = true;
    //   ctrl.validate = function (newValue, oldValue, fieldName, _log_, _object_) {
    //       console.log(fieldName)
      //
    //       var object = _.find(ctrl.objects, function(object) { return object.id === _object_.id; }),
    //           fieldData = object.data[fieldName],
    //           log = _.find(object.logs, function(log) { return log.weekOf === _log_.weekOf; }),
    //           logData = log.data[fieldName];
      //
    //       if (fieldData.type === 'number' || fieldData.type === 'monetary') {
    //           logData = isNaN(newValue) ? oldValue : newValue;
    //           ctrl.validValue = isNaN(newValue);
    //       } else {
    //           ctrl.validValue = true;
    //       }
    //   };

      ctrl.createNewRow = function(date) {
          // add new date to array of log dates
          if (!_.includes(ctrl.dates, date)) {
            ctrl.dates.push(date);
          }
      };

      ctrl.open = function (size, thing) {
          var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'components/fields/deletemodal.html',
              controller: 'DeleteModalCtrl',
              controllerAs: 'deleteModal',
              size: size,
              resolve: {
                  thing: function() {
                      return thing;   // object { type: x, value: y } such that x ∈ ['field', 'log'] and y ∈ ctrl.fields or ctrl.dates
                  },
                  getObjects: function() {
                      return ctrl.objectType === 'asset' ? assetHelpers.filterAssetsByType(ctrl.objects, ctrl.assetType)
                                                           : ctrl.objects;
                  },
                  objectType: function () {
                      return ctrl.objectType;
                  },
              }
          });

          modalInstance.result.then(function (input) {
              ctrl.input = input;
              console.log('passed back from DeleteModalCtrl:', input);
          }, function () {
            //   console.log('Modal dismissed at: ' + new Date());
          });
      };
    }]);
})();
