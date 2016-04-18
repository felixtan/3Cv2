"use strict";

module.exports = {
    getCarProfileLinks,
    randomCarIndex,
    getRandomCarProfileLink,
    getFieldTypeRadios,
    getEditBtnByField,
    randomFieldEdit,
    getFieldColText,
    getValueColText,
    getLogColValue,
    getIdColValue,
    getFieldLabel,
    getFieldInput,
};

let elems = require("./elems.js");

// add object modal
function getFieldLabel (fieldName) {
    return elems.fieldLabels.filter(function(el, i) {
        return el.getAttribute("for").then(function(value) {
            return value === fieldName;
        });
    }).first();
};

function getFieldInput (fieldName) {
    return elems.fieldInputs.filter(function(el, i) {
        return el.getAttribute("id").then(function(value) {
            return value === fieldName;
        });
    }).first();
};

function getCarProfileLinks () {
      return element.all(by.tagName("a")).filter(function(el, i) {
            return el.getAttribute("ui-sref").then(function(value) {
                  return value === "carData({ id: object.id })";
            });
      });
};

function randomCarIndex () {
    let cars = element.all(by.repeater("car in simpleCars"));
    return cars.count().then(function(numberOfCars) {
            return Math.floor(Math.random() * numberOfCars);
    });
};

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