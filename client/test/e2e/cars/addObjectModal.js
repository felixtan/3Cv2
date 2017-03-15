"use strict";

function getInequalitySwitch (fieldName) {
      return element.all(by.className("boostrap-switch")).filter(function(el, index) {
            return el.getAttribute("id").then(function(id) {
                  return id === fieldName;
            });
      });
}

function getCarProfileLinks () {
      return element.all(by.tagName("a")).filter(function(el, i) {
            return el.getAttribute("ui-sref").then(function(value) {
                  return value === "carProfile.data({ id: car.id })";
            });
      });
}

function selectIdentifier (fieldName) {
      return element.all(by.options("field for field in fields")).filter(function(el, i) {
            return el.getText().then(function(text) {
                  return text === fieldName;
            });
      });
}

function randomIdentifierOpt () {
      let opts = element.all(by.options("field for field in fields"));
      return opts.count().then(function(count) {
            let random = Math.floor(Math.random() * count);
            return opts.get(random);
      });
}

describe('Add Object Modal:', function() {
  let addBtn = element(by.buttonText('+ Car')),
      EC = protractor.ExpectedConditions,
      errorMsg = element(by.id("add-object-error-msg")),

      simpleCars = element.all(by.repeater("car in simpleCars")),

      //
      // add object modal UI elements
      //////////////////////////////////////////////////////////////////////////////

      // headers
      modalHeader = element(by.className("modal-title")),
      expressionHeader = element(by.id("expression-header")),

      // buttons
      addField = element(by.buttonText('+ Field')),
      submit = element(by.buttonText("Submit")),
      reset = element(by.buttonText("Reset")),
      close = element(by.buttonText("Close")),

      // inputs
      fieldInputs = element.all(by.model("formData[field].value")),
      identifierSelect = element(by.model("identifier.value")),
      expressions = element.all(by.repeater("expression in expressions")),
      identifierOpts = element.all(by.options("field for field in fields")),

      //
      // object data UI elements
      //////////////////////////////////////////////////////////////////////////////
      fieldValues = element.all(by.tagName("span")).filter(function(el, index) {
            return el.getAttribute("e-name").then(function(value) {
                  return value === 'value';
            });
      });

      beforeEach(function() {
            browser.get('http://localhost:3000/#/dashboard/cars');
      });

      it("should open when add car button is clicked", function() {
            addBtn.click().then(function() {
                  browser.wait(EC.elementToBeClickable(addField), 3000);
                  browser.wait(EC.elementToBeClickable(submit), 3000);
                  browser.wait(EC.elementToBeClickable(reset), 3000);
                  browser.wait(EC.elementToBeClickable(close), 3000);
                  expect(modalHeader.getText()).toBe("Add car");
                  expect(identifierSelect.isDisplayed()).toBe(true);

                  fieldInputs.count().then(function(count) {
                        for(let i = 0; i < count; ++i) {
                              let field = fieldInputs.get(i);
                              field.getAttribute("name").then(function(name) {
                                    // console.log(name);
                                    field.getAttribute("data-fieldType").then(function(type) {
                                          // console.log(type, "in line 47 test");
                                          if(type === 'boolean') {
                                                // console.log(name + ' line 32 test if');
                                                expect(field.isPresent()).toBe(true);
                                          } else {
                                                // console.log(name + ' line 32 test else');
                                                expect(field.isDisplayed()).toBe(true);
                                          }
                                    });
                              });
                        }
                  });
                  
                  expressions.count().then(function(count) {
                        if(count > 0) {
                              expect(expressionHeader.isDisplayed()).toBe(true);
                        } else {
                              expect(expressionHeader.isDisplayed()).toBe(false);
                        }
                  });
            });
      });

      
      it("should allow selection of fields for identifier", function() {
            addBtn.click().then(function() {
                  identifierSelect.click().then(function() {
                        identifierOpts.count().then(function(count) {
                              for(let i = 0; i < count; ++i) {
                                    let opt = identifierOpts.get(i);
                                    opt.click().then(function() {
                                          opt.getText().then(function(field) {
                                                expect(identifierSelect.getAttribute("value")).toBe("string:" + field);
                                          });
                                    });
                              }
                        });
                  });
            });
      });

      it("should input field values", function() {
            addBtn.click().then(function() {
                  fieldInputs.count().then(function(count) {
                        for(let i = 0; i < count; ++i) {
                              let field = fieldInputs.get(i);
                              field.getAttribute("data-dataType").then(function(type) { 
                                    field.getAttribute("id").then(function(fieldName) {
                                          // console.log(fieldName);
                                          if(type !== 'boolean') {
                                                field.sendKeys("foo bar !@#$%^&*()_+=-").then(function() {
                                                      field.getAttribute("value").then(function(value) {
                                                            expect(value).toBe("foo bar !@#$%^&*()_+=-");
                                                      });
                                                });
                                          } else {
                                                getInequalitySwitch(fieldName).click().then(function() {
                                                      field.getAttribute("value").then(function(value) {
                                                            // console.log(fieldName);
                                                            // console.log(value);
                                                            let onOrOff = value === 'on' || value === 'off';
                                                            expect(onOrOff).toBe(true);
                                                      });
                                                });
                                          }
                                    });
                              });
                        }
                  });
            });
      });

      it("should show error and disable submit if input to number field is invalid", function() {
            addBtn.click().then(function() {
                  fieldInputs.filter(function(el, index) {
                        return el.getAttribute("data-fieldType").then(function(fieldType) {
                              return fieldType === 'number';
                        });
                  }).first().sendKeys("foo").then(function() {
                        // for cars this should be mileage
                        expect(submit.isEnabled()).toBe(false);
                        expect(errorMsg.isDisplayed()).toBe(true);
                  });
            });
      });

      it("should display new car on list after submission", function() {
            simpleCars.count().then(function(numberOfCarsBefore) {
                  addBtn.click().then(function() {
                        // identifierSelect.click().then(function() {
                              // randomIdentifierOpt().click().then(function() {
                                    fieldInputs.count().then(function(count) {
                                          for(let i = 0; i < count; ++i) {
                                                let fieldInput = fieldInputs.get(i);
                                                fieldInput.getAttribute("data-dataType").then(function(dataType) {
                                                      let fields = [];
                                                      fieldInput.getAttribute("id").then(function(fieldName) {
                                                            if(dataType === 'text') {
                                                                  fieldInput.sendKeys("foo");
                                                                  fields.push({ 
                                                                        fieldName: fieldName,
                                                                        dataType: dataType,
                                                                        value: 'foo',
                                                                  });
                                                            } else if(dataType === 'number') {
                                                                  fieldInput.sendKeys("123");
                                                                  fields.push({ 
                                                                        fieldName: fieldName,
                                                                        dataType: dataType,
                                                                        value: '123',
                                                                  });
                                                            } else if(dataType === 'boolean') {
                                                                  getInequalitySwitch(fieldName).click();
                                                                  fields.push({ 
                                                                        fieldName: fieldName,
                                                                        dataType: dataType,
                                                                        value: false,
                                                                  });
                                                            }
                                                            // console.log(i);
                                                            // console.log(count);
                                                            if(i === count-1) {
                                                                  // console.log('it gets to the if after count is finished');
                                                                  submit.click().then(function() {
                                                                        simpleCars.count().then(function(numberOfCarsAfter) {
                                                                              expect(numberOfCarsAfter).toBe(numberOfCarsBefore+1);
                                                                              getCarProfileLinks().last().click().then(function() {
                                                                                    fieldValues.count().then(function(numberOfFields) {
                                                                                          // don't count expression fields so use count instead of numberOfFields
                                                                                          for(let j = 0; j < count; ++j) {
                                                                                                // console.log('checking new car', j);
                                                                                                let fieldValue = fieldValues.get(j);
                                                                                                fieldValue.getText().then(function(text) {
                                                                                                      fieldValue.getAttribute("data-dataType").then(function(dataType) {
                                                                                                            if(dataType === 'text') {
                                                                                                                  expect(text).toBe("foo");
                                                                                                            } else if(dataType === 'number') {
                                                                                                                  expect(text).toBe("123");
                                                                                                            } else if(dataType === 'boolean') {
                                                                                                                  expect(text).toBe('false');
                                                                                                                  // only reason it's false is because formData is loaded with first car's data and ready=true for the first car
                                                                                                            }
                                                                                                      });
                                                                                                });
                                                                                          }
                                                                                    });
                                                                              });
                                                                        });
                                                                  });
                                                            }
                                                      });
                                                });
                                          }
                                    });
                              // });
                        // });
                  });
            });
      });
});