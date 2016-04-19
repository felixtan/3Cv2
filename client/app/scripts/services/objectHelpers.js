'use strict';

/**
 * @ngdoc service
 * @name clientApp.carHelpers
 * @description
 * # carHelpers
 * Factory in the clientApp.
 */
angular.module('clientApp')
    .factory('objectHelpers', function ($rootScope, ENV, $q, dataService, $state, carHelpers, driverHelpers, prospectHelpers, assetHelpers) {

        return {
            isValid: isValid,
            simplify: simplify,
            simplifyOne: simplifyOne,
            getInequalitySign: getInequalitySign,
            updateExpressionFieldsIfFieldNameChanged: updateExpressionFieldsIfFieldNameChanged,
            updateExpressionNameInFields: updateExpressionNameInFields,
            updateFieldNameInExpressions: updateFieldNameInExpressions,
            storeFieldsUsed: storeFieldsUsed,
            evaluateExpressionAndAppendValue: evaluateExpressionAndAppendValue,
            evaluateExpressions: evaluateExpressions,
            removeFieldFromExpressions: removeFieldFromExpressions,
            buildDisplayExpression: buildDisplayExpression,
            buildEvalExpression: buildEvalExpression,
            updateDisplayExpressions: updateDisplayExpressions,
            updateFieldValueAndExpressionValues: updateFieldValueAndExpressionValues,
            updateDataIfFieldNameChanged: updateDataIfFieldNameChanged,
            getFormDataAndReference: getFormDataAndReference,
        }

        /*
            Used in a loop over objects and updates the field value
            and relevant expression fields for a specified object
        */
        function updateFieldValueAndExpressionValues (value, field, object, id) {
            // console.log(value);
            // console.log(field);
            // console.log(object);
            // console.log(id);
            var deferred = $q.defer(),
                fieldData = object.data[field];

            if(object.id === id) {
                if(fieldData.type === 'number' || fieldData.type === 'function') {
                    if (fieldData.type === 'number') fieldData.value = value;
                    
                    _.each(fieldData.expressionsUsedIn, function(data, expression) {
                        // console.log(data);
                        console.log(expression);
                        evaluateExpressionAndAppendValue(object.data, expression).then(function(objectData) {
                            // console.log(expression);
                            // console.log(objectData);
                            object.data = objectData;
                        });
                    });

                    deferred.resolve(object);
                    deferred.reject(new Error("Error updating field value and updating expressions"));
            
                } else if (fieldData.type === 'text' || fieldData.type === 'boolean') {
                    fieldData.value = value;
                    deferred.resolve(object);
                    deferred.reject(new Error("Error updating field value and updating expressions"));
                } else {
                    deferred.resolve(object);
                    deferred.reject(new Error("Error updating field value and updating expressions"));
                }
            } else {
                deferred.resolve(object);
                deferred.reject(new Error("Error updating field value and updating expressions: irrelevant object id"));
            }

            return deferred.promise;
        };

        function updateDisplayExpressions (object) {
            var deferred = $q.defer();
            // console.log($scope.objects);
            _.each(object.data, function(data, field) {
                if(data.type === 'function') {
                    // console.log(field);
                    buildDisplayExpression(data.expressionItems).then(function(expression) {
                        // console.log('built expression', expression);
                        data.expression = expression;
                    });
                } else if(data.type === 'inequality') {
                    // console.log(field);
                    buildDisplayExpression(data.leftExpressionItems).then(function(leftExpression) {
                        buildDisplayExpression(data.rightExpressionItems).then(function(rightExpression) {
                            // console.log(leftExpression);
                            // console.log(rightExpression);
                            data.leftExpression = leftExpression;
                            data.inequalitySign = getInequalitySign(data.inequalitySignId);
                            data.rightExpression = rightExpression;
                        });
                    });
                }
            });

            deferred.resolve(object);
            deferred.reject(new Error('Error building or storing expression'));
            return deferred.promise;
        };

        function buildDisplayExpression (expressionItems) {
            var deferred = $q.defer();
            var expression = '';
            
            _.each(expressionItems, function(item) {
                expression += item.value;
                // console.log(expression);
            });

            deferred.resolve(expression);
            deferred.reject(new Error('Error building expression'));
            return deferred.promise;
        };

        function removeFieldFromExpressions (object, fieldName) {
            var deferred = $q.defer(),
                fieldData = object.data[fieldName];
            // console.log(object);
            // console.log(fieldName);     // func/num field
            // console.log(fieldData);
            if(typeof fieldData !== 'undefined') {
                _.each(fieldData.expressionsUsedIn, function(locations, expressionField) {
                    // console.log(locations);
                    // console.log(expressionField);
                    _.each(locations, function(location, locationField) {
                        // console.log(location);
                        // console.log(locationField);
                        _.each(location, function(indices, expressionItems) {
                            // console.log(indices);
                            // console.log(expressionItems);

                            _.each(indices, function(indexOfItem, indexOfIndex) {
                                // console.log(indexOfItem);
                                // console.log(indexOfIndex);

                                // console.log(object.data[expressionField]);
                                // console.log(object.data[expressionField][expressionItems]);

                                object.data[expressionField][expressionItems].splice(indexOfItem, 1);                                   // remove item from expression items

                                // console.log(object.data[expressionField]);
                                // console.log(object.data[expressionField].fieldsUsed);
                                object.data[expressionField].fieldsUsed[fieldName].locations[expressionItems].splice(indexOfIndex, 1);     // remove index of field from expressionField's memory
                                // fieldData.expressionsUsedIn[expressionField].locations[expressionItems].splice(indexOfIndex, 1);            // no point in running this because field is getting deleted anyway
                            });
                        });
                    });
                });
            }

            deferred.resolve(object);
            deferred.reject(new Error("Error removing " + fieldName + " from functions and inequalities"));
            return deferred.promise;
        };

        function isValid (value) {
            return value !== null && typeof value !== "undefined";
        };

        /*
            inputs
                1. array of expression objects
                    ex. [{ name: expr, expression: expression }, ...]
                2. object that owns the expressions
            outputs
                1. object with evaluated expression values
            assumptions
                1. expression values evaluate to null if any one field used is null
        */
        function evaluateExpressions (expressions, object) {
            var deferred = $q.defer();

            if(typeof expressions === 'undefined') {
                _.filter(object.data, function(data, field) {
                    return data.type === 'function' || data.type === 'inequality';
                }).each(function(data, field) {
                    evaluateExpressionAndAppendValue(object.data, field, object).then(function(objectDataWithUpdatedExpressions) {
                        // console.log(objectDataWithUpdatedExpressions);
                        object.data = objectDataWithUpdatedExpressions;
                    });
                });
            } else {
                _.each(expressions, function(expression) {
                    var expressionFieldName = expression.field || expression.name;
                    // console.log(object);
                    evaluateExpressionAndAppendValue(object.data, expressionFieldName, object).then(function(objectDataWithUpdatedExpressions) {
                        // console.log(objectDataWithUpdatedExpressions);
                        object.data = objectDataWithUpdatedExpressions;
                    });
                });
            }

            deferred.resolve(object);
            deferred.reject(new Error("Error evaluating expressions"));
            return deferred.promise;
        };

        function simplify (objects) {
            return _.map(objects, function(object) {
                // console.log(object.id);
                // console.log(object.identifier);
                // console.log(object.data);
                return {
                    id: object.id,
                    identifier: object.identifier,
                    identifierValue: object.data[object.identifier].value,
                    assetType: ((typeof object.assetType !== 'undefined') && (object.assetType !== null) && (typeof object.assetType === 'string')) ? object.assetType : null,
                };
            });
        };

        function simplifyOne (object) {
            return {
                id: object.id,
                identifier: object.identifier,
                identifierValue: object.data[object.identifier].value,
                assetType: (!(object.assetType === null) && (typeof object.assetType === 'string')) ? object.assetType : null,
            };
        };

        function getInequalitySign (signId) {
            switch(parseInt(signId)) {
                case 0:
                    return ">";
                    break;
                    case 1:
                    return '>=';
                    break;
                case 2:
                    return '<';
                    break;
                case 3:
                    return '<=';
                    break;
                default:
                    return '?';
                    break;
            }
        };

        function evaluateExpressionAndAppendValue (objectData, fieldName, object) {
          var deferred = $q.defer(),
              // newFieldData = {},
              inequalitySign = "";

                                                        // this was the key to solving the problem where expression value
          // angular.copy(object.data[field], newFieldData);       // for car 2 was being saved to both cars 2 and 3
          // console.log(objectData);
          // console.log(fieldName);
          if(objectData[fieldName].type === 'function') {
            buildEvalExpression(objectData, objectData[fieldName].expressionItems).then(function(expression) {
              console.log(expression);

              objectData[fieldName].value = isValid(expression) ? $rootScope.$eval(expression) : null;

              // 2nd degree changes
                // evaluateExpressions(objectData[fieldName].expressionsUsedIn, object);

              deferred.resolve(objectData);
              deferred.reject(new Error('Error evaluating expression'));
            });
          } else if(objectData[fieldName].type === 'inequality') {
            buildEvalExpression(objectData, objectData[fieldName].leftExpressionItems).then(function(leftExpression) {
              buildEvalExpression(objectData, objectData[fieldName].rightExpressionItems).then(function(rightExpression) {
                inequalitySign = getInequalitySign(objectData[fieldName].inequalitySignId);                       
                
                // console.log(leftExpression);
                // console.log(rightExpression);
                // console.log(inequalitySign);

                objectData[fieldName].value = (isValid(leftExpression) && isValid(inequalitySign) && isValid(rightExpression)) ? $rootScope.$eval(leftExpression + inequalitySign + rightExpression) : null;

                // 2nd degree changes
                // evaluateExpressions(objectData[fieldName].expressionsUsedIn, object);

                deferred.resolve(objectData);
                deferred.reject(new Error('Error evaluating expression'));
              });
            });
          } else {
            deferred.resolve(objectData);
            deferred.reject(new Error('Error evaluating expression'));
          }
          
          return deferred.promise;
        };

        function updateDataIfFieldNameChanged (oldName, newName, object) {
            var deferred = $q.defer();    

            if(oldName !== newName) {
                object.data[newName] = object.data[oldName];
                delete object.data[oldName];
            }
            // console.log(object);
            deferred.resolve(object);
            deferred.reject(new Error("Error changing field name " + oldName + " to " + newName));
            return deferred.promise;
        };

        // This is only used in editFieldModal.js as far as I can can tell so it's a waste puttin it here
        function updateExpressionFieldsIfFieldNameChanged (oldName, newName, objectData, objectId) {
            var deferred = $q.defer();

            if(oldName !== newName) {
                replaceFieldNameInExpressions(oldName, newName, objectData).then(function(objectDataWithUpdatedExpressions) {
                    // console.log(objectDataWithUpdatedExpressions);
                    _.each(objectDataWithUpdatedExpressions, function(data, field, list) {
                        if(data.type === 'function') {
                            // console.log('list?', list);
                            buildEvalExpression(list, data.expressionItems, objectId).then(function(expression) {
                                objectData[field].value = $rootScope.$eval(expression);
                            });
                        } else if(data.type === 'inequality') {
                            // console.log('list?', list);
                            buildEvalExpression(list, data.leftExpressionItems, objectId).then(function(leftExpression) {
                                buildEvalExpression(list, data.rightExpressionItems, objectId).then(function(rightExpression) {
                                    var inequalitySign = getInequalitySign(data.inequalitySignId);
                                    objectData[field].value = $rootScope.$eval(leftExpression+inequalitySign+rightExpression);
                                });
                            });
                        }
                    });
                });
            };

            deferred.resolve(objectData);
            deferred.reject(new Error("Error updating expressions"));
            return deferred.promise;
        };

        function replaceFieldNameInExpressions (oldName, newName, objectData) {
          var deferred = $q.defer();
      
          // console.log('field name changed, checking if expressions should be updated');
          _.each(objectData, function(data, field, list) {
            // console.log(data);
            // console.log(field);
            // console.log(list);
            if(data.type === 'function') {
              // console.log(data);
              // console.log(field);
              
              data.expression = _.each(data.expressionItems, function(item) {
                if(item.type === 'field' && item.value === oldName) {
                  item.value = newName;
                  data.fieldsUsed[newName] = data.fieldsUsed[oldName];
                  delete data.fieldsUsed[oldName];
                }
              }).reduce(function(memo, item) {
                return memo + item.value;
              }, "");

              // console.log('expression:', data.expression);
              // console.log('expressionItems:', data.expressionItems);
            } else if(data.type === 'inequality') {
              // console.log(data);
              // console.log(field);
              
              data.leftExpression = _.each(data.leftExpressionItems, function(item) {
                if(item.type === 'field' && item.value === oldName) item.value = newName;
              }).reduce(function(memo, item) {
                return memo + item.value;
              }, "");

              data.rightExpression = _.each(data.rightExpressionItems, function(item) {
                if(item.type === 'field' && item.value === oldName) item.value = newName;
              }).reduce(function(memo, item) {
                return memo + item.value;
              }, "");

              data.inequalitySign = getInequalitySign(data.inequalitySignId);
              data.fieldsUsed[newName] = data.fieldsUsed[oldName];
              delete data.fieldsUsed[oldName];

              // console.log('expression:', data.expression);
              // console.log('leftExpressionItems:', data.leftExpressionItems);
              // console.log('rightExpressionItems:', data.rightExpressionItems);
            }
          });

          deferred.resolve(objectData);
          deferred.reject(new Error("Error replacing " + oldName + " with " + newName + " for expressions in " + $rootScope.objectType));
          return deferred.promise;
        }

        function buildEvalExpression (objectData, expressionItems, objectId) {
            var deferred = $q.defer(),
                expression = "";
            // console.log(fieldData);
            // console.log(expressionItems);
            _.each(expressionItems, function(item) {
                if(item.type === 'field') {
                // console.log(item);
                // console.log(objectData);
                // console.log(objectData[item.value]);

                    if(isValid(objectData[item.value].value)) {
                        expression += objectData[item.value].value;
                    } else {
                        deferred.resolve(null);
                    }
                } else {
                    expression += item.value;          
                }
            });

            deferred.resolve(expression);
            deferred.reject(new Error('Error building evaluation expression'));
            return deferred.promise;
        };

        /*
            Updates the array in field's data containing the func/ineq fields that it is used in
            when the name of function/ineq field changes.

            input: old function/ineq field name, new function/ineq field name, object
            output: object with updated field data
            assumptions:
                1. field name change has already taken effect
                2. function and ineq fields store array of fields used in expressions
        */
        function updateExpressionNameInFields (oldName, newName, object) {
            var deferred = $q.defer();

            /*
                fieldsUsed will be 
                    1. an array of objects
                    2. a property of func/ineq fields

                ex.
                [
                    {
                        name: fieldName,
                        locations: subset of [expressionItems, leftExpressionItems, rightExpressionItems]
                    }
                ]
            */
            _.each(object.data[oldName].fieldsUsed, function(field) {
                _.where(object.data[field.name].expressionsUsedIn, { name: oldName }).each(function(expressionField) {
                    expressionField.name = newName;
                });
            });

            deferred.resolve(object);
            deferred.reject(new Error("Error replacing " + oldName + " with " + newName + " for expressionsUsedIn for field " + field));
            return deferred.promise
        };

        /*  
            Updates the expressionItems and expressions of func/ineq fields when the name of a
            field they use is changed. Use when name of field (any type) changes

            input: old field name, new field name, object
            output: object with updated expressions
            assumptions: 
                1. field name change has already taken effect
                2. functions and inequalities store array of fields used
                3. fields of all type store array of functions/inequalities they are used in
        */
        function updateFieldNameInExpressions (oldName, newName, object) {
              var deferred = $q.defer();

              /* 
                expressionsUsedIn will be 
                    1. an an array of objects
                    2. a property of all number/func fields

                ex.
                [
                    {
                        name: fieldName,
                        locations: subset of [expressionItems, leftExpressionItems, rightExpressionItems]
                    }
                ]
              */
              _.each(object.data[oldName].expressionsUsedIn, function(expressionField) {
                _.each(expressionField.locations, function(expressionItems) {
                    var expression = _.where(object.data[expressionField.name][expressionItems], { type: 'field', value: oldName }).each(function(item) {
                        item.value = newName;
                    }).reduce(function(memo, item) {
                        return memo + item.value;
                    }, "");

                    if(expressionItems === 'leftExpressionItems') {
                        object.data[expressionField.name].leftExpression = expression;
                    } else if(expressionItems === 'rightExpressionItems') {
                        object.data[expressionField.name].rightExpression = expression;
                    } else if(expressionItems === 'expressionItems') {
                        object.data[expressionField.name].expression = expression;
                    } else {
                        throw Error("Error: unknown expressionItems for " + expressionField.name + " " + expressionItems);
                    }
                });
              });
                
              deferred.resolve(object);
              deferred.reject(new Error("Error replacing " + oldName + " with " + newName + " for fields used in expressions " + expressionField.name));
              return deferred.promise;
        };


        /*
            Stores the expression fields that use fieldName in an array of objects.
            Use when creating or updating a func/ineq field.

            inputs: 
                1. object with created/updated func/ineq field
                2. reduced; the output of function pairItemsWithIndicesInExpressionItems
                3. field name of relevant func/ineq using the field
            output: object with created/updated func/ineq field storing fields used
        */
        function storeExpressionsUsedIn (objectData, reduced, fieldName) {
            var deferred = $q.defer();
            // console.log(fieldName);
            // console.log(reduced);
            // console.log(object);
            _.each(reduced, function(data, field) {
                // console.log(data);
                // console.log(field);
                // console.log(objectData);
                objectData[field].expressionsUsedIn[fieldName] = data;
                // console.log(objectData);
                // objectData[field].expressionsUsedIn[fieldName].taint = "prevents json circular structure error";
                // console.log(objectData);
            });

            deferred.resolve(objectData);
            deferred.reject(new Error("Error storing expression" + fieldName + " using in field data"));
            return deferred.promise;
        };

        /*
          Stores the fields used by a func/ineq in an array of objects.
          Use when creating or updating a func/ineq field.

            inputs: 
                1. object with created/updated func/ineq field
                2. fieldname of relevant func/ineq field
            output: object with created/updated func/ineq field storing fields used
        */
        function storeFieldsUsed (object, fieldName) {
            // console.log(object);
            // console.log(fieldName);

            var deferred = $q.defer(),
                objectData = (isValid(object.id) && isValid(object.organizationId)) ? object.data : object,
                fieldData = objectData[fieldName];                      // ctrl.addProspectFieldsToExistingDrivers in objectData.js
                                                                        // sends object data instead of object
            if(fieldData.type === 'function') {
                var expressionItems = fieldData.expressionItems;

                // console.log(object);
                // console.log(fieldName);
                pairItemsWithIndicesInExpressionItems(expressionItems).then(function(reduced) {
                    // console.log(reduced);
                    fieldData.fieldsUsed = reduced;
                    storeExpressionsUsedIn(objectData, reduced, fieldName).then(function(updatedObjectData) {
                        object.data = updatedObjectData;
                        deferred.resolve(object);
                        deferred.reject(new Error("Error storing fields used by " + fieldName));
                    });
                });
            } else if(fieldData.type === 'inequality') {
                var leftExpressionItems = fieldData.leftExpressionItems,
                    rightExpressionItems = fieldData.rightExpressionItems;

                // console.log(object);
                // console.log(fieldName);
                pairItemsWithIndicesInExpressionItems(leftExpressionItems).then(function(leftReduced) {
                    pairItemsWithIndicesInExpressionItems(rightExpressionItems, leftReduced).then(function(reduced) {
                        // console.log(reduced);
                        fieldData.fieldsUsed = reduced;
                        storeExpressionsUsedIn(objectData, reduced, fieldName).then(function(updatedObjectData) {
                            object.data = updatedObjectData;
                            deferred.resolve(object);
                            deferred.reject(new Error("Error storing fields used by " + fieldName));
                        });
                    });
                });

            } else {
                deferred.resolve(object);
                deferred.reject(new Error("Error: " + fieldName + " has invalid type. This works only for function and inequality fields."));
            }

            return deferred.promise;
        };

        function fieldIsStored (fieldsUsed, item) {
            _.each(fieldsUsed, function(field, index, list) {
                if(field.name === item.value) {
                    return true;
                } else if(index === fieldsUsed.length-1) {
                    return false;
                }
            });
        };

        /*
            returns an object like this
            {
                field1: {
                    locations: {
                        expressionItems: [0, 2],
                    }
                },
                field2: {
                    locations: {
                        leftExpressionItems: [3],
                        rightExpressionItems: [1]
                    }
                }
                .
                .
                .
            }
        */
        function pairItemsWithIndicesInExpressionItems (expressionItems, reduced) {
            var deferred = $q.defer(),
                reduced = reduced || {};

            _.each(expressionItems, function(item, index) {
                var location = item.location;

                if(item.type === 'field' && !_.has(reduced, item.value)) {
                    if(_.isEmpty(reduced) || _.isEmpty(reduced[item.value])) {
                        reduced[item.value] = { locations: {} };
                    }

                    reduced[item.value].locations[location] = [];
                    reduced[item.value].locations[location].push(index);
                    // console.log(item);

                } else if(item.type === 'field' && _.has(reduced, item.value)) {
                    if(_.isEmpty(reduced[item.value].locations[location])) {
                        reduced[item.value].locations[location] = [];
                    }

                    reduced[item.value].locations[location].push(index);
                    // console.log(item);
                }
            });

            deferred.resolve(reduced);
            deferred.reject(new Error("Error pairing field with indices in expression items"));
            return deferred.promise;
        };

        /*
            Used when creating a new field
        */
        function getFormDataAndReference (objectType, assetType) {
            var deferred = $q.defer(),
                objectData,
                formData = {},
                get,
                getDefaultObject,
                object;

            if (objectType === 'car') {
                get = carHelpers.get;
                getDefaultObject = carHelpers.getDefaultCar;
            } else if (objectType === 'driver') {
                get = driverHelpers.get;
                getDefaultObject = driverHelpers.getDefaultDriver;
            } else if (objectType === 'prospect') {
                get = prospectHelpers.get;
                getDefaultObject = prospectHelpers.getDefaultProspect;
            } else if (objectType === 'asset') {
                get = assetHelpers.getByType;
                getDefaultObject = assetHelpers.getDefaultAsset;
            } else {
                deferred.reject(undefined);
            }

            get(assetType).then(function(result) {
                console.log(result);
                if(isValid(result.data)) {
                    if(result.data.length > 0) {
                        object = result.data[0];
                        objectData = object.data;

                        _.each(objectData, function(data, field, list) {
                            // console.log(data);
                            // console.log(field);
                            // console.log(list);
                            formData[field] = {
                                value: (data.type === 'boolean') ? false : null,
                                log: data.log,
                                dataType: data.dataType,
                                type: data.type,
                            };

                            if (data.type === 'function') formData[field].expression = data.expression;
                            if (data.type === 'function') formData[field].expressionItems = data.expressionItems;
                            if (data.type === 'inequality') formData[field].leftExpressionItems = data.leftExpressionItems;
                            if (data.type === 'inequality') formData[field].rightExpressionItems = data.rightExpressionItems;
                            if (data.type === 'inequality') formData[field].inequalitySignId = data.inequalitySignId;
                            if (data.type === 'inequality') formData[field].leftExpression = data.leftExpression;
                            if (data.type === 'inequality') formData[field].rightExpression = data.rightExpression;
                            if (data.type === 'inequality') formData[field].inequalitySign = data.inequalitySign;

                            if (data.type === 'number' || data.type === 'function') formData[field].expressionsUsedIn = data.expressionsUsedIn;
                            if (data.type === 'inequality' || data.type === 'function') formData[field].fieldsUsed = data.fieldsUsed;
                        });

                        deferred.resolve({
                            formData: formData,
                            referenceObject: object,
                        });
                        deferred.reject(new Error('Error initializing form data for ' + objectType));
                    } else {
                        getDefaultObject(assetType).then(function(result) {
                            // console.log(result);
                            deferred.resolve({
                                formData: result.data,
                                referenceObject: result,
                            });
                            deferred.reject(new Error('Error initializing form data for ' + objectType));
                        });   
                    }
                } else {
                    getDefaultObject(assetType).then(function(result) {
                        // console.log(result);
                        deferred.resolve({
                            formData: result.data,
                            referenceObject: result,
                        });
                        deferred.reject(new Error('Error initializing form data for ' + objectType));
                    });
                }
            });
            
            // deferred.reject(new Error('Error initializing form data for ' + objectType));
            return deferred.promise;
        };
    });