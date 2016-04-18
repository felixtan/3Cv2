"use strict";

let helpers = require("../../helpers/e2e/helpers.js"),
    elems = require("../../helpers/e2e/elems.js");

describe("Car Data", function () {

    beforeEach(function() {
        browser.get('http://localhost:3000/#/dashboard/cars');
    });

    it("should link to profile from list/dashboard", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            browser.wait(elems.EC.elementToBeClickable(elems.addField), 3000);
            browser.wait(elems.EC.elementToBeClickable(elems.assignDriver), 3000);
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
        helpers.getRandomCarProfileLink().click().then(function() {
            expect(elems.header.isDisplayed()).toBe(true);
            expect(elems.tabs.count()).toBe(2);
            expect(elems.addField.isDisplayed()).toBe(true);
            expect(elems.fieldRows.count()).toBe(7);
            expect(elems.assignDriver.isDisplayed()).toBe(true);
        });
    });

    it("should open the add field modal", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            elems.addField.click().then(function() {
                expect(helpers.getFieldTypeRadios().count()).toBe(5);
                expect(elems.name.isDisplayed()).toBe(true);
                expect(elems.submit.isDisplayed()).toBe(true);
                expect(elems.submit.isEnabled()).toBe(false);
            });
        });
    });

    it("should not allow repeated field names", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("mileage").click().then(function() {
                elems.name.clear().sendKeys("description").then(function() {
                    expect(elems.existingFieldMsg.isDisplayed()).toBe(true);
                    expect(elems.submit.isEnabled()).toBe(false);
                });
            });
        });
    });

    // success of this tests requires db restart
    it("should edit a boolean field", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("ready").click().then(function() {
                elems.name.clear().sendKeys("foo").then(function() {
                    elems.switches.get(0).click().then(function() {
                        elems.switches.get(2).click().then(function() {
                            elems.submit.click().then(function() {
                                expect(helpers.getFieldColText("foo")).toBe("foo");
                                expect(helpers.getValueColText("foo")).toEqual("false");
                                // expect(getLogColValue("foo")).toEqual(true);      // wasn't changed
                                expect(helpers.getIdColValue('foo')).toEqual(true);
                                expect(elems.header.getText()).toBe("false");
                            });
                        });
                    });
                });
            });
        });
    });

    it("should edit a number field", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("mileage").click().then(function() {
                elems.name.clear().sendKeys("bar").then(function() {
                    elems.value.clear().sendKeys("bar").then(function() {
                        expect(elems.submit.isEnabled()).toBe(false);
                        expect(elems.errorMsg.isDisplayed()).toBe(true);
                        elems.value.clear().sendKeys("300000").then(function() {
                            elems.switches.get(1).click().then(function() {
                                elems.submit.click().then(function() {
                                    expect(helpers.getFieldColText("bar")).toBe("bar");
                                    expect(helpers.getValueColText("bar")).toEqual("300000");
                                    // expect(getLogColValue("foo")).toEqual(true);      // wasn't changed
                                    expect(helpers.getIdColValue("bar")).toEqual(true);
                                    expect(elems.header.getText()).toBe("300000");
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it("should edit a text field", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("description").click().then(function() {
                elems.name.clear().sendKeys("baz").then(function() {
                    elems.value.clear().sendKeys("baz").then(function() {
                        elems.switches.get(1).click().then(function() {
                            elems.submit.click().then(function() {
                                expect(helpers.getFieldColText("baz")).toBe("baz");
                                expect(helpers.getValueColText("baz")).toEqual("baz");
                                // expect(getLogColValue("foo")).toEqual(true);      // wasn't changed
                                expect(helpers.getIdColValue("baz")).toEqual(true);
                                expect(elems.header.getText()).toBe("baz");
                            });
                        });
                    });
                });
            });
        });
    });

    it("should edit an inequality field", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("ineq").click().then(function() {
                elems.name.clear().sendKeys("test_inequality").then(function() {
                    elems.switches.get(1).click().then(function() {       // identifier switch
                        elems.switches.get(2).click().then(function() {   // inequality switch
                            elems.undo.click().then(function() {
                                elems.constant.sendKeys("25000").then(function() {
                                    elems.addConst.click().then(function() {
                                        elems.sign.click().then(function() {
                                            elems.lt.click().then(function() {
                                                elems.submit.click().then(function() {
                                                    expect(helpers.getFieldColText("test_inequality")).toBe("test_inequality");
                                                    // expect(helpers.getValueColText("test_inequality")).toEqual("false");
                                                    // expect(getLogColValue("test_inequality")).toEqual(true);      // wasn't changed
                                                    expect(helpers.getIdColValue("test_inequality")).toEqual(true);
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
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("fn").click().then(function() {
                elems.name.clear().sendKeys("func").then(function() {
                    elems.switches.get(1).click().then(function() {       // identifier switch
                        elems.plus.click().then(function() {
                            elems.constant.sendKeys("25000").then(function() {
                                elems.addConst.click().then(function() {
                                    elems.submit.click().then(function() {
                                        expect(helpers.getFieldColText("func")).toBe("func");
                                        // expect(helpers.getValueColText("func")).toEqual("1527067.5");
                                        // expect(getLogColValue("test_inequality")).toEqual(true);      // wasn't changed
                                        expect(helpers.getIdColValue("func")).toEqual(true);
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

    it("should delete a field", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("baz").click().then(function() {
                elems.delBtn.click().then(function() {
                    elems.delInput.sendKeys("DELETE").then(function() {
                        elems.delBtnFinal.click().then(function() {
                            expect(elems.fieldRows.count()).toBe(6);
                        });
                    });
                });
            });
        });
    });

    it("should add a field to object's logs", function() {
        helpers.getRandomCarProfileLink().click().then(function() {
            helpers.getEditBtnByField("func").click().then(function() {
                elems.switches.get(0).click().then(function() {       // log switch
                    elems.submit.click().then(function() {
                        element.all(by.tagName("a")).filter(function(el, i){
                            return el.getAttribute("data-tabName").then(function(value) {
                                return value === "Logs"; 
                            });
                        }).click().then(function() {
                            element.all(by.tagName("span")).filter(function(el, i) {
                                return el.getAttribute("data-fieldentry").then(function(value) {
                                    return value === "func";
                                });
                            }).count().then(function(numberOfLogEntries) {
                                expect(numberOfLogEntries).toBe(2);
                            });
                        });
                    });
                });
            });
        });
    });
});