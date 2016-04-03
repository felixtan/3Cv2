"use strict";

function getCarProfileLinks () {
      return element.all(by.tagName("a")).filter(function(el, i) {
            return el.getAttribute("ui-sref").then(function(value) {
                  return value === "carProfile.data({ id: car.id })";
            });
      });
}

function randomCarIndex () {
    let cars = element.all(by.repeater("car in simpleCars"));
    return cars.count().then(function(numberOfCars) {
            return Math.floor(Math.random() * numberOfCars);
    });
}

function getRandomCarProfileLink () {
    return getCarProfileLinks().get(randomCarIndex());
}

function getFieldTypeRadios () {
    return element.all(by.tagName("input")).filter(function(el, i) {
        return el.getAttribute("ng-change").then(function(value) {
            return value === "setDataType(field.type)";
        });
    });
}

function getEditBtnByField (fieldName) {
    return element.all(by.buttonText("Edit")).filter(function(el, i) {
        return el.getAttribute("data-field").then(function(value) {
            return value === fieldName;
        });
    });
}

function randomFieldEdit () {
    let editBtns = element.all(by.buttonText("Edit"));
    return editBtns.count().then(function(numberOfFields) {
        return Math.floor(Math.random() * numberOfFields);
    });
}

function getFieldColText (fieldName) {
    return element.all(by.className("field-name")).filter(function(el, i) {
        return el.getAttribute("data-field").then(function(value) {
            return value === fieldName;
        });
    }).first().getText();
}

function getValueColText (fieldName) {
    return element.all(by.className("field-value")).filter(function(el, i) {
        return el.getAttribute("data-field").then(function(value) {
            return value === fieldName;
        });
    }).first().getText();
}

function getLogColValue (fieldName) {
    return element.all(by.className("log-check")).filter(function(el, i) {
        return el.getAttribute("data-field").then(function(value) {
            return value === fieldName;
        });
    }).first().isPresent();
}

function getIdColValue (fieldName) {
    return element.all(by.className("identifier-check")).filter(function(el, i) {
        return el.getAttribute("data-field").then(function(value) {
            return value === fieldName;
        });
    }).first().isPresent();
}

describe("Data", function () {
    let addField = element(by.buttonText('+ Field')),
        assignDriver = element(by.buttonText("+ Driver")),
        submit = element(by.buttonText("Submit")),
        EC = protractor.ExpectedConditions,
        tabs = element.all(by.tagName("a")).filter(function(el, i) { 
            return el.getAttribute("ng-click").then(function(value) {
                return value === "select()";
            });
        }),

        //
        // car data
        //////////////////////////////////////////////////////////////
        header = element(by.id("identifier")),
        fieldRows = element.all(by.repeater("(field, data) in car.data")),

        //
        // edit field modal
        //////////////////////////////////////////////////////////////
        errorMsg = element(by.id("number-field-error-msg")),
        existingFieldMsg = element(by.id("field-name-exists-msg")),
        name = element(by.model("field.name")),
        value = element(by.model("field.value")),
        log = element(by.model('field.log')),
        identifier = element(by.model("field.identifier")),

        constant = element(by.model("expressionConstantInput.value")),
        addConst = element(by.id("add-const")),
        sign = element(by.model("field.inequalitySignId")),

        // inequality sign dropdown
        inequalitySignOpts = element.all(by.className("inequality-sign-opt")),
        gt = inequalitySignOpts.get(0),
        ge = inequalitySignOpts.get(1),
        lt = inequalitySignOpts.get(2),
        le = inequalitySignOpts.get(3),

        undo = element(by.buttonText("Undo")),
        deleteField = element(by.buttonText("DELETE")),
        // submit = element(by.buttonText("Submit")),
        reset = element(by.buttonText("Reset")),
        close = element(by.buttonText("Close")),

        plus = element(by.id("add-operator")),

        // only boolean has valueSwitch
        switches = element.all(by.className("bootstrap-switch"));

    beforeEach(function() {
        browser.get('http://localhost:3000/#/dashboard/cars');
    });

    it("should link to profile from list/dashboard", function() {
        getRandomCarProfileLink().click().then(function() {
            browser.wait(EC.elementToBeClickable(addField), 3000);
            browser.wait(EC.elementToBeClickable(assignDriver), 3000);
        });
    });

    it("should display car data", function() {
        /*
            Elements
            1. Identifier as header
            2. Data and Logs tabs
            3. + Field button
            4. field table
            5. + Driver button
            6. driver assignment table
        */
        getRandomCarProfileLink().click().then(function() {
            expect(header.isDisplayed()).toBe(true);
            expect(tabs.count()).toBe(2);
            expect(addField.isDisplayed()).toBe(true);
            expect(fieldRows.count()).toBe(7);
            expect(assignDriver.isDisplayed()).toBe(true);
        });
    });

    it("should open the add field modal", function() {
        getRandomCarProfileLink().click().then(function() {
            addField.click().then(function() {
                expect(getFieldTypeRadios().count()).toBe(5);
                expect(element(by.name("field")).isDisplayed()).toBe(true);
                expect(submit.isDisplayed()).toBe(true);
                expect(submit.isEnabled()).toBe(false);
            });
        });
    });

    it("should not allow repeated field names", function() {
        getRandomCarProfileLink().click().then(function() {
            getEditBtnByField("mileage").click().then(function() {
                name.clear().sendKeys("description").then(function() {
                    expect(existingFieldMsg.isDisplayed()).toBe(true);
                    expect(submit.isEnabled()).toBe(false);
                });
            });
        });
    });

    // success of this tests requires db restart
    it("should edit a boolean field", function() {
        getRandomCarProfileLink().click().then(function() {
            getEditBtnByField("ready").click().then(function() {
                name.clear().sendKeys("foo").then(function() {
                    switches.get(0).click().then(function() {
                        switches.get(2).click().then(function() {
                            submit.click().then(function() {
                                expect(getFieldColText("foo")).toBe("foo");
                                expect(getValueColText("foo")).toEqual("false");
                                // expect(getLogColValue("foo")).toEqual(true);      // wasn't changed
                                expect(getIdColValue('foo')).toEqual(true);
                                expect(header.getText()).toBe("false");
                            });
                        });
                    });
                });
            });
        });
    });

    it("should edit a number field", function() {
        getRandomCarProfileLink().click().then(function() {
            getEditBtnByField("mileage").click().then(function() {
                name.clear().sendKeys("bar").then(function() {
                    value.clear().sendKeys("bar").then(function() {
                        expect(submit.isEnabled()).toBe(false);
                        expect(errorMsg.isDisplayed()).toBe(true);
                        value.clear().sendKeys("3003135").then(function() {
                            switches.get(1).click().then(function() {
                                submit.click().then(function() {
                                    expect(getFieldColText("bar")).toBe("bar");
                                    expect(getValueColText("bar")).toEqual("3003135");
                                    // expect(getLogColValue("foo")).toEqual(true);      // wasn't changed
                                    expect(getIdColValue("bar")).toEqual(true);
                                    expect(header.getText()).toBe("3003135");
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("should edit a text field", function() {
        getRandomCarProfileLink().click().then(function() {
            getEditBtnByField("description").click().then(function() {
                name.clear().sendKeys("baz").then(function() {
                    value.clear().sendKeys("baz").then(function() {
                        switches.get(1).click().then(function() {
                            submit.click().then(function() {
                                expect(getFieldColText("baz")).toBe("baz");
                                expect(getValueColText("baz")).toEqual("baz");
                                // expect(getLogColValue("foo")).toEqual(true);      // wasn't changed
                                expect(getIdColValue("baz")).toEqual(true);
                                expect(header.getText()).toBe("baz");
                            });
                        });
                    });
                });
            });
        });
    });

    it("should edit an inequality field", function() {
        getRandomCarProfileLink().click().then(function() {
            getEditBtnByField("ineq").click().then(function() {
                name.clear().sendKeys("test_inequality").then(function() {
                    switches.get(1).click().then(function() {       // identifier switch
                        switches.get(2).click().then(function() {   // inequality switch
                            undo.click().then(function() {
                                constant.sendKeys("25000").then(function() {
                                    addConst.click().then(function() {
                                        sign.click().then(function() {
                                            lt.click().then(function() {
                                                submit.click().then(function() {
                                                    expect(getFieldColText("test_inequality")).toBe("test_inequality");
                                                    // expect(getValueColText("test_inequality")).toEqual("false");
                                                    // expect(getLogColValue("test_inequality")).toEqual(true);      // wasn't changed
                                                    expect(getIdColValue("test_inequality")).toEqual(true);
                                                    // expect(header.getText()).toBe("false");
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

    it("should edit an function field", function() {
        getRandomCarProfileLink().click().then(function() {
            getEditBtnByField("fn").click().then(function() {
                name.clear().sendKeys("func").then(function() {
                    switches.get(1).click().then(function() {       // identifier switch
                        plus.click().then(function() {
                            constant.sendKeys("25000").then(function() {
                                addConst.click().then(function() {
                                    submit.click().then(function() {
                                        expect(getFieldColText("func")).toBe("func");
                                        // expect(getValueColText("func")).toEqual("1527067.5");
                                        // expect(getLogColValue("test_inequality")).toEqual(true);      // wasn't changed
                                        expect(getIdColValue("func")).toEqual(true);
                                        // expect(header.getText()).toBe("1527067.5");
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