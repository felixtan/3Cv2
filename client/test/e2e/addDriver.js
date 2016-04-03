"use strict";

describe('Add Driver UI:', function() {
  let addBtn = element(by.buttonText('+ Driver')),
      addField = element(by.buttonText('+ Field')),
      constInput = element(by.model("expressionConstantInput.value")),
      fieldSelect = element(by.model("expressionFieldSelect.value")),
      addConst = element(by.id("add-const")),
      functionExpr = element(by.exactBinding("field.expression")),
      inequalityLHS = element(by.exactBinding("field.leftExpression")),
      inequalityRHS = element(by.exactBinding("field.rightExpression")),
      inequalitySign = element(by.exactBinding("field.inequalitySign")),

      // operators
      plus = element(by.buttonText("+")),
      minus = element(by.buttonText("-")),
      mult = element(by.buttonText("*")),
      div = element(by.buttonText("/")),
      openParen = element(by.buttonText("(")),
      closeParen = element(by.buttonText(")")),

      functionRadio = element.all(by.model("field.type")).get(3),
      nameInput = element(by.model("field.name")),
      submitField = element(by.id("submit-field")),

      EC = protractor.ExpectedConditions;

  beforeEach(function() {
    browser.get('http://localhost:3000/#/dashboard/drivers');
  });

  // it('button to add object modal should exist and be clickable', function() {
  //   addBtn.isPresent().then(function(present) {
  //     expect(present).toBe(true);
  //     browser.wait(EC.elementToBeClickable(addBtn), 100);
  //   });
  // });

  // describe("Add object modal:", function() {
  //   it("should open and have add field button", function() {
  //     addBtn.click().then(function() {
  //       addField.isPresent().then(function(present) {
  //         expect(present).toBe(true);
  //         browser.wait(EC.elementToBeClickable(addField), 100);
  //       });
  //     });
  //   });

  //   it("should have First Name and Last Name inputs", function() {
  //     addBtn.click().then(function() {
  //       expect(element(by.name("First Name")).getTagName()).toBe("input");
  //       expect(element(by.name("Last Name")).getTagName()).toBe("input");
  //     });
  //   });

  //   it("should have three submit, reset, and close buttons", function() {
  //     addBtn.click().then(function() {
  //       let submit = element(by.buttonText("Submit")),
  //           reset = element(by.buttonText("Reset")),
  //           close = element(by.buttonText("Close"));

  //       submit.isPresent().then(function(present) {
  //         expect(present).toBe(true);
  //         browser.wait(EC.elementToBeClickable(submit), 100);
  //       });

  //       reset.isPresent().then(function(present) {
  //         expect(present).toBe(true);
  //         browser.wait(EC.elementToBeClickable(reset), 100);
  //       });

  //       close.isPresent().then(function(present) {
  //         expect(present).toBe(true);
  //         browser.wait(EC.elementToBeClickable(close), 100);
  //       });
  //     });
  //   });
  // });

  describe("Add field modal:", function() {
    // it("should open", function() {
    //   addBtn.click().then(function() {
    //     addField.click().then(function() {
    //       expect(element(by.id("add-field-header")).isPresent()).toBe(true);
    //     });
    //   });
    // });

    // it("should have three submit, reset, and close buttons", function() {
    //   addBtn.click().then(function() {
    //     addField.click().then(function() {
    //       let submits = element.all(by.buttonText("Submit")),
    //           resets = element.all(by.buttonText("Reset")),
    //           closes = element.all(by.buttonText("Close"));

    //       expect(submits.count()).toBe(2);
    //       expect(resets.count()).toBe(2);
    //       expect(closes.count()).toBe(2);
    //     });
    //   });
    // });

    // it("should have menu of radio options for field type and input for field name", function() {
    //   addBtn.click().then(function() {
    //     addField.click().then(function() {
    //       let types = element.all(by.model("field.type"));
    //       expect(types.count()).toBe(5);
    //       expect(element(by.model("field.name")).isPresent()).toBe(true);
    //     });
    //   });
    // });

    // it("should submit a text field", function() {
    //   addBtn.click().then(function() {
    //     addField.click().then(function() {
    //       let textRadio = element.all(by.model("field.type")).get(0),
    //           nameInput = element(by.model("field.name")),
    //           submitField = element(by.id("submit-add-field"));
          
    //       textRadio.click().then(function() {
           
    //         expect(textRadio.isSelected()).toBe(true);

    //         // function stuff
    //         expect(constInput.isDisplayed()).not.toBe(true),
    //         expect(fieldSelect.isDisplayed()).not.toBe(true);

    //         // modal should NOT close because submission is disabled
    //         submitField.click().then(function() {
    //           expect(submitField.isPresent()).toBe(true);  
    //           expect(element.all(by.model("field.type")).count()).toBe(5);
    //         });

    //         nameInput.sendKeys("Foo").then(function() {
    //           nameInput.getAttribute('value').then(function(value) {
    //             expect(value).toBe("Foo");
    //             submitField.click().then(function() {
    //               // modal should close
    //               expect(submitField.isPresent()).toBe(false);  
    //               expect(element.all(by.model("field.type")).count()).toBe(0);
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // });

    // it("should submit a number field", function() {
    //   addBtn.click().then(function() {
    //     addField.click().then(function() {
    //       let numberRadio = element.all(by.model("field.type")).get(1),
    //           nameInput = element(by.model("field.name")),
    //           submitField = element(by.id("submit-add-field"));
          
    //       numberRadio.click().then(function() {
        
    //         expect(numberRadio.isSelected()).toBe(true); 

    //         // function stuff
    //         expect(constInput.isDisplayed()).not.toBe(true),
    //         expect(fieldSelect.isDisplayed()).not.toBe(true);

    //         // modal should NOT close because submission is disabled
    //         submitField.click().then(function() {
    //           expect(submitField.isPresent()).toBe(true);  
    //           expect(element.all(by.model("field.type")).count()).toBe(5);
    //         });

    //         nameInput.sendKeys("Foo").then(function() {
    //           nameInput.getAttribute('value').then(function(value) {
    //             expect(value).toBe("Foo");
    //             submitField.click().then(function() {
    //               // modal should close
    //               expect(submitField.isPresent()).toBe(false);  
    //               expect(element.all(by.model("field.type")).count()).toBe(0);
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // });

    // it("should submit a boolean field", function() {
    //   addBtn.click().then(function() {
    //     addField.click().then(function() {
    //       let booleanRadio = element.all(by.model("field.type")).get(2),
    //           nameInput = element(by.model("field.name")),
    //           submitField = element(by.id("submit-add-field"));
          
    //       booleanRadio.click().then(function() {
    //         expect(booleanRadio.isSelected()).toBe(true);  

    //         // function stuff
    //         expect(constInput.isDisplayed()).not.toBe(true),
    //         expect(fieldSelect.isDisplayed()).not.toBe(true);

    //         // modal should NOT close because submission is disabled
    //         submitField.click().then(function() {
    //           expect(submitField.isPresent()).toBe(true);  
    //           expect(element.all(by.model("field.type")).count()).toBe(5);
    //         });

    //         nameInput.sendKeys("Foo").then(function() {
    //           nameInput.getAttribute('value').then(function(value) {
    //             expect(value).toBe("Foo");
    //             submitField.click().then(function() {
    //               // modal should close
    //               expect(submitField.isPresent()).toBe(false);  
    //               expect(element.all(by.model("field.type")).count()).toBe(0);
    //             });
    //           });
    //         });
    //       });
    //     });
    //   });
    // });

    it("should submit a function field", function() {
      addBtn.click().then(function() {
        addField.click().then(function() {
          functionRadio.click().then(function() {
            
            expect(functionRadio.isSelected()).toBe(true);
           
            // function stuff
            expect(constInput.isDisplayed()).toBe(true),
            expect(fieldSelect.isDisplayed()).toBe(true);

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