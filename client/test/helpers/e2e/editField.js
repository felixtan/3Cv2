"use strict";

let errorMsg,
    existingFieldMsg,
    name,
    value,
    log,
    identifier,
    constant,
    addConst,
    sign,
    inequalitySignOpts,
    gt,
    ge,
    lt,
    le,
    undo,
    deleteField,
    reset,
    close,
    plus,
    switches,
    submit,
    EC,
    tabs,
    addField,
    assignDriver,
    header,
    fieldRows,
    delBtn,
    delBtnFinal,
    delInput;

errorMsg = element(by.id("number-field-error-msg"));
existingFieldMsg = element(by.id("field-name-exists-msg"));
name = element(by.model("field.name"));
value = element(by.model("field.value"));
log = element(by.model('field.log'));
identifier = element(by.model("field.identifier"));

constant = element(by.model("expressionConstantInput.value"));
addConst = element(by.id("add-const"));
sign = element(by.model("field.inequalitySignId"));

// inequality sign dropdown
inequalitySignOpts = element.all(by.className("inequality-sign-opt"));
gt = inequalitySignOpts.get(0);
ge = inequalitySignOpts.get(1);
lt = inequalitySignOpts.get(2);
le = inequalitySignOpts.get(3);

undo = element(by.buttonText("Undo"));
deleteField = element(by.buttonText("DELETE"));
reset = element(by.buttonText("Reset"));
close = element(by.buttonText("Close"));

plus = element(by.id("add-operator"));

// only boolean has valueSwitch
switches = element.all(by.className("bootstrap-switch"));

addField = element(by.buttonText('+ Field'));
assignDriver = element(by.buttonText("+ Driver"));
submit = element(by.buttonText("Submit"));
EC = protractor.ExpectedConditions;
tabs = element.all(by.tagName("a")).filter(function(el, i) { 
    return el.getAttribute("ng-click").then(function(value) {
        return value === "select()";
    });
});

header = element(by.id("identifier"));
fieldRows = element.all(by.repeater("(field, data) in object.data"));

delBtn = element(by.buttonText("DELETE"));

// delete modal
delBtnFinal = element(by.id("delete-btn-final"));
delInput = element(by.id("delete-confirmation"));

module.exports = {
    errorMsg,
    existingFieldMsg,
    name,
    value,
    log,
    identifier,
    constant,
    addConst,
    sign,
    inequalitySignOpts,
    gt,
    ge,
    lt,
    le,
    undo,
    deleteField,
    reset,
    close,
    plus,
    switches,
    submit,
    EC,
    tabs,
    addField,
    assignDriver,
    header,
    fieldRows,
    delBtn,
    delInput,
    delBtnFinal,
 }