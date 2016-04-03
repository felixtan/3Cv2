"use strict";

function getFieldTypeRadio (fieldType) {
  return element.all(by.tagName("input")).filter(function(el, i) {
    return el.getAttribute("type").then(function(inputType) {
      return el.getAttribute("id").then(function(id) {
        return inputType === 'radio' && id === fieldType;
      })
    });
  });
}

describe('Add Field Modal:', function() {
  let addBtn = element(by.buttonText('+ Car')),
      addField = element(by.buttonText('+ Field')),

      //
      // add field modal UI elements
      //////////////////////////////////////////////////////////////////////////////
      
      // field types
      textRadio = getFieldTypeRadio('text'),
      numberRadio = getFieldTypeRadio('number'),
      booleanRadio = getFieldTypeRadio('boolean'),
      functionRadio = getFieldTypeRadio('function'),
      inequalityRadio = getFieldTypeRadio('inequality'),

      nameInput = element(by.model("field.name")),
      constInput = element(by.model("expressionConstantInput.value")),
      fieldSelect = element(by.model("expressionFieldSelect.value")),
      addConst = element(by.id("add-const")),
      functionExpr = element(by.exactBinding("field.expression")),
      inequalitySwitch = element.all(by.className("bootstrap-switch")),
      inequalityLHS = element(by.exactBinding("field.leftExpression")),
      inequalityRHS = element(by.exactBinding("field.rightExpression")),
      inequalitySign = element(by.exactBinding("field.inequalitySign")),
      inequalitySignSelect = element(by.model("field.inequalitySignId")),

      // inequality sign dropdown
      inequalitySignOpts = element.all(by.className("inequality-sign-opt")),
      gt = inequalitySignOpts.get(0),
      ge = inequalitySignOpts.get(1),
      lt = inequalitySignOpts.get(2),
      le = inequalitySignOpts.get(3),

      // car fields
      mileage = element(by.model('expressionFieldSelect.value')).$('[value="string:mileage"]'),

      // modal buttons
      submitField = element(by.id("submit-field")),

      submits = element.all(by.buttonText("Submit")),
      resets = element.all(by.buttonText("Reset")),
      closes = element.all(by.buttonText("Close")),

      ///////////////////////////////////////////////////////////////////////////////

      // operators
      plus = element(by.id("add-operator")),
      minus = element(by.id("sub-operator")),
      mult = element(by.id("mult-operator")),
      div = element(by.id("div-operator")),
      openParen = element(by.id("open-parens-operator")),
      closeParen = element(by.id("close-parens-operator")),

      EC = protractor.ExpectedConditions;

  beforeEach(function() {
    browser.get('http://localhost:3000/#/dashboard/cars');
  });

  it("should open", function() {
    addBtn.click().then(function() {
      addField.click().then(function() {
        expect(element(by.id("add-field-header")).isPresent()).toBe(true);
      });
    });
  });

  it("should have three submit, reset, and close buttons", function() {
    addBtn.click().then(function() {
      addField.click().then(function() {
        expect(submits.count()).toBe(2);
        expect(resets.count()).toBe(2);
        expect(closes.count()).toBe(2);
      });
    });
  });

  it("should have menu of radio options for field type and input for field name", function() {
    addBtn.click().then(function() {
      addField.click().then(function() {
        let types = element.all(by.model("field.type"));
        expect(types.count()).toBe(5);
        expect(element(by.model("field.name")).isPresent()).toBe(true);
      });
    });
  });

  it("should submit a text field", function() {
    addBtn.click().then(function() {
      addField.click().then(function() {
        textRadio.click().then(function() {
         
          expect(textRadio.last().isSelected()).toBe(true);

          // function stuff
          expect(constInput.isDisplayed()).not.toBe(true),
          expect(fieldSelect.isDisplayed()).not.toBe(true);

          // modal should NOT close because submission is disabled
          submitField.click().then(function() {
            expect(submitField.isPresent()).toBe(true);  
            expect(element.all(by.model("field.type")).count()).toBe(5);
          });

          nameInput.sendKeys("Foo").then(function() {
            nameInput.getAttribute('value').then(function(value) {
              expect(value).toBe("Foo");
              submitField.click().then(function() {
                // modal should close
                expect(submitField.isPresent()).toBe(false);  
                expect(element.all(by.model("field.type")).count()).toBe(0);
              });
            });
          });
        });
      });
    });
  });

  it("should submit a number field", function() {
    addBtn.click().then(function() {
      addField.click().then(function() {
        numberRadio.click().then(function() {
      
          expect(numberRadio.last().isSelected()).toBe(true); 

          // function stuff
          expect(constInput.isDisplayed()).not.toBe(true),
          expect(fieldSelect.isDisplayed()).not.toBe(true);

          // modal should NOT close because submission is disabled
          submitField.click().then(function() {
            expect(submitField.isPresent()).toBe(true);  
            expect(element.all(by.model("field.type")).count()).toBe(5);
          });

          nameInput.sendKeys("Foo").then(function() {
            nameInput.getAttribute('value').then(function(value) {
              expect(value).toBe("Foo");
              submitField.click().then(function() {
                // modal should close
                expect(submitField.isPresent()).toBe(false);  
                expect(element.all(by.model("field.type")).count()).toBe(0);
              });
            });
          });
        });
      });
    });
  });

  it("should submit a boolean field", function() {
    addBtn.click().then(function() {
      addField.click().then(function() {
        booleanRadio.click().then(function() {
          expect(booleanRadio.last().isSelected()).toBe(true);  

          // function stuff
          expect(constInput.isDisplayed()).not.toBe(true),
          expect(fieldSelect.isDisplayed()).not.toBe(true);

          // modal should NOT close because submission is disabled
          submitField.click().then(function() {
            expect(submitField.isPresent()).toBe(true);  
            expect(element.all(by.model("field.type")).count()).toBe(5);
          });

          nameInput.sendKeys("Foo").then(function() {
            nameInput.getAttribute('value').then(function(value) {
              expect(value).toBe("Foo");
              submitField.click().then(function() {
                // modal should close
                expect(submitField.isPresent()).toBe(false);  
                expect(element.all(by.model("field.type")).count()).toBe(0);
              });
            });
          });
        });
      });
    });
  });

  it("should submit a function field", function() {
    addBtn.click().then(function() {
      let numberOfCars = element.all(by.repeater("car in simpleCars")).count(),
          trueArr = [];

      for(let i = 0; i < numberOfCars; ++i) {
        trueArr.push(true);
      } 

      addField.click().then(function() {
        functionRadio.click().then(function() {
          
          expect(functionRadio.last().isSelected()).toBe(true);
         
          // expression stuff
          expect(constInput.isDisplayed()).toBe(true),
          expect(fieldSelect.isDisplayed()).toBe(true);
          expect(functionExpr.isDisplayed()).toBe(true);
          expect(inequalitySignSelect.isPresent()).toBe(false);       
          // expect(inequalitySwitch.count()).toBe(1);       // only the one from ready field should be present on dom
          expect(inequalitySwitch.last().isPresent()).toBe(true);
          expect(inequalityLHS.isPresent()).toBe(false);
          expect(inequalityRHS.isPresent()).toBe(false);
          expect(inequalitySign.isPresent()).toBe(false);

          // modal should NOT close because submission is disabled
          submitField.click().then(function() {
            expect(submitField.isPresent()).toBe(true);  
            expect(element.all(by.model("field.type")).count()).toBe(5);
          });
         
          nameInput.sendKeys("Foo").then(function() {
            nameInput.getAttribute('value').then(function(value) {
              expect(value).toBe("Foo");

              // form still requires expression
              submitField.click().then(function() {
                expect(submitField.isPresent()).toBe(true);  
                expect(element.all(by.model("field.type")).count()).toBe(5);
              });

              constInput.sendKeys("3.14").then(function() {
                constInput.getAttribute("value").then(function(value) {
                  expect(value).toBe("3.14");

                  addConst.click().then(function() {
                    functionExpr.getText().then(function(value) {
                      expect(functionExpr.isDisplayed()).toBe(true);
                      expect(value).toBe("3.14");


                      plus.click().then(function() {
                        functionExpr.getText().then(function(value) {
                          expect(value).toBe("3.14+");

                          // can't submit due to invalid expression
                          submitField.click().then(function() {
                            expect(submitField.isPresent()).toBe(true);  
                            expect(element.all(by.model("field.type")).count()).toBe(5);
                          });

                          fieldSelect.click().then(function() {
                            mileage.click().then(function() {
                              functionExpr.getText().then(function(value) {
                                expect(value).toBe("3.14+mileage");
                                expect(submitField.isEnabled()).toBe(true);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  it("should submit an inequality field", function() {
    addBtn.click().then(function() {
      addField.click().then(function() {
          inequalityRadio.click().then(function() {
          
            expect(inequalityRadio.last().isSelected()).toBe(true);
           
            // expression stuff
            expect(constInput.isDisplayed()).toBe(true);
            expect(fieldSelect.isDisplayed()).toBe(true);
            expect(functionExpr.isPresent()).toBe(false);
            expect(inequalitySignSelect.isDisplayed()).toBe(true);
            expect(inequalitySwitch.last().isDisplayed()).toEqual(true);
            expect(inequalityLHS.isDisplayed()).toBe(true);
            expect(inequalityRHS.isDisplayed()).toBe(true);
            expect(inequalitySign.isDisplayed()).toBe(true);

            // modal should NOT close because submission is disabled
            submitField.click().then(function() {
              expect(submitField.isDisplayed()).toBe(true);  
              expect(element.all(by.model("field.type")).count()).toBe(5);
            });

            nameInput.sendKeys("Foo").then(function() {
              nameInput.getAttribute('value').then(function(value) {
                expect(value).toBe("Foo");

                // form still requires expression
                submitField.click().then(function() {
                  expect(submitField.isDisplayed()).toBe(true);  
                  expect(element.all(by.model("field.type")).count()).toBe(5);
                });

                constInput.sendKeys("3.14").then(function() {
                  constInput.getAttribute("value").then(function(value) {
                    expect(value).toBe("3.14");

                    addConst.click().then(function() {
                      inequalityLHS.getText().then(function(value) {
                        expect(value).toBe("3.14");


                        plus.click().then(function() {
                          inequalityLHS.getText().then(function(value) {
                            expect(value).toBe("3.14+");

                            // can't submit due to invalid expression
                            submitField.click().then(function() {
                              expect(submitField.isDisplayed()).toBe(true);  
                              expect(element.all(by.model("field.type")).count()).toBe(5);
                            });

                            fieldSelect.click().then(function() {
                              mileage.click().then(function() {
                                inequalityLHS.getText().then(function(value) {
                                  expect(value).toBe("3.14+mileage");

                                  // should be not valid
                                  submitField.click().then(function() {
                                    expect(submitField.isDisplayed()).toBe(true);  
                                    expect(element.all(by.model("field.type")).count()).toBe(5);
                                  });

                                  inequalitySwitch.click().then(function() {
                                    constInput.sendKeys("50000").then(function() {
                                      addConst.click().then(function() {
                                        inequalityRHS.getText().then(function(RHSvalue) {
                                          expect(RHSvalue).toBe("50000");

                                          // should be not valid
                                          submitField.click().then(function() {
                                            expect(submitField.isDisplayed()).toBe(true);  
                                            expect(element.all(by.model("field.type")).count()).toBe(5);
                                          });

                                          inequalitySignSelect.click().then(function() {
                                            gt.click().then(function() {
                                              inequalitySign.getText().then(function(sign) {
                                                expect(sign).toBe(">");

                                                // now it's ok
                                                submitField.click().then(function() {
                                                  expect(submitField.isPresent()).toBe(false);  
                                                  expect(element.all(by.model("field.type")).count()).toBe(0);
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
});