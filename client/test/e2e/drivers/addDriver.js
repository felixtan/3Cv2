"use strict";

let helpers = require("../../helpers/e2e/helpers.js"),
    elems = require("../../helpers/e2e/elems.js");

describe('Add Driver UI:', function() {

  beforeEach(function() {  
    browser.get('http://localhost:3000/#/dashboard/drivers');
    elems.addDriver.click();
  });

  it('should open the add object modal', function() {
    browser.wait(elems.EC.elementToBeClickable(elems.addDriver), 3000);
    browser.wait(elems.EC.elementToBeClickable(elems.addField), 3000);
    browser.wait(elems.EC.elementToBeClickable(elems.reset), 3000);
    browser.wait(elems.EC.elementToBeClickable(elems.close), 3000);
    browser.wait(elems.EC.elementToBeClickable(elems.submitObject), 3000);

    expect(element(by.className("modal-title")).getText()).toBe("Add driver");
    expect(elems.addField.isDisplayed()).toBe(true);
    expect(element(by.id("fields-header")).isDisplayed()).toBe(false);
    expect(elems.reset.isDisplayed()).toBe(true);
    expect(elems.close.isDisplayed()).toBe(true);
    expect(elems.submitObject.isDisplayed()).toBe(true);

    // field stuff
    expect(elems.fieldLabels.count()).toBe(2);
    expect(elems.fieldInputs.count()).toBe(2);
    expect(helpers.getFieldLabel("First Name").isDisplayed()).toBe(true);
    expect(helpers.getFieldInput("First Name").isDisplayed()).toBe(true);
    expect(helpers.getFieldLabel("Last Name").isDisplayed()).toBe(true);
    expect(helpers.getFieldInput("Last Name").isDisplayed()).toBe(true);
  }); 

  describe("Add field:", function() {
    beforeEach(function() {
      elems.addField.click();
    });

    it("should open", function() {
      expect(helpers.getFieldTypeRadios().count()).toBe(5);          
      expect(elems.name.isDisplayed()).toBe(true);
      expect(elems.submitField.isDisplayed()).toBe(true);
      expect(elems.submitField.isEnabled()).toBe(false);
    });

    it("should add text field", function() {
      helpers.getFieldTypeRadios().get(0).click().then(function() {
        elems.name.sendKeys("foo").then(function() {
          elems.submitField.click().then(function() {   // enter add object modal
            expect(elems.fieldLabels.count()).toBe(3);
            expect(elems.fieldInputs.count()).toBe(3);
            
            expect(helpers.getFieldLabel("First Name").isDisplayed()).toBe(true);
            expect(helpers.getFieldInput("First Name").isDisplayed()).toBe(true);
            
            expect(helpers.getFieldLabel("Last Name").isDisplayed()).toBe(true);
            expect(helpers.getFieldInput("Last Name").isDisplayed()).toBe(true);
            
            expect(helpers.getFieldLabel("foo").isDisplayed()).toBe(true);
            expect(helpers.getFieldInput("foo").isDisplayed()).toBe(true);
          });
        });
      });
    });

    it("should add number field", function() {
      helpers.getFieldTypeRadios().get(1).click().then(function() {
        elems.name.sendKeys("num").then(function() {
          elems.submitField.click().then(function() {
            expect(elems.fieldLabels.count()).toBe(3);
            expect(elems.fieldInputs.count()).toBe(3);
            
            expect(helpers.getFieldLabel("First Name").isDisplayed()).toBe(true);
            expect(helpers.getFieldInput("First Name").isDisplayed()).toBe(true);
            
            expect(helpers.getFieldLabel("Last Name").isDisplayed()).toBe(true);
            expect(helpers.getFieldInput("Last Name").isDisplayed()).toBe(true);
            
            // expect(helpers.getFieldLabel("foo").isDisplayed()).toBe(true);
            // expect(helpers.getFieldInput("foo").isDisplayed()).toBe(true);

            expect(helpers.getFieldLabel("num").isDisplayed()).toBe(true);
            expect(helpers.getFieldInput("num").isDisplayed()).toBe(true);
          });
        });
      });
    });


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

  //   it("should submit a function field", function() {
  //     addBtn.click().then(function() {
  //       addField.click().then(function() {
  //         functionRadio.click().then(function() {
            
  //           expect(functionRadio.isSelected()).toBe(true);
           
  //           // function stuff
  //           expect(constInput.isDisplayed()).toBe(true),
  //           expect(fieldSelect.isDisplayed()).toBe(true);

  //           // modal should NOT close because submission is disabled
  //           submitField.click().then(function() {
  //             expect(submitField.isPresent()).toBe(true);  
  //             expect(element.all(by.model("field.type")).count()).toBe(5);
  //           });
           
  //           nameInput.sendKeys("Foo").then(function() {
  //             nameInput.getAttribute('value').then(function(value) {
  //               expect(value).toBe("Foo");

  //               // form still requires expression
  //               submitField.click().then(function() {
  //                 expect(submitField.isPresent()).toBe(true);  
  //                 expect(element.all(by.model("field.type")).count()).toBe(5);
  //               });

  //               constInput.sendKeys("3.14").then(function() {
  //                 constInput.getAttribute("value").then(function(value) {
  //                   expect(value).toBe("3.14");

  //                   addConst.click().then(function() {
  //                     functionExpr.getText().then(function(value) {
  //                       expect(functionExpr.isDisplayed()).toBe(true);
  //                       expect(value).toBe("3.14");

  //                       plus.click().then(function() {
  //                         functionExpr.getText().then(function(value) {
  //                           expect(value).toBe("3.14+");

  //                           // can't submit due to invalid expression
  //                           submitField.click().then(function() {
  //                             expect(submitField.isPresent()).toBe(true);  
  //                             expect(element.all(by.model("field.type")).count()).toBe(5);
  //                           });
  //                         });
  //                       });
  //                     });
  //                   });
  //                 });
  //               });
  //             });
  //           });
  //         });
  //       });
  //     });
  //   });
  });
});